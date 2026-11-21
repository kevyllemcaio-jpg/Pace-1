// "E se você pudesse ver quem tem crush em você?" — 904 frames
const TOTAL = 904;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const over = (a, dy = 230) => { const h = headPos(a); return [h[0], h[1] - dy * (a.s / 0.5)]; };
const GL = { hglasses: 1 };

const SHOTS = [
  // 1 — hook: heart counters over everyone
  { f0: 0, f1: 80, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 0, x: 0, y: -300, z: 1.25 }, { f: 80, x: 0, y: -300, z: 1.4 }],
    build(f) {
      const people = [G('lara', -330, 220, { uniform: true, expr: 'happy' }), G('nina', 330, 220, { uniform: true, expr: 'neutral', flip: -1 }), G('duda', -160, 100, { uniform: true, expr: 'happy' }), G('joana', 170, 100, { uniform: true, expr: 'neutral' })];
      const b = B(0, 420, { props: GL, expr: 'surprised', look: [Math.sin(f * 0.12), -0.6] });
      const fx = people.map((p, i) => { const [x, y] = over(p); return { type: 'hcount', x, y, n: [2, 0, 1, 0][i], gray: [0, 1, 0, 1][i], k: 1, sc: 0.8 }; });
      return { world: { set: 'hall' }, actors: people.concat([b]), fx };
    } },
  // 2 — you get special glasses
  { f0: 81, f1: 147, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 81, x: 40, y: -280, z: 1.5 }, { f: 147, x: 40, y: -290, z: 1.7 }],
    build(f) { return { world: { set: 'hall' }, actors: [B(0, 330, { pose: { L: [12, 6], R: [100, -60] }, props: { glassesHand: 1 }, expr: 'surprised', look: [1, -0.4] })], fx: [{ type: 'sparkle', x: 260, y: -390, k: 0.5 * (0.6 + 0.4 * Math.sin(f * 0.3)), col: '#ff9fd0' }, { type: 'sparkle', x: 140, y: -460, k: 0.3, col: '#fff59d' }] }; } },
  // 3 — put them on: hearts above everyone
  { f0: 148, f1: 249, light: (f) => (f < 165 ? 'day' : 'dream'), dof: {},
    cam: [{ f: 148, x: 0, y: -280, z: 1.4 }, { f: 168, x: 0, y: -380, z: 0.95 }, { f: 249, x: 0, y: -380, z: 1.0 }],
    build(f) {
      const on = f >= 160;
      const people = [G('lara', -480, 160, { uniform: true, expr: 'happy' }), G('nina', 480, 160, { uniform: true, flip: -1 }), G('duda', -250, 60, { uniform: true, expr: 'happy' }), G('joana', 260, 60, { uniform: true }), G('g2', -650, 330, { uniform: true }), G('g5', 650, 330, { uniform: true, flip: -1 })];
      const b = B(0, 420, { props: on ? GL : { glassesHand: 1 }, pose: on ? 'hang' : { L: [12, 6], R: [160, -40] }, expr: on ? 'surprised' : 'happy', look: [Math.sin(f * 0.15), -0.5] });
      const fx = people.map((p, i) => { const [x, y] = over(p); return { type: 'hcount', x, y, n: [1, 0, 3, 0, 0, 2][i], gray: [0, 1, 0, 1, 1, 0][i], k: pop(f, 180 + i * 4), sc: 0.8 }; });
      return { world: { set: 'hall' }, actors: people.concat([b]), fx };
    } },
  // 4 — the teacher? zero
  { f0: 250, f1: 322, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 250, x: -600, y: -450, z: 1.3 }, { f: 322, x: -600, y: -470, z: 1.45 }],
    build(f) { const p = G('prof', -620, 120, { s: 0.48, expr: 'neutral', pose: 'hips', look: [1, 0] }); const [x, y] = over(p, 260); return { world: { set: 'class', board: 'BOM DIA!' }, actors: [p], fx: [{ type: 'hcount', x, y, n: 0, gray: 1, k: pop(f, 288) }] }; } },
  // 5 — the janitor? zero
  { f0: 323, f1: 390, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 323, x: 0, y: -450, z: 1.3 }, { f: 390, x: 0, y: -470, z: 1.45 }],
    build(f) { const p = G('zelador', 0, 120, { s: 0.48, expr: 'happy', props: { mop: 1 }, pose: { L: [10, 10], R: [30, -70] } }); const [x, y] = over(p, 260); return { world: { set: 'hall' }, actors: [p], fx: [{ type: 'hcount', x, y, n: 0, gray: 1, k: pop(f, 356) }] }; } },
  // 6 — the most popular girl? zero, and a bit of anger
  { f0: 391, f1: 519, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 391, x: 0, y: -330, z: 1.2 }, { f: 519, x: 0, y: -340, z: 1.45 }],
    build(f) {
      const p = G('rita', 0, 300, { uniform: true, expr: f > 486 ? 'stern' : 'proud', pose: 'hips', props: { shades: f < 470 ? 1 : 0 }, look: [0, 0] });
      const [x, y] = over(p);
      return { world: { set: 'hall' }, actors: [G('lara', -450, 200, { uniform: true, expr: 'love' }), G('nina', 450, 200, { uniform: true, expr: 'love', flip: -1 }), p],
        fx: [{ type: 'hcount', x, y, n: 0, gray: 1, k: pop(f, 452) }, { type: 'anger', x: 150, y: -330, k: pop(f, 488) }] };
    } },
  // 7 — then your best friend: a giant heart
  { f0: 520, f1: 642, light: () => 'dream', dof: { room: 3 },
    cam: [{ f: 520, x: 170, y: -330, z: 1.05 }, { f: 595, x: 210, y: -420, z: 1.05 }, { f: 642, x: 210, y: -440, z: 1.1 }],
    kicks: [{ f: 596, a: 14 }],
    build(f) {
      const p = G('bia', 420, 300, { uniform: true, expr: 'happy', look: [-1, 0], flip: -1 });
      const [x, y] = over(p, 300);
      return { world: { set: 'hall' }, actors: [B(0, 330, { props: GL, expr: f > 596 ? 'shocked' : 'happy', look: [1, -0.3] }), p], fx: [{ type: 'hcount', x, y: y - 80, n: null, k: pop(f, 594, 604), sc: 2.4 }].concat(f >= 596 ? [{ type: 'sparkle', x: x - 200, y: y - 160, k: 0.4 }, { type: 'sparkle', x: x + 200, y: y - 60, k: 0.4 }] : []) };
    } },
  // 8 — you turn red, she turns red
  { f0: 643, f1: 741, light: () => 'dream', dof: { room: 5 },
    cam: [{ f: 643, x: 170, y: -330, z: 1.3 }, { f: 741, x: 170, y: -330, z: 1.42 }],
    build(f) {
      const bb = sstep(prog(f, 655, 668)), gb = sstep(prog(f, 704, 716));
      return { world: { set: 'hall' }, actors: [B(-60, 330, { props: GL, expr: 'happy', blush: bb, look: [1, 0.2], tilt: bb * 0.1 }), G('bia', 400, 300, { uniform: true, expr: gb > 0.5 ? 'happy' : 'neutral', blush: gb, look: [-1, 0.3], flip: -1, tilt: -gb * 0.1 })],
        fx: [{ type: 'sparkle', x: 170, y: -500 - (f % 30) * 4, k: 0.3, col: '#ff9fd0' }] };
    } },
  // 9 — run to the bathroom mirror
  { f0: 742, f1: 805, light: () => 'day', dof: {},
    cam: [{ f: 742, x: 0, y: -500, z: 0.9 }, { f: 805, x: 0, y: -500, z: 1.0 }],
    build(f) { const w = walkTo(f, 742, 790, [-900, 350], [-120, 350]); return { world: { set: 'hall' }, actors: [{ type: 'mirror', x: 150, y: 0, layer: 'back', inner: f >= 788 ? { who: 'boy', s: 0.6, props: GL, expr: 'worried', blush: 0.6 } : null }, B(w.x, w.y, { walk: w.walk != null ? w.walk * 1.5 : null, props: GL, pose: 'run', expr: 'worried', blush: 0.6, sweat: 1, look: [1, -0.3] })] }; } },
  // 10 — above your own head: an even bigger heart
  { f0: 806, f1: TOTAL - 1, light: () => 'dream', dof: {},
    cam: [{ f: 806, x: 150, y: -720, z: 1.15 }, { f: 853, x: 150, y: -760, z: 1.2 }, { f: TOTAL - 1, x: 150, y: -760, z: 1.32 }],
    kicks: [{ f: 854, a: 14 }],
    build(f) {
      const inner = { who: 'boy', s: 0.6, props: GL, expr: f > 856 ? 'love' : 'surprised', blush: 0.7, look: [0, 0] };
      return { world: { set: 'hall' }, actors: [{ type: 'mirror', x: 150, y: 0, layer: 'back', inner }], fx: [{ type: 'hcount', x: 150, y: -980, n: null, k: pop(f, 851, 861), sc: 3.0 }].concat(f >= 856 ? [{ type: 'sparkle', x: -50, y: -1080, k: 0.4 }, { type: 'sparkle', x: 360, y: -950, k: 0.4 }] : []) };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
