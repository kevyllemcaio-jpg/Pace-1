import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {
    'menino': dict(corpo='menino', skin='#D9A877', top='hoodie', suit='#F2B705', print='#1F4E9C', hair='espetado', hair_col='#2A1A14'),
    'mae': dict(corpo='mulher', skin='#C98F62', top='blouse', suit='#7A3B5E', shirt='#F4EFE2', hair='cachos', hair_col='#2A1A14', lashes=True, brincos=True),
    'juca': dict(corpo='homem', skin='#E6BE8E', top='tee', suit='#2E7D6B', print='#F4EFE2', hair='raspado', hair_col='#9C9A96', moustache=True, bone=True, hat_band='#C8242C'),
})
MEN, MAE, JUCA = EL['menino'], EL['mae'], EL['juca']


def sombra(c, x, y, w=100, a=90): c.drawOval(skia.Rect(x - w, y - w * .18, x + w, y + w * .18), fp((0, 0, 0), a, blur=8))


def pisca(t, ph=0): return 'closed' if blink(t, 2.6, ph) else 'dot'


def boca(S, k, t, rest='smile'): return S.boca(k, t, rest) if k else rest


def bolha(c, x, y, w, h, u, conteudo=None):  # balão de pensamento
    k = pop(u)
    if k <= 0: return
    c.save(); c.translate(x, y); c.scale(k, k)
    for (dx, dy, r) in ((-w * .38, h * .62, 16), (-w * .48, h * .85, 10)): circ(c, dx, dy, r, '#FFFFFF', 4)
    p = skia.Path()
    for i in range(9):
        a = i * 2 * math.pi / 9; p.addCircle(math.cos(a) * w * .42, math.sin(a) * h * .36, min(w, h) * .26)
    c.drawPath(p, ink(10)); c.drawPath(p, fp('#FFFFFF')); c.drawOval(skia.Rect(-w * .42, -h * .36, w * .42, h * .36), fp('#FFFFFF'))
    if conteudo: conteudo(c)
    c.restore()


def presente(c):
    rect(c, -60, -40, 60, 50, '#E04E8A', 5, r=6); rect(c, -10, -40, 10, 50, '#F2C14E', 0); rect(c, -64, -50, 64, -26, '#E04E8A', 5, r=4)
    oval(c, -40, -80, 0, -48, '#F2C14E', 4); oval(c, 0, -80, 40, -48, '#F2C14E', 4)


def voando(c):
    c.save(); c.scale(.32, .32); draw_char(c, 0, 200, 1.0, MEN, face=.3, arms=('gesture', 'gesture'), mouth='open'); c.restore()
    for i in range(3): line(c, -90 + i * 30, 120, -110 + i * 30, 160, 5)


def celular(c, x, y, s, t, rec=True):
    c.save(); c.translate(x, y); c.rotate(-8)
    rect(c, -34 * s, -60 * s, 34 * s, 60 * s, '#1E1A22', 5, r=10 * s); rect(c, -26 * s, -50 * s, 26 * s, 46 * s, '#5BC0EB', 0, r=4 * s)
    if rec and int(t * 3) % 2: c.drawCircle(-14 * s, -38 * s, 7 * s, fp('#E0302A'))
    c.restore()


def quarto(c, t, noite=0.0, lustre=True):
    cenario(c, 'quarto', t)
    if lustre:
        line(c, 900, -200, 900, 70, 6); poly(c, [(840, 70), (960, 70), (930, 120), (870, 120)], '#F2C14E', LW * .8)
    if noite > 0:
        c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#0A1136', 200 * noite))
        c.drawCircle(1500, 280, 40, fp('#FFF6DC', 255 * noite)); add_light(c, 1500, 280, 200, '#FFF6DC', 120 * noite)


def deitado(c, t, S, olhos='closed', boca_='flat', acorda=0.0):
    x, y = 1080, 690; c.save(); c.translate(x, y); c.rotate(-90 + 30 * acorda); c.translate(-x, -y)
    draw_char(c, x, y, .8, MEN, face=.3, eyes=olhos, mouth=boca_, arms=('down', 'down')); c.restore()
    if acorda < .5: rect(c, 850, 640, 1200, 760, '#5B3E8C', LW, r=20)  # cobertor


