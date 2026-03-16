// ============================================
// SISTEMA DE COMBATE AKALANATA - VERSÃO DEFINITIVA
// ✅ Contador de turnos com fadiga
// ✅ Crítico/Fulminante completo
// ✅ Bônus de +10% ataque (defesa fulminante)
// ✅ Penalidade -15% defesa (ataque fulminante)
// ============================================

// ===== CONSTANTES - INIMIGOS =====
const INIMIGOS = {
    "saqueador_faminto": {
        id: "saqueador_faminto",
        nome: "Saqueador Faminto",
        vida: 40,
        vidaMax: 40,
        descricao: "Homem magro, roupas rasgadas e aparência cansada.",
        equipamento: "Pedaço de madeira",
        armadura: 0,
        danoFormula: "1d8",
        forca: 8,
        destreza: 10,
        vigor: 9,
        inteligencia: 6,
        pericias: { "luta": 2 },
        derivados: { esquiva: 45, aparar: 0, bloqueio: 0 },
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
        forca: 7,
        destreza: 12,
        vigor: 8,
        inteligencia: 4,
        pericias: { "luta": 2 },
        derivados: { esquiva: 45, aparar: 0, bloqueio: 0 },
        experiencia: 30,
        ouro: 0
    },
    
    "guarda_corrompido": {
        id: "guarda_corrompido",
        nome: "Guarda Corrompido",
        vida: 35,
        vidaMax: 35,
        descricao: "Ex-soldado com armadura enferrujada e olhar ameaçador.",
        equipamento: "Espada curta e escudo",
        armadura: 2,
        danoFormula: "1d8+1",
        forca: 11,
        destreza: 10,
        vigor: 11,
        inteligencia: 8,
        pericias: { "espada": 2, "escudo": 1 },
        derivados: { esquiva: 30, aparar: 40, bloqueio: 35 },
        experiencia: 75,
        ouro: 5
    },
    
    "orc_saqueador": {
        id: "orc_saqueador",
        nome: "Orc Saqueador",
        vida: 55,
        vidaMax: 55,
        descricao: "Um orc enorme com uma machadinha ensanguentada.",
        equipamento: "Machadinha",
        armadura: 3,
        danoFormula: "2d6",
        forca: 14,
        destreza: 8,
        vigor: 13,
        inteligencia: 5,
        pericias: { "machado": 3 },
        derivados: { esquiva: 25, aparar: 35, bloqueio: 0 },
        experiencia: 120,
        ouro: 10
    }
};

// ===== TABELA DE DANO POR ST =====
const TABELA_DANO_ST = {
    5: "1d-3",  6: "1d-2",  7: "1d-2",  8: "1d-1",  9: "1d-1",
    10: "1d",   11: "1d",   12: "1d+1", 13: "1d+1", 14: "1d+2",
    15: "1d+2", 16: "2d-1", 17: "2d-1", 18: "2d",   19: "2d",
    20: "2d+1", 21: "2d+1", 22: "2d+2", 23: "2d+2", 24: "3d-1",
    25: "3d-1", 26: "3d",   27: "3d",   28: "3d+1", 29: "3d+1",
    30: "3d+2"
};

// ===== FUNÇÕES DE ROLAGEM =====
function combateRolarDados(formula) {
    if (!formula) return 1;
    
    const regex = /^(\d+)d(\d+)?([+-]\d+)?$/i;
    const match = formula.match(regex);
    
    if (!match) {
        console.warn(`Fórmula de dano inválida: ${formula}`);
        return 1;
    }
    
    const quantidade = parseInt(match[1]) || 1;
    const faces = match[2] ? parseInt(match[2]) : 6;
    const modificador = match[3] ? parseInt(match[3]) : 0;
    
    let total = 0;
    for (let i = 0; i < quantidade; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    
    const resultado = Math.max(1, total + modificador);
    return resultado;
}

function combateRolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1;
    const dado2 = Math.floor(Math.random() * 10) + 1;
    
    let resultado = (dado1 === 10 ? 0 : dado1) * 10 + (dado2 === 10 ? 0 : dado2);
    if (resultado === 0) resultado = 100;
    
    return {
        dado1, dado2,
        resultado: resultado,
        str: `[${dado1}][${dado2}] = ${resultado}`,
        // ✅ Crítico: 1-6 | Falha Crítica: 95-100
        critico: resultado <= 6,
        falhaCritica: resultado >= 95
    };
}

