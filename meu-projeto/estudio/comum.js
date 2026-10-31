// Funções compartilhadas por todos os vídeos: texto, animação, cabeçalho, legenda
// e o "motor" que transforma uma lista de cenas em quadros.

const W = 1080; // vertical (Shorts)
const H = 1920;
const FPS = 30;

const lim = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => 1 - Math.pow(1 - lim(x), 3);
function salto(x) {
  x = lim(x);
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// Gerador pseudoaleatório com semente (o mesmo resultado em todo quadro).
function aleatorio(semente) {
  let s = semente >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const numero = (v, dec) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: dec });

function formatarAltura(m) {
  if (m < 1000) return numero(m, m < 10 ? 2 : m < 100 ? 1 : 0) + ' m';
  const km = m / 1000;
  return numero(km, km < 100 ? 1 : 0) + ' km';
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// "*palavra*" vira destaque colorido.
function linhaDestacada(linha, cor) {
  return linha
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((p) => (p.startsWith('*') ? `<tspan fill="${cor}">${esc(p.slice(1, -1))}</tspan>` : esc(p)))
    .join('');
}

function texto(linhas, { x = 540, y, tamanho = 80, cor = '#FFFFFF', destaque = '#FFD21F', contorno = '#111111', entrelinha = 1.12 } = {}) {
  return linhas
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * tamanho * entrelinha}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="${tamanho}" fill="${cor}" stroke="${contorno}" stroke-width="${tamanho * 0.18}" stroke-linejoin="round" paint-order="stroke">${linhaDestacada(l, destaque)}</text>`
    )
    .join('');
}

// Entrada com "pulo" (cresce e passa um pouco do tamanho).
function aparecer(conteudo, lt, cx, cy, atraso = 0) {
  const k = Math.max(0.01, salto((lt - atraso) / 0.35));
  const op = lim((lt - atraso) / 0.12);
  return `<g opacity="${op}" transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${conteudo}</g>`;
}

function cabecalho(dia, valorTxt, lt) {
  return (
    aparecer(texto([`DIA ${dia}`], { y: 200, tamanho: 110 }), lt, 540, 165) +
    aparecer(texto([`*${valorTxt}*`], { y: 335, tamanho: 120 }), lt, 540, 300, 0.08)
  );
}

function legenda(linhas, lt, { y = 1690, tamanho = 74 } = {}) {
  return aparecer(texto(linhas, { y, tamanho }), lt, 540, y, 0.2);
}

/**
 * Recebe a lista de cenas e define as globais usadas pelo render.js:
 *   DURACAO, INICIOS, FPS, renderizar(t) -> conteúdo SVG do quadro.
 *
 * Cada cena: { dur, dia?, valor?, cabecalho?(lt), legenda: [...], estiloLegenda?, desenhar(lt, p) }
 */
function criarVideo(cenas) {
  let acc = 0;
  for (const c of cenas) {
    c.inicio = acc;
    acc += c.dur;
  }
  window.DURACAO = acc;
  window.INICIOS = cenas.map((c) => c.inicio);
  window.FPS = FPS;

  window.renderizar = function (t) {
    let i = cenas.findIndex((c) => t >= c.inicio && t < c.inicio + c.dur);
    if (i < 0) i = cenas.length - 1;
    const c = cenas[i];
    const lt = t - c.inicio;
    const p = lt / c.dur;

    // O número sobe de forma exponencial do valor da cena anterior até o atual.
    let valor = c.valor;
    const anterior = cenas.slice(0, i).reverse().find((x) => x.valor != null);
    if (valor != null && anterior) {
      valor = anterior.valor * Math.pow(c.valor / anterior.valor, suave(lt / 0.8));
    }

    // Câmera: entra com zoom e vai aproximando devagar.
    const zoom = (1 + 0.08 * (1 - suave(lt / 0.4))) * (1 + 0.03 * p);
    let s = `<g transform="translate(540 960) scale(${zoom}) translate(-540 -960)">${c.desenhar(lt, p)}</g>`;
    s += c.cabecalho ? c.cabecalho(lt) : cabecalho(c.dia, formatarAltura(valor), lt);
    s += legenda(c.legenda, lt, c.estiloLegenda);
    if (i > 0) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${0.7 * (1 - lim(lt / 0.15))}"/>`;
    return s;
  };
}
