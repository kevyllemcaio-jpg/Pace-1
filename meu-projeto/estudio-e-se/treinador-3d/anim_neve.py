import sys, os, math, time, json, random; sys.path.insert(0, '/root/b3d')
import bpy
from lib import *; from sets_neve import *; from chars2 import *; from monstro import Monstro
R = math.radians; FPS = int(os.environ.get('AFPS', 10))
OUT = os.environ.get('OUT', '/root/b3d/fr_neve'); os.makedirs(OUT, exist_ok=True)
ws = json.load(open('/root/shorts/treinador/work/words.json'))
ST = {}
for w in ws: ST.setdefault(w['seg'], w['inicio'])
NSEG = max(ST) + 1; TOTAL = ws[-1]['fim'] + 0.6
BOUND = [0.0] + [ST[i] - 0.06 for i in range(1, NSEG)] + [TOTAL]
clear(); S = bpy.context.scene; build_neve()
# ---------- elenco
Z = make('zeca', ZECA_T); B = make('bruno', BRUNO); L = make('lucas', LUCAS); M = make('mestre', MESTRE)
V = [make(f'vila{i}', o) for i, o in enumerate(VILA)]
VIT = make('vitima', dict(VILA[3], num=100, faces='f2/vm', scarf='#5A9BD5', beanie=None))
MON = Monstro()
CAST = [Z, B, L, M, VIT] + V
for a in CAST: a.base_num = a.o.get('num')
pedra = [sphere(f'pedra{i}', 0.42, (0, 0.66, 1.95), mat('pedraC', '#8A8A92', 0.8), a.root, scale=(1.1, 0.9, 1)) for i, a in enumerate((Z, B, L))]
gorroChao = cube('gorroChao', (0.7, 0.6, 0.3), (0, 0, 0.15), mat('gorroC', '#5A9BD5', 0.85), 0.12)
def tx_rachado():
    from PIL import Image, ImageDraw
    im = Image.new('RGBA', (512, 512), (0, 0, 0, 0)); d = ImageDraw.Draw(im); r = random.Random(5)
    for k in range(9):
        x, y, a = 256, 256, k * 40 + r.randint(-10, 10)
        for st in range(7):
            a += r.randint(-30, 30); nx, ny = x + math.cos(R(a)) * 34, y + math.sin(R(a)) * 34
            d.line((x, y, nx, ny), fill=(170, 240, 255, 255), width=max(2, 12 - st * 2)); x, y = nx, ny
    im.save('/root/b3d/tx_racha.png')
tx_rachado()
racha = plane('racha', (3.5, 3.5), (0, 0, 0.03), img_mat('racha', '/root/b3d/tx_racha.png', 0.2, emit=3))
# ---------- luz
sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); S.collection.objects.link(sun)
w = bpy.data.worlds.new('w'); S.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']
def pb(m): return m.node_tree.nodes['Principled BSDF']
def luz(kind):
    night = kind == 'noite'
    if kind == 'dia': sun.rotation_euler = (R(50), 0, R(-30)); sun.data.energy = 3.2; sun.data.color = (1, 0.97, 0.92); bg.inputs['Color'].default_value = (0.55, 0.72, 0.95, 1); bg.inputs['Strength'].default_value = 0.9
    if kind == 'aurora': sun.rotation_euler = (R(76), 0, R(-60)); sun.data.energy = 2.4; sun.data.color = (1, 0.72, 0.6); bg.inputs['Color'].default_value = (0.95, 0.66, 0.72, 1); bg.inputs['Strength'].default_value = 0.65
    if kind == 'tarde': sun.rotation_euler = (R(72), 0, R(40)); sun.data.energy = 2.2; sun.data.color = (1, 0.62, 0.4); bg.inputs['Color'].default_value = (0.7, 0.55, 0.75, 1); bg.inputs['Strength'].default_value = 0.5
    if night: sun.rotation_euler = (R(60), 0, R(20)); sun.data.energy = 0.45; sun.data.color = (0.55, 0.65, 1); bg.inputs['Color'].default_value = (0.05, 0.08, 0.2, 1); bg.inputs['Strength'].default_value = 0.6
    for o in bpy.data.objects:
        if o.type == 'LIGHT' and (o.name.startswith('luzposte') or o.name == 'luzarco'): o.data.energy = (90 if o.name != 'luzarco' else 160) if night else 0
    for nm, es in (('janela', 5 if night else 0), ('lampN', 8 if night else 0), ('lanterna', 6 if night else 0.5)): pb(bpy.data.materials[nm]).inputs['Emission Strength'].default_value = es
bpy.ops.object.camera_add(); cam = bpy.context.object; S.camera = cam; tgt = empty('tgt'); c = cam.constraints.new('TRACK_TO'); c.target = tgt
S.view_settings.view_transform = 'Standard'; S.render.resolution_x = 540; S.render.resolution_y = 960
S.render.engine = 'CYCLES'; S.cycles.device = 'CPU'; S.cycles.samples = int(os.environ.get('SAMPLES', 3)); S.cycles.use_denoising = True; S.cycles.max_bounces = 2
S.render.use_persistent_data = True; S.render.resolution_percentage = int(os.environ.get('RES', 100)); S.cycles.use_adaptive_sampling = False
# ---------- utilidades
def cl(x, a=0, b=1): return max(a, min(b, x))
def ez(x): x = cl(x); return x * x * (3 - 2 * x)
def lp(a, b, t):
    if isinstance(a, (tuple, list)): return tuple(lp(x, y, t) for x, y in zip(a, b))
    return a + (b - a) * t
def camv(t, T, p0, l0, p1=None, l1=None, lens=32, shake=0):
    k = ez(t / T); p1 = p1 or p0; l1 = l1 or l0; p = lp(p0, p1, k); l = lp(l0, l1, k)
    if shake: p = (p[0] + shake * math.sin(t * 53), p[1], p[2] + shake * math.cos(t * 47))
    hx = 0.025 * math.sin(t * 1.3) + 0.012 * math.sin(t * 3.1); hz = 0.02 * math.sin(t * 1.7 + 1) + 0.01 * math.sin(t * 2.9)
    cam.location = (p[0] + hx, p[1], p[2] + hz); tgt.location = (l[0] + hx * 0.5, l[1], l[2] + hz * 0.5); cam.data.lens = lens
