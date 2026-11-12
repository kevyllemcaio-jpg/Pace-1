// NÍVEL ZERO — Episódio 1 (anime original)
// Nova Aurora: todo mundo toca o Cristal aos 16 e descobre o nível do seu poder.
// Ren sai nível ZERO. À noite, um caçador de poderes ataca e o Ren ABSORVE o poder dele.
// Votação: A esconde de todo mundo / B conta pra Aiko.

window.LEGENDA_Y = 1580;
window.TRATAR_VOZ = true;
const REN = { cabelo: { tipo: 'espetado', cor: '#22305E', sombra: '#141C3C', luz: '#8FB0FF' }, olhos: '#2E6FD8', olhos2: '#A8E0FF', id: 'ren' };
const AIKO = { cabelo: { tipo: 'longo', cor: '#EE7AA6', sombra: '#C04F80', luz: '#FFE0EC', sobrancelha: '#B04070' }, olhos: '#B03A80', olhos2: '#FFB0D8', id: 'aiko', gravata: '#2A6AC8', farda: '#2A2440', farda2: '#1C1830' };
const E = [];

const salaCristal = (lt) => salaoCristal(lt);
function risadas(lt, t0) {
  if (lt < t0) return '';
  let s = '';
  for (let i = 0; i < 6; i++) {
    const k = ((lt - t0) * 0.9 + i * 0.17) % 1;
    s += `<text x="${120 + (i % 3) * 420 - (i > 2 ? 200 : 0)}" y="${520 + (i > 2 ? 900 : 0) - k * 200}" text-anchor="middle" font-family="Anton, sans-serif" font-size="${90 + (i % 2) * 30}" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke" opacity="${1 - k}" transform="rotate(${-12 + i * 5} 540 900)">HA HA</text>`;
  }
  return s;
}

// 1 — GANCHO
E.push({
  fala: 'Todo mundo ganhou um poder aos dezesseis anos. Menos *ele*. Até *hoje à noite*.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = linhasVelocidade(lt, { fundo: '#120610', cor: '#FF2040' });
    s += animeOlhos({ ...REN, expr: 'raiva', t: lt, brilho: '#FF2040', olhos: '#FF2040' }, 980, 460);
    s += nivel(540, 560, '0 → ???', '#FF2040', lt, true);
    s += `<rect width="1080" height="380" fill="#000" opacity="0.65"/>`;
    s += `<text x="540" y="170" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke">TODOS GANHARAM UM PODER</text>`;
    s += `<text x="540" y="300" text-anchor="middle" font-family="Anton, sans-serif" font-size="110" fill="#FF3050" stroke="#000" stroke-width="10" paint-order="stroke">MENOS EU.</text>`;
    s += `<text x="540" y="1420" text-anchor="middle" font-family="Anton, sans-serif" font-size="100" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke">ATÉ HOJE À NOITE.</text>`;
    return tremor(s, lt, 0.1, 10, 0.4);
  },
});

// 2 — Nova Aurora
E.push({
  fala: 'Nova Aurora. Aqui, aos dezesseis anos, todo mundo toca o *Cristal* e descobre o nível do seu poder.',
  desenhar(lt, c) {
    let s = ceuAnime(lt);
    s += pulo(cristal(540, 1000, 0.8, { t: lt }), lt, 540, 1000, c.w('cristal'));
    s += `<text x="540" y="240" text-anchor="middle" font-family="Anton, sans-serif" font-size="120" fill="#fff" stroke="#1A1430" stroke-width="12" paint-order="stroke" letter-spacing="6">NOVA AURORA</text>`;
    return s;
  },
});

// 3 — Aiko nível 99
E.push({
  fala: 'A Aiko tocou primeiro. Nível *noventa e nove*. O maior da história da escola.',
  desenhar(lt, c) {
    const t0 = c.w('noventa');
    let s = lt > t0 ? linhasVelocidade(lt, { fundo: '#2A1030', cor: '#FFD24A' }) : salaCristal(lt);
    s += animeBusto({ ...AIKO, x: 540, y: 900, esc: 1.35, expr: lt > t0 ? 'sorriso' : 'determinado', t: lt, rim: '#FFE27A' });
    if (lt > t0) s += pulo(nivel(540, 330, '99', '#FFD24A', lt), lt, 540, 280, t0);
    s += flashBranco(lt, t0, 0.3, '#FFF2B0');
    som('carimbo', t0, 0.8);
    return s;
  },
});

