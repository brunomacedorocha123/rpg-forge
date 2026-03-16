// ============================================
// SISTEMA DE COMBATE AKALANATA - VERSÃO FIRESTORE
// CORRIGIDO - SEM DUPLICAÇÃO DE LOGS
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
    }
    
    return Math.min(95, Math.max(5, nh));
}

// ===== CALCULAR DEFESAS =====
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

// ===== CALCULAR DANO =====
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

// ============================================
// CLASSE DE COMBATE COM FIRESTORE - SEM DUPLICAÇÃO
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
            fim: false,
            aguardandoDefesa: false
        };
        this.ultimoAtaque = null;
        this.log = [];
        
        // Flag para evitar loop de atualização
        this._atualizandoDoSnapshot = false;
        this._ultimaMensagem = null; // Para evitar duplicação
        
        this.iniciar();
    }
    
    async iniciar() {
        try {
            console.log('⚔️ Iniciando combate Firestore:', this.inimigoId);
            
            // 1. Buscar inimigo do catálogo
            const inimigoBase = INIMIGOS[this.inimigoId] || INIMIGOS.saqueador_faminto;
            
            // 2. Garantir statusCombate no personagem
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
            
            // 3. CRIAR SESSÃO SE NÃO EXISTIR
            const sessaoRef = db.collection('sessoes_aventura_solo').doc(this.sessaoId);
            
            try {
                const sessaoDoc = await sessaoRef.get();
                
                if (!sessaoDoc.exists) {
                    await sessaoRef.set({
                        userId: this.userId,
                        personagemId: this.personagemId,
                        personagemNome: this.personagem.nome || 'Aventureiro',
                        aventuraId: 'grito_estrada',
                        status: 'em_andamento',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    console.log('✅ Sessão criada:', this.sessaoId);
                }
            } catch (e) {
                console.log('⚠️ Erro ao verificar/criar sessão, mas continuando...', e);
            }
            
            // 4. Criar objeto do inimigo
            this.inimigo = {
                ...inimigoBase,
                vidaAtual: inimigoBase.vidaMax
            };
            
            // 5. Log inicial
            this.log = [{
                mensagem: '⚔️ COMBATE INICIADO!',
                tipo: 'normal',
                timestamp: new Date().toISOString()
            }];
            
            // 6. Criar documento de combate na subcoleção
            const combateData = {
                sessaoId: this.sessaoId,
                personagemId: this.personagemId,
                personagemNome: this.personagem.nome || 'Aventureiro',
                userId: this.userId,
                inimigoId: this.inimigoId,
                inimigo: this.inimigo,
                status: this.status,
                log: this.log,
                ultimoAtaque: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            try {
                const combateRef = await sessaoRef.collection('combates').add(combateData);
                this.combateId = combateRef.id;
                console.log('✅ Combate criado ID:', this.combateId);
                
                // 7. Atualizar personagem no Firestore
                try {
                    await db.collection('personagens').doc(this.personagemId).update({
                        statusCombate: this.personagem.statusCombate,
                        combateAtivo: {
                            sessaoId: this.sessaoId,
                            combateId: this.combateId
                        }
                    });
                } catch (e) {
                    console.log('⚠️ Não foi possível atualizar personagem:', e);
                }
                
                // 8. Inscrever para atualizações em tempo real
                this.unsubscribe = combateRef.onSnapshot((doc) => {
                    if (doc.exists && !this._atualizandoDoSnapshot) {
                        this._atualizandoDoSnapshot = true;
                        const data = doc.data();
                        
                        // Atualizar apenas se mudou
                        if (JSON.stringify(this.inimigo) !== JSON.stringify(data.inimigo)) {
                            this.inimigo = data.inimigo;
                        }
                        if (JSON.stringify(this.status) !== JSON.stringify(data.status)) {
                            this.status = data.status;
                        }
                        this.ultimoAtaque = data.ultimoAtaque;
                        
                        // Para logs, não atualizar o array local para evitar duplicação
                        // this.log = data.log;
                        
                        this._notificarUI();
                        this._atualizandoDoSnapshot = false;
                    }
                });
                
            } catch (e) {
                console.log('⚠️ Erro ao criar combate na subcoleção, usando modo local:', e);
            }
            
            // 9. Notificar UI (chamar apenas UMA VEZ)
            this._log('⚔️ COMBATE INICIADO!', true); // true = não repetir
            this._log(`${this.personagem.nome || 'Herói'} vs ${this.inimigo.nome}`, true);
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
            
        } catch (error) {
            console.error('❌ Erro ao iniciar combate:', error);
            if (this.callbacks.onErro) {
                this.callbacks.onErro(error.message);
            }
        }
    }
    
    async _atualizarFirestore(updates) {
        if (!this.combateId) return;
        
        try {
            this._atualizandoDoSnapshot = true;
            
            const combateRef = db.collection('sessoes_aventura_solo').doc(this.sessaoId)
                .collection('combates').doc(this.combateId);
            
            await combateRef.update({
                ...updates,
                updatedAt: new Date().toISOString()
            });
            
            // Pequeno delay para evitar loop
            setTimeout(() => {
                this._atualizandoDoSnapshot = false;
            }, 100);
            
        } catch (error) {
            console.error('Erro ao atualizar Firestore:', error);
            this._atualizandoDoSnapshot = false;
        }
    }
    
    _notificarUI() {
        if (this.callbacks.onAtualizar) {
            this.callbacks.onAtualizar({
                turno: this.status.turno,
                rodada: this.status.rodada,
                fim: this.status.fim,
                aguardandoDefesa: this.status.aguardandoDefesa,
                inimigoVida: this.inimigo?.vidaAtual || 0,
                inimigoVidaMax: this.inimigo?.vidaMax || 0,
                personagemVida: this.personagem.statusCombate.vidaAtual,
                personagemVidaMax: this.personagem.statusCombate.vidaMax,
                personagemMana: this.personagem.statusCombate.manaAtual || 0,
                personagemFadiga: this.personagem.statusCombate.fadigaAtual || 0,
                inimigo: this.inimigo
            });
        }
    }
    
    _log(mensagem, tipo = 'normal', forcarUI = false) {
        // 🔥 EVITAR DUPLICAÇÃO: verificar se a mensagem já foi logada recentemente
        const chave = mensagem + tipo;
        if (this._ultimaMensagem === chave && !forcarUI) {
            console.log('🔄 Mensagem duplicada ignorada:', mensagem);
            return;
        }
        
        this._ultimaMensagem = chave;
        console.log(`[COMBATE] ${mensagem}`);
        
        // Adicionar ao log local
        const entry = {
            mensagem: mensagem,
            tipo: tipo,
            timestamp: new Date().toISOString()
        };
        
        this.log.push(entry);
        
        // Salvar no Firestore (apenas se tiver ID e NÃO estiver vindo de snapshot)
        if (this.combateId && !this._atualizandoDoSnapshot) {
            this._atualizarFirestore({
                log: this.log
            });
        }
        
        // Callback para UI (apenas uma vez)
        if (this.callbacks.onLog) {
            this.callbacks.onLog(mensagem, tipo);
        }
        
        // Limpar última mensagem após 100ms
        setTimeout(() => {
            if (this._ultimaMensagem === chave) {
                this._ultimaMensagem = null;
            }
        }, 100);
    }
    
    // ===== AÇÕES DO JOGADOR =====
    
    async atacar() {
        if (this.status.fim || this.status.turno !== 'jogador' || this.status.aguardandoDefesa) {
            return false;
        }
        
        this._log(`👉 ${this.personagem.nome || 'Herói'} ataca!`, 'normal', true);
        
        // CALCULAR ATAQUE
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
        
        let acertou = false;
        if (rolagemAtaque.critico) {
            acertou = true;
            this._log(`✨ ATAQUE FULMINANTE!`, 'critico', true);
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥 FALHA CRÍTICA NO ATAQUE!`, 'falha', true);
        } else {
            acertou = rolagemAtaque.resultado <= nhJogador;
        }
        
        this._log(`🎲 Rolagem: ${rolagemAtaque.str} vs NH ${nhJogador}% → ${acertou ? 'ACERTOU' : 'ERROU'}`, 'normal', true);
        
        if (acertou) {
            // DEFESA DO INIMIGO
            const defesaInimigo = this.inimigo.derivados?.esquiva || 5;
            const rolagemDefesa = combateRolar2d10();
            
            let defendeu = false;
            if (rolagemDefesa.critico) {
                defendeu = true;
                this._log(`✨ ${this.inimigo.nome} DEFENDEU!`, 'critico', true);
            } else if (rolagemDefesa.falhaCritica) {
                defendeu = false;
                this._log(`💥 ${this.inimigo.nome} FALHOU!`, 'falha', true);
            } else {
                defendeu = rolagemDefesa.resultado <= defesaInimigo;
            }
            
            this._log(`🛡️ Defesa: ${rolagemDefesa.str} vs ${defesaInimigo}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
            
            if (!defendeu) {
                // CAUSAR DANO
                const dano = combateCalcularDanoPersonagem(this.personagem, arma);
                const rdInimigo = this.inimigo.armadura || 0;
                let danoFinal = Math.max(1, dano - rdInimigo);
                
                if (rolagemAtaque.critico) {
                    danoFinal *= 2;
                }
                
                const novaVida = Math.max(0, this.inimigo.vidaAtual - danoFinal);
                
                this._log(`💥 DANO: ${danoFinal} (${dano} - ${rdInimigo} RD)`, 'dano', true);
                
                // ATUALIZAR
                this.inimigo.vidaAtual = novaVida;
                
                if (this.combateId && !this._atualizandoDoSnapshot) {
                    await this._atualizarFirestore({
                        'inimigo.vidaAtual': novaVida
                    });
                }
                
                // VERIFICAR MORTE
                if (novaVida <= 0) {
                    this._log(`💀 ${this.inimigo.nome} foi DERROTADO!`, 'critico', true);
                    
                    this.status.fim = true;
                    this.status.turno = 'fim';
                    
                    if (this.combateId && !this._atualizandoDoSnapshot) {
                        await this._atualizarFirestore({
                            'status.fim': true,
                            'status.turno': 'fim'
                        });
                    }
                    
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
        
        // PASSAR TURNO
        this.status.turno = 'inimigo';
        this.status.rodada = this.status.rodada + 1;
        
        if (this.combateId && !this._atualizandoDoSnapshot) {
            await this._atualizarFirestore({
                'status.turno': 'inimigo',
                'status.rodada': this.status.rodada
            });
        }
        
        this._notificarUI();
        
        // TURNO DO INIMIGO (delay)
        setTimeout(() => this._turnoInimigo(), 1000);
        
        return true;
    }
    
    async _turnoInimigo() {
        if (this.status.fim || this.status.turno !== 'inimigo') return;
        
        this._log(`👹 Turno de ${this.inimigo.nome}`, 'normal', true);
        
        // ATACAR
        const nhInimigo = combateCalcularNHInimigo(this.inimigo);
        const rolagemAtaque = combateRolar2d10();
        
        let acertou = false;
        if (rolagemAtaque.critico) {
            acertou = true;
            this._log(`✨ ATAQUE FULMINANTE DO INIMIGO!`, 'critico', true);
        } else if (rolagemAtaque.falhaCritica) {
            acertou = false;
            this._log(`💥 FALHA CRÍTICA DO INIMIGO!`, 'falha', true);
        } else {
            acertou = rolagemAtaque.resultado <= nhInimigo;
        }
        
        this._log(`🎲 ${this.inimigo.nome} ataca: ${rolagemAtaque.str} vs NH ${nhInimigo}% → ${acertou ? 'ACERTOU' : 'ERROU'}`, 'normal', true);
        
        if (acertou) {
            // SALVAR ATAQUE PARA DEFESA
            this.ultimoAtaque = {
                danoFormula: this.inimigo.danoFormula || "1d6",
                rolagem: rolagemAtaque,
                nh: nhInimigo
            };
            
            this.status.aguardandoDefesa = true;
            
            if (this.combateId && !this._atualizandoDoSnapshot) {
                await this._atualizarFirestore({
                    'status.aguardandoDefesa': true,
                    ultimoAtaque: this.ultimoAtaque
                });
            }
            
            this._log(`🛡️ ESCOLHA SUA DEFESA!`, 'normal', true);
            this._notificarUI();
        } else {
            // VOLTAR TURNO DO JOGADOR
            this.status.turno = 'jogador';
            
            if (this.combateId && !this._atualizandoDoSnapshot) {
                await this._atualizarFirestore({
                    'status.turno': 'jogador'
                });
            }
            
            this._log(`✨ SEU TURNO!`, 'critico', true);
            this._notificarUI();
        }
    }
    
    // ===== DEFESAS =====
    
    async defenderComEsquiva() {
        await this._processarDefesa('Esquiva', combateCalcularEsquiva(this.personagem));
    }
    
    async defenderComAparar() {
        await this._processarDefesa('Aparar', combateCalcularAparar(this.personagem));
    }
    
    async defenderComBloqueio() {
        await this._processarDefesa('Bloqueio', combateCalcularBloqueio(this.personagem));
    }
    
    async _processarDefesa(tipoDefesa, defesaBase) {
        if (!this.status.aguardandoDefesa || !this.ultimoAtaque) return;
        
        const ataque = this.ultimoAtaque;
        const rolagemDefesa = combateRolar2d10();
        
        let defendeu = false;
        if (rolagemDefesa.critico) {
            defendeu = true;
            this._log(`✨ DEFESA FULMINANTE! (${tipoDefesa})`, 'critico', true);
        } else if (rolagemDefesa.falhaCritica) {
            defendeu = false;
            this._log(`💥 FALHA CRÍTICA NA DEFESA! (${tipoDefesa})`, 'falha', true);
        } else {
            defendeu = rolagemDefesa.resultado <= defesaBase;
        }
        
        this._log(`🛡️ ${tipoDefesa}: ${rolagemDefesa.str} vs ${defesaBase}% → ${defendeu ? 'DEFENDEU' : 'FALHOU'}`, 'normal', true);
        
        if (!defendeu) {
            // TOMAR DANO
            const dano = combateRolarDados(ataque.danoFormula);
            const rd = combateCalcularRDTotal(this.personagem);
            let danoFinal = Math.max(1, dano - rd);
            
            if (ataque.rolagem?.critico) {
                danoFinal *= 2;
            }
            
            // ATUALIZAR VIDA
            const vidaAntes = this.personagem.statusCombate.vidaAtual;
            this.personagem.statusCombate.vidaAtual = Math.max(0, vidaAntes - danoFinal);
            
            this._log(`💥 DANO RECEBIDO: ${danoFinal} (${dano} - ${rd} RD)`, 'dano', true);
            
            // 🔥 ATUALIZAR FIRESTORE (PERSONAGEM)
            try {
                await db.collection('personagens').doc(this.personagemId).update({
                    'statusCombate.vidaAtual': this.personagem.statusCombate.vidaAtual
                });
            } catch (e) {
                console.log('⚠️ Erro ao atualizar personagem:', e);
            }
            
            // 🔥 ATUALIZAR UI GLOBAL
            if (typeof window.atualizarPVNaUI === 'function') {
                window.atualizarPVNaUI();
            }
            
            // VERIFICAR MORTE
            if (this.personagem.statusCombate.vidaAtual <= 0) {
                this._log(`💀 ${this.personagem.nome || 'Herói'} foi DERROTADO!`, 'falha', true);
                
                this.status.fim = true;
                this.status.turno = 'fim';
                this.status.aguardandoDefesa = false;
                
                if (this.combateId && !this._atualizandoDoSnapshot) {
                    await this._atualizarFirestore({
                        'status.fim': true,
                        'status.turno': 'fim',
                        'status.aguardandoDefesa': false
                    });
                }
                
                if (this.callbacks.onDerrota) {
                    this.callbacks.onDerrota();
                }
                
                this._notificarUI();
                return;
            }
        }
        
        // LIMPAR ESTADO E VOLTAR TURNO DO JOGADOR
        this.status.aguardandoDefesa = false;
        this.status.turno = 'jogador';
        this.ultimoAtaque = null;
        
        if (this.combateId && !this._atualizandoDoSnapshot) {
            await this._atualizarFirestore({
                'status.aguardandoDefesa': false,
                'status.turno': 'jogador',
                ultimoAtaque: null
            });
        }
        
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
            
            if (this.combateId && !this._atualizandoDoSnapshot) {
                await this._atualizarFirestore({
                    'status.fim': true,
                    'status.turno': 'fim'
                });
            }
            
            if (this.callbacks.onFuga) {
                this.callbacks.onFuga();
            }
            
            this._notificarUI();
        } else {
            this._log(`❌ Falhou ao tentar fugir!`, 'falha', true);
            
            this.status.turno = 'inimigo';
            
            if (this.combateId && !this._atualizandoDoSnapshot) {
                await this._atualizarFirestore({
                    'status.turno': 'inimigo'
                });
            }
            
            this._notificarUI();
            setTimeout(() => this._turnoInimigo(), 1000);
        }
        
        return true;
    }
    
    // ===== LIMPEZA =====
    
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
    
    console.log('✅ Sistema de Combate FIRESTORE carregado!');
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INIMIGOS, CombateFirestore };
}