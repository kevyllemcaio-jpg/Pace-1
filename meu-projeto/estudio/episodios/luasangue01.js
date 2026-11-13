// LUA DE SANGUE — Episódio 1: A NOITE DA LUA CHEIA (5:00, animação 3D em blocos)
// Silvermoon. Lucas volta da casa do Ryan pela trilha da floresta, é atacado por uma criatura,
// conhece a Isabella na escola e, à noite, vê os próprios olhos brilharem no espelho.

window.RES3D = 0.6;
window.SOMBRA3D = 1024;
window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1540;
window.TRATAR_VOZ = true;
window.TRILHA = 'terror';

const NARR = { voz: 'pt-BR-AntonioNeural', velocidade: '-6%', tom: '-6Hz' };
const V = {
  narr: { voz: NARR, cor: '#F4EEDC' },
  lucas: { voz: { voz: 'en-US-AndrewMultilingualNeural', velocidade: '+4%' }, cor: '#7FD0FF', rotulo: 'LUCAS' },
  ryan: { voz: { voz: 'en-US-BrianMultilingualNeural', velocidade: '+10%' }, cor: '#FFD36A', rotulo: 'RYAN' },
  isa: { voz: { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+0%' }, cor: '#9BE89B', rotulo: 'ISABELLA' },
  mae: { voz: { voz: 'pt-BR-FranciscaNeural', velocidade: '+0%' }, cor: '#F2B8D0', rotulo: 'MÃE (LÁ DE DENTRO)' },
};
const E = [];
function plano(quem, fala, dur, desenhar, extra = {}) {
  const v = quem ? V[quem] : null;
  E.push({ fala, dur, voz: v && v.voz, corLegenda: v && v.cor, rotulo: v && v.rotulo, quem, desenhar, ...extra });
  return E.length - 1;
}
const falando = (c, lt) => !!c.fala && c.tempos && c.tempos.length > 0 && lt > c.tempos[0] - 0.05 && lt < c.tempos[c.tempos.length - 1] + 0.35;

// ---------- cenários e elenco (criados uma vez) ----------
const SETS = {};
const CRIA = {
  rua: () => {
    const sc = cenarioRua('noite', { casas: [[-14, -9, 'madeira'], [-4, -9, 'tijolo'], [6, -9, 'madeira'], [16, -9, 'pedra'], [26, -9, 'tijolo']] });
    sc.add(casa3D(-28, -13, { w: 11, d: 8, h: 6, parede: 'pedra' })); // a casa antiga da família Blackwood
    const lua = lua3D('#FFF4D6', [0, 0, 0], 18); lua.name = 'lua'; sc.add(lua); luaRua(sc, [14, 36, -90]);
    return sc;
  },
  floresta: () => { const sc = cenarioFloresta('noite'); const f = new THREE.DirectionalLight('#7A8CD0', 1.1); f.position.set(4, 8, -20); sc.add(f); sc.add(lua3D('#FFF4D6', [-22, 40, -95], 18)); return sc; },
  luaSangue: () => { const sc = cenaBase('luaSangue'); sc.add(lua3D('#FF5A4A', [0, 0, -40], 16)); return sc; },
  escola: () => cenarioEscola(),
  quarto: () => cenarioQuarto().sc,
};
function luaRua(sc, pos) { const g = sc.getObjectByName('lua'); g.children.forEach((m, i) => m.position.set(pos[0], pos[1], pos[2] - i * 0.5)); g.children.forEach((m) => m.lookAt(0, 1, 10)); }
const set = (n) => SETS[n] || (SETS[n] = CRIA[n]());
const rua = () => { luaRua(set('rua'), [14, 36, -90]); return 'rua'; };
const PS = {};
const per = (id) => PS[id] || (PS[id] = criarPersonagem(ELENCO[id]));
function quadro(n, atores, cam) {
  const sc = set(n);
  const ids = atores.map((a) => a[0]);
  for (const id in PS) if (PS[id].raiz.parent === sc && !ids.includes(id)) sc.remove(PS[id].raiz);
  for (const [id, o] of atores) { const p = per(id); if (p.raiz.parent !== sc) sc.add(p.raiz); pose(p, o); }
  render3D(sc, cam);
  return '';
}
// câmera por cima do ombro de A olhando para B (posições [x, z])
function ombro(A, B, { atras = 2.1, lado = 1.0, alt = 1.85, altAlvo = 1.6, fov = 34 } = {}) {
  const dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  return { pos: [A[0] - ux * atras - uz * lado, alt, A[1] - uz * atras + ux * lado], alvo: [B[0], altAlvo, B[1]], fov };
}
const rumo = (A, B) => (Math.atan2(B[0] - A[0], B[1] - A[1]) * 180) / Math.PI;
const marca = () => `<text x="60" y="110" font-family="Anton, sans-serif" font-size="38" fill="#fff" opacity="0.55" letter-spacing="3">LUA DE SANGUE · EP.1</text>`;
const topo = (linhas, lt, t0 = 0.2, cor = '#fff') => {
  const op = lim((lt - t0) / 0.4);
  return `<g opacity="${op}">` + linhas.map(([s, tam, c], i) => `<text x="540" y="${230 + i * (tam + 20)}" text-anchor="middle" font-family="Anton, sans-serif" font-size="${tam}" fill="${c || cor}" stroke="#000" stroke-width="10" paint-order="stroke" letter-spacing="2">${esc(s)}</text>`).join('') + `</g>`;
};
const fx = (lt, dur, { ent = 0.35, sai = 0.35, vin = 0.6 } = {}) => vinheta(vin) + escuro(1 - lim(lt / ent)) + escuro(1 - lim((dur - lt) / sai));
const ondas = (lt, cx, cy, cor = '#9FD8FF') => { let s = ''; for (let k = 0; k < 3; k++) { const f = ((lt * 0.8 + k / 3) % 1); s += `<circle cx="${cx}" cy="${cy}" r="${60 + f * 260}" fill="none" stroke="${cor}" stroke-width="${6 * (1 - f)}" opacity="${0.7 * (1 - f)}"/>`; } return s; };

// =============== 1 · SILVERMOON (0:00–0:40) ===============
plano(null, null, 5, (lt, c) => {
  som('suspense', 0, 0.7); som('uivo', 1.6, 1);
  const cam = camMov(lt, { pos: [0, 1.2, 10], alvo: [0, 1.3, -20], fov: 34 }, { pos: [0, 1.3, 4], alvo: [0, 1.6, -20], fov: 30 }, 0, 5);
  quadro('floresta', [['fera', { t: lt, x: 0.4, z: -16, rot: 0, lobo: lt > 1.4 ? 1 : 0, olhar: [0, 0] }]], cam);
  return fx(lt, 5, { ent: 0.01, sai: 0.15 }) + topo([['ELE ACHOU QUE ERA', 92], ['SÓ UM CACHORRO...', 104, '#FF5A4A']], lt, 0.1);
}, { capa: 3 });

plano(null, null, 5, (lt) => {
  som('impacto', 0.15, 1);
  quadro(rua(), [], camMov(lt, { pos: [0, 2, 12], alvo: [14, 36, -90], fov: 40 }, { pos: [0, 2, 10], alvo: [14, 36, -90], fov: 30 }, 0, 5));
  const k = 0.9 + 0.1 * suave(lt / 1.2);
  return vinheta(0.7) + escuro(1 - lim(lt / 0.5)) + escuro(1 - lim((5 - lt) / 0.4)) +
    `<g opacity="${lim(lt / 0.6)}" transform="translate(540 1180) scale(${k}) translate(-540 -1180)">` +
    `<text x="540" y="1180" text-anchor="middle" font-family="Anton, sans-serif" font-size="170" fill="#E8102A" stroke="#1A0004" stroke-width="14" paint-order="stroke" letter-spacing="6">LUA DE SANGUE</text>` +
    `<text x="540" y="1270" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="46" fill="#F4EEDC" letter-spacing="6">EPISÓDIO 1 · A NOITE DA LUA CHEIA</text></g>`;
});

plano('narr', 'Silvermoon. Uma cidade pequena, cercada por uma floresta que ninguém atravessa depois que escurece.', 10, (lt, c) => {
  som('grilos', 0, 0.6);
  quadro(rua(), [], camMov(lt, { pos: [-22, 15, 26], alvo: [-6, 0, -12], fov: 42 }, { pos: [2, 11, 20], alvo: [6, 1, -14], fov: 40 }, 0, 10));
  return fx(lt, 10) + marca() + topo([['SILVERMOON', 120]], lt, 0.6, '#F4EEDC');
});

plano('narr', 'Aqui, todo mundo se conhece. E todo mundo guarda um segredo. Algumas famílias guardam os delas há gerações.', 10, (lt) => {
  quadro(rua(), [], camMov(lt, { pos: [-8, 2.6, 8], alvo: [-20, 3, -12], fov: 40 }, { pos: [-17, 4, 12], alvo: [-28, 4, -13], fov: 44 }, 0, 10));
  return fx(lt, 10) + marca();
});

plano('narr', 'Mas esta noite, a lua está diferente. Maior. Mais perto. E alguma coisa na floresta… acordou.', 10, (lt, c) => {
  som('rosnado', c.w('acordou') - 0.1, 0.8);
  quadro('floresta', [['fera', { t: lt, x: -0.5, z: -22, lobo: lt > c.w('acordou') ? 1 : 0, olhar: [0, 0] }]],
    camMov(lt, { pos: [0, 1.2, 8], alvo: [-12, 22, -90], fov: 44 }, { pos: [0, 1.4, 2], alvo: [-0.5, 2.5, -22], fov: 30 }, 0.5, c.w('acordou')));
  return fx(lt, 10) + marca();
});

// =============== 2 · O CAMINHO DE CASA (0:40–1:30) ===============
const xAnda = (lt, x0 = -14, v = 1.1) => x0 + lt * v;
plano('ryan', 'Cara, amanhã eu te ganho naquele jogo. Pode escrever.', 8, (lt, c) => {
  som('grilos', 0, 0.5);
  const x = xAnda(lt);
  quadro(rua(), [
    ['lucas', { t: lt, x, z: -2.3, rot: 90, andar: 1, expr: 'sorriso', olhar: [20, 0] }],
    ['ryan', { t: lt + 0.4, x: x + 0.2, z: -3.4, rot: 90, andar: 1, expr: 'sorriso', fala: falando(c, lt), olhar: [-35, 0] }],
  ], { pos: [x + 0.6, 1.7, 5.5], alvo: [x + 0.2, 1.3, -2.8], fov: 38 });
  return fx(lt, 8, { sai: 0.01 }) + marca() + topo([['20:47 · VOLTANDO DA CASA DO RYAN', 46, '#F4EEDC']], lt, 0.3);
});

plano('lucas', 'Você fala isso a semana inteira, Ryan. E perde a semana inteira.', 7, (lt, c) => {
  const x = xAnda(lt + 8);
  quadro(rua(), [
    ['lucas', { t: lt, x, z: -2.3, rot: 90, andar: 1, expr: 'sorriso', fala: falando(c, lt), olhar: [25, 0] }],
    ['ryan', { t: lt + 0.4, x: x + 0.2, z: -3.4, rot: 90, andar: 1, expr: lt > c.tempos[c.tempos.length - 1] ? 'sorriso' : 'neutro', olhar: [-30, 0] }],
  ], { pos: [x + 3.4, 1.55, 0.6], alvo: [x, 1.45, -2.6], fov: 34 });
  return fx(lt, 7, { ent: 0.01, sai: 0.01 }) + marca();
});

const PL = [-3.6, -2.2], PR = [-3.6, -4.4]; // Lucas e Ryan no portão da casa do Ryan
plano('ryan', 'Vai pela rua, hein? Não corta pela trilha da floresta. Minha mãe disse que tem bicho lá.', 8, (lt, c) => {
  quadro(rua(), [
    ['lucas', { t: lt, x: PL[0], z: PL[1], rot: rumo(PL, PR), expr: 'neutro' }],
    ['ryan', { t: lt, x: PR[0], z: PR[1], rot: rumo(PR, PL), expr: 'neutro', fala: falando(c, lt) }],
  ], ombro(PL, PR));
  return fx(lt, 8, { ent: 0.01, sai: 0.01 }) + marca();
});

plano('lucas', 'Relaxa. São cinco minutinhos pela trilha. Até amanhã!', 6, (lt, c) => {
  quadro(rua(), [
    ['lucas', { t: lt, x: PL[0], z: PL[1], rot: rumo(PL, PR), expr: 'sorriso', fala: falando(c, lt) }],
    ['ryan', { t: lt, x: PR[0], z: PR[1], rot: rumo(PR, PL), expr: 'triste', acenar: lt > 3.5 }],
  ], ombro(PR, PL, { atras: 1.3 }));
  return fx(lt, 6, { ent: 0.01 }) + marca();
});

plano('narr', 'Lucas fazia aquele caminho quase todo dia. Mas naquela noite, a floresta estava em silêncio. Silêncio demais.', 9, (lt, c) => {
  const D = c.dur, para = D - 1.1;
  som('galho', para, 1);
  const z = 16 - Math.min(lt, para) * 1.0;
  quadro('floresta', [['lucas', { t: lt, x: 0, z, rot: 180, andar: lt < para ? 1 : 0, expr: lt < para ? 'neutro' : 'surpreso', olhar: lt < para ? undefined : [70, 0] }]],
    { pos: [2.4, 1.5, z + 2.2], alvo: [0, 1.3, z - 1], fov: 40 });
  return fx(lt, D, { sai: 0.01 }) + marca();
});

const PZ = 16 - 7.9; // onde ele parou na trilha
plano('lucas', 'Quem tá aí?', 6, (lt, c) => {
  som('folhas', 2.8, 0.8);
  quadro('floresta', [['lucas', { t: lt, x: 0, z: PZ, rot: 180, expr: 'medo', fala: falando(c, lt), olhar: [60 + Math.sin(lt) * 10, 0] }]],
    camMov(lt, { pos: [-1.0, 1.7, PZ - 2.6], alvo: [0, 1.6, PZ], fov: 38 }, { pos: [-0.8, 1.7, PZ - 2.1], alvo: [0, 1.65, PZ], fov: 34 }, 0, 6));
  return fx(lt, 6, { ent: 0.01, sai: 0.01 }) + marca();
});

plano(null, null, 6, (lt) => {
  som('folhas', 0.8, 1); som('folhas', 3.2, 0.9); som('rosnado', 4.2, 0.6); som('coracao', 0, 0.5);
  const cam = camMov(lt, { pos: [0, 1.65, PZ], alvo: [-14, 1.0, PZ - 6], fov: 40 }, { pos: [-0.6, 1.6, PZ - 0.3], alvo: [-14, 1.0, PZ - 6], fov: 30 }, 0, 6);
  quadro('floresta', [['fera', { t: lt, x: -13, z: PZ - 8, rot: 60, lobo: lt > 4.3 ? 1 : 0, olhar: [0, 0] }]], { ...cam, tremor: 0.015, t: lt });
  return fx(lt, 6, { ent: 0.01, vin: 0.8 }) + marca() + topo([['POV', 54, '#F4EEDC']], lt, 0.1);
});

// =============== 3 · OS OLHOS (1:30–2:20) ===============
const caminho = (k) => [mix(0, -4, k), mix(PZ, PZ - 9, k)]; // da trilha para dentro das árvores
plano('lucas', 'Deve ser só um cachorro… Ei, garoto? Vem cá. Psiu…', 8, (lt, c) => {
  const k = lim((lt - 1) / 7) * 0.35, [x, z] = caminho(k);
  quadro('floresta', [['lucas', { t: lt, x, z, rot: rumo([0, PZ], [-4, PZ - 9]), andar: lt > 1 ? 0.6 : 0, expr: 'medo', fala: falando(c, lt), olhar: [Math.sin(lt * 0.9) * 25, 0] }]],
    { pos: [x + 1.8, 1.9, z + 3.2], alvo: [x - 1, 1.3, z - 2], fov: 38 });
  return fx(lt, 8, { ent: 0.01, sai: 0.01 }) + marca();
});

plano(null, null, 8, (lt) => {
  som('coracao', 0.5, 0.7); som('coracao', 4.5, 0.8); som('galho', 5.5, 0.5);
  const k = 0.35 + lim(lt / 8) * 0.65, [x, z] = caminho(k);
  quadro('floresta', [['lucas', { t: lt, x, z, rot: rumo([0, PZ], [-4, PZ - 9]), andar: 0.6, expr: 'medo', olhar: [Math.sin(lt * 1.3) * 40, 5] }]],
    { pos: [x + 1.2, 1.0, z - 2.8], alvo: [x, 1.6, z], fov: 38 });
  return fx(lt, 8, { ent: 0.01, sai: 0.01, vin: 0.75 }) + marca();
});

const PL3 = [-4, PZ - 9], PF = [-3.6, PZ - 18];
plano(null, null, 6, (lt) => {
  som('impacto', 1.5, 0.9);
  quadro('floresta', [
    ['lucas', { t: lt, x: PL3[0], z: PL3[1], rot: rumo(PL3, PF), expr: 'medo', olhar: [0, 0] }],
    ['fera', { t: lt, x: PF[0], z: PF[1], rot: rumo(PF, PL3), lobo: lt > 1.5 ? 1 : 0, olhar: [0, 0] }],
  ], camMov(lt, ombro(PL3, PF, { atras: 1.2, lado: 0.5, alt: 1.8, altAlvo: 2.2, fov: 34 }), ombro(PL3, PF, { atras: 0.9, lado: 0.4, alt: 1.8, altAlvo: 2.4, fov: 22 }), 1.5, 5.5));
  return fx(lt, 6, { ent: 0.01, sai: 0.01, vin: 0.8 }) + marca();
});

plano('lucas', 'Não… não, não, não.', 5, (lt, c) => {
  const z = PL3[1] + lt * 0.25;
  quadro('floresta', [['lucas', { t: lt, x: PL3[0], z, rot: rumo(PL3, PF), expr: 'medo', fala: falando(c, lt), olhar: [0, 0] }]],
    { ...ombro(PF, [PL3[0], z], { atras: -5.6, lado: 0.2, alt: 1.75, altAlvo: 1.7, fov: 26 }), tremor: 0.02, t: lt });
  return fx(lt, 5, { ent: 0.01, sai: 0.01, vin: 0.8 }) + marca();
});

const zCorre = (lt) => -4 + lt * 2.1;
plano(null, null, 8, (lt) => {
  som('coracao', 0, 1); som('folhas', 1, 0.9); som('folhas', 3.5, 0.9); som('rosnado', 5, 0.7); som('galho', 2.2, 0.6);
  const z = zCorre(lt);
  quadro('floresta', [
    ['lucas', { t: lt, x: 0, z, rot: 0, correr: true, expr: 'medo', olhar: [0, 0] }],
    ['fera', { t: lt, x: Math.sin(lt) * 1.2 - 2, z: z - 9 + lt * 0.3, rot: 0, correr: true, lobo: 1, olhar: [0, 0] }],
  ], { pos: [0.9, 1.5, z + 4], alvo: [0, 1.4, z - 2], fov: 38, tremor: 0.03, t: lt });
  return fx(lt, 8, { ent: 0.01, sai: 0.01, vin: 0.8 }) + marca();
});

const ZL = zCorre(8) + 0.6, ZF = ZL + 3.2;
plano(null, null, 7, (lt) => {
  som('rugido', 1.3, 1); som('impacto', 1.3, 0.8);
  const k = lim((lt - 0.9) / 0.5);
  const fx0 = mix(-7, 0, k), fy = Math.sin(k * Math.PI) * 1.4;
  quadro('floresta', [
    ['lucas', { t: lt, x: 0, z: ZL + Math.min(lt, 0.8) * 1.5 - lim((lt - 1.4) / 2) * 0.8, rot: 0, correr: lt < 0.8, expr: lt < 1.2 ? 'medo' : 'surpreso', bracoE: lt > 1.6 ? [-100, -20] : undefined, bracoD: lt > 1.6 ? [-100, 20] : undefined, olhar: [0, lt > 1.2 ? 15 : 0] }],
    ['fera', { t: lt, x: fx0, y: fy, z: ZF, rot: k < 1 ? 90 + 90 * k : 180, lobo: 1, fala: lt > 1.3 && lt < 3, olhar: [0, -10] }],
  ], { pos: [0.7, 0.8, ZL - 2.6], alvo: [0, 2.2, ZF], fov: 40, tremor: lt > 1.3 && lt < 2.5 ? 0.05 : 0.01, t: lt });
  return fx(lt, 7, { ent: 0.01, sai: 0.01, vin: 0.75 }) + marca();
});

plano(null, null, 8, (lt) => {
  som('rosnado', 0.4, 1); som('rosnado', 3.6, 0.9); som('coracao', 2, 0.7);
  quadro('floresta', [['fera', { t: lt, x: 0, z: ZF, rot: 180, lobo: 1, fala: lt > 0.4 && lt < 2.6 || lt > 3.6 && lt < 5.6, olhar: [0, -12] }]],
    { ...camMov(lt, { pos: [0.6, 1.9, ZF - 5], alvo: [0, 2.3, ZF], fov: 40 }, { pos: [0.3, 2.3, ZF - 3.6], alvo: [0, 2.5, ZF], fov: 36 }, 0, 8), tremor: 0.015, t: lt });
  return fx(lt, 8, { ent: 0.01, sai: 0.01, vin: 0.85 }) + marca();
});

// =============== 4 · O ATAQUE (2:20–3:20) ===============
plano('lucas', 'NÃO!', 3, (lt, c) => {
  som('rugido', 0.5, 1); som('impacto', 1.05, 1);
  const k = lim((lt - 0.6) / 0.45);
  quadro('floresta', [['fera', { t: lt, x: 0, y: Math.sin(k * Math.PI) * 0.6, z: mix(ZF, ZL + 0.3, k * k), rot: 180, lobo: 1, fala: true, bracoE: [-110, -10], bracoD: [-110, 10], olhar: [0, -5] }]],
    { pos: [0, 1.7, ZL - 0.4], alvo: [0, 2.2, ZF], fov: 40, tremor: 0.06, t: lt });
  return vinheta(0.85) + clarao(lt > 1.05 && lt < 1.2 ? 0.9 : 0, '#FFE8E8') + escuro(lt > 1.2 ? 1 : 0) + marca();
}, { semLegenda: false });

plano('narr', 'Ele nunca soube quanto tempo ficou ali, caído no chão. Só lembra da dor no braço… e da lua.', 8, (lt, c) => {
  som('coracao', 0, 0.9); som('coracao', 4, 0.6);
  const t0 = c.w('lua') - 1.2;
  quadro('luaSangue', [], { pos: [0, 0, 10], alvo: [0, 0, -40], fov: mix(34, 26, lim(lt / 8)) });
  return escuro(1 - lim((lt - t0) / 1.5) * 0.9) + vinheta(0.9) + escuro(1 - lim((c.dur - lt) / 0.5));
});

plano(null, null, 8, (lt) => {
  som('coracao', 0, 0.9); som('coracao', 4, 0.9);
  const x = 2 + lt * 2.0;
  quadro(rua(), [['lucas', { t: lt, x, z: 1, rot: 90, correr: true, expr: 'medo', bracoE: [-50, -25], olhar: [0, 0] }]],
    { pos: [x + 3, 1.4, 5.5], alvo: [x, 1.3, 1], fov: 40, tremor: 0.02, t: lt });
  return fx(lt, 8, { ent: 0.6, sai: 0.01 }) + marca();
});

plano('narr', 'A criatura não o seguiu. Como se já tivesse conseguido exatamente o que queria.', 8, (lt, c) => {
  som('rosnado', 5.5, 0.4);
  const vira = lt > 5;
  quadro('floresta', [['fera', { t: lt, x: 0, z: 13 - (vira ? (lt - 5) * 1.2 : 0), rot: vira ? 180 : 0, andar: vira ? 0.8 : 0, lobo: vira ? 0 : 1, olhar: [0, 0] }]],
    camMov(lt, { pos: [1.4, 1.2, 24], alvo: [0, 2.2, 13], fov: 34 }, { pos: [0.8, 1.4, 20], alvo: [0, 2.6, 13], fov: 28 }, 0, 8));
  return fx(lt, 8, { ent: 0.01, sai: 0.01, vin: 0.8 }) + marca();
});

plano('mae', 'Lucas? É você, filho? Tá tudo bem aí?', 8, (lt) => {
  som('porta', 0.1, 1);
  quadro(rua(), [], camMov(lt, { pos: [8.5, 1.8, 7.5], alvo: [6, 2.4, -6], fov: 40 }, { pos: [7.8, 2.0, 4.5], alvo: [6, 2.6, -6], fov: 36 }, 0, 8));
  return fx(lt, 8, { ent: 0.01, sai: 0.01 }) + marca() + topo([['CASA DO LUCAS', 52, '#F4EEDC']], lt, 0.4);
});

plano('lucas', 'Tô… tô sim, mãe. Só tô cansado.', 6, (lt, c) => {
  quadro('quarto', [['lucas', { t: lt * 1.8, x: 3.3, z: 1.8, rot: -90, expr: 'medo', fala: falando(c, lt), olhar: [0, lt > 3 ? 20 : 0] }]],
    camMov(lt, { pos: [0.4, 1.6, 2.4], alvo: [3.3, 1.5, 1.8], fov: 36 }, { pos: [1.2, 1.65, 2.2], alvo: [3.3, 1.6, 1.8], fov: 32 }, 0, 6));
  return fx(lt, 6, { ent: 0.01, sai: 0.01, vin: 0.7 }) + marca();
});

plano('lucas', 'Isso não foi um cachorro. Não pode ter sido. Olha o tamanho disso…', 10, (lt, c) => {
  const k = lim((lt - 0.3) / 1.2);
  quadro('quarto', [['lucasF', { t: lt, x: 1.2, z: 0.4, rot: 180, expr: 'medo', fala: falando(c, lt), bracoE: [mix(0, -30, k), mix(-3, -75, k)], olhar: [-35, 15] }]],
    camMov(lt, { pos: [1.4, 1.7, -2.8], alvo: [1.4, 1.5, 0.4], fov: 40 }, { pos: [1.7, 1.75, -1.7], alvo: [1.7, 1.6, 0.4], fov: 34 }, 0, 10));
  return fx(lt, 10, { ent: 0.01, sai: 0.01, vin: 0.7 }) + marca();
});

plano('narr', 'Naquela noite, Lucas não dormiu. E o arranhão no braço dele… já tinha começado a sumir.', 9, (lt, c) => {
  som('uivo', 5, 0.35);
  quadro(rua(), [], camMov(lt, { pos: [8, 2.2, 9], alvo: [5.5, 3.0, -6], fov: 40 }, { pos: [7.2, 2.5, 4], alvo: [5.2, 2.8, -6], fov: 34 }, 0, 9));
  return fx(lt, 9, { ent: 0.01, sai: 0.6 }) + marca();
});

// =============== 5 · ISABELLA (3:20–4:20) ===============
const ESC = ['aluno1', 'aluno2', 'aluno3', 'aluno4'];
const alunos = (lt, sem = []) => ESC.filter((id) => !sem.includes(id)).map((id, i) => {
  const x0 = [-7, 7, -3, 10][i], z0 = [6, 4, 9, 7][i];
  const p = lim(lt / 9);
  return [id, { t: lt + i, x: mix(x0, i % 2 ? 1.2 : -1.2, p), z: mix(z0, -8.5, p), rot: rumo([x0, z0], [i % 2 ? 1.2 : -1.2, -8.5]), andar: 1 }];
});
plano(null, null, 6, (lt) => {
  som('sino', 0.4, 1);
  quadro('escola', [...alunos(lt), ['sophie', { t: lt, x: -5, z: -4.4, rot: 20, expr: 'neutro', olhar: [10, 10] }]],
    camMov(lt, { pos: [0, 5, 18], alvo: [0, 3, -10], fov: 40 }, { pos: [0, 3.2, 13], alvo: [0, 3, -10], fov: 40 }, 0, 6));
  return fx(lt, 6, { ent: 0.6, sai: 0.01, vin: 0.35 }) + marca() + topo([['NA MANHÃ SEGUINTE', 82]], lt, 0.5);
});

plano('lucas', 'Por que tá tudo tão… alto?', 7, (lt, c) => {
  som('sino', 0.2, 0.7); som('porta', 1.4, 0.6); som('batida', 2.4, 0.6); som('pop', 3.1, 0.6); som('ding', 3.8, 0.5);
  const z = 6 - lt * 0.8;
  quadro('escola', [...alunos(lt + 6), ['lucas', { t: lt, x: 0.5, z, rot: 180, andar: 0.6, expr: 'medo', fala: falando(c, lt), olhar: [Math.sin(lt * 3) * 20, 0] }]],
    { pos: [0.3, 1.8, z - 3.6], alvo: [0.5, 1.5, z], fov: 36, tremor: 0.01, t: lt });
  return vinheta(0.4) + ondas(lt, 540, 700) + marca();
});

const LU = [4.4, -4.4], IS = [6.4, -5.8];
plano('isa', 'Ei… você tá bem? Parece que não dormiu nada.', 7, (lt, c) => {
  quadro('escola', [
    ['lucas', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'triste' }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'neutro', fala: falando(c, lt), olhar: [0, -4] }],
  ], ombro(LU, IS));
  return vinheta(0.35) + marca();
});

