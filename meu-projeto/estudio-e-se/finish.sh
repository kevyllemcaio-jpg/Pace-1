#!/bin/bash
# usage: finish.sh <project dir> <slug> <cover frame> "<line1>" "<line2>"
set -e
cd "$1"; SLUG=$2; CF=$(printf %04d $3); L1=$4; L2=$5; TY=${6:-1210}
OUT=/home/user/Pace-1/meu-projeto/publicacao/e-se
L=$(ffmpeg -i work/mix.wav -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}')
G=$(python3 -c "print(-14-($L))")
mkdir -p out
ffmpeg -y -v error -framerate 30 -i frames/f%04d.jpg -i work/mix.wav -filter:a "volume=${G}dB,alimiter=limit=0.89:level=false" -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -ac 2 -shortest out/main.mp4
python3 - "$CF" "$L1" "$L2" "out/capa-$SLUG.jpg" "$TY" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
cf, l1, l2, out, ty = sys.argv[1:6]; ty = int(ty)
fp = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open(f'frames/f{cf}.jpg').convert('RGB'); W, H = im.size; d = ImageDraw.Draw(im)
def big(txt, y, fill, rot=-4):
    size = 240
    while True:
        f = ImageFont.truetype(fp, size); bb = d.textbbox((0, 0), txt, font=f)
        if bb[2] - bb[0] < W - 120 or size < 80: break
        size -= 10
    w, h = bb[2]-bb[0], bb[3]-bb[1]
    L = Image.new('RGBA', (w + 80, h + 80), (0,0,0,0)); g = ImageDraw.Draw(L)
    g.text((52 - bb[0], 54 - bb[1]), txt, font=f, fill=(20,10,30,210), stroke_width=18, stroke_fill=(20,10,30,210))
    g.text((40 - bb[0], 40 - bb[1]), txt, font=f, fill=fill, stroke_width=18, stroke_fill=(20,10,30))
    L = L.rotate(rot, expand=True, resample=Image.BICUBIC); im.paste(L, ((W - L.width)//2, y), L)
    return L.height
h = big(l1, ty, (255, 210, 63))
if l2: big(l2, ty + h - 40, (255, 95, 162))
im.save(out, quality=93)
PY
ffmpeg -y -v error -i out/main.mp4 -loop 1 -framerate 30 -t 2 -i out/capa-$SLUG.jpg -f lavfi -t 2 -i anullsrc=r=44100:cl=stereo \
 -filter_complex "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]scale=1080:1920,format=yuv420p,setsar=1[v1];[0:a]aresample=44100,aformat=channel_layouts=stereo[a0];[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 17 -preset medium -c:a aac -b:a 192k -movflags +faststart out/$SLUG.mp4
echo "loudness: $(ffmpeg -i out/main.mp4 -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1)"
echo "qa: $(ffmpeg -i out/main.mp4 -vf 'freezedetect=n=0.001:d=0.4,blackdetect=d=0.1' -map 0:v -f null - 2>&1 | grep -cE 'freeze_start|black_start') issues"
echo "duration: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/$SLUG.mp4)"
cp out/$SLUG.mp4 out/capa-$SLUG.jpg $OUT/
D=/home/user/Pace-1/meu-projeto/estudio-e-se/$SLUG; mkdir -p $D
cp -r web render.mjs sheet.py audio.py synth.py mix.py script.txt $D/ 2>/dev/null || true
