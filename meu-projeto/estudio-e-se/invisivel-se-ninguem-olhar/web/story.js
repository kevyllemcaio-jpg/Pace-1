// "E se você ficasse invisível, mas só quando ninguém tá olhando?" — 1050 frames @30fps
const TOTAL = 1050;
const FLASHES = [940];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 50, k: pop(f, f0), tx: 0 }, o)] : []);
const SEATS = [];
[[110, [-380, 0, 380, 760]], [340, [-410, 0, 410, 820]], [580, [-440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const CLASSMATES = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'];
// vis: 1 = visible, 0 = invisible (ghost outline only)
function room(f, o = {}) {
  const A = [{ type: 'quadro', x: -1180, y: 260, layer: 'front' }]; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { const v = o.vis == null ? 1 : o.vis; A.push(B(0, y - 12, Object.assign({ sit: true, alpha: 0.06 + 0.94 * v }, o.boy))); return; }
    const w = CLASSMATES[gi++ % CLASSMATES.length]; const lx = clamp((0 - x) / 500, -1, 1);
    A.push(G(w, x, y - 12, Object.assign({ sit: true, uniform: true, expr: 'happy', look: [0, -0.3], tilt: Math.sin(f * 0.04 + i) * 0.03 }, o.stare ? { expr: o.stare, look: [lx, 0.2] } : {})));
  });
  if (o.prof !== false) { const away = o.away ? 1 : 0; A.push(G('prof', -900, 330, Object.assign({ flip: away ? -1 : 1, expr: away ? 'neutral' : 'surprised', look: away ? [-1, -0.3] : [1, 0], pose: away ? { L: [12, 6], R: [120, -40] } : 'hang' }, o.p))); }
  return A;
}
const _drawProp19 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'quadro') { ctx.save(); ctx.translate(a.x, a.y); for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 200, -900); ctx.lineTo(sx * 280, 0); paint(ctx, null, INK, wink(2.2)); } rr(ctx, -330, -1150, 660, 480, 14); paint(ctx, '#244a40', INK, wink()); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 70px "Comic Sans MS", cursive'; ctx.textAlign = 'center'; ctx.fillText('PROVA', 0, -980); ctx.fillText('7 × 8 = ?', 0, -820); ctx.restore(); return; }
  if (a.type === 'bolo') { ctx.save(); ctx.translate(a.x, a.y); const k = a.s || 1; ctx.scale(k, k); ell(ctx, 0, 0, 420, 70); paint(ctx, '#ffffff', INK, wink() / k); const n = 8 - (a.taken || 0); ctx.beginPath(); ctx.moveTo(-300, -40); ctx.lineTo(-300, -300); ctx.lineTo(300 - (8 - n) * 50, -300); ctx.lineTo(300 - (8 - n) * 50, -40); ctx.closePath(); paint(ctx, '#5a3a22', INK, wink() / k); rr(ctx, -310, -330, 620 - (8 - n) * 50, 60, 20); paint(ctx, '#3a2314', INK, wink() / k); for (let i = 0; i < n; i++) { ell(ctx, -260 + i * 70, -340, 18, 18); paint(ctx, '#e63946', INK, wink(0.6) / k); } ctx.restore(); return; }
  if (a.type === 'fatia') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0); ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.lineTo(0, -150); ctx.closePath(); paint(ctx, '#5a3a22', INK, wink()); ell(ctx, 0, -140, 14, 14); paint(ctx, '#e63946', INK, wink(0.6)); ctx.restore(); return; }
  _drawProp19(ctx, a, f);
};
const _drawFx19 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx19(ctx, (fx || []).filter((e) => !['camera', 'polaroid', 'ghost'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'camera') { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -110, -70, 220, 140, 18); paint(ctx, '#2b2d42', INK, wink()); ell(ctx, 0, 0, 50, 50); paint(ctx, '#8d99ae', INK, wink()); ell(ctx, 0, 0, 28, 28); paint(ctx, '#1c1222', INK, wink(0.6)); rr(ctx, 40, -100, 50, 30, 6); paint(ctx, e.flash ? '#ffffff' : '#adb5bd', INK, wink(0.6)); ctx.restore(); }
    if (e.type === 'ghost') { ctx.save(); ctx.setLineDash([24, 18]); ctx.lineWidth = wink(1.4); ctx.strokeStyle = 'rgba(80,60,120,.7)'; ell(ctx, e.x, e.y, e.r, e.r); ctx.stroke(); ctx.restore(); ctx.fillStyle = 'rgba(80,60,120,.8)'; ctx.font = '900 140px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', e.x, e.y); }
  }
};
const LINE = [['bia', -900], ['lara', -560], ['boy', -200], ['rita', 160], ['nina', 500], ['joana', 840]];
function lineup(f, o = {}) { return LINE.map(([w, x], i) => w === 'boy' ? B(x, 330, Object.assign({ expr: 'grin', pose: 'hang', alpha: o.boyA == null ? 1 : o.boyA }, o.boy)) : G(w, x, 330 + (i % 2) * 10, { uniform: true, expr: o.expr || 'grin', look: o.look || [0, 0], pose: i % 2 ? 'hang' : 'hips' })); }

