// KYLE — Episódio 1: A CARTA
// Série no estilo "turma chibi": personagens com contorno de adesivo, fundos vermelho/azul na diagonal,
// fonte arredondada. Gancho no 1º quadro.
//
// História: Kyle (16) escreve uma carta de 3 páginas pra Lara, coloca no armário errado (do Rafa, camisa 7),
// e o Rafa lê no microfone do intervalo. O baile é daqui a 30 dias: ele promete chegar irreconhecível.
// Dia 1 = pele. Votação: A corta o cabelo / B troca os óculos.

window.FONTE_LEGENDA = "Baloo, sans-serif";
const E = [];
const CARTAZ_KYLE = [['NÃO', '#2A2238'], ['DESISTA', '#C33A3A'], ['❤', '#E24B6A']];
const quartoKyle = (t, o = {}) => quarto(t, { cartazLinhas: CARTAZ_KYLE, ...o });

// ---------- cenários deste episódio ----------
function armarios(t) {
  let s = `<rect width="1080" height="1920" fill="#E9E3F2"/>`;
  s += `<rect y="1450" width="1080" height="470" fill="#B9B0C9"/>`;
  for (let i = 0; i < 6; i++) {
    const x = 20 + i * 175, cor = ['#4A90E2', '#5A9FE8'][i % 2];
    s += `<rect x="${x}" y="420" width="165" height="1030" rx="10" fill="${cor}" stroke="#2A2238" stroke-width="6"/>`;
    s += [480, 500, 520].map((y) => `<rect x="${x + 40}" y="${y}" width="85" height="8" rx="4" fill="#2A2238" opacity="0.35"/>`).join('');
    s += `<rect x="${x + 130}" y="880" width="14" height="60" rx="6" fill="#D9DEE6" stroke="#2A2238" stroke-width="4"/>`;
    s += `<text x="${x + 82}" y="640" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="54" fill="#fff" opacity="0.85">${[14, 15, 16, 17, 18, 19][i]}</text>`;
  }
  return s;
}
function palco(t) {
  let s = patio(t, { cantina: false });
  s += `<rect x="560" y="1080" width="440" height="140" rx="10" fill="#7A4E32" stroke="#2A2238" stroke-width="6"/>`;
  s += `<rect x="760" y="900" width="10" height="180" fill="#555"/><ellipse cx="765" cy="1078" rx="40" ry="10" fill="#555"/>`;
  s += `<rect x="742" y="860" width="46" height="60" rx="20" fill="#333" stroke="#2A2238" stroke-width="5"/>`;
  for (const x of [120, 960]) s += `<rect x="${x - 50}" y="380" width="100" height="160" rx="12" fill="#2A2238"/><circle cx="${x}" cy="430" r="28" fill="#555"/><circle cx="${x}" cy="500" r="20" fill="#555"/>`;
  return s;
}
function carta(x, y, rot = 0, esc = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})"><rect x="-55" y="-70" width="110" height="140" rx="6" fill="#FFF8EE" stroke="#2A2238" stroke-width="5"/>` +
    [-40, -20, 0, 20, 40].map((ly) => `<line x1="-38" y1="${ly}" x2="38" y2="${ly}" stroke="#B9B0C9" stroke-width="4"/>`).join('') +
    `<path d="M 0 -48 C -16 -64 -34 -44 0 -24 C 34 -44 16 -64 0 -48 Z" fill="#E24B6A"/></g>`;
}
function contador(dia, faltam, lt, novo = false) {
  const g = `<rect x="140" y="100" width="800" height="96" rx="48" fill="#1E1A2B" stroke="#0E0B16" stroke-width="5"/>` +
    `<text x="250" y="166" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="50" fill="#F7C531">DIA ${dia}</text>` +
    `<line x1="370" y1="122" x2="370" y2="176" stroke="#ffffff" stroke-width="3" opacity="0.3"/>` +
    `<text x="655" y="166" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="46" fill="#fff">💃 FALTAM ${faltam} DIAS</text>`;
  return pulo(g, lt + (novo ? 0 : 10), 540, 148, 0.1);
}
function balaoRed(lt, t0, { x, y, texto, tam = 46, ponta = 'baixo' }) {
  som('bolha', t0, 0.6);
  if (lt < t0) return '';
  const w = texto.length * tam * 0.52 + 80, h = tam * 1.9;
  const px = ponta === 'esq' ? -w / 2 + 60 : ponta === 'dir' ? w / 2 - 60 : 0;
  const g = `<g transform="translate(${x} ${y})"><path d="M ${px - 20} ${h / 2 - 4} L ${px} ${h / 2 + 34} L ${px + 20} ${h / 2 - 4} Z" fill="#fff" stroke="#2A2238" stroke-width="6" stroke-linejoin="round"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="28" fill="#fff" stroke="#2A2238" stroke-width="6"/><rect x="${px - 18}" y="${h / 2 - 10}" width="36" height="9" fill="#fff"/>` +
    `<text x="0" y="${tam * 0.36}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="${tam}" fill="#2A2238">${esc(texto)}</text></g>`;
  return pulo(g, lt, x, y + h / 2, t0, 0.3);
}
function cardRed(lt, t0, { x, y, w = 280, h = 230, rot = -4, conteudo }) {
  return card(lt, t0, { x, y, w, h, rot, conteudo, fundo: '#FFFFFF' });
}

