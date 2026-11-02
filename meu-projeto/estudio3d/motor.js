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
//   corteSeco?: true,     corta direto para a câmera nova (com flash branco), sem deslizar
// b.falando(lt) -> true enquanto uma palavra está sendo dita (boca do personagem).
//   corte?: true | (lt, b) => bool,   vista em corte (mostra o subsolo / o interior)
//   semLegenda?: true,    não mostra a legenda palavra por palavra
//   aplicar(lt, b),       ajusta o mundo para o instante lt (s) do bloco
//   camada?(lt, b),       HTML extra (cartão, etiqueta...) por cima do vídeo
//   sons?: [{ em: 'palavra' | (b) => s, tipo }]
// }
// b.palavra('quebra') -> instante (s, dentro do bloco) em que a palavra é dita.

import * as THREE from 'three';

// Vertical (padrão) 720x1280 ou horizontal 1280x720 (?formato=horizontal)
export const HORIZONTAL = new URLSearchParams(location.search).get('formato') === 'horizontal';
export const W = HORIZONTAL ? 1280 : 720, H = HORIZONTAL ? 720 : 1280;
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
// Registro dos símbolos que aparecem (para efeitos sonoros automáticos).
let registro = null;
const marcar = (ini, tipo) => { if (registro) registro.push({ ini, tipo }); };
const pop = (lt, ini) => `transform: translate(-50%, 0) scale(${Math.max(0.01, salto((lt - ini) / 0.3))}); opacity: ${lim((lt - ini) / 0.1)};`;

/** Cartão branco com número vermelho grande (ex.: "27x" / "MENOS ENVERGADURA"). */
export function cartao(lt, ini, numero, sub) {
  marcar(ini, 'pop');
  if (lt < ini) return '';
  return `<div class="cartao" style="${pop(lt, ini)}"><div class="num">${esc(numero)}</div><div class="sub">${esc(sub)}</div></div>`;
}
/** Etiqueta vermelha (ex.: "● EROSÃO"). */
export function etiqueta(lt, ini, texto) {
  marcar(ini, 'plim');
  if (lt < ini) return '';
  return `<div class="etiqueta" style="${pop(lt, ini)}">${esc(texto)}</div>`;
}
/** Selo verde de "resolvido". */
export function ok(lt, ini) {
  marcar(ini, 'ok');
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
  const limpo = params.get('limpo') === '1'; // sem textos por cima (para recortar cenas)

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
    cortavel(material) { material.clipShadows = true; cortaveis.add(material); return material; },
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
      // true enquanto alguma palavra está sendo dita (para mexer a boca do personagem)
      b.falando = (lt) => b.palavras.some((p) => lt >= p.inicio + ATRASO_FALA && lt <= p.fim + ATRASO_FALA);
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
    if (i > 0 && !b.semTransicao && !b.corteSeco) {
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
    const topo = video.config.legendaTopo ? `top:${video.config.legendaTopo}px;` : '';
    return `<div class="legenda contorno" style="${topo}transform: scale(${k})">${txt}</div>`;
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
    const corte = typeof b.corte === 'function' ? b.corte(lt, b) : !!b.corte;
    for (const m of cortaveis) m.clippingPlanes = corte ? [planoCorte] : [];
    roteiro.sempre && roteiro.sempre(t, corte);
    posicionarCamera(i, lt);
    renderer.render(cena, camera);

    let html = b.semLegenda || (i === 0 && video.config.tituloEstilo === 'meio' && lt < b.dur - 0.6) ? '' : legendaHTML(b, lt);
    if (i === 0 && video.config.titulo) {
      const op = 1 - lim((lt - (b.dur - 0.6)) / 0.4);
      if (video.config.tituloEstilo === 'meio') {
        // capa: título mais baixo, centralizado e dinâmico (parado no 1º quadro, depois "respira")
        const k = lt < 0.5 ? 1 : 1 + 0.035 * Math.sin((lt - 0.5) * 5);
        const linhas = linhasComDestaque(video.config.titulo).split('<br>').map((l, n) => `<span class="linha l${n % 3}">${l}</span>`).join('<br>');
        html += `<div class="titulo contorno meio" style="opacity:${op}; transform: scale(${k})">${linhas}</div>`;
      } else {
        html += `<div class="titulo contorno" style="opacity:${op}">${linhasComDestaque(video.config.titulo)}</div>`;
      }
    }
    if (b.camada) html += b.camada(lt, b);
    if (b.corteSeco && i > 0 && lt < 0.14) html += `<div style="position:absolute;inset:0;background:#fff;opacity:${0.85 * (1 - lt / 0.14)}"></div>`;
    camada.innerHTML = limpo ? '' : html;
  }

  function sons() {
    const lista = [];
    for (const b of blocos) {
      for (const s of b.sons || []) {
        const em = typeof s.em === 'function' ? s.em(b) : b.palavra(s.em);
        lista.push({ t: b.inicio + em + (s.depois || 0), tipo: s.tipo });
      }
    }
    if (video.config.sonsAuto === false) return lista;
    // automáticos: corte seco = whoosh; cartão = pop; etiqueta = plim; selo ✓ = ok; texto final = pop
    const auto = [];
    blocos.forEach((b, i) => {
      if (i > 0 && b.corteSeco) auto.push({ t: b.inicio, tipo: 'whoosh' });
      if (b.camada) {
        registro = [];
        try { b.camada(b.dur + 5, b); } catch (e) { /* ignora */ }
        for (const r of registro) if (isFinite(r.ini)) auto.push({ t: b.inicio + Math.max(0, r.ini), tipo: r.tipo });
        registro = null;
      }
    });
    for (const a of auto) {
      const repetido = [...lista, ...auto.filter((x) => x !== a && x.tipo === a.tipo && x.t < a.t)].some((x) => Math.abs(x.t - a.t) < 0.25 && (x.tipo === a.tipo || (a.tipo === 'ok' && x.tipo === 'ok')));
      if (!repetido) lista.push(a);
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
// Final padrão (atual): "Quer aprender a fazer vídeos como esse? Deixa o like e me segue!" + LINK NA BIO.
// ?finalAntigo=1 recria o final antigo ("link na bio" com IA) — só para remixar vídeos antigos.
const FINAL_ANTIGO = typeof location !== 'undefined' && new URLSearchParams(location.search).has('finalAntigo');
export const FALA_FINAL = FINAL_ANTIGO
  ? 'Esse vídeo foi feito cem por cento com inteligência artificial. Quer aprender? Link na bio!'
  : 'Quer aprender a fazer vídeos como esse? Deixa o like, me segue, e acessa o link na bio!';
/** Texto do final: "QUER APRENDER A FAZER VÍDEOS ASSIM? DEIXA O LIKE E ME SEGUE! LINK NA BIO" */
export function textoFinal(lt) {
  const k = Math.max(0.01, salto(lt / 0.35));
  marcar(0, 'pop');
  const linhas = FINAL_ANTIGO ? ['QUER FAZER VÍDEOS', 'ASSIM COM *IA*?', '*LINK NA BIO!*'] : ['QUER APRENDER A', 'FAZER VÍDEOS ASSIM?', '*DEIXA O LIKE*', '*E ME SEGUE!*', 'LINK NA BIO'];
  return `<div class="final contorno" style="transform: scale(${k}); opacity:${lim(lt / 0.1)}">${linhasComDestaque(linhas)}</div>`;
}
