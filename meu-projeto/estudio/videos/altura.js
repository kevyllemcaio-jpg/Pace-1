// SHORT: "E se a sua altura dobrasse todo dia?"
// Altura inicial 1,75 m. Dia N = 1,75 × 2^N.
//   Dia 1  = 3,5 m        Dia 3  = 14 m (prédio de 4 andares)
//   Dia 9  = 896 m        (Burj Khalifa: 828 m)
//   Dia 13 = 14,3 km      (aviões voam a ~10 km)
//   Dia 23 = 14.680 km    (diâmetro da Terra: 12.742 km)
//   Dia 28 = 469.762 km   (distância da Lua: 384.400 km)

const ALTURA_INICIAL = 1.75;
const alturaNoDia = (d) => ALTURA_INICIAL * 2 ** d;

// ---------- elementos de cenário ----------

function predio4Andares(x, w, h) {
  const topo = CHAO - h;
  const andar = h / 4;
  let s = `<rect x="${x}" y="${topo}" width="${w}" height="${h}" fill="#D86F4E" stroke="#1A1A1A" stroke-width="6"/>`;
  s += `<rect x="${x - 15}" y="${topo - 25}" width="${w + 30}" height="30" fill="#A84E34" stroke="#1A1A1A" stroke-width="6"/>`;
  for (let a = 0; a < 4; a++) {
    const y = topo + a * andar + andar * 0.22;
    for (let j = 0; j < 3; j++) {
      const jx = x + w * (0.12 + j * 0.29);
      if (a === 3 && j === 1) continue; // porta no térreo
      s += `<rect x="${jx}" y="${y}" width="${w * 0.18}" height="${andar * 0.5}" fill="#BFE6FF" stroke="#1A1A1A" stroke-width="5"/>`;
    }
  }
  s += `<rect x="${x + w * 0.41}" y="${CHAO - andar * 0.62}" width="${w * 0.18}" height="${andar * 0.62}" fill="#5A3A22" stroke="#1A1A1A" stroke-width="5"/>`;
  return s;
}

function carro(x, y, w) {
  const h = w * 0.33;
  return (
    `<g stroke="#1A1A1A" stroke-width="5" stroke-linejoin="round">` +
    `<path d="M${x},${y + h * 0.45} L${x + w * 0.2},${y + h * 0.4} L${x + w * 0.33},${y} L${x + w * 0.72},${y} L${x + w * 0.85},${y + h * 0.4} L${x + w},${y + h * 0.5} L${x + w},${y + h * 0.85} L${x},${y + h * 0.85} Z" fill="#E23B3B"/>` +
    `<path d="M${x + w * 0.37},${y + h * 0.1} L${x + w * 0.5},${y + h * 0.1} L${x + w * 0.5},${y + h * 0.38} L${x + w * 0.28},${y + h * 0.38} Z" fill="#BFE6FF"/>` +
    `<path d="M${x + w * 0.55},${y + h * 0.1} L${x + w * 0.69},${y + h * 0.1} L${x + w * 0.78},${y + h * 0.38} L${x + w * 0.55},${y + h * 0.38} Z" fill="#BFE6FF"/>` +
    `<circle cx="${x + w * 0.22}" cy="${y + h * 0.85}" r="${h * 0.22}" fill="#2B2B2B"/>` +
    `<circle cx="${x + w * 0.78}" cy="${y + h * 0.85}" r="${h * 0.22}" fill="#2B2B2B"/>` +
    `</g>`
  );
}

function torreGigante(cx, h) {
  // Arranha-céu em degraus, afinando até a ponta.
  const k = h / 952;
  const pontos = [
    [-60, 0], [-50, -200], [-35, -200], [-30, -400], [-20, -400], [-15, -600], [-8, -600], [-5, -780],
    [-2, -780], [-1, -952], [1, -952], [2, -780], [5, -780], [8, -600], [15, -600], [20, -400],
    [30, -400], [35, -200], [50, -200], [60, 0],
  ];
  const d = pontos.map(([x, y], i) => `${i ? 'L' : 'M'}${cx + x * k * 1.1},${CHAO + y * k}`).join(' ') + ' Z';
  return `<path d="${d}" fill="#C9D2E0" stroke="#1A1A1A" stroke-width="5" stroke-linejoin="round"/>`;
}

