// VÍDEO 1/16 — E SE você SALVASSE a sua escola? (versão incêndio, sem violência) — horizontal 16:9, ~10 min
// O Léo percebe fumaça no laboratório de química, o alarme não toca, ninguém acredita de primeira.
// Ele pega o extintor, guia a turma pela rota do pátio e salva todo mundo. No fim, a escola comemora
// o "alarme automático" e ninguém lembra de quem deu o aviso.

window.LARGURA = 1920;
window.ALTURA = 1080;
window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1030;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = 'seco';
window.ENCURTAR_PAUSAS = true;
window.TRILHA = 'alegre';

const V = {
  narr: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '+2%' }, cor: '#F4EEDC', rotulo: 'NARRADOR' },
  leo: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '+8%', tom: '+3Hz' }, cor: '#7FC8FF', rotulo: 'LÉO' },
  bia: { voz: { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+6%' }, cor: '#F2A0C8', rotulo: 'BIA' },
  ana: { voz: { voz: 'pt-BR-FranciscaNeural', velocidade: '+4%' }, cor: '#D8B8FF', rotulo: 'PROFESSORA ANA' },
  nilton: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '-2%', tom: '-6Hz' }, cor: '#FFD36A', rotulo: 'SEU NILTON' },
  bombeiro: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '+4%', tom: '-3Hz' }, cor: '#FF8A5A', rotulo: 'BOMBEIRO' },
  menino: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '+10%', tom: '+6Hz' }, cor: '#A8E0FF', rotulo: 'MENINO DO AUDITÓRIO' },
  mae: { voz: { voz: 'pt-BR-FranciscaNeural', velocidade: '+4%' }, cor: '#F2B8D0', rotulo: 'MÃE DA BIA' },
  diretor: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '-2%', tom: '-2Hz' }, cor: '#9BE89B', rotulo: 'DIRETOR' },
};

const E = [];
const falando = (c, lt) => !!c.fala && c.tempos && c.tempos.length > 0 && lt > c.tempos[0] - 0.05 && lt < c.tempos[c.tempos.length - 1] + 0.3;

// Cena: fala (quem fala, ou 'narr'), cenário e personagens
function cena(quem, fala, desenhar, o = {}) {
  const v = V[quem];
  E.push({
    fala, dur: o.dur || 0.6, voz: v.voz, corLegenda: v.cor, rotulo: v.rotulo, trilha: o.trilha,
    desenhar(lt, c) {
      let s = desenhar(lt, c, falando(c, lt));
      if (o.tela) s += o.tela(lt, c);
      return s;
    },
  });
}
// Cena sem fala (ambiente)
function silencio(dur, desenhar, o = {}) {
  E.push({ fala: null, dur, desenhar: (lt, c) => desenhar(lt, c), trilha: o.trilha });
}

// ============ ABERTURA ============
cena('narr', 'E se você fosse o único a perceber que a sua escola está pegando fogo?',
  (lt) => corredor(lt, { luz: 0.9, fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0, 0] }) + `<rect width="${EW}" height="${EH}" fill="#000" opacity="${Math.max(0, 1 - lt / 0.6) * 0.8}"/>`,
  { trilha: 'terror' });
cena('narr', 'Ninguém mais sabe. O alarme ainda não tocou.',
  (lt) => corredor(lt, { luz: 0.9, fogo: 0.5 + 0.3 * Math.sin(lt) }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0, 0] }),
  { trilha: 'terror' });

// ============ 1. APRESENTAÇÃO ============
cena('narr', 'Ele sabia que o tempo era curto. Cada minuto de fumaça deixava o ar mais difícil de respirar.', (lt, c, fl) => corredor(lt, { fogo: 0.3 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Colégio Santa Clara. Sexta-feira, sete da noite. A maioria já foi embora.',
  (lt) => patio(lt, { escuro: 0 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }),
  { trilha: 'calma' });
cena('narr', 'Era a última semana de aula antes das férias. Os corredores estavam cheios de cartazes e de risadas.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'O protagonista se chama Léo. Dezesseis anos, o cara que chega cedo e sai por último.',
  (lt) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.2, 0] }),
  { trilha: 'calma' });
