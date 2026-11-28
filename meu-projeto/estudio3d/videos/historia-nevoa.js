// HISTÓRIA 2D (original): "Quem a névoa toca esquece o próprio nome".
// Formato: narração em 1ª pessoa, frases curtas, mundo com regras estranhas, ameaça, alguém querido,
// um ancião que some e uma virada no final. Desenho 2D em SVG (desenho2d.js) sobre o motor do estúdio
// (voz neural, legenda palavra por palavra, efeitos). A cena 3D fica vazia.
import { suave, lim, mistura } from '../motor.js';
import { tela2d, ceu, mar, casa, escada, ponte, lanterna, nevoa, pessoa, maoComNome, particulas, balao, placa } from '../desenho2d.js';

export const config = {
  titulo: ['QUEM A NÉVOA TOCA', 'ESQUECE O', 'PRÓPRIO *NOME*'],
  velocidade: '+4%',
  legendaTopo: 1060,
  musica: false,
};

// ---------- cenas ----------
// vila sobre palafitas; `nevoaY` = altura do topo da névoa (menor = mais alta)
function vila(t, { nevoaY = 1150, nevoaOp = 1, gente = true, lia = 'serio', tomas = 'serio', bento = null, extra = '' } = {}) {
  let s = ceu(t) + mar(t, 980);
  s += ponte(210, 690, 300, 640) + ponte(440, 640, 500, 710);
  s += casa(40, 700, { w: 170, t }) + casa(300, 650, { w: 140, cor: '#5E8C6A', telhado: '#2F4A3A', t }) + casa(500, 720, { w: 180, cor: '#C48A3A', telhado: '#6B3A1A', t });
  s += escada(470, 645, 1300);
  s += lanterna(250, 600, t) + lanterna(470, 590, t);
  if (gente) s += pessoa(345, 640, 'menino', { esc: 0.42, expr: tomas }) + pessoa(400, 640, 'menina', { esc: 0.42, expr: lia });
  if (bento) s += bento;
  s += extra;
  s += nevoa(t, nevoaY, { opacidade: nevoaOp });
  s += particulas(t, { n: 18, area: [-100, 0, 920, 1100] });
  return s;
}
// fundo escuro para os closes
const fundoClose = (t, cor = '#18223F') => `<rect x="-800" y="-800" width="2400" height="2900" fill="${cor}"/>` + particulas(t, { n: 30, cor: '#C9D3E0', semente: 5, area: [-100, -100, 920, 1500] });

