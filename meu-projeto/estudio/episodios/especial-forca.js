// ESPECIAL — "E se você tivesse SUPERFORÇA por 1 dia?" (fora da série)
// Personagem original desenhado com corpo.js (proporções humanas, músculos, cinemática inversa).
// Forma normal: moletom. Forma forte: pele normal, veias de energia laranja, shorts preto com faixa laranja. Formato curto: gancho no 1º quadro, um fato por hora.
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

// ---------- helpers de cena ----------
// Converte um ponto do mundo para as coordenadas locais do corpo (pés em x0,y0, escala esc).
const local = (wx, wy, x0, y0, esc) => [(wx - x0) / esc, (wy - y0) / esc];
const mundo = (lx, ly, x0, y0, esc) => [x0 + lx * esc, y0 + ly * esc];
function flash(lt, t0, dur = 0.3) {
  if (lt < t0 || lt > t0 + dur) return '';
  return `<rect width="1080" height="1920" fill="#FFF3D6" opacity="${(1 - (lt - t0) / dur).toFixed(2)}"/>`;
}

// ---------- 1 — GANCHO: carro acima da cabeça ----------
E.push({
  fala: 'E se você acordasse amanhã com *superforça*? Força de verdade, de levantar carro. Só por *1 dia*.',
  capa: 0.05,
  legendaY: 760,
  desenhar(lt, c) {
    const X = 540, Y = 1900, ES = 0.82;
    const bob = 8 + Math.sin(lt * 3) * 8;
    const pose = { agach: bob, maoD: [120, -1010 + bob], maoE: [-120, -1010 + bob], cotD: 'baixo', cotE: 'baixo' };
    const [hx, hy] = mundo(0, -1010 + bob, X, Y, ES);
    let s = ceu('#F2B36B', '#FBE1B8', 'ceuForca') + casario(-20, 1100, 1500, { semente: 91, alt: [300, 800] });
    s += `<rect y="1500" width="1080" height="420" fill="#3A3A42"/>`;
    s += carro(hx + 10, hy + 22, 1.3, -2);
    s += corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: 1, expr: 'grito', t: lt, pose });
    s += `<rect width="1080" height="640" fill="#000" opacity="0.28"/>`;
    [['E SE VOCÊ TIVESSE', '#FFFFFF'], ['SUPERFORÇA', LARANJA], ['POR 1 DIA?', '#FFFFFF']].forEach(([t, cor], i) =>
      (s += txt(t, 540, 200 + i * 140, { tam: Math.min(140, 960 / (t.length * 0.45)), cor, fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 })));
    return s;
  },
});

// ---------- 2 — 06:00 a porta sai na mão ----------
E.push({
  fala: '6 da manhã. Você vai abrir a porta do quarto... e ela *sai inteira* na sua mão.',
  desenhar(lt, c) {
    const X = 600, Y = 1820, ES = 1.0;
    const ts = c.w('sai');
    const macaneta = local(860, 1270, X, Y, ES);
    const pose = animar([
      [0, { cabeca: 0 }],
      [0.6, { maoD: macaneta, qx: 10 }],
      [ts - 0.15, { maoD: [macaneta[0] - 10, macaneta[1]], qx: 0 }],
      [ts + 0.15, { maoD: [macaneta[0] - 90, macaneta[1] + 10], qx: -40, inclina: -18 }],
      [ts + 0.9, { maoD: [150, -690], maoE: [-60, -560], qx: -10, inclina: 0 }],
    ], lt, poseBase(0));
    let mundoSvg = quarto(lt);
    if (lt < ts) mundoSvg += porta(800, 1260, 0);
    else {
      const [hx, hy] = mundo(...pose.maoD, X, Y, ES);
      mundoSvg += porta(hx + 40, hy + 30, mix(0, 12, lim((lt - ts) / 0.6)));
    }
    mundoSvg += corpo({ x: X, y: Y, esc: ES, musculo: 0, expr: lt > ts ? 'surpreso' : 'cansado', t: lt, pose, olhar: [1, 0] });
    let s = tremor(camLenta(mundoSvg, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1350 }), lt, ts, 16);
    if (lt > ts) s += carimbo(lt, ts, { x: 540, y: 620, texto: 'CRAC!', rot: -8, tam: 130, cor: '#8A5A3C' });
    s += relogio('06:00', lt);
    return s;
  },
});

