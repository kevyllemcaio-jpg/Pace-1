// Kevylem Vai Ficar Rico! — Episódio 2: O PORTÃO (o público escolheu B)
//
// Contas conferidas (continua do episódio 1):
//   Fim do ep. 1: saldo R$ 77, 8 pacotes de suco e 60 saquinhos guardados. Formatura: 479 dias (dia 2).
//   Dia 3: compra mais 100 saquinhos por R$ 3 -> 77 - 3 = R$ 74.
//   8 pacotes x 10 = 80 geladinhos. Vende os 80 a R$ 2 em 40 minutos = R$ 160 -> 74 + 160 = R$ 234.
//   Açaí da Cida: R$ 12 o copo.
//   Proposta (dia 4): vender no carrinho dela, metade do lucro pra ela (R$ 80 de R$ 160).
//   Formatura: dia 3 = 478 dias, dia 4 = 477 dias.

const CHAO = 1770;

// Cenário do portão com o carrinho da Dona Cida (reaproveitado em várias cenas).
function pontoCida(lt, { expr = 'desconfiado', pose = 'cintura', fala = false } = {}) {
  return portao(lt) + carrinhoAcai(780, 1660, lt) +
    donaCida({ x: 780, y: 1560, esc: 0.6, expr, pose, t: lt, olhar: [-1, 0], fala }) + balcaoAcai(780, 1740, 0.95);
}

const E = [];

// 1 — Recapitulação: vocês escolheram B
E.push({
  fala: 'Vocês escolheram *B*. O Kevylem recusou os 25 reais da cantina.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  hudNovo: true,
  desenhar(lt, c) {
    let mundo = corredor(lt);
    mundo += kevylem({ x: 360, y: 1800, esc: 0.72, expr: lt > c.w('recusou') ? 'determinado' : 'neutro', pose: lt > c.w('recusou') ? 'cintura' : 'baixo', t: lt, olhar: [1, 0] });
    mundo += donoCantina({ x: 730, y: 1800, esc: 0.76, expr: lt > c.w('recusou') ? 'bravo' : 'orgulhoso', pose: 'oferece', vira: -1, t: lt, olhar: [-1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.12, cy: 1400 });
    s += pulo(pilula('EPISÓDIO 2', 540, 300), lt, 540, 300, 0);
    s += pulo(`<circle cx="540" cy="520" r="110" fill="#D7262B" stroke="#fff" stroke-width="12"/>` + txt('B', 540, 565, { tam: 140, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 520, c.w('b'));
    som('pop', c.w('b'));
    s += carimbo(lt, c.w('recusou'), { x: 540, y: 1220, texto: 'RECUSOU', rot: -7, tam: 96 });
    return s;
  },
});

// 2 — Mais saquinhos, 80 geladinhos
E.push({
  fala: 'Dia 3. Comprou mais saquinhos por 3 reais, usou os 8 pacotes de suco e encheu o isopor com *80 geladinhos*.',
  hud: { dia: 3, saldo: 74, de: 77, formatura: 478, quando: 'saquinhos' },
  desenhar(lt, c) {
    const k = lim((lt - c.w('usou')) / Math.max(0.1, c.w('80') - c.w('usou')));
    let mundo = cozinha(lt, { noite: false, vapor: false });
    mundo += kevylem({ x: 540, y: 1800, esc: 0.75, expr: lt > c.w('80') ? 'sorriso' : 'determinado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.85, k > 0.5) });
    for (let i = 0; i < Math.floor(k * 14); i++) mundo += geladinho(CORES_GELADINHO[i % 6], 70 + i * 34, 990, 0, 0.6);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1250 });
    s += card(lt, c.w('saquinhos'), { x: 260, y: 560, w: 240, h: 250, rot: -5, conteudo: saquinhos(0, -20, 1.2) + txt('R$ 3', 0, 95, { tam: 40 }) });
    s += card(lt, c.w('80'), { x: 790, y: 560, w: 300, h: 250, rot: 4, conteudo: isopor(-80, 0, 0.55) + txt('80', 60, 20, { tam: 110, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) + txt('GELADINHOS', 0, 98, { tam: 32 }) });
    return s;
  },
});

// 3 — O portão: a Dona Cida encara
E.push({
  fala: 'Chegou no portão e montou o ponto do lado da Dona Cida. Ela nem piscou.',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  desenhar(lt, c) {
    const x = mix(-120, 220, suave(lt / 1.4));
    let mundo = pontoCida(lt, { expr: 'desconfiado' });
    mundo += kevylem({ x, y: 1800, esc: 0.62, expr: 'determinado', pose: 'segura', t: lt, anda: lt < 1.4, segura: isopor(0, 0, 0.75), olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1350 });
    return s;
  },
});

// 4 — "Aqui é meu ponto, menino."
E.push({
  fala: 'Aqui é meu ponto, menino.',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  voz: 'mulher',
  desenhar(lt, c) {
    let s = camLenta(pontoCida(lt, { expr: 'bravo', pose: 'aponta', fala: lt < c.dur - 0.4 }), lt, c.dur, { z0: 1.7, z1: 1.8, cx: 780, cy: 1360 });
    s += balao(lt, 0.1, { x: 520, y: 560, texto: 'AQUI É MEU PONTO, MENINO.', tam: 46, ponta: 'dir' });
    return s;
  },
});

// 5 — Zero vendas
E.push({
  fala: 'Primeira meia hora: *zero vendas*. Todo mundo ia direto no açaí.',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'orgulhoso' });
    // alunos passam reto pelo Kevylem em direção ao carrinho
    for (let i = 0; i < 4; i++) {
      const x = mix(-100 - i * 160, 640 - i * 30, lim((lt - i * 0.35) / 2.2));
      mundo += aluno(50 + i, { x, y: 1880, esc: 0.55, expr: 'feliz', t: lt, anda: true });
    }
    mundo += kevylem({ x: 220, y: 1800, esc: 0.62, expr: 'triste', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75), olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1350 });
    s += card(lt, c.w('zero'), { x: 300, y: 560, w: 280, h: 230, rot: -5, conteudo: txt('0', 0, 40, { tam: 150, cor: '#D7262B', fonte: F_TIT, peso: 400 }) + txt('VENDIDOS', 0, 90, { tam: 34 }) });
    return s;
  },
});

