import numpy as np, wave
SR = 44100; dur = 66.33; N = int(dur*SR); rng = np.random.default_rng(139)
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
piano(0, F(636), 0.6, 0.9)
def rumble(t0, d, g=0.6): put(sfx, noise_band(d, 30, 300) * env(int(d*SR), 0.02, d*0.7), t0, g)
def heart(t0, t1, bpm=70, g=1.0):
    b = 0; beat = 60/bpm
    while t0 + b*beat < t1: put(mus, kick()*0.7, t0 + b*beat, 0.35*g); put(mus, kick()*0.5, t0 + b*beat + 0.22, 0.25*g); b += 1
t = t_(F(1006) - F(674)); put(mus, (np.sin(2*np.pi*midi(40)*t) + 0.5*np.sin(2*np.pi*midi(47)*t)) * np.minimum(1, t/2) * 0.09, F(674), 1.0)
heart(F(716), F(1284), 66)
drive(F(1284), F(1415), 140, 0.8); heart(F(1415), F(1743), 90, 0.8)
piano(F(1821), dur, 0.6, 1.1)
for t0 in np.arange(F(543), F(1821), 0.5): put(sfx, noise_band(0.6, 800, 6000) * 0.2, t0, 0.12)
for t0 in np.arange(F(1821), dur, 0.5): put(sfx, noise_band(0.6, 800, 6000) * 0.25, t0, 0.18)
rumble(F(600), 2.5, 0.9); rumble(F(1228), 2.0, 0.8)
put(sfx, lowhit(), F(674), 0.7); put(sfx, click(), F(870), 0.5)
for k in range(4): put(sfx, scrape(0.2)*0.4, F(420)+k*0.3, 0.3)
for k in range(3): put(sfx, click()*0.8, F(1095)+k*0.15, 0.4); put(sfx, click()*0.8, F(1150)+k*0.15, 0.4)
put(sfx, thud(), F(1228), 0.7); put(sfx, thud(), F(1236), 0.5)
put(sfx, note(880, 0.3, 'bell', 0.1)*0.5, F(1356), 0.3); put(sfx, note(660, 0.4, 'bell', 0.1)*0.5, F(1368), 0.3)
put(sfx, ting(2093), F(1437), 0.4); put(sfx, scrape(0.4)*0.4, F(1637), 0.3); put(sfx, scrape(0.4)*0.4, F(1700), 0.3)
put(sfx, note(440, 0.6, 'bell', 0.3)*0.5, F(1763), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
