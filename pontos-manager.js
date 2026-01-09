// ===========================================
// PONTOS-MANAGER.JS - SISTEMA QUE SOMA TUDO
// Inclui atributos, características físicas e riqueza
// ===========================================

class PontosManager {
    constructor() {
        // ARMAZENA CADA FONTE SEPARADAMENTE
        this.fontes = {
            // DESVANTAGENS (VALORES ABSOLUTOS - SÃO SOMADOS)
            desvantagens: {
                caracteristicasFisicas: 0,   // Ex: Magro = 5
                riqueza: 0,                  // Ex: Pobre = 15
                outras: 0
            },
            
            // VANTAGENS (VALORES POSITIVOS - SÃO SOMADOS)  
            vantagens: {
                riqueza: 0,                  // Ex: Rico = 20
                outras: 0
            },
            
            // GASTOS DIRETOS
            diretos: {
                atributos: 0,                // Pode ser + ou -
                pericias: 0,
                tecnicas: 0,
                magia: 0,
                peculiaridades: 0
            }
        };
        
        this.pontosIniciais = 150;
        this.pontosGanhos = 0;
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
        this.configurarEventos();
        this.carregarDados();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Pontos Manager inicializado!');
    }
    
    configurarInputs() {
        // Pontos iniciais
        const inputIniciais = document.getElementById('pontosIniciais');
        if (inputIniciais) {
            inputIniciais.value = this.pontosIniciais;
            inputIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        // Pontos ganhos
        const inputGanhos = document.getElementById('pontosGanhos');
        if (inputGanhos) {
            inputGanhos.value = this.pontosGanhos;
            inputGanhos.addEventListener('change', (e) => {
                this.pontosGanhos = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        // 1. CARACTERÍSTICAS FÍSICAS
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = Math.abs(e.detail.pontosGastos);
                this.fontes.desvantagens.caracteristicasFisicas = pontos;
                console.log('🏃 Características físicas:', pontos, 'pts');
                this.atualizarDisplayDesvantagens();
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 2. RIQUEZA (DESVANTAGEM ou VANTAGEM)
        document.addEventListener('riquezaAtualizadaParaSoma', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                
                if (pontos > 0) {
                    // É VANTAGEM (Rico: +20)
                    this.fontes.vantagens.riqueza = pontos;
                    this.fontes.desvantagens.riqueza = 0; // Limpa desvantagem
                } else if (pontos < 0) {
                    // É DESVANTAGEM (Pobre: -15)  
                    this.fontes.desvantagens.riqueza = Math.abs(pontos); // Valor absoluto
                    this.fontes.vantagens.riqueza = 0; // Limpa vantagem
                } else {
                    // NEUTRO
                    this.fontes.desvantagens.riqueza = 0;
                    this.fontes.vantagens.riqueza = 0;
                }
                
                console.log('💰 Riqueza:', pontos > 0 ? `Vantagem +${pontos}` : `Desvantagem ${pontos}`, 'pts');
                this.atualizarDisplayDesvantagens();
                this.atualizarDisplayVantagens();
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 3. ATRIBUTOS
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontes.diretos.atributos = e.detail.pontosGastos;
                console.log('💪 Atributos:', e.detail.pontosGastos, 'pts');
                this.atualizarDisplayAtributos();
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        // 4. OUTROS (para compatibilidade)
        document.addEventListener('periciasAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontes.diretos.pericias = e.detail.pontosGastos;
                this.atualizarDisplayPericias();
                this.atualizarTotais();
                this.salvarDados();
            }
        });
        
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.fontes.diretos.peculiaridades = e.detail.pontosGastos;
                this.atualizarDisplayPeculiaridades();
                this.atualizarTotais();
                this.salvarDados();
            }
        });
    }
    
    // ==================== CÁLCULOS ====================
    
    calcularTotalDesvantagens() {
        return this.fontes.desvantagens.caracteristicasFisicas +
               this.fontes.desvantagens.riqueza +
               this.fontes.desvantagens.outras;
    }
    
    calcularTotalVantagens() {
        return this.fontes.vantagens.riqueza +
               this.fontes.vantagens.outras;
    }
    
