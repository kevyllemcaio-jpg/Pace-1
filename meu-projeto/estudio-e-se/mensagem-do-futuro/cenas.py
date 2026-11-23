import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
import kit
from kit import *
from render import Video, main
def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sys.modules[name] = m; sp.loader.exec_module(m); return m
VB = _load('vidabase', os.path.expanduser('~/vid/vida/cenas.py'))
from vidabase import onibus, carro, raiox_fundo, cabeca_raiox, mao, tint, pisca, linhas_velocidade, impacto

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {'bia': dict(corpo='mulher', skin='#F1C27D', top='hoodie', suit='#8338EC', print='#F4EFE2', hair='rabo', hair_col='#3B2416', lashes=True, hat_band='#FF5FA2')})
BIA = EL['bia']
PROF = dict(corpo='homem', skin='#E6BE8E', top='colete', suit='#5A6B7A', shirt='#F4EFE2', hair='bald', hair_col='#8A7A6A', glasses=True, moustache=True, figurante=True)
kit.DESTAQUES = ['MENSAGEM', 'DEZ', 'SEGUNDOS', 'ÔNIBUS', 'DELA', 'FREOU', 'CABEÇA', 'ACREDITA', 'CÉREBRO', 'DÉCIMOS', 'ETERNIDADE', 'USOU', 'BOLADA', 'PROFESSOR', 'BUEIRO', 'DIFERENTE', 'PORTA', 'CAMPAINHA', 'NINGUÉM', 'VIBROU', 'TARDE', 'DENTRO', 'RESPONDE', 'CORRE', 'PARTE']


def bia(c, x, y, s, t, **kw): kw.setdefault('eyes', pisca(t)); draw_char(c, x, y, s, BIA, **kw)
def celular(c, S, t, t0, msgs, de='EU (Bia)', escuro=False):
    x0, y0, x1, y1 = S.view; cx = (x0 + x1) / 2; w = (x1 - x0) * .78; top = y0 + (y1 - y0) * .1; h = (y1 - y0) * .62
    mao(c, cx, top + h + 200, 1.15)
    rect(c, cx - w / 2, top, cx + w / 2, top + h, '#14121A', LW, r=40); rect(c, cx - w / 2 + 20, top + 30, cx + w / 2 - 20, top + h - 30, '#10131C' if escuro else '#F4F6FA', 0, r=22)
    f = skia.Font(INTER_K, 30); c.drawString(de, cx - f.measureText(de) / 2, top + 90, f, fp('#FF5FA2' if escuro else '#333344'))
    line(c, cx - w / 2 + 30, top + 115, cx + w / 2 - 30, top + 115, 2, '#BBBBC8')
    for i, (txt, tt) in enumerate(msgs):
        k = back(K(t, tt, .3), 1.3)
        if k <= 0: continue
        fb = skia.Font(INTER_B, 32); bw = min(w - 80, fb.measureText(txt) + 50); by = top + 150 + i * 110
        c.save(); c.translate(cx - w / 2 + 40, by); c.scale(k, k)
        rect(c, 0, 0, bw, 84, '#FF5FA2' if escuro else '#2B6CFF', 0, r=30); c.drawString(txt, 25, 54, fb, fp('#FFFFFF')); c.restore()
def ponto(c, t):
    cenario(c, 'cidade', t)
    rect(c, 1240, 520, 1260, 1000, '#3B4660', 0); rect(c, 1150, 470, 1350, 560, '#2B6CFF', LW, r=10); label(c, 'BUS', 1250, 535, 46, '#FFFFFF', font=INTER_K, align='center', skew=0)
def casa(c, t, noite=False):
    cenario(c, 'sala', t)
    rect(c, 1380, 300, 1640, 840, '#8B5A2B', LW, r=8); circ(c, 1600, 590, 12, GOLD, 3); circ(c, 1510, 450, 20, '#14121A', 3)
    if noite: tint(c, '#0A1136', .5)


