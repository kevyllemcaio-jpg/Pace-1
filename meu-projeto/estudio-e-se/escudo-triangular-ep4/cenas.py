import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
_load('esc4base', os.path.expanduser('~/vid/escudo4/cenas.py'))
from esc4base import nina, barreira
from esc3base import fenda
from esc2base import kai, heroi, arco, ESP, LAN, ARC
from esc1base import escudo, praca, espada, lanca, POVO
from xpbase import goblin, chefe, painel, impacto, faiscas, linhas_velocidade, tint, pisca

PROJ = os.path.dirname(os.path.abspath(__file__))
CRIANCA = [dict(MODELOS['menino'], figurante=True), dict(MODELOS['menina'], figurante=True)]
kit.DESTAQUES = ['FORTES', 'FUGISSEM', 'ESCUDO', 'FENDA', 'VILA', 'MONSTROS', 'GLÓRIA', 'ESPADA', 'ERROU', 'LANÇA', 'QUEBROU', 'FLECHAS', 'ACABARAM', 'CORRERAM', 'RAIO', 'TROVÃO', 'TRÊS', 'QUILÔMETROS', 'SEGUNDO', 'BARREIRA', 'CRIANÇAS', 'GIGANTE', 'SOCO', 'SEGUROU', 'DOBRO', 'VOOU', 'FECHAR', 'KAI', 'MORRO', 'VOZ', 'FINALMENTE', 'BRILHOU', 'PARTE']


def vila(c, t, ceu=.5): praca(c, t); tint(c, '#2A1040', .3 * ceu)
def raio(c, x, t, t0):
    u = t - t0
    if not 0 <= u < .35: return
    p = skia.Path(); pts = [(0, -400), (-60, -180), (40, -60), (-40, 140), (30, 380)]; p.moveTo(x + pts[0][0], pts[0][1])
    for px, py in pts[1:]: p.lineTo(x + px, py)
    c.drawPath(p, ink(28, '#BFD7FF', 200)); c.drawPath(p, ink(9, '#FFFFFF')); tint(c, '#FFFFFF', .35 * (1 - u / .35))


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    vila(c, t); fenda(c, 960, 150, 1.0, t)
    for i, (sp_, x) in enumerate(((ESP, 640), (LAN, 960), (ARC, 1280))):
        ph = (t - S.s0) * 12 + i; heroi(c, sp_, x - 200 * K(t, S.s0, 1.5), 1030, .85, t, face=-.8, eyes='wide', mouth='open', legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)), arms=('gesture', 'gesture'))
def s_a2(c, t, S):
    vila(c, t, 1); fenda(c, 960, 150, 1.0, t); kai(c, 960, 1030, 1.1, t, com_escudo=True, face=0, eyes='half', mouth='flat', brilho=.6)
def s_b1(c, t, S): vila(c, t, K(t, S.s0, 1.2)); fenda(c, 960, 200, 1.6, t, K(t, S.s0 + .3, .8))
def s_b2(c, t, S):
    vila(c, t, 1); fenda(c, 960, 160, 1.4, t); d = S.s1 - S.s0
    for i in range(5):
        u = K(t, S.s0 + i * .3, .8); x = 560 + i * 200; goblin(c, x, lerp(200, 1030, ease(u)), .7, t, face=0, eyes='wide', mouth='open', arms=('gesture', 'gesture'))
def s_b3(c, t, S):
    vila(c, t, 1); fenda(c, 960, 160, 1.2, t)
    for i, (sp_, x, a) in enumerate(((ESP, 640, 'espada'), (LAN, 960, 'lanca'), (ARC, 1280, 'arco'))):
        ph = (t - S.s0) * 10 + i; heroi(c, sp_, x + 120 * K(t, S.s0, 1.5), 1030, .85, t, arma=a, face=.7, mouth='open', legs=walk_legs(ph, 60, 25), bob=6 * abs(math.sin(ph)))
    goblin(c, 1650, 1030, .8, t, face=-.6, mouth='open')
