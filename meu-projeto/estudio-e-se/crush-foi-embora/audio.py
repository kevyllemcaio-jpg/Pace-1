import numpy as np, wave
SR = 44100; dur = 59.97; N = int(dur*SR); rng = np.random.default_rng(131)
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
piano(0, F(882))
drive(F(882), F(1227), 132); piano(F(882), F(1227), 0.45, 0.9, False)
piano(F(1227), dur, 0.6, 1.1)
for k in range(6): put(sfx, thud()*0.3, F(270)+k*0.5, 0.25)
put(sfx, scrape(0.5)*0.3, F(170), 0.3)
for k in range(10): put(sfx, scrape(0.05)*0.2, F(605)+k*0.15, 0.2)
put(sfx, whoosh(0.6), F(1082), 0.5); put(sfx, whoosh(0.8), F(1160), 0.35)
put(sfx, scrape(0.6)*0.3, F(1340), 0.3); put(sfx, ting(1760)*0.6, F(1408), 0.3)
put(sfx, ting(2093)*0.5, F(1689), 0.25); put(sfx, ting(2637)*0.5, F(1732), 0.25)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
