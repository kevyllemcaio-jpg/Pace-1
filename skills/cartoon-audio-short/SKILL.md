---
name: cartoon-audio-short
description: Make a vertical animated cartoon Short (1080x1920, 30 fps) for the "E SE...?" series with the "bolinha" character. Offers ideas, writes the script, generates (or uses an uploaded) voiceover, animates the scenes, mixes music + SFX at 50 % of the voice, burns word-by-word captions and delivers the MP4 (cover in the last 2 s), the cover JPG and a YouTube sheet (.md). Use for any cartoon short / animated "e se" video request.
---

# Cartoon Short "E SE...?" — ideia → roteiro → voz → MP4 + capa + ficha do YouTube

Personagem principal: **bolinha** (cabeça branca lisa, olhos pretos ovais, moletom/jaqueta amarela,
calça azul, luvas e tênis brancos). Elenco de apoio pronto no kit: 7 meninas + 10 colegas, mãe,
professora, zelador, diretora, gato, galinha, pombo.

## Regras
- Histórias, piadas e cenas **sempre originais**. Uma ideia "e se..." de outro canal pode ser ponto
  de partida, mas nunca recriar vídeo ou capa de outro criador.
- Nada de pessoas reais, marcas, violência real ou tema pesado (ex.: ataque a escola).
- Texto que aparece no cenário deve ler certo (não espelhado).
- Nunca editar ou re-temporizar a voz: a imagem é que segue a voz; cada reação cai 0–3 quadros antes da palavra.
- Música a **50 % da voz** (−6 dB, RMS com gate); efeitos ≤ 50 %, picos ≤ 0,7× o pico da voz. Sempre `mix.py`.
- Seguir a ordem da lista de vídeos do projeto (`LISTA.md`) quando existir.
- Mostrar prévias (folha de quadros) antes do render final.

## Entrega (todo vídeo)
1. `<slug>.mp4` — Short com a **capa nos 2 segundos finais** (para escolher como miniatura).
2. `capa-<slug>.jpg` — capa: quadro forte do vídeo + 2 linhas grandes (amarelo / rosa, contorno escuro),
   texto **sem cobrir o rosto** do personagem.
3. `<slug>.md` — título, descrição, tags e todos os campos da tela "Adicionar detalhes" do YouTube.
4. **Legenda palavra por palavra** no terço de baixo (acima da área de botões do Shorts, sem cobrir rostos);
   palavra falada em amarelo.

## Etapa 1 — Ideia e roteiro
- Duração alvo 25–35 s (~3,2 palavras/s com a voz a +25 %): 80–100 palavras.
- Fórmula: **gancho** (1ª frase = a pergunta "E se...?") → situação concreta → 3–4 escaladas, cada uma
  maior → virada ("Mas..." / "Até que...") → **final irônico curto** (últimas palavras do vídeo).
- Frases curtas, linguagem falada, números por extenso. Não descrever o que já se vê.
- O 1º quadro já é a cena de gancho (ex.: todo mundo encarando o bolinha) — é o que mais segura.

## Etapa 2 — Voz
- Se o usuário mandou áudio + texto: usar como `voice.mp3` e `script.txt`.
- Senão: voz provisória `python3 kit/voz.py "$(cat script.txt)" voice.mp3 pt-BR-AntonioNeural +25% work/words.json`
  (edge-tts; gera também os tempos de cada palavra). Avisar que não é para uso comercial; ElevenLabs para a final.
- Total de quadros = round(duração × 30). Liste as palavras com o quadro de início para cronometrar as cenas.

## Etapa 3 — Cenas (`web/story.js`)
Copie `kit/` para uma pasta do projeto, depois escreva `web/story.js` (veja `kit/exemplo/story-crush.js`):
- `TOTAL`, `FLASHES` e `SHOTS = [{ f0, f1, light, dof, cam:[{f,x,y,z,r,e}], kicks, build(f) }]`.
- `build(f)` devolve `{ world:{set,...}, actors:[...], fx:[...], lights:[...] }`, tudo função do quadro.
- Cenários (`world.set`): `class` (com `board`), `hall` (+`locker`,`boyDoor`), `gym`/`quadra` (`banner`,`plain`,`score`),
  `stage` (`banner`), `room` (sala da casa), `bedroom` (`sun`,`ring`,`neighbors`), `lunch`, `cantina`, `street` (`door`), `yard` (`pool`), `library`.
- Personagem: `{ who, x, y, s, pose, expr, look, tilt, sit, walk, hop, sq, rot, flip, props:{...}, uniform, blush, braids, plaque, cape, bermuda, bowtie, backpack }`.
  Expressões: neutral happy grin mischief surprised worried bored bliss squint scream scared proud stern spooky innocent laugh shocked love lovegrin.
  Poses: hang controller point wave up cheeks hero reachR braider flash clap pillow hips card cling boo raise shrug letter read run fallen guitar lift write watch crank wallet remote.
- Efeitos (`fx`): sparkle note dust speed exclaim(txt) fear lines confetti money thought(text/icons) waves bulb speech options quest arrow skip hud stamp hcount anger gauge meteor stream clover.
- Câmera: sem nada parado por mais de 4 quadros; troca de plano/movimento a cada 2–3 s; tranco (`kicks`) nos impactos;
  close no rosto nas reações; flash branco (`FLASHES`) em saltos de tempo.

Prévias: `node kit/render.mjs stills/a "0,60,120,..." && python3 kit/sheet.py stills/a stills/a.jpg` → olhar a folha
e corrigir enquadramento (personagem cortado, balão fora da tela, texto cobrindo rosto).

## Etapa 4 — Som e finalização
1. `audio.py` com a tabela de efeitos da história (base: `kit/exemplo/audio-crush.py`, sintetizadores em `kit/synth.py`):
   música para na virada e volta no final; efeitos nos eventos (whoosh, pop, thud, ting, lowhit, cheer...).
2. `python3 kit/mix.py voice.mp3 music.wav sfx.wav` → confirmar "music vs voice: −6.0 dB" e sfx ≤ −6 dB.
3. `node kit/render.mjs frames "0-<TOTAL-1>"` (~25 ms/quadro no 2D).
4. `OUT=<pasta de entrega> kit/finish.sh <pasta do projeto> <slug> <quadro da capa> "LINHA 1" "LINHA 2" [y do texto]`
   → codifica (−14 LUFS, limitador −1 dBFS), queima a legenda, gera a capa, cola a capa nos 2 s finais e checa trechos congelados/tela preta.
   Use `y` ≈ 200–300 para texto no alto quando o rosto estiver embaixo.
5. `OUT=<pasta de entrega> python3 kit/mkmd.py <slug> '<json com title, desc, cta, hash, tags, capa>'` → ficha do YouTube.
6. Enviar MP4 + capa + .md ao usuário e marcar o vídeo como pronto na lista.

## Requisitos
Node 18+, Python 3 com numpy + Pillow, ffmpeg com libass, Playwright + Chromium (`PW` aponta para o módulo se não estiver no node_modules),
`pip install edge-tts` para a voz provisória. Fontes: Inter Black (capa/legenda) e WenQuanYi (só se usar chinês).

## 3D (opcional, experimental)
`kit/teste-3d/` tem uma cena three.js no estilo roxo cinematográfico (cabeças ovais, luz de cinema, bloom e desfoque).
Precisa de `npm install three` e copiar `three.module.js` + `three.core.js` para a pasta (ou `THREE_JSM` apontando para `three/examples/jsm`).
Render com WebGL por CPU: ~1,2 s por quadro.
