// ===========================================
// VANTAGENS-LOGICA.JS - ATRIBUTOS CORRIGIDOS
// Lógica corrigida para atributos complementares
// ===========================================

class VantagensLogica {
    constructor() {
        // ... (código anterior de aparência e idiomas permanece igual) ...
        
        // SISTEMA DE ATRIBUTOS COMPLEMENTARES - VERSÃO CORRIGIDA
        this.atributosComplementares = {
            vontade: { 
                valor: 0, 
                min: -4, 
                max: 5, 
                custoPorPonto: 5, 
                pontos: 0,
                tipo: "vontade",
                descricao: "Cada nível = ±5 pontos em Força de Vontade"
            },
            percepcao: { 
                valor: 0, 
                min: -4, 
                max: 5, 
                custoPorPonto: 5, 
                pontos: 0,
                tipo: "percepcao",
                descricao: "Cada nível = ±5 pontos em Percepção"
            },
            pv: { 
                valor: 0, 
                min: -2, 
                max: 2, 
                custoPorPonto: 2, 
                pontos: 0,
                tipo: "pv",
                descricao: "Cada nível = ±1 PV (±2 pontos)"
            },
            pf: { 
                valor: 0, 
                min: -3, 
                max: 3, 
                custoPorPonto: 3, 
                pontos: 0,
                tipo: "pf",
                descricao: "Cada nível = ±1 PF (±3 pontos)"
            },
            velocidade: { 
                valor: 0, 
                min: -4, 
                max: 5, 
                custoPorPonto: 5, // 5 pontos por 0.25 de velocidade
                pontos: 0,
                tipo: "velocidade",
                descricao: "Cada nível = ±0.25 de Velocidade (±5 pontos)"
            },
            deslocamento: { 
                valor: 0, 
                min: -4, 
                max: 5, 
                custoPorPonto: 5, // 5 pontos por nível de deslocamento
                pontos: 0,
                tipo: "deslocamento",
                descricao: "Cada nível = ±1 de Deslocamento (±5 pontos)"
            }
        };
        
        this.inicializado = false;
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        this.configurarSubTabs();
        this.configurarAparencia();
        this.configurarIdiomas();
        this.configurarAtributosComplementares();
        this.carregarLocalStorage();
        this.atualizarResumo();
        
        this.inicializado = true;
    }
    
    // ========== CONFIGURAR ATRIBUTOS COMPLEMENTARES ==========
    configurarAtributosComplementares() {
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        
        atributos.forEach(atributo => {
            const minusBtn = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
            const plusBtn = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
            const input = document.getElementById(`${atributo}Mod`);
            const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
            
            if (minusBtn && plusBtn && input && pontosSpan) {
                minusBtn.addEventListener('click', () => this.ajustarAtributo(atributo, -1));
                plusBtn.addEventListener('click', () => this.ajustarAtributo(atributo, 1));
                
                input.value = this.atributosComplementares[atributo].valor;
                pontosSpan.textContent = this.atributosComplementares[atributo].pontos;
                
                this.verificarLimitesAtributo(atributo);
            }
        });
        
        this.atualizarAtributosComplementares();
    }
    
    ajustarAtributo(atributo, delta) {
        const config = this.atributosComplementares[atributo];
        const novoValor = config.valor + delta;
        
        if (novoValor < config.min || novoValor > config.max) {
            return;
        }
        
        config.valor = novoValor;
        
        // CALCULA PONTOS - VERSÃO CORRIGIDA
        switch(atributo) {
            case 'vontade':
            case 'percepcao':
            case 'deslocamento':
                // Cada nível = ±custoPorPonto pontos
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'pv':
                // Cada nível = ±1 PV, custo = ±2 pontos por nível
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'pf':
                // Cada nível = ±1 PF, custo = ±3 pontos por nível
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'velocidade':
                // CADA NÍVEL = ±0.25 DE VELOCIDADE
                // Custo = 5 pontos por 0.25 de velocidade
                // Se novoValor = 1 → 0.25 velocidade → 5 pontos
                // Se novoValor = 4 → 1.00 velocidade → 20 pontos
                config.pontos = novoValor * config.custoPorPonto;
                break;
        }
        
        // Atualiza interface
        const input = document.getElementById(`${atributo}Mod`);
        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
        
        if (input) input.value = novoValor;
        if (pontosSpan) pontosSpan.textContent = config.pontos;
        
        this.verificarLimitesAtributo(atributo);
        this.atualizarAtributosComplementares();
        this.salvarLocalStorage();
        this.atualizarResumo();
    }
    
    verificarLimitesAtributo(atributo) {
        const config = this.atributosComplementares[atributo];
        const minusBtn = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
        const plusBtn = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
        
        if (minusBtn) {
            minusBtn.disabled = config.valor <= config.min;
        }
        
        if (plusBtn) {
            plusBtn.disabled = config.valor >= config.max;
        }
    }
    
