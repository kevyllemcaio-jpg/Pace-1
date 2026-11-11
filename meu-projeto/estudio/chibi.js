// chibi.js — personagens "chibi" (cabeça grande, olhos enormes, contorno de adesivo)
// para a série do Kyle. Personagens originais.
//
// chibi({ x, y, esc, pele, cabelo: { tipo, cor }, olhos, oculos, roupa: { camisa, calca, saia, sapato, estampa },
//         expr, braco: 'baixo'|'acena'|'rosto'|'boca'|'segura'|'aponta'|'escreve', segura (svg), espinhas (0..1),
//         vergonha (0..1), t, olhar: [gx, gy], adesivo (true = contorno branco) })
// Pés em (x, y). Altura ≈ 640 px com esc = 1 (cabeça ≈ 45% da altura).

const TC = '#2A2238'; // contorno

function filtroAdesivo() {
  return `<defs><filter id="adesivo" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d"/><feFlood flood-color="#FFFFFF"/><feComposite in2="d" operator="in" result="b"/>` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="11" result="d2"/><feFlood flood-color="#000" flood-opacity="0.18"/><feComposite in2="d2" operator="in" result="s"/><feOffset in="s" dx="4" dy="6" result="s2"/>` +
    `<feMerge><feMergeNode in="s2"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
}

const BRACOS = {
  // [ombro→cotovelo, cotovelo→mão] como pontos relativos ao ombro direito (o esquerdo é espelhado)
  baixo: [[14, 70], [20, 140]],
  acena: [[50, -40], [70, -130]],
  rosto: [[60, 30], [-10, -60]], // mãos no rosto (vergonha)
  boca: [[58, 40], [-20, -40]],
  segura: [[40, 70], [-30, 90]],
  aponta: [[80, -10], [170, -30]],
  escreve: [[40, 80], [-20, 120]],
  cintura: [[60, 60], [10, 120]],
};

function chibiCabelo(tipo, cor, frente) {
  const C = `fill="${cor}" stroke="${TC}" stroke-width="6" stroke-linejoin="round"`;
  if (!frente) {
    if (tipo === 'cacheado') return `<path d="M -150 -470 Q -175 -330 -120 -300 L 120 -300 Q 175 -330 150 -470 Z" ${C}/>`;
    if (tipo === 'longo') return `<path d="M -142 -480 Q -160 -320 -130 -260 L 130 -260 Q 160 -320 142 -480 Z" ${C}/>`;
    if (tipo === 'coque') return `<circle cx="0" cy="-640" r="48" ${C}/>`;
    return '';
  }
  switch (tipo) {
    case 'baguncado': // Kyle: castanho bagunçado com redemoinho
      return `<path d="M -146 -455 Q -160 -560 -90 -605 Q -40 -640 20 -628 Q 100 -620 140 -560 Q 160 -515 148 -452 Q 120 -500 70 -515 Q 80 -480 50 -470 Q 30 -510 -10 -512 Q -20 -478 -55 -470 Q -60 -505 -95 -500 Q -120 -490 -146 -455 Z" ${C}/>` +
        `<path d="M 10 -628 Q 20 -680 60 -690 Q 40 -660 48 -630" ${C}/>`;
    case 'cacheado':
      return `<path d="M -150 -460 Q -165 -600 -60 -625 Q 0 -640 60 -625 Q 165 -600 150 -460 Q 120 -520 60 -530 Q 0 -560 -60 -530 Q -120 -520 -150 -460 Z" ${C}/>` +
        [-120, -70, -20, 30, 80, 125].map((x, i) => `<circle cx="${x}" cy="${-560 - (i % 2) * 30}" r="34" ${C}/>`).join('');
    case 'curto':
      return `<path d="M -146 -465 Q -150 -610 0 -618 Q 150 -610 146 -465 Q 120 -545 0 -548 Q -120 -545 -146 -465 Z" ${C}/>`;
    case 'longo':
      return `<path d="M -148 -450 Q -160 -615 0 -622 Q 160 -615 148 -450 Q 110 -540 30 -540 L 0 -505 L -20 -540 Q -110 -540 -148 -450 Z" ${C}/>`;
    case 'coque':
      return `<path d="M -146 -465 Q -150 -610 0 -618 Q 150 -610 146 -465 Q 100 -560 0 -560 Q -100 -560 -146 -465 Z" ${C}/>`;
    default:
      return '';
  }
}

