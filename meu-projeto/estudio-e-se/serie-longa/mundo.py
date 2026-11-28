# Cenários medievais detalhados (mundo 1920x1080) + mapa de mundo aberto — série "O escudo triangular" (16:9)
import math, random
import skia
from kit import *

_CACHE = {}
def cache(nome, fn):  # desenha a parte parada do cenário uma vez só (muito mais rápido)
    if nome not in _CACHE:
        rec = skia.PictureRecorder(); cv = rec.beginRecording(skia.Rect(-1200, -800, 3100, 2000)); fn(cv); _CACHE[nome] = rec.finishRecordingAsPicture()
    return _CACHE[nome]
def R(seed): return random.Random(seed)


# ---------------------------------------------------------------- peças
def ceu(c, top='#6FB1EA', bot='#F7E6C4', h=640):
    c.drawRect(skia.Rect(-1200, -800, 3100, h), sp(linear(0, -300, 0, h, [hx(top), hx(bot)])))
def montanhas(c, base=600, cor='#9DB3CF', neve=True, seed=1):
    r = R(seed); p = skia.Path(); p.moveTo(-1200, base); x = -1200; picos = []
    while x < 3100:
        w = r.uniform(160, 320); h = r.uniform(140, 300); p.lineTo(x + w / 2, base - h); picos.append((x + w / 2, base - h, w)); p.lineTo(x + w, base); x += w
    p.lineTo(3100, base + 400); p.lineTo(-1200, base + 400); p.close(); c.drawPath(p, fp(cor))
    if neve:
        for (px, py, w) in picos:
            q = skia.Path(); q.moveTo(px, py); q.lineTo(px - w * .14, py + 50); q.lineTo(px - w * .05, py + 38); q.lineTo(px + w * .04, py + 56); q.lineTo(px + w * .14, py + 46); q.close(); c.drawPath(q, fp('#F4F8FF'))
def colina(c, x, y, rx, ry, cor):
    c.drawOval(skia.Rect(x - rx, y - ry, x + rx, y + ry), fp(cor))
