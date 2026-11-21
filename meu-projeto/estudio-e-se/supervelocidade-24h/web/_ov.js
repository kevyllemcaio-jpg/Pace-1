// ---------- 2D overlay
function bubble(x, y, text, k, o = {}) {
  if (k <= 0.01) return;
  O.save(); O.translate(x, y); O.scale(k, k);
  O.font = `900 ${o.fs || 50}px Arial Black, Arial`;
  const lines = text.split('\n'), w = Math.max(...lines.map((l) => O.measureText(l).width)) + 90, h = lines.length * (o.fs || 50) * 1.2 + 70;
  O.beginPath(); const n = 12;
  for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, am = (a0 + a1) / 2; const p = (a) => [Math.cos(a) * w / 2, Math.sin(a) * h / 2]; const [x0, y0] = p(a0), [x1, y1] = p(a1); if (!i) O.moveTo(x0, y0); O.quadraticCurveTo(Math.cos(am) * w * 0.62, Math.sin(am) * h * 0.66, x1, y1); }
  O.closePath(); O.fillStyle = o.bg || 'rgba(255,255,255,.96)'; O.fill(); O.lineWidth = 7; O.strokeStyle = '#2a1046'; O.stroke();
  for (let i = 0; i < 3; i++) { O.beginPath(); O.arc((o.tx || 0) * (i + 1) / 4, h / 2 + 24 + i * 30, 16 - i * 4, 0, 7); O.fillStyle = o.bg || '#fff'; O.fill(); O.stroke(); }
  O.fillStyle = o.col || '#2a1046'; O.textAlign = 'center'; O.textBaseline = 'middle';
  lines.forEach((l, i) => O.fillText(l, 0, (i - (lines.length - 1) / 2) * (o.fs || 50) * 1.2 + 3));
  if (o.heart) { O.fillStyle = '#ff2d55'; heart2(w / 2 - 20, -h / 2 + 10, 26); }
  O.restore();
}
function heart2(x, y, r) { O.beginPath(); O.moveTo(x, y + r); O.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.6, y - r * 1.6, x, y - r * 0.5); O.bezierCurveTo(x + r * 0.6, y - r * 1.6, x + r * 2, y - r * 0.4, x, y + r); O.fill(); }
function sweat(x, y, n, f) { for (let i = 0; i < n; i++) { const t = ((f * 0.04 + i * 0.37) % 1); const px = x + (i % 2 ? 1 : -1) * (120 + i * 18), py = y - 60 + t * 160; O.save(); O.globalAlpha = 1 - t; O.translate(px, py); O.beginPath(); O.moveTo(0, -40); O.quadraticCurveTo(30, 0, 0, 24); O.quadraticCurveTo(-30, 0, 0, -40); O.fillStyle = '#9fe0ff'; O.fill(); O.lineWidth = 5; O.strokeStyle = '#2a1046'; O.stroke(); O.restore(); } }
function sparkle(x, y, r, f, col = '#fff59d') { O.save(); O.translate(x, y); O.rotate(f * 0.05); O.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.3 : r; const a = i * Math.PI / 4; O.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } O.closePath(); O.fillStyle = col; O.fill(); O.restore(); }
function battery(x, y, k, f) { if (k <= 0) return; O.save(); O.translate(x, y); O.scale(k, k); O.fillStyle = 'rgba(20,10,40,.85)'; O.strokeStyle = '#fff'; O.lineWidth = 12; O.beginPath(); O.roundRect(-170, -85, 320, 170, 26); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.fillRect(150, -35, 30, 70); if (Math.floor(f / 7) % 2 === 0) { O.fillStyle = '#ff2d55'; O.fillRect(-150, -65, 60, 130); } O.restore(); }
function calendar(x, y, k, n) { if (k <= 0) return; O.save(); O.translate(x, y); O.scale(k, k); O.rotate(-0.06); O.fillStyle = '#fff'; O.strokeStyle = '#2a1046'; O.lineWidth = 10; O.beginPath(); O.roundRect(-220, -200, 440, 400, 30); O.fill(); O.stroke(); O.fillStyle = '#ff2d55'; O.fillRect(-215, -195, 430, 110); O.fillStyle = '#fff'; O.font = '900 64px Arial Black, Arial'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText('ANOS', 0, -140); O.fillStyle = '#2a1046'; O.font = '900 220px Arial Black, Arial'; O.fillText(String(n), 0, 70); O.restore(); }
function flash(a) { if (a <= 0) return; O.fillStyle = `rgba(255,255,255,${a})`; O.fillRect(0, 0, W, H); }
