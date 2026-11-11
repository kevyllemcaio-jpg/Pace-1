// ESPECIAL — "E se você tivesse poderes de aranha por 1 dia?" (fora da série)
// Personagem original de moletom que monta um traje original ("V-8": grafite, neon, visor, símbolo de 8 pontos). Formato curto: gancho no 1º quadro.
//
// Fatos usados (aranhas reais):
//   - Muitas aranhas sobem paredes com milhares de pelinhos nas patas que grudam em qualquer superfície.
//   - A aranha saltadora enxerga quase 360° com seus 8 olhos.
//   - A aranha saltadora pula até ~50 vezes o próprio tamanho. 1,70 m x 50 = 85 m.
//   - A seda de aranha, peso por peso, é mais resistente que o aço.
//   - Aranhas sentem vibrações pelos pelos das patas.
//   - Aranhas não mastigam: soltam enzimas que derretem a comida por fora e depois sugam.
//   - Aranhas trocam de "pele" (o exoesqueleto) para crescer.

const E = [];

// ---------- personagem e elementos ----------
function voce(o) {
  return pessoa({ pele: '#C68E62', cabelo: { tipo: 'curto', cor: '#2B1D16' }, roupa: { camisa: '#5B6475', calca: '#3B5B8C', mangaLonga: true }, semente: 29, ...o });
}
// TRAJE ORIGINAL "V-8": grafite com linhas verde-neon, visor brilhante e símbolo de 8 pontos (os 8 olhos).
const NEON = '#C6F432';
function simbolo8(x, y, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})"><path d="M 0 -30 L 26 -15 L 26 15 L 0 30 L -26 15 L -26 -15 Z" fill="#11151C" stroke="${NEON}" stroke-width="4"/>`;
  [[-9, -10, 5], [9, -10, 5], [-17, 0, 3.5], [17, 0, 3.5], [-6, 4, 3], [6, 4, 3], [-11, 14, 2.5], [11, 14, 2.5]].forEach(([a, b, r]) => (s += `<circle cx="${a}" cy="${b}" r="${r}" fill="${NEON}"/>`));
  return s + `</g>`;
}
function voceTraje(o) {
  const tronco =
    `<path d="M -70 -392 L -20 -300 L -24 -240 M 70 -392 L 20 -300 L 24 -240" fill="none" stroke="${NEON}" stroke-width="6" stroke-linecap="round"/>` +
    `<rect x="-72" y="-262" width="144" height="16" fill="#0B0E13" stroke="${NEON}" stroke-width="3"/>` + simbolo8(0, -335, 1.1);
  const capacete =
    `<circle cx="0" cy="-525" r="103" fill="#232A36" stroke="${TRACO}" stroke-width="4"/>` +
    `<path d="M -70 -605 Q 0 -650 70 -605" fill="none" stroke="${NEON}" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="-86" y="-540" width="172" height="46" rx="23" fill="${NEON}" opacity="0.35"/>` +
    `<rect x="-80" y="-535" width="160" height="36" rx="18" fill="${NEON}" stroke="#0B0E13" stroke-width="4"/>` +
    `<rect x="-62" y="-529" width="50" height="8" rx="4" fill="#fff" opacity="0.8"/>` +
    `<path d="M -40 -470 L 40 -470" stroke="#3A4456" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M -100 -520 L -126 -520 M 100 -520 L 126 -520" stroke="${NEON}" stroke-width="5" stroke-linecap="round"/>`;
  return pessoa({
    pele: '#232A36', cabelo: { tipo: 'careca', cor: '#232A36' },
    roupa: { camisa: '#232A36', calca: '#1A2029', manga: '#232A36', mangaLonga: true },
    sobreTronco: tronco, sobreCabeca: capacete, tenis: '#1A2029', sola: NEON, semente: 29, ...o,
  });
}

