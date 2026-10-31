#!/usr/bin/env node
// Tira "fotos" de instantes específicos de um vídeo 3D (para conferir sem renderizar tudo).
// Uso: node estudio3d/quadros.js ponte 0,2.5,10   -> saida/<video>-t<tempo>.png
// Usa os tempos reais da narração se ela já foi gerada (cache em saida/.voz).
const { chromium } = require('playwright');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const [nome, lista] = process.argv.slice(2);
const raiz = path.join(__dirname, '..');
(async () => {
  const app = express(); app.use(express.static(raiz));
  const s = await new Promise((ok) => { const x = app.listen(0, '127.0.0.1', () => ok(x)); });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  p.on('pageerror', (e) => console.error('ERRO:', e.message));
  await p.goto(`http://127.0.0.1:${s.address().port}/estudio3d/pagina.html?video=${nome}&escala=1.5`);
  await p.waitForFunction(() => window.PRONTO === true);
  const { voz = 'pt-BR-AntonioNeural', velocidade = '+10%' } = await p.evaluate(() => MOTOR.config);
  const falas = await p.evaluate(() => MOTOR.falas());
  const tempos = falas.map((f) => {
    if (!f) return null;
    const id = crypto.createHash('sha1').update(`${voz}|${velocidade}|${f}`).digest('hex').slice(0, 12);
    const mp3 = path.join(raiz, 'saida/.voz', id + '.mp3'), json = mp3.replace('.mp3', '.json');
    if (!fs.existsSync(json)) return null;
    const total = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
    const log = spawnSync('ffmpeg', ['-i', mp3, '-af', 'silencedetect=n=-45dB:d=0.15', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
    const fim = ini.length && total - ini[ini.length - 1] < 1.5 ? ini[ini.length - 1] : total;
    return { dur: 0.2 + fim + 0.35, palavras: JSON.parse(fs.readFileSync(json, 'utf8')) };
  });
  if (tempos.every(Boolean)) await p.evaluate((t) => MOTOR.definirTempos(t), tempos);
  console.log('inicios:', (await p.evaluate(() => MOTOR.inicios())).map((x) => x.toFixed(1)).join(' '), ' total:', (await p.evaluate(() => MOTOR.duracao())).toFixed(1));
  for (const t of lista.split(',').map(Number)) {
    const t0 = Date.now();
    await p.evaluate((t) => MOTOR.quadro(t), t);
    const arq = path.join(raiz, 'saida', `${nome}-t${t}.png`);
    await p.screenshot({ path: arq });
    console.log(arq, `${Date.now() - t0} ms`);
  }
  await b.close(); s.close();
})();
