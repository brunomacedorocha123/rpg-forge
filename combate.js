// FILE: combate.js
// ============================================
// SISTEMA DE COMBATE AKALANATA SOLO
// ============================================

// ===== CONSTANTES =====
const INIMIGOS = {
    "saqueador_faminto": {
        id: "saqueador_faminto",
        nome: "Saqueador Faminto",
        vida: 25,
        vidaMax: 25,
        descricao: "Homem magro, roupas rasgadas e aparência cansada. Ele parece desesperado e mal treinado.",
        equipamento: "Pedaço de madeira",
        armadura: 0,
        danoFormula: "1d8",
        danoBase: 4,
        forca: 8,
        destreza: 10,
        vigor: 9,
        inteligencia: 6,
        pericias: {
            briga: 1
        },
        derivados: {
            esquiva: 35,
            aparar: 0,
            bloqueio: 0,
            rdExtra: 0
        },
        agressividade: 0.8,
        portrait: "imagens/npc-sangue.png",
        experiencia: 50,
        ouro: 1
    },
    
    "lobo_solitario": {
        id: "lobo_solitario",
        nome: "Lobo Solitário",
        vida: 18,
        vidaMax: 18,
        descricao: "Um lobo magro, olhos famintos brilhando na escuridão.",
        equipamento: "Presas e garras",
        armadura: 1,
        danoFormula: "1d6",
        danoBase: 3,
        forca: 7,
        destreza: 12,
        vigor: 8,
        inteligencia: 4,
        pericias: {
            briga: 2
        },
        derivados: {
            esquiva: 45,
            aparar: 0,
            bloqueio: 0,
            rdExtra: 0
        },
        agressividade: 0.9,
        portrait: "imagens/lobo.png",
        experiencia: 30,
        ouro: 0
    }
};

// ===== TABELA DE DANO POR ST (FORÇA) =====
const TABELA_DANO_ST = {
    0: "1d-3", 1: "1d-2", 2: "1d-1", 3: "1d-1", 4: "1d", 5: "1d",
    6: "1d+1", 7: "1d+1", 8: "1d+2", 9: "1d+2", 10: "2d-1", 11: "2d-1",
    12: "2d", 13: "2d", 14: "2d+1", 15: "2d+1", 16: "2d+2", 17: "2d+2",
    18: "3d-1", 19: "3d-1", 20: "3d"
};

