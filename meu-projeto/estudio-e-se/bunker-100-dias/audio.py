import numpy as np, wave
SR = 44100; DUR = 61.0; N = int(DUR*SR); rng = np.random.default_rng(71)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
exec(open('fx.py').read())
def heart():
    tt = t_(0.5); return (np.sin(2*np.pi*55*tt) * np.exp(-tt*18) + 0.7*np.sin(2*np.pi*50*np.maximum(0, tt-0.18)) * np.exp(-np.maximum(0, tt-0.18)*18) * (tt > 0.18))
def piano(t0, t1, roots, bpm=84, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; r = roots[(b//4) % len(roots)]
        put(mus, note(midi(r - 12), beat*3.5, 'pluck', 1.2), s, 0.35*g) if b % 4 == 0 else None
        put(mus, note(midi(r + [12, 16, 19, 16][b % 4]), beat*0.9, 'bell', 0.5), s, 0.12*g); b += 1
# hook + door slam
put(mus, riser(1.6), 0, 0.3); put(sfx, pop(), F(32), 0.5); put(sfx, ting(2637), F(66), 0.4); put(sfx, pop(), F(126), 0.5)
put(sfx, scrape(0.8)*0.6, F(161), 0.6); put(mus, boom(), F(182), 1.0); put(sfx, thud(), F(182), 0.7)
# disaster
put(mus, hum(F(392) - F(193), 41), F(193), 0.5); stabs(F(193), F(392), 150, [38, 41], 1.0)
put(sfx, noise_band(2.5, 40, 400) * np.minimum(1, t_(2.5)/0.4), F(200), 0.5)
for k in range(8): put(sfx, thud()*0.4, F(273) + k*0.25, 0.4)
put(sfx, scrape(0.6)*0.5, F(360), 0.5); put(mus, boom(), F(432), 0.9); put(sfx, thud(), F(432), 0.7)
# inside: awkward + funny
for k in range(3): put(sfx, click(), F(452) + k*0.15, 0.5)
piano(F(446), F(718), [48, 53, 55, 52], 92, 0.8)
put(sfx, boing()*0.5, F(546), 0.5); put(sfx, pop(), F(562), 0.5)
# can + question
put(sfx, scrape(0.25)*0.6, F(730), 0.6); put(sfx, pop(), F(735), 0.8); put(sfx, ting(2093), F(738), 0.4)
t = t_(F(959) - F(790)); put(mus, (np.sin(2*np.pi*midi(64)*t) + np.sin(2*np.pi*midi(71)*t)) * 0.2 * np.minimum(1, t/0.4), F(790), 0.5)
put(sfx, ting(2637), F(917), 0.4); put(sfx, ting(3136), F(921), 0.3)
# montage
piano(F(959), F(1177), [53, 57, 50, 55], 100, 1.1)
for k in range(4): put(mus, kick()*0.5, F(959) + k*60/100*2, 0.0)
# day 99 + question + heartbeat
pad(F(1177), F(1478), [45, 48, 52, 57], 0.12); put(sfx, lowhit()*0.5, F(1187), 0.5)
for k in range(5): put(sfx, heart(), F(1440) + k*0.6, 0.8)
# door opens + finale
put(sfx, scrape(2.5)*0.4, F(1480), 0.5); put(mus, riser(3.0), F(1478), 0.4)
pad(F(1478), DUR - 0.2, [50, 57, 62, 66, 69], 0.14); piano(F(1591), DUR - 0.3, [50, 55, 57, 54], 84, 1.0)
put(sfx, ting(2637), F(1712), 0.4); put(sfx, pop(), F(1765), 0.6); put(sfx, pop(), F(1770), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
