// KYLE — Episódio 1: A LIGAÇÃO
// Formato: closes grandes do rosto com o quarto desfocado, telas de celular com o dedo tocando,
// corpo inteiro no centro do quadro, contador "FALTAM N DIAS" + barra "PARECIDO COM O KYLE DE 2015",
// votação final em tela dividida ("COMENTE UMA PALAVRA").
//
// História (original): 2h da manhã, Kyle (27) rolando o feed. O dedo escorrega e ele faz uma chamada de vídeo
// sem querer pra Manu, da escola. Ela manda mensagem, a conversa vai até amanhecer. Ela lembra dele como
// "o cara do violão, o mais estiloso da sala". Ela mora em Lisboa e volta em 30 dias pro reencontro da turma.
// Ele responde "vou sim". Hoje ele está 4% parecido com o Kyle de 2015. Votação: CABELO (1 dia) ou VIOLÃO (8 anos parado).

window.FONTE_LEGENDA = "Baloo, sans-serif";
window.LEGENDA_Y = 1500;
const E = [];

// ---------- elementos deste episódio ----------
const CARTAZ_K = [['LEVEL', '#2A2A2A'], ['UP', '#C33A3A']];
function quartoK(t, o = {}) {
  let s = quarto(t, { cartazLinhas: CARTAZ_K, ...o });
  // bagunça: caixa de pizza, meia, latinha
  s += `<g transform="translate(820 1690) rotate(-8)"><rect x="-90" y="-22" width="180" height="44" rx="6" fill="#E8C48A" stroke="#1F1A24" stroke-width="6"/><circle cx="40" cy="0" r="12" fill="#D9473F"/></g>`;
  s += `<path d="M 230 1760 q 30 -20 60 0 q 10 20 -20 26 Z" fill="#fff" stroke="#1F1A24" stroke-width="5"/>`;
  s += `<rect x="940" y="1600" width="34" height="56" rx="8" fill="#D93A3A" stroke="#1F1A24" stroke-width="5" transform="rotate(20 957 1628)"/>`;
  return s;
}
function brilhoCelular() {
  return `<defs><radialGradient id="luzCel" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="#7FC3F0" stop-opacity="0.35"/><stop offset="1" stop-color="#0E1430" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#luzCel)"/>`;
}
function fotoManu() {
  // pôr do sol em Lisboa com a Manu (desenho simples)
  let s = `<defs><linearGradient id="ceuLx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7A15A"/><stop offset="1" stop-color="#FCD9A0"/></linearGradient></defs><rect width="620" height="560" fill="url(#ceuLx)"/>`;
  s += `<circle cx="470" cy="260" r="70" fill="#FFE9B0"/>` + casario(-10, 640, 470, { semente: 7, alt: [60, 180] });
  s += `<rect y="470" width="620" height="90" fill="#C98A5E"/>`;
  s += `<g transform="translate(210 560) scale(0.62)">` + chibi({ adesivo: false, pele: '#E8A87C', cabelo: { tipo: 'longo', cor: '#5A2E1E' }, olhos: '#5A3420', roupa: { camisa: '#F2D35A', saia: '#F2D35A', calca: '#F2D35A', sapato: '#7A4E32' }, expr: 'feliz', braco: 'acena', bracoE: 'baixo', t: 0.5, x: 0, y: 0 }) + `</g>`;
  return s;
}
function polaroid(x, y, rot, conteudo, legenda) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-200" y="-230" width="400" height="470" rx="10" fill="#FBFAF5" stroke="#1F1A24" stroke-width="8"/>` +
    `<svg x="-170" y="-200" width="340" height="340" overflow="hidden"><rect width="340" height="340" fill="#8FB8DE"/>${conteudo}</svg>` +
    `<rect x="-170" y="-200" width="340" height="340" fill="none" stroke="#1F1A24" stroke-width="5"/>` +
    `<text x="0" y="200" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="46" fill="#1F1A24">${legenda}</text></g>`;
}
function violao(x, y, esc = 1, rot = 0, cabide = false) {
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">`;
  s += `<rect x="-14" y="-330" width="28" height="240" fill="#6B4228" stroke="#1F1A24" stroke-width="6"/><rect x="-24" y="-370" width="48" height="56" rx="8" fill="#4A2E1C" stroke="#1F1A24" stroke-width="6"/>`;
  s += `<path d="M 0 -110 C -110 -120 -110 -20 -60 0 C -130 30 -110 150 0 150 C 110 150 130 30 60 0 C 110 -20 110 -120 0 -110 Z" fill="#D9923A" stroke="#1F1A24" stroke-width="7"/><circle cx="0" cy="10" r="32" fill="#3A2418" stroke="#1F1A24" stroke-width="5"/>`;
  if (cabide) s += `<path d="M -110 -150 L 0 -210 L 110 -150 L 120 -20 L -120 -20 Z" fill="#E86A5A" stroke="#1F1A24" stroke-width="6" stroke-linejoin="round"/><path d="M -60 -160 L 60 -160" stroke="#1F1A24" stroke-width="4" opacity="0.4"/>`;
  return s + `</g>`;
}
function relogioCel(hora, lt) {
  return pulo(`<rect x="360" y="230" width="360" height="96" rx="48" fill="#15131A" stroke="#fff" stroke-width="4"/><text x="540" y="298" text-anchor="middle" font-family="Anton, sans-serif" font-size="58" fill="#F7C531">${hora}</text>`, lt, 540, 278, 0.05, 0.25);
}

