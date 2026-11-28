# monta o vídeo: imagens 3D + movimento de câmera + efeitos 2D, quadro a quadro (1080x1920 @30)
import sys, os, json, math, random
sys.path.insert(0, '/root/b3d')
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from shots import SH
W, H, FPS = 1080, 1920, 30
IMG = os.environ.get('IMG', '/root/b3d/out'); OUT = os.environ.get('FR', '/root/b3d/frames')
os.makedirs(OUT, exist_ok=True)
words = json.load(open('/root/shorts/palavras/work/words.json'))
st = {}; en = {}
for w in words: st.setdefault(w['seg'], w['inicio']); en[w['seg']] = w['fim']
N = len(SH); TOTAL = en[N - 1] + 1.6
starts = [0.0] + [st[i] - 0.05 for i in range(1, N)] + [TOTAL]
FK = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', s)
EMO = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf', 109)
cache = {}
def img(i, k):
    key = (i, k)
    if key not in cache:
        p = f'{IMG}/s{i:02d}_{k}.png'
        if not os.path.exists(p): p = f'{IMG}/s{i:02d}_0.png'
        if not os.path.exists(p): return Image.new('RGB', (W, H), (20, 20, 30))
        cache.clear() if len(cache) > 6 else None
        cache[key] = Image.open(p).convert('RGB').resize((int(W * 1.12), int(H * 1.12)), Image.LANCZOS)
    return cache[key]
def back(t): t = min(max(t, 0), 1); c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
def emoji(e, size):
    im = Image.new('RGBA', (160, 160), (0, 0, 0, 0)); ImageDraw.Draw(im).text((10, 10), e, font=EMO, embedded_color=True); return im.resize((size, size), Image.LANCZOS)
def pill(d, cx, cy, txt, fs, bg, fg, pad=26, r=30, outline=(30, 16, 40)):
    f = FK(fs); bb = d.textbbox((0, 0), txt, font=f); w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.rounded_rectangle((cx - w / 2 - pad, cy - h / 2 - pad * 0.7, cx + w / 2 + pad, cy + h / 2 + pad * 0.7), r, fill=bg, outline=outline, width=6)
    d.text((cx - w / 2 - bb[0], cy - h / 2 - bb[1]), txt, font=f, fill=fg)
