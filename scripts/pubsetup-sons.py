"""Bande-son complète de « PubSetup » (Remotion, src/pubsetup/), sans voix, synthétisée ici, libre de droits
-> public/pubsetup/bande.wav (-14 LUFS).
- Musique phonk / électro à 140 BPM (cloche, 808 glissée, charleston, clap) : intro filtrée pendant les macros,
  drop au temps 7 (3,0 s) quand le montage commence ; chaque coupe du montage tombe sur un temps.
- Sound design : whoosh de défilement + glitch (0 s), clavier et souris en macro (réverbération de pièce), ticks des
  valeurs, swoosh grave + impact sourd au recul, un son court et différent par clip, riser + impact grave à longue
  réverbération sur le logo, puis silence. Sidechain de la musique sous les impacts.
Repères : mêmes valeurs que PUB_SETUP (src/config.ts) — à garder synchronisés.
Usage (depuis la racine) : python3 scripts/pubsetup-sons.py
"""
import json, subprocess, wave
from pathlib import Path
import numpy as np
from scipy import signal

RACINE = Path(__file__).resolve().parent.parent
SR = 48000
DUREE = 14.0
N = int(DUREE * SR)
rng = np.random.default_rng(11)
B = 60 / 140
tt = lambda d: np.arange(int(d * SR)) / SR
norm = lambda y: y / (np.abs(y).max() + 1e-9)
db = lambda v: 10 ** (v / 20)
# Montage : (clip, durée en temps), à partir du temps 7 — identique à PUB_SETUP.clips
CLIPS = [("carte", 2), ("nuages", 1), ("visite", 2), ("eventail", 1), ("whatsapp", 2), ("ticket", 1), ("recu", 2), ("message", 2),
         ("telephone", 1), ("portiere", 1), ("avion", 1), ("route", 1), ("conduire", 2), ("prix", 2)]
RECUL, MONTAGE, FIN, LOGO = 6 * B, 7 * B, 28 * B, 28.7 * B

def bande(y, f0, f1, ordre=2):
    b, a = signal.butter(ordre, [f0 / (SR / 2), f1 / (SR / 2)], "band"); return signal.lfilter(b, a, y)
def passe_bas(y, f, ordre=2):
    b, a = signal.butter(ordre, f / (SR / 2)); return signal.lfilter(b, a, y)
def passe_haut(y, f, ordre=2):
    b, a = signal.butter(ordre, f / (SR / 2), "high"); return signal.lfilter(b, a, y)

def piste():
    return np.zeros((2, N))
def poser(dest, son, t, g=0.0, pan=0.0):
    i = int(t * SR); n = min(len(son), N - i)
    if n > 0 and i >= 0:
        dest[0, i:i + n] += son[:n] * db(g) * np.cos((pan + 1) * np.pi / 4) * 1.414
        dest[1, i:i + n] += son[:n] * db(g) * np.sin((pan + 1) * np.pi / 4) * 1.414

def reverb(st, duree=0.6, mix=0.25):
    """Réverbération par convolution avec une réponse impulsionnelle de bruit à décroissance exponentielle."""
    ir_t = tt(duree)
    out = np.zeros_like(st)
    for c in range(2):
        ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 6.9 / duree)
        ir = passe_bas(ir, 6000); ir /= np.sqrt((ir ** 2).sum())
        out[c] = signal.fftconvolve(st[c], ir)[: st.shape[1]]
    return st + out * mix

# ── Sons élémentaires ──
def tic(f, d=0.04):
    t = tt(d); return norm(np.sin(2 * np.pi * f * t) * np.exp(-t * 160) + 0.3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 260))
def whoosh(d=0.6, f0=300, f1=4000, montant=False):
    t = tt(d); env = np.sin(np.pi * t / d) ** 2
    if montant: env = (t / d) ** 2 * np.clip((d - t) / 0.08, 0, 1)
    y = bande(rng.standard_normal(len(t)), f0, f1) * env
    return norm(y)
def thump():
    t = tt(0.7); return norm(np.sin(2 * np.pi * np.cumsum(42 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 6))
def eclats():
    y = np.zeros(int(1.2 * SR))
    for k in range(26):
        i = int(rng.uniform(0, 0.5) * SR); f = rng.uniform(2200, 7500); t = tt(0.25)
        s = np.sin(2 * np.pi * f * t) * np.exp(-t * rng.uniform(18, 40)) * rng.uniform(0.3, 1)
        y[i:i + len(s)] += s
    y += 0.25 * passe_haut(rng.standard_normal(len(y)), 5000) * np.exp(-np.arange(len(y)) / SR * 9)
    return norm(y)
def clac():
    t = tt(0.12); return norm(passe_haut(rng.standard_normal(len(t)), 1500) * np.exp(-t * 70) + 0.6 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90))
