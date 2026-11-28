import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
E2 = _load('esc2base', os.path.expanduser('~/vid/escudo2/cenas.py'))
from esc2base import kai, heroi, salao, rei, arco, circulo_magico, KAI, ESP, LAN, ARC
from esc1base import escudo, praca, pergaminho, espada, POVO
from xpbase import painel, impacto, faiscas, linhas_velocidade, tint, pisca

PROJ = os.path.dirname(os.path.abspath(__file__))
kit.DESTAQUES = ['ROUBAR', 'SOZINHA', 'MÃO', 'IGOR', 'ESPADA', 'TREINO', 'TESTAR', 'ESCUDO', 'FORTE', 'DOBRO', 'VOOU', 'CERCA', 'PESADA', 'QUILO', 'LEVE', 'RÁPIDA', 'NOITE', 'CORRENDO', 'ESQUENTAR', 'QUENTE', 'SUMIU', 'VOLTA', 'DONO', 'GOLPE', 'REI', 'FENDA', 'CÉU', 'TRÊS', 'RAIVA', 'VINGAR', 'SOBREVIVER', 'PARTE']


def fenda(c, x, y, s, t, a=1.0):
    if a <= 0: return
    p = skia.Path(); pts = [(0, -260), (40, -150), (-30, -60), (50, 40), (-20, 150), (20, 260)]
    p.moveTo(x + pts[0][0] * s, y + pts[0][1] * s)
    for (px, py) in pts[1:]: p.lineTo(x + px * s, y + py * s)
    add_light(c, x, y, 380 * s, '#B03AFF', 200 * a); c.drawPath(p, ink(46 * s, '#7A1EFF', 160 * a)); c.drawPath(p, ink(16 * s, '#F2D6FF', 255 * a))
def quarto_castelo(c, t, noite=True):
    c.drawRect(skia.Rect(-900, -400, W + 900, 800), fp('#5A5266'))
    for j, y in enumerate(range(-400, 800, 80)):
        for x in range(-900 + (j % 2) * 80, W + 900, 160): rect(c, x + 3, y + 3, x + 157, y + 77, '#655C72', 2, r=6)
    rect(c, 1320, 160, 1560, 520, '#1A2340', LW, r=120); c.drawCircle(1440, 300, 40, fp('#F4F1D8'))
    c.drawRect(skia.Rect(-900, 800, W + 900, H + 600), fp('#4A3A2A'))
    rect(c, 560, 640, 1140, 860, '#7A5A3C', LW, r=20); rect(c, 580, 600, 1120, 700, '#E8E2D2', LW, r=20); rect(c, 600, 610, 760, 680, '#FFFFFF', LW * .7, r=24)
    if noite: tint(c, '#0A1136', .45)
def escada(c, t, noite=True):
    c.drawRect(skia.Rect(-900, -400, W + 900, H + 600), fp('#4A4458'))
    for i in range(12): x0 = 200 + i * 120; y0 = 1000 - i * 70; rect(c, x0, y0, x0 + 140, y0 + 70, '#6F6A78', LW * .8)
    for (x, y) in ((420, 400), (1300, 200)): rect(c, x - 10, y, x + 10, y + 80, '#5A3A22', 3); c.drawCircle(x, y - 20, 22, fp('#FF9A3D')); add_light(c, x, y - 20, 200, '#FFB347', 160)
    if noite: tint(c, '#0A1136', .4)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    escada(c, t); heroi(c, ESP, 960, 1000, 1.0, t, face=-.7, eyes='half', mouth='smirk', arms=('hold', 'down')); escudo(c, 890, 760, .9, rot=-8)
def s_a2(c, t, S):
    quarto_castelo(c, t); u = K(t, S.s0 + .2, .5); kai(c, 1250, 1000, 1.0, t, face=-.4, eyes='wide', mouth='o', arms=('hold', 'down'))
    escudo(c, lerp(200, 1180, ease_out(u)), lerp(400, 750, ease_out(u)), .95, rot=360 * u, brilho=1 - u * .5); linhas_velocidade(c, 1180, 750, t, .4 * (1 - u))
def s_b1(c, t, S):
    praca(c, t); heroi(c, ESP, 1250, 1030, 1.0, t, arma='espada', face=-.6, mouth='smile'); kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, mouth='flat')
