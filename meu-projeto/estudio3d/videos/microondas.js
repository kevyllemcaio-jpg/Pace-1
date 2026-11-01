// VÍDEO: "Como o micro-ondas esquenta sem fogo?"
// Fatos conferidos:
//  - O magnetron gera micro-ondas de ~2,45 GHz (2,45 bilhões de oscilações por segundo).
//  - As ondas fazem as moléculas de água girarem para acompanhar o campo; o atrito vira calor
//    (aquecimento dielétrico). Não é "de dentro pra fora": aquece as camadas que as ondas alcançam.
//  - Ondas refletem no metal e formam ondas estacionárias → pontos quentes e frios → prato giratório.
//  - Comprimento de onda ≈ 12 cm; a tela da porta tem furos de poucos milímetros: bloqueia as
//    micro-ondas e deixa a luz passar.
//  - Pontas de metal (garfo) concentram o campo elétrico e podem gerar faíscas.
import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarCozinha } from '../cenarios/cozinha.js';

export const config = {
  titulo: ['COMO O', '*MICRO-ONDAS*', 'ESQUENTA', 'SEM *FOGO*?'],
  tituloEstilo: 'meio',
};

const B = 1.25;                     // base do micro-ondas (em cima do armário)
const CX = -0.16, CY = B + 0.06;    // centro do prato
const PX = 0.8, PZ = 0.6;           // personagem

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));
  criarCozinha(ctx);
  // armário-torre
  cena.add(caixa(1.4, B, 0.7, mat('#B98A5C'), [0, B / 2, 0]));
  cena.add(caixa(1.3, 0.9, 0.02, mat('#C99B6D'), [0, 0.6, 0.36]));

  // ---------- micro-ondas ----------
  const mo = new THREE.Group();
  const casca = C('#E9EEF4', { duplo: true, metal: true });
  mo.add(caixa(1.12, 0.04, 0.72, casca, [0, B + 0.02, 0]));          // fundo
  mo.add(caixa(1.12, 0.04, 0.72, casca, [0, B + 0.62, 0]));          // teto
  mo.add(caixa(0.04, 0.62, 0.72, casca, [-0.56, B + 0.32, 0]));      // esquerda
  mo.add(caixa(0.04, 0.62, 0.72, casca, [0.56, B + 0.32, 0]));       // direita
  mo.add(caixa(1.12, 0.62, 0.04, mat('#C9D0DA', { metal: true }), [0, B + 0.32, -0.34])); // fundo (interno)
  mo.add(caixa(0.03, 0.58, 0.68, mat('#C9D0DA', { metal: true, duplo: true }), [0.22, B + 0.32, 0])); // divisória
  // porta com tela (textura de furinhos)
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 160;
  const g2 = cv.getContext('2d');
  g2.fillStyle = '#1A1D24'; g2.fillRect(0, 0, 256, 160);
  g2.fillStyle = '#6B7380';
  for (let x = 4; x < 256; x += 9) for (let y = 4; y < 160; y += 9) { g2.beginPath(); g2.arc(x, y, 2.6, 0, Math.PI * 2); g2.fill(); }
  const texTela = new THREE.CanvasTexture(cv);
  const porta = new THREE.Group();
  porta.add(caixa(0.78, 0.6, 0.03, C('#2A2D33'), [0, 0, 0]));
  const vidro = malha(new THREE.PlaneGeometry(0.6, 0.42), cortavel(new THREE.MeshStandardMaterial({ map: texTela, transparent: true, opacity: 0.88 })), { sombra: false });
  vidro.position.z = 0.017;
  porta.add(vidro);
  porta.position.set(-0.17, B + 0.32, 0.37);
  mo.add(porta);
  // painel
  mo.add(caixa(0.3, 0.58, 0.03, C('#3D434C'), [0.39, B + 0.32, 0.37]));
  mo.add(caixa(0.2, 0.08, 0.02, C('#7FD6FF', { emissivo: '#1E6FA8' }), [0.39, B + 0.5, 0.39]));
  for (let i = 0; i < 6; i++) mo.add(caixa(0.07, 0.05, 0.02, C('#9AA3AE'), [0.34 + (i % 2) * 0.1, B + 0.38 - Math.floor(i / 2) * 0.08, 0.39]));
  // magnetron + guia de onda (no compartimento da direita)
  const magnetron = new THREE.Group();
  magnetron.add(cilindro(0.09, 0.16, mat('#C77B3A', { metal: true }), [0, 0, 0], 12));
  for (let i = 0; i < 5; i++) magnetron.add(caixa(0.24, 0.012, 0.24, mat('#9AA3AE', { metal: true }), [0, -0.06 + i * 0.03, 0]));
  magnetron.position.set(0.39, B + 0.3, -0.05);
  mo.add(magnetron);
  const guia = caixa(0.3, 0.08, 0.12, mat('#9AA3AE', { metal: true }), [0.28, B + 0.5, -0.05]);
  mo.add(guia);
  // lâmpada interna
  const lampada = new THREE.PointLight('#FFE9A0', 0, 1.6, 1.4);
  lampada.position.set(-0.2, B + 0.55, -0.1);
  mo.add(lampada);
  cena.add(mo);

  // prato giratório + tigela + comida com pontos quentes/frios
  const prato = new THREE.Group();
  prato.position.set(CX, CY, -0.02);
  prato.add(cilindro(0.27, 0.015, mat('#DDEFFA', { opacidade: 0.75, brilho: true, unico: true }), [0, 0, 0], 24));
  const tigela = malha(new THREE.CylinderGeometry(0.17, 0.12, 0.13, 16, 1, true), mat('#F2F2F2', { duplo: true }));
  tigela.position.y = 0.075;
  prato.add(tigela, cilindro(0.12, 0.01, mat('#F2F2F2'), [0, 0.012, 0], 16));
  const sopa = cilindro(0.155, 0.02, mat('#E07B39', { unico: true }), [0, 0.11, 0], 16);
  prato.add(sopa);
  const manchas = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    const m = cilindro(0.045, 0.005, mat(i % 2 ? '#FF4A1C' : '#4FA8FF', { unico: true, emissivo: i % 2 ? '#7A1A00' : '#0E3C7A' }), [Math.cos(a) * 0.09, 0.122, Math.sin(a) * 0.09], 10);
    prato.add(m);
    return m;
  });
  // garfo
  const garfo = new THREE.Group();
  garfo.add(caixa(0.012, 0.012, 0.16, mat('#C3C9D2', { metal: true })), ...[-0.012, 0, 0.012].map((x) => caixa(0.006, 0.006, 0.05, mat('#C3C9D2', { metal: true }), [x, 0, -0.1])));
  garfo.position.set(0.13, 0.13, 0.02);
  garfo.rotation.y = 0.6;
  prato.add(garfo);
  cena.add(prato);
  const faiscas = [];
  for (let i = 0; i < 14; i++) { const f = caixa(0.012, 0.012, 0.012, mat('#FFF2A8', { emissivo: '#FFE14A' }), [0, 0, 0], { sombra: false }); cena.add(f); faiscas.push(f); }
  const vapor = [];
  for (let i = 0; i < 8; i++) { const v = malha(new THREE.IcosahedronGeometry(0.018, 0), mat('#FFFFFF', { opacidade: 0.45, unico: true }), { sombra: false }); cena.add(v); vapor.push(v); }

  // ondas (cadeia de caixinhas em forma de senoide)
  const ondas = [];
  const matOnda = mat('#4FF0FF', { emissivo: '#1FB8D8', unico: true });
  for (let k = 0; k < 5; k++) {
    const pts = [];
    for (let i = 0; i < 40; i++) { const m = caixa(0.011, 0.011, 0.011, matOnda, [0, 0, 0], { sombra: false }); cena.add(m); pts.push(m); }
    ondas.push(pts);
  }
  // raios de luz (porta) e moléculas de água (zoom)
  const luzRaios = [0, 1, 2].map((i) => { const m = caixa(0.012, 0.012, 0.5, mat('#FFE14A', { emissivo: '#FFD21F', unico: true }), [CX - 0.12 + i * 0.12, B + 0.28 + i * 0.04, 0.55], { sombra: false }); cena.add(m); return m; });
  const moleculas = [];
  for (let i = 0; i < 8; i++) {
    const g = new THREE.Group();
    g.add(malha(new THREE.SphereGeometry(0.022, 10, 8), mat('#E8322B')));
    for (const a of [-0.9, 0.9]) { const h = malha(new THREE.SphereGeometry(0.014, 8, 6), mat('#FFFFFF')); h.position.set(Math.sin(a) * 0.028, Math.cos(a) * 0.028, 0); g.add(h); }
    g.position.set(CX - 0.1 + (i % 4) * 0.07, CY + 0.17 + Math.floor(i / 4) * 0.06, 0.02);
    cena.add(g);
    moleculas.push(g);
  }

  const voce = criarPersonagem();
  cena.add(voce);

  let E;
  function inicial() {
    E = { luzRaios: false, portaVaza: false, ondas: 0, ondasPorta: 0, giro: false, mistura: 0, vapor: 0, moleculas: false, faisca: false, garfo: false, luz: 0, magnetron: 1 };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.25;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t, corte) {
    porta.visible = true;
    lampada.intensity = E.luz * 0.5;
    magnetron.scale.setScalar(E.magnetron);
    prato.rotation.y = E.giro ? t * 1.2 : 0;
    manchas.forEach((m) => { m.visible = E.mistura < 0.98; m.material.opacity = 1; m.scale.setScalar(Math.max(0.01, 1 - E.mistura)); });
    sopa.material.color.set(E.mistura > 0.5 ? '#FF7A3A' : '#E07B39');
    garfo.visible = E.garfo;
    faiscas.forEach((f, i) => {
      f.visible = E.faisca && Math.sin(t * 40 + i * 7) > 0.2;
      const a = i * 1.7 + t * 9;
      f.position.set(CX + 0.06 + Math.cos(a) * 0.04, CY + 0.15 + Math.abs(Math.sin(a * 1.3)) * 0.06, 0.06 + Math.sin(a) * 0.03);
    });
    vapor.forEach((v, i) => {
      const u = ((t * 0.4 + i / 10) % 1);
      v.visible = E.vapor > 0.05;
      v.position.set(CX + Math.sin(i * 2.3 + t) * 0.08, CY + 0.16 + u * 0.32, -0.02 + Math.cos(i) * 0.05);
      v.scale.setScalar(Math.max(0.01, E.vapor * (0.6 + u)));
    });
    // ondas dentro da cavidade (indo e voltando) ou batendo na porta
    ondas.forEach((pts, k) => {
      const ativo = k < Math.round(5 * Math.max(E.ondas, E.ondasPorta));
      pts.forEach((m, i) => {
        m.visible = ativo;
        if (!ativo) return;
        const u = i / 39;
        if (E.ondasPorta > 0) {
          // da cavidade em direção à porta (z) e voltando
          const z = -0.2 + ((u * 0.9 + t * 0.6 + k * 0.17) % 1) * (E.portaVaza ? 1.1 : 0.55);
          const zz = !E.portaVaza && z > 0.32 ? 0.64 - z : z;
          m.position.set(CX - 0.24 + k * 0.11, B + 0.32 + 0.035 * Math.sin(u * 30 + t * 12), zz);
        } else {
          const x = 0.15 - ((u + t * 0.35 + k * 0.21) % 1) * 0.68;
          m.position.set(x, B + 0.14 + k * 0.09 + 0.03 * Math.sin(u * 28 - t * 14), -0.06 - k * 0.04);
        }
      });
    });
    luzRaios.forEach((r, i) => { r.visible = !!E.luzRaios; r.position.z = 0.4 + ((t * 0.8 + i * 0.3) % 1) * 0.6; });
    moleculas.forEach((g, i) => { g.visible = E.moleculas; g.rotation.z = Math.sin(t * 30 + i) * 1.4; });
  }
  const apresentar = (lt, b, bracos = 'lado', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.25;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camCorte = { pos: [-0.05, B + 0.36, 1.55], alvo: [-0.05, B + 0.32, 0] };
  const camApresentador = { pos: [PX - 0.55, 1.6, PZ + 2.9], alvo: [PX - 0.45, 1.4, 0] };

  const blocos = [
    {
      fala: 'Ele esquenta a sua comida em um minuto, sem fogo nenhum. Mas como? E por que garfo lá dentro solta faísca?',
      destaque: ['fogo', 'garfo', 'faísca'],
      corte: true,
      camera: { pos: [0.35, 1.3, 3.0], alvo: [0.3, 1.2, 0] },
      cameraFim: { pos: [0.1, 1.55, 2.4], alvo: [0, 1.5, 0] },
      aplicar(lt, b) {
        E.ondas = 1; E.luz = 1; E.mistura = 0.2; E.vapor = 0.6;
        voce.position.set(1.0, 0, -0.1);
        voce.rotation.y = -0.15;
      },
    },
    {
      fala: 'Então você faz uma caixa de metal, e põe dentro um magnetron: uma peça que solta ondas invisíveis.',
      destaque: ['metal', 'magnetron', 'ondas'],
      corte: true, corteSeco: true,
      camera: { pos: [0.3, B + 0.4, 1.3], alvo: [0.25, B + 0.32, 0] },
      aplicar(lt, b) {
        voce.visible = false;
        const tm = b.palavra('magnetron');
        E.magnetron = lt > tm ? 1 + 0.15 * Math.max(0, Math.sin((lt - tm) * 8)) * (lt < tm + 1 ? 1 : 0) : 1;
        E.ondas = lim((lt - b.palavra('ondas') + 0.2) / 1.2);
        E.luz = 1;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('magnetron'), 'MAGNETRON'),
    },
    {
      fala: 'Essas são as micro-ondas. Elas entram na comida e fazem a água girar pra lá e pra cá, bilhões de vezes por segundo.',
      destaque: ['micro-ondas', 'água', 'bilhões'],
      corte: true,
      camera: { pos: [CX, CY + 0.28, 0.75], alvo: [CX, CY + 0.18, 0] },
      transicao: 1.2,
      aplicar(lt, b) { E.ondas = 1; E.luz = 1; E.moleculas = lt > b.palavra('agua') - 0.3; },
      camada: (lt, b) => cartao(lt, b.palavra('bilhões'), '2,45 BI', 'DE VEZES POR SEGUNDO'),
    },
    {
      fala: 'E todo esse chacoalho vira calor: é a própria comida que se esquenta, sem fogo nenhum.',
      destaque: ['calor', 'fogo'],
      corte: true,
      camera: { pos: [CX + 0.1, CY + 0.35, 0.95], alvo: [CX, CY + 0.15, 0] },
      aplicar(lt, b) { E.ondas = 1; E.luz = 1; E.moleculas = lt < 1.2; E.vapor = suave((lt - b.palavra('calor')) / 1.5); },
      camada: (lt, b) => ok(lt, b.palavra('fogo')),
    },
    {
      fala: 'Mas as ondas batem nas paredes de metal e se cruzam: tem ponto que ferve, e ponto que fica gelado.',
      destaque: ['ferve', 'gelado'],
      corte: true, corteSeco: true,
      camera: { pos: [CX, CY + 0.55, 0.6], alvo: [CX, CY + 0.1, 0] },
      aplicar(lt, b) { E.ondas = 1; E.luz = 1; E.vapor = 0.3; E.mistura = 0; },
      camada: (lt, b) => etiqueta(lt, b.palavra('gelado'), 'PONTO FRIO'),
    },
    {
      fala: 'Então você põe um prato que gira, pra comida passar por todos os pontos e esquentar por igual.',
      destaque: ['prato', 'gira', 'igual'],
      corte: true,
      camera: { pos: [CX, CY + 0.55, 0.65], alvo: [CX, CY + 0.1, 0] },
      aplicar(lt, b) { E.ondas = 1; E.luz = 1; E.giro = lt > b.palavra('gira') - 0.3; E.mistura = suave((lt - b.palavra('gira')) / 2.2); E.vapor = 0.3 + E.mistura * 0.6; },
      camada: (lt, b) => ok(lt, b.palavra('igual')),
      sons: [{ em: 'igual', tipo: 'ok' }],
    },
    {
      fala: 'É por isso que o prato do micro-ondas gira!',
      destaque: ['prato', 'gira'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { E.giro = true; E.mistura = 1; E.luz = 1; E.ondas = 0; apresentar(lt, b, 'lado'); },
    },
    {
      fala: 'Mas e a porta? Se ela fosse só de vidro, as ondas vazariam pra cozinha!',
      destaque: ['porta', 'vazariam'],
      corteSeco: true,
      camera: { pos: [-0.5, B + 0.45, 1.35], alvo: [-0.17, B + 0.32, 0.37] },
      aplicar(lt, b) { voce.visible = false; E.giro = true; E.mistura = 1; E.luz = 1; E.ondasPorta = 1; E.portaVaza = true; matOnda.color.set('#FF5A4A'); matOnda.emissive.set('#A8201A'); },
      camada: (lt, b) => etiqueta(lt, b.palavra('vazariam'), 'VAZANDO'),
    },
    {
      fala: 'Então você põe uma telinha de metal, com furinhos bem menores que as ondas. A luz passa, e você vê a comida... mas as ondas batem e voltam.',
      destaque: ['telinha', 'luz', 'voltam'],
      camera: { pos: [-0.35, B + 0.38, 1.2], alvo: [-0.17, B + 0.32, 0.37] },
      aplicar(lt, b) {
        E.giro = true; E.mistura = 1; E.luz = 1; E.ondasPorta = 1; E.portaVaza = false;
        matOnda.color.set('#4FF0FF'); matOnda.emissive.set('#1FB8D8');
        E.luzRaios = lt > b.palavra('luz') - 0.2;
      },
      camada: (lt, b) => cartao(lt, b.palavra('menores'), '12 cm', 'É O TAMANHO DA ONDA — OS FURINHOS TÊM POUCOS mm'),
    },
    {
      fala: 'E é por isso que garfo solta faísca: as pontinhas de metal juntam as ondas num ponto só. Nada de metal lá dentro!',
      destaque: ['garfo', 'faísca', 'metal'],
      corte: true, corteSeco: true,
      camera: { pos: [CX + 0.12, CY + 0.32, 0.65], alvo: [CX + 0.06, CY + 0.14, 0] },
      aplicar(lt, b) { E.ondasPorta = 0; E.luzRaios = false; E.ondas = 1; E.luz = 1; E.garfo = true; E.giro = false; E.faisca = lt > b.palavra('faisca') - 0.2; },
      camada: (lt, b) => etiqueta(lt, b.palavra('faisca'), 'FAÍSCA!'),
      sons: [{ em: 'faisca', tipo: 'zap' }],
    },
    {
      fala: 'Parabéns: você construiu um micro-ondas!',
      destaque: ['parabéns', 'micro-ondas'],
      corteSeco: true,
      camera: { pos: [0.5, 1.3, 4.2], alvo: [0.45, 1.15, 0] },
      aplicar(lt, b) {
        Object.assign(E, { garfo: false, faisca: false, ondas: 0, giro: true, mistura: 1, vapor: 0.8, luz: 1 });
        voce.visible = true;
        voce.position.set(PX, 0, PZ);
        voce.rotation.y = -0.2;
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1 };
      },
      sons: [{ em: 'parabens', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno'); },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t, corte) { montar(t, corte); voce.animar(t); } };
}
