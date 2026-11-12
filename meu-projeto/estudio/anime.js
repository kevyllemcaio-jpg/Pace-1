// anime.js — visual anime original (série "NÍVEL ZERO").
// Rosto com cel shading, olhos em camadas, cabelo em mechas com anel de brilho, uniforme com volume,
// cenários pintados (céu com nuvens, cidade em camadas com névoa, chuva com reflexo, salão do Cristal),
// linhas de velocidade, flash e textos de impacto. Personagens originais.

const AT = '#1B1424'; // traço
const P2 = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;

function animeDefs() {
  return `<defs>
    <filter id="animeGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="animeSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="animeBlur4"><feGaussianBlur stdDeviation="4"/></filter>
    <radialGradient id="blush" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FF7F96" stop-opacity="0.55"/><stop offset="1" stop-color="#FF7F96" stop-opacity="0"/></radialGradient>
  </defs>`;
}
// Mecha de cabelo: base (bx, by) com meia-largura w até a ponta (tx, ty); curva = desvio lateral.
function mecha(bx, by, tx, ty, w, curva = 0) {
  const mx = (bx + tx) / 2 + curva, my = (by + ty) / 2;
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `M ${P2(bx + nx * w, by + ny * w)} Q ${P2(mx + nx * w * 0.9, my + ny * w * 0.9)} ${P2(tx, ty)} Q ${P2(mx - nx * w * 0.9, my - ny * w * 0.9)} ${P2(bx - nx * w, by - ny * w)} Z`;
}

// ---------- olho (na origem) ----------
function animeOlho(o, lado, idIris) {
  const e = o.expr || 'neutro';
  const t = o.t || 0;
  const piscar = ((t + (o.semente || 1) * 0.61) % 3.6) < 0.1;
  if (e === 'sorriso' || piscar) {
    return `<path d="M -46 6 Q 0 -30 46 2" fill="none" stroke="${AT}" stroke-width="10" stroke-linecap="round"/><path d="M 40 -2 l 14 -10" stroke="${AT}" stroke-width="7" stroke-linecap="round"/>`;
  }
  const ab = { determinado: 0.72, raiva: 0.6, triste: 0.9, surpreso: 1.1, grito: 0.85 }[e] || 1;
  const top = -44 * ab, bot = 34;
  const branco = `M -48 4 C -44 ${top}, 30 ${top - 4}, 46 -8 C 40 ${bot * 0.8}, -28 ${bot}, -48 4 Z`;
  const idc = `olhoClip${o.id || 'a'}${lado}`;
  const [gx, gy] = o.olhar || [0, 0];
  const ix = -2 + gx * 9 * lado, iy = 2 + gy * 6;
  const ir = e === 'surpreso' ? 21 : 27;
  let s = `<defs><clipPath id="${idc}"><path d="${branco}"/></clipPath></defs>`;
  s += `<path d="${branco}" fill="#FFFFFF"/><g clip-path="url(#${idc})">`;
  s += `<ellipse cx="${ix}" cy="${iy}" rx="${ir}" ry="${ir * 1.32}" fill="url(#${idIris})"/>`;
  s += `<ellipse cx="${ix}" cy="${iy}" rx="${ir}" ry="${ir * 1.32}" fill="none" stroke="#120C1C" stroke-width="3.5"/>`;
  s += `<ellipse cx="${ix}" cy="${iy + 4}" rx="${ir * 0.66}" ry="${ir * 0.9}" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity="0.35"/>`;
  for (let k = 0; k < 6; k++) { const a = Math.PI * (0.15 + k * 0.14); s += `<line x1="${ix + Math.cos(a) * ir * 0.35}" y1="${iy + Math.sin(a) * ir * 0.5}" x2="${ix + Math.cos(a) * ir * 0.9}" y2="${iy + Math.sin(a) * ir * 1.2}" stroke="#FFFFFF" stroke-width="1.4" opacity="0.3"/>`; }
  s += `<ellipse cx="${ix}" cy="${iy + 3}" rx="${ir * 0.38}" ry="${ir * 0.55}" fill="#0B0712"/>`;
  s += `<path d="M -60 ${top - 10} L 60 ${top - 10} L 60 ${top + 18} Q 0 ${top + 30} -60 ${top + 18} Z" fill="#2A1A3A" opacity="0.38"/>`;
  if (o.brilho) s += `<ellipse cx="${ix}" cy="${iy}" rx="${ir + 14}" ry="${ir * 1.4 + 14}" fill="${o.brilho}" opacity="${0.4 + 0.25 * Math.sin(t * 8)}" filter="url(#animeGlow)"/>`;
  s += `<ellipse cx="${ix - 10}" cy="${iy - 13}" rx="10" ry="12" fill="#FFFFFF"/><circle cx="${ix + 11}" cy="${iy + 14}" r="4.5" fill="#FFFFFF"/><circle cx="${ix + 3}" cy="${iy - 20}" r="2.5" fill="#FFFFFF" opacity="0.9"/>`;
  s += `</g>`;
  s += `<path d="M -52 8 C -46 ${top - 6}, 30 ${top - 12}, 50 -10 L 64 -26 L 52 -2 C 34 ${top + 2}, -36 ${top + 4}, -44 10 Z" fill="${AT}"/>`;
  s += `<path d="M 50 -12 l 18 -6 M 46 -20 l 14 -14" stroke="${AT}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<path d="M -36 ${top - 18} Q 6 ${top - 30} 40 ${top - 14}" fill="none" stroke="${AT}" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>`;
  s += `<path d="M -30 ${bot * 0.95} Q 6 ${bot + 6} 34 ${bot * 0.72}" fill="none" stroke="${AT}" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>`;
  if (e === 'triste' || o.lagrima) {
    const k = (t * 0.6) % 1;
    s += `<path d="M -40 14 Q -20 ${bot + 10} 30 ${bot}" fill="none" stroke="#BFE6FF" stroke-width="5" opacity="0.8"/>`;
    s += `<path d="M 10 ${bot + 12 + k * 130} q -11 20 0 30 q 11 -10 0 -30 Z" fill="#BFE6FF" stroke="#4A6A9A" stroke-width="2.5" opacity="${1 - k}"/>`;
  }
  return s;
}

