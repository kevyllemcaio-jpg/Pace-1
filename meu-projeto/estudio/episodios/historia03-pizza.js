// HISTÓRIA 3 — A ÚLTIMA PIZZA
// Léo (22) pede pizza às 3h. O entregador é ele mesmo, 10 anos mais velho, com um aviso:
// "amanhã, NÃO manda aquela mensagem". Votação: A acredita / B fecha a porta.

window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.LEGENDA_Y = 1500;
window.TRATAR_VOZ = true;
const JOVEM = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#5A3A24', camisa: '#2BA59A', oculos: false, fone: false, estampa: false };
const VELHO = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#9A9AA2', camisa: '#D93A3A', oculos: false, fone: false, estampa: false };
window.VISUAL = JOVEM;
const E = [];

function tituloGancho(linhas) {
  return `<rect width="1080" height="${120 + linhas.length * 120}" fill="#0E1430" opacity="0.6"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${190 + i * 120}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(100, 1550 / t.length)}" fill="${cor}" stroke="#15131A" stroke-width="14" paint-order="stroke">${t}</text>`).join('');
}
function bone() {
  return `<path d="M -170 -150 Q -170 -300 0 -300 Q 170 -300 170 -150 Z" fill="#D93A3A" stroke="#1F1A24" stroke-width="9"/><path d="M 60 -160 Q 230 -170 250 -130 Q 160 -120 60 -140 Z" fill="#B32D2F" stroke="#1F1A24" stroke-width="8"/>` +
    `<circle cx="0" cy="-230" r="34" fill="#F7C531" stroke="#1F1A24" stroke-width="6"/><text x="0" y="-218" text-anchor="middle" font-size="36">🍕</text>`;
}
// Close do Léo de 32 anos (cabelo grisalho, boné de entregador, cicatriz).
function velhoClose(o) {
  const esc = o.esc || 1.5;
  return kyleClose({ ...o, visual: VELHO }) + `<g transform="translate(${o.x || 540} ${(o.y || 880) + Math.sin((o.t || 0) * 2.2) * 6}) scale(${esc})">${bone()}<path d="M 70 -110 L 110 -60" stroke="#B5655A" stroke-width="7" stroke-linecap="round"/></g>`;
}
function caixaPizza(x, y, rot = 0, esc = 1, aberta = false) {
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">`;
  s += `<rect x="-170" y="-30" width="340" height="60" rx="6" fill="#D9B07A" stroke="#1F1A24" stroke-width="7"/>`;
  if (aberta) s += `<path d="M -170 -30 L -170 -330 L 170 -330 L 170 -30" fill="#E8C48A" stroke="#1F1A24" stroke-width="7"/><circle cx="0" cy="-10" r="140" fill="#F2A65A" stroke="#1F1A24" stroke-width="6"/><circle cx="0" cy="-10" r="115" fill="#F7D35A"/>` +
    [[-50, -40], [40, -60], [10, 30], [-60, 40], [70, 20]].map(([a, b]) => `<circle cx="${a}" cy="${b - 10}" r="18" fill="#D9473F"/>`).join('') +
    `<rect x="-120" y="-250" width="240" height="90" rx="6" fill="#fff" stroke="#1F1A24" stroke-width="5"/><text x="0" y="-210" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="30" fill="#D93A3A">NÃO MANDA</text><text x="0" y="-175" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="30" fill="#D93A3A">A MENSAGEM</text>`;
  else s += `<rect x="-170" y="-60" width="340" height="40" rx="6" fill="#E8C48A" stroke="#1F1A24" stroke-width="7"/><text x="0" y="-30" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="30" fill="#D93A3A">PIZZA 24H</text>`;
  return s + `</g>`;
}
function porta(t, aberta = 1) {
  let s = `<rect width="1080" height="1920" fill="#3A3550"/><rect y="1600" width="1080" height="320" fill="#5A4E40"/>`;
  s += `<rect x="190" y="300" width="700" height="1300" fill="#0E0D18" stroke="#1F1A24" stroke-width="10"/>`;
  s += `<rect x="210" y="320" width="660" height="1280" fill="#1B2240"/><circle cx="540" cy="600" r="120" fill="#F7E7A0" opacity="0.25"/>`;
  s += `<path d="M 190 300 L ${190 + 700 * (1 - aberta)} ${300 + 40 * aberta} L ${190 + 700 * (1 - aberta)} ${1600 - 40 * aberta} L 190 1600 Z" fill="#8A5A3C" stroke="#1F1A24" stroke-width="8"/>`;
  return s;
}
function luzCel() {
  return `<defs><radialGradient id="luzC" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="#7FC3F0" stop-opacity="0.35"/><stop offset="1" stop-color="#0E1430" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#luzC)"/>`;
}
function relogio(hora, lt) {
  return pulo(`<rect x="360" y="110" width="360" height="110" rx="55" fill="#15131A" stroke="#fff" stroke-width="5"/><text x="540" y="190" text-anchor="middle" font-family="Anton, sans-serif" font-size="74" fill="#F7C531">${hora}</text>`, lt, 540, 165, 0.05, 0.25);
}

