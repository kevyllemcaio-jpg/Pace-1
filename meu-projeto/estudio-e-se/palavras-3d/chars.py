import bpy, math
from lib import *
def img_mat(name, path, rough=0.6, emit=0.0, alpha=True, repeat=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path)
    if repeat:
        tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (repeat, repeat, 1)
        nt.links.new(tc.outputs['UV'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], t.inputs['Vector'])
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if alpha: nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    if emit: nt.links.new(t.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emit
    b.inputs['Roughness'].default_value = rough
    return m
def avatar(name, o, loc=(0, 0, 0), rotz=0):
    """personagem de blocos (estilo R6 próprio). z para cima; altura ~2.6"""
    root = empty(name, loc); root.rotation_euler[2] = rotz
    skin = mat(name + '_skin', o.get('skin', '#F4F0EA'), 0.45)
    top = mat(name + '_top', o['top'], 0.75); pants = mat(name + '_pants', o['pants'], 0.75); shoes = mat(name + '_shoes', o.get('shoes', '#F5F5F5'), 0.5)
    J = {}
    for s, nm in ((-1, 'L'), (1, 'R')):
        hip = empty(f'{name}_hip{nm}', (s * 0.25, 0, 1.0), root); J['leg' + nm] = hip
        cube(f'{name}_leg{nm}', (0.48, 0.48, 0.92), (0, 0, -0.5), pants, 0.04, hip)
        cube(f'{name}_shoe{nm}', (0.5, 0.56, 0.16), (0, -0.03, -0.92), shoes, 0.04, hip)
    torso = cube(f'{name}_torso', (0.98, 0.5, 0.98), (0, 0, 1.5), top, 0.05, root)
    if o.get('skirt'): cube(f'{name}_skirt', (1.1, 0.62, 0.5), (0, 0, 0.98), img_mat(name + '_plaid', '/root/b3d/plaid.png', 0.7, alpha=False, repeat=2), 0.05, root)
    if o.get('socks'): [cube(f'{name}_sock{s}', (0.5, 0.5, 0.36), (s * 0.25, 0, 0.26), mat(name + '_sockm', o['socks'], 0.7), 0.04, root) for s in (-1, 1)]
    if o.get('pocket'): cube(f'{name}_pocket', (0.56, 0.06, 0.26), (0, -0.26, 1.25), mat(name + '_top2', o['pocket'], 0.75), 0.03, root)
    for s, nm in ((-1, 'L'), (1, 'R')):
        sh = empty(f'{name}_sh{nm}', (s * 0.74, 0, 1.92), root); J['arm' + nm] = sh
        cube(f'{name}_arm{nm}', (0.46, 0.46, 0.7), (0, 0, -0.33), top, 0.04, sh)
        cube(f'{name}_hand{nm}', (0.44, 0.44, 0.26), (0, 0, -0.82), skin, 0.06, sh)
        if nm == 'L' and o.get('counter'):
            cube(f'{name}_band', (0.5, 0.5, 0.14), (0, 0, -0.66), mat('band', '#16161c', 0.3), 0.02, sh)
            plane(f'{name}_cnt', (0.42, 0.16), (0, -0.252, -0.66), img_mat(name + '_cntm', o['counter'], 0.3, emit=2.0, alpha=False), rot=(math.pi / 2, 0, 0), parent=sh)
    neck = empty(f'{name}_neck', (0, 0, 2.0), root); J['head'] = neck
    head = cyl(f'{name}_head', 0.36, 0.62, (0, 0, 0.36), skin, neck, verts=48, bevel=0.12)
    head.scale = (1.0, 0.92, 1.0)
    fm = img_mat(name + '_face', o['face'], 0.5)
    plane(f'{name}_faceP', (0.6, 0.6), (0, -0.335, 0.36), fm, rot=(math.pi / 2, 0, 0), parent=neck)
    if o.get('hat') == 'ushanka':
        hm = mat(name + '_hat', o['hatcol'], 0.85); fur = mat(name + '_fur', o['furcol'], 0.95)
        cube(f'{name}_hatTop', (0.86, 0.82, 0.36), (0, 0.02, 0.78), hm, 0.12, neck)
        cube(f'{name}_hatBrim', (0.9, 0.2, 0.2), (0, -0.36, 0.64), fur, 0.08, neck)
        for s in (-1, 1): cube(f'{name}_flap{s}', (0.16, 0.66, 0.62), (s * 0.42, 0.04, 0.38), hm, 0.08, neck)
    if o.get('hair') == 'pigtails':
        hm = mat(name + '_hair', o['haircol'], 0.6)
        cube(f'{name}_hairTop', (0.82, 0.78, 0.3), (0, 0.03, 0.73), hm, 0.12, neck)
        cube(f'{name}_hairBack', (0.8, 0.22, 0.7), (0, 0.3, 0.42), hm, 0.1, neck)
        cube(f'{name}_fringe', (0.76, 0.12, 0.2), (0, -0.33, 0.62), hm, 0.06, neck)
        for s in (-1, 1):
            cube(f'{name}_side{s}', (0.1, 0.6, 0.5), (s * 0.38, 0.02, 0.48), hm, 0.05, neck)
            tail = sphere(f'{name}_tail{s}', 0.24, (s * 0.56, 0.16, 0.05), hm, neck, scale=(0.85, 0.85, 2.3))
            cube(f'{name}_tie{s}', (0.18, 0.18, 0.1), (s * 0.48, 0.18, 0.52), mat(name + '_tie', o.get('tiecol', '#ff5fa2'), 0.4), 0.03, neck)
    return root, J
BOY = dict(top='#F2B705', pocket='#E0A800', pants='#7A4A2A', face='/root/b3d/face_boy.png', hat='ushanka', hatcol='#D62839', furcol='#3A2A2A', counter='/root/b3d/cnt_boy.png')
GIRL = dict(top='#7B3FB8', skirt='PLAID', pants='#F6E3D3', shoes='#2B1B1E', face='/root/b3d/face_girl.png', hair='pigtails', haircol='#3A2316', socks='#F5F5F5', counter='/root/b3d/cnt_girl.png', skin='#F6E3D3')
