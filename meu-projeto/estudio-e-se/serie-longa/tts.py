import hashlib, asyncio, json, ssl, subprocess, os, numpy as np, soundfile as sf, edge_tts, edge_tts.communicate as _c
_c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
SR = 48000
V = {'narrador': ('pt-BR-AntonioNeural', '+8%', '+4Hz')}
F = [l.split('|') for l in open('falas.txt', encoding='utf8').read().strip().split('\n')]
os.makedirs('raw', exist_ok=True); os.makedirs('audio', exist_ok=True)
async def main():
    for i, v, t in F:
        h = hashlib.md5(t.encode()).hexdigest()[:12]
        if not os.path.exists(f'raw/{h}.mp3'):
            vv, r, p = V[v.replace('_p', '')]; await edge_tts.Communicate(t, vv, rate=r, pitch=p).save(f'raw/{h}.mp3')
asyncio.run(main())
info, rp = {}, []
for i, v, t in F:
    filt = ',aecho=0.8:0.5:40:0.3' if v.endswith('_p') else ''  # pensamento: leve eco
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'raw/{hashlib.md5(t.encode()).hexdigest()[:12]}.mp3', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=stop_periods=-1:stop_duration=0.12:stop_threshold=-42dB' + filt, '-ac', '1', '-ar', str(SR), '/tmp/_a.wav'], check=True)
    s = sf.read('/tmp/_a.wav', dtype='float32')[0]; s = np.concatenate([s, np.zeros(int(.04 * SR), 'float32')])
    sf.write(f'audio/{i}.wav', s, SR); vz = v.replace('_p', '')
    info[i] = dict(dur=round(len(s) / SR, 3), voz=vz, texto=t, externo=True); rp.append(dict(id=i, voz=vz, texto=t))
json.dump(info, open('audio/falas.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
import sys; R = dict(titulo=sys.argv[1], formato='16:9', qualidade='alta', estilo='dia', narrador='narrador', musica='epico', musica_vol=0.07, tema='historia',
         efeitos_auto=False, legendas=True, transicao='corte', legenda_estilo='ref', vozes={k: 'externo' for k in V}, pronuncias={}, falas=rp)
json.dump(R, open('roteiro.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('total', round(sum(x['dur'] for x in info.values()), 1), 's')
