// ============================================
// SISTEMA DE RAÇAS - RPGForce
// ARQUIVO: racas.js
// ============================================

// ============================================
// DADOS DA RAÇA ANÃO
// ============================================
export const racaAnao = {
    id: 'anao',
    nome: 'Anão',
    descricao: 'Baixos, robustos e resistentes. Os anões são conhecidos por sua força física, habilidade com forjas e uma teimosia lendária. Vivem em montanhas e são mestres na arte da guerra e da ourivesaria.',
    icone: '⛏️',
    cor: '#cd7f32',
    
    // Custo: 4 pontos do saldo de esferas
    custoPontos: 4,
    
    // Bônus diretos nos atributos
    bonusAtributos: {
        st: 3,      // +3 Força
        dx: 0,
        iq: 0,
        vigor: 1,   // +1 Vigor
        vt: 1       // +1 Vitalidade
    },
    
    // Vantagens que são adicionadas automaticamente
    vantagensAuto: ['corpoResistente'],
    
    // Desvantagens que são adicionadas automaticamente
    desvantagensAuto: ['avareza', 'nanismo'],
    
    // Bônus de perícia (em percentual)
    periciasBonus: {
        'armasHaste': 3,    // +3% em Armas de Haste
        'armaria': 2,       // +2% em Armaria
        'funda': -2,        // -2% em Funda
        'arco': -2,         // -2% em Arco
        'arremesso': -2     // -2% em Arremesso
    },
    
    // Tabela de carga específica do Anão (leve, medio, pesado, limite)
    cargaPersonalizada: {
        leve: 2.5,
        medio: 5.0,
        pesado: 9.0,
        limite: 13.0
    },
    
    // Modificadores de deslocamento
    deslocamentoAndarBonus: -1,        // -1 metro no deslocamento de andar
    deslocamentoCorrerPercentual: -25  // -25% no deslocamento de correr (arredondado para baixo)
};

// ============================================
// FUNÇÃO PARA APLICAR BÔNUS DO ANÃO
// ============================================
export function aplicarBonusAnao(personagem) {
    if (!personagem) return personagem;
    
    const resultado = { ...personagem };
    
    // Aplica bônus nos atributos
    if (!resultado.atributos) resultado.atributos = {};
    
    resultado.atributos.st = (resultado.atributos.st || 5) + racaAnao.bonusAtributos.st;
    resultado.atributos.vigor = (resultado.atributos.vigor || 5) + racaAnao.bonusAtributos.vigor;
    resultado.atributos.vt = (resultado.atributos.vt || 5) + racaAnao.bonusAtributos.vt;
    
    // Garante limites (1 a 15)
    resultado.atributos.st = Math.min(15, Math.max(1, resultado.atributos.st));
    resultado.atributos.vigor = Math.min(15, Math.max(1, resultado.atributos.vigor));
    resultado.atributos.vt = Math.min(15, Math.max(1, resultado.atributos.vt));
    
    return resultado;
}

// ============================================
// FUNÇÃO PARA CALCULAR CARGA DO ANÃO
// ============================================
export function calcularCargaAnao(st) {
    // Usa a tabela personalizada do Anão, independente do ST
    return {
        leve: racaAnao.cargaPersonalizada.leve,
        medio: racaAnao.cargaPersonalizada.medio,
        pesado: racaAnao.cargaPersonalizada.pesado,
        limite: racaAnao.cargaPersonalizada.limite
    };
}

// ============================================
// FUNÇÃO PARA CALCULAR DESLOCAMENTO DO ANÃO
// ============================================
export function calcularDeslocamentoAnao(deslocamentoOriginal) {
    const andar = Math.max(1, deslocamentoOriginal.andar + racaAnao.deslocamentoAndarBonus);
    
    // Correr: reduz em 25% (arredondado para baixo)
    let correr = deslocamentoOriginal.correr;
    const reducao = Math.floor(correr * Math.abs(racaAnao.deslocamentoCorrerPercentual) / 100);
    correr = Math.max(3, correr - reducao);
    
    return { andar, correr };
}

// ============================================
// FUNÇÃO PARA OBTER BÔNUS DE PERÍCIA DO ANÃO
// ============================================
export function getBonusPericiaAnao(periciaId, bonusAtual = 0) {
    const bonusRaca = racaAnao.periciasBonus[periciaId] || 0;
    return bonusAtual + bonusRaca;
}

// ============================================
// FUNÇÃO PARA VERIFICAR SE RAÇA ESTÁ ATIVA
// ============================================
export function isRacaAnao(racaSelecionada) {
    return racaSelecionada === 'anao';
}