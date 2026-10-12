#!/usr/bin/env bash
# Transforme un fichier texte en voix off MP3 avec Piper TTS (hors ligne, sans clé API).
#
# Usage :
#   scripts/voix.sh texte.txt [sortie.mp3]
#
# Réglages (variables d'environnement, toutes optionnelles) :
#   VOIX       modèle Piper (défaut : fr_FR-siwis-medium ; autre : fr_FR-upmc-medium)
#   VOIX_DIR   dossier des modèles .onnx (défaut : voix/ à la racine du dépôt)
#   VITESSE    durée des phonèmes : 1.0 normal, 1.1 plus lent, 0.9 plus rapide (défaut : 1.0)
#   PAUSE      silence après chaque phrase, en secondes (défaut : 0.35)
#   LOCUTEUR   numéro de locuteur pour les modèles à plusieurs voix (défaut : 0)
#
# Le texte peut contenir des lignes de commentaire commençant par « # » : elles sont ignorées.
# Le MP3 est normalisé à -16 LUFS (niveau standard pour les réseaux sociaux), 44,1 kHz, 192 kb/s.
#
# Prérequis : pip install piper-tts ; ffmpeg.
set -euo pipefail

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VOIX="${VOIX:-fr_FR-siwis-medium}"
VOIX_DIR="${VOIX_DIR:-$RACINE/voix}"
VITESSE="${VITESSE:-1.0}"
PAUSE="${PAUSE:-0.35}"
LOCUTEUR="${LOCUTEUR:-0}"

if [[ $# -lt 1 || "$1" == "-h" || "$1" == "--help" ]]; then
  sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

ENTREE="$1"
SORTIE="${2:-${ENTREE%.*}.mp3}"
[[ -f "$ENTREE" ]] || { echo "Fichier texte introuvable : $ENTREE" >&2; exit 1; }

command -v ffmpeg >/dev/null || { echo "ffmpeg est requis." >&2; exit 1; }
python3 -c "import piper" 2>/dev/null || { echo "Piper manque : pip install piper-tts" >&2; exit 1; }

MODELE="$VOIX_DIR/$VOIX.onnx"
if [[ ! -f "$MODELE" || ! -f "$MODELE.json" ]]; then
  # Chemin dans le dépôt rhasspy/piper-voices : <langue>/<langue_PAYS>/<nom>/<qualité>/
  IFS='-' read -r LANGUE_PAYS NOM QUALITE <<<"$VOIX"
  BASE="https://huggingface.co/rhasspy/piper-voices/resolve/main/${LANGUE_PAYS%%_*}/$LANGUE_PAYS/$NOM/$QUALITE"
  mkdir -p "$VOIX_DIR"
  echo "Modèle $VOIX absent, tentative de téléchargement…" >&2
  if ! { curl -fsSL -o "$MODELE.tmp" "$BASE/$VOIX.onnx" &&
         curl -fsSL -o "$MODELE.json" "$BASE/$VOIX.onnx.json" &&
         curl -fsSL -o "$VOIX_DIR/$VOIX.MODEL_CARD" "$BASE/MODEL_CARD"; }; then
    rm -f "$MODELE.tmp" "$MODELE.json"
    cat >&2 <<EOF

Téléchargement impossible. Récupère ces fichiers à la main et place-les dans $VOIX_DIR/ :
  $BASE/$VOIX.onnx
  $BASE/$VOIX.onnx.json
  $BASE/MODEL_CARD   (à renommer en $VOIX.MODEL_CARD : licence de la voix)
EOF
    exit 1
  fi
  mv "$MODELE.tmp" "$MODELE"
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Retire les commentaires et les lignes vides superflues.
grep -v '^[[:space:]]*#' "$ENTREE" | sed '/^[[:space:]]*$/N;/^\n$/D' >"$TMP/texte.txt"

python3 -m piper \
  -m "$MODELE" -c "$MODELE.json" \
  -i "$TMP/texte.txt" -f "$TMP/voix.wav" \
  -s "$LOCUTEUR" --length-scale "$VITESSE" --sentence-silence "$PAUSE"

ffmpeg -hide_banner -loglevel error -y -i "$TMP/voix.wav" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 1 \
  -c:a libmp3lame -b:a 192k "$SORTIE"

DUREE="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SORTIE")"
printf 'Voix générée : %s (%.1f s, voix %s)\n' "$SORTIE" "$DUREE" "$VOIX"
