import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
_load('esc5base', os.path.expanduser('~/vid/escudo5/cenas.py'))
from esc4base import nina
from esc2base import kai, heroi, salao, rei, arco, ESP, LAN, ARC
from esc1base import escudo, espada, lanca, pergaminho, POVO
from xpbase import painel, impacto, faiscas, linhas_velocidade, tint, pisca

PROJ = os.path.dirname(os.path.abspath(__file__))
GUARDA = dict(corpo='homem', skin='#E6BE8E', top='suit', suit='#7D8597', print='#B23A48', hair='raspado', hair_col='#3B2A20', figurante=True)
kit.DESTAQUES = ['DESPREZADA', 'ÚNICA', 'REI', 'CASTELO', 'GRUPO', 'HERÓIS', 'BRILHOU', 'JANELA', 'ORIGINAL', 'COPIADAS', 'PRIMEIRA', 'LENDÁRIA', 'TRIANGULAR', 'ACASO', 'TRIÂNGULO', 'FIRME', 'PONTES', 'TORRES', 'QUADRADO', 'ENTORTA', 'PONTA', 'PODER', 'COROA', 'GUARDAS', 'IGOR', 'ESPADA', 'KAI', 'TEMPORADA', 'ARMADILHA', 'SEGUNDA']


def ligacoes(c, x, y, s, t, k=1.0):
    pontas = [(x, y + 130 * s), (x - 100 * s, y - 120 * s), (x + 100 * s, y - 120 * s)]
    alvos = [(x, y + 420 * s, 'arco'), (x - 340 * s, y - 300 * s, 'espada'), (x + 340 * s, y - 300 * s, 'lanca')]
    for (px, py), (ax, ay, a) in zip(pontas, alvos):
        c.drawLine(px, py, lerp(px, ax, k), lerp(py, ay, k), ink(8, '#7FE7FF', 220)); add_light(c, lerp(px, ax, k), lerp(py, ay, k), 50, '#7FE7FF', 200)
        if k > .9:
            if a == 'espada': espada(c, ax, ay + 80, .7, 0)
            if a == 'lanca': lanca(c, ax, ay + 80, .5, 0)
            if a == 'arco': arco(c, ax + 30, ay, .5)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    salao(c, t); kai(c, 960, 1000, 1.05, t, com_escudo=True, face=0, eyes='half', mouth='flat', brilho=.4)
def s_a2(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); linhas_velocidade(c, 960, 560, t, .6, '#7FE7FF'); escudo(c, 960, 560, 2.4, brilho=1, racha=False)
def s_b1(c, t, S):
    salao(c, t); rei(c, 960, 1000, 1.0, t, face=0, mouth='smile', arms=('present', 'present')); kai(c, 1360, 1060, .8, t, com_escudo=True, face=-.6, mouth='flat')
def s_b2(c, t, S):
    salao(c, t)
    for i, sp_ in enumerate(POVO): draw_char(c, 560 + i * 270, 1000, .85, sp_, face=0, eyes='closed', mouth='open', arms=('gesture', 'down'), bob=4 * abs(math.sin(t * 8 + i)))
    for i in range(3): poplabel(c, "ME ESCOLHE!", 640 + i * 320, 300 + (i % 2) * 90, t, S.s0 + i * .2, 54, '#FFFFFF', font=INTER_K)
def s_b3(c, t, S):
    salao(c, t)
    for i, (sp_, x, a) in enumerate(((ESP, 640, 'espada'), (LAN, 960, None), (ARC, 1280, 'arco'))): heroi(c, sp_, x, 1000, .9, t, arma=a, face=0, eyes='closed', mouth='smile', arms=('gesture', 'down'))
def s_c1(c, t, S):
    blur_begin(c, 12); salao(c, t); c.restore(); escudo(c, 960, 700, 2.0, brilho=K(t, S.s0 + .3, .5), racha=False)
    for i in range(14): a = i * .45 + t * 2; c.drawCircle(960 + math.cos(a) * 320, 640 + math.sin(a) * 320, 8, fp('#BFF4FF', 220 * K(t, S.s0 + .3, .5)))
def s_c2(c, t, S):
    blur_begin(c, 12); salao(c, t); c.restore(); kai(c, 960, 1420, 2.1, t, face=0, eyes='wide', mouth='o')
    painel(c, S, t, S.s0 + .3, "???", [("Janela desconhecida", '#FFFFFF')], cor='#C77DFF', y=S.view[1] + 150)
def s_c3(c, t, S):
    blur_begin(c, 12); salao(c, t); c.restore(); d = S.v.fala_util('c3')
    painel(c, S, t, S.s0, "ARMA ORIGINAL", [("ESCUDO", '#FFE14A')], cor='#FFD23F', y=S.view[1] + 150)
    painel(c, S, t, S.s0 + d * .45, "ARMAS COPIADAS", [("ESPADA · LANÇA · ARCO", '#FFFFFF')], cor='#C77DFF', y=S.view[1] + 520)