// ---------- 1 — GANCHO ----------
E.push({
  fala: 'Leram a minha carta de amor... no *microfone da escola*.',
  capa: 0.05,
  legendaY: 760,
  desenhar(lt, c) {
    let s = filtroAdesivo() + palco(lt);
    [[90, 41], [210, 42], [330, 43], [450, 44]].forEach(([x, sm]) => (s += alunoChibi(sm, { x, y: 1560, esc: 0.42, expr: 'sorriso', t: lt })));
    s += rafa({ x: 770, y: 1080, esc: 0.55, expr: 'sorriso', braco: 'segura', segura: carta(0, 20, -6, 0.9), t: lt, fala: true });
    s += kyle({ x: 330, y: 1880, esc: 0.75, expr: 'vergonha', vergonha: 1, braco: 'rosto', t: lt });
    s += `<rect width="1080" height="660" fill="#1E1A2B" opacity="0.55"/>`;
    s += tituloRed('LERAM MINHA CARTA', 540, 250, { tam: 92 });
    s += tituloRed('NO MICROFONE', 540, 370, { tam: 104, cor: '#F7C531' });
    s += tituloRed('DA ESCOLA 😳', 540, 490, { tam: 92 });
    return s;
  },
});

// ---------- 2 — Quem é o Kyle ----------
E.push({
  fala: 'Esse é o Kyle. 16 anos, óculos fundo de garrafa... e apaixonado pela *Lara* desde o sexto ano.',
  desenhar(lt, c) {
    let s = filtroAdesivo() + fundoDiagonal(lt);
    s += kyle({ x: mix(-200, 330, suave(lt / 0.5)), y: 1700, esc: 0.95, expr: 'sorriso', braco: 'acena', bracoE: 'baixo', t: lt });
    const tl = c.w('lara');
    if (lt > tl) s += lara({ x: mix(1300, 790, suave((lt - tl) / 0.5)), y: 1700, esc: 0.88, expr: 'feliz', t: lt });
    if (lt > tl + 0.3) s += pulo(`<text x="560" y="1050" text-anchor="middle" font-size="110">💘</text>`, lt, 560, 1010, tl + 0.4);
    s += cardRed(lt, c.w('16'), { x: 260, y: 470, w: 230, h: 190, rot: -6, conteudo: `<text x="0" y="30" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="110" fill="#D92B47">16</text>` + `<text x="0" y="78" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="32" fill="#2A2238">ANOS</text>` });
    s += pilulaRed('6º ANO → HOJE', 790, 440, { tam: 44, rot: 4 });
    return s;
  },
});

// ---------- 3 — A carta ----------
E.push({
  fala: 'Ele escreveu uma carta pra ela. *Três páginas*, frente e verso.',
  desenhar(lt, c) {
    let mundo = filtroAdesivo() + quartoKyle(lt);
    mundo += `<circle cx="930" cy="1380" r="70" fill="#FFE38A" opacity="0.45"/><path d="M 910 1460 L 930 1330 L 970 1340" fill="none" stroke="#2A2238" stroke-width="8"/>`;
    mundo += kyle({ x: 720, y: 1640, esc: 0.72, expr: 'sonhando', braco: 'escreve', t: lt, olhar: [0, 1] });
    mundo += `<rect x="520" y="1460" width="500" height="44" rx="8" fill="#8A5A3C" stroke="#2A2238" stroke-width="6"/><rect x="540" y="1504" width="460" height="330" fill="#7A4E32" stroke="#2A2238" stroke-width="6"/><rect x="580" y="1540" width="380" height="110" rx="8" fill="none" stroke="#5E3B24" stroke-width="5"/><circle cx="770" cy="1595" r="10" fill="#F7C531" stroke="#2A2238" stroke-width="3"/>`;
    mundo += carta(740, 1440, 80, 0.75) + `<path d="M 800 1450 L 860 1400" stroke="#2A2238" stroke-width="10" stroke-linecap="round"/><path d="M 800 1450 L 860 1400" stroke="#F7C531" stroke-width="5" stroke-linecap="round"/>`;
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.15, cx: 700, cy: 1400 });
    s += cardRed(lt, c.w('três'), { x: 290, y: 560, w: 300, h: 250, rot: -5, conteudo: carta(-60, -10, -10, 0.8) + carta(0, -15, 0, 0.8) + carta(60, -10, 10, 0.8) + `<text x="0" y="100" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="40" fill="#2A2238">3 PÁGINAS</text>` });
    return s;
  },
});

