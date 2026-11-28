import numpy as np, wave
SR = 44100; dur = 54.47; N = int(dur*SR); rng = np.random.default_rng(101)
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
def love(t0, t1, beat=0.5):
    b = 0
    while t0 + b*beat < t1: put(mus, note(midi([76, 79, 81, 79, 76, 74][b % 6]), beat*2, 'bell', 0.5), t0 + b*beat, 0.14); b += 1
love(0, F(120))
sneak(F(120), F(634), 104)
march(mus, F(634), F(911), 120, True)
love(F(911), F(1071), 0.7)
t = t_(F(1144) - F(1071)); put(mus, np.sin(2*np.pi*midi(64)*t) * np.minimum(1, t/0.3) * np.exp(-t*0.4) * 0.25, F(1071), 0.5)
sneak(F(1144), F(1460), 96, 0.8)
march(mus, F(1460), dur, 132, True)
for n in [120, 206, 267, 339, 441, 526, 634, 747, 832, 911, 1071, 1210, 1293, 1460, 1516]: put(sfx, whoosh(), F(n)-0.18, 0.4)
put(sfx, pop(), F(30), 0.5); put(sfx, ting(2093), F(225), 0.4); put(sfx, lowhit(), F(300), 0.7)
put(sfx, ting(2637), F(345), 0.3); put(sfx, ting(3136), F(389), 0.4)
put(sfx, cheer(1.5), F(470), 0.45)
for k in range(7): put(sfx, pop()*0.5, F(530) + k*0.45, 0.3)
put(sfx, cheer(2.0), F(690), 0.4); put(sfx, ting(1760), F(764), 0.3)
put(sfx, scrape(0.3)*0.4, F(850), 0.4)
for k in range(6): put(sfx, ting(1200 + k*150)*0.4, F(976) + k*0.25, 0.2)
put(sfx, whoosh(0.5), F(1102), 0.5); put(sfx, thud(), F(1144), 0.9); put(sfx, lowhit(), F(1144), 0.6)
put(sfx, ting(3520), F(1330), 0.5); for_ = None
for i in range(4): put(sfx, ting(1568+i*300), F(1400)+i*0.15, 0.3)
put(sfx, cheer(2.5), F(1460), 0.6); put(sfx, cheer(1.5), F(1575), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
