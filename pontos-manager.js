// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL
// Mantém atributos funcionando e soma desvantagens
// ===========================================

class PontosManager {
    constructor() {
        // SISTEMA ORIGINAL (para atributos, pericias, etc)
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
        
        // NOVO: Sistema separado para SOMAR desvantagens
        this.desvantagensSeparadas = {
            caracteristicasFisicas: 0,   // Magro: 5, Gordo: 3
            riqueza: 0,                  // Pobre: 15, Batalhador: 10
            outras: 0
        };
        
        // NOVO: Sistema separado para SOMAR vantagens
        this.vantagensSeparadas = {
            riqueza: 0,                  // Rico: 20, Confortável: 10
            outras: 0
        };
        
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializado = false;
        this.inicializar();
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        this.configurarInputs();
        this.carregarDadosSalvos();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Pontos Manager inicializado!');
    }
    
    configurarInputs() {
        // Pontos iniciais
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        // Pontos da campanha
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        // Limites
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvarDados();
            });
        }
        
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (inputLimitePeculiaridades) {
            inputLimitePeculiaridades.value = this.limites.peculiaridades;
            inputLimitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.verificarLimites();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        // 1. ATRIBUTOS (funciona normalmente como antes)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplayAba('atributos');
                this.atualizarTotais();
                this.salvarDados();
                console.log('💪 Atributos atualizados:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS (soma nas desvantagens separadas)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                const pontosAbs = Math.abs(e.detail.pontosGastos);
                this.desvantagensSeparadas.caracteristicasFisicas = pontosAbs;
                
                // Recalcula total de desvantagens
                this.recalcularTotalDesvantagens();
                this.salvarDados();
                console.log('🏃 Características físicas:', pontosAbs, 'pts');
            }
        });
        
        // 3. RIQUEZA (atualiza vantagens OU desvantagens separadas)
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Rico: +20)
                    this.vantagensSeparadas.riqueza = pontos;
                    this.desvantagensSeparadas.riqueza = 0;
                    this.recalcularTotalVantagens();
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15)
                    this.desvantagensSeparadas.riqueza = Math.abs(pontos);
                    this.vantagensSeparadas.riqueza = 0;
                    this.recalcularTotalDesvantagens();
                } else {
                    // NEUTRO
                    this.desvantagensSeparadas.riqueza = 0;
                    this.vantagensSeparadas.riqueza = 0;
                    this.recalcularTotalDesvantagens();
                    this.recalcularTotalVantagens();
                }
                
                this.salvarDados();
                console.log('💰 Riqueza:', pontos, 'pts');
            }
        });
        
        // 4. OUTROS SISTEMAS (para compatibilidade)
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.vantagens = e.detail.pontosGastos;
                this.atualizarDisplayAba('vantagens');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.pericias = e.detail.pontosGastos;
                this.atualizarDisplayAba('pericias');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontosGastos;
                this.atualizarDisplayAba('peculiaridades');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvarDados();
            }
        });
    }
    
    // ==================== CÁLCULOS ====================
    
    calcularTotalDesvantagensSeparadas() {
        return this.desvantagensSeparadas.caracteristicasFisicas +
               this.desvantagensSeparadas.riqueza +
               this.desvantagensSeparadas.outras;
    }
    
    calcularTotalVantagensSeparadas() {
        return this.vantagensSeparadas.riqueza +
               this.vantagensSeparadas.outras;
    }
    
    recalcularTotalDesvantagens() {
        // Total = desvantagens originais (do sistema antigo) + desvantagens separadas
        const desvantagensSeparadasTotal = this.calcularTotalDesvantagensSeparadas();
        
        // Atualiza o sistema original
        this.gastos.desvantagens = desvantagensSeparadasTotal;
        
        // Atualiza display
        this.atualizarDisplayAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    recalcularTotalVantagens() {
        // Total = vantagens originais (do sistema antigo) + vantagens separadas
        const vantagensSeparadasTotal = this.calcularTotalVantagensSeparadas();
        
        // Atualiza o sistema original
        this.gastos.vantagens = vantagensSeparadasTotal;
        
        // Atualiza display
        this.atualizarDisplayAba('vantagens');
        this.atualizarTotais();
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS: tudo que custa pontos
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS: tudo que dá pontos
        let desvantagensTotal = 0;
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Cálculo final: pontos iniciais - vantagens + desvantagens
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    // ==================== ATUALIZAÇÕES VISUAIS ====================
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
        // Estilização
        elemento.parentElement.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (pontos > 0) {
                elemento.parentElement.classList.add('negativo');
            }
        } else if (pontos > 0) {
            elemento.parentElement.classList.add('positivo');
        } else if (pontos < 0) {
            elemento.parentElement.classList.add('negativo');
        }
        
        this.atualizarPercentualAba(aba, pontos);
    }
    
    atualizarPercentualAba(aba, pontos) {
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontosAbs = Math.abs(pontos);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontosAbs / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Cores baseadas no percentual
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else if (aba === 'desvantagens') {
                elemento.style.color = '#3498db';
            } else {
                elemento.style.color = '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTudo() {
        // Atualiza todas as abas
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
                elementoDisponiveis.style.fontWeight = 'normal';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
                elementoDisponiveis.style.fontWeight = 'normal';
            }
        }
        
        // Total gastos
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite de desvantagens
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (calculo.desvantagens / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${calculo.desvantagens}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
        }
        
        // Limite de peculiaridades
        const peculiaridadesAtual = Math.abs(this.gastos.peculiaridades || 0);
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (peculiaridadesAtual / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${peculiaridadesAtual}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    // ==================== PERSISTÊNCIA ====================
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagensSeparadas: { ...this.desvantagensSeparadas },
            vantagensSeparadas: { ...this.vantagensSeparadas },
            limites: { ...this.limites }
        };
        
        localStorage.setItem('pontos_manager_completo', JSON.stringify(dados));
    }
    
    async carregarDadosSalvos() {
        try {
            const dados = localStorage.getItem('pontos_manager_completo');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (error) {
            console.error('Erro ao carregar pontos:', error);
        }
    }
    
    aplicarDados(dados) {
        if (dados.pontosIniciais !== undefined) {
            this.pontosIniciais = dados.pontosIniciais;
            const input = document.getElementById('pontosIniciais');
            if (input) input.value = this.pontosIniciais;
        }
        
        if (dados.pontosGanhosCampanha !== undefined) {
            this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
            const input = document.getElementById('pontosGanhos');
            if (input) input.value = this.pontosGanhosCampanha;
        }
        
        if (dados.gastos) {
            Object.assign(this.gastos, dados.gastos);
        }
        
        if (dados.desvantagensSeparadas) {
            Object.assign(this.desvantagensSeparadas, dados.desvantagensSeparadas);
        }
        
        if (dados.vantagensSeparadas) {
            Object.assign(this.vantagensSeparadas, dados.vantagensSeparadas);
        }
        
        if (dados.limites) {
            Object.assign(this.limites, dados.limites);
        }
        
        this.atualizarTudo();
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // ==================== FUNÇÕES PÚBLICAS ====================
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    mostrarStatus() {
        const calc = this.calcularPontosDisponiveis();
        console.log('📊 STATUS DOS PONTOS:');
        console.log('- Atributos:', this.gastos.atributos, 'pts');
        console.log('- Desvantagens:', calc.desvantagens, 'pts');
        console.log('- Vantagens:', calc.vantagens, 'pts');
        console.log('- Disponíveis:', calc.disponiveis, 'pts');
        console.log('- Fontes desvantagens:', this.desvantagensSeparadas);
        console.log('- Fontes vantagens:', this.vantagensSeparadas);
    }
}

// ==================== INSTÂNCIA GLOBAL ====================

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// ==================== TESTE COMPLETO ====================

function testarSistemaCompleto() {
    console.log('🧪 TESTANDO SISTEMA COMPLETO');
    
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 1. Atributos (+15)
    console.log('1. Atributos: +15 pts');
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    // 2. Características físicas: Magro (-5)
    setTimeout(() => {
        console.log('2. Características físicas: -5 pts');
        document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
            detail: { pontosGastos: -5 }
        }));
        
        // 3. Riqueza: Batalhador (-10)
        setTimeout(() => {
            console.log('3. Riqueza: -10 pts');
            document.dispatchEvent(new CustomEvent('riquezaAtualizadaParaSoma', {
                detail: { pontos: -10 }
            }));
            
            // Verifica resultado
            setTimeout(() => {
                pontosManager.mostrarStatus();
                
                const calc = pontosManager.calcularPontosDisponiveis();
                const esperadoDisponiveis = 150 - 15 + (5 + 10); // 150 - 15 + 15 = 150
                
                console.log('📈 ESPERADO:');
                console.log('- Atributos: 15 pts');
                console.log('- Desvantagens: 5 + 10 = 15 pts');
                console.log('- Disponíveis: 150 - 15 + 15 = 150 pts');
                
                if (calc.disponiveis === esperadoDisponiveis) {
                    console.log('✅ SUCESSO! Sistema completo funcionando!');
                } else {
                    console.log('❌ FALHA! Disponíveis:', calc.disponiveis, ', Esperado:', esperadoDisponiveis);
                }
            }, 200);
        }, 200);
    }, 200);
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🔄 Pontos Manager inicializado na aba principal');
        }
    }, 500);
});

// ==================== EXPORTAÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.testarSistemaCompleto = testarSistemaCompleto;
window.PontosManager = PontosManager;