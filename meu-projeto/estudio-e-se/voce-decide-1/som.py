import numpy as np, json, wave
SR = 44100; rng = np.random.default_rng(5)
ws = json.load(open('work/words.json')); ST = {}
for w in ws: ST.setdefault(w['seg'], w['inicio'])
B = json.load(open('bound.txt')) if False else eval(open('bound.txt').read()); TOT = B[-1] / 30 + 2.5; N = int(TOT * SR)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def put(b, x, s, g=1):
    i = int(s * SR); j = min(len(b), i + len(x))
    if 0 <= i < len(b): b[i:j] += x[:j - i] * g
def pl(f, d=0.3): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.004, 0.16)
def bell(f, d=0.8): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.35)
def kick(): t = t_(0.25); f = 110 * np.exp(-t * 18) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.12)
def tick(f=2200): x = rng.normal(size=int(0.03 * SR)); return np.diff(x, prepend=0) * env(len(x), 0.0005, 0.008) + bell(f, 0.03) * 0.3
M = np.zeros(N); X = np.zeros(N)
bpm = 110; beat = 60 / bpm; scale = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3]; prog = [0, 3, 4, 2]
tc = B[12] / 30; k = 0; t = 0.0
while t < TOT:
    tense = t >= tc
    r = scale[prog[(k // 8) % 4]]
    if k % 2 == 0: put(M, kick(), t, 0.5)
    put(M, pl(r * (1 if k % 2 else 2) * (0.5 if tense else 1)), t, 0.25)
    if k % 4 == 3 and not tense: put(M, bell(scale[(k * 3) % 6] * 2), t, 0.08)
    t += beat / 2; k += 1
t = tc
while t < TOT - 1: put(X, tick(), t, 0.6); put(X, tick(1600), t + 0.5, 0.4); t += 1.0
def whoosh(): x = rng.normal(size=int(0.4 * SR)); return np.convolve(x, np.ones(25) / 25, 'same') * np.sin(np.pi * t_(0.4) / 0.4)
for i in (1, 3, 5, 7, 9, 10, 13): put(X, whoosh(), B[i] / 30 - 0.2, 0.6)
put(X, bell(1046) + bell(1568) * 0.6, B[4] / 30 + 0.3, 0.5); put(X, kick() + rng.normal(size=int(0.25 * SR)) * 0.2 * env(int(0.25 * SR), 0.001, 0.05), B[2] / 30 + 0.93, 0.8)
for k2 in range(6): put(X, bell(1200 + 300 * (k2 % 2), 0.15), B[11] / 30 + 0.1 + k2 * 0.12, 0.35)
for i in (8,): put(X, bell(392, 0.6) + bell(370, 0.6), B[i] / 30 + 0.1, 0.4)
def wr(p, x):
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x / np.abs(x).max() * 0.9, -1, 1) * 32767).astype('<i2').tobytes())
wr('music.wav', M); wr('sfx.wav', X); print('ok')