// ---------- cabelo ----------
function animeCabeloTras(cab, t) {
  const C = `fill="${cab.cor}" stroke="${AT}" stroke-width="7" stroke-linejoin="round"`;
  const sway = Math.sin(t * 1.6) * 6;
  if (cab.tipo === 'longo') {
    let s = `<path d="M -175 -90 C -230 120, -200 300, -230 520 L 230 520 C 200 300, 230 120, 175 -90 Z" ${C}/>`;
    for (let i = 0; i < 7; i++) { const x = -200 + i * 66; s += `<path d="${mecha(x, 330, x + sway + (i % 2 ? 10 : -10), 560, 30, 6)}" ${C}/>`; }
    s += `<path d="M -175 -90 C -230 120, -200 300, -230 520 L -150 520 C -140 300, -150 100, -120 -60 Z" fill="${cab.sombra}" opacity="0.6"/>`;
    return s;
  }
  const pts = [[-180, -40], [-250, -150], [-185, -170], [-235, -290], [-120, -250], [-110, -370], [-30, -290], [40, -390], [80, -290], [190, -350], [150, -230], [260, -210], [180, -120], [230, -20], [170, -10]];
  let d = `M ${P2(-170, 40)} `;
  pts.forEach(([x, y]) => (d += `L ${P2(x + (y < -200 ? sway * 0.6 : 0), y)} `));
  d += `L 170 40 Z`;
  return `<path d="${d}" ${C}/><path d="M 170 40 L 230 -20 L 180 -120 L 260 -210 L 150 -230 L 140 -140 L 120 0 Z" fill="${cab.sombra}" opacity="0.7"/>`;
}
function animeCabeloFrente(cab, t) {
  const C = (cor) => `fill="${cor}" stroke="${AT}" stroke-width="6" stroke-linejoin="round"`;
  const sway = Math.sin(t * 1.6 + 1) * 4;
  let s = `<path d="M -172 -60 C -182 -330, 182 -330, 172 -60 C 130 -170, -130 -170, -172 -60 Z" ${C(cab.cor)}/>`;
  const mechas = cab.tipo === 'longo'
    ? [[-150, -190, -170, 60, 34, -8], [-112, -222, -126, -86, 36, 6], [-66, -238, -78, -102, 38, -6], [-20, -244, -18, -110, 38, 6], [26, -244, 34, -108, 38, -6], [72, -238, 86, -100, 38, 6], [116, -222, 130, -84, 36, -6], [152, -190, 172, 60, 34, 8]]
    : [[-152, -180, -184, -40, 40, -14], [-110, -226, -140, -84, 40, -10], [-62, -248, -96, -104, 40, -8], [-14, -256, -28, -100, 40, 6], [34, -254, 40, -112, 40, 8], [80, -244, 104, -98, 40, 10], [122, -222, 152, -82, 40, 12], [156, -180, 190, -40, 40, 14]];
  mechas.forEach(([bx, by, tx, ty, w, cv], i) => {
    const cor = i % 3 === 2 ? cab.sombra : cab.cor;
    s += `<path d="${mecha(bx, by, tx + sway * (i % 2 ? 1 : -1), ty, w, cv)}" ${C(cor)}/>`;
  });
  // anel de brilho: 3 faixas largas e curvas
  [[-118, -196, -60, -224], [-34, -232, 34, -234], [62, -224, 116, -198]].forEach(([x0, y0, x1, y1]) => {
    s += `<path d="M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 14} ${x1} ${y1}" fill="none" stroke="${cab.luz}" stroke-width="12" stroke-linecap="round" opacity="0.55"/>`;
  });
  return s;
}

