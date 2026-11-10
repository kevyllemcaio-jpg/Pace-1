// Kevylem Vai Ficar Rico! — Episódio 3, VERSÃO CURTA (teste de retenção)
// Mesma história do ep03.js, mas: gancho no 1º quadro, entendível sem ver os anteriores,
// sem a abertura "no episódio anterior", ~50 s, narração mais rápida.
// Contas: iguais ao ep03.js (170 -> 410 com 80 combos de R$ 3; licença R$ 150 / 2 semanas).

const E = [];

// Título grande do gancho (já visível no quadro 0).
function tituloGancho(linhas) {
  return linhas.map(([t, cor], i) => txt(t, 540, 470 + i * 140, { tam: Math.min(130, 960 / (t.length * 0.45)), cor, fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 })).join('');
}

// 1 — GANCHO
E.push({
  fala: 'Ele fez *410 reais* em 1 hora vendendo geladinho. E aí o *fiscal* chegou.',
  capa: 0.05,
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.72, expr: 'preocupado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.95), olhar: [1, 0] });
    mundo += fiscal({ x: 770, y: 1840, esc: 0.76, expr: 'bravo', pose: 'aponta', vira: -1, t: lt, olhar: [-1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.25, z1: 1.35, cx: 560, cy: 1420, soco: false });
    s += `<rect width="1080" height="900" fill="#000" opacity="0.25"/>`;
    s += tituloGancho([['R$ 410 EM 1 HORA...', '#6BEA8E'], ['E O FISCAL', '#FFFFFF'], ['CHEGOU', '#FFD21F']]);
    return s;
  },
  legendaY: 1060,
});

