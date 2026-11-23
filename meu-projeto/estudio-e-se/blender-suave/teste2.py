import bpy, sys, math, time, random
sys.path.insert(0, '/root/shorts/blend')
from lib3d import *
from mathutils import Vector
OUT = sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True); S = bpy.context.scene; C = S.collection
STONE = mat('stone', hexc('#6f6a78'), 0.85, noise=0.45); FLOOR = mat('floor', hexc('#58535f'), 0.8, noise=0.5)
FIRE = mat('fire', hexc('#ff8a2a'), 0.5, emit=hexc('#ffb347'), ei=30); WOOD = mat('wood', hexc('#5a3a22'), 0.8)
# corredor da masmorra: blocos de pedra
rnd = random.Random(2)
for y in range(-2, 14):
    for z in range(0, 5):
        for sx in (-1, 1):
            cube((sx * (2.2 + rnd.uniform(0, 0.08)), y * 1.0 + (z % 2) * 0.5, z * 0.62 + 0.31), (0.25, 0.48, 0.29), STONE, C, bevel=0.06)
for y in range(-2, 14):
    for x in range(-2, 3): cube((x * 0.9 + (y % 2) * 0.45, y * 0.9, -0.05), (0.43, 0.43, 0.06), FLOOR, C, bevel=0.04)
cube((0, 6, 3.3), (2.5, 9, 0.1), STONE, C)
for (x, y) in ((-1.95, 1.5), (1.95, 4.5), (-1.95, 8.0)):
    cube((x, y, 1.8), (0.05, 0.05, 0.22), WOOD, C, bevel=0.01)
    f = sphere((x * 0.97, y, 2.1), (0.07, 0.07, 0.13), FIRE, C, sub=1)
    bpy.ops.object.light_add(type='POINT', location=(x * 0.85, y, 2.15)); L = bpy.context.object; L.data.energy = 140; L.data.color = (1.0, 0.6, 0.28); L.data.shadow_soft_size = 0.25
# personagem
A = Char('Ass', skin='#e9b994', cloth='#24222c', pants='#1b1a22', boots='#14131a', hair='#1c1a24', hood='#2a2733', eye='#d63a3a', scale=1.0, coll=C)
d1 = A.add_prop(dagger(C, 'dL'), 'handL'); d2 = A.add_prop(dagger(C, 'dR'), 'handR')
A.place(0, 1.0, 0, rot=math.radians(-15))
A.pose({'armL': (0.9, 0.35), 'elbowL': 0.6, 'armR': (1.2, 0.25), 'elbowR': 0.9, 'legL': 0.25, 'kneeL': 0.5, 'legR': -0.2, 'kneeR': 0.3, 'crouch': 0.08, 'lean': 0.12}, face='cool')
# luz geral e câmera
W = bpy.data.worlds.new('w'); S.world = W; W.use_nodes = True; W.node_tree.nodes['Background'].inputs['Color'].default_value = (0.02, 0.025, 0.05, 1); W.node_tree.nodes['Background'].inputs['Strength'].default_value = 1
bpy.ops.object.light_add(type='AREA', location=(-0.8, -1.4, 2.0)); k = bpy.context.object; k.data.energy = 40; k.data.size = 1.5; k.data.color = (0.6, 0.75, 1.0); k.rotation_euler = (math.radians(65), 0, math.radians(-30))
bpy.ops.object.camera_add(location=(0.35, -1.6, 1.55)); cam = bpy.context.object; S.camera = cam
tg = Vector((0, 1.0, 1.35)); d = tg - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = 35
cam.data.dof.use_dof = True; cam.data.dof.focus_distance = d.length; cam.data.dof.aperture_fstop = 2.0
S.render.engine = 'CYCLES'; S.cycles.device = 'CPU'; S.cycles.samples = 12; S.cycles.use_denoising = True; S.cycles.max_bounces = 4
S.render.resolution_x, S.render.resolution_y, S.render.resolution_percentage = 540, 960, 100
S.view_settings.view_transform = 'AgX'; S.view_settings.look = 'AgX - Medium High Contrast'; S.render.filepath = OUT
t0 = time.time(); bpy.ops.render.render(write_still=True); print('render', round(time.time() - t0, 1), 's')
