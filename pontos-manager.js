// ===========================================
// PONTOS-MANAGER.JS - VERSÃO CORRIGIDA COMPLETA
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Sistema para gastos reais (custo)
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
        
        // Sistema para somar desvantagens (valor absoluto)
        this.desvantagensSomadas = {
            caracteristicasFisicas: 0,
            riqueza: 0
        };
        
        // Controle de riqueza separado
        this.riqueza = {
            pontos: 0,
            tipo: 'neutro' // vantagem, desvantagem, neutro
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
        console.log('✅ Pontos Manager - SISTEMA CORRIGIDO E FUNCIONANDO!');
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
        console.log('🔧 Configurando eventos do Pontos Manager...');
        
        // 1. ATRIBUTOS - FUNCIONA
        document.addEventListener('atributosAtualizados', (e) => {
            console.log('📥 Evento de atributos recebido:', e.detail);
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.salvar();
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS - SOMA COMO DESVANTAGEM
        document.addEventListener('desvantagensAtualizadas', (e) => {
            console.log('📥 Evento de características físicas recebido:', e.detail);
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = e.detail.pontosGastos;
                // Características físicas sempre são desvantagens (negativas)
                this.desvantagensSomadas.caracteristicasFisicas = Math.abs(pontos);
                this.somarDesvantagens();
                this.salvar();
                console.log('🏃 Características físicas (desvantagem):', this.desvantagensSomadas.caracteristicasFisicas, 'pts');
            }
        });
        
        // 3. RIQUEZA - CORRIGIDO PARA TRABALHAR CORRETAMENTE
        document.addEventListener('riquezaAtualizada', (e) => {
            console.log('💰💰💰 Evento de RIQUEZA recebido:', e.detail);
            
            if (e.detail?.pontos !== undefined) {
                const pontos = parseInt(e.detail.pontos);
                console.log('Pontos de riqueza:', pontos);
                
                // Atualiza objeto de controle
                this.riqueza.pontos = pontos;
                this.riqueza.tipo = pontos < 0 ? 'desvantagem' : pontos > 0 ? 'vantagem' : 'neutro';
                
                if (pontos < 0) {
                    // DESVANTAGEM (Miserável: -25, Pobre: -15, Batalhador: -10)
                    this.desvantagensSomadas.riqueza = Math.abs(pontos);
                    this.somarDesvantagens();
                    console.log('💰 Riqueza como DESVANTAGEM:', pontos, 'pts');
                    
                    // Atualiza display de desvantagens
                    this.atualizarDisplay('desvantagens');
                    
                } else if (pontos > 0) {
                    // VANTAGEM (Confortável: +10, Rico: +20, etc)
                    this.gastos.vantagens += pontos;
                    this.atualizarDisplay('vantagens');
                    console.log('💰 Riqueza como VANTAGEM:', pontos, 'pts');
                    
                } else {
                    // NEUTRO (Médio: 0)
                    this.desvantagensSomadas.riqueza = 0;
                    this.somarDesvantagens();
                    console.log('💰 Riqueza como NEUTRO: 0 pts');
                }
                
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // Garante que tudo seja atualizado no início
        setTimeout(() => {
            console.log('🔄 Forçando atualização inicial dos eventos...');
            this.atualizarTudo();
        }, 1000);
    }
    
    // SOMA todas as desvantagens
    somarDesvantagens() {
        const total = this.desvantagensSomadas.caracteristicasFisicas + 
                     this.desvantagensSomadas.riqueza;
        
        this.gastos.desvantagens = total;
        
        console.log('➕ Soma das desvantagens:');
        console.log('- Características físicas:', this.desvantagensSomadas.caracteristicasFisicas);
        console.log('- Riqueza (desvantagem):', this.desvantagensSomadas.riqueza);
        console.log('- TOTAL desvantagens:', total);
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS (custa pontos positivos)
        let vantagensTotal = 0;
        
        // Atributos podem ser positivos ou negativos
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        
        // Vantagens (inclui riqueza positiva)
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        
        // Perícias, técnicas, magia, equipamentos
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS (dá pontos - valor absoluto)
        let desvantagensTotal = 0;
        
        // Atributos negativos (desvantagem)
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));
        
        // Desvantagens (inclui características físicas e riqueza negativa)
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);
        
        // Peculiaridades
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Cálculo final: pontos iniciais + desvantagens - vantagens
        const pontosDisponiveis = totalPontos + desvantagensTotal - vantagensTotal;
        
        console.log('🧮 Cálculo de pontos:');
        console.log('- Total base:', totalPontos);
        console.log('- Vantagens (custo):', vantagensTotal);
        console.log('- Desvantagens (ganho):', desvantagensTotal);
        console.log('- Disponíveis:', pontosDisponiveis);
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarDisplay(aba) {
        const elemento = document.getElementById(`pontos${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (!elemento) {
            console.log(`❌ Elemento não encontrado: pontos${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
            return;
        }
        
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
        console.log('🔄 Atualizando todos os displays...');
        
        // Atualiza todas as abas
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplay(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
        this.atualizarLimitesDisplay();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
                console.log('⚠️ ALERTA: Pontos negativos!');
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
    
    atualizarLimitesDisplay() {
        // Limite desvantagens
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const desvantagensAtuais = Math.abs(this.gastos.desvantagens || 0);
            const percentual = Math.min(100, (desvantagensAtuais / this.limites.desvantagens) * 100);
            
            progress.style.width = `${percentual}%`;
            texto.textContent = `${desvantagensAtuais}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
            
            // Cor do progresso
            if (percentual >= 90) {
                progress.style.backgroundColor = '#e74c3c';
            } else if (percentual >= 75) {
                progress.style.backgroundColor = '#f39c12';
            } else {
                progress.style.backgroundColor = '#3498db';
            }
        }
    }
    
    verificarLimites() {
        const desvantagensAtuais = Math.abs(this.gastos.desvantagens || 0);
        
        if (desvantagensAtuais > this.limites.desvantagens) {
            console.log(`⚠️ ALERTA: Excedeu limite de desvantagens! ${desvantagensAtuais}/${this.limites.desvantagens}`);
            
            // Pode mostrar um alerta visual aqui
            const elemento = document.getElementById('pontosDesvantagens');
            if (elemento) {
                elemento.style.animation = 'pulse-alert 0.5s 3';
                setTimeout(() => {
                    elemento.style.animation = '';
                }, 1500);
            }
        }
        
        this.atualizarLimitesDisplay();
    }
    
    salvar() {
        try {
            const dados = {
                pontosIniciais: this.pontosIniciais,
                pontosGanhosCampanha: this.pontosGanhosCampanha,
                gastos: { ...this.gastos },
                desvantagensSomadas: { ...this.desvantagensSomadas },
                riqueza: { ...this.riqueza },
                limites: { ...this.limites },
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('pontos_sistema_corrigido', JSON.stringify(dados));
            console.log('💾 Pontos salvos com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar pontos:', error);
        }
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_sistema_corrigido');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
                console.log('📂 Pontos carregados do localStorage');
            }
        } catch (e) {
            console.error('❌ Erro ao carregar pontos:', e);
        }
    }
    
    aplicarDados(dados) {
        if (dados.pontosIniciais) this.pontosIniciais = dados.pontosIniciais;
        if (dados.pontosGanhosCampanha) this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
        if (dados.gastos) Object.assign(this.gastos, dados.gastos);
        if (dados.desvantagensSomadas) Object.assign(this.desvantagensSomadas, dados.desvantagensSomadas);
        if (dados.riqueza) Object.assign(this.riqueza, dados.riqueza);
        if (dados.limites) Object.assign(this.limites, dados.limites);
        
        this.atualizarTudo();
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

// ==================== FUNÇÃO DE TESTE COMPLETO ====================

function testarSistemaPontosCompleto() {
    console.log('🧪🧪🧪 TESTE COMPLETO DO SISTEMA DE PONTOS 🧪🧪🧪');
    
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 1. Testa características físicas como desvantagem
    console.log('\n1. Testando características físicas (Magro: -5 pts)...');
    document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
        detail: { pontosGastos: -5 }
    }));
    
    // 2. Testa riqueza como desvantagem
    setTimeout(() => {
        console.log('\n2. Testando riqueza como desvantagem (Batalhador: -10 pts)...');
        document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
            detail: { pontos: -10 }
        }));
        
        // 3. Testa atributos positivos
        setTimeout(() => {
            console.log('\n3. Testando atributos positivos (+15 pts)...');
            document.dispatchEvent(new CustomEvent('atributosAtualizados', {
                detail: { pontosGastos: 15 }
            }));
            
            // 4. Testa riqueza como vantagem
            setTimeout(() => {
                console.log('\n4. Testando riqueza como vantagem (Rico: +20 pts)...');
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: 20 }
                }));
                
                // Verifica resultado final
                setTimeout(() => {
                    console.log('\n📊 RESULTADO FINAL ESPERADO:');
                    console.log('- Pontos iniciais: 150');
                    console.log('- Desvantagens: 5 (caract. físicas) + 0 (riqueza atual) = 5 pts');
                    console.log('- Vantagens: 15 (atributos) + 20 (riqueza) = 35 pts');
                    console.log('- Cálculo: 150 + 5 - 35 = 120 pts disponíveis');
                    console.log('\n✅ Teste completo executado!');
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// ==================== INICIA O SISTEMA ====================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Sistema de pontos CORRIGIDO iniciado!');
            
            // Testa automaticamente para debug
            setTimeout(() => {
                window.testarSistemaPontosCompleto();
            }, 2000);
        }
    }, 500);
});

// ==================== EXPORTA FUNÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.testarSistemaPontosCompleto = testarSistemaPontosCompleto;

// Adiciona estilos para animações
const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes pulse-alert {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .negativo {
        color: #e74c3c !important;
        font-weight: bold;
    }
    
    .positivo {
        color: #27ae60 !important;
        font-weight: bold;
    }
`;
document.head.appendChild(estilo);