
// ---------- shots
const T = (f) => f / 30;
const C = (p, l, d) => ({ p, l, d });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function roofY(z) { for (const [c, hw] of window.ROOF_GAPS) { const R = hw + 1.8; if (Math.abs(z - c) < R) return 1.5 * (1 - ((z - c) / R) ** 2); } return 0; }
function reset() {
  STREET.visible = true; ROOF.visible = false; TUNNEL.visible = false; portal.visible = false; rain.visible = false; shards.visible = false; runaway.visible = false;
  cracks.forEach((c) => (c.visible = false)); cars.forEach((c) => (c.visible = false));
  for (const o of [...FORMS, ...zghosts, ...peds, monster, meteor, crater, bigCrater, watchItem, ...fireballs, debris]) o.visible = false;
  for (const k of FORMS) { k.userData.watch.visible = true; k.scale.setScalar(k.userData.sc); setFace(k, 'happy'); }
  monster.rotation.set(0, 0, 0); monster.scale.setScalar(1); monster.position.set(0, 0, -95);
  HFN = null; heroLight.distance = 10; heroLight.intensity = 0; heroLight.color.set('#5dff7a'); portalLight.intensity = 0; meteorLight.intensity = 0; watchLight.intensity = 0; watchLight.distance = 4;
  fill.intensity = 2.0; fill.color.set('#ffb27a'); hemi.intensity = 1.3; scene.fog.near = 30; scene.fog.far = 170; scene.fog.color.set('#2a0f55');
  setWatch('green', 1.4);
}
function swapAt(f, fs, A, B, x, z, ry) { const k = f < fs ? A : B; show(k, x, 0, z, ry); if (k === B) k.scale.setScalar(B.userData.sc * (0.55 + 0.45 * backOut(prog(f, fs, fs + 10)))); return k; }
function wl(k, I, col = '#5dff7a', d = 4) { const p = wpos(k.userData.watch); watchLight.position.set(p.x, p.y + 0.3 * k.scale.x, p.z + 0.2); watchLight.color.set(col); watchLight.intensity = I; watchLight.distance = d * k.scale.x; }
function tick(f) {
  fogareu.userData.flames.forEach((c, i) => c.scale.set(1, 1 + Math.sin(f * 0.6 + i * 1.7) * 0.35, 1));
  asinha.userData.wings.forEach((w, i) => (w.rotation.y = (i ? -1 : 1) * (0.25 + Math.sin(f * 0.9) * 0.6)));
}
const MZ = -95, MOUTH = (s = 1) => [0, 10 * s, MZ + 5.2 * s + 1.2];
const BOY = [1, -30.4], CR = [1, -32];

