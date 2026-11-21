import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *
from kit import _arvore
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {
    'joao': dict(corpo='idoso', skin='#A8734F', top='dress', suit='#C9B48A', print='#6B4A32', hair='medio', hair_col='#9C9A96', barba=True, bengala=True),
    'filho': dict(corpo='homem', skin='#E8D2B0', top='dress', suit='#F4F1E8', print='#E8B830', hair='medio', hair_col='#FAFAFA'),
})
JOAO, FILHO = EL['joao'], EL['filho']
LEITOR = dict(corpo='homem', skin='#B98057', top='dress', suit='#7A5A3C', print='#3B2A20', hair='short', hair_col='#2A1A14', barba=True, figurante=True)
OUV = [dict(corpo='idosa', skin='#C98F62', top='dress', suit='#5E4A6E', print='#3B2A20', hair='bun', hair_col='#D8D8DC', figurante=True),
       dict(corpo='homem', skin='#8A5A3B', top='dress', suit='#4E6B4A', print='#2A1A14', hair='curly', hair_col='#1C1B22', figurante=True),
       dict(corpo='mulher', skin='#D9A877', top='dress', suit='#8C3B3B', print='#F2C14E', hair='long', hair_col='#3B2416', lashes=True, figurante=True)]
GOLDL = '#F5D27A'; BRONZE = '#C98A3A'


def rnd(i, k=1.0): return (math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1.0


# ---------------------------------------------------------------- céu / luz do trono
def ceu(c, t, brilho=1.0, sete=0.0, tinta=0.0):
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), sp(linear(0, -200, 0, H, [hx('#120E2E'), hx('#3A2A5E'), hx('#B07A4A')], [0, .55, 1])))
    if tinta > 0: c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#7A0F1E', 150 * tinta))
    add_light(c, 960, 300, 900, '#FFE9B0', 120 * brilho)
    c.save(); c.translate(960, 300); c.rotate(t * 3)
    for i in range(14):
        a = i * 360 / 14; c.save(); c.rotate(a)
        p = skia.Path(); p.moveTo(0, 0); p.lineTo(-60, -1400); p.lineTo(60, -1400); p.close()
        c.drawPath(p, sp(linear(0, 0, 0, -1400, [hx('#FFF3C8', int(70 * brilho)), hx('#FFF3C8', 0)]), blend=skia.BlendMode.kPlus, blur=18)); c.restore()
    c.restore()
    add_light(c, 960, 300, 330, '#FFFFFF', 230 * brilho)
    for i in range(16):  # nuvens em camadas
        x = (rnd(i) * 2600 - 340 + t * (6 + 10 * rnd(i, 2))) % 2600 - 340; y = 520 + rnd(i, 3) * 520
        cloud(c, x, y, 1.2 + rnd(i, 4) * 1.6, '#E9D3B8', 235)
    for i in range(7):  # sete Espíritos: sete chamas iguais diante da luz
        if sete <= 0: break
        k = back(K(sete, i * .12, .4), 1.4); a = math.radians(200 + i * 140 / 6); x = 960 + 420 * math.cos(a); y = 420 - 150 * math.sin(a) + 60
        add_light(c, x, y, 70 * k, '#FFF6D8', 230 * k); c.drawCircle(x, y, 10 * k, fp('#FFFFFF', 255 * k))
    for i in range(40):  # partículas douradas
        y = (900 - (t * 30 + rnd(i, 5) * 1200) % 1200); x = rnd(i, 6) * W
        c.drawCircle(x, y, 2 + 3 * rnd(i, 7), fp('#FFE7A0', 180, blur=1))


# ---------------------------------------------------------------- Patmos
def patmos(c, t, sol=1.0):
    c.drawRect(skia.Rect(-900, -600, W + 900, 560), sp(linear(0, -100, 0, 560, [hx('#2F4E8C'), hx('#8DA9C9'), hx('#F4C27A')], [0, .6, 1])))
    add_light(c, 1500, 470, 260, '#FFE0A0', 200 * sol); c.drawCircle(1500, 470, 46, fp('#FFF4D8'))
    for i in range(5): cloud(c, (rnd(i) * 2200 + t * 7) % 2600 - 300, 120 + rnd(i, 2) * 220, .8 + rnd(i, 3), '#F6E3D0', 200)
    c.drawRect(skia.Rect(-900, 540, W + 900, H + 600), sp(linear(0, 540, 0, 1000, [hx('#3D6FA8'), hx('#1F4E8C'), hx('#163A6A')])))
    for (x, w, h) in ((140, 420, 60), (1180, 300, 40), (1760, 380, 70)):  # ilhas distantes
        p = skia.Path(); p.moveTo(x - w / 2, 552); p.quadTo(x, 552 - h * 2, x + w / 2, 552); p.close(); c.drawPath(p, fp('#6C7FA0'))
    for i in range(60):  # brilho do sol no mar
        x = 1500 + (rnd(i) - .5) * 500; y = 560 + rnd(i, 2) * 200; a = .5 + .5 * math.sin(t * 3 + i)
        c.drawLine(x - 20, y, x + 20, y, fp('#FFF1C8', 200 * a))
    # encosta rochosa em primeiro plano
    p = skia.Path(); p.moveTo(-900, 700); p.lineTo(-100, 640); p.quadTo(300, 560, 620, 660); p.quadTo(900, 760, 1300, 780); p.quadTo(1700, 800, W + 900, 760)
    p.lineTo(W + 900, H + 600); p.lineTo(-900, H + 600); p.close(); shape(c, p, '#C79A5B')
    p2 = skia.Path(); p2.moveTo(-900, 860); p2.quadTo(400, 800, 1000, 880); p2.quadTo(1500, 940, W + 900, 900); p2.lineTo(W + 900, H + 600); p2.lineTo(-900, H + 600); p2.close(); shape(c, p2, '#A88050', LW * .7)
    oval(c, 120, 600, 330, 760, '#2A1E16', LW)  # gruta
    for (x, y, r) in ((480, 700, 60), (760, 760, 44), (1660, 840, 70), (1900, 880, 50), (60, 920, 80)):
        oval(c, x - r, y - r * .6, x + r, y + r * .5, '#9A948A', LW * .7)
    _arvore(c, 1450, 820, .8, '#6E7B4A'); _arvore(c, 1780, 830, .6, '#5E6B3A')
    for i in range(14):
        x = rnd(i, 8) * W; y = 800 + rnd(i, 9) * 200; c.drawOval(skia.Rect(x - 30, y - 16, x + 30, y + 10), fp('#6E7B4A'))


