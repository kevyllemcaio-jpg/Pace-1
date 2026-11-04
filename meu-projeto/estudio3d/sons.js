// Efeitos sonoros sintetizados pelo ffmpeg (sem arquivos externos), usados pelo
// render3d.js (vídeos 3D) e pelo anuncio/texto.js (criativos só de texto).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

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
  whoosh: 'anoisesrc=d=0.4:c=pink:a=0.9,highpass=f=500,lowpass=f=3500,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.25,volume=1.6',
  pop: 'aevalsrc=0.6*sin(2*PI*(300+1600*t)*t)*exp(-22*t):d=0.22',
  plim: 'aevalsrc=0.45*sin(2*PI*1568*t)*exp(-14*t)+0.22*sin(2*PI*2349*t)*exp(-18*t):d=0.35',
  brilho: 'aevalsrc=0.28*sin(2*PI*(800+1800*t)*t)*exp(-3*t):d=0.7',
  motor: 'anoisesrc=d=2.2:c=brown:a=0.8,lowpass=f=220,tremolo=f=14:d=0.6,afade=t=in:d=0.6,afade=t=out:st=1.6:d=0.6,volume=1.4',
  passagem: 'anoisesrc=d=0.9:c=pink:a=0.9,bandpass=f=1200:w=900,afade=t=in:d=0.1,afade=t=out:st=0.4:d=0.5,volume=1.8',
  vidro: 'anoisesrc=d=0.6:c=white:a=0.9,highpass=f=3000,afade=t=out:st=0.05:d=0.55,volume=1.3',
  replay: 'aevalsrc=0.3*sin(2*PI*(1600-1100*t)*t)*(0.6+0.4*sin(2*PI*16*t)):d=1.1,afade=t=out:st=0.8:d=0.3',
  asas: 'anoisesrc=d=0.8:c=white:a=0.6,bandpass=f=2500:w=2000,tremolo=f=12:d=1,afade=t=out:st=0.5:d=0.3,volume=1.2',
  uivo: 'aevalsrc=0.35*sin(2*PI*(280+240*t)*t)*(0.75+0.25*sin(2*PI*5*t))*exp(-0.7*t):d=1.8,afade=t=in:d=0.2,afade=t=out:st=1.3:d=0.5',
  // --- formato "N dias de..." (medidos no vídeo de referência "7 dias no escuro") ---
  // impacto: boom cinematográfico grave, cai de ~86 Hz para ~43 Hz em ~1,3 s (abertura, apagão, luz voltando)
  impacto: 'aevalsrc=0.9*sin(2*PI*(86*t-16*t*t))*exp(-2.6*t)+0.25*sin(2*PI*(172*t-32*t*t))*exp(-6*t):d=1.4,afade=t=in:d=0.01,lowpass=f=400',
  // dia: batida curta e seca a cada "DIA N" (~120 Hz -> 86 Hz, ~0,45 s)
  dia: 'aevalsrc=0.85*sin(2*PI*(120*t-40*t*t))*exp(-7*t):d=0.5,afade=t=in:d=0.005',
  // tique: tique-taque de relógio
  tique: 'aevalsrc=0.5*sin(2*PI*2600*t)*exp(-90*t)+0.3*sin(2*PI*1300*t)*exp(-60*t):d=0.08',
  // porta: rangido de porta abrindo
  porta: 'aevalsrc=0.35*sin(2*PI*(220*t+40*sin(2*PI*1.3*t)))*(0.5+0.5*sin(2*PI*31*t)):d=0.9,highpass=f=150,afade=t=in:d=0.1,afade=t=out:st=0.6:d=0.3',
  // ofuscar: subida aguda e clara quando a luz volta / clarão
  ofuscar: 'anoisesrc=d=1.2:c=white:a=0.5,highpass=f=2500,afade=t=in:d=0.9,afade=t=out:st=0.9:d=0.3,volume=1.2',
  // tensao: zumbido grave contínuo de suspense (cama sonora do escuro, ~4 s)
  tensao: 'aevalsrc=0.3*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.5*t))+0.12*sin(2*PI*82.5*t):d=4,afade=t=in:d=1,afade=t=out:st=2.8:d=1.2',
  // moeda: "plim-plim" de dinheiro (duas notas agudas)
  moeda: 'aevalsrc=0.45*sin(2*PI*1975*t)*exp(-10*t)+0.4*sin(2*PI*2637*t)*exp(-7*(t-0.08))*gt(t\\,0.08):d=0.7',
  fogo: 'anoisesrc=d=2.5:c=brown:a=0.9,lowpass=f=300,afade=t=in:d=0.3,afade=t=out:st=1.5:d=1.0,volume=2.2',
};

/** Gera (uma vez) o WAV do efeito em `pasta` e devolve o caminho. */
function arquivoSom(tipo, pasta) {
  const arq = path.join(pasta, `som-${tipo}.wav`);
  if (!fs.existsSync(arq)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', SONS[tipo], '-ar', '44100', '-ac', '1', arq], { stdio: 'inherit' });
  return arq;
}

module.exports = { SONS, arquivoSom: arquivoSom };