    atualizarAtributosComplementares() {
        // Calcula total de pontos
        const totalPontos = Object.values(this.atributosComplementares)
            .reduce((total, atributo) => total + atributo.pontos, 0);
        
        // Atualiza badge
        const badge = document.getElementById('pontosAtributosComplementares');
        if (badge) {
            const textoPontos = totalPontos >= 0 ? `+${totalPontos} pts` : `${totalPontos} pts`;
            badge.textContent = textoPontos;
            badge.className = 'pontos-badge';
            
            if (totalPontos > 0) {
                badge.classList.add('positivo');
            } else if (totalPontos < 0) {
                badge.classList.add('negativo');
            }
        }
        
        // Atualiza todos os botões
        Object.keys(this.atributosComplementares).forEach(atributo => {
            this.verificarLimitesAtributo(atributo);
        });
    }
    
    getPontosAtributosComplementares() {
        return Object.values(this.atributosComplementares)
            .reduce((total, atributo) => total + atributo.pontos, 0);
    }
    
    getDetalhesAtributosComplementares() {
        const detalhes = {};
        Object.keys(this.atributosComplementares).forEach(atributo => {
            const config = this.atributosComplementares[atributo];
            detalhes[atributo] = {
                valor: config.valor,
                pontos: config.pontos,
                descricao: config.descricao
            };
        });
        return detalhes;
    }
    
    // ========== SISTEMA DE RESUMO ==========
    atualizarResumo() {
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        let totalVantagens = 0;
        let totalDesvantagens = 0;
        
        [pontosAparencia, pontosIdiomas, pontosAtributos].forEach(pontos => {
            if (pontos > 0) {
                totalVantagens += pontos;
            } else if (pontos < 0) {
                totalDesvantagens += Math.abs(pontos);
            }
        });
        
        // Atualiza display
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = totalVantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = totalDesvantagens;
        if (saldoElem) saldoElem.textContent = totalVantagens - totalDesvantagens;
        
        // Integração com sistema principal de pontos
        this.dispararEventosParaSistemaPrincipal();
    }
    
    dispararEventosParaSistemaPrincipal() {
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        // Dispara evento consolidado
        const evento = new CustomEvent('vantagensAtualizadas', {
            detail: {
                aparencia: {
                    pontos: pontosAparencia,
                    tipo: pontosAparencia > 0 ? 'vantagem' : pontosAparencia < 0 ? 'desvantagem' : 'neutro'
                },
                idiomas: {
                    pontos: pontosIdiomas,
                    tipo: pontosIdiomas > 0 ? 'vantagem' : pontosIdiomas < 0 ? 'desvantagem' : 'neutro'
                },
                atributos_complementares: {
                    pontos: pontosAtributos,
                    tipo: pontosAtributos > 0 ? 'vantagem' : pontosAtributos < 0 ? 'desvantagem' : 'neutro',
                    detalhes: this.getDetalhesAtributosComplementares()
                },
                totalVantagens: Math.max(0, pontosAparencia) + Math.max(0, pontosIdiomas) + Math.max(0, pontosAtributos),
                totalDesvantagens: Math.abs(Math.min(0, pontosAparencia)) + Math.abs(Math.min(0, pontosIdiomas)) + Math.abs(Math.min(0, pontosAtributos)),
                saldo: pontosAparencia + pontosIdiomas + pontosAtributos,
                timestamp: new Date().toISOString()
            }
        });
        
        document.dispatchEvent(evento);
    }
    
