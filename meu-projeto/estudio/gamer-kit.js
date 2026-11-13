// gamer-kit.js — peças do formato "missão avatar" (personagens originais: Tavinho, Carol, Tio Beto):
// quarto gamer bagunçado, cards de item/status, card do duo, checklist, perfis "nunca viu",
// holofote com o avatar, espelho, câmera de selfie, galeria, chat com áudio, calendário,
// banner de missão, saldo/parecido e a votação final em tela dividida.

const GK = '#1F1A24';
const tituloCard = (x, y, w, titulo, tag, cor = '#F7C531') =>
  `<text x="${x + 24}" y="${y + 46}" font-family="Baloo, sans-serif" font-weight="800" font-size="34" fill="${cor}">${esc(titulo)}</text>` +
  (tag ? `<text x="${x + w - 24}" y="${y + 44}" text-anchor="end" font-family="Oswald, sans-serif" font-weight="700" font-size="22" fill="#AEB4C2" letter-spacing="1">${esc(tag)}</text>` : '');

// Quarto gamer à noite (corpo inteiro na frente).
function quartoGamer(t, { luz = 1 } = {}) {
  let s = `<rect width="1080" height="1920" fill="#3A3E5C"/>`;
  s += `<rect width="1080" height="1240" fill="#454A6E"/><rect y="1240" width="1080" height="680" fill="#4A4038"/>`;
  for (let i = 0; i < 14; i++) s += `<line x1="${-200 + i * 120}" y1="1920" x2="${300 + i * 50}" y2="1240" stroke="#3A322C" stroke-width="5"/>`;
  // janela com lua
  s += `<rect x="620" y="160" width="300" height="380" fill="#141A3A" stroke="${GK}" stroke-width="10"/><line x1="770" y1="160" x2="770" y2="540" stroke="${GK}" stroke-width="8"/><line x1="620" y1="350" x2="920" y2="350" stroke="${GK}" stroke-width="8"/>`;
  s += `<path d="M 840 220 a 40 40 0 1 0 30 70 a 32 32 0 1 1 -30 -70 Z" fill="#F4F0D8"/>`;
  for (let i = 0; i < 10; i++) { const r = aleatorio(i + 3); s += `<circle cx="${630 + r() * 280}" cy="${170 + r() * 360}" r="2.5" fill="#fff" opacity="0.7"/>`; }
  s += `<path d="M 570 130 Q 610 360 580 590 L 640 590 Q 650 360 620 130 Z" fill="#6A6A9A" stroke="${GK}" stroke-width="6"/><path d="M 920 130 Q 950 360 920 590 L 980 590 Q 990 360 960 130 Z" fill="#6A6A9A" stroke="${GK}" stroke-width="6"/><rect x="560" y="120" width="440" height="16" rx="8" fill="#3A3A4A"/>`;
  // pôster rasgado e estante
  s += `<g transform="translate(150 260) rotate(-4)"><rect x="-110" y="-150" width="220" height="300" fill="#5A7AB0" stroke="${GK}" stroke-width="7"/><path d="M -60 -80 L 0 -120 L 60 -80 L 40 60 L -40 60 Z" fill="#8AB0E0" stroke="${GK}" stroke-width="5"/><path d="M 110 100 L 70 150 L 110 150 Z" fill="#454A6E"/></g>`;
  s += `<rect x="330" y="300" width="230" height="20" fill="#6A4A30" stroke="${GK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${340 + i * 40}" y="${230 + (i % 2) * 10}" width="30" height="${70 - (i % 2) * 10}" fill="${['#C84A3A', '#3A7AC8', '#E8B83A', '#4AA05A', '#8A5AC8'][i]}" stroke="${GK}" stroke-width="4"/>`).join('');
  // mesa, PC com RGB e monitor
  s += `<rect x="460" y="820" width="560" height="30" fill="#6A4A30" stroke="${GK}" stroke-width="7"/><rect x="480" y="850" width="24" height="380" fill="#4A3220" stroke="${GK}" stroke-width="6"/><rect x="980" y="850" width="24" height="380" fill="#4A3220" stroke="${GK}" stroke-width="6"/>`;
  s += `<rect x="560" y="600" width="300" height="200" rx="10" fill="#1A1C22" stroke="${GK}" stroke-width="8"/><rect x="576" y="616" width="268" height="168" fill="#2A3A6A"/><rect x="690" y="800" width="40" height="22" fill="#1A1C22"/>`;
  s += `<rect x="880" y="560" width="120" height="260" rx="8" fill="#1A1C22" stroke="${GK}" stroke-width="7"/>`;
  const hue = (t * 120) % 360;
  s += `<rect x="896" y="580" width="12" height="220" fill="hsl(${hue},90%,60%)" opacity="${0.8 * luz}"/><circle cx="950" cy="640" r="28" fill="none" stroke="hsl(${(hue + 120) % 360},90%,60%)" stroke-width="8" opacity="${0.8 * luz}"/><circle cx="950" cy="730" r="28" fill="none" stroke="hsl(${(hue + 240) % 360},90%,60%)" stroke-width="8" opacity="${0.8 * luz}"/>`;
  // cama bagunçada (esquerda)
  s += `<rect x="-40" y="1010" width="380" height="240" rx="20" fill="#2E4A80" stroke="${GK}" stroke-width="8"/><path d="M -40 1040 Q 120 980 340 1050 L 340 1120 Q 160 1080 -40 1110 Z" fill="#3A5A9A" stroke="${GK}" stroke-width="6"/><path d="M 40 1060 Q 160 1100 260 1050 Q 220 1140 120 1130 Z" fill="#5A7A5A" stroke="${GK}" stroke-width="6"/><rect x="-40" y="900" width="60" height="350" fill="#5A3E2A" stroke="${GK}" stroke-width="7"/>`;
  // cadeira de escritório azul
  s += `<path d="M 640 860 Q 640 790 700 790 L 790 790 Q 850 790 850 860 L 840 1010 L 650 1010 Z" fill="#2E4A80" stroke="${GK}" stroke-width="8"/><rect x="630" y="1010" width="230" height="40" rx="14" fill="#2A3E6A" stroke="${GK}" stroke-width="7"/><rect x="730" y="1050" width="30" height="110" fill="#1A1C22"/><path d="M 640 1170 L 850 1170 M 745 1160 L 745 1200" stroke="#1A1C22" stroke-width="14" stroke-linecap="round"/><circle cx="650" cy="1200" r="14" fill="#1A1C22"/><circle cx="840" cy="1200" r="14" fill="#1A1C22"/>`;
  // bagunça pesada: manchas, roupas, pizzas, latinhas, papéis, pratos, meias, salgadinhos, garrafas, saco de lixo, fios
  s += quartoBagunca(t);
  s += `<rect width="1080" height="1920" fill="#101430" opacity="${0.25 + (1 - luz) * 0.4}"/>`;
  return s;
}
function quartoBagunca(t) {
  let s = '';
  const r = aleatorio(77);
  // manchas no chão
  for (let i = 0; i < 9; i++) s += `<ellipse cx="${r() * 1080}" cy="${1300 + r() * 600}" rx="${40 + r() * 70}" ry="${12 + r() * 20}" fill="#2A2420" opacity="0.35"/>`;
  // em cima da mesa: latinhas empilhadas, copos, pacote de salgadinho, papéis
  for (let i = 0; i < 7; i++) { const x = 480 + i * 22 + (i > 3 ? 300 : 0), c = ['#C83A3A', '#3A7AC8', '#3AA05A', '#E8B83A'][i % 4]; s += `<rect x="${x}" y="${770 - (i % 2) * 6}" width="20" height="48" rx="5" fill="${c}" stroke="${GK}" stroke-width="4"/>`; }
  s += `<rect x="455" y="740" width="70" height="80" rx="8" fill="#F2F0E8" stroke="${GK}" stroke-width="5"/><path d="M 455 760 L 525 760" stroke="#C88A50" stroke-width="8"/>`;
  s += `<path d="M 900 800 L 1000 800 L 990 760 L 910 750 Z" fill="#E86A2A" stroke="${GK}" stroke-width="5"/><text x="950" y="790" text-anchor="middle" font-family="Anton, sans-serif" font-size="22" fill="#FFE07A">CHIPS</text>`;
  // roupa pendurada na cadeira e na estante
  s += `<path d="M 650 800 Q 700 760 760 790 L 780 900 Q 720 930 660 880 Z" fill="#C85A5A" stroke="${GK}" stroke-width="6"/><path d="M 400 320 Q 430 380 410 450 L 440 450 Q 460 380 440 320 Z" fill="#E8D8A0" stroke="${GK}" stroke-width="5"/>`;
  // cama: lençol revirado e roupas em cima
  s += `<path d="M 30 1000 Q 120 950 200 1010 Q 160 1050 60 1040 Z" fill="#8A6AB8" stroke="${GK}" stroke-width="6"/><path d="M 180 990 Q 260 960 320 1010 L 300 1050 Q 240 1030 190 1040 Z" fill="#E8E0D0" stroke="${GK}" stroke-width="6"/>`;
  // pilhas de roupa no chão
  for (const [x, y, k, c1, c2] of [[150, 1500, 1.2, '#5A7A5A', '#3A5A3A'], [960, 1470, 1.0, '#3A5A9A', '#2A3E6A'], [420, 1760, 0.9, '#8A5A3A', '#6A3E22'], [80, 1820, 1.1, '#C85A5A', '#9A3A3A'], [880, 1800, 1.0, '#6A6A7A', '#4A4A5A'], [300, 1350, 0.8, '#E8C870', '#C8A040']]) s += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M -130 20 Q -110 -60 -20 -50 Q 40 -90 110 -40 Q 150 0 120 30 Q 0 50 -130 20 Z" fill="${c1}" stroke="${GK}" stroke-width="6"/><path d="M -60 -30 Q 0 -10 50 -40 M -20 10 Q 40 20 90 -10" fill="none" stroke="${c2}" stroke-width="7"/><path d="M 80 20 L 150 60 L 130 80 L 70 40 Z" fill="${c1}" stroke="${GK}" stroke-width="5"/></g>`;
  // caixas de pizza (uma aberta com fatia e mosca)
  s += `<g transform="translate(860 1590) rotate(-8)"><rect x="-140" y="-30" width="280" height="64" fill="#D8B888" stroke="${GK}" stroke-width="6"/><path d="M -140 -30 L -70 -120 L 200 -110 L 140 -30 Z" fill="#E8C898" stroke="${GK}" stroke-width="6"/><path d="M -80 -10 L 40 -20 L -10 20 Z" fill="#F2C060" stroke="${GK}" stroke-width="5"/><circle cx="-20" cy="-6" r="8" fill="#C8503A"/></g>`;
  s += `<g transform="translate(240 1680) rotate(10)"><rect x="-120" y="-24" width="240" height="48" fill="#D8B888" stroke="${GK}" stroke-width="6"/><rect x="-110" y="-56" width="220" height="40" fill="#C8A878" stroke="${GK}" stroke-width="5"/><circle cx="0" cy="-36" r="14" fill="#C8503A" opacity="0.6"/></g>`;
  // prato sujo com moscas
  s += `<ellipse cx="620" cy="1860" rx="90" ry="28" fill="#E8E8F0" stroke="${GK}" stroke-width="6"/><ellipse cx="610" cy="1856" rx="40" ry="12" fill="#B87A3A" opacity="0.8"/>` + [0, 1, 2].map((i) => { const a = t * (4 + i) + i * 2; return `<circle cx="${620 + Math.cos(a) * 60}" cy="${1800 + Math.sin(a * 1.4) * 26}" r="6" fill="${GK}"/>`; }).join('');
  // latinhas espalhadas (deitadas e amassadas)
  for (let i = 0; i < 14; i++) { const x = 40 + r() * 1000, y = 1320 + r() * 580, c = ['#C83A3A', '#3A7AC8', '#3AA05A', '#E8B83A', '#B0B0C0'][i % 5], rot = r() * 180; s += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-18" y="-34" width="36" height="68" rx="7" fill="${c}" stroke="${GK}" stroke-width="5"/><rect x="-18" y="-34" width="36" height="10" fill="#D8D8E0" stroke="${GK}" stroke-width="3"/></g>`; }
  // papéis amassados, meias, salgadinhos, garrafas
  for (let i = 0; i < 12; i++) { const x = r() * 1080, y = 1300 + r() * 600; const k = 0.8 + r() * 0.6; s += `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r() * 360})"><path d="M -20 -6 L -12 -20 L 4 -16 L 18 -22 L 22 -4 L 16 12 L 2 20 L -14 16 L -22 4 Z" fill="#F2F0E8" stroke="${GK}" stroke-width="4" stroke-linejoin="round"/><path d="M -12 -8 L 2 2 L -4 14 M 2 2 L 14 -6" fill="none" stroke="#9A988C" stroke-width="3"/></g>`; }
  for (const [x, y, rot] of [[700, 1700, 30], [990, 1700, -40], [40, 1400, 60]]) s += `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M -10 -50 L 14 -50 L 14 10 Q 14 30 40 30 L 40 50 Q -10 50 -10 10 Z" fill="#F2F0E8" stroke="${GK}" stroke-width="5"/><rect x="-10" y="-50" width="24" height="12" fill="#C83A3A"/></g>`;
  for (const [x, y, rot] of [[520, 1500, -30], [1010, 1880, 20]]) s += `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M -40 -30 L 40 -30 L 46 30 L -46 30 Z" fill="#E86A2A" stroke="${GK}" stroke-width="5"/><circle cx="-60" cy="20" r="9" fill="#F2B040" stroke="${GK}" stroke-width="3"/><circle cx="-80" cy="34" r="8" fill="#F2B040" stroke="${GK}" stroke-width="3"/></g>`;
  for (const [x, y, rot] of [[380, 1880, 75], [760, 1420, -70]]) s += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-16" y="-60" width="32" height="110" rx="10" fill="#7AC8A8" stroke="${GK}" stroke-width="5" opacity="0.9"/><rect x="-8" y="-80" width="16" height="22" fill="#3A7A5A" stroke="${GK}" stroke-width="4"/></g>`;
  // saco de lixo cheio no canto
  s += `<g transform="translate(1010 1300)"><path d="M -90 120 Q -110 0 -50 -50 L -20 -90 L 20 -90 L 50 -50 Q 110 0 90 120 Z" fill="#22262E" stroke="${GK}" stroke-width="7"/><path d="M -20 -90 L -30 -120 M 20 -90 L 34 -118" stroke="#22262E" stroke-width="10" stroke-linecap="round"/><path d="M -40 0 Q -20 40 -40 90" stroke="#4A4E58" stroke-width="6" fill="none"/></g>`;
  // fios enrolados
  s += `<path d="M 900 1230 Q 860 1400 700 1440 Q 560 1480 600 1600 Q 640 1700 500 1720 Q 380 1740 420 1820" fill="none" stroke="#1A1C22" stroke-width="7"/><path d="M 960 1230 Q 1040 1500 900 1700" fill="none" stroke="#1A1C22" stroke-width="6"/><rect x="410" y="1810" width="40" height="26" rx="4" fill="#E8E8F0" stroke="${GK}" stroke-width="4"/>`;
  // livros caídos
  s += `<g transform="translate(560 1330) rotate(-12)"><rect x="-60" y="-14" width="120" height="28" fill="#3A7AC8" stroke="${GK}" stroke-width="5"/><rect x="-50" y="-40" width="110" height="26" fill="#C84A3A" stroke="${GK}" stroke-width="5" transform="rotate(8)"/></g>`;
  return s;
}
const quartoGamerBorrado = (t) => fundoCache('qgb', t, (tt) => `<defs><filter id="qgbF"><feGaussianBlur stdDeviation="12"/></filter></defs><g filter="url(#qgbF)">${quartoGamer(tt)}</g><rect width="1080" height="1920" fill="#0E1430" opacity="0.3"/>`);
const fundoEscuro = () => `<rect width="1080" height="1920" fill="#14182A"/><circle cx="160" cy="300" r="260" fill="#1A2036"/><circle cx="960" cy="1600" r="320" fill="#1A2036"/>`;

// Card de item/status (canto superior esquerdo). linhas: [[rotulo, valor, cor]]
function cartaItem(lt, t0, { titulo, tag = 'COMUM', linhas = [], x = 50, y = 110, w = 520, carimbo: car } = {}) {
  if (lt < t0) return '';
  som('pop', t0, 0.8);
  const h = 76 + linhas.length * 44;
  let g = `<rect x="${x + 6}" y="${y + 8}" width="${w}" height="${h}" rx="18" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#141826" stroke="#F7C531" stroke-width="5"/>`;
  g += tituloCard(x, y, w, titulo, tag);
  linhas.forEach(([r, v, cor], i) => (g += `<text x="${x + 24}" y="${y + 100 + i * 44}" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#E8EAF2">${esc(r)}</text><text x="${x + w - 24}" y="${y + 100 + i * 44}" text-anchor="end" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="${cor || '#FF5A6A'}">${esc(v)}</text>`));
  if (car) g += `<g transform="translate(${x + w / 2} ${y + h + 10}) rotate(-6)"><rect x="-200" y="-24" width="400" height="48" rx="8" fill="#D7262B" opacity="0.9"/><text x="0" y="12" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#fff">${esc(car)}</text></g>`;
  return pulo(g, lt, x + w / 2, y + h / 2, t0, 0.3);
}
// Tela de vitória do jogo.
function telaVitoria(lt, { chat = [] } = {}) {
  let s = fundoEscuro() + `<g transform="translate(540 820)"><rect x="-300" y="-560" width="600" height="${chat.length ? 1060 : 860}" rx="40" fill="#1E1E6A" stroke="#5A6AFF" stroke-width="8"/>`;
  for (let i = 0; i < 30; i++) { const r = aleatorio(i + 9); s += `<rect x="${-280 + r() * 560}" y="${-540 + r() * 820}" width="5" height="5" fill="${['#FF5AA0', '#5AE0FF', '#FFE05A'][i % 3]}" opacity="${0.4 + 0.6 * Math.abs(Math.sin(lt * 3 + i))}"/>`; }
  s += `<text x="0" y="-480" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#C8D0FF">PARTIDA #0812</text>`;
  const k = 1 + 0.06 * Math.sin(lt * 4);
  s += `<g transform="translate(0 -360) scale(${k})"><path d="M -300 -50 L 300 -50 L 270 0 L 300 50 L -300 50 L -270 0 Z" fill="#F7C531" stroke="${GK}" stroke-width="6"/><text x="0" y="24" text-anchor="middle" font-family="Anton, sans-serif" font-size="80" fill="#D7262B" stroke="#7A0E14" stroke-width="3" letter-spacing="4">VITÓRIA</text></g>`;
  s += `<g transform="translate(0 -170)"><path d="M -70 -80 L 70 -80 L 60 0 Q 0 60 -60 0 Z" fill="#F7C531" stroke="${GK}" stroke-width="7"/><rect x="-14" y="30" width="28" height="50" fill="#E8A820"/><rect x="-60" y="78" width="120" height="26" fill="#C88A10" stroke="${GK}" stroke-width="5"/></g>`;
  s += `<rect x="-200" y="-30" width="400" height="20" rx="10" fill="#3A3A8A"/><rect x="-200" y="-30" width="${360 * lim(lt / 1.2)}" height="20" rx="10" fill="#5AE0FF"/><text x="0" y="40" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#FFE05A">+250 XP</text>`;
  if (chat.length) {
    s += `<text x="-260" y="140" font-family="Oswald, sans-serif" font-weight="700" font-size="24" fill="#8A90C8">CHAT DA PARTIDA</text>`;
    chat.forEach(([n, t, c], i) => (s += `<text x="-260" y="${190 + i * 44}" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="${c}">${esc(n)}: <tspan fill="#E8EAF2" font-weight="400">${esc(t)}</tspan></text>`));
  }
  return s + `</g>`;
}
// Card "SEU DUO".
function cardDuo(lt, t0, { tempo = '1 ANO', partidas = '812' } = {}) {
  if (lt < t0) return '';
  const g = `<rect x="70" y="110" width="940" height="330" rx="24" fill="#141826" stroke="#5AE0FF" stroke-width="5"/>` +
    `<text x="540" y="168" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="40" fill="#5AE0FF">SEU DUO</text>` +
    `<circle cx="330" cy="250" r="46" fill="#2A3A6A" stroke="#fff" stroke-width="4"/><path d="M 300 240 L 360 240 M 330 220 L 330 270" stroke="#fff" stroke-width="10"/><text x="330" y="330" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#fff">TAVINHO</text>` +
    `<text x="540" y="268" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#fff">+</text>` +
    `<circle cx="750" cy="250" r="46" fill="#6A2A6A" stroke="#fff" stroke-width="4"/><text x="750" y="270" text-anchor="middle" font-family="Anton, sans-serif" font-size="60" fill="#FF8AD0">?</text><text x="750" y="330" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#FF8AD0">CAROL</text>` +
    `<text x="110" y="400" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#AEB4C2">JUNTOS HÁ <tspan fill="#F7C531">${tempo}</tspan>   ·   PARTIDAS <tspan fill="#F7C531">${partidas}</tspan></text>`;
  som('pop', t0, 0.8);
  return pulo(g, lt, 540, 275, t0, 0.3);
}
// Checklist "ELA CONHECE:".
function checklist(lt, itens, tempos) {
  let g = `<rect x="50" y="110" width="560" height="${90 + itens.length * 66}" rx="20" fill="#141826" stroke="#FF8AD0" stroke-width="5"/><text x="80" y="164" font-family="Baloo, sans-serif" font-weight="800" font-size="36" fill="#FF8AD0">ELA CONHECE:</text>`;
  itens.forEach((it, i) => {
    if (lt < tempos[i]) return;
    som('pop', tempos[i], 0.7);
    g += `<rect x="80" y="${190 + i * 66}" width="500" height="54" rx="10" fill="#22283A"/><text x="100" y="${227 + i * 66}" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#fff">${esc(it)}</text><path d="M 530 ${214 + i * 66} l 14 14 l 26 -30" fill="none" stroke="#4AE07A" stroke-width="9" stroke-linecap="round"/>`;
  });
  return g;
}
// Perfis "nunca viu".
function perfisNunca(lt, t0, t1) {
  const perfil = (x, nome, cor, carimbo) => `<g transform="translate(${x} 900)"><rect x="-190" y="-220" width="380" height="440" rx="24" fill="#141826" stroke="${cor}" stroke-width="6"/><text x="0" y="-160" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="40" fill="${cor}">${nome}</text>` +
    `<circle cx="0" cy="-30" r="80" fill="#2A3048"/><path d="M -130 160 Q -130 60 0 60 Q 130 60 130 160 Z" fill="#2A3048"/><text x="0" y="0" text-anchor="middle" font-family="Anton, sans-serif" font-size="110" fill="${cor}">?</text>` +
    (carimbo ? `<g transform="rotate(-14)"><rect x="-180" y="-30" width="360" height="60" fill="none" stroke="#FF3A4A" stroke-width="6"/><text x="0" y="14" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#FF3A4A">NUNCA VIU</text></g>` : '') + `</g>`;
  let s = fundoEscuro();
  s += perfil(300, 'TAVINHO', '#5AE0FF', lt > t0) + perfil(780, 'CAROL', '#FF8AD0', lt > t1);
  if (lt > t0) som('carimbo', t0, 0.8);
  if (lt > t1) som('carimbo', t1, 0.8);
  return s;
}
// Holofote no fundo escuro.
function holofote(lt, conteudo = '', { cor = '#FFF6D0' } = {}) {
  let s = `<rect width="1080" height="1920" fill="#120E2A"/>`;
  for (let i = 0; i < 40; i++) { const r = aleatorio(i + 7); s += `<circle cx="${r() * 1080}" cy="${r() * 1920}" r="${1 + r() * 2}" fill="#fff" opacity="${0.2 + 0.5 * Math.abs(Math.sin(lt + i))}"/>`; }
  s += `<polygon points="470,0 610,0 900,1640 180,1640" fill="${cor}" opacity="0.85"/><ellipse cx="540" cy="1640" rx="360" ry="60" fill="${cor}" opacity="0.9"/><ellipse cx="540" cy="1640" rx="380" ry="70" fill="none" stroke="#9A8AFF" stroke-width="6"/>`;
  return s + conteudo;
}
// Avatar herói (corpo inteiro): base kyleCorpo arrumado + armadura com brilho.
const AVATAR = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#2A1E18', camisa: '#22306A', oculos: false, fone: false, estampa: false, penteado: 'arrumado', bone: false, sujo: false, olheira: false, rasgado: false };
function avatarHeroi(x, y, esc, t, o = {}) {
  let s = kyleCorpo({ x, y, esc, t, expr: o.expr || 'feliz', barba: false, pose: o.pose || 'cintura', visual: AVATAR });
  const sy = y - 670 * esc;
  s += `<g transform="translate(${x} ${sy}) scale(${esc})">` + [-1, 1].map((l) => `<path d="M ${l * 60} -20 Q ${l * 170} -60 ${l * 190} 40 Q ${l * 150} 70 ${l * 80} 50 Z" fill="#3A4A9A" stroke="${GK}" stroke-width="8"/><path d="M ${l * 90} 0 Q ${l * 150} -20 ${l * 170} 30" fill="none" stroke="#5AE0FF" stroke-width="6"/>`).join('') +
    `<path d="M -70 120 L 0 200 L 70 120" fill="none" stroke="#5AE0FF" stroke-width="8"/><path d="M -80 260 L 80 260" stroke="#5AE0FF" stroke-width="6" opacity="0.8"/></g>`;
  return s;
}
// Etiqueta com ✓ apontando para uma parte do avatar.
function tagCheck(lt, t0, x, y, texto) {
  if (lt < t0) return '';
  som('pop', t0, 0.7);
  const w = texto.length * 17 + 80;
  return pulo(`<rect x="${x - w / 2}" y="${y - 32}" width="${w}" height="64" rx="12" fill="#F7C531" stroke="${GK}" stroke-width="5"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="${GK}">${esc(texto)} ✓</text>`, lt, x, y, t0);
}
// Espelho com moldura de madeira.
function espelho(conteudo) {
  return `<rect width="1080" height="1920" fill="#2A2E44"/><rect x="120" y="180" width="840" height="1460" rx="40" fill="#C8A060" stroke="${GK}" stroke-width="12"/><rect x="160" y="220" width="760" height="1380" rx="24" fill="#8AA0B8"/>` +
    `<defs><clipPath id="espC"><rect x="160" y="220" width="760" height="1380" rx="24"/></clipPath></defs><g clip-path="url(#espC)">${conteudo}<rect x="160" y="220" width="760" height="1380" fill="#B8D0E8" opacity="0.15"/><path d="M 220 300 L 420 240 M 240 380 L 520 280" stroke="#fff" stroke-width="14" opacity="0.25"/></g>`;
}
// Câmera de selfie.
function camSelfie(lt, conteudo, n) {
  return `<rect width="1080" height="1920" fill="#000"/><text x="540" y="150" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="44" fill="#fff">FOTO ${n}/30</text>` +
    `<defs><clipPath id="selC"><rect x="70" y="200" width="940" height="1300"/></clipPath></defs><g clip-path="url(#selC)">${conteudo}</g>` +
    `<circle cx="540" cy="1660" r="80" fill="none" stroke="#fff" stroke-width="10"/><circle cx="540" cy="1660" r="62" fill="#fff"/>` + (Math.abs(lt % 0.6) < 0.06 ? `<rect width="1080" height="1920" fill="#fff" opacity="0.5"/>` : '');
}
// Galeria 3x3 de rostos (o destaque é o "melhor").
function galeria(lt, rostos, destaque = 5) {
  let s = `<rect width="1080" height="1920" fill="#0E0E14"/><text x="540" y="220" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="48" fill="#fff">GALERIA</text>`;
  rostos.forEach((r, i) => {
    const x = 90 + (i % 3) * 310, y = 300 + Math.floor(i / 3) * 400;
    s += `<defs><clipPath id="gal${i}"><rect x="${x}" y="${y}" width="280" height="370"/></clipPath></defs><rect x="${x}" y="${y}" width="280" height="370" fill="#3A3E5C"/><g clip-path="url(#gal${i})">${r}</g>`;
    if (i === destaque && lt > 1) s += `<rect x="${x - 6}" y="${y - 6}" width="292" height="382" fill="none" stroke="#F7C531" stroke-width="12"/>`;
  });
  return s;
}
// Chat estilo app de mensagens (verde). msgs: [{ eu, txt, foto, audio, coracao }]
function chatApp(lt, { nome, sub = 'online', cor = '#FF8AD0', msgs = [], digitando = '', y0 } = {}) {
  let s = fundoEscuro() + `<g transform="translate(540 960)"><rect x="-340" y="-700" width="680" height="1400" rx="60" fill="#0E0F14" stroke="#000" stroke-width="10"/><rect x="-316" y="-676" width="632" height="1352" rx="44" fill="#ECE5DD"/>`;
  s += `<rect x="-316" y="-676" width="632" height="150" rx="44" fill="#1F7A6A"/><rect x="-316" y="-580" width="632" height="54" fill="#1F7A6A"/><circle cx="-220" cy="-590" r="36" fill="${cor}"/><text x="-170" y="-598" font-family="Oswald, sans-serif" font-weight="700" font-size="36" fill="#fff">${esc(nome)}</text><text x="-170" y="-560" font-family="Oswald, sans-serif" font-size="24" fill="#CFEFE6">${esc(digitando ? 'digitando...' : sub)}</text>`;
  let y = y0 ?? (520 - msgs.reduce((a, m) => a + (m.foto ? 300 : m.audio ? 110 : m.coracao ? 110 : 40 + Math.ceil(m.txt.length / 22) * 40) + 20, 0));
  for (const m of msgs) {
    const x0 = m.eu ? 290 : -290;
    if (m.foto) { s += `<g transform="translate(${m.eu ? 160 : -160} ${y + 140})"><rect x="-120" y="-140" width="240" height="280" rx="14" fill="#fff"/><defs><clipPath id="fc${y | 0}"><rect x="-110" y="-130" width="220" height="260" rx="10"/></clipPath></defs><g clip-path="url(#fc${y | 0})"><rect x="-110" y="-130" width="220" height="260" fill="#3A3E5C"/>${m.foto}</g></g>`; y += 300; continue; }
    if (m.audio) { const w = 420; const bx = m.eu ? x0 - w : x0; s += `<rect x="${bx}" y="${y}" width="${w}" height="90" rx="20" fill="#fff"/><circle cx="${bx + 50}" cy="${y + 45}" r="24" fill="#1F7A6A"/><path d="M ${bx + 42} ${y + 32} L ${bx + 62} ${y + 45} L ${bx + 42} ${y + 58} Z" fill="#fff"/>` + Array.from({ length: 22 }, (_, i) => `<rect x="${bx + 90 + i * 13}" y="${y + 45 - (6 + ((i * 37) % 22))}" width="7" height="${12 + ((i * 37) % 22) * 2}" rx="3" fill="${i / 22 < (m.prog || 0) ? '#1F7A6A' : '#9AB0A8'}"/>`).join('') + `<text x="${bx + w - 20}" y="${y + 82}" text-anchor="end" font-family="Oswald, sans-serif" font-size="20" fill="#7A8A84">${m.audio}</text>`; y += 110; continue; }
    if (m.coracao) { s += `<path d="M ${-250} ${y + 30} c -30 -40 -90 -10 -60 40 l 60 50 l 60 -50 c 30 -50 -30 -80 -60 -40 Z" fill="#E8344B"/>`; y += 110; continue; }
    const linhas = []; let at = '';
    for (const w of m.txt.split(' ')) { if ((at + ' ' + w).trim().length > 22 && at) { linhas.push(at); at = w; } else at = (at + ' ' + w).trim(); }
    linhas.push(at);
    const w = Math.min(460, Math.max(...linhas.map((l) => l.length)) * 17 + 50), h = 30 + linhas.length * 40, bx = m.eu ? x0 - w : x0;
    s += `<rect x="${bx}" y="${y}" width="${w}" height="${h}" rx="18" fill="${m.eu ? '#D8F8C8' : '#FFFFFF'}"/>`;
    linhas.forEach((l, i) => (s += `<text x="${bx + 22}" y="${y + 44 + i * 40}" font-family="Oswald, sans-serif" font-size="32" fill="#111">${esc(l)}</text>`));
    if (m.riscado) s += `<line x1="${bx}" y1="${y + h / 2}" x2="${bx + w}" y2="${y + h / 2}" stroke="#D7262B" stroke-width="6"/>`;
    y += h + 20;
  }
  s += `<rect x="-300" y="560" width="520" height="70" rx="35" fill="#fff"/><text x="-270" y="606" font-family="Oswald, sans-serif" font-size="30" fill="${digitando ? '#111' : '#999'}">${esc(digitando || 'Mensagem')}</text><circle cx="270" cy="595" r="36" fill="#1F7A6A"/>`;
  return s + `</g>`;
}
// Calendário "30 DIAS" + lâmpada.
function calendario(lt, dias) {
  return `<g transform="translate(300 300) rotate(-4)"><rect x="-120" y="-120" width="240" height="250" rx="20" fill="#fff" stroke="${GK}" stroke-width="8"/><rect x="-120" y="-120" width="240" height="70" rx="20" fill="#D7262B" stroke="${GK}" stroke-width="8"/><text x="0" y="-70" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="40" fill="#fff">DIAS</text><text x="0" y="90" text-anchor="middle" font-family="Anton, sans-serif" font-size="130" fill="${GK}">${dias}</text></g>` +
    `<g transform="translate(300 560)"><circle r="${50 + 6 * Math.sin(lt * 6)}" fill="#FFF07A" opacity="0.5"/><circle r="40" fill="#FFF07A" stroke="${GK}" stroke-width="6"/><rect x="-18" y="36" width="36" height="30" fill="#AAA" stroke="${GK}" stroke-width="5"/></g>`;
}
// Banner "NOVA MISSÃO" + card do objetivo.
function missao(lt, t0, t1) {
  let s = '';
  if (lt > t0) { som('ding', t0, 0.8); s += pulo(`<path d="M 120 100 L 960 100 L 1000 160 L 960 220 L 120 220 Z" fill="#F7C531" stroke="${GK}" stroke-width="7"/><text x="540" y="182" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="${GK}">NOVA MISSÃO!</text>`, lt, 540, 160, t0); }
  if (lt > t1) s += pulo(`<rect x="80" y="250" width="920" height="200" rx="20" fill="#141826" stroke="#F7C531" stroke-width="5"/><text x="120" y="320" font-family="Baloo, sans-serif" font-weight="800" font-size="44" fill="#F7C531">FICAR IGUAL AO</text><text x="120" y="375" font-family="Baloo, sans-serif" font-weight="800" font-size="44" fill="#F7C531">PRÓPRIO AVATAR</text><rect x="120" y="398" width="30" height="30" fill="none" stroke="#fff" stroke-width="4"/><text x="166" y="424" font-family="Oswald, sans-serif" font-size="28" fill="#fff">0/1</text>` + `<g transform="translate(900 430) scale(0.13)">${heroiCorpo(0, 0, 1, lt)}</g>`, lt, 540, 350, t1);
  return s;
}
// Saldo + barra "parecido com o avatar".
function cardSaldo(lt, valor, pct = null) {
  let g = `<rect x="70" y="110" width="660" height="${pct === null ? 120 : 210}" rx="22" fill="#141826" stroke="#5AE0FF" stroke-width="5"/><circle cx="130" cy="170" r="30" fill="#F7C531" stroke="${GK}" stroke-width="5"/><text x="130" y="184" text-anchor="middle" font-family="Anton, sans-serif" font-size="38" fill="${GK}">$</text><text x="180" y="184" font-family="Oswald, sans-serif" font-weight="700" font-size="40" fill="#fff">SALDO</text><text x="700" y="186" text-anchor="end" font-family="Anton, sans-serif" font-size="54" fill="#F7C531">${valor}</text>`;
  if (pct !== null) g += `<text x="110" y="262" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#fff">PARECIDO COM O AVATAR</text><rect x="110" y="282" width="580" height="22" rx="11" fill="#33303D"/><rect x="110" y="282" width="${Math.max(22, (580 * pct) / 100)}" height="22" rx="11" fill="#E8344B"/>`;
  return g;
}
// Votação final em tela dividida.
function votoDividido(lt, rostoA, rostoB) {
  let s = `<rect width="1080" height="1920" fill="#F2862A"/><polygon points="0,0 600,0 460,1920 0,1920" fill="#138A9A"/>`;
  s += `<rect x="70" y="150" width="940" height="74" rx="16" fill="#0E1018" stroke="#fff" stroke-width="5"/><text x="110" y="200" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#5AE0FF">MISSÃO: AVATAR</text><text x="560" y="200" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#F7C531">30 DIAS</text><text x="980" y="200" text-anchor="end" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#FF7A8A">2% PARECIDO</text>`;
  s += `<rect x="220" y="270" width="640" height="90" rx="45" fill="#0E1018" stroke="#fff" stroke-width="5"/><text x="540" y="332" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="56" fill="#fff">COMENTA AÍ 👇</text>`;
  const lado = (x, txt, custo, rosto, t0) => pulo(`<text x="${x}" y="520" text-anchor="middle" font-family="Anton, sans-serif" font-size="130" fill="#fff" stroke="${GK}" stroke-width="12" paint-order="stroke">${txt}</text>` +
    `<rect x="${x - 150}" y="560" width="300" height="60" rx="12" fill="${GK}"/><text x="${x}" y="602" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#F7C531">${custo}</text>` +
    `<circle cx="${x}" cy="860" r="190" fill="#fff" stroke="${GK}" stroke-width="10"/><defs><clipPath id="vc${x}"><circle cx="${x}" cy="860" r="180"/></clipPath></defs><g clip-path="url(#vc${x})"><rect x="${x - 190}" y="670" width="380" height="380" fill="#BFE8FF"/>${rosto}</g>`, lt, x, 700, t0);
  s += lado(275, 'DENTE', 'CUSTA 3 DIAS', rostoA, 0.2) + lado(805, 'CABELO', 'CUSTA 2 DIAS', rostoB, 0.45);
  s += `<circle cx="540" cy="760" r="56" fill="${GK}" stroke="#fff" stroke-width="6"/><text x="540" y="780" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="48" fill="#fff">OU</text>`;
  return s;
}
// Balão "COMENTA".
function balaoComenta(lt, t0) {
  if (lt < t0) return '';
  return pulo(`<rect x="60" y="440" width="400" height="290" rx="24" fill="#fff" stroke="${GK}" stroke-width="7"/><text x="260" y="530" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="60" fill="${GK}">COMENTA</text><text x="260" y="610" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#D7262B">"EU"</text><path d="M 140 730 L 120 790 L 200 730 Z" fill="#fff" stroke="${GK}" stroke-width="7"/><rect x="90" y="650" width="340" height="50" rx="25" fill="#EEE"/><text x="110" y="684" font-family="Oswald, sans-serif" font-size="24" fill="#999">Adicionar comentário...</text>`, lt, 260, 580, t0);
}
