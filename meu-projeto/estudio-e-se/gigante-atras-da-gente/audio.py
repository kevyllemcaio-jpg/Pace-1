import numpy as np, wave
SR = 44100; DUR = 110.0; N = int(DUR*SR); rng = np.random.default_rng(61)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
def pulse(t0, t1, root, bpm=96, g=1.0):  # driving climb pulse: low pluck + tick
    beat = 60/bpm; b = 0
    while t0 + b*beat/2 < t1:
        s = t0 + b*beat/2
        if b % 2 == 0: put(mus, note(midi(root - 12 + [0, 0, 3, 5][(b//2) % 4]), beat*0.8, 'pluck', 0.22), s, 0.45*g)
        put(mus, hat()*0.35, s, g)
        if b % 8 == 0: put(mus, kick()*0.5, s, g)
        b += 1
def bells(t0, t1, seq, beat=0.5, g=1.0):
    b = 0
    while t0 + b*beat < t1: put(mus, note(midi(seq[b % len(seq)]), beat*2, 'bell', 0.5), t0 + b*beat, 0.12*g); b += 1
pad(0, 36.2, [45, 52, 57, 60], 0.10); pulse(0, 36.2, 57, 92, 0.9); bells(4.6, 36, [69, 72, 76, 74, 72, 67])
pad(36.2, 62.1, [43, 50, 55, 58], 0.12); put(mus, hum(26, 33), 36.2, 0.45); pulse(43, 62, 55, 84, 0.7)
put(mus, boom(), 52.6, 0.8); put(sfx, whoosh(1.4), 53.4, 0.6); put(sfx, lowhit(), 55.2, 0.6)
pad(62.1, 80.3, [41, 48, 53, 57], 0.12); pulse(62.1, 80.3, 53, 120, 1.0)            # the night climb, faster
for k in range(14): put(sfx, noise_band(0.4, 3800, 5200) * np.sin(np.linspace(0, np.pi, int(0.4*SR))) , 74.0 + k*0.45, 0.10)  # the buzz
pad(80.3, 96.6, [48, 55, 60, 63], 0.10); bells(83.5, 96.5, [84, 88, 91, 88], 0.35, 0.6)
put(mus, riser(2.4), 94.2, 0.4); put(mus, boom(), 96.63, 1.0); put(mus, hum(13, 30), 96.63, 0.6)
pad(100.6, DUR - 0.3, [36, 43, 48, 51], 0.14); bells(101, DUR - 0.5, [69, 72, 76, 74, 72, 67], 0.6, 0.7)
for k in range(5): put(sfx, lowhit()*0.5, 97.0 + k*0.8, 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