def fundo_patmos(c, t, dx=0):
    blur_begin(c, 12); c.save(); c.translate(dx, -260); c.scale(1.5, 1.5); patmos(c, t); c.restore(); c.restore()


# ---------------------------------------------------------------- a visão
def visao(c, t, luz=1.0):
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), sp(radial(960, 420, 1300, [hx('#6A4614'), hx('#2A1A08'), hx('#0B0806')], [0, .5, 1])))
    add_light(c, 960, 380, 700, '#FFD98A', 90 * luz)
    c.drawRect(skia.Rect(-900, 900, W + 900, H + 600), sp(linear(0, 900, 0, 1100, [hx('#3A2A14'), hx('#1A1208')])))
    for i in range(50):
        y = 1000 - (t * 22 + rnd(i, 5) * 1100) % 1100; x = rnd(i, 6) * W + 20 * math.sin(t + i)
        c.drawCircle(x, y, 1.5 + 3 * rnd(i, 7), fp('#FFD98A', 160))


LAMPS = [(330, 900, .78), (560, 830, .66), (760, 790, .58), (1160, 790, .58), (1360, 830, .66), (1590, 900, .78), (960, 770, .52)]


def candeeiro(c, x, y, s, t, i=0, treme=0.0):
    rect(c, x - 70 * s, y - 24 * s, x + 70 * s, y, '#C9962A', LW * .7, r=8)
    rect(c, x - 14 * s, y - 380 * s, x + 14 * s, y - 24 * s, '#E8B830', LW * .7, r=6)
    for k in (110, 230): oval(c, x - 30 * s, y - k * s - 10 * s, x + 30 * s, y - k * s + 10 * s, '#C9962A', LW * .5)
    p = skia.Path(); p.moveTo(x - 60 * s, y - 380 * s); p.lineTo(x + 60 * s, y - 380 * s); p.lineTo(x + 26 * s, y - 330 * s); p.lineTo(x - 26 * s, y - 330 * s); p.close(); shape(c, p, '#F0C850', LW * .7)
    fl = 1 + .08 * math.sin(t * 9 + i * 1.7) + treme * .25 * math.sin(t * 31 + i); fx = treme * 10 * math.sin(t * 17 + i)
    f = skia.Path(); fy = y - 380 * s; f.moveTo(x - 20 * s, fy); f.cubicTo(x - 24 * s, fy - 40 * s * fl, x + fx * s, fy - 70 * s * fl, x + fx * s, fy - 90 * s * fl); f.cubicTo(x + fx * s, fy - 70 * s * fl, x + 24 * s, fy - 40 * s * fl, x + 20 * s, fy); f.close()
    c.drawPath(f, fp('#FFB347')); add_light(c, x, fy - 40 * s, 150 * s, '#FFD27A', 200)


def candeeiros(c, t, n=7, k=1.0, treme=0.0):
    for i, (x, y, s) in enumerate(sorted(LAMPS, key=lambda v: v[1])):
        if i < n: candeeiro(c, x, y, s * min(1, back(K(k, i * .1, .3), 1.3)) if k < 1 else s, t, i, treme)


