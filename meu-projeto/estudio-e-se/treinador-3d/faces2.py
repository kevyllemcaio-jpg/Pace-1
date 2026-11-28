# gerador de rostos v2 — olhos grandes com brilho, cílios, sobrancelhas, blush
from PIL import Image, ImageDraw, ImageFilter
import math
S = 1024
def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
SIMPLE = True
def eye(d, im, cx, cy, iris, kind, look=(0, 0), lash=(30, 18, 14), fem=False, small=False):
    if SIMPLE and kind not in ('fechado', 'feliz_f', 'dor'):
        sq = {'semi': 0.55, 'serio': 0.6}.get(kind, 1.0); big = 1.25 if kind in ('surpreso', 'medo') else 1.0
        w2, h2 = (26 if CLASSIC else 46) * big, (44 if CLASSIC else 64) * big * sq; col = (28, 22, 26)
        d.ellipse((cx - w2, cy - h2, cx + w2, cy + h2), fill=col)
        d.ellipse((cx - w2 * 0.55, cy - h2 * 0.7, cx - w2 * 0.05, cy - h2 * 0.2), fill=(255, 255, 255))
        if fem:
            for s_ in (-1, 1): d.line((cx + s_ * w2 * 0.8, cy - h2 * 0.6, cx + s_ * (w2 + 26), cy - h2 * 1.0), fill=col, width=12)
        return d
    w, h = (92, 120) if not small else (70, 66)
    if kind in ('fechado', 'feliz_f'):  # arco ^
        d.arc((cx - w, cy - 50, cx + w, cy + 70), 200, 340, fill=lash, width=22); return
    if kind == 'dor':
        sd = 1 if cx < 512 else -1
        d.line([(cx - 60 * sd, cy - 45), (cx + 60 * sd, cy), (cx - 60 * sd, cy + 45)], fill=lash, width=24, joint='curve'); return
    sq = {'semi': 0.55, 'serio': 0.6}.get(kind, 1.0); big = 1.12 if kind in ('surpreso', 'medo') else 1.0
    w2, h2 = w * big, h * big * sq
    box = (cx - w2, cy - h2, cx + w2, cy + h2)
    d.ellipse(box, fill=(255, 255, 255))
    # íris com degradê
    ir = (w2 * (0.78 if kind != 'medo' else 0.55)); ix, iy = cx + look[0] * 20, cy + look[1] * 14 + (8 if sq < 1 else 0)
    c1 = hx(iris); c0 = lerp(c1, (10, 20, 50), 0.55); c2 = lerp(c1, (255, 255, 255), 0.35)
    lay = Image.new('L', im.size, 0); ImageDraw.Draw(lay).ellipse(box, fill=255)
    irl = Image.new('RGBA', im.size, (0, 0, 0, 0)); di = ImageDraw.Draw(irl)
    for k in range(40):
        t = k / 39; r = ir * (1 - t * 0.95); col = lerp(c0, c2, t ** 0.8)
        di.ellipse((ix - r, iy - r * 1.15 + t * r * 0.2, ix + r, iy + r * 1.15), fill=col + (255,))
    pr = ir * 0.42; di.ellipse((ix - pr, iy - pr * 1.1, ix + pr, iy + pr * 1.1), fill=(12, 14, 30, 255))
    di.ellipse((ix - ir * 0.75, iy + ir * 0.35, ix + ir * 0.75, iy + ir * 1.05), fill=c2 + (120,))
    a = Image.composite(irl, Image.new('RGBA', im.size, (0, 0, 0, 0)), lay); im.alpha_composite(a); d = ImageDraw.Draw(im)
    # sombra da pálpebra
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((box[0], box[1] - h2 * 0.6, box[2], box[1] + h2 * 0.55), fill=(40, 30, 60, 70)); im.alpha_composite(Image.composite(sh, Image.new('RGBA', im.size, (0, 0, 0, 0)), lay))
    d = ImageDraw.Draw(im)
    # brilhos
    d.ellipse((ix - ir * 0.62, iy - ir * 0.85, ix - ir * 0.1, iy - ir * 0.3), fill=(255, 255, 255))
    d.ellipse((ix + ir * 0.25, iy + ir * 0.3, ix + ir * 0.5, iy + ir * 0.55), fill=(255, 255, 255))
    # contorno + cílio superior grosso
    d.ellipse(box, outline=lash, width=9)
    d.arc((box[0] - 6, box[1] - 4, box[2] + 6, box[3] + 4), 190, 350, fill=lash, width=24)
    if fem:
        for s in (-1, 1): d.line((cx + s * w2 * 0.92, cy - h2 * 0.45, cx + s * (w2 + 34), cy - h2 * 0.85), fill=lash, width=14)
    return d
def brow(d, cx, cy, ang, col, s, thick=26, curve=1):
    L = 62; dx = math.cos(math.radians(ang)) * L; dy = math.sin(math.radians(ang)) * L
    pts = [(cx - dx, cy + dy * s), (cx, cy - 10 * curve), (cx + dx, cy - dy * s)]
    d.line(pts, fill=col, width=thick, joint='curve')
    for p in (pts[0], pts[2]): d.ellipse((p[0] - thick / 2, p[1] - thick / 2, p[0] + thick / 2, p[1] + thick / 2), fill=col)
