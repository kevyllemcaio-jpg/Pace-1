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


if __name__ == '__main__':
    pasta, dur = sys.argv[1], float(sys.argv[2])
    os.makedirs(pasta, exist_ok=True)
    for nome, f in [('pop', pop), ('bolha', bolha), ('carimbo', carimbo), ('caixa', caixa), ('saida', saida), ('whoosh', whoosh)]:
        salvar(os.path.join(pasta, nome + '.wav'), f())
    salvar(os.path.join(pasta, 'trilha.wav'), trilha(dur))
