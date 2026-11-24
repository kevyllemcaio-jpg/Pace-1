import numpy as np, wave
SR = 44100; dur = 41.4; N = int(dur*SR); rng = np.random.default_rng(7)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
def spooky(t0, t1):
    b = 0
    while t0 + b*0.6 < t1: put(mus, note(midi([64, 63, 64, 67, 66, 63][b % 6]), 1.2, 'bell', 0.6), t0 + b*0.6, 0.12); b += 1
    t = t_(t1 - t0); put(mus, np.sin(2*np.pi*midi(40)*t) * np.minimum(1, t/0.8) * 0.12, t0, 1.0)
march(mus, 0, 25.09, 132, True)
spooky(25.4, 37.46)
march(mus, 37.46, dur, 136, True)
for t in [3.19, 6.98, 9.40, 11.97, 15.80, 17.97, 21.13, 22.69, 25.09, 27.82, 30.74, 32.73, 35.09, 37.46]: put(sfx, whoosh(), t - 0.18, 0.4)
put(sfx, pop(), 1.0, 0.5)
for k in range(6): put(sfx, click()*0.6, 4.0 + k*0.3, 0.3)
put(sfx, ting(2093), 13.9, 0.5); put(sfx, boing()*0.4, 14.3, 0.4)
for k in range(8): put(sfx, ting(2400 + k*150)*0.4, 16.6 + k*0.08, 0.25)
put(sfx, ting(2637), 19.3, 0.4); put(sfx, cheer(1.2), 19.6, 0.4)
for k in range(5): put(sfx, thud()*0.5, 22.9 + k*0.2, 0.4)
put(sfx, lowhit(), 25.4, 0.5); put(sfx, cheer(1.8), 28.6, 0.5)
for k in range(3): put(sfx, thud()*0.8, 31.45 + k*0.25, 0.6)
put(sfx, lowhit(), 33.0, 0.6)
for i in range(5): put(sfx, ting(1568+i*250), 35.8+i*0.12, 0.3)
put(sfx, cheer(2.5), 37.5, 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
