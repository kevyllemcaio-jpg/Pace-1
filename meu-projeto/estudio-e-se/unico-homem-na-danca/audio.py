import numpy as np, wave
SR = 44100; dur = 41.67; N = int(dur*SR); rng = np.random.default_rng(41)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def latin(t0, t1, bpm=104):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, kick(), s, 0.6)
        put(mus, snare()*0.5, s + beat*0.75, 0.25); put(mus, hat(), s + beat/2, 0.2); put(mus, click(), s + beat*0.25, 0.15)
        root = [45, 50, 52, 45][(b//4) % 4]; put(mus, note(midi(root - 12 + (7 if b % 2 else 0)), beat*0.5, 'pluck', 0.12), s, 0.6)
        if b % 2 == 0: put(mus, note(midi(root + 24 + [0, 3, 7, 10][(b//2) % 4]), beat*0.4, 'bell', 0.2), s + beat*0.5, 0.15)
        b += 1
latin(0, F(387)); t = t_(F(472) - F(387)); put(mus, np.sin(2*np.pi*55*t) * np.minimum(1, t/0.2) * 0.5, F(387), 0.5)
latin(F(472), F(773), 112); latin(F(773), F(1200), 96)
t = t_(dur - F(1200)); put(mus, sum(np.sin(2*np.pi*midi(m)*t) for m in (57, 60, 64)) / 3 * np.exp(-t*0.6), F(1200), 0.5)
for f in [116, 204, 290, 387, 472, 545, 597, 676, 773, 854, 933, 1042, 1103, 1200]: put(sfx, whoosh(), F(f)-0.18, 0.4)
put(sfx, lowhit()*0.6, F(230), 0.6); put(sfx, pop(), F(322), 0.4)
for k in range(5): put(sfx, thud()*0.4, F(422) + k*0.25, 0.4)
put(sfx, noise_band(0.25, 1500, 6000) * env(int(0.25*SR), 0.001, 0.05), F(562), 0.9); put(sfx, lowhit(), F(562), 0.6)
put(sfx, thud(), F(690), 0.5); put(sfx, boing()*0.5, F(730), 0.4)
put(sfx, pop(), F(805), 0.4); put(sfx, pop(), F(884), 0.4); put(sfx, ting(2637), F(1060), 0.4)
put(sfx, pop(), F(1135), 0.4); put(sfx, cheer(1.4), F(1205), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