cena('narr', 'Ele morava a dois quarteirões da escola, com a mãe, que era enfermeira e trabalhava de plantão à noite.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Por isso ele gostava de ficar até tarde. Em casa, o silêncio era grande demais.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bia', 'Léo! Você vai ficar de novo até a última aula? Ninguém fica aqui na sexta.',
  (lt, c, fl) => corredor(lt) + figura({ ...BIA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [-0.4, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.4, 0] }));
cena('leo', 'Eu checo as salas antes de ir embora. Sempre tem alguém esquecido.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bia', 'Você é o cara do armário! Aquela história do gato ainda rende piada.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Foi um gato, Bia! E ele estava com fome!', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Eu vou pegar meu caderno de química no laboratório. Já volto.',
  (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'determinado', fala: fl, olhar: [0.6, 0] }) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.4, 0] }));

// ============ 2. O CHEIRO ============
cena('narr', 'No corredor, o cheiro chegou antes de qualquer fumaça. Um cheiro doce e químico.',
  (lt) => corredor(lt, { luz: 0.8 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'surpreso', olhar: [0, 0] }),
  { trilha: 'terror' });
cena('leo', 'Que cheiro é esse?',
  (lt, c, fl) => corredor(lt, { luz: 0.7 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'surpreso', fala: fl }),
  { trilha: 'terror' });
cena('nilton', 'Ei, garoto! Vai pra casa, a escola fecha em dez minutos.',
  (lt, c, fl) => corredor(lt) + figura({ ...NILTON, x: 1350, y: 880, esc: 1.0, t: lt, expr: 'neutro', fala: fl, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.6, 0] }));
cena('leo', 'Seu Nilton, o senhor sentiu esse cheiro?',
  (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', fala: fl, olhar: [0.6, 0] }) + figura({ ...NILTON, x: 1350, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [-0.6, 0] }));
cena('nilton', 'É o pessoal do laboratório. Sempre deixam o gás aberto. Não se preocupa, menino.',
  (lt, c, fl) => corredor(lt) + figura({ ...NILTON, x: 1350, y: 880, esc: 1.0, t: lt, expr: 'neutro', fala: fl, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'triste', olhar: [0.6, 0] }));

// ============ 3. A PORTA QUENTE ============
cena('narr', 'O zelador sempre dizia isso. Mas o cheiro, naquela noite, era diferente. Mais forte, mais doce, como solvente.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Seu Nilton, o senhor não acha isso perigoso?', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('nilton', 'Perigoso é você ficar aqui sozinho. Vai logo, moleque.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Ele foi até a porta do laboratório. Encostou a mão. A porta estava quente.',
  (lt) => corredor(lt, { fogo: 0.2 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'surpreso', pose: 'aponta', olhar: [0.6, 0] }),
  { trilha: 'terror' });
cena('narr', 'Ele respirou fundo. No ano passado, um prédio do bairro pegou fogo, e a escola inteira fez simulado de evacuação.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Por baixo da porta, a fumaça saía em fios cinzas.',
  (lt) => corredor(lt, { fogo: 0.5 + 0.2 * Math.sin(lt * 3) }) + `<rect x="850" y="700" width="220" height="10" fill="#FFB060"/>` + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.8, 0] }),
  { trilha: 'terror' });
cena('narr', 'O cheiro doce ficou mais forte, e a garganta dele começou a arder.', (lt, c, fl) => corredor(lt, { fogo: 0.5 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Tem fumaça! Tem fumaça saindo do laboratório!',
  (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.8, 0] }),
  { trilha: 'terror' });

// ============ 4. O LABORATÓRIO ============
cena('narr', 'Naquele momento o corredor ficou em silêncio. Só se ouvia um estalo distante lá dentro.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Ele abriu a porta. O fogo já tinha tomado a bancada do meio.',
  (lt) => laboratorio(lt, 0.9 + 0.2 * Math.sin(lt * 4)) + figura({ ...LEO, x: 420, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.8, 0] }),
  { trilha: 'terror' });
