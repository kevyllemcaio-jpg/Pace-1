import sys, os, math, importlib.util
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *
from render import Video, main
_sp = importlib.util.spec_from_file_location('xpbase', os.path.expanduser('~/vid/xp/cenas.py')); X = importlib.util.module_from_spec(_sp); sys.modules['xpbase'] = X; _sp.loader.exec_module(X)
from xpbase import *  # noqa  (efeitos de anime, masmorra, painel do sistema, líder, grupo, chefe)
sys.modules['xpbase'] = X

PROJ = os.path.dirname(os.path.abspath(__file__))
EL = carregar_elenco(PROJ, {'leo': dict(corpo='homem', skin='#D9A877', top='hoodie', suit='#3E6FA8', print='#F2C14E', hair='espetado', hair_col='#1C1A24')})
LEO = EL['leo']
AZUL = '#38D6FF'


def mochila(c, x, y, s, face=.5, tam=1.0):
    bx = x - face * 70 * s; rect(c, bx - 95 * s * tam, y - 420 * s, bx + 95 * s * tam, y - 140 * s, '#7A5A3C', LW, r=30 * s)
    rect(c, bx - 70 * s * tam, y - 470 * s, bx + 70 * s * tam, y - 400 * s, '#5A3A22', LW * .8, r=20 * s); line(c, bx - 60 * s, y - 300 * s, bx + 60 * s, y - 300 * s, 5 * s)
def leo(c, x, y, s, t, aura=0.0, carga=False, **kw):
    if aura > 0:
        add_light(c, x, y - 300 * s, 520 * s, AZUL, 150 * aura)
        for i in range(10):
            a = t * 3 + i; c.drawCircle(x + math.cos(a) * 150 * s, y - 300 * s + math.sin(a * 1.3) * 260 * s, 6 * s, fp('#BFF4FF', 220 * aura))
    if carga: mochila(c, x, y, s, kw.get('face', .5))
    kw.setdefault('eyes', pisca(t)); draw_char(c, x, y, s, LEO, **kw)
    if aura > .5:
        hx_, hy_ = head(x, y, s)
        for sx in (-1, 1): add_light(c, hx_ + sx * 32 * s, hy_, 30 * s, AZUL, 220 * aura)
def portal(c, x, y, r, t, cor='#38D6FF', k=1.0):
    if k <= 0: return
    r *= k; c.drawOval(skia.Rect(x - r, y - r * 1.25, x + r, y + r * 1.25), fp('#05030C'))
    for i in range(6):
        p = skia.Path(); p.addArc(skia.Rect(x - r * (1 - i * .12), y - r * 1.25 * (1 - i * .12), x + r * (1 - i * .12), y + r * 1.25 * (1 - i * .12)), t * 120 * (1 if i % 2 else -1) + i * 50, 220)
        c.drawPath(p, ink(10 - i, cor, 230))
    add_light(c, x, y, r * 2.2, cor, 140)
def cidade(c, t, portais=((960, 260, 160),), cor='#38D6FF'):
    cenario(c, 'cidade', t, luz=False)
    for (x, y, r) in portais: portal(c, x, y, r, t, cor)
def luz_cidade(c, t, extra=()):
    cenario_luz(c, 'cidade')
def placa_guilda(c, S, t, t0, glitch=False):
    x0, y0, x1, y1 = S.view; cx = (x0 + x1) / 2; w = (x1 - x0) * .84; yy = y0 + (y1 - y0) * .16
    k = back(K(t, t0, .35), 1.2)
    if k <= 0: return
    c.save(); c.translate(cx, yy); c.scale(k, k); c.translate(-cx, -yy)
    rect(c, cx - w / 2, yy, cx + w / 2, yy + 300, '#2B2233', LW, r=14)
    f = skia.Font(INTER_K, 40); s_ = "RANKING DA GUILDA"; c.drawString(s_, cx - f.measureText(s_) / 2, yy + 60, f, fp('#FFE14A'))
    f2 = skia.Font(INTER_B, 44); s2 = "LÉO — RANK E"; c.drawString(s2, cx - f2.measureText(s2) / 2, yy + 150, f2, fp('#FFFFFF'))
    if glitch:
        s3 = "RANK ???"; f3 = skia.Font(INTER_K, 60); jx = 8 * math.sin(t * 60)
        c.drawString(s3, cx - f3.measureText(s3) / 2 + jx, yy + 250, f3, fp(AZUL)); add_light(c, cx, yy + 230, 260, AZUL, 120)
    c.restore()


