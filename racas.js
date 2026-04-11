// ============================================
// SISTEMA DE RAÇAS - RPGForce
// ============================================

// ============================================
// CONFIGURAÇÃO CENTRALIZADA DAS RAÇAS
// ============================================
export const RACAS_CONFIG = {
  anao: {
    id: 'anao',
    nome: 'Anão',
    descricao: 'Povo resistente das montanhas, conhecido por sua força e tenacidade.',
    custoEsferas: 2,
    
    // Modificadores de atributos
    atributos: {
      st: { modificador: 2, tipo: 'bonus' },
      vt: { modificador: 1, tipo: 'bonus' },
      vigor: { modificador: 1, tipo: 'bonus' },
      dx: { modificador: -1, tipo: 'penalidade' }
    },
    
    // Vantagem automática
    vantagem: 'corpo_resistente',
    
    // Modificadores de perícias
    pericias: {
      bonus: {
        'armasHaste': 3,
        'armaria': 3
      },
      penalidade: {
        'arco': -2,
        'besta': -2,
        'funda': -2,
        'arremesso': -2
      }
    },
    
    // Movimento
    movimento: {
      tipo: 'reducao_parcial',
      descricao: 'Redução de 2m no deslocamento de corrida',
      reducaoCorrer: 2  // reduz 2 metros no correr
    },
    
    // Capacidade de carga (substitui os valores padrão)
    carga: {
      modificado: true,
      limites: [2.5, 5.0, 9.0, 13.0],  // [leve, medio, pesado, limite]
      descricao: 'Capacidade de carga reduzida devido à baixa estatura'
    },
    
    // Desvantagens obrigatórias
    desvantagensObrigatorias: ['avareza', 'nanismo'],
    
    // Efeitos especiais
    efeitosEspeciais: {
      nanismo: {
        descricao: 'Devido ao nanismo, o deslocamento de corrida é reduzido em 2m',
        aplicaMovimento: true
      }
    }
  }
};

// ============================================
// FUNÇÕES AUXILIARES INTERNAS
// ============================================

/**
 * Remove todos os efeitos de raça atuais do personagem
 * @param {Object} personagem - Objeto do personagem
 * @returns {Object} Personagem sem efeitos de raça
 */
function removerEfeitosRaca(personagem) {
  if (!personagem) return personagem;
  
  const novoPersonagem = JSON.parse(JSON.stringify(personagem));
  
  // Se não tem raça, retorna
  if (!novoPersonagem.raca) return novoPersonagem;
  
  const racaAnterior = novoPersonagem.raca;
  const configAnterior = RACAS_CONFIG[racaAnterior];
  
  if (!configAnterior) return novoPersonagem;
  
  // Remove modificadores de atributos
  if (configAnterior.atributos) {
    Object.entries(configAnterior.atributos).forEach(([atributo, mod]) => {
      if (novoPersonagem.atributos && novoPersonagem.atributos[atributo]) {
        // Remove o modificador (inverte o sinal)
        let modificador = mod.modificador;
        novoPersonagem.atributos[atributo].esferas -= modificador;
        
        // Garante que não fique negativo
        if (novoPersonagem.atributos[atributo].esferas < 0) {
          novoPersonagem.atributos[atributo].esferas = 0;
        }
      }
    });
  }
  
  // Remove vantagem automática
  if (configAnterior.vantagem && novoPersonagem.vantagens) {
    const index = novoPersonagem.vantagens.indexOf(configAnterior.vantagem);
    if (index !== -1) {
      novoPersonagem.vantagens.splice(index, 1);
    }
  }
  
  // Remove desvantagens obrigatórias
  if (configAnterior.desvantagensObrigatorias && novoPersonagem.desvantagens) {
    configAnterior.desvantagensObrigatorias.forEach(desv => {
      const index = novoPersonagem.desvantagens.indexOf(desv);
      if (index !== -1) {
        novoPersonagem.desvantagens.splice(index, 1);
      }
    });
  }
  
  // Remove modificadores de perícias
  if (configAnterior.pericias && novoPersonagem.pericias) {
    // Remove bônus
    if (configAnterior.pericias.bonus) {
      Object.keys(configAnterior.pericias.bonus).forEach(periciaId => {
        if (novoPersonagem.pericias[periciaId]) {
          novoPersonagem.pericias[periciaId].bonusRaca = 
            (novoPersonagem.pericias[periciaId].bonusRaca || 0) - configAnterior.pericias.bonus[periciaId];
        }
      });
    }
    
    // Remove penalidades
    if (configAnterior.pericias.penalidade) {
      Object.keys(configAnterior.pericias.penalidade).forEach(periciaId => {
        if (novoPersonagem.pericias[periciaId]) {
          novoPersonagem.pericias[periciaId].penalidadeRaca = 
            (novoPersonagem.pericias[periciaId].penalidadeRaca || 0) - configAnterior.pericias.penalidade[periciaId];
        }
      });
    }
  }
  
  // Marca que a carga padrão deve ser restaurada
  novoPersonagem._cargaModificada = false;
  
  // Remove a raça
  delete novoPersonagem.raca;
  
  return novoPersonagem;
}

