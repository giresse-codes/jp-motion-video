"""Bandes-son de la série motion design n° 11 à 30 (src/motion/), sans voix, entièrement synthétisées ici
(libres de droits) -> public/motion/pubNN.wav, 48 kHz stéréo, -14 LUFS intégrés, crête limitée à -1 dBFS.

Chaque pub a sa musique (chiptune, indie acoustique, hip-hop chill, piano minimal, « news », lo-fi, boîte à musique,
cinématique, bossa d'ascenseur, jazz swing) et ses effets calés sur les mêmes secondes que les scènes des fichiers
src/motion/PubNN*.tsx. Si on change un repère dans une scène, le changer aussi ici.
Musique fournie (optionnelle) : public/motion/musique.mp3 remplace la musique synthétisée des pubs 12 à 18 et 20.

Usage (depuis la racine) : python3 scripts/motion-sons.py [11 12 ...]   (sans argument : les dix)
Prérequis : numpy, scipy, pyloudnorm, ffmpeg (seulement pour musique.mp3).
"""
import math, subprocess, sys, wave
from pathlib import Path
import numpy as np
import pyloudnorm as pyln
from scipy import signal
from scipy.ndimage import minimum_filter1d

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "public" / "motion"
SR = 48000
rng = np.random.default_rng(7)
tt = lambda d: np.arange(max(1, int(d * SR))) / SR
db = lambda v: 10 ** (v / 20)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)


def hasard(n):
    """Même pseudo-aléatoire que hasard() dans src/motion/commun.tsx."""
    x = math.sin(n * 127.1 + 311.7) * 43758.5453
    return x - math.floor(x)


# ── Filtres ──
def pb(y, f, o=2):
    b, a = signal.butter(o, min(f, SR / 2 - 100) / (SR / 2)); return signal.lfilter(b, a, y)
def ph(y, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), "high"); return signal.lfilter(b, a, y)
def pbande(y, f0, f1, o=2):
    b, a = signal.butter(o, [f0 / (SR / 2), min(f1, SR / 2 - 100) / (SR / 2)], "band"); return signal.lfilter(b, a, y)
def som(*xs):
    """Somme de sons de longueurs différentes."""
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[: len(x)] += x
    return out
def retard(x, d):
    return np.pad(x, (int(d * SR), 0))
def norm(y):
    return y / (np.abs(y).max() + 1e-9)
def bruit(d):
    return rng.standard_normal(int(d * SR))
def env(d, a=0.005, r=None, courbe=6.0):
    t = tt(d); e = np.minimum(1, t / max(a, 1e-4))
    return e * np.exp(-t * courbe / (r or d))


class Piste:
    def __init__(self, duree):
        self.n = int(duree * SR); self.y = np.zeros((2, self.n)); self.duree = duree
    def pose(self, son, t, g=0.0, pan=0.0):
        if son.ndim == 1: son = np.vstack([son * math.cos((pan + 1) * math.pi / 4) * 1.414, son * math.sin((pan + 1) * math.pi / 4) * 1.414])
        i = int(t * SR); n = min(son.shape[1], self.n - i)
        if n > 0 and i >= 0: self.y[:, i:i + n] += son[:, :n] * db(g)
        elif i < 0 and son.shape[1] + i > 0:
            m = min(son.shape[1] + i, self.n); self.y[:, :m] += son[:, -i:-i + m] * db(g)


def reverb(st, duree=1.2, mix=0.25, clair=6000):
    out = np.zeros_like(st); ir_t = tt(duree)
    for c in range(2):
        ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 6.9 / duree); ir = pb(ir, clair); ir /= np.sqrt((ir ** 2).sum())
        out[c] = signal.fftconvolve(st[c], ir)[: st.shape[1]]
    return st * (1 - mix * 0.3) + out * mix


# ── Instruments ──
def kick(d=0.4, f0=150, f1=45, g=1.0):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 30); ph_ = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph_) * np.exp(-t * 9) * g + pb(bruit(d), 2000) * np.exp(-t * 120) * 0.2
def caisse(d=0.25, ton=190):
    t = tt(d); return 0.5 * np.sin(2 * np.pi * ton * t) * np.exp(-t * 25) + pbande(bruit(d), 1200, 8000) * np.exp(-t * 18) * 0.8
def charley(d=0.06, ouvert=False):
    d = 0.3 if ouvert else d; t = tt(d); return ph(bruit(d), 7000) * np.exp(-t * (12 if ouvert else 70)) * 0.5
def clap(d=0.3):
    t = tt(d); e = np.exp(-t * 30) + 0.5 * np.exp(-((t - 0.012) % 0.011) * 300) * (t < 0.035)
    return pbande(bruit(d), 900, 5000) * e
def balai(d=0.18):
    t = tt(d); return pbande(bruit(d), 2000, 9000) * np.exp(-t * 14) * 0.5
def ride(d=0.6):
    t = tt(d); y = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in [3150, 4720, 5980, 7310])
    return (y * 0.2 + ph(bruit(d), 6000) * 0.4) * np.exp(-t * 6)
def carre(f, d, duty=0.5, dec=4.0):
    t = tt(d); return np.where((t * f) % 1 < duty, 1.0, -1.0) * np.exp(-t * dec) * np.minimum(1, t / 0.003)
def triangle(f, d, dec=3.0):
    t = tt(d); return (2 * np.abs(2 * ((t * f) % 1) - 1) - 1) * np.exp(-t * dec)
def pince(f, d, brillance=0.5):
    """Corde pincée (Karplus-Strong)."""
    n = int(d * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); buf = pb(buf, 3000 + brillance * 6000)
    out = np.zeros(n); k = 0.996
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = k * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out
def piano(f, d, vel=1.0):
    t = tt(d); y = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t * (1 + 0.0004 * k * k)) * np.exp(-t * (1.5 + k * 1.4)) for k in range(6))
    return y * np.minimum(1, t / 0.004) * vel
def rhodes(f, d, vel=1.0):
    t = tt(d); mod = np.sin(2 * np.pi * f * t) * 1.2 * np.exp(-t * 5)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.2) * np.minimum(1, t / 0.006) * vel
def cloche(f, d=1.5, vel=1.0):
    t = tt(d); return (np.sin(2 * np.pi * f * t) * np.exp(-t * 3) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 10)) * vel
def nappe(fs, d, ouv=1200):
    t = tt(d); y = sum(sum(np.sin(2 * np.pi * f * (1 + dt) * t + rng.random() * 6) for dt in (-0.004, 0, 0.005)) for f in fs)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)
    return pb(y, ouv) * e / (len(fs) * 3)
def basse(f, d, dec=3.0):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * dec) * np.minimum(1, t / 0.005)
def cuivre(fs, d):
    t = tt(d); y = sum(signal.sawtooth(2 * np.pi * f * t) for f in fs) / len(fs)
    return pb(y, 2500) * np.minimum(1, t / 0.02) * np.exp(-t * 4)


# ── Effets ──
def whoosh(d=0.5, f0=300, f1=4000, montant=False):
    t = tt(d); e = (t / d) ** 2 if montant else np.sin(np.pi * t / d) ** 2
    y = bruit(d); fc = f0 + (f1 - f0) * (t / d)
    out = np.zeros_like(y); bloc = 1024
    for i in range(0, len(y), bloc):
        f = fc[min(i, len(fc) - 1)]; out[i:i + bloc] = pbande(y[max(0, i - 2048):i + bloc], f * 0.6, f * 1.6)[-len(y[i:i + bloc]):]
    return out * e
