#!/bin/bash
# capa nos 2 últimos segundos: capa.sh <tempo do quadro da capa em s>
set -e; cd ~/vid/xp; SLUG=xp-sem-ser-visto; OUT=/home/user/Pace-1/meu-projeto/publicacao/e-se
cp stills/$1 capa_base.png
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
fp = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open('capa_base.png').convert('RGB'); W, H = im.size; d = ImageDraw.Draw(im)
def big(txt, y, fill, size):
    while True:
        f = ImageFont.truetype(fp, size); bb = d.textbbox((0, 0), txt, font=f)
        if bb[2] - bb[0] < W - 120: break
        size -= 8
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    L = Image.new('RGBA', (w + 80, h + 80), (0, 0, 0, 0)); g = ImageDraw.Draw(L)
    g.text((52 - bb[0], 54 - bb[1]), txt, font=f, fill=(20, 10, 30, 210), stroke_width=16, stroke_fill=(20, 10, 30, 210))
    g.text((40 - bb[0], 40 - bb[1]), txt, font=f, fill=fill, stroke_width=16, stroke_fill=(20, 10, 30))
    L = L.rotate(-3, expand=True, resample=Image.BICUBIC); im.paste(L, ((W - L.width) // 2, y), L); return L.height
h = big("RANK E", 1150, (255, 255, 255), 200)
big("NÍVEL 99", 1150 + h - 30, (255, 225, 74), 230)
im.save('capa-xp-sem-ser-visto.jpg', quality=93)
PY
ffmpeg -y -v error -i final_9x16.mp4 -loop 1 -framerate 30 -t 2 -i capa-$SLUG.jpg -f lavfi -t 2 -i anullsrc=r=48000:cl=stereo \
 -filter_complex "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]scale=1080:1920,format=yuv420p,setsar=1[v1];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 19 -preset medium -c:a aac -b:a 192k -movflags +faststart $SLUG.mp4
echo "duração: $(ffprobe -v error -show_entries format=duration -of csv=p=0 $SLUG.mp4) | $(du -h $SLUG.mp4 | cut -f1)"
cp $SLUG.mp4 capa-$SLUG.jpg $OUT/