// ---------- 1 — 2h da manhã (close) ----------
E.push({
  fala: 'Duas da manhã. O Kyle, *27 anos*, tá rolando o feed no escuro.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 880, esc: 1.55, expr: 'sono', t: lt, olhar: [0, 1] }) + brilhoCelular();
    s += relogioCel('02:00', lt);
    return s;
  },
});

// ---------- 2 — o feed e o dedo que escorrega ----------
E.push({
  fala: 'Até que aparece a Manu. Da escola. E o dedão escorrega... bem na *chamada de vídeo*.',
  desenhar(lt, c) {
    const tc = c.w('chamada');
    const rola = lt < c.w('manu') ? -lim(lt / 1.2) * 0 : 0;
    let s = fundoTela();
    if (lt < tc + 0.25) {
      s += celularUI({ tela: 'feed', foto: fotoManu(), y: 900 + rola });
      const k = lt < c.w('escorrega') ? suave(lt / 0.6) : 1;
      const dx = lt < c.w('escorrega') ? 600 : mix(600, 820, suave((lt - c.w('escorrega')) / 0.5));
      const dy = lt < c.w('escorrega') ? 1250 + Math.sin(lt * 5) * 40 : mix(1250, 400, suave((lt - c.w('escorrega')) / 0.5));
      s += dedo(dx, dy, k);
    } else {
      s += celularUI({ tela: 'chamando', nome: 'manu.reis' });
    }
    som('pop', tc, 0.9);
    return s;
  },
});

// ---------- 3 — pânico (close) ----------
E.push({
  fala: 'Ele não falava com ela desde *2015*.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 880, esc: 1.6, expr: 'panico', suor: true, t: lt }) + brilhoCelular();
    return tremor(s, lt, 0.05, 14, 0.4);
  },
});

// ---------- 4 — desliga e joga o celular (corpo inteiro) ----------
E.push({
  fala: 'Desligou na hora, jogou o celular na cama... e ficou olhando pro teto.',
  desenhar(lt, c) {
    const tj = c.w('jogou');
    const pose = lt < tj ? 'celular' : lt < tj + 1.2 ? 'cabeca' : 'base';
    let mundo = quartoK(lt) + `<rect width="1080" height="1920" fill="#0E1430" opacity="0.25"/>`;
    if (lt > tj) {
      const k = lim((lt - tj) / 0.5);
      const x = mix(640, 260, k), y = mix(1020, 1530, k) - Math.sin(k * Math.PI) * 200;
      mundo += `<g transform="translate(${x} ${y}) rotate(${k * 400})"><rect x="-26" y="-48" width="52" height="96" rx="10" fill="#22262F" stroke="#1F1A24" stroke-width="6"/><rect x="-19" y="-38" width="38" height="72" rx="4" fill="#7FC3F0"/></g>`;
    }
    mundo += kyleCorpo({ x: 560, y: 1660, esc: 1.0, pose, celular: lt < tj, expr: lt > tj + 1.2 ? 'triste' : 'panico', suor: true, t: lt, olhar: lt > tj + 1.2 ? [0, -1] : [0, 0] });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1150 });
  },
});

// ---------- 5 — mensagem dela ----------
E.push({
  fala: 'Dois minutos depois: *mensagem*.',
  desenhar(lt, c) {
    const msgs = [{ de: 'ela', txt: 'você me ligou?? 😂' }];
    if (lt > 1.0) msgs.push({ de: 'ela', txt: 'kyle?? da 3ºB???' });
    if (lt > 0.4) som('bolha', 0.4, 0.8);
    som('bolha', 1.0, 0.8);
    return fundoTela() + celularUI({ tela: 'chat', hora: '2:15', msgs: lt > 0.4 ? msgs : [], digitando: lt < 0.4 });
  },
});

