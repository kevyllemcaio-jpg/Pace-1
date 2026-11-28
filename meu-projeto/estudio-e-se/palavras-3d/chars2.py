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
