// Personagem principal do canal.
// Jaqueta amarela com zíper, calça preta, tênis branco com sola vermelha,
// cabelo castanho-escuro curto.
//
// Desenhado em "unidades": os pés ficam em (0, 0) e a altura total é 100.
// A função personagem() escala tudo para a altura pedida em pixels.

(function () {
  const CORES = {
    pele: '#F2C9A0',
    roupa: '#FFC21A',
    roupaSombra: '#E2A300',
    calca: '#1C1C1F',
    cabelo: '#3A2416',
    tenis: '#FFFFFF',
    sola: '#D93A3A',
    bochecha: '#F59A8A',
    contorno: '#1A1A1A',
  };
  const TRACO = 1.3; // espessura do contorno, em unidades

  const estilo = (fill) =>
    `fill="${fill}" stroke="${CORES.contorno}" stroke-width="${TRACO}" stroke-linejoin="round"`;

  // Posição do cotovelo e da mão de cada braço, por pose (lado direito; o esquerdo é espelhado).
  const POSES = {
    normal: { dir: [[18, -40], [19, -29]], esq: [[18, -40], [19, -29]] },
    cima: { dir: [[24, -62], [27, -84]], esq: [[24, -62], [27, -84]] },
    aponta: { dir: [[24, -54], [35, -60]], esq: [[18, -40], [19, -29]] },
    cabeca: { dir: [[27, -68], [15, -93]], esq: [[18, -40], [19, -29]] },
  };

  function braco(lado, cotovelo, mao) {
    const s = lado === 'dir' ? 1 : -1;
    const o = `${s * 13.5},-50`;
    const c = `${s * cotovelo[0]},${cotovelo[1]}`;
    const m = `${s * mao[0]},${mao[1]}`;
    const d = `M${o} Q${c} ${m}`;
    return (
      `<path d="${d}" fill="none" stroke="${CORES.contorno}" stroke-width="9.6" stroke-linecap="round"/>` +
      `<path d="${d}" fill="none" stroke="${CORES.roupa}" stroke-width="7" stroke-linecap="round"/>` +
      `<circle cx="${s * mao[0]}" cy="${mao[1]}" r="3.9" ${estilo(CORES.pele)}/>`
    );
  }

  function olhos(expr) {
    if (expr === 'dor') {
      return [-1, 1]
        .map((s) => {
          const x = s * 8.5;
          return `<path d="M${x - s * 3},-77 L${x + s * 2},-73.5 L${x - s * 3},-70" fill="none" stroke="${CORES.contorno}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        })
        .join('');
    }
    const ry = expr === 'surpreso' ? 4.8 : 3.8;
    return [-1, 1]
      .map((s) => {
        const x = s * 8.5;
        return (
          `<ellipse cx="${x}" cy="-73" rx="2.9" ry="${ry}" fill="${CORES.contorno}"/>` +
          `<circle cx="${x + 0.9}" cy="-74.6" r="1.05" fill="#fff"/>`
        );
      })
      .join('');
  }

  function sobrancelhas(expr) {
    // [y interno, y externo] para cada lado
    const formas = {
      feliz: [-81, -82],
      surpreso: [-85, -85.5],
      preocupado: [-83.5, -80],
      dor: [-80, -82.5],
      confiante: [-80.5, -82.5],
    };
    const [yi, ye] = formas[expr] || formas.feliz;
    return [-1, 1]
      .map((s) => {
        // No "confiante", a sobrancelha esquerda sobe um pouco
        const extra = expr === 'confiante' && s < 0 ? -2 : 0;
        return `<path d="M${s * 5},${yi + extra} L${s * 12},${ye + extra}" stroke="${CORES.cabelo}" stroke-width="1.8" stroke-linecap="round"/>`;
      })
      .join('');
  }

  function boca(expr) {
    const c = CORES.contorno;
    switch (expr) {
      case 'surpreso':
        return `<ellipse cx="0" cy="-62" rx="3.2" ry="4.2" fill="#6B1E1E" stroke="${c}" stroke-width="1"/>`;
      case 'dor':
        return `<path d="M-6,-62 L-3,-64 L0,-62 L3,-64 L6,-62" fill="none" stroke="${c}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>`;
      case 'preocupado':
        return `<path d="M-5,-60.5 Q0,-65 5,-60.5" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
      case 'confiante':
        return `<path d="M-5,-63 Q1,-59.5 6,-65" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
      default: // feliz
        return `<path d="M-6.5,-64.5 Q0,-55 6.5,-64.5 Z" fill="#6B1E1E" stroke="${c}" stroke-width="1" stroke-linejoin="round"/>`;
    }
  }

  function rachaduras() {
    return (
      `<g fill="none" stroke="#fff" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round">` +
      `<path d="M-9,-21 L-6.5,-17 L-9.5,-13 L-6,-9"/>` +
      `<path d="M8,-20 L5.5,-16 L9,-12.5 L6.5,-8"/>` +
      `</g>`
    );
  }

  /**
   * Gera o SVG do personagem.
   * @param {object} o
   * @param {number} o.x, o.y  posição dos pés, em pixels
   * @param {number} o.h       altura total em pixels
   * @param {string} o.expr    feliz | surpreso | preocupado | dor | confiante
   * @param {string} o.pose    normal | cima | aponta | cabeca
   * @param {number} o.t       tempo (s), usado para a "respiração"
   * @param {boolean} o.espelhar  vira o personagem para o outro lado
   * @param {number} o.tremer  intensidade de tremedeira em pixels
   * @param {boolean} o.rachado   mostra rachaduras nas pernas
   */
  window.personagem = function ({
    x = 0, y = 0, h = 100, expr = 'feliz', pose = 'normal', t = 0,
    espelhar = false, tremer = 0, rachado = false,
  } = {}) {
    const s = h / 100;
    const respira = 1 + 0.012 * Math.sin(t * 4);
    const dx = tremer ? Math.sin(t * 70) * tremer : 0;
    const p = POSES[pose] || POSES.normal;

    const pernas =
      `<path d="M-14,-24 L14,-24 L13,-5 L2,-5 L0,-15 L-2,-5 L-13,-5 Z" ${estilo(CORES.calca)}/>` +
      (rachado ? rachaduras() : '');

    const tenis = [-1, 1]
      .map((l) => {
        const x0 = l < 0 ? -16.5 : 1.5;
        return (
          `<rect x="${x0}" y="-7.5" width="15" height="7.5" rx="3" ${estilo(CORES.tenis)}/>` +
          `<rect x="${x0}" y="-2.3" width="15" height="2.3" rx="1" fill="${CORES.sola}" stroke="${CORES.contorno}" stroke-width="${TRACO}"/>`
        );
      })
      .join('');

    const jaqueta =
      `<path d="M-14,-53 Q-16.5,-53 -16.8,-48 L-16,-25 Q-16,-22 -13,-22 L13,-22 Q16,-22 16,-25 L16.8,-48 Q16.5,-53 14,-53 Z" ${estilo(CORES.roupa)}/>` +
      `<rect x="-16" y="-26.5" width="32" height="4.5" rx="1.5" ${estilo(CORES.roupaSombra)}/>` +
      `<line x1="0" y1="-49" x2="0" y2="-26.5" stroke="${CORES.contorno}" stroke-width="0.9"/>` +
      `<path d="M-8,-54 L0,-46 L8,-54 L4,-54 L0,-50 L-4,-54 Z" ${estilo(CORES.roupaSombra)}/>`;

    const cabelo =
      `<path d="M-25,-72 C-27,-112 27,-112 25,-72 L23,-76 Q19,-84 12,-85 Q9,-89 4,-85 Q0,-90 -4,-85 Q-9,-89 -13,-85 Q-19,-84 -23,-76 Z" ${estilo(CORES.cabelo)}/>`;

    const cabeca =
      `<circle cx="-23.5" cy="-72" r="4.5" ${estilo(CORES.pele)}/>` +
      `<circle cx="23.5" cy="-72" r="4.5" ${estilo(CORES.pele)}/>` +
      `<circle cx="0" cy="-74" r="24" ${estilo(CORES.pele)}/>` +
      `<ellipse cx="-14" cy="-66" rx="3.3" ry="2" fill="${CORES.bochecha}" opacity="0.6"/>` +
      `<ellipse cx="14" cy="-66" rx="3.3" ry="2" fill="${CORES.bochecha}" opacity="0.6"/>` +
      olhos(expr) + sobrancelhas(expr) + boca(expr) + cabelo;

    const corpo =
      tenis + pernas + jaqueta + braco('esq', ...p.esq) + braco('dir', ...p.dir) + cabeca;

    const sx = espelhar ? -s : s;
    return `<g transform="translate(${x + dx} ${y}) scale(${sx} ${s * respira})">${corpo}</g>`;
  };
})();
