// Não é um vídeo: gera as duas imagens do personagem usadas na arte de anúncio
// (publicacao/arte-anuncio.html). Rodar:
//   node estudio3d/render3d.js foto-anuncio --previa --sem-voz
//   -> saida/foto-anuncio-bloco01.png (quarto escuro, mãos na cabeça)
//   -> saida/foto-anuncio-bloco02.png (fundo amarelo, comemorando no notebook)
import * as THREE from 'three';
import { mat, caixa } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarQuarto } from '../cenarios/quarto.js';

export const config = { musica: false };

export function criar(ctx) {
  const { cena } = ctx;
  const q = criarQuarto(ctx, { janela: true });

  // bolinhas de papel amassado e pilha de livros na escrivaninha
  const papel = mat('#E9E9EE');
  [[-0.95, 0.83, -0.95], [-0.35, 0.83, -0.9], [-0.25, 0.04, -0.2], [0.75, 0.04, 0.1], [-1.1, 0.04, 0.2]].forEach(([x, y, z]) => {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.06, 0), papel);
    m.position.set(x, y, z);
    cena.add(m);
  });
  [0, 1, 2, 3].forEach((i) => cena.add(caixa(0.3, 0.06, 0.22, mat(['#C0392B', '#2F5D9E', '#2DBE60', '#E0A000'][i]), [-0.98, 0.81 + i * 0.06, -1.05])));

  const a = criarPersonagem();
  a.position.set(-0.1, 0, -0.55);
  a.rotation.y = 0.55;
  a.estado = { bracos: 'cabeca', expr: 'preocupado' };
  cena.add(a);

  // lado "depois": fundo amarelo longe do quarto, com notebook
  const OX = 60;
  const amarelo = mat('#FFC81E', { emissivo: '#B88A00' });
  cena.add(caixa(14, 10, 0.2, amarelo, [OX, 4, -2]));
  cena.add(caixa(14, 0.2, 8, amarelo, [OX, -0.1, 1]));
  // mesa baixa e notebook virado para o personagem (a câmera vê a tampa por trás, com um "play")
  cena.add(caixa(1.4, 0.06, 0.6, mat('#2A2B30'), [OX + 0.25, 0.72, 0.15]));
  cena.add(caixa(0.6, 0.02, 0.4, mat('#3A3C44'), [OX + 0.38, 0.76, 0.1]));
  const tampa = new THREE.Group();
  tampa.add(caixa(0.6, 0.4, 0.03, mat('#3A3C44'), [0, 0.2, 0]));
  const play = new THREE.Mesh(new THREE.CircleGeometry(0.07, 3), new THREE.MeshBasicMaterial({ color: '#9AA0AA' }));
  play.position.set(0, 0.2, 0.02);
  tampa.add(play);
  tampa.position.set(OX + 0.38, 0.77, 0.3);
  tampa.rotation.x = -0.2;
  cena.add(tampa);
  const b = criarPersonagem();
  b.position.set(OX - 0.15, 0, -0.45);
  b.rotation.y = 0.15;
  b.estado = { bracos: 'cima', expr: 'surpreso' };
  cena.add(b);

  return {
    blocos: [
      {
        fala: 'antes', semLegenda: true,
        camera: { pos: [-0.35, 1.6, 2.1], alvo: [-0.3, 1.2, -0.6] },
        aplicar() { q.luz(0.32); q.ceu(0); q.tela(0.6); cena.background.set('#0B0F1C'); },
      },
      {
        fala: 'depois', semLegenda: true, corteSeco: true,
        camera: { pos: [OX + 0.05, 1.55, 2.6], alvo: [OX + 0.05, 1.15, -0.3] },
        aplicar() { q.luz(1); cena.background.set('#FFC81E'); },
      },
    ],
    inicial() {},
    sempre(t) {
      a.animar(0.3); b.animar(0.3);
      // mãos em cima da cabeça (desespero): ajusta os braços só nesta imagem
      a.traverse((o) => {
        if (o.isGroup && Math.abs(Math.abs(o.position.x) - 0.345) < 1e-3 && Math.abs(o.position.y - 1.47) < 1e-3) {
          const s = Math.sign(o.position.x);
          o.rotation.set(-0.25, 0, -s * 2.9);
        }
      });
    },
  };
}
