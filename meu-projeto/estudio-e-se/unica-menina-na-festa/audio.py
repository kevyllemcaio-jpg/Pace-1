import numpy as np, wave
SR = 44100; dur = 33.67; N = int(dur*SR); rng = np.random.default_rng(61)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
march(mus, 0, F(320), 122, False)
beat = 60/140; b = 0
while F(320) + b*beat < F(541):
    s = F(320) + b*beat; put(mus, kick(), s, 0.7); put(mus, hat(), s + beat/2, 0.25)
    if b % 2: put(mus, snare(), s, 0.4)
    put(mus, np.sign(np.sin(2*np.pi*midi([60, 64, 67, 72, 67, 64, 62, 65][b % 8])*t_(beat*0.4))) * env(int(beat*0.4*SR), 0.002, 0.1), s, 0.08); b += 1
t = t_(F(597) - F(541)); put(mus, np.sin(2*np.pi*110*t) * 0.05, F(541), 0.3)
march(mus, F(597), F(787), 140, True); march(mus, F(787), dur, 118, False)
for f in [121, 189, 241, 320, 398, 541, 597, 700, 787, 910]: put(sfx, whoosh(), F(f)-0.18, 0.4)
put(sfx, pop(), F(20), 0.5); put(sfx, boing()*0.4, F(155), 0.4); put(sfx, scrape(0.3)*0.4, F(208), 0.4)
for f in [417, 461]: put(sfx, ting(2093), F(f), 0.5); put(sfx, pop(), F(f), 0.4)
put(sfx, cheer(1.4), F(505), 0.6); put(sfx, ting(2637), F(505), 0.5)
for k in range(6): put(sfx, click()*0.4, F(548) + k*0.5, 0.3)
for k in range(4): put(sfx, thud(), F(712 + k*12), 0.6); put(sfx, whoosh(0.2), F(712 + k*12), 0.4)
put(sfx, pop(), F(830), 0.4); put(sfx, pop(), F(938), 0.4); put(sfx, cheer(1.0), F(965), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
