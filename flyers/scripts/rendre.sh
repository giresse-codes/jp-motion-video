#!/usr/bin/env bash
# Capture chaque flyers/*.html en PNG 1080×1350 dans flyers/rendus/ (Chromium sans tête).
# Usage : flyers/scripts/rendre.sh [nom-sans-extension ...]
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/opt/pw-browsers/chromium}"
noms=("$@"); [ ${#noms[@]} -eq 0 ] && noms=($(ls *.html | sed 's/\.html$//'))
mkdir -p rendus
for n in "${noms[@]}"; do
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1080,1500 --virtual-time-budget=3000 --screenshot="rendus/$n.png" "file://$PWD/$n.html" 2>/dev/null
  # La fenêtre est plus haute que la page : on recadre à 1080×1350 exactement.
  python3 -c "from PIL import Image; import sys; Image.open(sys.argv[1]).crop((0,0,1080,1350)).save(sys.argv[1], optimize=True)" "rendus/$n.png"
  echo "rendus/$n.png"
done
