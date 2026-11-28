import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
_sp = importlib.util.spec_from_file_location('xpbase', os.path.expanduser('~/vid/xp/cenas.py')); X = importlib.util.module_from_spec(_sp); sys.modules['xpbase'] = X; _sp.loader.exec_module(X)
from xpbase import masmorra, luz_masmorra, painel, goblin, impacto, linhas_velocidade, faiscas, tint, rnd, pisca, head, sombra, xp_pop, CYAN, REDS

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {'rafa': dict(corpo='homem', skin='#E0AC69', top='hoodie', suit='#C0392B', print='#F4EFE2', hair='medio', hair_col='#4A2E1C')})
RAFA = EL['rafa']
kit.DESTAQUES = ['MASMORRA', 'MUNDO', 'REAL', 'NOVENTA', 'REM', 'SONHO', 'PARALISADO', 'CORRENDO', 'SONHADOR', 'LADRÃO', 'ROUBAR', 'BAÚS', 'OURO', 'FERRO', 'MADEIRA', 'MOEDA', 'DESPERTADOR', 'GOBLIN', 'CÉREBRO', 'CORAÇÃO', 'VERDADE', 'GRITOU', 'DEZ', 'SUANDO', 'BAÚ', 'FECHADO', 'BARULHO', 'DENTRO', 'DEVOLVE', 'ABRE', 'PARTE']
OURO, FERRO, MADEIRA = '#F2C14E', '#8D99AE', '#8B5A2B'


def rafa(c, x, y, s, t, **kw): kw.setdefault('eyes', pisca(t)); draw_char(c, x, y, s, RAFA, **kw)
def deitado(c, t, olhos='closed', boca='flat', x=1080, y=690, cobre=True):
    c.save(); c.translate(x, y); c.rotate(-90); c.translate(-x, -y); rafa(c, x, y, .8, t, face=.3, eyes=olhos, mouth=boca); c.restore()
    if cobre: rect(c, 850, 640, 1200, 760, '#5B3E8C', LW, r=20)
def quarto(c, t, noite=True):
    cenario(c, 'quarto', t)
    if noite: tint(c, '#0A1136', .45); add_light(c, 1500, 280, 260, '#BFD7FF', 90)
def relogio(c, x, y, r, txt, t, cor='#FF3B3B'):
    rect(c, x - r, y - r * .6, x + r, y + r * .6, '#1E1A22', LW, r=r * .2)
    f = skia.Font(INTER_K, r * .62); c.drawString(txt, x - f.measureText(txt) / 2, y + r * .22, f, fp(cor)); add_light(c, x, y, r * 1.4, cor, 70)
def raiox_fundo(c):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), sp(radial(960, 540, 1100, [hx('#0F3A4E'), hx('#071820')])))
    for i in range(-30, 60): line(c, i * 60, -900, i * 60, 2000, 1, '#38D6FF', 22); line(c, -900, i * 60, 3000, i * 60, 1, '#38D6FF', 22)
def cabeca_raiox(c, x, y, s, t, brilho=0.0):
    p = skia.Path(); p.addCircle(x, y, 230 * s); c.drawPath(p, fp('#38D6FF', 30)); c.drawPath(p, ink(5, '#8FE8FF', 200))
    b = skia.Path()
    for i in range(10): a = i / 10 * 6.283; b.addCircle(x + math.cos(a) * 95 * s, y - 30 * s + math.sin(a) * 70 * s, 70 * s)
    c.drawPath(b, fp('#E98BB0', 200)); c.drawPath(b, ink(3, '#FFC2D8', 200))
    for k in range(6): c.drawLine(x - 120 * s + k * 45 * s, y - 80 * s, x - 100 * s + k * 45 * s, y + 20 * s, ink(3, '#B05A80', 160))
    if brilho: add_light(c, x, y - 30 * s, 260 * s, '#FFE14A', 200 * brilho)
    for k in range(5): rect(c, x - 30 * s, y + 230 * s + k * 60 * s, x + 30 * s, y + 270 * s + k * 60 * s, '#8FE8FF', 2, r=8)
