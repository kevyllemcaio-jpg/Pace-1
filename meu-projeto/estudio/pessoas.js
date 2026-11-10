// Personagens da série no estilo flat: cabeça grande, olhos redondos, contorno escuro fino.
// pessoa({...}) desenha alguém de frente com os pés em (x, y). Altura ≈ 640 px com esc = 1.

const TRACO = '#24201E';
const PELES = ['#8B5A3C', '#C68E62', '#5E3B25', '#E3B38E', '#A86F48', '#73482E', '#F0C9A6'];
const CABELOS = ['#1E1714', '#2B1D16', '#4A2E1E', '#1A1A1A', '#6B4226'];

// Expressões: sobrancelha (interna, externa), pálpebra (0 = aberta), boca.
const EXPR = {
  neutro: { bi: 0, be: 0, lid: 0, boca: 'reta' },
  feliz: { bi: -6, be: -4, lid: 0, boca: 'sorri' },
  sorriso: { bi: -8, be: -6, lid: 0, boca: 'aberta' },
  triste: { bi: -12, be: 6, lid: 0.15, boca: 'triste' },
  preocupado: { bi: -12, be: 4, lid: 0, boca: 'onda' },
  surpreso: { bi: -16, be: -12, lid: 0, boca: 'o', pupila: 6 },
  bravo: { bi: 12, be: -4, lid: 0.1, boca: 'bravo' },
  determinado: { bi: 8, be: -2, lid: 0.22, boca: 'firme' },
  desconfiado: { bi: 6, be: 0, lid: 0.42, boca: 'canto' },
  cansado: { bi: -8, be: 6, lid: 0.4, boca: 'reta' },
  orgulhoso: { bi: -2, be: -6, lid: 0.3, boca: 'canto' },
};

// Posições (cotovelo, mão) do braço direito; o esquerdo é espelhado, salvo indicação.
const POSES = {
  baixo: { d: [[84, -312], [94, -240]] },
  segura: { d: [[98, -300], [32, -300]] },
  aponta: { d: [[150, -392], [236, -404]], e: [[-84, -312], [-94, -240]] },
  cintura: { d: [[128, -316], [70, -252]] },
  coca: { d: [[136, -452], [74, -560]], e: [[-84, -312], [-94, -240]] },
  acena: { d: [[150, -452], [166, -566]], e: [[-84, -312], [-94, -240]] },
  oferece: { d: [[132, -330], [206, -352]], e: [[-128, -316], [-70, -252]] },
  conta: { d: [[96, -318], [52, -266]] },
  ergue: { d: [[140, -470], [150, -600]], e: [[-84, -312], [-94, -240]] },
};

let _pid = 0;

function olho(ex, ey, pele, lid, gx, gy, pupila) {
  let s = `<circle cx="${ex}" cy="${ey}" r="21" fill="#fff" stroke="${TRACO}" stroke-width="4"/>`;
  if (lid < 0.95) {
    s += `<circle cx="${ex + gx * 6}" cy="${ey + gy * 5 + 2}" r="${pupila}" fill="${TRACO}"/>` +
      `<circle cx="${ex + gx * 6 + 3}" cy="${ey + gy * 5 - 2}" r="2.6" fill="#fff"/>`;
  }
  if (lid > 0.02) {
    const r = 21, ly = ey - r + lid * 2 * r;
    const dx = Math.sqrt(Math.max(0, r * r - (ly - ey) * (ly - ey)));
    if (lid >= 0.95) {
      s += `<circle cx="${ex}" cy="${ey}" r="23" fill="${pele}"/><path d="M ${ex - 19} ${ey + 2} Q ${ex} ${ey + 9} ${ex + 19} ${ey + 2}" fill="none" stroke="${TRACO}" stroke-width="4" stroke-linecap="round"/>`;
    } else {
      s += `<path d="M ${ex - dx} ${ly} A ${r} ${r} 0 ${ly > ey ? 1 : 0} 1 ${ex + dx} ${ly} Z" fill="${pele}" stroke="${pele}" stroke-width="3"/>` +
        `<line x1="${ex - dx}" y1="${ly}" x2="${ex + dx}" y2="${ly}" stroke="${TRACO}" stroke-width="4" stroke-linecap="round"/>`;
    }
  }
  return s;
}

