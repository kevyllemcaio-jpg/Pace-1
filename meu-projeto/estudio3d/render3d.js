#!/usr/bin/env node
// Renderiza um vídeo 3D do estúdio (vertical 1080x1920, 30 fps, com narração).
//
// Uso:
//   node estudio3d/render3d.js ponte            -> saida/ponte.mp4
//   node estudio3d/render3d.js ponte --previa   -> um PNG por bloco (rápido, para conferir)
//   node estudio3d/render3d.js ponte --sem-voz  -> sem narração (tempos estimados)
//   --escala=1  renderiza o 3D em 720x1280 (mais rápido); padrão 1.5 = 1080x1920
//   --limpo --de=10 --ate=13  recorta só esse trecho, sem textos e sem áudio (saida/clipes/)
// Música de fundo original entra automaticamente (desligue com config.musica = false no vídeo).

const { chromium } = require('playwright');
const { spawn, spawnSync, execFileSync } = require('child_process');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { musicar } = require('./musicar');

const args = process.argv.slice(2);
const nome = args.find((a) => !a.startsWith('--'));
if (!nome) {
  console.error('Uso: node estudio3d/render3d.js <video> [--previa] [--sem-voz] [--escala=1.5]');
  process.exit(1);
}
const previa = args.includes('--previa');
const comVoz = !args.includes('--sem-voz');
const escala = parseFloat((args.find((a) => a.startsWith('--escala=')) || '--escala=1.5').split('=')[1]);
const limpo = args.includes('--limpo');
const argNum = (n) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? parseFloat(a.split('=')[1]) : null; };
const trechoDe = argNum('de'), trechoAte = argNum('ate'); // recorte de cena (sem áudio)
const raiz = path.join(__dirname, '..');
const pastaSaida = path.join(raiz, 'saida');
const pastaVoz = path.join(pastaSaida, '.voz');
fs.mkdirSync(pastaVoz, { recursive: true });

const ATRASO_FALA = 0.2; // igual ao motor.js
const PAUSA = 0.35;
const FPS = 30;

function ffmpeg(a) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' });
}

