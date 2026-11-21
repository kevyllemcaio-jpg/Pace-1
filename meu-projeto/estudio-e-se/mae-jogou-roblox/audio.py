import numpy as np, json, wave
SR = 44100; DUR = 42.0; N = int(DUR*SR); rng = np.random.default_rng(29)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
S = [0.06, 2.626, 7.611, 10.286, 13.97, 17.313, 20.204, 21.996, 23.821, 26.379, 30.756, 33.382, 35.274]
def bounce(t0, t1, roots, bpm=118, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat/2 < t1:
        s = t0 + b*beat/2; r = roots[(b//8) % len(roots)]
        if b % 2 == 0: put(mus, note(midi(r - 12), beat*0.9, 'pluck', 0.2), s, 0.4*g)
        put(mus, note(midi(r + [12, 16, 19, 24, 19, 16, 12, 19][b % 8]), beat*0.4, 'bell', 0.12), s, 0.13*g)
        if b % 4 == 0: put(mus, kick()*0.6, s, g)
        if b % 4 == 2: put(mus, snare()*0.35, s, g)
        put(mus, hat()*0.4, s, g); b += 1
bounce(0, S[2], [60, 65, 67, 64], 118)
stabs(S[2], S[4], 140, [40, 43], 0.8)                         # lava: urgent
bounce(S[4], S[7], [62, 67, 69, 66], 120, 0.9)                 # chat roast
pad(S[7], S[9], [55, 59, 62, 66], 0.12)                         # shop shimmer
put(mus, riser(0.8), S[9] - 0.8, 0.3)
bounce(S[9], DUR - 0.3, [60, 64, 65, 67], 126, 1.0)            # restaurant rush
CUTS = [1.4, 2.626, 4.0, 5.5, 7.611, 8.9, 10.286, 12.0, 13.97, 15.6, 17.313, 18.8, 20.204, 21.996, 23.821, 25.1, 26.379, 27.9, 29.3, 30.756, 32.0, 33.382, 34.3, 35.274]
for c in CUTS: put(sfx, whoosh(0.3), c - 0.12, 0.25)
for t in [0.05, 0.55, 1.45, 2.7, 4.1, 5.6, 6.4, 7.7, 12.05, 14.4, 16.4, 18.9, 20.9, 22.05, 22.4, 25.5, 26.42, 27.95, 29.35, 32.05, 33.42, 34.35, 35.3, 35.6, 36.4, 37.0]: put(sfx, pop(), t, 0.45)
for k in range(12): put(sfx, click(), 2.7 + k*0.166, 0.3)             # outfit swaps
put(sfx, ting(2637), 5.6, 0.35); put(sfx, ting(3136), 5.75, 0.3)
for k in range(4): put(sfx, boing()*0.6, 7.7 + k*0.7, 0.35)          # jumps
put(sfx, noise_band(0.6, 200, 2000) * np.exp(-t_(0.6)*5), 9.6, 0.6)   # lava splash
for k in range(9): put(sfx, ting(1568 + k*90)*0.6, 9.5 + k*0.08, 0.25)  # counter
for k in range(3): put(sfx, noise_band(0.4, 200, 2000) * np.exp(-t_(0.4)*6), 12.45 + k*0.9, 0.45)
put(sfx, ting(2093), 14.4, 0.4)                                        # chat msg
for k in range(28): put(sfx, click()*0.7, 17.35 + k*0.045, 0.3)       # typing
put(sfx, ting(2349), 18.6, 0.4)
put(sfx, whoosh(0.4), 20.7, 0.5); put(sfx, pop(), 20.75, 0.6)         # kid poofs
put(sfx, ting(3136), 22.1, 0.3); put(sfx, ting(4186), 22.3, 0.25)
put(sfx, lowhit(), 23.85, 0.5); put(sfx, thud(), 25.15, 0.6)
put(sfx, cheer(1.4)*0.5, 26.5, 0.3); put(sfx, dingdong(), 30.8, 0.4)
for k in range(8): put(sfx, thud()*0.3, 32.0 + k*0.16, 0.3)          # running steps
put(sfx, ting(2637), 33.42, 0.4); put(sfx, cheer(1.6)*0.5, 35.3, 0.3)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
