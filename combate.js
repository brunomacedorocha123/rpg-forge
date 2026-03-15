// ============================================
// SISTEMA DE COMBATE AKALANATA SOLO - VERSÃO COMPLETA E CORRIGIDA
// Baseado no Manual do Jogador - Akalanata System
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
    }
};

// ===== TABELA DE DANO POR ST (DO MANUAL) =====
const TABELA_DANO_ST = {
    0: "1d-3", 1: "1d-2", 2: "1d-1", 3: "1d-1", 4: "1d", 5: "1d",
    6: "1d+1", 7: "1d+1", 8: "1d+2", 9: "1d+2", 10: "2d-1", 11: "2d-1",
    12: "2d", 13: "2d", 14: "2d+1", 15: "2d+1", 16: "2d+2", 17: "2d+2",
    18: "3d-1", 19: "3d-1", 20: "3d"
};

// ===== ROLAR DADOS =====
function rolarDados(formula) {
    if (!formula) return 1;
    
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

// ===== ROLAR 2d10 PARA PORCENTAGEM =====
function rolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const dado2 = Math.floor(Math.random() * 10) + 1; // 1-10
    
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

// ===== CALCULAR DANO DO PERSONAGEM =====
function calcularDanoPersonagem(personagem, arma = null) {
    if (!personagem) return 1;
    
    const esferasST = personagem.atributos?.st?.esferas || 0;
    const danoBaseFormula = TABELA_DANO_ST[esferasST] || "1d-3";
    
    let dano = rolarDados(danoBaseFormula);
    
    if (arma?.dano) {
        if (typeof arma.dano === 'string') {
            if (arma.dano.includes('d')) {
                dano += rolarDados(arma.dano);
            } else {
                const bonus = parseInt(arma.dano) || 0;
                dano += bonus;
            }
        }
    }
    
    if (arma && !arma.distancia) {
        dano += Math.floor(esferasST / 2);
    }
    
    return Math.max(1, dano);
}

// ===== CALCULAR NH (Nível de Habilidade) =====
function calcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
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

// ===== TESTE DE PERÍCIA COM 2d10 =====
function testarPericia(personagem, periciaId, cd = null, modificador = 0) {
    if (!personagem) {
        return { sucesso: false, critico: false, falhaCritica: false, resultado: 0, nh: 0 };
    }
    
    const nh = calcularNH(personagem, periciaId) + modificador;
    const rolagem = rolar2d10();
    
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
function calcularEsquiva(personagem) {
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

function calcularAparar(personagem) {
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

function calcularBloqueio(personagem) {
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

function calcularRDTotal(personagem) {
    if (!personagem) return 0;
    
    let rd = 0;
    
    if (personagem.vantagens?.includes('corpoResistente')) {
        rd += 2;
    }
    
    personagem.inventario?.corpo?.forEach(item => {
        if (item.rd) rd += item.rd;
    });
    
    return rd;
}

// ===== TESTE DE ATAQUE (Manual) =====
function testeAtaque(atacante, defensor, periciaAtaque = null) {
    let periciaUsada = periciaAtaque || 'luta';
    
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
    
    const nhAtacante = calcularNH(atacante, periciaUsada);
    
    const esquiva = calcularEsquiva(defensor);
    const aparar = calcularAparar(defensor);
    const bloqueio = calcularBloqueio(defensor);
    
    let defesa = esquiva;
    let defesaUsada = 'esquiva';
    
    if (bloqueio > 0 && bloqueio >= aparar && bloqueio >= esquiva) {
        defesa = bloqueio;
        defesaUsada = 'bloqueio';
    } else if (aparar > 0 && aparar >= esquiva) {
        defesa = aparar;
        defesaUsada = 'aparar';
    }
    
    const rolagem = rolar2d10();
    
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
        
        if (!this.personagem.statusCombate) {
            const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
            const vigor = 5 + (this.personagem.atributos?.vigor?.esferas || 0);
            const iq = 5 + (this.personagem.atributos?.iq?.esferas || 0);
            
            this.personagem.statusCombate = {
                vidaAtual: vt * 8,
                manaAtual: vigor + iq + vt,
                fadigaAtual: vigor + vt
            };
        }
        
        this._log('⚔️ COMBATE INICIADO!');
        this._log(`${this.personagem.nome} vs ${this.inimigo.nome}`);
        this._log('✨ SEU TURNO!');
        
        this._atualizarUI();
    }
    
    _log(mensagem, tipo = 'normal') {
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
                inimigoVida: this.inimigo.vida,
                inimigoVidaMax: this.inimigo.vidaMax,
                personagemVida: this.personagem.statusCombate?.vidaAtual || 0,
                personagemVidaMax: this._calcularVidaMax()
            });
        }
    }
    
    _calcularVidaMax() {
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
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
        
        this._limparTimeout();
        this._processando = true;
        
        this._log(`👉 ${this.personagem.nome} ataca!`);
        
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        const teste = testeAtaque(this.personagem, this.inimigo);
        
        if (teste.acertou) {
            const dano = calcularDanoPersonagem(this.personagem, arma);
            const rdInimigo = this.inimigo.armadura || 0;
            let danoFinal = Math.max(1, dano - rdInimigo);
            
            if (teste.critico) {
                danoFinal *= 2;
                this._log(`✨ ATAQUE FULMINANTE! Dano dobrado!`, 'critico');
            }
            
            this.inimigo.vida -= danoFinal;
            if (this.inimigo.vida < 0) this.inimigo.vida = 0;
            
            this._log(`🎯 ACERTOU! Dano: ${danoFinal} (${dano} - ${rdInimigo} RD) | Rolagem: ${teste.rolagemStr}`, 'dano');
            
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
        
        this._atualizarUI();
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this._turnoInimigo(), 1500);
        
        return true;
    }
    
    _turnoInimigo() {
        this._timeout = null;
        this._processando = false;
        
        if (this.fim || this.turno !== 'inimigo') return;
        
        this.rodada++;
        this._log(`--- Rodada ${this.rodada} ---`);
        this._log(`👹 Turno de ${this.inimigo.nome}`);
        
        if (Math.random() < this.inimigo.agressividade) {
            const dano = rolarDados(this.inimigo.danoFormula || "1d6");
            const rd = calcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            let defesaBase = calcularEsquiva(this.personagem);
            let tipoDefesa = 'esquiva';
            
            const aparar = calcularAparar(this.personagem);
            const bloqueio = calcularBloqueio(this.personagem);
            
            if (bloqueio > 0 && bloqueio > defesaBase) {
                defesaBase = bloqueio;
                tipoDefesa = 'bloqueio';
            }
            if (aparar > 0 && aparar > defesaBase) {
                defesaBase = aparar;
                tipoDefesa = 'aparar';
            }
            
            const periciaInimigo = this.inimigo.pericias?.luta ? 'luta' : 'espada';
            const nivelPericia = this.inimigo.pericias?.[periciaInimigo] || 0;
            const nhInimigo = 40 + (nivelPericia * 4);
            
            const rolagem = rolar2d10();
            const chanceAcerto = Math.max(10, Math.min(95, nhInimigo - Math.floor(defesaBase / 2)));
            
            if (rolagem.resultado <= chanceAcerto || rolagem.critico) {
                if (rolagem.critico) {
                    danoFinal *= 2;
                    this._log(`✨ ATAQUE FULMINANTE do inimigo!`, 'critico');
                }
                
                this.personagem.statusCombate.vidaAtual -= danoFinal;
                if (this.personagem.statusCombate.vidaAtual < 0) {
                    this.personagem.statusCombate.vidaAtual = 0;
                }
                
                this._log(`🎯 ${this.inimigo.nome} ACERTOU! Dano: ${danoFinal} (${dano} - ${rd} RD) | Defesa: ${tipoDefesa} (${defesaBase}%)`, 'dano');
                
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
        
        this._atualizarUI();
        
        if (!this.fim) {
            this.turno = 'jogador';
            this._log('✨ SEU TURNO!', 'critico');
        }
    }
    
    defender() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._limparTimeout();
        this._processando = true;
        
        this._log(`🛡️ ${this.personagem.nome} defende!`);
        this.bonusDefesa = 20;
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        this._atualizarUI();
        
        return true;
    }
    
    esquivar() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._limparTimeout();
        this._processando = true;
        
        this._log(`🏃 ${this.personagem.nome} tenta esquivar!`);
        
        const esquivaBase = calcularEsquiva(this.personagem);
        const rolagem = rolar2d10();
        
        if (rolagem.resultado <= esquivaBase || rolagem.critico) {
            this._log(`✅ ESQUIVOU! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'cura');
            this.esquivando = true;
        } else {
            this._log(`❌ Falhou ao esquivar! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'falha');
            this.esquivando = false;
        }
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        this._atualizarUI();
        
        return true;
    }
    
    fugir() {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._limparTimeout();
        this._processando = true;
        
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const dxPercent = 40 + (dxEsferas * 2);
        const chanceFuga = dxPercent + 20;
        
        const rolagem = rolar2d10();
        
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
            this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
            this._atualizarUI();
        }
        
        return true;
    }
    
    usarMagia(magiaId) {
        if (this._processando || this.fim || this.turno !== 'jogador') return false;
        
        this._limparTimeout();
        this._processando = true;
        
        this._log(`✨ Sistema de magias em desenvolvimento!`, 'normal');
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this._turnoInimigo(), 1200);
        this._atualizarUI();
        
        return false;
    }
    
    getEstado() {
        return {
            turno: this.turno,
            rodada: this.rodada,
            fim: this.fim
        };
    }
}

// ✅ EXPORTAÇÃO GLOBAL
if (typeof window !== 'undefined') {
    window.INIMIGOS = INIMIGOS;
    window.Combate = Combate;
    window.rolarDados = rolarDados;
    window.rolar2d10 = rolar2d10;
    window.calcularDanoPersonagem = calcularDanoPersonagem;
    window.calcularNH = calcularNH;
    window.testarPericia = testarPericia;
    window.calcularEsquiva = calcularEsquiva;
    window.calcularAparar = calcularAparar;
    window.calcularBloqueio = calcularBloqueio;
    window.calcularRDTotal = calcularRDTotal;
    window.testeAtaque = testeAtaque;
    
    console.log('✅ Sistema de Combate carregado!');
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INIMIGOS, Combate };
}