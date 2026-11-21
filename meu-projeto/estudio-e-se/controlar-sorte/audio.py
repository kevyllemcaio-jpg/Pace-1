import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(17)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def rise(d):
    tt = t_(d); f = 200 + 1200*(tt/d)**2; return np.sin(2*np.pi*np.cumsum(f)/SR) * 0.4 * np.minimum(1, tt/0.05)
def splat():
    x = noise_band(0.15, 300, 2500); return x * env(len(x), 0.001, 0.05)
def coo():
    tt = t_(0.5); f = 420 - 80*np.sin(np.pi*tt/0.5); return np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*tt/0.5) * (0.6+0.4*np.sin(2*np.pi*14*tt))
march(mus, 0, F(563), 124, False)
t = t_(F(632)-F(563)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(632)-F(563)-t)/0.2), F(563), 0.3)
march(mus, F(632), dur, 116, False)
for f in [79, 158, 235, 309, 391, 450, 563, 632, 751]: put(sfx, whoosh(), F(f)-0.18, 0.5)
for k in range(4): put(sfx, ting(2000+k*250), F(10)+k*0.4, 0.3)
for k in range(10): put(sfx, click(), F(118)+k*0.06, 0.4)
put(sfx, ting(2637), F(196), 0.5)
put(sfx, cheer(1.4), F(262), 0.5); put(sfx, ting(2093), F(262), 0.4)
put(sfx, cheer(1.2), F(346), 0.5)
put(sfx, rise(0.6), F(404), 0.5); put(sfx, ting(3136), F(422), 0.5)
for k in range(5): put(sfx, note(2637, 0.08, 'bell', 0.05), F(462)+k*0.2, 0.3)
put(sfx, whoosh(0.9), F(490), 0.7); put(sfx, lowhit(), F(516), 1.0); put(sfx, thud(), F(516), 0.8)
put(sfx, lowhit()*0.6, F(563), 0.6)
put(sfx, scrape(0.3)*0.5, F(660), 0.5); put(sfx, whoosh(0.6), F(682), 0.6); put(sfx, coo(), F(700), 0.6); put(sfx, splat(), F(718), 0.9)
put(sfx, boing()*0.5, F(770), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
