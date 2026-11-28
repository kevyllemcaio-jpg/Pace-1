import numpy as np, wave
SR = 44100; dur = 48.33; N = int(dur*SR); rng = np.random.default_rng(71)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda n: (n + 9)/30
def sneak(t0, t1, bpm=100):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 48, 50, 52][(b//2) % 4] - 12), beat*0.8, 'pluck', 0.12), s, 0.6)
        if b % 2: put(mus, snare()*0.4, s, 0.25)
        put(mus, hat(), s + beat/2, 0.18)
        if b % 4 == 0: put(mus, note(midi([69, 72, 71, 67][(b//4) % 4]), beat*0.5, 'bell', 0.2), s, 0.16)
        b += 1
def love(t0, t1):
    b = 0
    while t0 + b*0.5 < t1: put(mus, note(midi([76, 79, 81, 79, 76, 74][b % 6]), 1.0, 'bell', 0.5), t0 + b*0.5, 0.14); b += 1
march(mus, 0, F(126), 128, True)
sneak(F(126), F(1098))
t = t_(F(1143) - F(1098)); put(mus, np.sin(2*np.pi*midi(64)*t) * np.minimum(1, t/0.3) * np.exp(-t*0.4) * 0.25, F(1098), 0.5)
love(F(1143), dur)
for n in [126, 213, 269, 341, 397, 498, 572, 638, 706, 774, 857, 923, 1098, 1143, 1311]: put(sfx, whoosh(), F(n)-0.18, 0.4)
put(sfx, pop(), (40+9)/30, 0.6); put(sfx, ting(1760), F(160), 0.3)
put(sfx, scrape(0.3)*0.4, F(225), 0.4); put(sfx, pop(), F(242), 0.5)
put(sfx, ting(2093), F(285), 0.4); put(sfx, ting(2637), F(350), 0.35)
put(sfx, lowhit(), F(528), 0.7); put(sfx, cheer(1.2), F(530), 0.35)
put(sfx, scrape(0.6)*0.4, F(585), 0.4)
for k in range(6): put(sfx, ting(1568 + k*90)*0.5, F(712) + k*0.25, 0.2)
put(sfx, thud(), F(792), 0.7); put(sfx, cheer(1.8), F(780), 0.45)
for k in range(5): put(sfx, click(), F(860)+k*0.14, 0.3)
put(sfx, boing()*0.5, F(900), 0.4); put(sfx, lowhit(), F(1023), 0.5)
for k in range(4): put(sfx, click()*0.6, F(1150)+k*0.4, 0.3)
for k in range(10): put(sfx, scrape(0.08)*0.3, F(1240)+k*0.1, 0.25)
for i in range(4): put(sfx, ting(1568+i*300), F(1395)+i*0.2, 0.3)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
