"""Mixage complet de la pub : voix + musique + effets, calé mot par mot sur la voix.

Entrées : assets/voiceoff.mp3, assets/voix-timing.json, assets/audio/musique.mp3, assets/sfx/ui-*.wav
Sorties :
  assets/audio/mix.wav        mix final stéréo 48 kHz, -14 LUFS, crête -1 dBTP (la piste de la vidéo)
  assets/reperes.json         temps des événements sonores (les scènes s'y calent)
  js/reperes.js               le même, pour la composition (window.REPERES)

Récit sonore :
  1. BESOIN   voix sèche et proche, tic-tac qui accélère, nappe grave tendue, trafic et klaxons étouffés
  2. BASCULE  tout s'arrête net 0,5 s avant « Soyons honnêtes » ; réverb de grande salle ;
              impact grave sur « Ils méritent un chauffeur », la réverb s'éteint dans le noir
  3. SOLUTION la musique entre et monte ; voix plus brillante ; envoi, réception, ding
  4. FIN      la musique culmine sur « Rapide. Sûr. Confortable. », écho sur chaque mot ;
              impact sur le logo, clic du bouton
La musique baisse automatiquement sous la voix (ducking).
Les sons d'interface viennent de uisfx (CC0) ; horloge, trafic, klaxons, souffles et impacts sont
fabriqués ici (déterministes, graine fixe).
Usage (depuis pub-chauffeur/) : python3 scripts/mixer.py
"""
import json, subprocess, wave
from pathlib import Path

import numpy as np
from scipy import signal

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(2026)
db = lambda v: 10 ** (v / 20)

# ── Lecture ──
def lire(chemin, canaux=1):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(chemin), "-ac", str(canaux), "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, dtype=np.float32).copy()
    return x.reshape(-1, canaux).T if canaux > 1 else x

# Voix normalisée (-14 LUFS, preparer-voix.py) puis -2 dB : même équilibre quelle que soit la prise.
voix = lire(ICI / "assets" / "voiceoff.mp3") * db(-2)
mots = json.loads((ICI / "assets" / "voix-timing.json").read_text(encoding="utf-8"))["mots"]

def mot(texte, n=1, fin=False):
    trouves = [m for m in mots if m["texte"].rstrip(".,…!") == texte]
    return trouves[n - 1]["fin" if fin else "debut"]

# ── Repères (secondes, temps de la vidéo = temps de la voix) ──
R = {}
R["billet"] = mot("Votre")
R["valise"] = mot("vingt") + 0.1
R["carte"] = mot("bouchons") - 0.25
R["taxis"] = mot("taxis")
R["bagages"] = mot("bagages")
R["tourne"] = mot("tourne")
R["coupure"] = mot("tourne", fin=True) + 0.04          # tout s'arrête net
R["soyons"] = mot("Soyons")
R["attendre"] = mot("ne")
R["noir"] = mot("Ils")                                 # écran noir + impact
R["solution"] = mot("Un", 1)                           # « Un message suffit. »
R["frappe"] = mot("Un", 1) + 0.05
R["envoi"] = max(mot("suffit", fin=True) - 0.1, R["frappe"] + 0.75)  # le temps de taper
R["reponse"] = max(mot("Votre", 2) + 0.3, R["envoi"] + 0.55)
R["confirme"] = max(mot("confirmé") + 0.15, R["reponse"] + 0.4)
R["trajet"] = mot("il")
R["depart"] = mot("et", 1)                             # « et vous arrivez à l'heure » : la voiture part
R["arrivee"] = mot("l'heure", 2)                       # 18h52 ✓
R["cartes"] = [mot("Un", 2) - 0.12, mot("Vos") - 0.12, mot("Une") - 0.12, mot("Un", 3) - 0.12]
R["fin"] = mot("JP")                                   # bascule vers le fond sombre, logo
R["slogan"] = mot("Votre", 3)
R["rapide"], R["sur"], R["confortable"] = mot("Rapide"), mot("Sûr"), mot("Confortable")
R["bouton"] = mot("Confortable", fin=True) + 0.75      # le curseur clique « Réserver sur WhatsApp »
R["numero"] = R["bouton"] + 0.35
R["duree"] = round(max(R["bouton"] + 4.2, 40.0), 2)  # 40 s minimum (TikTok / Reels) : le plan final tient
N = int(R["duree"] * SR)

