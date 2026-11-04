"""Bande-son complète de « Bento » (aucune voix), synthétisée ici, libre de droits -> assets/audio/bande.wav
- Musique électro minimale et élégante à 116 BPM (kick feutré, charleston, sub-basse, nappe d'accords, arpège discret),
  du temps 2 (1,03 s) au temps 34 (17,59 s) ; les grands mouvements de caméra tombent sur ces temps (js/temps.js).
- Sound design calé sur l'animation : thump, explosion (whoosh + éclats de verre), « tic » par tuile qui se remplit
  (hauteur propre à chaque tuile), ticks des compteurs, cliquetis d'horloge qui accélère + « clac », passage de moteur
  + « shine », bip GPS, whoosh montant de l'avion, « flaps » du domino, riser + impact grave à longue réverbération.
- Réverbération légère sur l'interface, sidechain de la musique sous chaque impact, normalisation finale à -14 LUFS (ffmpeg).
Usage (depuis le projet) : python3 scripts/sons.py
"""
import json, re, subprocess
from pathlib import Path
import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
SR = 48000
N = int(T["duree"] * SR)
rng = np.random.default_rng(7)
TEMPS = 60 / T["tempo"]
tt = lambda d: np.arange(int(d * SR)) / SR
norm = lambda y: y / (np.abs(y).max() + 1e-9)
db = lambda v: 10 ** (v / 20)

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

# ── Effets (piste sfx) ──
sfx = piste(); ui = piste()
poser(sfx, thump(), T["pulse"], -3)
poser(sfx, whoosh(0.55, 400, 6000), T["explosion"] - 0.12, -6)
poser(ui, eclats(), T["explosion"], -10)
poser(sfx, thump(), T["fige"] - 0.02, -10)
# Whooshs des grands mouvements de caméra (sur les temps)
for t, g in [(T["plongee"], -8), (T["virage"], -10), (T["horloge"], -11), (T["traverse"], -4), (T["gps"], -10), (T["appel"], -11), (T["vol"], -11), (T["recul"], -5)]:
    poser(sfx, whoosh(0.5 if g > -6 else 0.42, 250, 5000), t - 0.08, g, 0.0)
# Tic de remplissage : une hauteur propre à chaque tuile
cas = T["cascade"]; nb = 20
for k in range(nb):
    poser(ui, tic(1900 + k * 40), cas[0] + k * (cas[1] - cas[0]) / (nb - 1), -14, -0.3 + 0.6 * k / nb)
for k, t in enumerate(T["barres"]):
    poser(ui, tic(1150 + k * 60, 0.05), t, -11, 0.2)
for k, t in enumerate(T["pastilles"]):
    poser(ui, tic(2600 + k * 120), t, -12, 0.3)
poser(ui, tic(2300), T["des5h"], -14)
poser(ui, tic(2100), T["arret"] + 0.05, -14)
# Compteurs : un tick à chaque changement de chiffre
def ticks_compteur(a, z, courbe, valeurs, f, g):
    prec = None
    for t in np.arange(a, z + 0.01, 0.001):
        p = courbe(min(1, max(0, (t - a) / (z - a))))
        v = valeurs(p)
        if v != prec and prec is not None: poser(ui, tic(f, 0.018), t, g)
        prec = v
cubic_out = lambda p: 1 - (1 - p) ** 3
quad_inout = lambda p: 2 * p * p if p < 0.5 else 1 - (-2 * p + 2) ** 2 / 2
ticks_compteur(*T["compteur"], cubic_out, lambda p: round((3000 - 500 * p) / 10), 3400, -18)
ticks_compteur(*T["pourcent"], quad_inout, lambda p: round(p * 100), 3000, -21)
# Horloge : cliquetis qui accélère puis « clac »
t, inter = T["horloge"] + 0.1, 0.13
while t < T["arret"] - 0.02:
    poser(ui, tic(2800, 0.015), t, -16); poser(ui, tic(1700, 0.015), t + inter / 2, -19); t += inter; inter = max(0.028, inter * 0.86)
poser(sfx, clac(), T["arret"], -5)
# Voiture : passage feutré + « shine »
poser(sfx, moteur(1.3), T["voitureEntre"] - 0.15, -9, 0.0)
poser(ui, shine(), T["reflet"] + 0.25, -12, 0.3)
poser(ui, tic(2400), T["arrive"], -12)
# GPS, appel, avion
poser(ui, bip(), T["bip"], -10)
poser(ui, tic(1400, 0.05), T["appel"] + 0.25, -14)
poser(sfx, whoosh(0.9, 300, 7000, montant=True), T["decolle"] - 0.05, -9, 0.4)
# Domino : un « flap » par tuile, au moment de son flip (même formule que js/main.js)
RANGEES = [[60, [420, 560, 380, 500, 380]], [310, [560, 380, 440, 420, 440]], [3700, [600, 520, 640, 540]], [3970, [440, 520, 380, 500, 400]], [4240, [560, 700, 480, 560]]]
POS = [(60, 560), (1640, 560), (1640, 1140), (60, 1560), (60, 2320), (60, 2940), (1060, 2320)]
for y, ls in RANGEES:
    x = 60
    for l in ls: POS.append((x, y)); x += l + 60
