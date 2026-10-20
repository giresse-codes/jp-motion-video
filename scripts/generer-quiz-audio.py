"""Sons de VideoQuiz, synthétisés (aucun fichier téléchargé, aucun droit à gérer).
- public/audio/quiz-groove.wav : boucle de 4 s (120 BPM) marimba + kick doux + shaker, à boucler.
- public/sfx/reveil.wav : sonnerie de réveil douce (bips par trois), environ 1,4 s.
- public/sfx/roulement.wav : roulement de caisse claire qui monte (1,1 s), pour le suspense.
Usage : python3 scripts/generer-quiz-audio.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(30)


def ecrire(chemin, y):
    y = y / (np.abs(y).max() + 1e-9) * 0.8
    st = np.vstack([y, y]).T if y.ndim == 1 else y.T
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def note(f, d, dec=7.0):
    tt = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 20)) * np.exp(-tt * dec) * np.clip(tt / 0.004, 0, 1)


def poser(dest, son, t, g=1.0, pan=0.0):
    i = int(t * SR) % dest.shape[1]
    for k, c in enumerate((np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4))):
        idx = (np.arange(len(son)) + i) % dest.shape[1]  # enroulement : boucle sans couture
        np.add.at(dest[k], idx, son * g * c * 1.414)


# ── Boucle de groove ──
DUREE, CROCHE = 4.0, 0.25
boucle = np.zeros((2, int(DUREE * SR)))
motif = [587.3, 0, 740, 880, 0, 740, 659.3, 0, 587.3, 0, 740, 987.8, 880, 0, 740, 659.3]
for k, f in enumerate(motif):
    if f:
        poser(boucle, note(f, 0.6), k * CROCHE, 0.5, -0.35 if k % 2 else 0.35)
basses = [146.8, 146.8, 123.5, 110]
for k, f in enumerate(basses):
    poser(boucle, note(f, 1.0, 3.0), k * 1.0, 0.55)
tt = np.arange(int(0.35 * SR)) / SR
kick = np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 9)
for k in range(8):
    poser(boucle, kick, k * 0.5, 0.45)
tt = np.arange(int(0.06 * SR)) / SR
shaker = np.diff(rng.standard_normal(len(tt) + 1)) * np.exp(-tt * 70)
for k in range(16):
    poser(boucle, shaker, k * CROCHE + CROCHE / 2, 0.06 if k % 2 else 0.1, 0.4)
ecrire(Path("public/audio/quiz-groove.wav"), boucle)

# ── Sonnerie de réveil ──
y = np.zeros(int(1.4 * SR))
tb = np.arange(int(0.07 * SR)) / SR
bip = (np.sin(2 * np.pi * 1760 * tb) + 0.3 * np.sin(2 * np.pi * 3520 * tb)) * np.clip(tb / 0.004, 0, 1) * np.clip((0.07 - tb) / 0.01, 0, 1)
for g in range(3):
    for b in range(3):
        i = int((g * 0.45 + b * 0.11) * SR)
        y[i:i + len(bip)] += bip
ecrire(Path("public/sfx/reveil.wav"), y)

# ── Roulement de tambour ──
y = np.zeros(int(1.1 * SR))
tc = np.arange(int(0.05 * SR)) / SR
coup = rng.standard_normal(len(tc)) * np.exp(-tc * 60) + 0.6 * np.sin(2 * np.pi * 190 * tc) * np.exp(-tc * 40)
t, k = 0.0, 0
while t < 1.05:
    i = int(t * SR); n = min(len(coup), len(y) - i)
    y[i:i + n] += coup[:n] * (0.25 + 0.75 * (t / 1.05) ** 1.5) * (1 if k % 2 else 0.8)
    t += 0.032; k += 1
ecrire(Path("public/sfx/roulement.wav"), y)
print("quiz-groove.wav, reveil.wav et roulement.wav générés")
