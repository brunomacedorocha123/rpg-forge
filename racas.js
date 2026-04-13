// ============================================
// SISTEMA DE RAÇAS - RPGFORCE
// ARQUIVO: racas.js
// ============================================

// ============================================
// DADOS DA RAÇA ANÃO
// ============================================

const racasDisponiveis = {
    anao: {
        id: 'anao',
        nome: 'Anão',
        icone: 'fa-dwarf',
        iconeGrande: 'fa-dwarf',
        
        // Custo em pontos de atributo (4 pontos)
        custoPontos: 4,
        
        // Modificadores de atributos (SOMENTE BÔNUS)
        modificadoresAtributos: {
            st: 3,      // ST +3
            vt: 1,      // VT +1
            vigor: 1    // VIGOR +1
        },
        
        // Vantagem automática
        vantagemAutomatica: 'corpoResistente',
        
        // Desvantagens automáticas
        desvantagensAutomaticas: ['nanismo', 'avareza'],
        
        // Modificadores de carga (multiplicadores)
        modificadorCarga: {
            leve: 2.5,
            medio: 5.0,
            pesado: 9.0,
            limite: 13.0
        },
        
        // Modificadores de deslocamento
        modificadorDeslocamento: {
            andar: -1,           // perde 1 metro no deslocamento de andar
            correrPercentual: -25 // perde 25% no deslocamento de correr
        },
        
        // Bônus e redutores de perícias
        bonusPericias: {
            'armasHaste': 3,     // +3% Arma de Haste
            'armaria': 2,        // +2% Armaria
            'arco': -2,          // -2% Arco
            'arremesso': -2,     // -2% Arremesso
            'funda': -2          // -2% Funda (vou adicionar se não existir)
        },
        
        // Descrição curta
        descricao: 'Anões são conhecidos por sua robustez, força e resistência incomparáveis.',
        
        // Descrição completa para o modal
        descricaoCompleta: `
            <h4><i class="fas fa-fist-raised"></i> Características dos Anões</h4>
            <p>Anões são uma raça estoica e resistente, conhecida por sua força física e tenacidade inabalável. Esculpindo suas grandes cidades no coração das montanhas, eles são artesãos incomparáveis e guerreiros formidáveis.</p>
            
            <h4><i class="fas fa-coins"></i> Custo</h4>
            <p><strong>4 pontos de atributo</strong> para escolher esta raça.</p>
            
            <h4><i class="fas fa-chart-line"></i> Modificadores de Atributos</h4>
            <ul>
                <li><strong>ST (Força):</strong> +3</li>
                <li><strong>VT (Vitalidade):</strong> +1</li>
                <li><strong>VIGOR:</strong> +1</li>
            </ul>
            
            <h4><i class="fas fa-star"></i> Vantagem Automática</h4>
            <ul>
                <li><strong>Corpo Resistente:</strong> RD +2, +10% resistência a venenos e toxinas</li>
            </ul>
            
            <h4><i class="fas fa-skull"></i> Desvantagens Automáticas</h4>
            <ul>
                <li><strong>Nanismo:</strong> Estatura baixa (-1 deslocamento, -5% em ataques contra inimigos com mais de 2m, +10% Furtividade)</li>
                <li><strong>Avareza:</strong> Mesquinho, ama dinheiro acima de tudo</li>
            </ul>
            
            <h4><i class="fas fa-weight-hanging"></i> Capacidade de Carga</h4>
            <ul>
                <li><strong>Carga Leve:</strong> ST × 2.5</li>
                <li><strong>Carga Média:</strong> ST × 5.0</li>
                <li><strong>Carga Pesada:</strong> ST × 9.0</li>
                <li><strong>Carga Limite:</strong> ST × 13.0</li>
            </ul>
            
            <h4><i class="fas fa-shoe-prints"></i> Deslocamento</h4>
            <ul>
                <li><strong>Andar:</strong> -1 metro</li>
                <li><strong>Correr:</strong> -25% (arredondado para baixo)</li>
            </ul>
            
            <h4><i class="fas fa-brain"></i> Bônus de Perícias</h4>
            <ul>
                <li><strong>Arma de Haste:</strong> +3%</li>
                <li><strong>Armaria:</strong> +2%</li>
            </ul>
            
            <h4><i class="fas fa-ban"></i> Redutores de Perícias</h4>
            <ul>
                <li><strong>Arco:</strong> -2%</li>
                <li><strong>Arremesso:</strong> -2%</li>
                <li><strong>Funda:</strong> -2%</li>
            </ul>
        `
    }
};

