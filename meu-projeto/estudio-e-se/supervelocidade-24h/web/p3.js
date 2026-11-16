
// ---------- shots
const T = (f) => f / 30;
function reset() {
  STREET.visible = true; ROOF.visible = false; TUNNEL.visible = false; portal.visible = false; rain.visible = false; shards.visible = false;
  cracks.forEach((c) => (c.visible = false));
  for (const o of [hero, civ, runaway, ...ghosts, ...peds, ...cars]) o.visible = false;
  peds.forEach((p) => { p.scale.setScalar(p === peds[4] ? 1.1 : 1.18); if (p.userData.umb) p.userData.umb.visible = true; });
  standPose(hero); setFace(hero, 'smug'); HFN = null;
  heroLight.intensity = 0; heroLight.color.set('#ff4a1c'); portalLight.intensity = 0; fill.intensity = 2.0; fill.color.set('#ffb27a');
  scene.fog.near = 30; scene.fog.far = 170; scene.fog.color.set('#2a0f55'); renderer.toneMappingExposure = 1.25; hemi.intensity = 1.3;
  bokeh.uniforms.aperture.value = 0.0025; bloom.strength = 0.55;
}
const C = (p, l, d) => ({ p, l, d });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const GAPS = () => window.ROOF_GAPS;
function roofY(z) { for (const [c, hw] of GAPS()) { const R = hw + 1.8; if (Math.abs(z - c) < R) return 1.5 * (1 - ((z - c) / R) ** 2); } return 0; }

// stage positions
const CROSS = -60, CW = [[-3.2, CROSS - 0.6], [-0.6, CROSS + 0.5], [2.0, CROSS - 0.3]], SAFE = (i) => [7.1, CROSS + 3 - i * 1.4];

