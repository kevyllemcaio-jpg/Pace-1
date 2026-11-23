// PARTE 2 — "E SE A SUA SORTE FOSSE A ÚNICA COISA ENTRE VOCÊ E UM MONSTRO GIGANTE?"
// Continuação de rpg-sorte.js (mesmo herói, slime, criatura e interface). Noite no campo.
// A classe secreta é "Apostador do Destino": cada golpe depende de um dado de 20 lados (d20 holográfico).
// Tira 1 (golpe ridículo), descobre a regra escondida (quanto mais perto da morte, mais sorte),
// tira 20, o slime vira uma lança de luz e derruba a criatura… que fala: a sorte dele é emprestada dela.
// Roteiro e cenas originais.
import * as THREE from 'three';
import { suave, lim, mistura, salto } from '../motor.js';
import { criarPersonagemFlat } from '../personagem-flat.js';
import { criarCampo, criarSlime, criatura, particulas, brilho } from '../cenarios/campo-rpg.js';
import { luzCinema } from '../estilo-cinema.js';
import { CSS, vinheta, textoTela, painel, linhaAtr, tag, glitch } from '../hud-rpg.js';

export const config = {
  velocidade: '+8%',
  ritmo: 'corrido',
  pausa: 0.16,
  voz: 'pt-BR-AntonioNeural',
  legendaTopo: 900,
};

