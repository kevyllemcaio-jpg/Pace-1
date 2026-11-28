# gera o .md de um episódio da série "O escudo triangular"
import sys, json
slug, ep, nome, titulo, alt1, alt2, desc, fato, dur = sys.argv[1:10]
md = f"""# O escudo triangular — Episódio {ep}: "{nome}"

**Arquivos:** `{slug}.mp4` (vertical 1080x1920, animação 2D, ~{dur}; os 2 últimos segundos são a capa) · `capa-{slug}.jpg`

## Título
```
{titulo}
```
Alternativas:
- `{alt1}`
- `{alt2}`

## Descrição
```
{desc}

Série "O escudo triangular" — episódio {ep}.

#shorts #anime #isekai #herói #escudo #ese
```

## Capa
- Lápis na miniatura → escolha o **último quadro do vídeo** ou envie `capa-{slug}.jpg`.

## Campos do YouTube
| Campo | O que colocar |
|---|---|
| Visibilidade | Programado |
| Público-alvo | Decida pelo seu público real; marcar errado pode gerar penalidade. |
| Playlists | **O escudo triangular** (série) |
| Uso de IA | **Sim** (narração com voz sintética) |
| Tags | `anime, isekai, herói do escudo, fantasia, série, shorts` |
| Categoria | Filmes e animação |

## Como foi feito
- Série original inspirada na ideia base do gênero isekai (quatro heróis invocados; o do escudo desprezado). Personagens (Kai, Igor, Téo, Lia, Nina), reino de Valdora, poderes e acontecimentos são do canal.
- Padrão do canal: imagem nova a cada 1–2 s, corte seco, legenda em caixa alta no terço de baixo com palavras em amarelo, narrador único sem pausas, dilema no fim + "curte pra parte seguinte".
- Curiosidade real do episódio: {fato}
"""
open(f'/home/user/Pace-1/meu-projeto/publicacao/e-se/{slug}.md', 'w').write(md); print('ok', slug)
