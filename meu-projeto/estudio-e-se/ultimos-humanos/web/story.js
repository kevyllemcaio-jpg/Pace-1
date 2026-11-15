// "E se você e a sua crush fossem os últimos humanos vivos?" — 1233 frames (vertical)
const TOTAL = 1233;
const FLASHES = [1025];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const SO = (x, y, o = {}) => G('sofia', x, y, Object.assign({ flip: -1 }, o));
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const day = (f, f0, text) => [{ type: 'day', text, k: f < f0 + 60 ? pop(f, f0, f0 + 10) : 1 - prog(f, f0 + 60, f0 + 70) }];
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana'].concat(XG);
const crowd = (f, n, dir = 1) => { const A = []; for (let i = 0; i < n; i++) { const y = 120 + (i % 4) * 130, x = (((i * 260 + f * 9 * dir) % 2600) + 2600) % 2600 - 1300; A.push(G(ALLG[i % ALLG.length], x, y, { walk: f * 0.9 + i, expr: i % 2 ? 'grin' : 'happy', pose: i % 3 ? 'hang' : 'up', props: { shirt: 1, glow: i % 2 }, seed: i, flip: dir })); } return A; };

const SHOTS = [
  { f0: 0, f1: 103, light: () => 'day', dof: {}, cam: [{ f: 0, x: 60, y: -520, z: 0.72 }, { f: 103, x: 60, y: -460, z: 0.82 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [{ type: 'semaforo', x: 650, y: 380, layer: 'back' }, B(-120, 360, { expr: 'surprised', look: [1, -0.3] }), SO(220, 350, { expr: 'surprised', look: [-1, -0.3] })], fx: [{ type: 'dust', x: -500 + (f * 6) % 1400, y: 380, k: 0.6, a: 0.6 }] }; } },
  { f0: 104, f1: 189, light: () => 'day', dof: {}, cam: [{ f: 104, x: 0, y: -480, z: 1.0 }, { f: 189, x: 30, y: -440, z: 1.05 }],
    build(f) { const w = walkTo(f, 118, 150, [0, 40], [60, 330]); return { world: { set: 'street', door: sstep(prog(f, 104, 116)) }, actors: f >= 112 ? [B(w.x, w.y, { walk: w.walk, expr: f > 150 ? 'surprised' : 'bored', look: [Math.sin(f * 0.1), -0.2] })] : [] }; } },
  { f0: 190, f1: 274, light: () => 'day', dof: {}, cam: [{ f: 190, x: 300, y: -700, z: 0.55 }, { f: 274, x: 300, y: -650, z: 0.6 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [{ type: 'semaforo', x: 700, y: 380, layer: 'back' }, B(60, 380, { s: 0.45, expr: 'worried', look: [Math.sin(f * 0.08), 0] })], fx: f > 240 ? [{ type: 'exclaim', x: 60, y: -150, k: 0.4, txt: '...' }] : [] }; } },
  { f0: 275, f1: 368, light: () => 'day', dof: {}, cam: [{ f: 275, x: 150, y: -380, z: 1.0 }, { f: 368, x: 180, y: -360, z: 1.15 }],
    build(f) { const w = walkTo(f, 300, 335, [-600, 380], [-120, 380]); return { world: { set: 'plaza' }, actors: [{ type: 'bench', x: 330, y: 385, layer: 'back' }, SO(330, 250, { sit: true, pose: 'cone', props: { cone: 1 }, expr: f > 340 ? 'surprised' : 'happy', look: [-1, 0] }), B(w.x, w.y, { walk: w.walk, expr: f > 338 ? 'surprised' : 'worried', look: [1, 0] })], fx: f > 340 && f < 360 ? [{ type: 'exclaim', x: 100, y: -480, k: pop(f, 340) * 0.6 }] : [] }; } },
  { f0: 369, f1: 568, light: () => 'day', dof: {}, cam: [{ f: 369, x: 0, y: -600, z: 0.62 }, { f: 470, x: -620, y: -420, z: 0.95 }, { f: 568, x: 650, y: -420, z: 0.95 }],
    build(f) { return { world: { set: 'mall' }, actors: [SO(-650, 300, { pose: 'hold', props: { books: 1 }, expr: 'bliss', look: [0, -0.5] }), B(700, 300, { pose: 'pillow', props: { candy: 20 + Math.min(14, (f - 500) * 0.4) }, expr: 'grin', look: [0, -0.5], hop: f > 510 ? Math.abs(Math.sin(f * 0.3)) * 20 : 0 })], screen: day(f, 371, 'DIA 1') }; } },
  { f0: 569, f1: 672, light: () => 'day', dof: {}, cam: [{ f: 569, x: 600, y: -500, z: 0.8 }, { f: 672, x: -300, y: -480, z: 0.8, e: 'l' }],
    build(f) { const x = lerp(1500, -900, prog(f, 569, 672)); return { world: { set: 'street', door: 0 }, actors: [{ type: 'cart', x, y: 520, flip: -1, layer: 'front' }, B(x + 150, 360, { s: 0.5, sit: true, pose: 'drive', expr: 'grin', look: [-1, 0], noShadow: true }), SO(x - 150, 350, { s: 0.5, sit: true, pose: 'up', expr: 'laugh', look: [-1, 0], noShadow: true })], fx: [{ type: 'speed', x: x + 500, y: 0, dir: 1 }, { type: 'speed', x: x + 500, y: -300, dir: 1 }], screen: day(f, 571, 'DIA 3').concat([{ type: 'tag', text: 'NA CONTRAMÃO', k: pop(f, 634) * (1 - prog(f, 664, 672)), y: 1500 }]) }; } },
  { f0: 673, f1: 814, light: () => 'eve', dof: {}, cam: [{ f: 673, x: -650, y: -420, z: 1.0 }, { f: 814, x: -650, y: -400, z: 1.15 }],
    build(f) { const wins = Math.min(5, Math.max(0, Math.floor((f - 740) / 12))); return { world: { set: 'room', door: 0 }, actors: [{ type: 'board', x: -650, y: 420, layer: 'front' }, B(-920, 330, { sit: true, expr: f > 750 ? 'squint' : 'neutral', look: [1, 0.5] }), SO(-380, 320, { sit: true, expr: f > 750 ? 'proud' : 'happy', pose: f > 750 ? 'up' : 'hang', look: [-1, 0.5] })], fx: (f >= 700 && f < 740 ? [{ type: 'nowifi', x: -650, y: -800, k: pop(f, 700) }] : []).concat(wins ? [{ type: 'exclaim', x: -380, y: -440, k: 0.6, txt: 'x' + wins }] : []), screen: day(f, 675, 'DIA 7') }; } },
  { f0: 815, f1: 925, light: () => 'dark', dof: {}, cam: [{ f: 815, x: 0, y: -650, z: 0.75 }, { f: 925, x: 0, y: -600, z: 0.85 }],
    build(f) { return { world: { set: 'roof', empty: 1 }, actors: [{ type: 'sheet', x: 0, y: -150, layer: 'back' }, B(-200, 250, { sit: true, expr: 'bliss', look: [0.5, -0.8], props: {} }), SO(200, 240, { sit: true, expr: 'happy', look: [-0.5, -0.8] })], lights: [{ x: 0, y: -850, r: 700, i: 0.9, col: 'rgba(255,240,170,.35)' }, { x: 0, y: -120, r: 500, i: 0.7 }], screen: day(f, 817, 'DIA 15') }; } },
  { f0: 926, f1: 1024, light: () => 'gold', dof: { room: 5 }, cam: [{ f: 926, x: 0, y: -420, z: 0.95 }, { f: 1024, x: -40, y: -300, z: 1.4 }],
    build(f) { const turn = f >= 990; return { world: { set: 'roof', sunset: 1, empty: 1 }, actors: [B(-200, 300, { sit: true, expr: turn ? 'innocent' : 'worried', blush: 0.3 + 0.5 * prog(f, 960, 1010), sweat: turn ? 0 : 1, look: [1, 0], tilt: turn ? 0.06 : 0 }), SO(200, 290, { sit: true, expr: 'happy', look: [0.2, -0.6] })], fx: f > 1000 ? [{ type: 'sparkle', x: -60, y: -330, k: 0.3, col: '#ff9fd0' }] : [], screen: day(f, 928, 'DIA 30') }; } },
  { f0: 1025, f1: 1099, light: () => 'day', dof: {}, cam: [{ f: 1025, x: 0, y: -450, z: 0.95 }, { f: 1099, x: 0, y: -430, z: 1.0 }], kicks: [{ f: 1027, a: 22 }],
    build(f) { const bx = lerp(-1800, 1800, prog(f, 1030, 1095)); return { world: { set: 'street', door: 0 }, actors: crowd(f, 12).concat([{ type: 'bus', x: bx, y: 100, layer: 'back' }, B(-150, 420, { expr: 'shocked', look: [0, 0], hop: f < 1040 ? Math.sin(prog(f, 1025, 1040) * Math.PI) * 50 : 0 }), SO(180, 410, { expr: 'shocked', look: [0, 0] })]), fx: f < 1050 ? [{ type: 'lines', x: 0, y: -100, r: 300, k: 0.9 }] : [] }; } },
  { f0: 1100, f1: 1170, light: () => 'day', dof: {}, cam: [{ f: 1100, x: 400, y: -500, z: 0.9 }, { f: 1170, x: 380, y: -480, z: 1.0 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [{ type: 'poster', x: 700, y: -650, layer: 'back' }].concat(crowd(f, 10, -1)) }; } },
  { f0: 1171, f1: TOTAL - 1, light: () => 'day', dof: { room: 4 }, cam: [{ f: 1171, x: 20, y: -250, z: 1.3 }, { f: TOTAL - 1, x: 20, y: -260, z: 1.6 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: crowd(f, 8).filter((a) => a.y < 300).concat([B(-150, 420, { expr: 'bored', look: [0, 0] }), SO(180, 410, { expr: 'bored', look: [0, 0] })]) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
