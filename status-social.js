// ===========================================
// STATUS-SOCIAL.JS - VERSÃO CORRIGIDA
// ===========================================

class StatusSocialManager {
    constructor() {
        this.status = 0;
        this.carisma = 0;
        this.reputacaoPositiva = 0;
        this.reputacaoNegativa = 0;
        this.grupoRepPositiva = '';
        this.grupoRepNegativa = '';
        
        this.aliados = [];
        this.contatos = [];
        this.patronos = [];
        this.inimigos = [];
        this.dependentes = [];
        
        this.nextId = 1;
        this.inicializado = false;
        this.pontosManager = null;
    }
    
    // ===========================================
    // MÉTODOS DE VERIFICAÇÃO DE ESCOPO
    // ===========================================
    
    // Verifica se está na aba correta
    estaNaAbaCorreta() {
        const abaVantagens = document.getElementById('vantagens');
        if (!abaVantagens) return false;
        
        // Verifica se a aba vantagens está ativa
        if (!abaVantagens.classList.contains('active')) return false;
        
        // Verifica se a sub-aba status está ativa
        const subAbaStatus = document.getElementById('subtab-status');
        if (!subAbaStatus || !subAbaStatus.classList.contains('active')) return false;
        
        return true;
    }
    
    // Obtém elemento apenas se estiver na aba correta
    obterElementoEscopado(seletor) {
        if (!this.estaNaAbaCorreta()) return null;
        
        // Procura apenas dentro da sub-aba status
        const subAbaStatus = document.getElementById('subtab-status');
        if (!subAbaStatus) return null;
        
        return subAbaStatus.querySelector(seletor);
    }
    
