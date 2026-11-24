# Motor de cenas da série longa (16:9): cada fala do roteiro aponta para um tipo de cena com parâmetros.
# Linha do roteiro:  tipo|k=v;k=v|texto falado
import sys, os, math, importlib.util, json
sys.path.insert(0, os.path.expanduser('~/vid/lib')); sys.path.insert(0, '/root/vid/serie16')
import kit
from kit import *
def _load(name, path):
    if name in sys.modules: return sys.modules[name]
    sp_ = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp_); sys.modules[name] = m; sp_.loader.exec_module(m); return m
_load('esc6base', os.path.expanduser('~/vid/escudo6/cenas.py'))
from esc6base import GUARDA, ligacoes
from esc5base import CRIANCA, raio
from esc4base import nina as _nina, forja, barreira, martelo, vapor
from esc3base import fenda
from esc2base import kai as _kai, heroi as _heroi, rei as _rei, arco, circulo_magico, coroa, KAI, ESP, LAN, ARC, REI
from esc1base import escudo, espada, lanca, pergaminho, LOBO, POVO
from xpbase import goblin, chefe, painel, impacto, faiscas, linhas_velocidade, tint, pisca, corte, xp_pop
import mundo

EXPR = {  # expressão: eyes, mouth, brow, brow_tilt, sweat
    'neutro': ('dot', 'flat', 0, 0, -1), 'feliz': ('dot', 'smile', 0, 0, -1), 'riso': ('closed', 'open', 0, 0, -1), 'choque': ('wide', 'o', 1, 0, -1),
    'medo': ('wide', 'o', 1, -.6, 1), 'raiva': ('half', 'flat', .9, .8, -1), 'triste': ('half', 'flat', .6, -.6, -1), 'serio': ('half', 'flat', .4, .4, -1),
    'confiante': ('half', 'smirk', .3, .3, -1), 'surpreso': ('wide', 'open', .8, 0, -1), 'cansado': ('half', 'o', .5, -.5, 1), 'sorriso': ('half', 'smirk', 0, 0, -1)}
def ex(e, t, ph=0.0):
    ey, mo, br, bt, sw = EXPR.get(e or 'neutro', EXPR['neutro'])
    if ey == 'dot' and blink(t, 2.7, ph): ey = 'closed'
    return dict(eyes=ey, mouth=mo, brow=br, brow_tilt=bt, sweat=sw)

# ---------------------------------------------------------------- elenco
def pessoa(c, quem, x, y, s, t, face=0.0, e=None, arma=True, brilho=0.0, **kw):
    ph = (x * .013) % 3; d = ex(e, t, ph); d.update(kw); d['face'] = face
    if quem == 'kai': _kai(c, x, y, s, t, com_escudo=arma, brilho=brilho, **d)
    elif quem == 'kai0': _kai(c, x, y, s, t, com_escudo=False, **d)
    elif quem == 'igor': _heroi(c, ESP, x, y, s, t, arma='espada' if arma else None, **d)
    elif quem == 'teo': _heroi(c, LAN, x, y, s, t, arma=None, **d); (lanca(c, x + 110 * s, y - 230 * s, .8 * s, 8) if arma else None)
    elif quem == 'lia': _heroi(c, ARC, x, y, s, t, arma='arco' if arma else None, **d)
    elif quem == 'rei': _rei(c, x, y, s, t, **d)
    elif quem == 'nina': _nina(c, x, y, s, t, martelo=arma, **d)
    elif quem == 'guarda': draw_char(c, x, y, s, GUARDA, **d)
    elif quem == 'lobo': draw_char(c, x, y, s, LOBO, **d)
    elif quem == 'goblin': goblin(c, x, y, s, t, **d)
    elif quem == 'chefe': chefe(c, x, y, s, t, **{k: v for k, v in d.items() if k not in ('sweat',)})
    elif quem.startswith('povo'): draw_char(c, x, y, s, POVO[int(quem[4:] or 0) % 4], **d)
    elif quem.startswith('crianca'): draw_char(c, x, y, s, CRIANCA[int(quem[7:] or 0) % 2], **d)
    elif quem == 'gigante':
        c.saveLayer(None, None); chefe(c, x, y, s, t, **{k: v for k, v in d.items() if k not in ('sweat',)}); c.drawRect(skia.Rect(-1200, -800, 3100, 2000), fp('#120A1E', 235, blend=skia.BlendMode.kSrcATop)); c.restore()
        for sx in (-1, 1): add_light(c, x + sx * 60 * s, y - 330 * s, 40 * s, '#C77DFF', 240)
    elif quem == 'sombra':
        c.saveLayer(None, None); draw_char(c, x, y, s, dict(LAN, figurante=True), **d); c.drawRect(skia.Rect(-1200, -800, 3100, 2000), fp('#08060E', 245, blend=skia.BlendMode.kSrcATop)); c.restore()
        for sx in (-1, 1): add_light(c, x + sx * 30 * s, y + HEAD_CY * s, 30 * s, '#C77DFF', 230)

# ---------------------------------------------------------------- cenários
def fundo(c, t, bg, blur=0):
    if blur: blur_begin(c, blur); c.save(); c.translate(-280, -300); c.scale(1.35, 1.35)
    if bg == 'vila': mundo.vila(c, t)
    elif bg == 'vila_noite': mundo.vila(c, t); tint(c, '#0A1136', .55)
    elif bg == 'vila_fenda': mundo.vila(c, t); tint(c, '#2A1040', .4); fenda(c, 960, 180, 1.3, t)
    elif bg == 'floresta': mundo.floresta(c, t)
    elif bg == 'floresta_noite': mundo.floresta(c, t, 1.0)
    elif bg == 'salao': mundo.salao(c, t)
    elif bg == 'estrada': mundo.estrada(c, t)
    elif bg == 'caverna': mundo.caverna(c, t)
    elif bg == 'mapa_completo': mundo.mapa(c, t, explorado=tuple(mundo.LUGARES), fenda_aberta=True)
    elif bg == 'deserto': mundo.deserto(c, t)
    elif bg == 'deserto_noite': mundo.deserto(c, t); tint(c, '#0A1136', .6)
    elif bg == 'tempestade': mundo.deserto(c, t); tint(c, '#141428', .7)
    elif bg == 'fenda': mundo.estrada(c, t); tint(c, '#2A1040', .55); fenda(c, 960, 260, 2.0, t)
    elif bg == 'forja': forja(c, t)
    elif bg == 'quarto': cenario(c, 'quarto', t); tint(c, '#0A1136', .3)
    elif bg == 'escuro': c.drawRect(skia.Rect(-1200, -800, 3100, 2000), sp(radial(960, 540, 1300, [hx('#1E1A2E'), hx('#07060C')])))
    elif bg == 'raiox': c.drawRect(skia.Rect(-1200, -800, 3100, 2000), sp(radial(960, 540, 1300, [hx('#0F3A4E'), hx('#071820')])))
    if blur: c.restore(); c.restore()
