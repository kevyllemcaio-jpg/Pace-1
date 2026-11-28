// HISTÓRIA (original) — PERSONAGEM 3D + CENÁRIO 2D, em 2K: "Na minha cidade, a chuva cai pra cima".
// O personagem é o novo (personagem-toon.js); o cenário é desenho 2D em SVG (desenho2d.js) na camada
// `cenario2d` (atrás do 3D). Câmera 3D fixa: o chão 3D (y = 0) cai na linha do chão 2D (y = 960 da tela).
import * as THREE from 'three';
import { suave, lim, mistura, som } from '../motor.js';
import { criarPersonagemToon } from '../personagem-toon.js';
import { tela2d, ceuDia, cidade, rua, nuvem, gotasSubindo, guardaChuvaInvertido, pessoa, particulas, LINHA } from '../desenho2d.js';
import { finalPergunta } from '../formato-dias.js';

export const config = {
  titulo: ['NA MINHA CIDADE,', 'A *CHUVA* CAI', '*PRA CIMA*'],
  qualidade: '2k',
  velocidade: '+8%',
  legendaTopo: 1075,
};

const CHAO = 960;      // linha do chão no desenho 2D
const SUBIDA = 2600;   // quanto a "câmera 2D" sobe até a cidade de cabeça pra baixo
const TETO = 30 - SUBIDA; // chão da cidade invertida (no mundo 2D)

// cenário 2D completo (o mundo inteiro, de baixo até a cidade invertida); s = quanto já subiu
function mundo(t, s, { avo = false, gente = false } = {}) {
  let d = ceuDia();
  // nuvens no caminho
  d += nuvem(120, -300, 1.1) + nuvem(560, -700, 0.9) + nuvem(250, -1250, 1.3) + nuvem(620, -1750, 1) + nuvem(80, -2050, 0.8);
  // cidade invertida pendurada no "teto" + rua invertida
  d += `<g transform="translate(0,${2 * TETO}) scale(1,-1)">${rua(TETO)}</g>`;
  d += cidade(TETO + 0, { invertido: true, semente: 5 });
  // cidade normal
  d += cidade(CHAO, { semente: 3 }) + rua(CHAO);
  // marquise com poça no "teto" (a água sobe e se junta embaixo das marquises)
  d += `<rect x="470" y="${CHAO - 240}" width="200" height="22" fill="#2A9D8F" stroke="${LINHA}" stroke-width="5"/><ellipse cx="570" cy="${CHAO - 214}" rx="80" ry="12" fill="#7CC6FF" stroke="#2B6CB0" stroke-width="3"/>`;
  if (gente) {
    d += pessoa(110, CHAO + 40, 'menina', { esc: 0.75, expr: 'feliz' }) + guardaChuvaInvertido(140, CHAO - 120, '#E63946', 0.9);
    d += pessoa(620, CHAO + 40, 'velho', { esc: 0.7, expr: 'feliz', semChapeu: true }) + guardaChuvaInvertido(650, CHAO - 120, '#4D96FF', 0.9);
  }
  if (avo) d += `<rect x="470" y="${CHAO - 30}" width="200" height="16" rx="6" fill="#8A6040" stroke="${LINHA}" stroke-width="4"/><rect x="480" y="${CHAO - 14}" width="12" height="50" fill="#5A4030"/><rect x="648" y="${CHAO - 14}" width="12" height="50" fill="#5A4030"/>` + pessoa(570, CHAO - 10, 'velho', { esc: 0.8, expr: 'serio' });
  d += gotasSubindo(t);
  d += particulas(t, { n: 14, cor: '#FFFFFF', semente: 9, area: [-100, -3000, 920, 4000] });
  return tela2d(d, { zoom: 1, x: 360, y: 640 - s });
}