cena('narr', 'O calor bateu no rosto dele como um tapa. A luz laranja tingia as paredes e os armários.', (lt, c, fl) => laboratorio(lt, 1) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Tem alguém aqui? Tem alguém no laboratório?', (lt, c, fl) => laboratorio(lt, 1) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'O alarme de incêndio estava na parede. Ele apertou. Nada aconteceu.',
  (lt) => laboratorio(lt, 1.1) + `<rect x="1560" y="300" width="120" height="110" rx="10" fill="#D7262B" stroke="#111" stroke-width="6"/><circle cx="1620" cy="355" r="22" fill="#FFF"/>` + figura({ ...LEO, x: 420, y: 880, esc: 1.0, t: lt, expr: 'panico', pose: 'aponta', olhar: [0.9, -0.5] }),
  { trilha: 'terror' });
cena('narr', 'Era um alarme vermelho, antigo, com a tampa solta. Ele já tinha apertado um desses em dezenas de simulados.', (lt, c, fl) => laboratorio(lt, 1.1) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'O alarme não toca! Alguém tirou a bateria!',
  (lt, c, fl) => laboratorio(lt, 1.1) + figura({ ...LEO, x: 420, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.9, 0] }),
  { trilha: 'terror' });

// ============ 5. A BIA NÃO ACREDITA ============
cena('narr', 'A caixa do alarme estava aberta, com os fios soltos. Alguém tinha tirado a bateria.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bia', 'Léo, o grêmio pegou a bateria pro karaokê de ontem! Eu avisei pra eles!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Bia, liga pra emergência! Agora!',
  (lt, c, fl) => corredor(lt, { fogo: 0.4 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, pose: 'celular', olhar: [0.4, 0] }) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'surpreso', olhar: [-0.5, 0] }),
  { trilha: 'terror' });
cena('bia', 'Tá brincando, Léo? Você nunca faz piada de incêndio!',
  (lt, c, fl) => corredor(lt, { fogo: 0.4 }) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'surpreso', fala: fl, olhar: [-0.5, 0] }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.4, 0] }),
  { trilha: 'terror' });
cena('leo', 'Não é piada! Vai, chama a professora Ana!',
  (lt, c, fl) => corredor(lt, { fogo: 0.5 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.4, 0] }) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [-0.5, 0] }),
  { trilha: 'terror' });

// ============ 6. A PROFESSORA ============
cena('narr', 'Léo correu de volta ao corredor. As luzes piscavam e a fumaça descia pelas escadas.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'A professora Ana estava na sala ao lado, corrigindo provas. Ela correu para o corredor.',
  (lt) => corredor(lt, { fogo: 0.5 }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [-0.6, 0], pose: 'base' }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.6, 0] }),
  { trilha: 'terror' });
cena('ana', 'Léo? Você está bem? O que está acontecendo aqui?',
  (lt, c, fl) => corredor(lt, { fogo: 0.5 }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'neutro', fala: fl, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.6, 0] }),
  { trilha: 'terror' });
cena('leo', 'Professora, a porta do laboratório está quente! Tem fogo lá dentro!',
  (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.6, 0] }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('ana', 'Meu Deus! Abre a porta com cuidado, Léo. Eu vou pegar o telefone da secretaria.',
  (lt, c, fl) => laboratorio(lt, 1.2) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('ana', 'O auditório fica do outro lado, e a turma do teatro está lá ensaiando!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Eu vou avisar eles. Professora, pega o extintor da parede e vai pra saída!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Ela correu. O telefone da secretaria, porém, estava mudo. O sinal dentro do prédio caiu.',
  (lt) => corredor(lt, { fogo: 0.4 }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'triste', pose: 'cabeca', olhar: [-0.6, 0] }),
  { trilha: 'terror' });

// ============ 7. O EXTINTOR ============
cena('narr', 'Léo olhou para a Bia. Ela segurava o celular, com a tela escura.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bia', 'Sem sinal, Léo! Sem sinal nenhum!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Léo lembrou da aula de segurança do ano passado. Puxar o pino. Apontar para a base do fogo. Apertar.',
  (lt) => corredor(lt, { fogo: 0.5 }) + `<g transform="translate(330 520)"><rect x="-60" y="-160" width="120" height="330" rx="50" fill="#D7262B" stroke="#111" stroke-width="8"/><rect x="-36" y="-196" width="72" height="44" rx="10" fill="#222" stroke="#111" stroke-width="6"/><path d="M 30 -180 Q 110 -210 130 -120" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/><rect x="-60" y="-40" width="120" height="60" fill="#FFF" stroke="#111" stroke-width="5"/></g>` + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'determinado', pose: 'aponta', olhar: [0.6, 0] }),
  { trilha: 'terror' });