OPEN = {'feliz', 'sorriso', 'neutro', 'serio', 'medo', 'surpreso', 'triste', 'determinado'}
def face(a, e, t, seed=0):
    ph = (t + seed * 0.77) % 3.3
    a.face('piscando' if (e in OPEN and ph < 0.13) else e)
def arms(a, fL, sL, fR, sR):
    a.J['armL'].rotation_euler = (R(-fL), R(sL), 0); a.J['armR'].rotation_euler = (R(-fR), R(-sR), 0)
def legs(a, l, r): a.J['legL'].rotation_euler = (R(l), 0, 0); a.J['legR'].rotation_euler = (R(r), 0, 0)
def head(a, x=0, y=0, z=0): a.J['head'].rotation_euler = (R(x), R(y), R(z))
def put(a, x, y, z=0, rz=0, lean=0, roll=0, e='neutro', t=0, num=None):
    a.root.location = (x, y, z); a.root.rotation_euler = (R(lean), R(roll), R(rz)); a.shown = True
    face(a, e, t, hash(a.name) % 7)
    if num is not None and hasattr(a, 'setnum'): a.setnum(num, (235, 60, 60) if a is Z else ((255, 200, 60) if a is M else (70, 190, 255)))
def idle(a, t, k=1.0):
    h = hash(a.name) % 7; s = math.sin(t * 2.4 + h); w = math.sin(t * 0.7 + h)
    arms(a, 4 * s * k, 6 + 3 * s, -4 * s * k, 6 + 3 * s); head(a, 3 * s, 4 * w * k, 9 * math.sin(t * 0.55 + h) * k); legs(a, 0, 0)
    a.root.location.z += 0.02 * (1 + s); a.root.rotation_euler.y += R(2.5 * w * k); a.root.location.x += 0.05 * w * k
def walk(a, t, f=1.7, amp=30, armamp=None):
    p = t * f * 2 * math.pi; s = math.sin(p); armamp = amp if armamp is None else armamp
    legs(a, amp * s, -amp * s); arms(a, -armamp * s, 6 + 3 * abs(s), armamp * s, 6 + 3 * abs(s)); head(a, -3 * abs(math.cos(p)), 0, 4 * s)
    a.root.location.z += 0.09 * abs(math.cos(p)); a.root.rotation_euler.y += R(3.5 * s); a.root.rotation_euler.z += R(4 * s)
def run(a, t): walk(a, t, 3.0, 55, 65); a.root.rotation_euler.x = R(12)
def shiver(a, t, k=1):
    a.root.location.x += 0.03 * k * math.sin(t * 70); a.root.rotation_euler.y += R(1.5 * k * math.sin(t * 53)); arms(a, 60 + 4 * math.sin(t * 61), -25, 60 + 4 * math.cos(t * 57), -25); head(a, 10 + 3 * math.sin(t * 40) * k, 0, 0)
def lie(a, x, y, rz=0, e='dor', t=0, num=None): put(a, x, y, 0.27, rz, -88, 0, e, t, num); arms(a, 0, 20, 0, 20); legs(a, 0, 0)
def sitg(a, x, y, rz=0, e='neutro', t=0, num=None): put(a, x, y, -0.92, rz, 0, 0, e, t, num); legs(a, -90, -90)
def kneel(a, x, y, rz=0, e='neutro', t=0, num=None): put(a, x, y, -0.9, rz, 0, 0, e, t, num); legs(a, 90, 90)
MT = [0.0]
def mon(x, y, rz=0, sc=1.25, **pz):
    t = MT[0]; pz.setdefault('chest', 25 + 3 * math.sin(t * 2.2)); pz.setdefault('head', (4 * math.sin(t * 1.7), 0, 10 * math.sin(t * 0.9)))
    pz.setdefault('ombroL', (20 + 8 * math.sin(t * 1.5), 0, -15)); pz.setdefault('ombroR', (20 + 8 * math.sin(t * 1.5 + 1), 0, 15))
    MON.place(x, y, 0.05 * math.sin(t * 2.2), rz, True, sc); MON.pose(**pz); MON.shown = True
    pb(bpy.data.materials['mon_olho']).inputs['Emission Strength'].default_value = 10 + 5 * math.sin(t * 6)
def monwalk(t, f=1.1):
    s = math.sin(t * f * 2 * math.pi); return dict(legs=(28 * s, -28 * s), ombroL=(20 - 20 * s, 0, -15), ombroR=(20 + 20 * s, 0, 15), chest=25 + 4 * s)
def climb(a, u, x, t, e='determinado', ox=300, num=None, f=1.6):
    u = cl(u, 0, 33.4); y = 4 + u * 0.85; z = 0.42 * (int(u) + 1) + 0.2 * math.sin((u % 1) * math.pi)
    put(a, ox + x, y, z, 180, 8, 0, e, t, num); walk(a, t, f, 35)
def reset():
    for a in CAST: a.shown = False; a.root.location = (0, -200, -60); a.root.rotation_euler = (0, 0, 0); arms(a, 0, 4, 0, 4); legs(a, 0, 0); head(a)
    for a in CAST:
        if hasattr(a, 'setnum') and a.base_num is not None: a.setnum(a.base_num, (235, 60, 60) if a is Z else ((255, 200, 60) if a is M else (70, 190, 255)))
    MON.shown = False; MON.root.location = (0, -300, -60)
    for p in pedra: p.hide_render = True
    gorroChao.location = (0, -300, -50); racha.location = (0, -300, -50)
    pb(bpy.data.materials['fendaM']).inputs['Emission Strength'].default_value = 3
def apply_vis():
    for a in CAST + [MON]:
        hid = not a.shown
        if getattr(a, '_hid', None) != hid:
            a.root.hide_render = hid
            for c in a.root.children_recursive:
                if c.name.startswith('pedra'): continue
                c.hide_render = hid
            a._hid = hid
# ---------- cenas (uma por fala) — f(t, T)
Y0 = 0
def town_walkers(t, n=6, night=False):
    for i, a in enumerate(V[:n]):
        d = 1 if i % 2 else -1; x = (-2.4 if d > 0 else 2.4) + (i % 3) * 0.4 * d; y = (i * 9 + t * 1.4 * d) % 44 - 6
        put(a, x, y, 0, 180 if d > 0 else 0, 0, 0, 'sorriso', t); walk(a, t + i, 1.6, 26)