def mouth(d, kind, cx=512, cy=760, ln=(60, 20, 22)):
    red = (150, 34, 48); tongue = (238, 110, 120)
    if kind in ('feliz', 'feliz_f'):
        d.chord((cx - 110, cy - 90, cx + 110, cy + 90), 0, 180, fill=red, outline=ln, width=10)
        d.rectangle((cx - 80, cy + 2, cx + 80, cy + 26), fill=(255, 255, 255)); d.chord((cx - 60, cy + 30, cx + 60, cy + 110), 180, 360, fill=tongue)
    elif kind == 'sorriso': d.arc((cx - 80, cy - 70, cx + 80, cy + 40), 20, 160, fill=ln, width=16)
    elif kind == 'neutro': d.arc((cx - 50, cy - 20, cx + 50, cy + 16), 30, 150, fill=ln, width=14)
    elif kind == 'serio': d.line((cx - 50, cy + 8, cx + 50, cy + 8), fill=ln, width=15)
    elif kind == 'triste': d.arc((cx - 60, cy + 10, cx + 60, cy + 90), 200, 340, fill=ln, width=15)
    elif kind == 'surpreso': d.ellipse((cx - 38, cy - 34, cx + 38, cy + 50), fill=red, outline=ln, width=9)
    elif kind == 'medo':
        d.chord((cx - 70, cy - 20, cx + 70, cy + 70), 180, 360, fill=red, outline=ln, width=9); d.rectangle((cx - 50, cy + 22, cx + 50, cy + 30), fill=(255, 255, 255))
        d.line([(cx - 70, cy + 25 + (12 if i % 2 else 0)) if False else (cx - 70 + i * 28, cy + 25 + (10 if i % 2 else -4)) for i in range(6)], fill=ln, width=9)
    elif kind in ('raiva', 'dor'):
        d.rounded_rectangle((cx - 90, cy - 20, cx + 90, cy + 50), 22, fill=(255, 255, 255), outline=ln, width=10)
        for i in range(1, 5): d.line((cx - 90 + i * 36, cy - 18, cx - 90 + i * 36, cy + 48), fill=(200, 200, 210), width=5)
        d.line((cx - 86, cy + 15, cx + 86, cy + 15), fill=(200, 200, 210), width=5)
EXPR = {  # olho, boca, ângulo sobrancelha, altura sobrancelha
    'feliz': ('n', 'feliz', 6, 0), 'sorriso': ('n', 'sorriso', 4, 0), 'neutro': ('n', 'neutro', 0, 0), 'serio': ('serio', 'serio', -16, 20),
    'medo': ('medo', 'medo', 22, -26), 'surpreso': ('surpreso', 'surpreso', 10, -34), 'triste': ('n', 'triste', 20, -6), 'raiva': ('serio', 'raiva', -24, 26),
    'dor': ('dor', 'dor', -22, 22), 'piscando': ('fechado', 'sorriso', 4, 4), 'risada': ('feliz_f', 'feliz', 8, -8), 'determinado': ('semi', 'sorriso', -18, 18)}
CLASSIC = False
def gen(prefix, iris, brow_col, freckles=False, fem=False, small=False, old=False, bthick=26):
    for k, (ek, mk, ba, bh) in EXPR.items():
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        bl = Image.new('RGBA', (S, S), (0, 0, 0, 0)); db = ImageDraw.Draw(bl)
        for s in (-1, 1): db.ellipse((512 + s * 250 - 70, 590, 512 + s * 250 + 70, 650), fill=(255, 120, 130, 0 if CLASSIC else 90))
        im.alpha_composite(bl.filter(ImageFilter.GaussianBlur(18))); d = ImageDraw.Draw(im)
        if freckles:
            for s in (-1, 1):
                for (fx, fy) in ((-30, 0), (0, 14), (28, -4), (12, 30)): d.ellipse((512 + s * 250 + fx - 7, 600 + fy - 7, 512 + s * 250 + fx + 7, 600 + fy + 7), fill=(170, 100, 70, 200))
        ey = 480 if not old else 500
        for s in (-1, 1): eye(d, im, 512 + s * 170, ey, iris, 'n' if ek == 'n' else ek, fem=fem, small=small); d = ImageDraw.Draw(im)
        for s in (-1, 1): brow(d, 512 + s * 170, ey - (125 if not small else 110) + bh, ba * -s if False else ba, brow_col, -s, thick=bthick)
        d.arc((492, 620, 532, 650), 20, 160, fill=(190, 120, 95), width=8)
        mouth(d, mk)
        im.crop((112, 170, 912, 970)).resize((512, 512), Image.LANCZOS).save(f'/root/b3d/f2/{prefix}_{k}.png')
gen('zk', '#2F8CFF', (43, 26, 16), freckles=True)
gen('bo', '#2F8CFF', (40, 30, 36))
gen('br', '#2FBF71', (27, 18, 18))
gen('lu', '#C9822A', (90, 52, 32), freckles=True)
gen('me', '#3B3B48', (235, 235, 235), small=True, old=True, bthick=34)
gen('vm', '#6A4A2A', (40, 26, 18))
gen('vf', '#9B5DE5', (50, 30, 20), fem=True)
CLASSIC = True
for _p, _f in (('cl', False), ('clf', True)): gen(_p, '#000000', (35, 25, 25), fem=_f, bthick=18)
gen('clv', '#000000', (230, 230, 230), bthick=24)
print('ok')
