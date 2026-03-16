// ============================================
// SISTEMA DE COMBATE AKALANATA SOLO - VERSÃO COMPLETA E CORRIGIDA
// Baseado no Manual do Jogador - Akalanata System
// TODAS AS FUNÇÕES RENOMEADAS PARA EVITAR CONFLITO COM testes.js
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
        forca: 8,
        destreza: 10,
        vigor: 9,
        inteligencia: 6,
        pericias: {
            "luta": 1
        },
        derivados: {
            esquiva: 35,
            aparar: 0,
            bloqueio: 0
        },
        agressividade: 0.8,
        portrait: "npc-sangue.png",
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
        pericias: {
            "luta": 2
        },
        derivados: {
            esquiva: 45,
            aparar: 0,
            bloqueio: 0
        },
        agressividade: 0.9,
        portrait: "lobo.png",
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
        pericias: {
            "espada": 2,
            "escudo": 1
        },
        derivados: {
            esquiva: 30,
            aparar: 40,
            bloqueio: 35
        },
        agressividade: 0.7,
        portrait: "guarda.png",
        experiencia: 75,
        ouro: 5
    },
    
    "esqueleto_guerreiro": {
        id: "esqueleto_guerreiro",
        nome: "Esqueleto Guerreiro",
        vida: 30,
        vidaMax: 30,
        descricao: "Restos mortais animados, segurando uma espada enferrujada.",
        equipamento: "Espada longa enferrujada",
        armadura: 2,
        danoFormula: "1d8",
        forca: 10,
        destreza: 10,
        vigor: 0,
        inteligencia: 5,
        pericias: {
            "espada": 2
        },
        derivados: {
            esquiva: 35,
            aparar: 40,
            bloqueio: 0
        },
        agressividade: 0.9,
        portrait: "esqueleto.png",
        experiencia: 60,
        ouro: 2
    },
    
    "bandido_astuto": {
        id: "bandido_astuto",
        nome: "Bandido Astuto",
        vida: 22,
        vidaMax: 22,
        descricao: "Um ladrão ágil com uma adaga na mão.",
        equipamento: "Adaga afiada",
        armadura: 0,
        danoFormula: "1d6+1",
        forca: 8,
        destreza: 13,
        vigor: 9,
        inteligencia: 9,
        pericias: {
            "adaga": 2,
            "furtividade": 2
        },
        derivados: {
            esquiva: 50,
            aparar: 30,
            bloqueio: 0
        },
        agressividade: 0.6,
        portrait: "bandido.png",
        experiencia: 45,
        ouro: 3
    }
};

// ===== TABELA DE DANO POR ST (DO MANUAL) =====
const TABELA_DANO_ST = {
    0: "1d-3", 1: "1d-2", 2: "1d-1", 3: "1d-1", 4: "1d", 5: "1d",
    6: "1d+1", 7: "1d+1", 8: "1d+2", 9: "1d+2", 10: "2d-1", 11: "2d-1",
    12: "2d", 13: "2d", 14: "2d+1", 15: "2d+1", 16: "2d+2", 17: "2d+2",
    18: "3d-1", 19: "3d-1", 20: "3d"
};

// ===== ROLAR DADOS (RENOMEADO para combateRolarDados) =====
function combateRolarDados(formula) {
    if (!formula) return 1;
    
    // Suporta formatos como "1d6", "2d8", "1d8+1", etc.
    const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
    const match = formula.match(regex);
    
    if (!match) {
        console.warn(`Fórmula de dano inválida: ${formula}`);
        return 1;
    }
    
    const quantidade = parseInt(match[1]) || 1;
    const faces = parseInt(match[2]) || 6;
    const modificador = match[3] ? parseInt(match[3]) : 0;
    
    let total = 0;
    for (let i = 0; i < quantidade; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    
    return Math.max(1, total + modificador);
}

// ===== ROLAR 2d10 PARA PORCENTAGEM (RENOMEADO para combateRolar2d10) =====
function combateRolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const dado2 = Math.floor(Math.random() * 10) + 1; // 1-10
    
    // Converter para percentual (00-99, com 00 sendo 100)
    let resultado = (dado1 === 10 ? 0 : dado1) * 10 + (dado2 === 10 ? 0 : dado2);
    if (resultado === 0) resultado = 100;
    
    return {
        dado1, dado2,
        resultado: resultado,
        str: `[${dado1}][${dado2}] = ${resultado}`,
        critico: resultado <= 5,
        falhaCritica: resultado >= 95
    };
}