/**
 * Aplica os efeitos de uma raça ao personagem
 * @param {Object} personagem - Objeto do personagem
 * @param {string} racaId - ID da raça a aplicar
 * @returns {Object} Personagem com efeitos aplicados
 */
function aplicarEfeitosRaca(personagem, racaId) {
  const config = RACAS_CONFIG[racaId];
  if (!config) {
    console.error(`Raça ${racaId} não encontrada`);
    return personagem;
  }
  
  const novoPersonagem = JSON.parse(JSON.stringify(personagem));
  
  // Aplica modificadores de atributos
  if (config.atributos) {
    Object.entries(config.atributos).forEach(([atributo, mod]) => {
      if (!novoPersonagem.atributos) novoPersonagem.atributos = {};
      if (!novoPersonagem.atributos[atributo]) {
        novoPersonagem.atributos[atributo] = { esferas: 0 };
      }
      
      let novoValor = novoPersonagem.atributos[atributo].esferas + mod.modificador;
      if (novoValor < 0) novoValor = 0;
      novoPersonagem.atributos[atributo].esferas = novoValor;
    });
  }
  
  // Aplica vantagem automática
  if (config.vantagem) {
    if (!novoPersonagem.vantagens) novoPersonagem.vantagens = [];
    if (!novoPersonagem.vantagens.includes(config.vantagem)) {
      novoPersonagem.vantagens.push(config.vantagem);
    }
  }
  
  // Aplica desvantagens obrigatórias
  if (config.desvantagensObrigatorias) {
    if (!novoPersonagem.desvantagens) novoPersonagem.desvantagens = [];
    config.desvantagensObrigatorias.forEach(desv => {
      if (!novoPersonagem.desvantagens.includes(desv)) {
        novoPersonagem.desvantagens.push(desv);
      }
    });
  }
  
  // Aplica modificadores de perícias
  if (config.pericias && novoPersonagem.pericias) {
    // Aplica bônus
    if (config.pericias.bonus) {
      Object.entries(config.pericias.bonus).forEach(([periciaId, bonus]) => {
        if (!novoPersonagem.pericias[periciaId]) {
          novoPersonagem.pericias[periciaId] = { nivel: 0 };
        }
        novoPersonagem.pericias[periciaId].bonusRaca = 
          (novoPersonagem.pericias[periciaId].bonusRaca || 0) + bonus;
      });
    }
    
    // Aplica penalidades
    if (config.pericias.penalidade) {
      Object.entries(config.pericias.penalidade).forEach(([periciaId, penalidade]) => {
        if (!novoPersonagem.pericias[periciaId]) {
          novoPersonagem.pericias[periciaId] = { nivel: 0 };
        }
        novoPersonagem.pericias[periciaId].penalidadeRaca = 
          (novoPersonagem.pericias[periciaId].penalidadeRaca || 0) + penalidade;
      });
    }
  }
  
  // Marca que a carga é modificada
  novoPersonagem._cargaModificada = true;
  novoPersonagem._cargaLimitesRaca = config.carga?.limites || null;
  
  // Marca que o movimento é modificado
  novoPersonagem._movimentoModificado = true;
  novoPersonagem._reducaoCorrerRaca = config.movimento?.reducaoCorrer || 0;
  
  // Aplica a raça
  novoPersonagem.raca = racaId;
  
  return novoPersonagem;
}

