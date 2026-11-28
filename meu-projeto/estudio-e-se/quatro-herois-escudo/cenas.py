import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
_load('esc1base', os.path.expanduser('~/vid/escudo1/cenas.py'))
from esc1base import escudo, floresta, pergaminho, espada, lanca, LOBO, POVO
from xpbase import painel, impacto, faiscas, linhas_velocidade, tint, pisca

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {
    'kai': dict(corpo='homem', skin='#E0AC69', top='hoodie', suit='#2B2D42', print='#F4EFE2', hair='short', hair_col='#5A3A22'),
    'heroi_espada': dict(corpo='homem', skin='#F1C27D', top='suit', suit='#3E6FA8', print='#F2C14E', hair='topete', hair_col='#E9C46A'),
    'heroi_lanca': dict(corpo='homem', skin='#C68642', top='tee', suit='#B23A48', print='#F4EFE2', hair='espetado', hair_col='#1C1B22'),
    'heroina_arco': dict(corpo='mulher', skin='#F1C27D', top='blouse', suit='#2E7D32', shirt='#F4EFE2', hair='long', hair_col='#1C1B22', lashes=True),
})
KAI, ESP, LAN, ARC = EL['kai'], EL['heroi_espada'], EL['heroi_lanca'], EL['heroina_arco']
REI = dict(corpo='idoso', skin='#E6BE8E', top='suit', suit='#7A1E3A', print='#F2C14E', hair='bald', hair_col='#D8D8DC', barba=True, figurante=True)
kit.DESTAQUES = ['INVOCADO', 'TRÊS', 'PIOR', 'BRILHAR', 'CASTELO', 'HERÓIS', 'LENDÁRIOS', 'ALTAR', 'ESPADA', 'LANÇA', 'ARCO', 'ESCUDO', 'TRIANGULAR', 'SILÊNCIO', 'RIU', 'NADA', 'GRUPO', 'SOZINHO', 'VERDADE', 'DUZENTOS', 'PONTA', 'FLORESTA', 'LOBO', 'DUAS', 'REFLEXO', 'DOBRO', 'LONGE', 'SORRISO', 'SEGREDO', 'BATALHA', 'PARTE']


def kai(c, x, y, s, t, com_escudo=False, brilho=0.0, **kw):
    kw.setdefault('eyes', pisca(t)); kw.setdefault('arms', ('hold', 'down') if com_escudo else ('down', 'down'))
    draw_char(c, x, y, s, KAI, **kw)
    if com_escudo: escudo(c, x - 70 * s, y - 250 * s, .95 * s, rot=-8, brilho=brilho)
def heroi(c, spec, x, y, s, t, arma=None, **kw):
    kw.setdefault('eyes', pisca(t, x)); draw_char(c, x, y, s, spec, **kw)
    if arma == 'espada': espada(c, x + 110 * s, y - 230 * s, .8 * s, 20)
    if arma == 'lanca': lanca(c, x + 110 * s, y - 230 * s, .8 * s, 8)
    if arma == 'arco': arco(c, x + 110 * s, y - 280 * s, .8 * s)
def arco(c, x, y, s, rot=0):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    p = skia.Path(); p.addArc(skia.Rect(-150, -200, 50, 200), -80, 160); c.drawPath(p, ink(16, '#8B5A2B')); line(c, 26, -197, 26, 197, 3, '#F4EFE2'); c.restore()
def coroa(c, x, y, s): poly(c, [(x - 60 * s, y), (x - 60 * s, y - 50 * s), (x - 30 * s, y - 20 * s), (x, y - 60 * s), (x + 30 * s, y - 20 * s), (x + 60 * s, y - 50 * s), (x + 60 * s, y)], '#F2C14E', LW * .7)
def rei(c, x, y, s, t, **kw):
    kw.setdefault('eyes', pisca(t, .7)); draw_char(c, x, y, s, REI, **kw); coroa(c, x, y + HEAD_CY * s - 80 * s, s)
def salao(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), fp('#5A4A6E'))
    for x in (300, 700, 1220, 1620): rect(c, x - 60, -400, x + 60, 800, '#7A6A8E', LW, r=6)
    for x in (500, 1420): rect(c, x - 90, 100, x + 90, 520, '#B23A48', LW, r=6); circ(c, x, 260, 40, '#F2C14E', 4)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#8C7A62'))
    p = skia.Path(); p.moveTo(860, 800); p.lineTo(1060, 800); p.lineTo(1300, 1400); p.lineTo(620, 1400); p.close(); c.drawPath(p, fp('#B23A48'))
    rect(c, 840, 360, 1080, 800, '#C9A227', LW, r=20); rect(c, 870, 400, 1050, 700, '#7A1E3A', LW * .7, r=14)  # trono
