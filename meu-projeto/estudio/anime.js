// anime.js — visual anime original (série "NÍVEL ZERO"): rostos com olhos grandes e brilho,
// cabelo em mechas, uniforme, linhas de velocidade, flash de impacto, cristal, monstro de sombra, chuva.
// Personagens originais.

const AT = '#1A1626'; // traço

function gradIris(id, cor) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14101E"/><stop offset="0.45" stop-color="${cor}"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.9"/></linearGradient>`;
}

// ---------- rosto (centro 0,0) ----------
function animeOlho(x, y, lado, o, idIris) {
  const e = o.expr || 'neutro';
  const fechado = e === 'sorriso' || ((o.t + (o.semente || 1) * 0.6) % 3.4) < 0.1;
  let s = '';
  if (fechado) return `<path d="M ${x - 40} ${y + 4} Q ${x} ${y - 26} ${x + 40} ${y + 4}" fill="none" stroke="${AT}" stroke-width="9" stroke-linecap="round"/>`;
  const ry = e === 'determinado' ? 34 : e === 'raiva' ? 30 : 48;
  const topo = y - ry;
  // branco
  s += `<path d="M ${x - 42} ${y} Q ${x - 40} ${topo} ${x} ${topo - 2} Q ${x + 40} ${topo} ${x + 42} ${y} Q ${x + 38} ${y + ry} ${x} ${y + ry + 2} Q ${x - 38} ${y + ry} ${x - 42} ${y} Z" fill="#fff"/>`;
  // íris + pupila
  const [gx, gy] = o.olhar || [0, 0];
  const ix = x + gx * 8, iy = y + 4 + gy * 6;
  const irisR = e === 'surpreso' ? 20 : 29;
  s += `<ellipse cx="${ix}" cy="${iy}" rx="${irisR}" ry="${Math.min(ry, irisR * 1.45)}" fill="url(#${idIris})"/>`;
  s += `<ellipse cx="${ix}" cy="${iy + 2}" rx="${irisR * 0.42}" ry="${irisR * 0.62}" fill="#0D0A14"/>`;
  if (o.brilho) s += `<ellipse cx="${ix}" cy="${iy}" rx="${irisR + 16}" ry="${irisR * 1.5 + 16}" fill="${o.brilho}" opacity="${0.45 + 0.25 * Math.sin(o.t * 8)}" filter="url(#animeGlow)"/>`;
  s += `<ellipse cx="${ix - 10}" cy="${iy - 16}" rx="11" ry="14" fill="#fff"/><circle cx="${ix + 12}" cy="${iy + 16}" r="5" fill="#fff"/>`;
  // cílio superior grosso + ponta
  s += `<path d="M ${x - 46} ${y + 4} Q ${x - 42} ${topo - 6} ${x} ${topo - 8} Q ${x + 42} ${topo - 6} ${x + 50} ${y - 6}" fill="none" stroke="${AT}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<path d="M ${x + lado * 44} ${topo + 4} l ${lado * 18} -10" stroke="${AT}" stroke-width="8" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 26} ${y + ry + 4} Q ${x} ${y + ry + 8} ${x + 26} ${y + ry + 4}" fill="none" stroke="${AT}" stroke-width="4" opacity="0.6"/>`;
  if (e === 'triste' || o.lagrima) {
    const k = (o.t * 0.7) % 1;
    s += `<path d="M ${x + 20} ${y + ry + 10 + k * 120} q -10 18 0 28 q 10 -10 0 -28 Z" fill="#9FD8F5" stroke="${AT}" stroke-width="3" opacity="${1 - k}"/>`;
  }
  return s;
}

function animeCabelo(cab, frente) {
  const cor = cab.cor, luz = cab.luz || '#FFFFFF';
  const C = `fill="${cor}" stroke="${AT}" stroke-width="7" stroke-linejoin="round"`;
  if (!frente) {
    if (cab.tipo === 'longo') return `<path d="M -170 -120 Q -200 120 -180 420 L 180 420 Q 200 120 170 -120 Z" ${C}/>`;
    return `<path d="M -175 -60 Q -200 -250 0 -280 Q 200 -250 175 -60 Q 190 40 160 90 L -160 90 Q -190 40 -175 -60 Z" ${C}/>`;
  }
  let s = '';
  if (cab.tipo === 'espetado') {
    // mechas espetadas por cima e franja em pontas
    s += `<path d="M -175 -90 L -230 -210 L -150 -190 L -170 -300 L -80 -240 L -50 -350 L 10 -260 L 80 -340 L 90 -240 L 190 -290 L 150 -190 L 230 -180 L 170 -90 Q 120 -170 0 -175 Q -120 -170 -175 -90 Z" ${C}/>`;
    s += `<path d="M -165 -110 L -158 -20 L -120 -110 L -96 -78 L -70 -130 L -36 -86 L -6 -140 L 26 -88 L 58 -132 L 92 -82 L 118 -120 L 156 -30 L 166 -110 Q 100 -200 0 -202 Q -100 -200 -165 -110 Z" ${C}/>`;
  } else {
    s += `<path d="M -172 -80 Q -175 -260 0 -270 Q 175 -260 172 -80 L 156 60 L 132 -90 L 100 -84 L 72 -128 L 36 -90 L 4 -138 L -30 -92 L -66 -130 L -100 -86 L -132 -92 L -156 60 Z" ${C}/>`;
    s += `<path d="M -172 -80 Q -200 200 -170 300 L -130 300 Q -150 120 -140 -40 Z M 172 -80 Q 200 200 170 300 L 130 300 Q 150 120 140 -40 Z" ${C}/>`;
  }
  // reflexo (faixa de brilho)
  s += `<path d="M -110 -200 Q 0 -232 110 -200" fill="none" stroke="${luz}" stroke-width="14" stroke-linecap="round" opacity="0.35"/>`;
  return s;
}

function animeRosto(o) {
  const t = o.t || 0, pele = o.pele || '#FBE3D2', sombra = o.sombra || '#F0C4AE';
  const idIris = 'iris' + (o.id || 'a');
  const e = o.expr || 'neutro';
  let s = `<defs>${gradIris(idIris, o.olhos || '#3A7BD5')}<filter id="animeGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
  s += animeCabelo(o.cabelo, false);
  s += `<path d="M -48 150 L -46 290 L 46 290 L 48 150 Z" fill="${pele}" stroke="${AT}" stroke-width="7"/><path d="M -48 190 Q 0 230 48 190 L 48 160 L -48 160 Z" fill="${sombra}"/>`;
  for (const l of [-1, 1]) s += `<path d="M ${l * 148} -30 Q ${l * 186} -40 ${l * 180} 10 Q ${l * 172} 50 ${l * 146} 50 Z" fill="${pele}" stroke="${AT}" stroke-width="6"/>`;
  s += `<path d="M -150 -70 Q -152 -235 0 -240 Q 152 -235 150 -70 Q 150 50 104 128 Q 46 206 0 218 Q -46 206 -104 128 Q -150 50 -150 -70 Z" fill="${pele}" stroke="${AT}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<path d="M -150 -70 Q -120 -60 -100 -130 Q -60 -160 0 -160 Q 60 -160 100 -130 Q 120 -60 150 -70 L 150 -110 Q 0 -180 -150 -110 Z" fill="${sombra}" opacity="0.7"/>`;
  // sobrancelhas
  const sb = { neutro: [0, 0], determinado: [16, -8], raiva: [22, -12], triste: [-16, 10], surpreso: [-20, -16], grito: [20, -10], sorriso: [-8, -6] }[e] || [0, 0];
  for (const l of [-1, 1]) s += `<path d="M ${l * 28} ${-82 + sb[0]} Q ${l * 70} ${-100 + (sb[0] + sb[1]) / 2} ${l * 112} ${-92 + sb[1]}" fill="none" stroke="${AT}" stroke-width="8" stroke-linecap="round"/>`;
  s += animeOlho(-66, -20, -1, { ...o, t }, idIris) + animeOlho(66, -20, 1, { ...o, t }, idIris);
  // nariz e boca
  s += `<path d="M 4 50 L -6 66" stroke="${AT}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
  const fala = o.fala && Math.sin(t * 16) > 0;
  if (e === 'grito' || fala) s += `<path d="M -36 118 Q 0 ${fala ? 132 : 180} 36 118 Q 0 110 -36 118 Z" fill="#7A2030" stroke="${AT}" stroke-width="6" stroke-linejoin="round"/>`;
  else if (e === 'sorriso') s += `<path d="M -30 114 Q 0 140 30 114" fill="none" stroke="${AT}" stroke-width="6" stroke-linecap="round"/>`;
  else if (e === 'triste') s += `<path d="M -24 126 Q 0 112 24 126" fill="none" stroke="${AT}" stroke-width="6" stroke-linecap="round"/>`;
  else if (e === 'surpreso') s += `<ellipse cx="0" cy="124" rx="12" ry="16" fill="#7A2030" stroke="${AT}" stroke-width="5"/>`;
  else s += `<path d="M -22 120 L 22 118" stroke="${AT}" stroke-width="6" stroke-linecap="round"/>`;
  if (o.corar) for (const l of [-1, 1]) for (let i = 0; i < 3; i++) s += `<path d="M ${l * 92 - 18 + i * 12} 56 l -8 16" stroke="#E86A7A" stroke-width="5" stroke-linecap="round"/>`;
  s += animeCabelo(o.cabelo, true);
  if (o.cicatriz) s += `<path d="M 70 -150 L 110 -60 M 80 -120 l 18 -6 M 92 -94 l 18 -6" stroke="#C0505A" stroke-width="6" stroke-linecap="round"/>`;
  return s;
}

// Busto (rosto + ombros com uniforme). Centro do rosto em (x, y).
function animeBusto(o) {
  const esc = o.esc || 1.3;
  const bob = Math.sin((o.t || 0) * 2) * 5;
  const farda = o.farda || '#1E2A4A';
  const ombros = `<path d="M -360 1000 L -340 520 Q -330 380 -120 300 L 120 300 Q 330 380 340 520 L 360 1000 Z" fill="${farda}" stroke="${AT}" stroke-width="8"/>` +
    `<path d="M -70 292 L 0 420 L 70 292 Z" fill="#F4F4F8" stroke="${AT}" stroke-width="6"/><path d="M -14 330 L 14 330 L 22 460 L 0 490 L -22 460 Z" fill="${o.gravata || '#C8283C'}" stroke="${AT}" stroke-width="5"/>` +
    `<path d="M -120 300 L -40 470 M 120 300 L 40 470" stroke="${AT}" stroke-width="6"/>`;
  return `<g transform="translate(${o.x || 540} ${(o.y || 820) + bob}) scale(${esc})">${ombros}${animeRosto(o)}</g>`;
}
// Faixa só com os olhos (plano detalhe dramático).
function animeOlhos(o, y = 960, altura = 420) {
  return `<defs><clipPath id="faixaOlhos"><rect x="0" y="${y - altura / 2}" width="1080" height="${altura}"/></clipPath></defs>` +
    `<rect x="0" y="${y - altura / 2}" width="1080" height="${altura}" fill="#000"/>` +
    `<g clip-path="url(#faixaOlhos)"><g transform="translate(540 ${y + 60}) scale(3.1)">${animeRosto(o)}</g></g>` +
    `<rect x="0" y="${y - altura / 2 - 8}" width="1080" height="8" fill="#000"/><rect x="0" y="${y + altura / 2}" width="1080" height="8" fill="#000"/>`;
}
// Número de nível em cima da cabeça.
function nivel(x, y, txt, cor = '#7FE8FF', lt = 0, glitch = false) {
  const dx = glitch ? (Math.sin(lt * 70) * 10) : 0;
  return `<g transform="translate(${x + dx} ${y})"><text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="${cor}" opacity="0.5" filter="url(#animeGlow)">${txt}</text>` +
    `<text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#fff" stroke="${cor}" stroke-width="8" paint-order="stroke">${txt}</text>` +
    (glitch ? `<text x="${8}" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#FF3060" opacity="0.5">${txt}</text>` : '') + `</g>`;
}

