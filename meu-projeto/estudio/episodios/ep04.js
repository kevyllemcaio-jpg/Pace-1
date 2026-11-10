// Kevylem Vai Ficar Rico! — Episódio 4: O DELIVERY
// Público: "paga a licença e, enquanto ela não sai, vende pelo WhatsApp".
// Formato curto: gancho no 1º quadro, resumo pálido de ~3 s logo depois, ~55 s no total.
//
// Contas conferidas (continua do episódio 3):
//   Fim do ep. 3: dia 5, saldo R$ 410. Formatura: 476 dias.
//   Dia 6: paga a licença R$ 150 -> R$ 260. Licença sai em 2 semanas. Formatura: 475.
//   Combo família: 10 geladinhos por R$ 18, entregue na porta.
//   Freezer da mãe: cabe 80 geladinhos por dia = 8 combos.
//   6 dias x 8 combos = 48 combos x R$ 18 = R$ 864.
//   Custo: 48 pacotes de suco (R$ 48) + 5 pacotes de 100 saquinhos (R$ 15) = R$ 63. Lucro: 864 - 63 = R$ 801.
//   Saldo: 260 + 801 = R$ 1.061. Dia 12 -> formatura 469 dias.
//   Pedidos recusados por falta de freezer: 70.
//   Escolha: freezer usado R$ 600 ou alugar o da vizinha por R$ 15/dia.

const E = [];

// ---------- personagem e objetos deste episódio ----------
function vizinha(o) {
  return pessoa({ pele: '#C68E62', cabelo: { tipo: 'black', cor: '#2B1D16' }, roupa: { camisa: '#7FC3D9', calca: '#3A3F4A' }, saia: '#3A3F4A', brinco: true, semente: 23, ...o });
}
function celular(lt, { pedidos = 0, x = 0, y = 0, esc = 1 } = {}) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<rect x="-150" y="-280" width="300" height="560" rx="40" fill="#1C1F26" stroke="#2A2A2A" stroke-width="6"/>`;
  s += `<rect x="-132" y="-250" width="264" height="500" rx="18" fill="#ECE5DA"/>`;
  s += `<rect x="-132" y="-250" width="264" height="74" rx="18" fill="#1F8A5B"/><rect x="-132" y="-200" width="264" height="24" fill="#1F8A5B"/>`;
  s += `<circle cx="-96" cy="-213" r="20" fill="#F2C230"/>` + txt('GELADINHO DO KEVYLEM', 10, -205, { tam: 20, cor: '#fff' });
  const msgs = ['QUERO 1 COMBO!', 'TEM DE UVA?', 'MANDA 2 COMBOS', 'ENTREGA NA RUA 5?', 'QUERO 1!', 'TEM AMANHÃ?', 'MANDA 1 COMBO'];
  for (let i = 0; i < Math.min(pedidos, 7); i++) {
    const yy = -150 + i * 56;
    s += `<rect x="-120" y="${yy}" width="${msgs[i].length * 11 + 30}" height="42" rx="12" fill="#fff"/>` + txt(msgs[i], -105, yy + 28, { tam: 19, cor: '#222', anc: 'start' });
  }
  return s + `</g>`;
}
function notificacao(x, y, texto) {
  return `<g transform="translate(${x} ${y})"><rect x="-190" y="-38" width="380" height="76" rx="20" fill="#fff" stroke="#2A2A2A" stroke-width="4"/>` +
    `<circle cx="-150" cy="0" r="22" fill="#1F8A5B"/>` + txt('✓', -150, 10, { tam: 28, cor: '#fff' }) + txt(texto, 10, 12, { tam: 34, cor: '#222' }) + `</g>`;
}
function freezerMae(x, y, esc = 1, cheio = true) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<rect x="-130" y="-170" width="260" height="170" rx="14" fill="#F4F6F8" stroke="#2A2A2A" stroke-width="5"/>`;
  s += `<rect x="-140" y="-190" width="280" height="34" rx="10" fill="#E0E5EA" stroke="#2A2A2A" stroke-width="5"/>`;
  if (cheio) for (let i = 0; i < 8; i++) s += geladinho(CORES_GELADINHO[i % 6], -105 + i * 30, -205, -6 + i * 2, 0.55);
  return s + `<rect x="-40" y="-120" width="80" height="14" rx="7" fill="#9AA3AD"/></g>`;
}
function sacola(x, y, esc = 1) {
  return `<g transform="translate(${x} ${y}) scale(${esc})"><path d="M -40 -50 L 40 -50 L 48 50 L -48 50 Z" fill="#F7F7F7" stroke="#2A2A2A" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M -22 -50 Q -22 -82 0 -82 Q 22 -82 22 -50" fill="none" stroke="#2A2A2A" stroke-width="5"/>` +
    geladinho('#E8434F', -14, -40, -10, 0.45) + geladinho('#8E44AD', 8, -40, 8, 0.45) + `</g>`;
}
// Rua do bairro com portas de casas (entregas).
function ruaBairro(t) {
  let s = ceu('#F2B36B', '#FBE1B8', 'ceuBairro');
  s += casario(-20, 1100, 1200, { semente: 61, alt: [380, 640], janelas: true });
  [[120, '#2F5FA8'], [460, '#B5452F'], [800, '#2F8F5B']].forEach(([x, cor]) =>
    (s += `<rect x="${x}" y="1020" width="130" height="180" fill="${cor}" stroke="#2A2A2A" stroke-width="4"/><circle cx="${x + 105}" cy="1115" r="7" fill="#F2C230"/>`));
  s += `<rect y="1200" width="1080" height="720" fill="#CFC8B6"/><rect y="1200" width="1080" height="14" fill="#B9B2A2"/>`;
  return s;
}

