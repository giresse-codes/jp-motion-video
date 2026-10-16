"""Bande-son de « Samedi à Limbé » (sans voix off ni musique de tiers) : petit groove ensoleillé
synthétisé ici (grosse caisse douce, shaker, basse, marimba pentatonique, 112 BPM) + effets.
La musique s'arrête net sur « Et le retour ? » (10 s), se feutre la nuit, revient à la réponse (25 s).
Sons d'interface uisfx (CC0) pour le prix et le CTA. Sortie : assets/audio/mix.wav (-14 LUFS).
Usage (depuis pub-limbe/) : python3 scripts/mixer.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(30)
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
    if n > 0 and i >= 0:
        dest[:, i:i + n] += son[:, :n] * db(g)

norm = lambda y: y / (np.abs(y).max() + 1e-9)
tps = lambda d: np.arange(int(d * SR)) / SR

def souffle(duree, f0, f1, pic=0.5):
    tt = tps(duree); p = tt / duree
    b = rng.standard_normal(len(tt)); y = np.zeros_like(b); z1 = z2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    for i in range(len(b)):
        f = 2 * np.sin(np.pi * fc[i] / SR); z1 += f * (b[i] - z1 - 0.6 * z2); z2 += f * z1; y[i] = z2
    return norm(y * np.where(p < pic, (p / pic) ** 2, ((1 - p) / (1 - pic)) ** 2))

def impact(duree=1.2, f=60):
    tt = tps(duree)
    sub = np.sin(2 * np.pi * np.cumsum(f * np.exp(-tt * 3) + 30) / SR) * np.exp(-tt * 3.2)
    b, a = signal.butter(2, 300 / (SR / 2)); choc = signal.lfilter(b, a, rng.standard_normal(len(tt))) * np.exp(-tt * 25)
    return norm(sub + 0.7 * choc)

def grosse_caisse():
    tt = tps(0.35); return norm(np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 9))

def shaker():
    tt = tps(0.07); b, a = signal.butter(2, 6000 / (SR / 2), "high")
    return norm(signal.lfilter(b, a, rng.standard_normal(len(tt))) * np.exp(-tt * 60))

def marimba(f, d=0.45):
    tt = tps(d); return norm((np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 30)) * np.exp(-tt * 7))

def basse(f, d):
    tt = tps(d); y = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)
    return y * np.clip(tt / 0.01, 0, 1) * np.clip((d - tt) / 0.04, 0, 1)

def tic(f=2200):
    tt = tps(0.03); return norm(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 260))

ui = lambda nom: lire(ICI / "assets" / "sfx" / f"ui-{nom}.wav")

# ── Groove (112 BPM), de 2 s à la fin ──
BPM = 112; b = 60 / BPM
musique = np.zeros((2, N))
GAMME = [392.0, 440.0, 523.3, 587.3, 659.3, 784.0]   # sol pentatonique
MOTIF = [0, 2, 4, 2, 5, 4, 2, 1, 0, 2, 3, 2, 4, 3, 1, 0]
BASSES = [98.0, 98.0, 130.8, 110.0]                  # sol, sol, do, la
k, t = 0, T["plans"][0]
while t < T["duree"] - 0.05:
    temps_ = k % 4
    poser(musique, grosse_caisse(), t, -6 if temps_ in (0, 2) else -14)
    poser(musique, shaker(), t + b / 2, -20, 0.4); poser(musique, shaker(), t + b * 0.75, -26, -0.4)
    if temps_ == 0:
        poser(musique, basse(BASSES[(k // 4) % 4], b * 1.6), t, -10)
    poser(musique, marimba(GAMME[MOTIF[(2 * k) % 16]]), t, -15, -0.3)
    poser(musique, marimba(GAMME[MOTIF[(2 * k + 1) % 16]]), t + b / 2, -18, 0.3)
    k += 1; t += b
tt = np.arange(N) / SR
env = np.ones(N)
env[(tt >= T["question"] - 0.02) & (tt < T["badge"])] = 0                     # arrêt net sur la question
env *= np.where((tt >= T["plans"][7]) & (tt < T["reponse"]), 0.45, 1.0)       # nuit : plus discret
env[tt >= T["duree"] - 0.6] *= np.clip((T["duree"] - tt[tt >= T["duree"] - 0.6]) / 0.6, 0, 1)
# Filtre passe-bas la nuit
nuit = (tt >= T["plans"][7]) & (tt < T["reponse"])
bb, aa = signal.butter(2, 900 / (SR / 2))
filtre = signal.lfilter(bb, aa, musique, axis=1)
musique = np.where(nuit, filtre, musique) * env

mix = musique * db(-3)
# ── Hook ──
for i, t in enumerate(T["hook"]):
    poser(mix, impact(0.6 if i < 3 else 1.4, 70 if i < 3 else 45), t + 0.13, -8 if i < 3 else -3)
# ── Changements de plan : souffle + tic de l'horloge ──
for i, t in enumerate(T["plans"][1:]):
    poser(mix, souffle(0.45, 400, 3200, 0.45), t - 0.1, -15, (-0.4, 0.4)[i % 2])
    poser(mix, tic(), t + 0.02, -16)
# ── Question ──
poser(mix, impact(1.0, 55), T["question"] + 0.15, -5)
poser(mix, marimba(GAMME[4], 0.8), T["question"] + 0.36, -10)
poser(mix, marimba(GAMME[1] / 2, 1.2), T["question"] + 0.6, -10)
poser(mix, ui("press"), T["badge"], -14)
# ── Réponse, prix, fin ──
poser(mix, impact(1.4, 50), T["reponse"], -5)
poser(mix, ui("success"), T["prix"] + 0.1, -11)
poser(mix, impact(0.8, 70), T["fin"], -7)
poser(mix, ui("open"), T["fin"] + 0.45, -13)

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