def moteur(d=1.2):
    t = tt(d); env = np.sin(np.pi * t / d) ** 1.5
    f = 58 + 18 * np.sin(np.pi * t / d)
    y = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * 0.6 + bande(rng.standard_normal(len(t)), 80, 900) * 0.8
    return norm(passe_bas(y, 700) * env)
def shine():
    t = tt(1.0); y = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (5 + k * 2)) * (t >= k * 0.05) for k, f in enumerate([2637, 3520, 4186, 5274]))
    return norm(y)
def bip():
    t = tt(0.22); return norm(np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 14) * np.clip(t / 0.005, 0, 1))
def flap():
    t = tt(0.09); return norm(passe_bas(rng.standard_normal(len(t)), 2500) * np.exp(-t * 55) + 0.4 * np.sin(2 * np.pi * 220 * t) * np.exp(-t * 60))
def riser(d):
    t = tt(d); f = 200 * (1 + 6 * (t / d) ** 2)
    y = 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + bande(rng.standard_normal(len(t)), 500, 7000)
    return norm(y * (t / d) ** 2.5)
def impact():
    t = tt(2.6)
    y = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t * 14)) / SR) * np.exp(-t * 2.2) + 0.25 * passe_bas(rng.standard_normal(len(t)), 1800) * np.exp(-t * 5)
    return norm(y)


def touche():
    t = tt(0.03); return norm(bande(rng.standard_normal(len(t)), 1800, 7000) * np.exp(-t * 180) + 0.5 * np.sin(2 * np.pi * rng.uniform(380, 520) * t) * np.exp(-t * 120))
def souris():
    t = tt(0.025); return norm(np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 300) + 0.4 * bande(rng.standard_normal(len(t)), 3000, 9000) * np.exp(-t * 260))
def glitch(d=0.35):
    y = np.zeros(int(d * SR)); i = 0
    while i < len(y):
        n = int(rng.uniform(0.008, 0.03) * SR); s = np.sign(np.sin(2 * np.pi * rng.uniform(200, 3000) * tt(n / SR))) * rng.uniform(0.3, 1)
        m = min(len(s), len(y) - i); y[i:i + m] = s[:m] * (rng.random() > 0.3); i += n + int(rng.uniform(0, 0.01) * SR)
    return norm(np.round(y * 6) / 6 * np.exp(-np.arange(len(y)) / SR * 5))
def notif_wa():
    t = tt(0.32); y = np.sin(2 * np.pi * 1318.5 * t) * (t < 0.12) * np.exp(-t * 18) + np.sin(2 * np.pi * 1760 * t) * (t >= 0.12) * np.exp(-(t - 0.12) * 14)
    return norm(y * np.clip(t / 0.004, 0, 1))
def imprimante():
    t = tt(0.45); return norm(signal.square(2 * np.pi * 95 * t) * 0.4 * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)) * np.sin(np.pi * t / 0.45))
def portiere():
    t = tt(0.4); return norm(np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t * 25)) / SR) * np.exp(-t * 12) + 0.5 * passe_bas(rng.standard_normal(len(t)), 900) * np.exp(-t * 30))
def pop(f=600):
    t = tt(0.12); return norm(np.sin(2 * np.pi * np.cumsum(f * (1 + 2 * np.exp(-t * 60))) / SR) * np.exp(-t * 40))

sfx, piece, imp = piste(), piste(), piste()
# 0 s : whoosh de défilement + glitch
poser(sfx, whoosh(0.45, 600, 9000), 0.0, -6); poser(sfx, glitch(0.35), 0.02, -14)
# Macros : clavier et souris (réverbération de pièce), ticks des valeurs
t = 0.45
while t < RECUL - 0.05:
    poser(piece, touche(), t, -16, rng.uniform(-0.3, 0.3)); t += rng.uniform(0.07, 0.16)
for t in (0.5, 1.25, 1.8, 2.3): poser(piece, souris(), t, -10, 0.25)
t = 4 * B
while t < RECUL:
    poser(sfx, tic(3200, 0.015), t, -18); t += 0.06
poser(sfx, whoosh(0.35, 300, 4000), 1 * B - 0.05, -14); poser(sfx, whoosh(0.35, 300, 4000), 4 * B - 0.05, -14)
# Recul : swoosh grave + impact sourd
poser(sfx, whoosh(0.5, 60, 1200), RECUL - 0.05, -2); poser(imp, thump(), MONTAGE - 0.05, -4)
# Un son court et différent par clip, sur chaque coupe
SON = {"carte": (moteur(0.9), -10), "nuages": (whoosh(0.4, 300, 6000), -12), "visite": (shine(), -10), "eventail": (whoosh(0.18, 800, 7000), -10),
       "whatsapp": (notif_wa(), -8), "ticket": (imprimante(), -12), "recu": (whoosh(0.5, 200, 4000, montant=True), -10), "message": (None, 0),
       "telephone": (notif_wa(), -10), "portiere": (portiere(), -6), "avion": (whoosh(0.5, 200, 7000, montant=True), -7), "route": (whoosh(0.4, 150, 3000), -12),
       "conduire": (pop(500), -8), "prix": (whoosh(0.22, 600, 6000), -10)}
