"""Sons supplémentaires de la vitrine (synthétisés, libres de droits) : klaxon, clic, décollage.
Complète assets/sfx/ (copié depuis public/sfx/ du projet Remotion).
Usage (depuis vitrine/) : python3 scripts/sfx-vitrine.py
"""
import wave
from pathlib import Path
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "assets" / "sfx"
rng = np.random.default_rng(11)
t = lambda d: np.arange(int(SR * d)) / SR

def ecrire(nom, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    f = int(SR * 0.008); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    with wave.open(str(OUT / f"{nom}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print(nom, f"{len(x)/SR:.2f} s")

def passe_bas(x, a):
    """Filtre passe-bas à un pôle ; `a` scalaire ou variable dans le temps."""
    a = np.broadcast_to(a, x.shape)
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a[i] * (v - acc); y[i] = acc
    return y

# Klaxon de ville : deux notes rapprochées, timbre « carré » adouci, petite modulation.
tt = t(0.42)
env = np.minimum(1, tt / 0.02) * np.minimum(1, (0.42 - tt) / 0.06)
k = sum(np.sign(np.sin(2 * np.pi * f * tt * (1 + 0.004 * np.sin(2 * np.pi * 7 * tt)))) for f in (392, 466))
ecrire("klaxon", passe_bas(k * env, 0.18), 0.6)

# Clic de clavier : impulsion brève filtrée + résonance aiguë.
tt = t(0.05)
c = rng.standard_normal(len(tt)) * np.exp(-tt * 260) + np.sin(2 * np.pi * 3100 * tt) * np.exp(-tt * 180) * 0.6
ecrire("clic", c, 0.55)

# Décollage : souffle grave qui enfle puis s'éloigne (bruit filtré + grondement).
tt = t(2.4)
p = tt / 2.4
souffle = passe_bas(rng.standard_normal(len(tt)), 0.05 + 0.25 * p)
grond = np.sin(2 * np.pi * np.cumsum(55 + 40 * p) / SR) * 0.5
ecrire("decollage", (souffle + grond) * np.sin(np.pi * p) ** 1.5, 0.7)
