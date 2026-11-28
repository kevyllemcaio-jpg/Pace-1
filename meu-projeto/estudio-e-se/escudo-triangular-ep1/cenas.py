import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
_load('vidabase', os.path.expanduser('~/vid/vida/cenas.py'))
from xpbase import lider, painel, linhas_velocidade, impacto, faiscas, tint, pisca, head, sombra, MAGA, ARQ

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {'kai': dict(corpo='homem', skin='#E0AC69', top='tee', suit='#4E7A3E', print='#C9A227', hair='short', hair_col='#5A3A22')})
KAI = EL['kai']
LOBO = dict(especie='cachorro', skin='#4E5565', figurante=True)
POVO = [dict(corpo='homem', skin='#F1C27D', top='tee', suit='#B23A48', print='#F4EFE2', hair='curly', hair_col='#2A1A14', figurante=True),
        dict(corpo='mulher', skin='#8D5524', top='dress', suit='#3E6FA8', print='#F2C14E', hair='bun', hair_col='#1C1B22', figurante=True),
        dict(corpo='homem', skin='#E6BE8E', top='colete', suit='#7A5A3C', shirt='#F4EFE2', hair='slick', hair_col='#C68E3A', figurante=True),
        dict(corpo='mulher', skin='#F1C27D', top='blouse', suit='#8338EC', shirt='#F4EFE2', hair='rabo', hair_col='#8B5A2B', figurante=True)]
kit.DESTAQUES = ['INÚTIL', 'FORTE', 'VALDORA', 'PEDRA', 'ESPADA', 'LANÇA', 'CAJADO', 'KAI', 'ESCUDO', 'TRIANGULAR', 'RACHADO', 'RIU', 'MONSTRO', 'RAZÃO', 'VERDADE', 'DUZENTOS', 'LEVE', 'PONTA', 'DEFENDER', 'FLORESTA', 'LOBO', 'VOOU', 'DUAS', 'JANELA', 'REFLEXO', 'DOBRO', 'ENORME', 'GIGANTE', 'PARTE']


def escudo(c, x, y, s, rot=0, brilho=0.0, racha=True):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    if brilho: add_light(c, 0, 0, 260, '#BFF4FF', 200 * brilho)
    p = skia.Path(); p.moveTo(-100, -120); p.quadTo(0, -140, 100, -120); p.quadTo(110, 20, 0, 140); p.quadTo(-110, 20, -100, -120); p.close()
    c.drawPath(p, fp('#AEB6C2')); c.drawPath(p, ink(LW * 1.2))
    q = skia.Path(); q.moveTo(-78, -102); q.quadTo(0, -118, 78, -102); q.quadTo(86, 14, 0, 112); q.quadTo(-86, 14, -78, -102); q.close(); c.drawPath(q, ink(8, '#C9A227'))
    circ(c, 0, -20, 26, '#C9A227', 4)
    if racha: pr = skia.Path(); pr.moveTo(-20, -112); pr.lineTo(8, -60); pr.lineTo(-12, -10); pr.lineTo(14, 50); c.drawPath(pr, ink(5, '#3A3A44'))
    c.restore()
def kai(c, x, y, s, t, com_escudo=True, brilho=0.0, **kw):
    kw.setdefault('eyes', pisca(t)); kw.setdefault('arms', ('hold', 'down'))
    draw_char(c, x, y, s, KAI, **kw)
    if com_escudo:
        a = kw['arms'][0]; nm = a if isinstance(a, str) else (a[1] if a[2] > .5 else a[0]); hx_, hy_ = ARM[nm][1]
        escudo(c, x - 70 * s, y - 250 * s, .95 * s, rot=-8, brilho=brilho)
