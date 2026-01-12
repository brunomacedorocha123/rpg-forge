/* ===========================================
  DESVANTAGENS MANAGER - VERSÃO COMPLETA
  TODOS OS BOTÕES FUNCIONANDO
=========================================== */

class DesvantagensManager {
    constructor() {
        this.desvantagensAdquiridas = JSON.parse(localStorage.getItem('desvantagensAdquiridas')) || [];
        this.catalogo = window.catalogoDesvantagens || catalogoDesvantagens;
        this.filtroAtual = 'todas';
        this.buscaAtual = '';
        this.desvantagemEditando = null;
        
        console.log('DesvantagensManager inicializado com', this.catalogo.length, 'desvantagens');
        
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
        if (!container) {
            console.error('Container do catálogo não encontrado!');
            return;
        }
        
        // Aplicar filtros
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
        
        // Verificar se há resultados
        if (desvantagensFiltradas.length === 0) {
            container.innerHTML = `
                <div class="catalogo-loading">
                    <i class="fas fa-search"></i>
                    <p>Nenhuma desvantagem encontrada</p>
                    <small>Tente outro filtro ou termo de busca</small>
                </div>
            `;
            
            const contador = document.getElementById('contadorDesvantagens');
            if (contador) contador.textContent = '0';
            
            return;
        }
        
        // Gerar HTML
        let html = '';
        
        desvantagensFiltradas.forEach(desvantagem => {
            const jaAdquirida = this.desvantagensAdquiridas.some(d => d.id === desvantagem.id);
            const custoTexto = this.getCustoTexto(desvantagem);
            const tipoTexto = this.getTipoTexto(desvantagem.tipo);
            
            html += `
                <div class="vantagem-item desvantagem ${jaAdquirida ? 'adquirida' : ''}" data-id="${desvantagem.id}">
                    <div class="vantagem-header">
                        <h4>${desvantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo desvantagem">${custoTexto}</span>
                            <span class="vantagem-categoria desvantagem">${this.getCategoriaNome(desvantagem.categoria)}</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${desvantagem.descricao.substring(0, 150)}${desvantagem.descricao.length > 150 ? '...' : ''}</p>
                    
                    <div class="vantagem-footer">
                        <span class="vantagem-tipo">${tipoTexto}</span>
                        
                        ${jaAdquirida ? 
                            `<div class="vantagem-adquirida-acoes">
                                <button class="btn-editar" title="Editar configuração" data-id="${desvantagem.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-excluir" title="Remover desvantagem" data-id="${desvantagem.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>` : 
                            `<button class="btn-vantagem desvantagem btn-adicionar-desvantagem" data-id="${desvantagem.id}">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>`
                        }
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos dos botões
        this.configurarEventosCatalogo();
        
        // Atualizar contador
        const contador = document.getElementById('contadorDesvantagens');
        if (contador) contador.textContent = desvantagensFiltradas.length;
    }
    
    configurarEventosCatalogo() {
        const container = document.getElementById('listaCatalogoDesvantagens');
        if (!container) return;
        
        // Botões Adicionar
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
        
        // Botões Editar
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
        
        // Botões Excluir
        container.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removerDesvantagem(id);
            });
        });
        
        // Clicar no item para ver detalhes
        container.querySelectorAll('.vantagem-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const id = parseInt(item.dataset.id);
                    const desvantagem = this.catalogo.find(d => d.id === id);
                    if (desvantagem) {
                        this.mostrarDetalhes(desvantagem);
                    }
                }
            });
        });
    }
    
    abrirModalDesvantagem(desvantagem, editando = false) {
        console.log('Abrindo modal para:', desvantagem.nome, 'editando:', editando);
        
        this.desvantagemEditando = editando ? this.desvantagensAdquiridas.find(d => d.id === desvantagem.id) : null;
        
        const modal = document.getElementById('modalDesvantagem');
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) {
            console.error('Elementos do modal não encontrados!');
            return;
        }
        
        // Configurar título e botão
        titulo.textContent = desvantagem.nome;
        btnAdicionar.textContent = editando ? 'Atualizar' : 'Adicionar';
        btnAdicionar.style.display = 'block';
        
        // Gerar conteúdo baseado no tipo
        let conteudo = '';
        
        switch(desvantagem.tipo) {
            case 'simples':
                conteudo = this.criarModalSimples(desvantagem);
                break;
                
            case 'opcoes':
                conteudo = this.criarModalOpcoes(desvantagem);
                break;
                
            case 'selecao_multipla':
                conteudo = this.criarModalSelecaoMultipla(desvantagem);
                break;
                
            default:
                conteudo = this.criarModalSimples(desvantagem);
        }
        
        corpo.innerHTML = conteudo;
        
        // Configurar eventos do modal
        this.configurarEventosModal(desvantagem);
        
        // Carregar configuração existente se estiver editando
        if (editando && this.desvantagemEditando) {
            this.carregarConfiguracaoExistente(desvantagem);
        }
        
        // Mostrar modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Atualizar custo inicial
        setTimeout(() => {
            this.atualizarCustoModal(desvantagem);
        }, 50);
    }
    
    criarModalSimples(desvantagem) {
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">${desvantagem.custoBase} pontos</div>
            </div>
        `;
    }
    
    criarModalOpcoes(desvantagem) {
        let opcoesHTML = '';
        
        if (desvantagem.opcoes && desvantagem.opcoes.length > 0) {
            opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list"></i> Selecione a opção:</h4><div class="opcoes-lista">';
            
            desvantagem.opcoes.forEach((opcao, index) => {
                opcoesHTML += `
                    <label class="opcao-radio">
                        <input type="radio" name="opcao" value="${opcao.id}" data-custo="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
                        <div class="opcao-conteudo">
                            <span class="opcao-nome">${opcao.nome}</span>
                            <span class="opcao-custo texto-negativo">${opcao.custo} pts</span>
                        </div>
                    </label>
                `;
            });
            
            opcoesHTML += '</div></div>';
        }
        
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">${desvantagem.opcoes[0].custo} pontos</div>
            </div>
        `;
    }
    
    criarModalSelecaoMultipla(desvantagem) {
        let opcoesHTML = '';
        
        if (desvantagem.opcoes && desvantagem.opcoes.length > 0) {
            opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list-check"></i> Selecione uma ou mais fobias:</h4><div class="selecao-multipla-lista">';
            
            desvantagem.opcoes.forEach((opcao) => {
                opcoesHTML += `
                    <label class="opcao-checkbox">
                        <input type="checkbox" name="fobia" value="${opcao.id}" data-custo="${opcao.custo}">
                        <div class="opcao-conteudo">
                            <span class="opcao-nome">${opcao.nome}</span>
                            <span class="opcao-custo texto-negativo">${opcao.custo} pts</span>
                        </div>
                    </label>
                `;
            });
            
            opcoesHTML += '</div><p class="info-selecao"><small>Marque todas as fobias que o personagem possui</small></p></div>';
        }
        
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">0 pontos</div>
            </div>
        `;
    }
    
    configurarEventosModal(desvantagem) {
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        const modal = document.getElementById('modalDesvantagem');
        
        if (!btnAdicionar || !modal) return;
        
        // Configurar botão Adicionar/Atualizar
        btnAdicionar.onclick = () => {
            this.salvarDesvantagem(desvantagem);
        };
        
        // Configurar eventos dos inputs para atualizar custo
        const inputs = modal.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.atualizarCustoModal(desvantagem);
            });
        });
        
        // Configurar botões de fechar
        const btnFechar = modal.querySelector('.modal-close');
        const btnCancelar = modal.querySelector('.fechar-modal');
        
        if (btnFechar) {
            btnFechar.onclick = (e) => {
                e.preventDefault();
                this.fecharModal();
            };
        }
        
        if (btnCancelar) {
            btnCancelar.onclick = (e) => {
                e.preventDefault();
                this.fecharModal();
            };
        }
        
        // Fechar ao clicar no fundo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.fecharModal();
            }
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
                const opcaoSelecionada = modal.querySelector('input[name="opcao"]:checked');
                if (opcaoSelecionada) {
                    custoTotal = parseInt(opcaoSelecionada.dataset.custo) || 0;
                }
                break;
                
            case 'selecao_multipla':
                const fobiasSelecionadas = modal.querySelectorAll('input[name="fobia"]:checked');
                fobiasSelecionadas.forEach(fobia => {
                    custoTotal += parseInt(fobia.dataset.custo) || 0;
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
                    const radio = modal.querySelector(`input[name="opcao"][value="${config.opcao.id}"]`);
                    if (radio) radio.checked = true;
                }
                break;
                
            case 'selecao_multipla':
                if (config.fobiasSelecionadas) {
                    config.fobiasSelecionadas.forEach(fobia => {
                        const checkbox = modal.querySelector(`input[name="fobia"][value="${fobia.id}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                break;
        }
        
        this.atualizarCustoModal(desvantagem);
    }
    
    salvarDesvantagem(desvantagem) {
        console.log('Salvando desvantagem:', desvantagem.nome);
        
        const config = this.coletarConfiguracoes(desvantagem);
        if (!config) {
            alert('Por favor, selecione uma opção antes de salvar.');
            return;
        }
        
        // Validar seleção para fobias
        if (desvantagem.tipo === 'selecao_multipla' && config.fobiasSelecionadas.length === 0) {
            alert('Por favor, selecione pelo menos uma fobia.');
            return;
        }
        
        const desvantagemAdquirida = {
            id: desvantagem.id,
            nome: config.nomeFinal,
            custo: config.custoFinal,
            dados: {
                config: config,
                descricao: desvantagem.descricao,
                tipo: desvantagem.tipo
            },
            timestamp: Date.now()
        };
        
        // Remover versão anterior se existir
        const indexExistente = this.desvantagensAdquiridas.findIndex(d => d.id === desvantagem.id);
        if (indexExistente !== -1) {
            this.desvantagensAdquiridas.splice(indexExistente, 1);
        }
        
        // Adicionar nova versão
        this.desvantagensAdquiridas.push(desvantagemAdquirida);
        
        // Salvar e atualizar interface
        this.salvarLocalStorage();
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.atualizarResumo();
        this.fecharModal();
        
        // Mostrar notificação
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
                const opcaoInput = modal.querySelector('input[name="opcao"]:checked');
                if (!opcaoInput) {
                    alert('Por favor, selecione uma opção.');
                    return null;
                }
                
                const opcaoId = opcaoInput.value;
                const opcao = desvantagem.opcoes.find(o => o.id === opcaoId);
                if (!opcao) return null;
                
                nomeFinal = `${desvantagem.nome} (${opcao.nome})`;
                custoFinal = opcao.custo;
                config.opcao = opcao;
                break;
                
            case 'selecao_multipla':
                const fobiasSelecionadas = [];
                const fobiasInputs = modal.querySelectorAll('input[name="fobia"]:checked');
                
                if (fobiasInputs.length === 0) {
                    return null;
                }
                
                fobiasInputs.forEach(input => {
                    const fobia = desvantagem.opcoes.find(f => f.id === input.value);
                    if (fobia) {
                        fobiasSelecionadas.push(fobia);
                        custoFinal += fobia.custo;
                    }
                });
                
                // Formatar nome
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
    
    carregarAdquiridas() {
        const container = document.getElementById('listaDesvantagensAdquiridas');
        if (!container) return;
        
        if (this.desvantagensAdquiridas.length === 0) {
            container.innerHTML = `
                <div class="empty-state desvantagem">
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
            const descricao = original ? original.descricao : '';
            
            html += `
                <div class="vantagem-item desvantagem adquirida" data-id="${desvantagem.id}">
                    <div class="vantagem-header">
                        <h4>${desvantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo desvantagem">${desvantagem.custo} pts</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${descricao.substring(0, 120)}${descricao.length > 120 ? '...' : ''}</p>
                    
                    <div class="vantagem-footer">
                        <div class="vantagem-adquirida-acoes">
                            <button class="btn-editar" title="Editar configuração" data-id="${desvantagem.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-excluir" title="Remover desvantagem" data-id="${desvantagem.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos das desvantagens adquiridas
        this.configurarEventosAdquiridas();
        
        this.atualizarDisplayDesvantagens();
    }
    
    configurarEventosAdquiridas() {
        const container = document.getElementById('listaDesvantagensAdquiridas');
        if (!container) return;
        
        // Botões Editar
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
        
        // Botões Excluir
        container.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removerDesvantagem(id);
            });
        });
        
        // Clicar no item para ver detalhes
        container.querySelectorAll('.vantagem-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const id = parseInt(item.dataset.id);
                    const desvantagem = this.catalogo.find(d => d.id === id);
                    if (desvantagem) {
                        this.mostrarDetalhes(desvantagem);
                    }
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
    
    mostrarDetalhes(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) return;
        
        titulo.textContent = `Detalhes: ${desvantagem.nome}`;
        btnAdicionar.style.display = 'none';
        
        let detalhesHTML = `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            <div class="modal-secao">
                <h4><i class="fas fa-info-circle"></i> Informações:</h4>
                <div style="padding: 1rem;">
                    <p><strong>Categoria:</strong> ${this.getCategoriaNome(desvantagem.categoria)}</p>
                    <p><strong>Tipo:</strong> ${this.getTipoTexto(desvantagem.tipo)}</p>
                    <p><strong>Custo Base:</strong> ${this.getCustoTexto(desvantagem)}</p>
                </div>
            </div>
        `;
        
        corpo.innerHTML = detalhesHTML;
        
        // Mostrar modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Configurar botão de fechar
        const btnFechar = modal.querySelector('.modal-close');
        const btnCancelar = modal.querySelector('.fechar-modal');
        
        const restaurarBotao = () => {
            btnAdicionar.style.display = 'block';
        };
        
        if (btnFechar) {
            btnFechar.onclick = (e) => {
                e.preventDefault();
                restaurarBotao();
                this.fecharModal();
            };
        }
        
        if (btnCancelar) {
            btnCancelar.onclick = (e) => {
                e.preventDefault();
                restaurarBotao();
                this.fecharModal();
            };
        }
    }
    
    fecharModal() {
        const modal = document.getElementById('modalDesvantagem');
        if (modal) {
            modal.classList.remove('show');
        }
        document.body.style.overflow = '';
        this.desvantagemEditando = null;
        
        // Restaurar botão Adicionar
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        if (btnAdicionar) {
            btnAdicionar.style.display = 'block';
            btnAdicionar.textContent = 'Adicionar';
        }
    }
    
    atualizarDisplayDesvantagens(total = null, pontos = null) {
        if (total === null) total = this.desvantagensAdquiridas.length;
        if (pontos === null) pontos = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
        
        const totalElement = document.getElementById('totalDesvantagensAdquiridas');
        const pontosElement = document.getElementById('pontosDesvantagensAdquiridas');
        
        if (totalElement) totalElement.textContent = total;
        if (pontosElement) pontosElement.textContent = `${pontos} pts`;
        
        // Atualizar resumo geral
        this.atualizarResumoNaAbaPrincipal(pontos);
    }
    
    atualizarResumoNaAbaPrincipal(pontosDesvantagens) {
        const elemento = document.getElementById('pontosDesvantagens');
        if (elemento) elemento.textContent = Math.abs(pontosDesvantagens);
    }
    
    atualizarResumo() {
        const total = this.desvantagensAdquiridas.length;
        const pontos = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
        this.atualizarDisplayDesvantagens(total, pontos);
    }
    
    mostrarNotificacao(mensagem) {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-vantagem fundo-negativo';
        notificacao.innerHTML = `
            <div class="notificacao-conteudo">
                <i class="fas fa-exclamation-circle"></i>
                <span class="texto-negativo">${mensagem}</span>
            </div>
        `;
        
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.classList.add('fade-out');
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }
    
    setupEventListeners() {
        // Filtros
        const filtrosContainer = document.querySelector('#subtab-desvantagens-catalogo .catalogo-filtros');
        if (filtrosContainer) {
            filtrosContainer.addEventListener('click', (e) => {
                const filtroBtn = e.target.closest('.filtro-btn');
                if (filtroBtn) {
                    e.preventDefault();
                    
                    // Remover active de todos
                    filtrosContainer.querySelectorAll('.filtro-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Ativar o clicado
                    filtroBtn.classList.add('active');
                    this.filtroAtual = filtroBtn.dataset.filtro;
                    this.carregarCatalogo();
                }
            });
        }
        
        // Busca
        const buscaInput = document.getElementById('buscarDesvantagem');
        if (buscaInput) {
            // Usar input event para busca em tempo real
            buscaInput.addEventListener('input', (e) => {
                this.buscaAtual = e.target.value;
                clearTimeout(this.buscaTimeout);
                this.buscaTimeout = setTimeout(() => {
                    this.carregarCatalogo();
                }, 300);
            });
            
            // Também permitir Enter
            buscaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.carregarCatalogo();
                }
            });
        }
        
        // Limpar tudo
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
        } catch (e) {
            console.error('Erro ao salvar desvantagens no localStorage:', e);
        }
    }
    
    // Métodos auxiliares
    getCustoTexto(desvantagem) {
        switch(desvantagem.tipo) {
            case 'opcoes':
                return 'Variável';
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
            'selecao_multipla': 'Seleção Múltipla'
        };
        return tipos[tipo] || tipo;
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na aba de vantagens/desvantagens
    const vantagensTab = document.getElementById('vantagens');
    if (vantagensTab) {
        // Inicializar quando a aba for ativada
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (vantagensTab.classList.contains('active')) {
                        if (!window.desvantagensManager) {
                            window.desvantagensManager = new DesvantagensManager();
                            console.log('DesvantagensManager inicializado automaticamente');
                        }
                    }
                }
            });
        });
        
        observer.observe(vantagensTab, { attributes: true });
        
        // Também inicializar se já estiver ativa
        if (vantagensTab.classList.contains('active')) {
            setTimeout(() => {
                if (!window.desvantagensManager) {
                    window.desvantagensManager = new DesvantagensManager();
                }
            }, 100);
        }
    }
});

// Inicializar também quando clicar na sub-aba de desvantagens
document.addEventListener('click', (e) => {
    const subTab = e.target.closest('.sub-tab');
    if (subTab && (subTab.dataset.target === 'subtab-desvantagens-catalogo' || 
                   subTab.textContent.includes('Desvantagens'))) {
        setTimeout(() => {
            if (!window.desvantagensManager) {
                window.desvantagensManager = new DesvantagensManager();
            }
        }, 100);
    }
});

// Exportar para uso global
window.DesvantagensManager = DesvantagensManager;