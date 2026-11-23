import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {
    'assassino': dict(corpo='homem', skin='#E9B994', top='hoodie', suit='#26232F', print='#3A3644', hair='short', hair_col='#1C1A24'),
    'lider': dict(corpo='homem', skin='#E6BE8E', top='suit', suit='#7D8597', print='#C9A227', hair='topete', hair_col='#8B5A2B', barba=True),
})
ASS, LID = EL['assassino'], EL['lider']
MAGA = dict(corpo='mulher', skin='#F1C27D', top='dress', suit='#6A4C93', print='#F2C14E', hair='long', hair_col='#E9D8A6', lashes=True, figurante=True)
ARQ = dict(corpo='homem', skin='#8D5524', top='tee', suit='#2E7D32', print='#A5D6A7', hair='curly', hair_col='#1B1B1B', figurante=True)
GOB = dict(corpo='menino', skin='#6BBF4E', top='tee', suit='#6B4A2E', print='#4A321F', hair='none', figurante=True)
BOSS = dict(corpo='homem', skin='#5B4A6E', top='tee', suit='#2B2233', print='#1B1522', hair='none', figurante=True)
CYAN, REDS = '#38D6FF', '#FF2D3A'
import json as _j
_D7 = _j.load(open(os.path.join(PROJ, 'audio', 'falas.json')))['n7']['dur']
M7 = [f'n7+{_D7 * k:.2f}' for k in (0.0, 0.3, 0.54, 0.76)]


def rnd(i, k=1.0): return (math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1.0
def pisca(t, ph=0): return 'closed' if blink(t, 2.7, ph) else 'dot'
def boca(S, k, t, rest='flat'): return S.boca(k, t, rest) if k else rest
def head(x, y, s): return x, y + HEAD_CY * s
def mao(x, y, s, nome, lado):
    hx, hy = ARM[nome][1] if isinstance(nome, str) else ARM[nome[1]][1]
    return x + (hx if lado == 'L' else -hx) * s, y + hy * s
def sombra(c, x, y, w, a=110): c.drawOval(skia.Rect(x - w, y - w * .18, x + w, y + w * .18), fp((0, 0, 0), a, blur=10))


# ---------------------------------------------------------------- efeitos de anime
def linhas_velocidade(c, cx, cy, t, a=1.0, cor='#FFFFFF', n=70):
    for i in range(n):
        ang = rnd(i, int(t * 12)) * 6.283; r0 = 260 + rnd(i, 3) * 260; r1 = 1600
        c.drawLine(cx + math.cos(ang) * r0, cy + math.sin(ang) * r0, cx + math.cos(ang) * r1, cy + math.sin(ang) * r1, ink(2 + rnd(i, 5) * 9, cor, 160 * a))
def corte(c, x, y, r, u, ang=-30, cor='#FFFFFF'):
    if not 0 < u < 1.4: return
    k = min(u, 1); fade = 1 - max(0, u - 1) / .4
    p = skia.Path(); p.addArc(skia.Rect(x - r, y - r * .5, x + r, y + r * .5), ang, 200 * ease_out(k))
    c.save(); c.translate(x, y); c.rotate(-20); c.translate(-x, -y)
    c.drawPath(p, ink(34, '#9FE8FF', 120 * fade)); c.drawPath(p, ink(12, cor, 255 * fade)); c.restore()
def impacto(c, u):  # quadro de impacto: cores invertidas por um instante
    if 0 <= u < 1: c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#FFFFFF', 255, blend=skia.BlendMode.kDifference))
def tint(c, cor, a): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp(cor, 255 * a))
def faiscas(c, x, y, t, t0, n=24, cor='#FFE14A'):
    u = t - t0
    if not 0 < u < 1.2: return
    for i in range(n):
        ang = rnd(i, 7) * 6.283; v = 300 + rnd(i, 9) * 500; px, py = x + math.cos(ang) * v * u, y + math.sin(ang) * v * u + 400 * u * u
        c.drawCircle(px, py, 6 * (1 - u / 1.2), fp(cor, 255)); add_light(c, px, py, 30, cor, 120 * (1 - u / 1.2))
def xp_pop(c, txt, x, y, t, t0, cor='#FFE14A', size=70):
    u = t - t0
    if not 0 < u < 2.2: return
    a = min(1, (2.2 - u) / .5); c.save(); c.translate(0, -60 * u); poplabel(c, txt, x, y, t, t0, size, cor, rot=-4, font=INTER_K, stroke=12); c.restore()


# ---------------------------------------------------------------- janela do sistema (painel azul/vermelho)
def painel(c, S, t, t0, titulo, linhas, cor=CYAN, y=None, glitch=0.0):
    k = back(K(t, t0, .35), 1.2)
    if k <= 0.01: return
    x0, y0, x1, y1 = S.view; w = (x1 - x0) * .86; cx = (x0 + x1) / 2; h = 90 + 62 * len(linhas); yy = y if y is not None else y0 + (y1 - y0) * .2
    c.save(); c.translate(cx, yy + h / 2); c.scale(1, min(1, k)); c.translate(-cx, -(yy + h / 2))
    if glitch: c.translate(18 * glitch * math.sin(t * 77), 0)
    r = skia.Rect(cx - w / 2, yy, cx + w / 2, yy + h)
    c.drawRRect(skia.RRect.MakeRectXY(r, 18, 18), fp(cor, 120, blur=30))
    c.drawRRect(skia.RRect.MakeRectXY(r, 18, 18), fp('#06142A', 225)); c.drawRRect(skia.RRect.MakeRectXY(r, 18, 18), ink(5, cor))
    c.drawRect(skia.Rect(r.left(), yy, r.right(), yy + 64), fp(cor, 60))
    f = skia.Font(INTER_K, 34); c.drawString(titulo, cx - f.measureText(titulo) / 2, yy + 44, f, fp('#FFFFFF'))
    for i, (txt, col) in enumerate(linhas):
        ff = skia.Font(INTER_B, 30); sz = 30
        while ff.measureText(txt) > w - 50 and sz > 16: sz -= 2; ff = skia.Font(INTER_B, sz)
        c.drawString(txt, cx - ff.measureText(txt) / 2, yy + 118 + i * 62, ff, fp(col))
    if glitch:
        for i in range(10): c.drawRect(skia.Rect(cx - w / 2 + rnd(i, int(t * 20)) * w, yy + rnd(i, 4) * h, cx - w / 2 + rnd(i, int(t * 20)) * w + 120, yy + rnd(i, 4) * h + 8), fp('#FFFFFF', 140))
    c.restore()


# ---------------------------------------------------------------- cenários
def tijolos(c, y0, y1, cor='#4E4A58', seed=1):
    c.drawRect(skia.Rect(-900, y0, W + 900, y1), fp('#2A2732'))
    for j, y in enumerate(range(int(y0), int(y1), 70)):
        for i, x in enumerate(range(-900 + (j % 2) * 70, W + 900, 140)):
            v = rnd(i * 7 + j, seed) * .25; col = clarear(cor, v) if v > .12 else escurecer(cor, 1 - v)
            rect(c, x + 4, y + 4, x + 136, y + 66, col, 3, r=8)
def tocha(c, x, y, t):
    rect(c, x - 10, y, x + 10, y + 90, '#5A3A22', 4, r=4); rect(c, x - 24, y - 10, x + 24, y + 10, '#3B2A20', 4, r=4)
    f = 1 + .12 * math.sin(t * 13 + x); p = skia.Path(); p.moveTo(x - 22, y - 8); p.cubicTo(x - 30, y - 60 * f, x, y - 90 * f, x + 2, y - 110 * f); p.cubicTo(x + 10, y - 80 * f, x + 28, y - 50 * f, x + 22, y - 8); p.close()
    c.drawPath(p, fp('#FF8A2A')); p2 = skia.Path(); p2.addOval(skia.Rect(x - 11, y - 60 * f, x + 11, y - 8)); c.drawPath(p2, fp('#FFE08A'))
TOCHAS = [(330, 380), (1590, 380), (960, 360)]
def masmorra(c, t, tochas=TOCHAS, chao='#3A3642'):
    tijolos(c, -400, 800)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp(chao)); line(c, -900, 800, W + 900, 800, LW)
    for i in range(-10, 30): line(c, 960 + (i - 10) * 60, 800, 960 + (i - 10) * 260, 1400, 3, '#2A2732')
    for y in (860, 950, 1060): line(c, -900, y, W + 900, y, 3, '#2A2732')
    for (x, y) in tochas: tocha(c, x, y, t)
def luz_masmorra(c, t, tochas=TOCHAS, extra=()):
    night(c, [('pool', x, y - 40, 560 + 20 * math.sin(t * 9 + x), .95) for (x, y) in tochas] + list(extra), '#3A3A70')
    for (x, y) in tochas: add_light(c, x, y - 60, 260, '#FFB347', 170 + 30 * math.sin(t * 11 + x))
def guilda(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), fp('#6B4A30'))
    for x in range(-900, W + 900, 90): line(c, x, -400, x, 800, 4, '#4E3522')
    rect(c, 700, 180, 1220, 560, '#8A6A44', LW, r=10)  # quadro de ranks
    for i, (rk, col) in enumerate((('S', '#FFD23F'), ('A', '#FF8A3D'), ('B', '#4CC9F0'), ('C', '#8CE95A'), ('E', '#9A9A9A'))):
        px = 740 + (i % 3) * 160; py = 210 + (i // 3) * 170; rect(c, px, py, px + 130, py + 140, '#F4E9CF', 3, r=4); label(c, rk, px + 65, py + 100, 80, col, font=INTER_K, align='center', skew=0, stroke=6)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#4A3424'))
    for y in (860, 950, 1060): line(c, -900, y, W + 900, y, 3, '#3A281B')
    for x in (280, 1640): line(c, x, -100, x, 120, 5); circ(c, x, 160, 44, '#FFD27A', 5)
def luz_guilda(c, t):
    night(c, [('pool', 280, 200, 650, .95), ('pool', 1640, 200, 650, .95), ('pool', 960, 380, 520, .8)], '#5A4A70')
    for x in (280, 1640): add_light(c, x, 160, 220, '#FFD27A', 180)
def entrada(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), sp(linear(0, -400, 0, 800, [hx('#1A1830'), hx('#3A3558')])))
    for i in range(8): x = -200 + i * 330; poly(c, [(x, 800), (x + 160, 220 + 60 * rnd(i)), (x + 320, 800)], '#2E2A3A', 4)
    rect(c, 640, 180, 1280, 820, '#4E4A58', LW, r=0); c.drawOval(skia.Rect(700, 240, 1220, 1100), fp('#050409'))
    oval(c, 700, 240, 1220, 1100, '#050409', LW)
    for i in range(7): a = math.pi * (i / 6); bx, by = 960 - math.cos(a) * 300, 640 - math.sin(a) * 420; rect(c, bx - 50, by - 34, bx + 50, by + 34, '#6F6A78', 4, r=6)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#3A3642')); line(c, -900, 800, W + 900, 800, LW)
    tocha(c, 600, 420, t); tocha(c, 1320, 420, t)
def sala_chefe(c, t, porta=1.0):
    tijolos(c, -400, 800, '#4A4054', 3)
    for x in (380, 1540): rect(c, x - 70, -400, x + 70, 800, '#5A5266', LW, r=6); rect(c, x - 90, 740, x + 90, 800, '#4A4054', 4)
    rect(c, 700, 120, 1220, 800, '#2A1F18', LW, r=14)
    if porta < 1: c.drawRect(skia.Rect(700 + 260 * porta, 120, 1220 - 260 * porta, 800), fp('#FFB86B', 200 * (1 - porta)))
    else:
        for x in (790, 1130): rect(c, x - 50, 160, x + 50, 780, '#3B2A20', 4, r=8)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#352F3C')); line(c, -900, 800, W + 900, 800, LW)
    tocha(c, 600, 380, t); tocha(c, 1320, 380, t)


# ---------------------------------------------------------------- personagens com detalhes
def assassino(c, x, y, s, t, alpha=1.0, olhos=1.0, adagas=True, **kw):
    if alpha < 1: c.saveLayer(None, fp((0, 0, 0), 255 * alpha))
    hx_, hy_ = head(x, y, s); fc = kw.get('face', 0.0)
    c.drawCircle(hx_ + fc * 10 * s, hy_ - 14 * s, 128 * s, fp('#1C1A24'))  # capuz (atrás)
    kw.setdefault('eyes', pisca(t)); kw.setdefault('mouth', 'flat'); kw.setdefault('rim', '#8FB3FF')
    draw_char(c, x, y, s, ASS, **kw)
    p = skia.Path(); p.addArc(skia.Rect(hx_ - 122 * s + fc * 10 * s, hy_ - 142 * s, hx_ + 122 * s + fc * 10 * s, hy_ + 96 * s), 180, 180); p.close()
    c.drawPath(p, fp('#1C1A24')); c.drawPath(p, ink(LW))                            # aba do capuz na testa
    rect(c, hx_ - 86 * s + fc * 30 * s, hy_ + 30 * s, hx_ + 86 * s + fc * 30 * s, hy_ + 92 * s, '#2E2A38', LW * .8, r=26 * s)  # lenço sobre a boca
    if olhos > 0:
        for sx in (-1, 1): add_light(c, hx_ + (sx * 34 + fc * 40) * s, hy_ + 4 * s, 34 * s, REDS, 200 * olhos); c.drawCircle(hx_ + (sx * 34 + fc * 40) * s, hy_ + 4 * s, 6 * s, fp('#FFB3B8', 255 * olhos))
    if adagas:
        arms = kw.get('arms', ('down', 'down'))
        for lado, nome in (('L', arms[0]), ('R', arms[1])):
            nm = nome if isinstance(nome, str) else (nome[1] if nome[2] > .5 else nome[0])
            px, py = mao(x, y, s, nm, lado); sd = -1 if lado == 'L' else 1
            line(c, px, py, px + sd * 20 * s, py + 90 * s, 9 * s, '#DCE3EA'); line(c, px - 14 * s, py + 6 * s, px + 14 * s, py + 6 * s, 7 * s, '#B08A3A')
    if alpha < 1: c.restore()
def lider(c, x, y, s, t, **kw):
    kw.setdefault('eyes', pisca(t, .5)); draw_char(c, x, y, s, LID, **kw)
    for sx in (-1, 1): oval(c, x + sx * 70 * s - 52 * s, y - 360 * s, x + sx * 70 * s + 52 * s, y - 300 * s, '#9AA3B5', LW * .8)  # ombreiras
def goblin(c, x, y, s, t, **kw):
    hx_, hy_ = head(x, y, s * .74)
    for sx in (-1, 1): poly(c, [(hx_ + sx * 70 * s, hy_ - 20 * s), (hx_ + sx * 170 * s, hy_ - 70 * s), (hx_ + sx * 80 * s, hy_ + 30 * s)], '#6BBF4E', LW * .8)
    kw.setdefault('eyes', 'wide'); draw_char(c, x, y, s, GOB, **kw)
def chefe(c, x, y, s, t, olhos=1.0, **kw):
    hx_, hy_ = head(x, y, s)
    for sx in (-1, 1): poly(c, [(hx_ + sx * 50 * s, hy_ - 80 * s), (hx_ + sx * 150 * s, hy_ - 230 * s), (hx_ + sx * 100 * s, hy_ - 60 * s)], '#D9CBB0', LW)
    kw.setdefault('eyes', 'half'); kw.setdefault('mouth', 'open'); draw_char(c, x, y, s, BOSS, **kw)
    for sx in (-1, 1): add_light(c, hx_ + sx * 34 * s, hy_, 40 * s, '#FFE14A', 230 * olhos)
def grupo(c, t, x0=1060, y=1000, s=.9, rir=False, deitados=False):
    for i, (spec, dx) in enumerate(((MAGA, 0), (ARQ, 230))):
        if deitados:
            c.save(); c.translate(x0 + dx, y); c.rotate(-88 + i * 176); c.translate(-(x0 + dx), -y); draw_char(c, x0 + dx, y, s, spec, eyes='closed', mouth='o'); c.restore()
        else:
            sombra(c, x0 + dx, y, 90 * s); draw_char(c, x0 + dx, y, s, spec, face=-.5, eyes='closed' if rir else pisca(t, i), mouth='open' if rir and int(t * 8 + i) % 2 else ('smile' if rir else 'flat'), arms=('hip', 'down') if rir else ('down', 'down'), bob=4 * abs(math.sin(t * 9 + i)) if rir else 1.5 * math.sin(t * 2 + i))


# ---------------------------------------------------------------- tomadas
def s_gancho(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-200, -260); c.scale(1.5, 1.5); masmorra(c, t); c.restore(); c.restore(); luz_masmorra(c, t, [(500, 300)])
    assassino(c, 960, 1360, 2.4, t, face=.1, eyes='half', olhos=.6 + .4 * math.sin(t * 3) ** 2, arms=('down', 'down'), adagas=False)
    x0, x1 = S.view[0], S.view[2]; w = (x1 - x0) * .9
    poplabel(c, "XP SEM SER", 960, 140, t, S.s0 + .1, fit("XP SEM SER", 110, w, INTER_K), '#FFFFFF', rot=-3, font=INTER_K, stroke=14)
    poplabel(c, "VISTO?", 960, 250, t, S.s0 + .4, fit("VISTO?", 130, w, INTER_K), '#FFE14A', rot=-3, font=INTER_K, stroke=14)