// ---------- 4 — O armário errado ----------
E.push({
  fala: 'E colocou no armário dela. Só que *errou o armário*. Era o do Rafa, o camisa 7.',
  desenhar(lt, c) {
    const te = c.w('errou'), tr = c.w('rafa');
    let s = filtroAdesivo() + armarios(lt);
    const kx = lt < te ? 330 : mix(330, 120, suave((lt - te) / 0.6));
    s += kyle({ x: kx, y: 1820, esc: 0.75, expr: lt > te ? 'surpreso' : 'feliz', braco: lt < te ? 'aponta' : 'rosto', t: lt, olhar: [1, 0] });
    if (lt < te + 0.3) s += carta(mix(470, 570, lim(lt / 1.2)), mix(1100, 900, lim(lt / 1.2)), 10, 0.6);
    if (lt > tr) s += rafa({ x: mix(1300, 760, suave((lt - tr) / 0.5)), y: 1820, esc: 0.78, expr: 'sorriso', braco: 'segura', segura: carta(0, 20, -6, 0.9), t: lt });
    s += carimbo(lt, te, { x: 560, y: 360, texto: 'ARMÁRIO 17', rot: -8, tam: 90 });
    return s;
  },
});

// ---------- 5 — No microfone ----------
E.push({
  fala: 'No intervalo, o Rafa subiu no palco... e leu a carta *inteirinha* no microfone.',
  desenhar(lt, c) {
    let s = filtroAdesivo() + palco(lt);
    s += rafa({ x: 770, y: 1080, esc: 0.55, expr: 'sorriso', braco: 'segura', segura: carta(0, 20, -6, 0.9), t: lt, fala: lt > c.w('leu') });
    [[90, 41], [220, 42], [350, 43], [480, 44], [180, 45], [420, 46]].forEach(([x, sm], i) => (s += alunoChibi(sm, { x, y: i < 4 ? 1560 : 1800, esc: i < 4 ? 0.42 : 0.5, expr: lt > c.w('leu') ? 'surpreso' : 'neutro', t: lt, olhar: [1, -0.5] })));
    s += balaoRed(lt, c.w('leu'), { x: 620, y: 640, texto: '"QUERIDA LARA..."', tam: 54, ponta: 'dir' });
    return s;
  },
});

// ---------- 6 — Todo mundo riu ----------
E.push({
  fala: 'A escola inteira riu. E a Lara... *ficou olhando* pra ele.',
  desenhar(lt, c) {
    const tl = c.w('lara');
    let s = filtroAdesivo() + patio(lt, { cantina: false });
    [[100, 51], [230, 52], [860, 53], [980, 54]].forEach(([x, sm]) => (s += alunoChibi(sm, { x, y: 1620, esc: 0.45, expr: 'sorriso', t: lt })));
    s += kyle({ x: 330, y: 1860, esc: 0.8, expr: 'chorando', vergonha: 1, braco: 'rosto', t: lt });
    if (lt > tl) s += lara({ x: 790, y: 1860, esc: 0.8, expr: 'surpreso', t: lt, olhar: [-1, 0] });
    for (let i = 0; i < 5; i++) {
      const k = (lt * 0.8 + i * 0.2) % 1;
      if (lt < tl) s += `<text x="${150 + i * 190}" y="${1100 - k * 300}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="70" fill="#F7C531" stroke="#2A2238" stroke-width="6" paint-order="stroke" opacity="${1 - k}">HA</text>`;
    }
    return s;
  },
});

