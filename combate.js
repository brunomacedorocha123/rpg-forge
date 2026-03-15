// FILE: combate.js
// ============================================
// COMBATE.JS - SISTEMA DE COMBATE COMPLETO
// ============================================

// ===== DADOS DOS INIMIGOS =====
const INIMIGOS = {
    "saqueador_faminto": {
        id: "saqueador_faminto",
        nome: "Saqueador Faminto",
        vida: 25,
        vidaMax: 25,
        descricao: "Homem magro, roupas rasgadas e aparência cansada. Ele parece desesperado e mal treinado.",
        equipamento: "Pedaço de madeira (1d6)",
        armadura: 0,
        dano: "1d6",
        danoBase: 3,
        forca: 8,
        destreza: 10,
        vigor: 9,
        agressividade: 0.8,
        portrait: "https://via.placeholder.com/100x100/4a2a2a/8b0000?text=Saqueador",
        experiencia: 50,
        ouro: 1
    },
    
    "lobo_solitario": {
        id: "lobo_solitario",
        nome: "Lobo Solitário",
        vida: 18,
        vidaMax: 18,
        descricao: "Um lobo magro, olhos famintos brilhando na escuridão.",
        equipamento: "Presas e garras (1d4)",
        armadura: 1,
        dano: "1d4",
        danoBase: 2,
        forca: 7,
        destreza: 12,
        vigor: 8,
        agressividade: 0.9,
        portrait: "https://via.placeholder.com/100x100/2a3a2a/8b4513?text=Lobo",
        experiencia: 30,
        ouro: 0
    }
};

// ===== SISTEMA DE ROLAGEM DE DADOS =====
function rolarDados(formula) {
    // Suporta formatos como "1d6", "2d8+2", "1d20"
    const regex = /(\d+)d(\d+)(?:\+(\d+))?/i;
    const match = formula.match(regex);
    
    if (!match) return 0;
    
    const quantidade = parseInt(match[1]) || 1;
    const faces = parseInt(match[2]) || 6;
    const modificador = parseInt(match[3]) || 0;
    
    let resultado = 0;
    for (let i = 0; i < quantidade; i++) {
        resultado += Math.floor(Math.random() * faces) + 1;
    }
    
    return resultado + modificador;
}

// ===== CALCULAR DANO BASEADO NO PERSONAGEM =====
function calcularDanoPersonagem(personagem, arma = null) {
    // Tabela de dano baseado em ST (Força)
    const tabelaDano = {
        0: "1d-3", 1: "1d-2", 2: "1d-1", 3: "1d-1", 4: "1d", 5: "1d",
        6: "1d+1", 7: "1d+1", 8: "1d+2", 9: "1d+2", 10: "2d-1", 11: "2d-1",
        12: "2d", 13: "2d", 14: "2d+1", 15: "2d+1"
    };
    
    const esferasST = personagem?.atributos?.st?.esferas || 0;
    const danoBaseFormula = tabelaDano[esferasST] || "1d-3";
    
    let dano = rolarDados(danoBaseFormula);
    
    // Se tiver arma, adiciona bônus
    if (arma && arma.dano) {
        if (typeof arma.dano === 'string' && arma.dano.includes('d')) {
            dano += rolarDados(arma.dano);
        } else if (typeof arma.dano === 'string') {
            // Bônus fixo tipo "+2"
            const bonus = parseInt(arma.dano.replace(/[^0-9-]/g, '')) || 0;
            dano += bonus;
        }
    }
    
    return Math.max(1, dano); // Mínimo 1 de dano
}

// ===== CALCULAR ESQUIVA DO PERSONAGEM =====
function calcularEsquiva(personagem) {
    if (!personagem?.derivados?.esquiva) {
        // Cálculo padrão se não tiver derivado
        const dxPercent = 40 + ((personagem?.atributos?.dx?.esferas || 0) * 2);
        const vigorPercent = 40 + ((personagem?.atributos?.vigor?.esferas || 0) * 3);
        return Math.floor((dxPercent + vigorPercent) / 2) + 5;
    }
    return personagem.derivados.esquiva;
}

// ===== CALCULAR APARAR DO PERSONAGEM =====
function calcularAparar(personagem) {
    if (!personagem?.derivados?.aparar) {
        return 40 + ((personagem?.atributos?.dx?.esferas || 0) * 2) + 5;
    }
    return personagem.derivados.aparar;
}

