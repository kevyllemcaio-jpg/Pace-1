# music at 50% of the voice's gated RMS (-6 dB); SFX at 50%, peaks capped at 0.7x voice peak
import sys, numpy as np, subprocess, wave
SR = 44100
def load(p):
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'])
    return np.frombuffer(raw, np.float32).astype(np.float64)
def grms(x):
    w = int(0.4*SR); n = len(x)//w
    r = np.sqrt((x[:n*w].reshape(n, w)**2).mean(1)); r = r[r > 0]
    g = r[20*np.log10(r) > 20*np.log10(r.max()) - 30]; return np.sqrt((g**2).mean())
v, m, s = (load(p) for p in sys.argv[1:4])
N = len(v); m = np.pad(m, (0, max(0, N-len(m))))[:N]; s = np.pad(s, (0, max(0, N-len(s))))[:N]
rv = grms(v); m *= 0.5*rv/grms(m); s *= 0.5*rv/grms(s)
cap = 0.7*np.abs(v).max()
if np.abs(s).max() > cap: s *= cap/np.abs(s).max()
db = lambda a, b: 20*np.log10(a/b)
print(f'music vs voice: {db(grms(m), rv):+.1f} dB   sfx vs voice: {db(grms(s), rv):+.1f} dB   sfx peak/voice peak: {np.abs(s).max()/np.abs(v).max():.2f}')
mix = v + m + s
with wave.open('work/mix.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix/ max(1, np.abs(mix).max()), -1, 1)*32767).astype('<i2').tobytes())
print('work/mix.wav')
