// pontos-manager.js - VERSÃO CORRIGIDA COMPLETA
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
        
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarInputs();
        this.configurarEventos();
        this.carregarEstado();
        this.atualizarTudo();
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.salvarEstado();
                this.atualizarTudo();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.salvarEstado();
                this.atualizarTudo();
            });
        }
        
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) {
            limiteDesvantagens.value = this.limites.desvantagens;
            limiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.salvarEstado();
                this.atualizarTudo();
            });
        }
        
        const limitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (limitePeculiaridades) {
            limitePeculiaridades.value = this.limites.peculiaridades;
            limitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.salvarEstado();
                this.atualizarTudo();
            });
        }
    }
    
    configurarEventos() {
        // Evento de atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de riqueza - IMPORTANTE: NÃO MEXER, JÁ FUNCIONA
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
                
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de características físicas
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined && 
                e.detail.origem === 'caracteristicas_fisicas') {
                const pontos = Math.abs(Math.min(0, e.detail.pontosGastos));
                this.gastos.desvantagens.caracteristicas = pontos;
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de vantagens - CORRIGIDO PARA FUNCIONAR
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined && e.detail?.tipo) {
                const pontos = e.detail.pontos;
                const tipo = e.detail.tipo.toLowerCase();
                
                console.log(`📥 Recebendo pontos de vantagens: ${tipo} = ${pontos}`);
                
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
                        // NÃO MEXER - JÁ É GERENCIADO POR OUTRO EVENTO
                        break;
                        
                    default:
                        // Para outras vantagens não especificadas
                        this.gastos.vantagens.outras = Math.max(0, pontos);
                }
                
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de atributos complementares - CORRIGIDO
        document.addEventListener('atributosComplementaresAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                console.log(`📥 Atributos complementares: ${pontos} pontos`);
                
                if (pontos >= 0) {
                    this.gastos.vantagens.atributosComplementares = pontos;
                    // Limpar qualquer valor negativo em outras desvantagens
                    if (this.gastos.desvantagens.outras < 0) {
                        this.gastos.desvantagens.outras = 0;
                    }
                } else {
                    this.gastos.desvantagens.outras = Math.abs(pontos);
                    this.gastos.vantagens.atributosComplementares = 0;
                }
                
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de carisma
        document.addEventListener('carismaAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.carisma = e.detail.pontos;
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de reputação
        document.addEventListener('reputacaoAtualizada', (e) => {
            if (e.detail?.pontosPositiva !== undefined && e.detail?.pontosNegativa !== undefined) {
                this.gastos.vantagens.reputacao = Math.max(0, e.detail.pontosPositiva);
                this.gastos.desvantagens.reputacao = Math.max(0, e.detail.pontosNegativa);
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de aliados/contatos/patronos
        document.addEventListener('vantagemStatusAtualizada', (e) => {
            if (e.detail?.tipo && e.detail?.pontos !== undefined) {
                const tipo = e.detail.tipo;
                const pontos = e.detail.pontos;
                
                console.log(`📥 Status social: ${tipo} = ${pontos} pontos`);
                
                if (['aliados', 'contatos', 'patronos'].includes(tipo)) {
                    this.gastos.vantagens[tipo] = Math.max(0, pontos);
                } else if (['inimigos', 'dependentes'].includes(tipo)) {
                    this.gastos.desvantagens[tipo] = Math.abs(pontos);
                }
                
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Evento de peculiaridades
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        // Eventos futuros (mantidos para compatibilidade)
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.pericias = Math.max(0, e.detail.pontos);
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.tecnicas = Math.max(0, e.detail.pontos);
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.magia = Math.max(0, e.detail.pontos);
                this.salvarEstado();
                this.atualizarTudo();
            }
        });
        
        document.addEventListener('equipamentosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.equipamentos = Math.max(0, e.detail.pontos);
                this.salvarEstado();
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
        
        if (categoria === 'atributos') {
            pontos = this.gastos.atributos;
            elemento.textContent = pontos >= 0 ? `+${pontos}` : `${pontos}`;
        } else if (categoria === 'desvantagens') {
            pontos = this.calcularTotalDesvantagens();
            elemento.textContent = pontos;
        } else if (categoria === 'vantagens') {
            pontos = this.gastos.vantagens.catálogo || 0;
            elemento.textContent = pontos;
        } else if (categoria === 'peculiaridades') {
            pontos = this.gastos.peculiaridades || 0;
            elemento.textContent = pontos;
        } else if (categoria === 'pericias') {
            pontos = this.gastos.pericias || 0;
            elemento.textContent = pontos;
        } else if (categoria === 'tecnicas') {
            pontos = this.gastos.tecnicas || 0;
            elemento.textContent = pontos;
        } else if (categoria === 'magia') {
            pontos = this.gastos.magia || 0;
            elemento.textContent = pontos;
        } else {
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
    
    salvarEstado() {
        try {
            const estado = {
                pontosIniciais: this.pontosIniciais,
                pontosGanhosCampanha: this.pontosGanhosCampanha,
                gastos: this.gastos,
                limites: this.limites,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gurps_pontos_manager', JSON.stringify(estado));
        } catch (error) {
            console.warn('Não foi possível salvar estado dos pontos:', error);
        }
    }
    
    carregarEstado() {
        try {
            const estadoSalvo = localStorage.getItem('gurps_pontos_manager');
            if (estadoSalvo) {
                const estado = JSON.parse(estadoSalvo);
                
                if (estado.pontosIniciais !== undefined) this.pontosIniciais = estado.pontosIniciais;
                if (estado.pontosGanhosCampanha !== undefined) this.pontosGanhosCampanha = estado.pontosGanhosCampanha;
                if (estado.gastos) this.gastos = estado.gastos;
                if (estado.limites) this.limites = estado.limites;
                
                const inputPontosIniciais = document.getElementById('pontosIniciais');
                if (inputPontosIniciais) inputPontosIniciais.value = this.pontosIniciais;
                
                const inputPontosGanhos = document.getElementById('pontosGanhos');
                if (inputPontosGanhos) inputPontosGanhos.value = this.pontosGanhosCampanha;
                
                const limiteDesvantagens = document.getElementById('limiteDesvantagens');
                if (limiteDesvantagens) limiteDesvantagens.value = this.limites.desvantagens;
                
                const limitePeculiaridades = document.getElementById('limitePeculiaridades');
                if (limitePeculiaridades) limitePeculiaridades.value = this.limites.peculiaridades;
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar estado dos pontos:', error);
        }
        return false;
    }
    
    obterPontosVantagens() {
        return this.gastos.vantagens.catálogo || 0;
    }
    
    obterPontosDesvantagens() {
        return this.calcularTotalDesvantagens();
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    // Método para testar a comunicação
    testarRecebimentoDePontos(tipo, pontos) {
        console.log(`🧪 Teste: Recebendo ${pontos} pontos do tipo ${tipo}`);
        
        const evento = new CustomEvent('vantagensAtualizadas', {
            detail: { tipo: tipo, pontos: pontos }
        });
        document.dispatchEvent(evento);
        
        setTimeout(() => {
            console.log(`✅ Teste concluído. Pontos de ${tipo}: ${this.gastos.vantagens[tipo] || 0}`);
        }, 500);
    }
    
    resetar() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
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
        
        this.limites.desvantagens = 40;
        this.limites.peculiaridades = 20;
        
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) inputPontosIniciais.value = this.pontosIniciais;
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) inputPontosGanhos.value = this.pontosGanhosCampanha;
        
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) limiteDesvantagens.value = this.limites.desvantagens;
        
        const limitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (limitePeculiaridades) limitePeculiaridades.value = this.limites.peculiaridades;
        
        localStorage.removeItem('gurps_pontos_manager');
        this.atualizarTudo();
    }
}

// Instância global
let pontosManagerInstance = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pontosIniciais')) {
        pontosManagerInstance = new PontosManager();
        console.log('✅ PontosManager inicializado com sucesso!');
        
        // Teste automático após 3 segundos
        setTimeout(() => {
            if (pontosManagerInstance && typeof pontosManagerInstance.testarRecebimentoDePontos === 'function') {
                pontosManagerInstance.testarRecebimentoDePontos('aparência', 10);
                pontosManagerInstance.testarRecebimentoDePontos('idiomas', 5);
            }
        }, 3000);
    }
});

// Exportar para uso global
window.PontosManager = PontosManager;
window.inicializarSistemaPontos = function() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
    }
    return pontosManagerInstance;
};
window.obterPontosManager = function() {
    return pontosManagerInstance;
};
window.resetarPontos = function() {
    if (pontosManagerInstance) {
        pontosManagerInstance.resetar();
    }
};
window.testarPontos = function(tipo, pontos) {
    if (pontosManagerInstance) {
        pontosManagerInstance.testarRecebimentoDePontos(tipo, pontos);
    }
};