criarVideo([
  cenaAbertura({
    pergunta: ['E SE A SUA *ALTURA*', '*DOBRASSE* TODO DIA?'],
    tamanho: 86,
    desenhar: (lt) =>
      gradiente('aberturaAlt', [[0, '#FFB703'], [1, '#FB5607']]) +
      skyline(4, '#9E3A12', 120, 320, false) +
      `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#5C1F08"/>` +
      personagem({ x: 540, y: CHAO, h: 980, expr: 'chocado', pose: 'maosRosto', t: lt }),
  }),
  {
    // Dia 0
    dur: 4,
    valor: alturaNoDia(0),
    dia: 0,
    legenda: ['Hoje você tem', '*1,75 m*. Tudo normal.'],
    desenhar: (lt) =>
      paredeListrada(0, CHAO, '#F3E2BD', '#EBD6AA') +
      `<rect x="860" y="560" width="170" height="150" fill="#8FD3FF" stroke="#1A1A1A" stroke-width="8"/>` +
      `<path d="M868,702 L930,630 L975,680 L1000,650 L1022,702 Z" fill="#4CAF50"/>` +
      porta(90, CHAO - 768, 293, 768) +
      piso() +
      personagem({ x: 680, y: CHAO, h: 640, expr: 'feliz', t: lt }),
  },
  {
    // Dia 1 — atravessa o teto
    dur: 3.5,
    dia: 1,
    valor: alturaNoDia(1),
    legenda: ['Você já', '*atravessa o teto*.'],
    desenhar: (lt) => {
      const teto = CHAO - 2.6 * 300; // pé-direito de 2,6 m
      const tremor = lt < 0.5 ? Math.sin(lt * 90) * 14 * (1 - lt / 0.5) : 0;
      let entulho = '';
      const r = aleatorio(5);
      for (let i = 0; i < 9; i++) {
        const x = 340 + r() * 500;
        const y = teto + 10 + ((lt * 1.3) % 1.6) ** 2 * 300 + r() * 120;
        const tam = 14 + r() * 22;
        entulho += `<rect x="${x}" y="${y}" width="${tam}" height="${tam * 0.7}" fill="#BDB4A5" stroke="#1A1A1A" stroke-width="4" transform="rotate(${lt * 200 + i * 40} ${x} ${y})"/>`;
      }
      return (
        `<g transform="translate(${tremor} 0)">` +
        `<rect width="${W}" height="${teto}" fill="#CFE3D3"/>` +
        `<rect x="70" y="${teto - 150}" width="70" height="115" fill="#C0643D" stroke="#1A1A1A" stroke-width="5"/>` +
        `<circle cx="105" cy="${teto - 185}" r="55" fill="#4CAF50" stroke="#1A1A1A" stroke-width="5"/>` +
        paredeListrada(teto, CHAO, '#F3E2BD', '#EBD6AA') +
        porta(40, CHAO - 630, 240, 630) +
        piso() +
        personagem({ x: 600, y: CHAO, h: 1050, expr: 'dor', t: lt }) +
        `<path d="M0,${teto - 70} L330,${teto - 70} L305,${teto - 45} L340,${teto - 22} L318,${teto} L0,${teto} Z" fill="#A89F92" stroke="#1A1A1A" stroke-width="6" stroke-linejoin="round"/>` +
        `<path d="M${W},${teto - 70} L870,${teto - 70} L895,${teto - 48} L858,${teto - 25} L884,${teto} L${W},${teto} Z" fill="#A89F92" stroke="#1A1A1A" stroke-width="6" stroke-linejoin="round"/>` +
        entulho +
        `</g>`
      );
    },
  },
  {
    // Dia 3 — prédio de 4 andares
    dur: 3.5,
    dia: 3,
    valor: alturaNoDia(3),
    legenda: ['Do tamanho de um', '*prédio de 4 andares*.'],
    desenhar: (lt) =>
      gradiente('ceu3', [[0, '#5DB7F5'], [1, '#D4F0FF']]) +
      nuvem(80 + lt * 15, 520, 1.2) +
      nuvem(820 - lt * 10, 640, 0.9) +
      skyline(7, '#A9C9E3', 150, 420, false) +
      predio4Andares(50, 360, 957) +
      `<rect y="${CHAO}" width="${W}" height="45" fill="#BDBDBD"/>` +
      `<rect y="${CHAO + 45}" width="${W}" height="${H - CHAO}" fill="#3B3B42"/>` +
      personagem({ x: 760, y: CHAO, h: 1030, expr: 'surpreso', t: lt }) +
      carro(80 + lt * 60, 1440, 330),
  },
  {
    // Dia 9 — maior que o maior prédio do mundo
    dur: 3.5,
    dia: 9,
    valor: alturaNoDia(9),
    legenda: ['Mais alto que o', '*maior prédio do mundo*.'],
    estiloLegenda: { tamanho: 70 },
    desenhar: (lt) =>
      gradiente('ceu9', [[0, '#2B2A6B'], [0.55, '#C85A8A'], [0.85, '#FFB36B']]) +
      skyline(11, '#3B3563', 30, 180, true) +
      torreGigante(290, 952) +
      texto(['828 m'], { x: 290, y: 520, tamanho: 46 }) +
      `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#2A2440"/>` +
      personagem({ x: 760, y: CHAO, h: 1030, expr: 'confiante', pose: 'aponta', espelhar: true, t: lt }),
  },
  {
    // Dia 13 — aviões na altura do nariz
    dur: 3.5,
    dia: 13,
    valor: alturaNoDia(13),
    legenda: ['Aviões passam na', 'altura do *seu nariz*.'],
    desenhar: (lt) =>
      gradiente('ceu13', [[0, '#06122E'], [0.45, '#1F4E9A'], [0.8, '#7FC3F2'], [1, '#BFE6FF']]) +
      `<ellipse cx="540" cy="${CHAO + 2200}" rx="2600" ry="2200" fill="#3E8E4F"/>` +
      nuvem(-20, 1430, 1.1, 0.8) +
      nuvem(820, 1410, 1.3, 0.8) +
      personagem({ x: 600, y: CHAO, h: 1030, expr: 'surpreso', t: lt }) +
      nuvem(300 - lt * 20, 1440, 1.4) +
      nuvem(700 + lt * 20, 1460, 1.1) +
      aviao(-220 + (lt / 3.5) * 1550, 790, 1.25),
  },
  {
    // Dia 23 — maior que a Terra
    dur: 3.5,
    dia: 23,
    valor: alturaNoDia(23),
    legenda: ['Você fica *maior*', '*que a Terra inteira*.'],
    desenhar: (lt) =>
      espaco(3) +
      terra(330, 1060, 390, 0.05 * lt) +
      personagem({ x: 790, y: CHAO, h: 900, expr: 'confiante', t: lt }),
  },
  {
    // Dia 28 — passa da Lua
    dur: 3.5,
    dia: 28,
    valor: alturaNoDia(28),
    legenda: ['Sua cabeça', '*passa da Lua*.'],
    desenhar: (lt) => {
      const pxPorKm = 1000 / 469762;
      const yLua = CHAO - 384400 * pxPorKm;
      return (
        espaco(9) +
        `<line x1="640" y1="${CHAO}" x2="330" y2="${yLua}" stroke="#fff" stroke-width="3" stroke-dasharray="10 12" opacity="0.6"/>` +
        `<circle cx="330" cy="${yLua}" r="13" fill="#D7D7D7" stroke="#1A1A1A" stroke-width="3"/>` +
        texto(['Lua'], { x: 330, y: yLua - 32, tamanho: 46 }) +
        personagem({ x: 640, y: CHAO - 14, h: 1000, expr: 'surpreso', pose: 'aponta', espelhar: true, t: lt }) +
        `<circle cx="640" cy="${CHAO + 4}" r="18" fill="#2D78D2" stroke="#1A1A1A" stroke-width="3"/>` +
        texto(['Terra'], { x: 640, y: CHAO + 75, tamanho: 46 })
      );
    },
  },
  {
    // A física discorda
    dur: 5.5,
    cabecalho: (lt) =>
      aparecer(texto(['MAS A FÍSICA', '*DISCORDA!*'], { y: 190, tamanho: 110 }), lt, 540, 200) +
      aparecer(texto(['Altura *×2* → Peso *×8*'], { y: 450, tamanho: 60 }), lt, 540, 430, 0.6) +
      aparecer(texto(['Ossos: só *×4* mais fortes'], { y: 530, tamanho: 50 }), lt, 540, 515, 1.0),
    legenda: ['Lá pelo *dia 3*,', 'seus ossos *quebrariam*', 'com o próprio peso.'],
    estiloLegenda: { y: 1650, tamanho: 64 },
    desenhar: (lt) =>
      `<defs><radialGradient id="fisica" cx="0.5" cy="0.55" r="0.75"><stop offset="0" stop-color="#8A1A1A"/><stop offset="1" stop-color="#250404"/></radialGradient></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#fisica)"/>` +
      `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#1A0303"/>` +
      personagem({ x: 540, y: CHAO, h: 720, expr: 'preocupado', t: lt, tremer: lt > 1.6 ? 4 : 0, rachado: lt > 1.6 }) +
      (lt > 1.6 ? aparecer(`<g transform="rotate(-12 860 1150)">${texto(['CRACK!'], { x: 860, y: 1150, tamanho: 72, destaque: '#FF5A5A' })}</g>`, lt, 860, 1130, 1.6) : ''),
  },
  cenaFinalIA(),
]);