def altar(c, t, mostra=4, brilho=None):
    rect(c, 560, 780, 1360, 860, '#9AA3B5', LW, r=10); rect(c, 600, 860, 1320, 1000, '#7D8597', LW, r=6)
    pos = [(660, 'espada'), (860, 'lanca'), (1060, 'arco'), (1260, 'escudo')]
    for i, (x, a) in enumerate(pos):
        if i >= mostra: continue
        if brilho == i: add_light(c, x, 600, 260, '#FFF2C8', 200); c.drawPath(cone_path(x, -300, 40, 220, 1100, 0), fp('#FFF2C8', 50, blur=20))
        if a == 'espada': espada(c, x, 760, .9, 0)
        if a == 'lanca': lanca(c, x, 700, .7, 0)
        if a == 'arco': arco(c, x, 600, .7)
        if a == 'escudo': escudo(c, x, 640, .8, racha=False)
def circulo_magico(c, x, y, r, t, a=1.0):
    c.save(); c.translate(x, y); c.scale(1, .32); c.rotate(t * 40)
    for k in (1, .78, .55): c.drawCircle(0, 0, r * k, ink(8, '#7FE7FF', 230 * a))
    for i in range(8): ang = i * .785; c.drawLine(math.cos(ang) * r * .55, math.sin(ang) * r * .55, math.cos(ang) * r, math.sin(ang) * r, ink(5, '#7FE7FF', 200 * a))
    c.restore(); add_light(c, x, y - 80, r * 1.4, '#7FE7FF', 160 * a)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    salao(c, t); circulo_magico(c, 960, 1000, 620, t)
    for i, (sp_, x) in enumerate(((ESP, 560), (LAN, 820), (ARC, 1100), (KAI, 1360))): draw_char(c, x, 1000, .9, sp_, face=0, eyes='wide', mouth='o')