def rua(c, t):
    c.drawRect(skia.Rect(-900, -600, W + 900, 760), sp(linear(0, -100, 0, 760, [hx('#5DADE2'), hx('#BFE3F6')])))
    c.drawCircle(1650, 140, 50, fp('#FFE14A')); cloud(c, 400 + t * 10, 160, 1.0, '#FFFFFF'); cloud(c, 1200 + t * 6, 110, .8, '#FFFFFF')
    for (x0, cor, tel) in ((60, '#F2B880', '#B23A48'), (1060, '#9EC5E8', '#7A5A3C')):  # duas casas, uma de frente pra outra
        rect(c, x0, 330, x0 + 760, 780, cor, LW); poly(c, [(x0 - 40, 340), (x0 + 380, 120), (x0 + 800, 340)], tel, LW)
        rect(c, x0 + 320, 560, x0 + 450, 780, '#7A5A3C', LW, r=6); circ(c, x0 + 430, 680, 7, GOLD, 2)
        for wx in (x0 + 90, x0 + 540): rect(c, wx, 430, wx + 140, 540, '#DFF3FF', LW * .8); line(c, wx + 70, 430, wx + 70, 540, 4)
    c.drawRect(skia.Rect(-900, 780, W + 900, 860), fp('#B8B8C0')); line(c, -900, 780, W + 900, 780, LW * .7)
    c.drawRect(skia.Rect(-900, 860, W + 900, H + 600), fp('#6A6E80'))
    for x in range(-800, 2700, 220): rect(c, x, 960, x + 120, 976, '#F4EFE2', 0)
    for x in range(60, 830, 46): line(c, x, 700, x, 790, 7, '#3B4660')  # portão da casa do menino
    line(c, 60, 700, 820, 700, 7, '#3B4660')


def escada(c, t):
    c.drawRect(skia.Rect(-900, -600, W + 900, H + 600), fp('#F2D9B8'))
    _q = [(300, 160, 240, 170)]
    for (x, y, w, h) in _q: rect(c, x, y, x + w, y + h, '#3E6FA8', LW * .8); rect(c, x + 20, y + 20, x + w - 20, y + h - 20, '#F2C14E', 0)
    for i in range(12):  # degraus em diagonal
        x0 = 200 + i * 120; y0 = 1000 - i * 70
        rect(c, x0, y0, x0 + 140, y0 + 70, '#B9874F', LW * .8); rect(c, x0, y0, x0 + 140, y0 + 14, '#9A6A3E', 0)
    line(c, 220, 820, 1640, 0, 9, '#7A5A3C')
    for i in range(12): line(c, 260 + i * 120, 820 - i * 70 + 10, 260 + i * 120, 920 - i * 70, 6, '#7A5A3C')


def cozinha(c, t): cenario(c, 'cozinha', t)


# ---------------------------------------------------------------- tomadas
def s_dorme(c, t, S):
    cenario_fundo(c, 'quarto', t, dx=-200)
    draw_char(c, 960, 1290, 2.4, MEN, face=.2, eyes='closed', mouth='flat', arms=('down', 'down'), bob=3 * math.sin(t * 1.2), tilt=8)
    for i in range(3):  # zzz
        u = ((t * .6 + i / 3) % 1); label(c, "z", 1180 + u * 80, 380 - u * 160, 50 + i * 16, '#3E6FA8', font=MARKER, alpha=1 - u)
    x0, x1 = S.view[0], S.view[2]; w = (x1 - x0) * .9
    poplabel(c, "UM PODER NOVO", 960, 130, t, S.s0 + .1, fit("UM PODER NOVO", 110, w, MARKER), LIME, rot=-3, font=MARKER)
    poplabel(c, "TODO DIA?", 960, 240, t, S.s0 + .5, fit("TODO DIA?", 110, w, MARKER), '#FFFFFF', rot=-3, font=MARKER)


def s_cama(c, t, S):
    quarto(c, t); deitado(c, t, S)
    c.save(); r = 64; cx, cy = 1320, 560  # despertador perto da meia-noite
    circ(c, cx, cy, r, '#F4EFE2', 6); a = math.radians(-90 + (t - S.s0) * 40); line(c, cx, cy, cx + math.cos(a) * 46, cy + math.sin(a) * 46, 6, RED); line(c, cx, cy, cx, cy - 34, 7)
    c.restore()
    poplabel(c, "SEM MANUAL", (S.view[0] + S.view[2]) / 2, 300, t, S.at('n2+0.9'), fit("SEM MANUAL", 80, (S.view[2] - S.view[0]) * .85, MARKER), '#FFFFFF', rot=4, font=MARKER)


