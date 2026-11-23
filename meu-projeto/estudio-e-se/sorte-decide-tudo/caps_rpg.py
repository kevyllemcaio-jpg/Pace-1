# legenda grande, centralizada, branca com contorno escuro; palavras-chave em amarelo
import json, sys, unicodedata
W = json.load(open('work/words.json'))
KEY = ['SORTE', 'DESTINO', 'HERÓI', 'LENDÁRIO', 'INÚTIL', 'CLASSE', 'ALEATÓRIA', 'ABSURDA', 'ESPADA', 'ANEL', 'ARMADURA', 'ATRIBUTOS', 'NÚMERO', 'ERRADA', 'DIFERENTE', 'TREMER', 'MENSAGEM', 'ASSASSINO', 'CRIATURA', 'INOFENSIVA', 'SLIME', 'PODER', 'HABILIDADE', 'NORMAL', 'RARA', 'DESBLOQUEADO', 'MUNDO', 'FUGIR', 'SAÍDA']
def t(s): return f"{int(s//3600)}:{int(s%3600//60):02d}:{s%60:05.2f}"
chunks, cur = [], []
for w in W:
    txt = w['texto'].upper()
    if cur and (len(cur) >= 3 or w['inicio'] - cur[-1]['b'] > 0.25 or sum(len(c['t']) for c in cur) + len(txt) > 16): chunks.append(cur); cur = []
    cur.append({'t': txt, 'a': w['inicio'], 'b': w['fim']})
if cur: chunks.append(cur)
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Black,86,&H00FFFFFF,&H00FFFFFF,&H00180A0B,&H96000000,1,0,0,0,100,100,0,0,1,9,4,2,60,60,640,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
def kw(x): s = x.strip('.,!?…:;"'); return any(k == s or (len(k) > 4 and k in s) for k in KEY) or s.isdigit()
ev = []
for i, ch in enumerate(chunks):
    a = ch[0]['a']; b = chunks[i + 1][0]['a'] if i + 1 < len(chunks) else ch[-1]['b'] + 0.5; b = min(b, ch[-1]['b'] + 0.5)
    txt = ' '.join((r'{\c&H3FD2FF&}' + x['t'] + r'{\c&HFFFFFF&}') if kw(x['t']) else x['t'] for x in ch)
    ev.append(f"Dialogue: 0,{t(a)},{t(b)},Cap,,0,0,0,,{{\\fad(40,0)\\t(0,90,\\fscx108\\fscy108)\\t(90,180,\\fscx100\\fscy100)}}{txt}")
open('work/caps.ass', 'w').write(head + '\n'.join(ev) + '\n'); print(len(chunks), 'blocos')