def clic(f=3000, d=0.03):
    t = tt(d); return (np.sin(2 * np.pi * f * t) * 0.6 + ph(bruit(d), 2000) * 0.6) * np.exp(-t * 220)
def pop(f=900, d=0.08):
    t = tt(d); fr = f * (1 + 2 * np.exp(-t * 60)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 45)
def bip(f, d=0.12):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.minimum(1, (d - t) / 0.01) * np.minimum(1, t / 0.003)
def impact(d=1.2, f=55):
    t = tt(d); return kick(d, 120, f) * 1.0 + pb(bruit(d), 600) * np.exp(-t * 5) * 0.4
def riser(d=1.0):
    return whoosh(d, 200, 6000, montant=True)
def tonnerre(d=3.0):
    t = tt(d); y = pb(bruit(d), 400, 3) * (np.exp(-t * 1.6) + 0.6 * np.exp(-np.maximum(0, t - 0.25) * 2.5) * (t > 0.25))
    return y + pb(bruit(d), 3000) * np.exp(-t * 25) * 0.6
def pluie(d):
    y = pbande(bruit(d), 800, 9000) * 0.25
    gouttes = np.zeros(int(d * SR)); idx = rng.integers(0, len(gouttes), int(d * 900)); gouttes[idx] = rng.uniform(-1, 1, len(idx))
    return y + ph(gouttes, 3000) * 0.6
def craquements(d):
    y = np.zeros(int(d * SR)); idx = rng.integers(0, len(y), int(d * 40)); y[idx] = rng.uniform(-1, 1, len(idx))
    return pbande(y, 1500, 9000) * 2 + pb(bruit(d), 300) * 0.02
def scratch(d=0.22):
    t = tt(d); vit = np.sin(np.pi * t / d)
    return pbande(bruit(d), 400, 3000) * vit * 0.7 + np.sin(2 * np.pi * np.cumsum(300 + 600 * vit) / SR) * 0.3 * vit
def sable(d):
    y = np.zeros(int(d * SR)); idx = rng.integers(0, len(y), int(d * 6000)); y[idx] = rng.uniform(-1, 1, len(idx))
    return pbande(y, 2500, 12000) * 0.8 + pbande(bruit(d), 3000, 9000) * 0.08
def frottement(d):
    t = tt(d); return pbande(bruit(d), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t) ** 2) * np.sin(np.pi * t / d)
def moteur(d, f=60, aigu=False):
    t = tt(d); y = signal.square(2 * np.pi * f * t * (1 + 0.05 * np.sin(2 * np.pi * 7 * t)), 0.3)
    return pb(y, 2200 if aigu else 700) * 0.4
def ding(f=1318.5):
    return cloche(f, 1.6) + cloche(f * 0.8, 1.6) * 0.0
def melange(d):
    """Mélange de cartes (riffle) : salve de petits clics."""
    y = np.zeros(int(d * SR))
    for k in range(int(d * 55)):
        i = int(k / 55 * SR + rng.integers(0, 200)); c = clic(2500 + rng.random() * 2000, 0.02) * (0.5 + rng.random() * 0.5)
        y[i:i + len(c)] += c[: len(y) - i]
    return y
def flip():
    return som(pb(whoosh(0.12, 800, 5000), 8000) * 0.8, clic(1800, 0.02))


def melodie(notes, instr, pas, debut, piste, g=0.0, pan=0.0, fin=None):
    """notes : liste de (temps en pas, midi, durée en pas) ; joue jusqu'à `fin` (s)."""
    for (k, m, d) in notes:
        t = debut + k * pas
        if fin is not None and t >= fin: break
        if m is None: continue
        piste.pose(instr(mtof(m), d * pas + 0.05), t, g, pan)


def boucle(motif, longueur, debut, fin):
    """Répète un motif (liste de (pas, ...)) de `longueur` pas entre debut et fin."""
    out = []; r = 0
    while True:
        for e in motif:
            out.append((e[0] + r * longueur,) + tuple(e[1:]))
        r += 1
        if r * longueur > 4000: break
    return out


def batterie(p, bpm, debut, fin, motif="kshs", g=-6.0, swing=0.0, sons=None):
    """Motif sur 16 doubles-croches : k = grosse caisse, s = caisse claire, h = charley, c = clap, . = rien."""
    pas = 60 / bpm / 4; sons = sons or {"k": kick, "s": caisse, "h": charley, "c": clap, "b": balai, "r": ride}
    i = 0
    while debut + i * pas < fin:
        t = debut + i * pas + (pas * swing if i % 2 else 0); ch = motif[i % len(motif)]
        for c in ch:
            if c in sons: p.pose(sons[c](), t, g + (-6 if c == "h" else 0), 0.2 if c == "h" else 0)
        i += 1


def accords(p, instr, progression, bpm, debut, fin, g=-12.0, temps_par_accord=4, rythme=(0,)):
    pas = 60 / bpm; t = debut; k = 0
    while t < fin:
        acc = progression[k % len(progression)]
        for r in rythme:
            tr = t + r * pas
            if tr < fin:
                for m in acc: p.pose(instr(mtof(m), pas * temps_par_accord * 0.9), tr, g, (m % 7 - 3) * 0.08)
        t += pas * temps_par_accord; k += 1


def musique_fournie(duree):
    f = SORTIE / "musique.mp3"
    if not f.exists(): return None
    brut = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(f), "-t", str(duree), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    y = np.frombuffer(brut, np.float32).reshape(-1, 2).T.astype(float)
    out = np.zeros((2, int(duree * SR))); out[:, : y.shape[1]] = y[:, : out.shape[1]]
    return out / (np.abs(out).max() + 1e-9) * 0.5


def finaliser(p, nom, musique=None, g_musique=-8.0, sourdine=(), periodique=False):
    y = p.y.copy()
    if musique is not None:
        m = musique.copy()
        for (a, b) in sourdine: m[:, int(a * SR):int(b * SR)] = 0
        y += m * db(g_musique)
    n0 = y.shape[1]
    if periodique: y = np.tile(y, 3)  # boucle parfaite : on traite trois périodes et on garde celle du milieu
    y = np.vstack([ph(y[0], 25), ph(y[1], 25)])
    mesure = pyln.Meter(SR)
    for _ in range(3):
        lufs = mesure.integrated_loudness(y.T); y *= db(-14 - lufs)
        # limiteur simple : gain qui suit l'enveloppe de crête (attaque instantanée, relâchement 80 ms)
        crete = np.abs(y).max(axis=0); cible = db(-1.0)
        gain = minimum_filter1d(np.minimum(1, cible / np.maximum(crete, 1e-9)), int(0.004 * SR))
        k = math.exp(-1 / (0.06 * SR))
        gain = np.minimum(gain, 1 - signal.lfilter([1 - k], [1, -k], 1 - gain))
        y *= gain
    if periodique: y = y[:, n0:2 * n0]
    for (a, b) in sourdine: y[:, int(a * SR):int(b * SR)] = 0
    y = np.clip(y, -1, 1)
    SORTIE.mkdir(parents=True, exist_ok=True)
    with wave.open(str(SORTIE / nom), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y.T * 32767).astype(np.int16).tobytes())
    print(f"{nom} : {pyln.Meter(SR).integrated_loudness(y.T):.1f} LUFS, crête {20 * np.log10(np.abs(y).max()):.1f} dBFS")


