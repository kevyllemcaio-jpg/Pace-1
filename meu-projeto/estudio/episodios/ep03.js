// Kevylem Vai Ficar Rico! — Episódio 3: O PONTO (o público escolheu B de novo)
//
// Contas conferidas (continua do episódio 2):
//   Fim do ep. 2: dia 4, saldo R$ 234, 80 saquinhos sobrando. Formatura: 477 dias.
//   Dia 4: isopor grande R$ 45 + 16 pacotes de suco R$ 16 + 100 saquinhos R$ 3 = R$ 64 -> 234 - 64 = R$ 170.
//   16 pacotes x 10 = 160 geladinhos (tem 180 saquinhos).
//   Combo 2 por R$ 3: 160 geladinhos = 80 combos = R$ 240 -> 170 + 240 = R$ 410.
//   Licença de ambulante: R$ 150 e 2 semanas de espera.
//   Formatura: dia 4 = 477, dia 5 = 476.

const CHAO = 1770;
const E = [];

// ---------- RESUMO DO EPISÓDIO ANTERIOR (pálido, com neblina e replay) ----------
E.push({
  fala: 'O Kevylem enfrentou a Dona Cida no portão...',
  lembranca: 'inicio',
  hud: { dia: 3, saldo: 74, formatura: 478 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'surpreso' });
    mundo += kevylem({ x: 230, y: 1600, esc: 0.6, expr: 'sorriso', pose: 'ergue', t: lt, fala: true, naMao: geladinho('#E8434F', 0, -40, 10, 1) });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1350 }) + balao(lt, 0.2, { x: 360, y: 640, texto: 'GELADINHO A 2!', tam: 56, ponta: 'esq' });
  },
});
E.push({
  fala: 'vendeu 80 geladinhos em 40 minutos...',
  lembranca: true,
  hud: { dia: 3, saldo: 234, formatura: 478 },
  desenhar(lt, c) {
    let mundo = portao(lt);
    [[140, 80, 1660], [300, 81, 1620], [740, 82, 1620], [900, 83, 1660]].forEach(([x, sm, y], i) =>
      (mundo += aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: lt, naMao: geladinho(CORES_GELADINHO[i], 0, -40, 0, 0.7) })));
    mundo += kevylem({ x: 520, y: 1820, esc: 0.7, expr: 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75, false) });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1350 }) +
      card(lt, 0.2, { x: 540, y: 620, w: 480, h: 230, rot: -3, conteudo: txt('R$ 234', 0, 50, { tam: 150, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
  },
});
E.push({
  fala: 'e recusou virar sócio dela. Vocês escolheram *B*.',
  lembranca: true,
  hud: { dia: 4, saldo: 234, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'bravo', pose: 'oferece' });
    mundo += kevylem({ x: 260, y: 1800, esc: 0.66, expr: 'determinado', pose: 'cintura', t: lt, olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.05, z1: 1.12, cx: 560, cy: 1380 });
    s += pulo(`<circle cx="540" cy="640" r="120" fill="#D7262B" stroke="#fff" stroke-width="12"/>` + txt('B', 540, 690, { tam: 150, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 640, c.w('b'));
    som('pop', c.w('b'));
    return s;
  },
});

// ---------- EPISÓDIO 3 ----------
// 1 — Dobrou a aposta
E.push({
  fala: 'Dia 4. Ele dobrou a aposta: comprou um *isopor grande* e 16 pacotes de suco.',
  hud: { dia: 4, saldo: 170, de: 234, formatura: 477, quando: 'isopor' },
  hudNovo: true,
  desenhar(lt, c) {
    let s = camLenta(mercadinho(lt) + kevylem({ x: 540, y: 1820, esc: 0.66, expr: 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 1.15) }), lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1250 });
    s += pulo(pilula('EPISÓDIO 3', 540, 270), lt, 540, 270, 0);
    s += card(lt, c.w('isopor'), { x: 290, y: 560, w: 280, h: 250, rot: -5, conteudo: isopor(0, 0, 1.1, false) + txt('R$ 45', 0, 100, { tam: 44 }) });
    s += card(lt, c.w('16'), {
      x: 790, y: 560, w: 280, h: 250, rot: 5,
      conteudo: Array.from({ length: 6 }, (_, i) => pacoteSuco(-70 + (i % 3) * 70, -50 + Math.floor(i / 3) * 60, CORES_GELADINHO[i], 0.55, '')).join('') + txt('16 × R$ 1', 0, 100, { tam: 40 }),
    });
    return s;
  },
});