plano('lucas', 'É… noite estranha. Desculpa, a gente se conhece?', 6, (lt, c) => {
  quadro('escola', [
    ['lucas', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'neutro', fala: falando(c, lt) }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'surpreso' }],
  ], ombro(IS, LU));
  return vinheta(0.35) + marca();
});

plano('isa', 'Isabella. A gente faz biologia juntos. Eu sento duas fileiras atrás de você… faz um ano.', 7, (lt, c) => {
  quadro('escola', [
    ['lucas', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'surpreso' }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'sorriso', fala: falando(c, lt), olhar: [Math.sin(lt * 0.7) * 6, -4] }],
  ], camMov(lt, ombro(LU, IS, { fov: 30 }), ombro(LU, IS, { fov: 24, atras: 1.3 }), 0, 7));
  return vinheta(0.35) + marca();
});

plano('lucas', 'Ah… foi mal. Eu sou o Lucas.', 5, (lt, c) => {
  quadro('escola', [
    ['lucas', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'sorriso', corar: true, fala: falando(c, lt), olhar: [0, lt < 1 ? 15 : 0] }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'sorriso' }],
  ], ombro(IS, LU, { fov: 26 }));
  return vinheta(0.35) + marca();
});

plano('isa', 'Eu sei.', 5, (lt, c) => {
  const desce = lt > 2.2;
  quadro('escola', [
    ['lucasF', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'sorriso', bracoD: [-20, 0] }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: desce ? 'surpreso' : 'apaixonado', fala: falando(c, lt), olhar: [desce ? 12 : 0, desce ? 25 : -4] }],
  ], camMov(lt, ombro(LU, IS, { fov: 24, atras: 1.3 }), ombro(LU, IS, { fov: 20, atras: 1.2 }), 2, 5));
  return vinheta(0.35) + marca();
});

plano('isa', 'Esse arranhão no seu braço… onde foi isso?', 5, (lt, c) => {
  som('suspense', 1.5, 0.4);
  quadro('escola', [
    ['lucasF', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'surpreso', bracoD: [-35, 0], olhar: [0, 20] }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'bravo', fala: falando(c, lt), olhar: [0, 10] }],
  ], { pos: [LU[0] + 0.9 - 0.9, 1.5, LU[1] + 2.6], alvo: [(LU[0] + IS[0]) / 2, 1.2, (LU[1] + IS[1]) / 2], fov: 34 });
  return vinheta(0.4) + marca();
});

plano('lucas', 'Num galho. Na trilha da floresta.', 5, (lt, c) => {
  const id = lt < 1.2 ? 'lucasF' : 'lucas';
  quadro('escola', [
    [id, { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS), expr: 'triste', fala: falando(c, lt), bracoD: lt < 1.2 ? [-35, 0] : [-10, 0], olhar: [-10, 0] }],
    ['isabella', { t: lt, x: IS[0], z: IS[1], rot: rumo(IS, LU), expr: 'bravo' }],
  ], ombro(IS, LU, { fov: 26 }));
  return vinheta(0.4) + marca();
});

plano('isa', 'Lucas… não volta pra aquela floresta. Principalmente à noite.', 7, (lt, c) => {
  const sai = lim((lt - 5) / 2);
  const ix = IS[0] + sai * 2.5, iz = IS[1] + sai * 2.5;
  quadro('escola', [
    ['lucas', { t: lt, x: LU[0], z: LU[1], rot: rumo(LU, IS) + sai * 30, expr: 'surpreso', olhar: [0, 0] }],
    ['isabella', { t: lt, x: ix, z: iz, rot: sai > 0 ? 45 : rumo(IS, LU), andar: sai > 0 ? 1 : 0, expr: 'triste', fala: falando(c, lt), olhar: [0, -4] }],
    ['sophie', { t: lt, x: 1.5, z: -9.0, rot: 120, expr: 'neutro', olhar: [20, 0] }],
  ], camMov(lt, ombro(LU, IS, { fov: 26 }), ombro(LU, IS, { fov: 36, atras: 2.4, lado: 1.0 }), 4.5, 7));
  return vinheta(0.4) + escuro(1 - lim((c.dur - lt) / 0.6)) + marca();
});

