"""Mixagem: cadeia de voz, trilha original sintetizada, efeitos sintetizados, ducking e -14 LUFS.
Chamado por: python3 cenas.py audio   (usa a linha do tempo do Video)
"""
import os, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, lfilter, fftconvolve

SR = 48000
rng = np.random.default_rng(5)


def bq(x, kind, f, q=0.707, gain=0.0):
    w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q); A = 10 ** (gain / 40); cw = np.cos(w)
    if kind == 'peak': b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == 'hs':
        s = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + s), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - s)]
        a = [(A + 1) - (A - 1) * cw + s, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - s]
    else:  # 'ls'
        s = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + s), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - s)]
        a = [(A + 1) + (A - 1) * cw + s, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - s]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
def lp(x, fc, o=2): b, a = butter(o, fc / (SR / 2), 'low'); return lfilter(b, a, x)
def hp(x, fc, o=2): b, a = butter(o, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def bp(x, f1, f2): b, a = butter(2, [f1 / (SR / 2), f2 / (SR / 2)], 'band'); return lfilter(b, a, x)


def comp(x, thr_db=-22, ratio=3.2, att=0.004, rel=0.12, makeup=4.0):
    env = np.zeros(len(x)); e = 0.0; a_ = np.exp(-1 / (att * SR)); r_ = np.exp(-1 / (rel * SR)); ax = np.abs(x)
    for i in range(len(x)):
        v = ax[i]; e = a_ * e + (1 - a_) * v if v > e else r_ * e + (1 - r_) * v; env[i] = e
    over = np.maximum(20 * np.log10(env + 1e-9) - thr_db, 0)
    return x * 10 ** ((-over * (1 - 1 / ratio) + makeup) / 20)
def deess(x, amt=0.55):
    s = hp(x, 5200); env = lp(np.abs(s), 60); g = 1 - amt * np.clip(env / (env.max() + 1e-9) * 2.2, 0, 1); return (x - s) + s * g
def room_ir(dur=0.28, bright=5000, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t * 22)[:, None]; ir[:int(.004 * SR)] = 0
    ir = np.stack([lp(ir[:, 0], bright), lp(ir[:, 1], bright)], 1); return ir / np.sqrt((ir ** 2).sum(0))
def voice_chain(s, sr, narrator=True, externo=False):
    s = resample_poly(s, SR, sr) if sr != SR else s
    if externo: return hp(s, 60)  # áudio externo já vem tratado: só tira o ronco; o volume final vem do loudnorm
    s = s / (np.abs(s).max() + 1e-9) * 0.7
    s = hp(s, 72); s = bq(s, 'peak', 280, 1.0, -2.0); s = bq(s, 'ls', 130, 0.7, 1.5 if narrator else 0)
    s = bq(s, 'peak', 3400, 0.9, 2.5); s = bq(s, 'hs', 8500, 0.7, 3.0); return comp(deess(s))
def place(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414; x = np.stack([x * l, x * r], 1)
    j = min(i + len(x), len(buf))
    if 0 <= i < len(buf): buf[i:j] += x[:j - i] * gain


# ---------------- trilha (original)
hz = lambda n: 440 * 2 ** ((n - 69) / 12)
def pluck(f, dur=0.34, amp=0.5, decay=10):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * decay) * (1 - np.exp(-t * 500))
    return amp * env * (np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .22 * np.sin(6 * np.pi * f * t) + .1 * np.sin(8 * np.pi * f * t))
def bass(f, dur=0.42, amp=0.6):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * 6) * (1 - np.exp(-t * 300))
    return amp * env * lp(np.sin(2 * np.pi * f * t) + .6 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t), 900)
def vibes(f, dur=0.9, amp=0.2):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * 4.5) * (1 - np.exp(-t * 900))
    return amp * env * (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 14)) * (1 + .25 * np.sin(2 * np.pi * 5.5 * t))
def accordion(freqs, dur, amp=0.05):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs:
        for d in (-1.8, 0, 2.1):
            ph = ((f + d) * t) % 1; out += (2 * ph - 1) + .5 * np.sign(np.sin(2 * np.pi * (f + d) * t))
    env = np.minimum(1, t / .12) * np.minimum(1, (dur - t) / .2) * (1 + .12 * np.sin(2 * np.pi * 5 * t))
    return amp * bp(out, 300, 3200) * env / len(freqs)