export function criar(ctx) {
  ctx.cena.background.set('#000000');
  const T = (b, lt) => b.inicio + lt; // tempo global (para a névoa/estrelas não "pularem" entre blocos)

  const blocos = [
    {
      fala: 'Na minha vila, as casas ficam em pernas de pau, a dez metros do chão.',
      destaque: ['pernas', 'dez'],
      semLegenda: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => tela2d(vila(T(b, lt), { nevoaY: 1120 - lt * 8, lia: 'medo' }), { zoom: mistura(1.25, 1.0, suave(lt / b.dur)), x: 380, y: mistura(700, 640, suave(lt / b.dur)) }),
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.3, tipo: 'vento' }],
    },
    {
      fala: 'Toda noite, sobe a Maré Cinza. Quem ela toca esquece o próprio nome, e caminha para o mar.',
      destaque: ['maré', 'cinza', 'nome', 'mar'],
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const u = suave(lt / b.dur);
        const andante = pessoa(mistura(120, 40, u), 1000, 'velho', { esc: 0.3, expr: 'vazio', andar: T(b, lt), semChapeu: true });
        return tela2d(vila(T(b, lt), { nevoaY: mistura(1100, 860, suave(lt / 2.5)), extra: `<g opacity="${(0.55 * (1 - u * 0.6)).toFixed(2)}">${andante}</g>` }), { zoom: 1.05, x: 330, y: mistura(700, 820, u) });
      },
      sons: [{ em: 'sobe', tipo: 'tensao' }, { em: 'mar', tipo: 'sussurro' }],
    },
    {
      fala: 'Por isso, todo bebê ganha o nome escrito na mão, com uma tinta que nunca sai.',
      destaque: ['nome', 'mão', 'tinta'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => tela2d(fundoClose(T(b, lt)) + maoComNome(360, 640, 'LIA', { escala: 1.2, k: (lt - b.palavra('nome')) / 0.8, pele: '#F6CDA8' }), { zoom: mistura(1, 1.08, lt / b.dur) }),
      sons: [{ em: 'escrito', tipo: 'brilho' }],
    },
    {
      fala: 'A primeira coisa que a gente aprende é: nunca responda quando a névoa chamar.',
      destaque: ['nunca', 'responda', 'chamar'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt);
        let s = vila(t, { nevoaY: 760, gente: false });
        s += pessoa(330, 640, 'menino', { esc: 0.6, expr: 'medo', braco: 'orelhas' }) + pessoa(410, 640, 'menina', { esc: 0.6, expr: 'medo', braco: 'orelhas' });
        const cham = lt > b.palavra('chamar') - 0.4;
        if (cham) s += `<text x="${250 + Math.sin(t * 2) * 30}" y="820" font-family="Georgia,serif" font-style="italic" font-size="34" fill="#E8EEF6" opacity="${(0.4 + 0.3 * Math.sin(t * 5)).toFixed(2)}">ei... vem cá...</text>`;
        return tela2d(s, { zoom: 1.6, x: 370, y: 560 });
      },
      sons: [{ em: 'chamar', tipo: 'sussurro' }],
    },
    {
      fala: 'Minha irmã, Lia, tem medo de altura. Toda noite, eu seguro a mão dela até ela dormir.',
      destaque: ['lia', 'altura', 'mão'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt), dorme = lt > b.palavra('dormir') - 0.3;
        let s = vila(t, { nevoaY: 980, gente: false });
        s += pessoa(330, 640, 'menino', { esc: 0.75, expr: 'feliz' }) + pessoa(400, 640, 'menina', { esc: 0.75, expr: dorme ? 'feliz' : 'medo' });
        s += `<circle cx="366" cy="${640 - 0.75 * 105}" r="11" fill="#F6CDA8" stroke="#1B1B2B" stroke-width="3"/>`; // mãos dadas
        return tela2d(s, { zoom: mistura(1.9, 2.2, lt / b.dur), x: 368, y: 545 });
      },
    },
    {
      fala: 'No mês passado, o velho Bento desceu a escada pra buscar o chapéu que o vento derrubou.',
      destaque: ['bento', 'chapéu', 'vento'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt), u = suave(lt / b.dur), caiu = lt > b.palavra('vento') - 0.6;
        const by = mistura(700, 960, u);
        let extra = pessoa(470, by, 'velho', { esc: 0.42, expr: 'serio', semChapeu: true, andar: t * 0.5 });
        const hy = caiu ? Math.min(1060, 600 + (lt - b.palavra('vento') + 0.6) * 420) : 600;
        extra += `<g transform="translate(${470 + Math.sin(t * 3) * 40},${hy}) rotate(${t * 90})"><rect x="-26" y="-6" width="52" height="8" rx="3" fill="#6B4A30" stroke="#1B1B2B" stroke-width="3"/><rect x="-15" y="-26" width="30" height="20" rx="5" fill="#6B4A30" stroke="#1B1B2B" stroke-width="3"/></g>`;
        return tela2d(vila(t, { nevoaY: 1000, bento: extra }), { zoom: 1.5, x: 450, y: mistura(700, 880, u) });
      },
      sons: [{ em: 'vento', tipo: 'vento' }],
    },
    {
      fala: 'A névoa tocou o pé dele. Ele olhou a própria mão, leu o nome, e não reconheceu.',
      destaque: ['tocou', 'nome', 'reconheceu'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt);
        if (lt < b.palavra('olhou')) {
          const s = vila(t, { nevoaY: mistura(1010, 930, suave(lt / 1)), bento: pessoa(470, 960, 'velho', { esc: 0.42, expr: 'medo', semChapeu: true }) });
          return tela2d(s, { zoom: 2.2, x: 470, y: 890 });
        }
        return tela2d(fundoClose(t, '#22304F') + maoComNome(360, 640, 'BENTO', { escala: 1.15, pele: '#E8B48E', tremor: lt > b.palavra('reconheceu') ? 1 : 0.3, t }) + nevoa(t, 1080, { opacidade: 0.8 }), { zoom: mistura(1, 1.12, (lt - b.palavra('olhou')) / 2) });
      },
      sons: [{ em: 'tocou', tipo: 'sussurro' }, { em: 'reconheceu', tipo: 'impacto' }],
    },
    {
      fala: 'Então ele sorriu, e foi andando pro mar. Parecia feliz.',
      destaque: ['sorriu', 'feliz'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt), u = suave(lt / b.dur);
        const close = lt < b.palavra('andando');
        if (close) return tela2d(fundoClose(t, '#22304F') + pessoa(360, 1100, 'velho', { esc: 1.6, expr: 'vazio', semChapeu: true }) + nevoa(t, 1000, { opacidade: 0.9 }), { zoom: 1 });
        const s = vila(t, { nevoaY: 900, bento: `<g opacity="${(1 - u * 0.7).toFixed(2)}">${pessoa(mistura(470, 160, u), mistura(960, 990, u), 'velho', { esc: mistura(0.42, 0.25, u), expr: 'vazio', semChapeu: true, andar: t })}</g>` });
        return tela2d(s, { zoom: 1.3, x: 330, y: 860 });
      },
    },
    {
      fala: 'Os adultos dizem que a Maré tem fome. Mas ninguém que entra no mar parece triste.',
      destaque: ['fome', 'triste'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => tela2d(vila(T(b, lt), { nevoaY: 880, tomas: lt > b.palavra('mas') ? 'serio' : 'medo' }), { zoom: mistura(2.6, 2.2, lt / b.dur), x: 372, y: 560 }),
    },
    {
      fala: 'Uma noite, eu desci. Eu precisava saber o que a névoa diz.',
      destaque: ['desci', 'névoa'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt), u = suave(lt / b.dur), ty = mistura(660, 960, u);
        const s = vila(t, { nevoaY: 990, gente: false, extra: pessoa(470, ty, 'menino', { esc: 0.42, expr: 'medo', andar: t * 0.4 }) + lanterna(500, ty - 70, t) });
        return tela2d(s, { zoom: 1.9, x: 470, y: ty - 40 });
      },
      sons: [{ em: 'desci', tipo: 'tensao' }, { em: 'nevoa', tipo: 'vento' }],
    },
    {
      fala: 'Ela não grita. Ela conta histórias. Histórias bonitas, de gente que eu nunca conheci.',
      destaque: ['histórias', 'bonitas'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt);
        // imagens fantasmas na névoa: um barco, uma baleia, uma casa
        const fantasmas = `<g opacity="${(0.35 + 0.2 * Math.sin(t * 2)).toFixed(2)}" fill="none" stroke="#EEF3FA" stroke-width="5" stroke-linecap="round">
          <path d="M150 ${520 + Math.sin(t) * 10} q60 40 120 0 l-20 30 h-80 z M210 ${520 + Math.sin(t) * 10} v-70 l40 50"/>
          <path d="M420 ${430 + Math.sin(t + 1) * 12} q80 -60 170 0 q-40 40 -110 30 q-30 0 -60 -30 m150 0 l30 -30 m-30 30 l30 25"/>
          <path d="M260 ${770 + Math.sin(t + 2) * 8} h90 v-60 l-45 -40 l-45 40 z"/></g>`;
        const s = fundoClose(t, '#5E6B82') + nevoa(t, 300, { opacidade: 0.7 }) + fantasmas + pessoa(360, 1120, 'menino', { esc: 1.3, expr: lt > b.palavra('bonitas') ? 'feliz' : 'serio' }) + nevoa(t, 1000, { opacidade: 0.9 });
        return tela2d(s, { zoom: mistura(1, 1.08, lt / b.dur) });
      },
      sons: [{ em: 'conta', tipo: 'sussurro' }, { em: 'bonitas', tipo: 'brilho' }],
    },
    {
      fala: 'Lá em cima, uma menina chorava na escada, gritando sem parar a mesma palavra.',
      destaque: ['menina', 'palavra'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt);
        let s = vila(t, { nevoaY: 930, gente: false, extra: pessoa(470, 645, 'menina', { esc: 0.42, expr: 'grito' }) });
        if (lt > b.palavra('gritando') - 0.2) s += balao(470, 500, '!!!', { tam: 34 });
        return tela2d(s, { zoom: mistura(1.2, 1.7, suave(lt / b.dur)), x: 460, y: mistura(800, 600, suave(lt / b.dur)) });
      },
      sons: [{ em: 'gritando', tipo: 'pop' }],
    },
    {
      fala: 'Achei estranho. Olhei pra minha mão. Também tinha uma palavra escrita nela.',
      destaque: ['mão', 'palavra'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => tela2d(fundoClose(T(b, lt), '#5E6B82') + maoComNome(360, 660, 'TOMÁS', { escala: 1.2, k: lt > b.palavra('olhei') ? 1 : 0 }) + nevoa(T(b, lt), 1060, { opacidade: 0.9 }), { zoom: mistura(1, 1.15, suave(lt / b.dur)) }),
      sons: [{ em: 'olhei', tipo: 'impacto' }],
    },
    {
      fala: 'Deve ser o nome de alguém muito importante pra ela.',
      destaque: ['importante'],
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => {
        const t = T(b, lt), u = suave(lt / b.dur);
        let s = vila(t, { nevoaY: 900, gente: false, extra: pessoa(470, 645, 'menina', { esc: 0.42, expr: 'grito' }) + `<g opacity="${(1 - u * 0.5).toFixed(2)}">${pessoa(mistura(430, 250, u), 995, 'menino', { esc: 0.36, expr: 'vazio', andar: t })}</g>` });
        if (lt > 0.6) s += balao(470, 500, 'TOMÁS!', { tam: 34 });
        return tela2d(s, { zoom: mistura(1.5, 1.15, u), x: mistura(440, 380, u), y: mistura(760, 740, u) });
      },
      sons: [{ em: () => 0.6, tipo: 'dia' }, { em: 'importante', tipo: 'sussurro' }],
    },
    {
      fala: 'E você? Teria respondido a névoa? Comenta aí.',
      semLegenda: true,
      corteSeco: true,
      camera: { pos: [0, 0, 5], alvo: [0, 0, 0] },
      fundo: (lt, b) => tela2d(vila(T(b, lt), { nevoaY: 820, gente: false, extra: pessoa(470, 645, 'menina', { esc: 0.42, expr: 'medo' }) }), { zoom: 1, x: 360, y: 640, escuro: 0.35 }),
      camada: (lt, b) => placa('VOCÊ TERIA RESPONDIDO A NÉVOA?', lt / 0.4) + (lt > b.palavra('comenta') ? placa('', 1) + `<div style="position:absolute;left:0;right:0;top:190px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:36px;color:#FFD21F;-webkit-text-stroke:7px #0E1630;paint-order:stroke fill">COMENTA AÍ 👇</div>` : ''),
      sons: [{ em: () => 0.02, tipo: 'vento' }, { em: 'comenta', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial() {}, sempre() {} };
}