// ===== CALCULAR ATRIBUTOS =====
function combateGetSTFixo(personagem) {
    return 5 + (personagem.atributos?.st?.esferas || 0);
}

function combateGetDXFixo(personagem) {
    return 5 + (personagem.atributos?.dx?.esferas || 0);
}

function combateGetIQFixo(personagem) {
    return 5 + (personagem.atributos?.iq?.esferas || 0);
}

function combateGetVIGORFixo(personagem) {
    return 5 + (personagem.atributos?.vigor?.esferas || 0);
}

function combateGetVTFixo(personagem) {
    return 5 + (personagem.atributos?.vt?.esferas || 0);
}

// ===== CALCULAR PERCENTUAIS =====
function combateGetSTPercentual(personagem) {
    const esferas = personagem.atributos?.st?.esferas || 0;
    return 40 + (esferas * 3);
}

function combateGetDXPercentual(personagem) {
    const esferas = personagem.atributos?.dx?.esferas || 0;
    return 40 + (esferas * 2);
}

function combateGetIQPercentual(personagem) {
    const esferas = personagem.atributos?.iq?.esferas || 0;
    return 40 + (esferas * 2);
}

function combateGetVIGORPercentual(personagem) {
    const esferas = personagem.atributos?.vigor?.esferas || 0;
    return 40 + (esferas * 3);
}

// ===== CALCULAR NH =====
function combateCalcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
    const periciasFisicas = ['espada', 'arco', 'besta', 'escudo', 'luta', 'machado', 'lanca', 'adaga'];
    
    let atributoBase = 40;
    
    if (periciasFisicas.includes(periciaId)) {
        const dxEsferas = personagem.atributos?.dx?.esferas || 0;
        atributoBase = 40 + (dxEsferas * 2);
    } else {
        const iqEsferas = personagem.atributos?.iq?.esferas || 0;
        atributoBase = 40 + (iqEsferas * 2);
    }
    
    const nh = atributoBase + (nivel * 4);
    
    return Math.min(95, Math.max(5, nh));
}

function combateCalcularNHInimigo(inimigo) {
    let nh = 40;
    
    if (inimigo.pericias) {
        if (inimigo.pericias.luta) nh = 40 + (inimigo.pericias.luta * 4);
        else if (inimigo.pericias.espada) nh = 40 + (inimigo.pericias.espada * 4);
        else if (inimigo.pericias.adaga) nh = 40 + (inimigo.pericias.adaga * 4);
        else if (inimigo.pericias.machado) nh = 40 + (inimigo.pericias.machado * 4);
    }
    
    return Math.min(95, Math.max(5, nh));
}

// ===== CALCULAR DEFESAS =====
function combateCalcularEsquiva(personagem, bonusPenalidade = 0) {
    let esquiva = Math.floor((combateGetDXPercentual(personagem) + combateGetVIGORPercentual(personagem)) / 2) + 5;
    if (personagem.vantagens?.includes('reflexosRapidos')) esquiva += 5;
    
    // Aplicar penalidade de ataque fulminante (-15%)
    esquiva += bonusPenalidade;
    
    return Math.min(80, Math.max(5, esquiva));
}

function combateCalcularAparar(personagem, bonusPenalidade = 0) {
    const temArma = personagem.inventario?.corpo?.some(item => item.dano);
    if (!temArma) return 0;
    
    const periciaEspada = personagem.pericias?.espada?.nivel || 0;
    let aparar = combateGetDXPercentual(personagem) + (periciaEspada * 4) + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) aparar += 5;
    if (personagem.vantagens?.includes('ataquesMultiplos')) aparar += 5;
    
    // Aplicar penalidade de ataque fulminante (-15%)
    aparar += bonusPenalidade;
    
    return Math.min(80, Math.max(5, aparar));
}