def filho(c, x, y, s, t, face=0.0, brilho=1.0, estrelas=True, espada=0.0, arms=('down', 'present'), tilt=0.0, olhos=1.0):
    add_light(c, x, y - 400 * s, 520 * s, '#FFE7B0', 140 * brilho)
    draw_char(c, x, y, s, FILHO, face=face, eyes='closed', mouth='flat', arms=arms, tilt=tilt, bob=2 + 2 * math.sin(t * 1.6), rim='#FFE6B0', light=0)
    # veste talar até os pés
    p = skia.Path(); p.moveTo(x - 62 * s, y - 150 * s); p.lineTo(x + 62 * s, y - 150 * s); p.lineTo(x + 78 * s, y - 14 * s); p.lineTo(x - 78 * s, y - 14 * s); p.close(); shape(c, p, '#F4F1E8', LW * .9)
    c.drawLine(x + 30 * s, y - 140 * s, x + 40 * s, y - 20 * s, ink(3, '#C8C2B0'))
    rect(c, x - 64 * s, y - 318 * s, x + 64 * s, y - 290 * s, '#E8B830', LW * .7, r=4)  # cinto de ouro à altura do peito
    for sx in (-1, 1):  # pés como bronze polido, refinado numa fornalha
        oval(c, x + sx * 40 * s - 30 * s, y - 20 * s, x + sx * 40 * s + 30 * s, y + 6 * s, BRONZE, LW * .6)
        add_light(c, x + sx * 40 * s, y - 6 * s, 60 * s, '#FF9A40', 170)
    hy = y + HEAD_CY * s - 2 * s  # rosto coberto pelo brilho (sem traços)
    c.drawCircle(x, hy, 140 * s, sp(radial(x, hy, 140 * s, [hx('#FFFFFF', int(250 * brilho)), hx('#FFF8E0', int(240 * brilho)), hx('#FFF0C0', 0)], [0, .74, 1])))
    add_light(c, x, hy, 260 * s, '#FFF2C8', 150 * brilho)
    for sx in (-1, 1):  # olhos como chama de fogo
        if olhos <= 0: break
        ex, ey = x + (sx * 32 + face * 30) * s, hy - 4 * s; f = skia.Path(); fl = 1 + .1 * math.sin(t * 11 + sx)
        f.moveTo(ex - 11 * s, ey + 8 * s); f.cubicTo(ex - 12 * s, ey - 8 * s * fl, ex, ey - 22 * s * fl, ex + 2 * s, ey - 26 * s * fl); f.cubicTo(ex + 6 * s, ey - 14 * s, ex + 12 * s, ey - 4 * s, ex + 11 * s, ey + 8 * s); f.close()
        c.drawPath(f, fp('#FF7A1A', 255 * olhos)); add_light(c, ex, ey - 6 * s, 30 * s, '#FFB040', 230 * olhos)
    if estrelas:  # sete estrelas na mão direita
        hxr, hyr = x + 208 * s, y - 338 * s if arms[1] == 'present' else y - 168 * s
        if arms[1] != 'present': hxr = x + 96 * s
        for i in range(7):
            a = t * .8 + i * 2 * math.pi / 7; sx, sy = hxr + 44 * s * math.cos(a), hyr - 30 * s + 16 * s * math.sin(a)
            add_light(c, sx, sy, 22 * s, '#FFFFFF', 255); c.drawCircle(sx, sy, 4.5 * s, fp('#FFFFFF'))
    if espada > 0:  # espada afiada de dois gumes, de luz, saindo da boca
        my = hy + 46 * s; L = 230 * s * ease_out(espada); b = skia.Path(); b.moveTo(x + 10 * s, my); b.lineTo(x + 10 * s + L * .5, my - 9 * s); b.lineTo(x + 10 * s + L, my); b.lineTo(x + 10 * s + L * .5, my + 9 * s); b.close()
        c.drawPath(b, fp('#FFFFFF', 255 * espada)); c.drawPath(b, fp('#CFE8FF', 200 * espada, blur=12, blend=skia.BlendMode.kPlus))


def joao(c, x, y, s, t, **kw):
    kw.setdefault('eyes', 'closed' if blink(t, 2.8) else 'dot'); kw.setdefault('rim', '#FFE6B0')
    c.drawOval(skia.Rect(x - 110 * s, y - 20 * s, x + 110 * s, y + 20 * s), fp((0, 0, 0), 90, blur=8))
    draw_char(c, x, y, s, JOAO, **kw)


def joao_ajoelhado(c, x, y, s, t, **kw):
    kw.setdefault('eyes', 'closed' if blink(t, 2.8) else 'dot')
    draw_char(c, x, y + 108 * s, s, JOAO, legs=((-24, 34, 108), (24, 34, 108)), **kw)


# ---------------------------------------------------------------- tomadas
def s_abre(c, t, S):
    fundo_patmos(c, t, -150)
    draw_char(c, 960, 1390, 2.15, JOAO, face=.35, eyes='closed' if blink(t, 2.6, .8) else 'wide', mouth='o', brow=.8, arms=('down', 'down'), bob=2 * math.sin(t * 1.4), rim='#FFE6B0')
    add_light(c, 1300, 250, 700, '#FFD98A', 90)
    x0, x1 = S.view[0], S.view[2]; w = (x1 - x0) * .88
    poplabel(c, "APOCALIPSE 1", 960, 190, t, S.s0 + .05, fit("APOCALIPSE 1", 130, w, MARKER), GOLDL, rot=-3, font=MARKER, stroke=16)
    txt = "O QUE JOÃO VIU EM PATMOS"; poplabel(c, txt, 960, 270, t, S.s0 + .5, fit(txt, 70, w, KALAM), '#FFFFFF', rot=-3, font=KALAM, stroke=12)


def s_titulo(c, t, S):
    ceu(c, t, .8)
    u = K(t, S.s0 + .2, 1.2); txt = "APOCALIPSE 1"; sz = fit(txt, 210, (S.view[2] - S.view[0]) * .8, MARKER)
    label(c, txt, 960, 560, sz, '#FFF4D8', font=MARKER, align='center', stroke=14, skew=0, alpha=u)
    label(c, "a revelação de Jesus Cristo", 960, 660, 64, GOLDL, font=FONT_HAND, align='center', stroke=8, skew=0, alpha=K(t, S.s0 + 1.0, .8))


