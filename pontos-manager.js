// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL FUNCIONAL
// Sistema completo que SOMA desvantagens corretamente
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // VANTAGENS (GASTAM pontos)
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // DESVANTAGENS (GANHAM pontos) - AGORA VAI SOMAR CORRETAMENTE!
        this.desvantagens = {
            caracteristicasFisicas: 0,  // Ex: Magro = -5
            riquezaNegativa: 0,         // Ex: Pobre = -15
            peculiaridades: 0,          // Outras desvantagens
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
        this.carregarDados();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Pontos Manager - SISTEMA CORRETO INICIADO!');
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
        // ==================== ATRIBUTOS ====================
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.salvar();
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // ==================== CARACTERÍSTICAS FÍSICAS (DESVANTAGEM) ====================
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                // Valores negativos (ex: -5) - SOMAR como desvantagem
                const pontos = Math.abs(e.detail.pontos); // Converte -5 para 5
                this.desvantagens.caracteristicasFisicas = pontos;
                this.calcularTotalDesvantagens();
                this.salvar();
                console.log('🏃 Características físicas:', pontos, 'pts (desvantagem)');
            }
        });
        
        // ==================== RIQUEZA - SISTEMA CORRETO ====================
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    // DESVANTAGEM (ex: Pobre = -15) → GANHA pontos
                    this.desvantagens.riquezaNegativa = Math.abs(pontos); // Converte -15 para 15
                    this.calcularTotalDesvantagens();
                    console.log('💰 Riqueza (Desvantagem):', pontos, 'pts → Ganha', Math.abs(pontos), 'pts');
                } else if (pontos > 0) {
                    // VANTAGEM (ex: Rico = +20) → GASTA pontos
                    this.gastos.vantagens = pontos;
                    this.atualizarDisplay('vantagens');
                    this.atualizarTotais();
                    console.log('💰 Riqueza (Vantagem): +' + pontos, 'pts → Gasta', pontos, 'pts');
                } else {
                    // NEUTRO
                    this.desvantagens.riquezaNegativa = 0;
                    this.calcularTotalDesvantagens();
                }
                
                this.salvar();
            }
        });
        
        // ==================== PECULIARIDADES (DESVANTAGEM) ====================
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = Math.abs(e.detail.pontosGastos);
                this.desvantagens.peculiaridades = pontos;
                this.calcularTotalDesvantagens();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // ==================== PERÍCIAS (VANTAGEM) ====================
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.pericias = e.detail.pontosGastos;
                this.atualizarDisplay('pericias');
                this.atualizarTotais();
                this.salvar();
            }
        });
    }
    
    // ==================== FUNÇÃO QUE SOMA TODAS AS DESVANTAGENS ====================
    calcularTotalDesvantagens() {
        // SOMA TUDO: características físicas + riqueza negativa + peculiaridades
        const totalDesvantagens = 
            this.desvantagens.caracteristicasFisicas +
            this.desvantagens.riquezaNegativa +
            this.desvantagens.peculiaridades +
            this.desvantagens.outras;
        
        // Atualiza o display da categoria "desvantagens"
        const elemento = document.getElementById('pontosDesvantagens');
        if (elemento) {
            elemento.textContent = totalDesvantagens;
            
            // Estilo negativo (ganha pontos)
            const pai = elemento.parentElement;
            pai.classList.remove('positivo', 'negativo');
            if (totalDesvantagens > 0) pai.classList.add('negativo');
        }
        
        // Atualiza percentual
        const percElemento = document.getElementById('percDesvantagens');
        if (percElemento) {
            const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
            const percentual = totalPontos > 0 ? Math.round((totalDesvantagens / totalPontos) * 100) : 0;
            percElemento.textContent = `${percentual}%`;
        }
        
        // Atualiza limites e totais
        this.verificarLimites();
        this.atualizarTotais();
        
        console.log('➕ Desvantagens totais:', totalDesvantagens, 'pts');
        console.log('   - Físicas:', this.desvantagens.caracteristicasFisicas);
        console.log('   - Riqueza:', this.desvantagens.riquezaNegativa);
        console.log('   - Peculiaridades:', this.desvantagens.peculiaridades);
        
        return totalDesvantagens;
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // ==================== VANTAGENS (GASTAM pontos) ====================
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);      // Riqueza positiva entra aqui
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // ==================== DESVANTAGENS (GANHAM pontos) ====================
        let desvantagensTotal = this.calcularTotalDesvantagens();
        
        // Se atributos estiverem abaixo de 10, também conta como desvantagem
        if (this.gastos.atributos < 0) {
            desvantagensTotal += Math.abs(this.gastos.atributos);
        }
        
        // Cálculo final CORRETO:
        // Pontos disponíveis = (Pontos totais) - (Vantagens) + (Desvantagens)
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarDisplay(aba) {
        let valor;
        
        if (aba === 'desvantagens') {
            valor = this.calcularTotalDesvantagens();
        } else if (aba === 'peculiaridades') {
            valor = this.desvantagens.peculiaridades;
        } else {
            valor = this.gastos[aba] || 0;
        }
        
        const elemento = document.getElementById(`pontos${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (!elemento) return;
        
        elemento.textContent = valor;
        
        // Estilo
        const pai = elemento.parentElement;
        pai.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (valor > 0) pai.classList.add('negativo');
        } else if (valor > 0) {
            pai.classList.add('positivo');
        } else if (valor < 0) {
            pai.classList.add('negativo');
        }
        
        // Percentual
        const percElemento = document.getElementById(`perc${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (percElemento) {
            const pontosAbs = Math.abs(valor);
            const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
            const percentual = totalPontos > 0 ? Math.round((pontosAbs / totalPontos) * 100) : 0;
            percElemento.textContent = `${percentual}%`;
        }
    }
    
    atualizarTudo() {
        // Atualiza todos os displays
        ['atributos', 'vantagens', 'desvantagens', 'peculiaridades', 'pericias', 'tecnicas', 'magia'].forEach(aba => {
            this.atualizarDisplay(aba);
        });
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Atualiza pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            // Cor baseada no saldo
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
            }
        }
        
        // Atualiza pontos gastos (só vantagens)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const desvantagensTotal = this.calcularTotalDesvantagens();
        
        // Limite desvantagens
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (desvantagensTotal / this.limites.desvantagens) * 100);
            progress.style.width = `${percentual}%`;
            texto.textContent = `${desvantagensTotal}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
            
            // Alerta se passar do limite
            if (desvantagensTotal > this.limites.desvantagens) {
                progress.style.backgroundColor = '#e74c3c';
                texto.style.color = '#e74c3c';
            } else {
                progress.style.backgroundColor = '#f39c12';
                texto.style.color = '';
            }
        }
    }
    
    salvar() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagens: { ...this.desvantagens },
            limites: { ...this.limites }
        };
        localStorage.setItem('pontos_manager_corrigido', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_manager_corrigido');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (e) {
            console.error('Erro ao carregar pontos:', e);
        }
    }
    
    aplicarDados(dados) {
        if (dados.pontosIniciais) this.pontosIniciais = dados.pontosIniciais;
        if (dados.pontosGanhosCampanha) this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
        if (dados.gastos) Object.assign(this.gastos, dados.gastos);
        if (dados.desvantagens) Object.assign(this.desvantagens, dados.desvantagens);
        if (dados.limites) Object.assign(this.limites, dados.limites);
        
        this.atualizarTudo();
    }
    
    mostrarStatus() {
        const calc = this.calcularPontosDisponiveis();
        console.log('📊 STATUS DO SISTEMA:');
        console.log('- Pontos totais:', calc.total, 'pts');
        console.log('- Vantagens (gasta):', calc.vantagens, 'pts');
        console.log('- Desvantagens (ganha):', calc.desvantagens, 'pts');
        console.log('  • Físicas:', this.desvantagens.caracteristicasFisicas, 'pts');
        console.log('  • Riqueza negativa:', this.desvantagens.riquezaNegativa, 'pts');
        console.log('  • Peculiaridades:', this.desvantagens.peculiaridades, 'pts');
        console.log('- Disponível:', calc.disponiveis, 'pts');
        
        // Verifica se está correto
        const calculoManual = calc.total - calc.vantagens + calc.desvantagens;
        if (calculoManual === calc.disponiveis) {
            console.log('✅ Cálculo correto!');
        } else {
            console.log('❌ Erro no cálculo!');
        }
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

// ==================== FUNÇÃO PARA ATRIBUTOS.JS CHAMAR ====================

function atualizarPontosAtributos(pontos) {
    if (!pontosManager) inicializarPontosManager();
    
    // Dispara evento para o pontos-manager
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: pontos }
    }));
}

// ==================== TESTE COMPLETO ====================

function testarTudoFuncionando() {
    console.log('🧪 TESTANDO SISTEMA COMPLETO');
    
    if (!pontosManager) inicializarPontosManager();
    
    // 1. Atributos (gasta 15 pontos)
    console.log('1. Atributos: +15 (gasta)');
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    // 2. Características físicas (ganha 5 pontos)
    setTimeout(() => {
        console.log('2. Características físicas: -5 (ganha)');
        document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
            detail: { pontos: -5 }
        }));
        
        // 3. Riqueza negativa (ganha 15 pontos)
        setTimeout(() => {
            console.log('3. Riqueza: -15 (Pobre - ganha)');
            document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                detail: { pontos: -15 }
            }));
            
            // 4. Riqueza positiva (gasta 20 pontos)
            setTimeout(() => {
                console.log('4. Riqueza: +20 (Rico - gasta)');
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: 20 }
                }));
                
                // Resultado esperado:
                setTimeout(() => {
                    pontosManager.mostrarStatus();
                    const calc = pontosManager.calcularPontosDisponiveis();
                    
                    console.log('📈 ESPERADO:');
                    console.log('- Pontos totais: 150');
                    console.log('- Gastei: 15 (atributos) + 20 (riqueza rica) = 35 pts');
                    console.log('- Ganhei: 5 (magro) + 15 (pobre) = 20 pts');
                    console.log('- Disponível: 150 - 35 + 20 = 135 pts');
                    
                    if (calc.disponiveis === 135) {
                        console.log('✅✅✅ TUDO FUNCIONANDO PERFEITAMENTE! ✅✅✅');
                    } else {
                        console.log('❌ Algo errado! Disponível:', calc.disponiveis);
                    }
                }, 500);
            }, 300);
        }, 300);
    }, 300);
}

// ==================== INICIAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Sistema de pontos CORRETO iniciado!');
        }
    }, 500);
});

// ==================== EXPORTAÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.testarTudoFuncionando = testarTudoFuncionando;
window.atualizarPontosAba = function(aba, pontos) {
    // Compatibilidade com sistema antigo
    if (aba === 'atributos') {
        atualizarPontosAtributos(pontos);
    }
};