// ===== ROLAR DADOS (formato "XdY+Z") =====
function rolarDados(formula) {
    // Suporta formatos como "1d8", "2d6+2", "1d-1"
    const regex = /(\d+)d(\d+)([+-]\d+)?/i;
    const match = formula.match(regex);
    
    if (!match) {
        // Tenta formato simples com modificador tipo "1d-1"
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
    const faces = parseInt(match[2]) || 8;
    const modificador = parseInt(match[3]) || 0;
    
    let total = 0;
    for (let i = 0; i < quantidade; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    
    return total + modificador;
}

// ===== ROLAR 2d10 PARA PORCENTAGEM =====
function rolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const dado2 = Math.floor(Math.random() * 10) + 1; // 1-10
    
    // O primeiro dado é a dezena, o segundo é a unidade
    // 1-10 viram 01-10? Não, 10 vira 0? Vamos fazer:
    // Se der 10, considera 0
    const dezena = dado1 === 10 ? 0 : dado1;
    const unidade = dado2 === 10 ? 0 : dado2;
    
    const resultado = (dezena * 10) + unidade;
    
    return {
        dezena: dado1,
        unidade: dado2,
        resultado: resultado === 0 ? 100 : resultado, // 00 vira 100
        str: `[${dado1}][${dado2}] = ${resultado === 0 ? 100 : resultado}`
    };
}

// ===== CALCULAR DANO DO PERSONAGEM =====
function calcularDanoPersonagem(personagem, arma = null) {
    if (!personagem) return 1;
    
    const esferasST = personagem.atributos?.st?.esferas || 0;
    const danoBaseFormula = TABELA_DANO_ST[esferasST] || "1d-3";
    
    let dano = rolarDados(danoBaseFormula);
    
    // Se tiver arma, adiciona bônus
    if (arma && arma.dano) {
        if (typeof arma.dano === 'string') {
            if (arma.dano.includes('d')) {
                dano += rolarDados(arma.dano);
            } else {
                // Bônus fixo tipo "+2"
                const bonus = parseInt(arma.dano.replace(/[^0-9-]/g, '')) || 0;
                dano += bonus;
            }
        }
    }
    
    return Math.max(1, dano);
}

// ===== CALCULAR NH (Nível de Habilidade) DE PERÍCIA =====
function calcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    // Buscar perícia no personagem
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5; // NH 5% sem perícia
    
    const nivel = pericia.nivel || 0;
    
    // Determinar atributo base da perícia
    let atributoBase = 40; // Base 40%
    
    // Mapeamento de perícias para atributos (simplificado)
    const periciasFisicas = ['espada', 'arco', 'escudo', 'fuga', 'furtividade', 'acrobacia', 'cavalgar', 'natacao', 'briga'];
    const periciasMentais = ['persuasao', 'intimidacao', 'observar', 'sobrevivencia', 'medicina', 'historia', 'arqueologia', 'comercio', 'detectarMentira'];
    
    if (periciasFisicas.includes(periciaId)) {
        // Usa DX
        const dxEsferas = personagem.atributos?.dx?.esferas || 0;
        atributoBase = 40 + (dxEsferas * 2);
    } else if (periciasMentais.includes(periciaId)) {
        // Usa IQ
        const iqEsferas = personagem.atributos?.iq?.esferas || 0;
        atributoBase = 40 + (iqEsferas * 2);
    }
    
    // Bônus por nível da perícia (+4% por nível)
    const bonusPericia = nivel * 4;
    
    // Bônus por vantagens
    let bonusVantagens = 0;
    if (personagem.vantagens) {
        if (personagem.vantagens.includes('reflexosRapidos') && periciasFisicas.includes(periciaId)) {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('carisma') && periciaId === 'persuasao') {
            bonusVantagens += 5;
        }
    }
    
    const nh = atributoBase + bonusPericia + bonusVantagens;
    
    return Math.min(95, Math.max(5, nh));
}

// ===== TESTE DE PERÍCIA COM 2d10 =====
function testarPericia(personagem, periciaId, modificador = 0) {
    if (!personagem) {
        return { sucesso: false, critico: false, falhaCritica: false, resultado: 0, nh: 0 };
    }
    
    const nh = calcularNH(personagem, periciaId) + modificador;
    const rolagem = rolar2d10();
    
    // Crítico: 01-05 (rolagem <= 5)
    const critico = rolagem.resultado <= 5;
    
    // Falha crítica: 96-00 (rolagem >= 96)
    const falhaCritica = rolagem.resultado >= 96;
    
    // Sucesso: rolagem <= NH, a menos que seja crítico/falha crítica
    let sucesso = false;
    if (critico) {
        sucesso = true;
    } else if (falhaCritica) {
        sucesso = false;
    } else {
        sucesso = rolagem.resultado <= nh;
    }
    
    return {
        sucesso,
        critico,
        falhaCritica,
        nh,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        margem: sucesso ? nh - rolagem.resultado : rolagem.resultado - nh,
        periciaId
    };
}

// ===== CALCULAR DEFESAS DO PERSONAGEM =====
function calcularEsquiva(personagem) {
    if (!personagem) return 5;
    
    // Usa o derivado se existir
    if (personagem.derivados && personagem.derivados.esquiva) {
        return personagem.derivados.esquiva;
    }
    
    // Cálculo manual: (DX% + VIG%)/2 + 5
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const vigorEsferas = personagem.atributos?.vigor?.esferas || 0;
    
    const dxPercent = 40 + (dxEsferas * 2);
    const vigorPercent = 40 + (vigorEsferas * 3);
    
    return Math.floor((dxPercent + vigorPercent) / 2) + 5;
}

