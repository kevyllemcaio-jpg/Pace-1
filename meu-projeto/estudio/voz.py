"""Gera a narração de uma fala (pt-BR) com voz neural (edge-tts) + o tempo de cada palavra.

Uso: python3 estudio/voz.py "texto" saida.mp3 [voz] [velocidade] [palavras.json]
O JSON sai assim: [{"texto": "Esse", "inicio": 0.09, "fim": 0.43}, ...]
Requer: pip install edge-tts
"""
import asyncio
import json
import os
import sys

# Em ambientes com proxy de certificado próprio (ex.: Claude Code na nuvem).
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    import certifi
    certifi.where = lambda: CA

import edge_tts


async def main(texto, saida, voz='pt-BR-AntonioNeural', velocidade='+12%', arq_palavras=None):
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


async def com_tentativas(*args, tentativas=9):
    # O serviço de voz às vezes não devolve áudio (falha passageira): tenta de novo com espera crescente.
    for n in range(tentativas):
        try:
            return await main(*args)
        except Exception as e:
            if n == tentativas - 1:
                raise
            espera = min(20, 2 ** (n + 1))
            print(f'(voz falhou: {type(e).__name__}; tentando de novo em {espera}s)', file=sys.stderr)
            await asyncio.sleep(espera)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asyncio.run(com_tentativas(*sys.argv[1:6]))
