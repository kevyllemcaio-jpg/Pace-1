import bpy, math, random, sys, os
sys.path.insert(0, '/root/b3d'); sys.path.insert(0, '/root/b3d/perd')
from lib import mat, cube, cyl, sphere, empty
from chars import img_mat
from mundo import smooth, emis
R = math.radians
def capsula(nm, r, h, m, parent, loc=(0, 0, 0)):
    o = cyl(nm, r, h, (loc[0], loc[1], loc[2] - h / 2), m, parent, verts=24, bevel=0)
    sphere(nm + 'a', r, (loc[0], loc[1], loc[2]), m, parent); sphere(nm + 'b', r, (loc[0], loc[1], loc[2] - h), m, parent); return o
class Lutador:
    def __init__(self, nm, o):
        self.nm = nm; self.root = empty(nm); self.o = o
        pele = mat(nm + '_pele', o.get('pele', '#f2c6a0'), 0.5); roupa = mat(nm + '_roupa', o['roupa'], 0.6); roupa2 = mat(nm + '_roupa2', o.get('roupa2', o['roupa']), 0.6); calca = mat(nm + '_calca', o['calca'], 0.7); bota = mat(nm + '_bota', o.get('bota', '#22222a'), 0.5)
        self.hip = empty(nm + '_hip', (0, 0, 1.15), self.root)
        cube(nm + '_pelvis', (0.62, 0.34, 0.32), (0, 0, 0), calca, 0.12, self.hip)
        self.tor = empty(nm + '_tor', (0, 0, 0.12), self.hip)
        t = cube(nm + '_torso', (0.72, 0.4, 0.7), (0, 0, 0.42), roupa, 0.16, self.tor); smooth(t, 1)
        cube(nm + '_peito', (0.8, 0.42, 0.24), (0, 0, 0.7), roupa, 0.12, self.tor)
        cube(nm + '_faixa', (0.74, 0.44, 0.1), (0, 0, 0.08), roupa2, 0.04, self.tor)
        self.J = {}
        for s, k in ((-1, 'L'), (1, 'R')):
            sh = empty(f'{nm}_om{k}', (s * 0.48, 0, 0.72), self.tor); capsula(f'{nm}_ba{k}', 0.12, 0.32, roupa, sh)
            el = empty(f'{nm}_co{k}', (0, 0, -0.36), sh); capsula(f'{nm}_ab{k}', 0.105, 0.3, pele if o.get('braco_nu') else roupa, el)
            sphere(f'{nm}_pu{k}', 0.13, (0, 0, -0.38), pele, el, scale=(1, 1.1, 1))
            hp = empty(f'{nm}_qd{k}', (s * 0.18, 0, -0.05), self.hip); capsula(f'{nm}_cx{k}', 0.15, 0.45, calca, hp)
            kn = empty(f'{nm}_jo{k}', (0, 0, -0.5), hp); capsula(f'{nm}_ca{k}', 0.13, 0.42, calca, kn)
            cube(f'{nm}_bt{k}', (0.24, 0.36, 0.18), (0, -0.06, -0.5), bota, 0.07, kn)
            self.J['om' + k], self.J['co' + k], self.J['qd' + k], self.J['jo' + k] = sh, el, hp, kn
        self.neck = empty(nm + '_neck', (0, 0, 0.86), self.tor)
        cyl(nm + '_pesc', 0.1, 0.16, (0, 0, 0.06), pele, self.neck, bevel=0)
        hd = sphere(nm + '_cab', 0.3, (0, 0, 0.36), pele, self.neck, scale=(0.92, 0.95, 1.08))
        sphere(nm + '_queixo', 0.19, (0, -0.06, 0.2), pele, self.neck, scale=(0.9, 0.85, 1.0))
        self.fm = img_mat(nm + '_face', f'/root/b3d/anime/f_{nm}_serio.png', 0.5); self.fn = [n for n in self.fm.node_tree.nodes if n.type == 'TEX_IMAGE'][0]
        from lib import plane
        plane(nm + '_rosto', (0.5, 0.5), (0, -0.305, 0.34), self.fm, rot=(R(90), 0, 0), parent=self.neck)
        cab = mat(nm + '_cabelo', o['cabelo'], 0.45)
        sphere(nm + '_cabBase', 0.31, (0, 0.1, 0.48), cab, self.neck, scale=(0.95, 0.9, 0.85))
        rnd = random.Random(hash(nm) % 1000)
        for i in range(o.get('spikes', 14)):
            a = rnd.uniform(-2.6, 2.6) if True else 0; el_ = rnd.uniform(0.2, 1.2); ln = rnd.uniform(0.35, 0.6) * o.get('hairlen', 1)
            x, y, z = 0.28 * math.sin(a), 0.28 * math.cos(a) * 0.9 + 0.05, 0.5 + 0.15 * math.cos(el_)
            bpy.ops.mesh.primitive_cone_add(radius1=0.11, depth=ln, vertices=8, location=(x, y, z)); c = bpy.context.object; c.parent = self.neck; c.data.materials.append(cab)
            c.rotation_euler = (R(-50 * math.cos(a) * 0 + 40 * (y > 0) - 20 * (y <= 0)) + rnd.uniform(-0.3, 0.3), R(55 * math.sin(a)) + rnd.uniform(-0.2, 0.2), 0)
            if o.get('hair_up'): c.rotation_euler = (rnd.uniform(-0.5, 0.3), rnd.uniform(-0.6, 0.6), 0)
        for i in range(5):
            bpy.ops.mesh.primitive_cone_add(radius1=0.09, depth=0.3, vertices=8, location=(-0.2 + i * 0.1, -0.24, 0.58), rotation=(R(140), R(-20 + i * 10), 0)); c = bpy.context.object; c.parent = self.neck; c.data.materials.append(cab)
        if o.get('longo'): cube(nm + '_cabLongo', (0.55, 0.2, 0.9), (0, 0.24, 0.0), cab, 0.12, self.neck)
        if o.get('cachecol'): bpy.ops.mesh.primitive_torus_add(major_radius=0.17, minor_radius=0.08, location=(0, 0, 0.05)); c = bpy.context.object; c.parent = self.neck; c.data.materials.append(mat(nm + '_cach', o['cachecol'], 0.8)); cube(nm + '_cachP', (0.15, 0.06, 0.7), (0.1, 0.25, -0.3), mat(nm + '_cach', o['cachecol'], 0.8), 0.03, self.neck, rot=(R(-20), 0, 0))
        if o.get('armadura'):
            ar = mat(nm + '_arm', '#2a2238', 0.3, 0.6)
            for s in (-1, 1): sphere(f'{nm}_ombreira{s}', 0.22, (s * 0.5, 0, 0.82), ar, self.tor, scale=(1.1, 1, 0.8))
            for s in (-1, 1): bpy.ops.mesh.primitive_cone_add(radius1=0.07, depth=0.35, location=(s * 0.18, 0, 0.75), rotation=(0, R(s * 25), 0)); c = bpy.context.object; c.parent = self.neck; c.data.materials.append(mat('chifre', '#e8e0d0', 0.4))
            cube(nm + '_capa', (0.9, 0.06, 1.6), (0, 0.3, 0.0), mat(nm + '_capaM', '#3a0f2e', 0.7), 0.04, self.tor)
        self.espada = None
        if o.get('espada'):
            self.espada = empty(nm + '_esp', (0, 0, -0.45), self.J['coR'])
            cyl(nm + '_cabo', 0.035, 0.28, (0, 0, 0), mat('caboM', '#2a1a14', 0.6), self.espada, bevel=0)
            cube(nm + '_lamina', (0.05, 0.12, 1.4), (0, 0, -0.8), emis('laminaRosa', '#ff6fd8', 6), 0.01, self.espada)
        aura_m = bpy.data.materials.new(nm + '_aura'); aura_m.use_nodes = True; nt = aura_m.node_tree; nt.nodes.clear(); ou = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
        h = lambda c: tuple((int(c[i:i+2], 16) / 255) ** 2.2 for i in (1, 3, 5)) + (1,)
        em.inputs['Color'].default_value = h(o['aura']); em.inputs['Strength'].default_value = 7; lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.6
        inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'MULTIPLY'; inv.inputs[1].default_value = 0.45; nt.links.new(lw.outputs['Facing'], inv.inputs[0])
        nt.links.new(inv.outputs[0], mx.inputs[0]); nt.links.new(em.outputs[0], mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], ou.inputs[0])
        self.aura = empty(nm + '_auraE', (0, 0, 0), self.root); self.aura_parts = []
        for i in range(10):
            a = i * 2 * math.pi / 10; bpy.ops.mesh.primitive_cone_add(radius1=0.2, depth=2.2, vertices=16, location=(0.5 * math.cos(a), 0.5 * math.sin(a), 1.3)); c = bpy.context.object; c.parent = self.aura; c.data.materials.append(aura_m); c.visible_shadow = False; self.aura_parts.append(c)
        self.face_cache = None
    def face(self, e):
        if e == self.face_cache: return
        self.face_cache = e; p = f'/root/b3d/anime/f_{self.nm}_{e}.png'; nm = os.path.basename(p)
        self.fn.image = bpy.data.images.get(nm) or bpy.data.images.load(p)
    def pose(self, x, y, z=0, rz=0, P=None, expr='serio', aura=0, t=0, lean=0, show=True):
        self.root.location = (x, y, z); self.root.rotation_euler = (0, 0, R(rz)); self.face(expr)
        P = P or {}
        for k in ('omL', 'omR', 'coL', 'coR', 'qdL', 'qdR', 'joL', 'joR'):
            v = P.get(k, (0, 0, 0)); self.J[k].rotation_euler = tuple(R(a) for a in v)
        self.tor.rotation_euler = tuple(R(a) for a in P.get('tor', (lean, 0, 0))); self.neck.rotation_euler = tuple(R(a) for a in P.get('cab', (0, 0, 0)))
        self.hip.location.z = 1.15 + P.get('agacha', 0)
        for i, c in enumerate(self.aura_parts):
            s = aura * (0.8 + 0.4 * math.sin(t * 14 + i * 1.7)); c.scale = (max(0.01, s),) * 3; c.hide_render = aura < 0.02 or not show
        for o in [self.root] + list(self.root.children_recursive):
            if o not in self.aura_parts: o.hide_render = not show