function boca(tipo) {
  const y = -468;
  const l = `fill="none" stroke="${TRACO}" stroke-width="5" stroke-linecap="round"`;
  switch (tipo) {
    case 'sorri': return `<path d="M -24 ${y - 4} Q 0 ${y + 18} 24 ${y - 4}" ${l}/>`;
    case 'aberta': return `<path d="M -30 ${y - 6} Q 0 ${y + 34} 30 ${y - 6} Z" fill="#6E2222" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/><path d="M -24 ${y - 4} L 24 ${y - 4} L 20 ${y + 3} L -20 ${y + 3} Z" fill="#fff"/>`;
    case 'triste': return `<path d="M -20 ${y + 6} Q 0 ${y - 10} 20 ${y + 6}" ${l}/>`;
    case 'onda': return `<path d="M -18 ${y} Q -9 ${y - 7} 0 ${y} Q 9 ${y + 7} 18 ${y}" ${l}/>`;
    case 'o': return `<ellipse cx="0" cy="${y + 2}" rx="12" ry="16" fill="#6E2222" stroke="${TRACO}" stroke-width="4"/>`;
    case 'bravo': return `<path d="M -22 ${y + 4} Q 0 ${y - 8} 22 ${y + 4}" ${l}/>`;
    case 'firme': return `<path d="M -18 ${y} L 18 ${y - 3}" ${l}/>`;
    case 'canto': return `<path d="M -18 ${y + 1} Q 6 ${y + 3} 22 ${y - 9}" ${l}/>`;
    case 'fala': return `<ellipse cx="0" cy="${y + 2}" rx="16" ry="10" fill="#6E2222" stroke="${TRACO}" stroke-width="4"/>`;
    default: return `<path d="M -16 ${y} L 16 ${y}" ${l}/>`;
  }
}

function braco([ox, oy], [cx, cy], [mx, my], manga, pele, mangaLonga) {
  const p = `M ${ox} ${oy} Q ${cx} ${cy} ${mx} ${my}`;
  let s = `<path d="${p}" fill="none" stroke="${TRACO}" stroke-width="29" stroke-linecap="round"/>` +
    `<path d="${p}" fill="none" stroke="${pele}" stroke-width="20" stroke-linecap="round"/>`;
  if (mangaLonga) {
    s += `<path d="${p}" fill="none" stroke="${TRACO}" stroke-width="35" stroke-linecap="butt" stroke-dasharray="0 0"/>` +
      `<path d="${p}" fill="none" stroke="${manga}" stroke-width="26"/>`;
  } else {
    const k = 0.42;
    const sx = ox + (cx - ox) * k, sy = oy + (cy - oy) * k;
    s += `<path d="M ${ox} ${oy} L ${sx} ${sy}" stroke="${TRACO}" stroke-width="44" stroke-linecap="round"/>` +
      `<path d="M ${ox} ${oy} L ${sx} ${sy}" stroke="${manga}" stroke-width="35" stroke-linecap="round"/>`;
  }
  s += `<circle cx="${mx}" cy="${my}" r="15" fill="${pele}" stroke="${TRACO}" stroke-width="4"/>`;
  return s;
}

