// ============================================
// SISTEMA DE RAÇAS - RPGFORCE
// ============================================

const RACAS_CONFIG = {
  anao: {
    id: "anao",
    nome: "Anão",
    nomeExibido: "Anão",
    custo: 3,
    descricao: "Anões são robustos, resistentes e conhecidos por sua habilidade com forja e armas de haste. São teimosos, mas leais.",
    
    // Modificadores de Atributos (aplicados diretamente ao valor base)
    atributos: {
      st: 3,      // Força +3
      vigor: 1,   // Vigor +1
      vt: 1,      // Vitalidade +1
      dx: -1      // Destreza -1
    },
    
    // Vantagens concedidas
    vantagens: ["corpoResistente"],
    
    // Desvantagens obrigatórias
    desvantagens: ["avareza", "nanismo"],
    
    // Modificadores de Perícias (percentuais)
    pericias: {
      bonus: {
        "armasHaste": 3,
        "armaria": 3
      },
      penalidade: {
        "arco": -2,
        "besta": -2,
        "funda": -2,
        "arremesso": -2
      }
    },
    
    // Movimento - redução de 25% no correr (arredondado para baixo)
    movimento: {
      correr: {
        modificador: -25,
        tipo: "percentual",
        arredondamento: "floor"
      }
    },
    
    // Capacidade de Carga (substitui os valores padrão)
    carga: {
      leve: 2.5,
      media: 5.0,
      pesada: 9.0,
      maxima: 13.0
    }
  }
};

// ============================================
// ESTADO ATUAL DA RAÇA NO PERSONAGEM
// ============================================
let racaAtual = null;
let efeitosRacaAtuais = null;

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Aplica os efeitos de uma raça ao personagem
 * @param {Object} personagem - Estado atual do personagem (variáveis globais)
 * @param {string} racaId - ID da raça (ex: "anao")
 * @returns {Object} Resultado da aplicação { success, message, changes }
 */
