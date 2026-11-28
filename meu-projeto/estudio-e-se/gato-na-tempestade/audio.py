import numpy as np, wave
SR = 44100; dur = 59.47; N = int(dur*SR); rng = np.random.default_rng(137)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda n: (n + 9)/30
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
def piano(t0, t1, beat=0.55, g=1.0, mel=True):
    b = 0
    while t0 + b*beat < t1:
        c = CH[(b // 8) % 4]; s = t0 + b*beat
        put(mus, note(midi(c[b % 3] - 12 + (12 if b % 4 == 3 else 0)), beat*3, 'bell', 0.9), s, 0.10*g)
        if mel and b % 4 == 0: put(mus, note(midi(c[(b//4) % 3] + 12), beat*4, 'bell', 1.2), s, 0.09*g)
        if b % 8 == 0:
            t = t_(beat*8); put(mus, sum(np.sin(2*np.pi*midi(n - 12)*t) for n in c) * np.minimum(1, t/1.0) * np.exp(-t*0.25) * 0.06, s, g)
        b += 1
def drive(t0, t1, bpm=120, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, kick()*0.5, s, 0.35*g); put(mus, hat(), s + beat/2, 0.15*g)
        put(mus, note(midi(CH[(b//4) % 4][0] - 12), beat*0.9, 'pluck', 0.2), s, 0.3*g); b += 1
piano(0, F(832), 0.6)
def rumble(t0, d, g=0.6): put(sfx, noise_band(d, 30, 300) * env(int(d*SR), 0.02, d*0.7), t0, g)
t = t_(F(1236) - F(832)); put(mus, (np.sin(2*np.pi*midi(45)*t) + 0.5*np.sin(2*np.pi*midi(52)*t)) * np.minimum(1, t/1.5) * 0.08, F(832), 1.0)
drive(F(1236), F(1397), 100, 0.7)
piano(F(1397), dur, 0.6, 1.1)
for t0 in np.arange(F(894), F(1651), 0.5): put(sfx, noise_band(0.6, 800, 6000) * 0.25, t0, 0.18)
for t0 in np.arange(0, F(112), 0.5): put(sfx, noise_band(0.6, 800, 6000) * 0.25, t0, 0.18)
rumble(F(20), 1.5, 0.9); rumble(F(975), 2.5, 1.0); rumble(F(860), 2.0, 0.4)
put(sfx, note(1200, 0.3, 'bell', 0.2)*0.3, F(1086), 0.2)
for k in range(3): put(sfx, ting(2093+k*300)*0.4, F(1350)+k*0.2, 0.2)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
