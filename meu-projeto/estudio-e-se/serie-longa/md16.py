# gera o .md de um episódio longo (16:9) da série "O escudo triangular"
import sys
slug, ep, nome, titulo, alt1, alt2, desc, fatos, dur, capitulos = sys.argv[1:11]
md = f"""# O escudo triangular (versão longa) — Episódio {ep}: "{nome}"

**Arquivos:** `{slug}.mp4` (horizontal 1920x1080, animação 2D, {dur}; os 2 últimos segundos são a capa) · `capa-{slug}.jpg` (miniatura 1920x1080)

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

Capítulos:
{capitulos}

Série "O escudo triangular" (versão longa) — episódio {ep} de 5.

#anime #isekai #heroidoescudo #fantasia #animação #ese
```

## Miniatura
- Envie `capa-{slug}.jpg` (1920x1080) como miniatura personalizada.

## Campos do YouTube
| Campo | O que colocar |
|---|---|
| Visibilidade | Programado |
| Público-alvo | Decida pelo seu público real; marcar errado pode gerar penalidade. |
| Playlists | **O escudo triangular — versão longa** |
| Uso de IA | **Sim** (narração com voz sintética) |
| Tags | `anime, isekai, herói do escudo, fantasia, série animada, mundo aberto, rpg` |
| Categoria | Filmes e animação |
| Tela final / cards | Aponte para o próximo episódio da playlist |

## Como foi feito
- Série original inspirada só na ideia base do gênero isekai (quatro heróis invocados, o do escudo desprezado). Personagens (Kai, Igor, Téo, Lia, Nina), reino de Valdora, poderes e acontecimentos são do canal.
- Versão longa horizontal: cartões "DESAFIO N" ao longo do episódio, mapa de mundo aberto do reino de Valdora (névoa some conforme o Kai explora), cenários medievais redesenhados, corte a cada fala, legenda em caixa alta com palavras em amarelo, narrador único sem pausas, dilema no fim.
- Curiosidades reais do episódio: {fatos}
"""
open(f'/home/user/Pace-1/meu-projeto/publicacao/e-se/{slug}.md', 'w').write(md); print('ok', slug)
