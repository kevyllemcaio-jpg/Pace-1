// "E se você pudesse controlar a sua sorte?" — 800 frames
const TOTAL = 800;
const FLASHES = [516];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const sparkles = (f, x, y, r = 200, n = 5, col) => { const o = []; for (let i = 0; i < n; i++) { const a = f * 0.12 + i * Math.PI * 2 / n; o.push({ type: 'sparkle', x: x + Math.cos(a) * r, y: y + Math.sin(a) * r * 0.5, k: 0.35, col }); } return o; };
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy || {}))); return; }
    A.push(G(ALLG[gi++ % ALLG.length], x, y - 12, Object.assign({ sit: true, uniform: true, expr: o.gexpr || 'happy', look: [0, -0.3] }, o.girl ? o.girl(i) : {})));
  });
  return A;
}
const gaugeShot = (f0, f1, vf) => ({ f0, f1, light: () => 'day', dof: { room: 10 },
  cam: [{ f: f0, x: 0, y: -300, z: 1.4 }, { f: f1, x: 0, y: -300, z: 1.5 }],
  build(f) { const v = vf(f); return { world: { set: 'street', door: 0 }, actors: [], fx: [{ type: 'gauge', x: 0, y: -300, r: 340, v }].concat(v >= 100 ? sparkles(f, 0, -300, 420, 7, '#fff59d') : []) }; } });

