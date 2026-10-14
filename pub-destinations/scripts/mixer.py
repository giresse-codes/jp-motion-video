"""Bande-son de la pub « destinations » (sans voix off) : musique + effets calés sur window.T.

Musique : « Cinematic Corporate Business Background » (Alex Morgan, Pixabay, fournie par
l'utilisateur), passage énergique à partir de 51 s, fondu final. Effets : sons d'interface uisfx
(CC0) pour la frappe, les clics et les messages ; souffles et impacts fabriqués ici.
Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS, crête < -1 dBTP).
Usage (depuis pub-destinations/) : python3 scripts/mixer.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(14)
db = lambda v: 10 ** (v / 20)
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
N = int(T["duree"] * SR)

def lire(chemin, canaux=1):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(chemin), "-ac", str(canaux), "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, dtype=np.float32).copy()
    return x.reshape(-1, canaux).T if canaux > 1 else x

def poser(dest, son, t, g=0.0, pan=0.0):
    if son.ndim == 1:
        son = np.vstack([son * np.cos((pan + 1) * np.pi / 4) * 1.414, son * np.sin((pan + 1) * np.pi / 4) * 1.414])
    i = int(t * SR)
    n = min(son.shape[1], N - i)
    if n > 0:
        dest[:, i:i + n] += son[:, :n] * db(g)

def souffle(duree=0.6, f0=300, f1=2600, pic=0.45):
    tt = np.arange(int(duree * SR)) / SR; p = tt / duree
    b = rng.standard_normal(len(tt)); y = np.zeros_like(b); z1 = z2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    for i in range(len(b)):
        f = 2 * np.sin(np.pi * fc[i] / SR); z1 += f * (b[i] - z1 - 0.6 * z2); z2 += f * z1; y[i] = z2
    env = np.where(p < pic, (p / pic) ** 2, ((1 - p) / (1 - pic)) ** 2)
    y = y * env
    return y / (np.abs(y).max() + 1e-9)

def impact(duree=1.6):
    tt = np.arange(int(duree * SR)) / SR
    sub = np.sin(2 * np.pi * np.cumsum(60 * np.exp(-tt * 2.5) + 32) / SR) * np.exp(-tt * 2.4)
    b, a = signal.butter(2, 240 / (SR / 2))
    choc = signal.lfilter(b, a, rng.standard_normal(len(tt))) * np.exp(-tt * 20)
    y = sub + 0.6 * choc
    return y / np.abs(y).max()

def eclaboussure():
    # « Splash » liquide : souffle grave + bulles (sinus glissants courts).
    y = souffle(0.9, 150, 1400, 0.25) * 0.8
    tt = np.arange(len(y)) / SR
    for k in range(9):
        t0 = 0.05 + k * 0.06; f = 500 + 180 * (k % 4)
        m = (tt >= t0) & (tt < t0 + 0.08); u = tt[m] - t0
        y[m] += 0.35 * np.sin(2 * np.pi * (f + 2200 * u) * u) * np.exp(-u * 40)
    return y / np.abs(y).max()

ui = lambda nom: lire(ICI / "assets" / "sfx" / f"ui-{nom}.wav")

# ── Musique ──
mus = lire(ICI / "assets" / "audio" / "musique.mp3", 2)
M = mus[:, int(51.0 * SR): int(51.0 * SR) + N]
M = np.pad(M, ((0, 0), (0, N - M.shape[1])))
tt = np.arange(N) / SR
env = np.clip(tt / 0.4, 0, 1) * np.clip((T["duree"] - tt) / 1.8, 0, 1) ** 1.5
env *= np.where((tt > T["page"] - 0.15) & (tt < T["page"] + 0.35), 0.75, 1.0)  # petite respiration au glissement
mix = M * env * db(-4)

# ── Effets ──
S = np.zeros((2, N))
poser(S, eclaboussure(), T["splash"] + 0.02, -8)
poser(S, souffle(0.7, 200, 2200, 0.7), T["couvert"] - 0.6, -14)
for t0, t1 in ((T["q1"], T["q1Fin"]), (T["q2"], T["q2Fin"])):
    for t in np.arange(t0, t1, 0.075):
        poser(S, ui("typing"), t + rng.uniform(-0.01, 0.01), -16 + rng.uniform(-2, 2), 0.1)
    poser(S, ui("press"), t1 + 0.15, -12)
for i in range(1, 6):
    poser(S, souffle(0.35, 600, 3500, 0.35), T["orbite"] + 0.04 * i, -22, (-0.6, 0.6, -0.3, 0.3, 0)[i - 1])
for i, t in enumerate(T["dest"]):
    poser(S, souffle(0.45, 400, 3000, 0.4), t - 0.05, -13, (-0.4, 0.4, -0.2, 0.2, 0)[i])
    poser(S, ui("swipe"), t + 0.05, -15)
    for k in range(4):
        poser(S, ui("typing"), t + 0.05 + k * 0.07, -19)
poser(S, souffle(0.6, 250, 2800, 0.6), T["page"] - 0.1, -10)
poser(S, ui("open"), T["solution"] + 0.3, -14)
poser(S, souffle(0.4, 500, 3000, 0.4), T["engagement"] - 0.3, -16)
poser(S, ui("drop"), T["bouton"], -13)
poser(S, ui("press"), T["clic"] - 0.03, -9)
poser(S, souffle(0.6, 200, 2000, 0.5), T["chat"] - 0.1, -14)
poser(S, ui("send"), T["bulle1"], -10)
poser(S, ui("receive"), T["bulle2"], -10)
poser(S, ui("success"), T["bulle2"] + 0.25, -12)
poser(S, ui("receive"), T["bulle3"], -11)
poser(S, souffle(0.7, 150, 1800, 0.7), T["fin"] - 0.5, -10)
poser(S, impact(), T["logo"], -8)
poser(S, ui("success"), T["pastille"], -14)
mix = mix + S

tmp = ICI / "assets" / "audio" / "mix-brut.wav"
with wave.open(str(tmp), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix.T / (np.abs(mix).max() + 1e-9) * 0.7, -1, 1) * 32767).astype(np.int16).tobytes())

def lufs(c):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(c), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
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
