// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL COMPLETA E FUNCIONAL
// Sistema que soma desvantagens corretamente mantendo funcionalidade existente
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Sistema original (para compatibilidade)
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
        
        // Sistema separado para não sobrescrever
        this.fontesSeparadas = {
            desvantagens: {
                caracteristicasFisicas: 0,   // Magro: -5, Gordo: -3
                riqueza: 0,                  // Pobre: -15, Batalhador: -10
                outras: 0
            },
            vantagens: {
                riqueza: 0,                  // Confortável: +10, Rico: +20
                outras: 0
            }
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
        // ATRIBUTOS (funciona normalmente)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplayAba('atributos');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS (soma nas desvantagens)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                const pontos = Math.abs(e.detail.pontosGastos); // Converte para positivo
                this.fontesSeparadas.desvantagens.caracteristicasFisicas = pontos;
                
                // Atualiza o total de desvantagens
                this.recalcularDesvantagensTotais();
                this.salvarDados();
            }
        });
        
        // RIQUEZA (pode ser vantagem ou desvantagem)
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM
                    this.fontesSeparadas.vantagens.riqueza = pontos;
                    this.fontesSeparadas.desvantagens.riqueza = 0;
                    
                    // Atualiza vantagens
                    this.recalcularVantagensTotais();
                } else if (pontos < 0) {
                    // É DESVANTAGEM
                    this.fontesSeparadas.desvantagens.riqueza = Math.abs(pontos);
                    this.fontesSeparadas.vantagens.riqueza = 0;
                    
                    // Atualiza desvantagens
                    this.recalcularDesvantagensTotais();
                } else {
                    // NEUTRO
                    this.fontesSeparadas.vantagens.riqueza = 0;
                    this.fontesSeparadas.desvantagens.riqueza = 0;
                    
                    this.recalcularVantagensTotais();
                    this.recalcularDesvantagensTotais();
                }
                
                this.salvarDados();
            }
        });
        
        // OUTRAS ABASTECIDAS (para compatibilidade)
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
        
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.tecnicas = e.detail.pontosGastos;
                this.atualizarDisplayAba('tecnicas');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.magia = e.detail.pontosGastos;
                this.atualizarDisplayAba('magia');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
    }
    
    recalcularDesvantagensTotais() {
        // SOMA todas as fontes de desvantagens
        const total = 
            this.fontesSeparadas.desvantagens.caracteristicasFisicas +
            this.fontesSeparadas.desvantagens.riqueza +
            this.fontesSeparadas.desvantagens.outras;
        
        // Atualiza o sistema original
        this.gastos.desvantagens = total;
        
        // Atualiza display
        this.atualizarDisplayAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    recalcularVantagensTotais() {
        // SOMA todas as fontes de vantagens
        const total = 
            this.fontesSeparadas.vantagens.riqueza +
            this.fontesSeparadas.vantagens.outras;
        
        // Atualiza o sistema original
        this.gastos.vantagens = total;
        
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
        
        // Cálculo final
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarTudo() {
        // Atualiza todas as abas
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
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            // Estilo baseado no saldo
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
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const peculiaridadesAtual = Math.abs(this.gastos.peculiaridades || 0);
            const percentual = Math.min(100, (peculiaridadesAtual / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${peculiaridadesAtual}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            fontesSeparadas: { ...this.fontesSeparadas },
            limites: { ...this.limites }
        };
        
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            localStorage.setItem('rpgforge_pontos_corrigido', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos_corrigido');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    console.error('Erro ao carregar pontos:', error);
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
        
        if (dados.fontesSeparadas) {
            Object.keys(dados.fontesSeparadas.desvantagens || {}).forEach(fonte => {
                if (this.fontesSeparadas.desvantagens[fonte] !== undefined) {
                    this.fontesSeparadas.desvantagens[fonte] = dados.fontesSeparadas.desvantagens[fonte];
                }
            });
            
            Object.keys(dados.fontesSeparadas.vantagens || {}).forEach(fonte => {
                if (this.fontesSeparadas.vantagens[fonte] !== undefined) {
                    this.fontesSeparadas.vantagens[fonte] = dados.fontesSeparadas.vantagens[fonte];
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
            font-weight: bold;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
        }, 3000);
    }
    
    // Funções públicas
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    obterDesvantagensTotais() {
        return this.calcularPontosDisponiveis().desvantagens;
    }
}

// ==================== INSTANCIAÇÃO GLOBAL ====================

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Funções de compatibilidade global
window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        pontosManager.gastos[aba] = pontos;
        pontosManager.atualizarDisplayAba(aba);
        pontosManager.atualizarTotais();
        pontosManager.salvarDados();
        return true;
    }
    return false;
};

window.obterGastosAba = (aba) => {
    if (pontosManager) {
        return pontosManager.gastos[aba] || 0;
    }
    return 0;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterPontosDisponiveis();
    }
    return 150;
};

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa quando a aba principal está ativa
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 500);
    }
    
    // Reage a mudanças de tab
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(() => {
                if (!pontosManager) {
                    inicializarPontosManager();
                }
            }, 500);
        }
    });
});

// ==================== TESTES ====================

function testarSistema() {
    console.log('=== TESTANDO SISTEMA CORRIGIDO ===');
    
    // 1. Inicializa o sistema
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 2. Testa atributos (deve aparecer no card)
    console.log('Testando atributos (+15)');
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    // 3. Testa características físicas (Magro: -5)
    console.log('Testando características físicas (Magro: -5)');
    document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
        detail: { pontosGastos: -5 }
    }));
    
    // 4. Testa riqueza (Batalhador: -10)
    console.log('Testando riqueza (Batalhador: -10)');
    document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
        detail: { pontos: -10 }
    }));
    
    // 5. Verifica resultado
    setTimeout(() => {
        if (pontosManager) {
            const calculo = pontosManager.calcularPontosDisponiveis();
            console.log('RESULTADO:');
            console.log('- Vantagens:', calculo.vantagens, 'pontos');
            console.log('- Desvantagens:', calculo.desvantagens, 'pontos');
            console.log('- Disponível:', calculo.disponiveis, 'pontos');
            console.log('Esperado: 150 - 15 + (5+10) = 150 pontos');
        }
    }, 100);
}

// Exporta para testes
window.testarSistema = testarSistema;