// 6 — A virada: o açaí custa 12
E.push({
  fala: 'Aí ele reparou numa coisa. O açaí custava *12 reais*. E quem não tinha 12... ia embora sem nada.',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt);
    const triste = lt > c.w('quem');
    mundo += aluno(60, { x: 470, y: 1860, esc: 0.58, expr: triste ? 'triste' : 'neutro', pose: 'segura', t: lt, segura: moedaSolta(0, 0) + moedaSolta(24, 6) });
    mundo += aluno(61, { x: 580, y: 1900, esc: 0.55, expr: triste ? 'triste' : 'preocupado', t: lt });
    mundo += kevylem({ x: 200, y: 1800, esc: 0.62, expr: lt > c.w('reparou') ? 'desconfiado' : 'triste', pose: 'coca', t: lt, olhar: [1, 0.2] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.1, z1: 1.2, cx: 480, cy: 1400 });
    s += card(lt, c.w('12'), { x: 790, y: 520, w: 280, h: 240, rot: 5, conteudo: `<path d="M -50 -70 L 50 -70 L 38 30 L -38 30 Z" fill="#6A2C8A" stroke="#2A2A2A" stroke-width="4"/><ellipse cx="0" cy="-70" rx="50" ry="12" fill="#4A1A63" stroke="#2A2A2A" stroke-width="4"/>` + txt('R$ 12', 0, 95, { tam: 64, cor: '#7B2E9E', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('quem'), { x: 290, y: 600, w: 260, h: 200, rot: -4, conteudo: moedas(-50, -10, 2) + moedaSolta(30, -20) + txt('SÓ R$ 2', 0, 70, { tam: 52, cor: '#222', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 7 — O grito: geladinho a 2!
E.push({
  fala: 'Ele subiu no muro e gritou: *geladinho a 2 reais!* E a fila mudou de lado.',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  desenhar(lt, c) {
    const virou = lt > c.w('fila');
    let mundo = pontoCida(lt, { expr: virou ? 'surpreso' : 'desconfiado' });
    for (let i = 0; i < 5; i++) {
      const k = suave((lt - c.w('fila') - i * 0.15) / 1.0);
      const x = mix(560 + i * 40, 120 + i * 95, k);
      mundo += aluno(70 + i, { x, y: 1890, esc: 0.55, expr: k > 0.5 ? 'sorriso' : 'neutro', t: lt, anda: k > 0 && k < 1 });
    }
    mundo += kevylem({ x: 230, y: 1600, esc: 0.6, expr: 'sorriso', pose: 'ergue', t: lt, fala: lt > c.w('gritou') && lt < c.w('e', 1), naMao: geladinho('#E8434F', 0, -40, 10, 1) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1350 });
    s += balao(lt, c.w('gritou'), { x: 360, y: 640, texto: 'GELADINHO A 2!', tam: 56, ponta: 'esq' });
    return s;
  },
});

// 8 — Vendeu tudo: R$ 234
E.push({
  fala: 'Em *40 minutos*, os 80 geladinhos acabaram. O saldo foi pra *234 reais*.',
  hud: { dia: 3, saldo: 234, de: 74, formatura: 478, quando: 'saldo' },
  desenhar(lt, c) {
    let mundo = portao(lt);
    const roda = [[120, 80, 1660], [260, 81, 1620], [700, 82, 1620], [860, 83, 1660], [180, 84, 1900], [880, 85, 1900]];
    roda.forEach(([x, sm, y], i) => (mundo += aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: lt, naMao: geladinho(CORES_GELADINHO[i % 6], 0, -40, 0, 0.7) })));
    const restam = Math.max(0, 5 - Math.floor(lt * 1.6));
    mundo += kevylem({ x: 520, y: 1820, esc: 0.7, expr: lt > c.w('saldo') ? 'surpreso' : 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75, restam > 0) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1350 });
    s += card(lt, c.w('40'), { x: 840, y: 470, w: 230, h: 200, rot: 5, conteudo: `<circle cx="0" cy="-22" r="46" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="-55" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="${Math.cos(lt * 4) * 30}" y2="${-22 + Math.sin(lt * 4) * 30}" stroke="#E0393E" stroke-width="5"/>` + txt('40 MIN', 0, 75, { tam: 40 }) });
    s += card(lt, c.w('234'), { x: 470, y: 600, w: 480, h: 230, rot: -3, conteudo: txt('R$ 234', 0, 50, { tam: 150, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 9 — A Dona Cida não gostou
E.push({
  fala: 'A Dona Cida não gostou nada disso.',
  hud: { dia: 3, saldo: 234, formatura: 478 },
  desenhar(lt, c) {
    let s = camLenta(pontoCida(lt, { expr: 'bravo', pose: 'aponta', fala: lt > 0.6 }), lt, c.dur, { z0: 1.6, z1: 1.75, cx: 780, cy: 1360 });
    s += balao(lt, 0.5, { x: 500, y: 580, texto: 'TÁ ROUBANDO MEUS CLIENTES!', tam: 42, ponta: 'dir' });
    return s;
  },
});

// 10 — Dia 4: a proposta da Cida
E.push({
  fala: 'Dia 4. Ela chamou o Kevylem com uma proposta: vender o geladinho no carrinho dela. Com freezer, sombra e ponto garantido.',
  hud: { dia: 4, saldo: 234, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'orgulhoso', pose: 'oferece', fala: lt > c.w('proposta') });
    mundo += kevylem({ x: 300, y: 1800, esc: 0.66, expr: 'desconfiado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75), olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.15, cx: 560, cy: 1380 });
    const itens = [['freezer', '❄', '#7DC6E8'], ['sombra', '☂', '#7B2E9E'], ['ponto', '✓', '#2FA45A']];
    itens.forEach(([p, ic, cor], i) => {
      s += card(lt, c.w(p), { x: 220 + i * 320, y: 520, w: 210, h: 190, rot: [-5, 3, -2][i], conteudo: `<circle cx="0" cy="-15" r="52" fill="${cor}" stroke="#2A2A2A" stroke-width="4"/>` + txt(ic, 0, 8, { tam: 56, cor: '#fff' }) + txt(p.toUpperCase(), 0, 75, { tam: 30 }) });
    });
    return s;
  },
});

// 11 — O preço: metade do lucro
E.push({
  fala: 'Mas tem um preço: *metade do lucro* fica com ela.',
  hud: { dia: 4, saldo: 234, formatura: 477 },
  desenhar(lt, c) {
    let s = camLenta(pontoCida(lt, { expr: 'desconfiado', pose: 'cintura' }), lt, c.dur, { z0: 1.6, z1: 1.7, cx: 780, cy: 1360 });
    s += card(lt, c.w('metade'), { x: 300, y: 560, w: 300, h: 250, rot: -5, conteudo: `<circle cx="0" cy="-20" r="70" fill="#2FA45A" stroke="#2A2A2A" stroke-width="5"/><path d="M 0 -20 L 0 -90 A 70 70 0 0 0 0 50 Z" fill="#7B2E9E" stroke="#2A2A2A" stroke-width="5"/>` + txt('50% PRA CIDA', 0, 95, { tam: 34 }) });
    return s;
  },
});

// 12 — As contas
E.push({
  fala: 'Sozinho, ele faz *160 reais* num dia bom. Com a Cida, *80*. Mas sem perigo de perder o ponto.',
  hud: { dia: 4, saldo: 234, formatura: 477 },
  desenhar(lt, c) {
    let s = camLenta(patio(lt) + kevylem({ x: 540, y: 1840, esc: 0.95, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [Math.sin(lt * 2), -0.3] }), lt, c.dur, { z0: 1.15, z1: 1.25, cy: 1350 });
    s += card(lt, c.w('160'), { x: 290, y: 560, w: 300, h: 230, rot: -5, conteudo: txt('SOZINHO', 0, -50, { tam: 34, cor: '#D7262B' }) + txt('R$ 160', 0, 50, { tam: 84, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('80'), { x: 790, y: 560, w: 300, h: 230, rot: 5, conteudo: txt('COM A CIDA', 0, -50, { tam: 34, cor: '#7B2E9E' }) + txt('R$ 80', 0, 50, { tam: 84, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 13 — A escolha
function painelA(lt) {
  let s = `<svg x="0" y="0" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + pontoCida(lt, { expr: 'feliz', pose: 'oferece' }) +
    kevylem({ x: 300, y: 1800, esc: 0.62, expr: 'feliz', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75) }) + `</g></svg>`;
  s += `<circle cx="110" cy="130" r="62" fill="#2F6DB5" stroke="#fff" stroke-width="8"/>` + txt('A', 110, 160, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('SÓCIO DA CIDA · 50%', 430, 130, { tam: 40 });
  return s;
}
function painelB(lt) {
  let s = `<svg x="0" y="980" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + pontoCida(lt, { expr: 'bravo' }) +
    kevylem({ x: 230, y: 1800, esc: 0.62, expr: 'determinado', pose: 'cintura', t: lt }) + isopor(330, 1780, 0.9) + `</g></svg>`;
  s += `<circle cx="110" cy="1110" r="62" fill="#D7262B" stroke="#fff" stroke-width="8"/>` + txt('B', 110, 1140, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('SOZINHO · 100%', 380, 1110, { tam: 40 });
  return s;
}
E.push({
  fala: 'E agora? A: vira sócio da Dona Cida. B: continua sozinho e briga pelo portão.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#111"/>`;
    s += pulo(painelA(lt), lt, 540, 470, c.w('a:') - 0.1);
    s += pulo(painelB(lt), lt, 540, 1450, c.w('b:') - 0.1);
    s += `<rect y="950" width="1080" height="20" fill="#111"/>`;
    return s;
  },
});

// 14 — Comenta A ou B
E.push({
  fala: 'Comenta *A* ou *B*. O que o Kevylem faz?',
  desenhar(lt, c) {
    let s = camLenta(portao(lt) + kevylem({ x: 540, y: 1860, esc: 1.2, expr: 'preocupado', t: lt, olhar: [Math.sin(lt * 1.5), 0] }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += `<rect width="1080" height="1920" fill="#E8E4DA" opacity="0.45"/>`;
    return s;
  },
});

// 15 — Episódio 3: você decide
E.push({
  fala: 'A mais votada vira o episódio 3.',
  semLegenda: true,
  dur: 3,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#0F1116"/>`;
    s += pulo(txt('EPISÓDIO 3', 540, 900, { tam: 150, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 850, 0.1);
    s += pulo(txt('VOCÊ DECIDE', 540, 1030, { tam: 110, cor: '#FFD21F', fonte: F_TIT, peso: 400 }), lt, 540, 990, 0.45);
    s += pulo(txt('COMENTA  A  OU  B', 540, 1180, { tam: 54, cor: '#AEB4C2' }), lt, 540, 1160, 0.9);
    return s;
  },
});

// Capa no padrão do perfil.
window.CAPA = () =>
  capaEpisodio({
    numero: 2,
    subtitulo: 'O PORTÃO',
    antes: 'R$ 74',
    depois: 'R$ 234',
    etiqueta: 'EM 40 MINUTOS',
    fundo: camera(
      portao(0.5) + carrinhoAcai(800, 1660, 0.5) + donaCida({ x: 800, y: 1560, esc: 0.6, expr: 'bravo', pose: 'cintura', t: 0.5, olhar: [-1, 0] }) + balcaoAcai(800, 1740, 0.95) +
        kevylem({ x: 300, y: 1800, esc: 0.68, expr: 'sorriso', pose: 'ergue', t: 0.5, naMao: geladinho('#E8434F', 0, -40, 10, 1) }),
      1.4, 560, 1330
    ),
  });

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });

// Story de enquete A/B.
window.STORY = () =>
  storyAB({
    episodio: 'EPISÓDIO 2 · KEVYLEM VAI FICAR RICO!',
    a: { rotulo: 'SÓCIO DA DONA CIDA · 50%', mundo: pontoCida(0.5, { expr: 'feliz', pose: 'oferece' }) + kevylem({ x: 300, y: 1800, esc: 0.62, expr: 'feliz', pose: 'segura', t: 0.5, segura: isopor(0, 0, 0.75) }) },
    b: { rotulo: 'SOZINHO NO PORTÃO · 100%', mundo: pontoCida(0.5, { expr: 'bravo' }) + kevylem({ x: 230, y: 1800, esc: 0.62, expr: 'determinado', pose: 'cintura', t: 0.5 }) + isopor(330, 1780, 0.9) },
  });
