def lp(x, a=0.08):
    y = np.zeros_like(x); s = 0
    for i in range(0, len(x), 1): pass
    return x
def saw(f, d):
    tt = t_(d); return 2*((f*tt) % 1) - 1
def pad(t0, t1, ms, g=0.12, kind='sin'):
    d = t1 - t0; tt = t_(d)
    x = sum(np.sin(2*np.pi*midi(m)*tt + 0.4*np.sin(2*np.pi*0.25*tt+m)) + 0.25*np.sin(4*np.pi*midi(m)*tt) for m in ms) / len(ms)
    put(mus, x * np.minimum(1, tt/0.5) * np.minimum(1, (d-tt)/0.5), t0, g)
def riser(d):
    tt = t_(d); f = 200 * 2 ** (tt/d*3); x = noise_band(d, 800, 8000) * 0.6 + 0.4*np.sin(2*np.pi*np.cumsum(f)/SR); return x * (tt/d) ** 2
def boom():
    tt = t_(2.0); f = 70*np.exp(-tt*3) + 32; return (np.sin(2*np.pi*np.cumsum(f)/SR) + 0.5*noise_band(2.0, 30, 600)) * env(len(tt), 0.002, 0.6)
def taiko():
    tt = t_(0.6); f = 95*np.exp(-tt*8) + 55; return (np.sin(2*np.pi*np.cumsum(f)/SR) + 0.25*noise_band(0.6, 60, 900)) * env(len(tt), 0.001, 0.18)
def crackle(d, dens=60):
    x = np.zeros(int(d*SR))
    for _ in range(int(dens*d)):
        i = rng.integers(0, max(1, len(x)-2000)); n = int(rng.integers(200, 1800)); nb = noise_band(n/SR + 0.01, 1500, 9000)[:n]; x[i:i+n] += nb * np.exp(-np.arange(n)/(n/4)) * rng.uniform(0.3, 1)
    return x
def zap():
    tt = t_(0.35); f = 2400*np.exp(-tt*9) + 120; return (np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.4 + noise_band(0.35, 2000, 9000)*0.6) * env(len(tt), 0.001, 0.09)
def shatter():
    x = noise_band(1.2, 3000, 12000) * env(int(1.2*SR), 0.001, 0.25)
    for k in range(14): put(x, ting(2500 + rng.integers(0, 4000)), rng.uniform(0, 0.6), 0.3)
    return x
def screech(d):
    tt = t_(d); f = 1100 + 120*np.sin(2*np.pi*7*tt); return (0.5*np.sin(2*np.pi*np.cumsum(f)/SR) + 0.6*noise_band(d, 1500, 5000)) * np.minimum(1, tt/0.05) * np.minimum(1, (d-tt)/0.2)
def hum(d, f0=55):
    tt = t_(d); return (np.sin(2*np.pi*f0*tt) + 0.5*np.sin(2*np.pi*f0*1.5*tt + 3*np.sin(2*np.pi*0.7*tt)) + 0.3*noise_band(d, 200, 1200)) * np.minimum(1, tt/0.8) * np.minimum(1, (d-tt)/0.5)
def rev(x): return x[::-1]
def stabs(t0, t1, bpm, roots, g=1.0, full=True):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; r = roots[(b//8) % len(roots)]
        put(mus, taiko(), s, 0.9*g if b % 4 in (0, 3) else 0.55*g)
        if b % 2 == 1: put(mus, snare(), s, 0.4*g)
        put(mus, hat(), s + beat/2, 0.25*g)
        for k in range(2): put(mus, note(midi(r + 12 + (7 if (b+k) % 3 == 2 else 0)), beat*0.45, 'pluck', 0.1), s + k*beat/2, 0.28*g)
        if full and b % 8 == 0:
            for m in (r+24, r+31, r+36): put(mus, note(midi(m), beat*7.5, 'brass'), s, 0.12*g)
        if b % 8 == 0: put(mus, note(midi(r), beat*7.8, 'brass'), s, 0.22*g)
        b += 1

