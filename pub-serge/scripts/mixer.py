"""Bande-son de « L'histoire de Serge » : voix off fournie (assets/audio/voix.mp3) + musique et effets
synthétisés ici, sauf trois sons d'interface uisfx (CC0). Calée sur window.T (js/temps.js).
Nappe ambiante discrète et effets feutrés (tic-tac, klaxons lointains, portière, crayon, clic).
Sortie : assets/audio/mix.wav (48 kHz stéréo, -14 LUFS).
Usage (depuis pub-serge/) : python3 scripts/mixer.py
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

# ── Nappe ambiante discrète (accords lents) ──
accords = [(110, 164.8, 220, 261.6, 329.6), (87.3, 130.8, 174.6, 220, 261.6), (98, 146.8, 196, 246.9, 293.7), (82.4, 123.5, 164.8, 207.7, 246.9)]
mesure = 4.0
for i in range(int(T["duree"] / mesure) + 1):
    poser(musique, nappe(mesure + 0.8, accords[i % 4]), i * mesure, -6)

def portiere():
    tt = np.arange(int(0.35 * SR)) / SR
    clic = np.sin(2 * np.pi * 1500 * tt) * np.exp(-tt * 180) + 0.5 * rng.standard_normal(len(tt)) * np.exp(-tt * 90)
    return norm(clic + 0.5 * np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 18))

def klaxon(duree):
    tt = np.arange(int(duree * SR)) / SR
    y = sum(signal.sawtooth(2 * np.pi * f * tt, 0.5) for f in (415, 523))
    b_, a_ = signal.butter(2, [400 / (SR / 2), 2000 / (SR / 2)], "band")
    return norm(signal.lfilter(b_, a_, y) * np.clip(tt / 0.02, 0, 1) * np.clip((duree - tt) / 0.05, 0, 1))

def crayon(duree):
    tt = np.arange(int(duree * SR)) / SR
    b_, a_ = signal.butter(2, [2500 / (SR / 2), 7000 / (SR / 2)], "band")
    return norm(signal.lfilter(b_, a_, rng.standard_normal(len(tt))) * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * tt)) * np.sin(np.pi * tt / duree))

# ── Effets feutrés : tic-tac, klaxons lointains, portières, crayon, clic ──
for debut, fin_ in ((T["tictac"][0], T["tictac"][1]), (T["scenes"][5], T["scenes"][6])):
    t, k = debut, 0
    while t < fin_:
        poser(effets, tic(2600 if k % 2 else 2100), t, -20); t += 0.5; k += 1
for i, t in enumerate(T["klaxons"]):
    poser(effets, klaxon(0.25 + 0.2 * (i % 2)), t, -26, -0.6 if i % 2 else 0.6)
for t in T["portes"]:
    poser(effets, portiere(), t, -14)
for t in T["barres"]:
    poser(effets, crayon(0.3), t, -20)
for t in T["coches"] + T["puces"]:
    poser(effets, ui("press"), t, -18)
for t in T["scenes"][1:]:
    poser(effets, souffle(0.6, 150, 1200, 0.5), t - 0.3, -26)
poser(effets, ui("success"), T["whatsapp"], -14)

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