// ---------- 3 — 07:00 a transformação ----------
E.push({
  fala: '7 horas. Seu corpo *cresce*: 2 metros e meio, músculo pra todo lado. E as veias começam a *brilhar*.',
  desenhar(lt, c) {
    const X = 540, Y = 1840;
    const t0 = c.w('cresce'), t1 = t0 + 1.3;
    const m = suave((lt - t0) / 1.3);
    const ES = mix(0.95, 0.8, m);
    const energia = lim((lt - c.w('brilhar') + 0.2) / 0.5);
    const base = poseBase(m);
    const pose = lt < t1
      ? { ...base, agach: Math.sin(lim((lt - t0) / 1.3) * Math.PI) * 60, maoD: [base.maoD[0] + 40 * m, base.maoD[1]], maoE: [base.maoE[0] - 40 * m, base.maoE[1]], qx: Math.sin(lt * 40) * 6 * (m > 0 && m < 1 ? 1 : 0) }
      : animar([[t1, base], [t1 + 0.5, { maoD: [178, -770], maoE: [-178, -770], cotD: 'baixo', cotE: 'baixo', agach: 10 }]], lt, base);
    let mundoSvg = quarto(lt) + corpo({ x: X, y: Y, esc: ES, musculo: m, energia: Math.max(energia, m > 0 && m < 1 ? 0.6 : 0), expr: m < 0.05 ? 'surpreso' : lt > t1 ? 'confiante' : 'esforco', t: lt, pose });
    let s = camLenta(mundoSvg, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1300 });
    if (m > 0 && m < 1) s = tremor(s, lt, t0, 10, 1.3);
    s += flash(lt, t0 + 0.65, 0.3);
    som('carimbo', t0 + 0.65, 0.8);
    s += relogio('07:00', lt);
    s += card(lt, c.w('2'), { x: 260, y: 560, w: 260, h: 220, rot: -5, conteudo: txt('2,5 M', 0, 30, { tam: 96, cor: '#2E4A7A', fonte: F_TIT, peso: 400 }) + txt('DE ALTURA', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 4 — 08:00 academia: 501 kg com uma mão ----------
E.push({
  fala: '8 horas, academia. O recorde mundial de levantamento terra é *501 quilos*. Você levanta isso... com *uma mão*.',
  desenhar(lt, c) {
    const X = 540, Y = 1860, ES = 0.8;
    const tu = c.w('uma');
    const pose = animar([
      [0, { maoE: [-170, -330] }],
      [tu - 0.7, { agach: 150, maoD: [40, -170], maoE: [-150, -420], qx: 0 }],
      [tu + 0.1, { agach: 150, maoD: [40, -170] }],
      [tu + 0.7, { agach: 10, maoD: [190, -560] }],
      [tu + 1.3, { agach: 30, maoD: [150, -1030], cotD: 'baixo' }],
    ], lt, poseBase(1));
    const [hx, hy] = lt < tu - 0.7 ? [X + 40 * ES, Y - 170 * ES + (lt < tu - 0.7 ? 0 : 0)] : mundo(...pose.maoD, X, Y, ES);
    const barraY = lt < tu - 0.7 ? Y - 100 : hy;
    let mundoSvg = `<rect width="1080" height="1920" fill="#3A4152"/><rect y="1400" width="1080" height="520" fill="#22262F"/>`;
    for (let x = 60; x < 1080; x += 200) mundoSvg += `<rect x="${x}" y="300" width="120" height="900" rx="10" fill="#4A5266"/>`;
    mundoSvg += anilha(hx, barraY, 0.85);
    mundoSvg += corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: lt > tu ? 1 : 0.4, expr: lt > tu + 1.2 ? 'confiante' : lt > tu - 0.7 ? 'esforco' : 'neutro', t: lt, pose });
    let s = tremor(camLenta(mundoSvg, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1300 }), lt, tu + 1.3, 14);
    s += relogio('08:00', lt);
    s += card(lt, c.w('501'), { x: 270, y: 540, w: 300, h: 230, rot: -5, conteudo: txt('RECORDE', 0, -55, { tam: 32, cor: '#888' }) + txt('501 KG', 0, 50, { tam: 100, cor: '#D7262B', fonte: F_TIT, peso: 400 }) });
    s += card(lt, tu, { x: 810, y: 560, w: 260, h: 220, rot: 5, conteudo: txt('1 MÃO', 0, 30, { tam: 96, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) });
    return s;
  },
});

// ---------- 5 — 10:00 o carro ----------
E.push({
  fala: '10 horas. Um carro popular pesa mais ou menos *1 tonelada*. Você tira ele da vaga como quem pega uma *mochila*.',
  desenhar(lt, c) {
    const ES = 0.78, Y = 1880;
    const tt = c.w('tira');
    const anda = lim(lt / Math.max(0.5, tt - 0.6));
    const X = mix(180, 760, anda);
    let pose = animar([
      [0, {}],
      [tt - 0.4, {}],
      [tt + 0.1, { agach: 150, maoD: [150, -200], maoE: [-150, -200] }],
      [tt + 0.8, { agach: 20, maoD: [140, -560], maoE: [-140, -560] }],
      [tt + 1.4, { agach: 25, maoD: [115, -1010], maoE: [-115, -1010], cotD: 'baixo', cotE: 'baixo' }],
    ], lt, poseBase(1));
    if (anda < 1) pose = passo(pose, lt, { vel: 9, altura: 40 });
    let carroSvg;
    if (lt < tt + 0.1) carroSvg = carro(760, 1790, 0.95, 0, '#2F8F5B');
    else {
      const [hx, hy] = mundo(0, pose.maoD[1], X, Y, ES);
      carroSvg = carro(hx, hy + 20, 0.95, 0, '#2F8F5B');
    }
    let mundoSvg = ruaPasseio(lt) + carroSvg + corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: lt > tt ? 1 : 0.3, expr: lt > tt + 1.4 ? 'sorriso' : lt > tt - 0.4 ? 'esforco' : 'confiante', t: lt, pose });
    let s = tremor(camLenta(mundoSvg, lt, c.dur, { z0: 1.0, z1: 1.04, cy: 1300 }), lt, tt + 1.4, 12);
    s += relogio('10:00', lt);
    s += card(lt, c.w('1'), { x: 280, y: 540, w: 280, h: 220, rot: -5, conteudo: txt('1 TON', 0, 30, { tam: 100, cor: '#2E4A7A', fonte: F_TIT, peso: 400 }) + txt('O CARRO', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 6 — 12:00 besouro-rinoceronte: 4 ônibus ----------
E.push({
  fala: 'Meio-dia. Na natureza, o campeão é o *besouro-rinoceronte*: levanta até 850 vezes o próprio peso. No seu tamanho, isso seria *60 toneladas*. Uns 4 ônibus.',
  desenhar(lt, c) {
    const X = 540, Y = 1880, ES = 0.72;
    const n = Math.min(4, Math.floor(lim((lt - c.w('tamanho')) / 1.0) * 5));
    const carga = n * 22 + (n ? Math.sin(lt * 30) * 3 : 0);
    const pose = n === 0
      ? animar([[0, {}], [c.w('tamanho') - 0.3, { maoD: [115, -1010], maoE: [-115, -1010], cotD: 'baixo', cotE: 'baixo' }]], lt, poseBase(1))
      : { ...poseBase(1), agach: carga, maoD: [115, -1010 + carga], maoE: [-115, -1010 + carga], cotD: 'baixo', cotE: 'baixo', qx: Math.sin(lt * 25) * n };
    const [hx, hy] = mundo(0, pose.maoD[1], X, Y, ES);
    let mundoSvg = ruaPasseio(lt);
    for (let i = 0; i < n; i++) mundoSvg += onibus(hx, hy + 8 - i * 165, 0.72);
    mundoSvg += corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: n ? 1 : 0.5, expr: n >= 3 ? 'grito' : n ? 'esforco' : 'surpreso', t: lt, pose });
    let s = camLenta(mundoSvg, lt, c.dur, { z0: 1.0, z1: 1.03, cy: 1250 });
    for (let i = 1; i <= n; i++) s = tremor(s, lt, c.w('tamanho') + (i - 1) * 0.2, 8, 0.3);
    s += relogio('12:00', lt);
    s += card(lt, c.w('besouro'), {
      x: 250, y: 540, w: 280, h: 240, rot: -5,
      conteudo: `<ellipse cx="0" cy="0" rx="62" ry="44" fill="#5A3A28" stroke="#2A2A2A" stroke-width="5"/><path d="M 50 -10 Q 90 -60 70 -90" fill="none" stroke="#2A2A2A" stroke-width="10" stroke-linecap="round"/>` +
        [-30, 0, 30].map((x) => `<line x1="${x}" y1="30" x2="${x - 14}" y2="62" stroke="#2A2A2A" stroke-width="6"/>`).join('') + txt('850×', 0, 100, { tam: 54, cor: '#D7262B', fonte: F_TIT, peso: 400 }),
    });
    s += card(lt, c.w('60'), { x: 820, y: 540, w: 270, h: 220, rot: 5, conteudo: txt('60 TON', 0, 30, { tam: 92, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) + txt('≈ 4 ÔNIBUS', 0, 85, { tam: 30 }) });
    return s;
  },
});

// ---------- 7 — 13:00 a fome ----------
E.push({
  fala: 'Mas tem um preço. Músculo gasta energia. No almoço você come *10 pratos*... e ainda sai com fome.',
  desenhar(lt, c) {
    const X = 540, Y = 1900, ES = 0.78;
    const n = Math.floor(lim((lt - c.w('10') + 0.4) / 1.6) * 10);
    const k = (Math.sin(lt * 5) + 1) / 2, k2 = (Math.sin(lt * 5 + Math.PI) + 1) / 2;
    const comendo = n < 10;
    const pose = {
      ...poseBase(1),
      maoD: comendo ? [mix(170, 30, k), mix(-760, -930, k)] : [140, -760],
      maoE: comendo ? [mix(-170, -30, k2), mix(-760, -930, k2)] : [-140, -760],
    };
    let mundoSvg = cozinha(lt, { noite: false, vapor: true });
    mundoSvg += corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: 0.15, expr: comendo ? (k > 0.8 || k2 > 0.8 ? 'surpreso' : 'sorriso') : 'triste', t: lt, pose });
    if (comendo) for (const mao of [pose.maoD, pose.maoE]) {
      const [fx, fy] = mundo(mao[0], mao[1] - 34, X, Y, ES);
      mundoSvg += `<g transform="translate(${fx} ${fy}) rotate(-30)"><ellipse cx="0" cy="-10" rx="30" ry="22" fill="#C8752E" stroke="#2A2A2A" stroke-width="4"/><rect x="-6" y="8" width="12" height="30" rx="5" fill="#F4E9D8" stroke="#2A2A2A" stroke-width="4"/></g>`;
    }
    mundoSvg += mesaCozinha(540, 1540, 760) + pratos(330, 1490, Math.min(n, 5)) + pratos(750, 1490, Math.max(0, n - 5));
    let s = camLenta(mundoSvg, lt, c.dur, { z0: 1.15, z1: 1.22, cx: 540, cy: 1380 });
    s += relogio('13:00', lt);
    s += card(lt, c.w('10'), { x: 820, y: 560, w: 250, h: 210, rot: 5, conteudo: txt('10', 0, 30, { tam: 120, cor: '#D7262B', fonte: F_TIT, peso: 400 }) + txt('PRATOS', 0, 80, { tam: 32 }) });
    return s;
  },
});

// ---------- 8 — 18:00 quebra tudo ----------
E.push({
  fala: 'E o pior: você *quebra tudo* que toca. Copo, maçaneta... e o seu *celular*.',
  desenhar(lt, c) {
    const X = 540, Y = 1880, ES = 0.82;
    const tc = c.w('celular');
    const aperta = lt > tc ? 1 : 0;
    const pose = animar([[0, {}], [0.5, { maoD: [55, -780], maoE: [-55, -780], cotD: 'baixo', cotE: 'baixo' }], [tc - 0.1, { maoD: [55, -780], maoE: [-55, -780] }], [tc + 0.1, { maoD: [26, -785], maoE: [-26, -785] }]], lt, poseBase(1));
    const [px, py] = mundo(0, pose.maoD[1] - 40, X, Y, ES);
    const cel = `<g transform="translate(${px} ${py})"><rect x="-34" y="-58" width="68" height="116" rx="12" fill="#22262F" stroke="#2A2A2A" stroke-width="5"/><rect x="-26" y="-46" width="52" height="88" rx="5" fill="${aperta ? '#555' : '#4A90E2'}"/>` +
      (aperta ? `<path d="M -20 -36 L 0 -6 L -14 10 L 12 34 M 0 -6 L 20 -24" fill="none" stroke="#fff" stroke-width="4"/>` : '') + `</g>`;
    let mundoSvg = quarto(lt) + cel + corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: aperta ? 0.8 : 0.2, expr: aperta ? 'triste' : 'neutro', t: lt, pose, olhar: [0, 1] });
    let s = tremor(camLenta(mundoSvg, lt, c.dur, { z0: 1.1, z1: 1.2, cy: 1300 }), lt, tc, 14);
    s += relogio('18:00', lt);
    s += carimbo(lt, tc, { x: 540, y: 600, texto: 'QUEBROU', rot: -7, tam: 120 });
    return s;
  },
});

// ---------- 9 — 06:00 volta ao normal ----------
E.push({
  fala: 'Às 6 da manhã, a força vai embora. Você faria o quê com ela? *Comenta aí*.',
  desenhar(lt, c) {
    const X = 540, Y = 1850;
    const m = 1 - suave((lt - 0.3) / 1.0);
    const ES = mix(0.95, 0.8, m);
    const pose = m > 0.01 ? poseBase(m) : animar([[1.3, poseBase(0)], [1.9, { maoD: [70, -660] }]], lt, poseBase(0));
    let mundoSvg = quarto(lt) + porta(860, 1520, 80) + corpo({ x: X, y: Y, esc: ES, musculo: m, energia: m * 0.6, expr: m > 0.5 ? 'cansado' : 'confiante', t: lt, pose, olhar: [0, -1] });
    let s = camLenta(mundoSvg, lt, c.dur, { z0: 1.1, z1: 1.18, cy: 1400 });
    s += flash(lt, 0.8, 0.3);
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
  const X = 540, Y = 1900, ES = 0.86;
  let s = ceu('#F2B36B', '#FBE1B8', 'ceuForca') + casario(-20, 1100, 1500, { semente: 91, alt: [300, 800] }) + `<rect y="1500" width="1080" height="420" fill="#3A3A42"/>`;
  const [hx, hy] = mundo(0, -1010, X, Y, ES);
  s += carro(hx + 10, hy + 18, 1.0, -2);
  s += corpo({ x: X, y: Y, esc: ES, musculo: 1, energia: 1, expr: 'grito', t: 0.5, pose: { maoD: [120, -1010], maoE: [-120, -1010], cotD: 'baixo', cotE: 'baixo', agach: 10 } });
  s += `<rect width="1080" height="760" fill="#000" opacity="0.2"/>`;
  s += txt('SUPER', 540, 270, { tam: 170, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 22 });
  s += txt('FORÇA', 540, 460, { tam: 210, cor: LARANJA, fonte: F_TIT, peso: 400, contorno: '#111', cw: 24 });
  s += `<g transform="translate(540 600) rotate(-4)">` + pilula('POR 24 HORAS', 0, 0, { tam: 56, fundo: LARANJA }) + `</g>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+15%' });
