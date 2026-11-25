// "A TERRA DOS PERDIDOS" ep.1 — o Fiapo, a meia perdida. Personagens e cenários próprios.
// ---------- personagens-objeto
function olhos(ctx, x, y, r, e, f, seed) {
  const bl = blinkAt(f, seed); const lx = (e.look || [0, 0])[0] * r * 0.35, ly = (e.look || [0, 0])[1] * r * 0.35;
  for (const s of [-1, 1]) {
    const cx = x + s * r * 1.25;
    if (e.expr === 'feliz' && bl < 0.5) { ctx.beginPath(); ctx.arc(cx, y + r * 0.3, r * 0.75, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = r * 0.28; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); continue; }
    const h = r * (1 - bl * 0.92) * (e.expr === 'medo' ? 1.15 : 1);
    ell(ctx, cx, y, r, h); paint(ctx, '#ffffff', INK, wink(0.8));
    if (h > r * 0.3) { ell(ctx, cx + lx, y + ly, r * 0.5, Math.min(h, r) * 0.55); ctx.fillStyle = INK; ctx.fill(); ell(ctx, cx + lx - r * 0.18, y + ly - r * 0.2, r * 0.16, r * 0.16); ctx.fillStyle = '#fff'; ctx.fill(); }
    if (e.expr === 'triste' || e.expr === 'medo') { ctx.beginPath(); ctx.moveTo(cx - s * r * 0.9, y - r * 1.2); ctx.lineTo(cx + s * r * 0.6, y - r * 1.55); ctx.lineWidth = r * 0.22; ctx.strokeStyle = INK; ctx.stroke(); }
    if (e.expr === 'bravo' || e.expr === 'decidido') { ctx.beginPath(); ctx.moveTo(cx - s * r * 0.9, y - r * 1.5); ctx.lineTo(cx + s * r * 0.6, y - r * 1.15); ctx.lineWidth = r * 0.22; ctx.strokeStyle = INK; ctx.stroke(); }
  }
}
function boca(ctx, x, y, w, e) {
  ctx.lineWidth = w * 0.18; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  if (e.expr === 'medo' || e.expr === 'grito') { ell(ctx, x, y + w * 0.2, w * 0.38, w * 0.48); paint(ctx, '#7a1f3d', INK, wink(0.7)); return; }
  if (e.expr === 'triste') { ctx.beginPath(); ctx.arc(x, y + w * 0.55, w * 0.45, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); return; }
  if (e.expr === 'decidido' || e.expr === 'bravo' || e.expr === 'serio') { ctx.beginPath(); ctx.moveTo(x - w * 0.35, y + w * 0.15); ctx.lineTo(x + w * 0.35, y + w * 0.15); ctx.stroke(); return; }
  ctx.beginPath(); ctx.arc(x, y - w * 0.1, w * 0.45, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
}
// meia: e = {x,y,s,col,col2,expr,look,hop,rot,flip,sq,dobrada}
function drawMeia(ctx, e, f) {
  const s = e.s || 1, t = f / FPS, seed = e.seed || 3;
  ctx.save(); ctx.translate(e.x, e.y - (e.hop || 0)); if (e.rot) ctx.rotate(e.rot); ctx.scale(s * (e.flip || 1), s * (1 - (e.sq || 0)));
  if (!e.noShadow) { ell(ctx, 40, 6, 200, 30); ctx.fillStyle = 'rgba(20,10,30,.25)'; ctx.fill(); }
  const sway = Math.sin(t * 2.2 + seed) * 0.03; ctx.rotate(sway);
  const c1 = e.col || '#ff6b6b', c2 = e.col2 || '#ffffff';
  // corpo em L (perna + pé)
  const path = () => { ctx.beginPath(); ctx.moveTo(-110, -640); ctx.lineTo(110, -640); ctx.lineTo(110, -170); ctx.quadraticCurveTo(110, -120, 160, -120); ctx.lineTo(300, -120); ctx.quadraticCurveTo(380, -120, 380, -50); ctx.quadraticCurveTo(380, 0, 300, 0); ctx.lineTo(-40, 0); ctx.quadraticCurveTo(-110, 0, -110, -80); ctx.closePath(); };
  path(); paint(ctx, c1, null);
  ctx.save(); path(); ctx.clip(); ctx.fillStyle = c2; for (let y = -560; y < 0; y += 130) ctx.fillRect(-200, y, 700, 52);
  ell(ctx, 330, -55, 70, 70); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fill(); ell(ctx, -60, -30, 70, 60); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fill(); ctx.restore();
  path(); paint(ctx, null, INK, wink() / s);
  rr(ctx, -125, -700, 250, 90, 24); paint(ctx, c2, INK, wink() / s); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 6; for (let x = -100; x < 110; x += 30) { ctx.beginPath(); ctx.moveTo(x, -690); ctx.lineTo(x, -620); ctx.stroke(); }
  // rosto
  olhos(ctx, 0, -470, 38, e, f, seed); boca(ctx, 0, -380, 90, e);
  if (e.blush !== false) for (const sx of [-1, 1]) { ell(ctx, sx * 75, -400, 26, 16); ctx.fillStyle = 'rgba(255,120,140,.45)'; ctx.fill(); }
  if (e.lagrima) { ell(ctx, 55, -400 + ((f * 4) % 120), 12, 18); ctx.fillStyle = '#7fd1ff'; ctx.fill(); }
  ctx.restore();
}
// controle remoto (o "prefeito" dos perdidos)
function drawControle(ctx, e, f) {
  const s = e.s || 1; ctx.save(); ctx.translate(e.x, e.y - (e.hop || 0)); ctx.scale(s * (e.flip || 1), s);
  ell(ctx, 0, 6, 190, 28); ctx.fillStyle = 'rgba(20,10,30,.25)'; ctx.fill(); ctx.rotate(Math.sin(f * 0.05) * 0.02);
  rr(ctx, -130, -820, 260, 820, 70); paint(ctx, '#2b2d42', INK, wink() / s);
  ell(ctx, 0, -740, 34, 34); paint(ctx, '#e63946', INK, wink(0.6) / s);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ell(ctx, -70 + j * 70, -300 + i * 70, 22, 22); paint(ctx, ['#adb5bd', '#ffd23f', '#4cc9f0'][(i + j) % 3], INK, wink(0.5) / s); }
  // coroa de tampinhas
  ctx.beginPath(); ctx.moveTo(-110, -820); ctx.lineTo(-110, -930); ctx.lineTo(-55, -870); ctx.lineTo(0, -950); ctx.lineTo(55, -870); ctx.lineTo(110, -930); ctx.lineTo(110, -820); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink() / s);
  olhos(ctx, 0, -560, 32, e, f, 11); ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.moveTo(-80, -480); ctx.quadraticCurveTo(-40, -440, 0, -470); ctx.quadraticCurveTo(40, -440, 80, -480); ctx.quadraticCurveTo(40, -455, 0, -455); ctx.quadraticCurveTo(-40, -455, -80, -480); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  boca(ctx, 0, -415, 70, e); ctx.restore();
}
function drawTampa(ctx, e, f) { const s = e.s || 1; ctx.save(); ctx.translate(e.x, e.y - (e.hop || 0)); ctx.scale(s, s); ell(ctx, 0, 6, 90, 18); ctx.fillStyle = 'rgba(20,10,30,.25)'; ctx.fill(); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-55, -330); ctx.quadraticCurveTo(0, -380, 55, -330); ctx.lineTo(70, 0); ctx.closePath(); paint(ctx, '#3a86ff', INK, wink() / s); rr(ctx, 40, -320, 30, 220, 10); paint(ctx, '#1d4ed8', INK, wink(0.6) / s); olhos(ctx, 0, -210, 22, e, f, 5); boca(ctx, 0, -150, 50, e); ctx.restore(); }
function drawBrinco(ctx, e, f) { const s = e.s || 1; ctx.save(); ctx.translate(e.x, e.y - (e.hop || 0) - Math.abs(Math.sin(f * 0.06)) * 10); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, -170, 160, 0, 6.3); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 24; ctx.strokeStyle = '#ffd23f'; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-60, 70); ctx.lineTo(0, 150); ctx.lineTo(60, 70); ctx.closePath(); paint(ctx, '#ff5fa2', INK, wink() / s); olhos(ctx, 0, 60, 16, e, f, 9); ctx.restore(); }
function drawMoeda(ctx, e, f) { const s = e.s || 1; ctx.save(); ctx.translate(e.x, e.y - (e.hop || 0)); ctx.scale(s, s); ell(ctx, 0, -120, 120, 120); paint(ctx, '#e9c46a', INK, wink() / s); ell(ctx, 0, -120, 90, 90); paint(ctx, null, '#b8860b', 8); olhos(ctx, 0, -140, 18, e, f, 13); boca(ctx, 0, -90, 50, e); ctx.restore(); }
// ---------- cenários
function tabuas(ctx, y0, col1, col2) { for (let i = 0; i < 14; i++) { rr(ctx, -4000, y0 + i * 160, 9000, 160, 0); paint(ctx, i % 2 ? col1 : col2, 'rgba(60,30,20,.5)', wink(0.6)); for (let k = 0; k < 6; k++) { const x = -4000 + ((i * 937 + k * 1531) % 9000); ctx.fillStyle = 'rgba(60,30,20,.35)'; ctx.fillRect(x, y0 + i * 160, 8, 160); } } }
const _setM = drawSet;
drawSet = function (ctx, st, cam, f) {
  const t = f / FPS;
  if (st.set === 'lavanderia') {
    ctx.fillStyle = '#bfe3f2'; ctx.fillRect(-4000, -3200, 8000, 3300);
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 6; for (let x = -4000; x < 4000; x += 180) { ctx.beginPath(); ctx.moveTo(x, -3200); ctx.lineTo(x, 0); ctx.stroke(); } for (let y = -3200; y < 0; y += 180) { ctx.beginPath(); ctx.moveTo(-4000, y); ctx.lineTo(4000, y); ctx.stroke(); }
    tabuas(ctx, 0, '#e8d5b5', '#dcc6a0');
    const sh = st.shake ? Math.sin(f * 2.1) * st.shake : 0;
    ctx.save(); ctx.translate(sh, 0);
    rr(ctx, -700, -1700, 1400, 1700, 40); paint(ctx, '#f8f9fa', INK, wink()); rr(ctx, -700, -1700, 1400, 260, [40, 40, 0, 0]); paint(ctx, '#e9ecef', INK, wink());
    for (let i = 0; i < 3; i++) { ell(ctx, 350 + i * 100, -1570, 30, 30); paint(ctx, ['#ff6b6b', '#4cc9f0', '#ffd23f'][i], INK, wink(0.6)); } rr(ctx, -560, -1620, 520, 110, 20); paint(ctx, '#2b2d42', INK, wink()); ctx.fillStyle = '#7bf1a8'; ctx.font = '900 70px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(st.visor || '00:42', -300, -1563);
    const cx = 0, cy = -760; ell(ctx, cx, cy, 520, 520); paint(ctx, '#ced4da', INK, wink()); ell(ctx, cx, cy, 430, 430); paint(ctx, '#3d5a80', INK, wink());
    ctx.save(); ell(ctx, cx, cy, 430, 430); ctx.clip(); ctx.translate(cx, cy); ctx.rotate(st.spin || 0);
    for (let i = 0; i < 9; i++) { const a = i * 0.7, r = 120 + (i % 3) * 90; ell(ctx, Math.cos(a) * r, Math.sin(a) * r, 150, 80, a); paint(ctx, ['#ff9f1c', '#2ec4b6', '#e71d36', '#9b5de5', '#f15bb5'][i % 5], INK, wink(0.6)); }
    for (let i = 0; i < 14; i++) { const a = i * 1.7 + t, r = 60 + (i * 37) % 330; ell(ctx, Math.cos(a) * r, Math.sin(a) * r, 30, 30); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill(); }
    ctx.restore(); ell(ctx, cx - 160, cy - 180, 160, 70, -0.6); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill();
    ctx.restore();
    rr(ctx, 700 + sh, -1700, 30, 1700, 0); ctx.fillStyle = '#20142c'; ctx.fill();
    return;
  }
  if (st.set === 'debaixo') {
    const g = ctx.createLinearGradient(0, -2600, 0, 400); g.addColorStop(0, '#1a1030'); g.addColorStop(1, '#3b2a55'); ctx.fillStyle = g; ctx.fillRect(-5000, -3000, 10000, 3400);
    for (let i = 0; i < 16; i++) { rr(ctx, -5000 + i * 640, -2600, 620, 160, 6); paint(ctx, '#5a3a2a', INK, wink()); } rr(ctx, -5000, -2460, 10000, 70, 0); paint(ctx, '#3a2418', INK, wink());
    tabuas(ctx, 0, '#7a5232', '#6b4628');
    // feixe de luz da fresta
    const lg = ctx.createLinearGradient(st.luz || 2600, -2400, (st.luz || 2600) - 900, 200); lg.addColorStop(0, 'rgba(255,230,160,.55)'); lg.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo((st.luz || 2600) - 80, -2390); ctx.lineTo((st.luz || 2600) + 80, -2390); ctx.lineTo((st.luz || 2600) - 400, 300); ctx.lineTo((st.luz || 2600) - 1400, 300); ctx.closePath(); ctx.fill();
    // a cidade: prédios de livros, caixa de fósforo, carretel
    const bl = [['#e63946', 900], ['#457b9d', 1300], ['#f4a261', 700], ['#2a9d8f', 1100], ['#8338ec', 950], ['#e9c46a', 1250]];
    bl.forEach(([c, h], i) => { const x = -2600 + i * 820; rr(ctx, x, -h, 380, h, 10); paint(ctx, c, INK, wink()); for (let k = 0; k < Math.floor(h / 200); k++) { rr(ctx, x + 60, -h + 80 + k * 200, 260, 90, 8); paint(ctx, (Math.sin(f * 0.07 + i + k) > -0.3) ? '#ffe9a8' : '#3b2a55', INK, wink(0.5)); } });
    for (let i = 0; i < 26; i++) { const x = -3000 + i * 260, y = -2380 + Math.sin(i) * 20; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x + 260, y); ctx.stroke(); ell(ctx, x, y + 30, 18, 18); ctx.fillStyle = ['#ffd23f', '#ff5fa2', '#4cc9f0'][i % 3]; ctx.fill(); }
    for (let i = 0; i < 18; i++) { const x = -3400 + hash(i) * 7000, y = 40 + hash(i + 3) * 260; ell(ctx, x, y, 70 + hash(i + 5) * 60, 40); ctx.fillStyle = 'rgba(200,190,220,.35)'; ctx.fill(); }
    for (let i = 0; i < 40; i++) { const x = (hash(i) * 6000 - 3000 + f * 2 * (hash(i + 1) - 0.5)) , y = -2300 + ((hash(i + 2) * 2600 + f * 1.5) % 2600); ell(ctx, x, y, 6, 6); ctx.fillStyle = 'rgba(255,240,200,.5)'; ctx.fill(); }
    return;
  }
  if (st.set === 'quarto') {
    ctx.fillStyle = '#ffd6a5'; ctx.fillRect(-5000, -5000, 10000, 5100); tabuas(ctx, 0, '#b07d50', '#a57048');
    rr(ctx, -2600, -1500, 2200, 1500, 0); paint(ctx, '#5a3a2a', INK, wink()); rr(ctx, -2700, -1500, 2400, 220, 20); paint(ctx, '#7aa2f7', INK, wink());
    rr(ctx, 400, -3400, 1500, 3400, 20); paint(ctx, '#c8946a', INK, wink());
    const o = st.gaveta == null ? 1 : st.gaveta; rr(ctx, 360 - o * 120, -2500, 1580 + o * 240, 520 + o * 60, 14); paint(ctx, '#d9a87c', INK, wink()); ell(ctx, 1150, -2240, 50, 30); paint(ctx, '#ffd23f', INK, wink());
    rr(ctx, 400, -1700, 1500, 520, 14); paint(ctx, '#d9a87c', INK, wink()); ell(ctx, 1150, -1440, 50, 30); paint(ctx, '#ffd23f', INK, wink());
    rr(ctx, 600, -4100, 700, 420, 30); paint(ctx, '#2b2d42', INK, wink()); ctx.fillStyle = '#ff4d6d'; ctx.font = '900 230px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(st.hora || '23:00', 950, -3880);
    return;
  }
  if (st.set === 'gaveta') {
    ctx.fillStyle = '#c8946a'; ctx.fillRect(-4000, -4000, 8000, 8000); rr(ctx, -1500, -1700, 3000, 2600, 30); paint(ctx, '#e8c39e', INK, wink()); rr(ctx, -1400, -1600, 2800, 2400, 20); paint(ctx, '#f6dfc4', INK, wink(0.6));
    const cols = [['#4cc9f0', '#ffffff'], ['#ffd23f', '#ff9f1c'], ['#2b2d42', '#adb5bd'], ['#80ed99', '#ffffff']];
    cols.forEach(([a, b], i) => { const x = -1200 + (i % 2) * 1500, y = -1300 + Math.floor(i / 2) * 1500; rr(ctx, x, y, 900, 380, 120); paint(ctx, a, INK, wink()); ctx.save(); rr(ctx, x, y, 900, 380, 120); ctx.clip(); ctx.fillStyle = b; for (let k = 0; k < 6; k++) ctx.fillRect(x + 60 + k * 150, y, 50, 380); ctx.restore(); rr(ctx, x, y, 900, 380, 120); paint(ctx, null, INK, wink()); });
    return;
  }
  if (st.set === 'preto') { ctx.fillStyle = '#0d0818'; ctx.fillRect(-5000, -5000, 10000, 10000); return; }
  return _setM(ctx, st, cam, f);
};
const _fxM = drawFx;
drawFx = function (ctx, fx, f) {
  const mine = ['meia', 'controle', 'tampa', 'brinco', 'moeda', 'regua'];
  _fxM(ctx, (fx || []).filter((e) => !mine.includes(e.type)), f);
  const list = (fx || []).filter((e) => mine.includes(e.type)).sort((a, b) => (a.z || 0) - (b.z || 0));
  for (const e of list) {
    if (e.type === 'meia') drawMeia(ctx, e, f);
    if (e.type === 'controle') drawControle(ctx, e, f);
    if (e.type === 'tampa') drawTampa(ctx, e, f);
    if (e.type === 'brinco') drawBrinco(ctx, e, f);
    if (e.type === 'moeda') drawMoeda(ctx, e, f);
    if (e.type === 'regua') { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -60, -e.h, 120, e.h, 10); paint(ctx, '#ffd23f', INK, wink()); for (let k = 0; k <= 8; k++) { ctx.fillStyle = INK; ctx.fillRect(-60, -k * e.h / 8, k % 2 ? 40 : 70, 8); } ctx.font = '900 240px Arial Black, Arial'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.lineWidth = 24; ctx.strokeStyle = INK; ctx.strokeText('80 cm', 100, -e.h + 40); ctx.fillText('80 cm', 100, -e.h + 40); ctx.restore(); }
  }
};
