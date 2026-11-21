// "E se todo mundo pudesse ouvir os seus pensamentos?" — 1154 frames @30fps (voice 38.5 s)
const TOTAL = 1154;
const FLASHES = [1038];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) {
  const t = prog(f, f0, f1), e = sstep(t);
  return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null };
}
const giggle = (f, i) => Math.sin(f * 0.45 + i * 1.7) * 0.06;
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
POSES.shrug = { L: [60, 80], R: [60, 80] };

const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy || {}))); return; }
    const w = ALLG[gi++ % ALLG.length];
    const turn = o.turnAt != null ? prog(f, o.turnAt + (i % 4), o.turnAt + 3 + (i % 4)) : 0;
    const lx = clamp((0 - x) / 500, -1, 1), ly = clamp((-300 - (y - 400)) / 600, -1, 1);
    A.push(G(w, x, y - 12, Object.assign({ sit: true, uniform: true, expr: turn > 0.5 ? (o.stareExpr || 'surprised') : (i % 3 ? 'happy' : 'neutral'), look: turn > 0.5 ? [lx, ly] : (o.lookFront || [0, -0.3]), tilt: turn > 0.5 ? lx * 0.12 : giggle(f, i) * 0.4 }, o.girl ? o.girl(i, x, y) : {})));
  });
  return A;
}
// boy seated in class: head top approx
const BH = [0, -225];
const bubbleOver = (k, o = {}) => Object.assign({ type: 'thought', x: 150, y: -520, w: 520, h: 300, hx: 40, hy: -235, k }, o);