# ---------------------------------------------------------------- tomadas
def s_a1(c, t, S): blur_begin(c, 12); ponto(c, t); c.restore(); celular(c, S, t, S.s0, [("Não entra no ônibus.", S.s0 + .4)])
def s_a2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); tempo = max(0, 10 - int((t - S.s0) * 4))
    poplabel(c, f"00:{tempo:02d}", 960, 560, t, S.s0, 170, '#FF3B5C', font=INTER_K, stroke=18)
def s_b1(c, t, S): ponto(c, t); bia(c, 1000, 1000, 1.0, t, face=.2, mouth='flat', arms=('down', 'hold'))
def s_b2(c, t, S): blur_begin(c, 12); ponto(c, t); c.restore(); celular(c, S, t, S.s0, [("Não entra no ônibus.", S.s0 + .1)])
def s_b3(c, t, S): blur_begin(c, 12); ponto(c, t); c.restore(); celular(c, S, t, S.s0, [("Não entra no ônibus.", S.s0 - 5)], de='EU (Bia)'); poplabel(c, "???", (S.view[0] + S.view[2]) / 2, 120, t, S.s0 + .3, 90, '#FF5FA2', font=INTER_K)
def s_b4(c, t, S):
    ponto(c, t); bia(c, 960, 1000, 1.0, t, face=.4, eyes='closed', mouth='smile', arms=('hip', 'hold'), bob=4 * abs(math.sin(t * 9)))
def s_b5(c, t, S):
    onibus(c, t); hit = S.at('b5:fim-0.7'); u = K(t, hit, .25)
    bia(c, 900 - 120 * u, 1000, 1.0, t, face=-.3, eyes='wide' if t > hit else pisca(t), mouth='o' if t > hit else 'flat', tilt=-14 * u)
    if t > hit: linhas_velocidade(c, 900, 600, t, .5)
def s_b6(c, t, S):
    blur_begin(c, 10); onibus(c, t); c.restore(); bia(c, 960, 1300, 2.0, t, face=0, eyes='closed', mouth='o', brow=1, sweat=1)
    for i in range(4): a = t * 4 + i * 1.57; label(c, '*', 960 + math.cos(a) * 200, 380 + math.sin(a) * 60, 70, '#FFE14A', font=INTER_K, align='center', skew=0)
def s_c1(c, t, S): blur_begin(c, 12); onibus(c, t); c.restore(); celular(c, S, t, S.s0, [("Não entra no ônibus.", S.s0 - 5), ("Agora tu acredita?", S.s0 + .7)])
def s_c2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); poplabel(c, "10 s", 960, 560, t, S.s0, 200, '#FFFFFF', font=INTER_K, stroke=18)
def s_c3(c, t, S):
    raiox_fundo(c); cabeca_raiox(c, 960, 520, 1.2, t, .6 * abs(math.sin(t * 8)))
    poplabel(c, "0,2 s", 960, 960, t, S.s0 + .8, 110, '#FFE14A', font=INTER_K)
def s_c4(c, t, S):
    raiox_fundo(c); u = K(t, S.s0, 1.0)
    rect(c, 660, 760, 1260, 820, '#14121A', 4, r=30); rect(c, 665, 765, 665 + 25, 815, '#FFE14A', 0, r=26)
    rect(c, 660, 860, 1260, 920, '#14121A', 4, r=30); rect(c, 665, 865, 665 + 590 * u, 915, '#FF5FA2', 0, r=26)
    label(c, "0,2 s", 600, 805, 40, '#FFE14A', font=INTER_K, align='right', skew=0); label(c, "10 s", 600, 905, 40, '#FF5FA2', font=INTER_K, align='right', skew=0)
def s_d1(c, t, S): cenario(c, 'quarto', t); bia(c, 960, 1000, 1.0, t, face=0, eyes='half', mouth='smirk', arms=('down', 'hold'))
def s_d2(c, t, S):
    cenario(c, 'parque', t); u = K(t, S.s0, 1.0); bx, by = lerp(1700, 700, u), 560 - 80 * math.sin(math.pi * u)
    bia(c, 960, 1000, 1.0, t, face=.6, eyes='half', mouth='smirk', tilt=-16 * K(t, S.s0 + .4, .2)); circ(c, bx, by, 50, '#F4EFE2', LW); line(c, bx - 30, by, bx + 30, by, 3)
