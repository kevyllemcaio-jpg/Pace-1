// Motor da série "Kevylem Vai Ficar Rico!": animação, textos, HUD, cards, legendas
// palavra por palavra e a lista de cenas que vira quadros.
// Roda dentro do navegador (Playwright) — render.js injeta este arquivo.

const W = 1080; // vertical 9:16
const H = 1920;
const FPS = 30;
const ATRASO_FALA = 0.2; // a fala começa um pouco depois do corte
const PAUSA_FALA = 0.25; // respiro depois da fala

const F_TIT = "Anton, Oswald, Impact, sans-serif"; // legendas e números grandes
const F_TXT = "Oswald, 'Arial Narrow', sans-serif"; // placas, cards, HUD

// ---------- matemática de animação ----------
const lim = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => 1 - Math.pow(1 - lim(x), 3);
const vaivem = (x) => { x = lim(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
function salto(x) {
  x = lim(x);
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
const mix = (a, b, k) => a + (b - a) * k;
function aleatorio(semente) {
  let s = semente >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const reais = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------- efeitos sonoros (registrados uma vez por cena, ver definirTempos) ----------
let REG = null;
function som(nome, t, vol = 1) {
  if (REG && t >= 0 && t < REG.dur) REG.lista.push({ s: nome, t: REG.base + t, vol });
}

// ---------- texto ----------
function txt(s, x, y, { tam = 60, cor = '#222', fonte = F_TXT, anc = 'middle', contorno = null, cw = 0, ls = 0, peso = 700, op = 1 } = {}) {
  const st = contorno ? ` stroke="${contorno}" stroke-width="${cw || tam * 0.16}" stroke-linejoin="round" paint-order="stroke"` : '';
  return `<text x="${x}" y="${y}" text-anchor="${anc}" font-family="${fonte}" font-weight="${peso}" font-size="${tam}" letter-spacing="${ls}" fill="${cor}" opacity="${op}"${st}>${esc(s)}</text>`;
}

// Escala em torno de um ponto (pulo de entrada).
function pulo(conteudo, lt, cx, cy, t0 = 0, dur = 0.35) {
  if (lt < t0) return '';
  const k = Math.max(0.01, salto((lt - t0) / dur));
  const op = lim((lt - t0) / 0.1);
  return `<g opacity="${op}" transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${conteudo}</g>`;
}

// Câmera: zoom em torno de (cx, cy), opcionalmente animando de um enquadramento a outro.
function camera(conteudo, z = 1, cx = 540, cy = 960) {
  if (z === 1) return conteudo;
  // nunca mostra fora do cenário (sem bordas pretas)
  const tx = Math.min(0, Math.max(W - W * z, 540 - cx * z));
  const ty = Math.min(0, Math.max(H - H * z, 960 - cy * z));
  return `<g transform="translate(${tx} ${ty}) scale(${z})">${conteudo}</g>`;
}
// Zoom lento contínuo (Ken Burns) + "soco" de zoom no corte.
function camLenta(conteudo, lt, dur, { z0 = 1, z1 = 1.06, cx = 540, cy = 1100, soco = true } = {}) {
  const k = vaivem(lt / Math.max(dur, 0.1));
  let z = mix(z0, z1, k);
  if (soco) z *= 1 + 0.035 * (1 - suave(lt / 0.25));
  return camera(conteudo, z, cx, cy);
}

// ---------- elementos gráficos ----------
function sombra(x, y, w, h, r) {
  return `<rect x="${x + 7}" y="${y + 10}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity="0.28"/>`;
}

// Card branco inclinado que entra com pulo (e faz "pop").
function card(lt, t0, { x, y, w = 260, h = 230, rot = -4, conteudo = '', fundo = '#FBF8EF' }) {
  som('pop', t0, 0.8);
  if (lt < t0) return '';
  const g =
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    sombra(-w / 2, -h / 2, w, h, 22) +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22" fill="${fundo}" stroke="#2A2A2A" stroke-width="5"/>` +
    conteudo +
    `</g>`;
  return pulo(g, lt, x, y, t0);
}

// Carimbo vermelho (ex.: "VENCIDA") que bate na tela.
function carimbo(lt, t0, { x, y, texto, rot = -8, tam = 110, cor = '#D7262B' }) {
  som('carimbo', t0, 1);
  if (lt < t0) return '';
  const w = texto.length * tam * 0.52 + 70, h = tam * 1.35;
  const k = 1 + 1.6 * (1 - suave((lt - t0) / 0.18));
  const g =
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">` +
    `<rect x="${-w / 2 + 6}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="18" fill="#000" opacity="0.2"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="#FFF6F0" stroke="${cor}" stroke-width="14"/>` +
    `<rect x="${-w / 2 + 16}" y="${-h / 2 + 16}" width="${w - 32}" height="${h - 32}" rx="10" fill="none" stroke="${cor}" stroke-width="4"/>` +
    txt(texto, 0, tam * 0.36, { tam, cor, fonte: F_TIT, peso: 400 }) +
    `</g>`;
  return `<g opacity="${lim((lt - t0) / 0.06)}">${g}</g>`;
}

// Pílula amarela (EPISÓDIO 1, PASSO 1 · MERCADINHO...).
function pilula(texto, x, y, { tam = 40, fundo = '#FFC83A', cor = '#2B2100' } = {}) {
  const w = texto.length * tam * 0.5 + 64, h = tam * 1.6;
  return (
    `<rect x="${x - w / 2 + 3}" y="${y - h / 2 + 5}" width="${w}" height="${h}" rx="${h / 2}" fill="#000" opacity="0.25"/>` +
    `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fundo}" stroke="#2B2100" stroke-width="4"/>` +
    txt(texto, x, y + tam * 0.36, { tam, cor })
  );
}

// Balão de fala.
function balao(lt, t0, { x, y, texto, tam = 44, ponta = 'baixo' }) {
  som('bolha', t0, 0.6);
  if (lt < t0) return '';
  const w = texto.length * tam * 0.5 + 70, h = tam * 1.9;
  const px = ponta === 'esq' ? -w / 2 + 50 : ponta === 'dir' ? w / 2 - 50 : 0;
  const g =
    `<g transform="translate(${x} ${y})">` +
    `<path d="M ${px - 18} ${h / 2 - 4} L ${px} ${h / 2 + 30} L ${px + 18} ${h / 2 - 4} Z" fill="#fff" stroke="#2A2A2A" stroke-width="5" stroke-linejoin="round"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" stroke="#2A2A2A" stroke-width="5"/>` +
    `<rect x="${px - 16}" y="${h / 2 - 9}" width="32" height="8" fill="#fff"/>` +
    txt(texto, 0, tam * 0.36, { tam, cor: '#222' }) +
    `</g>`;
  return pulo(g, lt, x, y + h / 2, t0, 0.3);
}

// ---------- HUD: DIA / SALDO / FORMATURA ----------
function iconeCalendario(x, y) {
  return `<rect x="${x - 15}" y="${y - 14}" width="30" height="28" rx="5" fill="#fff"/><rect x="${x - 15}" y="${y - 14}" width="30" height="10" rx="4" fill="#E0393E"/>`;
}
function iconeDinheiro(x, y) {
  return `<rect x="${x - 19}" y="${y - 12}" width="38" height="24" rx="4" fill="#2FB45A"/><circle cx="${x}" cy="${y}" r="7" fill="#1B7A3A"/>`;
}
function iconeCapelo(x, y) {
  return `<path d="M ${x - 20} ${y - 4} L ${x} ${y - 13} L ${x + 20} ${y - 4} L ${x} ${y + 5} Z" fill="#14161C"/><rect x="${x - 10}" y="${y}" width="20" height="10" rx="3" fill="#14161C"/>`;
}
function caixaHud(x, w, conteudo) {
  const y = 112, h = 76;
  return (
    `<rect x="${x + 3}" y="${y + 5}" width="${w}" height="${h}" rx="16" fill="#000" opacity="0.3"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#252A35" stroke="#0E1015" stroke-width="4"/>` +
    conteudo
  );
}
function hud(c, lt) {
  const h = c.hud;
  if (!h) return '';
  let saldo = h.saldo;
  let flash = 0;
  if (h.de !== undefined) {
    const t0 = typeof h.quando === 'number' ? h.quando : c.w(h.quando || '', 0, 0.6);
    const k = suave((lt - t0) / 0.9);
    saldo = mix(h.de, h.saldo, k);
    som(h.saldo > h.de ? 'caixa' : 'saida', t0, 0.9);
    flash = lt > t0 ? 1 - lim((lt - t0 - 0.9) / 0.5) : 0;
  }
  const cy = 150;
  const corSaldo = flash > 0 && h.saldo < (h.de || 0) ? '#FF6B6B' : '#6BEA8E';
  const b1 = caixaHud(74, 190, iconeCalendario(118, cy) + txt(`DIA ${h.dia}`, 192, cy + 16, { tam: 44, cor: '#fff' }));
  const b2 = caixaHud(282, 300,
    iconeDinheiro(325, cy) +
    txt('SALDO', 362, cy - 14, { tam: 19, cor: '#AEB4C2', anc: 'start', ls: 1 }) +
    `<g transform="translate(362 ${cy + 26}) scale(${1 + 0.12 * flash}) translate(-362 ${-cy - 26})">` +
    txt(reais(Math.round(saldo)), 362, cy + 26, { tam: 42, cor: corSaldo, anc: 'start' }) + '</g>'
  );
  const b3 = caixaHud(600, 406,
    iconeCapelo(640, cy) +
    txt('FORMATURA', 680, cy - 14, { tam: 19, cor: '#AEB4C2', anc: 'start', ls: 1 }) +
    txt(`↓${h.formatura} DIAS`, 680, cy + 26, { tam: 42, cor: '#FFD23F', anc: 'start' })
  );
  return pulo(b1 + b2 + b3, lt + (c.hudNovo ? 0 : 10), 540, 150, c.hudNovo ? 0.15 : 0);
}

// ---------- legendas palavra por palavra ----------
// "*palavra*" na fala = destaque amarelo. A legenda mostra blocos de até 3 palavras.
function tokens(fala) {
  const out = [];
  let dentro = false;
  for (const bruto of fala.split(/\s+/).filter(Boolean)) {
    const destaque = dentro || bruto.includes('*');
    for (const ch of bruto) if (ch === '*') dentro = !dentro;
    const texto = bruto.replace(/\*/g, '');
    out.push({ texto, destaque, pausa: /[.,:;!?…]$/.test(texto) });
  }
  return out;
}
const semAsterisco = (f) => f.replace(/\*/g, '');
const normal = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w$]/g, '');

function temposDasPalavras(toks, palavras, dur) {
  if (palavras.length === toks.length) return palavras.map((p) => p.inicio + ATRASO_FALA);
  // Contagens diferentes (números, siglas): distribui pelo tamanho do texto.
  const ini = palavras.length ? palavras[0].inicio : 0;
  const fim = palavras.length ? palavras[palavras.length - 1].fim : dur * 0.8;
  const tam = toks.map((t) => t.texto.length + 2);
  const total = tam.reduce((a, b) => a + b, 0);
  let acc = 0;
  return tam.map((n) => { const t = ini + ((fim - ini) * acc) / total; acc += n; return t + ATRASO_FALA; });
}

function montarLegenda(c) {
  if (!c.fala || c.semLegenda) return [];
  const toks = c.toks;
  const blocos = [];
  let atual = [];
  toks.forEach((t, i) => {
    atual.push(i);
    const chars = atual.reduce((a, j) => a + toks[j].texto.length + 1, 0);
    const prox = toks[i + 1];
    if (atual.length >= 3 || t.pausa || (prox && chars + prox.texto.length > 15)) {
      blocos.push(atual);
      atual = [];
    }
  });
  if (atual.length) blocos.push(atual);
  return blocos.map((b, k) => ({
    idx: b,
    ini: c.tempos[b[0]],
    fim: k + 1 < blocos.length ? c.tempos[blocos[k + 1][0]] : c.dur,
  }));
}

function legenda(c, lt) {
  const b = c.blocos.find((x) => lt >= x.ini && lt < x.fim);
  if (!b) return '';
  const partes = b.idx.map((i) => c.toks[i]);
  const conteudo = partes
    .map((p, j) => `<tspan fill="${p.destaque ? '#FFD21F' : '#FFFFFF'}">${esc((j ? ' ' : '') + p.texto.toUpperCase().replace(/[.,:;…]+$/, ''))}</tspan>`)
    .join('');
  const chars = partes.reduce((a, p) => a + p.texto.length + 1, 0);
  const tam = Math.min(104, 980 / (chars * 0.47));
  const y = c.legendaY || 905;
  const k = 0.82 + 0.18 * salto((lt - b.ini) / 0.16);
  return (
    `<g transform="translate(540 ${y}) scale(${k}) translate(-540 ${-y})">` +
    `<text x="545" y="${y + 9}" text-anchor="middle" font-family="${F_TIT}" font-size="${tam}" fill="#000" opacity="0.45">${esc(partes.map((p) => p.texto.toUpperCase().replace(/[.,:;…]+$/, '')).join(' '))}</text>` +
    `<text x="540" y="${y}" text-anchor="middle" font-family="${F_TIT}" font-size="${tam}" stroke="#111" stroke-width="${tam * 0.17}" stroke-linejoin="round" paint-order="stroke">${conteudo}</text>` +
    `</g>`
  );
}

// ---------- episódio ----------
/**
 * Cena: {
 *   fala: 'texto da narração com *destaque*',
 *   dur?: duração mínima (s),
 *   hud?: { dia, saldo, formatura, de?, quando? }   (de/quando = saldo animado a partir da palavra)
 *   hudNovo?: true  -> HUD entra com animação nesta cena
 *   passo?: 'PASSO 1 · MERCADINHO'
 *   desenhar(lt, c) -> SVG da cena (lt = tempo local em segundos)
 * }
 * Dentro de desenhar: c.w('palavra') = instante (s) em que a narração diz a palavra.
 */
function criarEpisodio(cenas, { voz = 'pt-BR-AntonioNeural', velocidade = '+12%' } = {}) {
  window.CENAS = cenas;
  window.FPS = FPS;
  window.VOZ = { voz, velocidade };
  window.FALAS = cenas.map((c) => (c.fala ? semAsterisco(c.fala) : null));
  // voz por cena: 'mulher' usa uma voz feminina (falas de personagens como a Dona Cida)
  window.VOZES = cenas.map((c) => (c.voz === 'mulher' ? { voz: 'pt-BR-FranciscaNeural', velocidade: '+6%' } : { voz, velocidade }));
  cenas.forEach((c) => {
    c.toks = c.fala ? tokens(c.fala) : [];
    c.w = (palavra, n = 0, padrao = 0.5) => {
      const alvo = normal(palavra);
      let k = 0;
      for (let i = 0; i < c.toks.length; i++) {
        if (normal(c.toks[i].texto).startsWith(alvo) && k++ === n) return c.tempos[i];
      }
      return padrao;
    };
  });
  definirTempos(cenas.map((c) => ({ dur: c.dur || 2.5, palavras: [] })));
}

function definirTempos(lista) {
  let t = 0;
  window.INICIOS = [];
  CENAS.forEach((c, i) => {
    const palavras = lista[i].palavras || [];
    c.dur = lista[i].dur;
    c.tempos = temposDasPalavras(c.toks, palavras, c.dur);
    c.inicio = t;
    INICIOS.push(t);
    t += c.dur;
    c.blocos = montarLegenda(c);
  });
  window.DURACAO = t;
  // Passa uma vez por cada cena (no fim dela) para registrar os efeitos sonoros.
  const sons = [];
  CENAS.forEach((c, i) => {
    REG = { base: c.inicio, dur: c.dur, lista: sons };
    try { quadroDaCena(i, c.dur - 0.001); } finally { REG = null; }
  });
  window.SONS = sons;
  return { duracao: DURACAO, inicios: INICIOS, sons };
}

function quadroDaCena(i, lt) {
  const c = CENAS[i];
  let s = c.desenhar(lt, c);
  if (c.passo) s += pulo(pilula(c.passo, 540, 262), lt + (c.passoNovo ? 0 : 10), 540, 262, 0.2);
  s += hud(c, lt);
  s += legenda(c, lt);
  return s;
}

function renderizar(t) {
  let i = INICIOS.length - 1;
  while (i > 0 && INICIOS[i] > t) i--;
  return quadroDaCena(i, t - INICIOS[i]);
}

// ---------- capa no padrão do perfil (ver LEIA-ME) ----------
// fundo = SVG do cenário + personagens; o resto é o texto padrão por cima.
function capaEpisodio({ numero, subtitulo, rotuloAntes = 'SALDO ANTES', antes, rotuloDepois = 'DEPOIS', depois, etiqueta, fundo }) {
  let s = fundo;
  s += `<rect width="1080" height="1920" fill="#FFF8E6" opacity="0.18"/>`;
  s += `<defs><linearGradient id="capaTopo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="capaBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></linearGradient></defs>`;
  s += `<rect width="1080" height="560" fill="url(#capaTopo)"/><rect y="1460" width="1080" height="460" fill="url(#capaBase)"/>`;
  // EPISÓDIO + número
  s += txt('EPISÓDIO', 470, 300, { tam: 150, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 22 });
  s += txt(String(numero), 900, 330, { tam: 250, cor: '#FFD21F', fonte: F_TIT, peso: 400, contorno: '#111', cw: 26 });
  // subtítulo em pílula escura
  const ws = subtitulo.length * 32 + 90;
  s += `<rect x="${540 - ws / 2}" y="350" width="${ws}" height="84" rx="14" fill="#1F2430" stroke="#0E1015" stroke-width="5"/>` + txt(subtitulo, 540, 410, { tam: 56, cor: '#fff' });
  // card antes -> depois
  s += `<g transform="translate(540 600) rotate(-3)">` + sombra(-380, -105, 760, 210, 26) +
    `<rect x="-380" y="-105" width="760" height="210" rx="26" fill="#FBF8EF" stroke="#2A2A2A" stroke-width="6"/>` +
    txt(rotuloAntes, -190, -50, { tam: 30, cor: '#888', ls: 2 }) + txt(rotuloDepois, 190, -50, { tam: 30, cor: '#888', ls: 2 }) +
    txt(antes, -190, 60, { tam: 110, cor: '#D7262B', fonte: F_TIT, peso: 400 }) +
    `<path d="M -40 20 L 30 20 M 10 -5 L 40 20 L 10 45" fill="none" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` +
    txt(depois, 200, 60, { tam: 110, cor: '#1E9E4A', fonte: F_TIT, peso: 400 }) + `</g>`;
  if (etiqueta) s += `<g transform="translate(780 745) rotate(-6)">` + pilula(etiqueta, 0, 0, { tam: 48 }) + `</g>`;
  // rodapé fixo
  s += txt('RICO ATÉ A', 540, 1700, { tam: 140, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#111', cw: 20 });
  s += txt('FORMATURA', 500, 1850, { tam: 150, cor: '#FFD21F', fonte: F_TIT, peso: 400, contorno: '#111', cw: 22 });
  s += `<g transform="translate(940 1800) scale(3.2)">${iconeCapelo(0, 0)}</g>`;
  return s;
}

// ---------- story de enquete A/B (1080x1920, espaço livre no meio para o adesivo) ----------
// a/b = { mundo: SVG do cenário com personagens (coordenadas do vídeo), rotulo, y0? (topo da área mostrada) }
function storyAB({ titulo = 'QUEM VAI GANHAR?', episodio, a, b }) {
  const painel = (p, y, letra, cor, id) => {
    const k = 1000 / 1080, y0 = p.y0 ?? 1140;
    return `<defs><clipPath id="${id}"><rect x="40" y="${y}" width="1000" height="620" rx="36"/></clipPath></defs>` +
      `<rect x="48" y="${y + 12}" width="1000" height="620" rx="36" fill="#000" opacity="0.35"/>` +
      `<g clip-path="url(#${id})"><g transform="translate(40 ${y}) scale(${k}) translate(0 ${-y0})">${p.mundo}</g></g>` +
      `<rect x="40" y="${y}" width="1000" height="620" rx="36" fill="none" stroke="#fff" stroke-width="10"/>` +
      `<circle cx="120" cy="${y + 80}" r="66" fill="${cor}" stroke="#fff" stroke-width="9"/>` + txt(letra, 120, y + 113, { tam: 92, cor: '#fff', fonte: F_TIT, peso: 400 }) +
      pilula(p.rotulo, 540, y + 575, { tam: 44 });
  };
  let s = `<defs><linearGradient id="stFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1F2A"/><stop offset="1" stop-color="#0E1016"/></linearGradient></defs>`;
  s += `<rect width="1080" height="1920" fill="url(#stFundo)"/>`;
  for (let i = 0; i < 18; i++) { const r = aleatorio(i + 7); s += `<circle cx="${r() * 1080}" cy="${r() * 1920}" r="${4 + r() * 8}" fill="#FFD21F" opacity="${0.15 + r() * 0.2}"/>`; }
  if (episodio) s += pilula(episodio, 540, 110, { tam: 40 });
  s += txt(titulo, 540, 260, { tam: 120, cor: '#fff', fonte: F_TIT, peso: 400, contorno: '#000', cw: 16 });
  s += painel(a, 330, 'A', '#2F6DB5', 'stA');
  // faixa livre para o adesivo de enquete
  s += txt('VOTA AQUI 👇', 540, 1035, { tam: 52, cor: '#FFD21F' });
  s += `<rect x="140" y="1065" width="800" height="150" rx="28" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="18 14" opacity="0.35"/>`;
  s += painel(b, 1250, 'B', '#D7262B', 'stB');
  return s;
}
