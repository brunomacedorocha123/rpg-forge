// pontos-manager.js - VERSÃO 100% FUNCIONAL (SEM LOGS)
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhos = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0
        };
        
        this.detalhes = {
            vantagens: 0,
            desvantagens: 0
        };
        
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarInputs();
        this.configurarEventListeners();
        
        setTimeout(() => this.atualizarTudo(), 100);
    }
    
    configurarInputs() {
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
            });
        }
        
        const inputCampanha = document.getElementById('pontosGanhos');
        if (inputCampanha) {
            inputCampanha.value = this.pontosGanhos;
            inputCampanha.addEventListener('change', (e) => {
                this.pontosGanhos = parseInt(e.target.value) || 0;
                this.atualizarTudo();
            });
        }
        
        const limiteDesv = document.getElementById('limiteDesvantagens');
        if (limiteDesv) {
            limiteDesv.value = this.limites.desvantagens;
            limiteDesv.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarTudo();
            });
        }
        
        const limitePec = document.getElementById('limitePeculiaridades');
        if (limitePec) {
            limitePec.value = this.limites.peculiaridades;
            limitePec.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarTudo();
            });
        }
    }
    
    configurarEventListeners() {
        // Atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.atributos = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Vantagens catálogo
        document.addEventListener('vantagensCatalogoAtualizadas', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.vantagens = e.detail.pontos;
                this.detalhes.vantagens = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Desvantagens catálogo
        document.addEventListener('desvantagensCatalogoAtualizadas', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.desvantagens = Math.abs(e.detail.pontos);
                this.detalhes.desvantagens = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // Peculiaridades
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // Aparência
        document.addEventListener('aparênciaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.gastos.vantagens += pontos;
                } else {
                    this.gastos.desvantagens += Math.abs(pontos);
                }
                this.atualizarTudo();
            }
        });
        
        // Características físicas
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.desvantagens += Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // Riqueza
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.gastos.vantagens += pontos;
                } else {
                    this.gastos.desvantagens += Math.abs(pontos);
                }
                this.atualizarTudo();
            }
        });
        
        // Status social
        document.addEventListener('statusSocialAtualizado', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.gastos.vantagens += pontos;
                } else {
                    this.gastos.desvantagens += Math.abs(pontos);
                }
                this.atualizarTudo();
            }
        });
        
        // Idiomas
        document.addEventListener('idiomasAtualizados', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.gastos.desvantagens += Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhos;
        
        // Gastos (custam pontos): atributos positivos + vantagens
        const gastosTotais = 
            Math.max(0, this.gastos.atributos) +  // Atributos positivos
            this.gastos.vantagens +               // Vantagens catálogo e outras
            this.gastos.pericias +
            this.gastos.tecnicas +
            this.gastos.magia;
        
        // Ganhos (dão pontos): atributos negativos + desvantagens + peculiaridades
        const ganhosTotais = 
            Math.abs(Math.min(0, this.gastos.atributos)) +  // Atributos negativos
            this.gastos.desvantagens +                     // Desvantagens catálogo e outras
            this.gastos.peculiaridades;                    // Peculiaridades
        
        const disponiveis = totalBase - gastosTotais + ganhosTotais;
        
        return {
            totalBase: totalBase,
            gastos: gastosTotais,
            ganhos: ganhosTotais,
            disponiveis: disponiveis,
            vantagensTotal: this.gastos.vantagens,
            desvantagensTotal: this.gastos.desvantagens
        };
    }
    
    atualizarTudo() {
        const calculo = this.calcularPontosDisponiveis();
        
        // 1. Atualizar cards de gastos
        this.atualizarCardGastos('atributos', this.gastos.atributos);
        this.atualizarCardGastos('vantagens', this.gastos.vantagens);
        this.atualizarCardGastos('desvantagens', this.gastos.desvantagens);
        this.atualizarCardGastos('peculiaridades', this.gastos.peculiaridades);
        
        // 2. Atualizar pontos disponíveis
        const dispEl = document.getElementById('pontosDisponiveis');
        if (dispEl) {
            dispEl.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                dispEl.style.color = '#e74c3c';
            } else if (calculo.disponiveis < 10) {
                dispEl.style.color = '#f39c12';
            } else {
                dispEl.style.color = '#27ae60';
            }
        }
        
        // 3. Atualizar total gasto
        const gastosEl = document.getElementById('pontosGastos');
        if (gastosEl) {
            gastosEl.textContent = calculo.gastos;
        }
        
        // 4. Atualizar limites
        this.atualizarLimites(calculo);
        
        // 5. Atualizar percentuais
        this.atualizarPercentuais(calculo.totalBase);
    }
    
    atualizarCardGastos(tipo, valor) {
        const elemento = document.getElementById(`pontos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (!elemento) return;
        
        // Formatar valor para exibição
        if (tipo === 'atributos') {
            elemento.textContent = valor >= 0 ? `+${valor}` : `${valor}`;
        } else {
            elemento.textContent = Math.abs(valor);
        }
        
        // Estilizar card
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo', 'zero');
            
            if (valor > 0) {
                if (tipo === 'desvantagens' || tipo === 'peculiaridades') {
                    card.classList.add('negativo');
                } else {
                    card.classList.add('positivo');
                }
            } else if (valor === 0) {
                card.classList.add('zero');
            }
        }
    }
    
    atualizarLimites(calculo) {
        // Limite de desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const desvTotal = this.gastos.desvantagens;
            const limite = this.limites.desvantagens;
            const percentual = Math.min(100, (desvTotal / limite) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvTotal}/${limite} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c';
                textDesv.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12';
                textDesv.style.color = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
                textDesv.style.color = '#3498db';
            }
        }
        
        // Limite de peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const pecTotal = this.gastos.peculiaridades;
            const limite = this.limites.peculiaridades;
            const percentual = Math.min(100, (pecTotal / limite) * 100);
            
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${pecTotal}/${limite} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
                textPec.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
                textPec.style.color = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
                textPec.style.color = '#3498db';
            }
        }
    }
    
    atualizarPercentuais(totalBase) {
        if (totalBase <= 0) return;
        
        const tipos = ['atributos', 'vantagens', 'desvantagens', 'peculiaridades', 'pericias', 'tecnicas', 'magia'];
        
        tipos.forEach(tipo => {
            const valor = this.gastos[tipo] || 0;
            const percentEl = document.getElementById(`perc${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            
            if (percentEl) {
                const percentual = Math.round((Math.abs(valor) / totalBase) * 100);
                percentEl.textContent = `${percentual}%`;
                
                if (percentual > 30) {
                    percentEl.style.color = '#e74c3c';
                    percentEl.style.fontWeight = 'bold';
                } else if (percentual > 15) {
                    percentEl.style.color = '#f39c12';
                } else {
                    percentEl.style.color = '#7f8c8d';
                }
            }
        });
    }
    
    // Métodos públicos para outros módulos
    atualizarAtributos(pontos) {
        this.gastos.atributos = pontos;
        this.atualizarTudo();
    }
    
    atualizarVantagens(pontos) {
        this.gastos.vantagens = pontos;
        this.atualizarTudo();
    }
    
    atualizarDesvantagens(pontos) {
        this.gastos.desvantagens = Math.abs(pontos);
        this.atualizarTudo();
    }
    
    atualizarPeculiaridades(pontos) {
        this.gastos.peculiaridades = Math.abs(pontos);
        this.atualizarTudo();
    }
    
    adicionarVantagem(pontos) {
        this.gastos.vantagens += pontos;
        this.atualizarTudo();
        return true;
    }
    
    adicionarDesvantagem(pontos) {
        this.gastos.desvantagens += Math.abs(pontos);
        this.atualizarTudo();
        return true;
    }
    
    removerVantagem(pontos) {
        this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(pontos));
        this.atualizarTudo();
        return true;
    }
    
    removerDesvantagem(pontos) {
        this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - Math.abs(pontos));
        this.atualizarTudo();
        return true;
    }
    
    obterResumo() {
        return this.calcularPontosDisponiveis();
    }
    
    resetarTudo() {
        this.pontosIniciais = 150;
        this.pontosGanhos = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0
        };
        
        this.detalhes = {
            vantagens: 0,
            desvantagens: 0
        };
        
        // Resetar inputs
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) inputIniciais.value = 150;
        
        const inputCampanha = document.getElementById('pontosGanhos');
        if (inputCampanha) inputCampanha.value = 0;
        
        this.atualizarTudo();
    }
}

// Instância global
let pontosManager = null;

// Inicializador
function inicializarSistemaPontos() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(inicializarSistemaPontos, 500);
    });
} else {
    setTimeout(inicializarSistemaPontos, 500);
}

// Exportar para uso global
window.PontosManager = PontosManager;
window.inicializarSistemaPontos = inicializarSistemaPontos;
window.getPontosManager = () => pontosManager;
window.resetarPontos = () => {
    if (pontosManager) pontosManager.resetarTudo();
};