const SHOTS = [
  // 1 — hook: the luck dial on your wrist
  { f0: 0, f1: 78, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 0, x: -40, y: -230, z: 1.6 }, { f: 78, x: -40, y: -240, z: 1.8 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [B(0, 300, { pose: 'watch', props: { dial: 100 }, expr: 'grin', look: [-0.8, 0.4] })], fx: sparkles(f, -60, -250, 220, 6, '#fff59d').concat([{ type: 'clover', x: -230, y: -480 + Math.sin(f * 0.1) * 20, r: 50 }, { type: 'clover', x: 200, y: -560 + Math.cos(f * 0.1) * 20, r: 40 }]) }; } },
  // 2 — a dial from zero to a hundred
  gaugeShot(79, 157, (f) => f < 118 ? 50 : f < 127 ? lerp(50, 0, prog(f, 118, 124)) : lerp(0, 100, easeOut(prog(f, 127, 140)))),
  // 3 — at 10 you find a coin
  { f0: 158, f1: 234, light: () => 'day', dof: {},
    cam: [{ f: 158, x: 0, y: -280, z: 1.2 }, { f: 234, x: 60, y: -200, z: 1.5 }],
    build(f) {
      const found = f >= 195, pick = sstep(prog(f, 200, 212));
      return { world: { set: 'street', door: 0 }, actors: [
        B(0, 300, { pose: f < 176 ? 'watch' : found ? mixPose('hang', { L: [12, 6], R: [150, 20] }, pick) : 'hang', props: { dial: 10 }, expr: found ? 'happy' : 'neutral', look: [0.6, 0.8], bob: f > 186 && f < 200 ? 30 : 0 }),
        { type: 'coinfloor', x: 220, y: 330, k: pick > 0.5 ? 0 : 1, layer: 'front' },
      ], fx: found && f < 225 ? [{ type: 'sparkle', x: 220, y: 280, k: 0.5 * Math.sin(prog(f, 195, 225) * Math.PI) }] : [] };
    } },
  // 4 — at 50 you win the school raffle
  { f0: 235, f1: 308, light: () => 'gold', dof: {},
    cam: [{ f: 235, x: 100, y: -420, z: 0.95 }, { f: 308, x: 60, y: -380, z: 1.2 }],
    build(f) {
      const won = f >= 262;
      return { world: { set: 'stage', banner: 'RIFA DA ESCOLA' }, actors: [
        G('diretora', 260, 190, { s: 0.48, expr: 'happy', pose: won ? 'clap' : { L: [12, 6], R: [130, 10] }, look: [-1, 0] }),
        B(-150, 200, { s: 0.52, props: won ? { dial: 50, trophy: pop(f, 262) } : { dial: 50 }, pose: won ? 'pillow' : 'watch', expr: won ? 'proud' : 'happy', hop: won ? Math.max(0, Math.sin((f - 262) * 0.4)) * 30 : 0 }),
      ], fx: won ? [{ type: 'confetti', n: 30, x0: -700, w: 1400, y0: -1400, h: 1700, f0: 262 }] : [] };
    } },
  // 5 — at 90 the teacher cancels the test
  { f0: 309, f1: 390, light: () => 'day', dof: {},
    cam: [{ f: 309, x: -150, y: -460, z: 0.8 }, { f: 390, x: -100, y: -420, z: 0.9 }],
    build(f) {
      const cancel = f >= 346;
      const A = classroom(f, { boy: { expr: cancel ? 'proud' : 'mischief', pose: 'watch', props: { dial: 90 } }, gexpr: cancel ? 'grin' : 'worried', girl: (i) => ({ hop: cancel ? Math.max(0, Math.sin(f * 0.4 + i)) * 12 : 0, pose: cancel && i % 2 ? 'up' : 'hang' }) });
      A.push(G('prof', -620, -10, { s: 0.48, expr: 'happy', pose: cancel ? { L: [12, 6], R: [150, 10] } : 'hang', look: [1, 0.3] }));
      return { world: { set: 'class', board: cancel ? 'PROVA\nCANCELADA!' : 'PROVA HOJE' }, actors: A };
    } },
  // 6 — then you crank it up to a hundred
  { f0: 391, f1: 449, light: () => 'day', dof: { room: 6 },
    cam: [{ f: 391, x: -60, y: -240, z: 1.7 }, { f: 449, x: -60, y: -250, z: 2.1, r: 3 }],
    build(f) { const v = lerp(90, 100, sstep(prog(f, 404, 422))); return { world: { set: 'street', door: 0 }, actors: [B(0, 300, { pose: 'crank', props: { dial: v }, expr: v >= 100 ? 'grin' : 'mischief', look: [-0.8, 0.5] })], fx: v >= 100 ? sparkles(f, -60, -250, 240, 7, '#fff59d') : [] }; } },
  // 7 — money rain, golden meteor in the backyard
  { f0: 450, f1: 562, light: () => 'day', dof: {},
    cam: [{ f: 450, x: 0, y: -450, z: 0.85 }, { f: 512, x: 200, y: -600, z: 0.7 }, { f: 562, x: 250, y: -500, z: 0.8 }],
    kicks: [{ f: 516, a: 30 }],
    build(f) {
      const fx = [];
      if (f >= 462) fx.push({ type: 'money', n: 26, x0: -900, w: 2000, y0: -1600, h: 2200 });
      if (f >= 490 && f < 516) { const t = prog(f, 490, 516); fx.push({ type: 'meteor', x: lerp(-200, 500, t), y: lerp(-1900, 320, t) }); }
      if (f >= 516 && f < 532) fx.push({ type: 'dust', x: 500, y: 330, k: 2.5, a: 1 - prog(f, 516, 532) }, { type: 'lines', x: 500, y: 200, r: 250, k: 1 - prog(f, 516, 532) });
      const A = [B(-350, 320, { expr: f < 516 ? 'grin' : 'shocked', pose: f < 516 ? 'up' : 'cheeks', props: { dial: 100 }, look: [1, -0.6], hop: f >= 516 && f < 528 ? Math.sin(prog(f, 516, 528) * Math.PI) * 50 : 0 })];
      if (f >= 516) A.push({ type: 'goldrock', x: 500, y: 330, glow: 1, layer: 'front' });
      return { world: { set: 'yard' }, actors: A, fx };
    } },
  // 8 — but luck has to come from somewhere
  { f0: 563, f1: 631, light: () => 'day', dof: {},
    cam: [{ f: 563, x: 0, y: -500, z: 0.8 }, { f: 631, x: 900, y: -480, z: 0.9 }],
    build(f) {
      return { world: { set: 'yard' }, actors: [
        { type: 'goldrock', x: 0, y: 330, glow: 1, layer: 'front' },
        B(-450, 320, { expr: 'mischief', props: { dial: 100 }, pose: 'watch', look: [1, 0] }),
        G('zelador', 1150, 200, { s: 0.48, expr: 'worried', pose: 'hang', look: [-1, 0] }),
      ], fx: [{ type: 'stream', x0: 1150, y0: -320, x1: -400, y1: -300 }] };
    } },
  // 9 — the neighbour: gum, cap, pigeon
  { f0: 632, f1: 750, light: () => 'day', dof: {},
    cam: [{ f: 632, x: 0, y: -380, z: 1.1 }, { f: 750, x: 20, y: -340, z: 1.3 }],
    build(f) {
      const w = walkTo(f, 632, 660, [-700, 330], [0, 330]);
      const stuck = f >= 660;
      const capT = prog(f, 682, 712);
      const splat = f >= 718;
      const A = [G('zelador', w.x, 330, { s: 0.5, walk: w.walk, expr: !stuck ? 'happy' : splat ? 'shocked' : capT > 0 ? 'surprised' : 'worried', capOff: capT > 0, props: { splat: splat ? 1 : 0 }, pose: stuck && !splat ? 'hang' : splat ? 'cheeks' : 'hang', look: [0, stuck ? 1 : 0] })];
      A.push({ type: 'gum', x: 30, y: 335, stretch: stuck, dx: stuck ? -20 : 0, dy: stuck ? -30 - 10 * Math.sin(f * 0.3) : 0, layer: 'front' });
      if (capT > 0 && capT < 1) A.push({ type: 'cap', x: lerp(0, 900, capT), y: lerp(-470, -1200, capT) + Math.sin(capT * 12) * 40, rot: capT * 8, layer: 'front' });
      if (f >= 700) { const t = prog(f, 700, 735); A.push({ type: 'pigeon', x: lerp(-900, 900, t), y: -1100 + Math.sin(t * 6) * 30, s: 1, layer: 'front' }); }
      const fx = [];
      if (f >= 712 && f < 718) { const t = prog(f, 712, 718); fx.push({ type: 'sparkle', x: 0, y: lerp(-1050, -520, t), k: 0.01 }); }
      if (splat && f < 735) fx.push({ type: 'lines', x: 0, y: -520, r: 130, k: 1 - prog(f, 718, 735) });
      return { world: { set: 'street', door: 0 }, actors: A, fx };
    } },
  // 10 — all at the same time
  { f0: 751, f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 751, x: 260, y: -380, z: 0.95 }, { f: TOTAL - 1, x: 260, y: -330, z: 1.2 }],
    build(f) {
      return { world: { set: 'street', door: 0 }, actors: [
        G('zelador', 0, 330, { s: 0.5, expr: 'squint', capOff: true, props: { splat: 1 }, pose: 'hang', look: [0, 0] }),
        { type: 'gum', x: 30, y: 335, stretch: true, dx: -20, dy: -30, layer: 'front' },
        B(520, 360, { expr: 'worried', sweat: 1, pose: 'pillow', props: { dial: 100, trophy: 0.6 }, look: [-1, -0.3], tilt: 0.1 }),
      ] };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
// the pigeon drop
const _drawFx6 = drawFx;
drawFx = function (ctx, fx, f) { _drawFx6(ctx, fx, f); if (f >= 712 && f < 718) { const t = prog(f, 712, 718); ell(ctx, 0, lerp(-1050, -520, t), 18, 24); paint(ctx, '#ffffff', INK, wink(0.6)); } };