const MZ = -100; // a criatura fica atrás do lago, de frente para o herói

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 42; camera.near = 0.05; camera.far = 900; camera.updateProjectionMatrix();
  ctx.sol.shadow.mapSize.set(4096, 4096);
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.3;

  const campo = criarCampo(ctx);
  const brilhos = particulas(cena, [0, 0, 0], { n: 220, tam: [14, 5, 14], cor: '#CFC8FF', pt: 0.08 });
  const heroi = criarPersonagemFlat({ roupa: '#E2D3B0', calca: '#7A5534', cabelo: '#3A2418', pele: '#EDB487', escCabeca: 1.28 });
  const slime = criarSlime();
  const monstro = criatura(); monstro.scale.setScalar(1.6); cena.add(heroi, slime, monstro);
  const maoBrilho = brilho('#FFD54A', 0.6, 0); heroi.bracos[0].add(maoBrilho); maoBrilho.position.set(0, -0.68, 0.05);

  // dado d20 holográfico
  const dado = new THREE.Group();
  const d20 = new THREE.IcosahedronGeometry(0.26, 0);
  dado.add(new THREE.Mesh(d20, new THREE.MeshBasicMaterial({ color: '#58C8FF', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending })));
  dado.add(new THREE.LineSegments(new THREE.EdgesGeometry(d20), new THREE.LineBasicMaterial({ color: '#E6FAFF' })));
  const dadoAura = brilho('#58C8FF', 1.3, 0.6); dado.add(dadoAura);
  cena.add(dado);
  // tirinho de energia (golpe fraco) e lança de luz
  const faisca = brilho('#9AE6FF', 0.5, 1); cena.add(faisca);
  const lanca = new THREE.Group();
  const LM = new THREE.MeshBasicMaterial({ color: '#9AF0FF', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 10), LM); haste.rotation.x = Math.PI / 2; lanca.add(haste);
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.45, 12), LM); ponta.rotation.x = -Math.PI / 2; ponta.position.z = -1.3; lanca.add(ponta);
  const lancaAura = brilho('#58C8FF', 0.8, 0.9); lanca.add(lancaAura);
  cena.add(lanca);
  const rastro = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.25, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#7FE6FF', transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); cena.add(rastro);
  const explosao = brilho('#E8FBFF', 30, 0); cena.add(explosao);
  const explosaoOuro = brilho('#FFD54A', 3, 0); cena.add(explosaoOuro);
  // garra gigante (passa rente à cabeça do herói)
  const garra = new THREE.Group();
  const escuro = new THREE.MeshBasicMaterial({ color: '#120A1C' });
  const palma = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 14), escuro); palma.scale.set(1.3, 0.8, 1); garra.add(palma);
  [-1, 0, 1].forEach((k) => { const u = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.4, 10), escuro); u.position.set(k * 1.0, -1.9, 0.6); u.rotation.set(Math.PI + 0.5, 0, k * 0.15); garra.add(u); });
  const braco = new THREE.Mesh(new THREE.CapsuleGeometry(1.3, 9, 6, 12), escuro); braco.position.set(-5.5, 1.5, 0); braco.rotation.z = Math.PI / 2 - 0.3; garra.add(braco);
  cena.add(garra);
  // vínculo herói <-> criatura (linha de luz)
  const vinculo = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 8), new THREE.MeshBasicMaterial({ color: '#FFD54A', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); cena.add(vinculo);
  const liga = (m, A, B) => { const a = new THREE.Vector3(...A), b = new THREE.Vector3(...B); m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(1, a.distanceTo(b), 1); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize()); };

  let E;
  function inicial() {
    E = { treme: 0 };
    heroi.position.set(0, 0, 0); heroi.rotation.set(0, Math.PI, 0); heroi.estado = { bracos: 'normal', expr: 'serio' };
    if (slime.parent !== heroi.tronco) heroi.tronco.add(slime);
    slime.visible = true; slime.position.set(-0.2, 0.62, 0); slime.scale.setScalar(0.4); slime.rotation.set(0, 0, 0); slime.estado = { pulo: 0, poder: 0.2 };
    monstro.visible = true; monstro.position.set(4, 0, MZ); monstro.rotation.set(0, 0, 0); monstro.ombros.forEach((o) => o.rotation.set(0, 0, 0));
    maoBrilho.material.opacity = 0.5; maoBrilho.scale.setScalar(0.8);
    dado.visible = false; faisca.visible = false; lanca.visible = false; rastro.visible = false; garra.visible = false; vinculo.visible = false;
    explosao.material.opacity = 0; explosaoOuro.material.opacity = 0;
  }
  function sempre(t) {
    ctx.centro = [0, 0, 0];
    luzCinema(ctx, 'noite');
    campo.animar(t); brilhos.animar(t);
    heroi.animar(t); slime.animar(t);
    monstro.aura.material.opacity = 0.3 + 0.1 * Math.sin(t * 2);
    dado.rotation.x += 0; // girado em aplicar
    lancaAura.material.opacity = 0.7 + 0.3 * Math.sin(t * 20);
  }
  const T = (b, lt) => b.inicio + lt;
  const mao = (pose, k = 1) => (lt, b) => {
    const p = typeof pose === 'function' ? pose(lt, b) : pose; const tt = T(b, lt), tr = E.treme;
    return { pos: p.pos.map((v, i) => v + Math.sin(tt * (0.7 + i * 0.3) + i) * 0.03 * k + (tr ? Math.sin(tt * 55 + i * 2) * 0.06 * tr : 0)), alvo: p.alvo };
  };
  const tela = (lt, b, extra = '') => CSS + vinheta + extra;
  // dado: gira rápido e para mostrando `valor` a partir de `para` (s)
  function rolar(lt, ini, para, pos) {
    dado.visible = lt > ini; dado.position.set(...pos);
    const k = lim((lt - ini) / Math.max(0.1, para - ini));
    const giro = (1 - (1 - k) ** 3) * 18;
    dado.rotation.set(giro * 1.1, giro * 0.8, giro * 0.5);
    dado.position.y = pos[1] + Math.sin(k * Math.PI) * 0.5;
    return k >= 1;
  }
  const numDado = (n, cor) => `<span style="font-size:64px;color:${cor}">${n}</span>`;

  const blocos = [
    {
      fala: 'E se a sua sorte fosse a única coisa entre você e um monstro gigante?',
      destaque: ['sorte', 'monstro'],
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [mistura(-2.5, 0.8, k), mistura(0.6, 1.4, k), mistura(5, 3.2, k)], alvo: [mistura(0, 2, k), mistura(2, 26, k), mistura(0, MZ, k)] }; },
      aplicar(lt, b) { heroi.estado = { bracos: 'normal', expr: 'serio' }; },
      camada: (lt, b) => tela(lt, b, `<div style="position:absolute;left:0;right:0;top:110px;text-align:center"><span style="font-family:Inter,sans-serif;font-weight:900;font-size:30px;color:#111;background:#FFD21F;padding:6px 18px;border-radius:10px">PARTE 2</span></div>` + textoTela('Sorte <b>vs</b><br>monstro', lt, 0.3).replace('top:150px', 'top:180px')),
      sons: [{ em: () => 0.05, tipo: 'tensao' }, { em: 'monstro', tipo: 'uivo' }],
    },
    {
      fala: 'Aquela criatura tinha acordado. E vinha direto na minha direção.',
      destaque: ['acordado', 'direção'],
      corteSeco: true,
      camera: mao({ pos: [6, 1.2, 8], alvo: [2, 24, MZ + 10] }, 1),
      aplicar(lt, b) {
        const passo = lim((lt - b.palavra('vinha')) / 1.6);
        monstro.position.z = MZ + passo * 8; monstro.position.y = Math.abs(Math.sin(passo * Math.PI * 2)) * 0.8;
        E.treme = passo > 0 && passo < 1 ? (Math.abs(Math.sin(passo * Math.PI * 2)) < 0.25 ? 1.2 : 0.2) : 0;
        monstro.olhos.forEach((o, i) => { if (i % 2) o.material.opacity = 0.9 + 0.1 * Math.sin(T(b, lt) * 8); });
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'acordado', tipo: 'uivo' }, { em: 'vinha', tipo: 'baque' }, { em: 'direção', tipo: 'baque' }],
    },
    {
      fala: 'Foi aí que o sistema abriu a minha classe secreta pela primeira vez.',
      destaque: ['classe', 'secreta'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.35, 1.7, mistura(-2.9, -2.4, lt / b.dur)], alvo: [0, 1.65, 0] }), 0.4),
      aplicar(lt, b) { E.treme = 0; monstro.position.set(4, 0, MZ + 8); heroi.estado = { bracos: 'normal', expr: 'surpreso' }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t">CLASSE SECRETA</div><div style="font-size:34px;font-weight:900">${lt < b.palavra('primeira') ? glitch('CARREGANDO...', T(b, lt)) : 'ABRINDO PELA 1ª VEZ...'}</div>`, { top: 230, abre: b.palavra('classe') - 0.1, fecha: 99 })),
      sons: [{ em: 'sistema', tipo: 'plim' }, { em: 'secreta', tipo: 'subida' }],
    },
    {
      fala: 'E o nome dela era... Apostador do Destino.',
      destaque: ['apostador', 'destino'],
      pausaDepois: 0.2,
      camera: mao((lt, b) => ({ pos: [0.2, 1.7, mistura(-2.4, -1.9, suave(lt / b.dur))], alvo: [0, 1.7, 0] }), 0.4),
      aplicar(lt, b) { const k = lt > b.palavra('apostador'); heroi.estado = { bracos: k ? 'abre' : 'normal', expr: k ? 'feliz' : 'surpreso' }; maoBrilho.material.opacity = k ? 0.9 : 0.5; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t" style="color:#FFE9A0">CLASSE SECRETA</div><div style="font-size:44px;font-weight:900;line-height:1.1;color:#FFD21F">APOSTADOR<br>DO DESTINO</div><div style="font-size:22px;margin-top:8px;color:#BFF0FF">Raridade: ÚNICA (1 em 10 milhões)</div>`, { top: 230, abre: b.palavra('apostador') - 0.1, borda: '#FFD21F', fecha: 99 })),
      sons: [{ em: 'dela', tipo: 'tensao' }, { em: 'apostador', tipo: 'sino' }, { em: 'apostador', tipo: 'brilho' }],
    },
    {
      fala: 'Cada ataque meu depende de um dado.',
      destaque: ['dado'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [1.0, 2.1, -2.6], alvo: [0.1, 2.0, 0] }), 0.5),
      aplicar(lt, b) { heroi.estado = { bracos: 'olhaMao', expr: 'surpreso' }; rolar(lt, b.palavra('dado') - 0.3, b.dur + 5, [0.3, 2.45, -0.3]); dado.scale.setScalar(Math.max(0.01, salto(lim((lt - b.palavra('dado') + 0.3) / 0.4)))); },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('dado') + 0.2 ? tag(camera, [0.3, 2.85, -0.3], 'D20 · DADO DO DESTINO') : ''),
      sons: [{ em: 'dado', tipo: 'pop' }, { em: 'dado', depois: 0.1, tipo: 'brilho' }],
    },
    {
      fala: 'Se cair um número alto, o golpe é devastador.',
      destaque: ['alto', 'devastador'],
      corteSeco: true,
      camera: mao({ pos: [-1.2, 1.4, -3.4], alvo: [0.2, 1.9, 0] }),
      aplicar(lt, b) { dado.scale.setScalar(1); dado.visible = true; dado.position.set(0.3, 2.45, -0.3); dado.rotation.set(T(b, lt) * 0.8, T(b, lt), 0); heroi.estado = { bracos: lt > b.palavra('devastador') ? 'cima' : 'normal', expr: 'feliz' }; explosaoOuro.position.set(0, 1.6, 0); explosaoOuro.scale.setScalar(4); explosaoOuro.material.opacity = lt > b.palavra('devastador') ? 0.5 * (1 - lim((lt - b.palavra('devastador')) / 0.8)) : 0; },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('alto') ? tag(camera, [0.3, 2.85, -0.3], `20 = ${'<b style="color:#FFD21F">CRÍTICO</b>'}`, '#FFD21F') : ''),
      sons: [{ em: 'alto', tipo: 'moeda' }, { em: 'devastador', tipo: 'impacto' }],
    },
    {
      fala: 'Se cair um número baixo... bom, aí é problema.',
      destaque: ['baixo', 'problema'],
      camera: mao({ pos: [-0.9, 1.5, -3.0], alvo: [0.1, 1.8, 0] }),
      aplicar(lt, b) { explosaoOuro.material.opacity = 0; dado.visible = true; dado.position.set(0.3, 2.45, -0.3); dado.rotation.set(T(b, lt) * 0.8, T(b, lt), 0); heroi.estado = { bracos: lt > b.palavra('problema') ? 'cabeca' : 'normal', expr: lt > b.palavra('bom') ? 'medo' : 'neutro' }; },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('baixo') ? tag(camera, [0.3, 2.85, -0.3], '1 = <b style="color:#FF6B6B">FALHA</b>', '#FF6B6B') : ''),
      sons: [{ em: 'problema', tipo: 'baque' }],
    },
    {
      fala: 'Primeiro ataque. Eu rolei o dado...',
      destaque: ['primeiro', 'dado'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.9, 2.0, mistura(2.6, 2.0, lt / b.dur)], alvo: [0.2, 2.1, -0.4] }), 0.4),
      aplicar(lt, b) { heroi.estado = { bracos: 'aponta', expr: 'serio' }; rolar(lt, b.palavra('rolei') - 0.1, b.dur + 2, [0.3, 2.45, -0.3]); dado.scale.setScalar(1); },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'rolei', tipo: 'contador' }],
    },
    {
      fala: 'E caiu um.',
      destaque: ['um'],
      corteSeco: true,
      camera: mao({ pos: [0.7, 2.4, 1.9], alvo: [0.3, 2.45, -0.3] }, 0.3),
      aplicar(lt, b) { dado.visible = true; dado.position.set(0.3, 2.45, -0.3); dado.rotation.set(0.4, 0.6, 0.2); dado.children[0].material.color.set('#FF6B6B'); },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('um') ? tag(camera, [0.3, 2.75, -0.3], numDado(1, '#FF6B6B'), '#FF6B6B') : ''),
      sons: [{ em: 'um', tipo: 'tum' }],
    },
    {
      fala: 'O meu golpe saiu assim: ploc.',
      destaque: ['ploc'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [3.5, 1.4, -3], alvo: [mistura(0, 3, lim(lt / b.dur)), mistura(2, 18, lim(lt / b.dur)), mistura(-2, MZ + 8, lim(lt / b.dur))] })),
      aplicar(lt, b) {
        dado.visible = false; dado.children[0].material.color.set('#58C8FF');
        heroi.estado = { bracos: 'aponta', expr: 'serio' };
        const k = lim((lt - 0.2) / 1.1);
        faisca.visible = k > 0 && k < 1; faisca.position.set(mistura(0.2, 4, k), mistura(1.6, 19, k), mistura(-0.6, MZ + 14, k)); faisca.scale.setScalar(mistura(0.35, 2.5, k));
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('ploc') ? tag(camera, [4, 26, MZ + 14], 'DANO: <b style="color:#FF6B6B">1</b>', '#FF6B6B') : ''),
      sons: [{ em: () => 0.2, tipo: 'zap' }, { em: 'ploc', tipo: 'pop' }],
    },
    {
      fala: 'O monstro nem percebeu. E o slime me olhou com uma cara de decepção.',
      destaque: ['nem', 'decepção'],
      corteSeco: true,
      camera: mao((lt, b) => (lt < b.palavra('slime') - 0.1 ? { pos: [-6, 1.0, 6], alvo: [3, 28, MZ + 8] } : { pos: [0.55, 1.75, -1.2], alvo: [0.2, 1.62, 0] }), 0.4),
      aplicar(lt, b) { faisca.visible = false; const s = lt > b.palavra('olhou'); slime.estado = { pulo: 0, poder: 0.1, triste: s }; slime.rotation.y = s ? Math.PI * 0.8 : 0; heroi.estado = { bracos: 'normal', expr: 'medo' }; },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('nem') && lt < b.palavra('slime') - 0.1 ? tag(camera, [4, 62, MZ + 8], 'HP: 99.999 / 100.000', '#FF6B6B') : ''),
      sons: [{ em: 'nem', tipo: 'tique' }, { em: 'decepção', tipo: 'baque' }],
    },
    {
      fala: 'Aí a criatura atacou.',
      destaque: ['atacou'],
      corteSeco: true,
      camera: mao({ pos: [8, 2, 10], alvo: [3, 26, MZ + 8] }),
      aplicar(lt, b) { slime.estado = { pulo: 0, poder: 0.1 }; slime.rotation.y = 0; const k = suave((lt - b.palavra('atacou') + 0.3) / 0.8); monstro.ombros[1].rotation.x = -1.1 * k; monstro.ombros[1].rotation.z = 0.3 * k; E.treme = k > 0.6 ? 0.8 : 0; },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'criatura', tipo: 'uivo' }, { em: 'atacou', tipo: 'whoosh' }],
    },
    {
      fala: 'E, por pura sorte, a garra passou a um centímetro da minha cabeça.',
      destaque: ['sorte', 'centímetro'],
      corteSeco: true,
      camera: mao({ pos: [0.6, 1.4, -3.2], alvo: [0, 1.8, 0] }, 0.6),
      aplicar(lt, b) {
        E.treme = 0; monstro.ombros[1].rotation.set(0, 0, 0);
        const tg = b.palavra('garra') - 0.1, k = lim((lt - tg) / 0.55);
        garra.visible = k > 0 && k < 1; garra.position.set(mistura(-14, 14, k), 2.55, 0); garra.rotation.set(0, 0, -0.2);
        const abaixa = lt > tg - 0.15;
        heroi.position.y = abaixa ? -0.25 * (1 - lim((lt - tg - 0.8) / 0.4)) : 0;
        heroi.estado = { bracos: abaixa ? 'cabeca' : 'normal', expr: 'medo' };
        E.treme = k > 0 && k < 1 ? 1 : 0;
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('centímetro') ? tag(camera, [0, 2.7, 0], 'ESQUIVA DE SORTE!', '#FFD21F') : ''),
      sons: [{ em: 'garra', depois: -0.1, tipo: 'whoosh' }, { em: 'centímetro', tipo: 'plim' }],
    },
    {
      fala: 'Foi quando eu entendi a regra escondida da minha classe.',
      destaque: ['regra', 'escondida'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.3, 1.75, mistura(-3.0, -2.4, suave(lt / b.dur))], alvo: [0, 1.7, 0] }), 0.4),
      aplicar(lt, b) { garra.visible = false; E.treme = 0; heroi.position.y = 0; heroi.estado = { bracos: 'normal', expr: 'surpreso' }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t">REGRA ESCONDIDA</div><div style="font-size:30px;font-weight:900">${lt < b.palavra('classe') ? glitch('?????????????', T(b, lt)) : 'DESBLOQUEADA'}</div>`, { top: 230, abre: b.palavra('regra') - 0.1, fecha: 99 })),
      sons: [{ em: 'regra', tipo: 'plim' }, { em: 'classe', tipo: 'brilho' }],
    },
    {
      fala: 'Quanto mais perto da morte, maior a minha sorte.',
      destaque: ['morte', 'sorte'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.25, 1.7, mistura(-2.6, -2.2, suave(lt / b.dur))], alvo: [0, 1.6, 0] }), 0.4),
      aplicar(lt, b) { heroi.estado = { bracos: 'olhaMao', expr: 'serio' }; maoBrilho.material.opacity = 0.5 + 0.5 * lim((lt - b.palavra('sorte')) / 0.6); maoBrilho.scale.setScalar(0.8 + lim((lt - b.palavra('sorte')) / 0.6)); },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('morte')) / (b.dur - b.palavra('morte') - 0.2));
        const hp = Math.round(100 - k * 97), sorte = Math.round(99 + k * 900);
        return tela(lt, b, painel(lt, b.dur + 1, `<div class="t">STATUS</div>${linhaAtr('VIDA', hp, 100, '#FF5A5A', hp + '%')}${linhaAtr('SORTE', Math.min(sorte, 999) / 10, 99.9, '#FFD21F', sorte)}`, { top: 230, abre: 0.05, fecha: 99 }));
      },
      sons: [{ em: 'morte', tipo: 'coracao' }, { em: 'sorte', tipo: 'contador' }],
    },
    {
      fala: 'Com a vida quase no zero, eu rolei de novo.',
      destaque: ['zero', 'rolei'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.9, 2.0, mistura(2.4, 1.8, lt / b.dur)], alvo: [0.2, 2.1, -0.4] }), 0.4),
      aplicar(lt, b) { heroi.estado = { bracos: 'aponta', expr: 'serio' }; rolar(lt, b.palavra('rolei') - 0.1, b.dur + 2, [0.3, 2.45, -0.3]); dado.scale.setScalar(1); dado.children[0].material.color.set('#FFD54A'); dadoAura.material.color.set('#FFD54A'); maoBrilho.material.opacity = 1; },
      camada: (lt, b) => tela(lt, b, `<div style="position:absolute;inset:0;box-shadow:inset 0 0 160px rgba(255,30,30,${0.35 + 0.15 * Math.sin(T(b, lt) * 7)})"></div>`),
      sons: [{ em: 'zero', tipo: 'coracao' }, { em: 'rolei', tipo: 'contador' }],
    },
    {
      fala: 'Vinte. Acerto crítico.',
      destaque: ['vinte', 'crítico'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.6, 2.4, mistura(1.3, 1.6, lt / b.dur)], alvo: [0.3, 2.45, -0.3] }), 0.3),
      aplicar(lt, b) { dado.visible = true; dado.position.set(0.3, 2.45, -0.3); dado.rotation.set(0.4, 0.6 + lt * 0.3, 0.2); explosaoOuro.position.set(0.3, 2.45, -0.3); explosaoOuro.scale.setScalar(2 + lim(lt / 0.6) * 4); explosaoOuro.material.opacity = 0.9 * (1 - lim(lt / 1.2)); },
      camada: (lt, b) => tela(lt, b, tag(camera, [0.3, 2.75, -0.3], numDado(20, '#FFD21F'), '#FFD21F') + textoTela('Acerto<br><b>crítico!</b>', lt, b.palavra('crítico') - 0.1) + (lt < 0.25 ? `<div style="position:absolute;inset:0;background:#FFE9A0;opacity:${0.7 * (1 - lt / 0.25)}"></div>` : '')),
      sons: [{ em: 'vinte', tipo: 'moeda' }, { em: 'vinte', tipo: 'sino' }, { em: 'crítico', tipo: 'impacto' }],
    },
    {
      fala: 'O slime absorveu o golpe... e virou uma lança de luz.',
      destaque: ['slime', 'lança'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [1.3, 1.9, mistura(-2.6, -2.2, lt / b.dur)], alvo: [0.1, 1.6, 0] }), 0.4),
      aplicar(lt, b) {
        dado.visible = false; explosaoOuro.material.opacity = 0;
        const kv = lim((lt - b.palavra('virou')) / 0.5);
        slime.visible = kv < 0.5; slime.estado = { pulo: 0, poder: 0.5 * Math.min(1, lim(lt / 0.8) + kv) };
        slime.scale.setScalar(0.4 * (1 + lim(lt / 0.8) * 0.4) * (1 - kv));
        lanca.visible = kv > 0.2;
        if (lanca.parent !== heroi.bracos[0]) heroi.bracos[0].add(lanca);
        lanca.position.set(0, -0.68, 0.05); lanca.rotation.set(-Math.PI / 2, 0, 0); lanca.scale.setScalar(Math.max(0.01, salto(kv)));
        heroi.estado = { bracos: kv > 0 ? 'aponta' : 'normal', expr: kv > 0 ? 'feliz' : 'surpreso' };
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('lança') ? tag(camera, [0.6, 2.4, -1], 'ARMA: LANÇA DE SLIME ★', '#7FE6FF') : ''),
      sons: [{ em: 'absorveu', tipo: 'subida' }, { em: 'virou', tipo: 'brilho' }, { em: 'lança', tipo: 'sino' }],
    },
    {
      fala: 'E a lança atravessou a criatura de um lado pro outro.',
      destaque: ['atravessou'],
      corteSeco: true,
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [mistura(-2, -5, k), mistura(1.6, 3, k), mistura(3, 6, k)], alvo: [mistura(0, 3, k), mistura(2, 24, k), mistura(-3, MZ + 8, k)] }; },
      aplicar(lt, b) {
        slime.visible = false;
        const tl = b.palavra('lança') - 0.1, k = lim((lt - tl) / 0.7);
        heroi.estado = { bracos: k > 0 ? 'aponta' : 'cima', expr: 'serio' };
        if (lanca.parent !== cena) cena.add(lanca);
        lanca.visible = k < 1; lanca.scale.setScalar(k > 0 ? 3 : 1);
        const A = new THREE.Vector3(0.2, 1.8, -0.6), Bp = new THREE.Vector3(4, 22, MZ + 14);
        const P = A.clone().lerp(Bp, k); lanca.position.copy(P); lanca.lookAt(Bp.clone().add(Bp.clone().sub(A)));
        lanca.rotateY(Math.PI);
        rastro.visible = k > 0 && k < 1; const a = A.toArray(); const pp = P.toArray(); liga(rastro, a, pp); rastro.material.opacity = 0.7;
        const ke = lim((lt - tl - 0.7) / 0.9);
        explosao.position.copy(Bp); explosao.material.opacity = ke > 0 ? 0.95 * (1 - ke) : 0; explosao.scale.setScalar(20 + ke * 40);
        E.treme = ke > 0 && ke < 1 ? 1.2 : 0;
      },
      camada: (lt, b) => { const ke = lim((lt - b.palavra('lança') - 0.6) / 0.3); return tela(lt, b, ke > 0 && ke < 1 ? `<div style="position:absolute;inset:0;background:#E8FBFF;opacity:${0.7 * (1 - ke)}"></div>` : ''); },
      sons: [{ em: 'lança', tipo: 'zap' }, { em: 'atravessou', tipo: 'impacto' }, { em: 'outro', tipo: 'quebra' }],
    },
    {
      fala: 'Ela caiu de joelhos.',
      destaque: ['joelhos'],
      corteSeco: true,
      camera: mao({ pos: [7, 1.2, 9], alvo: [3, 20, MZ + 8] }),
      aplicar(lt, b) { lanca.visible = false; rastro.visible = false; explosao.material.opacity = 0; const k = suave((lt - b.palavra('caiu') + 0.1) / 0.8); monstro.position.set(4, -12 * k, MZ + 8); monstro.rotation.x = 0.12 * k; E.treme = k > 0.8 && k < 1 ? 1.5 : 0; heroi.estado = { bracos: 'normal', expr: 'feliz' }; },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'joelhos', tipo: 'baque' }, { em: 'joelhos', depois: 0.1, tipo: 'impacto' }],
    },
    {
      fala: 'Mas, em vez de desaparecer, ela fez uma coisa que eu não esperava.',
      destaque: ['desaparecer', 'esperava'],
      pausaDepois: 0.4,
      camera: mao((lt, b) => ({ pos: [0.8, 1.1, mistura(3.6, 2.8, suave(lt / b.dur))], alvo: [2, 18, MZ + 8] })),
      aplicar(lt, b) { E.treme = 0; monstro.position.set(4, -12, MZ + 8); monstro.rotation.x = 0.12; heroi.estado = { bracos: 'normal', expr: 'surpreso' }; slime.visible = true; slime.scale.setScalar(0.4); slime.estado = { pulo: 0, poder: 0.2 }; },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'coisa', tipo: 'tensao' }],
    },
    {
      fala: 'Ela falou.',
      destaque: ['falou'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [4, 31, mistura(MZ + 85, MZ + 78, lt / b.dur)], alvo: [4, 31, MZ + 8] }), 0.3),
      aplicar(lt, b) { monstro.position.set(4, -12, MZ + 8); monstro.rotation.x = 0.12; },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'falou', tipo: 'sussurro' }],
    },
    {
      fala: 'Essa sorte não é sua, garoto. Ela é minha.',
      destaque: ['não', 'minha'],
      voz: 'pt-BR-AntonioNeural', velocidade: '-14%', tom: '-32Hz', // voz grossa da criatura
      camera: mao((lt, b) => ({ pos: [4, 31, mistura(MZ + 78, MZ + 66, suave(lt / b.dur))], alvo: [4, 31, MZ + 8] }), 0.3),
      aplicar(lt, b) { monstro.olhos.forEach((o, i) => { if (i % 2) o.scale.setScalar(7 + Math.sin(T(b, lt) * 12) * (b.falando(lt) ? 1.5 : 0.2)); }); E.treme = b.falando(lt) ? 0.35 : 0; },
      camada: (lt, b) => tela(lt, b, `<div style="position:absolute;inset:0;box-shadow:inset 0 0 200px rgba(160,20,40,.45)"></div>`),
      sons: [{ em: 'minha', tipo: 'uivo' }],
    },
    {
      fala: 'E o sistema confirmou: a minha sorte estava ligada a ela.',
      destaque: ['ligada'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [-3.5, 2.2, mistura(4.5, 5.5, lt / b.dur)], alvo: [1.5, 10, -40] })),
      aplicar(lt, b) {
        E.treme = 0; monstro.olhos.forEach((o, i) => { if (i % 2) o.scale.setScalar(7); });
        heroi.estado = { bracos: 'olhaMao', expr: 'medo' };
        const k = lim((lt - b.palavra('ligada') + 0.2) / 0.6);
        vinculo.visible = k > 0; const A = [0.25, 0.9, 0.3], B = [4, 14, MZ + 18];
        liga(vinculo, A, [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k]);
        vinculo.material.opacity = 0.6 + 0.3 * Math.sin(T(b, lt) * 10);
      },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t" style="color:#FFE9A0">VÍNCULO DETECTADO</div><div style="font-size:30px;font-weight:900">SORTE ⇄ CRIATURA</div>${linhaAtr('LIGAÇÃO', 10, 10, '#FFD21F', '100%')}`, { top: 220, abre: b.palavra('confirmou') - 0.1, borda: '#FFD21F', fecha: 99 })),
      sons: [{ em: 'confirmou', tipo: 'plim' }, { em: 'ligada', tipo: 'tensao' }],
    },
    {
      fala: 'Se ela morresse... a minha sorte ia junto.',
      destaque: ['morresse', 'junto'],
      corteSeco: true,
      pausaDepois: 0.3,
      camera: mao((lt, b) => ({ pos: [0.3, 1.75, mistura(-2.8, -2.0, suave(lt / b.dur))], alvo: [0, 1.7, 0] }), 0.4),
      aplicar(lt, b) { vinculo.visible = false; heroi.estado = { bracos: 'normal', expr: lt > b.palavra('junto') ? 'medo' : 'serio' }; maoBrilho.material.opacity = 0.9 * (1 - 0.8 * lim((lt - b.palavra('junto')) / 0.6)); },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('junto') ? painel(lt, b.dur + 1, `<div class="t" style="color:#FF8A8A">AVISO</div>${linhaAtr('SORTE', 9.9 * (1 - lim((lt - b.palavra('junto')) / 0.8)), 99.9, '#FFD21F', Math.round(999 * (1 - lim((lt - b.palavra('junto')) / 0.8))))}`, { top: 240, abre: b.palavra('junto'), borda: '#FF6B6B', fecha: 99 }) : ''),
      sons: [{ em: 'morresse', tipo: 'coracao' }, { em: 'junto', tipo: 'baque' }],
    },
    {
      fala: 'E aí, o que você faria? Salvaria o mundo... ou a sua sorte?',
      destaque: ['mundo', 'sorte'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [mistura(-1.5, 1.5, suave(lt / b.dur)), 1.3, mistura(-4.2, -3.4, suave(lt / b.dur))], alvo: [0, 2.5, MZ * 0.3] })),
      aplicar(lt, b) { heroi.estado = { bracos: 'normal', expr: 'serio' }; maoBrilho.material.opacity = 0.6; },
      camada: (lt, b) => tela(lt, b, (lt > b.palavra('mundo') ? `<div style="position:absolute;left:40px;right:40px;top:170px;display:flex;justify-content:space-between;font-family:Inter,sans-serif;font-weight:900;font-size:40px;-webkit-text-stroke:9px #111;paint-order:stroke fill"><span style="color:#7FE0FF;transform:scale(${salto((lt - b.palavra('mundo')) / 0.3)})">🌍 MUNDO</span><span style="color:#FFD21F;opacity:${lt > b.palavra('sorte') ? 1 : 0};transform:scale(${Math.max(0.01, salto((lt - b.palavra('sorte')) / 0.3))})">SORTE 🍀</span></div>` : '') + (lt > b.dur - 1.6 ? `<div style="position:absolute;left:0;right:0;top:600px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:70px;color:#fff;-webkit-text-stroke:12px #111;paint-order:stroke fill">PARTE <span style="color:#FFD21F">3?</span></div>` : '')),
      sons: [{ em: 'mundo', tipo: 'pop' }, { em: 'sorte', tipo: 'pop' }],
    },
  ];
  blocos[blocos.length - 1].pausaDepois = 1.6;

  return { blocos, inicial, sempre };
}
