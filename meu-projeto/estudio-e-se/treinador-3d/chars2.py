import bpy, math
from lib import *
from chars import img_mat
FACE_DIR = '/root/b3d'
def counter_img(n, fn):
    from PIL import Image, ImageDraw, ImageFont
    im = Image.new('RGBA', (256, 96), (16, 16, 22, 255)); d = ImageDraw.Draw(im); f = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 58 if len(n) < 6 else 48)
    bb = d.textbbox((0, 0), n, font=f); col = (255, 70, 70, 255) if n == '0' else (80, 230, 255, 255)
    d.text(((256 - bb[2]) // 2 - bb[0], (96 - bb[3]) // 2 - bb[1] - 4), n, font=f, fill=col); im.save(fn)
class Avatar:
    def __init__(self, name, o, loc=(0, 0, 0)):
        self.name = name; self.o = o; self.root = root = empty(name, loc); self.J = J = {}
        skin = mat(name + '_skin', o['skin'], 0.45); top = mat(name + '_top', o['top'], 0.8); top2 = mat(name + '_top2', o.get('top2', o['top']), 0.8)
        pants = mat(name + '_pants', o['pants'], 0.8); shoes = mat(name + '_shoes', '#F7F7F7', 0.45); sole = mat(name + '_sole', o.get('sole', '#DDDDDD'), 0.5)
        for s, nm in ((-1, 'L'), (1, 'R')):
            hip = empty(f'{name}_hip{nm}', (s * 0.25, 0, 1.0), root); J['leg' + nm] = hip
            cube(f'{name}_leg{nm}', (0.48, 0.48, 0.86), (0, 0, -0.46), pants, 0.04, hip)
            if o.get('socks'): cube(f'{name}_sock{nm}', (0.5, 0.5, 0.3), (0, 0, -0.72), mat(name + '_sockm', o['socks'], 0.7), 0.04, hip)
            cube(f'{name}_shoe{nm}', (0.52, 0.6, 0.16), (0, -0.04, -0.88), shoes, 0.05, hip)
            cube(f'{name}_sole{nm}', (0.54, 0.62, 0.06), (0, -0.04, -0.97), sole, 0.02, hip)
        cube(f'{name}_torso', (0.98, 0.5, 0.98), (0, 0, 1.5), top, 0.06, root)
        if o.get('skirt'): cube(f'{name}_skirt', (1.1, 0.62, 0.5), (0, 0, 0.98), img_mat(name + '_plaid', o['skirt'], 0.7, alpha=False, repeat=2), 0.05, root)
        if o.get('hoodie'):
            cube(f'{name}_pocket', (0.62, 0.06, 0.3), (0, -0.26, 1.22), top2, 0.03, root)
            cube(f'{name}_hood', (0.86, 0.3, 0.24), (0, 0.16, 2.02), top2, 0.1, root)
            plane(f'{name}_bolt', (0.36, 0.36), (0, -0.256, 1.62), img_mat('bolt', FACE_DIR + '/bolt.png', 0.6), rot=(math.pi / 2, 0, 0), parent=root)
            for s in (-1, 1): cyl(f'{name}_cord{s}', 0.025, 0.3, (s * 0.14, -0.27, 1.8), mat('cord', '#FFFFFF', 0.5), root, bevel=0)
        if o.get('backpack'):
            bp = mat(name + '_bp', o['backpack'], 0.7); cube(f'{name}_bag', (0.82, 0.34, 0.86), (0, 0.42, 1.48), bp, 0.1, root)
            cube(f'{name}_bagp', (0.6, 0.1, 0.36), (0, 0.62, 1.32), mat(name + '_bp2', '#1A8F5A', 0.7), 0.05, root)
            for s in (-1, 1): cube(f'{name}_strap{s}', (0.12, 0.54, 0.08), (s * 0.3, 0.0, 1.97), bp, 0.03, root)
        for s, nm in ((-1, 'L'), (1, 'R')):
            sh = empty(f'{name}_sh{nm}', (s * 0.74, 0, 1.92), root); J['arm' + nm] = sh
            cube(f'{name}_arm{nm}', (0.46, 0.46, 0.66), (0, 0, -0.31), top, 0.05, sh)
            cube(f'{name}_cuff{nm}', (0.48, 0.48, 0.1), (0, 0, -0.66), top2, 0.03, sh)
            cube(f'{name}_hand{nm}', (0.44, 0.44, 0.28), (0, 0, -0.84), skin, 0.08, sh)
            if nm == 'L':
                cube(f'{name}_band', (0.5, 0.5, 0.13), (0, 0, -0.74), mat('band', '#16161c', 0.3), 0.02, sh)
                self.cnt_img = bpy.data.images.new(name + '_cntimg', 256, 96); self.cnt_mat = img_mat(name + '_cnt', FACE_DIR + '/cnt_boy.png', 0.3, emit=2.5, alpha=False)
                self.cnt_node = [n for n in self.cnt_mat.node_tree.nodes if n.type == 'TEX_IMAGE'][0]
                plane(f'{name}_cntP', (0.42, 0.16), (0, -0.252, -0.74), self.cnt_mat, rot=(math.pi / 2, 0, 0), parent=sh)
        neck = empty(f'{name}_neck', (0, 0, 2.0), root); J['head'] = neck
        cube(f'{name}_head', (0.82, 0.76, 0.78), (0, 0, 0.42), skin, 0.16, neck)
        self.face_mat = img_mat(name + '_face', f"{FACE_DIR}/{o['faces']}_feliz.png", 0.5)
        self.face_node = [n for n in self.face_mat.node_tree.nodes if n.type == 'TEX_IMAGE'][0]
        plane(f'{name}_faceP', (0.8, 0.8), (0, -0.386, 0.4), self.face_mat, rot=(math.pi / 2, 0, 0), parent=neck)
        hm = mat(name + '_hair', o['hair'], 0.55)
        if o.get('quiff'):
            cube(f'{name}_hairTop', (0.86, 0.8, 0.22), (0, 0.02, 0.86), hm, 0.08, neck)
            cube(f'{name}_hairBack', (0.84, 0.2, 0.5), (0, 0.32, 0.62), hm, 0.08, neck)
            for s in (-1, 1): cube(f'{name}_hairSide{s}', (0.08, 0.6, 0.3), (s * 0.42, 0.06, 0.66), hm, 0.03, neck)
            for i in range(4):
                sp = cube(f'{name}_spike{i}', (0.2, 0.34, 0.16), (-0.3 + i * 0.2, -0.3, 0.98 - abs(i - 1.5) * 0.04), hm, 0.05, neck, rot=(math.radians(-28), 0, math.radians((i - 1.5) * 8)))
        if o.get('phones'):
            band = bpy.ops.mesh.primitive_torus_add(major_radius=0.5, minor_radius=0.045, location=(0, 0.04, 0.42), rotation=(math.pi / 2, 0, 0)); b = bpy.context.object; b.name = name + '_band2'; b.parent = neck
            b.data.materials.append(mat('phones', '#18181C', 0.35)); bpy.ops.object.shade_smooth()
            for s in (-1, 1): cyl(f'{name}_cup{s}', 0.2, 0.14, (s * 0.47, 0.04, 0.42), mat('phones', '#18181C', 0.35), neck, rot=(0, math.pi / 2, 0)); cyl(f'{name}_pad{s}', 0.15, 0.06, (s * 0.53, 0.04, 0.42), mat('phonesR', '#FF8A1F', 0.4), neck, rot=(0, math.pi / 2, 0))
        if o.get('short'):
            cube(f'{name}_hairTop', (0.86, 0.8, 0.2), (0, 0.02, 0.86), hm, 0.08, neck); cube(f'{name}_hairBack', (0.84, 0.2, 0.46), (0, 0.32, 0.64), hm, 0.08, neck)
            for s_ in (-1, 1): cube(f'{name}_hairSide{s_}', (0.08, 0.6, 0.28), (s_ * 0.42, 0.06, 0.68), hm, 0.03, neck)
            cube(f'{name}_fr', (0.84, 0.12, 0.14), (0, -0.37, 0.8), hm, 0.04, neck)
        if o.get('bun'):
            cube(f'{name}_hairTop', (0.88, 0.82, 0.24), (0, 0.02, 0.86), hm, 0.1, neck); cube(f'{name}_hairBack', (0.86, 0.22, 0.7), (0, 0.32, 0.52), hm, 0.1, neck)
            sphere(f'{name}_bun', 0.26, (0, 0.1, 1.1), hm, neck)
        if o.get('glasses'):
            gm = mat('oculos', '#1A1A22', 0.3)
            for s_ in (-1, 1):
                cx = s_ * 0.17
                for (dx, dz, w, h) in ((0, 0.11, 0.28, 0.035), (0, -0.11, 0.28, 0.035), (-0.14, 0, 0.035, 0.25), (0.14, 0, 0.035, 0.25)): cube(f'{name}_g{s_}{dx}{dz}', (w, 0.03, h), (cx + dx, -0.4, 0.5 + dz), gm, 0, neck)
            cube(f'{name}_gbr', (0.08, 0.03, 0.03), (0, -0.4, 0.52), gm, 0, neck)
        if o.get('tie'): cube(f'{name}_gravata', (0.14, 0.04, 0.6), (0, -0.27, 1.62), mat(name + '_grav', o['tie'], 0.5), 0.02, root)
        if o.get('apron'): cube(f'{name}_avental', (0.84, 0.04, 1.1), (0, -0.27, 1.25), mat(name + '_av', o['apron'], 0.7), 0.02, root)
        if o.get('pigtails'):
            cube(f'{name}_hairTop', (0.9, 0.84, 0.26), (0, 0.03, 0.86), hm, 0.1, neck)
            cube(f'{name}_hairBack', (0.88, 0.22, 0.74), (0, 0.33, 0.5), hm, 0.1, neck)
            cube(f'{name}_fringe', (0.84, 0.12, 0.2), (0, -0.37, 0.74), hm, 0.05, neck)
            for s in (-1, 1):
                cube(f'{name}_side{s}', (0.1, 0.66, 0.56), (s * 0.43, 0.02, 0.54), hm, 0.05, neck)
                sphere(f'{name}_tail{s}', 0.24, (s * 0.6, 0.16, 0.1), hm, neck, scale=(0.85, 0.85, 2.3))
                cube(f'{name}_tie{s}', (0.18, 0.18, 0.1), (s * 0.54, 0.18, 0.6), mat(name + '_tie', o.get('bow', '#FF5FA2'), 0.4), 0.03, neck)
        self.pose('normal'); self.face('feliz')
    def face(self, expr):
        if getattr(self, '_fc', None) == expr: return
        if self.o.get('ball', 1) and getattr(self, '_ball', False):
            self._fc = expr; p = f"{FACE_DIR}/{self.o['faces']}_{expr}.png"; nm = '_'.join(p.split('/')[-2:])
            img = bpy.data.images.get(nm)
            if not img: img = bpy.data.images.load(p); img.name = nm
            self.face_node.image = img; return
        self._fc = expr
        p = f"{FACE_DIR}/{self.o['faces']}_{expr}.png"; img = bpy.data.images.get(p.split('/')[-1]) or bpy.data.images.load(p); self.face_node.image = img
    def counter(self, n):
        fn = f'/root/b3d/cnt/{self.name}_{n}.png'
        import os; os.makedirs('/root/b3d/cnt', exist_ok=True)
        if not os.path.exists(fn): counter_img(n, fn)
        self.cnt_node.image = bpy.data.images.get(os.path.basename(fn)) or bpy.data.images.load(fn)
    def pose(self, kind='normal', head=(0, 0, 0)):
        R = math.radians; L, Rr = self.J['armL'], self.J['armR']
        def A(fwdL, sideL, fwdR, sideR): return ((R(-fwdL), R(sideL), 0), (R(-fwdR), R(-sideR), 0))
        P = {'normal': A(0, 4, 0, 4), 'aceno': A(0, 4, 10, 155), 'cima': A(0, 165, 0, 165), 'aponta': A(0, 4, 88, 6), 'cabeca': A(130, 35, 130, 35),
             'abre': A(0, 55, 0, 55), 'polegar': A(0, 4, 75, -15), 'segura': A(75, -8, 75, -8), 'contador': A(80, -35, 0, 4), 'bolso': A(-12, 2, -12, 2), 'bate': A(0, 4, 120, -10)}[kind]
        L.rotation_euler, Rr.rotation_euler = P
        self.J['head'].rotation_euler = tuple(R(x) for x in head)
        for nm in ('legL', 'legR'): self.J[nm].rotation_euler = (0, 0, 0)
    def walk(self, ph):
        R = math.radians; self.J['legL'].rotation_euler = (R(25 * math.sin(ph)), 0, 0); self.J['legR'].rotation_euler = (R(-25 * math.sin(ph)), 0, 0)
        self.J['armL'].rotation_euler = (R(-25 * math.sin(ph)), R(4), 0); self.J['armR'].rotation_euler = (R(25 * math.sin(ph)), R(-4), 0)
    def sit(self):
        R = math.radians; self.J['legL'].rotation_euler = (R(-90), 0, 0); self.J['legR'].rotation_euler = (R(-90), 0, 0)
    def place(self, x, y, z=0, rz=0, show=True):
        self.root.location = (x, y, z); self.root.rotation_euler = (0, 0, math.radians(rz)); self.root.hide_render = not show
        for c in self.root.children_recursive: c.hide_render = not show
ZECA = dict(skin='#E8B48A', top='#FF8A1F', top2='#E0661A', pants='#2D3B55', sole='#22B573', hair='#2B1A10', faces='zeca', quiff=1, phones=1, hoodie=1, backpack='#22B573')
MARI = dict(skin='#F1C9A5', top='#7B3FB8', top2='#6A32A0', pants='#F1C9A5', socks='#F7F7F7', sole='#2B1B1E', hair='#3A2316', faces='mari', pigtails=1, skirt='/root/b3d/plaid.png', bow='#FF5FA2')

PROF = dict(skin='#C98E66', top='#7FB2E5', pants='#C8A878', hair='#D8C49A', faces='zeca', short=1, glasses=1, tie='#2B4C8C')
MAE = dict(skin='#F1C9A5', top='#E76F51', pants='#264653', hair='#5A3420', faces='mari', bun=1)
AVO = dict(skin='#E8B48A', top='#8D99AE', pants='#5C4B3A', hair='#D9D9D9', faces='zeca', short=1, glasses=1)
BARISTA = dict(skin='#8B5A3C', top='#F2F2F2', pants='#2B2D42', hair='#1B1212', faces='zeca', short=1, apron='#2A9D8F')
DIRETOR = dict(skin='#F1C9A5', top='#5E3A8C', pants='#3A2A55', hair='#AAAAAA', faces='zeca', short=1, tie='#E63946')
KIDS = [dict(skin='#F1C9A5', top='#22B573', pants='#2D3B55', hair='#7A4A2A', faces='zeca', short=1),
        dict(skin='#8B5A3C', top='#E63946', pants='#3A2A55', hair='#1B1212', faces='mari', pigtails=1, skirt='/root/b3d/plaid.png', bow='#FFD23F'),
        dict(skin='#E8B48A', top='#3A86FF', pants='#5C4B3A', hair='#F0C34A', faces='mari', bun=1),
        dict(skin='#C98E66', top='#FFD23F', pants='#2D3B55', hair='#2B1A10', faces='zeca', short=1),
        dict(skin='#F6E3D3', top='#FF5FA2', pants='#2D3B55', hair='#D9542B', faces='mari', pigtails=1, skirt='/root/b3d/plaid.png', bow='#3A86FF'),
        dict(skin='#8B5A3C', top='#8338EC', pants='#2D3B55', hair='#1B1212', faces='zeca', short=1)]

# ---------- extras do "treinador": número no peito, cachecol, gorro, bengala
def num_img(n, fn, glow=(255, 214, 90)):
    from PIL import Image, ImageDraw, ImageFont
    im = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); d = ImageDraw.Draw(im); f = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 150 if len(n) < 3 else 112)
    d.ellipse((8, 8, 248, 248), fill=(20, 24, 40, 230), outline=glow + (255,), width=12)
    bb = d.textbbox((0, 0), n, font=f); d.text(((256 - bb[2]) // 2 - bb[0], (256 - bb[3]) // 2 - bb[1] - 6), n, font=f, fill=(255, 255, 255, 255), stroke_width=6, stroke_fill=glow + (255,))
    im.save(fn)
def add_extras(av):
    o = av.o; name = av.name; root = av.root; neck = av.J['head']
    import os
    if o.get('num') is not None:
        av.num_mat = img_mat(name + '_num', '/root/b3d/bolt.png', 0.4, emit=1.6)
        av.num_node = [n for n in av.num_mat.node_tree.nodes if n.type == 'TEX_IMAGE'][0]
        plane(f'{name}_numP', (0.42, 0.42), (0, -0.30 if o.get('hoodie') else -0.258, 1.24 if o.get('hoodie') else 1.5), av.num_mat, rot=(math.pi / 2, 0, 0), parent=root)
        def setnum(n, glow=(255, 214, 90)):
            if getattr(av, '_nc', None) == (n, glow): return
            av._nc = (n, glow)
            fn = f'/root/b3d/cnt/num_{n}_{glow[0]}.png'; os.makedirs('/root/b3d/cnt', exist_ok=True)
            if not os.path.exists(fn): num_img(str(n), fn, glow)
            av.num_node.image = bpy.data.images.get(os.path.basename(fn)) or bpy.data.images.load(fn)
        av.setnum = setnum; setnum(o['num'])
    if o.get('scarf'):
        sm = mat(name + '_scarf', o['scarf'], 0.85)
        cube(f'{name}_scarfR', (1.0, 0.62, 0.22), (0, 0, 2.02), sm, 0.1, root)
        cube(f'{name}_scarfT', (0.26, 0.1, 0.62), (0.22, -0.3, 1.72), sm, 0.05, root, rot=(0, math.radians(-8), 0))
    if o.get('beanie'):
        bm = mat(name + '_bean', o['beanie'], 0.85)
        cube(f'{name}_beanie', (0.9, 0.84, 0.4), (0, 0.02, 0.86), bm, 0.14, neck); cube(f'{name}_beanieB', (0.92, 0.86, 0.14), (0, 0.02, 0.7), mat(name + '_bean2', o.get('beanie2', '#FFFFFF'), 0.9), 0.05, neck)
        sphere(f'{name}_pom', 0.15, (0, 0.02, 1.12), mat(name + '_pomm', o.get('beanie2', '#FFFFFF'), 0.95), neck)
    if o.get('longhair'):
        hm = mat(name + '_hair', o['hair'], 0.6)
        cube(f'{name}_lhTop', (0.88, 0.82, 0.24), (0, 0.03, 0.86), hm, 0.1, neck); cube(f'{name}_lhBack', (0.88, 0.24, 0.9), (0, 0.32, 0.4), hm, 0.1, neck)
        for s in (-1, 1): cube(f'{name}_lhSide{s}', (0.12, 0.7, 0.8), (s * 0.44, 0.04, 0.42), hm, 0.05, neck)
        cube(f'{name}_lhFr', (0.86, 0.14, 0.24), (0.08, -0.37, 0.74), hm, 0.05, neck, rot=(0, math.radians(8), 0))
    if o.get('cane'):
        av.cane = cyl(f'{name}_cane', 0.05, 1.3, (0, 0, -1.4), mat('cane', '#6B4226', 0.6), av.J['armR'])
    if o.get('beard'):
        cube(f'{name}_beard', (0.6, 0.1, 0.24), (0, -0.4, 0.16), mat(name + '_beardm', o['beard'], 0.9), 0.06, neck)
    return av
ZECA_T = dict(skin='#F5F5F5', headcol='#F7F7F7', top='#F2B705', top2='#D99E00', pants='#1F4E9C', sole='#FFFFFF', hair='#9a6a3a', bald=1, glove='#FFFFFF', faces='f2/bo', num=100, nobolt=1, hoodie=0, collar=1)
BRUNO = dict(skin='#C98E66', top='#2A9D8F', top2='#21867A', pants='#3A4A7A', sole='#F2F2F2', hair='#1B1212', faces='f2/br', longhair=1, scarf='#FFD23F', num=44, hoodie=0)
LUCAS = dict(skin='#F1C9A5', top='#3A6BD9', top2='#2D55AF', pants='#2B2D42', sole='#E63946', hair='#5A3420', faces='f2/lu', beanie='#FF8A1F', beanie2='#FFFFFF', num=44)
MESTRE = dict(skin='#E0B08A', top='#8A5A33', top2='#6B4226', pants='#4A3526', sole='#3A2A20', hair='#E8E8E8', faces='f2/me', short=1, cane=1, beard='#E8E8E8', num=4)
VILA = [dict(skin='#F1C9A5', top='#E63946', pants='#2D3B55', hair='#7A4A2A', faces='f2/vm', short=1, num=37),
        dict(skin='#8B5A3C', top='#3A86FF', pants='#3A2A55', hair='#1B1212', faces='f2/vf', pigtails=1, skirt='/root/b3d/plaid.png', bow='#FFD23F', num=64),
        dict(skin='#E8B48A', top='#8338EC', pants='#5C4B3A', hair='#F0C34A', faces='f2/vf', bun=1, num=12),
        dict(skin='#C98E66', top='#FFD23F', pants='#2D3B55', hair='#2B1A10', faces='f2/vm', short=1, num=96),
        dict(skin='#F6E3D3', top='#FF5FA2', pants='#2D3B55', hair='#D9542B', faces='f2/vf', pigtails=1, skirt='/root/b3d/plaid.png', bow='#3A86FF', num=41),
        dict(skin='#8B5A3C', top='#22B573', pants='#2D3B55', hair='#1B1212', faces='f2/vm', short=1, num=36),
        dict(skin='#F1C9A5', top='#9AA0A8', pants='#3A3A40', hair='#5A3420', faces='f2/vm', short=1, num=99, beanie='#7A1E1E', beanie2='#E8E8E8'),
        dict(skin='#E8B48A', top='#F4A261', pants='#2D3B55', hair='#3A2316', faces='f2/vf', bun=1, num=53)]
def soft(ob, lvl=1):
    if ob is None: return
    for m in ob.modifiers:
        if m.type == 'BEVEL': m.width = max(m.width, 0.1); m.segments = 2
    sd = ob.modifiers.new('ss', 'SUBSURF'); sd.levels = lvl; sd.render_levels = lvl
def body_v2(av):
    # corpo estilo boneco moderno: braços arredondados, mãos com dedos, formas suaves
    name, o = av.name, av.o; sk = bpy.data.materials[name + '_skin']; top = bpy.data.materials[name + '_top']; top2 = bpy.data.materials[name + '_top2']
    for sd in ('L', 'R'):
        for k in ('arm', 'cuff', 'hand', 'palma', 'dedos', 'polegar'):
            ob = bpy.data.objects.get(f'{name}_{k}{sd}')
            if ob: bpy.data.objects.remove(ob, do_unlink=True)
    for sd, sx in (('L', 1), ('R', -1)):
        sh = av.J['arm' + sd]; sh.location.x = -sx * 0.70
        sphere(f'{name}_omb{sd}', 0.23, (0, 0, -0.04), top, sh, scale=(1, 1, 0.9))
        bpy.ops.mesh.primitive_cone_add(radius1=0.215, radius2=0.19, depth=0.62, vertices=24, location=(0, 0, -0.34)); a = bpy.context.object; a.name = f'{name}_braco{sd}'; a.parent = sh; a.data.materials.append(top); bpy.ops.object.shade_smooth()
        sphere(f'{name}_cot{sd}', 0.19, (0, 0, -0.63), top, sh, scale=(1, 1, 0.5))
        cyl(f'{name}_punho{sd}', 0.2, 0.09, (0, 0, -0.66), top2, sh, bevel=0.03)
        cyl(f'{name}_pulso{sd}', 0.1, 0.12, (0, 0, -0.73), sk, sh, bevel=0)
        p = cube(f'{name}_palma{sd}', (0.18, 0.31, 0.27), (sx * 0.01, 0, -0.85), sk, 0.06, sh); soft(p)
        for f in range(4):
            fy = -0.11 + f * 0.073
            seg1 = cyl(f'{name}_d{sd}{f}a', 0.044, 0.12, (sx * 0.02, fy, -1.0), sk, sh, verts=12, bevel=0)
            seg2 = cyl(f'{name}_d{sd}{f}b', 0.042, 0.1, (sx * 0.075, fy, -1.07), sk, sh, rot=(0, math.radians(sx * 55), 0), verts=12, bevel=0)
            for sg in (seg1, seg2): sphere(sg.name + 'p', 0.044, (sg.location.x, sg.location.y, sg.location.z - 0.055), sk, sh)
        cyl(f'{name}_pol{sd}', 0.05, 0.15, (sx * 0.07, -0.17, -0.87), sk, sh, rot=(math.radians(20), math.radians(sx * 35), 0), verts=12, bevel=0)
        sphere(f'{name}_polp{sd}', 0.05, (sx * 0.1, -0.2, -0.94), sk, sh)
    for k in ('torso', 'head', 'legL', 'legR', 'shoeL', 'shoeR', 'soleL', 'soleR', 'bag', 'hood', 'pocket'):
        soft(bpy.data.objects.get(f'{name}_{k}'))
def ball_head(av):
    # cabeça redonda (forma do Bolinha) com o rosto projetado na esfera
    name, o = av.name, av.o; neck = av.J['head']
    keep = {f'{name}_band2', f'{name}_cup-1', f'{name}_cup1', f'{name}_pad-1', f'{name}_pad1'} if o.get('phones') else set()
    for c in list(neck.children_recursive):
        if c.name not in keep: bpy.data.objects.remove(c, do_unlink=True)
    R0 = 0.56; base = o.get('headcol', o['skin'])
    m = bpy.data.materials.new(name + '_ballhead'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    c = tuple((int(base[i:i+2], 16) / 255) ** 2.2 for i in (1, 3, 5))
    b.inputs['Roughness'].default_value = 0.35; b.inputs['Coat Weight'].default_value = 0.3 if 'Coat Weight' in b.inputs else 0
    fe = empty(f'{name}_faceE', (0, -R0, 0.48), neck)
    tc = nt.nodes.new('ShaderNodeTexCoord'); tc.object = fe
    sp = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sp.inputs[0])
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MULTIPLY_ADD'; mx.inputs[1].default_value = 1 / 0.52; mx.inputs[2].default_value = 0.5; nt.links.new(sp.outputs['X'], mx.inputs[0])
    mz = nt.nodes.new('ShaderNodeMath'); mz.operation = 'MULTIPLY_ADD'; mz.inputs[1].default_value = 1 / 0.52; mz.inputs[2].default_value = 0.5; nt.links.new(sp.outputs['Z'], mz.inputs[0])
    cb = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(mx.outputs[0], cb.inputs[0]); nt.links.new(mz.outputs[0], cb.inputs[1])
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.extension = 'CLIP'; tx.image = bpy.data.images.load(f"{FACE_DIR}/{o['faces']}_feliz.png"); nt.links.new(cb.outputs[0], tx.inputs[0])
    fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'LESS_THAN'; fr.inputs[1].default_value = 0.25; nt.links.new(sp.outputs['Y'], fr.inputs[0])
    al = nt.nodes.new('ShaderNodeMath'); al.operation = 'MULTIPLY'; nt.links.new(tx.outputs['Alpha'], al.inputs[0]); nt.links.new(fr.outputs[0], al.inputs[1])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.inputs['A'].default_value = (*c, 1)
    nt.links.new(al.outputs[0], mix.inputs['Factor']); nt.links.new(tx.outputs['Color'], mix.inputs['B']); nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    av.face_node = tx
    h = sphere(f'{name}_head', R0, (0, 0, 0.48), m, neck, scale=(1, 0.96, 1.0))
    hm = mat(name + '_hair', o['hair'], 0.55)
    if o.get('beanie'):
        bm = mat(name + '_bean', o['beanie'], 0.85)
        sphere(f'{name}_beanie', R0 + 0.05, (0, 0.03, 0.8), bm, neck, scale=(1, 1, 0.62))
        cyl(f'{name}_beanieB', R0 + 0.02, 0.14, (0, 0.02, 0.8), mat(name + '_bean2', o.get('beanie2', '#FFFFFF'), 0.9), neck, bevel=0.05)
        sphere(f'{name}_pom', 0.15, (0, 0.03, 1.2), mat(name + '_pomm', o.get('beanie2', '#FFFFFF'), 0.95), neck)
    elif o.get('hair') and not o.get('bald'):
        cap = sphere(f'{name}_hairCap', R0 + 0.03, (0, 0.05, 0.56), hm, neck, scale=(1.02, 1.0, 0.92))
        bpy.ops.object.modifier_add(type='BOOLEAN') if False else None
        sphere(f'{name}_hairFr', 0.2, (0, -0.42, 0.9), hm, neck, scale=(2.2, 0.8, 0.7))
        if o.get('longhair') or o.get('pigtails') or o.get('bun'):
            cube(f'{name}_hairLong', (1.05, 0.4, 0.9), (0, 0.32, 0.32), hm, 0.18, neck)
        if o.get('bun'): sphere(f'{name}_bun', 0.24, (0, 0.2, 1.12), hm, neck)
        if o.get('pigtails'):
            for s_ in (-1, 1): sphere(f'{name}_tail{s_}', 0.22, (s_ * 0.62, 0.15, 0.25), hm, neck, scale=(0.85, 0.85, 2.0))
    if o.get('beard'): sphere(f'{name}_beard', 0.3, (0, -0.42, 0.18), mat(name + '_beardm', o['beard'], 0.9), neck, scale=(1.2, 0.6, 0.8))
    if o.get('glasses'):
        gm = mat('oculos', '#1A1A22', 0.3)
        for s_ in (-1, 1): bpy.ops.mesh.primitive_torus_add(major_radius=0.13, minor_radius=0.02, location=(s_ * 0.18, -0.57, 0.52), rotation=(math.pi / 2, 0, 0)); g = bpy.context.object; g.parent = neck; g.data.materials.append(gm)
def ball_hands(av):
    name, o = av.name, av.o; hm = mat(name + '_glove', o.get('glove', o['skin']), 0.45)
    for sd in ('L', 'R'):
        for k in ('palma', 'pol', 'polp'):
            ob = bpy.data.objects.get(f'{name}_{k}{sd}')
            if ob: bpy.data.objects.remove(ob, do_unlink=True)
        for ob in [x for x in bpy.data.objects if x.name.startswith(f'{name}_d{sd}')]: bpy.data.objects.remove(ob, do_unlink=True)
        sh = av.J['arm' + sd]
        sphere(f'{name}_luva{sd}', 0.2, (0, -0.02, -0.86), hm, sh, scale=(0.95, 1.05, 1.0))
        sphere(f'{name}_luvaP{sd}', 0.08, (0, -0.19, -0.8), hm, sh)
def make(name, o):
    av = Avatar(name, o); add_extras(av)
    for nm in (f'{name}_band', f'{name}_cntP'):
        ob = bpy.data.objects.get(nm)
        if ob: bpy.data.objects.remove(ob, do_unlink=True)
    sc = o.get('headsc', 1.0); av.J['head'].scale = (sc, sc, sc)
    if o.get('spiky'):
        hm = bpy.data.materials[name + '_hair']; neck = av.J['head']
        for i, (x, y, rx, ry) in enumerate(((-0.22, -0.05, -15, -20), (0.0, -0.1, -20, 0), (0.22, -0.05, -15, 20), (-0.12, 0.2, 15, -12), (0.14, 0.22, 18, 12))):
            bpy.ops.mesh.primitive_cone_add(radius1=0.2, depth=0.42, vertices=6, location=(x, y, 1.04), rotation=(math.radians(rx), math.radians(ry), 0))
            c = bpy.context.object; c.name = f'{name}_sp2{i}'; c.data.materials.append(hm); c.parent = neck
            md = c.modifiers.new('bv', 'BEVEL'); md.width = 0.04; md.segments = 2
    av.blink_t = 0
    av._post_ball = True
    if o.get('collar'): bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.11, location=(0, 0, 2.0)); cc = bpy.context.object; cc.name = name + '_gola'; cc.parent = av.root; cc.data.materials.append(bpy.data.materials[name + '_top2']); bpy.ops.object.shade_smooth()
    tor = bpy.data.objects.get(f'{name}_torso')
    if tor: tor.scale = (1.06, 1.0, 1.0)
    if o.get('messy'):
        hm = bpy.data.materials[name + '_hair']; neck = av.J['head']
        for nm in (f'{name}_spike0', f'{name}_spike1', f'{name}_spike2', f'{name}_spike3'):
            ob = bpy.data.objects.get(nm)
            if ob: bpy.data.objects.remove(ob, do_unlink=True)
        import random as _r; rr = _r.Random(11)
        for i in range(16):
            x = -0.36 + (i % 4) * 0.24 + rr.uniform(-0.04, 0.04); y = -0.3 + (i // 4) * 0.2
            bpy.ops.mesh.primitive_cone_add(radius1=0.17, depth=0.5 + rr.uniform(0, 0.15), vertices=4, location=(x, y, 0.98),
                rotation=(math.radians(-55 + (i // 4) * 22 + rr.uniform(-8, 8)), math.radians(x * 50 + rr.uniform(-10, 10)), math.radians(45)))
            c = bpy.context.object; c.name = f'{name}_mess{i}'; c.data.materials.append(hm); c.parent = neck
            md = c.modifiers.new('bv', 'BEVEL'); md.width = 0.04; md.segments = 2
        for s_ in (-1, 1):
            bpy.ops.mesh.primitive_cone_add(radius1=0.15, depth=0.45, vertices=4, location=(s_ * 0.36, -0.28, 0.82), rotation=(math.radians(-70), math.radians(s_ * 35), math.radians(45)))
            c = bpy.context.object; c.name = f'{name}_fran{s_}'; c.data.materials.append(hm); c.parent = neck
    if o.get('necklace'):
        root = av.root
        for s_ in (-1, 1): cyl(f'{name}_colar{s_}', 0.012, 0.36, (s_ * 0.1, -0.27, 1.86), mat('colarC', '#D8D8D8', 0.3, 0.8), root, rot=(0, math.radians(s_ * -30), 0), bevel=0)
        cube(f'{name}_gema', (0.11, 0.05, 0.15), (0, -0.29, 1.7), mat('gema', '#22E37A', 0.15, emit='#22E37A', es=2), 0.02, root)
    if o.get('nobolt'):
        ob = bpy.data.objects.get(f'{name}_bolt')
        if ob: bpy.data.objects.remove(ob, do_unlink=True)
    if o.get('ball', 1): ball_head(av); av._ball = True; av._fc = None; av.face('feliz')
    return av
def toonify(avs, thick=2.6):
    # estilo cartoon: contorno escuro (Freestyle só nos personagens) + materiais foscos e chapados
    S = bpy.context.scene; col = bpy.data.collections.get('toon') or bpy.data.collections.new('toon')
    if col.name not in S.collection.children: S.collection.children.link(col)
    mats = set()
    for a in avs:
        objs = [a.root] + list(a.root.children_recursive)
        for ob in objs:
            if ob.name not in col.objects and not ob.name.endswith('_numP'): col.objects.link(ob)
            if ob.type == 'MESH':
                for m in ob.data.materials:
                    if m: mats.add(m)
    for m in mats:
        b = m.node_tree.nodes.get('Principled BSDF') if m.use_nodes else None
        if not b: continue
        if not m.name.endswith('_ballhead'): b.inputs['Roughness'].default_value = 0.9
        if 'Specular IOR Level' in b.inputs: b.inputs['Specular IOR Level'].default_value = 0.15 if not m.name.endswith('_ballhead') else 0.35
    # contorno por "casca invertida" (barato no Cycles)
    om = bpy.data.materials.get('contorno')
    if not om:
        om = bpy.data.materials.new('contorno'); om.use_nodes = True; nt = om.node_tree; nt.nodes.clear()
        out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (0.03, 0.012, 0.035, 1); em.inputs['Strength'].default_value = 1
        tr = nt.nodes.new('ShaderNodeBsdfTransparent'); gm = nt.nodes.new('ShaderNodeNewGeometry'); mx = nt.nodes.new('ShaderNodeMixShader')
        lp = nt.nodes.new('ShaderNodeLightPath'); inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1; nt.links.new(lp.outputs['Is Camera Ray'], inv.inputs[1])
        mxm = nt.nodes.new('ShaderNodeMath'); mxm.operation = 'MAXIMUM'; nt.links.new(gm.outputs['Backfacing'], mxm.inputs[0]); nt.links.new(inv.outputs[0], mxm.inputs[1])
        nt.links.new(mxm.outputs[0], mx.inputs[0]); nt.links.new(em.outputs[0], mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs['Surface'])
    for a in avs:
        for ob in [a.root] + list(a.root.children_recursive):
            if ob.type != 'MESH' or ob.name.endswith('_numP') or ob.name.endswith('_faceP') or ob.name.endswith('_bolt') or 'cord' in ob.name: continue
            if 'contorno' in ob.data.materials: continue
            n = len(ob.data.materials); ob.data.materials.append(om)
            sd = ob.modifiers.new('contorno', 'SOLIDIFY'); sd.thickness = thick * 0.012; sd.offset = 1; sd.use_flip_normals = True; sd.material_offset = n; sd.use_rim = False
    S.render.use_freestyle = False
