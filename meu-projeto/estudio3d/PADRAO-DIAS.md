# Formato "N dias de…" (contador + escalada)

Padrão tirado do vídeo de referência do canal **"7 dias no escuro?"** (98 s, vertical 464×832,
60 fps). Quem fizer um vídeo novo nesse formato (pessoa ou IA) segue esta receita.
Ideias que servem: *7 dias sem dormir*, *30 dias sem açúcar*, *10 dias sem falar*,
*5 dias sem celular*, *1 semana no espaço*…

## 1. Estrutura (linha do tempo da referência)
| Tempo | Parte | O que acontece |
|---|---|---|
| 0–7 s | **Gancho** | Pergunta "E se você passasse 7 dias no escuro total, sem janela, sem relógio, nem a luz do celular?". O título **"7 DIAS / NO ESCURO?"** (branco + termo-chave em azul-claro) pisca alternando com o quarto iluminado a cada **0,3 s** nos primeiros ~3 s (prévia do que vem). Termina com **apagão**: a luz some e a tela fica preta. |
| 7 s | **DIA 1** | Selo grande "DIA 1" no centro (caixa com borda) + a voz fala "Dia 1". |
| 7–67 s | **Escalada** | Um bloco por dia (Dia 1…Dia 7), cada um com **1 sintoma real** + **1 efeito visual que mostra o sintoma**. Falas curtas, 2ª pessoa ("o seu cérebro começa a inventar…"). |
| 67–73 s | **Clímax** | "Dia 7. A porta abre." → silêncio de meio segundo → rangido → **clarão branco** e o quarto volta iluminado; personagem cobre os olhos ("a luz volta, e ela dói"). |
| 73–94 s | **Prova** | "Parece exagero?" → estudos reais em **cartões**: "FRANÇA · 1962 / 2 MESES NUMA CAVERNA" + carimbo vermelho torto "ACHOU QUE ERA 20/08 → ERA 14/09"; "13 PESSOAS VENDADAS POR 4 DIAS" com grade de bonequinhos (10 acendem). |
| 94–98 s | **Final** | Pergunta para comentar: cartão "QUANTOS DIAS VOCÊ AGUENTARIA NO ESCURO?" + balão de comentário "💬". Fala: "Comenta aí: quantos dias você aguentaria no escuro?" |

Regras de roteiro:
- Cada dia abre com a fala **"Dia N."** sozinha e depois o sintoma.
- O sintoma piora a cada dia (normal → estranho → assustador → confuso → clímax).
- Pelo menos um **número concreto** por dia ("em 20 minutos…", "um pouco mais que 24 horas",
  "contar até 120 leva quase 5 minutos").
- Dias "perdidos" no meio ("DIA 5?", "DIA 3?") mostram a confusão do personagem.
- Números e estudos conferidos (comentário no topo do arquivo do vídeo).
- Duração: a referência tem 98 s; para Shorts mire **60–90 s** (corte dias repetidos).

## 2. Visual
- **Cenário único** (quarto: cama, criado-mudo com relógio digital, espelho, janela, porta),
  câmera quase parada — **sem cortes** depois do gancho; o que muda é a luz.
- **Escurecer progressivo**: no apagão tudo fica quase preto; o personagem e o quarto
  aparecem em tons de cinza-azulado, cada vez mais apagados. Na luz que volta: tela
  estourada em branco que vai baixando até o quarto normal colorido.
- **HUD fixo no canto superior esquerdo** a partir do Dia 1:
  `HORAS NO ESCURO` (pequeno) + número grande que **conta sem parar** + `DIA N` ao lado.
  Cor do número: **branco** (dia 1) → **amarelo** (dias 2–3) → **vermelho** (dia 4 em diante).
  Quando o personagem se perde, o número vira **"??"** e o dia vira "DIA 5?".
- **Um efeito visual por sintoma** (contorno fino, cor neon, sobre o escuro):
  - barulhos → **ondas/anéis** concêntricos com etiqueta ("CARRO", "GELADEIRA");
  - clarões → **pontinhos de luz coloridos** piscando (verde, laranja, roxo);
  - alucinações → **desenhos de contorno** (prédios, rosto) e um rosto verde de olhos enormes no espelho;
  - relógio interno → **relógio analógico** girando rápido + "24h30 / o seu 'dia' agora";
  - tempo se arrastando → **dois contadores lado a lado**: `VOCÊ CONTA` (branco) × `TEMPO REAL` (amarelo).
- **Legenda palavra por palavra** (2–3 palavras), branca com contorno, embaixo do
  personagem; palavra-chave em **amarelo**.
- **Personagem** muda de expressão a cada dia (tranquilo → assustado → cansado → confuso),
  pode andar/virar de lado; no clímax cobre os olhos com a mão.
- **Cartões da prova**: fundo escuro translúcido, texto branco em caixa alta, local/ano pequeno
  em cima; **carimbo vermelho** girado ~-5° para o dado que choca.

## 3. Som (medido no áudio da referência)
- **Quase sem música**: o escuro é silêncio + voz. Use `config.musica = false` ou música
  bem baixa; se quiser cama, use `tensao` (zumbido grave).
- **`impacto`** (boom grave que cai de ~86 Hz para ~43 Hz em ~1,3 s): no 1º quadro, nos
  "flashes" do gancho, no **apagão** e quando **a luz volta**.
- **`dia`** (batida seca ~120→86 Hz, 0,45 s): **toda vez que aparece "DIA N"** — é a marca do formato.
- **Silêncio total de ~0,4 s** antes do clímax ("A porta abre." → nada → rangido).
- **`porta`** (rangido) logo depois de "a porta abre"; **`ofuscar`** (chiado agudo subindo) no clarão.
- **`tique`** enquanto o relógio gira ou os contadores andam.
- **`whoosh`** no pisca-pisca do gancho; **`pop`** nos cartões e **`plim`** no carimbo (automáticos).
- Voz sempre por cima de tudo; os efeitos ficam por baixo da voz, nunca ao mesmo tempo que
  uma palavra importante.

Exemplo no roteiro (`videos/<tema>.js`):
```js
sons: [
  { em: 'Dia', tipo: 'dia' },          // batida do "DIA N"
  { em: (b) => 0, tipo: 'impacto' },   // boom no início do bloco
  { em: 'abre', depois: 0.5, tipo: 'porta' },
  { em: 'luz', tipo: 'ofuscar' },
],
```

## 4. Entrega
Igual ao `PADRAO.md` (capa + título com #shorts + legenda pronta + registro em
`publicacao/POSTAGEM.md`), mas a chamada final deste formato é **a pergunta para comentar**
(gera comentários); a linha "🔧 Quer aprender a fazer vídeos assim? Deixa o like, me segue e
acessa o link na bio!" vai na descrição.
