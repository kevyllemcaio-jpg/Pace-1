"""Gera a narração de uma fala (pt-BR) com vozes neurais (edge-tts).

Uso: python3 estudio/voz.py "texto" saida.mp3 [voz] [velocidade]
Ex.: python3 estudio/voz.py "Olá!" ola.mp3 pt-BR-AntonioNeural +8%
Requer: pip install edge-tts
"""
import asyncio
import os
import sys

# Neste ambiente a internet passa por um proxy com certificado próprio.
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    import certifi
    certifi.where = lambda: CA

import edge_tts


async def main(texto, saida, voz='pt-BR-AntonioNeural', velocidade='+8%'):
    await edge_tts.Communicate(texto, voz, rate=velocidade).save(saida)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asyncio.run(main(*sys.argv[1:5]))