def particulas(c, t, cor='#FFFFFF', n=24, a=120):
    for i in range(n): u = (t * .06 + i / n) % 1; c.drawCircle((i * 157) % 1920 + 20 * math.sin(t + i), 1080 - u * 1080, 2.5, fp(cor, a * math.sin(u * math.pi)))

# ---------------------------------------------------------------- tipos de cena
def L(p, k, d=None):
    v = p.get(k, d); return v
def lista(v): return [x for x in (v or '').split(',') if x]
def T_close(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'escuro'), 12)
    quem = L(p, 'who', 'kai'); s = float(L(p, 's', 2.3)); pessoa(c, quem, 960, 1450, s, t, face=float(L(p, 'face', 0)), e=L(p, 'e'), arma=L(p, 'arma', '1') == '1', brilho=float(L(p, 'brilho', 0)), bob=2 * math.sin(t * 1.6))
    if L(p, 'txt'): poplabel(c, L(p, 'txt'), 960, 200, t, S.s0 + .3, fit(L(p, 'txt'), 110, 1500, INTER_K), L(p, 'cor', '#FFE14A'), font=INTER_K)
    particulas(c, t)
def T_grupo(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'vila')); quem = lista(L(p, 'who', 'kai')); n = len(quem); acao = L(p, 'acao', ''); es = lista(L(p, 'e', ''))
    esp = float(L(p, 'esp', 300)); s = float(L(p, 's', 1.0)); y = float(L(p, 'y', 1000)); x0 = 960 - esp * (n - 1) / 2
    u = K(t, S.s0, S.s1 - S.s0); dx = float(L(p, 'dx', 0)) * u
    for i, q in enumerate(quem):
        x = x0 + i * esp + dx; e = es[i] if i < len(es) else (es[0] if es else None); kw = {}
        if acao in ('rir',): e = 'riso'; kw['bob'] = 6 * abs(math.sin(t * 9 + i))
        if acao in ('andar', 'correr'):
            ph = (t - S.s0) * (13 if acao == 'correr' else 7) + i; kw['legs'] = walk_legs(ph, 70 if acao == 'correr' else 46, 30 if acao == 'correr' else 20); kw['bob'] = (8 if acao == 'correr' else 4) * abs(math.sin(ph))
        if acao == 'aplaudir': e = 'riso'; kw['arms'] = ('gesture', 'gesture'); kw['bob'] = 5 * abs(math.sin(t * 8 + i))
        if acao == 'medo': e = 'medo'; kw['tilt'] = 3 * math.sin(t * 30 + i)
        face = float(L(p, 'face', 0)) if L(p, 'face') else (.7 if dx > 0 else -.7 if dx < 0 else (.3 if x < 960 else -.3))
        pessoa(c, q, x, y + (40 if q.startswith('crianca') else 0), s * (.8 if q.startswith('crianca') else 1), t, face=face, e=e, brilho=float(L(p, 'brilho', 0)) if q == 'kai' else 0, **kw)
    if L(p, 'txt'): poplabel(c, L(p, 'txt'), 960, 200, t, S.s0 + .4, fit(L(p, 'txt'), 100, 1500, INTER_K), L(p, 'cor', '#FFE14A'), font=INTER_K)
    if acao == 'rir':
        for i in range(3): poplabel(c, "HAHA", 500 + i * 460, 260 + (i % 2) * 80, t, S.s0 + i * .15, 70, '#FFFFFF', font=INTER_K)
def T_mapa(c, t, S, p):
    rota = tuple(lista(L(p, 'rota'))) or None; ex_ = lista(L(p, 'exp', 'castelo,vila'))
    mundo.mapa(c, t, explorado=ex_, rota=rota, u=K(t, S.s0 + .2, max(.5, (S.s1 - S.s0) * .8)), fenda_aberta=L(p, 'fenda', '0') == '1',
               marcador=mundo.LUGARES[L(p, 'em')][:2] if L(p, 'em') else None)
def T_painel(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'escuro'), 12); tint(c, '#000000', .35); cor = L(p, 'cor', '#38D6FF'); ls = [x.replace('_', ' ') for x in lista(L(p, 'linhas', ''))]
    if L(p, 'obj', 'escudo') == 'escudo': escudo(c, 1560, 640, 1.3, brilho=.6, racha=L(p, 'racha', '1') == '1', rot=math.sin(t * 1.5) * 4)
    k = back(K(t, S.s0, .3), 1.1); h = 150 + 95 * len(ls); x0, y0 = 160, 540 - h / 2
    c.save(); c.translate(660, 540); c.scale(k, k); c.translate(-660, -540)
    rr = skia.RRect.MakeRectXY(skia.Rect(x0, y0, x0 + 1000, y0 + h), 26, 26); c.drawRRect(rr, fp('#06121C', 225)); c.drawRRect(rr, ink(5, cor)); c.drawRRect(rr, fp(cor, 70, blur=30) if False else ink(14, cor, 60))
    rect(c, x0, y0, x0 + 1000, y0 + 100, cor, 0, r=26); f = skia.Font(INTER_K, 58); tt = L(p, 'titulo', 'SISTEMA').replace('_', ' ')
    c.drawString(tt, x0 + 500 - f.measureText(tt) / 2, y0 + 72, f, fp('#06121C'))
    for i, l in enumerate(ls):
        if t < S.s0 + .25 + i * .3: continue
        sz = 70
        while skia.Font(INTER_K, sz).measureText(l) > 900 and sz > 30: sz -= 3
        fl = skia.Font(INTER_K, sz); col = '#FFE14A' if (i == 0 and L(p, 'amarelo')) else '#FFFFFF'
        c.drawString(l, x0 + 500 - fl.measureText(l) / 2, y0 + 190 + i * 95, fl, fp(col))
    c.restore()
