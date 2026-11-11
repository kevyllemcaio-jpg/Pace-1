// HISTÓRIA 19 — O GPS
historia({ visual: { pele: '#C68E62', pele2: '#A8714C', cabelo: '#4A2E1E', camisa: '#D93A3A' } });
const carroNoLago = (lt, afunda = 0) => `<g transform="translate(540 ${1180 + afunda * 80 + Math.sin(lt * 2) * 8}) rotate(${Math.sin(lt * 1.5) * 3})"><path d="M -260 -20 L -230 -100 Q -215 -125 -175 -125 L -80 -125 L -30 -190 Q -15 -205 25 -205 L 140 -205 Q 180 -205 205 -165 L 245 -115 Q 270 -110 270 -80 L 270 -20 Z" fill="#E8344B" stroke="#1F1A24" stroke-width="8"/><path d="M -10 -180 L 25 -188 L 125 -188 L 175 -125 L -50 -125 Z" fill="#9FD3F0" stroke="#1F1A24" stroke-width="6"/></g><rect y="1170" width="1080" height="750" fill="#3A8FC8" opacity="0.85"/>`;
const ilha = (lt) => `<ellipse cx="820" cy="1000" rx="200" ry="40" fill="#6BBA66" stroke="#1F1A24" stroke-width="6"/><rect x="760" y="880" width="120" height="110" fill="#E9D8B8" stroke="#1F1A24" stroke-width="6"/><path d="M 740 890 L 820 820 L 900 890 Z" fill="#B5452F" stroke="#1F1A24" stroke-width="6"/><rect x="800" y="920" width="40" height="40" fill="#F7E7A0" opacity="${0.7 + 0.3 * Math.sin(lt * 5)}"/>`;
HS.push(
  ganchoH('O GPS mandou virar à esquerda... *dentro do lago*. E ele obedeceu.', [['O GPS MANDOU'], ['VIRAR À ESQUERDA'], ['DENTRO DO LAGO', '#F7C531']], { fundo: (lt) => fundoLago(lt) + carroNoLago(lt) }),
  corpoH('Onze da noite, estrada nova. O Marcos seguia o GPS de olho fechado.', { fundo: 'noite', pose: 'celular', celular: true, expr: 'sono', relogio: '23:00' }),
  chatH('Vire à esquerda em cinquenta metros. Ele virou. E o carro *mergulhou*.', { nome: 'GPS • navegação', hora: '23:07', msgs: [{ de: 'ela', txt: '↰ Vire à esquerda em 50 m' }, { de: 'ela', txt: '↰ Vire à esquerda AGORA', em: 'virou' }] }),
  closeH('Splash. O carro boiando no meio do lago. E o GPS, todo feliz: *você chegou ao seu destino*.', { fundo: (lt) => fundoLago(lt) + carroNoLago(lt, 0.5), expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'chegou', texto: 'VOCÊ CHEGOU!', emoji: '📍', cor: '#1E9E4A' }) }),
  closeH('Aí ele olha pro lado... e no meio do lago tem uma *ilha*. Com uma casa. De *luz acesa*.', { fundo: (lt) => fundoLago(lt) + ilha(lt), expr: 'surpreso', olhar: [1, -0.3] }),
  votacaoH('O que ele faz? A: nada até a ilha. B: chama o guincho e vai embora.', { rotulo: 'NADA ATÉ A ILHA', emoji: '🏊', expr: 'determinado' }, { rotulo: 'CHAMA O GUINCHO', emoji: '🚛', pose: 'celular' }),
  finalH((lt) => fundoLago(lt) + ilha(lt)),
);
fecharHistoria({ capa: capaH({ fundo: (lt) => fundoLago(lt) + carroNoLago(0.4), l1: 'O GPS ME MANDOU', l2: 'PRO LAGO 🚗💦', etiqueta: 'VOCÊ CHEGOU' }) });
