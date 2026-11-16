import numpy as np, wave
SR = 44100; DUR = 60.0; N = int(DUR*SR); rng = np.random.default_rng(91)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
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

# 0–3.3 tease
put(mus, riser(1.8), 0.0, 0.5); put(mus, boom(), F(55), 0.9); stabs(F(56), F(100), 140, [38], 0.8)
for f in [8, 60, 90]: put(sfx, whoosh(0.5), F(f) - 0.2, 0.6)
put(sfx, crackle(3.0), 0.1, 0.5)
# 3.3–10 walk home, sparks, transformation
pad(F(100), F(303), [50, 57, 62, 65], 0.1)
for k in range(12): put(mus, kick(), F(100) + k*0.5, 0.35)
put(sfx, crackle(F(242) - F(165), 30), F(165), 0.6); put(mus, riser(F(242) - F(185)), F(185), 0.6)
put(mus, boom(), F(242), 1.0); put(sfx, zap(), F(242), 0.6); put(sfx, crackle(1.0, 80), F(242), 0.5)
for k in range(4): put(mus, note(midi([62, 65, 69, 74][k]), 0.8, 'brass'), F(246) + k*0.12, 0.2)
# 10.1 freeze
put(sfx, rev(whoosh(0.8)), F(303) - 0.8, 0.6); put(mus, lowhit(), F(303), 0.9); put(sfx, ting(3136), F(304), 0.5)
pad(F(303), F(525), [57, 60, 64, 69, 76], 0.12)
for k in range(int((F(525) - F(310)) / 0.5)): put(mus, note(midi([81, 76, 79, 84][k % 4]), 0.4, 'bell', 0.25), F(310) + k*0.5, 0.06)
put(sfx, ting(2800), F(414), 0.4)
# 17.5–25.3 action
put(mus, riser(1.2), F(525) - 1.2, 0.5); put(mus, boom(), F(525), 0.8)
stabs(F(525), F(760), 140, [38, 41, 36, 43], 1.0)
for f in [525, 572, 605, 620, 650, 690, 715, 740]: put(sfx, whoosh(0.4), F(f) - 0.1, 0.55)
put(sfx, crackle(F(760) - F(525), 25), F(525), 0.35)
# 25.3–30.2 danger
put(mus, hum(F(905) - F(760), 41), F(760), 0.35)
for k in range(9): put(mus, kick(), F(760) + k*0.55, 0.5); put(mus, kick(), F(760) + k*0.55 + 0.18, 0.3)
put(sfx, screech(F(904) - F(820)), F(820), 0.45)
put(sfx, note(midi(64), 0.5, 'brass') + 0, F(850), 0.25); put(sfx, note(midi(64), 0.9, 'brass'), F(870), 0.25)
put(mus, riser(1.2), F(905) - 1.2, 0.5)
# 30.2–33.3 rescue
put(mus, lowhit(), F(905), 0.8); pad(F(905), F(1000), [50, 53, 57, 62], 0.1)
for f in [925, 940, 955]: put(sfx, zap(), F(f) - 0.05, 0.7); put(sfx, whoosh(0.3), F(f) - 0.3, 0.4)
put(sfx, whoosh(0.6), F(968), 0.6); put(sfx, screech(0.6), F(980), 0.4); put(mus, thud(), F(986), 0.6)
# 33.3–36 confusion
for k, m in enumerate([74, 72, 69, 71, 74, 79]): put(mus, note(midi(m), 0.35, 'pluck', 0.2), F(1000) + k*0.4, 0.22)
for f in [1008, 1020, 1032]: put(sfx, pop(), F(f), 0.5)
put(mus, boing() * 0.5, F(1045), 0.3)
# 36–43.5 out of control
stabs(F(1080), F(1175), 150, [41, 43], 1.0); put(mus, riser(F(1175) - F(1080)), F(1080), 0.5)
put(sfx, crackle(F(1305) - F(1080), 90), F(1080), 0.55)
put(mus, boom(), F(1175), 1.0); stabs(F(1175), F(1305), 160, [36, 39], 1.1)
put(sfx, shatter(), F(1190), 0.7); put(sfx, shatter(), F(1215), 0.6)
for f in [1180, 1200, 1222, 1240]: put(sfx, zap(), F(f), 0.5)
put(sfx, boom() * 0.6, F(1241), 0.7); put(sfx, noise_band(2.0, 40, 400) * np.minimum(1, t_(2.0)/0.2), F(1245), 0.5)
# 43.5–51 portal + time tunnel
put(mus, hum(F(1530) - F(1305), 55), F(1305), 0.4); put(mus, riser(1.6), F(1318) - 0.4, 0.4)
pad(F(1305), F(1430), [57, 61, 64, 68], 0.12)
for k in range(int((F(1530) - F(1430)) / 0.25)): put(sfx, click(), F(1530) - k*0.25 - 0.05, 0.6 if k % 2 else 0.4)
put(mus, rev(boom()), F(1430) - 2.0, 0.5); put(mus, lowhit(), F(1430), 0.8)
pad(F(1430), F(1530), [52, 55, 59, 64, 71], 0.13); put(mus, riser(F(1530) - F(1470)), F(1470), 0.6)
# 51–60 finale
put(mus, boom(), F(1530), 1.0)
stabs(F(1530), 59.6, 120, [38, 34, 36, 41], 1.15)
pad(F(1530), 59.8, [50, 57, 62, 65, 69], 0.12)
put(sfx, crackle(59.5 - F(1530), 70), F(1530), 0.45)
put(mus, boom(), 58.9, 0.9)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