function chibiRosto(o, t) {
  const ex = { neutro: [0, 0, 'reta'], feliz: [-6, -4, 'sorri'], sorriso: [-8, -6, 'aberta'], triste: [-14, 8, 'triste'], vergonha: [-12, 6, 'onda'],
    surpreso: [-16, -12, 'o'], determinado: [10, -6, 'firme'], chorando: [-14, 8, 'chora'], raiva: [12, -6, 'raiva'], sonhando: [-8, -4, 'sorri'] }[o.expr || 'neutro'] || [0, 0, 'reta'];
  const [bi, be, boca] = ex;
  const [gx, gy] = o.olhar || [0, 0];
  const piscar = ((t + (o.semente || 1) * 0.7) % 3.6) < 0.12;
  let s = '';
  const ey = -455;
  for (const l of [-1, 1]) {
    const x = l * 52;
    if (piscar || o.expr === 'sonhando') {
      s += `<path d="M ${x - 26} ${ey + 4} Q ${x} ${ey - 16} ${x + 26} ${ey + 4}" fill="none" stroke="${TC}" stroke-width="7" stroke-linecap="round"/>`;
    } else {
      s += `<ellipse cx="${x}" cy="${ey}" rx="30" ry="36" fill="#fff" stroke="${TC}" stroke-width="6"/>`;
      s += `<circle cx="${x + gx * 8}" cy="${ey + 4 + gy * 7}" r="23" fill="${o.olhos || '#7A4A26'}"/><circle cx="${x + gx * 8}" cy="${ey + 4 + gy * 7}" r="12" fill="${TC}"/>`;
      s += `<circle cx="${x + gx * 8 + 8}" cy="${ey - 6 + gy * 7}" r="7" fill="#fff"/><circle cx="${x + gx * 8 - 8}" cy="${ey + 12 + gy * 7}" r="3.5" fill="#fff"/>`;
    }
    s += `<path d="M ${x - l * 22} ${ey - 52 + bi} Q ${x} ${ey - 64 + (bi + be) / 2} ${x + l * 26} ${ey - 54 + be}" fill="none" stroke="${TC}" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (o.oculos) {
    s += `<circle cx="-52" cy="${ey}" r="46" fill="#DFF3FF" fill-opacity="0.18" stroke="${TC}" stroke-width="8"/><circle cx="52" cy="${ey}" r="46" fill="#DFF3FF" fill-opacity="0.18" stroke="${TC}" stroke-width="8"/>` +
      `<path d="M -8 ${ey - 4} Q 0 ${ey - 12} 8 ${ey - 4}" fill="none" stroke="${TC}" stroke-width="7"/>` +
      `<path d="M -36 ${ey - 28} L -22 ${ey - 36}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.8"/><path d="M 68 ${ey - 28} L 82 ${ey - 36}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`;
  }
  // bochechas
  const blush = 0.55 + (o.vergonha || 0) * 0.45;
  for (const l of [-1, 1]) s += `<ellipse cx="${l * 92}" cy="${ey + 50}" rx="24" ry="13" fill="#F28B9A" opacity="${blush}"/>`;
  // sardas / espinhas
  const esp = o.espinhas || 0;
  if (esp > 0) [[-96, -400, 7], [-70, -380, 5], [88, -395, 6], [106, -418, 4], [-20, -385, 5], [40, -510, 5], [-110, -430, 4]].forEach(([x, y, r], i) => {
    if (i / 7 < esp) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#E2504F" stroke="#B23A3A" stroke-width="1.5"/>`;
  });
  // nariz
  s += `<path d="M -6 -418 Q 0 -410 6 -418" fill="none" stroke="${TC}" stroke-width="5" stroke-linecap="round"/>`;
  // boca
  const my = -385;
  const L = `fill="none" stroke="${TC}" stroke-width="6" stroke-linecap="round"`;
  const fala = o.fala && Math.sin(t * 17) > 0;
  if (fala) s += `<ellipse cx="0" cy="${my}" rx="16" ry="11" fill="#7A2A2A" stroke="${TC}" stroke-width="5"/>`;
  else if (boca === 'sorri') s += `<path d="M -22 ${my - 4} Q 0 ${my + 14} 22 ${my - 4}" ${L}/>`;
  else if (boca === 'aberta') s += `<path d="M -28 ${my - 8} Q 0 ${my + 30} 28 ${my - 8} Z" fill="#7A2A2A" stroke="${TC}" stroke-width="5" stroke-linejoin="round"/><path d="M -22 ${my - 6} L 22 ${my - 6} L 18 ${my + 1} L -18 ${my + 1} Z" fill="#fff"/>`;
  else if (boca === 'triste') s += `<path d="M -20 ${my + 6} Q 0 ${my - 10} 20 ${my + 6}" ${L}/>`;
  else if (boca === 'onda') s += `<path d="M -22 ${my} Q -11 ${my - 8} 0 ${my} Q 11 ${my + 8} 22 ${my}" ${L}/>`;
  else if (boca === 'o') s += `<ellipse cx="0" cy="${my}" rx="12" ry="16" fill="#7A2A2A" stroke="${TC}" stroke-width="5"/>`;
  else if (boca === 'firme') s += `<path d="M -18 ${my} L 18 ${my - 3}" ${L}/>`;
  else if (boca === 'raiva') s += `<path d="M -22 ${my + 4} Q 0 ${my - 8} 22 ${my + 4}" ${L}/>`;
  else if (boca === 'chora') s += `<path d="M -24 ${my + 8} Q 0 ${my - 14} 24 ${my + 8} Z" fill="#7A2A2A" stroke="${TC}" stroke-width="5"/>`;
  else s += `<path d="M -14 ${my} L 14 ${my}" ${L}/>`;
  if (o.expr === 'chorando') for (const l of [-1, 1]) {
    const k = ((t * 1.4) % 1);
    s += `<path d="M ${l * 60} ${ey + 34 + k * 60} q -8 14 0 22 q 8 -8 0 -22 Z" fill="#8FD3F5" stroke="${TC}" stroke-width="3" opacity="${1 - k}"/>`;
  }
  if ((o.vergonha || 0) > 0.5) s += `<path d="M 120 -560 Q 132 -535 120 -520 Q 108 -535 120 -560 Z" fill="#8FD3F5" stroke="${TC}" stroke-width="4"/>` +
    `<ellipse cx="0" cy="-420" rx="140" ry="70" fill="#FF5A6A" opacity="${0.22 * o.vergonha}"/>`;
  return s;
}