// ---------- fundos e efeitos ----------
function linhasVelocidade(t, { cx = 540, cy = 900, cor = '#FFFFFF', fundo = '#101020', n = 70 } = {}) {
  let s = `<rect width="1080" height="1920" fill="${fundo}"/>`;
  const r = aleatorio(Math.floor(t * 12) + 1);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, w = 0.004 + r() * 0.012, r0 = 260 + r() * 260;
    const p = (ang, rr) => `${(cx + Math.cos(ang) * rr).toFixed(0)},${(cy + Math.sin(ang) * rr).toFixed(0)}`;
    s += `<polygon points="${p(a - w, 2000)} ${p(a + w, 2000)} ${p(a, r0)}" fill="${cor}" opacity="${0.35 + r() * 0.5}"/>`;
  }
  return s;
}
function ceuAnime(t, { topo = '#2B1B5E', meio = '#D2557A', base = '#FFB36B' } = {}) {
  let s = `<defs><linearGradient id="ceuA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${topo}"/><stop offset="0.55" stop-color="${meio}"/><stop offset="1" stop-color="${base}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#ceuA)"/>`;
  s += `<circle cx="760" cy="980" r="190" fill="#FFE6B0" opacity="0.85"/>`;
  const r = aleatorio(31);
  for (let i = 0; i < 40; i++) s += `<circle cx="${r() * 1080}" cy="${r() * 700}" r="${1 + r() * 2.5}" fill="#fff" opacity="${0.4 + 0.5 * Math.sin(t * 2 + i)}"/>`;
  // silhueta da cidade com torres
  let x = -20;
  const rr = aleatorio(44);
  let cidade = '';
  while (x < 1100) { const w = 50 + rr() * 90, h = 300 + rr() * 650; cidade += `<rect x="${x}" y="${1500 - h}" width="${w}" height="${h + 500}" fill="#1A1430"/>`; for (let j = 0; j < 6; j++) if (rr() > 0.5) cidade += `<rect x="${x + 10 + rr() * (w - 20)}" y="${1500 - h + 30 + rr() * (h - 60)}" width="8" height="12" fill="#FFD27A" opacity="0.8"/>`; x += w + 6; }
  s += cidade + `<rect x="500" y="300" width="18" height="1300" fill="#1A1430"/><circle cx="509" cy="290" r="26" fill="#7FE8FF" filter="url(#animeGlow)"/>`;
  return s;
}
function noiteChuva(t) {
  let s = `<rect width="1080" height="1920" fill="#0E1224"/>`;
  let x = -20; const rr = aleatorio(52);
  while (x < 1100) { const w = 60 + rr() * 100, h = 500 + rr() * 900; s += `<rect x="${x}" y="${1700 - h}" width="${w}" height="${h + 300}" fill="#161B33"/>`; x += w + 8; }
  s += `<rect y="1600" width="1080" height="320" fill="#0A0D1A"/>`;
  const r = aleatorio(9);
  for (let i = 0; i < 90; i++) { const x0 = r() * 1200, v = 1600 + r() * 600, y0 = ((r() * 2000 + t * v) % 2100) - 100; s += `<line x1="${x0}" y1="${y0}" x2="${x0 - 14}" y2="${y0 + 60}" stroke="#9FB8E8" stroke-width="3" opacity="0.5"/>`; }
  return s;
}
function cristal(x, y, esc = 1, { estado = 'vivo', t = 0 } = {}) {
  const cor = estado === 'cinza' ? '#8A8A96' : '#7FE8FF';
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  if (estado !== 'cinza') s += `<ellipse cx="0" cy="0" rx="260" ry="360" fill="${cor}" opacity="${0.25 + 0.1 * Math.sin(t * 4)}" filter="url(#animeGlow)"/>`;
  s += `<path d="M 0 -320 L 150 -100 L 110 260 L 0 330 L -110 260 L -150 -100 Z" fill="${estado === 'cinza' ? '#6A6A76' : '#4FC8F0'}" stroke="${AT}" stroke-width="9" stroke-linejoin="round"/>`;
  s += `<path d="M 0 -320 L 30 -80 L 0 330 M 30 -80 L 150 -100 M 30 -80 L 110 260" fill="none" stroke="#fff" stroke-width="5" opacity="0.5"/>`;
  if (estado === 'cinza') s += `<path d="M -40 -200 L 10 -90 L -30 0 L 40 120 L 0 220" fill="none" stroke="${AT}" stroke-width="8"/>`;
  return s + `</g>`;
}
function monstro(x, y, esc = 1, t = 0) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + t; s += `<circle cx="${Math.cos(a) * 160}" cy="${-200 + Math.sin(a) * 60}" r="${70 + 20 * Math.sin(t * 3 + i)}" fill="#05030A" opacity="0.5"/>`; }
  s += `<path d="M -220 300 L -200 -80 Q -200 -380 0 -420 Q 200 -380 200 -80 L 220 300 L 150 220 L 100 300 L 40 230 L -20 300 L -80 220 L -140 300 Z" fill="#05030A"/>`;
  s += `<path d="M -150 -100 L -60 -60 L -150 -40 Z M 150 -100 L 60 -60 L 150 -40 Z" fill="#FF2040"/><path d="M -150 -100 L -60 -60 L -150 -40 Z M 150 -100 L 60 -60 L 150 -40 Z" fill="#FF2040" filter="url(#animeGlow)"/>`;
  s += `<path d="M -90 60 L -60 30 L -30 60 L 0 30 L 30 60 L 60 30 L 90 60" fill="none" stroke="#FF2040" stroke-width="8"/>`;
  return s + `</g>`;
}
function flashBranco(lt, t0, dur = 0.35, cor = '#FFFFFF') {
  if (lt < t0 || lt > t0 + dur) return '';
  return `<rect width="1080" height="1920" fill="${cor}" opacity="${(1 - (lt - t0) / dur).toFixed(2)}"/>`;
}
function textoImpacto(txt, lt, t0, { y = 600, cor = '#FFFFFF', tam = 170, rot = -6 } = {}) {
  if (lt < t0) return '';
  const k = 1 + 0.8 * (1 - suave((lt - t0) / 0.18));
  return `<g transform="translate(540 ${y}) rotate(${rot}) scale(${k})"><text x="8" y="12" text-anchor="middle" font-family="Anton, sans-serif" font-size="${tam}" fill="#000" opacity="0.5">${esc(txt)}</text>` +
    `<text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="${tam}" fill="${cor}" stroke="#000" stroke-width="12" paint-order="stroke">${esc(txt)}</text></g>`;
}
