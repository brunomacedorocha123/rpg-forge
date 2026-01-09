// ===========================================
// PONTOS-MANAGER.JS - VERSÃO CORRIGIDA E COMPLETA
// Sistema centralizado que soma todas as desvantagens corretamente
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // SISTEMA DE GASTOS SEPARADOS (PARA NÃO SOBRESCREVER)
        this.gastosSeparados = {
            desvantagens: {
                caracteristicasFisicas: 0,   // Magro: -5, Gordo: -3, etc
                riqueza: 0,                  // Pobre: -15, Batalhador: -10, etc
                outras: 0                    // Futuras desvantagens
            },
            vantagens: {
                riqueza: 0,                  // Confortável: +10, Rico: +20, etc
                outras: 0                    // Futuras vantagens
            },
            // GASTOS DIRETOS (não são somados, são substituídos)
            diretos: {
                atributos: 0,
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
        // ATRIBUTOS (diretos - substitui)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastosSeparados.diretos.atributos = e.detail.pontosGastos;
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // CARACTERÍSTICAS FÍSICAS (soma nas desvantagens)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                // ARMAZENA SEPARADAMENTE (valor absoluto pois é desvantagem)
                this.gastosSeparados.desvantagens.caracteristicasFisicas = Math.abs(e.detail.pontosGastos);
                
                this.atualizarTotais();
                this.salvarDados();
                this.atualizarDisplayDesvantagens();
            }
        });
        
        // RIQUEZA (pode ser vantagem ou desvantagem)
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Confortável: +10, Rico: +20, etc)
                    this.gastosSeparados.vantagens.riqueza = pontos;
                    this.gastosSeparados.desvantagens.riqueza = 0; // Limpa se era desvantagem
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15, Batalhador: -10, etc)
                    this.gastosSeparados.desvantagens.riqueza = Math.abs(pontos); // Valor absoluto
                    this.gastosSeparados.vantagens.riqueza = 0; // Limpa se era vantagem
                } else {
                    // Neutro (Médio: 0)
                    this.gastosSeparados.desvantagens.riqueza = 0;
                    this.gastosSeparados.vantagens.riqueza = 0;
                }
                
                this.atualizarTotais();
                this.salvarDados();
                this.atualizarDisplayVantagens();
                this.atualizarDisplayDesvantagens();
            }
        });
        
        // PERÍCIAS (diretos - substitui)
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastosSeparados.diretos.pericias = e.detail.pontosGastos;
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // TÉCNICAS (diretos - substitui)
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastosSeparados.diretos.tecnicas = e.detail.pontosGastos;
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // MAGIA (diretos - substitui)
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastosSeparados.diretos.magia = e.detail.pontosGastos;
                this.atualizarTotais();
                this.salvarDados();
            }
        });
    }
    
    // ==================== CÁLCULOS ====================
    
    calcularTotais() {
        // TOTAL DE VANTAGENS (custa pontos)
        const totalVantagens = 
            this.gastosSeparados.vantagens.riqueza +
            this.gastosSeparados.vantagens.outras +
            this.gastosSeparados.diretos.atributos +
            this.gastosSeparados.diretos.pericias +
            this.gastosSeparados.diretos.tecnicas +
            this.gastosSeparados.diretos.magia;
        
        // TOTAL DE DESVANTAGENS (ganha pontos)
        const totalDesvantagens = 
            this.gastosSeparados.desvantagens.caracteristicasFisicas +
            this.gastosSeparados.desvantagens.riqueza +
            this.gastosSeparados.desvantagens.outras;
        
        // TOTAL GERAL DE PONTOS
        const pontosTotais = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // PONTOS DISPONÍVEIS = Pontos Totais - Vantagens + Desvantagens
        const pontosDisponiveis = pontosTotais - totalVantagens + totalDesvantagens;
        
        return {
            totalPontos: pontosTotais,
            vantagens: totalVantagens,
            desvantagens: totalDesvantagens,
            disponiveis: pontosDisponiveis,
            desvantagensPorTipo: { ...this.gastosSeparados.desvantagens },
            vantagensPorTipo: { ...this.gastosSeparados.vantagens },
            diretos: { ...this.gastosSeparados.diretos }
        };
    }
    
    // ==================== ATUALIZAÇÕES VISUAIS ====================
    
    atualizarTudo() {
        this.atualizarDisplayVantagens();
        this.atualizarDisplayDesvantagens();
        this.atualizarDisplayDiretos();
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayVantagens() {
        const total = this.gastosSeparados.vantagens.riqueza + 
                     this.gastosSeparados.vantagens.outras;
        
        const elemento = document.getElementById('pontosVantagens');
        if (elemento) {
            elemento.textContent = total;
            
            // Estilo
            elemento.parentElement.classList.remove('positivo', 'negativo');
            if (total > 0) {
                elemento.parentElement.classList.add('positivo');
            }
            
            this.atualizarPercentual('Vantagens', total);
        }
    }
    
    atualizarDisplayDesvantagens() {
        const total = this.gastosSeparados.desvantagens.caracteristicasFisicas +
                     this.gastosSeparados.desvantagens.riqueza +
                     this.gastosSeparados.desvantagens.outras;
        
        const elemento = document.getElementById('pontosDesvantagens');
        if (elemento) {
            elemento.textContent = total;
            
            // Estilo
            elemento.parentElement.classList.remove('positivo', 'negativo');
            if (total > 0) {
                elemento.parentElement.classList.add('negativo');
            }
            
            this.atualizarPercentual('Desvantagens', total);
        }
    }
    
    atualizarDisplayDiretos() {
        // Atributos
        const elementoAtributos = document.getElementById('pontosAtributos');
        if (elementoAtributos) {
            elementoAtributos.textContent = this.gastosSeparados.diretos.atributos;
            elementoAtributos.parentElement.classList.remove('positivo', 'negativo');
            if (this.gastosSeparados.diretos.atributos > 0) {
                elementoAtributos.parentElement.classList.add('positivo');
            } else if (this.gastosSeparados.diretos.atributos < 0) {
                elementoAtributos.parentElement.classList.add('negativo');
            }
            this.atualizarPercentual('Atributos', this.gastosSeparados.diretos.atributos);
        }
        
        // Perícias
        const elementoPericias = document.getElementById('pontosPericias');
        if (elementoPericias) {
            elementoPericias.textContent = this.gastosSeparados.diretos.pericias;
            elementoPericias.parentElement.classList.remove('positivo', 'negativo');
            if (this.gastosSeparados.diretos.pericias > 0) {
                elementoPericias.parentElement.classList.add('positivo');
            }
            this.atualizarPercentual('Pericias', this.gastosSeparados.diretos.pericias);
        }
        
        // Técnicas
        const elementoTecnicas = document.getElementById('pontosTecnicas');
        if (elementoTecnicas) {
            elementoTecnicas.textContent = this.gastosSeparados.diretos.tecnicas;
            elementoTecnicas.parentElement.classList.remove('positivo', 'negativo');
            if (this.gastosSeparados.diretos.tecnicas > 0) {
                elementoTecnicas.parentElement.classList.add('positivo');
            }
            this.atualizarPercentual('Tecnicas', this.gastosSeparados.diretos.tecnicas);
        }
        
        // Magia
        const elementoMagia = document.getElementById('pontosMagia');
        if (elementoMagia) {
            elementoMagia.textContent = this.gastosSeparados.diretos.magia;
            elementoMagia.parentElement.classList.remove('positivo', 'negativo');
            if (this.gastosSeparados.diretos.magia > 0) {
                elementoMagia.parentElement.classList.add('positivo');
            }
            this.atualizarPercentual('Magia', this.gastosSeparados.diretos.magia);
        }
    }
    
    atualizarPercentual(tipo, pontos) {
        const elemento = document.getElementById(`perc${tipo}`);
        if (!elemento) return;
        
        const pontosAbs = Math.abs(pontos);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontosAbs / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Cores baseadas no percentual
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else {
                elemento.style.color = tipo === 'Desvantagens' ? '#3498db' : '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTotais() {
        const calculo = this.calcularTotais();
        
        // Pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            // Estilo baseado no saldo
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
                this.mostrarAviso(`Pontos negativos! Faltam ${Math.abs(calculo.disponiveis)} pontos.`);
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
                elementoDisponiveis.style.fontWeight = 'normal';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
                elementoDisponiveis.style.fontWeight = 'normal';
            }
        }
        
        // Total gastos (apenas vantagens)
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularTotais();
        
        // Limite de desvantagens
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (calculo.desvantagens / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${calculo.desvantagens}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
            
            // Aviso se ultrapassar limite
            if (calculo.desvantagens > this.limites.desvantagens) {
                this.mostrarAviso(`Limite de desvantagens excedido em ${calculo.desvantagens - this.limites.desvantagens} pontos!`);
            }
        }
        
        // Limite de peculiaridades (ainda não implementado)
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const peculiaridadesAtual = 0; // Placeholder por enquanto
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
            gastosSeparados: { ...this.gastosSeparados },
            limites: { ...this.limites }
        };
        
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            localStorage.setItem('rpgforge_pontos_novo', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos_novo');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    console.error('Erro ao carregar pontos:', error);
                    return;
                }
            }
        }
        
        if (dados) {
            this.aplicarDados(dados);
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
        
        if (dados.gastosSeparados) {
            // Carrega gastos separados
            if (dados.gastosSeparados.diretos) {
                Object.keys(dados.gastosSeparados.diretos).forEach(key => {
                    if (this.gastosSeparados.diretos[key] !== undefined) {
                        this.gastosSeparados.diretos[key] = dados.gastosSeparados.diretos[key];
                    }
                });
            }
            
            if (dados.gastosSeparados.desvantagens) {
                Object.keys(dados.gastosSeparados.desvantagens).forEach(key => {
                    if (this.gastosSeparados.desvantagens[key] !== undefined) {
                        this.gastosSeparados.desvantagens[key] = dados.gastosSeparados.desvantagens[key];
                    }
                });
            }
            
            if (dados.gastosSeparados.vantagens) {
                Object.keys(dados.gastosSeparados.vantagens).forEach(key => {
                    if (this.gastosSeparados.vantagens[key] !== undefined) {
                        this.gastosSeparados.vantagens[key] = dados.gastosSeparados.vantagens[key];
                    }
                });
            }
        }
        
        if (dados.limites) {
            Object.keys(dados.limites).forEach(limite => {
                if (this.limites[limite] !== undefined) {
                    this.limites[limite] = dados.limites[limite];
                    
                    const input = document.getElementById(`limite${limite.charAt(0).toUpperCase() + limite.slice(1)}`);
                    if (input) input.value = this.limites[limite];
                }
            });
        }
        
        this.atualizarTudo();
    }
    
    // ==================== UTILITÁRIOS ====================
    
    mostrarAviso(mensagem) {
        const aviso = document.createElement('div');
        aviso.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
        }, 3000);
    }
    
    // ==================== GETTERS PÚBLICOS ====================
    
    obterPontosDisponiveis() {
        return this.calcularTotais().disponiveis;
    }
    
    obterDesvantagensTotais() {
        return this.calcularTotais().desvantagens;
    }
    
    obterVantagensTotais() {
        return this.calcularTotais().vantagens;
    }
    
    obterDetalhesDesvantagens() {
        return { ...this.gastosSeparados.desvantagens };
    }
    
    obterDetalhesVantagens() {
        return { ...this.gastosSeparados.vantagens };
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

window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterPontosDisponiveis();
    }
    return 150;
};

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 500);
    }
    
    // Evento personalizado para mudança de tabs
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(() => {
                if (!pontosManager) {
                    inicializarPontosManager();
                }
            }, 500);
        }
    });
});

// ==================== EVENTOS DE EXEMPLO ====================
// Para testar o sistema, você pode disparar estes eventos:

function testarSistemaPontos() {
    console.log('=== TESTANDO SISTEMA DE PONTOS ===');
    
    // Exemplo: Características físicas (Magro: -5)
    document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
        detail: { pontosGastos: -5 }
    }));
    
    // Exemplo: Riqueza (Batalhador: -10)
    document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
        detail: { pontos: -10 }
    }));
    
    // Exemplo: Atributos (+15 pontos)
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    // Exemplo: Mudar riqueza para vantagem (Rico: +20)
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
            detail: { pontos: 20 }
        }));
    }, 1000);
    
    console.log('=== TESTE COMPLETO ===');
}

// Para testar no console: testarSistemaPontos()
window.testarSistemaPontos = testarSistemaPontos;