// ============================================
// VARIÁVEIS GLOBAIS DO SISTEMA DE RAÇAS
// ============================================

let racaSelecionadaPreview = null;  // Raça temporária no modal
let racaAtual = null;               // Raça já confirmada no personagem

// ============================================
// FUNÇÕES PARA VERIFICAR PONTOS SUFICIENTES
// ============================================

// Verifica se o jogador tem pontos suficientes para comprar a raça
function temPontosSuficientesParaRaca(racaId, saldoPontosAtual) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return false;
    return saldoPontosAtual >= raca.custoPontos;
}

// Obtém o custo em pontos de uma raça
function getCustoPontosRaca(racaId) {
    const raca = racasDisponiveis[racaId];
    return raca ? raca.custoPontos : 0;
}

// ============================================
// FUNÇÃO PRINCIPAL: APLICAR RAÇA AO PERSONAGEM
// ============================================

function aplicarRacaAoPersonagem(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return false;
    
    // Verifica se tem pontos suficientes (usando a variável global saldoPontos)
    if (typeof saldoPontos !== 'undefined' && !temPontosSuficientesParaRaca(racaId, saldoPontos)) {
        alert(`Pontos insuficientes! Você precisa de ${raca.custoPontos} pontos para escolher a raça ${raca.nome}.`);
        return false;
    }
    
    // ===== 1. REMOVE OS EFEITOS DA RAÇA ANTERIOR =====
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const racaAntiga = racasDisponiveis[racaAtual];
        
        // Remove modificadores de atributos
        if (racaAntiga.modificadoresAtributos) {
            for (const [attr, valor] of Object.entries(racaAntiga.modificadoresAtributos)) {
                if (typeof atributos !== 'undefined' && atributos[attr]) {
                    atributos[attr].valor = Math.min(15, Math.max(1, atributos[attr].valor - valor));
                }
            }
        }
        
        // Remove vantagem automática
        if (racaAntiga.vantagemAutomatica && typeof vantagensSelecionadas !== 'undefined') {
            vantagensSelecionadas.delete(racaAntiga.vantagemAutomatica);
        }
        
        // Remove desvantagens automáticas
        if (racaAntiga.desvantagensAutomaticas && typeof desvantagensSelecionadas !== 'undefined') {
            for (const desv of racaAntiga.desvantagensAutomaticas) {
                desvantagensSelecionadas.delete(desv);
            }
        }
        
        // DEVOLVE os pontos gastos com a raça anterior
        if (typeof pontosIniciais !== 'undefined' && typeof saldoPontos !== 'undefined') {
            // pontosIniciais + custo da raça antiga
            // A lógica será feita na parte de pontos
        }
    }
    
    // ===== 2. APLICA OS EFEITOS DA NOVA RAÇA =====
    
    // Aplica modificadores de atributos
    if (raca.modificadoresAtributos && typeof atributos !== 'undefined') {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (atributos[attr]) {
                let novoValor = atributos[attr].valor + valor;
                // Limita entre 1 e 15
                novoValor = Math.min(15, Math.max(1, novoValor));
                atributos[attr].valor = novoValor;
            }
        }
    }
    
    // Adiciona vantagem automática
    if (raca.vantagemAutomatica && typeof vantagensSelecionadas !== 'undefined') {
        vantagensSelecionadas.add(raca.vantagemAutomatica);
    }
    
    // Adiciona desvantagens automáticas
    if (raca.desvantagensAutomaticas && typeof desvantagensSelecionadas !== 'undefined') {
        for (const desv of raca.desvantagensAutomaticas) {
            desvantagensSelecionadas.add(desv);
        }
    }
    
    // ===== 3. DESCONTA OS PONTOS DA RAÇA =====
    if (typeof pontosIniciais !== 'undefined' && typeof saldoPontos !== 'undefined') {
        // O desconto já é refletido no saldoPontos
        // A função de atualização vai recalcular
    }
    
    // ===== 4. GUARDA A RAÇA ATUAL =====
    racaAtual = racaId;
    
    // Salva bônus de perícias para uso nas funções
    if (raca.bonusPericias) {
        localStorage.setItem(`racaBonusPericias_${racaId}`, JSON.stringify(raca.bonusPericias));
    }
    
    // Salva modificador de carga
    if (raca.modificadorCarga) {
        localStorage.setItem(`racaModificadorCarga_${racaId}`, JSON.stringify(raca.modificadorCarga));
    }
    
    // Salva modificador de deslocamento
    if (raca.modificadorDeslocamento) {
        localStorage.setItem(`racaModificadorDeslocamento_${racaId}`, JSON.stringify(raca.modificadorDeslocamento));
    }
    
    // ===== 5. ATUALIZA A INTERFACE =====
    if (typeof atualizarInterface === 'function') {
        atualizarInterface();
    }
    
    if (typeof atualizarContadoresAbas === 'function') {
        atualizarContadoresAbas();
    }
    
    if (typeof atualizarLimitesCards === 'function') {
        atualizarLimitesCards();
    }
    
    if (typeof atualizarDisplayRaca === 'function') {
        atualizarDisplayRaca();
    }
    
    // Atualiza os cards de vantagens/desvantagens
    if (typeof document !== 'undefined') {
        document.querySelectorAll('.vantagem-card').forEach(card => {
            if (raca.vantagemAutomatica === card.dataset.vantagem) {
                card.classList.add('selecionada');
            }
        });
        
        document.querySelectorAll('.desvantagem-card').forEach(card => {
            if (raca.desvantagensAutomaticas?.includes(card.dataset.desvantagem)) {
                card.classList.add('selecionada');
            }
        });
    }
    
    // Re-renderiza perícias (para aplicar bônus)
    if (typeof renderizarPericiasAdquiridas === 'function') {
        renderizarPericiasAdquiridas();
    }
    
    if (typeof triggerAutoSave === 'function') {
        triggerAutoSave();
    }
    
    return true;
}