t = MONTAGE
for nom, nb in CLIPS:
    son, g = SON[nom]
    if son is not None: poser(sfx, son, t, g, rng.uniform(-0.2, 0.2))
    if nom == "nuages": poser(sfx, pop(700), t + 0.25, -9)
    if nom == "eventail":
        for k in (1, 2): poser(sfx, whoosh(0.16, 800, 7000), t + k * 0.07, -12)
    if nom == "ticket": poser(sfx, souris(), t + 0.35, -8)
    if nom == "message":
        for k in range(25): poser(piece, touche(), t + k * nb * B * 0.85 / 25, -11)
    if nom == "conduire": poser(sfx, pop(700), t + 0.22, -8)
    if nom == "prix": poser(sfx, shine(), t + nb * B * 0.5, -10)
    t += nb * B
# Logo : riser, impact grave, longue réverbération, puis silence
poser(sfx, riser(LOGO - FIN + 0.9), FIN - 0.9, -8)
poser(imp, impact(), LOGO, -1)

# ── Musique phonk 140 BPM ──
mus = piste()
tk = tt(0.4); kick = norm(np.sin(2 * np.pi * np.cumsum(50 + 140 * np.exp(-tk * 35)) / SR) * np.exp(-tk * 7))
th = tt(0.04); hat = norm(passe_haut(rng.standard_normal(len(th)), 8000) * np.exp(-th * 110))
tc = tt(0.22); clap = norm(bande(rng.standard_normal(len(tc)), 1200, 6000) * (np.exp(-tc * 35) + 0.5 * np.exp(-np.abs(tc - 0.012) * 400)))
def cloche(f, d=0.22):
    t = tt(d); return norm(sum(signal.square(2 * np.pi * f * r * t) * a for r, a in ((1, 1), (1.48, 0.7))) * np.exp(-t * 14))
def b808(f0, f1, d):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 18)
    return norm(np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.clip(t / 0.004, 0, 1) * np.exp(-t * 1.6))
MELODIE = [(659, 0), (784, 0.5), (659, 1), (587, 1.5), (523, 2), (587, 2.75), (659, 3), (440, 3.5)]  # sur 4 temps
BASSE = [(55, 0), (55, 1.5), (65.4, 2), (49, 3)]
intro = piste()
for n in range(0, 28):
    t0 = n * B
    cible = intro if n < 7 else mus
    if n % 4 in (0, 2) or (n % 4 == 3): poser(cible, kick, t0 + (0.5 * B if n % 4 == 3 else 0), -3)
    if n % 2 == 1: poser(cible, clap, t0, -9)
    for c in range(2): poser(cible, hat, t0 + c * B / 2, -15 if c else -13, 0.3)
    if n % 8 == 7:
        for c in range(4): poser(cible, hat, t0 + B / 2 + c * B / 8, -16, 0.3)
    if n % 4 == 0:
        for f, o in MELODIE: poser(cible, cloche(f), t0 + o * B, -12, -0.2)
        for k, (f, o) in enumerate(BASSE): poser(cible, b808(f * 2, f, B * 1.4), t0 + o * B, -5)
intro = np.stack([passe_bas(intro[c], 700) for c in range(2)]) * 0.8
mus += intro
mus[:, int(FIN * SR):] *= 0
temps = np.arange(N) / SR
gain = np.ones(N)
for ti, prof in ((0.0, 0.6), (MONTAGE - 0.05, 0.7), (LOGO, 1.0)):
    gain *= 1 - prof * np.exp(-np.clip(temps - ti, 0, None) * 6) * (temps >= ti - 0.01)
mus *= gain

mix = mus + sfx + reverb(piece, 0.45, 0.3) + reverb(imp, 2.0, 0.5)
brut = RACINE / "public" / "pubsetup" / "bande-brute.wav"
st = mix / (np.abs(mix).max() + 1e-9) * 0.7
with wave.open(str(brut), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(st.T, -1, 1) * 32767).astype(np.int16).tobytes())
mes = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(brut), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(mes[mes.rindex("{"):])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(brut), "-af", af, "-ar", str(SR), str(RACINE / "public" / "pubsetup" / "bande.wav")], check=True)
brut.unlink()
print("bande.wav -14 LUFS (avant :", m["input_i"], "LUFS)")
