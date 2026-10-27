#!/usr/bin/env bash
# Montage « cover lyrics » (TikTok 1080×1920) : l'enregistrement des paroles (medias/paroles.mp4) est coupé
# au point de synchro et incrusté dans l'espace noir de l'enregistrement d'écran (medias/voix-ecran.mp4),
# dont on garde le son (la voix + la musique de fond). Tout est local (ffmpeg + Pillow), aucun téléchargement.
# Usage : scripts/monter.sh [apercu|final]
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-apercu}"

# Synchro mesurée par corrélation des deux bandes-son : t=0 de la voix = 9,555 s des paroles
# (juste avant « yeah, you see my thick thighs »).
DEBUT=9.555
# Zone des paroles dans medias/paroles.mp4 (écran incurvé, pochette + paroles) et sa place dans l'espace noir.
CROP="614:520:53:270"; L=934; H=790; X=73; Y=352; RAYON=40
# L'enregistrement d'écran fait 1080×1456 : on l'agrandit en 1080×1920 par des bandes noires (haut 232 px).
DECALE=232
DUREE=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration -of csv=p=0 medias/voix-ecran.mp4)

python3 scripts/calques.py $L $H $RAYON > /dev/null
mkdir -p renders

# Son : celui de l'enregistrement d'écran, tel quel (aucune réduction de bruit, aucun réglage de la voix
# ni du volume) ; la piste mono est seulement dupliquée sur les deux canaux.
AUDIO="pan=stereo|c0=c0|c1=c0"

FILTRE="[0:v]fps=30,drawbox=x=0:y=338:w=1080:h=96:color=black:t=fill,tpad=stop_mode=clone:stop_duration=2,pad=1080:1920:0:${DECALE}:black[fond];
[1:v]fps=30,crop=${CROP},scale=${L}:${H}:flags=lanczos,eq=contrast=1.06:saturation=1.08,format=rgba,tpad=stop_mode=clone:stop_duration=2[p];
[2:v]format=gray,loop=-1:1:0[m];
[p][m]alphamerge,fade=t=in:st=0:d=0.35:alpha=1[ecran];
[3:v]loop=-1:1:0,format=rgba,fade=t=in:st=0:d=0.35:alpha=1[halo];
[fond][halo]overlay=$((X-40)):$((Y+DECALE-40)):shortest=0[f1];
[f1][ecran]overlay=${X}:$((Y+DECALE)):shortest=0,format=yuv420p[v]"

if [ "$MODE" = "final" ]; then
  SORTIE=renders/cover-lyrics.mp4; QUAL=(-c:v libx264 -preset slow -crf 18 -profile:v high -b:a 192k)
  FILTRE_FIN="[v]null[vo]"
else
  SORTIE=renders/apercu-cover.mp4; QUAL=(-c:v libx264 -preset veryfast -crf 26 -b:a 128k)
  FILTRE_FIN="[v]scale=540:960[vo]"
fi

ffmpeg -loglevel error -y \
  -i medias/voix-ecran.mp4 \
  -ss "$DEBUT" -i medias/paroles.mp4 \
  -i medias/masque.png -i medias/halo.png \
  -filter_complex "${FILTRE};${FILTRE_FIN};[0:a]${AUDIO}[a]" \
  -map "[vo]" -map "[a]" -t "$DUREE" -r 30 "${QUAL[@]}" -c:a aac -movflags +faststart "$SORTIE"
echo "$SORTIE"
