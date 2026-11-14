import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(9)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def ring(d=0.9):
    tt = t_(d); return np.sign(np.sin(2*np.pi*2200*tt)) * 0.3 * (0.5+0.5*np.sign(np.sin(2*np.pi*18*tt))) * np.minimum(1, (d-tt)/0.05)
def heartbeat():
    return np.concatenate([kick()*0.9, np.zeros(int(0.08*SR)), kick()*0.6])
march(mus, 0, F(582), 122, False)
march(mus, F(582), F(703), 140, True)
t = t_(F(857)-F(703)); put(mus, np.sin(2*np.pi*55*t)*np.minimum(1, t/0.2)*np.minimum(1, (F(857)-F(703)-t)/0.3), F(703), 0.3)
for i, m in enumerate([72, 76, 79, 84, 79, 76]): put(mus, note(midi(m), 1.2, 'bell', 0.8), F(857)+i*0.45, 0.3)
for i, ch in enumerate([[60,64,67],[65,69,72],[67,71,74],[60,64,67]]):
    for m in ch: put(mus, note(midi(m), 0.75, 'brass'), F(857)+i*0.75, 0.12)
for f in [99, 169, 228, 340, 434, 522, 582, 686, 810]: put(sfx, whoosh(), F(f)-0.18, 0.5)
for k in range(4): put(sfx, pop(), F(5)+k*0.5, 0.3)
put(sfx, ring(), F(126), 0.6)
put(sfx, scrape(0.4)*0.3, F(176), 0.4)
put(sfx, whoosh(0.8), F(240), 0.4); put(sfx, cheer(1.2), F(300), 0.5)
for k in range(6): put(sfx, pop(), F(345)+k*0.15, 0.35)
put(sfx, scrape(0.3)*0.5, F(492), 0.5)
put(sfx, lowhit()*0.6, F(527), 0.6); put(sfx, cheer(0.8)*0.5, F(527), 0.4)
for k in range(14): put(sfx, thud()*0.3, F(585)+k*0.2, 0.5)
put(sfx, cheer(3.0), F(590), 0.35)
put(sfx, whoosh(0.3), F(703), 0.6); put(sfx, thud(), F(724), 0.9)
for k in range(3): put(sfx, ting(2000+k*300), F(726)+k*0.12, 0.3)
for k in range(5): put(sfx, heartbeat(), F(880)+k*0.55, 0.6)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