def s_teto(c, t, S):
    quarto(c, t)
    sombra(c, 1180, 900, 110, 60)
    draw_char(c, 1180, 560 + 6 * math.sin(t * 3), 1.0, MEN, face=.1, eyes='wide', mouth='o', brow=.9, arms=('gesture', 'gesture'), legs=((-24, -10, 30), (24, 10, 18)))  # cabeça encostada no teto
    bolha(c, 1440, 200, 260, 200, K(t, S.s0 + .1, .3), lambda c: label(c, "?", 0, 40, 120, '#3E6FA8', font=MARKER, align='center', skew=0))


def menino_flutua(c, x, y, s, t, S, k=None, alto=200, **kw):
    sombra(c, x, y, 100 * s, 60); fy = y - alto - 14 * math.sin(t * 3)
    kw.setdefault('eyes', pisca(t)); kw.setdefault('mouth', boca(S, k, t, 'open'))
    draw_char(c, x, fy, s, MEN, legs=((-24, -10, 30), (24, 10, 18)), **kw)
    return fy


def s_flutua(c, t, S):
    quarto(c, t)
    menino_flutua(c, 900, 900, 1.0, t, S, 'm1', alto=300, face=.2, arms=('gesture', 'gesture'), brow=.6)


def s_lustre(c, t, S):
    hit = S.at('m2+0.05'); k = K(t, hit, .2)
    quarto(c, t)
    fy = menino_flutua(c, 900, 900, 1.0, t, S, 'm2', alto=lerp(260, 300, math.sin(math.pi * k)), face=.2, eyes='closed' if t < hit + .4 else 'wide',
                       arms=('hat', 'hat'), squash=.08 * math.sin(math.pi * K(t, hit, .3)))
    if t > hit:
        for i in range(5):
            a = t * 4 + i * 1.26; label(c, "*", 900 + 120 * math.cos(a), fy - 560 + 30 * math.sin(a), 46, GOLD, font=MARKER, align='center', skew=0)


def s_escada(c, t, S):
    escada(c, t); u = K(t, S.s0, S.s1 - S.s0)
    x = lerp(1450, 520, ease(u)); y = lerp(330, 900, ease(u))
    menino_flutua(c, x, y, .95, t, S, 'm3', alto=140, face=-.6, arms=('gesture', 'down'), mouth=boca(S, 'm3', t, 'smile'))


def s_mae_fala(c, t, S, k, **kw):
    cenario_fundo(c, 'cozinha', t, dx=-200)
    kw.setdefault('eyes', pisca(t, .4)); kw.setdefault('arms', ('hip', ('down', 'gesture', K(t, S.s0 + .1, .3))))
    draw_char(c, 960, 1180, 1.8, MAE, face=-.6, mouth=boca(S, k, t, 'flat'), **kw)


def s_mae1(c, t, S): s_mae_fala(c, t, S, 'a1', brow=.8, brow_tilt=.5)


def s_voa_cozinha(c, t, S):
    cozinha(c, t)
    draw_char(c, 1300, 1000, 1.0, MAE, face=-.6, eyes=pisca(t), mouth='flat', arms=('hip', 'hip'))
    menino_flutua(c, 760, 1000, 1.0, t, S, 'm4', alto=260, face=.6, arms=('gesture', 'gesture'))


def s_cafe(c, t, S):
    cozinha(c, t)
    menino_flutua(c, 700, 1000, 1.0, t, S, None, alto=240, face=.6, eyes=pisca(t), mouth='smile', arms=('down', 'down'))
    draw_char(c, 1180, 1000, 1.0, MAE, face=-.6, eyes='half', mouth=boca(S, 'a2', t, 'smirk'), arms=('hold', 'down'))
    rect(c, 1120, 760, 1180, 830, '#F4EFE2', 5, r=8)  # xícara
    for i in range(2): s_ = skia.Path(); x0 = 1140 + i * 20; s_.moveTo(x0, 750); s_.cubicTo(x0 - 12, 720, x0 + 12, 700, x0, 670); c.drawPath(s_, ink(4, '#FFFFFF', 180))


