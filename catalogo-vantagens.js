// catalogo-vantagens.js - VERSÃO SIMPLIFICADA E LIMPA
const vantagensCatalogo = [
  {
    id: 1,
    nome: "Ambidestria",
    custoBase: 5,
    categoria: "fisicas",
    descricao: "O personagem é capaz de lutar e manusear igualmente bem com qualquer uma das mãos e nunca sofre a penalidade de -4 na DX por estar usando a mão inábil.",
    tipo: "simples"
  },
  {
    id: 2,
    nome: "Aptidão Mágica",
    custoBase: 5,
    categoria: "mental-sobrenatural",
    descricao: "O personagem é um adepto da magia. Aptidão Mágica 0 concede detecção mágica básica. Níveis mais altos facilitam aprendizado e uso de magia.",
    tipo: "niveis_com_limitações",
    niveisMaximo: 3,
    limitações: [
      { id: "cancao", nome: "Canção", custo: -40 },
      { id: "danca", nome: "Dança", custo: -40 },
      { id: "diurna", nome: "Manifestação Diurna", custo: -40 },
      { id: "noturna", nome: "Manifestação Noturna", custo: -40 },
      { id: "obscura", nome: "Manifestação Obscura", custo: -50 },
      { id: "musical", nome: "Musical", custo: -50 },
      { id: "solitária", nome: "Solitária", custo: -40 },
      { id: "uma_escola", nome: "Uma Única Escola", custo: -40 }
    ]
  },
  {
    id: 3,
    nome: "Atirador",
    custoBase: 25,
    categoria: "mental-sobrenatural",
    descricao: "Capacidade de dar tiros extraordinariamente precisos sem mirar. Funciona com armas de fogo, feixe, canhões e projéteis líquidos.",
    tipo: "simples"
  },
  {
    id: 4,
    nome: "Bom Senso",
    custoBase: 10,
    categoria: "mental-sobrenatural",
    descricao: "O Mestre avisa quando o personagem está prestes a fazer algo estúpido. Teste contra IQ.",
    tipo: "simples"
  },
  {
    id: 5,
    nome: "Destemor",
    custoBase: 2,
    categoria: "mental-sobrenatural",
    descricao: "Não é fácil assustar ou intimidar o personagem. Adiciona nível à Vontade contra medo e intimidação.",
    tipo: "niveis",
    niveisMaximo: 5
  },
  {
    id: 6,
    nome: "Duro de Matar",
    custoBase: 2,
    categoria: "fisicas",
    descricao: "É incrivelmente difícil matar o personagem. +1 em testes de HT para sobreviver quando PV abaixo de zero.",
    tipo: "niveis",
    niveisMaximo: 5
  },
  {
    id: 7,
    nome: "Hipoalgia (Alto Limiar de Dor)",
    custoBase: 10,
    categoria: "fisicas",
    descricao: "O personagem não sente dor com intensidade normal. Nunca sofre penalidades de choque e +3 em testes para não ficar nocauteado.",
    tipo: "simples"
  },
  {
    id: 8,
    nome: "Mestre de Armas",
    custoBase: 20,
    categoria: "mental-sobrenatural",
    descricao: "Alto grau de treinamento com uma categoria específica de armas motoras. Escolha a classe de armas.",
    tipo: "opcoes",
    opcoes: [
      { id: "uma_especifica", nome: "Uma arma específica", custo: 20 },
      { id: "duas_em_conjunto", nome: "Duas armas usadas em conjunto", custo: 25 },
      { id: "classe_pequena", nome: "Uma classe pequena de armas", custo: 30 },
      { id: "classe_intermediaria", nome: "Uma classe intermediária de armas", custo: 35 },
      { id: "classe_ampla", nome: "Uma classe ampla de armas", custo: 40 },
      { id: "todas", nome: "Todas as armas motoras", custo: 45 }
    ]
  },
  {
    id: 9,
    nome: "Reflexos em Combate",
    custoBase: 15,
    categoria: "mental-sobrenatural",
    descricao: "Reações fantásticas. +1 em defesas ativas, +1 em Sacar Rápido, +2 em Verificações de Pânico, nunca fica paralisado.",
    tipo: "simples"
  },
  {
    id: 10,
    nome: "Sorte",
    custoBase: 15,
    categoria: "mental-sobrenatural",
    descricao: "O personagem nasceu com sorte! Pode refazer testes ruins periodicamente.",
    tipo: "opcoes_com_limitações",
    opcoes: [
      { id: "normal", nome: "Sorte", custo: 15, intervalo: "1 hora" },
      { id: "extraordinaria", nome: "Sorte Extraordinária", custo: 30, intervalo: "30 minutos" },
      { id: "impossivel", nome: "Sorte Impossível", custo: 60, intervalo: "10 minutos" }
    ],
    limitações: [
      { id: "ativa", nome: "Ativa", custo: -40 },
      { id: "defensiva", nome: "Defensiva", custo: -20 },
      { id: "seletiva", nome: "Seletiva", custo: -20 }
    ]
  }
];

// Ordenar por nome
vantagensCatalogo.sort((a, b) => a.nome.localeCompare(b.nome));