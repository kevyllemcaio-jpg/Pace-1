import numpy as np, wave, json
TL = json.load(open('web/timeline.json')); END = TL[-1]['b']; DUR = END + 20.5
SR = 44100; N = int(DUR*SR); rng = np.random.default_rng(81)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N)
exec(open('fx.py').read())
def piano(t0, t1, roots, bpm=88, g=1.0):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; r = roots[(b//4) % len(roots)]
        if b % 4 == 0: put(mus, note(midi(r - 12), beat*3.5, 'pluck', 1.2), s, 0.35*g)
        put(mus, note(midi(r + [12, 16, 19, 16][b % 4]), beat*0.9, 'bell', 0.5), s, 0.12*g); b += 1
def comic(t0, t1, bpm=126):
    beat = 60/bpm; b = 0
    while t0 + b*beat < t1:
        s = t0 + b*beat; put(mus, note(midi([45, 52, 48, 50][(b//2) % 4] - 12 + (12 if b % 2 else 0)), beat*0.4, 'pluck', 0.08), s, 0.6)
        if b % 2: put(mus, snare()*0.4, s, 0.25)
        put(mus, hat(), s + beat/2, 0.18)
        if b % 4 == 3: put(mus, note(midi([76, 79, 81, 84][(b//4) % 4]), beat*0.3, 'bell', 0.1), s, 0.2)
        b += 1
def rainbed(t0, t1): d = t1 - t0; put(sfx, noise_band(d, 800, 9000) * 0.35 * np.minimum(1, t_(d)/1) * np.minimum(1, (d - t_(d))/1), t0, 0.5)
MOOD = {'run': 'action', 'runent': 'action', 'horde': 'tension', 'zombie1': 'tension', 'siren': 'tension', 'carry': 'action', 'carryent': 'action', 'cartst': 'action', 'cart': 'action', 'marketz': 'tension', 'slip': 'comic', 'sneak': 'comic', 'pushup': 'comic', 'train': 'comic', 'game': 'comic', 'pigeon': 'comic', 'dogeat': 'comic', 'dog': 'warm', 'knock': 'tension', 'storm': 'storm', 'dark': 'storm', 'roofrun': 'action', 'jumproof': 'action', 'stadium': 'epic', 'jump': 'epic', 'heli': 'epic', 'end': 'epic', 'final': 'epic', 'roofsit': 'warm', 'hands': 'warm', 'ankle': 'tension', 'doorclose': 'tension'}
segs = []
for s in TL:
    m = MOOD.get(s['sh']['k'], 'warm')
    if s['sh'].get('thunder') or s['sh'].get('dark'): m = 'storm'
    if s['sh'].get('night') and m == 'warm': m = 'night'
    if segs and segs[-1][0] == m: segs[-1][2] = s['b']
    else: segs.append([m, s['a'], s['b']])
segs[-1][2] = DUR - 0.3
roots = {'warm': [48, 53, 55, 52], 'night': [45, 48, 52, 50], 'storm': [45, 41, 43, 40]}
for m, a, b in segs:
    if m == 'action': stabs(a, b, 150, [38, 41, 36, 43], 0.9)
    elif m == 'tension': put(mus, hum(b - a, 41), a, 0.4); [put(mus, taiko(), a + k*0.9, 0.35) for k in range(int((b - a)/0.9))]
    elif m == 'comic': comic(a, b)
    elif m == 'storm': pad(a, b, [45, 48, 52], 0.1); rainbed(a, b)
    elif m == 'epic': stabs(a, b, 120, [38, 43, 45, 41], 1.0); pad(a, b, [50, 57, 62, 66], 0.1)
    elif m == 'night': piano(a, b, roots['night'], 76, 0.8)
    else: piano(a, b, roots['warm'], 92, 1.0)
    put(sfx, whoosh(0.4), a - 0.15, 0.35)
K = {}
for s in TL:
    k, a, b = s['sh']['k'], s['a'], s['b']
    if s['sh'].get('tag'): put(sfx, lowhit()*0.5, a, 0.45); put(sfx, ting(2093), a, 0.3)
    if k == 'siren':
        for j in range(int((b - a)/0.8)): tt = t_(0.8); put(sfx, np.sin(2*np.pi*np.cumsum(600 + 300*np.sin(np.pi*tt/0.8))/SR) * 0.5, a + j*0.8, 0.35)
    if k in ('horde', 'zombie1', 'marketz'):
        for j in range(4): tt = t_(1.2); put(sfx, (np.sin(2*np.pi*np.cumsum(140 + 30*np.sin(2*np.pi*3*tt))/SR) * 0.5 + noise_band(1.2, 100, 800)*0.3) * np.sin(np.pi*tt/1.2), a + 0.5 + j*1.4, 0.35)
    if k in ('doorclose', 'carryent'): put(mus, boom(), b - 1.0, 0.8); put(sfx, thud(), b - 1.0, 0.6)
    if k == 'slip': put(sfx, scrape(0.4)*0.5, a + 1.0, 0.5); put(sfx, shatter(), a + 1.4, 0.5); [put(sfx, ting(1500 + j*180), a + 1.5 + j*0.08, 0.25) for j in range(10)]
    if k == 'ins' and s['sh'].get('what') == 'can': put(sfx, scrape(0.25)*0.6, a + 0.6, 0.5); put(sfx, pop(), a + 0.8, 0.7)
    if k == 'ins' and s['sh'].get('what', '').startswith('radio'): put(sfx, noise_band(b - a, 1500, 6000) * 0.25, a, 0.4)
    if k == 'pigeon': put(sfx, boing()*0.5, a + 1.6, 0.4)
    if k == 'knock': [put(sfx, thud(), a + tt, 0.8) for tt in (0.5, 0.9, 1.3, 2.4, 2.8)]
    if k == 'dog': [put(sfx, pop()*0.8, a + 1.6 + j*0.3, 0.5) for j in range(2)]
    if k == 'ankle': put(sfx, thud(), a + 1.2, 0.6)
    if k in ('stadium', 'jump', 'heli', 'end', 'final'): tt = t_(b - a); put(sfx, np.sign(np.sin(2*np.pi*14*tt)) * noise_band(b - a, 80, 600) * 0.4, a, 0.35)
    if s['sh'].get('thunder') or k == 'storm':
        for j in range(int((b - a)/2.3)): put(sfx, boom()[:int(1.2*SR)], a + 0.3 + j*2.3, 0.5)
pad(END, DUR - 0.2, [50, 57, 62, 66, 69], 0.13); stabs(END, DUR - 0.5, 120, [38, 43], 0.8); put(mus, boom(), DUR - 1.5, 0.7)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok', DUR)
