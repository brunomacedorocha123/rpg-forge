// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL CORRETA
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
        
        this.controle = {
            caracteristicasFisicas: 0,
            riqueza: 0,
            riquezaTipo: 'neutro'
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
    }
    
    configurarEventos() {
        // ATRIBUTOS - simples e direto
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = e.detail.pontosGastos;
                this.gastos.atributos = pontos;
                
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = e.detail.pontosGastos;
                this.controle.caracteristicasFisicas = Math.abs(pontos);
                
                this.calcularDesvantagensTotais();
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
        
        // RIQUEZA
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = parseInt(e.detail.pontos);
                
                this.removerRiquezaAnterior();
                this.controle.riqueza = Math.abs(pontos);
                this.controle.riquezaTipo = pontos < 0 ? 'desvantagem' : 
                                           pontos > 0 ? 'vantagem' : 'neutro';
                
                this.calcularDesvantagensTotais();
                this.calcularVantagensTotais();
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
    }
    
    removerRiquezaAnterior() {
        // Remove riqueza anterior dos cálculos
        if (this.controle.riquezaTipo === 'vantagem') {
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - this.controle.riqueza);
        }
    }
    
    calcularDesvantagensTotais() {
        let total = 0;
        
        // Características físicas
        total += this.controle.caracteristicasFisicas;
        
        // Riqueza como desvantagem
        if (this.controle.riquezaTipo === 'desvantagem') {
            total += this.controle.riqueza;
        }
        
        // Atributos negativos
        if (this.gastos.atributos < 0) {
            total += Math.abs(this.gastos.atributos);
        }
        
        // Outras desvantagens
        total += Math.max(0, this.gastos.desvantagens || 0);
        total += Math.max(0, this.gastos.peculiaridades || 0);
        
        this.gastos.desvantagens = total;
        this.atualizarDisplay('desvantagens');
    }
    
    calcularVantagensTotais() {
        let total = 0;
        
        // Atributos positivos
        if (this.gastos.atributos > 0) {
            total += this.gastos.atributos;
        }
        
        // Riqueza como vantagem
        if (this.controle.riquezaTipo === 'vantagem') {
            total += this.controle.riqueza;
        }
        
        // Outras vantagens
        total += Math.max(0, this.gastos.vantagens || 0);
        total += Math.max(0, this.gastos.pericias || 0);
        total += Math.max(0, this.gastos.tecnicas || 0);
        total += Math.max(0, this.gastos.magia || 0);
        total += Math.max(0, this.gastos.equipamentos || 0);
        
        this.gastos.vantagens = total;
        this.atualizarDisplay('vantagens');
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS (custa pontos - subtrai)
        const vantagensTotal = this.gastos.vantagens;
        
        // DESVANTAGENS (ganha pontos - adiciona)
        const desvantagensTotal = this.gastos.desvantagens;
        
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
        
        let pontos = this.gastos[aba] || 0;
        
        // Para atributos, mostra valor real com sinal
        if (aba === 'atributos') {
            elemento.textContent = pontos;
            
            // Estilo
            elemento.classList.remove('positivo', 'negativo');
            if (pontos > 0) {
                elemento.classList.add('positivo');
            } else if (pontos < 0) {
                elemento.classList.add('negativo');
            }
        } else {
            // Para outros, mostra valor absoluto
            elemento.textContent = Math.abs(pontos);
            
            // Estilo baseado no tipo
            const pai = elemento.parentElement;
            pai.classList.remove('positivo', 'negativo');
            
            if (aba === 'desvantagens' || aba === 'peculiaridades') {
                if (pontos > 0) pai.classList.add('negativo');
            } else if (pontos > 0) {
                pai.classList.add('positivo');
            }
        }
        
        // Atualiza porcentagem
        const elementoPercent = document.getElementById(`perc${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (elementoPercent) {
            const total = this.pontosIniciais + this.pontosGanhosCampanha;
            if (total > 0) {
                const percentual = (Math.abs(pontos) / total) * 100;
                elementoPercent.textContent = `${Math.round(percentual)}%`;
            }
        }
    }
    
    atualizarTudo() {
        // Atualiza todos os displays
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplay(aba);
        });
        
        // Recalcula totais
        this.calcularDesvantagensTotais();
        this.calcularVantagensTotais();
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
        
        // Total gasto (vantagens)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite de desvantagens
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
            controle: { ...this.controle },
            limites: { ...this.limites }
        };
        localStorage.setItem('pontos_manager_final', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_manager_final');
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
        if (dados.controle) Object.assign(this.controle, dados.controle);
        if (dados.limites) Object.assign(this.limites, dados.limites);
        
        this.atualizarTudo();
    }
}

// Inicialização global
let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Sistema de pontos pronto!');
        }
    }, 500);
});

// Teste rápido
window.testarSistemaPontos = function() {
    if (!pontosManager) return;
    
    console.log('🧪 TESTE RÁPIDO:');
    
    // Atributos: ST 12 (+20), DX 11 (+20), IQ 10 (0), HT 9 (-10) = +30 total
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 30 }
    }));
    
    setTimeout(() => {
        console.log('Resultado esperado:');
        console.log('- Atributos: +30 pts (aparece como +30 no card)');
        console.log('- Vantagens: 30 pts');
        console.log('- Disponível: 150 - 30 = 120 pts');
    }, 100);
};