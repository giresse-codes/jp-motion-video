"""Sons d'une vidéo JP Papier, en pistes séparées (la voix reste sa propre piste) :
- assets/audio/nappe.wav : nappe musicale douce sur toute la durée (baissée sous la voix par le carve
  de /hyperframes-audio : `npm run carve`, qui écrit data-fx-chain / data-automation sur la piste « nappe »).
- assets/audio/sfx.wav : effets feutrés placés selon window.T.sfx = [[temps, "nom", gain_dB], ...].
Noms : tictac (une seconde de tic-tac), clic, portiere, klaxon, crayon, souffle, notif, succes, ouvrir.
Tout est synthétisé ici sauf notif/succes/ouvrir (uisfx, CC0). Usage (depuis le projet) : python3 scripts/sons.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(42)
db = lambda v: 10 ** (v / 20)
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
N = int(T["duree"] * SR)

def norm(y):
    return y / (np.abs(y).max() + 1e-9)

def ecrire(chemin, st, crete=0.5):
    st = st / (np.abs(st).max() + 1e-9) * crete
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st.T, -1, 1) * 32767).astype(np.int16).tobytes())

def lire(chemin):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(chemin), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32).copy()

def poser(dest, son, t, g=0.0, pan=0.0):
    i = int(t * SR); n = min(len(son), N - i)
    if n > 0:
        dest[0, i:i + n] += son[:n] * db(g) * np.cos((pan + 1) * np.pi / 4) * 1.414
        dest[1, i:i + n] += son[:n] * db(g) * np.sin((pan + 1) * np.pi / 4) * 1.414

def tt(d):
    return np.arange(int(d * SR)) / SR

def bande(y, f0, f1):
    b, a = signal.butter(2, [f0 / (SR / 2), f1 / (SR / 2)], "band"); return signal.lfilter(b, a, y)

def tic(f):
    t = tt(0.03); return norm(np.sin(2 * np.pi * f * t) * np.exp(-t * 260))

SONS = {
    "tictac": lambda: sum(np.pad(tic(2600 if k % 2 else 2100), (int(k * 0.5 * SR), SR))[:SR] for k in range(2)),
    "clic": lambda: norm(np.sin(2 * np.pi * 1900 * tt(0.05)) * np.exp(-tt(0.05) * 220)),
    "portiere": lambda: norm(np.sin(2 * np.pi * 1500 * tt(0.35)) * np.exp(-tt(0.35) * 180) + 0.5 * rng.standard_normal(int(0.35 * SR)) * np.exp(-tt(0.35) * 90)
                             + 0.5 * np.sin(2 * np.pi * 90 * tt(0.35)) * np.exp(-tt(0.35) * 18)),
    "klaxon": lambda: norm(bande(sum(signal.sawtooth(2 * np.pi * f * tt(0.35), 0.5) for f in (415, 523)), 400, 2000) * np.clip(tt(0.35) / 0.02, 0, 1) * np.clip((0.35 - tt(0.35)) / 0.05, 0, 1)),
    "crayon": lambda: norm(bande(rng.standard_normal(int(0.3 * SR)), 2500, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * tt(0.3))) * np.sin(np.pi * tt(0.3) / 0.3)),
    "souffle": lambda: norm(bande(rng.standard_normal(int(0.6 * SR)), 200, 1600) * np.sin(np.pi * tt(0.6) / 0.6) ** 2),
    "notif": lambda: lire(ICI / "assets" / "sfx" / "ui-press.wav"),
    "succes": lambda: lire(ICI / "assets" / "sfx" / "ui-success.wav"),
    "ouvrir": lambda: lire(ICI / "assets" / "sfx" / "ui-open.wav"),
}

# Nappe : accords lents et doux (la mineur 9 -> fa maj 7 -> sol -> mi m), légère respiration.
nappe = np.zeros((2, N))
accords = [(110, 164.8, 220, 261.6, 329.6), (87.3, 130.8, 174.6, 220, 261.6), (98, 146.8, 196, 246.9, 293.7), (82.4, 123.5, 164.8, 207.7, 246.9)]
for i in range(int(T["duree"] / 4) + 1):
    t = tt(4.8)
    y = sum(np.sin(2 * np.pi * f * t + k) * (0.7 if f < 200 else 0.3) for k, f in enumerate(accords[i % 4]))
    y *= (0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t)) * np.clip(t / 0.8, 0, 1) * np.clip((4.8 - t) / 0.8, 0, 1)
    poser(nappe, norm(y), i * 4.0, 0, -0.2 if i % 2 else 0.2)
nappe[:, -int(0.5 * SR):] *= np.linspace(1, 0, int(0.5 * SR))
ecrire(ICI / "assets" / "audio" / "nappe.wav", nappe, 0.35)

sfx = np.zeros((2, N))
for t, nom, g in T.get("sfx", []):
    poser(sfx, SONS[nom](), t, g)
ecrire(ICI / "assets" / "audio" / "sfx.wav", sfx, 0.5)
print(f"nappe.wav + sfx.wav : {T['duree']} s, {len(T.get('sfx', []))} effets")