# ═════════ Pubs ═════════
def pub11():
    D = 12; p = Piste(D); mus = Piste(D)
    go = [(0, 72, 1), (1, 67, 1), (2, 64, 1), (3, 60, 3)]  # jingle « game over » descendant
    melodie(go, lambda f, d: carre(f, d, 0.5, 3), 0.12, 0.0, p, -4)
    melodie(go, lambda f, d: carre(f, d, 0.5, 3), 0.12, 11.75, p, -4)
    bourdon = pb(signal.square(2 * np.pi * 60 * tt(1.5)), 400) * 0.25 + ph(bruit(1.5), 8000) * 0.03  # écran cathodique qui ronfle
    p.pose(bourdon * np.minimum(1, (1.5 - tt(1.5)) / 0.2), 0.0, -10)
    for t in (1.5, 2.0, 2.5): p.pose(carre(880, 0.12, 0.25, 8), t, -6)
    p.pose(carre(1320, 0.15, 0.25, 6), 2.6, -4); p.pose(carre(1760, 0.1, 0.25, 6), 2.68, -4)
    for i in range(4): p.pose(carre(660 + i * 110, 0.06, 0.25, 20), 3.2 + i * 0.3, -10)
    for i, t in enumerate([4.5, 4.75]): p.pose(carre(990, 0.05, 0.25, 20), t, -10)
    p.pose(carre(1320, 0.18, 0.5, 6), 5.0, -6)
    for k in range(3):
        for q in range(8): p.pose(carre(500 + q * 90 + k * 60, 0.04, 0.25, 30), 5.2 + k * 0.35 + q / 12, -14)
    t = tt(0.45); saut = np.where((np.cumsum(300 + 900 * t / 0.45) / SR) % 1 < 0.5, 1.0, -1.0) * np.exp(-t * 4); p.pose(saut, 7.6, -8)
    for tc in (7.45, 8.3, 9.0):
        p.pose(carre(mtof(83), 0.07, 0.5, 10), tc, -8); p.pose(carre(mtof(88), 0.25, 0.5, 8), tc + 0.07, -8)
    fanfare = [(0, 72, 1), (1, 76, 1), (2, 79, 1), (3, 84, 4)]
    melodie(fanfare, lambda f, d: carre(f, d, 0.5, 1.5), 0.11, 9.5, p, -5)
    melodie([(0, 60, 1), (1, 64, 1), (2, 67, 1), (3, 72, 4)], lambda f, d: triangle(f, d, 1.5), 0.11, 9.5, p, -6)
    # Chiptune 150 BPM : arpèges carrés, basse triangle, batterie au bruit
    pas = 60 / 150 / 4; prog_ = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
    t0 = 1.5; i = 0
    while t0 + i * pas < 11.7:
        acc = prog_[(i // 16) % 4]; tc = t0 + i * pas
        mus.pose(carre(mtof(acc[i % 3] + 12), pas * 0.9, 0.25, 6), tc, -12)
        if i % 4 == 0: mus.pose(triangle(mtof(acc[0] - 12), pas * 3.5, 1), tc, -6)
        if i % 8 == 0: mus.pose(pb(bruit(0.08), 800) * np.exp(-tt(0.08) * 40), tc, -6)
        if i % 8 == 4: mus.pose(ph(bruit(0.1), 2000) * np.exp(-tt(0.1) * 30), tc, -8)
        if i % 2 == 1: mus.pose(ph(bruit(0.02), 6000) * np.exp(-tt(0.02) * 100), tc, -16)
        if (i // 16) % 2 == 1 and i % 2 == 0: mus.pose(carre(mtof([72, 76, 79, 76, 74, 72, 71, 67][(i // 2) % 8]), pas * 1.8, 0.5, 3), tc, -13)
        i += 1
    finaliser(p, "pub11.wav", mus.y, 0, sourdine=())


def pub12():
    D = 12; p = Piste(D); mus = Piste(D)
    obturateur = lambda: som(clic(1500, 0.02), retard(clic(900, 0.03), 0.045) * 0.8)
    flash = lambda: whoosh(0.4, 3000, 9000) * 0.25
    for t in (0.0, 11.82): p.pose(obturateur(), t, -2); p.pose(flash(), t, -10)
    for (a, b) in ((0.05, 1.05), (9.4, 10.0)):
        p.pose(moteur(b - a, 95, True) * np.sin(np.pi * tt(b - a) / (b - a)) ** 0.3, a, -12)
    for k, t in enumerate((3.6, 4.3, 5.0)):
        p.pose(whoosh(0.45, 400, 2500) * 0.6, t, -14)
        p.pose(pb(bruit(0.06), 1500) * np.exp(-tt(0.06) * 60) + pop(300, 0.06) * 0.4, t + 0.45, -6)
        if k % 2 == 0: p.pose(som(pop(1200, 0.05), clic(2500, 0.02)), t + 0.5, -8)   # punaise
        else: p.pose(pbande(bruit(0.35), 1500, 7000) * np.exp(-tt(0.35) * 4), t + 0.5, -12)  # scotch qui se déroule
    p.pose(som(pop(1100, 0.05), clic(2500, 0.02)), 3.9, -8)
    for (a, b) in ((2.5, 3.2), (5.4 + 1.6, 5.4 + 2.4), (8.8, 9.3), (4.3 + 1.6, 4.3 + 2.4)):
        d = b - a; t = tt(d); p.pose(pbande(bruit(d), 2500, 8000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 9 * t))) * 0.5, a, -16)
    p.pose(frottement(1.2) * 0.4, 8.0, -18)
    p.pose(cloche(1568, 1.5), 10.9, -8); p.pose(cloche(2093, 1.5), 11.0, -12)
    musique = musique_fournie(D)
    if musique is None:
        prog_ = [(55, 59, 62, 67), (52, 55, 59, 64), (48, 52, 55, 60), (50, 54, 57, 62)]
        bpm = 100; pas = 60 / bpm / 2; i = 0
        while i * pas < D:
            acc = prog_[(i // 8) % 4]; mus.pose(pince(mtof(acc[[0, 2, 1, 3, 2, 1, 3, 2][i % 8]]), 1.2, 0.4), i * pas + 0.35, -10, -0.2 + 0.1 * (i % 4))
            i += 1
        batterie(mus, bpm, 0.35, D, "k...h...s..hk.h.", -12, sons={"k": lambda: kick(0.3, 110, 50, 0.7), "s": balai, "h": lambda: charley(0.04)})
        musique = reverb(mus.y, 1.0, 0.2)
    finaliser(p, "pub12.wav", musique, -6)


def pub13():
    D = 12; p = Piste(D); mus = Piste(D)
    p.pose(som(clic(400, 0.05) * 1.5, pb(bruit(0.1), 900) * np.exp(-tt(0.1) * 40)), 0.28, -2)  # saphir
    for t in (0.3, 3.0, 4.25, 5.5, 6.75): p.pose(scratch(0.22), t, -3 if t < 1 else -6)
    p.pose(craquements(D), 0, -18)
    p.pose(whoosh(0.6, 200, 1200), 11.4, -16)  # bras qui revient
    musique = musique_fournie(D)
    if musique is None:
        bpm = 90; temps = 60 / bpm
        motifs = ["k..h.hs.k.kh.hs.", "k.h.k.h.s..hk.hs", "k..hh.s.kkh.h.sh", "k.hhk.hhs.hhk.hs"]
        prog_ = [(57, 60, 64, 67), (53, 57, 60, 64), (55, 59, 62, 65), (52, 55, 59, 62)]
        bornes = [0.5, 3.0, 4.25, 5.5, 6.75, 11.2]
        for k in range(5):
            a, b = bornes[k], bornes[k + 1]
            batterie(mus, bpm + k * 2, a, b, motifs[k % 4], -6, swing=0.18)
            accords(mus, rhodes, [prog_[k % 4], prog_[(k + 1) % 4]], bpm, a, b, -14, 2, (0, 1.5))
            t = a
            while t < b:
                mus.pose(basse(mtof(prog_[k % 4][0] - 24), temps * 0.9), t, -6); t += temps
        # arrêt de platine : la musique ralentit et descend en hauteur (9,5 – 11,1 s)
        y = mus.y; a = int(9.5 * SR); n = int(1.6 * SR)
        vit = np.clip(1 - np.arange(n) / n, 0, 1); pos = a + np.cumsum(vit)
        for c in range(2):
            seg = np.interp(pos, np.arange(y.shape[1]), y[c]); y[c, a:a + n] = seg * np.linspace(1, 0.2, n); y[c, a + n:] = 0
        musique = y
    finaliser(p, "pub13.wav", musique, -4)


def pub14():
    D = 12; p = Piste(D); mus = Piste(D)
    p.pose(frottement(2.5) * 0.5, 1.5, -18)
    p.pose(whoosh(1.3, 300, 1800), 4.0, -10)
    for k in range(3): p.pose(pb(bruit(0.04), 2000) * np.exp(-tt(0.04) * 80), 5.35 + k * 0.15, -18)
    clac = som(clic(2200, 0.025) * 1.6, kick(0.25, 160, 70, 0.8) * 0.8, pbande(bruit(0.05), 1000, 4000) * np.exp(-tt(0.05) * 90))
    p.pose(clac, 5.8, 0)
    p.pose(nappe([mtof(72), mtof(79), mtof(84)], 1.4, 5000) * 2, 5.8, -10)
    p.pose(riser(0.5), 9.0, -10); p.pose(whoosh(0.6, 500, 4000), 9.35, -10)
    p.pose(whoosh(0.5, 3000, 500), 11.45, -12); p.pose(clac * 0.5, 11.9, -10)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 96; pas = 60 / bpm / 2
        mel = [69, None, 72, 76, None, 74, 72, None, 69, None, 67, 71, None, 72, 74, None]
        for i in range(int(D / pas)):
            m = mel[i % 16]
            if m: mus.pose(piano(mtof(m), 1.6, 0.7), i * pas, -10, 0.15)
            if i % 8 == 0: mus.pose(piano(mtof([45, 41, 43, 40][(i // 8) % 4]), 3.0, 0.9), i * pas, -8, -0.15)
        batterie(mus, bpm, 4.0, D, "k.......s.....h.k.k.....s...h...", -12, sons={"k": lambda: kick(0.3, 120, 50, 0.8), "s": clap, "h": lambda: charley(0.04)})
        musique = reverb(mus.y, 1.6, 0.25)
    finaliser(p, "pub14.wav", musique, -6)


def pub15():
    D = 12; p = Piste(D); mus = Piste(D)
    pl = pluie(4.8); pl[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR)); p.pose(pl, 0, -8)
    p.pose(pluie(0.4) * np.linspace(0, 1, int(0.4 * SR)), 11.6, -8)
    p.pose(tonnerre(3.0), 0, 0); p.pose(tonnerre(0.1 * 10)[: int(0.1 * SR)], 11.9, 0)
    p.pose(whoosh(1.1, 200, 1500) * 1.2, 3.5, -4)
    t = tt(0.25); p.pose(np.sin(2 * np.pi * np.cumsum(900 + 300 * np.sin(2 * np.pi * 14 * t)) / SR) * np.sin(np.pi * t / 0.25) * 0.3, 4.4, -14)  # caoutchouc
    jingle = [(0, 72, 1), (1, 76, 1), (2, 79, 2), (4, 84, 4)]
    melodie(jingle, lambda f, d: cuivre([f, f * 1.5], d), 0.12, 5.0, p, -6)
    for t in (1.8, 5.6, 6.3, 7.0): p.pose(pop(1000, 0.08), t, -6)
    p.pose(whoosh(0.4, 600, 3000), 9.1, -12)
    p.pose(nappe([mtof(76), mtof(83), mtof(88)], 2.5, 7000) * 1.5, 9.2, -14)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 110
        batterie(mus, bpm, 4.6, 11.6, "k...h.h.s...h.h.k.k.h.h.s...h.hh", -9)
        accords(mus, lambda f, d: cuivre([f], d), [(60, 64, 67), (65, 69, 72), (62, 65, 69), (67, 71, 74)], bpm, 4.6, 11.6, -16, 2, (0, 0.5, 1.5))
        t = 4.6
        while t < 11.6: mus.pose(basse(mtof(36), 60 / bpm * 0.4, 5), t, -8); t += 60 / bpm / 2
        mus.pose(nappe([mtof(48), mtof(55)], 3.6, 500), 0.4, -6)
        musique = mus.y
    finaliser(p, "pub15.wav", musique, -6)


def frappe_instants(texte, debut, vitesse):
    out = []; t = debut
    for i, ch in enumerate(texte):
        t += vitesse * (0.55 + hasard(i * 3.7 + debut) * 1.0) + (vitesse * 1.5 if ch == " " else 0); out.append(t)
    return out


def pub16():
    D = 12; p = Piste(D); mus = Piste(D)
    touche = lambda k: som(clic(1800 + 600 * hasard(k), 0.025), pb(bruit(0.03), 1200) * np.exp(-tt(0.03) * 120) * 0.6)
    tapes = [("sudo arrête-de-conduire", 0.05, 0.015), ("jp reserve --service=confort --heure=9h", 5.5, 0.022), ("jp tarifs", 8.0, 0.04),
             ("Écris « JP » sur WhatsApp", 9.6, 0.02), ("+237", 10.15, 0.03), ("655 394 028", 10.3, 0.028), ("↓ Réserve maintenant ↓", 10.75, 0.018)]
    for (txt, deb, vit) in tapes:
        for k, t in enumerate(frappe_instants(txt, deb, vit)): p.pose(touche(k + deb * 10), t, -10, (hasard(k) - 0.5) * 0.4)
    p.pose(som(bip(988, 0.1), retard(bip(988, 0.1), 0.14)), 1.5, -8)
    for i in range(20): p.pose(clic(2600 + i * 40, 0.02), 3.0 + i * 1.1 / 20, -14)
    for t in (4.2, 4.6, 5.0, 7.0): p.pose(som(bip(1320, 0.06), retard(bip(1760, 0.08), 0.06)), t, -10)
    g = pbande(bruit(0.15), 500, 6000) * signal.square(2 * np.pi * 40 * tt(0.15)); p.pose(g, 9.42, -8)
    p.pose(impact(1.0, 50), 10.62, -4)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 85
        batterie(mus, bpm, 0.0, 9.42, "k.....h.s...h.k.k.h...h.s.....h.", -10, swing=0.2, sons={"k": lambda: pb(kick(0.35, 110, 48), 3000), "s": lambda: pb(caisse(0.2, 200), 5000), "h": lambda: pb(charley(0.05), 9000)})
        accords(mus, lambda f, d: pb(rhodes(f, d, 0.8), 2500), [(57, 60, 64, 67), (53, 57, 60, 64), (55, 58, 62, 65), (52, 55, 59, 62)], bpm, 0.0, 9.42, -14, 4, (0,))
        accords(mus, lambda f, d: pb(rhodes(f, d, 0.8), 2500), [(57, 60, 64, 67)], bpm, 9.6, D, -16, 4, (0,))
        mus.pose(ph(bruit(D), 4000) * 0.01, 0, 0)
        musique = mus.y
    finaliser(p, "pub16.wav", musique, -7)


def y_voiture(t):
    io = lambda x: 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2
    pr = lambda a, b: min(1, max(0, (t - a) / (b - a)))
    if t < 1.5: return 150 + (60 - 150) * pr(0, 1.5) ** 3
    if t < 5: return 60 + (-2380 - 60) * io(pr(1.5, 5))
    return -2380 - 180 * (1 - (1 - pr(5, 6.2)) ** 3)


def pub17():
    D = 15; p = Piste(D); mus = Piste(D)
    p.pose(pb(bruit(D), 700) * 0.15 + pbande(bruit(D), 1500, 4000) * 0.02, 0, -12)  # ville lointaine
    m = moteur(6.2, 38, True) * np.minimum(1, tt(6.2) / 0.2); m[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR)); p.pose(m, 0, -16)
    m2 = moteur(0.5, 38, True) * np.linspace(0, 1, int(0.5 * SR)); p.pose(m2, 14.5, -16)
    for ye in (-60, -950, -1700):
        t = next(k / 40 for k in range(600) if y_voiture(k / 40) <= ye + 120); p.pose(pop(1000, 0.09), t, -6)
    for t in (5.6, 8.6, 10.6): p.pose(pop(800, 0.1), t, -6)
    av = moteur(2.6, 140, True) * np.sin(np.pi * tt(2.6) / 2.6); p.pose(pbande(av, 400, 3000), 6.0, -14)
    vagues = pb(bruit(2.2), 1200) * (0.4 + 0.6 * np.sin(np.pi * tt(2.2) / 1.1) ** 2) * np.sin(np.pi * tt(2.2) / 2.2); p.pose(vagues, 8.4, -10)
    p.pose(cloche(1046.5, 2.0) + cloche(1568, 2.0) * 0.6, 12.6, -6)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 100; pas = 60 / bpm / 2
        mel = [76, 79, 84, 83, 79, 76, 74, 76, 72, 76, 79, 77, 76, 74, 72, None]
        for i in range(int(D / pas)):
            mm = mel[i % 16]
            if mm: mus.pose(cloche(mtof(mm), 1.0, 0.6), i * pas, -10, 0.2)
            if i % 4 == 0: mus.pose(cloche(mtof([60, 57, 53, 55][(i // 8) % 4]), 1.6, 0.5), i * pas, -12, -0.2)
        batterie(mus, bpm, 1.5, 14.6, "k...c...k.k.c...", -12, sons={"k": lambda: kick(0.3, 120, 55, 0.7), "c": clap})
        musique = reverb(mus.y, 1.2, 0.2)
    finaliser(p, "pub17.wav", musique, -6)


def pub18():
    D = 10; p = Piste(D); mus = Piste(D)
    pivot = lambda: som(pb(bruit(0.35), 900) * np.exp(-tt(0.35) * 9) * 0.8, kick(0.3, 90, 50, 0.5), cloche(2400, 0.8, 0.12))
    p.pose(whoosh(0.4, 200, 900), 0.0, -10); p.pose(pivot(), 0.4, -2)
    s = sable(3.05); s[: int(0.1 * SR)] *= np.linspace(0, 1, int(0.1 * SR)); p.pose(s, 0.45, -10)
    r = sable(1.8)[::-1] * np.linspace(0, 1, int(1.8 * SR)) ** 2; p.pose(r, 5.0, -10)
    p.pose(whoosh(1.8, 300, 3000, montant=True) * 0.5, 5.0, -16)
    for k in range(6): p.pose(cloche(mtof(88 + [0, 4, 7, 12, 7, 16][k]), 1.2, 0.4), 6.4 + k * 0.06, -12)
    p.pose(impact(1.4, 48) * 0.7, 8.5, -6)
    p.pose(whoosh(0.4, 200, 900), 9.62, -10)
    musique = musique_fournie(D)
    if musique is None:
        mus.pose(nappe([mtof(38), mtof(45), mtof(50)], 3.5, 700) * 2, 0, -6)
        mus.pose(nappe([mtof(41), mtof(48), mtof(53), mtof(57)], 5.0, 900) * 2, 5.0, -6)
        for t, mm in ((0.4, 62), (1.6, 65), (2.6, 69), (5.0, 60), (6.4, 72), (7.5, 69), (8.5, 74)): mus.pose(piano(mtof(mm), 3, 0.6), t, -10)
        musique = reverb(mus.y, 2.5, 0.35)
    finaliser(p, "pub18.wav", musique, -6, sourdine=((3.5, 3.8),))


def pub19():
    D = 10; p = Piste(D); mus = Piste(D)
    for i in range(8): p.pose(bip(1175, 0.05), i * 0.24, -16)
    p.pose(som(cloche(1318.5, 2.0), retard(cloche(1046.5, 1.8), 0.25)), 1.9, 0)
    for (a, d) in ((3.0, 1.7), (7.5, 1.1)):
        t = tt(d); p.pose(pb(bruit(d), 900) * np.sin(np.pi * t / d) * 0.6 + moteur(d, 50) * 0.15 * np.sin(np.pi * t / d), a, -8)
    p.pose(som(pb(bruit(0.12), 400) * np.exp(-tt(0.12) * 25), kick(0.25, 80, 45, 0.4)), 8.6, -8)
    p.pose(pb(bruit(4.5), 500) * 0.12, 3.0, -10)   # ambiance du hall
    p.pose(som(kick(0.3, 70, 40, 0.5), pb(bruit(0.15), 300) * np.exp(-tt(0.15) * 30)), 5.6, -12)   # portière feutrée
    p.pose(cloche(1318.5, 1.0, 0.4), 9.7, -12)
    bpm = 126; pas = 60 / bpm
    prog_ = [(50, 57, 60, 65), (55, 59, 62, 65), (48, 55, 59, 64), (45, 52, 55, 61)]
    for k in range(int(D / (pas * 4)) + 1):
        acc = prog_[k % 4]; t0 = k * pas * 4
        mus.pose(basse(mtof(acc[0] - 12), pas * 1.4, 3), t0, -6); mus.pose(basse(mtof(acc[0] - 5), pas * 1.4, 3), t0 + pas * 2, -7)
        for r in (0, 0.75, 1.5, 2.5, 3.25):  # comping bossa (en temps)
            for m in acc[1:]: mus.pose(pince(mtof(m), 0.6, 0.2), t0 + r * pas, -14, 0.1)
    batterie(mus, bpm, 0, D, "b.bbb.b.b.bbb.bb", -14, sons={"b": balai})
    melodie([(0, 74, 2), (2, 72, 1), (3, 71, 3), (6, 69, 2), (8, 72, 2), (10, 71, 1), (11, 69, 3), (14, 67, 2)], lambda f, d: rhodes(f, d, 0.6), pas, 0.2, mus, -14, fin=D)
    finaliser(p, "pub19.wav", reverb(mus.y, 0.9, 0.15), -8)


def pub20():
    D = 12; p = Piste(D); mus = Piste(D)
    p.pose(melange(0.95), 0.0, -6); p.pose(melange(0.3), 11.7, -6)
    p.pose(whoosh(0.5, 600, 3000), 0.9, -14)
    for i in range(4): p.pose(whoosh(0.25, 1000, 4000) * 0.7, 1.5 + i * 0.1, -14)
    for i in range(4):
        t = 3.2 + i * 1.1; p.pose(flip(), t, -4)
        for k, mm in enumerate((84, 88, 91)): p.pose(cloche(mtof(mm + i), 1.2, 0.5), t + 0.15 + k * 0.05, -12)
    p.pose(whoosh(0.6, 400, 3000), 9.4, -10); p.pose(flip(), 10.1, -6)
    tada = [(0, 72, 1), (1, 79, 4)]
    melodie(tada, lambda f, d: cuivre([f, f * 1.26, f * 1.5], d), 0.12, 10.6, p, -8)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 140; temps = 60 / bpm
        marche = [43, 47, 50, 52, 48, 52, 55, 57, 50, 54, 57, 59, 43, 45, 47, 48]
        k = 0; t = 0.9
        while t < 11.7:
            mus.pose(basse(mtof(marche[k % 16]), temps * 0.95, 2.5), t, -6)
            mus.pose(ride(0.5), t, -16, 0.3)
            if k % 2: mus.pose(ride(0.3), t + temps * 0.66, -20, 0.3); mus.pose(balai(), t, -14)
            k += 1; t += temps
        accords(mus, lambda f, d: piano(f, d * 0.3, 0.6), [(55, 59, 62, 65), (60, 64, 67, 70), (55, 59, 62, 66), (57, 60, 64, 67)], bpm, 0.9, 11.7, -15, 4, (0.66, 2.66))
        musique = reverb(mus.y, 0.8, 0.15)
    finaliser(p, "pub20.wav", musique, -6)


PUBS = {11: pub11, 12: pub12, 13: pub13, 14: pub14, 15: pub15, 16: pub16, 17: pub17, 18: pub18, 19: pub19, 20: pub20}
# ═════════ Pubs 21 à 30 ═════════
def sifflet(d=0.6, f0=2400, f1=500):
    t = tt(d); f = f0 + (f1 - f0) * (t / d) ** 1.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 0.6 * 0.6
def crissement(d=0.6, f=1400):
    t = tt(d); return (np.sin(2 * np.pi * np.cumsum(f * (1 + 0.05 * np.sin(2 * np.pi * 23 * t))) / SR) * 0.4 + pbande(bruit(d), f * 0.8, f * 2.2) * 0.5) * np.sin(np.pi * t / d)
def eclats(d=0.5):
    y = np.zeros(int(d * SR))
    for k in range(40):
        i = int(rng.random() * 0.25 * SR); c = clic(1500 + rng.random() * 5000, 0.03) * rng.random()
        y[i:i + len(c)] += c[: len(y) - i]
    return y + pb(bruit(d), 900) * np.exp(-tt(d) * 12) * 0.6
def tintement(n=30, d=1.0):
    y = np.zeros(int(d * SR))
    for k in range(n):
        i = int((k / n) ** 1.6 * d * 0.8 * SR); c = cloche(2500 + rng.random() * 3500, 0.25, 0.3 + rng.random() * 0.4)
        y[i:i + len(c)] += c[: len(y) - i]
    return y
def klaxon(d=0.35, f=420):
    t = tt(d); y = signal.square(2 * np.pi * f * t, 0.5) + signal.square(2 * np.pi * f * 1.26 * t, 0.5)
    return pb(y, 900) * 0.3 * np.minimum(1, (d - t) / 0.03) * np.minimum(1, t / 0.01)
def electro(mus, bpm, debut, fin, prog_, g=-6.0, motif="k...k...k...k...", hats="..h...h...h...h."):
    batterie(mus, bpm, debut, fin, motif, g)
    batterie(mus, bpm, debut, fin, hats, g - 2)
    pas = 60 / bpm / 4; i = 0
    while debut + i * pas < fin:
        acc = prog_[(i // 16) % len(prog_)]
        if i % 2 == 0: mus.pose(basse(mtof(acc[0] - 12), pas * 1.8, 6), debut + i * pas, g - 2)
        if i % 16 in (0, 6, 10): mus.pose(nappe([mtof(m) for m in acc], pas * 5, 2500), debut + i * pas, g - 4)
        i += 1


def pub21():
    D = 18; p = Piste(D); mus = Piste(D + 1)
    p.pose(impact(1.2, 50), 0, 0); p.pose(cloche(1568, 1.2), 0.02, -6); p.pose(cloche(2093, 1.2), 0.1, -9)
    t = tt(7.4); f = 300 + 2200 * (t / 7.4) ** 0.7
    rembob = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15 + pbande(bruit(7.4), 1500, 7000) * 0.3
    rembob *= np.minimum(1, t / 0.15) * np.minimum(1, (7.4 - t) / 0.05)
    p.pose(rembob, 0.6, -6)
    p.pose(clic(900, 0.05) * 1.6, 8.0, -2); p.pose(clic(1400, 0.05) * 1.6, 8.5, -2)
    p.pose(pop(900), 12.3, -8); p.pose(cloche(1568, 1.0), 12.75, -8); p.pose(whoosh(0.4, 500, 4000), 13.45, -12)
    electro(mus, 124, 9.0, D, [(57, 60, 64), (53, 57, 60), (55, 59, 62), (52, 55, 59)])
    # pendant le rembobinage : la musique jouée à l'envers, accélérée et filtrée
    rev = mus.y[:, int(9 * SR):int(15 * SR)][:, ::-2][:, : int(7.4 * SR)]
    rev = np.vstack([pbande(rev[0], 400, 5000), pbande(rev[1], 400, 5000)])
    out = mus.y[:, : int(D * SR)].copy(); out[:, int(0.6 * SR):int(0.6 * SR) + rev.shape[1]] += rev * 0.5
    finaliser(p, "pub21.wav", out, -6)


def pub22():
    D = 16; p = Piste(D); mus = Piste(D)
    p.pose(impact(1.4, 42), 0.3, -2)
    t = tt(0.2); p.pose(pbande(bruit(0.2), 1500, 6000) * (0.5 + 0.5 * np.sin(2 * np.pi * 40 * t)), 1.18, -6)
    p.pose(impact(1.6, 38) * 1.3, 1.3, 0)
    p.pose(tintement(45, 1.4), 2.6, -6); p.pose(pb(bruit(0.8), 600) * np.exp(-tt(0.8) * 5), 2.7, -10)
    for k in range(25): p.pose(clic(2600, 0.02), 4.2 + k * 0.048, -14)
    for k in range(12): p.pose(clic(2400, 0.02), 7.2 + k * 0.058, -14)
    p.pose(som(kick(0.4, 90, 40, 1.0), pb(bruit(0.15), 1200) * np.exp(-tt(0.15) * 30)), 8.2, 0)
    p.pose(tintement(12, 0.8) * 0.6, 10.2, -10); p.pose(whoosh(0.5, 500, 3500), 9.6, -12)
    p.pose(whoosh(0.4, 400, 3000), 11.5, -12)
    musique = musique_fournie(D)
    if musique is None:
        bpm = 140; pas = 60 / bpm / 4
        batterie(mus, bpm, 1.5, D, "k.........k.....", -5, sons={"k": lambda: kick(0.7, 70, 38)})
        batterie(mus, bpm, 1.5, D, "........s.......", -6, sons={"s": clap})
        batterie(mus, bpm, 1.5, D, "h.h.h.hhh.h.h.hh", -12, sons={"h": lambda: charley(0.03)})
        accords(mus, lambda f, d: nappe([f, f * 1.5], d, 1800), [(57, 60, 64), (53, 57, 62), (55, 59, 64), (52, 57, 60)], bpm, 1.5, D, -12, 8, (0,))
        musique = mus.y
    finaliser(p, "pub22.wav", musique, -5)


def pub23():
    D = 15; p = Piste(D); mus = Piste(D)
    T = 60 / 128
    p.pose(sifflet(0.3, 1800, 600), 0.0, -12); p.pose(impact(1.3, 42) * 1.3, 0.3, 0)
    for k in (3, 5, 7, 9): p.pose(flip(), k * T, -4)
    p.pose(whoosh(0.7, 3000, 150), 6.0, -6); p.pose(impact(0.9, 45), 6.7, -2)
    p.pose(pop(700, 0.12), 8.0, -4)
    for k in range(3): p.pose(pop(1200, 0.07), 8.3 + k * 0.25, -8)
    for k in range(12): p.pose(som(clic(3200, 0.03), bip(1760, 0.04) * 0.5), 10.6 + k * T / 2, -6)
    p.pose(sifflet(0.3, 1800, 900), 14.7, -12)
    musique = musique_fournie(D)
    if musique is None:
        electro(mus, 128, 0.3, 14.7, [(57, 60, 64), (57, 60, 64), (53, 57, 60), (55, 59, 62)], -5, "k...k...k...k...", "..h...h...h.hhh.")
        musique = mus.y
    finaliser(p, "pub23.wav", musique, -5)


def pub24():
    D = 16; p = Piste(D); mus = Piste(D)
    p.pose(whoosh(0.35, 800, 4000), 0.15, -8); p.pose(pop(1400, 0.06), 0.45, -10)
    def liquide(d):
        t = tt(d); return pbande(bruit(d), 300, 1500) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)) * np.sin(np.pi * t / d) + np.sin(2 * np.pi * np.cumsum(400 + 300 * np.sin(2 * np.pi * 6 * t)) / SR) * 0.2 * np.sin(np.pi * t / d)
    p.pose(liquide(1.0), 0.7, -6); p.pose(liquide(0.9), 9.9, -8)
    t = tt(3.2); m = moteur(3.2, 45) * (0.3 + 0.7 * t / 3.2); p.pose(m, 1.4, -10)
    p.pose(crissement(0.8, 1300), 4.5, -8)
    p.pose(som(kick(0.3, 80, 45, 0.6), clic(1200, 0.04)), 5.8, -4)
    for k in range(3): p.pose(pop(900 + k * 200, 0.08), 6.0 + k * 0.25, -6)
    p.pose(whoosh(0.4, 600, 3000), 7.6, -12)
    p.pose(impact(1.2, 46), 11.2, -2)
    musique = musique_fournie(D)
    if musique is None:
        mus.pose(nappe([mtof(45), mtof(52), mtof(57)], 4.6, 900) * 2, 0, -6)
        electro(mus, 110, 4.5, D, [(57, 60, 64), (53, 57, 60), (50, 53, 57), (52, 55, 59)], -7, "k.......k.k.....", "....h.......h...")
        musique = mus.y
    finaliser(p, "pub24.wav", musique, -6)


def pub25():
    D = 15; L = D + 4; p = Piste(L); mus = Piste(L)
    vrel = lambda t: 1 + 0.7 * math.exp(-(((t - 10) / 1.3) ** 2))
    # moteur continu dont la hauteur suit la vitesse (période exacte de 15 s)
    t = tt(L); v = np.array([vrel(x % D) for x in t[::480]]); v = np.interp(t, t[::480], v)
    moteur_ = pb(signal.square(2 * np.pi * np.cumsum(38 * v) / SR, 0.35), 900) * 0.3 + pb(bruit(L), 300) * 0.1 * v
    p.pose(moteur_, 0, -10)
    # retournements de la route (la normale passe à l'horizontale) et marquages peints (pschitt)
    integ = np.cumsum([vrel((i + 0.5) / 100) for i in range(1500)]); integ /= integ[-1]
    inst = lambda frac: float(np.searchsorted(integ, frac) / 100)
    for frac in (0.25, 0.75): p.pose(whoosh(0.9, 200, 2500), inst(frac) - 0.45, -8)
    for tm in (2.9, 5.5, 8.0, 10.3): p.pose(pbande(bruit(0.35), 2500, 9000) * np.exp(-tt(0.35) * 8), tm - 0.15, -10)
    # nappe hypnotique à 128 BPM : 15 s = exactement 32 temps
    pas = 60 / 128
    for k in range(34):
        acc = [(57, 64, 69), (53, 60, 65), (55, 62, 67), (52, 59, 64)][(k // 8) % 4]
        if k % 8 == 0: mus.pose(nappe([mtof(m) for m in acc], pas * 8.5, 1600) * 2, k * pas, -6)
        mus.pose(cloche(mtof(acc[(k % 3)] + 12), 0.9, 0.35), k * pas, -16, 0.3 * ((k % 2) * 2 - 1))
        mus.pose(kick(0.3, 90, 50, 0.5), k * pas, -12)
    mus.y = reverb(mus.y, 1.5, 0.2)
    # repli de la fin sur le début : la boucle n'a aucune coupure
    for tr in (p, mus):
        n = int(D * SR); tr.y[:, : tr.y.shape[1] - n] += tr.y[:, n:]; tr.y = tr.y[:, :n]; tr.n = n
    finaliser(p, "pub25.wav", mus.y if musique_fournie(D) is None else musique_fournie(D), -6, periodique=True)


def pub26(n=26):
    D = 20; p = Piste(D); mus = Piste(D)
    melodie([(0, 72, 1), (1, 79, 1), (2, 84, 3)], lambda f, d: cuivre([f, f * 1.5], d), 0.14, 0.0, p, -4)
    p.pose(impact(1.0, 50), 0.0, -4)
    p.pose(som(cloche(1046.5, 1.6), retard(cloche(1318.5, 1.6), 0.35)), 1.55, -6)   # annonce d'aéroport
    for k in range(3): p.pose(pop(800 + k * 150, 0.09), 1.8 + k, -8)
    for k in range(2): p.pose(whoosh(0.6, 400, 3000), 5.1 + k * 0.6, -8)
    for k in range(3): p.pose(som(clic(2800, 0.02), bip(1320, 0.05)), 9.5 + k * 0.5, -8)
    p.pose(whoosh(0.4, 500, 3000), 12.0, -12)
    for k in range(9): p.pose(bip(990, 0.05), 15.0 + k * 0.66, -18)
    if n == 26:
        r = pb(bruit(D), 500) * 0.25; p.pose(r * np.minimum(1, tt(D) / 2), 0, -14)   # réacteur lointain
    musique = musique_fournie(D)
    if musique is None:
        mus.pose(nappe([mtof(50), mtof(57), mtof(62), mtof(66)], D, 1400) * 2.2, 0, -6)
        electro(mus, 112, 1.5, D, [(62, 66, 69), (59, 62, 66), (55, 59, 62), (57, 61, 64)], -8, "k.......k.......", "....h.......h..h")
        musique = reverb(mus.y, 1.4, 0.2)
    finaliser(p, f"pub{n}.wav", musique, -6)


def pub27():
    D = 15; p = Piste(D); mus = Piste(D)
    for pan in (-0.6, 0.6): p.pose(som(moteur(0.5, 70, True) * np.linspace(1, 0, int(0.5 * SR)), retard(kick(0.25, 110, 60, 0.6), 0.45)), 0.0, -8, pan)
    for k in range(3): p.pose(kick(0.25, 70, 45, 0.7), 0.25 + k * 0.5, -6)
    for tl in (1.7, 2.7, 3.7, 4.7):
        p.pose(clic(2400, 0.03), tl, -6, -0.6); p.pose(clic(2400, 0.03), tl, -6, 0.6)
    for k in range(6): p.pose(whoosh(0.5, 400, 1500), 6.0 + k * 0.5, -14, -0.7 if k % 2 else 0.7)
    for tc in (9.2, 10.0):
        p.pose(som(clic(1800, 0.04), kick(0.2, 120, 70, 0.4)), tc, -4, -0.5); p.pose(som(clic(1800, 0.04), kick(0.2, 120, 70, 0.4)), tc, -4, 0.5)
    p.pose(whoosh(0.4, 500, 3000), 11.0, -12)
    musique = musique_fournie(D)
    if musique is None:
        electro(mus, 120, 0.25, 14.7, [(57, 60, 64), (55, 59, 62), (53, 57, 60), (55, 59, 62)], -7, "k...k.s.k...k.s.", "h.h.h.h.h.h.h.h.")
        musique = mus.y
    finaliser(p, "pub27.wav", musique, -6)


def pub28():
    D = 15; p = Piste(D); mus = Piste(D)
    for ti in (0.45, 1.9, 3.4):
        p.pose(sifflet(0.55), ti - 0.55, -10); p.pose(impact(1.0, 45) * 1.2, ti, 0)
    for ti in (1.9, 3.4): p.pose(eclats(0.6), ti, -4)
    t = tt(0.8); p.pose(moteur(0.8, 55) * (0.4 + t / 0.8), 4.5, -6); p.pose(crissement(0.45, 1600), 5.0, -6)
    for ti in (6.4, 7.2, 8.0, 8.8): p.pose(som(clic(1400, 0.04) * 1.5, kick(0.15, 160, 90, 0.5)), ti, -2)
    p.pose(impact(1.0, 48), 10.5, -2)
    p.pose(sifflet(0.3, 2400, 1500), 14.7, -12)
    musique = musique_fournie(D)
    if musique is None:
        batterie(mus, 95, 0.45, 14.6, "k..k..s...kk..s.", -5, swing=0.12)
        batterie(mus, 95, 0.45, 14.6, "h.hhh.hhh.hhh.hh", -10, swing=0.12)
        accords(mus, rhodes, [(57, 60, 64), (55, 59, 62), (53, 57, 60), (52, 55, 59)], 95, 0.45, 14.6, -13, 4, (0, 2.5))
        musique = mus.y
    finaliser(p, "pub28.wav", musique, -6)


def pub29():
    D = 15; p = Piste(D); mus = Piste(D)
    for a, b in ((0.0, 1.9), (14.7, 15.0)):
        d = b - a; t = tt(d); creak = pbande(bruit(d), 400, 2500) * (np.abs(np.sin(2 * np.pi * 2.3 * t)) ** 4); p.pose(creak, a, -4)
        for k, tk in enumerate(np.arange(0, d - 0.2, 0.55)): p.pose(klaxon(0.3, 380 + 60 * (k % 2)), a + tk, -9, -0.5 + k * 0.3)
        p.pose(pb(bruit(d), 400) * 0.2, a, -16)   # ville étouffée
    p.pose(whoosh(1.9, 150, 900) * 0.8, 2.0, -10)   # chute au ralenti
    p.pose(som(kick(0.4, 70, 40, 0.6), pb(bruit(0.3), 500) * np.exp(-tt(0.3) * 10)), 3.9, -4)
    for k in range(3): p.pose(som(clic(2200, 0.03), cloche(2637 + k * 300, 0.7, 0.3)), 6.2 + k * 0.7, -8)
    p.pose(whoosh(0.4, 500, 3000), 11.0, -12)
    musique = musique_fournie(D)
    if musique is None:
        mus.pose(nappe([mtof(50), mtof(57), mtof(62), mtof(65)], 10.6, 1200) * 2, 4.0, -6)
        batterie(mus, 85, 4.0, 14.6, "k.......b...b.b.", -10, sons={"k": lambda: kick(0.3, 90, 50, 0.6), "b": balai})
        accords(mus, rhodes, [(62, 65, 69, 72), (60, 64, 67, 71), (58, 62, 65, 69), (57, 60, 64, 67)], 85, 4.0, 14.6, -12, 4, (0, 1.5))
        musique = reverb(mus.y, 1.6, 0.25)
    finaliser(p, "pub29.wav", musique, -6, sourdine=((2.0, 2.15),))


def pub30():
    D = 18; p = Piste(D); mus = Piste(D)
    v = lambda t: 14 if t < 8 else 14 * (1 - min(1, (t - 8) / 2.3)) if t < 10.3 else 0 if t < 13.5 else 14 * min(1, (t - 13.5) / 2)
    t = tt(D); vv = np.interp(t, t[::480], np.array([v(x) for x in t[::480]])) / 14
    p.pose(pb(signal.square(2 * np.pi * np.cumsum(28 + 22 * vv) / SR, 0.3), 300) * (0.15 + 0.25 * vv) + pb(bruit(D), 250) * (0.05 + 0.12 * vv), 0, -10)
    p.pose(pbande(bruit(D), 300, 1500) * 0.03, 0, -12)   # ville lointaine
    for k in range(8): p.pose(clic(1100 if k % 2 else 900, 0.03), 4.6 + k * 0.38, -12)   # clignotant
    for ti in (1.8, 2.8, 3.8, 9.0): p.pose(som(bip(1480, 0.07), retard(bip(1975, 0.07), 0.08)), ti, -8)
    g = pbande(bruit(0.45), 300, 8000) * signal.square(2 * np.pi * 25 * tt(0.45)); p.pose(g, 11.0, -6)
    p.pose(pbande(bruit(0.7), 2000, 6000) * np.sin(np.pi * tt(0.7) / 0.7) * 0.4, 9.6, -14)
    p.pose(whoosh(0.4, 500, 3000), 13.5, -14)
    musique = musique_fournie(D)
    if musique is None:
        batterie(mus, 90, 0, D, "k.....h.s.....h.", -11, swing=0.2, sons={"k": lambda: kick(0.35, 100, 48, 0.7), "s": lambda: pb(clap(), 4000), "h": lambda: charley(0.05)})
        accords(mus, rhodes, [(57, 60, 64, 67), (53, 57, 60, 64), (50, 53, 57, 60), (52, 55, 59, 62)], 90, 0, D, -12, 4, (0, 2.5))
        t0 = 0
        while t0 < D: mus.pose(basse(mtof(45), 0.6, 3), t0, -8); t0 += 60 / 90 * 2
        musique = reverb(mus.y, 1.4, 0.25)
    finaliser(p, "pub30.wav", musique, -6)


PUBS.update({21: pub21, 22: pub22, 23: pub23, 24: pub24, 25: pub25, 26: pub26, 262: lambda: pub26(262), 263: lambda: pub26(263), 264: lambda: pub26(264),
             27: pub27, 28: pub28, 29: pub29, 30: pub30})


if __name__ == "__main__":
    for n in [int(a) for a in sys.argv[1:]] or PUBS:
        PUBS[n]()