def T_desafio(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'escuro'), 10); tint(c, '#000000', .45)
    k = back(K(t, S.s0, .35), 1.2); c.save(); c.translate(960, 480); c.scale(k, k); c.rotate(-2)
    rect(c, -560, -230, 560, 230, '#14121A', 8, r=30, v=(242, 193, 78)); c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-560, -230, 560, 230), 30, 30), fp('#F2C14E', 40))
    f = skia.Font(INTER_K, 64); s_ = f"DESAFIO {L(p, 'n', '1')}"; c.drawString(s_, -f.measureText(s_) / 2, -120, f, fp('#F2C14E'))
    tt = L(p, 'titulo', '').replace('_', ' '); sz = 92
    while skia.Font(INTER_K, sz).measureText(tt) > 1040 and sz > 40: sz -= 4
    f2 = skia.Font(INTER_K, sz); c.drawString(tt, -f2.measureText(tt) / 2, 10, f2, fp('#FFFFFF'))
    if L(p, 'sub'): f3 = skia.Font(INTER_B, 44); st = L(p, 'sub').replace('_', ' '); c.drawString(st, -f3.measureText(st) / 2, 120, f3, fp('#BFF4FF'))
    c.restore(); particulas(c, t, '#F2C14E', 30, 160)
def VW(): return 1000 if kit.SH > kit.SW else 1600
def quebra(tx, n=14):  # quebra frase longa em 2 linhas no vertical
    if kit.SH <= kit.SW or len(tx) <= n: return [tx]
    w = tx.split(' '); best = min(range(1, len(w)), key=lambda k: abs(len(' '.join(w[:k])) - len(' '.join(w[k:])))) if len(w) > 1 else 1
    return [' '.join(w[:best]), ' '.join(w[best:])]
def T_texto(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'escuro'), 10 if L(p, 'bg') else 0)
    linhas_ = sum([quebra(x) for x in lista(L(p, 'txt', '').replace('_', ' '))], []) or ['']
    for i, tx in enumerate(linhas_): poplabel(c, tx, 960, 460 + i * 150 - (len(linhas_) - 1) * 75, t, S.s0 + .1 + i * .35, fit(tx, 150, VW(), INTER_K), L(p, 'cor', '#FFE14A') if i == len(linhas_) - 1 else '#FFFFFF', font=INTER_K, stroke=16)
    particulas(c, t, '#FFE14A', 20, 140)
