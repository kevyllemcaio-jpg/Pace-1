// "E se a sua crush fosse embora pra sempre?" (drama) — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1790);
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

CAST.paiB = Object.assign({}, CAST.zelador, { hc: '#2b1b1e', pj: '#e76f51', pj2: '#f4a261', pants: '#264653', mustache: false });
function LB(ctx, t, x, y, fs, col, font = 'Arial Black, Arial', w = 900) { ctx.fillStyle = col; ctx.font = `${w} ${fs}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); }
const FX = {
  truck(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -700, -1000, 1000, 860, 20); paint(ctx, '#f1f3f5', INK, wink()); LB(ctx, 'MUDANÇAS', -200, -640, 110, '#e63946'); LB(ctx, 'RÁPIDAS', -200, -500, 80, '#3a86ff');
    rr(ctx, 300, -760, 420, 620, [60, 20, 0, 0]); paint(ctx, '#e63946', INK, wink()); rr(ctx, 400, -700, 260, 220, 20); paint(ctx, '#bde0fe', INK, wink(0.8)); rr(ctx, -720, -160, 1460, 60, 10); paint(ctx, '#495057', INK, wink());
    for (const wx of [-480, -200, 520]) { ell(ctx, wx, -90, 110, 110); paint(ctx, '#212529', INK, wink()); ell(ctx, wx, -90, 45, 45); paint(ctx, '#adb5bd', INK, wink(0.6)); } ctx.restore(); },
  box(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -150, -260, 300, 260, 6); paint(ctx, '#c9a26b', INK, wink()); rr(ctx, -150, -260, 300, 50, 6); paint(ctx, '#b88a50', INK, wink(0.6)); if (e.t) LB(ctx, e.t, 0, -120, 46, '#5a3a1a'); ctx.restore(); },
  mattress(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -330, -120, 660, 140, 40); paint(ctx, '#ffffff', INK, wink()); for (let i = -2; i <= 2; i++) { ell(ctx, i * 110, -50, 10, 10); paint(ctx, '#dee2e6'); } ctx.restore(); },
  bikeP(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.flip || 1, 1); ctx.scale(e.s || 1, e.s || 1); const c = e.col || '#ff5fa2'; for (const wx of [-260, 260]) { ell(ctx, wx, -170, 170, 170); paint(ctx, null, '#1c1222', wink(2.4)); ctx.save(); ctx.translate(wx, -170); ctx.rotate((e.spin || 0)); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(160, 0); paint(ctx, null, '#adb5bd', wink(0.5)); } ctx.restore(); }
    ctx.beginPath(); ctx.moveTo(-260, -170); ctx.lineTo(-40, -170); ctx.lineTo(120, -420); ctx.lineTo(-100, -420); ctx.closePath(); ctx.moveTo(-40, -170); ctx.lineTo(-120, -470); ctx.moveTo(260, -170); ctx.lineTo(160, -520); paint(ctx, null, c, wink(3)); rr(ctx, -190, -500, 160, 40, 20); paint(ctx, '#1c1222', INK, wink(0.6)); rr(ctx, 120, -560, 120, 30, 15); paint(ctx, '#1c1222', INK, wink(0.6)); ctx.restore(); },
  letter(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -110, -150, 220, 300, 6); paint(ctx, '#fffaf0', INK, wink()); ctx.strokeStyle = 'rgba(60,60,120,.5)'; ctx.lineWidth = 6; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-80, -100 + i * 40); ctx.lineTo(80 - (i === 5) * 70, -100 + i * 40); ctx.stroke(); } ctx.fillStyle = '#ff4d6d'; heart(ctx, 50, 110, 22); ctx.restore(); },
  drawing(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -330, -240, 660, 480, 8); paint(ctx, '#ffffff', INK, wink()); ell(ctx, 200, -130, 60, 60); paint(ctx, '#ffd23f', INK, wink(0.6));
    for (const [x, c] of [[-120, '#3a86ff'], [60, '#ff5fa2']]) { ell(ctx, x, -20, 50, 50); paint(ctx, '#ffe0c2', INK, wink(0.6)); ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, 130); ctx.moveTo(x - 50, 70); ctx.lineTo(x + 50, 70); paint(ctx, null, c, wink(1.2)); }
    ctx.fillStyle = '#ff4d6d'; heart(ctx, -30, -90, 30); ctx.fillStyle = '#ff4d6d'; ctx.font = '700 44px Comic Sans MS, Arial'; ctx.textAlign = 'center'; ctx.fillText('PRA BIA', -30, 200); ctx.restore(); },
  page(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -380, -480, 760, 960, 10); paint(ctx, '#fffaf0', INK, wink()); ctx.strokeStyle = 'rgba(80,120,200,.35)'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(-340, -380 + i * 70); ctx.lineTo(340, -380 + i * 70); ctx.stroke(); }
    const L = e.lines || [], n = e.chars == null ? 999 : e.chars; let used = 0; ctx.fillStyle = e.col || '#2b2140'; ctx.font = `700 ${e.fs || 54}px Comic Sans MS, Arial`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    L.forEach((l, i) => { const s = l.slice(0, Math.max(0, n - used)); used += l.length; ctx.fillText(s, -320, -390 + i * (e.fs || 54) * 1.3); }); if (e.heart) { ctx.fillStyle = '#ff4d6d'; heart(ctx, 0, 330, 60); } ctx.restore(); },
  cardoor(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.beginPath(); ctx.rect(-1400, -1600, 2800, 2600); ctx.moveTo(-430, -1030); ctx.lineTo(430, -1030); ctx.lineTo(430, -330); ctx.lineTo(-430, -330); ctx.closePath(); ctx.fillStyle = e.col || '#3a86ff'; ctx.fill('evenodd');
    rr(ctx, -450, -1050, 900, 740, 30); paint(ctx, null, INK, wink(1.4)); const g = e.glass == null ? 1 : e.glass; if (g > 0) { ctx.fillStyle = 'rgba(190,225,255,.75)'; ctx.fillRect(-430, -330 - 700 * g, 860, 700 * g); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-300, -330 - 600 * g); ctx.lineTo(-150, -330 - 700 * g + 40); ctx.stroke(); } rr(ctx, 200, -150, 160, 40, 20); paint(ctx, '#adb5bd', INK, wink(0.6)); ctx.restore(); },
  hand(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -60, 0, 120, 500, 50); paint(ctx, '#c39bd3', INK, wink()); ell(ctx, 0, -20, 80, 90); paint(ctx, '#e8b38b', INK, wink()); ctx.restore(); },
  road(ctx, e) { ctx.save(); const g = ctx.createLinearGradient(0, -2600, 0, -400); g.addColorStop(0, '#ff9e7a'); g.addColorStop(1, '#ffe0a8'); ctx.fillStyle = g; ctx.fillRect(-3000, -2600, 6000, 2300); ell(ctx, 0, -620, 260, 260); paint(ctx, '#fff0b3');
    for (let i = 0; i < 9; i++) { const x = -2700 + i * 680; ctx.beginPath(); ctx.moveTo(x - 500, -400); ctx.lineTo(x, -900 - hash(i) * 300); ctx.lineTo(x + 500, -400); ctx.closePath(); paint(ctx, '#b5838d'); }
    ctx.fillStyle = '#8bbf6a'; ctx.fillRect(-3000, -400, 6000, 3000); ctx.beginPath(); ctx.moveTo(-40, -400); ctx.lineTo(40, -400); ctx.lineTo(900, 1400); ctx.lineTo(-900, 1400); ctx.closePath(); ctx.fillStyle = '#4a4e69'; ctx.fill();
    ctx.strokeStyle = '#ffd23f'; for (let i = 0; i < 8; i++) { const t0 = ((i / 8) + (e.scroll || 0)) % 1, y0 = lerp(-400, 1400, t0 * t0), y1 = lerp(-400, 1400, Math.min(1, (t0 + 0.04) ** 2)); ctx.lineWidth = lerp(2, 40, t0); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(0, y1); ctx.stroke(); } ctx.restore(); },
  envelope(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); ctx.rotate(e.rot || 0); rr(ctx, -300, -200, 600, 400, 12); paint(ctx, '#fff3e0', INK, wink()); ctx.beginPath(); ctx.moveTo(-300, -200); ctx.lineTo(0, 30); ctx.lineTo(300, -200); paint(ctx, null, INK, wink()); LB(ctx, 'PARA: VOCÊ', 0, 120, 50, '#2b2140', 'Comic Sans MS, Arial', 700); ctx.fillStyle = '#ff4d6d'; heart(ctx, 0, -60, 40); ctx.restore(); },
};
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { const pre = (fx || []).filter((e) => e.under && FX[e.type]); for (const e of pre) FX[e.type](ctx, e, f); _dfx(ctx, (fx || []).filter((e) => !FX[e.type]), f); for (const e of fx || []) if (FX[e.type] && !e.under) FX[e.type](ctx, e, f); };
const ST = { set: 'street' };
const HER = 850, MINE = -250;
const BIKER = (x, y, f, o = {}) => [B(x, y - 150, Object.assign({ walk: f * 0.9, pose: 'hold', expr: 'stern', look: [1, 0], flip: 1, sweat: 1, tilt: 0.12 }, o))];
const sadBGM = 0;
const SHOTS = [
  { f0: 0, f1: T(100), light: () => 'gold', dof: {},
    cam: [{ f: 0, x: 1050, y: -250, z: 0.6 }, { f: T(100), x: 1500, y: -270, z: 0.64 }],
    build(f) { const cx = 1500 + f * 4.5; return { world: ST, actors: [{ type: 'car', x: cx, y: 1050, s: 1.0, col: '#3a86ff' }].concat(BIKER(700 + f * 4, 1000, f)), fx: [{ type: 'bikeP', x: 700 + f * 4, y: 1000, s: 0.62, col: '#3a86ff', spin: f * 0.4, under: true }, { type: 'letter', x: 1150 + f * 4.3, y: -300 + Math.sin(f * 0.2) * 120, rot: f * 0.12, s: 0.9 }, { type: 'lines', x: 700 + f * 4, y: 500, r: 260, k: 0.5 }], screen: tag(f, T(25), T(100), 'ELA VAI EMBORA... 💔') }; } },
  { f0: T(101), f1: T(157), light: () => 'day', dof: {},
    cam: [{ f: T(101), x: 300, y: -700, z: 0.45 }, { f: T(157), x: 300, y: -640, z: 0.5 }],
    build(f) { return { world: ST, actors: [], fx: [{ type: 'sparkle', x: 850, y: -1500, k: 0.5 }], screen: tag(f, T(110), T(157), 'SÁBADO, 8H ☀️') }; } },
  { f0: T(158), f1: T(266), light: () => 'day', dof: {},
    cam: [{ f: T(158), x: 700, y: -500, z: 0.5 }, { f: T(266), x: 800, y: -520, z: 0.55 }],
    build(f) { const tx = lerp(3400, HER + 300, sstep(prog(f, T(160), T(200)))); return { world: ST, actors: [], fx: [{ type: 'truck', x: tx, y: 1150, s: 0.9 }] }; } },
  { f0: T(267), f1: T(360), light: () => 'day', dof: {},
    cam: [{ f: T(267), x: 400, y: -300, z: 0.6 }, { f: T(360), x: 450, y: -320, z: 0.66 }],
    build(f) { const c = ((f - T(267)) % 60) / 60; return { world: ST, actors: [G('paiB', lerp(HER, HER + 350, c), lerp(250, 650, c), { walk: f * 0.5, pose: 'up', expr: 'neutral', look: [1, 0.3] }), B(MINE, 300, { expr: 'worried', look: [1, 0] })], fx: [{ type: 'truck', x: HER + 300, y: 1150, s: 0.9, under: true }, { type: 'box', x: lerp(HER, HER + 350, c), y: lerp(250, 650, c) - 560, s: 0.8, t: 'BIA' }] }; } },
  { f0: T(361), f1: T(403), light: () => 'day', dof: {},
    cam: [{ f: T(361), x: 800, y: -350, z: 0.75 }, { f: T(403), x: 820, y: -360, z: 0.8 }],
    build(f) { const c = prog(f, T(361), T(403)); return { world: ST, actors: [G('paiB', lerp(HER - 150, HER + 200, c), 400, { walk: f * 0.5, pose: 'up', expr: 'neutral', look: [1, 0] })], fx: [{ type: 'truck', x: HER + 300, y: 1150, s: 0.9, under: true }, { type: 'mattress', x: lerp(HER - 150, HER + 200, c), y: 400 - 540 }] }; } },
  { f0: T(404), f1: T(464), light: () => 'day', dof: {},
    cam: [{ f: T(404), x: 850, y: -300, z: 0.95 }, { f: T(464), x: 870, y: -310, z: 1.05 }],
    build(f) { const c = prog(f, T(404), T(464)); return { world: ST, actors: [G('bia', lerp(HER - 200, HER + 150, c), 420, { walk: f * 0.4, pose: 'hold', expr: 'worried', look: [1, 0.3], flip: 1 })], fx: [{ type: 'bikeP', x: lerp(HER - 200, HER + 150, c) + 180, y: 440, s: 0.45, col: '#ff5fa2' }] }; } },
  { f0: T(465), f1: T(567), light: () => 'day', dof: {},
    cam: [{ f: T(465), x: 0, y: -260, z: 0.75 }, { f: T(567), x: 0, y: -260, z: 0.9 }],
    build(f) { return { world: ST, actors: [], fx: [{ type: 'box', x: 0, y: 200, s: 1.6, rot: -0.05 }, { type: 'drawing', x: 0, y: -260, s: 0.9, rot: -0.08 }], screen: tag(f, T(518), T(567), '2º ANO ✏️') }; } },
  { f0: T(568), f1: T(662), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(568), x: 0, y: -300, z: 1.0 }, { f: T(662), x: 0, y: -310, z: 1.15 }],
    build(f) { const w = walkTo(f, T(568), T(600), [-900, 320], [-120, 300]); const sit = f > T(600); return { world: { set: 'bedroom', sun: 1 }, actors: [{ type: 'desk', x: 120, y: 340, s: 1.06, layer: 'front' }, B(sit ? -40 : w.x, sit ? 330 : w.y, { walk: sit ? null : w.walk * 1.6, sit, pose: sit ? 'write' : { L: [40, 60], R: [40, 60] }, expr: 'stern', look: [1, 0.5], flip: 1 })], fx: sit ? [{ type: 'letter', x: 140, y: -60, rot: 1.5, s: 0.7 }] : [] }; } },
  { f0: T(663), f1: T(758), light: () => 'eve', dof: {},
    cam: [{ f: T(663), x: 0, y: -260, z: 0.95 }, { f: T(758), x: 0, y: -260, z: 1.05 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [], fx: [{ type: 'page', x: 0, y: -250, s: 0.9, fs: 60, lines: ['Bia,', 'desde o 2º ano', 'eu guardo uma', 'coisa que eu nunca', 'tive coragem', 'de falar.', '', 'Eu gosto de você.'], chars: Math.floor(prog(f, T(665), T(750)) * 120) }] }; } },
  { f0: T(759), f1: T(881), light: () => 'day', dof: {},
    cam: [{ f: T(759), x: 300, y: -350, z: 0.6 }, { f: T(881), x: 700, y: -380, z: 0.62 }],
    build(f) { const cx = lerp(HER + 200, 4500, sstep(prog(f, T(780), T(870)))); return { world: Object.assign({ door: 1 }, ST), actors: [{ type: 'car', x: cx, y: 1050, s: 1.0, col: '#3a86ff' }, B(MINE, 280, { expr: f > T(795) ? 'shocked' : 'happy', pose: 'letter', look: [1, 0] })], fx: [{ type: 'letter', x: MINE + 130, y: -360, s: 0.4 }] }; } },
  { f0: T(882), f1: T(963), light: () => 'day', dof: {},
    cam: [{ f: T(882), x: MINE, y: -250, z: 0.8 }, { f: T(963), x: MINE + 600, y: -250, z: 0.85 }],
    build(f) { const x = lerp(MINE - 200, MINE + 700, sstep(prog(f, T(895), T(963)))); return { world: ST, actors: BIKER(x, 600, f, { expr: 'stern' }), fx: [{ type: 'bikeP', x, y: 600, s: 0.62, col: '#3a86ff', spin: f * 0.3, under: true }] }; } },
  { f0: T(964), f1: T(1063), light: () => 'day', dof: {},
    cam: [{ f: T(964), x: 1500, y: -250, z: 0.85 }, { f: T(1063), x: 4300, y: -250, z: 0.9 }],
    build(f) { const x = lerp(1500, 4300, prog(f, T(964), T(1063))); return { world: ST, actors: BIKER(x, 600, f, { expr: f > T(1014) ? 'scream' : 'stern' }).concat([{ type: 'car', x: x + 1300 + Math.sin(f * 0.05) * 80, y: 1050, s: 1.0, col: '#3a86ff' }]), fx: [{ type: 'bikeP', x, y: 600, s: 0.62, col: '#3a86ff', spin: f * 0.6, under: true }, { type: 'lines', x, y: 200, r: 300, k: 0.8 }, { type: 'letter', x: x + 130, y: 120, s: 0.35, rot: 0.3 }], screen: tag(f, T(964), T(1013), 'MAIS RÁPIDO...').concat(tag(f, T(1014), T(1063), 'MAIS RÁPIDO!!')) }; } },
  { f0: T(1064), f1: T(1153), light: () => 'day', dof: {},
    cam: [{ f: T(1064), x: 4500, y: -250, z: 1.0 }, { f: T(1153), x: 4700, y: -500, z: 0.9 }],
    build(f) { const x = lerp(4400, 4600, prog(f, T(1064), T(1153))); const fly = prog(f, T(1090), T(1153)); return { world: ST, actors: BIKER(x, 600, f, { expr: f > T(1100) ? 'shocked' : 'stern', pose: fly > 0 ? { L: [40, 60], R: [160, 120] } : 'hold' }), fx: [{ type: 'bikeP', x, y: 600, s: 0.62, col: '#3a86ff', spin: f * 0.6, under: true }, { type: 'letter', x: x + 130 + fly * 500, y: 120 - fly * 900, s: 0.5, rot: fly * 8 }] }; } },
  { f0: T(1154), f1: T(1226), light: () => 'day', dof: {},
    cam: [{ f: T(1154), x: 5200, y: -1000, z: 0.7 }, { f: T(1226), x: 5900, y: -900, z: 0.72 }],
    build(f) { const t = prog(f, T(1154), T(1226)); return { world: ST, actors: [], fx: [{ type: 'letter', x: lerp(5100, 6000, t), y: -1100 + Math.sin(t * 9) * 150, s: 0.8, rot: t * 9 }] }; } },
  { f0: T(1227), f1: T(1306), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1227), x: 5000, y: -300, z: 1.2 }, { f: T(1306), x: 5000, y: -320, z: 1.35 }],
    build(f) { return { world: ST, actors: [B(5000, 450, { pose: 'hold', expr: 'worried', sweat: 1, look: [1, -0.4], flip: 1, tilt: Math.sin(f * 0.25) * 0.05 })], fx: [{ type: 'bikeP', x: 5000, y: 600, s: 0.62, col: '#3a86ff', under: true }], screen: tag(f, T(1258), T(1306), 'SEM FÔLEGO...') }; } },
  { f0: T(1307), f1: T(1386), light: () => 'day', dof: {},
    cam: [{ f: T(1307), x: 0, y: -600, z: 0.85 }, { f: T(1386), x: 0, y: -620, z: 0.95 }],
    build(f) { return { world: ST, actors: [G('bia', 0, 400, { expr: 'worried', look: [1, -0.6], s: 0.7, sit: true })], fx: [{ type: 'cardoor', x: 0, y: 300, glass: 1 - sstep(prog(f, T(1340), T(1380))) }] }; } },
  { f0: T(1387), f1: T(1454), light: () => 'day', dof: {},
    cam: [{ f: T(1387), x: 1650, y: -1900, z: 1.2 }, { f: T(1454), x: 1650, y: -1900, z: 1.35 }],
    build(f) { const t = prog(f, T(1387), T(1415)); const caught = f > T(1408); return { world: ST, actors: [], fx: [{ type: 'letter', x: caught ? 1650 : lerp(750, 1650, t), y: caught ? -2080 : lerp(-2450, -2080, t), s: 0.8, rot: caught ? 0.1 : t * 6 }, { type: 'hand', x: 1650, y: -2000 + (caught ? 0 : (1 - t) * 300), rot: 0 }, { type: 'sparkle', x: 1650, y: -2150, k: caught ? 0.8 : 0 }] }; } },
  { f0: T(1455), f1: T(1525), light: () => 'gold', dof: {},
    cam: [{ f: T(1455), x: 0, y: -300, z: 0.55 }, { f: T(1525), x: 0, y: -320, z: 0.6 }],
    build(f) { const t = prog(f, T(1455), T(1525)); return { world: { set: 'class' }, actors: [], fx: [{ type: 'road', x: 0, y: 0, scroll: f * 0.01 }, { type: 'car', x: 0, y: lerp(900, -360, Math.sqrt(t)), s: lerp(0.6, 0.06, Math.sqrt(t)), col: '#3a86ff' }].map((e) => (e.type === 'car' ? Object.assign(e, { type: 'carfx' }) : e)) }; } },
  { f0: T(1526), f1: T(1647), light: () => 'day', dof: {},
    cam: [{ f: T(1526), x: MINE, y: -400, z: 0.75 }, { f: T(1647), x: MINE, y: -380, z: 0.95 }],
    build(f) { const op = f > T(1580); return { world: Object.assign({ door: 1 }, ST), actors: [B(MINE, 300, { expr: op ? 'surprised' : 'worried', pose: op ? 'letter' : 'hang', look: [1, -0.2] })], fx: op ? [{ type: 'envelope', x: MINE + 160, y: -420, s: 0.45 }] : [], screen: tag(f, T(1530), T(1600), '1 SEMANA DEPOIS') }; } },
  { f0: T(1648), f1: TOTAL - 1, light: () => 'gold', dof: {},
    cam: [{ f: T(1648), x: 0, y: -260, z: 0.9 }, { f: TOTAL - 1, x: 0, y: -260, z: 1.05 }],
    build(f) { return { world: { set: 'bedroom', sun: 1 }, actors: [], fx: [{ type: 'page', x: 0, y: -260, s: 0.9, fs: 110, col: '#e2468a', lines: ['', 'eu também.', '', 'espera.'], chars: f < T(1689) ? 0 : f < T(1732) ? 10 : 99, heart: f > T(1740) }] }; } },
];
FX.carfx = (ctx, e, f) => drawProp(ctx, Object.assign({}, e, { type: 'car' }), f);
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
