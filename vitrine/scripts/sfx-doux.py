"""Effets sonores doux de la vitrine (synthétisés, libres de droits).
Remplacent les sons percussifs (boom, impact, glitch, klaxon, néon, tic) : souffles d'air,
marimba, carillons et nappes, tous accordés en fa majeur pour rester agréables sous la voix.
Usage (depuis vitrine/) : python3 scripts/sfx-doux.py
"""
import wave
from pathlib import Path
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "assets" / "sfx"
rng = np.random.default_rng(7)
t = lambda d: np.arange(int(SR * d)) / SR
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)  # numéro MIDI -> Hz
FA, LA, DO, RE, MI = 65, 69, 72, 74, 76     # fa majeur (fa4, la4, do5, ré5, mi5)

def ecrire(nom, x, gain=0.7):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    f = int(SR * 0.01); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
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

def marimba(n, d=0.6, dt=0.0, total=None):
    """Lame de marimba : fondamentale ronde + partiels 4x et 10x qui s'éteignent vite."""
    tt = t(total or d + dt); f = NOTE(n)
    u = np.clip(tt - dt, 0, None); on = tt >= dt
    x = (np.sin(2 * np.pi * f * u) * np.exp(-u * 6)
         + 0.25 * np.sin(2 * np.pi * 4 * f * u) * np.exp(-u * 22)
         + 0.06 * np.sin(2 * np.pi * 10 * f * u) * np.exp(-u * 45))
    return x * on * np.minimum(1, u / 0.003)

def cloche(n, d=1.4, dt=0.0, total=None):
    """Petite cloche claire (partiels inharmoniques doux)."""
    tt = t(total or d + dt); f = NOTE(n)
    u = np.clip(tt - dt, 0, None); on = tt >= dt
    x = sum(a * np.sin(2 * np.pi * f * r * u) * np.exp(-u * k)
            for r, a, k in ((1, 1, 3.2), (2.0, 0.35, 5), (2.76, 0.18, 8), (5.4, 0.05, 14)))
    return x * on * np.minimum(1, u / 0.004)

def souffle(d, couleur=0.05, pic=0.45):
    """Souffle d'air : bruit filtré qui enfle et retombe en douceur, sans attaque sèche."""
    tt = t(d); p = tt / d
    b = passe_bas(rng.standard_normal(len(tt)), couleur + 0.08 * np.sin(np.pi * p))
    b = passe_bas(b, 0.35)
    env = np.where(p < pic, np.sin(np.pi / 2 * p / pic) ** 2, np.cos(np.pi / 2 * (p - pic) / (1 - pic)) ** 2)
    return b * env

# Souffles (remplacent whoosh / whoosh-court)
ecrire("souffle", souffle(0.9), 0.45)
ecrire("souffle-court", souffle(0.5, 0.07, 0.4), 0.4)

# Marimba : apparition d'un élément (remplace pop) et accent (remplace impact)
ecrire("marimba", marimba(DO, 0.5), 0.6)
ecrire("marimba-grave", marimba(FA - 12, 0.7) + 0.5 * marimba(DO - 12, 0.7), 0.6)

# Prix : deux notes montantes (la -> ré)
ecrire("carillon", marimba(LA, 0.9, 0, 0.9) + marimba(RE, 0.75, 0.12, 0.9) * 0.9, 0.55)

# Brillance : petit arpège aigu de cloches (remplace scintillement / néon)
ecrire("brillance", sum(cloche(n + 12, 1.2, i * 0.07, 1.6) * (0.8 ** i) for i, n in enumerate((FA, LA, DO, MI))), 0.4)

# Validation douce (remplace bip) : deux notes de marimba rapprochées
ecrire("valide", marimba(DO, 0.45, 0, 0.55) + marimba(FA + 12, 0.45, 0.09, 0.55), 0.5)

# Notification message : cloche à deux tons
ecrire("notif-douce", cloche(RE + 12, 0.9, 0, 1.0) + 0.8 * cloche(LA + 12, 0.8, 0.13, 1.0), 0.5)

# Frappe de clavier très douce (remplace clic) : petit « tok » boisé
tt = t(0.06)
ecrire("tape", np.sin(2 * np.pi * 1400 * tt) * np.exp(-tt * 120) + 0.3 * passe_bas(rng.standard_normal(len(tt)), 0.3) * np.exp(-tt * 300), 0.35)

# Nappe : accord de fa majeur qui monte doucement (remplace montee)
tt = t(1.6); p = tt / 1.6
nappe = sum(np.sin(2 * np.pi * NOTE(n) * tt * (1 + 0.002 * np.sin(2 * np.pi * 4 * tt + k))) for k, n in enumerate((FA - 12, DO - 12, FA, LA)))
ecrire("nappe", passe_bas(nappe, 0.15) * np.sin(np.pi / 2 * p) ** 2 * np.minimum(1, (1.6 - tt) / 0.25), 0.4)

# Logo : accord chaleureux posé + cloche (remplace boom)
tt = t(2.6)
accord = sum(marimba(n, 2.6, 0, 2.6) * a for n, a in ((FA - 12, 1), (DO - 12, 0.7), (FA, 0.6), (LA, 0.5)))
pad = sum(np.sin(2 * np.pi * NOTE(n) * tt) for n in (FA - 24, FA - 12, LA - 12)) * np.minimum(1, tt / 0.15) * np.exp(-tt * 1.4)
ecrire("logo-accord", accord + 0.35 * pad + 0.4 * cloche(DO + 12, 2.0, 0.05, 2.6), 0.6)

# Décollage adouci : souffle grave lointain, sans grondement
tt = t(2.6); p = tt / 2.6
d = passe_bas(passe_bas(rng.standard_normal(len(tt)), 0.03 + 0.06 * p), 0.3)
ecrire("decollage", d * np.sin(np.pi * p) ** 2, 0.4)
