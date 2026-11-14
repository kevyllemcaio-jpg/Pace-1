import numpy as np, wave
SR = 44100; dur = 5.0; N = int(dur*SR); rng = np.random.default_rng(3)
exec(open('/root/shorts/escola/synth.py').read())
mus = np.zeros(N); F = lambda f: f/30
t = t_(dur); put(mus, (np.sin(2*np.pi*55*t) + 0.4*np.sin(2*np.pi*82.4*t))*np.minimum(1, t/0.5)*0.25, 0, 1)
for k in range(5): put(mus, note(midi([60,63,67,70,67][k]), 0.6, 'bell', 0.5), k*0.5, 0.15)
put(mus, scrape(0.5)*0.3, F(30), 0.5)
for k in range(6): put(mus, thud()*0.25, F(42)+k*0.17, 0.5)
put(mus, whoosh(0.3), F(72), 0.7); put(mus, lowhit(), F(77), 0.9)
wr('mix.wav', mus)