def piste():
    return np.zeros((2, N), dtype=np.float32)

def poser(dest, son, t, gain_db=0.0, pan=0.0):
    """Ajoute un son mono ou stéréo à l'instant t (s), avec gain et panoramique (-1 gauche, 1 droite)."""
    if son.ndim == 1:
        g, d = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        son = np.vstack([son * g * 1.414, son * d * 1.414])
    i = int(t * SR)
    if i >= N:
        return
    n = min(son.shape[1], N - i)
    dest[:, i:i + n] += son[:, :n] * db(gain_db)

def t_(d):
    return np.arange(int(d * SR)) / SR

def passe_bas(x, fc, ordre=2):
    b, a = signal.butter(ordre, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x, axis=-1)

def passe_haut(x, fc, ordre=2):
    b, a = signal.butter(ordre, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x, axis=-1)

def passe_bande(x, f0, f1, ordre=2):
    b, a = signal.butter(ordre, [f0 / (SR / 2), f1 / (SR / 2)], "band")
    return signal.lfilter(b, a, x, axis=-1)

def plateau_aigu(x, fc, gain):
    """Plateau d'aigus simple : ajoute la partie haute filtrée."""
    return x + (db(gain) - 1) * passe_haut(x, fc, 1)

def reponse_salle(duree, rt60, largeur=1.0, sombre=6000):
    """Réponse impulsionnelle stéréo synthétique (bruit à décroissance exponentielle)."""
    tt = t_(duree)
    env = np.exp(-6.9 * tt / rt60)
    g, d = rng.standard_normal(len(tt)) * env, rng.standard_normal(len(tt)) * env
    m = (g + d) / 2
    g, d = m + (g - m) * largeur, m + (d - m) * largeur
    ir = passe_bas(np.vstack([g, d]), sombre)
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))  # pré-délai doux
    return ir / np.sqrt(np.sum(ir ** 2) / 2)

def reverbe(x, ir):
    if x.ndim == 1:
        x = np.vstack([x, x])
    return np.vstack([signal.fftconvolve(x[c], ir[c])[: x.shape[1] + ir.shape[1]] for c in range(2)])

def normaliser(x, crete=0.9):
    return x / (np.max(np.abs(x)) + 1e-9) * crete

def fenetre(n, montee, descente):
    e = np.ones(n)
    a, b = int(montee * SR), int(descente * SR)
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if b:
        e[-b:] = np.linspace(1, 0, b) ** 2
    return e

# ════════════ 1. VOIX ════════════
V = piste()
iC, iN, iS = int(R["coupure"] * SR), int((R["noir"]) * SR), int((R["solution"] - 0.1) * SR)
v = np.zeros(N, dtype=np.float32)
v[: min(len(voix), N)] = voix[:N]

# Besoin : sèche et proche (léger corps dans le bas-médium).
besoin = v.copy(); besoin[iC:] = 0
besoin = besoin + 0.25 * passe_bande(besoin, 120, 300)
# Bascule : grande salle (RT60 2,6 s), plus de réverbe sur « Ils méritent un chauffeur ».
bascule = v.copy(); bascule[:iC] = 0; bascule[iS:] = 0
salle = reponse_salle(3.5, 2.6, sombre=5000)
humide = reverbe(bascule, salle)[:, :N]
dose = np.where(np.arange(N) < iN, 0.22, 0.34)
# Solution et fin : plus brillante et présente, petite pièce.
solution = v.copy(); solution[:iS] = 0
solution = plateau_aigu(solution, 4500, 3.0)
piece = reponse_salle(0.8, 0.35, sombre=8000)
sol_hum = reverbe(solution, piece)[:, :N]

for c in range(2):
    V[c] += besoin + bascule + solution + humide[c] * dose + sol_hum[c] * 0.05

