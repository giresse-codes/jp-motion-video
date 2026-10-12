#!/usr/bin/env bash
# Nettoie une voix off brute pour un rendu studio, avec ffmpeg uniquement.
# Usage : scripts/nettoyer-voix.sh brut.(wav|mp3|mp4) [sortie.mp3]   (défaut : assets/voiceoff.mp3)
#
# Chaîne :
#   1. passe-haut 80 Hz (grondements) + réduction de bruit FFT (afftdn, suivi du bruit)
#   2. silences > 0,45 s ramenés à 0,35 s, silence de tête coupé
#   3. égalisation : -2,5 dB à 250 Hz (boue), +2,5 dB à 3,5 kHz (présence), +1,5 dB au-dessus de 10 kHz (air)
#   4. dé-essage léger, compression 3:1 (seuil -20 dB, attaque 5 ms, relâchement 90 ms)
#   5. normalisation EBU R128 en deux passes : -16 LUFS, crête -1,5 dBTP
set -euo pipefail
ENTREE="$1"
SORTIE="${2:-$(dirname "$0")/../assets/voiceoff.mp3}"

FILTRES="highpass=f=80,afftdn=nr=10:nf=-50:tn=1,\
silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08:stop_periods=-1:stop_duration=0.45:stop_threshold=-45dB:stop_silence=0.35,\
equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3500:t=q:w=1.0:g=2.5,highshelf=f=10000:g=1.5,\
deesser=i=0.4,acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2"

# Passe 1 : mesure de la sonie après traitement.
MESURE=$(ffmpeg -hide_banner -nostats -i "$ENTREE" -vn -ac 1 \
  -af "$FILTRES,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
val() { echo "$MESURE" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }

# Passe 2 : normalisation linéaire à partir des mesures.
ffmpeg -hide_banner -loglevel error -y -i "$ENTREE" -vn -ac 1 \
  -af "$FILTRES,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(val input_i):measured_TP=$(val input_tp):measured_LRA=$(val input_lra):measured_thresh=$(val input_thresh):offset=$(val target_offset):linear=true" \
  -ar 44100 -c:a libmp3lame -b:a 192k "$SORTIE"

ffmpeg -hide_banner -nostats -i "$SORTIE" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
printf 'Voix nettoyée : %s (%.1f s)\n' "$SORTIE" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SORTIE")"
