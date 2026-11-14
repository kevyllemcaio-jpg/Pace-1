import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(13)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def cash():
    return np.concatenate([note(2637, 0.08, 'bell', 0.05), note(3136, 0.5, 'bell', 0.3)])
def cluck():
    out = np.zeros(int(0.7*SR))
    for k in range(3):
        tt = t_(0.12); f = 700 - 300*tt/0.12; x = np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.002, 0.05); out[int(k*0.18*SR):int(k*0.18*SR)+len(x)] += x
    return out
march(mus, 0, F(565), 124, True)
march(mus, F(565), F(732), 100, False)
t = t_(F(821)-F(732)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(821)-F(732)-t)/0.2), F(732), 0.3)
for i, m in enumerate([72, 76, 79, 84]): put(mus, note(midi(m), 0.6, 'brass'), F(838)+i*0.15, 0.25)
for f in [68, 159, 261, 393, 488, 565, 659, 732, 821]: put(sfx, whoosh(), F(f)-0.18, 0.5)
for k in range(5): put(sfx, cash(), F(5)+k*0.4, 0.4)
put(sfx, scrape(0.15)*0.4, F(85), 0.4)
for i in range(4): put(sfx, cash(), F(110+i*12), 0.5)
for f in [168, 266, 398]: put(sfx, pop(), F(f), 0.6)
for k in range(10): put(sfx, pop(), F(198)+k*0.1, 0.3)
for k in range(12): put(sfx, noise_band(0.1, 200, 900)*env(int(0.1*SR), 0.002, 0.04), F(295)+k*0.09, 0.4)
put(sfx, boing(), F(348), 0.5); put(sfx, lowhit()*0.5, F(358), 0.5)
put(sfx, whoosh(0.5), F(496), 0.6)
put(sfx, thud(), F(520), 0.9)
for k in range(30): put(sfx, note(2400+rng.random()*1500, 0.1, 'bell', 0.04), F(520)+k*0.02, 0.2)
put(sfx, whoosh(1.2)*0.7, F(616), 0.5)
put(sfx, lowhit(), F(700), 0.7)
put(sfx, ting(2093), F(786), 0.5)
put(sfx, cluck(), F(830), 0.8); put(sfx, pop(), F(838), 0.6); put(sfx, ting(2637), F(840), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