def s0(t, T):
    luz('dia'); town_walkers(t); camv(t, T, (0, -14, 6), (0, 20, 3), (0, -9, 3.2), (0, 20, 3.2), 26)
def s1(t, T):
    luz('dia'); put(V[3], -1.0, 4, 0, 10, e='determinado', t=t, num=1); arms(V[3], 0, 160, 0, 160); V[3].J['armL'].rotation_euler.x = R(-40 * abs(math.sin(t * 3)))
    put(VIT, 1.2, 4, 0, -10, e='triste', t=t, num=100); idle(VIT, t); head(VIT, 15)
    k = ez(t / T); camv(t, T, (-1.0, -0.2, 2.6), (-1.0, 4, 2.2), (1.2, -0.2, 2.6), (1.2, 4, 2.2), 32)
def s2(t, T):
    luz('dia'); pb(bpy.data.materials['fendaM']).inputs['Emission Strength'].default_value = 4 + 6 * abs(math.sin(t * 4))
    camv(t, T, (0, 30, 6), (0, 129, 30), (0, 50, 10), (0, 129, 36), 40, shake=0.06 * ez(t / T))
def s3(t, T):
    luz('noite'); y = 30 - t * 5.5; put(VIT, 0.3, y, 0, 0, e='medo', t=t, num=100); run(VIT, t)
    mon(0.2, y + 7 - t * 0.4, 0, **monwalk(t, 1.5)); camv(t, T, (2.5, y - 7, 2.2), (0.3, y + 3, 2.4), lens=26)
def s4(t, T):
    luz('noite'); k = ez(t / T); x = lp(-4, 4, k); mon(x - 2.2, 14, 90, ombroR=(-70, 0, 0), cotR=(0, 0, 0), **{k_: v for k_, v in monwalk(t).items() if k_ != 'ombroR'})
    put(VIT, x + 0.6, 14, 0.27, 90, -80, 0, 'dor', t, 100); arms(VIT, 170, 0, 0, 30)
    camv(t, T, (0, 3, 2.5), (x, 14, 1.5), lens=30)
def s5(t, T):
    luz('noite'); gorroChao.location = (0.5, 14, 0.15); gorroChao.rotation_euler = (0, 0, R(30))
    camv(t, T, (2, 6, 1.6), (0.5, 14, 0.4), (1.2, 9, 1.2), (0.5, 14, 0.3), 35)
