// ============================================
// SISTEMA DE COMBATE AKALANATA - VERSÃO FINAL CORRIGIDA
// ✅ Dano: SOMA de fórmulas (ex: 1d-2 + 1d+2 = 2d)
// ✅ Perícias: armasHaste para martelos
// ✅ Histórico mantém só até fim do combate
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
    },
    
    "bandido_arqueiro": {
        id: "bandido_arqueiro",
        nome: "Bandido Arqueiro",
        vida: 30,
        vidaMax: 30,
        descricao: "Um bandido com um arco nas mãos, olhos calculistas.",
        equipamento: "Arco curto",
        armadura: 1,
        danoFormula: "1d8",
        forca: 9,
        destreza: 13,
        vigor: 10,
        inteligencia: 7,
        pericias: { "arco": 3 },
        derivados: { esquiva: 50, aparar: 0, bloqueio: 0 },
        experiencia: 65,
        ouro: 3
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
    if (typeof formula !== 'string') return parseInt(formula) || 1;
    
    // Suporta formatos como "1d8", "2d6+2", "1d-1", "3d"
    const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
    const match = formula.match(regex);
    
    if (!match) {
        // Se for apenas um número
        return parseInt(formula) || 1;
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

// ===== CALCULAR NH DO JOGADOR =====
function combateCalcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    // Lista de perícias físicas
    const periciasFisicas = [
        'espada', 'arco', 'besta', 'escudo', 'luta', 'machado', 
        'lanca', 'adaga', 'martelo', 'armasHaste', 'boxe', 'briga',
        'cavalgar', 'natacao', 'acrobacia', 'furtividade'
    ];
    
    // Se pediu machado mas tem armasHaste, usa armasHaste
    if (periciaId === 'machado' && personagem.pericias?.armasHaste) {
        periciaId = 'armasHaste';
    }
    
    // Se pediu lanca mas tem armasHaste
    if (periciaId === 'lanca' && personagem.pericias?.armasHaste) {
        periciaId = 'armasHaste';
    }
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const atributoBase = 40 + (dxEsferas * 2);
    
    const nh = atributoBase + (nivel * 4);
    
    return Math.min(95, Math.max(5, nh));
}

// ===== CALCULAR NH DO INIMIGO =====
function combateCalcularNHInimigo(inimigo) {
    let nh = 40;
    
    if (inimigo.pericias) {
        if (inimigo.pericias.luta) nh = 40 + (inimigo.pericias.luta * 4);
        else if (inimigo.pericias.espada) nh = 40 + (inimigo.pericias.espada * 4);
        else if (inimigo.pericias.machado) nh = 40 + (inimigo.pericias.machado * 4);
        else if (inimigo.pericias.arco) nh = 40 + (inimigo.pericias.arco * 4);
    }
    
    if (inimigo.destreza) {
        nh += (inimigo.destreza - 5) * 2;
    }
    
    return Math.min(95, Math.max(5, nh));
}

// ===== CALCULAR DEFESA DO INIMIGO =====
function combateCalcularDefesaInimigo(inimigo) {
    if (!inimigo) return 25;
    
    if (inimigo.derivados) {
        const defesas = [];
        if (inimigo.derivados.esquiva) defesas.push(inimigo.derivados.esquiva);
        if (inimigo.derivados.aparar) defesas.push(inimigo.derivados.aparar);
        if (inimigo.derivados.bloqueio) defesas.push(inimigo.derivados.bloqueio);
        
        if (defesas.length > 0) {
            return Math.min(95, Math.max(5, Math.max(...defesas)));
        }
    }
    
    if (inimigo.destreza) {
        const dxPercentual = 40 + ((inimigo.destreza - 5) * 2);
        const vigorPercentual = 40 + ((inimigo.vigor || 5) - 5) * 3;
        const esquivaCalculada = Math.floor((dxPercentual + vigorPercentual) / 2) + 5;
        
        return Math.min(80, Math.max(5, esquivaCalculada));
    }
    
    return 25;
}

// ===== CALCULAR DEFESAS DO JOGADOR =====
function combateCalcularEsquiva(personagem, bonusPenalidade = 0) {
    let esquiva = Math.floor((combateGetDXPercentual(personagem) + combateGetVIGORPercentual(personagem)) / 2) + 5;
    if (personagem.vantagens?.includes('reflexosRapidos')) esquiva += 5;
    
    esquiva += bonusPenalidade;
    
    return Math.min(80, Math.max(5, esquiva));
}

function combateCalcularAparar(personagem, bonusPenalidade = 0) {
    const temArma = personagem.inventario?.corpo?.some(item => item.dano);
    if (!temArma) return 0;
    
    let melhorPericia = 0;
    if (personagem.pericias?.espada) melhorPericia = Math.max(melhorPericia, personagem.pericias.espada.nivel || 0);
    if (personagem.pericias?.armasHaste) melhorPericia = Math.max(melhorPericia, personagem.pericias.armasHaste.nivel || 0);
    if (personagem.pericias?.machado) melhorPericia = Math.max(melhorPericia, personagem.pericias.machado.nivel || 0);
    if (personagem.pericias?.lanca) melhorPericia = Math.max(melhorPericia, personagem.pericias.lanca.nivel || 0);
    
    let aparar = combateGetDXPercentual(personagem) + (melhorPericia * 4) + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) aparar += 5;
    
    aparar += bonusPenalidade;
    
    return Math.min(80, Math.max(5, aparar));
}

