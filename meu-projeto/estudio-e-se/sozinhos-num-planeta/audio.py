import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(41)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def pad(t0, t1, root, g=0.12):
    d = t1 - t0; tt = t_(d); x = sum(np.sin(2*np.pi*midi(m)*tt + 0.3*np.sin(2*np.pi*0.3*tt)) for m in [root, root+4, root+7, root+12]) / 4
    put(mus, x * np.minimum(1, tt/0.8) * np.minimum(1, (d-tt)/0.8), t0, g)
def rumble(d):
    x = noise_band(d, 30, 200); tt = t_(d); return x * np.minimum(1, tt/0.3) * np.minimum(1, (d-tt)/0.5)
def wind(d):
    x = noise_band(d, 300, 2500); tt = t_(d); return x * (0.6 + 0.4*np.sin(2*np.pi*0.7*tt)) * np.minimum(1, tt/0.5) * np.minimum(1, (d-tt)/0.5)
def crunch():
    x = noise_band(0.25, 200, 3000); return x * env(len(x), 0.002, 0.08)
def radio_tune():
    out = np.zeros(int(4.0*SR))
    for k in range(16):
        x = note(midi([76, 79, 81, 79][k % 4]), 0.24, 'pluck', 0.12); s = int(k*0.25*SR); out[s:s+len(x)] += x[:len(out)-s]
    return out
march(mus, 0, F(346), 118, False)
pad(F(408), F(883), 57, 0.12); march(mus, F(450), F(883), 104, False)
march(mus, F(883), F(1298), 112, False)
march(mus, F(1298), F(1727), 116, False)
pad(F(1727), F(1797), 60, 0.15)
march(mus, F(1797), F(2090), 124, True)
pad(F(2090), F(2244), 55, 0.15)
put(mus, (np.sin(2*np.pi*55*t_(F(2574)-F(2244)))) * 0.6, F(2244), 0.3)
march(mus, F(2574), F(3007), 116, False)
march(mus, F(3007), F(3395), 126, False)
march(mus, F(3395), F(3747), 120, True)
pad(F(3747), F(4161), 60, 0.16)
for i, m in enumerate([72, 76, 79, 84, 79, 76, 72]): put(mus, note(midi(m), 1.4, 'bell', 0.9), F(4043) + i * 0.3, 0.22)
march(mus, F(4161), dur, 122, True)
fade = np.ones(N); k = int(1.0*SR); fade[-k:] = np.linspace(1, 0, k); mus *= fade
for f in [103, 192, 284, 572, 653, 777, 986, 1121, 1224, 1437, 1602, 1727, 1956, 2090, 2421, 2662, 2842, 3172, 3302, 3556, 3883, 4002, 4304, 4377]: put(sfx, whoosh(), F(f)-0.15, 0.35)
for f in [410, 885, 1300, 1799, 2246, 2576, 3009, 3397, 3749]: put(sfx, ting(1760), F(f), 0.4); put(sfx, whoosh(0.3), F(f), 0.4)
put(sfx, pop(), F(310), 0.6); put(sfx, rumble(3.0), F(346), 0.8); put(sfx, lowhit(), F(366), 0.8)
put(sfx, whoosh(1.0), F(440), 0.6); put(sfx, lowhit(), F(468), 1.0); put(sfx, thud(), F(468), 0.8)
put(sfx, scrape(0.3)*0.4, F(668), 0.4); put(sfx, crunch(), F(800), 0.6)
put(sfx, whoosh(0.4), F(1080), 0.5); put(sfx, lowhit()*0.6, F(1124), 0.6); put(sfx, crunch(), F(1126), 0.8); put(sfx, lowhit()*0.6, F(1182), 0.6)
for k in range(10): put(sfx, thud()*0.3, F(1350)+k*0.25, 0.5)
for k in range(8): put(sfx, click(), F(1556)+k*0.03, 0.3)
put(sfx, ting(2093), F(1680), 0.4)
for k in range(5): put(sfx, boing()*0.4, F(1850)+k*0.33, 0.35)
put(sfx, lowhit()*0.6, F(1968), 0.6); put(sfx, cheer(0.8)*0.4, F(2006), 0.4)
for k in range(10): put(sfx, thud()*0.25, F(2042)+k*0.15, 0.4)
put(sfx, pop(), F(2208), 0.5)
put(sfx, wind(F(2574)-F(2244)), F(2244), 0.7); put(sfx, whoosh(0.6), F(2362), 0.6)
put(sfx, crunch(), F(2765), 0.6); put(sfx, boing()*0.6, F(2783), 0.6); put(sfx, cheer(1.4)*0.4, F(2860), 0.4); put(sfx, thud(), F(2895), 0.6)
put(sfx, ting(2637), F(3100), 0.4); put(sfx, scrape(0.6)*0.5, F(3212), 0.5); put(sfx, thud(), F(3232), 0.6); put(sfx, ting(2093), F(3300), 0.4)
for k in range(10): put(sfx, ting(3000+rng.random()*800), F(3440)+k*0.18, 0.15)
put(sfx, radio_tune(), F(3556), 0.35)
put(sfx, rumble(2.0), F(3800), 0.6)
put(sfx, ting(2349), F(4043), 0.4)
put(sfx, rumble(1.5), F(4150), 0.6); put(sfx, ting(2637), F(4254), 0.4); put(sfx, pop(), F(4400), 0.5)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