# Écho sur « Rapide. », « Sûr. », « Confortable ! » : deux répétitions qui s'éloignent.
for nom in ("rapide", "sur", "confortable"):
    m = next(x for x in mots if abs(x["debut"] - R[nom]) < 1e-6)
    a, b = int(m["debut"] * SR), int((m["fin"] + 0.05) * SR)
    seg = passe_bas(solution[a:b], 3500)
    for k, (retard, g, pan) in enumerate(((0.30, -9, -0.5), (0.60, -15, 0.5), (0.90, -21, -0.3))):
        poser(V, seg, m["debut"] + retard, g, pan)

# ════════════ 2. MUSIQUE ════════════
MONTEE_MUSIQUE = 38.46  # instant (s) où la musique fournie s'élève (mesuré : attaque + saut de niveau)
DECALAGE = MONTEE_MUSIQUE - (R["rapide"] - 0.1)  # la montée tombe juste avant « Rapide »
mus = lire(ICI / "assets" / "audio" / "musique.mp3", 2)
M = piste()
src = mus[:, int(DECALAGE * SR): int(DECALAGE * SR) + N]
M[:, : src.shape[1]] = src
tt = np.arange(N) / SR
gain = np.full(N, -60.0)
# Besoin : presque absente, étouffée (passe-bas), très basse.
etouffee = passe_bas(M, 450, 2)
# Solution : entre doucement puis monte jusqu'au sommet sur « Rapide ».
s0, s1 = R["solution"] - 0.35, R["rapide"]
montee = np.clip((tt - s0) / (s1 - s0), 0, 1)
gain = np.where(tt < R["coupure"], -27.0, gain)
gain = np.where((tt >= s0) & (tt < s1), -15 + 9 * montee ** 1.5, gain)
gain = np.where(tt >= s1, -6.0, gain)
gain = np.where(tt >= R["confortable"] + 0.9, -2.5, gain)  # après la voix : la musique porte la fin
# Fondu de sortie final.
f0 = R["duree"] - 2.6
gain = np.where(tt > f0, gain - 40 * np.clip((tt - f0) / 2.6, 0, 1) ** 2, gain)
# Entrée en fondu à la solution.
entree = np.clip((tt - s0) / 0.6, 0, 1)
gain = np.where((tt >= s0) & (tt < s0 + 0.6), gain + 20 * np.log10(entree + 1e-4), gain)
# Ducking : la musique baisse sous la voix (enveloppe lissée de la voix sèche).
env_voix = np.abs(v)
env_voix = signal.lfilter([1 - np.exp(-1 / (0.08 * SR))], [1, -np.exp(-1 / (0.08 * SR))], env_voix)
parle = np.clip(env_voix / 0.02, 0, 1)
parle = signal.lfilter([1 - np.exp(-1 / (0.35 * SR))], [1, -np.exp(-1 / (0.35 * SR))], parle)
profondeur = np.where(tt >= R["rapide"], 3.0, 7.0)
gain_m = gain - profondeur * parle
musique = np.where(tt < R["coupure"], etouffee, M) * db(gain_m)
# Coupure nette avant « Soyons honnêtes ».
musique[:, iC:int(s0 * SR)] = 0

# ════════════ 3. EFFETS ════════════
S = piste()

# Tic-tac : de 1 tic/s à 4 tic/s, alterné tic / tac (clic métallique filtré + résonance).
def tic(aigu):
    d = t_(0.05)
    clic = passe_bande(rng.standard_normal(len(d)), 1800, 6000) * np.exp(-d * 400)
    f = 3400 if aigu else 2700
    reson = np.sin(2 * np.pi * f * d) * np.exp(-d * 160) * 0.5 + np.sin(2 * np.pi * f * 1.73 * d) * np.exp(-d * 260) * 0.25
    return normaliser(clic + reson, 0.8)
t, k = 0.15, 0
while t < R["coupure"] - 0.05:
    poser(S, tic(k % 2 == 0), t, -24 + 6 * (t / R["coupure"]), 0.15)
    t += 1.0 - 0.72 * (t / R["coupure"]) ** 1.2
    k += 1