// ===== CALCULAR BLOQUEIO DO PERSONAGEM =====
function calcularBloqueio(personagem) {
    if (!personagem?.derivados?.bloqueio) {
        return 0; // Sem escudo = sem bloqueio
    }
    return personagem.derivados.bloqueio;
}

// ===== VERIFICAR SE ACERTOU (TESTE CONTRA DEFESA) =====
function testeAcerto(atacante, defensor, tipoDefesa = 'esquiva') {
    // Atacante: usa perícia relevante
    let chanceAcerto = 50; // Base
    
    // Pegar perícia de arma se tiver
    if (atacante.pericias && atacante.pericias.espada) {
        chanceAcerto += (atacante.pericias.espada.nivel || 0) * 4;
    }
    
    // Defensor: usa defesa escolhida
    let chanceDefesa = 0;
    if (tipoDefesa === 'esquiva') {
        chanceDefesa = calcularEsquiva(defensor);
    } else if (tipoDefesa === 'aparar') {
        chanceDefesa = calcularAparar(defensor);
    } else if (tipoDefesa === 'bloqueio') {
        chanceDefesa = calcularBloqueio(defensor);
    }
    
    // Rolagem d100
    const rolagem = Math.floor(Math.random() * 100) + 1;
    
    // Acerta se rolagem <= chanceAcerto E rolagem > chanceDefesa
    // Simplificando: chance de acerto = chanceAcerto - (chanceDefesa / 2)
    const chanceFinal = Math.max(10, chanceAcerto - (chanceDefesa / 2));
    
    return {
        acertou: rolagem <= chanceFinal,
        rolagem,
        chanceFinal,
        mensagem: `Rolagem: ${rolagem} | Chance: ${chanceFinal.toFixed(1)}%`
    };
}

