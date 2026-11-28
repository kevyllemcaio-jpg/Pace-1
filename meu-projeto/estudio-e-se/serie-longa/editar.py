# editar(pasta, ops): ops = {indice: None (apaga) | 'linha' (troca) | ['linha', ...] (troca por várias)}; '+N' insere depois de N
def editar(pasta, ops):
    arq = pasta + '/roteiro.txt'; raw = open(arq, encoding='utf8').read().split('\n')
    cab = [l for l in raw if l.startswith('#')]; L = [l for l in raw if l.strip() and not l.startswith('#')]
    out = []
    for i, l in enumerate(L):
        v = ops.get(i, l)
        if v is None: pass
        elif isinstance(v, list): out += v
        else: out.append(v)
        if f'+{i}' in ops: out += ops[f'+{i}'] if isinstance(ops[f'+{i}'], list) else [ops[f'+{i}']]
    open(arq, 'w', encoding='utf8').write('\n'.join(cab + out) + '\n'); print(pasta, len(L), '->', len(out))
