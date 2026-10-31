// SHORT: "E se o seu PULO dobrasse todo dia?"
// Pulo inicial: 50 cm. Dia N = 0,5 m × 2^N.
//   Dia 3  = 4 m       (aro de basquete: 3,05 m)
//   Dia 6  = 32 m      (prédio de 10 andares: ~30 m)
//   Dia 10 = 512 m     (Torre Eiffel: 330 m)
//   Dia 15 = 16,4 km   (aviões voam a ~10 km)
//   Dia 18 = 131 km    (o espaço começa em 100 km — linha de Kármán)
//   Dia 20 = 524 km    (Estação Espacial: ~408 km)
// Virada: cair de 16 m (dia 5) = chegar ao chão a ~64 km/h  (v = √(2·g·h)).

const PULO_INICIAL = 0.5;
const puloNoDia = (d) => PULO_INICIAL * 2 ** d;

// Personagem entra de baixo, esticado, e "flutua" no ponto mais alto.
function noAr(lt, yTopo, de = 750) {
  const k = suave(lt / 0.55);
  return { y: yTopo + (1 - k) * de + Math.sin(lt * 3) * 8, estica: 1 + 0.2 * (1 - k) };
}

function linhasVelocidade(lt, x, y, larg, alt, sobe = true, cor = '#fff') {
  const r = aleatorio(21);
  let s = '';
  for (let i = 0; i < 14; i++) {
    const lx = x + r() * larg;
    const comp = 80 + r() * 160;
    let ly = y + ((r() * alt + lt * 1400 * (sobe ? -1 : 1)) % alt + alt) % alt;
    s += `<line x1="${lx}" y1="${ly}" x2="${lx}" y2="${ly + comp}" stroke="${cor}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>`;
  }
  return s;
}

function bola(cx, cy, r, giro = 0) {
  return (
    `<g transform="rotate(${giro} ${cx} ${cy})">` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F28C28" stroke="#1A1A1A" stroke-width="6"/>` +
    `<path d="M${cx - r},${cy} L${cx + r},${cy} M${cx},${cy - r} L${cx},${cy + r} M${cx - r * 0.7},${cy - r * 0.7} Q${cx - r * 0.2},${cy} ${cx - r * 0.7},${cy + r * 0.7} M${cx + r * 0.7},${cy - r * 0.7} Q${cx + r * 0.2},${cy} ${cx + r * 0.7},${cy + r * 0.7}" fill="none" stroke="#1A1A1A" stroke-width="4"/>` +
    `</g>`
  );
}

function cesta(xAro, yAro) {
  return (
    `<rect x="${xAro + 150}" y="${yAro - 240}" width="28" height="1200" fill="#7A7F8C" stroke="#1A1A1A" stroke-width="6"/>` +
    `<rect x="${xAro + 70}" y="${yAro - 200}" width="95" height="22" fill="#7A7F8C" stroke="#1A1A1A" stroke-width="6"/>` +
    `<rect x="${xAro + 56}" y="${yAro - 230}" width="22" height="250" fill="#F4F7FB" stroke="#1A1A1A" stroke-width="6"/>` +
    `<path d="M${xAro - 48},${yAro} L${xAro - 34},${yAro + 90} L${xAro + 34},${yAro + 90} L${xAro + 48},${yAro}" fill="none" stroke="#fff" stroke-width="5"/>` +
    `<path d="M${xAro - 40},${yAro + 30} L${xAro + 40},${yAro + 30} M${xAro - 36},${yAro + 60} L${xAro + 36},${yAro + 60} M${xAro - 20},${yAro} L${xAro - 15},${yAro + 90} M${xAro + 20},${yAro} L${xAro + 15},${yAro + 90}" stroke="#fff" stroke-width="4"/>` +
    `<ellipse cx="${xAro}" cy="${yAro}" rx="52" ry="12" fill="none" stroke="#E2401F" stroke-width="9"/>` +
    `<rect x="${xAro + 48}" y="${yAro - 5}" width="12" height="10" fill="#E2401F"/>`
  );
}