def praca(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), sp(linear(0, -300, 0, 800, [hx('#6FB3E8'), hx('#D8EEFA')])))
    cloud(c, 400 + t * 8, 140, 1.0, '#FFFFFF'); cloud(c, 1400 + t * 5, 100, .8, '#FFFFFF')
    rect(c, 820, 80, 1100, 520, '#9AA3B5', LW); poly(c, [(800, 90), (960, -60), (1120, 90)], '#3E6FA8', LW)  # torre do castelo
    for (x0, cor, tel) in ((-120, '#F2E6CF', '#B23A48'), (260, '#EADBC2', '#8B5A2B'), (1240, '#F2E6CF', '#7A3B5E'), (1620, '#EADBC2', '#B23A48')):
        rect(c, x0, 300, x0 + 340, 800, cor, LW); poly(c, [(x0 - 20, 310), (x0 + 170, 160), (x0 + 360, 310)], tel, LW)
        for wx in (x0 + 50, x0 + 210): rect(c, wx, 420, wx + 80, 520, '#8ECAE6', LW * .7)
        line(c, x0, 560, x0 + 340, 560, 8, '#6B4A32')
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#C9B99A'))
    for j, y in enumerate(range(820, 1200, 50)):
        for x in range(-900 + (j % 2) * 50, W + 900, 100): rect(c, x + 3, y + 3, x + 97, y + 47, '#B8A888', 2, r=10)
def pedra(c, t, x=960, y=1000, brilho=1.0):
    add_light(c, x, y - 220, 360, '#BFF4FF', 110 * brilho)
    p = skia.Path(); p.moveTo(x - 220, y); p.quadTo(x - 230, y - 200, x - 120, y - 280); p.quadTo(x, y - 340, x + 130, y - 270); p.quadTo(x + 230, y - 180, x + 220, y); p.close(); shape(c, p, '#8D8A96')
    for i in range(5): line(c, x - 150 + i * 70, y - 220 + (i % 2) * 30, x - 120 + i * 70, y - 80, 4, '#6F6A78')
    for i in range(4): a = t * 1.5 + i * 1.57; c.drawCircle(x + math.cos(a) * 180, y - 200 + math.sin(a) * 60, 7, fp('#BFF4FF', 220))
def espada(c, x, y, s, rot=0, cor='#DCE3EA'):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); rect(c, -14, -220, 14, 0, cor, 4, r=6); rect(c, -60, 0, 60, 20, '#C9A227', 4, r=6); rect(c, -12, 20, 12, 90, '#5A3A22', 4, r=6); c.restore()
def lanca(c, x, y, s, rot=0):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); line(c, 0, -300, 0, 120, 14, '#8B5A2B'); poly(c, [(-24, -300), (0, -380), (24, -300)], '#DCE3EA', 4); c.restore()
def cajado(c, x, y, s, rot=0):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); line(c, 0, -280, 0, 120, 14, '#6B4A32'); circ(c, 0, -300, 36, '#C77DFF', 4); add_light(c, 0, -300, 120, '#C77DFF', 150); c.restore()
def floresta(c, t, escura=0.0):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), sp(linear(0, -300, 0, 800, [hx('#7CC4E8'), hx('#DDF2E2')])))
    for i in range(16): x = -400 + i * 190; _a = (x * 37) % 3; c.drawRect(skia.Rect(x, 200, x + 50, 820), fp('#6E4A2C')); c.drawCircle(x + 25, 230 + _a * 30, 160, fp(['#3D8F44', '#4FA84F', '#2F7A3A'][int(_a)]))
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#5FA84A')); line(c, -900, 800, W + 900, 800, LW * .6)
    for i in range(30): x = -400 + (i * 97) % 2700; c.drawOval(skia.Rect(x, 880 + (i % 4) * 40, x + 70, 910 + (i % 4) * 40), fp('#4E9440'))
    if escura: tint(c, '#0A1020', .55 * escura)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    blur_begin(c, 12); praca(c, t); c.restore()
    kai(c, 960, 1420, 2.2, t, face=0, mouth='flat', eyes='half', arms=('down', 'down'), com_escudo=False)
    escudo(c, 960, 1180, 1.6, rot=-6)
def s_a2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); linhas_velocidade(c, 960, 560, t, .7, '#BFF4FF'); escudo(c, 960, 560, 2.2, rot=math.sin(t * 2) * 6, brilho=1)
def s_b1(c, t, S):
    praca(c, t); pedra(c, t)
    for i, sp_ in enumerate(POVO): draw_char(c, 360 + i * 120 + (700 if i > 1 else 0), 1030, .8, sp_, face=0, eyes=pisca(t, i))