def s_d3(c, t, S):
    cenario(c, 'sala_aula', t); bia(c, 760, 1000, .95, t, face=.6, eyes='half', mouth='open', arms=('down', 'gesture'))
    draw_char(c, 1200, 1000, 1.0, PROF, face=-.6, eyes='wide', mouth='o')
def s_d4(c, t, S):
    cenario(c, 'cidade', t); rect(c, 800, 1000, 1120, 1050, '#2B2D42', LW, r=6)
    for i in range(6): line(c, 820 + i * 52, 1005, 820 + i * 52, 1045, 4, '#8D99AE')
    u = K(t, S.s0, .6); py = lerp(700, 900, u); rect(c, 920, py - 60, 1000, py + 60, '#14121A', LW * .8, r=12)
    bia(c, 1150, 1000, 1.0, t, face=-.6, eyes='wide', mouth='flat', arms=('down', 'push'))
def s_e1(c, t, S): blur_begin(c, 12); casa(c, t, True); c.restore(); celular(c, S, t, S.s0, [("Não abre a porta.", S.s0 + .6)], escuro=True)
def s_e2(c, t, S): blur_begin(c, 12); casa(c, t, True); c.restore(); celular(c, S, t, S.s0, [("Não abre a porta.", S.s0 - 5)], escuro=True)
def s_e3(c, t, S):
    casa(c, t, True); bia(c, 900, 1000, 1.0, t, face=.7, eyes='wide', mouth='o')
    if int(t * 6) % 2: poplabel(c, "DING DONG", 1500, 240, t, S.s0, 70, '#FFFFFF', font=INTER_K)
def s_e4(c, t, S):
    casa(c, t, True); bia(c, 1460, 1000, 1.0, t, face=.9, eyes='half', mouth='flat', arms=('down', 'chin'))