// ===== CALCULAR ATRIBUTOS FIXOS =====
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
    return 40 + ((personagem.atributos?.st?.esferas || 0) * 3);
}

function combateGetDXPercentual(personagem) {
    return 40 + ((personagem.atributos?.dx?.esferas || 0) * 2);
}

function combateGetIQPercentual(personagem) {
    return 40 + ((personagem.atributos?.iq?.esferas || 0) * 2);
}

function combateGetVIGORPercentual(personagem) {
    return 40 + ((personagem.atributos?.vigor?.esferas || 0) * 3);
}

// ===== CALCULAR DANO DO PERSONAGEM (usando combateRolarDados) =====
function combateCalcularDanoPersonagem(personagem, arma = null) {
    if (!personagem) return 1;
    
    const esferasST = personagem.atributos?.st?.esferas || 0;
    const danoBaseFormula = TABELA_DANO_ST[esferasST] || "1d-3";
    
    let dano = combateRolarDados(danoBaseFormula);
    
    // Adicionar dano da arma se houver
    if (arma?.dano) {
        if (typeof arma.dano === 'string') {
            if (arma.dano.includes('d')) {
                dano += combateRolarDados(arma.dano);
            } else {
                const bonus = parseInt(arma.dano) || 0;
                dano += bonus;
            }
        }
    }
    
    // Bônus de força para armas corpo a corpo
    if (arma && !arma.distancia) {
        dano += Math.floor(esferasST / 2);
    }
    
    return Math.max(1, dano);
}

// ===== CALCULAR NH (Nível de Habilidade) =====
function combateCalcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
    // Lista de perícias físicas (baseadas em DX)
    const periciasFisicas = ['espada', 'arco', 'besta', 'escudo', 'luta', 'machado', 'lanca', 'adaga', 
                             'acrobacia', 'furtividade', 'cavalgar', 'natacao', 'fuga', 'arremesso',
                             'esgrima', 'bastao', 'capa', 'chicote', 'mangual', 'corrida'];
    
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

// ===== TESTE DE PERÍCIA COM 2d10 (usando combateRolar2d10) =====
function combateTestarPericia(personagem, periciaId, cd = null, modificador = 0) {
    if (!personagem) {
        return { sucesso: false, critico: false, falhaCritica: false, resultado: 0, nh: 0 };
    }
    
    const nh = combateCalcularNH(personagem, periciaId) + modificador;
    const rolagem = combateRolar2d10();
    
    const cdFinal = cd !== null ? cd : nh;
    
    const critico = rolagem.resultado <= 5;
    const falhaCritica = rolagem.resultado >= 95;
    
    let sucesso = false;
    if (critico) {
        sucesso = true;
    } else if (falhaCritica) {
        sucesso = false;
    } else {
        sucesso = rolagem.resultado <= cdFinal;
    }
    
    return {
        sucesso,
        critico,
        falhaCritica,
        nh,
        cd: cdFinal,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        margem: sucesso ? cdFinal - rolagem.resultado : rolagem.resultado - cdFinal,
        periciaId,
        mensagem: `${sucesso ? '✅ SUCESSO' : '❌ FALHA'} em ${periciaId} | ${rolagem.str} vs ${cdFinal}%${critico ? ' (CRÍTICO!)' : ''}${falhaCritica ? ' (FALHA CRÍTICA!)' : ''}`
    };
}

// ===== CALCULAR DEFESAS (Manual) =====
function combateCalcularEsquiva(personagem) {
    if (!personagem) return 5;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const vigorEsferas = personagem.atributos?.vigor?.esferas || 0;
    
    const dxPercent = 40 + (dxEsferas * 2);
    const vigorPercent = 40 + (vigorEsferas * 3);
    
    let esquiva = Math.floor((dxPercent + vigorPercent) / 2) + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) {
        esquiva += 5;
    }
    
    return Math.min(80, Math.max(5, esquiva));
}

