import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
SB = _load('sonhobase', os.path.expanduser('~/vid/sonho/cenas.py'))
from sonhobase import raiox_fundo, cabeca_raiox, coracao, corpo_raiox, mao, tint, pisca, head, sombra, linhas_velocidade, impacto, poplabel

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {
    'caio': dict(corpo='homem', skin='#C68642', top='hoodie', suit='#2A9D8F', print='#F4EFE2', hair='curly', hair_col='#1C1B22'),
    'mae': dict(corpo='mulher', skin='#C68642', top='blouse', suit='#E76F51', shirt='#F4EFE2', hair='cachos', hair_col='#1C1B22', lashes=True, brincos=True),
})
CAIO, MAE = EL['caio'], EL['mae']
MOTORISTA = dict(corpo='homem', skin='#E6BE8E', top='colete', suit='#3E6FA8', shirt='#F4EFE2', hair='raspado', hair_col='#5A4A3A', moustache=True, figurante=True)
COLEGA = dict(corpo='homem', skin='#F1C27D', top='tee', suit='#8338EC', print='#FFD23F', hair='slick', hair_col='#C68E3A', figurante=True)
SENHORA = dict(MODELOS['avo_f'], figurante=True)
kit.DESTAQUES = ['VIDA', 'MUNDO', 'CEM', 'SESSENTA', 'DEZESSETE', 'BEBEU', 'QUARENTA', 'ÁGUA', 'DOIS', 'ATENÇÃO', 'GARRAFA', 'SUBIU', 'PERIGO', 'VERMELHO', 'DEZ', 'CORREU', 'CARRO', 'VERDE', 'ADRENALINA', 'CORAÇÃO', 'MÚSCULOS', 'ESPELHO', 'PRÓPRIA', 'UM', 'CAINDO', 'SALVAR', 'PARTE']


def barra(c, x, y, s, pct, t, pisca_=False):
    w = 230 * s; h = 34 * s; yy = y + HEAD_CY * s - 190 * s
    col = '#3DDC84' if pct > 50 else '#FFC53D' if pct > 20 else '#FF3B3B'
    a = 255 if not pisca_ or int(t * 6) % 2 else 110
    rect(c, x - w / 2, yy, x + w / 2, yy + h, '#14121A', 4 * s, r=h / 2)
    if pct > 0: rect(c, x - w / 2 + 4 * s, yy + 4 * s, x - w / 2 + 4 * s + (w - 8 * s) * pct / 100, yy + h - 4 * s, col, 0, r=h / 2)
    f = skia.Font(INTER_K, 34 * s); txt = f"{int(round(pct))}%"; c.drawString(txt, x - f.measureText(txt) / 2, yy - 10 * s, f, fp(col, a))
    add_light(c, x, yy + h / 2, w * .7, col, 60)
def caio(c, x, y, s, t, **kw): kw.setdefault('eyes', pisca(t)); draw_char(c, x, y, s, CAIO, **kw)
def onibus(c, t):
    c.drawRect(skia.Rect(-900, -400, W + 900, H + 600), fp('#BFE3F6'))
    rect(c, -200, 120, 2120, 900, '#F2C14E', LW, r=40)
    for i in range(6): rect(c, 60 + i * 320, 200, 320 + i * 320, 520, '#9FD3F0', LW * .8, r=16); line(c, 60 + i * 320 + (t * 300) % 260, 210, 60 + i * 320 + (t * 300) % 260 - 60, 510, 6, '#FFFFFF', 120)
    c.drawRect(skia.Rect(-900, 900, W + 900, H + 600), fp('#6A6E80'))
    rect(c, 1180, 600, 1500, 760, '#3B4660', LW, r=20); circ(c, 1340, 640, 70, '#2B2D42', 10)  # volante
def carro(c, x, y, s=1.0):
    rect(c, x - 260 * s, y - 170 * s, x + 260 * s, y - 40 * s, '#E63946', LW, r=40 * s); rect(c, x - 150 * s, y - 260 * s, x + 130 * s, y - 160 * s, '#E63946', LW, r=30 * s)
    rect(c, x - 130 * s, y - 245 * s, x + 110 * s, y - 175 * s, '#BFE3F6', LW * .7, r=16 * s)
    for dx in (-160, 160): circ(c, x + dx * s, y - 40 * s, 52 * s, '#1E1A22', LW); circ(c, x + dx * s, y - 40 * s, 22 * s, '#8D99AE', 3)
def faixa(c, t):
    cenario(c, 'cidade', t)
    for i in range(8): rect(c, 560 + i * 110, 900, 620 + i * 110, 1080, '#F4EFE2', 0)
