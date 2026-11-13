// terror.js — peças do terror em primeira pessoa (POV): porta vista de dentro, olho mágico,
// fresta com sombra, bilhete de regras nas mãos, celular com relógio, corredor, granulado e luz piscando.

const PELE_POV = '#C9946A';

function granulado(t, op = 0.14) {
  const r = aleatorio(Math.floor(t * 24) + 1);
  let s = '';
  for (let i = 0; i < 260; i++) s += `<rect x="${(r() * 1080).toFixed(0)}" y="${(r() * 1920).toFixed(0)}" width="3" height="3" fill="#fff" opacity="${(r() * op).toFixed(2)}"/>`;
  return s;
}
function vinheta(op = 0.85) {
  return `<defs><radialGradient id="vinT" cx="0.5" cy="0.48" r="0.72"><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vinT)"/>`;
}
// Escurece a tela por instantes (lâmpada falhando).
function pisca(t, forca = 0.7, sem = 1) {
  const r = aleatorio(Math.floor(t * 9) + sem * 31);
  return r() > 0.82 ? `<rect width="1080" height="1920" fill="#000" opacity="${forca}"/>` : '';
}
function acabamentoT(t, { pisc = 0 } = {}) {
  return (pisc ? pisca(t, pisc) : '') + vinheta() + granulado(t);
}

// Mão em primeira pessoa (entrando pela borda de baixo).
function maoPOV(x, y, rot = 0, esc = 1, lado = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc * lado} ${esc})">` +
    `<path d="M -90 700 L -70 120 Q -70 40 0 40 Q 70 40 70 120 L 90 700 Z" fill="#3A3F4A" stroke="#0E0D14" stroke-width="8"/>` +
    `<path d="M -70 140 Q -90 40 -40 -10 L 50 -20 Q 100 0 90 80 L 70 150 Z" fill="${PELE_POV}" stroke="#0E0D14" stroke-width="8"/>` +
    `<path d="M 50 -20 Q 120 -60 130 -10 Q 120 30 80 40" fill="${PELE_POV}" stroke="#0E0D14" stroke-width="8"/>` +
    [-40, -10, 20].map((dx) => `<path d="M ${dx} -10 L ${dx + 4} -70" stroke="#0E0D14" stroke-width="4" opacity="0.4"/>`).join('') + `</g>`;
}

