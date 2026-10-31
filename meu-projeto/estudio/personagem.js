// Personagem principal do canal.
// Jaqueta amarela (sem zíper), calça preta, tênis branco com sola vermelha,
// cabelo castanho-escuro curto, repartido de lado.
//
// Desenhado em "unidades": os pés ficam em (0, 0) e a altura total é 100.
// A função personagem() escala tudo para a altura pedida em pixels.
//
// Expressões: feliz, surpreso, preocupado, dor, confiante, tedio, lingua,
//             chocado, chorando, prendendo (prendendo o fôlego)
// Poses:      normal, cima, aponta, cabeca, maosRosto, aceno

(function () {
  const CORES = {
    pele: '#F2C9A0',
    roupa: '#FFC21A',
    roupaSombra: '#E2A300',
    calca: '#1C1C1F',
    cabelo: '#3A2416',
    cabeloBrilho: '#5E3D27',
    tenis: '#FFFFFF',
    sola: '#D93A3A',
    bochecha: '#F59A8A',
    lagrima: '#5EC8FF',
    contorno: '#1A1A1A',
  };
  const C = CORES.contorno;
  const TRACO = 1.3; // espessura do contorno, em unidades

  const estilo = (fill) => `fill="${fill}" stroke="${C}" stroke-width="${TRACO}" stroke-linejoin="round"`;
  const par = (f) => [-1, 1].map(f).join('');

  // Cotovelo e mão de cada braço (lado direito; o esquerdo é espelhado).
  const BAIXO = [[18, -40], [19, -29]];
  function pose(nome, t) {
    switch (nome) {
      case 'cima': return { dir: [[24, -62], [27, -84]], esq: [[24, -62], [27, -84]] };
      case 'aponta': return { dir: [[24, -54], [35, -60]], esq: BAIXO };
      case 'cabeca': return { dir: [[27, -68], [15, -93]], esq: BAIXO };
      case 'maosRosto': return { dir: [[23, -46], [18, -63]], esq: [[23, -46], [18, -63]], naFrente: true };
      case 'aceno': return { dir: [[26, -60], [29 + 4 * Math.sin(t * 12), -82]], esq: BAIXO };
      default: return { dir: BAIXO, esq: BAIXO };
    }
  }

  function braco(lado, cotovelo, mao) {
    const s = lado === 'dir' ? 1 : -1;
    const d = `M${s * 13.5},-50 Q${s * cotovelo[0]},${cotovelo[1]} ${s * mao[0]},${mao[1]}`;
    return (
      `<path d="${d}" fill="none" stroke="${C}" stroke-width="9.6" stroke-linecap="round"/>` +
      `<path d="${d}" fill="none" stroke="${CORES.roupa}" stroke-width="7" stroke-linecap="round"/>` +
      `<circle cx="${s * mao[0]}" cy="${mao[1]}" r="3.9" ${estilo(CORES.pele)}/>`
    );
  }

  function olhos(expr) {
    switch (expr) {
      case 'dor':
        return par((s) => {
          const x = s * 8.5;
          return `<path d="M${x - s * 3},-77 L${x + s * 2},-73.5 L${x - s * 3},-70" fill="none" stroke="${C}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        });
      case 'lingua': // olhos fechados de alegria  ^ ^
        return par((s) => {
          const x = s * 8.5;
          return `<path d="M${x - 3.6},-72 Q${x},-77.5 ${x + 3.6},-72" fill="none" stroke="${C}" stroke-width="1.8" stroke-linecap="round"/>`;
        });
      case 'chorando': // olhos fechados de choro
        return par((s) => {
          const x = s * 8.5;
          return `<path d="M${x - 3.6},-74.5 Q${x},-70.5 ${x + 3.6},-74.5" fill="none" stroke="${C}" stroke-width="1.8" stroke-linecap="round"/>`;
        });
      case 'chocado': // olhos enormes com pupila pequena
        return par((s) => {
          const x = s * 8.8;
          return `<circle cx="${x}" cy="-74" r="6.3" fill="#fff" stroke="${C}" stroke-width="1.2"/><circle cx="${x}" cy="-74" r="1.7" fill="${C}"/>`;
        });
      case 'tedio': // pálpebra caída
        return par((s) => {
          const x = s * 8.5;
          return (
            `<ellipse cx="${x}" cy="-73" rx="2.9" ry="3.8" fill="${C}"/>` +
            `<rect x="${x - 4}" y="-78" width="8" height="4.3" fill="${CORES.pele}"/>` +
            `<line x1="${x - 3.8}" y1="-73.8" x2="${x + 3.8}" y2="-73.8" stroke="${C}" stroke-width="1.3" stroke-linecap="round"/>`
          );
        });
      default: {
        const ry = expr === 'surpreso' || expr === 'prendendo' ? 4.8 : 3.8;
        return par((s) => {
          const x = s * 8.5;
          return `<ellipse cx="${x}" cy="-73" rx="2.9" ry="${ry}" fill="${C}"/><circle cx="${x + 0.9}" cy="-74.6" r="1.05" fill="#fff"/>`;
        });
      }
    }
  }

  function sobrancelhas(expr) {
    // [y interno, y externo]
    const formas = {
      feliz: [-81, -82], surpreso: [-85, -85.5], preocupado: [-83.5, -80], dor: [-80, -82.5],
      confiante: [-80.5, -82.5], tedio: [-80, -80], lingua: [-83, -83.5], chocado: [-88, -87],
      chorando: [-83.5, -80], prendendo: [-80, -83],
    };
    const [yi, ye] = formas[expr] || formas.feliz;
    return par((s) => {
      const extra = expr === 'confiante' && s < 0 ? -2 : 0; // uma sobrancelha levantada
      const dx = expr === 'chocado' ? 1 : 0;
      return `<path d="M${s * (5 + dx)},${yi + extra} L${s * (12 + dx)},${ye + extra}" stroke="${CORES.cabelo}" stroke-width="1.8" stroke-linecap="round"/>`;
    });
  }

  function boca(expr) {
    switch (expr) {
      case 'surpreso':
        return `<ellipse cx="0" cy="-62" rx="3.2" ry="4.2" fill="#6B1E1E" stroke="${C}" stroke-width="1"/>`;
      case 'dor':
        return `<path d="M-6,-62 L-3,-64 L0,-62 L3,-64 L6,-62" fill="none" stroke="${C}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>`;
      case 'preocupado':
        return `<path d="M-5,-60.5 Q0,-65 5,-60.5" fill="none" stroke="${C}" stroke-width="1.5" stroke-linecap="round"/>`;
      case 'confiante':
        return `<path d="M-5,-63 Q1,-59.5 6,-65" fill="none" stroke="${C}" stroke-width="1.5" stroke-linecap="round"/>`;
      case 'tedio':
        return `<path d="M-5,-61.5 L4,-62.5" fill="none" stroke="${C}" stroke-width="1.5" stroke-linecap="round"/>`;
      case 'lingua':
        return (
          `<path d="M-6.5,-64.5 Q0,-55 6.5,-64.5 Z" fill="#6B1E1E" stroke="${C}" stroke-width="1" stroke-linejoin="round"/>` +
          `<path d="M-1,-60.5 Q1,-51.5 6,-55.5 Q6.5,-59 4.5,-61.5 Z" fill="#FF7A8A" stroke="${C}" stroke-width="1" stroke-linejoin="round"/>`
        );
      case 'chocado':
        return `<ellipse cx="0" cy="-59" rx="4.6" ry="6.6" fill="#6B1E1E" stroke="${C}" stroke-width="1.1"/>`;
      case 'chorando':
        return (
          `<path d="M-7,-60 Q-3.5,-66 0,-63 Q3.5,-66 7,-60 Q0,-54 -7,-60 Z" fill="#6B1E1E" stroke="${C}" stroke-width="1" stroke-linejoin="round"/>` +
          par((s) => `<path d="M${s * 9},-70.5 Q${s * 12.5},-62 ${s * 10.5},-51" fill="none" stroke="${CORES.lagrima}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`)
        );
      case 'prendendo':
        return (
          `<circle cx="-15" cy="-65" r="6" fill="#FF8A7A" opacity="0.75"/><circle cx="15" cy="-65" r="6" fill="#FF8A7A" opacity="0.75"/>` +
          `<path d="M-2.5,-62 L2.5,-62" stroke="${C}" stroke-width="1.6" stroke-linecap="round"/>`
        );
      default: // feliz
        return `<path d="M-6.5,-64.5 Q0,-55 6.5,-64.5 Z" fill="#6B1E1E" stroke="${C}" stroke-width="1" stroke-linejoin="round"/>`;
    }
  }

  const OCULOS =
    `<g>` +
    par((s) => `<rect x="${s * 8.8 - 6.5}" y="-78" width="13" height="8.5" rx="3" fill="#111" stroke="${C}" stroke-width="1"/><path d="M${s * 8.8 - 4},-76 L${s * 8.8 - 1},-76" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`) +
    `<path d="M-2.3,-75 Q0,-77 2.3,-75" fill="none" stroke="#111" stroke-width="1.4"/>` +
    `<path d="M-15.3,-75 L-23,-77 M15.3,-75 L23,-77" stroke="#111" stroke-width="1.4"/>` +
    `</g>`;

  const SUOR = `<path d="M20,-92 Q23.5,-86 21.5,-83 Q19,-81 17.8,-84 Q17.5,-87 20,-92 Z" fill="${CORES.lagrima}" stroke="${C}" stroke-width="0.8"/>`;

  // Cabelo curto repartido de lado, com franja varrida e um topete.
  const CABELO =
    `<path d="M-25,-70 C-28,-100 -12,-107 2,-106 C18,-105 28,-96 25,-70 L23,-75 C18,-86 6,-88 -6,-84 C-12,-86 -18,-82 -22,-74 Z" ${estilo(CORES.cabelo)}/>` +
    `<path d="M0,-105 Q4,-113 10,-110 Q5,-108.5 6,-104.5 Z" ${estilo(CORES.cabelo)}/>` +
    `<path d="M-13,-98 Q-5,-102.5 4,-101.5" fill="none" stroke="${CORES.cabeloBrilho}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M14,-88 Q8,-92 1,-92" fill="none" stroke="${CORES.cabeloBrilho}" stroke-width="1.2" stroke-linecap="round"/>`;

  /**
   * Gera o SVG do personagem.
   * @param {object} o
   * @param {number} o.x, o.y   posição dos pés, em pixels
   * @param {number} o.h        altura total em pixels
   * @param {string} o.expr     expressão (ver lista no topo)
   * @param {string} o.pose     pose dos braços (ver lista no topo)
   * @param {number} o.t        tempo (s), usado para respiração/aceno
   * @param {boolean} o.espelhar vira para o outro lado
   * @param {number} o.tremer   tremedeira, em pixels
   * @param {boolean} o.rachado rachaduras nas pernas
   * @param {boolean} o.oculos  óculos escuros
   * @param {boolean} o.suor    gota de suor
   * @param {number} o.estica   >1 estica, <1 achata (pulos)
   * @param {number} o.giro     rotação em graus (gira em torno da barriga)
   */
  window.personagem = function ({
    x = 0, y = 0, h = 100, expr = 'feliz', pose: nomePose = 'normal', t = 0, espelhar = false,
    tremer = 0, rachado = false, oculos = false, suor = false, estica = 1, giro = 0,
  } = {}) {
    const s = h / 100;
    const respira = 1 + 0.012 * Math.sin(t * 4);
    const dx = tremer ? Math.sin(t * 70) * tremer : 0;
    const p = pose(nomePose, t);

    const pernas =
      `<path d="M-14,-24 L14,-24 L13,-5 L2,-5 L0,-15 L-2,-5 L-13,-5 Z" ${estilo(CORES.calca)}/>` +
      (rachado
        ? `<g fill="none" stroke="#fff" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"><path d="M-9,-21 L-6.5,-17 L-9.5,-13 L-6,-9"/><path d="M8,-20 L5.5,-16 L9,-12.5 L6.5,-8"/></g>`
        : '');

    const tenis = par((l) => {
      const x0 = l < 0 ? -16.5 : 1.5;
      return (
        `<rect x="${x0}" y="-7.5" width="15" height="7.5" rx="3" ${estilo(CORES.tenis)}/>` +
        `<rect x="${x0}" y="-2.3" width="15" height="2.3" rx="1" fill="${CORES.sola}" stroke="${C}" stroke-width="${TRACO}"/>`
      );
    });

    // Jaqueta lisa: gola e barra, sem zíper.
    const jaqueta =
      `<path d="M-14,-53 Q-16.5,-53 -16.8,-48 L-16,-25 Q-16,-22 -13,-22 L13,-22 Q16,-22 16,-25 L16.8,-48 Q16.5,-53 14,-53 Z" ${estilo(CORES.roupa)}/>` +
      `<rect x="-16" y="-26.5" width="32" height="4.5" rx="1.5" ${estilo(CORES.roupaSombra)}/>` +
      `<path d="M-8,-54 Q0,-47 8,-54 Q0,-50.5 -8,-54 Z" ${estilo(CORES.roupaSombra)}/>`;

    const vermelho = expr === 'prendendo' ? `<circle cx="0" cy="-74" r="24" fill="#FF5A4A" opacity="0.28"/>` : '';
    const cabeca =
      `<circle cx="-23.5" cy="-72" r="4.5" ${estilo(CORES.pele)}/>` +
      `<circle cx="23.5" cy="-72" r="4.5" ${estilo(CORES.pele)}/>` +
      `<circle cx="0" cy="-74" r="24" ${estilo(CORES.pele)}/>` +
      vermelho +
      (expr === 'prendendo' ? '' : `<ellipse cx="-14" cy="-66" rx="3.3" ry="2" fill="${CORES.bochecha}" opacity="0.6"/><ellipse cx="14" cy="-66" rx="3.3" ry="2" fill="${CORES.bochecha}" opacity="0.6"/>`) +
      olhos(expr) + boca(expr) + CABELO + sobrancelhas(expr) +
      (oculos ? OCULOS : '') + (suor ? SUOR : '');

    const bracos = braco('esq', ...p.esq) + braco('dir', ...p.dir);
    const corpo = tenis + pernas + jaqueta + (p.naFrente ? cabeca + bracos : bracos + cabeca);

    const sx = espelhar ? -s : s;
    const sy = s * respira * estica;
    const rot = giro ? ` rotate(${giro} 0 -50)` : '';
    return `<g transform="translate(${x + dx} ${y}) scale(${sx} ${sy})${rot}">${corpo}</g>`;
  };
})();
