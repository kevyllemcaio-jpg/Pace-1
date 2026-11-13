"""Gera os efeitos sonoros e a trilha de fundo da série (sintetizados, sem arquivos de terceiros).

Uso: python3 estudio/sons.py <pasta> <duracao_trilha_em_s>
Cria: pop.wav, carimbo.wav, bolha.wav, caixa.wav, saida.wav, whoosh.wav, trilha.wav
"""
import os
import sys
import wave

import numpy as np

SR = 44100


def salvar(nome, x):
    x = np.clip(x, -1, 1)
    with wave.open(nome, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def env(d, ataque=0.005, queda=8.0):
    x = t(d)
    return np.minimum(1, x / ataque) * np.exp(-x * queda)


def pop():
    x = t(0.12)
    f = 900 - 3500 * x
    return 0.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.12, 0.002, 30)


def bolha():
    x = t(0.15)
    f = 500 + 2500 * x
    return 0.45 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.15, 0.003, 22)


def carimbo():
    x = t(0.35)
    grave = np.sin(2 * np.pi * (90 - 60 * x) * x) * np.exp(-x * 14)
    ruido = np.random.default_rng(1).normal(0, 1, len(x)) * np.exp(-x * 40)
    return 0.8 * grave + 0.35 * ruido


def caixa():
    d = 0.7
    x = t(d)
    s = 0.5 * np.sin(2 * np.pi * 1318 * x) * env(d, 0.002, 6)
    k = int(0.08 * SR)
    x2 = x[: len(x) - k]
    s[k:] += 0.5 * np.sin(2 * np.pi * 1760 * x2) * np.minimum(1, x2 / 0.002) * np.exp(-x2 * 5)
    return s * 0.8


def saida():
    x = t(0.4)
    f = 700 - 900 * x
    return 0.4 * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(0.4, 0.01, 7) * 0.6


def replay():
    """Fita rebobinando: chiado com tom descendo rápido e trepidando, e um clique no fim."""
    d = 0.9
    x = t(d)
    f = 2400 * np.exp(-x * 2.2) + 250
    trem = 0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * x))
    tom = np.sin(2 * np.pi * np.cumsum(f) / SR) * trem
    r = np.random.default_rng(5).normal(0, 1, len(x))
    y = np.zeros_like(r)
    for i in range(1, len(r)):
        y[i] = y[i - 1] + 0.3 * (r[i] - y[i - 1])
    s = (0.35 * tom + 0.5 * y * trem) * np.minimum(1, x / 0.03) * np.minimum(1, (d - x) / 0.1)
    clique = np.zeros_like(x)
    k = int((d - 0.06) * SR)
    clique[k:k + 400] = np.hanning(400) * 0.9
    return s * 0.8 + clique


def batida():
    """Três batidas secas de nó de dedo na porta de madeira."""
    d = 1.0
    out = np.zeros(int(SR * d))
    for k, t0 in enumerate([0.0, 0.28, 0.56]):
        x = t(0.18)
        b = (np.sin(2 * np.pi * (180 - 80 * x) * x) * 0.9 + np.random.default_rng(k).normal(0, 1, len(x)) * 0.35) * np.exp(-x * 28)
        i0 = int(t0 * SR)
        out[i0:i0 + len(b)] += b
    return out * 0.9


def ding():
    """Sininho da porta automática (dois tons)."""
    x = t(0.9)
    a = np.sin(2 * np.pi * 1318 * x) * np.exp(-x * 5) * 0.4
    b = np.zeros_like(x)
    k = int(0.18 * SR)
    b[k:] = np.sin(2 * np.pi * 1046 * x[: len(x) - k]) * np.exp(-x[: len(x) - k] * 5) * 0.4
    return a + b


def whoosh():
    x = t(0.45)
    r = np.random.default_rng(2).normal(0, 1, len(x))
    # filtro passa-baixa simples variando no tempo
    y = np.zeros_like(r)
    a = 0.02 + 0.25 * np.sin(np.pi * x / 0.45)
    for i in range(1, len(r)):
        y[i] = y[i - 1] + a[i] * (r[i] - y[i - 1])
    return 1.4 * y * np.sin(np.pi * x / 0.45) ** 2