def s_b4(c, t, S):
    vila(c, t, 1); u = K(t, S.s0, .4); heroi(c, ESP, 860, 1030, 1.0, t, face=.7, eyes='wide', mouth='o', arms=('down', ('down', 'hat', u)))
    espada(c, 960 + 200 * u, 560 + 300 * u, 1.0, 30 + 120 * u); goblin(c, 1300, 1030, .9, t, face=-.6, mouth='smile', eyes='half'); poplabel(c, "ERROU", (S.view[0] + S.view[2]) / 2, 300, t, S.s0 + .3, fit("ERROU", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
def s_b5(c, t, S):
    vila(c, t, 1); hit = S.s0 + .3; heroi(c, LAN, 860, 1030, 1.0, t, face=.7, eyes='wide', mouth='o', arms=('down', 'push'))
    if t < hit: lanca(c, 1050, 820, .9, 90)
    else: u = K(t, hit, .6); lanca(c, 980, 820 + 200 * u, .5, 90 + 120 * u); lanca(c, 1180, 780 + 260 * u, .5, 90 - 160 * u)
    chefe(c, 1380, 1030, 1.2, t, face=-.5, eyes='half', mouth='smile'); impacto(c, (t - hit) / .06); poplabel(c, "QUEBROU", (S.view[0] + S.view[2]) / 2, 300, t, hit + .1, fit("QUEBROU", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
def s_b6(c, t, S):
    vila(c, t, 1); heroi(c, ARC, 960, 1030, 1.0, t, arma='arco', face=.3, eyes='wide', mouth='o', sweat=t - S.s0)
    rect(c, 820, 560, 880, 760, '#7A5A3C', LW * .7, r=14); poplabel(c, "0 FLECHAS", (S.view[0] + S.view[2]) / 2, 300, t, S.s0 + .2, fit("0 FLECHAS", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
def s_b7(c, t, S):
    vila(c, t, 1); fenda(c, 960, 160, 1.2, t); u = K(t, S.s0, 1.2)
    for i, sp_ in enumerate((ESP, LAN, ARC)):
        ph = (t - S.s0) * 14 + i; heroi(c, sp_, lerp(900 + i * 160, 100 + i * 160, u), 1030, .85, t, face=-.8, eyes='wide', mouth='open', legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)), arms=('gesture', 'gesture'))
    chefe(c, 1500, 1030, 1.6, t, face=-.6, eyes='half', mouth='open')
def s_c1(c, t, S): vila(c, t, 1); fenda(c, 960, 160, 1.2, t); raio(c, 1200, t, S.s0 + .2)
def s_c2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#141C30')); raio(c, 760, t, S.s0 + .1)
    d = S.v.fala_util('c2'); n = min(3, int(max(0, t - S.s0 - d * .45) / .5) + (1 if t > S.s0 + d * .45 else 0))
    for i in range(n): circ(c, 860 + i * 110, 560, 40, '#FFE14A', 4); label(c, str(i + 1), 860 + i * 110, 580, 50, '#14121A', font=INTER_K, align='center', skew=0)
    poplabel(c, "÷ 3", 1180, 760, t, S.s0 + d * .8, 90, '#FFFFFF', font=INTER_K)
def s_c3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#141C30'))
    poplabel(c, "3 s = 1 km", 960, 560, t, S.s0 + .1, fit("3 s = 1 km", 130, (S.view[2] - S.view[0]) * .85, INTER_K), '#FFE14A', font=INTER_K, stroke=16)
def s_c4(c, t, S):
    vila(c, t, 1); raio(c, 1300, t, S.s0 + .05); chefe(c, 1350, 1030, 2.2, t, face=-.6, eyes='half', mouth='open', arms=('hat', 'down'))
    kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o')
def s_d1(c, t, S):
    vila(c, t, 1); fenda(c, 960, 160, 1.0, t); barreira(c, 960, 1080, 820, t, K(t, S.s0 + .3, .5))
    kai(c, 960, 1030, 1.05, t, com_escudo=True, face=0, eyes='half', mouth='open', brilho=1)
    for i, sp_ in enumerate(POVO): draw_char(c, 560 + i * 270 + (100 if i > 1 else -100), 1060, .75, sp_, face=0, eyes='wide', mouth='o')
def s_d2(c, t, S):
    vila(c, t, 1); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 10; barreira(c, 760, 1080, 640, t)
    nina(c, lerp(1500, 900, u), 1030, .95, t, face=-.8, mouth='open', legs=walk_legs(ph, 60, 25), arms=('push', 'push'), martelo=False)
    for i, sp_ in enumerate(CRIANCA): draw_char(c, lerp(1640, 1040, u) + i * 140, 1030, .8, sp_, face=-.8, eyes='wide', mouth='o', legs=walk_legs(ph + i, 50, 20))
def s_d3(c, t, S):
    vila(c, t, 1); u = K(t, S.s0 + .2, .5); chefe(c, 1300, 1030, 2.4, t, face=-.6, eyes='wide', mouth='open', arms=('down', ('hat', 'push', u)))
    barreira(c, 700, 1080, 520, t); kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, eyes='half', mouth='flat', brilho=1); linhas_velocidade(c, 1000, 600, t, .5 * u)
def s_d4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A1420')); hit = S.s0 + .1; barreira(c, 960, 1080, 700, t)
    escudo(c, 960, 600, 2.0, brilho=1, racha=False); impacto(c, (t - hit) / .07); faiscas(c, 960, 520, t, hit, 40, '#BFF4FF')
def s_d5(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A1420')); linhas_velocidade(c, 960, 560, t, 1, '#BFF4FF', 100)
    escudo(c, 960, 600, 2.0, brilho=1, racha=False); poplabel(c, "x2", 960, 260, t, S.s0 + .1, 160, '#38D6FF', font=INTER_K, stroke=16)
def s_d6(c, t, S):
    vila(c, t, 1); fenda(c, 960, 160, 1.4, t); u = K(t, S.s0, 1.4)
    c.save(); c.translate(lerp(1300, 960, u), lerp(1030, 200, ease_out(u))); c.rotate(500 * u); c.scale(1 - .8 * u, 1 - .8 * u); chefe(c, 0, 0, 2.0, t, eyes='closed', mouth='o'); c.restore()
    kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.5, eyes='wide', mouth='o', brilho=.6)
def s_e1(c, t, S): vila(c, t, 1 - K(t, S.s0, 2)); fenda(c, 960, 160, 1.4 * (1 - K(t, S.s0 + .2, 1.6)) + .01, t)
def s_e2(c, t, S):
    praca(c, t)
    for i, sp_ in enumerate(POVO + CRIANCA): draw_char(c, 420 + i * 220, 1030, .85, sp_, face=0, eyes='closed', mouth='open', arms=('gesture', 'gesture'), bob=8 * abs(math.sin(t * 8 + i)))
    poplabel(c, "KAI! KAI!", 960, 300, t, S.s0 + .2, fit("KAI! KAI!", 110, (S.view[2] - S.view[0]) * .85, INTER_K), '#FFE14A', font=INTER_K)
def s_e3(c, t, S):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), sp(linear(0, -300, 0, 800, [hx('#6FB3E8'), hx('#D8EEFA')])))
    p = skia.Path(); p.moveTo(-900, 1400); p.quadTo(960, 500, 2800, 1400); p.close(); shape(c, p, '#5FA84A')
    for i, (sp_, x) in enumerate(((ESP, 760), (LAN, 960), (ARC, 1160))): heroi(c, sp_, x, 960, .9, t, face=.6, eyes='half', mouth='flat')
def s_f1(c, t, S): vila(c, t, .6); fenda(c, 960, 160, .5 + .1 * math.sin(t * 9), t); kai(c, 960, 1030, 1.05, t, com_escudo=True, face=0, eyes='wide', mouth='o')
def s_f2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#08040E')); fenda(c, 960, 300, .7, t)
    escudo(c, 960, 760, 1.6, brilho=.5 + .5 * abs(math.sin(t * 6)), racha=False)
    label(c, "ESCUDO...", 960, 1100, 70, '#C77DFF', font=INTER_K, align='center', skew=0, alpha=K(t, S.s0, .3))
def s_g1(c, t, S):
    vila(c, t, .6); fenda(c, 960, 160, .3, t); kai(c, 820, 1030, 1.0, t, com_escudo=True, face=.3, eyes='half', mouth='flat', brilho=.8); nina(c, 1080, 1030, .95, t, face=-.3, mouth='o')
    poplabel(c, "QUEM?", 960, 420, t, S.s0 + .2, 120, '#C77DFF', font=INTER_K)
def s_g2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); fenda(c, 960, 260, .6, t)
    kai(c, 860, 1150, 1.1, t, com_escudo=True, face=.2, mouth='flat', brilho=.8); nina(c, 1100, 1150, 1.0, t, face=-.2, mouth='smirk')
    poplabel(c, "PARTE 5?", 960, 680, t, S.s0 + .1, 130, '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], sfx=[('steps', 0.1, .6)], **V((960, 600), (.85, .9))),
    dict(draw=s_a2, falas=['a2'], **V((960, 560), (1.0, 1.08))),
    dict(topo='O DIA DA FENDA', draw=s_b1, falas=['b1'], sfx=[('boom', 0.3, .9)], shake=[0.3], **V(((960, 700), (960, 320)), (1.0, .9))),
    dict(draw=s_b2, falas=['b2'], sfx=[('thud', 0.8, .6), ('thud', 1.1, .6), ('thud', 1.4, .6)], **V((960, 620), (.75, .8))),
    dict(draw=s_b3, falas=['b3'], **V(((760, 600), (1300, 600)), (1.0, 1.0))),
    dict(draw=s_b4, falas=['b4'], sfx=[('whoosh', 0.1, .7)], **V((1000, 620), (1.0, 1.05))),
    dict(draw=s_b5, falas=['b5'], sfx=[('thud', 0.3, .8)], shake=[0.3], **V((1060, 620), (1.0, 1.05))),
    dict(draw=s_b6, falas=['b6'], **V((960, 600), (1.0, 1.08))),
    dict(draw=s_b7, falas=['b7'], sfx=[('steps', 0.05, .7)], **V(((900, 600), (500, 600)), (1.0, 1.0))),
    dict(draw=s_c1, falas=['c1'], sfx=[('boom', 0.2, 1.0)], **V((1100, 500), (1.0, 1.05))),
    dict(draw=s_c2, falas=['c2'], sfx=[('relogio', 1.5, .5)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_c3, falas=['c3'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_c4, falas=['c4'], sfx=[('boom', 0.05, .9)], shake=[0.05], **V(((900, 620), (1100, 520)), (.85, .8))),
    dict(draw=s_d1, falas=['d1'], sfx=[('brilho', 0.3, .8)], **V((960, 640), (.75, .8))),
    dict(draw=s_d2, falas=['d2'], sfx=[('steps', 0.05, .6)], **V(((1300, 600), (900, 600)), (1.0, 1.0))),
    dict(draw=s_d3, falas=['d3'], sfx=[('whoosh', 0.3, .9)], **V(((1200, 520), (900, 600)), (1.0, 1.0))),
    dict(draw=s_d4, falas=['d4'], sfx=[('boom', 0.1, 1.0)], shake=[0.1], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_d5, falas=['d5'], sfx=[('subida', 0.05, .7)], **V((960, 600), (1.1, 1.0))),
    dict(draw=s_d6, falas=['d6'], sfx=[('whoosh', 0.05, .9), ('boom', 1.2, .7)], **V(((1100, 700), (960, 300)), (.9, .8))),
    dict(draw=s_e1, falas=['e1'], sfx=[('glitch', 0.3, .6)], **V((960, 420), (.9, .95))),
    dict(draw=s_e2, falas=['e2'], **V((960, 600), (.75, .8))),
    dict(draw=s_e3, falas=['e3'], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_f1, falas=['f1'], **V((960, 520), (.9, .95))),
    dict(draw=s_f2, falas=['f2'], sfx=[('boom', 0.2, .7)], **V((960, 640), (.95, 1.05))),
    dict(draw=s_g1, falas=['g1'], **V((960, 560), (.85, .9))),
    dict(draw=s_g2, falas=['g2'], hold=1.0, **V((960, 600), (.9, .95))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