function chibi(o) {
  const t = o.t || 0;
  const esc = o.esc || 1;
  const pele = o.pele || '#F2C6A0';
  const roupa = o.roupa || { camisa: '#2BA59A', calca: '#3E5C93', sapato: '#E24B4B' };
  const cab = o.cabelo || { tipo: 'baguncado', cor: '#5A3A24' };
  const resp = Math.sin(t * 2.4 + (o.semente || 1)) * 3;
  const anda = o.anda ? Math.sin(t * 10) : 0;
  let s = `<ellipse cx="0" cy="4" rx="90" ry="14" fill="#000" opacity="0.15"/>`;
  // pernas
  for (const [lx, k] of [[-26, anda], [26, -anda]]) {
    const dy = Math.max(0, k) * -16;
    if (roupa.saia) s += `<rect x="${lx - 11}" y="${-150 + dy}" width="22" height="130" fill="${pele}" stroke="${TC}" stroke-width="6"/><rect x="${lx - 12}" y="${-70 + dy}" width="24" height="50" fill="#fff" stroke="${TC}" stroke-width="5"/>`;
    else s += `<rect x="${lx - 19}" y="${-170 + dy}" width="38" height="${152}" rx="6" fill="${roupa.calca}" stroke="${TC}" stroke-width="6"/>`;
    s += `<path d="M ${lx - 28} ${-4 + dy} Q ${lx - 30} ${-34 + dy} ${lx} ${-34 + dy} Q ${lx + 34} ${-34 + dy} ${lx + 34} ${-4 + dy} Z" fill="${roupa.sapato || '#F4F4F4'}" stroke="${TC}" stroke-width="6" stroke-linejoin="round"/>`;
  }
  let corpo = '';
  if (roupa.saia) corpo += `<path d="M -70 -200 L 70 -200 L 92 -110 L -92 -110 Z" fill="${roupa.saia}" stroke="${TC}" stroke-width="6" stroke-linejoin="round"/>` +
    [-60, -30, 0, 30, 60].map((x) => `<line x1="${x}" y1="-196" x2="${x * 1.3}" y2="-114" stroke="${TC}" stroke-width="3" opacity="0.4"/>`).join('');
  // tronco
  corpo += `<path d="M -66 -330 Q -78 -328 -78 -310 L -72 -180 L 72 -180 L 78 -310 Q 78 -328 66 -330 Z" fill="${roupa.camisa}" stroke="${TC}" stroke-width="6" stroke-linejoin="round"/>`;
  if (roupa.estampa) corpo += roupa.estampa;
  // braços
  const pose = BRACOS[o.braco || 'baixo'];
  const aceno = o.braco === 'acena' ? Math.sin(t * 9) * 18 : 0;
  for (const l of [-1, 1]) {
    const om = [l * 66, -318];
    const usar = o.bracoE && l === -1 ? BRACOS[o.bracoE] : pose;
    const co = [om[0] + l * usar[0][0], om[1] + usar[0][1]];
    const ma = [om[0] + l * usar[1][0] + (l === 1 ? aceno : 0), om[1] + usar[1][1]];
    const d = `M ${om[0]} ${om[1]} L ${co[0]} ${co[1]} L ${ma[0]} ${ma[1]}`;
    corpo += `<path d="${d}" fill="none" stroke="${TC}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${pele}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
    corpo += `<path d="M ${om[0]} ${om[1]} L ${mix(om[0], co[0], 0.55)} ${mix(om[1], co[1], 0.55)}" stroke="${TC}" stroke-width="46" stroke-linecap="round"/><path d="M ${om[0]} ${om[1]} L ${mix(om[0], co[0], 0.55)} ${mix(om[1], co[1], 0.55)}" stroke="${roupa.manga || roupa.camisa}" stroke-width="34" stroke-linecap="round"/>`;
    corpo += `<circle cx="${ma[0]}" cy="${ma[1]}" r="17" fill="${pele}" stroke="${TC}" stroke-width="5"/>`;
  }
  if (o.segura) corpo += `<g transform="translate(0 -250)">${o.segura}</g>`;
  // cabeça
  let cabeca = chibiCabelo(cab.tipo, cab.cor, false);
  cabeca += `<rect x="-20" y="-345" width="40" height="30" fill="${pele}" stroke="${TC}" stroke-width="6"/>`;
  for (const l of [-1, 1]) cabeca += `<ellipse cx="${l * 146}" cy="-440" rx="22" ry="28" fill="${pele}" stroke="${TC}" stroke-width="6"/>`;
  cabeca += `<path d="M -148 -470 Q -150 -600 0 -604 Q 150 -600 148 -470 Q 146 -380 90 -350 Q 40 -330 0 -330 Q -40 -330 -90 -350 Q -146 -380 -148 -470 Z" fill="${pele}" stroke="${TC}" stroke-width="7" stroke-linejoin="round"/>`;
  cabeca += chibiCabelo(cab.tipo, cab.cor, true);
  if (o.tiara) cabeca += `<path d="M -138 -520 Q 0 -610 138 -520" fill="none" stroke="${TC}" stroke-width="22" stroke-linecap="round"/><path d="M -138 -520 Q 0 -610 138 -520" fill="none" stroke="${o.tiara}" stroke-width="13" stroke-linecap="round"/>`;
  cabeca += chibiRosto(o, t);
  const conteudo = s + `<g transform="translate(0 ${resp})">${corpo}${cabeca}</g>`;
  const filtro = o.adesivo === false ? '' : ' filter="url(#adesivo)"';
  return `<g transform="translate(${o.x} ${o.y}) scale(${esc * (o.vira || 1)} ${esc})"><g${filtro}>${conteudo}</g></g>`;
}

// ---------- elenco da série do Kyle ----------
const AVIAOZINHO = `<g transform="translate(0 -262)"><path d="M -26 8 L 30 -14 L -6 22 Z" fill="#fff" stroke="#2A2238" stroke-width="4" stroke-linejoin="round"/><path d="M -6 22 L 0 6 L 30 -14" fill="none" stroke="#2A2238" stroke-width="3"/></g>`;
function kyle(o) {
  return chibi({ pele: '#F2C6A0', cabelo: { tipo: 'baguncado', cor: '#5A3A24' }, olhos: '#6B8E3A', oculos: true,
    roupa: { camisa: '#2BA59A', calca: '#3E5C93', sapato: '#E24B4B', estampa: AVIAOZINHO }, semente: 2, ...o });
}
function lara(o) {
  return chibi({ pele: '#C98B62', cabelo: { tipo: 'cacheado', cor: '#3A2418' }, olhos: '#5A3420', tiara: '#F7C531',
    roupa: { camisa: '#FFFFFF', saia: '#7A3FB0', calca: '#7A3FB0', sapato: '#2A2238', estampa: `<path d="M -16 -322 L 0 -300 L 16 -322 Z" fill="#7A3FB0" stroke="#2A2238" stroke-width="4"/>` }, semente: 5, ...o });
}
function rafa(o) {
  return chibi({ pele: '#8A5A3C', cabelo: { tipo: 'curto', cor: '#1E1612' }, olhos: '#3A2418',
    roupa: { camisa: '#D93A3A', calca: '#2A2238', sapato: '#F4F4F4', estampa: `<text x="0" y="-232" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="74" fill="#fff" stroke="#2A2238" stroke-width="4" paint-order="stroke">7</text>` }, semente: 9, ...o });
}
function maeKyle(o) {
  return chibi({ pele: '#EBBE98', cabelo: { tipo: 'coque', cor: '#6B4A30' }, olhos: '#5A3420',
    roupa: { camisa: '#E8796B', saia: '#3E5C93', calca: '#3E5C93', sapato: '#6B4A30' }, semente: 7, ...o });
}
function alunoChibi(sem, o) {
  const r = aleatorio(sem * 31 + 3);
  const tipos = ['curto', 'cacheado', 'longo', 'coque', 'baguncado'];
  const peles = ['#F2C6A0', '#C98B62', '#8A5A3C', '#E8B48C', '#6E452C'];
  const cores = ['#2A1E18', '#5A3A24', '#1E1612', '#8A4A20', '#3A2418'];
  const tipo = tipos[Math.floor(r() * tipos.length)];
  const menina = tipo === 'longo' || tipo === 'coque';
  const camisas = ['#4A90E2', '#F2C230', '#9B59B6', '#E67E22', '#2ECC71', '#E24B4B'];
  return chibi({ pele: peles[Math.floor(r() * 5)], cabelo: { tipo, cor: cores[Math.floor(r() * 5)] }, olhos: '#5A3420',
    roupa: { camisa: camisas[Math.floor(r() * 6)], calca: '#3E5C93', saia: menina && r() > 0.4 ? '#3E5C93' : undefined, sapato: '#F4F4F4' }, semente: sem, ...o });
}

// ---------- visual dos cards/títulos no estilo da série ----------
const F_RED = "Baloo, 'Arial Rounded MT Bold', sans-serif";
function fundoDiagonal(t = 0, { a = '#D92B47', b = '#2E3F9E' } = {}) {
  let s = `<rect width="1080" height="1920" fill="${b}"/><path d="M 0 0 L 640 0 L 300 1920 L 0 1920 Z" fill="${a}"/>`;
  const r = aleatorio(12);
  const cores = ['#F7C531', '#FFFFFF', '#7FC3F0', '#F29BB0'];
  for (let i = 0; i < 26; i++) {
    const x = r() * 1080, y = ((r() * 1920 + t * (40 + r() * 40)) % 2000) - 40, rot = r() * 180 + t * 60;
    s += `<rect x="${x}" y="${y}" width="26" height="12" rx="3" fill="${cores[i % 4]}" transform="rotate(${rot} ${x} ${y})" opacity="0.9"/>`;
  }
  return s;
}
function tituloRed(texto, x, y, { tam = 110, cor = '#FFFFFF', contorno = '#2A2238', rot = 0 } = {}) {
  return `<g transform="rotate(${rot} ${x} ${y})"><text x="${x + 5}" y="${y + 9}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="${tam}" fill="#000" opacity="0.3">${esc(texto)}</text>` +
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="${tam}" fill="${cor}" stroke="${contorno}" stroke-width="${tam * 0.12}" stroke-linejoin="round" paint-order="stroke">${esc(texto)}</text></g>`;
}
function pilulaRed(texto, x, y, { tam = 50, fundo = '#F7C531', cor = '#2A2238', rot = -3 } = {}) {
  const w = texto.length * tam * 0.52 + 70, h = tam * 1.55;
  return `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - w / 2 + 5}" y="${y - h / 2 + 8}" width="${w}" height="${h}" rx="${h / 2}" fill="#000" opacity="0.3"/>` +
    `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fundo}" stroke="#2A2238" stroke-width="6"/>` +
    `<text x="${x}" y="${y + tam * 0.34}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="${tam}" fill="${cor}">${esc(texto)}</text></g>`;
}
