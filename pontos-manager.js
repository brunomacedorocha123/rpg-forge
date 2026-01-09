// ===========================================
// PONTOS-MANAGER.JS - COMPLETO E FUNCIONAL
// ===========================================

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
        
        this.desvantagensSomadas = {
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
        console.log('✅ Pontos Manager inicializado!');
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvar();
            });
        }
        
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
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
        // 1. ATRIBUTOS
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.desvantagensSomadas.caracteristicasFisicas = Math.abs(e.detail.pontosGastos);
                this.somarDesvantagens();
                this.salvar();
                console.log('🏃 Características físicas:', this.desvantagensSomadas.caracteristicasFisicas, 'pts');
            }
        });
        
        // 3. RIQUEZA
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = parseInt(e.detail.pontos);
                console.log('💰 Riqueza recebida:', pontos, 'pts');
                
                if (pontos < 0) {
                    // DESVANTAGEM (negativa)
                    this.desvantagensSomadas.riqueza = Math.abs(pontos);
                    this.somarDesvantagens();
                } else if (pontos > 0) {
                    // VANTAGEM (positiva)
                    this.gastos.vantagens = pontos;
                    this.atualizarDisplay('vantagens');
                } else {
                    // NEUTRO
                    this.desvantagensSomadas.riqueza = 0;
                    this.somarDesvantagens();
                }
                
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // 4. PECULIARIDADES
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontosGastos;
                this.atualizarDisplay('peculiaridades');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
    }
    
    somarDesvantagens() {
        const total = this.desvantagensSomadas.caracteristicasFisicas + this.desvantagensSomadas.riqueza;
        this.gastos.desvantagens = total;
        this.atualizarDisplay('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
        console.log('➕ Desvantagens totais:', total, 'pts');
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
    
    atualizarDisplay(aba) {
        const elemento = document.getElementById(`pontos${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
        // Atualiza porcentagem
        const elementoPercent = document.getElementById(`perc${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (elementoPercent) {
            const total = this.pontosIniciais + this.pontosGanhosCampanha;
            if (total > 0) {
                const percentual = (Math.abs(pontos) / total) * 100;
                elementoPercent.textContent = `${Math.round(percentual)}%`;
            } else {
                elementoPercent.textContent = "0%";
            }
        }
        
        // Estilo
        const pai = elemento.parentElement;
        pai.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (pontos > 0) pai.classList.add('negativo');
        } else if (pontos > 0) {
            pai.classList.add('positivo');
        } else if (pontos < 0) {
            pai.classList.add('negativo');
        }
    }
    
    atualizarTudo() {
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplay(aba);
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
            } else {
                elementoDisponiveis.style.color = '#27ae60';
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
        
        // Limite desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textoDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textoDesv && percentDesv) {
            const desvantagensAtuais = Math.abs(this.gastos.desvantagens || 0);
            const percentualDesv = Math.min(100, (desvantagensAtuais / this.limites.desvantagens) * 100);
            
            progressDesv.style.width = `${percentualDesv}%`;
            textoDesv.textContent = `${desvantagensAtuais}/${this.limites.desvantagens} pts`;
            percentDesv.textContent = `${Math.round(percentualDesv)}%`;
            
            // Cor do progresso
            if (percentualDesv >= 90) {
                progressDesv.style.backgroundColor = '#e74c3c';
            } else if (percentualDesv >= 75) {
                progressDesv.style.backgroundColor = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
            }
        }
        
        // Limite peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textoPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textoPec && percentPec) {
            const peculiaridadesAtuais = Math.abs(this.gastos.peculiaridades || 0);
            const percentualPec = Math.min(100, (peculiaridadesAtuais / this.limites.peculiaridades) * 100);
            
            progressPec.style.width = `${percentualPec}%`;
            textoPec.textContent = `${peculiaridadesAtuais}/${this.limites.peculiaridades} pts`;
            percentPec.textContent = `${Math.round(percentualPec)}%`;
            
            // Cor do progresso
            if (percentualPec >= 90) {
                progressPec.style.backgroundColor = '#e74c3c';
            } else if (percentualPec >= 75) {
                progressPec.style.backgroundColor = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
            }
        }
    }
    
    salvar() {
        try {
            const dados = {
                pontosIniciais: this.pontosIniciais,
                pontosGanhosCampanha: this.pontosGanhosCampanha,
                gastos: { ...this.gastos },
                desvantagensSomadas: { ...this.desvantagensSomadas },
                limites: { ...this.limites },
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('pontos_sistema_completo', JSON.stringify(dados));
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_sistema_completo');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (e) {
            console.error('Erro ao carregar:', e);
        }
    }
    
    aplicarDados(dados) {
        if (dados.pontosIniciais) this.pontosIniciais = dados.pontosIniciais;
        if (dados.pontosGanhosCampanha) this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
        if (dados.gastos) Object.assign(this.gastos, dados.gastos);
        if (dados.desvantagensSomadas) Object.assign(this.desvantagensSomadas, dados.desvantagensSomadas);
        if (dados.limites) Object.assign(this.limites, dados.limites);
        
        this.atualizarTudo();
    }
    
    resetar() {
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
        
        this.desvantagensSomadas = {
            caracteristicasFisicas: 0,
            riqueza: 0
        };
        
        this.atualizarTudo();
        this.salvar();
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

// ==================== INICIALIZAÇÃO AUTOMÁTICA ====================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Sistema de pontos completo iniciado!');
            
            // Força atualização inicial
            setTimeout(() => {
                if (pontosManager) {
                    pontosManager.atualizarTudo();
                }
            }, 100);
        }
    }, 300);
});

// ==================== FUNÇÕES DE DEBUG ====================

window.mostrarStatusPontos = function() {
    if (pontosManager) {
        console.log('📊 STATUS DO SISTEMA DE PONTOS:');
        console.log('- Pontos iniciais:', pontosManager.pontosIniciais);
        console.log('- Pontos ganhos:', pontosManager.pontosGanhosCampanha);
        console.log('- Total disponível:', pontosManager.calcularPontosDisponiveis().disponiveis);
        console.log('- Desvantagens:', pontosManager.gastos.desvantagens);
        console.log('- Vantagens:', pontosManager.gastos.vantagens);
        console.log('- Riqueza (desvantagem):', pontosManager.desvantagensSomadas.riqueza);
        console.log('- Caract. físicas (desvantagem):', pontosManager.desvantagensSomadas.caracteristicasFisicas);
    } else {
        console.log('❌ Sistema de pontos não inicializado');
    }
};

// ==================== EXPORTAÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.resetarPontos = function() {
    if (pontosManager) pontosManager.resetar();
};

// ==================== INICIALIZADOR DE EMERGÊNCIA ====================

// Garante que o sistema funcione mesmo se outros scripts falharem
setTimeout(() => {
    if (!pontosManager && document.getElementById('pontosIniciais')) {
        inicializarPontosManager();
    }
}, 2000);