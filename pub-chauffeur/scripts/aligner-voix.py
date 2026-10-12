"""Minutage mot par mot de la voix off, sans transcription ni réseau.

1. Piper lit le même texte (scripts/voix-texte.txt) en exposant ses alignements phonème/échantillon :
   on connaît donc exactement le début et la fin de chaque mot dans cette prise de référence.
2. On aligne la référence sur la vraie voix par DTW sur les MFCC (déformation temporelle dynamique).
3. Chaque mot est recalé : jamais dans un silence de la vraie voix, et son début sur l'attaque la
   plus proche (±100 ms).

Usage (depuis pub-chauffeur/) : python3 scripts/aligner-voix.py <voix.wav> <sortie.json>
Prérequis : pip install piper-tts onnx librosa ; modèle ../voix/fr_FR-siwis-medium.onnx
"""
import json, re, subprocess, sys
from pathlib import Path

import librosa
import numpy as np
from piper import PiperVoice, SynthesisConfig

ICI = Path(__file__).resolve().parent.parent
MODELE = ICI.parent / "voix" / "fr_FR-siwis-medium.onnx"
CIBLE, SORTIE = Path(sys.argv[1]), Path(sys.argv[2])
SR, HOP = 22050, 220  # trames de 10 ms
PAUSE_REF = 0.35

lignes = [l.strip() for l in (ICI / "scripts" / "voix-texte.txt").read_text(encoding="utf-8").splitlines()]
lignes = [l for l in lignes if l and not l.startswith("#")]

# ── 1. Prise de référence Piper avec temps exacts des mots ──
voix = PiperVoice.load(str(MODELE), include_alignments=True)
sr_p = voix.config.sample_rate
audio, groupes, t = [], [], 0.0
for ligne in lignes:
    # Les points de suspension marquent une pause : pour Piper, ce sont des fins de phrase.
    for ch in voix.synthesize(ligne.replace("…", "."), SynthesisConfig(length_scale=1.0), include_alignments=True):
        pos = t
        courant = None
        for a in ch.phoneme_alignments:
            d = a.num_samples / sr_p
            lettre = a.phoneme
            if lettre in (" ", "^", "$") or lettre in ".,;:!?…":
                if courant:
                    groupes.append(courant)
                    courant = None
            else:
                if courant is None:
                    courant = {"debut": pos, "fin": pos + d, "phonemes": lettre}
                else:
                    courant["fin"] = pos + d
                    courant["phonemes"] += lettre
            pos += d
        if courant:
            groupes.append(courant)
        audio.append(ch.audio_float_array)
        audio.append(np.zeros(int(sr_p * PAUSE_REF), dtype=np.float32))
        t += len(ch.audio_float_array) / sr_p + PAUSE_REF
ref = np.concatenate(audio)

# Mots écrits, dans l'ordre (les mots avec trait d'union ou apostrophe restent entiers).
ecrits = re.findall(r"[\wÀ-ÿ'’\-]+[.,;:!?…]*", " ".join(lignes))
# Piper peut lire un mot écrit en deux groupes (« rendez-vous » → « ʁɑ̃de vu ») : on fusionne
# en suivant les traits d'union quand les comptes diffèrent.
if len(groupes) != len(ecrits):
    fusion, i = [], 0
    for mot in ecrits:
        n = 1 + mot.count("-") if len(groupes) - i > len(ecrits) - len(fusion) - 1 else 1
        g = groupes[i:i + n]
        fusion.append({"debut": g[0]["debut"], "fin": g[-1]["fin"], "phonemes": "".join(x["phonemes"] for x in g)})
        i += n
    groupes = fusion
assert len(groupes) == len(ecrits), (len(groupes), len(ecrits), [g["phonemes"] for g in groupes])

# ── 2. DTW référence → vraie voix ──
def traits(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=1024)
    m = (m - m.mean(axis=1, keepdims=True)) / (m.std(axis=1, keepdims=True) + 1e-6)
    return np.vstack([m, librosa.feature.delta(m)])

y_ref = librosa.resample(ref, orig_sr=sr_p, target_sr=SR)
y_cib, _ = librosa.load(CIBLE, sr=SR, mono=True)
_, chemin = librosa.sequence.dtw(X=traits(y_ref), Y=traits(y_cib), metric="cosine")
corr = {}
for i, j in chemin[::-1]:
    corr.setdefault(i, []).append(j)
def vers_cible(tt):
    i = min(max(int(round(tt * SR / HOP)), 0), max(corr))
    while i not in corr and i > 0:
        i -= 1
    return float(np.median(corr[i])) * HOP / SR

# ── 3. Recalage sur les silences et les attaques de la vraie voix ──
sortie = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(CIBLE), "-af", "silencedetect=noise=-40dB:d=0.2",
                         "-f", "null", "-"], capture_output=True, text=True).stderr
silences = list(zip(map(float, re.findall(r"silence_start: ([\d.]+)", sortie)),
                    map(float, re.findall(r"silence_end: ([\d.]+)", sortie))))
attaques = librosa.onset.onset_detect(y=y_cib, sr=SR, hop_length=HOP, units="time", backtrack=True)

def hors_silence(tt, vers_la_fin):
    for a, b in silences:
        if a < tt < b:
            return b if vers_la_fin else a
    return tt

mots = []
for mot, g in zip(ecrits, groupes):
    debut, fin = vers_cible(g["debut"]), vers_cible(g["fin"])
    if len(attaques):
        proche = attaques[np.argmin(np.abs(attaques - debut))]
        if abs(proche - debut) <= 0.10:
            debut = float(proche)
    debut = hors_silence(debut, True)
    fin = hors_silence(fin, False)
    mots.append({"texte": mot, "debut": round(debut, 3), "fin": round(max(fin, debut + 0.08), 3)})
# Corrections vérifiées à la mesure (voisement, hauteur) là où la DTW hésite :
# (mot, occurrence) -> (début, fin) ; None garde la valeur calculée.
CORRECTIONS = {
    ("Ils", 1): (14.58, 14.82),        # « Ils » isolé, voisé, avant une pause
    ("méritent", 1): (15.11, None),
    ("suffit.", 1): (18.55, 19.56),     # « suffit » traîne jusqu'à 19,56 s (fin grave)
}
vus = {}
for m in mots:
    vus[m["texte"]] = vus.get(m["texte"], 0) + 1
    c = CORRECTIONS.get((m["texte"], vus[m["texte"]]))
    if c:
        if c[0] is not None:
            m["debut"] = c[0]
        if c[1] is not None:
            m["fin"] = c[1]
for a, b in zip(mots, mots[1:]):
    b["debut"] = max(b["debut"], round(a["debut"] + 0.04, 3))
    a["fin"] = min(a["fin"], b["debut"]) if a["fin"] > b["debut"] else a["fin"]

donnees = {"source": CIBLE.name, "duree": round(len(y_cib) / SR, 3),
           "methode": "DTW-MFCC sur prise Piper alignée (phonèmes)", "silences": silences, "mots": mots}
SORTIE.write_text(json.dumps(donnees, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
for m in mots:
    print(f"{m['debut']:6.2f} {m['fin']:6.2f}  {m['texte']}")
