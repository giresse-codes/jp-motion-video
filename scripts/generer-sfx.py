"""Génère les effets sonores de la pub dans public/sfx/ (WAV 44,1 kHz).

Tous les sons sont synthétisés ici (bruit filtré, sinus, enveloppes) :
aucun fichier téléchargé, donc aucun problème de droits.
Usage : python3 scripts/generer-sfx.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path("public/sfx")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def passe_bas(x, coupure):
    """Filtre passe-bas à un pôle, coupure (Hz) scalaire ou variable dans le temps."""
    coupure = np.broadcast_to(coupure, x.shape)
    a = np.exp(-2 * np.pi * coupure / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a[i]) * v + a[i] * acc
        y[i] = acc
    return y


def passe_bande(x, centre):
    return passe_bas(x, centre * 1.6) - passe_bas(x, centre * 0.6)


def reverb(x, duree=1.2, mix=0.35):
    ir = rng.standard_normal(int(SR * duree)) * np.exp(-t(duree) * 5)
    wet = np.convolve(x, ir)[: len(x) + len(ir)]
    sec = np.concatenate([x, np.zeros(len(ir))])[: len(wet)]
    wet /= np.max(np.abs(wet)) + 1e-9
    return sec * (1 - mix) + wet * mix * np.max(np.abs(x))


def ecrire(nom, x, gain=0.9, sature=False):
    x = x / (np.max(np.abs(x)) + 1e-9)
    if sature:  # légère saturation pour les impacts (plus de punch)
        x = np.tanh(x * 1.6)
    x = x / np.max(np.abs(x)) * gain
    fondu = min(len(x), int(SR * 0.01))
    x[-fondu:] *= np.linspace(1, 0, fondu)
    with wave.open(str(OUT / f"{nom}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print(f"{nom}.wav  {len(x) / SR:.2f} s")


def whoosh(d=0.7, haut=4200, bas=500):
    tt = t(d)
    p = tt / d
    centre = bas + (haut - bas) * np.sin(np.pi * p) ** 1.5
    # Deux passes de filtre pour un souffle plus « coloré » qu'un bruit blanc.
    x = passe_bande(passe_bande(rng.standard_normal(len(tt)), centre), centre)
    env = np.sin(np.pi * p) ** 2 * (1 - 0.3 * p)
    return x * env


def impact(d=1.0, f0=70, f1=32, bruit=0.6):
    tt = t(d)
    freq = f1 + (f0 - f1) * np.exp(-tt * 9)
    sub = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 4.5)
    clic = passe_bas(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 40) * bruit
    return sub + clic


def cloche(freqs, d=0.9, amort=5.0):
    tt = t(d)
    x = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * amort * (1 + i * 0.6)) / (i + 1) for i, f in enumerate(freqs))
    return x * np.minimum(1, tt / 0.004)


OUT.mkdir(parents=True, exist_ok=True)

# Transitions et balayages
ecrire("whoosh", whoosh(0.7))
ecrire("whoosh-court", whoosh(0.4, haut=6000, bas=900), gain=0.8)
# Impacts : mots du slogan, badge
ecrire("impact", impact(), sature=True)
# Gros impact + traîne pour le logo final
ecrire("boom", reverb(impact(1.8, f0=60, f1=26, bruit=0.9), duree=1.6, mix=0.45), sature=True)

# Montée avant la promesse (bruit + sinus qui grimpent)
tt = t(1.1)
p = tt / 1.1
montee = passe_bande(rng.standard_normal(len(tt)), 400 + 5000 * p**2) * p**2
montee += np.sin(2 * np.pi * np.cumsum(180 + 900 * p**2) / SR) * p**3 * 0.5
ecrire("montee", montee, gain=0.75)

# Scintillement lumineux (reflets, logo)
tt = t(1.4)
scint = sum(
    np.sin(2 * np.pi * f * tt + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(5, 11) * tt))
    for f in rng.uniform(2500, 7000, 9)
)
ecrire("scintillement", scint * np.minimum(1, tt / 0.05) * np.exp(-tt * 2.6), gain=0.5)

# Glitch numérique (mots du problème)
tt = t(0.32)
carre = np.sign(np.sin(2 * np.pi * np.repeat(rng.uniform(80, 900, 16), len(tt) // 16 + 1)[: len(tt)] * tt))
hache = np.repeat(rng.random(40) > 0.35, len(tt) // 40 + 1)[: len(tt)]
glitch = (carre * 0.6 + rng.standard_normal(len(tt)) * 0.4) * hache
glitch = np.round(glitch * 6) / 6
ecrire("glitch", glitch * np.exp(-tt * 3), gain=0.6, sature=True)

# Tic d'horloge
tt = t(0.06)
ecrire("tic", passe_bande(rng.standard_normal(len(tt)), 3500) * np.exp(-tt * 120) + np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 150), gain=0.7)

# Bourdonnement de néon qui s'allume
tt = t(0.55)
scie = 2 * ((tt * 100) % 1) - 1
scintille = np.repeat(rng.random(14) > 0.3, len(tt) // 14 + 1)[: len(tt)]
ecrire("neon", passe_bas(scie, 1800) * scintille * np.exp(-tt * 1.5), gain=0.45)

# Pop doux (avantages cochés, icône)
tt = t(0.12)
ecrire("pop", np.sin(2 * np.pi * np.cumsum(500 + 900 * tt / 0.12) / SR) * np.exp(-tt * 38), gain=0.6)

# Tintement de caisse (prix)
ecrire("prix", cloche([1568, 2093, 3136, 4186], d=0.8, amort=6), gain=0.55)

# Bip du numéro
tt = t(0.11)
ecrire("bip", np.sin(2 * np.pi * 1046 * tt) * np.minimum(1, tt / 0.005) * np.exp(-tt * 22), gain=0.5)

# Notification (icône WhatsApp) : deux notes montantes, son original
ecrire("notif", np.concatenate([cloche([880, 1760], d=0.11, amort=18), cloche([1318, 2637], d=0.5, amort=8)]), gain=0.55)