# ---------------------------------------------------------------- tomadas
def s_gancho(c, t, S):
    blur_begin(c, 12); c.save(); c.translate(-200, -260); c.scale(1.5, 1.5); masmorra(c, t); c.restore(); c.restore(); luz_masmorra(c, t, [(500, 300)])
    leo(c, 960, 1300, 2.3, t, aura=.7 + .3 * math.sin(t * 3), face=.1, eyes='half', mouth='flat')
    w = (S.view[2] - S.view[0]) * .9
    poplabel(c, "O MAIS FRACO", 960, 140, t, S.s0 + .1, fit("O MAIS FRACO", 110, w, INTER_K), '#FFFFFF', rot=-3, font=INTER_K, stroke=14)
    poplabel(c, "DO MUNDO?", 960, 250, t, S.s0 + .4, fit("DO MUNDO?", 120, w, INTER_K), '#FFE14A', rot=-3, font=INTER_K, stroke=14)
def s_portais(c, t, S):
    cidade(c, t, ((600, 240, 120), (1300, 200, 170), (960, 420, 90)))
    for i in range(6): chefe(c, 300 + i * 260, 1000, .55 + .1 * (i % 2), t, face=(-1) ** i * .5, eyes='half')
    luz_cidade(c, t)
def s_cacadores(c, t, S):
    masmorra(c, t)
    for i, (spec, x, cor) in enumerate(((MAGA, 700, '#C77DFF'), (LID, 960, '#FFD23F'), (ARQ, 1220, '#8CE95A'))):
        add_light(c, x, 700, 380, cor, 120)
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, x, 1000, .95, t, face=0, eyes='half', mouth='smirk', arms=('hip', 'hip'))
    luz_masmorra(c, t, extra=[('pool', 960, 700, 700, .7)])
    for i, rk in enumerate('SABCDE'):
        poplabel(c, rk, 710 + i * 100, 260, t, S.at('n3') + 1.2 + i * .18, 90, ['#FFD23F', '#FF8A3D', '#4CC9F0', '#8CE95A', '#C77DFF', '#9A9A9A'][i], font=INTER_K)
def s_ranking(c, t, S):
    guilda(c, t); sombra(c, 560, 1000, 90)
    leo(c, 560, 1000, .9, t, face=.4, mouth='flat', arms=('down', 'down'), brow=.4, brow_tilt=-.4)
    lider(c, 1380, 1000, 1.05, t, face=-.6, mouth='open' if int(t * 7) % 2 else 'smile', eyes='closed', arms=('hip', 'hip'), bob=4 * abs(math.sin(t * 9)))
    grupo(c, t, 1560, rir=True); luz_guilda(c, t)
    painel(c, S, t, S.at('n4+0.2'), "CAÇADOR", [("LÉO", '#FFFFFF'), ("RANK: E", '#9A9A9A')])
    if t > S.at('n4+1.8'): stamp(c, "CAÇADOR DE PAPEL", (S.view[0] + S.view[2]) / 2, 760, (t - S.at('n4+1.8')) / .5, rot=-8, size=fit("CAÇADOR DE PAPEL", 70, (S.view[2] - S.view[0]) * .8, MARKER))
def s_carrega(c, t, S):
    masmorra(c, t); u = K(t, S.s0, S.s1 - S.s0)
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, 170), (ARQ, 340))):
        x = lerp(700, 380, u) + dx; ph = (t - S.s0) * 8 + i
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, x, 1000, .85, t, face=-.7, legs=walk_legs(ph), bob=5 * abs(math.sin(ph)))
    ph = (t - S.s0) * 6; leo(c, lerp(1500, 1180, u), 1000, .85, t, carga=True, face=-.6, sweat=(t - S.s0) * .8, legs=walk_legs(ph), bob=4 * abs(math.sin(ph)), tilt=8, mouth='flat')
    luz_masmorra(c, t)
def s_fecha(c, t, S):
    masmorra(c, t, tochas=[(1500, 380)]); k = 1 - K(t, S.at('n6+1.2'), 1.0)
    portal(c, 520, 560, 200, t, AZUL, k)
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, 180), (ARQ, 360))):
        (lider if spec is LID else (lambda c, x, y, s, t, **k_: draw_char(c, x, y, s, spec, **k_)))(c, 950 + dx, 1000, .85, t, face=.7, eyes='wide', mouth='o')
    leo(c, 1500, 1000, .85, t, carga=True, face=.7, eyes='wide', mouth='o')
    luz_masmorra(c, t, tochas=[(1500, 380)], extra=[('pool', 520, 560, 500, .9 * k)])
