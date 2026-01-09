// ===========================================
// PONTOS-MANAGER.JS - SISTEMA COMPLETO GURPS
// VERSÃO: 4.0 - DEFINITIVA E FUNCIONAL
// ===========================================

class PontosManager {
    constructor() {
        // CONFIGURAÇÃO INICIAL
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // SISTEMA DE GASTOS (CUSTA PONTOS)
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // SISTEMA DE DESVANTAGENS (DÁ PONTOS)
        this.desvantagens = {
            total: 0,
            peculiaridades: 0
        };
        
        // REGISTRO POR FONTE
        this.registroDesvantagens = {};
        
        // LIMITES
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
        this.carregarDadosSalvos();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
    }
    
    configurarInputs() {
        // Pontos Iniciais
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        // Pontos da Campanha
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) {
            inputGanhos.value = this.pontosGanhosCampanha;
            inputGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        // Limite Desvantagens
        const limiteDesv = document.getElementById('limiteDesvantagens');
        if (limiteDesv) {
            limiteDesv.value = this.limites.desvantagens;
            limiteDesv.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvarDados();
            });
        }
        
        // Limite Peculiaridades
        const limitePec = document.getElementById('limitePeculiaridades');
        if (limitePec) {
            limitePec.value = this.limites.peculiaridades;
            limitePec.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.verificarLimites();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        // Evento: Atributos atualizados
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.atualizarGastos('atributos', e.detail.pontosGastos);
            }
        });
        
        // Evento: Vantagens atualizadas
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.atualizarGastos('vantagens', e.detail.pontosGastos);
            }
        });
        
        // Evento: Riqueza atualizada
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // Vantagem (custa pontos)
                    this.atualizarGastos('vantagens', pontos);
                } else if (pontos < 0) {
                    // Desvantagem (dá pontos)
                    this.atualizarDesvantagemFonte('riqueza', Math.abs(pontos), e.detail?.nome || 'Riqueza');
                } else {
                    // Neutro
                    this.atualizarDesvantagemFonte('riqueza', 0, 'Médio');
                }
            }
        });
        
        // Evento: Características físicas atualizadas
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = Math.abs(e.detail.pontos);
                this.atualizarDesvantagemFonte('caracteristicas_fisicas', pontos, 'Características Físicas');
            }
        });
    }
    
    // ========== MÉTODOS PRINCIPAIS ==========
    
    atualizarGastos(categoria, pontos) {
        if (this.gastos[categoria] === undefined) return;
        
        const pontosAnteriores = this.gastos[categoria];
        const novosPontos = Math.max(0, pontos);
        
        if (pontosAnteriores !== novosPontos) {
            this.gastos[categoria] = novosPontos;
            this.atualizarDisplayGastos(categoria);
            this.atualizarTotais();
            this.salvarDados();
        }
    }
    
    atualizarDesvantagemFonte(fonte, pontos, descricao = '') {
        const pontosAnteriores = this.registroDesvantagens[fonte]?.valor || 0;
        const novosPontos = Math.max(0, pontos);
        
        if (pontosAnteriores !== novosPontos) {
            // Atualizar registro
            this.registroDesvantagens[fonte] = {
                valor: novosPontos,
                descricao: descricao,
                timestamp: new Date().toISOString()
            };
            
            // RECALCULAR TOTAL de desvantagens
            this.recalcularDesvantagens();
            
            // Atualizar displays
            this.atualizarDisplayDesvantagens();
            this.atualizarTotais();
            this.verificarLimites();
            this.salvarDados();
        }
    }
    
    recalcularDesvantagens() {
        let total = 0;
        
        // Somar TODAS as fontes de desvantagens
        Object.values(this.registroDesvantagens).forEach(fonte => {
            total += fonte.valor;
        });
        
        // Atualizar total
        this.desvantagens.total = total;
    }
    
    calcularPontosDisponiveis() {
        // Pontos base disponíveis
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // Total gasto em vantagens
        let totalGastos = 0;
        Object.values(this.gastos).forEach(valor => {
            totalGastos += valor;
        });
        
        // Total ganho com desvantagens
        const totalDesvantagens = this.desvantagens.total;
        const totalPeculiaridades = Math.abs(this.desvantagens.peculiaridades);
        const totalGanhos = totalDesvantagens + totalPeculiaridades;
        
        // Cálculo final
        const pontosDisponiveis = totalBase - totalGastos + totalGanhos;
        
        return {
            base: totalBase,
            gastos: totalGastos,
            ganhos: totalGanhos,
            disponiveis: pontosDisponiveis,
            desvantagens: totalDesvantagens,
            peculiaridades: totalPeculiaridades
        };
    }
    
    // ========== ATUALIZAÇÃO DE DISPLAY ==========
    
    atualizarTudo() {
        // Atualizar todos os gastos
        Object.keys(this.gastos).forEach(cat => {
            this.atualizarDisplayGastos(cat);
        });
        
        // Atualizar desvantagens
        this.atualizarDisplayDesvantagens();
        
        // Atualizar totais e limites
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayGastos(categoria) {
        const elemento = document.getElementById(`pontos${this.capitalizar(categoria)}`);
        const percentElement = document.getElementById(`perc${this.capitalizar(categoria)}`);
        
        if (!elemento) return;
        
        const pontos = this.gastos[categoria] || 0;
        elemento.textContent = pontos;
        
        // Aplicar estilo
        const parent = elemento.closest('.category');
        if (parent) {
            parent.classList.remove('negativo', 'positivo');
            if (pontos > 0) {
                parent.classList.add('positivo');
            }
        }
        
        // Atualizar percentual
        if (percentElement) {
            const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
            if (totalBase > 0) {
                const percent = Math.round((pontos / totalBase) * 100);
                percentElement.textContent = `${percent}%`;
                percentElement.style.color = percent > 50 ? '#e74c3c' : 
                                           percent > 25 ? '#f39c12' : '#27ae60';
            } else {
                percentElement.textContent = '0%';
            }
        }
    }
    
    atualizarDisplayDesvantagens() {
        // DESVANTAGENS
        const elementoDesv = document.getElementById('pontosDesvantagens');
        const percentDesv = document.getElementById('percDesvantagens');
        
        if (elementoDesv) {
            const totalDesv = this.desvantagens.total || 0;
            elementoDesv.textContent = totalDesv;
            
            // Estilo para desvantagens
            const parentDesv = elementoDesv.closest('.category');
            if (parentDesv) {
                parentDesv.classList.remove('positivo', 'negativo');
                if (totalDesv > 0) {
                    parentDesv.classList.add('negativo');
                }
            }
            
            // Percentual
            if (percentDesv) {
                const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
                if (totalBase > 0) {
                    const percent = Math.round((totalDesv / totalBase) * 100);
                    percentDesv.textContent = `${percent}%`;
                    percentDesv.style.color = percent > 50 ? '#e74c3c' : 
                                            percent > 25 ? '#f39c12' : '#3498db';
                } else {
                    percentDesv.textContent = '0%';
                }
            }
        }
        
        // PECULIARIDADES
        const elementoPec = document.getElementById('pontosPeculiaridades');
        const percentPec = document.getElementById('percPeculiaridades');
        
        if (elementoPec) {
            const totalPec = Math.abs(this.desvantagens.peculiaridades) || 0;
            elementoPec.textContent = totalPec;
            
            const parentPec = elementoPec.closest('.category');
            if (parentPec) {
                parentPec.classList.remove('positivo', 'negativo');
                if (totalPec > 0) {
                    parentPec.classList.add('negativo');
                }
            }
            
            if (percentPec) {
                const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
                if (totalBase > 0) {
                    const percent = Math.round((totalPec / totalBase) * 100);
                    percentPec.textContent = `${percent}%`;
                    percentPec.style.color = percent > 50 ? '#e74c3c' : 
                                           percent > 25 ? '#f39c12' : '#3498db';
                } else {
                    percentPec.textContent = '0%';
                }
            }
        }
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos Disponíveis
        const dispElement = document.getElementById('pontosDisponiveis');
        if (dispElement) {
            dispElement.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                dispElement.style.color = '#e74c3c';
                dispElement.style.fontWeight = 'bold';
            } else if (calculo.disponiveis > 0) {
                dispElement.style.color = '#27ae60';
                dispElement.style.fontWeight = 'bold';
            } else {
                dispElement.style.color = '';
                dispElement.style.fontWeight = '';
            }
        }
        
        // Total Gastos
        const gastosElement = document.getElementById('pontosGastos');
        if (gastosElement) {
            gastosElement.textContent = calculo.gastos;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite de Desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const desvAtuais = calculo.desvantagens;
            const limite = this.limites.desvantagens;
            const percentual = Math.min(100, (desvAtuais / limite) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            progressDesv.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                               percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesv.textContent = `${desvAtuais}/${limite} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            // Aviso visual se ultrapassar
            if (desvAtuais > limite) {
                progressDesv.style.animation = 'pulse 1s infinite';
            } else {
                progressDesv.style.animation = '';
            }
        }
        
        // Limite de Peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const pecAtuais = calculo.peculiaridades;
            const limite = this.limites.peculiaridades;
            const percentual = Math.min(100, (pecAtuais / limite) * 100);
            
            progressPec.style.width = `${percentual}%`;
            progressPec.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                              percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPec.textContent = `${pecAtuais}/${limite} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    // ========== UTILITÁRIOS ==========
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // ========== SALVAR/CARREGAR ==========
    
    salvarDados() {
        const dados = {
            versao: '4.0',
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagens: { ...this.desvantagens },
            registroDesvantagens: { ...this.registroDesvantagens },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('rpgforge_pontos_final', JSON.stringify(dados));
    }
    
    carregarDadosSalvos() {
        try {
            const dadosStr = localStorage.getItem('rpgforge_pontos_final');
            if (dadosStr) {
                const dados = JSON.parse(dadosStr);
                this.aplicarDados(dados);
                return true;
            }
        } catch (error) {
            // Silencioso em caso de erro
        }
        return false;
    }
    
    aplicarDados(dados) {
        if (!dados) return;
        
        // Pontos base
        if (dados.pontosIniciais !== undefined) {
            this.pontosIniciais = dados.pontosIniciais;
            const input = document.getElementById('pontosIniciais');
            if (input) input.value = this.pontosIniciais;
        }
        
        if (dados.pontosGanhosCampanha !== undefined) {
            this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
            const input = document.getElementById('pontosGanhos');
            if (input) input.value = this.pontosGanhosCampanha;
        }
        
        // Gastos
        if (dados.gastos) {
            Object.keys(dados.gastos).forEach(key => {
                if (this.gastos[key] !== undefined) {
                    this.gastos[key] = dados.gastos[key];
                }
            });
        }
        
        // Desvantagens
        if (dados.desvantagens) {
            Object.keys(dados.desvantagens).forEach(key => {
                if (this.desvantagens[key] !== undefined) {
                    this.desvantagens[key] = dados.desvantagens[key];
                }
            });
        }
        
        // Registro
        if (dados.registroDesvantagens) {
            this.registroDesvantagens = { ...dados.registroDesvantagens };
        }
        
        // Limites
        if (dados.limites) {
            Object.keys(dados.limites).forEach(key => {
                if (this.limites[key] !== undefined) {
                    this.limites[key] = dados.limites[key];
                    const input = document.getElementById(`limite${this.capitalizar(key)}`);
                    if (input) input.value = this.limites[key];
                }
            });
        }
        
        this.atualizarTudo();
    }
    
    // ========== API PÚBLICA ==========
    
    obterResumo() {
        return this.calcularPontosDisponiveis();
    }
    
    obterDesvantagensDetalhadas() {
        return {
            total: this.desvantagens.total,
            fontes: { ...this.registroDesvantagens },
            peculiaridades: Math.abs(this.desvantagens.peculiaridades)
        };
    }
    
    resetar() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Zerar gastos
        Object.keys(this.gastos).forEach(key => {
            this.gastos[key] = 0;
        });
        
        // Zerar desvantagens
        this.desvantagens.total = 0;
        this.desvantagens.peculiaridades = 0;
        this.registroDesvantagens = {};
        
        // Limites padrão
        this.limites.desvantagens = 40;
        this.limites.peculiaridades = 20;
        
        // Atualizar inputs
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) inputIniciais.value = 150;
        
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) inputGanhos.value = 0;
        
        const limiteDesv = document.getElementById('limiteDesvantagens');
        if (limiteDesv) limiteDesv.value = 40;
        
        const limitePec = document.getElementById('limitePeculiaridades');
        if (limitePec) limitePec.value = 20;
        
        this.atualizarTudo();
        this.salvarDados();
    }
}

