// "E SE UM PIANO CAÍSSE NA SUA CABEÇA?" -> isekai: você renasce num reino medieval onde todo mundo
// nasce com uma MARCA de poder… e a sua é amaldiçoada. Personagem 3D (toon) + cenário 2D, 2K.
// Referência de GÊNERO (isekai): morte absurda -> renasce bebê num mundo de fantasia; "escolhido
// rejeitado" com a marca proibida. Personagens, marcas e desenhos são originais.
//
// Física conferida (queda livre, sem resistência do ar):
//  - h = 30 m (~10º andar), g = 9,8 m/s². Ganha 9,8 m/s = ~35 km/h a cada segundo.
//  - Até a cabeça (1,8 m do chão): Δh = 28,2 m -> t = √(2·28,2/9,8) ≈ 2,4 s; v = 9,8·2,4 ≈ 23,5 m/s ≈ 85 km/h.
//  - Energia: m·g·Δh = 250·9,8·28,2 ≈ 69 mil J ≈ levantar um carro de 1 t a 7 m (1000·9,8·7 = 68,6 mil J).
import * as THREE from 'three';
import { suave, lim, mistura, cartao, etiqueta, som } from '../motor.js';
import { criarPersonagemToon } from '../personagem-toon.js';
import { tela2d, ceuDia, cidade, rua, predio, piano2d, operario, polia, placaRua, notas, particulas, LINHA } from '../desenho2d.js';
import { ceuAmanhecer, montanhas, castelo, casaMedieval, quartoPedra, vela, bercoDeCima, rostosEspiando, marca, moradorComPoder, livroAntigo } from '../desenho-medieval.js';
import { finalPergunta } from '../formato-dias.js';

export const config = {
  titulo: ['E SE UM *PIANO*', 'CAÍSSE NA SUA', '*CABEÇA*?'],
  qualidade: '2k',
  velocidade: '+10%',
  legendaTopo: 1075,
};

const CHAO = 960;
const TOPO = -840;        // topo do prédio (mundo 2D)
const PIANO_Y0 = -690;    // centro do piano pendurado
const SUBIR = 1340;       // pan até o topo do prédio
const T_CABECA = 2.4;     // s até a cabeça
const H0 = 30, HC = 1.8;

const fis = (t) => ({ h: Math.max(HC, H0 - 4.9 * t * t), v: 9.8 * Math.min(t, T_CABECA) * 3.6 });

// ---------- cenários 2D ----------
function paulista(t, S, { anda = 0, piano = null, cordaPartida = -1, operarios = 'serio' } = {}) {
  let d = ceuDia('#7EC8FF', '#E3F6FF');
  d += cidade(CHAO, { semente: 8 });
  // prédio alto do piano (10 andares), com sacadas
  d += predio(400, CHAO, 260, CHAO - TOPO, '#D9D2C3', { semente: 77, telhado: '#6B6F7A' });
  for (let y = CHAO - 150; y > TOPO + 60; y -= 150) d += `<rect x="392" y="${y}" width="276" height="10" fill="#9A9488" stroke="${LINHA}" stroke-width="3"/>`;
  // operários e polia no topo
  if (cordaPartida >= -0.5) {
    d += polia(540, TOPO - 40, PIANO_Y0 - 125, { partida: Math.max(0, cordaPartida) });
    d += operario(450, TOPO - 6, { esc: 0.45, expr: operarios, braco: cordaPartida > 0 ? 'cabeca' : 'aponta' }) + operario(620, TOPO - 6, { esc: 0.45, expr: operarios, virado: -1, braco: cordaPartida > 0 ? 'orelhas' : 'baixo' });
  }
  d += rua(CHAO) + placaRua(150, CHAO - 230, 'AV. PAULISTA');
  if (piano) d += piano;
  d += particulas(t, { n: 10, cor: '#FFFFFF', semente: 4, area: [-100, -1500, 920, 2600] });
  return tela2d(d, { zoom: 1, x: 360 + anda, y: 640 - S });
}
// camada da FRENTE (mesma câmera 2D, sem vinheta): piano por cima do personagem 3D
const frente = (conteudo, S = 0, anda = 0) => `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px"><g transform="translate(${-anda},${S})">${conteudo}</g></svg>`;

