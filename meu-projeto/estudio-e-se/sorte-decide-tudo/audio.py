import numpy as np, wave, json
SR = 44100; TK = {x['id']: x for x in json.load(open('work/takes.json'))}; END = TK['8c']['t0'] + TK['8c']['dur'] + 2.0
DUR = END + 0.2; N = int(DUR*SR); rng = np.random.default_rng(7)
exec(open('synth.py').read()); mus = np.zeros(N); sfx = np.zeros(N); exec(open('fx.py').read())
T = lambda k: TK[k]['t0']
def chirp(f0=3200):
    tt = t_(0.09); f = f0 + 1800*np.sin(np.pi*tt/0.09); return np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*tt/0.09)
def arps(t0, t1, chords, bpm=100, g=1.0):
    beat = 60/bpm/2; b = 0
    while t0 + b*beat < t1:
        ch = chords[int(b*beat // 2.4) % len(chords)]; put(mus, note(midi(ch[b % len(ch)] + 12), beat*3, 'bell', 0.4), t0 + b*beat, 0.16*g); b += 1
def pulse(t0, t1, root, bpm=100, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat/2 < t1:
        s = t0 + b*beat/2
        if b % 2 == 0: put(mus, note(midi(root - 12), beat*0.8, 'pluck', 0.25), s, 0.35*g)
        put(mus, hat()*0.3, s, g); b += 1
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G
# 1-3: curious magic
for i, t0 in enumerate(np.arange(0, T('4a'), 2.4)): pad(t0, min(t0 + 2.5, T('4a')), CH[i % 4], 0.10)
arps(0.4, T('4a'), CH, 100); pulse(T('2a'), T('4a'), 57, 100, 0.8)
# 4: almost silent, low hum
put(mus, hum(T('5a') - T('4a'), 55) * 0.5, T('4a'), 0.25)
# 5: rising, fanfare
pad(T('5a'), T('5c'), [50, 57, 62, 65], 0.12); put(mus, riser(T('5c') - T('5a')), T('5a'), 0.35)
for k, m in enumerate([62, 66, 69, 74]): put(mus, note(midi(m), 1.6, 'brass'), T('5c') + 0.35 + k*0.05, 0.25)
# 6-7: battle drums
stabs(T('6a') + 0.6, T('8a'), 124, [45, 41, 43, 40], 0.9); pad(T('6a'), T('8a'), [45, 52, 57], 0.08)
# 8: dark, suspended end
pad(T('8a'), END - 0.2, [38, 45, 50, 52], 0.14); put(mus, boom(), T('8a'), 0.9)
# ---- sfx
for k in range(5): put(sfx, chirp(2800 + 400*k), 0.3 + k*0.55, 0.25)
put(sfx, whoosh(3.5)*0.3, 0.0, 0.3)
put(sfx, boing(), T('1c') + 0.6, 0.7)
put(sfx, whoosh(0.6), T('2b') + 0.15, 0.5); put(sfx, note(midi(58), 0.35, 'brass'), T('2b') + 1.2, 0.35); put(sfx, note(midi(55), 0.7, 'brass'), T('2b') + 1.55, 0.35)
for k in range(10): put(sfx, ting(1600 + rng.integers(0, 1600)), T('2c') + 0.55 + k*0.07, 0.25)
put(sfx, cheer(1.8), T('2c') + 0.9, 0.5)
for k in range(8): put(sfx, ting(2600 - k*150), T('3a') + 0.1 + k*0.2, 0.18)
put(sfx, ting(2093), T('3c') + 1.55, 0.7)
put(sfx, ting(1760), T('4a') + 0.6, 0.5)
for i in range(4): put(sfx, pop(), T('4b') + 0.2 + i*0.55, 0.5)
put(sfx, ting(2637), T('4c') + 1.3, 0.8); put(sfx, zap(), T('4c') + 1.45, 0.5); put(sfx, zap(), T('4c') + 1.75, 0.5)
put(sfx, crackle(T('5c') - T('5b'), 120), T('5b'), 0.6); put(sfx, lowhit(), T('5b'), 0.6)
put(sfx, boom(), T('5c') + 0.3, 0.8)
put(sfx, whoosh(0.8), T('6a') + 0.6, 0.5)
put(sfx, scrape(0.5), T('6b') + 0.1, 0.5); put(sfx, ting(3136), T('6b') + 0.6, 0.3)
for k in range(8):
    s = T('6c') + k / 2.2
    if s < T('6c') + 3.4: put(sfx, pop(), s, 0.45)
put(sfx, whoosh(0.4), T('7a') + 0.15, 0.8); put(sfx, scrape(0.25), T('7a') + 0.5, 0.6); put(sfx, ting(2093), T('7a') + 0.6, 0.3)
put(sfx, hum(TK['7b']['dur'] + 0.3, 110) * 0.6, T('7b'), 0.4); put(sfx, riser(TK['7b']['dur']), T('7b'), 0.35)
put(sfx, boom(), T('7c') + 0.15, 0.9); put(sfx, lowhit(), T('7c') + 0.2, 0.6)
put(sfx, hum(2.4, 38), T('8a'), 0.6); put(sfx, lowhit(), T('8a') + 1.2, 0.6)
for k in range(5): put(sfx, ting(1046*(1 + k*0.25)), T('8b') + 0.5 + k*0.05, 0.25)
L8 = TK['8c']['dur'] + 2.0; put(sfx, lowhit(), T('8c') + L8 - 2.6, 0.8); put(sfx, boom(), T('8c') + L8 - 1.35, 0.7)
wr('work/music.wav', mus); wr('work/sfx.wav', sfx)
# ---- mix: voice + music under the voice (ducked) + sfx
import subprocess
def load(p): return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']), np.float32).astype(np.float64)
v = load('work/voice.wav'); v = np.pad(v, (0, max(0, N - len(v))))[:N]; m = load('work/music.wav')[:N]; s = load('work/sfx.wav')[:N]
m = np.pad(m, (0, N - len(m))); s = np.pad(s, (0, N - len(s)))
def grms(x):
    w = int(0.4*SR); n = len(x)//w; r = np.sqrt((x[:n*w].reshape(n, w)**2).mean(1)); r = r[r > 1e-6]; g = r[20*np.log10(r) > 20*np.log10(r.max()) - 30]; return np.sqrt((g**2).mean())
rv = grms(v); m *= 0.22*rv/grms(m); s *= 0.45*rv/grms(s)
cap = 0.7*np.abs(v).max(); s *= min(1, cap/np.abs(s).max())
e = np.convolve(np.abs(v), np.ones(int(0.25*SR))/int(0.25*SR), 'same'); e /= e.max(); duck = 1 - 0.55*np.clip(e*4, 0, 1)
mix = v + m*duck + s
with wave.open('work/mix.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix/max(1, np.abs(mix).max()), -1, 1)*32767).astype('<i2').tobytes())
print('mix ok', round(DUR, 2))
