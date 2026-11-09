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
    // brilho atrás do personagem
    s += `<circle cx="540" cy="520" r="400" fill="#FFF6C8" opacity="0.35"/><circle cx="540" cy="520" r="300" fill="#FFF6C8" opacity="0.35"/>`;
    // moedas grandes com brilho
    const moeda = (x, y, r, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="4" cy="6" rx="${r}" ry="${r}" fill="#000" opacity="0.15"/><circle r="${r}" fill="#F7C531" stroke="#8A5A0B" stroke-width="${r * 0.12}"/><circle r="${r * 0.72}" fill="none" stroke="#C98A12" stroke-width="${r * 0.08}"/>` +
      `<text y="${r * 0.36}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="${r * 1.05}" fill="#8A5A0B">$</text><path d="M ${-r * 0.5} ${-r * 0.45} A ${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.1} ${-r * 0.75}" stroke="#fff" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round" opacity="0.8"/></g>`;
    [[170, 250, 52, -15], [915, 300, 44, 12], [120, 640, 38, 8], [960, 690, 56, -10], [330, 110, 30, 20], [745, 120, 34, -20]].forEach(([x, y, r, a]) => (s += moeda(x, y, r, a)));
    // brilhos
    const brilho = (x, y, k) => `<path d="M ${x} ${y - 30 * k} Q ${x + 5 * k} ${y - 5 * k} ${x + 30 * k} ${y} Q ${x + 5 * k} ${y + 5 * k} ${x} ${y + 30 * k} Q ${x - 5 * k} ${y + 5 * k} ${x - 30 * k} ${y} Q ${x - 5 * k} ${y - 5 * k} ${x} ${y - 30 * k} Z" fill="#fff"/>`;
    s += brilho(250, 420, 0.9) + brilho(860, 470, 1.1) + brilho(620, 90, 0.7) + brilho(90, 880, 0.8);
    // Kevylem: meio corpo, confiante, erguendo um geladinho
    s += kevylem({ x: 520, y: 1440, esc: 1.72, expr: 'orgulhoso', pose: 'ergue', t: 0.5, olhar: [0.6, -0.3], naMao: geladinho('#E8434F', 0, -50, 12, 1.15) });
    // vinheta suave nas bordas
    s += `<defs><radialGradient id="vin" cx="0.5" cy="0.5" r="0.7"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#7A3A00" stop-opacity="0.35"/></radialGradient></defs><rect width="1080" height="1080" fill="url(#vin)"/>`;
    document.getElementById('tela').innerHTML = s;
  });
  const arq = path.join(saida, 'perfil.png');
  await page.screenshot({ path: arq });
  await browser.close();
  console.log(arq);
})();
