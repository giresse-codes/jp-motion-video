"""Génère la voix off de la vitrine ET son minutage mot par mot.

Piper synthétise phrase par phrase : la durée exacte de chaque phrase est donc connue.
À l'intérieur d'une phrase, chaque mot reçoit une part proportionnelle à son nombre
de phonèmes. Résultat :
  assets/voiceoff.mp3      voix normalisée (-16 LUFS)
  assets/voix-timing.json  [{ "texte", "debut", "fin" }] par mot, en secondes
                           + "phrases" avec les bornes exactes de chaque phrase
  js/voix-timing.js        le même minutage, chargé par index.html (window.VOIX)

Usage (depuis vitrine/) : python3 scripts/voix-calee.py [texte.md]
Réglages : VITESSE (défaut 0.9), PAUSE (défaut 0.3 s entre phrases).
"""
import json, os, re, subprocess, sys, wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

ICI = Path(__file__).resolve().parent.parent
RACINE = ICI.parent
TEXTE = Path(sys.argv[1]) if len(sys.argv) > 1 else RACINE / "docs" / "voix-off.md"
MODELE = RACINE / "voix" / "fr_FR-siwis-medium.onnx"
VITESSE = float(os.environ.get("VITESSE", "0.9"))
PAUSE = float(os.environ.get("PAUSE", "0.3"))

lignes = [l.strip() for l in TEXTE.read_text(encoding="utf-8").splitlines()]
texte = " ".join(l for l in lignes if l and not l.startswith("#"))

voix = PiperVoice.load(str(MODELE))
config = SynthesisConfig(length_scale=VITESSE)
sr = voix.config.sample_rate

audio, mots, phrases, t = [], [], [], 0.0
silence = np.zeros(int(sr * PAUSE), dtype=np.int16)

# Piper découpe lui-même en phrases (un AudioChunk par phrase).
for morceau in voix.synthesize(texte, config):
    son = morceau.audio_int16_array
    duree = len(son) / sr
    # Phonèmes regroupés en mots (les espaces séparent les mots).
    groupes = "".join(morceau.phonemes).split(" ")
    groupes = [g for g in groupes if g.strip(".,;:!?")]
    phrases.append({"debut": round(t, 3), "fin": round(t + duree, 3), "phonemes": len(groupes)})
    poids = [max(1, len(re.sub(r"[ˈˌː.,;:!?]", "", g))) for g in groupes]
    total = sum(poids)
    # Marge de début/fin de phrase (silence intégré par le modèle) : ~4 % de chaque côté.
    utile0, utile1 = t + duree * 0.04, t + duree * 0.96
    c = utile0
    for p in poids:
        d = (utile1 - utile0) * p / total
        mots.append({"debut": round(c, 3), "fin": round(c + d, 3)})
        c += d
    audio += [son, silence]
    t += duree + PAUSE

# Associe les mots écrits aux groupes de phonèmes (même ordre ; nombres déjà écrits en lettres).
# Certains mots sont prononcés en deux groupes (« WhatsApp » → « wots ap ») : on les fusionne.
MOTS_EN_DEUX = {"WhatsApp"}
ecrits = re.findall(r"[\wÀ-ÿ'’\-+]+", texte)
fusion, i = [], 0
for e in ecrits:
    if i >= len(mots):
        break
    if e in MOTS_EN_DEUX and i + 1 < len(mots):
        fusion.append({"texte": e, "debut": mots[i]["debut"], "fin": mots[i + 1]["fin"]})
        i += 2
    else:
        fusion.append({"texte": e, **mots[i]})
        i += 1
if len(fusion) != len(ecrits) or i != len(mots):
    sys.exit(f"Alignement impossible : {len(ecrits)} mots écrits, {len(mots)} groupes de phonèmes.")
mots = fusion

wav = ICI / "assets" / "voiceoff.wav"
with wave.open(str(wav), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(np.concatenate(audio).tobytes())
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1",
                "-c:a", "libmp3lame", "-b:a", "192k", str(ICI / "assets" / "voiceoff.mp3")], check=True)
wav.unlink()

(ICI / "assets" / "voix-timing.json").write_text(
    json.dumps({"duree": round(t - PAUSE, 3), "phrases": phrases, "mots": mots}, ensure_ascii=False, indent=1) + "\n",
    encoding="utf-8")
# Même minutage en JS, chargé par la composition (pas de lecture réseau au rendu).
donnees = json.loads((ICI / "assets" / "voix-timing.json").read_text(encoding="utf-8"))
(ICI / "js" / "voix-timing.js").write_text(
    "// Généré par scripts/voix-calee.py — ne pas modifier à la main.\n"
    f"window.VOIX = {json.dumps(donnees, ensure_ascii=False)};\n", encoding="utf-8")
for p in phrases:
    print(f"{p['debut']:6.2f}–{p['fin']:6.2f}")
print(f"Durée totale : {t - PAUSE:.2f} s, {len(mots)} mots")
