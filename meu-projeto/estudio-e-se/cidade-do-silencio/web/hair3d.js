// ---------- better 3D hair (original): fringe, face-framing locks, layered strands, shine band, styled ends
const HAIR_TEX = tex(256, 256, (g) => { g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 256); const r = rng(77); for (let i = 0; i < 260; i++) { const x = r() * 256, v = 90 + r() * 90; g.strokeStyle = `rgba(${v},${v},${v},.55)`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (r() - 0.5) * 20, 90, x + (r() - 0.5) * 20, 170, x + (r() - 0.5) * 16, 256); g.stroke(); } });
HAIR_TEX.colorSpace = THREE.NoColorSpace;
function edgeTex(n, depth, wave) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, 0); g.lineTo(512, 0); g.lineTo(512, 256 - depth); for (let i = n; i >= 0; i--) { const x = i / n * 512; const xm = (i - 0.5) / n * 512; g.lineTo(x, 256 - depth); if (i > 0) g.quadraticCurveTo(xm + (wave ? Math.sin(i * 2.1) * 12 : 0), 256 + (wave ? -depth * 0.2 : 0), (i - 1) / n * 512, 256 - depth); } g.closePath(); g.fill(); const t = new THREE.CanvasTexture(c); return t; }
const EDGE_F = edgeTex(7, 70, false), EDGE_B = edgeTex(9, 50, false), EDGE_L = edgeTex(12, 46, true);
const hairMats = new Map();
function hairMat(col, k = 0) { const key = col + k; if (hairMats.has(key)) return hairMats.get(key); const c = new THREE.Color(col); c.offsetHSL(0, 0, k); const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.05, bumpMap: HAIR_TEX, bumpScale: 0.6 }); hairMats.set(key, m); return m; }
function lock(len, w, col, k, tp = 0.5) { const g = new THREE.Group(); const c = M(new THREE.CylinderGeometry(w, w * tp, len, 12, 4), hairMat(col, k), [0, -len / 2, 0]); c.scale.z = 0.62; g.add(c); const e = M(new THREE.SphereGeometry(w * tp, 10, 8), hairMat(col, k), [0, -len, 0]); e.scale.z = 0.62; g.add(e); g.add(M(new THREE.SphereGeometry(w, 10, 8), hairMat(col, k))).scale.z = 0.62; return g; }
function place(head, obj, x, y, z, rx = 0, ry = 0, rz = 0) { obj.position.set(x, y, z); obj.rotation.set(rx, ry, rz); head.add(obj); return obj; }
function hair3d(head, o) {
  const col = o.hair, r = rng(String(col).length * 31 + (o.style || '').length * 7);
  // crown cap (slightly larger than the skull) + shine band
  const cap = M(new THREE.SphereGeometry(0.325, 44, 24, 0, Math.PI * 2, 0, Math.PI * 0.47), hairMat(col)); cap.scale.set(1.04, 1.28, 1.06); cap.rotation.x = -0.3; head.add(cap);
  const shine = M(new THREE.TorusGeometry(0.26, 0.012, 6, 40, Math.PI * 0.9), new THREE.MeshStandardMaterial({ color: new THREE.Color(col).offsetHSL(0, 0, 0.3), roughness: 0.2, emissive: new THREE.Color(col).offsetHSL(0, 0, 0.25), emissiveIntensity: 0.35 })); shine.position.set(0, 0.26, -0.02); shine.rotation.set(-1.05, 0, Math.PI * 0.05 + Math.PI * 0.55); head.add(shine);
  // bangs: a shell over the forehead with a scalloped edge (alpha map), like cartoon fringe
  const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.334, 48, 20, Math.PI / 2 - Math.PI * 0.38, Math.PI * 0.76, Math.PI * 0.1, Math.PI * 0.3), new THREE.MeshStandardMaterial({ color: col, roughness: 0.42, bumpMap: HAIR_TEX, bumpScale: 0.6, alphaMap: o.style === 'bob' ? EDGE_B : EDGE_F, alphaTest: 0.5, side: THREE.DoubleSide }));
  bangs.scale.set(1.04, 1.28, 1.07); bangs.castShadow = true; head.add(bangs);
  // face-framing side locks
  for (const sx of [-1, 1]) { const L = lock(o.style === 'bob' ? 0.34 : 0.5, 0.07, col, 0.03, 0.55); L.scale.z = 0.7; place(head, L, sx * 0.28, 0.2, 0.09, 0.05, 0, sx * 0.08); }
  if (o.style === 'long' || o.style === 'bob') {
    const len = o.style === 'long' ? 0.85 : 0.42;
    const shell = M(new THREE.CylinderGeometry(0.315, o.style === 'long' ? 0.37 : 0.35, len, 40, 6, true, Math.PI * 0.3, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: col, roughness: 0.42, bumpMap: HAIR_TEX, bumpScale: 0.6, alphaMap: EDGE_L, alphaTest: 0.5, side: THREE.DoubleSide })); shell.position.set(0, 0.27 - len / 2, -0.015); head.add(shell);
    const inner = M(new THREE.CylinderGeometry(0.3, 0.34, len * 0.92, 32, 1, true, Math.PI * 0.3, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: new THREE.Color(col).offsetHSL(0, 0, -0.08), roughness: 0.6, side: THREE.DoubleSide })); inner.position.set(0, 0.2 - len * 0.46, -0.02); head.add(inner);
  }
  if (o.style === 'pony') {
    const tie = M(new THREE.TorusGeometry(0.06, 0.025, 8, 18), mat(o.bow || '#ff5fa2', 0.4), [0, 0.2, -0.33]); tie.rotation.x = 0.5; head.add(tie);
    let y = 0.2, z = -0.36; for (let i = 0; i < 4; i++) { const w = 0.09 - i * 0.012; const L = lock(0.19, w, col, (i % 2) * 0.04, 0.8); place(head, L, 0, y, z, 0.6 - i * 0.3, 0, 0); y -= 0.15; z -= 0.08 - i * 0.03; }
  }
  if (o.style === 'buns') for (const sx of [-1, 1]) { const b = M(new THREE.SphereGeometry(0.11, 18, 14), hairMat(col), [sx * 0.21, 0.34, -0.05]); head.add(b); const sw = M(new THREE.TorusGeometry(0.075, 0.018, 6, 20), hairMat(col, 0.08), [sx * 0.21, 0.34, 0.04]); head.add(sw); const tie = M(new THREE.TorusGeometry(0.1, 0.02, 6, 20), mat(o.bow || '#ff5fa2', 0.4), [sx * 0.21, 0.28, -0.05]); tie.rotation.x = Math.PI / 2; head.add(tie); }
  if (o.bow) { const g = new THREE.Group(); for (const sx of [-1, 1]) { const w = M(new THREE.ConeGeometry(0.06, 0.12, 12), mat(o.bow, 0.35), [sx * 0.06, 0, 0]); w.rotation.z = -sx * Math.PI / 2; w.scale.z = 0.5; g.add(w); } g.add(M(new THREE.SphereGeometry(0.03, 10, 8), mat(o.bow, 0.3))); place(head, g, 0.19, 0.37, 0.02, 0, 0, -0.4); }
}