// ---------- 1 — GANCHO ----------
E.push({
  fala: 'Proibido de vender na rua, ele lucrou *801 reais* em 6 dias. Só pelo celular.',
  capa: 0.05,
  legendaY: 1060,
  desenhar(lt, c) {
    let mundo = quarto(lt) + kevylem({ x: 300, y: 1840, esc: 0.9, expr: 'surpreso', pose: 'segura', t: lt, segura: `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" rx="4" fill="#3BD16F"/>`, olhar: [0, 1] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300, soco: false });
    s += `<rect width="1080" height="900" fill="#000" opacity="0.25"/>`;
    [['PROIBIDO NA RUA...', '#FFFFFF'], ['LUCROU R$ 801', '#6BEA8E'], ['PELO CELULAR', '#FFD21F']].forEach(([t, cor], i) =>
      (s += txt(t, 540, 470 + i * 140, { tam: Math.min(130, 960 / (t.length * 0.45)), cor, fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 })));
    // notificações pulando
    for (let i = 0; i < 4; i++) s += pulo(notificacao(760 - (i % 2) * 60, 1160 + i * 100, 'NOVO PEDIDO'), lt, 760, 1160 + i * 100, 0.4 + i * 0.35, 0.25);
    for (let i = 0; i < 4; i++) som('bolha', 0.4 + i * 0.35, 0.8);
    return s;
  },
});

