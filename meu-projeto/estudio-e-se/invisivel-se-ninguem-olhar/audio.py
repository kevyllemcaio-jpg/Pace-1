import numpy as np, wave
SR = 44100; dur = 35.0; N = int(dur*SR); rng = np.random.default_rng(21)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def sneak(t0, t1, bpm=112):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 45, 48, 47][(b//2) % 4] - 12), beat*0.6, 'pluck', 0.1), s, 0.6)
        if b % 2: put(mus, snare()*0.5, s, 0.3)
        put(mus, hat(), s + beat/2, 0.2)
        if b % 4 == 2: put(mus, note(midi([69, 72, 76, 74][(b//4) % 4]), beat*0.4, 'bell', 0.15), s, 0.2)
        b += 1
sneak(0, F(528)); march(mus, F(528), F(674), 120, False); sneak(F(674), F(821), 120); march(mus, F(821), dur, 128, True)
for f in [119, 207, 281, 344, 528, 674, 821, 960]: put(sfx, whoosh(), F(f)-0.18, 0.45)
for k in range(13): put(sfx, pop()*0.6, F(9*k), 0.3)
for f in [166, 311]: put(sfx, rev(whoosh(0.4)) if 'rev' in dir() else whoosh(0.4), F(f), 0.5); put(sfx, ting(2637), F(f), 0.35)
put(sfx, ting(1046), F(242), 0.3); put(sfx, lowhit()*0.5, F(311), 0.5)
for k in range(14): put(sfx, whoosh(0.15)*0.6, F(350) + k*0.32*(1 - k*0.035), 0.35)
put(sfx, boing()*0.5, F(500), 0.4); put(sfx, lowhit()*0.6, F(641), 0.5)
for k in range(3): put(sfx, pop(), F(767 + k*9), 0.5)
put(sfx, click()*1.5, F(938), 0.8); put(sfx, ting(3136), F(940), 0.4); put(sfx, boing()*0.4, F(990), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