function combateCalcularAparar(personagem) {
    if (!personagem) return 0;
    
    const temArma = personagem.inventario?.corpo?.some(item => item.dano);
    if (!temArma) return 0;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    const periciasAparar = ['espada', 'machado', 'lanca', 'adaga', 'esgrima', 'bastao'];
    let melhorBonus = 0;
    
    periciasAparar.forEach(periciaId => {
        const pericia = personagem.pericias?.[periciaId];
        if (pericia) {
            const bonus = (pericia.nivel || 0) * 4;
            if (bonus > melhorBonus) melhorBonus = bonus;
        }
    });
    
    let aparar = dxPercent + melhorBonus + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) aparar += 5;
    if (personagem.vantagens?.includes('ataquesMultiplos')) aparar += 5;
    
    return Math.min(80, Math.max(5, aparar));
}

function combateCalcularBloqueio(personagem) {
    if (!personagem) return 0;
    
    const temEscudo = personagem.inventario?.corpo?.some(item => item.bonus);
    if (!temEscudo) return 0;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    const periciaEscudo = personagem.pericias?.escudo;
    const bonusPericia = periciaEscudo ? (periciaEscudo.nivel || 0) * 4 : 0;
    
    const escudo = personagem.inventario.corpo?.find(item => item.bonus);
    const bonusEscudo = escudo?.bonus ? escudo.bonus * 5 : 0;
    
    let bloqueio = dxPercent + bonusPericia + bonusEscudo + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) bloqueio += 5;
    
    return Math.min(85, Math.max(5, bloqueio));
}

function combateCalcularRDTotal(personagem) {
    if (!personagem) return 0;
    
    let rd = 0;
    
    if (personagem.vantagens?.includes('corpoResistente')) {
        rd += 2;
    }
    
    // Soma RD de itens equipados
    if (personagem.inventario?.corpo) {
        personagem.inventario.corpo.forEach(item => {
            if (item.rd) rd += item.rd;
        });
    }
    
    return rd;
}

// ===== TESTE DE ATAQUE (Manual) usando combateRolar2d10 =====
function combateTesteAtaque(atacante, defensor, periciaAtaque = null) {
    let periciaUsada = periciaAtaque || 'luta';
    
    // Determinar perícia baseada na arma do atacante
    if (atacante.inventario?.corpo) {
        const arma = atacante.inventario.corpo.find(item => item.dano);
        if (arma) {
            if (arma.nome?.toLowerCase().includes('espada')) periciaUsada = 'espada';
            else if (arma.nome?.toLowerCase().includes('machado')) periciaUsada = 'machado';
            else if (arma.nome?.toLowerCase().includes('lança')) periciaUsada = 'lanca';
            else if (arma.nome?.toLowerCase().includes('adaga')) periciaUsada = 'adaga';
            else if (arma.nome?.toLowerCase().includes('arco')) periciaUsada = 'arco';
            else if (arma.nome?.toLowerCase().includes('besta')) periciaUsada = 'besta';
        }
    }
    
    const nhAtacante = combateCalcularNH(atacante, periciaUsada);
    
    // Calcular defesas do defensor
    const esquiva = combateCalcularEsquiva(defensor);
    const aparar = combateCalcularAparar(defensor);
    const bloqueio = combateCalcularBloqueio(defensor);
    
    // Escolher a melhor defesa disponível
    let defesa = esquiva;
    let defesaUsada = 'esquiva';
    
    if (bloqueio > 0 && bloqueio >= aparar && bloqueio >= esquiva) {
        defesa = bloqueio;
        defesaUsada = 'bloqueio';
    } else if (aparar > 0 && aparar >= esquiva) {
        defesa = aparar;
        defesaUsada = 'aparar';
    }
    
    const rolagem = combateRolar2d10();
    
    // Chance de acerto: NH do atacante reduzido pela metade da defesa do alvo
    const chanceFinal = Math.max(5, Math.min(95, nhAtacante - Math.floor(defesa / 2)));
    
    let acertou = false;
    if (rolagem.critico) {
        acertou = true;
    } else if (rolagem.falhaCritica) {
        acertou = false;
    } else {
        acertou = rolagem.resultado <= chanceFinal;
    }
    
    return {
        acertou,
        critico: rolagem.critico,
        falhaCritica: rolagem.falhaCritica,
        rolagem: rolagem.resultado,
        rolagemStr: rolagem.str,
        nhAtacante,
        defesa,
        defesaUsada,
        chanceFinal: Math.round(chanceFinal),
        periciaUsada
    };
}