// 2 — Contexto rápido (quem é)
E.push({
  fala: 'Kevylem tem 17 anos e vende geladinho em Salvador pra sair rico antes da formatura.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  hudNovo: true,
  desenhar(lt, c) {
    let s = camLenta(portao(lt) + kevylem({ x: 540, y: 1860, esc: 1.05, expr: 'determinado', pose: 'segura', t: lt, segura: isopor(0, 0, 1.0) }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += card(lt, c.w('17'), { x: 250, y: 560, w: 220, h: 190, rot: -5, conteudo: txt('17', 0, 25, { tam: 110, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) + txt('ANOS', 0, 70, { tam: 30 }) });
    s += card(lt, c.w('formatura'), { x: 830, y: 580, w: 240, h: 190, rot: 5, conteudo: txt('476', 0, 25, { tam: 100, cor: '#C33A3A', fonte: F_TIT, peso: 400 }) + txt('DIAS', 0, 70, { tam: 30 }) });
    return s;
  },
});

// 3 — O problema: picolé a 2
E.push({
  fala: 'Só que a dona do açaí baixou o picolé pra *2 reais*. E a fila dele sumiu.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'sorriso', placa: 'PICOLÉ R$ 2' });
    for (let i = 0; i < 4; i++) {
      const k = suave((lt - c.w('fila') - i * 0.12) / 0.8);
      mundo += aluno(70 + i, { x: mix(120 + i * 95, 560 + i * 40, k), y: 1890, esc: 0.55, expr: 'feliz', t: lt, anda: k > 0 && k < 1 });
    }
    mundo += kevylem({ x: 200, y: 1800, esc: 0.62, expr: lt > c.w('fila') ? 'triste' : 'surpreso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9) });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1350 });
  },
});

// 4 — A sacada: ponto de ônibus
E.push({
  fala: 'Aí ele reparou: no ponto de ônibus, a turma espera *20 minutos* no sol.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    [[640, 90], [740, 91], [840, 92], [940, 93], [430, 94]].forEach(([x, sm]) => (mundo += aluno(sm, { x, y: 1720, esc: 0.55, expr: 'cansado', t: lt, suor: true })));
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1300 });
    s += card(lt, c.w('20'), { x: 290, y: 560, w: 260, h: 230, rot: -5, conteudo: `<circle cx="0" cy="-22" r="52" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="-60" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="${Math.cos(lt * 3) * 34}" y2="${-22 + Math.sin(lt * 3) * 34}" stroke="#E0393E" stroke-width="5"/>` + txt('20 MIN', 0, 85, { tam: 44 }) });
    return s;
  },
});

// 5 — O combo
E.push({
  fala: 'Atravessou a rua com um combo: *2 por 3 reais*.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    [[640, 90], [740, 91], [840, 92], [940, 93]].forEach(([x, sm]) => (mundo += aluno(sm, { x, y: 1720, esc: 0.55, expr: lt > c.w('2') ? 'surpreso' : 'cansado', t: lt, olhar: [-1, 0] })));
    mundo += kevylem({ x: mix(-120, 360, suave(lt / 1.0)), y: 1840, esc: 0.68, expr: 'sorriso', pose: 'segura', t: lt, anda: lt < 1.0, segura: isopor(0, 0, 0.9) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 });
    s += card(lt, c.w('2'), { x: 540, y: 620, w: 420, h: 250, rot: -3, conteudo: geladinho('#E8434F', -140, -10, -12, 1) + geladinho('#8E44AD', -90, -10, 10, 1) + txt('2 POR', 60, -20, { tam: 60, cor: '#222', fonte: F_TIT, peso: 400 }) + txt('R$ 3', 60, 70, { tam: 90, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 6 — O resultado
E.push({
  fala: 'Em 1 hora, 160 geladinhos. *410 reais*.',
  hud: { dia: 4, saldo: 410, de: 170, formatura: 477, quando: '410' },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    [[120, 100, 1700], [260, 101, 1660], [700, 102, 1660], [860, 103, 1700], [900, 105, 1910], [640, 106, 1610]].forEach(([x, sm, y], i) =>
      (mundo += aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: lt, naMao: geladinho(CORES_GELADINHO[i % 6], 0, -40, 0, 0.7) })));
    mundo += kevylem({ x: 470, y: 1830, esc: 0.7, expr: lt > c.w('410') ? 'surpreso' : 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9, lt < c.w('410')) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.1, cy: 1350 });
    s += card(lt, c.w('410'), { x: 540, y: 620, w: 480, h: 230, rot: -3, conteudo: txt('R$ 410', 0, 50, { tam: 150, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 7 — O fiscal
E.push({
  fala: 'Aí o fiscal chegou. Sem licença, ele *leva tudo*.',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'preocupado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9), olhar: [1, 0] });
    mundo += fiscal({ x: mix(1300, 760, suave(lt / 0.8)), y: 1840, esc: 0.74, expr: 'bravo', pose: lt > c.w('sem') ? 'aponta' : 'segura', segura: lt > c.w('sem') ? '' : prancheta(), vira: -1, t: lt, anda: lt < 0.8, olhar: [-1, 0], fala: lt > c.w('sem') });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.2, z1: 1.35, cx: 600, cy: 1400 });
    s += balao(lt, c.w('sem'), { x: 640, y: 560, texto: 'CADÊ A LICENÇA?', tam: 54, ponta: 'dir' });
    s += carimbo(lt, c.w('leva'), { x: 540, y: 780, texto: 'APREENDE', rot: -6, tam: 110 });
    return s;
  },
});

// 8 — O custo da licença
E.push({
  fala: 'A licença custa *150 reais* e demora *2 semanas*.',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    let s = camLenta(pontoOnibus(lt) + kevylem({ x: 540, y: 1880, esc: 1.0, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [Math.sin(lt * 2), -0.3] }), lt, c.dur, { z0: 1.15, z1: 1.25, cy: 1400 });
    s += card(lt, c.w('150'), { x: 290, y: 560, w: 300, h: 250, rot: -5, conteudo: txt('LICENÇA', 0, -60, { tam: 36, cor: '#2F5F9E' }) + txt('R$ 150', 0, 40, { tam: 90, cor: '#D7262B', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('2'), { x: 790, y: 560, w: 280, h: 250, rot: 5, conteudo: `<g transform="translate(0 -30) scale(3) translate(0 30)">${iconeCalendario(0, -30)}</g>` + txt('2 SEMANAS', 0, 95, { tam: 44 }) });
    return s;
  },
});

// 9 — A escolha
function painelCurtoA(lt) {
  let s = `<svg x="0" y="0" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + pontoOnibus(lt) +
    kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'feliz', pose: 'segura', t: lt, segura: prancheta() }) + fiscal({ x: 760, y: 1840, esc: 0.74, expr: 'feliz', vira: -1, t: lt }) + `</g></svg>`;
  s += `<circle cx="110" cy="130" r="62" fill="#2F6DB5" stroke="#fff" stroke-width="8"/>` + txt('A', 110, 160, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  return s + pilula('PAGA R$ 150 E ESPERA', 450, 130, { tam: 40 });
}
function painelCurtoB(lt) {
  const cel = `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" rx="4" fill="#3BD16F"/>`;
  let s = `<svg x="0" y="980" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + quarto(lt) +
    kevylem({ x: 540, y: 1800, esc: 0.7, expr: 'sorriso', pose: 'segura', t: lt, segura: cel }) + `</g></svg>`;
  s += `<circle cx="110" cy="1110" r="62" fill="#D7262B" stroke="#fff" stroke-width="8"/>` + txt('B', 110, 1140, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  return s + pilula('VENDE PELO WHATSAPP', 450, 1110, { tam: 40 });
}
E.push({
  fala: 'A: paga e espera 2 semanas. B: vende pelo WhatsApp.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#111"/>`;
    s += pulo(painelCurtoA(lt), lt, 540, 470, 0);
    s += pulo(painelCurtoB(lt), lt, 540, 1450, c.w('b:') - 0.1);
    return s + `<rect y="950" width="1080" height="20" fill="#111"/>`;
  },
});

// 10 — Chamada final
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

// Capa da grade (padrão do perfil) — a mesma do ep03.
window.CAPA = () =>
  capaEpisodio({
    numero: 3, subtitulo: 'O PONTO', antes: 'R$ 170', depois: 'R$ 410', etiqueta: 'EM 1 HORA',
    fundo: camera(
      pontoOnibus(0.5) +
        [[700, 102, 1660], [860, 103, 1700], [600, 106, 1610]].map(([x, sm, y], i) => aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: 0.5, naMao: geladinho(CORES_GELADINHO[i], 0, -40, 0, 0.7) })).join('') +
        kevylem({ x: 330, y: 1840, esc: 0.72, expr: 'sorriso', pose: 'segura', t: 0.5, segura: isopor(0, 0, 0.95) }),
      1.35, 560, 1380
    ),
  });

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+20%' });