function predioAlto(x, w, topo) {
  let s = `<rect x="${x}" y="${topo}" width="${w}" height="${H - topo + 50}" fill="#5B6C8F" stroke="#1A1A1A" stroke-width="6"/>`;
  s += `<rect x="${x - 15}" y="${topo - 25}" width="${w + 30}" height="30" fill="#45536F" stroke="#1A1A1A" stroke-width="6"/>`;
  for (let y = topo + 50; y < H; y += 140) {
    for (let jx = x + 40; jx < x + w - 60; jx += 120) {
      s += `<rect x="${jx}" y="${y}" width="70" height="85" fill="#BFE6FF" stroke="#1A1A1A" stroke-width="5"/>`;
    }
  }
  // caixa-d'água no telhado
  s += `<rect x="${x + w - 210}" y="${topo - 135}" width="120" height="110" fill="#8C6B4F" stroke="#1A1A1A" stroke-width="6"/>`;
  return s;
}

function pombo(x, y, asa) {
  return (
    `<g transform="translate(${x} ${y})" stroke="#1A1A1A" stroke-width="4" stroke-linejoin="round">` +
    `<ellipse cx="0" cy="0" rx="42" ry="24" fill="#9AA3B5"/>` +
    `<circle cx="-38" cy="-18" r="17" fill="#9AA3B5"/>` +
    `<circle cx="-42" cy="-22" r="5" fill="#fff"/><circle cx="-43" cy="-22" r="2.5" fill="#1A1A1A" stroke="none"/>` +
    `<path d="M-54,-16 L-66,-12 L-54,-9 Z" fill="#F2C14E"/>` +
    `<path d="M0,-5 L${30},${-50 * asa} L35,-5 Z" fill="#7D879B"/>` +
    `<path d="M38,-4 L62,-14 L60,8 Z" fill="#7D879B"/>` +
    `</g>` +
    texto(['?!'], { x: x - 30, y: y - 55, tamanho: 54 })
  );
}

function torreEiffel(chao) {
  // altura desenhada: 495 px (330 m a 1,5 px/m)
  const t = chao - 495;
  const d =
    `M340,${chao} L420,${chao - 180} L455,${chao - 180} L500,${chao - 350} L510,${chao - 350} L535,${t} L545,${t} ` +
    `L570,${chao - 350} L580,${chao - 350} L625,${chao - 180} L660,${chao - 180} L740,${chao} L650,${chao} Q540,${chao - 140} 430,${chao} Z`;
  let treliça = '';
  for (let i = 0; i < 6; i++) {
    const y = chao - 30 - i * 25;
    treliça += `<line x1="${360 + i * 12}" y1="${y}" x2="${720 - i * 12}" y2="${y - 20}" stroke="#4A3528" stroke-width="3" opacity="0.6"/>`;
  }
  return (
    `<path d="${d}" fill="#7A5A44" stroke="#1A1A1A" stroke-width="6" stroke-linejoin="round"/>` +
    treliça +
    `<rect x="395" y="${chao - 190}" width="290" height="20" fill="#5E4434" stroke="#1A1A1A" stroke-width="5"/>` +
    `<rect x="482" y="${chao - 360}" width="116" height="16" fill="#5E4434" stroke="#1A1A1A" stroke-width="5"/>`
  );
}

function horizonteTerra(topo) {
  const r = 3200;
  return (
    `<defs><radialGradient id="brilhoTerra" cx="0.5" cy="0.5" r="0.5"><stop offset="0.96" stop-color="#7CC8FF" stop-opacity="0.7"/><stop offset="1" stop-color="#7CC8FF" stop-opacity="0"/></radialGradient></defs>` +
    `<circle cx="540" cy="${topo + r}" r="${r * 1.03}" fill="url(#brilhoTerra)"/>` +
    `<circle cx="540" cy="${topo + r}" r="${r}" fill="#2D78D2" stroke="#1A1A1A" stroke-width="6"/>` +
    `<path d="M-50,${topo + 120} Q200,${topo + 30} 420,${topo + 90} Q620,${topo + 150} 760,${topo + 60} Q900,${topo + 20} 1130,${topo + 110} L1130,${H} L-50,${H} Z" fill="#4CAF50" opacity="0.85"/>` +
    `<path d="M-50,${topo + 70} Q300,${topo - 5} 700,${topo + 40} T1130,${topo + 50}" fill="none" stroke="#fff" stroke-width="18" opacity="0.5"/>`
  );
}