function calcularAparar(personagem) {
    if (!personagem) return 0;
    
    if (personagem.derivados && personagem.derivados.aparar) {
        return personagem.derivados.aparar;
    }
    
    // Sem arma, não pode aparar
    const temArma = personagem.inventario?.corpo?.some(item => item.dano);
    if (!temArma) return 0;
    
    // Aparar base: DX% + bônus de perícia
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    // Bônus da perícia com espada (se tiver)
    const periciaEspada = personagem.pericias?.espada;
    const bonusPericia = periciaEspada ? (periciaEspada.nivel || 0) * 4 : 0;
    
    return Math.min(80, dxPercent + bonusPericia + 5);
}

function calcularBloqueio(personagem) {
    if (!personagem) return 0;
    
    if (personagem.derivados && personagem.derivados.bloqueio) {
        return personagem.derivados.bloqueio;
    }
    
    // Precisa de escudo
    const temEscudo = personagem.inventario?.corpo?.some(item => item.bonus);
    if (!temEscudo) return 0;
    
    // Bloqueio base: DX% + bônus de perícia + bônus do escudo
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    // Bônus da perícia com escudo (se tiver)
    const periciaEscudo = personagem.pericias?.escudo;
    const bonusPericia = periciaEscudo ? (periciaEscudo.nivel || 0) * 4 : 0;
    
    // Bônus do escudo
    const escudo = personagem.inventario.corpo.find(item => item.bonus);
    const bonusEscudo = escudo?.bonus || 0;
    
    return Math.min(85, dxPercent + bonusPericia + (bonusEscudo * 5));
}

// ===== TESTE DE ATAQUE (Atacante vs Defensor) =====
function testeAtaque(atacante, defensor, tipoDefesa = 'esquiva', periciaAtaque = 'espada') {
    if (!atacante || !defensor) {
        return { acertou: false, mensagem: 'Dados inválidos' };
    }
    
    // Chance de acerto do atacante (usa NH da perícia)
    let nhAtacante = 50; // base
    
    if (atacante.pericias && atacante.pericias[periciaAtaque]) {
        nhAtacante = calcularNH(atacante, periciaAtaque);
    } else if (atacante.pericias && atacante.pericias.briga) {
        nhAtacante = calcularNH(atacante, 'briga');
    }
    
    // Defesa do alvo
    let defesa = 0;
    if (tipoDefesa === 'esquiva') {
        defesa = defensor.derivados?.esquiva || calcularEsquiva(defensor);
    } else if (tipoDefesa === 'aparar') {
        defesa = defensor.derivados?.aparar || calcularAparar(defensor);
    } else if (tipoDefesa === 'bloqueio') {
        defesa = defensor.derivados?.bloqueio || calcularBloqueio(defensor);
    }
    
    // Rolagem 2d10
    const rolagem = rolar2d10();
    
    // Fórmula de acerto: acerta se rolagem <= nhAtacante E rolagem > defesa/2
    // Simplificando: chance = nhAtacante - (defesa/2)
    const chanceFinal = Math.max(10, nhAtacante - (defesa / 2));
    
    const acertou = rolagem.resultado <= chanceFinal;
    
    return {
        acertou,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        nhAtacante,
        defesa,
        chanceFinal: Math.round(chanceFinal * 10) / 10,
        tipoDefesa,
        critico: rolagem.resultado <= 5,
        falhaCritica: rolagem.resultado >= 96
    };
}

// ===== CALCULAR RD TOTAL =====
function calcularRDTotal(personagem) {
    if (!personagem) return 0;
    
    let rd = 0;
    
    // RD extra de vantagens
    if (personagem.vantagens?.includes('corpoResistente')) {
        rd += 2;
    }
    
    // RD de armaduras equipadas
    if (personagem.inventario?.corpo) {
        personagem.inventario.corpo.forEach(item => {
            if (item.rd) rd += item.rd;
        });
    }
    
    // RD de derivados
    if (personagem.derivados?.rdExtra) {
        rd += personagem.derivados.rdExtra;
    }
    
    return rd;
}

// ===== CLASSE DE COMBATE =====
class Combate {
    constructor(personagem, inimigoId, callbacks = {}) {
        this.personagem = personagem;
        this.inimigo = JSON.parse(JSON.stringify(INIMIGOS[inimigoId] || INIMIGOS.saqueador_faminto));
        this.callbacks = callbacks;
        this.turno = 'jogador';
        this.rodada = 1;
        this.fim = false;
        this.log = [];
        
        this.adicionarLog(`⚔️ COMBATE INICIADO - Rodada ${this.rodada}`);
        this.adicionarLog(`${this.personagem.nome} vs ${this.inimigo.nome}`);
    }
    
