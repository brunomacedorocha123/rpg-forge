// ===========================================
// PONTOS-MANAGER.JS - VERSÃO COMPLETA
// Sistema central que SOMA todas as desvantagens corretamente
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // SISTEMA DE ARMAZENAMENTO QUE SOMA
        this.fontesPontos = {
            // DESVANTAGENS (são SOMADAS - valor absoluto)
            desvantagens: {
                caracteristicasFisicas: 0,   // Magro: 5, Gordo: 3, etc
                riqueza: 0,                  // Pobre: 15, Batalhador: 10, etc
                outras: 0                    // Futuras desvantagens
            },
            
            // VANTAGENS (são SOMADAS)
            vantagens: {
                riqueza: 0,                  // Rico: 20, Confortável: 10, etc
                outras: 0                    // Futuras vantagens
            },
            
            // GASTOS DIRETOS (são SUBSTITUÍDOS)
            diretos: {
                atributos: 0,                // Atributos (pode ser positivo ou negativo)
                pericias: 0,
                tecnicas: 0,
                magia: 0,
                equipamentos: 0
            }
        };
        
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
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (inputLimitePeculiaridades) {
            inputLimitePeculiaridades.value = this.limites.peculiaridades;
            inputLimitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        // 1. CARACTERÍSTICAS FÍSICAS (MAGRO, GORDO, etc)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = Math.abs(e.detail.pontosGastos);
                this.fontesPontos.desvantagens.caracteristicasFisicas = pontos;
                this.atualizarDisplayComTotais();
                this.salvarDados();
                console.log('Características físicas:', pontos, 'pts');
            }
        });
        
        // 2. RIQUEZA (POBRE, RICO, etc) - NOVO EVENTO QUE NÃO ZERA
        document.addEventListener('riquezaAtualizadaComSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Rico: +20)
                    this.fontesPontos.vantagens.riqueza = pontos;
                    this.fontesPontos.desvantagens.riqueza = 0;
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15)
                    this.fontesPontos.desvantagens.riqueza = Math.abs(pontos);
                    this.fontesPontos.vantagens.riqueza = 0;
                } else {
                    // NEUTRO (Médio: 0)
                    this.fontesPontos.vantagens.riqueza = 0;
                    this.fontesPontos.desvantagens.riqueza = 0;
                }
                
                this.atualizarDisplayComTotais();
                this.salvarDados();
                console.log('Riqueza:', pontos > 0 ? `Vantagem +${pontos}` : `Desvantagem ${pontos}`, 'pts');
            }
        });
        
        // 3. ATRIBUTOS (sistema original)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.diretos.atributos = e.detail.pontosGastos;
                this.atualizarDisplayAba('atributos');
                this.atualizarTotais();
                this.salvarDados();
                console.log('Atributos:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 4. OUTROS SISTEMAS (para compatibilidade)
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.vantagens.outras = e.detail.pontosGastos;
                this.atualizarDisplayComTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.diretos.pericias = e.detail.pontosGastos;
                this.atualizarDisplayAba('pericias');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.diretos.tecnicas = e.detail.pontosGastos;
                this.atualizarDisplayAba('tecnicas');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.diretos.magia = e.detail.pontosGastos;
                this.atualizarDisplayAba('magia');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontesPontos.diretos.peculiaridades = e.detail.pontosGastos;
                this.atualizarDisplayAba('peculiaridades');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
    }
    
    // ==================== CÁLCULOS ====================
    
    calcularTotalDesvantagens() {
        return this.fontesPontos.desvantagens.caracteristicasFisicas +
               this.fontesPontos.desvantagens.riqueza +
               this.fontesPontos.desvantagens.outras;
    }
    
    calcularTotalVantagens() {
        return this.fontesPontos.vantagens.riqueza +
               this.fontesPontos.vantagens.outras;
    }
    
    calcularTotalDiretos() {
        let total = 0;
        Object.values(this.fontesPontos.diretos).forEach(valor => {
            // Só conta atributos positivos (custo) e peculiariedades (sempre negativo)
            if (valor > 0) total += valor;
        });
        return total;
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        const vantagensTotal = this.calcularTotalVantagens();
        const desvantagensTotal = this.calcularTotalDesvantagens();
        const diretosTotal = this.calcularTotalDiretos();
        
        // Cálculo final: Total - Vantagens - Diretos + Desvantagens
        const pontosDisponiveis = totalPontos - vantagensTotal - diretosTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            diretos: diretosTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    // ==================== ATUALIZAÇÕES VISUAIS ====================
    
    atualizarDisplayComTotais() {
        // Atualiza desvantagens
        const totalDesvantagens = this.calcularTotalDesvantagens();
        const elementoDesvantagens = document.getElementById('pontosDesvantagens');
        if (elementoDesvantagens) {
            elementoDesvantagens.textContent = totalDesvantagens;
            elementoDesvantagens.parentElement.classList.remove('positivo', 'negativo');
            if (totalDesvantagens > 0) {
                elementoDesvantagens.parentElement.classList.add('negativo');
            }
            this.atualizarPercentual('Desvantagens', totalDesvantagens);
        }
        
        // Atualiza vantagens
        const totalVantagens = this.calcularTotalVantagens();
        const elementoVantagens = document.getElementById('pontosVantagens');
        if (elementoVantagens) {
            elementoVantagens.textContent = totalVantagens;
            elementoVantagens.parentElement.classList.remove('positivo', 'negativo');
            if (totalVantagens > 0) {
                elementoVantagens.parentElement.classList.add('positivo');
            }
            this.atualizarPercentual('Vantagens', totalVantagens);
        }
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        let pontos = this.fontesPontos.diretos[aba] || 0;
        
        // Para peculiaridades, mostramos valor absoluto no display
        if (aba === 'peculiaridades') {
            pontos = Math.abs(pontos);
        }
        
        elemento.textContent = pontos;
        
        // Estilização
        elemento.parentElement.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (pontos > 0) {
                elemento.parentElement.classList.add('negativo');
            }
        } else if (pontos > 0) {
            elemento.parentElement.classList.add('positivo');
        } else if (pontos < 0) {
            elemento.parentElement.classList.add('negativo');
        }
        
        this.atualizarPercentual(aba, pontos);
    }
    
    atualizarPercentual(nome, pontos) {
        const elemento = document.getElementById(`perc${this.capitalizar(nome)}`);
        if (!elemento) return;
        
        const pontosAbs = Math.abs(pontos);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontosAbs / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else if (nome.toLowerCase() === 'desvantagens') {
                elemento.style.color = '#3498db';
            } else {
                elemento.style.color = '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTudo() {
        this.atualizarDisplayComTotais();
        
        // Atualiza todas as abas diretas
        Object.keys(this.fontesPontos.diretos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
                elementoDisponiveis.style.fontWeight = 'normal';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
                elementoDisponiveis.style.fontWeight = 'normal';
            }
        }
        
        // Total gastos (apenas vantagens + diretos positivos)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            const totalGastos = calculo.vantagens + calculo.diretos;
            elementoGastos.textContent = totalGastos;
        }
    }
    
    verificarLimites() {
        const totalDesvantagens = this.calcularTotalDesvantagens();
        
        // Limite de desvantagens
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (totalDesvantagens / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${totalDesvantagens}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
            
            // Aviso se ultrapassou limite
            if (totalDesvantagens > this.limites.desvantagens) {
                this.mostrarAviso(`Limite de desvantagens excedido em ${totalDesvantagens - this.limites.desvantagens} pontos!`);
            }
        }
        
        // Limite de peculiaridades
        const peculiaridadesAtual = Math.abs(this.fontesPontos.diretos.peculiaridades || 0);
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (peculiaridadesAtual / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${peculiaridadesAtual}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    // ==================== PERSISTÊNCIA ====================
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            fontesPontos: { ...this.fontesPontos },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('rpgforge_pontos_final', JSON.stringify(dados));
    }
    
    async carregarDadosSalvos() {
        try {
            const dadosLocais = localStorage.getItem('rpgforge_pontos_final');
            if (dadosLocais) {
                const dados = JSON.parse(dadosLocais);
                this.aplicarDados(dados);
                console.log('Pontos carregados do localStorage');
            }
        } catch (error) {
            console.error('Erro ao carregar pontos:', error);
        }
    }
    
    aplicarDados(dados) {
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
        
        if (dados.fontesPontos) {
            if (dados.fontesPontos.desvantagens) {
                Object.assign(this.fontesPontos.desvantagens, dados.fontesPontos.desvantagens);
            }
            if (dados.fontesPontos.vantagens) {
                Object.assign(this.fontesPontos.vantagens, dados.fontesPontos.vantagens);
            }
            if (dados.fontesPontos.diretos) {
                Object.assign(this.fontesPontos.diretos, dados.fontesPontos.diretos);
            }
        }
        
        if (dados.limites) {
            Object.assign(this.limites, dados.limites);
        }
        
        this.atualizarTudo();
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    mostrarAviso(mensagem) {
        const aviso = document.createElement('div');
        aviso.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
            max-width: 300px;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
        }, 3000);
    }
    
    // ==================== GETTERS PÚBLICOS ====================
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    obterDesvantagensTotais() {
        return this.calcularTotalDesvantagens();
    }
    
    obterDetalhes() {
        return {
            desvantagens: { ...this.fontesPontos.desvantagens },
            vantagens: { ...this.fontesPontos.vantagens },
            diretos: { ...this.fontesPontos.diretos }
        };
    }
}

