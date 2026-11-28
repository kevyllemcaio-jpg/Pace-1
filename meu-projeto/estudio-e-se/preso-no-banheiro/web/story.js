// "E se você ficasse preso no banheiro das meninas?" — 1080 frames @30fps
const TOTAL = 1080;
const FLASHES = [735];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 46, k: pop(f, f0) * (o.f1 ? 1 - prog(f, o.f1 - 5, o.f1) : 1), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const chatty = (f, i) => [Math.sin(f * 0.05 + i * 2) > 0 ? 1 : -1, 0];
// the stall interior: boy standing on the toilet seat (hop) or on the floor
function stall(f, o) { return [{ type: 'toilet', x: 0, y: 230, s: 0.62, splash: o.splash }, B(o.x || 0, 330, Object.assign({ hop: o.up ? 345 : 0 }, o.boy))]; }
const TRIO = (f, o = {}) => [
  G('bia', -1700, 300, Object.assign({ expr: 'happy', look: chatty(f, 0), pose: 'hang', flip: 1 }, o.bia)),
  G('lara', -1250, 320, Object.assign({ expr: 'grin', look: chatty(f, 1), pose: 'hips' }, o.lara)),
  G('rita', -800, 300, Object.assign({ expr: 'happy', look: chatty(f, 2), pose: 'hang', flip: -1 }, o.rita)),
];
// classroom (next day)
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'];
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy))); return; }
    const w = ALLG[gi++ % ALLG.length]; const lx = clamp((0 - x) / 500, -1, 1);
    A.push(G(w, x, y - 12, { sit: true, uniform: true, expr: i % 2 ? 'laugh' : 'grin', look: [lx, 0.3], pose: i % 3 === 0 ? 'point' : 'hang', flip: x > 0 ? -1 : 1, tilt: Math.sin(f * 0.45 + i) * 0.05 }));
  });
  return A;
}