    calcularTotalDiretos() {
        let total = 0;
        // Soma atributos positivos (custo) e peculiariedades negativas (dá pontos)
        if (this.fontes.diretos.atributos > 0) total += this.fontes.diretos.atributos;
        if (this.fontes.diretos.pericias > 0) total += this.fontes.diretos.pericias;
        if (this.fontes.diretos.tecnicas > 0) total += this.fontes.diretos.tecnicas;
        if (this.fontes.diretos.magia > 0) total += this.fontes.diretos.magia;
        // Peculiaridades são negativas, então subtrai (dá pontos)
        if (this.fontes.diretos.peculiaridades < 0) total -= Math.abs(this.fontes.diretos.peculiaridades);
        
        return total;
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhos;
        const vantagensTotal = this.calcularTotalVantagens();
        const desvantagensTotal = this.calcularTotalDesvantagens();
        const diretosTotal = this.calcularTotalDiretos();
        
        // FÓRMULA: Total - Vantagens - Diretos + Desvantagens
        const disponiveis = totalPontos - vantagensTotal - diretosTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            diretos: diretosTotal,
            disponiveis: disponiveis
        };
    }
    
    // ==================== ATUALIZAÇÕES VISUAIS ====================
    
    atualizarDisplayDesvantagens() {
        const total = this.calcularTotalDesvantagens();
        const elemento = document.getElementById('pontosDesvantagens');
        const percentual = document.getElementById('percDesvantagens');
        
        if (elemento) {
            elemento.textContent = total;
            elemento.parentElement.classList.remove('positivo', 'negativo');
            if (total > 0) {
                elemento.parentElement.classList.add('negativo');
            }
        }
        
        if (percentual) {
            const perc = Math.round((total / (this.pontosIniciais + this.pontosGanhos)) * 100);
            percentual.textContent = `${perc}%`;
        }
        
        this.atualizarLimiteDesvantagens(total);
    }
    
    atualizarDisplayVantagens() {
        const total = this.calcularTotalVantagens();
        const elemento = document.getElementById('pontosVantagens');
        const percentual = document.getElementById('percVantagens');
        
        if (elemento) {
            elemento.textContent = total;
            elemento.parentElement.classList.remove('positivo', 'negativo');
            if (total > 0) {
                elemento.parentElement.classList.add('positivo');
            }
        }
        
        if (percentual) {
            const perc = Math.round((total / (this.pontosIniciais + this.pontosGanhos)) * 100);
            percentual.textContent = `${perc}%`;
        }
    }
    
    atualizarDisplayAtributos() {
        const pontos = this.fontes.diretos.atributos;
        const elemento = document.getElementById('pontosAtributos');
        const percentual = document.getElementById('percAtributos');
        
        if (elemento) {
            elemento.textContent = pontos;
            elemento.parentElement.classList.remove('positivo', 'negativo');
            if (pontos > 0) {
                elemento.parentElement.classList.add('positivo');
            } else if (pontos < 0) {
                elemento.parentElement.classList.add('negativo');
            }
        }
        
        if (percentual) {
            const perc = Math.round((Math.abs(pontos) / (this.pontosIniciais + this.pontosGanhos)) * 100);
            percentual.textContent = `${perc}%`;
        }
    }
    
    atualizarDisplayPericias() {
        const elemento = document.getElementById('pontosPericias');
        if (elemento) {
            elemento.textContent = this.fontes.diretos.pericias;
        }
    }
    
    atualizarDisplayPeculiaridades() {
        const pontos = Math.abs(this.fontes.diretos.peculiaridades);
        const elemento = document.getElementById('pontosPeculiaridades');
        
        if (elemento) {
            elemento.textContent = pontos;
        }
        
        this.atualizarLimitePeculiaridades(pontos);
    }
    
    atualizarLimiteDesvantagens(total) {
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (total / this.limites.desvantagens) * 100);
            
            progress.style.width = `${percentual}%`;
            progress.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                           percentual >= 80 ? '#f39c12' : '#3498db';
            
            texto.textContent = `${total}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    atualizarLimitePeculiaridades(total) {
        const progress = document.getElementById('progressPeculiaridades');
        const texto = document.getElementById('textPeculiaridades');
        const percent = document.getElementById('percentPeculiaridades');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (total / this.limites.peculiaridades) * 100);
            
            progress.style.width = `${percentual}%`;
            progress.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                           percentual >= 80 ? '#f39c12' : '#3498db';
            
            texto.textContent = `${total}/${this.limites.peculiaridades} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        // Pontos disponíveis
        const dispElement = document.getElementById('pontosDisponiveis');
        if (dispElement) {
            dispElement.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                dispElement.style.color = '#e74c3c';
                dispElement.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                dispElement.style.color = '#f39c12';
            } else {
                dispElement.style.color = '#27ae60';
            }
        }
        
        // Total gastos
        const gastosElement = document.getElementById('pontosGastos');
        if (gastosElement) {
            gastosElement.textContent = calculo.vantagens + calculo.diretos;
        }
    }
    
    atualizarTudo() {
        this.atualizarDisplayDesvantagens();
        this.atualizarDisplayVantagens();
        this.atualizarDisplayAtributos();
        this.atualizarDisplayPericias();
        this.atualizarDisplayPeculiaridades();
        this.atualizarTotais();
    }
    
    // ==================== PERSISTÊNCIA ====================
    
    salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhos: this.pontosGanhos,
            fontes: { ...this.fontes },
            limites: { ...this.limites }
        };
        
        localStorage.setItem('pontos_manager_soma', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_manager_soma');
            if (dados) {
                const parsed = JSON.parse(dados);
                
                if (parsed.pontosIniciais) this.pontosIniciais = parsed.pontosIniciais;
                if (parsed.pontosGanhos) this.pontosGanhos = parsed.pontosGanhos;
                if (parsed.fontes) {
                    Object.assign(this.fontes, parsed.fontes);
                }
                if (parsed.limites) {
                    Object.assign(this.limites, parsed.limites);
                }
                
                this.atualizarTudo();
            }
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
    }
    
    // ==================== FUNÇÕES PÚBLICAS ====================
    
    obterTotalDesvantagens() {
        return this.calcularTotalDesvantagens();
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
    
    mostrarStatus() {
        const calc = this.calcularPontosDisponiveis();
        console.log('📊 STATUS DOS PONTOS:');
        console.log('- Desvantagens:', calc.desvantagens, 'pts');
        console.log('- Vantagens:', calc.vantagens, 'pts');
        console.log('- Diretos:', calc.diretos, 'pts');
        console.log('- Disponíveis:', calc.disponiveis, 'pts');
        console.log('- Fontes desvantagens:', this.fontes.desvantagens);
        console.log('- Fontes vantagens:', this.fontes.vantagens);
    }
}

