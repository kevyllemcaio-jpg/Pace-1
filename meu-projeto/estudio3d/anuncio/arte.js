#!/usr/bin/env node
// Gera a arte estática de anúncio (1080x1920) em vários preços.
// Uso: node estudio3d/anuncio/arte.js 47,90 19,90
//   -> publicacao/arte-anuncio-47-90.png, publicacao/arte-anuncio-19-90.png
// Antes, gere as fotos do personagem: node estudio3d/render3d.js foto-anuncio --previa --sem-voz
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

const precos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const parcela = (process.argv.find((a) => a.startsWith('--parcela=')) || '').split('=')[1];
if (!precos.length) { console.error('Uso: node estudio3d/anuncio/arte.js 47,90 19,90 [--parcela="ou 4x de R$ 13,55"]'); process.exit(1); }
const raiz = path.join(__dirname, '..', '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  for (const preco of precos) {
    const url = pathToFileURL(path.join(__dirname, 'arte.html')).href + `?preco=${encodeURIComponent(preco)}` + (parcela ? `&parcela=${encodeURIComponent(parcela)}` : '');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const arq = path.join(raiz, 'publicacao', `arte-anuncio-${preco.replace(',', '-')}.png`);
    await page.screenshot({ path: arq });
    console.log(arq);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
