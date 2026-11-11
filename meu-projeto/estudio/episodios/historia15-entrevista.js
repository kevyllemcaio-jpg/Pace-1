// HISTÓRIA 15 — A ENTREVISTA
historia({ visual: { pele: '#C98B62', pele2: '#A8714C', cabelo: '#2B1D16', camisa: '#2F6DB5' } });
const DIRETOR = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#8A8A90', camisa: '#2A2A3A', oculos: true };
H.push(
  ganchoH('Ele furou a fila e xingou um senhor de manhã. Às dez, o senhor era o *entrevistador*.', [['XINGUEI UM CARA NA FILA'], ['ÀS 10H ELE ERA'], ['MEU ENTREVISTADOR', '#F7C531']], { fundo: 'escritorio' }),
  corpoH('Sete da manhã, fila da padaria. O Vitor tava atrasado pra entrevista do *emprego dos sonhos*.', { fundo: 'mercado', pose: 'cintura', expr: 'determinado', relogio: '07:00' }),
  closeH('Furou a fila. Um senhor de terno reclamou. E o Vitor respondeu: *cuida da sua vida*, tio.', { fundo: 'mercado', expr: 'determinado', troca: { palavra: 'cuida', expr: 'feliz' }, extra: (lt, c) => cardH(lt, c, { palavra: 'cuida', texto: '"CUIDA DA SUA VIDA"', cor: '#E8344B' }) }),
  corpoH('Dez horas. Sala de entrevista. A porta abre...', { fundo: 'escritorio', pose: 'base', expr: 'sorrisao', relogio: '10:00' }),
  outroH('...e entra o senhor de terno. *Diretor da empresa*.', DIRETOR, { fundo: 'escritorio', expr: 'determinado', falando: false, extra: (lt, c) => cardH(lt, c, { palavra: 'diretor', texto: 'DIRETOR', emoji: '👔' }) }),
  outroH('Ele senta, abre o currículo e diz: então, Vitor... *cuida da sua vida*?', DIRETOR, { fundo: 'escritorio', expr: 'determinado' }),
  closeH('O Vitor *gelou*.', { fundo: 'escritorio', expr: 'panico', suor: true }),
  votacaoH('O que ele faz? A: pede desculpas de verdade. B: finge que não era ele.', { rotulo: 'PEDE DESCULPAS', emoji: '🙏', expr: 'vergonha' }, { rotulo: 'FINGE QUE NÃO ERA ELE', emoji: '😎', pose: 'cintura', expr: 'determinado' }),
  finalH('escritorio'),
);
fecharHistoria({ capa: capaH({ fundo: 'escritorio', l1: 'XINGUEI O DIRETOR', l2: 'ANTES DA ENTREVISTA', etiqueta: 'VAGA DOS SONHOS' }) });