def s_b2(c, t, S):
    praca(c, t); pedra(c, t); d = S.v.fala_util('b2')
    if t > S.s0 + .05: espada(c, 760, 760 - 60 * K(t, S.s0, .4), 1.2, -10)
    if t > S.s0 + d * .33: lanca(c, 960, 760 - 60 * K(t, S.s0 + d * .33, .4), 1.0, 4)
    if t > S.s0 + d * .66: cajado(c, 1160, 760 - 60 * K(t, S.s0 + d * .66, .4), 1.0, 10)
def s_b3(c, t, S):
    praca(c, t); pedra(c, t, brilho=1 + K(t, S.s0, .5)); kai(c, 1180, 1030, 1.0, t, face=-.6, eyes='wide', mouth='o', arms=('push', 'down'), com_escudo=False)
    escudo(c, 960, lerp(860, 640, back(K(t, S.s0 + .3, .5), 1.4)), 1.0, brilho=K(t, S.s0 + .3, .3))
def s_b4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); add_light(c, 960, 520, 500, '#FFF2C8', 100)
    escudo(c, 960, 560, 2.6, rot=math.sin(t * 1.5) * 4); poplabel(c, "RACHADO", 960, 980, t, S.at('b4') + S.v.fala_util('b4') * .6, 90, '#FF5F5F', font=INTER_K)
def s_b5(c, t, S):
    praca(c, t)
    for i, sp_ in enumerate(POVO):
        x = 520 + i * 240; draw_char(c, x, 1030, .9, sp_, face=0, eyes='closed', mouth='open' if int(t * 8 + i) % 2 else 'smile', arms=('hip', 'down'), bob=5 * abs(math.sin(t * 9 + i)))
    for i in range(3): poplabel(c, "HAHA", 600 + i * 360, 300 + (i % 2) * 80, t, S.s0 + i * .15, 70, '#FFFFFF', font=INTER_K)
def s_b6(c, t, S):
    praca(c, t); lider(c, 1200, 1030, 1.05, t, face=.7, eyes='half', mouth='smirk', arms=('hip', 'hip'))
    kai(c, 700, 1030, .95, t, face=.6, eyes='half', mouth='flat')
def pergaminho(c, S, t):
    x0, y0, x1, y1 = S.view; cx = (x0 + x1) / 2
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#3B2A1C')); rect(c, cx - 270, 180, cx + 270, 960, '#E8D5A8', LW, r=10)
    for yy in (180, 960): rect(c, cx - 300, yy - 26, cx + 300, yy + 26, '#C9A66A', LW * .8, r=26)
def s_c1(c, t, S): blur_begin(c, 10); praca(c, t); c.restore(); kai(c, 960, 1300, 1.9, t, face=0, eyes='half', mouth='flat', brow=.4, brow_tilt=-.4)
def s_c2(c, t, S):
    pergaminho(c, S, t); escudo(c, 960, 520, 1.7, racha=False)
    poplabel(c, "~1200", 960, 860, t, S.s0 + .6, 90, '#7A3B1A', font=INTER_K, stroke=0)
def s_c3(c, t, S):
    pergaminho(c, S, t); escudo(c, 960, 560, 1.6, racha=False); u = K(t, S.s0 + .3, .9)
    ex, ey = lerp(760, 960, min(u * 2, 1)), lerp(240, 400, min(u * 2, 1))
    if u > .5: ex, ey = lerp(960, 1160, (u - .5) * 2), lerp(400, 820, (u - .5) * 2)
    espada(c, ex, ey, .7, 140)
def s_c4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); escudo(c, 960, 560, 2.2, racha=False)
    poplabel(c, "DEFESA", 960, 300, t, S.s0 + .1, 90, '#38D6FF', font=INTER_K); poplabel(c, "ATAQUE: 0", 960, 400, t, S.s0 + .7, 70, '#FF5F5F', font=INTER_K)
def s_d1(c, t, S):
    floresta(c, t); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 7
    kai(c, lerp(500, 900, u), 1000, 1.0, t, face=.7, mouth='flat', legs=walk_legs(ph), bob=4 * abs(math.sin(ph)), arms=('hold', 'down'))