// ===== CLASSE DE COMBATE =====
class Combate {
    constructor(personagem, inimigoId, callbacks) {
        this.personagem = personagem;
        this.inimigo = JSON.parse(JSON.stringify(INIMIGOS[inimigoId])); // Clone
        this.callbacks = callbacks || {};
        this.turno = 'jogador'; // 'jogador' ou 'inimigo'
        this.log = [];
        this.rodada = 1;
        this.fim = false;
        
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
                personagemVida: this.personagem.statusCombate.vidaAtual,
                personagemVidaMax: this.personagem.statusCombate.vidaMax,
                personagemMana: this.personagem.statusCombate.manaAtual,
                personagemManaMax: this.personagem.statusCombate.manaMax,
                turno: this.turno,
                rodada: this.rodada
            });
        }
    }
    
    atacar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`👉 ${this.personagem.nome} ataca!`);
        
        // Teste de acerto
        const teste = testeAcerto(this.personagem, this.inimigo, 'esquiva');
        
        if (teste.acertou) {
            // Calcular dano
            const armaEquipada = this.personagem.inventario?.corpo?.find(item => item.dano);
            const dano = calcularDanoPersonagem(this.personagem, armaEquipada);
            
            // Aplicar armadura do inimigo
            const danoFinal = Math.max(1, dano - (this.inimigo.armadura || 0));
            
            this.inimigo.vida -= danoFinal;
            
            this.adicionarLog(`🎯 ACERTOU! Dano: ${danoFinal} (${dano} - ${this.inimigo.armadura} RD)`);
            
            if (this.inimigo.vida <= 0) {
                this.inimigo.vida = 0;
                this.adicionarLog(`💀 ${this.inimigo.nome} foi DERROTADO!`);
                this.fim = true;
                this.turno = 'fim';
                
                // Recompensas
                if (this.callbacks.onVitoria) {
                    this.callbacks.onVitoria({
                        xp: this.inimigo.experiencia || 50,
                        ouro: this.inimigo.ouro || 0
                    });
                }
            }
        } else {
            this.adicionarLog(`❌ ERROU o ataque! (${teste.mensagem})`);
        }
        
        this.atualizarInterface();
        
        // Passar turno para inimigo se não acabou
        if (!this.fim) {
            this.turno = 'inimigo';
            setTimeout(() => this.turnoInimigo(), 1000);
        }
        
        return true;
    }
    
    defender() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`🛡️ ${this.personagem.nome} assume posição defensiva!`);
        
        // Bônus de defesa na próxima rodada (simplificado)
        this.personagem.bonusDefesa = 20; // +20% na próxima defesa
        
        this.turno = 'inimigo';
        setTimeout(() => this.turnoInimigo(), 1000);
        
        return true;
    }
    
    esquivar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        this.adicionarLog(`🏃 ${this.personagem.nome} tenta esquivar!`);
        
        // Chance de esquivar completamente
        const esquivaBase = calcularEsquiva(this.personagem);
        const rolou = Math.floor(Math.random() * 100) + 1;
        
        if (rolou <= esquivaBase) {
            this.adicionarLog(`✅ ESQUIVOU com sucesso!`);
            this.personagem.esquivou = true;
        } else {
            this.adicionarLog(`❌ Falhou ao esquivar!`);
            this.personagem.esquivou = false;
        }
        
        this.turno = 'inimigo';
        setTimeout(() => this.turnoInimigo(), 1000);
        
        return true;
    }
    
    usarMagia(magiaId) {
        if (this.fim || this.turno !== 'jogador') return false;
        
        // TODO: Implementar sistema de magias em combate
        this.adicionarLog(`✨ Magia ainda não implementada!`);
        
        return false;
    }
    
    usarItem(itemId) {
        if (this.fim || this.turno !== 'jogador') return false;
        
        // TODO: Implementar uso de itens em combate
        this.adicionarLog(`🎒 Uso de itens ainda não implementado!`);
        
        return false;
    }
    
    fugir() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        // Chance de fugir baseada em DX
        const dxPercent = 40 + ((this.personagem?.atributos?.dx?.esferas || 0) * 2);
        const chanceFuga = dxPercent + 20;
        
        const rolou = Math.floor(Math.random() * 100) + 1;
        
        if (rolou <= chanceFuga) {
            this.adicionarLog(`🏃 FUGA BEM-SUCEDIDA!`);
            this.fim = true;
            this.turno = 'fim';
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
        } else {
            this.adicionarLog(`❌ Falhou ao tentar fugir!`);
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
        
        // Decidir ação do inimigo (simples: sempre ataca)
        const dano = rolarDados(this.inimigo.dano || "1d6");
        
        // Calcular defesa do jogador
        let defesaUsada = 'esquiva';
        let chanceDefesa = calcularEsquiva(this.personagem);
        
        // Se jogador usou defender, bônus
        if (this.personagem.bonusDefesa) {
            chanceDefesa += this.personagem.bonusDefesa;
            delete this.personagem.bonusDefesa;
        }
        
        // Se jogador esquivou, bônus
        if (this.personagem.esquivou) {
            chanceDefesa += 30;
            delete this.personagem.esquivou;
        }
        
        // Teste se inimigo acerta
        const chanceAcertoInimigo = 60; // Base
        const chanceFinalInimigo = Math.max(20, chanceAcertoInimigo - (chanceDefesa / 3));
        const rolou = Math.floor(Math.random() * 100) + 1;
        
        if (rolou <= chanceFinalInimigo) {
            // Acertou
            const rd = this.personagem.derivados?.rdExtra || 0;
            
            // Pegar RD de armadura
            const armadura = this.personagem.inventario?.corpo?.find(item => item.rd);
            const rdArmadura = armadura?.rd || 0;
            
            const rdTotal = rd + rdArmadura;
            const danoFinal = Math.max(1, dano - rdTotal);
            
            this.personagem.statusCombate.vidaAtual -= danoFinal;
            
            this.adicionarLog(`🎯 ${this.inimigo.nome} ACERTOU! Dano: ${danoFinal} (${dano} - ${rdTotal} RD)`);
            
            if (this.personagem.statusCombate.vidaAtual <= 0) {
                this.personagem.statusCombate.vidaAtual = 0;
                this.adicionarLog(`💀 ${this.personagem.nome} foi DERROTADO!`);
                this.fim = true;
                this.turno = 'fim';
                
                if (this.callbacks.onDerrota) {
                    this.callbacks.onDerrota();
                }
            }
        } else {
            this.adicionarLog(`❌ ${this.inimigo.nome} ERROU o ataque!`);
        }
        
        this.atualizarInterface();
        
        if (!this.fim) {
            this.turno = 'jogador';
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INIMIGOS, Combate, rolarDados, calcularDanoPersonagem };
}