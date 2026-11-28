import numpy as np, wave
SR = 44100; dur = 54.97; N = int(dur*SR); rng = np.random.default_rng(83)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda n: (n + 9)/30
def sneak(t0, t1, bpm=100, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 48, 50, 52][(b//2) % 4] - 12), beat*0.8, 'pluck', 0.12), s, 0.6*g)
        if b % 2: put(mus, snare()*0.4, s, 0.25*g)
        put(mus, hat(), s + beat/2, 0.18*g)
        if b % 4 == 0: put(mus, note(midi([69, 72, 71, 67][(b//4) % 4]), beat*0.5, 'bell', 0.2), s, 0.16*g)
        b += 1
def love(t0, t1):
    b = 0
    while t0 + b*0.5 < t1: put(mus, note(midi([76, 79, 81, 79, 76, 74][b % 6]), 1.0, 'bell', 0.5), t0 + b*0.5, 0.14); b += 1
march(mus, 0, F(109), 128, True)
sneak(F(109), F(864), 104)
sneak(F(864), F(1038), 140, 1.2)
t = t_(F(1083) - F(1038)); put(mus, np.sin(2*np.pi*midi(64)*t) * np.minimum(1, t/0.3) * np.exp(-t*0.4) * 0.25, F(1038), 0.5)
sneak(F(1083), F(1271), 90, 0.8)
love(F(1271), F(1526))
march(mus, F(1526), dur, 128, True)
for n in [109, 159, 242, 328, 413, 470, 549, 601, 683, 799, 864, 1038, 1083, 1184, 1271, 1426, 1526]: put(sfx, whoosh(), F(n)-0.18, 0.4)
put(sfx, pop(), F(10), 0.5); put(sfx, ting(2093), F(112), 0.3)
put(sfx, pop(), F(167), 0.4); put(sfx, ting(2637), F(277), 0.35); put(sfx, pop(), F(340), 0.4)
put(sfx, ting(3136), F(432), 0.5); put(sfx, thud()*0.5, F(440), 0.5)
put(sfx, boing()*0.5, F(552), 0.4); put(sfx, pop(), F(610), 0.4)
put(sfx, lowhit(), F(745), 0.6); put(sfx, pop(), F(820), 0.5)
put(sfx, lowhit(), F(960), 0.8)
for k in range(4): put(sfx, click()*0.6, F(1090)+k*0.35, 0.3)
put(sfx, scrape(0.6)*0.6, F(1146), 0.6); put(sfx, thud(), F(1150), 0.5)
put(sfx, ting(1760), F(1217), 0.4)
for i in range(4): put(sfx, ting(1568+i*300), F(1369)+i*0.2, 0.3)
for k in range(12): put(sfx, ting(2400 + (k % 3)*200)*0.4, F(1530)+k*0.12, 0.2)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