// Pessoa de cabeça para baixo, com os pés grudados em (x, y).
function deCabecaPraBaixo(svgPessoa, x, y) {
  return `<g transform="rotate(180 ${x} ${y})">${svgPessoa}</g>`;
}
function teia(x1, y1, x2, y2, k = 1) {
  const x = mix(x1, x2, k), y = mix(y1, y2, k);
  return `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" stroke="#2A2A2A" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`;
}
function relogio(hora, lt) {
  const g = `<rect x="330" y="105" width="420" height="100" rx="50" fill="#1F2430" stroke="#0E1015" stroke-width="5"/>` +
    `<circle cx="395" cy="155" r="30" fill="#fff" stroke="#0E1015" stroke-width="4"/><line x1="395" y1="155" x2="395" y2="134" stroke="#0E1015" stroke-width="5"/><line x1="395" y1="155" x2="411" y2="160" stroke="#E0393E" stroke-width="5"/>` +
    txt(hora, 575, 180, { tam: 72, cor: '#FFD21F', fonte: F_TIT, peso: 400 });
  return pulo(g, lt, 540, 155, 0, 0.25);
}
function iconeAranha(x, y, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  for (const lado of [-1, 1]) for (let i = 0; i < 4; i++) {
    const a = -50 + i * 32;
    s += `<path d="M 0 0 L ${lado * 40} ${a * 0.6} L ${lado * 70} ${a + 20}" fill="none" stroke="#222" stroke-width="7" stroke-linejoin="round"/>`;
  }
  return s + `<ellipse cx="0" cy="12" rx="26" ry="32" fill="#222"/><circle cx="0" cy="-22" r="18" fill="#222"/><circle cx="-6" cy="-26" r="4" fill="#fff"/><circle cx="6" cy="-26" r="4" fill="#fff"/></g>`;
}

// Parede de prédio em primeiro plano (o personagem fica grudado nela, subindo).
function paredePredio() {
  let s = `<rect x="160" y="0" width="760" height="1920" fill="#C98A5E" stroke="#2A2A2A" stroke-width="5"/>`;
  for (let y = 40; y < 1920; y += 70) for (let x = (y / 70) % 2 ? 160 : 200; x < 920; x += 80)
    s += `<rect x="${x}" y="${y}" width="76" height="66" fill="none" stroke="#A86F48" stroke-width="3"/>`;
  for (const [x, y] of [[230, 980], [700, 980], [230, 1420], [700, 1420]])
    s += `<rect x="${x}" y="${y}" width="150" height="190" fill="#FFE9A0" stroke="#2A2A2A" stroke-width="5"/><line x1="${x + 75}" y1="${y}" x2="${x + 75}" y2="${y + 190}" stroke="#2A2A2A" stroke-width="4"/>`;
  return s;
}

// ---------- 1 — GANCHO ----------
E.push({
  fala: 'E se você acordasse amanhã com *poderes de aranha*, e um traje pra usar? Só por *1 dia*.',
  capa: 0.05,
  legendaY: 1080,
  dur: 3.5,
  desenhar(lt, c) {
    let s = ceu('#1B2A55', '#4A5A8F', 'ceuNoite') + casario(-20, 1100, 1920, { semente: 77, alt: [500, 1100], escuro: 0.6 });
    s += paredePredio();
    s += voceTraje({ x: 540, y: 1700 - lt * 40, esc: 0.8, expr: 'sorriso', pose: 'ergue', t: lt });
    s += `<rect width="1080" height="900" fill="#000" opacity="0.25"/>`;
    [['E SE VOCÊ TIVESSE', '#FFFFFF'], ['PODERES DE ARANHA', NEON], ['POR 1 DIA?', '#FFFFFF']].forEach(([t, cor], i) =>
      (s += txt(t, 540, 300 + i * 140, { tam: Math.min(130, 960 / (t.length * 0.45)), cor, fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 })));
    s += pulo(iconeAranha(900, 820, 1.4), lt, 900, 820, 0.6);
    return s;
  },
});

// ---------- 2 — 06:00 grudado no teto ----------
E.push({
  fala: '6 da manhã. Você acorda... *grudado no teto*. As aranhas sobem parede com milhares de pelinhos nas patas.',
  desenhar(lt, c) {
    let mundo = quarto(lt);
    mundo += `<rect width="1080" height="70" fill="#3E4C7E"/>`;
    mundo += deCabecaPraBaixo(voce({ x: 400, y: 75, esc: 0.75, expr: lt > c.w('grudado') ? 'surpreso' : 'cansado', pose: 'coca', t: lt }), 400, 75);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cx: 400, cy: 700 });
    s += relogio('06:00', lt);
    s += card(lt, c.w('milhares'), { x: 280, y: 1250, w: 300, h: 240, rot: -5, conteudo: iconeAranha(0, -20, 0.9) + txt('PELINHOS GRUDENTOS', 0, 95, { tam: 26 }) });
    return s;
  },
});