def juca_filma(c, x, y, s, t, S, k=None, **kw):
    sombra(c, x, y, 100 * s)
    kw.setdefault('eyes', pisca(t, 1.1)); kw.setdefault('mouth', boca(S, k, t, 'open'))
    draw_char(c, x, y, s, JUCA, face=kw.pop('face', -.6), arms=('down', 'gesture'), **kw)
    celular(c, x + 152 * s * (-1 if False else 1), y - 372 * s, s, t)


def s_rua_voa(c, t, S):
    rua(c, t)
    menino_flutua(c, 440, 820, .9, t, S, None, alto=lerp(80, 330, ease(K(t, S.s0, 1.6))), face=.5, eyes=pisca(t), mouth='smile', arms=('gesture', 'gesture'))
    juca_filma(c, 1420, 830, .95, t, S, 'j1', brow=1, face=-.5)


def s_menino_close(c, t, S, k, fundo='cidade', **kw):
    if fundo == 'rua':
        blur_begin(c, 12); c.save(); c.translate(-200, -260); c.scale(1.5, 1.5); rua(c, t); c.restore(); c.restore()
    else: cenario_fundo(c, fundo, t, dx=-200)
    kw.setdefault('eyes', pisca(t)); kw.setdefault('arms', ('down', ('down', 'gesture', K(t, S.s0 + .1, .3))))
    draw_char(c, 960, 1170, 2.4, MEN, face=kw.pop('face', .5), mouth=boca(S, k, t, kw.pop('rest', 'flat')), **kw)


def s_apaga(c, t, S): s_menino_close(c, t, S, 'm5', 'rua', brow=1, brow_tilt=-.6, sweat=(t - S.s0) * 1.2, eyes='wide')


def s_meianoite(c, t, S):
    quarto(c, t, noite=1.0)
    hit = S.at('m6+1.1'); u = K(t, S.s0, hit - S.s0)
    if t < hit: menino_flutua(c, 1000, 800, .9, t, S, 'm6', alto=lerp(260, 40, u * u), face=.3, eyes='half', arms=('down', 'down'))
    else: deitado(c, t, S, olhos='wide', boca_=boca(S, 'm6', t, 'o'))


def s_ouve(c, t, S):
    quarto(c, t, lustre=False)
    draw_char(c, 1000, 1000, 1.0, MEN, face=.2, eyes='wide', mouth=boca(S, 'm7', t, 'flat'), arms=('hat', 'hat'), brow=.8)
    for i in range(3):  # ondas chegando nas orelhas
        r = ((t * 1.2 + i / 3) % 1) * 300; c.drawCircle(1000, 580, 120 + r, ink(5, '#3E6FA8', 200 * (1 - r / 300)))


def s_mae_pensa(c, t, S):
    cozinha(c, t)
    draw_char(c, 1150, 1000, 1.0, MAE, face=-.5, eyes=pisca(t), mouth='flat', arms=('hold', 'down'))
    bolha(c, 1300, 280, 330, 250, K(t, S.s0 + .1, .3), presente)
    draw_char(c, 640, 1000, 1.0, MEN, face=.6, eyes='half', mouth='smirk', arms=('down', 'down'))


def s_que(c, t, S): s_menino_close(c, t, S, 'm8', 'cozinha', eyes='half', rest='smirk', brow=.4)


def s_susto_mae(c, t, S): s_mae_fala(c, t, S, 'a3', eyes='wide', brow=1, arms=('hip', ('down', 'chin', K(t, S.s0, .2))), sweat=(t - S.s0))


def s_juca_pensa(c, t, S):
    rua(c, t)
    juca_filma(c, 1420, 830, .95, t, S, None, mouth='smirk', eyes='half')
    bolha(c, 1300, 230, 330, 250, K(t, S.s0 + .1, .3), voando)
    draw_char(c, 560, 830, .9, MEN, face=.6, eyes=pisca(t), mouth='flat', arms=('down', 'down'))


def s_aponta(c, t, S):
    rua(c, t)
    juca_filma(c, 1420, 830, .95, t, S, None, mouth='flat')
    draw_char(c, 560, 830, .9, MEN, face=.6, eyes=pisca(t), mouth=boca(S, 'm9', t, 'flat'), arms=('down', ('down', 'push', K(t, S.s0, .3))), brow=.6)


