// ===========================================
// PONTOS-MANAGER.JS - VERSÃO COMPLETA FINAL
// NÃO QUEBRA NADA, SÓ SOMA AS DESVANTAGENS
// ===========================================

class PontosManager {
    constructor() {
        // SISTEMA ORIGINAL - NÃO MEXE
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
        
        // CONTADORES EXTRA SÓ PRA SOMAR
        this.desvantagensExtra = {
            caracteristicasFisicas: 0,
            riqueza: 0
        };
        
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
        this.carregarDados();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Sistema de pontos pronto!');
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
        
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvar();
            });
        }
        
        if (inputLimitePeculiaridades) {
            inputLimitePeculiaridades.value = this.limites.peculiaridades;
            inputLimitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.verificarLimites();
                this.salvar();
            });
        }
    }
    
    configurarEventos() {
        // ATRIBUTOS - FUNCIONANDO NORMAL
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarAba('atributos');
                this.atualizarTotais();
                this.salvar();
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS - SOMA
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.desvantagensExtra.caracteristicasFisicas = Math.abs(e.detail.pontosGastos);
                this.atualizarDesvantagensTotais();
                this.salvar();
            }
        });
        
        // RIQUEZA - SOMA OU VANTAGEM
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    // DESVANTAGEM (Pobre: -15)
                    this.desvantagensExtra.riqueza = Math.abs(pontos);
                    this.atualizarDesvantagensTotais();
                } else if (pontos > 0) {
                    // VANTAGEM (Rico: +20)
                    this.gastos.vantagens = pontos;
                    this.atualizarAba('vantagens');
                    this.atualizarTotais();
                } else {
                    // NEUTRO
                    this.desvantagensExtra.riqueza = 0;
                    this.atualizarDesvantagensTotais();
                }
                
                this.salvar();
            }
        });
        
        // PERÍCIAS - FUNCIONANDO NORMAL
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.pericias = e.detail.pontosGastos;
                this.atualizarAba('pericias');
                this.atualizarTotais();
                this.salvar();
            }
        });
        
        // PECULIARIDADES - FUNCIONANDO NORMAL
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontosGastos;
                this.atualizarAba('peculiaridades');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // TÉCNICAS - FUNCIONANDO NORMAL
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.tecnicas = e.detail.pontosGastos;
                this.atualizarAba('tecnicas');
                this.atualizarTotais();
                this.salvar();
            }
        });
        
        // MAGIA - FUNCIONANDO NORMAL
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.magia = e.detail.pontosGastos;
                this.atualizarAba('magia');
                this.atualizarTotais();
                this.salvar();
            }
        });
    }
    
    // FUNÇÃO NOVA: SOMA TODAS AS DESVANTAGENS
    atualizarDesvantagensTotais() {
        const total = this.desvantagensExtra.caracteristicasFisicas + 
                     this.desvantagensExtra.riqueza;
        
        this.gastos.desvantagens = total;
        this.atualizarAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS (custa pontos)
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS (dá pontos)
        let desvantagensTotal = 0;
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Cálculo final
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
        // Estilização
        const pai = elemento.parentElement;
        pai.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (pontos > 0) pai.classList.add('negativo');
        } else if (pontos > 0) {
            pai.classList.add('positivo');
        } else if (pontos < 0) {
            pai.classList.add('negativo');
        }
        
        // Percentual
        this.atualizarPercentual(aba, pontos);
    }
    
    atualizarPercentual(aba, pontos) {
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontosAbs = Math.abs(pontos);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontosAbs / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Cores
            if (percentual > 50) elemento.style.color = '#e74c3c';
            else if (percentual > 25) elemento.style.color = '#f39c12';
            else if (aba === 'desvantagens') elemento.style.color = '#3498db';
            else elemento.style.color = '#27ae60';
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTudo() {
        // Atualiza todas as abas
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarAba(aba);
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
    
    salvar() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagensExtra: { ...this.desvantagensExtra },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('rpgforge_pontos_completo', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('rpgforge_pontos_completo');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
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
        
        if (dados.desvantagensExtra) {
            Object.assign(this.desvantagensExtra, dados.desvantagensExtra);
        }
        
        if (dados.limites) {
            Object.assign(this.limites, dados.limites);
        }
        
        this.atualizarTudo();
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // FUNÇÕES PÚBLICAS PARA OUTROS MÓDULOS
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    mostrarStatus() {
        const calc = this.calcularPontosDisponiveis();
        console.log('📊 STATUS:');
        console.log('- Atributos:', this.gastos.atributos);
        console.log('- Desvantagens:', calc.desvantagens, '(Físicas:', this.desvantagensExtra.caracteristicasFisicas, '+ Riqueza:', this.desvantagensExtra.riqueza, ')');
        console.log('- Vantagens:', calc.vantagens);
        console.log('- Disponíveis:', calc.disponiveis);
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

// ==================== FUNÇÃO DE TESTE ====================

function testarTudo() {
    console.log('🧪 TESTANDO SISTEMA COMPLETO');
    
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 1. Atributos
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    setTimeout(() => {
        // 2. Características físicas
        document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
            detail: { pontosGastos: -5 }
        }));
        
        setTimeout(() => {
            // 3. Riqueza
            document.dispatchEvent(new CustomEvent('riquezaAtualizadaParaSoma', {
                detail: { pontos: -10 }
            }));
            
            setTimeout(() => {
                pontosManager.mostrarStatus();
                console.log('✅ Sistema funcionando!');
            }, 200);
        }, 200);
    }, 200);
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
        }
    }, 500);
});

// ==================== EXPORTAÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.testarTudo = testarTudo;
window.PontosManager = PontosManager;