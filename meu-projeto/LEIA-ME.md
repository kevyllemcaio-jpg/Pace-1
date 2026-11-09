# Kevylem Vai Ficar Rico! — estúdio da série

Série animada vertical (TikTok/Shorts) em que o público decide o próximo episódio.

## Padrão da série
- **Personagem:** Kevylem, 17 anos, escola pública em Salvador. Cabelo cacheado escuro, uniforme
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

## Capa dos próximos episódios (padrão do perfil)
A partir do episódio 2, toda capa segue este modelo (referência: grade do perfil @theodecideofc):
1. **Topo:** "EPISÓDIO" em branco com contorno + **número grande em amarelo**.
2. Logo abaixo, **pílula escura** com o subtítulo do episódio em 2–3 palavras
   (ex.: "O GELADINHO", "O EMPREGADO", "O GRUPO").
3. **Card de dinheiro antes → depois** no meio: valor antigo em vermelho, seta, valor novo em
   verde, com rótulos pequenos em cima (ex.: "SALDO ANTES R$ 4 → DEPOIS R$ 149";
   "KEVYLEM GANHA R$ 20 · O DONO FATURA R$ 840").
4. **Etiqueta amarela inclinada** reforçando o número (ex.: "EM 20 MINUTOS", "42× MAIS").
5. **Personagens do episódio** em pé no cenário, com expressão marcante, segurando o produto.
6. **Rodapé fixo:** "RICO ATÉ A **FORMATURA**" (FORMATURA em amarelo) + capelo.
7. Cenário do episódio ao fundo, mais claro/suave para o texto destacar.
A capa deve resumir o **conteúdo** do episódio (o número que mais impressiona), não a primeira cena.
