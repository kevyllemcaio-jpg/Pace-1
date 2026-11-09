#!/usr/bin/env node
// Foto de perfil do canal (1080x1080, pensada para corte redondo).
// Uso: node estudio/perfil.js  -> saida/perfil.png
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const pasta = __dirname;
const saida = path.join(pasta, '..', 'saida');
fs.mkdirSync(saida, { recursive: true });
const f = (a) => fs.readFileSync(path.join(pasta, 'fontes', a)).toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Oswald;src:url(data:font/woff2;base64,${f('oswald-700.woff2')})}html,body{margin:0}svg{display:block}</style></head>` +
      '<body><svg id="tela" xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"></svg></body></html>'
  );
  for (const a of ['base.js', 'pessoas.js']) await page.addScriptTag({ path: path.join(pasta, a) });
  await page.evaluate(() => {
    let s = `<defs><radialGradient id="sol" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#FFE15A"/><stop offset="0.6" stop-color="#FFC21F"/><stop offset="1" stop-color="#F59E0B"/></radialGradient></defs>`;
    s += `<rect width="1080" height="1080" fill="url(#sol)"/>`;
    // raios
    for (let i = 0; i < 24; i++)
      s += `<path d="M 540 480 L ${540 + Math.cos((i * 15 - 3) * Math.PI / 180) * 1000} ${480 + Math.sin((i * 15 - 3) * Math.PI / 180) * 1000} L ${540 + Math.cos((i * 15 + 3) * Math.PI / 180) * 1000} ${480 + Math.sin((i * 15 + 3) * Math.PI / 180) * 1000} Z" fill="#FFF3A6" opacity="${i % 2 ? 0.18 : 0.32}"/>`;
    // moedas e geladinhos flutuando
    [[190, 260, 1.4], [880, 230, 1.2], [140, 620, 1.1], [930, 600, 1.5], [300, 140, 0.9], [770, 120, 1]].forEach(([x, y, k]) =>
      (s += `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${moedaSolta(x, y)}</g>`));
    s += geladinho('#E85D9E', 240, 430, -24, 0.9) + geladinho('#3BB273', 850, 410, 20, 0.9);
    // Kevylem (meio corpo), sorrindo, segurando o isopor de geladinhos
    s += theoOuKevylem();
    function theoOuKevylem() {
      return kevylem({ x: 540, y: 1200, esc: 1.42, expr: 'sorriso', pose: 'segura', t: 0.5, olhar: [0, 0.1], segura: isopor(0, 10, 0.95) });
    }
    document.getElementById('tela').innerHTML = s;
  });
  const arq = path.join(saida, 'perfil.png');
  await page.screenshot({ path: arq });
  await browser.close();
  console.log(arq);
})();
