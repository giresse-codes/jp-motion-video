"""Voix off prête à mixer : pauses réglées, niveau -14 LUFS, aucun autre traitement.

Entrées : sources/voix-elevenlabs.wav (voix ElevenLabs « Raphael », déjà propre) et
sources/timing-elevenlabs.json (aligner-voix.py). Autre prise :
  python3 scripts/preparer-voix.py <voix.wav> <timing.json>
Sorties :
  assets/voiceoff.mp3          voix 48 kHz, pauses réglées, -14 LUFS, crête vraie < -1 dBTP (mixée par mixer.py)
  assets/voix-timing.json      minutage mot par mot recalé sur cette voix
  js/voix-timing.js            le même, chargé par la composition (window.VOIX)

Pas de réduction de bruit ni d'égalisation. Les pauses trop longues sont raccourcies au milieu
(courts fondus, la parole n'est jamais touchée) ; les pauses expressives trop courtes
(avant « Soyons honnêtes », avant et après « Ils méritent un chauffeur ») sont allongées par du silence.
Niveau : compression douce 2:1 et limiteur à -2 dB (marge pour l'encodage MP3), sans saturation.
Usage (depuis pub-chauffeur/) : python3 scripts/preparer-voix.py
"""
import json, subprocess, sys, tempfile
from pathlib import Path

import numpy as np

ICI = Path(__file__).resolve().parent.parent
SR = 48000
DEBUT = 0.35  # avant « Il est dix-huit heures » : le texte est déjà à l'écran

BRUT = Path(sys.argv[1]) if len(sys.argv) > 2 else ICI / "sources" / "voix-elevenlabs.wav"
TIMING = Path(sys.argv[2]) if len(sys.argv) > 2 else ICI / "sources" / "timing-elevenlabs.json"
donnees = json.loads(TIMING.read_text(encoding="utf-8"))
mots = donnees["mots"]

# Pause maximale avant un mot (par défaut 0,45 s).
PAUSE_MAX = {"Les": 0.6, "Et": 0.6, "Votre": 0.6, "Soyons": 0.9, "Certains": 0.8, "Ils": 0.8,
             "JP": 0.6, "Rapide.": 0.6, "Sûr.": 0.6, "Confortable": 0.6}
# Pause minimale aux endroits expressifs (index du mot -> secondes).
pause_min = {}
for i, m in enumerate(mots):
    precedent = mots[i - 1]["texte"] if i else ""
    if m["texte"] == "Soyons":
        pause_min[i] = 0.7    # tout s'arrête net : vrai silence avant la bascule
    elif m["texte"] == "Certains":
        pause_min[i] = 0.45   # « Soyons honnêtes… » : points de suspension
    elif m["texte"] == "ne" and precedent == "déplacements…":
        pause_min[i] = 0.3    # « Certains déplacements… ne peuvent pas attendre »
    elif m["texte"] == "Ils":
        pause_min[i] = 0.6    # écran noir avant « Ils méritent un chauffeur »
    elif m["texte"] == "Un" and precedent == "chauffeur.":
        pause_min[i] = 0.8    # la réverbe de l'impact s'éteint dans le noir

def pause_max(i):
    if mots[i]["texte"] == "Votre" and mots[i - 1]["texte"] == "suffit.":
        return 0.45
    return PAUSE_MAX.get(mots[i]["texte"], 0.45)

pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(BRUT), "-ac", "1", "-ar", str(SR),
                      "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, dtype=np.float32).copy()

# Morceaux : ("audio", début, fin) ou ("silence", durée).
# decalages : (temps d'origine, nouveau temps - temps d'origine) à partir de cet instant.
debut0 = max(0.0, mots[0]["debut"] - DEBUT)
morceaux, decalages, curseur, decal = [], [(0.0, -debut0)], debut0, -debut0
for i in range(1, len(mots)):
    a, b = mots[i - 1]["fin"], mots[i]["debut"]
    pause, maxi, mini = b - a, pause_max(i), pause_min.get(i, 0.0)
    if pause > maxi + 0.02:
        coupe0, coupe1 = a + maxi / 2, b - maxi / 2
        morceaux.append(("audio", curseur, coupe0))
        decal -= coupe1 - coupe0
        decalages.append((coupe1, decal))
        curseur = coupe1
    elif pause < mini - 0.02:
        milieu, ajout = (a + b) / 2, mini - pause
        morceaux += [("audio", curseur, milieu), ("silence", ajout)]
        decal += ajout
        decalages.append((milieu, decal))
        curseur = milieu
morceaux.append(("audio", curseur, min(len(x) / SR, mots[-1]["fin"] + 0.6)))

FONDU = int(0.008 * SR)
parts = []
for m in morceaux:
    if m[0] == "silence":
        parts.append(np.zeros(int(m[1] * SR), dtype=np.float32))
        continue
    s = x[int(m[1] * SR):int(m[2] * SR)].copy()
    s[:FONDU] *= np.linspace(0, 1, FONDU)
    s[-FONDU:] *= np.linspace(1, 0, FONDU)
    parts.append(s)
voix = np.concatenate(parts)

def nouveau_temps(t):
    d = 0.0
    for t0, v in decalages:
        if t >= t0:
            d = v
    return round(t + d, 3)

for m in mots:
    m["debut"], m["fin"] = nouveau_temps(m["debut"]), nouveau_temps(m["fin"])

def lufs(chemin):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(chemin), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(r.rsplit("I:", 1)[1].split("LUFS")[0])

with tempfile.TemporaryDirectory() as tmp:
    brute = Path(tmp) / "voix.f32"
    voix.astype(np.float32).tofile(brute)
    entree = ["-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(brute)]
    essai = Path(tmp) / "essai.wav"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *entree, str(essai)], check=True)
    gain = -14 - lufs(essai)
    cible = Path(tmp) / "voix-14.wav"
    for _ in range(6):  # le limiteur mange un peu de niveau : on corrige le gain
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *entree, "-af",
                        f"acompressor=threshold=0.08:ratio=2:attack=8:release=150,volume={gain:.2f}dB,"
                        "alimiter=limit=0.79:attack=2:release=60:level=false", str(cible)], check=True)
        ecart = -14 - lufs(cible)
        if abs(ecart) < 0.15:
            break
        gain += ecart
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(cible), "-ar", str(SR),
                    "-c:a", "libmp3lame", "-b:a", "320k", str(ICI / "assets" / "voiceoff.mp3")], check=True)

sortie = {"duree": round(len(voix) / SR, 3), "source": f"{BRUT.name}, pauses réglées",
          "methode": donnees["methode"], "mots": mots}
(ICI / "assets" / "voix-timing.json").write_text(json.dumps(sortie, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
(ICI / "js" / "voix-timing.js").write_text(
    "// Généré par scripts/preparer-voix.py — ne pas modifier à la main.\n"
    f"window.VOIX = {json.dumps(sortie, ensure_ascii=False)};\n", encoding="utf-8")
print(f"Voix : {len(x) / SR:.2f} s -> {len(voix) / SR:.2f} s -> assets/voiceoff.mp3")