// ============================================
// FUNÇÕES PÚBLICAS EXPORTADAS
// ============================================

/**
 * Aplica uma raça ao personagem (remove anterior se existir)
 * @param {Object} personagem - Objeto do personagem
 * @param {string} racaId - ID da raça a aplicar
 * @returns {Object} Personagem com a nova raça aplicada
 */
export function aplicarRaca(personagem, racaId) {
  if (!personagem) {
    console.error('Personagem inválido');
    return null;
  }
  
  // Verifica se a raça existe
  const config = RACAS_CONFIG[racaId];
  if (!config) {
    console.error(`Raça ${racaId} não encontrada`);
    return personagem;
  }
  
  // Verifica se já tem a mesma raça
  if (personagem.raca === racaId) {
    console.warn(`Personagem já possui a raça ${racaId}`);
    return personagem;
  }
  
  // Remove efeitos da raça anterior e aplica a nova
  let novoPersonagem = removerEfeitosRaca(personagem);
  novoPersonagem = aplicarEfeitosRaca(novoPersonagem, racaId);
  
  return novoPersonagem;
}

/**
 * Remove a raça atual do personagem
 * @param {Object} personagem - Objeto do personagem
 * @returns {Object} Personagem sem raça
 */
export function removerRaca(personagem) {
  if (!personagem || !personagem.raca) return personagem;
  return removerEfeitosRaca(personagem);
}

/**
 * Obtém os modificadores de uma raça
 * @param {string} racaId - ID da raça
 * @returns {Object} Modificadores da raça
 */
export function getModificadoresRaca(racaId) {
  const config = RACAS_CONFIG[racaId];
  if (!config) return null;
  
  return {
    atributos: config.atributos,
    vantagem: config.vantagem,
    pericias: config.pericias,
    desvantagens: config.desvantagensObrigatorias,
    movimento: config.movimento,
    carga: config.carga,
    custoEsferas: config.custoEsferas
  };
}

/**
 * Obtém a lista de todas as raças disponíveis
 * @returns {Array} Lista de raças
 */
export function getListaRacas() {
  return Object.entries(RACAS_CONFIG).map(([id, config]) => ({
    id: id,
    nome: config.nome,
    descricao: config.descricao,
    custoEsferas: config.custoEsferas,
    modificadores: {
      atributos: config.atributos,
      vantagem: config.vantagem,
      desvantagens: config.desvantagensObrigatorias
    }
  }));
}

/**
 * Obtém os limites de carga modificados pela raça
 * @param {Object} personagem - Objeto do personagem
 * @returns {Object|null} Limites de carga ou null se não modificado
 */
export function getCargaLimitesRaca(personagem) {
  if (!personagem || !personagem.raca) return null;
  
  const config = RACAS_CONFIG[personagem.raca];
  if (!config || !config.carga || !config.carga.modificado) return null;
  
  const [leve, medio, pesado, limite] = config.carga.limites;
  return { leve, medio, pesado, limite };
}

/**
 * Obtém a redução de movimento de corrida da raça
 * @param {Object} personagem - Objeto do personagem
 * @returns {number} Redução em metros (0 se não houver)
 */
export function getReducaoCorrerRaca(personagem) {
  if (!personagem || !personagem.raca) return 0;
  
  const config = RACAS_CONFIG[personagem.raca];
  if (!config || !config.movimento) return 0;
  
  return config.movimento.reducaoCorrer || 0;
}

/**
 * Verifica se uma perícia tem modificador de raça
 * @param {Object} personagem - Objeto do personagem
 * @param {string} periciaId - ID da perícia
 * @returns {Object} Modificadores da perícia
 */
