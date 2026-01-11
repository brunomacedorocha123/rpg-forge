// ===========================================
// STATUS-SOCIAL.JS - VERSÃO DEFINITIVA SEM VAZAMENTOS
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
        
        // Cache de elementos para evitar queries repetidas
        this.elementosCache = {};
        
        // Controlador de listeners para evitar duplicação
        this.listenersAtivos = new Map();
    }
    
    // ===========================================
    // INICIALIZAÇÃO COM CONTROLE DE ESCOPO
    // ===========================================
    
    inicializar() {
        if (this.inicializado) {
            console.warn('StatusSocialManager já inicializado');
            return;
        }
        
        console.log('Inicializando StatusSocialManager...');
        
        // Verifica se a aba de vantagens está ativa
        const vantagensTab = document.getElementById('vantagens');
        if (!vantagensTab || !vantagensTab.classList.contains('active')) {
            console.log('Aba vantagens não está ativa, aguardando...');
            // Agenda nova tentativa
            setTimeout(() => this.inicializar(), 100);
            return;
        }
        
        // Limpa listeners antigos se existirem
        this.limparTodosListeners();
        
        // Carrega dados
        this.carregarLocalStorage();
        
        // Configura sistemas com escopo correto
        this.configurarSistemasBasicos(vantagensTab);
        this.configurarSistemasLista(vantagensTab);
        this.configurarModais();
        
        // Atualiza displays
        this.atualizarTodosDisplays();
        this.atualizarSistemaPontos();
        
        this.inicializado = true;
        console.log('StatusSocialManager inicializado com sucesso');
    }
    
    configurarSistemasBasicos(vantagensTab) {
        // Configura apenas na subaba status se estiver ativa
        const subtabStatus = vantagensTab.querySelector('#subtab-status');
        if (subtabStatus && subtabStatus.classList.contains('active')) {
            this.configurarStatusSocial(subtabStatus);
            this.configurarCarisma(subtabStatus);
            this.configurarReputacao(subtabStatus);
        }
    }
    
    configurarSistemasLista(vantagensTab) {
        // Configura listeners delegados uma única vez
        this.configurarListenersDelegados(vantagensTab);
        
        // Configura sistemas individuais apenas se necessário
        const subtabStatus = vantagensTab.querySelector('#subtab-status');
        if (subtabStatus && subtabStatus.classList.contains('active')) {
            this.atualizarDisplayAliados();
            this.atualizarDisplayContatos();
            this.atualizarDisplayPatronos();
            this.atualizarDisplayInimigos();
            this.atualizarDisplayDependentes();
        }
    }
    
    // ===========================================
    // SISTEMA DE LISTENERS DELEGADOS (EVITA DUPLICAÇÃO)
    // ===========================================
    
    configurarListenersDelegados(container) {
        // Remove listeners antigos
        this.removerListener('click', container);
        
        // Adiciona listener delegado único
        const handler = (e) => this.tratarClickDelegado(e);
        container.addEventListener('click', handler);
        this.registrarListener('click', container, handler);
        
        // Listener para sub-tabs
        this.configurarSubTabs(container);
    }
    
    tratarClickDelegado(e) {
        // Botões de controle (status, carisma, reputação)
        const btnControle = e.target.closest('.btn-controle');
        if (btnControle) {
            const tipo = btnControle.dataset.controle;
            const isMinus = btnControle.classList.contains('minus');
            this.tratarControleClick(tipo, isMinus ? -1 : 1);
            e.preventDefault();
            return;
        }
        
        // Botões de adicionar
        const btnAdd = e.target.closest('.btn-add[data-action="modal"]');
        if (btnAdd) {
            const tipo = btnAdd.dataset.tipo;
            this.abrirModal(tipo);
            e.preventDefault();
            return;
        }
        
        // Botões de remover
        const btnRemove = e.target.closest('.btn-remove-item');
        if (btnRemove) {
            const id = parseInt(btnRemove.dataset.id);
            const tipo = btnRemove.dataset.tipo;
            this.removerItem(id, tipo);
            e.preventDefault();
            return;
        }
        
        // Botões limpar
        const btnLimpar = e.target.closest('.btn-limpar');
        if (btnLimpar) {
            const tipo = btnLimpar.dataset.tipo;
            this.limparLista(tipo);
            e.preventDefault();
            return;
        }
    }
    
    tratarControleClick(tipo, delta) {
        switch(tipo) {
            case 'status':
                this.ajustarStatus(delta);
                break;
            case 'carisma':
                this.ajustarCarisma(delta);
                break;
            case 'rep-positiva':
                this.ajustarReputacao('positiva', delta);
                break;
            case 'rep-negativa':
                this.ajustarReputacao('negativa', delta);
                break;
        }
    }
    
    configurarSubTabs(container) {
        const subTabs = container.querySelectorAll('.sub-tab');
        subTabs.forEach(tab => {
            this.removerListener('click', tab);
            
            const handler = (e) => {
                e.preventDefault();
                const subTabId = tab.dataset.subtab;
                
                // Remove active de todas as sub-tabs
                subTabs.forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
                
                // Adiciona active na sub-tab clicada
                tab.classList.add('active');
                const content = container.querySelector(`#subtab-${subTabId}`);
                if (content) {
                    content.classList.add('active');
                }
                
                // Re-inicializa sistemas se necessário
                if (subTabId === 'status') {
                    this.configurarSistemasBasicos(container.closest('#vantagens'));
                }
            };
            
            tab.addEventListener('click', handler);
            this.registrarListener('click', tab, handler);
        });
    }
    
    // ===========================================
    // 1. STATUS SOCIAL (REESCRITO COM CACHE)
    // ===========================================
    
    configurarStatusSocial(subtab) {
        const valorDisplay = subtab.querySelector('#valorStatus');
        const pontosDisplay = subtab.querySelector('#pontosStatus');
        
        if (valorDisplay) this.elementosCache.valorStatus = valorDisplay;
        if (pontosDisplay) this.elementosCache.pontosStatus = pontosDisplay;
        
        this.atualizarDisplayStatus();
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
        if (this.elementosCache.valorStatus) {
            this.elementosCache.valorStatus.textContent = this.status;
        }
        
        if (this.elementosCache.pontosStatus) {
            const pontos = this.status * 5;
            const texto = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
            this.elementosCache.pontosStatus.textContent = texto;
            this.elementosCache.pontosStatus.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    // ===========================================
    // 2. CARISMA (REESCRITO COM CACHE)
    // ===========================================
    
    configurarCarisma(subtab) {
        const valorDisplay = subtab.querySelector('#valorCarisma');
        const pontosDisplay = subtab.querySelector('#pontosCarisma');
        
        if (valorDisplay) this.elementosCache.valorCarisma = valorDisplay;
        if (pontosDisplay) this.elementosCache.pontosCarisma = pontosDisplay;
        
        this.atualizarDisplayCarisma();
    }
    
    ajustarCarisma(delta) {
        const novoValor = this.carisma + delta;
        if (novoValor < 0 || novoValor > 3) return;
        
        this.carisma = novoValor;
        this.atualizarDisplayCarisma();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayCarisma() {
        if (this.elementosCache.valorCarisma) {
            this.elementosCache.valorCarisma.textContent = this.carisma;
        }
        
        if (this.elementosCache.pontosCarisma) {
            const pontos = this.carisma * 5;
            this.elementosCache.pontosCarisma.textContent = `+${pontos} pts`;
            this.elementosCache.pontosCarisma.className = 'pontos-badge positivo';
        }
    }
    
    // ===========================================
    // 3. REPUTAÇÃO (REESCRITO COM CACHE)
    // ===========================================
    
    configurarReputacao(subtab) {
        // Cache de elementos
        this.elementosCache.valorRepPositiva = subtab.querySelector('#valorRepPositiva');
        this.elementosCache.valorRepNegativa = subtab.querySelector('#valorRepNegativa');
        this.elementosCache.pontosRepPositiva = subtab.querySelector('#pontosRepPositiva');
        this.elementosCache.pontosRepNegativa = subtab.querySelector('#pontosRepNegativa');
        this.elementosCache.pontosReputacao = subtab.querySelector('#pontosReputacao');
        
        // Inputs de grupo
        const grupoPosInput = subtab.querySelector('#grupoPositivo');
        const grupoNegInput = subtab.querySelector('#grupoNegativo');
        
        if (grupoPosInput) {
            grupoPosInput.value = this.grupoRepPositiva;
            this.registrarListener('change', grupoPosInput, (e) => {
                this.grupoRepPositiva = e.target.value;
                this.salvarLocalStorage();
            });
        }
        
        if (grupoNegInput) {
            grupoNegInput.value = this.grupoRepNegativa;
            this.registrarListener('change', grupoNegInput, (e) => {
                this.grupoRepNegativa = e.target.value;
                this.salvarLocalStorage();
            });
        }
        
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
        if (this.elementosCache.valorRepPositiva) {
            this.elementosCache.valorRepPositiva.textContent = this.reputacaoPositiva;
        }
        if (this.elementosCache.valorRepNegativa) {
            this.elementosCache.valorRepNegativa.textContent = this.reputacaoNegativa;
        }
        
        const pontosPositivos = this.reputacaoPositiva * 5;
        const pontosNegativos = this.reputacaoNegativa * -5;
        const totalReputacao = pontosPositivos + pontosNegativos;
        
        if (this.elementosCache.pontosRepPositiva) {
            this.elementosCache.pontosRepPositiva.textContent = pontosPositivos > 0 ? `+${pontosPositivos} pts` : '0 pts';
            this.elementosCache.pontosRepPositiva.className = this.reputacaoPositiva > 0 ? 'pontos-item positiva' : 'pontos-item';
        }
        
        if (this.elementosCache.pontosRepNegativa) {
            this.elementosCache.pontosRepNegativa.textContent = pontosNegativos < 0 ? `${pontosNegativos} pts` : '0 pts';
            this.elementosCache.pontosRepNegativa.className = this.reputacaoNegativa > 0 ? 'pontos-item negativa' : 'pontos-item';
        }
        
        if (this.elementosCache.pontosReputacao) {
            const texto = totalReputacao >= 0 ? `+${totalReputacao} pts` : `${totalReputacao} pts`;
            this.elementosCache.pontosReputacao.textContent = texto;
            this.elementosCache.pontosReputacao.className = 'pontos-badge ' + (totalReputacao >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    // ===========================================
    // 4. SISTEMAS DE LISTA (ALIADOS, CONTATOS, ETC)
    // ===========================================
    
    criarItemLista(item, tipo) {
        const isPositivo = ['aliado', 'contato', 'patrono'].includes(tipo);
        const classePontos = isPositivo ? 'pontos-positivo' : 'pontos-negativo';
        const sinalPontos = isPositivo ? '+' : '';
        
        return `
            <div class="item-lista ${isPositivo ? 'vantagem' : 'desvantagem'}">
                <div class="item-info">
                    <strong>${item.nome}</strong>
                    ${item.descricao ? `<small>${item.descricao}</small>` : ''}
                    <div class="item-detalhes">
                        <small>${this.obterDetalhesItem(item, tipo)}</small>
                    </div>
                </div>
                <div class="item-pontos">
                    <span class="${classePontos}">${sinalPontos}${item.pontos} pts</span>
                    <button class="btn-remove-item" data-id="${item.id}" data-tipo="${tipo}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    obterDetalhesItem(item, tipo) {
        switch(tipo) {
            case 'aliado':
                return `${item.poder}% | ${this.obterTextoFrequencia(item.frequencia)}`;
            case 'contato':
                return `NH ${item.nhEfetivo} | ${this.obterTextoFrequencia(item.frequencia)}`;
            case 'patrono':
                return `${item.poder} pts | ${this.obterTextoFrequencia(item.frequencia)}`;
            case 'inimigo':
                return `${this.obterTextoIntencao(item.intencao)} | ${this.obterTextoFrequencia(item.frequencia)}`;
            case 'dependente':
                return `${item.capacidade}% capacidade | ${this.obterTextoImportancia(item.importancia)}`;
            default:
                return '';
        }
    }
    
    // ===========================================
    // DISPLAYS DAS LISTAS (OTIMIZADOS)
    // ===========================================
    
    atualizarDisplayLista(containerId, badgeId, lista, tipo) {
        const container = document.getElementById(containerId);
        const badge = document.getElementById(badgeId);
        
        if (!container || !badge) return;
        
        const totalPontos = lista.reduce((total, item) => total + item.pontos, 0);
        const isPositivo = totalPontos >= 0;
        
        // Atualiza badge
        badge.textContent = `${isPositivo ? '+' : ''}${totalPontos} pts`;
        badge.className = `pontos-badge ${isPositivo ? 'positivo' : 'negativo'}`;
        
        // Atualiza lista
        if (lista.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum item adicionado</div>';
        } else {
            container.innerHTML = lista.map(item => this.criarItemLista(item, tipo)).join('');
        }
    }
    
    atualizarDisplayAliados() {
        this.atualizarDisplayLista('listaAliados', 'pontosAliados', this.aliados, 'aliado');
    }
    
    atualizarDisplayContatos() {
        this.atualizarDisplayLista('listaContatos', 'pontosContatos', this.contatos, 'contato');
    }
    
    atualizarDisplayPatronos() {
        this.atualizarDisplayLista('listaPatronos', 'pontosPatronos', this.patronos, 'patrono');
    }
    
    atualizarDisplayInimigos() {
        this.atualizarDisplayLista('listaInimigos', 'pontosInimigos', this.inimigos, 'inimigo');
    }
    
    atualizarDisplayDependentes() {
        this.atualizarDisplayLista('listaDependentes', 'pontosDependentes', this.dependentes, 'dependente');
    }
    
    // ===========================================
    // FUNÇÕES AUXILIARES (MANTIDAS)
    // ===========================================
    
    obterTextoFrequencia(valor) {
        const frequencias = {
            6: 'Esporadicamente',
            9: 'Com frequência',
            12: 'Bastante frequência',
            15: 'Quase o tempo todo',
            18: 'Constantemente'
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
            case 'amigo': return 'Amigo';
            case 'ser_amado': return 'Ser Amado';
            default: return importancia;
        }
    }
    
    // ===========================================
    // CONTROLE DE MODAIS (SIMPLIFICADO)
    // ===========================================
    
    abrirModal(tipo) {
        const modalId = `modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    fecharModal(tipo) {
        const modalId = `modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    configurarModais() {
        // Fechar modais com evento delegado
        document.addEventListener('click', (e) => {
            // Fechar com X
            if (e.target.closest('.modal-close[data-modal]')) {
                const modalId = e.target.closest('.modal-close').dataset.modal;
                this.fecharModal(modalId);
            }
            // Fechar com botão cancelar
            if (e.target.closest('.btn-secondary[data-modal]')) {
                const modalId = e.target.closest('.btn-secondary').dataset.modal;
                this.fecharModal(modalId);
            }
            // Fechar clicando fora
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
    
    // ===========================================
    // GESTÃO DE ITENS (ADICIONAR/REMOVER)
    // ===========================================
    
    adicionarItem(tipo, dados) {
        const item = {
            id: this.nextId++,
            ...dados,
            dataAdicao: new Date().toISOString()
        };
        
        switch(tipo) {
            case 'aliado':
                this.aliados.push(item);
                this.atualizarDisplayAliados();
                break;
            case 'contato':
                this.contatos.push(item);
                this.atualizarDisplayContatos();
                break;
            case 'patrono':
                this.patronos.push(item);
                this.atualizarDisplayPatronos();
                break;
            case 'inimigo':
                this.inimigos.push(item);
                this.atualizarDisplayInimigos();
                break;
            case 'dependente':
                this.dependentes.push(item);
                this.atualizarDisplayDependentes();
                break;
        }
        
        this.fecharModal(tipo);
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    removerItem(id, tipo) {
        if (!confirm('Tem certeza que deseja remover este item?')) return;
        
        let lista;
        let updateFunction;
        
        switch(tipo) {
            case 'aliado':
                lista = this.aliados;
                updateFunction = () => this.atualizarDisplayAliados();
                break;
            case 'contato':
                lista = this.contatos;
                updateFunction = () => this.atualizarDisplayContatos();
                break;
            case 'patrono':
                lista = this.patronos;
                updateFunction = () => this.atualizarDisplayPatronos();
                break;
            case 'inimigo':
                lista = this.inimigos;
                updateFunction = () => this.atualizarDisplayInimigos();
                break;
            case 'dependente':
                lista = this.dependentes;
                updateFunction = () => this.atualizarDisplayDependentes();
                break;
            default:
                return;
        }
        
        const index = lista.findIndex(item => item.id === id);
        if (index !== -1) {
            lista.splice(index, 1);
            updateFunction();
            this.atualizarSistemaPontos();
            this.salvarLocalStorage();
        }
    }
    
    limparLista(tipo) {
        if (!confirm(`Tem certeza que deseja limpar todos os ${tipo}?`)) return;
        
        switch(tipo) {
            case 'vantagens':
                // Implementar limpeza de vantagens do catálogo
                break;
            case 'desvantagens':
                // Implementar limpeza de desvantagens do catálogo
                break;
        }
    }
    
    // ===========================================
    // ATUALIZAÇÃO DE DISPLAYS
    // ===========================================
    
    atualizarTodosDisplays() {
        this.atualizarDisplayStatus();
        this.atualizarDisplayCarisma();
        this.atualizarDisplayReputacao();
        this.atualizarDisplayAliados();
        this.atualizarDisplayContatos();
        this.atualizarDisplayPatronos();
        this.atualizarDisplayInimigos();
        this.atualizarDisplayDependentes();
    }
    
    // ===========================================
    // INTEGRAÇÃO COM SISTEMA DE PONTOS
    // ===========================================
    
    atualizarSistemaPontos() {
        // Implementação simplificada
        const totalVantagens = this.calcularVantagensTotais();
        const totalDesvantagens = Math.abs(this.calcularDesvantagensTotais());
        
        // Atualiza resumo na aba de Vantagens
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = totalVantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = totalDesvantagens;
        if (saldoElem) saldoElem.textContent = totalVantagens - totalDesvantagens;
        
        // Chama o sistema de pontos se existir
        if (window.obterPontosManager) {
            const pontosManager = window.obterPontosManager();
            if (pontosManager) {
                pontosManager.gastos.vantagens = totalVantagens;
                pontosManager.gastos.desvantagens.outras = totalDesvantagens;
                pontosManager.atualizarTudo();
            }
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
    // GESTÃO DE LISTENERS (EVITA DUPLICAÇÃO)
    // ===========================================
    
    registrarListener(tipo, elemento, handler) {
        const key = `${tipo}-${elemento.id || elemento.className}`;
        this.listenersAtivos.set(key, { elemento, handler });
    }
    
    removerListener(tipo, elemento) {
        const key = `${tipo}-${elemento.id || elemento.className}`;
        const listener = this.listenersAtivos.get(key);
        if (listener) {
            listener.elemento.removeEventListener(tipo, listener.handler);
            this.listenersAtivos.delete(key);
        }
    }
    
    limparTodosListeners() {
        this.listenersAtivos.forEach((listener, key) => {
            listener.elemento.removeEventListener('click', listener.handler);
        });
        this.listenersAtivos.clear();
        this.elementosCache = {};
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
}

// ===========================================
// INICIALIZAÇÃO CONTROLADA
// ===========================================

let statusSocialManagerInstance = null;

function inicializarStatusSocial() {
    if (statusSocialManagerInstance) {
        return statusSocialManagerInstance;
    }
    
    statusSocialManagerInstance = new StatusSocialManager();
    
    // Aguarda a aba estar pronta
    const checkInterval = setInterval(() => {
        const vantagensTab = document.getElementById('vantagens');
        if (vantagensTab) {
            clearInterval(checkInterval);
            
            // Inicializa apenas quando a aba for ativada
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class' && vantagensTab.classList.contains('active')) {
                        statusSocialManagerInstance.inicializar();
                    }
                });
            });
            
            observer.observe(vantagensTab, { attributes: true });
            
            // Inicializa imediatamente se já estiver ativa
            if (vantagensTab.classList.contains('active')) {
                statusSocialManagerInstance.inicializar();
            }
        }
    }, 100);
    
    return statusSocialManagerInstance;
}

// Inicializa quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarStatusSocial);
} else {
    inicializarStatusSocial();
}

// Exportar para uso global
window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
    return statusSocialManagerInstance;
};