def s_monstro(c, t, S):
    sala_chefe(c, t, porta=0); u = K(t, S.s0, 1.6)
    chefe(c, 960, 1020 + 400 * (1 - ease(u)), 2.4, t, face=0, eyes='half', mouth='open', olhos=u)
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 960, 400, 700, .4)])
def s_fogem(c, t, S):
    masmorra(c, t); u = K(t, S.s0, S.s1 - S.s0)
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, 150), (ARQ, 300))):
        x = lerp(900, 100, u) + dx; ph = (t - S.s0) * 14 + i
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, x, 1000, .85, t, face=-.8, eyes='wide', mouth='open', legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)), arms=('gesture', 'gesture'))
    leo(c, 1450, 1000, .9, t, carga=True, face=-.5, eyes='wide', mouth='o', arms=('down', 'gesture'), sweat=(t - S.s0))
    luz_masmorra(c, t)
def s_apanha(c, t, S):
    sala_chefe(c, t, porta=0); h1, h2 = S.at('n9+0.3'), S.at('n9+1.4')
    chefe(c, 1350, 1020, 2.2, t, face=-.5, eyes='half', arms=('down', ('down', 'push', K(t, h1 - .2, .2) * (1 - K(t, h1 + .2, .2)) + K(t, h2 - .2, .2) * (1 - K(t, h2 + .2, .2)))))
    caido = K(t, h2, .4)
    c.save(); c.translate(700, 1000); c.rotate(-60 * caido); c.translate(-700, -1000)
    leo(c, 700, 1000, .9, t, face=.5, eyes='closed' if t > h1 else 'wide', mouth='o', brow=1, sweat=1); c.restore()
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)])
    for h in (h1, h2): impacto(c, (t - h) / .07); faiscas(c, 820, 650, t, h, 18, '#FFFFFF')
    if t > S.at('n9:fim-1.4'): add_light(c, 700, 600, 400, AZUL, 200 * K(t, S.at('n9:fim-1.4'), .4))
def s_sistema(c, t, S):
    blur_begin(c, 14); c.save(); c.translate(-200, -260); c.scale(1.5, 1.5); sala_chefe(c, t, 0); c.restore(); c.restore()
    night(c, [('pool', 960, 700, 700, .5)], '#2A2A60')
    leo(c, 960, 1420, 2.2, t, face=0, eyes='wide', mouth='o', aura=.4, brow=1)
    painel(c, S, t, S.s0, "CANDIDATO ENCONTRADO", [("CONDIÇÃO:", '#FFFFFF'), ("SOBREVIVER 60 SEGUNDOS", '#FFE14A')], y=S.view[1] + 150)
    tempo = max(0, 60 - int((t - S.s0) * 3)); poplabel(c, f"00:{tempo:02d}", 960, S.view[3] - 260, t, S.s0 + .5, 90, AZUL, font=INTER_K)
def s_golpes_xp(c, t, S):
    sala_chefe(c, t, porta=0)
    ciclo = (t - S.s0) % .9; bate = ciclo < .25
    chefe(c, 1350, 1020, 2.2, t, face=-.5, eyes='half', arms=('down', 'push' if bate else 'down'))
    leo(c, 760, 1000, 1.0, t, face=.5, aura=K(t, S.s0, 2.5), eyes='half', mouth='flat', tilt=-6 if bate else 0)
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)])
    for k in range(6):
        tk = S.s0 + k * .9
        if t >= tk: impacto(c, (t - tk) / .05); xp_pop(c, f"+{(k + 1) * 120} XP", 760 + (k % 2) * 80, 300, t, tk + .05, '#BFF4FF', 64)
def s_niveis(c, t, S):
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#0A0814'))
    d = S.v.fala_util('n12'); marks = [S.at('n12') + d * k for k in (0, .4, .7)]; lv = 2 if t < marks[1] else 6 if t < marks[2] else 15
    linhas_velocidade(c, 960, 560, t, .7, '#9FE8FF')
    leo(c, 960, 1150, 1.3, t, face=0, aura=1, eyes='half', mouth='flat', arms=('hip', 'hip'))
    luz_masmorra(c, t, tochas=[], extra=[('pool', 960, 600, 700, .7)])
    poplabel(c, f"NÍVEL {lv}", 960, 300, t, marks[[2, 6, 15].index(lv)], 130, '#FFE14A', rot=-4, font=INTER_K, stroke=16)
