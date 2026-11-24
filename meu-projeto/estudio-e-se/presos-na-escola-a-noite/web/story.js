// "E se você ficasse preso na escola à noite com a sua crush?" (drama) — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1990);
const FLASHES = [T(600), T(1228)];
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

Object.assign(FX, {
  clock(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); ell(ctx, 0, 0, 330, 330); paint(ctx, '#fffaf0', INK, wink(1.5)); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.sin(a) * 270, -Math.cos(a) * 270); ctx.lineTo(Math.sin(a) * 300, -Math.cos(a) * 300); paint(ctx, null, INK, wink(1)); }
    const hr = (e.h || 7) / 12 * Math.PI * 2, mn = (e.m || 0) / 60 * Math.PI * 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(hr) * 160, -Math.cos(hr) * 160); paint(ctx, null, '#1c1222', wink(3)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(mn) * 240, -Math.cos(mn) * 240); paint(ctx, null, '#d62839', wink(2)); ell(ctx, 0, 0, 20, 20); paint(ctx, '#1c1222'); ctx.restore(); },
  gate(ctx, e, f) { ctx.save(); ctx.translate(e.x + (e.shake ? Math.sin(f * 2.2) * 10 : 0), e.y); rr(ctx, -900, -1100, 1800, 40, 10); paint(ctx, '#343a40', INK, wink()); for (let i = 0; i < 16; i++) { rr(ctx, -880 + i * 116, -1100, 26, 1100, 8); paint(ctx, '#495057', INK, wink(0.7)); } rr(ctx, -60, -620, 120, 70, 10); paint(ctx, '#adb5bd', INK, wink()); ctx.beginPath(); ctx.arc(0, -620, 45, Math.PI, 0); paint(ctx, null, '#adb5bd', wink(2.5)); rr(ctx, -40, -560, 80, 110, 12); paint(ctx, '#ffd23f', INK, wink()); ctx.restore(); },
  phoneS(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -260, -480, 520, 960, 50); paint(ctx, '#1c1222', INK, wink()); rr(ctx, -225, -430, 450, 860, 26); paint(ctx, e.bg || '#14213d');
    if (e.call) { LB(ctx, 'CHAMANDO...', 0, -250, 54, '#ffffff'); LB(ctx, e.call, 0, -150, 80, '#ffffff'); ell(ctx, 0, 230, 70, 70); paint(ctx, '#e63946'); LB(ctx, 'SEM RESPOSTA', 0, 60, 40, '#ff6b6b'); }
    if (e.bat != null) { const lv = e.bat / 100; rr(ctx, -150, -110, 260, 140, 18); paint(ctx, null, '#ffffff', wink(2)); rr(ctx, 115, -70, 24, 60, 6); paint(ctx, '#ffffff'); rr(ctx, -135, -95, Math.max(8, 230 * lv), 110, 10); paint(ctx, lv < 0.05 ? '#ff2d55' : lv < 0.2 ? '#ffbe0b' : '#2dc653'); LB(ctx, e.bat + '%', 0, 160, 120, lv < 0.05 ? '#ff2d55' : '#ffffff'); } ctx.restore(); },
  beamL(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.a || 0); const L = e.L || 1500, g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, `rgba(255,250,210,${0.55 * (e.k == null ? 1 : e.k)})`); g.addColorStop(1, 'rgba(255,250,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(L, -260); ctx.lineTo(L, 260); ctx.lineTo(0, 12); ctx.closePath(); ctx.fill(); ctx.restore(); },
  eyes(ctx, e, f) { for (const [x, y] of e.pts) for (const sx of [-1, 1]) { const bl = Math.sin(f * 0.13 + x) > 0.96 ? 0.1 : 1; ell(ctx, x + sx * 40, y, 20, 26 * bl); ctx.fillStyle = '#ffffff'; ctx.fill(); ell(ctx, x + sx * 40 + 4, y + 4, 9, 12 * bl); ctx.fillStyle = '#1c1222'; ctx.fill(); } },
  door(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -330, -1000, 660, 1000, [10, 10, 0, 0]); paint(ctx, '#6b4226', INK, wink()); rr(ctx, -200, -880, 400, 300, 10); paint(ctx, '#2b2d42', INK, wink(0.7)); LB(ctx, e.t || 'SALA 7', 0, -730, 60, '#ffffff'); const j = e.jiggle ? Math.sin(f * 2) * 0.25 : 0; ctx.save(); ctx.translate(230, -460); ctx.rotate(j); rr(ctx, -10, -20, 110, 40, 16); paint(ctx, '#ffd23f', INK, wink(0.7)); ctx.restore(); if (e.lock) { ctx.fillStyle = '#e63946'; ctx.font = '900 150px Arial'; ctx.textAlign = 'center'; ctx.fillText('🔒', 0, -260); } ctx.restore(); },
  win(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -360, -500, 720, 1000, 10); paint(ctx, '#0b132b', INK, wink()); ctx.save(); rr(ctx, -340, -480, 680, 960, 6); ctx.clip(); for (let i = 0; i < 60; i++) { const x = -340 + hash(i) * 680, y = -480 + ((f * (30 + hash(i + 1) * 20) + hash(i + 3) * 960) % 960); ctx.strokeStyle = 'rgba(160,200,255,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 12, y + 50); ctx.stroke(); } ctx.restore();
    const a = e.bang ? Math.max(0, Math.sin(f * 0.5)) * 1.2 : 0; ctx.save(); ctx.translate(-340, -480); ctx.scale(Math.cos(a), 1); rr(ctx, 0, 0, 340, 960, 4); ctx.fillStyle = 'rgba(180,210,240,.25)'; ctx.fill(); paint(ctx, null, '#adb5bd', wink(1.6)); ctx.restore(); ctx.restore(); },
  hiwin(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -260, -170, 520, 340, 10); paint(ctx, '#0b132b', INK, wink()); ctx.save(); ctx.translate(-240, -150); ctx.rotate(-0.5); rr(ctx, 0, 0, 480, 300, 4); ctx.fillStyle = 'rgba(180,210,240,.3)'; ctx.fill(); paint(ctx, null, '#adb5bd', wink(1.4)); ctx.restore(); ctx.restore(); },
  tile(ctx, e) { ctx.save(); ctx.fillStyle = '#cfe3e8'; ctx.fillRect(-3000, -2600, 6000, 2600); ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 4; for (let x = -3000; x < 3000; x += 160) { ctx.beginPath(); ctx.moveTo(x, -2600); ctx.lineTo(x, 0); ctx.stroke(); } for (let y = -2600; y < 0; y += 160) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(3000, y); ctx.stroke(); } ctx.fillStyle = '#8d99ae'; ctx.fillRect(-3000, 0, 6000, 3000); ctx.restore(); },
});
const ST = { set: 'street' };
const BIAc = (x, y, o = {}) => G('bia', x, y, Object.assign({ expr: 'worried' }, o));
const FL = (x, y, a = 0, k = 1) => ({ type: 'beamL', x, y, a, k, L: 1600 });
const LT = (x, y, r = 700, i = 0.95) => ({ x, y, r, i, col: 'rgba(255,240,190,.35)' });
const HALL = { set: 'hall' };
const SHOTS = [
  { f0: 0, f1: T(127), light: () => 'dark', dof: {},
    cam: [{ f: 0, x: 0, y: -330, z: 0.95 }, { f: T(127), x: 0, y: -340, z: 1.1 }],
    build(f) { return { world: HALL, lights: [LT(100, -300, 900)], actors: [B(-80, 330, { pose: 'hold', expr: 'worried', look: [1, 0], flip: 1, sweat: 1 }), BIAc(-330, 330, { pose: 'cling', look: [1, 0], flip: 1 })], fx: [FL(20, -150, -0.1)], screen: tag(f, T(25), T(127), 'PRESOS NA ESCOLA...') }; } },
  { f0: T(128), f1: T(176), light: () => 'eve', dof: {},
    cam: [{ f: T(128), x: 0, y: -600, z: 0.65 }, { f: T(176), x: 0, y: -600, z: 0.7 }],
    build(f) { return { world: { set: 'class', board: 'DETENÇÃO' }, actors: [{ type: 'desk', x: -380, y: 340, s: 1.06, layer: 'front' }, { type: 'desk', x: 380, y: 340, s: 1.06, layer: 'front' }, B(-380, 328, { sit: true, expr: 'bored', look: [1, 0] }), BIAc(380, 328, { sit: true, expr: 'bored', flip: -1, look: [-1, 0] })] }; } },
  { f0: T(177), f1: T(279), light: () => 'gold', dof: {},
    cam: [{ f: T(177), x: 0, y: -400, z: 0.75 }, { f: T(279), x: 0, y: -420, z: 0.82 }],
    build(f) { return { world: { set: 'library' }, actors: [B(-300, 330, { pose: 'up', expr: 'happy', look: [1, -0.3], walk: f * 0.3 }), BIAc(300, 330, { pose: 'read', expr: 'bliss', flip: -1, look: [-1, 0] })], fx: [{ type: 'box', x: -300, y: -340, s: 0.55 }] }; } },
  { f0: T(280), f1: T(399), light: () => 'eve', dof: {},
    cam: [{ f: T(280), x: 0, y: -400, z: 1.0 }, { f: T(399), x: 0, y: -400, z: 1.1 }],
    build(f) { const m = lerp(30, 60, prog(f, T(280), T(336))); return { world: { set: 'library' }, actors: [], fx: [{ type: 'clock', x: 0, y: -420, s: 0.9, h: m < 60 ? 6 + m / 60 : 7, m }], screen: tag(f, T(336), T(399), '19:00') }; } },
  { f0: T(400), f1: T(466), light: () => 'dark', dof: {},
    cam: [{ f: T(400), x: 0, y: -400, z: 0.8 }, { f: T(466), x: 0, y: -420, z: 0.9 }],
    build(f) { return { world: ST, lights: [LT(0, -500, 1300, 0.85)], actors: [B(-150, 330, { pose: 'up', expr: 'scared', look: [0, -0.4], flip: 1 }), BIAc(250, 330, { pose: 'cheeks', flip: -1, look: [-1, -0.2] })], fx: [{ type: 'gate', x: 0, y: 200, shake: f > T(420) }], screen: tag(f, T(418), T(466), 'TRANCADO') }; } },
  { f0: T(467), f1: T(542), light: () => 'dark', dof: {},
    cam: [{ f: T(467), x: 0, y: -300, z: 1.0 }, { f: T(542), x: 0, y: -310, z: 1.1 }],
    build(f) { return { world: HALL, lights: [LT(0, -300, 900, 0.9)], actors: [BIAc(-250, 330, { pose: 'hold', look: [1, 0.3], flip: 1 })], fx: [{ type: 'phoneS', x: 200, y: -350, s: 0.55, call: 'MÃE' }] }; } },
  { f0: T(543), f1: T(635), light: () => 'dark', dof: {},
    cam: [{ f: T(543), x: 0, y: -300, z: 0.9 }, { f: T(635), x: 0, y: -300, z: 1.0 }],
    kicks: [{ f: T(600), a: 10 }],
    build(f) { return { world: HALL, lights: [LT(0, -500, 1100, 0.9)], actors: [B(-300, 380, { expr: 'worried', look: [1, -0.3], flip: 1 }), BIAc(300, 380, { expr: f > T(600) ? 'scared' : 'worried', flip: -1, look: [-1, -0.3] })], fx: [{ type: 'win', x: 0, y: -550, s: 0.8 }] }; } },
  { f0: T(636), f1: T(715), light: (f) => (f < T(674) ? 'eve' : 'dark'), dof: {},
    cam: [{ f: T(636), x: 0, y: -330, z: 0.8 }, { f: T(674), x: 0, y: -330, z: 0.85 }, { f: T(678), x: 0, y: -330, z: 1.0 }, { f: T(715), x: 0, y: -330, z: 1.0 }],
    build(f) { return { world: HALL, lights: [], actors: [B(-200, 330, { expr: 'surprised', look: [0, -0.6], flip: 1 }), BIAc(200, 330, { expr: 'surprised', flip: -1, look: [0, -0.6] })] }; } },
  { f0: T(716), f1: T(775), light: () => 'dark', dof: {},
    cam: [{ f: T(716), x: 0, y: -300, z: 1.2 }, { f: T(775), x: 0, y: -300, z: 1.3 }],
    build(f) { return { world: HALL, lights: [LT(0, -330, 520, 0.45)], actors: [], fx: [{ type: 'eyes', pts: [[-200, -330], [200, -330]] }], screen: tag(f, T(720), T(775), 'ESCURIDÃO TOTAL') }; } },
  { f0: T(776), f1: T(850), light: () => 'dark', dof: { room: 3 },
    cam: [{ f: T(776), x: 0, y: -300, z: 1.2 }, { f: T(850), x: 0, y: -300, z: 1.35 }],
    build(f) { const g = sstep(prog(f, T(785), T(805))); return { world: HALL, lights: [LT(0, -300, 420, 0.6)], actors: [B(90, 330, { expr: 'surprised', look: [-1, 0], flip: -1 }), BIAc(lerp(-300, -120, g), 330, { pose: g > 0.5 ? 'cling' : 'hang', expr: 'scared', look: [1, 0], flip: 1 })] }; } },
  { f0: T(851), f1: T(932), light: () => 'dark', dof: {},
    cam: [{ f: T(851), x: 200, y: -330, z: 0.95 }, { f: T(932), x: 250, y: -330, z: 1.05 }],
    build(f) { const on = f > T(870); return { world: HALL, lights: on ? [LT(500, -300, 900)] : [LT(0, -300, 300, 0.5)], actors: [B(0, 330, { pose: 'hold', expr: 'stern', look: [1, 0], flip: 1 }), BIAc(-230, 330, { pose: 'cling', look: [1, 0], flip: 1 })], fx: on ? [FL(100, -150, -0.05)] : [] }; } },
  { f0: T(933), f1: T(1005), light: () => 'dark', dof: {},
    cam: [{ f: T(933), x: 0, y: -330, z: 1.1 }, { f: T(1005), x: 0, y: -330, z: 1.2 }],
    build(f) { return { world: HALL, lights: [LT(0, -330, 700)], actors: [], fx: [{ type: 'phoneS', x: 0, y: -330, s: 0.7, bat: 10 }] }; } },
  { f0: T(1006), f1: T(1089), light: () => 'dark', dof: {},
    cam: [{ f: T(1006), x: -600, y: -330, z: 0.85 }, { f: T(1089), x: 200, y: -330, z: 0.85 }],
    build(f) { const x = lerp(-700, 200, prog(f, T(1006), T(1089))); return { world: HALL, lights: [LT(x + 500, -300, 900)], actors: [B(x, 330, { walk: f * 0.35, pose: 'hold', expr: 'stern', look: [1, 0], flip: 1 }), BIAc(x - 240, 330, { walk: f * 0.35 + 1, pose: 'cling', look: [1, 0], flip: 1 })], fx: [FL(x + 100, -150, Math.sin(f * 0.05) * 0.15)] }; } },
  { f0: T(1090), f1: T(1143), light: () => 'dark', dof: {},
    cam: [{ f: T(1090), x: 0, y: -450, z: 0.9 }, { f: T(1143), x: 0, y: -450, z: 1.0 }],
    build(f) { return { world: HALL, lights: [LT(100, -500, 900)], actors: [B(-350, 330, { pose: { L: [12, 6], R: [100, 10] }, expr: 'stern', look: [1, 0], flip: 1 })], fx: [{ type: 'door', x: 150, y: 330, t: 'SALA 7', jiggle: true, lock: f > T(1105) }] }; } },
  { f0: T(1144), f1: T(1207), light: () => 'dark', dof: {},
    cam: [{ f: T(1144), x: 0, y: -450, z: 0.9 }, { f: T(1207), x: 0, y: -450, z: 1.0 }],
    build(f) { return { world: HALL, lights: [LT(100, -500, 900)], actors: [BIAc(-350, 330, { pose: { L: [12, 6], R: [100, 10] }, look: [1, 0], flip: 1 })], fx: [{ type: 'door', x: 150, y: 330, t: 'DIRETORIA', jiggle: true, lock: f > T(1166) }] }; } },
  { f0: T(1208), f1: T(1283), light: () => 'dark', dof: {},
    cam: [{ f: T(1208), x: 0, y: -350, z: 0.85 }, { f: T(1228), x: 0, y: -350, z: 0.85 }, { f: T(1232), x: 0, y: -350, z: 1.0, e: 'o' }, { f: T(1283), x: 0, y: -350, z: 1.05 }],
    kicks: [{ f: T(1228), a: 14 }],
    build(f) { const sc = f > T(1228); return { world: HALL, lights: [LT(0, -500, 1000)], actors: [B(-320, 380, { expr: sc ? 'scream' : 'stern', pose: sc ? 'cheeks' : 'hold', flip: 1, look: [1, -0.3] }), BIAc(320, 380, { expr: sc ? 'scream' : 'worried', pose: sc ? 'cheeks' : 'hang', flip: -1, look: [-1, -0.3] })], fx: [{ type: 'win', x: 0, y: -550, s: 0.8, bang: true }] }; } },
  { f0: T(1284), f1: T(1337), light: () => 'dark', dof: {},
    cam: [{ f: T(1284), x: -300, y: -330, z: 0.8 }, { f: T(1337), x: 600, y: -330, z: 0.82 }],
    build(f) { const x = lerp(-500, 800, prog(f, T(1284), T(1337))); return { world: HALL, lights: [LT(x + 300, -300, 900)], actors: [B(x, 330, { walk: f * 0.9, pose: { L: [40, 60], R: [40, 60] }, expr: 'scared', look: [1, 0], flip: 1 }), BIAc(x - 260, 330, { walk: f * 0.9 + 1, pose: { L: [40, 60], R: [40, 60] }, expr: 'scared', look: [1, 0], flip: 1 })], fx: [FL(x + 100, -150, 0.05), { type: 'lines', x: x - 100, y: -300, r: 300, k: 0.5 }] }; } },
  { f0: T(1338), f1: T(1414), light: () => 'dark', dof: {},
    cam: [{ f: T(1338), x: 0, y: -330, z: 1.1 }, { f: T(1414), x: 0, y: -330, z: 1.25 }],
    build(f) { const b = f < T(1356) ? 10 : f < T(1370) ? 5 : 1; return { world: HALL, lights: [LT(0, -330, b === 1 ? 450 : 700, b === 1 ? 0.7 : 0.95)], actors: [], fx: [{ type: 'phoneS', x: 0, y: -330, s: 0.7, bat: b }] }; } },
  { f0: T(1415), f1: T(1556), light: () => 'dark', dof: {},
    cam: [{ f: T(1415), x: 0, y: -330, z: 1.2 }, { f: T(1470), x: 0, y: -330, z: 1.2 }, { f: T(1480), x: 0, y: -900, z: 0.7 }, { f: T(1556), x: 0, y: -950, z: 0.75 }],
    build(f) { if (f < T(1478)) return { world: HALL, lights: [LT(0, -330, 600)], actors: [B(0, 330, { pose: 'raise', expr: 'surprised', look: [0, -0.4] })], fx: [{ type: 'bulb', x: 120, y: -720, k: pop(f, T(1437)) }] };
      return { world: HALL, lights: [LT(0, -1300, 800)], actors: [], fx: [{ type: 'hiwin', x: 0, y: -1300 }, FL(-500, 200, -1.1, 0.8)], screen: tag(f, T(1485), T(1556), 'A JANELA!') }; } },
  { f0: T(1557), f1: T(1627), light: () => 'dark', dof: {},
    cam: [{ f: T(1557), x: 0, y: -800, z: 0.75 }, { f: T(1627), x: 0, y: -850, z: 0.8 }],
    build(f) { const up = sstep(prog(f, T(1585), T(1620))); return { world: HALL, lights: [LT(0, -900, 1000)], actors: [B(-150, 330, { pose: 'up', expr: 'stern', look: [1, -0.5], flip: 1 }), BIAc(80, 330 - up * 600, { pose: 'up', expr: 'scared', look: [0, -0.8], hop: up * 300 })], fx: [{ type: 'hiwin', x: 100, y: -1300 }] }; } },
  { f0: T(1628), f1: T(1676), light: () => 'dark', dof: {},
    cam: [{ f: T(1628), x: 0, y: -1100, z: 0.9 }, { f: T(1676), x: 0, y: -1100, z: 1.0 }],
    build(f) { const go = prog(f, T(1630), T(1665)); return { world: HALL, lights: [LT(0, -1300, 800)], actors: go < 1 ? [BIAc(100, -700 - go * 500, { rot: -go * 1.2, pose: 'up', expr: 'stern', look: [0, -1] })] : [], fx: [{ type: 'hiwin', x: 100, y: -1300 }] }; } },
  { f0: T(1677), f1: T(1742), light: () => 'dark', dof: {},
    cam: [{ f: T(1677), x: 0, y: -1000, z: 0.85 }, { f: T(1742), x: 0, y: -1050, z: 0.92 }],
    build(f) { const go = prog(f, T(1690), T(1740)); return { world: HALL, lights: [LT(0, -1200, 800, 0.7)], actors: [B(100, 330 - go * 1300, { rot: -go * 1.0, pose: 'up', expr: 'stern', look: [0, -1], hop: go * 200 })], fx: [{ type: 'hiwin', x: 100, y: -1300 }] }; } },
  { f0: T(1743), f1: T(1820), light: () => 'dark', dof: {},
    cam: [{ f: T(1743), x: 0, y: -330, z: 1.1 }, { f: T(1820), x: 0, y: -330, z: 1.2 }],
    build(f) { const off = f > T(1763); return { world: HALL, lights: off ? [] : [LT(0, -330, 500, 0.6)], actors: [], fx: [{ type: 'phoneS', x: 0, y: -330, s: 0.7, bat: off ? null : 1, bg: off ? '#000000' : '#14213d' }] }; } },
  { f0: T(1821), f1: TOTAL - 1, light: () => 'dark', dof: {},
    cam: [{ f: T(1821), x: 0, y: -330, z: 0.8 }, { f: TOTAL - 1, x: 0, y: -330, z: 1.05 }],
    build(f) { return { world: ST, lights: [LT(0, -500, 1300, 0.9)], actors: [B(-110, 330, { pose: 'cling', expr: 'bliss', look: [1, 0], flip: 1 }), BIAc(110, 330, { pose: 'cling', expr: 'bliss', flip: -1, look: [-1, 0] })], fx: [{ type: 'storm', x0: -1500, y0: -2400 }, { type: 'hearts', x: 0, y: -620, n: 3 }] }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