// ---------- 6 — a conversa vai até amanhecer ----------
E.push({
  fala: 'E a conversa engata. Uma hora. Duas. *Até amanhecer*.',
  desenhar(lt, c) {
    const k = lim(lt / c.dur);
    let mundo = quarto(lt, { cartazLinhas: CARTAZ_K });
    mundo += `<rect width="1080" height="1920" fill="#F2A65A" opacity="${0.25 * k}"/><rect width="1080" height="1920" fill="#0E1430" opacity="${0.3 * (1 - k)}"/>`;
    mundo += kyleCorpo({ x: 540, y: 1660, esc: 1.0, pose: 'celular', celular: true, expr: 'sorrisao', t: lt, olhar: [0, 1], p: { agach: Math.abs(Math.sin(lt * 4)) * 14, peD: [70, -Math.max(0, Math.sin(lt * 8)) * 20] } });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1150 });
    s += relogioCel(['03:00', '04:00', '05:00', '06:00'][Math.min(3, Math.floor(k * 4))], lt);
    return s;
  },
});

// ---------- 7 — o cara do violão ----------
E.push({
  fala: 'Ela lembra dele como o cara do violão no intervalo. *O mais estiloso da sala*.',
  desenhar(lt, c) {
    const msgs = [{ de: 'ela', txt: 'lembro de vc tocando violão' }, { de: 'ela', txt: 'no intervalo kkkk' }];
    if (lt > c.w('estiloso') - 0.2) msgs.push({ de: 'ela', txt: 'vc era o mais estiloso da sala' });
    som('bolha', c.w('estiloso') - 0.2, 0.8);
    return fundoTela() + celularUI({ tela: 'chat', hora: '5:41', msgs });
  },
});

// ---------- 8 — a realidade (close orgulhoso -> corpo inteiro) ----------
E.push({
  fala: 'O problema é que esse cara... se *aposentou em 2016*.',
  desenhar(lt, c) {
    const tr = c.w('aposentou');
    if (lt < tr) return quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 880, esc: 1.55, expr: 'sonhador', vergonha: 0.6, t: lt });
    let mundo = quartoK(lt);
    mundo += violao(250, 1500, 1.0, -10, true);
    mundo += kyleCorpo({ x: 600, y: 1660, esc: 1.0, pose: 'base', expr: 'neutro', t: lt });
    let s = camLenta(mundo, lt - tr, c.dur - tr, { z0: 1.25, z1: 1.0, cy: 1150 });
    s += carimbo(lt, tr + 0.3, { x: 540, y: 1280, texto: 'REALIDADE', rot: -6, tam: 100 });
    return s;
  },
});

// ---------- 9 — 2015 x hoje ----------
E.push({
  fala: 'Óculos fundo de garrafa, barba de três semanas... e o violão *virou cabide*.',
  desenhar(lt, c) {
    let s = fundoTela();
    const kyle2015 = `<g transform="translate(170 250) scale(0.62)">${kyleCabeca({ expr: 'feliz', t: 0.5, semente: 99, barba: false })}</g>` + violao(255, 420, 0.5, 25);
    const kyleHoje = `<g transform="translate(170 250) scale(0.62)">${kyleCabeca({ expr: 'sono', t: lt, semente: 4 })}</g>`;
    s += pulo(`<g transform="translate(300 560) scale(1.15) translate(-300 -560)">${polaroid(300, 560, -6, kyle2015, 'KYLE · 2015')}</g>`, lt, 300, 560, 0.1);
    s += pulo(`<g transform="translate(780 860) scale(1.15) translate(-780 -860)">${polaroid(780, 860, 5, kyleHoje, 'KYLE · HOJE')}</g>`, lt, 780, 860, 0.5);
    s += pulo(violao(300, 1500, 0.85, -8, true), lt, 300, 1400, c.w('cabide'));
    som('pop', 0.1, 0.8); som('pop', 0.5, 0.8); som('carimbo', c.w('cabide'), 0.6);
    return s;
  },
});