function combateCalcularBloqueio(personagem, bonusPenalidade = 0) {
    const temEscudo = personagem.inventario?.corpo?.some(item => item.nome?.toLowerCase().includes('escudo'));
    if (!temEscudo) return 0;
    
    const periciaEscudo = personagem.pericias?.escudo?.nivel || 0;
    let bloqueio = combateGetDXPercentual(personagem) + (periciaEscudo * 4) + 5;
    
    const escudo = personagem.inventario.corpo?.find(item => item.nome?.toLowerCase().includes('escudo'));
    if (escudo?.bonus) bloqueio += escudo.bonus * 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) bloqueio += 5;
    
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

// ===== SOMA DE FÓRMULAS DE DANO =====
function somarFormulasDano(formula1, formula2) {
    // Se uma das fórmulas for inválida, retorna a outra
    if (!formula1 || formula1 === "0") return formula2;
    if (!formula2 || formula2 === "0") return formula1;
    
    // Extrair componentes da primeira fórmula
    const match1 = formula1.match(/^(\d*)d(\d*)([+-]\d+)?$/i);
    // Extrair componentes da segunda fórmula
    const match2 = formula2.match(/^(\d*)d(\d*)([+-]\d+)?$/i);
    
    let dados1 = match1 ? parseInt(match1[1] || 1) : 0;
    let faces1 = match1 ? parseInt(match1[2] || 6) : 0;
    let mod1 = match1 && match1[3] ? parseInt(match1[3]) : 0;
    
    let dados2 = match2 ? parseInt(match2[1] || 1) : 0;
    let faces2 = match2 ? parseInt(match2[2] || 6) : 0;
    let mod2 = match2 && match2[3] ? parseInt(match2[3]) : 0;
    
    // Se não conseguiu extrair, retorna a primeira fórmula
    if (dados1 === 0 && dados2 === 0) return formula1;
    
    // Usa a maior quantidade de faces (ou 6 como padrão)
    const faces = Math.max(faces1, faces2, 6);
    
    // Soma dados e modificadores
    const totalDados = dados1 + dados2;
    const totalMod = mod1 + mod2;
    
    // Constrói a fórmula final
    if (totalDados > 0) {
        let resultado = totalDados + "d" + faces;
        if (totalMod > 0) resultado += "+" + totalMod;
        else if (totalMod < 0) resultado += totalMod;
        return resultado;
    } else {
        // Se não tiver dados, retorna só o modificador
        return (totalMod > 0 ? "+" : "") + totalMod;
    }
}