def bau(c, x, y, s, cor, aberto=0.0, luz=0.0):
    if luz: c.drawPath(cone_path(x, -200, 60, 420 * s, y + 200, 0), fp('#FFF2C8', 60 * luz, blur=20)); add_light(c, x, y - 100 * s, 300 * s, '#FFF2C8', 80 * luz)
    rect(c, x - 130 * s, y - 150 * s, x + 130 * s, y, cor, LW, r=14 * s)
    if aberto > 0: rect(c, x - 120 * s, y - 160 * s - 40 * s * aberto, x + 120 * s, y - 140 * s, '#2B1A10', LW * .8, r=10 * s)
    c.save(); c.translate(x - 130 * s, y - 150 * s - 70 * s * aberto); c.rotate(-14 * aberto); rect(c, 0, -90 * s, 260 * s, 0, clarear(cor, .15), LW, r=40 * s); c.restore()
    for dx in (-80, 80): rect(c, x + dx * s - 14 * s, y - 150 * s, x + dx * s + 14 * s, y, escurecer(cor, .7), 3)
    rect(c, x - 20 * s, y - 120 * s, x + 20 * s, y - 70 * s, '#2B2233', 3, r=6)
    if aberto > .5: add_light(c, x, y - 160 * s, 200 * s, '#FFE14A', 180 * aberto)
def moeda(c, x, y, r, t):
    w = abs(math.cos(t * 2.5)) * .85 + .15
    c.save(); c.translate(x, y); c.scale(w, 1); circ(c, 0, 0, r, '#F2C14E', LW); circ(c, 0, 0, r * .75, '#FFD86B', 4)
    circ(c, 0, 0, r * .35, '#C9962A', 3); c.restore(); add_light(c, x, y, r * 2.4, '#FFE14A', 140)
def mao(c, x, y, s, rot=0):
    c.save(); c.translate(x, y); c.rotate(rot)
    for i in range(4): rect(c, -95 * s + i * 52 * s, -260 * s, -55 * s + i * 52 * s, -120 * s, '#E0AC69', LW * .8, r=20 * s)
    rect(c, -110 * s, -150 * s, 110 * s, 80 * s, '#E0AC69', LW, r=60 * s)
    p = skia.Path(); p.addRRect(skia.RRect.MakeRectXY(skia.Rect(-190 * s, -90 * s, -110 * s, 20 * s), 40 * s, 40 * s)); shape(c, p, '#E0AC69')
    rect(c, -120 * s, 70 * s, 120 * s, 500 * s, '#C0392B', LW, r=10 * s); c.restore()
def coracao(c, x, y, s, t, bpm):
    k = 1 + .12 * max(0, math.sin(t * bpm / 60 * 6.283)) ** 8
    c.save(); c.translate(x, y); c.scale(s * k, s * k)
    p = skia.Path(); p.moveTo(0, 90); p.cubicTo(-160, -20, -110, -150, 0, -70); p.cubicTo(110, -150, 160, -20, 0, 90); shape(c, p, '#E63946')
    c.restore(); add_light(c, x, y, 260 * s, '#FF4D6D', 120)


# ---------------------------------------------------------------- tomadas (uma por pedaço de fala)
def s_a1(c, t, S):
    quarto(c, t); deitado(c, t)
    for i in range(3): u = ((t * .5 + i / 3) % 1); label(c, "z", 800 + u * 60, 520 - u * 140, 46 + i * 14, '#BFD7FF', font=MARKER, alpha=1 - u)
def s_a2(c, t, S):
    masmorra(c, t); rafa(c, 960, 1000, 1.0, t, face=0, eyes='wide', mouth='o', arms=('down', 'down')); luz_masmorra(c, t)
def s_a3(c, t, S):
    masmorra(c, t); bau(c, 960, 960, 1.4, OURO, aberto=.8, luz=1); luz_masmorra(c, t, extra=[('pool', 960, 700, 500, .9)])
