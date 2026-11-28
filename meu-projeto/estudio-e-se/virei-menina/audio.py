import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(47)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def pad(t0, t1, root, g=0.13):
    d = t1 - t0; tt = t_(d); x = sum(np.sin(2*np.pi*midi(m)*tt + 0.3*np.sin(2*np.pi*0.3*tt)) for m in [root, root+4, root+7, root+12]) / 4
    put(mus, x * np.minimum(1, tt/0.8) * np.minimum(1, (d-tt)/0.8), t0, g)
def magic():
    out = np.zeros(int(1.6*SR))
    for k in range(10): x = note(midi(84 + [0, 4, 7, 12, 16][k % 5]), 0.5, 'bell', 0.3); s = int(k*0.1*SR); out[s:s+len(x)] += x[:len(out)-s]
    return out
pad(F(90), F(365), 57)
march(mus, F(365), F(752), 122, False)
march(mus, F(752), F(1197), 116, True)
march(mus, F(1197), F(1935), 120, False)
pad(F(1935), F(2343), 60, 0.14)
march(mus, F(2343), F(2799), 116, False)
pad(F(2799), F(2970), 57)
march(mus, F(2970), dur, 120, True)
fade = np.ones(N); k = int(1.0*SR); fade[-k:] = np.linspace(1, 0, k); mus *= fade
for f in [90, 246, 500, 752, 944, 1197, 1528, 1822, 1935, 2343, 2799, 2970, 3205]: put(sfx, whoosh(), F(f)-0.15, 0.35)
for f in [367, 754, 1199, 1530, 1937, 2345, 2801, 2972]: put(sfx, ting(1760), F(f), 0.4)
put(sfx, whoosh(0.8), F(158), 0.5); put(sfx, magic(), F(300), 0.5); put(sfx, lowhit()*0.6, F(437), 0.6)
put(sfx, scrape(0.3)*0.5, F(560), 0.4); put(sfx, boing()*0.5, F(572), 0.4); put(sfx, boing()*0.5, F(700), 0.4)
put(sfx, pop(), F(903), 0.5); put(sfx, magic(), F(985), 0.5)
put(sfx, pop(), F(1404), 0.5); put(sfx, pop(), F(1489), 0.5)
for k in range(10): put(sfx, thud()*0.25, F(1560)+k*0.25, 0.4)
put(sfx, ting(2349), F(1862), 0.4); put(sfx, pop(), F(2016), 0.4)
for f in [2089, 2113, 2138]: put(sfx, pop(), F(f), 0.35)
put(sfx, ting(2093), F(2229), 0.4); put(sfx, ting(1568), F(2482), 0.4); put(sfx, ting(1760), F(2546), 0.4); put(sfx, lowhit()*0.4, F(2700), 0.4)
put(sfx, whoosh(0.8), F(2850), 0.5); put(sfx, magic(), F(2930), 0.5)
put(sfx, ting(2637), F(3300), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