// ---------- 7 — O baile em 30 dias ----------
E.push({
  fala: 'Na saída, ele viu o cartaz: baile de formatura... daqui a *30 dias*.',
  desenhar(lt, c) {
    let s = filtroAdesivo() + armarios(lt);
    s += `<g transform="translate(540 760) rotate(-3)"><rect x="-260" y="-320" width="520" height="640" rx="16" fill="#2E1F5E" stroke="#2A2238" stroke-width="8"/>` +
      `<text x="0" y="-200" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="90" fill="#F7C531">BAILE</text>` +
      `<text x="0" y="-120" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="56" fill="#fff">DE FORMATURA</text>` +
      `<circle cx="0" cy="40" r="90" fill="#C9D3E8" stroke="#2A2238" stroke-width="6"/>` +
      Array.from({ length: 10 }, (_, i) => `<rect x="${-70 + (i % 5) * 32}" y="${-10 + Math.floor(i / 5) * 40}" width="22" height="22" fill="#8A9AC0"/>`).join('') +
      `<text x="0" y="250" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="50" fill="#fff">✨ SÁBADO ✨</text></g>`;
    s += kyle({ x: 280, y: 1880, esc: 0.72, expr: 'triste', t: lt, olhar: [1, -1] });
    s += cardRed(lt, c.w('30'), { x: 820, y: 1300, w: 260, h: 220, rot: 6, conteudo: `<text x="0" y="30" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="120" fill="#D92B47">30</text><text x="0" y="82" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="34" fill="#2A2238">DIAS</text>` });
    return s;
  },
});

// ---------- 8 — A promessa ----------
E.push({
  fala: 'Naquela noite, ele fez uma promessa: chegar no baile *irreconhecível*.',
  desenhar(lt, c) {
    let mundo = filtroAdesivo() + quartoKyle(lt, { luz: 0.85 });
    mundo += kyle({ x: 540, y: 1860, esc: 1.0, expr: lt > c.w('irreconhecível') ? 'determinado' : 'triste', braco: lt > c.w('irreconhecível') ? 'cintura' : 'baixo', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.15, cy: 1350 });
    s += pulo(pilulaRed('IRRECONHECÍVEL', 540, 560, { tam: 72, rot: -4 }), lt, 540, 560, c.w('irreconhecível'));
    som('carimbo', c.w('irreconhecível'), 0.7);
    return s;
  },
});

// ---------- 9 — O plano ----------
E.push({
  fala: 'O plano: pele, cabelo, óculos, roupa e confiança. *Uma coisa de cada vez*.',
  legendaY: 1330,
  desenhar(lt, c) {
    let s = filtroAdesivo() + fundoDiagonal(lt);
    s += tituloRed('O PLANO', 540, 300, { tam: 130, cor: '#F7C531' });
    const itens = [['pele', '🧴 PELE'], ['cabelo', '💇 CABELO'], ['óculos', '👓 ÓCULOS'], ['roupa', '👕 ROUPA'], ['confiança', '😎 CONFIANÇA']];
    itens.forEach(([p, rot], i) => {
      const t0 = c.w(p);
      s += pulo(`<rect x="190" y="${430 + i * 150}" width="700" height="120" rx="60" fill="#fff" stroke="#2A2238" stroke-width="6"/><circle cx="260" cy="${490 + i * 150}" r="36" fill="none" stroke="#2A2238" stroke-width="6"/>` +
        `<text x="560" y="${512 + i * 150}" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="62" fill="#2A2238">${rot}</text>`, lt, 540, 490 + i * 150, t0);
      som('pop', t0, 0.7);
    });
    s += kyle({ x: 880, y: 1880, esc: 0.6, expr: 'determinado', braco: 'aponta', bracoE: 'baixo', vira: -1, t: lt });
    return s;
  },
});

