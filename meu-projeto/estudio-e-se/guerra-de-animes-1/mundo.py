# A Terra dos Perdidos — personagens e cenários 3D (Blender, Cycles)
import bpy, math, random, sys
sys.path.insert(0, '/root/b3d')
from lib import mat, cube, cyl, sphere, empty, clear
R = math.radians
def pbsdf(m): return m.node_tree.nodes['Principled BSDF']
def emis(name, col, es): return mat(name, col, 0.4, emit=col, es=es)
def listras(name, c1, c2, freq=6.0, axis='Z', rough=0.85):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    mth = nt.nodes.new('ShaderNodeMath'); mth.operation = 'MULTIPLY'; mth.inputs[1].default_value = freq; nt.links.new(sep.outputs[axis], mth.inputs[0])
    fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'FRACT'; nt.links.new(mth.outputs[0], fr.inputs[0])
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5; nt.links.new(fr.outputs[0], gt.inputs[0])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    h = lambda c: tuple((int(c[i:i+2], 16) / 255) ** 2.2 for i in (1, 3, 5)) + (1,)
    mix.inputs['A'].default_value = h(c1); mix.inputs['B'].default_value = h(c2); nt.links.new(gt.outputs[0], mix.inputs['Factor']); nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    if 'Sheen Weight' in b.inputs: b.inputs['Sheen Weight'].default_value = 0.6
    return m
def smooth(o, lvl=2):
    sd = o.modifiers.new('ss', 'SUBSURF'); sd.levels = lvl; sd.render_levels = lvl
    for p in o.data.polygons: p.use_smooth = True
    return o
class Rosto:
    """olhos grandes (esclera + íris + pupila + brilho), pálpebras, sobrancelhas e bocas trocáveis"""
    def __init__(self, nm, parent, pos, esc=1.0, iris='#3b2a20'):
        self.root = empty(nm + '_rosto', pos, parent); self.root.scale = (esc,) * 3; self.olhos = []; self.palp = []; self.sobr = []; self.bocas = {}
        br = mat('esclera', '#ffffff', 0.25); ir = mat('iris_' + iris, iris, 0.3); pu = mat('pupila', '#0a0a10', 0.2); bl = emis('brilhoOlho', '#ffffff', 6)
        for s in (-1, 1):
            e = empty(f'{nm}_olho{s}', (s * 0.2, 0, 0), self.root); self.olhos.append(e)
            sphere(f'{nm}_escl{s}', 0.15, (0, 0, 0), br, e, scale=(1, 0.75, 1.15))
            sphere(f'{nm}_iris{s}', 0.085, (0, -0.1, -0.01), ir, e, scale=(1, 0.5, 1.1)); sphere(f'{nm}_pup{s}', 0.05, (0, -0.135, -0.01), pu, e, scale=(1, 0.5, 1.1))
            sphere(f'{nm}_bri{s}', 0.025, (-0.03, -0.155, 0.04), bl, e)
            pl = empty(f'{nm}_palpE{s}', (s * 0.2, 0, 0), self.root); self.palp.append(pl)
            sphere(f'{nm}_palp{s}', 0.158, (0, 0, 0.0), parent.data.materials[0] if getattr(parent, 'data', None) and parent.data.materials else mat('palpebra', '#e8c3a0', 0.6), pl, scale=(1.05, 0.8, 0.5))
            sb = cube(f'{nm}_sobr{s}', (0.2, 0.05, 0.045), (s * 0.2, -0.06, 0.25), mat('sobrancelha', '#2a1a14', 0.6), 0.02, self.root); self.sobr.append(sb)
        bm = mat('boca', '#4a1020', 0.5); lg = mat('lingua', '#e8707a', 0.5)
        for k, (sx, sz, oz) in {'sorriso': (0.22, 0.09, -0.24), 'aberta': (0.12, 0.14, -0.26), 'triste': (0.16, 0.05, -0.27), 'reta': (0.12, 0.02, -0.25)}.items():
            o = sphere(f'{nm}_boca_{k}', 1.0, (0, -0.02, oz), bm, self.root, scale=(sx, 0.05, sz))
            if k == 'sorriso': o.scale = (sx, 0.05, sz)
            self.bocas[k] = o
        self.set('feliz')
    def set(self, expr, blink=0.0, look=(0, 0)):
        E = {'feliz': ('sorriso', 12, 0.0), 'neutro': ('reta', 0, 0.0), 'medo': ('aberta', -25, -0.04), 'triste': ('triste', -22, 0.1), 'decidido': ('reta', 22, 0.2), 'grito': ('aberta', -30, -0.06), 'surpreso': ('aberta', -12, -0.05), 'serio': ('reta', 18, 0.25)}
        b, ang, lid = E.get(expr, E['neutro'])
        for k, o in self.bocas.items(): o.hide_render = k != b
        for s, sb in zip((-1, 1), self.sobr): sb.rotation_euler = (0, R(-s * ang), 0); sb.location.z = 0.25 + (0.04 if ang < 0 else -0.01)
        cl = max(lid, blink)
        for pl in self.palp:
            for c in pl.children: c.hide_render = True
        for e in self.olhos: e.rotation_euler = (R(look[1] * 20), 0, R(-look[0] * 25)); e.scale = (1, 1, max(0.08, 1 - cl))
