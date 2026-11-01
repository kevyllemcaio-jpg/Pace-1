// Estúdio das AULAS do curso: cenário low-poly com telão (slides desenhados na hora),
// celular num tripé mostrando exemplos e o personagem como professor (boca sincronizada).
//
// Cada aula (videos/aulaN.js) só descreve o roteiro:
//   { titulo: [...], blocos: [{ fala, destaque?, plano, gesto?, expr?, tela?, celular?, cartao?, etiqueta?, ok?, sons? }] }
//   plano:   'thumb' | 'perto' | 'medio' | 'tela' | 'celular' | 'lado' | 'aberto'
//   tela:    { titulo, itens: [...] } | { titulo, imagem: 'nome' , legenda } | { titulo, prompt: '...' } | { titulo, passos: [...] }
//   celular: ['thumb-ponte', 'thumb-tunel', ...]   (imagens de estudio3d/curso/img/, trocam a cada 1,3 s)
//   cartao:  ['27x', 'SUBTÍTULO', 'palavra-gatilho']   etiqueta: ['TEXTO', 'palavra']   ok: 'palavra'

import * as THREE from 'three';
import { suave, saida, lim, cartao, etiqueta, ok, HORIZONTAL, linhasComDestaque, salto } from '../motor.js';
import { mat, caixa, cilindro, malha, arvore } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

const IMAGENS = {};
export async function carregarImagens(nomes) {
  await Promise.all(
    nomes.map((n) => new Promise((ok_) => {
      if (IMAGENS[n]) return ok_();
      const img = new Image();
      img.onload = () => { IMAGENS[n] = img; ok_(); };
      img.onerror = () => ok_();
      img.src = `/estudio3d/curso/img/${n}.jpg`;
    })),
  );
}
export function imagensDoRoteiro(roteiro) {
  const s = new Set();
  for (const b of roteiro.blocos) {
    if (b.tela && b.tela.imagem) s.add(b.tela.imagem);
    if (b.tela && b.tela.imagens) b.tela.imagens.forEach((n) => s.add(n));
    (b.celular || []).forEach((n) => s.add(n));
  }
  s.add('logo');
  ['thumb-ponte', 'thumb-tunel', 'thumb-agua', 'thumb-elevador', 'thumb-navio'].forEach((n) => s.add(n));
  return [...s];
}

