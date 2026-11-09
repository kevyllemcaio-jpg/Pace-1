// Kevylem Vai Ficar Rico! — Episódio 1 (versão geladinho)
//
// Contas conferidas:
//   Saldo inicial R$ 12.
//   Mercadinho: 4 pacotes de suco a R$ 1 (R$ 4) + 100 saquinhos por R$ 3  -> gastou R$ 7, sobram R$ 5.
//   4 pacotes rendem 40 geladinhos (10 por pacote). Preço R$ 2 -> 40 x 2 = R$ 80.  5 + 80 = R$ 85.
//   Dobro: 8 pacotes de suco = R$ 8 (ainda tem 60 saquinhos)  -> 85 - 8 = R$ 77.
//   Formatura: 480 dias no dia 1, 479 no dia 2.

const CHAO = 1770; // pés dos personagens

const E = [];

// 1 — Quarto: apresentação (o 1º quadro vira a capa)
E.push({
  fala: 'Esse é o Kevylem. Ele tem *17 anos* e só *12 reais* no bolso.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + kevylem({ x: 540, y: CHAO, esc: 1.12, expr: 'determinado', t: lt }), lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1300 });
    s += pulo(pilula('EPISÓDIO 1', 540, 380), lt, 540, 380, 0);
    s += card(lt, c.w('17'), { x: 260, y: 560, w: 240, h: 200, rot: -5, conteudo: txt('17', 0, 30, { tam: 120, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) + txt('ANOS', 0, 78, { tam: 34 }) });
    s += card(lt, c.w('12'), { x: 820, y: 600, w: 260, h: 200, rot: 5, conteudo: moedas(-70, -40, 3) + moedaSolta(70, -50) + txt('R$ 12', 0, 30, { tam: 84, cor: '#222', fonte: F_TIT, peso: 400 }) + txt('NO BOLSO', 0, 76, { tam: 30, cor: '#666', ls: 2 }) });
    return s;
  },
});

// 2 — Quarto: a promessa
E.push({
  fala: 'Estuda em escola pública em Salvador e prometeu que vai *sair rico* antes da *formatura*.',
  desenhar(lt, c) {
    let s = camLenta(quarto(lt) + kevylem({ x: 700, y: CHAO, esc: 0.95, expr: 'orgulhoso', pose: 'coca', t: lt, olhar: [-1, -0.3] }), lt, c.dur, { z0: 1.12, z1: 1.0, cx: 420, cy: 900 });
    s += card(lt, c.w('formatura'), { x: 760, y: 600, w: 270, h: 220, rot: 4, conteudo: `<g transform="translate(0 -50) scale(2) translate(0 50)">${iconeCapelo(0, -50)}</g>` + txt('480', 0, 40, { tam: 96, cor: '#C33A3A', fonte: F_TIT, peso: 400 }) + txt('DIAS', 0, 88, { tam: 32 }) });
    return s;
  },
});

// 3 — Cozinha: mãe contando moeda
E.push({
  fala: 'Naquela noite, ele viu a mãe contando moeda na mesa da cozinha.',
  desenhar(lt, c) {
    const pilha = 2 + Math.floor((lt * 2.2) % 5);
    let mundo = cozinha(lt, { noite: true });
    mundo += kevylem({ x: 150, y: 1760, esc: 0.62, expr: 'preocupado', t: lt, olhar: [1, 0] });
    mundo += mae({ x: 620, y: 1700, esc: 0.78, expr: 'cansado', pose: 'conta', t: lt, olhar: [0, 1] });
    mundo += mesaCozinha(620, 1520, 640) + moedas(470, 1470, pilha) + moedas(530, 1470, 3) + moedaSolta(600, 1468) + moedaSolta(650, 1470) +
      `<ellipse cx="820" cy="1470" rx="80" ry="18" fill="#F4F4F4" stroke="#2A2A2A" stroke-width="4"/>`;
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.1, cx: 520, cy: 1300 });
  },
});

