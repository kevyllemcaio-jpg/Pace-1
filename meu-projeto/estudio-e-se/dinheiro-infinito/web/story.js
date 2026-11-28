// "E se você tivesse dinheiro infinito?" — 871 frames
const TOTAL = 871;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const rain = (f, x0, w, extra = {}) => Object.assign({ type: 'money', n: 26, x0, w, y0: -1600, h: 2200 }, extra);

const SHOTS = [
  // 1 — hook: money raining, wallet gushing
  { f0: 0, f1: 67, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -260, z: 1.45 }, { f: 67, x: 0, y: -280, z: 1.65 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(0, 300, { pose: 'wallet', props: { wallet: { open: 1 } }, expr: 'grin', hop: Math.abs(Math.sin(f * 0.3)) * 20 })], fx: [rain(f, -700, 1400)] }; } },
  // 2 — every time you open the wallet, another bill
  { f0: 68, f1: 158, light: () => 'day', dof: { room: 7 },
    cam: [{ f: 68, x: 0, y: -260, z: 1.6 }, { f: 100, x: 0, y: -170, z: 2.6 }, { f: 158, x: 0, y: -190, z: 2.7 }],
    build(f) {
      const open = sstep(prog(f, 85, 95));
      const fx = [];
      for (let i = 0; i < 4; i++) { const fp = 110 + i * 12; if (f >= fp) { const t = prog(f, fp, fp + 30); fx.push({ type: 'sparkle', x: 0, y: -110 - t * 260, k: 0.01 }); fx.push({ type: 'bill', fp, t }); } }
      return { world: { set: 'yard' }, actors: [B(0, 300, { pose: 'wallet', props: { wallet: { open } }, expr: f > 112 ? 'grin' : 'happy', look: [0, 0.8] })], fx: fx.filter((e) => e.type !== 'bill'), bills: fx.filter((e) => e.type === 'bill') };
    } },
  // 3 — day one: buy all the candy in the canteen
  { f0: 159, f1: 260, light: () => 'day', dof: {},
    cam: [{ f: 159, x: 0, y: -420, z: 0.85 }, { f: 260, x: 0, y: -400, z: 1.0 }],
    build(f) {
      const bought = prog(f, 195, 230);
      return { world: { set: 'cantina' }, actors: [
        { type: 'counter', x: 0, y: 100, layer: 'back', left: 1 - bought },
        G('prof', 60, -40, { s: 0.48, layer: 'back', expr: bought > 0.5 ? 'shocked' : 'happy', props: { chef: 1 }, look: [0, 1] }),
        B(-80, 420, { pose: 'pillow', props: { candy: bought * 30 }, expr: bought > 0.3 ? 'proud' : 'happy', look: [0, -0.5] }),
      ], fx: f < 200 ? [{ type: 'exclaim', x: 330, y: -500, k: pop(f, 168) * 0.6, txt: 'DIA 1' }] : [] };
    } },
  // 4 — day two: an RC car the size of a real car
  { f0: 261, f1: 392, light: () => 'day', dof: {},
    cam: [{ f: 261, x: 300, y: -350, z: 1.1 }, { f: 345, x: 300, y: -380, z: 1.0 }, { f: 362, x: 500, y: -650, z: 0.6, e: 'o' }, { f: 392, x: 520, y: -650, z: 0.62 }],
    build(f) {
      const drive = easeOut(prog(f, 295, 330));
      const big = sstep(prog(f, 346, 360));
      return { world: { set: 'street', door: 0 }, actors: [
        B(-100, 380, { pose: 'remote', props: { controller: 1 }, expr: big > 0.5 ? 'shocked' : 'grin', look: [1, 0.2] }),
        { type: 'rccar', x: lerp(1800, 600, drive), y: 420, s: lerp(0.35, 1.6, big), spin: f * 0.6 * (drive < 1 ? 1 : 0.1), layer: 'front' },
      ], fx: f < 300 ? [{ type: 'exclaim', x: 380, y: -620, k: pop(f, 266) * 0.6, txt: 'DIA 2' }] : (drive < 1 ? [{ type: 'dust', x: lerp(1800, 600, drive) + 300, y: 420, k: 0.8, a: 0.7 }] : []) };
    } },
  // 5 — day three: a pool of coins in the backyard
  { f0: 393, f1: 487, light: () => 'day', dof: {},
    cam: [{ f: 393, x: -300, y: -500, z: 0.7 }, { f: 487, x: -500, y: -380, z: 0.95 }],
    build(f) {
      return { world: { set: 'yard', pool: true }, actors: [B(-900, 120, { s: 0.5, expr: 'proud', pose: 'up', look: [1, 0.3] })], fx: f < 430 ? [{ type: 'exclaim', x: 0, y: -900, k: pop(f, 398) * 0.8, txt: 'DIA 3' }] : [] };
    } },
  // 6 — dive? it hurt a lot
  { f0: 488, f1: 564, light: () => 'day', dof: {},
    cam: [{ f: 488, x: -600, y: -320, z: 1.0 }, { f: 512, x: -250, y: -150, z: 1.1 }, { f: 564, x: -120, y: -60, z: 1.3 }],
    kicks: [{ f: 520, a: 22 }],
    build(f) {
      const t = prog(f, 494, 519);
      let b;
      if (f < 494) b = B(-900, 120, { expr: 'grin', pose: 'up', sq: 0.1 * prog(f, 488, 494) });
      else if (f < 520) b = B(lerp(-900, -320, t), lerp(120, 420, t) - Math.sin(t * Math.PI) * 450, { expr: 'bliss', pose: 'up', rot: t * 2.6, noShadow: true });
      else b = B(-320, 420, { expr: f < 526 ? 'shocked' : 'squint', pose: 'fallen', rot: 1.45, noShadow: true, sq: sqLandLocal(f, 520) });
      const fx = [];
      if (f >= 520) for (let i = 0; i < 3; i++) fx.push({ type: 'sparkle', x: -60 + Math.cos(f * 0.3 + i * 2) * 90, y: 300 + Math.sin(f * 0.3 + i * 2) * 25, k: 0.35 });
      if (f >= 520 && f < 534) fx.push({ type: 'lines', x: -150, y: 380, r: 120, k: 1 - prog(f, 520, 534) });
      return { world: { set: 'yard', pool: true }, actors: [b], fx };
    } },
  // 7 — you spent so much that money lost its value
  { f0: 565, f1: 658, light: () => 'day', dof: {},
    cam: [{ f: 565, x: 420, y: -480, z: 0.78 }, { f: 658, x: 440, y: -460, z: 0.85 }],
    build(f) {
      const gray = f >= 616;
      return { world: { set: 'street', door: 0 }, actors: [
        { type: 'barrow', x: 420, y: 400, layer: 'front', gray },
        B(0, 380, { expr: gray ? 'worried' : 'proud', pose: gray ? 'cheeks' : 'hips', look: [1, -0.4] }),
        { type: 'icecart', x: 900, y: 300, price: f < 600 ? 'R$ 2' : f < 625 ? 'R$ 200' : 'R$ 9.000', layer: 'back' },
      ], fx: [rain(f, -800, 1800, { gray, wind: gray ? 1 : 0 })] };
    } },
  // 8 — an ice cream now costs a million
  { f0: 659, f1: 731, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 659, x: 620, y: -480, z: 0.95 }, { f: 731, x: 640, y: -500, z: 1.05 }],
    kicks: [{ f: 700, a: 12 }],
    build(f) {
      return { world: { set: 'street', door: 0 }, actors: [
        { type: 'icecart', x: 900, y: 300, price: f < 698 ? 'R$ 9.000' : 'R$ 1.000.000', layer: 'back' },
        G('zelador', 1150, 260, { s: 0.48, expr: 'happy', pose: 'hips', look: [-1, 0] }),
        { type: 'barrow', x: 420, y: 420, layer: 'front', gray: true },
        B(200, 400, { expr: f > 700 ? 'shocked' : 'worried', sweat: 1, pose: 'pillow', look: [1, -0.4] }),
      ], fx: f >= 700 && f < 716 ? [{ type: 'exclaim', x: 860, y: -900, k: pop(f, 700) * 0.8 }] : [] };
    } },
  // 9 — in the end the richest person in town was your neighbour
  { f0: 732, f1: 820, light: () => 'gold', dof: {},
    cam: [{ f: 732, x: 0, y: -420, z: 0.8 }, { f: 820, x: 300, y: -380, z: 1.0 }],
    build(f) {
      const A = [G('zelador', 560, 120, { s: 0.48, props: { crown: f >= 786 ? 1 : 0 }, expr: f >= 786 ? 'proud' : 'happy', pose: 'hips', look: [-0.6, 0] })];
      ALLG.slice(0, 6).forEach((w, i) => { const p = walkTo(f, 740 + i * 4, 780 + i * 4, [-900 - i * 150, 300 + (i % 2) * 120], [-150 + i * 90, 300 + (i % 2) * 120]); A.push(G(w, p.x, p.y, { walk: p.walk, expr: 'worried', pose: 'letter', props: {}, look: [1, -0.3] })); });
      A.push(B(-500, 520, { expr: 'bored', pose: 'hang', look: [1, -0.5] }));
      return { world: { set: 'yard' }, actors: A, fx: f >= 786 && f < 806 ? [{ type: 'sparkle', x: 560, y: -500, k: 0.6 * Math.sin(prog(f, 786, 806) * Math.PI) }] : [] };
    } },
  // 10 — he had a chicken
  { f0: 821, f1: TOTAL - 1, light: () => 'gold', dof: { room: 3 },
    cam: [{ f: 821, x: 560, y: -300, z: 1.15 }, { f: TOTAL - 1, x: 600, y: -220, z: 1.5 }],
    build(f) {
      return { world: { set: 'yard' }, actors: [
        G('zelador', 520, 120, { s: 0.48, props: { crown: 1 }, expr: 'proud', pose: 'hips', look: [0.6, 0.6] }),
        { type: 'chicken', x: 700, y: 200, s: 0.75, layer: 'front' },
        { type: 'egg', x: 640, y: 210, k: pop(f, 838, 848), layer: 'front' },
      ], fx: f >= 838 ? [{ type: 'sparkle', x: 640, y: 60, k: 0.5 * (0.6 + 0.4 * Math.sin(f * 0.4)) }, { type: 'sparkle', x: 720, y: 0, k: 0.3 }] : [] };
    } },
];
function sqLandLocal(f, fl) { return f >= fl ? Math.exp(-(f - fl) / 3) * Math.cos((f - fl) * 0.9) * 0.18 : 0; }
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
// bills popping from the wallet (shot 2) — drawn via fx hook
const _drawFx5 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx5(ctx, fx, f);
  const sh = shotAt(f);
  if (sh.f0 === 68) for (let i = 0; i < 4; i++) { const fp = 110 + i * 12; if (f >= fp) { const t = prog(f, fp, fp + 30); bill(ctx, (i % 2 ? 1 : -1) * t * 120, -230 - easeOut(t) * 330, (i % 2 ? 1 : -1) * t * 0.8, 0.9 * backOut(clamp(t * 3))); } }
};
