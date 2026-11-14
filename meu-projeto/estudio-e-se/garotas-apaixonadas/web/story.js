// "E se todas as garotas do mundo se apaixonassem por você?" — 935 frames
const TOTAL = 935;
const FLASHES = [340];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana'].concat(XG); // sofia is "the one"
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const hearts = (f, x, y, n = 4, spread = 300) => { const o = []; for (let i = 0; i < n; i++) { const t = ((f + i * 13) % 50) / 50; o.push({ type: 'sparkle', x: x + Math.sin(i * 2.1) * spread, y: y - t * 300, k: 0.5 * Math.sin(t * Math.PI), col: '#ff4d6d' }); } return o; };

const SHOTS = [
  // 1 — hook: mobbed by heart-eyed girls
  { f0: 0, f1: 98, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 0, x: 0, y: -60, z: 1.5 }, { f: 98, x: 0, y: -90, z: 1.75 }],
    build(f) {
      const ring = [[-330, 250], [330, 250], [-190, 140], [190, 140], [-470, 340], [470, 340], [-560, 190], [560, 190]];
      const A = [B(0, 420, { expr: 'worried', sweat: 1, look: [Math.sin(f * 0.15), 0], pose: 'cheeks' })];
      ring.forEach(([x, y], i) => { const sq = 0.88 + 0.12 * Math.cos(f * 0.05); A.push(G(ALLG[i], x * sq, y, { uniform: true, expr: 'love', look: [x < 0 ? 1 : -1, 0], pose: i % 2 ? 'letter' : 'up', props: { letter: i % 2 }, hop: Math.max(0, Math.sin(f * 0.3 + i)) * 15 })); });
      return { world: { set: 'hall' }, actors: A, fx: hearts(f, 0, -300, 6, 350) };
    } },
  // 2 — Monday, 7 am
  { f0: 99, f1: 168, light: () => 'day', dof: {},
    cam: [{ f: 99, x: -100, y: -480, z: 1.1 }, { f: 168, x: -110, y: -470, z: 1.25 }],
    build(f) {
      return { world: { set: 'bedroom', sun: sstep(prog(f, 99, 135)), ring: f >= 126 && f < 156 }, actors: [
        B(-180, -60, { sit: true, expr: f < 140 ? 'bliss' : 'bored', tilt: f < 140 ? -0.2 : 0 }),
        { type: 'blanket', x: -180, y: 60, layer: 'front' },
      ], fx: f >= 126 && f < 156 ? [{ type: 'lines', x: 380, y: -420, r: 110, k: 0.6 }] : [] };
    } },
  // 3 — open the front door
  { f0: 169, f1: 227, light: () => 'day', dof: {},
    cam: [{ f: 169, x: 0, y: -520, z: 0.95 }, { f: 227, x: 20, y: -480, z: 1.05 }],
    build(f) {
      const w = walkTo(f, 186, 215, [0, 40], [60, 320]);
      return { world: { set: 'street', door: sstep(prog(f, 176, 190)) }, actors: f >= 182 ? [B(w.x, w.y, { walk: w.walk, backpack: 1, expr: 'happy' })] : [] };
    } },
  // 4 — a line of girls to the corner, each with a love letter
  { f0: 228, f1: 339, light: () => 'day', dof: {},
    cam: [{ f: 228, x: 200, y: -380, z: 1.0 }, { f: 290, x: 3800, y: -500, z: 0.7, e: 'l' }, { f: 312, x: 6200, y: -560, z: 0.62 }, { f: 339, x: 6250, y: -560, z: 0.64 }],
    build(f) {
      const A = [B(60, 320, { backpack: 1, expr: f < 240 ? 'surprised' : 'shocked', sweat: 1, look: [1, 0] })];
      for (let i = 0; i < 36; i++) {
        const x = 420 + i * 175, y = 330 + (i % 2) * 40;
        const up = f >= 300 + (i % 6);
        A.push(G(ALLG[i % ALLG.length], x, y, { uniform: false, expr: 'love', look: [-1, 0], pose: up ? 'letter' : 'hang', props: { letter: up ? 1 : 0 }, bob: Math.sin(f * 0.3 + i) * 5 }));
      }
      return { world: { set: 'street', door: 1 }, actors: A, fx: f >= 302 ? hearts(f, 6200, -500, 5, 500) : [] };
    } },
  // 5 — school desk buried in chocolate
  { f0: 340, f1: 433, light: () => 'day', dof: {},
    cam: [{ f: 340, x: 0, y: -330, z: 0.95 }, { f: 433, x: 20, y: -290, z: 1.3 }],
    build(f) {
      const A = [];
      [[-410, 340], [410, 340], [-380, 110], [380, 110], [0, 110], [-440, 580], [440, 580]].forEach(([x, y], i) => { A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' }); A.push(G(ALLG[i], x, y - 12, { sit: true, uniform: true, expr: 'love', look: [x < 0 ? 1 : -1, -0.2] })); });
      A.push({ type: 'desk', x: 0, y: 340, s: ks(340) / 0.5, layer: 'front' });
      A.push({ type: 'choco', x: 0, y: 345, layer: 'front', n: 8 + 30 * easeOut(prog(f, 345, 400)) });
      A.push(B(230, 420, { backpack: 1, expr: f < 380 ? 'surprised' : 'shocked', look: [-1, 0.3], pose: f > 395 ? 'cheeks' : 'hang' }));
      return { world: { set: 'class' }, actors: A, fx: hearts(f, 0, -300, 4, 400) };
    } },
  // 6 — recess: try to hide in the locker
  { f0: 434, f1: 521, light: () => 'day', dof: {},
    cam: [{ f: 434, x: -300, y: -450, z: 0.85 }, { f: 521, x: -60, y: -470, z: 1.0 }],
    build(f) {
      const w = walkTo(f, 440, 485, [-1000, 300], [-120, 200]);
      const open = sstep(prog(f, 492, 505));
      return { world: { set: 'hall', locker: 1 }, actors: [
        { type: 'lockerDoor', x: 0, y: 0, open, layer: 'front' },
        B(w.x, w.y, { walk: w.walk != null ? w.walk * 1.4 : null, expr: 'worried', sweat: 1, look: [1, -0.3], pose: f > 486 ? { L: [12, 6], R: [100, -30] } : 'run' }),
      ] };
    } },
  // 7 — three girls are already inside
  { f0: 522, f1: 581, light: () => 'day', dof: {},
    cam: [{ f: 522, x: 0, y: -520, z: 1.25 }, { f: 581, x: 0, y: -520, z: 1.45 }],
    kicks: [{ f: 527, a: 10 }],
    build(f) {
      return { world: { set: 'hall', locker: 1 }, actors: [
        G('lara', -120, -60, { s: 0.42, layer: 'back', uniform: true, expr: 'lovegrin', pose: 'wave', look: [0.6, 0.3] }),
        G('nina', 120, -60, { s: 0.42, layer: 'back', uniform: true, expr: 'love', pose: 'up', look: [-0.3, 0.3] }),
        G('duda', 0, -360, { s: 0.4, layer: 'back', uniform: true, expr: 'love', pose: 'letter', props: { letter: 1 }, look: [0, 0.6] }),
        { type: 'lockerDoor', x: 0, y: 0, open: 1, layer: 'front' },
        B(-140, 260, { expr: f < 528 ? 'surprised' : 'shocked', sweat: 1, look: [0.5, -0.6], hop: f >= 528 && f < 540 ? Math.sin(prog(f, 528, 540) * Math.PI) * 40 : 0, pose: 'cheeks' }),
      ], fx: hearts(f, 0, -700, 4, 200) };
    } },
  // 8 — run across the court, a thousand girls chasing
  { f0: 582, f1: 685, light: () => 'day', dof: {},
    cam: [{ f: 582, x: -700, y: -420, z: 0.95 }, { f: 685, x: 900, y: -380, z: 0.8, e: 'l' }],
    build(f) {
      const bx = lerp(-700, 1100, prog(f, 582, 685));
      const A = [B(bx, 360, { walk: f * 0.95, expr: 'scared', sweat: 1, pose: 'run', look: [-1, 0] })];
      for (let i = 0; i < 30; i++) {
        const row = i % 5, col = Math.floor(i / 5);
        const x = bx - 500 - col * 230 - row * 40 + Math.sin(i) * 30, y = 120 + row * 110;
        A.push(G(ALLG[i % ALLG.length], x, y, { uniform: true, walk: f * 0.95 + i, expr: i % 2 ? 'love' : 'lovegrin', pose: i % 3 ? 'up' : 'letter', props: { letter: i % 3 ? 0 : 1 } }));
      }
      return { world: { set: 'quadra', plain: true, banner: 'QUADRA' }, actors: A, fx: [{ type: 'speed', x: bx - 200, y: 0, dir: -1 }, { type: 'dust', x: bx - 120, y: 360, k: 0.8, a: 0.8 }].concat(hearts(f, bx - 700, -300, 6, 400)) };
    } },
  // 9 — trip and fall in front of the only girl who doesn't care
  { f0: 686, f1: 809, light: () => 'day', dof: {},
    cam: [{ f: 686, x: 300, y: -350, z: 1.0 }, { f: 720, x: 420, y: -250, z: 1.1 }, { f: 735, x: 560, y: -150, z: 1.35, e: 'o' }, { f: 809, x: 600, y: -220, z: 1.45 }],
    kicks: [{ f: 724, a: 18 }],
    build(f) {
      const t = prog(f, 703, 724);
      const bx = f < 703 ? lerp(-100, 300, prog(f, 686, 703)) : lerp(300, 400, easeOut(t));
      const rot = f < 703 ? 0 : 1.45 * easeIn(t);
      const A = [B(bx, 360, { walk: f < 703 ? f * 0.95 : null, expr: f < 703 ? 'scared' : f < 735 ? 'shocked' : 'surprised', sweat: 1, pose: f < 703 ? 'run' : 'fallen', rot, noShadow: f >= 703, look: f > 740 ? [1, -1] : [0, 0] })];
      A.push(G('sofia', 820, 260, { uniform: true, expr: 'bored', pose: 'read', props: { book: 1 }, look: [0, 0.6], flip: -1 }));
      const fx = [];
      if (f >= 722 && f < 736) fx.push({ type: 'dust', x: 620, y: 360, k: 1.4, a: 1 - prog(f, 722, 736) });
      if (f >= 724 && f < 760) for (let i = 0; i < 3; i++) fx.push({ type: 'sparkle', x: 640 + Math.cos(f * 0.3 + i * 2) * 80, y: 300 + Math.sin(f * 0.3 + i * 2) * 25, k: 0.35 });
      return { world: { set: 'quadra', plain: true, banner: 'QUADRA' }, actors: A, fx };
    } },
  // 10 — she walks right past
  { f0: 810, f1: 856, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 810, x: 600, y: -200, z: 1.3 }, { f: 856, x: 560, y: -200, z: 1.35 }],
    build(f) {
      const w = walkTo(f, 812, 860, [820, 260], [180, 230]);
      return { world: { set: 'quadra', plain: true, banner: 'QUADRA' }, actors: [
        B(400, 360, { expr: 'surprised', pose: 'fallen', rot: 1.45, noShadow: true, look: [w.x > 520 ? 1 : -1, -1] }),
        G('sofia', w.x, w.y, { walk: w.walk, uniform: true, expr: 'bored', pose: 'read', props: { book: 1 }, look: [0, 0.6], flip: -1 }),
      ] };
    } },
  // 11 — and for the first time, YOU fall in love
  { f0: 857, f1: TOTAL - 1, light: () => 'dream', dof: { room: 8 },
    cam: [{ f: 857, x: 520, y: -100, z: 1.3 }, { f: 899, x: 400, y: -90, z: 2.4 }, { f: TOTAL - 1, x: 400, y: -95, z: 2.55, r: 2 }],
    build(f) {
      const sitUp = sstep(prog(f, 857, 872));
      return { world: { set: 'quadra', plain: true, banner: 'QUADRA' }, actors: [
        B(400, 360, { expr: f < 885 ? 'surprised' : 'love', pose: f < 885 ? 'fallen' : 'cheeks', rot: 1.45 * (1 - sitUp), sit: sitUp > 0.5, noShadow: true, look: [-1, -0.3], tilt: f > 885 ? 0.12 : 0 }),
      ], fx: f >= 885 ? hearts(f, 400, -150, 7, 260) : [] };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