def s_d2(c, t, S):
    floresta(c, t); u = K(t, S.s0, .7); kai(c, 760, 1000, 1.0, t, face=.6, eyes='wide', mouth='o')
    c.save(); c.translate(lerp(1500, 1050, u), 1000 - 220 * math.sin(math.pi * u)); c.rotate(-15); draw_char(c, 0, 0, 1.0, LOBO, face=-.7, eyes='half', mouth='open', arms=('gesture', 'gesture')); c.restore()
def s_d3(c, t, S):
    blur_begin(c, 10); floresta(c, t); c.restore(); kai(c, 960, 1350, 1.9, t, face=.2, eyes='half', mouth='flat', arms=(('down', 'hold', K(t, S.s0, .25)), 'down'))
def s_d4(c, t, S):
    floresta(c, t); hit = S.s0 + .35; kai(c, 760, 1000, 1.0, t, face=.6, eyes='half', mouth='flat', brilho=K(t, hit, .1) * (1 - K(t, hit + .4, .3)))
    u = K(t, S.s0, .35); c.save(); c.translate(lerp(1400, 1000, u), 940); c.rotate(-15); draw_char(c, 0, 0, 1.0, LOBO, face=-.7, eyes='wide', mouth='open'); c.restore()
    impacto(c, (t - hit) / .07); faiscas(c, 900, 700, t, hit, 22, '#BFF4FF')
def s_d5(c, t, S):
    floresta(c, t); u = K(t, S.s0, 1.2); linhas_velocidade(c, 1000, 600, t, .5 * (1 - u), '#FFFFFF')
    kai(c, 700, 1000, 1.0, t, face=.6, eyes='wide', mouth='o', brilho=1 - u)
    c.save(); c.translate(lerp(1000, 2400, ease_out(u)), 900 - 500 * math.sin(math.pi * u * .8)); c.rotate(360 * u); draw_char(c, 0, 0, .9, LOBO, eyes='closed', mouth='o'); c.restore()
    poplabel(c, "x2", 1250, 360, t, S.s0 + .8, 140, '#38D6FF', font=INTER_K)
def s_e1(c, t, S):
    blur_begin(c, 12); floresta(c, t); c.restore(); kai(c, 960, 1420, 2.1, t, face=0, eyes='wide', mouth='o', com_escudo=False)
    painel(c, S, t, S.s0 + .2, "SISTEMA", [("Escudo desperto.", '#FFFFFF')], y=S.view[1] + 150)
def s_e2(c, t, S):
    blur_begin(c, 12); floresta(c, t); c.restore(); escudo(c, 960, 760, 2.0, brilho=1)
    painel(c, S, t, S.s0, "HABILIDADE ÚNICA", [("REFLEXO", '#38D6FF')], y=S.view[1] + 150)
def s_e3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A1420')); escudo(c, 960, 560, 2.0, brilho=1); u = (t - S.s0) % 1.4 / 1.4
    if u < .5: espada(c, lerp(500, 820, u * 2), 560, .8, 90)
    else: line(c, 820, 560, lerp(820, 300, (u - .5) * 2), 560, 30 * (1 - (u - .5) * 2) + 6, '#38D6FF')
    poplabel(c, "x2", 960, 260, t, S.s0 + .3, 140, '#38D6FF', font=INTER_K)
def s_e4(c, t, S):
    floresta(c, t); kai(c, 960, 1000, 1.05, t, face=0, eyes='half', mouth='smirk', brilho=.6 + .3 * math.sin(t * 4), arms=('hold', 'hip'))
def s_f1(c, t, S):
    floresta(c, t, escura=K(t, S.s0, 1.0))
    k = K(t, S.s0 + .8, .6)
    for sx in (-1, 1): add_light(c, 960 + sx * 90, 420, 70, '#FFE14A', 240 * k); c.drawCircle(960 + sx * 90, 420, 18 * k, fp('#FFE14A'))
    for i in range(6): line(c, 600 + i * 140, 800, 600 + i * 140 + 30 * math.sin(t * 20 + i), 640, 10, '#2F7A3A', 200 * k)