# Nappe grave et tendue : cluster dissonant qui gonfle jusqu'à la coupure.
d = t_(R["coupure"])
nappe = sum(signal.sawtooth(2 * np.pi * f * d * (1 + 0.003 * np.sin(2 * np.pi * 0.2 * d + i))) for i, f in enumerate((55, 82.4, 116.5, 123.5)))
nappe = passe_bas(nappe, 380, 2) * (0.25 + 0.75 * (d / d[-1]) ** 1.6) * (1 + 0.15 * np.sin(2 * np.pi * 5.5 * d))
nappe *= fenetre(len(d), 1.5, 0.004)
poser(S, normaliser(nappe), 0, -25)

# Trafic étouffé : rumeur basse (bruit brun filtré) + voitures qui passent (souffles filtrés).
dT = R["coupure"] - R["carte"]
d = t_(dT)
rumeur = np.cumsum(rng.standard_normal(len(d))); rumeur = passe_haut(rumeur, 30); rumeur = passe_bas(rumeur, 420, 3)
rumeur = normaliser(rumeur) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.13 * d)) * fenetre(len(d), 0.8, 0.004)
poser(S, np.vstack([rumeur, np.roll(rumeur, 700)]), R["carte"], -21)
def passage(duree=1.6, f=900):
    d = t_(duree)
    b = passe_bande(rng.standard_normal(len(d)), 120, f)
    moteur = signal.sawtooth(2 * np.pi * np.cumsum(70 - 18 * d / duree) / SR) * 0.3
    return normaliser(passe_bas(b + moteur, f)) * np.sin(np.pi * d / duree) ** 3
for t, pan in ((R["carte"] + 0.6, -0.6), (R["taxis"] - 0.1, 0.7), (R["taxis"] + 0.45, -0.7), (R["bagages"] + 0.5, 0.4)):
    poser(S, passage(), t, -19, pan)

# Klaxons lointains (deux tons, timbre riche), étouffés et réverbérés.
def klaxon(duree=0.45, f=(415, 523)):
    d = t_(duree)
    x = sum(np.tanh(3 * signal.sawtooth(2 * np.pi * fi * d)) for fi in f)
    x = passe_bas(x, 1300, 2) * fenetre(len(d), 0.015, 0.08)
    return reverbe(normaliser(x), reponse_salle(1.2, 0.9, sombre=2500))[:, : len(d) + int(0.9 * SR)]
poser(S, klaxon(), R["carte"] + 0.35, -24, -0.4)
poser(S, klaxon(0.3, (370, 466)), R["taxis"] + 0.25, -23, 0.5)
poser(S, klaxon(0.25), R["taxis"] + 0.6, -26, 0.6)
poser(S, klaxon(0.55, (392, 494)), R["bagages"] + 0.2, -25, -0.3)

# Souffles (transitions, objets qui passent).
def souffle(duree=0.6, f0=300, f1=2500, montee=0.45):
    d = t_(duree); p = d / duree
    b = rng.standard_normal(len(d))
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    y = np.zeros_like(b); z1 = z2 = 0.0
    for i in range(len(b)):  # filtre passe-bande à fréquence variable (état variable)
        f = 2 * np.sin(np.pi * fc[i] / SR)
        z1 += f * (b[i] - z1 - 0.6 * z2) ; z2 += f * z1
        y[i] = z2
    env = np.where(p < montee, (p / montee) ** 2, ((1 - p) / (1 - montee)) ** 2)
    return normaliser(y * env)
poser(S, souffle(0.5), R["taxis"] - 0.05, -20, 0.5)
poser(S, souffle(0.45, 400, 3000), R["taxis"] + 0.5, -21, -0.5)

# Impact grave (« Ils méritent un chauffeur », logo).
def impact(force=1.0, rt=2.2):
    d = t_(2.5)
    sub = np.sin(2 * np.pi * np.cumsum(62 * np.exp(-d * 2.2) + 30) / SR) * np.exp(-d * 2.0)
    choc = passe_bas(rng.standard_normal(len(d)), 260, 2) * np.exp(-d * 18)
    sec = normaliser(sub + 0.6 * choc)
    queue = reverbe(sec, reponse_salle(rt + 1, rt, sombre=1800))
    return normaliser(np.vstack([sec, sec]) + 0.5 * queue[:, : len(d)] * force)

