import sys, os, math, time; sys.path.insert(0, '/root/b3d/perd'); sys.path.insert(0, '/root/b3d')
import bpy
from lib import clear, empty, mat
clear()
from mundo import *; from cenarios import *
R = math.radians; FPS = 24
B30 = [0, 84, 250, 358, 424, 528, 660, 732, 954, 1105, 1229, 1404, 1560, 1636, 1697, 1916]; B = [b / 30 for b in B30]; TOTAL = B[-1]
OUT = os.environ.get('OUT', '/root/b3d/perd/fr'); os.makedirs(OUT, exist_ok=True)
S = bpy.context.scene
debaixo_cama(0); tambor = lavanderia(100); gav = quarto(200); gaveta_dentro(300)
FI = Meia('fiapo', '#ff4d5a', '#ffffff', '#2a6fdb'); FA = Meia('fiapa', '#ff7eb8', '#ffffff', '#7b3fbf'); CZ = Meia('cinza', '#8d99ae', '#c9ced6', '#3a3a48')
CT = Controle(); TP = Tampa(); BR = Brinco(); MO = Moeda()
ACT = [FI, FA, CZ, CT, TP, BR, MO]
w = bpy.data.worlds.new('w'); S.world = w; w.use_nodes = True; BG = w.node_tree.nodes['Background']
def area(n, loc, rot, e, col, size=3):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); L = bpy.context.object; L.name = n; L.data.energy = e; L.data.color = col; L.data.size = size; return L
LUZ = {
 'debaixo': [area('k0', (5, -4, 5), (R(55), 0, R(45)), 1100, (1, 0.88, 0.7), 4), area('r0', (-3, 9, 4), (R(-65), 0, R(200)), 900, (1.0, 0.55, 0.8), 3), area('f0', (-6, -6, 3), (R(70), 0, R(-45)), 150, (0.7, 0.6, 1.0), 6)],
 'lav': [area('k1', (106, -4, 9), (R(50), 0, R(35)), 2600, (1, 0.93, 0.8), 6), area('r1', (96, 8, 6), (R(-60), 0, R(190)), 900, (0.6, 0.85, 1.0), 4), area('f1', (94, -6, 4), (R(70), 0, R(-50)), 500, (1, 0.9, 1.0), 8)],
 'quarto': [area('k2', (192, -6, 14), (R(45), 0, R(-20)), 2600, (0.55, 0.65, 1.0), 8), area('r2', (212, 2, 12), (R(-30), 0, R(120)), 1500, (1, 0.7, 0.45), 4), area('f2', (200, -10, 4), (R(80), 0, 0), 300, (0.8, 0.7, 1.0), 10)],
 'gaveta': [area('k3', (304, -3, 9), (R(35), 0, R(30)), 900, (0.6, 0.7, 1.0), 6), area('r3', (296, 9, 6), (R(-60), 0, R(200)), 500, (1, 0.6, 0.8), 3)],
}
WC = {'debaixo': (0.12, 0.08, 0.22), 'lav': (0.75, 0.85, 1.0), 'quarto': (0.08, 0.1, 0.25), 'gaveta': (0.1, 0.1, 0.22)}
def luz(k):
    for kk, Ls in LUZ.items():
        for L in Ls: L.hide_render = kk != k
    BG.inputs['Color'].default_value = WC[k] + (1,); BG.inputs['Strength'].default_value = 1.0
bpy.ops.object.camera_add(); cam = bpy.context.object; S.camera = cam; tg = empty('tg'); c = cam.constraints.new('TRACK_TO'); c.target = tg
cam.data.dof.use_dof = True; cam.data.dof.focus_object = tg; cam.data.dof.aperture_fstop = 2.8
S.render.engine = 'CYCLES'; S.cycles.device = 'CPU'; S.cycles.samples = int(os.environ.get('SAMPLES', 4)); S.cycles.use_denoising = True; S.cycles.max_bounces = 2
S.render.resolution_x = 540; S.render.resolution_y = 960; S.render.resolution_percentage = int(os.environ.get('RES', 85)); S.render.use_persistent_data = True
S.view_settings.view_transform = 'AgX'; S.view_settings.look = 'AgX - Punchy'
def cl(x, a=0, b=1): return max(a, min(b, x))
def ez(x): x = cl(x); return x * x * (3 - 2 * x)
def lp(a, b, t): return tuple(x + (y - x) * t for x, y in zip(a, b)) if isinstance(a, tuple) else a + (b - a) * t
def camv(t, T, p0, l0, p1=None, l1=None, lens=40, fst=2.8):
    k = ez(t / T); p = lp(p0, p1 or p0, k); l = lp(l0, l1 or l0, k)
    hx = 0.02 * math.sin(t * 1.1); hz = 0.015 * math.sin(t * 1.5 + 1)
    cam.location = (p[0] + hx, p[1], p[2] + hz); tg.location = l; cam.data.lens = lens; cam.data.dof.aperture_fstop = fst
