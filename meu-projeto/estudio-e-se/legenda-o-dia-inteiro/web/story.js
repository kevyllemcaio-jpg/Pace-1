// "E se os seus pensamentos aparecessem como legenda o dia inteiro?" — 1140 frames @30fps
const TOTAL = 1140;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 56, k: pop(f, f0), tx: 0 }, o)] : []);
const leg = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'legenda', x, y, text, fs: 56, k: pop(f, f0) }, o)] : []);
CAST.pedro = { skin: '#c98e66', hair: 'cap', hc: '#e63946', pj: '#3a86ff', pj2: '#9cc5ff', pat: 'none', pants: '#2b2d42', slip: '#ffffff', hand: '#c98e66' };
const _drawProp20 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'desenho') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0); rr(ctx, -230, -170, 460, 340, 10); paint(ctx, '#ffffff', INK, wink()); ell(ctx, 0, 10, 150, 95, 0.3); paint(ctx, '#c08552', INK, wink()); for (const [x, y] of [[-60, -20], [40, 40], [70, -30]]) { ell(ctx, x, y, 12, 9); paint(ctx, '#8a5a2b'); } ctx.fillStyle = '#1c1222'; ctx.font = '700 44px "Comic Sans MS", cursive'; ctx.textAlign = 'center'; ctx.fillText('MEU CACHORRO', 0, 150); ctx.restore(); return; }
  _drawProp20(ctx, a, f);
};
const SEATS = [];
[[110, [-380, 0, 380, 760]], [340, [-410, 0, 410, 820]], [580, [-440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const MATES = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'];
function room(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => { A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' }); if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy))); return; } const w = MATES[gi++ % MATES.length]; A.push(G(w, x, y - 12, { sit: true, uniform: true, expr: o.mates || 'happy', look: [clamp(-x / 500, -1, 1), 0.2], tilt: Math.sin(f * 0.4 + i) * (o.mates === 'laugh' ? 0.06 : 0.02) })); });
  A.push(G('prof', -900, 330, Object.assign({ flip: 1, expr: 'happy', look: [1, 0], pose: 'hang' }, o.p)));
  return A;
}

const SHOTS = [
  // 1 — hook
  { f0: 0, f1: 115, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -430, z: 1.4 }, { f: 115, x: 0, y: -440, z: 1.55 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(0, 330, { expr: f < 60 ? 'grin' : 'worried', pose: 'hips', sweat: f > 60 ? 1 : 0 })], fx: say(f, 14, 0, -760, 'TÁ TUDO BEM! 👍').concat(leg(f, 52, 0, -1020, 'NADA TÁ BEM 😭', { fs: 60 })), screen: tag(f, 70, 115, 'LEGENDA NA VIDA REAL?!', 1680) }; } },
  // 2 — mom: did you brush your teeth?
  { f0: 116, f1: 204, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 116, x: 110, y: -520, z: 0.95 }, { f: 204, x: 110, y: -540, z: 1.02 }],
    build(f) { return { world: { set: 'bedroom' }, actors: [B(-260, 330, { expr: 'happy', look: [1, -0.3] }), G('mom', 480, 320, { flip: -1, expr: 'neutral', look: [-1, 0.3], pose: 'hips' })], fx: say(f, 128, 480, -1250, 'ESCOVOU\nOS DENTES?', { tx: 60 }) }; } },
  // 3 — "I did!"
  { f0: 205, f1: 269, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 205, x: -260, y: -360, z: 1.4 }, { f: 269, x: -260, y: -370, z: 1.55 }],
    build(f) { return { world: { set: 'bedroom' }, actors: [B(-260, 330, { expr: 'innocent', look: [1, -0.3], pose: 'hang' })], fx: say(f, 230, -260, -820, 'ESCOVEI! 😁') }; } },
  // 4 — subtitle: LIE.
  { f0: 270, f1: 327, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 270, x: 100, y: -520, z: 0.95 }, { f: 327, x: 100, y: -530, z: 1.0 }],
    kicks: [{ f: 290, a: 8 }],
    build(f) { return { world: { set: 'bedroom' }, actors: [B(-260, 330, { expr: f < 290 ? 'innocent' : 'shocked', look: [0, -1], sweat: f > 290 ? 1 : 0 }), G('mom', 480, 320, { flip: -1, expr: f < 292 ? 'neutral' : 'stern', look: [-1, 0.3], pose: 'hips' })], fx: leg(f, 288, 60, -950, 'MENTIRA.', { fs: 110 }) }; } },
  // 5 — teacher: did you study for the test?
  { f0: 328, f1: 432, light: () => 'day', dof: {},
    cam: [{ f: 328, x: -420, y: -380, z: 0.85 }, { f: 432, x: -400, y: -390, z: 0.95 }],
    build(f) { return { world: { set: 'class', board: 'PROVA\nHOJE' }, actors: room(f, { boy: { expr: 'happy', look: [-1, 0] } }), fx: say(f, 362, -560, -1000, 'ESTUDOU\nPRA PROVA?', { tx: -80 }) }; } },
  // 6 — "a lot!"
  { f0: 433, f1: 493, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 433, x: 0, y: -340, z: 1.55 }, { f: 493, x: 0, y: -350, z: 1.7 }],
    build(f) { return { world: { set: 'class', board: 'PROVA\nHOJE' }, actors: room(f, { boy: { expr: 'proud', look: [-1, 0], pose: 'hips' } }), fx: say(f, 455, 0, -760, 'MUITO! 📚') }; } },
  // 7 — subtitle: played games until 3 a.m.
  { f0: 494, f1: 578, light: () => 'day', dof: { room: 2 },
    cam: [{ f: 494, x: -200, y: -380, z: 1.0 }, { f: 578, x: -200, y: -390, z: 1.1 }],
    build(f) { return { world: { set: 'class', board: 'PROVA\nHOJE' }, actors: room(f, { boy: { expr: f < 520 ? 'proud' : 'shocked', look: [0, -1], sweat: f > 520 ? 1 : 0 }, mates: f > 530 ? 'laugh' : 'happy', p: { expr: f > 525 ? 'squint' : 'happy' } }), fx: leg(f, 515, -40, -900, 'JOGUEI ATÉ AS\n3 DA MANHÃ 🎮', { fs: 58 }) }; } },
  // 8 — your friend shows his drawing
  { f0: 579, f1: 649, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 579, x: 0, y: -420, z: 1.0 }, { f: 649, x: 0, y: -430, z: 1.1 }],
    build(f) { const up = sstep(prog(f, 600, 614)); return { world: { set: 'yard' }, actors: [B(-330, 330, { expr: 'happy', look: [1, 0] }), G('pedro', 330, 320, { flip: -1, expr: 'proud', look: [-1, 0], pose: { L: [lerp(12, 80, up), lerp(6, -20, up)], R: [lerp(12, 80, up), lerp(6, -20, up)] } }), { type: 'desenho', x: 280, y: lerp(-40, -330, up), rot: -0.05, layer: 'front' }] }; } },
  // 9 — "it's beautiful"
  { f0: 650, f1: 715, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 650, x: -330, y: -360, z: 1.45 }, { f: 715, x: -330, y: -370, z: 1.6 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(-330, 330, { expr: 'grin', look: [1, 0], pose: { L: [12, 6], R: [95, -60] } }), { type: 'desenho', x: 280, y: -330, rot: -0.05, layer: 'front' }], fx: say(f, 672, -330, -820, 'FICOU LINDO! 🤩') }; } },
  // 10 — subtitle: looks like a potato
  { f0: 716, f1: 787, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 716, x: 0, y: -420, z: 1.0 }, { f: 787, x: 0, y: -430, z: 1.08 }],
    kicks: [{ f: 737, a: 8 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(-330, 330, { expr: f < 737 ? 'grin' : 'shocked', look: [0, -1], sweat: f > 737 ? 1 : 0 }), G('pedro', 330, 320, { flip: -1, expr: f < 745 ? 'proud' : 'worried', look: [-1, -0.6], pose: { L: [80, -20], R: [80, -20] } }), { type: 'desenho', x: 280, y: -330, rot: -0.05, layer: 'front' }], fx: leg(f, 735, -100, -950, 'PARECE UMA\nBATATA 🥔', { fs: 62 }) }; } },
  // 11 — your crush: want to sit with me at lunch?
  { f0: 788, f1: 898, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 788, x: 0, y: -420, z: 0.95 }, { f: 898, x: 50, y: -440, z: 1.08 }],
    build(f) { return { world: { set: 'cantina' }, actors: [B(-330, 330, { expr: 'surprised', look: [1, 0] }), G('sofia', 330, 320, { flip: -1, uniform: true, expr: 'happy', look: [-1, 0], pose: 'hang' })], fx: say(f, 812, 160, -1050, 'QUER SENTAR\nCOMIGO NO LANCHE?', { fs: 52, tx: 60 }).concat(f > 820 ? [{ type: 'hearts', x: -330, y: -600, n: 3 }] : []) }; } },
  // 12 — "whatever" (playing it cool)
  { f0: 899, f1: 973, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 899, x: -330, y: -360, z: 1.45 }, { f: 973, x: -330, y: -370, z: 1.6 }],
    build(f) { return { world: { set: 'cantina' }, actors: [B(-330, 330, { expr: 'mischief', look: [1, 0], pose: 'hips' })], fx: say(f, 928, -330, -820, 'TANTO FAZ 😎') }; } },
  // 13 — subtitle: the happiest day of my life
  { f0: 974, f1: 1060, light: () => 'dream', dof: { room: 3 },
    cam: [{ f: 974, x: 0, y: -440, z: 0.95 }, { f: 1060, x: 0, y: -450, z: 1.05 }],
    build(f) { return { world: { set: 'cantina' }, actors: [B(-330, 330, { expr: f < 997 ? 'mischief' : 'love', look: [1, 0], pose: f < 997 ? 'hips' : 'cheeks' }), G('sofia', 330, 320, { flip: -1, uniform: true, expr: 'happy', look: [-1, -0.8], pose: 'hang' })], fx: leg(f, 995, -150, -1000, 'O DIA MAIS FELIZ\nDA MINHA VIDA ❤', { fs: 56 }).concat(f > 1000 ? [{ type: 'hearts', x: -330, y: -600, n: 6 }] : []) }; } },
  // 14 — she read it. And smiled.
  { f0: 1061, f1: TOTAL - 1, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 1061, x: 330, y: -380, z: 1.5 }, { f: 1099, x: 330, y: -390, z: 1.6 }, { f: 1104, x: 0, y: -420, z: 1.0 }, { f: TOTAL - 1, x: 0, y: -430, z: 1.1 }],
    build(f) { return { world: { set: 'cantina' }, actors: [B(-330, 330, { expr: 'love', look: [1, 0], pose: 'cheeks' }), G('sofia', 330, 320, { flip: -1, uniform: true, expr: f < 1099 ? 'surprised' : 'bliss', look: [-1, -0.6], pose: f < 1099 ? 'hang' : 'cheeks' })], fx: [{ type: 'hearts', x: 0, y: -620, n: 8, k: prog(f, 1099, 1110) }], screen: tag(f, 1102, TOTAL, 'ELA LEU 😳❤', 1500) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
