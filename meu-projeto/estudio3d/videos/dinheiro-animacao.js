// VÍDEO: "30 dias postando animação: dá dinheiro?" — formato "N dias de…" (ver PADRAO-DIAS.md)
// Fatos conferidos:
//  - YouTube (Programa de Parcerias, receita de anúncios nos Shorts): 1.000 inscritos +
//    10 milhões de visualizações válidas de Shorts nos últimos 90 dias (ou 4.000 horas em vídeos longos).
//  - Shorts pagam pouco por visualização: a receita costuma ficar em centavos de dólar a cada mil views.
//  - TikTok (Creator Rewards): 18+ anos, 10 mil seguidores, 100 mil visualizações nos últimos 30 dias,
//    e só vídeos com mais de 1 minuto.
//  - Vender vídeos (freelance) e publicidade (publi) não dependem de programa de monetização.
//  - Sem promessa de ganho: o vídeo diz que exige constância por meses.
import * as THREE from 'three';
import { suave, saida, salto, lim, mistura, cartao, etiqueta, ok } from '../motor.js';
import { mat, caixa, cilindro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['30 DIAS POSTANDO', '*ANIMAÇÃO*:', 'DÁ *DINHEIRO*?'],
  musica: false, // como na referência: silêncio + voz + efeitos
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- HUD "VÍDEOS POSTADOS / DIA N" (canto superior esquerdo) ----------
function hud(lt, de, ate) {
  const n = Math.round(mistura(de, ate, suave(lt / 1.2)));
  const cor = n >= 20 ? '#3DDC84' : n >= 10 ? '#FFD21F' : '#FFFFFF';
  return `<div style="position:absolute;left:28px;top:34px;background:rgba(10,12,20,.72);border-radius:14px;padding:10px 18px 8px;font-family:Inter,sans-serif">
    <div style="color:#C9D2E3;font-weight:800;font-size:15px;letter-spacing:1px">VÍDEOS POSTADOS</div>
    <div style="display:flex;align-items:baseline;gap:22px"><span style="color:${cor};font-weight:900;font-size:56px;line-height:1">${n}</span>
    <span style="color:#fff;font-weight:900;font-size:22px">DIA ${ate}</span></div></div>`;
}
// Selo grande "DIA N" no centro (aparece e some no começo do bloco)
function selo(lt, dia) {
  if (lt > 1.3) return '';
  const k = Math.max(0.01, salto(lt / 0.25)), op = 1 - lim((lt - 1.0) / 0.3);
  return `<div style="position:absolute;left:50%;top:430px;transform:translate(-50%,0) scale(${k});opacity:${op};
    border:5px solid #FFD21F;border-radius:16px;background:rgba(10,12,20,.8);padding:6px 34px;
    color:#fff;font-family:Inter,sans-serif;font-weight:900;font-size:76px;white-space:nowrap">DIA ${dia}</div>`;
}
// Cartão final: pergunta para comentar + balão + link na bio
function finalPergunta(lt, tBio) {
  const k = Math.max(0.01, salto(lt / 0.35));
  const bio = lt > tBio ? `<div style="margin-top:14px;color:#FFD21F;font-size:40px;transform:scale(${Math.max(0.01, salto((lt - tBio) / 0.3))})">LINK NA BIO</div>` : '';
  return `<div style="position:absolute;left:50%;top:120px;transform:translate(-50%,0) scale(${k});width:600px;text-align:center;
    background:rgba(10,12,20,.82);border-radius:20px;padding:20px 18px;font-family:Inter,sans-serif;font-weight:900;color:#fff;font-size:38px;line-height:1.15">
    QUAL SERIA O TEMA DO<br><span style="color:#FFD21F">SEU PRIMEIRO VÍDEO?</span>${bio}
    <div style="position:absolute;right:-14px;bottom:-30px;background:#fff;color:#111;border-radius:16px;padding:0 16px;font-size:40px;line-height:52px">•••</div></div>`;
}

export function criar(ctx) {
  const { cena, hemi, sol } = ctx;

  // ---------- quarto ----------
  cena.add(caixa(7, 0.04, 5, mat('#5E4330'), [0, -0.02, 0.6], { sombra: false }));
  for (let x = -3.2; x < 3.4; x += 0.4) cena.add(caixa(0.02, 0.005, 5, mat('#4A3424'), [x, 0.002, 0.6], { sombra: false }));
  cena.add(caixa(7, 3.4, 0.1, mat('#3A4668'), [0, 1.7, -1.55]));
  for (let x = -3.2; x < 3.4; x += 0.5) cena.add(caixa(0.06, 3.4, 0.02, mat('#33405F'), [x, 1.7, -1.49], { sombra: false }));
  cena.add(caixa(7, 0.12, 0.04, mat('#2A3350'), [0, 0.06, -1.48]));
  // escrivaninha + computador
  const madeira = mat('#8B6B4A');
  const DX = -0.62;
  cena.add(caixa(0.9, 0.05, 0.55, madeira, [DX, 0.76, -1.15]));
  for (const [x, z] of [[-0.4, -0.24], [0.4, -0.24], [-0.4, 0.24], [0.4, 0.24]]) cena.add(caixa(0.05, 0.74, 0.05, madeira, [DX + x, 0.37, -1.15 + z]));
  cena.add(caixa(0.62, 0.4, 0.04, mat('#17181C'), [DX, 1.13, -1.3]));
  cena.add(caixa(0.06, 0.14, 0.06, mat('#17181C'), [DX, 0.85, -1.3]), caixa(0.24, 0.02, 0.14, mat('#17181C'), [DX, 0.79, -1.3]));
  const tela = caixa(0.56, 0.34, 0.01, mat('#2E8BFF', { unico: true, emissivo: '#2E8BFF' }), [DX, 1.13, -1.275], { sombra: false });
  cena.add(tela);
  const play = new THREE.Mesh(new THREE.CircleGeometry(0.07, 3), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  play.position.set(DX + 0.01, 1.13, -1.268);
  cena.add(play);
  cena.add(caixa(0.36, 0.015, 0.12, mat('#2A2B30'), [DX, 0.79, -1.0]));
  const luzTela = new THREE.PointLight('#5AA8FF', 3, 3.2, 1.4);
  luzTela.position.set(DX, 1.15, -0.95);
  cena.add(luzTela);
  // cadeira
  cena.add(caixa(0.42, 0.06, 0.42, mat('#C0392B'), [DX, 0.46, -0.62]), caixa(0.42, 0.5, 0.06, mat('#C0392B'), [DX, 0.74, -0.42]));
  cena.add(cilindro(0.03, 0.42, mat('#2A2B30'), [DX, 0.22, -0.62], 6));
  // cama (lado direito)
  cena.add(caixa(1.1, 0.42, 1.9, mat('#2F5D9E'), [1.55, 0.21, -0.55]), caixa(0.5, 0.12, 0.3, mat('#F3F3F3'), [1.55, 0.48, -1.3]));
  // luz do quarto (acende conforme o canal cresce)
  const luzQuarto = new THREE.PointLight('#FFE2B0', 0, 9, 1.3);
  luzQuarto.position.set(0, 3.0, 1.0);
  cena.add(luzQuarto);

  // ---------- mural dos 30 vídeos (parede, acima do personagem) ----------
  cena.add(caixa(1.62, 0.98, 0.04, mat('#22242C'), [0.15, 2.38, -1.48]));
  const cores = ['#FF5A4E', '#FFD21F', '#3DDC84', '#4DA3FF', '#B57BFF', '#FF8A3D'];
  const blocosMural = [];
  for (let i = 0; i < 30; i++) {
    const c = i % 6, l = Math.floor(i / 6);
    const m = caixa(0.22, 0.15, 0.02, mat(cores[(i * 5) % 6], { unico: true, emissivo: cores[(i * 5) % 6] }), [0.15 - 0.65 + c * 0.26, 2.72 - l * 0.17, -1.45], { sombra: false });
    m.material.emissiveIntensity = 0.35;
    cena.add(m);
    blocosMural.push(m);
  }

  // ---------- moedas caindo ----------
  const moedas = [];
  for (let i = 0; i < 26; i++) {
    const m = cilindro(0.07, 0.018, mat('#F5C518', { unico: true, emissivo: '#7A5A00', metal: true }), [0, 0, 0], 12);
    cena.add(m);
    moedas.push(m);
  }

  const voce = criarPersonagem();
  cena.add(voce);
  const PX = 0.28, PZ = -0.35;

  const fundoEscuro = new THREE.Color('#06080F'), fundoClaro = new THREE.Color('#2C3550');
  let E;
  function inicial() {
    E = { luz: 1, videos: 30, tela: 1, moedas: -1 };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.15;
    voce.estado = { bracos: 'aponta', expr: 'feliz' };
  }
  const pose = (lt, b, bracos, expr, extra = {}) => { voce.estado = { bracos, expr, falando: b.falando(lt), ...extra }; };

  function montar(t) {
    const k = lim(E.luz);
    hemi.intensity = 0.06 + 1.0 * k;
    sol.intensity = 0.03 + 1.3 * k;
    sol.position.set(2, 6, 5);
    luzQuarto.intensity = 6 * k;
    cena.background.copy(fundoEscuro).lerp(fundoClaro, k);
    cena.fog.color.copy(cena.background);
    luzTela.intensity = 3.2 * E.tela;
    tela.material.emissiveIntensity = 0.25 + 0.9 * E.tela;
    play.visible = E.tela > 0.3;
    blocosMural.forEach((m, i) => {
      const s = lim((E.videos - i) * 2);
      m.visible = s > 0.01;
      m.scale.setScalar(Math.max(0.01, salto(s)));
    });
    moedas.forEach((m, i) => {
      const u = E.moedas - (i % 13) * 0.13;
      m.visible = E.moedas >= 0 && u > 0 && u < 1.6;
      const x = -1.0 + ((i * 37) % 21) / 10, z = 0.3 + ((i * 17) % 7) / 10;
      m.position.set(x, Math.max(0.01, 3.4 - u * u * 2.6), z);
      m.rotation.set(t * 4 + i, 0, t * 3 + i * 0.7);
    });
  }

  const cam = { pos: [0.05, 1.55, 4.4], alvo: [0.05, 1.5, -0.6] };
  const camPerto = { pos: [0.15, 1.5, 3.2], alvo: [0.1, 1.45, -0.6] };
  const dia = (n) => ({ em: 'dia', tipo: 'dia' });

  const blocos = [
    {
      // GANCHO — 1º quadro = capa: quarto aceso, mural cheio, personagem apontando
      fala: 'E se você postasse um vídeo de animação por dia, durante trinta dias? Dá pra ganhar dinheiro com isso?',
      destaque: ['animação', 'dinheiro'],
      semLegenda: true,
      camera: cam,
      aplicar(lt, b) {
        // pisca entre o quarto aceso e o escuro (prévia do vídeo), depois volta aceso
        const pisca = lt > 0.6 && lt < 2.4 && Math.floor((lt - 0.6) / 0.3) % 2 === 0;
        E.luz = pisca ? 0.04 : 1;
        E.videos = pisca ? 1 : 30;
        E.moedas = -1;
        pose(lt, b, lt < 2.4 ? 'aponta' : 'cabeca', lt < 2.4 ? 'feliz' : 'surpreso');
      },
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.6, tipo: 'whoosh' }, { em: () => 1.8, tipo: 'whoosh' }],
    },
    {
      fala: 'Dia um. Você faz o primeiro vídeo com inteligência artificial: uma pergunta curiosa, um personagem, e uma explicação simples.',
      destaque: ['primeiro', 'pergunta', 'personagem'],
      corteSeco: true,
      camera: camPerto,
      cameraFim: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.05, tela: 1, videos: suave((lt - 1.2) / 1.0), moedas: -1 });
        pose(lt, b, lt > b.palavra('pergunta') ? 'aponta' : 'normal', 'feliz');
      },
      camada: (lt) => hud(lt, 0, 1) + selo(lt, 1),
      sons: [{ em: () => 0, tipo: 'impacto' }, dia(1)],
    },
    {
      fala: 'Dia três. Quase ninguém assiste. Normal: no começo, o algoritmo ainda está testando o seu canal.',
      destaque: ['ninguém', 'testando'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.08, videos: mistura(1, 3, suave(lt / 1.2)) });
        pose(lt, b, lt < b.palavra('normal') ? 'cabeca' : 'normal', lt < b.palavra('normal') ? 'preocupado' : 'serio');
      },
      camada: (lt, b) => hud(lt, 1, 3) + selo(lt, 3) + etiqueta(lt, b.palavra('ninguem'), 'QUASE NINGUÉM VIU'),
      sons: [dia(3)],
    },
    {
      fala: 'Dia dez. Um vídeo pega. O segredo: a pergunta aparece na tela já no primeiro segundo.',
      destaque: ['pega', 'primeiro', 'segundo'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.25, videos: mistura(3, 10, suave(lt / 1.2)) });
        pose(lt, b, lt < b.palavra('segredo') ? 'cima' : 'aponta', lt < b.palavra('segredo') ? 'surpreso' : 'feliz', { pulo: lt < b.palavra('segredo') ? 0.6 : 0 });
      },
      camada: (lt, b) => hud(lt, 3, 10) + selo(lt, 10) + cartao(lt, b.palavra('primeiro'), '1º SEGUNDO', 'A PERGUNTA JÁ NA TELA'),
      sons: [dia(10)],
    },
    {
      fala: 'Dia quinze. Primeiro jeito de ganhar: o YouTube paga pelos Shorts. Mas só com mil inscritos e dez milhões de views em noventa dias.',
      destaque: ['youtube', 'mil', 'milhões'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.4, videos: mistura(10, 15, suave(lt / 1.2)) });
        pose(lt, b, lt < b.palavra('mas') ? 'aponta' : 'normal', lt < b.palavra('mas') ? 'feliz' : 'serio');
      },
      camada: (lt, b) => hud(lt, 10, 15) + selo(lt, 15) + cartao(lt, b.palavra('mil'), '1.000', 'INSCRITOS + 10 MI DE VIEWS EM 90 DIAS'),
      sons: [dia(15)],
    },
    {
      fala: 'E paga pouco: alguns centavos a cada mil views.',
      destaque: ['pouco', 'centavos'],
      camera: camPerto,
      aplicar(lt, b) { pose(lt, b, 'cabeca', 'preocupado'); },
      camada: (lt, b) => hud(lt + 5, 15, 15) + etiqueta(lt, b.palavra('centavos'), 'CENTAVOS POR MIL VIEWS'),
    },
    {
      fala: 'Dia vinte. Segundo jeito: o TikTok paga vídeos com mais de um minuto, para quem tem dez mil seguidores e cem mil views no mês.',
      destaque: ['tiktok', 'minuto', 'dez'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.55, videos: mistura(15, 20, suave(lt / 1.2)) });
        pose(lt, b, 'aponta', 'feliz');
      },
      camada: (lt, b) => hud(lt, 15, 20) + selo(lt, 20) + cartao(lt, b.palavra('dez'), '10 MIL', 'SEGUIDORES · VÍDEOS DE +1 MINUTO'),
      sons: [dia(20)],
    },
    {
      fala: 'Dia vinte e cinco. O terceiro jeito paga antes de tudo isso: vender vídeos. Lojas, escolas e outros criadores pagam por animações que explicam o que eles vendem.',
      destaque: ['vender', 'pagam'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.7, videos: mistura(20, 25, suave(lt / 1.2)), moedas: lt - b.palavra('vender') });
        pose(lt, b, lt > b.palavra('vender') ? 'cima' : 'normal', lt > b.palavra('vender') ? 'surpreso' : 'feliz', { pulo: lt > b.palavra('vender') && lt < b.palavra('vender') + 1.5 ? 0.7 : 0 });
      },
      camada: (lt, b) => hud(lt, 20, 25) + selo(lt, 25) + etiqueta(lt, b.palavra('vender') + 0.3, 'VENDER VÍDEOS PRA EMPRESAS'),
      sons: [dia(25), { em: 'vender', tipo: 'moeda' }, { em: 'vender', depois: 0.5, tipo: 'moeda' }],
    },
    {
      fala: 'E quando o canal cresce, as marcas pagam pra aparecer nos seus vídeos.',
      destaque: ['marcas'],
      camera: cam,
      aplicar(lt, b) { E.moedas = -1; pose(lt, b, 'aponta', 'sorriso'); },
      camada: (lt, b) => hud(lt + 5, 25, 25) + etiqueta(lt, b.palavra('marcas'), 'PUBLI'),
    },
    {
      fala: 'Dia trinta. Trinta vídeos prontos: eles viram o seu portfólio, pra mostrar pra quem vai te contratar.',
      destaque: ['trinta', 'portfólio'],
      camera: camPerto,
      cameraFim: cam,
      aplicar(lt, b) {
        const acende = b.palavra('trinta', 1);
        Object.assign(E, { luz: mistura(0.7, 1, suave((lt - acende) / 0.5)), videos: mistura(25, 30, suave(lt / 1.2)), moedas: -1 });
        pose(lt, b, lt > acende ? 'cima' : 'normal', 'feliz', { pulo: lt > acende && lt < acende + 1.4 ? 1 : 0 });
      },
      camada: (lt, b) => hud(lt, 25, 30) + selo(lt, 30) + ok(lt, b.palavra('portfolio')),
      sons: [dia(30), { em: (b) => b.palavra('trinta', 1), tipo: 'impacto' }, { em: (b) => b.palavra('trinta', 1) - 0.6, tipo: 'ofuscar' }],
    },
    {
      fala: 'Parece fácil? Não é. Quem ganha dinheiro com isso posta todo dia, por meses. Mas hoje dá pra fazer tudo sozinho, sem câmera e sem aparecer.',
      destaque: ['fácil', 'meses', 'sozinho'],
      camera: cam,
      aplicar(lt, b) {
        E.luz = 1;
        const mas = b.palavra('mas');
        pose(lt, b, lt < mas ? 'normal' : 'aponta', lt < mas ? 'serio' : 'feliz');
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('meses'), 'CONSTÂNCIA: MESES, NÃO DIAS'),
      sons: [{ em: 'facil', tipo: 'dia' }],
    },
    {
      fala: 'Comenta aí: qual seria o tema do seu primeiro vídeo? E se quiser aprender a fazer, o link tá na bio!',
      semLegenda: true,
      corteSeco: true,
      camera: camPerto,
      aplicar(lt, b) { E.luz = 1; pose(lt, b, lt > b.palavra('link') ? 'aponta' : 'aceno', 'feliz'); },
      camada: (lt, b) => finalPergunta(lt, b.palavra('link')),
      sons: [{ em: () => 0.02, tipo: 'pop' }, { em: 'link', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
