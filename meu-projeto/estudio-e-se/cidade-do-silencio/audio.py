import numpy as np, wave
SR = 44100; DUR = 111.6; N = int(DUR*SR); rng = np.random.default_rng(53)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
def mbox(t0, t1, seq, beat=0.45, g=1.0):
    b = 0
    while t0 + b*beat < t1: put(mus, note(midi(seq[b % len(seq)]), beat*2.2, 'bell', 0.6), t0 + b*beat, 0.15*g); b += 1
A = [76, 79, 83, 79, 76, 72, 74, 71]; B = [74, 77, 81, 77, 74, 71, 72, 69]
pad(0, 42.6, [45, 52, 57], 0.10); mbox(0, 42.6, A)
put(sfx, scrape(1.2)*0.3, 4.8, 0.3)                                   # swing creak
put(sfx, ting(1046)*0.4, 19.0, 0.2)                                   # silent bell (tiny shimmer only)
# the glass: silence, then CRASH
put(sfx, whoosh(0.8), 43.4, 0.3); put(sfx, noise_band(0.7, 2000, 9000) * np.exp(-t_(0.7)*7), 44.4, 0.9); put(sfx, shatter(), 44.4, 0.7)
# the sky opens: rumble + riser, the hand
put(mus, hum(6.0, 36), 45.9, 0.6); put(mus, riser(2.6), 45.9, 0.4); put(sfx, boom(), 48.6, 0.6); put(sfx, whoosh(1.0), 50.4, 0.5)
pad(51.8, 60.0, [44, 51, 56], 0.09); mbox(52, 60, B, 0.5, 0.7)
# the climb + the other side: heartbeat, wonder
for k in range(6): put(sfx, lowhit()*0.4, 60.1 + k*0.75, 0.35)
for k in range(9): put(sfx, click()*0.6, 67.7 + k*0.5, 0.3)              # tick-tock of the square moon
pad(62.2, 79.4, [50, 57, 62, 66], 0.11); put(mus, riser(3.0), 76.4, 0.3); put(mus, boom(), 79.4, 0.7)
pad(79.4, 93.2, [48, 55, 60, 64], 0.10); mbox(82.5, 93.2, [72, 76, 79, 84, 79, 76], 0.5, 0.8)
# she wakes, the whisper, the eye
pad(93.2, 101.5, [45, 48, 52], 0.12); put(sfx, noise_band(1.4, 300, 3000) * np.minimum(1, t_(1.4)*3) * np.exp(-t_(1.4)*1.5), 97.3, 0.25)
put(mus, boom(), 102.2, 1.0); put(mus, hum(9.0, 30), 102.2, 0.6); pad(102.2, DUR - 0.3, [33, 40, 45], 0.14)
for k in range(5): put(sfx, lowhit()*0.5, 103.0 + k*0.9, 0.4)
mbox(106.6, DUR - 0.5, A, 0.6, 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
