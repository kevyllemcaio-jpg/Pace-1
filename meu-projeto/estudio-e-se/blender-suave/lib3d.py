# Biblioteca do 3D suave (Blender/Cycles): materiais, personagens em metaball (formas fundidas), masmorra
import bpy, math, random
from mathutils import Vector, Quaternion, Euler

def hexc(h): h = h.lstrip('#'); return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
_MATS = {}
def mat(name, col, rough=0.5, sss=0.0, metal=0.0, emit=None, ei=0.0, noise=0.0, coat=0.0):
    if name in _MATS: return _MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if sss: b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = (1.0, 0.35, 0.2); b.inputs['Subsurface Scale'].default_value = 0.04
    if coat: b.inputs['Coat Weight'].default_value = coat
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = ei
    if noise:  # pedra/irregularidade: ruído na cor e relevo
        tx = nt.nodes.new('ShaderNodeTexNoise'); tx.inputs['Scale'].default_value = 6; tx.inputs['Detail'].default_value = 8
        cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (*[c * (1 - noise) for c in col], 1); cr.color_ramp.elements[1].color = (*col, 1)
        nt.links.new(tx.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
        bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.4; nt.links.new(tx.outputs['Fac'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
    _MATS[name] = m; return m

def smooth(o, sub=2):
    for p in o.data.polygons: p.use_smooth = True
    if sub: md = o.modifiers.new('s', 'SUBSURF'); md.levels = sub; md.render_levels = sub
    return o
def link(o, coll):
    for c in list(o.users_collection): c.objects.unlink(o)
    coll.objects.link(o); return o
def sphere(loc, scale, m, coll, sub=2, segs=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, location=loc); o = bpy.context.object; o.scale = scale; o.data.materials.append(m); smooth(o, sub); return link(o, coll)
def cube(loc, scale, m, coll, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o = bpy.context.object; o.scale = scale; o.data.materials.append(m)
    if bevel: md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = 3
    return link(o, coll)

# ---------------- personagem em metaball: o corpo inteiro é uma peça lisa só (sem emendas)
class Char:
    """Personagem estilizado (cabeça grande, olhos de anime). Pose = dicionário de ângulos; a cada quadro chama .pose()."""
    def __init__(self, name, skin, cloth, pants, boots, hair=None, hood=None, scale=1.0, eye='#3a2a1f', coll=None):
        self.name = name; self.s = scale; self.coll = coll or bpy.context.scene.collection
        self.root = bpy.data.objects.new(name, None); self.coll.objects.link(self.root)
        def mb(part, m, thr=0.6):
            d = bpy.data.metaballs.new(f'{name}_{part}'); d.resolution = 0.05; d.render_resolution = 0.018 * scale; d.threshold = thr
            o = bpy.data.objects.new(f'{name}{part}', d); o.data.materials.append(m); self.coll.objects.link(o); o.parent = self.root; return d
        self.mSkin = mb('Skin', mat(f'{name}skin', hexc(skin), 0.45, sss=0.2)); self.mCloth = mb('Cloth', mat(f'{name}cloth', hexc(cloth), 0.75))
        self.mPants = mb('Pants', mat(f'{name}pants', hexc(pants), 0.75)); self.mBoots = mb('Boots', mat(f'{name}boots', hexc(boots), 0.45))
        self.mHair = mb('Hair', mat(f'{name}hair', hexc(hair or '#222'), 0.4, coat=0.3)) if hair else None
        self.mHood = mb('Hood', mat(f'{name}hood', hexc(hood), 0.8)) if hood else None
        # rosto: olhos grandes de anime + boca (malhas, presas à cabeça)
        self.head = bpy.data.objects.new(f'{name}Head', None); self.coll.objects.link(self.head); self.head.parent = self.root
        W_, I_, P_, S_ = mat('eyeW', (0.96, 0.96, 0.96), 0.15), mat(f'{name}iris', hexc(eye), 0.15, emit=hexc(eye), ei=0.3), mat('pup', (0.005, 0.005, 0.005), 0.1), mat('shine', (1, 1, 1), 0.1, emit=(1, 1, 1), ei=8)
        self.eyes = []
        for sx in (-1, 1):
            e = bpy.data.objects.new(f'{name}Eye{sx}', None); self.coll.objects.link(e); e.parent = self.head; e.location = (sx * 0.075, -0.2, 0.02)
            for (m, sc, y) in ((W_, (0.062, 0.03, 0.08), 0), (I_, (0.045, 0.02, 0.06), -0.018), (P_, (0.024, 0.01, 0.034), -0.03), (S_, (0.012, 0.005, 0.014), -0.036)):
                o = sphere((0, y, 0), sc, m, self.coll, sub=1, segs=20); o.parent = e
                if m is S_: o.location = (sx * 0.0 + 0.014, -0.036, 0.022)
            self.eyes.append(e)
        self.brows = []
        for sx in (-1, 1):
            b = sphere((0, 0, 0), (0.05, 0.012, 0.011), mat(f'{name}brow', hexc(hair or '#222'), 0.6), self.coll, sub=1, segs=12); b.parent = self.head; b.location = (sx * 0.08, -0.205, 0.11); self.brows.append(b)
        self.mouth = sphere((0, 0, 0), (0.04, 0.012, 0.012), mat('mouth', hexc('#6b2222'), 0.5), self.coll, sub=1, segs=12); self.mouth.parent = self.head; self.mouth.location = (0, -0.225, -0.1)
        self.props = []
    def add_prop(self, obj, bone):  # objeto que segue a mão: bone = 'handL'/'handR'
        obj.parent = self.root; self.props.append((obj, bone)); return obj
    def place(self, x, y, z=0, rot=0): self.root.location = (x, y, z); self.root.rotation_euler = (0, 0, rot); self.root.scale = (self.s,) * 3
    def pose(self, p=None, face='normal', look=(0, 0), blink=False):
        p = p or {}; g = lambda k, d=0.0: p.get(k, d)
        for d in (self.mSkin, self.mCloth, self.mPants, self.mBoots) + ((self.mHair,) if self.mHair else ()) + ((self.mHood,) if self.mHood else ()): d.elements.clear()
        def ball(d, co, r, stiff=2.0): e = d.elements.new(); e.co = co; e.radius = r; e.stiffness = stiff; return e
        def caps(d, a, b, r, stiff=2.0):  # cápsula de a até b
            a, b = Vector(a), Vector(b); e = d.elements.new(); e.type = 'CAPSULE'; e.co = (a + b) / 2; e.radius = r; e.size_x = max(0.001, (b - a).length / 2); e.stiffness = stiff
            e.rotation = Vector((1, 0, 0)).rotation_difference((b - a).normalized()); return e
        lean, crouch, twist = g('lean'), g('crouch'), g('twist')
        hip = Vector((0, 0, 0.78 - crouch))
        rot = Euler((lean, 0, twist)).to_matrix()
        chest = hip + rot @ Vector((0, 0, 0.42)); neck = hip + rot @ Vector((0, 0, 0.6)); headc = hip + rot @ Vector((0, 0, 0.86)) + Vector((0, g('headF'), 0))
        # tronco e quadril
        caps(self.mCloth, hip + rot @ Vector((0, 0, 0.08)), chest, 0.2); ball(self.mCloth, chest + rot @ Vector((0, 0.0, -0.05)), 0.24)
        ball(self.mPants, hip, 0.2)
        caps(self.mSkin, neck, headc - Vector((0, 0, 0.1)), 0.06)
        ball(self.mSkin, headc, 0.3, 2.5); ball(self.mSkin, headc + Vector((0, -0.04, -0.09)), 0.21)  # cabeça + bochecha/queixo
        for sx in (-1, 1): ball(self.mSkin, headc + Vector((sx * 0.25, 0.02, -0.02)), 0.06)              # orelhas
        # pernas (ângulos: leg*, knee*)
        for side, sx in (('L', -1), ('R', 1)):
            h = hip + Vector((sx * 0.1, 0, -0.05)); th = g('leg' + side); kn = g('knee' + side)
            k = h + Vector((0, -math.sin(th) * 0.36, -math.cos(th) * 0.36)); f = k + Vector((0, -math.sin(th - kn) * 0.36, -math.cos(th - kn) * 0.36))
            caps(self.mPants, h, k, 0.11); caps(self.mPants, k, f + Vector((0, 0, 0.05)), 0.1); caps(self.mBoots, f + Vector((0, 0.0, 0.04)), f + Vector((0, -0.1, 0.0)), 0.075)
        # braços (arm*: (frente, lado), elbow*)
        self.hands = {}
        for side, sx in (('L', -1), ('R', 1)):
            sh = chest + rot @ Vector((sx * 0.24, 0, 0.06)); fw, sd = p.get('arm' + side, (0.0, 0.15)); el = g('elbow' + side)
            dirv = Vector((sx * math.sin(sd), -math.sin(fw) * math.cos(sd), -math.cos(fw) * math.cos(sd))); e = sh + rot @ (dirv * 0.28)
            fw2 = fw + el; dir2 = Vector((sx * math.sin(sd) * 0.5, -math.sin(fw2), -math.cos(fw2))); hnd = e + rot @ (dir2.normalized() * 0.26)
            caps(self.mCloth, sh, e, 0.085); caps(self.mCloth, e, hnd, 0.075); ball(self.mSkin, hnd + rot @ (dir2.normalized() * 0.05), 0.085)
            self.hands['hand' + side] = (hnd + rot @ (dir2.normalized() * 0.07), dir2)
        if self.mHair:
            hc = headc
            ball(self.mHair, hc + Vector((0, 0.04, 0.12)), 0.31)
            for i in range(9):  # franja/espetos estilo anime
                a = (i - 4) * 0.22; ball(self.mHair, hc + Vector((math.sin(a) * 0.24, -0.16 + abs(a) * 0.12, 0.2 - abs(a) * 0.05)), 0.09)
            if not self.mHood:
                for sx in (-1, 1): caps(self.mHair, hc + Vector((sx * 0.26, -0.05, 0.12)), hc + Vector((sx * 0.27, -0.1, -0.08)), 0.06)
        if self.mHood:
            hc = headc
            ball(self.mHood, hc + Vector((0, 0.05, 0.06)), 0.44, 2.2); ball(self.mHood, hc + Vector((0, 0.16, 0.16)), 0.3)
            neg = ball(self.mHood, hc + Vector((0, -0.3, -0.03)), 0.3, 2.5); neg.use_negative = True      # abertura do rosto
            caps(self.mHood, neck + Vector((-0.16, 0.06, -0.05)), neck + Vector((0.16, 0.06, -0.05)), 0.1)  # gola
            caps(self.mHood, chest + rot @ Vector((0, 0.17, 0.05)), hip + rot @ Vector((0, 0.24, -0.32)), 0.21)  # capa nas costas
            caps(self.mCloth, hc + Vector((-0.13, -0.17, -0.19)), hc + Vector((0.13, -0.17, -0.19)), 0.075)     # lenço sobre a boca
        # rosto
        self.head.location = headc; self.head.rotation_euler = (g('nod'), 0, g('turn'))
        for i, e in enumerate(self.eyes):
            e.scale = (1, 1, 0.12 if blink else (1.25 if face == 'shock' else 0.6 if face in ('angry', 'cool') else 1.0))
            e.rotation_euler = (0, 0, 0); e.location = ((-1 if i == 0 else 1) * 0.075 + look[0] * 0.01, -0.2, 0.02 + look[1] * 0.01)
        for i, b in enumerate(self.brows):
            sx = -1 if i == 0 else 1; b.rotation_euler = (0, sx * (0.35 if face == 'angry' else -0.25 if face == 'sad' else 0.15 if face == 'cool' else 0), 0)
            b.location = (sx * 0.08, -0.205, 0.12 if face == 'shock' else 0.1)
        mk = {'shock': (0.6, 1, 2.6), 'smile': (1.3, 1, 0.8), 'grin': (1.5, 1, 1.4), 'angry': (1.0, 1, 0.7), 'sad': (0.9, 1, 0.8)}.get(face, (1, 1, 1))
        self.mouth.scale = (0.04 * mk[0], 0.012 * mk[1], 0.012 * mk[2])
        for o, bone in self.props:
            hpos, d = self.hands[bone]; o.location = hpos; o.rotation_mode = 'QUATERNION'
            q = Vector((0, 0, 1)).rotation_difference(-d.normalized() if o.get('down') else d.normalized()); o.rotation_quaternion = q @ Quaternion((0, 0, 1), o.get('spin', 0.0))
        return self

def dagger(coll, name='dagger'):
    o = bpy.data.objects.new(name, None); coll.objects.link(o)
    bl = cube((0, 0, 0.17), (0.018, 0.006, 0.15), mat('steel', (0.75, 0.78, 0.82), 0.12, metal=1.0), coll, bevel=0.004); bl.parent = o
    gd = cube((0, 0, 0.02), (0.06, 0.015, 0.012), mat('brass', hexc('#b08a3a'), 0.3, metal=0.8), coll, bevel=0.004); gd.parent = o
    hd = cube((0, 0, -0.04), (0.014, 0.014, 0.05), mat('grip', hexc('#3b2a20'), 0.6), coll, bevel=0.005); hd.parent = o
    return o
