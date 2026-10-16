"""Bande-son de « Plus maintenant » (sans voix off ni musique de tiers) : tout est synthétisé ici,
sauf trois sons d'interface uisfx (CC0). Calée sur window.T (js/temps.js).
Klaxon puis coupure sèche, ambiance de bouchon + tic-tac qui s'emballe, balayage, demi-seconde de
silence, nappe calme, impact final. Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS).
Usage (depuis pub-plus-maintenant/) : python3 scripts/mixer.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(15)
db = lambda v: 10 ** (v / 20)
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
N = int(T["duree"] * SR)

def lire(chemin):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(chemin), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32).copy()

def poser(dest, son, t, g=0.0, pan=0.0):
    if son.ndim == 1:
        son = np.vstack([son * np.cos((pan + 1) * np.pi / 4) * 1.414, son * np.sin((pan + 1) * np.pi / 4) * 1.414])
    i = int(t * SR); n = min(son.shape[1], N - i)
    if n > 0:
        dest[:, i:i + n] += son[:, :n] * db(g)

def norm(y):
    return y / (np.abs(y).max() + 1e-9)

def passe_bande(y, f0, f1):
    b, a = signal.butter(2, [f0 / (SR / 2), f1 / (SR / 2)], "band"); return signal.lfilter(b, a, y)

def klaxon(duree):
    # Deux notes désaccordées (accord de klaxon), timbre nasal, attaque et relâche nettes.
    tt = np.arange(int(duree * SR)) / SR
    y = sum(signal.sawtooth(2 * np.pi * f * tt, 0.5) for f in (415, 523, 528))
    y = passe_bande(y, 350, 3200)
    env = np.clip(tt / 0.015, 0, 1) * np.clip((duree - tt) / 0.03, 0, 1)
    return norm(np.tanh(2.2 * y) * env)

def souffle(duree, f0, f1, pic=0.5):
    tt = np.arange(int(duree * SR)) / SR; p = tt / duree
    b = rng.standard_normal(len(tt)); y = np.zeros_like(b); z1 = z2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    for i in range(len(b)):
        f = 2 * np.sin(np.pi * fc[i] / SR); z1 += f * (b[i] - z1 - 0.6 * z2); z2 += f * z1; y[i] = z2
    return norm(y * np.where(p < pic, (p / pic) ** 2, ((1 - p) / (1 - pic)) ** 2))

def impact(duree=1.4, f=55):
    tt = np.arange(int(duree * SR)) / SR
    sub = np.sin(2 * np.pi * np.cumsum(f * np.exp(-tt * 3) + 30) / SR) * np.exp(-tt * 3)
    b, a = signal.butter(2, 300 / (SR / 2)); choc = signal.lfilter(b, a, rng.standard_normal(len(tt))) * np.exp(-tt * 25)
    return norm(sub + 0.7 * choc)

def tic(f=2400):
    tt = np.arange(int(0.03 * SR)) / SR
    return norm(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 260))

def nappe(duree):
    # Accord doux (ré majeur 9), filtré, avec une lente respiration.
    tt = np.arange(int(duree * SR)) / SR
    y = sum(np.sin(2 * np.pi * f * tt + k) * (0.7 if f < 200 else 0.35) for k, f in enumerate((73.4, 146.8, 220, 277.2, 329.6)))
    y *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * tt)
    env = np.clip(tt / 0.8, 0, 1) * np.clip((duree - tt) / 0.15, 0, 1)
    return norm(y * env)

ui = lambda nom: lire(ICI / "assets" / "sfx" / f"ui-{nom}.wav")
mix = np.zeros((2, N))

# ── HOOK ──
for t in T["hook"]:
    poser(mix, impact(0.5, 70), t + 0.12, -12)
poser(mix, klaxon(0.32), T["klaxon"][0], -6, -0.2)
poser(mix, klaxon(1.2), T["klaxon"][1], -4, 0.15)

# ── CHAOS (2-6 s) ──
d = T["balayage"] - T["chaos"]
tt = np.arange(int(d * SR)) / SR
rumeur = passe_bande(rng.standard_normal(len(tt)), 60, 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * tt))
moteur = np.sin(2 * np.pi * 38 * tt) * 0.5
amb = norm(rumeur + moteur) * np.clip(tt / 0.15, 0, 1) * (0.6 + 0.4 * tt / d)
poser(mix, amb, T["chaos"], -16)
for t, pan, dur in ((2.6, -0.7, 0.18), (3.4, 0.6, 0.35), (4.3, -0.4, 0.2), (4.9, 0.7, 0.5), (5.5, -0.6, 0.25)):
    poser(mix, klaxon(dur), t, -22, pan)  # klaxons lointains
t, k = T["chaos"] + 0.1, 0
while t < T["balayage"] - 0.05:  # tic-tac qui s'emballe avec le compteur
    poser(mix, tic(2400 if k % 2 else 1800), t, -15)
    p = (t - T["chaos"]) / d
    t += 0.42 * (1 - 0.8 * p ** 1.5); k += 1
tj = np.arange(int(2.0 * SR)) / SR  # montée de tension avec la jauge
poser(mix, norm(np.sin(2 * np.pi * np.cumsum(110 + 160 * (tj / 2) ** 2) / SR) * np.clip(tj / 2, 0, 1) ** 2), T["jauge"], -20)
poser(mix, ui("press"), T["chaos"], -12)
poser(mix, ui("press"), T["jauge"], -12)

# ── RUPTURE ──
poser(mix, souffle(0.7, 200, 3500, 0.45), T["balayage"] - 0.05, -6)
a, b = int(T["silence"][0] * SR), int(T["silence"][1] * SR)
queue = mix[:, a - int(0.05 * SR):a] * np.linspace(1, 0, int(0.05 * SR))
mix[:, a - int(0.05 * SR):a] = queue
mix[:, a:b] = 0
poser(mix, souffle(0.9, 120, 900, 0.8), T["lueur"], -18)

# ── CALME ──
poser(mix, nappe(T["boucle"] - T["calme"] + 0.1), T["calme"], -15)
poser(mix, ui("open"), T["porte"] + 0.05, -12)
poser(mix, impact(0.4, 90), T["porte"] + 1.05, -24)  # porte qui se cale
poser(mix, ui("press"), T["texte1"], -18)
for i in range(3):
    poser(mix, tic(1400), T["texte2"] + i * 0.15, -20)

# ── BOUCLE + CTA ──
c = int(T["boucle"] * SR); mix[:, c:] = 0  # coupure sèche de la nappe
poser(mix, klaxon(0.2), T["boucle"] + 0.02, -16)
poser(mix, impact(1.6, 50), T["plus"] + 0.12, -4)
poser(mix, ui("success"), T["cta"], -11)
mix[:, -int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))

tmp = ICI / "assets" / "audio" / "mix-brut.wav"
with wave.open(str(tmp), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix.T / (np.abs(mix).max() + 1e-9) * 0.7, -1, 1) * 32767).astype(np.int16).tobytes())

def lufs(ch):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(ch), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(r.rsplit("I:", 1)[1].split("LUFS")[0])

sortie = ICI / "assets" / "audio" / "mix.wav"
g = -14 - lufs(tmp)
for _ in range(6):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af",
                    f"volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=80:level=false", "-ar", str(SR), str(sortie)], check=True)
    e = -14 - lufs(sortie)
    if abs(e) < 0.15:
        break
    g += e
tmp.unlink()
print(f"Mix : {T['duree']} s, {lufs(sortie):.1f} LUFS")