// ===== CLASSE DE COMBATE - VERSÃO CORRIGIDA SEM DUPLICAÇÃO =====
class Combate {
    constructor(personagem, inimigoId, callbacks = {}) {
        console.log('⚔️ Criando combate:', inimigoId);
        
        // Criar cópia profunda para não modificar o original
        this.personagem = JSON.parse(JSON.stringify(personagem));
        this.inimigo = JSON.parse(JSON.stringify(INIMIGOS[inimigoId] || INIMIGOS.saqueador_faminto));
        this.callbacks = callbacks;
        
        this.turno = 'jogador';
        this.rodada = 1;
        this.fim = false;
        this._processando = false;
        this._timeout = null;
        this.bonusDefesa = 0;
        this.esquivando = false;
        
        // Garantir que o personagem tem status de combate
        if (!this.personagem.statusCombate) {
            const vt = combateGetVTFixo(this.personagem);
            const vigor = combateGetVIGORFixo(this.personagem);
            const iq = combateGetIQFixo(this.personagem);
            
            this.personagem.statusCombate = {
                vidaAtual: vt * 8,
                manaAtual: vigor + iq + vt,
                fadigaAtual: vigor + vt
            };
        }
        
        // Inicializar vida do inimigo se necessário
        if (!this.inimigo.vida && this.inimigo.vidaMax) {
            this.inimigo.vida = this.inimigo.vidaMax;
        }
        
        this._log('⚔️ COMBATE INICIADO!');
        this._log(`${this.personagem.nome} vs ${this.inimigo.nome}`);
        this._log('✨ SEU TURNO!');
        
        this._atualizarUI();
    }
    
    _log(mensagem, tipo = 'normal') {
        console.log(`[COMBATE] ${mensagem}`);
        if (this.callbacks.onLog) {
            this.callbacks.onLog(mensagem, tipo);
        }
    }
    
    _atualizarUI() {
        if (this.callbacks.onAtualizar) {
            this.callbacks.onAtualizar({
                turno: this.turno,
                rodada: this.rodada,
                fim: this.fim,
                inimigoVida: this.inimigo.vida || 0,
                inimigoVidaMax: this.inimigo.vidaMax || 0,
                personagemVida: this.personagem.statusCombate?.vidaAtual || 0,
                personagemVidaMax: this._calcularVidaMax(),
                isPlayerTurn: this.turno === 'jogador' && !this.fim
            });
        }
    }
    
    _calcularVidaMax() {
        const vt = combateGetVTFixo(this.personagem);
        let pv = vt * 8;
        if (this.personagem.vantagens?.includes('htExtra')) {
            pv = Math.floor(pv * 1.1);
        }
        return pv;
    }
    