function hudQueda(t) {
  const { h, v } = fis(t);
  const cor = v > 60 ? '#FF4D4D' : v > 30 ? '#FFD21F' : '#FFFFFF';
  return `<div style="position:absolute;left:28px;top:34px;background:rgba(10,12,20,.75);border-radius:14px;padding:10px 18px;font-family:Inter,sans-serif;color:#fff">
    <div style="font-weight:800;font-size:14px;letter-spacing:1px;color:#C9D2E3">ALTURA</div><div style="font-weight:900;font-size:40px;line-height:1">${h.toFixed(1)} m</div>
    <div style="font-weight:800;font-size:14px;letter-spacing:1px;color:#C9D2E3;margin-top:8px">VELOCIDADE</div><div style="font-weight:900;font-size:40px;line-height:1;color:${cor}">${Math.round(v)} km/h</div>
    <div style="font-weight:800;font-size:13px;color:#9AA3B5;margin-top:6px">⏱ ${t.toFixed(2)} s · CÂMERA LENTA</div></div>`;
}

function reino(t) {
  let d = ceuAmanhecer() + montanhas(760) + castelo(360, 760, t, 1.1);
  const casas = [[-60, 960, '#F1E3C6', '#9C3D2E'], [120, 990, '#E9D3A8', '#6B3A1A'], [430, 980, '#F1E3C6', '#3E5BA9'], [600, 960, '#E9D3A8', '#9C3D2E']];
  casas.forEach(([x, y, c, tl]) => (d += casaMedieval(x, y, { cor: c, telhado: tl, t })));
  d += `<rect x="-800" y="990" width="2400" height="800" fill="#6BA05A"/><path d="M300 990 Q360 1100 260 1280 L460 1280 Q420 1100 420 990 Z" fill="#C9A36B"/>`;
  d += particulas(t, { n: 20, cor: '#FFE9A6', semente: 13 });
  return tela2d(d);
}
const quartoDeCima = (t, medo = 0, comRostos = false) => {
  let d = `<rect x="-800" y="-800" width="2400" height="2900" fill="#6B4A33"/>`;
  for (let k = -6; k < 14; k++) d += `<line x1="${k * 110}" y1="-800" x2="${k * 110}" y2="2100" stroke="#553A28" stroke-width="6"/>`;
  d += vela(90, 230, t) + vela(640, 230, t) + vela(90, 1160, t) + vela(640, 1160, t);
  d += bercoDeCima(360, 660, t);
  if (comRostos) d += rostosEspiando(360, 660, medo, t);
  return tela2d(d);
};

