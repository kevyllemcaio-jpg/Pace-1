// ADULT series — "E se o seu primeiro encontro tivesse legenda do que cada um pensa de verdade?" — 1240 frames @30fps
const TOTAL = 1240;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 50, k: pop(f, f0) * (o.f1 ? 1 - prog(f, o.f1 - 5, o.f1) : 1), tx: 0 }, o)] : []);
const leg = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'legenda', x, y, text, fs: 52, k: pop(f, f0) * (o.f1 ? 1 - prog(f, o.f1 - 5, o.f1) : 1) }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
// the table: he sits left, she sits right
const HX = -470, AX = 470, SY = 330;
function table(f, o = {}) {
  const A = [{ type: 'chair', x: HX - 60, y: SY - 20, layer: 'front' }, { type: 'chair', x: AX + 60, y: SY - 20, flip: -1, layer: 'front' }];
  A.push(G('homem', HX, SY, Object.assign({ sit: true, expr: 'happy', look: [1, 0] }, o.h)));
  if (o.a !== false) A.push(G('ana', AX, SY, Object.assign({ sit: true, flip: -1, expr: 'happy', look: [-1, 0] }, o.a)));
  A.push({ type: 'dinner', x: 0, y: SY + 60, food: o.food, layer: 'front' });
  if (o.g) A.push(G('garcom', 0, 200, Object.assign({ bowtie: true, expr: 'happy', pose: { L: [12, 6], R: [100, -20] } }, o.g)));
  return A;
}
const HEAD_H = -900, HEAD_A = -900;