    _limparTimeout() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }
    
    atacar() {
        // Verificações de estado
        if (this._processando) {
            console.log('⚠️ Já processando uma ação');
            return false;
        }
        
        if (this.fim) {
            this._log('⚠️ Combate já acabou!');
            return false;
        }
        
        if (this.turno !== 'jogador') {
            this._log('⚠️ Não é seu turno!');
            return false;
        }
        
        // Marcar como processando para evitar duplicação
        this._processando = true;
        this._limparTimeout();
        
        this._log(`👉 ${this.personagem.nome} ataca!`);
        
        // Encontrar arma equipada
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        const teste = combateTesteAtaque(this.personagem, this.inimigo);
        
        if (teste.acertou) {
            const dano = combateCalcularDanoPersonagem(this.personagem, arma);
            const rdInimigo = this.inimigo.armadura || 0;
            let danoFinal = Math.max(1, dano - rdInimigo);
            
            if (teste.critico) {
                danoFinal *= 2;
                this._log(`✨ ATAQUE FULMINANTE! Dano dobrado!`, 'critico');
            }
            
            this.inimigo.vida -= danoFinal;
            if (this.inimigo.vida < 0) this.inimigo.vida = 0;
            
            this._log(`🎯 ACERTOU! Dano: ${danoFinal} (${dano} - ${rdInimigo} RD) | Rolagem: ${teste.rolagemStr}`, 'dano');
            
            // Verificar se inimigo morreu
            if (this.inimigo.vida <= 0) {
                this._log(`💀 ${this.inimigo.nome} foi DERROTADO!`, 'critico');
                this.fim = true;
                this.turno = 'fim';
                this._processando = false;
                this._atualizarUI();
                
                if (this.callbacks.onVitoria) {
                    this.callbacks.onVitoria({
                        xp: this.inimigo.experiencia || 50,
                        ouro: this.inimigo.ouro || 0
                    });
                }
                return true;
            }
        } else {
            let falhaStr = teste.falhaCritica ? ' (FALHA CRÍTICA!)' : '';
            this._log(`❌ ERROU${falhaStr}! Rolagem: ${teste.rolagemStr} vs ${teste.chanceFinal}%`, 'falha');
        }
        
        // Atualizar UI antes de mudar turno
        this._atualizarUI();
        
        // Mudar para turno do inimigo
        this.turno = 'inimigo';
        this._processando = false; // Liberar flag
        
        // Agendar turno do inimigo
        this._timeout = setTimeout(() => this._turnoInimigo(), 1500);
        
        return true;
    }
    
    _turnoInimigo() {
        this._timeout = null;
        
        // Verificar se ainda está no turno do inimigo e combate não acabou
        if (this.fim || this.turno !== 'inimigo') return;
        
        this.rodada++;
        this._log(`--- Rodada ${this.rodada} ---`);
        this._log(`👹 Turno de ${this.inimigo.nome}`);
        
        // Chance do inimigo atacar baseado na agressividade
        if (Math.random() < (this.inimigo.agressividade || 0.8)) {
            const dano = combateRolarDados(this.inimigo.danoFormula || "1d6");
            const rd = combateCalcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            // Calcular defesa do personagem
            let defesaBase = combateCalcularEsquiva(this.personagem);
            let tipoDefesa = 'esquiva';
            
            const aparar = combateCalcularAparar(this.personagem);
            const bloqueio = combateCalcularBloqueio(this.personagem);
            
            if (bloqueio > 0 && bloqueio > defesaBase) {
                defesaBase = bloqueio;
                tipoDefesa = 'bloqueio';
            }
            if (aparar > 0 && aparar > defesaBase) {
                defesaBase = aparar;
                tipoDefesa = 'aparar';
            }
            
            // Calcular chance de acerto do inimigo
            const periciaInimigo = this.inimigo.pericias?.luta ? 'luta' : 'espada';
            const nivelPericia = this.inimigo.pericias?.[periciaInimigo] || 0;
            const nhInimigo = 40 + (nivelPericia * 4);
            
            const rolagem = combateRolar2d10();
            const chanceAcerto = Math.max(10, Math.min(95, nhInimigo - Math.floor(defesaBase / 2)));
            
            let acertou = rolagem.resultado <= chanceAcerto || rolagem.critico;
            
            if (acertou) {
                if (rolagem.critico) {
                    danoFinal *= 2;
                    this._log(`✨ ATAQUE FULMINANTE do inimigo!`, 'critico');
                }
                
                this.personagem.statusCombate.vidaAtual -= danoFinal;
                if (this.personagem.statusCombate.vidaAtual < 0) {
                    this.personagem.statusCombate.vidaAtual = 0;
                }
                
                this._log(`🎯 ${this.inimigo.nome} ACERTOU! Dano: ${danoFinal} (${dano} - ${rd} RD) | Defesa: ${tipoDefesa} (${defesaBase}%)`, 'dano');
                
                // Verificar se personagem morreu
                if (this.personagem.statusCombate.vidaAtual <= 0) {
                    this._log(`💀 ${this.personagem.nome} foi DERROTADO!`, 'falha');
                    this.fim = true;
                    this.turno = 'fim';
                    this._atualizarUI();
                    
                    if (this.callbacks.onDerrota) {
                        this.callbacks.onDerrota();
                    }
                    return;
                }
            } else {
                this._log(`❌ ${this.inimigo.nome} ERROU! Rolagem: ${rolagem.str} vs ${chanceAcerto}% | Defesa: ${tipoDefesa} (${defesaBase}%)`, 'cura');
            }
        } else {
            this._log(`🛡️ ${this.inimigo.nome} defende!`);
        }
        
        // Atualizar UI após ação do inimigo
        this._atualizarUI();
        
        // Só muda para turno do jogador se o combate não acabou
        if (!this.fim) {
            this.turno = 'jogador';
            this._log('✨ SEU TURNO!', 'critico');
            
            // ATUALIZAR UI NOVAMENTE PARA GARANTIR QUE OS BOTÕES FICAM HABILITADOS
            this._atualizarUI();
        }
    }
    
    defender() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._processando = true;
        this._limparTimeout();
        
        this._log(`🛡️ ${this.personagem.nome} defende!`);
        this.bonusDefesa = 20; // Bônus para a próxima defesa
        
        this.turno = 'inimigo';
        this._processando = false;
        this._atualizarUI();
        
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        
        return true;
    }
    
    esquivar() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._processando = true;
        this._limparTimeout();
        
        this._log(`🏃 ${this.personagem.nome} tenta esquivar!`);
        
        const esquivaBase = combateCalcularEsquiva(this.personagem) + this.bonusDefesa;
        const rolagem = combateRolar2d10();
        
        if (rolagem.resultado <= esquivaBase || rolagem.critico) {
            this._log(`✅ ESQUIVOU! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'cura');
            this.esquivando = true;
        } else {
            this._log(`❌ Falhou ao esquivar! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'falha');
            this.esquivando = false;
        }
        
        this.turno = 'inimigo';
        this._processando = false;
        this._atualizarUI();
        
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        
        return true;
    }
    
    fugir() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._processando = true;
        this._limparTimeout();
        
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const dxPercent = 40 + (dxEsferas * 2);
        const chanceFuga = dxPercent + 20;
        
        const rolagem = combateRolar2d10();
        
        if (rolagem.resultado <= chanceFuga || rolagem.critico) {
            this._log(`🏃 FUGA BEM-SUCEDIDA! Rolagem: ${rolagem.str} vs ${chanceFuga}%`, 'cura');
            this.fim = true;
            this.turno = 'fim';
            this._processando = false;
            this._atualizarUI();
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
        } else {
            this._log(`❌ Falhou ao tentar fugir! Rolagem: ${rolagem.str} vs ${chanceFuga}%`, 'falha');
            this.turno = 'inimigo';
            this._processando = false;
            this._atualizarUI();
            
            this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        }
        
        return true;
    }
    
    usarMagia(magiaId) {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._processando = true;
        this._limparTimeout();
        
        this._log(`✨ Sistema de magias em desenvolvimento!`, 'normal');
        
        this.turno = 'inimigo';
        this._processando = false;
        this._atualizarUI();
        
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        
        return false;
    }
    
    getEstado() {
        return {
            turno: this.turno,
            rodada: this.rodada,
            fim: this.fim,
            isPlayerTurn: this.turno === 'jogador' && !this.fim
        };
    }
}

