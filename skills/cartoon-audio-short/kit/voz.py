"""Gera a narração de uma fala (pt-BR) com vozes neurais (edge-tts).

Uso: python3 estudio/voz.py "texto" saida.mp3 [voz] [velocidade] [palavras.json]
Ex.: python3 estudio/voz.py "Olá!" ola.mp3 pt-BR-AntonioNeural +8% ola.json

Se o 5º argumento for dado, salva o tempo de cada palavra (em segundos):
  [{"texto": "Olá", "inicio": 0.1, "fim": 0.45}, ...]   -> usado nas legendas palavra por palavra.
Requer: pip install edge-tts
"""
import asyncio
import json
import os
import sys

# Neste ambiente a internet passa por um proxy com certificado próprio.
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    import certifi
    certifi.where = lambda: CA

import edge_tts


async def main(texto, saida, voz='pt-BR-AntonioNeural', velocidade='+8%', arq_palavras=None):
    com = edge_tts.Communicate(texto, voz, rate=velocidade, boundary='WordBoundary')
    palavras = []
    with open(saida, 'wb') as f:
        async for parte in com.stream():
            if parte['type'] == 'audio':
                f.write(parte['data'])
            elif parte['type'] == 'WordBoundary':
                ini = parte['offset'] / 1e7
                palavras.append({'texto': parte['text'], 'inicio': ini, 'fim': ini + parte['duration'] / 1e7})
    if arq_palavras:
        with open(arq_palavras, 'w', encoding='utf-8') as f:
            json.dump(palavras, f, ensure_ascii=False)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asyncio.run(main(*sys.argv[1:6]))
