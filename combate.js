// ============================================
// SISTEMA DE COMBATE AKALANATA SOLO - COMPLETO E CORRIGIDO
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
        danoBase: 5,
        forca: 11,
        destreza: 10,
        vigor: 11,
        inteligencia: 8,
        pericias: {
            espada: 2,
            escudo: 1
        },
        derivados: {
            esquiva: 30,
            aparar: 40,
            bloqueio: 35,
            rdExtra: 2
        },
        agressividade: 0.7,
        portrait: "imagens/guarda.png",
        experiencia: 75,
        ouro: 5
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
    if (!formula) return 1;
    
    const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    
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
    const dado1 = Math.floor(Math.random() * 10); // 0-9
    const dado2 = Math.floor(Math.random() * 10); // 0-9
    
    const dezena = dado1 === 0 ? 0 : dado1;
    const unidade = dado2;
    
    const resultado = (dezena * 10) + unidade;
    const resultadoFinal = resultado === 0 ? 100 : resultado;
    
    return {
        dado1: dado1 + 1,
        dado2: dado2 + 1,
        resultado: resultadoFinal,
        str: `[${dado1 + 1}][${dado2 + 1}] = ${resultadoFinal}`,
        critico: resultadoFinal <= 5,
        falhaCritica: resultadoFinal >= 96
    };
}

// ===== CALCULAR DANO DO PERSONAGEM =====
function calcularDanoPersonagem(personagem, arma = null) {
    if (!personagem) return 1;
    
    const esferasST = personagem.atributos?.st?.esferas || 0;
    const danoBaseFormula = TABELA_DANO_ST[esferasST] || "1d-3";
    
    let dano = rolarDados(danoBaseFormula);
    
    if (arma && arma.dano) {
        if (typeof arma.dano === 'string') {
            if (arma.dano.includes('d')) {
                dano += rolarDados(arma.dano);
            } else {
                const bonus = parseInt(arma.dano.replace(/[^0-9-]/g, '')) || 0;
                dano += bonus;
            }
        }
    }
    
    if (arma && !arma.distancia) {
        dano += Math.floor((esferasST - 5) / 2);
    }
    
    return Math.max(1, dano);
}

// ===== CALCULAR NH (Nível de Habilidade) DE PERÍCIA =====
function calcularNH(personagem, periciaId) {
    if (!personagem || !periciaId) return 5;
    
    const pericia = personagem.pericias?.[periciaId];
    if (!pericia) return 5;
    
    const nivel = pericia.nivel || 0;
    
    let atributoBase = 40;
    
    const periciasFisicas = ['espada', 'arco', 'besta', 'escudo', 'briga', 'machado', 'lanca', 'adaga', 
                             'acrobacia', 'furtividade', 'cavalgar', 'natacao', 'fuga', 'arremesso'];
    
    const periciasMentais = ['persuasao', 'intimidacao', 'observar', 'sobrevivencia', 'medicina', 
                             'historia', 'arqueologia', 'comercio', 'detectarMentira', 'adestramento',
                             'alquimia', 'primeirosSocorros', 'rastreamento', 'oratoria'];
    
    if (periciasFisicas.includes(periciaId)) {
        const dxEsferas = personagem.atributos?.dx?.esferas || 0;
        atributoBase = 40 + (dxEsferas * 2);
    } else if (periciasMentais.includes(periciaId)) {
        const iqEsferas = personagem.atributos?.iq?.esferas || 0;
        atributoBase = 40 + (iqEsferas * 2);
    }
    
    const bonusPericia = nivel * 4;
    
    let bonusVantagens = 0;
    if (personagem.vantagens) {
        if (personagem.vantagens.includes('reflexosRapidos') && periciasFisicas.includes(periciaId)) {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('carisma') && (periciaId === 'persuasao' || periciaId === 'oratoria')) {
            bonusVantagens += 5;
        }
        if (personagem.vantagens.includes('orientacaoExplorador') && (periciaId === 'sobrevivencia' || periciaId === 'rastreamento')) {
            bonusVantagens += 5;
        }
    }
    
    const nh = atributoBase + bonusPericia + bonusVantagens;
    
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
    const falhaCritica = rolagem.resultado >= 96;
    
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

// ===== CALCULAR DEFESAS DO PERSONAGEM =====
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
    
    const temArma = personagem.inventario?.corpo?.some(item => item.dano && !item.duasMaos);
    if (!temArma) return 0;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    let melhorBonus = 0;
    const periciasAparar = ['espada', 'machado', 'lanca', 'adaga', 'bastao'];
    
    periciasAparar.forEach(periciaId => {
        const pericia = personagem.pericias?.[periciaId];
        if (pericia) {
            const bonus = (pericia.nivel || 0) * 4;
            if (bonus > melhorBonus) melhorBonus = bonus;
        }
    });
    
    let aparar = dxPercent + melhorBonus + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) {
        aparar += 5;
    }
    if (personagem.vantagens?.includes('ataquesMultiplos')) {
        aparar += 5;
    }
    
    return Math.min(80, Math.max(5, aparar));
}

