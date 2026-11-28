#!/bin/bash
# finish.sh <quadro da capa> : vídeo + legenda + -14 LUFS + capa nos 2 últimos segundos
set -e; cd /root/shorts/rpg; SLUG=sorte-decide-tudo; OUT=/home/user/Pace-1/meu-projeto/publicacao/e-se; CF=$(printf %04d $1)
L=$(ffmpeg -i work/mix.wav -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}'); G=$(python3 -c "print(-14-($L))")
mkdir -p out
ffmpeg -y -v error -framerate 24 -i frames/f%04d.jpg -i work/mix.wav -vf ass=work/caps.ass -filter:a "volume=${G}dB,alimiter=limit=0.89:level=false" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -ac 2 -shortest out/main.mp4
python3 - "frames/f$CF.jpg" "out/capa-$SLUG.jpg" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
fp = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; d = ImageDraw.Draw(im)
def big(txt, y, fill, size):
    while True:
        f = ImageFont.truetype(fp, size); bb = d.textbbox((0, 0), txt, font=f)
        if bb[2] - bb[0] < W - 110: break
        size -= 8
    w, h = bb[2] - bb[0], bb[3] - bb[1]; L = Image.new('RGBA', (w + 80, h + 80), (0, 0, 0, 0)); g = ImageDraw.Draw(L)
    g.text((52 - bb[0], 54 - bb[1]), txt, font=f, fill=(10, 8, 24, 210), stroke_width=18, stroke_fill=(10, 8, 24, 210))
    g.text((40 - bb[0], 40 - bb[1]), txt, font=f, fill=fill, stroke_width=18, stroke_fill=(10, 8, 24))
    L = L.rotate(-3, expand=True, resample=Image.BICUBIC); im.paste(L, ((W - L.width) // 2, y), L); return L.height
h = big("SORTE: 99", 1180, (255, 210, 63), 230); big("CLASSE SECRETA!", 1180 + h - 30, (255, 255, 255), 120)
im.save(sys.argv[2], quality=93)
PY
ffmpeg -y -v error -i out/main.mp4 -loop 1 -framerate 24 -t 2 -i out/capa-$SLUG.jpg -f lavfi -t 2 -i anullsrc=r=44100:cl=stereo \
 -filter_complex "[0:v]fps=24,format=yuv420p,setsar=1[v0];[1:v]scale=1080:1920,format=yuv420p,setsar=1[v1];[0:a]aresample=44100,aformat=channel_layouts=stereo[a0];[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -movflags +faststart out/$SLUG.mp4
echo "loudness: $(ffmpeg -i out/main.mp4 -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1)"; echo "duração: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/$SLUG.mp4) | $(du -h out/$SLUG.mp4 | cut -f1)"
cp out/$SLUG.mp4 out/capa-$SLUG.jpg $OUT/