// ============================================
// FUNÇÃO PARA REMOVER RAÇA
// ============================================

function removerRacaDoPersonagem() {
    if (!racaAtual) return false;
    
    const raca = racasDisponiveis[racaAtual];
    if (!raca) return false;
    
    // Remove modificadores de atributos
    if (raca.modificadoresAtributos && typeof atributos !== 'undefined') {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (atributos[attr]) {
                let novoValor = atributos[attr].valor - valor;
                novoValor = Math.min(15, Math.max(1, novoValor));
                atributos[attr].valor = novoValor;
            }
        }
    }
    
    // Remove vantagem automática
    if (raca.vantagemAutomatica && typeof vantagensSelecionadas !== 'undefined') {
        vantagensSelecionadas.delete(raca.vantagemAutomatica);
    }
    
    // Remove desvantagens automáticas
    if (raca.desvantagensAutomaticas && typeof desvantagensSelecionadas !== 'undefined') {
        for (const desv of raca.desvantagensAutomaticas) {
            desvantagensSelecionadas.delete(desv);
        }
    }
    
    // Limpa os storages
    localStorage.removeItem('racaBonusPericias');
    localStorage.removeItem('racaModificadorCarga');
    localStorage.removeItem('racaModificadorDeslocamento');
    
    racaAtual = null;
    
    // Atualiza interface
    if (typeof atualizarInterface === 'function') atualizarInterface();
    if (typeof atualizarContadoresAbas === 'function') atualizarContadoresAbas();
    if (typeof atualizarLimitesCards === 'function') atualizarLimitesCards();
    if (typeof atualizarDisplayRaca === 'function') atualizarDisplayRaca();
    if (typeof renderizarPericiasAdquiridas === 'function') renderizarPericiasAdquiridas();
    if (typeof triggerAutoSave === 'function') triggerAutoSave();
    
    return true;
}

// ============================================
// FUNÇÕES PARA OBTER BÔNUS DA RAÇA
// ============================================

function getBonusPericiaRaca(periciaId) {
    if (!racaAtual) return 0;
    const raca = racasDisponiveis[racaAtual];
    if (raca && raca.bonusPericias && raca.bonusPericias[periciaId] !== undefined) {
        return raca.bonusPericias[periciaId];
    }
    return 0;
}

