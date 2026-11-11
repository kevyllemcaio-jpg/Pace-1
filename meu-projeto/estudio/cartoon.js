// cartoon.js — Kyle adulto (traço grosso, cabeça expressiva) para vídeos em close e corpo inteiro,
// mais a interface genérica de celular (feed, chamada, chat), dedo e o HUD de contagem.
// Personagem original. Usa ik()/capsula()/elipse() de corpo.js.

const TK = '#1F1A24';
const VISUAL_PADRAO = { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#1E1A22', camisa: '#7B4FB3', oculos: true, fone: true, estampa: true };
let VZ = VISUAL_PADRAO;
// Visual do protagonista: padrão (Kyle) < window.VISUAL do episódio < o.visual da chamada.
const usarVisual = (o = {}) => (VZ = { ...VISUAL_PADRAO, ...(window.VISUAL || {}), ...(o.visual || {}) });

// ---------- cabeça (centro em 0,0; ~ 330 x 420) ----------
function kyleCabeca({ expr = 'neutro', t = 0, olhar = [0, 0], suor = false, vergonha = 0, fala = false, semente = 4, barba = true, semDente = false, visual } = {}) {
  usarVisual({ visual });
  const E = {
    neutro: { lid: 0.15, bi: 0, be: 0, boca: 'reta' },
    sono: { lid: 0.55, bi: 6, be: 4, boca: 'reta' },
    feliz: { lid: 0.1, bi: -8, be: -6, boca: 'sorri' },
    sorrisao: { lid: 0.05, bi: -12, be: -10, boca: 'aberta' },
    panico: { lid: 0, bi: -22, be: -16, boca: 'grito', pupila: 9 },
    surpreso: { lid: 0, bi: -20, be: -14, boca: 'o', pupila: 11 },
    vergonha: { lid: 0.25, bi: -12, be: 8, boca: 'onda' },
    determinado: { lid: 0.3, bi: 14, be: -6, boca: 'firme' },
    sonhador: { lid: 0.4, bi: -10, be: -8, boca: 'sorri' },
    triste: { lid: 0.3, bi: -16, be: 10, boca: 'triste' },
    janelinha: { lid: 0.1, bi: -10, be: -6, boca: 'janela' },
    sem_graca: { lid: 0.25, bi: -14, be: 8, boca: 'janela' },
  }[expr] || {};
  const piscar = ((t + semente * 0.73) % 3.8) < 0.11;
  let s = '';
  // orelhas
  for (const l of [-1, 1]) s += `<path d="${elipse(l * 158, 10, 30, 44)}" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/><path d="M ${l * 160} -6 Q ${l * 146} 10 ${l * 160} 28" fill="none" stroke="${TK}" stroke-width="5" opacity="0.5"/>`;
  // rosto
  s += `<path d="M -156 -40 Q -170 -230 0 -236 Q 170 -230 156 -40 Q 160 100 96 160 Q 40 205 0 205 Q -40 205 -96 160 Q -160 100 -156 -40 Z" fill="${VZ.pele}" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>`;
  // barba por fazer (sombra)
  if (barba) {
  s += `<path d="M -138 60 Q -120 160 -40 192 Q 0 204 40 192 Q 120 160 138 60 Q 110 120 60 128 Q 0 138 -60 128 Q -110 120 -138 60 Z" fill="#5E4E58" opacity="0.48"/>`;
  s += `<path d="M -70 108 Q -40 96 0 102 Q 40 96 70 108 Q 40 116 0 112 Q -40 116 -70 108 Z" fill="#5E4E58" opacity="0.5"/>`;
  const r = aleatorio(semente * 11);
  for (let i = 0; i < 120; i++) {
    const a = r() * Math.PI, rr = 120 + r() * 60;
    const x = Math.cos(a) * rr * 0.85, y = 70 + Math.sin(a) * rr * 0.62;
    if (Math.abs(x) < 34 && y < 150) continue;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${TK}" opacity="0.55"/>`;
  }
  }
  // cabelo bagunçado (tufos)
  s += `<path d="M -166 -60 Q -190 -150 -150 -205 Q -170 -250 -110 -262 Q -100 -305 -40 -290 Q -10 -330 40 -300 Q 90 -320 116 -270 Q 175 -270 162 -205 Q 196 -160 166 -60 Q 150 -130 110 -150 Q 120 -110 92 -100 Q 70 -150 30 -158 Q 26 -120 -6 -112 Q -18 -158 -60 -150 Q -66 -110 -100 -104 Q -110 -146 -138 -136 Q -150 -100 -166 -60 Z" fill="${VZ.cabelo}" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<path d="M -90 -250 Q -60 -268 -30 -258 M 30 -276 Q 60 -284 84 -262" fill="none" stroke="#4A4250" stroke-width="7" stroke-linecap="round"/>`;
  // sobrancelhas
  for (const l of [-1, 1]) s += `<path d="M ${l * 22} ${-96 + (E.bi || 0)} Q ${l * 64} ${-118 + ((E.bi || 0) + (E.be || 0)) / 2} ${l * 112} ${-100 + (E.be || 0)}" fill="none" stroke="${VZ.cabelo}" stroke-width="16" stroke-linecap="round"/>`;
  // olhos
  const lid = piscar ? 1 : E.lid || 0;
  for (const l of [-1, 1]) {
    const ex = l * 64, ey = -40;
    s += `<path d="${elipse(ex, ey, 40, 46)}" fill="#fff" stroke="${TK}" stroke-width="7"/>`;
    if (lid < 0.95) {
      const px = ex + olhar[0] * 12, py = ey + 6 + olhar[1] * 10;
      s += `<circle cx="${px}" cy="${py}" r="${E.pupila ? E.pupila + 8 : 20}" fill="#6B4A2E"/><circle cx="${px}" cy="${py}" r="${E.pupila || 11}" fill="${TK}"/><circle cx="${px + 7}" cy="${py - 8}" r="6" fill="#fff"/>`;
    }
    if (lid > 0.02) {
      const ly = ey - 46 + lid * 92;
      s += `<path d="M ${ex - 44} ${ey - 52} L ${ex + 44} ${ey - 52} L ${ex + 44} ${ly} Q ${ex} ${ly + 6} ${ex - 44} ${ly} Z" fill="${VZ.pele2}"/>` +
        `<path d="M ${ex - 42} ${ly} Q ${ex} ${ly + 6} ${ex + 42} ${ly}" fill="none" stroke="${TK}" stroke-width="7" stroke-linecap="round"/>`;
    }
  }
  if (VZ.oculos) {
  // óculos redondos grossos
  for (const l of [-1, 1]) s += `<circle cx="${l * 64}" cy="-38" r="62" fill="#CFEAFF" fill-opacity="0.12" stroke="${TK}" stroke-width="12"/><path d="M ${l * 64 - 34} -72 L ${l * 64 - 16} -84" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.7"/>`;
  s += `<path d="M -4 -44 Q 0 -54 4 -44" fill="none" stroke="${TK}" stroke-width="10"/><path d="M -126 -44 L -158 -30 M 126 -44 L 158 -30" stroke="${TK}" stroke-width="9" stroke-linecap="round"/>`;
  }
  // nariz
  s += `<path d="M -8 10 Q -40 66 -26 82 Q 0 98 26 82 Q 40 66 8 10" fill="${VZ.pele2}" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>`;
  // bochechas
  if (vergonha > 0) for (const l of [-1, 1]) s += `<path d="${elipse(l * 100, 54, 34, 18)}" fill="#F0717F" opacity="${0.45 + 0.4 * vergonha}"/>`;
  // boca
  const my = 136;
  const L = `fill="none" stroke="${TK}" stroke-width="8" stroke-linecap="round"`;
  const b = fala && Math.sin(t * 16) > 0 ? 'fala' : E.boca;
  if (b === 'janela') s += `<path d="M -60 ${my - 12} Q 0 ${my + 40} 60 ${my - 12} Q 0 ${my + 4} -60 ${my - 12} Z" fill="#6E2430" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M -50 ${my - 9} Q 0 ${my + 8} 50 ${my - 9} L 46 ${my + 6} Q 0 ${my + 20} -46 ${my + 6} Z" fill="#fff"/>` + (semDente ? `<rect x="4" y="${my - 6}" width="22" height="22" fill="#3A0E16"/>` : '') + `<path d="M -60 ${my - 12} Q 0 ${my + 40} 60 ${my - 12}" fill="none" stroke="${TK}" stroke-width="8"/>`;
  else if (b === 'sorri') s += `<path d="M -54 ${my - 10} Q 0 ${my + 30} 54 ${my - 10}" ${L}/>`;
  else if (b === 'aberta') s += `<path d="M -66 ${my - 16} Q 0 ${my + 66} 66 ${my - 16} Z" fill="#6E2430" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M -56 ${my - 12} L 56 ${my - 12} L 50 ${my + 6} L -50 ${my + 6} Z" fill="#fff"/>${semDente ? `<rect x="6" y="${my - 13}" width="22" height="20" fill="#3A0E16"/><line x1="6" y1="${my - 13}" x2="6" y2="${my + 6}" stroke="${TK}" stroke-width="3"/><line x1="28" y1="${my - 13}" x2="28" y2="${my + 6}" stroke="${TK}" stroke-width="3"/>` : ''}<path d="${elipse(0, my + 34, 26, 12)}" fill="#E06070"/>`;
  else if (b === 'grito') s += `<path d="M -50 ${my - 18} Q 0 ${my - 26} 50 ${my - 18} Q 56 ${my + 50} 0 ${my + 58} Q -56 ${my + 50} -50 ${my - 18} Z" fill="#6E2430" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M -42 ${my - 16} L 42 ${my - 16} L 38 ${my - 2} L -38 ${my - 2} Z" fill="#fff"/>${semDente ? `<rect x="4" y="${my - 17}" width="18" height="16" fill="#3A0E16"/>` : ''}`;
  else if (b === 'o') s += `<path d="${elipse(0, my + 6, 22, 30)}" fill="#6E2430" stroke="${TK}" stroke-width="8"/>`;
  else if (b === 'onda') s += `<path d="M -46 ${my} Q -23 ${my - 14} 0 ${my} Q 23 ${my + 14} 46 ${my}" ${L}/>`;
  else if (b === 'firme') s += `<path d="M -40 ${my} L 40 ${my - 6}" ${L}/>`;
  else if (b === 'triste') s += `<path d="M -44 ${my + 12} Q 0 ${my - 14} 44 ${my + 12}" ${L}/>`;
  else if (b === 'fala') s += `<path d="${elipse(0, my + 4, 30, 20)}" fill="#6E2430" stroke="${TK}" stroke-width="8"/>`;
  else s += `<path d="M -36 ${my} L 36 ${my}" ${L}/>`;
  if (suor) {
    const k = (t * 0.9) % 1;
    s += `<path d="M 150 ${-150 + k * 60} Q 168 ${-120 + k * 60} 150 ${-100 + k * 60} Q 132 ${-120 + k * 60} 150 ${-150 + k * 60} Z" fill="#8FD3F5" stroke="${TK}" stroke-width="6" opacity="${1 - k * 0.6}"/>` +
      `<path d="M -150 -120 Q -136 -96 -150 -80 Q -164 -96 -150 -120 Z" fill="#8FD3F5" stroke="${TK}" stroke-width="6"/>`;
  }
  return s;
}

// Fone gamer no pescoço + ombros da camiseta (para o close).
function kyleOmbros() {
  return `<path d="M -330 520 Q -320 320 -150 280 L 150 280 Q 320 320 330 520 Z" fill="${VZ.camisa}" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<path d="M -70 270 L 70 270 L 60 300 Q 0 330 -60 300 Z" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>` +
    (VZ.fone ? `<path d="M -150 300 Q 0 380 150 300" fill="none" stroke="#2BA59A" stroke-width="22" stroke-linecap="round"/><path d="M -150 300 Q 0 380 150 300" fill="none" stroke="${TK}" stroke-width="6" stroke-dasharray="0 0" opacity="0.6"/>` +
    [-1, 1].map((l) => `<rect x="${l * 165 - 36}" y="262" width="72" height="92" rx="26" fill="#2BA59A" stroke="${TK}" stroke-width="8"/>`).join('') : '');
}

// Close: cabeça grande centralizada (cx, cy = centro do rosto).
function kyleClose(o) {
  usarVisual(o);
  const esc = o.esc || 1.6;
  const bob = Math.sin((o.t || 0) * 2.2) * 6;
  return `<g transform="translate(${o.x || 540} ${(o.y || 860) + bob}) scale(${esc})">` +
    `<g transform="translate(0 20)">${kyleOmbros()}</g>` +
    `<rect x="-58" y="150" width="116" height="140" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>` +
    kyleCabeca(o) + `</g>`;
}

// ---------- corpo inteiro (pés em x, y; ~ 1000 px de altura com esc = 1) ----------
const POSES_K = {
  base: { maoD: [150, -330], maoE: [-150, -330] },
  celular: { maoD: [40, -520], maoE: [-30, -470] },
  cabeca: { maoD: [140, -860], maoE: [-140, -860] }, // mãos na cabeça (desespero)
  comemora: { maoD: [190, -900], maoE: [-190, -900] },
  aponta: { maoD: [330, -600], maoE: [-150, -330] },
  cintura: { maoD: [120, -380], maoE: [-120, -380] },
};
function kyleCorpo(o) {
  usarVisual(o);
  const t = o.t || 0;
  const pose = { ...POSES_K.base, peD: [70, 0], peE: [-70, 0], agach: 0, ...(POSES_K[o.pose] || {}), ...(o.p || {}) };
  const quadril = [0, -380 + pose.agach];
  const qD = [36, quadril[1]], qE = [-36, quadril[1]];
  const ombroY = quadril[1] - 290 + Math.sin(t * 2.4) * 3;
  const oD = [92, ombroY], oE = [-92, ombroY];
  let s = `<ellipse cx="0" cy="6" rx="150" ry="20" fill="#000" opacity="0.2"/>`;
  // pernas (bermuda + canela)
  for (const [q, p, lado] of [[qE, pose.peE, -1], [qD, pose.peD, 1]]) {
    const [j, pe] = ik(q, p, 200, 190, lado);
    s += `<path d="${capsula(j, [pe[0], pe[1] - 20], 26, 20)}" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>`;
    s += `<path d="${capsula([q[0], q[1] - 10], ponto(q, j, 1.05), 50, 44)}" fill="#3E5C93" stroke="${TK}" stroke-width="8"/>`;
    s += `<path d="M ${pe[0] - 46} ${pe[1] - 2} L ${pe[0] + 52} ${pe[1] - 2} L ${pe[0] + 46} ${pe[1] - 18} L ${pe[0] - 40} ${pe[1] - 18} Z" fill="#2BA59A" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M ${pe[0] - 6} ${pe[1] - 18} L ${pe[0] + 4} ${pe[1] - 40} L ${pe[0] + 18} ${pe[1] - 18}" fill="none" stroke="${TK}" stroke-width="7"/>`;
  }
  // camiseta (com barriguinha) + estampa de controle
  s += `<path d="M ${oE[0] - 10} ${ombroY} Q 0 ${ombroY - 26} ${oD[0] + 10} ${ombroY} L ${oD[0] + 22} ${ombroY + 120} Q ${oD[0] + 30} ${quadril[1] - 60} ${qD[0] + 70} ${quadril[1] + 10} L ${qE[0] - 70} ${quadril[1] + 10} Q ${oE[0] - 30} ${quadril[1] - 60} ${oE[0] - 22} ${ombroY + 120} Z" fill="${VZ.camisa}" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>`;
  if (VZ.estampa) s += `<g transform="translate(0 ${ombroY + 140})"><rect x="-60" y="-26" width="120" height="56" rx="26" fill="#C9B2E6" stroke="${TK}" stroke-width="5"/><path d="M -36 2 L -18 2 M -27 -8 L -27 12" stroke="${TK}" stroke-width="6"/><circle cx="24" cy="-2" r="7" fill="${TK}"/><circle cx="40" cy="8" r="7" fill="${TK}"/></g>`;
  s += `<path d="M -40 ${quadril[1] - 70} Q -20 ${quadril[1] - 60} -10 ${quadril[1] - 74}" fill="none" stroke="#5A3A88" stroke-width="6" stroke-linecap="round"/>`;
  // braços
  for (const [om, mao, lado] of [[oE, pose.maoE, -1], [oD, pose.maoD, 1]]) {
    const [co, ma] = ik(om, mao, 170, 165, lado);
    s += `<path d="${capsula(co, ma, 24, 19)}" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>`;
    s += `<path d="${capsula(om, co, 30, 25)}" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>`;
    s += `<path d="${capsula(om, ponto(om, co, 0.5), 40, 36)}" fill="${VZ.camisa}" stroke="${TK}" stroke-width="8"/>`;
    s += `<path d="${elipse(ma[0], ma[1], 30, 34, angulo(co, ma) - 90)}" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>`;
    if (o.celular && lado === 1) s += `<g transform="translate(${ma[0] - 10} ${ma[1] - 30}) rotate(-10)"><rect x="-26" y="-48" width="52" height="96" rx="10" fill="#22262F" stroke="${TK}" stroke-width="6"/><rect x="-19" y="-38" width="38" height="72" rx="4" fill="#7FC3F0"/></g>`;
  }
  // pescoço, fone e cabeça
  s += `<rect x="-34" y="${ombroY - 80}" width="68" height="90" fill="${VZ.pele}" stroke="${TK}" stroke-width="8"/>`;
  if (VZ.fone) s += `<path d="M -84 ${ombroY - 10} Q 0 ${ombroY + 34} 84 ${ombroY - 10}" fill="none" stroke="#2BA59A" stroke-width="16" stroke-linecap="round"/>` +
    [-1, 1].map((l) => `<rect x="${l * 92 - 22}" y="${ombroY - 40}" width="44" height="56" rx="16" fill="#2BA59A" stroke="${TK}" stroke-width="6"/>`).join('');
  s += `<g transform="translate(0 ${ombroY - 250}) scale(0.82)">${kyleCabeca(o)}</g>`;
  return `<g transform="translate(${o.x} ${o.y}) scale(${(o.esc || 1) * (o.vira || 1)} ${o.esc || 1})">${s}</g>`;
}

// ---------- celular genérico ----------
// tela: 'feed' | 'chamando' | 'perdida' | 'chat'
function celularUI({ x = 540, y = 900, esc: escala = 1, tela = 'chat', nome = 'manu.reis', hora = '2:13', msgs = [], digitando = false, foto = '', curtido = false, online = true } = {}) {
  const W2 = 620, H2 = 1180;
  let s = `<g transform="translate(${x} ${y}) scale(${escala})">`;
  s += `<rect x="${-W2 / 2 - 22}" y="${-H2 / 2 - 22}" width="${W2 + 44}" height="${H2 + 44}" rx="84" fill="#15131A" stroke="#000" stroke-width="6"/>`;
  s += `<rect x="${-W2 / 2}" y="${-H2 / 2}" width="${W2}" height="${H2}" rx="66" fill="#FFFFFF"/>`;
  s += `<rect x="-90" y="${-H2 / 2 + 18}" width="180" height="40" rx="20" fill="#15131A"/>`;
  s += `<text x="${-W2 / 2 + 56}" y="${-H2 / 2 + 50}" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#111">${hora}</text>`;
  const topo = -H2 / 2 + 90;
  const avatar = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E8A87C"/><path d="M ${cx - r} ${cy} Q ${cx - r} ${cy - r * 1.2} ${cx} ${cy - r} Q ${cx + r} ${cy - r * 1.2} ${cx + r} ${cy} Q ${cx + r * 0.6} ${cy - r * 0.4} ${cx} ${cy - r * 0.5} Q ${cx - r * 0.6} ${cy - r * 0.4} ${cx - r} ${cy} Z" fill="#5A2E1E"/>`;
  if (tela === 'feed') {
    s += `<text x="0" y="${topo + 20}" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#111">Publicações</text>`;
    s += avatar(-W2 / 2 + 60, topo + 80, 30) + `<text x="${-W2 / 2 + 104}" y="${topo + 74}" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#111">${nome}</text><text x="${-W2 / 2 + 104}" y="${topo + 104}" font-family="Oswald, sans-serif" font-size="22" fill="#777">Lisboa, Portugal</text>`;
    s += `<svg x="${-W2 / 2}" y="${topo + 130}" width="${W2}" height="560" overflow="hidden">${foto}</svg>`;
    const yy = topo + 720;
    s += `<path d="M ${-W2 / 2 + 50} ${yy} c -20 -26 -56 -6 -40 20 l 40 34 l 40 -34 c 16 -26 -20 -46 -40 -20 Z" fill="${curtido ? '#E8344B' : 'none'}" stroke="${curtido ? '#E8344B' : '#111'}" stroke-width="6" transform="translate(20 -10)"/>`;
    s += `<circle cx="${-W2 / 2 + 160}" cy="${yy + 6}" r="24" fill="none" stroke="#111" stroke-width="6"/><path d="M ${-W2 / 2 + 220} ${yy + 24} L ${-W2 / 2 + 270} ${yy - 20} L ${-W2 / 2 + 236} ${yy + 4} Z" fill="none" stroke="#111" stroke-width="6" stroke-linejoin="round"/>`;
    s += `<text x="${-W2 / 2 + 30}" y="${yy + 80}" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#111">${curtido ? 213 : 212} curtidas</text>`;
    s += `<text x="${-W2 / 2 + 30}" y="${yy + 122}" font-family="Oswald, sans-serif" font-size="26" fill="#111"><tspan font-weight="700">${nome}</tspan> primeiro pôr do sol em Lisboa ☀️</text>`;
    // botão de chamada de vídeo no topo (que ele aperta sem querer)
    s += `<g transform="translate(${W2 / 2 - 70} ${topo + 76})"><rect x="-26" y="-18" width="38" height="36" rx="8" fill="none" stroke="#111" stroke-width="5"/><path d="M 12 -8 L 30 -18 L 30 18 L 12 8 Z" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/></g>`;
  } else if (tela === 'chamando' || tela === 'perdida') {
    s += `<rect x="${-W2 / 2}" y="${-H2 / 2}" width="${W2}" height="${H2}" rx="66" fill="#2B2440"/>`;
    s += avatar(0, -150, 110);
    s += `<text x="0" y="20" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="46" fill="#fff">${nome}</text>`;
    s += `<text x="0" y="74" text-anchor="middle" font-family="Oswald, sans-serif" font-size="34" fill="${tela === 'perdida' ? '#FF7A7A' : '#B9B0D9'}">${tela === 'perdida' ? 'Chamada de vídeo não atendida' : 'Chamada de vídeo...'}</text>`;
    if (tela === 'chamando') s += `<circle cx="0" cy="400" r="66" fill="#E8344B"/><path d="M -34 400 Q 0 380 34 400" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  } else {
    s += `<path d="M ${-W2 / 2 + 40} ${topo + 30} L ${-W2 / 2 + 26} ${topo + 46} L ${-W2 / 2 + 40} ${topo + 62}" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>`;
    s += avatar(-W2 / 2 + 100, topo + 46, 30) + `<text x="${-W2 / 2 + 146}" y="${topo + 40}" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#111">${nome}</text>` +
      `<text x="${-W2 / 2 + 146}" y="${topo + 72}" font-family="Oswald, sans-serif" font-size="22" fill="${digitando ? '#2FA45A' : '#2FA45A'}">${digitando ? 'digitando...' : online ? 'online' : ''}</text>`;
    s += `<line x1="${-W2 / 2}" y1="${topo + 100}" x2="${W2 / 2}" y2="${topo + 100}" stroke="#EEE" stroke-width="3"/>`;
    let yy = H2 / 2 - 150 - msgs.length * 92;
    for (const m of msgs) {
      const eu = m.de === 'eu';
      const w = Math.min(470, m.txt.length * 15 + 60);
      const bx = eu ? W2 / 2 - 30 - w : -W2 / 2 + 30;
      s += `<rect x="${bx}" y="${yy}" width="${w}" height="70" rx="26" fill="${eu ? '#2D7FF9' : '#EFEFF4'}"/>` +
        `<text x="${bx + 28}" y="${yy + 45}" font-family="Oswald, sans-serif" font-size="27" fill="${eu ? '#fff' : '#111'}">${esc(m.txt)}</text>`;
      yy += 92;
    }
    s += `<rect x="${-W2 / 2 + 26}" y="${H2 / 2 - 110}" width="${W2 - 120}" height="62" rx="31" fill="#F2F2F6"/><text x="${-W2 / 2 + 56}" y="${H2 / 2 - 70}" font-family="Oswald, sans-serif" font-size="26" fill="#999">Mensagem...</text>` +
      `<circle cx="${W2 / 2 - 56}" cy="${H2 / 2 - 79}" r="31" fill="#2D7FF9"/><path d="M ${W2 / 2 - 70} ${H2 / 2 - 79} L ${W2 / 2 - 42} ${H2 / 2 - 79} M ${W2 / 2 - 54} ${H2 / 2 - 91} L ${W2 / 2 - 42} ${H2 / 2 - 79} L ${W2 / 2 - 54} ${H2 / 2 - 67}" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return s + `</g>`;
}
// Dedo (vem de baixo e toca em x, y).
function dedo(x, y, k = 1) {
  usarVisual();
  const yy = mix(2100, y, k);
  return `<g transform="translate(${x} ${yy}) rotate(-8)"><path d="M -56 600 L -56 60 Q -56 -10 0 -10 Q 56 -10 56 60 L 56 600 Z" fill="${VZ.pele}" stroke="${TK}" stroke-width="9"/><path d="M -34 10 Q 0 -4 34 10 L 30 50 Q 0 62 -30 50 Z" fill="#F6D5C2" stroke="${TK}" stroke-width="5"/><path d="M -30 150 Q 0 162 30 150" fill="none" stroke="${TK}" stroke-width="5" opacity="0.5"/></g>`;
}
// Fundo escuro com círculos (telas de celular).
function fundoTela() {
  return `<rect width="1080" height="1920" fill="#16203A"/><circle cx="160" cy="300" r="260" fill="#1D2A4A"/><circle cx="960" cy="1600" r="320" fill="#1D2A4A"/>`;
}
// Quarto desfocado (fundo dos closes).
function quartoDesfocado(t, noite = true) {
  return `<defs><filter id="desfoque"><feGaussianBlur stdDeviation="14"/></filter></defs><g filter="url(#desfoque)">${quarto(t, { cartazLinhas: [['2015', '#C33A3A'], ['3º B', '#2A2A2A']] })}</g>` +
    (noite ? `<rect width="1080" height="1920" fill="#0E1430" opacity="0.35"/>` : '');
}
// HUD: FALTAM N DIAS + barra "PARECIDO COM 2015".
function hudReencontro(dias, pct, lt, novo = false) {
  const g = `<rect x="70" y="100" width="250" height="110" rx="18" fill="#15131A" stroke="#fff" stroke-width="4"/>` +
    `<text x="195" y="140" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="24" fill="#fff">FALTAM</text>` +
    `<text x="195" y="190" text-anchor="middle" font-family="Anton, sans-serif" font-size="52" fill="#F7C531">${dias} DIAS</text>` +
    `<rect x="340" y="100" width="670" height="110" rx="18" fill="#15131A" stroke="#fff" stroke-width="4"/>` +
    `<text x="370" y="140" font-family="Oswald, sans-serif" font-weight="700" font-size="24" fill="#fff">PARECIDO COM O KYLE DE 2015</text>` +
    `<rect x="370" y="160" width="520" height="22" rx="11" fill="#33303D"/><rect x="370" y="160" width="${Math.max(22, 520 * pct / 100)}" height="22" rx="11" fill="#E8344B"/>` +
    `<text x="985" y="190" text-anchor="end" font-family="Anton, sans-serif" font-size="48" fill="#E8344B">${pct}%</text>`;
  return pulo(g, lt + (novo ? 0 : 10), 540, 155, 0.1);
}
