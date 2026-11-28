import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
_load('esc3base', os.path.expanduser('~/vid/escudo3/cenas.py'))
from esc3base import fenda
from esc2base import kai, heroi, ESP, LAN, ARC
from esc1base import escudo, praca, POVO
from xpbase import painel, impacto, faiscas, linhas_velocidade, tint, pisca

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {'nina': dict(corpo='menina', skin='#8D5524', top='jardineira', suit='#7A5A3C', shirt='#F2C14E', hair='trancas', hair_col='#2A1A14', lashes=True, hat_band='#E76F51')})
NINA = EL['nina']
kit.DESTAQUES = ['DEFEITO', 'FECHADURA', 'DOIS', 'FENDA', 'FERREIRO', 'RECUSARAM', 'MENOS', 'NINA', 'FERREIRA', 'RACHADURA', 'FORJA', 'VERMELHO', 'ÁGUA', 'TÊMPERA', 'CARBONO', 'DURO', 'BRILHOU', 'FECHOU', 'BARREIRA', 'PROTEGE', 'MARTELO', 'TESTA', 'DENTRO', 'NOITE', 'RACHAR', 'AMANHÃ', 'SOZINHOS', 'HERÓIS', 'PARTE']


def nina(c, x, y, s, t, martelo=True, **kw):
    kw.setdefault('eyes', pisca(t, .3)); draw_char(c, x, y, s, NINA, **kw)
    if martelo: c.save(); c.translate(x + 70 * s, y - 170 * s); c.rotate(20); line(c, 0, 0, 0, -130 * s, 10 * s, '#6B4A32'); rect(c, -40 * s, -170 * s, 40 * s, -120 * s, '#5A6070', 4, r=6); c.restore()
def forja(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), fp('#4A3A30'))
    for j, y in enumerate(range(-400, 800, 70)):
        for x in range(-900 + (j % 2) * 70, W + 900, 140): rect(c, x + 3, y + 3, x + 137, y + 67, '#5A4638', 2, r=6)
    rect(c, 1260, 300, 1640, 820, '#6F6A78', LW, r=20); rect(c, 1330, 520, 1570, 760, '#1A0A08', LW * .8, r=60)
    f = 1 + .1 * math.sin(t * 12); c.drawOval(skia.Rect(1360, 600 - 60 * f, 1540, 760), fp('#FF8A2A')); c.drawOval(skia.Rect(1400, 660 - 30 * f, 1500, 760), fp('#FFE08A'))
    add_light(c, 1450, 650, 520, '#FF9A3D', 170)
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#3A2E26'))
    rect(c, 820, 720, 1100, 780, '#5A6070', LW, r=10); rect(c, 900, 780, 1020, 900, '#4A4F5C', LW)   # bigorna
    rect(c, 340, 700, 560, 900, '#7A5A3C', LW, r=16); c.drawOval(skia.Rect(350, 690, 550, 730), fp('#3E8FD8'))  # barril d'água
def vapor(c, x, y, t, a=1.0):
    for i in range(8): u = ((t * .8 + i / 8) % 1); c.drawCircle(x + math.sin(i * 3 + t) * 40, y - u * 380, 40 + u * 80, fp('#FFFFFF', 140 * (1 - u) * a))
def barreira(c, x, y, r, t, a=1.0):
    if a <= 0: return
    c.drawOval(skia.Rect(x - r, y - r * 1.1, x + r, y + r * .3), fp('#38D6FF', 50 * a)); c.drawOval(skia.Rect(x - r, y - r * 1.1, x + r, y + r * .3), ink(6, '#8FE8FF', 220 * a))
    for i in range(6): ang = t * 1.5 + i; c.drawCircle(x + math.cos(ang) * r * .8, y - r * .4 + math.sin(ang) * r * .5, 6, fp('#FFFFFF', 200 * a))