def s_a4(c, t, S):
    quarto(c, t, noite=False); bau(c, 960, 960, 1.0, OURO); rafa(c, 620, 1000, .9, t, face=.6, eyes='wide', mouth='o')
def s_b1(c, t, S):
    blur_begin(c, 12); quarto(c, t, noite=False); c.restore(); rafa(c, 960, 1300, 2.0, t, face=.2, mouth='smile')
    painel(c, S, t, S.s0 + .1, "RAFA", [("17 ANOS", '#FFFFFF')], y=S.view[1] + 160)
def s_b2(c, t, S):
    quarto(c, t); deitado(c, t); relogio(c, 1320, 560, 70, "23:00", t)
def s_b3(c, t, S):
    raiox_fundo(c); cabeca_raiox(c, 960, 500, 1.2, t, .3)
    x0 = 700; pts = [(0, 0), (60, 1), (120, 3), (200, 3), (260, 1), (300, -1)]; p = skia.Path(); u = K(t, S.s0, S.s1 - S.s0)
    for k in range(3):
        for i, (dx, lv) in enumerate(pts):
            X_ = x0 + k * 180 + dx * .6; Y_ = 860 + lv * 40
            (p.moveTo if (k == 0 and i == 0) else p.lineTo)(X_, Y_)
    c.save(); c.clipRect(skia.Rect(0, 0, x0 + 560 * u, 2000)); c.drawPath(p, ink(8, '#FFE14A')); c.restore()
    label(c, "90 MIN", 960, 1000, 60, '#FFE14A', font=INTER_K, align='center', skew=0)
def s_b4(c, t, S):
    raiox_fundo(c); cabeca_raiox(c, 960, 520, 1.3, t, .8 + .2 * math.sin(t * 6))
    poplabel(c, "REM", 960, 900, t, S.s0 + .3, 120, '#FFE14A', font=INTER_K)
def corpo_raiox(c, x, y, s, t, trava=0.0):
    raiox_fundo(c); circ(c, x, y - 420 * s, 100 * s, None if False else '#0F3A4E', 5, v='#8FE8FF')
    for (a, b) in (((0, -320), (0, -60)), ((-90, -300), (-130, -120)), ((90, -300), (130, -120)), ((-40, -60), (-50, 160)), ((40, -60), (50, 160))):
        line(c, x + a[0] * s, y + a[1] * s, x + b[0] * s, y + b[1] * s, 26 * s, '#8FE8FF', 120); line(c, x + a[0] * s, y + a[1] * s, x + b[0] * s, y + b[1] * s, 8 * s, '#FFFFFF', 200)
    if trava:
        k = back(trava, 1.3); c.save(); c.translate(x, y - 160 * s); c.scale(k, k)
        rect(c, -80, -40, 80, 80, '#FFE14A', LW, r=14); p = skia.Path(); p.addArc(skia.Rect(-50, -120, 50, -10), 180, 180); c.drawPath(p, ink(18, '#FFE14A')); c.restore()
def s_b5(c, t, S): corpo_raiox(c, 960, 860, 1.2, t, K(t, S.s0 + .4, .4))
def s_b6(c, t, S):
    quarto(c, t); deitado(c, t)
    c.saveLayer(None, fp((0, 0, 0), 90)); rafa(c, lerp(1080, 1500, K(t, S.s0, 1.6)), 1000, .8, t, face=.8, eyes='wide', mouth='open', legs=walk_legs((t - S.s0) * 10), arms=('gesture', 'gesture')); c.restore()
def s_c1(c, t, S):
    blur_begin(c, 10); masmorra(c, t); c.restore(); luz_masmorra(c, t, [(500, 300)])
    u = K(t, S.s0 + .3, .4); rafa(c, 960, 1350, 2.3, t, face=0, eyes='closed' if u < .5 else 'wide', mouth='flat')
