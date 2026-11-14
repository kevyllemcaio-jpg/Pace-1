// "E se você pudesse aprender qualquer coisa na hora?" — 958 frames
const TOTAL = 958;
const FLASHES = [263, 845];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const orbit = (f, x, y, r = 170, n = 5, col) => { const o = []; for (let i = 0; i < n; i++) { const a = f * 0.12 + i * Math.PI * 2 / n; o.push({ type: 'sparkle', x: x + Math.cos(a) * r, y: y + Math.sin(a) * r * 0.5, k: 0.35, col }); } return o; };
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { if (!o.noBoy) A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy || {}))); return; }
    const w = ALLG[gi++ % ALLG.length];
    A.push(G(w, x, y - 12, Object.assign({ sit: true, uniform: true, expr: o.gexpr || 'happy', look: o.glook || [0, -0.3], tilt: Math.sin(f * 0.45 + i) * 0.03 }, o.girl ? o.girl(i, x, y) : {})));
  });
  return A;
}
const bookInsert = (openAt, f0, title, extra = {}) => ({
  light: () => 'day', dof: { room: 8 },
  build(ff) {
    const open = sstep(prog(ff, openAt, openAt + 8));
    return { world: { set: 'library' }, actors: [B(0, 300, { pose: 'read', expr: open > 0.5 ? 'surprised' : 'happy', look: [0, 0.8], props: { tome: Object.assign({ title, open, glow: open, col: extra.col }, extra) } })], fx: open > 0.5 ? orbit(ff, 0, -400, 200, 5) : [] };
  },
});