// ---------- desenho dos slides (canvas 2D) ----------
const TW = HORIZONTAL ? 1280 : 1024, TH = HORIZONTAL ? 720 : 880;
function quebrar(ctx2, texto, largura) {
  const palavras = texto.split(' ');
  const linhas = [];
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? atual + ' ' + p : p;
    if (ctx2.measureText(teste).width > largura && atual) { linhas.push(atual); atual = p; } else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas;
}
function desenharSlide(ctx2, tela, k) {
  ctx2.clearRect(0, 0, TW, TH);
  const g = ctx2.createLinearGradient(0, 0, 0, TH);
  g.addColorStop(0, '#16225A');
  g.addColorStop(1, '#2B1D6B');
  ctx2.fillStyle = g;
  ctx2.fillRect(0, 0, TW, TH);
  if (!tela) {
    const logo = IMAGENS.logo;
    if (logo) ctx2.drawImage(logo, TW / 2 - 260, TH / 2 - 300, 520, 520);
    ctx2.fillStyle = '#FFD21F';
    ctx2.font = '900 64px Inter';
    ctx2.textAlign = 'center';
    ctx2.fillText('CONSTRÓI ISSO AÍ!', TW / 2, TH - 70);
    return;
  }
  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#FFD21F';
  ctx2.font = '900 84px Inter';
  const tl = quebrar(ctx2, tela.titulo || '', TW - 100);
  tl.forEach((l, i) => ctx2.fillText(l, 50, 110 + i * 90));
  let y = 130 + tl.length * 90;
  if (tela.itens || tela.passos) {
    const itens = tela.itens || tela.passos;
    ctx2.font = '800 60px Inter';
    itens.forEach((it, i) => {
      const vis = lim(k * itens.length * 1.15 - i);
      if (vis <= 0) return;
      ctx2.globalAlpha = vis;
      const linhas = quebrar(ctx2, it, TW - 170);
      if (tela.passos) {
        ctx2.fillStyle = '#FFD21F';
        ctx2.beginPath();
        ctx2.arc(78, y - 16, 30, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.fillStyle = '#16225A';
        ctx2.font = '900 38px Inter';
        ctx2.textAlign = 'center';
        ctx2.fillText(String(i + 1), 78, y - 3);
        ctx2.textAlign = 'left';
        ctx2.font = '800 60px Inter';
      } else {
        ctx2.fillStyle = '#2DBE60';
        ctx2.fillText('✓', 50, y);
      }
      ctx2.fillStyle = '#FFFFFF';
      linhas.forEach((l, j) => ctx2.fillText(l, 130, y + j * 68));
      y += linhas.length * 68 + 30;
      ctx2.globalAlpha = 1;
    });
  }
  if (tela.numero) {
    const vis = lim(k * 2);
    ctx2.globalAlpha = vis;
    ctx2.textAlign = 'center';
    ctx2.fillStyle = '#FFD21F';
    ctx2.font = `900 ${HORIZONTAL ? 190 : 170}px Inter`;
    ctx2.fillText(tela.numero, TW / 2, y + (HORIZONTAL ? 170 : 190));
    ctx2.fillStyle = '#FFFFFF';
    ctx2.font = '800 54px Inter';
    quebrar(ctx2, tela.sub || '', TW - 120).forEach((l, i) => ctx2.fillText(l, TW / 2, y + (HORIZONTAL ? 250 : 290) + i * 62));
    if (tela.fonte) {
      ctx2.fillStyle = 'rgba(255,255,255,.6)';
      ctx2.font = '600 28px Inter';
      ctx2.fillText(tela.fonte, TW / 2, TH - 30);
    }
    ctx2.textAlign = 'left';
    ctx2.globalAlpha = 1;
  }
  if (tela.imagens) {
    const imgs = tela.imagens.map((n) => IMAGENS[n]).filter(Boolean);
    const gap = 24, hMax = TH - y - 40;
    const w = Math.min((TW - 100 - gap * (imgs.length - 1)) / imgs.length, hMax * 9 / 16);
    const h = w * 16 / 9;
    const x0 = (TW - (w * imgs.length + gap * (imgs.length - 1))) / 2;
    imgs.forEach((im, i) => {
      ctx2.globalAlpha = lim(k * imgs.length * 1.3 - i);
      ctx2.drawImage(im, x0 + i * (w + gap), y, w, h);
    });
    ctx2.globalAlpha = 1;
  }
  if (tela.prompt) {
    ctx2.font = '600 50px "JetBrains Mono", monospace';
    const linhas = tela.prompt.split('\n').flatMap((l) => quebrar(ctx2, l, TW - 170));
    const h = linhas.length * 62 + 64;
    ctx2.fillStyle = '#0B1230';
    roundRect(ctx2, 40, y, TW - 80, h, 26);
    ctx2.fill();
    ctx2.fillStyle = '#7FD6FF';
    const n = Math.floor(linhas.join('').length * lim(k * 1.4));
    let feito = 0;
    linhas.forEach((l, i) => {
      const mostra = l.slice(0, Math.max(0, n - feito));
      feito += l.length;
      ctx2.fillText(mostra, 80, y + 72 + i * 62);
    });
  }
  if (tela.imagem && IMAGENS[tela.imagem]) {
    const img = IMAGENS[tela.imagem];
    const hMax = TH - y - (tela.legenda ? 80 : 30);
    const esc = Math.min(hMax / img.height, (TW - 100) / img.width);
    const w = img.width * esc, h = img.height * esc;
    ctx2.globalAlpha = lim(k * 3);
    ctx2.drawImage(img, (TW - w) / 2, y, w, h);
    ctx2.globalAlpha = 1;
    if (tela.legenda) {
      ctx2.fillStyle = '#FFFFFF';
      ctx2.font = '800 42px Inter';
      ctx2.textAlign = 'center';
      ctx2.fillText(tela.legenda, TW / 2, y + h + 56);
    }
  }
}
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// ---------- cenário ----------
// Layout vertical (Shorts/aulas) ou horizontal (YouTube 16:9)
const V = {
  PX: 1.05, PZ: 0.7, TX: 0, TY: 3.35, TZ: -1.5, TLARG: 3.3, TALT: 2.84, CX: -1.3, CY: 1.45, CZ: 0.9,
};
const HZ = {
  PX: 4.0, PZ: 0.5, TX: -0.2, TY: 2.65, TZ: -2.0, TLARG: 6.4, TALT: 3.6, CX: -4.6, CY: 1.45, CZ: 0.7,
};
const { PX, PZ, TX, TY, TZ, TLARG, TALT, CX, CY, CZ } = HORIZONTAL ? HZ : V;

const PLANOS = HORIZONTAL ? {
  thumb: { pos: [0.6, 2.5, 8.6], alvo: [0.3, 2.45, -1] },
  perto: { pos: [PX - 0.9, 1.75, PZ + 2.6], alvo: [PX - 0.6, 1.6, PZ] },
  medio: { pos: [1.3, 2.3, 7.2], alvo: [0.9, 2.2, -1] },
  tela: { pos: [TX, TY - 0.45, TZ + 5.3], alvo: [TX, TY - 0.45, TZ] },
  celular: { pos: [CX + 0.5, CY + 0.05, CZ + 2.0], alvo: [CX + 0.3, CY, CZ] },
  lado: { pos: [7.0, 2.0, 5.0], alvo: [1.5, 2.0, -0.5] },
  aberto: { pos: [0, 3.0, 12], alvo: [0, 2.4, -1] },
} : {
  thumb: { pos: [0, 2.75, 7.6], alvo: [0, 2.8, -1] },
  perto: { pos: [PX - 0.2, 1.8, PZ + 2.3], alvo: [PX - 0.05, 1.6, PZ] },
  medio: { pos: [0, 2.75, 7.6], alvo: [0, 2.8, -1] },
  tela: { pos: [TX, TY - 0.15, TZ + 5.9], alvo: [TX, TY - 0.1, TZ] },
  celular: { pos: [CX + 0.1, CY + 0.05, CZ + 2.05], alvo: [CX, CY, CZ] },
  lado: { pos: [3.6, 2.0, 4.6], alvo: [0.3, 2.0, -0.5] },
  aberto: { pos: [0, 3.2, 10.5], alvo: [0, 2.6, -1] },
};

export function criarAula(ctx, roteiro) {
  const { cena } = ctx;
  cena.background.set('#1B2350');
  cena.fog.color.set('#1B2350');
  ctx.hemi.intensity = 1.2;
  ctx.sol.intensity = 1.6;

  // chão, paredes e decoração
  for (let i = -6; i < 6; i++) cena.add(caixa(1, 0.1, 12, mat(i % 2 ? '#A97B4F' : '#B98A5C'), [i + 0.5, -0.05, 0]));
  cena.add(caixa(12, 7, 0.3, mat('#2E3A7A'), [0, 3.5, -3.2]));
  cena.add(caixa(0.3, 7, 12, mat('#28336B'), [-6, 3.5, 0]));
  cena.add(caixa(0.3, 7, 12, mat('#28336B'), [6, 3.5, 0]));
  for (let x = -5; x <= 5; x += 2.5) cena.add(caixa(0.12, 7, 0.1, mat('#3B4A99'), [x, 3.5, -3.0]));
  // plantas e mesa
  cena.add(arvore(-5, 0, -2, 0.45, 1), arvore(5, 0, -2, 0.45, 2));
  cena.add(caixa(1.6, 0.08, 0.8, mat('#7A4E2D'), [4.4, 0.95, -1.4]));
  cena.add(caixa(0.08, 0.95, 0.08, mat('#3D434C'), [3.7, 0.47, -1.1]), caixa(0.08, 0.95, 0.08, mat('#3D434C'), [5.1, 0.47, -1.1]));
  cena.add(caixa(0.9, 0.04, 0.6, mat('#2A2D33'), [4.4, 1.0, -1.4]));
  const tampaNote = caixa(0.9, 0.6, 0.03, mat('#2A2D33'), [4.4, 1.3, -1.7]);
  tampaNote.rotation.x = -0.2;
  cena.add(tampaNote);
  // luzes coloridas
  const spot1 = new THREE.PointLight('#FFB020', 30, 12, 1.5);
  spot1.position.set(-3, 5, 2);
  const spot2 = new THREE.PointLight('#7FD6FF', 25, 12, 1.5);
  spot2.position.set(4, 4.5, 2.5);
  cena.add(spot1, spot2);

  // telão
  const cvTela = document.createElement('canvas');
  cvTela.width = TW; cvTela.height = TH;
  const c2 = cvTela.getContext('2d');
  const texTela = new THREE.CanvasTexture(cvTela);
  texTela.colorSpace = THREE.SRGBColorSpace;
  cena.add(caixa(TLARG + 0.3, TALT + 0.3, 0.2, mat('#14182E'), [TX, TY, TZ - 0.12]));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(TLARG, TALT), new THREE.MeshBasicMaterial({ map: texTela }));
  tela.position.set(TX, TY, TZ);
  cena.add(tela);

  // celular no tripé
  const cvCel = document.createElement('canvas');
  cvCel.width = 540; cvCel.height = 960;
  const cc = cvCel.getContext('2d');
  const texCel = new THREE.CanvasTexture(cvCel);
  texCel.colorSpace = THREE.SRGBColorSpace;
  const celular = new THREE.Group();
  celular.add(caixa(0.98, 1.72, 0.08, mat('#111318'), [0, 0, -0.03]));
  const telaCel = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), new THREE.MeshBasicMaterial({ map: texCel }));
  telaCel.position.z = 0.015;
  celular.add(telaCel);
  celular.position.set(CX, CY, CZ);
  celular.rotation.y = 0.25;
  cena.add(celular);
  for (const a of [0, 2.1, 4.2]) {
    const perna = caixa(0.05, 0.75, 0.05, mat('#3D434C'), [Math.cos(a) * 0.25, 0.37, Math.sin(a) * 0.25]);
    perna.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3);
    const g = new THREE.Group();
    g.add(perna);
    g.position.set(CX, 0, CZ);
    cena.add(g);
  }
  cena.add(cilindro(0.03, 0.2, mat('#3D434C'), [CX, 0.78, CZ], 6));

  const voce = criarPersonagem();
  voce.scale.setScalar(1.0);
  cena.add(voce);

  let telaAtual = null, kAtual = -1, celAtual = '';
  function mostrarTela(t, k) {
    const chave = JSON.stringify(t) + Math.round(k * 60);
    if (chave === telaAtual) return;
    telaAtual = chave;
    desenharSlide(c2, t, k);
    texTela.needsUpdate = true;
  }
  function mostrarCelular(nome) {
    if (nome === celAtual) return;
    celAtual = nome;
    cc.fillStyle = '#000'; cc.fillRect(0, 0, 540, 960);
    const img = IMAGENS[nome];
    if (img) cc.drawImage(img, 0, 0, 540, 960);
    texCel.needsUpdate = true;
  }

  const blocos = roteiro.blocos.map((r, i) => {
    const plano = typeof r.plano === 'string' ? PLANOS[r.plano] : r.plano;
    return {
      fala: r.fala,
      destaque: r.destaque || [],
      camera: plano,
      corteSeco: i > 0 && r.corteSeco !== false,
      semLegenda: r.semLegenda,
      aplicar(lt, b) {
        const pr = lt / b.dur;
        mostrarTela(r.tela || null, i === 0 ? 1 : saida(pr / 0.75));
        const lista = r.celular && r.celular.length ? r.celular : ['thumb-ponte', 'thumb-tunel', 'thumb-agua', 'thumb-elevador', 'thumb-navio'];
        mostrarCelular(lista[Math.floor(lt / 1.3) % lista.length]);
        voce.position.set(PX, 0, PZ);
        voce.rotation.y = r.plano === 'perto' ? -0.1 : -0.35;
        voce.estado = { bracos: r.gesto ? (typeof r.gesto === 'function' ? r.gesto(lt, b) : r.gesto) : 'normal', expr: r.expr || 'feliz', falando: b.falando(lt), pulo: r.pulo ? 1 : 0 };
      },
      camada: (lt, b) => {
        let h = '';
        if (r.cartao) h += cartao(lt, b.palavra(r.cartao[2] || '') || 0.6, r.cartao[0], r.cartao[1]);
        if (r.etiqueta) h += etiqueta(lt, b.palavra(r.etiqueta[1] || '') || 0.6, r.etiqueta[0]);
        if (r.ok) h += ok(lt, b.palavra(r.ok));
        if (r.texto) h += `<div class="final contorno" style="transform: scale(${Math.max(0.01, salto(lt / 0.35))})">${linhasComDestaque(r.texto)}</div>`;
        return h;
      },
      sons: r.sons || (r.ok ? [{ em: r.ok, tipo: 'ok' }] : []),
    };
  });

  return {
    blocos,
    inicial() {},
    sempre(t) {
      voce.animar(t);
      spot1.intensity = 26 + 6 * Math.sin(t * 1.3);
    },
  };
}

/** Atalho para cada aula: export const { config, preparar, criar } = aula(ROTEIRO) */
export function aula(roteiro) {
  return {
    config: { titulo: roteiro.titulo, legendaTopo: 1040, velocidade: '+0%' },
    preparar: () => carregarImagens(imagensDoRoteiro(roteiro)),
    criar: (ctx) => criarAula(ctx, roteiro),
  };
}

/** Vídeo horizontal para o YouTube no mesmo estúdio: export const { config, preparar, criar } = videoYT(ROTEIRO) */
export function videoYT(roteiro) {
  return {
    config: { titulo: roteiro.titulo, velocidade: roteiro.velocidade || '+4%' },
    preparar: () => carregarImagens(imagensDoRoteiro(roteiro)),
    criar: (ctx) => criarAula(ctx, roteiro),
  };
}