# Bascule : impact + réverbe qui s'éteint dans le noir.
poser(S, impact(1.0, 2.8), R["noir"] - 0.02, -9)

# Solution : sons d'interface (uisfx, CC0).
def ui(nom):
    return lire(ICI / "assets" / "sfx" / f"ui-{nom}.wav")
poser(S, ui("open"), R["billet"] - 0.05, -16, -0.2)
poser(S, ui("drop"), R["valise"], -15, 0.2)
poser(S, ui("swipe"), R["carte"] - 0.15, -16)
frappes = rng.uniform(0.07, 0.13, 40).cumsum()
for t in frappes[frappes < (R["envoi"] - R["frappe"] - 0.15)]:
    poser(S, ui("typing"), R["frappe"] + t, -20 + rng.uniform(-2, 2), 0.1)
poser(S, ui("press"), R["envoi"] - 0.06, -14)
poser(S, ui("send"), R["envoi"], -11)
poser(S, ui("receive"), R["reponse"], -11)
poser(S, ui("success"), R["confirme"], -12)
poser(S, souffle(0.9, 250, 1800, 0.5), R["trajet"], -22)
poser(S, ui("check"), R["arrivee"], -12)
for i, t in enumerate(R["cartes"]):
    poser(S, souffle(0.4, 500, 3500, 0.4), t - 0.05, -21, (-0.4, 0.4, -0.2, 0.3)[i])
    poser(S, ui("swipe"), t, -19, (-0.4, 0.4, -0.2, 0.3)[i])

# Fin : souffle vers le noir, impact sur le logo, clic du bouton.
poser(S, souffle(0.7, 200, 2200, 0.7), R["fin"] - 0.62, -15)
poser(S, impact(0.8, 1.8), R["fin"] - 0.02, -11)
poser(S, ui("press"), R["bouton"], -10)
poser(S, ui("success"), R["numero"], -15)

# ════════════ 4. SOMME ET MASTER ════════════
mix = V + musique + S
if __import__("os").environ.get("PISTES"):  # débogage : pistes séparées dans sources/
    for nom, x in (("voix", V), ("musique", musique), ("effets", S)):
        with wave.open(str(ICI / "sources" / f"piste-{nom}.wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(x.T, -1, 1) * 32767).astype(np.int16).tobytes())
# Coupure nette : effets et musique s'arrêtent à la coupure (la voix aussi est en pause ici).
ecrire_tmp = ICI / "sources" / "mix-brut.wav"
def ecrire(chemin, x):
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x.T, -1, 1) * 32767).astype(np.int16).tobytes())
ecrire(ecrire_tmp, normaliser(mix, 0.7))

def lufs(chemin):
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(chemin), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(m.rsplit("I:", 1)[1].split("LUFS")[0])

sortie = ICI / "assets" / "audio" / "mix.wav"
g = -14 - lufs(ecrire_tmp)
for _ in range(6):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(ecrire_tmp), "-af",
                    f"volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=80:level=false",
                    "-ar", str(SR), "-ac", "2", str(sortie)], check=True)
    e = -14 - lufs(sortie)
    if abs(e) < 0.15:
        break
    g += e

reperes = {k: (round(v, 3) if isinstance(v, float) else [round(x, 3) for x in v] if isinstance(v, list) else v)
           for k, v in R.items()}
(ICI / "assets" / "reperes.json").write_text(json.dumps(reperes, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
(ICI / "js" / "reperes.js").write_text("// Généré par scripts/mixer.py — ne pas modifier à la main.\n"
                                       f"window.REPERES = {json.dumps(reperes, ensure_ascii=False)};\n", encoding="utf-8")
print(f"Mix : {R['duree']} s -> {sortie.relative_to(ICI)} ({lufs(sortie):.1f} LUFS)")
