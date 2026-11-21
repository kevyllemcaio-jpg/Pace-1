import asyncio, edge_tts, json, sys
import ssl, edge_tts.communicate as _c; _c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
async def main():
    txt = open('script.txt').read().strip()
    c = edge_tts.Communicate(txt, 'pt-BR-AntonioNeural', rate=sys.argv[1] if len(sys.argv) > 1 else '+8%', boundary='WordBoundary')
    words = []
    with open('voice.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': words.append({'texto': ch['text'], 'inicio': ch['offset'] / 1e7, 'fim': (ch['offset'] + ch['duration']) / 1e7})
    json.dump(words, open('work/words.json', 'w'), ensure_ascii=False)
asyncio.run(main())
