#!/usr/bin/env node
// Gera as imagens da marca do canal em saida/marca/:
//   logo-perfil.png     1080x1080, sem texto (foto de perfil do YouTube, TikTok e Instagram)
//   logo-com-nome.png   1080x1080, com o nome do canal
// Uso: node estudio3d/marca/gerar.js
const { chromium } = require('playwright');
const express = require('express');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..', '..');
const saida = path.join(raiz, 'saida', 'marca');
fs.mkdirSync(saida, { recursive: true });

(async () => {
  const app = express();
  app.use(express.static(raiz));
  const s = await new Promise((ok) => { const x = app.listen(0, '127.0.0.1', () => ok(x)); });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  p.on('pageerror', (e) => console.error('ERRO:', e.message));
  for (const [arq, nome] of [['logo-perfil.png', 0], ['logo-com-nome.png', 1]]) {
    await p.goto(`http://127.0.0.1:${s.address().port}/estudio3d/marca/logo.html?nome=${nome}`);
    await p.waitForFunction(() => window.PRONTO === true);
    await p.screenshot({ path: path.join(saida, arq) });
    console.log(path.join(saida, arq));
  }
  await b.close();
  s.close();
})();