// ✅ EXPORTAÇÃO GLOBAL (com nomes renomeados)
if (typeof window !== 'undefined') {
    window.INIMIGOS = INIMIGOS;
    window.Combate = Combate;
    window.combateRolarDados = combateRolarDados;
    window.combateRolar2d10 = combateRolar2d10;
    window.combateCalcularDanoPersonagem = combateCalcularDanoPersonagem;
    window.combateCalcularNH = combateCalcularNH;
    window.combateTestarPericia = combateTestarPericia;
    window.combateCalcularEsquiva = combateCalcularEsquiva;
    window.combateCalcularAparar = combateCalcularAparar;
    window.combateCalcularBloqueio = combateCalcularBloqueio;
    window.combateCalcularRDTotal = combateCalcularRDTotal;
    window.combateTesteAtaque = combateTesteAtaque;
    window.combateGetSTFixo = combateGetSTFixo;
    window.combateGetDXFixo = combateGetDXFixo;
    window.combateGetIQFixo = combateGetIQFixo;
    window.combateGetVIGORFixo = combateGetVIGORFixo;
    window.combateGetVTFixo = combateGetVTFixo;
    
    console.log('✅ Sistema de Combate carregado e corrigido!');
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        INIMIGOS, 
        Combate,
        combateRolarDados,
        combateRolar2d10,
        combateCalcularDanoPersonagem,
        combateCalcularNH,
        combateTestarPericia,
        combateCalcularEsquiva,
        combateCalcularAparar,
        combateCalcularBloqueio,
        combateCalcularRDTotal,
        combateTesteAtaque
    };
}