// 1 — GANCHO
E.push({
  fala: 'Ele pediu pizza às três da manhã. E o entregador era *ele mesmo*. Dez anos mais velho.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = porta(lt, 1);
    s += `<g transform="translate(-270 0)">${kyleCorpo({ x: 540, y: 1880, esc: 0.8, pose: 'cabeca', expr: 'panico', suor: true, t: lt })}</g>`;
    s += `<g transform="translate(240 0)">${kyleCorpo({ x: 540, y: 1700, esc: 0.8, pose: 'celular', expr: 'determinado', t: lt, visual: VELHO })}</g>`;
    s += `<g transform="translate(780 920) scale(0.52)">${bone()}</g>`;
    s += caixaPizza(800, 1250, -4, 0.8);
    s += tituloGancho([['PEDI PIZZA ÀS 3H...', '#fff'], ['E O ENTREGADOR', '#fff'], ['ERA EU MESMO', '#F7C531']]);
    return tremor(s, lt, 0.1, 8, 0.4);
  },
});

// 2 — a noite
E.push({
  fala: 'Três da manhã. O Léo, vinte e dois anos, sem sono, abre o aplicativo e pede a pizza mais barata.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: 'sono', t: lt, olhar: [0, 1] }) + luzCel();
    s += relogio('03:00', lt);
    return s;
  },
});

// 3 — a campainha
E.push({
  fala: 'Dois minutos depois... *a campainha toca*.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: lt > c.w('campainha') ? 'surpreso' : 'sono', t: lt }) + luzCel();
    if (lt > c.w('campainha')) s += pulo(`<text x="540" y="560" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="130" fill="#F7C531" stroke="#15131A" stroke-width="14" paint-order="stroke">DING DONG</text>`, lt, 540, 520, c.w('campainha'));
    som('caixa', c.w('campainha'), 1);
    s += relogio('03:02', lt);
    return tremor(s, lt, c.w('campainha'), 8, 0.3);
  },
});

// 4 — abre a porta
E.push({
  fala: 'Ele abre a porta. O entregador tira o capacete... e é a cara dele. Cabelo branco, uma cicatriz na testa... mas *é ele*.',
  desenhar(lt, c) {
    const ab = suave(lt / 0.9);
    let s = porta(lt, ab);
    if (lt > 0.6) s += velhoClose({ x: 540, y: 1000, esc: 1.15, expr: 'neutro', t: lt });
    return s;
  },
});

// 5 — o Léo de 32
E.push({
  fala: 'Eu sou você, com trinta e dois anos. Não tenho muito tempo. Escuta.',
  desenhar(lt, c) {
    let s = porta(lt, 1) + velhoClose({ x: 540, y: 1000, esc: 1.35, expr: 'determinado', fala: true, t: lt });
    s += balaoRed(lt, 0.2);
    return s;
  },
});
function balaoRed(lt, t0) {
  return balao(lt, t0, { x: 540, y: 380, texto: 'EU SOU VOCÊ. COM 32 ANOS.', tam: 48 });
}

// 6 — a pizza com o bilhete
E.push({
  fala: 'Ele entrega a pizza. Dentro da caixa, um bilhete: *amanhã, não manda aquela mensagem*.',
  desenhar(lt, c) {
    const ab = lt > c.w('dentro');
    let s = fundoTela() + caixaPizza(540, 1300, 0, 1.6, ab);
    if (!ab) s += `<g transform="translate(0 0)">${kyleClose({ x: 540, y: 700, esc: 0.9, expr: 'surpreso', t: lt })}</g>`;
    som('pop', c.w('dentro'), 0.9);
    return s;
  },
});

