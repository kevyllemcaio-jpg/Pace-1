def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r); return e
def put(buf, x, s, g=1.0):
    i = int(s * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[:j - i] * g
def note(f, d, kind='pluck', r=None):
    t = t_(d)
    if kind == 'pluck': return (np.sin(2*np.pi*f*t) + 0.4*np.sin(4*np.pi*f*t)) * env(len(t), 0.003, r or 0.18)
    if kind == 'bell': return (np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*f*2.76*t)) * env(len(t), 0.002, r or 0.35)
    if kind == 'brass':
        x = sum(np.sin(2*np.pi*f*k*t + 0.3*np.sin(2*np.pi*5*t)) / k for k in range(1, 6))
        a = np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.08)
        return x * a * 0.5
def kick():
    t = t_(0.25); f = 120 * np.exp(-t * 18) + 45; return np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(t), 0.001, 0.12)
def snare():
    t = t_(0.2); return (rng.normal(size=len(t)) * 0.6 + np.sin(2*np.pi*190*t) * 0.4) * env(len(t), 0.001, 0.06)
def hat():
    x = rng.normal(size=int(0.05*SR)); x = np.diff(x, prepend=0); return x * env(len(x), 0.0005, 0.015)
def noise_band(d, lo, hi):
    x = rng.normal(size=int(d*SR)); X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1/SR)
    X[(fr < lo) | (fr > hi)] = 0; y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)
def midi(m): return 440 * 2 ** ((m - 69) / 12)

def whoosh(d=0.35):
    x = noise_band(d, 300, 3000); tt = t_(d); return x * np.sin(np.pi * tt / d) ** 2
def pop():
    tt = t_(0.12); f = 500 + 900 * tt / 0.12; return np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.001, 0.04)
def thud():
    tt = t_(0.3); f = 90 * np.exp(-tt*10) + 50; return (np.sin(2*np.pi*np.cumsum(f)/SR) + 0.3*noise_band(0.3, 100, 800)) * env(len(tt), 0.001, 0.08)
def ting(f0=2093): return note(f0, 0.6, 'bell', 0.25)
def click():
    x = noise_band(0.03, 1500, 6000); return x * env(len(x), 0.0005, 0.006)
def boing():
    tt = t_(0.4); f = 200 + 150 * np.sin(2*np.pi*9*tt) * np.exp(-tt*4) + 300*tt; return np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.002, 0.18)
def scrape(d=0.25):
    x = noise_band(d, 2500, 7000); tt = t_(d); return x * (0.5 + 0.5*np.sin(2*np.pi*35*tt)) * np.sin(np.pi*tt/d)
def meow():
    tt = t_(0.7); f = 520 + 380*np.sin(np.pi*np.minimum(1, tt/0.55)) ** 1.5 - 120*tt
    ph = 2*np.pi*np.cumsum(f)/SR
    x = np.sin(ph) + 0.5*np.sin(2*ph) + 0.25*np.sin(3*ph)
    return x * np.minimum(1, tt/0.05) * np.minimum(1, (0.7-tt)/0.2) * 0.6
def dingdong():
    return np.concatenate([note(659, 0.45, 'bell', 0.5), note(523, 0.8, 'bell', 0.6)])
def cheer(d=1.6):
    x = noise_band(d, 500, 3500); tt = t_(d); return x * (0.6 + 0.4*np.sin(2*np.pi*7*tt)) * np.minimum(1, tt/0.1) * np.exp(-tt/1.0)
def lowhit():
    tt = t_(1.0); return (np.sin(2*np.pi*45*tt) + 0.4*noise_band(1.0, 40, 300)) * env(len(tt), 0.002, 0.35)

def wr(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    with wave.open(name, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())

bpm_prog = [(60, [60, 64, 67]), (65, [65, 69, 72]), (67, [67, 71, 74]), (60, [60, 64, 67])]
MEL = [72, 74, 76, 79, 77, 76, 74, 72, 74, 76, 77, 74, 76, 72, 71, 72]
def march(buf, t0, t1, bpm, bright):
    beat = 60 / bpm; bar = 4 * beat; b = 0
    while True:
        s = t0 + b * beat
        if s >= t1: break
        put(buf, kick(), s, 0.9 if b % 2 == 0 or bright else 0.5)
        if b % 2 == 1: put(buf, snare(), s, 0.45)
        put(buf, hat(), s + beat / 2, 0.3 if bright else 0.25)
        root, ch = bpm_prog[(b // 4) % 4]
        put(buf, note(midi(root - 24 + (12 if bright and b % 2 else 7 if b % 2 else 0)), beat * 0.9, 'pluck', 0.15), s, 0.55)
        if b % 4 == 0:
            for m in ch: put(buf, note(midi(m), bar * 0.95, 'brass'), s, 0.16 if bright else 0.10)
        if b % 2 == 0 or bright:
            m = MEL[(b // (1 if bright else 2)) % len(MEL)] + (12 if bright else 0)
            put(buf, note(midi(m), beat * 0.6, 'bell'), s, 0.18)
        b += 1