function cabeloAtras(c) {
  const cor = c.cor;
  if (c.tipo === 'coque') return `<circle cx="0" cy="-640" r="42" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
  if (c.tipo === 'longo') return `<path d="M -104 -540 Q -120 -420 -96 -360 L 96 -360 Q 120 -420 104 -540 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
  if (c.tipo === 'rabo') return `<path d="M 60 -600 Q 150 -600 130 -470 Q 120 -420 96 -430 Q 110 -520 60 -560 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
  if (c.tipo === 'tranca') return `<path d="M -40 -610 Q -150 -560 -128 -420" fill="none" stroke="${TRACO}" stroke-width="30" stroke-linecap="round"/><path d="M -40 -610 Q -150 -560 -128 -420" fill="none" stroke="${cor}" stroke-width="22" stroke-linecap="round" stroke-dasharray="14 4"/>`;
  return '';
}

function cabeloFrente(c) {
  const cor = c.cor;
  const capa = `M -102 -520 C -112 -650 112 -650 102 -520 C 92 -566 60 -584 0 -582 C -60 -584 -92 -566 -102 -520 Z`;
  let s = '';
  if (c.tipo === 'cacheado' || c.tipo === 'black') {
    const r = c.tipo === 'black' ? 30 : 22, R = c.tipo === 'black' ? 104 : 94;
    s += `<path d="${capa}" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
    for (let a = 190; a <= 350; a += 16) {
      const rad = (a * Math.PI) / 180;
      s += `<circle cx="${Math.cos(rad) * R}" cy="${-530 + Math.sin(rad) * R}" r="${r}" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
    }
    s += `<path d="M -96 -548 C -80 -650 80 -650 96 -548 C 80 -585 -80 -585 -96 -548 Z" fill="${cor}"/>`;
  } else if (c.tipo === 'raspado') {
    s += `<path d="M -100 -530 C -110 -640 110 -640 100 -530 C 90 -570 -90 -570 -100 -530 Z" fill="${cor}" opacity="0.85"/>`;
  } else if (c.tipo !== 'careca') {
    s += `<path d="${capa}" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>`;
    if (c.tipo === 'longo' || c.tipo === 'rabo' || c.tipo === 'tranca')
      s += `<path d="M -100 -540 Q -40 -560 10 -600 Q 30 -560 100 -540" fill="none" stroke="${TRACO}" stroke-width="3" opacity="0.5"/>`;
  }
  return s;
}

function chapeu(tipo, cor) {
  if (tipo === 'bone')
    return `<path d="M -104 -560 C -100 -660 100 -660 104 -560 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>` +
      `<path d="M 40 -566 Q 140 -570 160 -548 Q 110 -540 40 -548 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>` +
      `<circle cx="0" cy="-640" r="7" fill="${TRACO}"/>`;
  if (tipo === 'lenco')
    return `<path d="M -108 -545 C -110 -665 110 -665 108 -545 Q 0 -570 -108 -545 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>` +
      `<path d="M 96 -560 L 150 -590 L 140 -530 Z" fill="${cor}" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/>` +
      `<circle cx="-40" cy="-610" r="6" fill="#fff" opacity="0.7"/><circle cx="20" cy="-628" r="6" fill="#fff" opacity="0.7"/><circle cx="60" cy="-590" r="6" fill="#fff" opacity="0.7"/>`;
  if (tipo === 'palha')
    return `<ellipse cx="0" cy="-575" rx="170" ry="28" fill="#D9A93F" stroke="${TRACO}" stroke-width="4"/>` +
      `<path d="M -92 -580 C -90 -690 90 -690 92 -580 Z" fill="#E7BC52" stroke="${TRACO}" stroke-width="4"/>` +
      `<rect x="-92" y="-608" width="184" height="18" fill="#B5452F"/>`;
  return '';
}

/**
 * o = { x, y, esc, pele, cabelo: {tipo, cor}, roupa, expr, pose, t, olhar: [gx, gy], segura (svg),
 *       mochila, saia, oculos, brinco, bigode, cracha, avental, chapeu: {tipo, cor}, fala (bool), semente, anda }
 * roupa = { camisa, calca, manga?, mangaLonga?, uniforme? }
 */
function pessoa(o) {
  const id = ++_pid;
  const t = o.t || 0;
  const esc = o.esc || 1;
  const pele = o.pele || PELES[0];
  const cab = o.cabelo || { tipo: 'cacheado', cor: CABELOS[0] };
  const roupa = o.roupa || UNIFORME;
  const ex = EXPR[o.expr || 'neutro'];
  const pose = POSES[o.pose || 'baixo'];
  const semente = o.semente || 1;
  const [gx, gy] = o.olhar || [0, 0];
  const resp = Math.sin(t * 2.4 + semente) * 2.5; // respiração
  const piscar = ((t + semente * 0.77) % 3.9) < 0.13;
  const lid = piscar ? 1 : ex.lid;
  const anda = o.anda ? Math.sin(t * 10) : 0;

  let s = '';
  // sombra no chão
  s += `<ellipse cx="0" cy="0" rx="92" ry="15" fill="#000" opacity="0.18"/>`;

  // mochila (atrás)
  if (o.mochila) s += `<g transform="translate(0 ${resp})"><rect x="-96" y="-400" width="192" height="168" rx="30" fill="#2E3440" stroke="${TRACO}" stroke-width="4"/></g>`;

  // pernas
  if (o.saia) {
    for (const lx of [-26, 26]) s += `<rect x="${lx - 11}" y="-210" width="22" height="196" fill="${pele}" stroke="${TRACO}" stroke-width="4"/>`;
    s += `<path d="M -66 -252 L 66 -252 L 86 -150 L -86 -150 Z" fill="${o.saia}" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/>`;
    for (const lx of [-30, 30]) s += `<ellipse cx="${lx}" cy="-10" rx="26" ry="12" fill="#3A2A22" stroke="${TRACO}" stroke-width="4"/>`;
  } else {
    for (const [lx, k] of [[-28, anda], [28, -anda]]) {
      const dy = Math.max(0, k) * -14;
      s += `<rect x="${lx - 22}" y="-250" width="44" height="${232 + dy}" fill="${roupa.calca}" stroke="${TRACO}" stroke-width="4"/>`;
      s += `<g transform="translate(0 ${dy})"><path d="M ${lx - 30} -6 Q ${lx - 32} -32 ${lx - 6} -32 L ${lx + 18} -30 Q ${lx + 40} -26 ${lx + 38} -6 Z" fill="#F6F6F4" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/>` +
        `<rect x="${lx - 30}" y="-10" width="68" height="8" rx="4" fill="#B9BCC2" stroke="${TRACO}" stroke-width="3"/></g>`;
    }
  }

  // tronco + braços + cabeça sobem/descem com a respiração
  let corpo = '';
  const ombroD = [62, -386], ombroE = [-62, -386];
  const pd = pose.d, pe = pose.e || pose.d.map(([x, y]) => [-x, y]);
  const pdAnim = o.pose === 'acena' ? [pd[0], [pd[1][0] + Math.sin(t * 9) * 22, pd[1][1]]] : pd;
  const manga = roupa.manga || roupa.camisa;

  // braço esquerdo atrás se estiver baixo, senão na frente
  corpo += `<path d="M -70 -400 Q -76 -398 -76 -384 L -70 -238 L 70 -238 L 76 -384 Q 76 -398 70 -400 Z" fill="${roupa.camisa}" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/>`;
  if (o.saia) corpo += `<rect x="-70" y="-256" width="140" height="18" fill="${roupa.camisa}" stroke="${TRACO}" stroke-width="4"/>`;
  else corpo += `<rect x="-72" y="-256" width="144" height="18" fill="${roupa.calca}" stroke="${TRACO}" stroke-width="4"/>`;
  if (roupa.uniforme) {
    corpo += `<path d="M -26 -401 L 0 -370 L 26 -401" fill="none" stroke="#2A4A8E" stroke-width="7" stroke-linejoin="round"/>` +
      `<circle cx="36" cy="-362" r="10" fill="#2A5FB0" stroke="${TRACO}" stroke-width="3"/>`;
  }
  if (o.avental) {
    corpo += `<path d="M -50 -380 L 50 -380 L 56 -170 L -56 -170 Z" fill="${o.avental}" stroke="${TRACO}" stroke-width="4" stroke-linejoin="round"/>` +
      `<rect x="-26" y="-300" width="52" height="40" rx="6" fill="none" stroke="${TRACO}" stroke-width="3" opacity="0.6"/>`;
  }
  if (o.mochila) {
    corpo += `<path d="M -54 -398 L -48 -260" stroke="${TRACO}" stroke-width="17" stroke-linecap="round"/><path d="M -54 -398 L -48 -260" stroke="#3B4252" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M 54 -398 L 48 -260" stroke="${TRACO}" stroke-width="17" stroke-linecap="round"/><path d="M 54 -398 L 48 -260" stroke="#3B4252" stroke-width="10" stroke-linecap="round"/>`;
  }
  if (o.cracha) {
    corpo += `<path d="M -26 -400 L 0 -320 L 26 -400" fill="none" stroke="#1F4FA0" stroke-width="5"/>` +
      `<rect x="-16" y="-322" width="32" height="40" rx="4" fill="#fff" stroke="${TRACO}" stroke-width="3"/><rect x="-10" y="-314" width="20" height="10" fill="#7FA6D8"/>`;
  }
  if (o.segura) corpo += `<g transform="translate(0 -300)">${o.segura}</g>`;
  corpo += braco(ombroE, pe[0], pe[1], manga, pele, roupa.mangaLonga);
  corpo += braco(ombroD, pdAnim[0], pdAnim[1], manga, pele, roupa.mangaLonga);
  if (o.naMao) corpo += `<g transform="translate(${pdAnim[1][0]} ${pdAnim[1][1]})">${o.naMao}</g>`;

  // cabeça
  let cabeca = '';
  cabeca += cabeloAtras(cab);
  cabeca += `<rect x="-17" y="-436" width="34" height="44" fill="${pele}" stroke="${TRACO}" stroke-width="4"/>`;
  for (const ox of [-98, 98]) cabeca += `<circle cx="${ox}" cy="-516" r="17" fill="${pele}" stroke="${TRACO}" stroke-width="4"/>`;
  if (o.brinco) for (const ox of [-100, 100]) cabeca += `<circle cx="${ox}" cy="-492" r="8" fill="#F2B632" stroke="${TRACO}" stroke-width="3"/>`;
  cabeca += `<circle cx="0" cy="-525" r="100" fill="${pele}" stroke="${TRACO}" stroke-width="4"/>`;
  cabeca += cabeloFrente(cab);
  if (o.chapeu) cabeca += chapeu(o.chapeu.tipo, o.chapeu.cor);
  // rosto
  const by = -553;
  for (const sx of [-1, 1]) {
    cabeca += `<path d="M ${sx * 16} ${by + ex.bi} L ${sx * 58} ${by + ex.be - 4}" stroke="${cab.tipo === 'careca' ? '#2A1E18' : cab.cor}" stroke-width="9" stroke-linecap="round"/>`;
  }
  cabeca += olho(-36, -515, pele, lid, gx, gy, ex.pupila || 9) + olho(36, -515, pele, lid, gx, gy, ex.pupila || 9);
  if (o.oculos) cabeca += `<circle cx="-36" cy="-515" r="29" fill="none" stroke="#3A2E2A" stroke-width="5"/><circle cx="36" cy="-515" r="29" fill="none" stroke="#3A2E2A" stroke-width="5"/><path d="M -7 -518 L 7 -518" stroke="#3A2E2A" stroke-width="5"/>`;
  cabeca += `<path d="M -8 -494 Q 0 -486 8 -494" fill="none" stroke="${TRACO}" stroke-width="4" stroke-linecap="round"/>`;
  const falando = o.fala && Math.sin(t * 17) > 0;
  cabeca += boca(falando ? 'fala' : ex.boca);
  if (o.bigode) cabeca += `<path d="M -34 -476 Q -18 -492 0 -482 Q 18 -492 34 -476 Q 18 -478 0 -474 Q -18 -478 -34 -476 Z" fill="${cab.cor}" stroke="${TRACO}" stroke-width="3"/>`;
  if (o.suor) cabeca += `<path d="M 86 -590 Q 96 -570 86 -560 Q 76 -570 86 -590 Z" fill="#9FD8F5" stroke="${TRACO}" stroke-width="3"/>`;

  s += `<g transform="translate(0 ${resp})">${corpo}${cabeca}</g>`;
  return `<g transform="translate(${o.x} ${o.y}) scale(${esc * (o.vira || 1)} ${esc})" data-p="${id}">${s}</g>`;
}

// ---------- elenco ----------
const UNIFORME = { camisa: '#F5F5F2', calca: '#2B3F78', manga: '#F5F5F2', uniforme: true };

function kevylem(o) {
  return pessoa({ pele: '#8B5A3C', cabelo: { tipo: 'cacheado', cor: '#1E1714' }, roupa: UNIFORME, mochila: true, semente: 3, ...o });
}
function mae(o) {
  return pessoa({ pele: '#8A5A3E', cabelo: { tipo: 'coque', cor: '#2A1C15' }, roupa: { camisa: '#E8796B', calca: '#2F4370' }, saia: '#2F4370', brinco: true, semente: 7, ...o });
}
function diretora(o) {
  return pessoa({ pele: '#E6B997', cabelo: { tipo: 'longo', cor: '#5A3A28' }, roupa: { camisa: '#7B4FB3', calca: '#222' }, saia: '#2A2A30', oculos: true, cracha: true, semente: 11, ...o });
}
function donoCantina(o) {
  return pessoa({ pele: '#D49A72', cabelo: { tipo: 'curto', cor: '#3A2A20' }, roupa: { camisa: '#2F8F5B', calca: '#4A4A50' }, avental: '#FAFAF7', chapeu: { tipo: 'bone', cor: '#D33A2F' }, bigode: true, semente: 13, ...o });
}
function donaCida(o) {
  return pessoa({ pele: '#5E3B25', cabelo: { tipo: 'curto', cor: '#1A1210' }, roupa: { camisa: '#F29A38', calca: '#3A2F5A' }, saia: '#3A2F5A', avental: '#6A2C8A', chapeu: { tipo: 'lenco', cor: '#7B2E9E' }, brinco: true, semente: 17, ...o });
}
function fiscal(o) {
  return pessoa({ pele: '#B57A52', cabelo: { tipo: 'careca', cor: '#2A1E18' }, roupa: { camisa: '#CFE3F2', calca: '#3A3F4A', mangaLonga: true }, avental: '#F28C28', cracha: true, bigode: true, semente: 19, ...o });
}
function prancheta() {
  return `<g transform="rotate(-8)"><rect x="-40" y="-50" width="80" height="104" rx="6" fill="#8A5A3C" stroke="${TRACO}" stroke-width="4"/><rect x="-32" y="-38" width="64" height="84" fill="#fff"/>` +
    [-24, -8, 8, 24].map((y) => `<line x1="-24" y1="${y}" x2="24" y2="${y}" stroke="#AAA" stroke-width="4"/>`).join('') + `<rect x="-14" y="-56" width="28" height="12" rx="3" fill="#888"/></g>`;
}

// Aluno aleatório (mas sempre igual para a mesma semente).
function aluno(semente, o) {
  const r = aleatorio(semente * 97 + 5);
  const tipos = ['cacheado', 'curto', 'rabo', 'black', 'coque', 'raspado', 'tranca', 'longo'];
  const tipo = tipos[Math.floor(r() * tipos.length)];
  const menina = ['rabo', 'coque', 'tranca', 'longo'].includes(tipo);
  return pessoa({
    pele: PELES[Math.floor(r() * PELES.length)],
    cabelo: { tipo, cor: CABELOS[Math.floor(r() * CABELOS.length)] },
    roupa: UNIFORME,
    saia: menina && r() > 0.5 ? '#2B3F78' : undefined,
    mochila: r() > 0.4,
    semente,
    ...o,
  });
}

// ---------- objetos ----------
function geladinho(cor = '#E8434F', x = 0, y = 0, rot = 0, esc = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">` +
    `<rect x="-17" y="-54" width="34" height="100" rx="15" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>` +
    `<rect x="-9" y="-44" width="7" height="70" rx="3.5" fill="#fff" opacity="0.45"/>` +
    `<path d="M -8 -54 Q 0 -72 8 -54" fill="none" stroke="${TRACO}" stroke-width="4"/>` +
    `<path d="M -10 -68 L 10 -60 M -10 -60 L 10 -68" stroke="${TRACO}" stroke-width="4" stroke-linecap="round"/>` +
    `</g>`;
}
const CORES_GELADINHO = ['#E8434F', '#F28C28', '#8E44AD', '#F2C230', '#3BB273', '#E85D9E'];

function isopor(x = 0, y = 0, esc = 1, comGeladinho = true) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  if (comGeladinho) for (let i = 0; i < 5; i++) s += geladinho(CORES_GELADINHO[i], -58 + i * 29, -46, -8 + i * 4, 0.7);
  s += `<rect x="-86" y="-40" width="172" height="96" rx="10" fill="#F4F6F8" stroke="${TRACO}" stroke-width="5"/>` +
    `<rect x="-86" y="-40" width="172" height="22" fill="#3D8DD9" stroke="${TRACO}" stroke-width="5"/>` +
    `<path d="M -40 -8 Q 0 10 40 -8" fill="none" stroke="#C9D1DA" stroke-width="6"/>` +
    `</g>`;
  return s;
}