// =============== 6 · O ESPELHO (4:20–5:00) ===============
plano('lucas', 'Eu consigo ouvir… a torneira da cozinha. Lá embaixo.', 7, (lt, c) => {
  [0.6, 1.5, 2.4, 3.3, 4.2, 5.1, 6].forEach((t) => som('pop', t, 0.35)); som('coracao', 0.3, 0.5);
  quadro('quarto', [['lucas', { t: lt, x: -0.8, z: -0.8, rot: 20, expr: 'surpreso', fala: falando(c, lt), olhar: [-25, 18] }]],
    camMov(lt, { pos: [0.2, 1.7, 2.8], alvo: [-0.8, 1.5, -0.8], fov: 38 }, { pos: [-0.1, 1.75, 1.6], alvo: [-0.8, 1.7, -0.8], fov: 30 }, 0, 7));
  return fx(lt, 7, { ent: 0.6, sai: 0.01, vin: 0.7 }) + ondas(lt, 540, 900, '#BFE3FF') + marca();
});

plano('lucas', 'Sumiu. O arranhão… sumiu.', 6, (lt, c) => {
  quadro('quarto', [['lucasC', { t: lt, x: 1.2, z: 0.4, rot: 180, expr: 'surpreso', fala: falando(c, lt), bracoE: [-30, -75], olhar: [-35, 15] }]],
    camMov(lt, { pos: [1.7, 1.75, -1.9], alvo: [1.7, 1.6, 0.4], fov: 34 }, { pos: [1.8, 1.75, -1.4], alvo: [1.8, 1.6, 0.4], fov: 30 }, 0, 6));
  return fx(lt, 6, { ent: 0.01, sai: 0.01, vin: 0.7 }) + marca();
});

