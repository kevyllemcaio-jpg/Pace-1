// Motor dos vídeos 3D: cena, luz, câmera contínua (sem cortes), linha do tempo
// por "blocos" de narração e a camada de textos (legenda palavra por palavra,
// cartões, etiquetas).
//
// Um vídeo (videos/<nome>.js) exporta:
//   config = { titulo: [...linhas], voz?, velocidade? }
//   criar(ctx) -> { blocos: [...], inicial(), sempre?(t) }
// Cada bloco: {
//   fala,                 texto narrado (a duração do bloco segue a fala)
//   destaque: [...],      palavras da legenda em amarelo
//   camera: {pos, alvo} | (lt, b) => {pos, alvo},   cameraFim?: {pos, alvo}
//   transicao?: s,        tempo do movimento de câmera vindo do bloco anterior (padrão 1.4)
//   corte?: true,         vista em corte (mostra o subsolo)
//   semLegenda?: true,    não mostra a legenda palavra por palavra
//   aplicar(lt, b),       ajusta o mundo para o instante lt (s) do bloco
//   camada?(lt, b),       HTML extra (cartão, etiqueta...) por cima do vídeo
//   sons?: [{ em: 'palavra' | (b) => s, tipo }]
// }
// b.palavra('quebra') -> instante (s, dentro do bloco) em que a palavra é dita.

import * as THREE from 'three';

export const W = 720, H = 1280;
export const ATRASO_FALA = 0.2;

export const lim = (x) => Math.min(1, Math.max(0, x));
export const suave = (x) => { x = lim(x); return x * x * (3 - 2 * x); };
export const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
export function salto(x) {
  x = lim(x);
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
export const mistura = (a, b, k) => a + (b - a) * k;

const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]/g, '');

// ---------- camada de textos ----------

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function linhasComDestaque(linhas) {
  return linhas
    .map((l) => l.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith('*') ? `<span class="destaque">${esc(p.slice(1, -1))}</span>` : esc(p))).join(''))
    .join('<br>');
}
const pop = (lt, ini) => `transform: translate(-50%, 0) scale(${Math.max(0.01, salto((lt - ini) / 0.3))}); opacity: ${lim((lt - ini) / 0.1)};`;

/** Cartão branco com número vermelho grande (ex.: "27x" / "MENOS ENVERGADURA"). */
export function cartao(lt, ini, numero, sub) {
  if (lt < ini) return '';
  return `<div class="cartao" style="${pop(lt, ini)}"><div class="num">${esc(numero)}</div><div class="sub">${esc(sub)}</div></div>`;
}
/** Etiqueta vermelha (ex.: "● EROSÃO"). */
export function etiqueta(lt, ini, texto) {
  if (lt < ini) return '';
  return `<div class="etiqueta" style="${pop(lt, ini)}">${esc(texto)}</div>`;
}
/** Selo verde de "resolvido". */
export function ok(lt, ini) {
  if (lt < ini) return '';
  return `<div class="ok" style="${pop(lt, ini)}">✓</div>`;
}
/** Onomatopeia grande (ex.: "TUM-TUM!"). */
export function som(lt, ini, texto, dur = 0.8) {
  if (lt < ini || lt > ini + dur) return '';
  return `<div class="som contorno" style="${pop(lt, ini)} transform: translate(-50%,0) rotate(-8deg) scale(${salto((lt - ini) / 0.25)});">${esc(texto)}</div>`;
}

// Junta as palavras em grupos de até 2 (como na legenda dos vídeos de referência).
function gruposLegenda(palavras) {
  const grupos = [];
  for (const p of palavras) {
    const ult = grupos[grupos.length - 1];
    const cabe = ult && ult.palavras.length < 2 && p.inicio - ult.fim < 0.25 && !/[.,!?:;]$/.test(ult.palavras[ult.palavras.length - 1].texto);
    if (cabe) { ult.palavras.push(p); ult.fim = p.fim; }
    else grupos.push({ palavras: [p], inicio: p.inicio, fim: p.fim });
  }
  return grupos;
}

// ---------- câmera ----------

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
function poseDoBloco(b, lt) {
  if (typeof b.camera === 'function') return b.camera(lt, b);
  if (!b.cameraFim) return b.camera;
  const k = suave(lt / b.dur);
  const p = b.camera, f = b.cameraFim;
  return { pos: p.pos.map((v, i) => mistura(v, f.pos[i], k)), alvo: p.alvo.map((v, i) => mistura(v, f.alvo[i], k)) };
}

// ---------- início ----------