const SHOTS = [
  // 1 — hook: flickering in and out
  { f0: 0, f1: 118, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -330, z: 1.6 }, { f: 118, x: 0, y: -340, z: 1.85 }],
    build(f) { const v = Math.floor(f / 9) % 2; return { world: { set: 'class', board: 'AULA' }, actors: room(f, { vis: v, prof: false, boy: { expr: 'grin', look: [0, 0] } }), fx: v ? [] : [{ type: 'sparkle', x: 0, y: -320, k: 0.6 }], screen: tag(f, 30, 118, 'SÓ SE NINGUÉM OLHAR!', 280) }; } },
  // 2 — the teacher turns to the board... you vanish
  { f0: 119, f1: 206, light: () => 'day', dof: {},
    cam: [{ f: 119, x: -450, y: -380, z: 0.82 }, { f: 206, x: -420, y: -380, z: 0.9 }],
    build(f) { const away = f >= 140; const v = 1 - sstep(prog(f, 166, 178)); return { world: { set: 'class', board: 'AULA' }, actors: room(f, { away, vis: v, boy: { expr: 'happy' } }), fx: f > 170 && f < 196 ? [{ type: 'sparkle', x: 0, y: -330, k: 0.6 * Math.sin(prog(f, 170, 196) * Math.PI) }] : [] }; } },
  // 3 — she turns back: you're there
  { f0: 207, f1: 280, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 207, x: -300, y: -360, z: 1.05 }, { f: 280, x: -250, y: -360, z: 1.15 }],
    build(f) { const away = f < 214; return { world: { set: 'class', board: 'AULA' }, actors: room(f, { away, vis: away ? 0 : 1, boy: { expr: 'innocent', look: [-1, 0] }, p: away ? {} : { expr: 'squint' } }) }; } },
  // 4 — turns again: gone
  { f0: 281, f1: 343, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 281, x: -150, y: -360, z: 1.1 }, { f: 311, x: -100, y: -360, z: 1.2 }, { f: 316, x: 0, y: -360, z: 1.55, e: 'o' }, { f: 343, x: 0, y: -360, z: 1.6 }],
    kicks: [{ f: 311, a: 8 }],
    build(f) { const away = f >= 290; return { world: { set: 'class', board: 'AULA' }, actors: room(f, { away, vis: f < 308 ? 1 : 0, stare: f > 311 ? 'shocked' : null }), fx: f >= 311 ? [{ type: 'ghost', x: 0, y: -330, r: 130 }] : [] }; } },
  // 5 — she spins faster and faster
  { f0: 344, f1: 527, light: () => 'day', dof: {},
    cam: [{ f: 344, x: -450, y: -380, z: 0.85 }, { f: 527, x: -450, y: -390, z: 0.95 }],
    kicks: [{ f: 500, a: 6 }],
    build(f) { const sp = 4 + 14 * (1 - prog(f, 344, 500)); const away = Math.floor((f - 344) / sp) % 2 === 1; return { world: { set: 'class', board: 'AULA' }, actors: room(f, { away, vis: away ? 0 : 1, stare: 'surprised', p: { expr: f > 495 ? 'spooky' : away ? 'neutral' : 'squint', tilt: f > 495 ? Math.sin(f * 0.4) * 0.15 : 0 }, boy: { expr: 'grin' } }), fx: f > 495 ? [{ type: 'sparkle', x: -900, y: -720, k: 0.5 }] : [] }; } },
  // 6 — the whole class stares so you don't vanish. Nobody blinks.
  { f0: 528, f1: 673, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 528, x: 0, y: -340, z: 0.95 }, { f: 673, x: 0, y: -350, z: 1.3 }],
    build(f) { return { world: { set: 'class', board: 'AULA' }, actors: room(f, { prof: false, vis: 1, stare: 'stern', boy: { expr: 'worried', sweat: 1, look: [Math.sin(f * 0.1), 0] } }), screen: tag(f, 630, 673, 'NINGUÉM PISCA 👁️👁️', 1500) }; } },
  // 7 — lunch: everyone looks at the cake, you take three slices
  { f0: 674, f1: 820, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 674, x: 0, y: -380, z: 0.9 }, { f: 820, x: 0, y: -400, z: 1.05 }],
    build(f) { const taken = f < 767 ? 0 : f < 778 ? 1 : f < 786 ? 2 : 3; const A = [{ type: 'bolo', x: 0, y: 140, s: 0.9, taken, layer: 'front' }];
      [['bia', -700], ['lara', -360], ['rita', 360], ['nina', 700]].forEach(([w, x], i) => A.push(G(w, x, 300, { uniform: true, expr: 'love', look: [-x / 700, 0.5], pose: 'cheeks', flip: x > 0 ? -1 : 1 })));
      A.push(B(0, 330, { alpha: 0.06, expr: 'mischief' }));
      for (let i = 0; i < taken; i++) A.push({ type: 'fatia', x: lerp(-100 + i * 60, -900 - i * 80, prog(f, 767 + i * 9, 800 + i * 9)), y: lerp(-150, -700, prog(f, 767 + i * 9, 800 + i * 9)), rot: f * 0.1 + i, layer: 'front' });
      return { world: { set: 'cantina' }, actors: A, screen: tag(f, 780, 820, '3 PEDAÇOS 🍰', 300) }; } },
  // 8 — class photo: "everybody look at the camera!"
  { f0: 821, f1: 959, light: () => 'day', dof: {},
    cam: [{ f: 821, x: 0, y: -420, z: 0.78 }, { f: 959, x: 0, y: -430, z: 0.86 }],
    build(f) { return { world: { set: 'yard' }, actors: lineup(f, { boyA: f < 900 ? 1 : 1 - sstep(prog(f, 900, 912)), boy: { expr: f < 900 ? 'grin' : 'shocked' }, look: [0, 0.4] }).concat([G('zelador', 620, 640, { expr: 'happy', flip: -1, pose: { L: [100, -60], R: [100, -60] } })]),
      fx: [{ type: 'camera', x: 560, y: -280, flash: f >= 938 && f < 944 }].concat(say(f, 880, 300, -1150, 'TODO MUNDO OLHANDO\nPRA CÂMERA! 📸', { fs: 54 })) }; } },
  // 9 — the photo: you're not in it
  { f0: 960, f1: TOTAL - 1, light: () => 'gold', dof: {},
    cam: [{ f: 960, x: 0, y: -460, z: 0.85 }, { f: TOTAL - 1, x: -150, y: -460, z: 1.05 }],
    build(f) { return { world: { set: 'yard' }, actors: lineup(f, { boyA: 0, look: [0, 0.4] }), fx: [{ type: 'ghost', x: -200, y: -330, r: 150 }], screen: tag(f, 975, TOTAL, 'NÃO SAIU NA FOTO 📸', 1500) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