// 4 — Conta de água vencida
E.push({
  fala: 'A conta de água tinha *vencido*.',
  desenhar(lt, c) {
    let mundo = cozinha(lt, { noite: true }) + mae({ x: 620, y: 1700, esc: 0.78, expr: 'triste', pose: 'conta', t: lt, olhar: [0, 1] }) + mesaCozinha(620, 1520, 640) + moedas(500, 1470, 4);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.25, z1: 1.32, cx: 600, cy: 1250 });
    s += card(lt, 0.15, {
      x: 560, y: 560, w: 330, h: 380, rot: -4,
      conteudo: txt('CONTA DE ÁGUA', 0, -120, { tam: 40 }) + `<path d="M 0 -80 Q -40 -20 -40 10 A 40 40 0 0 0 40 10 Q 40 -20 0 -80 Z" fill="#3D8DD9" stroke="#2A2A2A" stroke-width="4"/>` +
        [80, 110, 140].map((y) => `<rect x="-120" y="${y}" width="${y === 140 ? 140 : 240}" height="12" rx="6" fill="#CFCFCF"/>`).join(''),
    });
    s += carimbo(lt, c.w('vencido'), { x: 560, y: 690, texto: 'VENCIDA', rot: -9 });
    return s;
  },
});

// 5 — "Já comi, filho."
E.push({
  fala: 'Ele perguntou da janta. Ela disse que já tinha comido. *Não tinha.*',
  desenhar(lt, c) {
    let mundo = cozinha(lt, { noite: true });
    mundo += mae({ x: 620, y: 1700, esc: 0.78, expr: lt > c.w('não') ? 'triste' : 'feliz', pose: 'conta', t: lt, olhar: [-1, 0], fala: lt > c.w('ela') && lt < c.w('não') - 0.2 });
    mundo += mesaCozinha(620, 1520, 640) + `<ellipse cx="760" cy="1470" rx="80" ry="18" fill="#F4F4F4" stroke="#2A2A2A" stroke-width="4"/>` + moedas(500, 1470, 4);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.5, z1: 1.6, cx: 640, cy: 1240 });
    s += balao(lt, c.w('ela'), { x: 640, y: 560, texto: 'JÁ COMI, FILHO.', tam: 50 });
    if (lt > c.w('não')) s += `<rect width="1080" height="1920" fill="#0A0E2A" opacity="${0.3 * suave((lt - c.w('não')) / 0.4)}"/>`;
    return s;
  },
});

// 6 — Quarto: começa a contagem (HUD aparece)
E.push({
  fala: 'Foi aí que começou a contagem. *480 dias* pra formatura.',
  hud: { dia: 1, saldo: 12, formatura: 480 },
  hudNovo: true,
  desenhar(lt, c) {
    return camLenta(quarto(lt) + kevylem({ x: 540, y: CHAO, esc: 0.9, expr: 'determinado', pose: 'cintura', t: lt }), lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1250 });
  },
});

// 7 — Fachada no calor
E.push({
  fala: 'Dia 1. Fazia *36 graus* no Colégio Estadual.',
  hud: { dia: 1, saldo: 12, formatura: 480 },
  desenhar(lt, c) {
    let s = camLenta(fachada(lt) + kevylem({ x: 760, y: 1850, esc: 0.62, expr: 'cansado', t: lt, suor: true, anda: lt < 1.2 }), lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1100 });
    s += card(lt, c.w('36'), {
      x: 270, y: 640, w: 250, h: 260, rot: -6,
      conteudo: `<rect x="-62" y="-90" width="28" height="130" rx="14" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><rect x="-55" y="-50" width="14" height="90" fill="#E0393E"/><circle cx="-48" cy="56" r="28" fill="#E0393E" stroke="#2A2A2A" stroke-width="5"/>` +
        txt('36°', 40, 30, { tam: 84, cor: '#C33A3A', fonte: F_TIT, peso: 400 }),
    });
    return s;
  },
});