// ========== INSTÂNCIA GLOBAL ==========

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// ========== FUNÇÕES GLOBAIS ==========

window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarGastosPontos = (categoria, pontos) => {
    if (pontosManager) {
        pontosManager.atualizarGastos(categoria, pontos);
        return true;
    }
    return false;
};

window.atualizarDesvantagemPontos = (fonte, pontos, descricao = '') => {
    if (pontosManager) {
        pontosManager.atualizarDesvantagemFonte(fonte, pontos, descricao);
        return true;
    }
    return false;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterResumo().disponiveis;
    }
    return 150;
};

window.resetarPontos = () => {
    if (pontosManager) {
        pontosManager.resetar();
    }
};

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        inicializarPontosManager();
    }, 100);
});

// Adicionar estilos CSS necessários
if (!document.querySelector('#estilos-pontos-final')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilos-pontos-final';
    estilo.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .category.positivo {
            background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(39, 174, 96, 0.05));
            border-left: 4px solid #27ae60;
        }
        
        .category.negativo {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
            border-left: 4px solid #e74c3c;
        }
        
        .category.negativo .category-header {
            color: #e74c3c;
        }
        
        .category.negativo .category-value {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .category.positivo .category-header {
            color: #27ae60;
        }
        
        .category.positivo .category-value {
            color: #27ae60;
            font-weight: bold;
        }
        
        .progress-bar {
            height: 8px;
            background: #ecf0f1;
            border-radius: 4px;
            overflow: hidden;
            margin: 8px 0;
        }
        
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(estilo);
}