import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(53)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def pad(t0, t1, root, g=0.13):
    d = t1 - t0; tt = t_(d); x = sum(np.sin(2*np.pi*midi(m)*tt + 0.3*np.sin(2*np.pi*0.3*tt)) for m in [root, root+4, root+7, root+12]) / 4
    put(mus, x * np.minimum(1, tt/0.8) * np.minimum(1, (d-tt)/0.8), t0, g)
def magic():
    out = np.zeros(int(1.6*SR))
    for k in range(10): x = note(midi(84 + [0, 4, 7, 12, 16][k % 5]), 0.5, 'bell', 0.3); s = int(k*0.1*SR); out[s:s+len(x)] += x[:len(out)-s]
    return out
def kickball(): tt = t_(0.15); return (np.sin(2*np.pi*120*tt) + 0.5*noise_band(0.15, 200, 2000)) * env(len(tt), 0.001, 0.04)
def tick(): return click()
pad(F(87), F(336), 57)
march(mus, F(336), F(1202), 122, False)
march(mus, F(1202), F(1590), 116, False)
march(mus, F(1590), F(1966), 136, True)
march(mus, F(1966), F(2362), 120, False)
pad(F(2362), F(2613), 57)
march(mus, F(2613), dur, 122, True)
fade = np.ones(N); k = int(1.0*SR); fade[-k:] = np.linspace(1, 0, k); mus *= fade
for f in [87, 336, 509, 798, 1202, 1590, 1966, 2362, 2613]: put(sfx, whoosh(), F(f)-0.15, 0.35)
for f in [338, 800, 1204, 1592, 1968, 2364, 2615]: put(sfx, ting(1760), F(f), 0.4)
put(sfx, whoosh(0.8), F(100), 0.5); put(sfx, pop(), F(184), 0.4); put(sfx, magic(), F(245), 0.5); put(sfx, ting(2637), F(284), 0.4)
put(sfx, lowhit()*0.6, F(425), 0.6); put(sfx, scrape(0.25)*0.5, F(520), 0.4); put(sfx, ting(2349), F(590), 0.5)
put(sfx, magic(), F(962), 0.4)
for k in range(3): put(sfx, pop(), F(1056)+k*0.6, 0.4)
put(sfx, ting(1976), F(1365), 0.35); put(sfx, ting(2093), F(1551), 0.35)
for k in range(5): put(sfx, kickball(), F(1590)+k*1.33, 0.5)
for k in range(3): put(sfx, whoosh(0.2), F(1791)+k*0.4, 0.4)
put(sfx, kickball(), F(1846), 0.8); put(sfx, lowhit(), F(1860), 0.8); put(sfx, cheer(2.0), F(1862), 0.6)
for k in range(40): put(sfx, tick(), F(2048)+k*0.05, 0.2)
put(sfx, pop(), F(2112), 0.4); put(sfx, pop(), F(2166), 0.4); put(sfx, ting(2349), F(2320), 0.4)
put(sfx, whoosh(0.8), F(2405), 0.5); put(sfx, magic(), F(2460), 0.5)
for k in range(4): put(sfx, pop(), F(2560)+k*0.2, 0.35)
put(sfx, boing()*0.5, F(2756), 0.4)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