function estacaoEspacial(cx, cy) {
  const painel = (x, y) =>
    `<rect x="${x}" y="${y}" width="130" height="58" fill="#2A4D9B" stroke="#1A1A1A" stroke-width="4"/>` +
    `<path d="M${x + 32},${y} V${y + 58} M${x + 65},${y} V${y + 58} M${x + 98},${y} V${y + 58} M${x},${y + 29} H${x + 130}" stroke="#7FA6F0" stroke-width="2"/>`;
  return (
    `<g>` +
    `<rect x="${cx - 260}" y="${cy - 7}" width="520" height="14" fill="#BFC6D1" stroke="#1A1A1A" stroke-width="4"/>` +
    painel(cx - 260, cy - 75) + painel(cx - 260, cy + 17) + painel(cx + 130, cy - 75) + painel(cx + 130, cy + 17) +
    `<rect x="${cx - 75}" y="${cy - 30}" width="150" height="60" rx="22" fill="#E8ECF2" stroke="#1A1A1A" stroke-width="5"/>` +
    `<circle cx="${cx - 25}" cy="${cy}" r="10" fill="#5AA9E6" stroke="#1A1A1A" stroke-width="3"/>` +
    `<circle cx="${cx + 25}" cy="${cy}" r="10" fill="#5AA9E6" stroke="#1A1A1A" stroke-width="3"/>` +
    `</g>`
  );
}

// ---------- cenas ----------

