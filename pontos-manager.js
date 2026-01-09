// ===========================================
// PONTOS-MANAGER.JS - VERSÃO QUE NÃO MUDA NADA
// ===========================================

class PontosManager {
    constructor() {
        // PONTOS BASE
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // GASTOS - MESMA ESTRUTURA DO SEU HTML
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,      // AQUI FICA A SOMA DE TODAS AS DESVANTAGENS
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0
        };
        
        // CONTROLE INTERNO (não aparece no HTML)
        this.controle = {
            riqueza: 0,          // Pontos da riqueza
            caracteristicas: 0   // Pontos das características físicas
        };
        
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
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) {
            inputGanhos.value = this.pontosGanhosCampanha;
            inputGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const limiteDesv = document.getElementById('limiteDesvantagens');
        if (limiteDesv) {
            limiteDesv.value = this.limites.desvantagens;
            limiteDesv.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvarDados();
            });
        }
        
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
        // Atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarTudo();
                this.salvarDados();
            }
        });
        
        // RIQUEZA - ponto por ponto
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                // Se for desvantagem (< 0)
                if (pontos < 0) {
                    this.controle.riqueza = Math.abs(pontos); // Valor positivo
                } else {
                    this.controle.riqueza = 0;
                }
                
                // Se for vantagem (> 0)
                if (pontos > 0) {
                    this.gastos.vantagens = pontos;
                }
                
                // Atualizar desvantagens (soma riqueza + características)
                this.atualizarDesvantagens();
                this.atualizarTudo();
                this.salvarDados();
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.controle.caracteristicas = e.detail.pontos; // Já vem positivo
                this.atualizarDesvantagens();
                this.atualizarTudo();
                this.salvarDados();
            }
        });
    }
    
    // SOMA riqueza + características
    atualizarDesvantagens() {
        const total = this.controle.riqueza + this.controle.caracteristicas;
        this.gastos.desvantagens = total;
    }
    
    calcularPontosDisponiveis() {
        const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // Total gasto (tudo menos desvantagens)
        let totalGastos = 0;
        Object.entries(this.gastos).forEach(([categoria, pontos]) => {
            if (categoria !== 'desvantagens' && categoria !== 'peculiaridades') {
                totalGastos += pontos;
            }
        });
        
        // Total ganho (desvantagens + peculiaridades)
        const totalGanhos = this.gastos.desvantagens + Math.abs(this.gastos.peculiaridades);
        
        // Pontos disponíveis
        const disponiveis = totalBase - totalGastos + totalGanhos;
        
        return {
            base: totalBase,
            gastos: totalGastos,
            ganhos: totalGanhos,
            disponiveis: disponiveis
        };
    }
    
    atualizarTudo() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Atualizar todos os displays
        this.atualizarDisplay('atributos', this.gastos.atributos);
        this.atualizarDisplay('vantagens', this.gastos.vantagens);
        this.atualizarDisplay('desvantagens', this.gastos.desvantagens, true); // true = desvantagem
        this.atualizarDisplay('peculiaridades', Math.abs(this.gastos.peculiaridades), true);
        this.atualizarDisplay('pericias', this.gastos.pericias);
        this.atualizarDisplay('tecnicas', this.gastos.tecnicas);
        this.atualizarDisplay('magia', this.gastos.magia);
        
        // Totais
        this.atualizarTotais(calculo);
        this.verificarLimites();
    }
    
    atualizarDisplay(categoria, pontos, isDesvantagem = false) {
        const elemento = document.getElementById(`pontos${this.capitalizar(categoria)}`);
        const percentElement = document.getElementById(`perc${this.capitalizar(categoria)}`);
        
        if (!elemento) return;
        
        elemento.textContent = pontos;
        
        // Estilo
        const parent = elemento.closest('.category');
        if (parent) {
            parent.classList.remove('positivo', 'negativo');
            
            if (isDesvantagem && pontos > 0) {
                parent.classList.add('negativo');
            } else if (!isDesvantagem && pontos > 0) {
                parent.classList.add('positivo');
            }
        }
        
        // Percentual
        if (percentElement) {
            const totalBase = this.pontosIniciais + this.pontosGanhosCampanha;
            if (totalBase > 0 && pontos > 0) {
                const percent = Math.round((pontos / totalBase) * 100);
                percentElement.textContent = `${percent}%`;
                percentElement.style.color = percent > 50 ? '#e74c3c' : 
                                           percent > 25 ? '#f39c12' : 
                                           isDesvantagem ? '#3498db' : '#27ae60';
            } else {
                percentElement.textContent = '0%';
            }
        }
    }
    
    atualizarTotais(calculo) {
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
        // Limite de Desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const desvAtuais = this.gastos.desvantagens;
            const limite = this.limites.desvantagens;
            const percentual = Math.min(100, (desvAtuais / limite) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            progressDesv.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                               percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesv.textContent = `${desvAtuais}/${limite} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
        }
        
        // Limite de Peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const pecAtuais = Math.abs(this.gastos.peculiaridades);
            const limite = this.limites.peculiaridades;
            const percentual = Math.min(100, (pecAtuais / limite) * 100);
            
            progressPec.style.width = `${percentual}%`;
            progressPec.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                              percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPec.textContent = `${pecAtuais}/${limite} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            controle: { ...this.controle },
            limites: { ...this.limites }
        };
        
        localStorage.setItem('rpgforge_pontos_simples', JSON.stringify(dados));
    }
    
    carregarDadosSalvos() {
        try {
            const dadosStr = localStorage.getItem('rpgforge_pontos_simples');
            if (dadosStr) {
                const dados = JSON.parse(dadosStr);
                this.aplicarDados(dados);
                return true;
            }
        } catch (error) {
            // Silencioso
        }
        return false;
    }
    
    aplicarDados(dados) {
        if (!dados) return;
        
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
        
        if (dados.gastos) {
            Object.keys(dados.gastos).forEach(key => {
                if (this.gastos[key] !== undefined) {
                    this.gastos[key] = dados.gastos[key];
                }
            });
        }
        
        if (dados.controle) {
            Object.keys(dados.controle).forEach(key => {
                if (this.controle[key] !== undefined) {
                    this.controle[key] = dados.controle[key];
                }
            });
        }
        
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
    
    resetar() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        Object.keys(this.gastos).forEach(key => {
            this.gastos[key] = 0;
        });
        
        Object.keys(this.controle).forEach(key => {
            this.controle[key] = 0;
        });
        
        this.limites.desvantagens = 40;
        this.limites.peculiaridades = 20;
        
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

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.calcularPontosDisponiveis().disponiveis;
    }
    return 150;
};

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        inicializarPontosManager();
    }, 100);
});