def trilha(dur):
    """Batida leve e alegre (~100 bpm): baixo, acordes curtos, bumbo e chimbal."""
    bpm = 100
    batida = 60 / bpm
    n = int(dur * SR) + SR
    s = np.zeros(n)
    acordes = [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]]  # C Am F G
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    rng = np.random.default_rng(3)
    total_batidas = int(dur / batida) + 1
    for b in range(total_batidas):
        i0 = int(b * batida * SR)
        acorde = acordes[(b // 4) % 4]
        # bumbo nos tempos 1 e 3
        if b % 2 == 0:
            x = t(0.25)
            k = np.sin(2 * np.pi * (55 + 90 * np.exp(-x * 30)) * x) * np.exp(-x * 12) * 0.55
            s[i0:i0 + len(k)] += k[: max(0, min(len(k), n - i0))]
        # chimbal no contratempo
        j = i0 + int(batida / 2 * SR)
        x = t(0.05)
        h = rng.normal(0, 1, len(x)) * np.exp(-x * 80) * 0.08
        h = np.diff(np.concatenate([[0], h]))
        s[j:j + len(h)] += h[: max(0, min(len(h), n - j))]
        # baixo
        x = t(batida * 0.9)
        f = hz(acorde[0] - 24)
        bx = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x)) * np.exp(-x * 3) * 0.25
        s[i0:i0 + len(bx)] += bx[: max(0, min(len(bx), n - i0))]
        # acorde curto (pluck) no contratempo
        x = t(0.3)
        p = sum(np.sin(2 * np.pi * hz(m) * x) + 0.3 * np.sin(4 * np.pi * hz(m) * x) for m in acorde) * np.exp(-x * 9) * 0.07
        s[j:j + len(p)] += p[: max(0, min(len(p), n - j))]
    s = s[: int(dur * SR)]
    fade = int(1.5 * SR)
    s[-fade:] *= np.linspace(1, 0, fade)
    return s * 0.9


def trilha_calma(dur):
    """Piano suave (~66 bpm): arpejos lentos de acordes com cauda longa, sem bateria."""
    bpm = 66
    nota = 60 / bpm / 2
    n = int(dur * SR) + SR * 3
    s = np.zeros(n)
    acordes = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]]  # Am F C G
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    total = int(dur / nota) + 1
    for k in range(total):
        i0 = int(k * nota * SR)
        acorde = acordes[(k // 8) % 4]
        m = acorde[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + (12 if k % 8 in (3, 6) else 0)
        x = t(3.0)
        f = hz(m)
        p = (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(4 * np.pi * f * x) + 0.12 * np.sin(6 * np.pi * f * x)) * np.exp(-x * 1.6) * np.minimum(1, x / 0.01) * 0.12
        fim = min(len(p), n - i0)
        s[i0:i0 + fim] += p[:fim]
        if k % 8 == 0:  # baixo longo
            b = np.sin(2 * np.pi * hz(acorde[0] - 12) * t(4.0)) * np.exp(-t(4.0) * 0.8) * 0.12
            fim = min(len(b), n - i0)
            s[i0:i0 + fim] += b[:fim]
    # 'reverb' simples: ecos curtos somados
    rev = np.copy(s)
    for d, g in [(0.07, 0.35), (0.13, 0.25), (0.21, 0.18), (0.33, 0.12)]:
        k = int(d * SR)
        rev[k:] += s[:-k] * g
    s = rev[: int(dur * SR)]
    fade = int(2 * SR)
    s[-fade:] *= np.linspace(1, 0, fade)
    return s * 0.9


def trilha_terror(dur):
    """Drone grave e pulsante, com chiado baixo e um batimento lento."""
    n = int(dur * SR)
    x = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * x) + 0.5 * np.sin(2 * np.pi * 58.3 * x) + 0.3 * np.sin(2 * np.pi * 110.7 * x)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * x))
    r = np.random.default_rng(4).normal(0, 1, n)
    y = np.zeros(n)
    for i in range(1, n):
        y[i] = y[i - 1] + 0.02 * (r[i] - y[i - 1])
    s = drone * 0.12 + y * 0.6
    for b in np.arange(0, dur, 1.6):
        i0 = int(b * SR)
        k = t(0.3)
        p = np.sin(2 * np.pi * 48 * k) * np.exp(-k * 14) * 0.35
        s[i0:i0 + len(p)] += p[: max(0, min(len(p), n - i0))]
    fade = int(2 * SR)
    s[-fade:] *= np.linspace(1, 0, fade)
    s[:fade] *= np.linspace(0, 1, fade)
    return s


if __name__ == '__main__':
    pasta, dur = sys.argv[1], float(sys.argv[2])
    estilo = sys.argv[3] if len(sys.argv) > 3 else 'alegre'
    os.makedirs(pasta, exist_ok=True)
    for nome, f in [('pop', pop), ('bolha', bolha), ('carimbo', carimbo), ('caixa', caixa), ('saida', saida), ('whoosh', whoosh), ('replay', replay), ('batida', batida), ('ding', ding)]:
        salvar(os.path.join(pasta, nome + '.wav'), f())
    salvar(os.path.join(pasta, 'trilha.wav'), trilha_calma(dur) if estilo == 'calma' else trilha_terror(dur) if estilo == 'terror' else trilha(dur))