def s_c2(c, t, S): masmorra(c, t); rafa(c, 960, 1000, .9, t, face=lerp(-.8, .8, K(t, S.s0, 1.2)), eyes='wide', mouth='o'); luz_masmorra(c, t)
def s_c3(c, t, S):
    blur_begin(c, 12); masmorra(c, t); c.restore(); luz_masmorra(c, t); rafa(c, 960, 1420, 2.2, t, face=0, eyes='wide', mouth='o')
    painel(c, S, t, S.s0, "SISTEMA", [("BEM-VINDO, SONHADOR.", '#FFFFFF')], y=S.view[1] + 160)
def s_c4(c, t, S):
    blur_begin(c, 12); masmorra(c, t); c.restore(); luz_masmorra(c, t)
    tempo = 90 * 60 - int((t - S.s0) * 7); poplabel(c, f"{tempo // 60:02d}:{tempo % 60:02d}", 960, 520, t, S.s0, 150, CYAN, font=INTER_K, stroke=16)
    poplabel(c, "TEMPO DE SONHO", 960, 340, t, S.s0 + .1, 60, '#FFFFFF', font=INTER_K)
def s_c5(c, t, S):
    blur_begin(c, 12); masmorra(c, t); c.restore(); luz_masmorra(c, t)
    k = back(K(t, S.s0, .35), 1.2); c.save(); c.translate(960, 560); c.scale(k, k); c.rotate(-4 + 3 * math.sin(t))
    rect(c, -210, -330, 210, 330, '#0B2A4A', 6, r=24, v=(56, 214, 255)); c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-210, -330, 210, 330), 24, 24), fp(CYAN, 50))
    rafa(c, 0, 200, .75, t, face=.3, eyes='half', mouth='smirk', arms=('hip', 'hip'))
    label(c, "LADRÃO", 0, 290, 54, '#FFFFFF', font=INTER_K, align='center', skew=0); c.restore()
def s_c6(c, t, S):
    masmorra(c, t); rafa(c, 960, 1000, 1.05, t, face=.2, eyes='half', mouth='grin' if False else 'smile', arms=('hip', 'hip')); luz_masmorra(c, t)
    xp_pop(c, "ROUBOU = É SEU", 960, 300, t, S.s0 + .3, '#FFE14A', 60)
def s_d1(c, t, S):
    masmorra(c, t)
    for (x, cor) in ((560, OURO), (960, FERRO), (1360, MADEIRA)): bau(c, x, 960, .9, cor, luz=1)
    luz_masmorra(c, t, extra=[('pool', 960, 700, 900, .8)])
def s_d2(c, t, S):
    masmorra(c, t); d = S.v.fala_util('d2')
    for i, (x, cor) in enumerate(((560, OURO), (960, FERRO), (1360, MADEIRA))): bau(c, x, 960, .9, cor, luz=.3 + .7 * K(t, S.s0 + d * i / 3, .2))
    luz_masmorra(c, t, extra=[('pool', 960, 700, 900, .8)])
def s_d3(c, t, S):
    masmorra(c, t); bau(c, 1060, 960, 1.1, MADEIRA, aberto=K(t, S.s0 + .5, .5), luz=1)
    rafa(c, 760, 1000, 1.0, t, face=.6, eyes='half', mouth='flat', arms=('down', ('down', 'push', K(t, S.s0 + .2, .3)))); luz_masmorra(c, t, extra=[('pool', 1060, 700, 500, .8)])
def s_d4(c, t, S): raiox_fundo(c); tint(c, '#000000', .6); moeda(c, 960, 560, 170, t)
def s_d5(c, t, S):
    quarto(c, t, noite=False); relogio(c, 960, 560, 150, "06:30", t)
    if int(t * 8) % 2: poplabel(c, "TRIIIIM", 960, 330, t, S.s0, 80, '#FFFFFF', font=INTER_K)
def s_d6(c, t, S):
    blur_begin(c, 12); quarto(c, t, noite=False); c.restore()
    mao(c, 960, 1080, 1.3, 0); moeda(c, 960, 620, 110, t)
