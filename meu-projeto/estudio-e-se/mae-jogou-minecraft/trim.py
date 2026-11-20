# re-concat TTS segments with leading/trailing silence trimmed (no pauses), rebuild word timings
import json, subprocess, itertools
W = json.load(open('work/words.json')); SEG = json.load(open('segments.json'))
by = {s: list(g) for s, g in itertools.groupby(W, key=lambda x: x['seg'])}
t, out, parts, flt = 0.0, [], [], ''
for i in range(len(SEG)):
    g = by[i]; base = g[0]['inicio'] - 0.0  # absolute start of this seg in old timeline
    # old seg start = first word inicio - local offset; recover local by reading original local offsets
    loc0 = g[0]['loc'] if 'loc' in g[0] else None
    out_s = []
    a = max(0, g[0]['L'] - 0.06); b = g[-1]['Lf'] + 0.14
    for w in g: out.append({'texto': w['texto'], 'inicio': t + w['L'] - a, 'fim': t + w['Lf'] - a, 'seg': i})
    parts += ['-i', f'work/s{i}.mp3']; flt += f'[{i}:a]aresample=44100,atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}];'
    t += b - a + SEG[i].get('g2', 0.04)
flt += ''.join(f'[a{i}]' for i in range(len(SEG))) + f'concat=n={len(SEG)}:v=0:a=1[o]'
subprocess.run(['ffmpeg', '-y', '-v', 'error'] + parts + ['-filter_complex', flt, '-map', '[o]', '-ac', '1', 'voice.wav'], check=True)
json.dump(out, open('work/words.json', 'w'), ensure_ascii=False); print('total', round(t, 2))
