import math, random, os
import numpy as np, skia, soundfile as sf

W, H, FPS = 1920, 1080, 30   # W, H = tamanho do MUNDO (cenários sempre desenhados em 1920x1080)
FORMATOS = {'16:9': (1920, 1080), '9:16': (1080, 1920), '1:1': (1080, 1080), '4:5': (1080, 1350)}
SW, SH = W, H                # tamanho da TELA de saída (muda com o formato)
ESCALA = 1.0                 # 1.0 = 1080p; 2/3 = modo rápido (720p). Tudo é desenhado em coordenadas de 1080p e reduzido.
def set_formato(f):
    global SW, SH
    SW, SH = FORMATOS[f]; return SW, SH
def vertical(): return SH > SW

# ---------------- estilos visuais (escolhidos pela folha de estilos; "estilo" no roteiro.json)
ESTILOS = {
    'noturno':  dict(nome='Noturno (padrão)', lw=1.0, ink='#18161B', cabeca=1.0, olhos='ponto', sombra=True, luz='noite', sat=0.94, contraste=0.97, lift=0.012, textura=None),
    'dia':      dict(nome='Dia colorido', lw=1.0, ink='#18161B', cabeca=1.0, olhos='ponto', sombra=True, luz='dia', sat=1.2, contraste=0.92, lift=0.10, textura=None),
    'fofo':     dict(nome='Fofo (cabeção)', lw=1.15, ink='#2A1E2E', cabeca=1.32, olhos='grande', sombra=True, luz='noite', sat=1.05, contraste=0.98, lift=0.02, textura=None),
    'caderno':  dict(nome='Caderno (rabisco)', lw=0.6, ink='#2B2B33', cabeca=1.0, olhos='ponto', sombra=False, luz='dia', sat=0.22, contraste=0.78, lift=0.24, textura='papel'),
    'gibi':     dict(nome='Gibi (retícula)', lw=1.6, ink='#101014', cabeca=1.08, olhos='ponto', sombra=True, luz='noite', sat=1.28, contraste=1.06, lift=0.0, textura='reticula'),
    'minimal':  dict(nome='Minimalista', lw=0.75, ink='#3A3A44', cabeca=1.0, olhos='ponto', sombra=False, luz='dia', sat=0.7, contraste=0.74, lift=0.22, textura=None),
    'palito':   dict(nome='Boneco palito', lw=1.0, ink='#1C1C22', cabeca=1.1, olhos='ponto', sombra=False, luz='dia', sat=0.9, contraste=0.8, lift=0.18, textura='papel', corpo='palito'),
}
ST = dict(ESTILOS['noturno'])
def set_estilo(nome):
    global GRADE_CF
    ST.clear(); ST.update(ESTILOS[nome]); GRADE_CF = skia.ColorFilters.Matrix(_sat(ST['sat'], ST['contraste'], ST['lift']))
FD = os.path.expanduser(os.environ.get("VID_FONTS", "~/vid/fonts/"))
FONT_HAND = skia.Typeface.MakeFromFile(FD + "CaveatBrush-Regular.ttf")
KALAM = skia.Typeface.MakeFromFile(FD + "Kalam-Bold.ttf")
MARKER = skia.Typeface.MakeFromFile(FD + "PermanentMarker-Regular.ttf")
INK = (24, 22, 27); LW = 6.0
GOLD = '#F2C14E'; RED = '#C8242C'; LIME = '#B8F04A'; CREAM = '#FFF6DC'

def C(rgb, a=255): return skia.Color(int(rgb[0]), int(rgb[1]), int(rgb[2]), int(a))
def hx(h, a=255):
    h = h.lstrip('#'); return C((int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)), a)
def col(v, a=255): return hx(v, a) if isinstance(v, str) else C(v, a)
def radial(cx, cy, r, colors, pos=None): return skia.GradientShader.MakeRadial(center=(cx, cy), radius=r, colors=colors, positions=pos)
def linear(x0, y0, x1, y1, colors, pos=None): return skia.GradientShader.MakeLinear(points=[(x0, y0), (x1, y1)], colors=colors, positions=pos)
def ease(u): u = min(max(u, 0), 1); return 0.5 - 0.5 * math.cos(math.pi * u)
def ease_out(u): u = min(max(u, 0), 1); return 1 - (1 - u) ** 3
def pop(u):  # 0 -> 1.15 -> 1
    if u <= 0: return 0.0
    if u >= 1: return 1.0
    return 1.15 * ease_out(u / 0.6) if u < 0.6 else 1.15 - 0.15 * ease((u - 0.6) / 0.4)
def back(u, k=1.9):  # snappy overshoot for pose changes
    u = min(max(u, 0.0), 1.0) - 1; return 1 + (k + 1) * u ** 3 + k * u ** 2
def lerp(a, b, k): return a + (b - a) * k
def K(t, t0, d): return min(max((t - t0) / d, 0.0), 1.0)
def blink(t, period=2.7, phase=0.0): return ((t + phase) % period) < 0.1

