// "E se a vida real te desse dicas como num videogame?" — 878 frames
const TOTAL = 878;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const xp = (f, f0, x, y, txt = '+10 PONTOS') => f >= f0 && f < f0 + 30 ? [{ type: 'exclaim', x, y: y - prog(f, f0, f0 + 30) * 120, k: pop(f, f0) * 0.55, txt, a: 1 - prog(f, f0 + 18, f0 + 30) }] : [];
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y]) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy || {}))); return; }
    A.push(G(ALLG[gi++ % ALLG.length], x, y - 12, { sit: true, uniform: true, expr: o.gexpr || 'happy', look: [0, -0.3] }));
  });
  return A;
}

const SHOTS = [
  // 1 — hook: life with a game HUD
  { f0: 0, f1: 91, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 0, x: 0, y: -330, z: 1.3 }, { f: 91, x: 0, y: -340, z: 1.45 }],
    build(f) { return { world: { set: 'street', door: 0 }, actors: [B(0, 330, { expr: 'grin', pose: 'up', hop: Math.abs(Math.sin(f * 0.25)) * 20 })], fx: [{ type: 'hud', x: -330, y: -930, xp: 0.3 + 0.2 * Math.sin(f * 0.05), lvl: 1 }, { type: 'quest', x: 0, y: -720, title: 'NOVA MISSÃO!', k: pop(f, -6, 0) }] }; } },
  // 2 — wake up: mission brush teeth (+10)
  { f0: 92, f1: 248, light: () => 'day', dof: {},
    cam: [{ f: 92, x: -100, y: -500, z: 1.0 }, { f: 248, x: -60, y: -470, z: 1.1 }],
    build(f) {
      const up = f >= 150;
      const w = walkTo(f, 150, 175, [-180, -60], [250, 300]);
      return { world: { set: 'bedroom', sun: sstep(prog(f, 92, 120)) }, actors: [
        up ? B(w.x, w.y, { walk: w.walk, expr: f > 185 ? 'happy' : 'bored', pose: f > 178 ? { L: [12, 6], R: [40, -110] } : 'hang', props: { brush: f > 178 ? 1 : 0 } }) : B(-180, -60, { sit: true, expr: f < 118 ? 'bliss' : 'surprised', look: [0.5, -1] }),
        { type: 'blanket', x: -180, y: 60, layer: 'front' },
      ], fx: [{ type: 'quest', x: -80, y: -1050, w: 760, title: 'MISSÃO', text: 'ESCOVAR OS DENTES', k: pop(f, 134) }].concat(xp(f, 202, 150, -700)) };
    } },
  // 3 — at school: hint, page twelve
  { f0: 249, f1: 358, light: () => 'day', dof: {},
    cam: [{ f: 249, x: 0, y: -330, z: 1.05 }, { f: 358, x: 0, y: -260, z: 1.35 }],
    build(f) { return { world: { set: 'class', board: 'PROVA HOJE' }, actors: classroom(f, { boy: { expr: f > 330 ? 'mischief' : 'surprised', look: [0, -1] } }), fx: [{ type: 'quest', x: 0, y: -760, w: 900, title: 'DICA', text: 'A PROVA CAI A PÁGINA 12', fs: 42, k: pop(f, 270) }] }; } },
  // 4 — you get a ten
  { f0: 359, f1: 408, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 359, x: 0, y: -220, z: 1.6 }, { f: 408, x: 0, y: -230, z: 1.8 }],
    kicks: [{ f: 377, a: 10 }],
    build(f) { return { world: { set: 'class', board: 'PROVA HOJE' }, actors: classroom(f, { boy: { expr: 'proud', pose: 'up' } }), fx: [{ type: 'stamp', x: 0, y: -620, text: 'NOTA 10', k: pop(f, 375, 381) * 0.6 }].concat(xp(f, 380, 0, -380, '+50 PONTOS')) }; } },
  // 5 — recess: an arrow over Sofia: invite her to play
  { f0: 409, f1: 533, light: () => 'day', dof: {},
    cam: [{ f: 409, x: 0, y: -420, z: 0.95 }, { f: 533, x: 150, y: -400, z: 1.1 }],
    build(f) {
      const w = walkTo(f, 495, 525, [-500, 320], [120, 320]);
      return { world: { set: 'hall' }, actors: [B(w.x, w.y, { walk: w.walk, expr: f > 488 ? 'happy' : 'surprised', look: [1, -0.4] }), G('sofia', 420, 300, { uniform: true, expr: 'neutral', pose: 'read', props: { book: 1 }, look: [0, 0.5], flip: -1 })],
        fx: (f >= 442 ? [{ type: 'arrow', x: 420, y: -620 }] : []).concat([{ type: 'quest', x: 120, y: -1000, w: 780, title: 'MISSÃO', text: 'CHAME ELA PRA BRINCAR', fs: 42, k: pop(f, 486) }]) };
    } },
  // 6 — she says yes: mission complete
  { f0: 534, f1: 625, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 534, x: 270, y: -330, z: 1.4 }, { f: 625, x: 270, y: -340, z: 1.55 }],
    build(f) {
      const done = f >= 574;
      return { world: { set: 'hall' }, actors: [B(120, 320, { expr: done ? 'proud' : 'happy', pose: done ? 'up' : 'hang', look: [1, -0.2], hop: done ? Math.max(0, Math.sin((f - 574) * 0.4)) * 30 : 0 }), G('sofia', 420, 300, { uniform: true, expr: 'grin', pose: f > 545 ? 'wave' : 'read', props: { book: f > 545 ? 0 : 1 }, look: [-1, 0], flip: -1 })],
        fx: [{ type: 'speech', x: 470, y: -620, text: 'SIM!', k: pop(f, 546), tx: -20 }].concat(done ? [{ type: 'quest', x: 270, y: -900, title: 'MISSÃO COMPLETA!', col: '#7bd389', k: pop(f, 574) }, { type: 'confetti', n: 30, x0: -400, w: 1300, y0: -1400, h: 1500, f0: 574 }] : []) };
    } },
  // 7 — level up
  { f0: 626, f1: 675, light: () => 'dream', dof: { room: 6 },
    cam: [{ f: 626, x: 120, y: -260, z: 1.7 }, { f: 675, x: 120, y: -260, z: 2.0 }],
    build(f) { const fx = [{ type: 'exclaim', x: 120, y: -560, k: pop(f, 642) * 0.9, txt: 'NÍVEL 2!' }, { type: 'hud', x: -200, y: -760, xp: f < 642 ? 0.95 : 0.1, lvl: f < 642 ? 1 : 2 }]; for (let i = 0; i < 6; i++) { const a = f * 0.15 + i; fx.push({ type: 'sparkle', x: 120 + Math.cos(a) * 230, y: -240 + Math.sin(a) * 120, k: 0.4 }); } return { world: { set: 'hall' }, actors: [B(120, 320, { expr: 'proud', pose: 'up', hop: Math.max(0, Math.sin((f - 640) * 0.3)) * 40 })], fx }; } },
  // 8 — final mission: clean your room
  { f0: 676, f1: 765, light: () => 'day', dof: {},
    cam: [{ f: 676, x: 0, y: -520, z: 0.85 }, { f: 765, x: 0, y: -460, z: 1.0 }],
    kicks: [{ f: 700, a: 10 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [{ type: 'blanket', x: -180, y: 60, layer: 'front' }, { type: 'toys', x: 200, y: 180, n: 22, layer: 'front' }, B(250, 330, { backpack: 1, expr: f > 735 ? 'shocked' : 'worried', sweat: 1, look: [0, -1] })], fx: [{ type: 'quest', x: 0, y: -1080, title: 'MISSÃO FINAL', text: 'ARRUMAR O QUARTO', col: '#ff5fa2', k: pop(f, 698) }] }; } },
  // 9 — you press skip
  { f0: 766, f1: 815, light: () => 'day', dof: { room: 10 },
    cam: [{ f: 766, x: 0, y: -400, z: 1.2 }, { f: 815, x: 0, y: -400, z: 1.3 }],
    kicks: [{ f: 790, a: 16 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [], fx: [{ type: 'skip', x: 0, y: -400, press: f >= 784 && f < 792 ? 1 : 0, locked: f >= 790 }] }; } },
  // 10 — this one can't be skipped
  { f0: 816, f1: TOTAL - 1, light: () => 'day', dof: {},
    cam: [{ f: 816, x: 100, y: -500, z: 0.9 }, { f: TOTAL - 1, x: 160, y: -400, z: 1.15 }],
    build(f) {
      const left = 1 - prog(f, 830, 877);
      return { world: { set: 'bedroom', sun: 1 }, actors: [{ type: 'blanket', x: -180, y: 60, layer: 'front' }, { type: 'toys', x: 200, y: 180, n: 6 + 16 * left, layer: 'front' }, G('mom', 820, 200, { s: 0.48, expr: 'stern', pose: 'hips', look: [-1, 0.3] }), B(250, 330, { expr: 'bored', pose: { L: [30, -100], R: [30, -100] }, props: { pillow: '#3a86ff' }, look: [0, 0.8], tilt: Math.sin(f * 0.2) * 0.05 })],
        fx: [{ type: 'quest', x: 160, y: -1000, w: 760, title: 'NÃO DÁ PRA PULAR', col: '#e63946', k: pop(f, 820) }] };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
