// pontos-manager.js - VERSÃO COMPLETA E FUNCIONAL
class PontosManager {
    constructor() {
        // Pontos básicos
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Categorias de gastos
        this.gastos = {
            atributos: 0,        // Custam pontos quando positivos, dão pontos quando negativos
            vantagens: 0,        // Sempre custam pontos (valores positivos)
            desvantagens: 0,     // Sempre dão pontos (valores positivos no display)
            peculiaridades: 0,   // Sempre dão pontos (valores positivos no display)
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // Cache para rastrear mudanças
        this.cache = {
            riqueza: 0,
            aparencia: 0,
            caracteristicasFisicas: 0,
            idiomas: 0,
            statusSocial: 0,
            atributosComplementares: 0
        };
        
        // Inicializar sistema
        this.init();
    }
    
    init() {
        this.setupInputs();
        this.setupEventListeners();
        this.setupObservers();
        
        // Forçar atualização inicial
        setTimeout(() => {
            this.recalcularTudo();
            this.updateAllDisplays();
        }, 300);
    }
    
    setupInputs() {
        // Pontos iniciais
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 150;
                this.pontosIniciais = valor;
                this.updateAllDisplays();
            });
        }
        
        // Pontos ganhos na campanha
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) {
            inputGanhos.value = this.pontosGanhosCampanha;
            inputGanhos.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.pontosGanhosCampanha = valor;
                this.updateAllDisplays();
            });
        }
        
        // Limites
        const limiteDesv = document.getElementById('limiteDesvantagens');
        const limitePec = document.getElementById('limitePeculiaridades');
        
        if (limiteDesv) {
            limiteDesv.addEventListener('change', () => this.updateLimits());
        }
        if (limitePec) {
            limitePec.addEventListener('change', () => this.updateLimits());
        }
    }
    
    setupEventListeners() {
        // ============ ATRIBUTOS ============
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.updateAllDisplays();
            }
        });
        
        // ============ RIQUEZA ============
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            selectRiqueza.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.cache.riqueza = valor;
                this.processRiqueza(valor);
            });
            // Capturar valor inicial
            setTimeout(() => {
                const valorInicial = parseInt(selectRiqueza.value) || 0;
                this.cache.riqueza = valorInicial;
                this.processRiqueza(valorInicial);
            }, 500);
        }
        
        // ============ APARÊNCIA ============
        const selectAparencia = document.getElementById('nivelAparencia');
        if (selectAparencia) {
            selectAparencia.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.cache.aparencia = valor;
                this.processAparencia(valor);
            });
        }
        
        // ============ IDIOMAS ============
        // Monitorar botão de adicionar idioma
        const btnAdicionarIdioma = document.getElementById('btnAdicionarIdioma');
        if (btnAdicionarIdioma) {
            btnAdicionarIdioma.addEventListener('click', () => {
                setTimeout(() => this.recalcularIdiomas(), 200);
            });
        }
        
        // Monitorar lista de idiomas
        const listaIdiomas = document.getElementById('listaIdiomasAdicionais');
        if (listaIdiomas) {
            const observerIdiomas = new MutationObserver(() => {
                this.recalcularIdiomas();
            });
            observerIdiomas.observe(listaIdiomas, { childList: true });
        }
        
        // ============ PECULIARIDADES ============
        const btnAdicionarPec = document.getElementById('pec-adicionar-btn');
        if (btnAdicionarPec) {
            btnAdicionarPec.addEventListener('click', () => {
                setTimeout(() => this.recalcularPeculiaridades(), 200);
            });
        }
        
        // Monitorar lista de peculiaridades
        const listaPec = document.getElementById('pec-lista');
        if (listaPec) {
            const observerPec = new MutationObserver(() => {
                this.recalcularPeculiaridades();
            });
            observerPec.observe(listaPec, { childList: true });
        }
        
        // ============ ATRIBUTOS COMPLEMENTARES ============
        document.querySelectorAll('.btn-atributo').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.recalcularAtributosComplementares(), 100);
            });
        });
    }
    
    setupObservers() {
        // Observar mudanças em características físicas
        setInterval(() => {
            this.recalcularCaracteristicasFisicas();
        }, 1000);
    }
    
    // ============ PROCESSAMENTO DAS CATEGORIAS ============
    
    processRiqueza(valor) {
        // Remover valor anterior se existir
        if (this.cache.riqueza !== 0) {
            if (this.cache.riqueza > 0) {
                this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(this.cache.riqueza));
            } else {
                this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(this.cache.riqueza));
            }
        }
        
        // Adicionar novo valor
        if (valor > 0) {
            this.gastos.vantagens += valor;
        } else if (valor < 0) {
            this.gastos.desvantagens += Math.abs(valor);
        }
        
        this.updateAllDisplays();
    }
    
    processAparencia(valor) {
        // Remover valor anterior se existir
        if (this.cache.aparencia !== 0) {
            if (this.cache.aparencia > 0) {
                this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(this.cache.aparencia));
            } else {
                this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(this.cache.aparencia));
            }
        }
        
        // Adicionar novo valor
        if (valor > 0) {
            this.gastos.vantagens += valor;
        } else if (valor < 0) {
            this.gastos.desvantagens += Math.abs(valor);
        }
        
        this.updateAllDisplays();
    }
    
    recalcularIdiomas() {
        const valorAnterior = this.cache.idiomas || 0;
        
        // Remover valor anterior
        if (valorAnterior > 0) {
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - valorAnterior);
        } else if (valorAnterior < 0) {
            this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(valorAnterior));
        }
        
        // Calcular novo valor
        let pontosIdiomas = 0;
        
        // Verificar alfabetização
        const radioAlfabetizacao = document.querySelector('input[name="alfabetizacao"]:checked');
        if (radioAlfabetizacao && parseInt(radioAlfabetizacao.value) < 0) {
            pontosIdiomas += parseInt(radioAlfabetizacao.value);
        }
        
        // Verificar idiomas adicionais
        const listaIdiomas = document.getElementById('listaIdiomasAdicionais');
        if (listaIdiomas) {
            const itensIdiomas = listaIdiomas.querySelectorAll('.idioma-item');
            itensIdiomas.forEach(item => {
                const custoElement = item.querySelector('.idioma-custo');
                if (custoElement) {
                    const texto = custoElement.textContent;
                    const match = texto.match(/([+-]?\d+)/);
                    if (match) {
                        pontosIdiomas += parseInt(match[1]);
                    }
                }
            });
        }
        
        this.cache.idiomas = pontosIdiomas;
        
        if (pontosIdiomas > 0) {
            this.gastos.vantagens += pontosIdiomas;
        } else if (pontosIdiomas < 0) {
            this.gastos.desvantagens += Math.abs(pontosIdiomas);
        }
        
        this.updateAllDisplays();
    }
    
    recalcularCaracteristicasFisicas() {
        // Verificar modal de características físicas
        const modal = document.getElementById('alturaPesoModal');
        let pontos = 0;
        
        // Verificar botões ativos
        if (modal) {
            const botoesAtivos = modal.querySelectorAll('.feature-btn.active');
            botoesAtivos.forEach(btn => {
                const tipo = btn.dataset.type;
                const custo = this.getCustoCaracteristica(tipo);
                pontos += custo;
            });
        }
        
        // Verificar altura/peso extremos
        const altura = parseFloat(document.getElementById('altura')?.value) || 1.70;
        const peso = parseFloat(document.getElementById('peso')?.value) || 70;
        
        if (altura < 1.40 || altura > 2.00) pontos -= 5;
        if (peso < 45 || peso > 120) pontos -= 3;
        
        // Atualizar se houve mudança
        if (pontos !== this.cache.caracteristicasFisicas) {
            // Remover valor anterior
            if (this.cache.caracteristicasFisicas < 0) {
                this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(this.cache.caracteristicasFisicas));
            }
            
            // Adicionar novo valor
            if (pontos < 0) {
                this.gastos.desvantagens += Math.abs(pontos);
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
    
    recalcularAtributosComplementares() {
        let pontos = 0;
        
        // Vontade
        const vontadeMod = parseInt(document.getElementById('vontadeMod')?.value) || 0;
        pontos += vontadeMod * 5;
        
        // Percepção
        const percepcaoMod = parseInt(document.getElementById('percepcaoMod')?.value) || 0;
        pontos += percepcaoMod * 5;
        
        // PV
        const pvMod = parseInt(document.getElementById('pvMod')?.value) || 0;
        pontos += pvMod * 2;
        
        // PF
        const pfMod = parseInt(document.getElementById('pfMod')?.value) || 0;
        pontos += pfMod * 3;
        
        // Velocidade
        const velocidadeMod = parseInt(document.getElementById('velocidadeMod')?.value) || 0;
        pontos += velocidadeMod * 20;
        
        // Deslocamento
        const deslocamentoMod = parseInt(document.getElementById('deslocamentoMod')?.value) || 0;
        pontos += deslocamentoMod * 5;
        
        if (pontos !== this.cache.atributosComplementares) {
            // Remover valor anterior
            if (this.cache.atributosComplementares > 0) {
                this.gastos.vantagens = Math.max(0, this.gastos.vantagens - this.cache.atributosComplementares);
            } else if (this.cache.atributosComplementares < 0) {
                this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(this.cache.atributosComplementares));
            }
            
            // Adicionar novo valor
            if (pontos > 0) {
                this.gastos.vantagens += pontos;
            } else if (pontos < 0) {
                this.gastos.desvantagens += Math.abs(pontos);
            }
            
            this.cache.atributosComplementares = pontos;
            this.updateAllDisplays();
        }
    }
    
    recalcularPeculiaridades() {
        const listaPec = document.getElementById('pec-lista');
        let total = 0;
        
        if (listaPec) {
            const itensPec = listaPec.querySelectorAll('.pec-item');
            total = itensPec.length * -1; // Cada peculiaridade custa -1 ponto
        }
        
        if (total !== this.gastos.peculiaridades) {
            // Remover valor anterior
            this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - this.gastos.peculiaridades);
            
            // Adicionar novo valor
            this.gastos.peculiaridades = Math.abs(total);
            this.gastos.desvantagens += this.gastos.peculiaridades;
            
            this.updateAllDisplays();
        }
    }
    
    recalcularTudo() {
        // Recalcular todos os valores
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            const valor = parseInt(selectRiqueza.value) || 0;
            this.cache.riqueza = valor;
            this.processRiqueza(valor);
        }
        
        const selectAparencia = document.getElementById('nivelAparencia');
        if (selectAparencia) {
            const valor = parseInt(selectAparencia.value) || 0;
            this.cache.aparencia = valor;
            this.processAparencia(valor);
        }
        
        this.recalcularIdiomas();
        this.recalcularCaracteristicasFisicas();
        this.recalcularAtributosComplementares();
        this.recalcularPeculiaridades();
    }
    
    // ============ CÁLCULOS E DISPLAY ============
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // GASTOS (custam pontos)
        const gastos = 
            Math.max(0, this.gastos.atributos) +  // Atributos acima de 10
            this.gastos.vantagens +
            this.gastos.pericias +
            this.gastos.tecnicas +
            this.gastos.magia +
            this.gastos.equipamentos;
        
        // GANHOS (dão pontos)
        const ganhos = 
            Math.abs(Math.min(0, this.gastos.atributos)) +  // Atributos abaixo de 10
            this.gastos.desvantagens;
        
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
        
        // 1. PONTOS DISPONÍVEIS
        const dispEl = document.getElementById('pontosDisponiveis');
        if (dispEl) {
            dispEl.textContent = calculo.disponiveis;
            
            // Colorir
            if (calculo.disponiveis < 0) {
                dispEl.style.color = '#e74c3c';
                dispEl.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                dispEl.style.color = '#f39c12';
                dispEl.style.fontWeight = 'bold';
            } else {
                dispEl.style.color = '#27ae60';
                dispEl.style.fontWeight = '';
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
        const cardElement = document.getElementById(`pontos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (!cardElement) return;
        
        // Formatar valor
        if (tipo === 'atributos') {
            cardElement.textContent = valor >= 0 ? `+${valor}` : `${valor}`;
        } else {
            cardElement.textContent = Math.abs(valor);
        }
        
        // Estilizar card
        const cardDiv = cardElement.closest('.category');
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
                
                // Colorir baseado no percentual
                if (percentual > 30) {
                    percentEl.style.color = '#e74c3c';
                    percentEl.style.fontWeight = 'bold';
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
            
            // Colorir
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
            
            // Colorir
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
    
    adicionarVantagem(pontos, tipo = 'outros') {
        this.gastos.vantagens += Math.abs(pontos);
        this.updateAllDisplays();
        return true;
    }
    
    adicionarDesvantagem(pontos, tipo = 'outros') {
        this.gastos.desvantagens += Math.abs(pontos);
        this.updateAllDisplays();
        return true;
    }
    
    atualizarAtributos(pontos) {
        this.gastos.atributos = pontos;
        this.updateAllDisplays();
    }
    
    obterResumo() {
        return this.calcularPontosDisponiveis();
    }
    
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
        
        // Disparar eventos para outros sistemas resetarem
        if (window.resetAtributos) window.resetAtributos();
        if (window.SistemaRiqueza) {
            const sistemaRiqueza = window.inicializarSistemaRiqueza();
            if (sistemaRiqueza) sistemaRiqueza.resetar();
        }
        
        this.updateAllDisplays();
    }
}

// Instância global
let pontosManager = null;

// Inicializador
function inicializarSistemaPontos() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
        console.log('✅ Sistema de pontos inicializado com sucesso!');
    }
    return pontosManager;
}

// Inicializar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            inicializarSistemaPontos();
            
            // Verificação inicial
            setTimeout(() => {
                const pontosDisp = document.getElementById('pontosDisponiveis');
                const pontosAtributos = document.getElementById('pontosAtributos');
                
                if (pontosDisp && pontosDisp.textContent !== '150') {
                    console.warn('⚠️ Pontos disponíveis não inicializou com 150');
                    pontosDisp.textContent = '150';
                }
                
                if (pontosAtributos && pontosAtributos.textContent !== '0') {
                    console.warn('⚠️ Pontos de atributos não inicializou com 0');
                    pontosAtributos.textContent = '0';
                }
            }, 1000);
        }, 500);
    });
} else {
    setTimeout(() => {
        inicializarSistemaPontos();
    }, 500);
}

// Exportar para uso global
window.PontosManager = PontosManager;
window.inicializarSistemaPontos = inicializarSistemaPontos;
window.getPontosManager = () => pontosManager;
window.resetarPontos = () => {
    if (pontosManager) pontosManager.resetarTudo();
};

// Debug helper (remover em produção)
window.debugPontos = () => {
    if (pontosManager) {
        console.log('=== DEBUG PONTOS ===');
        console.log('Gastos:', pontosManager.gastos);
        console.log('Cache:', pontosManager.cache);
        console.log('Resumo:', pontosManager.obterResumo());
        console.log('==================');
    } else {
        console.log('PontosManager não inicializado');
    }
};