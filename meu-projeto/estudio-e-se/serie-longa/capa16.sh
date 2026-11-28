#!/bin/bash
# capa16.sh <pasta> <slug> <still.png> "<linha 1>" "<linha 2>"  -> capa 16:9 nos 2 últimos segundos
set -e; cd "$1"; SLUG=$2; OUT=/home/user/Pace-1/meu-projeto/publicacao/e-se
cp "stills/$3" capa_base.png
L1="$4" L2="$5" SLUG=$SLUG python3 - <<'PY'
import os
from PIL import Image, ImageDraw, ImageFont
fp = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open('capa_base.png').convert('RGB').resize((1920, 1080)); W, H = im.size; d = ImageDraw.Draw(im)
def big(txt, y, fill, size):
    while True:
        f = ImageFont.truetype(fp, size); bb = d.textbbox((0, 0), txt, font=f)
        if bb[2] - bb[0] < W - 160: break
        size -= 8
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    L = Image.new('RGBA', (w + 100, h + 100), (0, 0, 0, 0)); g = ImageDraw.Draw(L)
    g.text((62 - bb[0], 64 - bb[1]), txt, font=f, fill=(20, 10, 30, 210), stroke_width=20, stroke_fill=(20, 10, 30, 210))
    g.text((50 - bb[0], 50 - bb[1]), txt, font=f, fill=fill, stroke_width=20, stroke_fill=(20, 10, 30))
    L = L.rotate(-2, expand=True, resample=Image.BICUBIC); im.paste(L, ((W - L.width) // 2, y), L); return L.height
h = big(os.environ['L1'], 10, (255, 255, 255), 150)
big(os.environ['L2'], 10 + h - 50, (255, 225, 74), 140)
im.save(f"capa-{os.environ['SLUG']}.jpg", quality=92)
PY
ffmpeg -y -v error -i final_16x9.mp4 -loop 1 -framerate 30 -t 2 -i capa-$SLUG.jpg -f lavfi -t 2 -i anullsrc=r=48000:cl=stereo \
 -filter_complex "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]scale=1920:1080,format=yuv420p,setsar=1[v1];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 26 -preset medium -maxrate 1100k -bufsize 2200k -c:a aac -b:a 128k -movflags +faststart $SLUG.mp4
echo "duração: $(ffprobe -v error -show_entries format=duration -of csv=p=0 $SLUG.mp4) | $(du -h $SLUG.mp4 | cut -f1)"
cp $SLUG.mp4 capa-$SLUG.jpg $OUT/
