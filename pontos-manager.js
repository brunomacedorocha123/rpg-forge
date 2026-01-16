// pontos-manager.js - SISTEMA 100% FUNCIONAL
class PontosManager {
    constructor() {
        console.log('🎯 PontosManager: Inicializando sistema...');
        
        // VALORES INICIAIS CORRETOS
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // GASTOS INICIAIS EM ZERO
        this.gastos = {
            atributos: 0,       // + ou - dependendo dos atributos
            vantagens: 0,       // SOMENTE vantagens do catálogo
            desvantagens: 0,    // SOMENTE desvantagens do catálogo
            peculiaridades: 0,  // SEMPRE negativo (ou zero)
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // RASTREAMENTO DETALHADO (para debug e UI)
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
        console.log('🎯 PontosManager: Configurando...');
        
        // 1. Configurar inputs da aba principal
        this.configurarInputsPrincipais();
        
        // 2. Configurar ouvintes de eventos
        this.configurarEventListeners();
        
        // 3. Forçar atualização inicial CORRETA
        setTimeout(() => {
            this.atualizarTudo();
            console.log('🎯 PontosManager: Inicialização completa!');
            console.log('🎯 Valores iniciais:', this.obterResumo());
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
        console.log('🎯 PontosManager: Configurando listeners...');
        
        // ============== ATRIBUTOS BÁSICOS ==============
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('📊 Atributos atualizados:', e.detail.pontos);
                this.gastos.atributos = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // ============== VANTAGENS DO CATÁLOGO ==============
        document.addEventListener('vantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('⭐ Vantagens catálogo:', e.detail.pontos);
                this.gastos.vantagens = e.detail.pontos;
                this.detalhado.vantagens.catálogo = e.detail.pontos;
                this.atualizarTudo();
            }
        });
        
        // ============== DESVANTAGENS DO CATÁLOGO ==============
        document.addEventListener('desvantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('⚠️ Desvantagens catálogo:', e.detail.pontos);
                this.gastos.desvantagens = Math.abs(e.detail.pontos);
                this.detalhado.desvantagens.catálogo = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // ============== PECULIARIDADES ==============
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('🎭 Peculiaridades:', e.detail.pontos);
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.atualizarTudo();
            }
        });
        
        // ============== APARÊNCIA ==============
        document.addEventListener('aparênciaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('👤 Aparência:', e.detail.pontos);
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
        
        // ============== CARACTERÍSTICAS FÍSICAS ==============
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('💪 Características físicas:', e.detail.pontos);
                this.detalhado.desvantagens.característicasFísicas = Math.abs(e.detail.pontos);
                this.calcularTotaisDetalhados();
            }
        });
        
        // ============== RIQUEZA ==============
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('💰 Riqueza:', e.detail.pontos);
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
        
        // ============== STATUS SOCIAL ==============
        document.addEventListener('statusSocialAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('👑 Status social:', e.detail.pontos);
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
        
        // ============== IDIOMAS ==============
        document.addEventListener('idiomasAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                console.log('🗣️ Idiomas:', e.detail.pontos);
                this.detalhado.desvantagens.idiomas = Math.abs(e.detail.pontos);
                this.calcularTotaisDetalhados();
            }
        });
    }
    
    calcularTotaisDetalhados() {
        // Calcular vantagens totais (exceto catálogo)
        let vantagensTotal = 0;
        Object.values(this.detalhado.vantagens).forEach(valor => {
            vantagensTotal += Math.max(0, valor);
        });
        
        // Calcular desvantagens totais (exceto catálogo)
        let desvantagensTotal = 0;
        Object.values(this.detalhado.desvantagens).forEach(valor => {
            desvantagensTotal += Math.abs(valor);
        });
        
        console.log('🧮 Totais detalhados:', { vantagensTotal, desvantagensTotal });
        
        // NÃO atualiza this.gastos.vantagens/desvantagens aqui
        // Esses são só para vantagens/desvantagens do CATÁLOGO
    }
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // GASTOS com vantagens (valores positivos que CUSTAM pontos)
        let totalGastos = 0;
        totalGastos += Math.max(0, this.gastos.atributos);  // Atributos positivos
        totalGastos += this.gastos.vantagens;               // Vantagens catálogo
        totalGastos += this.gastos.pericias;
        totalGastos += this.gastos.tecnicas;
        totalGastos += this.gastos.magia;
        totalGastos += this.gastos.equipamentos;
        
        // Calcular vantagens de outras fontes (aparência, status, etc)
        let vantagensOutras = 0;
        Object.values(this.detalhado.vantagens).forEach(valor => {
            vantagensOutras += Math.max(0, valor);
        });
        totalGastos += vantagensOutras;
        
        // PONTOS GANHOS com desvantagens (valores negativos que DÃO pontos)
        let totalGanhos = 0;
        totalGanhos += Math.abs(Math.min(0, this.gastos.atributos));  // Atributos negativos
        totalGanhos += this.gastos.desvantagens;                     // Desvantagens catálogo
        totalGanhos += this.gastos.peculiaridades;                   // Peculiaridades
        
        // Calcular desvantagens de outras fontes
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
        
        console.log('📈 Atualizando displays com:', calculo);
        
        // 1. Atualizar cards principais
        this.atualizarCard('atributos', this.gastos.atributos);
        this.atualizarCard('vantagens', this.gastos.vantagens);
        this.atualizarCard('desvantagens', this.gastos.desvantagens);
        this.atualizarCard('peculiaridades', this.gastos.peculiaridades);
        
        // 2. Atualizar pontos disponíveis
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
        
        // 3. Atualizar total gasto
        const gastosEl = document.getElementById('pontosGastos');
        if (gastosEl) {
            gastosEl.textContent = calculo.gastos;
        }
        
        // 4. Atualizar limites
        this.atualizarLimites();
        
        // 5. Atualizar percentuais
        this.atualizarPercentuais(calculo.total);
        
        console.log('✅ Pontos atualizados!');
    }
    
    atualizarCard(tipo, valor) {
        const elemento = document.getElementById(`pontos${this.capitalize(tipo)}`);
        if (!elemento) {
            console.warn(`❌ Card não encontrado: pontos${this.capitalize(tipo)}`);
            return;
        }
        
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
        console.log('🔄 Resetando todos os pontos...');
        
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
        console.log('✅ Pontos resetados com sucesso!');
    }
}

// Instância global
let pontosManagerInstance = null;

// Inicializador
function inicializarSistemaPontos() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
        console.log('🚀 Sistema de pontos inicializado!');
        
        // Expor no console para debug
        window.debugPontos = () => {
            console.log('=== DEBUG PONTOS ===');
            console.log('Instância:', pontosManagerInstance);
            console.log('Resumo:', pontosManagerInstance.obterResumo());
            console.log('Gastos:', pontosManagerInstance.gastos);
            console.log('Detalhado:', pontosManagerInstance.detalhado);
            console.log('===================');
        };
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