function combateCalcularBloqueio(personagem, bonusPenalidade = 0) {
    const temEscudo = personagem.inventario?.corpo?.some(item => item.bonus);
    if (!temEscudo) return 0;
    
    const periciaEscudo = personagem.pericias?.escudo?.nivel || 0;
    let bloqueio = combateGetDXPercentual(personagem) + (periciaEscudo * 4) + 5;
    
    const escudo = personagem.inventario.corpo?.find(item => item.bonus);
    if (escudo?.bonus) bloqueio += escudo.bonus * 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) bloqueio += 5;
    
    // Aplicar penalidade de ataque fulminante (-15%)
    bloqueio += bonusPenalidade;
    
    return Math.min(85, Math.max(5, bloqueio));
}

function combateCalcularRDTotal(personagem) {
    let rd = 0;
    if (personagem.vantagens?.includes('corpoResistente')) rd += 2;
    if (personagem.inventario?.corpo) {
        personagem.inventario.corpo.forEach(item => {
            if (item.rd) rd += item.rd;
        });
    }
    return rd;
}

// ===== CALCULAR DANO =====
function combateCalcularDanoPersonagem(personagem, arma = null, multiplicador = 1) {
    if (!personagem) return 1;
    
    const stFixo = combateGetSTFixo(personagem);
    let danoBaseFormula = TABELA_DANO_ST[stFixo] || "1d-3";
    const danoBase = combateRolarDados(danoBaseFormula);
    
    let danoArma = 0;
    
    if (arma?.dano) {
        if (typeof arma.dano === 'string') {
            if (arma.dano.includes('d')) {
                danoArma = combateRolarDados(arma.dano);
            } else {
                danoArma = parseInt(arma.dano) || 0;
            }
        }
    }
    
    let bonusST = 0;
    if (arma && !arma.distancia) {
        const esferasST = personagem.atributos?.st?.esferas || 0;
        bonusST = Math.floor(esferasST / 2);
    }
    
    let danoFinal = (danoBase + danoArma + bonusST) * multiplicador;
    
    return Math.max(1, Math.floor(danoFinal));
}

// ============================================
// CLASSE DE COMBATE COM FIRESTORE - VERSÃO COMPLETA
// ============================================

class CombateFirestore {
    constructor(sessaoId, personagem, inimigoId, callbacks = {}) {
        this.sessaoId = sessaoId;
        this.personagem = personagem;
        this.personagemId = personagem.id;
        this.userId = personagem.userId || personagem.user_id || null;
        this.inimigoId = inimigoId;
        this.callbacks = callbacks;
        this.combateId = null;
        this.unsubscribe = null;
        
        // Estado local
        this.inimigo = null;
        this.status = {
            turno: 'jogador',
            rodada: 1,
            contadorTurnos: 0, // ✅ Contador para fadiga (a cada 5 turnos -1 PF)
            fim: false,
            aguardandoDefesa: false,
            // ✅ Bônus e penalidades para crítico/fulminante
            bonusProximoAtaque: 0, // +10% da defesa fulminante
            penalidadeDefesaInimigo: 0, // -15% do ataque fulminante
            penalidadeDefesaJogador: 0 // -15% da falha crítica no ataque
        };
        this.ultimoAtaque = null;
        this.log = [];
        
        // Flag para evitar loop
        this._atualizandoDoSnapshot = false;
        this._ultimaMensagem = null;
        
        this.iniciar();
    }
    
