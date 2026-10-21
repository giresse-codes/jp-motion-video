#!/usr/bin/env bash
# Crée une nouvelle vidéo JP Papier à partir du modèle : scripts/nouvelle-video.sh pub-mon-histoire
# Copie frame.md, la feuille commune, les composants, les polices et l'emblème ; la démo sert de point de départ.
set -euo pipefail
ICI="$(cd "$(dirname "$0")/.." && pwd)"
NOM="${1:?Usage : scripts/nouvelle-video.sh <dossier>}"
DEST="$(cd "$ICI/.." && pwd)/$NOM"
[ -e "$DEST" ] && { echo "$DEST existe déjà"; exit 1; }
mkdir -p "$DEST"/{css,js,scripts,assets/audio,assets/images,renders}
cp "$ICI"/frame.md "$ICI"/hyperframes.json "$ICI"/.gitignore "$ICI"/package.json "$DEST"/
cp "$ICI"/css/jp-papier.css "$DEST"/css/
cp "$ICI"/js/gsap.min.js "$ICI"/js/jp-papier.js "$ICI"/js/temps.js "$DEST"/js/
cp "$ICI"/js/demo.js "$DEST"/js/main.js
cp "$ICI"/scripts/sons.py "$ICI"/scripts/transcrire.py "$DEST"/scripts/
cp -r "$ICI"/assets/fonts "$ICI"/assets/sfx "$DEST"/assets/
cp "$ICI"/assets/images/embleme-jp.png "$DEST"/assets/images/
cp "$ICI"/assets/audio/nappe.wav "$ICI"/assets/audio/sfx.wav "$DEST"/assets/audio/   # régénérées par scripts/sons.py
cp "$ICI"/assets/audio/voix-demo.mp3 "$DEST"/assets/audio/voix.mp3                   # à remplacer par la vraie voix
sed 's#js/demo.js#js/main.js#; s#voix-demo.mp3#voix.mp3#; s#JP Papier — démo des composants#JP Papier — '"$NOM"'#' "$ICI"/index.html > "$DEST"/index.html
echo "Créé : $DEST — remplacer assets/audio/voix.mp3, transcrire, puis écrire js/main.js et js/temps.js."
