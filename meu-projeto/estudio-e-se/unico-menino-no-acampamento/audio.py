import numpy as np, wave
SR = 44100; dur = 51.13; N = int(dur*SR); rng = np.random.default_rng(127)
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
def crickets(t0, t1):
    t = t0
    while t < t1: put(sfx, note(4200, 0.05, 'bell', 0.03)*0.4, t, 0.15); t += 0.35 + 0.2*np.sin(t*7)**2
march(mus, 0, F(119), 128, True)
march(mus, F(119), F(424), 124, True)
sneak(F(424), F(913), 100)
t = t_(F(1029) - F(913)); put(mus, np.sin(2*np.pi*midi(52)*t) * np.minimum(1, t/0.5) * 0.2, F(913), 0.6)
sneak(F(1029), F(1193), 150, 1.2)
march(mus, F(1242), dur, 132, True)
crickets(0, F(119)); crickets(F(424), F(1242))
for n in [119, 229, 283, 357, 424, 534, 613, 770, 913, 1029, 1100, 1193, 1242, 1412]: put(sfx, whoosh(), F(n)-0.18, 0.4)
put(sfx, pop(), F(40), 0.5); put(sfx, ting(2093), F(130), 0.3); put(sfx, cheer(1.2), F(232), 0.4)
put(sfx, lowhit(), F(389), 0.6)
for k in range(4): put(sfx, thud()*0.5, F(540)+k*0.3, 0.4)
for k in range(8): put(sfx, click(), F(650)+k*0.18, 0.25)
put(sfx, lowhit(), F(720), 0.5); put(sfx, pop(), F(812), 0.4)
put(sfx, scrape(0.5)*0.6, F(976), 0.6); put(sfx, lowhit(), F(979), 0.7)
put(sfx, cheer(2.0), F(1100), 0.5); put(sfx, lowhit(), F(1130), 0.5)
put(sfx, boing()*0.5, F(1203), 0.5)
for k in range(20): put(sfx, ting(2600)*0.3, F(1300)+k*0.18, 0.15)
put(sfx, noise_band(1.2, 200, 3000)*env(int(1.2*SR), 0.3, 0.6), F(1460), 0.4); put(sfx, cheer(2.0), F(1470), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