def s_b2(c, t, S): blur_begin(c, 12); praca(c, t); c.restore(); heroi(c, ESP, 960, 1320, 1.9, t, face=-.2, eyes='half', mouth='smirk', brow=.5, brow_tilt=.6)
def s_b3(c, t, S): blur_begin(c, 10); praca(c, t); c.restore(); escudo(c, 960, 600, 2.0, racha=True); poplabel(c, "?", 1250, 250, t, S.s0 + .3, 140, '#FFFFFF', font=INTER_K)
def s_b4(c, t, S):
    praca(c, t); u = K(t, S.s0, .6); ph = (t - S.s0) * 12
    heroi(c, ESP, lerp(1400, 1080, u), 1030, 1.0, t, face=-.8, eyes='half', mouth='open', arms=('down', ('down', 'hat', u)), legs=walk_legs(ph, 70, 30) if u < 1 else None)
    espada(c, lerp(1400, 1080, u) + 60, 560 + 120 * K(t, S.s0 + .5, .2), 1.1, lerp(-30, 60, K(t, S.s0 + .5, .2)))
    kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, eyes='half', mouth='flat'); linhas_velocidade(c, 900, 600, t, .4 * K(t, S.s0 + .4, .2))
def s_b5(c, t, S):
    praca(c, t); hit = S.s0 + .15; kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, eyes='half', mouth='flat', brilho=1 - K(t, hit + .3, .5))
    heroi(c, ESP, 1080, 1030, 1.0, t, face=-.8, eyes='wide', mouth='o'); impacto(c, (t - hit) / .08); faiscas(c, 860, 720, t, hit, 28, '#BFF4FF')
    poplabel(c, "x2", 960, 320, t, hit + .2, 140, '#38D6FF', font=INTER_K)
def s_b6(c, t, S):
    praca(c, t); u = K(t, S.s0, 1.4); linhas_velocidade(c, 1100, 500, t, .5 * (1 - u))
    c.save(); c.translate(lerp(1080, 2300, ease_out(u)), 1030 - 760 * math.sin(math.pi * u * .9)); c.rotate(400 * u); heroi(c, ESP, 0, 0, 1.0, t, eyes='closed', mouth='o'); c.restore()
    kai(c, 700, 1030, 1.0, t, com_escudo=True, face=.6, eyes='wide', mouth='o')
def s_c1(c, t, S): c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); espada(c, 960, 760, 2.0, 0)
def s_c2(c, t, S):
    pergaminho(c, S, t); line(c, 960, 380, 960, 820, 10, '#7A5A3C'); line(c, 720, 420, 1200, 420, 10, '#7A5A3C')
    for x in (720, 1200): line(c, x, 420, x, 560, 3, '#5A3A22'); oval(c, x - 90, 560, x + 90, 600, '#C9A227', 4)
    espada(c, 720, 540, .45, 90); poplabel(c, "~1,2 kg", 1180, 660, t, S.s0 + .6, 60, '#7A3B1A', font=INTER_K, stroke=0)
def s_c3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A1A24')); a = math.sin((t - S.s0) * 9) * 50; espada(c, 960, 700, 1.6, a); linhas_velocidade(c, 960, 500, t, .3, '#FFFFFF')
    poplabel(c, "RÁPIDA", 960, 300, t, S.s0 + .4, 100, '#FFE14A', font=INTER_K)
def s_d1(c, t, S):
    quarto_castelo(c, t); c.save(); c.translate(1080, 690); c.rotate(-90); c.translate(-1080, -690); kai(c, 1080, 690, .8, t, eyes='closed'); c.restore()
    rect(c, 850, 640, 1120, 760, '#3E6FA8', LW, r=20); escudo(c, 1250, 760, .7, rot=10)
    c.saveLayer(None, fp((0, 0, 0), 200)); heroi(c, ESP, lerp(300, 520, K(t, S.s0, 1.6)), 1000, 1.0, t, face=.7, eyes='half', mouth='smirk', legs=walk_legs((t - S.s0) * 5, 30, 10)); c.restore()
def s_d2(c, t, S):
    blur_begin(c, 10); quarto_castelo(c, t); c.restore(); u = K(t, S.s0 + .1, .4)
    escudo(c, lerp(1250, 1100, u), lerp(760, 620, u), 1.4, rot=10 - 18 * u); poplabel(c, "!", 760, 300, t, S.s0 + .3, 140, '#FF5F5F', font=INTER_K)
