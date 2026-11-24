import numpy as np, wave, json, subprocess
SR = 44100; dur = 153.2; N = int(dur*SR); rng = np.random.default_rng(5)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); S = {int(k): v for k, v in json.load(open('segstart.json')).items()}
CH = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
def piano(t0, t1, beat=0.42, g=1.0, mel=True):
    b = 0
    while t0 + b*beat < t1:
        c = CH[(b // 8) % 4]; s = t0 + b*beat
        put(mus, note(midi(c[b % 3]), beat*2.5, 'bell', 0.7), s, 0.09*g)
        if mel and b % 4 == 0: put(mus, note(midi(c[(b//4) % 3] + 12), beat*3, 'bell', 1.0), s, 0.08*g)
        if b % 8 == 0: put(mus, note(midi(c[0] - 12), beat*7, 'pluck', 1.5), s, 0.12*g)
        b += 1
piano(0, S[39], 0.40)
piano(S[39], S[45], 0.6, 0.8, False)
piano(S[45], S[53], 0.32, 1.0)
piano(S[53], S[57], 0.7, 0.7, False)
piano(S[57], dur, 0.36, 1.1)
for i in range(1, 65): put(sfx, whoosh(0.25), S[i] - 0.12, 0.18)
for i in (1, 21, 39, 52): put(sfx, scrape(0.3)*0.6, S[i] + 1.2, 0.5)
put(sfx, cheer(2.0), S[59], 0.45); put(sfx, cheer(1.5), S[59] + 1.5, 0.35)
for k in range(3): put(sfx, thud()*0.6, S[61] + 1.4 + k*0.25, 0.5)
for i in (3, 22, 63): [put(sfx, ting(1568 + j*300)*0.5, S[i] + 0.3 + j*0.15, 0.25) for j in range(3)]
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
