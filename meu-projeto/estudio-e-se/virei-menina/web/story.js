// "E se você virasse uma menina?" — horizontal, 3374 frames
const TOTAL = 3374;
const FLASHES = [365, 2970];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
const card = (f, f0, text) => [{ type: 'day', text, k: f < f0 + 60 ? pop(f, f0, f0 + 10) : 1 - prog(f, f0 + 60, f0 + 70) }];
const sp = (x, y, k = 0.4, col) => ({ type: 'sparkle', x, y, k, col });
const SEATS = [];
[[110, [-1300, -760, -380, 380, 760, 1300]], [340, [-1400, -820, -410, 0, 410, 820, 1400]], [580, [-1500, -880, -440, 440, 880, 1500]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const ALLG = ['lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
function classroom(f, boy) { const A = []; let gi = 0; SEATS.forEach(([x, y]) => { A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' }); if (x === 0 && y === 340) { A.push(G(boy.who, 0, 328, Object.assign({ sit: true }, boy))); return; } A.push(G(ALLG[gi++ % ALLG.length], x, y - 12, { sit: true, uniform: true, expr: 'happy', look: [0, -0.3] })); }); return A; }
// comb stuck in the cat (final gag)
const _dp = drawProp; drawProp = function (ctx, a, f) { if (a.type === 'combItem') { ctx.save(); ctx.translate(a.x, a.y + 1); ctx.rotate(a.rot || 0.4); ctx.scale(a.sc || 1, a.sc || 1); rr(ctx, -45, -9, 90, 18, 5); paint(ctx, '#ff5fa2', INK, wink(0.8)); for (let i = 0; i < 9; i++) { ctx.fillStyle = '#ff5fa2'; ctx.fillRect(-40 + i * 9.5, 7, 4, 20); } ctx.restore(); return; } _dp(ctx, a, f); };

const SHOTS = [
  // hook
  { f0: 0, f1: 89, light: () => 'day', dof: { room: 4 }, cam: [{ f: 0, x: 0, y: -60, z: 1.35 }, { f: 89, x: 0, y: -70, z: 1.5 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [G('boyL', -150, 330, { expr: 'shocked', pose: 'comb', props: { comb: 1, hbrush: 1 }, sweat: 1, look: [0.3, -0.6] }), G('bia', 250, 320, { expr: 'laugh', pose: 'cheeks', look: [-1, 0], flip: -1 })] }; } },
  // night: shooting star, the wish
  { f0: 90, f1: 245, light: () => 'dark', dof: {}, cam: [{ f: 90, x: 400, y: -880, z: 0.85 }, { f: 245, x: 300, y: -800, z: 0.95 }],
    build(f) { return { world: { set: 'bedroom', sun: 0 }, actors: [G('boy', -180, -60, { sit: true, expr: f > 170 ? 'surprised' : 'bored', look: [1, -0.6] }), { type: 'blanket', x: -180, y: 60, layer: 'front' }], fx: [{ type: 'shoot', t: prog(f, 158, 192), x0: 420, y0: -1460, x1: 1100, y1: -1150 }], lights: [{ x: 760, y: -1150, r: 700, i: 0.8, col: 'rgba(150,180,255,.3)' }, { x: -180, y: -430, r: 360, i: 0.7 }] }; } },
  { f0: 246, f1: 364, light: () => 'dark', dof: { room: 4 }, cam: [{ f: 246, x: -60, y: -380, z: 1.3 }, { f: 364, x: -100, y: -400, z: 1.5 }],
    build(f) { return { world: { set: 'bedroom', sun: 0 }, actors: [G('boy', -180, -60, { sit: true, expr: f > 300 ? 'worried' : 'happy', look: [1, -0.6] }), { type: 'blanket', x: -180, y: 60, layer: 'front' }], fx: [{ type: 'speech', x: 330, y: -500, text: 'QUERIA ENTENDER\nA MINHA IRMÃ', fs: 44, k: pop(f, 248) * (1 - prog(f, 300, 306)), tx: -200 }].concat(f > 300 ? [{ type: 'magic', x: -180, y: -480, r: 300 }] : []), lights: [{ x: -180, y: -430, r: 500, i: 0.8, col: 'rgba(255,200,240,.3)' }] }; } },
  // 7:00 wake up with long hair
  { f0: 365, f1: 499, light: () => 'day', dof: {}, cam: [{ f: 365, x: 0, y: -330, z: 1.0 }, { f: 499, x: -100, y: -330, z: 1.2 }], kicks: [{ f: 437, a: 16 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [G('boyL', -180, -60, { sit: true, expr: f > 435 ? 'scream' : 'bored', look: [0, 0] }), { type: 'blanket', x: -180, y: 60, layer: 'front' }], fx: f > 437 && f < 470 ? [{ type: 'lines', x: -180, y: -460, r: 200, k: 0.9 }] : [], screen: card(f, 367, '7:00') }; } },
  // comb stuck, then brush stuck
  { f0: 500, f1: 751, light: () => 'day', dof: { room: 4 }, cam: [{ f: 500, x: -60, y: -60, z: 1.4 }, { f: 751, x: -60, y: -80, z: 1.6 }],
    build(f) { const tug = f >= 560 ? Math.sin(f * 0.9) * 0.08 : 0; return { world: { set: 'bedroom', sun: 1 }, actors: [G('boyL', -100, 330, { pose: f < 600 ? 'comb' : { L: [165, -40], R: [165, -40] }, props: { comb: f >= 552 ? 1 : 0, hbrush: f >= 690 ? 1 : 0 }, expr: f > 552 ? (f > 690 ? 'shocked' : 'squint') : 'neutral', tilt: tug, sweat: f > 600 ? 1 : 0 })], fx: f >= 572 && f < 590 ? [{ type: 'exclaim', x: 200, y: -420, k: pop(f, 572) * 0.5, txt: 'PRESO!' }] : [] }; } },
  // 7:30 Bia: "sit down"
  { f0: 752, f1: 943, light: () => 'day', dof: {}, cam: [{ f: 752, x: 60, y: 0, z: 1.1 }, { f: 943, x: 60, y: -20, z: 1.2 }],
    build(f) { const w = walkTo(f, 780, 820, [900, 320], [300, 320]); return { world: { set: 'bedroom', sun: 1 }, actors: [G('boyL', -150, 330, { props: { comb: 1, hbrush: 1 }, expr: 'worried', look: [1, 0] }), G('bia', w.x, w.y, { walk: w.walk, expr: f > 860 ? 'stern' : 'neutral', pose: f > 860 ? 'hips' : 'hang', look: [-1, 0], flip: -1 })], fx: [{ type: 'speech', x: 450, y: -380, text: 'SENTA AÍ.', k: pop(f, 903), tx: -60 }], screen: card(f, 754, '7:30') }; } },
  // five minutes later: perfect braids and a bow
  { f0: 944, f1: 1196, light: () => 'dream', dof: { room: 4 }, cam: [{ f: 944, x: 50, y: -40, z: 1.3 }, { f: 1196, x: 50, y: -60, z: 1.45 }],
    build(f) { const done = f >= 990; return { world: { set: 'bedroom', sun: 1 }, actors: [G(done ? 'boyT' : 'boyL', -150, 330, { expr: done ? (f > 1062 ? 'surprised' : 'proud') : 'worried', look: [1, -0.3], pose: f > 1120 ? 'shrug' : 'hang' }), G('bia', 250, 320, { expr: f > 1133 ? 'neutral' : 'proud', pose: f > 1133 ? 'shrug' : 'hips', look: [-1, 0], flip: -1 })], fx: done && f < 1040 ? [{ type: 'magic', x: -150, y: -110, r: 260 }] : [], screen: f >= 946 ? [{ type: 'tag', text: '5 MINUTOS DEPOIS', k: pop(f, 946) * (1 - prog(f, 1000, 1010)), y: 140 }] : [] }; } },
  // 8:00 school: "you look neater today" — "thanks?"
  { f0: 1197, f1: 1527, light: () => 'day', dof: {}, cam: [{ f: 1197, x: -300, y: -300, z: 0.75 }, { f: 1400, x: -250, y: -250, z: 0.85 }, { f: 1527, x: -200, y: -200, z: 0.9 }],
    build(f) { const A = classroom(f, { who: 'boyT', expr: f > 1485 ? 'squint' : 'neutral', look: [-1, -0.3] }); A.push(G('prof', -900, -10, { s: 0.48, expr: 'happy', pose: 'point', look: [1, 0.3] })); return { world: { set: 'class', board: 'CHAMADA' }, actors: A, fx: [{ type: 'speech', x: -900, y: -720, text: 'HOJE VOCÊ VEIO\nMAIS ARRUMADO!', fs: 40, k: pop(f, 1404), tx: 0 }, { type: 'speech', x: 250, y: -520, text: 'OBRIGADO?', k: pop(f, 1489), tx: -120 }], screen: card(f, 1199, '8:00') }; } },
  // 10:00 PE: hair in the face; every girl has 3 hair ties
  { f0: 1528, f1: 1821, light: () => 'day', dof: {}, cam: [{ f: 1528, x: 0, y: -200, z: 0.9 }, { f: 1821, x: 100, y: -200, z: 1.0 }],
    build(f) { const x = lerp(-700, 600, prog(f, 1560, 1700)); return { world: { set: 'quadra', plain: true, banner: 'EDUCAÇÃO FÍSICA' }, actors: [G('boyL', x, 330, { walk: f * 0.9, pose: 'run', expr: 'squint', tilt: Math.sin(f * 0.5) * 0.2, sweat: 1 }), G('rita', x - 400, 300, { uniform: true, walk: f * 0.9 + 1, pose: 'run', expr: 'happy' })], screen: card(f, 1530, '10:00') }; } },
  { f0: 1822, f1: 1934, light: () => 'day', dof: {}, cam: [{ f: 1822, x: 0, y: -100, z: 1.05 }, { f: 1934, x: 0, y: -110, z: 1.15 }],
    build(f) { const A = []; ['lara', 'rita', 'duda', 'nina', 'joana'].forEach((w, i) => A.push(G(w, -900 + i * 450, 300 + (i % 2) * 30, { uniform: true, pose: 'wrists', props: { bands: 1 }, expr: 'happy', hop: f > 1858 ? Math.max(0, Math.sin(f * 0.3 + i)) * 12 : 0 }))); return { world: { set: 'quadra', plain: true, banner: 'EDUCAÇÃO FÍSICA' }, actors: A, screen: [{ type: 'tag', text: '3 NO PULSO. SEMPRE.', k: pop(f, 1862), y: 140 }] }; } },
  // 12:00 lunch with Sofia
  { f0: 1935, f1: 2342, light: () => 'day', dof: { room: 3 }, cam: [{ f: 1935, x: 150, y: -60, z: 1.15 }, { f: 2200, x: 150, y: -60, z: 1.3 }, { f: 2342, x: 120, y: -50, z: 1.45 }],
    build(f) { const ic = f >= 2089 ? (f < 2113 ? 'note' : f < 2138 ? 'book' : 'dog') : null; return { world: { set: 'lunch' }, actors: [G('boyL', 0, 330, { sit: true, props: { tie: f > 2020 ? 1 : 0 }, expr: f > 2229 ? 'laugh' : 'happy', look: [1, 0], blush: f > 2265 ? 0.4 : 0 }), G('sofia', 330, 330, { uniform: true, sit: true, pose: f > 2010 && f < 2040 ? { L: [12, 6], R: [85, -10] } : 'hang', expr: f > 2180 ? 'laugh' : 'happy', look: [-1, 0], flip: -1 }), { type: 'table', x: 150, y: 430, s: 1, layer: 'front', trays: [0, 330] }], fx: (ic ? [{ type: 'thought', x: 560, y: -330, w: 300, h: 200, hx: 330, hy: -330, k: 0.9, icons: [[ic, 0, 0, 70]] }] : []).concat(f > 2229 ? [sp(-80, -380, 0.3, '#ff9fd0')] : []), screen: card(f, 1937, '12:00') }; } },
  // 16:00 the sibling secret code + mom's baby photos
  { f0: 2343, f1: 2798, light: () => 'eve', dof: {}, cam: [{ f: 2343, x: -600, y: -80, z: 1.0 }, { f: 2620, x: -600, y: -80, z: 1.1 }, { f: 2798, x: -500, y: -100, z: 0.95 }],
    build(f) { const mom = f >= 2690; const look1 = f >= 2480 && f < 2540, look2 = f >= 2544 && f < 2610; const panic = f >= 2630; const A = [G('boyT', -900, 330, { expr: panic ? 'worried' : 'neutral', look: [1, 0], sweat: panic ? 1 : 0 }), G('bia', -500, 320, { expr: panic ? 'squint' : 'stern', look: [-1, 0], pose: look1 || look2 ? { L: [12, 6], R: [140, -60] } : 'hang', flip: -1 })]; if (mom) A.push(G('mom', -100, 300, { s: 0.48, pose: 'album', props: { album: 1 }, expr: 'laugh', look: [-1, 0], flip: -1 })); const scr = []; if (look1) scr.push({ type: 'tag', text: '1 OLHAR = SOCORRO', k: pop(f, 2482), y: 140 }); if (look2) scr.push({ type: 'tag', text: '2 OLHARES = VAMOS EMBORA', k: pop(f, 2546), y: 140 }); return { world: { set: 'room', door: 0 }, actors: A, fx: panic && f < 2690 ? [{ type: 'exclaim', x: -700, y: -380, k: 0.6, txt: '👀' }] : [], screen: card(f, 2345, '16:00').concat(scr) }; } },
  // 21:00 another shooting star
  { f0: 2799, f1: 2969, light: () => 'dark', dof: {}, cam: [{ f: 2799, x: 400, y: -880, z: 0.85 }, { f: 2969, x: 300, y: -800, z: 0.95 }],
    build(f) { return { world: { set: 'bedroom', sun: 0 }, actors: [G('boyT', -180, -60, { sit: true, expr: f > 2900 ? 'bliss' : 'surprised', look: [1, -0.6] }), { type: 'blanket', x: -180, y: 60, layer: 'front' }], fx: [{ type: 'shoot', t: prog(f, 2850, 2885), x0: 420, y0: -1460, x1: 1100, y1: -1150 }].concat(f > 2930 ? [{ type: 'magic', x: -180, y: -480, r: 280 }] : []), lights: [{ x: 760, y: -1150, r: 700, i: 0.8, col: 'rgba(150,180,255,.3)' }, { x: -180, y: -430, r: 360, i: 0.7 }], screen: card(f, 2801, '21:00') }; } },
  // next day: hair gone; still sits by Sofia; understands Bia with a look
  { f0: 2970, f1: 3204, light: () => 'day', dof: {}, cam: [{ f: 2970, x: 150, y: -60, z: 1.15 }, { f: 3130, x: 150, y: -60, z: 1.25 }, { f: 3204, x: 400, y: -80, z: 1.0 }],
    build(f) { const bia = f >= 3140; return { world: { set: 'lunch' }, actors: [G('boy', 0, 330, { sit: true, expr: 'happy', look: bia ? [1, -0.2] : [1, 0], blush: 0.3 }), G('sofia', 330, 330, { uniform: true, sit: true, expr: 'laugh', look: [-1, 0], flip: -1 }), { type: 'table', x: 150, y: 430, s: 1, layer: 'front', trays: [0, 330] }].concat(bia ? [G('bia', 900, 200, { uniform: true, expr: 'mischief', look: [-1, 0], flip: -1 })] : []), screen: card(f, 2972, 'NO DIA SEGUINTE') }; } },
  // and the comb? nobody found it (the cat walks by with it)
  { f0: 3205, f1: TOTAL - 1, light: () => 'eve', dof: {}, cam: [{ f: 3205, x: -500, y: -80, z: 1.1 }, { f: TOTAL - 1, x: -450, y: -60, z: 1.25 }],
    build(f) { const cx = lerp(-1300, 100, prog(f, 3270, 3360)); return { world: { set: 'room', door: 0 }, actors: [G('boy', -700, 330, { expr: f > 3240 ? 'squint' : 'neutral', look: [Math.sin(f * 0.1), 0], pose: 'shrug' }), { who: 'cat', cat: true, x: cx, y: 380, s: 0.5, layer: 'front', happy: true }, { type: 'combItem', x: cx + 30, y: 380 - 0.5 * 250, rot: 0.6, sc: 1.8, layer: 'front' }], fx: f < 3260 ? [{ type: 'exclaim', x: -700, y: -380, k: pop(f, 3212) * 0.6, txt: '?' }] : [] }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
