// VÍDEO: "Como o semáforo sabe que você chegou?"
// Fatos conferidos:
//  - Em muitos cruzamentos há laços indutivos: fio enrolado em cortes no asfalto, ligado a um
//    detector; a massa de metal do carro altera a indutância e o controlador detecta o veículo.
//  - Semáforos de tempo fixo funcionam por relógio; os "atuados" respondem aos detectores.
//  - "Onda verde": semáforos coordenados abrem em sequência no tempo de deslocamento dos carros.
import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, carro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarRua, semaforo } from '../cenarios/rua.js';

export const config = {
  titulo: ['COMO O', '*SEMÁFORO*', 'SABE QUE VOCÊ', '*CHEGOU*?'],
  tituloEstilo: 'meio',
};

const LZ = -2;                      // faixa do nosso carro (anda para -x)
const XL0 = 6.5, XL1 = 11;          // laço no asfalto
const PX = 12.0, PZ = -5.6;          // personagem na calçada

export function criar(ctx) {
  const { cena } = ctx;
  criarRua(ctx, { recuo: 19 });
  const s1 = semaforo();
  s1.position.set(5.8, 0.2, -4.6);
  cena.add(s1);
  const detector = caixa(0.18, 0.22, 0.12, mat('#3D434C'), [5.8, 1.6, -4.45]);
  const led = caixa(0.06, 0.06, 0.03, mat('#2DE060', { unico: true, emissivo: '#000' }), [5.8, 1.62, -4.38], { sombra: false });
  cena.add(detector, led);
  // laço: cortes no asfalto (retângulo + diagonais nos cantos)
  const corte = mat('#141414');
  const lacos = new THREE.Group();
  const seg = (x1, z1, x2, z2, m, y = 0.066, esp = 0.06) => {
    const d = Math.hypot(x2 - x1, z2 - z1);
    const b = caixa(d, 0.01, esp, m, [(x1 + x2) / 2, y, (z1 + z2) / 2], { sombra: false });
    b.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    return b;
  };
  const rect = [[XL0, LZ - 1.3], [XL1, LZ - 1.3], [XL1, LZ + 1.3], [XL0, LZ + 1.3]];
  rect.forEach((p, i) => { const q = rect[(i + 1) % 4]; lacos.add(seg(p[0], p[1], q[0], q[1], corte)); });
  lacos.add(seg(XL0, LZ, XL0 - 1.2, -3.9, corte));
  cena.add(lacos);
  const fioMat = mat('#4FF0FF', { unico: true, emissivo: '#1FB8D8' });
  const fio = new THREE.Group();
  rect.forEach((p, i) => { const q = rect[(i + 1) % 4]; fio.add(seg(p[0], p[1], q[0], q[1], fioMat, 0.072, 0.04)); });
  cena.add(fio);
  // campo magnético: arcos sobre o laço
  const arcos = [];
  const arcoMat = mat('#4FF0FF', { unico: true, emissivo: '#1FB8D8', opacidade: 0.85 });
  for (let k = 0; k < 4; k++) {
    const pts = [];
    for (let i = 0; i < 18; i++) { const m = caixa(0.07, 0.07, 0.07, arcoMat, [0, 0, 0], { sombra: false }); cena.add(m); pts.push(m); }
    arcos.push({ pts, x: XL0 + 0.6 + k * 1.1 });
  }
  // avenida com 4 semáforos (onda verde)
  const XS = [-20, -40, -60, -80];
  const sems = XS.map((x) => { const s = semaforo(); s.position.set(x + 0.6, 0.2, -4.6); cena.add(s); return s; });
  const auto = carro('#2F6FE0');
  auto.rotation.y = Math.PI;
  cena.add(auto);
  const cruzando = carro('#E8322B');
  cruzando.rotation.y = -Math.PI / 2;
  cena.add(cruzando);

  const voce = criarPersonagem();
  cena.add(voce);
  const ceuDia = new THREE.Color('#8CCFFF'), ceuNoite = new THREE.Color('#1B2350');

  let E;
  function inicial() {
    E = { noite: 0, campo: 0, perturbado: 0, carroX: 22, luz1: 'vermelho', ciclo: false, ondas: false, onda: null, led: false, cruzX: null };
    voce.visible = true;
    voce.position.set(PX, 0.2, PZ);
    voce.rotation.y = 0.9;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t) {
    cena.background.copy(ceuDia).lerp(ceuNoite, E.noite);
    cena.fog.color.set('#CDEBFF').lerp(ceuNoite, E.noite);
    ctx.hemi.intensity = 1.5 - 0.9 * E.noite;
    ctx.sol.intensity = 2.4 - 2.0 * E.noite;
    if (E.ciclo) { const f = (t * 0.9) % 3; s1.definir(f < 1.3 ? 'verde' : f < 1.9 ? 'amarelo' : 'vermelho'); } else s1.definir(E.luz1);
    fio.visible = E.campo > 0.05 || !!E.fio;
    arcos.forEach((a, k) => {
      a.pts.forEach((m, i) => {
        m.visible = E.campo > 0.05;
        const ang = (i / 17) * Math.PI;
        const r = 1.3 * (0.6 + 0.4 * E.campo) * (1 - 0.45 * E.perturbado) * (1 + 0.06 * Math.sin(t * 4 + k));
        m.position.set(a.x, 0.07 + Math.sin(ang) * r, LZ - Math.cos(ang) * 1.3);
      });
    });
    arcoMat.color.set(E.perturbado > 0.5 ? '#FFD21F' : '#4FF0FF');
    arcoMat.emissive.set(E.perturbado > 0.5 ? '#B88A00' : '#1FB8D8');
    led.material.emissive.set(E.led ? '#2DE060' : '#000000');
    auto.position.set(E.carroX, 0.03, LZ);
    auto.rodar(-E.carroX);
    cruzando.visible = E.cruzX != null;
    if (E.cruzX != null) cruzando.position.set(-1.8, 0.03, E.cruzX);
    sems.forEach((s, i) => {
      if (!E.ondas) { s.definir('vermelho'); return; }
      s.definir(E.onda ? E.onda(i, XS[i]) : 'vermelho');
    });
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0.2, PZ);
    voce.rotation.y = 0.5;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX - 0.8, 1.9, PZ + 3.4], alvo: [PX - 0.1, 1.6, PZ] };

  const blocos = [
    {
      fala: 'Já reparou nesses retângulos cortados no asfalto, perto do semáforo? Eles sabem quando você chegou.',
      destaque: ['retângulos', 'asfalto', 'chegou'],
      camera: { pos: [11.6, 1.0, -1.6], alvo: [7.0, 2.7, -5.2] },
      cameraFim: { pos: [13.5, 4.2, 2.0], alvo: [8.0, 1.0, -3.5] },
      aplicar(lt, b) { E.campo = suave((lt - 2.2) / 0.8); E.fio = true; E.luz1 = 'vermelho'; apresentar(lt, b, 'aponta', 'surpreso'); voce.position.set(7.6, 0.2, -5.7); voce.rotation.y = 0.85; },
    },
    {
      fala: 'Então você põe um semáforo com um relógio: verde, amarelo e vermelho, sempre no mesmo tempo.',
      destaque: ['semáforo', 'relógio'],
      corteSeco: true,
      camera: { pos: [11, 3.6, -0.5], alvo: [5.8, 3.3, -4.6] },
      aplicar(lt, b) { E.campo = 0; E.fio = false; E.ciclo = true; voce.visible = false; },
    },
    {
      fala: 'Mas de madrugada, você fica parado no vermelho... e não passa ninguém na outra rua.',
      destaque: ['madrugada', 'vermelho', 'ninguém'],
      corteSeco: true,
      camera: { pos: [17, 3.5, 3.5], alvo: [5, 1.5, -3] },
      aplicar(lt, b) {
        E.ciclo = false; E.luz1 = 'vermelho';
        E.noite = suave(lt / 1.2) * 0.8;
        E.carroX = mistura(22, 7.2, saida(lt / 2));
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('ninguém'), 'ESPERANDO À TOA'),
    },
    {
      fala: 'Então você enterra um fio enrolado no asfalto, que cria um campo magnético invisível.',
      destaque: ['fio', 'campo', 'magnético'],
      corteSeco: true,
      camera: { pos: [12.5, 5, 3.5], alvo: [8.7, 0.3, -2] },
      aplicar(lt, b) { E.noite = 0.8; E.carroX = 22; E.campo = suave((lt - b.palavra('fio') + 0.2) / 1.2); },
    },
    {
      fala: 'Quando um carro de metal para em cima, o campo muda, e o semáforo percebe que tem alguém esperando.',
      destaque: ['metal', 'muda', 'esperando'],
      camera: { pos: [15, 4.5, 4], alvo: [7.5, 1, -2.5] },
      aplicar(lt, b) {
        E.noite = 0.8; E.campo = 1;
        E.carroX = mistura(22, 8.6, saida((lt - b.palavra('carro') + 0.5) / 1.8));
        E.perturbado = suave((lt - b.palavra('muda') + 0.2) / 0.5);
        E.led = E.perturbado > 0.5;
        E.luz1 = lt > b.palavra('percebe') + 0.3 ? 'verde' : 'vermelho';
      },
      camada: (lt, b) => cartao(lt, b.palavra('muda'), 'LAÇO INDUTIVO', 'O DETECTOR DE CARROS NO ASFALTO'),
      sons: [{ em: 'percebe', tipo: 'ok' }],
    },
    {
      fala: 'É por isso que, em muitos cruzamentos, tem esses retângulos cortados no asfalto, logo antes da faixa.',
      destaque: ['cruzamentos', 'retângulos'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { E.noite = 0; E.campo = 0; E.perturbado = 0; E.led = false; E.carroX = 30; apresentar(lt, b, 'lado'); },
    },
    {
      fala: 'Mas numa avenida cheia de semáforos, você para em todos, um depois do outro.',
      destaque: ['avenida', 'todos'],
      corteSeco: true,
      camera: (lt, b) => ({ pos: [E.carroX + 7, 5, 8], alvo: [E.carroX - 5, 0.5, -2] }),
      aplicar(lt, b) {
        voce.visible = false;
        E.ondas = true;
        E.carroX = mistura(-2, XS[0] + 3, saida(lt / 2.4));
        E.onda = (i) => 'vermelho';
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('todos'), 'PARA E ANDA'),
    },
    {
      fala: 'Então você sincroniza: cada semáforo abre um pouquinho depois do anterior, no tempo exato que o carro leva pra chegar.',
      destaque: ['sincroniza', 'tempo'],
      camera: (lt, b) => ({ pos: [E.carroX + 7, 5, 8], alvo: [E.carroX - 5, 0.5, -2] }),
      aplicar(lt, b) {
        E.ondas = true;
        E.carroX = XS[0] + 3 - 11 * lt;
        E.onda = (i, x) => (E.carroX - x < 16 ? 'verde' : 'vermelho');
      },
      camada: (lt, b) => cartao(lt, b.palavra('sincroniza'), 'ONDA VERDE', 'SEMÁFOROS ABRINDO EM SEQUÊNCIA'),
    },
    {
      fala: 'É por isso que, na velocidade da via, às vezes você pega vários verdes seguidos.',
      destaque: ['velocidade', 'verdes'],
      camera: (lt, b) => ({ pos: [E.carroX + 16, 22, 13], alvo: [E.carroX - 8, 0, -2] }),
      aplicar(lt, b) {
        E.ondas = true;
        const x = XS[0] + 3 - 11 * (lt + 2.5);
        E.carroX = Math.max(-95, x);
        E.onda = (i, xs) => (E.carroX - xs < 16 ? 'verde' : 'vermelho');
      },
      camada: (lt, b) => ok(lt, b.palavra('verdes')),
      sons: [{ em: 'verdes', tipo: 'ok' }],
    },
    {
      fala: 'Parabéns: você construiu um semáforo inteligente!',
      destaque: ['parabéns', 'inteligente'],
      corteSeco: true,
      camera: { pos: [PX + 1.5, 2.3, PZ + 5.5], alvo: [PX - 0.2, 1.4, PZ] },
      aplicar(lt, b) {
        E.ondas = false; E.carroX = 30; E.luz1 = 'verde';
        voce.visible = true;
        voce.position.set(PX, 0.2, PZ);
        voce.rotation.y = 0.6;
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1 };
      },
      sons: [{ em: 'parabens', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno'); },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