const SHOTS = [
  // 1 — hook
  { f0: 0, f1: 88, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 60, y: -230, z: 1.3 }, { f: 88, x: 70, y: -260, z: 1.45 }],
    build(f) {
      const ic = ['heart', 'pizza', 'note', 'q'][Math.floor(f / 11) % 4];
      return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'worried', sweat: 1, look: [0.6, -0.8] }, turnAt: -10, stareExpr: 'surprised', girl: () => ({ look: [0.3, -1] }) }),
        fx: [bubbleOver(pop(f, -8, 0), { icons: [[ic, 0, 0, 90]] }), { type: 'waves', x: 150, y: -560, r: 230 }] };
    } },
  // 2a — Monday morning, alarm
  { f0: 89, f1: 163, light: () => 'day', dof: {},
    cam: [{ f: 89, x: -120, y: -480, z: 1.15 }, { f: 163, x: -130, y: -470, z: 1.3 }],
    build(f) {
      const awake = f >= 144;
      return { world: { set: 'bedroom', sun: sstep(prog(f, 89, 130)), ring: f >= 122 && f < 150 }, actors: [
        B(-180, -60, { sit: true, expr: awake ? 'squint' : 'bliss', tilt: awake ? 0 : -0.25 + Math.sin(f * 0.1) * 0.03, noBlink: !awake }),
        { type: 'blanket', x: -180, y: 60, layer: 'front', lift: Math.sin(f * 0.1) * 6 },
      ], fx: awake ? [] : [bubbleOver(1, { x: 60, y: -760, w: 300, h: 190, hx: -150, hy: -590, icons: [['zzz', 0, 0, 80]] })].concat(f >= 122 && f < 150 ? [{ type: 'lines', x: 380, y: -420, r: 110, k: 0.6 }] : []) };
    } },
  // 2b — the whole neighbourhood hears "five more minutes"
  { f0: 164, f1: 259, light: () => 'day', dof: {},
    cam: [{ f: 164, x: -100, y: -560, z: 1.0 }, { f: 200, x: 250, y: -720, z: 0.75 }, { f: 259, x: 260, y: -730, z: 0.8 }],
    build(f) {
      return { world: { set: 'bedroom', sun: 1, neighbors: prog(f, 180, 215) }, actors: [
        B(-180, -60, { sit: true, expr: 'bored', tilt: -0.15 }),
        { type: 'blanket', x: -180, y: 60, layer: 'front' },
      ], fx: [bubbleOver(pop(f, 198), { x: 20, y: -1000, w: 660, h: 340, hx: -170, hy: -600, text: 'SÓ MAIS 5\nMINUTINHOS...', fs: 72, tcol: '#3d85e0' })].concat(f >= 200 ? [{ type: 'waves', x: 20, y: -1040, r: 340 }] : []) };
    } },
  // 3 — teacher asks who did the homework
  { f0: 260, f1: 351, light: () => 'day', dof: {},
    cam: [{ f: 260, x: -260, y: -380, z: 0.82 }, { f: 351, x: -200, y: -340, z: 0.92 }],
    build(f) {
      const A = classroom(f, { boy: { expr: 'neutral', look: [-0.8, -0.3] }, lookFront: [-0.8, -0.4] });
      A.push(G('prof', -600, -10, { s: 0.48, expr: 'happy', pose: f > 292 ? { L: [30, -100], R: [100, -10] } : 'hang', props: {}, look: [1, 0.3], tilt: f > 305 && f < 320 ? 0.06 : 0 }));
      return { world: { set: 'class' }, actors: A };
    } },
  // 4 — you raise your hand
  { f0: 352, f1: 402, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 352, x: 0, y: -190, z: 1.7 }, { f: 402, x: 10, y: -210, z: 1.9 }],
    build(f) {
      const r = clamp(springAt(f, 357, 0.8), 0, 1.15);
      return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'proud', pose: mixPose('hang', 'raise', r), tilt: 0.05 } }),
        fx: f >= 360 && f < 378 ? [{ type: 'sparkle', x: 150, y: -560, k: 0.5 * Math.sin(prog(f, 360, 378) * Math.PI) }] : [] };
    } },
  // 5 — your thought yells "I copied from Pedro!"
  { f0: 403, f1: 487, light: () => 'day', dof: {},
    cam: [{ f: 403, x: 40, y: -260, z: 1.55 }, { f: 440, x: 60, y: -300, z: 1.4 }, { f: 487, x: 0, y: -330, z: 0.92 }],
    kicks: [{ f: 440, a: 16 }],
    build(f) {
      const out = f >= 438;
      const A = classroom(f, { boy: { expr: out ? 'shocked' : 'proud', pose: mixPose('raise', 'hang', prog(f, 460, 480)), sweat: out ? 1 : 0 }, turnAt: 444, stareExpr: 'shocked' });
      A.push(G('prof', -600, -10, { s: 0.48, expr: f > 450 ? 'stern' : 'happy', pose: f > 450 ? 'hips' : 'hang', look: [1, 0.3] }));
      return { world: { set: 'class' }, actors: A, fx: [bubbleOver(pop(f, 437), { x: 170, y: -560, w: 640, h: 330, text: 'COPIEI\nDO PEDRO!', fs: 78, shake: f < 470 ? 6 : 0 })].concat(out ? [{ type: 'waves', x: 170, y: -600, r: 330 }] : []) };
    } },
  // 6 — lunch: the prettiest girl sits next to you
  { f0: 488, f1: 589, light: () => 'day', dof: {},
    cam: [{ f: 488, x: 330, y: -280, z: 1.0 }, { f: 589, x: 300, y: -260, z: 1.12 }],
    build(f) {
      const w = walkTo(f, 520, 546, [900, 360], [440, 330]);
      const sat = f >= 546;
      const fx = [];
      if (f >= 544 && f < 570) fx.push({ type: 'sparkle', x: 520, y: -260, k: 0.6 * Math.sin(prog(f, 544, 570) * Math.PI), col: '#ffc8dd' });
      return { world: { set: 'lunch' }, actors: [
        G('rita', -500, 120, { uniform: true, expr: 'happy', pose: 'hang', look: [1, 0] }), G('g2', -650, 160, { uniform: true, expr: 'happy', look: [1, 0] }),
        B(150, 330, { sit: true, expr: f < 548 ? 'neutral' : 'surprised', look: f < 520 ? [0, 0.6] : [1, 0], sweat: sat ? 1 : 0 }),
        G('sofia', w.x, w.y, { uniform: true, sit: sat, walk: w.walk, expr: 'happy', look: [-1, 0], flip: -1 }),
        { type: 'table', x: 300, y: 430, s: 1, layer: 'front', trays: [150, 440] },
      ], fx };
    } },
  // 7 — try not to think of anything
  { f0: 590, f1: 653, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 590, x: 230, y: -260, z: 1.4 }, { f: 653, x: 210, y: -260, z: 1.9 }],
    build(f) {
      const flick = 0.92 + 0.08 * Math.sin(f * 1.7);
      return { world: { set: 'lunch' }, actors: [
        B(150, 330, { sit: true, expr: 'squint', sweat: 1, tilt: Math.sin(f * 1.4) * 0.02 }),
        G('sofia', 440, 330, { uniform: true, sit: true, expr: 'happy', look: [-1, -0.2], flip: -1 }),
        { type: 'table', x: 300, y: 430, s: 1, layer: 'front', trays: [150, 440] },
      ], fx: [bubbleOver(pop(f, 596) * flick, { x: 250, y: -470, w: 420, h: 250, hx: 160, hy: -215, shake: 2 })] };
    } },
  // 8 — your brain starts singing. Very loud.
  { f0: 654, f1: 752, light: () => 'day', dof: {},
    cam: [{ f: 654, x: 210, y: -270, z: 1.9 }, { f: 714, x: 220, y: -300, z: 1.6 }, { f: 724, x: 200, y: -330, z: 0.95, e: 'o' }, { f: 752, x: 190, y: -330, z: 1.0 }],
    kicks: [{ f: 716, a: 18 }],
    build(f) {
      const loud = f >= 714;
      const t = f * 0.4;
      const icons = [['note', -120 + Math.sin(t) * 10, -30, 55], ['heart', 0, 20 + Math.cos(t) * 8, 70], ['note', 120, -40 + Math.sin(t + 1) * 10, 55]];
      const A = [
        B(150, 330, { sit: true, expr: loud ? 'shocked' : 'bliss', tilt: Math.sin(f * 0.5) * 0.08 }),
        G('sofia', 440, 330, { uniform: true, sit: true, expr: loud ? 'laugh' : 'surprised', look: [-1, -0.6], flip: -1, pose: loud ? 'cheeks' : 'hang' }),
        { type: 'table', x: 300, y: 430, s: 1, layer: 'front', trays: [150, 440] },
      ];
      if (loud) [['bia', -350, 120], ['lara', -150, 60], ['nina', 700, 90], ['joana', 900, 140]].forEach(([w, x, y], i) => A.push(G(w, x, y, { uniform: true, expr: 'squint', pose: 'cheeks', hop: Math.max(0, Math.sin((f - 716) * 0.5 + i)) * 10 })));
      return { world: { set: 'lunch' }, actors: A, fx: [bubbleOver(pop(f, 654) * (loud ? 1.25 : 1), { x: 260, y: -520, w: 460, h: 270, hx: 160, hy: -215, icons, shake: loud ? 7 : 2 })].concat(loud ? [{ type: 'waves', x: 260, y: -560, r: 300 }, { type: 'waves', x: 260, y: -560, r: 420 }] : [{ type: 'note', x: 120, y: -380, k: 0.6 }]) };
    } },
  // 9 — at home, mom asks how the day was
  { f0: 753, f1: 840, light: () => 'eve', dof: {},
    cam: [{ f: 753, x: -760, y: -420, z: 0.9 }, { f: 840, x: -700, y: -390, z: 1.05 }],
    build(f) {
      const w = walkTo(f, 753, 790, [-1250, 120], [-850, 260]);
      return { world: { set: 'room', door: 1 - sstep(prog(f, 790, 805)) }, actors: [
        G('mom', -430, 230, { s: 0.5, expr: 'happy', pose: f > 775 ? { L: [45, -80], R: [100, -20] } : 'hips', look: [-1, 0], tilt: f > 795 && f < 812 ? -0.06 : 0 }),
        B(w.x, w.y, { walk: w.walk, backpack: 1, expr: 'neutral', look: [1, 0] }),
      ] };
    } },
  // 10 — you say yes. The thought tells the rest.
  { f0: 841, f1: 948, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 841, x: -650, y: -400, z: 1.15 }, { f: 948, x: -640, y: -420, z: 1.3 }],
    build(f) {
      const nod = f >= 852 && f < 872 ? Math.sin((f - 852) * 0.6) * 0.1 : 0;
      const seq = ['zzz', 'book', 'heart', 'note'];
      const i = clamp(Math.floor((f - 890) / 9), 0, 3);
      const momE = f < 893 ? 'happy' : f < 915 ? 'surprised' : 'shocked';
      return { world: { set: 'room', door: 0 }, actors: [
        G('mom', -430, 230, { s: 0.5, expr: momE, pose: f > 915 ? 'cheeks' : 'hips', look: [-1, -0.5] }),
        B(-850, 260, { backpack: 1, expr: f < 900 ? 'innocent' : 'worried', tilt: nod, sweat: f > 905 ? 1 : 0, look: [1, 0] }),
      ], fx: f >= 888 ? [bubbleOver(pop(f, 888), { x: -760, y: -760, w: 420, h: 260, hx: -830, hy: -500, icons: [[seq[i], 0, 0, 85]], shake: 3 }), { type: 'waves', x: -760, y: -800, r: 260 }] : [] };
    } },
  // 11 — the trick: think about pizza
  { f0: 949, f1: 1037, light: () => 'eve', dof: { room: 5 },
    cam: [{ f: 949, x: -830, y: -330, z: 1.7 }, { f: 1037, x: -820, y: -380, z: 1.95 }],
    build(f) {
      const fx = [];
      if (f >= 960 && f < 995) fx.push({ type: 'bulb', x: -850, y: -650, k: pop(f, 960) * (1 - prog(f, 988, 995)) });
      if (f >= 995) fx.push(bubbleOver(pop(f, 995), { x: -700, y: -720, w: 380, h: 260, hx: -820, hy: -500, icons: [['pizza', 0, 0, 95]] }));
      return { world: { set: 'room', door: 0 }, actors: [B(-850, 260, { backpack: 1, expr: f < 962 ? 'worried' : f < 995 ? 'surprised' : 'mischief', look: f < 995 ? [0, -1] : [0.3, 0], pose: f >= 963 && f < 990 ? 'raise' : 'hang' })], fx };
    } },
  // 12 — pizza all day long
  { f0: 1038, f1: 1083, light: () => 'day', dof: {},
    cam: [{ f: 1038, x: -300, y: -500, z: 0.8 }, { f: 1083, x: -260, y: -440, z: 0.9 }],
    build(f) {
      return { world: { set: 'class', clock: 50 + sstep(prog(f, 1040, 1080)) * 400 }, actors: classroom(f, { boy: { expr: 'mischief', look: [0.3, -0.6] }, girl: (i) => ({ expr: 'surprised', look: [0, -0.8] }) }),
        fx: [bubbleOver(1, { icons: [['pizza', 0, 0, 100]] })] };
    } },
  // 13 — now the whole city is hungry
  { f0: 1084, f1: TOTAL - 1, light: () => 'day', dof: {},
    cam: [{ f: 1084, x: 0, y: -330, z: 0.82 }, { f: 1118, x: 0, y: -300, z: 0.9 }, { f: TOTAL - 1, x: 20, y: -230, z: 1.6 }],
    kicks: [{ f: 1123, a: 10 }],
    build(f) {
      const hungry = f >= 1100;
      const A = classroom(f, { boy: { expr: f > 1125 ? 'mischief' : 'happy', pose: f > 1128 ? 'shrug' : 'hang', look: f > 1125 ? [0, 0] : [0, -0.6] }, girl: (i) => ({ expr: hungry ? 'grin' : 'happy', look: [0, -0.5], hop: f >= 1123 && f < 1132 ? Math.sin(prog(f, 1123, 1132) * Math.PI) * 12 : 0 }) });
      A.push(G('prof', -600, -10, { s: 0.48, expr: hungry ? 'grin' : 'happy', look: [1, -0.4], pose: hungry ? 'cheeks' : 'hang' }));
      A.push(G('zelador', 650, -30, { s: 0.46, expr: hungry ? 'grin' : 'happy', props: { mop: 1 }, pose: { L: [10, 10], R: [30, -70] }, look: [-1, -0.4] }));
      const fx = [bubbleOver(1, { icons: [['pizza', 0, 0, 100]] })];
      SEATS.forEach(([x, y], i) => { if (x === 0 && y === 340) return; const k = pop(f, 1092 + (i % 7) * 2) * 0.55; fx.push({ type: 'thought', x: x + 70, y: y - 520, w: 200, h: 140, hx: x + 20, hy: y - 300, k, icons: [['pizza', 0, 0, 55]] }); });
      return { world: { set: 'class' }, actors: A, fx };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