f0, f1 = T["flip"]
for x, y in POS:
    poser(sfx, flap(), f0 + (y / 4600) * (f1 - f0 - 0.5) + (x / 2600) * 0.06 + 0.12, -12, (x / 2600 - 0.5) * 0.6)
poser(sfx, whoosh(0.8, 150, 2500), T["chute"], -12)
# Logo : riser puis impact grave à longue réverbération, puis silence
poser(sfx, riser(T["logo"] - T["chute"] + 0.15), T["chute"] - 0.15, -10)
imp = piste(); poser(imp, impact(), T["logo"], -2)
imp = reverb(imp, 2.0, 0.55)

# ── Musique 116 BPM (piste séparée, sidechain sous les impacts) ──
mus = piste()
debut, fin = T["plongee"], T["chute"]
tk = tt(0.35); kick = norm(np.sin(2 * np.pi * np.cumsum(46 + 120 * np.exp(-tk * 40)) / SR) * np.exp(-tk * 9))
th = tt(0.05); hat = norm(passe_haut(rng.standard_normal(len(th)), 7000) * np.exp(-th * 90))
tc = tt(0.2); rim = norm(bande(rng.standard_normal(len(tc)), 1500, 5000) * np.exp(-tc * 40))
ACCORDS = [(110, 130.8, 164.8, 196, 246.9), (87.3, 130.8, 174.6, 220, 261.6), (65.4, 130.8, 164.8, 196, 246.9), (98, 146.8, 196, 246.9, 293.7)]  # Am9 Fmaj7 C G
BASSES = [55, 43.65, 65.4, 49]
k = 0; t = debut
while t < fin - 0.01:
    mesure = (k // 4) % 4
    poser(mus, kick, t, -4)
    poser(mus, hat, t + TEMPS / 2, -17, 0.25)
    if k % 2 == 1: poser(mus, rim, t, -18, -0.2)
    if k % 4 == 0:  # nouvelle mesure : basse + nappe
        d = TEMPS * 4; tb = tt(d)
        basse = np.sin(2 * np.pi * BASSES[mesure] * tb) * np.clip(tb / 0.02, 0, 1) * np.exp(-tb * 0.6)
        poser(mus, norm(basse), t, -8)
        nap = sum(signal.sawtooth(2 * np.pi * f * tb + i) for i, f in enumerate(ACCORDS[mesure]))
        nap = passe_bas(nap, 900) * np.clip(tb / 0.4, 0, 1) * np.clip((d - tb) / 0.3, 0, 1)
        poser(mus, norm(nap), t, -20, 0.0)
    # Arpège discret en doubles croches
    for c in range(2):
        f = ACCORDS[mesure][(k * 2 + c) % 5] * 4; ta = tt(0.12)
        poser(mus, norm(np.sin(2 * np.pi * f * ta) * np.exp(-ta * 30)), t + c * TEMPS / 2 + TEMPS / 4, -25, -0.4 + 0.8 * ((k + c) % 2))
    t += TEMPS; k += 1
mus[:, int(fin * SR):int(fin * SR) + int(0.4 * SR)] *= np.linspace(1, 0, int(0.4 * SR))
mus[:, int(fin * SR) + int(0.4 * SR):] = 0
# Sidechain : la musique s'efface sous chaque impact (et pompe légèrement sur le kick)
temps = np.arange(N) / SR
gain = np.ones(N)
for ti, prof in [(T["pulse"], 0.9), (T["explosion"], 0.9), (T["traverse"], 0.6), (T["arret"], 0.5), (T["recul"], 0.6), (T["logo"], 1.0)]:
    gain *= 1 - prof * np.exp(-np.clip(temps - ti, 0, None) * 5) * (temps >= ti - 0.02)
mus *= gain

mix = mus + sfx + reverb(ui, 0.5, 0.22) + imp
mix[:, int(T["logo"] * SR + 2.6 * SR):] *= 0  # silence final après la réverbération
brut = ICI / "assets" / "audio" / "bande-brute.wav"
import wave
st = mix / (np.abs(mix).max() + 1e-9) * 0.7
with wave.open(str(brut), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(st.T, -1, 1) * 32767).astype(np.int16).tobytes())
# Normalisation -14 LUFS (deux passes loudnorm)
mes = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(brut), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(mes[mes.rindex("{"):])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(brut), "-af", af, "-ar", str(SR), str(ICI / "assets" / "audio" / "bande.wav")], check=True)
brut.unlink()
print("bande.wav -14 LUFS (mesuré avant :", m["input_i"], "LUFS)")