class Meia:
    """meia em L: perna (cilindro suave) + calcanhar + pé; listras; punho canelado; rosto na frente da perna"""
    def __init__(self, nm, c1, c2, iris='#2a4fbf'):
        self.root = empty(nm); self.body = empty(nm + '_corpo', (0, 0, 0), self.root)
        m = listras(nm + '_mat', c1, c2, 5.5, 'Z'); mf = listras(nm + '_matp', c1, c2, 5.5, 'X')
        leg = cyl(nm + '_perna', 0.42, 1.75, (0, 0, 1.25), m, self.body, verts=48, bevel=0)
        sphere(nm + '_calc', 0.44, (-0.02, 0, 0.42), m, self.body, scale=(1.05, 1, 0.95))
        cyl(nm + '_pe', 0.4, 0.95, (0.5, 0, 0.38), mf, self.body, rot=(0, R(90), 0), verts=48, bevel=0)
        sphere(nm + '_dedo', 0.41, (0.97, 0, 0.38), mf, self.body, scale=(0.75, 1, 0.95))
        cf = cyl(nm + '_punho', 0.46, 0.38, (0, 0, 2.2), mat(nm + '_punhoM', c2, 0.9), self.body, verts=48, bevel=0.08)
        cyl(nm + '_punhoI', 0.4, 0.06, (0, 0, 2.38), mat('dentroMeia', '#3a2a2a', 0.9), self.body, bevel=0)
        self.rosto = Rosto(nm, self.body, (0, -0.4, 1.55), 1.0, iris)
        for s in (-1, 1): sphere(f'{nm}_boch{s}', 0.07, (s * 0.3, -0.37, 1.3), mat('bochecha', '#ff8fa3', 0.6), self.body, scale=(1, 0.3, 0.6))
    def pose(self, x=0, y=0, z=0, rz=0, hop=0, sq=0, lean=0, rot=(0, 0, 0), expr='neutro', blink=0, look=(0, 0), show=True, flip=False):
        self.root.location = (x, y, z + hop); self.root.rotation_euler = (R(rot[0]), R(rot[1]), R(rz + rot[2])); self.root.scale = (-1 if flip else 1, 1, 1)
        self.body.scale = (1 + sq * 0.5, 1 + sq * 0.5, 1 - sq); self.body.rotation_euler = (R(lean), 0, 0)
        self.rosto.set(expr, blink, look)
        for o in [self.root] + list(self.root.children_recursive): o.hide_render = not show if o.name.find('_boca_') < 0 and o.name.find('_palp') < 0 else (o.hide_render if show else True)
class Controle:
    def __init__(self, nm='controle'):
        self.root = empty(nm); b = empty(nm + '_b', (0, 0, 0), self.root); self.body = b
        c = cube(nm + '_corpo', (0.75, 0.38, 2.4), (0, 0, 1.2), mat('ctrlPreto', '#1d1f2b', 0.35), 0.18, b); smooth(c, 1)
        sphere(nm + '_power', 0.1, (0, -0.2, 2.1), emis('ctrlPower', '#ff3344', 3), b, scale=(1, 0.5, 1))
        cores = ['#c9ced6', '#ffd23f', '#4cc9f0']
        for i in range(3):
            for j in range(3): cyl(f'{nm}_bt{i}{j}', 0.07, 0.06, (-0.2 + j * 0.2, -0.2, 0.55 + i * 0.22), mat('bt' + cores[(i + j) % 3], cores[(i + j) % 3], 0.3), b, rot=(R(90), 0, 0), bevel=0.01)
        ouro = mat('ouro', '#ffc533', 0.25, 0.9)
        cyl(nm + '_coroa', 0.36, 0.2, (0, 0, 2.5), ouro, b, bevel=0.02)
        for k in range(5): a = k * 2 * math.pi / 5; bpy.ops.mesh.primitive_cone_add(radius1=0.09, depth=0.28, location=(0.3 * math.cos(a), 0.3 * math.sin(a), 2.72)); cc = bpy.context.object; cc.data.materials.append(ouro); cc.parent = b; sphere(f'{nm}_gema{k}', 0.035, (0.3 * math.cos(a), 0.3 * math.sin(a), 2.88), emis('gemaV', '#ff4466', 2), b)
        self.rosto = Rosto(nm, b, (0, -0.21, 1.6), 0.75, '#6b4a2a')
        for s in (-1, 1): sphere(f'{nm}_bigode{s}', 0.13, (s * 0.13, -0.22, 1.33), mat('bigode', '#e8e8e8', 0.8), b, scale=(1.4, 0.4, 0.55))
    def pose(self, x=0, y=0, z=0, rz=0, hop=0, lean=0, expr='serio', blink=0, look=(0, 0), show=True):
        self.root.location = (x, y, z + hop); self.root.rotation_euler = (0, 0, R(rz)); self.body.rotation_euler = (R(lean), 0, 0); self.rosto.set(expr, blink, look)
        for o in [self.root] + list(self.root.children_recursive): o.hide_render = not show if '_boca_' not in o.name and '_palp' not in o.name else (o.hide_render if show else True)