criarVideo(
  [
    cenaAbertura({
      pergunta: ['E SE O SEU *PULO*', '*DOBRASSE* TODO DIA?'],
      tamanho: 84,
      legenda: ['Até onde você *chegaria*?'],
      fala: 'E se o seu pulo dobrasse todo dia? Até onde você chegaria?',
      desenhar: (lt) =>
        gradiente('aberturaPulo', [[0, '#3A86FF'], [0.6, '#8EC5FF'], [1, '#FFE29A']]) +
        nuvem(60, 700, 1.3, 0.9) +
        nuvem(820, 860, 1.1, 0.9) +
        skyline(14, '#5A6F9E', 100, 300, true) +
        `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#2F3A55"/>` +
        linhasVelocidade(lt, 330, 1250, 420, 400, false) +
        personagem({ x: 540, y: 1420 + Math.sin(lt * 3) * 10, h: 800, expr: 'chocado', pose: 'maosRosto', t: lt, estica: 1.04 }),
    }),
    {
      // Dia 0 — pulinho normal e cara de tédio
      fala: 'Hoje, você pula cinquenta centímetros. Bem... normal.',
      dur: 3.5,
      dia: 0,
      valor: puloNoDia(0),
      legenda: ['Um pulo bem...', '*normal*.'],
      desenhar: (lt) => {
        const arco = lt < 0.9 ? Math.sin((Math.PI * lt) / 0.9) : 0;
        const achata = lt > 0.9 && lt < 1.1 ? 0.9 : 1;
        let cerca = '';
        for (let x = 0; x < W; x += 90) cerca += `<rect x="${x + 10}" y="1220" width="60" height="280" rx="8" fill="#F4F1E8" stroke="#1A1A1A" stroke-width="5"/>`;
        return (
          gradiente('ceu0', [[0, '#69B9F2'], [1, '#D5F0FF']]) +
          nuvem(120, 520, 1.1) + nuvem(760, 640, 0.9) +
          cerca +
          `<rect x="0" y="1300" width="${W}" height="22" fill="#F4F1E8" stroke="#1A1A1A" stroke-width="5"/>` +
          `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#5DBB63"/>` +
          `<ellipse cx="540" cy="${CHAO + 6}" rx="${150 - arco * 40}" ry="18" fill="#000" opacity="0.18"/>` +
          personagem({ x: 540, y: CHAO - arco * 183, h: 640, expr: lt < 1.1 ? 'feliz' : 'tedio', t: lt, estica: achata })
        );
      },
    },
    {
      // Dia 3 — 4 m: enterrada
      fala: 'Dia três: quatro metros. Você enterra sem nem tentar.',
      dur: 3.5,
      dia: 3,
      valor: puloNoDia(3),
      legenda: ['Você *enterra*', 'sem nem tentar.'],
      desenhar: (lt) => {
        const { y, estica } = noAr(lt, 1150);
        const aroX = 790, aroY = 1340;
        const k = suave((lt - 1.4) / 0.6); // a bola vai para a cesta
        const bx = 610 + (aroX - 610) * k;
        const by = lt < 1.4 ? y - 330 : 820 + (aroY - 820) * k - Math.sin(Math.PI * k) * 120;
        let spots = '';
        for (let i = 0; i < 4; i++) spots += `<path d="M${140 + i * 270},0 L${60 + i * 270},1300 L${260 + i * 270},1300 Z" fill="#fff" opacity="0.06"/>`;
        return (
          gradiente('ginasio', [[0, '#1B2550'], [1, '#41569A']]) +
          spots +
          cesta(aroX, aroY) +
          personagem({ x: 590, y, h: 350, expr: 'confiante', oculos: true, pose: lt < 1.4 ? 'cima' : 'aponta', t: lt, estica }) +
          bola(bx, by, 42, lt * 300) +
          (lt > 2.0 ? aparecer(`<g transform="rotate(-8 300 1250)">${texto(['SWISH!'], { x: 300, y: 1250, tamanho: 84 })}</g>`, lt, 300, 1230, 2.0) : '')
        );
      },
    },
    {
      // Dia 6 — 32 m: por cima de um prédio
      fala: 'Dia seis: trinta e dois metros. Você pula um prédio. E os pombos não entendem nada.',
      dur: 3.5,
      dia: 6,
      valor: puloNoDia(6),
      legenda: ['Você pula um', '*prédio de 10 andares*.'],
      desenhar: (lt) => {
        const { y, estica } = noAr(lt, 1100);
        return (
          gradiente('ceu6', [[0, '#4FA8F0'], [1, '#CDEBFF']]) +
          nuvem(60 + lt * 12, 560, 1.2) + nuvem(800 - lt * 10, 760, 1) +
          predioAlto(150, 780, 1360) +
          personagem({ x: 540, y, h: 420, expr: 'lingua', pose: 'aceno', t: lt, estica }) +
          pombo(1150 - lt * 230, 860, Math.sin(lt * 18) > 0 ? 1 : -0.2)
        );
      },
    },
    {
      // Dia 10 — 512 m: Torre Eiffel lá embaixo
      fala: 'Dia dez: mais de quinhentos metros. A Torre Eiffel fica lá embaixo.',
      dur: 3.5,
      dia: 10,
      valor: puloNoDia(10),
      legenda: ['Você passa por cima', 'da *Torre Eiffel*.'],
      desenhar: (lt) => {
        const chao = 1600;
        const { y, estica } = noAr(lt, chao - 768);
        return (
          gradiente('ceu10', [[0, '#3D3B8E'], [0.6, '#E07A9B'], [1, '#FFC48C']]) +
          skyline(31, '#4B3F72', 20, 90, true, chao) +
          `<rect y="${chao}" width="${W}" height="${H - chao}" fill="#2E2747"/>` +
          torreEiffel(chao) +
          texto(['330 m'], { x: 830, y: chao - 470, tamanho: 46 }) +
          personagem({ x: 540, y, h: 420, expr: 'chocado', pose: 'maosRosto', t: lt, estica })
        );
      },
    },
    {
      // Dia 15 — 16,4 km: acima dos aviões
      fala: 'Dia quinze: dezesseis quilômetros. Você dá tchau pros aviões.',
      dur: 3.5,
      dia: 15,
      valor: puloNoDia(15),
      legenda: ['Você *dá tchau*', 'pros aviões.'],
      desenhar: (lt) => {
        const { y, estica } = noAr(lt, 1050);
        const ax = -200 + (lt / 3.5) * 1500;
        return (
          gradiente('ceu15', [[0, '#071433'], [0.5, '#1F4E9A'], [1, '#8CCBF5']]) +
          personagem({ x: 560, y, h: 450, expr: 'feliz', pose: 'aceno', t: lt, estica }) +
          aviao(ax, 1250, 1.6) +
          texto(['?!'], { x: ax + 60, y: 1180, tamanho: 50 }) +
          nuvem(-60, 1500, 2.2) + nuvem(420, 1530, 2) + nuvem(850, 1490, 2.1) +
          `<rect y="1560" width="${W}" height="${H - 1560}" fill="#fff"/>`
        );
      },
    },
    {
      // Dia 18 — 131 km: o espaço
      fala: 'Dia dezoito: você chega ao espaço. Sem roupa espacial. Prende a respiração!',
      dur: 3.5,
      dia: 18,
      valor: puloNoDia(18),
      legenda: ['Você chega ao *espaço*.', 'Sem roupa espacial.'],
      desenhar: (lt) => {
        const { y, estica } = noAr(lt, 1060);
        return (
          espaco(18) +
          horizonteTerra(1380) +
          `<line x1="0" y1="1250" x2="${W}" y2="1250" stroke="#fff" stroke-width="3" stroke-dasharray="14 14" opacity="0.6"/>` +
          texto(['100 km: começa o espaço'], { x: 540, y: 1300, tamanho: 36 }) +
          personagem({ x: 540, y, h: 520, expr: 'prendendo', suor: true, t: lt, estica, giro: Math.sin(lt * 2) * 6, tremer: lt > 1.5 ? 2 : 0 })
        );
      },
    },
    {
      // Dia 20 — 524 km: passa da Estação Espacial
      fala: 'Dia vinte: você passa da Estação Espacial. Tchau, astronautas!',
      dur: 3.5,
      dia: 20,
      valor: puloNoDia(20),
      legenda: ['Você passa da', '*Estação Espacial*.'],
      desenhar: (lt) => {
        const { y, estica } = noAr(lt, 1000);
        return (
          espaco(20) +
          horizonteTerra(1640) +
          estacaoEspacial(700 - lt * 40, 1280) +
          texto(['408 km'], { x: 700 - lt * 40, y: 1400, tamanho: 40 }) +
          personagem({ x: 420, y, h: 520, expr: 'lingua', t: lt, estica, giro: lt * 25 })
        );
      },
    },
    {
      // Virada: o problema é a volta
      fala: 'Mas tem um problema: a volta. No dia cinco, você já cairia a sessenta e quatro por hora. Tchau, pernas.',
      dur: 5.5,
      cabecalho: (lt) =>
        aparecer(texto(['MAS TEM UM', '*PROBLEMA...*'], { y: 190, tamanho: 110 }), lt, 540, 200) +
        aparecer(texto(['*A VOLTA!*'], { y: 480, tamanho: 100, destaque: '#FF5A5A' }), lt, 540, 450, 0.8),
      legenda: ['Já no *dia 5*, a queda', 'seria a *64 km/h*.', '*Tchau, pernas.*'],
      estiloLegenda: { y: 1640, tamanho: 64 },
      desenhar: (lt) =>
        gradiente('queda', [[0, '#7EC8F0'], [1, '#FF9A7A']]) +
        linhasVelocidade(lt, 60, 0, 960, 1920, true) +
        personagem({ x: 540 + Math.sin(lt * 6) * 25, y: 1390, h: 640, expr: 'chorando', pose: 'cima', t: lt, giro: 180 + Math.sin(lt * 4) * 10 }),
    },
    cenaFinalIA(),
  ],
  { formatar: formatarDistancia, velocidade: '+15%' }
);