const SHOTS = [
  { f0: 0, f1: 60, run(f) { // hook: the watch glowing on the wrist, green lightning
    const k = show(civ, 0, 0, -56, 0); checkPose(k); setFace(k, 'smug'); setWatch('green', 1.5 + Math.sin(f * 0.5) * 0.3); parkCars();
    const w = wpos(k.userData.watch); wl(k, 0.8); const a = lerp(-0.6, 0.5, prog(f, 0, 60));
    const cp = [w.x + Math.sin(a) * 0.5, w.y + 0.38, w.z + Math.cos(a) * 0.5];
    return { cam: C(cp, [w.x, w.y + 0.05, w.z], dist(cp, [w.x, w.y, w.z])), ap: 0.008, shake: 0.2, bloom: 0.25, fx: () => { watchGlow(k, 3, f); if (f < 6) tint('rgba(255,255,255,A)', 1 - f / 6); speedLines(W / 2, H * 0.5, 0.5, f, '150,255,170'); } };
  } },
  { f0: 61, f1: 120, run(f) { // stakes: a giant monster roars in the avenue
    monsterState(f, { mouth: ss(prog(f, 70, 82)) * (1 - prog(f, 108, 118)), grow: 0 }); parkCars(1, f);
    fill.color.set('#c77dff'); fill.intensity = 3; fill.position.set(0, 6, -70);
    return { cam: C([1.5 - prog(f, 61, 120), 0.7, -60], [0, 11, -92], 34), ap: 0.001, shake: f > 72 ? 1.4 : 0.3, fx: () => { if (f < 66) tint('rgba(255,255,255,A)', 1 - prog(f, 61, 66)); embers(f, 0.5, 2); } };
  } },
  { f0: 121, f1: 165, run(f) { // a green light falls from the sky
    const z = -20 - (Math.min(f, 160) - 121) * 0.035; placeK(civ, { x: BOY[0], z, ry: Math.PI, ph: (f - 121) * 0.22, amt: f < 158 ? 0.42 : 0, lean: 0.03 }); civ.userData.watch.visible = false;
    civ.userData.head.rotation.x = -0.35; traffic(T(f) * 0.3); cars.forEach((c) => { if (Math.abs(c.position.z + 32) < 6) c.visible = false; });
    const t = prog(f, 121, 160) ** 1.25; const A = [-30, 75, -150], B = [CR[0], 0.6, CR[1]]; const mp = A.map((v, i) => lerp(v, B[i], t));
    meteor.visible = f < 160; meteor.position.set(...mp); meteorLight.intensity = f < 160 ? 25 : 40 * (1 - prog(f, 160, 166)); meteorLight.position.set(mp[0], mp[1] + 1, mp[2]);
    crater.visible = f >= 160; crater.position.set(CR[0], 0, CR[1]);
    return { cam: C([2.3, 1.5, -16.8], [0.2, 6.5, -45], 14), ap: 0.001, shake: f >= 160 ? 2.2 : 0.1,
      fx: () => { if (f < 160) { O.save(); O.globalCompositeOperation = 'lighter'; O.lineCap = 'round'; const pts = []; for (let j = 0; j < 14; j++) { const tt = Math.max(0, prog(f - j * 1.2, 121, 160) ** 1.25); pts.push(P(...A.map((v, i) => lerp(v, B[i], tt)))); } for (const [lw, a, c] of [[90, 0.15, '#5dff7a'], [36, 0.4, '#9dff9a'], [10, 0.9, '#ffffff']]) { O.strokeStyle = c; O.globalAlpha = a; O.lineWidth = lw; O.beginPath(); pts.forEach(([x, y], i) => (i ? O.lineTo(x, y) : O.moveTo(x, y))); O.stroke(); } O.restore(); const h = P(...mp); glow(h[0], h[1], 260, '93,255,122', 0.8); }
        else { const c = P(CR[0], 0.3, CR[1]); tint('rgba(220,255,220,A)', 1 - prog(f, 160, 165)); ringFx(c[0], c[1], prog(f, 160, 172), '93,255,122', 1500); glow(c[0], c[1], 600, '93,255,122', 0.8); } } };
  } },
  { f0: 166, f1: 208, run(f) { // right in front of you (reaction, green light on the face)
    const k = show(civ, BOY[0], 0, -21.4, Math.PI); k.userData.watch.visible = false; setFace(k, 'shock'); const g = ss(prog(f, 166, 174)); k.userData.arms[0].rotation.set(-1.1 * g, 0, -0.5); k.userData.arms[1].rotation.set(-1.1 * g, 0, 0.5); k.userData.body.rotation.x = -0.12 * g;
    traffic(T(160) * 0.3); cars.forEach((c) => { if (Math.abs(c.position.z + 32) < 6) c.visible = false; });
    crater.visible = true; crater.position.set(CR[0], 0, CR[1]); meteorLight.intensity = 8 + Math.sin(f * 0.6) * 2; meteorLight.position.set(CR[0], 1.2, CR[1] + 2);
    return { cam: C([1.5, 1.6, -24.6 + prog(f, 166, 208) * 0.6], [1, 1.6, -21.4], 3), ap: 0.004, shake: f < 180 ? 0.8 : 0.1,
      fx: () => { const r = rng(9); for (let i = 0; i < 18; i++) { const t = (f - 166) / 20 + r(); if (t > 1.6) continue; glow(W / 2 + (r() - 0.5) * 1400 * t, H * 0.55 + (r() - 0.6) * 900 * t, 10 + r() * 14, '150,255,170', 0.8 * (1 - t / 1.6)); } } };
  } },
  { f0: 209, f1: 293, run(f) { // the watch in the middle of the crater
    crater.visible = true; crater.position.set(CR[0], 0, CR[1]); crater.userData.gl.material.opacity = 0.05 + Math.sin(f * 0.2) * 0.03;
    watchItem.visible = true; watchItem.position.set(CR[0], 0.35 + Math.sin(f * 0.12) * 0.06, CR[1]); watchItem.rotation.set(-1.25, f * 0.02, 0.15); setWatch('green', 1.5 + Math.sin(f * 0.2) * 0.6);
    watchLight.position.set(CR[0], 1, CR[1] + 0.5); watchLight.intensity = 0.9; watchLight.distance = 4; watchLight.position.y = 1.8; traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    const k = prog(f, 209, 293); const cp = [lerp(1.6, 1.2, k), lerp(1.6, 0.85, k), lerp(-28.8, -30.6, k)];
    return { cam: C(cp, [CR[0], 0.35, CR[1]], dist(cp, [CR[0], 0.35, CR[1]])), ap: 0.005,
      fx: () => { const c = P(CR[0], 0.4, CR[1]); glow(c[0], c[1], 380, '93,255,122', 0.55); for (const sx of [-1, 1]) { const s = P(CR[0] + sx * 2.2, 0.3, CR[1]); smoke(s[0], s[1], f + sx * 20, 5, 0.9, '170,200,180', 0.25); } if (f > 259 && f < 270) ringFx(c[0], c[1], prog(f, 259, 270), '93,255,122', 500); } };
  } },
  { f0: 294, f1: 334, run(f) { // you pick it up and put it on your wrist
    const k = show(civ, BOY[0], 0, BOY[1], Math.PI); crater.visible = true; crater.position.set(CR[0], 0, CR[1]); traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    const c = ss(prog(f, 294, 306)) * (1 - ss(prog(f, 312, 322))); const u = k.userData; u.body.position.y = -0.22 * c; u.body.rotation.x = 0.45 * c; u.arms[1].rotation.set(-1.1 * c, 0, 0.18);
    const ck = ss(prog(f, 318, 328)); if (ck > 0) { checkPose(k, ck); slapPose(k, ck * 0.85); }
    setFace(k, f < 318 ? 'happy' : 'smug', 0); u.watch.visible = f >= 332;
    const wp = wpos(u.watch), hp = hand(k, 1); let ip;
    if (f < 300) ip = new THREE.Vector3(CR[0], 0.35, CR[1]); else if (f < 312) ip = new THREE.Vector3(CR[0], 0.35, CR[1]).lerp(hp, ss(prog(f, 300, 312))); else if (f < 322) ip = hp; else ip = hp.clone().lerp(wp, ss(prog(f, 322, 332)));
    watchItem.visible = f < 332; watchItem.position.copy(ip); watchItem.scale.setScalar(lerp(2.2, 1, prog(f, 318, 332))); watchItem.rotation.set(-0.9, f * 0.04, 0);
    setWatch('green', 1.2); watchLight.position.set(ip.x, ip.y + 0.3, ip.z - 0.3); watchLight.intensity = 3; watchLight.distance = 4;
    return { cam: C([3.1, 1.25, -31.6], [1, 0.95, -30.8], 2.3), ap: 0.003,
      fx: () => { if (f >= 330) { const p = PW(u.watch); glow(p[0], p[1], 300, '255,255,255', 1 - prog(f, 330, 335)); } } };
  } },
  { f0: 335, f1: 374, run(f) { // ...and it lights up
    const k = show(civ, BOY[0], 0, BOY[1], Math.PI); checkPose(k); slapPose(k, 0.0); setFace(k, f < 342 ? 'shock' : 'happyc'); traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    const I = f < 340 ? 0.25 : 0.25 + ss(prog(f, 340, 350)) * 1.5; setWatch('green', I); wl(k, I * 0.4, '#5dff7a', 3);
    const w = wpos(k.userData.watch); const cp = [w.x + 0.1, w.y + 0.42 - prog(f, 335, 374) * 0.06, w.z - 0.3 + prog(f, 335, 374) * 0.05];
    return { cam: C(cp, [w.x, w.y + 0.08, w.z], dist(cp, [w.x, w.y, w.z])), ap: 0.01, bloom: 0.25, shake: f > 340 && f < 350 ? 0.4 : 0,
      fx: () => { if (f >= 340) { watchGlow(k, 1 + ss(prog(f, 340, 350)) * 2, f); const p = PW(k.userData.watch); ringFx(p[0], p[1], prog(f, 340, 356), '93,255,122', 900, 0.6); } } };
  } },
  { f0: 375, f1: 406, run(f) { // you press the button
    const k = show(civ, BOY[0], 0, BOY[1], Math.PI); checkPose(k); slapPose(k, ss(prog(f, 392, 399))); setFace(k, 'smug'); traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    setWatch('green', 2.2 + prog(f, 398, 406) * 2); wl(k, 4);
    return { cam: C([1.75, 1.35, -32.4 - prog(f, 375, 406) * 0.3], [1, 1.4, BOY[1]], 2.2), ap: 0.004, fx: () => { watchGlow(k, 1.5 + prog(f, 398, 406) * 2, f); } };
  } },
  { f0: 407, f1: 433, run(f) { // ...and you become PEDRÃO
    const k = swapAt(f, 410, civ, pedrao, BOY[0], BOY[1], Math.PI); if (k === pedrao) { const r = ss(prog(f, 412, 424)); k.userData.arms[0].rotation.set(0, 0, -0.18 - 1.3 * r); k.userData.arms[1].rotation.set(0, 0, 0.18 + 1.3 * r); k.userData.head.rotation.x = -0.2 * r; } setFace(k, f < 418 ? 'shock' : 'stern');
    traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false)); heroLight.intensity = 8; heroLight.position.set(BOY[0], 2, BOY[1] - 1.5);
    return { cam: C([2.2, 0.7, -35.4], [1, 2.3, BOY[1]], 5), ap: 0.002, shake: f < 420 ? 1.4 : 0.3, fx: () => { transformFx(k, prog(f, 410, 433), '93,255,122', GREENS, f); nameTag('PEDRÃO!', pop(f, 414), '#7dff6a'); } };
  } },
  { f0: 434, f1: 490, run(f) { // a green giant
    const k = show(pedrao, BOY[0], 0, BOY[1], Math.PI); const fl = 0.5 + 0.5 * Math.sin(f * 0.18); k.userData.arms[0].rotation.set(0, 0, -1.5 - fl * 0.3); k.userData.arms[1].rotation.set(0, 0, 1.5 + fl * 0.3); k.userData.head.rotation.set(-0.15, Math.sin(f * 0.08) * 0.2, 0); setFace(k, f > 470 ? 'happyc' : 'stern');
    traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false)); crater.visible = true; crater.position.set(CR[0], 0, CR[1]);
    const a = lerp(-0.55, 0.25, prog(f, 434, 490)); const cp = [BOY[0] + Math.sin(a) * 5.5, 0.6, BOY[1] - Math.cos(a) * 5.5];
    heroLight.intensity = 3; heroLight.position.set(BOY[0], 3, BOY[1] - 2);
    return { cam: C(cp, [BOY[0], 2.6, BOY[1]], 5.6), ap: 0.002, fx: () => { aura(k, 0.6, f); } };
  } },
  { f0: 491, f1: 551, run(f) { // lifts a car with one hand
    const k = show(pedrao, BOY[0], 0, BOY[1], Math.PI); setFace(k, f > 524 ? 'happyc' : 'stern'); traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    const r = ss(prog(f, 500, 520)); k.userData.arms[1].rotation.set(0, 0, lerp(0.18, 2.95, r)); k.userData.arms[0].rotation.set(0, 0, -0.18 - (f > 524 ? ss(prog(f, 524, 534)) * 1.2 : 0));
    const c = cars[0]; c.visible = true; c.userData.body.position.y = 0; const g0 = new THREE.Vector3(-1.1, 0, BOY[1]), hp = hand(k, 1); const up = ss(prog(f, 495, 503));
    const cpos = g0.clone().lerp(new THREE.Vector3(hp.x, hp.y + 0.1, hp.z), up); c.position.copy(cpos); c.rotation.set(Math.sin(f * 0.15) * 0.06 * up, 0.3, Math.sin(f * 0.11) * 0.08 * up);
    heroLight.intensity = 3; heroLight.position.set(0, 4, BOY[1] - 3);
    return { cam: C([-3.6, 0.45, -37.4], [0, 3.4, BOY[1]], 7.5), ap: 0.0015, shake: f > 495 && f < 503 ? 0.8 : 0, fx: () => { if (f > 495 && f < 506) { const p = P(-1.1, 0.1, BOY[1]); dust(p[0], p[1], prog(f, 495, 515), 0.7); } } };
  } },
  { f0: 552, f1: 600, run(f) { // press again: ZUMMM
    const k = swapAt(f, 590, pedrao, zummm, BOY[0], BOY[1], Math.PI); traffic(T(160) * 0.3); cars.forEach((c) => (c.visible = false));
    if (k === pedrao) { checkPose(k); slapPose(k, ss(prog(f, 578, 586))); setFace(k, 'smug'); wl(k, 3); } else { runPose(k, 0.7, 0.55, 0.35); setFace(k, 'smug'); }
    const big = k === pedrao; if (big) k.userData.head.rotation.y = Math.sin(f * 0.12) * 0.18; const dr = prog(f, 552, 600); return { cam: C(big ? [1.9 - dr * 0.5, 2.4 + dr * 0.2, -34.2 + dr * 0.8] : [1.6 - dr * 0.2, 1.25, -33.2 + dr * 0.3], [1, big ? 2.6 : 1.3, BOY[1]], big ? 4 : 3), ap: 0.003, shake: f >= 590 && f < 598 ? 1 : 0,
      fx: () => { if (k === pedrao) watchGlow(k, 1.5 + prog(f, 584, 590) * 2, f); else { transformFx(k, prog(f, 590, 600), '76,201,240', BLUES, f); nameTag('ZUMMM!', pop(f, 593), '#8ff7ff'); } } };
  } },
  { f0: 601, f1: 650, run(f) { // so fast he crosses the city in three seconds
    const fn = (g) => ({ x: 0, z: -36 - (g - 601) * 2.6, ry: Math.PI, ph: g * 1.4, amt: 1, lean: 0.55 });
    const s = heroPath(zummm, fn, f, 5, 0.9); setFace(zummm, 'happyc'); traffic(T(f)); heroLight.color.set('#4cc9f0'); heroLight.intensity = 7; heroLight.position.set(0, 1.2, s.z);
    return { cam: C([0.8, 1.3, s.z - 4.2], [0, 1.15, s.z], 4.2), ap: 0.0015, shake: 0.3,
      fx: () => { trail(f, 20, 1.3); aura(zummm, 1, f, '76,201,240'); heroBolts(zummm, 1, f, BLUES); const b = heroBox(zummm); if (b) speedLines(b.cx, b.cy, 1, f, '170,240,255'); } };
  } },
  { f0: 651, f1: 697, run(f) { // across the rooftops
    STREET.visible = false; ROOF.visible = true;
    const fn = (g) => { const z = 6 - (g - 651) * 1.05; return { x: 0, y: roofY(z), z, ry: Math.PI, ph: g * 1.2, amt: 1, lean: 0.5 }; };
    const s = heroPath(zummm, fn, f, 4, 1.3); setFace(zummm, 'happyc'); heroLight.color.set('#4cc9f0'); heroLight.intensity = 6; heroLight.position.set(0, s.y + 1.2, s.z);
    return { cam: C([-6.8, 1.8, s.z + 1.2], [0, s.y + 0.9, s.z - 1.4], 7), ap: 0.0015, fx: () => { trail(f, 18); aura(zummm, 1, f, '76,201,240'); heroBolts(zummm, 1, f, BLUES); hLines(0.8, f, -1); if (f < 655) tint('rgba(200,240,255,A)', 0.5 * (1 - prog(f, 651, 655))); } };
  } },
  { f0: 698, f1: 747, run(f) { // then the ground shakes
    const sk = prog(f, 704, 712); const z = f < 712 ? -50 - 8 * Math.sin(prog(f, 698, 712) * Math.PI / 2) : -58;
    const k = show(zummm, 0, 0, z, Math.PI); if (f < 712) runPose(k, 0.9, 0.5, -0.25); k.userData.head.rotation.y = f > 716 ? Math.sin(f * 0.15) * 0.6 : 0; setFace(k, f > 712 ? 'worry' : 'smug', f > 716 ? Math.sin(f * 0.15) : 0);
    parkCars(sk * 1.4, f); fill.color.set('#c77dff');
    return { cam: C([1.7, 1.0, -62.6], [0, 1.3, z + 0.5], Math.abs(-62.6 - z)), ap: 0.003, shake: 0.2 + sk * 2.2,
      fx: () => { if (f < 714) { const p = P(0, 0.05, z); dust(p[0], p[1], prog(f, 700, 730), 0.6); } } };
  } },
  { f0: 748, f1: 828, run(f) { // a giant monster destroying the avenue
    const rise = ss(prog(f, 748, 788)); monster.position.y = lerp(-19, 0, rise); monsterState(f, { mouth: ss(prog(f, 792, 800)) * (1 - prog(f, 816, 826)), swing: f > 798 ? [0, Math.sin(prog(f, 798, 816) * Math.PI) * 1.2] : null });
    bigCrater.visible = true; bigCrater.position.set(0, 0, MZ); parkCars(1.2, f);
    const k = show(zummm, 0, 0, -58, Math.PI); setFace(k, 'shock');
    peds.slice(0, 4).forEach((p, i) => placeK(p, { x: [-3.6, 3.2, -1.4, 2.0][i], z: -78 + (f - 748) * 0.12 + i * 2.5, ry: 0, ph: f * 0.35 + i, amt: 1, lean: 0.2 })); peds.slice(0, 4).forEach((p) => setFace(p, 'shock'));
    fill.color.set('#c77dff'); fill.intensity = 4; fill.position.set(0, 8, -78);
    return { cam: C([1.3, 0.55, -52.5], [0, 9.5, MZ], 40), ap: 0.0008, shake: 1.2 + (f > 792 ? 0.6 : 0),
      fx: () => { setDebris(f, [{ f0: 752, o: [0, 1, MZ + 5], k: 14 }, { f0: 768, o: [-4, 1, MZ + 6], k: 12 }, { f0: 804, o: [-8, 12, MZ + 2], k: 10, dir: [0.8, 0, 0.4] }, { f0: 814, o: [8, 9, MZ + 2], k: 10, dir: [-0.8, 0, 0.4] }]);
        if (f < 790) { const p = P(0, 0.5, MZ); dust(p[0], p[1], prog(f, 748, 800), 1.6); } } };
  } },
  { f0: 829, f1: 855, run(f) { // you become FOGARÉU
    const k = swapAt(f, 846, zummm, fogareu, 0, -58, Math.PI); parkCars(0.3, f); monsterState(f, {});
    if (k === zummm) { checkPose(k); slapPose(k, ss(prog(f, 834, 842))); setFace(k, 'stern'); wl(k, 3); } else { setFace(k, 'stern'); k.userData.arms[1].rotation.set(-0.6, 0, 0.6); }
    heroLight.color.set('#ff7b00'); heroLight.intensity = k === fogareu ? 6 : 0; heroLight.position.set(0, 2, -60);
    return { cam: C([0.9, 1.55, -61.2], [0, 1.5, -58], 3.3), ap: 0.004, shake: f >= 846 && f < 852 ? 1 : 0.2,
      fx: () => { if (k === zummm) watchGlow(k, 1.5 + prog(f, 838, 846) * 2, f); else { transformFx(k, prog(f, 846, 855), '255,120,20', FIRES, f); nameTag('FOGARÉU!', pop(f, 848), '#ffba08'); } } };
  } },
  { f0: 856, f1: 923, run(f) { // fire blasts
    const k = show(fogareu, 0, 0, -58, Math.PI); setFace(k, 'stern'); parkCars(0.3, f);
    const L = [860, 874, 888, 902]; const cur = L.filter((l) => f >= l - 6).pop() || 860; const th = prog(f, cur - 6, cur) * (1 - prog(f, cur + 2, cur + 8)); k.userData.arms[1].rotation.set(-1.6 * th - 0.2, 0, 0.3); k.userData.arms[0].rotation.set(-0.8 * th, 0, -0.4);
    const hit = L.map((l) => f - l >= 14 && f - l < 24 ? 1 - (f - l - 14) / 10 : 0); monsterState(f, { look: Math.sin(f * 0.1) * 0.5 }); monster.userData.blob.scale.x *= 1 + Math.max(...hit) * 0.05;
    const tgt = new THREE.Vector3(...MOUTH()); const hp = hand(k, 1);
    fireballs.forEach((b, i) => { const t = (f - L[i]) / 14; b.visible = t >= 0 && t < 1; if (b.visible) { b.position.copy(hp.clone().lerp(tgt, t)); b.position.y += Math.sin(t * Math.PI) * 2; } });
    heroLight.color.set('#ff7b00'); heroLight.intensity = 6; heroLight.position.set(0, 2.5, -57);
    return { cam: C([1.5, 2.3, -54.2], [0, 7.5, MZ], 40), ap: 0.0008, shake: 0.3 + Math.max(...hit) * 1.2,
      fx: () => { fireballs.forEach((b) => { if (b.visible) { const p = PV(b.position); glow(p[0], p[1], 2400 / wpos(b).distanceTo(camera.position) + 40, '255,140,20', 0.9); } }); L.forEach((l, i) => { if (hit[i] > 0) { const p = PV(tgt); glow(p[0], p[1], 420 * (1.2 - hit[i]), '255,160,40', hit[i]); ringFx(p[0], p[1], 1 - hit[i], '255,150,30', 700, 0.6); } }); const b = heroBox(k); if (b) glow(b.hx, b.hy, b.hp * 0.6, '255,120,20', 0.4); } };
  } },
  { f0: 924, f1: 1011, run(f) { // the monster swallows the fire and grows
    const gr = ss(prog(f, 948, 990)); monster.scale.setScalar(1 + gr * 0.5); monsterState(f, { grow: gr, mouth: ss(prog(f, 926, 932)) * (1 - prog(f, 940, 946)) + ss(prog(f, 988, 996)) * (1 - prog(f, 1004, 1011)) });
    const k = show(fogareu, 0, 0, -58, Math.PI); setFace(k, 'shock'); parkCars(gr > 0.1 ? 0.8 : 0, f);
    const b = fireballs[0]; b.visible = f < 940; b.position.set(0, lerp(9, 10, prog(f, 924, 940)), lerp(MZ + 14, MZ + 6, prog(f, 924, 940)));
    fill.color.set(gr > 0.2 ? '#ff4d2d' : '#c77dff'); fill.intensity = 3 + gr * 4; fill.position.set(0, 10, -75);
    return { cam: C([3.4, 1.0, -48 - prog(f, 924, 1011) * 2], [0, 12, MZ], 45), ap: 0.0008, shake: 0.3 + gr * 1.5,
      fx: () => { if (b.visible) { const p = PV(b.position); glow(p[0], p[1], 120, '255,140,20', 0.9); } if (f > 942 && f < 950) { const p = P(0, 10, MZ + 5); glow(p[0], p[1], 500, '255,120,30', 1 - prog(f, 942, 950)); } tint('rgba(255,40,0,A)', gr * 0.12); embers(f, gr * 0.7, 4); } };
  } },
  { f0: 1012, f1: 1048, run(f) { // switch fast!
    const k = show(fogareu, 0, 0, -58, Math.PI); checkPose(k); slapPose(k, ss(prog(f, 1036, 1042))); setFace(k, f < 1024 ? 'shock' : 'stern'); wl(k, 3); parkCars(0.5, f);
    heroLight.color.set('#ff7b00'); heroLight.intensity = 4; heroLight.position.set(0, 2, -60);
    return { cam: C([0.75, 1.6, -60.6 + prog(f, 1012, 1048) * 0.4], [0, 1.55, -58], 2.5), ap: 0.005, shake: 0.5, fx: () => { watchGlow(k, 1.4 + prog(f, 1036, 1046) * 2, f); if (f > 1043) tint('rgba(255,255,255,A)', prog(f, 1043, 1048)); } };
  } },
  { f0: 1049, f1: 1067, run(f) { // ASINHA flies at its head... swatted
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, swing: [1, ss(prog(f, 1056, 1062)) * 1.4] }); parkCars(0.5, f);
    const hitT = prog(f, 1061, 1067); const x = lerp(-9, 1, prog(f, 1049, 1061)) + hitT * 7, y = 16 + Math.sin(f * 0.3) * 0.4 - hitT * 3, z = -76 + hitT * 4;
    const k = show(asinha, x, y, z, Math.PI / 2 + hitT * 6); k.scale.setScalar(1.6); runPose(k, 0.5, 0.3, 0.6); setFace(k, f > 1061 ? 'shock' : 'stern'); fill.color.set('#ff4d2d'); fill.intensity = 5;
    return { cam: C([-1.5, 13, -64], [0, 16, -82], 14), ap: 0.0015, shake: f > 1061 ? 1.2 : 0.3, fx: () => { if (f < 1056) transformFx(k, prog(f, 1049, 1057), '255,143,171', ['#ff8fab', '#ffc8dd', '#ffffff'], f); nameTag('ASINHA!', pop(f, 1049, 1054) * (1 - prog(f, 1064, 1067)), '#ffc8dd'); if (f > 1061) { const b = heroBox(k); if (b) glow(b.cx, b.cy, 260, '255,255,255', 0.8 * (1 - hitT)); } } };
  } },
  { f0: 1068, f1: 1088, run(f) { // BRAÇÃO's four-arm punches... bounced
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1 }); parkCars(0.5, f);
    const bk = ss(prog(f, 1080, 1088)); const k = show(bracao, 0, 0, -82 + bk * 6, Math.PI); setFace(k, f > 1080 ? 'shock' : 'stern');
    const u = k.userData; const ph = f * 1.2; u.arms[0].rotation.set(-1.5 - Math.sin(ph) * 0.3, 0, -0.2); u.arms[1].rotation.set(-1.5 + Math.sin(ph) * 0.3, 0, 0.2); u.arms2[0].rotation.set(-1.4 + Math.cos(ph) * 0.3, 0, -0.3); u.arms2[1].rotation.set(-1.4 - Math.cos(ph) * 0.3, 0, 0.3); u.body.rotation.x = 0.15 - bk * 0.4;
    monster.userData.blob.scale.z *= 1 - Math.abs(Math.sin(ph)) * 0.03; fill.color.set('#ff4d2d'); fill.intensity = 5;
    return { cam: C([5.5, 1.4, -76], [0, 3.6, -84], 9), ap: 0.0015, shake: 0.8, fx: () => { if (f < 1075) transformFx(k, prog(f, 1068, 1076), '255,159,67', FIRES, f); nameTag('BRAÇÃO!', pop(f, 1068, 1073) * (1 - prog(f, 1085, 1088)), '#ffba08'); if (f < 1080 && f % 3 === 0) { const p = P(0, 4.5, -85.5); glow(p[0], p[1], 180, '255,255,255', 0.7); } } };
  } },
  { f0: 1089, f1: 1105, run(f) { // PINGO, tiny as an ant... a giant foot comes down
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, stomp: 3.5 * (1 - ss(prog(f, 1096, 1101))) }); parkCars(0, f);
    const jump = f >= 1100 ? Math.sin(prog(f, 1100, 1105) * Math.PI) * 0.15 : 0; const k = show(pingo, 4.8 - prog(f, 1100, 1105) * 0.3, jump, -90.5, Math.PI * 0.85); setFace(k, 'shock'); runPose(k, f * 0.8, f >= 1100 ? 1 : 0.2, 0.2);
    fill.color.set('#ff4d2d'); fill.intensity = 4; fill.position.set(5, 1, -89);
    return { cam: C([5.05, 0.09, -89.85], [4.75, 0.35, -91.2], 0.75), ap: 0.012, shake: f >= 1100 ? 2 : 0.2, fx: () => { transformFx(k, prog(f, 1089, 1097), '128,237,153', GREENS, f); nameTag('PINGO!', pop(f, 1089, 1094), '#b7ffc4'); if (f >= 1100) { dust(W * 0.5, H * 0.7, prog(f, 1100, 1110), 1.2); } } };
  } },
  { f0: 1106, f1: 1140, run(f) { // PEDRÃO pushes back...
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, swing: [2, ss(prog(f, 1128, 1138)) * 1.6] }); parkCars(0.6, f);
    const k = show(pedrao, 0, 0, -82.6, Math.PI); k.userData.arms[0].rotation.set(-1.5, 0, -0.1); k.userData.arms[1].rotation.set(-1.5, 0, 0.1); k.userData.body.rotation.x = 0.3; k.userData.legs[0].rotation.x = 0.5; k.userData.legs[1].rotation.x = -0.3; setFace(k, f > 1128 ? 'shock' : 'stern');
    monster.rotation.x = 0.05 + Math.sin(f * 0.3) * 0.02; fill.color.set('#ff4d2d'); fill.intensity = 5;
    return { cam: C([6.8, 2.2, -77], [0, 4.2, -86], 10), ap: 0.0015, shake: 0.7, fx: () => { if (f < 1114) transformFx(k, prog(f, 1106, 1114), '93,255,122', GREENS, f); nameTag('PEDRÃO!', pop(f, 1106, 1111) * (1 - prog(f, 1135, 1140)), '#7dff6a'); } };
  } },
  { f0: 1141, f1: 1188, run(f) { // nothing works: knocked across the avenue
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1 }); parkCars(f > 1165 ? 1.5 * (1 - prog(f, 1165, 1180)) : 0, f);
    const t = prog(f, 1141, 1165); const k = pedrao; k.visible = true; standPose(k); k.scale.setScalar(k.userData.sc);
    if (f < 1165) { k.position.set(0, 2 + Math.sin(t * Math.PI) * 5, lerp(-82, -57, t)); k.rotation.set(-t * 5, Math.PI, 0); setFace(k, 'shock'); }
    else { k.position.set(0, 0.55, -56 + ss(prog(f, 1165, 1172)) * 1.2); k.rotation.set(-Math.PI / 2, 0, 0); setFace(k, 'worry', Math.sin(f * 0.3) * 0.5); }
    fill.color.set('#ff4d2d'); fill.intensity = 3;
    return { cam: C([3.0, 1.1, -48.5], [0, 1.6, -62], 9), ap: 0.002, shake: f >= 1165 && f < 1178 ? 2.4 : 0.4, fx: () => { if (f >= 1165) { const p = P(0, 0.3, -55.5); dust(p[0], p[1], prog(f, 1165, 1190), 1.3); } } };
  } },
  { f0: 1189, f1: 1263, run(f) { // the watch starts blinking red
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1 }); monster.position.z = -95 + prog(f, 1189, 1263) * 4; parkCars();
    const k = show(pedrao, 0, 0, -56, 0); const u = k.userData; u.body.position.y = -0.32; u.legs[0].rotation.x = -1.5; u.legs[1].rotation.x = 0.4; checkPose(k); setFace(k, 'worry');
    const bl = Math.floor(f / 6) % 2; setWatch('red', bl ? 2 : 0.5); wl(k, bl ? 1.2 : 0.3, '#ff2d3a', 3);
    const w = wpos(u.watch); const cp = [w.x + 0.25, w.y + 0.95, w.z + 0.75 - prog(f, 1189, 1263) * 0.15];
    return { cam: C(cp, [w.x, w.y + 0.2, w.z], dist(cp, [w.x, w.y, w.z])), ap: 0.008, bloom: 0.25, shake: 0.25,
      fx: () => { if (bl) { watchGlow(k, 2.5, f, '255,45,58', REDS); const p = PW(u.watch); ringFx(p[0], p[1], (f % 12) / 12, '255,45,58', 600, 0.6); } tint('rgba(255,0,30,A)', bl ? 0.12 : 0.04); } };
  } },
  { f0: 1264, f1: 1320, run(f) { // energy running out: flickering between forms
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, mouth: Math.max(0, Math.sin(f * 0.1)) * 0.6 }); monster.position.z = -88 + prog(f, 1264, 1320) * 3; parkCars();
    const r = rng(Math.floor(f / 3) * 7); const flick = f < 1302 && r() < 0.5; const k = show(flick ? pedrao : civ, 0, 0, -56, 0); setFace(k, 'worry', Math.sin(f * 0.2) * 0.4);
    const bl = Math.floor(f / 5) % 2; setWatch('red', bl ? 3 : 0.4); wl(k, bl ? 4 : 0.5, '#ff2d3a', 3);
    return { cam: C([0.9, 1.9, -50.8], [0, 2.2, -56], 5.3), ap: 0.002, shake: 0.4,
      fx: () => { const r2 = rng(f); if (f < 1302) for (let i = 0; i < 6; i++) { O.fillStyle = r2() < 0.5 ? 'rgba(93,255,122,.25)' : 'rgba(255,45,58,.25)'; O.fillRect(0, r2() * H, W, 8 + r2() * 30); } tint('rgba(255,0,30,A)', bl ? 0.14 : 0.04); if (bl) watchGlow(k, 1.5, f, '255,45,58', null); } };
  } },
  { f0: 1321, f1: 1367, run(f) { // last chance
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, mouth: ss(prog(f, 1340, 1348)) * 0.8 }); monster.position.z = -85; parkCars();
    const k = show(civ, 0, 0, -56, 0); setFace(k, 'stern'); k.userData.head.rotation.x = 0.05; const bl = Math.floor(f / 5) % 2; setWatch('red', bl ? 3 : 0.4); wl(k, bl ? 3 : 0.4, '#ff2d3a', 3);
    heroLight.color.set('#ff2d3a'); heroLight.intensity = bl ? 2 : 0.5; heroLight.position.set(0.4, 1.4, -55);
    return { cam: C([0.4, 1.68, -53.6 + prog(f, 1321, 1367) * 0.5], [0, 1.62, -56], 2.4 - prog(f, 1321, 1367) * 0.5), ap: 0.006, shake: f > 1340 ? 0.5 : 0.1, fx: () => { tint('rgba(255,0,30,A)', bl ? 0.1 : 0.03); } };
  } },
  { f0: 1368, f1: 1420, run(f) { // you slam the button with everything
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1 }); monster.position.z = -85; parkCars();
    const k = show(civ, 0, 0, -56, 0); checkPose(k); slapPose(k, ss(prog(f, 1392, 1398))); setFace(k, 'stern');
    const on = f >= 1398; setWatch(on ? 'gold' : 'red', on ? 2 + prog(f, 1398, 1420) * 1.5 : (Math.floor(f / 5) % 2 ? 3 : 0.4)); wl(k, on ? 1.5 : 0.6, on ? '#ffd23f' : '#ff2d3a', 4);
    const w = wpos(k.userData.watch); const cp = [w.x + 0.12, w.y + 0.5, w.z + 0.32];
    return { cam: C(cp, [w.x, w.y + 0.1, w.z], dist(cp, [w.x, w.y, w.z])), ap: 0.01, bloom: 0.25, shake: on ? 1.2 : 0.2,
      fx: () => { if (on) { watchGlow(k, 3 + prog(f, 1398, 1420) * 3, f, '255,210,63', GOLDS); const p = PW(k.userData.watch); ringFx(p[0], p[1], prog(f, 1398, 1412), '255,210,63', 1400, 0.6); ringFx(p[0], p[1], prog(f, 1404, 1418), '93,255,122', 1400, 0.6); tint('rgba(255,250,220,A)', prog(f, 1410, 1420)); } else watchGlow(k, 1.5, f, '255,45,58', REDS); } };
  } },
  { f0: 1421, f1: 1470, run(f) { // ...COLOSSO: a golden giant the size of a building
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, look: 0.5 }); monster.position.z = -95; parkCars(prog(f, 1421, 1470), f);
    const g = ss(prog(f, 1421, 1468)); const k = show(colosso, 0, 0, -62, Math.PI); k.scale.setScalar(lerp(1, 13, g)); setFace(k, 'stern'); setWatch('gold', 3);
    heroLight.color.set('#ffd23f'); heroLight.intensity = 20; heroLight.distance = 60; heroLight.position.set(0, 4 + g * 20, -56);
    const ym = lerp(1.2, 16, g);
    return { cam: C([1.2, 0.8, -45], [0, ym, -62], 17), ap: 0.0008, shake: 0.6 + g,
      fx: () => { if (f < 1428) tint('rgba(255,250,220,A)', 1 - prog(f, 1421, 1428)); aura(k, 0.8, f, '255,210,63'); heroBolts(k, 1.2, f, GOLDS); const p = P(0, 0.2, -62); dust(p[0], p[1], prog(f, 1440, 1480), 2); embers(f, 0.8, 5, false); } };
  } },
  { f0: 1471, f1: 1523, run(f) { // towering over the monster
    monster.scale.setScalar(1.5); monsterState(f, { grow: 1, look: 0, mouth: ss(prog(f, 1498, 1506)) * 0.7 }); monster.position.z = -100; parkCars();
    const k = show(colosso, 0, 0, -66, Math.PI); k.scale.setScalar(13); setFace(k, 'stern'); k.userData.arms[1].rotation.set(0, 0, 0.5); k.userData.arms[0].rotation.set(0, 0, -0.5); setWatch('gold', 2.5);
    heroLight.color.set('#ffd23f'); heroLight.intensity = 25; heroLight.distance = 60; heroLight.position.set(0, 20, -78);
    return { cam: C([5.2, 2.0 + prog(f, 1471, 1523) * 2, -84 + prog(f, 1471, 1523) * 2], [0, 21, -66], 24), ap: 0.0008, shake: 0.3, fx: () => { aura(k, 0.6, f, '255,210,63'); heroBolts(k, 0.9, f, GOLDS); nameTag('COLOSSO!', pop(f, 1474), '#ffd23f'); } };
  } },
  { f0: 1524, f1: 1568, run(f) { // one punch
    monster.scale.setScalar(1.5); const hitT = prog(f, 1540, 1560); monsterState(f, { grow: 1, mouth: f < 1540 ? 0.6 : 0 }); monster.position.z = -100 - ss(hitT) * 3; monster.rotation.x = -ss(hitT) * 0.2; parkCars(f > 1540 ? 1.5 : 0, f);
    const k = show(colosso, 0, 0, -80, Math.PI); k.scale.setScalar(13); setFace(k, 'stern');
    const wind = ss(prog(f, 1524, 1534)), thr = ss(prog(f, 1534, 1540)); k.userData.arms[1].rotation.set(0.9 * wind - 2.5 * thr, 0, 0.3); k.userData.body.rotation.y = 0.3 * wind - 0.5 * thr; k.userData.arms[0].rotation.set(-0.6, 0, -0.4);
    heroLight.color.set('#ffd23f'); heroLight.intensity = 25; heroLight.distance = 60; heroLight.position.set(0, 20, -70);
    const cp = [5.5, 9, -42];
    return { cam: C(cp, [0, 15, -88], 46), ap: 0.0006, shake: f >= 1540 && f < 1556 ? 3 : 0.3,
      fx: () => { setDebris(f, [{ f0: 1540, o: [0, 15, -90], k: 14, dir: [0, 0.2, -0.5], sz: 1.6 }, { f0: 1541, o: [0, 13, -90], k: 18, sz: 1.2 }]); if (f >= 1540) { const p = P(0, 15, -89); tint('rgba(255,250,220,A)', 1 - prog(f, 1540, 1546)); glow(p[0], p[1], 700, '255,220,90', 1 - hitT); ringFx(p[0], p[1], prog(f, 1540, 1556), '255,210,63', 1600, 0.8); ringFx(p[0], p[1], prog(f, 1543, 1562), '255,255,255', 1600, 0.8); } } };
  } },
  { f0: 1569, f1: 1620, run(f) { // the monster collapses
    monster.scale.setScalar(1.5); const fall = prog(f, 1569, 1600) ** 2; monsterState(f, { grow: 1 - prog(f, 1590, 1620) * 0.6, mouth: 0.5 }); monster.position.z = -103; monster.rotation.x = -0.2 - fall * 1.3; parkCars(f > 1600 ? 1.8 * (1 - prog(f, 1600, 1615)) : 0, f);
    const k = show(colosso, 0, 0, -80, Math.PI); k.scale.setScalar(13); setFace(k, 'smug'); k.userData.arms[1].rotation.set(-1.2, 0, 0.3);
    heroLight.color.set('#ffd23f'); heroLight.intensity = 20; heroLight.distance = 60; heroLight.position.set(0, 15, -70);
    return { cam: C([4.4, 1.0, -64], [0, 9, -102], 38), ap: 0.0008, shake: f >= 1600 && f < 1614 ? 3 : 0.3,
      fx: () => { if (f >= 1600) { const p = P(0, 0.5, -112); dust(p[0], p[1], prog(f, 1600, 1625), 3); tint('rgba(255,255,255,A)', 0.4 * (1 - prog(f, 1600, 1605))); } setDebris(f, [{ f0: 1600, o: [0, 1, -110], k: 16, sz: 1.5 }, { f0: 1602, o: [-5, 1, -106], k: 12, sz: 1.2 }]); } };
  } },
  { f0: 1621, f1: 1681, run(f) { // the watch glows again
    monster.scale.setScalar(1.5); monsterState(f, { grow: 0.2 }); monster.position.z = -103; monster.rotation.x = -1.5; parkCars();
    const k = show(civ, 0, 0, -80, 0); checkPose(k); setFace(k, f > 1648 ? 'happyc' : 'happy'); const I = f < 1645 ? 0.4 : 0.4 + ss(prog(f, 1645, 1656)) * 1.6; setWatch('green', I); wl(k, I * 0.4);
    const w = wpos(k.userData.watch); const pb = prog(f, 1621, 1681); const cp = [w.x + 0.15 + pb * 0.4, w.y + 0.45 + pb * 0.5, w.z + 0.35 + pb * 0.9];
    return { cam: C(cp, [w.x, w.y + 0.1 + pb * 0.35, w.z], dist(cp, [w.x, w.y, w.z])), ap: 0.008, bloom: 0.25, fx: () => { if (f < 1626) tint('rgba(255,250,220,A)', 1 - prog(f, 1621, 1626)); if (f >= 1645) { watchGlow(k, 1 + ss(prog(f, 1645, 1656)) * 2, f); const p = PW(k.userData.watch); ringFx(p[0], p[1], prog(f, 1648, 1662), '93,255,122', 900, 0.6); } } };
  } },
  { f0: 1682, f1: TOTAL - 1, run(f) { // final: would you survive 24 hours with this watch?
    monster.scale.setScalar(1.5); monsterState(f, { grow: 0.1 }); monster.position.z = -103; monster.rotation.x = -1.5; parkCars();
    const k = show(civ, 0, 0, -80, 0); const up = ss(prog(f, 1690, 1702)); k.userData.arms[0].rotation.set(0, 0, -0.18 - 2.6 * up); k.userData.arms[1].rotation.set(0, 0, 0.3); setFace(k, 'smug'); setWatch('green', 1.8); wl(k, 4, '#5dff7a', 5);
    const kk = prog(f, 1682, 1799);
    return { cam: C([Math.sin(T(f) * 0.5) * 0.4, 0.75 + kk * 0.2, -75.2 - kk * 0.8], [0, 1.95, -80], 4.6 - kk * 0.8), ap: 0.0025, shake: 0.1,
      fx: () => { watchGlow(k, 1.6, f); aura(k, 0.6, f); embers(f, 0.7, 7, false); O.save(); O.fillStyle = 'rgba(0,15,5,.4)'; O.fillRect(0, 0, W, 760 * Math.min(1, pop(f, 1686))); O.restore();
        titleLine('VOCÊ CONSEGUIRIA', 230, pop(f, 1688), 88, '#ffffff'); titleLine('SOBREVIVER 24 HORAS', 385, pop(f, 1712), 82, '#7dff6a'); titleLine('COM ESSE RELÓGIO?', 545, pop(f, 1740, 1750) * (1 + Math.sin(f * 0.2) * 0.02), 92, '#ffffff'); } };
  } },
];

function renderFrame(f) {
  reset(); tick(f);
  const sh = SHOTS.find((s) => f >= s.f0 && f <= s.f1) || SHOTS[SHOTS.length - 1];
  const R = sh.run(f);
  let [px, py, pz] = R.cam.p; const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(f * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  key.position.set(px + 6, 18, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); key.target.updateMatrixWorld();
  if (fill.intensity === 2.0) fill.position.set(px + 0.8, py + 1.5, pz + 0.5);
  bloom.strength = R.bloom ?? 0.55; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1;
  O.drawImage(renderer.domElement, 0, 0);
  if (!window.NOFX) R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.42, W / 2, H / 2, H * 0.72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,0,20,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