def espelho(c, t):
    cenario(c, 'loja', t)
    rect(c, 660, 140, 1260, 980, '#9AA3B5', LW, r=30); rect(c, 690, 170, 1230, 950, '#D7E9F5', 0, r=20)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S):
    blur_begin(c, 12); cenario(c, 'quarto', t); c.restore()
    u = K(t, S.s0 + .3, .4); caio(c, 960, 1290, 2.3, t, face=0, eyes='closed' if u < .5 else 'wide', mouth='flat')
def s_a2(c, t, S):
    cenario(c, 'cidade', t)
    for i, (spec, x, p) in enumerate(((MOTORISTA, 600, 60), (COLEGA, 960, 40), (SENHORA, 1320, 10))):
        draw_char(c, x, 1000, .85, spec, face=0, eyes=pisca(t, i)); barra(c, x, 1000, .85, p, t, p < 20)
def s_b1(c, t, S):
    blur_begin(c, 12); cenario(c, 'quarto', t); c.restore(); caio(c, 960, 1290, 2.2, t, face=.2, mouth='smile')
def s_b2(c, t, S):
    cenario(c, 'cozinha', t); draw_char(c, 1150, 1000, 1.0, MAE, face=-.5, eyes=pisca(t), mouth='smile', arms=('hold', 'down'))
    barra(c, 1150, 1000, 1.0, 100 * K(t, S.s0 + .6, .5), t); caio(c, 700, 1000, 1.0, t, face=.6, eyes='wide', mouth='o')
def s_b3(c, t, S):
    blur_begin(c, 12); cenario(c, 'cozinha', t); c.restore(); draw_char(c, 960, 1300, 1.9, MAE, face=0, eyes=pisca(t), mouth='smile')
    barra(c, 960, 1300, 1.9, 100, t)
def s_b4(c, t, S):
    onibus(c, t); draw_char(c, 1340, 1000, 1.0, MOTORISTA, face=.3, eyes='half', mouth='flat'); barra(c, 1340, 1000, 1.0, 60, t)
    caio(c, 820, 1000, .95, t, face=.7, eyes='wide', mouth='o')
def s_b5(c, t, S):
    blur_begin(c, 10); onibus(c, t); c.restore(); draw_char(c, 960, 1300, 1.9, MOTORISTA, face=0, eyes='half' if int(t * 2) % 3 else 'closed', mouth='flat')
    poplabel(c, "17H ACORDADO", 960, 300, t, S.s0 + .2, fit("17H ACORDADO", 90, (S.view[2] - S.view[0]) * .85, INTER_K), '#FFC53D', font=INTER_K)
def s_b6(c, t, S):
    raiox_fundo(c); cabeca_raiox(c, 960, 520, 1.2, t, .2); u = K(t, S.s0 + .4, 1.2)
    rect(c, 640, 880, 1280, 940, '#14121A', 4, r=30); rect(c, 645, 885, 645 + 630 * (1 - .45 * u), 935, '#FFC53D', 0, r=26)
    label(c, "REFLEXO", 960, 1010, 54, '#FFFFFF', font=INTER_K, align='center', skew=0)
def s_c1(c, t, S):
    cenario(c, 'sala_aula', t); draw_char(c, 1150, 1000, .95, COLEGA, face=-.4, eyes='half', mouth='flat'); barra(c, 1150, 1000, .95, 40, t)
    caio(c, 760, 1000, .95, t, face=.6, eyes='wide', mouth='flat')
def s_c2(c, t, S):
    blur_begin(c, 12); cenario(c, 'sala_aula', t); c.restore(); draw_char(c, 960, 1300, 1.9, COLEGA, face=0, eyes='half', mouth='o', sweat=(t - S.s0))
def corpo_agua(c, t, nivel):
    corpo_raiox(c, 960, 900, 1.2, t)
    c.save(); c.clipRect(skia.Rect(0, 900 - 600 * nivel, 2000, 1100)); c.drawRect(skia.Rect(700, 300, 1220, 1100), fp('#38A0FF', 90)); c.restore()
def s_c3(c, t, S):
    corpo_agua(c, t, lerp(1.0, .98, K(t, S.s0 + .3, 1.0)))
    poplabel(c, "-2% DE ÁGUA", 960, 260, t, S.s0 + .4, 90, '#38D6FF', font=INTER_K)
def s_c4(c, t, S):
    cenario(c, 'sala_aula', t); u = K(t, S.s0 + .2, .7)
    caio(c, 700, 1000, .95, t, face=.6, eyes='half', mouth='smile', arms=('down', ('down', 'push', K(t, S.s0, .2))))
    bx, by = lerp(780, 1100, u), 620 - 220 * math.sin(math.pi * u); rect(c, bx - 26, by - 70, bx + 26, by + 70, '#8FD3FF', LW * .8, r=14)
    draw_char(c, 1150, 1000, .95, COLEGA, face=-.5, eyes='wide', mouth='o', arms=('down', ('down', 'hold', u)))
