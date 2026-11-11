// ESPECIAL — "E se você tivesse SUPERFORÇA por 1 dia?" (fora da série)
// Personagem original (o mesmo do especial da aranha) que cresce e usa um traje de treino original
// (azul com faixas laranja). Formato curto: gancho no 1º quadro, um fato por hora.
//
// Números usados:
//   - Recorde mundial de levantamento terra: 501 kg (2020).
//   - Um carro popular pesa por volta de 1 tonelada.
//   - Besouro-rinoceronte: levanta até ~850 vezes o próprio peso. 850 x 70 kg ≈ 60 toneladas.
//   - Um ônibus urbano pesa por volta de 13 toneladas -> 60 t ≈ 4 ônibus e meio.
//   - Formiga: carrega até ~50 vezes o próprio peso.

const E = [];
const LARANJA = '#FF8A1F';

// ---------- personagem ----------
function voce(o) {
  return pessoa({ pele: '#C68E62', cabelo: { tipo: 'curto', cor: '#2B1D16' }, roupa: { camisa: '#5B6475', calca: '#3B5B8C', mangaLonga: true }, semente: 29, ...o });
}
// Forma "titã": mais alto e mais largo, com traje de treino original.
function voceForte(o) {
  const tronco =
    `<path d="M -70 -392 L -40 -240 M 70 -392 L 40 -240" stroke="${LARANJA}" stroke-width="10"/>` +
    `<circle cx="0" cy="-330" r="30" fill="#14233F" stroke="${LARANJA}" stroke-width="6"/>` +
    `<path d="M -10 -350 L 6 -335 L -4 -330 L 10 -310" fill="none" stroke="${LARANJA}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<rect x="-72" y="-262" width="144" height="16" fill="#14233F" stroke="${LARANJA}" stroke-width="3"/>`;
  const largura = o.largura || 1.3;
  const p = pessoa({
    pele: '#C68E62', cabelo: { tipo: 'curto', cor: '#2B1D16' },
    roupa: { camisa: '#2E4A7A', calca: '#1F3358', manga: '#2E4A7A', mangaLonga: false },
    sobreTronco: tronco, tenis: '#14233F', sola: LARANJA, semente: 29, ...o,
  });
  return `<g transform="translate(${o.x} ${o.y}) scale(${largura} 1) translate(${-o.x} ${-o.y})">${p}</g>`;
}
function relogio(hora, lt) {
  const g = `<rect x="330" y="105" width="420" height="100" rx="50" fill="#1F2430" stroke="#0E1015" stroke-width="5"/>` +
    `<circle cx="395" cy="155" r="30" fill="#fff" stroke="#0E1015" stroke-width="4"/><line x1="395" y1="155" x2="395" y2="134" stroke="#0E1015" stroke-width="5"/><line x1="395" y1="155" x2="411" y2="160" stroke="#E0393E" stroke-width="5"/>` +
    txt(hora, 575, 180, { tam: 72, cor: '#FFD21F', fonte: F_TIT, peso: 400 });
  return pulo(g, lt, 540, 155, 0, 0.25);
}