def blink(t, seed): ph = (t + seed * 0.7) % 3.4; return 1.0 if ph < 0.06 else (0.5 if ph < 0.12 else 0.0)
def hopc(t, f=1.6, h=0.35): p = (t * f) % 1; return h * 4 * p * (1 - p), (0.18 if p < 0.08 or p > 0.92 else -0.06)
def hide_all():
    for a in ACT: a.root.location = (0, -500, -50); [setattr(o, 'hide_render', True) for o in [a.root] + list(a.root.children_recursive)]
def s0(t, T):
    luz('debaixo'); CT.pose(-2.5, 6, 0, 15, expr='serio', blink=blink(t, 1)); TP.pose(1.5, 7, 0, -10, hop=hopc(t, 1.2, 0.15)[0], expr='feliz', blink=blink(t, 2)); BR.pose(4.5, 7.5, 0.1, -20, expr='feliz', blink=blink(t, 3)); MO.pose(-0.5, 8, 0, 0, spin=20 * math.sin(t), expr='feliz')
    camv(t, T, (0, -9, 5.5), (0, 6, 2), (0, -5, 2.2), (0, 6, 2.3), 30, 4)
def s1(t, T):
    luz('lav'); h1, q1 = hopc(t, 1.4, 0.3); h2, q2 = hopc(t + 0.3, 1.4, 0.3)
    FI.pose(97.5, 2.5, 0, -15, hop=h1, sq=q1, expr='feliz', blink=blink(t, 1), look=(0.6, 0)); FA.pose(100.4, 2.6, 0, -15, flip=True, hop=h2, sq=q2, expr='feliz', blink=blink(t, 2), look=(-0.6, 0))
    camv(t, T, (99.0, -5.0, 1.7), (99.0, 2.5, 1.4), (99.0, -4.0, 1.5), (99.0, 2.5, 1.4), 36)
def s2(t, T):
    luz('lav'); tambor.rotation_euler = (0, R(t * 60), 0); camv(t, T, (100, -6, 3.2), (100, 4.4, 2.9), (100, -4.8, 3.0), (100, 4.4, 2.8), 35, 5)
def s3(t, T):
    luz('lav'); tambor.rotation_euler = (0, R(t * 60 + t * t * 220), 0); sh = 0.03 * t * math.sin(t * 50)
    FI.pose(100 + 0.8 * math.cos(t * 6), 5.0, 2.8 + 0.8 * math.sin(t * 6) - 0.9, 0, rot=(0, t * 400, 0), expr='grito')
    camv(t, T, (100 + sh, -1.6, 2.8 + sh), (100, 4.4, 2.8), (100 + sh, -0.9, 2.8), (100, 4.4, 2.8), 40, 4)
def s4(t, T):
    luz('lav'); look = (math.sin(t * 2.2), 0.1); FA.pose(100.5, 2.4, 0, -10 + 25 * math.sin(t * 1.5), expr='medo' if t > 0.8 else 'feliz', blink=blink(t, 2), look=look, hop=hopc(t, 1.2, 0.25)[0] if t < 0.8 else 0)
    camv(t, T, (100.5, -3.0, 1.4), (100.5, 2.4, 1.5), (100.5, -2.6, 1.4), (100.5, 2.4, 1.5), 42)
def s5(t, T):
    luz('quarto'); k = ez(t / T); x = lp(214, 192, k)
    FI.pose(x, 1, 0.45, 0, rot=(0, -t * 540, 0), expr='grito')
    FI.root.location.z = 0.45 + 0.2 * abs(math.sin(t * 6))
    camv(t, T, (x + 1.5, -4, 0.9), (x, 1, 0.6), lens=28)
def s6(t, T):
    luz('debaixo'); k = ez(t / (T * 0.4)); FI.pose(6, 2.5, 0, -40, sq=0.15 * (1 - k), expr='surpreso', blink=blink(t, 1), look=(-0.8, 0.4))
    CT.pose(-2.5, 6, 0, 15, expr='serio'); TP.pose(1.5, 7, 0, -10, expr='feliz'); BR.pose(4.5, 7.5, 0.1, -20, expr='feliz')
    camv(t, T, (7.5, -1.5, 1.3), (6, 2.5, 1.5), (6, -4.5, 2.8), (3.5, 5, 1.9), 32, 3.5)
def s7(t, T):
    luz('debaixo'); p = lambda i: ez((t - i * T / 4) / 0.35)
    CT.pose(-3, 5, 0, 15, expr='serio', blink=blink(t, 1), hop=0.3 * (1 - p(0)) * 0); CT.root.scale = (p(0),) * 3
    TP.pose(-0.5, 5.5, 0, 0, expr='feliz', blink=blink(t, 2)); TP.root.scale = (max(0.01, p(1)),) * 3
    BR.pose(2.2, 5.5, 0.1, -10, expr='feliz', blink=blink(t, 3)); BR.root.scale = (max(0.01, p(2)),) * 3
    MO.pose(4.6, 5.2, 0, -15, expr='feliz', spin=15 * math.sin(t * 2)); MO.root.scale = (max(0.01, p(3)),) * 3
    x = lp(-3, 4.6, ez(t / T)); camv(t, T, (x, 0.6, 1.6), (x, 5.5, 1.4), lens=34)
