// FILE: testes.js
// ============================================
// SISTEMA DE TESTES E PERÍCIAS - AKALANATA SOLO
// ============================================

// ===== CATÁLOGO DE PERÍCIAS =====
const CATALOGO_PERICIAS = [
    // Perícias de Combate (Físicas - base DX)
    { id: "espada", nome: "Espada", tipo: "fisica", atributo: "dx", descricao: "Lutar com espadas de todos os tipos." },
    { id: "arco", nome: "Arco", tipo: "fisica", atributo: "dx", descricao: "Atirar com arcos longos e curtos." },
    { id: "besta", nome: "Besta", tipo: "fisica", atributo: "dx", descricao: "Usar bestas leves e pesadas." },
    { id: "escudo", nome: "Escudo", tipo: "fisica", atributo: "dx", descricao: "Bloquear ataques com escudo." },
    { id: "briga", nome: "Briga", tipo: "fisica", atributo: "dx", descricao: "Lutar desarmado ou com armas improvisadas." },
    { id: "machado", nome: "Machado", tipo: "fisica", atributo: "dx", descricao: "Manusear machados de batalha." },
    { id: "lanca", nome: "Lança", tipo: "fisica", atributo: "dx", descricao: "Usar lanças e armas de haste." },
    { id: "adaga", nome: "Adaga", tipo: "fisica", atributo: "dx", descricao: "Lutar com adagas e facas." },
    
    // Perícias Físicas (base DX)
    { id: "acrobacia", nome: "Acrobacia", tipo: "fisica", atributo: "dx", descricao: "Saltos, quedas, equilíbrio e cambalhotas." },
    { id: "furtividade", nome: "Furtividade", tipo: "fisica", atributo: "dx", descricao: "Mover-se sem ser notado." },
    { id: "cavalgar", nome: "Cavalgar", tipo: "fisica", atributo: "dx", descricao: "Montar e controlar cavalos." },
    { id: "natacao", nome: "Natação", tipo: "fisica", atributo: "dx", descricao: "Nadar em águas calmas ou turbulentas." },
    { id: "fuga", nome: "Fuga", tipo: "fisica", atributo: "dx", descricao: "Escapar de amarras e situações." },
    { id: "arremesso", nome: "Arremesso", tipo: "fisica", atributo: "dx", descricao: "Arremessar objetos com precisão." },
    
    // Perícias Mentais (base IQ)
    { id: "persuasao", nome: "Persuasão", tipo: "mental", atributo: "iq", descricao: "Convencer outros com argumentos." },
    { id: "intimidacao", nome: "Intimidação", tipo: "mental", atributo: "iq", descricao: "Amedrontar através de ameaças." },
    { id: "observar", nome: "Observar", tipo: "mental", atributo: "iq", descricao: "Perceber detalhes no ambiente." },
    { id: "sobrevivencia", nome: "Sobrevivência", tipo: "mental", atributo: "iq", descricao: "Rastrear, caçar, acampar, encontrar alimentos." },
    { id: "medicina", nome: "Medicina", tipo: "mental", atributo: "iq", descricao: "Curar ferimentos e doenças." },
    { id: "historia", nome: "História", tipo: "mental", atributo: "iq", descricao: "Conhecimento sobre o passado." },
    { id: "arqueologia", nome: "Arqueologia", tipo: "mental", atributo: "iq", descricao: "Entender ruínas e artefatos antigos." },
    { id: "comercio", nome: "Comércio", tipo: "mental", atributo: "iq", descricao: "Negociar preços justos." },
    { id: "detectarMentira", nome: "Detectar Mentira", tipo: "mental", atributo: "iq", descricao: "Perceber quando alguém mente." },
    { id: "adestramento", nome: "Adestramento", tipo: "mental", atributo: "iq", descricao: "Treinar e comandar animais." },
    { id: "alquimia", nome: "Alquimia", tipo: "mental", atributo: "iq", descricao: "Criar poções e compostos." },
    { id: "primeirosSocorros", nome: "Primeiros Socorros", tipo: "mental", atributo: "iq", descricao: "Estabilizar feridos." },
    { id: "rastreamento", nome: "Rastreamento", tipo: "mental", atributo: "iq", descricao: "Seguir pistas e rastros." },
    { id: "oratoria", nome: "Oratória", tipo: "mental", atributo: "iq", descricao: "Falar para multidões." }
];

