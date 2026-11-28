// "ESCOLHA UMA PORTA" — vídeo interativo: o público joga junto. 3 fases, 3 portas cada,
// contagem de 3 segundos para pensar, portas abrem (verde = certa, vermelha = errada),
// o Caio passa pela certa… e na última fase erra a conta e leva um choque do robô.
// Final: "Quantas você acertou?". Enigmas originais (o do leão é clássico, domínio popular).
import * as THREE from 'three';
import { suave, lim, mistura, salto } from '../motor.js';
import { criarPersonagemFlat, M as MT, contornar } from '../personagem-flat.js';
import { luzCinema } from '../estilo-cinema.js';
import { brilho } from '../cenarios/campo-rpg.js';

export const config = {
  velocidade: '+10%',
  ritmo: 'corrido',
  pausa: 0.14,
  voz: 'pt-BR-AntonioNeural',
  legendaTopo: 900,
};

const CSS = `<style>
.legenda{text-transform:uppercase;font-family:Inter,sans-serif;font-weight:900;font-size:52px}
.carta{position:absolute;width:206px;transform:translate(-50%,-100%);text-align:center;font-family:Inter,sans-serif;font-weight:900;color:#fff;
 background:rgba(20,20,35,.82);border:4px solid #fff;border-radius:18px;padding:10px 8px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35)}
.carta .e{font-size:58px;line-height:1.1}.carta .t{font-size:21px;line-height:1.15;margin-top:4px}
.carta .n{position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#FFD21F;color:#111;font-size:24px;border-radius:12px;padding:2px 14px;border:3px solid #111}
.topo{position:absolute;left:20px;right:20px;top:130px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:62px;line-height:1.05;color:#fff;-webkit-text-stroke:12px #111;paint-order:stroke fill}
.topo b{color:#FFD21F}
</style>`;

const PX = [-1.75, 0, 1.75]; // x das portas
const FASES = [
  { cores: ['#C0392B', '#2F6FB2', '#2E8B57'], certa: 0, cartas: [['🦁', 'Leão sem comer há 3 meses'], ['🔥', 'Sala pegando fogo'], ['🦈', 'Piscina com tubarões']], fundo: ['🦁💤', '🔥🔥', '🦈🦈'] },
  { cores: ['#8E44AD', '#D35400', '#16A085'], certa: 2, cartas: [['🌉', 'Ponte de vidro: aguenta 80 kg'], ['🕳️', 'Corredor escuro com buraco'], ['💧', 'Enche de água em 10 min · saída a 2 min']], fundo: ['💥', '🕳️', '🚪✅'] },
  { cores: ['#B03A2E', '#2471A3', '#CA6F1E'], certa: 1, cartas: [['🐉', 'Dragão que acorda com barulho'], ['🤖', 'Robô: quanto é 7 × 8?'], ['🌋', 'Chão vira lava em 5 s']], fundo: ['🐉', '', '🌋'] },
];

