#!/usr/bin/env node
// Renderiza um vídeo do estúdio para MP4 (1080x1920, 30 fps).
//
// Uso:
//   node estudio/render.js estudio/videos/altura.js            -> saida/altura.mp4
//   node estudio/render.js estudio/videos/altura.js --previa   -> um PNG por cena
//   node estudio/render.js estudio/videos/altura.js --sem-voz  -> sem narração
//
// Narração: cada cena com "fala" vira um MP3 (estudio/voz.py). A cena passa a durar
// pelo menos o tempo da fala + uma pausa. Os áudios ficam em cache em saida/.voz/.

const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const crypto = require('crypto');
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
const comVoz = !previa && !resto.includes('--sem-voz');
const pastaEstudio = __dirname;
const pastaSaida = path.join(pastaEstudio, '..', 'saida');
fs.mkdirSync(pastaSaida, { recursive: true });
const nome = path.basename(videoArg, '.js');

// Duração útil da fala: ignora o silêncio que a voz sintética deixa no final.
function duracaoFala(arq) {
  const total = parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString()
  );
  const log = require('child_process').spawnSync('ffmpeg', ['-i', arq, '-af', 'silencedetect=n=-45dB:d=0.15', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const inicios = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const ultimo = inicios[inicios.length - 1];
  return ultimo && total - ultimo < 1.5 ? ultimo : total;
}

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

  let { duracao, inicios, fps } = await page.evaluate(() => ({ duracao: DURACAO, inicios: INICIOS, fps: FPS }));

  // Narração: gera (ou reaproveita) um MP3 por fala e ajusta a duração das cenas.
  const ATRASO_FALA = 0.25; // segundos entre o início da cena e o começo da fala
  const PAUSA = 0.3; // respiro depois da fala
  let audiosFala = [];
  if (comVoz) {
    const { falas, durs, voz } = await page.evaluate(() => ({ falas: FALAS, durs: CENAS.map((c) => c.dur), voz: VOZ }));
    const pastaVoz = path.join(pastaSaida, '.voz');
    fs.mkdirSync(pastaVoz, { recursive: true });
    const novas = durs.slice();
    falas.forEach((fala, i) => {
      if (!fala) return audiosFala.push(null);
      const id = crypto.createHash('sha1').update(`${voz.voz}|${voz.velocidade}|${fala}`).digest('hex').slice(0, 12);
      const arq = path.join(pastaVoz, `${id}.mp3`);
      if (!fs.existsSync(arq)) {
        process.stdout.write(`voz: cena ${i + 1}... `);
        execFileSync('python3', [path.join(pastaEstudio, 'voz.py'), fala, arq, voz.voz, voz.velocidade], { stdio: 'inherit' });
        console.log('ok');
      }
      const dur = duracaoFala(arq);
      novas[i] = Math.max(durs[i], ATRASO_FALA + dur + PAUSA);
      audiosFala.push(arq);
    });
    ({ duracao, inicios } = await page.evaluate((d) => definirDuracoes(d), novas));
  }
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

  // 2) Áudio: narração + um "whoosh" em cada troca de cena.
  const whoosh = path.join(pastaSaida, '.whoosh.wav');
  ffmpeg(['-f', 'lavfi', '-i', 'anoisesrc=d=0.45:c=pink:a=0.6',
    '-af', 'highpass=f=300,lowpass=f=3000,afade=t=in:d=0.2,afade=t=out:st=0.2:d=0.25,volume=0.8', whoosh]);
  const sons = []; // [arquivo, início em segundos, volume]
  inicios.slice(1).forEach((s) => sons.push([whoosh, Math.max(0, s - 0.15), comVoz ? 0.45 : 1]));
  audiosFala.forEach((arq, i) => arq && sons.push([arq, inicios[i] + ATRASO_FALA, 1.6]));
  const entradas = ['-i', semAudio];
  sons.forEach(([arq]) => entradas.push('-i', arq));
  const filtro =
    sons.map(([, ini, vol], i) => `[${i + 1}:a]aresample=44100,volume=${vol},adelay=${Math.round(ini * 1000)}:all=1[s${i}]`).join(';') +
    `;${sons.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sons.length}:normalize=0,alimiter=limit=0.95,apad[a]`;
  const final = path.join(pastaSaida, `${nome}.mp4`);
  ffmpeg([...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final]);
  fs.rmSync(semAudio);
  fs.rmSync(whoosh);
  console.log(`Pronto: ${final} (${duracao.toFixed(1)} s)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
