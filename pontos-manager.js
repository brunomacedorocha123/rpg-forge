// pontos-manager.js - SISTEMA OTIMIZADO (sem logs)
class PontosManager {
    constructor() {
        // VALORES INICIAIS
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // GASTOS INICIAIS
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
        
        // DETALHAMENTO PARA UI
        this.detalhado = {
            vantagens: {
                aparência: 0,
                atributosComplementares: 0,
                idiomas: 0,
                statusSocial: 0,
                carisma: 0,
                reputação: 0,
                aliados: 0,
                contatos: 0,
                patronos: 0,
                catálogo: 0,
                outras: 0
            },
            desvantagens: {
                riqueza: 0,
                característicasFísicas: 0,
                aparência: 0,
                idiomas: 0,
                statusSocial: 0,
                reputação: 0,
                inimigos: 0,
                dependentes: 0,
                catálogo: 0,
                outras: 0
            }
        };
        
        // LIMITES
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarInputsPrincipais();
        this.configurarEventListeners();
        
        setTimeout(() => {
            this.atualizarTudo();
        }, 300);
    }
    
    configurarInputsPrincipais() {
        // Pontos iniciais
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
            });
        }
        
        // Pontos da campanha
        const inputCampanha = document.getElementById('pontosGanhos');
        if (inputCampanha) {
            inputCampanha.value = this.pontosGanhosCampanha;
            inputCampanha.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
            });
        }
        
        // Limite de desvantagens
        const limiteDesv = document.getElementById('limiteDesvantagens');
        if (limiteDesv) {
            limiteDesv.value = this.limites.desvantagens;
            limiteDesv.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarLimites();
            });
        }
        
        // Limite de peculiaridades
        const limitePec = document.getElementById('limitePeculiaridades');
        if (limitePec) {
            limitePec.value = this.limites.peculiaridades;
            limitePec.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarLimites();
            });
        }
    }
    
    configurarEventListeners() {
        // Atributos básicos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.atributos = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Vantagens do catálogo
        document.addEventListener('vantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens = e.detail.pontos;
                this.detalhado.vantagens.catálogo = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // Desvantagens do catálogo
        document.addEventListener('desvantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.desvantagens = Math.abs(e.detail.pontos);
                this.detalhado.desvantagens.catálogo = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // Peculiaridades
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // Aparência
        document.addEventListener('aparênciaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.detalhado.vantagens.aparência = pontos;
                    this.detalhado.desvantagens.aparência = 0;
                } else {
                    this.detalhado.desvantagens.aparência = Math.abs(pontos);
                    this.detalhado.vantagens.aparência = 0;
                }
                this.calcularTotaisDetalhados();
            }
        });
        
        // Características físicas
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.detalhado.desvantagens.característicasFísicas = Math.abs(e.detail.pontos);
                this.calcularTotaisDetalhados();
            }
        });
        
        // Riqueza
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.detalhado.vantagens.outras = pontos;
                    this.detalhado.desvantagens.riqueza = 0;
                } else {
                    this.detalhado.desvantagens.riqueza = Math.abs(pontos);
                    this.detalhado.vantagens.outras = 0;
                }
                this.calcularTotaisDetalhados();
            }
        });
        
        // Status social
        document.addEventListener('statusSocialAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.detalhado.vantagens.statusSocial = pontos;
                    this.detalhado.desvantagens.statusSocial = 0;
                } else {
                    this.detalhado.desvantagens.statusSocial = Math.abs(pontos);
                    this.detalhado.vantagens.statusSocial = 0;
                }
                this.calcularTotaisDetalhados();
            }
        });
        
        // Idiomas
        document.addEventListener('idiomasAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.detalhado.desvantagens.idiomas = Math.abs(e.detail.pontos);
                this.calcularTotaisDetalhados();
            }
        });
    }
    
    calcularTotaisDetalhados() {
        let vantagensTotal = 0;
        Object.values(this.detalhado.vantagens).forEach(valor => {
            vantagensTotal += Math.max(0, valor);
        });
        
        let desvantagensTotal = 0;
        Object.values(this.detalhado.desvantagens).forEach(valor => {
            desvantagensTotal += Math.abs(valor);
        });
    }
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // GASTOS (custam pontos)
        let totalGastos = 0;
        totalGastos += Math.max(0, this.gastos.atributos);
        totalGastos += this.gastos.vantagens;
        totalGastos += this.gastos.pericias;
        totalGastos += this.gastos.tecnicas;
        totalGastos += this.gastos.magia;
        totalGastos += this.gastos.equipamentos;
        
        // Vantagens de outras fontes
        let vantagensOutras = 0;
        Object.values(this.detalhado.vantagens).forEach(valor => {
            vantagensOutras += Math.max(0, valor);
        });
        totalGastos += vantagensOutras;
        
        // PONTOS GANHOS (dão pontos)
        let totalGanhos = 0;
        totalGanhos += Math.abs(Math.min(0, this.gastos.atributos));
        totalGanhos += this.gastos.desvantagens;
        totalGanhos += this.gastos.peculiaridades;
        
        // Desvantagens de outras fontes
        let desvantagensOutras = 0;
        Object.values(this.detalhado.desvantagens).forEach(valor => {
            desvantagensOutras += Math.abs(valor);
        });
        totalGanhos += desvantagensOutras;
        
        const disponiveis = totalBase - totalGastos + totalGanhos;
        
        return {
            total: totalBase,
            gastos: totalGastos,
            ganhos: totalGanhos,
            disponiveis: disponiveis,
            vantagens: this.gastos.vantagens + vantagensOutras,
            desvantagens: this.gastos.desvantagens + desvantagensOutras
        };
    }
    
    atualizarTudo() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Atualizar cards principais
        this.atualizarCard('atributos', this.gastos.atributos);
        this.atualizarCard('vantagens', this.gastos.vantagens);
        this.atualizarCard('desvantagens', this.gastos.desvantagens);
        this.atualizarCard('peculiaridades', this.gastos.peculiaridades);
        
        // Atualizar pontos disponíveis
        const dispEl = document.getElementById('pontosDisponiveis');
        if (dispEl) {
            dispEl.textContent = calculo.disponiveis;
            
            // Colorir
            if (calculo.disponiveis < 0) {
                dispEl.style.color = '#e74c3c';
            } else if (calculo.disponiveis < 10) {
                dispEl.style.color = '#f39c12';
            } else {
                dispEl.style.color = '#27ae60';
            }
        }
        
        // Atualizar total gasto
        const gastosEl = document.getElementById('pontosGastos');
        if (gastosEl) {
            gastosEl.textContent = calculo.gastos;
        }
        
        // Atualizar limites e percentuais
        this.atualizarLimites();
        this.atualizarPercentuais(calculo.total);
    }
    
    atualizarCard(tipo, valor) {
        const elemento = document.getElementById(`pontos${this.capitalize(tipo)}`);
        if (!elemento) return;
        
        // Formatar valor
        if (tipo === 'atributos') {
            elemento.textContent = valor >= 0 ? `+${valor}` : valor;
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
    
    atualizarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite de desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const desvTotal = calculo.desvantagens;
            const limite = this.limites.desvantagens;
            const percentual = Math.min(100, (desvTotal / limite) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvTotal}/${limite} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            // Colorir
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
            
            // Colorir
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
            const percentEl = document.getElementById(`perc${this.capitalize(tipo)}`);
            
            if (percentEl) {
                const percentual = Math.round((Math.abs(valor) / totalBase) * 100);
                percentEl.textContent = `${percentual}%`;
                
                // Colorir percentuais altos
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
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Métodos públicos para outros módulos
    adicionarVantagem(pontos, tipo = 'catálogo') {
        if (tipo === 'catálogo') {
            this.gastos.vantagens += pontos;
        } else {
            this.detalhado.vantagens[tipo] = (this.detalhado.vantagens[tipo] || 0) + pontos;
        }
        this.atualizarTudo();
        return true;
    }
    
    adicionarDesvantagem(pontos, tipo = 'catálogo') {
        const pontosAbs = Math.abs(pontos);
        if (tipo === 'catálogo') {
            this.gastos.desvantagens += pontosAbs;
        } else {
            this.detalhado.desvantagens[tipo] = (this.detalhado.desvantagens[tipo] || 0) + pontosAbs;
        }
        this.atualizarTudo();
        return true;
    }
    
    removerVantagem(pontos, tipo = 'catálogo') {
        if (tipo === 'catálogo') {
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - Math.abs(pontos));
        } else {
            this.detalhado.vantagens[tipo] = Math.max(0, (this.detalhado.vantagens[tipo] || 0) - Math.abs(pontos));
        }
        this.atualizarTudo();
        return true;
    }
    
    removerDesvantagem(pontos, tipo = 'catálogo') {
        const pontosAbs = Math.abs(pontos);
        if (tipo === 'catálogo') {
            this.gastos.desvantagens = Math.max(0, this.gastos.desvantagens - pontosAbs);
        } else {
            this.detalhado.desvantagens[tipo] = Math.max(0, (this.detalhado.desvantagens[tipo] || 0) - pontosAbs);
        }
        this.atualizarTudo();
        return true;
    }
    
    obterResumo() {
        return this.calcularPontosDisponiveis();
    }
    
    resetarTudo() {
        // Resetar gastos
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
        
        // Resetar detalhado
        this.detalhado = {
            vantagens: {
                aparência: 0,
                atributosComplementares: 0,
                idiomas: 0,
                statusSocial: 0,
                carisma: 0,
                reputação: 0,
                aliados: 0,
                contatos: 0,
                patronos: 0,
                catálogo: 0,
                outras: 0
            },
            desvantagens: {
                riqueza: 0,
                característicasFísicas: 0,
                aparência: 0,
                idiomas: 0,
                statusSocial: 0,
                reputação: 0,
                inimigos: 0,
                dependentes: 0,
                catálogo: 0,
                outras: 0
            }
        };
        
        this.atualizarTudo();
    }
}

// Instância global
let pontosManagerInstance = null;

// Inicializador
function inicializarSistemaPontos() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
    }
    return pontosManagerInstance;
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
window.getPontosManager = () => pontosManagerInstance;
window.resetarPontos = () => {
    if (pontosManagerInstance) {
        pontosManagerInstance.resetarTudo();
    }
};