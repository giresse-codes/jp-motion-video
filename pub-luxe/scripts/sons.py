"""Sons de « Le vrai luxe » (JP PREMIUM, ambiance LUXE), en pistes séparées (la voix reste sa propre piste) :
- assets/audio/nappe.wav : musique lounge synthétisée (piano électrique FM, basse ronde, shaker feutré),
  très basse, niveaux selon window.T.nappeNiveaux = [[temps, dB], ...] (rampes linéaires).
- assets/audio/sfx.wav : effets ASMR placés selon window.T.sfx = [[temps, "nom", gain_dB], ...].
Noms : portiere (clic de poignée et de serrure), cuir (crissement doux), clim (souffle d'air),
wifi (carillon de verre), pluie (gouttes sur la vitre, 2,5 s), glisse (roulement feutré, 2,6 s),
phares (relais + bourdonnement), souffle, glint (scintillement de chrome).
Tout est synthétisé ici (aucun fichier tiers). Usage (depuis le projet) : python3 scripts/sons.py
"""
import json, re, wave
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(7)
db = lambda v: 10 ** (v / 20)
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
N = int(T["duree"] * SR)

def tt(d):
    return np.arange(int(d * SR)) / SR

def norm(y):
    return y / (np.abs(y).max() + 1e-9)

def passe(y, f, type_):
    b, a = signal.butter(2, f / (SR / 2), type_); return signal.lfilter(b, a, y)

def bande(y, f0, f1):
    b, a = signal.butter(2, [f0 / (SR / 2), f1 / (SR / 2)], "band"); return signal.lfilter(b, a, y)

def resonance(y, f, q=12):
    b, a = signal.iirpeak(f / (SR / 2), q); return signal.lfilter(b, a, y)

def bruit(d):
    return rng.standard_normal(int(d * SR))

def ecrire(chemin, st, crete=0.5):
    st = st / (np.abs(st).max() + 1e-9) * crete
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st.T, -1, 1) * 32767).astype(np.int16).tobytes())

def poser(dest, son, t, g=0.0, pan=0.0):
    """son : mono (n,) ou stéréo (2, n)."""
    i = int(t * SR)
    if son.ndim == 1:
        son = np.vstack([son * np.cos((pan + 1) * np.pi / 4) * 1.414, son * np.sin((pan + 1) * np.pi / 4) * 1.414])
    n = min(son.shape[1], dest.shape[1] - i)
    if n > 0:
        dest[:, i:i + n] += son[:, :n] * db(g)

# ---------- Effets ASMR ----------
def clic(f=3200, d=0.06):
    t = tt(d); n = passe(bruit(d), 2000, "high") * np.exp(-t * 900)
    ring = (np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 1.47 * t)) * np.exp(-t * 70) * 0.25
    return n + ring

def portiere():
    d = 0.5; y = np.zeros(int(d * SR)); t = tt(d)
    thump = np.sin(2 * np.pi * 110 * t) * np.exp(-t * 35) * 0.9
    y += thump
    c1 = clic(3400); c2 = clic(2600)
    y[:len(c1)] += c1 * 0.8
    i = int(0.028 * SR); y[i:i + len(c2)] += c2
    return norm(y)

def cuir(d=0.75):
    t = tt(d); y = np.zeros(len(t))
    # glissement collant : impulsions à cadence variable, filtrées comme du cuir (résonances graves et moyennes)
    pos, k = 0.02, 0
    while pos < d - 0.02:
        a = np.sin(np.pi * pos / d) ** 1.5
        y[int(pos * SR)] += a * (0.6 + 0.4 * rng.random())
        pos += 1 / (35 + 90 * np.sin(np.pi * pos / d) + 20 * rng.random()); k += 1
    y = 0.6 * resonance(y, 520, 6) + 0.5 * resonance(y, 1150, 8) + 0.3 * resonance(y, 2300, 10)
    y += bande(bruit(d), 800, 4000) * 0.02 * np.sin(np.pi * t / d)
    return norm(y)

def clim(d=1.9):
    t = tt(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.2
    l = bande(bruit(d), 350, 5500) * env + passe(bruit(d), 6000, "high") * env * 0.25
    r = bande(bruit(d), 350, 5500) * env + passe(bruit(d), 6000, "high") * env * 0.25
    return np.vstack([norm(l), norm(r)])

def wifi(d=1.4):
    t = tt(d); att = np.clip(t / 0.03, 0, 1)
    y = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(1318.5, 1, 3), (1975.5, .6, 4), (2637, .25, 6), (3951, .1, 9)])
    return norm(y * att)

