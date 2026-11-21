import asyncio, json, ssl, subprocess, os, numpy as np, soundfile as sf, edge_tts, edge_tts.communicate as _c
from scipy.signal import butter, lfilter
_c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
SR = 48000
V = {'narrador': ('+0%', '-4Hz'), 'deus': ('-10%', '-22Hz'), 'filho': ('-8%', '-12Hz')}
F = [l.split('|') for l in open('falas.txt', encoding='utf8').read().strip().split('\n')]
os.makedirs('raw', exist_ok=True); os.makedirs('audio', exist_ok=True)
async def main():
    for i, v, t in F:
        if not os.path.exists(f'raw/{i}.mp3'):
            r, p = V[v]; await edge_tts.Communicate(t, 'pt-BR-AntonioNeural', rate=r, pitch=p).save(f'raw/{i}.mp3')
asyncio.run(main())
def load(fn, filt):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', fn, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse' + filt, '-ac', '1', '-ar', str(SR), '/tmp/_a.wav'], check=True)
    return sf.read('/tmp/_a.wav', dtype='float32')[0]
GAP = {}
info, rp = {}, []
for i, v, t in F:
    filt = {'narrador': '', 'deus': ',aecho=0.8:0.7:90|180:0.35|0.2', 'filho': ',aecho=0.8:0.6:60:0.25'}[v]
    s = load(f'raw/{i}.mp3', filt)
    if v == 'filho':  # "voz como de muitas águas": rumor grave de água por baixo
        n = np.random.default_rng(7).standard_normal(len(s)).astype('float32'); b, a = butter(2, [120 / (SR / 2), 900 / (SR / 2)], 'band')
        w = lfilter(b, a, n); w *= 0.06 * np.abs(s).max() / (np.abs(w).max() + 1e-9); env = np.convolve(np.abs(s), np.ones(4800) / 4800, 'same')
        s = s + w * np.clip(env / (env.max() + 1e-9) * 3, 0.3, 1)
    s = np.concatenate([s, np.zeros(int(GAP.get(i, .1) * SR), 'float32')])
    sf.write(f'audio/{i}.wav', s, SR)
    info[i] = dict(dur=round(len(s) / SR, 3), voz=v, texto=t, externo=True)
    rp.append(dict(id=i, voz=v, texto=t))
json.dump(info, open('audio/falas.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
R = dict(titulo='Apocalipse 1', formato='9:16', qualidade='alta', estilo='noturno', narrador='narrador', musica='epico', tema='historia',
         efeitos_auto=False, legendas=True, vozes={k: 'externo' for k in V}, pronuncias={}, falas=rp)
json.dump(R, open('roteiro.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('total', round(sum(x['dur'] for x in info.values()), 1), 's')