def s_a2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); linhas_velocidade(c, 960, 560, t, .6, '#7FE7FF'); escudo(c, 960, 560, 2.2, rot=math.sin(t * 2) * 6, racha=False)
    poplabel(c, "PIOR ARMA?", 960, 940, t, S.s0 + .3, fit("PIOR ARMA?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#FF5F5F', font=INTER_K)
def s_b1(c, t, S):
    cenario(c, 'quarto', t); u = K(t, S.at('b1') + 1.4, .6)
    rect(c, 1240, 620, 1500, 780, '#14121A', LW, r=10); rect(c, 1260, 640, 1480, 760, '#2B6CFF', 0, r=6)  # monitor
    kai(c, 1100, 1000, 1.0, t, face=.7, eyes='wide' if u > .3 else 'half', mouth='o' if u > .3 else 'flat', arms=('hold', 'hold'))
    circulo_magico(c, 1100, 1000, 380, t, u)
def s_b2(c, t, S):
    salao(c, t)
    for i, (sp_, x) in enumerate(((ESP, 560), (LAN, 820), (ARC, 1100), (KAI, 1360))): draw_char(c, x, 1000, .9, sp_, face=(-.4 if i else .4), eyes=pisca(t, i), mouth='o')
def s_b3(c, t, S):
    salao(c, t); rei(c, 960, 1000, 1.1, t, face=0, mouth=('open' if int(t * 7) % 2 else 'smile'), arms=('present', 'present'))
    poplabel(c, "HERÓIS LENDÁRIOS", 960, 260, t, S.s0 + 1.4, fit("HERÓIS LENDÁRIOS", 80, (S.view[2] - S.view[0]) * .88, INTER_K), '#F2C14E', font=INTER_K)
def s_b4(c, t, S): salao(c, t); altar(c, t)
def s_b5(c, t, S): salao(c, t); altar(c, t, brilho=0); heroi(c, ESP, 660, 1000, .8, t, face=.2, mouth='smirk', arms=('down', 'hold'))
def s_b6(c, t, S): salao(c, t); altar(c, t, brilho=1); heroi(c, LAN, 860, 1000, .8, t, face=.2, mouth='smile', arms=('down', 'hold'))
def s_b7(c, t, S): salao(c, t); altar(c, t, brilho=2); heroi(c, ARC, 1060, 1000, .8, t, face=.2, mouth='smile', arms=('down', 'hold'))
def s_b8(c, t, S):
    salao(c, t); altar(c, t, brilho=3); kai(c, 1260, 1020, .8, t, face=-.2, eyes='wide', mouth='o', arms=('down', 'down'))
    if t > S.at('b8') + S.v.fala_util('b8') * .55: escudo(c, 1260, 400, 1.0, racha=False, brilho=1)
def s_c1(c, t, S):
    salao(c, t)
    for i, sp_ in enumerate(POVO): draw_char(c, 560 + i * 270, 1000, .85, sp_, face=0, eyes='half', mouth='flat')
def s_c2(c, t, S):
    salao(c, t)
    for i, sp_ in enumerate(POVO): draw_char(c, 560 + i * 270, 1000, .85, sp_, face=0, eyes='closed', mouth='open' if int(t * 8 + i) % 2 else 'smile', arms=('hip', 'down'), bob=5 * abs(math.sin(t * 9 + i)))
    for i in range(3): poplabel(c, "HAHA", 620 + i * 340, 300 + (i % 2) * 80, t, S.s0 + i * .12, 70, '#FFFFFF', font=INTER_K)
def s_c3(c, t, S):
    blur_begin(c, 12); salao(c, t); c.restore(); escudo(c, 960, 430, 1.4, racha=False)
    d = S.v.fala_util('c3')
    for i, txt in enumerate(("NÃO ATACA", "NÃO DERROTA", "INÚTIL")):
        if t > S.s0 + d * i / 3: stamp(c, txt, 960, 700 + i * 95, (t - S.s0 - d * i / 3) / .4, rot=-6 + i * 4, size=fit(txt, 64, (S.view[2] - S.view[0]) * .62, MARKER))
def s_c4(c, t, S):
    salao(c, t)
    for i, (sp_, x, a) in enumerate(((ESP, 560, 'espada'), (LAN, 960, 'lanca'), (ARC, 1360, 'arco'))):
        heroi(c, sp_, x, 1000, .85, t, arma=a, face=0, mouth='smile')
        for k in range(2): draw_char(c, x - 120 + k * 240, 1040, .65, POVO[(i + k) % 4], face=0, eyes=pisca(t, k + i), mouth='smile')
def s_c5(c, t, S):
    salao(c, t); kai(c, 960, 1000, 1.0, t, com_escudo=True, face=0, eyes='half', mouth='flat', brow=.6, brow_tilt=-.5)
def s_d1(c, t, S): pergaminho(c, S, t); escudo(c, 960, 520, 1.7, racha=False); poplabel(c, "~1200", 960, 860, t, S.s0 + .6, 90, '#7A3B1A', font=INTER_K, stroke=0)
def s_d2(c, t, S):
    pergaminho(c, S, t); escudo(c, 960, 560, 1.6, racha=False); u = K(t, S.s0 + .2, .9)
    ex, ey = (lerp(760, 960, u * 2), lerp(240, 400, u * 2)) if u < .5 else (lerp(960, 1160, (u - .5) * 2), lerp(400, 820, (u - .5) * 2)); espada(c, ex, ey, .7, 140)
def s_e1(c, t, S):
    floresta(c, t); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 7
    kai(c, lerp(500, 900, u), 1000, 1.0, t, com_escudo=True, face=.7, mouth='flat', legs=walk_legs(ph), bob=4 * abs(math.sin(ph)))
def s_e2(c, t, S):
    floresta(c, t); u = K(t, S.s0, .7); kai(c, 760, 1000, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o')
    c.save(); c.translate(lerp(1500, 1050, u), 1000 - 220 * math.sin(math.pi * u)); c.rotate(-15); draw_char(c, 0, 0, 1.0, LOBO, face=-.7, eyes='half', mouth='open', arms=('gesture', 'gesture')); c.restore()
def s_e3(c, t, S):
    floresta(c, t); hit = S.s0 + .45; kai(c, 760, 1000, 1.0, t, com_escudo=True, face=.6, eyes='half', mouth='flat', brilho=K(t, hit, .1) * (1 - K(t, hit + .4, .3)))
    u = K(t, S.s0, .45); c.save(); c.translate(lerp(1400, 1000, u), 940); c.rotate(-15); draw_char(c, 0, 0, 1.0, LOBO, face=-.7, eyes='wide', mouth='open'); c.restore()
    impacto(c, (t - hit) / .07); faiscas(c, 900, 700, t, hit, 22, '#BFF4FF')
def s_e4(c, t, S):
    floresta(c, t); u = K(t, S.s0, 1.2); linhas_velocidade(c, 1000, 600, t, .5 * (1 - u), '#FFFFFF')
    kai(c, 700, 1000, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o', brilho=1 - u)
    c.save(); c.translate(lerp(1000, 2400, ease_out(u)), 900 - 500 * math.sin(math.pi * u * .8)); c.rotate(360 * u); draw_char(c, 0, 0, .9, LOBO, eyes='closed', mouth='o'); c.restore()
    poplabel(c, "x2", 1250, 300, t, S.s0 + .8, 140, '#38D6FF', font=INTER_K)
def s_f1(c, t, S):
    blur_begin(c, 12); floresta(c, t); c.restore(); escudo(c, 960, 760, 2.0, brilho=1, racha=False)
    painel(c, S, t, S.s0, "HABILIDADE ÚNICA", [("REFLEXO", '#38D6FF'), ("Todo golpe volta em dobro.", '#FFFFFF')], y=S.view[1] + 150)
def s_f2(c, t, S):
    floresta(c, t)
    for i, (sp_, x) in enumerate(((ESP, 760), (LAN, 980), (ARC, 1200))): heroi(c, sp_, x, 1000, .85, t, face=-.6, eyes='wide', mouth='o')
    for i in range(5): c.drawCircle(600 + i * 180, 760, 120, fp('#3D8F44'))  # moita na frente
def s_f3(c, t, S):
    blur_begin(c, 12); floresta(c, t); c.restore(); tint(c, '#0A1020', .3)
    heroi(c, ESP, 960, 1320, 1.9, t, arma='espada', face=-.3, eyes='half', mouth='smirk', brow=.6, brow_tilt=.6)
def s_g1(c, t, S):
    floresta(c, t); kai(c, 960, 1000, 1.05, t, com_escudo=True, face=0, eyes='half', mouth='flat', brilho=.4)
    poplabel(c, "CONTA?", 960, 230, t, S.s0 + .1, fit("CONTA?", 110, (S.view[2] - S.view[0]) * .8, INTER_K), '#38D6FF', font=INTER_K)
    poplabel(c, "OU ESCONDE?", 960, 350, t, S.s0 + 1.6, fit("OU ESCONDE?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FFE14A', font=INTER_K)
def s_g2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); kai(c, 960, 1100, 1.2, t, com_escudo=True, face=0, eyes='half', mouth='smirk', brilho=.8)
    poplabel(c, "PARTE 2?", 960, 300, t, S.s0 + .1, 130, '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], sfx=[('brilho', 0.2, .7)], **V((960, 600), (.75, .8))),
    dict(draw=s_a2, falas=['a2'], sfx=[('thud', 0.3, .5)], **V((960, 640), (1.0, 1.08))),
    dict(draw=s_b1, falas=['b1'], sfx=[('brilho', 'b1+1.4', .8)], **V(((1180, 600), (1100, 680)), (1.0, 1.05))),
    dict(topo='CASTELO DE VALDORA', draw=s_b2, falas=['b2'], **V((960, 580), (.75, .8))),
    dict(draw=s_b3, falas=['b3'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_b4, falas=['b4'], **V((960, 760), (.8, .85))),
    dict(draw=s_b5, falas=['b5'], sfx=[('brilho', 0.1, .6)], **V((680, 640), (1.0, 1.05))),
    dict(draw=s_b6, falas=['b6'], sfx=[('brilho', 0.1, .6)], **V((880, 640), (1.0, 1.05))),
    dict(draw=s_b7, falas=['b7'], sfx=[('brilho', 0.1, .6)], **V((1080, 640), (1.0, 1.05))),
    dict(draw=s_b8, falas=['b8'], sfx=[('thud', 'b8+0.9', .7)], **V((1260, 680), (1.0, 1.08))),
    dict(draw=s_c1, falas=['c1'], **V((960, 600), (.8, .85))),
    dict(draw=s_c2, falas=['c2'], **V((960, 600), (.8, .85))),
    dict(draw=s_c3, falas=['c3'], sfx=[('thud', 0.3, .6), ('thud', 1.3, .6), ('thud', 2.3, .6)], **V((960, 760), (.9, .95))),
    dict(draw=s_c4, falas=['c4'], **V(((560, 600), (1360, 600)), (1.0, 1.0))),
    dict(draw=s_c5, falas=['c5'], **V((960, 560), (1.0, 1.1))),
    dict(draw=s_d1, falas=['d1'], sfx=[('paper', 0.1, .6)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_d2, falas=['d2'], sfx=[('whoosh', 0.4, .6)], **V((960, 560), (1.0, 1.05))),
    dict(topo='FLORESTA', draw=s_e1, falas=['e1'], sfx=[('steps', 0.1, .5)], **V(((560, 560), (900, 560)), (1.0, 1.0))),
    dict(draw=s_e2, falas=['e2'], sfx=[('whoosh', 0.1, .7)], **V(((1100, 560), (900, 560)), (1.0, 1.05))),
    dict(draw=s_e3, falas=['e3'], sfx=[('thud', 0.45, 1.0)], shake=[0.45], **V((880, 600), (1.1, 1.0))),
    dict(draw=s_e4, falas=['e4'], sfx=[('whoosh', 0.05, .9)], **V(((900, 560), (1300, 480)), (1.0, .9))),
    dict(draw=s_f1, falas=['f1'], sfx=[('notif', 0.1, .8)], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_f2, falas=['f2'], **V((980, 600), (.85, .9))),
    dict(draw=s_f3, falas=['f3'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_g1, falas=['g1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_g2, falas=['g2'], hold=1.0, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