// ---------- 2b — 06:30 o traje ----------
E.push({
  fala: '6 e meia. Antes de sair, você monta um *traje*: luvas que grudam, visor que enxerga no escuro e *teia* no pulso.',
  desenhar(lt, c) {
    const k = suave((lt - c.w('traje')) / 0.5);
    let mundo = quarto(lt);
    mundo += k < 1 ? `<g opacity="${1 - k}">${voce({ x: 540, y: 1800, esc: 0.95, expr: 'determinado', pose: 'cintura', t: lt })}</g>` : '';
    mundo += `<g opacity="${k}">${voceTraje({ x: 540, y: 1800, esc: 0.95, expr: 'neutro', pose: 'cintura', t: lt })}</g>`;
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.15, cy: 1350 });
    if (lt > c.w('traje') && lt < c.w('traje') + 0.25) s += `<rect width="1080" height="1920" fill="#fff" opacity="${1 - (lt - c.w('traje')) / 0.25}"/>`;
    som('carimbo', c.w('traje'), 0.7);
    s += relogio('06:30', lt);
    s += card(lt, c.w('luvas'), { x: 220, y: 560, w: 230, h: 190, rot: -6, conteudo: `<circle cx="0" cy="-20" r="45" fill="#232A36" stroke="${NEON}" stroke-width="6"/>` + txt('GRUDA', 0, 70, { tam: 34 }) });
    s += card(lt, c.w('visor'), { x: 540, y: 520, w: 230, h: 190, rot: 3, conteudo: `<rect x="-80" y="-40" width="160" height="40" rx="20" fill="${NEON}" stroke="#0B0E13" stroke-width="4"/>` + txt('VISÃO NOTURNA', 0, 70, { tam: 28 }) });
    s += card(lt, c.w('teia'), { x: 860, y: 560, w: 230, h: 190, rot: 6, conteudo: `<rect x="-55" y="-50" width="110" height="60" rx="14" fill="#232A36" stroke="${NEON}" stroke-width="5"/><circle cx="0" cy="-20" r="12" fill="${NEON}"/>` + txt('TEIA', 0, 70, { tam: 34 }) });
    return s;
  },
});

