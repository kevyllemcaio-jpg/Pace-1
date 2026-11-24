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
