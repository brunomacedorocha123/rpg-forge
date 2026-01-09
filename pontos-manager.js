// ===========================================
// PONTOS-MANAGER.JS - VERSÃO CORRIGIDA E COMPLETA
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Gastos por categoria
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
        
        // Sistema de fontes para desvantagens (PARA RESOLVER O PROBLEMA)
        this.fontesDesvantagens = {
            riqueza: 0,
            caracteristicas_fisicas: 0,
            outras: 0
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
        this.carregarDadosSalvos();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
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
        // Atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('atributos', e.detail.pontosGastos);
            }
        });
        
        // Vantagens (sistema normal)
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('vantagens', e.detail.pontosGastos);
            }
        });
        
        // PERIGO: Sistema de riqueza ANTIGO (remove este ou ajuste)
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // Vantagem
                    this.atualizarGastosAba('vantagens', pontos);
                } else if (pontos < 0) {
                    // Desvantagem - USAR NOVO SISTEMA
                    this.atualizarFonteDesvantagem('riqueza', Math.abs(pontos));
                }
                // Se 0, não faz nada
            }
        });
        
        // Características Físicas (usar novo sistema)
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.atualizarFonteDesvantagem('caracteristicas_fisicas', Math.abs(e.detail.pontos));
            }
        });
    }
    
    // NOVO MÉTODO: Atualizar fonte específica de desvantagens
    atualizarFonteDesvantagem(fonte, pontos) {
        // Atualiza a fonte específica
        this.fontesDesvantagens[fonte] = pontos || 0;
        
        // Recalcula TOTAL de desvantagens
        let totalDesvantagens = 0;
        Object.values(this.fontesDesvantagens).forEach(valor => {
            totalDesvantagens += valor;
        });
        
        // Atualiza o display
        this.gastos.desvantagens = totalDesvantagens;
        this.atualizarDisplayAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
        this.salvarDados();
        
        console.log(`Desvantagens atualizadas: ${totalDesvantagens}pts (${fonte}: ${pontos}pts)`);
    }
    
    atualizarGastosAba(aba, pontos) {
        const pontosAnteriores = this.gastos[aba] || 0;
        
        if (pontosAnteriores !== pontos) {
            this.gastos[aba] = pontos;
            
            this.atualizarDisplayAba(aba);
            this.atualizarTotais();
            this.verificarLimites();
            
            this.salvarDados();
            
            this.dispararEventoAtualizacao(aba, pontos);
        }
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS: soma tudo que custa pontos (valores positivos)
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS: usa o valor calculado (que é a soma das fontes)
        let desvantagensTotal = this.gastos.desvantagens || 0;
        
        // Cálculo final: pontos iniciais - vantagens + desvantagens
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarTudo() {
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        
        elemento.textContent = pontos;
        
        // Limpa classes anteriores
        elemento.parentElement.classList.remove('positivo', 'negativo');
        
        // Aplica classes baseadas no tipo
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            elemento.parentElement.classList.add('negativo');
        } else if (pontos > 0) {
            elemento.parentElement.classList.add('positivo');
        } else if (pontos < 0) {
            elemento.parentElement.classList.add('negativo');
        }
        
        this.atualizarPercentualAba(aba);
    }
    
    atualizarPercentualAba(aba) {
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = Math.abs(this.gastos[aba] || 0);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontos / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Cores baseadas no percentual
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
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (calculo.disponiveis > 0) {
                elementoDisponiveis.style.color = '#27ae60';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else {
                elementoDisponiveis.style.color = '';
                elementoDisponiveis.style.fontWeight = '';
            }
        }
        
        // Pontos gastos (só vantagens)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
            
            if (calculo.vantagens > (this.pontosIniciais * 0.8)) {
                elementoGastos.style.color = '#f39c12';
            } else {
                elementoGastos.style.color = '';
            }
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
            
            // Aviso se ultrapassar
            if (calculo.desvantagens > this.limites.desvantagens) {
                this.mostrarAviso(`Limite de desvantagens excedido! (${calculo.desvantagens}/${this.limites.desvantagens}pts)`);
            }
        }
        
        // Limite de peculiaridades
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const peculiaridades = Math.abs(this.gastos.peculiaridades || 0);
            const percentual = Math.min(100, (peculiaridades / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${peculiaridades}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            fontesDesvantagens: { ...this.fontesDesvantagens },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            localStorage.setItem('rpgforge_pontos', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    console.error('Erro ao carregar dados de pontos:', error);
                    return;
                }
            }
        }
        
        if (dados) {
            this.aplicarDados(dados);
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
        
        if (dados.fontesDesvantagens) {
            Object.keys(dados.fontesDesvantagens).forEach(fonte => {
                if (this.fontesDesvantagens[fonte] !== undefined) {
                    this.fontesDesvantagens[fonte] = dados.fontesDesvantagens[fonte];
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
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    mostrarAviso(mensagem) {
        // Remove avisos antigos
        const avisosAntigos = document.querySelectorAll('.aviso-pontos');
        avisosAntigos.forEach(aviso => aviso.remove());
        
        const aviso = document.createElement('div');
        aviso.className = 'aviso-pontos';
        aviso.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
            animation: fadeIn 0.3s ease;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) {
                aviso.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => aviso.parentNode.removeChild(aviso), 300);
            }
        }, 3000);
    }
    
    dispararEventoAtualizacao(aba, pontos) {
        const evento = new CustomEvent('pontosAtualizados', {
            detail: {
                aba: aba,
                pontos: pontos,
                totais: this.calcularPontosDisponiveis()
            }
        });
        document.dispatchEvent(evento);
    }
    
    obterGastosAba(aba) {
        return this.gastos[aba] || 0;
    }
    
    obterLimiteAba(aba) {
        return this.limites[aba] || 0;
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    // Métodos para outras partes do sistema acessarem
    obterTotalDesvantagens() {
        return this.gastos.desvantagens || 0;
    }
    
    obterDesvantagensPorFonte() {
        return { ...this.fontesDesvantagens };
    }
}

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Funções globais para acesso
window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        pontosManager.atualizarGastosAba(aba, pontos);
        return true;
    }
    return false;
};

window.atualizarFonteDesvantagem = (fonte, pontos) => {
    if (pontosManager) {
        pontosManager.atualizarFonteDesvantagem(fonte, pontos);
        return true;
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 300);
    }
    
    // Monitorar troca de abas
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(() => {
                if (!pontosManager) {
                    inicializarPontosManager();
                }
            }, 300);
        }
    });
});

// Adicionar estilos CSS para animações
if (!document.querySelector('#estilos-pontos')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilos-pontos';
    estilo.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
        .aviso-pontos {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
        }
    `;
    document.head.appendChild(estilo);
}