// Fim real da fala (ignora o silêncio que a voz sintética deixa no final).
function fimDaFala(arq) {
  const total = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString());
  const log = spawnSync('ffmpeg', ['-i', arq, '-af', 'silencedetect=n=-45dB:d=0.15', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const ult = ini[ini.length - 1];
  return ult && total - ult < 1.5 ? ult : total;
}

// Efeitos sonoros sintetizados (sem arquivos externos).
const SONS = {
  baque: 'anoisesrc=d=0.6:c=brown:a=0.9,lowpass=f=220,afade=t=out:st=0.05:d=0.55,volume=2.2',
  quebra: 'anoisesrc=d=1.1:c=pink:a=0.9,lowpass=f=900,afade=t=out:st=0.1:d=1.0,volume=1.6',
  rachando: 'anoisesrc=d=0.7:c=white:a=0.5,highpass=f=1500,tremolo=f=28:d=0.9,afade=t=out:st=0.1:d=0.6,volume=0.7',
  splash: 'anoisesrc=d=1.2:c=pink:a=0.8,bandpass=f=1800:w=1500,afade=t=in:d=0.05,afade=t=out:st=0.15:d=1.0,volume=1.1',
  martelo: 'sine=f=180:d=0.35,afade=t=out:st=0.02:d=0.33,volume=1.4',
  tum: 'sine=f=70:d=0.28,afade=t=out:st=0.03:d=0.25,volume=2.6',
  ok: 'sine=f=880:d=0.18,afade=t=out:st=0.05:d=0.13,volume=0.6',
  descarga: 'anoisesrc=d=2.2:c=pink:a=0.8,bandpass=f=700:w=900,afade=t=in:d=0.1,afade=t=out:st=0.8:d=1.4,volume=1.5',
  gargalo: 'anoisesrc=d=1.0:c=brown:a=0.9,lowpass=f=450,tremolo=f=9:d=0.95,afade=t=out:st=0.4:d=0.6,volume=1.8',
  zap: 'sine=f=120:d=0.5,tremolo=f=60:d=1,afade=t=out:st=0.05:d=0.45,volume=1.2',
  fogo: 'anoisesrc=d=2.5:c=brown:a=0.9,lowpass=f=300,afade=t=in:d=0.3,afade=t=out:st=1.5:d=1.0,volume=2.2',
};
function arquivoSom(tipo) {
  const arq = path.join(pastaVoz, `som-${tipo}.wav`);
  if (!fs.existsSync(arq)) ffmpeg(['-f', 'lavfi', '-i', SONS[tipo], '-ar', '44100', '-ac', '1', arq]);
  return arq;
}

(async () => {
  // Servidor local: o navegador precisa de http:// para carregar módulos (three.js).
  const app = express();
  app.use(express.static(raiz));
  const servidor = await new Promise((ok) => { const s = app.listen(0, '127.0.0.1', () => ok(s)); });
  const porta = servidor.address().port;

  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  page.on('pageerror', (e) => console.error('ERRO NA PÁGINA:', e.message));
  page.on('console', (m) => m.type() === 'error' && console.error('console:', m.text()));
  await page.goto(`http://127.0.0.1:${porta}/estudio3d/pagina.html?video=${nome}&escala=${escala}${limpo ? '&limpo=1' : ''}`);
  await page.waitForFunction(() => window.PRONTO === true, null, { timeout: 60000 });

  // 1) Narração: um MP3 + tempos das palavras por bloco (com cache).
  const config = await page.evaluate(() => MOTOR.config);
  const voz = config.voz || 'pt-BR-AntonioNeural';
  const velocidade = config.velocidade || '+10%';
  const falas = await page.evaluate(() => MOTOR.falas());
  const audios = [];
  if (comVoz) {
    const tempos = falas.map((fala, i) => {
      if (!fala) { audios.push(null); return null; }
      const id = crypto.createHash('sha1').update(`${voz}|${velocidade}|${fala}`).digest('hex').slice(0, 12);
      const mp3 = path.join(pastaVoz, `${id}.mp3`), json = path.join(pastaVoz, `${id}.json`);
      if (!fs.existsSync(mp3) || !fs.existsSync(json)) {
        process.stdout.write(`voz: bloco ${i + 1}... `);
        execFileSync('python3', [path.join(raiz, 'estudio', 'voz.py'), fala, mp3, voz, velocidade, json], { stdio: 'inherit' });
        console.log('ok');
      }
      audios.push(mp3);
      return { dur: ATRASO_FALA + fimDaFala(mp3) + PAUSA, palavras: JSON.parse(fs.readFileSync(json, 'utf8')) };
    });
    await page.evaluate((t) => MOTOR.definirTempos(t), tempos);
  }
  const duracao = await page.evaluate(() => MOTOR.duracao());
  const inicios = await page.evaluate(() => MOTOR.inicios());
  const desenhar = (t) => page.evaluate((t) => MOTOR.quadro(t), t);

  if (previa) {
    for (let i = 0; i < inicios.length; i++) {
      const fim = i + 1 < inicios.length ? inicios[i + 1] : duracao;
      await desenhar(inicios[i] + (fim - inicios[i]) * 0.75);
      const arq = path.join(pastaSaida, `${nome}-bloco${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: arq });
      console.log(arq);
    }
    await browser.close();
    servidor.close();
    return;
  }

  // Recorte de um trecho (cena limpa, sem áudio) — usado nos criativos de anúncio
  if (trechoDe != null && trechoAte != null) {
    const pasta = path.join(pastaSaida, 'clipes');
    fs.mkdirSync(pasta, { recursive: true });
    const arq = path.join(pasta, `${nome}_${trechoDe.toFixed(2)}_${trechoAte.toFixed(2)}.mp4`);
    const ffc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', arq], { stdio: ['pipe', 'inherit', 'inherit'] });
    const fimC = new Promise((ok, erro) => ffc.on('close', (c) => (c === 0 ? ok() : erro(new Error(`ffmpeg ${c}`)))));
    for (let f = Math.round(trechoDe * FPS); f < Math.round(trechoAte * FPS); f++) {
      await desenhar(f / FPS);
      const img = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ffc.stdin.write(img)) await new Promise((r) => ffc.stdin.once('drain', r));
    }
    ffc.stdin.end();
    await fimC;
    await browser.close();
    servidor.close();
    console.log(arq);
    return;
  }

  // 2) Quadros -> vídeo
  const semAudio = path.join(pastaSaida, `.${nome}-sem-audio.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', semAudio], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fimFF = new Promise((ok, erro) => ff.on('close', (c) => (c === 0 ? ok() : erro(new Error(`ffmpeg saiu com ${c}`)))));
  const total = Math.round(duracao * FPS);
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await desenhar(f / FPS);
    const img = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % FPS === 0) {
      const resta = ((Date.now() - t0) / (f + 1)) * (total - f) / 1000;
      process.stdout.write(`\rquadros: ${f}/${total}  (faltam ~${Math.round(resta)} s)   `);
    }
  }
  ff.stdin.end();
  await fimFF;
  console.log(`\rquadros: ${total}/${total}                         `);

  // 3) Áudio: narração + efeitos
  const sons = await page.evaluate(() => MOTOR.sons());
  await browser.close();
  servidor.close();
  const faixas = []; // [arquivo, início, volume]
  audios.forEach((a, i) => a && faixas.push([a, inicios[i] + ATRASO_FALA, 1.5]));
  sons.forEach((s) => SONS[s.tipo] && faixas.push([arquivoSom(s.tipo), Math.max(0, s.t), 0.55]));
  const entradas = ['-i', semAudio];
  faixas.forEach(([a]) => entradas.push('-i', a));
  const filtro =
    faixas.map(([, ini, vol], i) => `[${i + 1}:a]aresample=44100,volume=${vol},adelay=${Math.round(ini * 1000)}:all=1[s${i}]`).join(';') +
    `;${faixas.map((_, i) => `[s${i}]`).join('')}amix=inputs=${faixas.length}:normalize=0,alimiter=limit=0.95,apad[a]`;
  // versão só com voz e efeitos (guardada) + versão final com música de fundo
  const semMusica = path.join(pastaSaida, '.sem-musica', `${nome}.mp4`);
  fs.mkdirSync(path.dirname(semMusica), { recursive: true });
  ffmpeg([...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', semMusica]);
  fs.rmSync(semAudio);
  if (config.musica === false) fs.copyFileSync(semMusica, path.join(pastaSaida, `${nome}.mp4`));
  else musicar(nome);
  console.log(`Pronto: ${path.join(pastaSaida, `${nome}.mp4`)} (${duracao.toFixed(1)} s)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
