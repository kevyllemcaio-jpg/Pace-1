// "E SE UM PIANO CAÍSSE NA SUA CABEÇA?" — visual CINEMA (motion design 3D): São Paulo em 3D com luz
// dourada, neblina, granulado; personagem flat; dados como objetos; depois renasce num reino medieval
// onde todo mundo nasce com uma marca de magia… e a dele é amaldiçoada. História/narração originais.
//
// Física conferida (queda livre):
//  - piano 250 kg, solto a ~30 m (10º andar). Ganha 9,8 m/s (≈35 km/h) por segundo: 1 s ≈ 35 km/h, 2 s ≈ 71 km/h.
//  - Até a cabeça (1,8 m): t ≈ 2,4 s; v ≈ 23,5 m/s ≈ 85 km/h ("mais de 80").
//  - Energia ≈ ½·250·23,5² ≈ 69 kJ = carro de 1 t a ~42 km/h (½·1000·11,7² ≈ 68 kJ) -> "a 40 por hora".
//  - Capacete de obra: ensaio de impacto da ordem de 50 J (≈5 kg de 1 m; ANSI: 3,6 kg de 1,5 m ≈ 54 J).
//    69.000 / 50 ≈ 1.380 -> "mais de mil vezes".
import * as THREE from 'three';
import { suave, lim, mistura, som } from '../motor.js';
import { criarPersonagemFlat, criarBebeFlat } from '../personagem-flat.js';
import { criarCidadeSP, piano3d, balancim, corda } from '../cenarios/cidade-sp.js';
import { criarReino, criarQuartoPedra, maoComMarca, livroAntigo3d, texturaMarca } from '../cenarios/medieval3d.js';
import { luzCinema, brilhoSol, filme, rotulo3d, mostrador } from '../estilo-cinema.js';
import { carro } from '../mundo.js';

export const config = {
  titulo: ['E SE UM *PIANO*', 'CAÍSSE NA SUA', '*CABEÇA*?'],
  qualidade: '2k',
  velocidade: '+10%',
  legendaTopo: 880,
};

const REINO = 1000, QUARTO = 2000, LAB = 3000; // "mundos" lado a lado (x)
const POLIA = [2.2, 35.8, -4];
const Y_PIANO0 = 29.2;           // base do piano pendurado
const T_CAB = 2.4;
const yPiano = (t) => Math.max(1.85, Y_PIANO0 - 4.9 * t * t);
const kmh = (t) => Math.round(9.8 * Math.min(t, T_CAB) * 3.6);

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 40; camera.near = 0.05; camera.far = 600; camera.updateProjectionMatrix();
  const em = (dx) => ({ ...ctx, cena: (() => { const g = new THREE.Group(); g.position.x = dx; cena.add(g); return g; })() });

  // ---------- mundos ----------
  criarCidadeSP(ctx);
  brilhoSol(cena, [-60, 22, -140], 60);
  const reino = criarReino(em(REINO));
  const quarto = criarQuartoPedra(em(QUARTO));
  // laboratório de teste do capacete (sala branca)
  const lab = em(LAB).cena;
  const LM = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
  const pisoLab = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), LM('#E9E9EC')); pisoLab.receiveShadow = true; lab.add(pisoLab);
  const paredeLab = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 0.2), LM('#F4F4F6')); paredeLab.position.set(0, 4, -4); lab.add(paredeLab);
  const pilar = (x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 0.12), LM('#5A5E66')); m.position.set(x, 1.6, 0); m.castShadow = true; return m; };
  lab.add(pilar(-0.6), pilar(0.6));
  const viga = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.12), LM('#5A5E66')); viga.position.set(0, 3.2, 0); lab.add(viga);
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1), LM('#3A3E44')); base.position.y = 0.12; lab.add(base);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), LM('#9AA0A8')); haste.position.y = 0.55; lab.add(haste);
  const cabecaTeste = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), LM('#B9BEC6')); cabecaTeste.position.y = 0.95; lab.add(cabecaTeste);
  const capTeste = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), LM('#F2C200')); capTeste.position.y = 0.98; lab.add(capTeste);
  const peso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 20), LM('#2A2D33')); lab.add(peso);
  const regua = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.02), LM('#F2C200')); regua.position.set(-0.85, 2.1, 0); lab.add(regua);
  const discos = [];
  for (let i = 0; i < 40; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18), LM('#2A2D33')); d.position.set(-1.8 + (i % 4) * 0.4, 0.06 + Math.floor(i / 4) * 0.13, 1); d.visible = false; lab.add(d); discos.push(d); }

  // ---------- elenco ----------
  const caio = criarPersonagemFlat({ roupa: '#F2B705', calca: '#2F4E7A', cabelo: '#5A3A22', fone: true, mochila: true });
  const op1 = criarPersonagemFlat({ roupa: '#2F4E9A', calca: '#2F4E9A', capacete: true, cabeloTipo: 'careca', pele: '#C98B5E' });
  const op2 = criarPersonagemFlat({ roupa: '#2F4E9A', calca: '#2F4E9A', capacete: true, pele: '#E9A97A' });
  const pedestre = criarPersonagemFlat({ roupa: '#3A6EA5', calca: '#2A2A30', pele: '#8D5524', cabelo: '#1A1A1A' });
  cena.add(caio, op1, op2, pedestre);
  const plat = balancim(); plat.position.set(3.35, 28.6, -6.2); plat.rotation.y = -Math.PI / 2; cena.add(plat);
  op1.position.set(3.0, 28.65, -6.8); op1.rotation.y = -0.9; op2.position.set(3.0, 28.65, -5.6); op2.rotation.y = -0.6;
  const piano = piano3d(); piano.rotation.y = -Math.PI / 2; cena.add(piano);
  const cordaSup = corda(POLIA, [2.2, Y_PIANO0 + 1.5, -4]); cena.add(cordaSup);
  const cordaInf = corda([2.2, Y_PIANO0 + 1.5, -4], [2.2, Y_PIANO0 + 1.45, -4]); cena.add(cordaInf);
  const carroBate = carro('#C0392B'); carroBate.position.set(-1.5, 0, -12); carroBate.rotation.y = Math.PI; cena.add(carroBate);
  // medievais
  const aldeoes = [['#8C3B2E', '#5A3A22', 'coque', '#E9A97A'], ['#3E6B4A', '#4A3B33', 'curto', '#C98B5E'], ['#6B4A8A', '#3A2A20', 'careca', '#8D5524'], ['#A0692E', '#3A2A20', 'curto', '#F0C49C']].map(([r, c, cab, pele], i) => {
    const a = criarPersonagemFlat({ roupa: r, calca: c, cabeloTipo: cab, pele }); a.position.set(REINO - 2.2 + i * 1.5, 0, -2 - (i % 2) * 1.2); a.rotation.y = 0.3 - i * 0.2; cena.add(a); return a;
  });
  const mae = criarPersonagemFlat({ roupa: '#7A4A3A', calca: '#5A3A2A', cabeloTipo: 'coque', cabelo: '#3A2418' });
  mae.position.set(QUARTO + 0.6, 0, -1.6); mae.rotation.y = -0.3; cena.add(mae);
  const bebe = criarBebeFlat(); cena.add(bebe);
  const marcaBebe = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshBasicMaterial({ map: texturaMarca('olho'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  marcaBebe.position.set(0, 0.03, 0.105); bebe.add(marcaBebe);
  const luzMarca = new THREE.PointLight('#B44BFF', 0, 0.6, 2); luzMarca.position.set(0, 0.05, 0.4); bebe.add(luzMarca);
  const maos = { chama: maoComMarca('chama'), gota: maoComMarca('gota', { pele: '#C98B5E' }), raio: maoComMarca('raio', { pele: '#8D5524' }) };
  Object.values(maos).forEach((m) => { m.visible = false; cena.add(m); });
  const livro = livroAntigo3d(); livro.position.set(QUARTO, 0.97, -3); cena.add(livro);

  let E;
  function inicial() {
    E = { mundo: 'rua', tf: 0, caiu: false, capacete: false };
    caio.position.set(2.4, 0, -14); caio.rotation.set(0, 0, 0); caio.visible = true;
    caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 };
    pedestre.position.set(2.9, 0, -24); pedestre.estado = { bracos: 'normal', expr: 'neutro', andar: 1 };
    op1.estado = { bracos: 'aponta', expr: 'serio' }; op2.estado = { bracos: 'normal', expr: 'neutro' };
    bebe.visible = false; marcaBebe.material.opacity = 0; luzMarca.intensity = 0;
    Object.values(maos).forEach((m) => (m.visible = false));
    peso.position.set(LAB, 3.0, 0); discos.forEach((d) => (d.visible = false));
  }
  const centro = { rua: [0, 0, -4], reino: [REINO, 0, -20], quarto: [QUARTO, 0, 0], lab: [LAB, 0, 0] };
  function sempre(t) {
    ctx.centro = centro[E.mundo];
    luzCinema(ctx, { rua: 'tarde', reino: 'dia', quarto: 'vela', lab: 'dia' }[E.mundo]);
    // piano: pendurado / caindo / no chão
    const y = E.caiu ? 0.05 : yPiano(E.tf);
    piano.position.set(2.2 + (E.caiu ? 0.15 : 0), y, -4);
    piano.rotation.set(E.tf > 0 && !E.caiu ? E.tf * 0.18 : 0, -Math.PI / 2, E.tf > 0 && !E.caiu ? Math.sin(E.tf * 2) * 0.12 : E.caiu ? 0.06 : 0);
    const solta = E.tf > 0 || E.caiu || E.cortada;
    cordaSup.atualizar(POLIA, solta ? [2.2, POLIA[1] - 1.2, -4] : [2.2, Y_PIANO0 + 1.5, -4]);
    cordaInf.visible = !solta || (E.tf > 0 && E.tf < 0.6);
    cordaInf.atualizar([2.2, y + 1.5 + 1.2, -4], [2.2, y + 1.45, -4]);
    caio.capacete.visible = E.capacete;
    [caio, op1, op2, pedestre, mae, ...aldeoes].forEach((p) => p.animar(t));
    quarto.animar(t);
    if (bebe.visible) bebe.cabeca.rotation.z = Math.sin(t * 1.5) * 0.08;
  }
  const T = (b, lt) => b.inicio + lt;
  // câmera com leve "respiração" de mão (cinema)
  const mao = (pose, k = 1) => (lt, b) => { const p = typeof pose === 'function' ? pose(lt, b) : pose; const tt = T(b, lt); return { pos: p.pos.map((v, i) => v + Math.sin(tt * (0.7 + i * 0.3) + i) * 0.03 * k), alvo: p.alvo }; };
  const anda = (lt, b, z0, z1) => mistura(z0, z1, lt / b.dur);
  const kmhHtml = (t) => `${kmh(t)}<span style="font-size:22px"> km/h</span>`;
  const sobre = (lt, b, extra = '') => filme(T(b, lt)) + extra;

  const blocos = [
    // ===================== PARTE 1 — o piano =====================
    {
      fala: 'E se você estivesse andando pela Avenida Paulista e, do nada, um piano caísse na sua cabeça?',
      destaque: ['paulista', 'piano', 'cabeça'],
      semLegenda: true,
      camera: mao({ pos: [3.3, 0.75, 0.5], alvo: [2.1, 2.6, -14] }),
      aplicar(lt, b) { E.mundo = 'rua'; caio.position.z = anda(lt, b, -7.5, -4.5); caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 }; pedestre.position.z = anda(lt, b, -20, -15); },
      camada: (lt, b) => sobre(lt, b),
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.2, tipo: 'vento' }],
    },
    {
      fala: 'O Caio só tava indo pro trabalho, de fone, mexendo no celular.',
      destaque: ['caio', 'fone', 'celular'],
      corteSeco: true,
      camera: mao((lt, b) => { const z = caio.position.z; return { pos: [2.1, 1.62, z + 1.3], alvo: [2.4, 1.5, z] }; }),
      aplicar(lt, b) { E.mundo = 'rua'; caio.position.z = anda(lt, b, -4.5, -3.2); caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 }; },
      camada: (lt, b) => sobre(lt, b),
    },
    {
      fala: 'Dez andares acima, dois caras içavam um piano até a janela.',
      destaque: ['dez', 'piano'],
      corteSeco: true,
      camera: (lt, b) => { const k = suave(lt / (b.dur * 0.8)); return { pos: [-1.5, mistura(8, 27, k), mistura(4, 2, k)], alvo: [3.5, mistura(12, 30, k), -5] }; },
      aplicar(lt, b) { E.mundo = 'rua'; op1.estado = { bracos: 'aponta', expr: 'serio' }; op2.estado = { bracos: 'normal', expr: 'neutro' }; },
      camada: (lt, b) => sobre(lt, b),
      sons: [{ em: 'piano', tipo: 'martelo' }],
    },
    {
      fala: 'Aí, a corda arrebentou. Duzentos e cinquenta quilos no ar.',
      destaque: ['arrebentou', 'duzentos'],
      corteSeco: true,
      camera: mao((lt, b) => (lt < b.palavra('duzentos') ? { pos: [0.6, 34.6, -1.6], alvo: [2.2, 35.6, -4] } : { pos: [-0.6, 29.6, 0.5], alvo: [2.4, 29.6, -4.5] }), 0.6),
      aplicar(lt, b) {
        E.mundo = 'rua';
        const corte = b.palavra('arrebentou') + 0.15;
        E.cortada = lt > corte;
        E.tf = lt > b.palavra('duzentos') ? 0.04 * lim((lt - b.palavra('duzentos')) / 1) : 0;
        const medo = lt > corte;
        op1.estado = { bracos: medo ? 'cabeca' : 'aponta', expr: medo ? 'medo' : 'serio' }; op2.estado = { bracos: medo ? 'cima' : 'normal', expr: medo ? 'medo' : 'neutro' };
      },
      camada: (lt, b) => sobre(lt, b, som(lt, b.palavra('arrebentou') + 0.15, 'TÉC!', 1.0)),
      sons: [{ em: 'arrebentou', depois: 0.15, tipo: 'quebra' }],
    },
    {
      fala: 'No primeiro segundo, ele já tá a trinta e cinco por hora.',
      destaque: ['primeiro', 'trinta'],
      camera: mao((lt, b) => { const y = yPiano(E.tf); return { pos: [-0.2, y + 0.5, -0.6], alvo: [2.2, y + 0.4, -4] }; }, 0.5),
      aplicar(lt, b) { E.mundo = 'rua'; E.cortada = true; E.tf = mistura(0.04, 1.0, lt / b.dur); },
      camada: (lt, b) => sobre(lt, b, rotulo3d(camera, [2.2, yPiano(E.tf) + 1.8, -4], kmhHtml(E.tf), { dx: 40, dy: -20 })),
      sons: [{ em: () => 0.1, tipo: 'passagem' }],
    },
    {
      fala: 'No segundo seguinte, setenta.',
      destaque: ['setenta'],
      camera: mao((lt, b) => { const y = yPiano(E.tf); return { pos: [-0.4, y - 0.8, -0.2], alvo: [2.2, y + 0.6, -4] }; }, 0.5),
      aplicar(lt, b) { E.mundo = 'rua'; E.cortada = true; E.tf = mistura(1.0, 2.0, lt / b.dur); },
      camada: (lt, b) => sobre(lt, b, rotulo3d(camera, [2.2, yPiano(E.tf) + 1.8, -4], kmhHtml(E.tf), { dx: 40, dy: -20 })),
      sons: [{ em: 'setenta', tipo: 'dia' }],
    },
    {
      fala: 'É a gravidade somando velocidade o caminho inteiro.',
      destaque: ['gravidade'],
      corteSeco: true,
      camera: mao({ pos: [-4.5, 3, 10], alvo: [2.2, 14, -6] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.cortada = true; E.tf = mistura(2.0, 2.12, lt / b.dur); caio.position.z = -5.2; caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 }; },
      camada: (lt, b) => {
        const v = new THREE.Vector3(2.2, yPiano(E.tf), -4).project(camera);
        const x = (v.x + 1) * 360 + 70, y = (1 - v.y) * 640;
        const seta = `<svg style="position:absolute;inset:0;width:720px;height:1280px" viewBox="0 0 720 1280"><line x1="${x}" y1="${y - 60}" x2="${x}" y2="${y + 110}" stroke="#E0463A" stroke-width="6"/><path d="M${x - 14} ${y + 100} L${x} ${y + 130} L${x + 14} ${y + 100} Z" fill="#E0463A"/></svg>`;
        return sobre(lt, b, seta + rotulo3d(camera, [2.2, yPiano(E.tf) + 1.8, -4], kmhHtml(E.tf), { dx: -80, dy: -20 }));
      },
    },
    {
      fala: 'Em dois segundos e meio, ele chega lá embaixo a mais de oitenta por hora.',
      destaque: ['dois', 'oitenta'],
      corteSeco: true,
      camera: mao({ pos: [2.4, 0.35, 1.2], alvo: [2.2, 9, -4.5] }, 0.4),
      aplicar(lt, b) { E.mundo = 'rua'; E.cortada = true; E.tf = mistura(2.12, 2.36, lt / b.dur); caio.position.z = mistura(-5.2, -4.3, lt / b.dur); caio.rotation.y = Math.PI; caio.estado = { bracos: 'celular', expr: 'neutro', andar: 1 }; },
      camada: (lt, b) => sobre(lt, b, rotulo3d(camera, [2.2, yPiano(E.tf) + 1.8, -4], kmhHtml(E.tf), { dx: 60, dy: 0 })),
      sons: [{ em: 'oitenta', tipo: 'tensao' }],
    },
    {
      fala: 'Tá, mas e o peso?',
      destaque: ['peso'],
      corteSeco: true,
      camera: mao({ pos: [1.6, 1.1, 3.0], alvo: [2.2, 1.6, -4] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.cortada = true; E.tf = 2.2; caio.position.z = -4.3; caio.rotation.y = 0; caio.estado = { bracos: 'celular', expr: 'neutro', andar: 0 }; },
      camada: (lt, b) => sobre(lt, b, mostrador(360, 300, 250 * lim(lt / 0.8), 300, `${Math.round(250 * lim(lt / 0.8))}`, { unidade: ' kg' })),
      sons: [{ em: 'peso', tipo: 'pop' }],
    },
    {
      fala: 'Duzentos e cinquenta quilos a oitenta por hora têm a mesma energia de um carro de uma tonelada batendo a quarenta por hora.',
      destaque: ['energia', 'carro', 'quarenta'],
      corteSeco: true,
      camera: mao({ pos: [1.6, 1.4, -5], alvo: [-1.5, 0.9, -16] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.tf = 2.36; carroBate.position.z = mistura(-18, -13, suave(lt / b.dur)); },
      camada: (lt, b) => sobre(lt, b, lt > b.palavra('carro') ? mostrador(360, 300, 40 * lim((lt - b.palavra('carro')) / 1), 100, `${Math.round(40 * lim((lt - b.palavra('carro')) / 1))}`, { unidade: ' km/h' }) : mostrador(360, 300, 250, 300, '250', { unidade: ' kg' })),
      sons: [{ em: 'carro', tipo: 'motor' }, { em: 'quarenta', tipo: 'baque' }],
    },
    {
      fala: 'E se ele tivesse de capacete?',
      destaque: ['capacete'],
      corteSeco: true,
      camera: mao({ pos: [2.1, 1.7, -2.9], alvo: [2.3, 1.62, -4.3] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.tf = 2.0; E.capacete = true; caio.position.z = -4.3; caio.estado = { bracos: 'celular', expr: 'feliz', andar: 0 }; },
      camada: (lt, b) => sobre(lt, b),
      sons: [{ em: 'capacete', tipo: 'plim' }],
    },
    {
      fala: 'Capacete de obra é testado com uns cinquenta joules de impacto.',
      destaque: ['cinquenta', 'joules'],
      corteSeco: true,
      camera: mao({ pos: [LAB + 1.2, 1.8, 3.2], alvo: [LAB, 1.4, 0] }),
      aplicar(lt, b) { E.mundo = 'lab'; const q = b.palavra('cinquenta'); peso.position.set(LAB, lt < q ? 3.0 : Math.max(1.3, 3.0 - 9.8 * (lt - q) ** 2), 0); },
      camada: (lt, b) => sobre(lt, b, rotulo3d(camera, [LAB, 2.2, 0], lt > b.palavra('cinquenta') ? '≈ 50<span style="font-size:22px"> J</span>' : '', { dx: 120, dy: 0 })),
      sons: [{ em: 'cinquenta', depois: 0.5, tipo: 'baque' }],
    },
    {
      fala: 'Esse piano chega com mais de mil vezes isso.',
      destaque: ['mil'],
      camera: mao({ pos: [LAB - 0.6, 2.4, 5.2], alvo: [LAB - 0.6, 1.6, 0.5] }),
      aplicar(lt, b) { E.mundo = 'lab'; peso.position.set(LAB, 1.3, 0); discos.forEach((d, i) => (d.visible = i < 40 * lim(lt / (b.dur * 0.7)))); },
      camada: (lt, b) => sobre(lt, b, rotulo3d(camera, [LAB - 1.2, 2.2, 1], `×${Math.round(1380 * lim(lt / (b.dur * 0.7))).toLocaleString('pt-BR')}`, { dx: 0, dy: -60 })),
      sons: [0.2, 0.5, 0.8, 1.1].map((d) => ({ em: () => d, tipo: 'tique' })).concat([{ em: 'mil', tipo: 'dia' }]),
    },
    {
      fala: 'Não ia adiantar nada.',
      corteSeco: true,
      camera: (lt) => ({ pos: [3.4 + Math.sin(lt * 60) * 0.05 * (1 - lim(lt / 0.7)), 0.5, 1.4], alvo: [2.2, 0.5, -4] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.caiu = true; E.capacete = false; caio.visible = false; },
      camada: (lt, b) => {
        // capacete amassado rolando + poeira
        const v = new THREE.Vector3(3.0 + lim(lt / 1.2) * 0.6, 0.12, -3.2).project(camera);
        const x = (v.x + 1) * 360, y = (1 - v.y) * 640;
        const cap = `<svg style="position:absolute;inset:0;width:720px;height:1280px" viewBox="0 0 720 1280"><g transform="translate(${x},${y}) rotate(${lt * 200})"><path d="M-40 10 Q-36 -36 0 -40 Q36 -36 40 10 Z" fill="#F2C200" stroke="#B88F00" stroke-width="3"/><path d="M-10 -38 l8 18 l-14 10" fill="none" stroke="#7A5E00" stroke-width="3"/></g>
          ${[0, 1, 2, 3, 4, 5].map((k) => { const a = k * 1.05, u = lim(lt / 1.2); return `<circle cx="${360 + Math.cos(a) * (60 + u * 160)}" cy="${760 - Math.abs(Math.sin(a)) * u * 120}" r="${30 + u * 40}" fill="#D9C7A8" opacity="${(0.55 * (1 - u)).toFixed(2)}"/>`; }).join('')}</svg>`;
        return sobre(lt, b, cap + `<div style="position:absolute;inset:0;background:#fff;opacity:${0.8 * (1 - lim(lt / 0.15))}"></div>`);
      },
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.04, tipo: 'quebra' }, { em: () => 0.3, tipo: 'baque' }],
    },
    {
      fala: 'Muita gente acha que isso seria o fim. Mas não pro Caio.',
      destaque: ['fim', 'caio'],
      corteSeco: true,
      camera: (lt, b) => ({ pos: [2.2, mistura(6, 18, suave(lt / b.dur)), -4.01], alvo: [2.2, 0, -4] }),
      aplicar(lt, b) { E.mundo = 'rua'; E.caiu = true; caio.visible = false; },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('mas')) / 0.4);
        const luz = `<div style="position:absolute;inset:0;background:#000;opacity:${k}"></div><svg style="position:absolute;inset:0;width:720px;height:1280px;opacity:${k}" viewBox="0 0 720 1280"><defs><radialGradient id="lz"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".25" stop-color="#FFD98A" stop-opacity=".8"/><stop offset="1" stop-color="#FFB050" stop-opacity="0"/></radialGradient></defs><circle cx="360" cy="560" r="${120 + 220 * lim((lt - b.palavra('mas')) / 1.5)}" fill="url(#lz)"/>${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="360" y1="560" x2="${360 + Math.cos(a) * 520}" y2="${560 + Math.sin(a) * 520}" stroke="#FFE6A8" stroke-width="3" opacity=".35"/>`; }).join('')}</svg>`;
        return filme(T(b, lt)) + luz;
      },
      sons: [{ em: 'mas', tipo: 'brilho' }, { em: 'caio', tipo: 'subida' }],
    },
    // ===================== PARTE 2 — o reino =====================
    {
      fala: 'Ele acordou bebê, num reino medieval.',
      destaque: ['bebê', 'medieval'],
      corteSeco: true,
      camera: (lt, b) => ({ pos: [REINO + mistura(-30, -20, lt / b.dur), 26, 40], alvo: [REINO, 12, -70] }),
      aplicar() { E.mundo = 'reino'; },
      camada: (lt, b) => sobre(lt, b),
      sons: [{ em: () => 0.1, tipo: 'sino' }],
    },
    {
      fala: 'Lá, todo mundo nasce com uma marca no corpo. E a marca mostra qual magia você tem.',
      destaque: ['marca', 'magia'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [REINO + mistura(-1, 1, lt / b.dur), 1.6, 5], alvo: [REINO, 1.3, -3] })),
      aplicar(lt, b) { E.mundo = 'reino'; aldeoes.forEach((a, i) => (a.estado = { bracos: i === 1 && lt > b.palavra('marca') ? 'mao' : 'normal', expr: i % 2 ? 'feliz' : 'neutro', andar: i === 3 ? 0.6 : 0 })); },
      camada: (lt, b) => sobre(lt, b),
    },
    {
      fala: 'Uma chama, é fogo. Uma gota, água. Um raio, trovão.',
      destaque: ['fogo', 'água', 'trovão'],
      corteSeco: true,
      camera: { pos: [REINO, 1.5, 5.6], alvo: [REINO, 1.5, 0] },
      aplicar(lt, b) {
        E.mundo = 'reino';
        const qual = lt < b.palavra('gota') - 0.1 ? 'chama' : lt < b.palavra('raio') - 0.1 ? 'gota' : 'raio';
        Object.entries(maos).forEach(([k, m]) => { m.visible = k === qual; m.position.set(REINO, 1.45, 2.8); m.rotation.set(0, 0, Math.sin(T(b, lt) * 1.2) * 0.05); m.marca.material.opacity = 0.75 + 0.25 * Math.sin(T(b, lt) * 5); });
      },
      camada: (lt, b) => sobre(lt, b),
      sons: [{ em: 'chama', tipo: 'fogo' }, { em: 'gota', tipo: 'splash' }, { em: 'raio', tipo: 'zap' }],
    },
    {
      fala: 'A do Caio apareceu no peito. Preta. Em forma de olho.',
      destaque: ['peito', 'preta', 'olho'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [QUARTO + 0.35, mistura(1.9, 1.62, suave(lt / b.dur)), mistura(1.4, 0.3, suave(lt / b.dur))], alvo: [QUARTO + 0.45, 1.25, -1.25] }), 0.4),
      aplicar(lt, b) {
        E.mundo = 'quarto';
        Object.values(maos).forEach((m) => (m.visible = false));
        mae.estado = { bracos: 'mao', expr: lt > b.palavra('preta') ? 'medo' : 'feliz' };
        bebe.visible = true; bebe.position.set(QUARTO + 0.45, 1.15, -1.2); bebe.rotation.set(-1.1, 0.25, 0);
        const k = lim((lt - b.palavra('peito')) / 0.8);
        marcaBebe.material.opacity = k * (0.8 + 0.2 * Math.sin(T(b, lt) * 6)); luzMarca.intensity = 0.2 * k;
      },
      camada: (lt, b) => filme(T(b, lt), { tom: 'rgba(255,140,60,.12)' }),
      sons: [{ em: 'peito', tipo: 'impacto' }, { em: 'olho', tipo: 'tensao' }],
    },
    {
      fala: 'No livro mais antigo do reino, ela tinha um nome só: a marca do fim.',
      destaque: ['livro', 'fim'],
      corteSeco: true,
      camera: (lt, b) => ({ pos: [QUARTO + 0.1, mistura(3.4, 2.9, suave(lt / b.dur)), mistura(-1.0, -1.4, suave(lt / b.dur))], alvo: [QUARTO, 0.97, -3] }),
      aplicar() { E.mundo = 'quarto'; bebe.visible = false; },
      camada: (lt, b) => filme(T(b, lt), { tom: 'rgba(255,140,60,.12)' }),
      sons: [{ em: 'livro', tipo: 'passagem' }, { em: 'fim', tipo: 'impacto' }],
    },
    {
      fala: 'Parte dois?',
      semLegenda: true,
      corteSeco: true,
      camera: mao({ pos: [QUARTO + 0.45, 1.5, -0.55], alvo: [QUARTO + 0.45, 1.2, -1.2] }, 0.3),
      aplicar(lt, b) { E.mundo = 'quarto'; bebe.visible = true; bebe.position.set(QUARTO + 0.45, 1.15, -1.2); bebe.rotation.set(-1.1, 0.25, 0); marcaBebe.material.opacity = 0.85 + 0.15 * Math.sin(T(b, lt) * 6); luzMarca.intensity = 0.25; mae.estado = { bracos: 'mao', expr: 'medo' }; },
      camada: (lt, b) => filme(T(b, lt), { tom: 'rgba(255,140,60,.12)' }) + `<div style="position:absolute;left:0;right:0;top:880px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:46px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.6);opacity:${lim(lt / 0.3)}">PARTE <span style="color:#FFC21A">2?</span></div>`,
      sons: [{ em: () => 0.05, tipo: 'sino' }],
    },
  ];

  return { blocos, inicial, sempre };
}
