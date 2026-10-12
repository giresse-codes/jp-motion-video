#!/usr/bin/env bash
# Rend la couverture 1080x1920 (couverture/couverture.html) en PNG avec le Chrome de HyperFrames.
# Usage (depuis pub-chauffeur/) : scripts/couverture.sh [sortie.png]
set -euo pipefail
SORTIE="${1:-renders/couverture.png}"
CHROME="${CHROME:-$(find ~/.cache/hyperframes/chrome -name chrome-headless-shell -type f | head -1)}"
mkdir -p "$(dirname "$SORTIE")"
"$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1080,1920 --virtual-time-budget=3000 --allow-file-access-from-files \
  --screenshot="$(realpath -m "$SORTIE")" "file://$(realpath couverture/couverture.html)" 2>/dev/null
echo "Couverture -> $SORTIE"