def s_feixe(c, t, S):
    ceu(c, t, 1.0)
    k = K(t, S.s0, S.s1 - S.s0)
    for (y0, y1, a) in ((300, 700, 1), (700, 1100, K(t, S.at('n3'), .8)), (1100, 1500, K(t, S.at('n3+1.6'), .8))):
        if a <= 0: continue
        c.drawRect(skia.Rect(930, y0, 990, y0 + (y1 - y0) * a), sp(linear(0, y0, 0, y1, [hx('#FFFFFF', 220), hx('#FFF0C0', 140)]), blend=skia.BlendMode.kPlus, blur=14))
    if t > S.at('n3'):  # o anjo do v.1 não é desenhado: só um pulso no meio do feixe
        pu = math.sin(math.pi * K(t, S.at('n3+0.4'), 1.4)); add_light(c, 960, 900, 220 * pu + 1, '#FFFFFF', 220 * pu)


def s_patmos_longe(c, t, S):
    patmos(c, t)
    c.drawRect(skia.Rect(930, -600, 990, 700 * min(1, K(t, S.s0, .01))), sp(linear(0, -600, 0, 700, [hx('#FFFFFF', 160), hx('#FFF0C0', 0)]), blend=skia.BlendMode.kPlus, blur=16))
    joao(c, 600, 668, .42, t, face=.9, arms=('down', 'down'), bob=0)


def s_casa(c, t, S):
    c.drawRect(skia.Rect(-900, -600, W + 900, 800), fp('#D9C2A0')); c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#8E6A48'))
    for x in range(-200, 2200, 520): rect(c, x, 0, x + 60, 800, '#7A5A3C', LW * .6)
    rect(c, -900, 60, W + 900, 120, '#6B4A32', LW * .8)
    for (lx, ly) in ((360, 520), (1500, 500)): oval(c, lx - 50, ly - 14, lx + 50, ly + 14, '#B5652E', LW * .6)
    leitor_x = 1180
    draw_char(c, leitor_x, 1000, 1.05, LEITOR, face=-.5, eyes='closed' if blink(t, 2.4) else 'dot', mouth=('mid' if int(t * 6) % 2 else 'flat'), arms=('hold', 'hold'), bob=2)
    rect(c, leitor_x - 110, 740, leitor_x + 60, 800, '#F2E6C8', LW * .6, r=6)
    for i, (x, f) in enumerate(((520, .6), (760, .5), (960, .45))):
        draw_char(c, x, 1040, .92, OUV[i], face=f, eyes='closed' if (i == 0 or blink(t, 2.6, i)) else 'dot', mouth='flat', arms=('down', 'down'), bob=1.5 * math.sin(t * 2 + i), tilt=4 if i == 1 else 0)
    night(c, [('pool', 360, 500, 520, .95), ('pool', 1500, 480, 560, .95), ('pool', 1100, 760, 420, .7)], '#4A3A6A')
    for (lx, ly) in ((360, 496), (1500, 476)):
        f = 1 + .1 * math.sin(t * 10 + lx); c.drawOval(skia.Rect(lx - 9, ly - 34 * f, lx + 9, ly), fp('#FFC060')); add_light(c, lx, ly - 20, 180, '#FFC870', 190)


CIDADES = [("Éfeso", 880, 700), ("Esmirna", 840, 520), ("Pérgamo", 900, 290), ("Tiatira", 1090, 380), ("Sardes", 1170, 560), ("Filadélfia", 1340, 630), ("Laodiceia", 1500, 800)]


def mapa(c, t, t0, dt=.5, nomes=True):
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#3B2A1C'))
    rect(c, 120, 60, 1800, 1020, '#E8D5A8', LW, r=12)
    c.drawRect(skia.Rect(140, 80, 1780, 1000), fp('#9FB8C0', 120))
    p = skia.Path(); p.moveTo(780, 80)
    for (x, y) in ((760, 200), (820, 260), (760, 380), (800, 450), (760, 560), (830, 640), (790, 760), (860, 840), (820, 960), (900, 1000)): p.lineTo(x, y)
    p.lineTo(1780, 1000); p.lineTo(1780, 80); p.close(); shape(c, p, '#D8C08A', LW * .6)
    oval(c, 520, 800, 570, 860, '#D8C08A', LW * .5); label(c, "Patmos", 545, 900, 40, '#5A3A1C', font=KALAM, align='center', skew=0)
    label(c, "ÁSIA", 1450, 300, 70, '#8A6A3C', font=MARKER, align='center', skew=0, alpha=.6)
    pts = []
    for i, (n, x, y) in enumerate(CIDADES):
        k = K(t, t0 + i * dt, .3); pts.append((x, y))
        if k > 0 and i > 0:
            x0, y0 = pts[i - 1]; steps = 14
            for j in range(int(steps * k)): u = j / steps; c.drawCircle(lerp(x0, x, u), lerp(y0, y, u), 4, fp('#8C2A1C'))
        circ(c, x, y, 14, '#FFD27A' if k > 0 else '#8A6A3C', 3)
        if k > 0: add_light(c, x, y, 80 * pop(k), '#FFD27A', 200)
        if nomes and k > 0: label(c, n, x + 26, y + 12, 44, '#3B2410', font=KALAM, skew=0, alpha=k)


