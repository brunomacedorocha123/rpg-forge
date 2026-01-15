// pontos-manager.js - VERSÃO COMPLETA E FUNCIONAL
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Sistema completo de gastos
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
                catálogo: 0,
                riqueza: 0,
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
        
        // Limites configuráveis
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        // Inicialização
        this.inicializar();
    }
    
    inicializar() {
        this.configurarInputs();
        this.configurarEventos();
        this.atualizarTudo();
    }
    
    configurarInputs() {
        // Pontos Iniciais
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
            });
        }
        
        // Pontos da Campanha
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
            });
        }
        
        // Limite de Desvantagens
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) {
            limiteDesvantagens.value = this.limites.desvantagens;
            limiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarTudo();
            });
        }
        
        // Limite de Peculiaridades
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
        // =========== EVENTOS DE ATRIBUTOS ===========
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE RIQUEZA ===========
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos < 0) {
                    this.gastos.desvantagens.riqueza = Math.abs(pontos);
                    this.gastos.vantagens.riqueza = 0;
                } else if (pontos > 0) {
                    this.gastos.vantagens.riqueza = pontos;
                    this.gastos.desvantagens.riqueza = 0;
                } else {
                    this.gastos.vantagens.riqueza = 0;
                    this.gastos.desvantagens.riqueza = 0;
                }
                
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE CARACTERÍSTICAS FÍSICAS ===========
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined && 
                e.detail.origem === 'caracteristicas_fisicas') {
                const pontos = Math.abs(Math.min(0, e.detail.pontosGastos));
                this.gastos.desvantagens.caracteristicas = pontos;
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE VANTAGENS ===========
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined && e.detail?.tipo) {
                const pontos = e.detail.pontos;
                const tipo = e.detail.tipo.toLowerCase();
                
                switch(tipo) {
                    case 'aparência':
                    case 'aparencia':
                        if (pontos >= 0) {
                            this.gastos.vantagens.aparência = pontos;
                            this.gastos.desvantagens.aparência = 0;
                        } else {
                            this.gastos.desvantagens.aparência = Math.abs(pontos);
                            this.gastos.vantagens.aparência = 0;
                        }
                        break;
                        
                    case 'idiomas':
                        if (pontos >= 0) {
                            this.gastos.vantagens.idiomas = pontos;
                            this.gastos.desvantagens.idiomas = 0;
                        } else {
                            this.gastos.desvantagens.idiomas = Math.abs(pontos);
                            this.gastos.vantagens.idiomas = 0;
                        }
                        break;
                        
                    case 'status social':
                    case 'statussocial':
                    case 'status':
                        if (pontos >= 0) {
                            this.gastos.vantagens.statusSocial = pontos;
                            this.gastos.desvantagens.statusSocial = 0;
                        } else {
                            this.gastos.desvantagens.statusSocial = Math.abs(pontos);
                            this.gastos.vantagens.statusSocial = 0;
                        }
                        break;
                        
                    case 'catálogo':
                    case 'catalogo':
                        this.gastos.vantagens.catálogo = Math.max(0, pontos);
                        break;
                        
                    case 'riqueza':
                        if (pontos >= 0) {
                            this.gastos.vantagens.riqueza = pontos;
                            this.gastos.desvantagens.riqueza = 0;
                        } else {
                            this.gastos.desvantagens.riqueza = Math.abs(pontos);
                            this.gastos.vantagens.riqueza = 0;
                        }
                        break;
                }
                
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE ATRIBUTOS COMPLEMENTARES ===========
        document.addEventListener('atributosComplementaresAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.gastos.vantagens.atributosComplementares = pontos;
                } else {
                    this.gastos.desvantagens.outras = Math.abs(pontos);
                }
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE CARISMA ===========
        document.addEventListener('carismaAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.carisma = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE REPUTAÇÃO ===========
        document.addEventListener('reputacaoAtualizada', (e) => {
            if (e.detail?.pontosPositiva !== undefined && e.detail?.pontosNegativa !== undefined) {
                this.gastos.vantagens.reputacao = Math.max(0, e.detail.pontosPositiva);
                this.gastos.desvantagens.reputacao = Math.max(0, e.detail.pontosNegativa);
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE STATUS SOCIAL ===========
        document.addEventListener('vantagemStatusAtualizada', (e) => {
            if (e.detail?.tipo && e.detail?.pontos !== undefined) {
                const tipo = e.detail.tipo;
                const pontos = e.detail.pontos;
                
                if (['aliados', 'contatos', 'patronos'].includes(tipo)) {
                    this.gastos.vantagens[tipo] = Math.max(0, pontos);
                } else if (['inimigos', 'dependentes'].includes(tipo)) {
                    this.gastos.desvantagens[tipo] = Math.abs(pontos);
                }
                
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE PECULIARIDADES ===========
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // =========== EVENTOS DE PERÍCIAS, TÉCNICAS, MAGIA ===========
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.pericias = Math.max(0, e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.tecnicas = Math.max(0, e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.magia = Math.max(0, e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('equipamentosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.equipamentos = Math.max(0, e.detail.pontos);
                this.atualizarTudo();
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // Calcular vantagens totais (valores positivos)
        let vantagensTotal = 0;
        
        // Atributos (se positivos)
        vantagensTotal += Math.max(0, this.gastos.atributos);
        
        // Todas as vantagens
        Object.values(this.gastos.vantagens).forEach(valor => {
            vantagensTotal += Math.max(0, valor || 0);
        });
        
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // Calcular desvantagens totais (valores negativos)
        let desvantagensTotal = 0;
        
        // Atributos (se negativos)
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos));
        
        // Todas as desvantagens
        Object.values(this.gastos.desvantagens).forEach(valor => {
            desvantagensTotal += Math.abs(valor || 0);
        });
        
        // Peculiaridades são sempre negativas
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Fórmula: Total - Vantagens + Desvantagens
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarDisplay(categoria) {
        const elemento = document.getElementById(`pontos${this.capitalize(categoria)}`);
        if (!elemento) return;
        
        let pontos;
        
        switch(categoria) {
            case 'atributos':
                pontos = this.gastos.atributos;
                elemento.textContent = pontos >= 0 ? `+${pontos}` : `${pontos}`;
                break;
                
            case 'desvantagens':
                pontos = this.calcularTotalDesvantagens();
                elemento.textContent = pontos;
                break;
                
            case 'vantagens':
                pontos = this.gastos.vantagens.catálogo || 0;
                elemento.textContent = pontos;
                break;
                
            case 'peculiaridades':
                pontos = this.gastos.peculiaridades || 0;
                elemento.textContent = pontos;
                break;
                
            case 'pericias':
                pontos = this.gastos.pericias || 0;
                elemento.textContent = pontos;
                break;
                
            case 'tecnicas':
                pontos = this.gastos.tecnicas || 0;
                elemento.textContent = pontos;
                break;
                
            case 'magia':
                pontos = this.gastos.magia || 0;
                elemento.textContent = pontos;
                break;
                
            default:
                pontos = this.gastos[categoria] || 0;
                elemento.textContent = pontos;
        }
        
        // Estilizar cards
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo');
            
            if (categoria === 'desvantagens' || categoria === 'peculiaridades') {
                if (pontos > 0) {
                    card.classList.add('negativo');
                    elemento.style.color = '#e74c3c';
                }
            } else if (pontos > 0) {
                card.classList.add('positivo');
                elemento.style.color = '#27ae60';
            } else {
                elemento.style.color = '#95a5a6';
            }
        }
    }
    
    calcularTotalDesvantagens() {
        let total = 0;
        
        // Desvantagens do sistema
        Object.values(this.gastos.desvantagens).forEach(valor => {
            total += Math.abs(valor || 0);
        });
        
        // Atributos negativos
        total += Math.abs(Math.min(0, this.gastos.atributos));
        
        return total;
    }
    
    atualizarTudo() {
        // Atualizar todas as categorias
        this.atualizarDisplay('atributos');
        this.atualizarDisplay('vantagens');
        this.atualizarDisplay('desvantagens');
        this.atualizarDisplay('peculiaridades');
        this.atualizarDisplay('pericias');
        this.atualizarDisplay('tecnicas');
        this.atualizarDisplay('magia');
        
        // Calcular totais
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos Disponíveis
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
        
        // Pontos Gastos
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
        
        // Atualizar limites
        this.atualizarLimites(calculo.desvantagens);
        
        // Atualizar percentuais
        this.atualizarPercentuais(calculo);
    }
    
    atualizarLimites(desvantagensTotal) {
        // Limite de Desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const percentual = Math.min(100, (desvantagensTotal / this.limites.desvantagens) * 100);
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvantagensTotal}/${this.limites.desvantagens} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
            }
        }
        
        // Limite de Peculiaridades
        const peculiaresTotal = this.gastos.peculiaridades || 0;
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const percentual = Math.min(100, (peculiaresTotal / this.limites.peculiaridades) * 100);
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${peculiaresTotal}/${this.limites.peculiaridades} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
            }
        }
    }
    
    atualizarPercentuais(calculo) {
        const totalPontos = calculo.total;
        
        if (totalPontos <= 0) {
            // Zerar todos os percentuais
            ['Atributos', 'Vantagens', 'Desvantagens', 'Peculiaridades', 'Pericias', 'Tecnicas', 'Magia'].forEach(tipo => {
                const elemento = document.getElementById(`perc${tipo}`);
                if (elemento) elemento.textContent = '0%';
            });
            return;
        }
        
        // Percentual de Atributos
        const percAtributos = document.getElementById('percAtributos');
        if (percAtributos) {
            const percent = Math.round((Math.abs(this.gastos.atributos) / totalPontos) * 100);
            percAtributos.textContent = `${percent}%`;
        }
        
        // Percentual de Vantagens
        const percVantagens = document.getElementById('percVantagens');
        if (percVantagens) {
            const vantagensCatálogo = this.gastos.vantagens.catálogo || 0;
            const percent = Math.round((vantagensCatálogo / totalPontos) * 100);
            percVantagens.textContent = `${percent}%`;
        }
        
        // Percentual de Desvantagens
        const percDesvantagens = document.getElementById('percDesvantagens');
        if (percDesvantagens) {
            const desvTotal = this.calcularTotalDesvantagens();
            const percent = Math.round((desvTotal / totalPontos) * 100);
            percDesvantagens.textContent = `${percent}%`;
        }
        
        // Percentual de Peculiaridades
        const percPeculiaridades = document.getElementById('percPeculiaridades');
        if (percPeculiaridades) {
            const percent = Math.round((this.gastos.peculiaridades / totalPontos) * 100);
            percPeculiaridades.textContent = `${percent}%`;
        }
        
        // Outros percentuais (zero por enquanto)
        ['Pericias', 'Tecnicas', 'Magia'].forEach(tipo => {
            const elemento = document.getElementById(`perc${tipo}`);
            if (elemento) elemento.textContent = '0%';
        });
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Métodos para obter dados específicos
    obterPontosVantagens() {
        return this.gastos.vantagens.catálogo || 0;
    }
    
    obterPontosDesvantagens() {
        return this.calcularTotalDesvantagens();
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    // Método para resetar todos os pontos
    resetar() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Resetar gastos
        this.gastos.atributos = 0;
        
        Object.keys(this.gastos.vantagens).forEach(key => {
            this.gastos.vantagens[key] = 0;
        });
        
        Object.keys(this.gastos.desvantagens).forEach(key => {
            this.gastos.desvantagens[key] = 0;
        });
        
        this.gastos.peculiaridades = 0;
        this.gastos.pericias = 0;
        this.gastos.tecnicas = 0;
        this.gastos.magia = 0;
        this.gastos.equipamentos = 0;
        
        // Resetar limites
        this.limites.desvantagens = 40;
        this.limites.peculiaridades = 20;
        
        // Atualizar inputs
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) inputPontosIniciais.value = this.pontosIniciais;
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) inputPontosGanhos.value = this.pontosGanhosCampanha;
        
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) limiteDesvantagens.value = this.limites.desvantagens;
        
        const limitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (limitePeculiaridades) limitePeculiaridades.value = this.limites.peculiaridades;
        
        this.atualizarTudo();
    }
}

// Instância global
let pontosManagerInstance = null;

// Função de inicialização
function inicializarSistemaPontos() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
    }
    return pontosManagerInstance;
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pontosIniciais')) {
        pontosManagerInstance = new PontosManager();
    }
});

// Exportar para uso global
window.PontosManager = PontosManager;
window.inicializarSistemaPontos = inicializarSistemaPontos;
window.obterPontosManager = function() {
    return pontosManagerInstance;
};
window.resetarPontos = function() {
    if (pontosManagerInstance) {
        pontosManagerInstance.resetar();
    }
};