def s_d7(c, t, S):
    blur_begin(c, 12); quarto(c, t, noite=False); c.restore()
    mao(c, 960, 1120, 1.2, 0); rect(c, 790, 260, 1130, 900, '#14121A', LW, r=36); rect(c, 815, 300, 1105, 860, '#F4F6FA', 0, r=16)
    label(c, "ouro", 840, 360, 40, '#333344', font=INTER_B, skew=0); line(c, 830, 380, 1090, 380, 2, '#BBBBC8')
    p = skia.Path(); p.moveTo(840, 760)
    for i, v in enumerate((740, 700, 720, 640, 600, 560, 470)): p.lineTo(840 + i * 40, v)
    c.drawPath(p, ink(7, '#2FA25E')); label(c, "OURO DE VERDADE", 960, 820, 30, '#2FA25E', font=INTER_K, align='center', skew=0)
def s_e1(c, t, S): quarto(c, t); deitado(c, t); relogio(c, 1320, 560, 70, "23:00", t)
def s_e2(c, t, S):
    masmorra(c, t); bau(c, 1180, 960, 1.0, OURO, luz=1); goblin(c, 860, 1000, 1.1, t, face=.3, eyes='half', mouth='flat', arms=('hip', 'hip'))
    luz_masmorra(c, t, extra=[('pool', 1050, 700, 600, .8)])
def s_e3(c, t, S): raiox_fundo(c); cabeca_raiox(c, 960, 540, 1.2, t, .2)
def s_e4(c, t, S):
    raiox_fundo(c); cabeca_raiox(c, 960, 540, 1.2, t, .6 + .4 * abs(math.sin(t * 5)))
    for i in range(8): a = i * .785 + t; line(c, 960 + math.cos(a) * 300, 510 + math.sin(a) * 300, 960 + math.cos(a) * 380, 510 + math.sin(a) * 380, 6, '#FFE14A', 200)
def s_e5(c, t, S):
    raiox_fundo(c); bpm = lerp(70, 150, K(t, S.s0, S.s1 - S.s0)); coracao(c, 960, 520, 1.6, t, bpm)
    p = skia.Path(); p.moveTo(600, 900)
    for i in range(40): x = 600 + i * 18; ph = (i + int(t * 20)) % 10; p.lineTo(x, 900 - (120 if ph == 3 else -60 if ph == 4 else 0))
    c.drawPath(p, ink(6, '#38D6FF')); label(c, f"{int(bpm)} BPM", 960, 1020, 64, '#FFFFFF', font=INTER_K, align='center', skew=0)
def s_e6(c, t, S):
    masmorra(c, t); bau(c, 1180, 960, 1.0, OURO, luz=1); goblin(c, 860, 1000, 1.1, t, face=-.8, eyes='half', mouth='flat')
    c.saveLayer(None, fp((0, 0, 0), 230)); rafa(c, 1500, 1000, .95, t, face=-.6, eyes='half', mouth='flat', legs=((-24, 30, 30), (24, 30, 30))); c.restore()
    luz_masmorra(c, t, extra=[('pool', 1050, 700, 600, .8)])
def s_e7(c, t, S):
    masmorra(c, t); rafa(c, 960, 1000, 1.05, t, face=.3, eyes='wide', mouth='o', arms=('hold', 'hold')); bau(c, 960, 840, .55, OURO); luz_masmorra(c, t)
def s_e8(c, t, S):
    blur_begin(c, 12); masmorra(c, t); c.restore(); luz_masmorra(c, t)
    goblin(c, 960, 1500, 2.4, t, face=0, eyes='wide', mouth='open', arms=('gesture', 'gesture'), tilt=4 * math.sin(t * 30))
    linhas_velocidade(c, 960, 500, t, .6); poplabel(c, "AAAAH!", 960, 260, t, S.s0, 120, REDS, font=INTER_K)
def s_e9(c, t, S):
    masmorra(c, t); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 14
    rafa(c, lerp(1300, 600, u), 1000, .95, t, face=-.8, eyes='wide', mouth='open', arms=('hold', 'hold'), legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)))
    bau(c, lerp(1300, 600, u), 840, .5, OURO); goblin(c, lerp(1700, 1100, u), 1000, 1.0, t, face=-.8, eyes='wide', mouth='open', legs=walk_legs(ph + 2, 60, 25), arms=('gesture', 'gesture'))
    luz_masmorra(c, t); tempo = max(0, 10 - int((t - S.s0) * 3)); poplabel(c, f"00:{tempo:02d}", (S.view[0] + S.view[2]) / 2, 300, t, S.s0, 110, REDS, font=INTER_K)