// ---------- 10 — Lisboa e o reencontro ----------
E.push({
  fala: 'Aí ela conta: mora em Lisboa. E volta em *30 dias*, pro reencontro da turma.',
  desenhar(lt, c) {
    const msgs = [{ de: 'ela', txt: 'tô morando em lisboa agora' }];
    if (lt > c.w('volta') - 0.2) msgs.push({ de: 'ela', txt: 'volto dia 20 pro reencontro da 3ºB' });
    if (lt > c.w('turma')) msgs.push({ de: 'ela', txt: 'vc vai??' });
    som('bolha', c.w('volta') - 0.2, 0.8); som('bolha', c.w('turma'), 0.8);
    return fundoTela() + celularUI({ tela: 'chat', hora: '6:02', msgs });
  },
});

// ---------- 11 — "vou sim" ----------
E.push({
  fala: 'Ele respondeu: *vou sim*.',
  desenhar(lt, c) {
    if (lt < 0.9) return quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 880, esc: 1.6, expr: 'determinado', suor: true, t: lt, olhar: [0, 1] });
    som('bolha', 0.9, 0.8);
    return fundoTela() + celularUI({ tela: 'chat', hora: '6:03', msgs: [{ de: 'ela', txt: 'volto dia 20 pro reencontro da 3ºB' }, { de: 'ela', txt: 'vc vai??' }, { de: 'eu', txt: 'vou sim 🙂' }] });
  },
});

// ---------- 12 — contador ----------
E.push({
  fala: 'Trinta dias. E hoje ele tá *4% parecido* com o Kyle de 2015.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 980, esc: 1.5, expr: lt > c.w('4') ? 'triste' : 'determinado', t: lt });
    s += hudReencontro(30, 4, lt, true);
    som('saida', c.w('4'), 0.7);
    return s;
  },
});

// ---------- 13 — votação ----------
E.push({
  fala: 'Por onde ele começa? Pelo *cabelo*, que leva um dia... ou pelo *violão*, que ele não toca há oito anos?',
  legendaY: 1560,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#E8344B"/><path d="M 0 0 L 600 0 L 480 1920 L 0 1920 Z" fill="#F2B233"/><path d="M 600 0 L 480 1920" stroke="#fff" stroke-width="12"/>`;
    s += hudReencontro(30, 4, lt);
    s += pulo(`<rect x="300" y="250" width="480" height="84" rx="16" fill="#15131A" stroke="#fff" stroke-width="4"/><text x="540" y="308" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="44" fill="#fff">COMENTE UMA PALAVRA</text>`, lt, 540, 292, 0.1);
    const lados = [[280, 'CABELO', 'LEVA 1 DIA', '✂️', c.w('cabelo')], [810, 'VIOLÃO', '8 ANOS PARADO', '🎸', c.w('violão')]];
    for (const [x, t1, t2, ic, t0] of lados) {
      s += pulo(`<text x="${x}" y="470" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="104" fill="#fff" stroke="#15131A" stroke-width="12" paint-order="stroke">${t1}</text>` +
        `<text x="${x}" y="522" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#fff">${t2}</text>` +
        `<text x="${x}" y="680" text-anchor="middle" font-size="110">${ic}</text>` +
        `<g transform="translate(${x} 1060) scale(0.95)">${kyleCabeca({ expr: 'sorrisao', t: lt, semente: x })}</g>`, lt, x, 800, t0);
      som('pop', t0, 0.8);
    }
    s += `<circle cx="540" cy="560" r="62" fill="#15131A" stroke="#fff" stroke-width="6"/><text x="540" y="580" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="52" fill="#F7C531">OU</text>`;
    return s;
  },
});

// ---------- 14 — chamada final ----------
E.push({
  fala: 'Comenta *uma palavra*. Você decide o próximo episódio.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 880, esc: 1.55, expr: 'sorrisao', t: lt });
    s += pulo(`<rect x="170" y="230" width="740" height="110" rx="55" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="305" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="58" fill="#15131A">CABELO ou VIOLÃO? 👇</text>`, lt, 540, 285, 0.3);
    return s;
  },
});

// Capa: close do rosto + palavra-tema (padrão do perfil).
window.CAPA = () => {
  let s = quartoDesfocado(0.4) + kyleClose({ x: 540, y: 1150, esc: 1.7, expr: 'panico', suor: true, t: 0.4 }) + brilhoCelular();
  s += `<text x="545" y="400" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="190" fill="#000" opacity="0.35">LIGUEI</text>`;
  s += `<text x="540" y="390" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="190" fill="#fff" stroke="#15131A" stroke-width="20" paint-order="stroke">LIGUEI</text>`;
  s += `<text x="540" y="530" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="110" fill="#F7C531" stroke="#15131A" stroke-width="16" paint-order="stroke">SEM QUERER</text>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });
