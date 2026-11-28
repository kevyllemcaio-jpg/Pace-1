// "E se você fosse o único menino no acampamento das meninas?" — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1525);
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 && (!o.f1 || f < o.f1) ? [Object.assign({ type: 'speech', x, y, text, fs: 54, k: pop(f, f0), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
CAST.prof = Object.assign({}, CAST.diretora, { pj: '#3a86ff', pj2: '#9cc3ff', pants: '#1d3a7a', hc: '#5a3420' });
CAST.caio = { skin: '#8b5a3c', hair: 'cap', hc: '#1b1212', pj: '#2ec4b6', pj2: '#ffffff', pat: 'none', pants: '#1b4332', slip: '#ffffff', hand: '#8b5a3c' };

CAST.pai = Object.assign({}, CAST.zelador, { hc: '#3a86ff', pj: '#2a9d8f', pj2: '#8ee0d4', pants: '#264653' });
const GS = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);
// ---- cenário: acampamento ----
const _ds = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set !== 'camp') return _ds(ctx, st, cam, f);
  const night = st.night;
  const g = ctx.createLinearGradient(0, -2600, 0, -100); g.addColorStop(0, night ? '#0b1240' : '#5ec8ff'); g.addColorStop(1, night ? '#2b2f7a' : '#cdeeff'); ctx.fillStyle = g; ctx.fillRect(-3200, -2600, 6400, 2600);
  if (night) { for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,230,${0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i))})`; ctx.fillRect(-3000 + hash(i) * 6000, -2550 + hash(i + 3) * 1500, 6, 6); } ell(ctx, 900, -1900, 110, 110); paint(ctx, '#fff3c4', INK, wink(0.8)); }
  else { ell(ctx, 900, -1900, 130, 130); paint(ctx, '#ffd23f', INK, wink(0.8)); for (const [cx, cy] of [[-700, -1900], [200, -2150]]) for (const [dx, r] of [[-90, 70], [0, 100], [90, 70]]) { ell(ctx, cx + dx, cy, r, r * 0.75); paint(ctx, '#ffffff'); } }
  for (let i = 0; i < 30; i++) { const x = -3100 + i * 215, h = 600 + hash(i + 11) * 500; ctx.beginPath(); ctx.moveTo(x - 130, -100); ctx.lineTo(x, -100 - h); ctx.lineTo(x + 130, -100); ctx.closePath(); paint(ctx, night ? '#14324a' : (i % 2 ? '#2d6a4f' : '#40916c'), INK, wink(0.7)); }
  ctx.fillStyle = night ? '#1f4d3a' : '#74c69d'; ctx.fillRect(-3200, -100, 6400, 3000);
  ctx.fillStyle = night ? 'rgba(0,0,0,.15)' : 'rgba(40,110,60,.25)'; for (let i = 0; i < 160; i++) { const x = -3000 + hash(i) * 6000, y = -60 + hash(i + 5) * 1400; ctx.fillRect(x, y, 6, 22); }
  for (const t of st.tents || []) tent(ctx, t.x, t.y, t.s || 1, t.c || '#ff8fab');
};
function tent(ctx, x, y, s, c) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(0, -380); ctx.lineTo(260, 0); ctx.closePath(); paint(ctx, c, INK, wink()); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(0, -300); ctx.lineTo(70, 0); ctx.closePath(); paint(ctx, 'rgba(0,0,0,.35)', INK, wink(0.6)); ctx.restore(); }
const PINK = ['#ff8fab', '#ffb3c6', '#ff5fa2', '#f72585'];
const TENTS = (blue = true) => [-1500, -1150, -800, -450, -100, 250, 600, 950, 1300, 1650].map((x, i) => ({ x, y: -60 + (i % 2) * 40, s: 0.75, c: blue && i === 6 ? '#3a86ff' : PINK[i % 4] }));
function fire(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); for (const r of [-0.5, 0.5, 0]) { ctx.save(); ctx.rotate(r); rr(ctx, -120, -20, 240, 40, 16); paint(ctx, '#7a4a2a', INK, wink(0.7)); ctx.restore(); }
  if ((e.k == null ? 1 : e.k) > 0) { const k = e.k == null ? 1 : e.k; for (let i = 0; i < 3; i++) { const h = (160 - i * 40) * k * (1 + 0.15 * Math.sin(f * 0.6 + i)); ctx.beginPath(); ctx.moveTo(-80 + i * 25, 0); ctx.quadraticCurveTo(-60 + i * 20, -h * 0.6, 0, -h); ctx.quadraticCurveTo(60 - i * 20, -h * 0.6, 80 - i * 25, 0); ctx.closePath(); paint(ctx, ['#ff6b2b', '#ffa62b', '#ffe066'][i]); } } ctx.restore(); }
function beam(ctx, e, f) { ctx.save(); const a = Math.atan2(e.ty - e.y, e.tx - e.x), L = Math.hypot(e.tx - e.x, e.ty - e.y); ctx.translate(e.x, e.y); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, 'rgba(255,250,200,.85)'); g.addColorStop(1, 'rgba(255,250,200,.15)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(L, -90); ctx.lineTo(L, 90); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
function squirrel(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); const b = Math.sin(f * 0.4) * 6; ell(ctx, 70, -120 + b, 70, 130, 0.4); paint(ctx, '#c97c4a', INK, wink()); ell(ctx, 0, -80, 60, 75); paint(ctx, '#d98b56', INK, wink()); ell(ctx, -10, -170, 50, 48); paint(ctx, '#d98b56', INK, wink()); for (const sx of [-1, 1]) { ell(ctx, -10 + sx * 30, -215, 14, 22); paint(ctx, '#c97c4a', INK, wink(0.6)); } ell(ctx, -25, -178, 9, 11); paint(ctx, '#1c1222'); ell(ctx, 8, -178, 9, 11); paint(ctx, '#1c1222'); ell(ctx, -40, -100, 18, 16); paint(ctx, '#7a4a2a', INK, wink(0.5)); ctx.restore(); }
function bush(ctx, e, f) { ctx.save(); ctx.translate(e.x + (e.shake ? Math.sin(f * 2) * 14 : 0), e.y); for (const [dx, r] of [[-120, 110], [0, 150], [120, 110]]) { ell(ctx, dx, -r * 0.7, r, r * 0.8); paint(ctx, '#1b4332', INK, wink()); } ctx.restore(); }
function votes(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -420, -300, 840, 600, 14); paint(ctx, '#fffaf0', INK, wink()); LB(ctx, 'MELHOR CAMPISTA', 0, -220, 58, '#3a0ca3'); const n = e.n || 0; LB(ctx, 'BOLINHA:', -120, -40, 70, '#1c1222'); ctx.strokeStyle = '#d62839'; ctx.lineWidth = 10; for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), j = i % 5, x = 60 + g * 70 + j * 12; ctx.beginPath(); if (j === 4) { ctx.moveTo(x - 50, 80); ctx.lineTo(x + 2, 0); } else { ctx.moveTo(x, 0 + 70 - 70); ctx.lineTo(x, 80); } ctx.stroke(); } LB(ctx, n + ' VOTOS', 0, 200, 80, '#d62839'); ctx.restore(); }
function LB(ctx, t, x, y, fs, col) { ctx.fillStyle = col; ctx.font = `900 ${fs}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); }
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { const own = { fire, beam, squirrel, bush, votes }; _dfx(ctx, (fx || []).filter((e) => !own[e.type]), f); for (const e of fx || []) if (own[e.type]) own[e.type](ctx, e, f); };
const _dpB = drawProp;
drawProp = function (ctx, a, f) { if (a.type === 'backpack' && a.dy) { ctx.save(); ctx.translate(0, a.dy - (a.y - 330)); _dpB(ctx, a, f); ctx.restore(); return; } _dpB(ctx, a, f); };
const CAMP = (night, o = {}) => Object.assign({ set: 'camp', night, tents: TENTS() }, o);
const ring = (f, n, r, cx, cy, o = {}) => [...Array(n)].map((_, i) => { const a = Math.PI * (0.05 + 0.9 * i / (n - 1)); const x = cx + Math.cos(a) * r * 1.6, y = cy - Math.sin(a) * r * 0.35; return G(GS[i % GS.length], x, y, Object.assign({ flip: x > cx ? -1 : 1, look: [clamp((cx - x) / 400, -1, 1), 0.2], expr: 'grin', tilt: Math.sin(f * 0.3 + i) * 0.04 }, typeof o === 'function' ? o(i, x) : o)); });
const FIRE_L = (x = 0, y = 250) => [{ x, y: y - 120, r: 1300, i: 1, col: 'rgba(255,170,80,.45)' }];
const SHOTS = [
  { f0: 0, f1: T(118), light: () => 'eve', dof: {},
    cam: [{ f: 0, x: 0, y: -200, z: 0.85 }, { f: T(118), x: 0, y: -210, z: 0.98 }],
    build(f) { return { world: CAMP(true), actors: ring(f, 10, 520, 0, 200, { sit: true }).concat([B(-260, 420, { sit: true, expr: 'scared', sweat: 1, pose: 'cheeks', look: [1, 0] })]), fx: [{ type: 'fire', x: 150, y: 250, s: 0.7 }], screen: tag(f, T(40), T(118), 'SÓ EU DE MENINO?! 🏕️') }; } },
  { f0: T(119), f1: T(228), light: () => 'day', dof: {},
    cam: [{ f: T(119), x: 0, y: -380, z: 0.95 }, { f: T(228), x: 0, y: -400, z: 1.05 }],
    build(f) { return { world: CAMP(false), actors: [G('pai', 200, 300, { flip: -1, expr: 'proud', pose: 'wave', look: [-1, 0] }), B(-250, 330, { expr: 'bored', look: [1, -0.3] })], fx: [{ type: 'backpack', x: -380, y: 360 }], screen: tag(f, T(130), T(228), 'MEU PAI = MONITOR 📋') }; } },
  { f0: T(229), f1: T(282), light: () => 'day', dof: {},
    cam: [{ f: T(229), x: 0, y: -200, z: 0.8 }, { f: T(282), x: 0, y: -210, z: 0.88 }],
    build(f) { return { world: CAMP(false), actors: [...Array(10)].map((_, i) => G(GS[i % GS.length], -1350 + i * 300, 240 + (i % 2) * 120, { expr: 'grin', hop: Math.max(0, Math.sin(f * 0.3 + i)) * 80, pose: 'up', look: [0, 0] })), screen: tag(f, T(232), T(282), '20 MENINAS 😳') }; } },
  { f0: T(283), f1: T(356), light: () => 'day', dof: {},
    cam: [{ f: T(283), x: 0, y: -400, z: 0.5 }, { f: T(356), x: 0, y: -420, z: 0.55 }],
    build(f) { return { world: CAMP(false, { tents: TENTS(false) }), actors: [], fx: [{ type: 'sparkle', x: 0, y: -400, k: 0.6 }], screen: tag(f, T(290), T(356), '10 BARRACAS ROSA 💗') }; } },
  { f0: T(357), f1: T(423), light: () => 'day', dof: {},
    cam: [{ f: T(357), x: 0, y: -400, z: 0.55 }, { f: T(375), x: 0, y: -400, z: 0.55 }, { f: T(385), x: 600, y: -200, z: 1.2, e: 'o' }, { f: T(423), x: 600, y: -200, z: 1.3 }],
    kicks: [{ f: T(389), a: 8 }],
    build(f) { return { world: CAMP(false), actors: f > T(380) ? [B(820, 260, { flip: -1, expr: 'squint', pose: 'hips', look: [-1, 0] })] : [], screen: tag(f, T(389), T(423), 'A MINHA É AZUL 💙') }; } },
  { f0: T(424), f1: T(612), light: () => 'eve', dof: {},
    cam: [{ f: T(424), x: 0, y: -300, z: 0.7 }, { f: T(530), x: 0, y: -320, z: 0.8 }, { f: T(534), x: 0, y: -260, z: 1.0 }, { f: T(612), x: 0, y: -270, z: 1.1 }],
    build(f) { if (f < T(534)) return { world: CAMP(true), actors: ring(f, 8, 360, 0, 260, (i, x) => ({ expr: 'mischief', look: [clamp(-x / 200, -1, 1), 0.3], pose: i % 3 ? 'hang' : 'point' })), fx: [{ type: 'fire', x: 0, y: 300, s: 0.6 }, { type: 'note', x: 0, y: -500, a: 0.4, k: 0.4 }], screen: tag(f, T(426), T(534), 'NOITE 1 🤫') };
      return { world: CAMP(true), actors: [B(0, 330, { expr: 'bored', sweat: 1, pose: 'up', look: [0, -0.4], tilt: Math.sin(f * 0.3) * 0.06 })].concat([0, 1, 2, 3].map((i) => ({ type: 'backpack', x: (i % 2 ? 30 : -30) + Math.sin(f * 0.3) * 10, y: 331 + i, by: 0, layer: 'front', dy: -540 - i * 150 }))), fx: [], screen: tag(f, T(540), T(612), 'CARREGADOR 🎒') }; } },
  { f0: T(613), f1: T(769), light: () => 'eve', dof: {},
    cam: [{ f: T(613), x: 0, y: -300, z: 0.7 }, { f: T(769), x: 0, y: -320, z: 0.82 }],
    build(f) { const aim = sstep(prog(f, T(700), T(725))); const girls = [...Array(8)].map((_, i) => ({ x: -1150 + i * 330, y: 420 + (i % 2) * 120 })); return { world: CAMP(true), actors: [B(0, 120, { expr: aim > 0.5 ? 'scream' : 'mischief', pose: aim > 0.5 ? 'cheeks' : 'hang', look: [0, 0] })].concat(girls.map((p, i) => G(GS[i % GS.length], p.x, p.y, { flip: p.x > 0 ? -1 : 1, expr: 'mischief', pose: 'point', look: [clamp(-p.x / 300, -1, 1), -0.3] }))), fx: girls.map((p, i) => { const tx = lerp(p.x + Math.sin(f * 0.1 + i) * 600, 0, aim), ty = lerp(-900 + Math.cos(f * 0.08 + i) * 300, -250, aim); return { type: 'beam', x: p.x + (p.x > 0 ? -60 : 60), y: p.y - 300, tx, ty }; }), screen: tag(f, T(615), T(700), 'NOITE 2 🔦').concat(tag(f, T(720), T(769), 'TODAS EM MIM 😵')) }; } },
  { f0: T(770), f1: T(912), light: () => 'eve', dof: {},
    cam: [{ f: T(770), x: 0, y: -300, z: 0.8 }, { f: T(912), x: 0, y: -320, z: 0.9 }],
    build(f) { return { world: CAMP(true), actors: [B(-450, 330, { expr: 'scared', sweat: 1, look: [1, 0] }), G('bia', 150, 300, { flip: -1, expr: 'mischief', pose: 'point', look: [1, -0.2] }), G('lara', 450, 330, { flip: -1, expr: 'grin', pose: 'hips', look: [-1, 0] })], fx: [{ type: 'fire', x: -300, y: 380, s: 0.5, k: 0.4 }].concat(say(f, T(812), 200, -720, 'VAI BUSCAR LENHA.\nSOZINHO. 🪵', { fs: 64 })), screen: tag(f, T(772), T(812), 'NOITE 3 😈') }; } },
  { f0: T(913), f1: T(1028), light: () => 'eve', dof: {},
    cam: [{ f: T(913), x: 0, y: -300, z: 1.0 }, { f: T(1028), x: 150, y: -300, z: 1.15 }],
    kicks: [{ f: T(979), a: 10 }],
    build(f) { const w = walkTo(f, T(915), T(960), [-500, 330], [-50, 330]); return { world: CAMP(true, { tents: [] }), actors: [B(w.x, w.y, { walk: w.walk, flip: 1, expr: f > T(976) ? 'shocked' : 'scared', sweat: 1, pose: 'hold', look: [1, 0] })], fx: [{ type: 'beam', x: w.x + 60, y: w.y - 230, tx: w.x + 700, ty: w.y - 150 }, { type: 'bush', x: 450, y: 360, shake: f > T(976) }].concat(f > T(976) ? [{ type: 'exclaim', x: w.x, y: -620, k: pop(f, T(978)) * 0.6 }] : []), screen: tag(f, T(979), T(1028), 'CRAC... 🌿') }; } },
  { f0: T(1029), f1: T(1099), light: () => 'eve', dof: {},
    cam: [{ f: T(1029), x: 0, y: -300, z: 0.85 }, { f: T(1099), x: 200, y: -300, z: 0.9 }],
    build(f) { const w = walkTo(f, T(1032), T(1095), [-900, 330], [600, 330]); return { world: CAMP(true), actors: [B(w.x, w.y, { walk: w.walk ? w.walk * 1.8 : null, flip: 1, expr: 'scream', pose: 'up', sweat: 1, look: [1, 0] })], fx: [{ type: 'lines', x: w.x, y: -300, r: 200, k: 0.7 }], screen: tag(f, T(1058), T(1099), 'AAAAAAH! 😱') }; } },
  { f0: T(1100), f1: T(1192), light: () => 'eve', dof: {},
    cam: [{ f: T(1100), x: 0, y: -230, z: 0.75 }, { f: T(1192), x: 0, y: -240, z: 0.85 }],
    kicks: [{ f: T(1130), a: 14 }],
    build(f) { return { world: CAMP(true), actors: [...Array(10)].map((_, i) => { const a = f * 0.08 + i * 0.63; return G(GS[i % GS.length], Math.cos(a) * 800, 300 + Math.sin(a) * 180, { expr: 'scream', pose: 'up', flip: Math.sin(a) > 0 ? 1 : -1, walk: f * 0.6 + i, look: [0, -0.4] }); }).concat([B(0, 300, { expr: 'shocked', pose: 'cheeks', sweat: 1 })]), fx: [{ type: 'fire', x: 0, y: 380, s: 0.6 }], screen: tag(f, T(1130), T(1192), 'ELAS GRITARAM 🙉') }; } },
  { f0: T(1193), f1: T(1241), light: () => 'eve', dof: {},
    cam: [{ f: T(1193), x: 0, y: -200, z: 1.5 }, { f: T(1241), x: 0, y: -200, z: 1.7 }],
    build(f) { return { world: CAMP(true, { tents: [] }), actors: [], fx: [{ type: 'bush', x: 250, y: 300 }, { type: 'squirrel', x: -40, y: 260, s: 1.2 }, { type: 'hearts', x: -40, y: -200, n: 3 }], screen: tag(f, T(1203), T(1241), 'ERA UM ESQUILO 🐿️') }; } },
  { f0: T(1242), f1: T(1411), light: () => 'day', dof: {},
    cam: [{ f: T(1242), x: 0, y: -350, z: 0.65 }, { f: T(1340), x: 0, y: -380, z: 0.8 }, { f: T(1411), x: 0, y: -400, z: 0.85 }],
    build(f) { const n = Math.floor(prog(f, T(1300), T(1372)) * 20); return { world: CAMP(false), actors: [...Array(8)].map((_, i) => G(GS[i % GS.length], -1050 + i * 300, 420 + (i % 2) * 90, { expr: 'grin', pose: n > i * 2 ? 'raise' : 'hang', look: [0, -0.4] })).concat([B(0, 250, { expr: n > 10 ? 'proud' : 'surprised', look: [0, -0.5] })]), fx: [{ type: 'votes', x: 0, y: -900, s: 1.0, n }], screen: tag(f, T(1250), T(1340), 'ÚLTIMO DIA 🏆') }; } },
  { f0: T(1412), f1: TOTAL - 1, light: () => 'eve', dof: {},
    cam: [{ f: T(1412), x: 0, y: -260, z: 0.85 }, { f: TOTAL - 1, x: 0, y: -290, z: 1.0 }],
    build(f) { const lit = sstep(prog(f, T(1460), T(1480))); return { world: CAMP(true), actors: ring(f, 8, 480, 0, 230, { expr: lit > 0.5 ? 'proud' : 'surprised', pose: lit > 0.5 ? 'clap' : 'hang' }).concat([B(-160, 380, { expr: 'proud', pose: 'hero', look: [1, 0] })]), fx: [{ type: 'fire', x: 120, y: 360, s: 0.7, k: lit }].concat(lit > 0.5 ? [{ type: 'confetti', x: 0, y: -900, k: 0.6 }] : []), screen: tag(f, T(1460), TOTAL, 'SÓ ELE ACENDEU 🔥') }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
