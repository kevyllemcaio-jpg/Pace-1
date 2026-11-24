# capitulos.py <pasta>: capítulos do YouTube a partir dos cartões DESAFIO e das etiquetas de lugar
import sys, subprocess, re
sys.path.insert(0, '/root/vid/serie16'); import motor
d = sys.argv[1]; lin = motor.ler_roteiro(d + '/roteiro.txt')
out = subprocess.run(['python3', 'cenas.py', 'info'], cwd=d, capture_output=True, text=True).stdout
ini = {}
for l in out.split('\n'):
    m = re.match(r'\s*(\d+)\s+([\d.]+)-', l)
    if m: ini[int(m.group(1))] = float(m.group(2))
caps = [(0.0, 'Início')]
for i, (tipo, p, _) in enumerate(lin):
    if tipo == 'desafio': caps.append((ini[i], f"Desafio {p.get('n')}: {p.get('titulo', '').replace('_', ' ').capitalize()}"))
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
print('\n'.join(f'{fmt(s)} {n}' for s, n in caps))