const SHOTS = [
  { f0: 0, f1: 99, run(f) { // tease: a streak of red lightning races at the camera
    const fn = (g) => { let z; if (g < 55) z = -110 + 103 * prog(g, 0, 55) ** 1.6; else if (g < 85) z = -7 + 4 * prog(g, 55, 85); else z = -3 + 60 * prog(g, 85, 99) ** 1.4; const ph = g < 55 ? g * 1.3 : g < 85 ? 71.5 + (g - 55) * 0.22 : 78 + (g - 85) * 1.3; return { x: 0.9, z, ry: 0, ph, amt: 1, lean: 0.45 }; };
    const s = heroPath(fn, f, f < 55 || f > 85 ? 4 : 2, f < 55 ? 2.5 : 0.6); traffic(T(f)); setRain(0, 0, T(f), false); setFace(hero, f > 60 ? 'smug' : 'stern');
    heroLight.intensity = 6; heroLight.position.set(s.x, 1.2, s.z);
    const l = [s.x * 0.7, 1.2, Math.min(s.z, -1)]; return { cam: C([-0.9, 0.95, 2.2], l, dist([-0.9, 0.95, 2.2], [s.x, 1.2, s.z])), shake: f > 50 && f < 60 ? 1 : 0.2,
      fx: () => { trail(f, 16, 1.2); aura(hero, 1, f); heroBolts(hero, 1.2, f); speedLines(W / 2, H * 0.48, f < 55 ? 0.7 : f > 85 ? 1 : 0.25, f); if (f < 6) tint('rgba(255,255,255,A)', 1 - f / 6); if (f >= 8 && f < 14) tint('rgba(200,180,255,A)', 0.35 * (1 - prog(f, 8, 14))); } };
  } },
  { f0: 100, f1: 199, run(f) { // ordinary kid walking home in the rain... sparks begin
    const k = Math.min(f - 100, 75), z = -20 + k * 0.045; placeK(civ, { x: 6.3, z, ry: 0, ph: k * 0.22, amt: f < 175 ? 0.42 : 0, lean: 0.03 });
    const up = ss(prog(f, 180, 192)); civ.userData.arms[0].rotation.set(-1.3 * up, 0, -0.2 - 0.2 * up); civ.userData.arms[1].rotation.set(-1.3 * up, 0, 0.2 + 0.2 * up); civ.userData.head.rotation.x = 0.35 * up;
    setFace(civ, f < 178 ? 'happy' : 'shock', 0); traffic(T(f)); setRain(6, z, T(f), false);
    const I = prog(f, 165, 199); heroLight.intensity = I * 5; heroLight.position.set(6.3, 1.2, z + 0.4);
    return { cam: C([5.3, 1.55, z + 3.4 - prog(f, 100, 199) * 0.8], [6.3, 1.35, z], 3.2), shake: I * 0.4,
      fx: () => { aura(civ, I * 0.8, f); heroBolts(civ, I * 0.9, f, 5); } };
  } },
  { f0: 200, f1: 269, run(f) { // the lightning takes him... flash... ZÁS
    const z = -20 + 75 * 0.045; const sw = f >= 242; const k = sw ? hero : civ;
    k.visible = true; k.position.set(6.3, 0, z); k.rotation.set(0, 0, 0); standPose(k);
    if (!sw) { civ.userData.arms[0].rotation.set(-1.3, 0, -0.4); civ.userData.arms[1].rotation.set(-1.3, 0, 0.4); civ.userData.head.rotation.x = 0.3; setFace(civ, 'shock'); civ.position.y = prog(f, 215, 241) * 0.25; }
    else { const r = ss(prog(f, 244, 256)); hero.userData.arms[0].rotation.set(-0.3 * r, 0, -0.5 * r - 0.18); hero.userData.arms[1].rotation.set(-1.6 * r, 0, 0.5); hero.userData.legs[0].rotation.x = -0.25 * r; hero.userData.legs[1].rotation.x = 0.2 * r; setFace(hero, f > 250 ? 'smug' : 'shock'); hero.position.y = 0.25 * (1 - ss(prog(f, 242, 250))); }
    traffic(T(f)); setRain(6, z, T(f), false); heroLight.intensity = sw ? 4 + Math.sin(f * 0.9) : 6 + prog(f, 200, 241) * 6; heroLight.position.set(6.3, 1.3, z + 0.8);
    const cp = sw ? [6.3 + 0.75, 0.75, z + 2.3 - prog(f, 242, 269) * 0.5] : [6.3 + 0.9, 0.85, z + 1.7];
    return { cam: C(cp, [6.3, sw ? 1.3 : 1.55, z], 2.0), shake: sw ? 0.2 : 0.6 + prog(f, 200, 241),
      fx: () => { const I = sw ? 0.9 : 0.9 + prog(f, 200, 241) * 1.6; aura(k, I, f); heroBolts(k, I, f, 9); if (!sw) for (let i = 0; i < 3; i++) { const b = heroBox(k); if (b) bolt(b.cx + (i - 1) * 300, 0, b.cx + (i - 1) * 60, b.cy, f * 3 + i, BOLT_COLS[i], 5); }
        if (f >= 236 && f < 256) tint('rgba(255,250,235,A)', f < 242 ? prog(f, 236, 242) : 1 - prog(f, 242, 256)); } };
  } },
  { f0: 270, f1: 319, run(f) { // one step... and the world stops
    const z = -20 + 75 * 0.045; const st = ss(prog(f, 284, 303)); hero.visible = true; hero.position.set(6.3 - st * 0.55, 0, z); hero.rotation.set(0, -Math.PI / 2, 0); standPose(hero);
    hero.userData.legs[0].rotation.x = -Math.sin(st * Math.PI) * 0.7; hero.userData.legs[1].rotation.x = Math.sin(st * Math.PI) * 0.25; setFace(hero, 'stern');
    const wt = T(Math.min(f, 303)); traffic(wt); setRain(5, z, wt, f >= 303); heroLight.intensity = 3; heroLight.position.set(5.6, 0.6, z + 0.8);
    return { cam: C([3.6, 0.32, z + 2.6], [5.9, 0.55, z], 3.4), shake: f >= 303 && f < 312 ? 1.5 : 0, freeze: ss(prog(f, 303, 316)) * 0.7,
      fx: () => { const p = P(5.7, 0.05, z); ringFx(p[0], p[1], prog(f, 303, 322)); ringFx(p[0], p[1], prog(f, 309, 330), '255,60,30'); } };
  } },
  { f0: 320, f1: 374, run(f) { // wide: everything frozen
    const z = -20 + 75 * 0.045; hero.visible = true; hero.position.set(5.75, 0, z); hero.rotation.set(0, -Math.PI / 2 + Math.sin(T(f) * 2) * 0.3, 0); standPose(hero); hero.userData.head.rotation.y = Math.sin(T(f) * 2.4) * 0.5; setFace(hero, 'shock', Math.sin(T(f) * 2.4) * -0.6);
    const wt = T(303); traffic(wt); setRain(2, z - 4, wt, true);
    placeK(peds[0], { x: 7.2, z: z - 5, ry: Math.PI, ph: 0.9, amt: 0.5, lean: 0.05 }); placeK(peds[1], { x: -6.8, z: z - 8, ry: 0, ph: -0.9, amt: 0.5, lean: 0.05 }); placeK(peds[2], { x: 7.0, z: z - 11, ry: 0, ph: 0.5, amt: 0.5, lean: 0.05 });
    heroLight.intensity = 2.5; heroLight.position.set(5.75, 1.3, z + 1);
    return { cam: C([2.6 + prog(f, 320, 374) * 0.5, 2.3, z + 6.8], [5.2, 1.2, z - 1.5], 7.3), freeze: 0.7, heroTop: true, fx: () => {} };
  } },
  { f0: 375, f1: 439, run(f) { // rain hanging in the air
    const z = -16; hero.visible = true; hero.position.set(3.2, 0, z); hero.rotation.set(0, 0.4, 0); standPose(hero); setFace(hero, f > 412 ? 'happyc' : 'happy', 0.3);
    const r = ss(prog(f, 398, 414)); hero.userData.arms[1].rotation.set(-1.75 * r, -0.2 * r, 0.25); hero.userData.head.rotation.set(-0.15, 0.25, 0);
    traffic(T(303)); setRain(3.2, z, T(303), true); rainLocal(3.2, 1.9, z);
    heroLight.intensity = 2.2; heroLight.position.set(3.6, 2.2, z + 1.2);
    const a = lerp(-0.2, 1.0, prog(f, 375, 439));
    return { cam: C([3.2 + Math.sin(a) * 1.7, 1.85, z + Math.cos(a) * 1.7], [3.2, 1.7, z], 1.7), freeze: 0.65, heroTop: true, ap: 0.006,
      fx: () => { if (f > 414) { const h = PW(hero.userData.arms[1], 0); const p = P(3.2 + 0.32, 2.15, z + 0.55); for (let i = 0; i < 8; i++) { const ag = i / 8 * 7, R = 20 + prog(f, 414, 430) * 60; O.fillStyle = `rgba(190,235,255,${1 - prog(f, 414, 432)})`; O.beginPath(); O.arc(p[0] + Math.cos(ag) * R, p[1] + Math.sin(ag) * R, 7, 0, 7); O.fill(); } } } };
  } },
  { f0: 440, f1: 524, run(f) { // people frozen mid-move
    const z0 = -22, k = prog(f, 440, 524), hz = z0 - k * 6; placeK(hero, { x: 5.3, z: hz, ry: Math.PI, ph: f * 0.18, amt: 0.4, lean: 0.03 });
    const wave = prog(f, 488, 496) - prog(f, 512, 520); if (wave > 0) { const w = Math.sin(f * 0.6) * 0.4; hero.userData.arms[0].rotation.set(-1.5, 0, -0.9 + w); hero.userData.head.rotation.y = -0.5; }
    setFace(hero, f > 495 ? 'smug' : 'happy', f > 488 ? -0.5 : 0);
    placeK(peds[3], { x: 6.9, z: z0 - 7.5, ry: Math.PI / 2 + 0.3, ph: 1.0, amt: 0.6, lean: 0.1 }); setFace(peds[3], 'happy');
    placeK(peds[1], { x: 7.4, y: 0.55, z: z0 - 3.2, ry: Math.PI, ph: 1.4, amt: 0.8, lean: 0.15 }); setFace(peds[1], 'shock');
    placeK(peds[2], { x: 7.6, z: z0 - 1, ry: Math.PI, ph: 0.7, amt: 0.5, lean: 0.05 });
    placeK(peds[6], { x: 7.3, z: z0 - 10, ry: 0.4, ph: -0.8, amt: 0.5, lean: 0.05 }); setFace(peds[6], 'happyc');
    traffic(T(303)); setRain(5, hz - 2, T(303), true); heroLight.intensity = 2.4; heroLight.position.set(5.3, 1.5, hz - 0.8);
    return { cam: C([3.9, 1.65, hz - 4.2], [6.0, 1.4, hz - 0.6], 4.0), freeze: 0.7, heroTop: true, fx: () => {} };
  } },
  { f0: 525, f1: 571, run(f) { // across the rooftops (side tracking)
    STREET.visible = false; ROOF.visible = true;
    const fn = (g) => { const z = 6 - (g - 525) * 0.95; return { x: 0, y: roofY(z), z, ry: Math.PI, ph: g * 1.1, amt: 1, lean: 0.5 }; };
    const s = heroPath(fn, f, 4, 1.3); setFace(hero, 'happyc'); heroLight.intensity = 6; heroLight.position.set(s.x, s.y + 1.2, s.z);
    return { cam: C([-6.8, 1.8, s.z + 1.2], [0, s.y + 0.9, s.z - 1.4], 7), ap: 0.0015, fx: () => { trail(f, 18); aura(hero, 1, f); heroBolts(hero, 1, f); hLines(0.8, f, -1); } };
  } },
  { f0: 572, f1: 619, run(f) { // leaps over the camera
    STREET.visible = false; ROOF.visible = true;
    const zc = 6 - (600 - 525) * 0.95; const slow = (g) => g < 592 ? g : g < 612 ? 592 + (g - 592) * 0.3 : 598 + (g - 612);
    const fn = (g) => { const gg = slow(g); const z = 6 - (gg - 525) * 0.95; const jump = Math.max(0, 1 - ((z - zc + 0.5) / 4.2) ** 2) * 2.4; return { x: 0.3, y: roofY(z) + jump, z, ry: Math.PI, ph: gg * 1.1, amt: 1, lean: 0.45 }; };
    const s = heroPath(fn, f, 3, 1.2); setFace(hero, 'smug'); heroLight.intensity = 6; heroLight.position.set(s.x, s.y + 1.2, s.z);
    const cp = [1.2, 0.35, zc - 1.2]; const l = [s.x, s.y + 1.0, Math.max(s.z, zc - 0.4)];
    return { cam: C(cp, l, dist(cp, [s.x, s.y + 1, s.z])), ap: 0.0015, shake: f > 600 && f < 612 ? 0.5 : 0.1, fx: () => { trail(f, 14); aura(hero, 1, f); heroBolts(hero, 1.1, f); } };
  } },
  { f0: 620, f1: 689, run(f) { // across the city in two seconds
    const fn = (g) => ({ x: 0, z: 20 - (g - 620) * 2.6, ry: Math.PI, ph: g * 1.4, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.9); setFace(hero, 'happyc'); traffic(T(303)); setRain(0, s.z - 6, T(303), true);
    heroLight.intensity = 7; heroLight.position.set(0, 1.2, s.z);
    return { cam: C([0.7, 1.4, s.z + 4.0], [0, 1.15, s.z - 6], 4.1), ap: 0.0015, shake: 0.3,
      fx: () => { trail(f, 20, 1.3); aura(hero, 1.1, f); heroBolts(hero, 1.2, f); const b = heroBox(); if (b) speedLines(b.cx, b.cy, 1, f); } };
  } },
  { f0: 690, f1: 759, run(f) { // weaving between cars like statues
    const fn = (g) => { const z = -40 - (g - 690) * 1.5; const jump = Math.max(0, 1 - ((z + 95) / 3.4) ** 2) * 2.0; return { x: Math.sin((g - 690) * 0.16) * 0.9, y: jump, z, ry: Math.PI + Math.cos((g - 690) * 0.16) * 0.25, ph: g * 1.3, amt: 1, lean: 0.5 }; };
    const s = heroPath(fn, f, 4, 1.0); setFace(hero, f > 716 ? 'smug' : 'happy');
    traffic(T(303)); cars[1].position.set(0, 0, -95); cars[1].rotation.y = Math.PI; for (let i = 2; i < 10; i++) { cars[i].position.set(i % 2 ? 2.6 : -2.6, 0, -50 - i * 7); cars[i].rotation.y = i % 2 ? Math.PI : 0; }
    setRain(0, s.z - 5, T(303), true); heroLight.intensity = 6; heroLight.position.set(s.x, 1.2, s.z);
    const cp = [0.4, 2.3, s.z - 6.5];
    return { cam: C(cp, [s.x * 0.5, 1.1 + s.y * 0.5, s.z], 6.5), ap: 0.0015, shake: 0.25, fx: () => { trail(f, 16); aura(hero, 1, f); heroBolts(hero, 1, f); } };
  } },
  { f0: 760, f1: 815, run(f) { // then you see it...
    const z = -50; hero.visible = true; hero.position.set(5.9, 0, z); hero.rotation.set(0, -Math.PI * 0.62, 0); standPose(hero);
    const turn = ss(prog(f, 768, 776)); hero.userData.head.rotation.y = lerp(0.6, -0.15, turn); setFace(hero, f < 772 ? 'happy' : f < 798 ? 'shock' : 'stern', -0.3);
    traffic(T(f) + 20, [0]); setRain(5, z, T(f), false); placeCar(runaway, { x: 0.4, z: -150 + (f - 760) * 0.8, ry: Math.sin(f * 0.2) * 0.25, amt: 0 }); runaway.userData.body.rotation.set(0, 0, 0);
    heroLight.intensity = 2.5; heroLight.position.set(5.5, 1.8, z - 1); fill.position.set(4.6, 2, z - 2); fill.color.set('#cfe4ff'); fill.intensity = 2 + Math.max(0, Math.sin(f * 0.25)) * 2;
    return { cam: C([5.05, 1.72, z - 1.25 + prog(f, 760, 815) * 0.25], [5.9, 1.68, z], 1.2), ap: 0.004, fx: () => {} };
  } },
  { f0: 816, f1: 904, run(f) { // runaway car toward the crosswalk
    traffic(T(f) + 20, [0, 1]); setRain(0, -55, T(f), false);
    const cz = -150 + (f - 760) * 0.8; placeCar(runaway, { x: Math.sin(f * 0.12) * 1.3, z: cz, ry: Math.sin(f * 0.21) * 0.35, amt: 0 }); runaway.userData.body.rotation.z = Math.sin(f * 0.21) * 0.05;
    const turn = f > 856; CW.forEach(([x, z], i) => { placeK(peds[i], { x: turn ? x + 1.4 : x + (f - 816) * 0.03, z, ry: turn ? Math.PI : Math.PI / 2, ph: f * 0.2 + i, amt: turn ? 0 : 0.45, lean: 0.03 }); setFace(peds[i], turn ? 'shock' : 'happy'); if (turn) { const u = peds[i].userData; u.arms[0].rotation.set(0, 0, -2.2); u.arms[1].rotation.set(0, 0, 2.2); } });
    fill.position.set(0, 2, cz + 4); fill.color.set('#fff3d0'); fill.intensity = 6;
    return { cam: C([-1.4 + prog(f, 816, 904) * 0.6, 1.25, -49], [0.6, 1.4, -72], 11), shake: 0.25 + prog(f, 870, 904) * 0.5,
      fx: () => { const p = P(runaway.position.x, 0.4, cz - 2); if (p[2] < 1) smoke(p[0], p[1], f, 6, 0.6); } };
  } },
  { f0: 905, f1: 999, run(f) { // the rescue in a blink
    traffic(T(870) + 20, [0, 1]); setRain(0, -60, T(905) + (f - 905) * 0.004, false);
    const cz = f < 970 ? -80 + (f - 905) * 0.21 : f < 985 ? -66.4 + (f - 970) * 1.6 : -42.4 + 0 * (f - 985);
    placeCar(runaway, { x: 0.3, z: cz, ry: f < 985 ? 0.15 : 0.4, amt: 0 });
    const SW = [925, 940, 955];
    CW.forEach(([x, z], i) => { const safe = f >= SW[i]; const [sx, sz] = SAFE(i); placeK(peds[i], { x: safe ? sx : x + 1.4, z: safe ? sz : z, ry: safe ? -Math.PI / 2 : Math.PI, amt: 0 }); setFace(peds[i], 'shock'); const u = peds[i].userData; u.arms[0].rotation.set(0, 0, -2.2); u.arms[1].rotation.set(0, 0, 2.2); });
    const fn = (g) => { for (let i = 0; i < 3; i++) { if (g < SW[i] && g >= SW[i] - 15) { const t = prog(g, SW[i] - 15, SW[i]); const [x, z] = CW[i], [sx, sz] = SAFE(i); const a = t < 0.5 ? ss(t * 2) : 1 - ss((t - 0.5) * 2); return { x: lerp(sx - 1.2, x + 1.4, a), z: lerp(sz, z, a), ry: -Math.PI / 2 + (t < 0.5 ? Math.PI : 0), ph: g * 1.5, amt: 1, lean: 0.5 }; } } return { x: 6.3, z: CROSS + 5, ry: -Math.PI / 2, ph: 0, amt: 0, lean: 0 }; };
    if (f < 958) heroPath(fn, f, 3, 1.2); else if (f < 985) { hero.visible = true; hero.position.set(6.2, 0, CROSS + 5); hero.rotation.set(0, -Math.PI / 2, 0); standPose(hero); setFace(hero, 'smug'); }
    heroLight.intensity = hero.visible ? 5 : 0; heroLight.position.set(hero.position.x, 1.3, hero.position.z);
    fill.position.set(0, 2, cz + 4); fill.color.set('#fff3d0'); fill.intensity = 5;
    return { cam: C([10.5, 8.5, -47], [1.5, 0.3, -61], 17), ap: 0.001, freeze: f < 970 ? 0.35 : 0, shake: f > 970 && f < 990 ? 0.6 : 0,
      fx: () => { if (f < 958) { trail(f, 10, 0.8); heroBolts(hero, 0.8, f); } SW.forEach((s, i) => { if (f >= s && f < s + 8) { const a = P(CW[i][0] + 1.4, 1, CW[i][1]), b = P(...SAFE(i).slice(0, 1), 1, SAFE(i)[1]); bolt(a[0], a[1], b[0], b[1], f * 5 + i, BOLT_COLS[i], 5); } });
        if (f >= 985) { const p = P(runaway.position.x, 0.5, runaway.position.z + 2); smoke(p[0], p[1], f, 6, 0.8); } if (f >= 985 && f < 990) { hero.visible = false; } } };
  } },
  { f0: 1000, f1: 1079, run(f) { // nobody understands what happened
    traffic(T(870) + 20, [0, 1]); setRain(5, -58, T(f), false); placeCar(runaway, { x: 0.3, z: -42.4, ry: 0.4, amt: 0 });
    for (let i = 0; i < 3; i++) { const [sx, sz] = SAFE(i); placeK(peds[i], { x: sx, z: sz, ry: -Math.PI / 2 + Math.sin(T(f) * 1.6 + i) * 0.6, amt: 0, lean: 0 }); const u = peds[i].userData; u.head.rotation.y = Math.sin(T(f) * 2.2 + i * 2) * 0.7; setFace(peds[i], i === 1 ? 'worry' : 'shock', Math.sin(T(f) * 2.2 + i * 2)); u.arms[0].rotation.set(0, 0, -0.6); u.arms[1].rotation.set(0, 0, 0.6); }
    fill.position.set(5, 2.5, -55); fill.intensity = 2.5;
    return { cam: C([3.7, 1.55, -53.2 + prog(f, 1000, 1079) * 0.4], [7.0, 1.55, CROSS + 1.6], 4.6),
      fx: () => { for (let i = 0; i < 3; i++) { const [sx, sz] = SAFE(i); const h = PW(peds[i].userData.head, 0.9); bubble(h[0], h[1] - 30, ['?', '?!', 'QUÊ?'][i], pop(f, 1008 + i * 12), { fs: 64 }); }
        const r = rng(Math.floor(f / 2)); for (let i = 0; i < 3; i++) { const p = P(5 + r() * 1.5, 0.05, CROSS + 4 + r() * 2); bolt(p[0], p[1], p[0] + (r() - 0.5) * 120, p[1] - r() * 60, f + i, BOLT_COLS[i], 2.5 * (1 - prog(f, 1000, 1079)), false); } } };
  } },
  { f0: 1080, f1: 1174, run(f) { // the speed won't stop growing
    const fn = (g) => ({ x: 0, z: -240 + (g - 1080) * 1.5, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, f < 1118 ? 'happy' : 'worry'); traffic(T(303));
    const I = 1 + prog(f, 1080, 1174) * 1.4; heroLight.intensity = 6 + I * 3; heroLight.position.set(0, 1.3, s.z + 0.5);
    return { cam: C([0.6, 1.35, s.z + 4.4], [0, 1.25, s.z], 4.4), ap: 0.0015, shake: 0.2 + prog(f, 1080, 1174) * 1.2,
      fx: () => { trail(f, 14); aura(hero, I, f); heroBolts(hero, I, f); const b = heroBox(); if (b) speedLines(b.cx, b.cy, 0.5 + I * 0.25, f); tint('rgba(255,30,10,A)', prog(f, 1100, 1174) * 0.14); if ([1112, 1113, 1150, 1151].includes(f)) tint('rgba(255,230,200,A)', 0.4); } };
  } },
  { f0: 1175, f1: 1240, run(f) { // the bolts explode, the windows burst
    const fn = (g) => ({ x: 0.6, z: -150 + (g - 1175) * 2.4, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, 'worry'); traffic(T(303)); setShards(s.z);
    heroLight.intensity = 14; heroLight.position.set(0.6, 1.5, s.z);
    return { cam: C([-4.3, 1.05, -30], [0.2, 2.6, -66], 30), ap: 0.0008, shake: 1.6,
      fx: () => { trail(f, 16, 1.3); aura(hero, 2.2, f); heroBolts(hero, 2.2, f); const b = heroBox(); const r = rng(Math.floor(f / 2) * 9);
        if (b) for (let i = 0; i < 3; i++) { const sx = r() < 0.5 ? -1 : 1; const t = P(sx * 7.9, 3 + r() * 12, s.z - 2 + r() * 6); if (t[2] < 1) bolt(b.cx, b.cy, t[0], t[1], f * 13 + i, BOLT_COLS[i], 6); }
        if (f % 9 < 2) tint('rgba(255,220,180,A)', 0.25); } };
  } },
  { f0: 1241, f1: 1304, run(f) { // the asphalt cracks behind you
    const fn = (g) => ({ x: 0, z: -200 + (g - 1241) * 1.4, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, 'worry'); traffic(T(303), [0, 1, 2, 3]);
    cracks.forEach((c) => { const t = clamp((s.z - 1 - c.userData.z) / 3); c.visible = t > 0; c.material.opacity = t; c.scale.set(1, 0.3 + 0.7 * t, 1); });
    heroLight.intensity = 14; heroLight.position.set(0, 1.4, s.z);
    return { cam: C([0.6, 5.2, s.z - 9.5], [0, 0.9, s.z + 5], 10), ap: 0.001, shake: 1.2,
      fx: () => { trail(f, 14); aura(hero, 2.4, f); heroBolts(hero, 2.4, f); embers(f, 0.8, 3); const r = rng(Math.floor(f / 2) * 5); for (let i = 0; i < 2; i++) { const b = heroBox(); const t = P((r() - 0.5) * 9, 0, s.z - 3 - r() * 6); if (b && t[2] < 1) bolt(b.cx, b.cy + b.hp * 0.4, t[0], t[1], f * 7 + i, BOLT_COLS[i + 1], 5); } } };
  } },
  { f0: 1305, f1: 1379, run(f) { // a portal opens ahead
    const fn = (g) => ({ x: 0, z: -130 + (g - 1305) * 1.0, ry: 0, ph: g * 1.4, amt: 1, lean: 0.5 });
    const s = heroPath(fn, f, 4, 1.0); setFace(hero, 'shock'); traffic(T(303), [0, 1, 2, 3, 4, 5]);
    const g = ss(prog(f, 1318, 1352)); portal.visible = true; portal.position.set(0, 3.4, -32); portal.rotation.set(0, 0, 0); portal.scale.setScalar(Math.max(0.001, g * (1 + Math.sin(f * 0.3) * 0.03))); portalDisc.rotation.z = f * 0.09; portalRing2.rotation.z = -f * 0.05;
    portalLight.intensity = g * 12; portalLight.position.set(0, 3.4, -33);
    heroLight.intensity = 9; heroLight.position.set(0, 1.4, s.z);
    return { cam: C([0.9, 1.5, s.z - 4.6], [0, 2.3, s.z + 14], 20), ap: 0.0008, shake: 0.6,
      fx: () => { trail(f, 12); aura(hero, 1.8, f); heroBolts(hero, 1.8, f); if (g > 0) { const p = P(0, 3.4, -32); if (p[2] < 1) { O.save(); O.globalCompositeOperation = 'lighter'; const R = 500 * g; const gr = O.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); gr.addColorStop(0, 'rgba(150,220,255,.45)'); gr.addColorStop(1, 'rgba(120,60,255,0)'); O.fillStyle = gr; O.fillRect(p[0] - R, p[1] - R, R * 2, R * 2); O.restore(); for (let i = 0; i < 3; i++) { const a = f * 0.2 + i * 2.1; bolt(p[0], p[1], p[0] + Math.cos(a) * 260 * g, p[1] + Math.sin(a) * 260 * g, f * 3 + i, i % 2 ? '#9ff0ff' : '#ffd23f', 4); } } } } };
  } },
  { f0: 1380, f1: 1429, run(f) { // the realization on his face
    const fn = (g) => ({ x: 0, z: -55 + (g - 1380) * 0.35, ry: 0, ph: g * 0.6, amt: 1, lean: 0.45 });
    const s = heroPath(fn, f, 2, 2.0); setFace(hero, f < 1404 ? 'shock' : 'stern'); traffic(T(303), [0, 1, 2, 3, 4, 5]);
    portal.visible = true; portal.position.set(0, 3.4, -32); portal.scale.setScalar(1.05); portalDisc.rotation.z = f * 0.09;
    portalLight.intensity = 14; portalLight.position.set(0, 3.4, -33); heroLight.intensity = 5; heroLight.position.set(0, 1.4, s.z - 0.6);
    return { cam: C([-0.55, 1.62, s.z + 2.5 - prog(f, 1380, 1429) * 0.6], [0, 1.6, s.z], 2.2), ap: 0.004, shake: 0.35,
      fx: () => { aura(hero, 1.4, f); heroBolts(hero, 1.4, f); O.save(); O.globalCompositeOperation = 'lighter'; const gr = O.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(120,200,255,.25)'); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(255,190,60,.18)'); O.fillStyle = gr; O.fillRect(0, 0, W, H); O.restore(); } };
  } },
  { f0: 1430, f1: 1479, run(f) { // inside the time tunnel
    STREET.visible = false; TUNNEL.visible = true; tunnelTick(f);
    hero.visible = true; hero.position.set(0, 0, 0); hero.rotation.set(0, 0, 0); runPose(hero, f * 1.4, 1, 0.5); setFace(hero, 'shock', 0); for (let i = 0; i < 4; i++) { placeK(ghosts[i], { x: 0, z: -(i + 1) * 0.7, ry: 0, ph: (f - i - 1) * 1.4, amt: 1, lean: 0.5 }); ghosts[i].userData.gm.opacity = 0.3 * (1 - i / 4); }
    heroLight.intensity = 6; heroLight.position.set(0, 1.5, 0.6); hemi.intensity = 2;
    return { cam: C([-1.9, 1.35, -3.6], [0, 1.3, 3], 4.0), ap: 0.002, shake: 0.4, fx: () => { aura(hero, 1.5, f); heroBolts(hero, 1.5, f); speedLines(W / 2, H * 0.42, 1, f, '200,230,255'); if (f < 1438) tint('rgba(255,255,255,A)', 1 - prog(f, 1430, 1438)); } };
  } },
  { f0: 1480, f1: 1529, run(f) { // ...he's running back in time
    STREET.visible = false; TUNNEL.visible = true; tunnelTick(f);
    hero.visible = true; hero.position.set(0, 0, 0); hero.rotation.set(0, 0, 0); runPose(hero, f * 1.4, 1, 0.5); setFace(hero, 'stern');
    heroLight.intensity = 6; heroLight.position.set(0, 1.5, -0.8); hemi.intensity = 2;
    return { cam: C([0.35, 0.55, -3.0 - prog(f, 1480, 1529) * 0.8], [0, 3.2, 30], 30), ap: 0.0008, shake: 0.4,
      fx: () => { aura(hero, 1.6, f); heroBolts(hero, 1.6, f); speedLines(W / 2, H * 0.36, 1, f, '255,220,160'); if (f > 1518) tint('rgba(255,255,255,A)', prog(f, 1518, 1529)); } };
  } },
  { f0: 1530, f1: TOTAL - 1, run(f) { // epic finale: running at the camera wrapped in lightning
    const fn = (g) => ({ x: 0, z: -62 + (g - 1530) * 0.05, ry: 0, ph: g * 0.2, amt: 1, lean: 0.5 });
    const s = heroPath(fn, f, 3, 4); setFace(hero, f < 1600 ? 'stern' : 'smug'); traffic(T(303), [0, 1, 2, 3, 4, 5]); setRain(0, s.z + 2, T(303) + (f - 1530) * 0.004, false);
    portal.visible = true; portal.position.set(0, 3.6, -72); portal.scale.setScalar(1.3); portalDisc.rotation.z = f * 0.05; portalLight.intensity = 10; portalLight.position.set(0, 3.6, -71);
    heroLight.intensity = 9; heroLight.position.set(0, 1.4, s.z + 0.8);
    const k = prog(f, 1530, 1799);
    return { cam: C([Math.sin(T(f) * 0.6) * 0.35, 0.9 + k * 0.15, s.z + 4.4 - k * 0.8], [0, 2.15, s.z], 4.4 - k * 0.8), ap: 0.0025, shake: 0.35,
      fx: () => { trail(f, 10, 0.7); aura(hero, 1.4, f); heroBolts(hero, 1.6, f); embers(f, 0.9, 7); if (f < 1536) tint('rgba(255,255,255,A)', 1 - prog(f, 1530, 1536));
        const r = rng(Math.floor(f / 3) * 11); const b = heroBox(); if (b) for (let i = 0; i < 2; i++) bolt(b.cx, b.cy, r() < 0.5 ? -40 : W + 40, r() * H * 0.8, f * 9 + i, BOLT_COLS[i], 5);
        O.save(); O.fillStyle = 'rgba(10,0,20,.35)'; O.fillRect(0, 0, W, 760 * Math.min(1, pop(f, 1538))); O.restore();
        titleLine('VOCÊ AGUENTARIA', 250, pop(f, 1540), 104, '#ffffff'); titleLine('TER ESSE PODER', 400, pop(f, 1575), 104, '#ffffff'); titleLine('POR 24 HORAS?', 580, pop(f, 1600, 1610) * (1 + Math.sin(f * 0.2) * 0.02), 128, '#ffc21a'); } };
  } },
];

function placeCar(c, s) { c.visible = true; c.position.set(s.x, 0, s.z); c.rotation.set(0, s.ry || 0, 0); }
function rainLocal(cx, cy, cz) { rain.visible = true; const r = rng(4); for (let i = 0; i < RAIN_N; i++) { DUMMY.position.set(cx + (r() - 0.5) * 3.5, cy - 1.2 + r() * 2.6, cz + (r() - 0.5) * 3.5); if (Math.hypot(DUMMY.position.x - cx, DUMMY.position.z - cz) < 0.45) DUMMY.position.y += 3; DUMMY.rotation.set(0, 0, 0); DUMMY.scale.set(1.3, 0.35, 1.3); DUMMY.updateMatrix(); rain.setMatrixAt(i, DUMMY.matrix); } rain.instanceMatrix.needsUpdate = true; }
function tunnelTick(f) {
  TUN_TEX.offset.y = f * 0.035; scene.fog.near = 20; scene.fog.far = 140; scene.fog.color.set('#1a0850');
  clocks.forEach((c) => { const [x, y, z] = c.userData.base; let zz = z - f * 0.9; zz = ((zz + 130) % 160 + 160) % 160 - 130; c.position.set(x, y, zz); c.lookAt(0, 3, zz - 6); c.rotateY(Math.PI); c.userData.hh.rotation.z = f * 0.25; c.userData.mh.rotation.z = f * 1.2; });
  bigClock.userData.hh.rotation.z = f * 0.12; bigClock.userData.mh.rotation.z = f * 0.6 * (1 + prog(f, 1480, 1529) * 2);
}

function renderFrame(f) {
  reset();
  const sh = SHOTS.find((s) => f >= s.f0 && f <= s.f1) || SHOTS[SHOTS.length - 1];
  const R = sh.run(f);
  let [px, py, pz] = R.cam.p; const sk = (R.shake || 0) * 0.03; const r = rng(f * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  key.position.set(px + 6, 14, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); key.target.updateMatrixWorld();
  if (fill.intensity === 2.0) fill.position.set(px + 0.8, py + 1.5, pz + 0.5);
  bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1;
  O.drawImage(renderer.domElement, 0, 0);
  if (R.freeze) desat(R.freeze);
  if (R.heroTop && hero.visible) heroOnTop();
  R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.42, W / 2, H / 2, H * 0.72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,25,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