def mouth_track(wav, hold=3):  # per-frame 'open'/'mid'/'closed' from loudness, held 3 frames
    s, sr = sf.read(wav); s = s.mean(1) if s.ndim > 1 else s
    hop = sr // FPS; n = len(s) // hop + 1
    rms = np.array([np.sqrt(np.mean(s[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    m = rms.max(); out = []; cur = 'closed'; held = hold
    for v in rms:
        tgt = 'open' if v > .45 * m else 'mid' if v > .14 * m else 'closed'
        if tgt != cur and held >= hold: cur = tgt; held = 0
        held += 1; out.append(cur)
    out[-1] = 'closed'; return out

def fp(v, a=255, blur=0, blend=None):
    p = skia.Paint(AntiAlias=True, Color=col(v, a))
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if blend: p.setBlendMode(blend)
    return p
def sp(shader, blend=None, blur=0):
    p = skia.Paint(AntiAlias=True); p.setShader(shader)
    if blend: p.setBlendMode(blend)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    return p
def ink(w=LW, v=INK, a=255):  # traço: largura e cor do contorno seguem o estilo
    if v == INK: v = ST['ink']
    p = skia.Paint(AntiAlias=True, Color=col(v, a)); p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(w * ST['lw'])
    p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join); return p
def shape(c, path, fill, w=LW, v=INK):
    c.drawPath(path, fill if isinstance(fill, skia.Paint) else fp(fill))
    if w: c.drawPath(path, ink(w, v))
def rect(c, x0, y0, x1, y1, fill, w=LW, r=0, v=INK):
    p = skia.Path()
    if r: p.addRRect(skia.RRect.MakeRectXY(skia.Rect(x0, y0, x1, y1), r, r))
    else: p.addRect(skia.Rect(x0, y0, x1, y1))
    shape(c, p, fill, w, v); return p
def circ(c, x, y, r, fill, w=LW, v=INK): p = skia.Path(); p.addCircle(x, y, r); shape(c, p, fill, w, v); return p
def oval(c, x0, y0, x1, y1, fill, w=LW, v=INK): p = skia.Path(); p.addOval(skia.Rect(x0, y0, x1, y1)); shape(c, p, fill, w, v); return p
def line(c, x0, y0, x1, y1, w=LW, v=INK, a=255): c.drawLine(x0, y0, x1, y1, ink(w, v, a))
def poly(c, pts, fill, w=LW, v=INK):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    p.close(); shape(c, p, fill, w, v); return p
def text_w(s, size, font=None): return skia.Font(font or KALAM, size).measureText(s)
def fit(s, size, maxw, font=None):  # diminui o tamanho até o texto caber em maxw
    while size > 20 and text_w(s, size, font) > maxw: size *= .94
    return size
def label(c, s, x, y, size, color, font=None, align='left', stroke=0, stroke_col=INK, skew=-0.16, alpha=1.0, rot=0.0):
    f = skia.Font(font or KALAM, size); w = f.measureText(s)
    ox = -w / 2 if align == 'center' else -w if align == 'right' else 0
    c.save(); c.translate(x, y); c.rotate(rot); c.skew(skew, 0)
    if stroke: c.drawString(s, ox, 0, f, ink(stroke, stroke_col, 255 * alpha))
    c.drawString(s, ox, 0, f, fp(color, 255 * alpha)); c.restore(); return w

# ---------------- lighting
def night(c, lights, ambient='#4C5CA0'):
    """Multiply navy darkness over everything drawn so far, with soft holes for lights.
    lights: ('pool',x,y,r,a) | ('oval',x,y,rx,ry,a) | ('path',skia.Path,a,blur)"""
    if ST['luz'] == 'dia': return  # estilos diurnos: sem escurecer
    p = skia.Paint(); p.setBlendMode(skia.BlendMode.kMultiply); c.saveLayer(None, p); c.drawPaint(fp(ambient))
    for L in lights:
        if L[0] == 'pool':
            _, x, y, r, a = L
            c.drawCircle(x, y, r, sp(radial(x, y, r, [C((0,0,0), 255*a), C((0,0,0), 255*a*.75), C((0,0,0), 0)], [0, .5, 1]), blend=skia.BlendMode.kDstOut))
        elif L[0] == 'oval':
            _, x, y, rx, ry, a = L; c.save(); c.translate(x, y); c.scale(1, ry / rx)
            c.drawCircle(0, 0, rx, sp(radial(0, 0, rx, [C((0,0,0), 255*a), C((0,0,0), 255*a*.7), C((0,0,0), 0)], [0, .55, 1]), blend=skia.BlendMode.kDstOut)); c.restore()
        else:
            _, path, a, blur = L; c.drawPath(path, fp((0, 0, 0), 255 * a, blur=blur, blend=skia.BlendMode.kDstOut))
    c.restore()
def add_light(c, x, y, r, v, a):
    a = a * (.35 if ST['luz'] == 'dia' else 1)
    c.drawCircle(x, y, r, sp(radial(x, y, r, [col(v, a), col(v, a * .4), col(v, 0)], [0, .5, 1]), blend=skia.BlendMode.kPlus))
def cone_path(x, y, top_w, bot_w, length, lean=0):
    p = skia.Path(); p.moveTo(x - top_w/2, y); p.lineTo(x + top_w/2, y); p.lineTo(x + lean + bot_w/2, y + length); p.lineTo(x + lean - bot_w/2, y + length); p.close(); return p
def blur_begin(c, sigma):  # depth blur for everything until c.restore()
    p = skia.Paint(); p.setImageFilter(skia.ImageFilters.Blur(sigma, sigma)); c.saveLayer(None, p)
def vignette(c, strength=0.64, inner=.42):
    c.drawRect(skia.Rect(0, 0, SW, SH), sp(radial(SW/2, SH/2, max(SW, SH)*.74, [C((0,0,0), 0), C((0,0,0), 0), C((2,3,12), 255*strength)], [0, inner, 1])))
def _sat(s, contrast, lift):
    lr, lg, lb = 0.2126, 0.7152, 0.0722
    m = [lr*(1-s)+s, lg*(1-s), lb*(1-s), lr*(1-s), lg*(1-s)+s, lb*(1-s), lr*(1-s), lg*(1-s), lb*(1-s)+s]
    out = []
    for r in range(3): out += [m[r*3+i] * contrast for i in range(3)] + [0, lift]
    return out + [0, 0, 0, 1, 0]
GRADE_CF = skia.ColorFilters.Matrix(_sat(0.94, 0.97, 0.012))
THRESH_CF = skia.ColorFilters.Matrix([1.7,0,0,0,-0.78, 0,1.7,0,0,-0.78, 0,0,1.7,0,-0.78, 0,0,0,1,0])
def finish(surf, bloom=0.40, sigma=20):  # grade + bloom; call after drawing a frame
    c = surf.getCanvas(); img = surf.makeImageSnapshot(); c.save(); c.resetMatrix(); c.clear(C((0, 0, 0))); sigma *= ESCALA
    p = skia.Paint(); p.setColorFilter(GRADE_CF); c.drawImage(img, 0, 0, skia.SamplingOptions(), p)
    b = skia.Paint(); b.setImageFilter(skia.ImageFilters.Blur(sigma, sigma, skia.TileMode.kClamp, skia.ImageFilters.ColorFilter(THRESH_CF)))
    b.setBlendMode(skia.BlendMode.kScreen); b.setAlphaf(bloom * (.4 if ST['luz'] == 'dia' else 1)); c.drawImage(img, 0, 0, skia.SamplingOptions(), b)
    w_, h_ = img.width(), img.height()
    if ST['textura'] == 'papel':  # grão de papel + leve sépia
        c.drawRect(skia.Rect(0, 0, w_, h_), fp('#F3E7C8', 60, blend=skia.BlendMode.kMultiply))
        r_ = random.Random(3)
        for _ in range(900): c.drawCircle(r_.uniform(0, w_), r_.uniform(0, h_), r_.uniform(.6, 2.2), fp('#8C7B5A', r_.uniform(15, 45)))
    elif ST['textura'] == 'reticula':  # pontinhos de gibi
        p_ = skia.Paint(AntiAlias=True, Color=C((0, 0, 0), 26)); step = 14
        for yy in range(0, h_, step):
            for xx in range((yy // step) % 2 * step // 2, w_, step): c.drawCircle(xx, yy, 2.4, p_)
    c.restore()

# ---------------- puppet character
BODY_TOP, BODY_BOT, HEAD_R = -345, -128, 100
HEAD_CY = BODY_TOP - 74
SHOULDER = (-56, BODY_TOP + 54)
ARM = {  # left arm: (elbow, hand, show_hand); right arm is mirrored
    'down': ((-90, -235), (-96, -168), True), 'pocket': ((-96, -232), (-70, -176), False),
    'hip': ((-128, -238), (-84, -190), True), 'present': ((-128, -306), (-208, -338), True),
    'gesture': ((-136, -262), (-152, -352), True), 'chin': ((-128, -262), (-62, -322), True),
    'hat': ((-140, -400), (-104, -482), True), 'hold': ((-96, -236), (-44, -214), True),
    'push': ((-120, -270), (-190, -262), True)}

def _arm(spec):  # 'name' or ('from', 'to', k) blended with overshoot
    if isinstance(spec, str): return ARM[spec]
    a, b, k = spec; k = back(k, 1.6); ea, ha, sa = ARM[a]; eb, hb, sb = ARM[b]
    return (lerp(ea[0], eb[0], k), lerp(ea[1], eb[1], k)), (lerp(ha[0], hb[0], k), lerp(ha[1], hb[1], k)), (sb if k > .5 else sa)

CORPOS = ('homem', 'mulher', 'menino', 'menina', 'idoso', 'idosa')  # 'crianca' = menino   # "corpo" no spec
ESPECIES = ('humano', 'gato', 'cachorro', 'coelho', 'urso')  # "especie" no spec
import json as _json
_CP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cabelos.json')
if not os.path.exists(_CP): import runpy; runpy.run_path(os.path.join(os.path.dirname(_CP), 'cabelos_gen.py'))  # gera os penteados
_CAB = _json.load(open(_CP, encoding='utf8'))
CABELOS_M = tuple(_CAB['masc'])  # sugeridos para homem/menino/idoso
CABELOS_F = tuple(_CAB['fem'])   # sugeridos para mulher/menina/idosa
CABELOS = tuple(dict.fromkeys(CABELOS_M + CABELOS_F))
ROUPAS = ('suit', 'tee', 'blouse', 'dress', 'hoodie', 'jaleco', 'jardineira', 'sueter', 'colete', 'pelo')
ROSA = '#F2A7B5'


def _corpo_path(curvo):
    p = skia.Path(); T, B = BODY_TOP, BODY_BOT
    if curvo:  # silhueta feminina: ombros mais estreitos, quadril mais largo
        p.moveTo(0, T); p.cubicTo(44, T, 64, T + 6, 66, T + 52); p.cubicTo(68, T + 110, 92, B - 70, 92, B - 34)
        p.cubicTo(92, B - 4, 70, B, 0, B); p.cubicTo(-70, B, -92, B - 4, -92, B - 34)
        p.cubicTo(-92, B - 70, -68, T + 110, -66, T + 52); p.cubicTo(-64, T + 6, -44, T, 0, T); p.close()
    else: p.addRRect(skia.RRect.MakeRectXY(skia.Rect(-84, T, 84, B), 66, 72))
    return p


_PCACHE = {}
def _hpath(d):  # mini-SVG: M L C Q Z e O (oval cx cy rx ry); o editor usa o mesmo leitor
    p = _PCACHE.get(d)
    if p is not None: return p
    t = d.split(); p = skia.Path(); i = 0
    while i < len(t):
        k = t[i]; i += 1
        n = {'M': 2, 'L': 2, 'C': 6, 'Q': 4, 'Z': 0, 'O': 4}[k]; v = [float(x) for x in t[i:i + n]]; i += n
        if k == 'M': p.moveTo(*v)
        elif k == 'L': p.lineTo(*v)
        elif k == 'C': p.cubicTo(*v)
        elif k == 'Q': p.quadTo(*v)
        elif k == 'Z': p.close()
        else: p.addOval(skia.Rect(v[0] - v[2], v[1] - v[3], v[0] + v[2], v[1] + v[3]))
    _PCACHE[d] = p; return p
def tons_cabelo(h):  # mechas e brilho a partir da cor do cabelo
    r, g, b = (int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)); lum = (.299 * r + .587 * g + .114 * b) / 255
    return (clarear(h, .2) if lum < .3 else escurecer(h, .7)), clarear(h, .42 if lum < .3 else .38)
def _cabelo(c, grupo, hair, hcol, band, face, lado, lw, coberto=False):
    st = _CAB['estilos'].get(hair) if hair else None
    Ls = st and st.get(grupo)
    if not Ls: return
    hs, hl = tons_cabelo(hcol); cor = {'h': hcol, 'hs': hs, 'hl': hl, 'band': band}
    Ls = [L for L in Ls if not (coberto and L.get('alto'))]
    def abre(L):
        c.save()
        cl = L.get('clip')  # 'cabeca': por dentro do contorno do rosto; 'cobre': cobre o contorno (cabelo atrás continua)
        if cl: c.clipPath(skia.Path.Circle(0, 0, HEAD_R + (-.45 if cl == 'cabeca' else .6) * lw * ST['lw']), doAntiAlias=True)
        if L.get('kf'): c.translate(face * L['kf'], 0)
        e = L.get('esp')
        if (e == 1 and lado < 0) or (e == -1 and lado > 0): c.scale(-1, 1)
        return _hpath(L['d'])
    for L in Ls:  # 1) contorno de tudo (largo), 2) preenchimentos por cima: some o traço interno entre as partes
        if L.get('f') and L.get('w', 1): c.drawPath(abre(L), ink(lw * 2 * L.get('w', 1))); c.restore()
    for L in Ls:
        if L.get('f'): c.drawPath(abre(L), fp(cor[L['f']], 255 * L.get('a', 1))); c.restore()
    for L in Ls:
        if L.get('s') and not L.get('f'):
            v = INK if L['s'] == 'ink' else cor[L['s']]; c.drawPath(abre(L), ink(lw * L.get('w', .6), v, 255 * L.get('a', 1))); c.restore()


def draw_char(c, x, y, s, spec, face=0.0, eyes='dot', mouth='smile', brow=0.0, brow_tilt=0.0, arms=('down', 'down'),
              tilt=0.0, bob=0.0, squash=0.0, sweat=-1.0, light=-1, rim=None, hat=False, legs=None, pupil=0.0, sparkle=0.0):
    """x,y = pés. s=1 -> cabeça com raio 100 px (s=1 plano aberto, s~2.15 close com pés em y~1390).
    face -1..1 = giro 3/4. light -1 = luz da esquerda. eyes: dot/half/wide/closed. mouth: smile/smirk/flat/o/mid/open.
    spec: corpo (homem/mulher/crianca/idoso/idosa), especie (humano/gato/cachorro/coelho/urso), top (ROUPAS), hair (CABELOS),
    acessórios: glasses, moustache, barba, lashes, sardas, brincos, laco, bone, hat, bengala, hanky."""
    USADOS.append(spec.get('_nome') or ('figurante' if spec.get('figurante') else None))  # para a checagem do elenco
    spec = completar(spec); hat = hat or spec.get('hat', False)
    corpo = spec.get('corpo', 'homem'); esp = spec.get('especie', 'humano'); kid = corpo in ('crianca', 'menino', 'menina')
    curvo = corpo in ('mulher', 'idosa'); velho = corpo in ('idoso', 'idosa'); k_ = .74 if kid else 1.0
    lw = max(5.2, 4.0 / s) / k_; R = HEAD_R; s = s * k_; hm = ST['cabeca'] * (1.22 if kid else 1.0)
    fur, fur_d = spec['skin'], spec['skin_d']; claro = clarear(fur, .55); band = spec.get('hat_band', '#C8242C')
    lado = 1 if face >= 0 else -1; T, B = BODY_TOP, BODY_BOT
    c.save(); c.translate(x, y); c.scale(s, s)
    pal = ST.get('corpo') == 'palito'
    for (hx0, fx, lift) in (legs or ((-24, 0, 0), (24, 0, 0))):
        c.drawLine(0 if pal else hx0, B - 8, hx0 * (1.6 if pal else 1) + fx, -lift, ink(lw))
    c.translate(0, -bob); c.scale(1 + squash * .6, 1 - squash)
    if velho: c.translate(0, B); c.rotate(5 * lado); c.translate(0, -B)  # costas curvadas
    hair = spec.get('hair', 'none' if esp != 'humano' else None); hcol = spec.get('hair_col', '#1C1B22')

    def head_tf():
        c.translate(0, HEAD_CY); c.rotate(tilt); c.translate(0, -R * (hm - 1)); c.scale(hm, hm)

    # rabo dos animais (atrás do corpo)
    if esp != 'humano' and not pal:
        sd = -lado
        if esp in ('gato', 'cachorro'):
            tp = skia.Path(); tp.moveTo(sd * 60, B - 34)
            if esp == 'gato': tp.cubicTo(sd * 160, B - 40, sd * 150, -300, sd * 112, -336)
            else: tp.quadTo(sd * 126, B - 60, sd * 134, B - 128)
            w0 = 30 if esp == 'gato' else 34; c.drawPath(tp, ink(w0 + lw * 2)); c.drawPath(tp, ink(w0, fur))
        else: circ(c, sd * 74, B - 26, 28 if esp == 'coelho' else 20, claro if esp == 'coelho' else fur, lw)

    # cabelo de trás e orelhas de trás (antes do corpo)
    c.save(); head_tf()
    _cabelo(c, 'tras', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    if esp == 'gato':
        for sx in (-1, 1):
            poly(c, [(sx * 26, -R * .9), (sx * 94, -R * .42), (sx * 86, -R * 1.44)], fur, lw)
            poly(c, [(sx * 46, -R * .84), (sx * 80, -R * .58), (sx * 79, -R * 1.18)], ROSA, 0)
    elif esp == 'coelho':
        for sx in (-1, 1):
            c.save(); c.translate(sx * 40, -R * .82); c.rotate(sx * 12); oval(c, -27, -158, 27, 12, fur, lw); oval(c, -12, -136, 12, -14, ROSA, 0); c.restore()
    elif esp == 'urso':
        for sx in (-1, 1): circ(c, sx * 70, -R * .72, 34, fur, lw); circ(c, sx * 70, -R * .72, 17, fur_d, 0)
    c.restore()

    top = spec.get('top', 'suit')
    if pal: c.drawLine(0, T - 40, 0, B - 8, ink(lw * 1.1)); spec = dict(spec, hanky=None)  # corpo de palito
    wb = 92 if curvo else 84
    if not pal and top == 'jaleco':  # aba do jaleco abaixo do corpo
        rect(c, -wb - 4, B - 40, -2, B + 62, spec['suit'], lw, r=12); rect(c, 2, B - 40, wb + 4, B + 62, spec['suit'], lw, r=12)
    body = _corpo_path(curvo)
    shirt = spec.get('shirt', '#F4EFE2')
    base = shirt if top in ('jardineira', 'colete') else fur if top == 'pelo' else spec['suit']
    sombra = escurecer(shirt, .84) if top in ('jardineira', 'colete') else fur_d if top == 'pelo' else spec['suit_d']
    if not pal: c.drawPath(body, fp(base))
    c.save(); c.clipPath(body, doAntiAlias=True)
    if pal: c.clipRect(skia.Rect(0, 0, 0, 0))  # nada de roupa no palito
    sh = skia.Path(body); sh.offset(light * 16, -5)
    if ST['sombra']: c.drawPath(skia.Op(body, sh, skia.PathOp.kDifference_PathOp), fp(sombra))
    if top in ('suit', 'jaleco'):
        v = skia.Path(); v.moveTo(-34, T - 4); v.lineTo(0, T + 96); v.lineTo(34, T - 4); v.close(); c.drawPath(v, fp(shirt))
        if spec.get('bowtie'):
            by = T + 40; bt = skia.Path(); bt.moveTo(0, by); bt.lineTo(-24, by - 14); bt.lineTo(-24, by + 14); bt.close()
            bt.moveTo(0, by); bt.lineTo(24, by - 14); bt.lineTo(24, by + 14); bt.close(); shape(c, bt, spec['tie'], lw * .75); circ(c, 0, by, 5, spec['tie'], lw * .7)
        elif spec.get('tie'):
            poly(c, [(-9, T + 24), (9, T + 24), (13, T + 82), (0, T + 98), (-13, T + 82)], spec['tie'], lw * .75)
        for sx in (-1, 1):
            lp = skia.Path(); lp.moveTo(sx * 36, T - 2); lp.lineTo(sx * 2, T + 98); lp.lineTo(sx * 2, B); c.drawPath(lp, ink(lw * .75))
            c.drawLine(sx * 22, T + 58, sx * 40, T + 44, ink(lw * .6))
        if top == 'jaleco':
            rect(c, 30, T + 112, 66, T + 150, spec['suit'], lw * .6); c.drawLine(40, T + 100, 40, T + 126, ink(lw * 1.3, '#3E6FA8'))
    elif top == 'jardineira':
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * .75))
        for sx in (-1, 1): poly(c, [(sx * 30, T + 84), (sx * 50, T + 84), (sx * 66, T - 6), (sx * 46, T - 10)], spec['suit'], lw * .6)
        rect(c, -50, T + 78, 50, B + 10, spec['suit'], lw * .7, r=8); rect(c, -24, T + 104, 24, T + 140, spec['suit_d'], lw * .5, r=4)
        for sx in (-1, 1): circ(c, sx * 38, T + 92, 7, GOLD, lw * .5)
    elif top == 'colete':
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * .75))
        if spec.get('tie'): poly(c, [(-9, T + 24), (9, T + 24), (13, T + 82), (0, T + 98), (-13, T + 82)], spec['tie'], lw * .75)
        for sx in (-1, 1): poly(c, [(sx * 120, T - 10), (sx * 34, T - 10), (sx * 4, T + 104), (sx * 4, B + 10), (sx * 120, B + 10)], spec['suit'], lw * .75)
        for j in range(3): circ(c, 14, T + 124 + j * 26, 5, spec['suit_d'], lw * .5)
    elif top == 'pelo':
        c.drawOval(skia.Rect(-54, T + 46, 54, B - 6), fp(claro))
    else:  # tee, blouse, dress, hoodie, sueter
        if top == 'sueter':
            for yy in range(int(T + 46), int(B), 40): c.drawRect(skia.Rect(-130, yy, 130, yy + 15), fp(spec.get('print', '#F4EFE2')))
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * (1.6 if top == 'sueter' else .75)))
        if top == 'blouse':
            for sx in (-1, 1): poly(c, [(0, T + 30), (sx * 40, T + 2), (sx * 30, T + 38)], shirt, lw * .6)
        if top == 'dress': c.drawRect(skia.Rect(-120, T + 118, 120, T + 136), fp(spec.get('print', '#F2C14E'))); c.drawLine(-120, T + 118, 120, T + 118, ink(lw * .5)); c.drawLine(-120, T + 136, 120, T + 136, ink(lw * .5))
        if top == 'hoodie':
            rect(c, -54, B - 74, 54, B - 14, spec['suit_d'], lw * .6, r=14)
            for sx in (-1, 1): c.drawLine(sx * 16, T + 26, sx * 18, T + 74, ink(lw * .55, shirt)); circ(c, sx * 18, T + 78, 4, shirt, 0)
        if top == 'tee' and spec.get('print'): circ(c, 0, T + 100, 26, spec['print'], lw * .6)  # estampa simples
    if spec.get('hanky') and top in ('suit', 'colete'): poly(c, [(30, T + 96), (52, T + 92), (48, T + 76), (40, T + 86), (33, T + 76)], spec['hanky'], lw * .55)
    c.restore()
    if not pal: c.drawPath(body, ink(lw))
    if not pal and top == 'dress':  # saia do vestido, a partir do cinto
        yb, w0 = T + 136, (72 if curvo else 84); sk = skia.Path(); sk.moveTo(-w0, yb); sk.lineTo(w0, yb)
        sk.cubicTo(wb + 6, B - 40, wb + 28, B + 40, wb + 32, B + 62); sk.quadTo(0, B + 84, -wb - 32, B + 62); sk.cubicTo(-wb - 28, B + 40, -wb - 6, B - 40, -w0, yb); sk.close()
        c.drawPath(sk, fp(spec['suit']))
        if ST['sombra']:
            c.save(); c.clipPath(sk, doAntiAlias=True); x0_, x1_ = (30, 240) if light < 0 else (-240, -30); c.drawRect(skia.Rect(x0_, yb, x1_, B + 90), fp(spec['suit_d'])); c.restore()
        c.drawPath(sk, ink(lw))
    if not pal and top == 'hoodie':  # capuz em volta do pescoço
        oval(c, -94, T - 56, 94, T + 40, spec['suit'], lw); c.drawOval(skia.Rect(-64, T - 40, 64, T + 22), fp(spec['suit_d']))
    for side, a in ((-1, arms[0]), (1, arms[1])):
        e, h, show = _arm(a); m = 1 if side < 0 else -1
        sx, sy = (0, SHOULDER[1] - 10) if pal else (SHOULDER[0] * m, SHOULDER[1]); ex, ey, hx_, hy_ = e[0] * m, e[1], h[0] * m, h[1]
        ap = skia.Path(); ap.moveTo(sx, sy); ap.quadTo(1.35*ex - .175*(sx+hx_), 1.35*ey - .175*(sy+hy_), hx_, hy_); c.drawPath(ap, ink(lw))
        if spec.get('bengala') and side == lado:  # bengala na mão do lado para onde olha
            cb = skia.Path(); cb.moveTo(hx_ - side * 26, hy_ - 4); cb.quadTo(hx_ - side * 18, hy_ - 34, hx_, hy_ - 16); cb.lineTo(hx_ + side * 22, -4)
            c.drawPath(cb, ink(lw * 2.6)); c.drawPath(cb, ink(lw * 1.2, '#9A6A3E'))
        if show: circ(c, hx_, hy_, 13, spec['skin'], lw * .8)
    c.save(); head_tf()
    head = skia.Path(); head.addCircle(0, 0, R)
    _cabelo(c, 'nuca', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    c.drawPath(head, fp(spec['skin'])); c.save(); c.clipPath(head, doAntiAlias=True)
    lit = skia.Path(head); lit.offset(light * 7, -17)
    if ST['sombra']: c.drawPath(skia.Op(head, lit, skia.PathOp.kDifference_PathOp), fp(spec['skin_d']))
    if rim: rm = skia.Path(head); rm.offset(-light * 11, 4); c.drawPath(skia.Op(head, rm, skia.PathOp.kDifference_PathOp), fp(rim, 215))
    if spec.get('barba'):  # barba: contorna o queixo, abaixo da boca
        mx0 = face * 34; bd = skia.Path(); bd.moveTo(-R - 10, -20); bd.lineTo(-82, -20); bd.cubicTo(-76, 50, mx0 - 42, 72, mx0, 72)
        bd.cubicTo(mx0 + 42, 72, 76, 50, 82, -20); bd.lineTo(R + 10, -20); bd.lineTo(R + 10, R + 10); bd.lineTo(-R - 10, R + 10); bd.close(); c.drawPath(bd, fp(hcol))
    c.restore()
    c.drawPath(head, ink(lw))  # contorno da cabeça antes do cabelo: o cabelo da frente o cobre
    _cabelo(c, 'frente', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    if esp == 'cachorro':  # orelhas caídas na frente
        for sx in (-1, 1):
            c.save(); c.translate(sx * R * .86, -R * .55); c.rotate(-sx * 14); oval(c, -26, -10, 26, 112, fur_d, lw); c.restore()
    if hat:
        crown = skia.Path(); crown.moveTo(-R + 6, -56); crown.cubicTo(-R - 2, -R - 82, R + 2, -R - 82, R - 6, -56); crown.close()
        shape(c, crown, spec.get('hat_col', '#2E2E38'), lw); c.save(); c.clipPath(crown, doAntiAlias=True)
        c.drawRect(skia.Rect(-R, -86, R, -56), fp(spec.get('hat_band', '#7E1C24'))); c.drawLine(-R, -86, R, -86, ink(lw * .7)); c.restore()
        c.drawPath(crown, ink(lw)); oval(c, -R - 40, -70, R + 40, -40, spec.get('hat_col', '#2E2E38'), lw)
    elif spec.get('bone'):  # boné com aba virada para onde olha
        dm = skia.Path(); dm.moveTo(-R + 2, -44); dm.cubicTo(-R - 6, -R - 52, R + 6, -R - 52, R - 2, -44); dm.close(); shape(c, dm, spec.get('hat_col', '#2E2E38'), lw)
        oval(c, lado * 30 - 62 + lado * 40, -58, lado * 30 + 62 + lado * 40, -32, spec.get('hat_col', '#2E2E38'), lw); circ(c, 0, -R - 22, 8, band, lw * .6)
    if spec.get('laco'):
        bx, by_ = -lado * R * .6, -R * .84
        for sx in (-1, 1): poly(c, [(bx, by_), (bx + sx * 36, by_ - 22), (bx + sx * 36, by_ + 22)], band, lw * .7)
        circ(c, bx, by_, 9, band, lw * .6)
    if spec.get('brincos'):
        for sx in (-1, 1): circ(c, sx * R * .97, 34, 8, GOLD, lw * .5)
    fx = face * 40; eyy = -6; mx, my = face * 34, 42
    if esp != 'humano':  # focinho e nariz
        big = esp in ('cachorro', 'urso'); rx_, ry_ = (46, 32) if big else (30, 22)
        c.drawOval(skia.Rect(mx - rx_, 34 - ry_, mx + rx_, 34 + ry_), fp(claro))
        if big: oval(c, mx - 14, 8, mx + 14, 26, INK, 0)
        else: poly(c, [(mx - 10, 18), (mx + 10, 18), (mx, 28)], ROSA, lw * .5)
    for ex0 in (-30, 30):
        ex = ex0 + fx; far = (face > 0 and ex0 > 0) or (face < 0 and ex0 < 0); sq = 1 - .3 * abs(face) if far else 1.0
        if eyes == 'wide':
            oval(c, ex - 17*sq, eyy - 17, ex + 17*sq, eyy + 17, '#FBFBF7', lw * .7)
            c.drawOval(skia.Rect(ex - 5.5*sq + pupil*6, eyy - 5.5, ex + 5.5*sq + pupil*6, eyy + 5.5), fp(INK))
        elif eyes == 'closed':
            e = skia.Path(); e.moveTo(ex - 11*sq, eyy); e.quadTo(ex, eyy + 9, ex + 11*sq, eyy); c.drawPath(e, ink(lw * .8))
        elif eyes == 'half':
            c.save(); c.clipRect(skia.Rect(ex - 20, eyy - 3, ex + 20, eyy + 20)); c.drawOval(skia.Rect(ex - 6.5*sq, eyy - 9, ex + 6.5*sq, eyy + 9), fp(INK)); c.restore()
            c.drawLine(ex - 13*sq, eyy - 4, ex + 13*sq, eyy - 4, ink(lw * .8))
        elif ST['olhos'] == 'grande' or kid:  # olhos grandes e brilhantes (estilo fofo e crianças)
            oval(c, ex - 13*sq, eyy - 16, ex + 13*sq, eyy + 16, '#FBFBF7', lw * .6)
            c.drawOval(skia.Rect(ex - 8*sq + face*3, eyy - 10, ex + 8*sq + face*3, eyy + 12), fp(INK))
            c.drawCircle(ex + 3 + face*3, eyy - 4, 3.6, fp((255, 255, 255))); c.drawCircle(ex - 3 + face*3, eyy + 5, 1.6, fp((255, 255, 255), 200))
        else:
            c.drawOval(skia.Rect(ex - 5.5*sq, eyy - 8, ex + 5.5*sq, eyy + 8), fp(INK)); c.drawCircle(ex + 1.5, eyy - 3, 1.8, fp((255, 255, 255), 220))
        if spec.get('lashes') and eyes != 'closed':
            o = -1 if ex0 < 0 else 1; c.drawLine(ex + o * 9 * sq, eyy - 6, ex + o * 17 * sq, eyy - 13, ink(lw * .6))
        if velho:  # rugas no canto dos olhos
            o = -1 if ex0 < 0 else 1; c.drawLine(ex + o * 18 * sq, eyy + 2, ex + o * 26 * sq, eyy + 8, ink(lw * .45))
        if spec.get('sardas'):
            for dx, dy in ((-8, 0), (0, 5), (8, 0)): c.drawCircle(ex + dx * sq, 24 + dy, 3, fp(escurecer(spec['skin'], .68)))
        inner = 1 if ex0 < 0 else -1; by = eyy - 29 - brow * 9
        c.drawLine(ex - 13*sq, by + (brow_tilt*7 if inner < 0 else -brow_tilt*7), ex + 13*sq, by + (brow_tilt*7 if inner > 0 else -brow_tilt*7), ink(lw * .78))
    if spec.get('glasses'):
        for ex0 in (-30, 30):
            ex = ex0 + fx; far = (face > 0 and ex0 > 0) or (face < 0 and ex0 < 0); sq = 1 - .3 * abs(face) if far else 1.0
            g = skia.Path(); g.addOval(skia.Rect(ex - 24*sq, eyy - 24, ex + 24*sq, eyy + 24)); c.drawPath(g, fp((225, 240, 255), 55)); c.drawPath(g, ink(lw * .7))
        c.drawLine(fx - 7, eyy - 3, fx + 7, eyy - 3, ink(lw * .7))
    if spec.get('moustache'):
        mu = skia.Path(); mu.moveTo(mx, my - 20)
        mu.cubicTo(mx-12, my-28, mx-30, my-22, mx-40, my-30); mu.cubicTo(mx-30, my-10, mx-12, my-12, mx, my-15)
        mu.cubicTo(mx+12, my-12, mx+30, my-10, mx+40, my-30); mu.cubicTo(mx+30, my-22, mx+12, my-28, mx, my-20); mu.close()
        c.drawPath(mu, fp(spec.get('hair_col', '#1C1B22')))
    if mouth == 'smile': m = skia.Path(); m.moveTo(mx - 17, my - 2); m.quadTo(mx, my + 13, mx + 17, my - 2); c.drawPath(m, ink(lw * .8))
    elif mouth == 'smirk':
        d = 1 if face >= 0 else -1; m = skia.Path(); m.moveTo(mx - 15*d, my + 3); m.quadTo(mx + 4*d, my + 12, mx + 20*d, my - 6); c.drawPath(m, ink(lw * .8))
    elif mouth == 'flat': c.drawLine(mx - 12, my + 2, mx + 12, my + 2, ink(lw * .8))
    elif mouth == 'o': oval(c, mx - 8, my - 9, mx + 8, my + 11, '#5A1A1E', lw * .7)
    elif mouth == 'mid': oval(c, mx - 12, my - 4, mx + 12, my + 10, '#5A1A1E', lw * .7)
    elif mouth == 'open':
        mp = skia.Path(); mp.moveTo(mx - 20, my - 5); mp.lineTo(mx + 20, my - 5); mp.cubicTo(mx + 19, my + 24, mx - 19, my + 24, mx - 20, my - 5); mp.close()
        c.drawPath(mp, fp('#5A1A1E')); c.save(); c.clipPath(mp, doAntiAlias=True)
        c.drawRect(skia.Rect(mx - 22, my - 6, mx + 22, my + 2), fp('#FAFAF4')); c.drawOval(skia.Rect(mx - 11, my + 9, mx + 11, my + 26), fp('#D05860')); c.restore()
        c.drawPath(mp, ink(lw * .7))
    if esp in ('gato', 'coelho'):  # bigodes
        for sx in (-1, 1):
            for dy in (-6, 8): c.drawLine(mx + sx * 26, 30 + dy * .3, mx + sx * 74, 24 + dy, ink(lw * .4))
    if sparkle > 0:
        k = pop(sparkle) * (1 if sparkle < 1 else max(0, 2 - sparkle)); sx_, sy_ = mx + 26 * (1 if face >= 0 else -1), my - 8; st = skia.Path()
        for i in range(8):
            r_ = (20 if i % 2 == 0 else 5) * k; a = i * math.pi / 4; (st.moveTo if i == 0 else st.lineTo)(sx_ + r_ * math.cos(a), sy_ + r_ * math.sin(a))
        st.close(); c.drawPath(st, fp('#FFFFFF'))
    if sweat >= 0:
        sx0, sy0 = (-1 if face > 0 else 1) * 62, -66 + 30 * (sweat % 1.0)
        d = skia.Path(); d.moveTo(sx0, sy0 - 19); d.cubicTo(sx0 + 12, sy0 - 3, sx0 + 11, sy0 + 10, sx0, sy0 + 10); d.cubicTo(sx0 - 11, sy0 + 10, sx0 - 12, sy0 - 3, sx0, sy0 - 19); d.close()
        shape(c, d, '#8FC8EE', lw * .7)
    c.restore(); c.restore()


def _tri(x0, y0, x1, y1, x2, y2):
    p = skia.Path(); p.moveTo(x0, y0); p.lineTo(x1, y1); p.lineTo(x2, y2); p.close(); return p
def escurecer(h, f):
    h = h.lstrip('#'); return '#' + ''.join(f'{int(int(h[i:i + 2], 16) * f):02x}' for i in (0, 2, 4))
def clarear(h, f):  # mistura com branco (f=0 igual, f=1 branco)
    h = h.lstrip('#'); return '#' + ''.join(f'{int(int(h[i:i + 2], 16) + (255 - int(h[i:i + 2], 16)) * f):02x}' for i in (0, 2, 4))
def completar(spec):  # aceita specs do editor de personagens: cores de sombra automáticas
    s = dict(spec)
    if 'skin_d' not in s: s['skin_d'] = escurecer(s.get('skin', '#E6BE8E'), .84)
    s.setdefault('suit', '#3E6FA8')
    if 'suit_d' not in s: s['suit_d'] = escurecer(s['suit'], .76)
    if s.get('especie', 'humano') != 'humano': s.setdefault('top', 'pelo'); s.setdefault('hair', 'none')
    if s.get('hair') == 'curly' and s.get('corpo') in ('mulher', 'menina', 'idosa'): s['hair'] = 'cachos'  # versão antiga do editor
    s.setdefault('skin', '#E6BE8E'); return s
USADOS = []  # nomes do elenco desenhados (None = personagem fora do elenco)
def carregar_elenco(proj, padrao=None):
    """Lê o "elenco" do roteiro.json (colado do editor de personagens). Uso no cenas.py:
    EL = carregar_elenco(os.path.dirname(os.path.abspath(__file__))); RAFA = EL['rafa']
    O personagem vem EXATAMENTE como o usuário montou. 'padrao' só serve quando não há elenco no roteiro.json."""
    import json
    try: R = json.load(open(os.path.join(proj, 'roteiro.json'), encoding='utf8'))
    except FileNotFoundError: R = {}
    el = R.get('elenco') or dict(padrao or {})
    return Elenco({k: dict(completar(v), _nome=k) for k, v in el.items()}, bool(R.get('elenco')))
class Elenco(dict):  # avisa na hora se a cena pede um nome que o elenco não tem
    def __init__(self, d, do_editor):
        super().__init__(d); self.do_editor = do_editor
    def __missing__(self, k):
        raise KeyError(f'"{k}" não está no elenco ({", ".join(self) or "vazio"}). Use os nomes do editor ou renomeie no roteiro.json.')


def walk_legs(phase, stride=46, lift=20):  # pass as legs=walk_legs((t-t0)*11) with bob=7*abs(sin(phase))
    a = math.sin(phase)
    return ((-10, a * stride, max(0, math.cos(phase)) * lift), (10, -a * stride, max(0, -math.cos(phase)) * lift))

# elenco de exemplo (invente um visual novo por vídeo: cabelo, óculos, cor da roupa, chapéu, tom de pele)
HERO = dict(skin='#E6BE8E', skin_d='#C99F70', suit='#3B4660', suit_d='#2B3348', shirt='#F4EFE2', tie='#A8232B', hair='slick', moustache=True, hanky='#F4EFE2')
MARK = dict(skin='#EBC79C', skin_d='#CFA677', suit='#7A5A3C', suit_d='#5E432B', shirt='#F4EFE2', tie='#2F6B4E', bowtie=True, hair='bald', glasses=True)
ANA = dict(skin='#B9825A', skin_d='#9A6744', suit='#2E7D6B', suit_d='#225E50', shirt='#F4EFE2', top='blouse', hair='long', hair_col='#2A1A14', lashes=True)
JOAO = dict(skin='#8A5A3B', skin_d='#6E4529', suit='#C8742C', suit_d='#A35B1E', top='tee', print='#F2C14E', hair='curly', hair_col='#1A1210')

# modelos prontos (os mesmos do editor de personagens): dict(MODELOS['avo_f'], suit='#2E7D6B') para variar
MODELOS = {
    'homem':    dict(corpo='homem', skin='#E6BE8E', top='tee', suit='#3E6FA8', print='#F2C14E', hair='short', hair_col='#3B2A20'),
    'mulher':   dict(corpo='mulher', skin='#C98F62', top='dress', suit='#B23A48', print='#F2C14E', hair='long', hair_col='#2A1A14', lashes=True, brincos=True),
    'menino':   dict(corpo='menino', skin='#D9A877', top='sueter', suit='#3E6FA8', print='#F4EFE2', hair='espetado', hair_col='#3B2A20', sardas=True),
    'menina':   dict(corpo='menina', skin='#8A5A3B', top='jardineira', suit='#5B8DD6', shirt='#F2C14E', hair='maria', hair_col='#1C1B22', lashes=True, laco=True, hat_band='#E04E8A'),
    'avo_m':    dict(corpo='idoso', skin='#E6BE8E', top='colete', suit='#7A5A3C', shirt='#F4EFE2', hair='bald', hair_col='#D8D8DC', glasses=True, moustache=True, bengala=True),
    'avo_f':    dict(corpo='idosa', skin='#D9A877', top='blouse', suit='#7A3B5E', shirt='#F4EFE2', hair='bun', hair_col='#DADADF', glasses=True, lashes=True, brincos=True),
    'gato':     dict(especie='gato', skin='#E8964A'),
    'cachorro': dict(especie='cachorro', skin='#C8A27A'),
    'coelho':   dict(especie='coelho', skin='#EDE8E4'),
    'urso':     dict(especie='urso', skin='#8A5A3B'),
}


# ---------------- peças de cenário reutilizáveis
_r = random.Random(7)
STARS = [(_r.uniform(-200, W + 200), _r.uniform(-100, 760), _r.choice((1.6, 2.0, 2.6, 3.2)), _r.uniform(0, 6)) for _ in range(120)]
SPECK = [(_r.uniform(0, W), _r.uniform(70, 1010), _r.uniform(1.5, 4.5), _r.uniform(40, 110)) for _ in range(260)]

def sky(c, top='#0A1136', bot='#24338A', h=860):
    if ST['luz'] == 'dia': top, bot = '#5FB2E8', '#CDEBFA'  # céu de dia nos estilos diurnos
    c.drawRect(skia.Rect(-2000, -1500, W + 2000, H + 1500), sp(linear(0, 0, 0, h, [hx(top), hx(bot)])))
def stars(c, t):
    if ST['luz'] == 'dia': return
    for (sx, sy, r, ph) in STARS: c.drawCircle(sx, sy, r, fp('#E8ECFF', 150 + 90 * math.sin(t * 2.4 + ph)))
def moon(c, x, y, r=50):
    if ST['luz'] == 'dia':  # vira sol
        for k, a_ in ((3.0, 30), (2.0, 50)): c.drawCircle(x, y, r * k, fp('#FFF4C2', a_))
        circ(c, x, y, r, '#FFD84A', LW * .7); return
    for k, a in ((3.0, 16), (2.2, 22), (1.55, 30)): c.drawCircle(x, y, r * k, fp('#C9D4FF', a))
    c.drawCircle(x, y, r, fp('#F3EDD3')); c.drawCircle(x - r * .3, y - r * .25, r * .16, fp('#D9D2B4')); c.drawCircle(x + r * .25, y + r * .3, r * .22, fp('#DDD6B8'))
def cloud(c, x, y, s, v='#2C3B80', a=255):
    p = skia.Path()
    for dx, dy, r in ((-70, 8, 34), (-30, -14, 46), (22, -6, 40), (64, 10, 30)): p.addCircle(x + dx * s, y + dy * s, r * s)
    p.addRect(skia.Rect(x - 100 * s, y + 8 * s, x + 92 * s, y + 40 * s)); c.drawPath(p, fp(v, a))
def far_city(c, base, seed=3, v='#1A2560'):  # silhueta distante (use dentro de blur_begin)
    r = random.Random(seed); x = -260
    while x < W + 260:
        w = r.uniform(90, 200); h = r.uniform(120, 260)
        c.drawRect(skia.Rect(x, base - h, x + w, base + 300), fp(v)); c.drawRect(skia.Rect(x + 10, base - h - 26, x + w - 10, base - h), fp(v))
        for j in range(int(h // 50)):
            for i in range(int(w // 40)):
                if r.random() < .3: c.drawRect(skia.Rect(x + 12 + i * 40, base - h + 16 + j * 50, x + 24 + i * 40, base - h + 36 + j * 50), fp('#E9CF86', 200))
        x += w + r.uniform(-6, 10)
def building(c, x, w, h, base, seed, lit=.4, lw=LW, body='#1C2658', roof='#131A42', dim='#263272'):  # prédio com janelas acesas
    r = random.Random(seed); top = base - h
    rect(c, x, top, x + w, base + 600, body, lw)
    poly(c, [(x - 8, top), (x + 16, top - 44), (x + w - 16, top - 44), (x + w + 8, top)], roof, lw)
    for i in range(r.randint(1, 3)):
        cx_ = x + r.uniform(.15, .8) * w; rect(c, cx_, top - 78, cx_ + 22, top - 44, roof, lw * .8)
    cols = max(2, int((w - 30) // 46)); rows = int((h - 30) // 62); gap = (w - cols * 22) / (cols + 1)
    for j in range(rows):
        for i in range(cols):
            wx, wy = x + gap + i * (22 + gap), top + 26 + j * 62; on = r.random() < lit
            rect(c, wx, wy, wx + 22, wy + 36, '#F2D88C' if on else dim, lw * .5)
            if on: c.drawRect(skia.Rect(wx - 8, wy - 8, wx + 30, wy + 44), fp('#FFD98A', 34, blur=7))
def street_lamp(c, x, y_base, y_top):
    line(c, x, y_base, x, y_top, 22, INK); line(c, x, y_base, x, y_top, 11, '#2B2D3C')
    rect(c, x - 22, y_base - 26, x + 22, y_base + 4, '#2B2D3C', LW * .8)
    poly(c, [(x - 40, y_top + 4), (x + 40, y_top + 4), (x + 26, y_top - 72), (x - 26, y_top - 72)], '#FFF0B4', LW)
    poly(c, [(x - 48, y_top - 72), (x + 48, y_top - 72), (x, y_top - 112)], '#2B2D3C', LW); line(c, x - 40, y_top + 4, x + 40, y_top + 4, LW)
def banker_lamp(c, x, y):
    oval(c, x - 58, y - 16, x + 58, y + 6, '#D0A548', LW * .8)
    line(c, x, y - 8, x, y - 118, 12, INK); line(c, x, y - 8, x, y - 118, 6, '#E3BC5C')
    sh = skia.Path(); sh.moveTo(x - 116, y - 112); sh.cubicTo(x - 96, y - 196, x + 96, y - 196, x + 116, y - 112); sh.close(); shape(c, sh, '#2FA25E', LW)
    hl = skia.Path(); hl.moveTo(x - 82, y - 138); hl.quadTo(x - 50, y - 172, x - 4, y - 174); c.drawPath(hl, ink(7, '#8FE0AE'))
    oval(c, x - 104, y - 122, x + 104, y - 100, '#FFF3B8', LW * .7)
    for i in range(6):
        a = math.radians(60 + i * 12); c.drawLine(x + 70 * math.cos(a), y - 96, x + 150 * math.cos(a), y - 96 + 84 * math.sin(a), ink(2.4, '#FFF6D0', 110))
def table_top(c):  # mesa vista de cima: papel creme com pintas + feltro verde
    c.drawRect(skia.Rect(-900, -700, W + 900, H + 700), sp(radial(960, 520, 1300, [hx('#F6EED4'), hx('#E6DBB8'), hx('#CDBF98')], [0, .6, 1])))
    for (sx, sy, r, a) in SPECK: c.drawCircle(sx, sy, r, fp('#9A8F6E', a))
    for (ya, yb) in ((-700, 64), (1016, H + 700)): c.drawRect(skia.Rect(-900, ya, W + 900, yb), fp('#2F6B45'))
    for yy in (64, 1016): line(c, -900, yy, W + 900, yy, LW)
def sleeve(c, x0, y0, x1, y1, width, v, cuff='#F4EFE2', skin='#E6BE8E', fingers=True, hand_r=None):  # braço visto de cima
    ang = math.degrees(math.atan2(y1 - y0, x1 - x0)); L = math.hypot(x1 - x0, y1 - y0); hr = hand_r or width * .5
    c.save(); c.translate(x0, y0); c.rotate(ang); circ(c, L + hr * .55, 0, hr, skin, LW)
    if fingers:
        for k in (-.42, 0, .42): c.drawLine(L + hr * 1.2, k * hr, L + hr * 1.52, k * hr * 1.1, ink(LW * .8))
    rect(c, -200, -width / 2, L, width / 2, v, LW); rect(c, L - 34, -width / 2 - 5, L + 6, width / 2 + 5, cuff, LW); c.restore()
def cash(c, x, y, rot=0, s=1.0):  # maço de notas genéricas (sem moeda real)
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    for a_ in (-16, -4, 9):
        c.save(); c.rotate(a_); rect(c, -130, -70, 130, 70, '#6FA36A', LW); rect(c, -108, -50, 108, 50, '#84B67E', LW * .5); circ(c, 0, 0, 26, '#6FA36A', LW * .5); c.restore()
    c.restore()
def newspaper(c, x, y, w, h, headline, rot=-4, circle_u=0.0):  # jornal com manchete e círculo de marcador vermelho
    c.save(); c.translate(x, y); c.rotate(rot)
    c.drawRect(skia.Rect(-w/2 + 14, -h/2 + 18, w/2 + 14, h/2 + 18), fp((60, 40, 10), 70, blur=12))
    rect(c, -w/2, -h/2, w/2, h/2, '#F3EEDF', LW)
    label(c, "DIÁRIO", 0, -h/2 + 70, 64, INK, font=MARKER, align='center', skew=0)
    line(c, -w/2 + 30, -h/2 + 92, w/2 - 30, -h/2 + 92, 4)
    hw = label(c, headline, 0, -h/2 + 182, min(72, (w - 80) / max(len(headline), 1) * 1.9), INK, align='center', skew=-0.05)
    for i in range(9):
        yy = -h/2 + 232 + i * 30
        if yy < h/2 - 30: c.drawLine(-w/2 + 34, yy, w/2 - 34 - (i % 3) * 40, yy, ink(5, '#B8B2A0'))
    if circle_u > 0:
        rg = skia.Path(); rg.addArc(skia.Rect(-hw/2 - 40, -h/2 + 112, hw/2 + 40, -h/2 + 212), -100, 352 * ease(min(circle_u, 1))); c.drawPath(rg, ink(12, RED))
    c.restore()

# ---------------- textos e grafismos
def tag(c, s, u, x=70, y=None):  # etiqueta de local (canto inferior esquerdo; mais alta no vertical)
    y = y or (SH * .62 if vertical() else SH - 86)
    a = ease_out(u * 3)
    if a <= 0: return
    w = text_w(s, 44); c.save(); c.translate(-50 * (1 - a), 0)
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(x, y - 52, x + w + 64, y + 18), 10, 10), fp((10, 12, 26), 205 * a))
    c.drawRect(skia.Rect(x, y - 52, x + 10, y + 18), fp(GOLD, 255 * a)); label(c, s, x + 34, y, 44, CREAM, alpha=a, skew=-0.12); c.restore()
def lower_third(c, name, sub, u, x, y):  # nome + subtítulo
    if u <= 0: return
    a = back(min(u * 2.6, 1), 1.4); w = max(text_w(name, 76), text_w(sub, 40), 380)
    c.save(); c.translate(x, y); c.scale(a, a); rect(c, 0, -74, w + 84, 74, (12, 14, 28), LW * .8)
    c.drawRect(skia.Rect(3, -71, 19, 71), fp(GOLD)); label(c, name, 44, 4, 76, CREAM, skew=-0.12); label(c, sub, 46, 54, 40, GOLD, skew=-0.12); c.restore()
def stamp(c, txt, x, y, u, rot=-10, size=150, v=RED):  # carimbo (som: thud; câmera: shake)
    if u <= 0: return
    sc = 2.6 - 1.6 * ease_out(min(u * 5, 1)); a = min(u * 8, 1); w = text_w(txt, size, MARKER)
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc)
    for inset, wd in ((0, 13), (18, 5)):
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-w / 2 - 50 + inset, -size * .98 + inset, w / 2 + 50 - inset, size * .36 - inset), 16, 16), ink(wd, v, 255 * a))
    label(c, txt, 0, 0, size, v, font=MARKER, align='center', skew=0, alpha=a); c.restore()
def poplabel(c, s, x, y, t, t0, size=120, v=LIME, rot=-5, font=None, stroke=15, align='center'):  # rótulo que salta (som: pop)
    pu = pop(K(t, t0, .3))
    if pu <= 0: return
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(pu, pu); label(c, s, 0, 0, size, v, font=font, align=align, stroke=stroke, skew=-0.14); c.restore()
def counter(c, x, y, t, t0, dur, value, fmt="{:,.0f}", size=150, v=LIME, sub=None):  # número que sobe (som: ticks)
    k = ease_out(K(t, t0, dur)); s = fmt.format(value * k).replace(',', '.')
    poplabel(c, s, x, y, t, t0, size, v)
    if sub and t > t0: poplabel(c, sub, x, y + size * .64, t, t0 + .1, size * .52, CREAM, stroke=12)
def wrap(words, size, maxw, font):
    lines = [[]]
    for w in words:
        if lines[-1] and text_w(' '.join(lines[-1] + [w]), size, font) > maxw: lines.append([])
        lines[-1].append(w)
    return lines
def card_text(c, line_txt, t, t0, dur, size=None, color='#FFFFFF'):  # cartão preto (espaço da tela), palavras surgem no ritmo da fala
    c.drawRect(skia.Rect(-SW, -SH, 2 * SW, 2 * SH), fp((0, 0, 0)))
    words = line_txt.split(); tot = sum(len(w) + 1 for w in words); acc = 0; k = 0
    for w in words:
        if t >= t0 + dur * acc / tot - .04: k += 1
        acc += len(w) + 1
    size = size or (140 if SW >= 1600 else 118); maxw = SW - 160
    lines = wrap(words, size, maxw, FONT_HAND)
    while len(lines) > 4 and size > 60: size -= 8; lines = wrap(words, size, maxw, FONT_HAND)
    f = skia.Font(FONT_HAND, size); lh = size * 1.12; y0 = SH / 2 - lh * (len(lines) - 1) / 2 + size * .32; n = 0
    for j, ln in enumerate(lines):
        full = f.measureText(' '.join(ln)); vis = ln[:max(0, k - n)]; n += len(ln)
        if vis: c.drawString(' '.join(vis), SW / 2 - full / 2, y0 + j * lh, f, fp(color))
INTER_B = skia.Typeface.MakeFromFile('/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf') if os.path.exists('/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf') else KALAM
INTER_K = skia.Typeface.MakeFromFile('/usr/share/fonts/opentype/inter/Inter-Black.otf') if os.path.exists('/usr/share/fonts/opentype/inter/Inter-Black.otf') else MARKER
def topo(c, txt, dt):  # etiqueta do assunto da cena, no alto (caixa creme, letra escura)
    k = pop(K(dt, .05, .25))
    if k <= 0: return
    size = 40 * SW / 1080; f = skia.Font(INTER_K, size); w = f.measureText(txt); x, y = SW / 2, SH * .165
    c.save(); c.translate(x, y); c.scale(k, k)
    r = skia.Rect(-w / 2 - 22, -size * .95, w / 2 + 22, size * .42)
    c.drawRect(r.makeOffset(5, 5), fp((0, 0, 0), 120)); c.drawRect(r, fp('#F6EBD2')); c.drawRect(r, ink(5, INK))
    c.drawString(txt, -w / 2, 0, f, fp('#1E1A22')); c.restore()
def legenda(c, txt, t, t0, dur, y=None, estilo=None):  # legenda grande estilo Shorts: 2 a 4 palavras por vez, palavra atual em amarelo
    if not (t0 <= t < t0 + dur): return
    if estilo == 'centro':  # poucas palavras, letra limpa branca, palavra atual amarela, no meio da tela
        words = txt.split(); tot = sum(len(w) + 1 for w in words); acc = 0; starts = []
        for w in words: starts.append(t0 + dur * acc / tot); acc += len(w) + 1
        cur = max(i for i, s0 in enumerate(starts) if s0 <= t) if t >= starts[0] else 0
        g0 = (cur // 3) * 3; grp = words[g0:min(cur + 1, g0 + 3)]; size = 70 * SW / 1080; f = skia.Font(INTER_B, size)
        full = f.measureText(' '.join(grp))
        while full > SW - 140 and size > 36: size -= 4; f = skia.Font(INTER_B, size); full = f.measureText(' '.join(grp))
        x = SW / 2 - full / 2; yy = y or SH * .64
        for i, w in enumerate(grp):
            c.drawString(w, x, yy, f, ink(size * .2, (10, 8, 14))); c.drawString(w, x, yy, f, fp('#FFD23F' if g0 + i == cur else '#FFFFFF')); x += f.measureText(w + ' ')
        return
    words = txt.split(); tot = sum(len(w) + 1 for w in words); acc = 0; starts = []
    for w in words: starts.append(t0 + dur * acc / tot); acc += len(w) + 1
    cur = max(i for i, s0 in enumerate(starts) if s0 <= t) if t >= starts[0] else 0
    g0 = (cur // 3) * 3; grp = words[g0:g0 + 3]; size = 92 if vertical() else 70
    y = y or (SH * .80 if vertical() else SH - 70); f = skia.Font(MARKER, size)
    full = f.measureText(' '.join(grp))
    while full > SW - 120 and size > 40: size -= 6; f = skia.Font(MARKER, size); full = f.measureText(' '.join(grp))
    x = SW / 2 - full / 2
    for i, w in enumerate(grp):
        cw = f.measureText(w + ' '); col_ = '#FFE14A' if g0 + i == cur else '#FFFFFF'
        c.drawString(w, x, y, f, ink(size * .16, INK)); c.drawString(w, x, y, f, fp(col_)); x += cw


def folha_elenco(origem, out, estilo=None, cols=6):
    """Folha com todos os personagens do elenco, com o nome de cada um. origem: roteiro.json, código do editor (.json/.txt) ou dict.
    Use para VER o elenco antes de escrever as cenas e para mostrar ao usuário quem vai no vídeo."""
    import json
    d = origem if isinstance(origem, dict) else json.load(open(origem, encoding='utf8'))
    el = d.get('elenco', d); est = estilo or d.get('estilo', 'noturno'); antes = dict(ST); set_estilo(est)
    n = len(el); rows = (n + cols - 1) // cols; cw, ch = 300, 420
    surf = skia.Surface(cw * cols, ch * rows); c = surf.getCanvas(); c.clear(hx('#2a3470' if ST['luz'] == 'noite' else '#bfe3f6'))
    for i, (nome, sp_) in enumerate(el.items()):
        x = (i % cols) * cw + cw / 2; y = (i // cols) * ch + ch - 50
        draw_char(c, x, y, .66, sp_, face=.25)
        label(c, nome, x, (i // cols) * ch + 38, 34, CREAM, align='center', skew=0, stroke=8)
    ST.clear(); ST.update(antes)
    surf.makeImageSnapshot().save(out, skia.kPNG); return out


# ---------------- cenários prontos por tema (mundo 1920x1080; piso em y=800; pés dos personagens em y~1000 com s=1)
PISO = 800
def _noite(): return ST['luz'] != 'dia'
def _parede(c, cima, baixo, y=PISO):
    c.drawRect(skia.Rect(-900, -700, W + 900, y), sp(linear(0, 0, 0, y, [hx(cima), hx(baixo)])))
def _rodape(c, cor='#F4EFE2', y=PISO):
    c.drawRect(skia.Rect(-900, y - 26, W + 900, y), fp(cor)); line(c, -900, y - 26, W + 900, y - 26, LW * .6); line(c, -900, y, W + 900, y, LW)
def _piso(c, c1, c2, tipo='madeira', y=PISO):
    c.drawRect(skia.Rect(-900, y, W + 900, H + 700), sp(linear(0, y, 0, H + 80, [hx(c1), hx(c2)])))
    if tipo == 'madeira':
        yy, k = y + 22, 0
        while yy < H + 300:
            line(c, -900, yy, W + 900, yy, 2.4, escurecer(c2, .78)); off = (k % 2) * 130
            for xx in range(-900 + off, W + 900, 260 + k * 30): line(c, xx, yy, xx - 10, yy + 22 + k * 7, 2.2, escurecer(c2, .78))
            k += 1; yy += 22 + k * 7
    elif tipo == 'ladrilho':
        for i in range(-14, 15): line(c, 960 + i * 90, y, 960 + i * 240, H + 300, 2.2, escurecer(c2, .8))
        yy, k = y + 30, 0
        while yy < H + 300: line(c, -900, yy, W + 900, yy, 2.2, escurecer(c2, .8)); k += 1; yy += 30 + k * 12
    elif tipo == 'tapete':
        for i in range(60): c.drawCircle((i * 397) % 2400 - 240, y + 20 + (i * 151) % 300, 3, fp(escurecer(c2, .85), 120))
def _ceu_janela(c, x, y, w, h, t, cidade=False):
    c.save(); c.clipRect(skia.Rect(x, y, x + w, y + h))
    if _noite():
        c.drawRect(skia.Rect(x, y, x + w, y + h), sp(linear(0, y, 0, y + h, [hx('#0D1640'), hx('#2C3D8F')])))
        for (sx, sy, r, ph) in STARS[:40]: c.drawCircle(x + sx % w, y + sy % h * .6, r * .8, fp('#E8ECFF', 150 + 80 * math.sin(t * 2.4 + ph)))
        c.drawCircle(x + w * .75, y + h * .25, 22, fp('#F3EDD3'))
    else:
        c.drawRect(skia.Rect(x, y, x + w, y + h), sp(linear(0, y, 0, y + h, [hx('#6CC0F0'), hx('#D8F0FC')])))
        cloud(c, x + w * .3 + (t * 6) % (w * .6), y + h * .3, .7, '#FFFFFF', 230)
    if cidade:
        r = random.Random(4); xx = x - 10
        while xx < x + w:
            bw = r.uniform(50, 90); bh = r.uniform(h * .25, h * .55)
            c.drawRect(skia.Rect(xx, y + h - bh, xx + bw, y + h), fp('#2A3670' if _noite() else '#9DB4D6'))
            for j in range(int(bh // 34)):
                for i in range(int(bw // 26)):
                    if r.random() < .35: c.drawRect(skia.Rect(xx + 8 + i * 26, y + h - bh + 12 + j * 34, xx + 18 + i * 26, y + h - bh + 26 + j * 34), fp('#F2D88C' if _noite() else '#E8F2FF'))
            xx += bw + 6
    c.restore()
def _janela(c, x, y, w, h, t, moldura='#F4EFE2', cortina=None, cidade=False):
    _ceu_janela(c, x, y, w, h, t, cidade)
    p = skia.Path(); p.addRect(skia.Rect(x - 16, y - 16, x + w + 16, y + h + 16)); p.addRect(skia.Rect(x, y, x + w, y + h)); p.setFillType(skia.PathFillType.kEvenOdd)
    c.drawPath(p, fp(moldura)); c.drawPath(p, ink(LW * .8))
    rect(c, x + w / 2 - 6, y, x + w / 2 + 6, y + h, moldura, LW * .5); rect(c, x, y + h / 2 - 6, x + w, y + h / 2 + 6, moldura, LW * .5)
    rect(c, x - 30, y + h + 10, x + w + 30, y + h + 30, moldura, LW * .7)
    if cortina:
        for sx, x0 in ((-1, x - 60), (1, x + w + 60)):
            cp = skia.Path(); cp.moveTo(x0, y - 40); cp.lineTo(x0 - sx * 90, y - 40); cp.cubicTo(x0 - sx * 40, y + h * .4, x0 - sx * 80, y + h * .8, x0 - sx * 50, y + h + 60)
            cp.lineTo(x0, y + h + 60); cp.close(); shape(c, cp, cortina, LW * .8)
            for k in (1, 2): line(c, x0 - sx * 22 * k, y - 30, x0 - sx * 18 * k, y + h + 50, 2.4, escurecer(cortina, .8))
        line(c, x - 170, y - 40, x + w + 170, y - 40, LW * 1.4, '#7A5A3C')
def _quadro(c, x, y, w, h, cores=('#F2C14E', '#E04E3A', '#3E6FA8'), moldura='#7A5A3C'):
    rect(c, x - 12, y - 12, x + w + 12, y + h + 12, moldura, LW * .7); rect(c, x, y, x + w, y + h, '#FFF6DC', LW * .4)
    c.drawCircle(x + w * .32, y + h * .4, min(w, h) * .22, fp(cores[0])); c.drawRect(skia.Rect(x + w * .5, y + h * .3, x + w * .85, y + h * .8), fp(cores[1]))
    c.drawRect(skia.Rect(x + w * .1, y + h * .7, x + w * .6, y + h * .85), fp(cores[2]))
def _planta(c, x, y, s=1.0, vaso='#C8742C'):
    for i, (a, L) in enumerate(((-60, 120), (-30, 150), (0, 165), (28, 145), (58, 115), (-80, 90), (80, 90))):
        rr_ = math.radians(a - 90); ex, ey = x + math.cos(rr_) * L * s, y - 60 * s + math.sin(rr_) * L * s
        lf = skia.Path(); lf.moveTo(x, y - 60 * s); lf.quadTo(x + (ex - x) * .3 - 26 * s, y - 60 * s + (ey - y + 60 * s) * .6, ex, ey)
        lf.quadTo(x + (ex - x) * .7 + 26 * s, y - 60 * s + (ey - y + 60 * s) * .4, x, y - 60 * s); shape(c, lf, '#2F8F57' if i % 2 else '#3DAA66', LW * .6)
    poly(c, [(x - 44 * s, y - 70 * s), (x + 44 * s, y - 70 * s), (x + 34 * s, y), (x - 34 * s, y)], vaso, LW * .8)
def _livros(c, x, y, n=8, seed=1):
    r = random.Random(seed); xx = x
    for i in range(n):
        w = r.uniform(18, 30); h = r.uniform(60, 92); cor = r.choice(['#B23A48', '#3E6FA8', '#2E7D6B', '#F2C14E', '#7A3B5E', '#C8742C', '#5B3E8C'])
        if r.random() < .15: c.save(); c.translate(xx + w, y); c.rotate(-14); rect(c, -w, -h, 0, 0, cor, LW * .45); c.restore(); xx += w + 14
        else: rect(c, xx, y - h, xx + w, y, cor, LW * .45); c.drawLine(xx + 4, y - h + 14, xx + w - 4, y - h + 14, ink(2, '#FFF6DC', 140)); xx += w + 2
    return xx
def _prateleira(c, x, y, w, seed=1, madeira='#9A6A3E'):
    _livros(c, x + 16, y, int(w // 34), seed); rect(c, x, y, x + w, y + 18, madeira, LW * .7)
    for sx in (x + 30, x + w - 46): poly(c, [(sx, y + 18), (sx + 16, y + 18), (sx + 16, y + 44)], escurecer(madeira, .8), LW * .5)
def _relogio(c, x, y, r=46, t=0):
    circ(c, x, y, r + 8, '#3B4660', LW * .8); circ(c, x, y, r, '#FFF6DC', LW * .5)
    for i in range(12): a = math.radians(i * 30); c.drawCircle(x + math.cos(a) * r * .8, y + math.sin(a) * r * .8, 3, fp(INK))
    a = math.radians(t * 6 - 90); line(c, x, y, x + math.cos(a) * r * .75, y + math.sin(a) * r * .75, 3)
    line(c, x, y, x + r * .45, y - r * .2, 5)
def _luminaria_teto(c, x, y, cor='#F2C14E'):
    line(c, x, -700, x, y - 60, 6); sh = skia.Path(); sh.moveTo(x - 70, y); sh.cubicTo(x - 60, y - 70, x + 60, y - 70, x + 70, y); sh.close(); shape(c, sh, cor, LW * .8)
    c.drawOval(skia.Rect(x - 40, y - 8, x + 40, y + 12), fp('#FFF3B8'))
def _mesa(c, x0, x1, y, alt=150, cor='#9A6A3E'):  # mesa com tampo em y, pés até y+alt
    rect(c, x0, y, x1, y + 22, cor, LW * .8)
    for xx in (x0 + 22, x1 - 42): rect(c, xx, y + 22, xx + 20, y + alt, escurecer(cor, .8), LW * .6)
def _monitor(c, x, y, w=220, h=140, t=0, tela='#2A3670'):
    rect(c, x - 18, y + h + 4, x + 18, y + h + 34, '#3B4660', LW * .6); rect(c, x - 60, y + h + 30, x + 60, y + h + 42, '#3B4660', LW * .6)
    rect(c, x - w / 2, y, x + w / 2, y + h, '#1C1F2E', LW * .8, r=10); rect(c, x - w / 2 + 12, y + 12, x + w / 2 - 12, y + h - 12, tela, 0, r=4)
    for i in range(5):  # gráfico subindo
        bh = 18 + i * 14 + 6 * math.sin(t * 2 + i); c.drawRect(skia.Rect(x - w / 2 + 30 + i * 34, y + h - 22 - bh, x - w / 2 + 52 + i * 34, y + h - 22), fp('#3DFF8F' if i == 4 else '#8FC8EE'))
def _luz_interna(c, pts, amb='#6A6FB0'):
    night(c, [('pool', x, y, r, a) for (x, y, r, a) in pts], amb)


def _escritorio(c, t):
    _parede(c, '#DCE6F2', '#C3D2E6'); _janela(c, 180, 150, 420, 400, t, cidade=True)
    _quadro(c, 760, 210, 200, 140); _relogio(c, 1120, 210, t=t)
    rect(c, 1300, 150, 1760, 470, '#FFFFFF', LW * .8, r=8)  # quadro branco com gráfico
    pg = skia.Path(); pg.moveTo(1340, 430)
    for i, v in enumerate((380, 400, 340, 350, 280, 300, 220)): pg.lineTo(1340 + i * 64, v)
    c.drawPath(pg, ink(7, '#2FA25E')); line(c, 1340, 440, 1730, 440, 3); line(c, 1340, 440, 1340, 190, 3)
    _rodape(c, '#3B4660'); _piso(c, '#8E9AB0', '#6D7990', 'tapete')
    _mesa(c, 1180, 1820, 720, 230, '#B9874F'); _monitor(c, 1500, 550, t=t); _planta(c, 120, 900, 1.0)
    rect(c, 1240, 660, 1380, 720, '#E04E3A', LW * .6, r=6)  # pasta
def _sala(c, t):
    _parede(c, '#F2D9B8', '#E5C49B'); _janela(c, 1260, 170, 360, 360, t, cortina='#B23A48')
    _quadro(c, 300, 200, 260, 180, ('#2E7D6B', '#F2C14E', '#B23A48')); _quadro(c, 640, 240, 140, 140, ('#3E6FA8', '#E04E3A', '#F2C14E'))
    _rodape(c); _piso(c, '#B9874F', '#8E6338', 'madeira')
    c.drawOval(skia.Rect(260, 900, 1660, 1060), fp('#7A3B5E')); c.drawOval(skia.Rect(320, 920, 1600, 1040), fp('#9A4E76'))
    # sofá
    rect(c, 160, 600, 900, 820, '#3E6FA8', LW, r=40); rect(c, 120, 680, 220, 860, '#355F94', LW, r=30); rect(c, 840, 680, 940, 860, '#355F94', LW, r=30)
    rect(c, 200, 720, 880, 830, '#4A7FBC', LW * .8, r=20); line(c, 540, 720, 540, 830, LW * .6)
    for xx in (180, 860): rect(c, xx, 850, xx + 26, 890, '#5B3E2C', LW * .5)
    rect(c, 280, 640, 400, 730, '#F2C14E', LW * .7, r=20)  # almofada
    line(c, 1780, 820, 1780, 420, 8); poly(c, [(1720, 420), (1840, 420), (1810, 330), (1750, 330)], '#F4EFE2', LW * .8); _planta(c, 1060, 840, .9)
def _cozinha(c, t):
    _parede(c, '#E8F1EC', '#D3E4DA')
    c.save(); c.clipRect(skia.Rect(-900, 380, W + 900, 610))  # azulejos
    for i in range(-20, 50):
        for j in range(5): rect(c, i * 60 + (j % 2) * 30, 380 + j * 48, i * 60 + (j % 2) * 30 + 58, 380 + j * 48 + 46, '#BFE3F6' if (i + j) % 3 else '#8FC8EE', 1.6)
    c.restore()
    for x in range(-240, 1300, 230): rect(c, x, 90, x + 220, 340, '#F4EFE2', LW * .8, r=8); rect(c, x + 96, 290, x + 126, 300, '#B9874F', 0)
    _janela(c, 1500, 120, 300, 260, t)
    _rodape(c, '#2E7D6B'); _piso(c, '#E6DBB8', '#C9BC92', 'ladrilho')
    rect(c, -200, 610, 1480, 680, '#F4EFE2', LW, r=6); rect(c, -200, 680, 1480, 900, '#2E7D6B', LW)
    for x in range(-180, 1480, 240): rect(c, x, 700, x + 220, 880, '#358C78', LW * .6, r=6); rect(c, x + 96, 720, x + 126, 732, '#F4EFE2', 0)
    oval(c, 480, 560, 640, 616, '#3B4660', LW * .8); rect(c, 486, 520, 634, 600, '#B23A48', LW * .8, r=12)  # panela
    for i in range(3): s_ = skia.Path(); x0 = 520 + i * 40; s_.moveTo(x0, 500); s_.cubicTo(x0 - 16, 470 - 6 * math.sin(t * 3 + i), x0 + 16, 450, x0, 420); c.drawPath(s_, ink(4, '#FFFFFF', 150))
    rect(c, 1560, 380, 1860, 900, '#DADDE6', LW, r=24); line(c, 1560, 560, 1860, 560, LW * .7); rect(c, 1590, 440, 1606, 520, '#8A8A92', 0); rect(c, 1590, 600, 1606, 700, '#8A8A92', 0)
    _planta(c, 1280, 612, .55, '#E04E3A')
def _quarto(c, t):
    _parede(c, '#D9CCF2', '#C2B2E6'); _janela(c, 1340, 170, 340, 330, t, cortina='#F2C14E')
    for i, (x, y, cor) in enumerate(((240, 200, '#E04E8A'), (420, 240, '#3E6FA8'))): rect(c, x, y, x + 140, y + 190, cor, LW * .7); c.drawCircle(x + 70, y + 80, 40, fp('#FFF6DC')); line(c, x + 20, y + 160, x + 120, y + 160, 5, '#FFF6DC')
    _rodape(c); _piso(c, '#B9874F', '#8E6338', 'madeira'); c.drawOval(skia.Rect(500, 940, 1500, 1060), fp('#5B8DD6'))
    rect(c, 600, 420, 1180, 640, '#7A5A3C', LW, r=24)  # cabeceira
    rect(c, 580, 620, 1220, 820, '#F4EFE2', LW, r=20); rect(c, 580, 700, 1220, 840, '#5B3E8C', LW, r=16); rect(c, 640, 600, 860, 680, '#FFFFFF', LW * .7, r=26)
    for xx in (600, 1180): rect(c, xx, 830, xx + 24, 870, '#5B3E2C', LW * .5)
    rect(c, 1240, 660, 1400, 840, '#9A6A3E', LW); line(c, 1240, 740, 1400, 740, LW * .6); circ(c, 1320, 700, 8, GOLD, 2)
    line(c, 1320, 660, 1320, 560, 6); poly(c, [(1270, 560), (1370, 560), (1350, 490), (1290, 490)], '#F2C14E', LW * .8)
    _prateleira(c, 140, 560, 300, seed=3)
def _sala_aula(c, t):
    _parede(c, '#F2E3B8', '#E5D19B'); rect(c, 380, 140, 1540, 600, '#2F5E46', LW * 1.2, r=6); rect(c, 360, 600, 1560, 626, '#9A6A3E', LW * .8)
    for (x0, y0, x1, y1) in ((440, 220, 700, 220), (440, 280, 640, 280), (440, 340, 680, 340)): line(c, x0, y0, x1, y1, 5, '#F4EFE2')
    pg = skia.Path(); pg.moveTo(900, 520); pg.lineTo(1000, 440); pg.lineTo(1090, 480); pg.lineTo(1220, 300); c.drawPath(pg, ink(6, '#F2C14E'))
    c.drawCircle(1360, 330, 80, ink(5, '#F4EFE2')); line(c, 1360, 250, 1360, 410, 4, '#F4EFE2'); line(c, 1280, 330, 1440, 330, 4, '#F4EFE2')
    _relogio(c, 1720, 200, t=t); _rodape(c, '#7A5A3C'); _piso(c, '#C9BC92', '#A89A70', 'ladrilho')
    for x in (60, 1640): _mesa(c, x, x + 260, 700, 160, '#C8742C'); rect(c, x + 60, 640, x + 200, 700, '#3E6FA8', LW * .6, r=6)
    _prateleira(c, 40, 380, 280, seed=5)
def _consultorio(c, t):
    _parede(c, '#E6F6F4', '#C8EAE6'); c.drawRect(skia.Rect(-900, 520, W + 900, PISO), fp('#A6DCD6'))
    rect(c, 240, 160, 400, 320, '#FFFFFF', LW * .8, r=16); rect(c, 300, 180, 340, 300, '#E04E3A', 0); rect(c, 260, 220, 380, 260, '#E04E3A', 0)
    rect(c, 1380, 140, 1640, 460, '#FFFFFF', LW * .8, r=8)  # cartaz de exame
    for i, w_ in enumerate((180, 140, 100, 70, 44)): line(c, 1510 - w_ / 2, 190 + i * 56, 1510 + w_ / 2, 190 + i * 56, 16 - i * 2.4, '#3B4660')
    _rodape(c, '#2E7D6B'); _piso(c, '#DCE6F2', '#B7C6DC', 'ladrilho')
    rect(c, 620, 600, 1220, 680, '#2FA8A0', LW, r=20); rect(c, 620, 560, 760, 610, '#FFFFFF', LW * .7, r=20)
    for xx in (660, 1160): rect(c, xx, 680, xx + 20, 840, '#8A8A92', LW * .6)
    rect(c, 1700, 520, 1880, 860, '#F4F4F0', LW); line(c, 1700, 690, 1880, 690, LW * .6); _planta(c, 140, 860, .9, '#2E7D6B')
def _loja(c, t):
    _parede(c, '#FCE7D2', '#F4D2B0')
    for (y0) in (230, 420, 610):
        rect(c, 60, y0, 860, y0 + 16, '#9A6A3E', LW * .6); r = random.Random(y0)
        for i in range(12):
            x = 80 + i * 64; h = r.uniform(60, 130); cor = r.choice(['#E04E3A', '#3E6FA8', '#F2C14E', '#2E7D6B', '#E04E8A', '#5B3E8C'])
            rect(c, x, y0 - h, x + 52, y0, cor, LW * .45, r=6); c.drawRect(skia.Rect(x + 8, y0 - h * .6, x + 44, y0 - h * .35), fp('#FFF6DC', 200))
    rect(c, 1100, 120, 1760, 230, '#E04E3A', LW, r=14); label(c, 'OFERTAS', 1430, 200, 76, '#FFF6DC', MARKER, 'center')
    _rodape(c, '#B23A48'); _piso(c, '#E6DBB8', '#C9BC92', 'ladrilho')
    rect(c, 1120, 560, 1800, 860, '#2E7D6B', LW, r=10); rect(c, 1100, 540, 1820, 580, '#F4EFE2', LW, r=8)
    rect(c, 1520, 420, 1720, 540, '#3B4660', LW, r=10); rect(c, 1550, 440, 1690, 490, '#8FFFC0', LW * .5, r=4); label(c, '49,90', 1620, 482, 38, '#18402A', KALAM, 'center')
    rect(c, 1240, 470, 1400, 540, '#F2C14E', LW * .7, r=8)
def _banco(c, t):
    _parede(c, '#EDE6D6', '#D9CFB8')
    for x in (120, 620, 1300, 1800):
        rect(c, x - 60, 120, x + 60, PISO - 26, '#F4EFE2', LW); [line(c, x + d, 150, x + d, PISO - 56, 2.4, '#CFC6AE') for d in (-30, 0, 30)]
        rect(c, x - 80, 100, x + 80, 140, '#E5DCC4', LW * .8); rect(c, x - 80, PISO - 56, x + 80, PISO - 26, '#E5DCC4', LW * .8)
    rect(c, 760, 120, 1160, 220, '#1F4E79', LW, r=10); label(c, 'BANCO', 960, 196, 72, '#F2C14E', MARKER, 'center')
    circ(c, 960, 470, 170, '#9AA3B5', LW * 1.2); circ(c, 960, 470, 130, '#B9C1D0', LW * .8)  # cofre
    for i in range(6): a = math.radians(i * 60 + t * 20); line(c, 960, 470, 960 + math.cos(a) * 90, 470 + math.sin(a) * 90, 10, '#5D6678')
    circ(c, 960, 470, 34, '#5D6678', LW * .7)
    _rodape(c, '#5D6678'); _piso(c, '#D9CFB8', '#B8AC8E', 'ladrilho')
    rect(c, -200, 640, 560, 880, '#7A5A3C', LW); rect(c, -220, 620, 580, 650, '#F4EFE2', LW)
    rect(c, 1360, 640, 2100, 880, '#7A5A3C', LW); rect(c, 1340, 620, 2120, 650, '#F4EFE2', LW)
def _arvore(c, x, y, s=1.0, cor='#3DAA66'):
    rect(c, x - 18 * s, y - 200 * s, x + 18 * s, y, '#7A5A3C', LW * .8)
    p = skia.Path()
    for dx, dy, r in ((-70, -230, 80), (0, -300, 95), (70, -230, 80), (-30, -200, 70), (40, -190, 70)): p.addCircle(x + dx * s, y + dy * s, r * s)
    c.drawPath(p, ink(LW * 2)); c.drawPath(p, fp(cor))
    for dx, dy in ((-40, -280), (30, -320), (60, -240)): c.drawCircle(x + dx * s, y + dy * s, 16 * s, fp(clarear(cor, .3) if not _noite() else escurecer(cor, .8)))
def _parque(c, t):
    sky(c, '#0A1136', '#26358C', 700); stars(c, t); moon(c, 1560, 160, 40); cloud(c, 500 + t * 8, 200, 1.1, '#FFFFFF' if not _noite() else '#2C3B80')
    for (x, r, cor) in ((300, 700, '#5FAF5A'), (1400, 820, '#4E9E4A')):
        c.drawCircle(x, 760 + r * .8, r, fp(cor if not _noite() else escurecer(cor, .55)))
    c.drawRect(skia.Rect(-900, 760, W + 900, H + 700), fp('#6CC06A' if not _noite() else '#3C6E44')); line(c, -900, 760, W + 900, 760, LW * .6)
    pth = skia.Path(); pth.moveTo(700, 760); pth.lineTo(1100, 760); pth.lineTo(1500, H + 200); pth.lineTo(300, H + 200); pth.close(); c.drawPath(pth, fp('#E6D3A3' if not _noite() else '#9C8E6E'))
    _arvore(c, 180, 800, 1.1); _arvore(c, 1680, 790, 1.0, '#2F8F57'); _arvore(c, 560, 770, .6)
    rect(c, 1240, 700, 1560, 730, '#B9874F', LW * .8, r=4); rect(c, 1240, 650, 1560, 680, '#B9874F', LW * .8, r=4)
    for xx in (1260, 1520): rect(c, xx, 730, xx + 20, 800, '#3B4660', LW * .6)
    for i, (x, y) in enumerate(((420, 900), (1700, 960), (900, 1000))): [circ(c, x + dx, y, 9, cor_, 2) for dx, cor_ in ((0, '#F2C14E'), (22, '#E04E8A'), (44, '#FFFFFF'))]
    if _noite(): street_lamp(c, 1000, 762, 400)
def _praia(c, t):
    sky(c, '#0A1136', '#3A4A9C', 600); stars(c, t); moon(c, 1460, 200, 60)
    mar = '#2FA8D8' if not _noite() else '#1E3C7A'
    c.drawRect(skia.Rect(-900, 560, W + 900, 820), fp(mar)); line(c, -900, 560, W + 900, 560, LW * .6)
    for j in range(4):
        y = 600 + j * 52; p = skia.Path(); p.moveTo(-900, y)
        for x in range(-900, W + 960, 60): p.quadTo(x + 15, y - 10 + 3 * math.sin(t * 2 + j), x + 30, y); p.quadTo(x + 45, y + 10, x + 60, y)
        c.drawPath(p, ink(3, '#FFFFFF', 150))
    sd = skia.Path(); sd.moveTo(-900, 820); sd.lineTo(W + 900, 780); sd.lineTo(W + 900, H + 700); sd.lineTo(-900, H + 700); sd.close(); c.drawPath(sd, fp('#F2D8A0' if not _noite() else '#A8956C'))
    p = skia.Path(); p.moveTo(-900, 820)
    for x in range(-900, W + 960, 120): p.quadTo(x + 60, 836 - (x + 900) * .02, x + 120, 820 - (x + 1020) * 40 / 2700)
    c.drawPath(p, ink(10, '#FFFFFF', 180))
    # coqueiro
    tr = skia.Path(); tr.moveTo(1640, 960); tr.cubicTo(1620, 760, 1660, 560, 1740, 380); c.drawPath(tr, ink(46)); c.drawPath(tr, ink(34, '#9A6A3E'))
    for a in (-160, -120, -60, -20, 30):
        r_ = math.radians(a); lf = skia.Path(); lf.moveTo(1740, 380); ex, ey = 1740 + math.cos(r_) * 240, 380 + math.sin(r_) * 120 + 90
        lf.quadTo((1740 + ex) / 2, 300 + (ey - 380) * .2 - 40, ex, ey); lf.quadTo((1740 + ex) / 2, 380 + (ey - 380) * .5, 1740, 380); shape(c, lf, '#2F8F57', LW * .7)
    for i in range(2): circ(c, 1726 + i * 26, 400, 18, '#7A5A3C', LW * .6)
    # guarda-sol
    line(c, 300, 1000, 330, 640, 8); um = skia.Path(); um.moveTo(130, 700); um.cubicTo(180, 540, 460, 520, 540, 660); um.close(); shape(c, um, '#E04E3A', LW)
    c.save(); c.clipPath(um, doAntiAlias=True); [c.drawRect(skia.Rect(x, 500, x + 50, 720), fp('#FFF6DC')) for x in (200, 300, 400)]; c.restore(); c.drawPath(um, ink(LW))
def _tech(c, t):
    c.drawRect(skia.Rect(-900, -700, W + 900, PISO), sp(linear(0, 0, 0, PISO, [hx('#1B1440'), hx('#2C2068')])))
    for i in range(-10, 30): line(c, i * 120, -700, i * 120, PISO, 1.4, '#3A2E80')
    for x in (60, 300, 1620):  # racks de servidor
        rect(c, x, 200, x + 200, PISO - 10, '#151231', LW)
        for j in range(9):
            rect(c, x + 16, 230 + j * 60, x + 184, 270 + j * 60, '#221D4A', LW * .4, r=4)
            for k in range(3): c.drawCircle(x + 40 + k * 18, 250 + j * 60, 5, fp(('#3DFF8F', '#2FA8FF', '#C9B6FF')[(j + k + int(t * 3)) % 3] if (j * 7 + k + int(t * 4)) % 5 else '#3B3570'))
    rect(c, 640, 150, 1500, 600, '#0E0B26', LW * 1.2, r=16); rect(c, 670, 180, 1470, 570, '#14103A', 0, r=8)
    for i in range(7): line(c, 710, 230 + i * 44, 710 + 120 + (i * 137) % 380, 230 + i * 44, 10, ('#3DFF8F', '#2FA8FF', '#C9B6FF')[i % 3], 220)
    pg = skia.Path(); pg.moveTo(1150, 520)
    for i, v in enumerate((480, 500, 430, 450, 360, 380, 260)): pg.lineTo(1150 + i * 46, v - 6 * math.sin(t * 2 + i))
    c.drawPath(pg, ink(7, '#3DFF8F'))
    c.drawRect(skia.Rect(640, 590, 1500, 610), fp('#8C5CF0', 120, blur=12))
    c.drawRect(skia.Rect(-900, PISO, W + 900, H + 700), sp(linear(0, PISO, 0, H, [hx('#2A1F5E'), hx('#140E33')])))
    for i in range(-14, 15): line(c, 960 + i * 90, PISO, 960 + i * 260, H + 300, 1.6, '#4A3C9C')
    line(c, -900, PISO, W + 900, PISO, LW * .6, '#8C5CF0')
def _cidade(c, t):
    sky(c, '#0A1136', '#26358C', 760); stars(c, t); moon(c, 1500, 150, 36); cloud(c, 700 + t * 8, 220, 1.0, '#FFFFFF' if not _noite() else '#2C3B80')
    blur_begin(c, 2.0); far_city(c, 660, 8, '#1E2A68' if _noite() else '#8FA6CC'); c.restore()
    for (x, w, h, sd) in ((-90, 300, 500, 21), (210, 240, 410, 22), (1180, 250, 380, 23), (1660, 250, 400, 24), (1900, 260, 470, 25)):
        if _noite(): building(c, x, w, h, 760, sd, lit=.34, body='#222E66', dim='#2C3A80')
        else: building(c, x, w, h, 760, sd, lit=.0, body='#E8B48A' if sd % 2 else '#9CB8D8', roof='#7A5A3C', dim='#CDE6F6')
    c.drawRect(skia.Rect(-900, 760, W + 900, 840), fp('#9A9AA8' if not _noite() else '#444B70')); line(c, -900, 760, W + 900, 760, LW); line(c, -900, 840, W + 900, 840, LW)
    c.drawRect(skia.Rect(-900, 840, W + 900, H + 600), fp('#6A6E80' if not _noite() else '#30365A'))
    for x in range(-200, W + 200, 260): c.drawRect(skia.Rect(x, 950, x + 140, 966), fp('#F4EFE2', 200))
    street_lamp(c, 560, 842, 330)

CENARIOS = {'escritorio': _escritorio, 'sala': _sala, 'cozinha': _cozinha, 'quarto': _quarto, 'sala_aula': _sala_aula, 'consultorio': _consultorio,
            'loja': _loja, 'banco': _banco, 'parque': _parque, 'praia': _praia, 'tech': _tech, 'cidade': _cidade}
# luzes de cada cenário no estilo noturno (no estilo de dia não escurece nada)
_LUZES = {'escritorio': [(390, 350, 420, .7), (1500, 600, 520, .85), (960, 900, 900, .6)], 'sala': [(1780, 380, 520, .9), (560, 760, 700, .6), (1440, 350, 380, .6)],
          'cozinha': [(560, 500, 560, .8), (1650, 250, 380, .6), (960, 900, 800, .5)], 'quarto': [(1320, 520, 560, .9), (1500, 330, 360, .6), (800, 900, 700, .4)],
          'sala_aula': [(960, 380, 900, .75), (960, 900, 900, .5)], 'consultorio': [(960, 300, 1000, .8), (960, 900, 900, .6)], 'loja': [(500, 400, 700, .7), (1460, 500, 700, .8)],
          'banco': [(960, 400, 900, .8), (960, 900, 900, .5)], 'parque': [(1000, 500, 520, .9), (860, 820, 560, .55)], 'praia': [(1460, 300, 600, .6), (860, 800, 620, .6)], 'tech': [(1070, 380, 800, .8), (960, 900, 900, .5)],
          'cidade': [(560, 700, 600, .9)]}
TEMAS = {  # tema do vídeo -> cenários que combinam (o primeiro é o principal)
    'financas': ['escritorio', 'banco', 'loja', 'sala'], 'golpe': ['cidade', 'escritorio', 'banco', 'loja'], 'tecnologia': ['tech', 'escritorio', 'sala', 'quarto'],
    'ia': ['tech', 'escritorio', 'sala_aula', 'quarto'], 'educacao': ['sala_aula', 'quarto', 'sala'], 'saude': ['consultorio', 'cozinha', 'parque'],
    'alimentacao': ['cozinha', 'loja', 'sala'], 'familia': ['sala', 'cozinha', 'quarto', 'parque'], 'motivacao': ['parque', 'praia', 'escritorio'],
    'humor': ['sala', 'cozinha', 'parque', 'loja'], 'triste': ['quarto', 'sala', 'cidade'], 'historia': ['cidade', 'parque', 'sala'], 'misterio': ['cidade', 'tech', 'quarto'],
    'viagem': ['praia', 'cidade', 'parque'], 'trabalho': ['escritorio', 'tech', 'loja'], 'compras': ['loja', 'cidade', 'banco'], 'relacionamento': ['sala', 'parque', 'praia', 'cozinha'],
    'esporte': ['parque', 'praia'], 'infantil': ['quarto', 'parque', 'sala_aula'], 'casa': ['sala', 'cozinha', 'quarto']}
def cenario(c, nome, t=0.0, luz=True):
    """Desenha um cenário pronto (fundo inteiro). luz=False deixa para chamar cenario_luz() depois dos personagens."""
    CENARIOS[nome](c, t)
    if luz: cenario_luz(c, nome)
def cenario_luz(c, nome):  # escurece o cenário no estilo noturno, com poças de luz (chame depois dos personagens para iluminá-los junto)
    _luz_interna(c, _LUZES.get(nome, [(960, 540, 900, .6)]), '#5A69B6' if nome in ('cidade', 'parque', 'praia') else '#7C7FC4')
def cenario_fundo(c, nome, t=0.0, dx=0, desfoque=13):  # fundo desfocado para closes (como fundo_close)
    blur_begin(c, desfoque); c.save(); c.translate(dx, -260); c.scale(1.5, 1.5); cenario(c, nome, t, luz=False); c.restore(); c.restore()
    cenario_luz(c, nome)
def cenarios_do_tema(tema):
    t = tema.lower()
    for k, v in TEMAS.items():
        if k in t: return v
    return ['sala', 'escritorio', 'cidade']


if __name__ == '__main__':  # python3 kit.py elenco roteiro.json saida.png
    import sys
    if len(sys.argv) > 3 and sys.argv[1] == 'elenco': print(folha_elenco(sys.argv[2], sys.argv[3]))