export function criar(ctx) {
  const { cena, camera, hemi, sol } = ctx;
  cena.background = null;
  cena.fog = null;
  camera.fov = 28;
  camera.updateProjectionMatrix();
  hemi.intensity = 1.6;
  sol.intensity = 2.3;
  sol.position.set(3, 8, 6);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.28 }));
  sombra.rotation.x = -Math.PI / 2;
  sombra.receiveShadow = true;
  cena.add(sombra);

  const voce = criarPersonagemToon({ fone: true });
  const bebe = criarPersonagemToon({ estilo: 'bebe', cores: { roupa: '#F4EEDF', roupaDet: '#E3D6B8', calca: '#F4EEDF', tenis: '#F6C9A0', sola: '#F6C9A0', cabelo: '#3B2314' } });
  cena.add(voce, bebe);

  const proj = new THREE.Vector3();
  const naTela = (v) => { proj.copy(v).project(camera); return [(proj.x + 1) * 360, (1 - proj.y) * 640]; };
  const peitoBebe = new THREE.Vector3();

  let E;
  function inicial() {
    E = { cena: 'rua' };
    voce.visible = true;
    voce.position.set(0.5, 0, 0);
    voce.rotation.set(0, -0.25, 0);
    voce.estado = { bracos: 'celular', expr: 'sorriso', andar: 0.6 };
    bebe.visible = false;
    bebe.position.set(0, 0.12, 0.05);
    bebe.rotation.set(-Math.PI / 2, 0, 0);
    bebe.estado = { bracos: 'normal', expr: 'feliz' };
  }
  function sempre(t) {
    const rua = E.cena === 'rua';
    voce.visible = rua && E.mostraVoce !== false;
    bebe.visible = E.cena === 'bebe';
    sombra.visible = rua;
    voce.animar(t);
    bebe.animar(t);
  }
  const camRua = { pos: [0, 1.0, 8], alvo: [0, 1.0, 0] };
  const camBebe = { pos: [0, 3.4, 0.3], alvo: [0, 0, -0.32] };
  const camBebePerto = { pos: [0, 2.0, -0.05], alvo: [0, 0.1, -0.42] };
  const T = (b, lt) => b.inicio + lt;
  const pianoNaRua = (y, rot = 0) => piano2d(540, y, { s: 0.55, rot });
  // tela 2D da rua com a câmera "andando" (o fundo corre devagar)
  const andando = (b, lt) => 40 * Math.sin(T(b, lt) * 0.3);

  const blocos = [
    // ---------------- PARTE 1: o piano ----------------
    {
      fala: 'E se você estivesse andando pela Avenida Paulista, e um piano caísse na sua cabeça?',
      destaque: ['paulista', 'piano', 'cabeça'],
      semLegenda: true,
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt), piano: pianoNaRua(PIANO_Y0), cordaPartida: 0 }),
      aplicar(lt, b) { E.cena = 'rua'; voce.estado = { bracos: 'celular', expr: 'sorriso', andar: 0.6 }; },
      camada: (lt, b) => `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px">${notas(330, 360, T(b, lt))}</svg>`,
      sons: [{ em: () => 0.02, tipo: 'impacto' }],
    },
    {
      fala: 'Lá no décimo andar, dois caras estão içando um piano por uma corda.',
      destaque: ['décimo', 'piano', 'corda'],
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), SUBIR * suave(lt / 1.6), { piano: pianoNaRua(PIANO_Y0 + Math.sin(T(b, lt) * 2) * 6, Math.sin(T(b, lt) * 1.5) * 4), cordaPartida: 0 }),
      aplicar(lt) { E.cena = 'rua'; E.mostraVoce = lt < 0.4; },
      sons: [{ em: () => 0.05, tipo: 'whoosh' }, { em: 'corda', tipo: 'martelo' }],
    },
    {
      fala: 'Aí, a corda arrebenta.',
      destaque: ['arrebenta'],
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), SUBIR, { piano: pianoNaRua(PIANO_Y0 + 4, -3), cordaPartida: lim((lt - b.palavra('arrebenta')) / 0.25), operarios: lt > b.palavra('arrebenta') ? 'medo' : 'serio' }),
      aplicar() { E.cena = 'rua'; E.mostraVoce = false; },
      camada: (lt, b) => som(lt, b.palavra('arrebenta'), 'TÉC!', 1.2),
      sons: [{ em: 'arrebenta', tipo: 'quebra' }],
    },
    {
      fala: 'O piano tem duzentos e cinquenta quilos, e está a trinta metros do chão.',
      destaque: ['duzentos', 'trinta'],
      camera: camRua,
      cenario2d: (lt, b) => {
        const tf = 0.45 * (lt / b.dur), { h } = fis(tf);
        const y = PIANO_Y0 + (H0 - h) * 51;
        return paulista(T(b, lt), Math.min(SUBIR, Math.max(0, 500 - y)), { piano: pianoNaRua(y, tf * 20), cordaPartida: 1, operarios: 'medo' });
      },
      aplicar() { E.cena = 'rua'; E.mostraVoce = false; },
      camada: (lt, b) => hudQueda(0.45 * (lt / b.dur)) + cartao(lt, b.palavra('duzentos'), '250 kg', 'PIANO DE ARMÁRIO'),
      sons: [{ em: 'trinta', tipo: 'dia' }],
    },
    {
      fala: 'A gravidade puxa ele pra baixo. A cada segundo, ele ganha quase trinta e cinco quilômetros por hora a mais.',
      destaque: ['gravidade', 'segundo', 'trinta'],
      camera: camRua,
      cenario2d: (lt, b) => {
        const tf = mistura(0.45, 1.25, lt / b.dur), { h } = fis(tf);
        const y = PIANO_Y0 + (H0 - h) * 51;
        const seta = `<g transform="translate(680,${y - 40})"><line x1="0" y1="-60" x2="0" y2="80" stroke="#FF4D4D" stroke-width="10"/><path d="M-22 70 L0 110 L22 70 Z" fill="#FF4D4D"/></g>`;
        return paulista(T(b, lt), Math.min(SUBIR, Math.max(0, 500 - y)), { piano: pianoNaRua(y, tf * 20) + seta, cordaPartida: 1, operarios: 'medo' });
      },
      aplicar() { E.cena = 'rua'; E.mostraVoce = false; },
      camada: (lt, b) => hudQueda(mistura(0.45, 1.25, lt / b.dur)) + etiqueta(lt, b.palavra('gravidade'), 'GRAVIDADE: 9,8 m/s²'),
      sons: [{ em: 'gravidade', tipo: 'whoosh' }],
    },
    {
      fala: 'Lá embaixo, você não ouve nada. Tá de fone, olhando o celular.',
      destaque: ['fone', 'celular'],
      corteSeco: true,
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt) }),
      aplicar(lt, b) { E.cena = 'rua'; E.mostraVoce = true; voce.estado = { bracos: 'celular', expr: 'sorriso', andar: 0.6 }; },
      camada: (lt, b) => `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px">${notas(330, 360, T(b, lt))}</svg>` + hudQueda(mistura(1.25, 1.7, lt / b.dur)),
    },
    {
      fala: 'Em dois segundos e meio, o piano passa de oitenta quilômetros por hora.',
      destaque: ['dois', 'oitenta'],
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt) }),
      aplicar() { E.cena = 'rua'; E.mostraVoce = true; voce.estado = { bracos: 'celular', expr: 'sorriso', andar: 0.6 }; },
      camada: (lt, b) => frente(pianoNaRua(mistura(-260, 170, suave(lt / b.dur)), 25), 0, andando(b, lt)) + hudQueda(mistura(1.7, 2.3, lt / b.dur)) + cartao(lt, b.palavra('oitenta'), '+80 km/h', 'EM 2,4 SEGUNDOS'),
      sons: [{ em: () => 0.1, tipo: 'passagem' }, { em: 'oitenta', tipo: 'dia' }],
    },
    {
      fala: 'A energia da batida é a mesma de levantar um carro de uma tonelada a sete metros de altura.',
      destaque: ['energia', 'carro', 'sete'],
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt) }),
      aplicar() { E.cena = 'rua'; E.mostraVoce = true; voce.estado = { bracos: 'celular', expr: 'sorriso', andar: 0.15 }; },
      camada: (lt, b) => frente(pianoNaRua(mistura(170, 270, lt / b.dur), 25), 0, andando(b, lt)) + hudQueda(mistura(2.3, 2.38, lt / b.dur)) + cartao(lt, b.palavra('energia'), '69.000 J', 'DE ENERGIA') + etiqueta(lt, b.palavra('carro'), '= ERGUER UM CARRO A 7 m'),
      sons: [{ em: 'energia', tipo: 'tensao' }],
    },
    {
      fala: 'E aí...',
      camera: camRua,
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt) }),
      aplicar(lt) { E.cena = 'rua'; E.mostraVoce = true; voce.estado = { bracos: 'celular', expr: lt > 0.4 ? 'surpreso' : 'sorriso', andar: 0 }; },
      camada: (lt, b) => frente(pianoNaRua(mistura(270, 320, lt / b.dur), 25), 0, andando(b, lt)) + hudQueda(2.39),
      sons: [{ em: () => 0.1, tipo: 'coracao' }],
    },
    {
      fala: 'PLAM.',
      destaque: ['plam'],
      corteSeco: true,
      camera: (lt) => ({ pos: [Math.sin(lt * 70) * 0.06 * (1 - lim(lt / 0.6)), 1.0, 8], alvo: [0, 1.0, 0] }),
      cenario2d: (lt, b) => paulista(T(b, lt), 0, { anda: andando(b, lt) }),
      aplicar() { E.cena = 'rua'; E.mostraVoce = false; },
      camada: (lt, b) => {
        // piano no chão; só os tênis aparecem embaixo (desenho, sem nada pesado)
        const tenis = `<ellipse cx="500" cy="${CHAO - 8}" rx="34" ry="18" fill="#E8322B" stroke="${LINHA}" stroke-width="4"/><ellipse cx="590" cy="${CHAO - 8}" rx="34" ry="18" fill="#E8322B" stroke="${LINHA}" stroke-width="4"/>`;
        const estrelas = [0, 1, 2].map((k) => { const a = T(b, lt) * 3 + k * 2.1; return `<text x="${545 + Math.cos(a) * 90}" y="${700 + Math.sin(a) * 25}" font-size="40" fill="#FFD21F" stroke="${LINHA}" stroke-width="2">★</text>`; }).join('');
        return frente(tenis + pianoNaRua(CHAO - 75, 3) + estrelas, 0, andando(b, lt)) + som(lt, 0.02, 'PLAM!', 1.4) + `<div style="position:absolute;inset:0;background:#000;opacity:${lim((lt - (b.dur - 0.6)) / 0.5)}"></div>`;
      },
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.05, tipo: 'quebra' }, { em: () => 0.1, tipo: 'baque' }],
    },
    {
      fala: 'Tudo ficou preto.',
      camera: camRua,
      cenario2d: () => '<div style="position:absolute;inset:0;background:#000"></div>',
      aplicar() { E.cena = 'preto'; },
      sons: [{ em: () => 0.1, tipo: 'coracao' }, { em: () => 1.2, tipo: 'coracao' }],
    },
    // ---------------- PARTE 2: o isekai ----------------
    {
      fala: 'Até que você ouviu um choro. Era o seu.',
      destaque: ['choro', 'seu'],
      camera: camBebe,
      cenario2d: (lt, b) => quartoDeCima(T(b, lt)) + `<div style="position:absolute;inset:0;background:#000;opacity:${1 - lim((lt - b.palavra('era')) / 0.6)}"></div>`,
      aplicar(lt, b) { E.cena = 'bebe'; bebe.estado = { bracos: 'cima', expr: 'surpreso', falando: lt > b.palavra('era') }; },
      sons: [{ em: 'choro', tipo: 'choro' }, { em: 'era', tipo: 'choro' }],
    },
    {
      fala: 'Você tinha nascido de novo. Num reino medieval.',
      destaque: ['nascido', 'medieval'],
      corteSeco: true,
      camera: camBebe,
      cenario2d: (lt, b) => reino(T(b, lt)),
      aplicar() { E.cena = 'reino'; },
      sons: [{ em: 'reino', tipo: 'sino' }],
    },
    {
      fala: 'Aqui, todo mundo nasce com uma marca no corpo. E a marca mostra o seu poder.',
      destaque: ['marca', 'poder'],
      camera: camBebe,
      cenario2d: (lt, b) => {
        const t = T(b, lt);
        const ms = ['chama', 'gota', 'raio', 'folha'].map((tp, i) => (lt > 0.6 + i * 0.5 ? marca(tp, 150 + (i % 2) * 420, 470 + Math.floor(i / 2) * 330, { s: 1.9 * Math.min(1, (lt - 0.6 - i * 0.5) / 0.25), t }) : '')).join('');
        return reino(t).replace('</g>\n  <rect width="720"', `</g><rect x="0" y="0" width="720" height="1280" fill="#140F1C" opacity=".55"/>${ms}\n  <rect width="720"`);
      },
      aplicar() { E.cena = 'reino'; },
      sons: [0.6, 1.1, 1.6, 2.1].map((d) => ({ em: () => d, tipo: 'brilho' })),
    },
    {
      fala: 'Uma chama na mão: fogo. Uma gota no pescoço: água. Um raio no braço: trovão.',
      destaque: ['fogo', 'água', 'trovão'],
      camera: camBebe,
      cenario2d: (lt, b) => {
        const t = T(b, lt);
        let d = ceuAmanhecer() + `<rect x="-800" y="960" width="2400" height="800" fill="#6BA05A"/>`;
        if (lt > b.palavra('chama') - 0.2) d += moradorComPoder(140, 980, 'chama', t, { esc: 1.0 });
        if (lt > b.palavra('gota') - 0.2) d += moradorComPoder(360, 980, 'gota', t, { esc: 1.0, tipoPessoa: 'menina' });
        if (lt > b.palavra('raio') - 0.2) d += moradorComPoder(580, 980, 'raio', t, { esc: 1.0, tipoPessoa: 'velho' });
        return tela2d(d);
      },
      aplicar() { E.cena = 'reino'; },
      sons: [{ em: 'fogo', tipo: 'fogo' }, { em: 'agua', tipo: 'splash' }, { em: 'trovao', tipo: 'zap' }],
    },
    {
      fala: 'Quando um bebê nasce, a vila inteira corre pra ver a marca dele.',
      destaque: ['vila', 'marca'],
      corteSeco: true,
      camera: camBebe,
      cenario2d: (lt, b) => quartoDeCima(T(b, lt), 0, true),
      aplicar(lt, b) { E.cena = 'bebe'; bebe.estado = { bracos: 'normal', expr: 'feliz' }; },
    },
    {
      fala: 'A sua apareceu no peito. Preta. Em forma de olho.',
      destaque: ['peito', 'preta', 'olho'],
      camera: camBebe,
      cameraFim: camBebePerto,
      cenario2d: (lt, b) => quartoDeCima(T(b, lt), lt > b.palavra('preta') ? 1 : 0, true),
      aplicar(lt, b) { E.cena = 'bebe'; bebe.estado = { bracos: 'normal', expr: lt > b.palavra('olho') ? 'surpreso' : 'feliz' }; },
      camada: (lt, b) => {
        const k = lim((lt - b.palavra('peito')) / 0.8);
        if (k <= 0) return '';
        peitoBebe.set(0, 0.12 + 0.07, 0.05 - 0.36);
        const [x, y] = naTela(peitoBebe);
        const esc = mistura(0.35, 0.8, suave((lt - b.palavra('peito')) / b.dur));
        return `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px;opacity:${k}">${marca('olho', x, y, { s: esc, t: T(b, lt) })}</svg>`;
      },
      sons: [{ em: 'peito', tipo: 'impacto' }, { em: 'olho', tipo: 'tensao' }],
    },
    {
      fala: 'A parteira gritou. Os sinos tocaram. Ninguém nunca tinha visto aquela marca.',
      destaque: ['gritou', 'sinos', 'ninguém'],
      camera: (lt) => ({ pos: [Math.sin(lt * 40) * 0.02, 2.0, -0.05], alvo: [0, 0.1, -0.42] }),
      cenario2d: (lt, b) => quartoDeCima(T(b, lt), 1, true),
      aplicar() { E.cena = 'bebe'; bebe.estado = { bracos: 'cima', expr: 'surpreso' }; },
      camada: (lt, b) => {
        peitoBebe.set(0, 0.12 + 0.07, 0.05 - 0.36);
        const [x, y] = naTela(peitoBebe);
        return `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px">${marca('olho', x, y, { s: 0.8, t: T(b, lt) })}</svg>` + som(lt, b.palavra('gritou'), 'AAAH!', 1.0);
      },
      sons: [{ em: 'sinos', tipo: 'sino' }, { em: 'sinos', depois: 0.8, tipo: 'sino' }],
    },
    {
      fala: 'No livro mais antigo do reino, ela tinha um nome só: a marca do fim.',
      destaque: ['livro', 'fim'],
      corteSeco: true,
      camera: camBebe,
      cenario2d: (lt, b) => tela2d(quartoPedra(1500, T(b, lt)) + vela(110, 1030, T(b, lt)) + vela(610, 1030, T(b, lt)) + livroAntigo(360, 640, T(b, lt), lim((lt - b.palavra('fim') + 0.3) / 0.4)), { zoom: mistura(1, 1.12, lt / b.dur) }),
      aplicar() { E.cena = 'livro'; },
      sons: [{ em: 'livro', tipo: 'passagem' }, { em: 'fim', tipo: 'impacto' }],
    },
    {
      fala: 'E você ainda nem sabe falar.',
      destaque: ['falar'],
      corteSeco: true,
      camera: camBebePerto,
      cenario2d: (lt, b) => quartoDeCima(T(b, lt), 1, true),
      aplicar() { E.cena = 'bebe'; bebe.estado = { bracos: 'normal', expr: 'preocupado' }; },
      camada: (lt, b) => {
        peitoBebe.set(0, 0.12 + 0.07, 0.05 - 0.36);
        const [x, y] = naTela(peitoBebe);
        return `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px">${marca('olho', x, y, { s: 0.8, t: T(b, lt) })}</svg>` + som(lt, b.palavra('falar'), '...?', 1.2);
      },
      sons: [{ em: 'falar', tipo: 'pop' }],
    },
    {
      fala: 'Quer a parte dois? Comenta aí qual marca você queria ter.',
      semLegenda: true,
      corteSeco: true,
      camera: camBebe,
      cenario2d: (lt, b) => {
        const t = T(b, lt);
        const ms = ['chama', 'gota', 'raio', 'folha', 'olho'].map((tp, i) => marca(tp, 80 + i * 140, 1000, { s: 0.9, t })).join('');
        return reino(t).replace('</g>\n  <rect width="720"', `</g><rect x="0" y="0" width="720" height="1280" fill="#140F1C" opacity=".45"/>${ms}\n  <rect width="720"`);
      },
      aplicar() { E.cena = 'reino'; },
      camada: (lt, b) => finalPergunta(lt, ['QUAL MARCA', '*VOCÊ QUERIA TER?*'], 'PARTE 2? COMENTA! 👇', b.palavra('comenta')),
      sons: [{ em: () => 0.02, tipo: 'pop' }, { em: 'comenta', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial, sempre };
}
