#!/usr/bin/env node
// Coloca música de fundo original (estudio3d/musica.py) num vídeo já pronto.
// A música abaixa sozinha quando a narração fala (ducking) e sobe nas pausas.
//
// Uso: node estudio3d/musicar.js ponte tunel agua
//   Lê saida/.sem-musica/<video>.mp4 (versão só com voz e efeitos) e grava saida/<video>.mp4.
//   Se a versão sem música ainda não existir, o saida/<video>.mp4 atual vira essa versão.

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const pastaSaida = path.join(raiz, 'saida');
const pastaSem = path.join(pastaSaida, '.sem-musica');
fs.mkdirSync(pastaSem, { recursive: true });

const VOLUME_MUSICA = 0.17; // ~ -26 LUFS entre as falas; abaixa mais quando a voz entra

function semente(nome) {
  let h = 7;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) % 100003;
  return h;
}

function musicar(nome, { volume = VOLUME_MUSICA } = {}) {
  const final = path.join(pastaSaida, `${nome}.mp4`);
  const sem = path.join(pastaSem, `${nome}.mp4`);
  if (!fs.existsSync(sem)) {
    if (!fs.existsSync(final)) throw new Error(`não achei ${final}`);
    fs.renameSync(final, sem);
  }
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', sem]).toString());
  const wav = path.join(pastaSem, `${nome}-musica.wav`);
  const info = execFileSync('python3', [path.join(__dirname, 'musica.py'), wav, String(dur), String(semente(nome))]).toString().trim();
  const filtro =
    '[0:a]aformat=channel_layouts=stereo,asplit=2[voz][chave];' +
    `[1:a]volume=${volume}[mus];` +
    '[mus][chave]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=400[musd];' +
    '[voz][musd]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', sem, '-i', wav, '-filter_complex', filtro,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', final], { stdio: 'inherit' });
  fs.rmSync(wav);
  console.log(`${final}  (${info.split(': ')[1]})`);
}

module.exports = { musicar };

if (require.main === module) {
  const nomes = process.argv.slice(2);
  if (!nomes.length) {
    console.error('Uso: node estudio3d/musicar.js <video> [<video> ...]');
    process.exit(1);
  }
  nomes.forEach((n) => musicar(n));
}
