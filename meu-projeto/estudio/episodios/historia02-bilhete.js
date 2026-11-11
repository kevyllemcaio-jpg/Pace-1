// HISTÓRIA 2 — O BILHETE PREMIADO
// Beto (31) acerta os 6 números: R$ 2 milhões. O bilhete estava no bolso da calça...
// que a mãe acabou de colocar na máquina de lavar. Votação: A seca e cola os pedaços / B leva molhado na lotérica.

window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.LEGENDA_Y = 1500;
window.TRATAR_VOZ = true;
window.VISUAL = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#E67E22', oculos: false, fone: false, estampa: false };
const E = [];

function tituloGancho(linhas) {
  return `<rect width="1080" height="${120 + linhas.length * 120}" fill="#0E1430" opacity="0.6"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${190 + i * 120}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(100, 1550 / t.length)}" fill="${cor}" stroke="#15131A" stroke-width="14" paint-order="stroke">${t}</text>`).join('');
}
function maquina(x, y, lt, girando = true, esc = 1) {
  const r = girando ? lt * 600 : 0;
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<rect x="-230" y="-300" width="460" height="560" rx="30" fill="#F2F4F7" stroke="#1F1A24" stroke-width="9"/>`;
  s += `<rect x="-230" y="-300" width="460" height="100" rx="30" fill="#DDE2E8" stroke="#1F1A24" stroke-width="9"/><circle cx="-150" cy="-250" r="20" fill="#9AA3AD"/><circle cx="-90" cy="-250" r="20" fill="#9AA3AD"/><rect x="40" y="-270" width="140" height="40" rx="8" fill="#1F1A24"/><text x="110" y="-240" text-anchor="middle" font-family="Anton, sans-serif" font-size="30" fill="#6BEA8E">${girando ? '0:42' : 'FIM'}</text>`;
  s += `<circle cx="0" cy="40" r="170" fill="#BFC7D1" stroke="#1F1A24" stroke-width="9"/><circle cx="0" cy="40" r="135" fill="#7FB8E0" stroke="#1F1A24" stroke-width="7"/>`;
  s += `<g transform="rotate(${r} 0 40)"><path d="M -90 40 Q -40 -40 30 0 Q 90 40 40 110 Q -30 140 -90 40 Z" fill="#3E5C93" opacity="0.85"/><circle cx="50" cy="-20" r="14" fill="#fff" opacity="0.8"/><circle cx="-60" cy="90" r="10" fill="#fff" opacity="0.8"/></g>`;
  s += `<path d="M -80 -40 A 135 135 0 0 1 60 -70" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.6"/>`;
  return s + `</g>`;
}
function bilhete(x, y, rot, { molhado = 0, rasgado = false, esc = 1 } = {}) {
  const cor = molhado ? '#D9D6C8' : '#FFFBEF';
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">`;
  const corpo = `<rect x="-150" y="-90" width="300" height="180" rx="8" fill="${cor}" stroke="#1F1A24" stroke-width="6"/>` +
    `<rect x="-150" y="-90" width="300" height="40" rx="8" fill="#2FA45A"/><text x="0" y="-60" text-anchor="middle" font-family="Anton, sans-serif" font-size="28" fill="#fff">MEGA SORTE</text>` +
    [7, 13, 22, 35, 41, 58].map((n, i) => `<circle cx="${-115 + i * 46}" cy="10" r="20" fill="#fff" stroke="#2FA45A" stroke-width="4"/><text x="${-115 + i * 46}" y="19" text-anchor="middle" font-family="Anton, sans-serif" font-size="24" fill="#1F1A24">${n}</text>`).join('') +
    `<rect x="-120" y="50" width="240" height="18" fill="#1F1A24" opacity="${molhado ? 0.25 : 0.9}"/>`;
  if (rasgado) {
    s += `<g transform="translate(-30 -10) rotate(-12)"><svg x="-150" y="-90" width="150" height="180" overflow="hidden"><g transform="translate(150 90)">${corpo}</g></svg></g>`;
    s += `<g transform="translate(40 20) rotate(14)"><svg x="0" y="-90" width="150" height="180" overflow="hidden"><g transform="translate(0 90)">${corpo}</g></svg></g>`;
  } else s += corpo;
  if (molhado) s += `<path d="M -150 -90 L 150 90 M -80 -90 L 150 50" stroke="#9AA3AD" stroke-width="4" opacity="0.6"/><ellipse cx="20" cy="0" rx="120" ry="60" fill="#7FB8E0" opacity="${0.35 * molhado}"/>`;
  return s + `</g>`;
}
function bolaSorteio(x, y, n, k) {
  return pulo(`<circle cx="${x}" cy="${y}" r="64" fill="#fff" stroke="#1F1A24" stroke-width="7"/><circle cx="${x}" cy="${y}" r="44" fill="none" stroke="#2FA45A" stroke-width="6"/><text x="${x}" y="${y + 20}" text-anchor="middle" font-family="Anton, sans-serif" font-size="58" fill="#1F1A24">${n}</text>`, k, x, y, 0);
}
function sala(t) {
  let s = `<rect width="1080" height="1920" fill="#E9D8B8"/><rect y="1350" width="1080" height="570" fill="#B98A5E"/>`;
  s += `<rect x="140" y="420" width="800" height="500" rx="20" fill="#15131A" stroke="#1F1A24" stroke-width="10"/><rect x="170" y="450" width="740" height="440" rx="8" fill="#1E5E3A"/>`;
  s += `<rect x="500" y="920" width="80" height="80" fill="#4A4A50"/><rect x="380" y="1000" width="320" height="30" rx="10" fill="#4A4A50"/>`;
  return s;
}
function lavanderia(t) {
  let s = `<rect width="1080" height="1920" fill="#CFE6F2"/>`;
  for (let y = 0; y < 1300; y += 90) for (let x = (y / 90) % 2 ? 45 : 0; x < 1080; x += 90) s += `<rect x="${x}" y="${y}" width="86" height="86" fill="#BFDDEC"/>`;
  s += `<rect y="1300" width="1080" height="620" fill="#9FB3C2"/>`;
  s += `<line x1="0" y1="250" x2="1080" y2="280" stroke="#7A7F88" stroke-width="5"/>`;
  return s;
}

