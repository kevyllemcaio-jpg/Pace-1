import numpy as np, wave
SR = 44100; dur = 44.8; N = int(dur*SR); rng = np.random.default_rng(113)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda n: (n + 9)/30
def smooth(t0, t1, beat=0.6):  # clima "romântico" de novela
    b = 0
    while t0 + b*beat < t1:
        put(mus, note(midi([57, 60, 64, 62][(b//2) % 4] - 12), beat*1.6, 'pluck', 0.4), t0 + b*beat, 0.5)
        if b % 2 == 0: put(mus, note(midi([76, 74, 72, 71][(b//2) % 4]), beat*1.8, 'bell', 0.5), t0 + b*beat, 0.12)
        b += 1
def sneak(t0, t1, bpm=100, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 48, 50, 52][(b//2) % 4] - 12), beat*0.8, 'pluck', 0.12), s, 0.6*g)
        if b % 2: put(mus, snare()*0.4, s, 0.25*g)
        put(mus, hat(), s + beat/2, 0.18*g); b += 1
smooth(0, F(464))
sneak(F(464), F(1082), 100)
smooth(F(1082), F(1250))
march(mus, F(1250), dur, 132, False)
for n in [170, 249, 303, 390, 464, 529, 606, 666, 745, 867, 974, 1082, 1158, 1250]: put(sfx, whoosh(), F(n)-0.18, 0.4)
for k in range(3): put(sfx, thud()*0.6, F(20)+k*0.25, 0.5)
put(sfx, boing()*0.5, F(190), 0.5)
for k in range(3): put(sfx, noise_band(0.15, 2000, 8000)*env(int(0.15*SR), 0.005, 0.1), F(260)+k*0.3, 0.3)
put(sfx, ting(2637), F(340), 0.3); put(sfx, dingdong(), F(400), 0.5); put(sfx, scrape(0.4)*0.4, F(416), 0.4)
put(sfx, lowhit(), F(495), 0.7)
for k in range(20): put(sfx, click()*0.5, F(532)+k*0.06, 0.3)
put(sfx, ting(1046), F(620), 0.3); put(sfx, ting(4186)*0.5, F(690), 0.3)
for k in range(6): put(sfx, click(), F(760)+k*0.3, 0.3)
put(sfx, boing()*0.4, F(820), 0.4)
for k in range(17): put(sfx, ting(3000+k*40)*0.25, F(900)+k*0.12, 0.2)
put(sfx, cheer(1.2), F(1045), 0.4)
for i in range(3): put(sfx, ting(1568+i*300), F(1120)+i*0.2, 0.3)
put(sfx, lowhit(), F(1265), 0.8)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
