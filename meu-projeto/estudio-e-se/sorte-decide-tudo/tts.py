# narração: um arquivo por take, pausa só onde marcada, depois tudo colado em work/voice.wav + work/takes.json + work/words.json
import asyncio, json, ssl, subprocess, edge_tts, edge_tts.communicate as _c
_c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
F = [l.split('|') for l in open('falas.txt', encoding='utf8').read().strip().split('\n')]
async def one(i, t):
    c = edge_tts.Communicate(t, 'pt-BR-AntonioNeural', rate='+10%', pitch='+6Hz', boundary='WordBoundary'); W = []
    with open(f'work/{i}.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': W.append([ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7])
    return W
async def main():
    takes, words, t, parts = [], [], 0.0, []
    for i, pz, txt in F:
        W = await one(i, txt); pz = float(pz)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'work/{i}.mp3', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-ar', '44100', '-ac', '1', f'work/{i}.wav'], check=True)
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'work/{i}.wav']))
        off = W[0][1] if W else 0
        t += pz; takes.append(dict(id=i, t0=round(t, 3), dur=round(d, 3), text=txt))
        for w, a, b in W: words.append({'texto': w, 'inicio': round(t + a - off, 3), 'fim': round(t + b - off, 3)})
        parts.append((i, pz)); t += d + 0.06
    flt = ''; ins = []
    for k, (i, pz) in enumerate(parts):
        ins += ['-i', f'work/{i}.wav']; flt += f'[{k}:a]adelay={int(pz*1000)},apad=pad_dur=0.06[a{k}];'
    flt += ''.join(f'[a{k}]' for k in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', flt, '-map', '[o]', 'work/voice.wav'], check=True)
    json.dump(takes, open('work/takes.json', 'w'), ensure_ascii=False, indent=1); json.dump(words, open('work/words.json', 'w'), ensure_ascii=False)
    print('total', round(t, 2))
    for x in takes: print(x['id'], x['t0'], x['dur'])
asyncio.run(main())
