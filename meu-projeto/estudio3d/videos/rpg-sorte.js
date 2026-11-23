// "E SE VOCÊ ENTRASSE NUM MUNDO DE RPG ONDE A SUA SORTE DECIDE O SEU DESTINO?"
// Cartoon 3D (personagens com cabeça um pouco grande, dois tons + contorno), campo de grama que balança,
// lago e montanhas; cidade medieval com o painel do sistema; sala escura com 3 itens; capacete de
// leitura; classe secreta; assassino encapuzado com duas adagas; slime azul com poder desconhecido;
// criatura sombria gigante no final. Interface de RPG holográfica azul (HTML por cima do 3D).
// Roteiro, personagens e cenas originais.
import * as THREE from 'three';
import { suave, lim, mistura, salto } from '../motor.js';
import { criarPersonagemFlat } from '../personagem-flat.js';
import { criarCampo, criarSlime, espada, anel, armadura, capaceteLeitura, criatura, particulas, coneLuz, anelHolo, cartaoHolo, painelMagico, brilho, arvore } from '../cenarios/campo-rpg.js';
import { criarReino } from '../cenarios/medieval3d.js';
import { luzCinema, rotulo3d } from '../estilo-cinema.js';

export const config = {
  velocidade: '+8%',
  ritmo: 'corrido', // fala emendada; só um respirinho entre as frases (e pausas antes das revelações)
  pausa: 0.16,
  voz: 'pt-BR-AntonioNeural', // narrador brasileiro, jovem e animado
  legendaTopo: 900,
};

const CIDADE = 1000, SALA = 2000;