function getModificadorCargaDaRaca() {
    if (!racaAtual) return { leve: 2, medio: 4, pesado: 8, limite: 12 };
    const raca = racasDisponiveis[racaAtual];
    if (raca && raca.modificadorCarga) {
        return raca.modificadorCarga;
    }
    return { leve: 2, medio: 4, pesado: 8, limite: 12 };
}

function getModificadorDeslocamentoDaRaca() {
    if (!racaAtual) return { andar: 0, correrPercentual: 0 };
    const raca = racasDisponiveis[racaAtual];
    if (raca && raca.modificadorDeslocamento) {
        return raca.modificadorDeslocamento;
    }
    return { andar: 0, correrPercentual: 0 };
}

// ============================================
// FUNÇÕES DE UI - CARREGAR GRID E MODAIS
// ============================================

function carregarRacasNoGrid() {
    const grid = document.getElementById('racasGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const [id, raca] of Object.entries(racasDisponiveis)) {
        const card = document.createElement('div');
        card.className = 'raca-card-modal';
        card.dataset.racaId = id;
        card.dataset.racaNome = raca.nome;
        card.dataset.racaIcone = raca.iconeGrande || 'fa-dragon';
        card.dataset.racaDesc = raca.descricaoCompleta;
        card.dataset.custoPontos = raca.custoPontos;
        
        // Verifica se tem pontos suficientes
        let pontosSuficientes = true;
        if (typeof saldoPontos !== 'undefined') {
            pontosSuficientes = saldoPontos >= raca.custoPontos;
        }
        
        if (!pontosSuficientes) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.title = `Pontos insuficientes! Precisa de ${raca.custoPontos} pontos (você tem ${saldoPontos})`;
        }
        
        card.innerHTML = `
            <i class="fas ${raca.iconeGrande || 'fa-dragon'}"></i>
            <h3>${raca.nome}</h3>
            <p>${raca.descricao.substring(0, 80)}...</p>
            <div class="raca-mod-badge">Custo: ${raca.custoPontos} pontos</div>
        `;
        
        card.addEventListener('click', () => {
            // Verifica novamente se tem pontos suficientes
            if (typeof saldoPontos !== 'undefined' && saldoPontos < raca.custoPontos) {
                alert(`Pontos insuficientes! Você precisa de ${raca.custoPontos} pontos para escolher ${raca.nome}.`);
                return;
            }
            
            // Remove seleção anterior
            document.querySelectorAll('.raca-card-modal').forEach(c => {
                c.classList.remove('selecionada-preview');
            });
            card.classList.add('selecionada-preview');
            racaSelecionadaPreview = id;
            
            // Habilita botão confirmar
            const btnConfirmar = document.getElementById('confirmarRaca');
            if (btnConfirmar) btnConfirmar.disabled = false;
        });
        
        grid.appendChild(card);
    }
}

function abrirVisualizacaoRaca(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return;
    
    const modal = document.getElementById('modalVisualizarRaca');
    const titulo = document.getElementById('visualizarTitulo');
    const icone = document.getElementById('visualizarIcone');
    const descricao = document.getElementById('visualizarDescricao');
    
    if (titulo) titulo.textContent = raca.nome;
    if (icone) icone.className = `fas ${raca.iconeGrande || 'fa-dragon'}`;
    if (descricao) descricao.innerHTML = raca.descricaoCompleta;
    
    if (modal) modal.classList.add('active');
}

function fecharVisualizacaoRaca() {
    const modal = document.getElementById('modalVisualizarRaca');
    if (modal) modal.classList.remove('active');
}