// 7 — qual mensagem
E.push({
  fala: 'Qual mensagem? O Léo tinha um rascunho pronto pra Bia. Três anos de amor guardado. Ia mandar amanhã cedo.',
  desenhar(lt, c) {
    return fundoTela() + celularUI({ tela: 'chat', nome: 'bia ❤️', hora: '03:05', online: false, msgs: [{ de: 'eu', txt: 'bia, preciso te falar uma coisa...' }, { de: 'eu', txt: 'eu gosto de você desde 2021 💌' }] }) +
      pulo(pilulaRed('RASCUNHO', 540, 1700, { tam: 60 }), lt, 540, 1700, c.w('rascunho'));
  },
});

// 8 — ele some
E.push({
  fala: 'Ele pergunta: por quê? Mas o entregador só diz: *confia em mim*. E some no elevador.',
  desenhar(lt, c) {
    const ts = c.w('some');
    let s = porta(lt, 1);
    const op = lt > ts ? 1 - lim((lt - ts) / 0.6) : 1;
    s += `<g opacity="${op}">${velhoClose({ x: 540, y: 1000, esc: 1.2, expr: 'triste', t: lt, fala: lt < ts })}</g>`;
    if (lt > ts) s += `<g transform="translate(0 0)">${kyleClose({ x: 540, y: 1000, esc: 1.2, expr: 'surpreso', t: lt })}</g>`.replace('<g transform', `<g opacity="${lim((lt - ts) / 0.6)}" transform`);
    return s;
  },
});

// 9 — votação
E.push({
  fala: 'O que o Léo faz? A: acredita e apaga a mensagem. B: manda mesmo assim.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#E8344B"/><rect width="1080" height="960" fill="#2E3F9E"/>`;
    s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 400, y: 930, esc: 0.68, pose: 'celular', celular: true, expr: 'triste', t: lt })}<text x="700" y="560" font-size="170">🗑️</text></svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 400, y: 930, esc: 0.68, pose: 'celular', celular: true, expr: 'determinado', t: lt })}<text x="700" y="560" font-size="170">💌</text></svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#15131A"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="162" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">A</text>` + pilulaRed('ACREDITA E APAGA', 560, 130, { tam: 50 }), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#E8344B" stroke="#fff" stroke-width="10"/><text x="120" y="1132" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">B</text>` + pilulaRed('MANDA ASSIM MESMO', 560, 1100, { tam: 50 }), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// 10 — final
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira a parte dois.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: 'sem_graca', t: lt, olhar: [0, 1] }) + luzCel();
    s += pulo(`<rect x="190" y="200" width="700" height="120" rx="60" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="282" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#15131A">A ou B? 👇</text>`, lt, 540, 260, 0.2);
    return s;
  },
});

window.CAPA = () => {
  let s = porta(0.5, 1);
  s += `<g transform="translate(-250 0)">${kyleClose({ x: 540, y: 1300, esc: 1.0, expr: 'panico', suor: true, t: 0.4 })}</g>`;
  s += `<g transform="translate(250 0)">${velhoClose({ x: 540, y: 1300, esc: 1.0, expr: 'determinado', t: 0.4 })}</g>`;
  s += `<text x="540" y="300" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="120" fill="#fff" stroke="#15131A" stroke-width="16" paint-order="stroke">O ENTREGADOR</text>`;
  s += `<text x="540" y="430" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="100" fill="#F7C531" stroke="#15131A" stroke-width="14" paint-order="stroke">ERA EU MESMO 🍕</text>`;
  s += `<g transform="translate(790 1820) rotate(-6)"><rect x="-200" y="-50" width="400" height="100" rx="50" fill="#E8344B" stroke="#15131A" stroke-width="6"/><text x="0" y="20" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="52" fill="#fff">+10 ANOS</text></g>`;
  return s;
};

criarEpisodio(E, { voz: 'de-DE-FlorianMultilingualNeural', velocidade: '+8%' });
