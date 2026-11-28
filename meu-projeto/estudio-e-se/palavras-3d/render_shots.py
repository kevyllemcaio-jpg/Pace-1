import sys, os, math; sys.path.insert(0, '/root/b3d')
import bpy
from lib import *; from chars import img_mat; from chars2 import *; from sets import *; from shots import SH
R = math.radians
only = [int(x) for x in sys.argv[-1].split(',')] if sys.argv[-1] != 'all' else list(range(len(SH)))
SAMPLES = int(os.environ.get('SAMPLES', 12)); RES = int(os.environ.get('RES', 100)); OUT = os.environ.get('OUT', '/root/b3d/out')
os.makedirs(OUT, exist_ok=True)
clear(); S = bpy.context.scene; build_all()
ACT = {'zeca': Avatar('zeca', ZECA), 'mari': Avatar('mari', MARI), 'prof': Avatar('prof', PROF), 'mae': Avatar('mae', MAE), 'avo': Avatar('avo', AVO), 'barista': Avatar('barista', BARISTA), 'diretor': Avatar('diretor', DIRETOR)}
for i, k in enumerate(KIDS): ACT[f'k{i}'] = Avatar(f'k{i}', k)
papel = plane('papel', (0.62, 1.5), (0, 0, 0), img_mat('papelm', TX('discurso'), 0.7, alpha=False))
bpy.ops.object.light_add(type='SUN'); sun = bpy.context.object
w = bpy.data.worlds.new('w'); S.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']
bpy.ops.object.camera_add(); cam = bpy.context.object; S.camera = cam; tgt = empty('tgt'); cc = cam.constraints.new('TRACK_TO'); cc.target = tgt
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 3.2
janm = bpy.data.materials['janI'].node_tree.nodes['Principled BSDF']
S.render.engine = 'CYCLES'; S.cycles.device = 'CPU'; S.cycles.samples = SAMPLES; S.cycles.use_denoising = True; S.cycles.max_bounces = 4; S.render.use_persistent_data = True
S.view_settings.view_transform = 'Standard'; S.view_settings.look = 'None'
S.render.resolution_x = 720; S.render.resolution_y = 1280; S.render.resolution_percentage = RES
def apply_actor(a, d, ox):
    a.place(ox + d['x'], d['y'], d['z'], d['rz']); a.root.scale = (d['sc'],) * 3
    a.pose(d['pose'], d['head']); a.face(d['face'])
    a.counter(d['cnt'] or str(17 + (sum(map(ord, a.name)) * 7) % 80))
    if d['sit'] is not None:
        a.root.location.z = d['sit'] + 0.24 - 1.0 * d['sc']; a.sit()
    if d['walk'] is not None: a.walk(d['walk'])
for i in only:
    sh = SH[i]; info = SETS[sh['set']]; ox = info['ox']
    for a in ACT.values(): a.place(0, -100, -50, 0, show=False)
    keys = sh.get('keys', [{}])
    # luz/céu
    night, sunset = sh.get('night'), sh.get('sunset')
    sun.hide_render = bool(not info.get('sun') or night)
    sun.rotation_euler = (R(55), 0, R(25)) if not sunset else (R(80), 0, R(-60)); sun.data.energy = 3.0 if not sunset else 2.2; sun.data.color = (1, 0.97, 0.92) if not sunset else (1, 0.6, 0.35)
    if info.get('sun'): bg.inputs['Color'].default_value = (0.42, 0.62, 0.95, 1) if not (night or sunset) else ((0.02, 0.03, 0.1, 1) if night else (0.95, 0.5, 0.35, 1)); bg.inputs['Strength'].default_value = 0.9 if not night else 0.4
    else: bg.inputs['Color'].default_value = (0.8, 0.8, 0.85, 1); bg.inputs['Strength'].default_value = 0.25
    SETS['lampI'].data.energy = 300 if night else 0; SETS['janIlight'].data.energy = 220 if night else 0
    janm.inputs['Emission Strength'].default_value = 2.5 if night else 0.0
    papel.hide_render = 'prop' not in sh
    for k, key in enumerate(keys):
        fn = f'{OUT}/s{i:02d}_{k}.png'
        if os.path.exists(fn): continue
        for n, d in sh['act'].items():
            d2 = dict(d); d2.update(key.get(n, {})); apply_actor(ACT[n], d2, ox)
        if 'prop' in sh:
            _, px, py, pz, var = sh['prop']
            if var == 'mesa': papel.location = (ox + px, py, 1.18); papel.rotation_euler = (0, 0, R(10)); papel.scale = (0.9, 0.7, 1)
            else: papel.location = (ox + px, py - 0.4, 1.0); papel.rotation_euler = (R(90), 0, 0); papel.scale = (1, 1, 1)
        (cx, cy, cz), (tx, ty, tz), lens = sh['cam']
        cam.location = (ox + cx, cy, cz); tgt.location = (ox + tx, ty, tz); cam.data.lens = lens
        cam.data.dof.focus_distance = math.dist((cx, cy, cz), (tx, ty, tz))
        S.render.filepath = fn; bpy.ops.render.render(write_still=True); print('OK', fn, flush=True)