function atualizarDisplayRaca() {
    const racaInfo = document.getElementById('racaSelecionadaInfo');
    const racaNomeDisplay = document.getElementById('racaNomeDisplay');
    const racaBonusDisplay = document.getElementById('racaBonusDisplay');
    
    if (!racaInfo) return;
    
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const raca = racasDisponiveis[racaAtual];
        racaNomeDisplay.textContent = raca.nome;
        
        let bonusText = `Custo: ${raca.custoPontos} pontos | `;
        if (raca.modificadoresAtributos) {
            const modificadores = [];
            if (raca.modificadoresAtributos.st) modificadores.push(`ST +${raca.modificadoresAtributos.st}`);
            if (raca.modificadoresAtributos.vt) modificadores.push(`VT +${raca.modificadoresAtributos.vt}`);
            if (raca.modificadoresAtributos.vigor) modificadores.push(`VIGOR +${raca.modificadoresAtributos.vigor}`);
            bonusText += modificadores.join(', ');
        }
        racaBonusDisplay.textContent = bonusText;
        racaInfo.style.display = 'flex';
    } else {
        racaInfo.style.display = 'none';
    }
}

// ============================================
// FUNÇÃO PARA ATUALIZAR CÁLCULO DE CARGA
// (DEVE SER CHAMADA PARA SOBRESCREVER A FUNÇÃO ORIGINAL)
// ============================================

function substituirFuncaoCalcularLimitesCarga() {
    if (typeof window.calcularLimitesCargaOriginal === 'undefined' && typeof calcularLimitesCarga === 'function') {
        window.calcularLimitesCargaOriginal = calcularLimitesCarga;
    }
    
    window.calcularLimitesCarga = function() {
        const st = typeof getSTFixo === 'function' ? getSTFixo() : 5;
        const modificador = getModificadorCargaDaRaca();
        return {
            leve: st * modificador.leve,
            medio: st * modificador.medio,
            pesado: st * modificador.pesado,
            limite: st * modificador.limite
        };
    };
}

function substituirFuncaoCalcularDeslocamento() {
    if (typeof window.calcularDeslocamentoOriginal === 'undefined' && typeof calcularDeslocamento === 'function') {
        window.calcularDeslocamentoOriginal = calcularDeslocamento;
    }
    
    window.calcularDeslocamento = function() {
        const soma = (typeof getDXFixo === 'function' ? getDXFixo() : 5) + 
                     (typeof getVIGORFixo === 'function' ? getVIGORFixo() : 5);
        const modificador = getModificadorDeslocamentoDaRaca();
        
        let andarBruto = soma * 0.1;
        let correrBruto = soma * 0.3;
        
        // Aplica modificador de andar
        andarBruto += modificador.andar;
        
        // Aplica modificador percentual de correr (-25% no caso do anão)
        if (modificador.correrPercentual !== 0) {
            correrBruto = correrBruto * (1 + modificador.correrPercentual / 100);
        }
        
        // Arredondamento para baixo (floor) como especificado
        function arredondarDeslocamento(valor) {
            const parteInteira = Math.floor(valor);
            const parteDecimal = valor - parteInteira;
            if (parteDecimal < 0.5) {
                return parteInteira;
            } else {
                return parteInteira + 1;
            }
        }
        
        const andar = arredondarDeslocamento(andarBruto);
        const correr = arredondarDeslocamento(correrBruto);
        
        return { andar, correr };
    };
}

function substituirFuncaoGetBonusPericia() {
    if (typeof window.getBonusPericiaOriginal === 'undefined' && typeof getBonusPericia === 'function') {
        window.getBonusPericiaOriginal = getBonusPericia;
    }
    
    window.getBonusPericia = function(periciaId) {
        let bonus = 0;
        if (typeof window.getBonusPericiaOriginal === 'function') {
            bonus = window.getBonusPericiaOriginal(periciaId) || 0;
        }
        bonus += getBonusPericiaRaca(periciaId);
        return bonus;
    };
}

// ============================================
// INICIALIZAÇÃO DO SISTEMA DE RAÇAS
// ============================================