// ===== TABELA DE DIFICULDADE (CDs) =====
const TABELA_CD = {
    "trivial": 5,
    "facil": 10,
    "medio": 15,
    "desafiador": 20,
    "dificil": 25,
    "muito_dificil": 30,
    "heroico": 35,
    "quase_impossivel": 40
};

// ===== ROLAR 2d10 PARA PORCENTAGEM =====
function rolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const dado2 = Math.floor(Math.random() * 10) + 1; // 1-10
    
    const dezena = dado1 === 10 ? 0 : dado1;
    const unidade = dado2 === 10 ? 0 : dado2;
    
    const resultado = (dezena * 10) + unidade;
    
    return {
        dezena: dado1,
        unidade: dado2,
        resultado: resultado === 0 ? 100 : resultado,
        str: `[${dado1}][${dado2}] = ${resultado === 0 ? 100 : resultado}`
    };
}

// ===== ROLAR DADOS GENÉRICOS (formato "XdY+Z") =====
function rolarDados(formula) {
    const regex = /(\d+)d(\d+)([+-]\d+)?/i;
    const match = formula.match(regex);
    
    if (!match) {
        const regex2 = /(\d+)d(\d+)([+-])(\d+)?/i;
        const match2 = formula.match(regex2);
        if (match2) {
            const quantidade = parseInt(match2[1]) || 1;
            const faces = parseInt(match2[2]) || 6;
            const operador = match2[3];
            const modificador = parseInt(match2[4]) || 0;
            
            let total = 0;
            for (let i = 0; i < quantidade; i++) {
                total += Math.floor(Math.random() * faces) + 1;
            }
            
            if (operador === '+') total += modificador;
            else total -= modificador;
            
            return Math.max(1, total);
        }
        return 0;
    }
    
    const quantidade = parseInt(match[1]) || 1;
    const faces = parseInt(match[2]) || 20;
    const modificador = parseInt(match[3]) || 0;
    
    let total = 0;
    for (let i = 0; i < quantidade; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    
    return total + modificador;
}

// ===== CALCULAR BÔNUS DE ATRIBUTO =====
function getAtributoPercentual(personagem, atributo) {
    if (!personagem || !atributo) return 40;
    
    const esferas = personagem.atributos?.[atributo]?.esferas || 0;
    
    switch(atributo) {
        case 'st': return 40 + (esferas * 3);
        case 'dx': return 40 + (esferas * 2);
        case 'iq': return 40 + (esferas * 2);
        case 'vigor': return 40 + (esferas * 3);
        default: return 40;
    }
}

// ===== CALCULAR NH (Nível de Habilidade) DE PERÍCIA =====
function calcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
    const periciaInfo = CATALOGO_PERICIAS.find(p => p.id === periciaId);
    
    let atributoBase = 40;
    if (periciaInfo) {
        if (periciaInfo.atributo === 'dx') {
            const dxEsferas = personagem.atributos?.dx?.esferas || 0;
            atributoBase = 40 + (dxEsferas * 2);
        } else if (periciaInfo.atributo === 'iq') {
            const iqEsferas = personagem.atributos?.iq?.esferas || 0;
            atributoBase = 40 + (iqEsferas * 2);
        }
    }
    
    const bonusPericia = nivel * 4;
    
    let bonusVantagens = 0;
    if (personagem.vantagens) {
        if (personagem.vantagens.includes('reflexosRapidos') && periciaInfo?.tipo === 'fisica') {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('carisma') && (periciaId === 'persuasao' || periciaId === 'oratoria')) {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('aptidaoMagica') && periciaId === 'alquimia') {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('orientacaoExplorador') && (periciaId === 'sobrevivencia' || periciaId === 'rastreamento')) {
            bonusVantagens += 5;
        }
    }
    
    const nh = atributoBase + bonusPericia + bonusVantagens;
    
    return Math.min(95, Math.max(5, nh));
}