// ---------- 2 — Resumo curto (pálido) ----------
E.push({
  fala: 'O fiscal chegou e vocês decidiram: tira a licença e vende pelo WhatsApp.',
  lembranca: 'inicio',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'preocupado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9), olhar: [1, 0] });
    mundo += fiscal({ x: 760, y: 1840, esc: 0.74, expr: 'bravo', pose: 'aponta', vira: -1, t: lt, olhar: [-1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.2, z1: 1.3, cx: 560, cy: 1400 });
    s += pulo(`<circle cx="380" cy="680" r="90" fill="#2F6DB5" stroke="#fff" stroke-width="10"/>` + txt('A', 380, 718, { tam: 110, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 380, 680, c.w('licença'));
    s += pulo(`<circle cx="700" cy="680" r="90" fill="#D7262B" stroke="#fff" stroke-width="10"/>` + txt('B', 700, 718, { tam: 110, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 700, 680, c.w('whatsapp'));
    s += pulo(txt('+', 540, 715, { tam: 120, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 14 }), lt, 540, 680, c.w('whatsapp'));
    return s;
  },
});

// ---------- 3 — Pagou a licença ----------
E.push({
  fala: 'Dia 6. Pagou *150 reais* na licença. Mas ela só sai daqui a *2 semanas*.',
  hud: { dia: 6, saldo: 260, de: 410, formatura: 475, quando: '150' },
  hudNovo: true,
  desenhar(lt, c) {
    let s = camLenta(pontoOnibus(lt) + kevylem({ x: 540, y: 1860, esc: 1.0, expr: 'determinado', pose: 'segura', t: lt, segura: prancheta() }), lt, c.dur, { z0: 1.1, z1: 1.18, cy: 1400 });
    s += pulo(pilula('EPISÓDIO 4', 540, 270), lt, 540, 270, 0);
    s += carimbo(lt, c.w('150'), { x: 290, y: 600, texto: 'PAGO', rot: -8, tam: 110, cor: '#1E9E4A' });
    s += card(lt, c.w('2'), { x: 790, y: 580, w: 280, h: 250, rot: 5, conteudo: `<g transform="translate(0 -30) scale(3) translate(0 30)">${iconeCalendario(0, -30)}</g>` + txt('2 SEMANAS', 0, 95, { tam: 44 }) });
    return s;
  },
});

// ---------- 4 — O delivery ----------
E.push({
  fala: 'Então ele montou um delivery: *10 geladinhos por 18 reais*, entregue na porta.',
  hud: { dia: 6, saldo: 260, formatura: 475 },
  passo: 'NOVO JEITO · DELIVERY',
  passoNovo: true,
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + kevylem({ x: 260, y: 1840, esc: 0.85, expr: 'sorriso', pose: 'aponta', t: lt, olhar: [1, 0] }), lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1300 });
    s += pulo(celular(lt, { pedidos: 0, x: 760, y: 1250, esc: 1.1 }), lt, 760, 1250, 0.2);
    s += card(lt, c.w('10'), { x: 540, y: 600, w: 440, h: 230, rot: -3, conteudo: Array.from({ length: 5 }, (_, i) => geladinho(CORES_GELADINHO[i], -170 + i * 34, -10, -8 + i * 4, 0.7)).join('') + txt('10 POR', 70, -10, { tam: 54, cor: '#222', fonte: F_TIT, peso: 400 }) + txt('R$ 18', 70, 75, { tam: 84, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 5 — 22 pedidos ----------
E.push({
  fala: 'Na primeira noite: *22 pedidos*.',
  hud: { dia: 6, saldo: 260, formatura: 475 },
  desenhar(lt, c) {
    const n = Math.floor(lim((lt - 0.2) / 1.3) * 7);
    let s = camLenta(quarto(lt, { luz: 0.8 }) + kevylem({ x: 260, y: 1840, esc: 0.85, expr: 'surpreso', t: lt, olhar: [1, 0] }), lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1300 });
    s += celular(lt, { pedidos: n, x: 760, y: 1250, esc: 1.1 });
    for (let i = 0; i < 7; i++) som('bolha', 0.2 + i * 0.19, 0.6);
    s += card(lt, c.w('22'), { x: 300, y: 600, w: 300, h: 220, rot: -5, conteudo: txt('22', 0, 40, { tam: 140, cor: '#1F8A5B', fonte: F_TIT, peso: 400 }) + txt('PEDIDOS', 0, 85, { tam: 34 }) });
    return s;
  },
});

// ---------- 6 — O freezer da mãe ----------
E.push({
  fala: 'Só que o freezer da mãe só cabe *80 geladinhos* por dia.',
  hud: { dia: 6, saldo: 260, formatura: 475 },
  desenhar(lt, c) {
    let mundo = cozinha(lt, { noite: true, vapor: false });
    mundo += freezerMae(820, 1600, 1.2);
    mundo += mae({ x: 520, y: 1760, esc: 0.75, expr: 'preocupado', pose: 'cintura', t: lt, olhar: [1, 0] });
    mundo += kevylem({ x: 230, y: 1800, esc: 0.7, expr: 'preocupado', t: lt, olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.12, cx: 560, cy: 1350 });
    s += carimbo(lt, c.w('80'), { x: 540, y: 620, texto: 'LOTADO', rot: -7, tam: 120 });
    return s;
  },
});

// ---------- 7 — Entregas a pé ----------
E.push({
  fala: 'Então ele fez o que dava: *8 combos por dia*, entregando a pé no bairro.',
  hud: { dia: 8, saldo: 260, formatura: 473 },
  desenhar(lt, c) {
    const x = mix(-150, 1200, lim(lt / c.dur));
    let mundo = ruaBairro(lt);
    mundo += kevylem({ x, y: 1820, esc: 0.72, expr: 'determinado', pose: 'segura', t: lt, anda: true, segura: sacola(-40, 40, 1) + sacola(40, 40, 1) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.03, cy: 1300 });
    s += card(lt, c.w('8'), { x: 540, y: 560, w: 320, h: 220, rot: -3, conteudo: sacola(-80, -10, 1.3) + txt('8', 70, 40, { tam: 140, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) + txt('POR DIA', 0, 90, { tam: 30 }) });
    return s;
  },
});

// ---------- 8 — O resultado ----------
E.push({
  fala: 'Em 6 dias: 48 combos, 864 reais. Tirando o suco e os saquinhos, *801 de lucro*.',
  hud: { dia: 12, saldo: 1061, de: 260, formatura: 469, quando: '801' },
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + kevylem({ x: 540, y: 1860, esc: 1.05, expr: lt > c.w('801') ? 'sorriso' : 'surpreso', pose: 'ergue', t: lt, naMao: moedaSolta(0, -20) }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1350 });
    for (let i = 0; i < 12; i++) {
      const r = aleatorio(i + 140);
      const y = -100 - r() * 600 + (500 + r() * 400) * Math.max(0, lt - c.w('801'));
      if (y > -60 && y < 1950) s += moedaSolta(r() * 1080, y);
    }
    s += card(lt, c.w('864'), { x: 300, y: 560, w: 300, h: 210, rot: -5, conteudo: txt('VENDEU', 0, -45, { tam: 32, cor: '#888' }) + txt('R$ 864', 0, 50, { tam: 90, cor: '#222', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('801'), { x: 780, y: 600, w: 340, h: 230, rot: 4, conteudo: txt('LUCRO', 0, -50, { tam: 34, cor: '#1E9E4A' }) + txt('R$ 801', 0, 60, { tam: 110, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 9 — 70 pedidos recusados ----------
E.push({
  fala: 'Mas ele teve que recusar *70 pedidos*. Faltou freezer.',
  hud: { dia: 12, saldo: 1061, formatura: 469 },
  desenhar(lt, c) {
    let mundo = cozinha(lt, { noite: true, vapor: false }) + freezerMae(820, 1600, 1.2) + kevylem({ x: 380, y: 1820, esc: 0.8, expr: 'triste', pose: 'segura', t: lt, segura: `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" rx="4" fill="#E0393E"/>` });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.12, cx: 540, cy: 1350 });
    s += card(lt, c.w('70'), { x: 540, y: 600, w: 320, h: 230, rot: -4, conteudo: txt('70', 0, 40, { tam: 140, cor: '#D7262B', fonte: F_TIT, peso: 400 }) + txt('RECUSADOS', 0, 90, { tam: 34 }) });
    return s;
  },
});

// ---------- 10 — A escolha ----------
function painel4A(lt) {
  let s = `<svg x="0" y="0" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + cozinha(lt, { noite: false, vapor: false }) +
    freezerMae(760, 1680, 1.6) + kevylem({ x: 330, y: 1820, esc: 0.75, expr: 'sorriso', pose: 'aponta', t: lt }) + `</g></svg>`;
  s += `<circle cx="110" cy="130" r="62" fill="#2F6DB5" stroke="#fff" stroke-width="8"/>` + txt('A', 110, 160, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  return s + pilula('FREEZER USADO · R$ 600', 460, 130, { tam: 40 });
}
function painel4B(lt) {
  let s = `<svg x="0" y="980" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + ruaBairro(lt) +
    kevylem({ x: 300, y: 1820, esc: 0.72, expr: 'feliz', pose: 'oferece', t: lt }) + vizinha({ x: 760, y: 1820, esc: 0.8, expr: 'feliz', t: lt }) + `</g></svg>`;
  s += `<circle cx="110" cy="1110" r="62" fill="#D7262B" stroke="#fff" stroke-width="8"/>` + txt('B', 110, 1140, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  return s + pilula('ALUGA O DA VIZINHA · R$ 15/DIA', 520, 1110, { tam: 36 });
}
E.push({
  fala: 'A: compra um freezer usado de 600 reais. B: aluga o freezer da vizinha por 15 reais por dia.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#111"/>`;
    s += pulo(painel4A(lt), lt, 540, 470, 0);
    s += pulo(painel4B(lt), lt, 540, 1450, c.w('b:') - 0.1);
    return s + `<rect y="950" width="1080" height="20" fill="#111"/>`;
  },
});

// ---------- 11 — Chamada final ----------
E.push({
  fala: 'Comenta *A* ou *B*. Você decide o próximo episódio.',
  semLegenda: true,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#0F1116"/>`;
    s += pulo(txt('A OU B?', 540, 880, { tam: 200, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 820, 0.05);
    s += pulo(txt('VOCÊ DECIDE', 540, 1020, { tam: 110, cor: '#FFD21F', fonte: F_TIT, peso: 400 }), lt, 540, 980, 0.4);
    s += pulo(txt('COMENTA 👇', 540, 1160, { tam: 64, cor: '#AEB4C2' }), lt, 540, 1140, 0.8);
    return s;
  },
});

// Capa da grade (padrão do perfil).
window.CAPA = () =>
  capaEpisodio({
    numero: 4, subtitulo: 'O DELIVERY', antes: 'R$ 260', depois: 'R$ 1.061', etiqueta: 'EM 6 DIAS',
    fundo: camera(ruaBairro(0.5) + kevylem({ x: 380, y: 1820, esc: 0.8, expr: 'sorriso', pose: 'segura', t: 0.5, segura: sacola(-40, 40, 1) + sacola(40, 40, 1) }) + celular(0.5, { pedidos: 5, x: 800, y: 1450, esc: 0.9 }), 1.2, 560, 1350),
  });

// Story A/B (sem adesivo de enquete).
window.STORY = () =>
  storyAB({
    enquete: false,
    episodio: 'EPISÓDIO 4 · KEVYLEM VAI FICAR RICO!',
    a: { rotulo: 'FREEZER USADO · R$ 600', mundo: cozinha(0.5, { noite: false, vapor: false }) + freezerMae(760, 1680, 1.6) + kevylem({ x: 330, y: 1820, esc: 0.75, expr: 'sorriso', pose: 'aponta', t: 0.5 }), y0: 1180 },
    b: { rotulo: 'ALUGA O DA VIZINHA · R$ 15/DIA', mundo: ruaBairro(0.5) + kevylem({ x: 300, y: 1820, esc: 0.72, expr: 'feliz', pose: 'oferece', t: 0.5 }) + vizinha({ x: 760, y: 1820, esc: 0.8, expr: 'feliz', t: 0.5 }) },
  });

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+18%' });