def s_guilda(c, t, S):
    guilda(c, t); sombra(c, 560, 1000, 90)
    assassino(c, 560, 1000, .9, t, face=.4, arms=('down', 'down'), adagas=False)
    lider(c, 1380, 1000, 1.05, t, face=-.6, mouth='open' if int(t * 7) % 2 else 'smile', eyes='closed', arms=('hip', 'hip'), bob=4 * abs(math.sin(t * 9)))
    grupo(c, t, 1560, rir=True)
    luz_guilda(c, t)
    painel(c, S, t, S.at('n2+1.1'), "STATUS", [("CLASSE: ASSASSINO", '#FFFFFF'), ("RANK: E", '#9A9A9A')])
def s_lider_fala(c, t, S, k='l1', **kw):
    blur_begin(c, 12); c.save(); c.translate(-900, -260); c.scale(1.5, 1.5); guilda(c, t); c.restore(); c.restore(); luz_guilda(c, t)
    kw.setdefault('arms', ('hip', ('down', 'push', K(t, S.s0 + .1, .3)))); lider(c, 960, 1180, 1.9, t, face=-.4, mouth=boca(S, k, t, 'smirk'), eyes='half', **kw)
def s_entrada(c, t, S):
    entrada(c, t); u = K(t, S.s0, S.s1 - S.s0)
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, 160), (ARQ, 320))):
        x = lerp(1500, 1050, u) + dx; ph = (t - S.s0) * 8 + i
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, x, 1000, .8, t, face=-.7, legs=walk_legs(ph), bob=5 * abs(math.sin(ph)))
    assassino(c, lerp(1900, 1500, u), 1000, .8, t, face=-.7, legs=walk_legs((t - S.s0) * 8 + 4), bob=5 * abs(math.sin((t - S.s0) * 8)), adagas=False)
    night(c, [('pool', 600, 400, 600, .95), ('pool', 1320, 400, 600, .95), ('pool', 1650, 800, 500, .6)], '#3A3A70')
    for x in (600, 1320): add_light(c, x, 360, 240, '#FFB347', 180)
    if t > S.at('n3+2.0'): add_light(c, lerp(1900, 1500, u), 600, 260, CYAN, 200 * K(t, S.at('n3+2.0'), .4))
def s_missao(c, t, S):
    blur_begin(c, 14); c.save(); c.translate(-300, -260); c.scale(1.5, 1.5); entrada(c, t); c.restore(); c.restore()
    night(c, [('pool', 960, 700, 700, .5)], '#2A2A60')
    assassino(c, 960, 1420, 2.2, t, face=0, eyes='wide', arms=('down', 'down'), adagas=False, olhos=.5)
    add_light(c, 960, 500, 700, CYAN, 90)
    painel(c, S, t, S.s0 + .1, "MISSÃO OCULTA", [("Derrote monstros", '#FFFFFF'), ("sem ser visto.", '#FFFFFF'), ("BÔNUS DE XP: x10", '#FFE14A')], y=S.view[1] + 150)
def s_sombras(c, t, S):
    masmorra(c, t); u = K(t, S.at('n5+1.4'), 1.0)
    goblin(c, 1250, 1000, .9, t, face=-.6, arms=('gesture', 'gesture'), mouth='open', bob=6 * abs(math.sin(t * 10)))
    lider(c, 1000, 1000, 1.0, t, face=.6, mouth='open', eyes='wide', arms=(('down', 'hat', (math.sin(t * 9) + 1) / 2), 'push'), bob=6 * abs(math.sin(t * 9)))
    grupo(c, t, 760, s=.85)
    assassino(c, 520, 1000, .9, t, face=.5, alpha=1 - .85 * u, olhos=1, arms=('down', 'down'))
    luz_masmorra(c, t)
    if int(t * 6) % 2: poplabel(c, "CLANG!", 1130, 520, t, S.s0, 70, '#FFFFFF', rot=8, font=INTER_K)
def s_goblin(c, t, S):
    masmorra(c, t, tochas=[(1500, 380)]); hit = S.at('n6+1.0'); u = K(t, hit, .5)
    gx = 1100
    if t < hit + .1: goblin(c, gx, 1000, 1.0, t, face=-.3, eyes='wide', mouth='flat', arms=('down', 'down'))
    else:
        c.save(); c.translate(gx, 1000); c.rotate(80 * ease_out(u)); c.translate(-gx, -1000); goblin(c, gx, 1000, 1.0, t, eyes='closed', mouth='o'); c.restore()
    if t > S.at('n6+0.3'): assassino(c, 880, 1000, 1.0, t, face=.6, eyes='half', arms=('down', ('down', 'present', K(t, hit - .1, .15))), alpha=K(t, S.at('n6+0.3'), .3))
    luz_masmorra(c, t, tochas=[(1500, 380)], extra=[('pool', 950, 700, 500, .6)])
    corte(c, 1080, 560, 300, (t - hit) / .25); impacto(c, (t - hit) / .07); faiscas(c, 1080, 560, t, hit)
    xp_pop(c, "+500 XP", 1060, 330, t, hit + .3)
