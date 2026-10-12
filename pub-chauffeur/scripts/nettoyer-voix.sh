#!/usr/bin/env bash
# Nettoie la voix enregistrée par l'utilisateur (vidéo MP4 ou audio) -> sources/voix-perso.wav
# Mesures (spectre moyen de la parole, relatif à 1–2 kHz) : fondamentale très chargée vers 90 Hz
# (voix grave prise près du micro : +46 dB contre ~+18 pour une voix pro), aigus corrects,
# bruit de fond vers -45 dB, ~1 800 échantillons écrêtés. Traitement :
#   adeclip         répare les crêtes écrêtées
#   highpass x2     coupe-bas raide à 80 Hz (proximité, souffle)
#   afftdn          réduction de bruit douce (10 dB, plancher -45 dB)
#   equalizer 92 Hz -10 dB : la bosse de la fondamentale
#   lowshelf 220 Hz -6 dB : grave boueux
#   equalizer 600 Hz +2 dB : corps de la voix
#   equalizer 3,2 kHz +1,5 dB, highshelf 8 kHz +2 dB : présence et air, légers
#   deesser, acompressor 2:1 : « s » adoucis, niveau régulier
# Résultat : 60–120 Hz +25, 120–250 +24, 250–500 +14 (proche d'une voix pro).
# Usage : scripts/nettoyer-voix.sh <entrée> [sortie]
set -euo pipefail
ENTREE="$1"
SORTIE="${2:-sources/voix-perso.wav}"
ffmpeg -loglevel error -y -i "$ENTREE" -vn -ac 1 -ar 48000 -af "\
volume=-6dB,\
adeclip=window=55:overlap=75,\
highpass=f=80:poles=2,highpass=f=80:poles=2,\
afftdn=nr=10:nf=-45:tn=1,\
equalizer=f=92:t=o:w=1.1:g=-10,\
lowshelf=f=220:g=-6:t=s:w=0.7,\
equalizer=f=600:t=o:w=1.2:g=2,\
equalizer=f=3200:t=o:w=1.5:g=1.5,\
highshelf=f=8000:g=2,\
deesser=i=0.35:m=0.5:f=0.5,\
acompressor=threshold=0.1:ratio=2:attack=10:release=150:makeup=1" "$SORTIE"
echo "Voix nettoyée -> $SORTIE"