// ---------- rosto ----------
function animeRosto(o, { semTras = false } = {}) {
  const t = o.t || 0;
  const pele = o.pele || '#FCE6D8', sombra = o.sombraPele || '#EDB9A4';
  const e = o.expr || 'neutro';
  const id = o.id || 'a';
  const cab = { sombra: '#0B0E1E', luz: '#7FA0FF', ...o.cabelo };
  const idIris = `iris${id}`;
  let s = animeDefs() + `<defs><linearGradient id="${idIris}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E0A18"/><stop offset="0.35" stop-color="${o.olhos || '#3A7BD5'}"/><stop offset="0.85" stop-color="${o.olhos2 || '#9FD8FF'}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>` +
    `<linearGradient id="pele${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pele}"/><stop offset="1" stop-color="${o.pele2 || '#F7D2BE'}"/></linearGradient></defs>`;
  if (!semTras) s += animeCabeloTras(cab, t);
  s += `<path d="M -50 140 L -48 300 L 48 300 L 50 140 Z" fill="${pele}" stroke="${AT}" stroke-width="7"/><path d="M -50 150 L 50 150 L 50 200 Q 0 250 -50 200 Z" fill="${sombra}"/>`;
  for (const l of [-1, 1]) s += `<path d="M ${l * 140} -40 C ${l * 186} -60, ${l * 192} 20, ${l * 140} 44 Z" fill="${pele}" stroke="${AT}" stroke-width="6"/><path d="M ${l * 150} -24 Q ${l * 170} -10 ${l * 152} 20" fill="none" stroke="${sombra}" stroke-width="6"/>`;
  const contorno = `M -142 -60 C -146 -190 -80 -238 0 -238 C 80 -238 146 -190 142 -60 C 140 12 128 70 98 118 C 68 166 30 202 0 214 C -30 202 -68 166 -98 118 C -128 70 -140 12 -142 -60 Z`;
  s += `<path d="${contorno}" fill="url(#pele${id})"/>`;
  s += `<path d="M -142 -70 C -120 -40 -96 -86 -70 -54 C -50 -80 -30 -46 -6 -66 C 18 -44 40 -76 64 -52 C 90 -80 112 -44 142 -70 L 142 -120 L -142 -120 Z" fill="${sombra}" opacity="0.85"/>`;
  s += `<path d="M 142 -60 C 140 12 128 70 98 118 C 68 166 30 202 0 214 C 30 190 70 150 92 100 C 116 50 124 0 126 -60 Z" fill="${sombra}" opacity="0.7"/>`;
  s += `<path d="${contorno}" fill="none" stroke="${AT}" stroke-width="8" stroke-linejoin="round"/>`;
  if (o.rim) s += `<path d="M -140 -80 C -140 12 -128 70 -98 118 C -68 166 -30 202 0 214" fill="none" stroke="${o.rim}" stroke-width="8" opacity="0.9"/>`;
  for (const l of [-1, 1]) s += `<ellipse cx="${l * 86}" cy="58" rx="44" ry="22" fill="url(#blush)" opacity="${o.corar ? 1 : 0.55}"/>`;
  if (o.corar) for (const l of [-1, 1]) for (let i = 0; i < 3; i++) s += `<path d="M ${l * 86 - 20 + i * 14} 50 l -8 16" stroke="#E2637A" stroke-width="4" stroke-linecap="round"/>`;
  const sb = { neutro: [0, 0], determinado: [14, -6], raiva: [22, -12], triste: [-18, 8], surpreso: [-18, -14], grito: [20, -10], sorriso: [-8, -4] }[e] || [0, 0];
  const corSb = cab.sobrancelha || AT;
  for (const l of [-1, 1]) s += `<path d="M ${l * 24} ${-104 + sb[0]} Q ${l * 72} ${-126 + (sb[0] + sb[1]) / 2} ${l * 124} ${-110 + sb[1]} Q ${l * 72} ${-118 + (sb[0] + sb[1]) / 2} ${l * 24} ${-98 + sb[0]} Z" fill="${corSb}"/>`;
  for (const l of [-1, 1]) s += `<g transform="translate(${l * 74} -16) scale(${l * 1.12} 1.2)">${animeOlho(o, l, idIris)}</g>`;
  s += `<path d="M 6 40 L -8 66 L 6 66 Z" fill="${sombra}"/><path d="M -6 66 L 6 66" stroke="${AT}" stroke-width="3" opacity="0.6"/>`;
  const fala = o.fala && Math.sin(t * 15) > 0;
  if (e === 'grito' || fala) {
    const h = fala ? 26 : 60;
    s += `<path d="M -34 116 Q 0 ${116 + h * 1.4} 34 116 Q 0 108 -34 116 Z" fill="#6A1A2A" stroke="${AT}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M -26 116 L 26 116 L 22 124 L -22 124 Z" fill="#fff"/>` + (h > 30 ? `<ellipse cx="0" cy="${116 + h}" rx="18" ry="10" fill="#E05A6A"/>` : '');
  } else if (e === 'sorriso') s += `<path d="M -32 112 Q 0 140 32 112" fill="none" stroke="${AT}" stroke-width="5" stroke-linecap="round"/>`;
  else if (e === 'triste') s += `<path d="M -22 126 Q 0 114 22 126" fill="none" stroke="${AT}" stroke-width="5" stroke-linecap="round"/>`;
  else if (e === 'surpreso') s += `<ellipse cx="0" cy="124" rx="12" ry="15" fill="#6A1A2A" stroke="${AT}" stroke-width="4"/>`;
  else if (e === 'raiva' || e === 'determinado') s += `<path d="M -24 120 Q 0 114 24 120" fill="none" stroke="${AT}" stroke-width="5" stroke-linecap="round"/>`;
  else s += `<path d="M -18 120 Q 0 124 18 119" fill="none" stroke="${AT}" stroke-width="5" stroke-linecap="round"/>`;
  s += animeCabeloFrente(cab, t);
  return s;
}

