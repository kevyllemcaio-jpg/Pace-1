
// ---------- blocky characters (original "toy block" style): same joints/userData as kid(), so every pose helper still works
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const RB = (w, h, d, r = 0.04) => new RoundedBoxGeometry(w, h, d, 3, r);
function blocky(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const legs = [];
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(sx * 0.15, 0.62, 0); body.add(leg); legs.push(leg);
    leg.add(M(RB(0.27, 0.56, 0.3, 0.05), mat(o.legs, 0.6), [0, -0.3, 0]));
    leg.add(M(RB(0.29, 0.12, 0.36, 0.04), mat(o.shoes, 0.45), [0, -0.6, 0.03]));
  }
  const torso = M(RB(0.66, 0.66, 0.36, 0.07), mat(o.top, 0.6), [0, 0.95, 0]); body.add(torso);
  body.add(M(RB(0.34, 0.14, 0.04, 0.02), mat(o.top2 || o.top, 0.6), [0, 0.86, 0.19]));
  if (o.skirt) body.add(M(RB(0.74, 0.2, 0.42, 0.04), mat(o.skirt, 0.6), [0, 0.66, 0]));
  const arms = [];
  for (const sx of [-1, 1]) {
    const a = new THREE.Group(); a.position.set(sx * 0.45, 1.24, 0); a.rotation.z = sx * 0.06; body.add(a);
    a.add(M(RB(0.22, 0.5, 0.24, 0.05), mat(o.top, 0.6), [0, -0.24, 0]));
    a.add(M(RB(0.22, 0.18, 0.24, 0.05), mat(o.hands, 0.45), [0, -0.56, 0]));
    arms.push(a);
  }
  const head = new THREE.Group(); head.position.y = 1.62; body.add(head);
  head.add(M(RB(0.64, 0.6, 0.6, 0.1), mat(o.skin, 0.4)));
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex('happy'), transparent: true, depthWrite: false, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.52), faceMat); face.position.z = 0.302; head.add(face);
  if (o.hair && o.style !== 'none') {
    const hm = mat(o.hair, 0.55);
    head.add(M(RB(0.7, 0.2, 0.66, 0.06), hm, [0, 0.27, -0.01]));            // top
    head.add(M(RB(0.7, 0.5, 0.14, 0.05), hm, [0, 0.06, -0.29]));            // back
    for (const sx of [-1, 1]) head.add(M(RB(0.1, 0.3, 0.6, 0.04), hm, [sx * 0.34, 0.12, -0.02])); // sides
    if (o.fringe !== false) for (let i = 0; i < 4; i++) head.add(M(RB(0.17, 0.12 + (i % 2) * 0.04, 0.08, 0.03), hm, [-0.24 + i * 0.16, 0.18 - (i % 2) * 0.02, 0.3]));
    if (o.style === 'long') { head.add(M(RB(0.72, 0.62, 0.14, 0.05), hm, [0, -0.32, -0.28])); for (const sx of [-1, 1]) head.add(M(RB(0.12, 0.6, 0.22, 0.04), hm, [sx * 0.36, -0.22, 0.12])); }
    if (o.style === 'bob') for (const sx of [-1, 1]) head.add(M(RB(0.13, 0.42, 0.5, 0.04), hm, [sx * 0.36, -0.06, 0.02]));
    if (o.style === 'pony') { head.add(M(RB(0.2, 0.2, 0.16, 0.04), mat(o.bow || '#ff5fa2', 0.4), [0, 0.18, -0.38])); head.add(M(RB(0.22, 0.55, 0.2, 0.06), hm, [0, -0.12, -0.44])); }
    if (o.style === 'buns') for (const sx of [-1, 1]) head.add(M(RB(0.24, 0.24, 0.24, 0.06), hm, [sx * 0.24, 0.42, -0.06]));
    if (o.bow) head.add(M(RB(0.24, 0.12, 0.08, 0.03), mat(o.bow, 0.4), [0.22, 0.34, 0.12]));
  }
  if (o.cap) { head.add(M(RB(0.7, 0.18, 0.68, 0.05), mat(o.cap, 0.5), [0, 0.32, 0])); head.add(M(RB(0.6, 0.05, 0.3, 0.02), mat(o.cap, 0.5), [0, 0.25, 0.42])); }
  if (o.glasses) for (const sx of [-1, 1]) { const g = M(new THREE.TorusGeometry(0.08, 0.012, 8, 4), mat('#2a1046', 0.3), [sx * 0.12, 0.03, 0.32]); g.rotation.z = Math.PI / 4; head.add(g); }
  let phones = null;
  if (o.phones) { phones = new THREE.Group(); phones.add(M(RB(0.74, 0.07, 0.1, 0.02), mat('#2b2d42', 0.3), [0, 0.36, 0])); for (const sx of [-1, 1]) phones.add(M(RB(0.1, 0.24, 0.22, 0.04), mat('#e63946', 0.35), [sx * 0.37, 0.05, 0])); phones.userData.glow = mat('#5ef2ff'); head.add(phones); }
  root.userData = { head, faceMat, arms, legs, body, phones, book: null, blocky: true };
  return root;
}