export function iniciar(video) {
  const params = new URLSearchParams(location.search);
  const escala = parseFloat(params.get('escala') || '1');

  const canvas = document.getElementById('tela');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(escala);
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const cena = new THREE.Scene();
  const corCeu = new THREE.Color('#8CCFFF');
  cena.background = corCeu.clone();
  cena.fog = new THREE.Fog('#CDEBFF', 160, 460);

  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1200);
  const hemi = new THREE.HemisphereLight('#ffffff', '#6f7f4f', 1.5);
  cena.add(hemi);
  const sol = new THREE.DirectionalLight('#fff3dd', 2.4);
  sol.position.set(70, 110, 55);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 10, far: 400 });
  sol.shadow.bias = -0.0005;
  cena.add(sol);

  // Plano de corte: na vista em corte, some tudo que estiver na frente de z = 0.
  const planoCorte = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
  const cortaveis = new Set();

  const ctx = {
    THREE, cena, camera, renderer, hemi, sol, corCeu, planoCorte,
    /** Marca um material para sumir na vista em corte. */
    cortavel(material) { cortaveis.add(material); return material; },
  };
  const roteiro = video.criar(ctx);
  const blocos = roteiro.blocos;
  const camada = document.getElementById('camada');

  // Tempos provisórios (sem narração); o render.js substitui pelos tempos reais da fala.
  function definirTempos(tempos) {
    let acc = 0;
    blocos.forEach((b, i) => {
      const tp = tempos ? tempos[i] : null;
      b.dur = tp ? tp.dur : b.dur || 4;
      b.palavras = (tp && tp.palavras) || [];
      b.inicio = acc;
      b.grupos = gruposLegenda(b.palavras.map((p) => ({ ...p, inicio: p.inicio + ATRASO_FALA, fim: p.fim + ATRASO_FALA })));
      b.palavra = (txt, n = 0) => {
        const alvo = normalizar(txt);
        const achadas = b.palavras.filter((p) => normalizar(p.texto).startsWith(alvo));
        if (achadas[n]) return achadas[n].inicio + ATRASO_FALA;
        // Sem narração: estima pela posição da palavra no texto.
        const palavrasTexto = (b.fala || '').split(/\s+/).map(normalizar);
        const idx = palavrasTexto.findIndex((p) => p.startsWith(alvo));
        return idx < 0 ? 0 : (idx / Math.max(1, palavrasTexto.length)) * b.dur * 0.85;
      };
      acc += b.dur;
    });
    return { duracao: acc, inicios: blocos.map((b) => b.inicio) };
  }
  definirTempos(null);

  const duracao = () => blocos.reduce((s, b) => s + b.dur, 0);
  const indiceEm = (t) => {
    for (let i = blocos.length - 1; i >= 0; i--) if (t >= blocos[i].inicio) return i;
    return 0;
  };

  function posicionarCamera(i, lt) {
    const b = blocos[i];
    let pose = poseDoBloco(b, lt);
    if (i > 0 && !b.semTransicao) {
      const ant = blocos[i - 1];
      const de = poseDoBloco(ant, ant.dur);
      const k = suave(lt / (b.transicao ?? 1.4));
      pose = { pos: de.pos.map((v, j) => mistura(v, pose.pos[j], k)), alvo: de.alvo.map((v, j) => mistura(v, pose.alvo[j], k)) };
    }
    camera.position.copy(v3(pose.pos));
    camera.lookAt(v3(pose.alvo));
  }

  function legendaHTML(b, lt) {
    const g = b.grupos.findLast ? b.grupos.findLast((x) => x.inicio <= lt) : [...b.grupos].reverse().find((x) => x.inicio <= lt);
    if (!g || lt > g.fim + 0.6) return '';
    const destaques = (b.destaque || []).map(normalizar);
    const txt = g.palavras
      .map((p) => {
        const limpo = p.texto.replace(/[.,!?:;]+$/, '');
        const t = limpo.charAt(0).toUpperCase() + limpo.slice(1);
        return destaques.includes(normalizar(limpo)) ? `<span class="destaque">${esc(t)}</span>` : esc(t);
      })
      .join(' ');
    const k = 0.85 + 0.15 * saida((lt - g.inicio) / 0.12);
    return `<div class="legenda contorno" style="transform: scale(${k})">${txt}</div>`;
  }

  function quadro(t) {
    const i = indiceEm(t);
    roteiro.inicial();
    for (let k = 0; k <= i; k++) {
      const b = blocos[k];
      const lt = k < i ? b.dur : t - b.inicio;
      b.aplicar && b.aplicar(lt, b);
    }
    const b = blocos[i];
    const lt = t - b.inicio;
    for (const m of cortaveis) m.clippingPlanes = b.corte ? [planoCorte] : [];
    roteiro.sempre && roteiro.sempre(t, b.corte);
    posicionarCamera(i, lt);
    renderer.render(cena, camera);

    let html = b.semLegenda ? '' : legendaHTML(b, lt);
    if (i === 0 && video.config.titulo) {
      const op = 1 - lim((lt - (b.dur - 0.6)) / 0.4);
      html += `<div class="titulo contorno" style="opacity:${op}">${linhasComDestaque(video.config.titulo)}</div>`;
    }
    if (b.camada) html += b.camada(lt, b);
    camada.innerHTML = html;
  }

  function sons() {
    const lista = [];
    for (const b of blocos) {
      for (const s of b.sons || []) {
        const em = typeof s.em === 'function' ? s.em(b) : b.palavra(s.em);
        lista.push({ t: b.inicio + em + (s.depois || 0), tipo: s.tipo });
      }
    }
    return lista;
  }

  return {
    falas: () => blocos.map((b) => b.fala || null),
    config: video.config,
    definirTempos,
    duracao,
    inicios: () => blocos.map((b) => b.inicio),
    quadro,
    sons,
  };
}

// ================= PADRÃO DO CANAL =================
export const FALA_FINAL = 'Esse vídeo foi feito cem por cento com inteligência artificial. Quer aprender? Link na bio!';
/** Texto único do final: "QUER FAZER VÍDEOS ASSIM COM IA? LINK NA BIO!" */
export function textoFinal(lt) {
  const k = Math.max(0.01, salto(lt / 0.35));
  return `<div class="final contorno" style="transform: scale(${k}); opacity:${lim(lt / 0.1)}">${linhasComDestaque(['QUER FAZER VÍDEOS', 'ASSIM COM *IA*?', '*LINK NA BIO!*'])}</div>`;
}