def s_mapa(c, t, S): mapa(c, t, S.at('n7+0.6'), .32)


def s_graca(c, t, S):
    ceu(c, t, .9 + .2 * math.sin(math.pi * K(t, S.at('n8+1.2'), 1.6)), sete=t - S.at('n9+0.4'))


def s_titulos(c, t, S):
    ceu(c, t, 1.0, sete=10)
    x0, y0, x1, y1 = S.view
    for j, (txt, at) in enumerate((("A FIEL TESTEMUNHA", 'n10+1.4'), ("O PRIMOGÊNITO DOS MORTOS", 'n10+2.9'), ("O SOBERANO DOS REIS DA TERRA", 'n10+4.6'))):
        sz = fit(txt, 74, (x1 - x0) * .86, KALAM); poplabel(c, txt, 960, 720 + j * 100, t, S.at(at), sz, GOLDL, rot=0, font=KALAM, stroke=10)


def s_louvor(c, t, S):
    ti = math.sin(math.pi * K(t, S.at('n11+1.4'), 2.6)); br = .9 + .5 * K(t, S.at('n12'), 4)
    ceu(c, t, br, sete=10, tinta=ti)
    for i in range(int(80 * K(t, S.at('n12'), 3))):
        y = 1100 - ((t - S.at('n12')) * 160 + rnd(i, 3) * 900) % 1100; x = rnd(i, 4) * W
        c.drawCircle(x, y, 3 + 3 * rnd(i, 5), fp('#FFE08A', 220)); add_light(c, x, y, 16, '#FFE08A', 120)


def s_nuvens(c, t, S):
    k = K(t, S.s0, 4)
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), sp(linear(0, -200, 0, 900, [hx('#2A2A4A'), hx('#6A5A7A'), hx('#C9A070')])))
    add_light(c, 960, 260, 300 + 700 * k, '#FFF4D0', 230)
    for i in range(14):  # nuvens se abrindo
        side = -1 if i % 2 else 1; x = 960 + side * (120 + rnd(i) * 500 + 700 * k); y = 160 + rnd(i, 2) * 380
        cloud(c, x, y, 1.6 + rnd(i, 3) * 1.4, '#7A6A8A' if k < .5 else '#C9B8A8', 240)
    c.drawCircle(960, 260, 26, fp('#FFFFFF')); add_light(c, 960, 260, 120, '#FFFFFF', 255)  # figura distante, sem detalhes
    for row, (yb, sc_, colr) in enumerate(((760, .55, '#3A3048'), (860, .75, '#2A2236'), (990, 1.0, '#1A1424'))):
        hill = skia.Path(); hill.moveTo(-900, yb + 40 * sc_); hill.quadTo(960, yb - 80 * sc_, W + 900, yb + 40 * sc_); hill.lineTo(W + 900, H + 600); hill.lineTo(-900, H + 600); hill.close(); c.drawPath(hill, fp(colr))
        n = int(34 / sc_)
        for i in range(n):
            x = -200 + (i + rnd(i, row)) * (2320 / n); yy = yb - 6 * sc_ + 30 * sc_ * (abs(x - 960) / 960) ** 2
            up = K(t, S.s0 + .5 + rnd(i, row + 9) * 2.5, .6); hs = 26 * sc_
            c.drawRoundRect(skia.Rect(x - hs * 1.1, yy - hs * 2.8, x + hs * 1.1, yy + 40), hs, hs, fp(colr))
            hy = yy - hs * 3.6 - 6 * up; c.drawCircle(x, hy, hs, fp(colr))
            if t > S.at('n14') and rnd(i, row + 3) < .35:  # alguns cobrem o rosto, em lamento
                c.drawRoundRect(skia.Rect(x - hs * .9, hy - hs * .2, x + hs * .9, hy + hs * .7), 8, 8, fp(escurecer(colr, .7)))
    add_light(c, 960, 700, 900, '#FFE8B0', 50 * k)


def omega(c, x, y, s, a):
    p = skia.Path(); p.addArc(skia.Rect(x - 90 * s, y - 200 * s, x + 90 * s, y - 20 * s), 125, 290)
    c.drawPath(p, ink(22 * s, '#FFF4D8', 255 * a)); c.drawLine(x - 120 * s, y - 20 * s, x - 50 * s, y - 20 * s, ink(22 * s, '#FFF4D8', 255 * a)); c.drawLine(x + 50 * s, y - 20 * s, x + 120 * s, y - 20 * s, ink(22 * s, '#FFF4D8', 255 * a))


def s_alfa(c, t, S):
    pu = .9 + .3 * (1 if (S.v.mouth('d1', t) or S.v.mouth('d2', t)) else 0)
    ceu(c, t, pu, sete=10)
    a1 = K(t, S.at('d1+0.4'), .4); a2 = K(t, S.at('d1+1.2'), .4); fade = 1 - K(t, S.at('d2:fim'), .6)
    ax, ay, ox, oy = (960, 470, 960, 900) if S.vertical else (620, 640, 1300, 640)
    label(c, "A", ax, ay, 260, '#FFF4D8', font=MARKER, align='center', skew=0, alpha=a1 * fade); add_light(c, ax, ay - 100, 220, '#FFF4D8', 120 * a1 * fade)
    omega(c, ox, oy, 1.2, a2 * fade); add_light(c, ox, oy - 100, 220, '#FFF4D8', 120 * a2 * fade)