// ---------- objetos ----------
function carro(x, y, esc = 1, rot = 0, cor = '#D7262B') {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">` +
    `<path d="M -200 -20 L -180 -80 Q -170 -100 -140 -100 L -60 -100 L -20 -150 Q -10 -160 20 -160 L 110 -160 Q 140 -160 160 -130 L 190 -90 Q 210 -85 210 -60 L 210 -20 Z" fill="${cor}" stroke="#2A2A2A" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M -10 -140 L 20 -145 L 100 -145 L 140 -100 L -40 -100 Z" fill="#9FD3F0" stroke="#2A2A2A" stroke-width="5"/><line x1="55" y1="-145" x2="55" y2="-100" stroke="#2A2A2A" stroke-width="5"/>` +
    [-120, 130].map((cx) => `<circle cx="${cx}" cy="-15" r="38" fill="#2A2A2A"/><circle cx="${cx}" cy="-15" r="16" fill="#BBB"/>`).join('') +
    `<rect x="185" y="-80" width="22" height="14" rx="4" fill="#FFE38A"/></g>`;
}
function porta(x, y, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-90" y="-210" width="180" height="420" rx="6" fill="#8A5A3C" stroke="#2A2A2A" stroke-width="6"/>` +
    `<rect x="-60" y="-180" width="120" height="150" fill="none" stroke="#6B4228" stroke-width="5"/><rect x="-60" y="10" width="120" height="170" fill="none" stroke="#6B4228" stroke-width="5"/>` +
    `<circle cx="60" cy="0" r="12" fill="#F2C230" stroke="#2A2A2A" stroke-width="3"/></g>`;
}
function anilha(x, y, esc = 1) {
  return `<g transform="translate(${x} ${y}) scale(${esc})"><rect x="-260" y="-8" width="520" height="16" rx="8" fill="#9AA3AD" stroke="#2A2A2A" stroke-width="4"/>` +
    [-1, 1].map((l) => `<rect x="${l * 200 - 22}" y="-90" width="44" height="180" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="${l * 245 - 16}" y="-70" width="32" height="140" rx="8" fill="#3A3F4A" stroke="#2A2A2A" stroke-width="4"/>`).join('') + `</g>`;
}
function onibus(x, y, esc = 1) {
  return `<g transform="translate(${x} ${y}) scale(${esc})"><rect x="-260" y="-200" width="520" height="190" rx="22" fill="#F2C230" stroke="#2A2A2A" stroke-width="6"/>` +
    [-200, -110, -20, 70, 160].map((wx) => `<rect x="${wx}" y="-175" width="70" height="70" rx="8" fill="#9FD3F0" stroke="#2A2A2A" stroke-width="4"/>`).join('') +
    [-170, 170].map((cx) => `<circle cx="${cx}" cy="-10" r="34" fill="#2A2A2A"/>`).join('') + `</g>`;
}
function pratos(x, y, n) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<ellipse cx="${x + (i % 2) * 6}" cy="${y - i * 16}" rx="90" ry="20" fill="#F4F4F4" stroke="#2A2A2A" stroke-width="4"/>`;
  return s;
}

// ---------- 1 — GANCHO ----------
E.push({
  fala: 'E se você acordasse amanhã com *superforça*? Força de verdade, de levantar carro. Só por *1 dia*.',
  capa: 0.05,
  legendaY: 1060,
  desenhar(lt, c) {
    let s = ceu('#F2B36B', '#FBE1B8', 'ceuForca') + casario(-20, 1100, 1500, { semente: 91, alt: [300, 800] });
    s += `<rect y="1500" width="1080" height="420" fill="#3A3A42"/>`;
    const sobe = suave(lt / 0.8);
    s += voceForte({ x: 540, y: 1880, esc: 0.9, expr: 'determinado', pose: 'ergue', t: lt });
    s += carro(640, mix(1500, 1080, sobe), 0.95, -4);
    s += `<rect width="1080" height="820" fill="#000" opacity="0.25"/>`;
    [['E SE VOCÊ TIVESSE', '#FFFFFF'], ['SUPERFORÇA', LARANJA], ['POR 1 DIA?', '#FFFFFF']].forEach(([t, cor], i) =>
      (s += txt(t, 540, 280 + i * 150, { tam: Math.min(150, 960 / (t.length * 0.45)), cor, fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 })));
    return s;
  },
});

// ---------- 2 — 06:00 a porta ----------
E.push({
  fala: '6 da manhã. Você vai abrir a porta do quarto... e ela *sai inteira* na sua mão.',
  desenhar(lt, c) {
    const solta = lt > c.w('sai');
    let mundo = quarto(lt);
    mundo += voce({ x: 420, y: 1800, esc: 0.9, expr: solta ? 'surpreso' : 'cansado', pose: solta ? 'ergue' : 'aponta', t: lt });
    mundo += solta ? porta(700, 1150, 14) : porta(800, 1260, 0);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1350 });
    if (solta) s += carimbo(lt, c.w('sai'), { x: 540, y: 620, texto: 'CRAC!', rot: -8, tam: 130, cor: '#8A5A3C' });
    s += relogio('06:00', lt);
    return s;
  },
});

// ---------- 3 — 07:00 cresce + traje ----------
E.push({
  fala: '7 horas. Seu corpo cresce: *2 metros e meio*. Nenhuma roupa serve, então você veste um *traje* de treino elástico.',
  desenhar(lt, c) {
    const k = suave((lt - c.w('cresce')) / 0.8);
    let mundo = quarto(lt);
    if (lt < c.w('traje')) mundo += voce({ x: 540, y: 1840, esc: mix(0.8, 1.0, k), expr: 'surpreso', t: lt });
    else mundo += voceForte({ x: 540, y: 1840, esc: 1.0, expr: 'orgulhoso', pose: 'cintura', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1300 });
    if (lt > c.w('traje') && lt < c.w('traje') + 0.25) s += `<rect width="1080" height="1920" fill="#fff" opacity="${1 - (lt - c.w('traje')) / 0.25}"/>`;
    som('carimbo', c.w('traje'), 0.7);
    s += relogio('07:00', lt);
    s += card(lt, c.w('2'), { x: 270, y: 560, w: 260, h: 220, rot: -5, conteudo: txt('2,5 M', 0, 30, { tam: 96, cor: '#2E4A7A', fonte: F_TIT, peso: 400 }) + txt('DE ALTURA', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 4 — 08:00 recorde humano ----------
E.push({
  fala: '8 horas, academia. O recorde mundial de levantamento terra é *501 quilos*. Você levanta isso... com *uma mão*.',
  desenhar(lt, c) {
    const sobe = suave((lt - c.w('uma')) / 0.6);
    let mundo = `<rect width="1080" height="1920" fill="#3A4152"/><rect y="1400" width="1080" height="520" fill="#22262F"/>`;
    for (let x = 60; x < 1080; x += 200) mundo += `<rect x="${x}" y="300" width="120" height="900" rx="10" fill="#4A5266"/>`;
    mundo += voceForte({ x: 540, y: 1840, esc: 0.95, expr: sobe > 0.5 ? 'orgulhoso' : 'determinado', pose: 'ergue', t: lt });
    mundo += anilha(mix(540, 700, 0), mix(1700, 1050, sobe), 0.9);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 });
    s += relogio('08:00', lt);
    s += card(lt, c.w('501'), { x: 290, y: 540, w: 300, h: 230, rot: -5, conteudo: txt('RECORDE', 0, -55, { tam: 32, cor: '#888' }) + txt('501 KG', 0, 50, { tam: 100, cor: '#D7262B', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('uma'), { x: 790, y: 560, w: 260, h: 220, rot: 5, conteudo: txt('1 MÃO', 0, 30, { tam: 96, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 5 — 10:00 o carro ----------
E.push({
  fala: '10 horas. Um carro popular pesa mais ou menos *1 tonelada*. Você tira ele da vaga como quem pega uma mochila.',
  desenhar(lt, c) {
    const sobe = suave((lt - c.w('tira')) / 0.7);
    let mundo = ruaPasseio(lt);
    mundo += voceForte({ x: mix(540, 520, sobe), y: 1840, esc: 0.9, expr: 'sorriso', pose: sobe > 0 ? 'ergue' : 'cintura', t: lt });
    mundo += carro(mix(820, 620, sobe), mix(1760, 1080, sobe), 0.9, mix(0, -6, sobe), '#2F8F5B');
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1300 });
    s += relogio('10:00', lt);
    s += card(lt, c.w('1'), { x: 280, y: 540, w: 280, h: 220, rot: -5, conteudo: txt('1 TON', 0, 30, { tam: 100, cor: '#2E4A7A', fonte: F_TIT, peso: 400 }) + txt('O CARRO', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 6 — 12:00 besouro-rinoceronte ----------
E.push({
  fala: 'Meio-dia. Na natureza, o campeão é o *besouro-rinoceronte*: levanta até 850 vezes o próprio peso. No seu tamanho, isso seria *60 toneladas*. Uns 4 ônibus.',
  desenhar(lt, c) {
    let mundo = ruaPasseio(lt);
    const n = Math.min(4, Math.floor(lim((lt - c.w('tamanho')) / 1.0) * 5));
    for (let i = 0; i < n; i++) mundo += onibus(540, 1060 - i * 190, 0.85);
    mundo += voceForte({ x: 540, y: 1860, esc: 0.9, expr: n >= 4 ? 'determinado' : 'surpreso', pose: 'ergue', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1250 });
    s += relogio('12:00', lt);
    s += card(lt, c.w('besouro'), {
      x: 270, y: 540, w: 280, h: 240, rot: -5,
      conteudo: `<ellipse cx="0" cy="0" rx="62" ry="44" fill="#5A3A28" stroke="#2A2A2A" stroke-width="5"/><path d="M 50 -10 Q 90 -60 70 -90" fill="none" stroke="#2A2A2A" stroke-width="10" stroke-linecap="round"/>` +
        [-30, 0, 30].map((x) => `<line x1="${x}" y1="30" x2="${x - 14}" y2="62" stroke="#2A2A2A" stroke-width="6"/>`).join('') + txt('850×', 0, 100, { tam: 54, cor: '#D7262B', fonte: F_TIT, peso: 400 }),
    });
    s += card(lt, c.w('60'), { x: 800, y: 560, w: 270, h: 220, rot: 5, conteudo: txt('60 TON', 0, 30, { tam: 92, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) + txt('≈ 4 ÔNIBUS', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 7 — 13:00 a fome ----------
E.push({
  fala: 'Mas tem um preço. Músculo gasta energia. No almoço você come *10 pratos*... e sai com fome.',
  desenhar(lt, c) {
    const n = Math.floor(lim((lt - c.w('10') + 0.3) / 1.5) * 10);
    let mundo = cozinha(lt, { noite: false, vapor: true });
    mundo += voceForte({ x: 540, y: 1700, esc: 0.85, expr: n >= 10 ? 'triste' : 'sorriso', pose: 'conta', t: lt, olhar: [0, 1] });
    mundo += mesaCozinha(540, 1520, 700) + pratos(360, 1470, n) + pratos(730, 1470, Math.max(0, n - 5));
    let s = camLenta(mundo, lt, c.dur, { z0: 1.15, z1: 1.25, cx: 540, cy: 1400 });
    s += relogio('13:00', lt);
    s += card(lt, c.w('10'), { x: 800, y: 560, w: 250, h: 210, rot: 5, conteudo: txt('10', 0, 30, { tam: 120, cor: '#D7262B', fonte: F_TIT, peso: 400 }) + txt('PRATOS', 0, 80, { tam: 32 }) });
    return s;
  },
});

// ---------- 8 — 18:00 quebra tudo ----------
E.push({
  fala: 'E o pior: você *quebra tudo* que toca. Copo, maçaneta... e o seu celular.',
  desenhar(lt, c) {
    const quebrou = lt > c.w('celular');
    const cel = `<rect x="-30" y="-52" width="60" height="104" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-23" y="-42" width="46" height="80" rx="4" fill="${quebrou ? '#555' : '#4A90E2'}"/>` +
      (quebrou ? `<path d="M -20 -30 L 0 -5 L -12 10 L 10 30 M 0 -5 L 18 -20" fill="none" stroke="#fff" stroke-width="4"/>` : '');
    let mundo = quarto(lt);
    mundo += voceForte({ x: 540, y: 1840, esc: 0.95, expr: quebrou ? 'triste' : 'preocupado', pose: 'segura', t: lt, segura: cel });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.1, z1: 1.25, cy: 1300 });
    s += relogio('18:00', lt);
    s += carimbo(lt, c.w('celular'), { x: 540, y: 620, texto: 'QUEBROU', rot: -7, tam: 120 });
    return s;
  },
});