// ==================== INSTANCIAÇÃO GLOBAL ====================

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// Funções globais de compatibilidade
window.obterPontosManager = inicializarPontosManager;
window.obterPontosDisponiveis = () => {
    return pontosManager ? pontosManager.obterPontosDisponiveis() : 150;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        if (aba === 'desvantagens' || aba === 'vantagens') {
            console.log('ATENÇÃO: Use eventos em vez de atualizarPontosAba para desvantagens/vantagens');
            return false;
        }
        pontosManager.fontesPontos.diretos[aba] = pontos;
        pontosManager.atualizarDisplayAba(aba);
        pontosManager.atualizarTotais();
        pontosManager.salvarDados();
        return true;
    }
    return false;
};

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('=== PONTOS MANAGER INICIALIZADO ===');
        }
    }, 500);
});

// ==================== FUNÇÃO DE TESTE ====================

function testarSistemaCompleto() {
    console.log('=== TESTE COMPLETO DO SISTEMA ===');
    
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 1. Limpa tudo
    pontosManager.fontesPontos.desvantagens.caracteristicasFisicas = 0;
    pontosManager.fontesPontos.desvantagens.riqueza = 0;
    pontosManager.fontesPontos.vantagens.riqueza = 0;
    pontosManager.fontesPontos.diretos.atributos = 0;
    
    // 2. Adiciona características físicas (Magro: -5)
    document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
        detail: { pontosGastos: -5 }
    }));
    
    // 3. Adiciona riqueza (Batalhador: -10)
    document.dispatchEvent(new CustomEvent('riquezaAtualizadaComSoma', {
        detail: { pontos: -10 }
    }));
    
    // 4. Adiciona atributos (+15)
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    setTimeout(() => {
        const calculo = pontosManager.calcularPontosDisponiveis();
        console.log('RESULTADO ESPERADO:');
        console.log('- Desvantagens: 5 + 10 = 15 pts');
        console.log('- Vantagens: 0 pts');
        console.log('- Diretos: 15 pts');
        console.log('- Disponível: 150 - 0 - 15 + 15 = 150 pts');
        console.log('RESULTADO OBTIDO:');
        console.log('- Desvantagens:', calculo.desvantagens, 'pts');
        console.log('- Vantagens:', calculo.vantagens, 'pts');
        console.log('- Diretos:', calculo.diretos, 'pts');
        console.log('- Disponível:', calculo.disponiveis, 'pts');
        
        if (calculo.desvantagens === 15 && calculo.disponiveis === 150) {
            console.log('✅ TESTE PASSOU! Desvantagens estão sendo somadas!');
        } else {
            console.log('❌ TESTE FALHOU! Verifique o código.');
        }
    }, 200);
}

window.testarSistemaCompleto = testarSistemaCompleto;