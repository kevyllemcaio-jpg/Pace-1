// VÍDEO: "Como um pedalzinho para um carro de 1,5 tonelada?"
// Fatos conferidos:
//  - Freio hidráulico: o pedal (alavanca) empurra o pistão pequeno do cilindro-mestre; a pressão do
//    fluido é a mesma em todo o circuito e age no pistão maior da pinça -> força multiplicada (Pascal).
//  - As pastilhas apertam o disco; o atrito converte energia de movimento em calor. Em frenagens
//    fortes o disco passa de 500 °C. Discos ventilados/furados dissipam calor mais rápido.
//  - ABS: sensores de rotação detectam a roda travando e a central alivia e reaplica a pressão
//    várias vezes por segundo (ordem de 15 vezes/s); o pedal pulsa/treme.
import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, carro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarRua } from '../cenarios/rua.js';

export const config = {
  titulo: ['COMO UM', '*PEDAL*', 'PARA UM CARRO DE', '*1,5 TONELADA*?'],
  tituloEstilo: 'meio',
};

const OZ = -60;                 // oficina (mecanismo) longe da rua
const DX = 2.2, DY = 1.5;       // centro do disco
const MX = -0.2, MY = 3.5;      // cilindro-mestre
const PX = 3.9, PZ = OZ + 1.0;  // personagem