// 8 — Cantina cara
E.push({
  fala: 'E a cantina vendia refrigerante a *8 reais*. Todo mundo reclamava.',
  hud: { dia: 1, saldo: 12, formatura: 480 },
  desenhar(lt, c) {
    let mundo = patio(lt);
    const fila = [[140, 1.0], [250, 2.0], [360, 3.0], [470, 4.0], [580, 5.0], [690, 6.0]];
    fila.forEach(([x, sm]) => (mundo += aluno(sm, { x, y: 1600, esc: 0.5, expr: 'cansado', t: lt, suor: sm % 2 === 0 })));
    mundo += kevylem({ x: 140, y: 1820, esc: 0.6, expr: 'desconfiado', t: lt, olhar: [1, 0] });
    mundo += aluno(9, { x: 860, y: 1840, esc: 0.62, expr: 'bravo', pose: 'cintura', t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1200 });
    s += card(lt, c.w('8'), { x: 300, y: 560, w: 300, h: 220, rot: -4, conteudo: `<rect x="-100" y="-60" width="46" height="100" rx="10" fill="#C8302F" stroke="#2A2A2A" stroke-width="4"/><rect x="-92" y="-30" width="30" height="20" fill="#fff"/>` + txt('R$ 8', 40, 30, { tam: 90, cor: '#C33A3A', fonte: F_TIT, peso: 400 }) + txt('REFRI', -77, 75, { tam: 26 }) });
    s += balao(lt, c.w('todo'), { x: 820, y: 1250, texto: 'CARO DEMAIS!', tam: 44 });
    return s;
  },
});

// 9 — A ideia
E.push({
  fala: 'O Kevylem fez a conta: calor, fila e preço alto. Ele ia vender *geladinho*.',
  hud: { dia: 1, saldo: 12, formatura: 480 },
  desenhar(lt, c) {
    const ideia = lt > c.w('geladinho');
    let s = camLenta(patio(lt) + kevylem({ x: 540, y: 1800, esc: 0.95, expr: ideia ? 'sorriso' : 'desconfiado', pose: ideia ? 'ergue' : 'coca', t: lt, olhar: [0.5, -1] }), lt, c.dur, { z0: 1.15, z1: 1.25, cy: 1300 });
    const itens = [['calor', '☀', '#F7C531'], ['fila', '⋯', '#7DC6E8'], ['alto', 'R$', '#E0393E']];
    itens.forEach(([p, ic, cor], i) => {
      s += card(lt, c.w(p), { x: 220 + i * 320, y: 470, w: 200, h: 170, rot: [-5, 3, -2][i], conteudo: `<circle cx="0" cy="0" r="56" fill="${cor}" stroke="#2A2A2A" stroke-width="4"/>` + txt(ic, 0, 22, { tam: 60, cor: '#fff', fonte: F_TIT, peso: 400 }) });
    });
    s += card(lt, c.w('geladinho'), { x: 540, y: 720, w: 330, h: 240, rot: 3, conteudo: CORES_GELADINHO.slice(0, 5).map((cor, i) => geladinho(cor, -110 + i * 55, -10, -10 + i * 5, 1)).join('') + txt('GELADINHO', 0, 95, { tam: 36 }) });
    return s;
  },
});

// 10 — Passo 1: mercadinho
E.push({
  fala: 'Passo 1: no mercadinho, *4 pacotes* de suco a 1 real e *100 saquinhos* por 3 reais.',
  hud: { dia: 1, saldo: 5, de: 12, formatura: 480, quando: 'saquinhos' },
  passo: 'PASSO 1 · MERCADINHO',
  passoNovo: true,
  desenhar(lt, c) {
    let s = camLenta(mercadinho(lt) + kevylem({ x: 540, y: 1820, esc: 0.62, expr: 'feliz', pose: 'segura', t: lt, segura: moedaSolta(0, 0) }), lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1200 });
    s += card(lt, c.w('pacotes'), {
      x: 300, y: 520, w: 280, h: 260, rot: -5,
      conteudo: pacoteSuco(-55, -10, '#F28C28', 0.9, 'UVA') + pacoteSuco(0, 0, '#8E44AD', 0.9, 'UVA') + pacoteSuco(55, -10, '#E8434F', 0.9, 'MORANGO') + txt('4 × R$ 1', 0, 100, { tam: 36 }),
    });
    s += card(lt, c.w('saquinhos'), { x: 780, y: 540, w: 260, h: 260, rot: 5, conteudo: saquinhos(0, -10, 1.2) + txt('R$ 3', 0, 100, { tam: 36 }) });
    return s;
  },
});