def s_caminha(c, t, S):
    patmos(c, t)
    wk = K(t, S.at('n16'), 9.0); x = lerp(1200, 620, ease(wk)); ph = (t - S.at('n16')) * 7; walking = wk < .98
    joao(c, x, 760 - 60 * (1 - abs(x - 620) / 580) * 0, 1.0, t, face=-.6 if walking else .5, arms=('down', 'down'), mouth='flat',
         legs=walk_legs(ph) if walking else None, bob=5 * abs(math.sin(ph)) if walking else 2 * math.sin(t * 1.5), tilt=2 * math.sin(ph) if walking else 0)


def s_ora(c, t, S):
    fundo_patmos(c, t, -150); k = K(t, S.at('n18+0.6'), 1.4)
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#FFD98A', 70 * k, blend=skia.BlendMode.kPlus))
    draw_char(c, 960, 1390, 2.15, JOAO, face=.2, eyes='closed', mouth='flat', arms=('chin', 'chin'), bob=2 * math.sin(t * 1.4), rim='#FFE6B0')
    add_light(c, 1300, 300, 600, '#FFD98A', 60 + 60 * k)


def s_voz(c, t, S):
    fundo_patmos(c, t, -150); hit = S.at('n19+1.6'); k = K(t, hit, .2)
    draw_char(c, 960, 1390, 2.15, JOAO, face=.2, eyes='wide' if t > hit else 'closed', mouth='o' if t > hit else 'flat', brow=1.0 * k,
              arms=('chin', ('chin', 'down', K(t, hit, .3))), squash=.06 * math.sin(K(t, hit, .3) * math.pi), sweat=(t - hit) * .6 if t > hit else -1, rim='#FFE6B0')
    if t > hit:  # rajada de vento: poeira levantando
        for i in range(60):
            u = (t - hit) * (1.5 + rnd(i)) + rnd(i, 2); x = -200 + (u * 900) % 2400; y = 1080 - rnd(i, 3) * 700 - 60 * math.sin(u * 3)
            c.drawCircle(x, y, 3 + 5 * rnd(i, 4), fp('#E8D0A0', 150))


def s_rolo(c, t, S):
    table_top(c)
    k = back(K(t, S.s0 + .1, .6), 1.2)
    rect(c, 560, lerp(1300, 170, k), 1360, lerp(2100, 910, k), '#F2E2B8', LW, r=6)
    for yy in (lerp(1300, 170, k), lerp(2100, 910, k)): rect(c, 520, yy - 26, 1400, yy + 26, '#C9A66A', LW * .8, r=26)
    sleeve(c, 200, 1100, 600, lerp(1500, 800, k), 160, '#C9B48A', cuff='#B59E70', skin='#A8734F')
    sleeve(c, 1720, 1100, 1320, lerp(1500, 800, k), 160, '#C9B48A', cuff='#B59E70', skin='#A8734F')
    t0 = S.at('j2'); dur = S.v.fala_util('j2')
    for i, (n, _, _) in enumerate(CIDADES):
        a = K(t, t0 + dur * i / 7, .35)
        if a > 0:
            label(c, n, 960, 260 + i * 92, 70, '#7A4A10', font=FONT_HAND, align='center', skew=0, alpha=a)
            add_light(c, 960, 240 + i * 92, 160, '#FFD27A', 90 * a * (1 - K(t, t0 + dur * i / 7 + .3, .6)))


def s_volta(c, t, S):
    tv = K(t, S.at('n20+0.6'), 2.0); dis = K(t, S.at('n21'), 1.6)
    patmos(c, t)
    if dis > 0:
        c.saveLayer(None, fp((0, 0, 0), 255 * dis)); visao(c, t); candeeiros(c, t, k=K(t, S.at('n21+0.4'), 1.4) * 1.0); c.restore()
    joao(c, 960, 1000, 1.0, t, face=lerp(-.7, .7, ease(tv)), arms=('down', 'down'), mouth='o' if dis > .3 else 'flat', eyes='wide' if dis > .3 else ('closed' if blink(t, 2.8) else 'dot'))


def s_revela(c, t, S):
    visao(c, t); candeeiros(c, t)
    filho(c, 960, 980, 1.15, t, estrelas=False, arms=('down', 'down'), brilho=.6 + .4 * K(t, S.s0, 5))


def s_cabeca(c, t, S):
    blur_begin(c, 10); visao(c, t); candeeiros(c, t); c.restore()
    filho(c, 960, 1560, 2.6, t, estrelas=False, arms=('down', 'down'), olhos=K(t, S.at('n23+4.0'), .5))


def s_pes(c, t, S):
    visao(c, t); candeeiros(c, t, treme=K(t, S.at('n24+4.0'), .6))
    filho(c, 960, 980, 1.15, t, estrelas=False, arms=('down', 'down'))
    if t > S.at('n24+4.0'):  # voz como de muitas águas: ondas de luz
        for j in range(3):
            r = ((t - S.at('n24+4.0')) * 260 + j * 200) % 600; c.drawCircle(960, 560, 120 + r, ink(5, '#FFE6B0', 140 * (1 - r / 600)))


