// VÍDEO: "Como um foguete chega ao espaço?"
//
// Fatos conferidos:
//  - Ação e reação (3ª lei de Newton): o gás é jogado para baixo e o foguete é empurrado para cima.
//  - Sem ar não há oxigênio; foguetes levam o oxidante (ex.: oxigênio líquido) em tanque próprio.
//  - Na decolagem, ~85–90% da massa de um foguete é propelente.
//  - Estágios: os tanques vazios são descartados para o resto ficar mais leve.
//  - Velocidade orbital baixa ≈ 7,8 km/s ≈ 28.000 km/h; órbita = cair em volta da Terra.
//  - Astronautas "flutuam" porque estão em queda livre junto com a nave.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, ruido, arvore } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM *FOGUETE*', 'CHEGA ATÉ O', '*ESPAÇO*?'],
};

const PX = 9, PZ = 22;         // personagem perto da plataforma
const ESP = 6000;              // altura onde fica a cena do espaço
const RT = 60, RO = 78;        // raio da Terra e da órbita (desenho)

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- base de lançamento ----------
  cena.add(terreno((x, z) => Math.max(0, Math.hypot(x, z) - 140) * 0.25 + lim((Math.hypot(x, z) - 140) / 40) * ruido(x, z) * 8, (y, i, x, z) => (Math.hypot(x, z) < 28 ? '#B9BCC2' : ruido(x * 3, z * 3) > 0.3 ? '#5DB13F' : '#6CBF47'), { largura: 700, profundidade: 700, seg: 120, material: mat('#ffffff', { vertexColors: true }) }));
  cena.add(caixa(16, 2, 16, mat('#8C939E'), [0, 1, 0]));
  const torreLanc = new THREE.Group();
  for (let y = 0; y < 44; y += 4) {
    torreLanc.add(caixa(3, 0.3, 3, mat('#E8322B'), [0, y + 2, 0]));
    for (const [x, z] of [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]]) torreLanc.add(caixa(0.3, 4, 0.3, mat('#E8322B'), [x, y + 2, z]));
  }
  torreLanc.position.set(-7, 2, 0);
  cena.add(torreLanc);
  [[-40, 30], [40, 34], [-60, -20], [55, -30], [20, 60], [-25, 70]].forEach(([x, z], i) => cena.add(arvore(x, 0, z, 1.2, i)));
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);

  // ---------- o foguete (origem na base) ----------
  const foguete = new THREE.Group();
  const branco = C('#F4F6F8', { duplo: true });
  const preto = C('#2A2D33', { duplo: true });
  const meiaVolta = (r, h, cor) => malha(new THREE.CylinderGeometry(r, r, h, 18, 1, false, Math.PI / 2, Math.PI), mat(cor, { unico: true, duplo: true, emissivo: cor === '#F28C28' ? '#5A2A00' : '#0E3C5A' }), { sombra: false });
  function chama(r, h) {
    const g = new THREE.Group();
    const ext = malha(new THREE.ConeGeometry(r, h, 10), mat('#FF8A1C', { emissivo: '#FF5A00', opacidade: 0.9, unico: true, semNeblina: true }), { sombra: false });
    ext.rotation.x = Math.PI;
    ext.position.y = -h / 2;
    const int = malha(new THREE.ConeGeometry(r * 0.55, h * 0.6, 8), mat('#FFF2A8', { emissivo: '#FFE14A', unico: true, semNeblina: true }), { sombra: false });
    int.rotation.x = Math.PI;
    int.position.y = -h * 0.3;
    g.add(ext, int);
    return g;
  }
  // 1º estágio
  const est1 = new THREE.Group();
  est1.add(malha(new THREE.CylinderGeometry(2, 2, 22, 18, 1, true), branco));
  est1.children[0].position.y = 14;
  for (const y of [5, 24.4]) est1.add(cilindro(2.05, 0.8, preto, [0, y, 0], 18));
  for (let i = 0; i < 4; i++) { const f = caixa(0.2, 4, 2.2, C('#2A2D33'), [0, 4, 0]); const g = new THREE.Group(); f.position.set(0, 4, 2.6); g.add(f); g.rotation.y = (i / 4) * Math.PI * 2 + Math.PI / 4; est1.add(g); }
  for (const x of [-0.9, 0.9]) { const b = malha(new THREE.CylinderGeometry(0.45, 0.9, 2.6, 10, 1, true), mat('#5B6270', { metal: true, duplo: true })); b.position.set(x, 1.7, 0); est1.add(b); }
  const tanqueComb1 = meiaVolta(1.8, 1, '#F28C28');
  const tanqueOx1 = meiaVolta(1.8, 1, '#7FD6FF');
  est1.add(tanqueComb1, tanqueOx1);
  const chama1 = chama(2.1, 12);
  chama1.position.y = 0.6;
  est1.add(chama1);
  foguete.add(est1);
  // 2º estágio + ponta
  const est2 = new THREE.Group();
  est2.position.y = 25;
  est2.add(malha(new THREE.CylinderGeometry(2, 2, 9, 18, 1, true), branco));
  est2.children[0].position.y = 4.5;
  const ponta = malha(new THREE.ConeGeometry(2, 6, 18), C('#E8322B'));
  ponta.position.y = 12;
  est2.add(ponta);
  est2.add(cilindro(2.05, 0.6, preto, [0, 8.6, 0], 18));
  const bocal2 = malha(new THREE.CylinderGeometry(0.4, 0.8, 1.6, 10, 1, true), mat('#5B6270', { metal: true, duplo: true }));
  bocal2.position.y = -0.4;
  est2.add(bocal2);
  const tanqueComb2 = meiaVolta(1.8, 1, '#F28C28');
  const tanqueOx2 = meiaVolta(1.8, 1, '#7FD6FF');
  est2.add(tanqueComb2, tanqueOx2);
  const chama2 = chama(1.2, 8);
  chama2.position.y = -1.0;
  est2.add(chama2);
  foguete.add(est2);
  // canos dos tanques até o motor (vista em corte)
  const canos1 = [caixa(0.25, 10, 0.25, mat('#9AA3AE'), [-0.6, 9, -0.6], { sombra: false }), caixa(0.25, 2, 0.25, mat('#9AA3AE'), [0.6, 4, -0.6], { sombra: false })];
  canos1.forEach((c) => est1.add(c));
  cena.add(foguete);
  function nivel(tanque, y0, hMax, k) {
    tanque.visible = k > 0.02;
    tanque.scale.y = Math.max(0.01, hMax * k);
    tanque.position.y = y0 + (hMax * k) / 2;
  }
  // fumaça na decolagem
  const fumaca = [];
  for (let i = 0; i < 24; i++) {
    const m = malha(new THREE.IcosahedronGeometry(2.4, 0), mat('#E9EEF4', { opacidade: 0.85, unico: true }), { sombra: false });
    fumaca.push({ m, a: (i / 24) * Math.PI * 2, v: 6 + (i % 5) * 2 });
    cena.add(m);
  }

  // ---------- espaço ----------
  const espaco = new THREE.Group();
  espaco.position.y = ESP;
  cena.add(espaco);
  const geoT = new THREE.IcosahedronGeometry(RT, 3).toNonIndexed();
  const cores = [];
  const p = geoT.attributes.position;
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3, z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    const c = new THREE.Color(Math.abs(y) > RT * 0.85 ? '#F4F6F8' : ruido(x * 2.2, z * 2.2 + y) > 0.25 ? '#4CAF50' : '#2D78D2');
    for (let k = 0; k < 3; k++) cores.push(c.r, c.g, c.b);
  }
  geoT.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
  geoT.computeVertexNormals();
  const terra = malha(geoT, mat('#ffffff', { vertexColors: true, semNeblina: true }), { sombra: false });
  espaco.add(terra);
  const atm = malha(new THREE.SphereGeometry(RT * 1.06, 24, 16), mat('#7CC8FF', { opacidade: 0.18, unico: true, semNeblina: true }), { sombra: false });
  espaco.add(atm);
  const estrelas = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1500 * 3 }, (_, i) => { const k = Math.floor(i / 3); const th = k * 2.399, ph = Math.acos(1 - 2 * ((k * 0.618) % 1)); return [Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)][i % 3] * 500; }), 3)),
    new THREE.PointsMaterial({ color: '#ffffff', size: 2, sizeAttenuation: false, fog: false }),
  );
  espaco.add(estrelas);
  // navinha (para a órbita) e trilha
  const nave = new THREE.Group();
  nave.add(cilindro(1, 4, mat('#F4F6F8', { semNeblina: true }), [0, 0, 0], 12));
  const pn = malha(new THREE.ConeGeometry(1, 2.4, 12), mat('#E8322B', { semNeblina: true }));
  pn.position.y = 3.2;
  nave.add(pn);
  const chamaNave = chama(0.7, 4);
  chamaNave.position.y = -2;
  nave.add(chamaNave);
  espaco.add(nave);
  const trilha = [];
  for (let i = 0; i < 60; i++) { const m = caixa(0.6, 0.6, 0.6, mat('#FFE14A', { emissivo: '#FFB800', semNeblina: true }), [0, 0, 0], { sombra: false }); espaco.add(m); trilha.push(m); }
  // cabine (astronauta flutuando)
  const cabine = new THREE.Group();
  const parede = mat('#DCE3EA', { duplo: true, semNeblina: true });
  cabine.add(caixa(6, 0.2, 6, parede, [0, -3, 0]), caixa(6, 0.2, 6, parede, [0, 3, 0]), caixa(0.2, 6, 6, parede, [-3, 0, 0]), caixa(0.2, 6, 6, parede, [3, 0, 0]));
  cabine.add(caixa(6, 6, 0.2, mat('#C9D2DC', { duplo: true, semNeblina: true }), [0, 0, -3]));
  const janela = malha(new THREE.CircleGeometry(1.2, 16), mat('#0B1230', { semNeblina: true, emissivo: '#05081A' }));
  janela.position.set(0, 0.6, -2.88);
  cabine.add(janela);
  for (let i = 0; i < 12; i++) cabine.add(caixa(0.06, 0.06, 0.02, mat('#FFFFFF', { emissivo: '#FFFFFF' }), [-0.8 + ((i * 0.37) % 1.6), 0 + ((i * 0.53) % 1.6), -2.86], { sombra: false }));
  for (let i = 0; i < 4; i++) cabine.add(caixa(0.6, 0.35, 0.1, mat(['#2DBE60', '#E8322B', '#F2C14E', '#2F6FE0'][i], { emissivo: '#222' }), [-2.2 + i * 0.5, -1.6, -2.85], { sombra: false }));
  cabine.position.set(200, 0, 0);
  espaco.add(cabine);

  const voce = criarPersonagem();
  voce.scale.setScalar(1.05);
  cena.add(voce);

  const ceuDia = new THREE.Color('#8CCFFF'), ceuAlto = new THREE.Color('#0B1230');
  let E;
  function inicial() {
    E = { y: 0, chama1: 0, chama2: 0, comb1: 1, ox1: 1, comb2: 1, ox2: 1, separou: -1, ceu: 0, fumaca: -1, espaco: false, orbita: -1, queda: -1 };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.45;
    voce.scale.setScalar(1.05);
    voce.estado = { bracos: 'lado', expr: 'feliz' };
    voce.rotation.set(0, -0.45, 0);
  }
  function montar(t) {
    foguete.position.y = 2 + E.y;
    const fl = (k) => k * (0.85 + 0.15 * Math.sin(t * 40));
    chama1.visible = E.chama1 > 0.02;
    chama1.scale.set(Math.max(0.01, E.chama1), Math.max(0.01, fl(E.chama1)), Math.max(0.01, E.chama1));
    chama2.visible = E.chama2 > 0.02;
    chama2.scale.set(Math.max(0.01, E.chama2), Math.max(0.01, fl(E.chama2)), Math.max(0.01, E.chama2));
    nivel(tanqueComb1, 3.4, 9.4, E.comb1);
    nivel(tanqueOx1, 13.8, 9.6, E.ox1);
    nivel(tanqueComb2, 0.4, 3.6, E.comb2);
    nivel(tanqueOx2, 4.3, 3.6, E.ox2);
    if (E.separou >= 0) {
      const q = E.separou;
      est1.position.set(1.5 * q, -4 * q * q - 2 * q, 0);
      est1.rotation.z = 0.5 * q;
    } else { est1.position.set(0, 0, 0); est1.rotation.z = 0; }
    fumaca.forEach((f, i) => {
      f.m.visible = E.fumaca >= 0 && E.fumaca < 6;
      const r = 3 + f.v * Math.min(E.fumaca, 3);
      f.m.position.set(Math.cos(f.a) * r, 2.5 + (i % 3) * 1.5 + E.fumaca * 0.8, Math.sin(f.a) * r);
      f.m.scale.setScalar(0.6 + Math.min(E.fumaca, 3) * 0.6);
    });
    cena.background.copy(ceuDia).lerp(ceuAlto, E.espaco ? 1 : E.ceu);
    cena.fog.near = E.espaco ? 2000 : 160;
    cena.fog.far = E.espaco ? 4000 : 460;
    cena.fog.color.set('#CDEBFF').lerp(ceuAlto, E.espaco ? 1 : E.ceu);
    espaco.visible = E.espaco;
    // órbita / queda de volta
    let ang = 0, r = RO;
    if (E.orbita >= 0) ang = E.orbita * 0.9;
    if (E.queda >= 0) {
      const q = E.queda;
      r = RT + 2 + Math.max(0, 22 * Math.sin(Math.min(q, 2.6) * 1.2));
    }
    nave.position.set(r * Math.sin(ang), r * Math.cos(ang), 0);
    nave.rotation.z = E.orbita >= 0 ? -ang - Math.PI / 2 : 0;
    chamaNave.visible = E.orbita >= 0 && E.orbita < 1.2;
    trilha.forEach((m, i) => {
      const a = ang - (i + 1) * 0.04;
      m.visible = E.orbita >= 0 && a > -0.0;
      m.position.set(RO * Math.sin(a), RO * Math.cos(a), 0);
    });
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.set(0, -0.3, 0);
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX - 1.2, 2.0, PZ + 4.6], alvo: [PX - 0.3, 1.8, PZ] };
  const segue = (dy = 0, dist = 70) => (lt, b) => ({ pos: [12, 2 + E.y + 18 + dy, dist], alvo: [0, 2 + E.y + 18, 0] });

  const blocos = [
    {
      fala: 'Pra ficar no espaço, um foguete precisa correr a vinte e oito mil quilômetros por hora. Como ele chega lá?',
      destaque: ['espaço', 'vinte', 'foguete'],
      corte: (lt) => lt < 2.2,
      camera: { pos: [PX - 1.5, 2.4, 57], alvo: [0, 15, 0] },
      cameraFim: { pos: [30, 20, 110], alvo: [0, 20, 0] },
      aplicar(lt, b) {
        voce.position.set(PX - 2.2, 0, 50);
        voce.rotation.y = 0.1;
        voce.estado = { bracos: lt < b.dur * 0.5 ? 'lado' : 'cima', expr: 'feliz' };
      },
    },
    {
      fala: 'Então você enche um tubo de combustível e põe fogo embaixo. O gás quente sai pra baixo com força, e empurra o foguete pra cima.',
      destaque: ['combustível', 'fogo', 'cima'],
      camera: { pos: [16, 10, 74], alvo: [0, 14, 0] },
      aplicar(lt, b) {
        const tf = b.palavra('fogo');
        E.chama1 = saida((lt - tf) / 0.5);
        E.fumaca = lt > tf ? lt - tf : -1;
        E.y = lt > b.palavra('empurra') ? 3 * (lt - b.palavra('empurra')) ** 2 : 0;
        voce.visible = false;
      },
      camada: (lt, b) => cartao(lt, b.palavra('empurra'), 'AÇÃO E REAÇÃO', 'O GÁS VAI PRA BAIXO, O FOGUETE PRA CIMA'),
      sons: [{ em: 'fogo', tipo: 'fogo' }],
    },
    {
      fala: 'Mas lá em cima o ar vai acabando. E sem oxigênio, o fogo apaga!',
      destaque: ['ar', 'oxigênio', 'apaga'],
      corteSeco: true,
      camera: segue(0, 70),
      aplicar(lt, b) {
        E.fumaca = -1;
        E.y = 400 + lt * 60;
        E.ceu = suave(lt / b.dur) * 0.75;
        E.chama1 = 1 - suave((lt - b.palavra('apaga') + 0.3) / 0.6);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('oxigenio'), 'SEM OXIGÊNIO'),
    },
    {
      fala: 'Então você leva o oxigênio junto, num tanque separado, e mistura com o combustível só na hora de queimar.',
      destaque: ['oxigênio', 'tanque', 'queimar'],
      corte: true,
      corteSeco: true,
      camera: { pos: [0, 2 + 600 + 14, 34], alvo: [0, 2 + 600 + 13, 0] },
      aplicar(lt, b) {
        E.y = 600;
        E.ceu = 0.8;
        E.chama1 = saida((lt - b.palavra('queimar')) / 0.4);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('tanque'), 'OXIGÊNIO + COMBUSTÍVEL'),
      sons: [{ em: 'queimar', tipo: 'fogo' }],
    },
    {
      fala: 'Mas quase todo o foguete é tanque. Quando ele esvazia, você fica carregando um monte de peso à toa.',
      destaque: ['tanque', 'esvazia', 'peso'],
      corte: true,
      camera: { pos: [0, 2 + 600 + 14, 34], alvo: [0, 2 + 600 + 13, 0] },
      aplicar(lt, b) {
        E.y = 600;
        E.ceu = 0.8;
        E.chama1 = 1;
        const k = suave((lt - b.palavra('esvazia') + 0.5) / 1.6);
        E.comb1 = 1 - 0.95 * k;
        E.ox1 = 1 - 0.95 * k;
      },
      camada: (lt, b) => cartao(lt, b.palavra('tanque'), '90%', 'DO PESO NA DECOLAGEM É COMBUSTÍVEL') + etiqueta(lt, b.palavra('peso'), 'PESO MORTO'),
    },
    {
      fala: 'Então você divide o foguete em partes. Quando uma esvazia, ela se solta e cai, e a próxima acende.',
      destaque: ['partes', 'solta', 'acende'],
      corteSeco: true,
      camera: segue(-4, 80),
      aplicar(lt, b) {
        E.comb1 = E.ox1 = 0.05;
        E.ceu = 0.85;
        const ts = b.palavra('solta');
        E.y = 900 + lt * 20 + (lt > ts ? 4 * (lt - ts) ** 2 : 0);
        E.separou = lt > ts ? (lt - ts) * 1.4 : -1;
        E.chama1 = lt > ts - 0.2 ? 0 : 1;
        E.chama2 = saida((lt - b.palavra('acende')) / 0.4);
      },
      sons: [{ em: 'solta', tipo: 'baque' }, { em: 'acende', tipo: 'fogo' }],
    },
    {
      fala: 'Esses são os estágios. Assim o foguete vai ficando mais leve, e cada vez mais rápido.',
      destaque: ['estágios', 'leve', 'rápido'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        Object.assign(E, { y: -10000, ceu: 0, chama1: 0, chama2: 0, separou: -1 });
        foguete.visible = false;
        apresentar(lt, b, lt < 2 ? 'cima' : 'aponta');
      },
    },
    {
      fala: 'Mas se ele só subir reto, a gravidade puxa ele de volta pra Terra.',
      destaque: ['reto', 'gravidade', 'volta'],
      corteSeco: true,
      camera: { pos: [0, ESP + 40, 210], alvo: [0, ESP + 40, 0] },
      aplicar(lt, b) {
        foguete.visible = false;
        voce.visible = false;
        E.espaco = true;
        E.queda = lt;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('volta'), 'CAINDO DE VOLTA'),
    },
    {
      fala: 'Então ele vira de lado, e acelera até vinte e oito mil quilômetros por hora. Aí ele continua caindo... mas cai em volta da Terra, sem nunca chegar no chão.',
      destaque: ['lado', 'vinte', 'volta'],
      camera: { pos: [0, ESP, 240], alvo: [0, ESP, 0] },
      aplicar(lt, b) {
        E.espaco = true;
        E.queda = -1;
        E.orbita = lt;
      },
      camada: (lt, b) => cartao(lt, b.palavra('vinte'), '28.000 km/h', 'VELOCIDADE PRA FICAR EM ÓRBITA'),
    },
    {
      fala: 'Isso é estar em órbita. E é por isso que os astronautas flutuam: eles estão caindo junto com a nave!',
      destaque: ['órbita', 'flutuam', 'caindo'],
      corteSeco: true,
      camera: { pos: [200, ESP + 0.4, 7], alvo: [200, ESP + 0.2, 0] },
      aplicar(lt, b) {
        E.espaco = true;
        E.orbita = 10;
        voce.visible = true;
        voce.position.set(200, ESP - 1.2 + 0.25 * Math.sin(lt * 1.5), 0.5);
        voce.rotation.set(0.15 * Math.sin(lt), lt * 0.5, 0.25 * Math.sin(lt * 0.8));
        voce.estado = { bracos: 'cima', expr: 'feliz', falando: false };
      },
    },
    {
      fala: 'Parabéns: você construiu um foguete!',
      destaque: ['parabéns', 'foguete'],
      camera: { pos: [200, ESP + 0.4, 7], alvo: [200, ESP + 0.2, 0] },
      aplicar(lt, b) {
        E.espaco = true;
        voce.visible = true;
        voce.position.set(200, ESP - 1.2 + 0.25 * Math.sin(lt * 1.5), 0.5);
        voce.rotation.set(0, lt * 1.6, 0.4 * Math.sin(lt));
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 0 };
      },
      sons: [{ em: 'parabens', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        E.espaco = false;
        foguete.visible = true;
        Object.assign(E, { y: 0, chama1: 0, chama2: 0, ceu: 0, separou: -1, comb1: 1, ox1: 1 });
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial() { foguete.visible = true; inicial(); },
    sempre(t) {
      montar(t);
      voce.animar(t);
    },
  };
}