// 2 — A surpresa da Dona Cida: picolé a 2
E.push({
  fala: 'Mas quando chegou no portão, a Dona Cida tinha uma surpresa. Picolé. A *2 reais*.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    const placa = lt > c.w('picolé') ? 'PICOLÉ R$ 2' : null;
    let mundo = pontoCida(lt, { expr: 'orgulhoso', placa });
    mundo += kevylem({ x: 200, y: 1800, esc: 0.62, expr: lt > c.w('picolé') ? 'surpreso' : 'feliz', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9), olhar: [1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.1, cx: 560, cy: 1400 });
    s += card(lt, c.w('2'), { x: 790, y: 560, w: 260, h: 240, rot: 5, conteudo: `<rect x="-26" y="-90" width="52" height="110" rx="24" fill="#F28C28" stroke="#2A2A2A" stroke-width="5"/><rect x="-7" y="18" width="14" height="50" rx="4" fill="#D9B07A" stroke="#2A2A2A" stroke-width="4"/>` + txt('R$ 2', 0, 105, { tam: 56, cor: '#7B2E9E', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 3 — A fila voltou pra ela
E.push({
  fala: 'Mesmo preço, com sombra e freezer. A fila voltou todinha pra ela.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoCida(lt, { expr: 'sorriso', placa: 'PICOLÉ R$ 2' });
    for (let i = 0; i < 5; i++) {
      const k = suave((lt - c.w('fila') - i * 0.15) / 1.0);
      mundo += aluno(70 + i, { x: mix(120 + i * 95, 560 + i * 40, k), y: 1890, esc: 0.55, expr: 'feliz', t: lt, anda: k > 0 && k < 1 });
    }
    mundo += kevylem({ x: 200, y: 1800, esc: 0.62, expr: 'triste', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9) });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1350 });
  },
});

// 4 — Ele olha em volta
E.push({
  fala: 'No preço, ele não ia ganhar. Então olhou em volta... e viu o *ponto de ônibus*.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    const viu = lt > c.w('ponto');
    let s = camLenta(portao(lt) + kevylem({ x: 540, y: 1860, esc: 1.15, expr: viu ? 'sorriso' : 'desconfiado', pose: viu ? 'aponta' : 'coca', t: lt, olhar: viu ? [1, -0.2] : [Math.sin(lt * 2.5), -0.3] }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    if (viu) s += card(lt, c.w('ponto'), { x: 790, y: 580, w: 250, h: 230, rot: 5, conteudo: `<circle cx="0" cy="-20" r="62" fill="#2F5FA8" stroke="#2A2A2A" stroke-width="5"/>` + txt('PONTO', 0, -8, { tam: 34, cor: '#fff' }) + txt('ÔNIBUS', 0, 90, { tam: 36 }) });
    return s;
  },
});

// 5 — 20 minutos no sol
E.push({
  fala: 'Na saída, a turma espera o ônibus *20 minutos* no sol. E a Dona Cida não sai do portão.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    [[640, 90], [740, 91], [840, 92], [940, 93], [430, 94]].forEach(([x, sm]) => (mundo += aluno(sm, { x, y: 1720, esc: 0.55, expr: 'cansado', t: lt, suor: true })));
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 });
    s += card(lt, c.w('20'), { x: 290, y: 560, w: 260, h: 230, rot: -5, conteudo: `<circle cx="0" cy="-22" r="52" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="-60" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="${Math.cos(lt * 3) * 34}" y2="${-22 + Math.sin(lt * 3) * 34}" stroke="#E0393E" stroke-width="5"/>` + txt('20 MIN', 0, 85, { tam: 44 }) });
    return s;
  },
});

