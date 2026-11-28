// "E se a sua crush perdesse a coisa que ela mais ama?" (drama) — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1775);
const FLASHES = [T(20), T(975)];
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
const GS = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'];

Object.assign(FX, {
  poster(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -330, -440, 660, 880, 10); paint(ctx, '#fffaf0', INK, wink()); LB(ctx, 'PROCURA-SE', 0, -360, 74, '#d62839'); rr(ctx, -250, -280, 500, 420, 8); paint(ctx, '#bde0fe', INK, wink(0.6));
    drawCat(ctx, { x: 0, y: 120, s: 0.55 }, f); LB(ctx, 'PIPOCA', 0, 240, 80, '#1c1222'); LB(ctx, 'LARANJA · 2 ANOS', 0, 340, 40, '#495057'); ctx.restore(); },
  bolt(ctx, e, f) { if (f - e.t < 0 || f - e.t > 8) return; ctx.save(); ctx.strokeStyle = '#fffbe0'; ctx.lineWidth = 26; ctx.lineJoin = 'round'; ctx.shadowColor = '#bde0fe'; ctx.shadowBlur = 60; ctx.beginPath(); let x = e.x, y = e.y; ctx.moveTo(x, y); for (let i = 0; i < 7; i++) { x += (hash(i + e.x) - 0.5) * 360; y += 260; ctx.lineTo(x, y); } ctx.stroke(); ctx.restore(); },
  wall(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -900, -900, 1800, 900, 0); paint(ctx, '#adb5bd', INK, wink()); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = wink(0.6); for (let y = -900; y < 0; y += 90) { ctx.beginPath(); ctx.moveTo(-900, y); ctx.lineTo(900, y); ctx.stroke(); for (let x = -900 + ((y / 90) % 2) * 90; x < 900; x += 180) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 90); ctx.stroke(); } } ctx.restore(); },
  drain(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -360, -200, 720, 400, 20); paint(ctx, '#111318', INK, wink()); const lv = e.water || 0; if (lv > 0) { ctx.fillStyle = 'rgba(70,120,170,.85)'; ctx.fillRect(-350, 190 - 380 * lv, 700, 380 * lv); for (let i = 0; i < 6; i++) { ell(ctx, -300 + i * 120 + Math.sin(f * 0.3 + i) * 10, 190 - 380 * lv, 30, 8); ctx.fillStyle = 'rgba(200,230,255,.6)'; ctx.fill(); } }
    if (e.eyes) for (const sx of [-1, 1]) { ell(ctx, sx * 50, 40 - (e.lift || 0), 22, 26 * (Math.sin(f * 0.15) > 0.95 ? 0.1 : 1)); ctx.fillStyle = '#ffd23f'; ctx.fill(); ell(ctx, sx * 50, 40 - (e.lift || 0), 6, 18); ctx.fillStyle = '#1c1222'; ctx.fill(); }
    ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 26; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 130, -200); ctx.lineTo(i * 130, 200); ctx.stroke(); } rr(ctx, -360, -200, 720, 400, 20); paint(ctx, null, '#495057', wink(2)); ctx.restore(); },
  drops(ctx, e, f) { ctx.save(); for (let i = 0; i < 14; i++) { const t = ((f * 0.04) + i / 14) % 1; const x = e.x + (hash(i) - 0.5) * e.w, y = e.y + t * 300; ctx.globalAlpha = 1 - t; ell(ctx, x, y, 10, 16); ctx.fillStyle = '#8ecae6'; ctx.fill(); } ctx.restore(); },
  photo(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -200, -260, 400, 520, 30); paint(ctx, '#1c1222', INK, wink()); rr(ctx, -175, -230, 350, 440, 16); paint(ctx, '#ffe5ec'); drawCat(ctx, { x: 0, y: 120, s: 0.45, happy: true }, f); ctx.restore(); },
});
const ST = { set: 'street' };
const RAIN = (x0 = -1500) => [{ type: 'storm', x0, y0: -2400 }, { type: 'rain', x0: x0 - 500, y0: -2400, w: 4000 }];
const DARK = (pts) => () => 'dark';
const L = (x, y, r = 1100, i = 0.8) => ({ x, y, r, i, col: 'rgba(255,220,150,.25)' });
const CAT = (x, y, o = {}) => (o.y != null ? { type: 'catprop', x, y: y + 5, cy: o.y, s: o.s || 0.38, tilt: o.tilt, happy: o.happy, layer: 'front' } : Object.assign({ cat: true, x, y, s: 0.38, layer: 'front' }, o));
const _dpC = drawProp; drawProp = function (ctx, a, f) { if (a.type === 'catprop') { drawCat(ctx, { x: a.x, y: a.cy, s: a.s, tilt: a.tilt, happy: a.happy }, f); return; } _dpC(ctx, a, f); };
const BIAc = (x, y, o = {}) => G('bia', x, y, Object.assign({ expr: 'worried' }, o));
const SHOTS = [
  { f0: 0, f1: T(111), light: () => 'dark', lights: [L(0, -100, 1200, 0.85)], dof: {},
    cam: [{ f: 0, x: 0, y: -100, z: 0.9 }, { f: T(111), x: 0, y: -110, z: 1.05 }],
    build(f) { return { world: ST, actors: [B(-650, 420, { rot: 1.45, expr: 'stern', sweat: 1, pose: { L: [12, 6], R: [100, 0] }, look: [1, 0.5] })], fx: [{ type: 'drain', x: 420, y: 420, s: 0.7, water: 0.55, eyes: true }].concat(RAIN()), screen: tag(f, T(30), T(111), 'PRA SALVAR ELE...') }; } },
  { f0: T(112), f1: T(158), light: () => 'day', dof: {},
    cam: [{ f: T(112), x: 0, y: -500, z: 0.5 }, { f: T(158), x: 0, y: -480, z: 0.55 }],
    build(f) { return { world: { set: 'yard' }, actors: [0, 1, 2, 3, 4].map((i) => G(GS[i + 1], -900 + i * 450, 300 + (i % 2) * 150, { walk: f * 0.5 + i, expr: 'happy', pose: 'up', flip: i % 2 ? -1 : 1 })), screen: tag(f, T(115), T(158), 'RECREIO') }; } },
  { f0: T(159), f1: T(278), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(159), x: 300, y: -300, z: 0.8 }, { f: T(278), x: 350, y: -300, z: 1.05 }],
    build(f) { const w = walkTo(f, T(200), T(270), [-500, 330], [100, 330]); return { world: { set: 'yard' }, actors: [BIAc(450, 330, { sit: true, pose: 'cheeks', look: [0, 0.6], tilt: Math.sin(f * 0.3) * 0.05 }), B(w.x, w.y, { walk: w.walk, flip: 1, expr: 'worried', look: [1, 0] })], fx: [{ type: 'drops', x: 450, y: -420, w: 120 }] }; } },
  { f0: T(279), f1: T(403), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(279), x: 0, y: -280, z: 0.95 }, { f: T(403), x: 0, y: -290, z: 1.1 }],
    build(f) { return { world: { set: 'yard' }, actors: [BIAc(-250, 330, { sit: true, pose: 'hold', look: [1, 0.3] }), B(250, 330, { sit: true, flip: -1, expr: 'worried', look: [-1, 0.3] })], fx: [{ type: 'photo', x: -60, y: -330, s: 0.75, rot: 0.1 }], screen: tag(f, T(315), T(403), 'O PIPOCA FUGIU 🐈') }; } },
  { f0: T(404), f1: T(484), light: () => 'eve', dof: {},
    cam: [{ f: T(404), x: 0, y: -1200, z: 0.6 }, { f: T(484), x: 0, y: -1150, z: 0.66 }],
    build(f) { return { world: ST, actors: [], fx: [{ type: 'poster', x: 0, y: -850, s: 0.75, rot: -0.04 }], screen: tag(f, T(420), T(484), 'TEMPESTADE HOJE ⛈️') }; } },
  { f0: T(485), f1: T(603), light: () => 'eve', dof: {},
    cam: [{ f: T(485), x: 0, y: -300, z: 0.75 }, { f: T(603), x: 300, y: -320, z: 0.8 }],
    build(f) { const w = walkTo(f, T(510), T(600), [-700, 330], [600, 330]); return { world: { set: 'hall' }, actors: [B(w.x, w.y, { walk: w.walk, flip: 1, expr: 'stern', look: [1, 0] }), { type: 'backpack', x: w.x - 60, y: w.y - 1, layer: 'front' }] }; } },
  { f0: T(604), f1: T(651), light: () => 'eve', dof: {},
    cam: [{ f: T(604), x: 2000, y: -700, z: 0.4 }, { f: T(651), x: 2000, y: -680, z: 0.42 }],
    build(f) { return { world: ST, actors: [B(2000, 400, { walk: f * 0.4, flip: 1, expr: 'stern', look: [1, 0] })], screen: tag(f, T(606), T(651), 'SOZINHO') }; } },
  { f0: T(652), f1: T(705), light: () => 'eve', dof: {},
    cam: [{ f: T(652), x: 3000, y: -300, z: 0.7 }, { f: T(705), x: 3600, y: -300, z: 0.72 }],
    build(f) { const x = lerp(3000, 3600, prog(f, T(652), T(705))); return { world: ST, actors: [B(x, 400, { walk: f * 0.6, flip: 1, expr: 'worried', look: [Math.sin(f * 0.1), 0] })], fx: say(f, T(660), x, -650, 'PIPOCA?', { fs: 50 }) }; } },
  { f0: T(706), f1: T(771), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(706), x: 3950, y: 450, z: 1.0 }, { f: T(771), x: 3950, y: 450, z: 1.1 }],
    build(f) { return { world: ST, actors: [{ type: 'car', x: 4250, y: 1050, s: 1.0, col: '#e63946' }, B(3500, 950, { rot: 1.45, expr: 'worried', look: [1, 0.3], pose: { L: [12, 6], R: [90, 0] } })] }; } },
  { f0: T(772), f1: T(831), light: () => 'eve', dof: {},
    cam: [{ f: T(772), x: 5000, y: -400, z: 0.85 }, { f: T(831), x: 5000, y: -400, z: 0.95 }],
    build(f) { const peek = sstep(prog(f, T(780), T(800))); return { world: ST, actors: [B(5450 - peek * 120, 380, { flip: -1, expr: 'worried', look: [-1, 0], tilt: -0.2 * peek })], fx: [{ type: 'wall', x: 6100, y: 450 }] }; } },
  { f0: T(832), f1: T(893), light: () => 'dark', lights: [L(5000, -100, 1500, 0.7)], dof: {},
    cam: [{ f: T(832), x: 5000, y: -1200, z: 0.5 }, { f: T(893), x: 5000, y: -900, z: 0.55 }],
    build(f) { return { world: ST, actors: [B(5000, 400, { expr: 'worried', look: [0, -0.8] })], screen: tag(f, T(840), T(893), 'O CÉU ESCURECEU') }; } },
  { f0: T(894), f1: T(960), light: () => 'dark', lights: [L(5300, -200, 1300, 0.85)], dof: {},
    cam: [{ f: T(894), x: 5300, y: -300, z: 0.75 }, { f: T(960), x: 5500, y: -300, z: 0.8 }],
    build(f) { const x = lerp(5200, 5600, prog(f, T(894), T(960))); return { world: ST, actors: [B(x, 400, { walk: f * 0.5, flip: 1, expr: 'stern', sweat: 1, look: [1, 0.2], pose: { L: [150, 130], R: [150, 130] } })], fx: RAIN(4000) }; } },
  { f0: T(961), f1: T(1020), light: () => 'dark', lights: [L(5600, -200, 1300, 0.85)], dof: {},
    cam: [{ f: T(961), x: 5600, y: -600, z: 0.6 }, { f: T(975), x: 5600, y: -600, z: 0.6 }, { f: T(980), x: 5600, y: -400, z: 0.85, e: 'o' }, { f: T(1020), x: 5600, y: -400, z: 0.9 }],
    kicks: [{ f: T(975), a: 16 }],
    build(f) { return { world: ST, actors: [B(5600, 400, { expr: f > T(975) ? 'scared' : 'stern', sweat: 1, pose: f > T(975) ? 'cheeks' : 'hang', look: [0, -0.6] })], fx: [{ type: 'bolt', x: 5900, y: -2500, t: T(975) }].concat(RAIN(4200)) }; } },
  { f0: T(1021), f1: T(1123), light: () => 'dark', lights: [L(5600, -100, 1100, 0.85)], dof: {},
    cam: [{ f: T(1021), x: 5600, y: -250, z: 1.1 }, { f: T(1123), x: 5600, y: -260, z: 1.3 }],
    build(f) { const turn = f > T(1086); return { world: ST, actors: [B(5600, 400, { expr: turn ? 'surprised' : 'worried', sweat: 1, flip: turn ? -1 : 1, look: turn ? [-1, 0.5] : [1, 0] })], fx: RAIN(4200).concat(f > T(1086) ? say(f, T(1086), 5380, -420, 'miau...', { fs: 44 }) : []) }; } },
  { f0: T(1124), f1: T(1173), light: () => 'dark', lights: [L(0, 0, 900, 0.85)], dof: {},
    cam: [{ f: T(1124), x: 0, y: 0, z: 1.2 }, { f: T(1173), x: 0, y: 0, z: 1.4 }],
    build(f) { return { world: ST, actors: [], fx: [{ type: 'drain', x: 0, y: 0, s: 1.1, water: 0.25, eyes: true }].concat(RAIN(-1500)), screen: tag(f, T(1135), T(1173), 'O BUEIRO') }; } },
  { f0: T(1174), f1: T(1235), light: () => 'dark', lights: [L(0, 0, 900, 0.85)], dof: {},
    cam: [{ f: T(1174), x: 0, y: 0, z: 1.4 }, { f: T(1235), x: 0, y: 0, z: 1.6 }],
    build(f) { const lv = lerp(0.25, 0.6, prog(f, T(1174), T(1235))); return { world: ST, actors: [], fx: [{ type: 'drain', x: 0, y: 0, s: 1.1, water: lv, eyes: true, lift: lv * 200 }].concat(RAIN(-1500)), screen: tag(f, T(1190), T(1235), 'A ÁGUA TÁ SUBINDO') }; } },
  { f0: T(1236), f1: T(1349), light: () => 'dark', lights: [L(0, 0, 1200, 0.85)], dof: {},
    cam: [{ f: T(1236), x: 0, y: -100, z: 0.9 }, { f: T(1349), x: 100, y: -50, z: 1.15 }],
    build(f) { const reach = sstep(prog(f, T(1280), T(1320))); return { world: ST, actors: [B(-650 + reach * 60, 420, { rot: 1.45, expr: 'stern', sweat: 1, pose: { L: [12, 6], R: [lerp(60, 100, reach), 0] }, look: [1, 0.5] })], fx: [{ type: 'drain', x: 420, y: 420, s: 0.7, water: 0.6, eyes: true }].concat(RAIN(-1500)) }; } },
  { f0: T(1350), f1: T(1396), light: () => 'dark', lights: [L(0, -300, 1000, 0.9)], dof: { room: 3 },
    cam: [{ f: T(1350), x: 0, y: -300, z: 1.3 }, { f: T(1396), x: 0, y: -320, z: 1.5 }],
    build(f) { return { world: ST, actors: [B(0, 330, { pose: 'hold', expr: 'surprised', sweat: 1, look: [0, 0.6] }), CAT(20, 335, { s: 0.32, tilt: Math.sin(f * 0.8) * 0.05, y: 200 })], fx: RAIN(-1500).concat([{ type: 'drops', x: 0, y: -300, w: 300 }]), screen: tag(f, T(1355), T(1396), 'PEGUEI!') }; } },
  { f0: T(1397), f1: T(1491), light: () => 'dark', lights: [L(0, -200, 800, 0.9)], dof: { room: 4 },
    cam: [{ f: T(1397), x: 0, y: -250, z: 1.8 }, { f: T(1491), x: 0, y: -250, z: 2.0 }],
    build(f) { return { world: ST, actors: [B(0, 330, { pose: 'hold', expr: 'worried', look: [0, 0.6] }), CAT(20 + Math.sin(f * 1.6) * 6, 335, { s: 0.32, y: 200 })], fx: [{ type: 'drops', x: 0, y: -200, w: 260 }].concat(RAIN(-1500)) }; } },
  { f0: T(1492), f1: T(1650), light: () => 'dark', lights: [L(-250, -300, 1200, 0.9)], dof: {},
    cam: [{ f: T(1492), x: -100, y: -400, z: 0.75 }, { f: T(1650), x: -100, y: -400, z: 0.9 }],
    build(f) { const o = sstep(prog(f, T(1505), T(1525))); return { world: Object.assign({ door: o }, ST), actors: (o > 0.3 ? [BIAc(-250, 150, { expr: f > T(1560) ? 'surprised' : 'worried', look: [1, 0.3] })] : []).concat([B(250, 330, { pose: 'hold', expr: 'worried', sweat: 1, flip: -1, look: [-1, 0] }), CAT(230, 335, { s: 0.32, y: 200 })]), fx: RAIN(-1500) }; } },
  { f0: T(1651), f1: TOTAL - 1, light: () => 'gold', dof: { room: 3 },
    cam: [{ f: T(1651), x: 0, y: -330, z: 1.2 }, { f: TOTAL - 1, x: 0, y: -340, z: 1.4 }],
    build(f) { return { world: Object.assign({ door: 1 }, ST), actors: [B(-110, 320, { pose: 'cling', expr: 'bliss', look: [1, 0] }), BIAc(110, 320, { pose: 'cling', expr: 'bliss', flip: -1, look: [-1, 0] }), CAT(0, 330, { s: 0.36, happy: true })], fx: [{ type: 'hearts', x: 0, y: -620, n: 4 }] }; } },
];
SHOTS.forEach((sh) => { if (sh.lights) { const b = sh.build, Ls = sh.lights; sh.build = (f) => Object.assign(b(f), { lights: Ls }); } });
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
