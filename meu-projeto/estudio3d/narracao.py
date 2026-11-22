"""Narração com a VOZ DO USUÁRIO (gravação própria) para um vídeo do estúdio 3D.

Uso:
  python3 estudio3d/narracao.py <video> <gravacao.mp3|m4a|wav> [--modelo=medium]

O que faz:
  1. Transcreve a gravação palavra por palavra (faster-whisper), usando o roteiro como guia.
  2. Edita a voz: corta o silêncio do começo/fim, encurta pausas longas para um "respirinho"
     (0,2 s) e tira palavras repetidas na sequência ("preta, preta" -> "preta").
  3. Trata o som: corta graves de ruído, reduz chiado, comprime e normaliza o volume (-14 LUFS).
  4. Divide a fala nas cenas (blocos) do roteiro, achando onde cada fala começa na gravação.
  Saída: estudio3d/narracao/<video>.wav e estudio3d/narracao/<video>.json
  O vídeo usa isso com `narracao: '<video>'` no config (o render3d.js lê e sincroniza tudo).

Requer: pip install faster-whisper scipy numpy
"""
import json, os, re, subprocess, sys, unicodedata
import numpy as np
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.abspath(__file__))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
opts = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
nome, gravacao = args[0], args[1]
modelo = opts.get('modelo', 'medium')
RESPIRO = float(opts.get('respiro', '0.2'))   # pausa máxima entre palavras depois da edição
pasta = os.path.join(RAIZ, 'narracao'); os.makedirs(pasta, exist_ok=True)
tmp = os.path.join(pasta, f'.{nome}')


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