// 11 — Passo 2: congelar
E.push({
  fala: 'Passo 2: misturou tudo, encheu os saquinhos e usou o freezer da mãe. Rendeu *40 geladinhos*.',
  hud: { dia: 1, saldo: 5, formatura: 480 },
  passo: 'PASSO 2 · CONGELAR',
  passoNovo: true,
  desenhar(lt, c) {
    const k = lim((lt - 0.5) / Math.max(0.1, c.w('rendeu') - 0.5));
    let mundo = cozinha(lt, { noite: false, vapor: false });
    mundo += kevylem({ x: 540, y: 1800, esc: 0.75, expr: lt > c.w('rendeu') ? 'sorriso' : 'determinado', pose: 'segura', t: lt, segura: geladinho(CORES_GELADINHO[Math.floor(lt * 3) % 6], 0, -10) });
    // fileira de geladinhos crescendo na bancada
    const n = Math.floor(k * 14);
    for (let i = 0; i < n; i++) mundo += geladinho(CORES_GELADINHO[i % 6], 70 + i * 34, 990, 0, 0.6);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1250 });
    s += card(lt, c.w('freezer'), { x: 250, y: 560, w: 230, h: 260, rot: -4, conteudo: `<rect x="-60" y="-100" width="120" height="160" rx="10" fill="#EEF3F7" stroke="#2A2A2A" stroke-width="5"/><line x1="-60" y1="-40" x2="60" y2="-40" stroke="#2A2A2A" stroke-width="4"/><rect x="40" y="-85" width="8" height="30" rx="4" fill="#888"/><rect x="40" y="-25" width="8" height="40" rx="4" fill="#888"/>` + txt('DA MÃE', 0, 100, { tam: 34 }) });
    s += card(lt, c.w('40'), { x: 770, y: 560, w: 300, h: 250, rot: 4, conteudo: isopor(-80, 0, 0.55) + txt('40', 60, 20, { tam: 110, cor: '#2F5F9E', fonte: F_TIT, peso: 400 }) + txt('GELADINHOS', 0, 98, { tam: 32 }) });
    return s;
  },
});