export function criar(ctx) {
  const { cena } = ctx;
  criarRua(ctx, { transversal: false, recuo: 19 });

  // ---------- oficina ----------
  cena.add(caixa(16, 0.12, 10, mat('#9AA0A8'), [1, 0.06, OZ]));
  cena.add(caixa(16, 6, 0.2, mat('#E7DCC8'), [1, 3, OZ - 3]));
  for (let x = -6; x <= 8; x += 2) cena.add(caixa(0.08, 6, 0.05, mat('#D6C9B0'), [x, 3, OZ - 2.88], { sombra: false }));
  cena.add(caixa(3.2, 0.12, 0.6, mat('#B98A5C'), [-4.4, 2.6, OZ - 2.6]));
  for (let i = 0; i < 4; i++) cena.add(caixa(0.18, 0.5 + i * 0.12, 0.18, mat(['#E8322B', '#2F6FE0', '#F2C14E', '#4CAF50'][i]), [-5.6 + i * 0.7, 2.92 + i * 0.06, OZ - 2.6]));

  // pneu + roda atrás do disco
  const roda = new THREE.Group();
  const pneu = malha(new THREE.TorusGeometry(1.25, 0.38, 8, 20), mat('#22252B'));
  roda.add(pneu);
  roda.position.set(DX, DY, OZ - 0.55);
  cena.add(roda);
  // disco
  const discoMat = mat('#B8BEC6', { unico: true, metal: true, emissivo: '#000' });
  const disco = new THREE.Group();
  const face = cilindro(1.0, 0.16, discoMat, [0, 0, 0], 28);
  face.rotation.x = Math.PI / 2;
  disco.add(face);
  const cubo = cilindro(0.42, 0.24, mat('#6B7280', { metal: true }), [0, 0, 0], 14);
  cubo.rotation.x = Math.PI / 2;
  disco.add(cubo);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const p = cilindro(0.05, 0.3, mat('#2A2D33'), [Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0], 6);
    p.rotation.x = Math.PI / 2;
    disco.add(p);
  }
  const furos = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, r = i % 2 ? 0.62 : 0.8;
    const f = cilindro(0.045, 0.18, mat('#1B1D22'), [Math.cos(a) * r, Math.sin(a) * r, 0.0], 6);
    f.rotation.x = Math.PI / 2;
    furos.add(f);
  }
  disco.add(furos);
  disco.position.set(DX, DY, OZ);
  cena.add(disco);
  // pinça (caliper) no topo do disco + pastilhas
  const pincaMat = mat('#E8322B', { unico: true, opacidade: 1 });
  const pinca = caixa(0.95, 0.55, 0.78, pincaMat, [DX, DY + 0.98, OZ]);
  cena.add(pinca);
  const pistaoG = cilindro(0.26, 0.14, mat('#D8DCE2', { metal: true }), [DX, DY + 0.98, OZ + 0.3], 14);
  pistaoG.rotation.x = Math.PI / 2;
  cena.add(pistaoG);
  const pastMat = mat('#5B4636');
  const pastF = caixa(0.7, 0.36, 0.08, pastMat, [DX, DY + 0.72, OZ + 0.2]);
  const pastT = caixa(0.7, 0.36, 0.08, pastMat, [DX, DY + 0.72, OZ - 0.2]);
  cena.add(pastF, pastT);

  // cilindro-mestre (pistão pequeno) e cano com fluido
  const cmMat = mat('#9AA3AE', { unico: true, opacidade: 0.55, metal: true });
  const cm = cilindro(0.2, 1.0, cmMat, [MX, MY, OZ + 0.1], 12);
  cm.rotation.z = Math.PI / 2;
  cena.add(cm);
  const oleoMat = mat('#F2A93B', { unico: true, emissivo: '#5A3500' });
  const oleoCm = cilindro(0.15, 0.7, oleoMat, [MX + 0.1, MY, OZ + 0.1], 10);
  oleoCm.rotation.z = Math.PI / 2;
  cena.add(oleoCm);
  const pistaoP = cilindro(0.15, 0.12, mat('#D8DCE2', { metal: true }), [MX - 0.3, MY, OZ + 0.1], 10);
  pistaoP.rotation.z = Math.PI / 2;
  cena.add(pistaoP);
  const tubo = [[MX + 0.5, MY, OZ + 0.1], [DX, MY, OZ + 0.1], [DX, DY + 1.25, OZ + 0.1]];
  const tuboMat = mat('#F2A93B', { unico: true, emissivo: '#5A3500' });
  for (let i = 0; i < tubo.length - 1; i++) {
    const [a, b] = [tubo[i], tubo[i + 1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const c = caixa(i % 2 ? 0.13 : L + 0.13, i % 2 ? L + 0.13 : 0.13, 0.13, tuboMat, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, OZ + 0.1]);
    cena.add(c);
  }
  // pulsos de pressão no cano
  const pulsos = [];
  const comp = [];
  let total = 0;
  for (let i = 0; i < tubo.length - 1; i++) { const L = Math.hypot(tubo[i + 1][0] - tubo[i][0], tubo[i + 1][1] - tubo[i][1]); comp.push(L); total += L; }
  const noTubo = (u) => {
    let d = u * total;
    for (let i = 0; i < comp.length; i++) {
      if (d <= comp[i]) { const k = d / comp[i]; return [mistura(tubo[i][0], tubo[i + 1][0], k), mistura(tubo[i][1], tubo[i + 1][1], k)]; }
      d -= comp[i];
    }
    return tubo[tubo.length - 1];
  };
  const pulsoMat = mat('#FFFFFF', { unico: true, emissivo: '#FFE08A' });
  for (let i = 0; i < 8; i++) { const m = caixa(0.17, 0.17, 0.17, pulsoMat, [0, 0, 0], { sombra: false }); cena.add(m); pulsos.push(m); }

  // pedal (alavanca) + tênis do personagem
  const pedal = new THREE.Group();
  pedal.position.set(MX - 1.3, MY + 0.6, OZ + 0.1);
  pedal.add(caixa(0.1, 1.5, 0.1, mat('#3D434C'), [0, -0.75, 0]));
  pedal.add(caixa(0.12, 0.42, 0.5, mat('#22252B'), [-0.05, -1.45, 0]));
  cena.add(pedal);
  const haste = caixa(0.6, 0.06, 0.06, mat('#9AA3AE', { metal: true }), [0, 0, 0]);
  cena.add(haste);
  const tenis = new THREE.Group();
  tenis.add(caixa(0.9, 0.34, 0.42, mat('#F4F4F4'), [0, 0.06, 0]));
  tenis.add(caixa(0.92, 0.1, 0.44, mat('#E8322B'), [0, -0.16, 0]));
  tenis.add(caixa(0.4, 0.5, 0.36, mat('#1E1E22'), [0.38, 0.4, 0]));
  tenis.rotation.z = -Math.PI / 2;
  cena.add(tenis);
  // setas de força
  const seta = (cor) => {
    const g = new THREE.Group();
    const m = mat(cor, { unico: true, emissivo: cor });
    const corpo = caixa(1, 0.16, 0.16, m, [0.5, 0, 0], { sombra: false });
    const ponta = malha(new THREE.ConeGeometry(0.22, 0.4, 4), m, { sombra: false });
    ponta.rotation.z = -Math.PI / 2;
    g.add(corpo, ponta);
    g.def = (L) => { corpo.scale.x = Math.max(0.01, L); corpo.position.x = L / 2; ponta.position.x = L + 0.18; };
    return g;
  };
  const setaPe = seta('#4FF0FF');
  setaPe.position.set(MX - 2.6, MY - 0.85, OZ + 0.5);
  const setaPinca = seta('#FFD21F');
  setaPinca.rotation.z = -Math.PI / 2;
  setaPinca.position.set(DX + 0.8, DY + 2.9, OZ + 0.5);
  cena.add(setaPe, setaPinca);
  // calor
  const brasas = [];
  const brasaMat = mat('#FF7A1A', { unico: true, emissivo: '#FF4A00' });
  for (let i = 0; i < 14; i++) { const m = caixa(0.07, 0.07, 0.07, brasaMat, [0, 0, 0], { sombra: false }); cena.add(m); brasas.push(m); }

  // ---------- rua ----------
  const auto = carro('#2F6FE0');
  cena.add(auto);
  const marcas = [];
  for (let i = 0; i < 40; i++) { const m = caixa(0.42, 0.012, 0.32, mat('#121212'), [0, 0.068, 0], { sombra: false }); cena.add(m); marcas.push(m); }

  const voce = criarPersonagem();
  cena.add(voce);

  let E;
  function inicial() {
    E = { gira: 0, aperto: 0, pedal: 0, pulsos: 0, forca: 0, calor: 0, furos: false, abs: false, raioX: false,
      carro: { x: 20, yaw: 0, rodando: true, marcas: 0, marcaX0: 0 }, tremer: 0 };
    voce.visible = true;
    voce.position.set(PX, 0.12, PZ);
    voce.rotation.y = -0.5;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t) {
    disco.rotation.z = -E.gira;
    roda.rotation.z = -E.gira;
    furos.visible = E.furos;
    const ap = lim(E.aperto, 0, 1);
    pastF.position.z = OZ + 0.32 - 0.22 * ap;
    pastT.position.z = OZ - 0.32 + 0.22 * ap;
    pistaoG.position.z = OZ + 0.3 - 0.06 * ap;
    pincaMat.opacity = E.raioX ? 0.35 : 1;
    pincaMat.transparent = E.raioX;
    const pd = lim(E.pedal + E.tremer * 0.12 * Math.sin(t * 40), 0, 1.1);
    pedal.rotation.z = 0.45 * pd;
    const pe = new THREE.Vector3(-0.05, -1.45, 0).applyEuler(pedal.rotation).add(pedal.position);
    tenis.position.set(pe.x - 0.42, pe.y + 0.05, pe.z);
    const hx0 = pedal.position.x + Math.sin(0.45 * pd) * 0.6;
    pistaoP.position.x = MX - 0.32 + 0.3 * pd;
    haste.position.set((hx0 + pistaoP.position.x) / 2, MY, OZ + 0.1);
    haste.scale.x = Math.max(0.1, (pistaoP.position.x - hx0) / 0.6);
    pulsos.forEach((m, i) => {
      m.visible = E.pulsos > 0.02;
      const [x, y] = noTubo(((i / pulsos.length) + t * 0.8) % 1);
      m.position.set(x, y, OZ + 0.24);
      m.scale.setScalar(0.4 + 0.8 * E.pulsos);
    });
    setaPe.visible = E.forca > 0.02;
    setaPinca.visible = E.forca > 0.02;
    setaPe.def(0.6 * E.forca);
    setaPinca.def(0.15 + 1.6 * E.forca * E.forca);
    const c = lim(E.calor, 0, 1);
    discoMat.color.set('#B8BEC6').lerp(new THREE.Color('#FF5A1F'), c * 0.85);
    discoMat.emissive.set('#000000').lerp(new THREE.Color('#C42A00'), c);
    brasas.forEach((m, i) => {
      m.visible = c > 0.3;
      const f = (t * 0.7 + i / brasas.length) % 1;
      const a = i * 2.3;
      m.position.set(DX + Math.cos(a) * (0.9 + f * 0.5), DY + Math.sin(a) * 0.8 + f * 1.6, OZ + 0.25);
    });
    // carro
    const C = E.carro;
    auto.position.set(C.x, 0.03, -2 + Math.sin(C.yaw) * 0.6);
    auto.rotation.y = Math.PI + C.yaw;
    if (C.rodando) auto.rodar(-C.x);
    marcas.forEach((m, i) => {
      const x = C.marcaX0 + (C.x - C.marcaX0) * (i / (marcas.length - 1));
      m.visible = C.marcas > 0 && i / marcas.length < C.marcas;
      m.position.set(x, 0.068, -2 + Math.sin(C.yaw * (i / marcas.length)) * 0.6 + (i % 2 ? 0.75 : -0.75) * 0.0);
    });
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0.12, PZ);
    voce.rotation.y = -0.5;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camGeral = { pos: [0.6, 2.8, OZ + 13.5], alvo: [0.6, 2.3, OZ] };
  const camApresentador = { pos: [PX - 2.2, 1.9, PZ + 3.4], alvo: [PX - 0.6, 1.6, PZ] };

  const blocos = [
    {
      fala: 'Como um pedalzinho, que você aperta só com o pé, consegue parar um carro de uma tonelada e meia?',
      destaque: ['pedalzinho', 'pé', 'tonelada'],
      camera: { pos: [2.5, 0.8, PZ + 5.0], alvo: [3.1, 1.25, OZ] },
      cameraFim: { pos: [3.0, 1.6, PZ + 5.4], alvo: [3.0, 2.0, OZ] },
      aplicar(lt, b) {
        E.gira = lt * 6; E.calor = 0.9; E.aperto = 1; E.furos = true;
        apresentar(lt, b, 'aponta', 'surpreso');
        voce.rotation.y = 0.15;
      },
    },
    {
      fala: 'Então você põe um disco de metal girando junto com a roda.',
      destaque: ['disco', 'roda'],
      corteSeco: true,
      camera: { pos: [DX + 1.6, DY + 1.2, OZ + 4.2], alvo: [DX, DY, OZ] },
      aplicar(lt, b) { E.calor = 0; E.aperto = 0; E.furos = false; E.gira = 0.5 + lt * 8; voce.visible = false; },
    },
    {
      fala: 'E duas pastilhas que apertam o disco. Mas o seu pé sozinho não tem força nem pra segurar ele.',
      destaque: ['pastilhas', 'apertam', 'força'],
      corteSeco: true,
      camera: { pos: [DX + 2.4, DY + 2.6, OZ + 2.6], alvo: [DX, DY + 0.9, OZ] },
      aplicar(lt, b) {
        E.raioX = true;
        E.gira = 3 + (lt < b.palavra('pé') ? lt * 8 : b.palavra('pé') * 8 + (lt - b.palavra('pé')) * 7);
        E.aperto = suave((lt - b.palavra('apertam')) / 0.5) * 0.7;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('força') - 0.1, 'FORÇA FRACA DEMAIS'),
    },
    {
      fala: 'Então você enche um cano com óleo. O pedal empurra um pistão pequeno, e o óleo empurra um pistão grande lá na roda.',
      destaque: ['óleo', 'pequeno', 'grande'],
      corteSeco: true,
      camera: camGeral,
      cameraFim: { pos: [0.6, 2.8, OZ + 12.5], alvo: [0.6, 2.3, OZ] },
      aplicar(lt, b) {
        E.raioX = true;
        E.gira = 8 + lt * 7;
        const p = suave((lt - b.palavra('pedal')) / 0.8);
        E.pedal = p; E.pulsos = p; E.aperto = p;
        E.forca = suave((lt - b.palavra('grande') + 0.2) / 0.6);
      },
      camada: (lt, b) => cartao(lt, b.palavra('grande'), 'FREIO HIDRÁULICO', 'A FORÇA DO SEU PÉ É MULTIPLICADA'),
      sons: [{ em: 'pedal', tipo: 'tum' }],
    },
    {
      fala: 'Aí as pastilhas apertam o disco com força, e o atrito transforma o movimento em calor.',
      destaque: ['atrito', 'calor'],
      corteSeco: true,
      camera: { pos: [DX + 1.2, DY + 0.6, OZ + 3.8], alvo: [DX, DY + 0.3, OZ] },
      cameraFim: { pos: [DX + 0.8, DY + 0.5, OZ + 3.2], alvo: [DX, DY + 0.3, OZ] },
      aplicar(lt, b) {
        E.pedal = 1; E.pulsos = 1; E.aperto = 1; E.forca = 0;
        E.gira = 16 + 4 * (1 - Math.exp(-lt * 0.9)) / 0.9 * 1.5;
        E.calor = suave((lt - b.palavra('calor') + 0.6) / 1.2);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('calor'), 'MAIS DE 500 °C'),
      sons: [{ em: 'calor', tipo: 'fogo' }],
    },
    {
      fala: 'É por isso que o disco de alguns carros tem esses furos: o ar passa e ele esfria mais rápido.',
      destaque: ['furos', 'esfria'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        E.raioX = false; E.pedal = 0; E.pulsos = 0; E.aperto = 0;
        E.furos = true; E.gira = 20 + lt * 2;
        E.calor = 1 - suave((lt - b.palavra('esfria')) / 1.4);
        apresentar(lt, b, lt > b.palavra('furos') - 0.3 ? 'aponta' : 'lado');
      },
    },
    {
      fala: 'Mas se você frear forte demais, a roda trava, e o carro escorrega sem controle.',
      destaque: ['trava', 'escorrega'],
      corteSeco: true,
      camera: (lt) => ({ pos: [E.carro.x - 9, 4.5, 9], alvo: [E.carro.x - 1, 0.6, -2] }),
      aplicar(lt, b) {
        voce.visible = false; E.calor = 0;
        const tr = b.palavra('trava');
        const C = E.carro;
        if (lt < tr) { C.x = 26 - 14 * lt; C.rodando = true; }
        else {
          const u = lt - tr;
          C.x = 26 - 14 * tr - (14 * u - 4 * u * u) * (u < 1.75 ? 1 : 0) - (u >= 1.75 ? 14 * 1.75 - 4 * 1.75 * 1.75 : 0);
          C.rodando = false; C.marcaX0 = 26 - 14 * tr; C.marcas = 1;
          C.yaw = 0.7 * suave(u / 1.5);
        }
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('trava'), 'RODA TRAVADA'),
      sons: [{ em: 'trava', tipo: 'gargalo' }],
    },
    {
      fala: 'Então você coloca um sensor na roda, que solta e aperta o freio umas quinze vezes por segundo.',
      destaque: ['sensor', 'quinze'],
      corteSeco: true,
      camera: { pos: [DX + 2.4, DY + 2.2, OZ + 3.0], alvo: [DX, DY + 0.8, OZ] },
      aplicar(lt, b) {
        E.carro = { x: 40, yaw: 0, rodando: true, marcas: 0, marcaX0: 0 };
        E.raioX = true; E.furos = true; E.calor = 0.3;
        E.gira = 30 + lt * 5;
        const on = lt > b.palavra('solta') - 0.2;
        E.pedal = 1; E.pulsos = 1;
        E.aperto = on ? 0.55 + 0.45 * Math.sign(Math.sin(lt * 2 * Math.PI * 5)) : 1;
      },
      camada: (lt, b) => cartao(lt, b.palavra('quinze'), 'ABS', 'FREIO QUE NÃO DEIXA A RODA TRAVAR'),
      sons: [{ em: 'sensor', tipo: 'zap' }],
    },
    {
      fala: 'É por isso que o pedal treme debaixo do seu pé quando você freia forte num carro com ABS.',
      destaque: ['pedal', 'treme'],
      corteSeco: true,
      camera: { pos: [MX - 0.4, MY - 0.2, OZ + 4.4], alvo: [MX - 1.0, MY - 0.5, OZ] },
      aplicar(lt, b) {
        E.raioX = true; E.pedal = 0.9; E.pulsos = 1;
        E.tremer = lt > b.palavra('treme') - 0.3 ? 1 : 0;
        E.aperto = 0.55 + 0.45 * Math.sign(Math.sin(lt * 2 * Math.PI * 5));
      },
      camada: (lt, b) => ok(lt, b.palavra('treme') + 0.4),
      sons: [{ em: 'treme', tipo: 'ok' }],
    },
    {
      fala: 'Parabéns: você construiu um freio a disco com ABS!',
      destaque: ['parabéns', 'freio'],
      corteSeco: true,
      camera: { pos: [PX - 1.2, 2.2, PZ + 5.5], alvo: [PX - 0.7, 1.5, PZ] },
      aplicar(lt, b) {
        E.tremer = 0; E.pedal = 0; E.pulsos = 0; E.aperto = 0; E.raioX = false; E.calor = 0;
        E.gira = 40 + lt * 3;
        voce.visible = true;
        voce.position.set(PX, 0.12, PZ);
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
      aplicar(lt, b) { E.gira = 45 + lt * 2; apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno'); },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
