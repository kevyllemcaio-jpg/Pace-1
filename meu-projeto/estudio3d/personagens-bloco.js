// Personagens originais no estilo avatar em blocos (fichas fixas: NÃO mudar cores/acessórios nos vídeos).
// Ficha completa e prompts em inglês: publicacao/PERSONAGENS-BLOCO.md

/** ZECA — 12 anos, aventureiro elétrico. */
export const ZECA = {
  nome: 'Zeca',
  pele: '#E8B48A',
  cabelo: '#2B1A10', cabeloTipo: 'topete',
  olhos: '#3E8EDE', // azul
  camisa: '#FF8A1F', camisa2: '#E0661A', // moletom laranja
  calca: '#2D3B55', // calça jeans escura
  tenis: '#F4F4F4', sola: '#22B573', // tênis branco com sola verde
  fone: '#1E1E24', // fone preto no pescoço/cabeça
  mochila: '#22B573',
  sardas: true,
  estampa: (g) => { g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(64, 10); g.lineTo(40, 70); g.lineTo(62, 70); g.lineTo(50, 118); g.lineTo(92, 50); g.lineTo(68, 50); g.lineTo(84, 10); g.closePath(); g.fill(); }, // raio branco no peito
};

/** LIA — 13 anos, a cabeça do grupo: calma, esperta, ri das trapalhadas do Zeca. */
export const LIA = {
  nome: 'Lia',
  pele: '#B97A55',
  cabelo: '#24140C', cabeloTipo: 'longo',
  olhos: '#3FA36B', // verdes
  camisa: '#8E5BE8', camisa2: '#6E3FCC', // moletom roxo
  calca: '#1F2230',
  tenis: '#F4F4F4', sola: '#FF5A8A', // sola rosa
  estampa: (g) => { g.fillStyle = '#FFFFFF'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 22 : 52; g.lineTo(64 + Math.cos(a) * r, 66 + Math.sin(a) * r); } g.closePath(); g.fill(); }, // estrela branca
};
