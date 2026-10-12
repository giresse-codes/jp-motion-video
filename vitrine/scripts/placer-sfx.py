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
DUREES = {"whoosh": 0.7, "whoosh-court": 0.4, "impact": 1.0, "boom": 3.4, "montee": 1.1, "scintillement": 1.4,
          "glitch": 0.32, "tic": 0.06, "neon": 0.55, "pop": 0.12, "prix": 0.8, "bip": 0.11, "notif": 0.61,
          "klaxon": 0.42, "clic": 0.05, "decollage": 2.4}

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

# (son, temps film, volume)
sons = [
    # Scène 1
    ("whoosh", 0.15, 0.5), ("neon", E - 0.35, 0.35), ("boom", E - 0.02, 0.55),
    ("impact", R_ - 0.03, 0.4), ("whoosh-court", S_ - 0.09, 0.4), ("impact", C_ - 0.04, 0.45),
    # Scène 2
    ("whoosh", sortie1 - 0.05, 0.45), ("klaxon", emb + 0.05, 0.3), ("glitch", emb - 0.05, 0.35),
    ("klaxon", ret + 0.15, 0.25), ("glitch", ret - 0.05, 0.35), ("klaxon", ret + 0.75, 0.2),
    *[("tic", ret + 0.5 * i, 0.3) for i in range(int((nous - ret) / 0.5))],
    ("whoosh-court", nous, 0.45), ("bip", chg, 0.35), ("whoosh", chg + 0.2, 0.4),
    # Scène 3
    ("whoosh", eco - 1.0, 0.35), ("pop", eco - 0.15, 0.4), ("prix", trois + 0.85, 0.35),
    ("whoosh", conf - 0.6, 0.35), ("pop", conf + 0.15, 0.4), ("scintillement", conf - 0.2, 0.25),
    ("prix", quatre + 0.85, 0.35), ("pop", wifi - 0.05, 0.4), ("pop", clim - 0.05, 0.4), ("bip", ecran - 0.05, 0.35),
    ("whoosh", aero - 0.7, 0.35), ("pop", aero + 0.1, 0.4), ("decollage", aero + 0.6, 0.45), ("prix", huit + 0.65, 0.35),
    ("whoosh", voyager - 0.35, 0.45), ("pop", voy - 0.1, 0.4),
    ("whoosh-court", voy, 0.3), ("whoosh-court", voy + 0.7, 0.3), ("whoosh-court", voy + 1.4, 0.3),
    ("prix", cinq + 0.95, 0.35), ("impact", jour + 0.3, 0.3),
    # Scène 4
    ("whoosh", pro_debut - 0.3, 0.4), ("whoosh", pro_debut + 0.7, 0.35), ("impact", pro_debut + 1.3, 0.4),
    ("clic", ponct - 0.2, 0.5), ("pop", ponct - 0.05, 0.4), ("pop", attent - 0.05, 0.4), ("pop", detail - 0.05, 0.4),
    # Scène 5
    ("whoosh", detail + 0.55, 0.4), ("montee", reserv - 1.2, 0.4), ("scintillement", detail + 0.9, 0.25),
    ("pop", reserv - 0.35, 0.35), ("pop", whats - 0.1, 0.3),
    *[("clic", whats + i * (finnum - whats) / 14, 0.35) for i in range(14)],
    ("notif", finnum + 0.15, 0.55), ("whoosh", jp2 - 0.45, 0.4), ("boom", jp2 + 0.05, 0.5),
    ("scintillement", jp2 + 0.2, 0.3), ("pop", jp2 + 0.5, 0.35), ("impact", notre - 0.05, 0.3),
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
