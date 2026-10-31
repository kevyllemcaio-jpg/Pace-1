# Kit do Estúdio — Constrói Isso Aí!

Este kit é o estúdio usado para criar os vídeos do curso: cenários 3D low-poly, personagem,
câmera sem cortes, legenda palavra por palavra, narração e música original.

## 1. O que instalar (uma vez só)
Peça para o Claude Code fazer isso por você ("instale tudo que o estúdio precisa"), ou instale:

| Programa | Para quê | Como conferir |
|---|---|---|
| **Node.js 18+** | roda o estúdio | `node -v` |
| **Python 3.10+** | voz e música | `python3 --version` |
| **ffmpeg** | monta o vídeo e o áudio | `ffmpeg -version` |
| **Claude Code** | a IA que monta os vídeos | `claude --version` |

Depois, dentro da pasta do kit:

```
npm install
npx playwright install chromium
pip install edge-tts numpy scipy
```

## 2. Testar
```
node estudio3d/render3d.js ponte --previa
```
Cria uma imagem por cena em `saida/`. Se apareceram as imagens, está tudo certo.

## 3. Criar um vídeo novo (com o Claude Code)
Abra o terminal na pasta do kit, digite `claude` e peça, por exemplo:

> Crie um vídeo no formato do estúdio 3D (leia o estudio3d/PADRAO.md) sobre: como funciona um elevador.
> Use este roteiro: ...

Depois:
- "Me mostre as prévias." → confira cada cena.
- Peça ajustes, um de cada vez ("o personagem está cortado na thumb, afaste a câmera").
- "Pode renderizar o vídeo final." → o vídeo sai em `saida/<nome>.mp4`.

## 4. Comandos úteis
- `node estudio3d/render3d.js <video> --previa` → uma imagem por cena (rápido)
- `node estudio3d/quadros.js <video> 0,10,25` → imagens de instantes exatos
- `node estudio3d/render3d.js <video>` → vídeo final com voz, legenda e música
- `node estudio3d/musicar.js <video>` → troca/recoloca a música de um vídeo pronto

## 5. Avisos importantes
- **Tempo de renderização:** depende do computador. Renderize um vídeo por vez.
- **Voz:** o kit usa vozes neurais gratuitas do serviço de leitura em voz alta da Microsoft
  (biblioteca `edge-tts`), que não é um serviço oficial para uso comercial. Para monetizar
  com segurança, troque por um serviço com licença comercial (ex.: Azure Speech ou ElevenLabs);
  peça ao Claude Code para fazer a troca no arquivo `estudio/voz.py`.
- **Música:** gerada pelo próprio kit (`estudio3d/musica.py`), sem direitos de terceiros.
- **Fatos:** sempre confira os números do roteiro antes de publicar.
- **Rótulo de IA:** no TikTok, ative "conteúdo gerado por IA" ao postar.

## 6. Bibliotecas usadas (licenças livres)
three.js (MIT), Playwright (Apache 2.0), Express (MIT), edge-tts (LGPL), NumPy/SciPy (BSD),
fonte Inter (SIL OFL).