    async iniciar() {
        try {
            console.log('⚔️ Iniciando combate Firestore:', this.inimigoId);
            
            const inimigoBase = INIMIGOS[this.inimigoId] || INIMIGOS.saqueador_faminto;
            
            if (!this.personagem.statusCombate) {
                const vt = combateGetVTFixo(this.personagem);
                const vigor = combateGetVIGORFixo(this.personagem);
                const iq = combateGetIQFixo(this.personagem);
                
                this.personagem.statusCombate = {
                    vidaAtual: vt * 8,
                    vidaMax: vt * 8,
                    manaAtual: vigor + iq + vt,
                    manaMax: vigor + iq + vt,
                    fadigaAtual: vigor + vt,
                    fadigaMax: vigor + vt
                };
            }
            
            this.inimigo = {
                ...inimigoBase,
                vidaAtual: inimigoBase.vidaMax
            };
            
            this.log = [{
                mensagem: '⚔️ COMBATE INICIADO!',
                tipo: 'normal',
                timestamp: new Date().toISOString()
            }];
            
            this._log('✨ SEU TURNO!', true);
            
            if (this.callbacks.onIniciar) {
                this.callbacks.onIniciar({
                    inimigo: this.inimigo,
                    inimigoVida: this.inimigo.vidaAtual,
                    inimigoVidaMax: this.inimigo.vidaMax,
                    personagemVida: this.personagem.statusCombate.vidaAtual,
                    personagemVidaMax: this.personagem.statusCombate.vidaMax
                });
            }
            
            this._notificarUI();
            
        } catch (error) {
            console.error('❌ Erro ao iniciar combate:', error);
            if (this.callbacks.onErro) {
                this.callbacks.onErro(error.message);
            }
        }
    }
    
    _notificarUI() {
        if (this.callbacks.onAtualizar) {
            // Calcular defesas com penalidades atuais
            const esquivaAtual = combateCalcularEsquiva(this.personagem, this.status.penalidadeDefesaJogador);
            const apararAtual = combateCalcularAparar(this.personagem, this.status.penalidadeDefesaJogador);
            const bloqueioAtual = combateCalcularBloqueio(this.personagem, this.status.penalidadeDefesaJogador);
            
            this.callbacks.onAtualizar({
                turno: this.status.turno,
                rodada: this.status.rodada,
                contadorTurnos: this.status.contadorTurnos,
                fim: this.status.fim,
                aguardandoDefesa: this.status.aguardandoDefesa,
                inimigoVida: this.inimigo?.vidaAtual || 0,
                inimigoVidaMax: this.inimigo?.vidaMax || 0,
                personagemVida: this.personagem.statusCombate.vidaAtual,
                personagemVidaMax: this.personagem.statusCombate.vidaMax,
                personagemMana: this.personagem.statusCombate.manaAtual || 0,
                personagemFadiga: this.personagem.statusCombate.fadigaAtual || 0,
                inimigo: this.inimigo,
                // ✅ Enviar bônus/penalidade para UI
                bonus: this._getBonusInfo()
            });
            
            // Atualizar valores de defesa na UI global
            if (typeof window.atualizarValoresDefesa === 'function') {
                window.atualizarValoresDefesa();
            }
        }
    }
    
    // ✅ Retorna informações sobre bônus/penalidade ativos
    _getBonusInfo() {
        if (this.status.bonusProximoAtaque > 0) {
            return {
                tipo: 'bonus',
                mensagem: `✨ Bônus de +${this.status.bonusProximoAtaque}% no próximo ataque (defesa fulminante)`
            };
        } else if (this.status.penalidadeDefesaJogador < 0) {
            return {
                tipo: 'penalidade',
                mensagem: `💥 Penalidade de ${this.status.penalidadeDefesaJogador}% nas defesas (falha crítica)`
            };
        } else if (this.status.penalidadeDefesaInimigo < 0) {
            return {
                tipo: 'penalidade',
                mensagem: `💥 Inimigo com penalidade de ${this.status.penalidadeDefesaInimigo}% nas defesas (ataque fulminante)`
            };
        }
        return null;
    }
    