// ---------- busto ----------
function animeBusto(o) {
  const esc = o.esc || 1.3;
  const t = o.t || 0;
  const bob = Math.sin(t * 2) * 5;
  const farda = o.farda || '#1E2A4A', farda2 = o.farda2 || '#141C34';
  let b = `<path d="M -380 1100 L -360 560 C -350 400 -260 330 -130 300 L 130 300 C 260 330 350 400 360 560 L 380 1100 Z" fill="${farda}" stroke="${AT}" stroke-width="8"/>`;
  b += `<path d="M 130 300 C 260 330 350 400 360 560 L 380 1100 L 180 1100 C 200 700 190 420 130 300 Z" fill="${farda2}" opacity="0.8"/>`;
  b += `<path d="M -92 290 L 0 460 L 92 290 Z" fill="#F2F2F8" stroke="${AT}" stroke-width="6"/>`;
  b += `<path d="M -92 290 L -40 360 L -20 300 Z M 92 290 L 40 360 L 20 300 Z" fill="#DADAE6" stroke="${AT}" stroke-width="5"/>`;
  b += `<path d="M -18 318 L 18 318 L 14 352 L -14 352 Z" fill="${o.gravata || '#C8283C'}" stroke="${AT}" stroke-width="5"/><path d="M -14 352 L 14 352 L 26 500 L 0 532 L -26 500 Z" fill="${o.gravata || '#C8283C'}" stroke="${AT}" stroke-width="5"/><path d="M 4 360 L 14 500" stroke="#000" stroke-width="5" opacity="0.2"/>`;
  b += `<path d="M -130 300 L -40 520 L -96 540 L -170 380 Z" fill="${farda}" stroke="${AT}" stroke-width="6"/><path d="M 130 300 L 40 520 L 96 540 L 170 380 Z" fill="${farda2}" stroke="${AT}" stroke-width="6"/>`;
  b += `<circle cx="-60" cy="640" r="10" fill="#C9A24A" stroke="${AT}" stroke-width="4"/><circle cx="-60" cy="740" r="10" fill="#C9A24A" stroke="${AT}" stroke-width="4"/>`;
  if (o.rim) b += `<path d="M -360 560 C -350 400 -260 330 -130 300" fill="none" stroke="${o.rim}" stroke-width="8" opacity="0.8"/>`;
  const tras = animeCabeloTras({ sombra: '#0B0E1E', luz: '#7FA0FF', ...o.cabelo }, t);
  return `<g transform="translate(${o.x || 540} ${(o.y || 820) + bob}) scale(${esc})">${tras}${b}${animeRosto(o, { semTras: true })}</g>`;
}
function animeOlhos(o, y = 960, altura = 420) {
  return `<defs><clipPath id="faixaOlhos"><rect x="0" y="${y - altura / 2}" width="1080" height="${altura}"/></clipPath></defs>` +
    `<rect x="0" y="${y - altura / 2}" width="1080" height="${altura}" fill="#000"/>` +
    `<g clip-path="url(#faixaOlhos)"><g transform="translate(540 ${y + 66}) scale(3.1)">${animeRosto(o)}</g></g>` +
    `<rect x="0" y="${y - altura / 2 - 8}" width="1080" height="8" fill="#000"/><rect x="0" y="${y + altura / 2}" width="1080" height="8" fill="#000"/>`;
}
function nivel(x, y, txt, cor = '#7FE8FF', lt = 0, glitch = false) {
  const dx = glitch ? Math.sin(lt * 70) * 10 : 0;
  return animeDefs() + `<g transform="translate(${x + dx} ${y})"><text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="${cor}" opacity="0.6" filter="url(#animeGlow)">${txt}</text>` +
    `<text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#fff" stroke="${cor}" stroke-width="8" paint-order="stroke">${txt}</text>` +
    (glitch ? `<text x="8" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#FF3060" opacity="0.5">${txt}</text><text x="-8" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#30E0FF" opacity="0.4">${txt}</text>` : '') + `</g>`;
}