    // ===========================================
    // 1. STATUS SOCIAL
    // ===========================================
    configurarStatusSocial() {
        if (!this.estaNaAbaCorreta()) return;
        
        const statusCard = this.obterElementoEscopado('.status-card');
        if (!statusCard) return;
        
        const minusBtn = statusCard.querySelector('.btn-controle.minus');
        const plusBtn = statusCard.querySelector('.btn-controle.plus');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarStatus(-1));
            plusBtn.addEventListener('click', () => this.ajustarStatus(1));
        }
        
        this.atualizarDisplayStatus();
    }
    
    ajustarStatus(delta) {
        if (!this.estaNaAbaCorreta()) return;
        
        const novoValor = this.status + delta;
        if (novoValor < -20 || novoValor > 25) return;
        
        this.status = novoValor;
        
        this.atualizarDisplayStatus();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayStatus() {
        const valorDisplay = this.obterElementoEscopado('#valorStatus');
        const pontosDisplay = this.obterElementoEscopado('#pontosStatus');
        
        if (valorDisplay) valorDisplay.textContent = this.status;
        
        if (pontosDisplay) {
            const pontos = this.status * 5;
            const texto = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
            pontosDisplay.textContent = texto;
            pontosDisplay.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    // ===========================================
    // 2. CARISMA
    // ===========================================
    configurarCarisma() {
        if (!this.estaNaAbaCorreta()) return;
        
        const statusCards = this.obterElementoEscopado('.status-card');
        if (!statusCards) return;
        
        // O segundo card é Carisma
        const cards = document.querySelectorAll('#subtab-status .status-card');
        if (cards.length < 2) return;
        
        const carismaCard = cards[1];
        const minusBtn = carismaCard.querySelector('.btn-controle.minus');
        const plusBtn = carismaCard.querySelector('.btn-controle.plus');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarCarisma(-1));
            plusBtn.addEventListener('click', () => this.ajustarCarisma(1));
        }
        
        this.atualizarDisplayCarisma();
    }
    
    ajustarCarisma(delta) {
        if (!this.estaNaAbaCorreta()) return;
        
        const novoValor = this.carisma + delta;
        if (novoValor < 0 || novoValor > 3) return;
        
        this.carisma = novoValor;
        
        this.atualizarDisplayCarisma();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayCarisma() {
        const valorDisplay = this.obterElementoEscopado('#valorCarisma');
        const pontosDisplay = this.obterElementoEscopado('#pontosCarisma');
        
        if (valorDisplay) valorDisplay.textContent = this.carisma;
        
        if (pontosDisplay) {
            const pontos = this.carisma * 5;
            pontosDisplay.textContent = `+${pontos} pts`;
            pontosDisplay.className = 'pontos-badge positivo';
        }
    }
    
    // ===========================================
    // 3. REPUTAÇÃO
    // ===========================================
    configurarReputacao() {
        if (!this.estaNaAbaCorreta()) return;
        
        // Configurar botões de reputação positiva
        this.obterElementoEscopado('.btn-controle[data-tipo="positiva"]')?.addEventListener('click', (e) => {
            const delta = e.target.classList.contains('minus') ? -1 : 1;
            this.ajustarReputacao('positiva', delta);
        });
        
        // Configurar botões de reputação negativa
        this.obterElementoEscopado('.btn-controle[data-tipo="negativa"]')?.addEventListener('click', (e) => {
            const delta = e.target.classList.contains('minus') ? -1 : 1;
            this.ajustarReputacao('negativa', delta);
        });
        
        // Configurar grupos alvo
        const grupoPosInput = this.obterElementoEscopado('#grupoPositivo');
        const grupoNegInput = this.obterElementoEscopado('#grupoNegativo');
        
        if (grupoPosInput) {
            grupoPosInput.value = this.grupoRepPositiva;
            grupoPosInput.addEventListener('change', (e) => {
                this.grupoRepPositiva = e.target.value;
                this.salvarLocalStorage();
            });
        }
        
        if (grupoNegInput) {
            grupoNegInput.value = this.grupoRepNegativa;
            grupoNegInput.addEventListener('change', (e) => {
                this.grupoRepNegativa = e.target.value;
                this.salvarLocalStorage();
            });
        }
        
        this.atualizarDisplayReputacao();
    }
    
    ajustarReputacao(tipo, delta) {
        if (!this.estaNaAbaCorreta()) return;
        
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
        const valorPos = this.obterElementoEscopado('#valorRepPositiva');
        const valorNeg = this.obterElementoEscopado('#valorRepNegativa');
        const pontosPos = this.obterElementoEscopado('#pontosRepPositiva');
        const pontosNeg = this.obterElementoEscopado('#pontosRepNegativa');
        const badgeRep = this.obterElementoEscopado('#pontosReputacao');
        
        if (valorPos) valorPos.textContent = this.reputacaoPositiva;
        if (valorNeg) valorNeg.textContent = this.reputacaoNegativa;
        
        const pontosPositivos = this.reputacaoPositiva * 5;
        const pontosNegativos = this.reputacaoNegativa * -5;
        const totalReputacao = pontosPositivos + pontosNegativos;
        
        if (pontosPos) {
            pontosPos.textContent = pontosPositivos > 0 ? `+${pontosPositivos} pts` : '0 pts';
            pontosPos.className = this.reputacaoPositiva > 0 ? 'pontos-item positiva' : 'pontos-item';
        }
        
        if (pontosNeg) {
            pontosNeg.textContent = pontosNegativos < 0 ? `${pontosNegativos} pts` : '0 pts';
            pontosNeg.className = this.reputacaoNegativa > 0 ? 'pontos-item negativa' : 'pontos-item';
        }
        
        if (badgeRep) {
            const texto = totalReputacao >= 0 ? `+${totalReputacao} pts` : `${totalReputacao} pts`;
            badgeRep.textContent = texto;
            badgeRep.className = 'pontos-badge ' + (totalReputacao >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    // ===========================================
    // SISTEMAS DE LISTA (ALIADOS, CONTATOS, etc)
    // ===========================================
    
    configurarSistemaAliados() {
        if (!this.estaNaAbaCorreta()) return;
        
        const btnAdicionar = this.obterElementoEscopado('.btn-add[onclick*="aliado"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('aliado'));
        }
        
        this.atualizarDisplayAliados();
    }
    
    configurarSistemaContatos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const btnAdicionar = this.obterElementoEscopado('.btn-add[onclick*="contato"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('contato'));
        }
        
        this.atualizarDisplayContatos();
    }
    
    configurarSistemaPatronos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const btnAdicionar = this.obterElementoEscopado('.btn-add[onclick*="patrono"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('patrono'));
        }
        
        this.atualizarDisplayPatronos();
    }
    
    configurarSistemaInimigos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const btnAdicionar = this.obterElementoEscopado('.btn-add[onclick*="inimigo"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('inimigo'));
        }
        
        this.atualizarDisplayInimigos();
    }
    
    configurarSistemaDependentes() {
        if (!this.estaNaAbaCorreta()) return;
        
        const btnAdicionar = this.obterElementoEscopado('.btn-add[onclick*="dependente"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('dependente'));
        }
        
        this.atualizarDisplayDependentes();
    }
    
    // ===========================================
    // DISPLAYS DAS LISTAS
    // ===========================================
    
    atualizarDisplayAliados() {
        if (!this.estaNaAbaCorreta()) return;
        
        const container = this.obterElementoEscopado('#listaAliados');
        const badge = this.obterElementoEscopado('#pontosAliados');
        
        if (!container || !badge) return;
        
        const totalPontos = this.aliados.reduce((total, aliado) => total + aliado.pontos, 0);
        
        badge.textContent = `+${totalPontos} pts`;
        badge.className = 'pontos-badge positivo';
        
        if (this.aliados.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum aliado adicionado</div>';
        } else {
            container.innerHTML = this.aliados.map(aliado => `
                <div class="item-lista vantagem">
                    <div class="item-info">
                        <strong>${aliado.nome}</strong>
                        <small>${aliado.descricao || ''}</small>
                        <div class="item-detalhes">
                            <small>${aliado.poder}% | ${this.obterTextoFrequencia(aliado.frequencia)}</small>
                        </div>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-positivo">+${aliado.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${aliado.id}" data-tipo="aliado">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    atualizarDisplayContatos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const container = this.obterElementoEscopado('#listaContatos');
        const badge = this.obterElementoEscopado('#pontosContatos');
        
        if (!container || !badge) return;
        
        const totalPontos = this.contatos.reduce((total, contato) => total + contato.pontos, 0);
        
        badge.textContent = `+${totalPontos} pts`;
        badge.className = 'pontos-badge positivo';
        
        if (this.contatos.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum contato adicionado</div>';
        } else {
            container.innerHTML = this.contatos.map(contato => `
                <div class="item-lista vantagem">
                    <div class="item-info">
                        <strong>${contato.nome}</strong>
                        <small>${contato.pericia || 'Sem perícia especificada'}</small>
                        <div class="item-detalhes">
                            <small>NH ${contato.nhEfetivo} | ${this.obterTextoFrequencia(contato.frequencia)}</small>
                        </div>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-positivo">+${contato.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${contato.id}" data-tipo="contato">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    atualizarDisplayPatronos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const container = this.obterElementoEscopado('#listaPatronos');
        const badge = this.obterElementoEscopado('#pontosPatronos');
        
        if (!container || !badge) return;
        
        const totalPontos = this.patronos.reduce((total, patrono) => total + patrono.pontos, 0);
        
        badge.textContent = `+${totalPontos} pts`;
        badge.className = 'pontos-badge positivo';
        
        if (this.patronos.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum patrono adicionado</div>';
        } else {
            container.innerHTML = this.patronos.map(patrono => `
                <div class="item-lista vantagem">
                    <div class="item-info">
                        <strong>${patrono.nome}</strong>
                        <small>${patrono.descricao || ''}</small>
                        <div class="item-detalhes">
                            <small>${patrono.poder} pts | ${this.obterTextoFrequencia(patrono.frequencia)}</small>
                        </div>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-positivo">+${patrono.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${patrono.id}" data-tipo="patrono">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    atualizarDisplayInimigos() {
        if (!this.estaNaAbaCorreta()) return;
        
        const container = this.obterElementoEscopado('#listaInimigos');
        const badge = this.obterElementoEscopado('#pontosInimigos');
        
        if (!container || !badge) return;
        
        const totalPontos = this.inimigos.reduce((total, inimigo) => total + inimigo.pontos, 0);
        
        badge.textContent = `${totalPontos} pts`;
        badge.className = 'pontos-badge negativo';
        
        if (this.inimigos.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum inimigo adicionado</div>';
        } else {
            container.innerHTML = this.inimigos.map(inimigo => `
                <div class="item-lista desvantagem">
                    <div class="item-info">
                        <strong>${inimigo.nome}</strong>
                        <small>${inimigo.motivo || ''}</small>
                        <div class="item-detalhes">
                            <small>${this.obterTextoIntencao(inimigo.intencao)} | ${this.obterTextoFrequencia(inimigo.frequencia)}</small>
                        </div>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-negativo">${inimigo.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${inimigo.id}" data-tipo="inimigo">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    atualizarDisplayDependentes() {
        if (!this.estaNaAbaCorreta()) return;
        
        const container = this.obterElementoEscopado('#listaDependentes');
        const badge = this.obterElementoEscopado('#pontosDependentes');
        
        if (!container || !badge) return;
        
        const totalPontos = this.dependentes.reduce((total, dependente) => total + dependente.pontos, 0);
        
        badge.textContent = `${totalPontos} pts`;
        badge.className = totalPontos < 0 ? 'pontos-badge negativo' : 'pontos-badge positivo';
        
        if (this.dependentes.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum dependente adicionado</div>';
        } else {
            container.innerHTML = this.dependentes.map(dependente => `
                <div class="item-lista desvantagem" data-id="${dependente.id}">
                    <div class="item-info">
                        <div class="item-header">
                            <strong class="item-nome">${dependente.nome}</strong>
                            <span class="item-pontos-detalhe pontos-negativo">${dependente.pontos} pts</span>
                        </div>
                        ${dependente.relacao ? `<small class="item-relacao">${dependente.relacao}</small>` : ''}
                        <div class="item-detalhes">
                            <span class="badge capacidade">${dependente.capacidade}% capacidade</span>
                            <span class="badge importancia">${this.obterTextoImportancia(dependente.importancia)}</span>
                            <span class="badge frequencia">${this.obterTextoFrequencia(dependente.frequencia)}</span>
                        </div>
                        ${dependente.detalhes ? `<p class="item-descricao">${dependente.detalhes}</p>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit-item" data-id="${dependente.id}" data-tipo="dependente" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-remove-item" data-id="${dependente.id}" data-tipo="dependente" title="Remover">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // ===========================================
    // FUNÇÕES AUXILIARES
    // ===========================================
    
    obterMultiplicadorFrequencia(valorFrequencia) {
        switch(valorFrequencia) {
            case 6: return 0.5;
            case 9: return 1;
            case 12: return 2;
            case 15: return 3;
            case 18: return 4;
            default: return 1;
        }
    }
    
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
    
    obterTextoIntencao(intencao) {
        switch(intencao) {
            case 'observador': return 'Observador';
            case 'rival': return 'Rival';
            case 'perseguidor': return 'Perseguidor';
            default: return intencao;
        }
    }
    
    obterTextoImportancia(importancia) {
        switch(importancia) {
            case 'empregado': return 'Empregado';
            case 'conhecido': return 'Conhecido';
            case 'amigo': return 'Amigo';
            case 'familiar': return 'Familiar';
            case 'ser_amado': return 'Ser Amado';
            case 'outro': return 'Outro';
            default: return importancia;
        }
    }
    
    // ===========================================
    // MODAIS
    // ===========================================
    
    abrirModal(tipo) {
        if (!this.estaNaAbaCorreta()) return;
        
        const modal = document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    fecharModal(tipo) {
        const modal = document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    configurarModais() {
        // Configurar fechamento de modais
        document.addEventListener('click', (e) => {
            // Fechar ao clicar no X
            if (e.target.closest('.modal-close[data-modal]')) {
                const btn = e.target.closest('.modal-close[data-modal]');
                const modalId = btn.dataset.modal;
                this.fecharModal(modalId);
            }
            
            // Fechar ao clicar em cancelar
            if (e.target.closest('.btn-secondary[data-modal]')) {
                const btn = e.target.closest('.btn-secondary[data-modal]');
                const modalId = btn.dataset.modal;
                this.fecharModal(modalId);
            }
            
            // Fechar ao clicar fora do modal
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
            
            // Remover itens
            if (e.target.closest('.btn-remove-item')) {
                const btn = e.target.closest('.btn-remove-item');
                const id = parseInt(btn.dataset.id);
                const tipo = btn.dataset.tipo;
                this.removerItem(id, tipo);
            }
        });
    }
    
    removerItem(id, tipo) {
        if (!confirm('Tem certeza que deseja remover este item?')) return;
        
        switch(tipo) {
            case 'aliado':
                this.aliados = this.aliados.filter(a => a.id !== id);
                this.atualizarDisplayAliados();
                break;
            case 'contato':
                this.contatos = this.contatos.filter(c => c.id !== id);
                this.atualizarDisplayContatos();
                break;
            case 'patrono':
                this.patronos = this.patronos.filter(p => p.id !== id);
                this.atualizarDisplayPatronos();
                break;
            case 'inimigo':
                this.inimigos = this.inimigos.filter(i => i.id !== id);
                this.atualizarDisplayInimigos();
                break;
            case 'dependente':
                this.dependentes = this.dependentes.filter(d => d.id !== id);
                this.atualizarDisplayDependentes();
                break;
        }
        
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    // ===========================================
    // ATUALIZAÇÃO DE DISPLAYS
    // ===========================================
    
    atualizarTodosDisplays() {
        if (!this.estaNaAbaCorreta()) return;
        
        this.atualizarDisplayStatus();
        this.atualizarDisplayCarisma();
        this.atualizarDisplayReputacao();
        this.atualizarDisplayAliados();
        this.atualizarDisplayContatos();
        this.atualizarDisplayPatronos();
        this.atualizarDisplayInimigos();
        this.atualizarDisplayDependentes();
        this.atualizarResumoGeral();
    }
    
    atualizarResumoGeral() {
        const totalVantagens = this.calcularVantagensTotais();
        const totalDesvantagens = this.calcularDesvantagensTotais();
        const saldo = totalVantagens + totalDesvantagens;
        
        const totalStatusGeral = this.obterElementoEscopado('#totalStatusGeral');
        if (totalStatusGeral) {
            totalStatusGeral.textContent = saldo;
        }
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
    // INTEGRAÇÃO COM SISTEMA DE PONTOS
    // ===========================================
    
    atualizarSistemaPontos() {
        this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
        if (!this.pontosManager) return;
        
        const vantagens = this.calcularVantagensTotais();
        const desvantagens = Math.abs(this.calcularDesvantagensTotais());
        
        this.pontosManager.gastos.vantagens = vantagens;
        this.pontosManager.gastos.desvantagens.outras = desvantagens;
        
        this.pontosManager.atualizarTudo();
        
        // Atualizar resumo na aba de Vantagens
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = vantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = desvantagens;
        if (saldoElem) saldoElem.textContent = vantagens - desvantagens;
    }
    
    // ===========================================
    // LOCAL STORAGE
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
                nextId: this.nextId,
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
                
                this.status = dados.status || 0;
                this.carisma = dados.carisma || 0;
                this.reputacaoPositiva = dados.reputacaoPositiva || 0;
                this.reputacaoNegativa = dados.reputacaoNegativa || 0;
                this.grupoRepPositiva = dados.grupoRepPositiva || '';
                this.grupoRepNegativa = dados.grupoRepNegativa || '';
                
                this.aliados = dados.aliados || [];
                this.contatos = dados.contatos || [];
                this.patronos = dados.patronos || [];
                this.inimigos = dados.inimigos || [];
                this.dependentes = dados.dependentes || [];
                this.nextId = dados.nextId || this.aliados.length + this.contatos.length + 
                            this.patronos.length + this.inimigos.length + this.dependentes.length + 1;
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar status social:', error);
        }
        return false;
    }
    
    // ===========================================
    // INICIALIZAÇÃO PRINCIPAL
    // ===========================================
    
    inicializar() {
        if (this.inicializado) return;
        
        // Só inicializa se estiver na aba correta
        if (!this.estaNaAbaCorreta()) return;
        
        this.configurarStatusSocial();
        this.configurarCarisma();
        this.configurarReputacao();
        
        this.configurarSistemaAliados();
        this.configurarSistemaContatos();
        this.configurarSistemaPatronos();
        this.configurarSistemaInimigos();
        this.configurarSistemaDependentes();
        
        this.configurarModais();
        
        this.carregarLocalStorage();
        this.atualizarTodosDisplays();
        this.atualizarSistemaPontos();
        
        this.inicializado = true;
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
    
    // Só inicializa se estiver na aba correta
    if (statusSocialManagerInstance.estaNaAbaCorreta()) {
        statusSocialManagerInstance.inicializar();
    }
    
    return statusSocialManagerInstance;
}

// Observar mudanças nas abas
document.addEventListener('DOMContentLoaded', function() {
    // Observar quando a aba Vantagens for ativada
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    setTimeout(() => {
                        if (!statusSocialManagerInstance) {
                            inicializarStatusSocial();
                        } else {
                            statusSocialManagerInstance.atualizarTodosDisplays();
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
    
    // Se a aba já estiver ativa no carregamento
    if (document.getElementById('vantagens')?.classList.contains('active')) {
        setTimeout(inicializarStatusSocial, 300);
    }
});

// Exportar para uso global
window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
    return statusSocialManagerInstance;
};