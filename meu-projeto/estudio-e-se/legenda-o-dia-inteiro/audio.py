import numpy as np, wave
SR = 44100; dur = 38.0; N = int(dur*SR); rng = np.random.default_rng(31)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
march(mus, 0, F(788), 120, False)
def lovey(t0, t1, bpm=96):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, kick()*0.6, s, 0.4 if b % 2 == 0 else 0); put(mus, hat(), s + beat/2, 0.15)
        if b % 4 == 0: put(mus, note(midi([48, 53, 55, 52][(b//4) % 4]), beat*3.8, 'pluck', 1.0), s, 0.45)
        put(mus, note(midi([72, 76, 79, 76, 77, 81, 79, 74][b % 8]), beat*0.8, 'bell', 0.35), s, 0.13); b += 1
lovey(F(788), dur)
for f in [116, 205, 270, 328, 433, 494, 579, 650, 716, 788, 899, 974, 1061]: put(sfx, whoosh(), F(f)-0.18, 0.4)
for f in [52, 288, 515, 735, 995]: put(sfx, click()*1.5, F(f), 0.6); put(sfx, lowhit()*0.5, F(f), 0.45)
for f in [14, 128, 230, 362, 455, 672, 812, 928]: put(sfx, pop(), F(f), 0.45)
put(sfx, cheer(1.2), F(530), 0.4); put(sfx, boing()*0.5, F(745), 0.4)
put(sfx, ting(2637), F(1000), 0.4); put(sfx, ting(3136), F(1100), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
