// "E se só a sua crush pudesse ouvir os seus pensamentos?" — 1050 frames @30fps
const TOTAL = 1050;
const FLASHES = [699];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
// thought bubble over the boy (boy sits at 0,328)
const think = (f, f0, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'thought', x: -60, y: -740, w: 620, h: 300, hx: -20, hy: -470, k: pop(f, f0) * (o.f1 ? 1 - prog(f, o.f1 - 5, o.f1) : 1), text, fs: 60, tcol: '#d62839' }, o)] : []);
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const CLASSMATES = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana'];
// classroom; crush (sofia) sits at 410,340 to the boy's right
function room(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy))); return; }
    if (x === 410 && y === 340) { if (o.crush !== false) A.push(G('sofia', 410, y - 12, Object.assign({ sit: true, uniform: true, flip: -1 }, o.crush))); return; }
    const w = CLASSMATES[gi++ % CLASSMATES.length];
    A.push(G(w, x, y - 12, { sit: true, uniform: true, expr: i % 3 ? 'happy' : 'bored', look: [0, -0.4], tilt: Math.sin(f * 0.04 + i) * 0.03 }));
  });
  return A;
}
const _drawProp17 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'bilhete') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0); const k = a.s || 1; ctx.scale(k, k); rr(ctx, -380, -300, 760, 600, 14); paint(ctx, '#fff8e1', INK, wink() / k); ctx.strokeStyle = 'rgba(80,120,200,.35)'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-340, -170 + i * 80); ctx.lineTo(340, -170 + i * 80); ctx.stroke(); }
    ctx.fillStyle = '#d62839'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '700 74px "Comic Sans MS", "Comic Neue", cursive'; ctx.fillText('EU OUVI TUDO 🙈', 0, -150); if ((a.line2 || 0) > 0) { ctx.globalAlpha = a.line2; ctx.fillText('A RESPOSTA É...', 0, 10); ctx.font = '700 100px "Comic Sans MS", "Comic Neue", cursive'; ctx.fillText('TALVEZ ❤', 0, 160); } ctx.restore(); return; }
  if (a.type === 'cookie') { ctx.save(); ctx.translate(a.x, a.y); ell(ctx, 0, 0, 70, 70); paint(ctx, '#d4a373', INK, wink()); for (let i = 0; i < 6; i++) { ell(ctx, Math.cos(i * 1.7) * 38, Math.sin(i * 2.3) * 38, 10, 9); paint(ctx, '#5a3a22'); } ctx.restore(); return; }
  _drawProp17(ctx, a, f);
};