// ===== TESTE DE PERÍCIA COMPLETO =====
function testarPericia(personagem, periciaId, cd = null, modificador = 0) {
    if (!personagem) {
        return {
            sucesso: false,
            critico: false,
            falhaCritica: false,
            resultado: 0,
            nh: 0,
            mensagem: "Personagem inválido"
        };
    }
    
    const nh = calcularNH(personagem, periciaId) + modificador;
    const rolagem = rolar2d10();
    
    const critico = rolagem.resultado <= 5;
    const falhaCritica = rolagem.resultado >= 96;
    
    let sucesso = false;
    if (critico) {
        sucesso = true;
    } else if (falhaCritica) {
        sucesso = false;
    } else {
        sucesso = rolagem.resultado <= (cd !== null ? cd : nh);
    }
    
    const periciaInfo = CATALOGO_PERICIAS.find(p => p.id === periciaId);
    const nomePericia = periciaInfo ? periciaInfo.nome : periciaId;
    
    return {
        sucesso,
        critico,
        falhaCritica,
        nh,
        cd: cd !== null ? cd : nh,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        margem: sucesso ? (cd !== null ? cd : nh) - rolagem.resultado : rolagem.resultado - (cd !== null ? cd : nh),
        periciaId,
        nomePericia,
        mensagem: `${sucesso ? '✅ SUCESSO' : '❌ FALHA'} em ${nomePericia} | Rolagem: ${rolagem.str} | ${cd !== null ? 'CD' : 'NH'}: ${cd !== null ? cd : nh}%${critico ? ' (CRÍTICO!)' : ''}${falhaCritica ? ' (FALHA CRÍTICA!)' : ''}`
    };
}

// ===== TESTE RESISTIDO (dois personagens) =====
function testeResistido(personagem1, pericia1, personagem2, pericia2, modificador1 = 0, modificador2 = 0) {
    const teste1 = testarPericia(personagem1, pericia1, null, modificador1);
    const teste2 = testarPericia(personagem2, pericia2, null, modificador2);
    
    let vencedor = null;
    let mensagem = "";
    
    if (teste1.critico && !teste2.critico) {
        vencedor = 1;
        mensagem = `${personagem1.nome} vence com CRÍTICO!`;
    } else if (teste2.critico && !teste1.critico) {
        vencedor = 2;
        mensagem = `${personagem2.nome} vence com CRÍTICO!`;
    } else if (teste1.sucesso && !teste2.sucesso) {
        vencedor = 1;
        mensagem = `${personagem1.nome} vence (sucesso vs falha)`;
    } else if (teste2.sucesso && !teste1.sucesso) {
        vencedor = 2;
        mensagem = `${personagem2.nome} vence (sucesso vs falha)`;
    } else if (teste1.sucesso && teste2.sucesso) {
        if (teste1.margem > teste2.margem) {
            vencedor = 1;
            mensagem = `${personagem1.nome} vence por margem (${teste1.margem} vs ${teste2.margem})`;
        } else if (teste2.margem > teste1.margem) {
            vencedor = 2;
            mensagem = `${personagem2.nome} vence por margem (${teste2.margem} vs ${teste1.margem})`;
        } else {
            mensagem = `EMPATE! Ambos com margem ${teste1.margem}`;
        }
    } else {
        mensagem = `Ambos falharam!`;
    }
    
    return {
        vencedor,
        teste1,
        teste2,
        mensagem
    };
}

