// ===========================================
// PONTOS-MANAGER.JS - VERSÃO SIMPLES E FUNCIONAL
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,       // Pode ser positivo ou negativo
            vantagens: 0,       // Sempre positivo
            desvantagens: 0,    // Sempre positivo
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarInputs();
        this.configurarEventos();
        this.atualizarTudo();
        console.log('✅ Sistema de pontos pronto!');
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
            });
        }
    }
    
    configurarEventos() {
        // 1. ATRIBUTOS
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS (se já existir)
        if (typeof window.caracteristicasFisicas !== 'undefined') {
            // Se você já tem um sistema para isso, mantenha
        }
        
        // 3. RIQUEZA (se já existir)
        if (typeof window.riquezaManager !== 'undefined') {
            // Se você já tem um sistema para isso, mantenha
        }
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS (custa pontos - subtrai)
        let vantagensTotal = 0;
        
        // Atributos positivos
        if (this.gastos.atributos > 0) {
            vantagensTotal += this.gastos.atributos;
        }
        
        // Outras vantagens
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS (ganha pontos - adiciona)
        let desvantagensTotal = 0;
        
        // Atributos negativos
        if (this.gastos.atributos < 0) {
            desvantagensTotal += Math.abs(this.gastos.atributos);
        }
        
        // Outras desvantagens
        desvantagensTotal += Math.max(0, this.gastos.desvantagens || 0);
        desvantagensTotal += Math.max(0, this.gastos.peculiaridades || 0);
        
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
        
        // Para atributos, mostra valor real (pode ser negativo)
        if (aba === 'atributos') {
            elemento.textContent = pontos;
            elemento.classList.remove('positivo', 'negativo');
            if (pontos > 0) elemento.classList.add('positivo');
            else if (pontos < 0) elemento.classList.add('negativo');
        } else {
            // Para outros, mostra valor absoluto
            elemento.textContent = Math.abs(pontos);
            
            const pai = elemento.parentElement;
            pai.classList.remove('positivo', 'negativo');
            
            if (aba === 'desvantagens' || aba === 'peculiaridades') {
                if (pontos > 0) pai.classList.add('negativo');
            } else if (pontos > 0) {
                pai.classList.add('positivo');
            }
        }
    }
    
    atualizarTudo() {
        // Atualiza todos os displays
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplay(aba);
        });
        
        // Calcula totais
        const calculo = this.calcularPontosDisponiveis();
        
        // Atualiza pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
            }
        }
        
        // Atualiza total gasto
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
        
        // Atualiza limites
        this.atualizarLimites(calculo.desvantagens);
    }
    
    atualizarLimites(desvantagensTotal) {
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (desvantagensTotal / this.limites.desvantagens) * 100);
            progress.style.width = `${percentual}%`;
            texto.textContent = `${desvantagensTotal}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
        }
    }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            new PontosManager();
        }
    }, 500);
});