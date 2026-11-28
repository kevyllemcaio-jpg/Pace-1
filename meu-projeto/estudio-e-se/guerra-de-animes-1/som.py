import numpy as np, wave
SR = 44100; TOT = 30.0; N = int(TOT * SR); rng = np.random.default_rng(3)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def put(b, x, s, g=1):
    i = int(s * SR); j = min(len(b), i + len(x))
    if 0 <= i < len(b): b[i:j] += x[:j - i] * g
def lp(x, k=30): return np.convolve(x, np.ones(k) / k, 'same')
def taiko(f0=70): t = t_(0.7); f = f0 * np.exp(-t * 5) + 40; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.25) + lp(rng.normal(size=len(t)), 8) * env(len(t), 0.001, 0.03) * 0.6
def saw(f, d): t = t_(d); return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 8))
def pad(f, d): x = saw(f, d) + saw(f * 1.005, d) + saw(f * 1.5, d) * 0.5; t = t_(d); return lp(x, 12) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4) * 0.12
def impacto(): return taiko(55) * 1.5 + lp(rng.normal(size=int(0.7 * SR)), 3) * env(int(0.7 * SR), 0.001, 0.12) * 0.8
def whoosh(d=0.45): x = rng.normal(size=int(d * SR)); return lp(x, 20) * np.sin(np.pi * t_(d) / d) * 1.4
def corte(): x = rng.normal(size=int(0.35 * SR)); return (np.diff(x, prepend=0) * 0.4 + np.sin(2 * np.pi * 2400 * t_(0.35)) * 0.3) * env(int(0.35 * SR), 0.002, 0.08)
def zap(d=0.6): t = t_(d); return np.sign(np.sin(2 * np.pi * (300 + 900 * rng.random()) * t)) * (rng.random(len(t)) > 0.4) * env(len(t), 0.001, 0.15) * 0.4
def hum(d, f=55): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t) + lp(rng.normal(size=len(t)), 4) * 0.4) * np.minimum(1, t / 0.3) * 0.5
def riser(d): t = t_(d); f = 200 + 1800 * (t / d) ** 2; return np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) * 0.4 + lp(rng.normal(size=len(t)), 6) * (t / d) * 0.3
M = np.zeros(N); X = np.zeros(N)
# trilha: pad em menor + tambores que aceleram
for st, nota in ((0, 55), (6, 58.27), (12, 51.91), (18, 55), (24, 65.41)):
    put(M, pad(nota * 2, 6.2), st, 1.0)
bpm = 100; t = 0.0
while t < TOT - 3:
    dens = 1 if t < 5.8 else (2 if t < 18 else 4)
    for k in range(dens): put(M, taiko(80 if k % 2 == 0 else 110), t + k * 60 / bpm / dens, 0.5 if k % 2 == 0 else 0.3)
    t += 60 / bpm
put(M, pad(65.41 * 2, 3.2) * 1.4, 27, 1)
# efeitos
put(X, whoosh(), 0.2, 0.5); put(X, whoosh(0.3), 3.0, 0.6); put(X, whoosh(0.3), 4.4, 0.6)
put(X, whoosh(0.8), 5.9, 1); put(X, impacto(), 6.9, 1.6)
for k in range(6): put(X, taiko(140) * 0.8, 8.7 + k * 0.33, 0.8); put(X, whoosh(0.12) * 0.5, 8.7 + k * 0.33, 0.8)
put(X, zap(1.0), 10.6, 1); put(X, impacto(), 11.1, 1.3)
put(X, hum(3.0, 45), 12, 1.2); put(X, riser(3.0), 12, 0.6)
put(X, whoosh(0.5), 15.1, 0.9); put(X, corte(), 15.9, 1.4); put(X, impacto() * 0.7, 15.95, 1)
put(X, hum(6.0, 60), 18.3, 1.0); put(X, hum(6.0, 61.5) * 0.6, 18.3, 1.0); put(X, riser(2.4), 24, 0.8)
put(X, impacto() * 1.3 + lp(rng.normal(size=int(0.7 * SR)), 2) * 0.6, 26.4, 1.8)
put(X, lp(rng.normal(size=int(3 * SR)), 40) * np.exp(-t_(3) / 1.2) * 2, 26.5, 1.2)
def wr(p, x):
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x / np.abs(x).max() * 0.9, -1, 1) * 32767).astype('<i2').tobytes())
mix = M / np.abs(M).max() * 0.55 + X / np.abs(X).max() * 0.8
wr('mix.wav', mix); print('ok')