def martelo(c, x, y, s, rot):
    c.save(); c.translate(x, y); c.rotate(rot); line(c, 0, 40 * s, 0, -90 * s, 12 * s, '#6B4A32'); rect(c, -50 * s, -130 * s, 50 * s, -70 * s, '#5A6070', 4, r=8); c.restore()


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); escudo(c, 960, 560, 2.4, rot=math.sin(t * 1.5) * 4)
def s_a2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); escudo(c, 960, 560, 2.4, brilho=K(t, S.s0 + .3, .6))
    k = back(K(t, S.s0 + .5, .4), 1.3); c.save(); c.translate(960, 980); c.scale(k, k); rect(c, -70, -60, 70, 80, '#C9A227', LW, r=14); p = skia.Path(); p.addArc(skia.Rect(-45, -130, 45, -30), 180, 180); c.drawPath(p, ink(18, '#C9A227')); c.restore()
def s_b1(c, t, S):
    praca(c, t); tint(c, '#2A1040', .15); fenda(c, 960, 150, .7, t, .6)
    ph = (t - S.s0) * 7; kai(c, lerp(500, 900, K(t, S.s0, S.s1 - S.s0)), 1030, 1.0, t, com_escudo=True, face=.7, mouth='flat', legs=walk_legs(ph), bob=4 * abs(math.sin(ph)))
def s_b2(c, t, S):
    praca(c, t); d = S.v.fala_util('b2')
    for i, sp_ in enumerate(POVO[:3]):
        x = 560 + i * 400; tt = S.s0 + d * i / 3; draw_char(c, x, 1030, .9, sp_, face=0, eyes='half', mouth='flat', arms=('down', ('down', 'push', K(t, tt, .2))))
        if t > tt: poplabel(c, "X", x, 300, t, tt, 120, '#FF3B3B', font=INTER_K)
def s_b3(c, t, S): forja(c, t); nina(c, 960, 1000, 1.1, t, face=0, mouth='smirk', arms=('hip', 'hold'))
def s_b4(c, t, S):
    blur_begin(c, 10); forja(c, t); c.restore(); nina(c, 960, 1260, 2.2, t, face=.2, mouth='smile', martelo=False)
    painel(c, S, t, S.s0 + .6, "NINA", [("FERREIRA", '#FFE14A')], y=S.view[1] + 150)
def s_b5(c, t, S): forja(c, t); escudo(c, 960, 720, 1.1); nina(c, 700, 1000, 1.0, t, face=.6, eyes='half', mouth='flat', arms=('down', 'chin')); kai(c, 1240, 1000, 1.0, t, face=-.6, mouth='flat')
def s_b6(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); escudo(c, 960, 560, 3.0, brilho=.4); add_light(c, 940, 470, 260, '#FFE14A', 200)
def s_c1(c, t, S):
    forja(c, t); k = K(t, S.s0 + .3, 1.2); escudo(c, 1450, 640, .9)
    add_light(c, 1450, 640, 300, '#FF3B1A', 255 * k); nina(c, 1180, 1000, 1.0, t, face=.6, mouth='flat', arms=('down', 'present'))
def s_c2(c, t, S):
    forja(c, t); u = K(t, S.s0, .5); escudo(c, lerp(1100, 450, u), lerp(600, 760, u), .9, rot=-90 * u); add_light(c, lerp(1100, 450, u), 700, 260, '#FF3B1A', 220 * (1 - K(t, S.s0 + .5, .4)))
    vapor(c, 450, 690, t, K(t, S.s0 + .5, .3)); nina(c, 800, 1000, 1.0, t, face=-.6, mouth='o', arms=('push', 'down'))
def s_c3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); vapor(c, 960, 900, t); escudo(c, 960, 640, 1.8)
    poplabel(c, "TÊMPERA", 960, 280, t, S.s0 + .2, 120, '#FFE14A', font=INTER_K)
def s_c4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), sp(radial(960, 540, 1100, [hx('#0F3A4E'), hx('#071820')])))
    u = K(t, S.s0 + .8, 1.5)
    for i in range(7):
        for j in range(7):
            x = 660 + i * 100; y = 300 + j * 100; jit = (1 - u) * 22 * math.sin(t * 9 + i * 3 + j)
            c.drawCircle(x + jit, y + jit * .7, 22, fp('#8FE8FF', 220))
            if (i + j) % 3 == 0: c.drawCircle(x + 50, y + 50, 12, fp('#FFE14A', 220 * u + 30))
    label(c, "CARBONO PRESO", 960, 1050, 56, '#FFE14A', font=INTER_K, align='center', skew=0)