def brush(amp=0.06, dur=0.07): n = int(dur * SR); return amp * hp(rng.standard_normal(n), 5500) * np.exp(-np.arange(n) / SR * 55)
def kick(amp=0.4): n = int(.22 * SR); t = np.arange(n) / SR; return amp * np.sin(2 * np.pi * (48 + 70 * np.exp(-t * 34)) * t) * np.exp(-t * 15)

MOODS = {  # (bpm, [(baixo, acorde)], caminhada do baixo, motivos de vibrafone)
    'misterio': (104, [(45, [57, 60, 64]), (41, [53, 57, 60]), (38, [50, 53, 57]), (40, [52, 56, 59])],
                 [[0, 3, 7, 3], [0, 4, 7, 4], [0, 3, 7, 10], [0, 4, 7, 11]],
                 [[76, None, 75, 76, None, 72, None, None], [None, 69, None, 72, 71, None, 69, None], [77, None, 76, 74, None, 72, None, 74], [None, 71, 72, None, 76, None, 80, None]]),
    'leve': (112, [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [53, 57, 60]), (43, [55, 59, 62])],
             [[0, 4, 7, 4], [0, 3, 7, 3], [0, 4, 7, 9], [0, 4, 7, 11]],
             [[76, None, 79, None, 76, 74, None, 72], [None, 72, None, 76, 74, None, 72, None], [77, None, 76, 72, None, 69, None, 72], [None, 74, 76, None, 79, None, 83, None]]),
}


def music(N, mood='misterio', mutes=(), cut_at=None):
    bpm, prog, walk, motifs = MOODS[mood]; beat = 60 / bpm; e8 = beat / 2; bar = 4 * beat
    m = np.zeros((N + 2 * SR, 2)); t = 0.0; bi = 0; END = N / SR
    while t < END:
        root, ch = prog[bi % 4]
        if not any(t + bar * .5 > a and t < b - .1 for a, b in mutes):
            place(m, accordion([hz(n) for n in ch], bar * .98, 0.05), t, 1.0, -0.2)
            for i, off in enumerate(walk[bi % 4]): place(m, bass(hz(root + off), beat * .95, .55), t + i * beat)
            for i in (1, 3): place(m, sum(pluck(hz(n + 12), .2, .18) for n in ch), t + i * beat, 1.0, 0.25)
            for i, n in enumerate(motifs[bi % 4]):
                if n: place(m, vibes(hz(n), .8, .15), t + i * e8, 1.0, -0.3 + .08 * i)
            for i in range(8): place(m, brush(.07 if i % 2 == 0 else .04), t + i * e8 + (0.03 if i % 2 else 0), 1.0, 0.3)
            for i in (0, 2): place(m, kick(.32), t + i * beat)
        t += bar; bi += 1
    m = m[:N]; tt = np.arange(N) / SR; g = np.ones(N)
    for a, b in mutes: g[(tt > a - .05) & (tt < b)] = 0.0
    g = lp(g, 10, 1); m *= g[:, None]; m *= np.minimum(1, tt / .25)[:, None]
    if cut_at is not None: m *= np.clip(1 - (tt - cut_at) / .08, 0, 1)[:, None]
    for a, b in mutes:  # nota grave sustentada sob o cartão preto
        n_ = int((b - a) * SR); t_ = np.arange(n_) / SR
        place(m, lp(np.sin(2 * np.pi * 55 * t_) + .4 * np.sin(2 * np.pi * 110.4 * t_) + .2 * np.sin(2 * np.pi * 164.8 * t_), 500)
              * np.minimum(1, t_ / .3) * np.minimum(1, (b - a - t_) / .3) * .16, a)
    if cut_at is not None:  # acorde final no flash
        root, ch = prog[0]
        for n, pan in ((root, 0), (ch[0], -.3), (ch[2], .3), (ch[1] + 12, -.1)): place(m, vibes(hz(n), 1.6, .22) + pluck(hz(n), 1.6, .2, 4), cut_at, 1.0, pan)
    return m


