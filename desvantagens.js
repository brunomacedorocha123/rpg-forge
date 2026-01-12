/* ===========================================
  DESVANTAGENS MANAGER - VERSÃO COMPLETA 100%
=========================================== */

class DesvantagensManager {
    constructor() {
        this.desvantagensAdquiridas = JSON.parse(localStorage.getItem('desvantagensAdquiridas')) || [];
        this.catalogo = window.catalogoDesvantagens || [];
        this.filtroAtual = 'todas';
        this.buscaAtual = '';
        this.desvantagemEditando = null;
        this.buscaTimeout = null;
        this.desvantagemAtualModal = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.atualizarResumo();
    }
    
    carregarCatalogo() {
        const container = document.getElementById('listaCatalogoDesvantagens');
        if (!container) return;
        
        let desvantagensFiltradas = this.catalogo;
        
        if (this.filtroAtual !== 'todas') {
            desvantagensFiltradas = desvantagensFiltradas.filter(d => d.categoria === this.filtroAtual);
        }
        
        if (this.buscaAtual) {
            const busca = this.buscaAtual.toLowerCase();
            desvantagensFiltradas = desvantagensFiltradas.filter(d => 
                d.nome.toLowerCase().includes(busca) || 
                d.descricao.toLowerCase().includes(busca)
            );
        }
        
        if (desvantagensFiltradas.length === 0) {
            container.innerHTML = `
                <div class="catalogo-loading">
                    <i class="fas fa-search"></i>
                    <p>Nenhuma desvantagem encontrada</p>
                    <small>Tente outro filtro ou termo de busca</small>
                </div>
            `;
            
            document.getElementById('contadorDesvantagens').textContent = '0';
            return;
        }
        
        let html = '';
        
        desvantagensFiltradas.forEach(desvantagem => {
            const jaAdquirida = this.desvantagensAdquiridas.some(d => d.id === desvantagem.id);
            const custoTexto = this.getCustoTexto(desvantagem);
            const categoriaNome = this.getCategoriaNome(desvantagem.categoria);
            
            html += `
                <div class="vantagem-item desvantagem ${jaAdquirida ? 'adquirida' : ''}" 
                     data-id="${desvantagem.id}">
                    
                    <div class="vantagem-header">
                        <h4>${desvantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo desvantagem">${custoTexto}</span>
                            <span class="vantagem-categoria desvantagem">${categoriaNome}</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${this.truncarTexto(desvantagem.descricao, 120)}</p>
                    
                    <div class="vantagem-footer">
                        <span class="vantagem-tipo">${this.getTipoTexto(desvantagem.tipo)}</span>
                        
                        ${jaAdquirida ? 
                            `<div class="vantagem-adquirida-acoes">
                                <button class="btn-editar" data-id="${desvantagem.id}" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-excluir" data-id="${desvantagem.id}" title="Remover">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>` : 
                            `<button class="btn-adicionar-desvantagem" data-id="${desvantagem.id}">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>`
                        }
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        this.adicionarEventosCatalogo();
        document.getElementById('contadorDesvantagens').textContent = desvantagensFiltradas.length;
    }
    
    adicionarEventosCatalogo() {
        const container = document.getElementById('listaCatalogoDesvantagens');
        
        container.querySelectorAll('.btn-adicionar-desvantagem').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const desvantagem = this.catalogo.find(d => d.id === id);
                if (desvantagem) {
                    this.abrirModalDesvantagem(desvantagem);
                }
            });
        });
        
        container.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const desvantagem = this.catalogo.find(d => d.id === id);
                if (desvantagem) {
                    this.abrirModalDesvantagem(desvantagem, true);
                }
            });
        });
        
        container.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removerDesvantagem(id);
            });
        });
        
        container.querySelectorAll('.vantagem-item').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                
                const id = parseInt(card.dataset.id);
                const desvantagem = this.catalogo.find(d => d.id === id);
                if (desvantagem) {
                    this.mostrarDetalhes(desvantagem);
                }
            });
        });
    }
    
    abrirModalDesvantagem(desvantagem, editando = false) {
        this.desvantagemAtualModal = desvantagem;
        this.desvantagemEditando = editando ? this.desvantagensAdquiridas.find(d => d.id === desvantagem.id) : null;
        
        const modal = document.getElementById('modalDesvantagem');
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) return;
        
        titulo.textContent = `${editando ? 'Editar' : 'Adicionar'}: ${desvantagem.nome}`;
        btnAdicionar.textContent = editando ? 'Atualizar' : 'Adicionar';
        
        let conteudo = '';
        
        switch(desvantagem.tipo) {
            case 'simples':
                conteudo = this.gerarModalSimples(desvantagem);
                break;
            case 'opcoes':
                conteudo = this.gerarModalOpcoes(desvantagem);
                break;
            case 'selecao_multipla':
                conteudo = this.gerarModalSelecaoMultipla(desvantagem);
                break;
            default:
                conteudo = this.gerarModalSimples(desvantagem);
        }
        
        corpo.innerHTML = conteudo;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        this.configurarEventosModal(desvantagem);
        
        if (editando && this.desvantagemEditando) {
            this.carregarConfiguracaoExistente(desvantagem);
        }
        
        this.atualizarCustoModal(desvantagem);
    }
    
    gerarModalSimples(desvantagem) {
        return `
            <div class="modal-descricao borda-negativa">
                <p>${desvantagem.descricao}</p>
            </div>
            
            <div class="custo-total fundo-negativo">
                <h4><i class="fas fa-coins"></i> Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">
                    ${desvantagem.custoBase} pontos
                </div>
            </div>
        `;
    }
    
    gerarModalOpcoes(desvantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list"></i> Selecione uma opção:</h4><div class="opcoes-lista">';
        
        desvantagem.opcoes.forEach((opcao, index) => {
            const isSelected = this.desvantagemEditando?.dados?.config?.opcao?.id === opcao.id;
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="opcao_desvantagem" 
                           value="${opcao.id}" 
                           data-custo="${opcao.custo}"
                           ${isSelected || (!this.desvantagemEditando && index === 0) ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${opcao.nome}</span>
                        <span class="opcao-custo texto-negativo">${opcao.custo} pts</span>
                    </div>
                </label>
            `;
        });
        
        opcoesHTML += '</div></div>';
        
        let custoInicial = desvantagem.opcoes[0].custo;
        if (this.desvantagemEditando?.dados?.config?.opcao) {
            custoInicial = this.desvantagemEditando.dados.config.opcao.custo;
        }
        
        return `
            <div class="modal-descricao borda-negativa">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total fundo-negativo">
                <h4><i class="fas fa-calculator"></i> Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">
                    ${custoInicial} pontos
                </div>
            </div>
        `;
    }
    
    gerarModalSelecaoMultipla(desvantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list-check"></i> Selecione as fobias:</h4><div class="selecao-multipla-lista">';
        
        desvantagem.opcoes.forEach(opcao => {
            const isChecked = this.desvantagemEditando?.dados?.config?.fobiasSelecionadas?.some(f => f.id === opcao.id);
            opcoesHTML += `
                <label class="opcao-checkbox">
                    <input type="checkbox" name="fobia_desvantagem" 
                           value="${opcao.id}" 
                           data-custo="${opcao.custo}"
                           ${isChecked ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${opcao.nome}</span>
                        <span class="opcao-custo texto-negativo">${opcao.custo} pts</span>
                    </div>
                </label>
            `;
        });
        
        opcoesHTML += '</div><p class="info-selecao"><small>Marque todas as fobias que o personagem possui</small></p></div>';
        
        let custoInicial = 0;
        if (this.desvantagemEditando?.dados?.config?.fobiasSelecionadas) {
            custoInicial = this.desvantagemEditando.dados.config.fobiasSelecionadas.reduce((sum, fobia) => sum + fobia.custo, 0);
        }
        
        return `
            <div class="modal-descricao borda-negativa">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total fundo-negativo">
                <h4><i class="fas fa-calculator"></i> Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">
                    ${custoInicial} pontos
                </div>
            </div>
        `;
    }
    
    configurarEventosModal(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !btnAdicionar) return;
        
        const atualizarCusto = () => this.atualizarCustoModal(desvantagem);
        
        modal.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', atualizarCusto);
        });
        
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.fechar-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.fecharModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.fecharModal());
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.fecharModal();
            }
        });
        
        btnAdicionar.addEventListener('click', () => {
            this.salvarDesvantagem(desvantagem);
        });
    }
    
    atualizarCustoModal(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        if (!modal) return;
        
        let custoTotal = 0;
        
        switch(desvantagem.tipo) {
            case 'simples':
                custoTotal = desvantagem.custoBase;
                break;
                
            case 'opcoes':
                const opcaoSelecionada = modal.querySelector('input[name="opcao_desvantagem"]:checked');
                if (opcaoSelecionada && opcaoSelecionada.dataset.custo) {
                    custoTotal = parseInt(opcaoSelecionada.dataset.custo);
                }
                break;
                
            case 'selecao_multipla':
                const fobiasSelecionadas = modal.querySelectorAll('input[name="fobia_desvantagem"]:checked');
                fobiasSelecionadas.forEach(fobia => {
                    if (fobia.dataset.custo) {
                        custoTotal += parseInt(fobia.dataset.custo);
                    }
                });
                break;
        }
        
        const elementoCusto = document.getElementById('custoModalTotalDesvantagem');
        if (elementoCusto) {
            elementoCusto.textContent = `${custoTotal} pontos`;
        }
    }
    
    carregarConfiguracaoExistente(desvantagem) {
        if (!this.desvantagemEditando || !this.desvantagemEditando.dados) return;
        
        const modal = document.getElementById('modalDesvantagem');
        if (!modal) return;
        
        const config = this.desvantagemEditando.dados.config;
        
        switch(desvantagem.tipo) {
            case 'opcoes':
                if (config.opcao) {
                    const radio = modal.querySelector(`input[name="opcao_desvantagem"][value="${config.opcao.id}"]`);
                    if (radio) radio.checked = true;
                }
                break;
                
            case 'selecao_multipla':
                if (config.fobiasSelecionadas) {
                    config.fobiasSelecionadas.forEach(fobia => {
                        const checkbox = modal.querySelector(`input[name="fobia_desvantagem"][value="${fobia.id}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                break;
        }
        
        this.atualizarCustoModal(desvantagem);
    }

        salvarDesvantagem(desvantagem) {
        const config = this.coletarConfiguracoes(desvantagem);
        if (!config) {
            alert('Por favor, selecione uma opção antes de salvar.');
            return;
        }
        
        if (desvantagem.tipo === 'selecao_multipla' && config.fobiasSelecionadas.length === 0) {
            alert('Por favor, selecione pelo menos uma fobia.');
            return;
        }
        
        const desvantagemAdquirida = {
            id: desvantagem.id,
            nome: config.nomeFinal,
            custo: config.custoFinal,
            dados: {
                config: config.config,
                descricao: desvantagem.descricao,
                tipo: desvantagem.tipo
            },
            timestamp: Date.now()
        };
        
        const indexExistente = this.desvantagensAdquiridas.findIndex(d => d.id === desvantagem.id);
        if (indexExistente !== -1) {
            this.desvantagensAdquiridas.splice(indexExistente, 1);
        }
        
        this.desvantagensAdquiridas.push(desvantagemAdquirida);
        
        this.salvarLocalStorage();
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.atualizarResumo();
        this.fecharModal();
        
        this.mostrarNotificacao(`${desvantagemAdquirida.nome} adicionada por ${desvantagemAdquirida.custo} pontos`);
    }
    
    coletarConfiguracoes(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        if (!modal) return null;
        
        let nomeFinal = desvantagem.nome;
        let custoFinal = 0;
        let config = { tipo: desvantagem.tipo };
        
        switch(desvantagem.tipo) {
            case 'simples':
                custoFinal = desvantagem.custoBase;
                break;
                
            case 'opcoes':
                const opcaoInput = modal.querySelector('input[name="opcao_desvantagem"]:checked');
                if (!opcaoInput) return null;
                
                const opcaoId = opcaoInput.value;
                const opcao = desvantagem.opcoes.find(o => o.id === opcaoId);
                if (!opcao) return null;
                
                nomeFinal = `${desvantagem.nome} (${opcao.nome})`;
                custoFinal = opcao.custo;
                config.opcao = opcao;
                break;
                
            case 'selecao_multipla':
                const fobiasSelecionadas = [];
                const fobiasInputs = modal.querySelectorAll('input[name="fobia_desvantagem"]:checked');
                
                if (fobiasInputs.length === 0) return null;
                
                fobiasInputs.forEach(input => {
                    const fobia = desvantagem.opcoes.find(f => f.id === input.value);
                    if (fobia) {
                        fobiasSelecionadas.push(fobia);
                        custoFinal += fobia.custo;
                    }
                });
                
                if (fobiasSelecionadas.length === 1) {
                    nomeFinal = `${desvantagem.nome} (${fobiasSelecionadas[0].nome})`;
                } else {
                    nomeFinal = `${desvantagem.nome} (${fobiasSelecionadas.length} fobias)`;
                }
                
                config.fobiasSelecionadas = fobiasSelecionadas;
                break;
        }
        
        return { nomeFinal, custoFinal, config };
    }
    
    mostrarDetalhes(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) return;
        
        titulo.textContent = `Detalhes: ${desvantagem.nome}`;
        btnAdicionar.style.display = 'none';
        
        corpo.innerHTML = `
            <div class="modal-descricao borda-negativa">
                <p>${desvantagem.descricao}</p>
            </div>
            
            <div class="modal-secao">
                <h4><i class="fas fa-info-circle"></i> Informações</h4>
                <div style="padding: 1rem;">
                    <p><strong>Categoria:</strong> ${this.getCategoriaNome(desvantagem.categoria)}</p>
                    <p><strong>Tipo:</strong> ${this.getTipoTexto(desvantagem.tipo)}</p>
                    <p><strong>Custo:</strong> ${this.getCustoTexto(desvantagem)}</p>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        const fecharComRestauracao = () => {
            btnAdicionar.style.display = 'block';
            btnAdicionar.textContent = 'Adicionar';
            this.fecharModal();
        };
        
        modal.querySelector('.modal-close').onclick = fecharComRestauracao;
        modal.querySelector('.fechar-modal').onclick = fecharComRestauracao;
    }
    
    carregarAdquiridas() {
        const container = document.getElementById('listaDesvantagensAdquiridas');
        if (!container) return;
        
        if (this.desvantagensAdquiridas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-thumbs-down"></i>
                    <p>Nenhuma desvantagem adquirida</p>
                    <small>Clique nas desvantagens do catálogo para adicionar</small>
                </div>
            `;
            
            this.atualizarDisplayDesvantagens(0, 0);
            return;
        }
        
        let html = '';
        
        this.desvantagensAdquiridas.forEach(desvantagem => {
            const original = this.catalogo.find(d => d.id === desvantagem.id);
            const descricao = original ? original.descricao : 'Sem descrição disponível';
            
            html += `
                <div class="vantagem-item desvantagem adquirida" data-id="${desvantagem.id}">
                    <div class="vantagem-header">
                        <h4>${desvantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo desvantagem">${desvantagem.custo} pts</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${this.truncarTexto(descricao, 100)}</p>
                    
                    <div class="vantagem-footer">
                        <div class="vantagem-adquirida-acoes">
                            <button class="btn-editar" data-id="${desvantagem.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-excluir" data-id="${desvantagem.id}" title="Remover">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        this.adicionarEventosAdquiridas();
        this.atualizarDisplayDesvantagens();
    }
    
    adicionarEventosAdquiridas() {
        const container = document.getElementById('listaDesvantagensAdquiridas');
        
        container.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const desvantagem = this.catalogo.find(d => d.id === id);
                if (desvantagem) {
                    this.abrirModalDesvantagem(desvantagem, true);
                }
            });
        });
        
        container.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removerDesvantagem(id);
            });
        });
        
        container.querySelectorAll('.vantagem-item').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                
                const id = parseInt(card.dataset.id);
                const desvantagem = this.catalogo.find(d => d.id === id);
                if (desvantagem) {
                    this.mostrarDetalhes(desvantagem);
                }
            });
        });
    }
    
    removerDesvantagem(id) {
        if (!confirm('Tem certeza que deseja remover esta desvantagem?')) return;
        
        this.desvantagensAdquiridas = this.desvantagensAdquiridas.filter(d => d.id !== id);
        this.salvarLocalStorage();
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.atualizarResumo();
        
        this.mostrarNotificacao('Desvantagem removida');
    }
    
    fecharModal() {
        const modal = document.getElementById('modalDesvantagem');
        if (modal) {
            modal.classList.remove('show');
        }
        document.body.style.overflow = '';
        this.desvantagemEditando = null;
        this.desvantagemAtualModal = null;
        
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        if (btnAdicionar) {
            btnAdicionar.style.display = 'block';
            btnAdicionar.textContent = 'Adicionar';
        }
    }
    
    atualizarDisplayDesvantagens() {
        const total = this.desvantagensAdquiridas.length;
        const pontos = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
        
        document.getElementById('totalDesvantagensAdquiridas').textContent = total;
        document.getElementById('pontosDesvantagensAdquiridas').textContent = `${pontos} pts`;
        
        const elementoPrincipal = document.getElementById('pontosDesvantagens');
        if (elementoPrincipal) {
            elementoPrincipal.textContent = Math.abs(pontos);
        }
    }
    
    atualizarResumo() {
        this.atualizarDisplayDesvantagens();
    }
    
    mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
        `;
        
        notificacao.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${mensagem}</span>
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.opacity = '0';
            notificacao.style.transform = 'translateX(100px)';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
    
    setupEventListeners() {
        const filtrosContainer = document.querySelector('#subtab-desvantagens-catalogo .catalogo-filtros');
        if (filtrosContainer) {
            filtrosContainer.addEventListener('click', (e) => {
                const filtroBtn = e.target.closest('.filtro-btn');
                if (filtroBtn) {
                    e.preventDefault();
                    
                    filtrosContainer.querySelectorAll('.filtro-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    filtroBtn.classList.add('active');
                    
                    this.filtroAtual = filtroBtn.dataset.filtro;
                    this.carregarCatalogo();
                }
            });
        }
        
        const buscaInput = document.getElementById('buscarDesvantagem');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                this.buscaAtual = e.target.value;
                clearTimeout(this.buscaTimeout);
                this.buscaTimeout = setTimeout(() => {
                    this.carregarCatalogo();
                }, 300);
            });
        }
        
        const btnLimpar = document.getElementById('limparDesvantagens');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                if (this.desvantagensAdquiridas.length === 0) {
                    alert('Não há desvantagens para limpar.');
                    return;
                }
                
                if (confirm('Tem certeza que deseja remover TODAS as desvantagens adquiridas?')) {
                    this.desvantagensAdquiridas = [];
                    this.salvarLocalStorage();
                    this.carregarCatalogo();
                    this.carregarAdquiridas();
                    this.atualizarResumo();
                    this.mostrarNotificacao('Todas as desvantagens foram removidas');
                }
            });
        }
    }
    
    salvarLocalStorage() {
        try {
            localStorage.setItem('desvantagensAdquiridas', JSON.stringify(this.desvantagensAdquiridas));
        } catch (e) {}
    }
    
    getCustoTexto(desvantagem) {
        switch(desvantagem.tipo) {
            case 'opcoes':
            case 'selecao_multipla':
                return 'Variável';
            default:
                return `${desvantagem.custoBase} pts`;
        }
    }
    
    getCategoriaNome(categoria) {
        const categorias = {
            'fisicas': 'Física',
            'mentais': 'Mental',
            'sociais': 'Social',
            'exoticas': 'Exótica'
        };
        return categorias[categoria] || categoria;
    }
    
    getTipoTexto(tipo) {
        const tipos = {
            'simples': 'Simples',
            'opcoes': 'Com Opções',
            'selecao_multipla': 'Múltipla'
        };
        return tipos[tipo] || tipo;
    }
    
    truncarTexto(texto, maxLength) {
        if (texto.length <= maxLength) return texto;
        return texto.substring(0, maxLength) + '...';
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    const inicializarQuandoAtivo = () => {
        const abaDesvantagens = document.getElementById('subtab-desvantagens-catalogo');
        
        if (abaDesvantagens && abaDesvantagens.classList.contains('active')) {
            if (!window.desvantagensManager) {
                window.desvantagensManager = new DesvantagensManager();
            }
        }
    };
    
    const vantagensContent = document.querySelector('#vantagens .vantagens-content');
    if (vantagensContent) {
        const observer = new MutationObserver(() => {
            setTimeout(inicializarQuandoAtivo, 50);
        });
        
        observer.observe(vantagensContent, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    setTimeout(inicializarQuandoAtivo, 100);
    
    document.addEventListener('click', (e) => {
        const subTab = e.target.closest('.sub-tab');
        if (subTab && subTab.dataset.subtab === 'desvantagens-catalogo') {
            setTimeout(() => {
                if (!window.desvantagensManager) {
                    window.desvantagensManager = new DesvantagensManager();
                }
            }, 300);
        }
    });
});

// Adicionar animação CSS
if (!document.querySelector('#desvantagens-animation-style')) {
    const style = document.createElement('style');
    style.id = 'desvantagens-animation-style';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}