def s_f1(c, t, S):
    blur_begin(c, 12); quarto(c, t, noite=False); c.restore(); rafa(c, 960, 1300, 2.0, t, face=0, eyes='wide', mouth='o', sweat=(t - S.s0) * 1.5, brow=1)
def s_f2(c, t, S): quarto(c, t, noite=False); bau(c, 960, 960, 1.0, OURO, luz=.6)
def s_f3(c, t, S): blur_begin(c, 8); quarto(c, t, noite=False); c.restore(); bau(c, 960, 900, 1.6, OURO)
def s_f4(c, t, S):
    quarto(c, t, noite=False); sh = 6 * math.sin(t * 60) * K(t, S.s0 + .3, .1); bau(c, 960 + sh, 960, 1.0, OURO)
    rafa(c, 560, 1000, .9, t, face=.7, eyes='wide', mouth='o')
def s_f5(c, t, S):
    blur_begin(c, 8); quarto(c, t, noite=False); c.restore(); sh = 10 * math.sin(t * 70); bau(c, 960 + sh, 900, 1.6, OURO)
    for i in range(2):
        tt = S.s0 + .2 + i * .45
        if t > tt: poplabel(c, "TOC", 760 + i * 380, 380 - i * 60, t, tt, 100, '#FFFFFF', font=INTER_K)
