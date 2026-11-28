import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(59)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def power_up(d=0.9):
    tt = t_(d); f = 200 + 1600*(tt/d)**1.5; x = np.sin(2*np.pi*np.cumsum(f)/SR) + 0.4*np.sign(np.sin(2*np.pi*np.cumsum(f*0.5)/SR)); return x * 0.4 * np.minimum(1, (d-tt)/0.05)
def robot(d=0.6):
    tt = t_(d); return np.sign(np.sin(2*np.pi*180*tt)) * (0.5+0.5*np.sign(np.sin(2*np.pi*14*tt))) * 0.3
def beep(): tt = t_(0.12); return np.sin(2*np.pi*1600*tt) * env(len(tt), 0.002, 0.08)
def splat(): x = noise_band(0.4, 150, 1500); return x * env(len(x), 0.002, 0.15)
def rumble(d): x = noise_band(d, 30, 200); tt = t_(d); return x * np.minimum(1, tt/0.2) * np.minimum(1, (d-tt)/0.3)
march(mus, 0, F(813), 128, True)
t = t_(F(1154)-F(813)); put(mus, (np.sin(2*np.pi*55*t) + 0.5*np.sin(2*np.pi*58*t)) * np.minimum(1, t/0.3) * np.minimum(1, (F(1154)-F(813)-t)/0.3), F(813), 0.35)
march(mus, F(1186), F(1519), 150, True)
t = t_(F(1756)-F(1519)); put(mus, np.sin(2*np.pi*65*t) * np.minimum(1, t/0.2) * np.minimum(1, (F(1756)-F(1519)-t)/0.2), F(1519), 0.3)
march(mus, F(1756), dur, 118, False)
for f in [91, 197, 339, 467, 655, 813, 974, 1154, 1334, 1506, 1756]: put(sfx, whoosh(), F(f)-0.15, 0.35)
put(sfx, whoosh(1.0), F(130), 0.6); put(sfx, lowhit(), F(160), 1.0); put(sfx, thud(), F(160), 0.8)
put(sfx, ting(2637), F(250), 0.4); put(sfx, scrape(0.2)*0.5, F(343), 0.6); put(sfx, lowhit()*0.5, F(343), 0.5)
put(sfx, robot(), F(415), 0.5)
put(sfx, click(), F(488), 0.7); put(sfx, power_up(), F(490), 0.7); put(sfx, lowhit(), F(516), 0.9)
put(sfx, thud(), F(680), 0.6); put(sfx, scrape(0.6)*0.6, F(768), 0.6)
put(sfx, rumble(1.6), F(830), 0.8); put(sfx, splat(), F(870), 0.7); put(sfx, crunch() if 'crunch' in dir() else splat(), F(945), 0.6)
put(sfx, whoosh(0.5), F(1029), 0.6); put(sfx, lowhit(), F(1070), 1.0); put(sfx, thud(), F(1070), 0.8)
put(sfx, click(), F(1165), 0.7); put(sfx, power_up(0.7), F(1168), 0.7); put(sfx, whoosh(0.4), F(1193), 0.7)
for k in range(30): put(sfx, thud()*0.4, F(1340)+k*0.08, 0.35)
put(sfx, splat(), F(1405), 0.7); put(sfx, cheer(2.0), F(1455), 0.6)
for k in range(12): put(sfx, beep(), F(1520)+k*0.33, 0.5)
put(sfx, lowhit()*0.6, F(1633), 0.6); put(sfx, beep(), F(1727), 0.8); put(sfx, splat(), F(1760), 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
