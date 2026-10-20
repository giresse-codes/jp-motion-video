"""Bande-son de « Parking à Akwa » : voix off fournie (assets/audio/voix.mp3) + musique et effets
synthétisés ici, sauf trois sons d'interface uisfx (CC0). Calée sur window.T (js/temps.js).
Pulsation tendue sous le problème, vrai silence à l'arrêt sur image, nappe calme et groove léger
ensuite, baissés sous la voix. Effets doux. Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS).
Usage (depuis pub-parking/) : python3 scripts/mixer.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(20)
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

def passe_bas(y, f):
    b, a = signal.butter(2, f / (SR / 2)); return signal.lfilter(b, a, y)

def souffle(duree, f0, f1, pic=0.5):
    tt = np.arange(int(duree * SR)) / SR; p = tt / duree
    b = rng.standard_normal(len(tt)); y = np.zeros_like(b); z1 = z2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    for i in range(len(b)):
        f = 2 * np.sin(np.pi * fc[i] / SR); z1 += f * (b[i] - z1 - 0.6 * z2); z2 += f * z1; y[i] = z2
    return norm(y * np.where(p < pic, (p / pic) ** 2, ((1 - p) / (1 - pic)) ** 2))

def impact(duree=1.0, f=60):
    tt = np.arange(int(duree * SR)) / SR
    sub = np.sin(2 * np.pi * np.cumsum(f * np.exp(-tt * 4) + 30) / SR) * np.exp(-tt * 4)
    choc = passe_bas(rng.standard_normal(len(tt)), 250) * np.exp(-tt * 30)
    return norm(sub + 0.5 * choc)

def tic(f=2000):
    tt = np.arange(int(0.03 * SR)) / SR
    return norm(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 260))

def note(f, duree, dec=6.0):
    # Marimba douce : fondamentale + harmonique 4, attaque rapide.
    tt = np.arange(int(duree * SR)) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 20)) * np.exp(-tt * dec) * np.clip(tt / 0.004, 0, 1)

def nappe(duree, fr):
    tt = np.arange(int(duree * SR)) / SR
    y = sum(np.sin(2 * np.pi * f * tt + k) * (0.7 if f < 200 else 0.3) for k, f in enumerate(fr))
    y *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * tt)
    return norm(y * np.clip(tt / 0.6, 0, 1) * np.clip((duree - tt) / 0.4, 0, 1))

ui = lambda nom: lire(ICI / "assets" / "sfx" / f"ui-{nom}.wav")
musique = np.zeros((2, N)); effets = np.zeros((2, N))

# ── PROBLÈME (0 → arrêt sur image) : basse pulsée qui accélère + tic du chrono ──
fin_tension = T["fige"]
tt = np.arange(int(fin_tension * SR)) / SR
pouls = np.zeros_like(tt); t, k = T["titre"], 0
while t < fin_tension - 0.05:
    i = int(t * SR); n = min(int(0.25 * SR), len(tt) - i)
    pouls[i:i + n] += note(55 if k % 4 else 41.2, 0.25, 9)[:n]
    t += 0.36 if t < T["carte"] else 0.24 * (1 - 0.35 * (t - T["carte"]) / (fin_tension - T["carte"])); k += 1
bourdon = np.sin(2 * np.pi * 110 * tt) * 0.15 * np.clip((tt - T["carte"]) / 1.3, 0, 1)
poser(musique, norm(passe_bas(pouls, 400) + bourdon), 0, 0)
t = T["carte"] + 0.1
while t < fin_tension - 0.05:
    poser(effets, tic(2200), t, -20)
    t += 0.2 * (1 - 0.5 * (t - T["carte"]) / (fin_tension - T["carte"]))
poser(effets, impact(0.9, 70), T["stop"] + 0.12, -6)
for i in range(3):
    poser(effets, impact(0.4, 85), T["titre"] + i * 0.28 + 0.13, -16)
poser(effets, souffle(0.35, 300, 2500), T["zoom"] - 0.15, -18)
poser(effets, ui("press"), T["fige"], -12)

# ── RUPTURE : silence réel, puis balayage ──
poser(effets, souffle(0.75, 200, 3200, 0.45), T["balayage"] - 0.05, -9)

# ── CALME : nappe + groove léger de marimba ──
d = T["duree"] - T["calme"]
poser(musique, nappe(d, (73.4, 146.8, 220, 277.2, 329.6)), T["calme"], -6)
motif = [293.7, 370, 440, 370, 554.4, 440, 370, 329.6]
t, k = T["arret"], 0
while t < T["duree"] - 0.3:
    poser(musique, note(motif[k % 8], 0.5), t, -10, -0.3 if k % 2 else 0.3)
    t += 0.3; k += 1
poser(effets, souffle(1.1, 150, 900, 0.7), T["arrivee"], -18)  # la voiture glisse
poser(effets, ui("open"), T["portiere"], -12)
poser(effets, impact(0.5, 90), T["logo"], -14)
poser(effets, impact(0.5, 80), T["prix"] + 0.91, -16)
poser(effets, ui("success"), T["cta"], -12)

# ── VOIX + baisse de la musique sous la voix ──
voix = lire(ICI / "assets" / "audio" / "voix.mp3")[:N]
voix = norm(voix)
env = np.zeros(N)
for a, b, _ in T["segments"]:
    env[int(a * SR):int(b * SR)] = 1
noyau = np.hanning(int(0.25 * SR)); env = np.convolve(env, noyau / noyau.sum(), "same")
musique *= db(-17) * (1 - 0.55 * env)
mix = musique + effets * db(-6)
poser(mix, voix, 0, 0)
a, b = int(T["fige"] * SR), int((T["balayage"] - 0.05) * SR)  # silence de l'arrêt sur image
mix[:, a:a + int(0.04 * SR)] *= np.linspace(1, 0, int(0.04 * SR)); mix[:, a + int(0.04 * SR):b] = 0
mix[:, -int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))

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
