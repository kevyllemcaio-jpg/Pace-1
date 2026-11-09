# Theo Vai Ficar Rico! — estúdio da série

Série animada vertical (TikTok/Shorts) em que o público decide o próximo episódio.

## Padrão da série
- **Personagem:** Theo, 17 anos, escola pública em Salvador. Cabelo cacheado escuro, uniforme
  branco com gola azul, calça azul-marinho, mochila escura, tênis branco.
- **Elenco:** mãe (blusa coral, coque), diretora (roxo, óculos, crachá), dono da cantina
  (boné vermelho, bigode, avental), Dona Cida (lenço roxo, carrinho de açaí no portão), alunos.
- **Cenários:** quarto (noite, cartaz "META: SAIR RICO"), cozinha, pátio do colégio com a
  cantina, fachada no calor, mercadinho do bairro, corredor no fim de tarde, portão/rua.
- **HUD fixo:** DIA · SALDO · FORMATURA (contagem regressiva). O saldo anima quando muda.
- **Passos** em pílula amarela ("PASSO 1 · MERCADINHO").
- **Legendas** grandes, 1–3 palavras por vez, sincronizadas com a narração; `*palavra*` = amarelo.
- **Final:** painel A/B → "Comenta A ou B" → "EPISÓDIO 2 · VOCÊ DECIDE".

## Como fazer um episódio
1. Copie `estudio/episodios/ep01.js` e edite as cenas (`fala`, `hud`, `passo`, `desenhar`).
   Dentro de `desenhar`, `c.w('palavra')` é o instante em que a narração diz aquela palavra.
2. `npm run previa -- estudio/episodios/ep02.js` → um PNG por cena em `saida/`
   (`--cena=5` para só uma).
3. `npm run video -- estudio/episodios/ep02.js` → `saida/ep02.mp4` (1080×1920, 30 fps).
4. `npm run capa -- estudio/episodios/ep02.js` → `saida/ep02-capa.png`.

Requisitos: Node + Playwright (Chromium), ffmpeg, Python 3 com `numpy` e `edge-tts`
(`pip install edge-tts numpy`). Narração: voz `pt-BR-AntonioNeural`, cache em `saida/.voz/`.
Fontes Anton e Oswald (SIL OFL) em `estudio/fontes/`. Trilha e efeitos são sintetizados
(`estudio/sons.py`).