// ---------- 10 — Dia 1: pele ----------
E.push({
  fala: 'Dia 1: pele. Lavar o rosto de manhã e de noite, beber água... e *parar de espremer espinha*.',
  desenhar(lt, c) {
    const k = lim(lt / c.dur);
    let mundo = filtroAdesivo() + `<rect width="1080" height="1920" fill="#CFE6F2"/>`;
    for (let y = 0; y < 1920; y += 90) for (let x = (y / 90) % 2 ? 45 : 0; x < 1080; x += 90) mundo += `<rect x="${x}" y="${y}" width="86" height="86" fill="#BFDDEC"/>`;
    mundo += `<rect x="240" y="300" width="600" height="700" rx="40" fill="#E9F6FC" stroke="#2A2238" stroke-width="10"/>`;
    mundo += `<rect y="1500" width="1080" height="420" fill="#F4F4F4" stroke="#2A2238" stroke-width="6"/>`;
    mundo += kyle({ x: 540, y: 2040, esc: 1.25, expr: k > 0.7 ? 'sorriso' : 'determinado', espinhas: 1 - k * 0.6, braco: k < 0.4 ? 'rosto' : 'baixo', t: lt });
    if (k < 0.4) for (let i = 0; i < 6; i++) mundo += `<circle cx="${380 + i * 60}" cy="${900 + Math.sin(lt * 6 + i) * 30}" r="${14 + (i % 3) * 6}" fill="#fff" stroke="#9FD3F0" stroke-width="4" opacity="0.8"/>`;
    let s = mundo + contador(1, 29, lt, true);
    s += cardRed(lt, c.w('lavar'), { x: 200, y: 1250, w: 230, h: 190, rot: -6, conteudo: `<text x="0" y="10" text-anchor="middle" font-size="90">🧼</text><text x="0" y="75" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="30" fill="#2A2238">2X POR DIA</text>` });
    s += cardRed(lt, c.w('água'), { x: 880, y: 1250, w: 230, h: 190, rot: 6, conteudo: `<text x="0" y="10" text-anchor="middle" font-size="90">💧</text><text x="0" y="75" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="30" fill="#2A2238">ÁGUA</text>` });
    s += carimbo(lt, c.w('espremer'), { x: 540, y: 420, texto: 'NÃO ESPREME!', rot: -6, tam: 80 });
    return s;
  },
});

// ---------- 11 — A escolha ----------
E.push({
  fala: 'Amanhã é o dia 2. A: ele corta o cabelo. B: ele troca os óculos.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = filtroAdesivo();
    s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden">` + fundoDiagonal(lt, { a: '#2E3F9E', b: '#3E52B8' }) +
      kyle({ x: 540, y: 1000, esc: 0.9, expr: 'feliz', cabelo: { tipo: 'curto', cor: '#5A3A24' }, t: lt }) + `<text x="820" y="420" font-size="130">✂️</text></svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">` + fundoDiagonal(lt, { a: '#D92B47', b: '#B8233C' }) +
      kyle({ x: 540, y: 1000, esc: 0.9, expr: 'feliz', oculos: false, t: lt }) + `<text x="790" y="420" font-size="130">👓</text></svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#1E1A2B"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="162" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="96" fill="#fff">A</text>` + pilulaRed('CORTA O CABELO', 560, 130, { tam: 50 }), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#D92B47" stroke="#fff" stroke-width="10"/><text x="120" y="1132" text-anchor="middle" font-family="${F_RED}" font-weight="800" font-size="96" fill="#fff">B</text>` + pilulaRed('TROCA OS ÓCULOS', 560, 1100, { tam: 50 }), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// ---------- 12 — Você decide ----------
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira o episódio 2.',
  semLegenda: true,
  desenhar(lt, c) {
    let s = filtroAdesivo() + fundoDiagonal(lt);
    s += pulo(pilulaRed('COMO PROMETIDO', 540, 420, { tam: 48 }), lt, 540, 420, 0.05);
    s += pulo(tituloRed('EPISÓDIO 2', 540, 600, { tam: 150 }), lt, 540, 560, 0.2);
    s += pulo(tituloRed('VOCÊ DECIDE!', 540, 760, { tam: 120, cor: '#F7C531' }), lt, 540, 720, 0.5);
    s += pulo(tituloRed('COMENTA A OU B 👇', 540, 900, { tam: 70 }), lt, 540, 880, 0.9);
    s += kyle({ x: 540, y: 1860, esc: 1.0, expr: 'sorriso', braco: 'acena', bracoE: 'baixo', t: lt });
    return s;
  },
});

// Capa (padrão das capas do perfil: close do rosto + palavra-tema).
window.CAPA = () => {
  let s = filtroAdesivo() + fundoDiagonal(0.3);
  s += tituloRed('A CARTA', 540, 330, { tam: 170 });
  s += pilulaRed('EPISÓDIO 1', 540, 470, { tam: 56 });
  s += kyle({ x: 540, y: 2350, esc: 2.2, expr: 'vergonha', vergonha: 1, braco: 'rosto', t: 0.4 });
  s += carta(850, 760, 14, 1.4);
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });
