def inserir(pasta, pares):  # pares: [(trecho_da_fala_âncora, [linhas novas]), ...] insere depois da âncora
    arq = pasta + '/roteiro.txt'; L = open(arq, encoding='utf8').read().rstrip('\n').split('\n')
    for anc, novas in pares:
        i = [k for k, l in enumerate(L) if anc in l]
        assert len(i) == 1, (anc, len(i))
        L[i[0] + 1:i[0] + 1] = novas
    open(arq, 'w', encoding='utf8').write('\n'.join(L) + '\n'); print(pasta, len([l for l in L if l and not l.startswith('#')]))