// 4 — a vez do Ren
E.push({
  fala: 'Aí foi a vez do Ren. Ele encostou a mão no Cristal... e o salão *ficou em silêncio*.',
  desenhar(lt, c) {
    let s = salaCristal(lt);
    s += cristal(540, 700, 0.55, { t: lt });
    s += animeBusto({ ...REN, x: 540, y: 1080, esc: 1.15, expr: 'determinado', t: lt, olhar: [0, -1], rim: '#7FE8FF' });
    if (lt > c.w('silêncio')) s += `<rect width="1080" height="1920" fill="#000" opacity="${0.4 * lim((lt - c.w('silêncio')) / 0.6)}"/>`;
    return s;
  },
});

// 5 — nível zero
E.push({
  fala: 'O Cristal ficou cinza. Rachou. Nível... *zero*. E a escola inteira riu.',
  desenhar(lt, c) {
    const tz = c.w('zero');
    let s = salaoCristal(lt) + `<rect width="1080" height="1920" fill="#000" opacity="0.45"/>`;
    s += cristal(540, 760, 0.7, { estado: lt > c.w('cinza') ? 'cinza' : 'vivo', t: lt });
    if (lt > tz) s += pulo(nivel(540, 330, '0', '#9A9AA6', lt), lt, 540, 280, tz);
    s += textoImpacto('NÍVEL ZERO', lt, tz, { y: 1260, cor: '#C8C8D0', tam: 150 });
    s += risadas(lt, c.w('riu'));
    som('carimbo', c.w('rachou'), 0.9);
    return tremor(s, lt, c.w('rachou'), 14, 0.4);
  },
});

// 6 — chuva
E.push({
  fala: 'Ele voltou pra casa sozinho, debaixo de chuva. A Aiko nem olhou pra trás.',
  desenhar(lt, c) {
    let s = noiteChuva(lt);
    s += animeBusto({ ...REN, x: 540, y: 900, esc: 1.35, expr: 'triste', t: lt, olhar: [0, 1] });
    s += chuvaAnime(lt + 3, 70);
    return s;
  },
});

// 7 — o caçador
E.push({
  fala: 'Até que um vulto saiu do beco. Um *caçador de poderes*. E ele só ataca quem tem nível alto.',
  desenhar(lt, c) {
    const t0 = c.w('caçador');
    let s = noiteChuva(lt);
    s += monstro(540, mix(1500, 1050, suave(lt / 1.2)), 1.5, lt);
    s += textoImpacto('CAÇADOR', lt, t0, { y: 420, cor: '#FF3050', tam: 170 });
    som('carimbo', t0, 1);
    return tremor(s, lt, t0, 12, 0.4);
  },
});

// 8 — por que eu?
E.push({
  fala: 'Mas ele veio direto no Ren. O nível zero. *Por quê*?',
  desenhar(lt, c) {
    let s = linhasVelocidade(lt, { fundo: '#140814', cor: '#FF3050' });
    s += animeBusto({ ...REN, x: 540, y: 900, esc: 1.35, expr: 'surpreso', t: lt, rim: '#FF3050' });
    return tremor(s, lt, 0.2, 10, 0.5);
  },
});

// 9 — absorveu
E.push({
  fala: 'Ele levantou a mão pra se proteger... e *absorveu* o poder do caçador.',
  desenhar(lt, c) {
    const ta = c.w('absorveu');
    let s;
    if (lt < ta) s = noiteChuva(lt) + monstro(540, 1000, 1.5, lt);
    else {
      const k = lim((lt - ta) / 1.0);
      s = linhasVelocidade(lt, { fundo: '#0A0510', cor: '#FF2040' });
      s += `<g opacity="${1 - k}">${monstro(540, 1000, 1.5 * (1 - k * 0.6), lt)}</g>`;
      s += animeOlhos({ ...REN, expr: 'raiva', t: lt, brilho: '#FF2040', olhos: '#FF2040' }, 960, 460 * k + 10);
    }
    s += flashBranco(lt, ta, 0.4);
    som('carimbo', ta, 1.2);
    return tremor(s, lt, ta, 22, 0.6);
  },
});

