// ===========================================
// PONTOS-MANAGER.JS - VERSÃO COMPLETA QUE FUNCIONA
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
        
        // SISTEMA SEPARADO PARA SOMAR DESVANTAGENS
        this.contadoresDesvantagens = {
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
        this.carregarDadosSalvos();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Pontos Manager - FUNCIONANDO!');
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
        // ATRIBUTOS - FUNCIONA NORMAL
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplayAba('atributos');
                this.atualizarTotais();
                this.salvarDados();
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS - ARMAZENA SEPARADO
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                const pontos = Math.abs(e.detail.pontosGastos); // Converte -5 para 5
                this.contadoresDesvantagens.caracteristicasFisicas = pontos;
                this.somarDesvantagensTotais();
                this.salvarDados();
                console.log('🏃 Características físicas:', pontos, 'pts');
            }
        });
        
        // RIQUEZA - ATUALIZA O EVENTO
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Rico: +20)
                    this.gastos.vantagens = pontos;
                    this.atualizarDisplayAba('vantagens');
                    this.atualizarTotais();
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15) - ARMAZENA SEPARADO
                    this.contadoresDesvantagens.riqueza = Math.abs(pontos); // Converte -15 para 15
                    this.somarDesvantagensTotais();
                } else {
                    // NEUTRO (Médio: 0)
                    this.contadoresDesvantagens.riqueza = 0;
                    this.somarDesvantagensTotais();
                }
                
                this.salvarDados();
                console.log('💰 Riqueza:', pontos, 'pts');
            }
        });
        
        // OUTROS SISTEMAS
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
    
    // FUNÇÃO NOVA: SOMA TODAS AS DESVANTAGENS
    somarDesvantagensTotais() {
        const total = this.contadoresDesvantagens.caracteristicasFisicas + 
                     this.contadoresDesvantagens.riqueza;
        
        this.gastos.desvantagens = total;
        this.atualizarDisplayAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
        
        console.log('➕ Desvantagens totais:', total, 'pts');
        console.log('   - Características físicas:', this.contadoresDesvantagens.caracteristicasFisicas, 'pts');
        console.log('   - Riqueza:', this.contadoresDesvantagens.riqueza, 'pts');
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
            disponiveis: pontosDisponiveis,
            totalDesvantagensAbs: desvantagensTotal,
            peculiaridadesAbs: Math.abs(this.gastos.peculiaridades || 0)
        };
    }
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
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
    
    atualizarTudo() {
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else {
                elementoDisponiveis.style.color = '';
                elementoDisponiveis.style.fontWeight = '';
            }
        }
        
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (calculo.totalDesvantagensAbs / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${calculo.totalDesvantagensAbs}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
        }
        
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (calculo.peculiaridadesAbs / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${calculo.peculiaridadesAbs}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            contadoresDesvantagens: { ...this.contadoresDesvantagens },
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
        
        if (dados.contadoresDesvantagens) {
            Object.assign(this.contadoresDesvantagens, dados.contadoresDesvantagens);
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
    
    obterGastosAba(aba) {
        return this.gastos[aba] || 0;
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    // NOVO: Função para testar
    testarSistema() {
        console.log('🧪 TESTANDO SISTEMA:');
        
        // Testa atributos
        document.dispatchEvent(new CustomEvent('atributosAtualizados', {
            detail: { pontosGastos: 15 }
        }));
        
        // Testa características físicas
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
                detail: { pontosGastos: -5 }
            }));
            
            // Testa riqueza
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: -10 }
                }));
                
                // Verifica resultado
                setTimeout(() => {
                    const calculo = this.calcularPontosDisponiveis();
                    console.log('📊 RESULTADO:');
                    console.log('- Atributos: 15 pts');
                    console.log('- Desvantagens: 5 + 10 = 15 pts');
                    console.log('- Disponível: 150 - 15 + 15 = 150 pts');
                    console.log('- Disponível real:', calculo.disponiveis, 'pts');
                    
                    if (calculo.desvantagens === 15 && calculo.disponiveis === 150) {
                        console.log('✅ SISTEMA FUNCIONANDO!');
                    }
                }, 200);
            }, 200);
        }, 200);
    }
}

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Funções globais
window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        if (aba === 'desvantagens' || aba === 'vantagens') {
            console.log('⚠️ Use eventos em vez de atualizarPontosAba para desvantagens/vantagens');
            return false;
        }
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

window.testarSistemaPontos = () => {
    if (pontosManager) {
        pontosManager.testarSistema();
    } else {
        inicializarPontosManager();
        setTimeout(() => {
            pontosManager.testarSistema();
        }, 100);
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 500);
    }
    
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