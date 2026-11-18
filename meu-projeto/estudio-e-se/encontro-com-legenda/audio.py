import numpy as np, wave
SR = 44100; dur = 41.33; N = int(dur*SR); rng = np.random.default_rng(12)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def jazz(t0, t1, bpm=92):
    beat = 60/bpm; b = 0; prog_ = [(50, [62, 65, 69, 72]), (55, [62, 65, 67, 71]), (48, [60, 64, 67, 71]), (45, [60, 64, 67, 69])]
    while t0 + b*beat < t1:
        s = t0 + b*beat; root, ch = prog_[(b//4) % 4]
        put(mus, note(midi(root - 12 + [0, 7, 12, 7][b % 4]), beat*0.9, 'pluck', 0.25), s, 0.5)
        put(mus, hat(), s + beat*0.66, 0.15); put(mus, hat()*0.6, s, 0.1)
        if b % 2 == 0:
            for m in ch: put(mus, note(midi(m), beat*1.6, 'bell', 0.5), s + beat*0.33, 0.05)
        b += 1
jazz(0, F(911)); jazz(F(911), F(1136), 80)
t = t_(F(1240) - F(1136)); put(mus, np.sin(2*np.pi*midi(50)*t) * np.exp(-t*0.8) * 0.5, F(1136), 0.5)
for f in [128, 187, 256, 357, 448, 522, 608, 679, 761, 822, 911, 1051, 1136, 1197]: put(sfx, whoosh(), F(f)-0.18, 0.4)
for f in [20, 48, 278, 468, 698, 842, 1156]: put(sfx, click()*1.5, F(f), 0.6); put(sfx, ting(2093), F(f), 0.25)
put(sfx, ting(2637), F(165), 0.4); put(sfx, pop(), F(210), 0.4); put(sfx, pop(), F(384), 0.4); put(sfx, pop(), F(534), 0.4)
put(sfx, boing()*0.4, F(700), 0.4); put(sfx, pop(), F(768), 0.4); put(sfx, pop(), F(988), 0.4); put(sfx, pop(), F(1080), 0.4)
put(sfx, lowhit(), F(1158), 0.8); put(sfx, thud(), F(1214), 0.9); put(sfx, lowhit()*0.6, F(1214), 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
