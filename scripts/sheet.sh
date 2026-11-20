#!/bin/bash
# planche contact : scripts/sheet.sh out.png f1 f2 ...
o=$1; shift; args=""; f=""; i=0
for fr in "$@"; do args="$args -i out/frame-$fr.png"; f="$f[$i]scale=270:-1[v$i];"; i=$((i+1)); done
st=""; for j in $(seq 0 $((i-1))); do st="$st[v$j]"; done
ffmpeg -loglevel error -y $args -filter_complex "${f}${st}hstack=$i" $o