cena('narr', 'A mão dele tremia. Ele apertou com força, do jeito que tinha aprendido.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'O jato de pó branco espalhou sobre as chamas. O fogo recuou, mas a fumaça só aumentou.',
  (lt) => laboratorio(lt, 0.7) + `<g opacity="${0.4 + 0.3 * Math.sin(lt * 3)}">${[0, 1, 2, 3, 4].map((i) => `<circle cx="${760 + i * 70 + Math.sin(lt + i) * 10}" cy="${520 - i * 30}" r="${24 + i * 6}" fill="#FFFFFF"/>`).join('')}</g>` + figura({ ...LEO, x: 420, y: 880, esc: 1.0, t: lt, expr: 'determinado', pose: 'aponta', olhar: [0.9, 0] }),
  { trilha: 'terror' });
cena('narr', 'Ele se abaixou. A fumaça era densa, queimava os olhos e o ar ficava cada vez mais quente.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Fica baixo! A fumaça sobe, o ar bom fica perto do chão!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Não adianta! É muito fogo! Gente, sai daí!',
  (lt, c, fl) => corredor(lt, { fogo: 0.8 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.4, 0] }),
  { trilha: 'terror' });

// ============ 8. A TURMA ============
cena('narr', 'O fogo tinha subido para o teto. Uma lâmpada estourou e caiu perto dos pés dele.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('ana', 'Léo, sai daí agora! Não é hora de herói!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'No fim do corredor, ainda tinha gente. Uma turma inteira do segundo ano, ensaiando teatro no auditório.',
  (lt) => corredor(lt, { fogo: 0.7 }) + [0, 1, 2, 3].map((i) => figura({ ...COLEGA(['#6A8AE0', '#E0A060', '#60C0A0', '#C070C0'][i], ['#222', '#7A4A2A', '#111', '#C89040'][i]), x: 1280 + i * 120, y: 880, esc: 0.9, t: lt + i * 0.3, expr: 'panico', olhar: [-0.5, 0] })).join('') + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'determinado', olhar: [0.8, 0] }),
  { trilha: 'terror' });
cena('narr', 'Eram vinte e três alunos, a professora de teatro e o zelador Seu Nilton, que conhecia cada passagem do prédio.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Todo mundo pro pátio! Pela saída de emergência, agora! Não corre, mas não para!',
  (lt, c, fl) => corredor(lt, { fogo: 0.8 }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'determinado', fala: fl, olhar: [0.8, 0] }) + [0, 1, 2, 3].map((i) => figura({ ...COLEGA(['#6A8AE0', '#E0A060', '#60C0A0', '#C070C0'][i], ['#222', '#7A4A2A', '#111', '#C89040'][i]), x: 1280 + i * 120, y: 880, esc: 0.9, t: lt + i * 0.3, expr: 'panico', olhar: [-0.5, 0] })).join(''),
  { trilha: 'terror' });