function robo() {
  const g = new THREE.Group();
  const m = (geo, cor, pos, sc = [1, 1, 1]) => { const x = new THREE.Mesh(geo, MT(cor)); x.position.set(...pos); x.scale.set(...sc); x.castShadow = true; contornar(x); g.add(x); return x; };
  m(new THREE.BoxGeometry(0.7, 0.8, 0.45), '#B8C2CC', [0, 0.95, 0]);
  m(new THREE.BoxGeometry(0.55, 0.45, 0.45), '#D5DCE3', [0, 1.6, 0]);
  [-1, 1].forEach((s) => { m(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 10), '#8A96A3', [s * 0.45, 0.95, 0]); m(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 10), '#6B7682', [s * 0.18, 0.28, 0]); });
  m(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), '#6B7682', [0, 1.95, 0]);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: '#FF4040' })); bola.position.set(0, 2.12, 0); g.add(bola);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.22), new THREE.MeshBasicMaterial({ color: '#58D2FF' })); tela.position.set(0, 1.62, 0.23); g.add(tela);
  [-1, 1].forEach((s) => { const o = new THREE.Mesh(new THREE.CircleGeometry(0.045, 14), new THREE.MeshBasicMaterial({ color: '#0B2A44' })); o.position.set(s * 0.09, 1.63, 0.235); g.add(o); });
  g.tela = tela;
  return g;
}

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 44; camera.near = 0.05; camera.far = 200; camera.updateProjectionMatrix();
  ctx.sol.shadow.mapSize.set(2048, 2048);
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.2;

  // sala: piso xadrez, paredes roxas, luminárias
  const c = document.createElement('canvas'); c.width = c.height = 256; const g2 = c.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g2.fillStyle = (i + j) % 2 ? '#2B2440' : '#F2E9DA'; g2.fillRect(i * 32, j * 32, 32, 32); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(4, 4);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6 })); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; cena.add(piso);
  const parede = new THREE.Mesh(new THREE.BoxGeometry(16, 7, 0.3), MT('#5B3E8C')); parede.position.set(0, 3.5, -3.4); parede.receiveShadow = true; cena.add(parede);
  [-1, 1].forEach((s) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 16), MT('#4A3275')); p.position.set(s * 5.5, 3.5, 3); cena.add(p); });
  const teto = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 16), MT('#2B1F45')); teto.position.set(0, 6, 3); cena.add(teto);
  // portas
  const portas = PX.map((x, i) => {
    const grupo = new THREE.Group(); grupo.position.set(x, 0, -3.2); cena.add(grupo);
    const moldura = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.9, 0.2), MT('#E8D5A8')); moldura.position.set(0, 1.45, 0.02); grupo.add(moldura); contornar(moldura);
    const buraco = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.6), new THREE.MeshBasicMaterial({ color: '#111' })); buraco.position.set(0, 1.3, 0.125); grupo.add(buraco);
    const luz = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.6), new THREE.MeshBasicMaterial({ color: '#2ECC71', transparent: true, opacity: 0 })); luz.position.set(0, 1.3, 0.127); grupo.add(luz);
    const dobradica = new THREE.Group(); dobradica.position.set(-0.65, 0, 0.14); grupo.add(dobradica);
    const mat = new THREE.MeshToonMaterial({ color: '#C0392B' });
    const folha = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 0.08), mat); folha.position.set(0.65, 1.3, 0); folha.castShadow = true; dobradica.add(folha); contornar(folha);
    const mac = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), MT('#FFD21F')); mac.position.set(1.15, 1.25, 0.07); dobradica.add(mac);
    // número na porta
    const cn = document.createElement('canvas'); cn.width = cn.height = 128; const gn = cn.getContext('2d'); gn.fillStyle = '#fff'; gn.beginPath(); gn.arc(64, 64, 58, 0, 7); gn.fill(); gn.fillStyle = '#111'; gn.font = '900 84px Inter, sans-serif'; gn.textAlign = 'center'; gn.fillText(String(i + 1), 64, 94);
    const tn = new THREE.CanvasTexture(cn); tn.colorSpace = THREE.SRGBColorSpace;
    const num = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), new THREE.MeshBasicMaterial({ map: tn })); num.position.set(0.65, 1.95, 0.05); dobradica.add(num);
    const aura = brilho('#2ECC71', 3.4, 0); aura.position.set(0, 1.3, 0.5); grupo.add(aura);
    return { grupo, dobradica, mat, luz, aura, x };
  });
  const caio = criarPersonagemFlat({ roupa: '#F2B705', calca: '#2F4E7A', cabelo: '#5A3A22', escCabeca: 1.2 });
  cena.add(caio);
  const rb = robo(); rb.position.set(0, 0, -2.7); cena.add(rb);
  const raio = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), new THREE.MeshBasicMaterial({ color: '#9AF0FF', blending: THREE.AdditiveBlending, transparent: true })); cena.add(raio);
  const fumaca = brilho('#555', 0.8, 0); cena.add(fumaca);
  const luzes = [-2.1, 0, 2.1].map((x) => { const l = new THREE.PointLight('#FFE2B0', 4, 7, 1.5); l.position.set(x, 4.6, -1.5); cena.add(l); return l; });

  let E;
  function inicial() {
    E = { fase: 0, abertas: [0, 0, 0], treme: 0 };
    caio.position.set(0, 0, 2.6); caio.rotation.set(0, Math.PI, 0); caio.visible = true; caio.estado = { bracos: 'normal', expr: 'neutro' };
    rb.visible = false; raio.visible = false; fumaca.material.opacity = 0;
  }
  function sempre(t) {
    ctx.centro = [0, 0, 0];
    luzCinema(ctx, 'dia');
    cena.background = new THREE.Color('#1A1230'); cena.fog.near = 30; cena.fog.far = 80;
    ctx.hemi.intensity = 1.5; ctx.sol.intensity = 1.2;
    const F = FASES[E.fase];
    portas.forEach((p, i) => {
      p.mat.color.set(F.cores[i]);
      const a = E.abertas[i];
      p.dobradica.rotation.y = -1.75 * a;
      const certa = i === F.certa;
      p.luz.material.color.set(certa ? '#2ECC71' : '#E74C3C'); p.luz.material.opacity = a * 0.85;
      p.aura.material.color.set(certa ? '#2ECC71' : '#E74C3C'); p.aura.material.opacity = a * 0.7;
    });
    caio.animar(t);
  }
  const T = (b, lt) => b.inicio + lt;
  const mao = (pose, k = 1) => (lt, b) => { const p = typeof pose === 'function' ? pose(lt, b) : pose; const tt = T(b, lt), tr = E.treme; return { pos: p.pos.map((v, i) => v + Math.sin(tt * (0.7 + i * 0.3) + i) * 0.025 * k + (tr ? Math.sin(tt * 55 + i * 2) * 0.05 * tr : 0)), alvo: p.alvo }; };
  const proj = (pos) => { const v = new THREE.Vector3(...pos).project(camera); return [(v.x + 1) * 360, (1 - v.y) * 640]; };
  // pistas: em close, um cartão grande da porta da vez; no plano aberto, a lista das 3
  const cartaGrande = (fase, i, lt, ini = 0) => { const [e, t] = FASES[fase].cartas[i]; const k = Math.max(0.01, salto((lt - ini) / 0.3));
    return `<div style="position:absolute;left:60px;right:60px;top:110px;transform:scale(${k});text-align:center;font-family:Inter,sans-serif;font-weight:900;color:#fff;background:rgba(20,20,35,.85);border:5px solid #fff;border-radius:26px;padding:18px 16px 22px;box-shadow:0 8px 0 rgba(0,0,0,.35)">
      <div style="position:absolute;top:-30px;left:50%;transform:translateX(-50%);background:#FFD21F;color:#111;font-size:34px;border-radius:16px;padding:2px 22px;border:4px solid #111">PORTA ${i + 1}</div>
      <div style="font-size:110px;line-height:1.15">${e}</div><div style="font-size:40px;line-height:1.15">${t}</div></div>`; };
  const cartas = (fase, quantas, lt, ini = [], top = 120) => `<div style="position:absolute;left:30px;right:30px;top:${top}px;font-family:Inter,sans-serif;font-weight:900;color:#fff">` + FASES[fase].cartas.slice(0, quantas).map(([e, t], i) =>
    `<div style="display:flex;align-items:center;gap:14px;background:rgba(20,20,35,.85);border:4px solid #fff;border-radius:18px;padding:8px 14px;margin-bottom:12px"><span style="background:#FFD21F;color:#111;border:3px solid #111;border-radius:12px;font-size:30px;padding:0 12px">${i + 1}</span><span style="font-size:46px">${e}</span><span style="font-size:27px;line-height:1.1">${t}</span></div>`).join('') + '</div>';
  // contagem 3-2-1 (círculo que esvazia)
  const contagem = (lt, ini) => {
    if (lt < ini) return '';
    const s = lt - ini; if (s > 3) return '';
    const n = 3 - Math.floor(s), f = s % 1;
    const C = 2 * Math.PI * 70;
    return `<svg style="position:absolute;left:260px;top:120px;width:200px;height:200px" viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" fill="rgba(0,0,0,.6)" stroke="#111" stroke-width="8"/><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="14"/><circle cx="100" cy="100" r="70" fill="none" stroke="#FFD21F" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * f}" transform="rotate(-90 100 100)"/><text x="100" y="128" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="${84 + 20 * (1 - f)}" fill="#fff">${n}</text></svg>`;
  };
  const tela = (extra = '') => CSS + extra;
  const topo = (txt, lt, ini = 0) => (lt < ini ? '' : `<div class="topo" style="transform:scale(${Math.max(0.01, salto((lt - ini) / 0.3))})">${txt}</div>`);
  const camPortas = mao((lt, b) => ({ pos: [0, 3.3, mistura(10.8, 10.2, lt / b.dur)], alvo: [0, 1.75, -3] }), 0.6);
  const revela = (lt, ini, fase) => FASES[fase].fundo.map((e, i) => { if (!e || lt < ini) return ''; const [x, y] = proj([PX[i], 1.4, -3.0]); return `<div style="position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(${Math.max(0.01, salto((lt - ini - 0.2) / 0.3))});font-size:64px">${e}</div>`; }).join('');
  const abrir = (lt, ini, fase) => { const k = lim((lt - ini) / 0.5); E.abertas = [0, 1, 2].map((i) => (i === FASES[fase].certa ? suave(k) : suave(lim((lt - ini - 0.4) / 0.5)))); };
  const tick = (b0) => [0, 1, 2].map((s) => ({ em: (b) => b.dur - 3 + s, tipo: 'tique' }));

  // monta uma fase: anúncio de cada porta, contagem, resposta
  function fase(f, falas, resposta, extraResp = {}) {
    const F = FASES[f];
    const anun = falas.map((fala, i) => ({
      fala, destaque: fala.destaque || [], corteSeco: i === 0,
      camera: mao((lt, b) => { const x = PX[i] * 0.7; return { pos: [x, 2.3, mistura(3.4, 2.6, suave(lt / b.dur))], alvo: [PX[i] * 0.95, 2.0, -3] }; }, 0.5),
      aplicar(lt, b) { E.fase = f; E.abertas = [0, 0, 0]; caio.position.set(0, 0, 2.6); caio.rotation.set(0, Math.PI, 0); caio.estado = { bracos: 'normal', expr: i === 2 ? 'surpreso' : 'neutro', olharLado: [-0.5, 0, 0.5][i] }; },
      camada: (lt, b) => tela(cartaGrande(f, i, lt, 0.05)),
      sons: [{ em: () => 0.05, tipo: 'pop' }],
    }));
    return anun;
  }
  const valendo = (f, fala) => ({
    fala, destaque: ['segundos', 'valendo'],
    pausaDepois: 3.1,
    camera: camPortas,
    aplicar(lt, b) { E.fase = f; E.abertas = [0, 0, 0]; caio.estado = { bracos: 'cabeca', expr: 'medo', olharLado: Math.sin(T(b, lt) * 3) * 0.6 }; },
    camada: (lt, b) => tela(cartas(f, 3, lt, [], 370) + contagem(lt, b.dur - 3.05)),
    sons: [0, 1, 2].map((s) => ({ em: (b) => b.dur - 3.05 + s, tipo: 'tique' })),
  });
  const resposta = (f, fala, destaque, sons = []) => ({
    fala, destaque, corteSeco: true,
    camera: camPortas,
    aplicar(lt, b) { E.fase = f; abrir(lt, 0.1, f); const k = lim((lt - 1.2) / 1.4); caio.position.set(mistura(0, PX[FASES[f].certa], k), 0, mistura(2.6, -2.4, k)); caio.estado = { bracos: k > 0 ? 'normal' : 'aponta', expr: 'feliz', andar: k > 0 && k < 1 ? 1 : 0 }; caio.visible = k < 0.98; },
    camada: (lt, b) => tela(revela(lt, 0.4, f) + `<svg style="position:absolute;left:${proj([PX[FASES[f].certa], 3.1, -3.2])[0] - 50}px;top:${proj([PX[FASES[f].certa], 3.1, -3.2])[1] - 100}px;width:100px;height:100px;transform:scale(${Math.max(0.01, salto((lt - 0.5) / 0.3))})" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#2ECC71" stroke="#111" stroke-width="6"/><path d="M28 52 L44 68 L74 34" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`),
    sons: [{ em: () => 0.1, tipo: 'porta' }, { em: () => 0.5, tipo: 'ok' }, ...sons],
  });

  const blocos = [
    {
      fala: 'Escolha uma porta. Só uma te deixa sair vivo.',
      destaque: ['porta', 'vivo'],
      camera: (lt, b) => { const k = suave(lt / b.dur); return { pos: [mistura(-3, 0, k), mistura(4.5, 3.3, k), mistura(14, 10.8, k)], alvo: [0, 1.75, -3] }; },
      aplicar(lt, b) { E.fase = 0; caio.estado = { bracos: 'normal', expr: 'surpreso', olharLado: Math.sin(T(b, lt) * 2) * 0.5 }; },
      camada: (lt, b) => tela(topo('ESCOLHA<br>UMA <b>PORTA</b> 🚪', lt, 0.1)),
      sons: [{ em: () => 0.1, tipo: 'impacto' }, { em: 'vivo', tipo: 'tensao' }],
    },
    ...fase(0, ['Porta um: um leão que não come há três meses.', 'Porta dois: uma sala pegando fogo.', 'Porta três: uma piscina cheia de tubarões.']),
    valendo(0, 'Você tem três segundos.'),
    resposta(0, 'Porta um! Um leão sem comer há três meses... já morreu.', ['um', 'morreu'], [{ em: 'morreu', tipo: 'pop' }]),
    {
      fala: 'Fase dois.',
      destaque: ['dois'], corteSeco: true,
      camera: camPortas,
      aplicar(lt, b) { E.fase = 1; E.abertas = [0, 0, 0]; caio.visible = true; caio.position.set(0, 0, 2.6); caio.estado = { bracos: 'normal', expr: 'serio' }; },
      camada: (lt, b) => tela(topo('FASE <b>2</b>', lt, 0)),
      sons: [{ em: () => 0.05, tipo: 'subida' }],
    },
    ...fase(1, ['Porta um: uma ponte de vidro que aguenta oitenta quilos. Você pesa setenta, e tá com uma mochila de quinze.', 'Porta dois: um corredor escuro, com um buraco no meio.', 'Porta três: uma sala que enche de água em dez minutos. A saída fica a dois minutos.']),
    valendo(1, 'Três segundos.'),
    resposta(1, 'Porta três! Setenta mais quinze dá oitenta e cinco. A ponte ia quebrar.', ['três', 'quebrar'], [{ em: 'quebrar', tipo: 'vidro' }]),
    {
      fala: 'Última fase. Essa é a mais difícil.',
      destaque: ['última', 'difícil'], corteSeco: true,
      camera: camPortas,
      aplicar(lt, b) { E.fase = 2; E.abertas = [0, 0, 0]; caio.visible = true; caio.position.set(0, 0, 2.6); caio.estado = { bracos: 'normal', expr: 'medo' }; },
      camada: (lt, b) => tela(topo('FASE <b>FINAL</b> 💀', lt, 0)),
      sons: [{ em: () => 0.05, tipo: 'tensao' }],
    },
    ...fase(2, ['Porta um: um dragão que acorda com qualquer barulho. E o seu tênis range.', 'Porta dois: um robô que só deixa passar quem souber quanto é sete vezes oito.', 'Porta três: um chão que vira lava em cinco segundos.']),
    valendo(2, 'Valendo!'),
    {
      fala: 'Porta dois! Sete vezes oito é cinquenta e seis.',
      destaque: ['dois', 'cinquenta'], corteSeco: true,
      camera: camPortas,
      aplicar(lt, b) { E.fase = 2; abrir(lt, 0.1, 2); rb.visible = true; rb.position.set(0, 0, -2.7); const k = lim((lt - 1.0) / 1.0); caio.position.set(0, 0, mistura(2.6, -1.6, k)); caio.estado = { bracos: 'normal', expr: 'feliz', andar: k > 0 && k < 1 ? 1 : 0 }; },
      camada: (lt, b) => tela(revela(lt, 0.4, 2) + (lt > b.palavra('cinquenta') ? `<div class="topo" style="top:190px">7 × 8 = <b>56</b></div>` : '')),
      sons: [{ em: () => 0.1, tipo: 'porta' }, { em: 'cinquenta', tipo: 'ok' }],
    },
    {
      fala: 'Só que o Caio respondeu cinquenta e quatro.',
      destaque: ['cinquenta', 'quatro'], corteSeco: true,
      camera: mao((lt, b) => ({ pos: [-1.2, 2.3, 1.2], alvo: [0.1, 1.5, -2.9] }), 0.5),
      aplicar(lt, b) {
        E.fase = 2; E.abertas = [0, 1, 0]; rb.visible = true; caio.position.set(0, 0, -1.6); caio.rotation.set(0, Math.PI, 0);
        const z = lt > b.palavra('quatro') + 0.2;
        caio.estado = { bracos: z ? 'cima' : 'aponta', expr: z ? 'medo' : 'feliz', falando: b.falando(lt) && lt > b.palavra('respondeu') };
        rb.tela.material.color.set(z ? '#FF4040' : '#58D2FF');
        raio.visible = z && lt < b.palavra('quatro') + 1.2; const A = new THREE.Vector3(0, 1.62, -2.45), Bp = new THREE.Vector3(0, 1.4, -1.6);
        raio.position.copy(A).add(Bp).multiplyScalar(0.5); raio.scale.set(1 + Math.sin(T(b, lt) * 60), A.distanceTo(Bp), 1); raio.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bp.clone().sub(A).normalize());
        E.treme = raio.visible ? 0.8 : 0;
        fumaca.position.set(0, 2.1, -1.6); fumaca.material.opacity = z ? 0.6 : 0;
      },
      camada: (lt, b) => tela(lt > b.palavra('quatro') ? `<div class="topo" style="top:190px;color:#FF5A5A">❌ ERRADO!</div>` : ''),
      sons: [{ em: 'quatro', depois: 0.2, tipo: 'zap' }, { em: 'quatro', depois: 0.25, tipo: 'glitch' }],
    },
    {
      fala: 'E você? Quantas acertou?',
      destaque: ['quantas'], corteSeco: true,
      camera: mao((lt, b) => ({ pos: [0.3, 1.75, mistura(0.3, 0.0, lt / b.dur)], alvo: [0, 1.7, -1.6] }), 0.3),
      aplicar(lt, b) { E.fase = 2; E.abertas = [0, 1, 0]; rb.visible = true; caio.position.set(0, 0, -1.6); caio.rotation.set(0, 0, 0); caio.estado = { bracos: 'normal', expr: 'medo' }; fumaca.position.set(0, 2.2, -1.6); fumaca.material.opacity = 0.5; },
      camada: (lt, b) => tela(lt > b.palavra('quantas') ? `<div style="position:absolute;left:0;right:0;top:170px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:80px;color:#fff;-webkit-text-stroke:13px #111;paint-order:stroke fill">${['0', '1', '2', '3'].map((n, i) => `<span style="display:inline-block;margin:0 14px;color:${i === 3 ? '#FFD21F' : '#fff'};transform:scale(${Math.max(0.01, salto((lt - b.palavra('quantas') - i * 0.15) / 0.3))})">${n}</span>`).join('')}</div>` : ''),
      sons: [{ em: 'quantas', tipo: 'pop' }],
    },
  ];
  blocos[blocos.length - 1].pausaDepois = 1.4;
  return { blocos, inicial, sempre };
}
