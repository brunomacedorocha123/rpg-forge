// ============================================
// ARQUIVO: racas.js
// VERSÃO: 1.0
// DESCRIÇÃO: Todas as configurações de raças do sistema
// ============================================

const RACAS = {
    humano: {
        id: "humano",
        nome: "Humano",
        esferas: 0,              // não paga esferas
        pp: 0,                   // não modifica PP
        carga: "padrao",         // carga padrão (2x/4x/8x/12x)
        deslocamento: "padrao",  // deslocamento padrão
        reacoes: 0,              // sem modificador social
        atributos: {},           // sem modificadores de atributos
        vantagensFixas: [],      // sem vantagens fixas
        desvantagensFixas: [],   // sem desvantagens fixas
        pericias: {}             // sem bônus de perícias
    },
    
   elfo: {
    id: "elfo",
    nome: "Elfo",
    esferas: -1,             // paga 1 esfera (6-1=5)
    pp: 0,
    carga: "padrao",
    deslocamento: "padrao",
    reacoes: 0,
    vantagensExtras: 1,      // ← ADICIONE ESTA LINHA
    atributos: {
        dx: 1,               // +1 Destreza
        st: -1,              // -1 Força
        vigor: -1            // -1 Vigor
    },
    vantagensFixas: [
        "aptidaoMagica",     // Aptidão Mágica
        "maosRapidas",       // Mãos Rápidas
        "carisma",           // Carisma
        "sentidosAgucados"   // Sentidos Aguçados
    ],
    desvantagensFixas: [
        "sensoDever"         // Senso do Dever
    ],
    pericias: {
        arco: 3,             // +3% em Arco
        sociabilidade: 2     // +2% em Sociabilidade
    }
},
    
    anao: {
        id: "anao",
        nome: "Anão",
        esferas: -1,             // paga 1 esfera (6-1=5)
        pp: 0,
        carga: "anao",           // carga especial (2.5x/5x/9x/13x)
        deslocamento: "anao",    // deslocamento especial (-1m andar, correr metade)
        reacoes: 0,
        atributos: {
            st: 2,               // +2 Força
            vigor: 1             // +1 Vigor
        },
        vantagensFixas: [
            "corpoResistente"    // Corpo Resistente
        ],
        desvantagensFixas: [
            "nanismo"            // Nanismo
        ],
        desvantagensOpcionais: [   // jogador escolhe 1
            "avareza",           // Avareza
            "cobica"             // Cobiça
        ],
        pericias: {
            armasHaste: 3,       // +3% em Armas de Haste
            arremesso: -2        // -2% em Arremesso
        }
    },
    
    goblin: {
        id: "goblin",
        nome: "Goblin",
        esferas: 0,              // não paga esferas (6 esferas)
        pp: 0,
        carga: "goblin",         // carga reduzida (1.5x/3x/6x/10x)
        deslocamento: "padrao",  // deslocamento normal
        reacoes: -10,            // -10% em reações sociais
        atributos: {
            dx: 1,               // +1 Destreza
            st: -1               // -1 Força
        },
        vantagensFixas: [
            "visaoNoturna"       // Visão Noturna
        ],
        desvantagensFixas: [
            "magreza"            // Magreza
        ],
        pericias: {
            furtividade: 3,      // +3% em Furtividade
            esconder_se: 3       // +3% em Esconder-se
        }
    }
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Retorna os multiplicadores de carga para cada tipo de raça
 * @param {string} tipo - "padrao", "anao", "goblin"
 * @returns {object} { leve, medio, pesado, limite }
 */
function getCargaMultiplicadores(tipo) {
    const multiplicadores = {
        padrao: { leve: 2, medio: 4, pesado: 8, limite: 12 },
        anao: { leve: 2.5, medio: 5, pesado: 9, limite: 13 },
        goblin: { leve: 1.5, medio: 3, pesado: 6, limite: 10 }
    };
    return multiplicadores[tipo] || multiplicadores.padrao;
}

/**
 * Retorna os modificadores de deslocamento para cada tipo de raça
 * @param {string} tipo - "padrao", "anao"
 * @returns {object} { andar, correrMultiplicador }
 */
function getDeslocamentoModificadores(tipo) {
    const modificadores = {
        padrao: { andar: 0, correrMultiplicador: 1 },
        anao: { andar: -1, correrMultiplicador: 0.5 }  // correr metade
    };
    return modificadores[tipo] || modificadores.padrao;
}

/**
 * Retorna os dados completos de uma raça
 * @param {string} racaId - "humano", "elfo", "anao", "goblin"
 * @returns {object} Dados da raça
 */
function getDadosRaca(racaId) {
    return RACAS[racaId] || RACAS.humano;
}

/**
 * Verifica se uma raça existe
 * @param {string} racaId 
 * @returns {boolean}
 */
function racaExiste(racaId) {
    return !!RACAS[racaId];
}

/**
 * Retorna lista de todas as raças disponíveis
 * @returns {array} Lista de raças
 */
function getListaRacas() {
    return Object.keys(RACAS).map(key => ({
        id: key,
        nome: RACAS[key].nome
    }));
}

// ============================================
// EXPORTAÇÃO (para usar com módulos, se necessário)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        RACAS, 
        getCargaMultiplicadores, 
        getDeslocamentoModificadores,
        getDadosRaca,
        racaExiste,
        getListaRacas
    };
} 