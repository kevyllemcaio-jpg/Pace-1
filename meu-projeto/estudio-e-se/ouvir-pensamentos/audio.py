import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(5)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def growl(d=0.9):
    tt = t_(d); f = 70 + 25*np.sin(2*np.pi*3*tt); ph = 2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph) + 0.6*np.sin(2*ph) + 0.3*noise_band(d, 60, 400)) * np.sin(np.pi*tt/d)
def ring(d=0.9):
    tt = t_(d); return np.sign(np.sin(2*np.pi*2200*tt)) * 0.3 * (0.5+0.5*np.sign(np.sin(2*np.pi*18*tt))) * np.minimum(1, (d-tt)/0.05)
march(mus, 0, F(437), 120, False)
march(mus, F(488), F(1084), 120, False)
t = t_(F(488)-F(437)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(488)-F(437)-t)/0.2), F(437), 0.3)
march(mus, F(1084), dur, 132, True)
for f in [89, 164, 260, 352, 488, 590, 753, 841, 949]: put(sfx, whoosh(), F(f)-0.18, 0.5)
put(sfx, pop(), F(1), 0.6)
put(sfx, ring(), F(122), 0.6)
put(sfx, pop(), F(198), 0.7); put(sfx, cheer(1.0)*0.5, F(200), 0.4)
for i in range(6): put(sfx, click(), F(180)+i*0.1, 0.4)
put(sfx, whoosh(0.2), F(357), 0.5); put(sfx, ting(1760), F(360), 0.4)
put(sfx, lowhit(), F(438), 0.8); put(sfx, pop(), F(437), 0.8)
put(sfx, ting(2349), F(544), 0.4)
for k in range(8): put(sfx, note(midi([72,76,79,76,74,77,81,79][k]), 0.25, 'bell'), F(673)+k*0.2, 0.25)
put(sfx, lowhit()*0.6, F(714), 0.6)
put(sfx, pop(), F(888), 0.6)
for i in range(4): put(sfx, pop(), F(890+i*9), 0.4)
put(sfx, ting(2637), F(960), 0.6); put(sfx, pop(), F(995), 0.6)
put(sfx, whoosh(0.35), F(1036), 0.7)
for k in range(30): put(sfx, click(), F(1040)+k*0.045, 0.3)
put(sfx, growl(), F(1121), 0.9); put(sfx, growl(0.7), F(1100), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