def s_risada(c, t, S): s_lider_fala(c, t, S, 'l2', arms=('hip', 'gesture'), bob=5 * abs(math.sin(t * 9)))
def s_montagem(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814'))
    for i, at in enumerate(M7):
        tt = S.at(at)
        if t >= tt:
            k = K(t, tt, .2); linhas_velocidade(c, 960, 540, t, .4 * (1 - K(t, tt + .2, .6)), '#9FE8FF')
            corte(c, 960 + (i % 2 * 2 - 1) * 60, 540, 360, (t - tt) / .25, ang=-30 + i * 40)
    lv = 2 if t < S.at(M7[1]) else 5 if t < S.at(M7[2]) else 12 if t < S.at(M7[3]) else 30
    assassino(c, 960, 1100, 1.3, t, face=.2, eyes='half', arms=('present', ('down', 'present', K(t, S.s0, .3))))
    luz_masmorra(c, t, tochas=[], extra=[('pool', 960, 600, 700, .7)])
    poplabel(c, f"NÍVEL {lv}", 960, 300, t, S.at({2: M7[0], 5: M7[1], 12: M7[2], 30: M7[3]}[lv]), 130, '#FFE14A', rot=-4, font=INTER_K, stroke=16)
def s_merito(c, t, S):
    masmorra(c, t)
    lider(c, 960, 1000, 1.1, t, face=0, eyes='closed', mouth='smile', arms=('hip', 'gesture'), sparkle=(t - S.s0) % 1.2 / .3)
    grupo(c, t, 1200, rir=True)
    luz_masmorra(c, t)
    for sx in (-1, 1): add_light(c, 560 + sx * 26, 560, 30, REDS, 220)  # o assassino na sombra: só os olhos
def s_porta(c, t, S):
    sala_chefe(c, t, porta=1 - K(t, S.at('n9+1.0'), 1.4))
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, -180), (ARQ, 180))):
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, 960 + dx, 1040, .7, t, face=0, eyes='wide')
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 960, 460, 520, .9 * K(t, S.at('n9+1.0'), 1.4))])
def s_chefe(c, t, S):
    sala_chefe(c, t, porta=0); hit = S.at('n10+0.8'); k = K(t, hit, .3)
    chefe(c, 960, 1020, 2.4, t, face=0, eyes='half', mouth='open', arms=(('down', 'hat', K(t, S.s0, .6) * (1 - k)), 'hip'), squash=.06 * math.sin(math.pi * k))
    grupo(c, t, 1350, y=1020, s=.75, deitados=t > hit)
    lider(c, 560, 1020, .8, t, face=.5, eyes='wide', mouth='o', arms=('gesture', 'gesture'))
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 960, 500, 900, .6)])
    if t > hit:
        for i in range(14): uu = t - hit; c.drawCircle(700 + i * 40, 1000 - 200 * uu * rnd(i), (60 + 120 * uu) * rnd(i, 2), fp('#B8AFC4', 140 * max(0, 1 - uu)))
def s_implora(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-400, -260); c.scale(1.5, 1.5); sala_chefe(c, t, 0); c.restore(); c.restore()
    luz_masmorra(c, t, tochas=[], extra=[('pool', 960, 700, 700, .7)])
    c.drawRect(skia.Rect(-2000, -2000, 4000, 500), fp((0, 0, 0), 120, blur=40))
    lider(c, 960, 1300, 1.9, t, face=0, eyes='wide', mouth=boca(S, 'l3', t, 'o'), arms=('chin', 'chin'), brow=1, brow_tilt=-.8, sweat=(t - S.s0) * 1.2, tilt=3 * math.sin(t * 20))
def s_procura(c, t, S):
    sala_chefe(c, t, porta=0)
    chefe(c, 1000, 1020, 2.4, t, face=math.sin((t - S.s0) * 2.2) * .8, eyes='half', mouth='flat')
    assassino(c, 640, 1020, .8, t, face=.6, alpha=.3, eyes='half', arms=('down', 'down'))
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 1000, 500, 800, .5)])
    poplabel(c, "?", 1000 + 120, 180, t, S.s0 + .3, 140, '#FFFFFF', font=INTER_K)
