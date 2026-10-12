"""Place les effets sonores dans index.html, calés sur les mots de la voix.

Lit assets/voix-timing.json et les sections de js/temps.js, calcule le temps film de chaque
repère, et réécrit le bloc entre <!-- SFX:DEBUT --> et <!-- SFX:FIN -->.
À relancer après tout changement de voix ou de placement des sections.
Usage (depuis vitrine/) : python3 scripts/placer-sfx.py
"""
import json, re
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent
mots = json.loads((ICI / "assets" / "voix-timing.json").read_text(encoding="utf-8"))["mots"]
temps_js = (ICI / "js" / "temps.js").read_text(encoding="utf-8")
SECTIONS = [tuple(float(v) for v in m) for m in re.findall(r"debutVoix: ([\d.]+), finVoix: ([\d.]+), debutFilm: ([\d.]+)", temps_js)]
DUREES = {"souffle": 0.9, "souffle-court": 0.5, "marimba": 0.5, "marimba-grave": 0.7, "carillon": 0.9,
          "brillance": 1.6, "valide": 0.55, "notif-douce": 1.0, "tape": 0.06, "nappe": 1.6,
          "logo-accord": 2.6, "decollage": 2.6}

def film(t):
    for a, b, f in SECTIONS:
        if a <= t < b:
            return f + t - a
    a, b, f = SECTIONS[-1]
    return f + t - a

def mot(texte, n=1, fin=False):
    trouves = [m for m in mots if re.sub(r"[.,:;!?]", "", m["texte"]) == texte]
    return film(trouves[n - 1]["fin" if fin else "debut"])

E, R_, S_, C_ = mot("Express"), mot("Rapide"), mot("Sûr"), mot("Confortable")
sortie1 = C_ + 0.95
emb, ret, nous, chg = mot("embouteillages"), mot("retards"), mot("Nous"), mot("changer")
eco, trois, conf, quatre = mot("Éco"), mot("trois"), mot("Confort"), mot("quatre")
wifi, clim, ecran = mot("Wi-Fi"), mot("climatisation"), mot("écran")
aero, huit, voyager, voy, cinq, jour = mot("Aéroport"), mot("huit"), mot("voyager"), mot("Voyage"), mot("cinquante"), mot("jour", fin=True)
pro_debut = 30.0 - 0.5
ponct, attent, detail = mot("ponctuels"), mot("attentifs"), mot("détail")
reserv, whats, finnum, jp2, notre = mot("Réservez"), mot("WhatsApp"), mot("vingt-huit", fin=True), mot("JP", 2), mot("notre")

# (son, temps film, volume) — sons doux (scripts/sfx-doux.py), discrets sous la voix
sons = [
    # Scène 1
    ("souffle", 0.1, 0.35), ("logo-accord", E - 0.02, 0.45), ("brillance", E + 0.1, 0.25),
    ("marimba", R_ - 0.03, 0.3), ("marimba", S_ - 0.03, 0.3), ("marimba-grave", C_ - 0.04, 0.35),
    # Scène 2
    ("souffle", sortie1 - 0.1, 0.3), ("marimba-grave", emb - 0.05, 0.25), ("marimba-grave", ret - 0.05, 0.25),
    ("souffle-court", nous - 0.1, 0.3), ("valide", chg, 0.35), ("souffle", chg + 0.15, 0.3),
    # Scène 3
    ("souffle", eco - 1.0, 0.25), ("marimba", eco - 0.15, 0.3), ("carillon", trois + 0.85, 0.35),
    ("souffle", conf - 0.6, 0.25), ("marimba", conf + 0.15, 0.3), ("brillance", conf - 0.2, 0.2),
    ("carillon", quatre + 0.85, 0.35), ("marimba", wifi - 0.05, 0.22), ("marimba", clim - 0.05, 0.22),
    ("marimba", ecran - 0.05, 0.22),
    ("souffle", aero - 0.7, 0.25), ("marimba", aero + 0.1, 0.3), ("decollage", aero + 0.6, 0.35),
    ("carillon", huit + 0.65, 0.35),
    ("souffle", voyager - 0.4, 0.3), ("marimba", voy - 0.1, 0.3), ("carillon", cinq + 0.95, 0.35),
    # Scène 4
    ("souffle", pro_debut - 0.3, 0.3), ("marimba-grave", pro_debut + 1.3, 0.3),
    ("marimba", ponct - 0.05, 0.25), ("marimba", attent - 0.05, 0.25), ("marimba", detail - 0.05, 0.25),
    # Scène 5
    ("souffle", detail + 0.55, 0.3), ("nappe", reserv - 1.4, 0.3), ("marimba", whats - 0.1, 0.25),
    *[("tape", whats + i * (finnum - whats) / 10, 0.2) for i in range(10)],
    ("notif-douce", finnum + 0.15, 0.4), ("souffle", jp2 - 0.5, 0.3), ("logo-accord", jp2 + 0.05, 0.45),
    ("brillance", jp2 + 0.25, 0.25),
]

lignes = ["      <!-- SFX:DEBUT (généré par scripts/placer-sfx.py — ne pas modifier à la main) -->"]
fins_pistes = []  # attribution gloutonne : un son ne chevauche jamais un autre sur sa piste
for i, (nom, t0, vol) in enumerate(sorted(sons, key=lambda s: s[1])):
    d = min(DUREES[nom], 45 - t0)
    piste = next((k for k, f in enumerate(fins_pistes) if f <= t0), None)
    if piste is None:
        fins_pistes.append(0.0)
        piste = len(fins_pistes) - 1
    fins_pistes[piste] = t0 + d + 0.01
    lignes.append(
        f'      <audio id="sfx-{i:02d}-{nom}" src="assets/sfx/{nom}.wav" data-start="{t0:.2f}" '
        f'data-duration="{d:.2f}" data-track-index="{11 + piste}" data-volume="{vol}"></audio>')
lignes.append("      <!-- SFX:FIN -->")

html = (ICI / "index.html").read_text(encoding="utf-8")
bloc = "\n".join(lignes)
if "<!-- SFX:DEBUT" in html:
    html = re.sub(r"      <!-- SFX:DEBUT.*?<!-- SFX:FIN -->", lambda m: bloc, html, flags=re.S)
else:
    # Première fois : remplace les anciens sfx-s1-* écrits à la main.
    html = re.sub(r'(      <audio id="sfx-s1-[^\n]*\n)+', bloc + "\n", html)
(ICI / "index.html").write_text(html, encoding="utf-8")
print(f"{len(sons)} effets sonores placés")