# ---------------- instrumentos extras e climas por tema
def strings(freqs, dur, amp=0.05):  # cordas: serras desafinadas, ataque lento
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs:
        for d in (-1.2, 0, 1.4): out += 2 * (((f + d) * t) % 1) - 1
    env = np.minimum(1, t / .45) * np.minimum(1, (dur - t) / .4)
    return amp * lp(out, 1800) * env / len(freqs)
def synth_pad(freqs, dur, amp=0.05):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs: out += np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * 1.003 * t)
    env = np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3)
    return amp * lp(out, 1200 + 600 * np.sin(2 * np.pi * .25 * t[0])) * env / len(freqs)
def blip(f, dur=.12, amp=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return amp * lp(np.sign(np.sin(2 * np.pi * f * t)), 3500) * np.exp(-t * 22)
def bell(f, dur=1.0, amp=.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return amp * sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 3), (2.76, .4, 6), (5.4, .2, 10)))
def clap(amp=.25):
    n = int(.15 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 5000)
    return amp * x * (np.exp(-t * 30) + .5 * np.exp(-np.abs(t - .012) * 400))
def hat(amp=.06): n = int(.04 * SR); return amp * hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 120)

# cada clima: bpm, progressão (baixo, acorde), estilo de cada camada, motivo melódico (8 colcheias por compasso)
CLIMAS = {
    'misterio':   dict(nome='Mistério (jazz)', bpm=104),
    'leve':       dict(nome='Leve', bpm=112),
    'tenso':      dict(nome='Tenso / suspense', bpm=84, prog=[(33, [57, 60, 64]), (29, [53, 57, 60]), (26, [50, 53, 57]), (28, [52, 56, 59])],
                       pad='strings', baixo='pulso', perc='coracao', lead='sino', motivo=[[81, None, None, None, 80, None, None, None], [None] * 8, [77, None, None, None, 76, None, None, None], [None] * 8]),
    'epico':      dict(nome='Épico / inspirador', bpm=100, prog=[(36, [60, 64, 67]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])],
                       pad='strings', baixo='raiz', perc='batida', lead='piano', motivo=[[72, 76, 79, 76, 72, 76, 79, 76], [71, 74, 79, 74, 71, 74, 79, 74], [72, 76, 81, 76, 72, 76, 81, 76], [72, 77, 81, 77, 72, 77, 81, 77]]),
    'triste':     dict(nome='Triste / reflexivo', bpm=70, prog=[(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])],
                       pad='strings', baixo='longo', perc=None, lead='piano', motivo=[[69, None, 72, None, 76, None, 72, None], [69, None, 72, None, 77, None, 72, None], [67, None, 72, None, 76, None, 72, None], [67, None, 71, None, 74, None, 71, None]]),
    'divertido':  dict(nome='Divertido', bpm=124, prog=[(48, [60, 64, 67]), (41, [53, 57, 60]), (43, [55, 59, 62]), (48, [60, 64, 67])],
                       pad=None, baixo='saltitante', perc='palmas', lead='sino', motivo=[[84, None, 81, 79, None, 76, None, None], [81, None, 77, None, 76, 77, 81, None], [79, None, 83, None, 86, None, 83, 79], [84, None, None, 79, 84, None, None, None]]),
    'tecnologia': dict(nome='Tecnologia', bpm=112, prog=[(33, [57, 60, 64]), (29, [53, 57, 60]), (36, [55, 60, 64]), (31, [55, 59, 62])],
                       pad='synth', baixo='pulso', perc='batida', lead='arpejo', motivo=None),
}