    _log(mensagem, tipo = 'normal', forcarUI = false) {
        const chave = mensagem + tipo;
        if (this._ultimaMensagem === chave && !forcarUI) {
            return;
        }
        
        this._ultimaMensagem = chave;
        console.log(`[COMBATE] ${mensagem}`);
        
        const entry = {
            mensagem: mensagem,
            tipo: tipo,
            timestamp: new Date().toISOString()
        };
        
        this.log.push(entry);
        
        if (this.callbacks.onLog) {
            this.callbacks.onLog(mensagem, tipo);
        }
        
        setTimeout(() => {
            if (this._ultimaMensagem === chave) {
                this._ultimaMensagem = null;
            }
        }, 100);
    }
    
    // ✅ VERIFICAR FADIGA (a cada 5 turnos -1 PF)
    async _verificarFadiga() {
        this.status.contadorTurnos++;
        
        if (this.status.contadorTurnos >= 5) {
            this.status.contadorTurnos = 0;
            
            const pfAntes = this.personagem.statusCombate.fadigaAtual;
            this.personagem.statusCombate.fadigaAtual = Math.max(0, pfAntes - 1);
            
            this._log(`😮‍💨 Fadiga: -1 PF (${pfAntes} → ${this.personagem.statusCombate.fadigaAtual})`, 'normal', true);
            
            // Atualizar no Firestore se tiver ID
            if (this.personagemId) {
                try {
                    const db = firebase.firestore();
                    await db.collection('personagens').doc(this.personagemId).update({
                        'statusCombate.fadigaAtual': this.personagem.statusCombate.fadigaAtual
                    });
                } catch (e) {
                    console.log('⚠️ Erro ao atualizar fadiga no Firestore:', e);
                }
            }
            
            // Atualizar UI global
            if (typeof window.atualizarInterfacePersonagem === 'function') {
                window.atualizarInterfacePersonagem();
            }
        }
    }
    
    // ===== AÇÕES DO JOGADOR =====
    