// 10 — o número muda
E.push({
  fala: 'E o número em cima da cabeça dele mudou. Pra um que *ninguém nunca viu*.',
  desenhar(lt, c) {
    const t0 = c.w('mudou');
    let s = noiteChuva(lt) + animeBusto({ ...REN, x: 540, y: 980, esc: 1.25, expr: 'determinado', t: lt, brilho: lt > t0 ? '#FF2040' : null, olhos: lt > t0 ? '#FF2040' : REN.olhos });
    s += nivel(540, 360, lt < t0 ? '0' : '???', lt < t0 ? '#9A9AA6' : '#FF2040', lt, lt > t0);
    return s;
  },
});

// 11 — votação
E.push({
  fala: 'O que o Ren faz? A: esconde o poder de todo mundo. B: conta pra Aiko.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${noiteChuva(lt)}${animeBusto({ ...REN, x: 540, y: 600, esc: 1.0, expr: 'determinado', t: lt })}</svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">${ceuAnime(lt)}<g transform="translate(-200 0)">${animeBusto({ ...REN, x: 540, y: 600, esc: 0.85, expr: 'triste', t: lt })}</g><g transform="translate(220 0)">${animeBusto({ ...AIKO, x: 540, y: 600, esc: 0.85, expr: 'surpreso', t: lt })}</g></svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#000"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="160" text-anchor="middle" font-family="Anton, sans-serif" font-size="90" fill="#fff">A</text>` + textoImpacto('ESCONDE O PODER', 1, 0, { y: 160, tam: 80, rot: -3 }).replace('translate(540 160)', 'translate(600 160)'), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#D7262B" stroke="#fff" stroke-width="10"/><text x="120" y="1130" text-anchor="middle" font-family="Anton, sans-serif" font-size="90" fill="#fff">B</text>` + textoImpacto('CONTA PRA AIKO', 1, 0, { y: 1130, tam: 80, rot: -3 }).replace('translate(540 1130)', 'translate(600 1130)'), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// 12 — final
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira o episódio dois.',
  semLegenda: true,
  desenhar(lt, c) {
    let s = linhasVelocidade(lt, { fundo: '#120610', cor: '#FF2040', n: 40 });
    s += textoImpacto('NÍVEL ZERO', lt, 0.05, { y: 760, tam: 190, cor: '#FF3050' });
    s += textoImpacto('EPISÓDIO 2', lt, 0.4, { y: 960, tam: 120, rot: 0 });
    s += textoImpacto('COMENTA A OU B 👇', lt, 0.8, { y: 1130, tam: 80, rot: 0, cor: '#FFD24A' });
    return s;
  },
});

window.CAPA = () => {
  let s = linhasVelocidade(0.4, { fundo: '#120610', cor: '#FF2040' });
  s += animeBusto({ ...REN, x: 540, y: 1100, esc: 1.5, expr: 'raiva', t: 0.4, brilho: '#FF2040', olhos: '#FF2040' });
  s += nivel(540, 560, '0', '#FF2040', 0.4, true);
  s += `<text x="540" y="260" text-anchor="middle" font-family="Anton, sans-serif" font-size="200" fill="#fff" stroke="#000" stroke-width="16" paint-order="stroke">NÍVEL ZERO</text>`;
  s += `<text x="540" y="380" text-anchor="middle" font-family="Anton, sans-serif" font-size="80" fill="#FF3050" stroke="#000" stroke-width="10" paint-order="stroke">EPISÓDIO 1</text>`;
  return s;
};

E.forEach((c) => { const d = c.desenhar; c.desenhar = (lt, cc) => d(lt, cc) + acabamento('#000', 0.5); });
criarEpisodio(E, { voz: 'en-US-AndrewMultilingualNeural', velocidade: '+8%' });
