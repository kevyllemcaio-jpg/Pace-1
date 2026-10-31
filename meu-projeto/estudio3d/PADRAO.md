# Estúdio 3D — formato "Como funciona"

Formato principal do canal a partir de agora (baseado no vídeo de referência).

## Como o vídeo é
- **Mundo 3D low-poly** (formas simples, facetadas), cores vivas, céu azul.
- **Câmera contínua, sem cortes**: cada bloco só diz para onde a câmera vai; o motor
  faz o movimento suave entre um bloco e outro.
- **Narração em 2ª pessoa, construindo a coisa passo a passo**:
  1. Abertura com a **pergunta** (título na tela no 1º quadro = thumb) + a situação.
  2. "Então você põe X…" → mostra X sendo construído.
  3. "Esse/Essa é o/a NOME TÉCNICO."
  4. "Mas…" → um problema novo (com cartão/etiqueta vermelha).
  5. Repete 2–4 três ou quatro vezes.
  6. Uma curiosidade do dia a dia ("É por isso que…").
  7. "Parabéns: você construiu um(a) …!"
  8. Final padrão: **"QUER FAZER VÍDEOS ASSIM COM IA? LINK NA BIO!"** (`textoFinal` + `FALA_FINAL`).
- **Legenda palavra por palavra** (até 2 palavras por vez), termos-chave em amarelo.
- **Cartão** com número grande em vermelho (`cartao`), **etiqueta** vermelha (`etiqueta`),
  selo verde (`ok`) e onomatopeia (`som`).
- **Vista em corte** (`corte: true`) para mostrar o que fica debaixo da terra/água.
- Duração alvo: **~60–75 s**.

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

## Comandos
- `node estudio3d/render3d.js ponte --previa` → uma imagem por bloco (rápido)
- `node estudio3d/quadros.js ponte 0,10.5,30` → imagens de instantes exatos
- `node estudio3d/render3d.js ponte` → vídeo final em `saida/ponte.mp4` (~25 s de render por segundo de vídeo)

Requer: `npm install` e `pip install edge-tts`.