def s_d1(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); escudo(c, 960, 560, 2.4, brilho=K(t, S.s0, .4))
def s_d2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); u = K(t, S.s0 + .2, .6); escudo(c, 960, 560, 2.4, brilho=1, racha=u < .8)
    for i in range(14): a = i * .45 + t; c.drawCircle(960 + math.cos(a) * 330 * (1 - u), 520 + math.sin(a) * 330 * (1 - u), 8, fp('#BFF4FF', 220))
def s_d3(c, t, S):
    blur_begin(c, 10); forja(c, t); c.restore(); escudo(c, 960, 760, 1.8, brilho=1, racha=False)
    painel(c, S, t, S.s0, "NOVA HABILIDADE", [("BARREIRA", '#38D6FF')], y=S.view[1] + 150)
def s_d4(c, t, S):
    forja(c, t); barreira(c, 960, 1000, 520, t, K(t, S.s0 + .3, .5))
    kai(c, 860, 1000, 1.0, t, com_escudo=True, face=.3, mouth='flat', brilho=.5); nina(c, 1120, 1000, .95, t, face=-.4, mouth='o')
def s_e1(c, t, S):
    forja(c, t); u = K(t, S.s0 + .4, .5); nina(c, 1300, 1000, 1.0, t, face=-.7, eyes='half', mouth='smirk', arms=('down', ('down', 'hat', 1 - u)), martelo=u < .1)
    if u > .05: martelo(c, lerp(1360, 1000, u), lerp(620, 660, u), 1.0, 400 * u)
    kai(c, 700, 1000, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o')
def s_e2(c, t, S):
    forja(c, t); hit = S.s0 + .3; barreira(c, 760, 1000, 380, t); kai(c, 700, 1000, 1.0, t, com_escudo=True, face=.6, mouth='flat', brilho=.5)
    martelo(c, lerp(1100, 1000, K(t, S.s0, .3)), 640, 1.0, 600 * K(t, S.s0, .3)); impacto(c, (t - hit) / .06); faiscas(c, 1000, 640, t, hit, 22, '#BFF4FF')
def s_e3(c, t, S):
    forja(c, t); u = K(t, S.s0, .5); martelo(c, lerp(1000, 1290, u), lerp(640, 600, u), 1.0, -500 * u)
    hit = S.s0 + .5; nina(c, 1320, 1000, 1.0, t, face=-.6, eyes='closed' if t > hit else 'wide', mouth='o', martelo=False, tilt=-12 * K(t, hit, .2))
    if t > hit:
        for i in range(4): a = t * 5 + i * 1.57; label(c, '*', 1320 + math.cos(a) * 120, 560 + math.sin(a) * 40, 60, '#FFE14A', font=INTER_K, align='center', skew=0)
def s_e4(c, t, S):
    forja(c, t); nina(c, 1150, 1000, 1.0, t, face=-.5, eyes='closed', mouth='open', arms=('hip', 'hold')); kai(c, 760, 1000, 1.0, t, com_escudo=True, face=.5, mouth='smile')
    poplabel(c, "+1 NO GRUPO", 960, 300, t, S.s0 + 1.0, fit("+1 NO GRUPO", 90, (S.view[2] - S.view[0]) * .85, INTER_K), '#3DDC84', font=INTER_K)
def s_f1(c, t, S): praca(c, t); tint(c, '#0A1136', .55); fenda(c, 960, 150, 1.0, t, .6 + .4 * K(t, S.s0, 1.5))
def s_f2(c, t, S): praca(c, t); tint(c, '#0A1136', .55); fenda(c, 960, 200, 1.3, t); poplabel(c, "3 DIAS", 960, 470, t, S.s0 + .1, 110, '#C77DFF', font=INTER_K); stamp(c, "CANCELADO", 960, 470, (t - S.s0 - .8) / .4, rot=-8, size=70)
def s_f3(c, t, S):
    praca(c, t); tint(c, '#0A1136', .55); fenda(c, 960, 200, 1.5, t); poplabel(c, "AMANHÃ", 960, 560, t, S.s0 + .2, 130, '#FF5F5F', font=INTER_K)
def s_g1(c, t, S):
    praca(c, t); tint(c, '#0A1136', .45); fenda(c, 960, 150, 1.0, t)
    kai(c, 820, 1030, 1.0, t, com_escudo=True, face=.3, mouth='flat'); nina(c, 1080, 1030, .95, t, face=-.3, mouth='flat')
    poplabel(c, "SOZINHOS?", 960, 400, t, S.s0 + .2, fit("SOZINHOS?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FFE14A', font=INTER_K)
    poplabel(c, "OU OS HERÓIS?", 960, 520, t, S.s0 + 1.6, fit("OU OS HERÓIS?", 90, (S.view[2] - S.view[0]) * .8, INTER_K), '#38D6FF', font=INTER_K)
def s_g2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); fenda(c, 960, 260, .8, t)
    kai(c, 860, 1150, 1.1, t, com_escudo=True, face=.2, mouth='flat', brilho=.6); nina(c, 1100, 1150, 1.0, t, face=-.2, mouth='smirk')
    poplabel(c, "PARTE 4?", 960, 680, t, S.s0 + .1, 130, '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_a2, falas=['a2'], sfx=[('brilho', 0.3, .6), ('pop', 0.5, .5)], **V((960, 700), (.9, .95))),
    dict(topo='2 DIAS PRA FENDA', draw=s_b1, falas=['b1'], sfx=[('steps', 0.1, .5)], **V(((560, 560), (900, 560)), (1.0, 1.0))),
    dict(draw=s_b2, falas=['b2'], sfx=[('buzzer', 0.4, .4), ('buzzer', 1.4, .4), ('buzzer', 2.4, .4)], **V(((560, 600), (1360, 600)), (1.0, 1.0))),
    dict(topo='A FORJA', draw=s_b3, falas=['b3'], **V((960, 620), (1.0, 1.06))),
    dict(draw=s_b4, falas=['b4'], sfx=[('pop', 0.6, .5)], **V((960, 520), (1.0, 1.05))),
    dict(draw=s_b5, falas=['b5'], **V(((700, 600), (1000, 620)), (1.0, 1.05))),
    dict(draw=s_b6, falas=['b6'], sfx=[('brilho', 0.2, .6)], **V((940, 500), (1.2, 1.35))),
    dict(draw=s_c1, falas=['c1'], **V(((1200, 600), (1450, 640)), (1.0, 1.1))),
    dict(draw=s_c2, falas=['c2'], sfx=[('whoosh', 0.1, .6), ('glitch', 0.5, .5)], **V(((900, 620), (500, 680)), (1.0, 1.0))),
    dict(draw=s_c3, falas=['c3'], **V((960, 600), (1.0, 1.06))),
    dict(draw=s_c4, falas=['c4'], **V((960, 640), (.9, .95))),
    dict(draw=s_d1, falas=['d1'], sfx=[('brilho', 0.1, .7)], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_d2, falas=['d2'], sfx=[('subida', 0.2, .6)], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_d3, falas=['d3'], sfx=[('notif', 0.05, .8)], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_d4, falas=['d4'], **V((960, 640), (.85, .9))),
    dict(draw=s_e1, falas=['e1'], sfx=[('whoosh', 0.4, .8)], **V(((1300, 600), (900, 620)), (1.0, 1.0))),
    dict(draw=s_e2, falas=['e2'], sfx=[('thud', 0.3, .9)], shake=[0.3], **V((880, 620), (1.05, 1.0))),
    dict(draw=s_e3, falas=['e3'], sfx=[('whoosh', 0.05, .7), ('thud', 0.5, .8)], **V(((1050, 620), (1300, 620)), (1.0, 1.05))),
    dict(draw=s_e4, falas=['e4'], **V((960, 600), (.9, .95))),
    dict(topo='NOITE', draw=s_f1, falas=['f1'], sfx=[('boom', 0.3, .7)], **V(((960, 600), (960, 300)), (1.0, .9))),
    dict(draw=s_f2, falas=['f2'], sfx=[('thud', 0.8, .7)], **V((960, 400), (.9, .95))),
    dict(draw=s_f3, falas=['f3'], sfx=[('boom', 0.2, .8)], shake=[0.2], **V((960, 400), (.9, .95))),
    dict(draw=s_g1, falas=['g1'], **V((960, 560), (.85, .9))),
    dict(draw=s_g2, falas=['g2'], hold=1.0, **V((960, 600), (.9, .95))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
