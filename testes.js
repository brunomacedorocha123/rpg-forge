// FILE: testes.js
// ============================================
// TESTES.JS - SISTEMA DE PERÍCIAS E ROLAGENS
// ============================================

// ===== TABELA DE PERÍCIAS =====
const CATALOGO_PERICIAS = [
    // Perícias Mentais (IQ)
    { id: "persuasao", nome: "Persuasão", tipo: "mental", atributo: "iq", descricao: "Convencer outros com palavras." },
    { id: "intimidacao", nome: "Intimidação", tipo: "mental", atributo: "iq", descricao: "Amedrontar através de ameaças." },
    { id: "observar", nome: "Observar", tipo: "mental", atributo: "iq", descricao: "Perceber detalhes no ambiente." },
    { id: "sobrevivencia", nome: "Sobrevivência", tipo: "mental", atributo: "iq", descricao: "Rastrear, caçar, acampar." },
    { id: "medicina", nome: "Medicina", tipo: "mental", atributo: "iq", descricao: "Curar ferimentos e doenças." },
    { id: "historia", nome: "História", tipo: "mental", atributo: "iq", descricao: "Conhecimento sobre o passado." },
    { id: "arqueologia", nome: "Arqueologia", tipo: "mental", atributo: "iq", descricao: "Entender ruínas e artefatos." },
    { id: "comercio", nome: "Comércio", tipo: "mental", atributo: "iq", descricao: "Negociar preços justos." },
    { id: "detectarMentira", nome: "Detectar Mentira", tipo: "mental", atributo: "iq", descricao: "Perceber quando alguém mente." },
    
    // Perícias Físicas (DX)
    { id: "espada", nome: "Espada", tipo: "fisica", atributo: "dx", descricao: "Lutar com espadas." },
    { id: "arco", nome: "Arco", tipo: "fisica", atributo: "dx", descricao: "Atirar com arcos." },
    { id: "escudo", nome: "Escudo", tipo: "fisica", atributo: "dx", descricao: "Bloquear com escudo." },
    { id: "fuga", nome: "Fuga", tipo: "fisica", atributo: "dx", descricao: "Escapar de amarras e situações." },
    { id: "furtividade", nome: "Furtividade", tipo: "fisica", atributo: "dx", descricao: "Mover-se sem ser notado." },
    { id: "acrobacia", nome: "Acrobacia", tipo: "fisica", atributo: "dx", descricao: "Saltos, quedas, equilíbrio." },
    { id: "cavalgar", nome: "Cavalgar", tipo: "fisica", atributo: "dx", descricao: "Montar e controlar cavalos." },
    { id: "natacao", nome: "Natação", tipo: "fisica", atributo: "dx", descricao: "Nadar em águas calmas ou turbulentas." }
];

// ===== CALCULAR BÔNUS DE PERÍCIA =====
function calcularBonusPericia(personagem, periciaId) {
    if (!personagem || !periciaId) return 0;
    
    // Pegar nível da perícia
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 0;
    
    const nivel = pericia.nivel || 0;
    
    // Bônus base: +4% por nível
    let bonus = nivel * 4;
    
    // Bônus por atributo
    const periciaInfo = CATALOGO_PERICIAS.find(p => p.id === periciaId);
    if (periciaInfo) {
        if (periciaInfo.atributo === 'iq') {
            const iqEsferas = personagem.atributos?.iq?.esferas || 0;
            bonus += 40 + (iqEsferas * 2); // IQ base
        } else if (periciaInfo.atributo === 'dx') {
            const dxEsferas = personagem.atributos?.dx?.esferas || 0;
            bonus += 40 + (dxEsferas * 2); // DX base
        }
    }
    
    // Bônus por vantagens
    if (personagem.vantagens) {
        if (personagem.vantagens.includes('carisma') && periciaId === 'persuasao') {
            bonus += 5;
        }
        if (personagem.vantagens.includes('reflexosRapidos') && periciaInfo?.tipo === 'fisica') {
            bonus += 5;
        }
    }
    
    return Math.min(95, bonus); // Máximo 95%
}

// ===== ROLAR TESTE DE PERÍCIA =====
function rolarTestePericia(personagem, periciaId, cd = 10, modificador = 0) {
    if (!personagem) {
        return {
            sucesso: false,
            critico: false,
            falhaCritica: false,
            valorRolado: 0,
            chance: 0,
            mensagem: "Personagem inválido"
        };
    }
    
    // Calcular chance de sucesso
    const bonus = calcularBonusPericia(personagem, periciaId);
    const chance = Math.min(95, bonus + modificador);
    
    // Rolar d100
    const valorRolado = Math.floor(Math.random() * 100) + 1;
    
    // Verificar crítico (5 ou menos)
    const critico = valorRolado <= 5;
    
    // Verificar falha crítica (96 ou mais)
    const falhaCritica = valorRolado >= 96;
    
    // Verificar sucesso (valorRolado <= chance)
    let sucesso = false;
    if (critico) {
        sucesso = true; // Crítico sempre sucesso
    } else if (falhaCritica) {
        sucesso = false; // Falha crítica sempre falha
    } else {
        sucesso = valorRolado <= chance;
    }
    
    // Se CD for especificado, usar CD em vez da chance
    if (cd > 0) {
        sucesso = valorRolado <= cd;
    }
    
    return {
        sucesso,
        critico,
        falhaCritica,
        valorRolado,
        chance,
        cd,
        bonus,
        periciaId,
        mensagem: `${sucesso ? '✅ SUCESSO' : '❌ FALHA'} | Rolou: ${valorRolado} | Chance: ${chance}%${critico ? ' (CRÍTICO!)' : ''}${falhaCritica ? ' (FALHA CRÍTICA!)' : ''}`
    };
}

// ===== ROLAR DADO GENÉRICO =====
function rolarDado(lados = 20, quantidade = 1) {
    let total = 0;
    const resultados = [];
    
    for (let i = 0; i < quantidade; i++) {
        const resultado = Math.floor(Math.random() * lados) + 1;
        resultados.push(resultado);
        total += resultado;
    }
    
    return {
        total,
        resultados,
        lados,
        quantidade,
        mensagem: `${quantidade}d${lados}: [${resultados.join(', ')}] = ${total}`
    };
}

// ===== ENCONTRAR PERÍCIA PELO NOME =====
function encontrarPericia(termo) {
    const termoLower = termo.toLowerCase();
    return CATALOGO_PERICIAS.filter(p => 
        p.nome.toLowerCase().includes(termoLower) || 
        p.id.toLowerCase().includes(termoLower)
    );
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CATALOGO_PERICIAS, 
        calcularBonusPericia, 
        rolarTestePericia, 
        rolarDado,
        encontrarPericia
    };
}