// ---------- 3 — 07:00 visão 360 ----------
E.push({
  fala: '7 horas. Você ganha a visão da aranha saltadora: *8 olhos*, quase *360 graus*. Dá pra ver quem tá atrás de você.',
  desenhar(lt, c) {
    let mundo = patio(lt);
    mundo += voceTraje({ x: 540, y: 1800, esc: 0.85, expr: 'orgulhoso', pose: 'cintura', t: lt, olhar: [Math.sin(lt * 3), 0] });
    mundo += aluno(201, { x: 860, y: 1760, esc: 0.6, expr: 'desconfiado', pose: 'coca', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 });
    s += relogio('07:00', lt);
    // cone de visão girando
    if (lt > c.w('360')) s += `<g opacity="0.25" transform="rotate(${lt * 120} 540 1260)"><path d="M 540 1260 L 1400 1000 A 900 900 0 0 1 1400 1520 Z" fill="#FFF7A6"/></g>`;
    s += card(lt, c.w('8'), { x: 290, y: 520, w: 280, h: 220, rot: -5, conteudo: Array.from({ length: 8 }, (_, i) => `<circle cx="${-90 + (i % 4) * 60}" cy="${-45 + Math.floor(i / 4) * 55}" r="${i % 4 === 1 || i % 4 === 2 ? 22 : 14}" fill="#222"/>`).join('') + txt('8 OLHOS', 0, 90, { tam: 36 }) });
    s += card(lt, c.w('360'), { x: 790, y: 540, w: 260, h: 220, rot: 5, conteudo: txt('360°', 0, 30, { tam: 110, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 4 — 08:00 o pulo ----------
E.push({
  fala: '8 horas. A aranha saltadora pula até *50 vezes* o próprio tamanho. Pra você, isso é um pulo de *85 metros*.',
  desenhar(lt, c) {
    const k = lim((lt - c.w('85')) / 1.4);
    const x = mix(200, 880, k), y = 1800 - Math.sin(k * Math.PI) * 1500;
    let s = ceu('#7DBDE8', '#D2ECF7', 'ceuPulo') + casario(-20, 1100, 1650, { semente: 81, alt: [300, 1100] });
    s += `<rect y="1650" width="1080" height="270" fill="#D6D0C2"/>`;
    s += `<path d="M 200 1800 Q 540 -1200 880 1800" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="20 18" opacity="${k > 0 ? 0.8 : 0}"/>`;
    s += voceTraje({ x, y, esc: 0.55, expr: k > 0 && k < 1 ? 'sorriso' : 'determinado', pose: k > 0 && k < 1 ? 'ergue' : 'baixo', t: lt });
    s += relogio('08:00', lt);
    s += card(lt, c.w('50'), { x: 290, y: 520, w: 260, h: 210, rot: -5, conteudo: txt('50×', 0, 30, { tam: 110, cor: '#D7262B', fonte: F_TIT, peso: 400 }) + txt('O TAMANHO', 0, 80, { tam: 30 }) });
    s += card(lt, c.w('85'), { x: 790, y: 520, w: 260, h: 210, rot: 5, conteudo: txt('85 M', 0, 30, { tam: 110, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) + txt('DE PULO', 0, 80, { tam: 30 }) });
    return s;
  },
});

// ---------- 5 — 12:00 a teia ----------
E.push({
  fala: 'Meio-dia. O celular do seu amigo cai do terceiro andar. Você solta a teia. E seda de aranha, peso por peso, é *mais forte que aço*.',
  desenhar(lt, c) {
    const tq = c.w('teia');
    const kq = lim((lt - c.w('cai')) / Math.max(0.2, tq - c.w('cai')));
    const yc = mix(700, 1320, kq);
    let mundo = patio(lt, { cantina: false });
    mundo += voceTraje({ x: 300, y: 1820, esc: 0.75, expr: lt > tq ? 'determinado' : 'surpreso', pose: lt > tq ? 'aponta' : 'baixo', t: lt });
    mundo += aluno(202, { x: 850, y: 1800, esc: 0.6, expr: 'surpreso', t: lt });
    if (lt > tq) mundo += teia(472, 1440, 760, yc, lim((lt - tq) / 0.25));
    mundo += `<g transform="translate(760 ${yc}) rotate(${lt < tq ? lt * 300 : 15})"><rect x="-30" y="-52" width="60" height="104" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-23" y="-42" width="46" height="80" rx="4" fill="#4A90E2"/></g>`;
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1300 });
    s += relogio('12:00', lt);
    s += card(lt, c.w('aço'), { x: 540, y: 520, w: 460, h: 220, rot: -3, conteudo: txt('SEDA DE ARANHA', 0, -35, { tam: 40, cor: '#888' }) + txt('> AÇO', 0, 65, { tam: 110, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 6 — 15:00 vibrações ----------
E.push({
  fala: '3 da tarde. Você sente *vibrações* pelos pelos das mãos. Sabe que o celular de alguém tá tocando... do outro lado da sala.',
  desenhar(lt, c) {
    let mundo = patio(lt);
    mundo += voceTraje({ x: 300, y: 1820, esc: 0.8, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [1, 0] });
    mundo += aluno(203, { x: 860, y: 1760, esc: 0.6, expr: 'neutro', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1300 });
    for (let i = 0; i < 3; i++) {
      const r = ((lt * 0.9 + i / 3) % 1) * 260;
      s += `<circle cx="860" cy="1560" r="${r}" fill="none" stroke="#FFD21F" stroke-width="8" opacity="${1 - r / 260}"/>`;
    }
    s += relogio('15:00', lt);
    s += card(lt, c.w('vibrações'), { x: 300, y: 540, w: 280, h: 220, rot: -5, conteudo: `<path d="M -90 0 Q -70 -40 -50 0 T -10 0 T 30 0 T 70 0 T 110 0" fill="none" stroke="#D7262B" stroke-width="10" stroke-linecap="round"/>` + txt('VIBRAÇÃO', 0, 85, { tam: 36 }) });
    return s;
  },
});

// ---------- 7 — 19:00 o lado ruim: comida derretida ----------
E.push({
  fala: 'Mas às 7 da noite vem o lado ruim. Aranha *não mastiga*. Ela derrete a comida por fora... e depois *suga*.',
  desenhar(lt, c) {
    const derrete = lim((lt - c.w('derrete')) / 1.6);
    let mundo = cozinha(lt, { noite: true, vapor: false });
    mundo += voce({ x: 540, y: 1700, esc: 0.78, expr: derrete > 0.3 ? 'surpreso' : 'feliz', pose: 'conta', t: lt, olhar: [0, 1] });
    mundo += mesaCozinha(540, 1520, 640);
    // prato com hambúrguer derretendo
    mundo += `<ellipse cx="540" cy="1470" rx="110" ry="24" fill="#F4F4F4" stroke="#2A2A2A" stroke-width="4"/>`;
    mundo += `<g transform="translate(540 1440) scale(1 ${1 - derrete * 0.6})"><path d="M -70 0 Q -70 -60 0 -60 Q 70 -60 70 0 Z" fill="#D99A4E" stroke="#2A2A2A" stroke-width="4"/><rect x="-74" y="-4" width="148" height="18" rx="8" fill="#6B3E26" stroke="#2A2A2A" stroke-width="4"/><rect x="-70" y="14" width="140" height="16" rx="8" fill="#D99A4E" stroke="#2A2A2A" stroke-width="4"/></g>`;
    if (derrete > 0) mundo += `<ellipse cx="540" cy="1470" rx="${60 + derrete * 60}" ry="${10 + derrete * 10}" fill="#9BD15A" opacity="0.85" stroke="#2A2A2A" stroke-width="3"/>`;
    let s = camLenta(mundo, lt, c.dur, { z0: 1.3, z1: 1.45, cx: 540, cy: 1400 });
    s += relogio('19:00', lt);
    s += carimbo(lt, c.w('suga'), { x: 540, y: 620, texto: 'ECA!', rot: -8, tam: 130, cor: '#4E9A1E' });
    return s;
  },
});

// ---------- 8 — 23:00 troca de pele ----------
E.push({
  fala: 'E às 11 da noite... você *troca de pele*. Aranhas fazem isso pra crescer.',
  desenhar(lt, c) {
    const k = suave((lt - c.w('troca')) / 1.2);
    let mundo = quarto(lt, { luz: 0.85 });
    // a "casca" velha fica parada, você sai andando pro lado
    mundo += `<g opacity="0.5">${voce({ x: 420, y: 1800, esc: 0.8, expr: 'neutro', t: 0, pele: '#E8D9C2', roupa: { camisa: '#E8E2D6', calca: '#E8E2D6', mangaLonga: true }, cabelo: { tipo: 'curto', cor: '#D8CCB8' } })}</g>`;
    mundo += voce({ x: mix(420, 700, k), y: 1800, esc: 0.8, expr: k > 0.5 ? 'surpreso' : 'cansado', t: lt, olhar: [-1, 0], anda: k > 0 && k < 1 });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.12, cy: 1350 });
    s += relogio('23:00', lt);
    return s;
  },
});

// ---------- 9 — 06:00 acabou + pergunta ----------
E.push({
  fala: 'Às 6 da manhã, acabou. Você usaria esses poderes pra quê? *Comenta aí*.',
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + voce({ x: 540, y: 1840, esc: 1.05, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [0, -1] }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += relogio('06:00', lt);
    s += pulo(`<rect x="90" y="470" width="900" height="260" rx="30" fill="#1F2430" opacity="0.92"/>` +
      txt('E VOCÊ?', 540, 580, { tam: 110, cor: '#FFD21F', fonte: F_TIT, peso: 400 }) + txt('USARIA PRA QUÊ? 👇', 540, 690, { tam: 70, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 600, c.w('comenta'));
    return s;
  },
});

// Capa (mesmo estilo de destaque: título grande + personagem).
window.CAPA = () => {
  let s = ceu('#1B2A55', '#4A5A8F', 'ceuNoite') + casario(-20, 1100, 1920, { semente: 77, alt: [500, 1100], escuro: 0.6 });
  s += paredePredio() + voceTraje({ x: 540, y: 1720, esc: 0.9, expr: 'sorriso', pose: 'ergue', t: 0.5 });
  s += txt('PODERES DE', 540, 240, { tam: 120, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 });
  s += txt('ARANHA', 540, 470, { tam: 200, cor: NEON, fonte: F_TIT, peso: 400, contorno: '#111', cw: 24 });
  s += `<g transform="translate(540 600) rotate(-4)">` + pilula('PODERES + TRAJE · 24H', 0, 0, { tam: 52, fundo: NEON }) + `</g>`;
  s += iconeAranha(880, 900, 1.6);
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+15%' });
