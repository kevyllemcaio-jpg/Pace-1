// "E SE A TERRA PARASSE DE GIRAR POR UM SEGUNDO?" — curto, rápido, um corte a cada 2–3 s.
// Escalada: você voa, ônibus/carro/banca voam, prédio parte ao meio, vento, oceano… e quem
// sobra são os pinguins do Polo Sul (lá o chão quase não gira). Roteiro original.
//
// Física conferida:
//  - Velocidade do chão = 1.670 km/h × cos(latitude). São Paulo (23,5°S): ≈ 1.531 km/h ("mil e quinhentos").
//  - Velocidade do som ≈ 1.235 km/h -> "mais rápido que o som".
//  - Maior rajada de vento já medida: 408 km/h (Ilha Barrow, 1996). 1.500/408 ≈ 3,7 -> "quase quatro vezes".
//  - Polo: cos(90°) = 0 -> o chão praticamente não se move.
import * as THREE from 'three';
import { suave, lim, mistura, salto } from '../motor.js';
import { criarPersonagemFlat, M as MT, contornar } from '../personagem-flat.js';
import { criarCidadeSP, onibus, banca } from '../cenarios/cidade-sp.js';
import { carro } from '../mundo.js';
import { luzCinema, rotulo3d, mostrador } from '../estilo-cinema.js';
import { brilho } from '../cenarios/campo-rpg.js';

export const config = {
  velocidade: '+12%',
  ritmo: 'corrido',
  pausa: 0.12,
  voz: 'pt-BR-AntonioNeural',
  legendaTopo: 880,
};

const ESPACO = 5000, POLO = 7000, BAIRRO = 9000;
let semente = 9; const rnd = () => ((semente = (semente * 16807) % 2147483647) / 2147483647); // aleatório fixo (igual em todo render)
const CSS = `<style>.legenda{text-transform:uppercase;font-family:Inter,sans-serif;font-weight:900;font-size:56px}</style>`;

