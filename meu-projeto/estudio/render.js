#!/usr/bin/env node
// Renderiza um vídeo do estúdio para MP4 (1080x1920, 30 fps).
//
// Uso:
//   node estudio/render.js estudio/videos/altura.js            -> saida/altura.mp4
//   node estudio/render.js estudio/videos/altura.js --previa   -> um PNG por cena

const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const videoArg = args.find((a) => !a.startsWith('--'));
const resto = args.filter((a) => a.startsWith('--'));
if (!videoArg) {
  console.error('Uso: node estudio/render.js estudio/videos/<video>.js [--previa]');
  process.exit(1);
}
const previa = resto.includes('--previa');
const pastaEstudio = __dirname;
const pastaSaida = path.join(pastaEstudio, '..', 'saida');
fs.mkdirSync(pastaSaida, { recursive: true });
const nome = path.basename(videoArg, '.js');

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(
    '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}svg{display:block}</style></head>' +
      '<body><svg id="tela" xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg></body></html>'
  );
  for (const arq of ['comum.js', 'personagem.js', 'cenario.js']) await page.addScriptTag({ path: path.join(pastaEstudio, arq) });
  await page.addScriptTag({ path: path.resolve(videoArg) });

  const { duracao, inicios, fps } = await page.evaluate(() => ({ duracao: DURACAO, inicios: INICIOS, fps: FPS }));
  const desenhar = (t) => page.evaluate((t) => (document.getElementById('tela').innerHTML = renderizar(t)) && null, t);

  if (previa) {
    for (let i = 0; i < inicios.length; i++) {
      const fim = i + 1 < inicios.length ? inicios[i + 1] : duracao;
      await desenhar(inicios[i] + Math.min(1.8, (fim - inicios[i]) * 0.6));
      const arq = path.join(pastaSaida, `${nome}-cena${i + 1}.png`);
      await page.screenshot({ path: arq });
      console.log(arq);
    }
    await browser.close();
    return;
  }

  // 1) Vídeo (sem áudio): cada quadro vira JPEG e vai direto para o ffmpeg.
  const semAudio = path.join(pastaSaida, `.${nome}-sem-audio.mp4`);
  const ff = spawn(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', semAudio],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );
  const fimFF = new Promise((ok, erro) => ff.on('close', (c) => (c === 0 ? ok() : erro(new Error(`ffmpeg saiu com ${c}`)))));
  const total = Math.round(duracao * fps);
  for (let f = 0; f < total; f++) {
    await desenhar(f / fps);
    const quadro = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(quadro)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % fps === 0) process.stdout.write(`\rquadros: ${f}/${total}`);
  }
  ff.stdin.end();
  await fimFF;
  await browser.close();
  console.log(`\rquadros: ${total}/${total}`);

  // 2) Áudio: um "whoosh" em cada troca de cena.
  const whoosh = path.join(pastaSaida, '.whoosh.wav');
  ffmpeg(['-f', 'lavfi', '-i', 'anoisesrc=d=0.45:c=pink:a=0.6',
    '-af', 'highpass=f=300,lowpass=f=3000,afade=t=in:d=0.2,afade=t=out:st=0.2:d=0.25,volume=0.8', whoosh]);
  const trocas = inicios.slice(1);
  const entradas = ['-i', semAudio];
  trocas.forEach(() => entradas.push('-i', whoosh));
  const filtro =
    trocas.map((s, i) => `[${i + 1}:a]adelay=${Math.max(0, Math.round((s - 0.15) * 1000))}:all=1[w${i}]`).join(';') +
    `;${trocas.map((_, i) => `[w${i}]`).join('')}amix=inputs=${trocas.length}:normalize=0,apad[a]`;
  const final = path.join(pastaSaida, `${nome}.mp4`);
  ffmpeg([...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', final]);
  fs.rmSync(semAudio);
  fs.rmSync(whoosh);
  console.log(`Pronto: ${final} (${duracao.toFixed(1)} s)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
