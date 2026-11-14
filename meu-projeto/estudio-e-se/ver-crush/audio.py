import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(29)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def heartbeat(): return np.concatenate([kick()*0.9, np.zeros(int(0.08*SR)), kick()*0.6])
def sad(): tt = t_(0.5); f = 500 - 250*tt/0.5; return np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.01, 0.3) * 0.6
march(mus, 0, F(590), 118, False)
t = t_(F(806)-F(590)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.3)*np.minimum(1, (F(806)-F(590)-t)/0.2), F(590), 0.25)
for i, m in enumerate([72, 76, 79, 84, 79, 76]): put(mus, note(midi(m), 1.0, 'bell', 0.7), F(853)+i*0.25, 0.3)
for f in [81, 148, 250, 323, 391, 520, 643, 742, 806]: put(sfx, whoosh(), F(f)-0.18, 0.45)
put(sfx, ting(2093), F(90), 0.5)
put(sfx, ting(2637), F(162), 0.5)
for i in range(6): put(sfx, pop(), F(180+i*4), 0.4)
for f in [288, 356, 452]: put(sfx, sad(), F(f), 0.6)
put(sfx, lowhit()*0.5, F(488), 0.5)
for k in range(4): put(sfx, heartbeat(), F(594)+k*0.5, 0.7)
put(sfx, ting(1760), F(658), 0.4); put(sfx, ting(1976), F(707), 0.4)
for k in range(8): put(sfx, thud()*0.3, F(745)+k*0.14, 0.5)
for k in range(4): put(sfx, heartbeat(), F(852)+k*0.45, 0.8)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
