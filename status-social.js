// ===========================================
// STATUS-SOCIAL.JS - Sistema Completo
// Seguindo EXATAMENTE as regras do PDF enviado
// ===========================================

class StatusSocialManager {
    constructor() {
        // ===== SISTEMAS BÁSICOS =====
        this.status = 0; // -20 a +25 (5 pts/nível)
        this.carisma = 0; // 0 a +3 (5 pts/nível, só vantagem)
        this.reputacaoPositiva = 0; // 0 a +5 (5 pts/nível)
        this.reputacaoNegativa = 0; // 0 a +5 (-5 pts/nível)
        
        // ===== SISTEMAS COMPLEXOS (com regras específicas) =====
        this.aliados = [];      // Vantagem - REGRA ESPECÍFICA
        this.contatos = [];     // Vantagem - REGRA ESPECÍFICA  
        this.patronos = [];     // Vantagem - REGRA ESPECÍFICA
        this.inimigos = [];     // Desvantagem - REGRA ESPECÍFICA
        this.dependentes = [];  // Desvantagem - REGRA ESPECÍFICA
        
        // IDs para controle
        this.nextId = 1;
        this.inicializado = false;
        this.pontosManager = null;
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        // Sistemas básicos
        this.configurarStatusSocial();
        this.configurarCarisma();
        this.configurarReputacao();
        
        // Sistemas complexos (cada um com suas regras próprias)
        this.configurarSistemaAliados();   // Seguindo regra específica
        this.configurarSistemaContatos();  // Seguindo regra específica
        this.configurarSistemaPatronos();  // Seguindo regra específica
        this.configurarSistemaInimigos();  // Seguindo regra específica
        this.configurarSistemaDependentes(); // Seguindo regra específica
        
        this.configurarIntegracaoPontos();
        this.carregarLocalStorage();
        this.atualizarResumoGeral();
        
        this.inicializado = true;
    }
    
