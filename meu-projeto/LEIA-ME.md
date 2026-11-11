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

## Abertura "No episódio anterior" (a partir do episódio 3 — já implementada)
No código: cenas com `lembranca: 'inicio'` (a primeira, toca o replay) e `lembranca: true`. Ver ep03.js.
Todo episódio novo começa com um resumo curtinho do anterior (uns 6–10 s, no máximo 3–4 cenas):
- Reaproveita **cenas reais do episódio anterior** (os momentos-chave: o problema, o número
  principal e a escolha A/B que venceu), mais rápidas que no original.
- Visual de **lembrança/pensamento**: imagem **pálida e dessaturada**, com uma **neblina** clara
  nas bordas (vinheta esbranquiçada) e leve desfoque, para ficar claro que é passado.
- Texto fixo no topo: **"NO EPISÓDIO ANTERIOR..."** (ou variação criativa: "ONDE PARAMOS",
  "VOCÊ PERDEU?"), com um **ícone de replay (seta circular girando)** ao lado.
- **Som de replay** (rebobinar/voltar a fita) na entrada do resumo e um "whoosh" de volta ao
  presente quando acaba; a narração resume em 1–2 frases.
- Termina com a **escolha vencedora** em destaque ("VOCÊS ESCOLHERAM B") e corta para a cena
  nova em cores normais.

## Especiais "E se..." — personagem realista (estudio/corpo.js)
Os especiais usam `corpo()`: proporções humanas, músculos (`musculo` 0 = normal de moletom, 1 = brutamontes),
`energia` (veias laranja brilhando) e braços/pernas com cinemática inversa. As poses são animadas com
`animar([[tempo, pose], ...], lt, poseBase(m))`, `passo()` para andar e `tremor()` para impacto.
Ver `estudio/episodios/especial-forca.js`. A série do Kevylem continua no estilo original.

## Série do Kyle (estilo turma chibi) — estudio/chibi.js
Personagens originais: Kyle (óculos redondos, cabelo castanho bagunçado com topete, camiseta verde-água com
aviãozinho de papel), Lara (cacheada, tiara amarela, saia roxa), Rafa (camisa vermelha 7), mãe e alunos.
Visual: contorno branco de adesivo (`filtroAdesivo()`), fundos vermelho/azul na diagonal (`fundoDiagonal`),
fonte arredondada Baloo (`tituloRed`, `pilulaRed`), legendas em Baloo (`window.FONTE_LEGENDA`).
Contador: "DIA N · FALTAM X DIAS" pro baile. Episódio 1: `estudio/episodios/kyle01.js`.