// 12 — Passo 3: o preço
E.push({
  fala: 'Passo 3: o preço. Se o refri custava 8, o geladinho ia custar *2 reais*.',
  hud: { dia: 1, saldo: 5, formatura: 480 },
  passo: 'PASSO 3 · O PREÇO',
  passoNovo: true,
  desenhar(lt, c) {
    let s = camLenta(patio(lt) + kevylem({ x: 540, y: 1820, esc: 0.7, expr: 'orgulhoso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.8) }), lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1250 });
    s += card(lt, c.w('refri'), { x: 290, y: 600, w: 280, h: 260, rot: -5, conteudo: txt('CANTINA', 0, -80, { tam: 34, cor: '#C8302F' }) + `<rect x="-24" y="-56" width="48" height="90" rx="10" fill="#C8302F" stroke="#2A2A2A" stroke-width="4"/>` + txt('R$ 8', 0, 100, { tam: 64, cor: '#C33A3A', fonte: F_TIT, peso: 400 }) });
    s += card(lt, c.w('2'), { x: 790, y: 600, w: 280, h: 260, rot: 5, conteudo: txt('KEVYLEM', 0, -80, { tam: 34, cor: '#2F5F9E' }) + geladinho('#8E44AD', 0, -6, 0, 0.9) + txt('R$ 2', 0, 100, { tam: 64, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    if (lt > c.w('2')) s += pulo(`<line x1="160" y1="530" x2="420" y2="680" stroke="#E0393E" stroke-width="14" stroke-linecap="round"/><line x1="420" y1="530" x2="160" y2="680" stroke="#E0393E" stroke-width="14" stroke-linecap="round"/>`, lt, 290, 600, c.w('2') + 0.2);
    return s;
  },
});

// 13 — O primeiro intervalo
E.push({
  fala: 'No primeiro intervalo, acabou tudo em *15 minutos*. O saldo foi de 5 pra...',
  hud: { dia: 1, saldo: 5, formatura: 480 },
  desenhar(lt, c) {
    let mundo = patio(lt);
    const roda = [[180, 21, 1640], [330, 22, 1600], [760, 23, 1600], [900, 24, 1640], [250, 25, 1860], [850, 26, 1860]];
    roda.forEach(([x, sm, y], i) => (mundo += aluno(sm, { x, y, esc: 0.55, expr: lt > 0.6 + i * 0.25 ? 'sorriso' : 'surpreso', pose: lt > 0.6 + i * 0.25 ? 'ergue' : 'oferece', t: lt, naMao: lt > 0.6 + i * 0.25 ? geladinho(CORES_GELADINHO[i % 6], 0, -40, 0, 0.7) : '' })));
    const restam = Math.max(0, 5 - Math.floor(lt * 1.8));
    mundo += kevylem({ x: 540, y: 1800, esc: 0.68, expr: 'sorriso', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75, restam > 0) });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 });
    s += card(lt, c.w('15'), { x: 860, y: 440, w: 230, h: 200, rot: 5, conteudo: `<circle cx="0" cy="-22" r="46" fill="#fff" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="-55" stroke="#2A2A2A" stroke-width="5"/><line x1="0" y1="-22" x2="${Math.cos(lt * 4) * 30}" y2="${-22 + Math.sin(lt * 4) * 30}" stroke="#E0393E" stroke-width="5"/>` + txt('15 MIN', 0, 75, { tam: 40 }) });
    s += card(lt, c.w('saldo'), { x: 420, y: 640, w: 420, h: 170, rot: -2, conteudo: txt('SALDO', 0, -40, { tam: 28, cor: '#888', ls: 2 }) + txt('R$ 5  →  ?', 0, 45, { tam: 84, cor: '#999', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 14 — R$ 85
E.push({
  fala: '*85 reais.* De um investimento de 7.',
  hud: { dia: 1, saldo: 85, de: 5, formatura: 480, quando: 0.25 },
  desenhar(lt, c) {
    let s = camLenta(patio(lt) + kevylem({ x: 540, y: 1800, esc: 0.95, expr: 'surpreso', pose: 'ergue', t: lt, naMao: moedaSolta(0, -20) }), lt, c.dur, { z0: 1.2, z1: 1.3, cy: 1250 });
    // chuva de moedas
    for (let i = 0; i < 14; i++) {
      const r = aleatorio(i + 40);
      const x = r() * 1080, v = 500 + r() * 400, y0 = -100 - r() * 600;
      const y = y0 + v * lt;
      if (y < 1950) s += moedaSolta(x, y);
    }
    s += card(lt, 0.25, { x: 540, y: 560, w: 470, h: 230, rot: -3, conteudo: txt('R$ 85', 0, 50, { tam: 150, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 15 — Comprou o dobro
E.push({
  fala: 'No mesmo dia, voltou no mercadinho e comprou o *dobro* de suco.',
  hud: { dia: 1, saldo: 77, de: 85, formatura: 480, quando: 'dobro' },
  desenhar(lt, c) {
    const pacotes = Array.from({ length: 8 }, (_, i) => pacoteSuco(-90 + (i % 4) * 60, -36 + Math.floor(i / 4) * 52, CORES_GELADINHO[i % 6], 0.5, '')).join('');
    let s = camLenta(mercadinho(lt) + kevylem({ x: 540, y: 1820, esc: 0.62, expr: 'determinado', pose: 'segura', t: lt, segura: `<g transform="translate(0 20)">${pacotes}</g>` }), lt, c.dur, { z0: 1.0, z1: 1.12, cy: 1300 });
    s += pulo(`<circle cx="800" cy="560" r="95" fill="#FFD21F" stroke="#2A2A2A" stroke-width="6"/>` + txt('×2', 800, 595, { tam: 100, cor: '#222', fonte: F_TIT, peso: 400 }), lt, 800, 560, c.w('dobro'));
    som('pop', c.w('dobro'));
    return s;
  },
});

// 16 — Dia 2: a diretora
E.push({
  fala: 'Dia 2. Mas a diretora apareceu: vender dentro da escola é *proibido*.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  desenhar(lt, c) {
    const chegou = mix(1300, 790, suave((lt - 0.3) / 0.8));
    let mundo = patio(lt);
    mundo += aluno(31, { x: 120, y: 1700, esc: 0.55, expr: 'surpreso', t: lt });
    mundo += aluno(32, { x: 240, y: 1660, esc: 0.5, expr: 'preocupado', t: lt });
    mundo += kevylem({ x: 420, y: 1800, esc: 0.68, expr: lt > c.w('proibido') ? 'preocupado' : 'feliz', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75), olhar: [1, 0] });
    mundo += diretora({ x: chegou, y: 1800, esc: 0.7, expr: 'bravo', pose: lt > c.w('vender') ? 'aponta' : 'cintura', vira: -1, t: lt, anda: lt < 1.1, fala: lt > c.w('vender') && lt < c.w('proibido') });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.08, cx: 600, cy: 1300 });
    s += balao(lt, c.w('vender'), { x: 760, y: 1000, texto: 'AQUI DENTRO, NÃO!', tam: 44, ponta: 'dir' });
    s += carimbo(lt, c.w('proibido'), { x: 540, y: 600, texto: 'PROIBIDO', rot: 7 });
    return s;
  },
});

// 17 — Corredor: o dono da cantina chama
E.push({
  fala: 'No fim da aula, o dono da cantina chamou ele num canto.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  desenhar(lt, c) {
    let mundo = corredor(lt);
    mundo += kevylem({ x: 380, y: 1780, esc: 0.62, expr: 'desconfiado', t: lt, olhar: [1, 0] });
    mundo += donoCantina({ x: 700, y: 1780, esc: 0.66, expr: 'desconfiado', pose: 'acena', vira: -1, t: lt, olhar: [-1, 0] });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.1, cx: 540, cy: 1400 });
  },
});

// 18 — A proposta
E.push({
  fala: 'Trabalha pra mim. *25 reais* por dia, garantido.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  desenhar(lt, c) {
    let mundo = corredor(lt);
    mundo += kevylem({ x: 330, y: 1840, esc: 0.85, expr: 'surpreso', t: lt, olhar: [1, -0.3] });
    mundo += donoCantina({ x: 760, y: 1840, esc: 0.9, expr: 'orgulhoso', pose: 'oferece', vira: -1, t: lt, olhar: [-1, 0], fala: lt < c.w('25') });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.1, z1: 1.18, cx: 540, cy: 1450 });
    s += balao(lt, 0.15, { x: 680, y: 640, texto: 'TRABALHA PRA MIM.', tam: 46, ponta: 'dir' });
    s += card(lt, c.w('25'), { x: 330, y: 560, w: 280, h: 230, rot: -5, conteudo: txt('R$ 25', 0, 20, { tam: 100, cor: '#2FA45A', fonte: F_TIT, peso: 400 }) + txt('POR DIA', 0, 80, { tam: 34 }) });
    return s;
  },
});

// 19 — O portão e a Dona Cida
E.push({
  fala: 'Só que do lado de fora do portão tem a *Dona Cida*.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  desenhar(lt, c) {
    let mundo = portao(lt) + carrinhoAcai(780, 1660, lt) + donaCida({ x: 780, y: 1560, esc: 0.6, expr: 'desconfiado', pose: 'cintura', t: lt, olhar: [-1, 0] }) + balcaoAcai(780, 1740, 0.95);
    mundo += kevylem({ x: 200, y: 1800, esc: 0.62, expr: 'preocupado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75), olhar: [1, 0] });
    return camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cx: 540, cy: 1300 });
  },
});

// 20 — 15 anos no ponto
E.push({
  fala: 'Ela vende açaí ali há 15 anos. E *não divide* o ponto com ninguém.',
  hud: { dia: 2, saldo: 77, formatura: 479 },
  desenhar(lt, c) {
    let mundo = portao(lt) + carrinhoAcai(780, 1660, lt) + donaCida({ x: 780, y: 1560, esc: 0.6, expr: lt > c.w('não') ? 'bravo' : 'desconfiado', pose: 'cintura', t: lt, olhar: [-1, 0] }) + balcaoAcai(780, 1740, 0.95);
    let s = camLenta(mundo, lt, c.dur, { z0: 1.7, z1: 1.8, cx: 780, cy: 1360 });
    s += card(lt, c.w('15'), { x: 300, y: 520, w: 300, h: 190, rot: -4, conteudo: txt('NO MESMO PONTO HÁ', 0, -40, { tam: 24, cor: '#666' }) + txt('15 ANOS', 0, 50, { tam: 84, cor: '#7B2E9E', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// 21 — A escolha
function painelA(lt) {
  let s = `<svg x="0" y="0" width="1080" height="940" overflow="hidden">` + `<g transform="translate(0 -930)">` + corredor(lt) + kevylem({ x: 380, y: 1800, esc: 0.62, expr: 'feliz', t: lt }) + donoCantina({ x: 700, y: 1800, esc: 0.66, expr: 'feliz', pose: 'oferece', vira: -1, t: lt }) + `</g>` + `</svg>`;
  s += `<circle cx="110" cy="130" r="62" fill="#2F6DB5" stroke="#fff" stroke-width="8"/>` + txt('A', 110, 160, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('R$ 25 GARANTIDO', 400, 130, { tam: 40 });
  return s;
}
function painelB(lt) {
  let s = `<svg x="0" y="980" width="1080" height="940" overflow="hidden">` + `<g transform="translate(0 -930)">` + portao(lt) + carrinhoAcai(780, 1660, lt) + donaCida({ x: 780, y: 1560, esc: 0.6, expr: 'bravo', pose: 'cintura', t: lt, olhar: [-1, 0] }) + balcaoAcai(780, 1740, 0.95) + kevylem({ x: 230, y: 1800, esc: 0.62, expr: 'determinado', pose: 'segura', t: lt, segura: isopor(0, 0, 0.75) }) + `</g>` + `</svg>`;
  s += `<circle cx="110" cy="1110" r="62" fill="#D7262B" stroke="#fff" stroke-width="8"/>` + txt('B', 110, 1140, { tam: 84, cor: '#fff', fonte: F_TIT, peso: 400 });
  s += pilula('SOZINHO NO PORTÃO', 410, 1110, { tam: 40 });
  return s;
}
E.push({
  fala: 'Agora quem decide é você. A: aceita os 25 da cantina. B: vende sozinho no portão.',
  hud: null,
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#111"/>`;
    s += pulo(painelA(lt), lt, 540, 470, c.w('a:') - 0.1);
    s += pulo(painelB(lt), lt, 540, 1450, c.w('b:') - 0.1);
    s += `<rect y="950" width="1080" height="20" fill="#111"/>`;
    return s;
  },
});

// 22 — Comenta A ou B (fundo desbotado)
E.push({
  fala: 'Comenta *A* ou *B*. O que o Kevylem faz?',
  desenhar(lt, c) {
    let s = camLenta(patio(lt) + kevylem({ x: 540, y: 1860, esc: 1.2, expr: 'preocupado', t: lt, olhar: [Math.sin(lt * 1.5), 0] }), lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1400 });
    s += `<rect width="1080" height="1920" fill="#E8E4DA" opacity="0.45"/>`;
    return s;
  },
});

// 23 — Episódio 2: você decide
E.push({
  fala: 'A mais votada vira o episódio 2.',
  semLegenda: true,
  dur: 3,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#0F1116"/>`;
    s += pulo(txt('EPISÓDIO 2', 540, 900, { tam: 150, cor: '#fff', fonte: F_TIT, peso: 400 }), lt, 540, 850, 0.1);
    s += pulo(txt('VOCÊ DECIDE', 540, 1030, { tam: 110, cor: '#FFD21F', fonte: F_TIT, peso: 400 }), lt, 540, 990, 0.45);
    s += pulo(txt('COMENTA  A  OU  B', 540, 1180, { tam: 54, cor: '#AEB4C2' }), lt, 540, 1160, 0.9);
    return s;
  },
});

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });

// Story de enquete A/B.
window.STORY = () =>
  storyAB({
    enquete: false,
    episodio: 'EPISÓDIO 1 · KEVYLEM VAI FICAR RICO!',
    a: { rotulo: 'ACEITA R$ 25 DA CANTINA', mundo: corredor(0.5) + kevylem({ x: 380, y: 1800, esc: 0.62, expr: 'desconfiado', t: 0.5, olhar: [1, 0] }) + donoCantina({ x: 700, y: 1800, esc: 0.66, expr: 'orgulhoso', pose: 'oferece', vira: -1, t: 0.5, olhar: [-1, 0] }) },
    b: { rotulo: 'VENDE SOZINHO NO PORTÃO', mundo: portao(0.5) + carrinhoAcai(780, 1660, 0.5) + donaCida({ x: 780, y: 1560, esc: 0.6, expr: 'bravo', pose: 'cintura', t: 0.5, olhar: [-1, 0] }) + balcaoAcai(780, 1740, 0.95) + kevylem({ x: 230, y: 1800, esc: 0.62, expr: 'determinado', pose: 'segura', t: 0.5, segura: isopor(0, 0, 0.75) }) },
  });