def s_e5(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#000000'))
    c.save(); p = skia.Path(); p.addCircle(960, 560, 420); c.clipPath(p, doAntiAlias=True)
    c.drawRect(skia.Rect(0, 0, 2000, 1200), sp(radial(960, 560, 520, [hx('#3A3F55'), hx('#141622')])))
    for i in range(5): line(c, 960 + (i - 2) * 200, 140, 960 + (i - 2) * 420, 1000, 4, '#585E78')
    c.restore()
    c.drawCircle(960, 560, 420, ink(40, (0, 0, 0)))
def s_e6(c, t, S): blur_begin(c, 12); casa(c, t, True); c.restore(); celular(c, S, t, S.s0, [("Não abre a porta.", S.s0 - 5)], escuro=True); tint(c, '#000000', .1 * (int(t * 12) % 2))
def s_e7(c, t, S):
    blur_begin(c, 12); casa(c, t, True); c.restore(); celular(c, S, t, S.s0, [("Não abre a porta.", S.s0 - 5), ("Tarde demais.", S.s0 + .2), ("Eu já tô aqui dentro.", S.s0 + 1.0)], escuro=True)
def s_e8(c, t, S):
    casa(c, t, True); bia(c, 760, 1000, 1.0, t, face=-.2, eyes='wide', mouth='o', sweat=(t - S.s0) * 1.5, brow=1)
    c.saveLayer(None, None); draw_char(c, 1380, 1000, 1.0, dict(BIA, figurante=True), face=-.6, eyes='half', mouth='smirk'); c.drawRect(skia.Rect(0, 0, 2400, 1400), fp('#08060E', 245, blend=skia.BlendMode.kSrcATop)); c.restore()
    for sx in (-1, 1): add_light(c, 1380 + sx * 30 - 25, 590, 30, '#FF5FA2', 220)
def s_f1(c, t, S):
    casa(c, t, True); bia(c, 960, 1000, 1.0, t, face=0, eyes='wide', mouth='flat', arms=('down', 'hold'))
    poplabel(c, "RESPONDE?", 960, 240, t, S.s0 + .1, fit("RESPONDE?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#2B6CFF', font=INTER_K)
    poplabel(c, "OU CORRE?", 960, 360, t, S.s0 + 1.4, fit("OU CORRE?", 100, (S.view[2] - S.view[0]) * .85, INTER_K), '#FF3B5C', font=INTER_K)
def s_f2(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814')); bia(c, 960, 1100, 1.2, t, face=0, eyes='half', mouth='flat')
    poplabel(c, "PARTE 2?", 960, 300, t, S.s0 + .1, 130, '#FF5FA2', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.06): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_a1, falas=['a1'], sfx=[('notif', 0.4, .9)], **V((960, 540), (1.0, 1.06))),
    dict(draw=s_a2, falas=['a2'], sfx=[('relogio', 0.05, .6)], **V((960, 560), (1.0, 1.1))),
    dict(draw=s_b1, falas=['b1'], **V((1050, 560), (1.0, 1.05))),
    dict(draw=s_b2, falas=['b2'], sfx=[('notif', 0.1, .8)], **V((960, 540), (1.0, 1.06))),
    dict(draw=s_b3, falas=['b3'], **V((960, 540), (1.06, 1.12))),
    dict(draw=s_b4, falas=['b4'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_b5, falas=['b5'], sfx=[('buzzer', 'b5:fim-0.8', .7), ('thud', 'b5:fim-0.7', .9)], shake=['b5:fim-0.7'], **V(((1000, 560), (860, 560)), (1.0, 1.05))),
    dict(draw=s_b6, falas=['b6'], **V((960, 500), (1.0, 1.06))),
    dict(draw=s_c1, falas=['c1'], sfx=[('notif', 0.7, .8)], **V((960, 540), (1.0, 1.06))),
    dict(draw=s_c2, falas=['c2'], **V((960, 560), (1.0, 1.1))),
    dict(draw=s_c3, falas=['c3'], sfx=[('brilho', 0.8, .5)], **V((960, 620), (1.0, 1.06))),
    dict(draw=s_c4, falas=['c4'], **V((930, 840), (.8, .85))),
    dict(draw=s_d1, falas=['d1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_d2, falas=['d2'], sfx=[('whoosh', 0.3, .7)], **V((960, 600), (1.0, 1.05))),
    dict(draw=s_d3, falas=['d3'], sfx=[('ding', 0.3, .5)], **V(((760, 560), (1200, 560)), (1.0, 1.0))),
    dict(draw=s_d4, falas=['d4'], sfx=[('pop', 0.5, .6)], **V((1000, 720), (1.0, 1.06))),
    dict(draw=s_e1, falas=['e1'], sfx=[('notif', 0.6, .9)], **V((960, 540), (1.0, 1.06))),
    dict(draw=s_e2, falas=['e2'], **V((960, 540), (1.06, 1.14))),
    dict(draw=s_e3, falas=['e3'], sfx=[('ding', 0.05, .9), ('ding', 0.35, .8)], **V(((900, 560), (1460, 520)), (1.0, 1.0))),
    dict(draw=s_e4, falas=['e4'], **V((1500, 480), (1.1, 1.2))),
    dict(draw=s_e5, falas=['e5'], **V((960, 560), (1.0, 1.08))),
    dict(draw=s_e6, falas=['e6'], sfx=[('notif', 0.05, .9)], shake=[0.05], **V((960, 540), (1.0, 1.06))),
    dict(draw=s_e7, falas=['e7'], sfx=[('boom', 1.0, .7)], **V((960, 560), (1.0, 1.12))),
    dict(draw=s_e8, falas=['e8'], sfx=[('buzzer', 0.1, .5)], **V(((760, 540), (1380, 540)), (1.0, 1.0))),
    dict(draw=s_f1, falas=['f1'], **V((960, 560), (1.0, 1.05))),
    dict(draw=s_f2, falas=['f2'], hold=1.0, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
