import numpy as np, wave
SR = 44100; dur = 36.0; N = int(dur*SR); rng = np.random.default_rng(5)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def sneak(t0, t1):
    beat = 60/104; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 48, 50, 52][(b//2) % 4] - 12), beat*0.8, 'pluck', 0.12), s, 0.6)
        if b % 2: put(mus, snare()*0.5, s, 0.3)
        put(mus, hat(), s + beat/2, 0.2)
        if b % 4 == 0: put(mus, note(midi([69, 72, 71, 67][(b//4) % 4]), beat*0.5, 'bell', 0.2), s, 0.18)
        b += 1
march(mus, 0, F(177), 132, False)
sneak(F(177), F(687))
t = t_(F(774) - F(687)); put(mus, np.sin(2*np.pi*midi(64)*t) * np.minimum(1, t/0.3) * np.exp(-t*0.3) * 0.3, F(687), 0.5)
t = t_(F(959) - F(866)); put(mus, (np.sin(2*np.pi*midi(76)*t) + 0.5*np.sin(2*np.pi*midi(79)*t)) * np.minimum(1, t/0.4) * 0.15, F(866), 0.6)
march(mus, F(959), dur, 128, True)
for f in [98, 177, 248, 315, 410, 527, 564, 623, 687, 774, 866, 959]: put(sfx, whoosh(), F(f)-0.18, 0.45)
put(sfx, pop(), F(20), 0.6)
for k in range(8): put(sfx, click(), F(100)+k*0.18, 0.3)
put(sfx, lowhit()*0.6, F(144), 0.5); put(sfx, ting(1760), F(144), 0.4)
put(sfx, scrape(0.4)*0.4, F(218), 0.6); put(sfx, lowhit(), F(220), 0.6)
for k in range(9): put(sfx, click()*0.6, F(250)+k*0.33, 0.3)
put(sfx, boing()*0.5, F(330), 0.4); put(sfx, ting(2349), F(392), 0.4)
put(sfx, lowhit(), F(530), 0.8); put(sfx, pop(), F(530), 0.5)
put(sfx, thud(), F(578), 0.5); put(sfx, pop(), F(603), 0.5)
for i in range(4): put(sfx, ting(1568+i*300), F(645)+i*0.2, 0.25)
put(sfx, scrape(0.3)*0.5, F(705), 0.5); put(sfx, whoosh(0.4), F(728), 0.6)
put(sfx, noise_band(0.8, 300, 4000) * env(int(0.8*SR), 0.002, 0.25), F(735), 0.9); put(sfx, thud(), F(735), 0.6)
put(sfx, pop()*0.6, F(782), 0.4); put(sfx, ting(1046), F(823), 0.3)
put(sfx, ting(2637), F(905), 0.4); put(sfx, cheer(1.4), F(975), 0.5); put(sfx, cheer(1.2), F(1010), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
