import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(23)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def blip(f0=880, d=0.07):
    tt = t_(d); return np.sign(np.sin(2*np.pi*f0*tt)) * 0.3 * env(len(tt), 0.001, d*0.6)
def jingle(notes, step=0.09):
    out = np.zeros(int((len(notes)*step+0.3)*SR))
    for i, m in enumerate(notes): x = blip(midi(m), 0.12); out[int(i*step*SR):int(i*step*SR)+len(x)] += x
    return out
def errorbuzz():
    tt = t_(0.5); return np.sign(np.sin(2*np.pi*110*tt)) * 0.35 * np.minimum(1, (0.5-tt)/0.05)
march(mus, 0, F(676), 128, True)
t = t_(F(766)-F(676)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(766)-F(676)-t)/0.2), F(676), 0.3)
march(mus, F(816), dur, 104, False)
for f in [92, 249, 359, 409, 534, 626, 676, 766, 816]: put(sfx, whoosh(), F(f)-0.18, 0.4)
for f in [0, 134, 270, 486, 698]: put(sfx, jingle([72, 76, 79]), F(f), 0.5)
for f in [202, 380]: put(sfx, jingle([84, 88]), F(f), 0.5)
put(sfx, lowhit()*0.5, F(375), 0.5)
put(sfx, pop(), F(546), 0.6)
put(sfx, jingle([72, 76, 79, 84, 79, 84]), F(574), 0.6); put(sfx, cheer(1.2), F(576), 0.4)
put(sfx, jingle([60, 64, 67, 72, 76, 79, 84], 0.07), F(640), 0.6)
put(sfx, lowhit(), F(700), 0.7)
put(sfx, blip(660), F(786), 0.6); put(sfx, errorbuzz(), F(790), 0.7)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
