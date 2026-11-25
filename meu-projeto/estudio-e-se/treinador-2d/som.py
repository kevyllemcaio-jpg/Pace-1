import numpy as np, json, wave
SR = 44100; rng = np.random.default_rng(3)
ws = json.load(open('work/words.json')); ST = {}
for w in ws: ST.setdefault(w['seg'], w['inicio'])
TOT = ws[-1]['fim'] + 0.6; N = int(TOT * SR) + SR
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def put(b, x, s, g=1):
    i = int(s * SR); j = min(len(b), i + len(x))
    if 0 <= i < len(b): b[i:j] += x[:j - i] * g
def pad(f, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * m * t * (1 + 0.003 * k)) / m for k in (-1, 1) for m in (1, 2, 3))
    return x * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6) * 0.25
def kick(): t = t_(0.3); f = 110 * np.exp(-t * 16) + 42; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.14)
def tom(f0=90): t = t_(0.4); f = f0 * np.exp(-t * 6) + 50; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.2)
def noise(d, r): x = rng.normal(size=int(d * SR)); return x * env(len(x), 0.002, r)
def bell(f, d=1.5): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.5)
M = np.zeros(N); X = np.zeros(N)
A = 55.0; prog = [A, A * 2 ** (8 / 12), A * 2 ** (3 / 12), A * 2 ** (10 / 12)]  # Am F C G
bar = 60 / 84 * 4; fase = lambda t: 'calmo' if t < 111.9 else ('luta' if t < 180.2 else 'final')
t = 0.0; k = 0
while t < TOT:
    ph = fase(t); r = prog[k % 4] * (2 if ph == 'final' else 1)
    put(M, pad(r * 2, bar + 0.6), t, 0.7 if ph != 'luta' else 0.5)
    beats = 4 if ph == 'calmo' else 8
    for b in range(beats):
        tb = t + b * bar / beats
        if ph == 'calmo' and b in (0, 2): put(M, tom(70), tb, 0.35)
        if ph == 'luta':
            put(M, kick(), tb, 0.6 if b % 2 == 0 else 0.3); put(M, noise(0.05, 0.02) * 0.3, tb + bar / 16, 1)
            if b % 4 == 2: put(M, tom(140), tb, 0.4)
        if ph == 'final' and b % 2 == 0: put(M, bell(r * 4 * (1, 1.5, 1.26, 2)[b // 2 % 4]), tb, 0.12)
    if ph == 'calmo' and k % 2 == 0: put(M, bell(r * 8, 2.5), t + bar / 2, 0.06)
    t += bar; k += 1
# vento constante
wnd = np.convolve(rng.normal(size=N), np.ones(400) / 400, 'same'); M += wnd * 1.4 * (0.6 + 0.4 * np.sin(np.arange(N) / SR * 0.3))
# efeitos
def whoosh(): x = noise(0.5, 0.25); t = t_(0.5); return np.convolve(x, np.ones(30) / 30, 'same') * np.sin(np.pi * t / 0.5)
def hit(): return kick() * 1.2 + noise(0.3, 0.05) * 0.5
def crack(): x = noise(0.6, 0.12); return x * (np.sin(np.arange(len(x)) * 0.9) > 0) * 0.8
def ding(): return bell(1320, 0.8) + bell(1980, 0.8) * 0.5
def roar(): t = t_(1.6); f = 70 + 20 * np.sin(t * 9); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + np.convolve(rng.normal(size=len(t)), np.ones(20) / 20, 'same') * 2) * np.minimum(1, t / 0.1) * np.exp(-t / 1.0)
def scrape(d=2.5): x = rng.normal(size=int(d * SR)); return np.diff(x, prepend=0) * 0.3 * (0.5 + 0.5 * np.sin(np.arange(len(x)) / SR * 20 * np.pi))
for i in range(1, 63):
    if i in (3, 14, 20, 25, 28, 32, 38, 46, 60): put(X, whoosh(), ST[i] - 0.25, 0.7)
for i in (24, 27, 31, 34): put(X, ding(), ST[i] + 0.35, 0.5)
put(X, ding(), ST[35] + 0.6, 0.5); put(X, ding(), ST[42] + 2.0, 0.5)
put(X, roar(), ST[2] + 1.0, 0.5); put(X, roar(), ST[46] + 0.2, 1.0); put(X, scrape(), ST[40] + 0.3, 1)
put(X, hit(), ST[22] + 0.4, 0.7); put(X, hit(), ST[26] + 0.9, 0.6); put(X, crack(), ST[48] + 0.1, 1)
for j in range(3): put(X, hit(), ST[49] + 1.1 + j * 0.42, 0.9)
put(X, hit(), ST[52] + 0.4, 1); put(X, whoosh(), ST[57] + 1.6, 1); put(X, hit(), ST[58] + 0.15, 1.2); put(X, hit(), ST[59] + 1.5, 1); put(X, crack(), ST[59] + 1.5, 0.7)
def wr(p, x):
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x / np.abs(x).max() * 0.9, -1, 1) * 32767).astype('<i2').tobytes())
wr('music.wav', M); wr('sfx.wav', X); print('ok', TOT)