def music_tema(N, clima, mutes=(), cut_at=None):
    C_ = CLIMAS[clima]; bpm = C_['bpm']; beat = 60 / bpm; e8 = beat / 2; bar = 4 * beat; prog = C_['prog']
    m = np.zeros((N + 2 * SR, 2)); t = 0.0; bi = 0; END = N / SR
    while t < END:
        root, ch = prog[bi % 4]
        if not any(t + bar * .5 > a and t < b - .1 for a, b in mutes):
            if C_['pad'] == 'strings': place(m, strings([hz(n) for n in ch], bar * .99, .06), t, 1.0, -0.15)
            if C_['pad'] == 'synth': place(m, synth_pad([hz(n) for n in ch], bar * .99, .045), t, 1.0, -0.15)
            b_ = C_['baixo']
            if b_ == 'pulso':
                for i in range(8): place(m, bass(hz(root + 12), e8 * .8, .4), t + i * e8)
            elif b_ == 'raiz':
                for i in range(4): place(m, bass(hz(root + 12), beat * .9, .5), t + i * beat)
            elif b_ == 'longo': place(m, bass(hz(root + 12), bar * .95, .45), t)
            elif b_ == 'saltitante':
                for i, off in enumerate((0, 7, 0, 7)): place(m, pluck(hz(root + 12 + off), .22, .5, 14), t + i * beat)
            p_ = C_['perc']
            if p_ == 'batida':
                for i in range(4): place(m, kick(.34), t + i * beat)
                for i in (1, 3): place(m, clap(.18), t + i * beat, 1.0, .1)
                for i in range(8): place(m, hat(.05), t + i * e8 + .01, 1.0, .35)
            elif p_ == 'coracao':
                place(m, kick(.38), t); place(m, kick(.26), t + .22)
            elif p_ == 'palmas':
                for i in (0, 2): place(m, kick(.26), t + i * beat)
                for i in (1, 3): place(m, clap(.2), t + i * beat, 1.0, .1)
            mot = C_['motivo']; ld = C_['lead']
            if ld == 'arpejo':
                for i in range(16):  # arpejo em semicolcheias: sobe e desce o acorde, oitava acima na 2ª metade
                    n = ch[(0, 1, 2, 1)[i % 4]] + 12 + (12 if i >= 8 else 0); place(m, blip(hz(n), .11, .12), t + i * e8 / 2, 1.0, -.3 + .04 * i)
            elif mot:
                for i, n in enumerate(mot[bi % 4]):
                    if not n: continue
                    if ld == 'piano': place(m, pluck(hz(n), .9, .2, 4.5), t + i * e8, 1.0, -.2 + .05 * i)
                    elif ld == 'sino': place(m, bell(hz(n), 1.0, .12), t + i * e8, 1.0, .25)
        t += bar; bi += 1
    m = m[:N]; tt = np.arange(N) / SR; g = np.ones(N)
    for a, b in mutes: g[(tt > a - .05) & (tt < b)] = 0.0
    g = lp(g, 10, 1); m *= g[:, None]; m *= np.minimum(1, tt / .25)[:, None]
    if cut_at is not None: m *= np.clip(1 - (tt - cut_at) / .08, 0, 1)[:, None]
    for a, b in mutes:
        n_ = int((b - a) * SR); t_ = np.arange(n_) / SR; r0 = hz(prog[0][0])
        place(m, lp(np.sin(2 * np.pi * r0 * t_) + .4 * np.sin(2 * np.pi * 2.008 * r0 * t_), 500) * np.minimum(1, t_ / .3) * np.minimum(1, (b - a - t_) / .3) * .16, a)
    if cut_at is not None:
        root, ch = prog[0]
        for n, pan in ((root + 12, 0), (ch[0], -.3), (ch[2], .3), (ch[1] + 12, -.1)): place(m, bell(hz(n), 1.6, .16) + pluck(hz(n), 1.6, .18, 4), cut_at, 1.0, pan)
    return m


def trilha(N, clima, mutes=(), cut_at=None):
    return music(N, clima, mutes, cut_at) if clima in MOODS else music_tema(N, clima, mutes, cut_at)


# ---------------- tema do vídeo: escolhe clima da trilha e efeitos por palavra-chave
def _sem_acento(t):
    import unicodedata
    return ''.join(ch for ch in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(ch) != 'Mn')
