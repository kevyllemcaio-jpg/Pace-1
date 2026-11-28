import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(11)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def chord_strum(root):
    out = np.zeros(int(0.8*SR))
    for i, m in enumerate([root, root+4, root+7, root+12]):
        x = note(midi(m), 0.8 - i*0.02, 'pluck', 0.4); out[int(i*0.02*SR):int(i*0.02*SR)+len(x)] += x[:len(out)-int(i*0.02*SR)]
    return out
march(mus, 0, F(263), 120, False)
for k in range(8): put(mus, chord_strum([52, 57, 59, 52][k % 4]), F(263)+k*0.2, 0.5)
march(mus, F(263), F(316), 140, True)
march(mus, F(316), F(789), 120, False)
t = t_(F(845)-F(789)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(845)-F(789)-t)/0.2), F(789), 0.3)
march(mus, F(845), dur, 128, True)
for f in [86, 214, 316, 345, 416, 441, 503, 606, 642, 736, 845, 919]: put(sfx, whoosh(), F(f)-0.18, 0.5)
for f in [100, 248, 330, 428, 744]: put(sfx, ting(2093), F(f), 0.5); put(sfx, scrape(0.2)*0.4, F(f)-0.1, 0.3)
put(sfx, lowhit()*0.5, F(178), 0.5); put(sfx, pop(), F(178), 0.6)
put(sfx, cheer(1.5), F(270), 0.5); put(sfx, lowhit()*0.6, F(284), 0.6)
put(sfx, cheer(1.4), F(364), 0.5); put(sfx, ting(2637), F(364), 0.5)
put(sfx, pop(), F(450), 0.7); put(sfx, boing(), F(450), 0.5)
for k in range(5): put(sfx, click(), F(540)+k*0.12, 0.4)
put(sfx, ting(1568), F(608), 0.4)
for k in range(6): put(sfx, thud()*0.3, F(645)+k*0.16, 0.5)
put(sfx, thud(), F(690), 0.7)
put(sfx, lowhit(), F(793), 0.9)
for k in range(20): put(sfx, scrape(0.06)*0.5, F(850)+k*0.18, 0.3)
put(sfx, boing()*0.6, F(928), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
