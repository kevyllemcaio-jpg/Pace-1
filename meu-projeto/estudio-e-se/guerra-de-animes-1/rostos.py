# rostos estilo anime (olhos grandes e afiados, brilho, sobrancelhas marcadas)
from PIL import Image, ImageDraw, ImageFilter
import math
S = 1024
def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
def olho(d, im, cx, cy, side, iris, expr):
    w, h = 120, 92 if expr != 'grito' else 110
    if expr == 'fechado': d.arc((cx - w, cy - 40, cx + w, cy + 60), 200, 340, fill=(20, 10, 10), width=18); return
    tilt = {'raiva': 18, 'grito': 10, 'serio': 12, 'sorriso': -4, 'dor': 22}.get(expr, 0) * side
    pts = [(cx - w, cy + 10 - tilt * 0.6), (cx - w * 0.3, cy - h + tilt * 0.3), (cx + w * 0.6, cy - h * 0.8 - tilt * 0.4), (cx + w, cy - 5 + tilt * 0.6), (cx + w * 0.4, cy + h * 0.75), (cx - w * 0.5, cy + h * 0.7)]
    if side > 0: pts = [(2 * cx - x, y) for x, y in pts]
    mask = Image.new('L', im.size, 0); ImageDraw.Draw(mask).polygon(pts, fill=255)
    lay = Image.new('RGBA', im.size, (255, 255, 255, 255)); dl = ImageDraw.Draw(lay)
    c = hx(iris); r = 72 if expr != 'grito' else 50
    for k in range(30): t = k / 29; rr = r * (1 - t * 0.9); col = tuple(int(a * (0.45 + 0.75 * t)) for a in c); dl.ellipse((cx - rr, cy - rr * 1.15 + 6, cx + rr, cy + rr * 1.15 + 6), fill=col + (255,))
    dl.ellipse((cx - r * 0.38, cy - r * 0.5 + 6, cx + r * 0.38, cy + r * 0.5 + 6), fill=(10, 5, 10, 255))
    dl.ellipse((cx - r * 0.75, cy - r * 0.95, cx - r * 0.2, cy - r * 0.35), fill=(255, 255, 255, 255)); dl.ellipse((cx + r * 0.25, cy + r * 0.3, cx + r * 0.5, cy + r * 0.55), fill=(255, 255, 255, 255))
    im.paste(lay, (0, 0), mask); d = ImageDraw.Draw(im)
    d.line(pts[:4], fill=(20, 10, 10), width=22, joint='curve'); d.line(pts[3:] + [pts[0]], fill=(20, 10, 10), width=7, joint='curve')
    d.line([pts[0], (pts[0][0] - 30 * (-side), pts[0][1] - 18)], fill=(20, 10, 10), width=14)
def sobr(d, cx, cy, side, expr, col):
    a = {'raiva': 26, 'grito': 30, 'serio': 16, 'sorriso': -8, 'dor': -18}.get(expr, 0)
    L = 130; dx = math.cos(math.radians(a)) * L; dy = math.sin(math.radians(a)) * L
    x0, x1 = (cx - L * 0.9, cx + L * 0.9)
    y_in, y_out = cy + dy * 0.5, cy - dy * 0.5
    p = [(x1 if side < 0 else x0, y_in), (x0 if side < 0 else x1, y_out)]
    d.line(p, fill=col, width=30)
def boca(d, expr):
    cx, cy = 512, 790
    if expr == 'grito': d.chord((cx - 90, cy - 70, cx + 90, cy + 110), 0, 360, fill=(110, 20, 30), outline=(20, 10, 10), width=8); d.rectangle((cx - 70, cy - 52, cx + 70, cy - 30), fill=(255, 255, 255))
    elif expr == 'sorriso': d.arc((cx - 90, cy - 70, cx + 90, cy + 30), 20, 160, fill=(20, 10, 10), width=12); d.line((cx + 70, cy + 6, cx + 95, cy - 12), fill=(20, 10, 10), width=10)
    elif expr == 'raiva': d.line((cx - 70, cy + 10, cx + 70, cy + 4), fill=(20, 10, 10), width=12); d.line((cx - 70, cy + 10, cx - 85, cy + 24), fill=(20, 10, 10), width=10)
    elif expr == 'dor': d.chord((cx - 60, cy - 10, cx + 60, cy + 60), 180, 360, fill=(110, 20, 30), outline=(20, 10, 10), width=8)
    else: d.line((cx - 50, cy + 8, cx + 50, cy + 8), fill=(20, 10, 10), width=11)
def gen(prefix, iris, brow, scar=False):
    for e in ('serio', 'raiva', 'grito', 'sorriso', 'dor', 'fechado'):
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        for s in (-1, 1): olho(d, im, 512 + s * 205, 520, s, iris, e if e != 'fechado' else 'fechado'); d = ImageDraw.Draw(im)
        if e != 'fechado':
            for s in (-1, 1): sobr(d, 512 + s * 205, 380, s, e, brow)
        d.line((508, 640, 498, 690), fill=(170, 100, 80), width=8)
        if scar: d.line((640, 450, 720, 640), fill=(150, 60, 70), width=12); d.line((650, 520, 720, 500), fill=(150, 60, 70), width=8)
        boca(d, e)
        im.crop((112, 170, 912, 970)).resize((512, 512), Image.LANCZOS).save(f'/root/b3d/anime/f_{prefix}_{e}.png')
gen('kaito', '#ff7a1a', (120, 30, 20)); gen('ren', '#3fa9ff', (230, 230, 240)); gen('mika', '#c45cff', (70, 30, 90)); gen('draven', '#ff2040', (20, 10, 30), scar=True)
print('ok')