def s_mais_forte(c, t, S):
    sala_chefe(c, t, porta=0); bate = ((t - S.s0) % .6) < .2
    chefe(c, 1300, 1020, 2.2, t, face=-.5, eyes='wide', mouth='open', arms=('push' if bate else 'down', 'push' if not bate else 'down'), sweat=t - S.s0)
    leo(c, 780, 1000, 1.05, t, face=.5, aura=1, eyes='half', mouth='smirk', arms=('down', 'down'))
    luz_masmorra(c, t, tochas=[(600, 380), (1320, 380)], extra=[('pool', 780, 650, 500, .8)])
    tempo = max(0, 30 - int((t - S.s0) * 10)); poplabel(c, f"00:{tempo:02d}", (S.view[0] + S.view[2]) / 2, 330, t, S.s0, 80, AZUL, font=INTER_K)
def s_segura(c, t, S):
    hit = S.at('n14:fim-1.0')
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#120A1C')); linhas_velocidade(c, 960, 600, t, K(t, hit, .1), '#FFFFFF', 80)
    chefe(c, 1260, 1150, 2.0, t, face=-.6, eyes='wide', mouth='o', arms=('down', 'push'))
    leo(c, 780, 1150, 1.3, t, face=.5, aura=1, eyes='half', mouth='flat', arms=('down', ('down', 'push', K(t, hit - .2, .2))))
    impacto(c, (t - hit) / .07); faiscas(c, 1010, 760, t, hit, 30, '#BFF4FF')
    poplabel(c, "00:00", (S.view[0] + S.view[2]) / 2, 200, t, hit, 90, '#FFE14A', font=INTER_K)
def s_devolve(c, t, S):
    hit = S.s0 + .25; u = K(t, hit, .8)
    c.drawRect(skia.Rect(-2000, -2000, 4000, 4000), fp('#140A1E')); linhas_velocidade(c, 960, 540, t, 1, '#FFFFFF', 100)
    c.save(); c.translate(lerp(1300, 2400, ease_out(u)), 1100); c.rotate(-50 * u); chefe(c, 0, 0, 2.0, t, eyes='closed', mouth='o'); c.restore()
    leo(c, 760, 1150, 1.3, t, face=.6, aura=1, eyes='half', mouth='open', arms=('down', 'push'), tilt=-10)
    corte(c, 1100, 640, 420, (t - hit) / .15, ang=-60, cor='#BFF4FF'); impacto(c, (t - hit) / .1)
def s_saida(c, t, S):
    cidade(c, t, ((1500, 520, 200),))
    for i, (spec, dx) in enumerate(((LID, 0), (MAGA, 170), (ARQ, 340))):
        (lider if spec is LID else (lambda c, x, y, s, t, **k: draw_char(c, x, y, s, spec, **k)))(c, 520 + dx, 1000, .85, t, face=-.3, eyes='wide', mouth='o')
    luz_cidade(c, t); placa_guilda(c, S, t, S.at('n16+1.2'))
def s_placa(c, t, S):
    blur_begin(c, 10); cidade(c, t, ((1500, 520, 200),)); c.restore(); luz_cidade(c, t)
    placa_guilda(c, S, t, S.s0, glitch=t > S.at('n17+1.4'))
    lider(c, 960, 1350, 1.6, t, face=0, eyes='wide', mouth='o', arms=('chin', 'down'), sweat=(t - S.s0))
def s_missao_s(c, t, S):
    cidade(c, t, ((960, 300, 320),), '#B03AFF')
    leo(c, 960, 1000, 1.0, t, face=0, aura=.8, eyes='half', mouth='flat', arms=('down', 'down'))
    luz_cidade(c, t)
    painel(c, S, t, S.at('n18+0.8'), "PRÓXIMA MISSÃO", [("PORTAL DE RANK S", '#FF6B9D'), ("TEMPO: 24:00:00", '#FFE14A')], y=S.view[1] + 150)