function calcularBloqueio(personagem) {
    if (!personagem) return 0;
    
    const temEscudo = personagem.inventario?.corpo?.some(item => item.bonus !== undefined);
    if (!temEscudo) return 0;
    
    const dxEsferas = personagem.atributos?.dx?.esferas || 0;
    const dxPercent = 40 + (dxEsferas * 2);
    
    const periciaEscudo = personagem.pericias?.escudo;
    const bonusPericia = periciaEscudo ? (periciaEscudo.nivel || 0) * 4 : 0;
    
    let bonusEscudo = 0;
    const escudo = personagem.inventario.corpo?.find(item => item.bonus !== undefined);
    if (escudo && escudo.bonus) {
        bonusEscudo = escudo.bonus * 5;
    }
    
    let bloqueio = dxPercent + bonusPericia + bonusEscudo + 5;
    
    if (personagem.vantagens?.includes('reflexosRapidos')) {
        bloqueio += 5;
    }
    
    return Math.min(85, Math.max(5, bloqueio));
}

// ===== TESTE DE ATAQUE (Atacante vs Defensor) =====
function testeAtaque(atacante, defensor, tipoDefesa = 'auto', periciaAtaque = null) {
    if (!atacante || !defensor) {
        return { acertou: false, mensagem: 'Dados inválidos' };
    }
    
    let periciaUsada = periciaAtaque;
    if (!periciaUsada) {
        if (atacante.inventario?.corpo) {
            const arma = atacante.inventario.corpo.find(item => item.dano);
            if (arma) {
                if (arma.nome?.toLowerCase().includes('espada')) periciaUsada = 'espada';
                else if (arma.nome?.toLowerCase().includes('machado')) periciaUsada = 'machado';
                else if (arma.nome?.toLowerCase().includes('lança')) periciaUsada = 'lanca';
                else if (arma.nome?.toLowerCase().includes('adaga')) periciaUsada = 'adaga';
                else if (arma.nome?.toLowerCase().includes('arco')) periciaUsada = 'arco';
                else if (arma.nome?.toLowerCase().includes('besta')) periciaUsada = 'besta';
                else periciaUsada = 'briga';
            } else {
                periciaUsada = 'briga';
            }
        } else {
            periciaUsada = 'briga';
        }
    }
    
    const nhAtacante = calcularNH(atacante, periciaUsada);
    
    let defesa = 0;
    let defesaUsada = 'esquiva';
    
    if (tipoDefesa === 'auto') {
        const esquiva = calcularEsquiva(defensor);
        const aparar = calcularAparar(defensor);
        const bloqueio = calcularBloqueio(defensor);
        
        if (bloqueio > 0 && bloqueio >= aparar && bloqueio >= esquiva) {
            defesa = bloqueio;
            defesaUsada = 'bloqueio';
        } else if (aparar > 0 && aparar >= esquiva) {
            defesa = aparar;
            defesaUsada = 'aparar';
        } else {
            defesa = esquiva;
            defesaUsada = 'esquiva';
        }
    } else {
        if (tipoDefesa === 'esquiva') defesa = calcularEsquiva(defensor);
        else if (tipoDefesa === 'aparar') defesa = calcularAparar(defensor);
        else if (tipoDefesa === 'bloqueio') defesa = calcularBloqueio(defensor);
    }
    
    const rolagem = rolar2d10();
    
    const chanceFinal = Math.max(5, nhAtacante - Math.floor(defesa / 2));
    
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

// ===== CALCULAR RD TOTAL =====
function calcularRDTotal(personagem) {
    if (!personagem) return 0;
    
    let rd = 0;
    
    if (personagem.vantagens?.includes('corpoResistente')) {
        rd += 2;
    }
    
    if (personagem.inventario?.corpo) {
        personagem.inventario.corpo.forEach(item => {
            if (item.rd) rd += item.rd;
            if (item.tipo === 'armadura' && item.rd) rd += item.rd;
        });
    }
    
    return rd;
}

// ===== CLASSE DE COMBATE =====
class Combate {
    constructor(personagem, inimigoId, callbacks = {}) {
        this.personagem = JSON.parse(JSON.stringify(personagem));
        this.inimigo = JSON.parse(JSON.stringify(INIMIGOS[inimigoId] || INIMIGOS.saqueador_faminto));
        this.callbacks = callbacks;
        this.turno = 'jogador';
        this.rodada = 1;
        this.fim = false;
        this.log = [];
        this.bonusDefesa = 0;
        this.esquivando = false;
        this._timeout = null;
        
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
        
        this._adicionarLogInterno(`⚔️ COMBATE INICIADO - Rodada ${this.rodada}`);
        this._adicionarLogInterno(`${this.personagem.nome} vs ${this.inimigo.nome}`);
        this.atualizarInterface();
    }
    
    _adicionarLogInterno(mensagem, tipo = 'normal') {
        this.log.push({ mensagem, tipo, timestamp: Date.now() });
        if (this.callbacks.onLog) {
            this.callbacks.onLog(mensagem, tipo);
        }
    }
    
    adicionarLog(mensagem, tipo = 'normal') {
        this._adicionarLogInterno(mensagem, tipo);
    }
    
    atualizarInterface() {
        if (this.callbacks.onAtualizar) {
            this.callbacks.onAtualizar({
                inimigoVida: this.inimigo.vida,
                inimigoVidaMax: this.inimigo.vidaMax,
                personagemVida: this.personagem.statusCombate?.vidaAtual || 0,
                personagemVidaMax: this.calcularVidaMax(),
                personagemMana: this.personagem.statusCombate?.manaAtual || 0,
                personagemManaMax: this.calcularManaMax(),
                personagemFadiga: this.personagem.statusCombate?.fadigaAtual || 0,
                personagemFadigaMax: this.calcularFadigaMax(),
                turno: this.turno,
                rodada: this.rodada,
                fim: this.fim
            });
        }
    }
    
    calcularVidaMax() {
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
        let pv = vt * 8;
        if (this.personagem.vantagens?.includes('htExtra')) {
            pv = Math.floor(pv * 1.1);
        }
        return pv;
    }
    
    calcularManaMax() {
        const vigor = 5 + (this.personagem.atributos?.vigor?.esferas || 0);
        const iq = 5 + (this.personagem.atributos?.iq?.esferas || 0);
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
        return vigor + iq + vt;
    }
    
    calcularFadigaMax() {
        const vigor = 5 + (this.personagem.atributos?.vigor?.esferas || 0);
        const vt = 5 + (this.personagem.atributos?.vt?.esferas || 0);
        return vigor + vt;
    }
    
    atacar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        if (this._timeout) clearTimeout(this._timeout);
        
        this._adicionarLogInterno(`👉 ${this.personagem.nome} ataca!`, 'normal');
        
        const arma = this.personagem.inventario?.corpo?.find(item => item.dano);
        const teste = testeAtaque(this.personagem, this.inimigo, 'auto');
        
        if (teste.acertou) {
            const dano = calcularDanoPersonagem(this.personagem, arma);
            const rdInimigo = this.inimigo.armadura || 0;
            let danoFinal = Math.max(1, dano - rdInimigo);
            
            if (teste.critico) {
                danoFinal *= 2;
            }
            
            this.inimigo.vida -= danoFinal;
            
            let criticoStr = teste.critico ? ' (CRÍTICO! Dano dobrado)' : '';
            this._adicionarLogInterno(`🎯 ACERTOU${criticoStr}! Dano: ${danoFinal} (${dano} - ${rdInimigo} RD) | Rolagem: ${teste.rolagemStr}`, 'dano');
            
            if (this.inimigo.vida <= 0) {
                this.inimigo.vida = 0;
                this._adicionarLogInterno(`💀 ${this.inimigo.nome} foi DERROTADO!`, 'critico');
                this.fim = true;
                this.turno = 'fim';
                this.atualizarInterface();
                
                if (this.callbacks.onVitoria) {
                    this.callbacks.onVitoria({
                        xp: this.inimigo.experiencia || 50,
                        ouro: this.inimigo.ouro || 0,
                        inimigo: this.inimigo.id
                    });
                }
                return true;
            }
        } else {
            let falhaStr = teste.falhaCritica ? ' (FALHA CRÍTICA!)' : '';
            this._adicionarLogInterno(`❌ ERROU${falhaStr}! Rolagem: ${teste.rolagemStr} vs ${teste.chanceFinal}%`, 'falha');
        }
        
        this.atualizarInterface();
        
        if (!this.fim) {
            this.turno = 'inimigo';
            this._timeout = setTimeout(() => this.turnoInimigo(), 1500);
        }
        
        return true;
    }
    
    defender() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        if (this._timeout) clearTimeout(this._timeout);
        
        this._adicionarLogInterno(`🛡️ ${this.personagem.nome} assume posição defensiva! (+20% em todas as defesas)`, 'defesa');
        this.bonusDefesa = 20;
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this.turnoInimigo(), 1200);
        this.atualizarInterface();
        
        return true;
    }
    
    esquivar() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        if (this._timeout) clearTimeout(this._timeout);
        
        this._adicionarLogInterno(`🏃 ${this.personagem.nome} tenta esquivar!`, 'defesa');
        
        const esquivaBase = calcularEsquiva(this.personagem);
        const rolagem = rolar2d10();
        
        if (rolagem.resultado <= esquivaBase || rolagem.critico) {
            this._adicionarLogInterno(`✅ ESQUIVOU! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'cura');
            this.esquivando = true;
        } else {
            this._adicionarLogInterno(`❌ Falhou ao esquivar! Rolagem: ${rolagem.str} vs Esquiva ${esquivaBase}%`, 'falha');
            this.esquivando = false;
        }
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this.turnoInimigo(), 1200);
        this.atualizarInterface();
        
        return true;
    }
    
    usarMagia(magiaId) {
        if (this.fim || this.turno !== 'jogador') return false;
        
        if (this._timeout) clearTimeout(this._timeout);
        
        this._adicionarLogInterno(`✨ Sistema de magias em desenvolvimento!`, 'normal');
        
        this.turno = 'inimigo';
        this._timeout = setTimeout(() => this.turnoInimigo(), 1200);
        this.atualizarInterface();
        
        return false;
    }
    
    fugir() {
        if (this.fim || this.turno !== 'jogador') return false;
        
        if (this._timeout) clearTimeout(this._timeout);
        
        const dxEsferas = this.personagem.atributos?.dx?.esferas || 0;
        const dxPercent = 40 + (dxEsferas * 2);
        const chanceFuga = dxPercent + 20;
        
        const rolagem = rolar2d10();
        
        if (rolagem.resultado <= chanceFuga || rolagem.critico) {
            this._adicionarLogInterno(`🏃 FUGA BEM-SUCEDIDA! Rolagem: ${rolagem.str} vs ${chanceFuga}%`, 'cura');
            this.fim = true;
            this.turno = 'fim';
            this.atualizarInterface();
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
        } else {
            this._adicionarLogInterno(`❌ Falhou ao tentar fugir! Rolagem: ${rolagem.str} vs ${chanceFuga}%`, 'falha');
            this.turno = 'inimigo';
            this._timeout = setTimeout(() => this.turnoInimigo(), 1200);
            this.atualizarInterface();
        }
        
        return true;
    }
    
    turnoInimigo() {
        if (this.fim || this.turno !== 'inimigo') return;
        
        this._timeout = null;
        this.rodada++;
        
        this._adicionarLogInterno(`--- Rodada ${this.rodada} ---`, 'normal');
        this._adicionarLogInterno(`👹 Turno de ${this.inimigo.nome}`, 'normal');
        
        const acao = Math.random() < this.inimigo.agressividade ? 'atacar' : 'defender';
        
        if (acao === 'atacar') {
            const dano = rolarDados(this.inimigo.danoFormula || "1d6");
            
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
            
            if (this.bonusDefesa) {
                defesaBase += this.bonusDefesa;
                this.bonusDefesa = 0;
            }
            
            if (this.esquivando) {
                defesaBase += 30;
                this.esquivando = false;
            }
            
            const periciaInimigo = this.inimigo.pericias?.briga ? 'briga' : 'espada';
            const nivelPericia = this.inimigo.pericias?.[periciaInimigo] || 0;
            const nhInimigo = 40 + (nivelPericia * 4);
            
            const rolagem = rolar2d10();
            const chanceAcerto = Math.max(10, nhInimigo - Math.floor(defesaBase / 2));
            
            if (rolagem.resultado <= chanceAcerto || rolagem.critico) {
                const rd = calcularRDTotal(this.personagem);
                let danoFinal = Math.max(1, dano - rd);
                
                if (rolagem.critico) {
                    danoFinal *= 2;
                }
                
                this.personagem.statusCombate.vidaAtual -= danoFinal;
                if (this.personagem.statusCombate.vidaAtual < 0) {
                    this.personagem.statusCombate.vidaAtual = 0;
                }
                
                let criticoStr = rolagem.critico ? ' (CRÍTICO!)' : '';
                this._adicionarLogInterno(`🎯 ${this.inimigo.nome} ACERTOU${criticoStr}! Dano: ${danoFinal} (${dano} - ${rd} RD) | Defesa: ${tipoDefesa} (${defesaBase}%)`, 'dano');
                
                if (this.personagem.statusCombate.vidaAtual <= 0) {
                    this._adicionarLogInterno(`💀 ${this.personagem.nome} foi DERROTADO!`, 'falha');
                    this.fim = true;
                    this.turno = 'fim';
                    this.atualizarInterface();
                    
                    if (this.callbacks.onDerrota) {
                        this.callbacks.onDerrota();
                    }
                    return;
                }
            } else {
                this._adicionarLogInterno(`❌ ${this.inimigo.nome} ERROU! Rolagem: ${rolagem.str} vs ${chanceAcerto}% | Defesa: ${tipoDefesa} (${defesaBase}%)`, 'cura');
            }
        } else {
            this._adicionarLogInterno(`🛡️ ${this.inimigo.nome} assume posição defensiva!`, 'defesa');
            this.inimigo.bonusDefesa = 15;
        }
        
        this.atualizarInterface();
        
        if (!this.fim) {
            this.turno = 'jogador';
            this._adicionarLogInterno(`✨ Seu turno!`, 'critico');
        }
    }
    
    getEstado() {
        return {
            turno: this.turno,
            rodada: this.rodada,
            fim: this.fim,
            inimigo: {
                nome: this.inimigo.nome,
                vida: this.inimigo.vida,
                vidaMax: this.inimigo.vidaMax,
                descricao: this.inimigo.descricao
            },
            personagem: {
                vida: this.personagem.statusCombate?.vidaAtual || 0,
                vidaMax: this.calcularVidaMax(),
                mana: this.personagem.statusCombate?.manaAtual || 0,
                manaMax: this.calcularManaMax(),
                fadiga: this.personagem.statusCombate?.fadigaAtual || 0,
                fadigaMax: this.calcularFadigaMax()
            },
            log: this.log
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
    console.log('📌 INIMIGOS disponíveis:', Object.keys(INIMIGOS));
}

// Exportar para Node.js
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