def s_d1(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); escudo(c, 960, 560, 2.0, brilho=1, racha=False); poplabel(c, "Nº 1", 960, 230, t, S.s0 + .3, 140, '#FFE14A', font=INTER_K)
def s_d2(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); escudo(c, 960, 640, 1.2, brilho=1, racha=False); ligacoes(c, 960, 640, 1.0, t, K(t, S.s0 + .2, 1.0))
def s_d3(c, t, S): pergaminho(c, S, t); escudo(c, 960, 600, 1.5, racha=False); poplabel(c, "TRIÂNGULO", 960, 280, t, S.s0 + .4, 80, '#7A3B1A', font=INTER_K, stroke=0)
def s_e1(c, t, S):
    pergaminho(c, S, t)
    poly(c, [(960, 260), (760, 600), (1160, 600)], '#F2E2B8', 10); poplabel(c, "FIRME", 960, 760, t, S.s0 + .4, 100, '#7A3B1A', font=INTER_K, stroke=0)
def s_e2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), sp(linear(0, 0, 0, 1080, [hx('#7CC4E8'), hx('#DDF2E2')])))
    c.drawRect(skia.Rect(-900, 760, W + 900, H + 600), fp('#3E8FD8'))
    line(c, 560, 600, 1360, 600, 12, '#7A3B1A'); line(c, 560, 420, 1360, 420, 12, '#7A3B1A')
    for i in range(8):
        x0 = 560 + i * 100; line(c, x0, 600, x0 + 100, 420 if i % 2 == 0 else 600, 8, '#B23A48'); line(c, x0 + 100, 600, x0 + (0 if i % 2 == 0 else 100), 420, 8, '#B23A48')
    for x in (560, 1360): rect(c, x - 30, 600, x + 30, 900, '#7A5A3C', LW)
def s_e3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); u = (math.sin((t - S.s0) * 4) + 1) / 2 * K(t, S.s0 + .2, .3)
    k = 60 * u; poly(c, [(620 + k, 380), (860 + k, 380), (860, 620), (620, 620)], '#FF8A8A', 8)
    poly(c, [(1180, 380), (1060, 620), (1300, 620)], '#8FE8FF', 8)
    label(c, "ENTORTA", 740, 720, 44, '#FF8A8A', font=INTER_K, align='center', skew=0); label(c, "FIRME", 1180, 720, 44, '#8FE8FF', font=INTER_K, align='center', skew=0)
