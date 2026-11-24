#!/bin/bash
# uso: voz.sh <pasta> "<titulo>"
cd "$1" && rm -rf audio && grep -v '^#' roteiro.txt | grep -v '^$' | cut -d'|' -f3 | awk '{print "f" sprintf("%03d",NR-1) "|narrador|" $0}' > falas.txt && python3 /root/vid/serie16/tts_v.py "$2" 2>&1 | grep -v Fontconfig | tail -2
