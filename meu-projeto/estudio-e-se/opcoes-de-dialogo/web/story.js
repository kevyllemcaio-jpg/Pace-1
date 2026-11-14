// "E se a vida real tivesse opções de diálogo?" — 925 frames
const TOTAL = 925;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy || {}))); return; }
    A.push(G(ALLG[gi++ % ALLG.length], x, y - 12, Object.assign({ sit: true, uniform: true, expr: o.gexpr || 'happy', look: o.glook || [0, -0.3] })));
  });
  return A;
}
const momOpts = ['SIM', 'QUASE', 'QUE QUARTO?'];
const profOpts = ['ESQUECI', 'NÃO FIZ', 'O CACHORRO COMEU'];

const SHOTS = [
  // 1 — hook: three answers floating in front of you
  { f0: 0, f1: 84, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 0, x: 0, y: -280, z: 1.35 }, { f: 84, x: 0, y: -300, z: 1.5 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [B(0, 330, { expr: 'surprised', look: [0, -0.8], sweat: 1 })], fx: [{ type: 'options', x: 0, y: -780, items: ['OI', 'TCHAU', '???'], sel: Math.floor(f / 20) % 3, ks: [1, 1, 1] }] }; } },
  // 2 — every time someone talks to you
  { f0: 85, f1: 208, light: () => 'day', dof: {},
    cam: [{ f: 85, x: 150, y: -420, z: 1.0 }, { f: 208, x: 150, y: -400, z: 1.1 }],
    build(f) {
      return { world: { set: 'street', door: 0 }, actors: [B(-60, 330, { expr: f > 140 ? 'surprised' : 'happy', look: f > 140 ? [0, -0.8] : [1, 0] }), G('bia', 420, 320, { expr: 'happy', pose: 'wave', look: [-1, 0], flip: -1 })],
        fx: [{ type: 'speech', x: 470, y: -620, text: 'OI!', k: pop(f, 100), tx: -40 }, { type: 'options', x: -60, y: -930, w: 520, items: ['OI!', 'E AÍ?', 'QUEM É VOCÊ?'], ks: [pop(f, 146), pop(f, 156), pop(f, 166)] }] };
    } },
  // 3 — mom asks if you tidied your room
  { f0: 209, f1: 289, light: () => 'eve', dof: {},
    cam: [{ f: 209, x: -650, y: -430, z: 1.05 }, { f: 289, x: -650, y: -420, z: 1.15 }],
    build(f) { return { world: { set: 'room', door: 0 }, actors: [G('mom', -430, 230, { s: 0.5, expr: 'stern', pose: 'hips', look: [-1, 0] }), B(-850, 260, { expr: 'neutral', look: [1, -0.3] })], fx: [{ type: 'speech', x: -400, y: -760, text: 'ARRUMOU\nO QUARTO?', k: pop(f, 222), tx: -20 }] }; } },
  // 4 — option one, two, three
  { f0: 290, f1: 471, light: () => 'eve', dof: { room: 4 },
    cam: [{ f: 290, x: -760, y: -480, z: 1.35 }, { f: 471, x: -760, y: -470, z: 1.5 }],
    build(f) { return { world: { set: 'room', door: 0 }, actors: [G('mom', -430, 230, { s: 0.5, expr: 'stern', pose: 'hips', look: [-1, 0] }), B(-850, 260, { expr: f > 430 ? 'mischief' : 'neutral', look: [0.2, -1] })], fx: [{ type: 'options', x: -760, y: -940, w: 560, items: momOpts, ks: [pop(f, 302), pop(f, 357), pop(f, 419)], sel: f > 440 ? 2 : -1 }] }; } },
  // 5 — you choose three
  { f0: 472, f1: 525, light: () => 'eve', dof: {},
    cam: [{ f: 472, x: -650, y: -430, z: 1.1 }, { f: 525, x: -650, y: -420, z: 1.2 }],
    kicks: [{ f: 505, a: 10 }],
    build(f) {
      const said = f >= 494;
      return { world: { set: 'room', door: 0 }, actors: [G('mom', -430, 230, { s: 0.5, expr: said ? 'shocked' : 'stern', pose: said ? 'cheeks' : 'hips', look: [-1, 0] }), B(-850, 260, { expr: 'grin', look: [1, -0.3] })],
        fx: said ? [{ type: 'speech', x: -900, y: -720, text: 'QUE QUARTO?', k: pop(f, 494), tx: 20 }] : [{ type: 'options', x: -760, y: -940, w: 560, items: momOpts, sel: 2 }] };
    } },
  // 6 — grounded
  { f0: 526, f1: 561, light: () => 'day', dof: {},
    cam: [{ f: 526, x: -120, y: -480, z: 1.15 }, { f: 561, x: -130, y: -470, z: 1.3 }],
    kicks: [{ f: 528, a: 14 }],
    build(f) { return { world: { set: 'bedroom', sun: 0.4 }, actors: [B(-180, -60, { sit: true, expr: 'bored', tilt: -0.15 }), { type: 'blanket', x: -180, y: 60, layer: 'front' }], fx: [{ type: 'stamp', x: -120, y: -900, text: 'CASTIGO', k: pop(f, 526, 532) }] }; } },
  // 7 — teacher asks: where is the homework?
  { f0: 562, f1: 648, light: () => 'day', dof: {},
    cam: [{ f: 562, x: -380, y: -420, z: 0.85 }, { f: 648, x: -330, y: -380, z: 0.92 }],
    build(f) { const A = classroom(f, { boy: { expr: 'worried', look: [-0.6, -0.4] } }); A.push(G('prof', -620, -10, { s: 0.48, expr: 'stern', pose: 'hips', look: [1, 0.3] })); return { world: { set: 'class', board: 'LIÇÃO DE CASA' }, actors: A, fx: [{ type: 'speech', x: -620, y: -780, text: 'CADÊ A\nLIÇÃO?', k: pop(f, 586), tx: 0 }] }; } },
  // 8 — you choose the most polite one
  { f0: 649, f1: 768, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 649, x: 0, y: -380, z: 1.35 }, { f: 700, x: 0, y: -380, z: 1.45 }, { f: 768, x: -60, y: -330, z: 1.0 }],
    build(f) {
      const said = f >= 702;
      const A = classroom(f, { boy: { expr: said ? 'innocent' : 'mischief', look: said ? [-0.8, -0.4] : [0, -1] } });
      A.push(G('prof', -620, -10, { s: 0.48, expr: 'stern', pose: 'hips', look: [1, 0.3] }));
      return { world: { set: 'class', board: 'LIÇÃO DE CASA' }, actors: A,
        fx: said ? [{ type: 'speech', x: 0, y: -580, text: 'O CACHORRO\nCOMEU, PROFESSORA!', fs: 40, k: pop(f, 702), tx: -100 }] : [{ type: 'options', x: 0, y: -840, w: 720, items: profOpts, ks: [pop(f, 652), pop(f, 656), pop(f, 660)], sel: f > 680 ? 2 : -1 }] };
    } },
  // 9 — only you don't have a dog
  { f0: 769, f1: 829, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 769, x: 40, y: -230, z: 1.7 }, { f: 829, x: 40, y: -240, z: 1.9 }],
    build(f) { return { world: { set: 'class', board: 'LIÇÃO DE CASA' }, actors: classroom(f, { boy: { expr: 'worried', sweat: 1, look: [0.4, -0.8] } }), fx: [{ type: 'thought', x: 170, y: -520, w: 380, h: 250, hx: 40, hy: -235, k: pop(f, 784), icons: [['dog', 0, 0, 80]] }] }; } },
  // 10 — and she knows it
  { f0: 830, f1: 876, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 830, x: -600, y: -380, z: 1.6 }, { f: 876, x: -600, y: -380, z: 1.8 }],
    build(f) { const A = classroom(f, {}); A.push(G('prof', -620, -10, { s: 0.48, expr: f > 846 ? 'mischief' : 'squint', pose: 'hips', look: [1, 0.3], tilt: f > 846 ? 0.08 : 0 })); return { world: { set: 'class', board: 'LIÇÃO DE CASA' }, actors: A }; } },
  // 11 — she's your neighbour
  { f0: 877, f1: TOTAL - 1, light: () => 'day', dof: {},
    cam: [{ f: 877, x: 540, y: -500, z: 0.78 }, { f: TOTAL - 1, x: 540, y: -440, z: 0.88 }],
    kicks: [{ f: 893, a: 12 }],
    build(f) { return { world: { set: 'street', door: 1 }, actors: [B(60, 300, { backpack: 1, expr: f > 893 ? 'shocked' : 'neutral', look: [1, -0.2], sweat: f > 893 ? 1 : 0 }), G('prof', 1000, 280, { s: 0.48, expr: 'grin', pose: 'wave', look: [-1, 0], flip: -1 })], fx: [{ type: 'speech', x: 900, y: -660, text: 'OI, VIZINHO!', k: pop(f, 893), tx: 0 }] }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