const SHOTS = [
  // 1 — hook: hiding on the toilet in the girls' bathroom
  { f0: 0, f1: 97, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 0, x: 0, y: -420, z: 1.2 }, { f: 97, x: 0, y: -440, z: 1.4 }],
    build(f) { return { world: { set: 'stall' }, actors: stall(f, { up: true, boy: { expr: 'scared', sweat: 1, pose: 'boo', look: [Math.sin(f * 0.12), 0.3] } }), fx: f > 20 ? [{ type: 'fear', x: 0, y: -830, k: 1 }] : [], screen: tag(f, 12, 97, 'PRESO AQUI?!', 230) }; } },
  // 2 — ran in without reading the sign
  { f0: 98, f1: 176, light: () => 'day', dof: {},
    cam: [{ f: 98, x: -500, y: -560, z: 0.78 }, { f: 140, x: -640, y: -640, z: 0.85 }, { f: 176, x: -680, y: -900, z: 1.15 }],
    kicks: [{ f: 144, a: 8 }],
    build(f) { const w = walkTo(f, 98, 150, [400, 300], [-680, 120]); const A = f < 152 ? [B(w.x, w.y, { walk: w.walk ? w.walk * 1.6 : null, expr: 'scared', pose: { L: [40, 60], R: [40, 60] }, sweat: 1, look: [-1, 0], flip: -1 })] : [];
      return { world: { set: 'hall' }, actors: A, fx: f >= 140 ? [{ type: 'exclaim', x: -680, y: -1260, k: pop(f, 140) * 0.8 }, { type: 'lines', x: -680, y: -1080, r: 200, k: 1 - prog(f, 140, 170) }] : [], screen: tag(f, 140, 176, 'NEM LEU A PLACA', 300) }; } },
  // 3 — about to leave... the bathroom door opens
  { f0: 177, f1: 247, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 177, x: 0, y: -320, z: 1.1 }, { f: 215, x: 0, y: -330, z: 1.15 }, { f: 222, x: 0, y: -400, z: 1.5, e: 'o' }, { f: 247, x: 0, y: -410, z: 1.6 }],
    kicks: [{ f: 218, a: 9 }],
    build(f) { const reach = f > 188 && f < 218 ? sstep(prog(f, 188, 200)) : 0; return { world: { set: 'stall' }, actors: stall(f, { boy: { expr: f < 218 ? 'happy' : 'shocked', pose: { L: [12, 6], R: [lerp(12, 100, reach), lerp(6, -20, reach)] }, look: [0, 0], sweat: f > 225 ? 1 : 0 } }), fx: f >= 218 ? [{ type: 'exclaim', x: 0, y: -720, k: pop(f, 218) * 0.8 }] : [] }; } },
  // 4 — three girls walk in chatting (his feet show under the stall door)
  { f0: 248, f1: 314, light: () => 'day', dof: {},
    cam: [{ f: 248, x: -650, y: -420, z: 0.45 }, { f: 314, x: -600, y: -420, z: 0.47 }],
    build(f) { const A = [0, 1, 2].map((i) => { const w = walkTo(f, 248 + i * 6, 290 + i * 6, [-2600 - i * 260, 300 + i * 10], [[-1700, 300], [-1250, 320], [-800, 300]][i]); return G(['bia', 'lara', 'rita'][i], w.x, w.y, { walk: w.walk, expr: ['happy', 'grin', 'laugh'][i], look: chatty(f, i), flip: 1 }); });
      return { world: { set: 'wc', occupied: 1, feet: 1 }, actors: A, fx: [{ type: 'note', x: -1250, y: -900, a: 0.8, k: 0.6 }] }; } },
  // 5 — you climb on the toilet so nobody sees your feet
  { f0: 315, f1: 374, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 315, x: 0, y: -340, z: 1.15 }, { f: 374, x: 0, y: -430, z: 1.3 }],
    build(f) { const up = sstep(prog(f, 322, 345)); return { world: { set: 'stall' }, actors: [{ type: 'toilet', x: 0, y: 230, s: 0.62 }, B(0, 330, { hop: up * 345, expr: 'scared', pose: up < 1 ? { L: [90, -30], R: [90, -30] } : 'boo', sweat: 1, look: [0, 0.5] })] }; } },
  { f0: 375, f1: 409, light: () => 'day', dof: {},
    cam: [{ f: 375, x: 520, y: -260, z: 1.0 }, { f: 409, x: 520, y: -240, z: 1.1 }],
    build(f) { return { world: { set: 'wc', occupied: 1, feet: 1 - sstep(prog(f, 378, 392)) }, actors: [], fx: f > 392 ? [{ type: 'sparkle', x: 520, y: -60, k: 0.6 * Math.sin(prog(f, 392, 405) * Math.PI) }] : [], screen: tag(f, 384, 409, 'SUMIU! 👟', 300) }; } },
  // 6 — they start talking about the round-headed boy
  { f0: 410, f1: 526, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 410, x: -1250, y: -260, z: 0.78 }, { f: 526, x: -1250, y: -280, z: 0.88 }],
    build(f) { return { world: { set: 'wc', occupied: 1 }, actors: TRIO(f, { bia: { expr: 'mischief', pose: 'point', look: [1, 0] } }), fx: say(f, 432, -1350, -800, 'SABE O MENINO\nDA CABEÇA REDONDA?', { fs: 60, tx: -220 }) }; } },
  // 7 — that's YOU
  { f0: 527, f1: 563, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 527, x: 0, y: -440, z: 1.5 }, { f: 534, x: 0, y: -560, z: 2.2, e: 'o' }, { f: 563, x: 0, y: -570, z: 2.35 }],
    kicks: [{ f: 530, a: 10 }],
    build(f) { return { world: { set: 'stall' }, actors: stall(f, { up: true, boy: { expr: 'shocked', pose: 'cheeks', sweat: 1, look: [0, 0] } }), fx: [{ type: 'lines', x: 0, y: -620, r: 260, k: 1 - prog(f, 530, 560) }], screen: tag(f, 530, 563, 'EU?!', 300) }; } },
  // 8 — one says you're annoying
  { f0: 564, f1: 622, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 564, x: -1250, y: -220, z: 1.05 }, { f: 600, x: -1250, y: -230, z: 1.12 }, { f: 601, x: 0, y: -440, z: 1.5 }, { f: 622, x: 0, y: -450, z: 1.6 }],
    build(f) { if (f <= 600) return { world: { set: 'wc', occupied: 1 }, actors: TRIO(f, { lara: { expr: 'bored', pose: 'hips', look: [-1, 0] } }), fx: say(f, 576, -1250, -700, 'ELE É CHATO!', { fs: 56 }) };
      return { world: { set: 'stall' }, actors: stall(f, { up: true, boy: { expr: 'stern', pose: 'hips', look: [0, 0] } }), fx: [{ type: 'anger', x: 150, y: -800, k: pop(f, 603) }] }; } },
  // 9 — the other says you're cute
  { f0: 623, f1: 686, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 623, x: -800, y: -220, z: 1.05 }, { f: 660, x: -800, y: -230, z: 1.12 }, { f: 661, x: 0, y: -440, z: 1.5 }, { f: 686, x: 0, y: -450, z: 1.65 }],
    build(f) { if (f <= 660) return { world: { set: 'wc', occupied: 1 }, actors: TRIO(f, { rita: { expr: 'bliss', pose: 'cheeks', look: [0, -0.3] } }), fx: say(f, 640, -800, -720, 'EU ACHO\nELE FOFO...', { fs: 54 }).concat([{ type: 'hearts', x: -800, y: -350, n: 4 }]) };
      return { world: { set: 'stall' }, actors: stall(f, { up: true, boy: { expr: 'love', pose: 'cheeks', look: [0, -0.3] } }), fx: [{ type: 'hearts', x: 0, y: -780, n: 6 }] }; } },
  // 10 — you slip... SPLASH
  { f0: 687, f1: 773, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 687, x: 0, y: -440, z: 1.35 }, { f: 733, x: 0, y: -400, z: 1.3 }, { f: 738, x: 0, y: -360, z: 1.05, e: 'o' }, { f: 773, x: 0, y: -360, z: 1.0 }],
    kicks: [{ f: 735, a: 16 }],
    build(f) { const sl = sstep(prog(f, 700, 735)); const hop = f < 700 ? 345 : lerp(345, 150, sl); return { world: { set: 'stall' }, actors: [{ type: 'toilet', x: 0, y: 230, s: 0.62, splash: f >= 735 }, B(0, 330, { hop, rot: f < 735 ? sl * 0.5 : 0.25, expr: f < 700 ? 'love' : f < 735 ? 'scared' : 'shocked', pose: f < 700 ? 'cheeks' : 'up', look: [0, -0.5], sweat: f > 700 ? 1 : 0 })],
      fx: [{ type: 'splash', x: 0, y: -60, t: prog(f, 735, 765) }].concat(f < 700 ? [{ type: 'hearts', x: 0, y: -780, n: 5 }] : []), screen: tag(f, 735, 773, 'SPLASH!', 300) }; } },
  // 11 — total silence. "Is anybody there?"
  { f0: 774, f1: 865, light: () => 'day', dof: {},
    cam: [{ f: 774, x: -650, y: -420, z: 0.45 }, { f: 865, x: -600, y: -430, z: 0.5 }],
    build(f) { const t = sstep(prog(f, 778, 790)); return { world: { set: 'wc', occupied: 1 }, actors: TRIO(f, { bia: { expr: 'surprised', look: [1, 0], pose: 'hang' }, lara: { expr: 'surprised', look: [1, 0], flip: t > 0.5 ? 1 : 1 }, rita: { expr: 'surprised', look: [1, 0], flip: 1 } }), fx: say(f, 823, -1450, -900, 'TEM ALGUÉM AÍ?', { fs: 110, tx: -200 }).concat(f > 780 && f < 820 ? [{ type: 'speech', x: 510, y: -1700, text: '...', fs: 90, k: pop(f, 782) * 0.8 }] : []) }; } },
  // 12 — you make your voice thin: "just me... Bolinha"
  { f0: 866, f1: 958, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 866, x: 0, y: -430, z: 1.4 }, { f: 958, x: 0, y: -450, z: 1.6 }],
    build(f) { return { world: { set: 'stall' }, actors: stall(f, { up: true, splash: 1, boy: { expr: 'innocent', pose: 'cheeks', look: [0.3, -0.2], tilt: Math.sin(f * 0.15) * 0.08 } }), fx: say(f, 900, 60, -880, 'SÓ EU...\nA BOLINHA! 🎀', { fs: 52, col: '#e2568f' }) }; } },
  // 13 — next day: the whole school calls you Bolinha
  { f0: 959, f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 959, x: 0, y: -260, z: 0.62 }, { f: 1030, x: 0, y: -330, z: 0.95 }, { f: TOTAL - 1, x: 0, y: -360, z: 1.05 }],
    build(f) { return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: f < 1020 ? 'bored' : 'squint', pose: 'cheeks', sweat: 1, look: [0, 0] } }),
      fx: say(f, 975, -560, -720, 'OI, BOLINHA!', { fs: 46 }).concat(say(f, 990, 560, -760, 'BOLINHA! 🎀', { fs: 46 }), say(f, 1010, 0, -1020, 'BOLINHAAA!', { fs: 52 })), screen: tag(f, 1030, TOTAL, 'BOLINHA PRA SEMPRE 🎀', 250) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
