# segments: narrator + Lívia, concatenated with small gaps; merged word timings
import asyncio, json, ssl, subprocess, edge_tts, edge_tts.communicate as _c
_c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
SEG = json.load(open('segments.json'))
async def one(i, text, voice, rate, pitch):
    c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary'); W = []
    with open(f'work/s{i}.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': W.append({'texto': ch['text'], 'inicio': ch['offset'] / 1e7, 'fim': (ch['offset'] + ch['duration']) / 1e7})
    return W
async def main():
    words, t, files = [], 0.0, []
    for i, s in enumerate(SEG):
        W = await one(i, s['t'], s['v'], s.get('r', '+18%'), s.get('p', '+0Hz'))
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'work/s{i}.mp3']))
        for w in W: words.append({'texto': w['texto'], 'inicio': w['inicio'] + t, 'fim': w['fim'] + t, 'seg': i})
        files.append((f'work/s{i}.mp3', d, s.get('gap', 0.12))); t += d + s.get('gap', 0.12)
    parts = []
    for p, d, g in files: parts += ['-i', p]
    flt = ''.join(f'[{k}:a]aresample=44100,apad=pad_dur={files[k][2]}[a{k}];' for k in range(len(files))) + ''.join(f'[a{k}]' for k in range(len(files))) + f'concat=n={len(files)}:v=0:a=1[o]'
    subprocess.run(['ffmpeg', '-y', '-v', 'error'] + parts + ['-filter_complex', flt, '-map', '[o]', '-ac', '1', 'voice.wav'], check=True)
    json.dump(words, open('work/words.json', 'w'), ensure_ascii=False); print('total', t)
asyncio.run(main())