def s_golpe(c, t, S):
    hit = S.at('n12:fim-0.45')
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#140A1E'))
    linhas_velocidade(c, 960, 540, t, 1.0, '#FFFFFF', 90)
    u = K(t, S.s0, hit - S.s0)
    assassino(c, lerp(500, 1150, ease_out(u)), lerp(1300, 900, ease_out(u)), 1.4, t, face=.7, eyes='half', arms=('present', 'present'), tilt=-12, olhos=1)
    corte(c, 1000, 540, 520, (t - hit) / .2, ang=-50); impacto(c, (t - hit) / .08); faiscas(c, 1000, 540, t, hit, 40, '#9FE8FF')
def s_queda(c, t, S):
    sala_chefe(c, t, porta=0); u = K(t, S.s0, 1.2)
    c.save(); c.translate(960, 1020); c.rotate(-80 * ease(u)); c.translate(-960, -1020); chefe(c, 960, 1020, 2.4, t, eyes='closed', mouth='o', olhos=1 - u); c.restore()
    assassino(c, 1500, 1020, .9, t, face=-.5, eyes='half', arms=('down', 'down'))
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 1500, 700, 500, .7)])
    for i in range(40):
        y = 1100 - ((t - S.s0) * 300 + rnd(i) * 900) % 1100; x = 500 + rnd(i, 2) * 1000; c.drawCircle(x, y, 5, fp('#FFE14A', 200)); add_light(c, x, y, 24, '#FFE14A', 100)
    painel(c, S, t, S.at('n13+0.2'), "VITÓRIA", [("+100.000 XP", '#FFE14A'), ("NÍVEL 99", '#FFE14A')], cor='#FFD23F')
def s_fui_eu(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-900, -260); c.scale(1.5, 1.5); sala_chefe(c, t, 0); c.restore(); c.restore(); luz_masmorra(c, t, tochas=[], extra=[('pool', 960, 600, 800, .7)])
    lider(c, 960, 1300, 1.9, t, face=-.3, eyes='half', mouth=boca(S, 'l4', t, 'o'), arms=('chin', 'down'), brow=.6, brow_tilt=.6)
    for i, dx in enumerate((-180, 0, 180)): poplabel(c, "?", 960 + dx, 200 - 30 * (i == 1), t, S.s0 + .2 + i * .15, 110, '#FFFFFF', font=INTER_K)
def s_vermelho(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-200, -260); c.scale(1.5, 1.5); sala_chefe(c, t, 0); c.restore(); c.restore(); luz_masmorra(c, t, tochas=[], extra=[('pool', 960, 700, 800, .7)])
    assassino(c, 960, 1420, 2.2, t, face=0, eyes='wide', arms=('down', 'down'), adagas=False)
    k = K(t, S.at('n14+0.8'), .4); tint(c, '#FF1030', .18 * k + .05 * k * math.sin(t * 20))
    painel(c, S, t, S.s0 + .1, "SISTEMA", [("Analisando...", '#FFFFFF')], cor=CYAN if k < .5 else REDS, y=S.view[1] + 150, glitch=k)