def pluie(d=2.6):
    st = np.zeros((2, int(d * SR))); t = tt(d)
    env = np.clip(t / 0.4, 0, 1) * np.clip((d - t) / 0.7, 0, 1)
    for _ in range(int(d * 32)):
        p = rng.random() * (d - 0.05); ld = 0.006 + rng.random() * 0.014; td = tt(0.05)
        goutte = bande(bruit(0.05), 1800, 7500) * np.exp(-td * (1 / ld))
        goutte += np.sin(2 * np.pi * (1500 + rng.random() * 2500) * td) * np.exp(-td * 120) * 0.25
        poser(st, goutte * (0.3 + 0.7 * rng.random()), p, 0, rng.uniform(-0.8, 0.8))
    lit = passe(bruit(d), 1200, "high")
    st += np.vstack([lit, passe(bruit(d), 1200, "high")]) * 0.035
    return st * env / (np.abs(st).max() + 1e-9)

def glisse(d=2.6):
    t = tt(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.8
    brun = np.cumsum(bruit(d)); brun = passe(brun - np.mean(brun), 30, "high")
    y = bande(brun, 50, 380) * env
    y = norm(y) + norm(bande(bruit(d), 600, 3000)) * 0.08 * env
    return norm(y)

def phares(d=1.2):
    t = tt(d); y = np.zeros(len(t))
    c = clic(1800, 0.05); y[:len(c)] += c * 0.9
    hum = sum(np.sin(2 * np.pi * f * t) / (k + 1) for k, f in enumerate([60, 120, 180, 240]))
    y += hum * np.clip((t - 0.04) / 0.25, 0, 1) * np.exp(-np.clip(t - 0.3, 0, None) * 3) * 0.35
    return norm(y)

def souffle(d=1.4):
    t = tt(d); env = np.sin(np.pi * t / d) ** 2
    fc = 500 + 2500 * t / d; y = np.zeros(len(t)); n = bruit(d)
    for i in range(0, len(t), 2400):
        y[i:i + 2400] = bande(n[i:i + 2400], fc[i] * 0.6, fc[i] * 1.4)
    return norm(y * env)

def glint(d=1.2):
    t = tt(d); att = np.clip(t / 0.15, 0, 1)
    y = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-t * 3.5) for f in [2793, 3520, 4186, 5274])
    return norm(y * att)

SONS = {"portiere": portiere, "cuir": cuir, "clim": clim, "wifi": wifi, "pluie": pluie,
        "glisse": glisse, "phares": phares, "souffle": souffle, "glint": glint}

# ---------- Musique lounge ----------
def rhodes(f, d):
    """Piano électrique FM : porteuse/modulante 1:1, indice qui décroît, petite « tine » aiguë."""
    t = tt(d); ind = 1.6 * np.exp(-t * 3) + 0.25
    y = np.sin(2 * np.pi * f * t + ind * np.sin(2 * np.pi * f * t)) * np.exp(-t * 0.9)
    y += 0.08 * np.sin(2 * np.pi * f * 7 * t) * np.exp(-t * 12)
    return y * np.clip(t / 0.008, 0, 1) * np.clip((d - t) / 0.3, 0, 1)

def nappe():
    st = np.zeros((2, N))
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    accords = [(50, [62, 65, 69, 72, 76]), (43, [65, 71, 74, 76]), (48, [64, 67, 71, 74]), (45, [60, 64, 67, 71])]  # Rém9 Sol13 Domaj9 Lam7
    mesure = 60 / 70 * 4
    k, t0 = 0, 0.0
    while t0 < T["duree"]:
        basse, notes = accords[k % 4]
        for j, m in enumerate(notes):
            poser(st, rhodes(hz(m), mesure + 0.4) * 0.22, t0 + j * 0.035, 0, -0.5 + j / max(1, len(notes) - 1))
        tb = tt(mesure); poser(st, np.sin(2 * np.pi * hz(basse - 12) * tb) * np.exp(-tb * 0.7) * 0.5 * np.clip((mesure - tb) / 0.2, 0, 1), t0)
        # shaker feutré sur les croches
        for c in range(8):
            ts = tt(0.08); sh = passe(bruit(0.08), 5000, "high") * np.exp(-ts * 45) * (0.05 if c % 2 else 0.03)
            poser(st, sh, t0 + c * mesure / 8, 0, 0.35)
        t0 += mesure; k += 1
    # niveaux (rampes linéaires)
    pts = T["nappeNiveaux"]; tps = np.arange(N) / SR
    st *= db(np.interp(tps, [p[0] for p in pts], [p[1] for p in pts]) + 24)
    return st

def main():
    sfx = np.zeros((2, N))
    for t, nom, g in T["sfx"]:
        poser(sfx, SONS[nom](), t, g)
    ecrire(ICI / "assets" / "audio" / "sfx.wav", sfx, 0.7)
    ecrire(ICI / "assets" / "audio" / "nappe.wav", nappe(), 0.35)
    print("assets/audio/sfx.wav, assets/audio/nappe.wav")

main()
