"""Bande-son de l'edit : le son fourni par l'utilisateur (son TikTok réutilisé) + effets discrets.
Effets : uisfx (CC0) pour la frappe et les clics, souffles fabriqués pour les transitions.
Sortie : assets/audio/mix.wav (-14 LUFS, crête < -1 dBTP). Le son n'est pas commité (droits).
Usage (depuis edit-giresse/) : python3 scripts/mixer.py
"""
import json, re, subprocess, wave
from pathlib import Path
import numpy as np

ICI = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(15)
db = lambda v: 10 ** (v / 20)
T = json.loads(re.search(r"^window\.T = (\{.*\});", (ICI / "js" / "temps.js").read_text(), re.M).group(1))
N = int(T["duree"] * SR)

def lire(c, canaux=1):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(c), "-ac", str(canaux), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, dtype=np.float32).copy()
    return x.reshape(-1, canaux).T if canaux > 1 else x

def poser(dest, son, t, g=0.0, pan=0.0):
    if son.ndim == 1:
        son = np.vstack([son * np.cos((pan + 1) * np.pi / 4) * 1.414, son * np.sin((pan + 1) * np.pi / 4) * 1.414])
    i = int(t * SR); n = min(son.shape[1], N - i)
    if n > 0:
        dest[:, i:i + n] += son[:, :n] * db(g)

def souffle(duree=0.6, f0=300, f1=2600, pic=0.5):
    tt = np.arange(int(duree * SR)) / SR; p = tt / duree
    b = rng.standard_normal(len(tt)); y = np.zeros_like(b); z1 = z2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * p)
    for i in range(len(b)):
        f = 2 * np.sin(np.pi * fc[i] / SR); z1 += f * (b[i] - z1 - 0.6 * z2); z2 += f * z1; y[i] = z2
    y *= np.where(p < pic, (p / pic) ** 2, ((1 - p) / (1 - pic)) ** 2)
    return y / (np.abs(y).max() + 1e-9)

ui = lambda n: lire(ICI / "assets" / "sfx" / f"ui-{n}.wav")
son = lire(ICI / "assets" / "audio" / "son.wav", 2)[:, :N]
son = np.pad(son, ((0, 0), (0, N - son.shape[1])))
S = np.zeros((2, N))
for a, b in ((T["saisie1"], T["saisie1Fin"]), (T["saisie2"], T["saisie2Fin"]), (T["saisie3"], T["saisie3Fin"])):
    for t in np.arange(a, b, 0.07):
        poser(S, ui("typing"), t, -24 + rng.uniform(-2, 2), 0.1)
for t in (T["clic"], T["envoi1"], T["envoi2"], T["saisie3Fin"] + 0.08):
    poser(S, ui("press"), t - 0.03, -17)
poser(S, souffle(0.9, 200, 3000, 0.7), T["pluie1"] - 0.2, -16)
poser(S, souffle(0.9, 200, 3000, 0.7), T["pluie2"] - 0.2, -16)
poser(S, souffle(0.5, 400, 2500, 0.4), T["carte"] - 0.1, -20)
mix = son + S
tmp = ICI / "assets" / "audio" / "mix-brut.wav"
with wave.open(str(tmp), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix.T / (np.abs(mix).max() + 1e-9) * 0.7, -1, 1) * 32767).astype(np.int16).tobytes())
def lufs(c):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(c), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(r.rsplit("I:", 1)[1].split("LUFS")[0])
sortie = ICI / "assets" / "audio" / "mix.wav"
g = -14 - lufs(tmp)
for _ in range(6):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af", f"volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=80:level=false", "-ar", str(SR), str(sortie)], check=True)
    e = -14 - lufs(sortie)
    if abs(e) < 0.15:
        break
    g += e
tmp.unlink()
print(f"Mix : {T['duree']} s, {lufs(sortie):.1f} LUFS")
