// "E se você fosse a única menina numa festa do pijama de meninos?" — 1010 frames @30fps
const TOTAL = 1010;
const FLASHES = [700];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 54, k: pop(f, f0), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
// the girl version of the bolinha (braids with pink bows) and the boys (original)
const ME = (x, y, o = {}) => G('boy', x, y, Object.assign({ braids: 1, expr: 'happy' }, o));
[['tiago', '#f2caa6', '#3a86ff', '#2b2d42'], ['caio', '#8b5a3c', '#2ec4b6', '#1b4332'], ['davi', '#c98e66', '#e63946', '#3a0ca3'], ['leo', '#f7d4b6', '#ff9f43', '#2b2d42']].forEach(([n, skin, pj, pants], i) => (CAST[n] = { skin, hair: 'cap', hc: ['#1b1212', '#3a2314', '#d9542b', '#2b1b1e'][i], pj, pj2: '#ffffff', pat: 'none', pants, slip: '#ffffff', hand: skin }));
const BOYS = ['tiago', 'caio', 'davi', 'leo'];
const SP = [[-760, 150], [460, 150], [-640, 470], [340, 470]];
function boys(f, o = {}) { return SP.map(([x, y], i) => G(BOYS[i], x, y, Object.assign({ flip: x > -150 ? -1 : 1, look: [clamp((-150 - x) / 600, -1, 1), 0], expr: 'happy', tilt: Math.sin(f * 0.4 + i) * 0.03 }, typeof o === 'function' ? o(i) : o))); }
const _drawFx22 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx22(ctx, (fx || []).filter((e) => !['stink', 'snack', 'score'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'stink') for (let i = 0; i < 6; i++) { const x = e.x + (i - 2.5) * 140, t = ((f * 0.03 + i * 0.17) % 1); ctx.strokeStyle = `rgba(120,200,60,${0.8 * (1 - t)})`; ctx.lineWidth = wink(2.2); ctx.beginPath(); for (let j = 0; j < 8; j++) ctx.lineTo(x + Math.sin(j * 1.3 + f * 0.2 + i) * 30, e.y - t * 300 - j * 40); ctx.stroke(); }
    if (e.type === 'snack') { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); if (e.kind === 'pizza') { rr(ctx, -220, -40, 440, 80, 10); paint(ctx, '#f4f1de', INK, wink()); ctx.save(); ctx.translate(0, -40); ctx.rotate(-0.9); rr(ctx, -220, -80, 440, 80, 10); paint(ctx, '#e9e2c9', INK, wink()); ctx.restore(); for (let i = 0; i < 6; i++) { ell(ctx, -150 + i * 55, -50, 10, 7); paint(ctx, '#d4a373'); } } else if (e.kind === 'chips') { ctx.beginPath(); ctx.moveTo(-90, 120); ctx.lineTo(-110, -120); ctx.lineTo(110, -120); ctx.lineTo(90, 120); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink()); ctx.fillStyle = '#e63946'; ctx.font = '900 46px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('CHIPS', 0, 10); } else { rr(ctx, -55, -130, 110, 260, 30); paint(ctx, '#e63946', INK, wink()); rr(ctx, -55, -40, 110, 60, 0); paint(ctx, '#ffffff', INK, wink(0.6)); } ctx.restore(); }
    if (e.type === 'score') { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.k, e.k); rr(ctx, -330, -140, 660, 280, 30); paint(ctx, '#1c1222', '#ffd23f', wink(2)); ctx.fillStyle = '#ffd23f'; ctx.font = '900 150px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.text, 0, 10); ctx.restore(); }
  }
};