def s_c5(c, t, S):
    blur_begin(c, 12); cenario(c, 'sala_aula', t); c.restore(); draw_char(c, 960, 1300, 1.9, COLEGA, face=0, eyes=pisca(t), mouth='smile')
    barra(c, 960, 1300, 1.9, lerp(40, 85, K(t, S.s0 + .1, .6)), t)
def s_d1(c, t, S):
    blur_begin(c, 12); cenario(c, 'sala_aula', t); c.restore(); caio(c, 960, 1290, 2.2, t, face=0, eyes='wide', mouth='flat', brow=.6)
def s_d2(c, t, S):
    faixa(c, t); u = K(t, S.s0, 2.5); x = lerp(560, 760, u)
    draw_char(c, x, 1000, .85, SENHORA, face=.6, eyes=pisca(t), mouth='flat', legs=walk_legs((t - S.s0) * 5, 30, 10)); barra(c, x, 1000, .85, 10, t, True)
def s_d3(c, t, S):
    blur_begin(c, 12); faixa(c, t); c.restore(); draw_char(c, 960, 1300, 1.8, SENHORA, face=.3, eyes=pisca(t), mouth='flat'); barra(c, 960, 1300, 1.8, 10, t, True)
    tint(c, '#FF1030', .12 * (int(t * 6) % 2))
def s_d4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A0A10')); barra(c, 960, 2130, 2.6, 10, t, True)
def s_d5(c, t, S):
    faixa(c, t); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 14
    caio(c, lerp(1500, 900, u), 1000, .95, t, face=-.8, eyes='wide', mouth='open', legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)), arms=('gesture', 'gesture'))
    draw_char(c, 760, 1000, .85, SENHORA, face=.6, eyes=pisca(t), mouth='flat'); linhas_velocidade(c, 1100, 600, t, .4)
def s_d6(c, t, S):
    faixa(c, t); u = K(t, S.s0, .5)
    caio(c, lerp(900, 1250, u), 1000, .95, t, face=.8, eyes='wide', mouth='o', arms=('push', 'push'))
    draw_char(c, lerp(760, 1110, u), 1000, .85, SENHORA, face=.6, eyes='wide', mouth='o')
def s_d7(c, t, S):
    faixa(c, t); x = lerp(-400, 2400, K(t, S.s0, .8))
    draw_char(c, 1150, 1000, .85, SENHORA, face=-.6, eyes='wide', mouth='o'); caio(c, 1330, 1000, .95, t, face=-.6, eyes='wide', mouth='o')
    carro(c, x, 1080, 1.4); linhas_velocidade(c, x, 900, t, .6 * (1 - K(t, S.s0 + .6, .3)))
def s_d8(c, t, S):
    blur_begin(c, 12); faixa(c, t); c.restore(); draw_char(c, 960, 1300, 1.8, SENHORA, face=0, eyes=pisca(t), mouth='smile')
    barra(c, 960, 1300, 1.8, lerp(10, 90, K(t, S.s0 + .1, .7)), t)
def s_e1(c, t, S):
    raiox_fundo(c); corpo_raiox(c, 960, 900, 1.2, t)
    for i in range(12): a = i * .52 + t * 2; c.drawCircle(960 + math.cos(a) * 200, 520 + math.sin(a) * 300, 10, fp('#FFC53D', 220))
    poplabel(c, "ADRENALINA", 960, 260, t, S.s0 + .3, fit("ADRENALINA", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#FFC53D', font=INTER_K)
def s_e2(c, t, S):
    raiox_fundo(c); bpm = lerp(80, 170, K(t, S.s0, 1.5)); coracao(c, 960, 520, 1.6, t, bpm)
    label(c, f"{int(bpm)} BPM", 960, 960, 70, '#FFFFFF', font=INTER_K, align='center', skew=0)
def s_f1(c, t, S): espelho(c, t); caio(c, 960, 1000, .95, t, face=.0, eyes=pisca(t), mouth='flat')
def s_f2(c, t, S):
    blur_begin(c, 8); espelho(c, t); c.restore(); caio(c, 960, 1300, 1.9, t, face=0, eyes='wide', mouth='o')
def s_f3(c, t, S):
    blur_begin(c, 8); espelho(c, t); c.restore(); caio(c, 960, 1300, 1.9, t, face=0, eyes='wide', mouth='o', sweat=1); barra(c, 960, 1300, 1.9, 1, t, True)
    tint(c, '#FF1030', .15)
def s_f4(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#1A0A10')); barra(c, 960, 2130, 2.6, max(0, 1 - K(t, S.s0, 1.0)), t, True)
    poplabel(c, "↓", 960, 300, t, S.s0, 160, '#FF3B3B', font=INTER_K)
def s_g1(c, t, S):
    espelho(c, t); caio(c, 960, 1000, 1.0, t, face=-.4, eyes='half', mouth='flat', arms=('chin', 'down'))
    poplabel(c, "DESCOBRIR?", 960, 300, t, S.s0 + .1, fit("DESCOBRIR?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#FFC53D', font=INTER_K)
def s_g2(c, t, S):
    cenario(c, 'cidade', t)
    for i, (spec, x, p) in enumerate(((MOTORISTA, 640, 30), (SENHORA, 960, 15), (COLEGA, 1280, 25))): draw_char(c, x, 1000, .85, spec, face=0, eyes=pisca(t, i)); barra(c, x, 1000, .85, p, t, True)
    poplabel(c, "OU SALVAR?", 960, 300, t, S.s0 + .1, fit("OU SALVAR?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#3DDC84', font=INTER_K)
def s_g3(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); caio(c, 960, 1100, 1.2, t, face=0, eyes='half', mouth='smirk', arms=('hip', 'hip'))
    barra(c, 960, 1100, 1.2, 1, t, True); poplabel(c, "PARTE 2?", 960, 300, t, S.s0 + .1, 130, '#FFC53D', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], **V((960, 460), (1.0, 1.08))),
    dict(draw=s_a2, falas=['a2'], sfx=[('pop', 0.2, .5), ('pop', 0.5, .5), ('pop', 0.8, .5)], **V((960, 560), (.75, .82))),
    dict(draw=s_b1, falas=['b1'], **V((960, 460), (1.0, 1.05))),
    dict(draw=s_b2, falas=['b2'], sfx=[('ding', 'b2+3.2', .6)], **V(((700, 560), (1150, 520)), (1.0, 1.0))),
    dict(draw=s_b3, falas=['b3'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_b4, falas=['b4'], **V(((820, 560), (1340, 520)), (1.0, 1.0))),
    dict(draw=s_b5, falas=['b5'], sfx=[('relogio', 0.1, .5)], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_b6, falas=['b6'], **V((960, 640), (1.0, 1.06))),
    dict(draw=s_c1, falas=['c1'], **V(((760, 560), (1150, 520)), (1.0, 1.0))),
    dict(draw=s_c2, falas=['c2'], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_c3, falas=['c3'], **V((960, 620), (1.0, 1.06))),
    dict(draw=s_c4, falas=['c4'], sfx=[('whoosh', 0.2, .6)], **V(((760, 560), (1100, 560)), (1.0, 1.0))),
    dict(draw=s_c5, falas=['c5'], sfx=[('subida', 0.1, .6)], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_d1, falas=['d1'], **V((960, 460), (1.0, 1.08))),
    dict(draw=s_d2, falas=['d2'], **V(((600, 560), (760, 560)), (1.0, 1.05))),
    dict(draw=s_d3, falas=['d3'], sfx=[('buzzer', 0.1, .5)], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_d4, falas=['d4'], **V((960, 500), (1.0, 1.1))),
    dict(draw=s_d5, falas=['d5'], sfx=[('steps', 0.05, .7)], **V(((1300, 560), (900, 560)), (1.0, 1.0))),
    dict(draw=s_d6, falas=['d6'], sfx=[('whoosh', 0.1, .7)], **V((1100, 560), (1.0, 1.05))),
    dict(draw=s_d7, falas=['d7'], sfx=[('whoosh', 0.1, 1.0), ('thud', 0.4, .5)], shake=[0.35], **V((1200, 600), (.9, .9))),
    dict(draw=s_d8, falas=['d8'], sfx=[('subida', 0.1, .6)], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_e1, falas=['e1'], sfx=[('brilho', 0.2, .5)], **V((960, 600), (1.0, 1.06))),
    dict(draw=s_e2, falas=['e2'], sfx=[('thud', 0.1, .4), ('thud', 0.5, .45), ('thud', 0.85, .5), ('thud', 1.15, .55), ('thud', 1.45, .6)], **V((960, 640), (1.0, 1.1))),
    dict(draw=s_f1, falas=['f1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_f2, falas=['f2'], **V((960, 500), (1.0, 1.08))),
    dict(draw=s_f3, falas=['f3'], sfx=[('buzzer', 0.05, .7)], shake=[0.05], **V((960, 500), (1.08, 1.0))),
    dict(draw=s_f4, falas=['f4'], sfx=[('queda', 0.1, .7)], **V((960, 500), (1.0, 1.1))),
    dict(draw=s_g1, falas=['g1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_g2, falas=['g2'], **V((960, 560), (.75, .8))),
    dict(draw=s_g3, falas=['g3'], hold=1.0, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
