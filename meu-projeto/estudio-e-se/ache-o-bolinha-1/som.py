import numpy as np, json, wave
SR = 44100; rng = np.random.default_rng(9); T = json.load(open('tim.json')); st, en = T['st'], T['en']; TOT = T['tot'] / 30 + 2.5; N = int(TOT * SR)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def put(b, x, s, g=1):
    i = int(s * SR); j = min(len(b), i + len(x))
    if 0 <= i < len(b): b[i:j] += x[:j - i] * g
def pl(f, d=0.25): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.004, 0.12)
def bell(f, d=0.8): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.3)
def kick(): t = t_(0.25); f = 110 * np.exp(-t * 18) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.12)
def tick(f=2000): t = t_(0.04); return np.sin(2 * np.pi * f * t) * env(len(t), 0.0005, 0.01)
M = np.zeros(N); X = np.zeros(N); beat = 60 / 120; sc = [392, 440, 523.3, 587.3, 659.3, 784]
t = 0.0; k = 0
while t < TOT:
    put(M, kick(), t, 0.45 if k % 2 == 0 else 0.0); put(M, pl(sc[(k * 5 + (k // 8)) % 6] / (2 if k % 4 else 1)), t, 0.22); t += beat / 2; k += 1
for lv in range(5):
    a, b = en[2 * lv + 1] / 30, st[2 * lv + 2] / 30; x = a
    while x < b - 0.05: put(X, tick(2400 if int((x - a) * 2) % 2 == 0 else 1800), x, 0.8); x += 0.5
    for j, fr in enumerate((784, 988, 1175, 1568)): put(X, bell(fr, 0.6), b + j * 0.07, 0.35)
put(X, bell(523.3) + bell(659.3) + bell(784), 0.2, 0.4); put(X, bell(1046, 1.2) + bell(1318, 1.2), st[-1] / 30, 0.4)
def wr(p, x):
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x / np.abs(x).max() * 0.9, -1, 1) * 32767).astype('<i2').tobytes())
wr('music.wav', M); wr('sfx.wav', X); print('ok')
