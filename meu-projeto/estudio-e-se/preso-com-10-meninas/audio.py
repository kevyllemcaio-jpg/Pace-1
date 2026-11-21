import numpy as np, wave
SR = 44100; dur = 33.67; N = int(dur*SR); rng = np.random.default_rng(51)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
march(mus, 0, F(373), 124, False)
beat = 60/128; b = 0
while F(373) + b*beat < F(472):
    s = F(373) + b*beat; put(mus, kick(), s, 0.8); put(mus, hat(), s + beat/2, 0.3)
    if b % 2: put(mus, snare(), s, 0.45)
    put(mus, note(midi([48, 53, 55, 50][(b//4) % 4] - 12 + (12 if b % 2 else 0)), beat*0.5, 'pluck', 0.1), s, 0.6); b += 1
march(mus, F(472), F(635), 112, False)
t = t_(F(729) - F(635)); put(mus, sum(np.sin(2*np.pi*midi(m)*t) for m in (57, 60, 64)) / 3 * np.minimum(1, t/0.5), F(635), 0.5)
march(mus, F(729), dur, 128, True)
for f in [107, 176, 272, 373, 472, 583, 635, 729, 782, 887]: put(sfx, whoosh(), F(f)-0.18, 0.4)
put(sfx, pop(), F(18), 0.5)
for k in range(5): put(sfx, thud()*0.5, F(118) + k*0.3, 0.4)
for k in range(5): put(sfx, ting(1568 + k*250), F(212) + k*0.2, 0.25)
put(sfx, ting(2637), F(300), 0.4); put(sfx, cheer(1.0), F(336), 0.4)
put(sfx, lowhit(), F(548), 0.7); put(sfx, pop(), F(548), 0.5)
put(sfx, scrape(0.5)*0.4, F(729), 0.5); put(sfx, lowhit()*0.6, F(800), 0.6)
for f in [821, 838, 850]: put(sfx, ting(2093), F(f), 0.35)
put(sfx, boing()*0.5, F(960), 0.4); put(sfx, cheer(1.2), F(975), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
