// pontos-manager.js - VERSÃO CORRIGIDA ESPECÍFICA
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        this.cache = {
            riqueza: 0,
            aparencia: 0,
            caracteristicasFisicas: 0,
            idiomas: 0,
            statusSocial: 0,
            atributosComplementares: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupInputs();
        this.setupEventListeners();
        this.setupObservers();
        
        setTimeout(() => {
            this.recalcularTudo();
            this.updateAllDisplays();
        }, 500);
    }
    
    setupInputs() {
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.updateAllDisplays();
            });
        }
        
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) {
            inputGanhos.value = this.pontosGanhosCampanha;
            inputGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.updateAllDisplays();
            });
        }
    }
    
    setupEventListeners() {
        // Atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.updateAllDisplays();
            }
        });
        
        // RIQUEZA - CORRIGIDO
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            // Capturar valor inicial
            setTimeout(() => {
                const valorInicial = parseInt(selectRiqueza.value) || 0;
                this.processRiqueza(valorInicial);
            }, 300);
            
            // Mudanças futuras
            selectRiqueza.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.processRiqueza(valor);
            });
        }
        
        // APARÊNCIA
        const selectAparencia = document.getElementById('nivelAparencia');
        if (selectAparencia) {
            selectAparencia.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.processAparencia(valor);
            });
        }
        
        // PECULIARIDADES
        const btnAdicionarPec = document.getElementById('pec-adicionar-btn');
        if (btnAdicionarPec) {
            btnAdicionarPec.addEventListener('click', () => {
                setTimeout(() => this.recalcularPeculiaridades(), 200);
            });
        }
        
        // CARACTERÍSTICAS FÍSICAS - Configurar botões do modal
        this.setupCaracteristicasFisicas();
    }
    
    setupObservers() {
        // Observar peculiaridades
        const listaPec = document.getElementById('pec-lista');
        if (listaPec) {
            const observer = new MutationObserver(() => {
                this.recalcularPeculiaridades();
            });
            observer.observe(listaPec, { childList: true });
        }
    }
    
    setupCaracteristicasFisicas() {
        // Configurar botões do modal de características físicas
        const customizeBtn = document.getElementById('customizeBtn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.configurarModalCaracteristicas();
                }, 500);
            });
        }
        
        // Verificar periodicamente
        setInterval(() => {
            this.recalcularCaracteristicasFisicas();
        }, 1500);
    }
    
    configurarModalCaracteristicas() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        // Configurar botões de características
        modal.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.type;
                const btn = e.currentTarget;
                
                // Alternar ativo
                btn.classList.toggle('active');
                
                // Atualizar estilo visual
                if (btn.classList.contains('active')) {
                    btn.style.backgroundColor = '#3498db';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#2980b9';
                } else {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }
                
                // Recalcular pontos
                setTimeout(() => {
                    this.recalcularCaracteristicasFisicas();
                }, 100);
            });
        });
        
        // Configurar botão aplicar do modal
        const applyBtn = modal.querySelector('#applyBtn');
        if (applyBtn) {
            const originalClick = applyBtn.onclick;
            applyBtn.onclick = (e) => {
                if (originalClick) originalClick(e);
                setTimeout(() => {
                    this.recalcularCaracteristicasFisicas();
                }, 200);
            };
        }
    }
    
    // ============ PROCESSAMENTO ESPECÍFICO ============
    
    processRiqueza(valor) {
        console.log('🔄 Processando riqueza:', valor, 'Cache anterior:', this.cache.riqueza);
        
        // REMOVER VALOR ANTERIOR
        const valorAnterior = this.cache.riqueza || 0;
        
        if (valorAnterior > 0) {
            // Era vantagem - remover dos gastos vantagens
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(valorAnterior));
            console.log('➖ Removendo vantagem anterior:', valorAnterior, 'Vantagens agora:', this.gastos.vantagens);
        } else if (valorAnterior < 0) {
            // Era desvantagem - remover dos gastos desvantagens
            this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(valorAnterior));
            console.log('➖ Removendo desvantagem anterior:', Math.abs(valorAnterior), 'Desvantagens agora:', this.gastos.desvantagens);
        }
        
        // ADICIONAR NOVO VALOR
        if (valor > 0) {
            // Nova vantagem
            this.gastos.vantagens += valor;
            console.log('➕ Adicionando vantagem:', valor, 'Vantagens agora:', this.gastos.vantagens);
        } else if (valor < 0) {
            // Nova desvantagem
            this.gastos.desvantagens += Math.abs(valor);
            console.log('➕ Adicionando desvantagem:', Math.abs(valor), 'Desvantagens agora:', this.gastos.desvantagens);
        }
        
        // Atualizar cache
        this.cache.riqueza = valor;
        console.log('💰 Cache riqueza atualizado para:', this.cache.riqueza);
        
        this.updateAllDisplays();
    }
    
    processAparencia(valor) {
        const valorAnterior = this.cache.aparencia || 0;
        
        // Remover valor anterior
        if (valorAnterior > 0) {
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(valorAnterior));
        } else if (valorAnterior < 0) {
            this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(valorAnterior));
        }
        
        // Adicionar novo valor
        if (valor > 0) {
            this.gastos.vantagens += valor;
        } else if (valor < 0) {
            this.gastos.desvantagens += Math.abs(valor);
        }
        
        this.cache.aparencia = valor;
        this.updateAllDisplays();
    }
    
    recalcularCaracteristicasFisicas() {
        let pontos = 0;
        
        // Verificar características selecionadas no modal
        const modal = document.getElementById('alturaPesoModal');
        if (modal) {
            const botoesAtivos = modal.querySelectorAll('.feature-btn.active');
            botoesAtivos.forEach(btn => {
                const tipo = btn.dataset.type;
                const custo = this.getCustoCaracteristica(tipo);
                pontos += custo;
                console.log(`📝 Característica "${tipo}": ${custo} pontos`);
            });
        }
        
        // Verificar se o modal está aberto (para não recalcular baseado em estado antigo)
        if (modal && modal.style.display !== 'block') {
            // Verificar características salvas
            const caracteristicasSalvas = this.obterCaracteristicasSalvas();
            if (caracteristicasSalvas.length > 0) {
                pontos = caracteristicasSalvas.reduce((total, carac) => total + carac.pontos, 0);
                console.log('💾 Usando características salvas:', caracteristicasSalvas, 'Total:', pontos);
            }
        }
        
        // Verificar altura/peso extremos apenas se não tiver características específicas
        if (pontos === 0) {
            const altura = parseFloat(document.getElementById('altura')?.value) || 1.70;
            const peso = parseFloat(document.getElementById('peso')?.value) || 70;
            
            // Penalidades por extremos (só se não tiver características)
            if (altura < 1.40 || altura > 2.00) pontos -= 3;
            if (peso < 45 || peso > 120) pontos -= 2;
        }
        
        // Atualizar se houve mudança
        if (pontos !== this.cache.caracteristicasFisicas) {
            console.log(`🔄 Características físicas: ${pontos} pontos (anterior: ${this.cache.caracteristicasFisicas})`);
            
            // Remover valor anterior
            if (this.cache.caracteristicasFisicas < 0) {
                this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(this.cache.caracteristicasFisicas));
            }
            
            // Adicionar novo valor (sempre negativo = desvantagem)
            if (pontos < 0) {
                this.gastos.desvantagens += Math.abs(pontos);
                console.log(`➕ Adicionando ${Math.abs(pontos)} pontos a desvantagens`);
            }
            
            this.cache.caracteristicasFisicas = pontos;
            this.updateAllDisplays();
        }
    }
    
    getCustoCaracteristica(tipo) {
        const custos = {
            'magro': -5,
            'acima-peso': -1,
            'gordo': -3,
            'muito-gordo': -5,
            'nanismo': -15,
            'gigantismo': 0
        };
        return custos[tipo] || 0;
    }
    
    obterCaracteristicasSalvas() {
        try {
            const dados = localStorage.getItem('rpgforge_caracteristicas_fisicas');
            if (dados) {
                const parsed = JSON.parse(dados);
                return parsed.caracteristicasSelecionadas || [];
            }
        } catch (e) {}
        return [];
    }
    
    recalcularPeculiaridades() {
        const listaPec = document.getElementById('pec-lista');
        let total = 0;
        
        if (listaPec) {
            const itensPec = listaPec.querySelectorAll('.pec-item');
            total = itensPec.length * -1; // Cada peculiaridade custa -1 ponto
            console.log(`🎭 Peculiaridades: ${itensPec.length} itens = ${total} pontos`);
        }
        
        // Atualizar peculiaridades (sempre negativo)
        this.gastos.peculiaridades = Math.abs(total);
        this.updateAllDisplays();
    }
    
    recalcularTudo() {
        console.log('🔄 Recalculando tudo...');
        
        // Riqueza
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            const valor = parseInt(selectRiqueza.value) || 0;
            this.processRiqueza(valor);
        }
        
        // Aparência
        const selectAparencia = document.getElementById('nivelAparencia');
        if (selectAparencia) {
            const valor = parseInt(selectAparencia.value) || 0;
            this.processAparencia(valor);
        }
        
        // Características físicas
        this.recalcularCaracteristicasFisicas();
        
        // Peculiaridades
        this.recalcularPeculiaridades();
    }
    
    // ============ CÁLCULOS E DISPLAY ============
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // GASTOS (custam pontos)
        const gastos = 
            Math.max(0, this.gastos.atributos) +  // Só atributos positivos
            this.gastos.vantagens +
            this.gastos.pericias +
            this.gastos.tecnicas +
            this.gastos.magia +
            this.gastos.equipamentos;
        
        // GANHOS (dão pontos)
        const ganhos = 
            Math.abs(Math.min(0, this.gastos.atributos)) +  // Atributos negativos
            this.gastos.desvantagens;                      // Inclui peculiaridades e outras desvantagens
        
        const disponiveis = totalBase - gastos + ganhos;
        
        return {
            total: totalBase,
            gastos: gastos,
            ganhos: ganhos,
            disponiveis: disponiveis,
            vantagens: this.gastos.vantagens,
            desvantagens: this.gastos.desvantagens,
            atributos: this.gastos.atributos,
            peculiaridades: this.gastos.peculiaridades
        };
    }
    
    updateAllDisplays() {
        const calculo = this.calcularPontosDisponiveis();
        
        console.log('📊 Atualizando displays:', {
            atributos: this.gastos.atributos,
            vantagens: this.gastos.vantagens,
            desvantagens: this.gastos.desvantagens,
            peculiaridades: this.gastos.peculiaridades,
            disponiveis: calculo.disponiveis
        });
        
        // 1. PONTOS DISPONÍVEIS
        const dispEl = document.getElementById('pontosDisponiveis');
        if (dispEl) {
            dispEl.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                dispEl.style.color = '#e74c3c';
            } else if (calculo.disponiveis < 10) {
                dispEl.style.color = '#f39c12';
            } else {
                dispEl.style.color = '#27ae60';
            }
        }
        
        // 2. CARDS DE RESUMO
        this.updateCardDisplay('atributos', this.gastos.atributos);
        this.updateCardDisplay('vantagens', this.gastos.vantagens);
        this.updateCardDisplay('desvantagens', this.gastos.desvantagens);
        this.updateCardDisplay('peculiaridades', this.gastos.peculiaridades);
        
        // 3. PONTOS GASTOS TOTAL
        const gastosEl = document.getElementById('pontosGastos');
        if (gastosEl) {
            gastosEl.textContent = calculo.gastos;
        }
        
        // 4. PERCENTUAIS
        this.updatePercentages(calculo.total);
        
        // 5. LIMITES
        this.updateLimits();
    }
    
    updateCardDisplay(tipo, valor) {
        const elementId = `pontos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const elemento = document.getElementById(elementId);
        if (!elemento) {
            console.warn(`❌ Elemento não encontrado: ${elementId}`);
            return;
        }
        
        // Formatar valor
        if (tipo === 'atributos') {
            elemento.textContent = valor >= 0 ? `+${valor}` : `${valor}`;
        } else {
            elemento.textContent = Math.abs(valor);
        }
        
        // Estilizar card
        const cardDiv = elemento.closest('.category');
        if (cardDiv) {
            cardDiv.classList.remove('positivo', 'negativo', 'zero');
            
            if (valor > 0) {
                if (tipo === 'desvantagens' || tipo === 'peculiaridades') {
                    cardDiv.classList.add('negativo');
                } else {
                    cardDiv.classList.add('positivo');
                }
            } else if (valor === 0) {
                cardDiv.classList.add('zero');
            } else if (valor < 0) {
                cardDiv.classList.add('negativo');
            }
        }
    }
    
    updatePercentages(totalBase) {
        if (totalBase <= 0) return;
        
        const categorias = ['atributos', 'vantagens', 'desvantagens', 'peculiaridades', 'pericias', 'tecnicas', 'magia'];
        
        categorias.forEach(cat => {
            const valor = this.gastos[cat] || 0;
            const percentEl = document.getElementById(`perc${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
            
            if (percentEl) {
                const percentual = Math.round((Math.abs(valor) / totalBase) * 100);
                percentEl.textContent = `${percentual}%`;
                
                if (percentual > 30) {
                    percentEl.style.color = '#e74c3c';
                } else if (percentual > 15) {
                    percentEl.style.color = '#f39c12';
                } else {
                    percentEl.style.color = '#7f8c8d';
                }
            }
        });
    }
    
    updateLimits() {
        // Limite desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const limiteDesv = parseInt(document.getElementById('limiteDesvantagens')?.value) || 40;
            const desvAtual = this.gastos.desvantagens || 0;
            const percentual = Math.min(100, (desvAtual / limiteDesv) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvAtual}/${limiteDesv} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c';
                textDesv.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12';
                textDesv.style.color = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
                textDesv.style.color = '#3498db';
            }
        }
        
        // Limite peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const limitePec = parseInt(document.getElementById('limitePeculiaridades')?.value) || 20;
            const pecAtual = this.gastos.peculiaridades || 0;
            const percentual = Math.min(100, (pecAtual / limitePec) * 100);
            
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${pecAtual}/${limitePec} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
                textPec.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
                textPec.style.color = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
                textPec.style.color = '#3498db';
            }
        }
    }
    
    // ============ MÉTODOS PÚBLICOS ============
    
    resetarTudo() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        this.cache = {
            riqueza: 0,
            aparencia: 0,
            caracteristicasFisicas: 0,
            idiomas: 0,
            statusSocial: 0,
            atributosComplementares: 0
        };
        
        // Resetar inputs
        const pontosIniciaisInput = document.getElementById('pontosIniciais');
        if (pontosIniciaisInput) pontosIniciaisInput.value = 150;
        
        const pontosGanhosInput = document.getElementById('pontosGanhos');
        if (pontosGanhosInput) pontosGanhosInput.value = 0;
        
        this.updateAllDisplays();
    }
}

// Instância global
let pontosManager = null;

// Inicializador
function inicializarSistemaPontos() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        inicializarSistemaPontos();
        
        // Teste inicial
        setTimeout(() => {
            const pontosDisp = document.getElementById('pontosDisponiveis');
            if (pontosDisp && pontosDisp.textContent !== '150') {
                pontosDisp.textContent = '150';
                pontosDisp.style.color = '#27ae60';
            }
        }, 1000);
    }, 500);
});

// Exportar
window.PontosManager = PontosManager;
window.inicializarSistemaPontos = inicializarSistemaPontos;
window.getPontosManager = () => pontosManager;
window.resetarPontos = () => {
    if (pontosManager) pontosManager.resetarTudo();
};