def s_juca_ue(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-1000, -260); c.scale(1.5, 1.5); rua(c, t); c.restore(); c.restore()
    draw_char(c, 960, 1180, 1.8, JUCA, face=-.5, eyes='wide', mouth=boca(S, 'j2', t, 'o'), brow=.9, brow_tilt=.6, arms=('down', ('down', 'chin', K(t, S.s0, .3))))
    celular(c, 960 + 152 * 1.8, 1180 - 372 * 1.8, 1.7, t, rec=False)


def invisivel(c, x, y, s, t, S, k=None, a=.14, **kw):
    c.saveLayer(None, fp((0, 0, 0), 255 * a))
    kw.setdefault('eyes', pisca(t)); kw.setdefault('mouth', boca(S, k, t, 'smile')); draw_char(c, x, y, s, MEN, **kw); c.restore()
    for i in range(10):  # brilhinho do contorno
        a_ = t * 2 + i; c.drawCircle(x + 120 * s * math.cos(a_), y - 300 * s + 220 * s * math.sin(a_ * 1.3), 4, fp('#FFFFFF', 150))


def s_cade(c, t, S):
    cozinha(c, t)
    draw_char(c, 1200, 1000, 1.0, MAE, face=lerp(-.7, .7, (math.sin(t * 2) + 1) / 2), eyes=pisca(t), mouth=boca(S, 'a4', t, 'flat'), arms=('hip', 'hip'), brow=.6)
    invisivel(c, 760, 1000, 1.0, t, S, face=.6, arms=('down', 'down'))


def s_lado(c, t, S):
    cozinha(c, t)
    draw_char(c, 1200, 1000, 1.0, MAE, face=.6, eyes=pisca(t), mouth='flat', arms=('hip', 'hip'))
    invisivel(c, 960, 1000, 1.0, t, S, 'm10', a=.2, face=.6, arms=('down', 'gesture'))


def s_susto(c, t, S):
    cozinha(c, t); k = K(t, S.s0, .25)
    draw_char(c, 1200, 1000 - 60 * math.sin(math.pi * k), 1.0, MAE, face=-.6, eyes='wide', mouth=boca(S, 'a5', t, 'open'), arms=('gesture', 'gesture'), brow=1, squash=.1 * math.sin(math.pi * k))
    invisivel(c, 960, 1000, 1.0, t, S, None, a=.2, face=.6, arms=('down', 'down'), mouth='smile')


def s_fantasma(c, t, S):
    rua(c, t); u = K(t, S.s0, S.s1 - S.s0); x = lerp(560, 1150, u); y = 690 + 10 * abs(math.sin(t * 6))
    rect(c, x - 60, y - 80, x + 60, y + 60, '#E04E3A', LW, r=24); rect(c, x - 40, y - 20, x + 40, y + 40, '#B23A48', LW * .6, r=10)  # mochila andando sozinha
    juca_filma(c, 1420, 830, .95, t, S, 'j3', brow=1, eyes='wide')


def s_nada(c, t, S):
    quarto(c, t, lustre=False)
    draw_char(c, 1000, 1000, 1.0, MEN, face=.2, eyes=pisca(t), mouth=boca(S, 'm11', t, 'flat'), arms=('present', 'present'), brow=.6, brow_tilt=-.4)


def s_juca_teto(c, t, S):
    cenario(c, 'sala', t)
    sombra(c, 900, 900, 110, 60)
    draw_char(c, 900, 560 - 10 * math.sin(t * 3), 1.0, JUCA, face=.1, eyes='wide', mouth=boca(S, 'j4', t, 'open'), brow=1, arms=('gesture', 'gesture'), legs=((-24, -10, 30), (24, 10, 18)), sweat=t - S.s0)
    line(c, 900, -200, 900, 40, 6)


def s_seujuca(c, t, S): s_menino_close(c, t, S, 'm12', 'quarto', eyes='wide', rest='o', brow=1, face=.3)


