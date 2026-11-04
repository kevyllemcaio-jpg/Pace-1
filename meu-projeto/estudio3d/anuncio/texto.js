#!/usr/bin/env node
// Criativo de anúncio SÓ COM TEXTO (sem cenário e sem personagem): fundo escuro, palavras
// grandes entrando no ritmo da narração, números, lista, carimbo, botão e efeitos sonoros.
//
// Uso:
//   node estudio3d/anuncio/texto.js anuncio-d            -> saida/anuncio-d.mp4 (1080x1920)
//   node estudio3d/anuncio/texto.js anuncio-d --previa   -> um PNG por bloco em saida/
//
// Os roteiros ficam em estudio3d/anuncio/criativos-texto.js.
// Requer: npm install, pip install edge-tts.

const { chromium } = require('playwright');
const { spawn, spawnSync, execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { SONS, arquivoSom } = require('../sons');
const CRIATIVOS = require('./criativos-texto');

const args = process.argv.slice(2);
const nome = args.find((a) => !a.startsWith('--'));
const previa = args.includes('--previa');
if (!nome || !CRIATIVOS[nome]) {
  console.error(`Uso: node estudio3d/anuncio/texto.js <criativo> [--previa]\nCriativos: ${Object.keys(CRIATIVOS).join(', ')}`);
  process.exit(1);
}
const criativo = CRIATIVOS[nome];
const raiz = path.join(__dirname, '..', '..');
const pastaSaida = path.join(raiz, 'saida');
const pastaVoz = path.join(pastaSaida, '.voz');
fs.mkdirSync(pastaVoz, { recursive: true });

const FPS = 30, ATRASO = 0.15, PAUSA = 0.25;
const VOZ = criativo.voz || 'pt-BR-AntonioNeural', VELOCIDADE = criativo.velocidade || '+12%';

function ffmpeg(a) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' }); }
function fimDaFala(arq) {
  const total = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString());
  const log = spawnSync('ffmpeg', ['-i', arq, '-af', 'silencedetect=n=-45dB:d=0.15', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const ult = ini.length ? ini[ini.length - 1] : null;
  return ult && total - ult < 1.5 ? ult : total;
}

// ---------- página que desenha um quadro no instante t ----------
const PAGINA = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:720px;height:1280px;overflow:hidden;background:#0A0A0F;font-family:Inter,'DejaVu Sans',sans-serif}
#fundo{position:absolute;inset:0}
#c{position:absolute;inset:0}
.pal{position:absolute;left:30px;right:30px;text-align:center;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.02;letter-spacing:-1px}
.pal span{display:inline-block;margin:0 10px}
.am{color:#FFD21F}.vd{color:#3DDC84}.vm{color:#FF4D4D}
.num{position:absolute;left:0;right:0;text-align:center;font-weight:900;color:#fff}
.sub{font-size:24px;letter-spacing:2px;color:#C9D2E3;font-weight:800}
.item{position:absolute;left:70px;right:40px;font-weight:900;color:#fff;font-size:44px;display:flex;align-items:center;gap:22px}
.bola{flex:none;width:64px;height:64px;border-radius:50%;background:#FFD21F;color:#111;font-size:38px;text-align:center;line-height:64px}
.carimbo{position:absolute;left:50%;border:7px solid #FF4D4D;color:#FF4D4D;font-weight:900;font-size:34px;padding:8px 20px;border-radius:12px;white-space:nowrap;background:rgba(10,10,15,.6)}
.botao{position:absolute;left:50%;background:#2DBE60;color:#fff;border-radius:999px;padding:20px 54px;font-weight:900;font-size:50px;white-space:nowrap;box-shadow:0 9px 0 #1E8A44;border:5px solid #fff}
.aviso{position:absolute;left:40px;right:40px;bottom:46px;text-align:center;color:#8C93A3;font-size:19px;font-weight:700}
.barra{position:absolute;left:0;top:0;height:8px;background:#FFD21F}
.tag{position:absolute;left:50%;top:70px;transform:translateX(-50%);background:#FFD21F;color:#111;font-weight:900;font-size:22px;letter-spacing:2px;padding:8px 18px;border-radius:8px;white-space:nowrap}
</style></head><body><div id="fundo"></div><div id="c"></div><script>
const lim=x=>Math.min(1,Math.max(0,x));
const salto=x=>{x=lim(x);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const suave=x=>{x=lim(x);return x*x*(3-2*x)};
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const cor=s=>esc(s).replace(/\\*([^*]+)\\*/g,'<span class="am" style="margin:0">$1</span>');
let D=null;
window.dados=d=>{D=d;
  for(const b of D.blocos){
    b.em=(txt,n=0)=>{if(typeof txt==='number')return txt;const a=norm(txt);const ach=b.palavras.filter(p=>norm(p.texto).startsWith(a));return ach[n]?ach[n].inicio:(ach.length?ach[0].inicio:0)};
    // grupos de até 3 palavras (quebra em pontuação ou pausa)
    b.grupos=[];for(const p of b.palavras){const g=b.grupos[b.grupos.length-1];
      const cabe=g&&g.p.length<(b.porTela||3)&&p.inicio-g.fim<0.3&&!/[.,!?:;]$/.test(g.p[g.p.length-1].texto);
      if(cabe){g.p.push(p);g.fim=p.fim}else b.grupos.push({p:[p],ini:p.inicio,fim:p.fim})}
  }};
function palavras(b,lt,topo,tam){
  const g=[...b.grupos].reverse().find(x=>x.ini<=lt);if(!g||lt>g.fim+0.5)return'';
  const dest=(b.destaque||[]).map(norm),verm=(b.vermelho||[]).map(norm),verde=(b.verde||[]).map(norm);
  const ws=g.p.filter(p=>p.inicio<=lt).map(p=>{const t=p.texto.replace(/[.,!?:;"]+$/,'').replace(/^"/,'');const n=norm(t);
    const c=dest.includes(n)?'am':verm.includes(n)?'vm':verde.includes(n)?'vd':'';
    const k=Math.max(0.01,salto((lt-p.inicio)/0.18));return '<span class="'+c+'" style="transform:scale('+k+')">'+esc(t)+'</span>'}).join(' ');
  return '<div class="pal" style="top:'+topo+'px;font-size:'+tam+'px">'+ws+'</div>'}
const pop=(lt,ini,d=0.3)=>Math.max(0.01,salto((lt-ini)/d));
function extra(b,e,lt){
  const ini=b.em(e.em??0)+(e.depois||0);if(lt<ini)return'';const k=pop(lt,ini),u=lt-ini;
  switch(e.tipo){
  case 'numero':{const alvo=e.ate;const v=Math.round(alvo*suave(u/0.9));const txt=(e.prefixo||'')+v.toLocaleString('pt-BR')+(e.sufixo||'');
    return '<div class="num" style="top:'+e.topo+'px;transform:scale('+k+')"><div style="font-size:'+(e.tam||130)+'px;line-height:1;color:'+(e.cor||'#fff')+'">'+esc(txt)+'</div><div class="sub">'+esc(e.sub)+'</div></div>'}
  case 'grande':return '<div class="num" style="top:'+e.topo+'px;transform:scale('+k+') rotate('+(e.giro||0)+'deg)"><div style="font-size:'+(e.tam||120)+'px;line-height:1.02;color:'+(e.cor||'#fff')+'">'+e.linhas.map(cor).join('<br>')+'</div>'+(e.sub?'<div class="sub" style="margin-top:10px">'+esc(e.sub)+'</div>':'')+'</div>';
  case 'item':return '<div class="item" style="top:'+e.topo+'px;opacity:'+lim(u/0.15)+';transform:translateX('+(-60*(1-suave(u/0.25)))+'px)"><div class="bola">'+esc(e.n)+'</div><div>'+cor(e.texto)+'</div></div>';
  case 'carimbo':return '<div class="carimbo" style="top:'+e.topo+'px;transform:translateX(-50%) rotate(-6deg) scale('+(1+1.5*(1-suave(u/0.18)))+');opacity:'+lim(u/0.08)+'">'+esc(e.texto)+'</div>';
  case 'botao':{const p=1+0.05*Math.sin(u*7);return '<div class="botao" style="top:'+e.topo+'px;transform:translateX(-50%) scale('+(k*p)+')">'+esc(e.texto)+'</div>'+(u>0.4?'<div style="position:absolute;left:50%;top:'+(e.topo+120+10*Math.sin(u*8))+'px;transform:translateX(-50%);font-size:64px;color:#FFD21F;font-weight:900">▲</div>':'')}
  case 'tag':return '<div class="tag" style="transform:translateX(-50%) scale('+k+')">'+esc(e.texto)+'</div>';
  case 'aviso':return '<div class="aviso" style="opacity:'+lim(u/0.3)+'">'+esc(e.texto)+'</div>';
  }return''}
window.quadro=t=>{
  let i=D.blocos.length-1;while(i>0&&t<D.blocos[i].inicio)i--;const b=D.blocos[i],lt=t-b.inicio;
  const brilho=b.brilho||'#FFD21F';const flash=i>0?Math.max(0,1-lt/0.12):0;
  const sh=(b.tremer&&lt<0.35)?(Math.sin(lt*90)*10*(1-lt/0.35)):0;
  document.getElementById('fundo').style.background='radial-gradient(circle at 50% '+(45+5*Math.sin(t*0.8))+'%, '+brilho+'33 0%, #0A0A0F 62%)';
  let h='';
  const comExtra=(b.extras||[]).some(e=>!['tag','aviso'].includes(e.tipo));
  if(!b.semPalavras)h+=palavras(b,lt,b.topoPalavras??(comExtra?880:520),b.tamPalavras||(comExtra?72:96));
  for(const e of b.extras||[])h+=extra(b,e,lt);
  h+='<div class="barra" style="width:'+(720*t/D.total)+'px"></div>';
  if(flash>0)h+='<div style="position:absolute;inset:0;background:#fff;opacity:'+(0.8*flash)+'"></div>';
  const c=document.getElementById('c');c.style.transform='translate('+sh+'px,0)';c.innerHTML=h};
window.PRONTO=true;
</script></body></html>`;

(async () => {
  // 1) narração (cache em saida/.voz)
  const blocos = criativo.blocos.map((b) => ({ ...b }));
  let acc = 0;
  for (const [i, b] of blocos.entries()) {
    const id = crypto.createHash('sha1').update(`${VOZ}|${VELOCIDADE}|${b.fala}`).digest('hex').slice(0, 12);
    const mp3 = path.join(pastaVoz, `${id}.mp3`), json = path.join(pastaVoz, `${id}.json`);
    if (!fs.existsSync(mp3) || !fs.existsSync(json)) {
      process.stdout.write(`voz: bloco ${i + 1}... `);
      execFileSync('python3', [path.join(raiz, 'estudio', 'voz.py'), b.fala, mp3, VOZ, VELOCIDADE, json], { stdio: 'inherit' });
      console.log('ok');
    }
    b.audio = mp3;
    b.palavras = JSON.parse(fs.readFileSync(json, 'utf8')).map((p) => ({ ...p, inicio: p.inicio + ATRASO, fim: p.fim + ATRASO }));
    b.dur = ATRASO + fimDaFala(mp3) + (b.pausa ?? PAUSA);
    b.inicio = acc;
    acc += b.dur;
  }
  const total = acc;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  page.on('pageerror', (e) => console.error('ERRO NA PÁGINA:', e.message));
  await page.setContent(PAGINA);
  await page.evaluate((d) => window.dados(d), { total, blocos: blocos.map(({ audio, sons, ...r }) => r) });
  const desenhar = (t) => page.evaluate((t) => window.quadro(t), t);

  if (previa) {
    for (const [i, b] of blocos.entries()) {
      await desenhar(b.inicio + b.dur * 0.8);
      const arq = path.join(pastaSaida, `${nome}-bloco${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: arq });
      console.log(arq);
    }
    await browser.close();
    return;
  }

  // 2) quadros -> vídeo
  const semAudio = path.join(pastaSaida, `.${nome}-sem-audio.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', semAudio], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fim = new Promise((ok, erro) => ff.on('close', (c) => (c === 0 ? ok() : erro(new Error(`ffmpeg ${c}`)))));
  const nQ = Math.round(total * FPS);
  for (let f = 0; f < nQ; f++) {
    await desenhar(f / FPS);
    const img = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 30 === 0) process.stdout.write(`\rquadros: ${f}/${nQ}   `);
  }
  ff.stdin.end();
  await fim;
  await browser.close();
  console.log(`\rquadros: ${nQ}/${nQ}   `);

  // 3) áudio: voz + efeitos (whoosh automático em cada troca de bloco)
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const momento = (b, em) => {
    if (typeof em === 'number') return em;
    const a = norm(em), p = b.palavras.find((x) => norm(x.texto).startsWith(a));
    return p ? p.inicio : 0;
  };
  const faixas = [];
  blocos.forEach((b, i) => {
    faixas.push([b.audio, b.inicio + ATRASO, 1.5]);
    if (i > 0) faixas.push([arquivoSom('whoosh', pastaVoz), Math.max(0, b.inicio - 0.12), 0.45]);
    for (const s of b.sons || []) if (SONS[s.tipo]) faixas.push([arquivoSom(s.tipo, pastaVoz), b.inicio + momento(b, s.em) + (s.depois || 0), s.vol ?? 0.6]);
  });
  const entradas = ['-i', semAudio];
  faixas.forEach(([a]) => entradas.push('-i', a));
  const filtro = faixas.map(([, ini, vol], i) => `[${i + 1}:a]aresample=44100,volume=${vol},adelay=${Math.round(ini * 1000)}:all=1[s${i}]`).join(';')
    + `;${faixas.map((_, i) => `[s${i}]`).join('')}amix=inputs=${faixas.length}:normalize=0,alimiter=limit=0.95,apad[a]`;
  const saida = path.join(pastaSaida, `${nome}.mp4`);
  ffmpeg([...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', saida]);
  fs.rmSync(semAudio);
  console.log(`Pronto: ${saida} (${total.toFixed(1)} s)`);
})().catch((e) => { console.error(e); process.exit(1); });