// ===== CALCULAR DANO - CORRETO (SOMA DE FÓRMULAS) =====
function combateCalcularDanoPersonagem(personagem, arma = null, multiplicador = 1) {
    if (!personagem) return 1;
    
    // 1. Fórmula base da ST
    const stFixo = combateGetSTFixo(personagem);
    const formulaBase = TABELA_DANO_ST[stFixo] || "1d-3";
    
    // 2. Fórmula da arma
    let formulaArma = "0";
    if (arma?.dano) {
        formulaArma = arma.dano;
    }
    
    // 3. SOMA as fórmulas (ex: 1d-2 + 1d+2 = 2d)
    const formulaTotal = somarFormulasDano(formulaBase, formulaArma);
    
    // 4. Rola o dano total
    let danoBase = combateRolarDados(formulaTotal);
    
    // 5. Aplica multiplicador (crítico)
    let danoFinal = danoBase * multiplicador;
    
    // Log para debug (opcional)
    console.log(`🎲 Dano: ${formulaBase} + ${formulaArma} = ${formulaTotal} → rolou ${danoBase} × ${multiplicador} = ${danoFinal}`);
    
    return Math.max(1, Math.floor(danoFinal));
}

// ============================================
// CLASSE DE COMBATE COM FIRESTORE
// ============================================

class CombateFirestore {
    constructor(sessaoId, personagem, inimigoId, callbacks = {}) {
        this.sessaoId = sessaoId;
        this.personagem = personagem;
        this.personagemId = personagem.id;
        this.userId = personagem.userId || personagem.user_id || null;
        this.inimigoId = inimigoId;
        this.callbacks = callbacks;
        
        this.inimigo = null;
        this.status = {
            turno: 'jogador',
            rodada: 1,
            contadorTurnos: 0,
            fim: false,
            aguardandoDefesa: false,
            bonusProximoAtaque: 0,
            penalidadeDefesaInimigo: 0,
            penalidadeDefesaJogador: 0
        };
        this.ultimoAtaque = null;
        this.log = [];
        
        this._ultimaMensagem = null;
        
        this.iniciar();
    }
    
    async iniciar() {
        try {
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
            if (this.callbacks.onErro) {
                this.callbacks.onErro(error.message);
            }
        }
    }
    
