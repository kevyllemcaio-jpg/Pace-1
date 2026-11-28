import sys; sys.path.insert(0, '/root/b3d')
import bpy, math
from lib import *
from chars import *
clear(); S = bpy.context.scene
# ---- corredor
floor_m = img_mat('floor', '/root/b3d/tiles.png', 0.22, alpha=False, repeat=6)
plane('floor', (8, 40), (0, 10, 0), floor_m)
wall = mat('wall', '#EDE3CF', 0.8); plane('ceil', (8, 40), (0, 10, 4.2), mat('ceil', '#F3F0EA', 0.9), rot=(math.pi, 0, 0))
cube('wallL', (0.2, 40, 4.4), (-3.2, 10, 2.2), wall, 0); cube('wallR', (0.2, 40, 4.4), (3.2, 10, 2.2), wall, 0)
cols = ['#E63946', '#F77F00', '#FCBF49', '#2A9D8F', '#3A86FF', '#8338EC']
for side in (-1, 1):
    for i in range(18):
        y = -2 + i * 1.05; c = cols[(i + (side > 0) * 3) % 6]; m = mat('lk' + c, c, 0.35)
        cube(f'lk{side}_{i}', (0.5, 1.0, 2.8), (side * 2.85, y, 1.4), m, 0.03)
        for k in range(4): cube(f'v{side}{i}{k}', (0.02, 0.6, 0.05), (side * 2.59, y, 2.4 - k * 0.12), mat('vent', '#1c1c22', 0.6), 0)
        cube(f'h{side}{i}', (0.04, 0.08, 0.3), (side * 2.58, y + 0.32, 1.4), mat('handle', '#cfd3da', 0.2, 0.9), 0.01)
for i in range(7):
    cube(f'lamp{i}', (1.6, 0.5, 0.06), (0, -1 + i * 5, 4.15), mat('lampm', '#ffffff', 0.5, emit='#fff6e8', es=14), 0.01)
    bpy.ops.object.light_add(type='AREA', location=(0, -1 + i * 5, 4.0)); L = bpy.context.object; L.data.energy = 260; L.data.size = 1.6; L.data.color = (1, 0.96, 0.9)
cube('window', (4.8, 0.1, 2.6), (0, 29, 2.2), mat('win', '#cfeaff', 0.1, emit='#dff3ff', es=6), 0)
# ---- personagens
b, JB = avatar('boy', BOY, (-0.7, 2.2, 0), rotz=math.radians(-12))
g, JG = avatar('girl', GIRL, (0.75, 2.6, 0), rotz=math.radians(14))
JB['armL'].rotation_euler = (math.radians(-35), 0, math.radians(-8)); JG['armR'].rotation_euler = (math.radians(-150), 0, math.radians(10))
JG['head'].rotation_euler = (0, 0, math.radians(-10))
# ---- câmera + mundo
bpy.ops.object.camera_add(location=(0.1, -2.2, 1.75), rotation=(math.radians(88), 0, 0)); cam = bpy.context.object; S.camera = cam; cam.data.lens = 28
cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 4.6; cam.data.dof.aperture_fstop = 2.8
w = bpy.data.worlds.new('w'); S.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.8, 0.85, 0.9, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
ENG = sys.argv[-3]
if ENG == 'cycles': S.render.engine = 'CYCLES'; S.cycles.device = 'CPU'; S.cycles.samples = int(sys.argv[-2]); S.cycles.use_denoising = True; S.cycles.max_bounces = 4
else: S.render.engine = 'BLENDER_EEVEE'; S.eevee.taa_render_samples = int(sys.argv[-2])
S.view_settings.view_transform = 'Standard'; S.view_settings.look = 'None'; S.view_settings.exposure = -0.2
S.render.resolution_x = 720; S.render.resolution_y = 1280; S.render.resolution_percentage = int(sys.argv[-1])
S.render.filepath = '/root/b3d/teste.png'; bpy.ops.render.render(write_still=True)
