// ADULT series — "E se a sua vizinha te chamasse pra montar a cama dela?" — @30fps (voz +0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1335);
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const HM = (x, y, o = {}) => G('homem', x, y, Object.assign({ expr: 'happy' }, o));
const V = (x, y, o = {}) => G('viz', x, y, Object.assign({ expr: 'happy' }, o));
CAST.viz = Object.assign({}, CAST.ana, { hair: 'curly', hc: '#3a2314', pj: '#9b5de5', pj2: '#c7a4f5', pants: '#6a3cb4' });
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 300) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 48, k: pop(f, f0), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const LBL = (ctx, t, x, y, fs, col = '#1c1222') => { ctx.fillStyle = col; ctx.font = `900 ${fs}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); };
const FX = {
  box(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -330, -520, 660, 520, 8); paint(ctx, '#c9a26b', INK, wink()); rr(ctx, -330, -520, 660, 70, 8); paint(ctx, '#b88a50', INK, wink(0.7)); LBL(ctx, e.text || 'CAMA', 0, -300, 90, '#5a3a1a'); LBL(ctx, e.sub || '412 PEÇAS', 0, -170, 56, '#d62839'); ctx.restore(); },
  pieces(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); for (let i = 0; i < (e.n || 40); i++) { const a = hash(i) * 6.28, r = 80 + hash(i + 3) * 600 * (e.k || 1); const x = Math.cos(a) * r * 1.3, y = Math.sin(a) * r * 0.25; ctx.save(); ctx.translate(x, y); ctx.rotate(hash(i + 9) * 3); if (i % 3) { rr(ctx, -90, -14, 180, 28, 4); paint(ctx, ['#d4a373', '#e9c46a', '#c08552'][i % 3], INK, wink(0.5)); } else { ell(ctx, 0, 0, 10, 10); paint(ctx, '#adb5bd', INK, wink(0.4)); } ctx.restore(); } ctx.restore(); },
  manual(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(-0.05); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -300, -400, 600, 800, 10); paint(ctx, '#ffffff', INK, wink()); LBL(ctx, 'SÄNGMONTERING', 0, -330, 50, '#1c1222');
    ctx.strokeStyle = '#1c1222'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { const y = -220 + i * 150; rr(ctx, -240, y, 160, 100, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-60, y + 50); ctx.lineTo(40, y + 50); ctx.stroke(); rr(ctx, 60, y, 180, 100, 6); ctx.stroke(); LBL(ctx, ['Ö', 'Å', 'Ä', '?!'][i], 150, y + 50, 50, '#d62839'); } ctx.restore(); },
  key(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0.4); ctx.scale(e.s || 1, e.s || 1); ctx.strokeStyle = '#495057'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -120); ctx.lineTo(40, -120); ctx.stroke(); ctx.restore(); },
  perfume(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -50, -60, 100, 120, 20); paint(ctx, '#ffb3c6', INK, wink(0.7)); rr(ctx, -16, -100, 32, 40, 6); paint(ctx, '#ffd23f', INK, wink(0.6)); for (let i = 0; i < 10; i++) { const t = (f * 0.05 + i / 10) % 1; ell(ctx, -60 - t * 260, -90 - Math.sin(i) * 60 * t, 8 + t * 30, 8 + t * 30); ctx.fillStyle = `rgba(255,190,230,${0.7 * (1 - t)})`; ctx.fill(); } ctx.restore(); },
  mirror(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -260, -420, 520, 840, 200); paint(ctx, '#c9e8f5', INK, wink(1.4)); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-150, -250); ctx.lineTo(-60, -340); ctx.stroke(); ctx.restore(); },
  comb(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -90, -14, 180, 28, 6); paint(ctx, '#3a86ff', INK, wink(0.5)); for (let i = 0; i < 9; i++) { ctx.fillStyle = '#3a86ff'; ctx.fillRect(-80 + i * 20, 12, 8, 30); } ctx.restore(); },
  bed(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -450, -160, 900, 120, 10); paint(ctx, '#d4a373', INK, wink()); for (const x of [-430, 410]) { rr(ctx, x, -40, 24, 60, 4); paint(ctx, '#a0703a', INK, wink(0.6)); }
    if (e.mattress) { rr(ctx, -430, -230, 860, 90, 40); paint(ctx, '#ffffff', INK, wink(0.8)); rr(ctx, 230, -280, 170, 70, 30); paint(ctx, '#ffd6e0', INK, wink(0.6)); }
    ctx.save(); ctx.translate(-450, -160); if (e.upside) ctx.scale(1, -1); ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-10, -420); ctx.quadraticCurveTo(80, -520, 170, -420); ctx.lineTo(170, 0); ctx.closePath(); paint(ctx, '#bc8a5f', INK, wink()); ell(ctx, 80, -330, 40, 40); paint(ctx, '#e9c46a', INK, wink(0.5)); ctx.restore(); ctx.restore(); },
  screws(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); for (let i = 0; i < (e.n || 0); i++) { ctx.save(); ctx.translate((i % 6) * 46 - 115, -Math.floor(i / 6) * 30); ctx.rotate(0.6 + hash(i)); rr(ctx, -6, -30, 12, 60, 3); paint(ctx, '#adb5bd', INK, wink(0.4)); rr(ctx, -16, -36, 32, 12, 4); paint(ctx, '#868e96', INK, wink(0.4)); ctx.restore(); } ctx.restore(); },
  wardrobe(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.k || 1, e.k || 1); rr(ctx, -520, -900, 1040, 900, 8); paint(ctx, '#c9a26b', INK, wink()); for (let i = 0; i < 6; i++) { rr(ctx, -500 + i * 170, -860, 150, 820, 4); paint(ctx, '#d9b98a', INK, wink(0.5)); } LBL(ctx, 'GUARDA-ROUPA', 0, -600, 80, '#5a3a1a'); LBL(ctx, '6 PORTAS · 1.032 PEÇAS', 0, -470, 54, '#d62839'); ctx.restore(); },
};
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { _dfx(ctx, (fx || []).filter((e) => !FX[e.type]), f); for (const e of fx || []) if (FX[e.type]) FX[e.type](ctx, e, f); };
const ROOM = { set: 'room', tvOn: false };
const clock = (f, f0, f1, t) => tag(f, f0, f1, '🕛 ' + t);

const SHOTS = [
  { f0: 0, f1: T(169), light: () => 'eve', dof: {},
    cam: [{ f: 0, x: 0, y: -620, z: 0.85 }, { f: T(169), x: 0, y: -640, z: 0.95 }],
    build(f) { return { world: { set: 'porta', door: 1 }, actors: [V(0, 120, { expr: 'mischief', pose: 'cheeks', look: [1, 0] }), HM(420, 300, { flip: -1, expr: 'love', look: [-1, -0.2] })], fx: [{ type: 'hearts', x: 400, y: -500, n: 4 }].concat(say(f, T(90), -60, -880, 'ME AJUDA A\nMONTAR A CAMA? 😊', { fs: 80 })), screen: tag(f, T(20), T(169), '23:00 · TOC TOC 🚪') }; } },
  { f0: T(170), f1: T(248), light: () => 'eve', dof: {},
    cam: [{ f: T(170), x: 0, y: -300, z: 1.0 }, { f: T(248), x: 0, y: -320, z: 1.12 }],
    kicks: [{ f: T(190), a: 10 }],
    build(f) { const up = f > T(188); return { world: ROOM, actors: [HM(0, 300, { sit: !up, hop: up ? Math.abs(Math.sin((f - T(188)) * 0.25)) * 120 : 0, pose: up ? 'up' : 'hang', expr: up ? 'proud' : 'bored', look: [0, 0] })], fx: up ? [{ type: 'lines', x: 0, y: -300, r: 300, k: 0.8 }] : [], screen: tag(f, T(195), T(248), 'NEM PENSOU 2X 🏃') }; } },
  { f0: T(249), f1: T(302), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(249), x: 0, y: -330, z: 1.4 }, { f: T(302), x: 0, y: -340, z: 1.55 }],
    build(f) { return { world: { set: 'bedroom', sun: 0 }, actors: [HM(-80, 300, { pose: 'hold', expr: 'bliss', look: [1, 0], flip: 1 })], fx: [{ type: 'perfume', x: 100, y: -330 }, { type: 'sparkle', x: -80, y: -500, k: 0.7 }], screen: tag(f, T(260), T(302), 'PERFUME ✨') }; } },
  { f0: T(303), f1: T(389), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(303), x: 60, y: -330, z: 1.3 }, { f: T(389), x: 60, y: -340, z: 1.45 }],
    build(f) { const c = Math.sin(f * 0.5); return { world: { set: 'bedroom', sun: 0 }, actors: [HM(-180, 300, { pose: { L: [12, 6], R: [160, 120] }, expr: f > T(340) ? 'squint' : 'proud', look: [1, 0], flip: 1 })], fx: [{ type: 'mirror', x: 320, y: -330, s: 0.6 }, { type: 'comb', x: -160 + c * 40, y: -560, rot: 0.1 }], screen: tag(f, T(316), T(340), 'ARRUMA O CABELO 💇').concat(tag(f, T(340), T(389), '(QUE CABELO?) 🥚')) }; } },
  { f0: T(390), f1: T(463), light: () => 'eve', dof: {},
    cam: [{ f: T(390), x: 0, y: -640, z: 0.85 }, { f: T(463), x: 0, y: -620, z: 0.95 }],
    build(f) { const o = sstep(prog(f, T(416), T(432))); return { world: { set: 'porta', door: o }, actors: (o > 0.3 ? [V(0, 120, { expr: 'bliss', look: [1, 0] })] : []).concat([HM(420, 300, { flip: -1, expr: 'love', look: [-1, -0.2], tilt: Math.sin(f * 0.2) * 0.05 })]), fx: o > 0.5 ? [{ type: 'hearts', x: 0, y: -700, n: 3 }] : [] }; } },
  { f0: T(464), f1: T(528), light: () => 'eve', dof: {},
    cam: [{ f: T(464), x: 0, y: -360, z: 0.85 }, { f: T(500), x: 0, y: -360, z: 0.85 }, { f: T(506), x: 60, y: -380, z: 1.05, e: 'o' }, { f: T(528), x: 60, y: -380, z: 1.1 }],
    kicks: [{ f: T(495), a: 10 }],
    build(f) { return { world: ROOM, actors: [V(-300, 300, { pose: 'point', expr: 'happy', look: [1, 0] }), HM(-650, 320, { expr: f > T(495) ? 'shocked' : 'love', look: [1, 0] })], fx: [{ type: 'box', x: 350, y: 330, s: 0.9 }], screen: tag(f, T(495), T(528), 'UMA CAIXA 📦') }; } },
  { f0: T(529), f1: T(605), light: () => 'eve', dof: {},
    cam: [{ f: T(529), x: 0, y: -250, z: 0.75 }, { f: T(605), x: 0, y: -260, z: 0.82 }],
    build(f) { return { world: ROOM, actors: [HM(-450, 300, { expr: 'scared', sweat: 1, pose: 'cheeks', look: [1, 0.4] })], fx: [{ type: 'pieces', x: 150, y: 300, n: 60, k: sstep(prog(f, T(532), T(560))) }], screen: tag(f, T(540), T(605), '412 PEÇAS 😵') }; } },
  { f0: T(606), f1: T(665), light: () => 'eve', dof: { room: 4 },
    cam: [{ f: T(606), x: 0, y: -250, z: 1.15 }, { f: T(665), x: 0, y: -260, z: 1.3 }],
    build(f) { return { world: ROOM, actors: [], fx: [{ type: 'manual', x: 0, y: -260, s: 1.0 }], screen: tag(f, T(615), T(665), 'MANUAL EM SUECO 🇸🇪') }; } },
  { f0: T(666), f1: T(744), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(666), x: 0, y: -330, z: 1.4 }, { f: T(744), x: 0, y: -340, z: 1.6 }],
    build(f) { return { world: ROOM, actors: [HM(0, 300, { pose: 'hold', expr: 'squint', look: [0, 0.5] })], fx: [{ type: 'key', x: 30, y: -110, s: 1.0 }, { type: 'sparkle', x: 20, y: -300, k: 0.5 }], screen: tag(f, T(690), T(744), 'SÓ ISSO?! 🔧') }; } },
  { f0: T(745), f1: T(866), light: () => 'eve', dof: {},
    cam: [{ f: T(745), x: 0, y: -300, z: 0.85 }, { f: T(866), x: 0, y: -320, z: 0.95 }],
    build(f) { const done = f > T(800); return { world: ROOM, actors: [HM(-520, 320, { expr: done ? 'proud' : 'squint', pose: done ? 'hero' : 'hold', look: [1, 0] }), V(560, 300, { flip: -1, expr: f > T(820) ? 'squint' : 'happy', look: [-1, 0] })], fx: [{ type: 'bed', x: 30, y: 330, s: 0.7, upside: true }].concat(f > T(820) ? [{ type: 'exclaim', x: 560, y: -720, k: pop(f, T(822)) * 0.6 }] : []), screen: clock(f, T(746), T(866), '00:00 🙃') }; } },
  { f0: T(867), f1: T(973), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(867), x: 0, y: -260, z: 1.2 }, { f: T(973), x: 0, y: -270, z: 1.35 }],
    build(f) { const n = Math.floor(prog(f, T(900), T(940)) * 17); return { world: ROOM, actors: [HM(-200, 300, { expr: 'scared', sweat: 1, pose: 'cheeks', look: [1, 0.5] })], fx: [{ type: 'screws', x: 180, y: 280, n }], screen: clock(f, T(867), T(973), `02:00 · +${n} 🔩`) }; } },
  { f0: T(974), f1: T(1081), light: () => 'eve', dof: {},
    cam: [{ f: T(974), x: 0, y: -300, z: 0.85 }, { f: T(1081), x: 0, y: -320, z: 0.95 }],
    build(f) { return { world: ROOM, actors: [HM(-560, 320, { expr: 'bored', pose: 'hang', sweat: 1, tilt: 0.15, look: [1, 0] }), V(560, 300, { flip: -1, expr: 'bliss', pose: 'clap' })], fx: [{ type: 'bed', x: 0, y: 330, s: 0.7, mattress: true }, { type: 'sparkle', x: 0, y: -100, k: f > T(1040) ? 0.9 : 0 }], screen: clock(f, T(974), T(1081), '04:00 ✅') }; } },
  { f0: T(1082), f1: T(1157), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(1082), x: 0, y: -320, z: 1.2 }, { f: T(1157), x: 0, y: -330, z: 1.35 }],
    build(f) { const hug = f > T(1118); return { world: ROOM, actors: [HM(-120, 300, { expr: hug ? 'love' : 'bored', look: [1, 0], pose: hug ? 'cling' : 'hang' }), V(hug ? 90 : 220, 300, { flip: -1, expr: 'bliss', pose: hug ? 'cling' : 'clap', look: [-1, 0] })], fx: hug ? [{ type: 'hearts', x: 0, y: -620, n: 6 }] : [], screen: tag(f, T(1118), T(1157), 'UM ABRAÇO 🥰') }; } },
  { f0: T(1158), f1: T(1249), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(1158), x: 100, y: -330, z: 1.15 }, { f: T(1249), x: 100, y: -340, z: 1.3 }],
    build(f) { return { world: ROOM, actors: [HM(-150, 300, { expr: f > T(1204) ? 'shocked' : 'love', look: [1, 0], sweat: f > T(1204) ? 1 : 0 }), V(280, 300, { flip: -1, expr: 'mischief', pose: 'point', look: [-1, 0] })], fx: say(f, T(1160), 120, -800, 'AMANHÃ EU TE CHAMO\nPRO GUARDA-ROUPA! 😊', { fs: 44 }) }; } },
  { f0: T(1250), f1: TOTAL - 1, light: () => 'eve', dof: {},
    cam: [{ f: T(1250), x: 0, y: -400, z: 0.8 }, { f: TOTAL - 1, x: 0, y: -420, z: 0.9 }],
    kicks: [{ f: T(1265), a: 14 }],
    build(f) { return { world: ROOM, actors: [HM(-400, 330, { expr: 'scream', pose: 'cheeks', sweat: 1, look: [1, -0.4] })], fx: [{ type: 'wardrobe', x: 180, y: 330, k: pop(f, T(1256)) * 0.6 }], screen: tag(f, T(1265), TOTAL, 'DE 6 PORTAS 💀') }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
