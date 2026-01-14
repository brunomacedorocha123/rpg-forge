// pontos-manager.js - VERSÃO ATUALIZADA COM INTEGRAÇÃO COMPLETA
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: {
                aparência: 0,
                atributosComplementares: 0,
                idiomas: 0,
                statusSocial: 0,
                carisma: 0,
                reputacao: 0,
                aliados: 0,
                contatos: 0,
                patronos: 0,
                inimigos: 0,
                dependentes: 0,
                catálogo: 0,  // Vantagens do catálogo
                outras: 0
            },
            desvantagens: {
                riqueza: 0,
                caracteristicas: 0,
                aparência: 0,
                idiomas: 0,
                statusSocial: 0,
                reputacao: 0,
                inimigos: 0,
                dependentes: 0,
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
        
        // Notificar que o sistema está pronto
        const evento = new CustomEvent('pontosManagerInicializado');
        document.dispatchEvent(evento);
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
        // Evento de atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
            }
        });
        
        // Evento de riqueza
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    this.gastos.desvantagens.riqueza = Math.abs(pontos);
                    this.gastos.vantagens.outras = 0;
                } else if (pontos > 0) {
                    this.gastos.vantagens.outras = pontos;
                    this.gastos.desvantagens.riqueza = 0;
                } else {
                    this.gastos.vantagens.outras = 0;
                    this.gastos.desvantagens.riqueza = 0;
                }
                
                this.atualizarTudo();
            }
        });
        
        // Evento de características físicas
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined && 
                e.detail.origem === 'caracteristicas_fisicas') {
                const pontos = Math.abs(Math.min(0, e.detail.pontosGastos));
                this.gastos.desvantagens.caracteristicas = pontos;
                this.atualizarTudo();
            }
        });
        
        // Evento de peculiaridades
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Evento de vantagens do catálogo
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                if (e.detail.tipo === 'catálogo' || e.detail.tipo === 'catalogo') {
                    this.gastos.vantagens.catálogo = e.detail.pontos;
                } else if (e.detail.tipo === 'riqueza') {
                    this.gastos.vantagens.outras = e.detail.pontos;
                } else if (e.detail.tipo === 'aparência') {
                    const pontos = e.detail.pontos;
                    if (pontos >= 0) {
                        this.gastos.vantagens.aparência = pontos;
                        this.gastos.desvantagens.aparência = 0;
                    } else {
                        this.gastos.desvantagens.aparência = Math.abs(pontos);
                        this.gastos.vantagens.aparência = 0;
                    }
                } else if (e.detail.tipo === 'idiomas') {
                    this.gastos.desvantagens.idiomas = Math.abs(e.detail.pontos);
                } else if (e.detail.tipo === 'statusSocial') {
                    const pontos = e.detail.pontos;
                    if (pontos >= 0) {
                        this.gastos.vantagens.statusSocial = pontos;
                        this.gastos.desvantagens.statusSocial = 0;
                    } else {
                        this.gastos.desvantagens.statusSocial = Math.abs(pontos);
                        this.gastos.vantagens.statusSocial = 0;
                    }
                }
                this.atualizarTudo();
            }
        });
        
        // Evento de carisma
        document.addEventListener('carismaAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.carisma = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Evento de reputação
        document.addEventListener('reputacaoAtualizada', (e) => {
            if (e.detail?.pontosPositiva !== undefined && e.detail?.pontosNegativa !== undefined) {
                this.gastos.vantagens.reputacao = e.detail.pontosPositiva;
                this.gastos.desvantagens.reputacao = e.detail.pontosNegativa;
                this.atualizarTudo();
            }
        });
        
        // Evento de aliados/contatos/patronos
        document.addEventListener('vantagemStatusAtualizada', (e) => {
            if (e.detail?.tipo && e.detail?.pontos !== undefined) {
                const tipo = e.detail.tipo;
                const pontos = e.detail.pontos;
                
                if (['aliados', 'contatos', 'patronos'].includes(tipo)) {
                    this.gastos.vantagens[tipo] = pontos;
                } else if (['inimigos', 'dependentes'].includes(tipo)) {
                    this.gastos.desvantagens[tipo] = Math.abs(pontos);
                }
                
                this.atualizarTudo();
            }
        });
        
        // Evento de atributos complementares
        document.addEventListener('atributosComplementaresAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.atributosComplementares = e.detail.pontos;
                this.atualizarTudo();
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // Calcular vantagens totais
        let vantagensTotal = 0;
        
        // Atributos (podem ser positivos ou negativos)
        vantagensTotal += Math.max(0, this.gastos.atributos);
        
        // Todas as vantagens
        Object.values(this.gastos.vantagens).forEach(valor => {
            vantagensTotal += Math.max(0, valor || 0);
        });
        
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // Calcular desvantagens totais (são valores negativos)
        let desvantagensTotal = 0;
        
        // Atributos negativos
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos));
        
        // Todas as desvantagens
        Object.values(this.gastos.desvantagens).forEach(valor => {
            desvantagensTotal += Math.abs(valor || 0);
        });
        
        // Peculiaridades são sempre negativas
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
            pontos = 0;
            Object.values(this.gastos.desvantagens).forEach(valor => {
                pontos += Math.abs(valor || 0);
            });
            // Adicionar atributos negativos
            pontos += Math.abs(Math.min(0, this.gastos.atributos));
            elemento.textContent = pontos;
        } else if (aba === 'vantagens') {
            pontos = this.gastos.vantagens.catálogo || 0;
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
        
        const percAtributos = document.getElementById('percAtributos');
        if (percAtributos) {
            const percent = calcPercent(this.gastos.atributos);
            percAtributos.textContent = `${percent}%`;
        }
        
        const percVantagens = document.getElementById('percVantagens');
        if (percVantagens) {
            const vantagensCatálogo = this.gastos.vantagens.catálogo || 0;
            const percent = calcPercent(vantagensCatálogo);
            percVantagens.textContent = `${percent}%`;
        }
        
        const percDesvantagens = document.getElementById('percDesvantagens');
        if (percDesvantagens) {
            let desvTotal = 0;
            Object.values(this.gastos.desvantagens).forEach(valor => {
                desvTotal += Math.abs(valor || 0);
            });
            desvTotal += Math.abs(Math.min(0, this.gastos.atributos));
            const percent = calcPercent(desvTotal);
            percDesvantagens.textContent = `${percent}%`;
        }
        
        const percPeculiaridades = document.getElementById('percPeculiaridades');
        if (percPeculiaridades) {
            const percent = calcPercent(this.gastos.peculiaridades);
            percPeculiaridades.textContent = `${percent}%`;
        }
        
        ['Pericias', 'Tecnicas', 'Magia'].forEach(tipo => {
            const elemento = document.getElementById(`perc${tipo}`);
            if (elemento) elemento.textContent = '0%';
        });
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Método para obter pontos específicos
    obterPontosVantagens() {
        return this.gastos.vantagens.catálogo || 0;
    }
    
    obterPontosDesvantagens() {
        let total = 0;
        Object.values(this.gastos.desvantagens).forEach(valor => {
            total += Math.abs(valor || 0);
        });
        total += Math.abs(Math.min(0, this.gastos.atributos));
        return total;
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