// 1 — GANCHO
E.push({
  fala: 'Ele ganhou *dois milhões* na loteria. E o bilhete... tá dentro da *máquina de lavar*.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = lavanderia(lt) + maquina(720, 1500, lt, true, 1.1);
    s += kyleCorpo({ x: 300, y: 1880, esc: 0.95, pose: 'cabeca', expr: 'panico', suor: true, t: lt });
    s += tituloGancho([['GANHEI R$ 2 MILHÕES...', '#6BEA8E'], ['E O BILHETE TÁ NA', '#fff'], ['MÁQUINA DE LAVAR', '#F7C531']]);
    return tremor(s, lt, 0.1, 10, 0.4);
  },
});

// 2 — o sorteio
E.push({
  fala: 'Sábado, oito da noite. O Beto confere o sorteio na TV. Sete. Treze. Vinte e dois. Trinta e cinco. Quarenta e um... e *cinquenta e oito*.',
  desenhar(lt, c) {
    let s = sala(lt);
    const nums = [[7, 'sete'], [13, 'treze'], [22, 'vinte'], [35, 'trinta'], [41, 'quarenta'], [58, 'cinquenta']];
    nums.forEach(([n, p], i) => { const t0 = c.w(p); s += bolaSorteio(240 + (i % 3) * 300, 580 + Math.floor(i / 3) * 180, n, lt - t0); som('pop', t0, 0.8); });
    s += kyleCorpo({ x: 540, y: 1880, esc: 0.75, pose: lt > c.w('cinquenta') ? 'comemora' : 'base', expr: lt > c.w('cinquenta') ? 'surpreso' : 'neutro', t: lt, olhar: [0, -1] });
    return s;
  },
});

// 3 — acertou
E.push({
  fala: 'Acertou os seis. *Dois milhões de reais*. Ele gritou tão alto que o vizinho bateu na parede.',
  desenhar(lt, c) {
    let s = sala(lt) + kyleClose({ x: 540, y: 1000, esc: 1.55, expr: 'sorrisao', t: lt });
    s += pulo(`<g transform="translate(540 380) rotate(-4)"><rect x="-340" y="-90" width="680" height="180" rx="30" fill="#fff" stroke="#15131A" stroke-width="8"/><text x="0" y="45" text-anchor="middle" font-family="Anton, sans-serif" font-size="130" fill="#1E9E4A">R$ 2.000.000</text></g>`, lt, 540, 380, c.w('dois'));
    som('caixa', c.w('dois'), 1);
    for (let i = 0; i < 10; i++) { const r = aleatorio(i + 20); const y = ((lt - c.w('dois')) * (500 + r() * 300)) - 100 - r() * 400; if (y > -50 && y < 1950) s += moedaSolta(r() * 1080, y); }
    return tremor(s, lt, c.w('vizinho'), 10, 0.4);
  },
});

// 4 — cadê o bilhete
E.push({
  fala: 'Aí ele procura o bilhete. Carteira, nada. Mesa, nada. Ele tinha deixado no bolso da *calça jeans*.',
  desenhar(lt, c) {
    let s = sala(lt);
    const x = 540 + Math.sin(lt * 3) * 180;
    s += kyleCorpo({ x, y: 1880, esc: 0.8, pose: 'cabeca', expr: lt > c.w('calça') ? 'determinado' : 'triste', suor: true, t: lt, p: { peD: [70, -Math.max(0, Math.sin(lt * 9)) * 30], peE: [-70, -Math.max(0, -Math.sin(lt * 9)) * 30] } });
    if (lt > c.w('calça')) s += pulo(`<g transform="translate(540 600)"><path d="M -90 -150 L 90 -150 L 110 160 L 20 160 L 0 0 L -20 160 L -110 160 Z" fill="#3E5C93" stroke="#1F1A24" stroke-width="8" stroke-linejoin="round"/><rect x="-90" y="-150" width="180" height="26" fill="#2F4A78"/></g>`, lt, 540, 600, c.w('calça'));
    return s;
  },
});

