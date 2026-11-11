// HISTÓRIA 8 — A CASA QUE CRESCE
historia({ visual: { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#4A2E1E', camisa: '#5B6475' } });
function portaNome(lt, c, t0) {
  if (lt < t0) return '';
  return pulo(`<g transform="translate(540 820)"><rect x="-170" y="-330" width="340" height="660" rx="10" fill="#6B4228" stroke="#1F1A24" stroke-width="10"/><rect x="-120" y="-260" width="240" height="80" rx="8" fill="#F7E7A0" stroke="#1F1A24" stroke-width="5"/><text x="0" y="-205" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="52" fill="#1F1A24">GABRIEL</text><circle cx="120" cy="20" r="18" fill="#F7C531" stroke="#1F1A24" stroke-width="5"/><rect x="-170" y="300" width="340" height="30" fill="#F7E7A0" opacity="${0.5 + 0.4 * Math.sin(lt * 6)}"/></g>`, lt, 540, 820, t0);
}
HS.push(
  ganchoH('Toda noite aparece um *cômodo novo* na casa dele. Hoje apareceu uma porta... com o *nome dele*.', [['TODA NOITE APARECE'], ['UM CÔMODO NOVO'], ['NA MINHA CASA', '#F7C531']], { fundo: 'corredor' }),
  corpoH('O Gabriel mora sozinho num apartamento de dois cômodos. Pelo menos *morava*.', { fundo: 'corredor', pose: 'base', expr: 'neutro', troca: { palavra: 'morava', expr: 'surpreso' } }),
  closeH('Segunda: apareceu um banheiro. Terça: uma cozinha. Quarta: uma escada... *pra cima*. Num térreo.', { fundo: 'corredor', expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'cima', texto: 'ESCADA NUM TÉRREO', emoji: '🪜' }) }),
  corpoH('Hoje tem uma porta nova no fim do corredor. Escrito: *Gabriel*.', { fundo: 'corredor', pose: 'aponta', expr: 'panico', extra: (lt, c) => portaNome(lt, c, c.w('gabriel')) }),
  closeH('E do outro lado dá pra ouvir alguém... *chamando o nome dele*.', { fundo: 'corredor', expr: 'surpreso', troca: { palavra: 'chamando', expr: 'panico', suor: true, tremer: true } }),
  votacaoH('O que ele faz? A: abre a porta. B: tranca tudo e muda de casa hoje.', { rotulo: 'ABRE A PORTA', emoji: '🚪', expr: 'determinado' }, { rotulo: 'MUDA DE CASA', emoji: '📦' }),
  finalH('corredor'),
);
fecharHistoria({ capa: capaH({ fundo: 'corredor', l1: 'MINHA CASA', l2: 'GANHA 1 CÔMODO POR NOITE', etiqueta: '+1 PORTA' }) });
