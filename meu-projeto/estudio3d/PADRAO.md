# Estúdio 3D — formato "Como funciona"

Formato principal do canal a partir de agora (baseado no vídeo de referência).

## Como o vídeo é
- **Mundo 3D low-poly** (formas simples, facetadas), cores vivas, céu azul.
- **Câmera contínua, sem cortes**: cada bloco só diz para onde a câmera vai; o motor
  faz o movimento suave entre um bloco e outro.
- **Narração em 2ª pessoa, construindo a coisa passo a passo**:
  1. Abertura com a **pergunta** (título na tela no 1º quadro = thumb) + a situação.
     **Regra da thumb (1º quadro):** nada de fundo vazio só com letras.
     - Em cima: a pergunta, grande e com os termos-chave em amarelo.
     - Embaixo, **centralizado**: uma parte da construção do vídeo já pronta e bem
       visível (ex.: um trecho da ponte, a boca do túnel, a caixa d'água).
     - Ao lado: o **personagem apontando para a construção** (`bracos: 'aponta'`), de frente
       para a câmera, com cara de empolgado.
     - Câmera parada nesse enquadramento no 1º quadro; o movimento começa só depois.
     **Atualização (capa "meio"):** use `config.tituloEstilo = 'meio'` → o título fica **mais baixo e
     centralizado** (meio da tela), com linhas levemente inclinadas e um "pulinho" depois do 1º quadro.
     A construção fica na **parte de cima** do quadro e o personagem **embaixo**, apontando para ela.
     No bloco da capa a legenda fica escondida para não brigar com o título.
  2. "Então você põe X…" → mostra X sendo construído.
  3. "Esse/Essa é o/a NOME TÉCNICO."
  4. "Mas…" → um problema novo (com cartão/etiqueta vermelha).
  5. Repete 2–4 três ou quatro vezes.
  6. Uma curiosidade do dia a dia ("É por isso que…").
  7. "Parabéns: você construiu um(a) …!"
  8. Final padrão: **"QUER APRENDER A FAZER VÍDEOS ASSIM? DEIXA O LIKE E ME SEGUE! LINK NA BIO"** (narração: "Quer aprender a fazer vídeos como esse? Deixa o like, me segue, e acessa o link na bio!" — sem falar que é feito com IA). Trocar só o final de um vídeo pronto: `--so-audio --refazer-final` (~2 min) (`textoFinal` + `FALA_FINAL`).
- **Legenda palavra por palavra** (até 2 palavras por vez), termos-chave em amarelo.
- **Cartão** com número grande em vermelho (`cartao`), **etiqueta** vermelha (`etiqueta`),
  selo verde (`ok`) e onomatopeia (`som`).
- **Vista em corte** (`corte: true`) para mostrar o que fica debaixo da terra/água.
- Duração alvo: **~60–75 s**.
- **Música de fundo original** em todo vídeo (`musica.py`, gerada por código → sem direitos de
  terceiros, segura no YouTube, TikTok e Instagram). Cada vídeo ganha uma música diferente; ela
  abaixa sozinha quando a voz fala. Entra automaticamente no `render3d.js`
  (`node estudio3d/musicar.js <video>` recoloca a música num vídeo já pronto).

## Efeitos sonoros automáticos
- Todo corte seco ganha um *whoosh*; cartão = *pop*; etiqueta = *plim*; selo ✓ = *ding*; texto final = *pop* (no motor, `sons()`; desligar com `config.sonsAuto = false`).
- Para refazer só o áudio de um vídeo pronto (≈20 s): `node estudio3d/render3d.js <video> --so-audio` (vídeos antigos com "link na bio": acrescente `--final-antigo`).

## Entrega de cada vídeo
- Quando o usuário pede um vídeo, fazer direto, no padrão atual, sem pedir aprovação.
- Mandar o vídeo + a capa e, logo abaixo, na mesma mensagem, o **título (YouTube, com #shorts)** e a **legenda/descrição** pronta pra copiar (resumo curioso + linha "🔧 Quer aprender a fazer vídeos assim? Deixa o like, me segue e acessa o link na bio!" + hashtags). Registrar também em `publicacao/POSTAGEM.md`.

## Personagem principal ("você")
`personagem3d.js`: jaqueta amarela sem zíper, calça preta, tênis branco com sola vermelha,
cabelo castanho-escuro curto repartido de lado. Aparece na abertura, comemora no
"Parabéns" e fala com o público no final.
Braços: `normal`, `cima`, `aceno`, `cabeca`, `aponta`. Rosto: `feliz`, `serio`, `surpreso`, `preocupado`.

## Arquivos
- `motor.js` — linha do tempo, câmera, textos na tela.
- `mundo.js` — peças low-poly (terreno, água, árvore, casa, caminhão, carro, respingos).
- `personagem3d.js` — o personagem.
- `videos/<tema>.js` — o roteiro de cada vídeo (falas + o que acontece em cada bloco).

## Renderização retomável
O `render3d.js` grava o vídeo em pedaços de 10 s em `saida/.pedacos/`. Se o computador/ambiente
reiniciar no meio, é só rodar o mesmo comando de novo: ele pula os pedaços prontos e continua.

## Comandos
- `node estudio3d/render3d.js ponte --previa` → uma imagem por bloco (rápido)
- `node estudio3d/quadros.js ponte 0,10.5,30` → imagens de instantes exatos
- `node estudio3d/render3d.js ponte` → vídeo final em `saida/ponte.mp4` (~25 s de render por segundo de vídeo)

Requer: `npm install` e `pip install edge-tts numpy scipy`.