def s_d3(c, t, S):
    escada(c, t); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 13; x = lerp(1500, 600, u); y = lerp(300, 950, u)
    heroi(c, ESP, x, y, .95, t, face=-.8, eyes='wide', mouth='open', arms=('hold', 'down'), legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph))); escudo(c, x - 70, y - 240, .85, rot=-8)
def s_d4(c, t, S):
    escada(c, t); k = K(t, S.s0 + .4, 1.2)
    heroi(c, ESP, 960, 1000, 1.0, t, face=0, eyes='wide', mouth='o', arms=('hold', 'down'), sweat=t - S.s0); escudo(c, 890, 760, .95, rot=-8)
    add_light(c, 890, 760, 300, '#FF6B2A', 220 * k); tint(c, '#FF4A1A', .12 * k)
def s_d5(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A0A08')); escudo(c, 960, 600, 2.2); add_light(c, 960, 600, 500, '#FF6B2A', 255)
    for i in range(8): a = t * 2 + i; c.drawCircle(960 + math.cos(a) * 340, 600 + math.sin(a) * 340, 10, fp('#FFB347', 220))
    poplabel(c, "QUENTE", 960, 1000, t, S.s0 + .1, 100, '#FF6B2A', font=INTER_K)
def s_d6(c, t, S):
    escada(c, t); u = K(t, S.s0 + .2, .3)
    heroi(c, ESP, 960, 1000, 1.0, t, face=0, eyes='wide', mouth='open', arms=('hold', 'down'))
    if u < 1:
        c.save(); c.translate(890, 760); c.scale(1 - u, 1 - u); escudo(c, 0, 0, .95, rot=-8, brilho=1); c.restore()
    for i in range(16): a = i * .4 + t; c.drawCircle(890 + math.cos(a) * 160 * u, 760 + math.sin(a) * 160 * u, 8 * (1 - u) + 2, fp('#BFF4FF', 220))
def s_d7(c, t, S):
    quarto_castelo(c, t); c.save(); c.translate(1080, 690); c.rotate(-90); c.translate(-1080, -690); kai(c, 1080, 690, .8, t, eyes='closed'); c.restore()
    rect(c, 850, 640, 1120, 760, '#3E6FA8', LW, r=20); u = K(t, S.s0 + .2, .4); c.save(); c.translate(1250, 760); c.scale(u, u); escudo(c, 0, 0, .7, rot=10, brilho=1 - u * .7); c.restore()
def s_e1(c, t, S):
    blur_begin(c, 12); quarto_castelo(c, t); c.restore(); escudo(c, 960, 760, 1.8, brilho=.6)
    painel(c, S, t, S.s0, "SISTEMA", [("Arma lendária vinculada.", '#FFFFFF'), ("Só obedece ao dono.", '#38D6FF')], y=S.view[1] + 150)
def s_e2(c, t, S):
    escada(c, t); u = K(t, S.s0 + .3, .8)
    c.save(); c.translate(960, 1000); c.rotate(-80 * ease_out(u)); c.translate(-960, -1000); heroi(c, ESP, 960, 1000, 1.0, t, eyes='closed', mouth='o'); c.restore()
    impacto(c, (t - S.s0 - .3) / .07); poplabel(c, "x2", 960, 300, t, S.s0 + .4, 140, '#38D6FF', font=INTER_K)
def s_f1(c, t, S):
    salao(c, t); rei(c, 960, 1000, 1.0, t, face=0, mouth='flat', arms=('present', 'present'))
    for i, (sp_, x) in enumerate(((ESP, 520), (LAN, 700), (ARC, 1220), (KAI, 1400))): draw_char(c, x, 1060, .75, sp_, face=.5 if x < 960 else -.5, eyes=pisca(t, i), mouth='flat')
def s_f2(c, t, S):
    praca(c, t); tint(c, '#2A1040', .35 * K(t, S.s0, .8)); fenda(c, 960, 150, 1.0, t, K(t, S.s0 + .3, .8))
    poplabel(c, "3 DIAS", 960, 470, t, S.s0 + 1.2, 120, '#C77DFF', font=INTER_K)
def s_f3(c, t, S):
    salao(c, t)
    for i, (sp_, x, a) in enumerate(((ESP, 560, 'espada'), (LAN, 800, None), (ARC, 1120, 'arco'))): heroi(c, sp_, x, 1000, .8, t, arma=a, face=0, mouth='flat')
    kai(c, 1360, 1000, .8, t, com_escudo=True, face=-.3, mouth='flat')
def s_g1(c, t, S):
    blur_begin(c, 12); salao(c, t); c.restore(); tint(c, '#2A0A10', .2)
    heroi(c, ESP, 960, 1320, 1.9, t, face=.4, eyes='half', mouth='flat', brow=1, brow_tilt=.9, rim='#FF5F5F')
def s_g2(c, t, S):
    praca(c, t); tint(c, '#2A1040', .3); fenda(c, 960, 150, .9, t)
    kai(c, 760, 1030, 1.0, t, com_escudo=True, face=.4, mouth='flat'); heroi(c, ESP, 1200, 1030, 1.0, t, arma='espada', face=-.5, eyes='half', mouth='flat')
    poplabel(c, "VINGANÇA?", 960, 420, t, S.s0 + .3, fit("VINGANÇA?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#FF5F5F', font=INTER_K)
    poplabel(c, "OU ALIANÇA?", 960, 540, t, S.s0 + 1.8, fit("OU ALIANÇA?", 100, (S.view[2] - S.view[0]) * .8, INTER_K), '#38D6FF', font=INTER_K)
def s_g3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); fenda(c, 960, 260, .8, t); kai(c, 960, 1150, 1.2, t, com_escudo=True, face=0, eyes='half', mouth='flat', brilho=.6)
    poplabel(c, "PARTE 3?", 960, 680, t, S.s0 + .1, 130, '#38D6FF', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 600), (1.0, 1.06))),
    dict(draw=s_a2, falas=['a2'], sfx=[('whoosh', 0.2, .8)], **V(((900, 600), (1200, 640)), (1.0, 1.0))),
    dict(topo='PÁTIO DO CASTELO', draw=s_b1, falas=['b1'], **V(((700, 600), (1250, 600)), (1.0, 1.0))),
    dict(draw=s_b2, falas=['b2'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_b3, falas=['b3'], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_b4, falas=['b4'], sfx=[('whoosh', 0.4, .9)], **V((900, 600), (1.0, 1.06))),
    dict(draw=s_b5, falas=['b5'], sfx=[('boom', 0.15, 1.0)], shake=[0.15], **V((880, 620), (1.1, 1.0))),
    dict(draw=s_b6, falas=['b6'], sfx=[('whoosh', 0.05, .9)], **V(((960, 560), (1500, 400)), (1.0, .85))),
    dict(draw=s_c1, falas=['c1'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_c2, falas=['c2'], sfx=[('paper', 0.1, .5)], **V((960, 560), (.8, .85))),
    dict(draw=s_c3, falas=['c3'], sfx=[('whoosh', 0.2, .6), ('whoosh', 0.7, .6)], **V((960, 600), (1.0, 1.06))),
    dict(topo='MEIA-NOITE', draw=s_d1, falas=['d1'], sfx=[('steps', 0.2, .5)], **V(((500, 600), (900, 640)), (1.0, 1.0))),
    dict(draw=s_d2, falas=['d2'], **V((1100, 620), (1.0, 1.08))),
    dict(draw=s_d3, falas=['d3'], sfx=[('steps', 0.05, .7)], **V(((1400, 400), (700, 760)), (1.0, 1.0))),
    dict(draw=s_d4, falas=['d4'], **V((960, 600), (1.0, 1.08))),
    dict(draw=s_d5, falas=['d5'], sfx=[('brilho', 0.1, .5)], **V((960, 640), (1.0, 1.12))),
    dict(draw=s_d6, falas=['d6'], sfx=[('glitch', 0.2, .7)], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_d7, falas=['d7'], sfx=[('brilho', 0.2, .6)], **V((1100, 640), (1.0, 1.06))),
    dict(draw=s_e1, falas=['e1'], sfx=[('notif', 0.1, .8)], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_e2, falas=['e2'], sfx=[('thud', 0.3, .9)], shake=[0.3], **V((960, 600), (1.1, 1.0))),
    dict(topo='MANHÃ SEGUINTE', draw=s_f1, falas=['f1'], **V((960, 600), (.75, .8))),
    dict(draw=s_f2, falas=['f2'], sfx=[('boom', 0.3, .8)], **V(((960, 600), (960, 300)), (1.0, .9))),
    dict(draw=s_f3, falas=['f3'], **V((960, 600), (.8, .85))),
    dict(draw=s_g1, falas=['g1'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_g2, falas=['g2'], **V((960, 560), (.85, .9))),
    dict(draw=s_g3, falas=['g3'], hold=1.0, **V((960, 600), (.9, .95))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