function pacoteSuco(x, y, cor = '#F28C28', esc = 1, rotulo = 'SUCO') {
  return `<g transform="translate(${x} ${y}) scale(${esc})">` +
    `<rect x="-38" y="-52" width="76" height="104" rx="8" fill="${cor}" stroke="${TRACO}" stroke-width="4"/>` +
    `<rect x="-30" y="-20" width="60" height="30" rx="5" fill="#fff"/>` +
    txt(rotulo, 0, 2, { tam: 18, cor: '#222' }) +
    `<circle cx="0" cy="30" r="10" fill="#fff" opacity="0.6"/>` +
    `</g>`;
}

function saquinhos(x, y, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  for (let i = 3; i >= 0; i--)
    s += `<rect x="${-34 + i * 6}" y="${-56 - i * 6}" width="56" height="108" rx="6" fill="#EAF2FA" stroke="#5E7FA8" stroke-width="3" opacity="0.95"/>`;
  s += `<rect x="-30" y="-10" width="48" height="26" rx="4" fill="#3D6FB6"/>` + txt('100 UN', -6, 9, { tam: 15, cor: '#fff' });
  return s + `</g>`;
}

function moedas(x, y, n = 5) {
  let s = '';
  for (let i = 0; i < n; i++)
    s += `<ellipse cx="${x}" cy="${y - i * 7}" rx="22" ry="8" fill="#E6B437" stroke="#8A6512" stroke-width="3"/>`;
  return s;
}
function moedaSolta(x, y) {
  return `<circle cx="${x}" cy="${y}" r="17" fill="#F2C440" stroke="#8A6512" stroke-width="3"/>` + txt('$', x, y + 7, { tam: 20, cor: '#8A6512' });
}