def s_estrelas(c, t, S):
    visao(c, t); candeeiros(c, t)
    filho(c, 960, 980, 1.15, t, arms=('down', 'present'), espada=K(t, S.at('n25+3.4'), .5))


def s_sol(c, t, S):
    k = K(t, S.at('n26+0.6'), 2.4)
    visao(c, t); candeeiros(c, t); filho(c, 960, 1300, 1.8, t, arms=('down', 'present'), brilho=1 + k)
    add_light(c, 960, 1300 + HEAD_CY * 1.8, 300 + 1400 * k, '#FFFFFF', 255 * k)
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#FFFFFF', 200 * k * k))


def s_cai(c, t, S):
    visao(c, t); candeeiros(c, t)
    filho(c, 700, 900, 1.0, t, arms=('down', 'present'))
    k = ease(K(t, S.at('n27+0.8'), 1.2)); x, y = 1180, 960
    c.save(); c.translate(x, y); c.rotate(-86 * k); c.translate(-x, -y)
    draw_char(c, x, y, 1.0, dict(JOAO, bengala=False), face=-.6, eyes='wide' if k < .5 else 'closed', mouth='o', arms=('down', ('down', 'push', k)))
    c.restore()
    if k > 0: line(c, lerp(1260, 1420, k), lerp(980, 990, k), lerp(1260, 1640, k), lerp(600, 980, k), 9, '#7A5A3C')  # cajado no chão


def joao_caido(c, t, rosto=0.0):
    x, y = 1180, 960; c.save(); c.translate(x, y); c.rotate(-86 * (1 - rosto * .35)); c.translate(-x, -y)
    draw_char(c, x, y, 1.0, dict(JOAO, bengala=False), face=-.6, eyes='closed' if rosto < .3 else 'dot', mouth='flat', arms=('down', 'push'), brow=.6 * rosto)
    c.restore(); line(c, 1420, 990, 1640, 980, 9, '#7A5A3C')


def s_mao(c, t, S):
    visao(c, t); candeeiros(c, t)
    k = K(t, S.at('n28+0.6'), 1.2)
    filho(c, 820, 900, 1.0, t, arms=('down', ('present', 'push', k)), tilt=-6 * k)
    joao_caido(c, t, K(t, S.at('n28:fim-0.4'), 1.0) * .3)


def s_nao_temas(c, t, S):
    blur_begin(c, 12); visao(c, t); candeeiros(c, t); c.restore()
    calma = K(t, S.at('j3+2.0'), 4.0)
    draw_char(c, 1060, 1390, 2.0, JOAO, face=-.6, eyes=('closed' if blink(t, 3.1) else 'wide' if calma < .3 else 'dot'), mouth='o' if calma < .3 else 'smile',
                   brow=lerp(1.0, 0.2, calma), brow_tilt=-.5 * (1 - calma), arms=('down', 'down'), sweat=1.2 - calma * 2, rim='#FFE6B0', pupil=-1)
    hx_, hy_ = 870, 800  # mão direita sobre o ombro
    sleeve(c, 260, -120, hx_, hy_, 105, '#F4F1E8', cuff='#E8B830', skin='#E8D2B0')
    add_light(c, hx_, hy_, 300, '#FFE6B0', 120); add_light(c, 300, 200, 700, '#FFE6B0', 100)


def s_escreve(c, t, S):
    visao(c, t); candeeiros(c, t)
    filho(c, 820, 900, 1.0, t, arms=('down', 'present'))
    joao_ajoelhado(c, 1260, 960, 1.0, t, face=-.6, mouth='flat', arms=('hold', 'hold'))
    rect(c, 1190, 830, 1330, 872, '#F2E2B8', LW * .6, r=6)


def s_misterio(c, t, S):
    visao(c, t); candeeiros(c, t)
    filho(c, 960, 980, 1.15, t, arms=('down', 'present'))
    hxr, hyr = 960 + 208 * 1.15, 980 - 338 * 1.15 - 30 * 1.15; t0 = S.at('j7+0.3'); dur = S.v.fala_util('j7') * .6
    for i, (x, y, s) in enumerate(sorted(LAMPS, key=lambda v: v[0])):
        a = K(t, t0 + dur * i / 7, .4)
        if a <= 0: continue
        fx, fy = x, y - 380 * s - 50 * s; c.drawLine(hxr, hyr, lerp(hxr, fx, a), lerp(hyr, fy, a), ink(4, '#FFF4D8', 220))
        add_light(c, lerp(hxr, fx, a), lerp(hyr, fy, a), 50, '#FFFFFF', 200)
    if t > S.at('j7:fim+0.2'):  # a visão se recolhe
        k = K(t, S.at('j7:fim+0.2'), .5); c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#FFFFFF', 255 * k))


