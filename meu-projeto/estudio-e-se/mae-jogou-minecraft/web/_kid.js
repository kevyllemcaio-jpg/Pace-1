// ---------- faces
const faceCache = new Map();
function faceTex(expr, look = 0) {
  const k = expr + look.toFixed(1); if (faceCache.has(k)) return faceCache.get(k);
  const t = tex(256, 256, (g) => {
    const lx = look * 16, D = '#120a1a';
    g.fillStyle = 'rgba(255,90,140,.28)'; g.beginPath(); g.ellipse(62, 158, 24, 13, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(194, 158, 24, 13, 0, 0, 7); g.fill();
    if (expr === 'blush') { g.fillStyle = 'rgba(255,60,110,.55)'; g.beginPath(); g.ellipse(62, 158, 30, 16, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(194, 158, 30, 16, 0, 0, 7); g.fill(); }
    g.fillStyle = D; g.strokeStyle = D; g.lineCap = 'round';
    for (const sx of [-1, 1]) {
      const x = 128 + sx * 40 + lx, y = 112;
      if (expr === 'shock') { g.beginPath(); g.ellipse(x, y, 17, 30, 0, 0, 7); g.fill(); }
      else if (expr === 'flat' || expr === 'smug' || expr === 'bored') { g.beginPath(); g.ellipse(x, y + 6, 13, 16, 0, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; g.fillRect(x - 20, y - 20, 40, 16); g.globalCompositeOperation = 'source-over'; g.fillStyle = D; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 16, y - 4); g.lineTo(x + 16, y - 4); g.stroke(); }
      else if (expr === 'happyc' || expr === 'blush') { g.lineWidth = 7; g.beginPath(); g.moveTo(x - 16, y + 6); g.quadraticCurveTo(x, y - 14, x + 16, y + 6); g.stroke(); }
      else { g.beginPath(); g.ellipse(x, y, 13, 24, 0, 0, 7); g.fill(); }
      g.lineWidth = 6; g.beginPath();
      if (expr === 'worry' || expr === 'sad') { g.moveTo(x - sx * 20, y - 44); g.lineTo(x + sx * 14, y - 54); g.stroke(); }
      if (expr === 'smug' || expr === 'stern') { g.moveTo(x - sx * 18, y - 52); g.lineTo(x + sx * 16, y - 42); g.stroke(); }
      if (expr === 'shock') { g.moveTo(x - 18, y - 56); g.quadraticCurveTo(x, y - 66, x + 18, y - 56); g.stroke(); }
    }
    g.lineWidth = 7; g.beginPath();
    if (expr === 'shock') { g.ellipse(128 + lx, 186, 11, 15, 0, 0, 7); g.fill(); }
    else if (expr === 'worry' || expr === 'flat' || expr === 'bored') { g.moveTo(110 + lx, 186); g.lineTo(146 + lx, 186); g.stroke(); }
    else if (expr === 'sad') { g.moveTo(108 + lx, 192); g.quadraticCurveTo(128 + lx, 176, 148 + lx, 192); g.stroke(); }
    else if (expr === 'smug') { g.moveTo(104 + lx, 182); g.quadraticCurveTo(130 + lx, 194, 156 + lx, 172); g.stroke(); }
    else if (expr === 'stern') { g.moveTo(108 + lx, 188); g.quadraticCurveTo(128 + lx, 180, 148 + lx, 188); g.stroke(); }
    else { g.moveTo(106 + lx, 178); g.quadraticCurveTo(128 + lx, 196, 150 + lx, 178); g.stroke(); }
  });
  faceCache.set(k, t); return t;
}

// ---------- characters
function limb(len, r, c) { const g = new THREE.Group(); g.add(M(new THREE.CapsuleGeometry(r, len, 6, 14), mat(c, 0.5), [0, -len / 2, 0])); return g; }
function kid(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const legs = [];
  for (const sx of [-1, 1]) {
    const leg = limb(0.36, 0.085, o.legs); leg.position.set(sx * 0.12, 0.55, 0); body.add(leg); legs.push(leg);
    const shoe = M(new THREE.SphereGeometry(0.11, 16, 12), mat(o.shoes, 0.4), [0, -0.5, 0.05]); shoe.scale.set(1, 0.6, 1.4); leg.add(shoe);
  }
  const torso = M(new THREE.CapsuleGeometry(0.27, 0.32, 6, 18), mat(o.top, 0.6), [0, 0.91, 0]); torso.scale.z = 0.85; body.add(torso);
  const hood = M(new THREE.TorusGeometry(0.22, 0.07, 10, 24), mat(o.top, 0.6), [0, 1.23, -0.05]); hood.rotation.x = Math.PI / 2; body.add(hood);
  body.add(M(new THREE.BoxGeometry(0.3, 0.12, 0.05), mat(o.top2 || o.top, 0.6), [0, 0.8, 0.23]));
  if (o.skirt) body.add(M(new THREE.CylinderGeometry(0.3, 0.4, 0.22, 20), mat('#2b2550', 0.7), [0, 0.59, 0]));
  const arms = [];
  for (const sx of [-1, 1]) { const a = limb(0.34, 0.07, o.top); a.position.set(sx * 0.31, 1.13, 0); a.rotation.z = sx * 0.18; body.add(a); a.add(M(new THREE.SphereGeometry(0.085, 14, 10), mat(o.hands, 0.45), [0, -0.46, 0])); arms.push(a); }
  body.add(M(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10), mat(o.skin, 0.4), [0, 1.33, 0]));
  const head = new THREE.Group(); head.position.y = 1.67; body.add(head);
  const skull = M(new THREE.SphereGeometry(0.3, 40, 30), mat(o.skin, 0.35)); skull.scale.set(1, 1.28, 1); head.add(skull);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex('happy'), transparent: true, depthWrite: false, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.302, 40, 30, Math.PI / 2 - Math.PI * 0.3, Math.PI * 0.6, Math.PI * 0.2, Math.PI * 0.55), faceMat); face.scale.set(1, 1.28, 1); head.add(face);
  if (o.hair) { if (o.style === 'short' || o.style === 'cap0') { const cap = M(new THREE.SphereGeometry(0.315, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), mat(o.hair, 0.5)); cap.scale.set(1, 1.28, 1); cap.rotation.x = -0.22; head.add(cap); } else hair3d(head, o); }
  if (o.glasses) for (const sx of [-1, 1]) { const g = M(new THREE.TorusGeometry(0.068, 0.008, 8, 24), mat('#3a1f5c', 0.3), [sx * 0.1, 0.03, 0.3]); head.add(g); }
  let phones = null;
  if (o.phones) {
    phones = new THREE.Group();
    const band = M(new THREE.TorusGeometry(0.34, 0.035, 10, 30, Math.PI), mat('#2b2d42', 0.3)); band.rotation.z = 0; phones.add(band);
    const glowM = mat('#5ef2ff', 0.2, { emissive: '#5ef2ff', emissiveIntensity: 0 });
    for (const sx of [-1, 1]) { const cup = M(new THREE.CylinderGeometry(0.12, 0.12, 0.09, 20), mat('#e63946', 0.35), [sx * 0.33, 0, 0]); cup.rotation.z = Math.PI / 2; phones.add(cup); const ring = M(new THREE.TorusGeometry(0.1, 0.018, 8, 20), glowM, [sx * 0.385, 0, 0]); ring.rotation.y = Math.PI / 2; phones.add(ring); }
    phones.userData.glow = glowM; head.add(phones);
  }
  let book = null;
  if (o.book) { book = M(new THREE.BoxGeometry(0.34, 0.44, 0.06), mat('#3a86ff', 0.5), [0, 0.98, 0.32]); book.rotation.x = -0.4; body.add(book); }
  root.userData = { head, faceMat, arms, legs, body, phones, book };
  return root;
}
