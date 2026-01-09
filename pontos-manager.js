// ===========================================
// PONTOS-MANAGER.JS - VERSÃO FINAL COMPLETA
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            // ATRIBUTOS (+ ou -)
            atributos: 0,
            
            // VANTAGENS (sempre positivas)
            vantagens: 0,           // Riqueza positiva, outras vantagens
            
            // DESVANTAGENS (sempre positivas - SOMADAS)
            desvantagens: {
                riqueza: 0,         // Ex: Batalhador (-10) = 10 pts
                caracteristicas: 0, // Ex: Magro (-5) = 5 pts
                outras: 0           // Futuras desvantagens
            },
            
            // PECULIARIDADES (sempre positivas)
            peculiaridades: 0,
            
            // OUTROS (sempre positivas)
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
        // Pontos iniciais
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
            });
        }
        
        // Pontos da campanha
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
            });
        }
        
        // Limites
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
        // 1. ATRIBUTOS
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
            }
        });
        
        // 2. RIQUEZA - Trata vantagens e desvantagens separadamente
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                // Riqueza NEGATIVA = DESVANTAGEM (ganha pontos)
                if (e.detail.pontos < 0) {
                    const pontos = Math.abs(e.detail.pontos);
                    this.gastos.desvantagens.riqueza = pontos;
                    this.gastos.vantagens = 0; // Zera vantagens se for desvantagem
                    this.atualizarTudo();
                }
                // Riqueza POSITIVA já é tratada no evento 'vantagensAtualizadas'
            }
        });
        
        // 3. VANTAGENS DE RIQUEZA (positivas)
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined && e.detail.tipo === 'riqueza') {
                // Riqueza POSITIVA = VANTAGEM (custa pontos)
                this.gastos.vantagens = e.detail.pontos;
                this.gastos.desvantagens.riqueza = 0; // Zera desvantagens se for vantagem
                this.atualizarTudo();
            }
        });
        
        // 4. CARACTERÍSTICAS FÍSICAS (sempre desvantagens)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined && 
                e.detail.origem === 'caracteristicas_fisicas') {
                const pontos = Math.abs(Math.min(0, e.detail.pontosGastos));
                this.gastos.desvantagens.caracteristicas = pontos;
                this.atualizarTudo();
            }
        });
        
        // 5. PECULIARIDADES
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontos;
                this.atualizarTudo();
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // 1. VANTAGENS (SUBTRAI DO TOTAL - custa pontos)
        let vantagensTotal = 0;
        
        // Atributos positivos
        if (this.gastos.atributos > 0) {
            vantagensTotal += this.gastos.atributos;
        }
        
        // Riqueza positiva e outras vantagens
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // 2. DESVANTAGENS (ADICIONA AO TOTAL - ganha pontos)
        let desvantagensTotal = 0;
        
        // Atributos negativos
        if (this.gastos.atributos < 0) {
            desvantagensTotal += Math.abs(this.gastos.atributos);
        }
        
        // SOMA todas as desvantagens
        desvantagensTotal += Math.abs(this.gastos.desvantagens.riqueza || 0);
        desvantagensTotal += Math.abs(this.gastos.desvantagens.caracteristicas || 0);
        desvantagensTotal += Math.abs(this.gastos.desvantagens.outras || 0);
        
        // Peculiaridades são desvantagens também
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // 3. CÁLCULO FINAL
        // Total = Pontos Base - Vantagens + Desvantagens
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
            // SOMA todas as desvantagens
            pontos = this.gastos.desvantagens.riqueza + 
                    this.gastos.desvantagens.caracteristicas + 
                    this.gastos.desvantagens.outras;
            elemento.textContent = pontos;
        } else if (aba === 'vantagens') {
            // Mostra vantagens (riqueza positiva + outras)
            pontos = this.gastos[aba] || 0;
            elemento.textContent = pontos;
        } else if (aba === 'peculiaridades') {
            pontos = this.gastos[aba];
            elemento.textContent = pontos;
        } else {
            pontos = this.gastos[aba] || 0;
            elemento.textContent = pontos;
        }
        
        // Atualiza cor do card
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo');
            
            if (aba === 'desvantagens' || aba === 'peculiaridades') {
                if (pontos > 0) {
                    card.classList.add('negativo');
                }
            } else if (pontos > 0) {
                card.classList.add('positivo');
            }
        }
    }
    
    atualizarTudo() {
        // Atualiza todos os displays
        this.atualizarDisplay('atributos');
        this.atualizarDisplay('vantagens');
        this.atualizarDisplay('desvantagens');
        this.atualizarDisplay('peculiaridades');
        this.atualizarDisplay('pericias');
        this.atualizarDisplay('tecnicas');
        this.atualizarDisplay('magia');
        
        // Calcula totais
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
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
        
        // Total gasto (vantagens)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
            
            if (calculo.vantagens > 0) {
                elementoGastos.style.color = '#e74c3c';
                elementoGastos.style.fontWeight = 'bold';
            } else {
                elementoGastos.style.color = '';
                elementoGastos.style.fontWeight = '';
            }
        }
        
        // Atualiza limites
        this.atualizarLimites(calculo.desvantagens);
        
        // Atualiza percentuais
        this.atualizarPercentuais(calculo);
    }
    
    atualizarLimites(desvantagensTotal) {
        // Limite de desvantagens
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
        
        // Limite de peculiaridades
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
        
        // Atributos
        const percAtributos = document.getElementById('percAtributos');
        if (percAtributos) {
            const percent = calcPercent(this.gastos.atributos);
            percAtributos.textContent = `${percent}%`;
        }
        
        // Vantagens
        const percVantagens = document.getElementById('percVantagens');
        if (percVantagens) {
            const percent = calcPercent(this.gastos.vantagens);
            percVantagens.textContent = `${percent}%`;
        }
        
        // Desvantagens
        const percDesvantagens = document.getElementById('percDesvantagens');
        if (percDesvantagens) {
            const desvTotal = this.gastos.desvantagens.riqueza + 
                            this.gastos.desvantagens.caracteristicas + 
                            this.gastos.desvantagens.outras;
            const percent = calcPercent(desvTotal);
            percDesvantagens.textContent = `${percent}%`;
        }
        
        // Peculiaridades
        const percPeculiaridades = document.getElementById('percPeculiaridades');
        if (percPeculiaridades) {
            const percent = calcPercent(this.gastos.peculiaridades);
            percPeculiaridades.textContent = `${percent}%`;
        }
        
        // Outros (0% por enquanto)
        ['Pericias', 'Tecnicas', 'Magia'].forEach(tipo => {
            const elemento = document.getElementById(`perc${tipo}`);
            if (elemento) elemento.textContent = '0%';
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