TEMAS = {  # tema: (clima, palavras que indicam o tema)
    'golpe':      ('tenso', 'golpe golpista fraude crime policia preso roubo roubou mentira enganou suspeito investigacao'),
    'financas':   ('misterio', 'dinheiro salario reais banco conta divida juros pix cartao boleto investimento economia gasto extrato tarifa compra'),
    'tecnologia': ('tecnologia', 'ia inteligencia artificial app aplicativo celular internet computador robo tecnologia digital software chatgpt'),
    'historia':   ('epico', 'seculo guerra imperio rei rainha antigo historia batalha descobriu'),
    'motivacao':  ('epico', 'sonho conquista vencer superar disciplina sucesso objetivo mudar'),
    'triste':     ('triste', 'morte morreu perda saudade tragedia sozinho luto'),
    'humor':      ('divertido', 'engracado piada divertido ridiculo absurdo'),
    'saude':      ('leve', 'saude corpo sono cerebro ciencia alimentacao agua'),
}
EFEITOS_PALAVRA = [  # (efeito, palavras) — primeiro que casar na fala
    ('kaching', 'dinheiro salario reais pagar pagou pagamento comprar compra preco lucro r$'),
    ('notif', 'celular app aplicativo notificacao mensagem assinatura internet'),
    ('buzzer', 'erro problema golpe perigo cuidado mentira errado nunca'),
    ('relogio', 'tempo dias hora horas relogio mes semana ano anos noite'),
    ('queda', 'cai caiu some sumiu despenca perdeu quebrou desaba'),
    ('subida', 'cresce cresceu subiu aumentou dobrou explodiu'),
    ('brilho', 'ideia segredo descobriu truque solucao hoje'),
]


def detectar_tema(textos):
    t = ' ' + _sem_acento(' '.join(textos)) + ' '; pont = {}
    for tema, (_, pal) in TEMAS.items(): pont[tema] = sum(t.count(' ' + p) for p in pal.split())
    tema = max(pont, key=pont.get)
    return (tema if pont[tema] > 0 else 'financas'), pont


def efeitos_auto(v):
    """[(efeito, tempo)] — um por fala, na palavra-chave, estimando o tempo pela posição do texto."""
    out = []
    for k, t0 in v.cue.items():
        txt = v.txt[k]; base = _sem_acento(txt); dur = v.fala_util(k) if hasattr(v, 'fala_util') else v.dur[k]
        for ef, pal in EFEITOS_PALAVRA:
            hit = [base.find(p) for p in pal.split() if (' ' + base).find(' ' + p) >= 0]
            if hit:
                pos = min(h for h in hit if h >= 0); out.append((ef, t0 + dur * pos / max(len(base), 1) + .05)); break
    return out


# ---------------- efeitos (sintetizados)
def whoosh(dur=0.5):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 600
    for i in range(0, n, seg):
        fc = 350 + 5200 * np.sin(np.pi * i / n) ** 1.3; y = bp(x[i:i + seg], max(fc * .55, 120), min(fc * 1.6, 16000)); out[i:i + len(y)] = y
    return out * np.sin(np.pi * np.arange(n) / n) ** 2 * 1.3
def popfx(f0=340): n = int(.13 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * (f0 + 900 * np.exp(-t * 42)) * t) * np.exp(-t * 34) * .6
def thud(big=True):
    n = int(.7 * SR); t = np.arange(n) / SR
    out = np.sin(2 * np.pi * (42 + 95 * np.exp(-t * 26)) * t) * np.exp(-t * 8) + lp(rng.standard_normal(n), 2800) * np.exp(-t * 38) * .7
    if big: out += hp(rng.standard_normal(n), 3500) * np.exp(-t * 7) * .22
    return out * .9
def tick(): n = int(.016 * SR); return hp(rng.standard_normal(n), 2800) * np.exp(-np.arange(n) / SR * 280) * .5
def ticks(dur=1.1, gap=0.055):
    out = np.zeros(int((dur + .05) * SR))
    for k in range(int(dur / gap)): a = tick(); i = int(k * gap * SR); out[i:i + len(a)] += a
    return out
def step(): n = int(.09 * SR); t = np.arange(n) / SR; return lp(rng.standard_normal(n), 1400) * np.exp(-t * 60) * .8 + np.sin(2 * np.pi * 150 * t) * np.exp(-t * 50) * .5
def steps(k=4, gap=.285):
    out = np.zeros(int((k * gap + .1) * SR))
    for j in range(k): a = step(); i = int(j * gap * SR); out[i:i + len(a)] += a
    return out
def shutter():
    out = np.zeros(int(.45 * SR)); a = tick() * 2.2; out[:len(a)] += a; k = int(.07 * SR); out[k:k + len(a)] += a
    t = np.arange(len(out)) / SR; return out + hp(rng.standard_normal(len(out)), 6000) * np.exp(-t * 12) * .12