def torre(c, x, base, w, h, telha='#3E5F9E', parede='#BFB6A8'):
    rect(c, x - w / 2, base - h, x + w / 2, base, parede, LW * .7)
    for i in range(int(w // 22)): rect(c, x - w / 2 + i * 22, base - h - 18, x - w / 2 + i * 22 + 12, base - h, parede, LW * .4)
    poly(c, [(x - w / 2 - 10, base - h), (x, base - h - w * 1.1), (x + w / 2 + 10, base - h)], telha, LW * .7)
    rect(c, x - 8, base - h * .6, x + 8, base - h * .45, '#2A2233', 2, r=6)
def castelo(c, x, base, s=1.0, t=0.0):
    c.save(); c.translate(x, base); c.scale(s, s)
    rect(c, -260, -220, 260, 0, '#C9C0B2', LW * .8)
    for i in range(12): rect(c, -260 + i * 44, -244, -260 + i * 44 + 26, -220, '#C9C0B2', LW * .5)
    torre(c, -260, 0, 90, 330); torre(c, 260, 0, 90, 330); torre(c, 0, -220, 120, 260, '#B23A48')
    rect(c, -50, -120, 50, 0, '#5A3A22', LW * .7, r=50)
    for (fx, fy) in ((-260, -430), (260, -430), (0, -620)):
        line(c, fx, fy, fx, fy - 70, 4, '#3B2A20'); w_ = math.sin(t * 3 + fx) * 8
        poly(c, [(fx, fy - 70), (fx + 60, fy - 60 + w_), (fx, fy - 46)], '#F2C14E', 2)
    c.restore()
def casa(c, x, base, w, h, seed, t=0.0, fumaca=True):
    r = R(seed); parede = r.choice(['#F2E6CF', '#EADBC2', '#F4EBDD', '#E8D7B8']); telha = r.choice(['#B23A48', '#8B4A2B', '#5A6B8C', '#9C5B32', '#7A3B2E'])
    rect(c, x, base - h * .28, x + w, base, '#9A948A', LW * .7)                       # base de pedra
    for i in range(int(w // 46)): line(c, x + i * 46, base - h * .28, x + i * 46, base, 2, '#7D776E')
    rect(c, x, base - h, x + w, base - h * .28, parede, LW * .7)
    viga = '#6B4A32'
    for f in (0, .5, 1): line(c, x + w * f, base - h, x + w * f, base - h * .28, 9, viga)
    line(c, x, base - h * .64, x + w, base - h * .64, 8, viga); line(c, x, base - h, x + w * .5, base - h * .64, 7, viga); line(c, x + w, base - h, x + w * .5, base - h * .64, 7, viga)
    for wx in (x + w * .14, x + w * .64):
        rect(c, wx, base - h * .58, wx + w * .22, base - h * .36, '#8ECAE6', LW * .5); line(c, wx + w * .11, base - h * .58, wx + w * .11, base - h * .36, 3, viga)
        rect(c, wx - 6, base - h * .36, wx + w * .22 + 6, base - h * .32, '#7A5A3C', 2); [c.drawCircle(wx + k * w * .055 + 6, base - h * .37, 7, fp(r.choice(['#FF5F8F', '#FFD23F', '#C77DFF']))) for k in range(4)]
    rect(c, x + w * .4, base - h * .3, x + w * .6, base, '#5A3A22', LW * .6, r=w * .1)
    poly(c, [(x - 24, base - h), (x + w / 2, base - h - h * .55), (x + w + 24, base - h)], telha, LW * .7)
    for i in range(1, 5): line(c, x - 24 + (w + 48) * i / 5 * .5, base - h - h * .55 * i / 5 * 1.6 * .62, x + w + 24 - (w + 48) * i / 5 * .5, base - h - h * .55 * i / 5 * 1.6 * .62, 2, escurecer(telha, .8))
    if fumaca: rect(c, x + w * .72, base - h - h * .45, x + w * .84, base - h - h * .1, '#8A7A6A', LW * .5)
    return (x + w * .78, base - h - h * .45)
def fumacas(c, pts, t):
    for (x, y) in pts:
        for i in range(5): u = ((t * .35 + i / 5) % 1); c.drawCircle(x + math.sin(u * 6 + x) * 18, y - u * 160, 14 + u * 30, fp('#E8E4E0', 150 * (1 - u)))
def barraca(c, x, base, w, cor, seed):
    r = R(seed)
    for k in (0, 1): line(c, x + k * w, base, x + k * w, base - 190, 7, '#6B4A32')
    p = skia.Path(); p.moveTo(x - 20, base - 190); p.lineTo(x + w + 20, base - 190); p.lineTo(x + w + 34, base - 140); p.lineTo(x - 34, base - 140); p.close(); c.drawPath(p, fp('#FFFFFF'))
    c.save(); c.clipPath(p)
    for i in range(12): c.drawRect(skia.Rect(x - 40 + i * 34, base - 200, x - 40 + i * 34 + 17, base - 130), fp(cor))
    c.restore(); c.drawPath(p, ink(LW * .6))
    rect(c, x - 10, base - 80, x + w + 10, base, '#9A6A3E', LW * .6)
    for i in range(int(w // 30)): c.drawCircle(x + 15 + i * 30, base - 92, 14, fp(r.choice(['#E63946', '#F2C14E', '#8CE95A', '#FF8A3D'])))
def bandeirinhas(c, x0, y0, x1, y1, t):
    p = skia.Path(); p.moveTo(x0, y0); mx = (x0 + x1) / 2; p.quadTo(mx, max(y0, y1) + 70, x1, y1); c.drawPath(p, ink(3, '#5A3A22'))
    cores = ['#E63946', '#F2C14E', '#3E6FA8', '#8CE95A', '#C77DFF']
    for i in range(1, 14):
        u = i / 14; bx = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * x1; by = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * (max(y0, y1) + 70) + u * u * y1
        sw = math.sin(t * 3 + i) * 4; poly(c, [(bx - 16, by), (bx + 16, by), (bx + sw, by + 36)], cores[i % 5], 2)
def paralelepipedos(c, y0, y1, cor='#B8A888', seed=3):
    c.drawRect(skia.Rect(-1200, y0, 3100, y1 + 600), fp(escurecer(cor, .85)))
    r = R(seed); y = y0; row = 0
    while y < y1 + 200:
        hh = 18 + (y - y0) * .09; ww = hh * 1.9; x = -1200 + (row % 2) * ww / 2
        while x < 3100: rect(c, x + 3, y + 2, x + ww - 3, y + hh - 2, clarear(cor, r.uniform(0, .12)), 2, r=hh * .35); x += ww
        y += hh; row += 1
def poste(c, x, base, t):
    line(c, x, base, x, base - 300, 10, '#2B2D42'); line(c, x, base - 300, x + 50, base - 300, 8, '#2B2D42')
    rect(c, x + 30, base - 300, x + 70, base - 250, '#F2E6B8', 4, r=6); add_light(c, x + 50, base - 275, 90, '#FFD27A', 60)
def poco(c, x, base):
    rect(c, x - 70, base - 90, x + 70, base, '#9A948A', LW * .7, r=10); line(c, x - 60, base - 90, x - 60, base - 210, 8, '#6B4A32'); line(c, x + 60, base - 90, x + 60, base - 210, 8, '#6B4A32')
    poly(c, [(x - 90, base - 200), (x, base - 260), (x + 90, base - 200)], '#8B4A2B', LW * .6)
def arvore(c, x, base, s, seed, cores=('#3D8F44', '#4FA84F', '#2F7A3A', '#5CB85C')):
    r = R(seed); rect(c, x - 16 * s, base - 200 * s, x + 16 * s, base, '#6E4A2C', LW * .5)
    p = skia.Path()
    for k in range(6): p.addCircle(x + r.uniform(-90, 90) * s, base - (210 + r.uniform(0, 140)) * s, r.uniform(70, 110) * s)
    c.drawPath(p, ink(LW * 1.4)); c.drawPath(p, fp(r.choice(cores)))
    for k in range(4): c.drawCircle(x + r.uniform(-70, 60) * s, base - (240 + r.uniform(0, 120)) * s, 22 * s, fp(clarear(cores[0], .25)))
def pinheiro(c, x, base, s, cor='#2F6B3A'):
    rect(c, x - 10 * s, base - 40 * s, x + 10 * s, base, '#5A3A22', 0)
    for k in range(4): poly(c, [(x - (110 - k * 22) * s, base - (40 + k * 70) * s), (x, base - (160 + k * 70) * s), (x + (110 - k * 22) * s, base - (40 + k * 70) * s)], cor, LW * .5)


# ---------------------------------------------------------------- cenários
def vila(c, t, cor_ceu=('#6FB1EA', '#F7E6C4')):
    def fixo(cv):
        ceu(cv, *cor_ceu); montanhas(cv, 560, '#A9BCD6', True, 4); colina(cv, 1500, 640, 520, 170, '#7FB069'); castelo(cv, 1500, 520, .62, 0)
        colina(cv, 300, 700, 700, 170, '#6FA65E'); colina(cv, 1100, 720, 800, 150, '#78AE66')
        _ch = []
        xs = [(-160, 300, 330), (160, 260, 300), (430, 330, 360), (780, 290, 320), (1090, 320, 350), (1420, 280, 310), (1720, 330, 360), (2060, 280, 300)]
        for i, (x, w, h) in enumerate(xs): _ch.append(casa(cv, x, 800, w, h, 10 + i))
        _CACHE['_ch_vila'] = _ch
        paralelepipedos(cv, 800, 1080)
        barraca(cv, 140, 960, 220, '#E63946', 1); barraca(cv, 1560, 960, 240, '#3E6FA8', 2); poco(cv, 1290, 900); poste(cv, 560, 900, 0); poste(cv, 1820, 900, 0)
        for (x, y) in ((40, 1040), (1880, 1040)): rect(cv, x - 50, y - 70, x + 50, y, '#8B5A2B', LW * .6, r=10); line(cv, x - 50, y - 35, x + 50, y - 35, 4, '#5A3A22')
    c.drawPicture(cache('vila' + str(cor_ceu), fixo))
    cloud(c, (300 + t * 12) % 2600 - 300, 120, 1.0, '#FFFFFF'); cloud(c, (1300 + t * 8) % 2600 - 300, 80, .8, '#FFFFFF')
    fumacas(c, _CACHE.get('_ch_vila', []), t); bandeirinhas(c, 160, 560, 980, 540, t); bandeirinhas(c, 1090, 560, 1880, 580, t + 1)
    for (fx, fy) in ((1500 - 260 * .62, 520 - 430 * .62), (1500 + 260 * .62, 520 - 430 * .62), (1500, 520 - 620 * .62)):
        w_ = math.sin(t * 3 + fx) * 5; poly(c, [(fx, fy - 43), (fx + 37, fy - 37 + w_), (fx, fy - 28)], '#F2C14E', 1.5)
def floresta(c, t, noite=0.0):
    def fixo(cv):
        ceu(cv, '#86C7E8', '#E4F3DA', 800)
        for i in range(22): pinheiro(cv, -300 + i * 110 + (i % 3) * 30, 640, .9 + (i % 4) * .1, '#4E8F6A')
        cv.drawRect(skia.Rect(-1200, 620, 3100, 700), fp('#7FB78A', 120))
        for i in range(12): arvore(cv, -260 + i * 210, 780, .95 + (i % 3) * .12, 40 + i, ('#3D8F44', '#357F3C', '#4A9B4F'))
        cv.drawRect(skia.Rect(-1200, 780, 3100, 2000), fp('#5FA84A'))
        p = skia.Path(); p.moveTo(820, 780); p.quadTo(700, 900, 560, 1080); p.lineTo(1360, 1080); p.quadTo(1180, 900, 1100, 780); p.close(); cv.drawPath(p, fp('#C9A66A'))
        r = R(7)
        for i in range(40): x = r.uniform(-300, 2200); y = r.uniform(800, 1080); cv.drawOval(skia.Rect(x, y, x + 70, y + 22), fp('#4E9440'))
        for (x, y) in ((260, 1000), (1600, 1010), (1840, 960)): oval(cv, x - 90, y - 50, x + 90, y + 20, '#8D8A96', LW * .6); cv.drawOval(skia.Rect(x - 70, y - 50, x + 40, y - 30), fp('#6FA65E'))
        for (x, y) in ((420, 1040), (1500, 1060), (1740, 1050)):
            rect(cv, x - 6, y - 30, x + 6, y, '#F4EFE2', 2); cv.drawOval(skia.Rect(x - 26, y - 50, x + 26, y - 24), fp('#E63946')); [cv.drawCircle(x + d, y - 40, 4, fp('#FFFFFF')) for d in (-10, 6)]
    c.drawPicture(cache('floresta', fixo))
    for i in range(4):  # raios de luz
        x = 300 + i * 420 + 40 * math.sin(t * .3 + i); c.drawPath(cone_path(x, -200, 60, 260, 1100, 120), fp('#FFF6D0', 34, blur=24, blend=skia.BlendMode.kPlus))
    for i in range(30): u = (t * .05 + i / 30) % 1; x = (i * 97) % 1920; c.drawCircle(x + 30 * math.sin(t + i), 1000 - u * 700, 3, fp('#FFF6B0', 200 * math.sin(u * math.pi)))
    if noite: c.drawRect(skia.Rect(-1200, -800, 3100, 2000), fp('#0A1020', 150 * noite))
def salao(c, t):
    def fixo(cv):
        cv.drawRect(skia.Rect(-1200, -800, 3100, 800), fp('#5E536E'))
        for j, y in enumerate(range(-800, 800, 64)):
            for x in range(-1200 + (j % 2) * 64, 3100, 128): rect(cv, x + 3, y + 3, x + 125, y + 61, '#665A78', 2, r=4)
        for x in (340, 1580):  # vitrais
            rect(cv, x - 110, 40, x + 110, 520, '#2B2233', LW, r=110)
            cores = ['#E63946', '#3E6FA8', '#F2C14E', '#2E9E6B', '#C77DFF']
            for i in range(4):
                for j in range(7): cv.drawRect(skia.Rect(x - 96 + i * 48, 70 + j * 64, x - 96 + i * 48 + 44, 70 + j * 64 + 60), fp(cores[(i + j) % 5], 210))
            for i in range(1, 4): line(cv, x - 96 + i * 48, 60, x - 96 + i * 48, 510, 4, '#2B2233')
        for x in (100, 620, 1300, 1820): rect(cv, x - 55, -800, x + 55, 820, '#7A6E8C', LW, r=4); rect(cv, x - 75, 760, x + 75, 820, '#6A5E7A', LW * .6)
        for x in (820, 1100):  # estandartes com o escudo triangular
            rect(cv, x - 70, 80, x + 70, 420, '#7A1E3A', LW * .7); poly(cv, [(x - 70, 420), (x, 470), (x + 70, 420)], '#7A1E3A', LW * .7)
            p = skia.Path(); p.moveTo(x - 40, 180); p.lineTo(x + 40, 180); p.quadTo(x + 44, 260, x, 320); p.quadTo(x - 44, 260, x - 40, 180); p.close(); cv.drawPath(p, fp('#F2C14E')); cv.drawPath(p, ink(4))
        cv.drawRect(skia.Rect(-1200, 800, 3100, 2000), fp('#8C7A62'))
        for i in range(-10, 30): line(cv, 960 + (i - 10) * 70, 800, 960 + (i - 10) * 260, 1600, 2, '#7A6A54')
        p = skia.Path(); p.moveTo(880, 800); p.lineTo(1040, 800); p.lineTo(1340, 1600); p.lineTo(580, 1600); p.close(); cv.drawPath(p, fp('#A3203A'))
        line(cv, 880, 800, 580, 1600, 8, '#F2C14E'); line(cv, 1040, 800, 1340, 1600, 8, '#F2C14E')
        for k in range(3): rect(cv, 760 - k * 30, 770 + k * 20, 1160 + k * 30, 800 + k * 20, '#7A6E8C', LW * .5)
        rect(cv, 850, 420, 1070, 770, '#C9A227', LW, r=24); rect(cv, 880, 460, 1040, 700, '#7A1E3A', LW * .7, r=16)
    c.drawPicture(cache('salao', fixo))
    for x in (340, 1580): c.drawPath(cone_path(x, 300, 200, 520, 900, (960 - x) * .35), fp('#FFF2C8', 40, blur=30, blend=skia.BlendMode.kPlus))
    for x in (480, 1440):  # candelabros
        line(c, x, -100, x, 120, 4); line(c, x - 90, 120, x + 90, 120, 6, '#C9A227')
        for k in range(5): cx_ = x - 80 + k * 40; rect(c, cx_ - 5, 92, cx_ + 5, 120, '#F4EFE2', 0); f = 1 + .15 * math.sin(t * 11 + k); c.drawOval(skia.Rect(cx_ - 6, 92 - 18 * f, cx_ + 6, 92), fp('#FFB347')); add_light(c, cx_, 80, 60, '#FFD27A', 90)
def estrada(c, t):
    def fixo(cv):
        ceu(cv, '#78BDEB', '#FBEFD2', 620); montanhas(cv, 540, '#B2C4DB', True, 9)
        colina(cv, 400, 700, 900, 220, '#8CC071'); colina(cv, 1500, 720, 800, 200, '#7DB565'); castelo(cv, 1680, 560, .35)
        cv.drawRect(skia.Rect(-1200, 720, 3100, 2000), fp('#77B25E'))
        p = skia.Path(); p.moveTo(900, 640); p.cubicTo(860, 760, 1300, 820, 1100, 1080); p.lineTo(1600, 1080); p.cubicTo(1500, 820, 980, 760, 960, 640); p.close(); cv.drawPath(p, fp('#D2B27A'))
        rio = skia.Path(); rio.moveTo(-200, 820); rio.cubicTo(300, 760, 500, 900, 820, 860); rio.lineTo(820, 900); rio.cubicTo(500, 950, 300, 810, -200, 880); rio.close(); cv.drawPath(rio, fp('#5DADE2'))
        line(cv, 1320, 1000, 1320, 820, 10, '#6B4A32'); rect(cv, 1320, 830, 1520, 880, '#9A6A3E', LW * .6, r=6); label(cv, "VALDORA", 1420, 868, 32, '#3B2416', font=INTER_K, align='center', skew=0)
        for i in range(6): x = 200 + i * 140; c_ = cv; c_.drawOval(skia.Rect(x, 980 + (i % 2) * 30, x + 70, 1020 + (i % 2) * 30), fp('#F4F1EA')); c_.drawCircle(x + 70, 990 + (i % 2) * 30, 16, fp('#3B3B44'))
    c.drawPicture(cache('estrada', fixo))
    cloud(c, (500 + t * 10) % 2600 - 300, 110, 1.1, '#FFFFFF')
    cx, cy = 260, 600; rect(c, cx - 40, cy - 40, cx + 40, cy + 160, '#E8D7B8', LW * .7); poly(c, [(cx - 50, cy - 40), (cx, cy - 100), (cx + 50, cy - 40)], '#8B4A2B', LW * .6)
    c.save(); c.translate(cx, cy - 30); c.rotate(t * 60)
    for k in range(4): c.rotate(90); rect(c, -12, -170, 12, -10, '#F4EFE2', 3)
    c.restore()
def caverna(c, t):
    def fixo(cv):
        cv.drawRect(skia.Rect(-1200, -800, 3100, 2000), fp('#2A2436'))
        r = R(11)
        for i in range(40): x = r.uniform(-300, 2200); y = r.uniform(-100, 760); cv.drawOval(skia.Rect(x, y, x + r.uniform(120, 300), y + r.uniform(60, 140)), fp(r.choice(['#3A3248', '#332C40', '#403652'])))
        for i in range(14): x = -100 + i * 160; poly(cv, [(x, -100), (x + 50, 120 + (i % 3) * 60), (x + 100, -100)], '#3A3248', LW * .5)
        cv.drawRect(skia.Rect(-1200, 800, 3100, 2000), fp('#352E42'))
        for (x, y, cor) in ((300, 820, '#38D6FF'), (1650, 840, '#C77DFF'), (980, 300, '#38D6FF')):
            for k in range(3): poly(cv, [(x - 30 + k * 30, y), (x - 10 + k * 30, y - 120 - k * 30), (x + 10 + k * 30, y)], cor, 3)
    c.drawPicture(cache('caverna', fixo))
    for (x, y, cor) in ((330, 760, '#38D6FF'), (1680, 780, '#C77DFF'), (1010, 220, '#38D6FF')): add_light(c, x, y, 260 + 20 * math.sin(t * 2 + x), cor, 120)
    for i in range(20): u = (t * .03 + i / 20) % 1; c.drawCircle((i * 131) % 1920, 1000 - u * 900, 2.5, fp('#BFF4FF', 180 * math.sin(u * math.pi)))


# ---------------------------------------------------------------- mapa de mundo aberto
LUGARES = {
    'castelo': (980, 430, 'CASTELO DE VALDORA'), 'vila': (760, 560, 'VILA PEDRAVERDE'), 'floresta': (500, 380, 'FLORESTA SOMBRIA'),
    'montanhas': (1300, 250, 'MONTES DE FERRO'), 'lago': (1260, 640, 'LAGO ESPELHO'), 'deserto': (1560, 520, 'DESERTO RUBRO'),
    'caverna': (330, 650, 'CAVERNA DOS CRISTAIS'), 'forja': (840, 690, 'FORJA DA NINA'), 'fenda': (1180, 470, 'A FENDA'),
}
def mapa(c, t, explorado=(), rota=None, u=1.0, fenda_aberta=False, marcador=None):
    def fixo(cv):
        cv.drawRect(skia.Rect(-1200, -800, 3100, 2000), fp('#2B4A6E'))
        for i in range(60): x = (i * 173) % 1920; y = (i * 97) % 1080; line(cv, x, y, x + 40, y, 3, '#3A5E86')
        p = skia.Path(); r = R(21); pts = []
        for k in range(36): a = k / 36 * 6.283; rr = 470 + r.uniform(-60, 60); pts.append((960 + math.cos(a) * rr * 1.45, 470 + math.sin(a) * rr * .82))
        p.moveTo(*pts[0])
        for q in pts[1:]: p.lineTo(*q)
        p.close(); cv.drawPath(p, fp('#E8D5A8')); cv.drawPath(p, ink(LW))
        cv.drawPath(p, sp(radial(960, 470, 820, [hx('#000000', 0), hx('#7A5A2E', 90)], [.6, 1])))
        for i in range(9): x0 = 440 + (i % 3) * 50; y0 = 310 + (i // 3) * 45; pinheiro(cv, x0, y0, .32, '#3D7A4A')
        for i in range(5): x0 = 1220 + i * 50; poly(cv, [(x0 - 50, 290), (x0, 180 + (i % 2) * 30), (x0 + 50, 290)], '#9A9AA8', 3); poly(cv, [(x0 - 14, 220 + (i % 2) * 30), (x0, 180 + (i % 2) * 30), (x0 + 14, 220 + (i % 2) * 30)], '#F4F8FF', 2)
        cv.drawOval(skia.Rect(1180, 600, 1340, 680), fp('#5DADE2')); cv.drawOval(skia.Rect(1180, 600, 1340, 680), ink(3))
        for i in range(4): p2 = skia.Path(); p2.moveTo(1480 + i * 40, 560); p2.quadTo(1500 + i * 40, 520, 1540 + i * 40, 560); cv.drawPath(p2, ink(4, '#C9783A'))
        cv.drawRect(skia.Rect(1460, 480, 1680, 590), fp('#E0A060', 80))
        castelo(cv, 980, 440, .16); [casa(cv, 720 + k * 40, 565, 34, 36, 50 + k, fumaca=False) for k in range(3)]
        cv.drawOval(skia.Rect(290, 620, 370, 670), fp('#2A2436')); rect(cv, 820, 670, 860, 700, '#6F6A78', 2, r=4)
        c_ = cv; c_.save(); c_.translate(1720, 820)
        for a in range(4): c_.rotate(90); poly(c_, [(0, -70), (12, 0), (-12, 0)], '#7A3B1A', 2)
        c_.restore(); label(cv, "N", 1720, 735, 34, '#7A3B1A', font=INTER_K, align='center', skew=0)
        label(cv, "REINO DE VALDORA", 960, 80, 54, '#F4EFE2', font=MARKER, align='center', skew=0, stroke=10)
    c.drawPicture(cache('mapa', fixo))
    for k, (x, y, nome) in LUGARES.items():
        if k == 'fenda' and not fenda_aberta: continue
        vis = k in explorado
        circ(c, x, y, 12, '#B23A48' if vis else '#8A7A5A', 3)
        f = skia.Font(INTER_K, 24); w_ = f.measureText(nome); c.drawString(nome, x - w_ / 2, y + 40, f, fp('#3B2416', 255 if vis else 120))
    for k, (x, y, nome) in LUGARES.items():  # névoa sobre o que ainda não foi explorado
        if k in explorado or (k == 'fenda' and not fenda_aberta): continue
        for j in range(5): c.drawCircle(x + 40 * math.sin(t * .5 + j * 1.3), y + 22 * math.cos(t * .4 + j), 70, fp('#F4F1EA', 70))
    if fenda_aberta:
        x, y, _ = LUGARES['fenda']; add_light(c, x, y, 160, '#B03AFF', 200)
        p = skia.Path(); p.moveTo(x, y - 60); p.lineTo(x + 14, y - 20); p.lineTo(x - 10, y + 10); p.lineTo(x + 12, y + 50); c.drawPath(p, ink(10, '#F2D6FF'))
    if rota:
        a, b = LUGARES[rota[0]], LUGARES[rota[1]]; mx, my = (a[0] + b[0]) / 2, min(a[1], b[1]) - 120
        def pt(v): return ((1 - v) ** 2 * a[0] + 2 * (1 - v) * v * mx + v * v * b[0], (1 - v) ** 2 * a[1] + 2 * (1 - v) * v * my + v * v * b[1])
        for i in range(int(40 * u)): x, y = pt(i / 40); c.drawCircle(x, y, 5, fp('#B23A48'))
        x, y = pt(u); marcador = (x, y)
    if marcador:
        x, y = marcador; bob = 6 * math.sin(t * 5)
        p = skia.Path(); p.moveTo(x, y + bob); p.lineTo(x - 22, y - 40 + bob); p.quadTo(x, y - 80 + bob, x + 22, y - 40 + bob); p.close(); c.drawPath(p, fp('#38D6FF')); c.drawPath(p, ink(4))
        c.drawCircle(x, y - 46 + bob, 8, fp('#FFFFFF')); add_light(c, x, y - 40, 80, '#38D6FF', 150)


def deserto(c, t):
    def base(cv):
        ceu(cv, '#F4A259', '#FCE1B0', 700); cv.drawCircle(1500, 260, 110, fp('#FFF4D6', 230))
        for k, (y, cor) in enumerate(((640, '#E0A060'), (720, '#D98E4A'), (820, '#C97A3A'))):
            p = skia.Path(); p.moveTo(-1200, y)
            for x in range(-1200, 3200, 200): p.quadTo(x + 100, y - 60 - 30 * math.sin(x * .01 + k), x + 200, y)
            p.lineTo(3100, 2000); p.lineTo(-1200, 2000); p.close(); cv.drawPath(p, fp(cor))
        for i, x in enumerate((300, 420, 1560)):  # ruínas
            rect(cv, x, 520 - i * 40, x + 70, 760, '#B9875A', LW * .6); rect(cv, x - 12, 500 - i * 40, x + 82, 530 - i * 40, '#A87A50', LW * .5)
        poly(cv, [(1250, 760), (1380, 560), (1510, 760)], '#B9875A', LW * .6); poly(cv, [(1380, 560), (1410, 600), (1350, 600)], '#F2C14E', 2)
        for i in range(5): x = 200 + i * 380; rect(cv, x, 900, x + 12, 960, '#5E8C3A', 3); rect(cv, x - 20, 915, x, 925, '#5E8C3A', 2)
    c.drawPicture(cache('deserto', base))
    for i in range(30): u = (t * .15 + i / 30) % 1; c.drawCircle(-100 + u * 2100, 700 + (i * 37) % 300 + 20 * math.sin(t * 2 + i), 3, fp('#FFE8C0', 120))
