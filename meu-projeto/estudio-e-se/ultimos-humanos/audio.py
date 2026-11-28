import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(43)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def cricket(d):
    out = np.zeros(int(d*SR))
    for k in range(int(d*2)):
        tt = t_(0.12); x = np.sin(2*np.pi*4200*tt) * (0.5+0.5*np.sign(np.sin(2*np.pi*40*tt))) * env(len(tt), 0.002, 0.05); s = int(k*0.5*SR); out[s:s+len(x)] += x[:len(out)-s]
    return out
def horn():
    tt = t_(0.6); return (np.sign(np.sin(2*np.pi*370*tt)) + np.sign(np.sin(2*np.pi*466*tt))) * 0.2 * np.minimum(1, (0.6-tt)/0.05)
def heartbeat(): return np.concatenate([kick()*0.9, np.zeros(int(0.08*SR)), kick()*0.6])
put(sfx, cricket(F(369)-F(104)), F(104), 0.4)
for i, m in enumerate([60, 64, 67]): put(mus, note(midi(m), 3.0, 'bell', 1.5), F(20)+i*1.2, 0.15)
march(mus, F(369), F(926), 120, False)
for k in range(5): put(sfx, heartbeat(), F(960)+k*0.6, 0.6)
march(mus, F(1025), dur, 132, True)
for f in [104, 190, 275, 569, 673, 815, 926, 1100, 1171]: put(sfx, whoosh(), F(f)-0.15, 0.4)
for f in [371, 571, 675, 817, 928]: put(sfx, ting(1760), F(f), 0.4)
put(sfx, ting(2349), F(340), 0.4)
for k in range(8): put(sfx, pop(), F(505)+k*0.12, 0.3)
put(sfx, noise_band(3.0, 200, 900)*0.5, F(580), 0.4)
put(sfx, lowhit()*0.5, F(717), 0.5)
for k in range(5): put(sfx, ting(2093), F(752)+k*0.4, 0.25)
put(sfx, lowhit(), F(1025), 0.9); put(sfx, cheer(2.0), F(1027), 0.6); put(sfx, horn(), F(1040), 0.6); put(sfx, horn(), F(1060), 0.5)
put(sfx, cheer(1.5)*0.6, F(1110), 0.4)
put(sfx, boing()*0.5, F(1205), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