// ---------------- interface do sistema (HTML) ----------------
const CSS = `<style>
.legenda{text-transform:uppercase;font-family:Inter,sans-serif;font-weight:900;font-size:52px;letter-spacing:.5px}
.hud{position:absolute;font-family:Inter,sans-serif;color:#fff;font-weight:800;border:3px solid #9AE6FF;border-radius:18px;
 background:linear-gradient(180deg,rgba(46,128,214,.62),rgba(18,62,140,.62));box-shadow:0 0 32px rgba(80,190,255,.75),inset 0 0 22px rgba(140,225,255,.35);padding:22px 26px}
.hud .t{font-size:26px;letter-spacing:3px;color:#BFF0FF;margin-bottom:12px}
.hud .l{display:flex;align-items:center;gap:14px;font-size:24px;margin:9px 0}
.hud .l span:first-child{width:200px}
.hud .bar{flex:1;height:16px;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}
.hud .bar i{display:block;height:100%;background:#7FE0FF;border-radius:9px}
.hud .n{width:56px;text-align:right}
.tela{position:absolute;left:30px;right:30px;top:150px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:58px;line-height:1.1;color:#fff;-webkit-text-stroke:11px #111;paint-order:stroke fill;text-transform:uppercase}
.tela b{color:#FFD21F}
.tag{position:absolute;font-family:Inter,sans-serif;font-weight:900;font-size:24px;color:#fff;padding:8px 16px;border-radius:12px;border:3px solid #9AE6FF;background:rgba(20,70,150,.7);box-shadow:0 0 20px rgba(80,190,255,.7);white-space:nowrap;transform:translate(-50%,-100%)}
</style>`;
const vinheta = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,10,30,.35) 100%);pointer-events:none"></div>`;
/** Texto grande no topo (o "texto na tela" da cena), entra com um pulo. */
const textoTela = (txt, lt, ini = 0) => (lt < ini ? '' : `<div class="tela" style="transform:scale(${Math.max(0.01, salto((lt - ini) / 0.35))})">${txt}</div>`);
/** Painel do sistema: abre (escala) e fecha. */
function painel(lt, dur, conteudo, { top = 260, left = 70, w = 580, abre = 0, fecha = null, borda = '#9AE6FF' } = {}) {
  if (lt < abre) return '';
  const fim = fecha ?? dur - 0.25;
  const k = lt > fim ? 1 - lim((lt - fim) / 0.2) : salto((lt - abre) / 0.3);
  if (k <= 0.01) return '';
  return `<div class="hud" style="top:${top}px;left:${left}px;width:${w}px;border-color:${borda};transform:scale(${k},${Math.min(1, k * 1.3)});transform-origin:50% 50%">${conteudo}</div>`;
}
const linhaAtr = (nome, v, max, cor = '#7FE0FF', txt = v) => `<div class="l"><span>${nome}</span><div class="bar"><i style="width:${Math.min(100, (v / max) * 100)}%;background:${cor}"></i></div><span class="n">${txt}</span></div>`;
const tag = (camera, pos, html, cor = '#9AE6FF') => {
  const v = new THREE.Vector3(...pos).project(camera);
  if (v.z > 1) return '';
  return `<div class="tag" style="left:${(v.x + 1) * 360}px;top:${(1 - v.y) * 640}px;border-color:${cor}">${html}</div>`;
};
const glitch = (txt, t) => txt.split('').map((c, i) => (c !== ' ' && Math.sin(t * 40 + i * 7) > 0.6 ? '#$%&?!@'[(i + Math.floor(t * 20)) % 7] : c)).join('');

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 42; camera.near = 0.05; camera.far = 900; camera.updateProjectionMatrix();
  ctx.sol.shadow.mapSize.set(4096, 4096);
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.25;
  const em = (dx) => ({ ...ctx, cena: (() => { const g = new THREE.Group(); g.position.x = dx; cena.add(g); return g; })() });

  // ---------- mundos ----------
  const campo = criarCampo(ctx);
  const brilhos = particulas(cena, [0, 0, 0], { n: 220, tam: [14, 5, 14], cor: '#FFF6C8', pt: 0.09 });
  criarReino(em(CIDADE));
  const cid = em(CIDADE).cena;
  const painelP = painelMagico(7, 9); painelP.position.set(0, 6.2, -17); cid.add(painelP);
  [[-5, -14], [5, -14], [-11, -2], [11, -4]].forEach(([x, z]) => { const a = arvore(1.1); a.position.set(x, 0, z); cid.add(a); });
  const luzLend = coneLuz('#FFD54A', 7, 0.9); luzLend.visible = false; cena.add(luzLend);
  // sala escura dos itens
  const sala = em(SALA).cena;
  const piso = new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshStandardMaterial({ color: '#141A2A', roughness: 0.6 })); piso.rotation.x = -Math.PI / 2; sala.add(piso);
  const fundoSala = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 16, 48, 1, true), new THREE.MeshBasicMaterial({ color: '#070A14', side: THREE.BackSide })); fundoSala.position.y = 8; sala.add(fundoSala);
  const ITENS = [['espada', espada(), '#B07CFF', -1.7], ['anel', anel(), '#FFC930', 0], ['armadura', armadura(), '#5CB0FF', 1.7]].map(([nome, obj, cor, x]) => {
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.6, 24), new THREE.MeshStandardMaterial({ color: '#2A3248', roughness: 0.5 })); ped.position.set(x, 0.3, -2); sala.add(ped);
    const cone = coneLuz(cor, 7, 1.1); cone.position.set(x, 0, -2); sala.add(cone);
    const aura = brilho(cor, 2.2, 0.8); aura.position.set(x, 1.4, -2); sala.add(aura);
    const luz = new THREE.PointLight(cor, 0, 5, 1.5); luz.position.set(x, 2.2, -1.4); sala.add(luz);
    obj.position.set(x, 1.3, -2); sala.add(obj);
    return { nome, obj, cone, aura, luz, x };
  });
  const brilhosSala = particulas(cena, [SALA, 0, -1.5], { n: 120, tam: [7, 4, 4], cor: '#BFD8FF', pt: 0.06 });

  // ---------- elenco (mesma aparência em todas as cenas) ----------
  const heroi = criarPersonagemFlat({ roupa: '#E2D3B0', calca: '#7A5534', cabelo: '#3A2418', pele: '#EDB487', escCabeca: 1.28 });
  const assassino = criarPersonagemFlat({ roupa: '#24252D', calca: '#1A1B21', pele: '#C98B5E', cabeloTipo: 'careca', cabelo: '#1A1B21', tenis: '#1A1B21', capuz: true, adagas: true, escCabeca: 1.22 });
  const slime = criarSlime();
  cena.add(heroi, assassino, slime);
  const capL = capaceteLeitura(); capL.visible = false; heroi.cabeca.add(capL);
  const fumaca = Array.from({ length: 8 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: '#111118', transparent: true, opacity: 0, depthWrite: false })); s.material.map = brilho('#000', 1).material.map; cena.add(s); return s; });
  const aldeoes = [['#8C3B2E', '#5A3A22', 'coque', '#E9A97A'], ['#3E6B4A', '#4A3B33', 'curto', '#C98B5E'], ['#6B4A8A', '#3A2A20', 'careca', '#8D5524'], ['#A0692E', '#3A2A20', 'curto', '#F0C49C'], ['#2F6FB2', '#3A3A44', 'coque', '#C98B5E'], ['#B5543B', '#4A3B33', 'curto', '#E9A97A'], ['#5A7A3A', '#3A2A20', 'curto', '#8D5524']].map(([roupa, calca, cab, pele], i) => {
    const a = criarPersonagemFlat({ roupa, calca, cabeloTipo: cab, pele, escCabeca: 1.22 });
    a.position.set(CIDADE - 3.3 + (i % 4) * 2.1 + (i > 3 ? 1 : 0), 0, -10.5 - (i > 3 ? 1.6 : 0)); a.rotation.y = Math.PI + (i % 2 ? 0.15 : -0.15);
    cena.add(a); return a;
  });
  // classes comuns (hologramas atrás do herói)
  const classes = [['GUERREIRO', '#9A2B2B', -2.1, -1.6], ['MAGO', '#4A2E8A', 0, -2.6], ['ARQUEIRO', '#2E6B3A', 2.1, -1.6]].map(([nome, roupa, x, z]) => {
    const p = criarPersonagemFlat({ roupa, calca: '#3A2A20', escCabeca: 1.22 });
    if (nome === 'GUERREIRO') { const e = espada(); e.scale.setScalar(0.55); e.position.set(0, -0.68, 0.05); e.rotation.x = Math.PI / 2; p.bracos[0].add(e); }
    if (nome === 'MAGO') { const ch = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.4, 16), new THREE.MeshToonMaterial({ color: '#3A2470' })); ch.position.y = 0.52; p.cabeca.add(ch); const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 20), ch.material); aba.position.y = 0.33; p.cabeca.add(aba); const cajado = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), new THREE.MeshToonMaterial({ color: '#7A5232' })); cajado.position.set(0, -0.66, 0.05); p.bracos[0].add(cajado); }
    if (nome === 'ARQUEIRO') { const arco = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.02, 6, 24, Math.PI), new THREE.MeshToonMaterial({ color: '#8A5A32' })); arco.position.set(0, -0.66, 0.06); arco.rotation.set(0, Math.PI / 2, Math.PI / 2); p.bracos[1].add(arco); }
    const g = new THREE.Group(); g.add(p);
    const c = cartaoHolo(1.25, 2.2); c.position.set(0, 1.0, -0.25); g.add(c);
    g.position.set(x, 0, z); g.lookAt(0, 0, 3); cena.add(g);
    return { nome, g, p, c };
  });
  const aneis = anelHolo(1.4); cena.add(aneis);
  const colunaLuz = coneLuz('#FFE9A0', 9, 1.3); cena.add(colunaLuz);
  const maoBrilho = brilho('#FFD54A', 0.6, 0); heroi.bracos[0].add(maoBrilho); maoBrilho.position.set(0, -0.68, 0.05);
  const monstro = criatura(); monstro.position.set(4, 0, -120); monstro.scale.setScalar(1.6); cena.add(monstro);
  // ataque: raio do slime e onda de choque
  const raio = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#7FE6FF', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); cena.add(raio);
  const onda = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48), new THREE.MeshBasicMaterial({ color: '#9AEFFF', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); onda.rotation.x = -Math.PI / 2; cena.add(onda);
  const rastro = brilho('#3A2A5A', 2, 0); cena.add(rastro);

  let E;
  function inicial() {
    E = { mundo: 'campo', noite: false, treme: 0 };
    heroi.position.set(0, 0, 0); heroi.rotation.set(0, 0, 0); heroi.visible = true; heroi.estado = { bracos: 'normal', expr: 'neutro' };
    capL.visible = false; capL.position.y = 0;
    assassino.visible = false; assassino.rotation.set(0, 0, 0); assassino.scale.set(1, 1, 1); assassino.estado = { bracos: 'adagas', expr: 'serio' };
    slime.visible = false; slime.scale.setScalar(1); slime.estado = { pulo: 0, poder: 0 }; slime.rotation.set(0, 0, 0);
    if (slime.parent !== cena) cena.add(slime);
    classes.forEach((c) => (c.g.visible = false)); aneis.visible = false; colunaLuz.visible = false; colunaLuz.scale.set(1, 1, 1);
    luzLend.visible = false; monstro.visible = false; maoBrilho.material.opacity = 0;
    raio.visible = false; onda.material.opacity = 0; rastro.material.opacity = 0;
    fumaca.forEach((f) => (f.material.opacity = 0));
    ITENS.forEach((it) => { it.cone.visible = false; it.aura.visible = false; it.luz.intensity = 0; it.obj.visible = false; });
    aldeoes.forEach((a) => (a.estado = { bracos: 'normal', expr: 'neutro' }));
  }
  const centro = { campo: [0, 0, 0], cidade: [CIDADE, 0, -10], sala: [SALA, 0, 0] };
  function sempre(t) {
    ctx.centro = centro[E.mundo];
    luzCinema(ctx, E.mundo === 'sala' ? 'vela' : E.noite ? 'noite' : 'campo');
    if (E.mundo === 'sala') { cena.background = new THREE.Color('#05070F'); cena.fog.near = 30; cena.fog.far = 80; ctx.hemi.intensity = 0.45; ctx.sol.intensity = 0.25; }
    campo.animar(t); brilhos.animar(t); brilhosSala.animar(t);
    [heroi, assassino, ...aldeoes, ...classes.map((c) => c.p)].forEach((p) => p.animar(t));
    slime.animar(t);
    ITENS.forEach((it, i) => { it.obj.position.y = 1.3 + Math.sin(t * 1.6 + i) * 0.08; it.obj.rotation.y = t * 0.8 + i; });
    aneis.rotation.y = t * 0.6;
    if (monstro.visible) monstro.aura.material.opacity = 0.3 + 0.1 * Math.sin(t * 2);
  }
  const T = (b, lt) => b.inicio + lt;
  // câmera "na mão" + tremida opcional (E.treme)
  const mao = (pose, k = 1) => (lt, b) => {
    const p = typeof pose === 'function' ? pose(lt, b) : pose; const tt = T(b, lt);
    const tr = E.treme;
    return { pos: p.pos.map((v, i) => v + Math.sin(tt * (0.7 + i * 0.3) + i) * 0.03 * k + (tr ? Math.sin(tt * 55 + i * 2) * 0.05 * tr : 0)), alvo: p.alvo };
  };
  const tela = (lt, b, extra = '') => CSS + vinheta + extra;
  const H = heroi.position;

  const blocos = [
    // ============ CENA 1 — O MUNDO IMPOSSÍVEL ============
    {
      fala: 'E se você acordasse em um mundo onde absolutamente tudo depende da sua sorte?',
      destaque: ['acordasse', 'sorte'],
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [mistura(4, 1.3, k), mistura(7, 1.9, k), mistura(10, 4.2, k)], alvo: [0, mistura(0.3, 1.0, k), 0] }; },
      aplicar(lt, b) {
        E.mundo = 'campo'; E.noite = false;
        const k = suave((lt - b.dur * 0.45) / 1.0);
        heroi.rotation.set(-Math.PI / 2 * (1 - k), 0, 0); heroi.position.set(0, 0.12 * (1 - k), 0);
        heroi.estado = { bracos: 'normal', expr: k > 0.5 ? 'surpreso' : 'neutro', olharLado: k > 0.9 ? Math.sin(T(b, lt) * 2.2) * 0.6 : 0 };
      },
      camada: (lt, b) => tela(lt, b, textoTela('E se sua <b>sorte</b><br>decidisse tudo?', lt, 0.3)),
      sons: [{ em: () => 0.05, tipo: 'vento' }, { em: () => 0.3, tipo: 'pop' }, { em: 'sorte', tipo: 'brilho' }],
    },
    {
      fala: 'Um mundo onde uma única escolha pode transformar você em um herói lendário...',
      destaque: ['escolha', 'lendário'],
      corteSeco: true,
      pausaDepois: 0.3,
      camera: mao((lt, b) => ({ pos: [mistura(1.4, 0.7, lt / b.dur), 0.55, 3.0], alvo: [0, 1.6, 0] })),
      aplicar(lt, b) {
        E.mundo = 'campo'; heroi.rotation.set(0, 0, 0); heroi.position.set(0, 0, 0);
        const her = lt > b.palavra('herói') - 0.2;
        heroi.estado = { bracos: her ? 'cima' : 'normal', expr: her ? 'feliz' : 'surpreso' };
        colunaLuz.visible = her; colunaLuz.position.set(0, 0, 0); colunaLuz.scale.set(1, 1, 1); colunaLuz.children[0].material.opacity = 0.1 * lim((lt - b.palavra('herói') + 0.2) / 0.4);
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('lendário') ? tag(camera, [0, 2.6, 0], '★ HERÓI LENDÁRIO ★', '#FFD21F') : ''),
      sons: [{ em: 'herói', tipo: 'subida' }, { em: 'lendário', tipo: 'sino' }],
    },
    {
      fala: 'ou em alguém completamente inútil?',
      destaque: ['inútil'],
      corteSeco: true,
      camera: mao((lt, b) => { const k = salto(lt / 0.5); return { pos: [0.2, 1.5, mistura(6.5, 3.6, k)], alvo: [0, 1.2, 0] }; }),
      aplicar(lt, b) { E.mundo = 'campo'; colunaLuz.visible = false; heroi.estado = { bracos: lt > b.palavra('inútil') ? 'cabeca' : 'normal', expr: 'medo' }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur, `<div class="t">STATUS</div><div style="font-size:40px;font-weight:900">CLASSE: <span style="color:#FF6B6B">INÚTIL</span></div><div style="font-size:22px;color:#BFF0FF;margin-top:8px">Habilidade: tropeçar (Nv. 99)</div>`, { top: 250, abre: b.palavra('inútil') - 0.1 })),
      sons: [{ em: 'inútil', tipo: 'plim' }, { em: 'inútil', depois: 0.35, tipo: 'baque' }],
    },
    // ============ CENA 2 — O SISTEMA ============
    {
      fala: 'Nesse mundo, ninguém escolhe o próprio destino.',
      destaque: ['destino'],
      corteSeco: true,
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [CIDADE + mistura(-3, 0.5, k), mistura(14, 3.2, k), mistura(18, 1.0, k)], alvo: [CIDADE, mistura(3, 5, k), -15] }; },
      aplicar(lt, b) { E.mundo = 'cidade'; heroi.visible = true; heroi.position.set(CIDADE + 0.4, 0, -7.6); heroi.rotation.set(0, Math.PI, 0); heroi.estado = { bracos: 'normal', expr: 'neutro' }; painelP.desenhar(T(b, lt) * 6); },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: () => 0.1, tipo: 'sino' }],
    },
    {
      fala: 'Quando você completa dezoito anos, recebe uma classe aleatória.',
      destaque: ['dezoito', 'aleatória'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [CIDADE + mistura(2.2, 0.8, lt / b.dur), 1.9, -5.2], alvo: [CIDADE, 5.2, -17] })),
      aplicar(lt, b) {
        E.mundo = 'cidade'; painelP.desenhar(lt < b.palavra('classe') ? T(b, lt) * 8 : 3);
        aldeoes.forEach((a, i) => (a.estado = { bracos: i === 2 && lt > b.palavra('classe') ? 'aponta' : 'normal', expr: 'neutro', olharLado: Math.sin(T(b, lt) + i) * 0.2 }));
      },
      camada: (lt, b) => tela(lt, b, textoTela('Classe<br><b>aleatória!</b>', lt, b.palavra('aleatória') - 0.15)),
      sons: [{ em: 'dezoito', tipo: 'contador' }, { em: 'aleatória', tipo: 'pop' }],
    },
    {
      fala: 'E algumas pessoas simplesmente nascem com uma sorte absurda.',
      destaque: ['sorte', 'absurda'],
      corteSeco: true,
      camera: mao((lt, b) => { const a = aldeoes[3].position; return { pos: [a.x - 1.4, 1.8, a.z + mistura(4.8, 3.8, suave(lt / b.dur))], alvo: [a.x, 1.5, a.z] }; }),
      aplicar(lt, b) {
        E.mundo = 'cidade';
        const sorte = lt > b.palavra('sorte') - 0.1;
        const a = aldeoes[3]; a.rotation.y = sorte ? 0.3 : Math.PI;
        a.estado = { bracos: sorte ? 'cima' : 'normal', expr: sorte ? 'feliz' : 'neutro' };
        aldeoes.forEach((o, i) => { if (i !== 3) o.estado = { bracos: 'normal', expr: sorte ? 'surpreso' : 'neutro', olharLado: sorte ? (i < 3 ? 0.7 : -0.7) : 0 }; });
        luzLend.visible = sorte; luzLend.position.set(a.position.x, 0, a.position.z);
        painelP.desenhar(3, sorte ? 3 : -1);
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('absurda') ? tag(camera, [aldeoes[3].position.x, 2.75, aldeoes[3].position.z], 'SORTE: 87 ★ LENDÁRIO', '#FFD21F') : ''),
      sons: [{ em: 'sorte', tipo: 'brilho' }, { em: 'absurda', tipo: 'moeda' }],
    },
    // ============ CENA 3 — A ESCOLHA ============
    {
      fala: 'Quando chegou minha vez, três opções apareceram na minha frente.',
      destaque: ['vez', 'três'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [SALA + 0.6, 1.75, mistura(4.6, 3.9, lt / b.dur)], alvo: [SALA, 1.2, -2] })),
      aplicar(lt, b) {
        E.mundo = 'sala'; luzLend.visible = false;
        heroi.position.set(SALA, 0, 1.6); heroi.rotation.set(0, Math.PI, 0); heroi.estado = { bracos: 'normal', expr: 'surpreso' };
        const t3 = b.palavra('três');
        ITENS.forEach((it, i) => { const on = lt > t3 + i * 0.35; it.cone.visible = on; it.aura.visible = on; it.obj.visible = on; it.luz.intensity = on ? 6 : 0; });
      },
      camada: (lt, b) => tela(lt, b),
      sons: [0, 1, 2].map((i) => ({ em: (b) => b.palavra('três') + i * 0.35, tipo: 'ofuscar' })),
    },
    {
      fala: 'Uma espada, um anel misterioso e uma armadura lendária.',
      destaque: ['espada', 'anel', 'armadura'],
      corteSeco: true,
      camera: (lt, b) => {
        const marcos = [[0, -1.7], [b.palavra('anel'), 0], [b.palavra('armadura'), 1.7]];
        let x = -1.7; marcos.forEach(([tm, xx], i) => { if (i && lt > tm - 0.35) x = mistura(marcos[i - 1][1], xx, suave((lt - tm + 0.35) / 0.5)); });
        return { pos: [SALA + x * 0.85, 1.6, 1.4], alvo: [SALA + x, 1.25, -2] };
      },
      aplicar(lt, b) { E.mundo = 'sala'; heroi.visible = false; ITENS.forEach((it) => { it.cone.visible = it.aura.visible = it.obj.visible = true; it.luz.intensity = 6; }); },
      camada: (lt, b) => tela(lt, b, textoTela('Escolha seu<br><b>destino!</b>', lt, 0.1)),
      sons: [{ em: 'espada', tipo: 'vidro' }, { em: 'anel', tipo: 'moeda' }, { em: 'armadura', tipo: 'martelo' }],
    },
    {
      fala: 'Mas havia um detalhe: eu só poderia escolher uma.',
      destaque: ['detalhe', 'uma'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [SALA - 0.35, 1.8, mistura(-0.6, -0.3, lt / b.dur)], alvo: [SALA, 1.6, 1.6] }), 0.5),
      aplicar(lt, b) { E.mundo = 'sala'; heroi.visible = true; heroi.estado = { bracos: 'normal', expr: lt > b.palavra('uma') ? 'serio' : 'surpreso', olharLado: Math.sin(T(b, lt) * 3) * 0.35 }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur, `<div class="t">AVISO DO SISTEMA</div><div style="font-size:36px;font-weight:900">ESCOLHA: <span style="color:#FFD21F">1</span> DE 3</div>`, { top: 230, abre: b.palavra('uma') - 0.2 })),
      sons: [{ em: 'detalhe', tipo: 'tique' }, { em: 'uma', tipo: 'plim' }],
    },
    // ============ CENA 4 — OS ATRIBUTOS ============
    {
      fala: 'Então o sistema revelou meus atributos.',
      destaque: ['atributos'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [SALA + 0.45, 1.8, mistura(4.6, 4.0, lt / b.dur)], alvo: [SALA, 1.6, 1.6] }), 0.5),
      aplicar(lt, b) {
        E.mundo = 'sala'; ITENS.forEach((it) => { it.luz.intensity = 1; });
        heroi.position.set(SALA, 0, 1.6); heroi.rotation.set(0, 0, 0); heroi.estado = { bracos: lt < 0.8 ? 'cabeca' : 'normal', expr: 'surpreso' };
        capL.visible = true; capL.position.y = mistura(0.6, 0, suave(lt / 0.8)); capL.tela.material.color.set(Math.sin(T(b, lt) * 12) > 0 ? '#58D2FF' : '#A8ECFF');
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: () => 0.1, tipo: 'porta' }, { em: 'atributos', tipo: 'subida' }],
    },
    {
      fala: 'Força, velocidade, inteligência, resistência e sorte.',
      destaque: ['sorte'],
      corteSeco: true,
      pausaDepois: 0.35,
      camera: mao((lt, b) => ({ pos: [SALA - 0.5, 1.7, 4.3], alvo: [SALA, 1.75, 1.6] }), 0.4),
      aplicar(lt, b) { E.mundo = 'sala'; capL.visible = true; capL.position.y = 0; heroi.estado = { bracos: 'normal', expr: 'neutro' }; },
      camada: (lt, b) => {
        const at = [['FORÇA', 'força', 3], ['VELOCIDADE', 'velocidade', 5], ['INTELIGÊNCIA', 'inteligência', 6], ['RESISTÊNCIA', 'resistência', 2], ['SORTE', 'sorte', 0]];
        const linhas = at.map(([n, w, v]) => { const k = lim((lt - b.palavra(w)) / 0.4); return k <= 0 ? '' : linhaAtr(n, v * k, 10, n === 'SORTE' ? '#FFD21F' : '#7FE0FF', n === 'SORTE' ? '??' : Math.round(v * k)); }).join('');
        return tela(lt, b, painel(lt, b.dur + 1, `<div class="t">ATRIBUTOS</div>${linhas}`, { top: 200, abre: 0.05, fecha: 99 }));
      },
      sons: ['força', 'velocidade', 'inteligência', 'resistência', 'sorte'].map((w) => ({ em: w, tipo: 'tique' })),
    },
    {
      fala: 'E quando vi o último número, percebi que alguma coisa estava muito errada.',
      destaque: ['número', 'errada'],
      camera: mao((lt, b) => ({ pos: [SALA - 0.2, 1.75, mistura(4.3, 3.5, suave(lt / b.dur))], alvo: [SALA, 1.8, 1.6] }), 0.4),
      aplicar(lt, b) { E.mundo = 'sala'; capL.visible = true; const n = lt > b.palavra('número'); heroi.estado = { bracos: lt > b.palavra('errada') ? 'cabeca' : 'normal', expr: n ? 'surpreso' : 'neutro' }; E.treme = lt > b.palavra('errada') ? 0.6 : 0; },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('número')) / 0.9), v = Math.round(99 * k);
        const at = [['FORÇA', 3], ['VELOCIDADE', 5], ['INTELIGÊNCIA', 6], ['RESISTÊNCIA', 2]].map(([n, v0]) => linhaAtr(n, v0, 10)).join('') + linhaAtr('SORTE', v, 10, '#FFD21F', `<span style="color:#FFD21F">${v}</span>`);
        const p = painel(lt, b.dur, `<div class="t">ATRIBUTOS</div>${at}`, { top: 200, abre: 0, borda: k >= 1 ? '#FFD21F' : '#9AE6FF' });
        return tela(lt, b, p + (k >= 1 ? textoTela('Sorte: <b>99!</b>', lt, b.palavra('número') + 0.9).replace('top:150px', 'top:640px') : ''));
      },
      sons: [{ em: 'número', tipo: 'contador' }, { em: 'número', depois: 0.9, tipo: 'impacto' }, { em: 'errada', tipo: 'glitch' }],
    },
    // ============ CENA 5 — A CLASSE ============
    {
      fala: 'Enquanto todos recebiam classes comuns,',
      destaque: ['comuns'],
      corteSeco: true,
      camera: (lt, b) => { const a = mistura(-0.7, 0.5, suave(lt / b.dur)); return { pos: [Math.sin(a) * 7, 2.2, Math.cos(a) * 7], alvo: [0, 1.1, -1.0] }; },
      aplicar(lt, b) {
        E.mundo = 'campo'; E.treme = 0; capL.visible = false; heroi.position.set(0, 0, 0); heroi.rotation.set(0, 0, 0); heroi.estado = { bracos: 'normal', expr: 'neutro' };
        aneis.visible = true; aneis.position.set(0, 0, 0);
        classes.forEach((c, i) => { const k = lim((lt - i * 0.25) / 0.3); c.g.visible = k > 0; c.g.scale.setScalar(Math.max(0.01, salto(k))); c.c.material.opacity = 1; });
      },
      camada: (lt, b) => tela(lt, b, classes.map((c) => (c.g.visible ? tag(camera, [c.g.position.x, 2.45, c.g.position.z], c.nome) : '')).join('')),
      sons: [0, 1, 2].map((i) => ({ em: () => 0.05 + i * 0.25, tipo: 'pop' })),
    },
    {
      fala: 'eu estava prestes a descobrir algo completamente diferente.',
      destaque: ['diferente'],
      camera: mao((lt, b) => ({ pos: [0.3, 1.5, mistura(5.6, 4.0, suave(lt / b.dur))], alvo: [0, 1.3, 0] })),
      aplicar(lt, b) {
        E.mundo = 'campo'; aneis.visible = true;
        const k = lim(lt / (b.dur * 0.8));
        classes.forEach((c) => { c.g.visible = true; c.g.scale.setScalar(1); c.c.material.opacity = 1 - k * 0.7; });
        colunaLuz.visible = true; colunaLuz.position.set(0, 0, 0); colunaLuz.scale.set(0.6 + k * 0.5, 1, 0.6 + k * 0.5); colunaLuz.children[0].material.opacity = 0.05 + k * 0.08;
        heroi.estado = { bracos: 'abre', expr: 'surpreso' };
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'diferente', tipo: 'brilho' }],
    },
    {
      fala: 'O sistema começou a tremer...',
      destaque: ['tremer'],
      corteSeco: true,
      pausaDepois: 0.45,
      camera: mao({ pos: [1.8, 1.2, 4.6], alvo: [0, 1.3, 0] }),
      aplicar(lt, b) { E.mundo = 'campo'; E.treme = lim((lt - b.palavra('tremer')) / 0.3) * 1.4; classes.forEach((c) => (c.g.visible = Math.sin(T(b, lt) * 30) > -0.3)); colunaLuz.visible = true; heroi.estado = { bracos: 'defende', expr: 'medo' }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t" style="color:#FF8A8A">${glitch('SISTEMA INSTÁVEL', T(b, lt))}</div><div style="font-size:34px;font-weight:900;color:#FF6B6B">${glitch('ERRO 404: CLASSE ???', T(b, lt))}</div>`, { top: 240, abre: b.palavra('tremer') - 0.1, borda: '#FF6B6B', fecha: 99 })),
      sons: [{ em: 'tremer', tipo: 'glitch' }, { em: 'tremer', tipo: 'tensao' }],
    },
    {
      fala: 'e uma mensagem apareceu na minha frente.',
      destaque: ['mensagem'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0, 1.6, mistura(4.6, 3.5, salto(lt / 0.6))], alvo: [0, 1.4, 0] })),
      aplicar(lt, b) { E.mundo = 'campo'; E.treme = 0; classes.forEach((c) => (c.g.visible = false)); colunaLuz.visible = true; colunaLuz.scale.set(1.2, 1, 1.2); colunaLuz.children[0].material.opacity = 0.12; heroi.estado = { bracos: 'normal', expr: lt > b.palavra('mensagem') ? 'feliz' : 'surpreso' }; },
      camada: (lt, b) => tela(lt, b, painel(lt, b.dur + 1, `<div class="t" style="color:#FFE9A0">NOTIFICAÇÃO</div><div style="font-size:42px;font-weight:900;line-height:1.15">CLASSE <span style="color:#FFD21F">SECRETA</span><br>DESBLOQUEADA!</div>`, { top: 230, abre: b.palavra('mensagem') - 0.1, borda: '#FFD21F', fecha: 99 })),
      sons: [{ em: 'mensagem', tipo: 'sino' }, { em: 'mensagem', tipo: 'brilho' }],
    },
    // ============ CENA 6 — O INIMIGO ============
    {
      fala: 'Mas minha sorte não significava que eu estava seguro.',
      destaque: ['seguro'],
      corteSeco: true,
      camera: mao(() => ({ pos: [0.9, 1.5, H.z + 3.6], alvo: [0, 1.25, H.z - 1.5] })),
      aplicar(lt, b) {
        E.mundo = 'campo'; colunaLuz.visible = false; aneis.visible = false;
        heroi.position.set(0, 0, mistura(-2, 0.5, lt / b.dur)); heroi.rotation.set(0, 0, 0); heroi.estado = { bracos: 'normal', expr: 'feliz', andar: 1 };
        const k = lim((lt - b.palavra('seguro') + 0.3) / 0.5);
        assassino.visible = k > 0; assassino.position.set(-0.4, 0, H.z - 2.6); assassino.rotation.set(0, 0, 0); assassino.estado = { bracos: 'adagas', expr: 'serio' };
        assassino.scale.set(1, Math.max(0.01, k), 1);
        fumaca.forEach((f, i) => { f.position.set(-0.4 + Math.sin(i * 2) * 0.5, 0.3 + i * 0.2, H.z - 2.6 + Math.cos(i) * 0.3); f.scale.setScalar(1.2 + k * 0.8); f.material.opacity = k > 0 ? 0.7 * (1 - k) + 0.1 : 0; });
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'seguro', tipo: 'whoosh' }, { em: 'seguro', depois: 0.2, tipo: 'tensao' }],
    },
    {
      fala: 'Um assassino apareceu do nada.',
      destaque: ['assassino'],
      corteSeco: true,
      camera: mao((lt, b) => { const a = assassino.position; return { pos: [a.x + 0.8, 1.0, a.z + mistura(3.4, 2.7, suave(lt / b.dur))], alvo: [a.x, 1.6, a.z] }; }, 0.5),
      aplicar(lt, b) { E.mundo = 'campo'; fumaca.forEach((f) => (f.material.opacity = 0)); heroi.position.set(0, 0, 0.5); heroi.estado = { bracos: 'normal', expr: 'neutro' }; assassino.visible = true; assassino.scale.set(1, 1, 1); assassino.position.set(-0.4, 0, -2.1); assassino.estado = { bracos: lt > b.palavra('assassino') ? 'ataque' : 'adagas', expr: 'serio' }; },
      camada: (lt, b) => tela(lt, b, textoTela('<b>Perigo!</b>', lt, b.palavra('assassino')) + (lt > b.palavra('assassino') ? tag(camera, [0.35, 1.15, -2.1], 'ASSASSINO · NV 47', '#FF6B6B') : '')),
      sons: [{ em: 'assassino', tipo: 'impacto' }, { em: 'nada', tipo: 'whoosh' }],
    },
    {
      fala: 'E, antes que eu pudesse reagir, uma criatura aparentemente inofensiva começou a se aproximar.',
      destaque: ['criatura', 'inofensiva'],
      corteSeco: true,
      camera: mao(() => ({ pos: [slime.position.x + 1.1, 1.05, slime.position.z + 2.3], alvo: [slime.position.x - 0.2, 0.5, slime.position.z - 0.6] }), 0.4),
      aplicar(lt, b) {
        E.mundo = 'campo'; assassino.estado = { bracos: 'adagas', expr: 'serio' };
        slime.visible = true; slime.estado = { pulo: 1, poder: 0 };
        slime.position.set(mistura(2.2, 0.4, lt / b.dur), 0, mistura(4, 1.3, lt / b.dur)); slime.rotation.y = -0.9;
        heroi.estado = { bracos: 'normal', expr: lt > b.palavra('inofensiva') ? 'feliz' : 'surpreso', olharLado: 0.5 };
      },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('criatura') ? tag(camera, [slime.position.x, 0.85 + slime.children[1].position.y - 0.17, slime.position.z], 'SLIME · NV 1', '#7CF29A') : ''),
      sons: [0.4, 0.85, 1.3, 1.75, 2.2, 2.65, 3.1, 3.55].map((d) => ({ em: () => d, tipo: 'tum' })).concat([{ em: 'criatura', tipo: 'plim' }]),
    },
    // ============ CENA 7 — A BATALHA ============
    {
      fala: 'Eu tentei fugir, mas não havia saída.',
      destaque: ['fugir', 'saída'],
      corteSeco: true,
      camera: mao(() => ({ pos: [2.6, 1.3, H.z + 2.8], alvo: [0, 1.0, H.z - 1] })),
      aplicar(lt, b) {
        E.mundo = 'campo'; slime.estado = { pulo: 0, poder: 0 }; slime.position.set(0.9, 0, 1.6); slime.rotation.y = -0.3;
        const tSai = b.palavra('saída') - 0.25;
        heroi.position.set(lt < tSai ? 0 : mistura(0, 1.1, suave((lt - tSai) / 0.25)), 0, mistura(0.5, 1.6, lim(lt / tSai)));
        heroi.rotation.set(0, 0, lt > tSai ? -0.35 * (1 - lim((lt - tSai - 0.4) / 0.5)) : 0);
        heroi.estado = { bracos: lt < tSai ? 'corre' : 'defende', expr: 'medo', andar: lt < tSai ? 1 : 0, correr: true };
        const k = lim((lt - tSai) / 0.22);
        assassino.position.set(mistura(-0.4, 0.2, k), 0, mistura(-2.1, 1.8, k)); assassino.estado = { bracos: 'ataque', expr: 'serio' };
        assassino.scale.set(1, 1, 1 + Math.sin(k * Math.PI) * 1.2);
        rastro.position.set(assassino.position.x, 1.0, assassino.position.z - 0.8); rastro.scale.set(1.5, 2.6, 1); rastro.material.opacity = Math.sin(k * Math.PI) * 0.8;
      },
      camada: (lt, b) => {
        const tS = b.palavra('saída'); const k = lim((lt - tS + 0.05) / 0.25);
        const corte = k > 0 && k < 1 ? `<svg style="position:absolute;inset:0;width:720px;height:1280px" viewBox="0 0 720 1280"><path d="M120 ${420 + k * 60} Q360 ${560 - k * 40} 620 ${620}" stroke="#fff" stroke-width="${18 * (1 - k)}" fill="none" stroke-linecap="round" opacity="${1 - k}"/></svg>` : '';
        return tela(lt, b, corte + (k > 0 && k < 1 ? `<div style="position:absolute;inset:0;background:#fff;opacity:${0.35 * (1 - k)}"></div>` : ''));
      },
      sons: [{ em: 'fugir', tipo: 'passagem' }, { em: 'saída', depois: -0.25, tipo: 'whoosh' }, { em: 'saída', tipo: 'vidro' }],
    },
    {
      fala: 'Foi então que o slime revelou seu verdadeiro poder.',
      destaque: ['slime', 'poder'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [mistura(-2.2, -2.8, lt / b.dur), 1.5, 6.0], alvo: [-0.2, 0.9, 0.2] })),
      aplicar(lt, b) {
        E.mundo = 'campo'; rastro.material.opacity = 0; assassino.scale.set(1, 1, 1);
        heroi.position.set(1.9, 0, 2.5); heroi.rotation.set(0, -0.6, 0); heroi.estado = { bracos: 'defende', expr: 'medo' };
        const kp = lim((lt - b.palavra('revelou')) / 0.6), tiro = b.palavra('poder');
        slime.position.set(0.9, 0, 1.6); slime.rotation.y = Math.PI * 0.85; slime.estado = { pulo: 0, poder: kp }; slime.scale.setScalar(1 + kp * 0.6);
        const kv = lim((lt - tiro) / 0.5);
        const A = new THREE.Vector3(0.9, 0.45, 1.6), Bp = new THREE.Vector3(mistura(0.2, -1.8, kv), 1.0 + Math.sin(kv * Math.PI) * 0.8, mistura(1.0, -2.5, kv));
        assassino.position.set(Bp.x, Math.max(0, Bp.y - 1.0), Bp.z); assassino.rotation.set(-kv * 1.4, 0.4, kv * 0.8); assassino.estado = { bracos: kv > 0 ? 'cima' : 'ataque', expr: kv > 0 ? 'medo' : 'serio' };
        raio.visible = lt > tiro - 0.05 && kv < 0.6; raio.position.copy(A).add(Bp).multiplyScalar(0.5); raio.scale.set(1 + Math.sin(T(b, lt) * 50) * 0.2, A.distanceTo(Bp), 1); raio.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bp.clone().sub(A).normalize());
        onda.position.set(0.9, 0.06, 1.6); const ko = lim((lt - tiro) / 0.7); onda.scale.setScalar(0.5 + ko * 5); onda.material.opacity = ko > 0 ? 0.9 * (1 - ko) : 0;
      },
      camada: (lt, b) => { const k = lim((lt - b.palavra('poder')) / 0.3); return tela(lt, b, k > 0 && k < 1 ? `<div style="position:absolute;inset:0;background:#BFF4FF;opacity:${0.6 * (1 - k)}"></div>` : ''); },
      sons: [{ em: 'revelou', tipo: 'subida' }, { em: 'poder', tipo: 'zap' }, { em: 'poder', depois: 0.15, tipo: 'impacto' }],
    },
    {
      fala: 'Uma habilidade que nem mesmo o sistema conseguia identificar.',
      destaque: ['habilidade', 'identificar'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.9 + 0.4, 0.95, mistura(3.9, 3.4, suave(lt / b.dur))], alvo: [1.0, 0.6, 1.3] }), 0.4),
      aplicar(lt, b) { E.mundo = 'campo'; raio.visible = false; onda.material.opacity = 0; assassino.visible = false; slime.position.set(0.9, 0, 1.6); slime.rotation.y = 0; slime.estado = { pulo: 0, poder: 0.7 }; slime.scale.setScalar(1.3); heroi.position.set(1.6, 0, 0.6); heroi.rotation.set(0, -0.3, 0); heroi.estado = { bracos: 'normal', expr: 'surpreso' }; },
      camada: (lt, b) => tela(lt, b, textoTela('Habilidade<br><b>desconhecida!</b>', lt, 0.1) + painel(lt, b.dur, `<div class="t">ANÁLISE</div><div style="font-size:32px;font-weight:900">HABILIDADE: <span style="color:#7FE0FF">${glitch('??????', T(b, lt))}</span></div><div style="font-size:24px;color:#FF8A8A;margin-top:8px">${glitch('ERRO: NÃO IDENTIFICADA', T(b, lt) * 0.5)}</div>`, { top: 470, abre: b.palavra('sistema') - 0.1 })),
      sons: [{ em: 'sistema', tipo: 'plim' }, { em: 'identificar', tipo: 'glitch' }],
    },
    // ============ CENA 8 — A REVELAÇÃO ============
    {
      fala: 'Foi aí que percebi que minha sorte não era normal.',
      destaque: ['sorte', 'normal'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.7, 1.6, mistura(3.0, 2.5, suave(lt / b.dur))], alvo: [0.05, 1.35, 0] }), 0.4),
      aplicar(lt, b) {
        E.mundo = 'campo'; E.noite = true; assassino.visible = false;
        heroi.position.set(0, 0, 0); heroi.rotation.set(0, 0, 0); heroi.estado = { bracos: 'olhaMao', expr: lt > b.palavra('normal') ? 'serio' : 'surpreso' };
        maoBrilho.material.opacity = 0.4 + 0.4 * lim(lt / 1) + Math.sin(T(b, lt) * 8) * 0.1; maoBrilho.scale.setScalar(0.5 + lim(lt / 1) * 0.4);
        if (slime.parent !== heroi.tronco) heroi.tronco.add(slime);
        slime.position.set(-0.2, 0.62, 0); slime.scale.setScalar(0.4); slime.rotation.set(0, 0, 0); slime.estado = { pulo: 0, poder: 0.2 };
      },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: 'sorte', tipo: 'brilho' }, { em: 'normal', tipo: 'coracao' }],
    },
    {
      fala: 'Eu não tinha recebido apenas uma classe rara...',
      destaque: ['rara'],
      pausaDepois: 0.45,
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [mistura(1.2, 3.5, k), mistura(1.6, 3.0, k), mistura(3.0, 9.5, k)], alvo: [mistura(0, 2, k), mistura(1.4, 14, k), mistura(0, -60, k)] }; },
      aplicar(lt, b) { E.mundo = 'campo'; E.noite = true; heroi.estado = { bracos: 'normal', expr: 'serio' }; maoBrilho.material.opacity = 0.5; monstro.visible = true; monstro.position.y = mistura(-30, 0, suave(lt / b.dur)); },
      camada: (lt, b) => tela(lt, b),
      sons: [{ em: () => 0.2, tipo: 'tensao' }, { em: 'rara', tipo: 'baque' }],
    },
    {
      fala: 'eu tinha desbloqueado algo que poderia mudar completamente aquele mundo.',
      destaque: ['desbloqueado', 'mundo'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.6, mistura(0.9, 1.1, lt / b.dur), mistura(4.2, 3.4, suave(lt / b.dur))], alvo: [0.8, 6, -60] }), 0.6),
      aplicar(lt, b) { E.mundo = 'campo'; E.noite = true; monstro.visible = true; monstro.position.y = 0; heroi.rotation.set(0, Math.PI, 0); heroi.estado = { bracos: lt > b.palavra('desbloqueado') ? 'abre' : 'normal', expr: 'serio' }; maoBrilho.material.opacity = 0.9; maoBrilho.scale.setScalar(1.1 + Math.sin(T(b, lt) * 6) * 0.15); E.treme = lt > b.palavra('mundo') ? 0.5 : 0; },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('desbloqueado')) / 1.2);
        return tela(lt, b, textoTela('O verdadeiro<br><b>poder!</b>', lt, b.palavra('mundo') - 0.2) + painel(lt, b.dur + 1, `<div class="t" style="color:#FFE9A0">LEVEL UP</div><div style="font-size:38px;font-weight:900">NÍVEL <span style="color:#FFD21F">${k < 1 ? Math.round(1 + k * 98) : '???'}</span> DESBLOQUEADO</div>${linhaAtr('PODER', k * 10, 10, '#FFD21F', k < 1 ? '' : '∞')}`, { top: 560, abre: b.palavra('desbloqueado') - 0.1, borda: '#FFD21F', fecha: 99 }));
      },
      sons: [{ em: 'desbloqueado', tipo: 'subida' }, { em: 'mundo', tipo: 'impacto' }, { em: 'mundo', depois: 0.1, tipo: 'uivo' }],
    },
    {
      fala: 'E isso era só o começo.',
      destaque: ['começo'],
      corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.3, 1.7, mistura(3.4, 2.6, suave(lt / b.dur))], alvo: [0, 1.65, 0] }), 0.3),
      aplicar(lt, b) { E.mundo = 'campo'; E.noite = true; E.treme = 0; heroi.rotation.set(0, 0, 0); heroi.estado = { bracos: 'normal', expr: 'serio' }; monstro.visible = true; },
      camada: (lt, b) => tela(lt, b, lt > b.palavra('começo') + 0.4 ? `<div style="position:absolute;left:0;right:0;top:180px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:70px;color:#fff;-webkit-text-stroke:12px #111;paint-order:stroke fill;transform:scale(${Math.max(0.01, salto((lt - b.palavra('começo') - 0.4) / 0.35))})">PARTE <span style="color:#FFD21F">2?</span></div>` : ''),
      sons: [{ em: 'começo', depois: 0.4, tipo: 'sino' }],
    },
  ];
  // segura o último quadro um pouquinho para o "PARTE 2?"
  blocos[blocos.length - 1].pausaDepois = 1.0;

  return { blocos, inicial, sempre };
}
