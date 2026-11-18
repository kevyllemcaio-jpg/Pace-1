import numpy as np, wave
SR = 44100; dur = 35.0; N = int(dur*SR); rng = np.random.default_rng(8)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def lovey(t0, t1, bpm=96):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, kick()*0.6, s, 0.4 if b % 2 == 0 else 0)
        if b % 2: put(mus, snare()*0.4, s, 0.25)
        put(mus, hat(), s + beat/2, 0.15)
        if b % 4 == 0: put(mus, note(midi([48, 53, 55, 52][(b//4) % 4]), beat*3.8, 'pluck', 1.0), s, 0.45)
        put(mus, note(midi([72, 76, 79, 76, 77, 81, 79, 74][b % 8]), beat*0.8, 'bell', 0.35), s, 0.13)
        b += 1
lovey(0, F(663))
t = t_(F(742) - F(663)); put(mus, np.sin(2*np.pi*55*t) * np.minimum(1, t/0.2) * 0.4, F(699), 0.6)
lovey(F(742), F(976), 110)
t = t_(dur - F(976)); put(mus, sum(np.sin(2*np.pi*midi(m)*t) for m in (72, 76, 79)) / 3 * np.minimum(1, t/0.3), F(976), 0.4)
for f in [110, 180, 246, 299, 406, 448, 583, 663, 742, 801, 852, 903, 976]: put(sfx, whoosh(), F(f)-0.18, 0.45)
put(sfx, pop(), F(14), 0.6); put(sfx, ting(2093), F(150), 0.4); put(sfx, pop(), F(200), 0.5)
put(sfx, lowhit()*0.6, F(254), 0.6)
for k, f in enumerate([325, 346, 367]): put(sfx, pop(), F(f), 0.5 + k*0.1)
put(sfx, ting(2637), F(410), 0.4); put(sfx, pop(), F(517), 0.5); put(sfx, ting(1760), F(549), 0.5)
put(sfx, boing()*0.5, F(620), 0.4); put(sfx, lowhit(), F(699), 0.9); put(sfx, pop(), F(699), 0.7)
for k in range(5): put(sfx, boing()*0.3, F(750) + k*0.3, 0.3)
put(sfx, scrape(0.3)*0.4, F(840), 0.4); put(sfx, ting(2349), F(930), 0.4); put(sfx, ting(3136), F(945), 0.4)
put(sfx, thud(), F(994), 0.7); put(sfx, boing()*0.6, F(995), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
