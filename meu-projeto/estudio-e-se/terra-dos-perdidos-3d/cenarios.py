import bpy, math, random
from mundo import *
rnd = random.Random(4)
def madeira(name, c1='#8a5a34', c2='#6e4426', esc=3.0):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    w = nt.nodes.new('ShaderNodeTexWave'); w.inputs['Scale'].default_value = esc; w.inputs['Distortion'].default_value = 6; w.bands_direction = 'X'
    cr = nt.nodes.new('ShaderNodeValToRGB'); h = lambda c: tuple((int(c[i:i+2], 16) / 255) ** 2.2 for i in (1, 3, 5)) + (1,)
    cr.color_ramp.elements[0].color = h(c2); cr.color_ramp.elements[1].color = h(c1)
    nt.links.new(w.outputs['Fac'], cr.inputs[0]); nt.links.new(cr.outputs[0], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.55
    return m
def piso(ox, oy, w=40, d=40, nome='piso'):
    for i in range(int(w / 1.2)): cube(f'{nome}{ox}_{i}', (1.18, d, 0.2), (ox - w / 2 + i * 1.2 + 0.6, oy, -0.1), madeira('madeiraPiso', '#b07a48', '#8d5c33', 2.5), 0.02)
def debaixo_cama(ox=0):
    """cidade dos perdidos debaixo da cama (estrado em cima, luzinhas, prédios de livros)"""
    piso(ox, 6, 40, 30, 'pisoDC')
    estr = madeira('madeiraEstr', '#5a3a26', '#3d2617', 1.5)
    for i in range(14): cube(f'ripa{i}', (40, 0.9, 0.25), (ox, -4 + i * 1.3, 7.0), estr, 0.03)
    cube('colchao', (40, 20, 1.2), (ox, 4, 7.8), mat('colchao', '#2f3d6b', 0.9), 0.1)
    cores = ['#e63946', '#3a86ff', '#f4a261', '#2a9d8f', '#8338ec', '#e9c46a', '#ff70a6']
    for i in range(9):
        x = ox - 9 + i * 2.3 + rnd.uniform(-0.3, 0.3); y = 9 + rnd.uniform(-1, 2); h = rnd.uniform(2.5, 5.5)
        for k in range(int(h / 0.55)):
            c = cores[(i * 3 + k) % 7]; cube(f'livro{i}_{k}', (1.9 + rnd.uniform(-0.2, 0.2), 1.4, 0.5), (x, y, 0.27 + k * 0.55), mat('livro' + c, c, 0.6), 0.04, rot=(0, 0, R(rnd.uniform(-6, 6))))
            if k % 2 == 1: cube(f'jan{i}_{k}', (0.35, 0.05, 0.22), (x + rnd.choice((-0.45, 0, 0.45)), y - 0.72, 0.27 + k * 0.55), emis('janelaQuente', '#ffcf7a', 4), 0.01)
    # caixa de fósforo e carretel
    cube('fosforo', (2.2, 1.2, 1.4), (ox + 7, 5, 0.7), mat('fosforoM', '#d62828', 0.5), 0.06); cyl('carretel', 0.7, 1.6, (ox - 7.5, 5.5, 0.8), mat('carretelM', '#c8a26a', 0.6))
    cyl('linha', 0.55, 1.2, (ox - 7.5, 5.5, 0.8), mat('linhaM', '#2ec4b6', 0.9))
    # varal de luzinhas
    for k in range(3):
        y = 2 + k * 3.5
        for i in range(26):
            x = ox - 13 + i; z = 6.4 - 0.6 * math.sin(math.pi * i / 25) - k * 0.2
            sphere(f'luz{k}_{i}', 0.09, (x, y, z), emis('luz' + str(i % 3), ['#ffd23f', '#ff70a6', '#4cc9f0'][i % 3], 12))
    for i in range(14): sphere(f'poeira{i}', rnd.uniform(0.25, 0.6), (ox + rnd.uniform(-12, 12), rnd.uniform(0, 12), 0.2), mat('poeiraM', '#bdb2c9', 1.0), scale=(1, 1, 0.55))
    # feixe de luz da fresta (falso volumétrico)
    m = bpy.data.materials.new('feixe'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); o = nt.nodes.new('ShaderNodeOutputMaterial'); e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (1, 0.85, 0.55, 1); e.inputs['Strength'].default_value = 0.6
    t = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader'); mx.inputs[0].default_value = 0.85; nt.links.new(e.outputs[0], mx.inputs[1]); nt.links.new(t.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], o.inputs[0])
    bpy.ops.mesh.primitive_cone_add(radius1=2.5, radius2=0.3, depth=8, location=(ox + 9, 2, 3.5), rotation=(0, R(-25), 0)); f = bpy.context.object; f.name = 'feixe'; f.data.materials.append(m); f.visible_shadow = False
def lavanderia(ox=100):
    piso(ox, 4, 30, 20, 'pisoLav')
    cube('paredeLav', (30, 0.4, 14), (ox, 9, 7), mat('azulejo', '#bfe3f2', 0.3), 0)
    for i in range(16):
        for j in range(8): cube(f'rej{i}_{j}', (1.7, 0.42, 0.04), (ox - 14 + i * 1.8, 8.99, 0.9 + j * 1.8), mat('rejunte', '#e8f6fb', 0.5), 0) if j % 1 == 0 and i == -1 else None
    cube('maquina', (5, 4, 6), (ox, 6.5, 3), mat('maquinaB', '#f5f6f8', 0.25), 0.3)
    cyl('portaAro', 1.7, 0.3, (ox, 4.45, 2.8), mat('cromado', '#c9cfd6', 0.15, 0.9), rot=(R(90), 0, 0))
    vm = bpy.data.materials.new('vidroM'); vm.use_nodes = True; nt = vm.node_tree; nt.nodes.clear(); o_ = nt.nodes.new('ShaderNodeOutputMaterial'); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); gl = nt.nodes.new('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = 0.05
    fr = nt.nodes.new('ShaderNodeLayerWeight'); fr.inputs['Blend'].default_value = 0.25; mx = nt.nodes.new('ShaderNodeMixShader'); nt.links.new(fr.outputs['Fresnel'], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(gl.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], o_.inputs[0])
    cyl('portaVidro', 1.45, 0.06, (ox, 4.3, 2.8), vm, rot=(R(90), 0, 0))
    cyl('tamborFundo', 1.5, 0.1, (ox, 6.2, 2.8), mat('tamborF', '#3d5a80', 0.4, 0.6), rot=(R(90), 0, 0))
    tambor = empty('tambor', (ox, 5.2, 2.8))
    for i in range(10): a = i * 0.63; sphere(f'roupa{i}', rnd.uniform(0.4, 0.7), (math.cos(a) * 0.9, 0, math.sin(a) * 0.9), mat('roupa' + str(i % 5), ['#ff9f1c', '#2ec4b6', '#e71d36', '#9b5de5', '#f15bb5'][i % 5], 0.8), tambor, scale=(1.4, 1, 0.7))
    cube('painel', (4.6, 0.3, 0.9), (ox, 4.55, 5.4), mat('painelM', '#2b2d42', 0.3), 0.1)
    cube('visor', (1.4, 0.05, 0.45), (ox - 1.2, 4.38, 5.4), emis('visorV', '#7bf1a8', 3), 0.02)
    cube('cesto', (2.6, 2, 2), (ox + 5, 5, 1), mat('cestoM', '#d4a373', 0.8), 0.15)
    return tambor
def quarto(ox=200):
    piso(ox, 4, 40, 30, 'pisoQ')
    cube('paredeQ', (40, 0.4, 30), (ox, 14, 15), mat('paredeQM', '#ffd6a5', 0.9), 0)
    cube('cama', (14, 10, 2.4), (ox - 9, 8, 4.2), madeira('madeiraEstr', '#5a3a26', '#3d2617', 1.5), 0.2); cube('colchaoQ', (14, 10, 1.4), (ox - 9, 8, 6.1), mat('colchao', '#2f3d6b', 0.9), 0.3)
    for s in (-1, 1): cube(f'pecama{s}', (0.6, 0.6, 3), (ox - 9 + s * 6.6, 3.4, 1.5), madeira('madeiraEstr'), 0.05)
    cube('comoda', (8, 5, 12), (ox + 8, 10.5, 6), madeira('madeiraCom', '#d9a87c', '#b98757', 2), 0.15)
    g = cube('gaveta', (7.2, 5, 2.4), (ox + 8, 9.2, 10.2), madeira('madeiraCom'), 0.1)
    for z in (6.5, 3.2): cube(f'gavF{z}', (7.2, 0.2, 2.6), (ox + 8, 7.95, z), madeira('madeiraCom'), 0.08); sphere(f'pux{z}', 0.25, (ox + 8, 7.8, z), mat('ouro', '#ffc533', 0.25, 0.9))
    cube('relogio', (3, 1, 1.4), (ox + 8, 9, 12.7), mat('relogioM', '#2b2d42', 0.3), 0.15); cube('relVisor', (2.4, 0.05, 0.9), (ox + 8, 8.48, 12.7), emis('relV', '#ff3355', 4), 0.02)
    return g

def gaveta_dentro(ox=300):
    cube('gavFundo', (12, 9, 0.3), (ox, 4, -0.15), madeira('madeiraCom', '#d9a87c', '#b98757', 2), 0.05)
    for s_, (sx, sy, w, d) in enumerate(((ox, -0.6, 12, 0.4), (ox, 8.6, 12, 0.4), (ox - 6, 4, 0.4, 9.6), (ox + 6, 4, 0.4, 9.6))): cube(f'gavLado{s_}', (w, d, 2.4), (sx, sy, 1.1), madeira('madeiraCom'), 0.05)
    cores = [('#4cc9f0', '#ffffff'), ('#ffd23f', '#ff9f1c'), ('#80ed99', '#ffffff'), ('#2b2d42', '#6c757d')]
    for i, (a, b) in enumerate(cores):
        x = ox - 3.5 + (i % 2) * 7 - (1.5 if i % 2 else 0); y = 1.5 + (i // 2) * 4.5
        if i in (1,): continue
        o = cube(f'meiaDobrada{i}', (2.6, 1.6, 0.6), (x, y + 1.6, 0.32), listras(f'dobr{i}', a, b, 3, 'X'), 0.25); smooth(o, 1)