def s_fim(c, t, S):
    cidade(c, t, ((960, 300, 320),), '#B03AFF'); luz_cidade(c, t)
    leo(c, 960, 1000, 1.0, t, face=0, aura=1, eyes='half', mouth='smirk')
    tint(c, '#000000', .55 * K(t, S.s0, .4))
    poplabel(c, "PARTE 2?", (S.view[0] + S.view[2]) / 2, 560, t, S.s0 + .2, 130, '#FFE14A', font=INTER_K, stroke=16)


V = lambda f, z=(1.0, 1.08): dict(focus_v=f, zoom_v=z)
SEQ = [
    dict(draw=s_gancho, falas=['n1'], **V((960, 440), (1.0, 1.08))),
    dict(topo='10 ANOS ATRÁS', draw=s_portais, falas=['n2'], sfx=[('boom', 0.3, .6)], **V(((960, 300), (960, 620)), (1.0, .9))),
    dict(topo='OS CAÇADORES', draw=s_cacadores, falas=['n3'], **V((960, 560), (.85, .9))),
    dict(topo='GUILDA', draw=s_ranking, falas=['n4'], sfx=[('ding', 'n4+0.2', .6), ('thud', 'n4+1.8', .7)], **V(((620, 560), (900, 560)), (.9, .9))),
    dict(topo='MASMORRA', draw=s_carrega, falas=['n5'], sfx=[('steps', 0.1, .5)], **V(((1300, 540), (1000, 540)), (1.0, 1.05))),
    dict(topo='MASMORRA', draw=s_fecha, falas=['n6'], sfx=[('glitch', 'n6+1.2', .7)], **V(((1200, 560), (600, 560)), (1.0, 1.0))),
    dict(topo='MASMORRA', draw=s_monstro, falas=['n7'], sfx=[('boom', 0.2, .9)], shake=[0.6], **V(((960, 600), (960, 380)), (1.0, .9))),
    dict(topo='MASMORRA', draw=s_fogem, falas=['n8'], sfx=[('steps', 0.1, .6)], **V(((800, 560), (1400, 560)), (1.0, 1.05))),
    dict(topo='MASMORRA', draw=s_apanha, falas=['n9'], sfx=[('thud', 'n9+0.3', .9), ('thud', 'n9+1.4', .9), ('notif', 'n9:fim-1.4', .7)], shake=['n9+0.3', 'n9+1.4'], **V(((1080, 560), (820, 560)), (.85, .95))),
    dict(topo='SISTEMA', draw=s_sistema, falas=['n10'], sfx=[('notif', 0.05, .8), ('relogio', 0.5, .5)], **V((960, 480), (1.0, 1.05))),
    dict(topo='SISTEMA', draw=s_golpes_xp, falas=['n11'], sfx=[('thud', 0.0, .7), ('thud', 0.9, .7), ('thud', 1.8, .7), ('thud', 2.7, .7), ('ding', 1.0, .4), ('ding', 2.0, .4)], **V(((1000, 560), (800, 520)), (1.0, 1.08))),
    dict(draw=s_niveis, falas=['n12'], sfx=[('subida', 0.05, .7), ('whoosh', 0.1, .6)], **V((960, 520), (1.0, 1.15))),
    dict(topo='SISTEMA', draw=s_mais_forte, falas=['n13'], sfx=[('thud', 0.1, .6), ('thud', 0.7, .6), ('thud', 1.3, .6), ('thud', 1.9, .6)], **V(((1000, 560), (800, 540)), (1.0, 1.05))),
    dict(draw=s_segura, falas=['n14'], sfx=[('boom', 'n14:fim-1.0', 1.0)], shake=['n14:fim-1.0'], **V((1010, 640), (.9, .85))),
    dict(draw=s_devolve, falas=['n15'], hold=.5, sfx=[('whoosh', 0.1, .9), ('boom', 0.25, 1.0)], shake=[0.25], **V((1000, 600), (1.15, 1.0))),
    dict(topo='CIDADE', draw=s_saida, falas=['n16'], **V(((700, 560), (900, 520)), (1.0, 1.05))),
    dict(topo='CIDADE', draw=s_placa, falas=['n17'], sfx=[('glitch', 'n17+1.4', .8)], **V((960, 520), (1.0, 1.06))),
    dict(draw=s_missao_s, falas=['n18'], sfx=[('notif', 'n18+0.8', .8), ('boom', 'n18:fim-1.0', .7)], **V(((960, 300), (960, 560)), (1.0, .92))),
    dict(draw=s_fim, falas=['n19'], hold=1.2, **V((960, 560), (1.0, 1.05))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