// 6 — Atravessou a rua: combo 2 por 3
E.push({
  fala: 'Ele atravessou a rua, montou no ponto e criou um combo: *2 geladinhos por 3 reais*.',
  hud: { dia: 4, saldo: 170, formatura: 477 },
  passo: 'NOVO PONTO · COMBO',
  passoNovo: true,
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    [[640, 90], [740, 91], [840, 92], [940, 93]].forEach(([x, sm]) => (mundo += aluno(sm, { x, y: 1720, esc: 0.55, expr: lt > c.w('combo') ? 'surpreso' : 'cansado', t: lt, olhar: [-1, 0] })));
    const x = mix(-120, 360, suave(lt / 1.5));
    mundo += kevylem({ x, y: 1840, esc: 0.68, expr: 'sorriso', pose: 'segura', t: lt, anda: lt < 1.5, segura: isopor(0, 0, 0.9) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1300 });
    s += card(lt, c.w('2'), { x: 540, y: 620, w: 420, h: 250, rot: -3, conteudo: geladinho('#E8434F', -140, -10, -12, 1) + geladinho('#8E44AD', -90, -10, 10, 1) + txt('2 POR', 60, -20, { tam: 60, cor: '#222', fonte: F_TIT, peso: 400 }) + txt('R$ 3', 60, 70, { tam: 90, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 7 — Vendeu tudo: R$ 410
E.push({
  fala: 'Em *1 hora*, os 160 geladinhos acabaram. O saldo foi de 170 pra *410 reais*.',
  hud: { dia: 4, saldo: 410, de: 170, formatura: 477, quando: '410' },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    const roda = [[120, 100, 1700], [260, 101, 1660], [700, 102, 1660], [860, 103, 1700], [180, 104, 1910], [900, 105, 1910], [640, 106, 1610]];
    roda.forEach(([x, sm, y], i) => (mundo += aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: lt, naMao: geladinho(CORES_GELADINHO[i % 6], 0, -40, 0, 0.7) })));
    mundo += kevylem({ x: 470, y: 1830, esc: 0.7, expr: lt > c.w('410') ? 'surpreso' : 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9, lt < c.w('saldo')) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1350 });
    s += card(lt, c.w('1'), { x: 850, y: 470, w: 220, h: 190, rot: 5, conteudo: `<circle cx="0" cy="-22" r="46" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="-55" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="${Math.cos(lt * 4) * 30}" y2="${-22 + Math.sin(lt * 4) * 30}" stroke="#E0393E" stroke-width="5"/>` + txt('1 HORA', 0, 72, { tam: 38 }) });
    s += card(lt, c.w('410'), { x: 470, y: 620, w: 480, h: 230, rot: -3, conteudo: txt('R$ 410', 0, 50, { tam: 150, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 8 — Dia 5: o fiscal
E.push({
  fala: 'Dia 5. Um homem de colete parou na frente do isopor. *Fiscal da prefeitura*.',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    const xf = mix(1300, 760, suave((lt - 0.3) / 1.0));
    let mundo = pontoOnibus(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.7, expr: lt > c.w('fiscal') ? 'preocupado' : 'feliz', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9), olhar: [1, 0] });
    mundo += fiscal({ x: xf, y: 1840, esc: 0.74, expr: 'desconfiado', pose: 'segura', vira: -1, t: lt, anda: lt < 1.3, segura: prancheta(), olhar: [-1, 0] });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.1, cx: 560, cy: 1400 });
    s += carimbo(lt, c.w('fiscal'), { x: 540, y: 600, texto: 'FISCAL', rot: -6, tam: 120, cor: '#E07A1F' });
    return s;
  },
});

// 9 — Sem licença, apreende
E.push({
  fala: 'Sem licença de ambulante, a mercadoria é *apreendida*.',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    let mundo = pontoOnibus(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'preocupado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.9), olhar: [1, 0] });
    mundo += fiscal({ x: 760, y: 1840, esc: 0.74, expr: 'bravo', pose: 'aponta', vira: -1, t: lt, olhar: [-1, 0], fala: lt < c.w('apreendida') });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.35, z1: 1.45, cx: 620, cy: 1380 });
    s += balao(lt, 0.15, { x: 640, y: 560, texto: 'CADÊ A LICENÇA?', tam: 54, ponta: 'dir' });
    return s;
  },
});

// 10 — A licença: R$ 150 e 2 semanas
E.push({
  fala: 'A licença custa *150 reais*. E demora *2 semanas* pra sair.',
  hud: { dia: 5, saldo: 410, formatura: 476 },
  desenhar(lt, c) {
    let s = camLenta(pontoOnibus(lt) + kevylem({ x: 540, y: 1880, esc: 1.0, expr: 'desconfiado', pose: 'coca', t: lt, olhar: [Math.sin(lt * 2), -0.3] }), lt, c.dur, { z0: 1.15, z1: 1.25, cy: 1400 });
    s += card(lt, c.w('150'), {
      x: 290, y: 560, w: 300, h: 270, rot: -5,
      conteudo: txt('LICENÇA', 0, -85, { tam: 34, cor: '#2F5F9E' }) + `<rect x="-60" y="-60" width="120" height="80" rx="6" fill="#EEF3F7" stroke="#2A2A2A" stroke-width="4"/><circle cx="35" cy="5" r="16" fill="#D7262B"/>` + txt('R$ 150', 0, 100, { tam: 70, cor: '#D7262B', fonte: F_TIT, peso: 400 }),
    });
    s += card(lt, c.w('2'), { x: 790, y: 560, w: 280, h: 270, rot: 5, conteudo: `<g transform="translate(0 -30) scale(3) translate(0 30)">${iconeCalendario(0, -30)}</g>` + txt('2 SEMANAS', 0, 100, { tam: 44 }) });
    return s;
  },
});

// 11 — A escolha
function painelA(lt) {
  let s = `<svg x="0" y="0" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + pontoOnibus(lt) +
    kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'feliz', pose: 'segura', t: lt, segura: prancheta() }) + fiscal({ x: 760, y: 1840, esc: 0.74, expr: 'feliz', pose: 'baixo', vira: -1, t: lt }) + `</g></svg>`;
  s += `<circle cx="110" cy="130" r="62" fill="#2F6DB5" stroke="#fff" stroke-width="8"/>` + txt('A', 110, 160, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('PAGA R$ 150 E ESPERA', 450, 130, { tam: 40 });
  return s;
}
function painelB(lt) {
  const celular = `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" rx="4" fill="#3BD16F"/>`;
  let s = `<svg x="0" y="980" width="1080" height="940" overflow="hidden"><g transform="translate(0 -930)">` + quarto(lt) +
    kevylem({ x: 540, y: 1800, esc: 0.7, expr: 'sorriso', pose: 'segura', t: lt, segura: celular }) + `</g></svg>`;
  s += `<circle cx="110" cy="1110" r="62" fill="#D7262B" stroke="#fff" stroke-width="8"/>` + txt('B', 110, 1140, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('VENDE PELO WHATSAPP', 450, 1110, { tam: 40 });
  return s;
}
E.push({
  fala: 'E agora? A: paga os 150 e fica 2 semanas sem vender. B: vende pelo WhatsApp e entrega no bairro.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#111"/>`;
    s += pulo(painelA(lt), lt, 540, 470, c.w('a:') - 0.1);
    s += pulo(painelB(lt), lt, 540, 1450, c.w('b:') - 0.1);
    s += `<rect y="950" width="1080" height="20" fill="#111"/>`;
    return s;
  },
});

// 12 — Comenta A ou B
E.push({
  fala: 'Comenta *A* ou *B*. O que o Kevylem faz?',
  desenhar(lt, c) {
    let s = camLenta(pontoOnibus(lt) + kevylem({ x: 540, y: 1880, esc: 1.2, expr: 'preocupado', t: lt, olhar: [Math.sin(lt * 1.5), 0] }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += `<rect width="1080" height="1920" fill="#E8E4DA" opacity="0.45"/>`;
    return s;
  },
});

// 13 — Episódio 4: você decide
E.push({
  fala: 'A mais votada vira o episódio 4.',
  semLegenda: true,
  dur: 3,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#0F1116"/>`;
    s += pulo(txt('EPISÓDIO 4', 540, 900, { tam: 150, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 850, 0.1);
    s += pulo(txt('VOCÊ DECIDE', 540, 1030, { tam: 110, cor: '#FFD21F', fonte: F_TIT, peso: 400 }), lt, 540, 990, 0.45);
    s += pulo(txt('COMENTA  A  OU  B', 540, 1180, { tam: 54, cor: '#AEB4C2' }), lt, 540, 1160, 0.9);
    return s;
  },
});

// Capa no padrão do perfil.
window.CAPA = () =>
  capaEpisodio({
    numero: 3,
    subtitulo: 'O PONTO',
    antes: 'R$ 170',
    depois: 'R$ 410',
    etiqueta: 'EM 1 HORA',
    fundo: camera(
      pontoOnibus(0.5) +
        [[700, 102, 1660], [860, 103, 1700], [600, 106, 1610]].map(([x, sm, y], i) => aluno(sm, { x, y, esc: 0.55, expr: 'sorriso', pose: 'ergue', t: 0.5, naMao: geladinho(CORES_GELADINHO[i], 0, -40, 0, 0.7) })).join('') +
        kevylem({ x: 330, y: 1840, esc: 0.72, expr: 'sorriso', pose: 'segura', t: 0.5, segura: isopor(0, 0, 0.95) }),
      1.35, 560, 1380
    ),
  });

// Story A/B (sem adesivo de enquete).
window.STORY = () =>
  storyAB({
    enquete: false,
    episodio: 'EPISÓDIO 3 · KEVYLEM VAI FICAR RICO!',
    a: { rotulo: 'PAGA R$ 150 E ESPERA', mundo: pontoOnibus(0.5) + kevylem({ x: 330, y: 1840, esc: 0.7, expr: 'feliz', pose: 'segura', t: 0.5, segura: prancheta() }) + fiscal({ x: 760, y: 1840, esc: 0.74, expr: 'feliz', vira: -1, t: 0.5 }), y0: 1180 },
    b: { rotulo: 'VENDE PELO WHATSAPP', mundo: quarto(0.5) + kevylem({ x: 540, y: 1800, esc: 0.7, expr: 'sorriso', pose: 'segura', t: 0.5, segura: `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="#22262F" stroke="#2A2A2A" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" rx="4" fill="#3BD16F"/>` }) },
  });

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });
