#!/usr/bin/env node
// Renderiza um episódio para MP4 vertical (1080x1920, 30 fps) com narração, legendas
// palavra por palavra, efeitos sonoros e trilha.
//
//   node estudio/render.js estudio/episodios/ep01.js            -> saida/ep01.mp4
//   node estudio/render.js estudio/episodios/ep01.js --previa   -> um PNG por cena
//   node estudio/render.js estudio/episodios/ep01.js --capa     -> saida/ep01-capa.png (função CAPA() do episódio, ou o 1º quadro)
//   --sem-voz  renderiza sem narração (durações mínimas das cenas)

const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const epArg = args.find((a) => !a.startsWith('--'));
if (!epArg) {
  console.error('Uso: node estudio/render.js estudio/episodios/<ep>.js [--previa|--capa|--sem-voz]');
  process.exit(1);
}
const previa = args.includes('--previa');
const capa = args.includes('--capa');
const story = args.includes('--story'); // saida/<ep>-story.png (função STORY() do episódio)
const comVoz = !args.includes('--sem-voz');
const so = (args.find((a) => a.startsWith('--cena=')) || '').split('=')[1]; // --cena=5 (prévia de uma cena)
const pastaEstudio = __dirname;
const pastaSaida = path.join(pastaEstudio, '..', 'saida');
const pastaVoz = path.join(pastaSaida, '.voz');
fs.mkdirSync(pastaVoz, { recursive: true });
const nome = path.basename(epArg, '.js');