cena('bia', 'E a turma do teatro? Eles estão no auditório!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Eu vou buscar eles. Bia, vai com a Ana!', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'A porta principal tinha fechado sozinha. A porta corta-fogo desceu com a fumaça e travou.',
  (lt) => corredor(lt, { fogo: 0.8 }) + `<rect x="200" y="240" width="520" height="700" fill="#8A3A2A" stroke="#111" stroke-width="8"/><rect x="240" y="280" width="440" height="620" fill="#A24A3A" stroke="#111" stroke-width="5"/>` + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('narr', 'O corredor virou um túnel de fumaça. Léo tossiu e cobriu o rosto com a manga da blusa.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'A porta está trancada! Tem outro jeito?',
  (lt, c, fl) => corredor(lt, { fogo: 0.8 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('narr', 'Léo lembrou da porta de serviço, atrás da cantina. Só o zelador usava para levar o lixo.',
  (lt) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'determinado', pose: 'aponta', olhar: [-0.8, 0] }),
  { trilha: 'terror' });
cena('nilton', 'Eu tenho a chave! Vem por aqui, rápido, a fila atrás de mim!',
  (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...NILTON, x: 1200, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 1500, y: 880, esc: 1.0, t: lt, expr: 'determinado', olhar: [-0.6, 0] }),
  { trilha: 'terror' });

// ============ 9. A FILA NA FUMAÇA ============
cena('nilton', 'Cuidado com o degrau, ele é velho! Segura no corrimão!', (lt, c, fl) => patio(lt) + figura({ ...NILTON, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [-0.6, 0] }));
cena('narr', 'A porta de serviço dava num pátio lateral, com uma escada de metal que descia até o gramado.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Vinte e três alunos em fila, cada um segurando o casaco do colega da frente para não se perder na fumaça.',
  (lt) => corredor(lt, { fogo: 0.6 }) + [0, 1, 2, 3, 4].map((i) => figura({ ...COLEGA(['#6A8AE0', '#E0A060', '#60C0A0', '#C070C0', '#E0E060'][i], ['#222', '#7A4A2A', '#111', '#C89040', '#3A2A2A'][i]), x: 1000 + i * 140, y: 880 + Math.sin(lt * 6 + i) * 4, esc: 0.9, t: lt + i * 0.3, expr: 'panico', olhar: [-0.6, 0] })).join('') + figura({ ...NILTON, x: 1700, y: 880, esc: 1.0, t: lt, expr: 'determinado', olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('narr', 'Uma menina tropeçou no degrau. Léo parou, levantou a amiga e puxou a fila de volta.',
  (lt) => corredor(lt, { fogo: 0.6 }) + figura({ ...COLEGA('#E0A060', '#7A4A2A'), x: 1000, y: 880 + (lt < 1 ? 50 : 0), esc: 1.0, t: lt, expr: 'panico', pose: 'base', olhar: [-0.6, 0] }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'determinado', pose: 'aponta', olhar: [-0.6, 0] }),
  { trilha: 'terror' });
cena('leo', 'Calma, eu te seguro! Vai, vai!',
  (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'determinado', fala: fl, olhar: [-0.6, 0] }) + figura({ ...COLEGA('#E0A060', '#7A4A2A'), x: 1000, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [-0.6, 0] }),
  { trilha: 'terror' });

// ============ 10. A ÚLTIMA SALA ============
cena('narr', 'Uma das alunas, de tranças, agradeceu sem conseguir falar direito. Só apertou a mão dele.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Atrás deles, o corredor desabava aos poucos. Cada passo era uma pequena vitória.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Faltava uma pessoa. No auditório escuro, um menino dormia com o fone no ouvido. Ninguém tinha visto ele.',
  (lt) => corredor(lt, { escuro: 0.4, fogo: 0.2 }) + `<rect x="1120" y="360" width="400" height="400" fill="#2A2440" stroke="#111" stroke-width="6"/>` + figura({ ...COLEGA('#777', '#222'), x: 1320, y: 880, esc: 1.0, t: lt, expr: 'sono', olhar: [0, 0] }),
  { trilha: 'suspense' });
cena('narr', 'O auditório estava escuro e com cheiro de tinta. No palco, a cortina de veludo já pegava fogo pela ponta.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Ei! Acorda! A escola está pegando fogo!',
  (lt, c, fl) => corredor(lt, { fogo: 0.5 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'panico', fala: fl, olhar: [0.4, 0] }) + figura({ ...COLEGA('#777', '#222'), x: 1450, y: 880, esc: 1.0, t: lt, expr: lt > 1 ? 'surpreso' : 'sono', olhar: [-0.6, 0] }),
  { trilha: 'suspense' });
cena('narr', 'O menino se assustou, olhou para o lado, viu a fumaça e pegou a mochila.', (lt, c, fl) => corredor(lt, { fogo: 0.6 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'O menino acordou, tirou o fone e correu com ele. Eles saíram pela porta de serviço junto com o zelador.',
  (lt) => patio(lt, { escuro: 0.2 }) + figura({ ...LEO, x: 560, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [0.6, 0] }) + figura({ ...COLEGA('#777', '#222'), x: 880, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.6, 0] }),
  { trilha: 'calma' });

// ============ 11. O PÁTIO E OS BOMBEIROS ============
cena('menino', 'Valeu, cara. Eu nem vi a fumaça. Tava de fone e dormi no sofá do auditório.', (lt, c, fl) => patio(lt) + figura({ ...COLEGA('#777', '#222'), x: 1400, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [-0.5, 0] }));
cena('narr', 'Quando chegaram lá fora, o pátio estava cheio de gente. Mães, pais, professores e alunos de pijama.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Lá fora, o ar estava limpo. Os alunos chegaram ao pátio, tossindo e chorando. Todos vivos.',
  (lt) => patio(lt, { fogo: 0.4 }) + [0, 1, 2, 3, 4].map((i) => figura({ ...COLEGA(['#6A8AE0', '#E0A060', '#60C0A0', '#C070C0', '#E0E060'][i], ['#222', '#7A4A2A', '#111', '#C89040', '#3A2A2A'][i]), x: 180 + i * 130, y: 880, esc: 0.9, t: lt + i * 0.2, expr: 'choro', lagrima: true, olhar: [0.3, 0] })).join(''),
  { trilha: 'calma' });
cena('mae', 'Bia! Meu Deus, Bia! Você tá bem?', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bia', 'Tô, mãe! Foi o Léo! Ele salvou a turma inteira!', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Oito minutos depois, o caminhão dos bombeiros chegou com as luzes acesas.',
  (lt) => patio(lt, { fogo: 0.4 }) + `<rect width="${EW}" height="${EH}" fill="${Math.sin(lt * 12) > 0 ? '#FF3040' : '#3A6AFF'}" opacity="0.08"/>` + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.6, 0] }),
  { trilha: 'calma' });
