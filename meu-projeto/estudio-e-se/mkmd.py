# mkmd.py <slug> <json>  — writes the YouTube sheet next to the video
import sys, json, subprocess
slug, data = sys.argv[1], json.loads(sys.argv[2])
OUT = '/home/user/Pace-1/meu-projeto/publicacao/e-se'
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0', f'{OUT}/{slug}.mp4']))
t = data['title']
md = f"""# {t.split(' #')[0]}

**Arquivos:** `{slug}.mp4` (vertical 1080x1920, {dur:.0f} s; os **2 últimos segundos são a capa**) · `capa-{slug}.jpg`

## Título
```
{t}
```

## Descrição
```
{data['desc']}

{data['cta']}
Segue o canal pra ver o próximo "E SE...?" 🔔

{data['hash']}
```

## Capa
- Lápis na miniatura → escolha o **último quadro do vídeo** (a capa está nos 2 s finais) ou envie `capa-{slug}.jpg` se o app deixar.
- Capa: {data['capa']}

## Campos do YouTube (tela "Adicionar detalhes")
| Campo | O que colocar |
|---|---|
| Visibilidade | Programado (deixe uns dias entre um "E SE" e outro) |
| Público-alvo | Decida pelo seu público real. Desenho animado com personagens crianças pesa para "conteúdo para crianças"; marcar errado pode gerar penalidade. |
| Local | (vazio) |
| Vídeo relacionado | O "E SE" anterior já publicado |
| Playlists | **E SE...? (Shorts)** |
| Promoção paga e marcas | Não |
| Comunidade | Comentários e Remix ligados |
| Uso de IA | **Sim** (narração com voz sintética) |
| Tags | `{', '.join(data['tags'])}` |
| Categoria | Comédia (ou Entretenimento) |
"""
open(f'{OUT}/{slug}.md', 'w').write(md); print('md ok')