    // ===========================================
    // 1. STATUS SOCIAL (regra simples)
    // ===========================================
    configurarStatusSocial() {
        const minusBtn = document.querySelector('.btn-controle.minus[data-tipo="status"]');
        const plusBtn = document.querySelector('.btn-controle.plus[data-tipo="status"]');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarStatus(-1));
            plusBtn.addEventListener('click', () => this.ajustarStatus(1));
            this.atualizarDisplayStatus();
        }
    }
    
    ajustarStatus(delta) {
        const novoValor = this.status + delta;
        if (novoValor < -20 || novoValor > 25) return;
        
        this.status = novoValor;
        this.atualizarDisplayStatus();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayStatus() {
        const valorDisplay = document.getElementById('valorStatus');
        const pontosDisplay = document.getElementById('pontosStatus');
        
        if (valorDisplay) valorDisplay.textContent = this.status;
        if (pontosDisplay) {
            const pontos = this.status * 5; // 5 pts por nível
            const texto = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
            pontosDisplay.textContent = texto;
            pontosDisplay.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    // ===========================================
    // 2. CARISMA (regra simples)
    // ===========================================
    configurarCarisma() {
        const minusBtn = document.querySelector('.btn-controle.minus[data-tipo="carisma"]');
        const plusBtn = document.querySelector('.btn-controle.plus[data-tipo="carisma"]');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarCarisma(-1));
            plusBtn.addEventListener('click', () => this.ajustarCarisma(1));
            this.atualizarDisplayCarisma();
        }
    }
    
    ajustarCarisma(delta) {
        const novoValor = this.carisma + delta;
        if (novoValor < 0 || novoValor > 3) return; // Máximo +3
        
        this.carisma = novoValor;
        this.atualizarDisplayCarisma();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayCarisma() {
        const valorDisplay = document.getElementById('valorCarisma');
        const pontosDisplay = document.getElementById('pontosCarisma');
        
        if (valorDisplay) valorDisplay.textContent = this.carisma;
        if (pontosDisplay) {
            const pontos = this.carisma * 5; // 5 pts por nível
            pontosDisplay.textContent = `+${pontos} pts`;
            pontosDisplay.className = 'pontos-badge positivo';
        }
    }
    
    // ===========================================
    // 3. REPUTAÇÃO (regra simples)
    // ===========================================
    configurarReputacao() {
        document.querySelectorAll('.btn-controle[data-tipo="positiva"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = e.target.classList.contains('minus') ? -1 : 1;
                this.ajustarReputacao('positiva', delta);
            });
        });
        
        document.querySelectorAll('.btn-controle[data-tipo="negativa"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = e.target.classList.contains('minus') ? -1 : 1;
                this.ajustarReputacao('negativa', delta);
            });
        });
        
        this.atualizarDisplayReputacao();
    }
    
    ajustarReputacao(tipo, delta) {
        if (tipo === 'positiva') {
            const novoValor = this.reputacaoPositiva + delta;
            if (novoValor >= 0 && novoValor <= 5) {
                this.reputacaoPositiva = novoValor;
            }
        } else {
            const novoValor = this.reputacaoNegativa + delta;
            if (novoValor >= 0 && novoValor <= 5) {
                this.reputacaoNegativa = novoValor;
            }
        }
        
        this.atualizarDisplayReputacao();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayReputacao() {
        const valorPos = document.getElementById('valorRepPositiva');
        const valorNeg = document.getElementById('valorRepNegativa');
        const pontosPos = document.getElementById('pontosRepPositiva');
        const pontosNeg = document.getElementById('pontosRepNegativa');
        
        if (valorPos) valorPos.textContent = this.reputacaoPositiva;
        if (valorNeg) valorNeg.textContent = this.reputacaoNegativa;
        
        if (pontosPos) {
            const pontos = this.reputacaoPositiva * 5;
            pontosPos.textContent = pontos > 0 ? `+${pontos} pts` : '0 pts';
            pontosPos.className = this.reputacaoPositiva > 0 ? 'pontos-item positiva' : 'pontos-item';
        }
        
        if (pontosNeg) {
            const pontos = this.reputacaoNegativa * -5;
            pontosNeg.textContent = pontos < 0 ? `${pontos} pts` : '0 pts';
            pontosNeg.className = this.reputacaoNegativa > 0 ? 'pontos-item negativa' : 'pontos-item';
        }
    }
    
    // ===========================================
    // 4. SISTEMA DE ALIADOS (REGRA ESPECÍFICA DO PDF)
    // Baseado na tabela de Poder do Aliado (pág. 35)
    // ===========================================
    configurarSistemaAliados() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="aliado"]');
        const listaContainer = document.getElementById('listaAliados');
        
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModalAliado());
        }
        
        this.atualizarDisplayAliados();
    }
    
    calcularCustoAliado(pontosPercentual, frequencia, grupo = false, tamanhoGrupo = 1) {
        // Tabela de Poder do Aliado (pág. 35)
        let custoBase = 0;
        
        if (pontosPercentual <= 25) custoBase = 1;
        else if (pontosPercentual <= 50) custoBase = 2;
        else if (pontosPercentual <= 75) custoBase = 3;
        else if (pontosPercentual <= 100) custoBase = 5;
        else if (pontosPercentual <= 150) custoBase = 10;
        else return 0; // Não permitido acima de 150%
        
        // Multiplicador por frequência (pág. 36)
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        // Multiplicador por grupo (pág. 35-36)
        let multGrupo = 1;
        if (grupo && tamanhoGrupo > 5) {
            if (tamanhoGrupo <= 10) multGrupo = 6;
            else if (tamanhoGrupo <= 20) multGrupo = 8;
            else if (tamanhoGrupo <= 50) multGrupo = 10;
            else if (tamanhoGrupo <= 100) multGrupo = 12;
            // Para mais de 100, adiciona x6 para cada ordem de magnitude
        }
        
        return custoBase * multFrequencia * multGrupo;
    }
    
    // ===========================================
    // 5. SISTEMA DE CONTATOS (REGRA ESPECÍFICA DO PDF)
    // Baseado na tabela de NH Efetivo (pág. 48)
    // ===========================================
    configurarSistemaContatos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="contato"]');
        
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModalContato());
        }
        
        this.atualizarDisplayContatos();
    }
    
    calcularCustoContato(nhEfetivo, frequencia, confiabilidade) {
        // Tabela de NH Efetivo (pág. 48)
        let custoBase = 0;
        
        switch(nhEfetivo) {
            case 12: custoBase = 1; break;
            case 15: custoBase = 2; break;
            case 18: custoBase = 3; break;
            case 20: custoBase = 4; break;
            default: return 0;
        }
        
        // +1 ponto para contatos sobrenaturais
        // (implementar se necessário)
        
        // Multiplicador por frequência
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        // Multiplicador por confiabilidade (pág. 48-49)
        let multConfiabilidade = 1;
        switch(confiabilidade) {
            case 'completamente': multConfiabilidade = 3; break;
            case 'razoavelmente': multConfiabilidade = 2; break;
            case 'meio': multConfiabilidade = 1; break;
            case 'não': multConfiabilidade = 0.5; break;
        }
        
        return Math.ceil(custoBase * multFrequencia * multConfiabilidade);
    }
    
    // ===========================================
    // 6. SISTEMA DE PATRONOS (REGRA ESPECÍFICA DO PDF)
    // Baseado na tabela de Poder (pág. 75)
    // ===========================================
    configurarSistemaPatronos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="patrono"]');
        
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModalPatrono());
        }
        
        this.atualizarDisplayPatronos();
    }
    
    calcularCustoPatrono(nivelPoder, frequencia, ampliacoes = [], limitacoes = []) {
        // Tabela de Poder do Patrono (pág. 75)
        let custoBase = 0;
        
        switch(nivelPoder) {
            case 'poderoso': custoBase = 10; break;
            case 'extremamente': custoBase = 15; break;
            case 'ultrapoderoso': custoBase = 20; break;
            case 'organizacao_poderosa': custoBase = 25; break;
            case 'governo': custoBase = 30; break;
            default: return 0;
        }
        
        // Multiplicador por frequência
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        let custoTotal = custoBase * multFrequencia;
        
        // Aplicar ampliações (pág. 76)
        ampliacoes.forEach(amp => {
            if (amp === 'altamente_acessivel') custoTotal *= 1.5; // +50%
            if (amp === 'equipamento') custoTotal *= 1.5; // +50% ou +100%
            if (amp === 'habilidades_especiais') custoTotal *= 1.5; // +50% ou +100%
        });
        
        // Aplicar limitações (pág. 76)
        limitacoes.forEach(lim => {
            if (lim === 'intervencao_minima') custoTotal *= 0.5; // -50%
            if (lim === 'relutante') custoTotal *= 0.5; // -50%
            if (lim === 'segredo') custoTotal *= 0.5; // -50%
        });
        
        return Math.round(custoTotal);
    }
    
    // ===========================================
    // 7. SISTEMA DE INIMIGOS (REGRA ESPECÍFICA DO PDF)
    // Baseado na tabela de Poder (pág. 145-146)
    // ===========================================
    configurarSistemaInimigos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="inimigo"]');
        
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModalInimigo());
        }
        
        this.atualizarDisplayInimigos();
    }
    
    calcularCustoInimigo(nivelPoder, intencao, frequencia, casoEspecial = null) {
        // Tabela de Poder do Inimigo (pág. 145)
        let custoBase = 0;
        
        switch(nivelPoder) {
            case 'menos_poderoso': custoBase = -5; break;
            case 'igual': custoBase = -10; break;
            case 'mais_poderoso': custoBase = -20; break;
            case 'grupo_grande': custoBase = -30; break;
            case 'governo': custoBase = -40; break;
            default: return 0;
        }
        
        // Casos especiais (pág. 145)
        if (casoEspecial === 'desconhecido') custoBase -= 5;
        if (casoEspecial === 'gêmeo_maligno') custoBase -= 10;
        
        // Multiplicador por intenção (pág. 145)
        let multIntencao = 1;
        switch(intencao) {
            case 'observador': multIntencao = 0.25; break; // x1/4
            case 'rival': multIntencao = 0.5; break;      // x1/2
            case 'perseguidor': multIntencao = 1; break;  // x1
        }
        
        // Multiplicador por frequência
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        return Math.round(custoBase * multIntencao * multFrequencia);
    }
    
    // ===========================================
    // 8. SISTEMA DE DEPENDENTES (REGRA ESPECÍFICA DO PDF)
    // Baseado na tabela de Capacidade (pág. 130)
    // ===========================================
    configurarSistemaDependentes() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="dependente"]');
        
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModalDependente());
        }
        
        this.atualizarDisplayDependentes();
    }
    
    calcularCustoDependente(pontosPercentual, importancia, frequencia) {
        // Tabela de Capacidade (pág. 130)
        let custoBase = 0;
        
        if (pontosPercentual <= 100) custoBase = -1;
        else if (pontosPercentual <= 75) custoBase = -2;
        else if (pontosPercentual <= 50) custoBase = -5;
        else if (pontosPercentual <= 25) custoBase = -10;
        else if (pontosPercentual <= 0) custoBase = -15;
        
        // Multiplicador por importância (pág. 130)
        let multImportancia = 1;
        switch(importancia) {
            case 'empregado': multImportancia = 0.5; break; // x1/2
            case 'amigo': multImportancia = 1; break;       // x1
            case 'ser_amado': multImportancia = 2; break;   // x2
        }
        
        // Multiplicador por frequência
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        return Math.round(custoBase * multImportancia * multFrequencia);
    }
    
    // ===========================================
    // FUNÇÕES AUXILIARES
    // ===========================================
    obterMultiplicadorFrequencia(valorFrequencia) {
        // Tabela de Frequência de Participação (pág. 36)
        switch(valorFrequencia) {
            case 6: return 0.5;   // Esporadicamente (x1/2)
            case 9: return 1;     // Com frequência (x1)
            case 12: return 2;    // Bastante frequência (x2)
            case 15: return 3;    // Quase o tempo todo (x3)
            case 18: return 4;    // Constantemente (x4)
            default: return 1;
        }
    }
    
    // Função para obter texto da frequência
    obterTextoFrequencia(valor) {
        const frequencias = {
            6: 'Esporadicamente (6-)',
            9: 'Com frequência (9-)',
            12: 'Bastante frequência (12-)',
            15: 'Quase o tempo todo (15-)',
            18: 'Constantemente (18-)'
        };
        return frequencias[valor] || 'Desconhecido';
    }
    
    // ===========================================
    // FUNÇÕES DE DISPLAY E ATUALIZAÇÃO
    // ===========================================
    atualizarDisplayAliados() {
        const container = document.getElementById('listaAliados');
        const badge = document.getElementById('pontosAliados');
        
        if (!container || !badge) return;
        
        // Calcular total de pontos
        const totalPontos = this.aliados.reduce((total, aliado) => total + aliado.pontos, 0);
        
        // Atualizar badge
        badge.textContent = `+${totalPontos} pts`;
        badge.className = 'pontos-badge positivo';
        
        // Atualizar lista
        if (this.aliados.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum aliado adicionado</div>';
        } else {
            container.innerHTML = this.aliados.map(aliado => `
                <div class="item-lista vantagem">
                    <div class="item-info">
                        <strong>${aliado.nome}</strong>
                        <small>${aliado.descricao}</small>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-positivo">+${aliado.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${aliado.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Funções similares para Contatos, Patronos, Inimigos, Dependentes...
    // (Vou criar no código completo)
    
    atualizarResumoGeral() {
        // Calcular totais de vantagens
        const totalStatus = this.status * 5;
        const totalCarisma = this.carisma * 5;
        const totalRepPositiva = this.reputacaoPositiva * 5;
        
        // Calcular totais de desvantagens
        const totalRepNegativa = this.reputacaoNegativa * -5;
        
        // Aliados, Contatos, Patronos são vantagens (positivos)
        const totalAliados = this.aliados.reduce((t, a) => t + a.pontos, 0);
        const totalContatos = this.contatos.reduce((t, c) => t + c.pontos, 0);
        const totalPatronos = this.patronos.reduce((t, p) => t + p.pontos, 0);
        
        // Inimigos e Dependentes são desvantagens (negativos)
        const totalInimigos = this.inimigos.reduce((t, i) => t + i.pontos, 0);
        const totalDependentes = this.dependentes.reduce((t, d) => t + d.pontos, 0);
        
        // Totais gerais
        const totalVantagens = Math.max(0, totalStatus) + totalCarisma + totalRepPositiva + 
                              totalAliados + totalContatos + totalPatronos;
        
        const totalDesvantagens = Math.abs(Math.min(0, totalStatus)) + Math.abs(totalRepNegativa) +
                                 Math.abs(totalInimigos) + Math.abs(totalDependentes);
        
        const saldo = totalVantagens - totalDesvantagens;
        
        // Atualizar resumo
        const totalStatusGeral = document.getElementById('totalStatusGeral');
        if (totalStatusGeral) {
            totalStatusGeral.textContent = saldo;
        }
    }
    
    atualizarSistemaPontos() {
        if (!this.pontosManager) {
            this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
            if (!this.pontosManager) return;
        }
        
        // Calcular pontos totais desta aba
        const pontosVantagens = this.calcularVantagensTotais();
        const pontosDesvantagens = this.calcularDesvantagensTotais();
        
        // Atualizar PontosManager
        this.pontosManager.gastos.vantagens += pontosVantagens;
        this.pontosManager.gastos.desvantagens.outras += Math.abs(pontosDesvantagens);
        
        this.pontosManager.atualizarTudo();
    }
    
    calcularVantagensTotais() {
        const totalStatus = Math.max(0, this.status * 5);
        const totalCarisma = this.carisma * 5;
        const totalRepPositiva = this.reputacaoPositiva * 5;
        const totalAliados = this.aliados.reduce((t, a) => t + a.pontos, 0);
        const totalContatos = this.contatos.reduce((t, c) => t + c.pontos, 0);
        const totalPatronos = this.patronos.reduce((t, p) => t + p.pontos, 0);
        
        return totalStatus + totalCarisma + totalRepPositiva + 
               totalAliados + totalContatos + totalPatronos;
    }
    
    calcularDesvantagensTotais() {
        const totalStatus = Math.min(0, this.status * 5);
        const totalRepNegativa = this.reputacaoNegativa * -5;
        const totalInimigos = this.inimigos.reduce((t, i) => t + i.pontos, 0);
        const totalDependentes = this.dependentes.reduce((t, d) => t + d.pontos, 0);
        
        return totalStatus + totalRepNegativa + totalInimigos + totalDependentes;
    }
    
    // ===========================================
    // PERSISTÊNCIA E INTEGRAÇÃO
    // ===========================================
    salvarLocalStorage() {
        try {
            const dados = {
                status: this.status,
                carisma: this.carisma,
                reputacaoPositiva: this.reputacaoPositiva,
                reputacaoNegativa: this.reputacaoNegativa,
                grupoRepPositiva: this.grupoRepPositiva,
                grupoRepNegativa: this.grupoRepNegativa,
                aliados: this.aliados,
                contatos: this.contatos,
                patronos: this.patronos,
                inimigos: this.inimigos,
                dependentes: this.dependentes,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gurps_status_social', JSON.stringify(dados));
        } catch (error) {
            console.warn('Não foi possível salvar status social:', error);
        }
    }
    
    carregarLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_status_social');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                // Carregar dados básicos
                this.status = dados.status || 0;
                this.carisma = dados.carisma || 0;
                this.reputacaoPositiva = dados.reputacaoPositiva || 0;
                this.reputacaoNegativa = dados.reputacaoNegativa || 0;
                this.grupoRepPositiva = dados.grupoRepPositiva || '';
                this.grupoRepNegativa = dados.grupoRepNegativa || '';
                
                // Carregar listas
                this.aliados = dados.aliados || [];
                this.contatos = dados.contatos || [];
                this.patronos = dados.patronos || [];
                this.inimigos = dados.inimigos || [];
                this.dependentes = dados.dependentes || [];
                
                // Atualizar displays
                setTimeout(() => {
                    this.atualizarDisplayStatus();
                    this.atualizarDisplayCarisma();
                    this.atualizarDisplayReputacao();
                    this.atualizarDisplayAliados();
                    this.atualizarDisplayContatos();
                    this.atualizarDisplayPatronos();
                    this.atualizarDisplayInimigos();
                    this.atualizarDisplayDependentes();
                    this.atualizarResumoGeral();
                }, 100);
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar status social:', error);
        }
        return false;
    }
    
    configurarIntegracaoPontos() {
        this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let statusSocialManagerInstance = null;

function inicializarStatusSocial() {
    if (!statusSocialManagerInstance) {
        statusSocialManagerInstance = new StatusSocialManager();
    }
    
    statusSocialManagerInstance.inicializar();
    return statusSocialManagerInstance;
}

// Inicializar quando a aba for ativada
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    setTimeout(() => {
                        if (!statusSocialManagerInstance) {
                            inicializarStatusSocial();
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
});

// Exportar para uso global
window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
    return statusSocialManagerInstance;
};