function inicializarSistemaRacas() {
    // Substitui as funções originais
    substituirFuncaoCalcularLimitesCarga();
    substituirFuncaoCalcularDeslocamento();
    substituirFuncaoGetBonusPericia();
    
    // Configura os eventos da UI
    const btnEscolherRaca = document.getElementById('btnEscolherRaca');
    const modalRacas = document.getElementById('modalRacas');
    const fecharModal = document.getElementById('fecharModalRacas');
    const cancelarRaca = document.getElementById('cancelarRaca');
    const confirmarRaca = document.getElementById('confirmarRaca');
    const btnRemoverRaca = document.getElementById('btnRemoverRaca');
    const voltarSelecao = document.getElementById('voltarSelecaoRacas');
    
    if (btnEscolherRaca) {
        btnEscolherRaca.addEventListener('click', () => {
            carregarRacasNoGrid();
            racaSelecionadaPreview = null;
            const btnConfirmar = document.getElementById('confirmarRaca');
            if (btnConfirmar) btnConfirmar.disabled = true;
            if (modalRacas) modalRacas.classList.add('active');
        });
    }
    
    if (fecharModal) {
        fecharModal.addEventListener('click', () => {
            if (modalRacas) modalRacas.classList.remove('active');
        });
    }
    
    if (cancelarRaca) {
        cancelarRaca.addEventListener('click', () => {
            if (modalRacas) modalRacas.classList.remove('active');
            racaSelecionadaPreview = null;
        });
    }
    
    if (confirmarRaca) {
        confirmarRaca.addEventListener('click', () => {
            if (racaSelecionadaPreview) {
                abrirVisualizacaoRaca(racaSelecionadaPreview);
            }
        });
    }
    
    if (voltarSelecao) {
        voltarSelecao.addEventListener('click', () => {
            if (racaSelecionadaPreview) {
                const sucesso = aplicarRacaAoPersonagem(racaSelecionadaPreview);
                if (sucesso) {
                    fecharVisualizacaoRaca();
                    if (modalRacas) modalRacas.classList.remove('active');
                    racaSelecionadaPreview = null;
                    
                    // Atualiza os botões dos atributos
                    if (typeof atualizarBotoesAtributo === 'function') {
                        ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(attr => {
                            atualizarBotoesAtributo(attr);
                        });
                    }
                    
                    // Atualiza o saldo de pontos
                    if (typeof atualizarSaldoPontos === 'function') {
                        atualizarSaldoPontos();
                    }
                    
                    if (typeof atualizarDisplayGastos === 'function') {
                        atualizarDisplayGastos();
                    }
                }
            }
        });
    }
    
    if (btnRemoverRaca) {
        btnRemoverRaca.addEventListener('click', () => {
            if (confirm('Deseja remover a raça do personagem? Todas as vantagens, desvantagens e bônus serão removidos.')) {
                removerRacaDoPersonagem();
                
                // Atualiza os botões dos atributos
                if (typeof atualizarBotoesAtributo === 'function') {
                    ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(attr => {
                        atualizarBotoesAtributo(attr);
                    });
                }
                
                // Atualiza o saldo de pontos
                if (typeof atualizarSaldoPontos === 'function') {
                    atualizarSaldoPontos();
                }
                
                if (typeof atualizarDisplayGastos === 'function') {
                    atualizarDisplayGastos();
                }
            }
        });
    }
    
    // Exibe a raça atual se houver
    atualizarDisplayRaca();
}

// ============================================
// EXPORTA AS FUNÇÕES PARA USO GLOBAL
// ============================================

if (typeof window !== 'undefined') {
    window.racasDisponiveis = racasDisponiveis;
    window.racaAtual = racaAtual;
    window.racaSelecionadaPreview = racaSelecionadaPreview;
    window.temPontosSuficientesParaRaca = temPontosSuficientesParaRaca;
    window.getCustoPontosRaca = getCustoPontosRaca;
    window.aplicarRacaAoPersonagem = aplicarRacaAoPersonagem;
    window.removerRacaDoPersonagem = removerRacaDoPersonagem;
    window.getBonusPericiaRaca = getBonusPericiaRaca;
    window.getModificadorCargaDaRaca = getModificadorCargaDaRaca;
    window.getModificadorDeslocamentoDaRaca = getModificadorDeslocamentoDaRaca;
    window.carregarRacasNoGrid = carregarRacasNoGrid;
    window.abrirVisualizacaoRaca = abrirVisualizacaoRaca;
    window.fecharVisualizacaoRaca = fecharVisualizacaoRaca;
    window.atualizarDisplayRaca = atualizarDisplayRaca;
    window.inicializarSistemaRacas = inicializarSistemaRacas;
}

// Executa a inicialização quando o DOM estiver pronto
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistemaRacas);
    } else {
        inicializarSistemaRacas();
    }
}