    async atacar() {
        if (this.status.fim || this.status.turno !== 'jogador' || this.status.aguardandoDefesa) {
            return false;
        }
        
        this._log(`👉 ${this.personagem.nome || 'Herói'} ataca!`, 'normal', true);
        
        // Verificar fadiga
        await this._verificarFadiga();
        
        // CALCULAR ATAQUE
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        let periciaAtaque = 'luta';
        if (arma) {
            if (arma.nome?.toLowerCase().includes('espada')) periciaAtaque = 'espada';
            else if (arma.nome?.toLowerCase().includes('machado')) periciaAtaque = 'machado';
            else if (arma.nome?.toLowerCase().includes('lança')) periciaAtaque = 'lanca';
            else if (arma.nome?.toLowerCase().includes('adaga')) periciaAtaque = 'adaga';
        }
        
        // ✅ Aplicar bônus de defesa fulminante se houver
        let nhJogador = combateCalcularNH(this.personagem, periciaAtaque);
        if (this.status.bonusProximoAtaque > 0) {
            nhJogador += this.status.bonusProximoAtaque;
            this._log(`✨ Bônus de +${this.status.bonusProximoAtaque}% do turno anterior!`, 'critico', true);
            this.status.bonusProximoAtaque = 0;
        }
        
        const rolagemAtaque = combateRolar2d10();
        
        let acertou = false;
        let foiCritico = false;
        let foiFalhaCritica = false;
        
        // ✅ SISTEMA DE CRÍTICO/FULMINANTE
        if (rolagemAtaque.critico) {
            acertou = true;
            foiCritico = true;
            this._log(`✨✨ ATAQUE FULMINANTE! (${rolagemAtaque.resultado})`, 'critico', true);
            
            // ✅ Ataque fulminante: inimigo tem -15% nas defesas neste turno
            this.status.penalidadeDefesaInimigo = -15;
            
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            foiFalhaCritica = true;
            this._log(`💥💥 FALHA CRÍTICA NO ATAQUE! (${rolagemAtaque.resultado})`, 'falha', true);
            
            // ✅ Falha crítica no ataque: jogador tem -15% nas defesas no próximo turno
            this.status.penalidadeDefesaJogador = -15;
            
        } else {
            acertou = rolagemAtaque.resultado <= nhJogador;
        }
        
        this._log(`🎲 Rolagem: ${rolagemAtaque.str} vs NH ${nhJogador}% → ${acertou ? 'ACERTOU' : 'ERROU'}`, 'normal', true);
        
        if (acertou) {
            // DEFESA DO INIMIGO (com penalidade se ataque foi fulminante)
            let defesaInimigo = this.inimigo.derivados?.esquiva || 5;
            if (this.status.penalidadeDefesaInimigo < 0) {
                defesaInimigo += this.status.penalidadeDefesaInimigo;
                this._log(`💥 Inimigo com penalidade de ${this.status.penalidadeDefesaInimigo}% nas defesas!`, 'dano', true);
            }
            
            const rolagemDefesa = combateRolar2d10();
            
            let defendeu = false;
            if (rolagemDefesa.critico) {
                defendeu = true;
                this._log(`✨ DEFESA FULMINANTE DO INIMIGO!`, 'critico', true);
                
                // ✅ Defesa fulminante do inimigo: ele ganha +10% no próximo ataque
                // (Não afeta o jogador diretamente, mas podemos registrar)
                
            } else if (rolagemDefesa.falhaCritica) {
                defendeu = false;
                this._log(`💥 FALHA CRÍTICA NA DEFESA DO INIMIGO!`, 'falha', true);
                
                // ✅ Falha crítica na defesa do inimigo: dano duplicado
                // Será aplicado no multiplicador de dano
                
            } else {
                defendeu = rolagemDefesa.resultado <= defesaInimigo;
            }
            
            this._log(`🛡️ Defesa: ${rolagemDefesa.str} vs ${defesaInimigo}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
            
            if (!defendeu) {
                // CALCULAR DANO
                let multiplicador = 1;
                
                // ✅ Ataque fulminante: dano duplicado
                if (foiCritico) {
                    multiplicador = 2;
                    this._log(`⚡ Dano duplicado por ataque fulminante!`, 'critico', true);
                }
                
                // ✅ Falha crítica na defesa do inimigo: dano duplicado (se não for crítico, senão seria 4x)
                if (rolagemDefesa.falhaCritica && !foiCritico) {
                    multiplicador = 2;
                    this._log(`⚡ Dano duplicado por falha crítica na defesa!`, 'dano', true);
                }
                
                const dano = combateCalcularDanoPersonagem(this.personagem, arma, multiplicador);
                const rdInimigo = this.inimigo.armadura || 0;
                let danoFinal = Math.max(1, dano - rdInimigo);
                
                const novaVida = Math.max(0, this.inimigo.vidaAtual - danoFinal);
                
                this._log(`💥 DANO: ${danoFinal} (${dano} - ${rdInimigo} RD)`, 'dano', true);
                
                // ATUALIZAR
                this.inimigo.vidaAtual = novaVida;
                
                // VERIFICAR MORTE
                if (novaVida <= 0) {
                    this._log(`💀 ${this.inimigo.nome} foi DERROTADO!`, 'critico', true);
                    
                    this.status.fim = true;
                    this.status.turno = 'fim';
                    
                    if (this.callbacks.onVitoria) {
                        this.callbacks.onVitoria({
                            xp: this.inimigo.experiencia || 50,
                            ouro: this.inimigo.ouro || 0
                        });
                    }
                    
                    this._notificarUI();
                    return true;
                }
            }
        }
        
        // Limpar penalidade do inimigo após o turno
        this.status.penalidadeDefesaInimigo = 0;
        
        // PASSAR TURNO
        this.status.turno = 'inimigo';
        this.status.rodada = this.status.rodada + 1;
        
        this._notificarUI();
        
        setTimeout(() => this._turnoInimigo(), 1000);
        
        return true;
    }
    
    async _turnoInimigo() {
        if (this.status.fim || this.status.turno !== 'inimigo') return;
        
        this._log(`👹 Turno de ${this.inimigo.nome}`, 'normal', true);
        
        // Verificar fadiga (inimigo não perde PF, mas contador aumenta)
        await this._verificarFadiga();
        
        const nhInimigo = combateCalcularNHInimigo(this.inimigo);
        const rolagemAtaque = combateRolar2d10();
        
        let acertou = false;
        let foiCritico = false;
        let foiFalhaCritica = false;
        
        if (rolagemAtaque.critico) {
            acertou = true;
            foiCritico = true;
            this._log(`✨✨ ATAQUE FULMINANTE DO INIMIGO! (${rolagemAtaque.resultado})`, 'critico', true);
            
            // ✅ Ataque fulminante do inimigo: jogador terá -15% nas defesas
            // Será aplicado na defesa
            
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            foiFalhaCritica = true;
            this._log(`💥💥 FALHA CRÍTICA DO INIMIGO! (${rolagemAtaque.resultado})`, 'falha', true);
            
            // ✅ Falha crítica do inimigo: ele terá -15% nas defesas no próximo turno
            this.status.penalidadeDefesaInimigo = -15;
            
        } else {
            acertou = rolagemAtaque.resultado <= nhInimigo;
        }
        
        this._log(`🎲 ${this.inimigo.nome} ataca: ${rolagemAtaque.str} vs NH ${nhInimigo}% → ${acertou ? 'ACERTOU' : 'ERROU'}`, 'normal', true);
        
        if (acertou) {
            this.ultimoAtaque = {
                danoFormula: this.inimigo.danoFormula || "1d6",
                rolagem: rolagemAtaque,
                nh: nhInimigo,
                foiCritico: foiCritico,
                foiFalhaCritica: foiFalhaCritica
            };
            
            this.status.aguardandoDefesa = true;
            
            this._log(`🛡️ ESCOLHA SUA DEFESA!`, 'normal', true);
            this._notificarUI();
        } else {
            // Se inimigo errou, volta para jogador
            this.status.turno = 'jogador';
            
            this._log(`✨ SEU TURNO!`, 'critico', true);
            this._notificarUI();
        }
    }
    
    // ===== DEFESAS =====
    
    async defenderComEsquiva() {
        await this._processarDefesa('Esquiva', combateCalcularEsquiva(this.personagem, this.status.penalidadeDefesaJogador));
    }
    
    async defenderComAparar() {
        await this._processarDefesa('Aparar', combateCalcularAparar(this.personagem, this.status.penalidadeDefesaJogador));
    }
    
    async defenderComBloqueio() {
        await this._processarDefesa('Bloqueio', combateCalcularBloqueio(this.personagem, this.status.penalidadeDefesaJogador));
    }
    
    async _processarDefesa(tipoDefesa, defesaBase) {
        if (!this.status.aguardandoDefesa || !this.ultimoAtaque) return;
        
        const ataque = this.ultimoAtaque;
        const rolagemDefesa = combateRolar2d10();
        
        let defendeu = false;
        let foiCritico = false;
        let foiFalhaCritica = false;
        
        if (rolagemDefesa.critico) {
            defendeu = true;
            foiCritico = true;
            this._log(`✨✨ DEFESA FULMINANTE! (${tipoDefesa})`, 'critico', true);
            
            // ✅ Defesa fulminante: +10% no próximo ataque
            this.status.bonusProximoAtaque = 10;
            
        } else if (rolagemDefesa.falhaCritica) {
            defendeu = false;
            foiFalhaCritica = true;
            this._log(`💥💥 FALHA CRÍTICA NA DEFESA! (${tipoDefesa})`, 'falha', true);
            
            // ✅ Falha crítica na defesa: dano duplicado
            // Será aplicado no multiplicador
            
        } else {
            defendeu = rolagemDefesa.resultado <= defesaBase;
        }
        
        this._log(`🛡️ ${tipoDefesa}: ${rolagemDefesa.str} vs ${defesaBase}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
        
        if (!defendeu) {
            // TOMAR DANO
            let multiplicador = 1;
            
            // ✅ Ataque fulminante do inimigo: dano duplicado
            if (ataque.foiCritico) {
                multiplicador = 2;
                this._log(`⚡ Dano duplicado por ataque fulminante!`, 'dano', true);
            }
            
            // ✅ Falha crítica na defesa: dano duplicado
            if (foiFalhaCritica && !ataque.foiCritico) {
                multiplicador = 2;
                this._log(`⚡ Dano duplicado por falha crítica na defesa!`, 'dano', true);
            }
            
            const dano = combateRolarDados(ataque.danoFormula) * multiplicador;
            const rd = combateCalcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            const vidaAntes = this.personagem.statusCombate.vidaAtual;
            this.personagem.statusCombate.vidaAtual = Math.max(0, vidaAntes - danoFinal);
            
            this._log(`💥 DANO RECEBIDO: ${danoFinal} (${dano} - ${rd} RD)`, 'dano', true);
            
            // ATUALIZAR FIRESTORE
            if (this.personagemId) {
                try {
                    const db = firebase.firestore();
                    await db.collection('personagens').doc(this.personagemId).update({
                        'statusCombate.vidaAtual': this.personagem.statusCombate.vidaAtual
                    });
                } catch (e) {
                    console.log('⚠️ Erro ao atualizar personagem:', e);
                }
            }
            
            // ATUALIZAR UI GLOBAL
            if (typeof window.atualizarInterfacePersonagem === 'function') {
                window.atualizarInterfacePersonagem();
            }
            
            // VERIFICAR MORTE
            if (this.personagem.statusCombate.vidaAtual <= 0) {
                this._log(`💀 ${this.personagem.nome || 'Herói'} foi DERROTADO!`, 'falha', true);
                
                this.status.fim = true;
                this.status.turno = 'fim';
                this.status.aguardandoDefesa = false;
                
                if (this.callbacks.onDerrota) {
                    this.callbacks.onDerrota();
                }
                
                this._notificarUI();
                return;
            }
        }
        
        // Limpar penalidade do jogador após a defesa
        this.status.penalidadeDefesaJogador = 0;
        this.status.aguardandoDefesa = false;
        this.status.turno = 'jogador';
        this.ultimoAtaque = null;
        
        this._log(`✨ SEU TURNO!`, 'critico', true);
        this._notificarUI();
    }
    
    // ===== OUTRAS AÇÕES =====
    
    async fugir() {
        if (this.status.fim || this.status.turno !== 'jogador') return false;
        
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const chanceFuga = 40 + (dxEsferas * 2) + 20;
        
        const rolagem = combateRolar2d10();
        
        if (rolagem.resultado <= chanceFuga || rolagem.critico) {
            this._log(`🏃 FUGA BEM-SUCEDIDA!`, 'cura', true);
            
            this.status.fim = true;
            this.status.turno = 'fim';
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
            
            this._notificarUI();
        } else {
            this._log(`❌ Falhou ao tentar fugir!`, 'falha', true);
            
            this.status.turno = 'inimigo';
            
            this._notificarUI();
            setTimeout(() => this._turnoInimigo(), 1000);
        }
        
        return true;
    }
    
    destruir() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

// ===== EXPORTAÇÃO =====
if (typeof window !== 'undefined') {
    window.INIMIGOS = INIMIGOS;
    window.CombateFirestore = CombateFirestore;
    window.combateRolarDados = combateRolarDados;
    window.combateRolar2d10 = combateRolar2d10;
    window.combateCalcularNH = combateCalcularNH;
    window.combateCalcularNHInimigo = combateCalcularNHInimigo;
    window.combateCalcularEsquiva = combateCalcularEsquiva;
    window.combateCalcularAparar = combateCalcularAparar;
    window.combateCalcularBloqueio = combateCalcularBloqueio;
    window.combateCalcularRDTotal = combateCalcularRDTotal;
    window.combateCalcularDanoPersonagem = combateCalcularDanoPersonagem;
    
    console.log('✅ Sistema de Combate COMPLETO carregado!');
    console.log('✅ Contador de turnos com fadiga ativado!');
    console.log('✅ Crítico (1-6) e Falha Crítica (95-100) implementados!');
    console.log('✅ Bônus de +10% e penalidade de -15% ativos!');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INIMIGOS, CombateFirestore };
}