// 5 — a mãe
E.push({
  fala: 'E a mãe dele, toda feliz: lavei suas roupas, filho. *Até a calça jeans*.',
  voz: 'mulher',
  desenhar(lt, c) {
    let s = lavanderia(lt) + maquina(320, 1500, lt, true, 1.0);
    s += mae({ x: 780, y: 1860, esc: 1.1, expr: 'feliz', pose: 'acena', t: lt, fala: true });
    s += balao(lt, 0.2, { x: 700, y: 540, texto: 'LAVEI SUAS ROUPAS, FILHO!', tam: 44, ponta: 'dir' });
    return s;
  },
});

// 6 — corre pra máquina
E.push({
  fala: 'Ele correu, abriu a máquina... e o bilhete saiu assim: *molhado e rasgado ao meio*.',
  desenhar(lt, c) {
    const ta = c.w('abriu'), tm = c.w('molhado');
    let s = lavanderia(lt) + maquina(720, 1500, lt, lt < ta, 1.1);
    s += kyleCorpo({ x: mix(150, 380, lim(lt / 0.8)), y: 1880, esc: 0.9, pose: lt > tm ? 'celular' : 'aponta', expr: lt > tm ? 'panico' : 'determinado', suor: true, t: lt, anda: lt < 0.8 });
    if (lt > tm) s += pulo(bilhete(540, 620, -6, { molhado: 1, rasgado: true, esc: 1.6 }), lt, 540, 620, tm);
    if (lt > tm) for (let i = 0; i < 6; i++) { const k = ((lt - tm) * 1.2 + i * 0.17) % 1; s += `<path d="M ${400 + i * 50} ${720 + k * 200} q -8 14 0 22 q 8 -8 0 -22 Z" fill="#7FB8E0" stroke="#1F1A24" stroke-width="3" opacity="${1 - k}"/>`; }
    som('saida', tm, 0.9);
    return s;
  },
});

// 7 — a lotérica fecha
E.push({
  fala: 'A lotérica abre segunda às oito. E o código de barras... *tá sumindo*.',
  desenhar(lt, c) {
    let s = fundoTela();
    s += bilhete(540, 900, 0, { molhado: lim(0.4 + lt / c.dur), esc: 2.6 });
    s += pulo(`<circle cx="540" cy="1050" r="230" fill="none" stroke="#E8344B" stroke-width="14"/>`, lt, 540, 1050, c.w('código'));
    s += pulo(pilulaRed('SEGUNDA · 8H', 540, 360, { tam: 60 }), lt, 540, 360, 0.2);
    return s;
  },
});

// 8 — votação
E.push({
  fala: 'O que ele faz? A: seca com o secador e cola os pedaços. B: leva molhado assim mesmo e reza.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#E8344B"/><rect width="1080" height="960" fill="#2E3F9E"/>`;
    s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 400, y: 930, esc: 0.68, pose: 'celular', expr: 'determinado', t: lt })}<text x="700" y="560" font-size="170">💨</text></svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 400, y: 930, esc: 0.68, pose: 'comemora', expr: 'sem_graca', t: lt })}<text x="700" y="560" font-size="170">🙏</text></svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#15131A"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="162" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">A</text>` + pilulaRed('SECA E COLA', 560, 130, { tam: 50 }), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#E8344B" stroke="#fff" stroke-width="10"/><text x="120" y="1132" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">B</text>` + pilulaRed('LEVA MOLHADO', 560, 1100, { tam: 50 }), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// 9 — final
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira a parte dois.',
  desenhar(lt, c) {
    let s = lavanderia(lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: 'sem_graca', suor: true, t: lt });
    s += pulo(`<rect x="190" y="200" width="700" height="120" rx="60" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="282" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#15131A">A ou B? 👇</text>`, lt, 540, 260, 0.2);
    return s;
  },
});

window.CAPA = () => {
  let s = lavanderia(0.5) + maquina(780, 1560, 0.5, true, 1.0) + kyleClose({ x: 420, y: 1240, esc: 1.35, expr: 'panico', suor: true, t: 0.4 });
  s += `<text x="540" y="290" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="150" fill="#6BEA8E" stroke="#15131A" stroke-width="18" paint-order="stroke">R$ 2 MILHÕES</text>`;
  s += `<text x="540" y="420" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="78" fill="#fff" stroke="#15131A" stroke-width="12" paint-order="stroke">NA MÁQUINA DE LAVAR 😱</text>`;
  s += bilhete(800, 760, 10, { molhado: 0.6, esc: 1.3 });
  return s;
};

criarEpisodio(E, { voz: 'de-DE-FlorianMultilingualNeural', velocidade: '+8%' });
