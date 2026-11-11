#!/usr/bin/env node
// Foto de perfil da série do Kyle (1080x1080, pensada para corte redondo).
// Uso: node estudio/perfil-kyle.js -> saida/perfil-kyle.png
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pasta = __dirname, saida = path.join(pasta, '..', 'saida');
fs.mkdirSync(saida, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style></head><body><svg id="tela" xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"></svg></body></html>');
  for (const a of ['base.js', 'pessoas.js', 'cenarios.js', 'corpo.js', 'chibi.js', 'cartoon.js']) await page.addScriptTag({ path: path.join(pasta, a) });
  await page.evaluate(() => {
    let s = `<rect width="1080" height="1080" fill="#2E3F9E"/><path d="M 0 0 L 640 0 L 440 1080 L 0 1080 Z" fill="#E8344B"/>`;
    // raios suaves atrás
    for (let i = 0; i < 20; i++) {
      const a0 = (i * 18 - 4) * Math.PI / 180, a1 = (i * 18 + 4) * Math.PI / 180;
      s += `<path d="M 540 520 L ${540 + Math.cos(a0) * 900} ${520 + Math.sin(a0) * 900} L ${540 + Math.cos(a1) * 900} ${520 + Math.sin(a1) * 900} Z" fill="#fff" opacity="0.07"/>`;
    }
    // brilhos amarelos
    const brilho = (x, y, k) => `<path d="M ${x} ${y - 34 * k} Q ${x + 6 * k} ${y - 6 * k} ${x + 34 * k} ${y} Q ${x + 6 * k} ${y + 6 * k} ${x} ${y + 34 * k} Q ${x - 6 * k} ${y + 6 * k} ${x - 34 * k} ${y} Q ${x - 6 * k} ${y - 6 * k} ${x} ${y - 34 * k} Z" fill="#F7C531"/>`;
    s += brilho(190, 250, 1.2) + brilho(900, 230, 1) + brilho(150, 700, 0.8) + brilho(940, 640, 1.1);
    // Kyle em close com contorno branco de adesivo
    s += filtroAdesivo();
    s += `<g filter="url(#adesivo)">${kyleClose({ x: 540, y: 600, esc: 1.25, expr: 'janelinha', t: 0.5, semDente: true, vergonha: 0.4 })}</g>`;
    document.getElementById('tela').innerHTML = s;
  });
  const arq = path.join(saida, 'perfil-kyle.png');
  await page.screenshot({ path: arq });
  await browser.close();
  console.log(arq);
})();
