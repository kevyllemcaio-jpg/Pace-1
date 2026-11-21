import numpy as np, json, wave
SR = 44100; DUR = 44.0; N = int(DUR*SR); rng = np.random.default_rng(23)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
S = [0.06, 2.797, 5.283, 7.982, 10.493, 13.821, 18.683, 22.154, 25.519, 27.257, 29.544, 32.079, 34.059, 36.315, 38.525]
def bounce(t0, t1, roots, bpm=118, g=1.0):  # playful pluck + bell + light drums
    beat = 60/bpm; b = 0
    while t0 + b*beat/2 < t1:
        s = t0 + b*beat/2; r = roots[(b//8) % len(roots)]
        if b % 2 == 0: put(mus, note(midi(r - 12), beat*0.9, 'pluck', 0.2), s, 0.4*g)
        put(mus, note(midi(r + [12, 16, 19, 24, 19, 16, 12, 19][b % 8]), beat*0.4, 'bell', 0.12), s, 0.13*g)
        if b % 4 == 0: put(mus, kick()*0.6, s, g)
        if b % 4 == 2: put(mus, snare()*0.35, s, g)
        put(mus, hat()*0.4, s, g); b += 1
# day: playful (0 – night)
bounce(0, S[6], [60, 65, 67, 64], 118, 1.0)
# night: tension under the monster
pad(S[6], S[8], [45, 48, 51], 0.14); stabs(S[6] + 1.6, S[7], 100, [33, 36], 0.8)
# comic: it worked
bounce(S[8], S[11], [62, 67, 69, 66], 122, 0.9)
# midnight: soft, then twist hit, then warm ending
pad(S[11], S[13], [50, 53, 57], 0.12); put(mus, riser(1.0), S[13] - 1.0, 0.35); put(mus, boom(), S[13] + 1.2, 0.7)
bounce(S[14], DUR - 0.3, [60, 64, 65, 67], 112, 0.9)
# cuts: soft whoosh on every cut, pop on every on-screen tag
CUTS = [1.4, 2.8, 4.1, 5.28, 6.6, 7.98, 9.3, 10.49, 12.1, 13.82, 15.6, 17.0, 18.683, 20.3, 22.154, 23.8, 25.519, 27.257, 28.4, 29.544, 30.8, 32.079, 33.1, 34.059, 35.3, 36.315, 37.5, 38.525]
for c in CUTS: put(sfx, whoosh(0.3), c - 0.12, 0.25)
for t in [0.05, 0.55, 1.5, 3.4, 4.3, 5.35, 8.1, 12.2, 13.9, 15.65, 17.05, 17.7, 19.4, 20.4, 25.9, 26.5, 28.45, 30.9, 31.95, 32.45, 33.15, 35.35, 37.55, 37.75, 38.6, 38.85, 39.6, 40.2]: put(sfx, pop(), t, 0.45)
# specific
for k in range(6): put(sfx, thud()*0.7, 8.05 + k*0.29, 0.6)            # punches on the tree
put(sfx, ting(2637), 10.6, 0.3)                                        # sorry
for k in range(20): put(sfx, click(), 13.85 + k*0.08, 0.35)           # blocks dropping
put(sfx, ting(2093), 15.65, 0.35); put(sfx, ting(2349), 17.05, 0.35); put(sfx, ting(2637), 17.7, 0.35)
put(sfx, lowhit(), 20.35, 0.6)                                         # monster
for k in range(8): put(sfx, thud()*0.35, 20.4 + k*0.22, 0.4)           # monster steps
put(sfx, boing(), 24.1, 0.5)                                           # monster freezes
for k in range(6): put(sfx, scrape(0.15), 25.6 + k*0.22, 0.4)         # wiping feet
put(sfx, ting(3136), 28.45, 0.45); put(sfx, ting(4186), 28.6, 0.3)    # diamond
put(sfx, pop(), 31.1, 0.5); put(sfx, thud(), 31.95, 0.5)              # tub lid
put(sfx, dingdong(), 32.4, 0.4)                                        # midnight
put(sfx, boing(), 35.35, 0.4); put(sfx, cheer(1.6)*0.5, 38.6, 0.35)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