// Porta vista de dentro. sombra: true/false/'pisca'. aberta: 0..1 (fresta com corrente).
function portaPOV(t, { sombra = true, luzCorredor = 1, corrente = true, aberta = 0, tremer = 0 } = {}) {
  const dx = tremer ? Math.sin(t * 60) * tremer : 0;
  let s = `<rect width="1080" height="1920" fill="#1A1714"/>`;
  s += `<rect x="150" y="80" width="780" height="1660" fill="#0E0C0A"/>`;
  s += `<g transform="translate(${dx} 0)">`;
  // fresta de luz quando entreaberta
  if (aberta > 0) s += `<rect x="${870 - 140 * aberta}" y="100" width="${140 * aberta}" height="1620" fill="#E8D8A0" opacity="${0.5 * luzCorredor}"/>`;
  s += `<rect x="190" y="110" width="${700 - 140 * aberta}" height="1600" fill="#4A3426" stroke="#0E0C0A" stroke-width="10"/>`;
  for (const [x, y, w, h] of [[250, 180, 260, 520], [570, 180, 260 - 140 * aberta, 520], [250, 800, 260, 820], [570, 800, 260 - 140 * aberta, 820]]) if (w > 20) s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#2E2018" stroke-width="12"/>`;
  s += `<circle cx="540" cy="560" r="26" fill="#C9A24A" stroke="#0E0C0A" stroke-width="6"/><circle cx="540" cy="560" r="10" fill="#0E0C0A"/>`;
  s += `<circle cx="${800 - 140 * aberta}" cy="1000" r="34" fill="#C9A24A" stroke="#0E0C0A" stroke-width="6"/>`;
  if (corrente) { const x2 = 870 - 140 * aberta + (aberta ? 40 : 0); for (let i = 0; i < 7; i++) s += `<ellipse cx="${700 + (x2 - 700) * i / 6}" cy="${880 + Math.sin(i / 6 * Math.PI) * (aberta ? 10 : 40)}" rx="14" ry="9" fill="none" stroke="#B8B8C0" stroke-width="6"/>`; }
  s += `</g>`;
  // fresta embaixo da porta + sombra dos pés
  s += `<rect x="190" y="1712" width="700" height="14" fill="#E8D8A0" opacity="${0.85 * luzCorredor}"/>`;
  const temSombra = sombra === 'pisca' ? Math.sin(t * 7) > 0.2 : sombra;
  if (temSombra && luzCorredor > 0.1) for (const x of [440, 600]) s += `<rect x="${x}" y="1712" width="70" height="14" fill="#0E0C0A"/>`;
  s += `<rect y="1726" width="1080" height="194" fill="#100E0C"/>`;
  return s;
}
function corredorT(t, { luz = 1 } = {}) {
  let s = `<rect width="1080" height="1920" fill="#3A3428"/>`;
  s += `<polygon points="0,0 380,700 380,1250 0,1920" fill="#5A4E3A"/><polygon points="1080,0 700,700 700,1250 1080,1920" fill="#4E4432"/>`;
  s += `<polygon points="0,1920 380,1250 700,1250 1080,1920" fill="#2A2420"/><polygon points="0,0 380,700 700,700 1080,0" fill="#6A5E48"/>`;
  s += `<rect x="380" y="700" width="320" height="550" fill="#2E2820"/><rect x="470" y="820" width="140" height="430" fill="#4A3426"/>`;
  for (const [x1, y1, x2, y2] of [[80, 520, 260, 820], [820, 820, 1000, 520]]) s += `<polygon points="${x1},${y1} ${x2},${y2} ${x2},${y2 + 520} ${x1},${y1 + 820}" fill="#4A3426" opacity="0.9"/>`;
  s += `<ellipse cx="540" cy="420" rx="70" ry="22" fill="#FFF2B0" opacity="${luz}"/><ellipse cx="540" cy="520" rx="420" ry="300" fill="#FFF2B0" opacity="${0.12 * luz}"/>`;
  if (luz < 1) s += `<rect width="1080" height="1920" fill="#000" opacity="${0.75 * (1 - luz)}"/>`;
  return s;
}
// Visão pelo olho mágico: círculo com distorção e borda escura.
function olhoMagico(t, conteudo, { luz = 1 } = {}) {
  return `<rect width="1080" height="1920" fill="#000"/><defs><clipPath id="olhoM"><circle cx="540" cy="900" r="500"/></clipPath>` +
    `<radialGradient id="olhoV" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.95"/></radialGradient></defs>` +
    `<g clip-path="url(#olhoM)"><g transform="translate(540 900) scale(1.18 1.12) translate(-540 -900)">${corredorT(t, { luz })}${conteudo}</g>` +
    `<rect x="40" y="400" width="1000" height="1000" fill="#2A3A5A" opacity="0.18"/><circle cx="540" cy="900" r="500" fill="url(#olhoV)"/></g>` +
    `<circle cx="540" cy="900" r="500" fill="none" stroke="#1A1714" stroke-width="30"/>`;
}
// Visitante no olho mágico (rosto grande, como se estivesse perto da porta).
function visitante(visual, t, o = {}) {
  return kyleClose({ x: 540, y: o.y || 1060, esc: o.esc || 1.35, expr: o.expr || 'neutro', t, fala: o.fala, olhar: o.olhar || [0, 0], barba: !!o.barba, visual: { oculos: false, fone: false, estampa: false, ...visual } });
}
// Bilhete de regras nas mãos. linhas = [[texto, cor]]; visiveis = quantas mostrar (pode ser fracionário).
function bilheteRegras(t, linhas, visiveis) {
  let s = `<rect width="1080" height="1920" fill="#0E0C0A"/><ellipse cx="540" cy="900" rx="600" ry="700" fill="#E8D8A0" opacity="0.08"/>`;
  s += `<g transform="translate(540 860) rotate(-3)"><rect x="-400" y="-560" width="800" height="1120" rx="10" fill="#E6DCC4" stroke="#0E0C0A" stroke-width="8"/>`;
  s += `<path d="M -400 -560 L -340 -500 L -400 -440" fill="#CFC2A4"/>`;
  linhas.forEach(([tx, cor], i) => {
    const op = Math.max(0, Math.min(1, visiveis - i));
    if (op > 0) s += `<text x="-350" y="${-430 + i * 120}" font-family="Caveat, cursive" font-weight="700" font-size="${i === 0 ? 76 : 56}" fill="${cor || '#2A1E18'}" opacity="${op}">${esc(tx)}</text>`;
  });
  s += `<ellipse cx="260" cy="420" rx="70" ry="40" fill="#8A3A2A" opacity="0.4"/></g>`;
  s += maoPOV(170, 1500, 18, 1.1, 1) + maoPOV(910, 1500, -18, 1.1, -1);
  return s;
}
// Celular na mão com a hora grande.
function celularPOV(t, hora, { aviso = '' } = {}) {
  let s = `<rect width="1080" height="1920" fill="#0B0A0E"/><ellipse cx="540" cy="900" rx="500" ry="700" fill="#5A7AB8" opacity="0.12"/>`;
  s += `<g transform="translate(540 880) rotate(-4)"><rect x="-300" y="-560" width="600" height="1120" rx="60" fill="#15131A" stroke="#000" stroke-width="8"/><rect x="-276" y="-536" width="552" height="1072" rx="44" fill="#1A2440"/>`;
  s += `<text x="0" y="-260" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="170" fill="#FFFFFF">${hora}</text>`;
  s += `<text x="0" y="-180" text-anchor="middle" font-family="Oswald, sans-serif" font-size="44" fill="#B8C4E0">sábado, 14 de novembro</text>`;
  if (aviso) s += `<rect x="-240" y="-60" width="480" height="140" rx="30" fill="#FFFFFF" opacity="0.9"/><text x="0" y="28" text-anchor="middle" font-family="Oswald, sans-serif" font-size="40" fill="#111">${esc(aviso)}</text>`;
  s += `</g>` + maoPOV(620, 1600, -10, 1.15, -1);
  return s;
}
// Título de gancho no estilo terror.
function tituloTerror(linhas, y0 = 170) {
  return `<rect width="1080" height="${y0 + linhas.length * 120 - 40}" fill="#000" opacity="0.7"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${y0 + i * 120}" text-anchor="middle" font-family="Anton, sans-serif" font-size="${Math.min(110, 1800 / t.length)}" fill="${cor || '#fff'}" stroke="#000" stroke-width="10" paint-order="stroke">${esc(t)}</text>`).join('');
}