cena('narr', 'Os bombeiros desceram do caminhão em dois segundos e começaram a desenrolar a mangueira.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bombeiro', 'Tá todo mundo fora? Quantos alunos estavam no prédio?',
  (lt, c, fl) => patio(lt, { fogo: 0.3 }) + figura({ ...BOMBEIRO, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'determinado', fala: fl, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'panico', olhar: [0.6, 0] }),
  { trilha: 'calma' });
cena('leo', 'Vinte e três. A gente contou duas vezes. Vinte e três, todo mundo aqui.',
  (lt, c, fl) => patio(lt, { fogo: 0.3 }) + figura({ ...LEO, x: 760, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [0.6, 0] }) + figura({ ...BOMBEIRO, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.6, 0] }),
  { trilha: 'calma' });
cena('narr', 'Os bombeiros conferiram a lista de chamada duas vezes. Vinte e três nomes, vinte e três rostos.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('bombeiro', 'Muito bem, garoto. Isso aí é coragem com cabeça. Continua assim.', (lt, c, fl) => patio(lt) + figura({ ...BOMBEIRO, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [-0.6, 0] }));
cena('narr', 'Em uma hora, os bombeiros controlaram o fogo. O laboratório ficou destruído, mas ninguém morreu.',
  (lt) => patio(lt, { fogo: 0 }) + figura({ ...BOMBEIRO, x: 1200, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.6, 0] }) + figura({ ...ANA, x: 1500, y: 880, esc: 1.0, t: lt, expr: 'choro', lagrima: true, olhar: [-0.6, 0] }),
  { trilha: 'calma' });
cena('narr', 'No dia seguinte, o jornal da cidade publicou uma foto do pátio. Nela, dava para ver um garoto de moletom azul, de cabeça baixa, com o rosto sujo de fuligem.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('ana', 'Léo, você salvou todo mundo. Eu ouvi o que você disse, e eu não acreditei de primeira.',
  (lt, c, fl) => patio(lt, { fogo: 0 }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'triste', fala: fl, lagrima: true, olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.6, 0] }),
  { trilha: 'calma' });
cena('leo', 'Eu só fiz o que todo mundo deveria fazer. Avisar.',
  (lt, c, fl) => patio(lt, { fogo: 0 }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [0.6, 0] }) + figura({ ...ANA, x: 1400, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.6, 0] }),
  { trilha: 'calma' });