export function criar(ctx) {
  const { cena, camera, hemi, sol } = ctx;
  cena.background = null;          // fundo transparente: o desenho 2D aparece atrás
  cena.fog = null;
  camera.fov = 28;
  camera.updateProjectionMatrix();
  hemi.intensity = 1.6;
  sol.intensity = 2.3;
  sol.position.set(3, 8, 6);

  // chão invisível que só mostra a sombra do personagem
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.28 }));
  sombra.rotation.x = -Math.PI / 2;
  sombra.receiveShadow = true;
  cena.add(sombra);

  const leo = criarPersonagemToon();
  const gemeo = criarPersonagemToon();
  cena.add(leo, gemeo);

  const proj = new THREE.Vector3();
  const naTela = (x, y, z) => { proj.set(x, y, z).project(camera); return [(proj.x + 1) * 360, (1 - proj.y) * 640]; };
  // cordinhas amarrando os tênis no chão (desenhadas por cima do 3D)
  const cordas = (k = 1) => {
    if (k <= 0) return '';
    let s = '';
    for (const sx of [-0.11, 0.11]) {
      const [x, y] = naTela(leo.position.x + sx, leo.position.y + 0.06, leo.position.z + 0.12);
      const px = x + (sx < 0 ? -40 : 40);
      s += `<path d="M${x} ${y} Q${(x + px) / 2} ${y + 40} ${px} ${CHAO + 28}" fill="none" stroke="#FFD21F" stroke-width="6" stroke-linecap="round" opacity="${k}"/><rect x="${px - 8}" y="${CHAO + 20}" width="16" height="26" rx="3" fill="#6B4A30" stroke="${LINHA}" stroke-width="3" opacity="${k}"/>`;
    }
    return `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px">${s}</svg>`;
  };

  let E;
  function inicial() {
    E = { subida: 0, voa: 0, cordas: 1, gemeo: false };
    leo.position.set(0, 0, 0);
    leo.rotation.set(0, 0, 0);
    leo.estado = { bracos: 'normal', expr: 'surpreso' };
    gemeo.visible = false;
  }
  function sempre(t) {
    leo.position.y = E.voa + (E.voa > 0 ? Math.sin(t * 2) * 0.05 : 0);
    sombra.visible = E.voa < 0.6;
    gemeo.visible = E.gemeo;
    leo.animar(t);
    gemeo.animar(t);
  }
  const fala = (lt, b, bracos, expr, extra = {}) => { leo.estado = { bracos, expr, falando: b.falando(lt), ...extra }; };
  const cam = { pos: [0, 1.0, 8], alvo: [0, 1.0, 0] };
  const T = (b, lt) => b.inicio + lt;

  const blocos = [
    {
      fala: 'Na minha cidade, a chuva cai pra cima.',
      destaque: ['chuva', 'cima'],
      semLegenda: true,
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), 0),
      aplicar(lt, b) { leo.rotation.y = 0.15; fala(lt, b, lt > 1.5 ? 'aponta' : 'normal', 'surpreso'); },
      camada: () => cordas(1),
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.1, tipo: 'chuvinha' }],
    },
    {
      fala: 'Quando chove, a gente amarra os sapatos no chão, pra não sair flutuando junto.',
      destaque: ['amarra', 'flutuando'],
      camera: cam,
      cameraFim: { pos: [0, 0.9, 6.2], alvo: [0, 0.75, 0] },
      cenario2d: (lt, b) => {
        // um boné que alguém esqueceu de amarrar sai voando
        const t = T(b, lt), u = lim((lt - b.palavra('flutuando')) / 2.5);
        const bone = `<g transform="translate(${560 + Math.sin(t * 3) * 30},${CHAO - 40 - u * 900}) rotate(${t * 60})"><path d="M-30 0 Q0 -40 30 0 Z" fill="#E63946" stroke="${LINHA}" stroke-width="4"/><rect x="0" y="-4" width="40" height="8" rx="4" fill="#E63946" stroke="${LINHA}" stroke-width="3"/></g>`;
        return mundo(t, 0).replace('</g>\n  <rect width="720"', `${bone}</g>\n  <rect width="720"`);
      },
      aplicar(lt, b) { leo.rotation.y = 0; fala(lt, b, lt > b.palavra('flutuando') ? 'cabeca' : 'aponta', lt > b.palavra('flutuando') ? 'surpreso' : 'feliz'); },
      camada: () => cordas(1),
      sons: [{ em: 'amarra', tipo: 'pop' }, { em: 'flutuando', tipo: 'whoosh' }],
    },
    {
      fala: 'Os guarda-chuvas são de cabeça pra baixo, e as poças ficam no teto.',
      destaque: ['guarda-chuvas', 'poças', 'teto'],
      corteSeco: true,
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), 0, { gente: true }),
      aplicar(lt, b) { leo.position.x = -0.15; fala(lt, b, lt > b.palavra('pocas') ? 'aponta' : 'aceno', 'feliz'); leo.rotation.y = lt > b.palavra('pocas') ? 0.5 : 0; },
      camada: () => cordas(1),
      sons: [{ em: 'teto', tipo: 'plim' }],
    },
    {
      fala: 'Meu avô diz que, há muito tempo, a chuva caía do céu. Ninguém acredita.',
      destaque: ['avô', 'céu'],
      corteSeco: true,
      camera: { pos: [-0.6, 1.0, 8], alvo: [-0.6, 1.0, 0] },
      cenario2d: (lt, b) => mundo(T(b, lt), 0, { avo: true }),
      aplicar(lt, b) { leo.position.x = -0.9; leo.rotation.y = 0.5; fala(lt, b, 'normal', lt > b.palavra('ninguem') ? 'sorriso' : 'serio'); },
      camada: (lt, b) => cordas(1) + som(lt, b.palavra('ninguem'), 'HAHA', 1.0),
    },
    {
      fala: 'Hoje, eu desamarrei o sapato.',
      destaque: ['desamarrei'],
      corteSeco: true,
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), 0),
      aplicar(lt, b) {
        leo.position.x = 0; leo.rotation.y = 0;
        const solta = b.palavra('desamarrei') + 0.4;
        E.cordas = 1 - lim((lt - solta) / 0.3);
        E.voa = 0.35 * suave((lt - solta) / 1.2);
        fala(lt, b, lt > solta ? 'cima' : 'normal', 'surpreso');
      },
      camada: (lt, b) => cordas(E.cordas),
      sons: [{ em: 'desamarrei', depois: 0.4, tipo: 'pop' }, { em: 'sapato', tipo: 'brilho' }],
    },
    {
      fala: 'Subi junto com as gotas, passando pelos telhados, pelas nuvens.',
      destaque: ['gotas', 'nuvens'],
      corteSeco: true,
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), SUBIDA * 0.85 * suave(lt / b.dur)),
      aplicar(lt, b) { E.cordas = 0; E.voa = 0.4; leo.rotation.y = 0; leo.estado = { bracos: 'cima', expr: 'feliz', falando: b.falando(lt) }; },
      sons: [{ em: () => 0.05, tipo: 'vento' }, { em: 'nuvens', tipo: 'whoosh' }],
    },
    {
      fala: 'Lá em cima, tinha outra cidade. De cabeça pra baixo.',
      destaque: ['outra', 'cidade'],
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), mistura(SUBIDA * 0.85, SUBIDA, suave(lt / 1.5))),
      aplicar(lt, b) { E.voa = 0.4; fala(lt, b, 'normal', 'surpreso'); },
      sons: [{ em: 'outra', tipo: 'impacto' }],
    },
    {
      fala: 'E um menino igualzinho a mim, olhando pra cima. Quer dizer, pra baixo.',
      destaque: ['igualzinho', 'baixo'],
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), SUBIDA),
      aplicar(lt, b) {
        E.voa = 0.25; E.gemeo = true;
        leo.position.x = -0.45; leo.rotation.y = 0.35;
        const desce = suave(lt / 1.2);
        gemeo.position.set(0.45, mistura(4.2, 2.95, desce), 0);
        gemeo.rotation.set(0, 0.35, Math.PI);
        gemeo.estado = { bracos: 'normal', expr: 'surpreso' };
        fala(lt, b, lt > b.palavra('quer') ? 'cabeca' : 'aponta', 'surpreso');
      },
      sons: [{ em: 'igualzinho', tipo: 'dia' }, { em: 'quer', tipo: 'pop' }],
    },
    {
      fala: 'Com o sapato desamarrado. E você? Desamarraria o seu? Comenta aí.',
      destaque: ['desamarrado'],
      semLegenda: true,
      corteSeco: true,
      camera: cam,
      cenario2d: (lt, b) => mundo(T(b, lt), SUBIDA),
      aplicar(lt, b) {
        E.voa = 0.25; E.gemeo = true;
        leo.position.x = -0.45; leo.rotation.y = 0.35;
        gemeo.position.set(0.45, 2.95, 0); gemeo.rotation.set(0, 0.35, Math.PI);
        gemeo.estado = { bracos: 'aceno', expr: 'feliz' };
        fala(lt, b, 'aceno', 'feliz');
      },
      camada: (lt, b) => {
        // cadarço solto pendurado no tênis do gêmeo
        const [x, y] = naTela(gemeo.position.x + 0.11, gemeo.position.y - 0.06, 0.12);
        const cad = `<svg viewBox="0 0 720 1280" style="position:absolute;left:0;top:0;width:720px;height:1280px"><path d="M${x} ${y} q${10 + Math.sin(T(b, lt) * 3) * 8} 40 -6 80" fill="none" stroke="#FFD21F" stroke-width="6" stroke-linecap="round"/></svg>`;
        // cartão embaixo (em cima fica o gêmeo de cabeça pra baixo)
        return cad + (lt > b.palavra('voce') ? finalPergunta(lt - b.palavra('voce'), ['VOCÊ DESAMARRARIA', '*O SEU SAPATO?*'], 'COMENTA AÍ! 👇', b.palavra('comenta') - b.palavra('voce')).replace('top:120px', 'top:960px') : '');
      },
      sons: [{ em: 'desamarrado', tipo: 'brilho' }, { em: 'voce', tipo: 'pop' }, { em: 'comenta', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial, sempre };
}
