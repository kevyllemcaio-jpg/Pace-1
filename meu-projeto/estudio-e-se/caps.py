# caps.py <words.json> <out.ass> — word-by-word captions in the lower third (above the Shorts UI, below faces)
import sys, json
words = json.load(open(sys.argv[1]))
def t(s): h = int(s // 3600); m = int(s % 3600 // 60); return f"{h}:{m:02d}:{s % 60:05.2f}"
chunks, cur = [], []
for i, w in enumerate(words):
    txt = w['texto'].upper()
    if cur and (len(cur) >= 3 or w['inicio'] - cur[-1]['b'] > 0.28 or sum(len(c['t']) for c in cur) + len(txt) > 18):
        chunks.append(cur); cur = []
    cur.append({'t': txt, 'a': w['inicio'], 'b': w['fim']})
if cur: chunks.append(cur)
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Black,84,&H00FFFFFF,&H00FFFFFF,&H00261219,&H96000000,1,0,0,0,100,100,0,0,1,8,4,2,60,60,370,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for ci, ch in enumerate(chunks):
    end_chunk = chunks[ci + 1][0]['a'] if ci + 1 < len(chunks) else ch[-1]['b'] + 0.4
    end_chunk = min(end_chunk, ch[-1]['b'] + 0.6)
    for wi, w in enumerate(ch):
        a = w['a']; b = ch[wi + 1]['a'] if wi + 1 < len(ch) else end_chunk
        parts = [(r'{\c&H3FD2FF&\fscx108\fscy108}' + x['t'] + r'{\c&HFFFFFF&\fscx100\fscy100}') if j == wi else x['t'] for j, x in enumerate(ch)]
        ev.append(f"Dialogue: 0,{t(a)},{t(b)},Cap,,0,0,0,,{' '.join(parts)}")
open(sys.argv[2], 'w').write(head + '\n'.join(ev) + '\n')
print(len(chunks), 'chunks')