function aplicarRaca(personagem, racaId) {
  // Validações
  if (!personagem) return { success: false, message: "Personagem é obrigatório" };
  if (!RACAS_CONFIG[racaId]) return { success: false, message: `Raça "${racaId}" não encontrada` };
  
  const raca = RACAS_CONFIG[racaId];
  
  // Verificar se a mesma raça já está aplicada
  if (racaAtual === racaId) {
    return { success: false, message: `Raça ${raca.nomeExibido} já está aplicada` };
  }
  
  // Verificar pontos disponíveis
  const pontosAtuais = personagem.saldoPontos !== undefined ? personagem.saldoPontos : 10;
  if (raca.custo > pontosAtuais) {
    return { 
      success: false, 
      message: `Pontos insuficientes! Precisa de ${raca.custo} pontos, restam ${pontosAtuais}` 
    };
  }
  
  // Se tiver outra raça, remove primeiro
  if (racaAtual) {
    removerEfeitosRaca(personagem);
  }
  
  // Registrar mudanças para debug/feedback
  const changes = {
    atributos: {},
    vantagens: [],
    desvantagens: [],
    pericias: {},
    movimento: null,
    carga: null,
    pontos: -raca.custo
  };
  
  // 1. Aplicar modificadores de atributos
  Object.entries(raca.atributos).forEach(([atributo, valor]) => {
    const valorAtual = personagem.atributos?.[atributo]?.valor || 5;
    const novoValor = valorAtual + valor;
    // Limitar entre 1 e 15
    const valorFinal = Math.min(15, Math.max(1, novoValor));
    changes.atributos[atributo] = { antes: valorAtual, depois: valorFinal, delta: valor };
    
    if (personagem.atributos && personagem.atributos[atributo]) {
      personagem.atributos[atributo].valor = valorFinal;
    }
  });
  
  // 2. Aplicar vantagens
  raca.vantagens.forEach(vantagem => {
    if (!personagem.vantagensSelecionadas?.has(vantagem)) {
      changes.vantagens.push({ nome: vantagem, acao: "adicionada" });
      if (personagem.vantagensSelecionadas) {
        personagem.vantagensSelecionadas.add(vantagem);
      }
    }
  });
  
  // 3. Aplicar desvantagens
  raca.desvantagens.forEach(desvantagem => {
    if (!personagem.desvantagensSelecionadas?.has(desvantagem)) {
      changes.desvantagens.push({ nome: desvantagem, acao: "adicionada" });
      if (personagem.desvantagensSelecionadas) {
        personagem.desvantagensSelecionadas.add(desvantagem);
      }
    }
  });
  
  // 4. Aplicar modificadores de perícias
  if (raca.pericias.bonus) {
    Object.entries(raca.pericias.bonus).forEach(([pericia, bonus]) => {
      const valorAtual = personagem.pericias?.[pericia]?.nivelBonus || 0;
      const novoBonus = valorAtual + bonus;
      changes.pericias[pericia] = { tipo: "bonus", antes: valorAtual, depois: novoBonus, delta: bonus };
      
      if (personagem.pericias && personagem.pericias[pericia]) {
        personagem.pericias[pericia].nivelBonus = (personagem.pericias[pericia].nivelBonus || 0) + bonus;
      } else if (personagem.pericias) {
        personagem.pericias[pericia] = { nivel: 0, nivelBonus: bonus };
      }
    });
  }
  
  if (raca.pericias.penalidade) {
    Object.entries(raca.pericias.penalidade).forEach(([pericia, penalidade]) => {
      const valorAtual = personagem.pericias?.[pericia]?.nivelBonus || 0;
      const novoBonus = valorAtual + penalidade;
      changes.pericias[pericia] = { tipo: "penalidade", antes: valorAtual, depois: novoBonus, delta: penalidade };
      
      if (personagem.pericias && personagem.pericias[pericia]) {
        personagem.pericias[pericia].nivelBonus = (personagem.pericias[pericia].nivelBonus || 0) + penalidade;
      } else if (personagem.pericias) {
        personagem.pericias[pericia] = { nivel: 0, nivelBonus: penalidade };
      }
    });
  }
  
  // 5. Aplicar modificador de movimento
  if (raca.movimento && raca.movimento.correr) {
    const movimentoAtual = personagem.movimentoCorrer || 0;
    let novoMovimento = movimentoAtual;
    
    if (raca.movimento.correr.tipo === "percentual") {
      const percentual = (100 + raca.movimento.correr.modificador) / 100;
      novoMovimento = movimentoAtual * percentual;
      
      if (raca.movimento.correr.arredondamento === "floor") {
        novoMovimento = Math.floor(novoMovimento);
      }
    }
    
    changes.movimento = { antes: movimentoAtual, depois: novoMovimento, delta: novoMovimento - movimentoAtual };
    personagem.movimentoCorrer = novoMovimento;
    personagem.movimentoModificadoPorRaca = true;
  }
  
  // 6. Aplicar capacidade de carga
  if (raca.carga) {
    changes.carga = { ...raca.carga };
    personagem.cargaPersonalizada = { ...raca.carga };
    personagem.cargaModificadaPorRaca = true;
  }
  
  // 7. Atualizar pontos do personagem
  if (personagem.saldoPontos !== undefined) {
    personagem.saldoPontos -= raca.custo;
    changes.pontosRestantes = personagem.saldoPontos;
  }
  
  // 8. Salvar estado da raça
  racaAtual = racaId;
  efeitosRacaAtuais = {
    id: racaId,
    atributos: { ...raca.atributos },
    vantagens: [...raca.vantagens],
    desvantagens: [...raca.desvantagens],
    periciasBonus: { ...(raca.pericias.bonus || {}) },
    periciasPenalidade: { ...(raca.pericias.penalidade || {}) },
    movimento: raca.movimento ? { ...raca.movimento } : null,
    carga: raca.carga ? { ...raca.carga } : null,
    custo: raca.custo
  };
  
  personagem.racaAtual = racaId;
  personagem.racaNome = raca.nomeExibido;
  
  return { 
    success: true, 
    message: `Raça ${raca.nomeExibido} aplicada com sucesso! Custo: ${raca.custo} pontos.`,
    changes: changes
  };
}

/**
 * Remove todos os efeitos da raça atual do personagem
 * @param {Object} personagem - Estado atual do personagem
 * @returns {Object} Resultado da remoção
 */
function removerEfeitosRaca(personagem) {
  if (!racaAtual || !efeitosRacaAtuais) {
    return { success: false, message: "Nenhuma raça aplicada para remover" };
  }
  
  const raca = RACAS_CONFIG[racaAtual];
  if (!raca) {
    // Limpar estado inconsistente
    racaAtual = null;
    efeitosRacaAtuais = null;
    return { success: false, message: "Estado de raça inconsistente, limpo." };
  }
  
  const changes = {
    atributos: {},
    vantagens: [],
    desvantagens: [],
    pericias: {},
    movimento: null,
    carga: null,
    pontos: +raca.custo
  };
  
  // 1. Remover modificadores de atributos
  Object.entries(raca.atributos).forEach(([atributo, valor]) => {
    const valorAtual = personagem.atributos?.[atributo]?.valor || 5;
    const novoValor = valorAtual - valor;
    const valorFinal = Math.min(15, Math.max(1, novoValor));
    changes.atributos[atributo] = { antes: valorAtual, depois: valorFinal, delta: -valor };
    
    if (personagem.atributos && personagem.atributos[atributo]) {
      personagem.atributos[atributo].valor = valorFinal;
    }
  });
  
  // 2. Remover vantagens
  raca.vantagens.forEach(vantagem => {
    if (personagem.vantagensSelecionadas?.has(vantagem)) {
      changes.vantagens.push({ nome: vantagem, acao: "removida" });
      personagem.vantagensSelecionadas.delete(vantagem);
    }
  });
  
  // 3. Remover desvantagens
  raca.desvantagens.forEach(desvantagem => {
    if (personagem.desvantagensSelecionadas?.has(desvantagem)) {
      changes.desvantagens.push({ nome: desvantagem, acao: "removida" });
      personagem.desvantagensSelecionadas.delete(desvantagem);
    }
  });
  
  // 4. Remover modificadores de perícias
  if (raca.pericias.bonus) {
    Object.entries(raca.pericias.bonus).forEach(([pericia, bonus]) => {
      const valorAtual = personagem.pericias?.[pericia]?.nivelBonus || 0;
      const novoBonus = valorAtual - bonus;
      changes.pericias[pericia] = { tipo: "bonus", antes: valorAtual, depois: novoBonus, delta: -bonus };
      
      if (personagem.pericias && personagem.pericias[pericia]) {
        personagem.pericias[pericia].nivelBonus = novoBonus;
        
        // Se o bônus ficou 0 e não tem nível, remove a entrada
        if (novoBonus === 0 && (!personagem.pericias[pericia].nivel || personagem.pericias[pericia].nivel === 0)) {
          delete personagem.pericias[pericia];
        }
      }
    });
  }
  
  if (raca.pericias.penalidade) {
    Object.entries(raca.pericias.penalidade).forEach(([pericia, penalidade]) => {
      const valorAtual = personagem.pericias?.[pericia]?.nivelBonus || 0;
      const novoBonus = valorAtual - penalidade;
      changes.pericias[pericia] = { tipo: "penalidade", antes: valorAtual, depois: novoBonus, delta: -penalidade };
      
      if (personagem.pericias && personagem.pericias[pericia]) {
        personagem.pericias[pericia].nivelBonus = novoBonus;
        
        if (novoBonus === 0 && (!personagem.pericias[pericia].nivel || personagem.pericias[pericia].nivel === 0)) {
          delete personagem.pericias[pericia];
        }
      }
    });
  }
  
  // 5. Restaurar movimento original
  if (personagem.movimentoModificadoPorRaca) {
    delete personagem.movimentoModificadoPorRaca;
    changes.movimento = { restaurado: true };
  }
  
  // 6. Restaurar carga original
  if (personagem.cargaModificadaPorRaca) {
    delete personagem.cargaPersonalizada;
    delete personagem.cargaModificadaPorRaca;
    changes.carga = { restaurado: true };
  }
  
  // 7. Devolver pontos
  if (personagem.saldoPontos !== undefined) {
    personagem.saldoPontos += raca.custo;
    changes.pontosRestantes = personagem.saldoPontos;
  }
  
  // 8. Limpar estado da raça
  delete personagem.racaAtual;
  delete personagem.racaNome;
  racaAtual = null;
  efeitosRacaAtuais = null;
  
  return { 
    success: true, 
    message: `Efeitos da raça ${raca.nomeExibido} removidos. ${raca.custo} pontos devolvidos.`,
    changes: changes
  };
}

/**
 * Verifica se uma raça pode ser aplicada
 * @param {Object} personagem - Estado atual do personagem
 * @param {string} racaId - ID da raça desejada
 * @returns {Object} { podeAplicar: boolean, motivo: string, custo: number }
 */