// ---------- cenários ----------
function linhasVelocidade(t, { cx = 540, cy = 900, cor = '#FFFFFF', fundo = '#101020', n = 80 } = {}) {
  let s = `<defs><radialGradient id="vinhetaV" cx="0.5" cy="0.47" r="0.7"><stop offset="0.3" stop-color="${fundo}" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.8"/></radialGradient></defs><rect width="1080" height="1920" fill="${fundo}"/>`;
  const r = aleatorio(Math.floor(t * 12) + 1);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, w = 0.003 + r() * 0.012, r0 = 300 + r() * 280;
    const p = (ang, rr) => `${(cx + Math.cos(ang) * rr).toFixed(0)},${(cy + Math.sin(ang) * rr).toFixed(0)}`;
    s += `<polygon points="${p(a - w, 2100)} ${p(a + w, 2100)} ${p(a, r0)}" fill="${cor}" opacity="${0.3 + r() * 0.55}"/>`;
  }
  return s + `<rect width="1080" height="1920" fill="url(#vinhetaV)"/>`;
}
function nuvem(x, y, k, cor, op) {
  return `<g opacity="${op}" filter="url(#animeBlur4)"><ellipse cx="${x}" cy="${y}" rx="${180 * k}" ry="${60 * k}" fill="${cor}"/><ellipse cx="${x - 90 * k}" cy="${y - 30 * k}" rx="${100 * k}" ry="${70 * k}" fill="${cor}"/><ellipse cx="${x + 70 * k}" cy="${y - 45 * k}" rx="${120 * k}" ry="${85 * k}" fill="${cor}"/></g>`;
}
function camadaCidade(semente, base, alt, cor, janelas, x0 = -20) {
  let s = '', x = x0; const r = aleatorio(semente);
  while (x < 1100) {
    const w = 50 + r() * 100, h = alt[0] + r() * (alt[1] - alt[0]);
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 800}" fill="${cor}"/>`;
    if (r() > 0.6) s += `<rect x="${x + w / 2 - 3}" y="${base - h - 60}" width="6" height="60" fill="${cor}"/>`;
    if (janelas) for (let j = 0; j < 8; j++) if (r() > 0.55) s += `<rect x="${x + 8 + r() * (w - 20)}" y="${base - h + 20 + r() * (h - 40)}" width="7" height="11" fill="${janelas}" opacity="${0.5 + r() * 0.5}"/>`;
    x += w + 4;
  }
  return s;
}
function ceuAnime(t, { topo = '#24185A', meio = '#C8507A', base = '#FFB56A' } = {}) {
  let s = animeDefs() + `<defs><linearGradient id="ceuA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${topo}"/><stop offset="0.55" stop-color="${meio}"/><stop offset="1" stop-color="${base}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#ceuA)"/>`;
  const r = aleatorio(31);
  for (let i = 0; i < 60; i++) s += `<circle cx="${r() * 1080}" cy="${r() * 600}" r="${0.8 + r() * 2.4}" fill="#fff" opacity="${0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))}"/>`;
  s += `<circle cx="760" cy="1060" r="360" fill="#FFD9A0" opacity="0.35" filter="url(#animeSoft)"/><circle cx="760" cy="1060" r="170" fill="#FFF0CC"/>`;
  s += nuvem(200 + t * 8, 560, 1.2, '#F7A0B8', 0.75) + nuvem(820 - t * 6, 700, 1.0, '#FFC2A8', 0.7) + nuvem(420 + t * 5, 860, 1.4, '#E07898', 0.55);
  s += camadaCidade(44, 1420, [200, 520], '#6A3A6E', null) + `<rect y="1000" width="1080" height="920" fill="#FFB56A" opacity="0.12"/>`;
  s += camadaCidade(45, 1520, [300, 760], '#3A2048', '#FFD27A') + `<rect y="900" width="1080" height="1020" fill="#2A1440" opacity="0.12"/>`;
  s += camadaCidade(46, 1640, [380, 1000], '#170E26', '#FFC860');
  s += `<rect x="500" y="320" width="20" height="1400" fill="#170E26"/><circle cx="510" cy="310" r="22" fill="#7FE8FF"/><circle cx="510" cy="310" r="60" fill="#7FE8FF" opacity="0.5" filter="url(#animeGlow)"/>`;
  return s;
}
function noiteChuva(t, { chuva = true } = {}) {
  let s = animeDefs() + `<defs><linearGradient id="ceuN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070F"/><stop offset="1" stop-color="#1A2244"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#ceuN)"/>`;
  s += camadaCidade(51, 1500, [500, 1100], '#141A33', '#5A7AB8') + `<rect width="1080" height="1920" fill="#1A2244" opacity="0.35"/>`;
  s += camadaCidade(52, 1640, [600, 1300], '#0B0F22', '#FFC860');
  s += `<rect x="860" y="700" width="14" height="950" fill="#0B0F22"/><path d="M 867 700 Q 867 660 820 660" fill="none" stroke="#0B0F22" stroke-width="12"/><circle cx="815" cy="676" r="16" fill="#FFE6A0"/><circle cx="815" cy="676" r="120" fill="#FFE6A0" opacity="0.25" filter="url(#animeSoft)"/>`;
  s += `<rect y="1640" width="1080" height="280" fill="#0A0D1A"/><rect x="790" y="1650" width="50" height="270" fill="#FFE6A0" opacity="0.18" filter="url(#animeBlur4)"/>`;
  for (let i = 0; i < 12; i++) { const r = aleatorio(i + 70); s += `<rect x="${r() * 1080}" y="${1660 + r() * 240}" width="${8 + r() * 30}" height="4" fill="#FFC860" opacity="0.25"/>`; }
  if (chuva) s += chuvaAnime(t);
  return s;
}
function chuvaAnime(t, n = 110) {
  let s = '';
  const r = aleatorio(9);
  for (let i = 0; i < n; i++) { const x0 = r() * 1200, v = 1700 + r() * 700, y0 = ((r() * 2000 + t * v) % 2100) - 100; s += `<line x1="${x0}" y1="${y0}" x2="${x0 - 16}" y2="${y0 + 70}" stroke="#AFC4F0" stroke-width="${2 + r() * 2}" opacity="${0.3 + r() * 0.35}"/>`; }
  for (let i = 0; i < 8; i++) { const r2 = aleatorio(i + 90); const k = (t * 1.5 + r2()) % 1; s += `<ellipse cx="${r2() * 1080}" cy="${1700 + r2() * 200}" rx="${10 + k * 40}" ry="${3 + k * 8}" fill="none" stroke="#AFC4F0" stroke-width="2" opacity="${0.6 * (1 - k)}"/>`; }
  return s;
}
function salaoCristal(t) {
  let s = animeDefs() + `<defs><linearGradient id="salaoG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1430"/><stop offset="1" stop-color="#1E3A6A"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#salaoG)"/>`;
  for (let i = 0; i < 4; i++) { const x = 60 + i * 300; s += `<rect x="${x}" y="200" width="70" height="1400" fill="#0E1C40"/><rect x="${x - 10}" y="190" width="90" height="40" fill="#14264E"/>`; }
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200 + Math.sin(t + i) * 20; s += `<polygon points="${x},0 ${x + 80},0 ${x + 260},1600 ${x + 120},1600" fill="#7FE8FF" opacity="0.07"/>`; }
  s += `<rect y="1500" width="1080" height="420" fill="#0E1C40"/><ellipse cx="540" cy="1520" rx="420" ry="60" fill="#7FE8FF" opacity="0.2" filter="url(#animeSoft)"/>`;
  return s;
}
function cristal(x, y, esc = 1, { estado = 'vivo', t = 0 } = {}) {
  const viva = estado !== 'cinza';
  let s = animeDefs() + `<defs><linearGradient id="crG${estado}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${viva ? '#E8FFFF' : '#B0B0BA'}"/><stop offset="0.5" stop-color="${viva ? '#4FC8F0' : '#6A6A76'}"/><stop offset="1" stop-color="${viva ? '#1A5AA0' : '#3A3A44'}"/></linearGradient></defs><g transform="translate(${x} ${y}) scale(${esc})">`;
  if (viva) s += `<ellipse cx="0" cy="0" rx="300" ry="400" fill="#7FE8FF" opacity="${0.3 + 0.12 * Math.sin(t * 4)}" filter="url(#animeSoft)"/>`;
  s += `<path d="M 0 -330 L 160 -100 L 120 270 L 0 340 L -120 270 L -160 -100 Z" fill="url(#crG${estado})" stroke="${AT}" stroke-width="9" stroke-linejoin="round"/>`;
  s += `<path d="M 0 -330 L 34 -80 L 0 340 M 34 -80 L 160 -100 M 34 -80 L 120 270 M -160 -100 L 34 -80" fill="none" stroke="#fff" stroke-width="5" opacity="${viva ? 0.6 : 0.25}"/>`;
  s += `<path d="M -100 -140 L -60 -260" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${viva ? 0.8 : 0.3}"/>`;
  if (!viva) s += `<path d="M -40 -220 L 14 -100 L -26 0 L 44 120 L 4 230" fill="none" stroke="${AT}" stroke-width="9"/><path d="M 14 -100 L 80 -60 M -26 0 L -90 40" stroke="${AT}" stroke-width="6"/>`;
  if (viva) for (let i = 0; i < 10; i++) { const a = t * 0.8 + i * 0.63, rr = 200 + (i % 3) * 50; s += `<circle cx="${Math.cos(a) * rr}" cy="${Math.sin(a) * rr * 1.3}" r="${4 + (i % 3) * 2}" fill="#E8FFFF" opacity="0.8"/>`; }
  return s + `</g>`;
}
function monstro(x, y, esc = 1, t = 0) {
  let s = animeDefs() + `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<ellipse cx="0" cy="-100" rx="330" ry="420" fill="#3A0010" opacity="0.45" filter="url(#animeSoft)"/>`;
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + t * 0.7; s += `<ellipse cx="${Math.cos(a) * 180}" cy="${-220 + Math.sin(a) * 80}" rx="${80 + 20 * Math.sin(t * 3 + i)}" ry="60" fill="#05020A" opacity="0.55"/>`; }
  s += `<path d="M -230 320 L -210 -60 C -210 -360 -110 -440 0 -450 C 110 -440 210 -360 210 -60 L 230 320 L 160 230 L 110 330 L 50 240 L -10 330 L -70 240 L -130 330 L -170 230 Z" fill="#05020A"/>`;
  s += `<path d="M -160 -120 L -60 -70 L -160 -40 Z M 160 -120 L 60 -70 L 160 -40 Z" fill="#FF2040" filter="url(#animeGlow)"/><path d="M -160 -120 L -60 -70 L -160 -40 Z M 160 -120 L 60 -70 L 160 -40 Z" fill="#FF6070"/>`;
  s += `<path d="M -100 60 L -70 24 L -40 60 L -10 24 L 20 60 L 50 24 L 80 60 L 100 30" fill="none" stroke="#FF2040" stroke-width="9" stroke-linejoin="round"/>`;
  for (let i = 0; i < 6; i++) { const k = (t * 0.8 + i / 6) % 1; s += `<circle cx="${-200 + i * 80}" cy="${300 - k * 600}" r="${6 * (1 - k)}" fill="#FF2040" opacity="${1 - k}"/>`; }
  return s + `</g>`;
}
function flashBranco(lt, t0, dur = 0.35, cor = '#FFFFFF') {
  if (lt < t0 || lt > t0 + dur) return '';
  return `<rect width="1080" height="1920" fill="${cor}" opacity="${(1 - (lt - t0) / dur).toFixed(2)}"/>`;
}
function textoImpacto(txt, lt, t0, { y = 600, cor = '#FFFFFF', tam = 170, rot = -6, x = 540 } = {}) {
  if (lt < t0) return '';
  const k = 1 + 0.8 * (1 - suave((lt - t0) / 0.18));
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})"><text x="8" y="12" text-anchor="middle" font-family="Anton, sans-serif" font-size="${tam}" fill="#000" opacity="0.5">${esc(txt)}</text>` +
    `<text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="${tam}" fill="${cor}" stroke="#000" stroke-width="12" paint-order="stroke">${esc(txt)}</text></g>`;
}
function acabamento(cor = '#000', op = 0.55) {
  return `<defs><radialGradient id="vinhetaF" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="${cor}" stop-opacity="0"/><stop offset="1" stop-color="${cor}" stop-opacity="${op}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vinhetaF)"/>`;
}