    // ========== LOCAL STORAGE ==========
    salvarLocalStorage() {
        try {
            const dados = {
                aparencia: this.getPontosAparencia(),
                idiomaMaterno: this.idiomaMaterno,
                idiomasAdicionais: this.idiomasAdicionais,
                alfabetizacao: this.alfabetizacaoAtual,
                atributosComplementares: this.atributosComplementares,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gurps_vantagens', JSON.stringify(dados));
        } catch (error) {
            console.warn('Não foi possível salvar vantagens:', error);
        }
    }
    
    carregarLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_vantagens');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                // Aparência
                if (dados.aparencia !== undefined) {
                    const select = document.getElementById('nivelAparencia');
                    if (select) select.value = dados.aparencia;
                }
                
                // Idiomas
                if (dados.idiomaMaterno) {
                    this.idiomaMaterno = dados.idiomaMaterno;
                    const input = document.getElementById('idiomaMaternoNome');
                    if (input) input.value = this.idiomaMaterno.nome;
                }
                
                if (dados.idiomasAdicionais) {
                    this.idiomasAdicionais = dados.idiomasAdicionais;
                }
                
                if (dados.alfabetizacao !== undefined) {
                    this.alfabetizacaoAtual = dados.alfabetizacao;
                }
                
                // Atributos complementares
                if (dados.atributosComplementares) {
                    this.atributosComplementares = dados.atributosComplementares;
                    
                    // Atualiza interface
                    Object.keys(this.atributosComplementares).forEach(atributo => {
                        const input = document.getElementById(`${atributo}Mod`);
                        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
                        const config = this.atributosComplementares[atributo];
                        
                        if (input) input.value = config.valor;
                        if (pontosSpan) pontosSpan.textContent = config.pontos;
                    });
                }
                
                // Atualiza displays
                setTimeout(() => {
                    this.atualizarDisplayAparencia();
                    this.atualizarDisplayIdiomas();
                    this.atualizarDescricaoAlfabetizacao();
                    this.atualizarAtributosComplementares();
                    this.atualizarResumo();
                }, 100);
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar vantagens:', error);
        }
        return false;
    }
    
    // ========== UTILIDADES ==========
    formatarNome(key) {
        return key.split('-')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // ========== EXPORTAÇÃO ==========
    exportarDados() {
        return {
            aparencia: {
                pontos: this.getPontosAparencia(),
                nome: this.obterNomeAparenciaPorPontos(this.getPontosAparencia()),
                reacao: this.obterNivelAparenciaPorPontos(this.getPontosAparencia())?.reacao || 0
            },
            idiomas: {
                idiomaMaterno: this.idiomaMaterno,
                idiomasAdicionais: this.idiomasAdicionais,
                alfabetizacao: this.alfabetizacaoAtual,
                pontosTotais: this.calcularPontosIdiomas()
            },
            atributosComplementares: {
                valores: Object.fromEntries(
                    Object.entries(this.atributosComplementares).map(([key, config]) => [
                        key, 
                        { valor: config.valor, pontos: config.pontos, descricao: config.descricao }
                    ])
                ),
                pontosTotais: this.getPontosAtributosComplementares()
            },
            resumo: {
                totalVantagens: Math.max(0, this.getPontosAparencia()) + 
                               Math.max(0, this.calcularPontosIdiomas()) + 
                               Math.max(0, this.getPontosAtributosComplementares()),
                totalDesvantagens: Math.abs(Math.min(0, this.getPontosAparencia())) + 
                                 Math.abs(Math.min(0, this.calcularPontosIdiomas())) + 
                                 Math.abs(Math.min(0, this.getPontosAtributosComplementares())),
                saldo: this.getPontosAparencia() + 
                      this.calcularPontosIdiomas() + 
                      this.getPontosAtributosComplementares()
            }
        };
    }
}

// ========== INTEGRAÇÃO COM SISTEMA PRINCIPAL DE PONTOS ==========
class VantagensIntegracaoPontos {
    constructor(pontosManager) {
        this.pontosManager = pontosManager;
        this.configurarIntegracao();
    }
    
    configurarIntegracao() {
        document.addEventListener('vantagensAtualizadas', (e) => {
            const detalhes = e.detail;
            
            // Atualiza vantagens (pontos positivos)
            const vantagensTotais = detalhes.totalVantagens;
            this.pontosManager.gastos.vantagens = vantagensTotais;
            
            // Atualiza desvantagens (pontos negativos)
            const desvantagensTotais = detalhes.totalDesvantagens;
            
            // Separa por origem
            this.pontosManager.gastos.desvantagens.caracteristicas = 
                Math.abs(Math.min(0, detalhes.aparencia.pontos)) + 
                Math.abs(Math.min(0, detalhes.idiomas.pontos)) + 
                Math.abs(Math.min(0, detalhes.atributos_complementares.pontos));
            
            // Atualiza display no sistema principal
            this.pontosManager.atualizarDisplay('vantagens');
            this.pontosManager.atualizarDisplay('desvantagens');
            this.pontosManager.atualizarTudo();
        });
    }
}

// ========== INICIALIZAÇÃO GLOBAL ==========
let vantagensLogicaInstance = null;
let integracaoPontosInstance = null;

function inicializarVantagensLogica() {
    if (!vantagensLogicaInstance) {
        vantagensLogicaInstance = new VantagensLogica();
        
        // Integra com sistema de pontos se existir
        const pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
        if (pontosManager) {
            integracaoPontosInstance = new VantagensIntegracaoPontos(pontosManager);
        }
    }
    vantagensLogicaInstance.inicializar();
    return vantagensLogicaInstance;
}

// Inicialização automática quando a aba é aberta
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    setTimeout(() => {
                        if (!vantagensLogicaInstance) {
                            inicializarVantagensLogica();
                        }
                    }, 100);
                }
            }
        });
    });
    
    const tabVantagens = document.getElementById('vantagens');
    if (tabVantagens) {
        observer.observe(tabVantagens, { attributes: true });
    }
    
    // Inicializar também quando a página carrega já com a aba ativa
    if (document.getElementById('vantagens')?.classList.contains('active')) {
        setTimeout(inicializarVantagensLogica, 300);
    }
});

// ========== EXPORT PARA USO GLOBAL ==========
window.VantagensLogica = VantagensLogica;
window.VantagensIntegracaoPontos = VantagensIntegracaoPontos;
window.inicializarVantagensLogica = inicializarVantagensLogica;
window.obterVantagensLogica = function() {
    return vantagensLogicaInstance;
};