const ffmpeg = (a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' });

function fonteCss() {
  const f = (arq) => fs.readFileSync(path.join(pastaEstudio, 'fontes', arq)).toString('base64');
  return (
    `@font-face{font-family:Anton;src:url(data:font/woff2;base64,${f('anton.woff2')}) format('woff2');font-weight:400 900}` +
    `@font-face{font-family:Oswald;src:url(data:font/woff2;base64,${f('oswald-700.woff2')}) format('woff2');font-weight:600 900}` +
    `@font-face{font-family:Oswald;src:url(data:font/woff2;base64,${f('oswald-400.woff2')}) format('woff2');font-weight:100 500}`
  );
}

// Duração real da fala (ignora o silêncio que a voz sintética deixa no fim).
function duracaoFala(arq, palavras) {
  if (palavras.length) return palavras[palavras.length - 1].fim + 0.1;
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString());
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${fonteCss()}html,body{margin:0;background:#000}svg{display:block}</style></head>` +
      '<body><svg id="tela" xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg></body></html>'
  );
  for (const arq of ['base.js', 'pessoas.js', 'cenarios.js']) await page.addScriptTag({ path: path.join(pastaEstudio, arq) });
  await page.addScriptTag({ path: path.resolve(epArg) });
  await page.evaluate(() => document.fonts.ready);

  // 1) Narração: um MP3 + tempos das palavras por cena (com cache).
  const { falas, durs, vozes } = await page.evaluate(() => ({ falas: FALAS, durs: CENAS.map((c) => c.dur), vozes: VOZES }));
  const tempos = [];
  const audios = [];
  for (let i = 0; i < falas.length; i++) {
    const fala = falas[i];
    const voz = vozes[i];
    if (!fala || !comVoz) {
      tempos.push({ dur: durs[i], palavras: [] });
      audios.push(null);
      continue;
    }
    const id = crypto.createHash('sha1').update(`${voz.voz}|${voz.velocidade}|${fala}`).digest('hex').slice(0, 12);
    const mp3 = path.join(pastaVoz, `${id}.mp3`), js = path.join(pastaVoz, `${id}.json`);
    if (!fs.existsSync(mp3) || !fs.existsSync(js)) {
      process.stdout.write(`voz: cena ${i + 1}... `);
      execFileSync('python3', [path.join(pastaEstudio, 'voz.py'), fala, mp3, voz.voz, voz.velocidade, js], { stdio: 'inherit' });
      console.log('ok');
    }
    const palavras = JSON.parse(fs.readFileSync(js, 'utf8'));
    const ATRASO = await page.evaluate(() => ATRASO_FALA + PAUSA_FALA);
    tempos.push({ dur: Math.max(durs[i], duracaoFala(mp3, palavras) + ATRASO), palavras });
    audios.push(mp3);
  }
  const { duracao, inicios, sons } = await page.evaluate((t) => definirTempos(t), tempos);
  const desenhar = (t) => page.evaluate((t) => { document.getElementById('tela').innerHTML = renderizar(t); }, t);

  if (story) {
    await page.evaluate(() => { document.getElementById('tela').innerHTML = STORY(); });
    const arq = path.join(pastaSaida, `${nome}-story.png`);
    await page.screenshot({ path: arq });
    console.log(arq);
    await browser.close();
    return;
  }
  if (previa || capa) {
    if (capa) {
      const temCapa = await page.evaluate(() => typeof CAPA === 'function');
      if (temCapa) await page.evaluate(() => { document.getElementById('tela').innerHTML = CAPA(); });
      else await desenhar(await page.evaluate(() => CENAS[0].capa ?? 1.2));
      const arq = path.join(pastaSaida, `${nome}-capa.png`);
      await page.screenshot({ path: arq });
      console.log(arq);
    }
    if (previa) {
      for (let i = 0; i < inicios.length; i++) {
        if (so && String(i + 1) !== so) continue;
        const fim = i + 1 < inicios.length ? inicios[i + 1] : duracao;
        const t = inicios[i] + (fim - inicios[i]) * 0.7;
        await desenhar(t);
        const arq = path.join(pastaSaida, `${nome}-cena${String(i + 1).padStart(2, '0')}.png`);
        await page.screenshot({ path: arq });
        console.log(arq);
      }
    }
    await browser.close();
    return;
  }

  // Efeitos e trilha antes dos quadros (falha cedo se algo der errado).
  const pastaSons = path.join(pastaSaida, '.sons');
  execFileSync('python3', [path.join(pastaEstudio, 'sons.py'), pastaSons, String(duracao)], { stdio: 'inherit' });

  // 2) Vídeo sem áudio: quadros em JPEG direto para o ffmpeg.
  const semAudio = path.join(pastaSaida, `.${nome}-sem-audio.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', semAudio], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fimFF = new Promise((ok, erro) => ff.on('close', (c) => (c === 0 ? ok() : erro(new Error(`ffmpeg saiu com ${c}`)))));
  const total = Math.round(duracao * 30);
  for (let f = 0; f < total; f++) {
    await desenhar(f / 30);
    const quadro = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(quadro)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 30 === 0) process.stdout.write(`\rquadros: ${f}/${total}`);
  }
  ff.stdin.end();
  await fimFF;
  await browser.close();
  console.log(`\rquadros: ${total}/${total}`);

  // 3) Áudio: trilha + whoosh nos cortes + efeitos + narração.
  const faixas = [[path.join(pastaSons, 'trilha.wav'), 0, 0.22]];
  inicios.slice(1).forEach((s) => faixas.push([path.join(pastaSons, 'whoosh.wav'), Math.max(0, s - 0.12), 0.35]));
  sons.forEach((e) => faixas.push([path.join(pastaSons, `${e.s}.wav`), e.t, 0.45 * e.vol]));
  audios.forEach((a, i) => a && faixas.push([a, inicios[i] + 0.2, 1.7]));
  const entradas = ['-i', semAudio];
  faixas.forEach(([a]) => entradas.push('-i', a));
  const filtro =
    faixas.map(([, ini, vol], i) => `[${i + 1}:a]aresample=44100,aformat=channel_layouts=mono,volume=${vol},adelay=${Math.round(ini * 1000)}:all=1[s${i}]`).join(';') +
    `;${faixas.map((_, i) => `[s${i}]`).join('')}amix=inputs=${faixas.length}:normalize=0,alimiter=limit=0.95,apad[a]`;
  const final = path.join(pastaSaida, `${nome}.mp4`);
  ffmpeg([...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final]);
  fs.rmSync(semAudio);
  console.log(`Pronto: ${final} (${duracao.toFixed(1)} s)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
