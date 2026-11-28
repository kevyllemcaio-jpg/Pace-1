import sys, os, json, math, random, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
W, H, FPS = 1080, 1920, int(os.environ.get('CFPS', 12))
IN = os.environ.get('CIN', '/root/b3d/fr_neve'); EXT = os.environ.get('CEXT', 'png'); OUT = os.environ.get('CF', '/root/b3d/cf_neve'); os.makedirs(OUT, exist_ok=True)
ws = json.load(open('/root/shorts/treinador/work/words.json')); ST = {}
for w in ws: ST.setdefault(w['seg'], w['inicio'])
NSEG = max(ST) + 1; TOTAL = ws[-1]['fim'] + 0.6
BOUND = [0.0] + [ST[i] - 0.06 for i in range(1, NSEG)] + [TOTAL]
FK = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', s)
NOITE = set(range(3, 6)) | set(range(38, 60)); INTERIOR = {13, 24, 27, 31, 34, 39}
TAGS = {0: 'O NÚMERO NO PEITO', 8: '30 DIAS', 19: '150 DEGRAUS', 20: 'DIA 1', 25: 'DIA 7', 28: 'DIA 13', 32: 'DIA 24', 35: 'DIA 29', 38: 'A ÚLTIMA NOITE', 61: 'MANHÃ SEGUINTE'}
rnd = random.Random(1); FL = [(rnd.random(), rnd.random(), rnd.uniform(3, 9), rnd.uniform(0.3, 1)) for _ in range(140)]
def back(t): t = min(max(t, 0), 1); c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
def tag(fr, txt, k):
    if k <= 0.01: return
    f = FK(86); d = ImageDraw.Draw(fr); bb = d.textbbox((0, 0), txt, font=f); w, h = bb[2] - bb[0], bb[3] - bb[1]
    L = Image.new('RGBA', (w + 90, h + 70), (0, 0, 0, 0)); g = ImageDraw.Draw(L)
    g.rounded_rectangle((0, 0, w + 89, h + 69), 34, fill=(255, 255, 255, 240), outline=(25, 20, 45, 255), width=8)
    g.text((45 - bb[0], 35 - bb[1]), txt, font=f, fill=(214, 40, 40))
    s = max(0.05, k); L = L.resize((max(1, int(L.width * s)), max(1, int(L.height * s))), Image.LANCZOS); L = L.rotate(-3, expand=True, resample=Image.BICUBIC)
    fr.alpha_composite(L, ((W - L.width) // 2, 230 - L.height // 2))
def comp(fi):
    t = fi / FPS; i = max(k for k in range(NSEG) if BOUND[k] <= t); tt = t - BOUND[i]
    p = f'{IN}/f_{fi:05d}.{EXT}'
    if not os.path.exists(p): return None
    fr = Image.open(p).convert('RGB').resize((W, H), Image.LANCZOS)
    fr = ImageEnhance.Contrast(ImageEnhance.Color(fr).enhance(float(os.environ.get('SAT', 1.6)))).enhance(1.07).convert('RGBA')
    if i not in INTERIOR:
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay); n = 140 if i in NOITE else 90
        for (x, y, r, sp) in FL[:n]:
            yy = (y * H + t * (90 + 160 * sp)) % H; xx = (x * W + 40 * math.sin(t * 0.8 + y * 9)) % W
            d.ellipse((xx - r, yy - r, xx + r, yy + r), fill=(255, 255, 255, int(150 + 90 * sp)))
        fr.alpha_composite(lay)
    if i in TAGS: tag(fr, TAGS[i], back(tt / 0.3) * (1 if tt < 2.6 else max(0, 1 - (tt - 2.6) / 0.25)))
    if i == 0 and tt < 0.05: pass
    return fr.convert('RGB')
if __name__ == '__main__':
    N = int(TOTAL * FPS) + 1; a = int(sys.argv[1]) if len(sys.argv) > 1 else 0; b = int(sys.argv[2]) if len(sys.argv) > 2 else N
    for fi in range(a, min(b, N)):
        fn = f'{OUT}/c_{fi:05d}.jpg'
        if os.path.exists(fn): continue
        im = comp(fi)
        if im: im.save(fn, quality=90)
    print('ok')
