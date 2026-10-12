"""Génère paysage.html (1920×1080) à partir de index.html (1080×1920).
Le film est le même ; seuls changent le format, la feuille css/paysage.css et le cadrage
caméra (js/camera.js lit html[data-format]). À relancer après toute modification d'index.html.
Usage (depuis vitrine/) : python3 scripts/generer-paysage.py
Rendu : npx hyperframes render -c paysage.html -f 60 -q delivery -o renders/jp-vitrine-paysage.mp4
"""
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent
html = (ICI / "index.html").read_text(encoding="utf-8")
remplacements = [
    ('<html lang="fr" data-resolution="portrait">', '<html lang="fr" data-resolution="landscape" data-format="paysage">'),
    ('<meta name="viewport" content="width=1080, height=1920" />', '<meta name="viewport" content="width=1920, height=1080" />'),
    ('<link rel="stylesheet" href="css/scenes.css" />', '<link rel="stylesheet" href="css/scenes.css" />\n    <link rel="stylesheet" href="css/paysage.css" />'),
    ('data-composition-id="main"', 'data-composition-id="paysage"'),
    ('data-width="1080"\n      data-height="1920"', 'data-width="1920"\n      data-height="1080"'),
    ('window.__timelines["main"] = tl;', 'window.__timelines["paysage"] = tl;'),
    ("<title>JP Service Express Urbaine — vitrine</title>", "<title>JP Service Express Urbaine — vitrine (16:9)</title>"),
]
for avant, apres in remplacements:
    if avant not in html:
        raise SystemExit(f"Motif introuvable dans index.html : {avant[:60]}")
    html = html.replace(avant, apres)
html = html.replace("<!doctype html>", "<!doctype html>\n<!-- Généré par scripts/generer-paysage.py à partir d'index.html — ne pas modifier à la main. -->", 1)
(ICI / "paysage.html").write_text(html, encoding="utf-8")
print("paysage.html généré")
