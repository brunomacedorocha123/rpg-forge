// ============================================
// SISTEMA DE COMBATE AKALANATA SOLO - VERSÃO FINAL CORRIGIDA
// Baseado no Manual do Jogador - Akalanata System
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
        pericias: {
            "luta": 2
        },
        derivados: {
            esquiva: 45,
            aparar: 0,
            bloqueio: 0
        },
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
        experiencia: 75,
        ouro: 5
    }
};

// ===== TABELA DE DANO POR ST =====
const TABELA_DANO_ST = {
    0: "1d-3", 1: "1d-2", 2: "1d-1", 3: "1d-1", 4: "1d", 5: "1d",
    6: "1d+1", 7: "1d+1", 8: "1d+2", 9: "1d+2", 10: "2d-1", 11: "2d-1",
    12: "2d", 13: "2d", 14: "2d+1", 15: "2d+1", 16: "2d+2", 17: "2d+2",
    18: "3d-1", 19: "3d-1", 20: "3d"
};

// ===== FUNÇÕES DE ROLAGEM =====
function combateRolarDados(formula) {
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

function combateRolar2d10() {
    const dado1 = Math.floor(Math.random() * 10) + 1;
    const dado2 = Math.floor(Math.random() * 10) + 1;
    
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

// ===== CALCULAR ATRIBUTOS DO JOGADOR =====
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

// ===== CALCULAR NH DO JOGADOR =====
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

// ===== CALCULAR NH DO INIMIGO (USANDO PERÍCIAS) =====
function combateCalcularNHInimigo(inimigo) {
    let nh = 40; // base mínima
    
    // Usa a perícia de combate se existir
    if (inimigo.pericias) {
        if (inimigo.pericias.luta) {
            nh = 40 + (inimigo.pericias.luta * 4);
        } else if (inimigo.pericias.espada) {
            nh = 40 + (inimigo.pericias.espada * 4);
        } else if (inimigo.pericias.adaga) {
            nh = 40 + (inimigo.pericias.adaga * 4);
        }
    }
    
    return Math.min(95, Math.max(5, nh));
}

// ===== CALCULAR DEFESAS DO JOGADOR =====
function combateCalcularEsquiva(personagem) {
    let esquiva = Math.floor((combateGetDXPercentual(personagem) + combateGetVIGORPercentual(personagem)) / 2) + 5;
    if (personagem.vantagens?.includes('reflexosRapidos')) esquiva += 5;
    return Math.min(80, Math.max(5, esquiva));
}

function combateCalcularAparar(personagem) {
    const temArma = personagem.inventario?.corpo?.some(item => item.dano);
    if (!temArma) return 0;
    
    const periciaEspada = personagem.pericias?.espada?.nivel || 0;
    let aparar = combateGetDXPercentual(personagem) + (periciaEspada * 4) + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) aparar += 5;
    if (personagem.vantagens?.includes('ataquesMultiplos')) aparar += 5;
    
    return Math.min(80, Math.max(5, aparar));
}

function combateCalcularBloqueio(personagem) {
    const temEscudo = personagem.inventario?.corpo?.some(item => item.bonus);
    if (!temEscudo) return 0;
    
    const periciaEscudo = personagem.pericias?.escudo?.nivel || 0;
    let bloqueio = combateGetDXPercentual(personagem) + (periciaEscudo * 4) + 5;
    
    const escudo = personagem.inventario.corpo?.find(item => item.bonus);
    if (escudo?.bonus) bloqueio += escudo.bonus * 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) bloqueio += 5;
    
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

// ===== CALCULAR DANO DO JOGADOR =====
function combateCalcularDanoPersonagem(personagem, arma = null) {
    if (!personagem) return 1;
    
    const esferasST = personagem.atributos?.st?.esferas || 0;
    const danoBaseFormula = TABELA_DANO_ST[esferasST] || "1d-3";
    
    let dano = combateRolarDados(danoBaseFormula);
    
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
    
    if (arma && !arma.distancia) {
        dano += Math.floor(esferasST / 2);
    }
    
    return Math.max(1, dano);
}

// ===== CLASSE DE COMBATE =====
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
        this.aguardandoDefesa = false; // Aguardando jogador escolher defesa
        this.ultimoAtaqueInimigo = null; // Dados do último ataque para defesa
        
        // Garantir status de combate do personagem
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
        
        // Garantir vida do inimigo
        this.inimigo.vida = this.inimigo.vidaMax;
        
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
                aguardandoDefesa: this.aguardandoDefesa,
                inimigoVida: this.inimigo.vida || 0,
                inimigoVidaMax: this.inimigo.vidaMax || 0,
                personagemVida: this.personagem.statusCombate?.vidaAtual || 0,
                personagemVidaMax: this._calcularVidaMax(),
                isPlayerTurn: this.turno === 'jogador' && !this.fim && !this.aguardandoDefesa
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
    
    _finalizarTurnoJogador() {
        this.turno = 'inimigo';
        this._atualizarUI();
        this._timeout = setTimeout(() => this._turnoInimigo(), 1000);
    }
    
    _finalizarTurnoInimigo() {
        if (!this.fim) {
            this.turno = 'jogador';
            this._log('✨ SEU TURNO!', 'critico');
            this._atualizarUI();
        }
    }
    
    // ===== AÇÕES DO JOGADOR =====
    
    atacar() {
        // Verificações
        if (this._processando || this.fim || this.turno !== 'jogador' || this.aguardandoDefesa) {
            return false;
        }
        
        this._processando = true;
        this._limparTimeout();
        
        this._log(`👉 ${this.personagem.nome} ataca!`);
        
        // 1. CALCULAR NH DO JOGADOR
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        let periciaAtaque = 'luta';
        if (arma) {
            if (arma.nome?.toLowerCase().includes('espada')) periciaAtaque = 'espada';
            else if (arma.nome?.toLowerCase().includes('machado')) periciaAtaque = 'machado';
            else if (arma.nome?.toLowerCase().includes('lança')) periciaAtaque = 'lanca';
            else if (arma.nome?.toLowerCase().includes('adaga')) periciaAtaque = 'adaga';
        }
        
        const nhJogador = combateCalcularNH(this.personagem, periciaAtaque);
        const rolagemAtaque = combateRolar2d10();
        
        // 2. VERIFICAR SE ACERTOU
        let acertou = false;
        if (rolagemAtaque.critico) {
            acertou = true;
            this._log(`✨ ATAQUE FULMINANTE!`, 'critico');
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥 FALHA CRÍTICA NO ATAQUE!`, 'falha');
        } else {
            acertou = rolagemAtaque.resultado <= nhJogador;
        }
        
        this._log(`🎲 Rolagem: ${rolagemAtaque.str} vs NH ${nhJogador}% → ${acertou ? 'ACERTOU' : 'ERROU'}`);
        
        if (acertou) {
            // 3. SE ACERTOU, INIMIGO TENTA DEFENDER
            const defesaInimigo = this.inimigo.derivados?.esquiva || 5;
            const rolagemDefesa = combateRolar2d10();
            
            let defendeu = false;
            if (rolagemDefesa.critico) {
                defendeu = true;
                this._log(`✨ ${this.inimigo.nome} DEFENDEU COM FULMINANTE!`, 'critico');
            } else if (rolagemDefesa.falhaCritica) {
                defendeu = false;
                this._log(`💥 ${this.inimigo.nome} FALHA CRÍTICA NA DEFESA!`, 'falha');
            } else {
                defendeu = rolagemDefesa.resultado <= defesaInimigo;
            }
            
            this._log(`🛡️ Defesa: ${rolagemDefesa.str} vs ${defesaInimigo}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`);
            
            if (!defendeu) {
                // 4. SE NÃO DEFENDEU, CAUSA DANO
                const dano = combateCalcularDanoPersonagem(this.personagem, arma);
                const rdInimigo = this.inimigo.armadura || 0;
                let danoFinal = Math.max(1, dano - rdInimigo);
                
                if (rolagemAtaque.critico) {
                    danoFinal *= 2;
                }
                
                this.inimigo.vida -= danoFinal;
                if (this.inimigo.vida < 0) this.inimigo.vida = 0;
                
                this._log(`💥 DANO: ${danoFinal} (${dano} - ${rdInimigo} RD)`, 'dano');
                
                // 5. VERIFICAR SE INIMIGO MORREU
                if (this.inimigo.vida <= 0) {
                    this._log(`💀 ${this.inimigo.nome} foi DERROTADO!`, 'critico');
                    this.fim = true;
                    this.turno = 'fim';
                    this.aguardandoDefesa = false;
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
            }
        }
        
        // FINALIZAR TURNO DO JOGADOR
        this._processando = false;
        this._finalizarTurnoJogador();
        return true;
    }
    
    defender() {
        if (this._processando || this.fim || this.turno !== 'jogador' || this.aguardandoDefesa) {
            return false;
        }
        
        this._log(`🛡️ ${this.personagem.nome} defende!`);
        this._processando = true;
        
        // Bônus de defesa para o próximo turno
        this.bonusDefesa = 10;
        
        this._processando = false;
        this._finalizarTurnoJogador();
        return true;
    }
    
    esquivar() {
        if (this._processando || this.fim || this.turno !== 'jogador' || this.aguardandoDefesa) {
            return false;
        }
        
        this._log(`🏃 ${this.personagem.nome} prepara esquiva!`);
        this._processando = true;
        
        // Próxima defesa será com esquiva
        this.modoEsquiva = true;
        
        this._processando = false;
        this._finalizarTurnoJogador();
        return true;
    }
    
    fugir() {
        if (this._processando || this.fim || this.turno !== 'jogador' || this.aguardandoDefesa) {
            return false;
        }
        
        this._processando = true;
        
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const chanceFuga = 40 + (dxEsferas * 2) + 20; // DX% + 20%
        
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
            this._processando = false;
            this._finalizarTurnoJogador();
        }
        
        return true;
    }
    
    // ===== DEFESAS DO JOGADOR (quando inimigo ataca) =====
    
    defenderComEsquiva() {
        if (!this.aguardandoDefesa || !this.ultimoAtaqueInimigo) return false;
        
        this._processando = true;
        
        const defesaBase = combateCalcularEsquiva(this.personagem) + (this.bonusDefesa || 0);
        const tipoDefesa = 'Esquiva';
        
        this._processarDefesa(tipoDefesa, defesaBase);
        return true;
    }
    
    defenderComAparar() {
        if (!this.aguardandoDefesa || !this.ultimoAtaqueInimigo) return false;
        
        this._processando = true;
        
        const defesaBase = combateCalcularAparar(this.personagem) + (this.bonusDefesa || 0);
        const tipoDefesa = 'Aparar';
        
        this._processarDefesa(tipoDefesa, defesaBase);
        return true;
    }
    
    defenderComBloqueio() {
        if (!this.aguardandoDefesa || !this.ultimoAtaqueInimigo) return false;
        
        this._processando = true;
        
        const defesaBase = combateCalcularBloqueio(this.personagem) + (this.bonusDefesa || 0);
        const tipoDefesa = 'Bloqueio';
        
        this._processarDefesa(tipoDefesa, defesaBase);
        return true;
    }
    
    _processarDefesa(tipoDefesa, defesaBase) {
        const ataque = this.ultimoAtaqueInimigo;
        const rolagemDefesa = combateRolar2d10();
        
        let defendeu = false;
        if (rolagemDefesa.critico) {
            defendeu = true;
            this._log(`✨ DEFESA FULMINANTE! (${tipoDefesa})`, 'critico');
        } else if (rolagemDefesa.falhaCritica) {
            defendeu = false;
            this._log(`💥 FALHA CRÍTICA NA DEFESA! (${tipoDefesa})`, 'falha');
        } else {
            defendeu = rolagemDefesa.resultado <= defesaBase;
        }
        
        this._log(`🛡️ ${tipoDefesa}: ${rolagemDefesa.str} vs ${defesaBase}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`);
        
        if (!defendeu) {
            // DEFESA FALHOU - TOMA DANO
            const dano = combateRolarDados(ataque.danoFormula);
            const rd = combateCalcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            if (ataque.rolagemAtaque.critico) {
                danoFinal *= 2;
            }
            
            this.personagem.statusCombate.vidaAtual -= danoFinal;
            if (this.personagem.statusCombate.vidaAtual < 0) {
                this.personagem.statusCombate.vidaAtual = 0;
            }
            
            this._log(`💥 DANO RECEBIDO: ${danoFinal} (${dano} - ${rd} RD)`, 'dano');
            
            // VERIFICAR SE MORREU
            if (this.personagem.statusCombate.vidaAtual <= 0) {
                this._log(`💀 ${this.personagem.nome} foi DERROTADO!`, 'falha');
                this.fim = true;
                this.turno = 'fim';
                this.aguardandoDefesa = false;
                this._processando = false;
                this._atualizarUI();
                
                if (this.callbacks.onDerrota) {
                    this.callbacks.onDerrota();
                }
                return;
            }
        }
        
        // LIMPAR ESTADOS
        this.aguardandoDefesa = false;
        this.ultimoAtaqueInimigo = null;
        this.bonusDefesa = 0;
        this.modoEsquiva = false;
        this._processando = false;
        
        this._atualizarUI();
        this._finalizarTurnoInimigo();
    }
    
    // ===== TURNO DO INIMIGO =====
    
    _turnoInimigo() {
        if (this.fim || this.turno !== 'inimigo') return;
        
        this.rodada++;
        this._log(`--- Rodada ${this.rodada} ---`);
        this._log(`👹 Turno de ${this.inimigo.nome}`);
        
        // 1. INIMIGO SEMPRE ATACA (não tem agressividade)
        this._inimigoAtacar();
    }
    
    _inimigoAtacar() {
        // 1. CALCULAR NH DO INIMIGO
        const nhInimigo = combateCalcularNHInimigo(this.inimigo);
        const rolagemAtaque = combateRolar2d10();
        
        // 2. VERIFICAR SE ACERTOU
        let acertou = false;
        if (rolagemAtaque.critico) {
            acertou = true;
            this._log(`✨ ATAQUE FULMINANTE DO INIMIGO!`, 'critico');
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥 FALHA CRÍTICA DO INIMIGO!`, 'falha');
        } else {
            acertou = rolagemAtaque.resultado <= nhInimigo;
        }
        
        this._log(`🎲 ${this.inimigo.nome} ataca: ${rolagemAtaque.str} vs NH ${nhInimigo}% → ${acertou ? 'ACERTOU' : 'ERROU'}`);
        
        if (acertou) {
            // 3. SE ACERTOU, JOGADOR PRECISA DEFENDER
            this._log(`🛡️ ESCOLHA SUA DEFESA!`);
            
            // Salvar dados do ataque
            this.ultimoAtaqueInimigo = {
                danoFormula: this.inimigo.danoFormula || "1d6",
                rolagemAtaque: rolagemAtaque,
                nhInimigo: nhInimigo
            };
            
            this.aguardandoDefesa = true;
            this._atualizarUI();
            return;
        }
        
        // SE ERROU, FINALIZA TURNO
        this._finalizarTurnoInimigo();
    }
    
    // ===== UTILITÁRIOS =====
    
    getEstado() {
        return {
            turno: this.turno,
            rodada: this.rodada,
            fim: this.fim,
            aguardandoDefesa: this.aguardandoDefesa
        };
    }
}

// ===== EXPORTAÇÃO =====
if (typeof window !== 'undefined') {
    window.INIMIGOS = INIMIGOS;
    window.Combate = Combate;
    window.combateRolarDados = combateRolarDados;
    window.combateRolar2d10 = combateRolar2d10;
    window.combateCalcularNH = combateCalcularNH;
    window.combateCalcularNHInimigo = combateCalcularNHInimigo;
    window.combateCalcularEsquiva = combateCalcularEsquiva;
    window.combateCalcularAparar = combateCalcularAparar;
    window.combateCalcularBloqueio = combateCalcularBloqueio;
    window.combateCalcularRDTotal = combateCalcularRDTotal;
    window.combateCalcularDanoPersonagem = combateCalcularDanoPersonagem;
    
    console.log('✅ Sistema de Combate carregado!');
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INIMIGOS, Combate };
}