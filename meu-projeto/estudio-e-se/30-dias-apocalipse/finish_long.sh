#!/bin/bash
set -e
cd /root/shorts/apoc; OUT=/home/user/Pace-1/meu-projeto/publicacao/e-se
LAND=1 CAPFS=64 KEYW="30,DIA,LÍVIA,ZUMBI,ZUMBIS,SALSICHA,ESTÁDIO" python3 /root/shorts/caps.py work/words.json work/caps.ass >/dev/null
L=$(ffmpeg -i work/mix.wav -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}'); G=$(python3 -c "print(-14-($L))")
ffmpeg -y -v error -framerate 24 -i frames/f%04d.jpg -i work/mix.wav -vf "ass=work/caps.ass" -filter:a "volume=${G}dB,alimiter=limit=0.89:level=false" -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -ac 2 -shortest -movflags +faststart out/30-dias-apocalipse.mp4
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
fp = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open('/root/shorts/apoc/frames/f%04d.jpg' % int(__import__('os').environ.get('CF', '300'))).convert('RGB').resize((1280, 720)); d = ImageDraw.Draw(im)
def big(txt, y, fill, size):
    f = ImageFont.truetype(fp, size); bb = d.textbbox((0, 0), txt, font=f); x = (1280 - (bb[2] - bb[0])) // 2
    d.text((x + 6, y + 8), txt, font=f, fill=(20, 10, 30), stroke_width=12, stroke_fill=(20, 10, 30)); d.text((x, y), txt, font=f, fill=fill, stroke_width=12, stroke_fill=(20, 10, 30))
big('30 DIAS COM A CRUSH', 22, (255, 210, 63), 96); big('NO APOCALIPSE', 138, (140, 235, 90), 70)
im.save('/root/shorts/apoc/out/capa-30-dias-apocalipse.jpg', quality=92)
PY
echo "loudness: $(ffmpeg -i out/30-dias-apocalipse.mp4 -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1)"
echo "qa: $(ffmpeg -i out/30-dias-apocalipse.mp4 -vf 'freezedetect=n=0.001:d=0.6,blackdetect=d=0.2' -map 0:v -f null - 2>&1 | grep -cE 'freeze_start|black_start') issues"
echo "duration: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/30-dias-apocalipse.mp4)"
cp out/30-dias-apocalipse.mp4 out/capa-30-dias-apocalipse.jpg $OUT/