    _notificarUI() {
        if (this.callbacks.onAtualizar) {
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
                bonus: this._getBonusInfo()
            });
        }
    }
    
    _getBonusInfo() {
        if (this.status.bonusProximoAtaque > 0) {
            return {
                tipo: 'bonus',
                mensagem: `✨ Bônus de +${this.status.bonusProximoAtaque}% no próximo ataque`
            };
        } else if (this.status.penalidadeDefesaJogador < 0) {
            return {
                tipo: 'penalidade',
                mensagem: `💥 Penalidade de ${this.status.penalidadeDefesaJogador}% nas defesas`
            };
        } else if (this.status.penalidadeDefesaInimigo < 0) {
            return {
                tipo: 'penalidade',
                mensagem: `💥 Inimigo com penalidade de ${this.status.penalidadeDefesaInimigo}% nas defesas`
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
    
    async _verificarFadiga() {
        if (this.status.contadorTurnos >= 5) {
            this.status.contadorTurnos = 0;
            
            const pfAntes = this.personagem.statusCombate.fadigaAtual;
            this.personagem.statusCombate.fadigaAtual = Math.max(0, pfAntes - 1);
            
            this._log(`😮‍💨 Fadiga: -1 PF`, 'normal', true);
            
            if (this.personagemId) {
                try {
                    const db = firebase.firestore();
                    await db.collection('personagens').doc(this.personagemId).update({
                        'statusCombate.fadigaAtual': this.personagem.statusCombate.fadigaAtual
                    });
                } catch (e) {}
            }
        }
    }
    
    async atacar() {
        if (this.status.fim || this.status.turno !== 'jogador' || this.status.aguardandoDefesa) {
            return false;
        }
        
        this._log(`👉 ${this.personagem.nome || 'Herói'} ataca!`, 'normal', true);
        
        await this._verificarFadiga();
        
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        let periciaAtaque = 'luta';
        
        // MAPEAMENTO CORRETO DE ARMAS PARA PERÍCIAS
        if (arma) {
            const nomeArma = (arma.nome || '').toLowerCase();
            
            if (nomeArma.includes('espada')) {
                periciaAtaque = 'espada';
            }
            else if (nomeArma.includes('machado')) {
                periciaAtaque = 'machado';
            }
            else if (nomeArma.includes('lança') || nomeArma.includes('lanca')) {
                periciaAtaque = 'lanca';
            }
            else if (nomeArma.includes('adaga') || nomeArma.includes('faca')) {
                periciaAtaque = 'adaga';
            }
            else if (nomeArma.includes('arco')) {
                periciaAtaque = 'arco';
            }
            else if (nomeArma.includes('besta')) {
                periciaAtaque = 'besta';
            }
            // ARMAS DE HASTE (martelo, clava, maça, porrete)
            else if (nomeArma.includes('martelo') || 
                     nomeArma.includes('clava') || 
                     nomeArma.includes('maça') || 
                     nomeArma.includes('maca') || 
                     nomeArma.includes('porrete')) {
                periciaAtaque = 'armasHaste';
            }
        }
        
        // FALLBACK: Se a perícia não existir, tenta alternativas
        if (!this.personagem.pericias?.[periciaAtaque]) {
            if (this.personagem.pericias?.armasHaste) {
                periciaAtaque = 'armasHaste';
            }
            else if (this.personagem.pericias?.luta) {
                periciaAtaque = 'luta';
            }
        }
        
        let nhJogador = combateCalcularNH(this.personagem, periciaAtaque);
        
        if (this.status.bonusProximoAtaque > 0) {
            nhJogador += this.status.bonusProximoAtaque;
            this._log(`✨ Bônus de +${this.status.bonusProximoAtaque}%`, 'critico', true);
            this.status.bonusProximoAtaque = 0;
        }
        
        const rolagemAtaque = combateRolar2d10();
        
        let acertou = false;
        let foiCritico = false;
        
        if (rolagemAtaque.critico) {
            acertou = true;
            foiCritico = true;
            this._log(`✨✨ ATAQUE FULMINANTE! (${rolagemAtaque.resultado})`, 'critico', true);
            this.status.penalidadeDefesaInimigo = -15;
            
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥💥 FALHA CRÍTICA! (${rolagemAtaque.resultado})`, 'falha', true);
            this.status.penalidadeDefesaJogador = -15;
            
        } else {
            acertou = rolagemAtaque.resultado <= nhJogador;
        }
        
        this._log(`🎲 Rolagem: ${rolagemAtaque.str} vs NH ${nhJogador}% → ${acertou ? 'ACERTOU' : 'ERROU'}`, 'normal', true);
        
        if (acertou) {
            let defesaInimigo = combateCalcularDefesaInimigo(this.inimigo);
            
            if (this.status.penalidadeDefesaInimigo < 0) {
                defesaInimigo += this.status.penalidadeDefesaInimigo;
                this._log(`💥 Inimigo com penalidade de ${this.status.penalidadeDefesaInimigo}%`, 'dano', true);
            }
            
            const rolagemDefesa = combateRolar2d10();
            
            let defendeu = false;
            
            if (rolagemDefesa.critico) {
                defendeu = true;
                this._log(`✨ DEFESA FULMINANTE DO INIMIGO!`, 'critico', true);
                
            } else if (rolagemDefesa.falhaCritica) {
                defendeu = false;
                this._log(`💥 FALHA CRÍTICA NA DEFESA DO INIMIGO!`, 'falha', true);
                
            } else {
                defendeu = rolagemDefesa.resultado <= defesaInimigo;
            }
            
            this._log(`🛡️ Defesa: ${rolagemDefesa.str} vs ${defesaInimigo}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
            
            if (!defendeu) {
                let multiplicador = 1;
                
                if (foiCritico) {
                    multiplicador = 2;
                    this._log(`⚡ Dano duplicado por ataque fulminante!`, 'critico', true);
                }
                
                if (rolagemDefesa.falhaCritica && !foiCritico) {
                    multiplicador = 2;
                    this._log(`⚡ Dano duplicado por falha crítica na defesa!`, 'dano', true);
                }
                
                // Usa a nova função de dano com SOMA DE FÓRMULAS
                const dano = combateCalcularDanoPersonagem(this.personagem, arma, multiplicador);
                const rdInimigo = this.inimigo.armadura || 0;
                let danoFinal = Math.max(1, dano - rdInimigo);
                
                const novaVida = Math.max(0, this.inimigo.vidaAtual - danoFinal);
                
                this._log(`💥 DANO: ${danoFinal} (${dano} rolado - ${rdInimigo} RD)`, 'dano', true);
                
                this.inimigo.vidaAtual = novaVida;
                
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
        
        this.status.penalidadeDefesaInimigo = 0;
        this.status.turno = 'inimigo';
        
        this._notificarUI();
        
        setTimeout(() => this._turnoInimigo(), 1000);
        
        return true;
    }
    
    async _turnoInimigo() {
        if (this.status.fim || this.status.turno !== 'inimigo') return;
        
        this._log(`👹 Turno de ${this.inimigo.nome}`, 'normal', true);
        
        let nhInimigo = combateCalcularNHInimigo(this.inimigo);
        
        const rolagemAtaque = combateRolar2d10();
        
        let acertou = false;
        let foiCritico = false;
        
        if (rolagemAtaque.critico) {
            acertou = true;
            foiCritico = true;
            this._log(`✨✨ ATAQUE FULMINANTE DO INIMIGO! (${rolagemAtaque.resultado})`, 'critico', true);
            
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥💥 FALHA CRÍTICA DO INIMIGO! (${rolagemAtaque.resultado})`, 'falha', true);
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
                foiFalhaCritica: rolagemAtaque.falhaCritica
            };
            
            this.status.aguardandoDefesa = true;
            
            this._log(`🛡️ ESCOLHA SUA DEFESA!`, 'normal', true);
            this._notificarUI();
        } else {
            this.status.turno = 'jogador';
            this.status.contadorTurnos++;
            this.status.rodada = this.status.contadorTurnos + 1;
            
            this._log(`✨ SEU TURNO!`, 'critico', true);
            this._notificarUI();
        }
    }
    
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
        
        if (rolagemDefesa.critico) {
            defendeu = true;
            foiCritico = true;
            this._log(`✨✨ DEFESA FULMINANTE! (${tipoDefesa})`, 'critico', true);
            this.status.bonusProximoAtaque = 10;
            
        } else if (rolagemDefesa.falhaCritica) {
            defendeu = false;
            this._log(`💥💥 FALHA CRÍTICA NA DEFESA! (${tipoDefesa})`, 'falha', true);
            
        } else {
            defendeu = rolagemDefesa.resultado <= defesaBase;
        }
        
        this._log(`🛡️ ${tipoDefesa}: ${rolagemDefesa.str} vs ${defesaBase}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
        
        if (!defendeu) {
            let multiplicador = 1;
            
            if (ataque.foiCritico) {
                multiplicador = 2;
                this._log(`⚡ Dano duplicado por ataque fulminante!`, 'dano', true);
            }
            
            if (rolagemDefesa.falhaCritica && !ataque.foiCritico) {
                multiplicador = 2;
                this._log(`⚡ Dano duplicado por falha crítica na defesa!`, 'dano', true);
            }
            
            const dano = combateRolarDados(ataque.danoFormula) * multiplicador;
            const rd = combateCalcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            const vidaAntes = this.personagem.statusCombate.vidaAtual;
            this.personagem.statusCombate.vidaAtual = Math.max(0, vidaAntes - danoFinal);
            
            this._log(`💥 DANO RECEBIDO: ${danoFinal} (${dano} - ${rd} RD)`, 'dano', true);
            
            if (this.personagemId) {
                try {
                    const db = firebase.firestore();
                    await db.collection('personagens').doc(this.personagemId).update({
                        'statusCombate.vidaAtual': this.personagem.statusCombate.vidaAtual
                    });
                } catch (e) {}
            }
            
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
        
        this.status.penalidadeDefesaJogador = 0;
        this.status.aguardandoDefesa = false;
        this.status.turno = 'jogador';
        this.ultimoAtaque = null;
        
        this.status.contadorTurnos++;
        this.status.rodada = this.status.contadorTurnos + 1;
        
        this._log(`✨ SEU TURNO!`, 'critico', true);
        this._notificarUI();
    }
    
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
    window.combateCalcularDefesaInimigo = combateCalcularDefesaInimigo;
    window.combateCalcularEsquiva = combateCalcularEsquiva;
    window.combateCalcularAparar = combateCalcularAparar;
    window.combateCalcularBloqueio = combateCalcularBloqueio;
    window.combateCalcularRDTotal = combateCalcularRDTotal;
    window.combateCalcularDanoPersonagem = combateCalcularDanoPersonagem;
    window.somarFormulasDano = somarFormulasDano;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        INIMIGOS, 
        CombateFirestore,
        combateCalcularDefesaInimigo,
        somarFormulasDano
    };
}