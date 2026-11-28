import numpy as np, wave
SR = 44100; DUR = 40.0; N = int(DUR*SR); rng = np.random.default_rng(41)
exec(open('synth3.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
F = lambda f: f / 30
def creep(t0, t1, g=1.0):  # music-box horror loop
    beat = 0.42; b = 0; seq = [76, 75, 76, 71, 74, 72, 69, 64]
    while t0 + b*beat < t1: put(mus, note(midi(seq[b % 8]), beat*1.6, 'bell', 0.5), t0 + b*beat, 0.16*g); b += 1
def bounce(t0, t1, roots, bpm=120, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat/2 < t1:
        s = t0 + b*beat/2; r = roots[(b//8) % len(roots)]
        if b % 2 == 0: put(mus, note(midi(r - 12), beat*0.9, 'pluck', 0.2), s, 0.4*g)
        put(mus, note(midi(r + [12, 16, 19, 24, 19, 16, 12, 19][b % 8]), beat*0.4, 'bell', 0.12), s, 0.13*g)
        if b % 4 == 0: put(mus, kick()*0.6, s, g)
        if b % 4 == 2: put(mus, snare()*0.35, s, g)
        put(mus, hat()*0.4, s, g); b += 1
pad(0, F(806), [45, 48, 52], 0.10); creep(0, F(806))
put(mus, hum(F(900) - F(806), 41), F(806), 0.5)                    # suspense drone
put(mus, boom(), F(856), 1.0); put(sfx, screech(1.0), F(856), 0.6)  # the scare
bounce(F(901), DUR - 0.3, [60, 65, 67, 64], 120)
CUTS = [56, 119, 166, 219, 244, 291, 362, 421, 506, 571, 621, 669, 721, 806, 901, 951, 1021]
for c in CUTS: put(sfx, whoosh(0.3), F(c) - 0.12, 0.25)
for f in [4, 60, 119, 172, 244, 300, 344, 362, 440, 506, 624, 669, 740, 901, 958, 1025, 1045, 1075]: put(sfx, pop(), F(f), 0.45)
for k in range(2): put(sfx, thud()*0.8, F(132) + k*0.45, 0.6)      # toc toc
put(sfx, lowhit(), F(219), 0.5)                                       # scream hit
put(sfx, whoosh(1.2), F(296), 0.5); put(sfx, scrape(0.3), F(320), 0.5); put(sfx, thud(), F(344), 0.6)
for f in [450, 474]: put(sfx, boing(), F(f), 0.5); put(sfx, ting(3136), F(f), 0.3)
put(sfx, scrape(0.4), F(574), 0.5); put(sfx, pop(), F(596), 0.7)
for k in range(4): put(sfx, click()*0.8, F(600) + k*0.1, 0.5)        # crunch
put(sfx, click(), F(669), 0.6)                                        # flashlight
put(sfx, ting(2093), F(905), 0.4); put(sfx, cheer(1.4)*0.5, F(1025), 0.3)
for k in range(6): put(sfx, scrape(0.2), F(955) + k*0.4, 0.3)         # sweeping
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
