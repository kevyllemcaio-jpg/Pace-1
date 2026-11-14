import numpy as np, wave, subprocess
SR = 44100
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','voice.mp3']))
N = int(dur*SR); rng = np.random.default_rng(31)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
def pad(t0, t1, root, g=0.12):
    d = t1 - t0; tt = t_(d); x = sum(np.sin(2*np.pi*midi(m)*tt + 0.3*np.sin(2*np.pi*0.3*tt)) for m in [root, root+3, root+7, root+12]) / 4
    put(mus, x * np.minimum(1, tt/0.6) * np.minimum(1, (d-tt)/0.6), t0, g)
def blipdown():
    tt = t_(0.9); f = 900 * np.exp(-tt*2.5) + 80; return np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * 0.3 * np.minimum(1, (0.9-tt)/0.1)
# moody lo-fi bed in the purple style
beat = 60/86
b = 0
while b*beat < F(568):
    s = b*beat; put(mus, kick()*0.8, s, 0.6 if b % 2 == 0 else 0.0); put(mus, snare()*0.6, s, 0.35 if b % 2 else 0); put(mus, hat(), s + beat/2, 0.18)
    if b % 4 == 0: put(mus, note(midi([45, 41, 43, 40][(b//4) % 4]), beat*3.8, 'pluck', 1.2), s, 0.5)
    if b % 2 == 0: put(mus, note(midi([69, 72, 76, 74, 72, 67][(b//2) % 6]), beat*0.9, 'bell', 0.4), s, 0.14)
    b += 1
for k, r in enumerate([57, 53, 55, 52]): pad(k*5.0, min(k*5.0+5.2, F(568)), r)
pad(F(568), F(787), 50, 0.15)
for i, m in enumerate([72, 76, 79, 84]): put(mus, note(midi(m), 1.0, 'bell', 0.7), F(749)+i*0.18, 0.25)
b = 0
while F(787) + b*beat*0.5 < F(849):
    put(mus, kick()*0.6, F(787)+b*beat*0.5, 0.5); b += 1
for f in [96, 158, 242, 296, 364, 418, 490, 568, 628, 787]: put(sfx, whoosh(), F(f)-0.15, 0.4)
for f in [8, 20, 34, 194, 318, 447, 746]: put(sfx, pop(), F(f), 0.5)
put(sfx, ting(2637), F(128), 0.5); put(sfx, ting(3136), F(132), 0.3)
put(sfx, lowhit()*0.6, F(205), 0.5); put(sfx, boing()*0.4, F(255), 0.4)
for k in range(4): put(sfx, ting(3000+k*200), F(370)+k*0.25, 0.15)
put(sfx, lowhit(), F(450), 0.7)
for k in range(3): put(sfx, scrape(0.12)*0.4, F(500)+k*0.4, 0.4)
put(sfx, scrape(0.3)*0.3, F(590), 0.3)
for k in range(6): put(sfx, thud()*0.15, F(660)+k*0.5, 0.4)
put(sfx, blipdown(), F(849), 0.7)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', dur)