const SHOTS = [
  // 1 — hook: she hears everything
  { f0: 0, f1: 109, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 200, y: -260, z: 1.25 }, { f: 109, x: 200, y: -280, z: 1.45 }],
    build(f) { return { world: { set: 'class', board: 'AULA DE\nCIÊNCIAS' }, actors: room(f, { boy: { expr: 'scared', sweat: 1, look: [1, 0] }, crush: { expr: 'mischief', look: [-1, 0] } }), fx: think(f, 14, 'ELA OUVE\nTUDO?!', { fs: 64, shake: 4, x: 160, w: 560 }), screen: tag(f, 40, 109, 'SÓ ELA OUVE!', 1500) }; } },
  // 2 — she sits next to you
  { f0: 110, f1: 179, light: () => 'day', dof: {},
    cam: [{ f: 110, x: 150, y: -240, z: 0.95 }, { f: 179, x: 200, y: -260, z: 1.1 }],
    build(f) { const w = walkTo(f, 110, 150, [1300, 300], [410, 300]); const A = room(f, { boy: { expr: 'happy', look: [1, 0] }, crush: f < 152 ? false : { expr: 'happy', look: [-0.3, 0] } }); if (f < 152) A.push(G('sofia', w.x, w.y, { walk: w.walk, expr: 'happy', flip: -1, uniform: true }));
      return { world: { set: 'class', board: 'AULA DE\nCIÊNCIAS' }, actors: A, fx: f > 150 ? [{ type: 'sparkle', x: 410, y: -360, k: 0.6 * Math.sin(prog(f, 150, 172) * Math.PI) }] : [] }; } },
  // 3 — you think: she's beautiful
  { f0: 180, f1: 245, light: () => 'dream', dof: { room: 4 },
    cam: [{ f: 180, x: 180, y: -330, z: 1.45 }, { f: 245, x: 180, y: -340, z: 1.6 }],
    build(f) { return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'love', look: [1, 0] }, crush: { expr: 'happy', look: [0, -0.5] } }), fx: think(f, 200, 'ELA É\nLINDA ❤').concat([{ type: 'hearts', x: 0, y: -420, n: 4, k: prog(f, 205, 215) }]) }; } },
  // 4 — she looks at you
  { f0: 246, f1: 298, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 246, x: 410, y: -360, z: 1.8 }, { f: 256, x: 400, y: -380, z: 2.3, e: 'o' }, { f: 298, x: 400, y: -380, z: 2.4 }],
    kicks: [{ f: 254, a: 8 }],
    build(f) { const t = sstep(prog(f, 250, 258)); return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'shocked', look: [1, 0] }, crush: { expr: t > 0.5 ? 'surprised' : 'happy', look: [lerp(0, -1, t), 0] } }), fx: f > 258 ? [{ type: 'exclaim', x: 410, y: -560, k: pop(f, 258) * 0.6 }] : [] }; } },
  // 5 — don't look, don't look, don't look!
  { f0: 299, f1: 405, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 299, x: 0, y: -380, z: 1.9 }, { f: 405, x: 0, y: -400, z: 2.1 }],
    build(f) { const n = f < 325 ? 0 : f < 346 ? 1 : f < 367 ? 2 : 3; const txt = ['NÃO OLHA!', 'NÃO OLHA!\nNÃO OLHA!', 'NÃO OLHA! NÃO OLHA!\nNÃO OLHA!'][Math.max(0, n - 1)];
      return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'scared', sweat: 1, look: [-1, 0], pose: 'cheeks' }, crush: { expr: 'mischief', look: [-1, 0] } }), fx: f >= 325 ? think(f, 325, txt, { shake: 6, fs: 40, w: 540, h: 260, x: 0 }) : [] }; } },
  // 6 — she smiles
  { f0: 406, f1: 447, light: () => 'dream', dof: { room: 5 },
    cam: [{ f: 406, x: 410, y: -380, z: 2.2 }, { f: 447, x: 410, y: -390, z: 2.45 }],
    build(f) { return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'scared', look: [1, 0] }, crush: { expr: 'bliss', look: [-1, 0], tilt: -0.08 } }), fx: [{ type: 'sparkle', x: 520, y: -600, k: 0.6 * Math.sin(prog(f, 410, 440) * Math.PI) }, { type: 'sparkle', x: 300, y: -560, k: 0.5 * Math.sin(prog(f, 416, 446) * Math.PI) }] }; } },
  // 7 — try to think about math: 2 + 2 = ... her
  { f0: 448, f1: 582, light: () => 'day', dof: { room: 2 },
    cam: [{ f: 448, x: 0, y: -900, z: 0.85 }, { f: 516, x: 0, y: -560, z: 1.25 }, { f: 582, x: 0, y: -480, z: 1.6 }],
    build(f) { const txt = f < 549 ? '2 + 2 = ...' : '2 + 2 =\nELA ❤'; return { world: { set: 'class', board: '2 + 2 = ?' }, actors: room(f, { boy: { expr: f < 549 ? 'squint' : 'love', look: [0, -0.6] }, crush: { expr: 'grin', look: [-1, 0] } }), fx: f >= 517 ? think(f, 517, txt, { fs: 64 }).concat(f >= 549 ? [{ type: 'hearts', x: 0, y: -420, n: 5 }] : []) : [] }; } },
  // 8 — break time: she offers you a cookie
  { f0: 583, f1: 662, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 583, x: 0, y: -380, z: 1.05 }, { f: 662, x: 0, y: -400, z: 1.2 }],
    build(f) { const off = sstep(prog(f, 610, 626)); return { world: { set: 'yard' }, actors: [B(-240, 320, { expr: 'surprised', look: [1, 0] }), G('sofia', 240, 320, { expr: 'happy', look: [-1, 0], flip: -1, uniform: true, pose: { L: [12, 6], R: [lerp(12, 80, off), lerp(6, -10, off)] } }), ...(off > 0.5 ? [{ type: 'cookie', x: lerp(160, 30, off), y: -260, layer: 'front' }] : [])] }; } },
  // 9 — your brain screams: MARRY ME!
  { f0: 663, f1: 741, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 663, x: -160, y: -420, z: 1.25 }, { f: 699, x: -160, y: -470, z: 1.35 }, { f: 704, x: -120, y: -520, z: 1.05, e: 'o' }, { f: 741, x: -100, y: -520, z: 1.0 }],
    kicks: [{ f: 699, a: 16 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(-240, 320, { expr: f < 699 ? 'love' : 'scream', look: [1, -0.3], pose: f >= 699 ? 'up' : 'hang' }), G('sofia', 240, 320, { expr: f < 699 ? 'happy' : 'shocked', look: [-1, 0], flip: -1, uniform: true }), { type: 'cookie', x: 30, y: -260, layer: 'front' }],
      fx: f >= 699 ? [{ type: 'thought', x: -160, y: -1080, w: 900, h: 380, hx: -220, hy: -640, k: pop(f, 699), text: 'CASA\nCOMIGO!', fs: 110, tcol: '#d62839', shake: 8 }] : [{ type: 'hearts', x: -240, y: -560, n: 4 }] }; } },
  // 10 — she chokes laughing
  { f0: 742, f1: 800, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 742, x: 240, y: -360, z: 1.6 }, { f: 800, x: 240, y: -380, z: 1.75 }],
    build(f) { return { world: { set: 'yard' }, actors: [B(-240, 320, { expr: 'shocked', look: [1, 0] }), G('sofia', 240, 320, { expr: 'laugh', look: [-1, -0.3], flip: -1, uniform: true, pose: 'cheeks', hop: Math.abs(Math.sin(f * 0.5)) * 30, tilt: Math.sin(f * 0.4) * 0.1 })], fx: [{ type: 'sparkle', x: 240, y: -600, k: 0.5 }] }; } },
  // 11 — end of class: she passes you a note
  { f0: 801, f1: 902, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 801, x: 200, y: -260, z: 1.25 }, { f: 845, x: 150, y: -320, z: 1.35 }, { f: 852, x: 0, y: -380, z: 1.0 }, { f: 902, x: 0, y: -380, z: 1.05 }],
    build(f) { if (f < 852) { const t = sstep(prog(f, 828, 846)); return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'worried', look: [1, 0] }, crush: { expr: 'mischief', look: [-1, 0], pose: { L: [12, 6], R: [lerp(12, 90, t), lerp(6, -10, t)] } } }), fx: [] }; }
      return { world: { set: 'class' }, actors: [{ type: 'bilhete', x: 0, y: -380, s: 1.1, rot: -0.04 + Math.sin(f * 0.05) * 0.01, layer: 'front' }], fx: [] }; } },
  // 12 — "the answer is... maybe"
  { f0: 903, f1: 975, light: () => 'dream', dof: { room: 3 },
    cam: [{ f: 903, x: 0, y: -380, z: 1.05 }, { f: 975, x: 0, y: -380, z: 1.15 }],
    build(f) { return { world: { set: 'class' }, actors: [{ type: 'bilhete', x: 0, y: -380, s: 1.1, rot: -0.04, line2: prog(f, 910, 930), layer: 'front' }], fx: f > 939 ? [{ type: 'hearts', x: 0, y: -100, n: 6 }] : [] }; } },
  // 13 — you fainted
  { f0: 976, f1: TOTAL - 1, light: () => 'dream', dof: { room: 3 },
    cam: [{ f: 976, x: 150, y: -300, z: 1.2 }, { f: TOTAL - 1, x: 150, y: -320, z: 1.35 }],
    kicks: [{ f: 994, a: 10 }],
    build(f) { const fall = sstep(prog(f, 982, 994)); return { world: { set: 'class' }, actors: room(f, { boy: { expr: 'love', look: [0, -1], rot: -fall * 0.9 }, crush: { expr: 'laugh', look: [-1, 0], pose: 'cheeks' } }), fx: [{ type: 'hearts', x: -80, y: -520, n: 7 }], screen: tag(f, 994, TOTAL, 'DESMAIOU ❤', 1500) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