class Tampa:
    def __init__(self, nm='tampa'):
        self.root = empty(nm); bm = mat('tampaAzul', '#2f6bff', 0.25)
        bpy.ops.mesh.primitive_cone_add(radius1=0.42, radius2=0.33, depth=1.5, vertices=32, location=(0, 0, 0.75)); c = bpy.context.object; c.data.materials.append(bm); c.parent = self.root; smooth(c, 1)
        sphere(nm + '_topo', 0.33, (0, 0, 1.5), bm, self.root, scale=(1, 1, 0.5)); cube(nm + '_clipe', (0.12, 0.1, 1.0), (0, 0.4, 1.0), mat('tampaClipe', '#1b3fa8', 0.2), 0.04, self.root)
        self.rosto = Rosto(nm, self.root, (0, -0.37, 0.95), 0.6, '#3a2a20')
    def pose(self, x=0, y=0, z=0, rz=0, hop=0, expr='feliz', blink=0, look=(0, 0), show=True):
        self.root.location = (x, y, z + hop); self.root.rotation_euler = (0, 0, R(rz)); self.rosto.set(expr, blink, look)
        for o in [self.root] + list(self.root.children_recursive): o.hide_render = not show if '_boca_' not in o.name and '_palp' not in o.name else (o.hide_render if show else True)
class Brinco:
    def __init__(self, nm='brinco'):
        self.root = empty(nm); ouro = mat('ouro', '#ffc533', 0.25, 0.9)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.7, minor_radius=0.09, location=(0, 0, 1.5), rotation=(R(90), 0, 0)); t = bpy.context.object; t.data.materials.append(ouro); t.parent = self.root; smooth(t, 1)
        sphere(nm + '_gema', 0.32, (0, 0, 0.5), mat('gemaRosa', '#ff4fa3', 0.05, 0.0), self.root, scale=(1, 0.7, 1.3))
        self.rosto = Rosto(nm, self.root, (0, -0.24, 0.55), 0.45, '#2a1a3a')
    def pose(self, x=0, y=0, z=0, rz=0, hop=0, expr='feliz', blink=0, look=(0, 0), show=True):
        self.root.location = (x, y, z + hop); self.root.rotation_euler = (0, 0, R(rz)); self.rosto.set(expr, blink, look)
        for o in [self.root] + list(self.root.children_recursive): o.hide_render = not show if '_boca_' not in o.name and '_palp' not in o.name else (o.hide_render if show else True)

class Moeda:
    def __init__(self, nm='moeda'):
        self.root = empty(nm); b = empty(nm + '_b', (0, 0, 0.75), self.root)
        cyl(nm + '_disco', 0.75, 0.18, (0, 0, 0), mat('moedaM', '#f2c14e', 0.25, 0.85), b, rot=(R(90), 0, 0), bevel=0.04)
        self.rosto = Rosto(nm, b, (0, -0.1, 0.05), 0.55, '#3a2a20'); self.b = b
    def pose(self, x=0, y=0, z=0, rz=0, hop=0, expr='feliz', blink=0, look=(0, 0), show=True, spin=0):
        self.root.location = (x, y, z + hop); self.root.rotation_euler = (0, 0, R(rz + spin)); self.rosto.set(expr, blink, look)
        for o in [self.root] + list(self.root.children_recursive): o.hide_render = not show if '_boca_' not in o.name and '_palp' not in o.name else (o.hide_render if show else True)