const SHOTS = [
  // 1 — hook: the only girl, winning, surrounded by stunned boys
  { f0: 0, f1: 120, light: () => 'eve', dof: { room: 2 },
    cam: [{ f: 0, x: -150, y: -380, z: 0.7 }, { f: 120, x: -150, y: -400, z: 0.85 }],
    build(f) { return { world: { set: 'room' }, actors: boys(f, { expr: 'shocked', look: [0, 0] }).concat([ME(-150, -25, { s: 0.5, sit: true, pose: 'controller', props: { controller: 1 }, expr: 'mischief' })]), screen: tag(f, 20, 120, 'SÓ EU DE MENINA?!', 260) }; } },
  // 2 — the room smells like socks
  { f0: 121, f1: 188, light: () => 'eve', dof: {},
    cam: [{ f: 121, x: -900, y: -500, z: 0.85 }, { f: 188, x: -850, y: -520, z: 0.95 }],
    build(f) { const w = walkTo(f, 121, 150, [-1300, 60], [-850, 160]); return { world: { set: 'room', door: 1 }, actors: [ME(w.x, w.y, { walk: w.walk, flip: 1, expr: f < 150 ? 'happy' : 'squint', pose: f > 155 ? { L: [12, 6], R: [120, 100] } : 'hang' })], fx: f > 148 ? [{ type: 'stink', x: -850, y: -300 }] : [], screen: tag(f, 150, 188, 'CHEIRO DE MEIA 🧦', 260) }; } },
  // 3 — the pizza is already gone
  { f0: 189, f1: 240, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 189, x: 200, y: -460, z: 1.1 }, { f: 240, x: 200, y: -470, z: 1.2 }],
    build(f) { return { world: { set: 'room' }, actors: [G('tiago', 0, 300, { expr: 'innocent', look: [-1, 0], pose: { L: [80, -10], R: [80, -10] } }), G('caio', 420, 300, { flip: -1, expr: 'grin', look: [-1, 0], pose: 'cheeks' })], fx: [{ type: 'snack', kind: 'pizza', x: 30, y: -380 }], screen: tag(f, 195, 240, 'PIZZA: ACABOU 🍕', 260) }; } },
  // 4 — dinner is chips and soda
  { f0: 241, f1: 319, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 241, x: -150, y: -440, z: 1.15 }, { f: 319, x: -150, y: -450, z: 1.25 }],
    build(f) { return { world: { set: 'room' }, actors: [ME(-150, 300, { expr: 'bored', look: [0, 0.3], pose: { L: [80, -10], R: [80, -10] } })], fx: [{ type: 'snack', kind: 'chips', x: -330, y: -420, rot: -0.2 }, { type: 'snack', kind: 'soda', x: 40, y: -420, rot: 0.15 }] }; } },
  // 5 — the video game tournament begins
  { f0: 320, f1: 397, light: () => 'dark', dof: {},
    cam: [{ f: 320, x: -150, y: -400, z: 0.72 }, { f: 397, x: -150, y: -420, z: 0.82 }],
    build(f) { return { world: { set: 'room', lightOff: true }, actors: boys(f, (i) => ({ sit: i < 2, pose: 'controller', props: { controller: 1 }, look: [0, -0.4], expr: 'mischief' })).concat([ME(-150, -25, { s: 0.5, sit: true, pose: 'controller', props: { controller: 1 }, look: [0, -0.4] })]), lights: [{ x: -150, y: -700, r: 1500, i: 1, col: 'rgba(150,180,255,.4)' }], screen: tag(f, 326, 397, 'CAMPEONATO 🎮', 260) }; } },
  // 6 — you win the first, the second... all of them
  { f0: 398, f1: 540, light: () => 'dark', dof: { room: 3 },
    cam: [{ f: 398, x: -150, y: -460, z: 1.25 }, { f: 540, x: -150, y: -480, z: 1.45 }],
    kicks: [{ f: 417, a: 6 }, { f: 461, a: 8 }, { f: 505, a: 12 }],
    build(f) { const sc = f < 417 ? '0 x 0' : f < 461 ? '1 x 0' : f < 505 ? '2 x 0' : '10 x 0'; return { world: { set: 'room', lightOff: true }, actors: [ME(-150, -25, { s: 0.5, sit: true, pose: 'controller', props: { controller: 1 }, expr: f < 417 ? 'stern' : 'grin', look: [0, -0.4] })], lights: [{ x: -150, y: -700, r: 1100, i: 1, col: 'rgba(150,180,255,.45)' }], fx: [{ type: 'score', x: -150, y: -880, text: sc, k: 0.6 + (f >= 505 ? 0.2 * pop(f, 505) : 0) }].concat(f >= 505 ? [{ type: 'confetti', n: 30, x0: -700, w: 1100, y0: -1200, h: 1000, f0: 505 }] : []) }; } },
  // 7 — nobody says a word
  { f0: 541, f1: 596, light: () => 'dark', dof: {},
    cam: [{ f: 541, x: -150, y: -420, z: 0.78 }, { f: 596, x: -150, y: -430, z: 0.86 }],
    build(f) { return { world: { set: 'room', lightOff: true }, actors: boys(f, (i) => ({ sit: i < 2, expr: 'shocked', look: [clamp((-150 - SP[i][0]) / 600, -1, 1), 0] })).concat([ME(-150, -25, { s: 0.5, sit: true, pose: 'controller', props: { controller: 1 }, expr: 'proud', look: [0, 0] })]), lights: [{ x: -150, y: -700, r: 1500, i: 1, col: 'rgba(150,180,255,.4)' }], screen: tag(f, 548, 596, '. . .', 260) }; } },
  // 8 — 2 a.m.: pillow fight
  { f0: 597, f1: 699, light: () => 'dark', dof: {},
    cam: [{ f: 597, x: -150, y: -420, z: 0.72 }, { f: 699, x: -150, y: -440, z: 0.85 }],
    build(f) { return { world: { set: 'room', lightOff: true }, actors: SP.map(([x, y], i) => { const w = walkTo(f, 640 + i * 4, 690, [x, y], [x * 0.55 - 70, y * 0.6 + 60]); return G(BOYS[i], w.x, w.y, { walk: w.walk, flip: x > -150 ? -1 : 1, pose: 'pillow', props: { pillow: 1 }, expr: 'mischief', look: [clamp(-x / 600, -1, 1), 0] }); }).concat([ME(-150, 260, { pose: 'pillow', props: { pillow: 1 }, expr: 'stern' })]), lights: [{ x: -150, y: -700, r: 1600, i: 1, col: 'rgba(150,180,255,.35)' }], screen: tag(f, 600, 699, '2 DA MANHÃ 🌙', 260) }; } },
  // 9 — you take everyone out in ten seconds
  { f0: 700, f1: 786, light: () => 'dark', dof: {},
    cam: [{ f: 700, x: -150, y: -420, z: 0.95 }, { f: 786, x: -150, y: -430, z: 0.8 }],
    kicks: [{ f: 712, a: 10 }, { f: 724, a: 10 }, { f: 736, a: 10 }, { f: 748, a: 10 }],
    build(f) { return { world: { set: 'room', lightOff: true }, actors: SP.map(([x, y], i) => { const t = prog(f, 712 + i * 12, 724 + i * 12); return G(BOYS[i], lerp(x * 0.55 - 70, x * 1.1, t), lerp(y * 0.6 + 60, y, t), { flip: x > -150 ? -1 : 1, rot: t > 0 ? -t * 1.2 * (x > -150 ? -1 : 1) : 0, hop: Math.sin(t * Math.PI) * 120, expr: t > 0 ? 'shocked' : 'mischief', pose: t > 0 ? 'up' : 'pillow', props: { pillow: t > 0 ? 0 : 1 } }); }).concat([ME(-150, 260, { pose: Math.floor(f / 6) % 2 ? 'pillow' : 'hero', props: { pillow: 1 }, expr: 'grin' })]),
      lights: [{ x: -150, y: -700, r: 1600, i: 1, col: 'rgba(150,180,255,.35)' }], fx: [0, 1, 2, 3].map((i) => ({ type: 'dust', x: SP[i][0], y: SP[i][1], k: 1 - prog(f, 724 + i * 12, 745 + i * 12) })).filter((e) => e.k < 1 && e.k > 0), screen: tag(f, 752, 786, '10 SEGUNDOS ⏱️', 260) }; } },
  // 10 — breakfast: "will you come back next time?"
  { f0: 787, f1: 909, light: () => 'day', dof: {},
    cam: [{ f: 787, x: -150, y: -420, z: 0.78 }, { f: 909, x: -150, y: -440, z: 0.9 }],
    build(f) { return { world: { set: 'room' }, actors: boys(f, (i) => ({ sit: true, expr: 'innocent', pose: 'cheeks' })).concat([ME(-150, 260, { expr: 'proud', pose: 'hips' })]), fx: say(f, 830, 60, -1100, 'VOCÊ VOLTA\nNA PRÓXIMA? 🥺', { tx: -120 }).concat([{ type: 'stink', x: -150, y: 300 }]) }; } },
  // 11 — "only if you clean up this room"
  { f0: 910, f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 910, x: -150, y: -420, z: 1.2 }, { f: TOTAL - 1, x: -150, y: -440, z: 1.35 }],
    build(f) { return { world: { set: 'room' }, actors: [ME(-150, 260, { expr: 'stern', pose: 'point', look: [0, 0.3] })], fx: say(f, 938, -150, -880, 'SÓ SE ARRUMAREM\nESSE QUARTO! 🧹', { fs: 54 }), screen: tag(f, 965, TOTAL, 'A CHEFE DA FESTA 👑', 260) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