def s_aviso(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#12030A'))
    assassino(c, 960, 1500, 2.6, t, face=0, eyes='wide', adagas=False, arms=('down', 'down'), olhos=1)
    tint(c, '#FF1030', .25 + .1 * math.sin(t * 25))
    painel(c, S, t, S.s0, "AVISO", [("VOCÊ FOI VISTO.", '#FFFFFF')], cor=REDS, y=S.view[1] + 180, glitch=.8)
def s_ninguem(c, t, S):
    sala_chefe(c, t, porta=0)
    c.save(); c.translate(1450, 1020); c.rotate(-80); c.translate(-1450, -1020); chefe(c, 1450, 1020, 2.0, t, eyes='closed', olhos=0); c.restore()
    grupo(c, t, 450, y=1030, s=.75, deitados=True)
    assassino(c, 960, 1000, 1.0, t, face=math.sin((t - S.s0) * 3) * .9, eyes='wide', arms=('down', 'down'), sweat=(t - S.s0))
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 960, 700, 500, .7)])
def s_teto(c, t, S):
    tijolos(c, -1200, 1200, '#3E3848', 5)
    abre = K(t, S.at('n17+0.2'), .8)
    for (x, y, r) in ((700, 180, 150), (1220, 180, 150), (960, -260, 260)):
        c.drawOval(skia.Rect(x - r * 1.6, y - r * abre, x + r * 1.6, y + r * abre), fp('#FFE14A')); c.drawOval(skia.Rect(x - r * .5, y - r * .9 * abre, x + r * .5, y + r * .9 * abre), fp('#120606'))
        add_light(c, x, y, r * 2.5, '#FFE14A', 160 * abre)
    night(c, [('pool', 960, 100, 900, .4 + .5 * abre)], '#1A1430')
    if t > S.at('n17:fim'): k = K(t, S.at('n17:fim'), .4); tint(c, '#000000', .6 * k); poplabel(c, "PARTE 2?", (S.view[0] + S.view[2]) / 2, 560, t, S.at('n17:fim+0.1'), 130, '#FFE14A', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.08): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_gancho, falas=['n1'], **V((960, 440), (1.0, 1.08))),
    dict(topo='GUILDA', draw=s_guilda, falas=['n2'], sfx=[('ding', 'n2+1.1', .6)], **V(((560, 560), (1380, 560)), (1.0, 1.0))),
    dict(topo='GUILDA', draw=s_lider_fala, falas=['l1'], **V((960, 500), (1.0, 1.08))),
    dict(topo='ENTRADA DA MASMORRA', draw=s_entrada, falas=['n3'], sfx=[('steps', 0.1, .5), ('brilho', 'n3+2.0', .7)], **V(((1300, 560), (1600, 520)), (1.0, 1.1))),
    dict(topo='ENTRADA DA MASMORRA', draw=s_missao, falas=['n4'], sfx=[('notif', 0.1, .8)], **V((960, 480), (1.0, 1.05))),
    dict(topo='ANDAR 1', draw=s_sombras, falas=['n5'], sfx=[('thud', 0.3, .5), ('thud', 0.9, .5)], **V(((1100, 560), (560, 560)), (1.0, 1.05))),
    dict(topo='ANDAR 1', draw=s_goblin, falas=['n6'], sfx=[('whoosh', 'n6+0.9', .9), ('thud', 'n6+1.0', .8), ('ding', 'n6+1.3', .6)], shake=['n6+1.0'], **V(((1100, 520), (980, 560)), (1.15, 1.0))),
    dict(topo='ANDAR 1', draw=s_risada, falas=['l2'], **V((960, 500), (1.05, 1.0))),
    dict(draw=s_montagem, falas=['n7'], sfx=[('whoosh', M7[0], .7), ('subida', 'n7+0.1', .6), ('whoosh', M7[1], .7), ('whoosh', M7[2], .7), ('whoosh', M7[3], .7), ('ding', M7[3], .6)], **V((960, 520), (1.0, 1.15))),
    dict(topo='ANDAR 7', draw=s_merito, falas=['n8'], **V(((960, 520), (620, 540)), (1.0, 1.1))),
    dict(topo='SALA DO CHEFE', draw=s_porta, falas=['n9'], sfx=[('boom', 'n9+1.0', .8)], **V(((960, 600), (960, 460)), (.95, 1.0))),
    dict(topo='SALA DO CHEFE', draw=s_chefe, falas=['n10'], sfx=[('boom', 'n10+0.8', 1.0)], shake=['n10+0.8'], **V(((960, 300), (960, 560)), (1.0, .85))),
    dict(topo='SALA DO CHEFE', draw=s_implora, falas=['l3'], **V((960, 520), (1.0, 1.08))),
    dict(topo='SALA DO CHEFE', draw=s_procura, falas=['n11'], **V(((1000, 340), (700, 600)), (1.0, 1.0))),
    dict(draw=s_golpe, falas=['n12'], sfx=[('whoosh', 0.1, .9), ('boom', 'n12:fim-0.45', 1.0)], shake=['n12:fim-0.45'], **V((960, 560), (1.15, 1.0))),
    dict(topo='SALA DO CHEFE', draw=s_queda, falas=['n13'], sfx=[('boom', 0.2, .8), ('subida', 'n13+0.2', .6), ('ding', 'n13+0.3', .7)], **V(((960, 540), (1300, 540)), (.9, 1.0))),
    dict(topo='SALA DO CHEFE', draw=s_fui_eu, falas=['l4'], **V((960, 500), (1.0, 1.1))),
    dict(draw=s_vermelho, falas=['n14'], sfx=[('glitch', 'n14+0.8', .8)], **V((960, 480), (1.0, 1.06))),
    dict(draw=s_aviso, falas=['n15'], sfx=[('buzzer', 0.05, .9)], shake=[0.05], **V((960, 520), (1.1, 1.0))),
    dict(draw=s_ninguem, falas=['n16'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_teto, falas=['n17'], hold=1.6, sfx=[('boom', 'n17+0.2', .9)], **V(((960, 900), (960, 200)), (1.0, 1.0))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
