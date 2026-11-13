// silvermoon.js — elenco extra e cenários da série LUA DE SANGUE (cidade de Silvermoon).
// Depende de voxel.js. Tudo original: criatura, vulto, figurantes, rua, escola, quarto.

// ---------- elenco extra ----------
const PELO = ['#3A3330', '#4A423C', '#2A2422', '#55493F'];
personagemDef({
  id: 'fera', semente: 9, escala: 1.45, pele: '#3A3330', olhos: '#FF3A1A', corBrilho: '#FF6A1A', cabelo: PELO,
  brilhoX: 1.75, brilhoY: 0.7, brilhoH: 1.2,
  rosto(g, st) {
    px(g, 0, 0, '#3A3330', 16, 16); ruido(g, 16, 16, PELO, 91, 0.5);
    px(g, 2, 5, '#1A1412', 5, 1); px(g, 9, 5, '#1A1412', 5, 1);
    px(g, 3, 6, '#FF4A1A', 3, 2); px(g, 10, 6, '#FF4A1A', 3, 2); px(g, 4, 6, '#FFE0A0'); px(g, 11, 6, '#FFE0A0');
    px(g, 5, 9, '#5A4E46', 6, 7); px(g, 6, 9, '#111111', 4, 2);
    px(g, 5, 14, '#1A0A0A', 6, 2); px(g, 5, 14, '#F4F0E0'); px(g, 10, 14, '#F4F0E0');
    if (st.fala) { px(g, 4, 12, '#3A0A0A', 8, 4); px(g, 5, 12, '#F4F0E0'); px(g, 10, 12, '#F4F0E0'); px(g, 6, 15, '#F4F0E0'); px(g, 9, 15, '#F4F0E0'); }
  },
  // focinho, nariz, orelhas, presas e juba
  blocosCabelo: [[0, -1.8, 5.3, 5, 3, 3, '#4A403A'], [0, -0.6, 6.9, 2.4, 1.2, 0.4, '#111111'], [-3, 5.4, -0.5, 2, 3, 2, '#2A2422'], [3, 5.4, -0.5, 2, 3, 2, '#2A2422'],
    [-1.4, -3.6, 6.4, 0.7, 1.2, 0.5, '#F4F0E0'], [1.4, -3.6, 6.4, 0.7, 1.2, 0.5, '#F4F0E0'], [0, 4.4, -1, 9, 1.2, 7, '#2A2422'], [0, 1, -4.4, 9, 7, 1, '#2A2422']],
  blocosCorpo: [[0, 11, -2.4, 10, 5, 2, '#2A2422'], [0, 12.5, 0, 9.4, 2, 5, '#2A2422']],
  desenhaTronco(g, l) { px(g, 0, 0, '#3A3330', 16, 24); ruido(g, 16, 24, PELO, 92, 0.55); if (l === 'frente') { px(g, 4, 3, '#4E443C', 8, 10); ruido(g, 8, 10, ['#5A4E46'], 93, 0.3); } },
  desenhaBraco(g) { px(g, 0, 0, '#3A3330', 8, 24); ruido(g, 8, 24, PELO, 94, 0.55); px(g, 0, 21, '#1A1412', 8, 3); px(g, 1, 23, '#EDE6D0'); px(g, 3, 23, '#EDE6D0'); px(g, 5, 23, '#EDE6D0'); },
  desenhaPerna(g) { px(g, 0, 0, '#3A3330', 8, 24); ruido(g, 8, 24, PELO, 95, 0.55); px(g, 0, 21, '#1A1412', 8, 3); },
});
// Vulto de capuz (quem observa a casa do Lucas no fim do episódio)
const PRETO = ['#0C0C10', '#121218', '#08080C'];
personagemDef({
  id: 'vulto', semente: 8, pele: '#08080C', olhos: '#08080C', corBrilho: '#CFE4FF', cabelo: PRETO, brilhoY: -0.5, brilhoH: 0.7,
  rosto(g) { px(g, 0, 0, '#06060A', 16, 16); },
  blocosCabelo: [[0, 4.7, 0.4, 9.4, 1.4, 9.6, '#0E0E14'], [-4.6, 0, 0.4, 1.2, 9.4, 9.6, '#0E0E14'], [4.6, 0, 0.4, 1.2, 9.4, 9.6, '#0E0E14'], [0, 0, -4.5, 9.4, 9.4, 1.2, '#0E0E14'], [0, 4.3, 5, 9.4, 1.2, 1.6, '#0E0E14']],
  blocosCorpo: [[0, -3.5, 0, 9, 8, 5, '#0E0E14']],
  desenhaTronco(g) { px(g, 0, 0, '#0E0E14', 16, 24); ruido(g, 16, 24, PRETO, 81, 0.3); },
  desenhaBraco(g) { px(g, 0, 0, '#0E0E14', 8, 24); ruido(g, 8, 24, PRETO, 82, 0.3); },
  desenhaPerna(g) { px(g, 0, 0, '#0E0E14', 8, 24); },
});
// Lucas com a manga puxada e o arranhão no braço
personagemDef({
  ...ELENCO.lucas, id: 'lucasF',
  desenhaBraco(g) {
    px(g, 0, 0, '#26262C', 8, 7); ruido(g, 8, 7, ['#3A3A44', '#4C4C58'], 22, 0.3); px(g, 0, 6, '#1E1E24', 8, 2);
    px(g, 0, 8, '#E8B896', 8, 16); px(g, 0, 23, '#D8A886', 8, 1);
    for (const [x, y] of [[1, 10], [3, 9], [5, 10]]) { px(g, x, y, '#B8282A', 1, 6); px(g, x + 1, y + 1, '#8A1A1A', 1, 4); }
  },
});
// Lucas com a manga puxada e o braço já curado
personagemDef({
  ...ELENCO.lucas, id: 'lucasC',
  desenhaBraco(g) { px(g, 0, 0, '#26262C', 8, 7); ruido(g, 8, 7, ['#3A3A44', '#4C4C58'], 22, 0.3); px(g, 0, 6, '#1E1E24', 8, 2); px(g, 0, 8, '#E8B896', 8, 16); px(g, 0, 23, '#D8A886', 8, 1); },
});
// Figurantes (alunos)
function figurante(id, pele, cabelo, camisa, calca, semente) {
  return personagemDef({
    id, semente, pele, olhos: '#3A2A1A', cabelo: [cabelo, sombrear(cabelo, 1.2), sombrear(cabelo, 0.8)],
    desenhaTronco(g) { px(g, 0, 0, camisa, 16, 24); ruido(g, 16, 24, [sombrear(camisa, 1.1), sombrear(camisa, 0.9)], semente, 0.25); px(g, 0, 21, calca, 16, 3); },
    desenhaBraco(g) { px(g, 0, 0, camisa, 8, 8); px(g, 0, 8, pele, 8, 16); },
    desenhaPerna(g) { px(g, 0, 0, calca, 8, 24); px(g, 0, 21, '#2A2A30', 8, 3); },
  });
}
figurante('aluno1', '#C8906A', '#1E1612', '#C84A3A', '#2A3A5A', 61);
figurante('aluno2', '#F0C8A8', '#C8A050', '#E8E0D0', '#3A3A44', 62);
figurante('aluno3', '#8A5A3C', '#141012', '#3A7A9A', '#2A2A30', 63);
figurante('aluno4', '#E8B896', '#6A3A22', '#9A5AA8', '#2F5FA8', 64);

