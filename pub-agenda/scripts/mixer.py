"""Bande-son de « Pas une minute au volant » : voix off fournie (assets/audio/voix.mp3) + musique et effets
synthétisés ici, sauf trois sons d'interface uisfx (CC0). Calée sur window.T (js/temps.js).
Beat afro-pop léger synthétisé, pop, swoosh et ding.
Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS).
Usage (depuis pub-agenda/) : python3 scripts/mixer.py
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

# ── Beat afro-pop léger (112 BPM) : kick, clap, shaker, log drum glissé, marimba ──
noire = 60 / 112
def kick():
    tt = np.arange(int(0.3 * SR)) / SR
    return norm(np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-tt * 35)) / SR) * np.exp(-tt * 10))
def clap():
    tt = np.arange(int(0.18 * SR)) / SR
    return norm(passe_haut(rng.standard_normal(len(tt)), 900) * (np.exp(-tt * 30) + 0.5 * np.exp(-((tt - 0.012) * 400) ** 2)))
def shaker():
    tt = np.arange(int(0.07 * SR)) / SR
    return norm(passe_haut(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 60))
def logdrum(f):
    tt = np.arange(int(0.45 * SR)) / SR
    return norm(np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-tt * 25))) / SR)) * np.exp(-tt * 6))
def passe_haut(y, f):
    b_, a_ = signal.butter(2, f / (SR / 2), "high"); return signal.lfilter(b_, a_, y)
basses = [73.4, 73.4, 98, 82.4]
melodie = [587.3, 659.3, 740, 880, 740, 659.3, 587.3, 493.9]
k, t = 0, 0.0
while t < T["duree"] - 0.1:
    croche = k % 8
    if croche in (0, 3, 6) and not (T["bascule"] <= t < T["solution"]):
        poser(musique, kick(), t, -4)
    if croche in (2, 6):
        poser(musique, clap(), t, -12)
    poser(musique, shaker(), t + noire / 4, -22 if croche % 2 else -18, 0.3)
    if croche in (0, 5) and not (T["bascule"] <= t < T["solution"]):
        poser(musique, logdrum(basses[(k // 8) % 4]), t, -8)
    if croche in (1, 4, 7):
        poser(musique, note(melodie[(k // 3) % 8], 0.35, 10), t, -16, -0.3 if k % 2 else 0.3)
    t += noire / 2; k += 1

def ding(f=1568):
    tt = np.arange(int(0.8 * SR)) / SR
    return norm((np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * 2.76 * f * tt) * np.exp(-tt * 8)) * np.exp(-tt * 5))

# ── Effets : pop, swoosh, ding ──
for c in T["creneaux"][1:]:
    poser(effets, ui("press"), c, -11)
for c in T["coches"]:
    poser(effets, ding(1760), c, -20)
for t0 in (T["rdv"][0], T["volant"][0], T["solution"], T["final"], T["outro"], T["retour"]):
    poser(effets, souffle(0.55, 250, 3500, 0.45), t0 - 0.2, -14)
for t0 in [T["rdv"][1], T["rdv"][2]] + T["volant"][1:] + T["secret"] + T["carte"] + T["mots"]:
    poser(effets, ui("press"), t0, -20)
poser(effets, souffle(0.6, 150, 1600, 0.5), T["bascule"], -14)
for p_ in T["puces"]:
    poser(effets, ding(2093), p_ + 0.1, -18)
poser(effets, ui("success"), T["prix"], -12)
poser(effets, impact(0.9, 55), T["outro"] + 0.3, -14)
poser(effets, ui("success"), T["contact"], -12)

# ── Voix + baisse de la musique sous la voix ──
voix = norm(lire(ICI / "assets" / "audio" / "voix.mp3")[:N]); voix = np.pad(voix, (0, N - len(voix)))
env = (np.abs(voix) > 0.02).astype(float)
noyau = np.hanning(int(0.3 * SR)); env = np.clip(np.convolve(env, noyau / noyau.sum() * 3, "same"), 0, 1)
musique *= db(-16) * (1 - 0.5 * env)
mix = musique + effets * db(-6)
poser(mix, voix, 0, 0)
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