def tag(base, txt, k, y=300):
    if k <= 0: return
    L = Image.new('RGBA', (W, 400), (0, 0, 0, 0)); d = ImageDraw.Draw(L); fs = 110
    while FK(fs).getlength(txt) > W - 160 and fs > 40: fs -= 6
    f = FK(fs); bb = d.textbbox((0, 0), txt, font=f, stroke_width=14); x = (W - (bb[2] - bb[0])) / 2 - bb[0]
    d.text((x, 200 - (bb[3] - bb[1]) / 2 - bb[1]), txt, font=f, fill=(255, 225, 74), stroke_width=14, stroke_fill=(30, 16, 40))
    L = L.resize((max(1, int(W * k)), max(1, int(400 * k))), Image.LANCZOS); base.alpha_composite(L, ((W - L.width) // 2, int(y - L.height / 2)))
def bubble(base, txt, k, y=360, col=(255, 255, 255), fg=(40, 20, 60)):
    if k <= 0: return
    lines = txt.split('\n'); fs = 64
    while max(FK(fs).getlength(l) for l in lines) > W - 260 and fs > 30: fs -= 4
    f = FK(fs); w = max(f.getlength(l) for l in lines) + 110; h = len(lines) * fs * 1.25 + 80
    L = Image.new('RGBA', (int(w) + 40, int(h) + 120), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((20, 20, 20 + w, 20 + h), 60, fill=col, outline=(30, 16, 40), width=8)
    d.polygon([(w / 2 - 20, 20 + h - 4), (w / 2 + 50, 20 + h - 4), (w / 2 + 6, 20 + h + 80)], fill=col); d.line([(w / 2 - 18, 20 + h), (w / 2 + 6, 20 + h + 80), (w / 2 + 48, 20 + h)], fill=(30, 16, 40), width=8)
    for j, l in enumerate(lines): lw = f.getlength(l); d.text((20 + (w - lw) / 2, 60 + j * fs * 1.25), l, font=f, fill=fg)
    L = L.resize((max(1, int(L.width * k)), max(1, int(L.height * k))), Image.LANCZOS); base.alpha_composite(L, ((W - L.width) // 2, int(y - L.height / 2)))
def counter(base, txt, k):
    if k <= 0: return
    L = Image.new('RGBA', (700, 360), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((40, 60, 660, 300), 60, fill=(22, 22, 30), outline=(240, 240, 240), width=14); d.rectangle((300, 0, 400, 60), fill=(50, 50, 60)); d.rectangle((300, 300, 400, 360), fill=(50, 50, 60))
    fs = 150 if len(txt) < 5 else 128; f = FK(fs); bb = d.textbbox((0, 0), txt, font=f); col = (255, 80, 80) if txt == '0' else (90, 235, 255)
    d.text((350 - (bb[2] - bb[0]) / 2 - bb[0], 180 - (bb[3] - bb[1]) / 2 - bb[1]), txt, font=f, fill=col)
    L = L.resize((max(1, int(700 * k)), max(1, int(360 * k))), Image.LANCZOS); base.alpha_composite(L, ((W - L.width) // 2, int(1080 - L.height / 2)))
def hearts(base, t, n=8, seed=1):
    r = random.Random(seed)
    for i in range(n):
        u = (t * 0.45 + i / n) % 1; x = 120 + r.random() * (W - 240) + math.sin(t * 2 + i) * 30; y = 1500 - u * 1200; s = int(90 + r.random() * 60)
        e = emoji('💖' if i % 2 else '❤️', s); e.putalpha(e.getchannel('A').point(lambda a: int(a * math.sin(u * math.pi)))); base.alpha_composite(e, (int(x - s / 2), int(y)))
WORDS = ['OI', 'TCHAU', 'CAFÉ', 'NOSSA', 'SÉRIO?', 'KKK', 'ÓBVIO', 'TALVEZ', 'BOM DIA', 'NÃO', 'SIM', 'VALEU']
def chips(base, t, words, seed=2, n=10):
    r = random.Random(seed); d = ImageDraw.Draw(base)
    cols = [(255, 95, 162), (58, 134, 255), (255, 210, 63), (34, 181, 115), (255, 138, 31), (131, 56, 236)]
    for i in range(n):
        u = (t * 0.35 + i / n) % 1; x = 140 + r.random() * (W - 280); y = 1450 - u * 1100
        if 0.05 < u < 0.95: pill(d, x, y, words[i % len(words)], 46, cols[i % 6], (255, 255, 255))
def compose_frame(fi):
    t = fi / FPS
    i = max(j for j in range(N) if starts[j] <= t) if t < TOTAL else N - 1
    sh = SH[i]; t0, t1 = starts[i], starts[i + 1]; dur = t1 - t0; u = (t - t0) / dur
    keys = sh.get('keys', [{}]); k = min(len(keys) - 1, int(u * len(keys)))
    src = img(i, k)
    z = 1.0 + 0.07 * u * (1 if i % 2 else -1) + (0.07 if i % 2 == 0 else 0)
    ext = src.width - W; cx = (src.width - W / z) / 2 + math.sin(i * 1.7) * ext * 0.25 * (u - 0.5)
    cw, ch = W / z, H / z; box = (cx, (src.height - ch) / 2, cx + cw, (src.height - ch) / 2 + ch)
    fr = src.crop(tuple(int(b) for b in box)).resize((W, H), Image.BILINEAR).convert('RGBA')
    tt = t - t0; k0 = back(tt / 0.28)
    for ov in sh.get('ov', []):
        kind = ov[0]
        if kind == 'tag': tag(fr, ov[1], k0)
        elif kind == 'bubble': bubble(fr, ov[1], k0)
        elif kind == 'bubble2': parts = ov[1].split('|'); j = min(len(parts) - 1, int(u * len(parts))); bubble(fr, parts[j], back((tt - j * dur / len(parts)) / 0.25))
        elif kind == 'hearts': hearts(fr, tt, 8, i)
        elif kind == 'words': chips(fr, tt, WORDS, i)
        elif kind == 'chapters': chips(fr, tt, [f'CAP. {n}' for n in range(1, 13)], i, 8)
        elif kind == 'sim': chips(fr, tt, ['SIM!'] * 3, i, 16)
        elif kind == 'qmarks':
            for j in range(5): e = emoji('❓', 120); fr.alpha_composite(e, (int(150 + j * 180), int(300 + 40 * math.sin(tt * 4 + j))))
        elif kind == 'emojis': parts = ov[1].split('|'); j = min(len(parts) - 1, int(u * len(parts))); s = int(260 * back((tt - j * dur / len(parts)) / 0.25)); 
        if kind == 'emojis' and s > 4: fr.alpha_composite(emoji(parts[j], s), ((W - s) // 2, 640 - s // 2))
        elif kind == 'dots': pill(ImageDraw.Draw(fr), W / 2, 420, '.' * (1 + int(tt * 3) % 3), 90, (255, 255, 255), (40, 20, 60))
        elif kind == 'counter': counter(fr, ov[1], k0)
        elif kind == 'sparkles':
            for j in range(8): s = int(60 + 30 * math.sin(tt * 5 + j)); fr.alpha_composite(emoji('✨', s), (int(100 + (j * 137) % 880), int(250 + (j * 211) % 900)))
        elif kind == 'waves':
            d = ImageDraw.Draw(fr)
            for j in range(4): rr = 80 + ((tt * 260 + j * 90) % 360); a = int(255 * (1 - rr / 440)); d.arc((W / 2 - rr, 560 - rr, W / 2 + rr, 560 + rr), 200, 340, fill=(255, 255, 255, a), width=14)
        elif kind == 'confetti':
            d = ImageDraw.Draw(fr); r = random.Random(i)
            for j in range(70): x = r.random() * W; y = ((tt * (300 + r.random() * 300)) + r.random() * H) % H; d.rectangle((x, y, x + 18, y + 28), fill=[(255, 95, 162), (255, 210, 63), (58, 134, 255), (34, 181, 115)][j % 4])
    if t < 0.25 or t > TOTAL - 0.5: pass
    return fr.convert('RGB')
if __name__ == '__main__':
    a, b = (int(x) for x in sys.argv[1:3]) if len(sys.argv) > 2 else (0, int(TOTAL * FPS))
    for fi in range(a, min(b, int(TOTAL * FPS))):
        fn = f'{OUT}/f{fi:05d}.jpg'
        if os.path.exists(fn): continue
        compose_frame(fi).save(fn, quality=90)
    print('ok', a, b, TOTAL)