def scribble(dur=.42): n = int(dur * SR); t = np.arange(n) / SR; return bp(rng.standard_normal(n), 1400, 5200) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * .26
def boom(): n = int(1.6 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * 36 * t) * np.exp(-t * 2.4) * .8 + lp(rng.standard_normal(n), 180) * np.exp(-t * 3) * .4
def ding(): n = int(.9 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 2637 * t) + .5 * np.sin(2 * np.pi * 3951 * t)) * np.exp(-t * 7) * .25
def paper(): n = int(.35 * SR); t = np.arange(n) / SR; return bp(rng.standard_normal(n), 900, 7000) * np.sin(np.pi * t / .35) ** 2 * .35
def coins():
    out = np.zeros(int(.8 * SR))
    for k in range(6):
        n = int(.25 * SR); t = np.arange(n) / SR; f = 3000 + rng.uniform(-500, 900)
        a = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 1.48 * t)) * np.exp(-t * 18) * .18; i = int(k * .09 * SR); out[i:i + n] += a
    return out
def kaching():  # caixa registradora
    out = np.zeros(int(.9 * SR)); a = paper() * .6; out[:len(a)] += a
    b = bell(hz(88), .8, .3) + bell(hz(93), .8, .2); i = int(.08 * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out
def notif(): return np.concatenate([bell(hz(84), .12, .35)[:int(.1 * SR)], bell(hz(91), .5, .35)])
def buzzer(): n = int(.38 * SR); t = np.arange(n) / SR; return lp(np.sign(np.sin(2 * np.pi * 110 * t)) + np.sign(np.sin(2 * np.pi * 116 * t)), 2500) * np.minimum(1, (0.38 - t) / .04) * .18
def relogio():
    out = np.zeros(int(1.0 * SR))
    for k, f in enumerate((2400, 1800, 2400, 1800)): a = bp(rng.standard_normal(int(.02 * SR)), f * .8, f * 1.2) * .5; i = int(k * .25 * SR); out[i:i + len(a)] += a
    return out
def queda(): n = int(.7 * SR); t = np.arange(n) / SR; f = 1400 * np.exp(-t * 2.6) + 120; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) * .22
def subida(): n = int(.9 * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); return np.concatenate([bp(x[i:i + 600], 300 + 5000 * (i / n) ** 2, 800 + 9000 * (i / n) ** 2) for i in range(0, n, 600)])[:n] * (t / .9) ** 2 * .9
def brilho():
    out = np.zeros(int(1.0 * SR))
    for k, n_ in enumerate((96, 100, 103, 108)): b = bell(hz(n_), .5, .1); i = int(k * .06 * SR); out[i:i + len(b)] += b
    return out
def glitch():
    n = int(.3 * SR); out = np.zeros(n)
    for k in range(6): i = int(rng.uniform(0, n - 2000)); out[i:i + 1600] += blip(rng.uniform(300, 2400), 1600 / SR, .3)[:1600]
    return out
SFX = dict(whoosh=whoosh, pop=popfx, thud=thud, tick=tick, ticks=ticks, step=step, steps=steps, shutter=shutter,
           scribble=scribble, boom=boom, ding=ding, paper=paper, coins=coins, kaching=kaching, notif=notif, buzzer=buzzer,
           relogio=relogio, queda=queda, subida=subida, brilho=brilho, glitch=glitch)


def amostras(out):
    """Um arquivo com ~8 s de cada clima, em ordem, para o usuário escolher (com 1 s de silêncio entre eles)."""
    partes = []
    for i, cl in enumerate(CLIMAS):
        N = int(8 * SR); m = trilha(N, cl); m *= np.minimum(1, (N / SR - np.arange(N) / SR) / 1.0)[:, None]
        partes += [m * .8, np.zeros((SR, 2))]; print(i + 1, CLIMAS[cl]['nome'])
    x = np.concatenate(partes); x /= np.abs(x).max() / .9
    sf.write('/tmp/_am.wav', x.astype(np.float32), SR)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/_am.wav', '-b:a', '160k', out], check=True); return out