def T_objeto(c, t, S, p):
    fundo(c, t, L(p, 'bg', 'escuro'), 10 if L(p, 'bg', 'escuro') != 'escuro' else 0); o = L(p, 'obj', 'escudo'); b = float(L(p, 'brilho', .3)); rot = math.sin(t * 1.5) * 5
    if L(p, 'velocidade'): linhas_velocidade(c, 960, 540, t, .6, '#BFF4FF')
    if o == 'escudo': escudo(c, 960, 540, 2.6, rot=rot, brilho=b, racha=L(p, 'racha', '1') == '1')
    elif o == 'espada': espada(c, 960, 760, 2.2, rot)
    elif o == 'lanca': lanca(c, 960, 700, 1.4, rot)
    elif o == 'arco': arco(c, 1000, 520, 1.6, rot)
    elif o == 'coroa': coroa(c, 960, 640, 4.0)
    elif o == 'pergaminho_livro':
        add_light(c, 960, 560, 500, '#FFD27A', 120); k = K(t, S.s0, .5)
        rect(c, 560, 360, 960, 820, '#F2E2BF', LW, r=14); rect(c, 960, 360, 1360, 820, '#F2E2BF', LW, r=14); rect(c, 540, 820, 1380, 850, '#6B3A22', LW, r=8)
        for i in range(9):
            if K(t, S.s0 + .2 + i * .12, .2) > 0: line(c, 610, 420 + i * 42, 610 + 300 * K(t, S.s0 + .2 + i * .12, .2), 420 + i * 42, 6, '#9C7A55'); line(c, 1010, 420 + i * 42, 1010 + 300 * K(t, S.s0 + .6 + i * .12, .2), 420 + i * 42, 6, '#9C7A55')
        poly(c, [(1160, 700), (1200, 770), (1120, 770)], '#B23A48', 3)
    elif o == 'escudo_verdadeiro':
        linhas_velocidade(c, 960, 540, t, .5, '#FFE9A0'); add_light(c, 960, 540, 600, '#FFD27A', 200)
        escudo(c, 960, 540, 2.8, rot=rot, brilho=1, racha=False)
        for i in range(3):
            a = math.radians(-90 + i * 120 + t * 30); x, y = 960 + math.cos(a) * 420, 540 + math.sin(a) * 420
            add_light(c, x, y, 90, '#BFF4FF', 255); circ(c, x, y, 22, '#FFFFFF', 0)
        c.drawPath(skia.Path.Polygon([skia.Point(960 + math.cos(math.radians(-90 + i * 120 + t * 30)) * 420, 540 + math.sin(math.radians(-90 + i * 120 + t * 30)) * 420) for i in range(3)], True), ink(6, '#BFF4FF', 200))
    elif o == 'fenda': fenda(c, 960, 540, 1.8, t)
    elif o == 'moedas':
        n = int(L(p, 'n', 10))
        for i in range(n): x = 960 + (i % 10 - 4.5) * 90; y = 600 - (i // 10) * 60; circ(c, x, y, 36, '#F2C14E', 4); circ(c, x, y, 22, '#FFD86B', 2)
        poplabel(c, f"{n} MOEDAS", 960, 300, t, S.s0 + .3, 110, '#F2C14E', font=INTER_K)
    elif o == 'fogueira':
        for k in range(3): rect(c, 860 + k * 40, 700, 900 + k * 40, 740, '#6B4A32', 3, r=8)
        f = 1 + .12 * math.sin(t * 12); c.drawOval(skia.Rect(880, 700 - 150 * f, 1040, 720), fp('#FF8A2A')); c.drawOval(skia.Rect(920, 700 - 80 * f, 1000, 720), fp('#FFE08A')); add_light(c, 960, 640, 420, '#FF9A3D', 200)
    if L(p, 'txt'): poplabel(c, L(p, 'txt').replace('_', ' '), 960, 200, t, S.s0 + .3, fit(L(p, 'txt'), 100, 1400, INTER_K), L(p, 'cor', '#FFE14A'), font=INTER_K)
def T_reflexo(c, t, S, p):  # atacante bate no escudo do Kai e volta voando em dobro
    fundo(c, t, L(p, 'bg', 'floresta')); a = L(p, 'atk', 'lobo'); hit = S.s0 + float(L(p, 'hit', .5)); kx = 700
    pessoa(c, 'kai', kx, 1000, 1.05, t, face=.6, e='serio', brilho=K(t, hit, .08) * (1 - K(t, hit + .5, .4)))
    s_atk = {'lobo': 1.0, 'goblin': 1.0, 'igor': 1.0, 'chefe': 2.0, 'gigante': 2.0, 'guarda': 1.0}.get(a, 1.0)
    if t < hit:
        u = K(t, S.s0, hit - S.s0); x = lerp(1500, kx + 280, ease(u)); pessoa(c, a, x, 1000 - (160 * math.sin(math.pi * u) if a == 'lobo' else 0), s_atk, t, face=-.7, e='raiva', arms=('gesture', 'gesture') if a not in ('chefe', 'gigante') else ('down', 'push'))
    else:
        u = K(t, hit, 1.2); c.save(); c.translate(lerp(kx + 280, 2500, ease_out(u)), 1000 - 600 * math.sin(math.pi * u * .8)); c.rotate(420 * u); pessoa(c, a, 0, 0, s_atk, t, e='choque'); c.restore()
        linhas_velocidade(c, kx + 300, 600, t, .5 * (1 - u)); poplabel(c, "x2", kx + 380, 300, t, hit + .1, 140, '#38D6FF', font=INTER_K)
    impacto(c, (t - hit) / .07); faiscas(c, kx + 160, 700, t, hit, 26, '#BFF4FF')
def T_cerco(c, t, S, p):  # vários inimigos em volta do Kai, à noite
    fundo(c, t, L(p, 'bg', 'floresta_noite')); a = L(p, 'atk', 'lobo'); n = int(L(p, 'n', 5))
    mundo_fog = 0
    for i in range(n):
        ang = math.pi * (i / max(1, n - 1)); x = 960 + math.cos(ang) * 700; y = 1000 + 30 * math.sin(i)
        pessoa(c, a, x, y, .9, t, face=-.6 if x > 960 else .6, e='raiva', bob=3 * math.sin(t * 6 + i))
        for sx in (-1, 1): add_light(c, x + sx * 24, y - 380, 26, '#FFE14A', 200)
    pessoa(c, 'kai', 960, 1000, 1.05, t, face=0, e=L(p, 'e', 'medo'), brilho=float(L(p, 'brilho', 0)))
    if L(p, 'barreira') == '1': barreira(c, 960, 1040, 520, t)
def T_fato(c, t, S, p):
    k = L(p, 'k', 'escudo1200')
    if k == 'escudo1200':
        pergaminho(c, S, t); escudo(c, 960, 500, 1.6, racha=False); poplabel(c, "~1200", 960, 860, t, S.s0 + .6, 90, '#7A3B1A', font=INTER_K, stroke=0)
    elif k == 'escorrega':
        pergaminho(c, S, t); escudo(c, 960, 540, 1.5, racha=False); u = K(t, S.s0 + .2, .9)
        ex_, ey = (lerp(760, 960, u * 2), lerp(240, 400, u * 2)) if u < .5 else (lerp(960, 1160, (u - .5) * 2), lerp(400, 820, (u - .5) * 2)); espada(c, ex_, ey, .7, 140)
    elif k == 'trovao':
        fundo(c, t, 'raiox'); u = t - S.s0; raio(c, 560, t, S.s0 + .2)
        n = min(3, int(max(0, u - .4) / .6));
        for i in range(n): poplabel(c, str(i + 1), 860 + i * 200, 420, t, S.s0 + .4 + (i + 1) * .6, 160, '#BFF4FF', font=INTER_K, stroke=14)
        if u > 2.4: poplabel(c, "3 s = 1 KM", 1060, 720, t, S.s0 + 2.4, 140, '#FFE14A', font=INTER_K, stroke=14)
    elif k == 'triangulo':
        fundo(c, t, 'raiox'); u = .5 + .5 * math.sin((t - S.s0) * 2.2); d = 90 * u
        q = [(420 + d, 340), (820 + d, 340), (820 - d, 740), (420 - d, 740)]; c.drawPath(skia.Path.Polygon([skia.Point(*a) for a in q], True), ink(14, '#FF7A7A'))
        tri = [(1340, 330), (1560, 740), (1120, 740)]; c.drawPath(skia.Path.Polygon([skia.Point(*a) for a in tri], True), ink(14, '#7FE7FF'))
        for (x, y) in q + tri: circ(c, x, y, 16, '#FFFFFF', 0)
        line(c, 260 + d, 540, 380 + d, 540, 10, '#FFE14A'); poly(c, [(390 + d, 520), (420 + d, 540), (390 + d, 560)], '#FFE14A', 0)
        line(c, 960, 540, 1080, 540, 10, '#FFE14A'); poly(c, [(1090, 520), (1120, 540), (1090, 560)], '#FFE14A', 0)
        poplabel(c, "DOBRA", 620, 880, t, S.s0 + .3, 90, '#FF7A7A', font=INTER_K); poplabel(c, "NÃO DOBRA", 1340, 880, t, S.s0 + .6, 90, '#7FE7FF', font=INTER_K)
    elif k == 'matilha':
        pergaminho(c, S, t)
        for i in range(5): ang = i * 1.2566 + t * .3; x = 960 + math.cos(ang) * 200; y = 540 + math.sin(ang) * 120; circ(c, x, y, 26, '#5A6070', 4)
        circ(c, 960, 540, 30, '#B23A48', 4); poplabel(c, "CERCO", 960, 860, t, S.s0 + .5, 90, '#7A3B1A', font=INTER_K, stroke=0)
    elif k == 'angulo':
        pergaminho(c, S, t); escudo(c, 960, 540, 1.3, rot=-25, racha=False); u = (t - S.s0) % 1.6 / 1.6
        if u < .5: line(c, 600, 540, lerp(600, 900, u * 2), 540, 12, '#B23A48')
        else: line(c, 900, 540, lerp(900, 700, (u - .5) * 2), lerp(540, 260, (u - .5) * 2), 12, '#38A0FF')
        poplabel(c, "ÂNGULO", 960, 860, t, S.s0 + .4, 90, '#7A3B1A', font=INTER_K, stroke=0)
    elif k == 'cristal':
        fundo(c, t, 'raiox')
        for i in range(6):
            for j in range(4): x = 700 + i * 100 + (j % 2) * 50; y = 360 + j * 90; poly(c, [(x, y - 40), (x + 35, y), (x, y + 40), (x - 35, y)], '#8FE8FF', 3)
        poplabel(c, "LUZ PRESA", 960, 860, t, S.s0 + .5, 90, '#FFE14A', font=INTER_K)
    elif k == 'tempera':
        fundo(c, t, 'raiox'); u = ((t - S.s0) % 3) / 3; cor = '#FF4A1A' if u < .5 else '#9AA3B5'
        rect(c, 660, 470, 1260, 560, cor, LW, r=10)
        if u < .5: add_light(c, 960, 515, 360, '#FF6A1A', 200)
        else: vapor(c, 960, 460, t, 1 - (u - .5) * 2)
        rect(c, 600, 620, 1320, 820, '#14354E', 6, r=20); poplabel(c, "900°C → ÁGUA", 960, 900, t, S.s0 + .4, 90, '#FFE14A', font=INTER_K)
    elif k == 'reacao':
        fundo(c, t, 'raiox'); poplabel(c, "0,2 s", 960, 540, t, S.s0 + .3, 200, '#FFE14A', font=INTER_K, stroke=16)
    else:
        fundo(c, t, 'raiox'); tx = L(p, 'txt', '').replace('_', ' '); partes = sum([quebra(x.strip(), 16) for x in (tx.split(':') if ':' in tx else [tx])], [])
        for g in range(8): line(c, 0, 135 * g, 1920, 135 * g, 1, '#2A6A80'); line(c, 240 * g, 0, 240 * g, 1080, 1, '#2A6A80')
        for i, q in enumerate(partes): poplabel(c, q, 960, 420 + i * 190 - (len(partes) - 1) * 40, t, S.s0 + .2 + i * .4, fit(q, 140 if i else 100, VW(), INTER_K), '#FFE14A' if i == len(partes) - 1 else '#BFF4FF', font=INTER_K, stroke=14)
def T_cena(c, t, S, p):  # cenas especiais
    k = L(p, 'k')
    if k == 'invocacao':
        fundo(c, t, 'quarto'); u = K(t, S.s0 + .4, .8); rect(c, 1240, 620, 1500, 780, '#14121A', LW, r=10); rect(c, 1260, 640, 1480, 760, '#2B6CFF', 0, r=6)
        pessoa(c, 'kai0', 1100, 1000, 1.0, t, face=.7, e='choque' if u > .3 else 'neutro', arms=('hold', 'hold')); circulo_magico(c, 1100, 1000, 420, t, u)
    elif k == 'altar':
        fundo(c, t, 'salao'); b = L(p, 'brilho'); pos = [(660, 'espada'), (860, 'lanca'), (1060, 'arco'), (1260, 'escudo')]
        rect(c, 560, 800, 1360, 880, '#9AA3B5', LW, r=10); rect(c, 600, 880, 1320, 1020, '#7D8597', LW, r=6)
        for i, (x, a_) in enumerate(pos):
            if b is not None and int(b) == i: add_light(c, x, 600, 260, '#FFF2C8', 200); c.drawPath(cone_path(x, -300, 40, 220, 1120, 0), fp('#FFF2C8', 50, blur=20))
            if a_ == 'espada': espada(c, x, 780, .9, 0)
            if a_ == 'lanca': lanca(c, x, 720, .7, 0)
            if a_ == 'arco': arco(c, x, 620, .7)
            if a_ == 'escudo': escudo(c, x, 660, .8, racha=False)
        if L(p, 'who'): q = L(p, 'who'); x = dict(igor=660, teo=860, lia=1060, kai=1260)[q]; pessoa(c, q, x, 1040, .85, t, face=0, e=L(p, 'e', 'feliz'), arma=False)
    elif k == 'alvo':
        fundo(c, t, 'vila'); q = L(p, 'who', 'lia'); hit = S.s0 + .8
        for r_, col in ((110, '#FFFFFF'), (80, '#E63946'), (50, '#FFFFFF'), (22, '#E63946')): circ(c, 1500, 600, r_, col, 4)
        rect(c, 1490, 710, 1510, 1000, '#6B4A32', 3); pessoa(c, q, 600, 1000, 1.0, t, face=.6, e='confiante')
        acerto = L(p, 'acerto', '1') == '1'
        if t > hit: tx, ty = (1500, 600) if acerto else (1700, 300); u = K(t, hit, .3); line(c, lerp(760, tx, u) - 60, lerp(560, ty, u), lerp(760, tx, u), lerp(560, ty, u), 8, '#8B5A2B')
        if t > hit + .3: poplabel(c, "ACERTOU!" if acerto else "ERROU!", 960, 260, t, hit + .3, 110, '#3DDC84' if acerto else '#FF5F5F', font=INTER_K)
    elif k == 'pedra':
        fundo(c, t, 'vila'); q = L(p, 'who', 'igor'); ok = L(p, 'ok', '1') == '1'; u = K(t, S.s0 + .5, .8) if ok else .08 * abs(math.sin(t * 10))
        pessoa(c, q, 960, 1000, 1.05, t, face=0, e='raiva' if not ok else 'confiante', arms=('hat', 'hat'), sweat=1 if not ok else -1, arma=False)
        oval(c, 760, 1000 - 380 - 400 * u - 150, 1160, 1000 - 380 - 400 * u + 90, '#8D8A96', LW)
    elif k == 'fogueira':
        fundo(c, t, 'floresta_noite'); f = 1 + .12 * math.sin(t * 12)
        for i in range(3): rect(c, 880 + i * 40, 980, 920 + i * 40, 1010, '#6B4A32', 3, r=8)
        c.drawOval(skia.Rect(900, 980 - 110 * f, 1040, 1000), fp('#FF8A2A')); add_light(c, 960, 920, 520, '#FF9A3D', 200)
        pessoa(c, 'kai', 700, 1000, 1.0, t, face=.5, e=L(p, 'e', 'cansado'))
        if L(p, 'olhos') == '1':
            for i in range(4): x = 1300 + i * 140; add_light(c, x, 700 + (i % 2) * 60, 26, '#FFE14A', 230); add_light(c, x + 50, 700 + (i % 2) * 60, 26, '#FFE14A', 230)
    elif k == 'moedas':
        fundo(c, t, 'salao', 8)
        for j, (n, x, nome) in enumerate(((100, 560, 'IGOR'), (100, 960, 'TÉO'), (10, 1360, 'KAI'))):
            for i in range(min(n, 30) if n > 10 else n): circ(c, x + (i % 5 - 2) * 46, 760 - (i // 5) * 30, 22, '#F2C14E', 3)
            label(c, f"{nome}: {n}", x, 900, 54, '#FFFFFF', font=INTER_K, align='center', skew=0, stroke=8)
    elif k == 'olhos_moita':
        fundo(c, t, L(p, 'bg', 'floresta'))
        for i, q in enumerate(('igor', 'teo', 'lia')): pessoa(c, q, 700 + i * 260, 1000, .9, t, face=-.5, e=L(p, 'e', 'surpreso'))
        for i in range(6): c.drawCircle(560 + i * 170, 800, 140, fp('#3D8F44')); c.drawCircle(560 + i * 170, 800, 140, ink(4))
    elif k == 'roubo':
        fundo(c, t, 'floresta'); u = K(t, S.s0, S.s1 - S.s0); ph = (t - S.s0) * 14
        pessoa(c, 'goblin', lerp(900, 1800, u), 1000, .9, t, face=.8, e='riso', legs=walk_legs(ph, 70, 30), bob=8 * abs(math.sin(ph)))
        circ(c, lerp(900, 1800, u) + 80, 720, 40, '#B08A3A', 4); pessoa(c, 'kai', lerp(400, 1100, u), 1000, 1.0, t, face=.8, e='raiva', legs=walk_legs(ph + 2, 70, 30), bob=8 * abs(math.sin(ph + 2)))
    elif k == 'nivel':
        fundo(c, t, 'escuro'); linhas_velocidade(c, 960, 540, t, .5, '#7FE7FF'); n0, n1 = int(L(p, 'de', 1)), int(L(p, 'para', 2)); u = K(t, S.s0 + .3, max(.4, (S.s1 - S.s0) * .6))
        poplabel(c, f"NÍVEL {int(lerp(n0, n1, u))}", 960, 480, t, S.s0, 170, '#FFE14A', font=INTER_K, stroke=18); pessoa(c, 'kai', 960, 1300, 1.0, t, face=0, e='confiante', brilho=1)
    elif k == 'cristal_mapa':
        fundo(c, t, 'caverna'); pessoa(c, 'kai', 760, 1000, 1.0, t, face=.6, e='surpreso')
        x, y = 1200, 620; poly(c, [(x, y - 120), (x + 70, y), (x, y + 120), (x - 70, y)], '#8FE8FF', LW); add_light(c, x, y, 320, '#38D6FF', 200)
    elif k == 'forja_nina':
        fundo(c, t, 'forja'); hit = (t * 1.6) % 1
        pessoa(c, 'nina', 1000, 1000, 1.05, t, face=-.4, e='raiva', arma=False, arms=('hat', 'gesture'))
        martelo(c, 880, 640 - 120 * (1 - abs(1 - 2 * hit)), 1.0, -40 + 80 * abs(1 - 2 * hit)); rect(c, 700, 760, 900, 800, '#FF6A1A', 3, r=6); add_light(c, 800, 770, 200, '#FF8A2A', 200)
        if hit < .12: faiscas(c, 800, 760, t, t - hit / 1.6, 14, '#FFD27A')
    elif k == 'martelada':
        fundo(c, t, 'forja'); n = int(L(p, 'n', 1)); hit = S.s0 + .5; u = K(t, hit - .35, .35)
        pessoa(c, 'kai', 760 - 40 * K(t, hit, .2), 1000, 1.05, t, face=.6, e='cansado' if n > 4 else 'serio')
        pessoa(c, 'nina', 1240, 1000, 1.05, t, face=-.6, e='raiva', arma=False, arms=('hat', 'hat'))
        martelo(c, 1060 - 60 * u, 600 + 120 * u, 1.3, -60 + 110 * u)
        impacto(c, (t - hit) / .07); faiscas(c, 960, 700, t, hit, 22, '#FFD27A')
        poplabel(c, f"{n}/10", 960, 220, t, hit, 140, '#FFE14A', font=INTER_K, stroke=16)
    elif k == 'tempera':
        fundo(c, t, 'forja'); hit = S.s0 + .6
        rect(c, 760, 820, 1160, 1000, '#5A4636', LW, r=14); rect(c, 780, 830, 1140, 880, '#3A7BD5', 0, r=8)
        y = lerp(560, 840, K(t, S.s0, .6)); escudo(c, 960, y, .9, racha=False, brilho=1 - K(t, hit, .8))
        if t < hit: add_light(c, 960, y, 240, '#FF6A1A', 230)
        else: vapor(c, 960, 800, t, 1 - K(t, hit + 1.5, 1.0))
        pessoa(c, 'nina', 1400, 1000, 1.0, t, face=-.6, e='serio', arma=False)
    elif k == 'tempestade':
        fundo(c, t, L(p, 'bg', 'tempestade')); hit = S.s0 + float(L(p, 'hit', .6))
        for i in range(60): u = (t * 1.4 + i / 60) % 1; x = (i * 97) % 1920; line(c, x, u * 1080 - 40, x - 12, u * 1080, 2, '#9FB4D8')
        pessoa(c, 'kai', 960, 1000, 1.05, t, face=0, e=L(p, 'e', 'serio'), brilho=K(t, hit, .1) * (1 - K(t, hit + .6, .5)), arms=('hold', 'hat'))
        if L(p, 'raio', '1') == '1': raio(c, 900, t, hit)
        if L(p, 'atk'): u = K(t, hit + .1, .9); pessoa(c, L(p, 'atk'), lerp(1500, 2400, u), 1000, 1.6, t, face=-.6, e='choque' if t > hit else 'raiva')
        if L(p, 'txt'): poplabel(c, L(p, 'txt').replace('_', ' '), 960, 200, t, S.s0 + .3, 110, '#FFE14A', font=INTER_K)
    elif k == 'voz':
        fundo(c, t, 'fenda'); tint(c, '#000000', .3); pessoa(c, 'kai', 960, 1000, 1.05, t, face=0, e='surpreso', brilho=.8 + .2 * math.sin(t * 4))
        poplabel(c, L(p, 'txt', 'ESCUDO...').replace('_', ' '), 960, 220, t, S.s0 + .3, 120, '#C77DFF', font=INTER_K)
    elif k == 'fenda_profecia':
        mundo.mapa(c, t, explorado=('castelo', 'vila'), fenda_aberta=True); tint(c, '#2A1040', .2 * (1 + math.sin(t * 3)))
        poplabel(c, L(p, 'txt', '30 DIAS').replace('_', ' '), 960, 780, t, S.s0 + .3, 110, '#C77DFF', font=INTER_K)

def _caixa(c, x0, y0, x1, y1, txt, cor, borda, sz=64, tcor='#FFFFFF'):
    rr = skia.RRect.MakeRectXY(skia.Rect(x0, y0, x1, y1), 24, 24); c.drawRRect(rr, fp(cor)); c.drawRRect(rr, ink(7, borda))
    while skia.Font(INTER_K, sz).measureText(txt) > (x1 - x0) - 60 and sz > 28: sz -= 3
    f = skia.Font(INTER_K, sz); c.drawString(txt, (x0 + x1) / 2 - f.measureText(txt) / 2, (y0 + y1) / 2 + sz * .36, f, fp(tcor))
def T_quiz(c, t, S, p):  # pergunta pro público: opções A/B/C + contagem regressiva; certa= destaca a resposta
    fundo(c, t, L(p, 'bg', 'escuro'), 14); tint(c, '#000000', .5)
    q = L(p, 'q', '').replace('_', ' '); ops = [L(p, k).replace('_', ' ') for k in ('a', 'b', 'c') if L(p, k)]; certa = L(p, 'certa')
    k = back(K(t, S.s0, .3), 1.1); c.save(); c.translate(960, 540); c.scale(k, k); c.translate(-960, -540)
    _caixa(c, 160, 70, 1760, 230, q, '#F2C14E', '#14121A', 76, '#14121A')
    n = len(ops); w = (1600 - 40 * (n - 1)) / max(1, n)
    for i, o in enumerate(ops):
        x0 = 160 + i * (w + 40); letra = 'ABC'[i]; ok = certa == letra
        if t < S.s0 + .25 + i * .2: continue
        cor = '#1F8A4C' if (certa and ok) else ('#2A2633' if certa else '#1C2F4A'); borda = '#3DDC84' if (certa and ok) else '#38D6FF'
        if certa and not ok: c.saveLayer(None, fp('#FFFFFF', 110))
        _caixa(c, x0, 330, x0 + w, 650, '', cor, borda); circ(c, x0 + 70, 400, 44, borda, 4)
        f = skia.Font(INTER_K, 54); c.drawString(letra, x0 + 70 - f.measureText(letra) / 2, 420, f, fp('#14121A'))
        sz = 60
        while skia.Font(INTER_K, sz).measureText(o) > w - 60 and sz > 26: sz -= 3
        f2 = skia.Font(INTER_K, sz); c.drawString(o, x0 + w / 2 - f2.measureText(o) / 2, 540, f2, fp('#FFFFFF'))
        if certa and not ok: c.restore()
        if certa and ok: poplabel(c, "✓", x0 + w - 70, 400, t, S.s0 + .3, 90, '#3DDC84', font=INTER_K)
    c.restore()
    if not certa:  # contagem regressiva
        dur = max(1.5, S.s1 - S.s0 - .3); u = min(1, (t - S.s0) / dur); n_ = max(1, 3 - int(u * 3))
        c.drawCircle(960, 820, 90, fp('#14121A', 220)); pth = skia.Path(); pth.addArc(skia.Rect(870, 730, 1050, 910), -90, 360 * (1 - u)); c.drawPath(pth, ink(14, '#F2C14E'))
        f = skia.Font(INTER_K, 100); c.drawString(str(n_), 960 - f.measureText(str(n_)) / 2, 856, f, fp('#FFFFFF'))
        poplabel(c, L(p, 'rodape', 'RESPONDE NOS COMENTÁRIOS').replace('_', ' '), 960, 990 if False else 690, t, S.s0 + .6, 48, '#BFF4FF', font=INTER_K) if False else None
def T_comenta(c, t, S, p):  # chamada pro público: balão de comentário + palavra
    fundo(c, t, L(p, 'bg', 'escuro'), 14); tint(c, '#000000', .45); k = back(K(t, S.s0, .3), 1.2)
    c.save(); c.translate(960, 470); c.scale(k, k); c.rotate(-2)
    rr = skia.RRect.MakeRectXY(skia.Rect(-640, -190, 640, 190), 60, 60); c.drawRRect(rr, fp('#FFFFFF')); c.drawRRect(rr, ink(8, '#14121A'))
    poly(c, [(-360, 185), (-420, 300), (-250, 185)], '#FFFFFF', 8)
    f = skia.Font(INTER_B, 52); top = L(p, 'top', 'COMENTA AÍ').replace('_', ' '); c.drawString(top, -f.measureText(top) / 2, -80, f, fp('#6A6A7A'))
    w_ = L(p, 'txt', '').replace('_', ' '); sz = 130
    while skia.Font(INTER_K, sz).measureText(w_) > 1180 and sz > 40: sz -= 4
    f2 = skia.Font(INTER_K, sz); c.drawString(w_, -f2.measureText(w_) / 2, 80, f2, fp('#E63946'))
    c.restore()
    for i in range(6): u = ((t - S.s0) * .7 + i / 6) % 1; x = 300 + i * 260; c.drawCircle(x, 1000 - u * 300, 26, fp('#E63946', 200 * (1 - u)))
def T_detalhe(c, t, S, p):  # "repara nesse detalhe": círculo pulsando sobre o cenário
    fundo(c, t, L(p, 'bg', 'vila')); x, y = float(L(p, 'x', 960)), float(L(p, 'y', 540)); r = float(L(p, 'r', 140))
    if L(p, 'who'): pessoa(c, L(p, 'who'), float(L(p, 'wx', x)), float(L(p, 'wy', 1000)), float(L(p, 's', 1.0)), t, face=float(L(p, 'face', 0)), e=L(p, 'e'))
    tint(c, '#000000', .35); pr = r * (1 + .08 * math.sin(t * 8)); c.drawCircle(x, y, pr, ink(12, '#FFE14A')); c.drawCircle(x, y, pr + 22, ink(4, '#FFE14A', 140))
    poplabel(c, L(p, 'txt', 'REPARA NISSO').replace('_', ' '), 960, 140, t, S.s0 + .2, 90, '#FFE14A', font=INTER_K, stroke=14)

TIPOS = dict(quiz=T_quiz, comenta=T_comenta, detalhe=T_detalhe, close=T_close, grupo=T_grupo, mapa=T_mapa, painel=T_painel, desafio=T_desafio, texto=T_texto, objeto=T_objeto, reflexo=T_reflexo, cerco=T_cerco, fato=T_fato, cena=T_cena)
SFX = dict(quiz=[('notif', 0.05, .7), ('pop', 0.3, .4), ('pop', 0.5, .4)], comenta=[('pop', 0.1, .6)], detalhe=[('brilho', 0.15, .5)], desafio=[('boom', 0.05, .6), ('brilho', 0.2, .5)], painel=[('notif', 0.1, .7)], reflexo=[('whoosh', 0.1, .6), ('thud', 'HIT', 1.0)], mapa=[('paper', 0.05, .4)],
           texto=[('pop', 0.1, .5)], cerco=[('steps', 0.1, .5)], fato=[('paper', 0.05, .4)])

def ler_roteiro(arq):
    linhas = []
    for raw in open(arq, encoding='utf8').read().strip().split('\n'):
        raw = raw.strip()
        if not raw or raw.startswith('#'): continue
        tipo, params, texto = raw.split('|', 2)
        p = dict(kv.split('=', 1) for kv in params.split(';') if kv.strip())
        linhas.append((tipo.strip(), p, texto.strip()))
    return linhas
def foco(tipo, p):
    if tipo == 'grupo':
        n = len(lista(p.get('who', 'kai'))); return dict(focus=(960, 560), zoom=(1.0, 1.06) if n > 1 else (1.12, 1.2))
    if tipo == 'close': return dict(focus=(960, 520), zoom=(1.0, 1.07))
    if tipo == 'mapa': return dict(focus=(960, 520), zoom=(1.0, 1.1))
    if tipo in ('reflexo', 'cerco'): return dict(focus=(960, 600), zoom=(1.05, 1.0))
    return dict(focus=(960, 540), zoom=(1.0, 1.06))
def foco_v(tipo, p):  # versão vertical (9:16): o quadro vê ~600 px de largura do mundo no zoom 1
    if p.get('fv'): x, y, z = [float(v) for v in p['fv'].split(',')]; return dict(focus_v=(x, y), zoom_v=(z, z * 1.05))
    if tipo == 'grupo':
        n = len(lista(p.get('who', 'kai'))); w = float(p.get('esp', 300)) * (n - 1) + 420 * float(p.get('s', 1.0)); z = max(.45, min(1.15, 640 / w))
        dx = float(p.get('dx', 0))
        return dict(focus_v=((960, 760), (960 + dx, 760)) if dx else (960, 760), zoom_v=(z, z * 1.06))
    if tipo == 'close': return dict(focus_v=(960, 600), zoom_v=(.95, 1.02))
    if tipo == 'mapa': return dict(focus_v=(960, 540), zoom_v=(.36, .38))
    if tipo in ('reflexo', 'cerco'): return dict(focus_v=(960, 720), zoom_v=(.55, .52))
    if tipo in ('quiz',): return dict(focus_v=(960, 540), zoom_v=(.38, .4))
    if tipo in ('desafio', 'comenta', 'painel'): return dict(focus_v=(960, 520), zoom_v=(.52, .55))
    if tipo in ('texto', 'fato', 'objeto'): return dict(focus_v=(960, 540), zoom_v=(.55, .58))
    if tipo == 'cena': return dict(focus_v=(960, 640), zoom_v=(.6, .64))
    if tipo == 'detalhe': return dict(focus_v=(float(p.get('x', 960)), float(p.get('y', 540))), zoom_v=(.7, .75))
    return dict(focus_v=(960, 560), zoom_v=(.6, .64))
def montar(arq):
    seq = []
    for i, (tipo, p, texto) in enumerate(ler_roteiro(arq)):
        fid = f'f{i:03d}'; fn = TIPOS[tipo]
        def draw(c, t, S, _fn=fn): _fn(c, t, S, S.d['p'])
        draw.__name__ = f'cena_{tipo}'
        d = dict(draw=draw, falas=[fid], p=p, **foco(tipo, p), **foco_v(tipo, p))
        if p.get('topo'): d['topo'] = p['topo'].replace('_', ' ')
        sfx = []
        for (nm, when, g) in SFX.get(tipo, []): sfx.append((nm, f"{fid}+{p.get('hit', .5)}" if when == 'HIT' else when, g))
        if tipo == 'reflexo': d['shake'] = [f"{fid}+{p.get('hit', .5)}"]
        if p.get('sfx'): sfx.append((p['sfx'], 0.1, .7))
        if p.get('shake') == '1': d['shake'] = [0.3]
        if sfx: d['sfx'] = sfx
        seq.append(d)
    seq[-1]['hold'] = 1.5
    return seq
def falas_txt(arq, out):
    with open(out, 'w', encoding='utf8') as f:
        for i, (tipo, p, texto) in enumerate(ler_roteiro(arq)): f.write(f'f{i:03d}|narrador|{texto}\n')
kit.DESTAQUES = ['ESCUDO', 'KAI', 'FENDA', 'REFLEXO', 'IGOR', 'LOBOS', 'LOBO', 'DESAFIO', 'BARREIRA', 'DOBRO', 'MAPA', 'FRAGMENTO', 'NINA', 'LIA', 'TÉO', 'REI', 'ESPADA', 'GOBLIN', 'NÍVEL', 'MOEDAS', 'CRISTAL', 'SOMBRAS', 'GIGANTE', 'RAIO', 'TROVÃO', 'DIAS', 'VOLTOU', 'SOZINHO', 'CURTE']
