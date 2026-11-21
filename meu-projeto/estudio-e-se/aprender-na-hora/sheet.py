import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
fs = sorted(x for x in os.listdir(d) if x.endswith('.jpg'))
cols = 6; tw, th = 270, 480
rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + 24)), (20, 20, 20))
for i, f in enumerate(fs):
    im = Image.open(os.path.join(d, f)).resize((tw, th))
    x, y = (i % cols) * tw, (i // cols) * (th + 24)
    S.paste(im, (x, y)); ImageDraw.Draw(S).text((x + 6, y + th + 4), f, fill=(255, 255, 0))
S.save(out, quality=85)