def mix(v):
    N = int(v.end * SR); voice = np.zeros((N, 2)); vm = np.zeros(N); sfx = np.zeros((N, 2))
    narr = v.R.get('narrador', 'narrador'); roles = [r for r in v.R['vozes'] if r != narr]
    pans = {r: (-.28 if i % 2 == 0 else .28) for i, r in enumerate(roles)}
    IRN = room_ir(0.22, 6000, 1); IRC = room_ir(0.34, 4200, 2)
    for k, t in v.cue.items():
        s, sr = sf.read(f'{v.A}/{k}.wav'); s = s.mean(1) if s.ndim > 1 else s; isn = v.voz[k] == narr; ext = bool(v.ext.get(k))
        d = voice_chain(s, sr, isn, ext)
        wet = np.stack([fftconvolve(d, (IRN if isn else IRC)[:, ch])[:len(d) + 8000] for ch in (0, 1)], 1)
        dry = np.zeros_like(wet); place(dry, d, 0, 1.0, 0.0 if (isn or ext) else pans.get(v.voz[k], 0))
        place(voice, dry + wet * (0 if ext else 0.05 if isn else 0.16), t); i = int(t * SR); vm[i:i + len(d)] += d[:max(0, N - i)]
    textos = list(v.txt.values()); tema_auto, _ = detectar_tema(textos)
    tema = v.R.get('tema', 'auto'); tema = tema_auto if tema == 'auto' else tema
    clima = v.R.get('musica', 'auto'); clima = TEMAS.get(tema, ('misterio',))[0] if clima == 'auto' else clima
    print(f'tema {tema} | trilha {"sem música" if clima == "nenhuma" else CLIMAS[clima]["nome"]}')
    manuais = []; trans = glitch if tema == 'tecnologia' else (lambda: whoosh(.5))
    mutes = []; cut = None
    for S in v.shots:
        d = S.d
        if 'card' in d: mutes.append((S.s0, S.s1)); place(sfx, boom(), S.s0, .7)
        if d.get('whip'): place(sfx, trans(), S.s1 - .3, .5, -.3 if S.i % 2 else .3)
        for sh in d.get('shake', []): place(sfx, thud(True), S.at(sh), 1.1)
        for (txt_, at_, *_r) in d.get('lower', []): place(sfx, popfx(360), S.at(at_), .5, .2)
        if d.get('tag'): place(sfx, popfx(300), S.s0 + .25, .35, -.4)
        if d.get('polaroid'):
            cut = S.at(d['polaroid']['at']); place(sfx, shutter(), cut, 1.0); place(sfx, scribble(.4), cut + .3, .8, -.2); place(sfx, popfx(360), cut + .68, .6, -.3)
        for ev in d.get('sfx', []):  # ('nome', quando, ganho=0.6, pan=0)
            name, when = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else .6; pn = ev[3] if len(ev) > 3 else 0
            place(sfx, SFX[name](), S.at(when), g, pn); manuais.append(S.at(when))
        manuais += [S.at(x) for x in d.get('shake', [])]
    if v.R.get('efeitos_auto', True):  # efeitos por palavra-chave, sem atropelar os manuais
        for ef, tt in efeitos_auto(v):
            if all(abs(tt - x) > .45 for x in manuais): place(sfx, SFX[ef](), tt, .45, .15); print('  efeito', ef, round(tt, 2), 's')
    sfx += (lp(rng.standard_normal(N), 400) * 0.004)[:, None]  # tom de sala bem baixo
    mus = np.zeros((N, 2)) if clima == 'nenhuma' else trilha(N, clima, mutes, cut)  # "musica": "nenhuma" = sem trilha
    env = lp(np.abs(vm), 5, 1); env /= env.max() + 1e-9; duck = (1 - 0.6 * np.clip(env * 3.2, 0, 1))[:, None]
    m = voice * 1.0 + mus * 0.36 * duck + sfx * 0.5; m = np.tanh(m * 1.15) / np.tanh(1.15)
    raw = f'{v.proj}/mix_raw.wav'; sf.write(raw, m.astype(np.float32), SR)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7', '-ar', str(SR), f'{v.proj}/mix.wav'], check=True)
    print('mix.wav ok', round(v.end, 1), 's')


if __name__ == '__main__':  # python3 audio.py amostras saida.mp3
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'amostras': print(amostras(sys.argv[2] if len(sys.argv) > 2 else 'amostras_trilhas.mp3'))
