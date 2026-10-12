"""Minutage mot par mot d'une voix off quelconque, sans transcription ni réseau.

Principe : on dispose d'une prise de référence du MÊME texte dont les temps des mots sont
connus (assets/reference/voix-piper.mp3 + voix-piper-timing.json, produits par voix-calee.py).
On aligne les deux enregistrements par DTW sur leurs MFCC (déformation temporelle dynamique) :
chaque instant de la référence trouve son équivalent dans la nouvelle voix. Les débuts de mots
sont ensuite recalés sur l'attaque sonore la plus proche (±120 ms).

Usage (depuis vitrine/) : python3 scripts/aligner-voix.py [assets/voiceoff.mp3]
Écrit assets/voix-timing.json et js/voix-timing.js (window.VOIX).
"""
import json, sys
from pathlib import Path

import librosa
import numpy as np

ICI = Path(__file__).resolve().parent.parent
CIBLE = Path(sys.argv[1]) if len(sys.argv) > 1 else ICI / "assets" / "voiceoff.mp3"
REF_AUDIO = ICI / "assets" / "reference" / "voix-piper.mp3"
REF_TEMPS = ICI / "assets" / "reference" / "voix-piper-timing.json"
SR, HOP = 22050, 220  # 10 ms par trame

def traits(chemin):
    y, _ = librosa.load(chemin, sr=SR, mono=True)
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=1024)
    m = (m - m.mean(axis=1, keepdims=True)) / (m.std(axis=1, keepdims=True) + 1e-6)
    d = librosa.feature.delta(m)
    return y, np.vstack([m, d])

y_ref, f_ref = traits(REF_AUDIO)
y_cib, f_cib = traits(CIBLE)
_, chemin = librosa.sequence.dtw(X=f_ref, Y=f_cib, metric="cosine", subseq=False)
chemin = chemin[::-1]

# Correspondance trame référence -> trame cible (médiane si plusieurs).
corr = {}
for i, j in chemin:
    corr.setdefault(i, []).append(j)
def vers_cible(t):
    i = min(max(int(round(t * SR / HOP)), 0), f_ref.shape[1] - 1)
    while i not in corr and i > 0:
        i -= 1
    return float(np.median(corr[i])) * HOP / SR

# Attaques sonores de la cible pour recaler les débuts de mots.
attaques = librosa.onset.onset_detect(y=y_cib, sr=SR, hop_length=HOP, units="time", backtrack=True)

ref = json.loads(REF_TEMPS.read_text(encoding="utf-8"))
mots = []
for m in ref["mots"]:
    debut, fin = vers_cible(m["debut"]), vers_cible(m["fin"])
    proche = attaques[np.argmin(np.abs(attaques - debut))] if len(attaques) else debut
    if abs(proche - debut) <= 0.12:
        debut = float(proche)
    mots.append({"texte": m["texte"], "debut": round(debut, 3), "fin": round(max(fin, debut + 0.08), 3)})
# Débuts strictement croissants.
for a, b in zip(mots, mots[1:]):
    if b["debut"] <= a["debut"]:
        b["debut"] = round(a["debut"] + 0.05, 3)
phrases = [{"debut": round(vers_cible(p["debut"]), 3), "fin": round(vers_cible(p["fin"]), 3)} for p in ref["phrases"]]
duree = round(len(y_cib) / SR, 3)
donnees = {"duree": duree, "source": CIBLE.name, "methode": "dtw-mfcc sur prise de référence Piper", "phrases": phrases, "mots": mots}
(ICI / "assets" / "voix-timing.json").write_text(json.dumps(donnees, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
(ICI / "js" / "voix-timing.js").write_text(
    "// Généré par scripts/aligner-voix.py — ne pas modifier à la main.\n"
    f"window.VOIX = {json.dumps(donnees, ensure_ascii=False)};\n", encoding="utf-8")
for p in phrases:
    print(f"{p['debut']:6.2f}–{p['fin']:6.2f}")
print(f"Durée {duree} s, {len(mots)} mots")