const PE = [2.1, -1.6]; // na frente do espelho (parede direita)
const moldura = () => `<rect x="0" y="0" width="1080" height="1920" fill="none" stroke="#3A2414" stroke-width="70"/><rect x="35" y="35" width="1010" height="1850" fill="none" stroke="#7A5434" stroke-width="10"/><path d="M 120 300 L 330 90" stroke="#fff" stroke-width="10" opacity="0.18"/><path d="M 140 420 L 450 110" stroke="#fff" stroke-width="5" opacity="0.12"/>`;
plano(null, null, 4, (lt) => {
  som('coracao', 0, 0.9); som('impacto', 2.2, 1);
  quadro('quarto', [['lucas', { t: lt, x: PE[0], z: PE[1], rot: 90, expr: lt > 2.2 ? 'surpreso' : 'neutro', lobo: lt > 2.2 ? 1 : 0, olhar: [0, 0] }]],
    { pos: [3.7, 1.78, PE[1] - 0.05], alvo: [PE[0], 1.72, PE[1]], fov: 44 });
  return vinheta(0.7) + moldura() + clarao(lt > 2.2 && lt < 2.32 ? 0.6 : 0, '#FFD23A') + marca();
});

plano('lucas', 'O que está acontecendo comigo?', 6, (lt, c) => {
  som('suspense', 2.5, 0.6);
  quadro('quarto', [['lucas', { t: lt, x: PE[0], z: PE[1], rot: 90, expr: 'medo', lobo: 1, fala: falando(c, lt), olhar: [0, 0] }]],
    camMov(lt, { pos: [3.7, 1.78, PE[1] - 0.05], alvo: [PE[0], 1.72, PE[1]], fov: 42 }, { pos: [3.6, 1.76, PE[1] - 0.02], alvo: [PE[0], 1.76, PE[1]], fov: 24 }, 0, 6));
  return vinheta(0.75) + moldura() + escuro(1 - lim((c.dur - lt) / 0.5)) + marca();
});