def s_f2(c, t, S):
    floresta(c, t, escura=1)
    for sx in (-1, 1): add_light(c, 1250 + sx * 90, 380, 70, '#FFE14A', 240); c.drawCircle(1250 + sx * 90, 380, 18, fp('#FFE14A'))
    kai(c, 760, 1000, 1.0, t, face=.6, eyes='half', mouth='flat', brilho=.5, arms=('hold', 'down'))
    poplabel(c, "LUTA?", 960, 230, t, S.s0 + .1, fit("LUTA?", 110, (S.view[2] - S.view[0]) * .8, INTER_K), '#38D6FF', font=INTER_K)
    poplabel(c, "OU VOLTA?", 960, 350, t, S.s0 + 1.4, fit("OU VOLTA?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FFE14A', font=INTER_K)
def s_f3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); kai(c, 960, 1100, 1.2, t, face=0, eyes='half', mouth='smirk', brilho=.8)
    poplabel(c, "PARTE 2?", 960, 300, t, S.s0 + .1, 130, '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 600), (1.0, 1.08))),
    dict(draw=s_a2, falas=['a2'], sfx=[('brilho', 0.1, .7)], **V((960, 560), (1.0, 1.12))),
    dict(topo='REINO DE VALDORA', draw=s_b1, falas=['b1'], **V(((960, 400), (960, 620)), (.85, .9))),
    dict(draw=s_b2, falas=['b2'], sfx=[('pop', 0.05, .5), ('pop', 1.0, .5), ('pop', 2.0, .5)], **V((960, 600), (.85, .9))),
    dict(draw=s_b3, falas=['b3'], sfx=[('brilho', 0.3, .7)], **V(((1180, 600), (960, 600)), (1.0, 1.0))),
    dict(draw=s_b4, falas=['b4'], sfx=[('thud', 'b4+0.9', .6)], **V((960, 600), (1.0, 1.1))),
    dict(draw=s_b5, falas=['b5'], **V((960, 600), (.8, .85))),
    dict(draw=s_b6, falas=['b6'], **V(((1200, 560), (760, 560)), (1.0, 1.0))),
    dict(draw=s_c1, falas=['c1'], **V((960, 480), (1.0, 1.06))),
    dict(draw=s_c2, falas=['c2'], sfx=[('paper', 0.1, .6)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_c3, falas=['c3'], sfx=[('whoosh', 0.4, .6)], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_c4, falas=['c4'], **V((960, 760), (.95, 1.0))),
    dict(topo='FLORESTA', draw=s_d1, falas=['d1'], sfx=[('steps', 0.1, .5)], **V(((560, 560), (900, 560)), (1.0, 1.0))),
    dict(draw=s_d2, falas=['d2'], sfx=[('whoosh', 0.1, .7)], **V(((1100, 560), (900, 560)), (1.0, 1.05))),
    dict(draw=s_d3, falas=['d3'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_d4, falas=['d4'], sfx=[('thud', 0.35, 1.0)], shake=[0.35], **V((880, 600), (1.1, 1.0))),
    dict(draw=s_d5, falas=['d5'], sfx=[('whoosh', 0.05, .9)], **V(((900, 560), (1300, 480)), (1.0, .9))),
    dict(draw=s_e1, falas=['e1'], sfx=[('notif', 0.2, .8)], **V((960, 500), (1.0, 1.05))),
    dict(draw=s_e2, falas=['e2'], sfx=[('brilho', 0.1, .6)], **V((960, 620), (1.0, 1.06))),
    dict(draw=s_e3, falas=['e3'], sfx=[('ding', 0.6, .5)], **V((900, 700), (.9, .95))),
    dict(draw=s_e4, falas=['e4'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_f1, falas=['f1'], sfx=[('boom', 0.8, .8)], shake=[0.8], **V((960, 520), (1.0, 1.1))),
    dict(draw=s_f2, falas=['f2'], **V(((900, 560), (1050, 520)), (.9, .95))),
    dict(draw=s_f3, falas=['f3'], hold=1.0, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