function texturaTerra() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#2A78D0'; g.fillRect(0, 0, 1024, 512);
  const terra = (pts, cor = '#5DB34A') => { g.fillStyle = cor; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); };
  // continentes estilizados (equiretangular)
  terra([[140, 90], [260, 70], [330, 110], [300, 170], [250, 200], [215, 240], [180, 200], [120, 150]]); // América do Norte
  terra([[255, 250], [320, 260], [350, 300], [330, 360], [300, 420], [280, 440], [270, 380], [250, 310]]); // América do Sul
  terra([[480, 90], [560, 70], [600, 110], [560, 140], [500, 150], [470, 120]], '#7CC25A'); // Europa
  terra([[480, 170], [570, 165], [600, 220], [590, 300], [550, 360], [520, 340], [500, 260], [470, 220]], '#C9B266'); // África
  terra([[590, 70], [800, 60], [900, 110], [860, 170], [780, 200], [700, 230], [640, 190], [600, 130]], '#6BBA4E'); // Ásia
  terra([[820, 320], [900, 310], [920, 360], [870, 390], [820, 370]], '#C9A85E'); // Austrália
  g.fillStyle = '#F4F8FC'; g.fillRect(0, 470, 1024, 42); g.fillRect(0, 0, 1024, 18); // polos
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texturaNuvens() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d'); let s = 5; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.35 + r() * 0.4})`; g.beginPath(); g.ellipse(r() * 1024, 60 + r() * 390, 20 + r() * 60, 6 + r() * 14, 0, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function fachada(cor) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256;
  const g = c.getContext('2d'); g.fillStyle = cor; g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 10; j++) { g.fillStyle = (i + j) % 5 ? '#5C6E86' : '#F6D08A'; g.fillRect(8 + i * 30, 6 + j * 25, 20, 15); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

/** Pinguim cartoon (dois tons + contorno). Olha para +z. */
function pinguim(esc = 1) {
  const g = new THREE.Group();
  const m = (geo, cor, pos, sc = [1, 1, 1], rot = [0, 0, 0]) => { const x = new THREE.Mesh(geo, MT(cor)); x.position.set(...pos); x.scale.set(...sc); x.rotation.set(...rot); x.castShadow = true; contornar(x); g.add(x); return x; };
  const corpo = new THREE.Group(); g.add(corpo);
  const add = (geo, cor, pos, sc, rot) => { const x = m(geo, cor, pos, sc, rot); corpo.add(x); return x; };
  add(new THREE.SphereGeometry(0.3, 24, 18), '#1E2430', [0, 0.38, 0], [1, 1.35, 0.95]);
  add(new THREE.SphereGeometry(0.24, 24, 18), '#F6F4EE', [0, 0.34, 0.1], [1, 1.3, 0.8]);
  add(new THREE.SphereGeometry(0.2, 22, 16), '#1E2430', [0, 0.85, 0.02]);
  [-1, 1].forEach((s) => {
    add(new THREE.SphereGeometry(0.075, 14, 10), '#F6F4EE', [s * 0.075, 0.88, 0.15], [1, 1.2, 0.5]);
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#111' })); o.position.set(s * 0.075, 0.89, 0.19); corpo.add(o);
    add(new THREE.CapsuleGeometry(0.05, 0.28, 4, 10), '#1E2430', [s * 0.3, 0.42, 0], [1, 1, 0.5], [0, 0, s * 0.35]);
    add(new THREE.BoxGeometry(0.12, 0.04, 0.16), '#F29A2E', [s * 0.09, 0.02, 0.08]);
  });
  add(new THREE.ConeGeometry(0.05, 0.14, 10), '#F29A2E', [0, 0.83, 0.24], [1, 1, 1], [Math.PI / 2, 0, 0]);
  g.corpo = corpo;
  g.scale.setScalar(esc);
  return g;
}
function coroa() {
  const g = new THREE.Group();
  const ouro = new THREE.MeshStandardMaterial({ color: '#FFC930', metalness: 0.7, roughness: 0.3, emissive: '#5A3A00', emissiveIntensity: 0.4 });
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 24, 1, true), ouro));
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 6), ouro); const a = (i / 6) * Math.PI * 2; p.position.set(Math.cos(a) * 0.12, 0.08, Math.sin(a) * 0.12); g.add(p); }
  g.children[0].material.side = THREE.DoubleSide;
  return g;
}

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 42; camera.near = 0.05; camera.far = 1200; camera.updateProjectionMatrix();
  ctx.sol.shadow.mapSize.set(4096, 4096);
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.3;
  const em = (dx) => { const g = new THREE.Group(); g.position.x = dx; cena.add(g); return g; };

  // ---------- cidade ----------
  criarCidadeSP(ctx);
  const caio = criarPersonagemFlat({ roupa: '#F2B705', calca: '#2F4E7A', cabelo: '#5A3A22', fone: true, escCabeca: 1.15 });
  const povo = [['#3A6EA5', '#8D5524'], ['#C0392B', '#E9A97A'], ['#6B4A8A', '#C98B5E']].map(([roupa, pele]) => criarPersonagemFlat({ roupa, pele, calca: '#2A2A30', escCabeca: 1.15 }));
  cena.add(caio, ...povo);
  const bus = onibus(); const car = carro('#C0392B'); const bnc = banca();
  cena.add(bus, car, bnc);
  const jornais = Array.from({ length: 14 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshBasicMaterial({ color: i % 3 ? '#F4F1EA' : '#E8D9A8', side: THREE.DoubleSide })); cena.add(p); return p; });
  // prédio que parte ao meio (lado esquerdo da avenida)
  // bairro só para o prédio que parte ao meio (sem nada na frente)
  const bairro = em(BAIRRO);
  const chaoB = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), MT('#8A8A92')); chaoB.rotation.x = -Math.PI / 2; chaoB.receiveShadow = true; bairro.add(chaoB);
  [[-16, -40, 40, '#C9B48E'], [14, -45, 55, '#BFC6CF'], [-30, -70, 70, '#D9B98C'], [28, -75, 48, '#B8A487']].forEach(([x, z, h, cor]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(10, h, 10), new THREE.MeshStandardMaterial({ map: fachada(cor), roughness: 0.9 })); m.position.set(x, h / 2, z); bairro.add(m); });
  const predio = new THREE.Group(); predio.position.set(BAIRRO, 0, -25); cena.add(predio);
  const texP = fachada('#D6C3A0');
  const matP = new THREE.MeshStandardMaterial({ map: texP, roughness: 0.9 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(8, 22, 10), matP); base.position.y = 11; base.castShadow = true; predio.add(base);
  const topo = new THREE.Group(); topo.position.y = 22; predio.add(topo);
  const texT = fachada('#D6C3A0'); texT.repeat.set(1, 1.6);
  const top = new THREE.Mesh(new THREE.BoxGeometry(8, 34, 10), new THREE.MeshStandardMaterial({ map: texT, roughness: 0.9 })); top.position.y = 17; top.castShadow = true; topo.add(top);
  const cacos = Array.from({ length: 24 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), MT('#BFAE8E')); cena.add(m); return m; });
  // onda gigante
  const onda = new THREE.Group(); cena.add(onda);
  const agua = new THREE.Mesh(new THREE.BoxGeometry(90, 70, 30), new THREE.MeshStandardMaterial({ color: '#1F6FC0', roughness: 0.25, metalness: 0.1, fog: false, side: THREE.DoubleSide })); agua.position.y = 35; onda.add(agua);
  const espuma = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 90, 24), new THREE.MeshStandardMaterial({ color: '#F2FAFF', fog: false })); espuma.rotation.set(0, 0, Math.PI / 2); espuma.position.set(0, 68, 12); onda.add(espuma);
  // árvores que dobram com o vento (pivô na base)
  const arvs = [[1.4, -6], [1.4, -14], [-6.4, -9]].map(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.4, 8), MT('#6B4A33')); tr.position.y = 1.2; g.add(tr); const cp = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), MT('#4E8A3E')); cp.position.y = 2.9; cp.scale.set(1.3, 0.8, 1); g.add(cp); cena.add(g); return g; });
  // poeira/folhas do vento
  const poeira = Array.from({ length: 90 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshBasicMaterial({ color: i % 2 ? '#7A9A3A' : '#C9B58A', side: THREE.DoubleSide })); cena.add(p); return p; });

  // ---------- espaço ----------
  const esp = em(ESPACO);
  const terra = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 48), new THREE.MeshStandardMaterial({ map: texturaTerra(), roughness: 0.8 }));
  esp.add(terra);
  const nuvens = new THREE.Mesh(new THREE.SphereGeometry(5.08, 64, 48), new THREE.MeshStandardMaterial({ map: texturaNuvens(), transparent: true, depthWrite: false }));
  esp.add(nuvens);
  const atm = brilho('#7FC8FF', 13, 0.3); esp.add(atm);
  const estrelas = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 3000 }, () => (rnd() - 0.5) * 300), 3)), new THREE.PointsMaterial({ color: '#fff', size: 0.35, fog: false }));
  esp.add(estrelas);
  const solEsp = new THREE.DirectionalLight('#ffffff', 3); solEsp.position.set(ESPACO - 20, 10, 20); solEsp.target.position.set(ESPACO, 0, 0); cena.add(solEsp, solEsp.target); solEsp.visible = false;

  // ---------- polo sul ----------
  const polo = em(POLO);
  const gelo = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), MT('#EEF6FC')); gelo.rotation.x = -Math.PI / 2; gelo.receiveShadow = true; polo.add(gelo);
  [[-8, -14, 4], [7, -18, 5], [-18, -30, 7], [16, -34, 6], [0, -45, 9]].forEach(([x, z, s]) => { const b = new THREE.Mesh(new THREE.ConeGeometry(s, s * 1.3, 5), MT('#D6E9F6')); b.position.set(x, s * 0.55, z); b.rotation.y = x; polo.add(b); });
  const pinguins = Array.from({ length: 7 }, (_, i) => { const p = pinguim(i === 0 ? 1.15 : 0.9 + (i % 3) * 0.08); p.position.set(POLO + (i === 0 ? 0 : (i % 2 ? -1 : 1) * (0.9 + Math.floor(i / 2) * 0.8)), 0, i === 0 ? 0 : -0.6 - (i % 3) * 0.5); p.rotation.y = i === 0 ? 0 : (i % 2 ? 0.4 : -0.4); cena.add(p); return p; });
  const crown = coroa(); crown.position.y = 1.1; pinguins[0].corpo.add(crown);
  const gorro = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 16), MT('#D23B2B')); cena.add(gorro);
  const neve = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1500 }, (_, i) => (i % 3 === 0 ? POLO + (rnd() - 0.5) * 20 : i % 3 === 1 ? rnd() * 8 : (rnd() - 0.5) * 20)), 3)), new THREE.PointsMaterial({ color: '#fff', size: 0.06 }));
  cena.add(neve);
  const neveBase = neve.geometry.attributes.position.array.slice();

  let E;
  function inicial() {
    E = { mundo: 'rua', treme: 0, giro: 1 };
    caio.position.set(2.4, 0, -8); caio.rotation.set(0, 0, 0); caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 };
    povo.forEach((p, i) => { p.position.set([2.9, 1.7, 3.2][i], 0, [-30, -34, -38][i]); p.rotation.set(0, i === 2 ? Math.PI : 0, 0); p.estado = { bracos: 'normal', expr: 'neutro', andar: 1 }; });
    bus.position.set(-1.6, 0, -18); bus.rotation.set(0, 0, 0);
    car.position.set(-4.2, 0, -10); car.rotation.set(0, Math.PI, 0);
    bnc.position.set(3.0, 0, -11.5); bnc.rotation.set(0, 0, 0);
    jornais.forEach((j) => (j.visible = false));
    topo.position.set(0, 22, 0); topo.rotation.set(0, 0, 0); cacos.forEach((c) => (c.visible = false));
    onda.visible = false; poeira.forEach((p) => (p.visible = false));
    gorro.visible = false; crown.visible = false; bus.visible = car.visible = bnc.visible = true; arvs.forEach((a) => (a.rotation.z = 0));
    pinguins.forEach((p) => { p.corpo.rotation.set(0, 0, 0); });
  }
  function sempre(t) {
    const centros = { rua: [0, 0, -10], espaco: [ESPACO, 0, 0], polo: [POLO, 0, 0], bairro: [BAIRRO, 0, -20] };
    ctx.centro = centros[E.mundo];
    if (E.mundo === 'espaco') {
      luzCinema(ctx, 'dia'); cena.background = new THREE.Color('#02030A'); cena.fog.near = 500; cena.fog.far = 1200; ctx.hemi.intensity = 0.25; ctx.sol.intensity = 0; solEsp.visible = true;
    } else {
      solEsp.visible = false;
      luzCinema(ctx, E.mundo === 'polo' ? 'dia' : 'tarde');
      if (E.mundo === 'polo') { cena.fog.color.set('#DCEAF6'); cena.fog.near = 20; cena.fog.far = 160; }
    }
    [caio, ...povo].forEach((p) => p.animar(t));
    nuvens.rotation.y = terra.rotation.y * 1.02;
    pinguins.forEach((p, i) => { if (!p.parado) { p.corpo.rotation.z = Math.sin(t * 5 + i) * 0.12; } });
    const a = neve.geometry.attributes.position.array; for (let i = 1; i < a.length; i += 3) a[i] = (((neveBase[i] - t * 0.6) % 8) + 8) % 8; neve.geometry.attributes.position.needsUpdate = true;
  }
  const T = (b, lt) => b.inicio + lt;
  const mao = (pose, k = 1) => (lt, b) => {
    const p = typeof pose === 'function' ? pose(lt, b) : pose; const tt = T(b, lt), tr = E.treme;
    return { pos: p.pos.map((v, i) => v + Math.sin(tt * (0.7 + i * 0.3) + i) * 0.03 * k + (tr ? Math.sin(tt * 57 + i * 2.1) * 0.08 * tr : 0)), alvo: p.alvo };
  };
  const linhas = (lt, forca = 1, cor = 'rgba(255,255,255,.75)') => `<svg style="position:absolute;inset:0;width:720px;height:1280px" viewBox="0 0 720 1280">${Array.from({ length: 16 }, (_, i) => { const y = (i * 83 + 37) % 1280, x = ((lt * 2600 + i * 211) % 1100) - 200; return `<line x1="${x}" y1="${y}" x2="${x + 120 + (i % 4) * 60}" y2="${y}" stroke="${cor}" stroke-width="${3 + (i % 3) * 2}" stroke-linecap="round" opacity="${forca}"/>`; }).join('')}</svg>`;
  const flash = (lt, ini, cor = '#fff', d = 0.25) => (lt > ini && lt < ini + d ? `<div style="position:absolute;inset:0;background:${cor};opacity:${0.8 * (1 - (lt - ini) / d)}"></div>` : '');
  const tela = (lt, b, extra = '') => CSS + `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(10,5,0,.35) 100%)"></div>` + extra;
  const grande = (txt, lt, ini, top = 170, cor = '#fff') => (lt < ini ? '' : `<div style="position:absolute;left:20px;right:20px;top:${top}px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:76px;line-height:1.05;color:${cor};-webkit-text-stroke:13px #111;paint-order:stroke fill;transform:scale(${Math.max(0.01, salto((lt - ini) / 0.3))})">${txt}</div>`);
  // voo: posição ao longo do tempo (x para a direita/leste, sobe um pouco, gira)
  const voo = (obj, p0, k, { vx = 60, vy = 10, giro = 4 } = {}) => { obj.position.set(p0[0] + vx * k, p0[1] + vy * k * (1 - k * 0.3), p0[2]); obj.rotation.set(giro * k * 0.6, 0, -giro * k); };

  const blocos = [
    {
      fala: 'E se a Terra parasse de girar... por um segundo?',
      destaque: ['parasse', 'segundo'],
      camera: (lt, b) => ({ pos: [ESPACO + mistura(2, 0, suave(lt / b.dur)), 1.5, mistura(34, 25, suave(lt / b.dur))], alvo: [ESPACO, 0, 0] }),
      aplicar(lt, b) {
        E.mundo = 'espaco';
        const pare = b.palavra('segundo') - 0.15;
        terra.rotation.y = lt < pare ? T(b, lt) * 2.2 : pare * 2.2 + b.inicio * 2.2;
        E.treme = lt > pare && lt < pare + 0.4 ? 1.5 : 0;
      },
      camada: (lt, b) => tela(lt, b, flash(lt, b.palavra('segundo') - 0.15, '#fff', 0.3) + (lt > b.palavra('segundo') ? grande('⏸ 1 SEGUNDO', lt, b.palavra('segundo'), 200, '#FFD21F') : '')),
      sons: [{ em: () => 0.05, tipo: 'vento' }, { em: 'segundo', depois: -0.15, tipo: 'quebra' }, { em: 'segundo', tipo: 'impacto' }],
    },
    {
      fala: 'Aqui em São Paulo, o chão gira a mil e quinhentos quilômetros por hora.',
      destaque: ['mil', 'quinhentos'],
      corteSeco: true,
      camera: mao(() => { const z = caio.position.z; return { pos: [3.4, 0.9, z + 4.6], alvo: [2.2, 1.6, z - 6] }; }),
      aplicar(lt, b) { E.mundo = 'rua'; E.treme = 0; caio.position.z = mistura(-6, -8, lt / b.dur); },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('mil') ? `<div style="position:absolute;left:0;right:0;top:230px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:84px;color:#FFD21F;-webkit-text-stroke:13px #111;paint-order:stroke fill">${Math.round(1531 * lim((lt - b.palavra('mil')) / 0.9)).toLocaleString('pt-BR')}<span style="font-size:40px"> km/h</span></div><div style="position:absolute;left:0;right:0;top:350px;text-align:center;font-size:70px">➡️</div>` : ''),
      sons: [{ em: 'mil', tipo: 'contador' }],
    },
    {
      fala: 'E você gira junto. Só que se o chão parar... você não para.',
      destaque: ['junto', 'não'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [caio.position.x + 0.4, 1.6, caio.position.z + 2.4], alvo: [caio.position.x, 1.4, caio.position.z] }), 0.5),
      aplicar(lt, b) {
        E.mundo = 'rua'; const k = lim((lt - b.palavra('não') + 0.1) / 0.5);
        caio.position.set(2.4 + k * 1.2, 0, -8); caio.rotation.set(0, 0, -k * 0.6);
        caio.estado = { bracos: k > 0 ? 'cima' : 'celular', expr: lt > b.palavra('parar') ? 'surpreso' : 'neutro', andar: lt < b.palavra('parar') ? 1 : 0 };
        E.treme = lt > b.palavra('parar') && lt < b.palavra('parar') + 0.5 ? 1.2 : 0;
      },
      camada: (lt, b) => tela(lt, b, flash(lt, b.palavra('parar'), '#fff', 0.2)),
      sons: [{ em: 'parar', tipo: 'baque' }, { em: 'não', tipo: 'whoosh' }],
    },
    {
      fala: 'Você sai voando de lado, mais rápido que o som.',
      destaque: ['voando', 'som'],
      corteSeco: true,
      camera: (lt, b) => { const p = caio.position; return { pos: [p.x - 2.2, p.y + 0.5, p.z + 4.2], alvo: [p.x + 0.6, p.y + 0.7, p.z] }; },
      aplicar(lt, b) {
        E.mundo = 'rua'; E.treme = 0.5;
        const k = lt / b.dur; caio.position.set(3.6 + k * 30, 1.2 + k * 9, -8); caio.rotation.set(k * 6, 0, -0.6 - k * 9); caio.estado = { bracos: 'cima', expr: 'medo' };
      },
      camada: (lt, b) => tela(lt, b, linhas(lt) + (lt > b.palavra('som') - 0.2 ? `<div style="position:absolute;left:0;right:0;top:200px;text-align:center;font-family:Inter,sans-serif;font-weight:900;color:#fff;-webkit-text-stroke:10px #111;paint-order:stroke fill;font-size:46px">VOCÊ: <span style="color:#FFD21F">1.531 km/h</span><br>SOM: 1.235 km/h</div>` : '')),
      sons: [{ em: () => 0.05, tipo: 'passagem' }, { em: 'som', tipo: 'impacto' }],
    },
    {
      fala: 'E não é só você. O ônibus.',
      destaque: ['ônibus'],
      corteSeco: true,
      camera: mao({ pos: [3.0, 2.0, -5], alvo: [-1, 2.5, -18] }),
      aplicar(lt, b) { E.treme = 0.4; const k = lim((lt - b.palavra('ônibus') + 0.15) / 2.2); voo(bus, [-1.6, 0, -18], k, { vx: 30, vy: 7, giro: 1.2 }); },
      camada: (lt, b) => tela(lt, b, linhas(lt, 0.6)),
      sons: [{ em: 'ônibus', tipo: 'motor' }, { em: 'ônibus', depois: 0.1, tipo: 'whoosh' }],
    },
    {
      fala: 'O carro.',
      destaque: ['carro'],
      corteSeco: true,
      camera: mao({ pos: [1.5, 1.2, -3], alvo: [-4, 1, -10] }),
      aplicar(lt, b) { const k = lim((lt - 0.05) / 1.8); voo(car, [-4.2, 0, -10], k, { vx: 14, vy: 4, giro: 2.5 }); },
      camada: (lt, b) => tela(lt, b, linhas(lt, 0.6)),
      sons: [{ em: 'carro', tipo: 'vidro' }, { em: 'carro', tipo: 'whoosh' }],
    },
    {
      fala: 'A banca de jornal.',
      destaque: ['banca'],
      corteSeco: true,
      camera: mao({ pos: [-1.5, 1.7, -5.5], alvo: [3, 1.6, -11.5] }),
      aplicar(lt, b) {
        car.visible = bus.visible = false; const k = lim((lt - 0.1) / 1.6); voo(bnc, [3.0, 0, -11.5], k, { vx: 14, vy: 4, giro: 2 });
        jornais.forEach((j, i) => { j.visible = k > 0; const kk = lim(k * 1.2 - i * 0.03); j.position.set(3 + kk * (14 + i), 1 + kk * (2 + (i % 5)), -11.5 + Math.sin(i) * 2); j.rotation.set(T(b, lt) * (3 + i), T(b, lt) * 2, i); });
      },
      camada: (lt, b) => tela(lt, b, linhas(lt, 0.6)),
      sons: [{ em: 'banca', tipo: 'quebra' }],
    },
    {
      fala: 'Os prédios? A base fica... e o topo continua.',
      destaque: ['base', 'topo'],
      corteSeco: true,
      camera: mao({ pos: [BAIRRO - 8, 4, 22], alvo: [BAIRRO + 3, 26, -25] }),
      aplicar(lt, b) {
        E.mundo = 'bairro'; jornais.forEach((j) => (j.visible = false));
        const k = suave((lt - b.palavra('base') - 0.3) / 1.6);
        topo.position.set(k * 18, 22 - k * 3, 0); topo.rotation.set(0, 0, -k * 0.35);
        E.treme = k > 0 && k < 1 ? 1 : 0;
        cacos.forEach((c, i) => { c.visible = k > 0; const kk = lim(k * 1.3 - (i % 6) * 0.05); c.position.set(BAIRRO + kk * (6 + i * 0.7), 22 + Math.sin(i * 3) * 2 - kk * kk * (6 + i % 7), -25 + ((i * 7) % 10) - 5); c.rotation.set(kk * i, kk * 2, 0); });
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'base', tipo: 'martelo' }, { em: 'topo', tipo: 'rachando' }, { em: 'continua', tipo: 'quebra' }],
    },
    {
      fala: 'Aí vem o vento. Porque o ar também não para.',
      destaque: ['vento', 'ar'],
      corteSeco: true,
      camera: mao({ pos: [0, 1.7, 2], alvo: [1, 2, -20] }),
      aplicar(lt, b) {
        E.mundo = 'rua'; E.treme = 0.7; cacos.forEach((c) => (c.visible = false)); bus.visible = car.visible = bnc.visible = false;
        povo.forEach((p, i) => { const k = lim((lt - 0.3 - i * 0.3) / 2.2); p.position.set(mistura(-3, 14, k), k * 4, [-9, -12, -6][i]); p.position.x += [-1, 0.5, -2][i] * (1 - k); p.rotation.set(0, 0, -k * 7); p.estado = { bracos: 'cima', expr: 'medo' }; });
        poeira.forEach((p, i) => { p.visible = true; const x = ((T(b, lt) * 40 + i * 9) % 60) - 30; p.position.set(x, 0.3 + (i % 8) * 0.6, -4 - (i % 10) * 2.5); p.rotation.set(T(b, lt) * 9 + i, i, T(b, lt) * 5); });
      },
      camada: (lt, b) => tela(lt, b, linhas(lt, 1, 'rgba(230,220,200,.8)') + `<div style="position:absolute;inset:0;background:rgba(200,170,120,.18)"></div>`),
      sons: [{ em: 'vento', tipo: 'vento' }, { em: 'ar', tipo: 'passagem' }],
    },
    {
      fala: 'Um vento de mil e quinhentos por hora. Quase quatro vezes o furacão mais forte já medido.',
      destaque: ['quatro', 'furacão'],
      corteSeco: true,
      camera: mao({ pos: [-1, 1.4, 4], alvo: [3, 3, -25] }),
      aplicar(lt, b) {
        E.treme = 0.9; povo.forEach((p) => (p.position.y = -50)); bus.visible = car.visible = bnc.visible = false; arvs.forEach((a, i) => (a.rotation.z = -0.55 - Math.sin(T(b, lt) * 9 + i) * 0.12));
        poeira.forEach((p, i) => { const x = ((T(b, lt) * 55 + i * 9) % 60) - 30; p.position.set(x, 0.3 + (i % 8) * 0.7, -2 - (i % 10) * 2.5); p.rotation.set(T(b, lt) * 9 + i, i, T(b, lt) * 5); });
      },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('quatro')) / 0.8);
        const barras = lt > b.palavra('quatro') - 0.3 ? `<div style="position:absolute;left:70px;right:70px;top:200px;font-family:Inter,sans-serif;font-weight:900;color:#fff;-webkit-text-stroke:8px #111;paint-order:stroke fill;font-size:34px">
          <div>FURACÃO RECORDE · 408 km/h</div><div style="height:34px;width:${27 * k}%;background:#7FC8FF;border:4px solid #111;border-radius:10px;margin:8px 0 22px"></div>
          <div>TERRA PARADA · <span style="color:#FFD21F">1.531 km/h</span></div><div style="height:34px;width:${100 * k}%;background:#FFD21F;border:4px solid #111;border-radius:10px;margin-top:8px"></div></div>` : '';
        return tela(lt, b, linhas(lt, 1, 'rgba(230,220,200,.85)') + `<div style="position:absolute;inset:0;background:rgba(200,170,120,.22)"></div>` + barras);
      },
      sons: [{ em: 'mil', tipo: 'vento' }, { em: 'quatro', tipo: 'pop' }, { em: 'furacão', tipo: 'tensao' }],
    },
    {
      fala: 'E o oceano? Ele ia passar por cima das cidades.',
      destaque: ['oceano', 'cidades'],
      corteSeco: true,
      camera: mao({ pos: [0, 2.2, 10], alvo: [-1.5, 22, -60] }),
      aplicar(lt, b) {
        E.treme = 1; poeira.forEach((p) => (p.visible = false));
        onda.visible = true; const k = lim((lt - 0.1) / (b.dur - 0.2));
        onda.position.set(-2.5, 0, mistura(-230, -30, k)); onda.scale.y = mistura(0.8, 1.3, k); bus.visible = car.visible = bnc.visible = false;
      },
      camada: (lt, b) => tela(lt, b, lt > b.dur - 0.3 ? `<div style="position:absolute;inset:0;background:#1E5FA8;opacity:${(lt - b.dur + 0.3) / 0.3}"></div>` : ''),
      sons: [{ em: 'oceano', tipo: 'splash' }, { em: 'cidades', tipo: 'splash' }, { em: 'cidades', tipo: 'impacto' }],
    },
    {
      fala: 'Em um segundo, quase tudo ia ser varrido do mapa.',
      destaque: ['varrido'],
      corteSeco: true,
      camera: (lt, b) => ({ pos: [ESPACO + 3, 2, mistura(30, 26, suave(lt / b.dur))], alvo: [ESPACO, 0, 0] }),
      aplicar(lt, b) { E.mundo = 'espaco'; E.treme = 0; onda.visible = false; terra.rotation.y = 1.3; nuvens.rotation.y = 1.3 + lim(lt / b.dur) * 1.5; },
      camada: (lt, b) => tela(lt, b, linhas(lt, 0.45)),
      sons: [{ em: 'varrido', tipo: 'passagem' }],
    },
    {
      fala: 'Quase tudo.',
      destaque: ['quase'],
      corteSeco: true,
      pausaDepois: 0.45,
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [ESPACO + 2, mistura(2, -18, k), mistura(26, 14, k)], alvo: [ESPACO, mistura(0, -3, k), 0] }; },
      aplicar(lt, b) { E.mundo = 'espaco'; terra.rotation.y = 1.3; },
      camada: (lt, b) => tela(lt, b, lt > 0.6 ? `<div style="position:absolute;left:0;right:0;top:980px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:44px;color:#fff;-webkit-text-stroke:9px #111;paint-order:stroke fill">⬇ POLO SUL</div>` : ''),
      sons: [{ em: 'quase', tipo: 'tique' }],
    },
    {
      fala: 'Porque no Polo Sul, o chão praticamente não gira.',
      destaque: ['polo', 'não'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [POLO + mistura(-3, -1.6, suave(lt / b.dur)), 1.5, mistura(7.5, 5.5, suave(lt / b.dur))], alvo: [POLO, 0.6, -0.6] })),
      aplicar(lt, b) { E.mundo = 'polo'; pinguins.forEach((p, i) => { p.parado = false; p.position.z = (i === 0 ? 0 : -0.6 - (i % 3) * 0.5) + Math.sin(T(b, lt) * 2 + i) * 0.05; }); },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('gira') ? `<div style="position:absolute;left:0;right:0;top:220px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:80px;color:#7FE0FF;-webkit-text-stroke:13px #111;paint-order:stroke fill">0 km/h</div>` : ''),
      sons: [{ em: 'polo', tipo: 'sino' }, { em: 'gira', tipo: 'pop' }],
    },
    {
      fala: 'Então lá, você só ia sentir... um ventinho.',
      destaque: ['ventinho'],
      corteSeco: true,
      camera: mao({ pos: [POLO + 0.4, 1.2, 3.4], alvo: [POLO + 1.0, 1.0, -0.5] }, 0.5),
      aplicar(lt, b) {
        E.mundo = 'polo';
        const p = pinguins[1]; const k = lim((lt - b.palavra('ventinho')) / 1.0);
        gorro.visible = true; const cab = new THREE.Vector3(); p.corpo.localToWorld(cab.set(0, 1.05, 0));
        gorro.position.set(cab.x + k * 3, cab.y + Math.sin(k * Math.PI) * 0.8, cab.z - k * 1); gorro.rotation.set(0, 0, -k * 6);
        p.parado = k > 0; if (k > 0) p.corpo.rotation.z = -0.1;
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'ventinho', tipo: 'sussurro' }, { em: 'ventinho', depois: 0.3, tipo: 'pop' }],
    },
    {
      fala: 'Ou seja: se a Terra parasse um segundo... os novos donos do planeta seriam os pinguins.',
      destaque: ['donos', 'pinguins'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [POLO + 0.2, mistura(0.6, 0.9, suave(lt / b.dur)), mistura(2.6, 2.0, suave(lt / b.dur))], alvo: [POLO, 1.0, 0] }), 0.4),
      aplicar(lt, b) {
        E.mundo = 'polo'; gorro.visible = false;
        const k = lim((lt - b.palavra('donos')) / 0.6);
        crown.visible = k > 0; crown.position.y = 1.1 + (1 - salto(k)) * 0.8; crown.rotation.y = T(b, lt);
        pinguins.forEach((p, i) => { if (i) { p.parado = lt > b.palavra('pinguins'); if (p.parado) p.corpo.rotation.x = 0.45; } });
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('pinguins') + 0.2 ? grande('👑 OS NOVOS<br><span style="color:#FFD21F">DONOS DA TERRA</span>', lt, b.palavra('pinguins') + 0.2, 190) : ''),
      sons: [{ em: 'donos', tipo: 'brilho' }, { em: 'pinguins', tipo: 'sino' }],
    },
  ];
  blocos[blocos.length - 1].pausaDepois = 1.2;
  return { blocos, inicial, sempre };
}
