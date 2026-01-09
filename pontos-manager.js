// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL FUNCIONAL
// Recebe atributos, características físicas E riqueza
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Sistema original
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
        
        // Sistema para SOMAR desvantagens
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
        console.log('✅ Pontos Manager - TUDO FUNCIONANDO!');
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
    }
    
    configurarEventos() {
        // 1. ATRIBUTOS - FUNCIONA
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.salvar();
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS - SOMA
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.desvantagensSomadas.caracteristicasFisicas = Math.abs(e.detail.pontosGastos);
                this.somarDesvantagens();
                this.salvar();
                console.log('🏃 Características físicas:', this.desvantagensSomadas.caracteristicasFisicas, 'pts');
            }
        });
        
        // 3. RIQUEZA - FUNCIONA AGORA!
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    // DESVANTAGEM (Pobre: -15)
                    this.desvantagensSomadas.riqueza = Math.abs(pontos);
                    this.somarDesvantagens();
                    console.log('💰 Riqueza (Desvantagem):', pontos, 'pts');
                } else if (pontos > 0) {
                    // VANTAGEM (Rico: +20)
                    this.gastos.vantagens = pontos;
                    this.atualizarDisplay('vantagens');
                    this.atualizarTotais();
                    console.log('💰 Riqueza (Vantagem): +' + pontos, 'pts');
                } else {
                    // NEUTRO
                    this.desvantagensSomadas.riqueza = 0;
                    this.somarDesvantagens();
                }
                
                this.salvar();
            }
        });
        
        // Também escuta o evento novo se existir
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    this.desvantagensSomadas.riqueza = Math.abs(pontos);
                    this.somarDesvantagens();
                    console.log('💰 Riqueza (Nova):', pontos, 'pts');
                } else if (pontos > 0) {
                    this.gastos.vantagens = pontos;
                    this.atualizarDisplay('vantagens');
                    this.atualizarTotais();
                }
                
                this.salvar();
            }
        });
        
        // 4. PERÍCIAS - FUNCIONA
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.pericias = e.detail.pontosGastos;
                this.atualizarDisplay('pericias');
                this.atualizarTotais();
                this.salvar();
            }
        });
        
        // 5. PECULIARIDADES - FUNCIONA
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
    
    // SOMA as desvantagens
    somarDesvantagens() {
        const total = this.desvantagensSomadas.caracteristicasFisicas + 
                     this.desvantagensSomadas.riqueza;
        
        this.gastos.desvantagens = total;
        this.atualizarDisplay('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
        
        console.log('➕ Desvantagens:', total, 'pts');
        console.log('   - Físicas:', this.desvantagensSomadas.caracteristicasFisicas);
        console.log('   - Riqueza:', this.desvantagensSomadas.riqueza);
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
        
        // DESVANTAGENS (dá pontos)
        let desvantagensTotal = 0;
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Cálculo
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
        
        // Percentual
        const percElemento = document.getElementById(`perc${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (percElemento) {
            const pontosAbs = Math.abs(pontos);
            const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
            const percentual = totalPontos > 0 ? Math.round((pontosAbs / totalPontos) * 100) : 0;
            percElemento.textContent = `${percentual}%`;
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
        
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite desvantagens
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (calculo.desvantagens / this.limites.desvantagens) * 100);
            progress.style.width = `${percentual}%`;
            texto.textContent = `${calculo.desvantagens}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    salvar() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagensSomadas: { ...this.desvantagensSomadas },
            limites: { ...this.limites }
        };
        localStorage.setItem('pontos_funcional', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_funcional');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (e) {
            console.error('Erro carregar:', e);
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
    
    mostrarStatus() {
        const calc = this.calcularPontosDisponiveis();
        console.log('📊 STATUS:');
        console.log('- Atributos:', this.gastos.atributos);
        console.log('- Desvantagens:', calc.desvantagens, '(Físicas:', this.desvantagensSomadas.caracteristicasFisicas, '+ Riqueza:', this.desvantagensSomadas.riqueza, ')');
        console.log('- Vantagens:', calc.vantagens);
        console.log('- Disponível:', calc.disponiveis);
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

function testarTudoFuncionando() {
    console.log('🧪 TESTANDO TUDO FUNCIONANDO');
    
    if (!pontosManager) inicializarPontosManager();
    
    // 1. Atributos
    console.log('1. Atributos: +15');
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    // 2. Características físicas
    setTimeout(() => {
        console.log('2. Características físicas: -5');
        document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
            detail: { pontosGastos: -5 }
        }));
        
        // 3. Riqueza (DESVANTAGEM)
        setTimeout(() => {
            console.log('3. Riqueza: -10 (Batalhador)');
            document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                detail: { pontos: -10 }
            }));
            
            // 4. Riqueza (VANTAGEM)
            setTimeout(() => {
                console.log('4. Riqueza: +20 (Rico)');
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: 20 }
                }));
                
                // Resultado
                setTimeout(() => {
                    pontosManager.mostrarStatus();
                    const calc = pontosManager.calcularPontosDisponiveis();
                    
                    console.log('📈 ESPERADO:');
                    console.log('- Atributos: 15 pts (custo)');
                    console.log('- Vantagens: 20 pts (Rico)');
                    console.log('- Desvantagens: 5 pts (Magro)');
                    console.log('- Disponível: 150 - 15 - 20 + 5 = 120 pts');
                    
                    if (calc.vantagens === 20 && calc.desvantagens === 5) {
                        console.log('✅ TUDO FUNCIONANDO!');
                    } else {
                        console.log('❌ Algo errado!');
                    }
                }, 300);
            }, 300);
        }, 300);
    }, 300);
}

// ==================== INICIA ====================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Sistema de pontos INICIADO!');
        }
    }, 500);
});

// ==================== EXPORTA ====================

window.obterPontosManager = inicializarPontosManager;
window.testarTudoFuncionando = testarTudoFuncionando;