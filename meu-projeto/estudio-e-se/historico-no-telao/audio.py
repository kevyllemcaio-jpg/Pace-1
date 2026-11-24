import numpy as np, wave
SR = 44100; dur = 47.13; N = int(dur*SR); rng = np.random.default_rng(97)
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
def shower(t0, t1):  # "cantoria" desafinada no banho
    b = 0
    while t0 + b*0.32 < t1: put(mus, note(midi([72, 74, 76, 79, 77, 76, 74, 71][b % 8] + (b % 3 == 0) * 1), 0.4, 'bell', 0.3), t0 + b*0.32, 0.25); b += 1
march(mus, 0, F(122), 128, True)
sneak(F(122), F(1030), 104)
shower(F(1030), F(1145))
march(mus, F(1190), dur, 132, True)
for n in [122, 195, 281, 394, 513, 562, 700, 765, 877, 965, 1030, 1145, 1190, 1262, 1341]: put(sfx, whoosh(), F(n)-0.18, 0.4)
put(sfx, pop(), F(30), 0.5); put(sfx, click(), F(240), 0.5); put(sfx, ting(1760), F(242), 0.3)
put(sfx, lowhit(), F(332), 0.7)
for n in (425, 590, 790): put(sfx, ting(2093), F(n), 0.4)
put(sfx, cheer(1.2), F(515), 0.35); put(sfx, pop(), F(733), 0.4)
for k in range(12): put(sfx, click(), F(887)+k*0.12, 0.35)
for k in range(8): put(sfx, ting(800 + k*200)*0.5, F(968)+k*0.09, 0.25)
put(sfx, lowhit(), F(991), 0.7)
put(sfx, cheer(2.2), F(1223), 0.55); put(sfx, cheer(1.5), F(1240), 0.4)
put(sfx, pop(), F(1295), 0.6); put(sfx, ting(2637), F(1300), 0.4); put(sfx, boing()*0.5, F(1350), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