def s_f1(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); escudo(c, 960, 640, 1.2, brilho=1, racha=False); ligacoes(c, 960, 640, 1.0, t, 1)
def s_f2(c, t, S):
    salao(c, t); tint(c, '#000000', .2)
    for i, (sp_, x, a) in enumerate(((ESP, 640, 'espada'), (LAN, 960, None), (ARC, 1280, 'arco'))): heroi(c, sp_, x, 1000, .9, t, arma=a, face=0, eyes='wide', mouth='o', sweat=t - S.s0)
    poplabel(c, "SEM PODER", 960, 300, t, S.s0 + 1.2, fit("SEM PODER", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
def s_g1(c, t, S): blur_begin(c, 12); salao(c, t); c.restore(); rei(c, 960, 1350, 1.8, t, face=0, eyes='half', mouth='smile', brow=.6, brow_tilt=.7)
def s_g2(c, t, S):
    salao(c, t); kai(c, 960, 1000, 1.0, t, com_escudo=True, face=0, eyes='wide', mouth='o')
    for i, x in enumerate((560, 1360)):
        u = K(t, S.s0, 1.2); draw_char(c, lerp(x + (-300 if i == 0 else 300), x + (150 if i == 0 else -150), u), 1000, 1.0, GUARDA, face=.7 if i == 0 else -.7, eyes='half', mouth='flat', legs=walk_legs((t - S.s0) * 8 + i))
def s_g3(c, t, S):
    salao(c, t); u = K(t, S.s0 + .2, .4)
    heroi(c, ESP, 960, 1000, 1.05, t, face=-.3, eyes='half', mouth='flat', arms=('down', ('down', 'present', u))); espada(c, 960 + 208 * 1.05 * u, 1000 - 338 * 1.05 * u + 60, 1.0, -90 * u)
    linhas_velocidade(c, 960, 600, t, .4 * u)
def s_g4(c, t, S):
    salao(c, t); kai(c, 700, 1000, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o')
    heroi(c, ESP, 1100, 1000, 1.0, t, face=-.2, eyes='half', mouth='flat'); espada(c, 1280, 680, .9, -60)
def s_g5(c, t, S):
    salao(c, t); u = K(t, S.s0 + .1, .3)
    heroi(c, ESP, 760, 1000, 1.0, t, face=.6, eyes='half', mouth='flat', arms=('down', 'present')); espada(c, 990, 650, 1.0, lerp(-60, 90, u))
    rei(c, 1300, 1000, 1.0, t, face=-.6, eyes='wide', mouth='o', sweat=t - S.s0); impacto(c, (t - S.s0 - .4) / .05)
def s_h1(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#000000'))
    poplabel(c, "FIM DA", 960, 460, t, S.s0 + .1, 110, '#FFFFFF', font=INTER_K); poplabel(c, "TEMPORADA 1", 960, 600, t, S.s0 + .4, fit("TEMPORADA 1", 120, (S.view[2] - S.view[0]) * .85, INTER_K), '#38D6FF', font=INTER_K)
def s_h2(c, t, S):
    salao(c, t); tint(c, '#000000', .25)
    kai(c, 760, 1000, 1.0, t, com_escudo=True, face=.4, eyes='half', mouth='flat', brilho=.5); heroi(c, ESP, 1180, 1000, 1.0, t, arma='espada', face=-.4, eyes='half', mouth='smirk')
    poplabel(c, "ALIADO?", 960, 300, t, S.s0 + .2, fit("ALIADO?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#38D6FF', font=INTER_K)
    poplabel(c, "OU ARMADILHA?", 960, 420, t, S.s0 + 1.6, fit("OU ARMADILHA?", 90, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
def s_h3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814'))
    kai(c, 760, 1150, 1.0, t, com_escudo=True, face=.2, mouth='flat', brilho=.8); nina(c, 980, 1150, .9, t, face=0, mouth='smirk'); heroi(c, ESP, 1200, 1150, 1.0, t, arma='espada', face=-.2, eyes='half', mouth='flat')
    poplabel(c, "TEMPORADA 2?", 960, 420, t, S.s0 + .1, fit("TEMPORADA 2?", 110, (S.view[2] - S.view[0]) * .85, INTER_K), '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_a2, falas=['a2'], sfx=[('brilho', 0.1, .7)], **V((960, 560), (1.0, 1.1))),
    dict(topo='CASTELO DE VALDORA', draw=s_b1, falas=['b1'], **V(((960, 560), (1200, 600)), (.9, .95))),
    dict(draw=s_b2, falas=['b2'], sfx=[('pop', 0.1, .5), ('pop', 0.3, .5), ('pop', 0.5, .5)], **V((960, 600), (.75, .8))),
    dict(draw=s_b3, falas=['b3'], **V((960, 600), (.8, .85))),
    dict(draw=s_c1, falas=['c1'], sfx=[('brilho', 0.3, .8)], **V((960, 640), (1.0, 1.08))),
    dict(draw=s_c2, falas=['c2'], sfx=[('notif', 0.3, .8)], **V((960, 500), (1.0, 1.05))),
    dict(draw=s_c3, falas=['c3'], sfx=[('notif', 0.05, .6), ('glitch', 1.6, .5)], **V((960, 560), (1.0, 1.0))),
    dict(draw=s_d1, falas=['d1'], **V((960, 640), (1.0, 1.08))),
    dict(draw=s_d2, falas=['d2'], sfx=[('brilho', 0.2, .6)], **V((960, 640), (.75, .78))),
    dict(draw=s_d3, falas=['d3'], sfx=[('paper', 0.1, .5)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_e1, falas=['e1'], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_e2, falas=['e2'], **V(((760, 560), (1160, 560)), (1.0, 1.0))),
    dict(draw=s_e3, falas=['e3'], **V((960, 560), (.8, .85))),
    dict(draw=s_f1, falas=['f1'], **V((960, 640), (.75, .78))),
    dict(draw=s_f2, falas=['f2'], sfx=[('queda', 1.2, .6)], **V((960, 600), (.8, .85))),
    dict(draw=s_g1, falas=['g1'], **V((960, 520), (1.0, 1.08))),
    dict(draw=s_g2, falas=['g2'], sfx=[('steps', 0.05, .6)], **V((960, 600), (.8, .85))),
    dict(draw=s_g3, falas=['g3'], sfx=[('whoosh', 0.2, .9)], **V((1060, 600), (1.0, 1.05))),
    dict(draw=s_g4, falas=['g4'], **V(((800, 600), (1100, 600)), (1.0, 1.0))),
    dict(draw=s_g5, falas=['g5'], sfx=[('boom', 0.4, .9)], shake=[0.4], **V(((900, 600), (1200, 600)), (1.0, 1.0))),
    dict(draw=s_h1, falas=['h1'], sfx=[('boom', 0.1, .7)], **V((960, 540), (1.0, 1.05))),
    dict(draw=s_h2, falas=['h2'], **V((960, 560), (.85, .9))),
    dict(draw=s_h3, falas=['h3'], hold=1.2, **V((980, 640), (.85, .9))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
