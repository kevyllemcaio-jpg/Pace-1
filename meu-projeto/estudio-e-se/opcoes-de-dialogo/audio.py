import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(19)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def blip(f0=880):
    tt = t_(0.07); return np.sign(np.sin(2*np.pi*f0*tt)) * 0.3 * env(len(tt), 0.001, 0.04)
def select():
    return np.concatenate([blip(988), blip(1319)])
march(mus, 0, F(526), 126, False)
t = t_(F(562)-F(526)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.1)*np.minimum(1, (F(562)-F(526)-t)/0.2), F(526), 0.3)
march(mus, F(562), F(830), 118, False)
t = t_(F(877)-F(830)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(877)-F(830)-t)/0.2), F(830), 0.3)
march(mus, F(877), dur, 126, True)
for f in [85, 209, 290, 472, 526, 562, 649, 769, 830, 877]: put(sfx, whoosh(), F(f)-0.18, 0.5)
for k in range(5): put(sfx, blip(880), F(20*k), 0.4)
for f in [146, 156, 166, 302, 357, 419, 652, 656, 660]: put(sfx, blip(880), F(f), 0.5)
for f in [100, 222, 494, 586, 702, 893]: put(sfx, pop(), F(f), 0.5)
put(sfx, select(), F(440), 0.6); put(sfx, select(), F(680), 0.6)
put(sfx, lowhit(), F(526), 0.9); put(sfx, thud(), F(528), 0.7)
put(sfx, boing()*0.5, F(784), 0.4)
put(sfx, ting(2093), F(846), 0.4)
put(sfx, lowhit()*0.6, F(893), 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
