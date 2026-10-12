"""Recale les fenêtres des clips de index.html sur assets/reperes.json (après chaque mixage).
Usage (depuis pub-chauffeur/) : python3 scripts/caler-html.py
"""
import json, re
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent
R = json.loads((ICI / "assets" / "reperes.json").read_text(encoding="utf-8"))
D = R["duree"]
FENETRES = {  # id -> (début, fin)
    "racine": (0, D), "fond": (0, D), "mix": (0, D),
    "s1": (0, R["coupure"]),
    "s2": (R["coupure"], R["solution"] + 0.3),
    "s3": (R["solution"] - 0.1, R["fin"] + 0.4),
    "s4": (R["fin"] - 0.2, D),
}
html = (ICI / "index.html").read_text(encoding="utf-8")
for ident, (a, b) in FENETRES.items():
    motif = re.compile(r'(id="%s"[^>]*?data-start=")[\d.]+("[^>]*?data-duration=")[\d.]+(")' % ident, re.S)
    html, n = motif.subn(lambda m: f"{m.group(1)}{a:.2f}{m.group(2)}{b - a:.2f}{m.group(3)}", html)
    if n == 0 and ident not in ("s4",):
        print("introuvable :", ident)
(ICI / "index.html").write_text(html, encoding="utf-8")
print("Fenêtres recalées, durée", D)