def s_final(c, t, S):
    cenario_fundo(c, 'quarto', t, dx=-200)
    draw_char(c, 960, 1170, 2.4, MEN, face=0, eyes=pisca(t), mouth=boca(S, 'm13', t, 'smile'), arms=('down', ('down', 'push', K(t, S.s0 + .3, .3))), sparkle=(t - S.at('m13:fim')) / .3)
    x0, x1 = S.view[0], S.view[2]
    poplabel(c, "QUAL PODER?", 960, 200, t, S.at('m13+0.8'), fit("QUAL PODER?", 120, (x1 - x0) * .85, MARKER), LIME, rot=-3, font=MARKER)


V = lambda f, z=(1.0, 1.08): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_dorme, falas=['n1'], **V((960, 420), (1.0, 1.06))),
    dict(draw=s_cama, falas=['n2'], **V(((760, 600), (1200, 600)), (1.15, 1.2))),
    dict(topo='DIA 1', draw=s_teto, falas=['p1'], sfx=[('pop', 0.15, .6)], **V(((1180, 360), (1260, 380)), (1.0, 1.1))),
    dict(topo='DIA 1', draw=s_flutua, falas=['m1'], **V((900, 520), (1.0, 1.1))),
    dict(topo='DIA 1', draw=s_lustre, falas=['m2'], shake=['m2+0.05'], **V((900, 400), (1.15, 1.25))),
    dict(topo='DIA 1', draw=s_escada, falas=['m3'], **V(((1400, 300), (600, 700)), (1.0, 1.0))),
    dict(topo='DIA 1', draw=s_mae1, falas=['a1'], **V((960, 460), (1.0, 1.08))),
    dict(topo='DIA 1', draw=s_voa_cozinha, falas=['m4'], **V(((760, 500), (1000, 560)), (1.0, 1.0))),
    dict(topo='DIA 1', draw=s_cafe, falas=['a2'], **V(((1100, 560), (900, 560)), (1.05, 1.1))),
    dict(topo='DIA 1', draw=s_rua_voa, falas=['j1'], **V(((440, 480), (1380, 560)), (1.0, 1.0))),
    dict(topo='DIA 1', draw=s_apaga, falas=['m5'], **V((960, 460), (1.08, 1.0))),
    dict(topo='MEIA-NOITE', draw=s_meianoite, falas=['m6'], sfx=[('thud', 'm6+1.1', .8)], shake=['m6+1.1'], **V((1040, 560), (1.0, 1.1))),
    dict(topo='DIA 2', draw=s_ouve, falas=['m7'], **V((1000, 560), (1.0, 1.12))),
    dict(topo='DIA 2', draw=s_mae_pensa, falas=['ap1'], sfx=[('pop', 0.15, .6)], **V(((1180, 520), (1300, 400)), (1.0, 1.1))),
    dict(topo='DIA 2', draw=s_que, falas=['m8'], **V((960, 460), (1.0, 1.08))),
    dict(topo='DIA 2', draw=s_susto_mae, falas=['a3'], shake=[0.05], **V((960, 460), (1.12, 1.0))),
    dict(topo='DIA 2', draw=s_juca_pensa, falas=['jp1'], sfx=[('pop', 0.15, .6)], **V(((1420, 560), (1320, 380)), (1.0, 1.1))),
    dict(topo='DIA 2', draw=s_aponta, falas=['m9'], **V(((560, 560), (1300, 560)), (1.0, 1.0))),
    dict(topo='DIA 2', draw=s_juca_ue, falas=['j2'], **V((960, 460), (1.0, 1.08))),
    dict(topo='DIA 3', draw=s_cade, falas=['a4'], **V(((1200, 560), (960, 560)), (1.0, 1.0))),
    dict(topo='DIA 3', draw=s_lado, falas=['m10'], **V((1060, 560), (1.1, 1.2))),
    dict(topo='DIA 3', draw=s_susto, falas=['a5'], shake=[0.05], **V((1100, 560), (1.15, 1.05))),
    dict(topo='DIA 3', draw=s_fantasma, falas=['j3'], **V(((700, 560), (1300, 560)), (.95, .95))),
    dict(topo='DIA 4', draw=s_nada, falas=['m11'], **V((1000, 560), (1.0, 1.15))),
    dict(topo='DIA 4', draw=s_juca_teto, falas=['j4'], **V((900, 400), (1.0, 1.1))),
    dict(topo='DIA 4', draw=s_seujuca, falas=['m12'], **V((960, 460), (1.15, 1.0))),
    dict(draw=s_final, falas=['m13'], hold=.4, **V((960, 440), (1.0, 1.06))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
