// ===========================================
// PONTOS-MANAGER.JS - GERENCIADOR CENTRAL DE PONTOS
// ===========================================

class PontosManager {
    constructor() {
        // Pontos totais disponíveis
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Pontos gastos por categoria
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
        
        // Limites configuráveis
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        // Callbacks para atualização de interface
        this.callbacks = new Map();
        
        // Estado
        this.inicializado = false;
        
        // Configurar automaticamente
        this.inicializar();
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        console.log('💰 Inicializando sistema de pontos...');
        
        // 1. Configurar inputs da interface
        this.configurarInputs();
        
        // 2. Carregar dados salvos
        this.carregarDadosSalvos();
        
        // 3. Configurar eventos
        this.configurarEventos();
        
        // 4. Inicializar interface
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Sistema de pontos inicializado');
    }
    
    // ===========================================
    // CONFIGURAÇÃO DA INTERFACE
    // ===========================================
    
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
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (inputLimitePeculiaridades) {
            inputLimitePeculiaridades.value = this.limites.peculiaridades;
            inputLimitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        // Escutar eventos de outras abas
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('atributos', e.detail.pontosGastos);
            }
        });
        
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('vantagens', e.detail.pontosGastos);
            }
        });
        
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('desvantagens', e.detail.pontosGastos);
            }
        });
        
        // Escutar mudanças no Firebase
        if (window.sistemaSalvamento) {
            document.addEventListener('dadosCarregados', (e) => {
                if (e.detail && e.detail.pontos) {
                    this.carregarDadosExternos(e.detail.pontos);
                }
            });
        }
    }
    
    // ===========================================
    // GERENCIAMENTO DE PONTOS
    // ===========================================
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        const gastosTotais = Object.values(this.gastos).reduce((a, b) => a + b, 0);
        
        // Desvantagens e peculiaridades ADICIONAM pontos (são negativos)
        const desvantagensPositivas = Math.abs(this.gastos.desvantagens);
        const peculiaridadesPositivas = Math.abs(this.gastos.peculiaridades);
        
        const pontosDisponiveis = totalPontos - gastosTotais;
        
        return {
            total: totalPontos,
            gastos: gastosTotais,
            disponiveis: pontosDisponiveis,
            limiteDesvantagens: desvantagensPositivas <= this.limites.desvantagens,
            limitePeculiaridades: peculiaridadesPositivas <= this.limites.peculiaridades,
            excedeuLimiteDesvantagens: desvantagensPositivas > this.limites.desvantagens,
            excedeuLimitePeculiaridades: peculiaridadesPositivas > this.limites.peculiaridades
        };
    }
    
    atualizarGastosAba(aba, pontos) {
        const pontosAnteriores = this.gastos[aba] || 0;
        
        if (pontosAnteriores !== pontos) {
            this.gastos[aba] = pontos;
            console.log(`💰 ${aba}: ${pontosAnteriores} → ${pontos} pontos`);
            
            // Atualizar interface
            this.atualizarDisplayAba(aba);
            this.atualizarTotais();
            this.verificarLimites();
            
            // Salvar dados
            this.salvarDados();
            
            // Disparar evento
            this.dispararEventoAtualizacao(aba, pontos);
        }
    }
    
    atualizarPontosAba(aba, diferenca) {
        const pontosAtuais = this.gastos[aba] || 0;
        const novosPontos = pontosAtuais + diferenca;
        
        this.atualizarGastosAba(aba, novosPontos);
        return novosPontos;
    }
    
    // ===========================================
    // ATUALIZAÇÃO DA INTERFACE
    // ===========================================
    
    atualizarTudo() {
        // Atualizar cada aba
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        // Atualizar totais e limites
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (elemento) {
            const pontos = this.gastos[aba];
            
            // Formatar pontos (negativos com sinal)
            let texto = pontos >= 0 ? `+${pontos}` : `${pontos}`;
            elemento.textContent = texto;
            
            // Aplicar classe correta
            elemento.parentElement.classList.remove('positivo', 'negativo', 'alerta');
            
            if (pontos > 0) {
                elemento.parentElement.classList.add('positivo');
            } else if (pontos < 0) {
                elemento.parentElement.classList.add('negativo');
            }
        }
        
        // Atualizar percentual
        this.atualizarPercentualAba(aba);
    }
    
    atualizarPercentualAba(aba) {
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba];
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((Math.abs(pontos) / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Aplicar cor baseada no percentual
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else {
                elemento.style.color = '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            // Aplicar estilo se negativo
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else {
                elementoDisponiveis.style.color = '';
                elementoDisponiveis.style.fontWeight = '';
            }
        }
        
        // Total gastos
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.gastos;
        }
    }
    
    verificarLimites() {
        const desvantagensPositivas = Math.abs(this.gastos.desvantagens);
        const peculiaridadesPositivas = Math.abs(this.gastos.peculiaridades);
        
        // Desvantagens
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (desvantagensPositivas / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${desvantagensPositivas}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
            
            // Aviso se excedeu
            if (desvantagensPositivas > this.limites.desvantagens) {
                this.mostrarAviso(`Limite de desvantagens excedido! (${desvantagensPositivas}/${this.limites.desvantagens})`);
            }
        }
        
        // Peculiaridades
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (peculiaridadesPositivas / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${peculiaridadesPositivas}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
            
            // Aviso se excedeu
            if (peculiaridadesPositivas > this.limites.peculiaridades) {
                this.mostrarAviso(`Limite de peculiaridades excedido! (${peculiaridadesPositivas}/${this.limites.peculiaridades})`);
            }
        }
    }
    
    // ===========================================
    // SALVAMENTO E CARREGAMENTO
    // ===========================================
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        // Salvar no sistema de salvamento
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            // Fallback para localStorage
            localStorage.setItem('rpgforge_pontos', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        // Tentar carregar do sistema de salvamento
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        // Se não encontrou, tentar localStorage
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    console.error('Erro ao carregar pontos do localStorage:', error);
                }
            }
        }
        
        // Aplicar dados se encontrou
        if (dados) {
            this.aplicarDados(dados);
            console.log('💰 Pontos carregados com sucesso');
        }
    }
    
    carregarDadosExternos(dadosExternos) {
        if (dadosExternos) {
            this.aplicarDados(dadosExternos);
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
            Object.keys(dados.gastos).forEach(aba => {
                if (this.gastos[aba] !== undefined) {
                    this.gastos[aba] = dados.gastos[aba];
                }
            });
        }
        
        if (dados.limites) {
            Object.keys(dados.limites).forEach(limite => {
                if (this.limites[limite] !== undefined) {
                    this.limites[limite] = dados.limites[limite];
                    
                    const input = document.getElementById(`limite${this.capitalizar(limite)}`);
                    if (input) input.value = this.limites[limite];
                }
            });
        }
        
        this.atualizarTudo();
    }
    
    // ===========================================
    // UTILITÁRIOS
    // ===========================================
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    mostrarAviso(mensagem) {
        // Mostrar aviso temporário
        const aviso = document.createElement('div');
        aviso.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
            font-weight: bold;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
        }, 5000);
    }
    
    dispararEventoAtualizacao(aba, pontos) {
        const evento = new CustomEvent('pontosAtualizados', {
            detail: {
                aba: aba,
                pontos: pontos,
                totais: this.calcularPontosDisponiveis(),
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(evento);
    }
    
    // ===========================================
    // API PÚBLICA PARA OUTROS MÓDULOS
    // ===========================================
    
    obterGastosAba(aba) {
        return this.gastos[aba] || 0;
    }
    
    obterLimiteAba(aba) {
        return this.limites[aba] || 0;
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    registrarCallback(aba, callback) {
        this.callbacks.set(aba, callback);
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// ===========================================
// FUNÇÕES GLOBAIS PARA OUTROS MÓDULOS
// ===========================================

window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        return pontosManager.atualizarGastosAba(aba, pontos);
    }
    return false;
};

window.obterGastosAba = (aba) => {
    if (pontosManager) {
        return pontosManager.obterGastosAba(aba);
    }
    return 0;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterPontosDisponiveis();
    }
    return 150;
};

// ===========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar quando a aba principal estiver ativa
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 1000);
    }
    
    // Inicializar quando a tab principal for ativada
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab') && e.target.closest('.tab').dataset.tab === 'principal') {
            setTimeout(() => {
                if (!pontosManager) {
                    inicializarPontosManager();
                }
            }, 500);
        }
    });
});

console.log('✅ pontos-manager.js carregado - SISTEMA CENTRALIZADO');