// ===========================================
// PONTOS-MANAGER.JS - VERSÃO LIMPA E FUNCIONAL
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: {
                riqueza: 0,
                caracteristicas: 0,
                outras: 0
            },
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
        
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) {
            limiteDesvantagens.value = this.limites.desvantagens;
            limiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarTudo();
            });
        }
        
        const limitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (limitePeculiaridades) {
            limitePeculiaridades.value = this.limites.peculiaridades;
            limitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarTudo();
            });
        }
    }
    
    configurarEventos() {
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = Math.abs(Math.min(0, e.detail.pontos));
                this.gastos.desvantagens.riqueza = pontos;
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined && 
                e.detail.origem === 'caracteristicas_fisicas') {
                const pontos = Math.abs(Math.min(0, e.detail.pontosGastos));
                this.gastos.desvantagens.caracteristicas = pontos;
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens = e.detail.pontos;
                this.atualizarTudo();
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        let vantagensTotal = 0;
        
        if (this.gastos.atributos > 0) {
            vantagensTotal += this.gastos.atributos;
        }
        
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        let desvantagensTotal = 0;
        
        if (this.gastos.atributos < 0) {
            desvantagensTotal += Math.abs(this.gastos.atributos);
        }
        
        desvantagensTotal += Math.abs(this.gastos.desvantagens.riqueza || 0);
        desvantagensTotal += Math.abs(this.gastos.desvantagens.caracteristicas || 0);
        desvantagensTotal += Math.abs(this.gastos.desvantagens.outras || 0);
        
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarDisplay(aba) {
        const elemento = document.getElementById(`pontos${this.capitalize(aba)}`);
        if (!elemento) return;
        
        let pontos;
        
        if (aba === 'atributos') {
            pontos = this.gastos[aba];
            elemento.textContent = pontos >= 0 ? `+${pontos}` : pontos;
        } else if (aba === 'desvantagens') {
            pontos = this.gastos.desvantagens.riqueza + 
                    this.gastos.desvantagens.caracteristicas + 
                    this.gastos.desvantagens.outras;
            elemento.textContent = pontos;
        } else if (aba === 'peculiaridades') {
            pontos = this.gastos[aba];
            elemento.textContent = pontos;
        } else {
            pontos = this.gastos[aba] || 0;
            elemento.textContent = pontos;
        }
        
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo');
            
            if (aba === 'desvantagens' || aba === 'peculiaridades') {
                if (pontos > 0) card.classList.add('negativo');
            } else if (pontos > 0) {
                card.classList.add('positivo');
            }
        }
    }
    
    atualizarTudo() {
        this.atualizarDisplay('atributos');
        this.atualizarDisplay('vantagens');
        this.atualizarDisplay('desvantagens');
        this.atualizarDisplay('peculiaridades');
        this.atualizarDisplay('pericias');
        this.atualizarDisplay('tecnicas');
        this.atualizarDisplay('magia');
        
        const calculo = this.calcularPontosDisponiveis();
        
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
        
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
        
        this.atualizarLimites(calculo.desvantagens);
        this.atualizarPercentuais(calculo);
    }
    
    atualizarLimites(desvantagensTotal) {
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const percentual = Math.min(100, (desvantagensTotal / this.limites.desvantagens) * 100);
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvantagensTotal}/${this.limites.desvantagens} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            progressDesv.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                percentual >= 80 ? '#f39c12' : '#3498db';
        }
        
        const peculiaresTotal = this.gastos.peculiaridades || 0;
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const percentual = Math.min(100, (peculiaresTotal / this.limites.peculiaridades) * 100);
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${peculiaresTotal}/${this.limites.peculiaridades} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            progressPec.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                               percentual >= 80 ? '#f39c12' : '#3498db';
        }
    }
    
    atualizarPercentuais(calculo) {
        const totalPontos = calculo.total;
        
        const calcPercent = (valor) => {
            return totalPontos > 0 ? Math.round((Math.abs(valor) / totalPontos) * 100) : 0;
        };
        
        const cards = {
            atributos: Math.abs(calculo.breakdown?.atributos || 0),
            desvantagens: calculo.desvantagens,
            peculiaridades: this.gastos.peculiaridades,
            vantagens: this.gastos.vantagens,
            pericias: this.gastos.pericias,
            tecnicas: this.gastos.tecnicas,
            magia: this.gastos.magia
        };
        
        Object.keys(cards).forEach(card => {
            const elemento = document.getElementById(`perc${this.capitalize(card)}`);
            if (elemento) {
                const percent = calcPercent(cards[card]);
                elemento.textContent = `${percent}%`;
            }
        });
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

let pontosManagerInstance = null;

function inicializarSistemaPontos() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
    }
    return pontosManagerInstance;
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarSistemaPontos();
        }
    }, 500);
});

window.PontosManager = PontosManager;
window.inicializarSistemaPontos = inicializarSistemaPontos;
window.obterPontosManager = function() {
    return pontosManagerInstance;
};