const SHOTS = [
  // 1 — hook: subtitles pop over both of them
  { f0: 0, f1: 127, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 0, x: 0, y: -520, z: 0.92 }, { f: 127, x: 0, y: -540, z: 1.02 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { h: { expr: 'love' }, a: { expr: 'mischief' } }), fx: leg(f, 20, -200, -1250, 'ELA É LINDA\nDEMAIS 😍', { fs: 62 }).concat(leg(f, 48, 200, -870, 'ELE É FOFO...\nEU ACHO 🤔', { fs: 62 })), screen: tag(f, 70, 127, 'COM LEGENDA?!', 1500) }; } },
  // 2 — she arrives at the restaurant
  { f0: 128, f1: 186, light: () => 'gold', dof: {},
    cam: [{ f: 128, x: 300, y: -520, z: 0.8 }, { f: 186, x: 200, y: -540, z: 0.88 }],
    build(f) { const w = walkTo(f, 128, 176, [1700, 360], [AX, 340]); const A = table(f, { h: { sit: f < 150, expr: f < 150 ? 'happy' : 'love', look: [1, -0.2], pose: f >= 150 ? 'hang' : undefined }, a: f >= 178 ? { expr: 'happy' } : false }); if (f < 178) A.push(G('ana', w.x, w.y, { walk: w.walk, flip: -1, expr: 'happy', pose: 'hang' }));
      if (f >= 150) { const i = A.findIndex((a) => a.who === 'homem'); A[i] = G('homem', HX, SY, { expr: 'love', look: [1, -0.2], pose: 'hang' }); }
      return { world: { set: 'rest' }, actors: A, fx: f > 160 ? [{ type: 'sparkle', x: 900, y: -1000, k: 0.6 * Math.sin(prog(f, 160, 186) * Math.PI) }] : [] }; } },
  // 3 — "you look beautiful"
  { f0: 187, f1: 255, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 187, x: -300, y: -640, z: 1.25 }, { f: 255, x: -300, y: -660, z: 1.35 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { h: { expr: 'proud', pose: 'point' } }), fx: say(f, 210, -300, -1150, 'VOCÊ TÁ LINDA!', { fs: 54, tx: -120 }) }; } },
  // 4 — subtitle: rehearsed it 30 times in the mirror
  { f0: 256, f1: 356, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 256, x: -360, y: -660, z: 1.3 }, { f: 356, x: -360, y: -680, z: 1.45 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { h: { expr: f < 300 ? 'proud' : 'innocent', pose: 'hang', sweat: f > 300 ? 1 : 0 } }), fx: leg(f, 278, -360, -1180, 'ENSAIEI ISSO NO\nESPELHO 30 VEZES', { fs: 50 }) }; } },
  // 5 — "thanks, I didn't even get ready"
  { f0: 357, f1: 447, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 357, x: 360, y: -660, z: 1.3 }, { f: 447, x: 360, y: -680, z: 1.42 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { a: { expr: 'innocent', pose: 'hang', tilt: -0.06 } }), fx: say(f, 384, 360, -1180, 'OBRIGADA,\nNEM ME ARRUMEI', { fs: 50, tx: 80 }) }; } },
  // 6 — subtitle: three hours at the salon
  { f0: 448, f1: 521, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 448, x: 400, y: -680, z: 1.4 }, { f: 521, x: 400, y: -700, z: 1.55 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { a: { expr: 'innocent', pose: 'hang', tilt: -0.06 } }), fx: leg(f, 468, 400, -1180, '3 HORAS\nNO SALÃO 💇‍♀️', { fs: 60 }) }; } },
  // 7 — the waiter: "would you like a starter?"
  { f0: 522, f1: 607, light: () => 'gold', dof: { room: 3 },
    cam: [{ f: 522, x: 0, y: -620, z: 0.95 }, { f: 607, x: 0, y: -640, z: 1.05 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { g: {}, h: { look: [0.6, -0.4] }, a: { look: [-0.6, -0.4] } }), fx: say(f, 534, 0, -1500, 'VÃO QUERER\nUMA ENTRADA?', { fs: 54 }) }; } },
  // 8 — "only if she wants..."
  { f0: 608, f1: 678, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 608, x: -340, y: -660, z: 1.3 }, { f: 678, x: -340, y: -670, z: 1.42 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { g: {}, h: { expr: 'mischief', look: [1, 0], pose: 'hang' } }), fx: say(f, 630, -360, -1180, 'SÓ SE ELA\nQUISER... 😏', { fs: 54, tx: -100 }) }; } },
  // 9 — her subtitle: please, I really want it
  { f0: 679, f1: 760, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 679, x: 380, y: -680, z: 1.35 }, { f: 760, x: 380, y: -700, z: 1.55 }],
    kicks: [{ f: 700, a: 6 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { a: { expr: f < 700 ? 'happy' : 'bliss', look: [-1, 0], pose: f >= 700 ? 'cheeks' : 'hang' } }), fx: leg(f, 698, 380, -1180, 'POR FAVOR,\nQUERO MUITO 😏', { fs: 56 }).concat(f > 704 ? [{ type: 'hearts', x: 380, y: -700, n: 4 }] : []) }; } },
  // 10 — "I'm on a diet"
  { f0: 761, f1: 821, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 761, x: 360, y: -660, z: 1.3 }, { f: 821, x: 360, y: -670, z: 1.4 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { food: 1, a: { expr: 'proud', pose: 'hips' } }), fx: say(f, 768, 360, -1180, 'TÔ DE DIETA! 🥗', { fs: 56, tx: 80 }) }; } },
  // 11 — subtitle: just order the big dessert already
  { f0: 822, f1: 910, light: () => 'gold', dof: { room: 4 },
    cam: [{ f: 822, x: 380, y: -680, z: 1.35 }, { f: 910, x: 380, y: -690, z: 1.5 }],
    build(f) { return { world: { set: 'rest' }, actors: table(f, { food: 1, a: { expr: 'proud', pose: 'hips' } }), fx: leg(f, 842, 380, -1180, 'PEDE LOGO A\nSOBREMESA GRANDE 🍰', { fs: 48 }) }; } },
  // 12 — at her door: "want to come up for a coffee?"
  { f0: 911, f1: 1050, light: () => 'eve', dof: { room: 2 },
    cam: [{ f: 911, x: 0, y: -620, z: 0.72 }, { f: 985, x: 0, y: -660, z: 0.9 }, { f: 1050, x: 150, y: -680, z: 1.05 }],
    build(f) { const w = walkTo(f, 911, 960, [-1600, 340], [-380, 340]); const w2 = walkTo(f, 911, 960, [-1300, 330], [380, 330]);
      return { world: { set: 'porta', door: 0 }, actors: [G('homem', w.x, w.y, { walk: w.walk, expr: 'happy', look: [1, 0], pose: 'hang' }), G('ana', w2.x, w2.y, { walk: w2.walk, flip: f > 960 ? -1 : 1, expr: f > 985 ? 'mischief' : 'happy', look: [-1, 0], pose: f > 985 ? 'hips' : 'hang' })],
        fx: say(f, 988, 200, -1300, 'QUER SUBIR PRA\nTOMAR UM CAFÉ? ☕', { fs: 64, tx: 60 }) }; } },
  // 13 — "I don't even like coffee"
  { f0: 1051, f1: 1135, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 1051, x: -380, y: -660, z: 1.3 }, { f: 1135, x: -380, y: -670, z: 1.42 }],
    build(f) { return { world: { set: 'porta', door: 0 }, actors: [G('homem', -380, 340, { expr: 'innocent', look: [1, 0], pose: 'hang' }), G('ana', 380, 330, { flip: -1, expr: 'mischief', look: [-1, 0], pose: 'hips' })], fx: say(f, 1080, -380, -1200, 'EU NEM GOSTO\nDE CAFÉ 🤷', { fs: 52, tx: -80 }) }; } },
  // 14 — subtitle: idiot.
  { f0: 1136, f1: 1196, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 1136, x: 380, y: -680, z: 1.35 }, { f: 1196, x: 380, y: -690, z: 1.5 }],
    kicks: [{ f: 1158, a: 10 }],
    build(f) { return { world: { set: 'porta', door: 0 }, actors: [G('homem', -380, 340, { expr: 'innocent', look: [1, 0] }), G('ana', 380, 330, { flip: -1, expr: f < 1156 ? 'surprised' : 'stern', look: [-1, 0], pose: 'hips' })], fx: leg(f, 1156, 380, -1200, 'IDIOTA.', { fs: 110 }) }; } },
  // 15 — the door closes
  { f0: 1197, f1: TOTAL - 1, light: () => 'eve', dof: {},
    cam: [{ f: 1197, x: 0, y: -620, z: 0.78 }, { f: TOTAL - 1, x: -150, y: -620, z: 0.9 }],
    kicks: [{ f: 1214, a: 12 }],
    build(f) { const op = f < 1200 ? 0.7 : 0.7 * (1 - sstep(prog(f, 1204, 1214))); return { world: { set: 'porta', door: op }, actors: [G('homem', -380, 340, { expr: f < 1214 ? 'innocent' : 'shocked', look: [1, 0], pose: f > 1216 ? 'cheeks' : 'hang' })], fx: f >= 1214 ? [{ type: 'lines', x: 0, y: -700, r: 300, k: 1 - prog(f, 1214, 1235) }] : [], screen: tag(f, 1214, TOTAL, 'BOA NOITE 😅', 1500) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
// framing pass: bring the camera (and the bubbles) down toward the characters
for (const s of SHOTS) {
  const dy = s.f0 >= 911 ? 300 : 400;
  s.cam.forEach((k) => (k.y += dy));
  const b = s.build; s.build = (f, g) => { const R = b(f, g); (R.fx || []).forEach((e) => { if (['speech', 'legenda', 'hearts', 'sparkle'].includes(e.type)) e.y += dy; }); return R; };
}
