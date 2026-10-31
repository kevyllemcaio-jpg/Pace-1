"""Gera música de fundo ORIGINAL (sintetizada por código) — sem direitos autorais de terceiros.

Estilo: pop animado / "explainer" (bateria, baixo, acordes pulsando e uma melodia de marimba).
Cada semente gera uma música diferente (tom, andamento, progressão e melodia).

Uso: python3 estudio3d/musica.py saida.wav <segundos> [semente]
Requer: numpy, scipy
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, lfilter

SR = 44100


def passa_baixa(x, f):
    b, a = butter(2, f / (SR / 2), 'low')
    return lfilter(b, a, x)


def passa_alta(x, f):
    b, a = butter(2, f / (SR / 2), 'high')
    return lfilter(b, a, x)


def hz(nota):
    return 440.0 * 2 ** ((nota - 69) / 12)


def decai(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


# ---------- instrumentos ----------
def bumbo():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 85 * np.exp(-t / 0.035)
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * decai(n, 0.16) * 1.0


def caixa(rng):
    n = int(0.3 * SR)
    ruido = passa_baixa(passa_alta(rng.standard_normal(n), 900), 5000) * decai(n, 0.06)
    corpo = np.sin(2 * np.pi * 190 * np.arange(n) / SR) * decai(n, 0.05)
    return 0.45 * ruido + 0.35 * corpo


def chimbal(rng, aberto=False):
    n = int((0.25 if aberto else 0.06) * SR)
    return passa_baixa(passa_alta(rng.standard_normal(n), 6000), 11000) * decai(n, 0.07 if aberto else 0.015) * 0.13


def baixo(nota, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(nota)
    serra = 2 * ((t * f) % 1) - 1
    som = passa_baixa(serra, 700) * 0.55 + np.sin(2 * np.pi * f * t) * 0.5
    ataque = np.minimum(1, np.arange(n) / (0.005 * SR))
    return som * ataque * decai(n, dur * 0.9 + 0.05) * 0.55


def acorde(notas, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    som = np.zeros(n)
    for nt in notas:
        f = hz(nt)
        som += np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    ataque = np.minimum(1, np.arange(n) / (0.004 * SR))
    return som * ataque * decai(n, 0.12) * 0.16


def marimba(nota, dur):
    n = int(max(dur, 0.45) * SR)
    t = np.arange(n) / SR
    f = hz(nota)
    som = np.sin(2 * np.pi * f * t) * decai(n, 0.28) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * decai(n, 0.04)
    return som * 0.32


# ---------- composição ----------
GRAUS = {'I': (0, 'M'), 'ii': (2, 'm'), 'IV': (5, 'M'), 'V': (7, 'M'), 'vi': (9, 'm')}
PROGRESSOES = [['I', 'V', 'vi', 'IV'], ['vi', 'IV', 'I', 'V'], ['I', 'vi', 'IV', 'V'], ['IV', 'I', 'V', 'vi'], ['I', 'IV', 'vi', 'V']]
ESCALA = [0, 2, 4, 5, 7, 9, 11]
RITMOS = [  # posições (em 1/16 do compasso) das notas da melodia
    [0, 3, 6, 8, 10, 12],
    [0, 2, 4, 7, 10, 12, 14],
    [0, 4, 6, 8, 11, 14],
    [2, 4, 6, 10, 12],
]


def triade(tonica, grau):
    d, q = GRAUS[grau]
    raiz = tonica + d
    return [raiz, raiz + (4 if q == 'M' else 3), raiz + 7]


def compor(segundos, semente):
    rng = np.random.default_rng(semente)
    bpm = int(rng.choice([112, 116, 120, 124]))
    tonica = int(rng.choice([60, 62, 65, 67]))  # Dó, Ré, Fá, Sol
    prog = PROGRESSOES[int(rng.integers(len(PROGRESSOES)))]
    seminima = 60 / bpm
    compasso = 4 * seminima
    semicol = seminima / 4
    n_comp = int(np.ceil(segundos / compasso)) + 1
    total = int((n_comp * compasso + 2) * SR)
    pistas = {k: np.zeros(total) for k in ['bateria', 'baixo', 'acordes', 'melodia']}

    def poe(pista, som, t):
        i = int(t * SR)
        j = min(total, i + len(som))
        if i < total:
            pistas[pista][i:j] += som[: j - i]

    # motivo de 2 compassos repetido com variação
    motivo = []
    for c in range(2):
        ritmo = RITMOS[int(rng.integers(len(RITMOS)))]
        graus_mel = rng.integers(0, 5, len(ritmo))
        motivo.append(list(zip(ritmo, graus_mel)))

    k_caixa = caixa(rng)
    k_bumbo = bumbo()
    for c in range(n_comp):
        t0 = c * compasso
        grau = prog[c % 4]
        tri = triade(tonica, grau)
        intro = c < 2
        fim = c >= n_comp - 1
        # bateria
        if not intro:
            for b in [0, 2] + ([2.5] if c % 2 else []):
                poe('bateria', k_bumbo, t0 + b * seminima)
            for b in [1, 3]:
                poe('bateria', k_caixa, t0 + b * seminima)
            if c % 8 == 7:  # virada
                for s in range(12, 16):
                    poe('bateria', k_caixa * 0.6, t0 + s * semicol)
        for s in range(0, 16, 2):
            poe('bateria', chimbal(rng, aberto=(s % 8 == 6)), t0 + s * semicol + (0.012 if s % 4 == 2 else 0))
        # baixo (colcheias com oitava)
        if not intro:
            for s in range(0, 16, 2):
                nota = tri[0] - 24 + (12 if s in (6, 14) else 0)
                poe('baixo', baixo(nota, semicol * 1.8), t0 + s * semicol)
        # acordes no contratempo
        for s in [2, 6, 10, 14] if not intro else [0, 8]:
            poe('acordes', acorde([x for x in tri], semicol * 3), t0 + s * semicol)
        # melodia
        if not intro and not fim:
            var = (c // 4) % 2
            for pos, g in motivo[c % 2]:
                nota_base = tri[int(g) % 3] + 12 if g < 3 else tonica + 12 + ESCALA[(int(g) + var * 2) % 7]
                poe('melodia', marimba(nota_base, semicol * 2), t0 + pos * semicol)

    mix = (pistas['bateria'] * 0.7 + pistas['baixo'] * 0.8 + pistas['acordes'] * 0.75 + pistas['melodia'] * 0.7)
    mix = mix[: int((segundos + 0.5) * SR)]
    # fade in/out
    fi, fo = int(0.3 * SR), int(2.0 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    mix[-fo:] *= np.linspace(1, 0, fo)
    mix = passa_baixa(mix, 12000)
    mix = np.tanh(mix * 1.2)
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.89
    # estéreo leve: atraso pequeno no canal direito
    atraso = int(0.012 * SR)
    dir_ = np.concatenate([np.zeros(atraso), mix[:-atraso]])
    est = np.stack([mix, 0.85 * mix + 0.15 * dir_], axis=1)
    return est, bpm, tonica, prog


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    saida, segundos = sys.argv[1], float(sys.argv[2])
    semente = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    est, bpm, tonica, prog = compor(segundos, semente)
    pcm = (est * 32767).astype(np.int16)
    with wave.open(saida, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'{saida}: {segundos:.1f}s, {bpm} bpm, tônica {tonica}, {"-".join(prog)}')


if __name__ == '__main__':
    main()
