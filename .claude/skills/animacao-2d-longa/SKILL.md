---
name: "animacao-2d-longa"
description: "Cria vídeos explicativos animados em 2D (16:9, 9:16, 1:1 ou 4:5) com bonecos em 7 estilos (homens, mulheres, crianças, idosos e animais), editor de personagens, storyboard para aprovação, trilha e efeitos escolhidos pelo tema, narração e legendas. Aceita roteiro e áudio externos. Use quando pedirem vídeo animado, explicativo animado, história animada ou vídeo no estilo aivxer."
---

# Animação 2D longa (PT-BR)

**Adaptada da skill "2D Animation Long Form" de aivxer** (criador de tutoriais de IA no YouTube). Mantenha este crédito ao compartilhar.

A skill transforma um tema, um roteiro ou uma narração já gravada num vídeo totalmente animado. O estilo é o de histórias desenhadas no papel: bonecos de cabeça redonda com um contorno grosso, luz noturna, câmera sempre se movendo, letreiros escritos à mão, gráficos dentro da cena, narrador e personagens com voz, trilha original e efeitos sonoros. Tudo é desenhado em código (skia-python) e o ffmpeg monta o vídeo. Nada é pago.

**Testada em 15/11/2026:**
- 16:9 com vozes geradas: a transcrição bateu 96% com o roteiro e o áudio ficou em -14,5 LUFS.
- 9:16 com narração externa importada e legendas automáticas.
- Importação de roteiro em .md e .docx.
- Em 16/11/2026 (2ª revisão): 23 penteados modernos em camadas, iguais no editor e no vídeo; 12 cenários prontos escolhidos pelo tema; editor com remover personagem e confirmação de quem vai para o vídeo.
- Em 16/11/2026: modelos de mulher, criança, avós e animais, 18 cabelos separados por gênero e 10 roupas, conferidos lado a lado no editor e no vídeo.
- Em 16/11/2026, num Short de 23 s com áudio do usuário: folha de 7 estilos, storyboard, trilha e efeitos automáticos pelo tema, e editor de personagens com o elenco aplicado ao vídeo.

## Três jeitos de começar

1. **Só um tema:** Claude escreve o roteiro (passo 1 do fluxo) e gera as vozes.
   - **Pedido de ideias** ("me dá ideias sobre…"): entregue só as ideias, cada uma com título e uma frase de gancho, e pare. Não escreva roteiro nem crie personagens até ele escolher uma.
   - **Quantos personagens: pergunte antes de escrever**, numa linha, se o pedido não disser: (a) **só narrador**, com um boneco que ilustra o que é dito e sem diálogos (o padrão); (b) **narrador + 1 personagem** que fala de vez em quando; (c) **história com 2 ou 3 personagens** que conversam. Se ele não responder ou pedir para seguir direto, use (a). Nunca invente personagens extras por conta própria.
2. **Roteiro pronto** (arquivo .txt, .md, .docx, .pdf ou .srt, ou texto colado na conversa, que Claude salva em .txt): `python3 ~/vid/lib/importar_roteiro.py ~/vid/NOME roteiro.docx --formato 9:16 --narrador piper:faber-medium`. Depois mostre ao usuário o resumo (falas, personagens, capítulos, duração estimada) e confirme as vozes.
3. **Áudio pronto** (ElevenLabs, a própria voz, qualquer mp3, wav, m4a ou mp4): veja "Áudio externo" abaixo. É o melhor caminho quando o usuário não gostar das vozes sintéticas.

**Modo direto (o mais rápido e econômico):** se o pedido já traz o material, o formato e o elenco ou estilo (ou diz "pode seguir direto"), não pergunte nada: pule a folha de estilos e as amostras de trilha, mostre só o storyboard e, aprovado, rode o vídeo inteiro com `python3 cenas.py tudo`. Ensine esse pedido ao usuário quando ele quiser rapidez: *"Short 9:16 com esse áudio [anexo], estilo fofo, elenco: [código do editor], pode seguir direto"*.

Pergunte o **formato** se o usuário não disser: 16:9 (YouTube), 9:16 (Shorts, Reels, TikTok), 1:1 ou 4:5 (feed). O **visual dos personagens** sai do editor de personagens ou da folha de estilos (passo 6). A **trilha** sai do tema do roteiro, a não ser que o usuário peça outra.

## Regras firmes

- **O elenco do editor é obrigatório.** Quando o usuário colar o código do editor, grave `"estilo"` e `"elenco"` no roteiro.json e desenhe todo personagem com `EL['nome']`, sem recriar à mão, sem trocar cor, cabelo ou roupa e sem passar `hat=True` nas cenas: o personagem tem que sair igual ao que ele montou. Se os nomes do editor forem genéricos (`protagonista`, `mulher`…), associe cada um a um papel do roteiro pelo tipo e pela ordem, renomeando a chave no `"elenco"` do roteiro.json, e diga ao usuário quem ficou com qual papel. Extras que não estão no elenco levam `figurante=True`. **Antes de escrever as cenas, veja o elenco:** `python3 ~/vid/lib/kit.py elenco roteiro.json folha_elenco.png` desenha todos os personagens com o nome; abra a imagem. Se o código tiver mais personagens do que a história precisa (é comum vir com testes, como `mulher2`…`mulher9`), use os que o usuário descreveu ("a mulher de black power" → procure na folha) ou pergunte mostrando a folha, e deixe no `"elenco"` do roteiro.json só os escolhidos, já com os nomes dos papéis. Envie a folha final do elenco junto com o storyboard. `python3 cenas.py elenco` confere tudo, e o `tudo` se recusa a renderizar se algum personagem não vier do elenco.
- **Só entra em cena quem a história pede.** Nunca acrescente um personagem (principalmente animal) só porque ele está no elenco colado: se o roteiro não fala de gato, não há gato. A mensagem "(info) do elenco, não entraram em cena" é normal e não pede correção. Na dúvida, mostre a folha do elenco e pergunte quem é quem.
- **O cenário segue o tema.** Escolha os fundos com `cenarios_do_tema(tema)` (veja "Cenários prontos") e varie entre as tomadas. Não reaproveite a rua do exemplo em todo vídeo: ela é só um modelo de código.
- **Personagens sempre originais.** Copie o *estilo*, nunca personagens, logos, capas ou quadros de um canal específico. Pessoas reais viram bonecos genéricos com etiqueta de nome, sem imitar o rosto.
- Nunca desenhe mascotes de marcas nem personagens com direitos autorais. Dinheiro em cena é genérico (`cash()`), sem cédulas reais.
- **Fatos:** pesquise ou marque. Diga ao usuário quais fatos não foram checados. Isso vale também para roteiros importados.
- **Roteiro:** português falado e natural, sem títulos dentro da narração. Não encurte sem necessidade. Roteiro importado não é reescrito sem pedido.
- **Duração e qualidade:** medido em 2 CPUs (Short de 23 s, 9:16), o render completo leva cerca de 2,6 min por minuto de vídeo no modo rápido (720p, o padrão) e 5,8 min por minuto em alta (1080p). Use `"qualidade": "alta"` só quando o usuário pedir 1080p ou for um vídeo 16:9 para o YouTube; em Shorts, Reels e TikTok, 720p fica igual na tela do celular. Até 5 min de vídeo, faça direto. Entre 5 e 10 min, avise antes quanto tempo vai levar e faça por partes. Acima de 10 min, proponha dividir em episódios. Um segundo formato do mesmo vídeo custa outro render inteiro.
- Gere as imagens de teste antes de qualquer render completo. A meta é um render completo por pedido.
- **Economia:** cada mensagem e cada leitura de log gasta o limite do usuário. Não narre cada passo, junte comandos numa chamada só e, durante o render, acompanhe no máximo a cada 3 a 5 minutos.
- **Claude não ouve áudio:** confira cada fala e a mixagem final transcrevendo com `verificar.py`. Peça ao usuário para assistir uma vez e checar o tempo das falas.

## Instalação (uma vez por conversa; vários vídeos na mesma conversa reaproveitam tudo)

Instale só o que o pedido usa. Rode tudo numa chamada só, em segundo plano, enquanto lê o material do usuário:

```bash
# sempre: programas, transcrição (Parakeet, ~640 MB: corta a narração e confere o resultado) e fontes
pip install --break-system-packages -q skia-python sherpa-onnx soundfile scipy numpy pillow num2words python-docx
mkdir -p ~/models ~/vid/fonts ~/vid/lib && cd ~/models
R=https://github.com/k2-fsa/sherpa-onnx/releases/download
[ -d sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8 ] || (curl -sSL -O $R/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2 && tar xjf sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2 && rm sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2)
cd ~/vid/fonts; G=https://raw.githubusercontent.com/google/fonts/main
for f in ofl/caveatbrush/CaveatBrush-Regular.ttf ofl/kalam/Kalam-Bold.ttf apache/permanentmarker/PermanentMarker-Regular.ttf; do [ -f $(basename $f) ] || curl -sSL -O $G/$f; done
```

```bash
# só se alguma voz for gerada aqui (sem áudio externo para todas as falas)
pip install --break-system-packages -q piper-tts espeakng-loader phonemizer-fork; cd ~/models; R=https://github.com/k2-fsa/sherpa-onnx/releases/download
# Piper: só as vozes usadas (~67 MB cada): faber-medium cadu-medium jeff-medium miro-high edresson-low dii-high
for v in faber-medium; do [ -d vits-piper-pt_BR-$v ] || (curl -sSL -O $R/tts-models/vits-piper-pt_BR-$v.tar.bz2 && tar xjf vits-piper-pt_BR-$v.tar.bz2 && rm vits-piper-pt_BR-$v.tar.bz2); done
# Kokoro (~330 MB): só se alguma voz pm_/pf_/em_/im_/ff_/bm_ for usada
[ -d kokoro-multi-lang-v1_0 ] || (curl -sSL -O $R/tts-models/kokoro-multi-lang-v1_0.tar.bz2 && tar xjf kokoro-multi-lang-v1_0.tar.bz2 && rm kokoro-multi-lang-v1_0.tar.bz2)
```

- Com narração externa para todas as falas (o caso mais comum), o segundo bloco não é necessário.
- As três fontes têm todos os acentos do português.
- Serviços de voz online (ElevenLabs, Microsoft, Google) costumam ser bloqueados na sessão. Para usá-los, o usuário gera o áudio por conta própria e envia o arquivo.
- Se um download falhar, diga qual foi e peça o arquivo ao usuário. Não tente outro site.

**Arquivos da skill:** os nove arquivos de `~/vid/lib` (oito .py e o `editor_personagens.html`) estão no fim deste documento, cada um depois de um título `### arquivo: NOME`. Extraia todos de uma vez:

```bash
python3 - <<'EOF'
import re, os, glob
c = [p for p in glob.glob('/mnt/**/SKILL.md', recursive=True) + glob.glob(os.path.expanduser('~/.claude/**/SKILL.md'), recursive=True)
     if re.search(r'name:\s*"?animacao-2d-longa', open(p, encoding='utf8').read(1000))]
if not c: raise SystemExit('SKILL.md não achado: crie os arquivos com Write copiando os blocos do fim da skill')
s = open(c[0], encoding='utf8').read()
for nome, code in re.findall(r"### arquivo: (\S+)\n+```\w*\n(.*?)\n```", s, re.S):
    open(os.path.expanduser(f'~/vid/lib/{nome}'), 'w', encoding='utf8').write(code + '\n'); print('ok', nome)
EOF
```

Se o SKILL.md não estiver em disco, crie cada arquivo com Write copiando o bloco exatamente. O exemplo (`cenas.py` + `roteiro.json`) não vai para `~/vid/lib`: use-o como modelo para o projeto.

## Fluxo de trabalho

Cada vídeo fica numa pasta própria: `~/vid/NOME/`, com `roteiro.json`, `cenas.py`, `audio/`, `tomadas_16x9/` (uma pasta por formato), `stills/`, `mix.wav` e `final_16x9.mp4` (o nome muda com o formato).

1. **Roteiro** (pule se for importado). São cerca de 155 palavras por minuto: 2 min dão uns 310 palavras e 5 min uns 775. Use frases curtas, de cerca de 7 palavras em média. Estrutura: abra no meio da ação; depois vem "e aqui está a parte estranha", o que está em jogo e uma promessa; em seguida os capítulos ("A Ideia", "O Golpe", "A Virada"…), com mini diálogos de dois personagens a cada ~30 s **só se o usuário escolheu história com personagens** (no padrão "só narrador", nada de diálogo: o narrador conta tudo e o boneco ilustra); feche com um final que retoma o começo e uma frase de gancho. Todo número grande ganha uma comparação do dia a dia. No 9:16, prefira 45 a 90 s, com o gancho já na primeira frase. Mostre o roteiro antes de gerar as vozes, a não ser que o usuário tenha pedido para seguir direto. Ao mostrar o roteiro, ofereça numa linha a **narração expressiva para ElevenLabs ou MiniMax Audio** (seção "Narração expressiva" abaixo), para quem vai gravar a voz fora. Ao mostrar o roteiro, ofereça numa linha a **narração expressiva para ElevenLabs ou MiniMax Audio** (seção "Narração expressiva" abaixo), para quem vai gravar a voz fora.
2. **roteiro.json** (formato abaixo). Números podem ficar em algarismos: o `vozes.py` escreve por extenso ("1925", "7.000", "R$ 50", "30%").
3. **Vozes:** `python3 ~/vid/lib/vozes.py ~/vid/NOME`. Com áudio externo, use `importar_audio.py` (abaixo) e pule a conferência por fala: ele já avisa as falas que não batem. Com vozes geradas, rode `python3 ~/vid/lib/verificar.py ~/vid/NOME --falas`. Toda fala marcada "VER" deve ser corrigida: acrescente a palavra em `pronuncias` e regere só ela (`vozes.py ~/vid/NOME n7`). Falas importadas nunca são regeradas.
4. **Lista de tomadas** no `cenas.py`: uma imagem por frase. Tipos: cena aberta com bonecos pequenos de corpo inteiro; close (cabeça grande sobre cenário desfocado); mesa vista de cima, com mãos e mangas; mapa com rota pontilhada; monumento visto de baixo com carimbo; cartão preto de capítulo (use os `capitulos` e as `notas` do roteiro importado); caminhada na rua; final congelado em polaroid.
5. **Linha do tempo:** `python3 cenas.py info`. Ela é automática: a tomada começa, 0,3 s depois entra a fala, há 0,26 s entre falas, e um cartão sem fala dura 1,5 s. Com narração externa, as pausas são as do próprio áudio; só os cartões sem fala acrescentam silêncio.
6. **Personagens, estilo e storyboard (antes de qualquer render):**
   - **Editor de personagens "Animações Ideias Artificiais"** (quando o usuário quiser montar ou personalizar os bonecos): mande o link https://claude.ai/artifact/9bghMt5vGkmHK6mt5NrfqK (versão mais nova, com a identidade do canal, funciona no celular e no computador). Só se o link não abrir, publique `~/vid/lib/editor_personagens.html` como página (cópia idêntica, que funciona offline) ou envie o arquivo. No editor, ele monta cada personagem em 5 passos (Corpo, Cabeça, Roupa, Detalhes, Finalizar), a partir de 10 modelos (homem, mulher, menino, menina, avô, avó, gato, cachorro, coelho, urso), com 23 penteados modernos (13 masculinos e 12 femininos; a lista muda conforme o personagem é homem ou mulher), 10 roupas, cores e 11 acessórios. O ✓ verde em cada personagem diz quem vai para o vídeo, e o botão "Copiar para o vídeo" mostra quem vai e copia só esses. O × em cada foto (ou "Remover" no palco) tira o personagem da tela, e "Limpar" na faixa tira de uma vez todos os que estão sem ✓. Em Finalizar ele dá o nome na história, escolhe o estilo e pode editar todos do vídeo ao mesmo tempo. Quando ele colar o código, grave `"estilo"` e `"elenco"` no roteiro.json. No `cenas.py`, use os nomes do elenco: `EL = carregar_elenco(PROJ, {'rafa': dict(MODELOS['homem'])}); RAFA = EL['rafa']` (veja o exemplo no fim). O segundo argumento é o visual padrão, usado só quando o roteiro.json não tem elenco; se tiver, ele vale inteiro, e um nome que não existe nele dá erro na hora, com a lista dos nomes certos. O storyboard já mostra a checagem do elenco.
   - **Folha de estilos:** `python3 cenas.py estilos` gera `estilos.png`, o mesmo quadro nos 7 estilos, numerados (`estilos 3:0.5` escolhe o quadro). Envie, pergunte o número e grave `"estilo"`.
   - **Storyboard:** `python3 cenas.py storyboard` gera `storyboard.png`, uma miniatura por tomada com número, tempo e fala. Envie para aprovação e ajuste o que ele pedir.
   - **Detalhes:** `stills 0:0.5 3:0.8 …` (tomada:fração) gera `stills/folha.png`. Em formato estreito, confira todas as tomadas com personagem ou letreiro.
   - Se o usuário pediu para seguir direto, escolha estilo e elenco você mesmo e só mostre o storyboard.
   - Imagens de teste e storyboard já saem na qualidade escolhida; no modo rápido elas também ficam prontas mais depressa.
7. **Vídeo completo, num comando só:** `cd ~/vid/NOME && python3 cenas.py tudo > tudo.log 2>&1` (em segundo plano se passar de ~8 min; acompanhe com `tail -3 tudo.log` a cada 3 a 5 min). Ele renderiza as tomadas com todos os processadores, faz a mixagem, junta e gera o `final_9x16.mp4` (o nome muda com o formato). O render **retoma sozinho**: tomadas prontas são puladas, e só é refeita a tomada cujo tempo, desenho, formato, qualidade ou `kit.py` mudou. Se cair, rode de novo. Os comandos separados continuam existindo (`render IDX N`, `audio`, `juntar`, `final`).
8. **Repasse ao usuário** o que o `audio` informou no log: tema detectado, trilha escolhida e efeitos automáticos colocados.
9. **Verificação:** `python3 ~/vid/lib/verificar.py ~/vid/NOME final_16x9.mp4` (ou o arquivo do formato usado). Até ~10% de diferença é normal por causa de nomes próprios. Extraia também um quadro de cada tomada numa folha (`ffmpeg -i final_16x9.mp4 -vf fps=1/4,scale=384:-2,tile=5x4 -frames:v 1 folha_final.png`) e procure letreiros cortados, bonecos baixos demais nos closes e textos sobrepostos.

**Outro formato do mesmo vídeo:** `FORMATO=9:16 python3 cenas.py stills …` e depois `FORMATO=9:16 python3 cenas.py tudo`. O áudio é o mesmo. Antes, acrescente `focus_v` às tomadas (ver "Formatos").

## Estilos, editor de personagens, trilha e efeitos por tema

**Estilos** (`"estilo"` no roteiro.json, ou `ESTILO=gibi python3 cenas.py …` para testar):

1. `noturno`: o padrão, com luz de noite e sombras.
2. `dia`: colorido, céu claro e sol.
3. `fofo`: cabeção e olhos grandes e brilhantes.
4. `caderno`: traço fino, papel e quase sem cor.
5. `gibi`: contorno grosso, cores fortes e retícula.
6. `minimal`: pastel e sem sombras.
7. `palito`: boneco palito sobre papel.

O estilo muda o traço, o tamanho da cabeça, os olhos, as sombras, a luz e o acabamento do vídeo inteiro, sem mexer no `cenas.py`. Os cenários continuam os mesmos, então nos estilos de dia evite paredes muito escuras.

**Editor de personagens:** uma página que funciona no navegador, sem instalar nada. Tem modelos prontos, edição de vários personagens ao mesmo tempo e uma vista do elenco junto. Ela desenha o boneco com a mesma geometria do `kit.py`, então a prévia fica bem próxima do vídeo. Guarda o elenco no navegador de quem usa e exporta um código assim:

```json
{"estilo": "fofo", "elenco": {"rafa": {"skin": "#8A5A3B", "suit": "#B23A48", "top": "tee", "print": "#F4EFE2", "hair": "curly", "hair_col": "#1C1B22", "glasses": true}}}
```

- As cores de sombra (`skin_d`, `suit_d`) são calculadas sozinhas, e `"hat": true` já põe o chapéu.
- O usuário pode compartilhar o link da página para outras pessoas montarem personagens.
- Para continuar um elenco salvo, ele cola o código em Finalizar → "Já tem um código? Carregue o elenco".

**Trilha automática:** com `"musica": "auto"` e `"tema": "auto"` (o padrão), o `audio.py` lê o roteiro, detecta o tema e escolhe o clima:

| tema | trilha |
|---|---|
| golpe/crime | tenso |
| finanças | mistério |
| tecnologia | tecnologia, com transições em glitch |
| história, motivação | épico |
| perdas | triste |
| humor | divertido |
| saúde, ciência | leve |

Todas as trilhas são originais e sintetizadas. Para forçar um clima, use `"musica": "tenso"` (e assim por diante); para forçar um tema, use `"tema": "historia"`. Antes de escolher, `python3 ~/vid/lib/audio.py amostras amostras_trilhas.mp3` gera ~8 s de cada clima, na ordem: mistério, leve, tenso, épico, triste, divertido, tecnologia. Envie ao usuário para ele ouvir.

**Efeitos por palavra-chave:** com `"efeitos_auto": true` (o padrão), cada fala ganha no máximo um efeito, no momento da palavra:
- dinheiro, salário → caixa registradora;
- celular, app, assinatura → notificação;
- erro, golpe → alarme;
- tempo, dias, mês → relógio;
- caiu, some → queda;
- cresceu, subiu → subida;
- ideia, segredo, hoje → brilho.

Os efeitos automáticos nunca ficam a menos de 0,45 s de um efeito manual (`sfx`) ou de uma tremida.

## Formatos

Defina em `roteiro.json` → `"formato": "16:9" | "9:16" | "1:1" | "4:5"` (saída 1920x1080, 1080x1920, 1080x1080 ou 1080x1350).

- **Os cenários são sempre desenhados num mundo de 1920x1080** (`W`, `H`). A câmera ajusta esse mundo à tela: no 9:16, a parte visível do mundo é uma coluna de ~600 px de largura em volta do `focus`; no 1:1, ~1000 px. Como tudo é vetor, não há perda de qualidade.
- Em formatos estreitos (9:16, 1:1, 4:5), cada tomada usa `focus_v` e `zoom_v` no lugar de `focus` e `zoom`. Aponte para o personagem ou objeto principal, e faça uma panorâmica (`focus_v=((x0,y0),(x1,y1))`) quando houver duas coisas para mostrar.
- Dentro do desenho, `S.vertical` (verdadeiro nos formatos estreitos) e `S.view` = `(x0, y0, x1, y1)` (a área visível do mundo naquele quadro) servem para posicionar e dimensionar letreiros. Use `fit(texto, tamanho, largura_max, fonte)` para caber, como no `s_final` do exemplo.
- Textos de tela se adaptam sozinhos: cartões quebram em linhas, a polaroid fica em pé, e etiqueta e nome sobem no vertical. No 9:16, deixe livres os ~15% de baixo e de cima, onde ficam os botões do app.
- **Legendas** grandes estilo Shorts (3 palavras por vez, a palavra falada em amarelo) já vêm ligadas fora do 16:9. Para controlar, use `"legendas": true/false` no roteiro.json.

## Narração expressiva (ElevenLabs, MiniMax Audio)

Opção do roteiro. Use quando o usuário pedir para "melhorar a narração", "preparar para o ElevenLabs/MiniMax", ou aceitar a oferta feita ao mostrar o roteiro. Siga este pedido, que é dele:

> Prepare a narração acima para convertê-la em uma narração expressiva no ElevenLabs, MiniMax Audio. Pegue o roteiro exato e adicione somente indicações curtas entre colchetes quando ajudarem na interpretação da voz.
>
> Exemplos válidos:
> Cena: Estúdio de gravação de áudio de alto padrão produzindo um documentário histórico para a televisão.
> Contexto da amostra: voz grave, ressonante e autoritária. O tom é dramático e histórico, com ritmo deliberado para criar intriga e despertar a curiosidade.
> [reflexivo] [respira fundo] [pausa curta] [animado] [suavemente] [dá uma risadinha]
>
> Regras:
> - Não altere o conteúdo do roteiro.
> - Não reescreva as frases.
> - Apenas adicione colchetes quando realmente ajudarem na emoção, ritmo ou pausa.
> - Não sobrecarregue o texto com indicações demais.
> - Retorne o roteiro completo, pronto para colar em um gerador de voz.

Como entregar:
- No topo, as duas linhas de direção: **Cena:** (onde e para que a voz é gravada, adaptada ao tema do vídeo) e **Contexto da amostra:** (timbre, tom e ritmo que combinam com o tema e o estilo). Depois, o roteiro inteiro, palavra por palavra, só com as marcações em colchetes.
- Conte as marcações: em média uma a cada 2 ou 3 frases, nunca mais de uma por frase. Prefira pausas e respirações antes de revelações e números grandes, e emoção nas viradas e no final.
- Confira que, tirando os colchetes e as duas linhas de direção, o texto ficou idêntico ao roteiro.
- Em história com vários personagens, comece cada fala com o nome (`ANA:`) para o usuário saber qual voz usar em cada trecho, e sugira uma voz diferente por personagem.
- Mande tudo num bloco de código, fácil de copiar, e também como arquivo `narracao_expressiva.txt`.
- O `roteiro.json`, as legendas e os cartões continuam com o texto limpo, sem colchetes. Quando o usuário voltar com o áudio gravado, use `importar_audio.py` normalmente. Se ele colar a versão marcada como roteiro, apague os colchetes e as linhas "Cena:" e "Contexto da amostra:" antes de importar.

## Narração expressiva (ElevenLabs, MiniMax Audio)

Opção do roteiro. Use quando o usuário pedir para "melhorar a narração", "preparar para o ElevenLabs/MiniMax", ou aceitar a oferta feita ao mostrar o roteiro. Siga este pedido, que é dele:

> Prepare a narração acima para convertê-la em uma narração expressiva no ElevenLabs, MiniMax Audio. Pegue o roteiro exato e adicione somente indicações curtas entre colchetes quando ajudarem na interpretação da voz.
>
> Exemplos válidos:
> Cena: Estúdio de gravação de áudio de alto padrão produzindo um documentário histórico para a televisão.
> Contexto da amostra: voz grave, ressonante e autoritária. O tom é dramático e histórico, com ritmo deliberado para criar intriga e despertar a curiosidade.
> [reflexivo] [respira fundo] [pausa curta] [animado] [suavemente] [dá uma risadinha]
>
> Regras:
> - Não altere o conteúdo do roteiro.
> - Não reescreva as frases.
> - Apenas adicione colchetes quando realmente ajudarem na emoção, ritmo ou pausa.
> - Não sobrecarregue o texto com indicações demais.
> - Retorne o roteiro completo, pronto para colar em um gerador de voz.

Como entregar:
- No topo, as duas linhas de direção: **Cena:** (onde e para que a voz é gravada, adaptada ao tema do vídeo) e **Contexto da amostra:** (timbre, tom e ritmo que combinam com o tema e o estilo). Depois, o roteiro inteiro, palavra por palavra, só com as marcações em colchetes.
- Conte as marcações: em média uma a cada 2 ou 3 frases, nunca mais de uma por frase. Prefira pausas e respirações antes de revelações e números grandes, e emoção nas viradas e no final.
- Confira que, tirando os colchetes e as duas linhas de direção, o texto ficou idêntico ao roteiro.
- Em história com vários personagens, comece cada fala com o nome (`ANA:`) para o usuário saber qual voz usar em cada trecho, e sugira uma voz diferente por personagem.
- Mande tudo num bloco de código, fácil de copiar, e também como arquivo `narracao_expressiva.txt`.
- O `roteiro.json`, as legendas e os cartões continuam com o texto limpo, sem colchetes. Quando o usuário voltar com o áudio gravado, use `importar_audio.py` normalmente. Se ele colar a versão marcada como roteiro, apague os colchetes e as linhas "Cena:" e "Contexto da amostra:" antes de importar.

## Áudio externo

- **Narração inteira num arquivo** (o caso mais comum: ElevenLabs, a própria voz):
  `python3 ~/vid/lib/importar_audio.py ~/vid/NOME narracao.mp3`
  - Se já houver `roteiro.json` (escrito ou importado), cada fala é localizada no áudio pela transcrição e cortada ali, mantendo as pausas naturais. Falas que quase não aparecem no áudio são listadas como "ATENÇÃO": avise o usuário, porque roteiro e áudio estão diferentes.
  - Sem `roteiro.json`, ele é criado a partir da própria transcrição: uma fala por frase, tudo com a voz `narrador`. Revise o texto, que vai para cartões e legendas, e troque `voz` das falas que forem de personagens.
- **Uma gravação por fala:** arquivos com o nome do id (`n1.mp3`, `c2.wav`…) numa pasta → `importar_audio.py ~/vid/NOME pasta/`. Falas sem arquivo ficam com a voz sintética.
- O áudio externo entra quase sem tratamento (só um filtro de graves), e a mixagem final normaliza para -14 LUFS. Num áudio externo, a boca dos personagens anima pelo volume, igual às vozes geradas.
- Peça o arquivo pela conversa. Formatos aceitos: mp3, wav, m4a, ogg, mp4 (o vídeo é ignorado).

## roteiro.json

Exemplo completo e testado (é o roteiro do `cenas.py` de exemplo, no fim do documento):

```json
{
 "titulo": "O homem que vendeu a Torre Eiffel",
 "formato": "16:9",
 "qualidade": "rapida",
 "narrador": "narrador",
 "musica": "misterio",
 "vozes": {"narrador": "piper:faber-medium", "golpista": "em_alex", "compradora": "pf_dora"},
 "pronuncias": {"eiffel": "ˈɛjfɛw", "lustig": "lˈustʃig"},
 "falas": [
  {"id": "n1", "voz": "narrador", "texto": "Paris, 1925. Um homem de terno elegante está vendendo a Torre Eiffel."},
  {"id": "n2", "voz": "narrador", "texto": "São 7.000 toneladas de ferro. E o preço é ótimo."},
  {"id": "b1", "voz": "compradora", "texto": "Quanto custa?"},
  {"id": "c1", "voz": "golpista", "texto": "Pra você, madame? Uma pechincha.", "vel": 0.97},
  {"id": "n3", "voz": "narrador", "texto": "Só tem um problema."},
  {"id": "n4", "voz": "narrador", "texto": "A torre não é dele. O nome dele é Victor Lustig, e ele vai vendê-la duas vezes."}
 ]
}
```

- **Vozes** (todas passaram na transcrição; o nome é convertido para o id certo, nunca use números de memória):
  - **Piper**, vozes brasileiras, mais naturais. Escreva `"piper:NOME"`.
    - Masculinas: `faber-medium`, `cadu-medium`, `jeff-medium`, `miro-high` (grave) e `edresson-low`.
    - Feminina: `dii-high`.
    - São mais rápidas (~190 palavras/min): use `"vel": 0.9`.
  - **Kokoro**:
    - Nativas: `pm_alex`, `pm_santa` (masculinas) e `pf_dora` (feminina).
    - Com sotaque estrangeiro, boas para personagens gringos: `em_alex` (espanhol), `im_nicola` (italiano), `ff_siwis` (francesa) e `bm_george` (inglês).
  - Se o usuário não gostar de nenhuma, ofereça o caminho do áudio externo. Uma amostra de cada voz ajuda a escolher: gere a mesma frase com todas e envie num arquivo só, numerado.
  - **Confira o gênero das vozes que o `importar_roteiro.py` atribuiu aos personagens**: ele distribui por ordem, sem saber quem é homem ou mulher.
- **Pronúncias** (IPA) valem para Kokoro e Piper. Nomes estrangeiros quase sempre precisam delas.
- `vel`: 0,9 a 1,05.
- `musica`: `auto` (pelo tema), `nenhuma` (sem trilha), `misterio`, `leve`, `tenso`, `epico`, `triste`, `divertido` ou `tecnologia`.
- `tema`: `auto`, `golpe`, `financas`, `tecnologia`, `historia`, `motivacao`, `triste`, `humor` ou `saude`.
- `estilo`: `noturno`, `dia`, `fofo`, `caderno`, `gibi`, `minimal` ou `palito`.
- `elenco`: o que veio do editor.
- `efeitos_auto`: `true`/`false`.
- `qualidade`: `rapida` (720p, padrão recomendado) ou `alta` (1080p). Também dá para testar com `QUALIDADE=alta python3 cenas.py …`.
- Roteiros importados trazem também `capitulos` (`[{"antes": "n7", "titulo": "A Virada"}]`) e `notas` (`{"c5": "close na compradora"}`). Use os dois para montar o `SEQ`.

## cenas.py: formato da sequência

Cada tomada é um `dict` na lista `SEQ`. Cada função de desenho recebe `(c, t, S)`: o canvas, o tempo global em segundos e a tomada.

| chave | o que faz |
|---|---|
| `draw=fn` ou `card="texto"` | desenho da tomada, ou cartão preto. Com `card=None`, o texto é o da própria fala, escrito palavra por palavra |
| `falas=['n1','c2']` | falas desta tomada, em ordem |
| `zoom=(1.0,1.07)`, `focus=(960,540)` ou `((x0,y0),(x1,y1))`, `rot=2` | aproximação contínua, ponto de foco e leve giro (mesas) |
| `zoom_v`, `focus_v` | o mesmo, para 9:16, 1:1 e 4:5 |
| `whip=True` | transição em chicote para a próxima tomada (com whoosh automático) |
| `vig=.64`, `bloom=.4` | vinheta e brilho |
| `hold=1.4`, `min=3`, `dur=1.5` | segundos extras no fim, duração mínima, duração sem fala |
| `tag="SÃO PAULO · 1994"` | etiqueta de local (com pop) |
| `lower=[("NOME\|SUBTÍTULO", 'n6+0.5', 1090, 930)]` | nome na parte de baixo; x,y só valem no 16:9 (nos outros formatos a posição é automática) |
| `shake=['n5+0.42']` | tremida da câmera com baque (use junto com `stamp`) |
| `sfx=[('pop','n3+0.15',.7,.3)]` | efeitos: nome, quando, volume, pan. Nomes: whoosh, pop, thud, tick, ticks, step, steps, shutter, scribble, boom, ding, paper, coins, kaching, notif, buzzer, relogio, queda, subida, brilho, glitch |
| `polaroid=dict(at='n9:fim+0.1', text="…", ring=(x,y))` | final: flash, polaroid inclinada, círculo vermelho em volta de (x,y) no cenário e frase escrita à mão |

**Tempo** (`S.at`): um número conta os segundos desde o início da tomada; `'n3'` é o início da fala; `'n3+0.2'` vem 0,2 s depois; `'n3:fim-0.1'` é o fim da fala. Dentro do desenho, use `K(t, S.at('n3'), .3)` para animar de 0 a 1.
**Boca:** `S.boca('c1', t, 'smirk')` dá a boca pelo volume do áudio. Os cartões cortam a música e tocam um boom grave; o polaroid toca o obturador e o acorde final. Tudo isso é automático.

## Guia de estilo (siga tudo)

- **Contorno:** um traço quase preto e uniforme (#18161B), de cerca de 6 px em 1080p, em tudo: personagens, móveis, prédios, objetos.
- **Personagens** (`draw_char`): cabeça redonda grande sem pescoço; corpo em pílula; pernas de traço sem pés; braços de traço com mãos redondas. Sombra dura em meia-lua na base da cabeça; olhos de ponto com brilho; giro de 3/4 com `face`; luz de recorte opcional (`rim`).
  - Tipo: `corpo` = `homem` (padrão), `mulher` (cintura e quadril), `menino`/`menina` (menores, cabeça maior, olhos grandes), `idoso`/`idosa` (costas curvadas, rugas); `especie` = `humano` (padrão), `gato`, `cachorro`, `coelho` ou `urso` (orelhas, focinho, rabo; `skin` vira a cor do pelo).
  - Roupas (`top`): `suit` (terno, com `tie`, `bowtie`, `hanky`), `tee` (camiseta, `print`), `blouse`, `dress` (vestido, cinto em `print`), `hoodie` (moletom), `jaleco` (use `suit='#F4F4F0'`), `jardineira` (`shirt` por baixo), `sueter` (listras em `print`), `colete` (`shirt` por baixo) e `pelo` (animal sem roupa).
  - Cabelos (`hair`, cor em `hair_col`), desenhados em camadas pelo `cabelos.json` (o `kit.py` o cria sozinho com o `cabelos_gen.py`; o editor usa os mesmos dados, por isso saem iguais): volume, mechas num tom vizinho e brilho, sem contorno por dentro; a franja e a risca acompanham o giro do rosto. Masculinos (`kit.CABELOS_M`): `short` (texturizado), `degrade`, `slick` (risca lateral), `topete`, `espetado` (arrepiado), `moicano`, `curly` (cacheado curto), `twists`, `afro`, `medio` (repartido no meio), `raspado`, `bald` (careca), `none`. Femininos (`kit.CABELOS_F`): `long` (liso), `ondulado`, `franja` (cortina), `bob` (chanel), `pixie`, `rabo` (rabo alto), `bun` (coque alto), `trancas` (box braids), `maria` (dois coques), `cachos` (cacheado volumoso), `afro`, `none`. Qualquer cabelo funciona em qualquer corpo. Elásticos e laço usam `hat_band`. Com `hat` ou `bone`, o volume de cima some sob o chapéu.
  - Acessórios (`True`): `glasses`, `moustache`, `barba`, `lashes`, `sardas`, `brincos`, `laco`, `bone`, `hat`, `bengala`.
  - **Modelos prontos** em `kit.MODELOS`: `homem`, `mulher`, `menino`, `menina`, `avo_m`, `avo_f`, `gato`, `cachorro`, `coelho`, `urso`. Varie: `dict(MODELOS['menina'], skin='#E6BE8E', hair='rabo')`.
  - **Invente um elenco novo por vídeo**, variando tom de pele, cabelo e cores.
- **Expressões:** olhos `dot`, `half` (malandro), `wide` (choque) e `closed`; bocas `smile`, `smirk`, `flat`, `o`, `mid` e `open`; gota de suor (`sweat`), brilho no sorriso (`sparkle`).
- **Movimento:** poses encaixam com exagero (`back()`); achatamento (`squash`) em cada pose nova e no início de cada tomada; balanço parado (`bob`); piscada a cada ~2,3 s; boca pelo áudio; caminhada com `walk_legs`.
- **Câmera:** toda tomada aproxima de 5 a 10%; giro leve em tomadas de mesa; chicote nas transições; tremida nos carimbos.
- **Luz:** desenhe o cenário chapado e depois aplique `night()` (escurece com azul-marinho e abre buracos de luz para luminárias, janelas e reflexos no chão). Complete com `add_light` nas lâmpadas, cones de luz, sombra no chão sob os personagens, bloom e vinheta.
- **Cenários densos:** janela com cidade noturna e reflexos, cortinas, relógio, calendário, quadro, luminária com raios, telefone, tapete, mesa com gavetas. Paleta noturna: céu azul-marinho, janelas quentes e luminária dourada.
- **Gráficos dentro do mundo:** jornal com círculo vermelho de marcador (`newspaper`), documentos, notas (`cash`), etiquetas de preço, carimbos (`stamp`), contadores subindo (`counter`, que formata com ponto: 7.000) e mapas com rota pontilhada.
- **Textos:** rótulos em verde-limão ou creme com contorno grosso que saltam (`poplabel`); cartões de capítulo e de frase de efeito em letra branca escrita palavra por palavra sobre preto puro; nomes com caixa escura e barra dourada; local no canto inferior esquerdo. **Escreva sempre com acentos:** as fontes suportam.
- **Área segura no 16:9:** a câmera aproxima até 10%. Mantenha letreiros e carimbos entre x 160 e 1760 e entre y 90 e 990. Nos outros formatos, use `S.view`.
- **Final:** o flash congela numa polaroid inclinada, um círculo vermelho é desenhado em volta do protagonista e aparece a frase de fechamento escrita à mão.
- **Som** (automático no `audio.py`): voz comprimida e um pouco à frente; música abaixa sob a fala e corta com um boom grave nos cartões; pop nos rótulos; whoosh nos chicotes; papel nos documentos; passos nas caminhadas; obturador na polaroid.

## Peças prontas no kit.py

`sky`, `stars`, `moon`, `cloud`, `far_city` (use dentro de `blur_begin`), `building`, `street_lamp`, `banker_lamp`, `table_top`, `sleeve`, `cash`, `newspaper`, `tag`, `lower_third`, `stamp`, `poplabel`, `counter`, `card_text`, `legenda`, `fit`, `carregar_elenco`, `MODELOS`, `escurecer`, `clarear`, `night`, `add_light`, `cone_path`, `blur_begin`, `draw_char` e `walk_legs`.

### Cenários prontos (escolha pelo tema)

`cenario(c, nome, t)` desenha o fundo inteiro já com a luz do estilo (noite com poças de luz; de dia, claro). Para iluminar o personagem junto, use `cenario(c, nome, t, luz=False)`, desenhe os personagens e chame `cenario_luz(c, nome)`. Para closes: `cenario_fundo(c, nome, t, dx=-300)` (desfocado, 1,5x). Piso em y=800; personagens de corpo inteiro com pés em y≈1000 e s=1. Funcionam em todos os formatos.

- Nomes (`kit.CENARIOS`): `escritorio`, `sala`, `cozinha`, `quarto`, `sala_aula`, `consultorio`, `loja`, `banco`, `parque`, `praia`, `tech` (servidores e telão), `cidade` (rua).
- `cenarios_do_tema('finanças pessoais')` devolve os que combinam, o principal primeiro (`kit.TEMAS`): finanças → escritório, banco, loja, sala; golpe → cidade, escritório, banco; tecnologia/IA → tech, escritório; educação → sala de aula, quarto; saúde → consultório, cozinha, parque; alimentação → cozinha, loja; família/casa → sala, cozinha, quarto; motivação → parque, praia; humor → sala, cozinha, parque; triste → quarto, sala; história/mistério → cidade; viagem → praia, cidade; trabalho → escritório, tech, loja; compras → loja; relacionamento → sala, parque, praia; infantil → quarto, parque, sala de aula.
- Use 2 ou 3 cenários por vídeo, seguindo a história (onde cada cena acontece), e complete com objetos do assunto (`cash`, `newspaper`, `counter`, `stamp`).

Monte cenários que não estão na lista (mapa, monumento, mesa vista de cima) no `cenas.py` com `rect`, `circ`, `oval`, `poly` e `line`, seguindo o guia. Para closes: desenhe o cenário dentro de `blur_begin(c, 13)` com zoom de 1,5x e um `night()` escuro com uma poça central; o personagem fica em s=2.15, pés em y=1390, rosto girado ±0,72 na direção de quem ele ouve. Closes funcionam bem em todos os formatos. Em tomadas longas, guarde o fundo estático com `surface.makeImageSnapshot()` para economizar render.

## Problemas comuns

- **"OOV word skipped" no vozes.py:** a palavra ficou de fora do léxico (símbolo ou grafia estranha). Reescreva a palavra ou adicione-a em `pronuncias`.
- **Nome pronunciado errado:** adicione em `pronuncias` e regere só aquela fala.
- **"falta o modelo Piper":** baixe a voz pelo laço `for v in …` da instalação.
- **Fala importada cortada no lugar errado:** confira com `verificar.py --falas`. Quase sempre o texto do roteiro difere do que foi gravado: corrija o texto e rode `importar_audio.py` de novo.
- **Letreiro cortado em 9:16:** ajuste `focus_v` ou use `S.view` e `fit` para posicionar e dimensionar.
- **Render parou no meio (sessão reiniciou):** rode o mesmo comando `render`; ele continua de onde parou.
- **"falta a tomada N" no juntar:** a tomada falhou. Veja o log, rode `stills N:0.5` para achar o erro e depois `render` de novo.
- **"invalid literal for int() with base 16":** a cor foi escrita com 3 dígitos (`'#555'`). Use sempre 6 dígitos (`'#555555'`).
- **Download bloqueado:** diga qual arquivo falhou e peça ao usuário. Não tente espelhos nem outros sites.
- **Duração passou do combinado:** corte frases do roteiro, não a velocidade da fala (acima de 1,05 soa robótico).

## Entrega

Envie o MP4 com uma legenda de uma linha. Diga ao usuário a duração, o formato, o que tem no vídeo, quais fatos não foram checados, e peça para assistir uma vez conferindo o tempo das falas, porque Claude não ouve nem assiste o resultado.

---

## Arquivos da skill

### arquivo: kit.py

```python
import math, random, os
import numpy as np, skia, soundfile as sf

W, H, FPS = 1920, 1080, 30   # W, H = tamanho do MUNDO (cenários sempre desenhados em 1920x1080)
FORMATOS = {'16:9': (1920, 1080), '9:16': (1080, 1920), '1:1': (1080, 1080), '4:5': (1080, 1350)}
SW, SH = W, H                # tamanho da TELA de saída (muda com o formato)
ESCALA = 1.0                 # 1.0 = 1080p; 2/3 = modo rápido (720p). Tudo é desenhado em coordenadas de 1080p e reduzido.
def set_formato(f):
    global SW, SH
    SW, SH = FORMATOS[f]; return SW, SH
def vertical(): return SH > SW

# ---------------- estilos visuais (escolhidos pela folha de estilos; "estilo" no roteiro.json)
ESTILOS = {
    'noturno':  dict(nome='Noturno (padrão)', lw=1.0, ink='#18161B', cabeca=1.0, olhos='ponto', sombra=True, luz='noite', sat=0.94, contraste=0.97, lift=0.012, textura=None),
    'dia':      dict(nome='Dia colorido', lw=1.0, ink='#18161B', cabeca=1.0, olhos='ponto', sombra=True, luz='dia', sat=1.2, contraste=0.92, lift=0.10, textura=None),
    'fofo':     dict(nome='Fofo (cabeção)', lw=1.15, ink='#2A1E2E', cabeca=1.32, olhos='grande', sombra=True, luz='noite', sat=1.05, contraste=0.98, lift=0.02, textura=None),
    'caderno':  dict(nome='Caderno (rabisco)', lw=0.6, ink='#2B2B33', cabeca=1.0, olhos='ponto', sombra=False, luz='dia', sat=0.22, contraste=0.78, lift=0.24, textura='papel'),
    'gibi':     dict(nome='Gibi (retícula)', lw=1.6, ink='#101014', cabeca=1.08, olhos='ponto', sombra=True, luz='noite', sat=1.28, contraste=1.06, lift=0.0, textura='reticula'),
    'minimal':  dict(nome='Minimalista', lw=0.75, ink='#3A3A44', cabeca=1.0, olhos='ponto', sombra=False, luz='dia', sat=0.7, contraste=0.74, lift=0.22, textura=None),
    'palito':   dict(nome='Boneco palito', lw=1.0, ink='#1C1C22', cabeca=1.1, olhos='ponto', sombra=False, luz='dia', sat=0.9, contraste=0.8, lift=0.18, textura='papel', corpo='palito'),
}
ST = dict(ESTILOS['noturno'])
def set_estilo(nome):
    global GRADE_CF
    ST.clear(); ST.update(ESTILOS[nome]); GRADE_CF = skia.ColorFilters.Matrix(_sat(ST['sat'], ST['contraste'], ST['lift']))
FD = os.path.expanduser(os.environ.get("VID_FONTS", "~/vid/fonts/"))
FONT_HAND = skia.Typeface.MakeFromFile(FD + "CaveatBrush-Regular.ttf")
KALAM = skia.Typeface.MakeFromFile(FD + "Kalam-Bold.ttf")
MARKER = skia.Typeface.MakeFromFile(FD + "PermanentMarker-Regular.ttf")
INK = (24, 22, 27); LW = 6.0
GOLD = '#F2C14E'; RED = '#C8242C'; LIME = '#B8F04A'; CREAM = '#FFF6DC'

def C(rgb, a=255): return skia.Color(int(rgb[0]), int(rgb[1]), int(rgb[2]), int(a))
def hx(h, a=255):
    h = h.lstrip('#'); return C((int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)), a)
def col(v, a=255): return hx(v, a) if isinstance(v, str) else C(v, a)
def radial(cx, cy, r, colors, pos=None): return skia.GradientShader.MakeRadial(center=(cx, cy), radius=r, colors=colors, positions=pos)
def linear(x0, y0, x1, y1, colors, pos=None): return skia.GradientShader.MakeLinear(points=[(x0, y0), (x1, y1)], colors=colors, positions=pos)
def ease(u): u = min(max(u, 0), 1); return 0.5 - 0.5 * math.cos(math.pi * u)
def ease_out(u): u = min(max(u, 0), 1); return 1 - (1 - u) ** 3
def pop(u):  # 0 -> 1.15 -> 1
    if u <= 0: return 0.0
    if u >= 1: return 1.0
    return 1.15 * ease_out(u / 0.6) if u < 0.6 else 1.15 - 0.15 * ease((u - 0.6) / 0.4)
def back(u, k=1.9):  # snappy overshoot for pose changes
    u = min(max(u, 0.0), 1.0) - 1; return 1 + (k + 1) * u ** 3 + k * u ** 2
def lerp(a, b, k): return a + (b - a) * k
def K(t, t0, d): return min(max((t - t0) / d, 0.0), 1.0)
def blink(t, period=2.7, phase=0.0): return ((t + phase) % period) < 0.1

def mouth_track(wav, hold=3):  # per-frame 'open'/'mid'/'closed' from loudness, held 3 frames
    s, sr = sf.read(wav); s = s.mean(1) if s.ndim > 1 else s
    hop = sr // FPS; n = len(s) // hop + 1
    rms = np.array([np.sqrt(np.mean(s[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    m = rms.max(); out = []; cur = 'closed'; held = hold
    for v in rms:
        tgt = 'open' if v > .45 * m else 'mid' if v > .14 * m else 'closed'
        if tgt != cur and held >= hold: cur = tgt; held = 0
        held += 1; out.append(cur)
    out[-1] = 'closed'; return out

def fp(v, a=255, blur=0, blend=None):
    p = skia.Paint(AntiAlias=True, Color=col(v, a))
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if blend: p.setBlendMode(blend)
    return p
def sp(shader, blend=None, blur=0):
    p = skia.Paint(AntiAlias=True); p.setShader(shader)
    if blend: p.setBlendMode(blend)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    return p
def ink(w=LW, v=INK, a=255):  # traço: largura e cor do contorno seguem o estilo
    if v == INK: v = ST['ink']
    p = skia.Paint(AntiAlias=True, Color=col(v, a)); p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(w * ST['lw'])
    p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join); return p
def shape(c, path, fill, w=LW, v=INK):
    c.drawPath(path, fill if isinstance(fill, skia.Paint) else fp(fill))
    if w: c.drawPath(path, ink(w, v))
def rect(c, x0, y0, x1, y1, fill, w=LW, r=0, v=INK):
    p = skia.Path()
    if r: p.addRRect(skia.RRect.MakeRectXY(skia.Rect(x0, y0, x1, y1), r, r))
    else: p.addRect(skia.Rect(x0, y0, x1, y1))
    shape(c, p, fill, w, v); return p
def circ(c, x, y, r, fill, w=LW, v=INK): p = skia.Path(); p.addCircle(x, y, r); shape(c, p, fill, w, v); return p
def oval(c, x0, y0, x1, y1, fill, w=LW, v=INK): p = skia.Path(); p.addOval(skia.Rect(x0, y0, x1, y1)); shape(c, p, fill, w, v); return p
def line(c, x0, y0, x1, y1, w=LW, v=INK, a=255): c.drawLine(x0, y0, x1, y1, ink(w, v, a))
def poly(c, pts, fill, w=LW, v=INK):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    p.close(); shape(c, p, fill, w, v); return p
def text_w(s, size, font=None): return skia.Font(font or KALAM, size).measureText(s)
def fit(s, size, maxw, font=None):  # diminui o tamanho até o texto caber em maxw
    while size > 20 and text_w(s, size, font) > maxw: size *= .94
    return size
def label(c, s, x, y, size, color, font=None, align='left', stroke=0, stroke_col=INK, skew=-0.16, alpha=1.0, rot=0.0):
    f = skia.Font(font or KALAM, size); w = f.measureText(s)
    ox = -w / 2 if align == 'center' else -w if align == 'right' else 0
    c.save(); c.translate(x, y); c.rotate(rot); c.skew(skew, 0)
    if stroke: c.drawString(s, ox, 0, f, ink(stroke, stroke_col, 255 * alpha))
    c.drawString(s, ox, 0, f, fp(color, 255 * alpha)); c.restore(); return w

# ---------------- lighting
def night(c, lights, ambient='#4C5CA0'):
    """Multiply navy darkness over everything drawn so far, with soft holes for lights.
    lights: ('pool',x,y,r,a) | ('oval',x,y,rx,ry,a) | ('path',skia.Path,a,blur)"""
    if ST['luz'] == 'dia': return  # estilos diurnos: sem escurecer
    p = skia.Paint(); p.setBlendMode(skia.BlendMode.kMultiply); c.saveLayer(None, p); c.drawPaint(fp(ambient))
    for L in lights:
        if L[0] == 'pool':
            _, x, y, r, a = L
            c.drawCircle(x, y, r, sp(radial(x, y, r, [C((0,0,0), 255*a), C((0,0,0), 255*a*.75), C((0,0,0), 0)], [0, .5, 1]), blend=skia.BlendMode.kDstOut))
        elif L[0] == 'oval':
            _, x, y, rx, ry, a = L; c.save(); c.translate(x, y); c.scale(1, ry / rx)
            c.drawCircle(0, 0, rx, sp(radial(0, 0, rx, [C((0,0,0), 255*a), C((0,0,0), 255*a*.7), C((0,0,0), 0)], [0, .55, 1]), blend=skia.BlendMode.kDstOut)); c.restore()
        else:
            _, path, a, blur = L; c.drawPath(path, fp((0, 0, 0), 255 * a, blur=blur, blend=skia.BlendMode.kDstOut))
    c.restore()
def add_light(c, x, y, r, v, a):
    a = a * (.35 if ST['luz'] == 'dia' else 1)
    c.drawCircle(x, y, r, sp(radial(x, y, r, [col(v, a), col(v, a * .4), col(v, 0)], [0, .5, 1]), blend=skia.BlendMode.kPlus))
def cone_path(x, y, top_w, bot_w, length, lean=0):
    p = skia.Path(); p.moveTo(x - top_w/2, y); p.lineTo(x + top_w/2, y); p.lineTo(x + lean + bot_w/2, y + length); p.lineTo(x + lean - bot_w/2, y + length); p.close(); return p
def blur_begin(c, sigma):  # depth blur for everything until c.restore()
    p = skia.Paint(); p.setImageFilter(skia.ImageFilters.Blur(sigma, sigma)); c.saveLayer(None, p)
def vignette(c, strength=0.64, inner=.42):
    c.drawRect(skia.Rect(0, 0, SW, SH), sp(radial(SW/2, SH/2, max(SW, SH)*.74, [C((0,0,0), 0), C((0,0,0), 0), C((2,3,12), 255*strength)], [0, inner, 1])))
def _sat(s, contrast, lift):
    lr, lg, lb = 0.2126, 0.7152, 0.0722
    m = [lr*(1-s)+s, lg*(1-s), lb*(1-s), lr*(1-s), lg*(1-s)+s, lb*(1-s), lr*(1-s), lg*(1-s), lb*(1-s)+s]
    out = []
    for r in range(3): out += [m[r*3+i] * contrast for i in range(3)] + [0, lift]
    return out + [0, 0, 0, 1, 0]
GRADE_CF = skia.ColorFilters.Matrix(_sat(0.94, 0.97, 0.012))
THRESH_CF = skia.ColorFilters.Matrix([1.7,0,0,0,-0.78, 0,1.7,0,0,-0.78, 0,0,1.7,0,-0.78, 0,0,0,1,0])
def finish(surf, bloom=0.40, sigma=20):  # grade + bloom; call after drawing a frame
    c = surf.getCanvas(); img = surf.makeImageSnapshot(); c.save(); c.resetMatrix(); c.clear(C((0, 0, 0))); sigma *= ESCALA
    p = skia.Paint(); p.setColorFilter(GRADE_CF); c.drawImage(img, 0, 0, skia.SamplingOptions(), p)
    b = skia.Paint(); b.setImageFilter(skia.ImageFilters.Blur(sigma, sigma, skia.TileMode.kClamp, skia.ImageFilters.ColorFilter(THRESH_CF)))
    b.setBlendMode(skia.BlendMode.kScreen); b.setAlphaf(bloom * (.4 if ST['luz'] == 'dia' else 1)); c.drawImage(img, 0, 0, skia.SamplingOptions(), b)
    w_, h_ = img.width(), img.height()
    if ST['textura'] == 'papel':  # grão de papel + leve sépia
        c.drawRect(skia.Rect(0, 0, w_, h_), fp('#F3E7C8', 60, blend=skia.BlendMode.kMultiply))
        r_ = random.Random(3)
        for _ in range(900): c.drawCircle(r_.uniform(0, w_), r_.uniform(0, h_), r_.uniform(.6, 2.2), fp('#8C7B5A', r_.uniform(15, 45)))
    elif ST['textura'] == 'reticula':  # pontinhos de gibi
        p_ = skia.Paint(AntiAlias=True, Color=C((0, 0, 0), 26)); step = 14
        for yy in range(0, h_, step):
            for xx in range((yy // step) % 2 * step // 2, w_, step): c.drawCircle(xx, yy, 2.4, p_)
    c.restore()

# ---------------- puppet character
BODY_TOP, BODY_BOT, HEAD_R = -345, -128, 100
HEAD_CY = BODY_TOP - 74
SHOULDER = (-56, BODY_TOP + 54)
ARM = {  # left arm: (elbow, hand, show_hand); right arm is mirrored
    'down': ((-90, -235), (-96, -168), True), 'pocket': ((-96, -232), (-70, -176), False),
    'hip': ((-128, -238), (-84, -190), True), 'present': ((-128, -306), (-208, -338), True),
    'gesture': ((-136, -262), (-152, -352), True), 'chin': ((-128, -262), (-62, -322), True),
    'hat': ((-140, -400), (-104, -482), True), 'hold': ((-96, -236), (-44, -214), True),
    'push': ((-120, -270), (-190, -262), True)}

def _arm(spec):  # 'name' or ('from', 'to', k) blended with overshoot
    if isinstance(spec, str): return ARM[spec]
    a, b, k = spec; k = back(k, 1.6); ea, ha, sa = ARM[a]; eb, hb, sb = ARM[b]
    return (lerp(ea[0], eb[0], k), lerp(ea[1], eb[1], k)), (lerp(ha[0], hb[0], k), lerp(ha[1], hb[1], k)), (sb if k > .5 else sa)

CORPOS = ('homem', 'mulher', 'menino', 'menina', 'idoso', 'idosa')  # 'crianca' = menino   # "corpo" no spec
ESPECIES = ('humano', 'gato', 'cachorro', 'coelho', 'urso')  # "especie" no spec
import json as _json
_CP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cabelos.json')
if not os.path.exists(_CP): import runpy; runpy.run_path(os.path.join(os.path.dirname(_CP), 'cabelos_gen.py'))  # gera os penteados
_CAB = _json.load(open(_CP, encoding='utf8'))
CABELOS_M = tuple(_CAB['masc'])  # sugeridos para homem/menino/idoso
CABELOS_F = tuple(_CAB['fem'])   # sugeridos para mulher/menina/idosa
CABELOS = tuple(dict.fromkeys(CABELOS_M + CABELOS_F))
ROUPAS = ('suit', 'tee', 'blouse', 'dress', 'hoodie', 'jaleco', 'jardineira', 'sueter', 'colete', 'pelo')
ROSA = '#F2A7B5'


def _corpo_path(curvo):
    p = skia.Path(); T, B = BODY_TOP, BODY_BOT
    if curvo:  # silhueta feminina: ombros mais estreitos, quadril mais largo
        p.moveTo(0, T); p.cubicTo(44, T, 64, T + 6, 66, T + 52); p.cubicTo(68, T + 110, 92, B - 70, 92, B - 34)
        p.cubicTo(92, B - 4, 70, B, 0, B); p.cubicTo(-70, B, -92, B - 4, -92, B - 34)
        p.cubicTo(-92, B - 70, -68, T + 110, -66, T + 52); p.cubicTo(-64, T + 6, -44, T, 0, T); p.close()
    else: p.addRRect(skia.RRect.MakeRectXY(skia.Rect(-84, T, 84, B), 66, 72))
    return p


_PCACHE = {}
def _hpath(d):  # mini-SVG: M L C Q Z e O (oval cx cy rx ry); o editor usa o mesmo leitor
    p = _PCACHE.get(d)
    if p is not None: return p
    t = d.split(); p = skia.Path(); i = 0
    while i < len(t):
        k = t[i]; i += 1
        n = {'M': 2, 'L': 2, 'C': 6, 'Q': 4, 'Z': 0, 'O': 4}[k]; v = [float(x) for x in t[i:i + n]]; i += n
        if k == 'M': p.moveTo(*v)
        elif k == 'L': p.lineTo(*v)
        elif k == 'C': p.cubicTo(*v)
        elif k == 'Q': p.quadTo(*v)
        elif k == 'Z': p.close()
        else: p.addOval(skia.Rect(v[0] - v[2], v[1] - v[3], v[0] + v[2], v[1] + v[3]))
    _PCACHE[d] = p; return p
def tons_cabelo(h):  # mechas e brilho a partir da cor do cabelo
    r, g, b = (int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)); lum = (.299 * r + .587 * g + .114 * b) / 255
    return (clarear(h, .2) if lum < .3 else escurecer(h, .7)), clarear(h, .42 if lum < .3 else .38)
def _cabelo(c, grupo, hair, hcol, band, face, lado, lw, coberto=False):
    st = _CAB['estilos'].get(hair) if hair else None
    Ls = st and st.get(grupo)
    if not Ls: return
    hs, hl = tons_cabelo(hcol); cor = {'h': hcol, 'hs': hs, 'hl': hl, 'band': band}
    Ls = [L for L in Ls if not (coberto and L.get('alto'))]
    def abre(L):
        c.save()
        cl = L.get('clip')  # 'cabeca': por dentro do contorno do rosto; 'cobre': cobre o contorno (cabelo atrás continua)
        if cl: c.clipPath(skia.Path.Circle(0, 0, HEAD_R + (-.45 if cl == 'cabeca' else .6) * lw * ST['lw']), doAntiAlias=True)
        if L.get('kf'): c.translate(face * L['kf'], 0)
        e = L.get('esp')
        if (e == 1 and lado < 0) or (e == -1 and lado > 0): c.scale(-1, 1)
        return _hpath(L['d'])
    for L in Ls:  # 1) contorno de tudo (largo), 2) preenchimentos por cima: some o traço interno entre as partes
        if L.get('f') and L.get('w', 1): c.drawPath(abre(L), ink(lw * 2 * L.get('w', 1))); c.restore()
    for L in Ls:
        if L.get('f'): c.drawPath(abre(L), fp(cor[L['f']], 255 * L.get('a', 1))); c.restore()
    for L in Ls:
        if L.get('s') and not L.get('f'):
            v = INK if L['s'] == 'ink' else cor[L['s']]; c.drawPath(abre(L), ink(lw * L.get('w', .6), v, 255 * L.get('a', 1))); c.restore()


def draw_char(c, x, y, s, spec, face=0.0, eyes='dot', mouth='smile', brow=0.0, brow_tilt=0.0, arms=('down', 'down'),
              tilt=0.0, bob=0.0, squash=0.0, sweat=-1.0, light=-1, rim=None, hat=False, legs=None, pupil=0.0, sparkle=0.0):
    """x,y = pés. s=1 -> cabeça com raio 100 px (s=1 plano aberto, s~2.15 close com pés em y~1390).
    face -1..1 = giro 3/4. light -1 = luz da esquerda. eyes: dot/half/wide/closed. mouth: smile/smirk/flat/o/mid/open.
    spec: corpo (homem/mulher/crianca/idoso/idosa), especie (humano/gato/cachorro/coelho/urso), top (ROUPAS), hair (CABELOS),
    acessórios: glasses, moustache, barba, lashes, sardas, brincos, laco, bone, hat, bengala, hanky."""
    USADOS.append(spec.get('_nome') or ('figurante' if spec.get('figurante') else None))  # para a checagem do elenco
    spec = completar(spec); hat = hat or spec.get('hat', False)
    corpo = spec.get('corpo', 'homem'); esp = spec.get('especie', 'humano'); kid = corpo in ('crianca', 'menino', 'menina')
    curvo = corpo in ('mulher', 'idosa'); velho = corpo in ('idoso', 'idosa'); k_ = .74 if kid else 1.0
    lw = max(5.2, 4.0 / s) / k_; R = HEAD_R; s = s * k_; hm = ST['cabeca'] * (1.22 if kid else 1.0)
    fur, fur_d = spec['skin'], spec['skin_d']; claro = clarear(fur, .55); band = spec.get('hat_band', '#C8242C')
    lado = 1 if face >= 0 else -1; T, B = BODY_TOP, BODY_BOT
    c.save(); c.translate(x, y); c.scale(s, s)
    pal = ST.get('corpo') == 'palito'
    for (hx0, fx, lift) in (legs or ((-24, 0, 0), (24, 0, 0))):
        c.drawLine(0 if pal else hx0, B - 8, hx0 * (1.6 if pal else 1) + fx, -lift, ink(lw))
    c.translate(0, -bob); c.scale(1 + squash * .6, 1 - squash)
    if velho: c.translate(0, B); c.rotate(5 * lado); c.translate(0, -B)  # costas curvadas
    hair = spec.get('hair', 'none' if esp != 'humano' else None); hcol = spec.get('hair_col', '#1C1B22')

    def head_tf():
        c.translate(0, HEAD_CY); c.rotate(tilt); c.translate(0, -R * (hm - 1)); c.scale(hm, hm)

    # rabo dos animais (atrás do corpo)
    if esp != 'humano' and not pal:
        sd = -lado
        if esp in ('gato', 'cachorro'):
            tp = skia.Path(); tp.moveTo(sd * 60, B - 34)
            if esp == 'gato': tp.cubicTo(sd * 160, B - 40, sd * 150, -300, sd * 112, -336)
            else: tp.quadTo(sd * 126, B - 60, sd * 134, B - 128)
            w0 = 30 if esp == 'gato' else 34; c.drawPath(tp, ink(w0 + lw * 2)); c.drawPath(tp, ink(w0, fur))
        else: circ(c, sd * 74, B - 26, 28 if esp == 'coelho' else 20, claro if esp == 'coelho' else fur, lw)

    # cabelo de trás e orelhas de trás (antes do corpo)
    c.save(); head_tf()
    _cabelo(c, 'tras', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    if esp == 'gato':
        for sx in (-1, 1):
            poly(c, [(sx * 26, -R * .9), (sx * 94, -R * .42), (sx * 86, -R * 1.44)], fur, lw)
            poly(c, [(sx * 46, -R * .84), (sx * 80, -R * .58), (sx * 79, -R * 1.18)], ROSA, 0)
    elif esp == 'coelho':
        for sx in (-1, 1):
            c.save(); c.translate(sx * 40, -R * .82); c.rotate(sx * 12); oval(c, -27, -158, 27, 12, fur, lw); oval(c, -12, -136, 12, -14, ROSA, 0); c.restore()
    elif esp == 'urso':
        for sx in (-1, 1): circ(c, sx * 70, -R * .72, 34, fur, lw); circ(c, sx * 70, -R * .72, 17, fur_d, 0)
    c.restore()

    top = spec.get('top', 'suit')
    if pal: c.drawLine(0, T - 40, 0, B - 8, ink(lw * 1.1)); spec = dict(spec, hanky=None)  # corpo de palito
    wb = 92 if curvo else 84
    if not pal and top == 'jaleco':  # aba do jaleco abaixo do corpo
        rect(c, -wb - 4, B - 40, -2, B + 62, spec['suit'], lw, r=12); rect(c, 2, B - 40, wb + 4, B + 62, spec['suit'], lw, r=12)
    body = _corpo_path(curvo)
    shirt = spec.get('shirt', '#F4EFE2')
    base = shirt if top in ('jardineira', 'colete') else fur if top == 'pelo' else spec['suit']
    sombra = escurecer(shirt, .84) if top in ('jardineira', 'colete') else fur_d if top == 'pelo' else spec['suit_d']
    if not pal: c.drawPath(body, fp(base))
    c.save(); c.clipPath(body, doAntiAlias=True)
    if pal: c.clipRect(skia.Rect(0, 0, 0, 0))  # nada de roupa no palito
    sh = skia.Path(body); sh.offset(light * 16, -5)
    if ST['sombra']: c.drawPath(skia.Op(body, sh, skia.PathOp.kDifference_PathOp), fp(sombra))
    if top in ('suit', 'jaleco'):
        v = skia.Path(); v.moveTo(-34, T - 4); v.lineTo(0, T + 96); v.lineTo(34, T - 4); v.close(); c.drawPath(v, fp(shirt))
        if spec.get('bowtie'):
            by = T + 40; bt = skia.Path(); bt.moveTo(0, by); bt.lineTo(-24, by - 14); bt.lineTo(-24, by + 14); bt.close()
            bt.moveTo(0, by); bt.lineTo(24, by - 14); bt.lineTo(24, by + 14); bt.close(); shape(c, bt, spec['tie'], lw * .75); circ(c, 0, by, 5, spec['tie'], lw * .7)
        elif spec.get('tie'):
            poly(c, [(-9, T + 24), (9, T + 24), (13, T + 82), (0, T + 98), (-13, T + 82)], spec['tie'], lw * .75)
        for sx in (-1, 1):
            lp = skia.Path(); lp.moveTo(sx * 36, T - 2); lp.lineTo(sx * 2, T + 98); lp.lineTo(sx * 2, B); c.drawPath(lp, ink(lw * .75))
            c.drawLine(sx * 22, T + 58, sx * 40, T + 44, ink(lw * .6))
        if top == 'jaleco':
            rect(c, 30, T + 112, 66, T + 150, spec['suit'], lw * .6); c.drawLine(40, T + 100, 40, T + 126, ink(lw * 1.3, '#3E6FA8'))
    elif top == 'jardineira':
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * .75))
        for sx in (-1, 1): poly(c, [(sx * 30, T + 84), (sx * 50, T + 84), (sx * 66, T - 6), (sx * 46, T - 10)], spec['suit'], lw * .6)
        rect(c, -50, T + 78, 50, B + 10, spec['suit'], lw * .7, r=8); rect(c, -24, T + 104, 24, T + 140, spec['suit_d'], lw * .5, r=4)
        for sx in (-1, 1): circ(c, sx * 38, T + 92, 7, GOLD, lw * .5)
    elif top == 'colete':
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * .75))
        if spec.get('tie'): poly(c, [(-9, T + 24), (9, T + 24), (13, T + 82), (0, T + 98), (-13, T + 82)], spec['tie'], lw * .75)
        for sx in (-1, 1): poly(c, [(sx * 120, T - 10), (sx * 34, T - 10), (sx * 4, T + 104), (sx * 4, B + 10), (sx * 120, B + 10)], spec['suit'], lw * .75)
        for j in range(3): circ(c, 14, T + 124 + j * 26, 5, spec['suit_d'], lw * .5)
    elif top == 'pelo':
        c.drawOval(skia.Rect(-54, T + 46, 54, B - 6), fp(claro))
    else:  # tee, blouse, dress, hoodie, sueter
        if top == 'sueter':
            for yy in range(int(T + 46), int(B), 40): c.drawRect(skia.Rect(-130, yy, 130, yy + 15), fp(spec.get('print', '#F4EFE2')))
        nk = skia.Path(); nk.addArc(skia.Rect(-38, T - 40, 38, T + 30), 20, 140); c.drawPath(nk, ink(lw * (1.6 if top == 'sueter' else .75)))
        if top == 'blouse':
            for sx in (-1, 1): poly(c, [(0, T + 30), (sx * 40, T + 2), (sx * 30, T + 38)], shirt, lw * .6)
        if top == 'dress': c.drawRect(skia.Rect(-120, T + 118, 120, T + 136), fp(spec.get('print', '#F2C14E'))); c.drawLine(-120, T + 118, 120, T + 118, ink(lw * .5)); c.drawLine(-120, T + 136, 120, T + 136, ink(lw * .5))
        if top == 'hoodie':
            rect(c, -54, B - 74, 54, B - 14, spec['suit_d'], lw * .6, r=14)
            for sx in (-1, 1): c.drawLine(sx * 16, T + 26, sx * 18, T + 74, ink(lw * .55, shirt)); circ(c, sx * 18, T + 78, 4, shirt, 0)
        if top == 'tee' and spec.get('print'): circ(c, 0, T + 100, 26, spec['print'], lw * .6)  # estampa simples
    if spec.get('hanky') and top in ('suit', 'colete'): poly(c, [(30, T + 96), (52, T + 92), (48, T + 76), (40, T + 86), (33, T + 76)], spec['hanky'], lw * .55)
    c.restore()
    if not pal: c.drawPath(body, ink(lw))
    if not pal and top == 'dress':  # saia do vestido, a partir do cinto
        yb, w0 = T + 136, (72 if curvo else 84); sk = skia.Path(); sk.moveTo(-w0, yb); sk.lineTo(w0, yb)
        sk.cubicTo(wb + 6, B - 40, wb + 28, B + 40, wb + 32, B + 62); sk.quadTo(0, B + 84, -wb - 32, B + 62); sk.cubicTo(-wb - 28, B + 40, -wb - 6, B - 40, -w0, yb); sk.close()
        c.drawPath(sk, fp(spec['suit']))
        if ST['sombra']:
            c.save(); c.clipPath(sk, doAntiAlias=True); x0_, x1_ = (30, 240) if light < 0 else (-240, -30); c.drawRect(skia.Rect(x0_, yb, x1_, B + 90), fp(spec['suit_d'])); c.restore()
        c.drawPath(sk, ink(lw))
    if not pal and top == 'hoodie':  # capuz em volta do pescoço
        oval(c, -94, T - 56, 94, T + 40, spec['suit'], lw); c.drawOval(skia.Rect(-64, T - 40, 64, T + 22), fp(spec['suit_d']))
    for side, a in ((-1, arms[0]), (1, arms[1])):
        e, h, show = _arm(a); m = 1 if side < 0 else -1
        sx, sy = (0, SHOULDER[1] - 10) if pal else (SHOULDER[0] * m, SHOULDER[1]); ex, ey, hx_, hy_ = e[0] * m, e[1], h[0] * m, h[1]
        ap = skia.Path(); ap.moveTo(sx, sy); ap.quadTo(1.35*ex - .175*(sx+hx_), 1.35*ey - .175*(sy+hy_), hx_, hy_); c.drawPath(ap, ink(lw))
        if spec.get('bengala') and side == lado:  # bengala na mão do lado para onde olha
            cb = skia.Path(); cb.moveTo(hx_ - side * 26, hy_ - 4); cb.quadTo(hx_ - side * 18, hy_ - 34, hx_, hy_ - 16); cb.lineTo(hx_ + side * 22, -4)
            c.drawPath(cb, ink(lw * 2.6)); c.drawPath(cb, ink(lw * 1.2, '#9A6A3E'))
        if show: circ(c, hx_, hy_, 13, spec['skin'], lw * .8)
    c.save(); head_tf()
    head = skia.Path(); head.addCircle(0, 0, R)
    _cabelo(c, 'nuca', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    c.drawPath(head, fp(spec['skin'])); c.save(); c.clipPath(head, doAntiAlias=True)
    lit = skia.Path(head); lit.offset(light * 7, -17)
    if ST['sombra']: c.drawPath(skia.Op(head, lit, skia.PathOp.kDifference_PathOp), fp(spec['skin_d']))
    if rim: rm = skia.Path(head); rm.offset(-light * 11, 4); c.drawPath(skia.Op(head, rm, skia.PathOp.kDifference_PathOp), fp(rim, 215))
    if spec.get('barba'):  # barba: contorna o queixo, abaixo da boca
        mx0 = face * 34; bd = skia.Path(); bd.moveTo(-R - 10, -20); bd.lineTo(-82, -20); bd.cubicTo(-76, 50, mx0 - 42, 72, mx0, 72)
        bd.cubicTo(mx0 + 42, 72, 76, 50, 82, -20); bd.lineTo(R + 10, -20); bd.lineTo(R + 10, R + 10); bd.lineTo(-R - 10, R + 10); bd.close(); c.drawPath(bd, fp(hcol))
    c.restore()
    c.drawPath(head, ink(lw))  # contorno da cabeça antes do cabelo: o cabelo da frente o cobre
    _cabelo(c, 'frente', hair, hcol, band, face, lado, lw, hat or spec.get('bone'))
    if esp == 'cachorro':  # orelhas caídas na frente
        for sx in (-1, 1):
            c.save(); c.translate(sx * R * .86, -R * .55); c.rotate(-sx * 14); oval(c, -26, -10, 26, 112, fur_d, lw); c.restore()
    if hat:
        crown = skia.Path(); crown.moveTo(-R + 6, -56); crown.cubicTo(-R - 2, -R - 82, R + 2, -R - 82, R - 6, -56); crown.close()
        shape(c, crown, spec.get('hat_col', '#2E2E38'), lw); c.save(); c.clipPath(crown, doAntiAlias=True)
        c.drawRect(skia.Rect(-R, -86, R, -56), fp(spec.get('hat_band', '#7E1C24'))); c.drawLine(-R, -86, R, -86, ink(lw * .7)); c.restore()
        c.drawPath(crown, ink(lw)); oval(c, -R - 40, -70, R + 40, -40, spec.get('hat_col', '#2E2E38'), lw)
    elif spec.get('bone'):  # boné com aba virada para onde olha
        dm = skia.Path(); dm.moveTo(-R + 2, -44); dm.cubicTo(-R - 6, -R - 52, R + 6, -R - 52, R - 2, -44); dm.close(); shape(c, dm, spec.get('hat_col', '#2E2E38'), lw)
        oval(c, lado * 30 - 62 + lado * 40, -58, lado * 30 + 62 + lado * 40, -32, spec.get('hat_col', '#2E2E38'), lw); circ(c, 0, -R - 22, 8, band, lw * .6)
    if spec.get('laco'):
        bx, by_ = -lado * R * .6, -R * .84
        for sx in (-1, 1): poly(c, [(bx, by_), (bx + sx * 36, by_ - 22), (bx + sx * 36, by_ + 22)], band, lw * .7)
        circ(c, bx, by_, 9, band, lw * .6)
    if spec.get('brincos'):
        for sx in (-1, 1): circ(c, sx * R * .97, 34, 8, GOLD, lw * .5)
    fx = face * 40; eyy = -6; mx, my = face * 34, 42
    if esp != 'humano':  # focinho e nariz
        big = esp in ('cachorro', 'urso'); rx_, ry_ = (46, 32) if big else (30, 22)
        c.drawOval(skia.Rect(mx - rx_, 34 - ry_, mx + rx_, 34 + ry_), fp(claro))
        if big: oval(c, mx - 14, 8, mx + 14, 26, INK, 0)
        else: poly(c, [(mx - 10, 18), (mx + 10, 18), (mx, 28)], ROSA, lw * .5)
    for ex0 in (-30, 30):
        ex = ex0 + fx; far = (face > 0 and ex0 > 0) or (face < 0 and ex0 < 0); sq = 1 - .3 * abs(face) if far else 1.0
        if eyes == 'wide':
            oval(c, ex - 17*sq, eyy - 17, ex + 17*sq, eyy + 17, '#FBFBF7', lw * .7)
            c.drawOval(skia.Rect(ex - 5.5*sq + pupil*6, eyy - 5.5, ex + 5.5*sq + pupil*6, eyy + 5.5), fp(INK))
        elif eyes == 'closed':
            e = skia.Path(); e.moveTo(ex - 11*sq, eyy); e.quadTo(ex, eyy + 9, ex + 11*sq, eyy); c.drawPath(e, ink(lw * .8))
        elif eyes == 'half':
            c.save(); c.clipRect(skia.Rect(ex - 20, eyy - 3, ex + 20, eyy + 20)); c.drawOval(skia.Rect(ex - 6.5*sq, eyy - 9, ex + 6.5*sq, eyy + 9), fp(INK)); c.restore()
            c.drawLine(ex - 13*sq, eyy - 4, ex + 13*sq, eyy - 4, ink(lw * .8))
        elif ST['olhos'] == 'grande' or kid:  # olhos grandes e brilhantes (estilo fofo e crianças)
            oval(c, ex - 13*sq, eyy - 16, ex + 13*sq, eyy + 16, '#FBFBF7', lw * .6)
            c.drawOval(skia.Rect(ex - 8*sq + face*3, eyy - 10, ex + 8*sq + face*3, eyy + 12), fp(INK))
            c.drawCircle(ex + 3 + face*3, eyy - 4, 3.6, fp((255, 255, 255))); c.drawCircle(ex - 3 + face*3, eyy + 5, 1.6, fp((255, 255, 255), 200))
        else:
            c.drawOval(skia.Rect(ex - 5.5*sq, eyy - 8, ex + 5.5*sq, eyy + 8), fp(INK)); c.drawCircle(ex + 1.5, eyy - 3, 1.8, fp((255, 255, 255), 220))
        if spec.get('lashes') and eyes != 'closed':
            o = -1 if ex0 < 0 else 1; c.drawLine(ex + o * 9 * sq, eyy - 6, ex + o * 17 * sq, eyy - 13, ink(lw * .6))
        if velho:  # rugas no canto dos olhos
            o = -1 if ex0 < 0 else 1; c.drawLine(ex + o * 18 * sq, eyy + 2, ex + o * 26 * sq, eyy + 8, ink(lw * .45))
        if spec.get('sardas'):
            for dx, dy in ((-8, 0), (0, 5), (8, 0)): c.drawCircle(ex + dx * sq, 24 + dy, 3, fp(escurecer(spec['skin'], .68)))
        inner = 1 if ex0 < 0 else -1; by = eyy - 29 - brow * 9
        c.drawLine(ex - 13*sq, by + (brow_tilt*7 if inner < 0 else -brow_tilt*7), ex + 13*sq, by + (brow_tilt*7 if inner > 0 else -brow_tilt*7), ink(lw * .78))
    if spec.get('glasses'):
        for ex0 in (-30, 30):
            ex = ex0 + fx; far = (face > 0 and ex0 > 0) or (face < 0 and ex0 < 0); sq = 1 - .3 * abs(face) if far else 1.0
            g = skia.Path(); g.addOval(skia.Rect(ex - 24*sq, eyy - 24, ex + 24*sq, eyy + 24)); c.drawPath(g, fp((225, 240, 255), 55)); c.drawPath(g, ink(lw * .7))
        c.drawLine(fx - 7, eyy - 3, fx + 7, eyy - 3, ink(lw * .7))
    if spec.get('moustache'):
        mu = skia.Path(); mu.moveTo(mx, my - 20)
        mu.cubicTo(mx-12, my-28, mx-30, my-22, mx-40, my-30); mu.cubicTo(mx-30, my-10, mx-12, my-12, mx, my-15)
        mu.cubicTo(mx+12, my-12, mx+30, my-10, mx+40, my-30); mu.cubicTo(mx+30, my-22, mx+12, my-28, mx, my-20); mu.close()
        c.drawPath(mu, fp(spec.get('hair_col', '#1C1B22')))
    if mouth == 'smile': m = skia.Path(); m.moveTo(mx - 17, my - 2); m.quadTo(mx, my + 13, mx + 17, my - 2); c.drawPath(m, ink(lw * .8))
    elif mouth == 'smirk':
        d = 1 if face >= 0 else -1; m = skia.Path(); m.moveTo(mx - 15*d, my + 3); m.quadTo(mx + 4*d, my + 12, mx + 20*d, my - 6); c.drawPath(m, ink(lw * .8))
    elif mouth == 'flat': c.drawLine(mx - 12, my + 2, mx + 12, my + 2, ink(lw * .8))
    elif mouth == 'o': oval(c, mx - 8, my - 9, mx + 8, my + 11, '#5A1A1E', lw * .7)
    elif mouth == 'mid': oval(c, mx - 12, my - 4, mx + 12, my + 10, '#5A1A1E', lw * .7)
    elif mouth == 'open':
        mp = skia.Path(); mp.moveTo(mx - 20, my - 5); mp.lineTo(mx + 20, my - 5); mp.cubicTo(mx + 19, my + 24, mx - 19, my + 24, mx - 20, my - 5); mp.close()
        c.drawPath(mp, fp('#5A1A1E')); c.save(); c.clipPath(mp, doAntiAlias=True)
        c.drawRect(skia.Rect(mx - 22, my - 6, mx + 22, my + 2), fp('#FAFAF4')); c.drawOval(skia.Rect(mx - 11, my + 9, mx + 11, my + 26), fp('#D05860')); c.restore()
        c.drawPath(mp, ink(lw * .7))
    if esp in ('gato', 'coelho'):  # bigodes
        for sx in (-1, 1):
            for dy in (-6, 8): c.drawLine(mx + sx * 26, 30 + dy * .3, mx + sx * 74, 24 + dy, ink(lw * .4))
    if sparkle > 0:
        k = pop(sparkle) * (1 if sparkle < 1 else max(0, 2 - sparkle)); sx_, sy_ = mx + 26 * (1 if face >= 0 else -1), my - 8; st = skia.Path()
        for i in range(8):
            r_ = (20 if i % 2 == 0 else 5) * k; a = i * math.pi / 4; (st.moveTo if i == 0 else st.lineTo)(sx_ + r_ * math.cos(a), sy_ + r_ * math.sin(a))
        st.close(); c.drawPath(st, fp('#FFFFFF'))
    if sweat >= 0:
        sx0, sy0 = (-1 if face > 0 else 1) * 62, -66 + 30 * (sweat % 1.0)
        d = skia.Path(); d.moveTo(sx0, sy0 - 19); d.cubicTo(sx0 + 12, sy0 - 3, sx0 + 11, sy0 + 10, sx0, sy0 + 10); d.cubicTo(sx0 - 11, sy0 + 10, sx0 - 12, sy0 - 3, sx0, sy0 - 19); d.close()
        shape(c, d, '#8FC8EE', lw * .7)
    c.restore(); c.restore()


def _tri(x0, y0, x1, y1, x2, y2):
    p = skia.Path(); p.moveTo(x0, y0); p.lineTo(x1, y1); p.lineTo(x2, y2); p.close(); return p
def escurecer(h, f):
    h = h.lstrip('#'); return '#' + ''.join(f'{int(int(h[i:i + 2], 16) * f):02x}' for i in (0, 2, 4))
def clarear(h, f):  # mistura com branco (f=0 igual, f=1 branco)
    h = h.lstrip('#'); return '#' + ''.join(f'{int(int(h[i:i + 2], 16) + (255 - int(h[i:i + 2], 16)) * f):02x}' for i in (0, 2, 4))
def completar(spec):  # aceita specs do editor de personagens: cores de sombra automáticas
    s = dict(spec)
    if 'skin_d' not in s: s['skin_d'] = escurecer(s.get('skin', '#E6BE8E'), .84)
    s.setdefault('suit', '#3E6FA8')
    if 'suit_d' not in s: s['suit_d'] = escurecer(s['suit'], .76)
    if s.get('especie', 'humano') != 'humano': s.setdefault('top', 'pelo'); s.setdefault('hair', 'none')
    if s.get('hair') == 'curly' and s.get('corpo') in ('mulher', 'menina', 'idosa'): s['hair'] = 'cachos'  # versão antiga do editor
    s.setdefault('skin', '#E6BE8E'); return s
USADOS = []  # nomes do elenco desenhados (None = personagem fora do elenco)
def carregar_elenco(proj, padrao=None):
    """Lê o "elenco" do roteiro.json (colado do editor de personagens). Uso no cenas.py:
    EL = carregar_elenco(os.path.dirname(os.path.abspath(__file__))); RAFA = EL['rafa']
    O personagem vem EXATAMENTE como o usuário montou. 'padrao' só serve quando não há elenco no roteiro.json."""
    import json
    try: R = json.load(open(os.path.join(proj, 'roteiro.json'), encoding='utf8'))
    except FileNotFoundError: R = {}
    el = R.get('elenco') or dict(padrao or {})
    return Elenco({k: dict(completar(v), _nome=k) for k, v in el.items()}, bool(R.get('elenco')))
class Elenco(dict):  # avisa na hora se a cena pede um nome que o elenco não tem
    def __init__(self, d, do_editor):
        super().__init__(d); self.do_editor = do_editor
    def __missing__(self, k):
        raise KeyError(f'"{k}" não está no elenco ({", ".join(self) or "vazio"}). Use os nomes do editor ou renomeie no roteiro.json.')


def walk_legs(phase, stride=46, lift=20):  # pass as legs=walk_legs((t-t0)*11) with bob=7*abs(sin(phase))
    a = math.sin(phase)
    return ((-10, a * stride, max(0, math.cos(phase)) * lift), (10, -a * stride, max(0, -math.cos(phase)) * lift))

# elenco de exemplo (invente um visual novo por vídeo: cabelo, óculos, cor da roupa, chapéu, tom de pele)
HERO = dict(skin='#E6BE8E', skin_d='#C99F70', suit='#3B4660', suit_d='#2B3348', shirt='#F4EFE2', tie='#A8232B', hair='slick', moustache=True, hanky='#F4EFE2')
MARK = dict(skin='#EBC79C', skin_d='#CFA677', suit='#7A5A3C', suit_d='#5E432B', shirt='#F4EFE2', tie='#2F6B4E', bowtie=True, hair='bald', glasses=True)
ANA = dict(skin='#B9825A', skin_d='#9A6744', suit='#2E7D6B', suit_d='#225E50', shirt='#F4EFE2', top='blouse', hair='long', hair_col='#2A1A14', lashes=True)
JOAO = dict(skin='#8A5A3B', skin_d='#6E4529', suit='#C8742C', suit_d='#A35B1E', top='tee', print='#F2C14E', hair='curly', hair_col='#1A1210')

# modelos prontos (os mesmos do editor de personagens): dict(MODELOS['avo_f'], suit='#2E7D6B') para variar
MODELOS = {
    'homem':    dict(corpo='homem', skin='#E6BE8E', top='tee', suit='#3E6FA8', print='#F2C14E', hair='short', hair_col='#3B2A20'),
    'mulher':   dict(corpo='mulher', skin='#C98F62', top='dress', suit='#B23A48', print='#F2C14E', hair='long', hair_col='#2A1A14', lashes=True, brincos=True),
    'menino':   dict(corpo='menino', skin='#D9A877', top='sueter', suit='#3E6FA8', print='#F4EFE2', hair='espetado', hair_col='#3B2A20', sardas=True),
    'menina':   dict(corpo='menina', skin='#8A5A3B', top='jardineira', suit='#5B8DD6', shirt='#F2C14E', hair='maria', hair_col='#1C1B22', lashes=True, laco=True, hat_band='#E04E8A'),
    'avo_m':    dict(corpo='idoso', skin='#E6BE8E', top='colete', suit='#7A5A3C', shirt='#F4EFE2', hair='bald', hair_col='#D8D8DC', glasses=True, moustache=True, bengala=True),
    'avo_f':    dict(corpo='idosa', skin='#D9A877', top='blouse', suit='#7A3B5E', shirt='#F4EFE2', hair='bun', hair_col='#DADADF', glasses=True, lashes=True, brincos=True),
    'gato':     dict(especie='gato', skin='#E8964A'),
    'cachorro': dict(especie='cachorro', skin='#C8A27A'),
    'coelho':   dict(especie='coelho', skin='#EDE8E4'),
    'urso':     dict(especie='urso', skin='#8A5A3B'),
}


# ---------------- peças de cenário reutilizáveis
_r = random.Random(7)
STARS = [(_r.uniform(-200, W + 200), _r.uniform(-100, 760), _r.choice((1.6, 2.0, 2.6, 3.2)), _r.uniform(0, 6)) for _ in range(120)]
SPECK = [(_r.uniform(0, W), _r.uniform(70, 1010), _r.uniform(1.5, 4.5), _r.uniform(40, 110)) for _ in range(260)]

def sky(c, top='#0A1136', bot='#24338A', h=860):
    if ST['luz'] == 'dia': top, bot = '#5FB2E8', '#CDEBFA'  # céu de dia nos estilos diurnos
    c.drawRect(skia.Rect(-2000, -1500, W + 2000, H + 1500), sp(linear(0, 0, 0, h, [hx(top), hx(bot)])))
def stars(c, t):
    if ST['luz'] == 'dia': return
    for (sx, sy, r, ph) in STARS: c.drawCircle(sx, sy, r, fp('#E8ECFF', 150 + 90 * math.sin(t * 2.4 + ph)))
def moon(c, x, y, r=50):
    if ST['luz'] == 'dia':  # vira sol
        for k, a_ in ((3.0, 30), (2.0, 50)): c.drawCircle(x, y, r * k, fp('#FFF4C2', a_))
        circ(c, x, y, r, '#FFD84A', LW * .7); return
    for k, a in ((3.0, 16), (2.2, 22), (1.55, 30)): c.drawCircle(x, y, r * k, fp('#C9D4FF', a))
    c.drawCircle(x, y, r, fp('#F3EDD3')); c.drawCircle(x - r * .3, y - r * .25, r * .16, fp('#D9D2B4')); c.drawCircle(x + r * .25, y + r * .3, r * .22, fp('#DDD6B8'))
def cloud(c, x, y, s, v='#2C3B80', a=255):
    p = skia.Path()
    for dx, dy, r in ((-70, 8, 34), (-30, -14, 46), (22, -6, 40), (64, 10, 30)): p.addCircle(x + dx * s, y + dy * s, r * s)
    p.addRect(skia.Rect(x - 100 * s, y + 8 * s, x + 92 * s, y + 40 * s)); c.drawPath(p, fp(v, a))
def far_city(c, base, seed=3, v='#1A2560'):  # silhueta distante (use dentro de blur_begin)
    r = random.Random(seed); x = -260
    while x < W + 260:
        w = r.uniform(90, 200); h = r.uniform(120, 260)
        c.drawRect(skia.Rect(x, base - h, x + w, base + 300), fp(v)); c.drawRect(skia.Rect(x + 10, base - h - 26, x + w - 10, base - h), fp(v))
        for j in range(int(h // 50)):
            for i in range(int(w // 40)):
                if r.random() < .3: c.drawRect(skia.Rect(x + 12 + i * 40, base - h + 16 + j * 50, x + 24 + i * 40, base - h + 36 + j * 50), fp('#E9CF86', 200))
        x += w + r.uniform(-6, 10)
def building(c, x, w, h, base, seed, lit=.4, lw=LW, body='#1C2658', roof='#131A42', dim='#263272'):  # prédio com janelas acesas
    r = random.Random(seed); top = base - h
    rect(c, x, top, x + w, base + 600, body, lw)
    poly(c, [(x - 8, top), (x + 16, top - 44), (x + w - 16, top - 44), (x + w + 8, top)], roof, lw)
    for i in range(r.randint(1, 3)):
        cx_ = x + r.uniform(.15, .8) * w; rect(c, cx_, top - 78, cx_ + 22, top - 44, roof, lw * .8)
    cols = max(2, int((w - 30) // 46)); rows = int((h - 30) // 62); gap = (w - cols * 22) / (cols + 1)
    for j in range(rows):
        for i in range(cols):
            wx, wy = x + gap + i * (22 + gap), top + 26 + j * 62; on = r.random() < lit
            rect(c, wx, wy, wx + 22, wy + 36, '#F2D88C' if on else dim, lw * .5)
            if on: c.drawRect(skia.Rect(wx - 8, wy - 8, wx + 30, wy + 44), fp('#FFD98A', 34, blur=7))
def street_lamp(c, x, y_base, y_top):
    line(c, x, y_base, x, y_top, 22, INK); line(c, x, y_base, x, y_top, 11, '#2B2D3C')
    rect(c, x - 22, y_base - 26, x + 22, y_base + 4, '#2B2D3C', LW * .8)
    poly(c, [(x - 40, y_top + 4), (x + 40, y_top + 4), (x + 26, y_top - 72), (x - 26, y_top - 72)], '#FFF0B4', LW)
    poly(c, [(x - 48, y_top - 72), (x + 48, y_top - 72), (x, y_top - 112)], '#2B2D3C', LW); line(c, x - 40, y_top + 4, x + 40, y_top + 4, LW)
def banker_lamp(c, x, y):
    oval(c, x - 58, y - 16, x + 58, y + 6, '#D0A548', LW * .8)
    line(c, x, y - 8, x, y - 118, 12, INK); line(c, x, y - 8, x, y - 118, 6, '#E3BC5C')
    sh = skia.Path(); sh.moveTo(x - 116, y - 112); sh.cubicTo(x - 96, y - 196, x + 96, y - 196, x + 116, y - 112); sh.close(); shape(c, sh, '#2FA25E', LW)
    hl = skia.Path(); hl.moveTo(x - 82, y - 138); hl.quadTo(x - 50, y - 172, x - 4, y - 174); c.drawPath(hl, ink(7, '#8FE0AE'))
    oval(c, x - 104, y - 122, x + 104, y - 100, '#FFF3B8', LW * .7)
    for i in range(6):
        a = math.radians(60 + i * 12); c.drawLine(x + 70 * math.cos(a), y - 96, x + 150 * math.cos(a), y - 96 + 84 * math.sin(a), ink(2.4, '#FFF6D0', 110))
def table_top(c):  # mesa vista de cima: papel creme com pintas + feltro verde
    c.drawRect(skia.Rect(-900, -700, W + 900, H + 700), sp(radial(960, 520, 1300, [hx('#F6EED4'), hx('#E6DBB8'), hx('#CDBF98')], [0, .6, 1])))
    for (sx, sy, r, a) in SPECK: c.drawCircle(sx, sy, r, fp('#9A8F6E', a))
    for (ya, yb) in ((-700, 64), (1016, H + 700)): c.drawRect(skia.Rect(-900, ya, W + 900, yb), fp('#2F6B45'))
    for yy in (64, 1016): line(c, -900, yy, W + 900, yy, LW)
def sleeve(c, x0, y0, x1, y1, width, v, cuff='#F4EFE2', skin='#E6BE8E', fingers=True, hand_r=None):  # braço visto de cima
    ang = math.degrees(math.atan2(y1 - y0, x1 - x0)); L = math.hypot(x1 - x0, y1 - y0); hr = hand_r or width * .5
    c.save(); c.translate(x0, y0); c.rotate(ang); circ(c, L + hr * .55, 0, hr, skin, LW)
    if fingers:
        for k in (-.42, 0, .42): c.drawLine(L + hr * 1.2, k * hr, L + hr * 1.52, k * hr * 1.1, ink(LW * .8))
    rect(c, -200, -width / 2, L, width / 2, v, LW); rect(c, L - 34, -width / 2 - 5, L + 6, width / 2 + 5, cuff, LW); c.restore()
def cash(c, x, y, rot=0, s=1.0):  # maço de notas genéricas (sem moeda real)
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    for a_ in (-16, -4, 9):
        c.save(); c.rotate(a_); rect(c, -130, -70, 130, 70, '#6FA36A', LW); rect(c, -108, -50, 108, 50, '#84B67E', LW * .5); circ(c, 0, 0, 26, '#6FA36A', LW * .5); c.restore()
    c.restore()
def newspaper(c, x, y, w, h, headline, rot=-4, circle_u=0.0):  # jornal com manchete e círculo de marcador vermelho
    c.save(); c.translate(x, y); c.rotate(rot)
    c.drawRect(skia.Rect(-w/2 + 14, -h/2 + 18, w/2 + 14, h/2 + 18), fp((60, 40, 10), 70, blur=12))
    rect(c, -w/2, -h/2, w/2, h/2, '#F3EEDF', LW)
    label(c, "DIÁRIO", 0, -h/2 + 70, 64, INK, font=MARKER, align='center', skew=0)
    line(c, -w/2 + 30, -h/2 + 92, w/2 - 30, -h/2 + 92, 4)
    hw = label(c, headline, 0, -h/2 + 182, min(72, (w - 80) / max(len(headline), 1) * 1.9), INK, align='center', skew=-0.05)
    for i in range(9):
        yy = -h/2 + 232 + i * 30
        if yy < h/2 - 30: c.drawLine(-w/2 + 34, yy, w/2 - 34 - (i % 3) * 40, yy, ink(5, '#B8B2A0'))
    if circle_u > 0:
        rg = skia.Path(); rg.addArc(skia.Rect(-hw/2 - 40, -h/2 + 112, hw/2 + 40, -h/2 + 212), -100, 352 * ease(min(circle_u, 1))); c.drawPath(rg, ink(12, RED))
    c.restore()

# ---------------- textos e grafismos
def tag(c, s, u, x=70, y=None):  # etiqueta de local (canto inferior esquerdo; mais alta no vertical)
    y = y or (SH * .62 if vertical() else SH - 86)
    a = ease_out(u * 3)
    if a <= 0: return
    w = text_w(s, 44); c.save(); c.translate(-50 * (1 - a), 0)
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(x, y - 52, x + w + 64, y + 18), 10, 10), fp((10, 12, 26), 205 * a))
    c.drawRect(skia.Rect(x, y - 52, x + 10, y + 18), fp(GOLD, 255 * a)); label(c, s, x + 34, y, 44, CREAM, alpha=a, skew=-0.12); c.restore()
def lower_third(c, name, sub, u, x, y):  # nome + subtítulo
    if u <= 0: return
    a = back(min(u * 2.6, 1), 1.4); w = max(text_w(name, 76), text_w(sub, 40), 380)
    c.save(); c.translate(x, y); c.scale(a, a); rect(c, 0, -74, w + 84, 74, (12, 14, 28), LW * .8)
    c.drawRect(skia.Rect(3, -71, 19, 71), fp(GOLD)); label(c, name, 44, 4, 76, CREAM, skew=-0.12); label(c, sub, 46, 54, 40, GOLD, skew=-0.12); c.restore()
def stamp(c, txt, x, y, u, rot=-10, size=150, v=RED):  # carimbo (som: thud; câmera: shake)
    if u <= 0: return
    sc = 2.6 - 1.6 * ease_out(min(u * 5, 1)); a = min(u * 8, 1); w = text_w(txt, size, MARKER)
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc)
    for inset, wd in ((0, 13), (18, 5)):
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-w / 2 - 50 + inset, -size * .98 + inset, w / 2 + 50 - inset, size * .36 - inset), 16, 16), ink(wd, v, 255 * a))
    label(c, txt, 0, 0, size, v, font=MARKER, align='center', skew=0, alpha=a); c.restore()
def poplabel(c, s, x, y, t, t0, size=120, v=LIME, rot=-5, font=None, stroke=15, align='center'):  # rótulo que salta (som: pop)
    pu = pop(K(t, t0, .3))
    if pu <= 0: return
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(pu, pu); label(c, s, 0, 0, size, v, font=font, align=align, stroke=stroke, skew=-0.14); c.restore()
def counter(c, x, y, t, t0, dur, value, fmt="{:,.0f}", size=150, v=LIME, sub=None):  # número que sobe (som: ticks)
    k = ease_out(K(t, t0, dur)); s = fmt.format(value * k).replace(',', '.')
    poplabel(c, s, x, y, t, t0, size, v)
    if sub and t > t0: poplabel(c, sub, x, y + size * .64, t, t0 + .1, size * .52, CREAM, stroke=12)
def wrap(words, size, maxw, font):
    lines = [[]]
    for w in words:
        if lines[-1] and text_w(' '.join(lines[-1] + [w]), size, font) > maxw: lines.append([])
        lines[-1].append(w)
    return lines
def card_text(c, line_txt, t, t0, dur, size=None, color='#FFFFFF'):  # cartão preto (espaço da tela), palavras surgem no ritmo da fala
    c.drawRect(skia.Rect(-SW, -SH, 2 * SW, 2 * SH), fp((0, 0, 0)))
    words = line_txt.split(); tot = sum(len(w) + 1 for w in words); acc = 0; k = 0
    for w in words:
        if t >= t0 + dur * acc / tot - .04: k += 1
        acc += len(w) + 1
    size = size or (140 if SW >= 1600 else 118); maxw = SW - 160
    lines = wrap(words, size, maxw, FONT_HAND)
    while len(lines) > 4 and size > 60: size -= 8; lines = wrap(words, size, maxw, FONT_HAND)
    f = skia.Font(FONT_HAND, size); lh = size * 1.12; y0 = SH / 2 - lh * (len(lines) - 1) / 2 + size * .32; n = 0
    for j, ln in enumerate(lines):
        full = f.measureText(' '.join(ln)); vis = ln[:max(0, k - n)]; n += len(ln)
        if vis: c.drawString(' '.join(vis), SW / 2 - full / 2, y0 + j * lh, f, fp(color))
def legenda(c, txt, t, t0, dur, y=None):  # legenda grande estilo Shorts: 2 a 4 palavras por vez, palavra atual em amarelo
    if not (t0 <= t < t0 + dur): return
    words = txt.split(); tot = sum(len(w) + 1 for w in words); acc = 0; starts = []
    for w in words: starts.append(t0 + dur * acc / tot); acc += len(w) + 1
    cur = max(i for i, s0 in enumerate(starts) if s0 <= t) if t >= starts[0] else 0
    g0 = (cur // 3) * 3; grp = words[g0:g0 + 3]; size = 92 if vertical() else 70
    y = y or (SH * .80 if vertical() else SH - 70); f = skia.Font(MARKER, size)
    full = f.measureText(' '.join(grp))
    while full > SW - 120 and size > 40: size -= 6; f = skia.Font(MARKER, size); full = f.measureText(' '.join(grp))
    x = SW / 2 - full / 2
    for i, w in enumerate(grp):
        cw = f.measureText(w + ' '); col_ = '#FFE14A' if g0 + i == cur else '#FFFFFF'
        c.drawString(w, x, y, f, ink(size * .16, INK)); c.drawString(w, x, y, f, fp(col_)); x += cw


def folha_elenco(origem, out, estilo=None, cols=6):
    """Folha com todos os personagens do elenco, com o nome de cada um. origem: roteiro.json, código do editor (.json/.txt) ou dict.
    Use para VER o elenco antes de escrever as cenas e para mostrar ao usuário quem vai no vídeo."""
    import json
    d = origem if isinstance(origem, dict) else json.load(open(origem, encoding='utf8'))
    el = d.get('elenco', d); est = estilo or d.get('estilo', 'noturno'); antes = dict(ST); set_estilo(est)
    n = len(el); rows = (n + cols - 1) // cols; cw, ch = 300, 420
    surf = skia.Surface(cw * cols, ch * rows); c = surf.getCanvas(); c.clear(hx('#2a3470' if ST['luz'] == 'noite' else '#bfe3f6'))
    for i, (nome, sp_) in enumerate(el.items()):
        x = (i % cols) * cw + cw / 2; y = (i // cols) * ch + ch - 50
        draw_char(c, x, y, .66, sp_, face=.25)
        label(c, nome, x, (i // cols) * ch + 38, 34, CREAM, align='center', skew=0, stroke=8)
    ST.clear(); ST.update(antes)
    surf.makeImageSnapshot().save(out, skia.kPNG); return out


# ---------------- cenários prontos por tema (mundo 1920x1080; piso em y=800; pés dos personagens em y~1000 com s=1)
PISO = 800
def _noite(): return ST['luz'] != 'dia'
def _parede(c, cima, baixo, y=PISO):
    c.drawRect(skia.Rect(-900, -700, W + 900, y), sp(linear(0, 0, 0, y, [hx(cima), hx(baixo)])))
def _rodape(c, cor='#F4EFE2', y=PISO):
    c.drawRect(skia.Rect(-900, y - 26, W + 900, y), fp(cor)); line(c, -900, y - 26, W + 900, y - 26, LW * .6); line(c, -900, y, W + 900, y, LW)
def _piso(c, c1, c2, tipo='madeira', y=PISO):
    c.drawRect(skia.Rect(-900, y, W + 900, H + 700), sp(linear(0, y, 0, H + 80, [hx(c1), hx(c2)])))
    if tipo == 'madeira':
        yy, k = y + 22, 0
        while yy < H + 300:
            line(c, -900, yy, W + 900, yy, 2.4, escurecer(c2, .78)); off = (k % 2) * 130
            for xx in range(-900 + off, W + 900, 260 + k * 30): line(c, xx, yy, xx - 10, yy + 22 + k * 7, 2.2, escurecer(c2, .78))
            k += 1; yy += 22 + k * 7
    elif tipo == 'ladrilho':
        for i in range(-14, 15): line(c, 960 + i * 90, y, 960 + i * 240, H + 300, 2.2, escurecer(c2, .8))
        yy, k = y + 30, 0
        while yy < H + 300: line(c, -900, yy, W + 900, yy, 2.2, escurecer(c2, .8)); k += 1; yy += 30 + k * 12
    elif tipo == 'tapete':
        for i in range(60): c.drawCircle((i * 397) % 2400 - 240, y + 20 + (i * 151) % 300, 3, fp(escurecer(c2, .85), 120))
def _ceu_janela(c, x, y, w, h, t, cidade=False):
    c.save(); c.clipRect(skia.Rect(x, y, x + w, y + h))
    if _noite():
        c.drawRect(skia.Rect(x, y, x + w, y + h), sp(linear(0, y, 0, y + h, [hx('#0D1640'), hx('#2C3D8F')])))
        for (sx, sy, r, ph) in STARS[:40]: c.drawCircle(x + sx % w, y + sy % h * .6, r * .8, fp('#E8ECFF', 150 + 80 * math.sin(t * 2.4 + ph)))
        c.drawCircle(x + w * .75, y + h * .25, 22, fp('#F3EDD3'))
    else:
        c.drawRect(skia.Rect(x, y, x + w, y + h), sp(linear(0, y, 0, y + h, [hx('#6CC0F0'), hx('#D8F0FC')])))
        cloud(c, x + w * .3 + (t * 6) % (w * .6), y + h * .3, .7, '#FFFFFF', 230)
    if cidade:
        r = random.Random(4); xx = x - 10
        while xx < x + w:
            bw = r.uniform(50, 90); bh = r.uniform(h * .25, h * .55)
            c.drawRect(skia.Rect(xx, y + h - bh, xx + bw, y + h), fp('#2A3670' if _noite() else '#9DB4D6'))
            for j in range(int(bh // 34)):
                for i in range(int(bw // 26)):
                    if r.random() < .35: c.drawRect(skia.Rect(xx + 8 + i * 26, y + h - bh + 12 + j * 34, xx + 18 + i * 26, y + h - bh + 26 + j * 34), fp('#F2D88C' if _noite() else '#E8F2FF'))
            xx += bw + 6
    c.restore()
def _janela(c, x, y, w, h, t, moldura='#F4EFE2', cortina=None, cidade=False):
    _ceu_janela(c, x, y, w, h, t, cidade)
    p = skia.Path(); p.addRect(skia.Rect(x - 16, y - 16, x + w + 16, y + h + 16)); p.addRect(skia.Rect(x, y, x + w, y + h)); p.setFillType(skia.PathFillType.kEvenOdd)
    c.drawPath(p, fp(moldura)); c.drawPath(p, ink(LW * .8))
    rect(c, x + w / 2 - 6, y, x + w / 2 + 6, y + h, moldura, LW * .5); rect(c, x, y + h / 2 - 6, x + w, y + h / 2 + 6, moldura, LW * .5)
    rect(c, x - 30, y + h + 10, x + w + 30, y + h + 30, moldura, LW * .7)
    if cortina:
        for sx, x0 in ((-1, x - 60), (1, x + w + 60)):
            cp = skia.Path(); cp.moveTo(x0, y - 40); cp.lineTo(x0 - sx * 90, y - 40); cp.cubicTo(x0 - sx * 40, y + h * .4, x0 - sx * 80, y + h * .8, x0 - sx * 50, y + h + 60)
            cp.lineTo(x0, y + h + 60); cp.close(); shape(c, cp, cortina, LW * .8)
            for k in (1, 2): line(c, x0 - sx * 22 * k, y - 30, x0 - sx * 18 * k, y + h + 50, 2.4, escurecer(cortina, .8))
        line(c, x - 170, y - 40, x + w + 170, y - 40, LW * 1.4, '#7A5A3C')
def _quadro(c, x, y, w, h, cores=('#F2C14E', '#E04E3A', '#3E6FA8'), moldura='#7A5A3C'):
    rect(c, x - 12, y - 12, x + w + 12, y + h + 12, moldura, LW * .7); rect(c, x, y, x + w, y + h, '#FFF6DC', LW * .4)
    c.drawCircle(x + w * .32, y + h * .4, min(w, h) * .22, fp(cores[0])); c.drawRect(skia.Rect(x + w * .5, y + h * .3, x + w * .85, y + h * .8), fp(cores[1]))
    c.drawRect(skia.Rect(x + w * .1, y + h * .7, x + w * .6, y + h * .85), fp(cores[2]))
def _planta(c, x, y, s=1.0, vaso='#C8742C'):
    for i, (a, L) in enumerate(((-60, 120), (-30, 150), (0, 165), (28, 145), (58, 115), (-80, 90), (80, 90))):
        rr_ = math.radians(a - 90); ex, ey = x + math.cos(rr_) * L * s, y - 60 * s + math.sin(rr_) * L * s
        lf = skia.Path(); lf.moveTo(x, y - 60 * s); lf.quadTo(x + (ex - x) * .3 - 26 * s, y - 60 * s + (ey - y + 60 * s) * .6, ex, ey)
        lf.quadTo(x + (ex - x) * .7 + 26 * s, y - 60 * s + (ey - y + 60 * s) * .4, x, y - 60 * s); shape(c, lf, '#2F8F57' if i % 2 else '#3DAA66', LW * .6)
    poly(c, [(x - 44 * s, y - 70 * s), (x + 44 * s, y - 70 * s), (x + 34 * s, y), (x - 34 * s, y)], vaso, LW * .8)
def _livros(c, x, y, n=8, seed=1):
    r = random.Random(seed); xx = x
    for i in range(n):
        w = r.uniform(18, 30); h = r.uniform(60, 92); cor = r.choice(['#B23A48', '#3E6FA8', '#2E7D6B', '#F2C14E', '#7A3B5E', '#C8742C', '#5B3E8C'])
        if r.random() < .15: c.save(); c.translate(xx + w, y); c.rotate(-14); rect(c, -w, -h, 0, 0, cor, LW * .45); c.restore(); xx += w + 14
        else: rect(c, xx, y - h, xx + w, y, cor, LW * .45); c.drawLine(xx + 4, y - h + 14, xx + w - 4, y - h + 14, ink(2, '#FFF6DC', 140)); xx += w + 2
    return xx
def _prateleira(c, x, y, w, seed=1, madeira='#9A6A3E'):
    _livros(c, x + 16, y, int(w // 34), seed); rect(c, x, y, x + w, y + 18, madeira, LW * .7)
    for sx in (x + 30, x + w - 46): poly(c, [(sx, y + 18), (sx + 16, y + 18), (sx + 16, y + 44)], escurecer(madeira, .8), LW * .5)
def _relogio(c, x, y, r=46, t=0):
    circ(c, x, y, r + 8, '#3B4660', LW * .8); circ(c, x, y, r, '#FFF6DC', LW * .5)
    for i in range(12): a = math.radians(i * 30); c.drawCircle(x + math.cos(a) * r * .8, y + math.sin(a) * r * .8, 3, fp(INK))
    a = math.radians(t * 6 - 90); line(c, x, y, x + math.cos(a) * r * .75, y + math.sin(a) * r * .75, 3)
    line(c, x, y, x + r * .45, y - r * .2, 5)
def _luminaria_teto(c, x, y, cor='#F2C14E'):
    line(c, x, -700, x, y - 60, 6); sh = skia.Path(); sh.moveTo(x - 70, y); sh.cubicTo(x - 60, y - 70, x + 60, y - 70, x + 70, y); sh.close(); shape(c, sh, cor, LW * .8)
    c.drawOval(skia.Rect(x - 40, y - 8, x + 40, y + 12), fp('#FFF3B8'))
def _mesa(c, x0, x1, y, alt=150, cor='#9A6A3E'):  # mesa com tampo em y, pés até y+alt
    rect(c, x0, y, x1, y + 22, cor, LW * .8)
    for xx in (x0 + 22, x1 - 42): rect(c, xx, y + 22, xx + 20, y + alt, escurecer(cor, .8), LW * .6)
def _monitor(c, x, y, w=220, h=140, t=0, tela='#2A3670'):
    rect(c, x - 18, y + h + 4, x + 18, y + h + 34, '#3B4660', LW * .6); rect(c, x - 60, y + h + 30, x + 60, y + h + 42, '#3B4660', LW * .6)
    rect(c, x - w / 2, y, x + w / 2, y + h, '#1C1F2E', LW * .8, r=10); rect(c, x - w / 2 + 12, y + 12, x + w / 2 - 12, y + h - 12, tela, 0, r=4)
    for i in range(5):  # gráfico subindo
        bh = 18 + i * 14 + 6 * math.sin(t * 2 + i); c.drawRect(skia.Rect(x - w / 2 + 30 + i * 34, y + h - 22 - bh, x - w / 2 + 52 + i * 34, y + h - 22), fp('#3DFF8F' if i == 4 else '#8FC8EE'))
def _luz_interna(c, pts, amb='#6A6FB0'):
    night(c, [('pool', x, y, r, a) for (x, y, r, a) in pts], amb)


def _escritorio(c, t):
    _parede(c, '#DCE6F2', '#C3D2E6'); _janela(c, 180, 150, 420, 400, t, cidade=True)
    _quadro(c, 760, 210, 200, 140); _relogio(c, 1120, 210, t=t)
    rect(c, 1300, 150, 1760, 470, '#FFFFFF', LW * .8, r=8)  # quadro branco com gráfico
    pg = skia.Path(); pg.moveTo(1340, 430)
    for i, v in enumerate((380, 400, 340, 350, 280, 300, 220)): pg.lineTo(1340 + i * 64, v)
    c.drawPath(pg, ink(7, '#2FA25E')); line(c, 1340, 440, 1730, 440, 3); line(c, 1340, 440, 1340, 190, 3)
    _rodape(c, '#3B4660'); _piso(c, '#8E9AB0', '#6D7990', 'tapete')
    _mesa(c, 1180, 1820, 720, 230, '#B9874F'); _monitor(c, 1500, 550, t=t); _planta(c, 120, 900, 1.0)
    rect(c, 1240, 660, 1380, 720, '#E04E3A', LW * .6, r=6)  # pasta
def _sala(c, t):
    _parede(c, '#F2D9B8', '#E5C49B'); _janela(c, 1260, 170, 360, 360, t, cortina='#B23A48')
    _quadro(c, 300, 200, 260, 180, ('#2E7D6B', '#F2C14E', '#B23A48')); _quadro(c, 640, 240, 140, 140, ('#3E6FA8', '#E04E3A', '#F2C14E'))
    _rodape(c); _piso(c, '#B9874F', '#8E6338', 'madeira')
    c.drawOval(skia.Rect(260, 900, 1660, 1060), fp('#7A3B5E')); c.drawOval(skia.Rect(320, 920, 1600, 1040), fp('#9A4E76'))
    # sofá
    rect(c, 160, 600, 900, 820, '#3E6FA8', LW, r=40); rect(c, 120, 680, 220, 860, '#355F94', LW, r=30); rect(c, 840, 680, 940, 860, '#355F94', LW, r=30)
    rect(c, 200, 720, 880, 830, '#4A7FBC', LW * .8, r=20); line(c, 540, 720, 540, 830, LW * .6)
    for xx in (180, 860): rect(c, xx, 850, xx + 26, 890, '#5B3E2C', LW * .5)
    rect(c, 280, 640, 400, 730, '#F2C14E', LW * .7, r=20)  # almofada
    line(c, 1780, 820, 1780, 420, 8); poly(c, [(1720, 420), (1840, 420), (1810, 330), (1750, 330)], '#F4EFE2', LW * .8); _planta(c, 1060, 840, .9)
def _cozinha(c, t):
    _parede(c, '#E8F1EC', '#D3E4DA')
    c.save(); c.clipRect(skia.Rect(-900, 380, W + 900, 610))  # azulejos
    for i in range(-20, 50):
        for j in range(5): rect(c, i * 60 + (j % 2) * 30, 380 + j * 48, i * 60 + (j % 2) * 30 + 58, 380 + j * 48 + 46, '#BFE3F6' if (i + j) % 3 else '#8FC8EE', 1.6)
    c.restore()
    for x in range(-240, 1300, 230): rect(c, x, 90, x + 220, 340, '#F4EFE2', LW * .8, r=8); rect(c, x + 96, 290, x + 126, 300, '#B9874F', 0)
    _janela(c, 1500, 120, 300, 260, t)
    _rodape(c, '#2E7D6B'); _piso(c, '#E6DBB8', '#C9BC92', 'ladrilho')
    rect(c, -200, 610, 1480, 680, '#F4EFE2', LW, r=6); rect(c, -200, 680, 1480, 900, '#2E7D6B', LW)
    for x in range(-180, 1480, 240): rect(c, x, 700, x + 220, 880, '#358C78', LW * .6, r=6); rect(c, x + 96, 720, x + 126, 732, '#F4EFE2', 0)
    oval(c, 480, 560, 640, 616, '#3B4660', LW * .8); rect(c, 486, 520, 634, 600, '#B23A48', LW * .8, r=12)  # panela
    for i in range(3): s_ = skia.Path(); x0 = 520 + i * 40; s_.moveTo(x0, 500); s_.cubicTo(x0 - 16, 470 - 6 * math.sin(t * 3 + i), x0 + 16, 450, x0, 420); c.drawPath(s_, ink(4, '#FFFFFF', 150))
    rect(c, 1560, 380, 1860, 900, '#DADDE6', LW, r=24); line(c, 1560, 560, 1860, 560, LW * .7); rect(c, 1590, 440, 1606, 520, '#8A8A92', 0); rect(c, 1590, 600, 1606, 700, '#8A8A92', 0)
    _planta(c, 1280, 612, .55, '#E04E3A')
def _quarto(c, t):
    _parede(c, '#D9CCF2', '#C2B2E6'); _janela(c, 1340, 170, 340, 330, t, cortina='#F2C14E')
    for i, (x, y, cor) in enumerate(((240, 200, '#E04E8A'), (420, 240, '#3E6FA8'))): rect(c, x, y, x + 140, y + 190, cor, LW * .7); c.drawCircle(x + 70, y + 80, 40, fp('#FFF6DC')); line(c, x + 20, y + 160, x + 120, y + 160, 5, '#FFF6DC')
    _rodape(c); _piso(c, '#B9874F', '#8E6338', 'madeira'); c.drawOval(skia.Rect(500, 940, 1500, 1060), fp('#5B8DD6'))
    rect(c, 600, 420, 1180, 640, '#7A5A3C', LW, r=24)  # cabeceira
    rect(c, 580, 620, 1220, 820, '#F4EFE2', LW, r=20); rect(c, 580, 700, 1220, 840, '#5B3E8C', LW, r=16); rect(c, 640, 600, 860, 680, '#FFFFFF', LW * .7, r=26)
    for xx in (600, 1180): rect(c, xx, 830, xx + 24, 870, '#5B3E2C', LW * .5)
    rect(c, 1240, 660, 1400, 840, '#9A6A3E', LW); line(c, 1240, 740, 1400, 740, LW * .6); circ(c, 1320, 700, 8, GOLD, 2)
    line(c, 1320, 660, 1320, 560, 6); poly(c, [(1270, 560), (1370, 560), (1350, 490), (1290, 490)], '#F2C14E', LW * .8)
    _prateleira(c, 140, 560, 300, seed=3)
def _sala_aula(c, t):
    _parede(c, '#F2E3B8', '#E5D19B'); rect(c, 380, 140, 1540, 600, '#2F5E46', LW * 1.2, r=6); rect(c, 360, 600, 1560, 626, '#9A6A3E', LW * .8)
    for (x0, y0, x1, y1) in ((440, 220, 700, 220), (440, 280, 640, 280), (440, 340, 680, 340)): line(c, x0, y0, x1, y1, 5, '#F4EFE2')
    pg = skia.Path(); pg.moveTo(900, 520); pg.lineTo(1000, 440); pg.lineTo(1090, 480); pg.lineTo(1220, 300); c.drawPath(pg, ink(6, '#F2C14E'))
    c.drawCircle(1360, 330, 80, ink(5, '#F4EFE2')); line(c, 1360, 250, 1360, 410, 4, '#F4EFE2'); line(c, 1280, 330, 1440, 330, 4, '#F4EFE2')
    _relogio(c, 1720, 200, t=t); _rodape(c, '#7A5A3C'); _piso(c, '#C9BC92', '#A89A70', 'ladrilho')
    for x in (60, 1640): _mesa(c, x, x + 260, 700, 160, '#C8742C'); rect(c, x + 60, 640, x + 200, 700, '#3E6FA8', LW * .6, r=6)
    _prateleira(c, 40, 380, 280, seed=5)
def _consultorio(c, t):
    _parede(c, '#E6F6F4', '#C8EAE6'); c.drawRect(skia.Rect(-900, 520, W + 900, PISO), fp('#A6DCD6'))
    rect(c, 240, 160, 400, 320, '#FFFFFF', LW * .8, r=16); rect(c, 300, 180, 340, 300, '#E04E3A', 0); rect(c, 260, 220, 380, 260, '#E04E3A', 0)
    rect(c, 1380, 140, 1640, 460, '#FFFFFF', LW * .8, r=8)  # cartaz de exame
    for i, w_ in enumerate((180, 140, 100, 70, 44)): line(c, 1510 - w_ / 2, 190 + i * 56, 1510 + w_ / 2, 190 + i * 56, 16 - i * 2.4, '#3B4660')
    _rodape(c, '#2E7D6B'); _piso(c, '#DCE6F2', '#B7C6DC', 'ladrilho')
    rect(c, 620, 600, 1220, 680, '#2FA8A0', LW, r=20); rect(c, 620, 560, 760, 610, '#FFFFFF', LW * .7, r=20)
    for xx in (660, 1160): rect(c, xx, 680, xx + 20, 840, '#8A8A92', LW * .6)
    rect(c, 1700, 520, 1880, 860, '#F4F4F0', LW); line(c, 1700, 690, 1880, 690, LW * .6); _planta(c, 140, 860, .9, '#2E7D6B')
def _loja(c, t):
    _parede(c, '#FCE7D2', '#F4D2B0')
    for (y0) in (230, 420, 610):
        rect(c, 60, y0, 860, y0 + 16, '#9A6A3E', LW * .6); r = random.Random(y0)
        for i in range(12):
            x = 80 + i * 64; h = r.uniform(60, 130); cor = r.choice(['#E04E3A', '#3E6FA8', '#F2C14E', '#2E7D6B', '#E04E8A', '#5B3E8C'])
            rect(c, x, y0 - h, x + 52, y0, cor, LW * .45, r=6); c.drawRect(skia.Rect(x + 8, y0 - h * .6, x + 44, y0 - h * .35), fp('#FFF6DC', 200))
    rect(c, 1100, 120, 1760, 230, '#E04E3A', LW, r=14); label(c, 'OFERTAS', 1430, 200, 76, '#FFF6DC', MARKER, 'center')
    _rodape(c, '#B23A48'); _piso(c, '#E6DBB8', '#C9BC92', 'ladrilho')
    rect(c, 1120, 560, 1800, 860, '#2E7D6B', LW, r=10); rect(c, 1100, 540, 1820, 580, '#F4EFE2', LW, r=8)
    rect(c, 1520, 420, 1720, 540, '#3B4660', LW, r=10); rect(c, 1550, 440, 1690, 490, '#8FFFC0', LW * .5, r=4); label(c, '49,90', 1620, 482, 38, '#18402A', KALAM, 'center')
    rect(c, 1240, 470, 1400, 540, '#F2C14E', LW * .7, r=8)
def _banco(c, t):
    _parede(c, '#EDE6D6', '#D9CFB8')
    for x in (120, 620, 1300, 1800):
        rect(c, x - 60, 120, x + 60, PISO - 26, '#F4EFE2', LW); [line(c, x + d, 150, x + d, PISO - 56, 2.4, '#CFC6AE') for d in (-30, 0, 30)]
        rect(c, x - 80, 100, x + 80, 140, '#E5DCC4', LW * .8); rect(c, x - 80, PISO - 56, x + 80, PISO - 26, '#E5DCC4', LW * .8)
    rect(c, 760, 120, 1160, 220, '#1F4E79', LW, r=10); label(c, 'BANCO', 960, 196, 72, '#F2C14E', MARKER, 'center')
    circ(c, 960, 470, 170, '#9AA3B5', LW * 1.2); circ(c, 960, 470, 130, '#B9C1D0', LW * .8)  # cofre
    for i in range(6): a = math.radians(i * 60 + t * 20); line(c, 960, 470, 960 + math.cos(a) * 90, 470 + math.sin(a) * 90, 10, '#5D6678')
    circ(c, 960, 470, 34, '#5D6678', LW * .7)
    _rodape(c, '#5D6678'); _piso(c, '#D9CFB8', '#B8AC8E', 'ladrilho')
    rect(c, -200, 640, 560, 880, '#7A5A3C', LW); rect(c, -220, 620, 580, 650, '#F4EFE2', LW)
    rect(c, 1360, 640, 2100, 880, '#7A5A3C', LW); rect(c, 1340, 620, 2120, 650, '#F4EFE2', LW)
def _arvore(c, x, y, s=1.0, cor='#3DAA66'):
    rect(c, x - 18 * s, y - 200 * s, x + 18 * s, y, '#7A5A3C', LW * .8)
    p = skia.Path()
    for dx, dy, r in ((-70, -230, 80), (0, -300, 95), (70, -230, 80), (-30, -200, 70), (40, -190, 70)): p.addCircle(x + dx * s, y + dy * s, r * s)
    c.drawPath(p, ink(LW * 2)); c.drawPath(p, fp(cor))
    for dx, dy in ((-40, -280), (30, -320), (60, -240)): c.drawCircle(x + dx * s, y + dy * s, 16 * s, fp(clarear(cor, .3) if not _noite() else escurecer(cor, .8)))
def _parque(c, t):
    sky(c, '#0A1136', '#26358C', 700); stars(c, t); moon(c, 1560, 160, 40); cloud(c, 500 + t * 8, 200, 1.1, '#FFFFFF' if not _noite() else '#2C3B80')
    for (x, r, cor) in ((300, 700, '#5FAF5A'), (1400, 820, '#4E9E4A')):
        c.drawCircle(x, 760 + r * .8, r, fp(cor if not _noite() else escurecer(cor, .55)))
    c.drawRect(skia.Rect(-900, 760, W + 900, H + 700), fp('#6CC06A' if not _noite() else '#3C6E44')); line(c, -900, 760, W + 900, 760, LW * .6)
    pth = skia.Path(); pth.moveTo(700, 760); pth.lineTo(1100, 760); pth.lineTo(1500, H + 200); pth.lineTo(300, H + 200); pth.close(); c.drawPath(pth, fp('#E6D3A3' if not _noite() else '#9C8E6E'))
    _arvore(c, 180, 800, 1.1); _arvore(c, 1680, 790, 1.0, '#2F8F57'); _arvore(c, 560, 770, .6)
    rect(c, 1240, 700, 1560, 730, '#B9874F', LW * .8, r=4); rect(c, 1240, 650, 1560, 680, '#B9874F', LW * .8, r=4)
    for xx in (1260, 1520): rect(c, xx, 730, xx + 20, 800, '#3B4660', LW * .6)
    for i, (x, y) in enumerate(((420, 900), (1700, 960), (900, 1000))): [circ(c, x + dx, y, 9, cor_, 2) for dx, cor_ in ((0, '#F2C14E'), (22, '#E04E8A'), (44, '#FFFFFF'))]
    if _noite(): street_lamp(c, 1000, 762, 400)
def _praia(c, t):
    sky(c, '#0A1136', '#3A4A9C', 600); stars(c, t); moon(c, 1460, 200, 60)
    mar = '#2FA8D8' if not _noite() else '#1E3C7A'
    c.drawRect(skia.Rect(-900, 560, W + 900, 820), fp(mar)); line(c, -900, 560, W + 900, 560, LW * .6)
    for j in range(4):
        y = 600 + j * 52; p = skia.Path(); p.moveTo(-900, y)
        for x in range(-900, W + 960, 60): p.quadTo(x + 15, y - 10 + 3 * math.sin(t * 2 + j), x + 30, y); p.quadTo(x + 45, y + 10, x + 60, y)
        c.drawPath(p, ink(3, '#FFFFFF', 150))
    sd = skia.Path(); sd.moveTo(-900, 820); sd.lineTo(W + 900, 780); sd.lineTo(W + 900, H + 700); sd.lineTo(-900, H + 700); sd.close(); c.drawPath(sd, fp('#F2D8A0' if not _noite() else '#A8956C'))
    p = skia.Path(); p.moveTo(-900, 820)
    for x in range(-900, W + 960, 120): p.quadTo(x + 60, 836 - (x + 900) * .02, x + 120, 820 - (x + 1020) * 40 / 2700)
    c.drawPath(p, ink(10, '#FFFFFF', 180))
    # coqueiro
    tr = skia.Path(); tr.moveTo(1640, 960); tr.cubicTo(1620, 760, 1660, 560, 1740, 380); c.drawPath(tr, ink(46)); c.drawPath(tr, ink(34, '#9A6A3E'))
    for a in (-160, -120, -60, -20, 30):
        r_ = math.radians(a); lf = skia.Path(); lf.moveTo(1740, 380); ex, ey = 1740 + math.cos(r_) * 240, 380 + math.sin(r_) * 120 + 90
        lf.quadTo((1740 + ex) / 2, 300 + (ey - 380) * .2 - 40, ex, ey); lf.quadTo((1740 + ex) / 2, 380 + (ey - 380) * .5, 1740, 380); shape(c, lf, '#2F8F57', LW * .7)
    for i in range(2): circ(c, 1726 + i * 26, 400, 18, '#7A5A3C', LW * .6)
    # guarda-sol
    line(c, 300, 1000, 330, 640, 8); um = skia.Path(); um.moveTo(130, 700); um.cubicTo(180, 540, 460, 520, 540, 660); um.close(); shape(c, um, '#E04E3A', LW)
    c.save(); c.clipPath(um, doAntiAlias=True); [c.drawRect(skia.Rect(x, 500, x + 50, 720), fp('#FFF6DC')) for x in (200, 300, 400)]; c.restore(); c.drawPath(um, ink(LW))
def _tech(c, t):
    c.drawRect(skia.Rect(-900, -700, W + 900, PISO), sp(linear(0, 0, 0, PISO, [hx('#1B1440'), hx('#2C2068')])))
    for i in range(-10, 30): line(c, i * 120, -700, i * 120, PISO, 1.4, '#3A2E80')
    for x in (60, 300, 1620):  # racks de servidor
        rect(c, x, 200, x + 200, PISO - 10, '#151231', LW)
        for j in range(9):
            rect(c, x + 16, 230 + j * 60, x + 184, 270 + j * 60, '#221D4A', LW * .4, r=4)
            for k in range(3): c.drawCircle(x + 40 + k * 18, 250 + j * 60, 5, fp(('#3DFF8F', '#2FA8FF', '#C9B6FF')[(j + k + int(t * 3)) % 3] if (j * 7 + k + int(t * 4)) % 5 else '#3B3570'))
    rect(c, 640, 150, 1500, 600, '#0E0B26', LW * 1.2, r=16); rect(c, 670, 180, 1470, 570, '#14103A', 0, r=8)
    for i in range(7): line(c, 710, 230 + i * 44, 710 + 120 + (i * 137) % 380, 230 + i * 44, 10, ('#3DFF8F', '#2FA8FF', '#C9B6FF')[i % 3], 220)
    pg = skia.Path(); pg.moveTo(1150, 520)
    for i, v in enumerate((480, 500, 430, 450, 360, 380, 260)): pg.lineTo(1150 + i * 46, v - 6 * math.sin(t * 2 + i))
    c.drawPath(pg, ink(7, '#3DFF8F'))
    c.drawRect(skia.Rect(640, 590, 1500, 610), fp('#8C5CF0', 120, blur=12))
    c.drawRect(skia.Rect(-900, PISO, W + 900, H + 700), sp(linear(0, PISO, 0, H, [hx('#2A1F5E'), hx('#140E33')])))
    for i in range(-14, 15): line(c, 960 + i * 90, PISO, 960 + i * 260, H + 300, 1.6, '#4A3C9C')
    line(c, -900, PISO, W + 900, PISO, LW * .6, '#8C5CF0')
def _cidade(c, t):
    sky(c, '#0A1136', '#26358C', 760); stars(c, t); moon(c, 1500, 150, 36); cloud(c, 700 + t * 8, 220, 1.0, '#FFFFFF' if not _noite() else '#2C3B80')
    blur_begin(c, 2.0); far_city(c, 660, 8, '#1E2A68' if _noite() else '#8FA6CC'); c.restore()
    for (x, w, h, sd) in ((-90, 300, 500, 21), (210, 240, 410, 22), (1180, 250, 380, 23), (1660, 250, 400, 24), (1900, 260, 470, 25)):
        if _noite(): building(c, x, w, h, 760, sd, lit=.34, body='#222E66', dim='#2C3A80')
        else: building(c, x, w, h, 760, sd, lit=.0, body='#E8B48A' if sd % 2 else '#9CB8D8', roof='#7A5A3C', dim='#CDE6F6')
    c.drawRect(skia.Rect(-900, 760, W + 900, 840), fp('#9A9AA8' if not _noite() else '#444B70')); line(c, -900, 760, W + 900, 760, LW); line(c, -900, 840, W + 900, 840, LW)
    c.drawRect(skia.Rect(-900, 840, W + 900, H + 600), fp('#6A6E80' if not _noite() else '#30365A'))
    for x in range(-200, W + 200, 260): c.drawRect(skia.Rect(x, 950, x + 140, 966), fp('#F4EFE2', 200))
    street_lamp(c, 560, 842, 330)

CENARIOS = {'escritorio': _escritorio, 'sala': _sala, 'cozinha': _cozinha, 'quarto': _quarto, 'sala_aula': _sala_aula, 'consultorio': _consultorio,
            'loja': _loja, 'banco': _banco, 'parque': _parque, 'praia': _praia, 'tech': _tech, 'cidade': _cidade}
# luzes de cada cenário no estilo noturno (no estilo de dia não escurece nada)
_LUZES = {'escritorio': [(390, 350, 420, .7), (1500, 600, 520, .85), (960, 900, 900, .6)], 'sala': [(1780, 380, 520, .9), (560, 760, 700, .6), (1440, 350, 380, .6)],
          'cozinha': [(560, 500, 560, .8), (1650, 250, 380, .6), (960, 900, 800, .5)], 'quarto': [(1320, 520, 560, .9), (1500, 330, 360, .6), (800, 900, 700, .4)],
          'sala_aula': [(960, 380, 900, .75), (960, 900, 900, .5)], 'consultorio': [(960, 300, 1000, .8), (960, 900, 900, .6)], 'loja': [(500, 400, 700, .7), (1460, 500, 700, .8)],
          'banco': [(960, 400, 900, .8), (960, 900, 900, .5)], 'parque': [(1000, 500, 520, .9), (860, 820, 560, .55)], 'praia': [(1460, 300, 600, .6), (860, 800, 620, .6)], 'tech': [(1070, 380, 800, .8), (960, 900, 900, .5)],
          'cidade': [(560, 700, 600, .9)]}
TEMAS = {  # tema do vídeo -> cenários que combinam (o primeiro é o principal)
    'financas': ['escritorio', 'banco', 'loja', 'sala'], 'golpe': ['cidade', 'escritorio', 'banco', 'loja'], 'tecnologia': ['tech', 'escritorio', 'sala', 'quarto'],
    'ia': ['tech', 'escritorio', 'sala_aula', 'quarto'], 'educacao': ['sala_aula', 'quarto', 'sala'], 'saude': ['consultorio', 'cozinha', 'parque'],
    'alimentacao': ['cozinha', 'loja', 'sala'], 'familia': ['sala', 'cozinha', 'quarto', 'parque'], 'motivacao': ['parque', 'praia', 'escritorio'],
    'humor': ['sala', 'cozinha', 'parque', 'loja'], 'triste': ['quarto', 'sala', 'cidade'], 'historia': ['cidade', 'parque', 'sala'], 'misterio': ['cidade', 'tech', 'quarto'],
    'viagem': ['praia', 'cidade', 'parque'], 'trabalho': ['escritorio', 'tech', 'loja'], 'compras': ['loja', 'cidade', 'banco'], 'relacionamento': ['sala', 'parque', 'praia', 'cozinha'],
    'esporte': ['parque', 'praia'], 'infantil': ['quarto', 'parque', 'sala_aula'], 'casa': ['sala', 'cozinha', 'quarto']}
def cenario(c, nome, t=0.0, luz=True):
    """Desenha um cenário pronto (fundo inteiro). luz=False deixa para chamar cenario_luz() depois dos personagens."""
    CENARIOS[nome](c, t)
    if luz: cenario_luz(c, nome)
def cenario_luz(c, nome):  # escurece o cenário no estilo noturno, com poças de luz (chame depois dos personagens para iluminá-los junto)
    _luz_interna(c, _LUZES.get(nome, [(960, 540, 900, .6)]), '#5A69B6' if nome in ('cidade', 'parque', 'praia') else '#7C7FC4')
def cenario_fundo(c, nome, t=0.0, dx=0, desfoque=13):  # fundo desfocado para closes (como fundo_close)
    blur_begin(c, desfoque); c.save(); c.translate(dx, -260); c.scale(1.5, 1.5); cenario(c, nome, t, luz=False); c.restore(); c.restore()
    cenario_luz(c, nome)
def cenarios_do_tema(tema):
    t = tema.lower()
    for k, v in TEMAS.items():
        if k in t: return v
    return ['sala', 'escritorio', 'cidade']


if __name__ == '__main__':  # python3 kit.py elenco roteiro.json saida.png
    import sys
    if len(sys.argv) > 3 and sys.argv[1] == 'elenco': print(folha_elenco(sys.argv[2], sys.argv[3]))
```

### arquivo: cabelos_gen.py

```python
"""Gera cabelos.json: penteados em camadas, usados igual pelo Python (kit.py) e pelo editor (JS).
Coordenadas da cabeça: centro (0,0), raio R=100, y para baixo. Olhos em y=-6, sobrancelhas ~-35, boca 42.
Camada: d (M L C Q Z O), f (preenchimento: h/hs/hl/band), s (traço: hs/hl/ink), w (largura relativa; 0 = sem contorno),
a (opacidade 0-1), kf (desloca x por face*kf), esp (espelha quando olha para a esquerda), clip ('cabeca'), alto (some com chapéu/boné).
Grupos: tras (antes do corpo), nuca (antes de pintar o rosto), frente (depois do contorno da cabeça)."""
import json, math
R = 100


class D:
    def __init__(self): self.t = []
    def _n(self, *v): self.t += [f'{x:.1f}'.rstrip('0').rstrip('.') if isinstance(x, float) else str(x) for x in v]; return self
    def M(self, x, y): self.t.append('M'); return self._n(x, y)
    def L(self, x, y): self.t.append('L'); return self._n(x, y)
    def C(self, a, b, c, d, e, f): self.t.append('C'); return self._n(a, b, c, d, e, f)
    def Q(self, a, b, c, d): self.t.append('Q'); return self._n(a, b, c, d)
    def Z(self): self.t.append('Z'); return self
    def O(self, cx, cy, rx, ry): self.t.append('O'); return self._n(cx, cy, rx, ry)
    def arc(self, cx, cy, rx, ry, a0, a1, move=False):
        n = max(1, math.ceil(abs(a1 - a0) / 90)); da = (a1 - a0) / n
        p = lambda a: (cx + rx * math.cos(math.radians(a)), cy + ry * math.sin(math.radians(a)))
        if move: self.M(*p(a0))
        k = 4 / 3 * math.tan(math.radians(da) / 4)
        for i in range(n):
            b0, b1 = math.radians(a0 + i * da), math.radians(a0 + (i + 1) * da)
            x0, y0 = cx + rx * math.cos(b0), cy + ry * math.sin(b0); x1, y1 = cx + rx * math.cos(b1), cy + ry * math.sin(b1)
            self.C(x0 - k * rx * math.sin(b0), y0 + k * ry * math.cos(b0), x1 + k * rx * math.sin(b1), y1 - k * ry * math.cos(b1), x1, y1)
        return self
    def __str__(self): return ' '.join(self.t)


def lay(d, **k): k['d'] = str(d); return k


def massa(rx=R + 5, ry=R + 12, cy=0, a0=184, a1=356, hairline=None):
    """Volume do cabelo: contorno externo (elipse) da têmpora esquerda até a direita, depois a linha do cabelo de volta.
    hairline: lista de comandos ('L', x, y) / ('C', ...) / ('Q', ...) partindo do fim do arco e terminando perto do início."""
    d = D().arc(0, cy, rx, ry, a0, a1, move=True)
    for cmd in hairline: getattr(d, cmd[0])(*cmd[1:])
    return d.Z()


def fios(*curvas, cor='hs', w=.5, a=1.0, **k):  # traços de mechas (cada curva: lista de pontos para M/Q/C)
    out = []
    for cv in curvas:
        d = D().M(*cv[0])
        if len(cv) == 2: d.L(*cv[1])
        elif len(cv) == 3: d.Q(*cv[1], *cv[2])
        else: d.C(*cv[1], *cv[2], *cv[3])
        out.append(lay(d, s=cor, w=w, a=a, **k))
    return out


def brilho(a0=200, a1=236, r=R - 14, cy=0, w=1.6, a=.55, **k):  # reflexo de luz (lado esquerdo, de onde vem a luz)
    return lay(D().arc(0, cy, r, r, a0, a1, move=True), s='hl', w=w, a=a, **k)


E = {}

# ======================= MASCULINOS =======================
# short: corte moderno texturizado, franja curta caída para o lado
lh = [('L', 99, 10), ('L', 89, 12), ('C', 88, -16, 80, -36, 66, -48),
      ('C', 52, -58, 30, -56, 14, -62), ('L', 4, -54), ('C', -14, -62, -34, -58, -44, -66), ('L', -50, -56),
      ('C', -64, -54, -82, -40, -88, -16), ('L', -89, 12), ('L', -99, 10)]
E['short'] = {'frente': [lay(massa(R + 5, R + 13, 0, 184, 356, lh), f='h', esp=1),
                         *fios([(-40, -66), (-30, -92), (-8, -104)], [(0, -58), (12, -84), (34, -100)], [(30, -58), (46, -80), (64, -88)], esp=1),
                         brilho(214, 246, R - 12)]}

# degrade: laterais bem curtas (transparentes) + topo com volume penteado para trás/lado
lados = massa(R + 2, R + 4, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -10, 84, -30, 74, -44), ('L', -74, -44), ('C', -84, -30, -88, -10, -90, 14), ('L', -99, 12)])
topo = D().M(-76, -42).C(-88, -84, -50, -122, 4, -120).C(56, -122, 92, -88, 78, -40).C(60, -56, 40, -62, 20, -60).C(0, -70, -30, -62, -44, -56).C(-56, -50, -68, -46, -76, -42).Z()
E['degrade'] = {'frente': [lay(lados, f='h', a=.42, w=0), lay(topo, f='h', esp=1),
                           *fios([(-30, -64), (-10, -96), (24, -110)], [(10, -64), (30, -92), (60, -96)], esp=1), brilho(222, 250, R - 6)]}

# slick: risca lateral, penteado para o lado com volume
lh = [('L', 99, 8), ('L', 90, 10), ('C', 88, -20, 82, -42, 68, -54), ('C', 40, -70, 0, -70, -36, -58),
      ('C', -60, -50, -82, -32, -88, -10), ('L', -89, 10), ('L', -99, 8)]
E['slick'] = {'frente': [lay(massa(R + 6, R + 16, 0, 184, 356, lh), f='h', esp=1),
                         *fios([(-44, -62), (-42, -90), (-36, -110)], cor='hs', w=.7, esp=1),  # risca
                         *fios([(-30, -64), (10, -104), (70, -84)], [(-10, -64), (30, -92), (82, -60)], [(-38, -82), (0, -114), (56, -104)], esp=1),
                         brilho(232, 262, R - 4, w=1.8)]}

# topete: topete moderno (quiff) com laterais baixas
lados = massa(R + 2, R + 4, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -10, 84, -30, 74, -46), ('L', -74, -46), ('C', -84, -30, -88, -10, -90, 14), ('L', -99, 12)])
qf = D().M(-78, -40).C(-92, -92, -56, -126, -6, -124).C(18, -150, 70, -150, 92, -118).C(104, -100, 96, -70, 80, -54)
qf.C(70, -74, 50, -82, 30, -76).C(14, -80, 0, -70, -12, -66).C(-40, -60, -62, -52, -78, -40).Z()
E['topete'] = {'frente': [lay(lados, f='h', a=.42, w=0), lay(qf, f='h', esp=1, alto=1),
                          *fios([(-40, -64), (-10, -108), (40, -128)], [(-6, -72), (30, -112), (78, -118)], [(30, -80), (60, -100), (88, -98)], esp=1, alto=1),
                          brilho(226, 262, R + 2, cy=-14, w=1.8, alto=1)]}

# espetado: mechas texturizadas apontando para cima (gel), arredondadas
d = D().M(-99, 8).L(-90, 10).C(-86, -20, -76, -40, -60, -52)
d.C(-40, -46, -26, -64, -10, -58).C(6, -52, 24, -64, 40, -56).C(54, -50, 66, -54, 74, -46).C(84, -32, 88, -12, 90, 10).L(99, 8)
d.C(104, -20, 106, -48, 102, -64).Q(116, -86, 100, -96).C(98, -116, 82, -126, 70, -124).Q(70, -150, 44, -146).C(30, -158, 6, -158, -6, -144)
d.Q(-26, -156, -44, -138).C(-64, -142, -82, -130, -82, -112).Q(-104, -104, -98, -80).C(-110, -60, -108, -26, -99, 8).Z()
E['espetado'] = {'frente': [lay(d, f='h', esp=1, alto=1),
                            *fios([(-60, -64), (-62, -96), (-70, -118)], [(-26, -70), (-22, -110), (-12, -136)], [(14, -68), (24, -108), (40, -134)], [(48, -64), (64, -96), (84, -108)], esp=1, alto=1),
                            brilho(220, 250, R - 4)]}

# moicano: laterais raspadas + crista central moderna (faux-hawk)
lados = massa(R + 2, R + 4, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -10, 84, -30, 74, -46), ('L', -74, -46), ('C', -84, -30, -88, -10, -90, 14), ('L', -99, 12)])
cr = D().M(-36, -60).C(-50, -100, -40, -128, -20, -132).Q(-14, -158, 6, -152).Q(24, -166, 34, -142).Q(56, -140, 50, -112).C(54, -86, 44, -68, 36, -58).C(14, -66, -14, -66, -36, -60).Z()
E['moicano'] = {'frente': [lay(lados, f='h', a=.42, w=0), lay(cr, f='h', kf=8, alto=1),
                           *fios([(-20, -70), (-18, -110), (-6, -140)], [(10, -70), (16, -110), (28, -136)], kf=8, alto=1)]}

# curly: cachos no topo com laterais baixas
lados = massa(R + 2, R + 4, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -10, 84, -30, 76, -44), ('L', -76, -44), ('C', -84, -30, -88, -10, -90, 14), ('L', -99, 12)])
cc = []
for (x, y, r) in ((-70, -60, 24), (-58, -92, 27), (-28, -114, 28), (6, -122, 29), (40, -114, 28), (66, -90, 27), (76, -58, 24),
                  (-36, -72, 24), (-6, -80, 25), (26, -76, 25), (52, -66, 22), (-14, -100, 26), (22, -100, 26)):
    cc.append(lay(D().O(x, y, r, r), f='h', alto=1))
E['curly'] = {'frente': [lay(lados, f='h', a=.42, w=0), *cc,
                         *[lay(D().arc(x, y, r * .55, r * .55, 200, 320, move=True), s='hs', w=.5, alto=1) for (x, y, r) in ((-58, -92, 27), (6, -122, 29), (66, -90, 27), (-6, -80, 25), (40, -114, 28))]]}

# afro: volume redondo e macio
af = D()
n = 22
for i in range(n + 1):
    a = math.radians(i * 360 / n); rr = R * 1.3 + (6 if i % 2 else 0)
    x, y = rr * math.cos(a), -22 + rr * .98 * math.sin(a)
    if i == 0: af.M(x, y)
    else:
        am = math.radians((i - .5) * 360 / n); rm = R * 1.36
        af.Q(rm * math.cos(am), -22 + rm * .98 * math.sin(am), x, y)
af.Z()
lh = D().M(-110, 20).C(-110, -60, -60, -120, 0, -120).C(60, -120, 110, -60, 110, 20).L(92, 22)
lh.C(90, -14, 80, -40, 60, -54).C(30, -70, -30, -70, -60, -54).C(-80, -40, -90, -14, -92, 22).Z()
E['afro'] = {'tras': [lay(af, f='h')],
             'frente': [lay(lh, f='h', clip='cobre'),
                        *[lay(D().arc(x, y, 16, 16, a0, a0 + 100, move=True), s='hs', w=.5) for (x, y, a0) in ((-84, -88, 200), (-24, -124, 230), (40, -122, 250), (92, -70, 280), (-112, 8, 150), (110, 20, 300))],
                        brilho(208, 240, R + 14, cy=-22, w=2, a=.4)]}

# twists: mini dreads/twists curtos no topo
lados = massa(R + 2, R + 4, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -10, 84, -30, 76, -46), ('L', -76, -46), ('C', -84, -30, -88, -10, -90, 14), ('L', -99, 12)])
tw = []
for i, (x, top) in enumerate(((-72, -96), (-50, -120), (-26, -134), (0, -140), (26, -134), (50, -120), (72, -96))):
    base = -52 - (30 - abs(x) * .35)
    tw.append(lay(D().M(x - 12, base + 10).C(x - 15, top + 20, x - 10, top, x, top).C(x + 10, top, x + 15, top + 20, x + 12, base + 10).Z(), f='h', alto=1))
for i, (x, top) in enumerate(((-62, -78), (-38, -100), (-12, -110), (12, -110), (38, -100), (62, -78))):
    bs = -56 + abs(x) * .16
    tw.append(lay(D().M(x - 12, bs).C(x - 14, top + 20, x - 9, top, x, top).C(x + 9, top, x + 14, top + 20, x + 12, bs).Q(x, bs + 8, x - 12, bs).Z(), f='h', alto=1))
E['twists'] = {'frente': [lay(lados, f='h', a=.42, w=0), *tw,
                          *[lay(D().M(x - 6, y).L(x + 6, y - 6), s='hs', w=.45, alto=1) for x, y in ((-50, -100), (-26, -114), (0, -120), (26, -114), (50, -100), (-12, -90), (12, -90))]]}

# raspado: máquina zero, só a sombra do cabelo
E['raspado'] = {'frente': [lay(massa(R + 1, R + 2, 0, 182, 358, [('L', 99, 12), ('L', 90, 14), ('C', 88, -16, 80, -38, 64, -52), ('C', 30, -62, -30, -62, -64, -52), ('C', -80, -38, -88, -16, -90, 14), ('L', -99, 12)]), f='h', a=.5, w=0),
                           lay(D().M(-64, -52).C(-30, -62, 30, -62, 64, -52), s='h', w=.45, a=.7)]}

# medio: cabelo médio repartido no meio, caindo até a orelha (estilo anos 90 moderno)
lh = [('L', 104, 30), ('C', 96, 40, 88, 36, 86, 26), ('C', 86, -10, 70, -40, 40, -54), ('C', 24, -60, 10, -60, 2, -70),
      ('C', -6, -60, -22, -60, -40, -54), ('C', -70, -40, -86, -10, -86, 26), ('C', -88, 36, -96, 40, -104, 30)]
E['medio'] = {'frente': [lay(massa(R + 7, R + 14, 0, 176, 364, lh), f='h', kf=6),
                         *fios([(2, -70), (-30, -96), (-80, -60)], [(2, -70), (34, -96), (82, -60)], [(-50, -50), (-80, -30), (-92, 20)], [(50, -50), (80, -30), (92, 20)], kf=6),
                         brilho(214, 244, R - 4)]}

# careca com laterais
lado = D().M(84, -44).C(100, -42, 106, -30, 104, -10).C(104, 10, 98, 26, 86, 32).C(92, 10, 92, -20, 84, -44).Z()
E['bald'] = {'nuca': [lay(lado, f='h'), lay(D().M(-84, -44).C(-100, -42, -106, -30, -104, -10).C(-104, 10, -98, 26, -86, 32).C(-92, 10, -92, -20, -84, -44).Z(), f='h')],
             'frente': [lay(D().arc(0, 0, R - 18, R - 18, 222, 246, move=True), s='hl', w=1.4, a=.35)]}

# ======================= FEMININOS =======================
# costas do cabelo comprido (atrás do corpo)
def costas(baixo=170, larg=R + 22, onda=False):
    d = D().M(-R - 2, -20)
    if onda:
        d.C(-larg - 8, 30, -larg + 14, 70, -larg - 4, 110).C(-larg - 16, 140, -larg + 4, baixo - 6, -larg + 22, baixo)
        d.C(-40, baixo + 16, 40, baixo + 16, larg - 22, baixo).C(larg - 4, baixo - 6, larg + 16, 140, larg + 4, 110).C(larg - 14, 70, larg + 8, 30, R + 2, -20)
    else:
        d.C(-larg, 30, -larg, 100, -larg + 6, baixo).C(-50, baixo + 18, 50, baixo + 18, larg - 6, baixo).C(larg, 100, larg, 30, R + 2, -20)
    return d.arc(0, -4, R + 2, R + 8, 0, -180).Z()


def mecha(sx, baixo=150, larg=R + 16, dentro=60, onda=False):  # mecha da frente caindo sobre o ombro (lado sx)
    d = D().M(sx * (R - 6), -46)
    if onda:
        d.C(sx * (larg + 2), -10, sx * (larg - 12), 40, sx * (larg + 2), 80).C(sx * (larg + 12), 110, sx * (larg - 4), baixo - 10, sx * (larg - 20), baixo)
        d.C(sx * (dentro + 30), baixo + 8, sx * (dentro + 4), baixo - 6, sx * dentro, baixo - 22).C(sx * (dentro + 14), baixo - 30, sx * (dentro + 20), 100, sx * 84, 60)
    else:
        d.C(sx * (larg + 4), 0, sx * larg, 70, sx * (larg - 6), baixo).C(sx * (dentro + 34), baixo + 10, sx * (dentro + 10), baixo + 4, sx * dentro, baixo - 6)
        d.C(sx * (dentro + 16), 110, sx * 84, 84, sx * 86, 50)
    d.C(sx * 88, 10, sx * 84, -20, sx * 70, -40).Z()
    return d


# topo com risca lateral (franja varrida para o lado do rosto)
def topo_lado(alto=R + 14):
    return D().M(-R - 4, 0).arc(0, 0, R + 6, alto, 182, 358).C(98, 10, 92, -10, 80, -34).C(60, -62, 30, -60, -6, -54) \
        .C(-30, -52, -56, -44, -74, -28).C(-82, -20, -86, -8, -88, 6).L(-R - 4, 0).Z()


def topo_meio(alto=R + 14):
    return D().M(-R - 4, 0).arc(0, 0, R + 6, alto, 182, 358).C(96, -8, 84, -36, 56, -54).C(34, -66, 14, -62, 0, -72) \
        .C(-14, -62, -34, -66, -56, -54).C(-84, -36, -96, -8, -R - 4, 0).Z()


E['long'] = {'tras': [lay(costas(), f='h')],
             'frente': [lay(topo_lado(), f='h', esp=1), lay(mecha(-1), f='h', esp=1), lay(mecha(1), f='h', esp=1),
                        *fios([(-30, -60), (20, -98), (80, -60)], [(-58, -48), (-30, -90), (24, -112)], [(110, 20), (112, 80), (106, 140)], [(-112, 20), (-114, 80), (-108, 140)], esp=1),
                        brilho(214, 250, R - 2, w=1.8)]}

E['ondulado'] = {'tras': [lay(costas(176, R + 26, True), f='h')],
                 'frente': [lay(topo_meio(), f='h'), lay(mecha(-1, 156, R + 20, 58, True), f='h'), lay(mecha(1, 156, R + 20, 58, True), f='h'),
                            *fios([(0, -72), (-36, -98), (-82, -52)], [(0, -72), (36, -98), (82, -52)], [(-112, 0), (-100, 50), (-114, 100)], [(112, 0), (100, 50), (114, 100)]),
                            brilho(212, 246, R - 2, w=1.8)]}

# franja: cortina (curtain bangs) + comprido
fr = D().M(-R - 4, 0).arc(0, 0, R + 6, R + 14, 182, 358).C(96, 8, 90, -4, 84, -16).C(70, -26, 50, -34, 34, -46).C(20, -56, 8, -60, 0, -66) \
    .C(-8, -60, -20, -56, -34, -46).C(-50, -34, -70, -26, -84, -16).C(-90, -4, -96, 8, -R - 4, 0).Z()
E['franja'] = {'tras': [lay(costas(160), f='h')],
               'frente': [lay(fr, f='h', kf=5), lay(mecha(-1, 140), f='h'), lay(mecha(1, 140), f='h'),
                          *fios([(0, -66), (-30, -60), (-62, -32)], [(0, -66), (30, -60), (62, -32)], [(-10, -76), (-50, -100), (-86, -60)], [(10, -76), (50, -100), (86, -60)], kf=5),
                          brilho(214, 248, R - 2, w=1.8)]}

# bob: na altura do queixo, risca lateral, pontas para dentro
bb = D().M(-R - 2, -30).arc(0, -6, R + 10, R + 14, 190, 350).C(R + 18, 10, R + 18, 54, R + 4, 74).C(R - 6, 84, 84, 84, 74, 70) \
    .C(84, 40, 86, 0, 80, -30).C(60, -60, 30, -60, -10, -54).C(-40, -50, -66, -36, -78, -16).C(-84, 10, -84, 44, -76, 70) \
    .C(-86, 84, -R + 6, 84, -R - 4, 74).C(-R - 18, 54, -R - 18, 10, -R - 2, -30).Z()
E['bob'] = {'frente': [lay(bb, f='h', esp=1),
                       *fios([(-20, -58), (20, -98), (84, -50)], [(-60, -40), (-30, -92), (30, -112)], [(100, 0), (106, 40), (92, 72)], [(-100, 0), (-106, 40), (-92, 72)], esp=1),
                       brilho(212, 248, R + 2, cy=-6, w=1.8)]}

# pixie: curtinho com franja varrida
px = D().M(-R - 4, -6).arc(0, -4, R + 6, R + 12, 184, 356).L(R - 1, 10).L(88, 12).C(86, -14, 80, -32, 66, -44) \
    .C(40, -50, 10, -40, -20, -34).C(-46, -30, -66, -36, -78, -26).C(-84, -14, -86, 0, -88, 14).L(-R + 1, 10).Z()
E['pixie'] = {'frente': [lay(px, f='h', esp=1),
                         *fios([(-60, -40), (-10, -76), (60, -92)], [(-30, -40), (20, -60), (70, -60)], [(-70, -70), (-40, -104), (10, -112)], esp=1),
                         brilho(220, 250, R - 4)]}

# rabo de cavalo alto (balança para o lado contrário de onde olha)
rb = D().M(20, -100).C(70, -140, 140, -110, 130, -30).C(124, 30, 146, 80, 118, 140).C(110, 110, 96, 70, 104, 20).C(110, -40, 80, -80, 34, -76).Z()
E['rabo'] = {'tras': [lay(rb, f='h', esp=-1)],
             'frente': [lay(topo_lado(R + 8), f='h', esp=1),
                        *fios([(-50, -50), (0, -96), (60, -96)], [(-80, -26), (-50, -90), (20, -112)], esp=1),
                        lay(D().O(54, -96, 13, 13), f='band', esp=-1),
                        brilho(220, 250, R - 2, w=1.8)]}

# coque alto (top knot) com fios soltos
E['bun'] = {'frente': [lay(topo_meio(R + 6), f='h'), lay(D().O(0, -R - 26, 40, 34), f='h', alto=1, kf=4),
                       lay(D().arc(0, -R - 26, 26, 22, 200, 330, move=True), s='hs', w=.6, alto=1, kf=4),
                       *fios([(0, -72), (-30, -96), (-70, -70)], [(0, -72), (30, -96), (70, -70)]),
                       brilho(214, 246, R - 4, w=1.6)]}

# tranças box braids compridas
tb = []
for sx in (-1, 1):
    for j, (ox, ln) in enumerate(((R + 4, 190), (R - 14, 210), (R - 30, 196))):
        x = sx * ox; d = D().M(x - 11, -10)
        y = -10
        while y < ln - 20:
            d.Q(x - 15, y + 13, x - 11, y + 26); y += 26
        d.Q(x, ln + 6, x + 11, y)
        while y > -10:
            d.Q(x + 15, y - 13, x + 11, y - 26); y -= 26
        d.Z(); tb.append(lay(d, f='h'))
cap = topo_meio(R + 8)
E['trancas'] = {'tras': tb,
                'frente': [lay(cap, f='h'),
                           *[lay(D().M(sx * 104, 20 + j * 22).L(sx * 124, 26 + j * 22), s='hs', w=.5) for sx in (-1, 1) for j in range(6)],
                           *fios([(0, -72), (-2, -94), (-4, -112)], [(-40, -60), (-70, -80), (-96, -40)], [(40, -60), (70, -80), (96, -40)], [(-30, -66), (-46, -96), (-60, -104)], [(30, -66), (46, -96), (60, -104)])]}

# maria-chiquinha moderna: dois coques no alto (space buns)
E['maria'] = {'frente': [lay(topo_meio(R + 6), f='h'),
                         lay(D().O(-66, -96, 34, 32), f='h', alto=1), lay(D().O(66, -96, 34, 32), f='h', alto=1),
                         lay(D().arc(-66, -96, 20, 18, 190, 320, move=True), s='hs', w=.55, alto=1), lay(D().arc(66, -96, 20, 18, 220, 350, move=True), s='hs', w=.55, alto=1),
                         *fios([(0, -72), (-30, -88), (-60, -62)], [(0, -72), (30, -88), (60, -62)]),
                         brilho(214, 244, R - 4, w=1.6)]}

# cachos volumosos na altura do ombro
ch = [(x, y, r) for (x, y, r) in ((-100, -60, 34), (-60, -112, 36), (-10, -128, 38), (42, -120, 37), (88, -86, 35), (112, -40, 32), (118, 10, 32), (112, 60, 32), (94, 104, 30),
                  (-112, -10, 32), (-118, 40, 32), (-108, 88, 31), (-86, 124, 28), (64, 130, 28), (-40, -90, 30), (20, -98, 32), (66, -64, 28))]
E['cachos'] = {'tras': [lay(D().O(x, y, r, r), f='h') for (x, y, r) in ch],
               'frente': [lay(D().M(-110, 30).C(-110, -60, -60, -120, 0, -120).C(60, -120, 110, -60, 110, 30).L(92, 30)
                              .C(92, -14, 80, -40, 58, -54).C(40, -42, 20, -50, 4, -62).C(-16, -48, -40, -46, -60, -52).C(-82, -40, -92, -14, -92, 30).Z(), f='h', clip='cobre'),
                          *[lay(D().O(x, y, r, r), f='h') for (x, y, r) in ((-86, -40, 22), (-94, 6, 18), (86, -40, 22), (94, 6, 18), (-40, -70, 18), (30, -72, 18))],
                          *[lay(D().arc(x, y, r * .55, r * .55, 200, 320, move=True), s='hs', w=.5) for (x, y, r) in ch[:9:2] + [(-86, -40, 22), (86, -40, 22)]]]}

ORDEM_M = ['short', 'degrade', 'slick', 'topete', 'espetado', 'moicano', 'curly', 'twists', 'afro', 'medio', 'raspado', 'bald', 'none']
ORDEM_F = ['long', 'ondulado', 'franja', 'bob', 'pixie', 'rabo', 'bun', 'trancas', 'maria', 'cachos', 'afro', 'none']
NOMES = {'short': 'Texturizado', 'degrade': 'Degradê', 'slick': 'Risca lateral', 'topete': 'Topete', 'espetado': 'Arrepiado', 'moicano': 'Moicano',
         'curly': 'Cacheado curto', 'twists': 'Twists', 'afro': 'Black power', 'medio': 'Médio repartido', 'raspado': 'Raspado', 'bald': 'Careca', 'none': 'Sem cabelo',
         'long': 'Liso comprido', 'ondulado': 'Ondulado', 'franja': 'Franja cortina', 'bob': 'Chanel', 'pixie': 'Pixie', 'rabo': 'Rabo alto', 'bun': 'Coque alto',
         'trancas': 'Box braids', 'maria': 'Dois coques', 'cachos': 'Cacheado volumoso'}
import os
json.dump({'estilos': E, 'masc': ORDEM_M, 'fem': ORDEM_F, 'nomes': NOMES}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cabelos.json'), 'w', encoding='utf8'), separators=(',', ':'), ensure_ascii=False)
```

### arquivo: render.py

```python
"""Linha do tempo + render por tomada (com retomada) + junção. Importado pelo cenas.py de cada vídeo.
CLI (via cenas.py):  info | estilos [I:FRAC] | storyboard | elenco | stills I:FRAC ... | tudo | render IDX N | audio | juntar | final
Qualidade: padrão "rapida" (720p). QUALIDADE=alta (ou "qualidade": "alta" no roteiro.json) = 1080p.
"""
import os, sys, json, math, random, subprocess, hashlib
import numpy as np, skia, soundfile as sf
import kit
from kit import *

GAP0, GAP, CARD_DUR = 0.3, 0.26, 1.5


class Shot:
    def __init__(self, i, d, v):
        self.i, self.d, self.v = i, d, v
        self.falas = d.get('falas', [])
    def at(self, e):  # 1.2 = seg. após início da tomada | 'n3' início da fala | 'n3+0.2' | 'n3:fim-0.1'
        if isinstance(e, (int, float)): return self.s0 + e
        e = e.replace(' ', ''); off = 0.0
        for sg in ('+', '-'):
            if sg in e[1:]:
                k = e.rindex(sg); off = float(e[k:]); e = e[:k]; break
        if e.endswith(':fim'): k = e[:-4]; return self.v.cue[k] + self.v.dur[k] + off
        return self.v.cue[e] + off
    def u(self, t): return (t - self.s0) / max(self.s1 - self.s0, 1e-6)
    def boca(self, key, t, rest='smile', mapping=None):  # boca pelo volume do áudio; None se não está falando
        m = self.v.mouth(key, t)
        if m is None: return rest
        return (mapping or {'open': 'open', 'mid': 'mid', 'closed': rest})[m]
    def falando(self, key, t): return self.v.mouth(key, t) is not None


class Video:
    def __init__(self, proj, seq, fps=FPS):
        self.proj = os.path.abspath(proj); self.A = f'{self.proj}/audio'
        self.R = json.load(open(f'{self.proj}/roteiro.json', encoding='utf8'))
        info = json.load(open(f'{self.A}/falas.json', encoding='utf8'))
        self.dur = {k: v['dur'] for k, v in info.items()}; self.voz = {k: v['voz'] for k, v in info.items()}
        self.txt = {k: v['texto'] for k, v in info.items()}; self.ext = {k: v.get('externo', False) for k, v in info.items()}
        self.cue = {}; self.shots = []; cur = 0.0; self._mouth = {}
        for i, d in enumerate(seq):
            S = Shot(i, d, self); S.s0 = cur
            cont = bool(S.falas) and all(self.ext.get(k) is True for k in S.falas)  # narração externa: pausas já vêm no áudio
            cur += 0 if cont else GAP0
            if not S.falas: cur += d.get('dur', CARD_DUR)
            for k in S.falas: self.cue[k] = round(cur, 3); cur += self.dur[k] + (0 if self.ext.get(k) is True else GAP)
            cur += d.get('hold', 0 if cont else 0.12); cur = max(cur, S.s0 + d.get('min', 0)); cur = round(cur * fps) / fps
            S.s1 = cur; self.shots.append(S)
        self.shots[-1].s1 = round((cur + 0.5) * fps) / fps; self.end = self.shots[-1].s1
        self.fmt = os.environ.get('FORMATO') or self.R.get('formato', '16:9'); self.OW, self.OH = kit.set_formato(self.fmt); self._util = {}
        self.estilo = os.environ.get('ESTILO') or self.R.get('estilo', 'noturno'); kit.set_estilo(self.estilo)
        self.rapido = (os.environ.get('QUALIDADE') or self.R.get('qualidade', 'rapida')) == 'rapida'  # padrão: modo rápido (720p); "alta" = 1080p
        kit.ESCALA = self.q = 2 / 3 if self.rapido else 1.0; self.PW, self.PH = int(round(self.OW * self.q / 2)) * 2, int(round(self.OH * self.q / 2)) * 2
        self.legendas = self.R.get('legendas', self.OW / self.OH < 1.5)  # padrão: legendas ligadas fora do 16:9
        self.OUT = f"{self.proj}/tomadas_{self.fmt.replace(':', 'x')}"; os.makedirs(self.OUT, exist_ok=True)
        self.video = f"{self.proj}/video_{self.fmt.replace(':', 'x')}.mp4"

    def mouth(self, key, t):
        if key not in self.cue: return None
        if key not in self._mouth: self._mouth[key] = mouth_track(f'{self.A}/{key}.wav')
        i = int(round((t - self.cue[key]) * FPS)); tr = self._mouth[key]
        return tr[i] if 0 <= i < len(tr) else None

    def _sig(self, S):  # muda se o tempo ou o código da tomada mudar -> re-render
        import inspect
        src = inspect.getsource(S.d['draw']) if 'draw' in S.d else ''
        d = {k: v for k, v in S.d.items() if k != 'draw'}
        kit = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kit.py'), encoding='utf8').read()
        return hashlib.md5(f"{self.fmt}{self.q}{self.estilo}{self.legendas}{S.s0}{S.s1}{json.dumps(d, default=str, sort_keys=True)}{src}{kit}".encode()).hexdigest()[:10]

    # ------------------------------------------------ desenho de um quadro
    def frame(self, S, f, surf):
        c = surf.getCanvas(); d = S.d; t = f / FPS; OW, OH = self.OW, self.OH; V = OW / OH < 1.5  # 9:16, 1:1 e 4:5 usam focus_v/zoom_v
        n0, n1 = int(round(S.s0 * FPS)), int(round(S.s1 * FPS)); e = ease((f - n0) / max(n1 - n0 - 1, 1))
        card = 'card' in d
        z0, z1 = d.get('zoom_v' if V else 'zoom', d.get('zoom', (1.0, 1.03) if card else (1.0, 1.07)))
        fo = d.get('focus_v' if V else 'focus', d.get('focus', (960, 540))); f0, f1 = (fo, fo) if isinstance(fo[0], (int, float)) else fo
        z = lerp(z0, z1, e); fx, fy = lerp(f0[0], f1[0], e), lerp(f0[1], f1[1], e)
        bs = max(OW / W, OH / H); zz = z * bs  # escala "cobrir": o mundo 1920x1080 preenche qualquer formato
        S.view = (fx - OW / 2 / zz, fy - OH / 2 / zz, fx + OW / 2 / zz, fy + OH / 2 / zz); S.vertical = V
        wx = sig = shx = shy = 0; k_ = OW / 1920
        prev = self.shots[S.i - 1].d if S.i > 0 else {}
        if d.get('whip') and n1 - f <= 5: wx = -((6 - (n1 - f)) ** 2) * 34 * k_; sig = (6 - (n1 - f)) * 16 * k_
        if prev.get('whip') and f - n0 < 4: wx = (4 - (f - n0)) ** 2 * 52 * k_; sig = (4 - (f - n0)) * 18 * k_
        for sh in d.get('shake', []):
            ts = S.at(sh)
            if ts <= t < ts + .35: k = 1 - (t - ts) / .35; shx = 16 * k * math.sin(t * 90); shy = 12 * k * math.cos(t * 77)
        c.resetMatrix(); c.scale(self.q, self.q)  # desenha em coordenadas de 1080p; o modo rápido só reduz os pixels
        c.clear(C((0, 0, 0))); c.save()
        if card:
            c.translate(OW / 2 + wx, OH / 2); c.scale(z, z); c.translate(-OW / 2, -OH / 2)
            txt = d['card'] or (self.txt[S.falas[0]] if S.falas else '')
            if S.falas: k = S.falas[0]; card_text(c, txt, t, self.cue[k], self.fala_util(k) - .15)
            else: card_text(c, txt, t, S.s0 + .25, 1.0)
        else:
            c.translate(OW / 2 + wx + shx, OH / 2 + shy); c.scale(zz, zz); c.rotate(d.get('rot', 0) * (e - .5)); c.translate(-fx, -fy)
            d['draw'](c, t, S)
        c.restore()
        if not card: finish(surf, bloom=d.get('bloom', .40)); vignette(c, d.get('vig', .64))
        if d.get('tag'): tag(c, d['tag'], (t - S.s0 - .2) / 1.0)
        for lw_ in d.get('lower', []):  # ("NOME|subtítulo", quando[, x, y]); x,y só valem no 16:9
            nm, _, sb = lw_[0].partition('|'); x_, y_ = (lw_[2], lw_[3]) if len(lw_) > 3 and OW == 1920 and OH == 1080 else (70, OH * (.68 if OH > OW else .72 if self.legendas else .86))
            lower_third(c, nm, sb, t - S.at(lw_[1]), x_, y_)
        if self.legendas and not card:
            for k in S.falas:
                legenda(c, self.txt[k], t, self.cue[k], self.fala_util(k))
        pol = d.get('polaroid')
        if pol and t >= S.at(pol['at']):
            FL = S.at(pol['at']); img = surf.makeImageSnapshot(); c.clear(C((12, 12, 22))); k = ease_out((t - FL) / .32)
            c.save(); c.translate(OW / 2, OH / 2 - 56 * k); c.rotate(-4.0 * k); sc = 1 - .33 * k; c.scale(sc, sc)
            c.drawRect(skia.Rect(-OW / 2 - 30, -OH / 2 - 30, OW / 2 + 70, OH / 2 + 200), fp((0, 0, 0), 120, blur=30))
            c.drawRect(skia.Rect(-OW / 2 - 44, -OH / 2 - 44, OW / 2 + 44, OH / 2 + 170), fp('#F7F2E6'))
            c.drawImageRect(img, skia.Rect(-OW / 2, -OH / 2, OW / 2, OH / 2), skia.SamplingOptions(skia.FilterMode.kLinear))
            c.drawRect(skia.Rect(-OW / 2, -OH / 2, OW / 2, OH / 2), ink(4, INK, 160))
            if pol.get('ring') and t > FL + .3:  # anel vermelho em volta do personagem (coordenadas do cenário)
                rx, ry = pol['ring']; hxs = (rx - fx) * zz; hys = (ry - fy) * zz; cu = min((t - FL - .3) / .4, 1)
                rg = skia.Path(); rg.addArc(skia.Rect(hxs - 185 * zz, hys - 190 * zz, hxs + 195 * zz, hys + 175 * zz), -110, 352.0 * ease(cu)); c.drawPath(rg, ink(18, RED))
            if t > FL + .68:
                txt_ = pol.get('text', ''); sz = fit(txt_, 118, OW - 80, FONT_HAND)
                label(c, txt_, -OW / 2 + 40, OH / 2 + 128, sz, RED, font=FONT_HAND, skew=0, alpha=min((t - FL - .68) / .12, 1))
            c.restore(); fl = max(0, 1 - (t - FL) / .22)
            if fl > 0: c.drawRect(skia.Rect(0, 0, OW, OH), fp('#FFFFFF', 255 * fl))
        if sig:
            img = surf.makeImageSnapshot(); c.save(); c.resetMatrix(); c.clear(C((0, 0, 0)))
            bp = skia.Paint(); bp.setImageFilter(skia.ImageFilters.Blur(sig * self.q, 0.01, skia.TileMode.kClamp)); c.drawImage(img, 0, 0, skia.SamplingOptions(), bp); c.restore()

    def fala_util(self, k):  # duração da fala sem o silêncio do fim (para cartões e legendas)
        if k not in self._util:
            s, sr = sf.read(f'{self.A}/{k}.wav'); s = s.mean(1) if s.ndim > 1 else s
            idx = np.where(np.abs(s) > 0.02 * (np.abs(s).max() + 1e-9))[0]; self._util[k] = (idx[-1] / sr) if len(idx) else self.dur[k]
        return self._util[k]

    def render(self, i):
        S = self.shots[i]; out = f'{self.OUT}/{i:03d}.mp4'; sig = self._sig(S)
        if os.path.exists(out) and os.path.exists(out + '.sig') and open(out + '.sig').read() == sig:
            print('pula', i, '(já pronta)', flush=True); return
        n0, n1 = int(round(S.s0 * FPS)), int(round(S.s1 * FPS)); surf = skia.Surface(self.PW, self.PH); tmp = out + '.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{self.PW}x{self.PH}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for f in range(n0, n1):
            self.frame(S, f, surf); p.stdin.write(surf.makeImageSnapshot().toarray(colorType=skia.kBGRA_8888_ColorType).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); open(out + '.sig', 'w').write(sig); print('feita', i, flush=True)
        else: print('ERRO na tomada', i, flush=True)

    def still(self, i, frac):
        S = self.shots[i]; f = int(round((S.s0 + (S.s1 - S.s0) * frac) * FPS)); surf = skia.Surface(self.PW, self.PH)
        self.frame(S, min(f, int(round(S.s1 * FPS)) - 1), surf); os.makedirs(f'{self.proj}/stills', exist_ok=True)
        fn = f'{self.proj}/stills/s{i:03d}_{int(frac * 100):02d}.png'; surf.makeImageSnapshot().save(fn, skia.kPNG); return fn

    def folha(self, files, out):  # folha de contato 3 colunas
        from PIL import Image
        tw = 640 if self.OW >= self.OH else 360; th = int(tw * self.OH / self.OW); cols = 3 if self.OW >= self.OH else 5
        ims = [Image.open(f).resize((tw, th)) for f in files]; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * tw, rows * th), 'black')
        for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * tw, (k // cols) * th))
        sheet.save(out); return out

    def _fonte(self, size):
        from PIL import ImageFont
        return ImageFont.truetype(kit.FD + 'Kalam-Bold.ttf', size)

    def estilos(self, alvo=None):  # folha com o mesmo quadro em todos os estilos, numerados
        from PIL import Image, ImageDraw
        if alvo: i, frac = int(alvo.split(':')[0]), float(alvo.split(':')[1])
        else: i, frac = next(S.i for S in self.shots if 'draw' in S.d), .6
        atual = self.estilo; ims = []
        for n, nome in enumerate(kit.ESTILOS, 1):
            kit.set_estilo(nome); fn = self.still(i, frac); im = Image.open(fn).convert('RGB')
            tw = 480 if self.OW >= self.OH else 300; im = im.resize((tw, int(tw * self.OH / self.OW)))
            d = ImageDraw.Draw(im); f = self._fonte(30 if tw > 400 else 24)
            d.rectangle([0, 0, tw, 44], fill=(10, 12, 26)); d.text((12, 4), f"{n}. {kit.ESTILOS[nome]['nome']}", font=f, fill=(255, 240, 200))
            ims.append(im)
        kit.set_estilo(atual)
        cols = 3; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * h + (rows + 1) * 8), (30, 30, 36))
        for k, im in enumerate(ims): sheet.paste(im, (8 + (k % cols) * (w + 8), 8 + (k // cols) * (h + 8)))
        out = f'{self.proj}/estilos.png'; sheet.save(out); return out

    def storyboard(self):  # uma miniatura por tomada, com número, tempo e fala
        from PIL import Image, ImageDraw
        tw = 420 if self.OW >= self.OH else 240; th = int(tw * self.OH / self.OW); cap = 120; f = self._fonte(22); fb = self._fonte(24)
        cards = []
        for S in self.shots:
            im = Image.open(self.still(S.i, .9 if 'card' in S.d else .65)).convert('RGB').resize((tw, th))
            box = Image.new('RGB', (tw, th + cap), (248, 244, 232)); box.paste(im, (0, 0)); d = ImageDraw.Draw(box)
            d.text((8, th + 4), f"#{S.i}  {S.s0:.1f}–{S.s1:.1f}s", font=fb, fill=(150, 30, 40))
            txt = ' '.join(self.txt[k] for k in S.falas) or (S.d.get('card') or '(sem fala)')
            words = txt.split(); lines = ['']
            for w in words:
                if d.textlength((lines[-1] + ' ' + w).strip(), font=f) > tw - 16: lines.append(w)
                else: lines[-1] = (lines[-1] + ' ' + w).strip()
            for j, ln in enumerate(lines[:3]): d.text((8, th + 34 + j * 27), ln + ('…' if j == 2 and len(lines) > 3 else ''), font=f, fill=(30, 30, 36))
            cards.append(box)
        cols = 4 if self.OW >= self.OH else 6; w, h = cards[0].size; rows = (len(cards) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * w + (cols + 1) * 10, rows * h + (rows + 1) * 10), (30, 30, 36))
        for k, im in enumerate(cards): sheet.paste(im, (10 + (k % cols) * (w + 10), 10 + (k // cols) * (h + 10)))
        out = f'{self.proj}/storyboard.png'; sheet.save(out); return out

    def checar_elenco(self, falhar=False):
        """Se o roteiro.json tem elenco do editor, todo personagem desenhado precisa vir dele (ou ser marcado figurante=True)."""
        el = self.R.get('elenco')
        if not el: return True
        kit.USADOS.clear(); surf = skia.Surface(64, 64)
        for S in self.shots:
            if 'draw' in S.d: self.frame(S, int(round((S.s0 + S.s1) / 2 * FPS)), surf)
        fora = kit.USADOS.count(None); usados = {n for n in kit.USADOS if n and n != 'figurante'}; sobra = [n for n in el if n not in usados]
        ok = fora == 0
        if not ok: print(f'ATENÇÃO: {fora} personagem(ns) desenhado(s) fora do elenco do editor. Use EL["nome"] no cenas.py (ou figurante=True para extras).')
        if sobra: print('(info) do elenco, não entraram em cena:', ', '.join(sobra), '— normal se a história não precisa deles; NÃO acrescente personagem só para usar o elenco')
        if ok: print('elenco ok:', ', '.join(sorted(usados)) or '(nenhum personagem)')
        if falhar and not ok and not os.environ.get('FORCAR'): sys.exit('render cancelado: corrija o cenas.py (ou rode com FORCAR=1)')
        return ok

    def juntar(self):
        lst = f'{self.OUT}/lista.txt'
        with open(lst, 'w') as f:
            for i in range(len(self.shots)):
                if not os.path.exists(f'{self.OUT}/{i:03d}.mp4'): sys.exit(f'falta a tomada {i}: rode render de novo')
                f.write(f"file '{self.OUT}/{i:03d}.mp4'\n")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', self.video], check=True)
        print(os.path.basename(self.video), 'ok')

    def final(self, nome=None):
        nome = nome or f"final_{self.fmt.replace(':', 'x')}.mp4"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', self.video, '-i', f'{self.proj}/mix.wav', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', f'{self.proj}/{nome}'], check=True)
        print(f'{nome} ok')


_V = None
def _render_global(i): _V.render(i)  # os processos filhos herdam o vídeo (fork), sem copiar nada


def main(v, argv=None):
    global _V; _V = v
    a = argv or sys.argv[1:]; cmd = a[0] if a else 'info'
    if cmd == 'info':
        for S in v.shots: print(f"{S.i:3d} {S.s0:7.2f}-{S.s1:7.2f}  {('CARTÃO ' + str(S.d['card'])) if 'card' in S.d else S.d['draw'].__name__:28s} {' '.join(S.falas)}")
        print(f'duração {v.end:.1f} s ({v.end / 60:.1f} min) | {len(v.shots)} tomadas | formato {v.fmt} ({v.PW}x{v.PH}{", modo rápido" if v.rapido else ""}) | estilo {v.estilo} | legendas {v.legendas}')
    elif cmd == 'stills':
        fs = [v.still(int(x.split(':')[0]), float(x.split(':')[1])) for x in a[1:]]
        print(v.folha(fs, f'{v.proj}/stills/folha.png'))
    elif cmd == 'tudo':  # render com todos os processadores + áudio + junção + final, num comando só
        import multiprocessing as mp, time
        v.checar_elenco(falhar=True)
        n = max(1, os.cpu_count() or 1); t0 = time.time()
        ordem = sorted(range(len(v.shots)), key=lambda i: -(v.shots[i].s1 - v.shots[i].s0))  # as mais longas primeiro: divide melhor
        with mp.get_context('fork').Pool(n) as pool:
            for k, _ in enumerate(pool.imap_unordered(_render_global, ordem), 1): print(f'{k}/{len(ordem)} tomadas | {time.time() - t0:.0f} s', flush=True)
        import audio; audio.mix(v); v.juntar(); v.final()
        print(f'pronto em {(time.time() - t0) / 60:.1f} min | {v.PW}x{v.PH} | {"rápido (720p)" if v.rapido else "alta (1080p)"}')
    elif cmd == 'render':
        idx, n = int(a[1]), int(a[2])
        for i in range(len(v.shots)):
            if i % n == idx: v.render(i)
        print('terminou worker', idx, flush=True)
    elif cmd == 'estilos': print(v.estilos(a[1] if len(a) > 1 else None))
    elif cmd == 'storyboard': print(v.storyboard()); v.checar_elenco()
    elif cmd == 'elenco': v.checar_elenco()
    elif cmd == 'juntar': v.juntar()
    elif cmd == 'audio':
        import audio; audio.mix(v)
    elif cmd == 'final': v.final()
```

### arquivo: audio.py

```python
"""Mixagem: cadeia de voz, trilha original sintetizada, efeitos sintetizados, ducking e -14 LUFS.
Chamado por: python3 cenas.py audio   (usa a linha do tempo do Video)
"""
import os, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, lfilter, fftconvolve

SR = 48000
rng = np.random.default_rng(5)


def bq(x, kind, f, q=0.707, gain=0.0):
    w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q); A = 10 ** (gain / 40); cw = np.cos(w)
    if kind == 'peak': b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == 'hs':
        s = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + s), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - s)]
        a = [(A + 1) - (A - 1) * cw + s, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - s]
    else:  # 'ls'
        s = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + s), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - s)]
        a = [(A + 1) + (A - 1) * cw + s, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - s]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
def lp(x, fc, o=2): b, a = butter(o, fc / (SR / 2), 'low'); return lfilter(b, a, x)
def hp(x, fc, o=2): b, a = butter(o, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def bp(x, f1, f2): b, a = butter(2, [f1 / (SR / 2), f2 / (SR / 2)], 'band'); return lfilter(b, a, x)


def comp(x, thr_db=-22, ratio=3.2, att=0.004, rel=0.12, makeup=4.0):
    env = np.zeros(len(x)); e = 0.0; a_ = np.exp(-1 / (att * SR)); r_ = np.exp(-1 / (rel * SR)); ax = np.abs(x)
    for i in range(len(x)):
        v = ax[i]; e = a_ * e + (1 - a_) * v if v > e else r_ * e + (1 - r_) * v; env[i] = e
    over = np.maximum(20 * np.log10(env + 1e-9) - thr_db, 0)
    return x * 10 ** ((-over * (1 - 1 / ratio) + makeup) / 20)
def deess(x, amt=0.55):
    s = hp(x, 5200); env = lp(np.abs(s), 60); g = 1 - amt * np.clip(env / (env.max() + 1e-9) * 2.2, 0, 1); return (x - s) + s * g
def room_ir(dur=0.28, bright=5000, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t * 22)[:, None]; ir[:int(.004 * SR)] = 0
    ir = np.stack([lp(ir[:, 0], bright), lp(ir[:, 1], bright)], 1); return ir / np.sqrt((ir ** 2).sum(0))
def voice_chain(s, sr, narrator=True, externo=False):
    s = resample_poly(s, SR, sr) if sr != SR else s
    if externo: return hp(s, 60)  # áudio externo já vem tratado: só tira o ronco; o volume final vem do loudnorm
    s = s / (np.abs(s).max() + 1e-9) * 0.7
    s = hp(s, 72); s = bq(s, 'peak', 280, 1.0, -2.0); s = bq(s, 'ls', 130, 0.7, 1.5 if narrator else 0)
    s = bq(s, 'peak', 3400, 0.9, 2.5); s = bq(s, 'hs', 8500, 0.7, 3.0); return comp(deess(s))
def place(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414; x = np.stack([x * l, x * r], 1)
    j = min(i + len(x), len(buf))
    if 0 <= i < len(buf): buf[i:j] += x[:j - i] * gain


# ---------------- trilha (original)
hz = lambda n: 440 * 2 ** ((n - 69) / 12)
def pluck(f, dur=0.34, amp=0.5, decay=10):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * decay) * (1 - np.exp(-t * 500))
    return amp * env * (np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .22 * np.sin(6 * np.pi * f * t) + .1 * np.sin(8 * np.pi * f * t))
def bass(f, dur=0.42, amp=0.6):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * 6) * (1 - np.exp(-t * 300))
    return amp * env * lp(np.sin(2 * np.pi * f * t) + .6 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t), 900)
def vibes(f, dur=0.9, amp=0.2):
    n = int(dur * SR); t = np.arange(n) / SR; env = np.exp(-t * 4.5) * (1 - np.exp(-t * 900))
    return amp * env * (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 14)) * (1 + .25 * np.sin(2 * np.pi * 5.5 * t))
def accordion(freqs, dur, amp=0.05):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs:
        for d in (-1.8, 0, 2.1):
            ph = ((f + d) * t) % 1; out += (2 * ph - 1) + .5 * np.sign(np.sin(2 * np.pi * (f + d) * t))
    env = np.minimum(1, t / .12) * np.minimum(1, (dur - t) / .2) * (1 + .12 * np.sin(2 * np.pi * 5 * t))
    return amp * bp(out, 300, 3200) * env / len(freqs)
def brush(amp=0.06, dur=0.07): n = int(dur * SR); return amp * hp(rng.standard_normal(n), 5500) * np.exp(-np.arange(n) / SR * 55)
def kick(amp=0.4): n = int(.22 * SR); t = np.arange(n) / SR; return amp * np.sin(2 * np.pi * (48 + 70 * np.exp(-t * 34)) * t) * np.exp(-t * 15)

MOODS = {  # (bpm, [(baixo, acorde)], caminhada do baixo, motivos de vibrafone)
    'misterio': (104, [(45, [57, 60, 64]), (41, [53, 57, 60]), (38, [50, 53, 57]), (40, [52, 56, 59])],
                 [[0, 3, 7, 3], [0, 4, 7, 4], [0, 3, 7, 10], [0, 4, 7, 11]],
                 [[76, None, 75, 76, None, 72, None, None], [None, 69, None, 72, 71, None, 69, None], [77, None, 76, 74, None, 72, None, 74], [None, 71, 72, None, 76, None, 80, None]]),
    'leve': (112, [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [53, 57, 60]), (43, [55, 59, 62])],
             [[0, 4, 7, 4], [0, 3, 7, 3], [0, 4, 7, 9], [0, 4, 7, 11]],
             [[76, None, 79, None, 76, 74, None, 72], [None, 72, None, 76, 74, None, 72, None], [77, None, 76, 72, None, 69, None, 72], [None, 74, 76, None, 79, None, 83, None]]),
}


def music(N, mood='misterio', mutes=(), cut_at=None):
    bpm, prog, walk, motifs = MOODS[mood]; beat = 60 / bpm; e8 = beat / 2; bar = 4 * beat
    m = np.zeros((N + 2 * SR, 2)); t = 0.0; bi = 0; END = N / SR
    while t < END:
        root, ch = prog[bi % 4]
        if not any(t + bar * .5 > a and t < b - .1 for a, b in mutes):
            place(m, accordion([hz(n) for n in ch], bar * .98, 0.05), t, 1.0, -0.2)
            for i, off in enumerate(walk[bi % 4]): place(m, bass(hz(root + off), beat * .95, .55), t + i * beat)
            for i in (1, 3): place(m, sum(pluck(hz(n + 12), .2, .18) for n in ch), t + i * beat, 1.0, 0.25)
            for i, n in enumerate(motifs[bi % 4]):
                if n: place(m, vibes(hz(n), .8, .15), t + i * e8, 1.0, -0.3 + .08 * i)
            for i in range(8): place(m, brush(.07 if i % 2 == 0 else .04), t + i * e8 + (0.03 if i % 2 else 0), 1.0, 0.3)
            for i in (0, 2): place(m, kick(.32), t + i * beat)
        t += bar; bi += 1
    m = m[:N]; tt = np.arange(N) / SR; g = np.ones(N)
    for a, b in mutes: g[(tt > a - .05) & (tt < b)] = 0.0
    g = lp(g, 10, 1); m *= g[:, None]; m *= np.minimum(1, tt / .25)[:, None]
    if cut_at is not None: m *= np.clip(1 - (tt - cut_at) / .08, 0, 1)[:, None]
    for a, b in mutes:  # nota grave sustentada sob o cartão preto
        n_ = int((b - a) * SR); t_ = np.arange(n_) / SR
        place(m, lp(np.sin(2 * np.pi * 55 * t_) + .4 * np.sin(2 * np.pi * 110.4 * t_) + .2 * np.sin(2 * np.pi * 164.8 * t_), 500)
              * np.minimum(1, t_ / .3) * np.minimum(1, (b - a - t_) / .3) * .16, a)
    if cut_at is not None:  # acorde final no flash
        root, ch = prog[0]
        for n, pan in ((root, 0), (ch[0], -.3), (ch[2], .3), (ch[1] + 12, -.1)): place(m, vibes(hz(n), 1.6, .22) + pluck(hz(n), 1.6, .2, 4), cut_at, 1.0, pan)
    return m


# ---------------- instrumentos extras e climas por tema
def strings(freqs, dur, amp=0.05):  # cordas: serras desafinadas, ataque lento
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs:
        for d in (-1.2, 0, 1.4): out += 2 * (((f + d) * t) % 1) - 1
    env = np.minimum(1, t / .45) * np.minimum(1, (dur - t) / .4)
    return amp * lp(out, 1800) * env / len(freqs)
def synth_pad(freqs, dur, amp=0.05):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f in freqs: out += np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * 1.003 * t)
    env = np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3)
    return amp * lp(out, 1200 + 600 * np.sin(2 * np.pi * .25 * t[0])) * env / len(freqs)
def blip(f, dur=.12, amp=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return amp * lp(np.sign(np.sin(2 * np.pi * f * t)), 3500) * np.exp(-t * 22)
def bell(f, dur=1.0, amp=.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return amp * sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 3), (2.76, .4, 6), (5.4, .2, 10)))
def clap(amp=.25):
    n = int(.15 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 5000)
    return amp * x * (np.exp(-t * 30) + .5 * np.exp(-np.abs(t - .012) * 400))
def hat(amp=.06): n = int(.04 * SR); return amp * hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 120)

# cada clima: bpm, progressão (baixo, acorde), estilo de cada camada, motivo melódico (8 colcheias por compasso)
CLIMAS = {
    'misterio':   dict(nome='Mistério (jazz)', bpm=104),
    'leve':       dict(nome='Leve', bpm=112),
    'tenso':      dict(nome='Tenso / suspense', bpm=84, prog=[(33, [57, 60, 64]), (29, [53, 57, 60]), (26, [50, 53, 57]), (28, [52, 56, 59])],
                       pad='strings', baixo='pulso', perc='coracao', lead='sino', motivo=[[81, None, None, None, 80, None, None, None], [None] * 8, [77, None, None, None, 76, None, None, None], [None] * 8]),
    'epico':      dict(nome='Épico / inspirador', bpm=100, prog=[(36, [60, 64, 67]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])],
                       pad='strings', baixo='raiz', perc='batida', lead='piano', motivo=[[72, 76, 79, 76, 72, 76, 79, 76], [71, 74, 79, 74, 71, 74, 79, 74], [72, 76, 81, 76, 72, 76, 81, 76], [72, 77, 81, 77, 72, 77, 81, 77]]),
    'triste':     dict(nome='Triste / reflexivo', bpm=70, prog=[(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])],
                       pad='strings', baixo='longo', perc=None, lead='piano', motivo=[[69, None, 72, None, 76, None, 72, None], [69, None, 72, None, 77, None, 72, None], [67, None, 72, None, 76, None, 72, None], [67, None, 71, None, 74, None, 71, None]]),
    'divertido':  dict(nome='Divertido', bpm=124, prog=[(48, [60, 64, 67]), (41, [53, 57, 60]), (43, [55, 59, 62]), (48, [60, 64, 67])],
                       pad=None, baixo='saltitante', perc='palmas', lead='sino', motivo=[[84, None, 81, 79, None, 76, None, None], [81, None, 77, None, 76, 77, 81, None], [79, None, 83, None, 86, None, 83, 79], [84, None, None, 79, 84, None, None, None]]),
    'tecnologia': dict(nome='Tecnologia', bpm=112, prog=[(33, [57, 60, 64]), (29, [53, 57, 60]), (36, [55, 60, 64]), (31, [55, 59, 62])],
                       pad='synth', baixo='pulso', perc='batida', lead='arpejo', motivo=None),
}


def music_tema(N, clima, mutes=(), cut_at=None):
    C_ = CLIMAS[clima]; bpm = C_['bpm']; beat = 60 / bpm; e8 = beat / 2; bar = 4 * beat; prog = C_['prog']
    m = np.zeros((N + 2 * SR, 2)); t = 0.0; bi = 0; END = N / SR
    while t < END:
        root, ch = prog[bi % 4]
        if not any(t + bar * .5 > a and t < b - .1 for a, b in mutes):
            if C_['pad'] == 'strings': place(m, strings([hz(n) for n in ch], bar * .99, .06), t, 1.0, -0.15)
            if C_['pad'] == 'synth': place(m, synth_pad([hz(n) for n in ch], bar * .99, .045), t, 1.0, -0.15)
            b_ = C_['baixo']
            if b_ == 'pulso':
                for i in range(8): place(m, bass(hz(root + 12), e8 * .8, .4), t + i * e8)
            elif b_ == 'raiz':
                for i in range(4): place(m, bass(hz(root + 12), beat * .9, .5), t + i * beat)
            elif b_ == 'longo': place(m, bass(hz(root + 12), bar * .95, .45), t)
            elif b_ == 'saltitante':
                for i, off in enumerate((0, 7, 0, 7)): place(m, pluck(hz(root + 12 + off), .22, .5, 14), t + i * beat)
            p_ = C_['perc']
            if p_ == 'batida':
                for i in range(4): place(m, kick(.34), t + i * beat)
                for i in (1, 3): place(m, clap(.18), t + i * beat, 1.0, .1)
                for i in range(8): place(m, hat(.05), t + i * e8 + .01, 1.0, .35)
            elif p_ == 'coracao':
                place(m, kick(.38), t); place(m, kick(.26), t + .22)
            elif p_ == 'palmas':
                for i in (0, 2): place(m, kick(.26), t + i * beat)
                for i in (1, 3): place(m, clap(.2), t + i * beat, 1.0, .1)
            mot = C_['motivo']; ld = C_['lead']
            if ld == 'arpejo':
                for i in range(16):  # arpejo em semicolcheias: sobe e desce o acorde, oitava acima na 2ª metade
                    n = ch[(0, 1, 2, 1)[i % 4]] + 12 + (12 if i >= 8 else 0); place(m, blip(hz(n), .11, .12), t + i * e8 / 2, 1.0, -.3 + .04 * i)
            elif mot:
                for i, n in enumerate(mot[bi % 4]):
                    if not n: continue
                    if ld == 'piano': place(m, pluck(hz(n), .9, .2, 4.5), t + i * e8, 1.0, -.2 + .05 * i)
                    elif ld == 'sino': place(m, bell(hz(n), 1.0, .12), t + i * e8, 1.0, .25)
        t += bar; bi += 1
    m = m[:N]; tt = np.arange(N) / SR; g = np.ones(N)
    for a, b in mutes: g[(tt > a - .05) & (tt < b)] = 0.0
    g = lp(g, 10, 1); m *= g[:, None]; m *= np.minimum(1, tt / .25)[:, None]
    if cut_at is not None: m *= np.clip(1 - (tt - cut_at) / .08, 0, 1)[:, None]
    for a, b in mutes:
        n_ = int((b - a) * SR); t_ = np.arange(n_) / SR; r0 = hz(prog[0][0])
        place(m, lp(np.sin(2 * np.pi * r0 * t_) + .4 * np.sin(2 * np.pi * 2.008 * r0 * t_), 500) * np.minimum(1, t_ / .3) * np.minimum(1, (b - a - t_) / .3) * .16, a)
    if cut_at is not None:
        root, ch = prog[0]
        for n, pan in ((root + 12, 0), (ch[0], -.3), (ch[2], .3), (ch[1] + 12, -.1)): place(m, bell(hz(n), 1.6, .16) + pluck(hz(n), 1.6, .18, 4), cut_at, 1.0, pan)
    return m


def trilha(N, clima, mutes=(), cut_at=None):
    return music(N, clima, mutes, cut_at) if clima in MOODS else music_tema(N, clima, mutes, cut_at)


# ---------------- tema do vídeo: escolhe clima da trilha e efeitos por palavra-chave
def _sem_acento(t):
    import unicodedata
    return ''.join(ch for ch in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(ch) != 'Mn')
TEMAS = {  # tema: (clima, palavras que indicam o tema)
    'golpe':      ('tenso', 'golpe golpista fraude crime policia preso roubo roubou mentira enganou suspeito investigacao'),
    'financas':   ('misterio', 'dinheiro salario reais banco conta divida juros pix cartao boleto investimento economia gasto extrato tarifa compra'),
    'tecnologia': ('tecnologia', 'ia inteligencia artificial app aplicativo celular internet computador robo tecnologia digital software chatgpt'),
    'historia':   ('epico', 'seculo guerra imperio rei rainha antigo historia batalha descobriu'),
    'motivacao':  ('epico', 'sonho conquista vencer superar disciplina sucesso objetivo mudar'),
    'triste':     ('triste', 'morte morreu perda saudade tragedia sozinho luto'),
    'humor':      ('divertido', 'engracado piada divertido ridiculo absurdo'),
    'saude':      ('leve', 'saude corpo sono cerebro ciencia alimentacao agua'),
}
EFEITOS_PALAVRA = [  # (efeito, palavras) — primeiro que casar na fala
    ('kaching', 'dinheiro salario reais pagar pagou pagamento comprar compra preco lucro r$'),
    ('notif', 'celular app aplicativo notificacao mensagem assinatura internet'),
    ('buzzer', 'erro problema golpe perigo cuidado mentira errado nunca'),
    ('relogio', 'tempo dias hora horas relogio mes semana ano anos noite'),
    ('queda', 'cai caiu some sumiu despenca perdeu quebrou desaba'),
    ('subida', 'cresce cresceu subiu aumentou dobrou explodiu'),
    ('brilho', 'ideia segredo descobriu truque solucao hoje'),
]


def detectar_tema(textos):
    t = ' ' + _sem_acento(' '.join(textos)) + ' '; pont = {}
    for tema, (_, pal) in TEMAS.items(): pont[tema] = sum(t.count(' ' + p) for p in pal.split())
    tema = max(pont, key=pont.get)
    return (tema if pont[tema] > 0 else 'financas'), pont


def efeitos_auto(v):
    """[(efeito, tempo)] — um por fala, na palavra-chave, estimando o tempo pela posição do texto."""
    out = []
    for k, t0 in v.cue.items():
        txt = v.txt[k]; base = _sem_acento(txt); dur = v.fala_util(k) if hasattr(v, 'fala_util') else v.dur[k]
        for ef, pal in EFEITOS_PALAVRA:
            hit = [base.find(p) for p in pal.split() if (' ' + base).find(' ' + p) >= 0]
            if hit:
                pos = min(h for h in hit if h >= 0); out.append((ef, t0 + dur * pos / max(len(base), 1) + .05)); break
    return out


# ---------------- efeitos (sintetizados)
def whoosh(dur=0.5):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 600
    for i in range(0, n, seg):
        fc = 350 + 5200 * np.sin(np.pi * i / n) ** 1.3; y = bp(x[i:i + seg], max(fc * .55, 120), min(fc * 1.6, 16000)); out[i:i + len(y)] = y
    return out * np.sin(np.pi * np.arange(n) / n) ** 2 * 1.3
def popfx(f0=340): n = int(.13 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * (f0 + 900 * np.exp(-t * 42)) * t) * np.exp(-t * 34) * .6
def thud(big=True):
    n = int(.7 * SR); t = np.arange(n) / SR
    out = np.sin(2 * np.pi * (42 + 95 * np.exp(-t * 26)) * t) * np.exp(-t * 8) + lp(rng.standard_normal(n), 2800) * np.exp(-t * 38) * .7
    if big: out += hp(rng.standard_normal(n), 3500) * np.exp(-t * 7) * .22
    return out * .9
def tick(): n = int(.016 * SR); return hp(rng.standard_normal(n), 2800) * np.exp(-np.arange(n) / SR * 280) * .5
def ticks(dur=1.1, gap=0.055):
    out = np.zeros(int((dur + .05) * SR))
    for k in range(int(dur / gap)): a = tick(); i = int(k * gap * SR); out[i:i + len(a)] += a
    return out
def step(): n = int(.09 * SR); t = np.arange(n) / SR; return lp(rng.standard_normal(n), 1400) * np.exp(-t * 60) * .8 + np.sin(2 * np.pi * 150 * t) * np.exp(-t * 50) * .5
def steps(k=4, gap=.285):
    out = np.zeros(int((k * gap + .1) * SR))
    for j in range(k): a = step(); i = int(j * gap * SR); out[i:i + len(a)] += a
    return out
def shutter():
    out = np.zeros(int(.45 * SR)); a = tick() * 2.2; out[:len(a)] += a; k = int(.07 * SR); out[k:k + len(a)] += a
    t = np.arange(len(out)) / SR; return out + hp(rng.standard_normal(len(out)), 6000) * np.exp(-t * 12) * .12
def scribble(dur=.42): n = int(dur * SR); t = np.arange(n) / SR; return bp(rng.standard_normal(n), 1400, 5200) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * .26
def boom(): n = int(1.6 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * 36 * t) * np.exp(-t * 2.4) * .8 + lp(rng.standard_normal(n), 180) * np.exp(-t * 3) * .4
def ding(): n = int(.9 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 2637 * t) + .5 * np.sin(2 * np.pi * 3951 * t)) * np.exp(-t * 7) * .25
def paper(): n = int(.35 * SR); t = np.arange(n) / SR; return bp(rng.standard_normal(n), 900, 7000) * np.sin(np.pi * t / .35) ** 2 * .35
def coins():
    out = np.zeros(int(.8 * SR))
    for k in range(6):
        n = int(.25 * SR); t = np.arange(n) / SR; f = 3000 + rng.uniform(-500, 900)
        a = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 1.48 * t)) * np.exp(-t * 18) * .18; i = int(k * .09 * SR); out[i:i + n] += a
    return out
def kaching():  # caixa registradora
    out = np.zeros(int(.9 * SR)); a = paper() * .6; out[:len(a)] += a
    b = bell(hz(88), .8, .3) + bell(hz(93), .8, .2); i = int(.08 * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out
def notif(): return np.concatenate([bell(hz(84), .12, .35)[:int(.1 * SR)], bell(hz(91), .5, .35)])
def buzzer(): n = int(.38 * SR); t = np.arange(n) / SR; return lp(np.sign(np.sin(2 * np.pi * 110 * t)) + np.sign(np.sin(2 * np.pi * 116 * t)), 2500) * np.minimum(1, (0.38 - t) / .04) * .18
def relogio():
    out = np.zeros(int(1.0 * SR))
    for k, f in enumerate((2400, 1800, 2400, 1800)): a = bp(rng.standard_normal(int(.02 * SR)), f * .8, f * 1.2) * .5; i = int(k * .25 * SR); out[i:i + len(a)] += a
    return out
def queda(): n = int(.7 * SR); t = np.arange(n) / SR; f = 1400 * np.exp(-t * 2.6) + 120; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) * .22
def subida(): n = int(.9 * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); return np.concatenate([bp(x[i:i + 600], 300 + 5000 * (i / n) ** 2, 800 + 9000 * (i / n) ** 2) for i in range(0, n, 600)])[:n] * (t / .9) ** 2 * .9
def brilho():
    out = np.zeros(int(1.0 * SR))
    for k, n_ in enumerate((96, 100, 103, 108)): b = bell(hz(n_), .5, .1); i = int(k * .06 * SR); out[i:i + len(b)] += b
    return out
def glitch():
    n = int(.3 * SR); out = np.zeros(n)
    for k in range(6): i = int(rng.uniform(0, n - 2000)); out[i:i + 1600] += blip(rng.uniform(300, 2400), 1600 / SR, .3)[:1600]
    return out
SFX = dict(whoosh=whoosh, pop=popfx, thud=thud, tick=tick, ticks=ticks, step=step, steps=steps, shutter=shutter,
           scribble=scribble, boom=boom, ding=ding, paper=paper, coins=coins, kaching=kaching, notif=notif, buzzer=buzzer,
           relogio=relogio, queda=queda, subida=subida, brilho=brilho, glitch=glitch)


def amostras(out):
    """Um arquivo com ~8 s de cada clima, em ordem, para o usuário escolher (com 1 s de silêncio entre eles)."""
    partes = []
    for i, cl in enumerate(CLIMAS):
        N = int(8 * SR); m = trilha(N, cl); m *= np.minimum(1, (N / SR - np.arange(N) / SR) / 1.0)[:, None]
        partes += [m * .8, np.zeros((SR, 2))]; print(i + 1, CLIMAS[cl]['nome'])
    x = np.concatenate(partes); x /= np.abs(x).max() / .9
    sf.write('/tmp/_am.wav', x.astype(np.float32), SR)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/_am.wav', '-b:a', '160k', out], check=True); return out


def mix(v):
    N = int(v.end * SR); voice = np.zeros((N, 2)); vm = np.zeros(N); sfx = np.zeros((N, 2))
    narr = v.R.get('narrador', 'narrador'); roles = [r for r in v.R['vozes'] if r != narr]
    pans = {r: (-.28 if i % 2 == 0 else .28) for i, r in enumerate(roles)}
    IRN = room_ir(0.22, 6000, 1); IRC = room_ir(0.34, 4200, 2)
    for k, t in v.cue.items():
        s, sr = sf.read(f'{v.A}/{k}.wav'); s = s.mean(1) if s.ndim > 1 else s; isn = v.voz[k] == narr; ext = bool(v.ext.get(k))
        d = voice_chain(s, sr, isn, ext)
        wet = np.stack([fftconvolve(d, (IRN if isn else IRC)[:, ch])[:len(d) + 8000] for ch in (0, 1)], 1)
        dry = np.zeros_like(wet); place(dry, d, 0, 1.0, 0.0 if (isn or ext) else pans.get(v.voz[k], 0))
        place(voice, dry + wet * (0 if ext else 0.05 if isn else 0.16), t); i = int(t * SR); vm[i:i + len(d)] += d[:max(0, N - i)]
    textos = list(v.txt.values()); tema_auto, _ = detectar_tema(textos)
    tema = v.R.get('tema', 'auto'); tema = tema_auto if tema == 'auto' else tema
    clima = v.R.get('musica', 'auto'); clima = TEMAS.get(tema, ('misterio',))[0] if clima == 'auto' else clima
    print(f'tema {tema} | trilha {"sem música" if clima == "nenhuma" else CLIMAS[clima]["nome"]}')
    manuais = []; trans = glitch if tema == 'tecnologia' else (lambda: whoosh(.5))
    mutes = []; cut = None
    for S in v.shots:
        d = S.d
        if 'card' in d: mutes.append((S.s0, S.s1)); place(sfx, boom(), S.s0, .7)
        if d.get('whip'): place(sfx, trans(), S.s1 - .3, .5, -.3 if S.i % 2 else .3)
        for sh in d.get('shake', []): place(sfx, thud(True), S.at(sh), 1.1)
        for (txt_, at_, *_r) in d.get('lower', []): place(sfx, popfx(360), S.at(at_), .5, .2)
        if d.get('tag'): place(sfx, popfx(300), S.s0 + .25, .35, -.4)
        if d.get('polaroid'):
            cut = S.at(d['polaroid']['at']); place(sfx, shutter(), cut, 1.0); place(sfx, scribble(.4), cut + .3, .8, -.2); place(sfx, popfx(360), cut + .68, .6, -.3)
        for ev in d.get('sfx', []):  # ('nome', quando, ganho=0.6, pan=0)
            name, when = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else .6; pn = ev[3] if len(ev) > 3 else 0
            place(sfx, SFX[name](), S.at(when), g, pn); manuais.append(S.at(when))
        manuais += [S.at(x) for x in d.get('shake', [])]
    if v.R.get('efeitos_auto', True):  # efeitos por palavra-chave, sem atropelar os manuais
        for ef, tt in efeitos_auto(v):
            if all(abs(tt - x) > .45 for x in manuais): place(sfx, SFX[ef](), tt, .45, .15); print('  efeito', ef, round(tt, 2), 's')
    sfx += (lp(rng.standard_normal(N), 400) * 0.004)[:, None]  # tom de sala bem baixo
    mus = np.zeros((N, 2)) if clima == 'nenhuma' else trilha(N, clima, mutes, cut)  # "musica": "nenhuma" = sem trilha
    env = lp(np.abs(vm), 5, 1); env /= env.max() + 1e-9; duck = (1 - 0.6 * np.clip(env * 3.2, 0, 1))[:, None]
    m = voice * 1.0 + mus * v.R.get('musica_vol', 0.36) * duck + sfx * 0.5  # "musica_vol" no roteiro.json: volume da trilha (padrão 0.36); m = np.tanh(m * 1.15) / np.tanh(1.15)
    raw = f'{v.proj}/mix_raw.wav'; sf.write(raw, m.astype(np.float32), SR)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7', '-ar', str(SR), f'{v.proj}/mix.wav'], check=True)
    print('mix.wav ok', round(v.end, 1), 's')


if __name__ == '__main__':  # python3 audio.py amostras saida.mp3
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'amostras': print(amostras(sys.argv[2] if len(sys.argv) > 2 else 'amostras_trilhas.mp3'))
```

### arquivo: vozes.py

```python
"""Vozes em PT-BR: Kokoro (sherpa-onnx, léxico do espeak-ng) ou Piper (vozes brasileiras, "piper:faber-medium").
Uso: python3 vozes.py PROJETO_DIR      (lê PROJETO_DIR/roteiro.json, grava PROJETO_DIR/audio/*.wav e falas.json)
     python3 vozes.py PROJETO_DIR n3 c1 (regera só essas falas)
"""
import os, re, sys, json
import numpy as np, soundfile as sf

M = os.path.expanduser('~/models/kokoro-multi-lang-v1_0')
# nomes -> id (lidos dos metadados do modelo; NÃO use ids de memória)
SPK = {n: i for i, n in enumerate(
    "af_alloy af_aoede af_bella af_heart af_jessica af_kore af_nicole af_nova af_river af_sarah af_sky am_adam am_echo am_eric "
    "am_fenrir am_liam am_michael am_onyx am_puck am_santa bf_alice bf_emma bf_isabella bf_lily bm_daniel bm_fable bm_george "
    "bm_lewis ef_dora em_alex ff_siwis hf_alpha hf_beta hm_omega hm_psi if_sara im_nicola jf_alpha jf_gongitsune jf_nezumi "
    "jf_tebukuro jm_kumo pf_dora pm_alex pm_santa zf_xiaobei zf_xiaoni zf_xiaoxiao zf_xiaoyi zm_yunjian zm_yunxi zm_yunxia "
    "zm_yunyang em_santa".split())}
WORD = r"[0-9A-Za-zÀ-ÖØ-öø-ÿ'’-]+"


def numeros_por_extenso(t):
    from num2words import num2words
    def num(s):  # "1.500" = mil e quinhentos, "3,5" = três vírgula cinco
        v = float(s.replace('.', '').replace(',', '.')) if ',' in s else int(s.replace('.', ''))
        return ' ' + num2words(v, lang='pt_BR').replace(',', '') + ' '
    N = r'(\d[\d.]*(?:,\d+)?)'
    t = re.sub(r'R\$\s?' + N, lambda m: num(m.group(1)) + 'reais', t)
    t = re.sub(N + r'\s?%', lambda m: num(m.group(1)) + 'por cento', t)
    t = re.sub(N, lambda m: num(m.group(1)), t)
    return re.sub(r'\s+([,.!?;:])', r'\1', re.sub(r' {2,}', ' ', t)).strip()


def preparar(texto):
    t = numeros_por_extenso(texto).replace('’', "'").replace('—', ', ').replace('–', ', ')
    return t.lower()


def construir_lexico(textos, pron, caminho):
    import espeakng_loader
    from phonemizer.backend.espeak.wrapper import EspeakWrapper
    EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
    from phonemizer.backend import EspeakBackend
    from phonemizer.separator import Separator
    tok = set(l.rsplit(' ', 1)[0] for l in open(f'{M}/tokens.txt', encoding='utf8').read().splitlines())
    be = EspeakBackend('pt-br', preserve_punctuation=False, with_stress=True)
    lex = {}
    for t in textos:  # fonemas em contexto (acerta "e", "de", "o" átonos)
        ws = re.findall(WORD, t)
        ph = be.phonemize([' '.join(ws)], strip=True, separator=Separator(word=' | ', phone=''))[0].split(' | ')
        if len(ph) == len(ws):
            for w, p in zip(ws, ph): lex.setdefault(w, p)
    faltam = sorted({w for t in textos for w in re.findall(WORD, t)} - set(lex))
    if faltam:
        for w, p in zip(faltam, be.phonemize(faltam, strip=True)): lex[w] = p
    for w, p in pron.items(): lex[w.lower()] = p  # pronúncias manuais (IPA) vencem
    with open(caminho, 'w', encoding='utf8') as f:
        for w, p in lex.items():
            for v in {w, w.replace("'", '')} | set(w.split('-')):
                if v: f.write(v + ' ' + ' '.join(ch for ch in p.replace(' ', '') if ch in tok) + '\n')
    return lex


_PIPER = {}
def piper_tts(modelo, texto, vel, pron):
    """Piper: modelo = 'faber-medium', 'cadu-medium', 'jeff-medium', 'miro-high', 'edresson-low', 'dii-high'."""
    import glob, wave, io
    from piper import PiperVoice, SynthesisConfig
    if modelo not in _PIPER:
        D = os.path.expanduser(f'~/models/vits-piper-pt_BR-{modelo}'); fs = glob.glob(f'{D}/*.onnx')
        if not fs: sys.exit(f'falta o modelo Piper {modelo}: baixe vits-piper-pt_BR-{modelo}.tar.bz2 (ver Instalação)')
        _PIPER[modelo] = PiperVoice.load(fs[0], config_path=fs[0] + '.json')
    for w, p in pron.items(): texto = re.sub(r'\b' + re.escape(w) + r'\b', f'[[ {p} ]]', texto, flags=re.I)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wv: _PIPER[modelo].synthesize_wav(texto, wv, syn_config=SynthesisConfig(length_scale=(1 / vel) ** 2.3))  # no Piper o efeito é mais fraco; o expoente compensa
    buf.seek(0); s, sr = sf.read(buf, dtype='float32'); return s, sr


def gerar(proj, so=None):
    import sherpa_onnx
    R = json.load(open(f'{proj}/roteiro.json', encoding='utf8')); A = f'{proj}/audio'; os.makedirs(A, exist_ok=True)
    falas = R['falas']; textos = {f['id']: preparar(f['texto']) for f in falas}; pron = R.get('pronuncias', {})
    tts = None
    if any(not str(R['vozes'][f['voz']]).startswith('piper:') for f in falas):
        construir_lexico(list(textos.values()), pron, f'{A}/lex_pt.txt')
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=f'{M}/model.onnx', voices=f'{M}/voices.bin', tokens=f'{M}/tokens.txt', data_dir=f'{M}/espeak-ng-data',
            dict_dir=f'{M}/dict', lexicon=f'{A}/lex_pt.txt', lang='pt-br'), num_threads=4))
        tts = sherpa_onnx.OfflineTts(cfg)
    info = json.load(open(f'{A}/falas.json')) if os.path.exists(f'{A}/falas.json') else {}
    for f in falas:
        k = f['id']
        if so and k not in so: continue
        if info.get(k, {}).get('externo'): continue  # fala importada de áudio externo: não regerar
        nome = str(R['vozes'][f['voz']])
        if nome.startswith('piper:'):
            s, sr = piper_tts(nome[6:], numeros_por_extenso(f['texto']), f.get('vel', 1.0), pron)
        else:
            sid = SPK[nome] if nome in SPK else int(nome)
            a = tts.generate(textos[k], sid=sid, speed=f.get('vel', 1.0)); s = np.array(a.samples, dtype=np.float32); sr = a.sample_rate
        idx = np.where(np.abs(s) > 0.012 * np.abs(s).max())[0]; s = s[max(idx[0] - int(sr * .0125), 0): idx[-1] + int(sr * .0625)]
        sf.write(f'{A}/{k}.wav', s, sr)
        info[k] = dict(dur=round(len(s) / sr, 3), voz=f['voz'], texto=f['texto'])
        print(k, info[k]['dur'], 's', f['texto'][:60], flush=True)
    info = {f['id']: info[f['id']] for f in falas if f['id'] in info}
    json.dump(info, open(f'{A}/falas.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    tot = sum(v['dur'] for v in info.values()); pal = sum(len(f['texto'].split()) for f in falas)
    print(f'fala total {tot:.1f} s | {pal} palavras | {pal / max(tot, 1) * 60:.0f} palavras/min')


if __name__ == '__main__':
    gerar(sys.argv[1], set(sys.argv[2:]) or None)
```

### arquivo: verificar.py

```python
"""Verificação: transcreve o áudio (Parakeet v3, entende português) e compara com o roteiro; folha de contato do vídeo.
Uso: python3 verificar.py PROJETO_DIR [arquivo.wav|mp4]     (padrão: PROJETO_DIR/mix.wav)
     python3 verificar.py PROJETO_DIR --falas               (confere cada fala isolada, antes do render)
"""
import os, re, sys, json, difflib, subprocess, unicodedata
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

M = os.path.expanduser('~/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8')


def rec():
    import sherpa_onnx
    return sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{M}/encoder.int8.onnx', decoder=f'{M}/decoder.int8.onnx',
        joiner=f'{M}/joiner.int8.onnx', tokens=f'{M}/tokens.txt', num_threads=2, model_type='nemo_transducer')


def transcrever(r, fn):
    if fn.endswith('.mp4'):
        wav = fn[:-4] + '_asr.wav'; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', fn, '-ac', '1', '-ar', '16000', wav], check=True); fn = wav
    s, sr = sf.read(fn, dtype='float32'); s = s.mean(1) if s.ndim > 1 else s
    if sr != 16000: s = resample_poly(s, 16000, sr).astype(np.float32)
    out = []
    for i in range(0, len(s), 16000 * 24):
        st = r.create_stream(); st.accept_waveform(16000, s[i:i + 16000 * 24]); r.decode_stream(st); out.append(st.result.text)
    return ' '.join(out)


def norm(t):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from vozes import numeros_por_extenso
    t = numeros_por_extenso(t).lower()
    t = ''.join(ch for ch in unicodedata.normalize('NFD', t) if unicodedata.category(ch) != 'Mn')
    return re.findall(r"[a-z]+", t)


def comparar(ref, hyp):
    a, b = norm(ref), norm(hyp); sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    erros = [(' '.join(a[i1:i2]), ' '.join(b[j1:j2])) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
    return 1 - sm.ratio(), erros


if __name__ == '__main__':
    P = os.path.abspath(sys.argv[1]); R = json.load(open(f'{P}/roteiro.json', encoding='utf8')); r = rec()
    if len(sys.argv) > 2 and sys.argv[2] == '--falas':
        for f in R['falas']:
            h = transcrever(r, f"{P}/audio/{f['id']}.wav"); d, e = comparar(f['texto'], h)
            flag = 'OK ' if d < .12 else 'VER'
            print(f"{flag} {f['id']:6s} dif {d:.0%} | ouvido: {h}" + (f"  | trocas: {e[:3]}" if d >= .12 else ''))
    else:
        fn = sys.argv[2] if len(sys.argv) > 2 else f'{P}/mix.wav'
        h = transcrever(r, fn); ref = ' '.join(f['texto'] for f in R['falas']); d, e = comparar(ref, h)
        print(f'diferença geral {d:.0%} (até ~10% é normal: nomes próprios e números)')
        for x, y in e[:25]: print(f'  roteiro: "{x}"  ->  ouvido: "{y}"')
        open(f'{P}/transcricao.txt', 'w', encoding='utf8').write(h)
```

### arquivo: importar_audio.py

```python
"""Importa áudio externo (ElevenLabs, gravação própria, qualquer mp3/wav/m4a/mp4).
  Narração inteira:  python3 importar_audio.py PROJ narracao.mp3
      - se PROJ/roteiro.json existe: alinha cada fala do roteiro ao áudio (pela transcrição) e corta;
      - se não existe: cria o roteiro.json a partir da transcrição (uma fala por frase, tudo com a voz "narrador").
  Uma fala por arquivo:  python3 importar_audio.py PROJ pasta/   (arquivos com o nome do id: n1.mp3, c2.wav...)
Os cortes mantêm as pausas naturais da narração; a linha do tempo não acrescenta silêncio entre essas falas.
"""
import os, re, sys, json, glob, difflib, subprocess, unicodedata
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vozes import numeros_por_extenso

SR = 48000
ASR = os.path.expanduser('~/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8')


def carregar(fn):
    out = '/tmp/_imp.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', fn, '-vn', '-ac', '1', '-ar', str(SR), out], check=True)
    s, _ = sf.read(out, dtype='float32'); return s


def palavras_com_tempo(s):
    """Transcreve em blocos cortados em silêncios e devolve [(palavra, ini, fim)] + texto com pontuação."""
    import sherpa_onnx
    r = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{ASR}/encoder.int8.onnx', decoder=f'{ASR}/decoder.int8.onnx',
        joiner=f'{ASR}/joiner.int8.onnx', tokens=f'{ASR}/tokens.txt', num_threads=2, model_type='nemo_transducer')
    x = resample_poly(s, 16000, SR).astype(np.float32); n = len(x); hop = 1600
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, n, hop)])
    cuts = [0]
    while n - cuts[-1] > 16000 * 24:  # corta no ponto mais silencioso entre 14 e 22 s do bloco
        a = (cuts[-1] + 16000 * 14) // hop; b = (cuts[-1] + 16000 * 22) // hop
        cuts.append(int((a + np.argmin(rms[a:b])) * hop + hop // 2))
    cuts.append(n); words = []
    for c0, c1 in zip(cuts, cuts[1:]):
        st = r.create_stream(); st.accept_waveform(16000, x[c0:c1]); r.decode_stream(st); R = st.result; off = c0 / 16000
        novo = True  # início de bloco também começa palavra nova
        for tok, ts, du in zip(R.tokens, R.timestamps, R.durations):
            if tok.startswith(' ') or novo: words.append([tok.strip(), ts + off, ts + off + du])
            else: words[-1][0] += tok; words[-1][2] = ts + off + du
            novo = False
    words = [w for w in words if w[0]]
    merged = []  # junta pedaços vazios/pontuação colados
    for w in words:
        if merged and re.fullmatch(r'[.,!?;:…]+', w[0]): merged[-1][0] += w[0]; merged[-1][2] = w[2]
        else: merged.append(w)
    return [(w[0], w[1], w[2]) for w in merged]  # ex.: ('Paris,', 0.08, 0.48)


def norm_words(t):
    t = numeros_por_extenso(t).lower()
    t = ''.join(ch for ch in unicodedata.normalize('NFD', t) if unicodedata.category(ch) != 'Mn')
    return re.findall(r'[a-z]+', t)


def inicios_alinhados(falas, words):
    """Para cada fala do roteiro, acha o instante em que ela começa no áudio."""
    ref = []; owner = []
    for i, f in enumerate(falas):
        ws = norm_words(f['texto']); ref += ws; owner += [i] * len(ws)
    hyp = []; htime = []
    for w, a, b in words:
        ws = norm_words(w) or ['']
        for j, x in enumerate(ws): hyp.append(x); htime.append(a + (b - a) * j / len(ws))
    sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False); m = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): m[blk.a + k] = blk.b + k
    first = {}; cover = {}
    for p, i in enumerate(owner):
        cover.setdefault(i, [0, 0]); cover[i][1] += 1
        if p in m: cover[i][0] += 1
        if i not in first and p in m:
            k0 = owner.index(i); first[i] = max(0.0, htime[m[p]] - (p - k0) * 0.33)
    starts = []
    for i in range(len(falas)):  # falas sem correspondência: interpola entre vizinhas
        if i in first: starts.append(first[i]); continue
        prev = starts[-1] if starts else 0.0; nxt = next((first[j] for j in range(i + 1, len(falas)) if j in first), None)
        starts.append(prev + 0.5 if nxt is None else (prev + nxt) / 2)
    for i in range(1, len(starts)): starts[i] = max(starts[i], starts[i - 1] + 0.3)
    return starts, {i: c[0] / max(c[1], 1) for i, c in cover.items()}


def frases(words):
    """Sem roteiro: agrupa palavras em frases pela pontuação (frases muito curtas se juntam à seguinte)."""
    out = []; cur = []
    for w in words:
        cur.append(w)
        if re.search(r'[.!?…]$', w[0]) and (len(cur) >= 4 or w is words[-1]): out.append(cur); cur = []
    if cur: out.append(cur)
    return out


def importar_narracao(P, fn):
    s = carregar(fn); A = f'{P}/audio'; os.makedirs(A, exist_ok=True)
    print('transcrevendo', round(len(s) / SR, 1), 's de áudio...', flush=True); words = palavras_com_tempo(s)
    rp = f'{P}/roteiro.json'
    if os.path.exists(rp):
        R = json.load(open(rp, encoding='utf8')); falas = R['falas']; starts, cov = inicios_alinhados(falas, words)
        ruins = [falas[i]['id'] for i, c in cov.items() if c < .5]
        if ruins: print('ATENÇÃO: estas falas quase não aparecem no áudio (roteiro e áudio diferentes?):', ' '.join(ruins))
    else:
        grupos = frases(words); starts = [g[0][1] for g in grupos]
        falas = [dict(id=f'n{i + 1}', voz='narrador', texto=' '.join(w[0] for w in g)) for i, g in enumerate(grupos)]
        R = dict(titulo=os.path.basename(P), narrador='narrador', musica='misterio', vozes={'narrador': 'externo'}, pronuncias={}, falas=falas)
        json.dump(R, open(rp, 'w', encoding='utf8'), ensure_ascii=False, indent=1); print('roteiro.json criado a partir do áudio:', len(falas), 'falas')
    info = {}; L = len(s)
    for i, f in enumerate(falas):  # corta 0,12 s antes de cada início (respiração), mantendo a pausa natural no fim
        a = int(max(0, starts[i] - .12) * SR) if i else 0; b = int(max(0, starts[i + 1] - .12) * SR) if i + 1 < len(falas) else L
        seg = s[a:b]; sf.write(f"{A}/{f['id']}.wav", seg, SR)
        info[f['id']] = dict(dur=round(len(seg) / SR, 3), voz=f['voz'], texto=f['texto'], externo=True, ini=round(a / SR, 3))
    json.dump(info, open(f'{A}/falas.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print('ok:', len(falas), 'falas cortadas |', round(L / SR, 1), 's | confira com: verificar.py', P, '--falas')


def importar_pasta(P, pasta):
    R = json.load(open(f'{P}/roteiro.json', encoding='utf8')); A = f'{P}/audio'; os.makedirs(A, exist_ok=True)
    info = json.load(open(f'{A}/falas.json', encoding='utf8')) if os.path.exists(f'{A}/falas.json') else {}
    for f in R['falas']:
        cand = glob.glob(f"{pasta}/{f['id']}.*")
        if not cand: print('sem arquivo para', f['id'], '(fica a voz sintética)'); continue
        s = carregar(cand[0]); idx = np.where(np.abs(s) > 0.012 * np.abs(s).max())[0]; s = s[max(idx[0] - 600, 0): idx[-1] + 3000]
        sf.write(f"{A}/{f['id']}.wav", s, SR); info[f['id']] = dict(dur=round(len(s) / SR, 3), voz=f['voz'], texto=f['texto'], externo='fala')
        print('importada', f['id'], info[f['id']]['dur'], 's')
    info = {f['id']: info[f['id']] for f in R['falas'] if f['id'] in info}
    json.dump(info, open(f'{A}/falas.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    P = os.path.abspath(sys.argv[1]); os.makedirs(P, exist_ok=True)
    (importar_pasta if os.path.isdir(sys.argv[2]) else importar_narracao)(P, sys.argv[2])
```

### arquivo: importar_roteiro.py

```python
"""Importa um roteiro externo (.txt, .md, .docx, .pdf, .srt ou texto colado salvo em .txt) e gera PROJ/roteiro.json.
Uso: python3 importar_roteiro.py PROJ arquivo [--narrador VOZ] [--formato 9:16]
Regras de leitura:
  - "# Título" ou "CAPÍTULO 2: A Virada" ou linha curta toda em maiúsculas  -> cartão de capítulo
  - "NOME: fala" (também **NOME:**, - NOME:, NOME —)                         -> fala do personagem NOME
  - [entre colchetes] ou (entre parênteses) sozinho na linha                  -> nota de cena (vai junto da próxima fala)
  - o resto                                                                    -> narrador, uma fala por frase
"""
import os, re, sys, json, subprocess, unicodedata

VOZES_PERSONAGENS = ['pm_santa', 'pf_dora', 'em_alex', 'im_nicola', 'ff_siwis', 'bm_george']


def ler(fn):
    ext = os.path.splitext(fn)[1].lower()
    if ext == '.docx':
        import docx
        return '\n'.join(p.text for p in docx.Document(fn).paragraphs)
    if ext == '.pdf':
        return subprocess.run(['pdftotext', '-layout', fn, '-'], capture_output=True, text=True, check=True).stdout
    t = open(fn, encoding='utf8', errors='replace').read()
    if ext == '.srt':  # legenda: tira números e tempos
        t = '\n'.join(l for l in t.splitlines() if l.strip() and not re.match(r'^\d+$', l.strip()) and '-->' not in l)
    return t


def slug(s):
    s = ''.join(ch for ch in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(ch) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '_', s).strip('_') or 'personagem'


def frases(t):
    t = re.sub(r'\s+', ' ', t).strip()
    partes = re.split(r'(?<=[.!?…])\s+(?=[A-ZÀ-Ú0-9"“«\-—])', t)
    out = []
    for p in partes:  # frase muito curta (até 3 palavras) junta com a anterior
        if out and len(p.split()) <= 3 and len(out[-1].split()) < 14: out[-1] += ' ' + p
        else: out.append(p)
    return [p for p in out if p]


CAP = re.compile(r'^(#{1,4}\s*(.+)|(?:cap[ií]tulo|parte|ato)\s*\w*\s*[:\-–—.]\s*(.+))$', re.I)
FALA = re.compile(r'^[\-–—•*\s]*\**([A-ZÀ-Úa-zà-ú][\wÀ-ú .\']{0,28}?)\**\s*[:–—]\s*\**\s*(.+)$')
NOTA = re.compile(r'^[\[(](.+)[\])]$')


def importar(P, fn, narrador='pm_alex', formato=None):
    texto = ler(fn); falas = []; caps = []; notas = {}; vozes = {'narrador': narrador}; pend = []; n = 0; buf = []
    def nova(voz, txt):
        nonlocal n
        n += 1; k = f'n{n}' if voz == 'narrador' else f'{voz[:1]}{n}'
        falas.append(dict(id=k, voz=voz, texto=txt.strip()))
        if pend: notas[k] = ' | '.join(pend); pend.clear()
    def descarrega():
        if buf:
            for f in frases(' '.join(buf)): nova('narrador', f)
            buf.clear()
    for raw in texto.splitlines():
        l = raw.strip().strip('\ufeff')
        if not l: descarrega(); continue
        m = CAP.match(l)
        up = l.isupper() and len(l.split()) <= 6 and not re.search(r'[.!?,]$', l) and len(l) > 2
        if m or up:
            descarrega(); titulo = (m.group(2) or m.group(3)) if m else l.title()
            caps.append(dict(antes=f'#{len(falas)}', titulo=titulo.strip(' *#'))); continue
        m = NOTA.match(l)
        if m: descarrega(); pend.append(m.group(1).strip()); continue
        m = FALA.match(l)
        if m and m.group(1).strip().lower() not in ('obs', 'nota', 'http', 'https') and len(m.group(1).split()) <= 3:
            descarrega(); nome = slug(m.group(1))
            if nome in ('narrador', 'narracao', 'narradora', 'voz'): buf.append(m.group(2)); descarrega(); continue
            if nome not in vozes: vozes[nome] = VOZES_PERSONAGENS[(len(vozes) - 1) % len(VOZES_PERSONAGENS)]
            nova(nome, m.group(2)); continue
        buf.append(l)
    descarrega()
    for c in caps:  # '#3' -> id da fala que vem depois do cartão
        i = int(c['antes'][1:]); c['antes'] = falas[i]['id'] if i < len(falas) else None
    R = dict(titulo=os.path.splitext(os.path.basename(fn))[0], narrador='narrador', musica='misterio', vozes=vozes,
             pronuncias={}, falas=falas, capitulos=caps, notas=notas)
    if formato: R['formato'] = formato
    os.makedirs(P, exist_ok=True)
    if os.path.exists(f'{P}/roteiro.json'):
        old = json.load(open(f'{P}/roteiro.json', encoding='utf8'))
        for k in ('musica', 'pronuncias', 'legendas', 'formato'):  # mantém ajustes já feitos no projeto
            if k in old and not (k == 'formato' and formato): R[k] = old[k]
    json.dump(R, open(f'{P}/roteiro.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    pal = sum(len(f['texto'].split()) for f in falas)
    print(f'roteiro.json: {len(falas)} falas | {pal} palavras (~{pal / 155:.1f} min de fala) | {len(caps)} capítulos | personagens: {", ".join(k for k in vozes if k != "narrador") or "nenhum"}')
    for c in caps: print('  capítulo:', c['titulo'], '-> antes de', c['antes'])
    if notas: print(f'  {len(notas)} notas de cena guardadas em "notas"')


if __name__ == '__main__':
    a = sys.argv[1:]; opt = {a[i][2:]: a[i + 1] for i in range(len(a)) if a[i].startswith('--')}
    pos = [x for i, x in enumerate(a) if not x.startswith('--') and (i == 0 or not a[i - 1].startswith('--'))]
    importar(os.path.abspath(pos[0]), pos[1], opt.get('narrador', 'pm_alex'), opt.get('formato'))
```

### arquivo: editor_personagens.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Animações Ideias Artificiais · Personagens</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --noite: #1C0838; --noite-2: #2A1150; --roxo: #6B2FD6; --roxo-claro: #8C5CF0; --lilas: #C9B6FF; --lilas-tile: #E9E0FF;
    --neon: #3DFF8F; --azul: #2FA8FF; --texto: #F4EEFF; --texto-2: #B9A8E0;
    --r-grande: 22px; --r-medio: 14px; --r-peq: 10px;
    --barra: 76px;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--noite); color: var(--texto); font: 500 15px/1.45 Nunito, system-ui, sans-serif; }
  button, input { font: inherit; color: inherit; }
  button { cursor: pointer; border: 0; background: none; }
  :focus-visible { outline: 3px solid var(--azul); outline-offset: 2px; }
  h1, h2, h3 { font-family: 'Baloo 2', Nunito, sans-serif; margin: 0; line-height: 1.1; }

  /* topo */
  .topo { display: flex; align-items: center; gap: 12px; padding: 12px 18px; }
  .topo svg { flex: none; }
  .topo h1 { font-size: 21px; font-weight: 800; letter-spacing: .2px; }
  .topo p { margin: 0; color: var(--texto-2); font-size: 13px; }

  /* app */
  .app { display: grid; grid-template-columns: minmax(0, 1fr); padding-bottom: calc(var(--barra) + env(safe-area-inset-bottom)); }
  @media (min-width: 960px) {
    .app { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 22px; padding: 0 22px calc(var(--barra) + 18px); max-width: 1320px; margin: 0 auto; }
  }

  /* palco: o elemento marcante */
  .palco-area { min-width: 0; position: sticky; top: 0; z-index: 5; background: var(--noite); padding: 0 12px 8px; }
  /* digitando no celular: o teclado ocupa metade da tela, então palco e barra saem do caminho do campo */
  body.digitando .barra { display: none; }
  body.digitando .app { padding-bottom: 24px; }
  @media (max-width: 959px) { body.digitando .palco-area { position: static; } }
  @media (min-width: 960px) { .palco-area { position: static; padding: 0; } }
  .palco { position: relative; border-radius: var(--r-grande); overflow: hidden; height: min(31vh, 300px);
    background: radial-gradient(ellipse 55% 70% at 50% 20%, #7B45E8 0%, #4A1C9E 45%, #24104A 100%); }
  @media (min-width: 960px) { .palco { height: auto; aspect-ratio: 1 / 1.02; } }
  .palco::after { content: ''; position: absolute; left: 50%; bottom: 6%; width: 46%; height: 9%; transform: translateX(-50%);
    border-radius: 50%; border: 3px solid var(--neon); box-shadow: 0 0 18px rgba(61, 255, 143, .55), inset 0 0 12px rgba(61, 255, 143, .35); pointer-events: none; }
  .palco canvas { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1; }
  .palco .nome { position: absolute; top: 12px; left: 14px; z-index: 2; font: 800 22px 'Baloo 2', Nunito, sans-serif; text-shadow: 0 2px 0 #1C0838; }
  .acoes-palco { position: absolute; top: 10px; right: 10px; z-index: 2; display: flex; gap: 6px; }
  .acoes-palco button, .ctrl-palco button { background: rgba(28, 8, 56, .72); border: 1px solid rgba(201, 182, 255, .35); border-radius: 999px; padding: 6px 12px; font-size: 13px; font-weight: 700; }
  .acoes-palco button:hover, .ctrl-palco button:hover { border-color: var(--lilas); }
  .ctrl-palco { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; display: flex; gap: 10px; align-items: center; }
  .ctrl-palco input[type=range] { flex: 1; accent-color: var(--lilas); }
  .ctrl-palco label { font-size: 12px; color: var(--texto-2); }

  /* faixa do elenco */
  .elenco { display: flex; gap: 10px; overflow-x: auto; padding: 10px 2px 4px; scrollbar-width: thin; }
  .ator { flex: none; width: 76px; position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .ator .foto { width: 64px; height: 64px; border-radius: 50%; background: var(--lilas-tile); border: 3px solid transparent; overflow: hidden; }
  .ator .foto canvas { width: 100%; height: 100%; display: block; }
  .ator.atual .foto { border-color: var(--azul); }
  .ator .n { font-size: 12px; font-weight: 700; max-width: 76px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--texto-2); }
  .ator.atual .n { color: var(--texto); }
  .ator .vai { position: absolute; top: 0; right: 2px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
    background: var(--noite-2); border: 2px solid var(--texto-2); font-size: 14px; font-weight: 800; color: transparent; }
  .ator .vai[aria-pressed=true] { background: var(--neon); border-color: var(--neon); color: #12301F; }
  @media (max-width: 959px) {
    .palco-area .passos { margin-top: 8px; }
    .palco { height: min(27vh, 260px); }
    .elenco { padding-top: 8px; gap: 8px; }
    .grade { grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 6px; } .op { font-size: 12px; }
    .ator { width: 60px; } .ator .foto { width: 52px; height: 52px; } .ator .n { font-size: 11px; max-width: 60px; }
    .ator .vai { width: 22px; height: 22px; font-size: 12px; right: 0; }
    .topo { padding: 10px 14px; } .topo h1 { font-size: 18px; } .topo svg { width: 32px; height: 32px; }
    .ctrl-palco button, .acoes-palco button { padding: 5px 10px; font-size: 12px; }
  }
  .ator .tirar { position: absolute; top: 0; left: 2px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;
    background: var(--noite-2); border: 2px solid #FF7A9A; color: #FF9AB3; font-size: 15px; font-weight: 800; line-height: 1; padding: 0; }
  .ator .tirar:hover { background: #FF7A9A; color: #2A0A18; }
  @media (max-width: 959px) { .ator .tirar { width: 22px; height: 22px; font-size: 14px; left: 0; } }
  .conf-lista { display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 14px; max-height: 46vh; overflow: auto; }
  .conf-lista figure { margin: 0; width: 84px; text-align: center; font-size: 12px; font-weight: 700; }
  .conf-lista canvas { width: 72px; height: 72px; border-radius: 50%; background: var(--lilas-tile); display: block; margin: 0 auto 4px; }
  .conf-acoes { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
  .novo .foto { display: grid; place-items: center; background: transparent; border: 2px dashed var(--lilas); font: 800 30px 'Baloo 2', Nunito, sans-serif; color: var(--lilas); }
  .novo.limpar .foto { border-color: #FF9AB3; font-size: 24px; }

  /* painel de passos */
  .painel { padding: 6px 12px 0; min-width: 0; }
  @media (min-width: 960px) { .painel { padding: 0; } }
  .passos { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; background: var(--noite-2); border-radius: 999px; padding: 4px; }
  @media (min-width: 960px) { .passos { position: sticky; top: 8px; z-index: 4; } }
  .passos button { border-radius: 999px; padding: 8px 4px; font-weight: 800; font-size: 13px; color: var(--texto-2); display: flex; gap: 6px; align-items: center; justify-content: center; }
  .passos button .num { width: 20px; height: 20px; border-radius: 50%; display: inline-grid; place-items: center; font-size: 11px; background: rgba(201, 182, 255, .18); }
  .passos button[aria-selected=true] { background: var(--roxo); color: var(--texto); }
  .passos button[aria-selected=true] .num { background: var(--lilas); color: var(--noite); }
  @media (max-width: 520px) { .passos button .rot { display: none; } .passos button[aria-selected=true] .rot { display: inline; } .passos { grid-template-columns: repeat(5, auto); justify-content: space-between; } }

  .passo { padding: 16px 2px 8px; }
  .passo h2 { font-size: 26px; font-weight: 800; margin-bottom: 2px; }
  .passo .sub { margin: 0 0 14px; color: var(--texto-2); }
  .grupo { margin: 0 0 18px; }
  .grupo h3 { font-size: 17px; font-weight: 700; margin: 0 0 8px; color: var(--lilas); }
  .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; }
  .op { background: var(--lilas-tile); color: #2A1150; border-radius: var(--r-medio); padding: 4px 4px 7px; display: flex; flex-direction: column; align-items: center; gap: 2px; border: 3px solid transparent; font-weight: 800; font-size: 13px; line-height: 1.15; text-align: center; }
  .op canvas { width: 100%; aspect-ratio: 1; display: block; }
  .op[aria-pressed=true] { border-color: var(--azul); background: #fff; }
  .op:hover { border-color: rgba(47, 168, 255, .45); }
  .cores { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .cor { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, .18); }
  .cor[aria-pressed=true] { border-color: var(--texto); box-shadow: 0 0 0 3px var(--azul); }
  .cor-livre { position: relative; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px dashed var(--lilas); }
  .cor-livre input { position: absolute; inset: -8px; width: 52px; height: 52px; border: 0; padding: 0; cursor: pointer; opacity: 0; }
  .cor-livre span { position: absolute; inset: 0; display: grid; place-items: center; font-weight: 800; color: var(--lilas); pointer-events: none; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { border-radius: 999px; padding: 8px 14px; background: var(--noite-2); border: 2px solid rgba(201, 182, 255, .3); font-weight: 700; }
  .chip[aria-pressed=true] { background: var(--azul); border-color: var(--azul); color: #06223A; }
  .linha-cor { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(201, 182, 255, .14); }
  .linha-cor input[type=color] { width: 46px; height: 34px; border: 0; background: none; padding: 0; }
  .alternar { display: flex; align-items: center; gap: 10px; font-weight: 700; padding: 6px 0; }
  .alternar input { width: 20px; height: 20px; accent-color: var(--neon); }
  .campo { display: flex; gap: 8px; }
  .campo input { flex: 1; background: var(--noite-2); border: 2px solid rgba(201, 182, 255, .3); border-radius: var(--r-peq); padding: 10px 12px; }
  .bt { border-radius: var(--r-peq); padding: 10px 16px; font-weight: 800; background: var(--roxo); }
  .bt:hover { background: var(--roxo-claro); }
  .bt.sec { background: transparent; border: 2px solid rgba(201, 182, 255, .35); }
  .lista-video { display: flex; flex-direction: column; gap: 6px; }
  .lista-video label { display: flex; align-items: center; gap: 12px; padding: 6px 10px; border-radius: var(--r-medio); background: var(--noite-2); font-weight: 700; cursor: pointer; }
  .lista-video canvas { width: 44px; height: 44px; border-radius: 50%; background: var(--lilas-tile); }
  .lista-video input { width: 22px; height: 22px; accent-color: var(--neon); margin-left: auto; }
  details { background: var(--noite-2); border-radius: var(--r-medio); padding: 10px 14px; }
  summary { font-weight: 800; cursor: pointer; }
  textarea { width: 100%; height: 130px; margin: 10px 0; background: #12052A; color: #E3D8FF; border: 1px solid rgba(201, 182, 255, .3); border-radius: var(--r-peq); font: 12px ui-monospace, monospace; padding: 8px; }
  .nav-passos { display: flex; justify-content: space-between; gap: 10px; padding: 4px 2px 18px; }

  /* barra de ação */
  .barra { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; display: flex; align-items: center; gap: 12px; justify-content: space-between;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: #1C0838; border-top: 1px solid rgba(201, 182, 255, .2); box-shadow: 0 -10px 24px rgba(10, 2, 24, .55); }
  .barra .resumo { font-weight: 700; color: var(--texto-2); font-size: 14px; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .barra .resumo .longo { display: none; }
  @media (min-width: 560px) { .barra .resumo .longo { display: inline; } .barra .resumo .curto { display: none; } }
  .barra .resumo b { color: var(--texto); }
  .cta { background: var(--neon); color: #0E2A1A; border-radius: 999px; padding: 13px 22px; font: 800 16px Nunito, system-ui, sans-serif; box-shadow: 0 0 22px rgba(61, 255, 143, .35); white-space: nowrap; }
  .cta:disabled { background: #4A3A6E; color: var(--texto-2); box-shadow: none; cursor: not-allowed; }

  /* janela de modelos */
  dialog { border: 0; border-radius: var(--r-grande); background: var(--noite-2); color: var(--texto); padding: 18px; width: min(560px, 94vw); }
  dialog::backdrop { background: rgba(10, 2, 24, .7); }
  dialog h2 { font-size: 24px; margin-bottom: 12px; }
  .aviso { position: fixed; left: 50%; bottom: calc(var(--barra) + 14px); transform: translateX(-50%); background: var(--texto); color: var(--noite); padding: 10px 16px; border-radius: 999px; font-weight: 800; z-index: 20; opacity: 0; pointer-events: none; transition: opacity .2s; max-width: 92vw; text-align: center; }
  .aviso.ver { opacity: 1; }
  .aviso.acao { pointer-events: auto; display: flex; align-items: center; gap: 12px; }
  .aviso .desfazer { background: var(--roxo); color: #fff; border: 0; border-radius: 999px; padding: 6px 14px; font-weight: 800; }
  @media (prefers-reduced-motion: reduce) { .aviso { transition: none; } }
  .alerta { background: rgba(47, 168, 255, .14); border: 1px solid rgba(47, 168, 255, .5); border-radius: var(--r-medio); padding: 10px 12px; margin: 0 0 14px; font-weight: 700; }
</style>
</head>
<body>
<header class="topo">
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="17" r="12" fill="#6B2FD6" stroke="#C9B6FF" stroke-width="2.5"/>
    <path d="M14 29h12M16 34h8" stroke="#C9B6FF" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="16" r="2" fill="#F4EEFF"/><circle cx="24" cy="16" r="2" fill="#F4EEFF"/>
    <path d="M15.5 21c2.5 2.2 6.5 2.2 9 0" stroke="#3DFF8F" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M33 5l1.2 2.8L37 9l-2.8 1.2L33 13l-1.2-2.8L29 9l2.8-1.2z" fill="#3DFF8F"/>
  </svg>
  <div><h1>Animações Ideias Artificiais</h1><p>Monte os personagens do seu vídeo</p></div>
</header>

<main class="app">
  <section class="palco-area" aria-label="Personagem e elenco">
    <div class="palco">
      <canvas id="main" width="900" height="900" role="img" aria-label="Prévia do personagem"></canvas>
      <div class="nome" id="nomeAtual"></div>
      <div class="acoes-palco">
        <button id="sortear" title="Sortear um visual novo">Sortear</button>
        <button id="duplicar" title="Criar uma cópia deste personagem">Duplicar</button>
        <button id="remover" title="Tirar este personagem da tela">Remover</button>
      </div>
      <div class="ctrl-palco">
        <button id="expr">Expressão: Normal</button>
        <label for="face">Girar</label><input type="range" id="face" min="-1" max="1" step="0.05">
      </div>
    </div>
    <div class="elenco" id="elenco" aria-label="Elenco"></div>
  </section>

  <section class="painel" id="passoSlot">
    <nav class="passos" role="tablist" id="passos"></nav>
    <div class="passo" id="passo" role="tabpanel"></div>
    <div class="nav-passos"><button class="bt sec" id="voltar">Voltar</button><button class="bt" id="proximo">Próximo</button></div>
  </section>
</main>

<footer class="barra">
  <div class="resumo" id="resumo"></div>
  <button class="cta" id="levar">Copiar para o vídeo</button>
</footer>

<dialog id="janela">
  <h2>Novo personagem</h2>
  <p class="sub" style="color:var(--texto-2);margin:-6px 0 12px">Escolha por onde começar. Dá para mudar tudo depois.</p>
  <div class="grade" id="gradeModelos"></div>
  <div style="text-align:right;margin-top:14px"><button class="bt sec" id="fecharJanela">Cancelar</button></div>
</dialog>
<dialog id="confirma">
  <h2>Quem vai para o vídeo</h2>
  <p style="color:var(--texto-2);margin:-6px 0 8px">Só estes personagens entram na animação. Confira antes de copiar.</p>
  <div class="conf-lista" id="confLista"></div>
  <div class="conf-acoes"><button class="bt sec" id="confVoltar">Voltar e ajustar</button><button class="bt" id="confCopiar">Copiar código</button></div>
</dialog>
<div class="aviso" id="aviso" role="status" aria-live="polite"></div>

<script>
const BODY_TOP = -345, BODY_BOT = -128, HEAD_R = 100, HEAD_CY = BODY_TOP - 74, SHOULDER = [-56, BODY_TOP + 54], ROSA = '#F2A7B5', GOLD = '#F2C14E';
const ESTILOS = {
  noturno: {nome:'Noturno', lw:1, ink:'#18161B', cabeca:1, olhos:'ponto', sombra:true, fundo:['#1d2a66','#0b1238']},
  dia:     {nome:'Dia colorido', lw:1, ink:'#18161B', cabeca:1, olhos:'ponto', sombra:true, fundo:['#cdebfa','#7cc3ec']},
  fofo:    {nome:'Fofo', lw:1.15, ink:'#2A1E2E', cabeca:1.32, olhos:'grande', sombra:true, fundo:['#2a2f6e','#121638']},
  caderno: {nome:'Caderno', lw:.6, ink:'#2B2B33', cabeca:1, olhos:'ponto', sombra:false, fundo:['#f4eedc','#e6dcc2'], cinza:true},
  gibi:    {nome:'Gibi', lw:1.6, ink:'#101014', cabeca:1.08, olhos:'ponto', sombra:true, fundo:['#2b55c8','#14256e'], reticula:true},
  minimal: {nome:'Minimalista', lw:.75, ink:'#3A3A44', cabeca:1, olhos:'ponto', sombra:false, fundo:['#e9e6f2','#d8d4e6']},
  palito:  {nome:'Boneco palito', lw:1, ink:'#1C1C22', cabeca:1.1, olhos:'ponto', sombra:false, fundo:['#f7f1e1','#ebe2c9'], palito:true},
};
const PELES = ['#F3D2B3','#E6BE8E','#D9A877','#C98F62','#A8724A','#8A5A3B','#6B4229','#4A2D1C'];
const PELOS = ['#E8964A','#C8A27A','#EDE8E4','#8A5A3B','#4A4A52','#1C1B22','#D9C6A0','#B0B4BC'];
const CORES_CABELO = ['#1C1B22','#3B2A20','#6B4529','#A0672F','#D9A35B','#E8D08A','#DADADF','#8A8A92','#B8432F','#3E6FA8','#D96FA8'];
const ESPECIES = {humano:'Pessoa', gato:'Gato', cachorro:'Cachorro', coelho:'Coelho', urso:'Urso'};
const CORPOS = {homem:'Homem', mulher:'Mulher', menino:'Menino', menina:'Menina', idoso:'Idoso', idosa:'Idosa'};
const CAB_DATA = {"estilos":{"short":{"frente":[{"f":"h","esp":1,"d":"M -104.7 -7.9 C -100.9 -67.1 -55.1 -113 -0 -113 C 55.1 -113 100.9 -67.1 104.7 -7.9 L 99 10 L 89 12 C 88 -16 80 -36 66 -48 C 52 -58 30 -56 14 -62 L 4 -54 C -14 -62 -34 -58 -44 -66 L -50 -56 C -64 -54 -82 -40 -88 -16 L -89 12 L -99 10 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -40 -66 Q -30 -92 -8 -104"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M 0 -58 Q 12 -84 34 -100"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M 30 -58 Q 46 -80 64 -88"},{"s":"hl","w":1.6,"a":0.55,"d":"M -73 -49.2 C -63.7 -62.9 -50.9 -73.7 -35.8 -80.4"}]},"degrade":{"frente":[{"f":"h","a":0.42,"w":0,"d":"M -101.9 -3.6 C -100 -59.6 -54.9 -104 -0 -104 C 54.9 -104 100 -59.6 101.9 -3.6 L 99 12 L 90 14 C 88 -10 84 -30 74 -44 L -74 -44 C -84 -30 -88 -10 -90 14 L -99 12 Z"},{"f":"h","esp":1,"d":"M -76 -42 C -88 -84 -50 -122 4 -120 C 56 -122 92 -88 78 -40 C 60 -56 40 -62 20 -60 C 0 -70 -30 -62 -44 -56 C -56 -50 -68 -46 -76 -42 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -30 -64 Q -10 -96 24 -110"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M 10 -64 Q 30 -92 60 -96"},{"s":"hl","w":1.6,"a":0.55,"d":"M -69.9 -62.9 C -59.6 -74.3 -46.6 -83.1 -32.1 -88.3"}]},"slick":{"frente":[{"f":"h","esp":1,"d":"M -105.7 -8.1 C -101.9 -68.9 -55.7 -116 -0 -116 C 55.7 -116 101.9 -68.9 105.7 -8.1 L 99 8 L 90 10 C 88 -20 82 -42 68 -54 C 40 -70 0 -70 -36 -58 C -60 -50 -82 -32 -88 -10 L -89 10 L -99 8 Z"},{"s":"hs","w":0.7,"a":1.0,"esp":1,"d":"M -44 -62 Q -42 -90 -36 -110"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -30 -64 Q 10 -104 70 -84"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -10 -64 Q 30 -92 82 -60"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -38 -82 Q 0 -114 56 -104"},{"s":"hl","w":1.8,"a":0.55,"d":"M -59.1 -75.6 C -45.8 -86 -30 -92.7 -13.4 -95.1"}]},"topete":{"frente":[{"f":"h","a":0.42,"w":0,"d":"M -101.9 -3.6 C -100 -59.6 -54.9 -104 -0 -104 C 54.9 -104 100 -59.6 101.9 -3.6 L 99 12 L 90 14 C 88 -10 84 -30 74 -46 L -74 -46 C -84 -30 -88 -10 -90 14 L -99 12 Z"},{"f":"h","esp":1,"alto":1,"d":"M -78 -40 C -92 -92 -56 -126 -6 -124 C 18 -150 70 -150 92 -118 C 104 -100 96 -70 80 -54 C 70 -74 50 -82 30 -76 C 14 -80 0 -70 -12 -66 C -40 -60 -62 -52 -78 -40 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M -40 -64 Q -10 -108 40 -128"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M -6 -72 Q 30 -112 78 -118"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M 30 -80 Q 60 -100 88 -98"},{"s":"hl","w":1.8,"a":0.55,"alto":1,"d":"M -70.9 -87.4 C -55.4 -102.3 -35.5 -112 -14.2 -115"}]},"espetado":{"frente":[{"f":"h","esp":1,"alto":1,"d":"M -99 8 L -90 10 C -86 -20 -76 -40 -60 -52 C -40 -46 -26 -64 -10 -58 C 6 -52 24 -64 40 -56 C 54 -50 66 -54 74 -46 C 84 -32 88 -12 90 10 L 99 8 C 104 -20 106 -48 102 -64 Q 116 -86 100 -96 C 98 -116 82 -126 70 -124 Q 70 -150 44 -146 C 30 -158 6 -158 -6 -144 Q -26 -156 -44 -138 C -64 -142 -82 -130 -82 -112 Q -104 -104 -98 -80 C -110 -60 -108 -26 -99 8 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M -60 -64 Q -62 -96 -70 -118"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M -26 -70 Q -22 -110 -12 -136"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M 14 -68 Q 24 -108 40 -134"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"alto":1,"d":"M 48 -64 Q 64 -96 84 -108"},{"s":"hl","w":1.6,"a":0.55,"d":"M -73.5 -61.7 C -62.7 -74.6 -48.7 -84.4 -32.8 -90.2"}]},"moicano":{"frente":[{"f":"h","a":0.42,"w":0,"d":"M -101.9 -3.6 C -100 -59.6 -54.9 -104 -0 -104 C 54.9 -104 100 -59.6 101.9 -3.6 L 99 12 L 90 14 C 88 -10 84 -30 74 -46 L -74 -46 C -84 -30 -88 -10 -90 14 L -99 12 Z"},{"f":"h","kf":8,"alto":1,"d":"M -36 -60 C -50 -100 -40 -128 -20 -132 Q -14 -158 6 -152 Q 24 -166 34 -142 Q 56 -140 50 -112 C 54 -86 44 -68 36 -58 C 14 -66 -14 -66 -36 -60 Z"},{"s":"hs","w":0.5,"a":1.0,"kf":8,"alto":1,"d":"M -20 -70 Q -18 -110 -6 -140"},{"s":"hs","w":0.5,"a":1.0,"kf":8,"alto":1,"d":"M 10 -70 Q 16 -110 28 -136"}]},"curly":{"frente":[{"f":"h","a":0.42,"w":0,"d":"M -101.9 -3.6 C -100 -59.6 -54.9 -104 -0 -104 C 54.9 -104 100 -59.6 101.9 -3.6 L 99 12 L 90 14 C 88 -10 84 -30 76 -44 L -76 -44 C -84 -30 -88 -10 -90 14 L -99 12 Z"},{"f":"h","alto":1,"d":"O -70 -60 24 24"},{"f":"h","alto":1,"d":"O -58 -92 27 27"},{"f":"h","alto":1,"d":"O -28 -114 28 28"},{"f":"h","alto":1,"d":"O 6 -122 29 29"},{"f":"h","alto":1,"d":"O 40 -114 28 28"},{"f":"h","alto":1,"d":"O 66 -90 27 27"},{"f":"h","alto":1,"d":"O 76 -58 24 24"},{"f":"h","alto":1,"d":"O -36 -72 24 24"},{"f":"h","alto":1,"d":"O -6 -80 25 25"},{"f":"h","alto":1,"d":"O 26 -76 25 25"},{"f":"h","alto":1,"d":"O 52 -66 22 22"},{"f":"h","alto":1,"d":"O -14 -100 26 26"},{"f":"h","alto":1,"d":"O 22 -100 26 26"},{"s":"hs","w":0.5,"alto":1,"d":"M -72 -97.1 C -70.1 -102.1 -65.8 -105.7 -60.6 -106.6 C -55.4 -107.5 -50 -105.6 -46.6 -101.5"},{"s":"hs","w":0.5,"alto":1,"d":"M -9 -127.5 C -7 -132.8 -2.4 -136.7 3.2 -137.7 C 8.8 -138.7 14.6 -136.6 18.2 -132.3"},{"s":"hs","w":0.5,"alto":1,"d":"M 52 -95.1 C 53.9 -100.1 58.2 -103.7 63.4 -104.6 C 68.6 -105.5 74 -103.6 77.4 -99.5"},{"s":"hs","w":0.5,"alto":1,"d":"M -18.9 -84.7 C -17.2 -89.3 -13.2 -92.7 -8.4 -93.5 C -3.5 -94.4 1.4 -92.6 4.5 -88.8"},{"s":"hs","w":0.5,"alto":1,"d":"M 25.5 -119.3 C 27.4 -124.4 31.9 -128.2 37.3 -129.2 C 42.7 -130.1 48.3 -128.1 51.8 -123.9"}]},"afro":{"tras":[{"f":"h","d":"M 130 -22 Q 134.6 -3 130.5 15.5 Q 123.7 33.4 109.4 46.9 Q 102.8 65.3 89.1 78.7 Q 73.5 90.1 54 93.9 Q 38.3 105.9 19.4 109.9 Q 0 111.3 -18.5 104.1 Q -38.3 105.9 -56.5 99.2 Q -73.5 90.1 -85.1 74.3 Q -102.8 65.3 -114.4 50.1 Q -123.7 33.4 -124.7 13.9 Q -134.6 -3 -136 -22 Q -134.6 -41 -124.7 -57.9 Q -123.7 -77.4 -114.4 -94.1 Q -102.8 -109.3 -85.1 -118.3 Q -73.5 -134.1 -56.5 -143.2 Q -38.3 -149.9 -18.5 -148.1 Q -0 -155.3 19.4 -153.9 Q 38.3 -149.9 54 -137.9 Q 73.5 -134.1 89.1 -122.7 Q 102.8 -109.3 109.4 -90.9 Q 123.7 -77.4 130.5 -59.5 Q 134.6 -41 130 -22 Z"}],"frente":[{"f":"h","clip":"cobre","d":"M -110 20 C -110 -60 -60 -120 0 -120 C 60 -120 110 -60 110 20 L 92 22 C 90 -14 80 -40 60 -54 C 30 -70 -30 -70 -60 -54 C -80 -40 -90 -14 -92 22 Z"},{"s":"hs","w":0.5,"d":"M -99 -93.5 C -97.4 -97.9 -93.9 -101.4 -89.5 -103 C -85 -104.7 -80.1 -104.2 -76 -101.9"},{"s":"hs","w":0.5,"d":"M -34.3 -136.3 C -30.7 -139.3 -25.9 -140.6 -21.2 -139.8 C -16.6 -138.9 -12.5 -136.1 -10.1 -132"},{"s":"hs","w":0.5,"d":"M 34.5 -137 C 39 -138.7 43.9 -138.2 48 -135.9 C 52.1 -133.5 54.9 -129.4 55.8 -124.8"},{"s":"hs","w":0.5,"d":"M 94.8 -85.8 C 99.4 -84.9 103.5 -82.1 105.9 -78 C 108.2 -73.9 108.7 -69 107 -64.5"},{"s":"hs","w":0.5,"d":"M -125.9 16 C -128.2 11.9 -128.7 7 -127 2.5 C -125.4 -1.9 -121.9 -5.4 -117.5 -7"},{"s":"hs","w":0.5,"d":"M 118 6.1 C 122.1 8.5 124.9 12.6 125.8 17.2 C 126.6 21.9 125.3 26.7 122.3 30.3"},{"s":"hl","w":2,"a":0.4,"d":"M -100.7 -75.5 C -90.6 -94.4 -75.5 -110 -57 -120.7"}]},"twists":{"frente":[{"f":"h","a":0.42,"w":0,"d":"M -101.9 -3.6 C -100 -59.6 -54.9 -104 -0 -104 C 54.9 -104 100 -59.6 101.9 -3.6 L 99 12 L 90 14 C 88 -10 84 -30 76 -46 L -76 -46 C -84 -30 -88 -10 -90 14 L -99 12 Z"},{"f":"h","alto":1,"d":"M -84 -46.8 C -87 -76 -82 -96 -72 -96 C -62 -96 -57 -76 -60 -46.8 Z"},{"f":"h","alto":1,"d":"M -62 -54.5 C -65 -100 -60 -120 -50 -120 C -40 -120 -35 -100 -38 -54.5 Z"},{"f":"h","alto":1,"d":"M -38 -62.9 C -41 -114 -36 -134 -26 -134 C -16 -134 -11 -114 -14 -62.9 Z"},{"f":"h","alto":1,"d":"M -12 -72 C -15 -120 -10 -140 0 -140 C 10 -140 15 -120 12 -72 Z"},{"f":"h","alto":1,"d":"M 14 -62.9 C 11 -114 16 -134 26 -134 C 36 -134 41 -114 38 -62.9 Z"},{"f":"h","alto":1,"d":"M 38 -54.5 C 35 -100 40 -120 50 -120 C 60 -120 65 -100 62 -54.5 Z"},{"f":"h","alto":1,"d":"M 60 -46.8 C 57 -76 62 -96 72 -96 C 82 -96 87 -76 84 -46.8 Z"},{"f":"h","alto":1,"d":"M -74 -46.1 C -76 -58 -71 -78 -62 -78 C -53 -78 -48 -58 -50 -46.1 Q -62 -38.1 -74 -46.1 Z"},{"f":"h","alto":1,"d":"M -50 -49.9 C -52 -80 -47 -100 -38 -100 C -29 -100 -24 -80 -26 -49.9 Q -38 -41.9 -50 -49.9 Z"},{"f":"h","alto":1,"d":"M -24 -54.1 C -26 -90 -21 -110 -12 -110 C -3 -110 2 -90 0 -54.1 Q -12 -46.1 -24 -54.1 Z"},{"f":"h","alto":1,"d":"M 0 -54.1 C -2 -90 3 -110 12 -110 C 21 -110 26 -90 24 -54.1 Q 12 -46.1 0 -54.1 Z"},{"f":"h","alto":1,"d":"M 26 -49.9 C 24 -80 29 -100 38 -100 C 47 -100 52 -80 50 -49.9 Q 38 -41.9 26 -49.9 Z"},{"f":"h","alto":1,"d":"M 50 -46.1 C 48 -58 53 -78 62 -78 C 71 -78 76 -58 74 -46.1 Q 62 -38.1 50 -46.1 Z"},{"s":"hs","w":0.45,"alto":1,"d":"M -56 -100 L -44 -106"},{"s":"hs","w":0.45,"alto":1,"d":"M -32 -114 L -20 -120"},{"s":"hs","w":0.45,"alto":1,"d":"M -6 -120 L 6 -126"},{"s":"hs","w":0.45,"alto":1,"d":"M 20 -114 L 32 -120"},{"s":"hs","w":0.45,"alto":1,"d":"M 44 -100 L 56 -106"},{"s":"hs","w":0.45,"alto":1,"d":"M -18 -90 L -6 -96"},{"s":"hs","w":0.45,"alto":1,"d":"M 6 -90 L 18 -96"}]},"raspado":{"frente":[{"f":"h","a":0.5,"w":0,"d":"M -100.9 -3.6 C -99 -58.5 -54.4 -102 -0 -102 C 54.4 -102 99 -58.5 100.9 -3.6 L 99 12 L 90 14 C 88 -16 80 -38 64 -52 C 30 -62 -30 -62 -64 -52 C -80 -38 -88 -16 -90 14 L -99 12 Z"},{"s":"h","w":0.45,"a":0.7,"d":"M -64 -52 C -30 -62 30 -62 64 -52"}]},"medio":{"frente":[{"f":"h","kf":6,"d":"M -106.7 8 C -109.5 -34.6 -89.8 -75.2 -55.6 -97.4 C -21.5 -119.5 21.5 -119.5 55.6 -97.4 C 89.8 -75.2 109.5 -34.6 106.7 8 L 104 30 C 96 40 88 36 86 26 C 86 -10 70 -40 40 -54 C 24 -60 10 -60 2 -70 C -6 -60 -22 -60 -40 -54 C -70 -40 -86 -10 -86 26 C -88 36 -96 40 -104 30 Z"},{"s":"hs","w":0.5,"a":1.0,"kf":6,"d":"M 2 -70 Q -30 -96 -80 -60"},{"s":"hs","w":0.5,"a":1.0,"kf":6,"d":"M 2 -70 Q 34 -96 82 -60"},{"s":"hs","w":0.5,"a":1.0,"kf":6,"d":"M -50 -50 Q -80 -30 -92 20"},{"s":"hs","w":0.5,"a":1.0,"kf":6,"d":"M 50 -50 Q 80 -30 92 20"},{"s":"hl","w":1.6,"a":0.55,"d":"M -79.6 -53.7 C -70.2 -67.7 -57.2 -78.9 -42.1 -86.3"}]},"bald":{"nuca":[{"f":"h","d":"M 84 -44 C 100 -42 106 -30 104 -10 C 104 10 98 26 86 32 C 92 10 92 -20 84 -44 Z"},{"f":"h","d":"M -84 -44 C -100 -42 -106 -30 -104 -10 C -104 10 -98 26 -86 32 C -92 10 -92 -20 -84 -44 Z"}],"frente":[{"s":"hl","w":1.4,"a":0.35,"d":"M -60.9 -54.9 C -53.2 -63.4 -43.9 -70.2 -33.4 -74.9"}]},"long":{"tras":[{"f":"h","d":"M -102 -20 C -122 30 -122 100 -116 170 C -50 188 50 188 116 170 C 122 100 122 30 102 -20 C 102 -63.6 56.3 -112 0 -112 C -56.3 -112 -102 -63.6 -102 -4 Z"}],"frente":[{"f":"h","esp":1,"d":"M -104 0 C -103.9 -65.4 -57.1 -114 -0 -114 C 57.1 -114 103.9 -65.4 105.9 -4 C 98 10 92 -10 80 -34 C 60 -62 30 -60 -6 -54 C -30 -52 -56 -44 -74 -28 C -82 -20 -86 -8 -88 6 L -104 0 Z"},{"f":"h","esp":1,"d":"M -94 -46 C -120 0 -116 70 -110 150 C -94 160 -70 154 -60 144 C -76 110 -84 84 -86 50 C -88 10 -84 -20 -70 -40 Z"},{"f":"h","esp":1,"d":"M 94 -46 C 120 0 116 70 110 150 C 94 160 70 154 60 144 C 76 110 84 84 86 50 C 88 10 84 -20 70 -40 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -30 -60 Q 20 -98 80 -60"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -58 -48 Q -30 -90 24 -112"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M 110 20 Q 112 80 106 140"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -112 20 Q -114 80 -108 140"},{"s":"hl","w":1.8,"a":0.55,"d":"M -81.2 -54.8 C -69.7 -72 -53 -85 -33.5 -92.1"}]},"ondulado":{"tras":[{"f":"h","d":"M -102 -20 C -134 30 -112 70 -130 110 C -142 140 -122 170 -104 176 C -40 192 40 192 104 176 C 122 170 142 140 130 110 C 112 70 134 30 102 -20 C 102 -63.6 56.3 -112 0 -112 C -56.3 -112 -102 -63.6 -102 -4 Z"}],"frente":[{"f":"h","d":"M -104 0 C -103.9 -65.4 -57.1 -114 -0 -114 C 57.1 -114 103.9 -65.4 105.9 -4 C 96 -8 84 -36 56 -54 C 34 -66 14 -62 0 -72 C -14 -62 -34 -66 -56 -54 C -84 -36 -96 -8 -104 0 Z"},{"f":"h","d":"M -94 -46 C -122 -10 -108 40 -122 80 C -132 110 -116 146 -100 156 C -88 164 -62 150 -58 134 C -72 126 -78 100 -84 60 C -88 10 -84 -20 -70 -40 Z"},{"f":"h","d":"M 94 -46 C 122 -10 108 40 122 80 C 132 110 116 146 100 156 C 88 164 62 150 58 134 C 72 126 78 100 84 60 C 88 10 84 -20 70 -40 Z"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q -36 -98 -82 -52"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q 36 -98 82 -52"},{"s":"hs","w":0.5,"a":1.0,"d":"M -112 0 Q -100 50 -114 100"},{"s":"hs","w":0.5,"a":1.0,"d":"M 112 0 Q 100 50 114 100"},{"s":"hl","w":1.8,"a":0.55,"d":"M -83.1 -51.9 C -72.8 -68.5 -57.7 -81.6 -39.9 -89.5"}]},"franja":{"tras":[{"f":"h","d":"M -102 -20 C -122 30 -122 100 -116 160 C -50 178 50 178 116 160 C 122 100 122 30 102 -20 C 102 -63.6 56.3 -112 0 -112 C -56.3 -112 -102 -63.6 -102 -4 Z"}],"frente":[{"f":"h","kf":5,"d":"M -104 0 C -103.9 -65.4 -57.1 -114 -0 -114 C 57.1 -114 103.9 -65.4 105.9 -4 C 96 8 90 -4 84 -16 C 70 -26 50 -34 34 -46 C 20 -56 8 -60 0 -66 C -8 -60 -20 -56 -34 -46 C -50 -34 -70 -26 -84 -16 C -90 -4 -96 8 -104 0 Z"},{"f":"h","d":"M -94 -46 C -120 0 -116 70 -110 140 C -94 150 -70 144 -60 134 C -76 110 -84 84 -86 50 C -88 10 -84 -20 -70 -40 Z"},{"f":"h","d":"M 94 -46 C 120 0 116 70 110 140 C 94 150 70 144 60 134 C 76 110 84 84 86 50 C 88 10 84 -20 70 -40 Z"},{"s":"hs","w":0.5,"a":1.0,"kf":5,"d":"M 0 -66 Q -30 -60 -62 -32"},{"s":"hs","w":0.5,"a":1.0,"kf":5,"d":"M 0 -66 Q 30 -60 62 -32"},{"s":"hs","w":0.5,"a":1.0,"kf":5,"d":"M -10 -76 Q -50 -100 -86 -60"},{"s":"hs","w":0.5,"a":1.0,"kf":5,"d":"M 10 -76 Q 50 -100 86 -60"},{"s":"hl","w":1.8,"a":0.55,"d":"M -81.2 -54.8 C -70.3 -71 -54.8 -83.5 -36.7 -90.9"}]},"bob":{"frente":[{"f":"h","esp":1,"d":"M -102 -30 C -99.1 -80.3 -53.4 -120 -0 -120 C 53.4 -120 99.1 -80.3 108.3 -25.8 C 118 10 118 54 104 74 C 94 84 84 84 74 70 C 84 40 86 0 80 -30 C 60 -60 30 -60 -10 -54 C -40 -50 -66 -36 -78 -16 C -84 10 -84 44 -76 70 C -86 84 -94 84 -104 74 C -118 54 -118 10 -102 -30 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -20 -58 Q 20 -98 84 -50"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -60 -40 Q -30 -92 30 -112"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M 100 0 Q 106 40 92 72"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -100 0 Q -106 40 -92 72"},{"s":"hl","w":1.8,"a":0.55,"d":"M -86.5 -60.1 C -75.1 -78.3 -58.2 -92.5 -38.2 -100.6"}]},"pixie":{"frente":[{"f":"h","esp":1,"d":"M -104 -6 C -101.9 -70.5 -55.7 -116 -0 -116 C 55.7 -116 101.9 -70.5 105.7 -11.8 L 99 10 L 88 12 C 86 -14 80 -32 66 -44 C 40 -50 10 -40 -20 -34 C -46 -30 -66 -36 -78 -26 C -84 -14 -86 0 -88 14 L -99 10 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -60 -40 Q -10 -76 60 -92"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -30 -40 Q 20 -60 70 -60"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -70 -70 Q -40 -104 10 -112"},{"s":"hl","w":1.6,"a":0.55,"d":"M -73.5 -61.7 C -62.7 -74.6 -48.7 -84.4 -32.8 -90.2"}]},"rabo":{"tras":[{"f":"h","esp":-1,"d":"M 20 -100 C 70 -140 140 -110 130 -30 C 124 30 146 80 118 140 C 110 110 96 70 104 20 C 110 -40 80 -80 34 -76 Z"}],"frente":[{"f":"h","esp":1,"d":"M -104 0 C -103.9 -61.9 -57.1 -108 -0 -108 C 57.1 -108 103.9 -61.9 105.9 -3.8 C 98 10 92 -10 80 -34 C 60 -62 30 -60 -6 -54 C -30 -52 -56 -44 -74 -28 C -82 -20 -86 -8 -88 6 L -104 0 Z"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -50 -50 Q 0 -96 60 -96"},{"s":"hs","w":0.5,"a":1.0,"esp":1,"d":"M -80 -26 Q -50 -90 20 -112"},{"f":"band","esp":-1,"d":"O 54 -96 13 13"},{"s":"hl","w":1.8,"a":0.55,"d":"M -75.1 -63 C -64 -76.2 -49.7 -86.2 -33.5 -92.1"}]},"bun":{"frente":[{"f":"h","d":"M -104 0 C -103.9 -60.8 -57.1 -106 -0 -106 C 57.1 -106 103.9 -60.8 105.9 -3.7 C 96 -8 84 -36 56 -54 C 34 -66 14 -62 0 -72 C -14 -62 -34 -66 -56 -54 C -84 -36 -96 -8 -104 0 Z"},{"f":"h","alto":1,"kf":4,"d":"O 0 -126 40 34"},{"s":"hs","w":0.6,"alto":1,"kf":4,"d":"M -24.4 -133.5 C -21 -141.6 -12.3 -147.2 -2.3 -147.9 C 7.8 -148.7 17.5 -144.4 22.5 -137"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q -30 -96 -70 -70"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q 30 -96 70 -70"},{"s":"hl","w":1.6,"a":0.55,"d":"M -79.6 -53.7 C -69.5 -68.6 -55.5 -80.4 -39 -87.7"}]},"trancas":{"tras":[{"f":"h","d":"M -115 -10 Q -119 3 -115 16 Q -119 29 -115 42 Q -119 55 -115 68 Q -119 81 -115 94 Q -119 107 -115 120 Q -119 133 -115 146 Q -119 159 -115 172 Q -104 196 -93 172 Q -89 159 -93 146 Q -89 133 -93 120 Q -89 107 -93 94 Q -89 81 -93 68 Q -89 55 -93 42 Q -89 29 -93 16 Q -89 3 -93 -10 Z"},{"f":"h","d":"M -97 -10 Q -101 3 -97 16 Q -101 29 -97 42 Q -101 55 -97 68 Q -101 81 -97 94 Q -101 107 -97 120 Q -101 133 -97 146 Q -101 159 -97 172 Q -101 185 -97 198 Q -86 216 -75 198 Q -71 185 -75 172 Q -71 159 -75 146 Q -71 133 -75 120 Q -71 107 -75 94 Q -71 81 -75 68 Q -71 55 -75 42 Q -71 29 -75 16 Q -71 3 -75 -10 Z"},{"f":"h","d":"M -81 -10 Q -85 3 -81 16 Q -85 29 -81 42 Q -85 55 -81 68 Q -85 81 -81 94 Q -85 107 -81 120 Q -85 133 -81 146 Q -85 159 -81 172 Q -85 185 -81 198 Q -70 202 -59 198 Q -55 185 -59 172 Q -55 159 -59 146 Q -55 133 -59 120 Q -55 107 -59 94 Q -55 81 -59 68 Q -55 55 -59 42 Q -55 29 -59 16 Q -55 3 -59 -10 Z"},{"f":"h","d":"M 93 -10 Q 89 3 93 16 Q 89 29 93 42 Q 89 55 93 68 Q 89 81 93 94 Q 89 107 93 120 Q 89 133 93 146 Q 89 159 93 172 Q 104 196 115 172 Q 119 159 115 146 Q 119 133 115 120 Q 119 107 115 94 Q 119 81 115 68 Q 119 55 115 42 Q 119 29 115 16 Q 119 3 115 -10 Z"},{"f":"h","d":"M 75 -10 Q 71 3 75 16 Q 71 29 75 42 Q 71 55 75 68 Q 71 81 75 94 Q 71 107 75 120 Q 71 133 75 146 Q 71 159 75 172 Q 71 185 75 198 Q 86 216 97 198 Q 101 185 97 172 Q 101 159 97 146 Q 101 133 97 120 Q 101 107 97 94 Q 101 81 97 68 Q 101 55 97 42 Q 101 29 97 16 Q 101 3 97 -10 Z"},{"f":"h","d":"M 59 -10 Q 55 3 59 16 Q 55 29 59 42 Q 55 55 59 68 Q 55 81 59 94 Q 55 107 59 120 Q 55 133 59 146 Q 55 159 59 172 Q 55 185 59 198 Q 70 202 81 198 Q 85 185 81 172 Q 85 159 81 146 Q 85 133 81 120 Q 85 107 81 94 Q 85 81 81 68 Q 85 55 81 42 Q 85 29 81 16 Q 85 3 81 -10 Z"}],"frente":[{"f":"h","d":"M -104 0 C -103.9 -61.9 -57.1 -108 -0 -108 C 57.1 -108 103.9 -61.9 105.9 -3.8 C 96 -8 84 -36 56 -54 C 34 -66 14 -62 0 -72 C -14 -62 -34 -66 -56 -54 C -84 -36 -96 -8 -104 0 Z"},{"s":"hs","w":0.5,"d":"M -104 20 L -124 26"},{"s":"hs","w":0.5,"d":"M -104 42 L -124 48"},{"s":"hs","w":0.5,"d":"M -104 64 L -124 70"},{"s":"hs","w":0.5,"d":"M -104 86 L -124 92"},{"s":"hs","w":0.5,"d":"M -104 108 L -124 114"},{"s":"hs","w":0.5,"d":"M -104 130 L -124 136"},{"s":"hs","w":0.5,"d":"M 104 20 L 124 26"},{"s":"hs","w":0.5,"d":"M 104 42 L 124 48"},{"s":"hs","w":0.5,"d":"M 104 64 L 124 70"},{"s":"hs","w":0.5,"d":"M 104 86 L 124 92"},{"s":"hs","w":0.5,"d":"M 104 108 L 124 114"},{"s":"hs","w":0.5,"d":"M 104 130 L 124 136"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q -2 -94 -4 -112"},{"s":"hs","w":0.5,"a":1.0,"d":"M -40 -60 Q -70 -80 -96 -40"},{"s":"hs","w":0.5,"a":1.0,"d":"M 40 -60 Q 70 -80 96 -40"},{"s":"hs","w":0.5,"a":1.0,"d":"M -30 -66 Q -46 -96 -60 -104"},{"s":"hs","w":0.5,"a":1.0,"d":"M 30 -66 Q 46 -96 60 -104"}]},"maria":{"frente":[{"f":"h","d":"M -104 0 C -103.9 -60.8 -57.1 -106 -0 -106 C 57.1 -106 103.9 -60.8 105.9 -3.7 C 96 -8 84 -36 56 -54 C 34 -66 14 -62 0 -72 C -14 -62 -34 -66 -56 -54 C -84 -36 -96 -8 -104 0 Z"},{"f":"h","alto":1,"d":"O -66 -96 34 32"},{"f":"h","alto":1,"d":"O 66 -96 34 32"},{"s":"hs","w":0.55,"alto":1,"d":"M -85.7 -99.1 C -84.3 -106 -78.7 -111.6 -71.2 -113.4 C -63.7 -115.2 -55.7 -112.9 -50.7 -107.6"},{"s":"hs","w":0.55,"alto":1,"d":"M 50.7 -107.6 C 55.7 -112.9 63.7 -115.2 71.2 -113.4 C 78.7 -111.6 84.3 -106 85.7 -99.1"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q -30 -88 -60 -62"},{"s":"hs","w":0.5,"a":1.0,"d":"M 0 -72 Q 30 -88 60 -62"},{"s":"hl","w":1.6,"a":0.55,"d":"M -79.6 -53.7 C -70.2 -67.7 -57.2 -78.9 -42.1 -86.3"}]},"cachos":{"tras":[{"f":"h","d":"O -100 -60 34 34"},{"f":"h","d":"O -60 -112 36 36"},{"f":"h","d":"O -10 -128 38 38"},{"f":"h","d":"O 42 -120 37 37"},{"f":"h","d":"O 88 -86 35 35"},{"f":"h","d":"O 112 -40 32 32"},{"f":"h","d":"O 118 10 32 32"},{"f":"h","d":"O 112 60 32 32"},{"f":"h","d":"O 94 104 30 30"},{"f":"h","d":"O -112 -10 32 32"},{"f":"h","d":"O -118 40 32 32"},{"f":"h","d":"O -108 88 31 31"},{"f":"h","d":"O -86 124 28 28"},{"f":"h","d":"O 64 130 28 28"},{"f":"h","d":"O -40 -90 30 30"},{"f":"h","d":"O 20 -98 32 32"},{"f":"h","d":"O 66 -64 28 28"}],"frente":[{"f":"h","clip":"cobre","d":"M -110 30 C -110 -60 -60 -120 0 -120 C 60 -120 110 -60 110 30 L 92 30 C 92 -14 80 -40 58 -54 C 40 -42 20 -50 4 -62 C -16 -48 -40 -46 -60 -52 C -82 -40 -92 -14 -92 30 Z"},{"f":"h","d":"O -86 -40 22 22"},{"f":"h","d":"O -94 6 18 18"},{"f":"h","d":"O 86 -40 22 22"},{"f":"h","d":"O 94 6 18 18"},{"f":"h","d":"O -40 -70 18 18"},{"f":"h","d":"O 30 -72 18 18"},{"s":"hs","w":0.5,"d":"M -117.6 -66.4 C -115.3 -72.7 -109.8 -77.3 -103.2 -78.4 C -96.7 -79.6 -90 -77.1 -85.7 -72"},{"s":"hs","w":0.5,"d":"M -29.6 -135.1 C -27.1 -142.2 -21 -147.3 -13.6 -148.6 C -6.3 -149.9 1.2 -147.2 6 -141.4"},{"s":"hs","w":0.5,"d":"M 69.9 -92.6 C 72.3 -99 77.9 -103.8 84.7 -105 C 91.4 -106.2 98.3 -103.6 102.7 -98.4"},{"s":"hs","w":0.5,"d":"M 101.5 4 C 103.6 -1.9 108.8 -6.2 114.9 -7.3 C 121.1 -8.4 127.4 -6.1 131.5 -1.3"},{"s":"hs","w":0.5,"d":"M 78.5 98.4 C 80.5 92.8 85.3 88.8 91.1 87.8 C 96.9 86.7 102.9 88.9 106.6 93.4"},{"s":"hs","w":0.5,"d":"M -97.4 -44.1 C -95.9 -48.2 -92.4 -51.2 -88.1 -51.9 C -83.8 -52.7 -79.5 -51.1 -76.7 -47.8"},{"s":"hs","w":0.5,"d":"M 74.6 -44.1 C 76.1 -48.2 79.6 -51.2 83.9 -51.9 C 88.2 -52.7 92.5 -51.1 95.3 -47.8"}]}},"masc":["short","degrade","slick","topete","espetado","moicano","curly","twists","afro","medio","raspado","bald","none"],"fem":["long","ondulado","franja","bob","pixie","rabo","bun","trancas","maria","cachos","afro","none"],"nomes":{"short":"Texturizado","degrade":"Degradê","slick":"Risca lateral","topete":"Topete","espetado":"Arrepiado","moicano":"Moicano","curly":"Cacheado curto","twists":"Twists","afro":"Black power","medio":"Médio repartido","raspado":"Raspado","bald":"Careca","none":"Sem cabelo","long":"Liso comprido","ondulado":"Ondulado","franja":"Franja cortina","bob":"Chanel","pixie":"Pixie","rabo":"Rabo alto","bun":"Coque alto","trancas":"Box braids","maria":"Dois coques","cachos":"Cacheado volumoso"}};
const CABELOS = CAB_DATA.nomes;
const CAB_M = CAB_DATA.masc;   // homem, menino, idoso
const CAB_F = CAB_DATA.fem;    // mulher, menina, idosa
const feminino = p => ['mulher', 'menina', 'idosa'].includes(p.corpo);
const cabelosDe = p => p.especie !== 'humano' ? Object.keys(CABELOS) : feminino(p) ? CAB_F : CAB_M;
const ROUPAS = {tee:'Camiseta', sueter:'Suéter listrado', hoodie:'Moletom', blouse:'Blusa', dress:'Vestido', suit:'Terno', colete:'Colete',
  jaleco:'Jaleco', jardineira:'Jardineira', pelo:'Sem roupa (pelo)'};
const GRAVATAS = {tie:'Gravata', bowtie:'Gravata-borboleta', none:'Sem gravata'};
const ACESS = {glasses:'óculos', moustache:'bigode', barba:'barba', lashes:'cílios', sardas:'sardas', brincos:'brincos', laco:'laço', bone:'boné', hat:'chapéu', bengala:'bengala', hanky:'lenço no bolso'};
const EXPRS = [['Normal','dot','smile',0,0],['Malandro','half','smirk',.5,0],['Choque','wide','o',1,-.6],['Bravo','dot','flat',.2,.9],['Falando','dot','open',.3,0],['Piscando','closed','smile',0,0]];
const BASE = {corpo:'homem', especie:'humano', skin:'#E6BE8E', hair:'short', hair_col:'#1C1B22', top:'tee', suit:'#3E6FA8', print:'#F2C14E', shirt:'#F4EFE2',
  tie:'#A8232B', gravata:'none', hat_col:'#2E2E38', hat_band:'#C8242C'};
for (const k in ACESS) BASE[k] = false;
const MODELOS = {  // os mesmos de kit.MODELOS
  homem:    {rot:'Homem', corpo:'homem', skin:'#E6BE8E', top:'tee', suit:'#3E6FA8', print:'#F2C14E', hair:'short', hair_col:'#3B2A20'},
  mulher:   {rot:'Mulher', corpo:'mulher', skin:'#C98F62', top:'dress', suit:'#B23A48', print:'#F2C14E', hair:'long', hair_col:'#2A1A14', lashes:true, brincos:true},
  menino:   {rot:'Menino', corpo:'menino', skin:'#D9A877', top:'sueter', suit:'#3E6FA8', print:'#F4EFE2', hair:'espetado', hair_col:'#3B2A20', sardas:true},
  menina:   {rot:'Menina', corpo:'menina', skin:'#8A5A3B', top:'jardineira', suit:'#5B8DD6', shirt:'#F2C14E', hair:'maria', hair_col:'#1C1B22', lashes:true, laco:true, hat_band:'#E04E8A'},
  avo_m:    {rot:'Avô', corpo:'idoso', skin:'#E6BE8E', top:'colete', suit:'#7A5A3C', shirt:'#F4EFE2', hair:'bald', hair_col:'#D8D8DC', glasses:true, moustache:true, bengala:true},
  avo_f:    {rot:'Avó', corpo:'idosa', skin:'#D9A877', top:'blouse', suit:'#7A3B5E', shirt:'#F4EFE2', hair:'bun', hair_col:'#DADADF', glasses:true, lashes:true, brincos:true},
  gato:     {rot:'Gato', especie:'gato', skin:'#E8964A', top:'pelo', hair:'none'},
  cachorro: {rot:'Cachorro', especie:'cachorro', skin:'#C8A27A', top:'pelo', hair:'none'},
  coelho:   {rot:'Coelho', especie:'coelho', skin:'#EDE8E4', top:'pelo', hair:'none'},
  urso:     {rot:'Urso', especie:'urso', skin:'#8A5A3B', top:'pelo', hair:'none'},
};
function doModelo(k, nome) { const m = Object.assign({}, MODELOS[k]); delete m.rot; return Object.assign({}, BASE, m, {nome}); }

function darken(h, f) { const n = parseInt(h.slice(1), 16); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f).toString(16).padStart(2, '0')).join(''); }
function clarear(h, f) { const n = parseInt(h.slice(1), 16); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (255 - v) * f).toString(16).padStart(2, '0')).join(''); }
const RAD = Math.PI / 180;

let estado = {estilo: 'noturno', face: .25};

// ---------------- desenho de um boneco (mesma geometria do kit.py). Origem = pés.
const _PC = {};
function hpath(d) {  // mesmo leitor do kit.py: M L C Q Z e O (oval)
  if (_PC[d]) return _PC[d];
  const t = d.split(' '), p = new Path2D(), N = {M: 2, L: 2, C: 6, Q: 4, Z: 0, O: 4}; let i = 0;
  while (i < t.length) { const k = t[i++], v = t.slice(i, i + N[k]).map(Number); i += N[k];
    if (k === 'M') p.moveTo(v[0], v[1]); else if (k === 'L') p.lineTo(v[0], v[1]); else if (k === 'C') p.bezierCurveTo(...v);
    else if (k === 'Q') p.quadraticCurveTo(...v); else if (k === 'Z') p.closePath(); else { p.moveTo(v[0] + v[2], v[1]); p.ellipse(v[0], v[1], v[2], v[3], 0, 0, Math.PI * 2); } }
  return (_PC[d] = p);
}
function tonsCabelo(h) { const n = parseInt(h.slice(1), 16), lum = (.299 * (n >> 16) + .587 * ((n >> 8) & 255) + .114 * (n & 255)) / 255;
  return [lum < .3 ? clarear(h, .2) : darken(h, .7), clarear(h, lum < .3 ? .42 : .38)]; }
function desenharCabelo(c, grupo, hair, hcol, band, face, lado, lw, slw, coberto, INKC) {
  const st0 = CAB_DATA.estilos[hair]; let Ls = st0 && st0[grupo]; if (!Ls) return;
  const [hs, hl] = tonsCabelo(hcol), cor = {h: hcol, hs, hl, band};
  Ls = Ls.filter(L => !(coberto && L.alto));
  const abre = L => { c.save();
    if (L.clip) { const k = new Path2D(); k.arc(0, 0, 100 + (L.clip === 'cabeca' ? -.45 : .6) * lw * slw, 0, Math.PI * 2); c.clip(k); }
    if (L.kf) c.translate(face * L.kf, 0);
    if ((L.esp === 1 && lado < 0) || (L.esp === -1 && lado > 0)) c.scale(-1, 1);
    return hpath(L.d); };
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const L of Ls) if (L.f && (L.w === undefined ? 1 : L.w)) { const p = abre(L); c.strokeStyle = INKC; c.lineWidth = lw * 2 * (L.w || 1) * slw; c.stroke(p); c.restore(); }
  for (const L of Ls) if (L.f) { const p = abre(L); c.globalAlpha = L.a === undefined ? 1 : L.a; c.fillStyle = cor[L.f]; c.fill(p); c.globalAlpha = 1; c.restore(); }
  for (const L of Ls) if (L.s && !L.f) { const p = abre(L); c.globalAlpha = L.a === undefined ? 1 : L.a; c.strokeStyle = L.s === 'ink' ? INKC : cor[L.s]; c.lineWidth = lw * (L.w === undefined ? .6 : L.w) * slw; c.stroke(p); c.globalAlpha = 1; c.restore(); }
}
function boneco(c, p, o) {
  const st = ESTILOS[estado.estilo], INK = st.ink;
  const face = o.face ?? estado.face, eyes = o.eyes || 'dot', mouth = o.mouth || 'smile', brow = o.brow || 0, browT = o.browT || 0;
  const corpo = p.corpo || 'homem', esp = p.especie || 'humano', kid = ['crianca', 'menino', 'menina'].includes(corpo), curvo = corpo === 'mulher' || corpo === 'idosa', velho = corpo === 'idoso' || corpo === 'idosa';
  const k_ = kid ? .74 : 1, lw = 5.6 / k_, R = HEAD_R, T = BODY_TOP, B = BODY_BOT, hm = st.cabeca * (kid ? 1.22 : 1), lado = face >= 0 ? 1 : -1;
  const fur = p.skin, fur_d = darken(p.skin, .84), claro = clarear(p.skin, .55), band = p.hat_band, hcol = p.hair_col, suit = p.suit, suit_d = darken(p.suit, .76), shirt = p.shirt, pal = !!st.palito;
  const hair = p.hair, top = p.top;
  c.save(); c.scale(k_, k_); c.lineCap = 'round'; c.lineJoin = 'round';
  const ink = (w, col) => { c.strokeStyle = col || INK; c.lineWidth = w * st.lw; c.stroke(); };
  const cabelo = g => desenharCabelo(c, g, hair, hcol, band, face, lado, lw, st.lw, !!(p.hat || p.bone), INK);
  const fill = col => { c.fillStyle = col; c.fill(); };
  const shape = (col, w) => { fill(col); if (w) ink(w); };
  const circle = (x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); };
  const ell = (x0, y0, x1, y1) => { c.beginPath(); c.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, Math.PI * 2); };
  const poly = pts => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  const rr = (x0, y0, x1, y1, r) => { c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, r); };
  const seg = (x0, y0, x1, y1, w, col) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); ink(w, col); };
  const uniao = (paths, col, w) => { c.strokeStyle = INK; c.lineWidth = w * st.lw; for (const q of paths) c.stroke(q); c.fillStyle = col; for (const q of paths) c.fill(q); };
  const tri = (a, b, d) => { const q = new Path2D(); q.moveTo(...a); q.lineTo(...b); q.lineTo(...d); q.closePath(); return q; };
  const headT = () => { c.translate(0, HEAD_CY); c.translate(0, -R * (hm - 1)); c.scale(hm, hm); };

  for (const hx of [-24, 24]) seg(pal ? 0 : hx, B - 8, hx * (pal ? 1.6 : 1), 0, lw);
  if (velho) { c.translate(0, B); c.rotate(5 * lado * RAD); c.translate(0, -B); }
  // rabo dos animais
  if (esp !== 'humano' && !pal) {
    const sd = -lado;
    if (esp === 'gato' || esp === 'cachorro') {
      c.beginPath(); c.moveTo(sd * 60, B - 34);
      if (esp === 'gato') c.bezierCurveTo(sd * 160, B - 40, sd * 150, -300, sd * 112, -336); else c.quadraticCurveTo(sd * 126, B - 60, sd * 134, B - 128);
      const w0 = esp === 'gato' ? 30 : 34; ink(w0 + lw * 2); ink(w0, fur);
    } else { circle(sd * 74, B - 26, esp === 'coelho' ? 28 : 20); shape(esp === 'coelho' ? claro : fur, lw); }
  }
  // cabelo de trás e orelhas de trás
  c.save(); headT();
  cabelo('tras');
  if (esp === 'gato') for (const sx of [-1, 1]) { poly([[sx * 26, -R * .9], [sx * 94, -R * .42], [sx * 86, -R * 1.44]]); shape(fur, lw); poly([[sx * 46, -R * .84], [sx * 80, -R * .58], [sx * 79, -R * 1.18]]); fill(ROSA); }
  else if (esp === 'coelho') for (const sx of [-1, 1]) { c.save(); c.translate(sx * 40, -R * .82); c.rotate(sx * 12 * RAD); ell(-27, -158, 27, 12); shape(fur, lw); ell(-12, -136, 12, -14); fill(ROSA); c.restore(); }
  else if (esp === 'urso') for (const sx of [-1, 1]) { circle(sx * 70, -R * .72, 34); shape(fur, lw); circle(sx * 70, -R * .72, 17); fill(fur_d); }
  c.restore();
  // corpo e roupa
  if (pal) seg(0, T - 40, 0, B - 8, lw * 1.1);
  const wb = curvo ? 92 : 84;
  if (!pal && top === 'jaleco') { rr(-wb - 4, B - 40, -2, B + 62, 12); shape(suit, lw); rr(2, B - 40, wb + 4, B + 62, 12); shape(suit, lw); }
  const body = new Path2D();
  if (curvo) { body.moveTo(0, T); body.bezierCurveTo(44, T, 64, T + 6, 66, T + 52); body.bezierCurveTo(68, T + 110, 92, B - 70, 92, B - 34); body.bezierCurveTo(92, B - 4, 70, B, 0, B);
    body.bezierCurveTo(-70, B, -92, B - 4, -92, B - 34); body.bezierCurveTo(-92, B - 70, -68, T + 110, -66, T + 52); body.bezierCurveTo(-64, T + 6, -44, T, 0, T); body.closePath(); }
  else body.roundRect(-84, T, 168, B - T, [66, 66, 72, 72]);
  const camisaBase = top === 'jardineira' || top === 'colete';
  const base = camisaBase ? shirt : top === 'pelo' ? fur : suit, sombra = camisaBase ? darken(shirt, .84) : top === 'pelo' ? fur_d : suit_d;
  if (!pal) {
    c.fillStyle = base; c.fill(body); c.save(); c.clip(body);
    if (st.sombra) { c.fillStyle = sombra; c.fill(body); c.save(); c.translate(-16, -5); c.fillStyle = base; c.fill(body); c.restore(); }
    const gola = (w) => { c.beginPath(); c.ellipse(0, T - 5, 38, 35, 0, 20 * RAD, 160 * RAD); ink(w); };
    const gravata = () => { if (p.gravata === 'bowtie') { const by = T + 40; c.beginPath(); c.moveTo(0, by); c.lineTo(-24, by - 14); c.lineTo(-24, by + 14); c.closePath(); c.moveTo(0, by); c.lineTo(24, by - 14); c.lineTo(24, by + 14); c.closePath(); shape(p.tie, lw * .75); circle(0, by, 5); shape(p.tie, lw * .7); }
      else if (p.gravata === 'tie') { poly([[-9, T + 24], [9, T + 24], [13, T + 82], [0, T + 98], [-13, T + 82]]); shape(p.tie, lw * .75); } };
    if (top === 'suit' || top === 'jaleco') {
      c.beginPath(); c.moveTo(-34, T - 4); c.lineTo(0, T + 96); c.lineTo(34, T - 4); c.closePath(); fill(shirt); gravata();
      for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 36, T - 2); c.lineTo(sx * 2, T + 98); c.lineTo(sx * 2, B); ink(lw * .75); seg(sx * 22, T + 58, sx * 40, T + 44, lw * .6); }
      if (top === 'jaleco') { rr(30, T + 112, 66, T + 150, 0); shape(suit, lw * .6); seg(40, T + 100, 40, T + 126, lw * 1.3, '#3E6FA8'); }
    } else if (top === 'jardineira') {
      gola(lw * .75);
      for (const sx of [-1, 1]) { poly([[sx * 30, T + 84], [sx * 50, T + 84], [sx * 66, T - 6], [sx * 46, T - 10]]); shape(suit, lw * .6); }
      rr(-50, T + 78, 50, B + 10, 8); shape(suit, lw * .7); rr(-24, T + 104, 24, T + 140, 4); shape(suit_d, lw * .5);
      for (const sx of [-1, 1]) { circle(sx * 38, T + 92, 7); shape(GOLD, lw * .5); }
    } else if (top === 'colete') {
      gola(lw * .75); gravata();
      for (const sx of [-1, 1]) { poly([[sx * 120, T - 10], [sx * 34, T - 10], [sx * 4, T + 104], [sx * 4, B + 10], [sx * 120, B + 10]]); shape(suit, lw * .75); }
      for (let j = 0; j < 3; j++) { circle(14, T + 124 + j * 26, 5); shape(suit_d, lw * .5); }
    } else if (top === 'pelo') { ell(-54, T + 46, 54, B - 6); fill(claro); }
    else {
      if (top === 'sueter') { c.fillStyle = p.print; for (let yy = T + 46; yy < B; yy += 40) c.fillRect(-130, yy, 260, 15); }
      gola(lw * (top === 'sueter' ? 1.6 : .75));
      if (top === 'blouse') for (const sx of [-1, 1]) { poly([[0, T + 30], [sx * 40, T + 2], [sx * 30, T + 38]]); shape(shirt, lw * .6); }
      if (top === 'dress') { c.fillStyle = p.print; c.fillRect(-120, T + 118, 240, 18); seg(-120, T + 118, 120, T + 118, lw * .5); seg(-120, T + 136, 120, T + 136, lw * .5); }
      if (top === 'hoodie') { rr(-54, B - 74, 54, B - 14, 14); shape(suit_d, lw * .6); for (const sx of [-1, 1]) { seg(sx * 16, T + 26, sx * 18, T + 74, lw * .55, shirt); circle(sx * 18, T + 78, 4); fill(shirt); } }
      if (top === 'tee') { circle(0, T + 100, 26); shape(p.print, lw * .6); }
    }
    if (p.hanky && (top === 'suit' || top === 'colete')) { poly([[30, T + 96], [52, T + 92], [48, T + 76], [40, T + 86], [33, T + 76]]); shape('#F4EFE2', lw * .55); }
    c.restore(); c.strokeStyle = INK; c.lineWidth = lw * st.lw; c.stroke(body);
    if (top === 'dress') {
      const yb = T + 136, w0 = curvo ? 72 : 84, sk = new Path2D(); sk.moveTo(-w0, yb); sk.lineTo(w0, yb);
      sk.bezierCurveTo(wb + 6, B - 40, wb + 28, B + 40, wb + 32, B + 62); sk.quadraticCurveTo(0, B + 84, -wb - 32, B + 62); sk.bezierCurveTo(-wb - 28, B + 40, -wb - 6, B - 40, -w0, yb); sk.closePath();
      c.fillStyle = suit; c.fill(sk); if (st.sombra) { c.save(); c.clip(sk); c.fillStyle = suit_d; c.fillRect(30, yb, 210, B + 90 - yb); c.restore(); }
      c.strokeStyle = INK; c.lineWidth = lw * st.lw; c.stroke(sk);
    }
    if (top === 'hoodie') { ell(-94, T - 56, 94, T + 40); shape(suit, lw); ell(-64, T - 40, 64, T + 22); fill(suit_d); }
  }
  // braços (para baixo) e bengala
  for (const side of [-1, 1]) {
    const m = side < 0 ? 1 : -1, sx = pal ? 0 : SHOULDER[0] * m, sy = pal ? SHOULDER[1] - 10 : SHOULDER[1], ex = -90 * m, ey = -235, hx = -96 * m, hy = -168;
    c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(1.35 * ex - .175 * (sx + hx), 1.35 * ey - .175 * (sy + hy), hx, hy); ink(lw);
    if (p.bengala && side === lado) { c.beginPath(); c.moveTo(hx - side * 26, hy - 4); c.quadraticCurveTo(hx - side * 18, hy - 34, hx, hy - 16); c.lineTo(hx + side * 22, -4); ink(lw * 2.6); ink(lw * 1.2, '#9A6A3E'); }
    circle(hx, hy, 13); shape(p.skin, lw * .8);
  }
  // cabeça
  c.save(); headT();
  cabelo('nuca');
  const head = new Path2D(); head.arc(0, 0, R, 0, Math.PI * 2);
  c.fillStyle = p.skin; c.fill(head); c.save(); c.clip(head);
  if (st.sombra) { c.fillStyle = darken(p.skin, .84); c.fill(head); const lit = new Path2D(); lit.arc(-7, -17, R, 0, 7); c.fillStyle = p.skin; c.fill(lit); }
  if (p.barba) { const mx0 = face * 34; c.beginPath(); c.moveTo(-R - 10, -20); c.lineTo(-82, -20); c.bezierCurveTo(-76, 50, mx0 - 42, 72, mx0, 72); c.bezierCurveTo(mx0 + 42, 72, 76, 50, 82, -20); c.lineTo(R + 10, -20); c.lineTo(R + 10, R + 10); c.lineTo(-R - 10, R + 10); c.closePath(); fill(hcol); }
  c.restore(); c.strokeStyle = INK; c.lineWidth = lw * st.lw; c.stroke(head);  // contorno antes do cabelo: o cabelo da frente o cobre
  cabelo('frente');
  if (esp === 'cachorro') for (const sx of [-1, 1]) { c.save(); c.translate(sx * R * .86, -R * .55); c.rotate(-sx * 14 * RAD); ell(-26, -10, 26, 112); shape(fur_d, lw); c.restore(); }
  if (p.hat) {
    c.beginPath(); c.moveTo(-R + 6, -56); c.bezierCurveTo(-R - 2, -R - 82, R + 2, -R - 82, R - 6, -56); c.closePath(); fill(p.hat_col);
    c.save(); c.clip(); c.fillStyle = p.hat_band; c.fillRect(-R, -86, 2 * R, 30); c.restore(); ink(lw);
    ell(-R - 40, -70, R + 40, -40); shape(p.hat_col, lw);
  } else if (p.bone) {
    c.beginPath(); c.moveTo(-R + 2, -44); c.bezierCurveTo(-R - 6, -R - 52, R + 6, -R - 52, R - 2, -44); c.closePath(); shape(p.hat_col, lw);
    ell(lado * 70 - 62, -58, lado * 70 + 62, -32); shape(p.hat_col, lw); circle(0, -R - 22, 8); shape(band, lw * .6);
  }
  if (p.laco) { const bx = -lado * R * .6, by = -R * .84; for (const sx of [-1, 1]) { poly([[bx, by], [bx + sx * 36, by - 22], [bx + sx * 36, by + 22]]); shape(band, lw * .7); } circle(bx, by, 9); shape(band, lw * .6); }
  if (p.brincos) for (const sx of [-1, 1]) { circle(sx * R * .97, 34, 8); shape(GOLD, lw * .5); }
  const fx = face * 40, eyy = -6, mx = face * 34, my = 42;
  if (esp !== 'humano') { const big = esp === 'cachorro' || esp === 'urso', rx = big ? 46 : 30, ry = big ? 32 : 22;
    ell(mx - rx, 34 - ry, mx + rx, 34 + ry); fill(claro);
    if (big) { ell(mx - 14, 8, mx + 14, 26); fill(INK); } else { poly([[mx - 10, 18], [mx + 10, 18], [mx, 28]]); shape(ROSA, lw * .5); } }
  for (const ex0 of [-30, 30]) {
    const ex = ex0 + fx, far = (face > 0 && ex0 > 0) || (face < 0 && ex0 < 0), sq = far ? 1 - .3 * Math.abs(face) : 1;
    if (eyes === 'wide') { ell(ex - 17 * sq, eyy - 17, ex + 17 * sq, eyy + 17); shape('#FBFBF7', lw * .7); ell(ex - 5.5 * sq - 6, eyy - 5.5, ex + 5.5 * sq - 6, eyy + 5.5); fill(INK); }
    else if (eyes === 'closed') { c.beginPath(); c.moveTo(ex - 11 * sq, eyy); c.quadraticCurveTo(ex, eyy + 9, ex + 11 * sq, eyy); ink(lw * .8); }
    else if (eyes === 'half') { c.save(); c.beginPath(); c.rect(ex - 20, eyy - 3, 40, 23); c.clip(); ell(ex - 6.5 * sq, eyy - 9, ex + 6.5 * sq, eyy + 9); fill(INK); c.restore(); seg(ex - 13 * sq, eyy - 4, ex + 13 * sq, eyy - 4, lw * .8); }
    else if (st.olhos === 'grande' || kid) { ell(ex - 13 * sq, eyy - 16, ex + 13 * sq, eyy + 16); shape('#FBFBF7', lw * .6); ell(ex - 8 * sq + face * 3, eyy - 10, ex + 8 * sq + face * 3, eyy + 12); fill(INK);
      circle(ex + 3 + face * 3, eyy - 4, 3.6); fill('#fff'); circle(ex - 3 + face * 3, eyy + 5, 1.6); fill('#ffffffc8'); }
    else { ell(ex - 5.5 * sq, eyy - 8, ex + 5.5 * sq, eyy + 8); fill(INK); circle(ex + 1.5, eyy - 3, 1.8); fill('#ffffffdc'); }
    const o_ = ex0 < 0 ? -1 : 1;
    if (p.lashes && eyes !== 'closed') seg(ex + o_ * 9 * sq, eyy - 6, ex + o_ * 17 * sq, eyy - 13, lw * .6);
    if (velho) seg(ex + o_ * 18 * sq, eyy + 2, ex + o_ * 26 * sq, eyy + 8, lw * .45);
    if (p.sardas) for (const [dx, dy] of [[-8, 0], [0, 5], [8, 0]]) { circle(ex + dx * sq, 24 + dy, 3); fill(darken(p.skin, .68)); }
    const inner = ex0 < 0 ? 1 : -1, by = eyy - 29 - brow * 9;
    seg(ex - 13 * sq, by + (inner < 0 ? browT * 7 : -browT * 7), ex + 13 * sq, by + (inner > 0 ? browT * 7 : -browT * 7), lw * .78);
  }
  if (p.glasses) { for (const ex0 of [-30, 30]) { const ex = ex0 + fx, far = (face > 0 && ex0 > 0) || (face < 0 && ex0 < 0), sq = far ? 1 - .3 * Math.abs(face) : 1; ell(ex - 24 * sq, eyy - 24, ex + 24 * sq, eyy + 24); c.fillStyle = 'rgba(225,240,255,.22)'; c.fill(); ink(lw * .7); } seg(fx - 7, eyy - 3, fx + 7, eyy - 3, lw * .7); }
  if (p.moustache) { c.beginPath(); c.moveTo(mx, my - 20); c.bezierCurveTo(mx - 12, my - 28, mx - 30, my - 22, mx - 40, my - 30); c.bezierCurveTo(mx - 30, my - 10, mx - 12, my - 12, mx, my - 15); c.bezierCurveTo(mx + 12, my - 12, mx + 30, my - 10, mx + 40, my - 30); c.bezierCurveTo(mx + 30, my - 22, mx + 12, my - 28, mx, my - 20); fill(hcol); }
  if (mouth === 'smile') { c.beginPath(); c.moveTo(mx - 17, my - 2); c.quadraticCurveTo(mx, my + 13, mx + 17, my - 2); ink(lw * .8); }
  else if (mouth === 'smirk') { const d = face >= 0 ? 1 : -1; c.beginPath(); c.moveTo(mx - 15 * d, my + 3); c.quadraticCurveTo(mx + 4 * d, my + 12, mx + 20 * d, my - 6); ink(lw * .8); }
  else if (mouth === 'flat') seg(mx - 12, my + 2, mx + 12, my + 2, lw * .8);
  else if (mouth === 'o') { ell(mx - 8, my - 9, mx + 8, my + 11); shape('#5A1A1E', lw * .7); }
  else if (mouth === 'open') { const mp = () => { c.beginPath(); c.moveTo(mx - 20, my - 5); c.lineTo(mx + 20, my - 5); c.bezierCurveTo(mx + 19, my + 24, mx - 19, my + 24, mx - 20, my - 5); c.closePath(); };
    mp(); fill('#5A1A1E'); c.save(); c.clip(); c.fillStyle = '#FAFAF4'; c.fillRect(mx - 22, my - 6, 44, 8); ell(mx - 11, my + 9, mx + 11, my + 26); fill('#D05860'); c.restore(); mp(); ink(lw * .7); }
  if (esp === 'gato' || esp === 'coelho') for (const sx of [-1, 1]) for (const dy of [-6, 8]) seg(mx + sx * 26, 30 + dy * .3, mx + sx * 74, 24 + dy, lw * .4);
  c.restore(); c.restore();
}

function fundo(c, W, H) {
  const st = ESTILOS[estado.estilo]; c.setTransform(1, 0, 0, 1, 0, 0);
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, st.fundo[0]); g.addColorStop(1, st.fundo[1]); c.fillStyle = g; c.fillRect(0, 0, W, H);
  if (st.reticula) { c.fillStyle = '#0002'; for (let y = 0; y < H; y += 14) for (let x = (y / 14 % 2) * 7; x < W; x += 14) { c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); } }
}
function acabamento(c, W, H) {
  if (!ESTILOS[estado.estilo].cinza) return;
  const im = c.getImageData(0, 0, W, H), d = im.data;
  for (let i = 0; i < d.length; i += 4) { const l = .3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]; d[i] = l * .78 + d[i] * .22; d[i + 1] = l * .78 + d[i + 1] * .22; d[i + 2] = l * .78 + d[i + 2] * .22; }
  c.putImageData(im, 0, 0);
}
function desenhar(cv, p, opt) {
  const c = cv.getContext('2d'), W = cv.width, H = cv.height;
  if (opt.transparente) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); } else fundo(c, W, H);
  const s = opt.scale * W / 1000; c.translate(W / 2, opt.feet * H / 1000); c.scale(s, s); boneco(c, p, opt);
  c.setTransform(1, 0, 0, 1, 0, 0); acabamento(c, W, H);
}


// ---------------- estado
const PASSOS = [['corpo', 'Corpo'], ['cabeca', 'Cabeça'], ['roupa', 'Roupa'], ['detalhes', 'Detalhes'], ['final', 'Finalizar']];
const CHAVE = 'animacoes-ideias-artificiais';
estado = {estilo: 'noturno', elenco: [Object.assign(doModelo('homem', 'protagonista'), {video: true})], sel: 0, face: .25, expr: 0, passo: 0, todosCabelos: false, juntos: false};
try {
  const s = JSON.parse(localStorage.getItem(CHAVE) || 'null');
  const v2 = JSON.parse(localStorage.getItem('editor-personagens-v2') || 'null');
  if (s && s.elenco && s.elenco.length) estado = Object.assign(estado, s);
  else if (v2 && v2.elenco && v2.elenco.length) {  // elenco salvo pela versão anterior do editor
    const marc = new Set(v2.marcados || [0]);
    estado = Object.assign(estado, {estilo: v2.estilo || 'noturno', elenco: v2.elenco.map((p, i) => Object.assign({}, p, {video: marc.has(i)})), sel: v2.sel || 0});
  }
} catch (e) {}
estado.elenco = estado.elenco.map(p => normalizar(p));
if (estado.sel >= estado.elenco.length) estado.sel = 0;
function normalizar(p) {
  const q = Object.assign({}, BASE, p);
  if (q.corpo === 'crianca') q.corpo = 'menino';
  if (q.especie === 'humano' && q.top === 'pelo') q.top = 'tee';
  if (q.hair === 'curly' && feminino(q)) q.hair = 'cachos';  // versão antiga
  if (!CABELOS[q.hair]) q.hair = feminino(q) ? 'long' : 'short';
  if (q.video === undefined) q.video = true;
  return q;
}
function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }
const P = () => estado.elenco[estado.sel];
const doVideo = () => estado.elenco.filter(p => p.video);
const alvos = () => (estado.juntos && P().video) ? doVideo() : [P()];
function mudar(fn) { for (const q of alvos()) fn(q); tudo(); }

// ---------------- utilidades de interface
const $ = id => document.getElementById(id);
const el = (tag, attrs = {}, ...filhos) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'on') e.onclick = v; else if (k in e && k !== 'style') e[k] = v; else e.setAttribute(k, v); } e.append(...filhos); return e; };
function miniatura(p, tam, enquadre, extra = {}) {
  const cv = el('canvas', {width: tam, height: tam});
  const enq = {rosto: {scale: 2.45, feet: 1560}, corpo: {scale: 1.45, feet: 985}, busto: {scale: 1.6, feet: 1180}}[enquadre];
  desenhar(cv, p, Object.assign({transparente: true, face: .25}, enq, extra)); return cv;
}
function opcoes(titulo, mapa, atual, variante, enquadre, aplicar) {
  const g = el('div', {className: 'grade'});
  for (const [k, rot] of Object.entries(mapa)) {
    const p = Object.assign({}, P(), variante(k));
    g.append(el('button', {className: 'op', 'aria-pressed': String(atual === k), on: () => mudar(q => aplicar(q, k))}, miniatura(p, 150, enquadre), rot));
  }
  return grupo(titulo, g);
}
function cores(titulo, lista, atual, aplicar) {
  const c = el('div', {className: 'cores'});
  for (const cor of lista) c.append(el('button', {className: 'cor', title: cor, 'aria-label': cor, 'aria-pressed': String(atual.toLowerCase() === cor.toLowerCase()), style: `background:${cor}`, on: () => mudar(q => aplicar(q, cor))}));
  const livre = el('label', {className: 'cor-livre', title: 'Outra cor'}, el('input', {type: 'color', value: atual}), el('span', {}, '+'));
  const ip = livre.querySelector('input'); ip.oninput = e => mudarLeve(q => aplicar(q, e.target.value)); ip.onchange = () => tudo();
  c.append(livre); return grupo(titulo, c);
}
function linhaCor(rot, valor, aplicar) {
  const i = el('input', {type: 'color', value: valor, 'aria-label': rot}); i.oninput = e => mudarLeve(q => aplicar(q, e.target.value)); i.onchange = () => tudo();
  return el('label', {className: 'linha-cor'}, rot, i);
}
const grupo = (titulo, ...conteudo) => el('div', {className: 'grupo'}, el('h3', {}, titulo), ...conteudo);
function aviso(t, desfazer) {
  const a = $('aviso'); a.textContent = t; a.classList.toggle('acao', !!desfazer);
  if (desfazer) a.append(el('button', {className: 'desfazer', on: () => { desfazer(); a.classList.remove('ver', 'acao'); aviso('Desfeito'); }}, 'Desfazer'));
  a.classList.add('ver'); clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove('ver', 'acao'), desfazer ? 6000 : 2600);
}
function foto() { return JSON.stringify({elenco: estado.elenco, sel: estado.sel}); }  // para desfazer
function voltarFoto(f) { const o = JSON.parse(f); estado.elenco = o.elenco; estado.sel = o.sel; tudo(); }
function palco() { const p = P(); desenhar($('main'), p, {scale: 1.05, feet: 940, face: estado.face, eyes: EXPRS[estado.expr][1], mouth: EXPRS[estado.expr][2], brow: EXPRS[estado.expr][3], browT: EXPRS[estado.expr][4], transparente: true}); }
function mudarLeve(fn) { for (const q of alvos()) fn(q); palco(); salvar(); }  // enquanto o seletor de cor está aberto: não recria o painel

// ---------------- passos
function passoCorpo(c) {
  const p = P();
  c.append(el('h2', {}, 'Quem é esse personagem?'), el('p', {className: 'sub'}, 'Escolha se é pessoa ou animal e o tipo de corpo.'));
  c.append(opcoes('Pessoa ou animal', ESPECIES, p.especie, k => ({especie: k, top: k === 'humano' ? (p.top === 'pelo' ? 'tee' : p.top) : 'pelo', hair: k === 'humano' ? (p.hair === 'none' ? 'short' : p.hair) : 'none', skin: k === 'humano' ? (p.especie === 'humano' ? p.skin : '#E6BE8E') : MODELOS[k].skin}), 'corpo',
    (q, k) => { if (q.especie === k) return; q.especie = k; if (k !== 'humano') { q.top = 'pelo'; q.hair = 'none'; q.skin = MODELOS[k].skin; } else { if (q.top === 'pelo') q.top = 'tee'; q.hair = feminino(q) ? 'long' : 'short'; q.skin = '#E6BE8E'; } }));
  c.append(opcoes('Tipo de corpo', CORPOS, p.corpo, k => ({corpo: k}), 'corpo', (q, k) => {
    const antes = feminino(q); q.corpo = k;
    if (q.especie === 'humano' && antes !== feminino(q)) { if (!cabelosDe(q).includes(q.hair)) q.hair = feminino(q) ? 'long' : 'short'; q.lashes = feminino(q); }
  }));
}
function passoCabeca(c) {
  const p = P(), humano = p.especie === 'humano';
  c.append(el('h2', {}, humano ? 'Rosto e cabelo' : 'Cor do pelo'), el('p', {className: 'sub'}, humano ? (feminino(p) ? 'Penteados femininos. Marque "mostrar todos" para ver os outros.' : 'Penteados masculinos. Marque "mostrar todos" para ver os outros.') : 'Animais não têm cabelo, mas podem usar boné, chapéu ou laço em Detalhes.'));
  c.append(cores(humano ? 'Pele' : 'Pelo', humano ? PELES : PELOS, p.skin, (q, v) => q.skin = v));
  if (humano || estado.todosCabelos) {
    const lista = estado.todosCabelos ? Object.keys(CABELOS) : cabelosDe(p);
    c.append(opcoes('Cabelo', Object.fromEntries(lista.map(k => [k, CABELOS[k]])), p.hair, k => ({hair: k}), 'rosto', (q, k) => q.hair = k));
  }
  const t = el('input', {type: 'checkbox', checked: !!estado.todosCabelos}); t.onchange = () => { estado.todosCabelos = t.checked; tudo(); };
  c.append(el('label', {className: 'alternar'}, t, 'Mostrar todos os penteados'));
  if (p.hair !== 'none' || p.moustache || p.barba) c.append(cores('Cor do cabelo', CORES_CABELO, p.hair_col, (q, v) => q.hair_col = v));
}
function passoRoupa(c) {
  const p = P();
  c.append(el('h2', {}, 'Roupa'), el('p', {className: 'sub'}, 'Escolha a peça e depois as cores.'));
  const lista = Object.fromEntries(Object.entries(ROUPAS).filter(([k]) => k !== 'pelo' || p.especie !== 'humano'));
  c.append(opcoes('Peça', lista, p.top, k => ({top: k}), 'corpo', (q, k) => { q.top = k; if (k === 'jaleco' && q.suit === BASE.suit) q.suit = '#F4F4F0'; }));
  if (p.top !== 'pelo') {
    const box = el('div');
    box.append(linhaCor('Cor principal', p.suit, (q, v) => q.suit = v));
    if (['tee', 'sueter', 'dress'].includes(p.top)) box.append(linhaCor(p.top === 'dress' ? 'Cor do cinto' : p.top === 'sueter' ? 'Cor das listras' : 'Cor da estampa', p.print, (q, v) => q.print = v));
    if (['suit', 'jaleco', 'blouse', 'jardineira', 'colete', 'hoodie'].includes(p.top)) box.append(linhaCor(p.top === 'hoodie' ? 'Cor dos cordões' : 'Cor da camisa', p.shirt, (q, v) => q.shirt = v));
    c.append(grupo('Cores', box));
  }
  if (['suit', 'jaleco', 'colete'].includes(p.top)) {
    const ch = el('div', {className: 'chips'});
    for (const [k, v] of Object.entries(GRAVATAS)) ch.append(el('button', {className: 'chip', 'aria-pressed': String(p.gravata === k), on: () => mudar(q => q.gravata = k)}, v));
    c.append(grupo('Gravata', ch));
    if (p.gravata !== 'none') c.append(linhaCor('Cor da gravata', p.tie, (q, v) => q.tie = v));
  }
}
function passoDetalhes(c) {
  const p = P();
  c.append(el('h2', {}, 'Detalhes'), el('p', {className: 'sub'}, 'Toque para colocar ou tirar.'));
  const ch = el('div', {className: 'chips'});
  for (const [k, v] of Object.entries(ACESS)) {
    if (k === 'hanky' && !['suit', 'colete'].includes(p.top)) continue;
    ch.append(el('button', {className: 'chip', 'aria-pressed': String(!!p[k]), on: () => mudar(q => { q[k] = !p[k]; if (k === 'hat' && q.hat) q.bone = false; if (k === 'bone' && q.bone) q.hat = false; })}, v[0].toUpperCase() + v.slice(1)));
  }
  c.append(grupo('Acessórios', ch));
  const box = el('div');
  if (p.hat || p.bone) box.append(linhaCor(p.hat ? 'Cor do chapéu' : 'Cor do boné', p.hat_col, (q, v) => q.hat_col = v));
  if (p.hat || p.laco || p.bone || ['rabo', 'trancas', 'maria'].includes(p.hair)) box.append(linhaCor(p.laco ? 'Cor do laço e elásticos' : p.hat ? 'Cor da faixa do chapéu' : 'Cor dos detalhes', p.hat_band, (q, v) => q.hat_band = v));
  if (box.childNodes.length) c.append(grupo('Cores dos acessórios', box));
}
function passoFinal(c) {
  const p = P();
  c.append(el('h2', {}, 'Finalizar'), el('p', {className: 'sub'}, 'Dê um nome, escolha o estilo e confira quem vai para o vídeo.'));
  const nome = el('input', {type: 'text', value: p.nome, 'aria-label': 'Nome do personagem', placeholder: 'ex.: rafa'});
  const salvarNome = () => { const n = limpo(nome.value); if (n && n !== P().nome) { P().nome = nomeLivre(n); tudo(); aviso('Nome salvo'); } };
  nome.onkeydown = e => { if (e.key === 'Enter') { salvarNome(); nome.blur(); } };
  nome.onchange = salvarNome;  // salva também ao fechar o teclado
  c.append(grupo('Nome na história', el('div', {className: 'campo'}, nome, el('button', {className: 'bt', on: salvarNome}, 'Salvar nome')),
    el('p', {className: 'sub', style: 'margin:6px 0 0'}, 'Use o nome do personagem no roteiro. Assim ele entra no papel certo.')));
  // estilo do vídeo: o personagem atual em cada estilo
  const g = el('div', {className: 'grade'}); const atual = estado.estilo;
  for (const [k, v] of Object.entries(ESTILOS)) {
    estado.estilo = k; const cv = el('canvas', {width: 150, height: 150}); desenhar(cv, p, {scale: 1.12, feet: 965, face: .25}); estado.estilo = atual;
    g.append(el('button', {className: 'op', 'aria-pressed': String(atual === k), on: () => { estado.estilo = k; tudo(); }}, cv, v.nome));
  }
  c.append(grupo('Estilo do vídeo', g));
  // quem vai no vídeo
  const lv = el('div', {className: 'lista-video'});
  estado.elenco.forEach((q, i) => {
    const ck = el('input', {type: 'checkbox', checked: q.video}); ck.onchange = () => { q.video = ck.checked; tudo(); };
    lv.append(el('label', {}, miniatura(q, 88, 'rosto'), q.nome, ck));
  });
  const juntos = el('input', {type: 'checkbox', checked: estado.juntos}); juntos.onchange = () => { estado.juntos = juntos.checked; tudo(); };
  const massa = el('div', {className: 'chips', style: 'margin-bottom:8px'}, el('button', {className: 'chip', on: () => { estado.elenco.forEach(q => q.video = true); tudo(); }}, 'Marcar todos'),
    el('button', {className: 'chip', on: () => { estado.elenco.forEach(q => q.video = false); tudo(); }}, 'Desmarcar todos'));
  c.append(grupo('Quem vai para o vídeo', massa, lv, el('label', {className: 'alternar'}, juntos, 'Editar todos que vão para o vídeo ao mesmo tempo')));
  if (estado.elenco.length > 1) c.append(el('div', {className: 'grupo'}, el('button', {className: 'bt sec', on: () => {
    const fora = estado.elenco.filter(q => !q.video).length;
    if (!fora) { aviso('Todos já vão para o vídeo'); return; }
    const f = foto(); estado.elenco = estado.elenco.filter(q => q.video); if (!estado.elenco.length) estado.elenco = [Object.assign(doModelo('homem', 'protagonista'), {video: true})]; estado.sel = 0; tudo(); aviso(`${fora} removido${fora > 1 ? 's' : ''}`, () => voltarFoto(f));
  }}, 'Apagar os que não vão para o vídeo'), ' ', el('button', {className: 'bt sec', on: () => {
    remover(estado.sel); }}, `Apagar ${p.nome}`)));
  // carregar código
  const ta = el('textarea', {id: 'codigo', spellcheck: false, placeholder: 'Cole aqui um código copiado deste criador'});
  c.append(el('details', {}, el('summary', {}, 'Já tem um código? Carregue o elenco'), ta, el('button', {className: 'bt', on: () => carregar(ta.value)}, 'Carregar elenco')));
}
const RENDER = [passoCorpo, passoCabeca, passoRoupa, passoDetalhes, passoFinal];

// ---------------- código para o vídeo
function exportar() {
  const sai = {};
  for (const p of doVideo()) {
    const s = {corpo: p.corpo, especie: p.especie, skin: p.skin, skin_d: darken(p.skin, .84), top: p.top, suit: p.suit, suit_d: darken(p.suit, .76), hair: p.hair, hair_col: p.hair_col};
    if (['suit', 'jaleco', 'blouse', 'jardineira', 'colete', 'hoodie'].includes(p.top)) s.shirt = p.shirt;
    if (['tee', 'sueter', 'dress'].includes(p.top)) s.print = p.print;
    if (['suit', 'jaleco', 'colete'].includes(p.top) && p.gravata !== 'none') { s.tie = p.tie; if (p.gravata === 'bowtie') s.bowtie = true; }
    for (const k in ACESS) if (p[k]) s[k] = k === 'hanky' ? '#F4EFE2' : true;
    if (p.hat || p.bone) s.hat_col = p.hat_col;
    if (p.hat || p.laco || ['rabo', 'trancas', 'maria'].includes(p.hair) || p.bone) s.hat_band = p.hat_band;
    sai[p.nome] = s;
  }
  return JSON.stringify({estilo: estado.estilo, elenco: sai}, null, 1);
}
function carregar(txt) {
  try {
    const j = JSON.parse(txt); const lista = [];
    for (const [nome, s] of Object.entries(j.elenco || {})) lista.push(normalizar(Object.assign({}, s, {nome, video: true, gravata: s.bowtie ? 'bowtie' : (s.tie ? 'tie' : 'none'), hanky: !!s.hanky,
      top: s.top || (s.especie && s.especie !== 'humano' ? 'pelo' : 'suit'), hair: s.hair || (s.especie && s.especie !== 'humano' ? 'none' : 'short')})));
    if (!lista.length) throw 0;
    estado.elenco = lista; estado.sel = 0; if (ESTILOS[j.estilo]) estado.estilo = j.estilo; estado.passo = 0; tudo(); window.scrollTo({top: 0}); aviso(`Elenco carregado: ${lista.length} personagem${lista.length > 1 ? 's' : ''}`);
  } catch (e) { aviso('Esse código não é deste criador. Copie de novo o texto completo.'); }
}

// ---------------- tela
function tudo() {
  const p = P();
  palco();
  $('nomeAtual').textContent = p.nome; $('face').value = estado.face; $('expr').textContent = 'Expressão: ' + EXPRS[estado.expr][0];
  // elenco
  const fx = $('elenco'), rolagem = fx.scrollLeft; fx.innerHTML = '';
  estado.elenco.forEach((q, i) => {
    const vai = el('button', {className: 'vai', 'aria-pressed': String(!!q.video), title: q.video ? 'Vai para o vídeo (toque para tirar)' : 'Não vai para o vídeo (toque para incluir)', 'aria-label': `${q.nome} vai para o vídeo`,
      on: ev => { ev.stopPropagation(); q.video = !q.video; tudo(); }}, '✓');
    const foto = el('button', {className: 'foto', 'aria-label': `Editar ${q.nome}`, on: () => { estado.sel = i; tudo(); }}, miniatura(q, 128, 'rosto'));
    const tirar = el('button', {className: 'tirar', title: `Remover ${q.nome} da tela`, 'aria-label': `Remover ${q.nome}`, on: ev => { ev.stopPropagation(); remover(i); }}, '×');
    fx.append(el('div', {className: 'ator' + (i === estado.sel ? ' atual' : '')}, foto, tirar, vai, el('span', {className: 'n'}, q.nome)));
  });
  requestAnimationFrame(() => { fx.scrollLeft = rolagem; });
  fx.append(el('div', {className: 'ator novo'}, el('button', {className: 'foto', 'aria-label': 'Novo personagem', on: () => abrirModelos()}, '+'), el('span', {className: 'n'}, 'Novo')));
  const fora = estado.elenco.filter(q => !q.video).length;
  if (fora && estado.elenco.length > 1) fx.append(el('div', {className: 'ator novo limpar'}, el('button', {className: 'foto', 'aria-label': 'Remover os desmarcados', title: 'Remover da tela os que não vão para o vídeo', on: () => {
    const f = foto(), cur = P(); estado.elenco = estado.elenco.filter(q => q.video); if (!estado.elenco.length) estado.elenco = [Object.assign(doModelo('homem', 'protagonista'), {video: true})];
    estado.sel = Math.max(0, estado.elenco.indexOf(cur)); tudo(); aviso(`${fora} removido${fora > 1 ? 's' : ''}: ficaram só os do vídeo`, () => voltarFoto(f)); }}, '🧹'), el('span', {className: 'n'}, 'Limpar')));
  // passos
  const nav = $('passos'); nav.innerHTML = '';
  PASSOS.forEach(([k, rot], i) => nav.append(el('button', {role: 'tab', 'aria-selected': String(i === estado.passo), on: () => { estado.passo = i; tudo(); window.scrollTo({top: 0}); }}, el('span', {className: 'num'}, String(i + 1)), el('span', {className: 'rot'}, rot))));
  const c = $('passo'); c.innerHTML = '';
  if (estado.juntos && p.video && doVideo().length > 1) c.append(el('div', {className: 'alerta'}, `As mudanças valem para os ${doVideo().length} personagens que vão para o vídeo.`));
  RENDER[estado.passo](c);
  $('voltar').style.visibility = estado.passo ? 'visible' : 'hidden';
  $('proximo').style.visibility = estado.passo < PASSOS.length - 1 ? 'visible' : 'hidden';
  // barra
  const n = doVideo().length;
  $('resumo').innerHTML = n ? `<b>${n}</b> <span class="curto">no vídeo</span><span class="longo">${n > 1 ? 'personagens vão' : 'personagem vai'} para o vídeo</span>` : '<span class="curto">Nenhum marcado</span><span class="longo">Nenhum personagem marcado para o vídeo</span>';
  $('levar').disabled = !n;
  salvar();
}
function abrirModelos() {
  const g = $('gradeModelos'); g.innerHTML = '';
  for (const [k, m] of Object.entries(MODELOS)) g.append(el('button', {className: 'op', on: () => {
    const nome = nomeLivre({avo_m: 'avo', avo_f: 'vovo'}[k] || k);
    estado.elenco.push(Object.assign(doModelo(k, nome), {video: true})); estado.sel = estado.elenco.length - 1; $('janela').close(); tudo(); aviso(`Novo no elenco: ${m.rot}`);
  }}, miniatura(doModelo(k, k), 150, 'corpo'), m.rot));
  $('janela').showModal();
}
function remover(i) {
  const q = estado.elenco[i]; if (!q) return;
  const f = foto(); estado.elenco.splice(i, 1);
  if (!estado.elenco.length) estado.elenco = [Object.assign(doModelo('homem', 'protagonista'), {video: true})];
  if (estado.sel >= i && estado.sel > 0) estado.sel--;
  estado.sel = Math.min(estado.sel, estado.elenco.length - 1); tudo(); aviso(`${q.nome} removido`, () => voltarFoto(f));
}
function nomeLivre(base) { let n = base, i = 2; while (estado.elenco.some(q => q.nome === n)) n = base + i++; return n; }
const limpo = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

$('fecharJanela').onclick = () => $('janela').close();
$('face').oninput = e => { estado.face = parseFloat(e.target.value); tudo(); };
$('expr').onclick = () => { estado.expr = (estado.expr + 1) % EXPRS.length; tudo(); };
$('voltar').onclick = () => { estado.passo = Math.max(0, estado.passo - 1); tudo(); window.scrollTo({top: 0}); };
$('proximo').onclick = () => { estado.passo = Math.min(PASSOS.length - 1, estado.passo + 1); tudo(); window.scrollTo({top: 0}); };
$('duplicar').onclick = () => { const q = Object.assign({}, P(), {nome: nomeLivre(P().nome)}); estado.elenco.push(q); estado.sel = estado.elenco.length - 1; tudo(); aviso(`Cópia criada: ${q.nome}`); };
$('sortear').onclick = () => { const r = a => a[Math.floor(Math.random() * a.length)];
  mudar(p => { if (p.especie !== 'humano') { Object.assign(p, {skin: r(PELOS), top: r(['pelo', 'pelo', 'tee', 'hoodie', 'sueter']), suit: r(['#3E6FA8', '#2E7D6B', '#B23A48', '#5B3E8C']), bone: Math.random() < .2}); return; }
    const kid = ['menino', 'menina'].includes(p.corpo), mulher = feminino(p), velho = ['idoso', 'idosa'].includes(p.corpo);
    Object.assign(p, {skin: r(PELES), hair_col: velho ? r(['#DADADF', '#B8B8C0', '#8A8A92']) : r(CORES_CABELO.slice(0, 6).concat(['#B8432F'])),
      hair: mulher ? r(CAB_F.filter(k => k !== 'none' && (kid || k !== 'maria') && (!velho || ['bun', 'bob', 'cachos', 'pixie', 'long'].includes(k)))) : r(CAB_M.filter(k => k !== 'none' && (!kid || !['moicano', 'bald'].includes(k)) && (!velho || ['bald', 'short', 'slick', 'raspado', 'degrade'].includes(k)))),
      top: mulher ? r(['dress', 'blouse', 'tee', 'hoodie', 'sueter', 'jaleco']) : kid ? r(['tee', 'sueter', 'hoodie', 'jardineira']) : r(['tee', 'suit', 'hoodie', 'sueter', 'colete', 'jaleco']),
      gravata: r(['tie', 'bowtie', 'none']), suit: r(['#3E6FA8', '#2E7D6B', '#7A3B5E', '#C8742C', '#3B4660', '#7A5A3C', '#5B3E8C', '#B23A48', '#2F6B45']),
      print: r(['#F2C14E', '#F4EFE2', '#E04E3A', '#8FC8EE']), glasses: Math.random() < .3, moustache: !mulher && !kid && Math.random() < .2, barba: !mulher && !kid && Math.random() < .2,
      lashes: mulher, sardas: Math.random() < .2, brincos: mulher && Math.random() < .5, bone: !velho && Math.random() < .12, hat: false});
    if (p.top === 'jaleco') p.suit = '#F4F4F0'; }); };
$('remover').onclick = () => remover(estado.sel);
$('confVoltar').onclick = () => $('confirma').close();
(() => {  // ao digitar (nome, código), esconde a barra fixa e solta o palco para o campo ficar visível acima do teclado
  const campo = e => e.target.matches && e.target.matches('input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=range]), textarea');
  let t;
  document.addEventListener('focusin', e => { if (!campo(e)) return; clearTimeout(t); document.body.classList.add('digitando');
    setTimeout(() => e.target.scrollIntoView({block: 'center', behavior: 'smooth'}), 250); });
  document.addEventListener('focusout', e => { if (!campo(e)) return; t = setTimeout(() => document.body.classList.remove('digitando'), 150); });
})();
(() => {  // reserva embaixo exatamente a altura da barra fixa (+ folga), para nada ficar escondido atrás dela
  const b = document.querySelector('.barra'), ajusta = () => document.documentElement.style.setProperty('--barra', (b.offsetHeight + 16) + 'px');
  ajusta(); if (window.ResizeObserver) new ResizeObserver(ajusta).observe(b); addEventListener('resize', ajusta);
})();
$('levar').onclick = () => {
  const L = $('confLista'); L.innerHTML = '';
  for (const q of doVideo()) L.append(el('figure', {}, miniatura(q, 144, 'rosto'), q.nome));
  $('confirma').showModal();
};
$('confCopiar').onclick = async () => {
  $('confirma').close();
  const t = exportar(), n = doVideo().length;
  try { await navigator.clipboard.writeText(t); aviso(`Copiado: ${n} personagem${n > 1 ? 's' : ''}. Cole na conversa com o Claude.`); }
  catch (e) { estado.passo = 4; tudo(); const d = document.querySelector('details'); d.open = true; const ta = $('codigo'); ta.value = t; ta.focus(); ta.select(); aviso('Selecione o código e copie (Ctrl+C ou segure o dedo).'); }
};
// no celular os passos ficam presos junto com o palco; no computador, no painel
const mq = matchMedia('(min-width: 960px)');
const posPassos = () => { if (mq.matches) $('passoSlot').prepend($('passos')); else document.querySelector('.palco-area').append($('passos')); };
mq.addEventListener('change', posPassos); posPassos();
tudo();
</script>
</body>
</html>
```

## Exemplo completo (modelo para o projeto; testado em 16:9, 9:16 e 1:1)

O `roteiro.json` deste exemplo é o da seção roteiro.json, acima.

### exemplo: cenas.py

```python
import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
# elenco: se o usuário colou o código do editor, o roteiro.json tem "elenco" e ele substitui estes visuais padrão.
# Os nomes aqui ('golpista', 'compradora') precisam ser os mesmos do editor. Nunca altere cor, cabelo ou chapéu nas cenas.
EL = carregar_elenco(PROJ, {'golpista': dict(HERO, hat=True), 'compradora': dict(ANA, suit='#7A3B5E', suit_d='#5E2B47')})
GOLP, COMP = EL['golpista'], EL['compradora']


def rua(c, t):
    sky(c, '#0A1136', '#26358C', 760); stars(c, t); moon(c, 1500, 150, 36); cloud(c, 700 + t * 8, 220, 1.0)
    blur_begin(c, 2.0); far_city(c, 660, 8, '#1E2A68'); c.restore()
    for (x, w, h, sd) in ((-90, 300, 500, 21), (210, 240, 410, 22), (1180, 250, 380, 23), (1660, 250, 400, 24), (1900, 260, 470, 25)):
        building(c, x, w, h, 760, sd, lit=.34, body='#222E66', dim='#2C3A80')
    c.drawRect(skia.Rect(-900, 760, W + 900, 840), fp('#444B70')); line(c, -900, 760, W + 900, 760, LW); line(c, -900, 840, W + 900, 840, LW)
    c.drawRect(skia.Rect(-900, 840, W + 900, H + 600), fp('#30365A'))
    street_lamp(c, 560, 842, 330)


def luz_rua(c, x):
    cone = cone_path(560, 300, 80, 760, 780, lean=110)
    night(c, [('path', cone, .92, 24), ('oval', 690, 1000, 520, 120, .85), ('pool', x, 600, 340, .8)], '#5A69B6')
    c.drawPath(cone, sp(linear(560, 300, 670, 1080, [hx('#FFE9A8', 64), hx('#FFE9A8', 12)]), blend=skia.BlendMode.kPlus, blur=20))
    add_light(c, 560, 290, 130, '#FFF0B4', 170)


def s_cidade(c, t, S):
    rua(c, t)
    wk = K(t, S.s0, 1.4); x = lerp(150, 820, ease_out(wk)); walking = wk < .97; ph = (t - S.s0) * 11
    c.drawOval(skia.Rect(x - 110, 978, x + 110, 1020), fp((0, 0, 0), 120, blur=8))
    draw_char(c, x, 1000, 1.0, GOLP, face=.7 if walking else .3, eyes='closed' if blink(t, 2.4) else 'half', mouth='smirk',
              arms=('down', 'pocket'), tilt=3 * math.sin(ph) if walking else -2, bob=7 * abs(math.sin(ph)) if walking else 2 + 2 * math.sin(t * 2.4),
              squash=.05 * math.sin(K(t, S.s0 + 1.4, .25) * math.pi), rim='#FFE6B0', legs=walk_legs(ph) if walking else None)
    luz_rua(c, x)


def s_mesa(c, t, S):
    table_top(c)
    k = back(K(t, S.s0 + .05, .5), 1.3); newspaper(c, lerp(-500, 640, k), 540, 640, 520, "TORRE À VENDA?", circle_u=(t - S.at('n2+0.9')) / .5)
    sleeve(c, lerp(-500, 640, k) - 900, 700, lerp(-500, 640, k) - 380, 640, 170, GOLP['suit'])
    counter(c, 1430, 330, t, S.at('n2+0.1'), 1.1, 7000, sub="TONELADAS DE FERRO", size=88 if S.vertical else 150)
    if t > S.at('n2+2.0'): cash(c, lerp(2300, 1450, back(K(t, S.at('n2+2.0'), .4), 1.5)), 800, rot=-12)


def fundo_close(c, t, dx):
    blur_begin(c, 13); c.save(); c.translate(dx, -260); c.scale(1.5, 1.5); rua(c, t); c.restore(); c.restore()
    night(c, [('pool', 960, 520, 900, .55)], '#5A69B6')


def s_compradora(c, t, S):
    fundo_close(c, t, -300)
    m = S.boca('b1', t, 'o', {'open': 'mid', 'mid': 'o', 'closed': 'flat'})
    draw_char(c, 1080, 1390, 2.15, COMP, face=-.72, eyes='wide', mouth=m, brow=1.0, brow_tilt=-.7, arms=('down', ('down', 'chin', K(t, S.s0 + .1, .3))),
              tilt=2, squash=.07 * math.sin(K(t, S.s0, .26) * math.pi), sweat=(t - S.s0) * 1.1, light=1, rim='#FFE6B0', pupil=-1)
    add_light(c, 1500, 380, 700, '#FFD98A', 36)


def s_golpista(c, t, S):
    fundo_close(c, t, -900)
    m = S.boca('c1', t, 'smirk'); fim = S.at('c1:fim-0.12')
    draw_char(c, 840, 1390, 2.15, GOLP, face=.72, eyes='closed' if blink(t, 2.1, 1.0) else 'half', mouth=m, brow=.5,
              arms=('pocket', ('down', 'gesture', K(t, S.at('c1'), .3))), tilt=-3 + 2.5 * math.sin(t * 2.4), squash=.06 * math.sin(K(t, S.s0, .26) * math.pi),
              light=-1, rim='#FFE6B0', sparkle=(t - fim) / .3 if t > fim else 0)
    add_light(c, 420, 380, 700, '#FFD98A', 36)


def s_final(c, t, S):
    rua(c, t)
    x = 820; c.drawOval(skia.Rect(x - 110, 978, x + 110, 1020), fp((0, 0, 0), 120, blur=8))
    draw_char(c, x, 1000, 1.0, GOLP, face=.3, eyes='closed' if blink(t, 2.6) else 'half', mouth='smirk', brow=.8,
              arms=('down', 'pocket'), bob=2 + 2 * math.sin(t * 2.4), rim='#FFE6B0')
    luz_rua(c, x)
    x0, y0, x1, y1 = S.view  # região do cenário visível neste quadro (muda com o formato)
    txt = "NÃO ESTÁ À VENDA"; sz = fit(txt, 110, (x1 - x0) * .8, MARKER)
    stamp(c, txt, (x0 + x1) / 2 if S.vertical else 1240, y0 + (y1 - y0) * .3, (t - S.at('n4+0.2')) / .9, rot=-9, size=sz)


SEQ = [
    dict(draw=s_cidade, falas=['n1'], tag="PARIS · 1925", whip=True, focus_v=((520, 600), (820, 600)), sfx=[('steps', 0.1, .5, -.4)]),
    dict(draw=s_mesa, falas=['n2'], rot=2, vig=.46, focus_v=((640, 560), (1430, 520)), sfx=[('paper', 0.1, .8), ('pop', 'n2+0.1', .7, .3), ('ticks', 'n2+0.2', .5, .3),
                                                        ('scribble', 'n2+0.9', .6), ('coins', 'n2+2.0', .5, .4)]),
    dict(draw=s_compradora, falas=['b1'], zoom=(1.0, 1.05)),
    dict(draw=s_golpista, falas=['c1'], zoom=(1.0, 1.07), sfx=[('ding', 'c1:fim-0.12', .8, -.2)]),
    dict(card=None, falas=['n3']),
    dict(draw=s_final, falas=['n4'], hold=1.4, focus_v=(900, 560), shake=['n4+0.2'], lower=[("VICTOR LUSTIG|GOLPISTA · PARIS, 1925", 'n4+1.6', 1090, 930)],
         polaroid=dict(at='n4:fim+0.1', text="VENDEU... DUAS VEZES", ring=(820, 570))),
]

if __name__ == '__main__':
    main(Video(os.path.dirname(os.path.abspath(__file__)), SEQ))
```