def s_f6(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#050308')); bau(c, 960, 900, 1.6, OURO)
    for sx in (-1, 1): add_light(c, 960 + sx * 34, 830, 40, '#FFE14A', 220 * K(t, S.s0 + .3, .3)); c.drawCircle(960 + sx * 34, 830, 8, fp('#FFE14A', 255 * K(t, S.s0 + .3, .3)))
def s_g1(c, t, S):
    quarto(c, t, noite=False); bau(c, 960, 960, 1.1, OURO, aberto=.25 + .05 * math.sin(t * 9))
    poplabel(c, "ABRE?", 960, 330, t, S.s0 + .1, 120, '#FFE14A', font=INTER_K)
def s_g2(c, t, S):
    masmorra(c, t); bau(c, 960, 960, 1.1, OURO, luz=1); luz_masmorra(c, t, extra=[('pool', 960, 700, 600, .8)])
    poplabel(c, "OU DEVOLVE?", 960, 330, t, S.s0 + .1, fit("OU DEVOLVE?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), CYAN, font=INTER_K)
def s_g3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); rafa(c, 960, 1100, 1.2, t, face=0, eyes='half', mouth='smirk', arms=('hip', 'hip'))
    poplabel(c, "PARTE 2?", 960, 330, t, S.s0 + .1, 130, '#FFE14A', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 560), (1.15, 1.25))),
    dict(draw=s_a2, falas=['a2'], sfx=[('boom', 0.05, .6)], **V((960, 560), (1.1, 1.0))),
    dict(draw=s_a3, falas=['a3'], sfx=[('brilho', 0.1, .6)], **V((960, 700), (1.0, 1.1))),
    dict(draw=s_a4, falas=['a4'], **V(((620, 560), (960, 620)), (1.0, 1.05))),
    dict(draw=s_b1, falas=['b1'], sfx=[('pop', 0.1, .5)], **V((960, 480), (1.0, 1.05))),
    dict(draw=s_b2, falas=['b2'], **V(((1080, 600), (1320, 560)), (1.0, 1.2))),
    dict(draw=s_b3, falas=['b3'], **V((960, 640), (.95, 1.0))),
    dict(draw=s_b4, falas=['b4'], sfx=[('brilho', 0.3, .6)], **V((960, 640), (1.0, 1.08))),
    dict(draw=s_b5, falas=['b5'], sfx=[('thud', 0.45, .6)], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_b6, falas=['b6'], **V(((1100, 600), (1400, 640)), (1.0, 1.0))),
    dict(draw=s_c1, falas=['c1'], **V((960, 460), (1.0, 1.1))),
    dict(draw=s_c2, falas=['c2'], sfx=[('boom', 0.05, .7)], **V((960, 600), (.85, .95))),
    dict(draw=s_c3, falas=['c3'], sfx=[('notif', 0.05, .8)], **V((960, 480), (1.0, 1.05))),
    dict(draw=s_c4, falas=['c4'], sfx=[('relogio', 0.1, .5)], **V((960, 480), (1.0, 1.08))),
    dict(draw=s_c5, falas=['c5'], sfx=[('pop', 0.05, .6)], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_c6, falas=['c6'], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_d1, falas=['d1'], **V((960, 620), (.75, .8))),
    dict(draw=s_d2, falas=['d2'], sfx=[('ding', 0.1, .5)], **V(((560, 620), (1360, 620)), (1.0, 1.0))),
    dict(draw=s_d3, falas=['d3'], sfx=[('paper', 0.5, .6)], **V((960, 640), (1.0, 1.08))),
    dict(draw=s_d4, falas=['d4'], sfx=[('kaching', 0.1, .7)], **V((960, 560), (1.0, 1.1))),
    dict(draw=s_d5, falas=['d5'], sfx=[('buzzer', 0.05, .6)], shake=[0.05], **V((960, 520), (1.1, 1.0))),
    dict(draw=s_d6, falas=['d6'], sfx=[('brilho', 0.2, .6)], **V((960, 620), (1.0, 1.08))),
    dict(draw=s_d7, falas=['d7'], sfx=[('notif', 0.1, .6)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_e1, falas=['e1'], **V(((1080, 600), (1320, 560)), (1.0, 1.15))),
    dict(draw=s_e2, falas=['e2'], **V(((860, 600), (1180, 640)), (1.0, 1.05))),
    dict(draw=s_e3, falas=['e3'], **V((960, 560), (1.0, 1.06))),
    dict(draw=s_e4, falas=['e4'], sfx=[('brilho', 0.2, .5)], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_e5, falas=['e5'], sfx=[('thud', 0.1, .4), ('thud', 0.6, .45), ('thud', 1.0, .5), ('thud', 1.35, .55)], **V((960, 640), (1.0, 1.1))),
    dict(draw=s_e6, falas=['e6'], **V(((1500, 600), (1050, 620)), (1.0, 1.0))),
    dict(draw=s_e7, falas=['e7'], sfx=[('whoosh', 0.05, .7)], **V((960, 620), (1.1, 1.2))),
    dict(draw=s_e8, falas=['e8'], sfx=[('buzzer', 0.05, .8)], shake=[0.05], **V((960, 520), (1.1, 1.0))),
    dict(draw=s_e9, falas=['e9'], sfx=[('steps', 0.05, .7), ('relogio', 0.1, .5)], **V(((1200, 600), (700, 600)), (1.0, 1.0))),
    dict(draw=s_f1, falas=['f1'], sfx=[('thud', 0.05, .6)], **V((960, 480), (1.0, 1.05))),
    dict(draw=s_f2, falas=['f2'], **V((960, 660), (1.0, 1.08))),
    dict(draw=s_f3, falas=['f3'], **V((960, 640), (1.1, 1.15))),
    dict(draw=s_f4, falas=['f4'], sfx=[('thud', 0.35, .7)], **V(((700, 620), (960, 640)), (1.0, 1.05))),
    dict(draw=s_f5, falas=['f5'], sfx=[('thud', 0.2, .9), ('thud', 0.65, .9)], shake=[0.2, 0.65], **V((960, 600), (1.1, 1.18))),
    dict(draw=s_f6, falas=['f6'], sfx=[('boom', 0.3, .8)], **V((960, 760), (1.2, 1.35))),
    dict(draw=s_g1, falas=['g1'], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_g2, falas=['g2'], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_g3, falas=['g3'], hold=1.0, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