const SHOTS = [
  // 1 — hook: knowledge pouring in from a glowing book
  { f0: 0, f1: 85, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 0, x: 0, y: -230, z: 1.5 }, { f: 85, x: 0, y: -250, z: 1.7 }],
    build(f) { return { world: { set: 'library' }, actors: [B(0, 300, { pose: 'read', expr: 'shocked', look: [0, -0.2], props: { tome: { open: 1, glow: 1 } } })], fx: orbit(f, 0, -420, 200, 6).concat([{ type: 'lines', x: 0, y: -100, r: 150, k: 0.7 + 0.3 * Math.sin(f * 0.5) }]) }; } },
  // 2 — just open a book: first page and you know everything
  { f0: 86, f1: 213, light: () => 'day', dof: {},
    cam: [{ f: 86, x: 0, y: -300, z: 1.0 }, { f: 213, x: 0, y: -260, z: 1.6 }],
    kicks: [{ f: 178, a: 10 }],
    build(f) {
      const open = sstep(prog(f, 98, 110)), glow = prog(f, 134, 150);
      const know = f >= 176;
      return { world: { set: 'library' }, actors: [B(0, 300, { pose: 'read', expr: know ? 'proud' : open > 0.5 ? 'surprised' : 'happy', look: [0, 0.8], props: { tome: { title: 'LIVRO', open, glow } }, hop: know ? Math.sin(prog(f, 176, 188) * Math.PI) * 30 : 0 })],
        fx: (glow > 0 ? orbit(f, 0, -420, 200, 5) : []).concat(know ? [{ type: 'exclaim', x: 0, y: -560, k: pop(f, 176) * 0.8 }] : []) };
    } },
  // 3a — guitar book
  Object.assign({ f0: 214, f1: 262, cam: [{ f: 214, x: 0, y: -180, z: 2.2 }, { f: 262, x: 0, y: -190, z: 2.4 }] }, bookInsert(248, 214, 'VIOLÃO', { icon: 'note', col: '#e63946' })),
  // 3b — rock star
  { f0: 263, f1: 315, light: () => 'party', dof: {},
    cam: [{ f: 263, x: 0, y: -380, z: 1.05 }, { f: 315, x: 0, y: -360, z: 1.2 }],
    kicks: [{ f: 284, a: 14 }],
    build(f) {
      const A = [B(0, 200, { s: 0.55, pose: { L: [40, -120], R: [30 + Math.sin(f * 1.2) * 20, -60] }, props: { guitar: 1, shades: 1 }, expr: 'grin', hop: Math.abs(Math.sin(f * 0.35)) * 40, tilt: Math.sin(f * 0.35) * 0.1 })];
      ['bia', 'lara', 'rita', 'nina', 'joana'].forEach((w, i) => A.push(G(w, -500 + i * 250, 650, { expr: 'love', pose: 'up', hop: Math.max(0, Math.sin(f * 0.4 + i)) * 30 })));
      return { world: { set: 'stage' }, actors: A, lights: [{ x: 0, y: -300, r: 600, i: 1, col: 'rgba(255,230,150,.3)' }], fx: [{ type: 'note', x: 260, y: -650 - (f % 20) * 8, k: 0.9 }, { type: 'note', x: -260, y: -560 - ((f + 10) % 20) * 8, k: 0.8, col: '#d62839' }] };
    } },
  // 4a — cooking book
  Object.assign({ f0: 316, f1: 344, cam: [{ f: 316, x: 0, y: -180, z: 2.2 }, { f: 344, x: 0, y: -190, z: 2.4 }] }, bookInsert(330, 316, 'CULINÁRIA', { col: '#2a9d8f', icon: 'heart' })),
  // 4b — cake wins the school contest
  { f0: 345, f1: 415, light: () => 'day', dof: {},
    cam: [{ f: 345, x: 0, y: -360, z: 0.88 }, { f: 415, x: -20, y: -330, z: 1.0 }],
    build(f) {
      const won = f >= 364;
      return { world: { set: 'quadra', plain: true, banner: 'CONCURSO DE BOLO' }, actors: [
        { type: 'table', x: 150, y: 330, s: 1, layer: 'front', trays: [] },
        { type: 'cake', x: 150, y: 80, s: 0.9, layer: 'front', medal: won },
        B(-330, 340, { props: { chef: 1 }, expr: won ? 'proud' : 'happy', pose: won ? 'up' : 'hips', hop: won ? Math.max(0, Math.sin((f - 364) * 0.4)) * 30 : 0 }),
        G('diretora', 560, 200, { s: 0.47, expr: won ? 'laugh' : 'happy', pose: won ? 'clap' : 'hang', look: [-1, 0] }),
      ], fx: won && f < 400 ? [{ type: 'confetti', n: 30, x0: -600, w: 1300, y0: -1400, h: 1600, f0: 364 }] : [] };
    } },
  // 5a — magic book
  Object.assign({ f0: 416, f1: 440, cam: [{ f: 416, x: 0, y: -180, z: 2.2 }, { f: 440, x: 0, y: -190, z: 2.4 }] }, bookInsert(428, 416, 'MÁGICA', { col: '#3a0ca3' })),
  // 5b — a rabbit comes out of your backpack
  { f0: 441, f1: 502, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 441, x: 80, y: -250, z: 1.2 }, { f: 502, x: 80, y: -250, z: 1.35 }],
    build(f) {
      const k = pop(f, 448, 458);
      return { world: { set: 'class' }, actors: [
        G('rita', -380, 120, { uniform: true, expr: f > 452 ? 'shocked' : 'happy', look: [1, 0.2] }), G('nina', 560, 140, { uniform: true, expr: f > 452 ? 'shocked' : 'happy', look: [-1, 0.2], flip: -1 }),
        B(-120, 330, { expr: f > 452 ? 'proud' : 'mischief', pose: f > 446 ? { L: [12, 6], R: [100, -30] } : 'hang', look: [1, 0.4] }),
        { type: 'backpack', x: 200, y: 360, layer: 'front' },
        { type: 'rabbit', x: 200, y: 110 - 60 * k, k, s: 0.9, layer: 'front' },
      ], fx: f >= 448 && f < 480 ? orbit(f, 200, -200, 180, 5, '#fff59d') : [] };
    } },
  // 6 — teacher: test tomorrow
  { f0: 503, f1: 605, light: () => 'day', dof: {},
    cam: [{ f: 503, x: -200, y: -450, z: 0.8 }, { f: 605, x: -150, y: -420, z: 0.92 }],
    build(f) {
      const A = classroom(f, { boy: { expr: 'happy', look: [-0.6, -0.4] }, gexpr: f > 556 ? 'worried' : 'happy', glook: [-0.6, -0.4] });
      A.push(G('prof', -620, -10, { s: 0.48, expr: 'happy', pose: f > 520 ? { L: [30, -100], R: [150, 10] } : 'hang', look: [1, 0.3] }));
      return { world: { set: 'class', board: f >= 538 ? 'PROVA AMANHÃ!\nMATEMÁTICA' : 'BOM DIA!' }, actors: A };
    } },
  // 7 — "Easy."
  { f0: 606, f1: 641, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 606, x: 0, y: -170, z: 2.0 }, { f: 641, x: 0, y: -180, z: 2.2 }],
    build(f) { return { world: { set: 'class', board: 'PROVA AMANHÃ!\nMATEMÁTICA' }, actors: classroom(f, { boy: { expr: 'mischief', pose: { L: [150, -55], R: [150, -55] }, props: { shades: 1 }, tilt: -0.12 } }) }; } },
  // 8 — run to the library, grab the biggest book
  { f0: 642, f1: 735, light: () => 'day', dof: {},
    cam: [{ f: 642, x: -500, y: -420, z: 0.9 }, { f: 680, x: 0, y: -450, z: 0.95 }, { f: 735, x: 0, y: -420, z: 1.1 }],
    build(f) {
      const w = walkTo(f, 642, 672, [-1200, 300], [0, 300]);
      const lift = sstep(prog(f, 684, 700));
      const holding = f >= 684;
      return { world: { set: 'library' }, actors: [B(w.x, w.y, { walk: w.walk != null ? w.walk * 1.5 : null, expr: holding ? 'worried' : 'happy', sweat: holding ? 1 : 0, pose: holding ? mixPose('read', 'lift', lift) : 'run', tilt: holding ? Math.sin(f * 0.4) * 0.1 : 0, sq: holding ? 0.06 : 0, props: holding ? { tome: { title: 'O MAIOR\nLIVRO', size: 2.1, col: '#8d0801', fs: 40 } } : {} })] };
    } },
  // 9 — open on the first page
  { f0: 736, f1: 788, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 736, x: 0, y: -420, z: 1.1 }, { f: 788, x: 0, y: -380, z: 1.45 }],
    build(f) {
      const open = sstep(prog(f, 744, 756));
      return { world: { set: 'library' }, actors: [B(0, 300, { pose: 'read', expr: open > 0.5 ? 'bliss' : 'happy', props: { tome: { title: 'O MAIOR\nLIVRO', size: 1.6, col: '#8d0801', fs: 40, open, glow: open } } })], fx: open > 0.5 ? orbit(f, 0, -420, 230, 6) : [] };
    } },
  // 10 — it was a Chinese dictionary
  { f0: 789, f1: 844, light: () => 'day', dof: { room: 8 },
    cam: [{ f: 789, x: 0, y: -330, z: 1.5 }, { f: 798, x: 0, y: -320, z: 2.1, e: 'o' }, { f: 844, x: 0, y: -330, z: 2.2 }],
    kicks: [{ f: 795, a: 14 }],
    build(f) {
      const closed = f >= 793;
      return { world: { set: 'library' }, actors: [B(0, 300, { pose: 'read', expr: f < 793 ? 'bliss' : 'shocked', sweat: closed ? 1 : 0, props: { tome: closed ? { title: '汉语词典\nDICIONÁRIO\nDE CHINÊS', cjk: true, size: 1.6, col: '#c1121f', fs: 34 } : { size: 1.6, open: 1, pageText: ['汉', '语'], glow: 0.4 } } })] };
    } },
  // 11 — in the test you answered everything
  { f0: 845, f1: 918, light: () => 'day', dof: {},
    cam: [{ f: 845, x: 0, y: -330, z: 0.95 }, { f: 918, x: 0, y: -200, z: 1.5 }],
    build(f) {
      const A = classroom(f, { boy: { expr: 'proud', pose: { L: [30, -100], R: [40 + Math.sin(f * 2.2) * 8, -90 + Math.cos(f * 2.2) * 10] }, tilt: Math.sin(f * 0.8) * 0.04 }, gexpr: 'worried', glook: [0, 0.6] });
      return { world: { set: 'class', board: 'PROVA DE\nMATEMÁTICA' }, actors: A, fx: [{ type: 'speed', x: 120, y: -150, dir: 1 }].concat(f > 885 ? [{ type: 'sparkle', x: 160, y: -300, k: 0.4 * Math.sin(prog(f, 885, 905) * Math.PI) }] : []) };
    } },
  // 12 — in Chinese.
  { f0: 919, f1: TOTAL - 1, light: () => 'day', dof: { room: 6 },
    cam: [{ f: 919, x: 0, y: -60, z: 1.25 }, { f: TOTAL - 1, x: 0, y: -40, z: 1.45 }],
    build(f) {
      return { world: { set: 'class', board: 'PROVA DE\nMATEMÁTICA' }, actors: [
        G('prof', 330, 10, { s: 0.48, layer: 'back', expr: f > 928 ? 'shocked' : 'neutral', pose: f > 930 ? 'cheeks' : 'hang', look: [-0.8, 1] }),
        { type: 'paper', x: -30, y: 230, s: 0.9, rot: -0.04, answers: 1 + Math.floor(prog(f, 919, 931) * 3), layer: 'front' },
      ] };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