def s_fim(c, t, S):
    patmos(c, t)
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#FFFFFF', 255 * (1 - K(t, S.s0, .6))))
    oval(c, 820, 900, 1100, 980, '#9A948A', LW * .7)
    draw_char(c, 960, 1000, 1.0, dict(JOAO, bengala=False), face=.4, eyes='closed' if blink(t, 2.9) else 'dot', mouth='flat', arms=('hold', 'hold'), bob=1)
    rect(c, 980, 740, 1100, 790, '#F2E2B8', LW * .6, r=6); c.drawLine(1040, 760, 1040 + 30 * math.sin(t * 6), 730, ink(4, '#3B2A20'))
    a = K(t, S.at('n29'), .6); x0, x1 = S.view[0], S.view[2]
    sz = fit("CONTINUA EM APOCALIPSE 2", 96, (x1 - x0) * .8, MARKER)
    label(c, "CONTINUA EM APOCALIPSE 2", 960, 230, sz, '#FFF4D8', font=MARKER, align='center', stroke=12, skew=0, alpha=a)


V = lambda f, z=(1.0, 1.08): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_abre, falas=['n1'], **V((960, 420), (1.0, 1.06))),
    dict(draw=s_feixe, falas=['n2'], **V(((960, 300), (960, 560)), (1.0, 1.1))),
    dict(draw=s_feixe, falas=['n3'], **V(((960, 520), (960, 900)), (1.0, 1.0))),
    dict(draw=s_patmos_longe, falas=['n4'], tag="ILHA DE PATMOS", **V(((960, 520), (620, 560)), (1.0, 1.35))),
    dict(draw=s_casa, falas=['n5'], **V(((520, 640), (960, 640)), (1.1, 1.15))),
    dict(draw=s_casa, falas=['n6'], **V((1180, 600), (1.2, 1.32))),
    dict(draw=s_mapa, falas=['n7'], **V(((900, 680), (1250, 520)), (.8, .82))),
    dict(draw=s_graca, falas=['n8'], **V((960, 540), (1.0, 1.12))),
    dict(draw=s_graca, falas=['n9'], **V((960, 470), (.75, .85))),
    dict(draw=s_titulos, falas=['n10'], **V((960, 700), (.9, .96))),
    dict(draw=s_louvor, falas=['n11'], **V((960, 480), (1.15, 1.0))),
    dict(draw=s_louvor, falas=['n12'], **V(((960, 760), (960, 380)), (1.25, 1.0))),
    dict(draw=s_nuvens, falas=['n13'], **V(((960, 820), (960, 460)), (1.2, 1.0))),
    dict(draw=s_nuvens, falas=['n14'], **V((760, 820), (1.3, 1.4))),
    dict(draw=s_alfa, falas=['d1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_alfa, falas=['n15'], **V((960, 480), (1.1, 1.15))),
    dict(draw=s_alfa, falas=['d2'], **V((960, 720), (1.05, 1.0))),
    dict(draw=s_caminha, falas=['n16'], tag="PATMOS", **V(((1180, 560), (960, 560)), (1.1, 1.15))),
    dict(draw=s_caminha, falas=['n17'], **V(((900, 540), (660, 520)), (1.35, 1.45))),
    dict(draw=s_ora, falas=['n18'], **V((960, 460), (1.0, 1.1))),
    dict(draw=s_voz, falas=['n19'], shake=['n19+1.6'], sfx=[('boom', 'n19+1.6', .9)], **V((960, 470), (1.12, 1.0))),
    dict(draw=s_rolo, falas=['j1'], sfx=[('paper', 0.1, .8)], **V((960, 560), (.75, .8))),
    dict(draw=s_rolo, falas=['j2'], **V(((960, 380), (960, 620)), (.85, .85))),
    dict(draw=s_volta, falas=['n20'], **V((960, 560), (1.45, 1.3))),
    dict(draw=s_volta, falas=['n21'], sfx=[('brilho', 'n21+0.4', .7)], **V((960, 600), (1.1, .8))),
    dict(draw=s_revela, falas=['n22'], **V(((960, 900), (960, 520)), (1.9, 1.0))),
    dict(draw=s_cabeca, falas=['n23'], **V((960, 470), (1.0, 1.08))),
    dict(draw=s_pes, falas=['n24'], **V(((960, 900), (960, 560)), (1.9, 1.0))),
    dict(draw=s_estrelas, falas=['n25'], sfx=[('brilho', 0.3, .6)], **V(((1190, 560), (1010, 480)), (1.8, 1.4))),
    dict(draw=s_sol, falas=['n26'], **V((960, 470), (1.0, 1.12))),
    dict(draw=s_cai, falas=['n27'], sfx=[('thud', 'n27+1.9', .8)], **V(((760, 560), (1120, 780)), (1.1, 1.0))),
    dict(draw=s_mao, falas=['n28'], **V(((820, 520), (1020, 760)), (1.0, 1.2))),
    dict(draw=s_nao_temas, falas=['j3'], **V((960, 680), (1.0, 1.05))),
    dict(draw=s_nao_temas, falas=['j4'], **V((1060, 560), (1.15, 1.22))),
    dict(draw=s_escreve, falas=['j5'], **V(((820, 560), (1260, 640)), (1.1, 1.15))),
    dict(draw=s_misterio, falas=['j6'], **V(((1180, 520), (960, 560)), (1.6, 1.1))),
    dict(draw=s_misterio, falas=['j7'], **V((960, 600), (.75, .8))),
    dict(draw=s_fim, falas=['n29'], hold=.3, **V((960, 540), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