def sh(*a):
    subprocess.run(a, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# falas do roteiro (lidas do arquivo do vídeo)
src = open(os.path.join(RAIZ, 'videos', f'{nome}.js'), encoding='utf8').read()
falas = re.findall(r"fala: '([^']*)'", src)

# 1) transcrição com tempos por palavra
sh('ffmpeg', '-y', '-i', gravacao, '-ac', '1', '-ar', '16000', tmp + '16.wav')
from faster_whisper import WhisperModel
m = WhisperModel(modelo, device='cpu', compute_type='int8')
sr, a = wavfile.read(tmp + '16.wav')
segs, _ = m.transcribe(a.astype(np.float32) / 32768, language='pt', word_timestamps=True, initial_prompt=' '.join(falas))
pal = [{'texto': w.word.strip(), 'inicio': w.start, 'fim': w.end} for s in segs for w in s.words]
# tira repetição imediata ("preta, preta")
limpas = []
for w in pal:
    if limpas and norm(w['texto']) and norm(w['texto']) == norm(limpas[-1]['texto']) and w['inicio'] - limpas[-1]['fim'] < 1.2:
        continue
    limpas.append(w)
pal = limpas

# 2) trechos a manter: cada palavra com uma folguinha; pausas longas viram "respirinho"
FOLGA = 0.06
trechos = []
for w in pal:
    ini, fim = max(0, w['inicio'] - FOLGA), w['fim'] + FOLGA
    if trechos and ini - trechos[-1][1] <= RESPIRO:
        trechos[-1][1] = fim
    else:
        trechos.append([ini, fim])
# monta a voz editada (8 ms de fade em cada corte para não estalar)
filtros, rotulos = [], []
for i, (ini, fim) in enumerate(trechos):
    filtros.append(f'[0:a]atrim=start={ini:.3f}:end={fim:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={max(0, fim - ini - 0.008):.3f}:d=0.008[t{i}]')
    rotulos.append(f'[t{i}]')
# entre trechos: silêncio do respiro
filtros.append(f"{''.join(rotulos)}concat=n={len(trechos)}:v=0:a=1[cru]")
# tratamento: graves de ruído fora, menos chiado, compressão suave, volume de Shorts
filtros.append('[cru]highpass=f=85,afftdn=nf=-28,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,loudnorm=I=-14:TP=-1.2:LRA=9[saida]')
# respiro entre trechos: adiciona RESPIRO de silêncio no fim de cada trecho (menos o último)
for i in range(len(trechos) - 1):
    filtros[i] = filtros[i].replace(f'[t{i}]', f',apad=pad_dur={RESPIRO - 2 * FOLGA:.3f}[t{i}]') if RESPIRO > 2 * FOLGA else filtros[i]
saida_wav = os.path.join(pasta, f'{nome}.wav')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', gravacao, '-filter_complex', ';'.join(filtros), '-map', '[saida]', '-ac', '1', '-ar', '48000', saida_wav], check=True)

# novo tempo de cada palavra (linha do tempo editada)
pad = max(0.0, RESPIRO - 2 * FOLGA)
desloc, acc = [], 0.0
for ini, fim in trechos:
    desloc.append((ini, fim, acc))
    acc += (fim - ini) + pad


def novo(t):
    for ini, fim, d in desloc:
        if ini - 1e-6 <= t <= fim + 1e-6:
            return d + (t - ini)
    return None


for w in pal:
    w['inicio'], w['fim'] = round(novo(w['inicio']), 3), round(novo(w['fim']), 3)
total = acc - pad

# 2b) segunda passada pelo VOLUME real: o reconhecimento "estica" palavras por cima de pausas,
#     então encolhe todo silêncio maior que o respiro e reajusta os tempos das palavras.
log = subprocess.run(['ffmpeg', '-i', saida_wav, '-af', f'silencedetect=n=-38dB:d={RESPIRO + 0.05:.2f}', '-f', 'null', '-'], capture_output=True, text=True).stderr
ini_s = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
fim_s = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
cortes = []  # (ini, fim) a remover
for i0, f0 in zip(ini_s, fim_s):
    meio = RESPIRO / 2
    if i0 <= 0.01: cortes.append((0.0, max(0.0, f0 - 0.04)))          # silêncio no começo: quase tudo fora
    else: cortes.append((i0 + meio, f0 - meio))
if len(ini_s) > len(fim_s): cortes.append((ini_s[-1] + 0.15, total + 5))  # silêncio no fim
cortes = [(a0, b0) for a0, b0 in cortes if b0 - a0 > 0.02]
if cortes:
    manter, t0 = [], 0.0
    for a0, b0 in cortes:
        manter.append((t0, a0)); t0 = b0
    manter.append((t0, total + 5))
    manter = [(x, y) for x, y in manter if y - x > 0.01]
    fs = [f'[0:a]atrim=start={x:.3f}:end={y:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.006,afade=t=out:st={max(0, y - x - 0.006):.3f}:d=0.006[k{i}]' for i, (x, y) in enumerate(manter)]
    n = len(fs)
    fs.append(''.join(f'[k{i}]' for i in range(n)) + f'concat=n={n}:v=0:a=1[o]')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', saida_wav, '-filter_complex', ';'.join(fs), '-map', '[o]', '-ar', '48000', saida_wav + '.tmp.wav'], check=True)
    os.replace(saida_wav + '.tmp.wav', saida_wav)

    def comprime(t):
        tirado = 0.0
        for a0, b0 in cortes:
            if t >= b0: tirado += b0 - a0
            elif t > a0: return a0 - tirado
        return t - tirado
    for w in pal:
        w['inicio'], w['fim'] = round(comprime(w['inicio']), 3), round(comprime(w['fim']), 3)
    total = comprime(total)

# 3) divide a fala nos blocos: acha, em sequência, as 2 primeiras palavras de cada fala
toks = [norm(w['texto']) for w in pal]
inicios, k = [], 0
for f in falas:
    alvo = [norm(x) for x in f.split() if norm(x)][:2]
    achou = None
    for j in range(k, len(toks)):
        if toks[j] == alvo[0] and (len(alvo) < 2 or (j + 1 < len(toks) and toks[j + 1].startswith(alvo[1][:3]))):
            achou = j; break
    if achou is None:
        for j in range(k, len(toks)):
            if toks[j] == alvo[0]: achou = j; break
    if achou is None:
        print(f'  !! não achei o começo da fala: "{f}" (fica junto da anterior)')
        inicios.append(None); continue
    inicios.append(achou); k = achou + 1
blocos = []
for i, j in enumerate(inicios):
    prox = next((x for x in inicios[i + 1:] if x is not None), None)
    if j is None:
        blocos.append({'inicio': None}); continue
    ini = 0.0 if i == 0 else round(pal[j]['inicio'] - 0.03, 3)
    fim = round(pal[prox]['inicio'] - 0.03, 3) if prox is not None else round(total + 0.4, 3)
    ws = pal[j:prox] if prox is not None else pal[j:]
    blocos.append({'inicio': ini, 'fim': fim, 'texto': ' '.join(w['texto'] for w in ws),
                   'palavras': [{'texto': w['texto'], 'inicio': round(w['inicio'] - ini, 3), 'fim': round(w['fim'] - ini, 3)} for w in ws]})
json.dump({'audio': f'{nome}.wav', 'duracao': round(total, 3), 'blocos': blocos}, open(os.path.join(pasta, f'{nome}.json'), 'w'), ensure_ascii=False, indent=1)
for b in blocos:
    if b.get('inicio') is not None: print(f"{b['inicio']:6.2f}-{b['fim']:6.2f}  {b['texto']}")
print(f'Pronto: {saida_wav} ({total:.1f} s)')
for f in (tmp + '16.wav',):
    os.remove(f)