// ---------- peças de cenário ----------
function bloco(w, h, d, cor, x, y, z, o = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof cor === 'string' ? matCor(cor, o) : cor);
  m.position.set(x, y, z); m.castShadow = o.sombra !== false; m.receiveShadow = true;
  return m;
}
function poste3D(x, z, { luz = true, rot = 0 } = {}) {
  const g = new THREE.Group();
  g.add(bloco(0.2, 4.2, 0.2, '#2A2A30', 0, 2.1, 0));
  g.add(bloco(0.9, 0.15, 0.15, '#2A2A30', 0.4, 4.15, 0));
  g.add(bloco(0.4, 0.25, 0.4, '#FFE6B0', 0.8, 4.0, 0, { emissivo: '#FFD890', sombra: false }));
  if (luz) { const l = new THREE.PointLight('#FFD08A', 6, 9, 1.6); l.position.set(0.8, 3.7, 0); g.add(l); }
  g.position.set(x, 0, z); g.rotation.y = rot;
  return g;
}
function placa3D(texto, w, h, { fundo = '#1E2A4A', cor = '#F4F0E0', tam = 34 } = {}) {
  const tex = textura('placa-' + texto, Math.round(w * 64), Math.round(h * 64), (g, W, H) => {
    g.fillStyle = fundo; g.fillRect(0, 0, W, H);
    g.strokeStyle = cor; g.lineWidth = 6; g.strokeRect(6, 6, W - 12, H - 12);
    g.fillStyle = cor; g.font = `bold ${tam}px Oswald, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(texto, W / 2, H / 2 + 2);
  });
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearFilter;
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.15), [matCor(fundo), matCor(fundo), matCor(fundo), matCor(fundo), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), matCor(fundo)]);
}
// Porta (folha de madeira) para casa3D
function porta3D(x, z, rot = 0) {
  const g = new THREE.Group();
  g.add(bloco(0.9, 1.9, 0.12, '#5A3A22', 0, 0.95, 0));
  g.add(bloco(0.1, 0.1, 0.1, '#D8B860', 0.3, 0.95, 0.1, { sombra: false }));
  g.position.set(x, 0, z); g.rotation.y = rot;
  return g;
}

// ---------- cenários ----------
// Rua de Silvermoon: asfalto no eixo x, calçadas, casas ao fundo (z negativo), postes e a floresta atrás.
function cenarioRua(hora = 'noite', o = {}) {
  const sc = cenaBase(hora);
  sc.add(chao(40, 'grama'));
  const asf = chaoFaixa('asfalto', 80, 4, 0, -0.47); sc.add(asf);
  sc.add(chaoFaixa('calcada', 80, 1.6, -2.8, -0.45)); sc.add(chaoFaixa('calcada', 80, 1.6, 2.8, -0.45));
  for (let x = -38; x < 40; x += 4) sc.add(bloco(1.6, 0.02, 0.15, '#E8D890', x, 0.04, 0, { sombra: false }));
  const casas = o.casas || [[-14, -9, 'madeira'], [-4, -9, 'tijolo'], [6, -9, 'madeira'], [16, -9, 'pedra'], [26, -9, 'tijolo'], [-24, -9, 'tijolo']];
  casas.forEach(([x, z, par], i) => { sc.add(casa3D(x, z, { parede: par, luz: hora !== 'dia', w: 7, d: 6, h: 4 })); sc.add(porta3D(x + 0.5, z + 3.05)); });
  if (o.postes !== false) [-18, -6, 6, 18].forEach((x) => sc.add(poste3D(x, -3.8, { luz: hora !== 'dia' && Math.abs(x) === 6 })));
  sc.add(faixaArvores(-36, 36, -32, -18, 0.55, 7));
  return sc;
}
function faixaArvores(x0, x1, z0, z1, dens, semente) {
  const r = aleatorio(semente), lista = [];
  for (let x = x0; x <= x1; x += 3) for (let z = z0; z <= z1; z += 3) if (r() < dens) lista.push([x + Math.floor(r() * 2), z + Math.floor(r() * 2), 5 + Math.floor(r() * 4), Math.floor(r() * 1000)]);
  return arvores(lista);
}
function chaoFaixa(tipo, w, d, z, y) {
  const t = texBloco(tipo).clone(); t.needsUpdate = true;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w, d);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
  m.rotation.x = -Math.PI / 2; m.position.set(0, y + 0.5, z); m.receiveShadow = true;
  return m;
}
// Trilha na floresta: clareira estreita com caminho de terra no eixo z.
function cenarioFloresta(hora = 'noite', semente = 5) {
  const sc = cenaBase(hora);
  sc.add(chao(40, 'grama'));
  sc.add(chaoFaixa('terra', 2.2, 80, 0, -0.47).rotateZ(0));
  const r = aleatorio(semente), lista = [];
  for (let x = -18; x <= 18; x += 3) for (let z = -36; z <= 28; z += 3) {
    if (Math.abs(x) < 5) continue;
    if (r() < 0.5) lista.push([x + Math.floor(r() * 2), z + Math.floor(r() * 2), 5 + Math.floor(r() * 4), Math.floor(r() * 1000)]);
  }
  sc.add(arvores(lista));
  // arbustos
  const arb = [];
  for (let i = 0; i < 60; i++) { const x = (r() < 0.5 ? -1 : 1) * (3.5 + r() * 5), z = -40 + r() * 70; arb.push([Math.round(x), 0.5, Math.round(z)]); }
  sc.add(blocos('folha', arb));
  return sc;
}
// Escola de Silvermoon (dia): prédio de tijolo, escadas, placa, árvores, bancos.
function cenarioEscola() {
  const sc = cenaBase('dia');
  sc.add(chao(40, 'grama'));
  sc.add(chaoFaixa('calcada', 30, 14, -2, -0.46));
  const W = 26, H = 8, z0 = -10;
  const par = [], vid = [];
  for (let i = 0; i < W; i++) for (let y = 0; y < H; y++) {
    const x = i - W / 2 + 0.5;
    const janela = (y === 2 || y === 5) && i % 3 === 1 && Math.abs(x) > 2.5;
    const porta = Math.abs(x) < 1.6 && y < 3;
    if (porta) continue;
    (janela ? vid : par).push([x, y + 0.5, z0]);
  }
  sc.add(blocos('tijolo', par)); sc.add(blocos('vidro', vid));
  sc.add(bloco(W + 0.6, 0.6, 1.6, '#D8D0C0', 0, H + 0.3, z0));
  sc.add(bloco(W, H, 6, '#8A4232', 0, H / 2, z0 - 3.5));
  sc.add(bloco(3.2, 3, 0.2, '#3A2A22', 0, 1.5, z0 + 0.1));
  const pl = placa3D('ESCOLA SILVERMOON', 7, 1.1, { tam: 40 }); pl.position.set(0, 3.8, z0 + 0.6); sc.add(pl);
  for (let k = 0; k < 3; k++) sc.add(bloco(5 - k * 0.4, 0.2, 0.6, '#C8C0B0', 0, 0.1 + k * 0.2 - 0.0, z0 + 1.6 - k * 0.5));
  sc.add(arvores([[-9, -2, 5, 11], [9, -3, 6, 12], [-12, 4, 5, 13], [13, 3, 5, 14]]));
  const banco = (x, z) => { const g = new THREE.Group(); g.add(bloco(2, 0.15, 0.6, '#9A6A3A', 0, 0.55, 0)); g.add(bloco(0.15, 0.5, 0.5, '#3A3A40', -0.85, 0.25, 0)); g.add(bloco(0.15, 0.5, 0.5, '#3A3A40', 0.85, 0.25, 0)); g.position.set(x, 0, z); return g; };
  sc.add(banco(-5, -5)); sc.add(banco(5, -5));
  // armários na frente do prédio (pátio coberto)
  for (let i = 0; i < 6; i++) sc.add(bloco(0.9, 2, 0.6, i % 2 ? '#3A6A9A' : '#346090', 5.5 + i * 0.95, 1, z0 + 0.5));
  sc.add(faixaArvores(-30, 30, -34, -20, 0.5, 9));
  return sc;
}
// Quarto do Lucas (noite): paredes, cama, escrivaninha com luminária, janela com a lua, espelho, pôsteres.
function cenarioQuarto(o = {}) {
  const sc = new THREE.Scene();
  sc.background = new THREE.Color('#05060C');
  sc.add(new THREE.HemisphereLight('#5A6AB0', '#2A2420', 1.0));
  const fill = new THREE.PointLight('#D8C8B0', 2, 6, 1.5); fill.position.set(2.6, 2.4, -1.6); sc.add(fill);
  const W = 8, D = 7, H = 4;
  const parede = matCor('#3A4566'), madeira = mat('mb-madeira', texBloco('madeira'));
  const t = texBloco('madeira').clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(W, D);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 })); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; sc.add(piso);
  sc.add(bloco(W, H, 0.3, parede, 0, H / 2, -D / 2, { sombra: false }));          // fundo (com janela)
  sc.add(bloco(0.3, H, D, parede, -W / 2, H / 2, 0, { sombra: false }));          // esquerda
  sc.add(bloco(0.3, H, D, parede, W / 2, H / 2, 0, { sombra: false }));           // direita
  sc.add(bloco(W, 0.3, D, '#2A3048', 0, H, 0, { sombra: false }));                // teto
  // janela no fundo com céu noturno e lua
  sc.add(bloco(2.2, 1.6, 0.05, '#0E1A3A', 1.6, 2.4, -D / 2 + 0.17, { emissivo: o.luaSangue ? '#3A0A10' : '#0E1A3A', sombra: false }));
  sc.add(bloco(0.6, 0.6, 0.04, o.luaSangue ? '#FF6A6A' : '#FFF4D6', 2.1, 2.7, -D / 2 + 0.2, { emissivo: o.luaSangue ? '#FF4040' : '#FFF4D6', sombra: false }));
  for (const [w, h, x, y] of [[2.4, 0.12, 1.6, 3.25], [2.4, 0.12, 1.6, 1.55], [0.12, 1.8, 0.4, 2.4], [0.12, 1.8, 2.8, 2.4], [0.1, 1.6, 1.6, 2.4]]) sc.add(bloco(w, h, 0.12, '#E8E0D0', x, y, -D / 2 + 0.22, { sombra: false }));
  const lua = new THREE.DirectionalLight(o.luaSangue ? '#FF6060' : '#9AB8FF', 0.9); lua.position.set(3, 6, -10); lua.target.position.set(0, 0, 0); lua.castShadow = true;
  lua.shadow.mapSize.set(1024, 1024); Object.assign(lua.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); sc.add(lua); sc.add(lua.target);
  // cama
  sc.add(bloco(2.2, 0.5, 3.4, '#5A3A22', -2.6, 0.25, -1.4)); sc.add(bloco(2.1, 0.25, 3.2, '#2A4A8A', -2.6, 0.62, -1.3)); sc.add(bloco(1.4, 0.25, 0.7, '#E8E8F0', -2.6, 0.8, -2.65));
  // escrivaninha + luminária
  sc.add(bloco(2, 0.12, 1, '#7A5434', 2.4, 1.1, 1.2)); sc.add(bloco(0.12, 1.1, 0.9, '#5A3A22', 1.5, 0.55, 1.2)); sc.add(bloco(0.12, 1.1, 0.9, '#5A3A22', 3.3, 0.55, 1.2));
  sc.add(bloco(0.3, 0.3, 0.3, '#FFD890', 3, 1.5, 1.4, { emissivo: '#FFC060', sombra: false }));
  const lamp = new THREE.PointLight('#FFB060', o.lampada === false ? 0 : 5, 9, 1.5); lamp.position.set(2.6, 2, 1.6); lamp.castShadow = false; sc.add(lamp);
  // pôsteres e espelho (parede esquerda)
  sc.add(bloco(0.05, 1.2, 0.9, '#C83A3A', -W / 2 + 0.17, 2.6, 1.2, { sombra: false })); sc.add(bloco(0.05, 0.9, 0.7, '#3A9A5A', -W / 2 + 0.17, 2.4, 2.5, { sombra: false }));
  sc.add(bloco(0.06, 2.4, 1.1, '#9AA8C0', W / 2 - 0.18, 1.7, -1.6, { sombra: false })); sc.add(bloco(0.04, 2.6, 1.3, '#5A3A22', W / 2 - 0.2, 1.7, -1.6, { sombra: false }));
  // porta (parede da frente fica fora do quadro; porta na parede direita)
  sc.add(bloco(0.08, 2.2, 1.1, '#5A3A22', W / 2 - 0.18, 1.1, 1.8, { sombra: false }));
  sc.add(bloco(0.06, 0.1, 0.1, '#D8B860', W / 2 - 0.25, 1.1, 1.4, { sombra: false }));
  sc.fog = new THREE.FogExp2('#05060C', 0.02);
  return { sc, lamp, lua };
}

// ---------- câmera ----------
const suaveC = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const misturaV = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
// Movimento de câmera de A para B ao longo de [t0, t1] (suave).
function camMov(lt, A, B, t0 = 0, t1 = 6) {
  const k = suaveC((lt - t0) / Math.max(0.01, t1 - t0));
  return { pos: misturaV(A.pos, B.pos, k), alvo: misturaV(A.alvo, B.alvo, k), fov: (A.fov || 38) + ((B.fov || A.fov || 38) - (A.fov || 38)) * k };
}
// Sobreposições cinematográficas (vinheta, faixas, grão leve)
function vinheta(forca = 0.55, cor = '#000') {
  return `<defs><radialGradient id="vin" cx="50%" cy="48%" r="70%"><stop offset="0.55" stop-color="${cor}" stop-opacity="0"/><stop offset="1" stop-color="${cor}" stop-opacity="${forca}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vin)"/>`;
}
function escuro(op) { return op > 0.001 ? `<rect width="1080" height="1920" fill="#000" opacity="${Math.min(1, op).toFixed(3)}"/>` : ''; }
function clarao(op, cor = '#fff') { return op > 0.001 ? `<rect width="1080" height="1920" fill="${cor}" opacity="${Math.min(1, op).toFixed(3)}"/>` : ''; }