def s6(t, T):
    luz('dia')
    for i, a in enumerate(V):
        x = -3 + (i % 4) * 2; y = 11 + (i // 4) * 2.4; ph = t * 3 + i * 0.3; up = abs(math.sin(ph))
        put(a, x, y, 0.4 * up, 0, e='determinado', t=t); arms(a, 0, 20 + 150 * up, 0, 20 + 150 * up); legs(a, 0, 0)
        a.J['legL'].rotation_euler.y = R(-12 * up); a.J['legR'].rotation_euler.y = R(12 * up)
    camv(t, T, (6, 2, 4), (0, 12, 1.5), (-5, 3, 3.6), (0, 12, 1.5), 28)
def s7(t, T):
    luz('dia'); sitg(Z, 2.2, 15.2, 0, 'triste', t, 100); Z.root.location.z = -0.1; arms(Z, 30, 5, 30, 5); head(Z, 12)
    for i, a in enumerate(V[:4]): x = -3 + (i % 2) * 2; put(a, x, 11 + i * 0.6, 0.35 * abs(math.sin(t * 3 + i)), 0, e='determinado', t=t); arms(a, 0, 20 + 150 * abs(math.sin(t * 3 + i)), 0, 20 + 150 * abs(math.sin(t * 3 + i)))
    camv(t, T, (0.6, 11.4, 2.0), (2.2, 15.2, 1.4), (1.0, 12.0, 2.0), (2.2, 15.2, 1.6), 32)
def s8(t, T):
    luz('tarde'); pb(bpy.data.materials['fendaM']).inputs['Emission Strength'].default_value = 5 + 5 * abs(math.sin(t * 3))
    put(Z, 0, 20, 0, 180, e='serio', t=t, num=100); idle(Z, t); camv(t, T, (1.2, 15.5, 2.3), (0, 129, 30), (0.6, 16.5, 2.3), (0, 129, 34), 30)
def s9(t, T):
    luz('dia'); k = ez(t / T)
    for a, x in ((B, -1.2), (L, 1.2)): put(a, x, lp(10, 4.5, k), 0, 0, e='sorriso', t=t); walk(a, t, 1.6, 30 * (1 - k ** 4)) if k < 0.98 else idle(a, t)
    camv(t, T, (0, -3, 2.6), (0, 6, 2.0), (0, -1.2, 2.6), (0, 5, 2.1), 30)
def s10(t, T):
    luz('dia'); put(B, -1.2, 4.5, 0, 10, e='sorriso', t=t); idle(B, t); put(L, 1.2, 4.5, 0, -10, e='risada' if t > T * 0.55 else 'feliz', t=t); idle(L, t)
    if t > T * 0.5: arms(L, 0, 4, 10, 150 + 20 * math.sin(t * 9))
    else: arms(B, 0, 4, 85, 10)
    camv(t, T, (-1.2, 1.2, 2.7), (-1.2, 4.5, 2.5), (1.2, 1.2, 2.7), (1.2, 4.5, 2.5), 34) if t > T * 0.45 else camv(t, T, (-1.2, 1.2, 2.7), (-1.2, 4.5, 2.5), lens=34)
def s11(t, T):
    luz('dia'); put(Z, 0, 4, 0, 0, e='triste' if t < T * 0.5 else 'sorriso', t=t, num=100); idle(Z, t)
    put(B, -1.5, 4.6, 0, 30, e='determinado', t=t); idle(B, t); arms(B, 0, 4, 60 + 20 * math.sin(t * 4), 20)
    put(L, 1.5, 4.6, 0, -30, e='sorriso', t=t); idle(L, t); 
    if t > T * 0.6: arms(L, 0, 4, 75, -15); arms(Z, 0, 4, 0, 155) if t > T * 0.8 else None
    camv(t, T, (0, -2.5, 2.4), (0, 4.4, 2.0), (0, -0.6, 2.5), (0, 4.4, 2.2), 30)
def s12(t, T):
    luz('dia'); k = ez(t / T * 1.3)
    for a, dx in ((Z, 0), (B, -1.0), (L, 1.0)): put(a, -2.4 + dx * 0.8, lp(-2, 2.4, k), 0, 140 if k > 0.95 else 180, e='surpreso' if k > 0.9 else 'neutro', t=t); walk(a, t, 1.6, 28) if k < 0.95 else idle(a, t)
    camv(t, T, (0.5, -5, 2.6), (-3, 3, 2.0), (1.0, -3.2, 2.8), (-4.0, 4, 2.3), 30)
def s13(t, T):
    luz('dia'); camv(t, T, (-4.4, 1.4, 2.3), (-4.4, 3.86, 2.3), (-4.4, 2.3, 2.3), (-4.4, 3.86, 2.3), 34)
def s14(t, T):
    luz('aurora'); camv(t, T, (0, -3, 6), (0, 10, 2), (0, -1, 3), (0, 10, 2.5), 26)
def s15(t, T):
    luz('aurora'); put(M, 0, 10, 0, 0, e='serio', t=t); idle(M, t, 0.3); arms(M, 0, 4, 20, 8)
    camv(t, T, (0, 1, 2.0), (0, 10, 2.4), (0, 5.5, 2.4), (0, 10, 2.6), 32)
def s16(t, T):
    luz('aurora'); put(M, 0, 10, 0, 0, e='risada' if t > 0.6 else 'surpreso', t=t); arms(M, 40, 10, 20, 8); M.root.location.z += 0.04 * abs(math.sin(t * 14)) if t > 0.6 else 0
    put(Z, 0, 6.5, 0, 180, e='triste', t=t, num=100); idle(Z, t)
    camv(t, T, (1.8, 4.2, 2.5), (0, 10, 2.6), lens=32)
def s17(t, T):
    luz('aurora'); k = ez(t / (T * 0.5)); put(M, 0, 10, 0, 0, e='serio' if k > 0.5 else 'risada', t=t); idle(M, t, 0.3)
    put(Z, 0, 6.5, 0, 180, e='determinado', t=t, num=100); idle(Z, t)
    for a, s in ((B, -1), (L, 1)): put(a, s * lp(4, 1.4, k), lp(3, 6.5, k), 0, 180, e='determinado', t=t); walk(a, t, 1.6, 30) if k < 1 else idle(a, t)
    camv(t, T, (4.0, 11.5, 2.6), (0, 8.0, 2.0), (3.6, 12.0, 2.6), (0, 8.0, 2.2), 28)
def s18(t, T):
    luz('aurora'); ox = 300
    put(M, ox, 2 + t * 1.3, 0, 180, e='serio', t=t); walk(M, t, 1.2, 18)
    for i, a in enumerate((Z, B, L)): put(a, ox + (i - 1) * 1.3, -2.5 + t * 1.4 - (i % 2) * 0.6, 0, 180, e='determinado', t=t); walk(a, t + i * 0.2, 1.7, 28)
    camv(t, T, (ox + 3, -7, 2.5), (ox, 3, 2.5), (ox + 1.5, -5, 3), (ox, 6, 4), 28)
def s19(t, T):
    luz('aurora'); u = 6 + t * 3.5
    climb(M, u + 3, -0.6, t, 'serio', f=1.2)
    for i, a in enumerate((Z, B, L)): climb(a, u - 1.5 * i, (i - 1) * 1.0, t + i * 0.3)
    y = 4 + u * 0.85; camv(t, T, (300 + 4, y - 9, 0.42 * u + 2.5), (300, y + 3, 0.42 * u + 2.5), lens=28)
def ag(t): pb(SN['agua']).inputs['Emission Strength'].default_value = 0.6
def s20(t, T):
    luz('dia'); ox = 360
    for i, a in enumerate((Z, B, L)): put(a, ox + (i - 1) * 1.3, 5.6, 0, 0, e='serio', t=t, num=(100, 44, 44)[i]); shiver(a, t, 0.5)
    put(M, ox + 4.5, 2.5, 0, -40, e='serio', t=t); idle(M, t, 0.3)
    camv(t, T, (ox, -1.5, 3.5), (ox, 6, 3.5), (ox, 0.5, 2.6), (ox, 6, 2.6), 26)
def s21(t, T):
    luz('dia'); ox = 360
    for i, a in enumerate((Z, B, L)): put(a, ox + (i - 1) * 1.3, 5.6, 0, 0, e='dor' if i == 0 else 'serio', t=t, num=(100, 44, 44)[i]); shiver(a, t, 1.4)
    camv(t, T, (ox + 1.4, 1.2, 2.6), (ox - 0.3, 5.6, 2.4), (ox - 1.0, 1.4, 2.6), (ox + 0.3, 5.6, 2.4), 30)
def s22(t, T):
    luz('dia'); ox = 360; k = ez(t / (T * 0.7))
    put(Z, ox, 5.6, 0.27 * k, 0, -80 * k, 0, 'dor', t, 100); arms(Z, 0, 40 * k, 0, 40 * k)
    for i, a in ((1, B), (2, L)): put(a, ox + (i - 1) * 1.3 - (0.2 if i == 1 else -0.2) * 0, 5.6, 0, 0, e='surpreso', t=t); shiver(a, t)
    B.root.location.x = ox - 1.3; L.root.location.x = ox + 1.3
    camv(t, T, (ox + 1.5, 1.5, 3.2), (ox, 5.9, 0.6), lens=30)
def s23(t, T):
    luz('dia'); ox = 360; k = ez((t - T * 0.45) / (T * 0.45))
    put(M, ox + 2.2, 3.2, 0, 40, e='serio', t=t); arms(M, 0, 4, 70, 30)
    if M.cane: M.J['armR'].rotation_euler = (R(-70), R(-30), 0)
    put(Z, ox, 5.6, 0.27 * (1 - k), 0, -80 * (1 - k), 0, 'dor' if k < 0.5 else 'determinado', t, 100); arms(Z, 30 * k, 30, 30 * k, 30)
    camv(t, T, (ox + 4.5, 0.5, 2.6), (ox + 1, 4.8, 1.6), (ox + 4.0, 1.0, 2.4), (ox + 1, 4.8, 1.8), 30)
def numshot(n0, n1, setname):
    def f(t, T):
        luz('dia' if setname != 'noite' else 'noite'); put(Z, 600, 0, 0, 0, e='determinado', t=t, num=n0 if t < T * 0.35 else n1); idle(Z, t, 0.3)
        Z.root.rotation_euler.z = R(10 * math.sin(t * 2))
        camv(t, T, (600, -1.6, 1.4), (600, 0, 1.3), (600, -1.1, 1.35), (600, 0, 1.3), 34)
    return f
def s25(t, T):
    luz('dia'); u = 2 + t * 1.6
    for i, a in enumerate((Z, B, L)): climb(a, u - 1.2 * i, (i - 1) * 1.0, t + i * 0.3, 'dor' if i == 0 else 'determinado', num=(93, 44, 44)[i], f=1.0)
    for p in pedra: p.hide_render = False
    y = 4 + u * 0.85; camv(t, T, (300 + 2.5, y - 6, 0.42 * u + 3.5), (300, y + 1, 0.42 * u + 1.5), lens=28)
def s26(t, T):
    luz('dia'); u = 6; k = ez((t - 0.5) / 0.6)
    y = 4 + u * 0.85; z = 0.42 * (u + 1)
    put(Z, 300, y, z + 0.27 * k, 180, 80 * k, 0, 'dor', t, 93); arms(Z, 0, 20, 0, 20)
    for i, a in ((1, B), (2, L)):
        kk = ez((t - 1.2) / 1.4); uu = lp(u + 3, u + 0.6, kk); put(a, 300 + (i - 1.5) * 1.6, 4 + uu * 0.85, 0.42 * (int(uu) + 1), 0, 0, 0, 'surpreso' if kk < 1 else 'determinado', t, 44)
        walk(a, t, 1.8, 30) if 0 < kk < 1 else arms(a, 70, 10, 70, 10)
    for p in pedra: p.hide_render = False
    camv(t, T, (300 + 5, y - 3, z + 3), (300, y + 1, z + 0.8), lens=28)
def s28(t, T):
    luz('dia'); ox = 420
    for i, a in enumerate((Z, L, B)):
        yy = 2.5 + t * 1.2 - i * 1.3; ii = (yy - 3) / 0.75; zz = -0.05 - 0.6 * math.sin(math.pi * cl(ii, 0, 15) / 15)
        put(a, ox, yy, zz + 0.05, 180, e='medo' if i == 0 else 'determinado', t=t, num=(84, 44, 44)[i]); walk(a, t + i * 0.3, 1.2, 20); arms(a, 0, 50, 0, 50)
    camv(t, T, (ox + 5, -2, 3), (ox, 5, 0), (ox + 4, 0, 2.5), (ox, 7, 0), 26)
def s29(t, T):
    luz('dia'); ox = 420; k = ez((t - 0.3) / 0.5); yy = 7.5
    put(Z, ox + 0.9 * k, yy, -0.55 - 1.0 * k, 180, 0, R(0) + 25 * k, 'medo', t, 84); arms(Z, 0, 4, 0, 150 * k); legs(Z, 20 * k, -20 * k)
    put(L, ox, yy - 1.5, -0.5, 180, e='surpreso', t=t, num=44); arms(L, 60 * k, 10, 60 * k, 10)
    camv(t, T, (ox - 3.5, yy - 1, 1.2), (ox + 0.5, yy, -0.8), lens=28, shake=0.05 * k)
def s30(t, T):
    luz('dia'); ox = 420; yy = 7.5; k = ez((t - 1.2) / 1.5)
    put(Z, ox + 0.9 * (1 - k), yy, -1.55 + 1.0 * k, 180, 0, 25 * (1 - k), 'medo' if k < 0.8 else 'feliz', t, 84); arms(Z, 0, 4, 0, 150 * (1 - k * 0.5))
    put(L, ox + 0.3, yy - 1.0, -0.5, 230, 20, 0, 'determinado', t, 44); arms(L, 0, 4, 80, 60)
    put(B, ox - 0.4, yy - 2.2, -0.45, 200, 18, 0, 'raiva', t, 44); arms(B, 80, -10, 80, -10); B.root.location.y -= 0.3 * k
    camv(t, T, (ox + 4, yy + 2, 1.8), (ox, yy - 1, -0.3), (ox + 4.4, yy + 1, 1.6), (ox, yy - 1, -0.2), 28)
def s32(t, T):
    luz('dia'); ox = 480
    for i, a in enumerate((Z, B, L)): kneel(a, ox + (i - 1) * 1.6, 8, 0, 'dor' if i == 0 else 'serio', t, (73, 44, 44)[i]); arms(a, 40, 4, 40, 4); shiver(a, t, 0.4); arms(a, 40, 4, 40, 4)
    put(M, ox + 3.5, 10, 0, 30, e='serio', t=t); idle(M, t, 0.3)
    camv(t, T, (ox, 1, 2.5), (ox, 8, 0.8), (ox + 1, 2.8, 2.0), (ox, 8, 0.6), 28)
def s33(t, T):
    luz('dia'); ox = 480; up = cl(math.sin(cl(t / T) * math.pi) * 1.3)
    kneel(Z, ox, 8, 0, 'dor' if up > 0.3 else 'serio', t, 73); arms(Z, 40 - 30 * up, 4, 40 - 30 * up, 4)
    put(M, ox + 1.3, 9.2, 0, 50, e='serio', t=t); arms(M, 0, 4, 40 + 30 * up, 30)
    camv(t, T, (ox - 2.4, 4.5, 1.8), (ox + 0.4, 8.4, 0.8), lens=30)
def s35(t, T):
    luz('dia'); ox = 480
    for i, (a, x) in enumerate(((B, -1.4), (L, 1.4))): put(a, ox + x, 8, 0.6 * abs(math.sin(t * 5 + i)), 0, e='risada', t=t, num=29); arms(a, 0, 160, 0, 160)
    camv(t, T, (ox, 2, 2.4), (ox, 8, 2.2), (ox, 3.5, 2.4), (ox, 8, 2.3), 30)
def s36(t, T):
    luz('tarde'); ox = 480; put(Z, ox, 8, 0, 0, e='triste', t=t, num=62); idle(Z, t); head(Z, 14)
    put(B, ox - 1.6, 8.6, 0, 50, e='triste', t=t, num=29); idle(B, t); put(L, ox + 1.6, 8.6, 0, -50, e='triste', t=t, num=29); idle(L, t)
    camv(t, T, (ox, 3, 2.3), (ox, 8, 2.1), (ox, 4.6, 2.3), (ox, 8, 2.3), 30)
def s37(t, T):
    luz('tarde'); put(Z, 0, 6, 0, 0, e='sorriso', t=t, num=62); idle(Z, t); arms(Z, 0, 4, 75, -15)
    put(B, -1.5, 6.5, 0, 40, e='triste', t=t, num=29); idle(B, t); put(L, 1.5, 6.5, 0, -40, e='triste', t=t, num=29); idle(L, t)
    camv(t, T, (0, 1.5, 2.5), (0, 6, 2.2), (0, 2.6, 2.5), (0, 6, 2.4), 30)
def s38(t, T):
    luz('noite'); put(Z, 0, 10.4, 0, 0, e='serio', t=t, num=62); idle(Z, t); arms(Z, 15, 4, 15, 4)
    camv(t, T, (0, -6, 5), (0, 10, 2.5), (0, -3, 3), (0, 10, 2), 30)
def s39(t, T):
    luz('noite'); ox = 540
    for k, (a, n) in enumerate(((V[4], 41), (V[5], 36), (V[7], 53))): put(a, ox - 4.2 + k * 4.2, 4.3, 0.1, 0, e='medo', t=t + k, num=n); idle(a, t)
    camv(t, T, (ox - 4.2, -3.4, 2.5), (ox - 4.2, 3, 2.3), (ox + 4.2, -3.4, 2.5), (ox + 4.2, 3, 2.3), 30)
def s40(t, T):
    luz('noite'); y = 22 - t * 1.6; mon(0, y, 0, ombroL=(-5, 0, -8), cotL=(-20, 0, 0), ombroR=(-5, 0, 8), cotR=(-20, 0, 0), legs=monwalk(t)['legs'], chest=30)
    pb(bpy.data.materials['mon_gelo']).inputs['Emission Strength'].default_value = 3
    camv(t, T, (1.5, y - 5.5, 0.4), (0.5, y, 0.4), lens=24)
def s41(t, T):
    luz('noite'); k = ez(t / (T * 0.7)); y = lp(22, 13.6, k)
    pz = monwalk(t) if k < 1 else {}; pz.update(ombroR=(-80 * cl((t - T * 0.7) / 0.6), 0, 10), cotR=(0, 0, 0))
    mon(0, y, 0, **pz); put(Z, 0, 10.4, 0, 180, e='medo', t=t, num=62); idle(Z, t)
    camv(t, T, (2.6, 6.6, 2.3), (0, 12, 3.2), (2.0, 7.4, 2.0), (0, 11.5, 2.4), 26)
def s42(t, T):
    luz('noite'); mon(0, 13.6, 0, ombroR=(-80, 0, 10), cotR=(0, 0, 0)); put(Z, 0, 10.4, 0, 180, e='medo', t=t, num=62); idle(Z, t)
    k = ez(t / (T * 0.4))
    for a, s in ((B, -1), (L, 1)): put(a, s * 1.4, lp(3, 9.0, k), 0, 180, e='serio', t=t, num=62 if t > T * 0.45 else 29); walk(a, t, 2.2, 35) if k < 1 else shiver(a, t, 0.6)
    camv(t, T, (0.3, 4.5, 2.4), (0, 10, 2.0), (0.3, 5.8, 2.3), (0, 10, 2.2), 28)
def s43(t, T):
    luz('noite')
    for a, s in ((B, -1), (L, 1)): put(a, s * 1.4, 9.0, 0, 180 + s * 15, e='dor', t=t, num=62); shiver(a, t, 1.2)
    camv(t, T, (-2.0, 6.0, 2.6), (-1.4, 9, 2.4), (2.0, 6.0, 2.6), (1.4, 9, 2.4), 30)
def s44(t, T):
    luz('noite'); mon(0, 13.6, 0, ombroR=(-70, 0, 10), cotR=(0, 0, 0), head=(-10, 0, 0))
    put(B, -1.4, 9.4, 0, 180, e='raiva', t=t, num=62); arms(B, 0, 4, 95, 0); put(L, 1.4, 9.4, 0, 180, e='raiva', t=t, num=62); idle(L, t)
    put(Z, 0, 10.4, 0, 180, e='determinado', t=t, num=62); idle(Z, t)
    camv(t, T, (-2.6, 12.0, 2.5), (-1.2, 9.4, 2.4), (-2.9, 11.8, 2.6), (-1.2, 9.4, 2.4), 28)
def s45(t, T):
    luz('noite'); sw = math.sin(t / T * math.pi * 2)
    mon(0, 13.6, 0, ombroR=(-75, 0, 10 + 20 * sw), cotR=(0, 0, 0), head=(0, 0, 10 * sw))
    put(Z, 0, 10.4, 0, 180, e='determinado', t=t, num=62); idle(Z, t)
    for a, s in ((B, -1), (L, 1)): put(a, s * 1.4, 9.6, 0, 180, e='determinado', t=t, num=62); idle(a, t)
    camv(t, T, (0, 6.2, 3.4), (0, 11.5, 2.6), (0, 5.4, 3.6), (0, 11.5, 2.6), 26)
def s46(t, T):
    luz('noite'); k = ez(t / 0.6); mon(0, 13.6, 0, ombroL=(-30 - 80 * k, 0, -50 * k), ombroR=(-30 - 80 * k, 0, 50 * k), cotL=(0, 0, 0), cotR=(0, 0, 0), chest=25 - 20 * k, head=(-30 * k, 0, 0))
    pb(bpy.data.materials['mon_gelo']).inputs['Emission Strength'].default_value = 3 + 5 * k
    camv(t, T, (0, 8.0, 1.6), (0, 13.6, 5.2), lens=26, shake=0.08 * k)
def s47(t, T):
    luz('noite'); k = ez((t - 0.8) / 0.35); mon(0, 13.6, 0, ombroR=(-60 - 50 * k, 0, 10), cotR=(-30 * k, 0, 0), chest=25 + 15 * k)
    d = ez((t - 0.9) / 0.4); put(Z, 1.8 * d, 10.4, 0, 180, 0, -15 * d * (1 - d) * 4, 'medo', t, 62); arms(Z, 0, 40 * d, 0, 40 * d)
    camv(t, T, (4, 7, 2), (0.6, 11.5, 1.6), lens=26)
def s48(t, T):
    luz('noite'); mon(0, 13.6, 0, ombroR=(-110, 0, 10), cotR=(-30, 0, 0), chest=40); racha.location = (0, 10.6, 0.03); racha.scale = (1 + ez(t / 0.5),) * 3
    put(Z, 1.8, 10.4, 0, 200, e='surpreso', t=t, num=62); idle(Z, t)
    camv(t, T, (1.5, 7.2, 1.4), (0, 10.6, 0.2), (1.8, 7.8, 1.6), (0, 10.6, 0.5), 28, shake=0.06 * (1 - ez(t / 0.6)))
def s49(t, T):
    luz('noite'); mon(0, 13.6, 0, ombroR=(-110, 0, 10), cotR=(-30, 0, 0), chest=40, head=(0, 0, 25 * math.sin(t * 6) * (t > 1.0)))
    racha.location = (0, 10.6, 0.03); racha.scale = (2, 2, 2)
    j = ez(t / 0.8); hz = 3.6 * math.sin(math.pi * cl(t / 0.8)) if t < 0.8 else 3.0 + 0.2 * math.sin(t * 9)
    put(B, lp(-1.4, -0.6, j), lp(9.4, 12.0, j), hz, 180, e='raiva', t=t, num=62); arms(B, 0, 4, 90 + 50 * abs(math.sin(t * 7.5)), 10); legs(B, -30, 20)
    camv(t, T, (-3.5, 5.5, 3.0), (0, 12.8, 4.0), lens=26)
def s50(t, T):
    luz('noite'); k = ez((t - 0.4) / 0.4); mon(0, 13.6, 0, ombroR=(-110, 0, 10), cotR=(-30, 0, 0), ombroL=(-40 - 50 * k, 0, -10), cotL=(-20, 0, 0), chest=35)
    racha.location = (0, 10.6, 0.03); racha.scale = (2, 2, 2)
    put(Z, 1.0, 10.4, 0, 190, e='raiva', t=t, num=62); arms(Z, 90 * k, -20, 90 * k, 20)
    camv(t, T, (3.5, 8.0, 2.2), (0.3, 11.5, 2.2), lens=28)
def s51(t, T):
    luz('noite'); k = ez(t / T); x = lp(4, -4, k); mon(x + 0.5, 15.2, 0, ombroL=(-80, 0, 0), cotL=(0, 0, 0), legs=monwalk(t)['legs'])
    put(Z, x, 11.8, 0.27, 270, -80, 0, 'dor', t, 62); arms(Z, 170, 0, 170, 0)
    camv(t, T, (0, 4.5, 2.6), (x, 12.5, 1), lens=28)
def s52(t, T):
    luz('noite'); k = ez((t - 0.3) / 0.3); f = ez((t - 0.55) / 0.5)
    mon(0, 13.8, 0, ombroL=(-30 - 50 * k, 0, 0), cotL=(0, 0, 0)); put(Z, -0.6, 10.6 - 2 * f, 0.27 * f, 180, 80 * f, 0, 'dor', t, 62); arms(Z, 30 * f, 30, 30 * f, 30)
    camv(t, T, (3, 7, 2), (-0.4, 10.5, 1.2), lens=28, shake=0.08 * k * (1 - f))
def s53(t, T):
    luz('noite')
    for a, x, rz in ((Z, -0.6, 180), (B, -2.2, 160), (L, 1.4, 200)): lie(a, x, 8.4 + (x == -2.2) * 0.6, rz, 'dor', t, 62)
    k = ez((t - T * 0.6) / (T * 0.4)); Z.root.rotation_euler.x = R(88 - 40 * k); Z.root.location.z = 0.27 + 0.2 * k; Z.face('determinado' if k > 0.3 else 'dor')
    camv(t, T, (-0.6, 4.0, 3.8), (-0.6, 9, 0.3), (-0.6, 5.0, 2.6), (-0.6, 9, 0.4), 28)
def s54(t, T):
    luz('noite')
    for i, (a, x) in enumerate(((Z, -0.6), (B, -2.2), (L, 1.4))):
        k = ez((t - i * 0.25) / 1.4); put(a, x, 8.6, 0.27 * (1 - k), 180, 80 * (1 - k), 0, 'raiva', t, 62); arms(a, 30 * (1 - k), 20, 30 * (1 - k), 20)
    camv(t, T, (0.4, 13.2, 2.6), (-0.4, 8.6, 1.4), (0.4, 12.6, 1.8), (-0.4, 8.6, 1.8), 24)
def s55(t, T):
    luz('noite'); mon(0, 13.4, 0, ombroL=(-70, 0, -10), ombroR=(-70, 0, 10), cotL=(0, 0, 0), cotR=(0, 0, 0))
    k = ez(t / 0.8); put(Z, -1.0, 10.4, 0, 180, e='raiva', t=t, num=62); arms(Z, 90 * k, -10, 90 * k, 10)
    k2 = ez((t - 1.5) / 0.8); put(L, 1.0, 10.4, 0, 180, e='raiva', t=t, num=62); arms(L, 90 * k2, -10, 90 * k2, 10)
    put(B, -0.2, 8.4, 0, 180, e='determinado', t=t, num=62); idle(B, t)
    camv(t, T, (-2.4, 5.6, 5.0), (0, 12, 2.6), (2.4, 5.6, 5.0), (0, 12, 2.6), 26)
def s56(t, T):
    luz('noite'); p = 0.25 * math.sin(t * 5); mon(0, 13.4 + p, 0, ombroL=(-70, 0, -10), ombroR=(-70, 0, 10), cotL=(0, 0, 0), cotR=(0, 0, 0), chest=25 - 8 * math.sin(t * 5))
    for a, x in ((Z, -1.0), (L, 1.0)): put(a, x, 10.4 + p * 0.6, 0, 180, -12, 0, 'dor', t, 62); arms(a, 95, -10, 95, 10); legs(a, -15, 25)
    camv(t, T, (4.5, 11.2, 1.8), (0, 11.8, 2.2), lens=24, shake=0.03)
def s57(t, T):
    luz('noite'); mon(0, 13.4, 0, ombroL=(-70, 0, -10), ombroR=(-70, 0, 10), cotL=(0, 0, 0), cotR=(0, 0, 0))
    for a, x in ((Z, -1.0), (L, 1.0)): put(a, x, 10.4, 0, 180, -12, 0, 'raiva', t, 62); arms(a, 95, -10, 95, 10)
    j = ez((t - 1.4) / 1.2); h = 4.6 * math.sin(math.pi * cl((t - 1.4) / 2.0))
    put(B, -0.2, lp(8.4, 11.6, j), h, 180 + 720 * ez((t - 1.8) / 1.4), e='raiva' if t > 1 else 'serio', t=t, num=62); legs(B, -20 * j, 20 * j); arms(B, 0, 60 * j, 0, 60 * j)
    camv(t, T, (-3.0, 4.2, 2.2), (0, 11, 2.5 + h * 0.6), lens=24)
def s58(t, T):
    luz('noite'); k = ez(t / 0.35); mon(0, 13.4, 0, head=(20 * k, 0, 40 * k), ombroL=(-40, 0, -30), ombroR=(-40, 0, 30))
    put(B, -0.6, 12.4, 4.4, 160, 0, 0, 'raiva', t, 62); legs(B, 0, -110 * k); arms(B, 0, 70, 0, 70)
    camv(t, T, (-4.4, 15.5, 4.6), (0, 13.0, 5.0), lens=24, shake=0.1 * k)
def s59(t, T):
    luz('noite'); k = ez(t / 1.6); y = lp(13.4, 34, k); z = 3.5 * math.sin(math.pi * cl(t / 1.6))
    MON.place(0, y, z, 0, True, 1.25); MON.pose(chest=lp(25, -60, k) if t < 1.6 else -80, head=(-40, 0, 0)); MON.shown = True
    if t > 1.6: MON.root.rotation_euler = (R(-80), 0, 0); MON.root.location.z = 1.0
    camv(t, T, (2, 6, 2.5), (0, y, 2), lens=26, shake=0.1 if 1.5 < t < 2.1 else 0)
def s60(t, T):
    luz('aurora')
    for a, x in ((B, -1.4), (Z, 0), (L, 1.4)): put(a, x, 9.6, 0, 0, e='feliz', t=t, num=62); idle(a, t)
    arms(Z, 0, 4, 0, 160); arms(B, 0, 160, 0, 4); arms(L, 0, 4, 0, 160)
    for i, a in enumerate(V[:6]): s = -1 if i % 2 else 1; put(a, s * (3 + i * 0.4), 6 + i * 1.5, 0, s * -50, e='surpreso', t=t); idle(a, t)
    camv(t, T, (0, 1, 2.4), (0, 9.6, 2.4), (0, 4.5, 2.0), (0, 9.6, 2.6), 28)
def s61(t, T):
    luz('dia')
    for i, a in enumerate(V): climb(a, 3 + t * 2.2 - i * 1.1, ((i % 3) - 1) * 1.1, t + i * 0.2, 'determinado')
    u = 3 + t * 2.2; y = 4 + u * 0.85; camv(t, T, (300 + 5, y - 10, 0.42 * u + 4), (300, y, 0.42 * u + 1), lens=26)
def s62(t, T):
    luz('aurora'); top = SN['escada']['top']; ty = SN['escada']['ty']
    put(M, 300, ty - 0.5, top, 0, e='sorriso' if t > 0.6 else 'serio', t=t); idle(M, t, 0.3)
    camv(t, T, (300 + 1, ty - 4.5, top + 2.4), (300, ty - 0.5, top + 2.4), (300 + 0.3, ty - 3.0, top + 2.5), (300, ty - 0.5, top + 2.6), 30)
def s24(t, T): numshot(100, 93, 'dia')(t, T)
def s27(t, T): numshot(93, 84, 'dia')(t, T)
def s31(t, T): numshot(84, 73, 'dia')(t, T)
def s34(t, T): numshot(73, 62, 'dia')(t, T)
SHOTS = {i: globals()[f's{i}'] for i in range(63)}
PREV = {}
def joints():
    for a in CAST:
        for k in ('armL', 'armR', 'head'): yield a.J[k]
    for o in MON.arms + [MON.head, MON.chest]: yield o
def frame(fi):
    t = fi / FPS
    i = max(k for k in range(NSEG) if BOUND[k] <= t) if t < TOTAL else NSEG - 1
    MT[0] = t; reset(); SHOTS[i](t - BOUND[i], BOUND[i + 1] - BOUND[i]); apply_vis()
    # pose suavizada: calcula a pose dos 2 quadros anteriores (mesma cena) e mistura
    if os.environ.get('SMOOTH', '1') == '1' and t - BOUND[i] > 0.2:
        cur = {o.name: tuple(o.rotation_euler) for o in joints()}
        acc = {k: [0.0, 0.0, 0.0] for k in cur}; wsum = 0
        for dt, wgt in ((0.0, 0.5), (1 / 24, 0.3), (2 / 24, 0.2)):
            if dt:
                reset(); SHOTS[i](t - dt - BOUND[i], BOUND[i + 1] - BOUND[i])
            for o in joints():
                e = tuple(o.rotation_euler) if dt else cur[o.name]
                for j in range(3): acc[o.name][j] += e[j] * wgt
            wsum += wgt
        MT[0] = t; reset(); SHOTS[i](t - BOUND[i], BOUND[i + 1] - BOUND[i]); apply_vis()
        for o in joints(): o.rotation_euler = tuple(v / wsum for v in acc[o.name])
if __name__ == '__main__':
    import argparse; ap = argparse.ArgumentParser(); ap.add_argument('--shots', default=''); ap.add_argument('--every', type=int, default=1); ap.add_argument('--mids', type=int, default=0); ap.add_argument('--part', default='0/1'); a = ap.parse_args()
    N = int(TOTAL * FPS) + 1; fr = range(N)
    if a.shots:
        ids = [int(x) for x in a.shots.split(',')]; fr = [f for f in fr if any(BOUND[k] <= f / FPS < BOUND[k + 1] for k in ids)]
    fr = list(fr)[::a.every]
    pk, pn = map(int, a.part.split('/')); fr = fr[pk::pn]
    if pn > 1: S.render.threads_mode = 'FIXED'; S.render.threads = max(1, 4 // pn)
    if a.mids: fr = [int((BOUND[k] + (BOUND[k + 1] - BOUND[k]) * 0.6) * FPS) for k in range(NSEG)]
    for f in fr:
        fn = f'{OUT}/f_{f:05d}.png'
        if os.path.exists(fn): continue
        t0 = time.time(); frame(f); S.render.filepath = fn; bpy.ops.render.render(write_still=True); print('FR', f, round(time.time() - t0, 1), flush=True)