// ===== TESTE DE ATRIBUTO =====
function testarAtributo(personagem, atributo, cd = 15, modificador = 0) {
    if (!personagem) return null;
    
    const percentual = getAtributoPercentual(personagem, atributo) + modificador;
    const rolagem = rolar2d10();
    
    const critico = rolagem.resultado <= 5;
    const falhaCritica = rolagem.resultado >= 96;
    
    let sucesso = false;
    if (critico) {
        sucesso = true;
    } else if (falhaCritica) {
        sucesso = false;
    } else {
        sucesso = rolagem.resultado <= cd;
    }
    
    return {
        sucesso,
        critico,
        falhaCritica,
        percentual,
        cd,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        atributo,
        mensagem: `${sucesso ? '✅ SUCESSO' : '❌ FALHA'} em teste de ${atributo.toUpperCase()} | Rolagem: ${rolagem.str} vs CD ${cd}`
    };
}

// ===== BUSCAR PERÍCIA POR NOME OU ID =====
function buscarPericia(termo) {
    const termoLower = termo.toLowerCase();
    return CATALOGO_PERICIAS.filter(p => 
        p.nome.toLowerCase().includes(termoLower) || 
        p.id.toLowerCase().includes(termoLower)
    );
}

// ===== LISTAR PERÍCIAS DO PERSONAGEM =====
function listarPericiasPersonagem(personagem) {
    if (!personagem || !personagem.pericias) return [];
    
    const lista = [];
    for (const [id, dados] of Object.entries(personagem.pericias)) {
        const info = CATALOGO_PERICIAS.find(p => p.id === id);
        if (info) {
            lista.push({
                id,
                nome: info.nome,
                nivel: dados.nivel || 0,
                tipo: info.tipo,
                nh: calcularNH(personagem, id)
            });
        }
    }
    
    return lista.sort((a, b) => a.nome.localeCompare(b.nome));
}

// ===== VERIFICAR SE PODE USAR PERÍCIA =====
function podeUsarPericia(personagem, periciaId) {
    if (!personagem) return false;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return false;
    
    return (pericia.nivel || 0) > 0;
}

// ===== CALCULAR BÔNUS DE SITUAÇÃO =====
function bonusSituacao(descricao) {
    const bonusMap = {
        "vantagem_esmagadora": 10,
        "vantagem_significativa": 5,
        "vantagem_pequena": 2,
        "desvantagem_pequena": -2,
        "desvantagem_significativa": -5,
        "desvantagem_esmagadora": -10,
        "ferramentas_adequadas": 3,
        "ferramentas_improvisadas": -3,
        "ajuda": 4,
        "pressa": -3,
        "cuidadoso": 2
    };
    
    return bonusMap[descricao] || 0;
}

// ✅ CORREÇÃO: Expor TUDO ao window no browser
if (typeof window !== 'undefined') {
    window.CATALOGO_PERICIAS = CATALOGO_PERICIAS;
    window.TABELA_CD = TABELA_CD;
    window.rolar2d10 = rolar2d10;
    window.rolarDados = rolarDados;
    window.getAtributoPercentual = getAtributoPercentual;
    window.calcularNH = calcularNH;
    window.testarPericia = testarPericia;
    window.testeResistido = testeResistido;
    window.testarAtributo = testarAtributo;
    window.buscarPericia = buscarPericia;
    window.listarPericiasPersonagem = listarPericiasPersonagem;
    window.podeUsarPericia = podeUsarPericia;
    window.bonusSituacao = bonusSituacao;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CATALOGO_PERICIAS,
        TABELA_CD,
        rolar2d10,
        rolarDados,
        getAtributoPercentual,
        calcularNH,
        testarPericia,
        testeResistido,
        testarAtributo,
        buscarPericia,
        listarPericiasPersonagem,
        podeUsarPericia,
        bonusSituacao
    };
}