const PV = [8.6, 3.6];
plano(null, null, 8, (lt) => {
  som('grilos', 0, 0.4); som('uivo', 4.2, 0.9);
  luaRua(set('rua'), [-14, 30, -62]);
  quadro('rua', [['vulto', { t: lt, x: PV[0], z: PV[1], rot: rumo(PV, [6, -6]), lobo: lt > 5 ? 1 : 0, olhar: [0, 0] }]],
    camMov(lt, { pos: [13, 1.5, 13], alvo: [6, 4.5, -6], fov: 42 }, { pos: [11.6, 1.6, 10], alvo: [6, 4.2, -6], fov: 38 }, 0, 8));
  return fx(lt, 8, { ent: 0.6, sai: 0.3, vin: 0.75 }) + marca();
});

plano('isa', 'Se alguém descobrir o que você é… eles vão vir atrás de você.', 8.6, (lt, c) => {
  som('suspense', 0, 0.5); som('rugido', 5.2, 0.7); som('impacto', 6, 1);
  const flash = lt > 5.2 && lt < 5.5;
  if (flash) quadro('floresta', [['fera', { t: lt, x: 0, z: ZF, rot: 180, lobo: 1, fala: true, olhar: [0, -12] }]], { pos: [0.3, 2.3, ZF - 3.6], alvo: [0, 2.5, ZF], fov: 36 });
  else quadro('luaSangue', [], { pos: [0, 0, 10], alvo: [0, 0, -40], fov: 30 });
  let s = flash ? vinheta(0.9) : escuro(0.82) + vinheta(0.9);
  s += topo([['NO PRÓXIMO EPISÓDIO', 74, '#E8102A']], lt, 0.2);
  if (lt > 6) s += `<g opacity="${lim((lt - 6) / 0.4)}"><text x="540" y="900" text-anchor="middle" font-family="Anton, sans-serif" font-size="120" fill="#E8102A" stroke="#1A0004" stroke-width="12" paint-order="stroke" letter-spacing="4">LUA DE SANGUE</text>` +
    `<text x="540" y="990" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="48" fill="#F4EEDC" letter-spacing="5">EPISÓDIO 2 · EM BREVE</text>` +
    `<text x="540" y="1120" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="44" fill="#FFD36A">COMENTA: o que a Isabella sabe?</text>` +
    `<text x="540" y="1190" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="40" fill="#F4EEDC">SEGUE PRA NÃO PERDER O EP. 2</text></g>`;
  return s + (flash ? '' : '') + escuro(1 - lim((c.dur - lt) / 0.4));
}, { legendaY: 1560 });

// Trilha: tensão na noite, mistério/romance na escola, tensão de novo no fim.
window.TRILHA_CENAS = { 0: 'terror', 5: 'misterio', 9: 'terror', 27: 'calma', 29: 'misterio', 37: 'terror' };

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+0%' });

window.CAPA = () => {
  quadro('floresta', [['lucas', { t: 1, x: 0, z: PZ, rot: 180, expr: 'medo', lobo: 1, olhar: [0, 0] }], ['fera', { t: 1, x: -1.6, z: PZ - 4, rot: 0, lobo: 1, olhar: [0, -8] }]],
    { pos: [0.2, 1.8, PZ - 2.6], alvo: [-0.6, 2, PZ], fov: 40 });
  return vinheta(0.7) + `<text x="540" y="280" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#E8102A" stroke="#1A0004" stroke-width="14" paint-order="stroke" letter-spacing="5">LUA DE SANGUE</text>` +
    `<text x="540" y="370" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="52" fill="#F4EEDC" letter-spacing="5">EPISÓDIO 1 · A NOITE DA LUA CHEIA</text>` +
    `<text x="540" y="1700" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke">ELE FOI MORDIDO…</text>`;
};