// ==================== INSTÂNCIA GLOBAL ====================

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

// ==================== EVENTOS DE TESTE ====================

function testarSomaDesvantagens() {
    console.log('🧪 TESTANDO SOMA DE DESVANTAGENS');
    
    if (!pontosManager) {
        inicializarPontosManager();
    }
    
    // 1. Características físicas: Magro (-5)
    document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
        detail: { pontosGastos: -5 }
    }));
    
    // 2. Riqueza: Batalhador (-10)
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('riquezaAtualizadaParaSoma', {
            detail: { pontos: -10 }
        }));
    }, 100);
    
    // 3. Atributos: +15
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('atributosAtualizados', {
            detail: { pontosGastos: 15 }
        }));
        
        // Verifica resultado
        setTimeout(() => {
            pontosManager.mostrarStatus();
            
            const desvTotal = pontosManager.obterTotalDesvantagens();
            if (desvTotal === 15) {
                console.log('✅ SUCESSO! Desvantagens somam:', desvTotal, 'pts');
                console.log('📈 Pontos disponíveis:', pontosManager.obterPontosDisponiveis(), 'pts');
            } else {
                console.log('❌ FALHA! Desvantagens deveriam ser 15, mas são:', desvTotal);
            }
        }, 200);
    }, 200);
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            
            // Teste automático
            setTimeout(() => {
                console.log('🔄 Sistema de pontos pronto para usar!');
                // Descomente para testar automaticamente:
                // testarSomaDesvantagens();
            }, 1000);
        }
    }, 500);
});

// ==================== EXPORTAÇÕES ====================

window.obterPontosManager = inicializarPontosManager;
window.testarSistemaPontos = testarSomaDesvantagens;
window.PontosManager = PontosManager;