def s8(t, T):
    luz('debaixo'); CT.pose(-1.2, 5, 0, 30, expr='serio', blink=blink(t, 1), look=(0.6, 0), lean=-3 + 2 * math.sin(t * 3)); FI.pose(1.3, 4.4, 0, -40, expr='medo', blink=blink(t, 2), look=(-0.7, 0.3))
    FI.body.rotation_euler = (R(-4), 0, R(3 * math.sin(t * 9)))
    camv(t, T, (0.3, -1.8, 2.0), (0.2, 4.7, 1.7), (0.3, -1.2, 2.0), (0.2, 4.7, 1.7), 32, 2.8)
def s9(t, T):
    luz('debaixo'); FI.pose(7, 3, 0, -60, expr='neutro', blink=blink(t, 1), look=(0.3, 1.0))
    camv(t, T, (5.5, -1.2, 0.9), (7, 3, 1.6), (5.6, -1.6, 0.7), (7.8, 3, 3.6), 28, 4)
def s10(t, T):
    luz('gaveta'); FA.pose(298.4, 0.8, 0.45, 0, rot=(-90, 0, 0), expr='triste', blink=blink(t, 2), look=(0.4, 0)); CZ.pose(301.6, 0.8, 0.45, 0, rot=(-90, 0, 0), flip=True, expr='neutro', blink=blink(t, 5), look=(-0.2, 0))
    camv(t, T, (300, -1.5, 7.5), (300, 2.2, 0.4), (300, -0.4, 6.0), (300, 2.2, 0.4), 32, 4)
def s11(t, T):
    luz('quarto'); gav.location.y = 9.2 - 1.2; camv(t, T, (204, -4, 3), (208, 9, 11), (205, -1, 6), (208, 8.5, 11.5), 32, 6)
def s12(t, T):
    luz('quarto'); FI.pose(203, 3, 0, -30, expr='medo', blink=blink(t, 1), look=(0.4, 1)); FI.root.scale = (0.6,) * 3
    camv(t, T, (199, -5, 0.5), (205, 6, 5.5), lens=22, fst=8)
def s13(t, T):
    luz('quarto'); FI.root.scale = (1, 1, 1); FI.pose(203, 3, 0, -20, expr='decidido', blink=blink(t, 3), look=(0.3, 0.9))
    camv(t, T, (203.6, 0.4, 0.4), (203, 3, 2.0), (203.3, 0.8, 0.35), (203, 3, 2.2), 30, 2.2)
def s14(t, T):
    luz('debaixo'); FI.pose(0.5, 3, 0, -10, expr='decidido', blink=blink(t, 1), look=(0, 0.3)); CT.pose(-3, 6.5, 0, 20, expr='feliz', blink=blink(t, 2)); TP.pose(3, 6.8, 0, -15, expr='feliz', blink=blink(t, 3)); BR.pose(5.2, 7.2, 0.1, -20, expr='feliz'); MO.pose(-5, 7, 0, 10, expr='feliz')
    camv(t, T, (0.5, -2.5, 1.4), (0.5, 3, 1.6), (0.5, -6.5, 3.0), (0.5, 4, 2.0), 34, 3)
SH = [globals()[f's{i}'] for i in range(15)]
def frame(fi):
    t = fi / FPS; i = max(k for k in range(15) if B[k] <= t) if t < TOTAL else 14
    hide_all()
    for a in ACT:
        a.root.scale = (1, 1, 1)
        if hasattr(a, 'body'): a.body.rotation_euler = (0, 0, 0)
    gav.location.y = 9.2; SH[i](t - B[i], B[i + 1] - B[i])
if __name__ == '__main__':
    import argparse; ap = argparse.ArgumentParser(); ap.add_argument('--part', default='0/1'); ap.add_argument('--mids', type=int, default=0); a = ap.parse_args()
    N = int(TOTAL * FPS) + 1; fr = list(range(N))
    if a.mids: fr = [int((B[k] + (B[k + 1] - B[k]) * 0.6) * FPS) for k in range(15)]
    pk, pn = map(int, a.part.split('/')); fr = fr[pk::pn]
    if pn > 1: S.render.threads_mode = 'FIXED'; S.render.threads = max(1, 4 // pn)
    for f in fr:
        fn = f'{OUT}/f_{f:05d}.png'
        if os.path.exists(fn): continue
        t0 = time.time(); frame(f); S.render.filepath = fn; bpy.ops.render.render(write_still=True); print('FR', f, round(time.time() - t0, 1), flush=True)