    adicionarLog(mensagem) {
        this.log.push(mensagem);
        if (this.callbacks.onLog) {
            this.callbacks.onLog(mensagem);
        }
    }
    
    atualizarInterface() {
        if (this.callbacks.onAtualizar) {
            this.callbacks.onAtualizar({
                inimigoVida: this.inimigo.vida,
                inimigoVidaMax: this.inimigo.vidaMax,
                personagemVida: this.personagem.statusCombate?.vidaAtual,
                personagemVidaMax: this.calcularVidaMax(),
                personagemMana: this.personagem.statusCombate?.manaAtual,
                personagemManaMax: this.calcularManaMax(),
                turno: this.turno,
                rodada: this.rodada
            });
        }
    }
    
    calcularVidaMax() {
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
        return vt * 8;
    }
    
    calcularManaMax() {
        const vigor = 5 + (this.personagem.atributos?.vigor?.esferas || 0);
        const iq = 5 + (this.personagem.atributos?.iq?.esferas || 0);
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
        return vigor + iq + vt;
    }
    
    atacar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`👉 ${this.personagem.nome} ataca!`);
        
        // Descobrir qual arma está usando
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        
        // Teste de acerto
        const teste = testeAtaque(this.personagem, this.inimigo, 'esquiva', 'espada');
        
        if (teste.acertou || teste.critico) {
            // Calcular dano
            const dano = calcularDanoPersonagem(this.personagem, arma);
            
            // Aplicar armadura do inimigo
            const rdInimigo = this.inimigo.armadura || 0;
            const danoFinal = Math.max(1, dano - rdInimigo);
            
            this.inimigo.vida -= danoFinal;
            
            let criticoStr = teste.critico ? ' (CRÍTICO!)' : '';
            this.adicionarLog(`🎯 ACERTOU${criticoStr}! Dano: ${danoFinal} (${dano} - ${rdInimigo} RD) | Rolagem: ${teste.rolagemStr}`);
            
            if (this.inimigo.vida <= 0) {
                this.inimigo.vida = 0;
                this.adicionarLog(`💀 ${this.inimigo.nome} foi DERROTADO!`);
                this.fim = true;
                this.turno = 'fim';
                
                if (this.callbacks.onVitoria) {
                    this.callbacks.onVitoria({
                        xp: this.inimigo.experiencia || 50,
                        ouro: this.inimigo.ouro || 0
                    });
                }
            }
        } else {
            this.adicionarLog(`❌ ERROU! Rolagem: ${teste.rolagemStr} (NH ${teste.nhAtacante} vs Defesa ${teste.defesa})`);
        }
        
        this.atualizarInterface();
        
        // Passar turno para inimigo
        if (!this.fim) {
            this.turno = 'inimigo';
            setTimeout(() => this.turnoInimigo(), 1200);
        }
        
        return true;
    }
    
    defender() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`🛡️ ${this.personagem.nome} assume posição defensiva!`);
        
        // Bônus de defesa na próxima rodada
        this.bonusDefesa = 20;
        
        this.turno = 'inimigo';
        setTimeout(() => this.turnoInimigo(), 1000);
        
        return true;
    }
    
    esquivar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`🏃 ${this.personagem.nome} tenta esquivar!`);
        
        // Na esquiva, o personagem tenta evitar completamente
        const esquivaBase = calcularEsquiva(this.personagem);
        const rolagem = rolar2d10();
        
        if (rolagem.resultado <= esquivaBase || rolagem.resultado <= 5) {
            this.adicionarLog(`✅ ESQUIVOU! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`);
            this.esquivou = true;
        } else {
            this.adicionarLog(`❌ Falhou ao esquivar! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`);
            this.esquivou = false;
        }
        
        this.turno = 'inimigo';
        setTimeout(() => this.turnoInimigo(), 1000);
        
        return true;
    }
    
    usarMagia(magiaId) {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`✨ Magia ainda não implementada!`);
        
        return false;
    }
    
    usarItem(itemId) {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`🎒 Uso de itens ainda não implementado!`);
        
        return false;
    }
    
    fugir() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        // Chance de fugir baseada em DX
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const dxPercent = 40 + (dxEsferas * 2);
        const chanceFuga = dxPercent + 20;
        
        const rolagem = rolar2d10();
        
        if (rolagem.resultado <= chanceFuga || rolagem.resultado <= 5) {
            this.adicionarLog(`🏃 FUGA BEM-SUCEDIDA! Rolagem: ${rolagem.str}`);
            this.fim = true;
            this.turno = 'fim';
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
        } else {
            this.adicionarLog(`❌ Falhou ao tentar fugir! Rolagem: ${rolagem.str} vs ${chanceFuga}%`);
            this.turno = 'inimigo';
            setTimeout(() => this.turnoInimigo(), 1000);
        }
        
        return true;
    }
    
    turnoInimigo() {
        if (this.fim || this.turno !== 'inimigo') return;
        
        this.rodada++;
        this.adicionarLog(`--- Rodada ${this.rodada} ---`);
        this.adicionarLog(`👹 Turno de ${this.inimigo.nome}`);
        
        // Decidir ação do inimigo
        const acao = Math.random() < this.inimigo.agressividade ? 'atacar' : 'defender';
        
        if (acao === 'atacar') {
            // Inimigo ataca
            const dano = rolarDados(this.inimigo.danoFormula || "1d6");
            
            // Calcular defesa do jogador
            let tipoDefesa = 'esquiva';
            let defesaBase = calcularEsquiva(this.personagem);
            
            // Se jogador usou defender, bônus
            if (this.bonusDefesa) {
                defesaBase += this.bonusDefesa;
                delete this.bonusDefesa;
            }
            
            // Se jogador esquivou, bônus grande
            if (this.esquivou) {
                defesaBase += 30;
                delete this.esquivou;
            }
            
            // Teste se inimigo acerta
            const nhInimigo = 40 + ((this.inimigo.pericias?.briga || 0) * 4);
            const rolagem = rolar2d10();
            
            // Chance do inimigo acertar
            const chanceAcerto = Math.max(20, nhInimigo - (defesaBase / 3));
            
            if (rolagem.resultado <= chanceAcerto || rolagem.resultado <= 5) {
                // Acertou
                const rd = calcularRDTotal(this.personagem);
                const danoFinal = Math.max(1, dano - rd);
                
                this.personagem.statusCombate.vidaAtual -= danoFinal;
                if (this.personagem.statusCombate.vidaAtual < 0) this.personagem.statusCombate.vidaAtual = 0;
                
                const criticoStr = rolagem.resultado <= 5 ? ' (CRÍTICO!)' : '';
                this.adicionarLog(`🎯 ${this.inimigo.nome} ACERTOU${criticoStr}! Dano: ${danoFinal} (${dano} - ${rd} RD) | Rolagem: ${rolagem.str}`);
                
                if (this.personagem.statusCombate.vidaAtual <= 0) {
                    this.adicionarLog(`💀 ${this.personagem.nome} foi DERROTADO!`);
                    this.fim = true;
                    this.turno = 'fim';
                    
                    if (this.callbacks.onDerrota) {
                        this.callbacks.onDerrota();
                    }
                }
            } else {
                this.adicionarLog(`❌ ${this.inimigo.nome} ERROU! Rolagem: ${rolagem.str}`);
            }
        } else {
            // Inimigo defende
            this.adicionarLog(`🛡️ ${this.inimigo.nome} assume posição defensiva!`);
            this.inimigo.bonusDefesa = 15;
        }
        
        this.atualizarInterface();
        
        if (!this.fim) {
            this.turno = 'jogador';
        }
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        INIMIGOS, 
        Combate, 
        rolarDados, 
        rolar2d10, 
        calcularDanoPersonagem,
        calcularNH,
        testarPericia,
        calcularEsquiva,
        calcularAparar,
        calcularBloqueio,
        calcularRDTotal,
        testeAtaque
    };
}