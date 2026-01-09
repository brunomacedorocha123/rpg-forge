// ===========================================
// PONTOS-MANAGER.JS - VERSÃO COMPLETA E FUNCIONAL
// Sistema que mantém atributos, soma características físicas e riqueza
// ===========================================

class PontosManager {
    constructor() {
        // Pontos base do personagem
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // Sistema original de gastos (NÃO MEXE - já funciona)
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
        
        // Sistema separado para SOMAR desvantagens corretamente
        this.desvantagensSeparadas = {
            caracteristicasFisicas: 0,   // Magro: 5, Gordo: 3, etc
            riqueza: 0                   // Pobre: 15, Batalhador: 10, etc
        };
        
        // Sistema separado para vantagens da riqueza
        this.vantagensSeparadas = {
            riqueza: 0                   // Rico: 20, Confortável: 10, etc
        };
        
        // Limites configuráveis
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
        console.log('✅ Pontos Manager inicializado com sucesso!');
    }
    
    configurarInputs() {
        // Configuração dos inputs de pontos
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
        // 1. ATRIBUTOS (sistema original - funciona normalmente)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.atualizarDisplayAba('atributos');
                this.atualizarTotais();
                this.salvarDados();
                console.log('📊 Atributos atualizados:', e.detail.pontosGastos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS (soma nas desvantagens)
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                // Converte valor negativo para positivo (Magro: -5 → 5)
                const pontosAbsolutos = Math.abs(e.detail.pontosGastos);
                this.desvantagensSeparadas.caracteristicasFisicas = pontosAbsolutos;
                
                // Atualiza o total de desvantagens
                this.atualizarDesvantagensTotais();
                this.salvarDados();
                console.log('🏃 Características físicas:', pontosAbsolutos, 'pts');
            }
        });
        
        // 3. RIQUEZA (pode ser vantagem ou desvantagem)
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Rico: +20, Confortável: +10)
                    this.vantagensSeparadas.riqueza = pontos;
                    this.desvantagensSeparadas.riqueza = 0; // Limpa se era desvantagem
                    this.atualizarVantagensTotais();
                    console.log('💰 Riqueza (Vantagem): +' + pontos + ' pts');
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15, Batalhador: -10)
                    this.desvantagensSeparadas.riqueza = Math.abs(pontos); // Converte para positivo
                    this.vantagensSeparadas.riqueza = 0; // Limpa se era vantagem
                    this.atualizarDesvantagensTotais();
                    console.log('💰 Riqueza (Desvantagem): ' + pontos + ' pts');
                } else {
                    // NEUTRO (Médio: 0)
                    this.desvantagensSeparadas.riqueza = 0;
                    this.vantagensSeparadas.riqueza = 0;
                    this.atualizarDesvantagensTotais();
                    this.atualizarVantagensTotais();
                    console.log('💰 Riqueza (Neutro): 0 pts');
                }
                
                this.salvarDados();
            }
        });
        
        // 4. PERÍCIAS (sistema original)
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.pericias = e.detail.pontosGastos;
                this.atualizarDisplayAba('pericias');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 5. PECULIARIDADES (sistema original)
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.peculiaridades = e.detail.pontosGastos;
                this.atualizarDisplayAba('peculiaridades');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvarDados();
            }
        });
        
        // 6. TÉCNICAS (sistema original)
        document.addEventListener('tecnicasAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.tecnicas = e.detail.pontosGastos;
                this.atualizarDisplayAba('tecnicas');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 7. MAGIA (sistema original)
        document.addEventListener('magiaAtualizada', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.magia = e.detail.pontosGastos;
                this.atualizarDisplayAba('magia');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 8. EQUIPAMENTOS (sistema original)
        document.addEventListener('equipamentosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.gastos.equipamentos = e.detail.pontosGastos;
                this.atualizarDisplayAba('equipamentos');
                this.atualizarTotais();
                this.salvarDados();
            }
        });
    }
    
    // ==================== FUNÇÕES DE CÁLCULO ====================
    
    atualizarDesvantagensTotais() {
        // Soma todas as fontes de desvantagens
        const totalDesvantagens = 
            this.desvantagensSeparadas.caracteristicasFisicas + 
            this.desvantagensSeparadas.riqueza;
        
        // Atualiza o sistema original
        this.gastos.desvantagens = totalDesvantagens;
        
        // Atualiza o display
        this.atualizarDisplayAba('desvantagens');
        this.atualizarTotais();
        this.verificarLimites();
        
        console.log('➕ Desvantagens totais:', totalDesvantagens, 'pts');
        console.log('   - Características físicas:', this.desvantagensSeparadas.caracteristicasFisicas);
        console.log('   - Riqueza:', this.desvantagensSeparadas.riqueza);
    }
    
    atualizarVantagensTotais() {
        // Soma todas as fontes de vantagens
        const totalVantagens = this.vantagensSeparadas.riqueza;
        
        // Atualiza o sistema original
        this.gastos.vantagens = totalVantagens;
        
        // Atualiza o display
        this.atualizarDisplayAba('vantagens');
        this.atualizarTotais();
        
        console.log('➕ Vantagens totais:', totalVantagens, 'pts');
        console.log('   - Riqueza:', this.vantagensSeparadas.riqueza);
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS: tudo que custa pontos (valores positivos)
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);    // Atributos positivos
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);    // Vantagens
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);     // Perícias
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);     // Técnicas
        vantagensTotal += Math.max(0, this.gastos.magia || 0);        // Magia
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0); // Equipamentos
        
        // DESVANTAGENS: tudo que dá pontos (valores absolutos)
        let desvantagensTotal = 0;
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));     // Atributos negativos
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);              // Desvantagens
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);            // Peculiaridades
        
        // Cálculo final: pontos iniciais - vantagens + desvantagens
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis,
            totalDesvantagensAbs: desvantagensTotal,
            peculiaridadesAbs: Math.abs(this.gastos.peculiaridades || 0)
        };
    }
    
    // ==================== ATUALIZAÇÕES VISUAIS ====================
    
    atualizarDisplayAba(aba) {
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
        // Estilização baseada no tipo de ponto
        elemento.parentElement.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            // Desvantagens e peculiaridades são negativas (dão pontos)
            if (pontos > 0) {
                elemento.parentElement.classList.add('negativo');
            }
        } else if (pontos > 0) {
            // Vantagens, atributos positivos, etc (custam pontos)
            elemento.parentElement.classList.add('positivo');
        } else if (pontos < 0) {
            // Atributos negativos (dão pontos)
            elemento.parentElement.classList.add('negativo');
        }
        
        this.atualizarPercentualAba(aba);
    }
    
    atualizarPercentualAba(aba) {
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = Math.abs(this.gastos[aba] || 0);
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((pontos / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            // Cores baseadas no percentual
            if (percentual > 50) {
                elemento.style.color = '#e74c3c'; // Vermelho - acima de 50%
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12'; // Laranja - acima de 25%
            } else {
                elemento.style.color = '#27ae60'; // Verde - abaixo de 25%
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTudo() {
        // Atualiza todas as abas
        Object.keys(this.gastos).forEach(aba => {
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
            
            // Estilo baseado no saldo de pontos
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
        const calculo = this.calcularPontosDisponiveis();
        
        // Limite de desvantagens
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (calculo.totalDesvantagensAbs / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${calculo.totalDesvantagensAbs}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
        }
        
        // Limite de peculiaridades
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (calculo.peculiaridadesAbs / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${calculo.peculiaridadesAbs}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    mostrarAviso(mensagem) {
        // Remove avisos anteriores
        const avisosAnteriores = document.querySelectorAll('.aviso-pontos');
        avisosAnteriores.forEach(aviso => aviso.remove());
        
        // Cria novo aviso
        const aviso = document.createElement('div');
        aviso.className = 'aviso-pontos';
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
            animation: slideIn 0.3s ease;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        // Remove após 3 segundos
        setTimeout(() => {
            if (aviso.parentNode) {
                aviso.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
                }, 300);
            }
        }, 3000);
    }
    
    // ==================== PERSISTÊNCIA ====================
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            desvantagensSeparadas: { ...this.desvantagensSeparadas },
            vantagensSeparadas: { ...this.vantagensSeparadas },
            limites: { ...this.limites },
            timestamp: new Date().toISOString()
        };
        
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            localStorage.setItem('rpgforge_pontos_completo', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos_completo');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    console.error('Erro ao carregar dados de pontos:', error);
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
        
        if (dados.gastos) {
            Object.keys(dados.gastos).forEach(aba => {
                if (this.gastos[aba] !== undefined) {
                    this.gastos[aba] = dados.gastos[aba];
                }
            });
        }
        
        if (dados.desvantagensSeparadas) {
            Object.assign(this.desvantagensSeparadas, dados.desvantagensSeparadas);
        }
        
        if (dados.vantagensSeparadas) {
            Object.assign(this.vantagensSeparadas, dados.vantagensSeparadas);
        }
        
        if (dados.limites) {
            Object.keys(dados.limites).forEach(limite => {
                if (this.limites[limite] !== undefined) {
                    this.limites[limite] = dados.limites[limite];
                    
                    const input = document.getElementById(`limite${this.capitalizar(limite)}`);
                    if (input) input.value = this.limites[limite];
                }
            });
        }
        
        this.atualizarTudo();
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // ==================== FUNÇÕES PÚBLICAS ====================
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    obterTotalDesvantagens() {
        return this.calcularPontosDisponiveis().desvantagens;
    }
    
    obterTotalVantagens() {
        return this.calcularPontosDisponiveis().vantagens;
    }
    
    mostrarStatus() {
        const calculo = this.calcularPontosDisponiveis();
        console.log('📊 STATUS DO SISTEMA DE PONTOS:');
        console.log('- Pontos totais:', calculo.total, 'pts');
        console.log('- Atributos:', this.gastos.atributos, 'pts');
        console.log('- Desvantagens:', calculo.desvantagens, 'pts');
        console.log('  • Características físicas:', this.desvantagensSeparadas.caracteristicasFisicas, 'pts');
        console.log('  • Riqueza (desvantagem):', this.desvantagensSeparadas.riqueza, 'pts');
        console.log('- Vantagens:', calculo.vantagens, 'pts');
        console.log('  • Riqueza (vantagem):', this.vantagensSeparadas.riqueza, 'pts');
        console.log('- Peculiaridades:', this.gastos.peculiaridades, 'pts');
        console.log('- Pontos disponíveis:', calculo.disponiveis, 'pts');
    }
    
    testarSistema() {
        console.log('🧪 TESTANDO SISTEMA COMPLETO...');
        
        // 1. Testa atributos
        document.dispatchEvent(new CustomEvent('atributosAtualizados', {
            detail: { pontosGastos: 15 }
        }));
        
        setTimeout(() => {
            // 2. Testa características físicas (Magro: -5)
            document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
                detail: { pontosGastos: -5 }
            }));
            
            setTimeout(() => {
                // 3. Testa riqueza como desvantagem (Batalhador: -10)
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: -10 }
                }));
                
                setTimeout(() => {
                    // 4. Testa mudança para vantagem (Rico: +20)
                    document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                        detail: { pontos: 20 }
                    }));
                    
                    // Verifica resultados
                    setTimeout(() => {
                        this.mostrarStatus();
                        const calculo = this.calcularPontosDisponiveis();
                        
                        console.log('📈 RESULTADOS ESPERADOS:');
                        console.log('- Atributos: 15 pts (custo)');
                        console.log('- Desvantagens: 5 pts (Magro)');
                        console.log('- Vantagens: 20 pts (Rico)');
                        console.log('- Disponível: 150 - 15 - 20 + 5 = 120 pts');
                        console.log('- Disponível real:', calculo.disponiveis, 'pts');
                        
                        if (calculo.disponiveis === 120) {
                            console.log('✅ SISTEMA FUNCIONANDO PERFEITAMENTE!');
                        } else {
                            console.log('❌ ERRO NO CÁLCULO!');
                        }
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
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

// ==================== FUNÇÕES GLOBAIS DE COMPATIBILIDADE ====================

window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        pontosManager.gastos[aba] = pontos;
        pontosManager.atualizarDisplayAba(aba);
        pontosManager.atualizarTotais();
        pontosManager.salvarDados();
        return true;
    }
    return false;
};

window.obterGastosAba = (aba) => {
    if (pontosManager) {
        return pontosManager.gastos[aba] || 0;
    }
    return 0;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterPontosDisponiveis();
    }
    return 150;
};

window.testarSistemaPontos = () => {
    if (pontosManager) {
        pontosManager.testarSistema();
    } else {
        inicializarPontosManager();
        setTimeout(() => {
            pontosManager.testarSistema();
        }, 500);
    }
};

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa quando a aba principal está ativa
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 500);
    }
    
    // Reage a mudanças de tab
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

// ==================== ESTILOS DINÂMICOS ====================

const estilosPontos = document.createElement('style');
estilosPontos.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .aviso-pontos {
        font-family: Arial, sans-serif;
        font-size: 14px;
    }
    
    .categoria.positivo {
        background: linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
        border-left: 4px solid #27ae60;
    }
    
    .categoria.negativo {
        background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%);
        border-left: 4px solid #e74c3c;
    }
    
    .progress-bar {
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin: 5px 0;
    }
    
    .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease, background-color 0.3s ease;
    }
`;
document.head.appendChild(estilosPontos);

console.log('🚀 Sistema de pontos pronto para uso!');