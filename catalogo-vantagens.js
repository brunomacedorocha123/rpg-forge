// catalogo-vantagens.js
const vantagensCatalogo = [
  {
    id: 1,
    nome: "Ambidestria",
    custoBase: 5,
    categoria: "fisicas",
    descricao: "O personagem é capaz de lutar e manusear igualmente bem com qualquer uma das mãos e nunca sofre a penalidade de -4 na DX por estar usando a mão inábil.",
    tipo: "simples", // Adiciona direto sem modal
    ordem: "A"
  },
  {
    id: 2,
    nome: "Aptidão Mágica",
    custoBase: 5, // Custo para nível 0
    custoPorNivel: 10, // Custo adicional por nível acima de 0
    categoria: "mental-sobrenatural",
    descricao: "O personagem é um adepto da magia. Aptidão Mágica 0 concede detecção mágica básica. Níveis mais altos facilitam aprendizado e uso de magia.",
    tipo: "niveis_com_limitações", // Modal com níveis + limitações
    niveisMaximo: 4,
    descricaoNiveis: [
      "Nível 0: Detecção mágica básica (5 pontos)",
      "Nível 1: +1 em aprendizado (15 pontos)",
      "Nível 2: +2 em aprendizado (25 pontos)",
      "Nível 3: +3 em aprendizado (35 pontos)",
      "Nível 4: +4 em aprendizado (45 pontos)"
    ],
    limitações: [
      { nome: "Canção", custo: -40, descricao: "Tem que cantar para fazer mágicas." },
      { nome: "Dança", custo: -40, descricao: "Tem que dançar para fazer mágicas." },
      { nome: "Manifestação Diurna", custo: -40, descricao: "Só funciona durante o dia." },
      { nome: "Manifestação Noturna", custo: -40, descricao: "Só funciona durante a noite." },
      { nome: "Manifestação Obscura", custo: -50, descricao: "Só funciona no escuro." },
      { nome: "Musical", custo: -50, descricao: "Precisa de instrumento musical." },
      { nome: "Solitária", custo: -40, descricao: "Penalidade por pessoas próximas." },
      { nome: "Uma Única Escola", custo: -40, descricao: "Apenas para uma escola de magia." }
    ],
    ordem: "A"
  },
  {
    id: 3,
    nome: "Atirador",
    custoBase: 25,
    categoria: "mental-sobrenatural",
    descricao: "Capacidade de dar tiros extraordinariamente precisos sem mirar. Funciona com armas de fogo, feixe, canhões e projéteis líquidos.",
    tipo: "simples",
    ordem: "A"
  },
  {
    id: 4,
    nome: "Bom Senso",
    custoBase: 10,
    categoria: "mental-sobrenatural",
    descricao: "O Mestre avisa quando o personagem está prestes a fazer algo estúpido. Teste contra IQ.",
    tipo: "simples",
    ordem: "B"
  },
  {
    id: 5,
    nome: "Destemor",
    custoBase: 2, // Custo por nível
    custoPorNivel: 2,
    categoria: "mental-sobrenatural",
    descricao: "Não é fácil assustar ou intimidar o personagem. Adiciona nível à Vontade contra medo e intimidação.",
    tipo: "niveis",
    niveisMaximo: 5,
    descricaoNiveis: [
      "Nível 1: +1 em testes contra medo (2 pontos)",
      "Nível 2: +2 em testes contra medo (4 pontos)",
      "Nível 3: +3 em testes contra medo (6 pontos)",
      "Nível 4: +4 em testes contra medo (8 pontos)",
      "Nível 5: +5 em testes contra medo (10 pontos)"
    ],
    ordem: "D"
  },
  {
    id: 6,
    nome: "Duro de Matar",
    custoBase: 2, // Custo por nível
    custoPorNivel: 2,
    categoria: "fisicas",
    descricao: "É incrivelmente difícil matar o personagem. +1 em testes de HT para sobreviver quando PV abaixo de zero.",
    tipo: "niveis",
    niveisMaximo: 5,
    descricaoNiveis: [
      "Nível 1: +1 em testes de sobrevivência (2 pontos)",
      "Nível 2: +2 em testes de sobrevivência (4 pontos)",
      "Nível 3: +3 em testes de sobrevivência (6 pontos)",
      "Nível 4: +4 em testes de sobrevivência (8 pontos)",
      "Nível 5: +5 em testes de sobrevivência (10 pontos)"
    ],
    ordem: "D"
  },
  {
    id: 7,
    nome: "Hipoalgia (Alto Limiar de Dor)",
    custoBase: 10,
    categoria: "fisicas",
    descricao: "O personagem não sente dor com intensidade normal. Nunca sofre penalidades de choque e +3 em testes para não ficar nocauteado.",
    tipo: "simples",
    ordem: "H"
  },
  {
    id: 8,
    nome: "Mestre de Armas",
    custoBase: 20, // Custo mínimo
    categoria: "mental-sobrenatural",
    descricao: "Alto grau de treinamento com uma categoria específica de armas motoras. Escolha a classe de armas.",
    tipo: "opcoes", // Modal com escolha única
    opcoes: [
      { nome: "Uma arma específica", custo: 20 },
      { nome: "Duas armas usadas em conjunto", custo: 25 },
      { nome: "Uma classe pequena de armas", custo: 30 },
      { nome: "Uma classe intermediária de armas", custo: 35 },
      { nome: "Uma classe ampla de armas", custo: 40 },
      { nome: "Todas as armas motoras", custo: 45 }
    ],
    descricaoOpcoes: "Escolha o nível de proficiência com armas. Custo varia conforme a amplitude da classe escolhida.",
    ordem: "M"
  },
  {
    id: 9,
    nome: "Reflexos em Combate",
    custoBase: 15,
    categoria: "mental-sobrenatural",
    descricao: "Reações fantásticas. +1 em defesas ativas, +1 em Sacar Rápido, +2 em Verificações de Pânico, nunca fica paralisado.",
    tipo: "simples",
    ordem: "R"
  },
  {
    id: 10,
    nome: "Sorte",
    custoBase: 15, // Custo para Sorte básica
    categoria: "mental-sobrenatural",
    descricao: "O personagem nasceu com sorte! Pode refazer testes ruins periodicamente.",
    tipo: "niveis_com_limitações",
    niveis: [
      { nome: "Sorte", custo: 15, intervalo: "1 hora", descricao: "Refazer teste a cada hora" },
      { nome: "Sorte Extraordinária", custo: 30, intervalo: "30 minutos", descricao: "Refazer teste a cada 30 minutos" },
      { nome: "Sorte Impossível", custo: 60, intervalo: "10 minutos", descricao: "Refazer teste a cada 10 minutos" }
    ],
    limitações: [
      { nome: "Ativa", custo: -40, descricao: "Deve declarar uso antes da jogada" },
      { nome: "Defensiva", custo: -20, descricao: "Apenas para defesas e testes de resistência" },
      { nome: "Seletiva", custo: -20, descricao: "Apenas para classe específica de tarefas" }
    ],
    ordem: "S"
  }
];

// Ordenar por ordem alfabética
vantagensCatalogo.sort((a, b) => a.ordem.localeCompare(b.ordem));