"""Bande-son de « 4 h 30 et personne » : voix off fournie (assets/audio/voix.mp3) + musique et effets
synthétisés ici, sauf trois sons d'interface uisfx (CC0). Calée sur window.T (js/temps.js).
Pulsation claire et douce sous la voix, effets d'interface discrets (uisfx CC0).
Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS).
Usage (depuis pub-personne/) : python3 scripts/mixer.py
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

# ── Musique : pulsation douce et claire (pluck + nappe), style pub produit ──
accords = [(146.8, 220, 293.7, 370), (123.5, 185, 246.9, 311.1), (110, 164.8, 220, 277.2), (130.8, 196, 261.6, 329.6)]
temps_ = 60 / 104
t, k = 0.0, 0
while t < T["duree"] - 0.2:
    a = accords[(k // 8) % 4]
    poser(musique, note(a[3 - k % 4] * 2, 0.45, 9), t, -12 if k % 2 else -8, -0.4 if k % 2 else 0.4)
    if k % 2 == 0:
        poser(musique, note(a[0] / 2, 0.6, 5), t, -6)
    t += temps_ / 2; k += 1
for i in range(4):
    poser(musique, nappe(8 * temps_ * 2 + 0.4, accords[i]), i * 8 * temps_ / 2 * 2 % T["duree"], -14)

# ── Effets d'interface, doux : tick (notifications), pop (validations), whoosh (bascules) ──
poser(effets, ui("press"), 0.02, -12)
for k in range(5):
    poser(effets, tic(1900), 0.05 + k * 0.27, -22)  # vibration du réveil
poser(effets, ui("press"), T["vol"], -12)
for t in T["notifs"]:
    poser(effets, ui("press"), t + 0.05, -10)
poser(effets, souffle(0.7, 200, 2800, 0.5), T["bascule"] - 0.05, -13)
poser(effets, souffle(0.6, 300, 2400, 0.5), T["solution"] - 0.15, -17)
poser(effets, ui("success"), T["arrive"], -12)
for p in T["puces"]:
    poser(effets, ui("success"), p, -14)
poser(effets, souffle(0.5, 250, 1800, 0.5), T["prix"], -18)
poser(effets, ui("press"), T["tap"], -12)
poser(effets, souffle(0.7, 200, 2800, 0.5), T["outro"] - 0.05, -14)
poser(effets, impact(0.8, 60), T["outro"] + 0.2, -16)
poser(effets, ui("success"), T["contact"], -13)
poser(effets, souffle(0.35, 300, 2600, 0.5), T["retour"] - 0.05, -18)

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
