import numpy as np, wave
SR = 44100; rng = np.random.default_rng(2); B = eval(open('bound.txt').read()); TOT = B[-1] / 30 + 2.5; N = int(TOT * SR)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def put(b, x, s, g=1):
    i = int(s * SR); j = min(len(b), i + len(x))
    if 0 <= i < len(b): b[i:j] += x[:j - i] * g
def pl(f, d=0.22): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.003, 0.1)
def kick(): t = t_(0.25); f = 120 * np.exp(-t * 18) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.13)
def hat(): x = rng.normal(size=int(0.04 * SR)); return np.diff(x, prepend=0) * env(len(x), 0.0005, 0.012)
def bell(f, d=0.8): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.3)
def whoosh(): x = rng.normal(size=int(0.35 * SR)); return np.convolve(x, np.ones(25) / 25, 'same') * np.sin(np.pi * t_(0.35) / 0.35)
M = np.zeros(N); X = np.zeros(N); beat = 60 / 118
minor = [220, 261.6, 293.7, 329.6]; major = [261.6, 329.6, 392, 523.3]
t = 0.0; k = 0
while t < TOT:
    up = t >= B[4] / 30; sc = major if up else minor
    if k % 2 == 0: put(M, kick(), t, 0.5 if up else 0.35)
    put(M, hat(), t + beat / 4, 0.12 if up else 0.05); put(M, pl(sc[(k * 3) % 4] * (1 if k % 4 else 0.5)), t, 0.22)
    t += beat / 2; k += 1
for i in (1, 2, 3, 5, 8): put(X, whoosh(), B[i] / 30 - 0.15, 0.6)
put(X, bell(523.3) + bell(659.3) + bell(784), B[4] / 30 + 0.1, 0.6); put(X, kick() * 1.2, B[2] / 30 + 0.6, 0.6)
for j in range(4): put(X, bell(880 + j * 110, 0.3), (B[6] + j * (B[7] - B[6]) / 4.2) / 30, 0.4)
put(X, bell(1046, 1.2) + bell(1318, 1.2), B[8] / 30 + 0.1, 0.5)
def wr(p, x):
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x / np.abs(x).max() * 0.9, -1, 1) * 32767).astype('<i2').tobytes())
wr('music.wav', M); wr('sfx.wav', X); print('ok')
