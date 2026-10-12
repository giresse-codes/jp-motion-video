"""Voix off prête à mixer : silences trop longs raccourcis, aucun autre traitement.

Entrées : sources/voix-brute.wav (Voicebooking) et sources/timing-brut.json (aligner-voix.py).
Sorties :
  assets/audio/voix.wav        voix 48 kHz mono, pauses resserrées (niveau d'origine, pour le mixage)
  assets/audio/voix-14lufs.wav la même normalisée à -14 LUFS (écoute seule)
  assets/voix-timing.json      minutage mot par mot recalé sur la voix resserrée
  js/voix-timing.js            le même, chargé par la composition (window.VOIX)

La voix est déjà propre : ni réduction de bruit ni égalisation. On coupe au milieu de chaque
pause, avec de courts fondus, pour ne jamais toucher la parole.
Usage (depuis pub-chauffeur/) : python3 scripts/preparer-voix.py
"""
import json, subprocess, wave
from pathlib import Path

import numpy as np

ICI = Path(__file__).resolve().parent.parent
SR = 48000
DEBUT = 0.35  # avant « Il est dix-huit heures » : le texte est déjà à l'écran

donnees = json.loads((ICI / "sources" / "timing-brut.json").read_text(encoding="utf-8"))
mots = donnees["mots"]

# Pause maximale avant un mot donné (texte du mot -> secondes). Par défaut 0,45 s.
PAUSE_MAX = {
    "Les": 0.6, "Et": 0.6, "Votre": 0.6,      # le besoin : phrases courtes, rythme haché
    "Soyons": 0.6,                             # tout s'arrête net avant la bascule
    "Certains": 0.8,                           # « Soyons honnêtes… » : points de suspension
    "Ils": 0.55,
    "Un": 0.45, "JP": 0.6,
    "Rapide.": 0.55, "Sûr.": 0.55, "Confortable": 0.55,
}
# Exceptions par position (même mot à plusieurs endroits).
PAUSE_PAR_INDEX = {}
for i, m in enumerate(mots):
    if m["texte"] == "Un" and i > 0 and mots[i - 1]["texte"] == "chauffeur.":
        PAUSE_PAR_INDEX[i] = 0.8  # après « Ils méritent un chauffeur » : la réverb s'éteint dans le noir
    if m["texte"] == "Votre" and mots[i - 1]["texte"] == "suffit.":
        PAUSE_PAR_INDEX[i] = 0.45

brut = ICI / "sources" / "voix-brute.wav"
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(brut), "-ac", "1", "-ar", str(SR),
                      "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, dtype=np.float32).copy()

# Segments gardés : on raccourcit chaque pause au milieu.
garder, retire = [], []  # retire : (temps d'origine, durée retirée cumulée après ce point)
curseur, cumul = max(0.0, mots[0]["debut"] - DEBUT), max(0.0, mots[0]["debut"] - DEBUT)
retire.append((curseur, cumul))
for i in range(1, len(mots)):
    a, b = mots[i - 1]["fin"], mots[i]["debut"]
    pause = b - a
    maxi = PAUSE_PAR_INDEX.get(i, PAUSE_MAX.get(mots[i]["texte"], 0.45))
    if pause > maxi + 0.02:
        milieu = (a + b) / 2
        c0, c1 = milieu - maxi / 2, milieu + maxi / 2  # bornes conservées autour du milieu
        coupe0, coupe1 = a + maxi / 2, b - maxi / 2
        garder.append((curseur, coupe0))
        cumul += coupe1 - coupe0
        retire.append((coupe1, cumul))
        curseur = coupe1
fin = min(len(x) / SR, mots[-1]["fin"] + 0.6)
garder.append((curseur, fin))

FONDU = int(0.008 * SR)
morceaux = []
for a, b in garder:
    s = x[int(a * SR):int(b * SR)].copy()
    s[:FONDU] *= np.linspace(0, 1, FONDU)
    s[-FONDU:] *= np.linspace(1, 0, FONDU)
    morceaux.append(s)
voix = np.concatenate(morceaux)

def nouveau_temps(t):
    decal = 0.0
    for t0, c in retire:
        if t >= t0:
            decal = c
    return round(t - decal, 3)

for m in mots:
    m["debut"], m["fin"] = nouveau_temps(m["debut"]), nouveau_temps(m["fin"])

def ecrire(chemin, y):
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())

(ICI / "assets" / "audio").mkdir(parents=True, exist_ok=True)
ecrire(ICI / "assets" / "audio" / "voix.wav", voix)
# -14 LUFS : gain calculé sur la mesure, puis limiteur doux pour les quelques crêtes.
def lufs(chemin):
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(chemin), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(m.rsplit("I:", 1)[1].split("LUFS")[0])

source, cible = ICI / "assets" / "audio" / "voix.wav", ICI / "assets" / "audio" / "voix-14lufs.wav"
gain = -14 - lufs(source)
for _ in range(6):  # le limiteur mange un peu de niveau : on corrige le gain
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(source), "-af",
                    f"acompressor=threshold=0.05:ratio=2.5:attack=8:release=150,volume={gain:.2f}dB,alimiter=limit=0.89:attack=2:release=60:level=false",
                    "-ar", str(SR), str(cible)], check=True)
    ecart = -14 - lufs(cible)
    if abs(ecart) < 0.15:
        break
    gain += ecart

sortie = {"duree": round(len(voix) / SR, 3), "source": "voix-brute.wav (Voicebooking), pauses resserrées",
          "methode": donnees["methode"], "mots": mots}
(ICI / "assets" / "voix-timing.json").write_text(json.dumps(sortie, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
(ICI / "js").mkdir(exist_ok=True)
(ICI / "js" / "voix-timing.js").write_text(
    "// Généré par scripts/preparer-voix.py — ne pas modifier à la main.\n"
    f"window.VOIX = {json.dumps(sortie, ensure_ascii=False)};\n", encoding="utf-8")
print(f"Voix : {len(x) / SR:.2f} s -> {len(voix) / SR:.2f} s ({len(garder) - 1} pauses raccourcies)")