// ---------- 9 — 06:00 acabou + pergunta ----------
E.push({
  fala: 'Às 6 da manhã, a força vai embora. Você faria o quê com ela? *Comenta aí*.',
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + voce({ x: 540, y: 1840, esc: 1.05, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [0, -1] }) + porta(860, 1500, 80), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += relogio('06:00', lt);
    s += pulo(`<rect x="90" y="470" width="900" height="260" rx="30" fill="#1F2430" opacity="0.92"/>` +
      txt('E VOCÊ?', 540, 580, { tam: 110, cor: LARANJA, fonte: F_TIT, peso: 400 }) + txt('FARIA O QUÊ? 👇', 540, 690, { tam: 70, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 600, c.w('comenta'));
    return s;
  },
});

// Rua com calçada (cenário das cenas na rua).
function ruaPasseio(t) {
  let s = ceu('#7DBDE8', '#D2ECF7', 'ceuRuaF') + casario(-20, 1100, 1500, { semente: 93, alt: [300, 900] });
  s += `<rect y="1500" width="1080" height="160" fill="#CFC8B6"/><rect y="1660" width="1080" height="260" fill="#3A3A42"/>`;
  for (let x = -40; x < 1080; x += 180) s += `<rect x="${x}" y="1790" width="100" height="14" fill="#F2C230"/>`;
  return s;
}

// Capa.
window.CAPA = () => {
  let s = ceu('#F2B36B', '#FBE1B8', 'ceuForca') + casario(-20, 1100, 1500, { semente: 91, alt: [300, 800] }) + `<rect y="1500" width="1080" height="420" fill="#3A3A42"/>`;
  s += voceForte({ x: 540, y: 1900, esc: 0.95, expr: 'determinado', pose: 'ergue', t: 0.5 }) + carro(640, 1100, 1.0, -4);
  s += txt('SUPER', 540, 290, { tam: 170, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 22 });
  s += txt('FORÇA', 540, 480, { tam: 210, cor: LARANJA, fonte: F_TIT, peso: 400, contorno: '#111', cw: 24 });
  s += `<g transform="translate(540 620) rotate(-4)">` + pilula('POR 24 HORAS', 0, 0, { tam: 56, fundo: LARANJA }) + `</g>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+15%' });