// ============ 12. REVIRAVOLTA ============
cena('narr', 'Naquela noite, a mãe do Léo chegou do plantão. Ela ouviu tudo na cozinha, em silêncio, e depois o abraçou por muito tempo.', (lt, c, fl) => patio(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Na segunda-feira, a escola inteira comemorava o alarme. O alarme automático, dizia o comunicado da diretoria.',
  (lt) => corredor(lt, { luz: 1 }) + figura({ ...DIRETOR, x: 1300, y: 880, esc: 1.0, t: lt, expr: 'feliz', pose: 'aponta', olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.6, 0] }),
  { trilha: 'alegre' });
cena('narr', 'A escola fez um mural com fotos do incêndio, e o nome do Léo não aparecia em nenhuma legenda.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('diretor', 'Parabéns à escola inteira! O alarme automático salvou todo mundo!',
  (lt, c, fl) => corredor(lt) + figura({ ...DIRETOR, x: 1300, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, pose: 'aponta', olhar: [-0.6, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.6, 0] }),
  { trilha: 'alegre' });
cena('bia', 'Léo, eles disseram que foi o alarme. Ninguém lembra de quem gritou primeiro.',
  (lt, c, fl) => corredor(lt) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'triste', fala: fl, olhar: [-0.5, 0] }) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0.5, 0] }),
  { trilha: 'alegre' });
cena('leo', 'Tudo bem, Bia. Eu sei quem foi. E a professora sabe também.',
  (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [0.5, 0] }) + figura({ ...BIA, x: 1360, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [-0.5, 0] }),
  { trilha: 'alegre' });
cena('narr', 'Na terça-feira, a secretaria chamou o Léo.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('ana', 'Léo, eu fui a primeira a não acreditar em você. Me desculpa.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'A senhora não precisa se desculpar. Foi a primeira vez que alguém confiou em mim numa emergência.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 620, y: 880, esc: 1.0, t: lt, expr: 'feliz', fala: fl, olhar: [0.5, 0] }));
cena('leo', 'Tudo bem, professora. A senhora chamou os bombeiros, isso também conta.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Léo sorriu pela primeira vez em dias. Ele ainda tinha fuligem na orelha, mas ninguém se importava mais.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('nilton', 'Léo... fui eu que tirei a bateria do alarme. Pra carregar meu rádio de madrugada. Me desculpa, menino.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'O zelador tinha esquecido de recolocar a bateria. Um erro pequeno, com consequências enormes.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Léo pegou a mochila e saiu da sala. Pela primeira vez, ele não era o último a ir embora.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('leo', 'Agora a gente sabe. Vou ficar de olho nas coisas da escola, pode deixar.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Naquela noite, a escola ficou de luzes apagadas. Só o brilho do poste refletia nas janelas.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'No dia seguinte, a escola abriu de novo. Os cartazes de férias continuavam nas paredes, e o laboratório estava cercado por fita.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'Léo voltou para casa andando sozinho. Olhou para trás uma última vez, e a escola parecia só uma escola de novo.', (lt, c, fl) => corredor(lt) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'neutro', olhar: [0, 0] }));
cena('narr', 'E se você estivesse no lugar dele? Você teria gritado primeiro?',
  (lt) => corredor(lt) + `<rect x="260" y="820" width="1400" height="200" rx="30" fill="#000" opacity="0.6"/>` + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'feliz', olhar: [0, 0] }),
  { trilha: 'alegre' });
cena('narr', 'Comenta EU se você teria avisado. E siga para a parte dois, o que aconteceu com o alarme?',
  (lt) => corredor(lt) + `<rect x="260" y="820" width="1400" height="200" rx="30" fill="#000" opacity="0.6"/>` + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: lt, expr: 'feliz', pose: 'aponta', olhar: [0, 0] }),
  { trilha: 'alegre' });

window.TRILHA_CENAS = {};
E.forEach((c, i) => { if (c.trilha) TRILHA_CENAS[i] = c.trilha; });

window.CAPA = () => corredor(1, { fogo: 0.8 }) + figura({ ...LEO, x: 960, y: 880, esc: 1.0, t: 1, expr: 'determinado', pose: 'aponta', olhar: [0.6, 0] });

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+2%' });