export function getModificadorPericiaRaca(personagem, periciaId) {
  if (!personagem || !personagem.raca) return { bonus: 0, penalidade: 0 };
  
  const config = RACAS_CONFIG[personagem.raca];
  if (!config || !config.pericias) return { bonus: 0, penalidade: 0 };
  
  const bonus = config.pericias.bonus?.[periciaId] || 0;
  const penalidade = config.pericias.penalidade?.[periciaId] || 0;
  
  return { bonus, penalidade };
}

/**
 * Verifica se o personagem tem penalidade de atributo que afeta esferas
 * @param {Object} personagem - Objeto do personagem
 * @param {string} atributo - Nome do atributo (st, dx, iq, vigor, vt)
 * @returns {Object} Informações sobre penalidade
 */
export function getPenalidadeAtributo(personagem, atributo) {
  if (!personagem || !personagem.raca) return { temPenalidade: false, valor: 0 };
  
  const config = RACAS_CONFIG[personagem.raca];
  if (!config || !config.atributos) return { temPenalidade: false, valor: 0 };
  
  const mod = config.atributos[atributo];
  if (mod && mod.modificador < 0) {
    return { 
      temPenalidade: true, 
      valor: Math.abs(mod.modificador),
      tipo: 'penalidade'
    };
  }
  
  return { temPenalidade: false, valor: 0 };
}

/**
 * Calcula o custo real em esferas para um atributo considerando penalidade de raça
 * @param {Object} personagem - Objeto do personagem
 * @param {string} atributo - Nome do atributo
 * @param {number} esferasAtuais - Esferas atuais no atributo
 * @param {number} novaQtde - Nova quantidade de esferas
 * @returns {number} Custo real em esferas
 */
export function calcularCustoAtributoComRaca(personagem, atributo, esferasAtuais, novaQtde) {
  const penalidade = getPenalidadeAtributo(personagem, atributo);
  
  if (!penalidade.temPenalidade) {
    // Sem penalidade, custo normal
    return novaQtde - esferasAtuais;
  }
  
  // Com penalidade, os primeiros X pontos neutralizam a penalidade
  const aumento = novaQtde - esferasAtuais;
  let custoReal = 0;
  
  // Se está aumentando
  if (aumento > 0) {
    // Verifica quantos pontos vão para neutralizar a penalidade
    const pontosParaNeutralizar = Math.max(0, penalidade.valor - esferasAtuais);
    const pontosParaEvoluir = aumento - pontosParaNeutralizar;
    
    // Pontos para neutralizar custam 1 cada (mas não aumentam efetivamente)
    // Pontos para evoluir custam 1 cada (aumentam efetivamente)
    custoReal = pontosParaNeutralizar + pontosParaEvoluir;
  } else {
    // Diminuindo, custo negativo (ganha esferas de volta)
    custoReal = aumento;
  }
  
  return custoReal;
}

/**
 * Obtém a classe CSS para a esfera de um atributo com penalidade
 * @param {Object} personagem - Objeto do personagem
 * @param {string} atributo - Nome do atributo
 * @param {number} esferasAtuais - Esferas atuais no atributo
 * @returns {string} Classe CSS ('', 'vermelha', 'preta')
 */
export function getClasseEsferaAtributo(personagem, atributo, esferasAtuais) {
  const penalidade = getPenalidadeAtributo(personagem, atributo);
  
  if (!penalidade.temPenalidade) return '';
  
  if (esferasAtuais === 0) return 'vermelha';
  
  if (esferasAtuais < penalidade.valor) return 'vermelha';
  
  if (esferasAtuais === penalidade.valor) return 'preta';
  
  return '';
}

// ============================================
// EXPORTAÇÃO PADRÃO
// ============================================
export default {
  RACAS_CONFIG,
  aplicarRaca,
  removerRaca,
  getModificadoresRaca,
  getListaRacas,
  getCargaLimitesRaca,
  getReducaoCorrerRaca,
  getModificadorPericiaRaca,
  getPenalidadeAtributo,
  calcularCustoAtributoComRaca,
  getClasseEsferaAtributo
};