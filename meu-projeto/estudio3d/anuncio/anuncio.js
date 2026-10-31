#!/usr/bin/env node
// Monta um criativo de anúncio a partir de cenas limpas dos vídeos do canal.
// Uso: node estudio3d/anuncio/anuncio.js anuncio-a   -> saida/anuncio-a.mp4
//
// 1) narração (voz) por bloco  2) recorta cenas limpas (render3d --limpo)  3) junta as cenas
// 4) desenha legenda/títulos/botão por cima (Playwright, fundo transparente)  5) voz + música.

const { chromium } = require('playwright');
const { spawn, spawnSync, execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const CRIATIVOS = require('./criativos');

const nome = process.argv[2];
const criativo = CRIATIVOS[nome];
if (!criativo) { console.error('Criativos:', Object.keys(CRIATIVOS).join(', ')); process.exit(1); }
const raiz = path.join(__dirname, '..', '..');
const saida = path.join(raiz, 'saida');
const tmp = path.join(saida, '.anuncio', nome);
fs.mkdirSync(tmp, { recursive: true });
const FPS = 30, VOZ = 'pt-BR-AntonioNeural', VEL = '+12%', ATRASO = 0.12;

const ff = (a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' });
function fimDaFala(arq) {
  const total = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString());
  const log = spawnSync('ffmpeg', ['-i', arq, '-af', 'silencedetect=n=-45dB:d=0.15', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const u = ini[ini.length - 1];
  return u && total - u < 1.5 ? u : total;
}
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]/g, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const destacar = (l) => l.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith('*') ? `<span class="destaque">${esc(p.slice(1, -1))}</span>` : esc(p))).join('');
const lim = (x) => Math.min(1, Math.max(0, x));
function salto(x) { x = lim(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; }

(async () => {
  // 1) narração
  let t = 0;
  const blocos = criativo.blocos.map((b) => {
    const id = crypto.createHash('sha1').update(`${VOZ}|${VEL}|${b.fala}`).digest('hex').slice(0, 12);
    const mp3 = path.join(saida, '.voz', `${id}.mp3`), json = mp3.replace('.mp3', '.json');
    fs.mkdirSync(path.dirname(mp3), { recursive: true });
    if (!fs.existsSync(json)) execFileSync('python3', [path.join(raiz, 'estudio', 'voz.py'), b.fala, mp3, VOZ, VEL, json]);
    const dur = Math.round((ATRASO + fimDaFala(mp3) + 0.25) * FPS) / FPS;
    const r = { ...b, mp3, palavras: JSON.parse(fs.readFileSync(json, 'utf8')), inicio: t, dur };
    t += dur;
    return r;
  });
  const total = t;
  console.log(`${nome}: ${total.toFixed(1)} s`);

  // 2) cenas limpas (cada clipe ocupa uma fatia do bloco)
  const segmentos = [];
  for (const b of blocos) {
    const fatia = Math.round((b.dur / b.clipes.length) * FPS) / FPS;
    b.clipes.forEach(([video, seg], i) => {
      const d = i === b.clipes.length - 1 ? Math.round((b.dur - fatia * (b.clipes.length - 1)) * FPS) / FPS : fatia;
      const de = seg, ate = seg + d + 0.1;
      const arq = path.join(saida, 'clipes', `${video}_${de.toFixed(2)}_${ate.toFixed(2)}.mp4`);
      if (!fs.existsSync(arq)) {
        process.stdout.write(`cena ${video} ${de}s... `);
        execFileSync('node', [path.join(raiz, 'estudio3d', 'render3d.js'), video, '--limpo', `--de=${de}`, `--ate=${ate}`, '--escala=1'], { stdio: ['ignore', 'ignore', 'inherit'] });
        console.log('ok');
      }
      segmentos.push({ arq, d });
    });
  }
  // 3) junta as cenas com a duração exata
  const lista = path.join(tmp, 'lista.txt');
  const partes = segmentos.map((s, i) => {
    const p = path.join(tmp, `seg${String(i).padStart(2, '0')}.mp4`);
    ff(['-i', s.arq, '-t', s.d.toFixed(3), '-vf', `fps=${FPS},scale=1080:1920`, '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-an', p]);
    return p;
  });
  fs.writeFileSync(lista, partes.map((p) => `file '${p}'`).join('\n'));
  const base = path.join(tmp, 'base.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', base]);
  const cortes = [];
  { let acc = 0; segmentos.forEach((s) => { cortes.push(acc); acc += s.d; }); }

  // 4) camada de texto por cima
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  await page.goto('file://' + path.join(__dirname, 'camada.html'));
  const comTexto = path.join(tmp, 'com-texto.mp4');
  const proc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', base, '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-filter_complex', '[0:v][1:v]overlay=0:0:format=auto', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', comTexto], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fim = new Promise((ok, erro) => proc.on('close', (c) => (c === 0 ? ok() : erro(new Error('ffmpeg ' + c)))));
  const pop = (lt, ini) => `transform: translate(-50%,0) scale(${Math.max(0.01, salto((lt - ini) / 0.3))}); opacity:${lim((lt - ini) / 0.1)};`;
  const nq = Math.round(total * FPS);
  for (let f = 0; f < nq; f++) {
    const tt = f / FPS;
    const b = blocos.findLast((x) => tt >= x.inicio) || blocos[0];
    const lt = tt - b.inicio;
    let h = `<div class="marca">@constroiissoai</div>`;
    if (b.titulo) h += `<div class="titulo contorno" style="transform: scale(${Math.max(0.01, salto(lt / 0.3))})">${b.titulo.map(destacar).join('<br>')}</div>`;
    if (b.cartao && lt > 0.4) h += `<div class="cartao" style="${pop(lt, 0.4)}"><div class="num">${esc(b.cartao[0])}</div><div class="sub">${esc(b.cartao[1])}</div></div>`;
    if (b.etiqueta && lt > 0.4) h += `<div class="etiqueta" style="${pop(lt, 0.4)}">${esc(b.etiqueta)}</div>`;
    if (b.botao) {
      const k = 1 + 0.05 * Math.sin(tt * 8);
      h += `<div class="botao" style="transform: translate(-50%,0) scale(${salto(lt / 0.35) * k})">${esc(b.botao)}</div>`;
      h += `<div class="seta" style="transform: translate(-50%, ${-10 * Math.abs(Math.sin(tt * 6))}px)">▲</div>`;
    }
    // legenda: até 2 palavras por vez
    const pal = b.palavras.map((p) => ({ ...p, inicio: p.inicio + ATRASO, fim: p.fim + ATRASO }));
    const grupos = [];
    for (const p of pal) { const u = grupos[grupos.length - 1]; if (u && u.p.length < 2 && p.inicio - u.fim < 0.25) { u.p.push(p); u.fim = p.fim; } else grupos.push({ p: [p], inicio: p.inicio, fim: p.fim }); }
    const g = grupos.findLast((x) => x.inicio <= lt);
    if (g && lt < g.fim + 0.5 && !b.botao) {
      const ds = (b.destaque || []).map(norm);
      const txt = g.p.map((p) => { const l = p.texto.replace(/[.,!?:;]+$/, ''); const T = l.charAt(0).toUpperCase() + l.slice(1); return ds.includes(norm(l)) ? `<span class="destaque">${esc(T)}</span>` : esc(T); }).join(' ');
      h += `<div class="legenda contorno" style="transform: scale(${0.85 + 0.15 * lim((lt - g.inicio) / 0.12)})">${txt}</div>`;
    }
    // flash curto em cada corte
    const ultimoCorte = cortes.findLast((c) => c <= tt) || 0;
    if (ultimoCorte > 0 && tt - ultimoCorte < 0.1) h += `<div style="position:absolute;inset:0;background:#fff;opacity:${0.6 * (1 - (tt - ultimoCorte) / 0.1)}"></div>`;
    await page.evaluate((x) => (document.getElementById('camada').innerHTML = x), h);
    const png = await page.screenshot({ omitBackground: true, type: 'png' });
    if (!proc.stdin.write(png)) await new Promise((r) => proc.stdin.once('drain', r));
  }
  proc.stdin.end();
  await fim;
  await browser.close();

  // 5) áudio: voz + whoosh nos cortes + música original (abaixa sob a voz)
  const whoosh = path.join(tmp, 'whoosh.wav');
  ff(['-f', 'lavfi', '-i', 'anoisesrc=d=0.35:c=pink:a=0.5', '-af', 'highpass=f=400,lowpass=f=3500,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.23', whoosh]);
  const musica = path.join(tmp, 'musica.wav');
  execFileSync('python3', [path.join(raiz, 'estudio3d', 'musica.py'), musica, String(total), String(nome === 'anuncio-a' ? 4242 : 777)]);
  const faixas = [];
  blocos.forEach((b) => faixas.push([b.mp3, b.inicio + ATRASO, 1.6]));
  cortes.slice(1).forEach((c) => faixas.push([whoosh, Math.max(0, c - 0.08), 0.35]));
  const ent = ['-i', comTexto];
  faixas.forEach(([a]) => ent.push('-i', a));
  ent.push('-i', musica);
  const iM = faixas.length + 1;
  const filtro =
    faixas.map(([, ini, v], i) => `[${i + 1}:a]aresample=44100,aformat=channel_layouts=stereo,volume=${v},adelay=${Math.round(ini * 1000)}:all=1[s${i}]`).join(';') +
    `;${faixas.map((_, i) => `[s${i}]`).join('')}amix=inputs=${faixas.length}:normalize=0,apad[voz];[voz]asplit=2[v1][chave];` +
    `[${iM}:a]volume=0.2[m];[m][chave]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=350[md];[v1][md]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]`;
  const final = path.join(saida, `${nome}.mp4`);
  ff([...ent, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final]);
  console.log(`Pronto: ${final} (${total.toFixed(1)} s)`);
})().catch((e) => { console.error(e); process.exit(1); });