function podeAplicarRaca(personagem, racaId) {
  if (!RACAS_CONFIG[racaId]) {
    return { podeAplicar: false, motivo: "Raça não encontrada", custo: 0 };
  }
  
  const raca = RACAS_CONFIG[racaId];
  
  if (racaAtual === racaId) {
    return { podeAplicar: false, motivo: `Raça ${raca.nomeExibido} já está aplicada`, custo: raca.custo };
  }
  
  const pontosAtuais = personagem.saldoPontos !== undefined ? personagem.saldoPontos : 10;
  
  if (raca.custo > pontosAtuais) {
    return { 
      podeAplicar: false, 
      motivo: `Pontos insuficientes. Precisa de ${raca.custo} pontos, restam ${pontosAtuais}`,
      custo: raca.custo,
      pontosRestantes: pontosAtuais
    };
  }
  
  return { podeAplicar: true, motivo: "", custo: raca.custo, pontosRestantes: pontosAtuais - raca.custo };
}

/**
 * Retorna todas as raças disponíveis
 * @returns {Array} Lista de raças
 */
function listarRacas() {
  return Object.values(RACAS_CONFIG).map(raca => ({
    id: raca.id,
    nome: raca.nomeExibido,
    custo: raca.custo,
    descricao: raca.descricao
  }));
}

/**
 * Retorna os detalhes completos de uma raça
 * @param {string} racaId - ID da raça
 * @returns {Object} Detalhes da raça
 */
function getDetalhesRaca(racaId) {
  if (!RACAS_CONFIG[racaId]) return null;
  
  const raca = RACAS_CONFIG[racaId];
  return {
    id: raca.id,
    nome: raca.nomeExibido,
    custo: raca.custo,
    descricao: raca.descricao,
    atributos: Object.entries(raca.atributos).map(([attr, valor]) => ({
      nome: attr.toUpperCase(),
      valor: valor,
      sinal: valor > 0 ? `+${valor}` : `${valor}`
    })),
    vantagens: raca.vantagens.map(v => ({
      id: v,
      nome: obterNomeVantagem(v)
    })),
    desvantagens: raca.desvantagens.map(d => ({
      id: d,
      nome: obterNomeDesvantagem(d)
    })),
    pericias: {
      bonus: Object.entries(raca.pericias.bonus || {}).map(([p, b]) => ({
        id: p,
        nome: obterNomePericia(p),
        bonus: `+${b}%`
      })),
      penalidade: Object.entries(raca.pericias.penalidade || {}).map(([p, b]) => ({
        id: p,
        nome: obterNomePericia(p),
        penalidade: `${b}%`
      }))
    },
    movimento: `Redução de ${Math.abs(raca.movimento.correr.modificador)}% na corrida (arredondado para baixo)`,
    carga: {
      leve: raca.carga.leve,
      media: raca.carga.media,
      pesada: raca.carga.pesada,
      maxima: raca.carga.maxima
    }
  };
}

/**
 * Retorna a raça atual aplicada
 * @returns {Object|null}
 */
function getRacaAtual() {
  if (!racaAtual || !RACAS_CONFIG[racaAtual]) return null;
  return {
    id: racaAtual,
    ...RACAS_CONFIG[racaAtual]
  };
}

/**
 * Verifica se há uma raça aplicada
 * @returns {boolean}
 */
function temRacaAplicada() {
  return racaAtual !== null;
}

// ============================================
// FUNÇÕES AUXILIARES PARA NOMES
// ============================================

function obterNomeVantagem(id) {
  const nomes = {
    corpoResistente: "Corpo Resistente"
  };
  return nomes[id] || id;
}

function obterNomeDesvantagem(id) {
  const nomes = {
    avareza: "Avareza",
    nanismo: "Nanismo"
  };
  return nomes[id] || id;
}

function obterNomePericia(id) {
  const nomes = {
    armasHaste: "Armas de Haste",
    armaria: "Armaria",
    arco: "Arco",
    besta: "Besta",
    funda: "Funda",
    arremesso: "Arremesso"
  };
  return nomes[id] || id;
}

// ============================================
// EXPORTAÇÃO
// ============================================

// Para uso com módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RACAS_CONFIG,
    aplicarRaca,
    removerEfeitosRaca,
    podeAplicarRaca,
    listarRacas,
    getDetalhesRaca,
    getRacaAtual,
    temRacaAplicada
  };
}

// Para uso no navegador
if (typeof window !== 'undefined') {
  window.RacasSystem = {
    RACAS_CONFIG,
    aplicarRaca,
    removerEfeitosRaca,
    podeAplicarRaca,
    listarRacas,
    getDetalhesRaca,
    getRacaAtual,
    temRacaAplicada
  };
}