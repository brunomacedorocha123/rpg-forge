/* ===========================================
  DESVANTAGENS MANAGER - VERSÃO COMPLETA
  ESTRUTURA IDÊNTICA ÀS VANTAGENS
=========================================== */
class DesvantagensManager {
    constructor() {
        this.desvantagensAdquiridas = JSON.parse(localStorage.getItem('desvantagensAdquiridas')) || [];
        this.catalogo = catalogoDesvantagens;
        this.filtroAtual = 'todas';
        this.buscaAtual = '';
        this.desvantagemEditando = null;
        
        this.init();
    }
    
    init() {
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.setupEventListeners();
        this.atualizarResumo();
        this.integrarComPontosManager();
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
                    
                    <p class="vantagem-descricao">${desvantagem.descricao}</p>
                    
                    <div class="vantagem-footer">
                        <span class="vantagem-tipo">${tipoTexto}</span>
                        
                        ${jaAdquirida ? 
                            `<div class="vantagem-adquirida-acoes">
                                <button class="btn-editar" title="Editar configuração">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-excluir" title="Remover desvantagem">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>` : 
                            `<button class="btn-vantagem desvantagem btn-adicionar-desvantagem">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>`
                        }
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos para os itens do catálogo
        container.querySelectorAll('.vantagem-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const desvantagem = this.catalogo.find(d => d.id === id);
            if (!desvantagem) return;
            
            // Clique no item para mostrar detalhes
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-editar') && 
                    !e.target.closest('.btn-excluir') && 
                    !e.target.closest('.btn-adicionar-desvantagem')) {
                    this.mostrarDetalhes(desvantagem);
                }
            });
            
            // Botão Adicionar
            const btnAdicionar = item.querySelector('.btn-adicionar-desvantagem');
            if (btnAdicionar) {
                btnAdicionar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.abrirModalDesvantagem(desvantagem);
                });
            }
            
            // Botão Editar
            const btnEditar = item.querySelector('.btn-editar');
            if (btnEditar) {
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.abrirModalDesvantagem(desvantagem, true);
                });
            }
            
            // Botão Excluir
            const btnExcluir = item.querySelector('.btn-excluir');
            if (btnExcluir) {
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removerDesvantagem(id);
                });
            }
        });
        
        document.getElementById('contadorDesvantagens').textContent = desvantagensFiltradas.length;
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
                            <button class="btn-editar" title="Editar configuração">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-excluir" title="Remover desvantagem">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos para desvantagens adquiridas
        container.querySelectorAll('.vantagem-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const btnEditar = item.querySelector('.btn-editar');
            const btnExcluir = item.querySelector('.btn-excluir');
            const original = this.catalogo.find(d => d.id === id);
            
            if (btnEditar) {
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (original) this.abrirModalDesvantagem(original, true);
                });
            }
            
            if (btnExcluir) {
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removerDesvantagem(id);
                });
            }
            
            if (original) {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.btn-editar') && !e.target.closest('.btn-excluir')) {
                        this.mostrarDetalhes(original);
                    }
                });
            }
        });
        
        this.atualizarDisplayDesvantagens();
    }
    
    atualizarDisplayDesvantagens(total = null, pontos = null) {
        if (total === null) total = this.desvantagensAdquiridas.length;
        if (pontos === null) pontos = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
        
        document.getElementById('totalDesvantagensAdquiridas').textContent = total;
        document.getElementById('pontosDesvantagensAdquiridas').textContent = `${pontos} pts`;
        
        // Atualizar resumo na aba principal
        this.atualizarResumoNaAbaPrincipal(pontos);
        
        // Notificar o sistema de pontos
        this.notificarPontosDesvantagens(pontos);
    }
    
    atualizarResumoNaAbaPrincipal(pontosDesvantagens) {
        const elemento = document.getElementById('pontosDesvantagens');
        if (elemento) elemento.textContent = Math.abs(pontosDesvantagens);
    }
    
    notificarPontosDesvantagens(pontosDesvantagens) {
        // Disparar evento para o sistema de pontos
        const evento = new CustomEvent('desvantagensAtualizadas', {
            detail: {
                pontos: pontosDesvantagens,
                tipo: 'catalogo'
            }
        });
        document.dispatchEvent(evento);
    }
    
    abrirModalDesvantagem(desvantagem, editando = false) {
        this.desvantagemEditando = editando ? this.desvantagensAdquiridas.find(d => d.id === desvantagem.id) : null;
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        const modal = document.getElementById('modalDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) {
            console.error('Elementos do modal não encontrados');
            return;
        }
        
        titulo.textContent = desvantagem.nome;
        btnAdicionar.textContent = this.desvantagemEditando ? 'Atualizar' : 'Adicionar';
        btnAdicionar.style.display = 'block';
        
        switch(desvantagem.tipo) {
            case 'simples':
                corpo.innerHTML = this.criarModalSimples(desvantagem);
                break;
            case 'niveis':
                corpo.innerHTML = this.criarModalNiveis(desvantagem);
                break;
            case 'opcoes':
                corpo.innerHTML = this.criarModalOpcoes(desvantagem);
                break;
            case 'niveis_com_limitações':
                corpo.innerHTML = this.criarModalNiveisLimitacoes(desvantagem);
                break;
            case 'opcoes_com_limitações':
                corpo.innerHTML = this.criarModalOpcoesLimitacoes(desvantagem);
                break;
            default:
                corpo.innerHTML = this.criarModalSimples(desvantagem);
        }
        
        this.configurarEventosModal(desvantagem);
        
        if (this.desvantagemEditando) {
            this.carregarConfiguracaoExistente(desvantagem);
        }
        
        // USAR CLASSE .show PARA MOSTRAR O MODAL
        modal.classList.add('show');
        document.body.classList.add('modal-aberto');
        
        // Garantir que o primeiro radio button esteja selecionado
        setTimeout(() => {
            const primeiroRadio = modal.querySelector('input[type="radio"]');
            if (primeiroRadio && !modal.querySelector('input[type="radio"]:checked')) {
                primeiroRadio.checked = true;
                this.atualizarCustoModal(desvantagem);
            }
        }, 10);
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
            <input type="hidden" id="configCustoDesvantagem" value="${desvantagem.custoBase}">
        `;
    }
    
    criarModalNiveis(desvantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-layer-group"></i> Selecione o nível:</h4><div class="opcoes-lista">';
        
        for (let i = 1; i <= desvantagem.niveisMaximo; i++) {
            const custo = desvantagem.custoBase * i;
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="nivel" value="${i}" data-custo="${custo}" ${i === 1 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">Nível ${i}</span>
                        <span class="opcao-custo texto-negativo">${custo} pts</span>
                    </div>
                </label>
            `;
        }
        
        opcoesHTML += '</div></div>';
        
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">${desvantagem.custoBase} pontos</div>
            </div>
        `;
    }
    
    criarModalOpcoes(desvantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list"></i> Selecione a opção:</h4><div class="opcoes-lista">';
        
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
    
    criarModalNiveisLimitacoes(desvantagem) {
        let niveisHTML = '<div class="modal-secao"><h4><i class="fas fa-layer-group"></i> Nível de Severidade:</h4><div class="opcoes-lista">';
        
        for (let i = 1; i <= desvantagem.niveisMaximo; i++) {
            const custo = desvantagem.custoBase * i;
            niveisHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="nivel" value="${i}" data-custo-base="${custo}" ${i === 1 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">Nível ${i}</span>
                        <span class="opcao-custo texto-negativo">${custo} pts</span>
                    </div>
                </label>
            `;
        }
        
        niveisHTML += '</div></div>';
        
        let limitacoesHTML = '<div class="modal-secao"><h4><i class="fas fa-exclamation-triangle"></i> Ampliações (opcional):</h4><div class="limitacoes-lista">';
        
        desvantagem.limitações.forEach(limitacao => {
            limitacoesHTML += `
                <label class="opcao-checkbox">
                    <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${limitacao.nome}</span>
                        <span class="opcao-custo texto-negativo">${limitacao.custo}%</span>
                        <small class="opcao-descricao">${limitacao.descricao}</small>
                    </div>
                </label>
            `;
        });
        
        limitacoesHTML += '</div><p class="info-limitacoes"><small>As ampliações aumentam o custo em percentual</small></p></div>';
        
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            ${niveisHTML}
            ${limitacoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">${desvantagem.custoBase} pontos</div>
            </div>
        `;
    }
    
    criarModalOpcoesLimitacoes(desvantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-clover"></i> Tipo de Fobia:</h4><div class="opcoes-lista">';
        
        desvantagem.opcoes.forEach((opcao, index) => {
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="opcao" value="${opcao.id}" data-custo-base="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${opcao.nome}</span>
                        <span class="opcao-custo texto-negativo">${opcao.custo} pts</span>
                        <small class="opcao-descricao">${opcao.descricao || ''}</small>
                    </div>
                </label>
            `;
        });
        
        opcoesHTML += '</div></div>';
        
        let limitacoesHTML = '<div class="modal-secao"><h4><i class="fas fa-exclamation-triangle"></i> Ampliações (opcional):</h4><div class="limitacoes-lista">';
        
        desvantagem.limitações.forEach(limitacao => {
            limitacoesHTML += `
                <label class="opcao-checkbox">
                    <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${limitacao.nome}</span>
                        <span class="opcao-custo texto-negativo">${limitacao.custo}%</span>
                        <small class="opcao-descricao">${limitacao.descricao}</small>
                    </div>
                </label>
            `;
        });
        
        limitacoesHTML += '</div></div>';
        
        return `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            ${limitacoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor texto-negativo" id="custoModalTotalDesvantagem">${desvantagem.opcoes[0].custo} pontos</div>
            </div>
        `;
    }
    
    configurarEventosModal(desvantagem) {
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        if (btnAdicionar) {
            btnAdicionar.onclick = () => this.salvarDesvantagem(desvantagem);
        }
        
        // Configurar eventos para todos os inputs
        setTimeout(() => {
            const inputs = document.querySelectorAll('#modalDesvantagem input');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.atualizarCustoModal(desvantagem);
                });
            });
            
            // Atualizar custo inicial
            this.atualizarCustoModal(desvantagem);
        }, 10);
    }
    
    atualizarCustoModal(desvantagem) {
        let custoBase = desvantagem.custoBase;
        let porcentagem = 0;
        
        const modal = document.getElementById('modalDesvantagem');
        if (!modal) return;
        
        switch(desvantagem.tipo) {
            case 'niveis':
                const nivelInput = modal.querySelector('input[name="nivel"]:checked');
                if (nivelInput) {
                    custoBase = parseInt(nivelInput.dataset.custo) || desvantagem.custoBase;
                }
                break;
                
            case 'opcoes':
                const opcaoInput = modal.querySelector('input[name="opcao"]:checked');
                if (opcaoInput) {
                    custoBase = parseInt(opcaoInput.dataset.custo) || desvantagem.custoBase;
                }
                break;
                
            case 'niveis_com_limitações':
                const nivelSel = modal.querySelector('input[name="nivel"]:checked');
                if (nivelSel) {
                    custoBase = parseInt(nivelSel.dataset.custoBase) || desvantagem.custoBase;
                }
                
                const limitacoes = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoes.forEach(lim => {
                    porcentagem += parseInt(lim.dataset.custo) || 0;
                });
                break;
                
            case 'opcoes_com_limitações':
                const opcaoSel = modal.querySelector('input[name="opcao"]:checked');
                if (opcaoSel) {
                    custoBase = parseInt(opcaoSel.dataset.custoBase) || desvantagem.custoBase;
                }
                
                const limitacoesSel = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoesSel.forEach(lim => {
                    porcentagem += parseInt(lim.dataset.custo) || 0;
                });
                break;
        }
        
        let custoFinal = custoBase;
        if (porcentagem !== 0) {
            custoFinal = Math.round(custoBase * (1 + (porcentagem / 100)));
        }
        
        const elementoCusto = document.getElementById('custoModalTotalDesvantagem');
        if (elementoCusto) {
            elementoCusto.textContent = `${custoFinal} pontos`;
        }
    }
    
    carregarConfiguracaoExistente(desvantagem) {
        if (!this.desvantagemEditando) return;
        
        const config = this.desvantagemEditando.dados.config;
        const modal = document.getElementById('modalDesvantagem');
        if (!modal) return;
        
        switch(desvantagem.tipo) {
            case 'niveis':
                const radioNivel = modal.querySelector(`input[name="nivel"][value="${config.nivel}"]`);
                if (radioNivel) radioNivel.checked = true;
                break;
                
            case 'opcoes':
                const radioOpcao = modal.querySelector(`input[name="opcao"][value="${config.opcao.id}"]`);
                if (radioOpcao) radioOpcao.checked = true;
                break;
                
            case 'niveis_com_limitações':
                const radioNivelCom = modal.querySelector(`input[name="nivel"][value="${config.nivel}"]`);
                if (radioNivelCom) radioNivelCom.checked = true;
                
                if (config.limitações) {
                    config.limitações.forEach(limitacao => {
                        const checkbox = modal.querySelector(`input[name="limitacao"][value="${limitacao.id}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                break;
                
            case 'opcoes_com_limitações':
                const radioOpcaoCom = modal.querySelector(`input[name="opcao"][value="${config.opcao.id}"]`);
                if (radioOpcaoCom) radioOpcaoCom.checked = true;
                
                if (config.limitações) {
                    config.limitações.forEach(limitacao => {
                        const checkbox = modal.querySelector(`input[name="limitacao"][value="${limitacao.id}"]`);
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
        
        const desvantagemAdquirida = {
            id: desvantagem.id,
            nome: config.nomeFinal,
            custo: config.custoFinal,
            dados: {
                config: config,
                descricao: desvantagem.descricao
            }
        };
        
        // Remover versão anterior se existir
        const desvantagemExistenteIndex = this.desvantagensAdquiridas.findIndex(d => d.id === desvantagem.id);
        
        if (desvantagemExistenteIndex !== -1) {
            // Se já existe, remover os pontos da antiga
            this.desvantagensAdquiridas.splice(desvantagemExistenteIndex, 1);
        }
        
        // Adicionar nova versão
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
        let custoFinal = desvantagem.custoBase;
        let config = { tipo: desvantagem.tipo };
        
        switch(desvantagem.tipo) {
            case 'niveis':
                const nivelInput = modal.querySelector('input[name="nivel"]:checked');
                if (!nivelInput) {
                    const primeiroRadio = modal.querySelector('input[name="nivel"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(desvantagem);
                }
                const nivel = parseInt(nivelInput.value);
                nomeFinal = `${desvantagem.nome} (Nível ${nivel})`;
                custoFinal = parseInt(nivelInput.dataset.custo) || desvantagem.custoBase;
                config.nivel = nivel;
                break;
                
            case 'opcoes':
                const opcaoInput = modal.querySelector('input[name="opcao"]:checked');
                if (!opcaoInput) {
                    const primeiroRadio = modal.querySelector('input[name="opcao"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(desvantagem);
                }
                const opcaoId = opcaoInput.value;
                const opcao = desvantagem.opcoes.find(o => o.id === opcaoId);
                if (!opcao) break;
                nomeFinal = `${desvantagem.nome} (${opcao.nome})`;
                custoFinal = opcao.custo;
                config.opcao = opcao;
                break;
                
            case 'niveis_com_limitações':
                const nivelSel = modal.querySelector('input[name="nivel"]:checked');
                if (!nivelSel) {
                    const primeiroRadio = modal.querySelector('input[name="nivel"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(desvantagem);
                }
                const nivelVal = parseInt(nivelSel.value);
                nomeFinal = `${desvantagem.nome} (Nível ${nivelVal})`;
                custoFinal = parseInt(nivelSel.dataset.custoBase) || desvantagem.custoBase;
                
                const limitacoes = [];
                const limitacoesInputs = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoesInputs.forEach(input => {
                    const limitacao = desvantagem.limitações.find(l => l.id === input.value);
                    if (limitacao) limitacoes.push(limitacao);
                });
                
                const porcentagem = limitacoes.reduce((sum, l) => sum + l.custo, 0);
                if (porcentagem !== 0) {
                    custoFinal = Math.round(custoFinal * (1 + (porcentagem / 100)));
                }
                
                config.nivel = nivelVal;
                config.limitações = limitacoes;
                break;
                
            case 'opcoes_com_limitações':
                const opcaoSel = modal.querySelector('input[name="opcao"]:checked');
                if (!opcaoSel) {
                    const primeiroRadio = modal.querySelector('input[name="opcao"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(desvantagem);
                }
                const opcaoIdSel = opcaoSel.value;
                const opcaoObj = desvantagem.opcoes.find(o => o.id === opcaoIdSel);
                if (!opcaoObj) break;
                nomeFinal = `${desvantagem.nome} (${opcaoObj.nome})`;
                custoFinal = opcaoObj.custo;
                
                const limitacoesSel = [];
                const limitacoesInputsSel = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoesInputsSel.forEach(input => {
                    const limitacao = desvantagem.limitações.find(l => l.id === input.value);
                    if (limitacao) limitacoesSel.push(limitacao);
                });
                
                const porcentagemSel = limitacoesSel.reduce((sum, l) => sum + l.custo, 0);
                if (porcentagemSel !== 0) {
                    custoFinal = Math.round(custoFinal * (1 + (porcentagemSel / 100)));
                }
                
                config.opcao = opcaoObj;
                config.limitações = limitacoesSel;
                break;
        }
        
        return { nomeFinal, custoFinal, config };
    }
    
    removerDesvantagem(id) {
        if (confirm('Remover esta desvantagem?')) {
            this.desvantagensAdquiridas = this.desvantagensAdquiridas.filter(d => d.id !== id);
            this.salvarLocalStorage();
            this.carregarCatalogo();
            this.carregarAdquiridas();
            this.atualizarResumo();
        }
    }
    
    mostrarDetalhes(desvantagem) {
        const modal = document.getElementById('modalDesvantagem');
        const titulo = document.getElementById('modalTituloDesvantagem');
        const corpo = document.getElementById('modalCorpoDesvantagem');
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) return;
        
        titulo.textContent = `Detalhes: ${desvantagem.nome}`;
        
        let html = `
            <div class="modal-descricao">
                <p>${desvantagem.descricao}</p>
            </div>
            <div class="modal-secao">
                <h4><i class="fas fa-info-circle"></i> Informações:</h4>
                <div style="padding: 0.5rem;">
                    <p><strong>Tipo:</strong> ${this.getTipoTexto(desvantagem.tipo)}</p>
                    <p><strong>Categoria:</strong> ${this.getCategoriaNome(desvantagem.categoria)}</p>
                    <p><strong>Custo Base:</strong> ${this.getCustoTexto(desvantagem)}</p>
                </div>
            </div>
        `;
        
        corpo.innerHTML = html;
        btnAdicionar.style.display = 'none';
        
        // Mostrar modal
        modal.classList.add('show');
        document.body.classList.add('modal-aberto');
        
        // Configurar botão de fechar para restaurar estado
        const fecharBtn = modal.querySelector('.modal-close');
        const fecharModalBtn = modal.querySelector('.fechar-modal');
        
        const restaurarEBtnAdicionar = () => {
            btnAdicionar.style.display = 'block';
        };
        
        if (fecharBtn) {
            fecharBtn.onclick = () => {
                restaurarEBtnAdicionar();
                this.fecharModal();
            };
        }
        
        if (fecharModalBtn) {
            fecharModalBtn.onclick = () => {
                restaurarEBtnAdicionar();
                this.fecharModal();
            };
        }
    }
    
    getCustoTexto(desvantagem) {
        switch(desvantagem.tipo) {
            case 'niveis':
            case 'niveis_com_limitações':
                return `${desvantagem.custoBase} pts/nível`;
            default:
                return `${desvantagem.custoBase} pts`;
        }
    }
    
    getCategoriaNome(categoria) {
        const map = {
            'fisicas': 'Física',
            'mentais': 'Mental',
            'sociais': 'Social',
            'exoticas': 'Exótica'
        };
        return map[categoria] || categoria;
    }
    
    getTipoTexto(tipo) {
        const map = {
            'simples': 'Simples',
            'niveis': 'Com Níveis',
            'opcoes': 'Com Opções',
            'niveis_com_limitações': 'Complexa',
            'opcoes_com_limitações': 'Complexa'
        };
        return map[tipo] || tipo;
    }
    
    atualizarResumo() {
        const total = this.desvantagensAdquiridas.length;
        const pontos = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
        
        // Atualizar o resumo na aba de desvantagens
        this.atualizarDisplayDesvantagens(total, pontos);
    }
    
    mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-desvantagem fundo-negativo';
        notificacao.innerHTML = `
            <div class="notificacao-conteudo">
                <i class="fas fa-exclamation-triangle texto-negativo"></i>
                <span class="texto-negativo">${mensagem}</span>
            </div>
        `;
        
        document.body.appendChild(notificacao);
        
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
        document.querySelectorAll('#subtab-desvantagens-catalogo .filtro-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#subtab-desvantagens-catalogo .filtro-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filtroAtual = btn.dataset.filtro;
                this.carregarCatalogo();
            });
        });
        
        // Busca
        const buscaInput = document.getElementById('buscarDesvantagem');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                this.buscaAtual = e.target.value;
                this.carregarCatalogo();
            });
        }
        
        // Limpar tudo
        const btnLimpar = document.getElementById('limparDesvantagens');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                if (this.desvantagensAdquiridas.length === 0) return;
                if (confirm('Remover todas as desvantagens?')) {
                    this.desvantagensAdquiridas = [];
                    this.salvarLocalStorage();
                    this.carregarCatalogo();
                    this.carregarAdquiridas();
                    this.atualizarResumo();
                }
            });
        }
        
        // Fechar modal
        const modalDesvantagem = document.getElementById('modalDesvantagem');
        if (modalDesvantagem) {
            modalDesvantagem.querySelectorAll('.modal-close, .fechar-modal').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.fecharModal();
                });
            });
            
            // Fechar modal ao clicar no fundo
            modalDesvantagem.addEventListener('click', (e) => {
                if (e.target === modalDesvantagem) {
                    this.fecharModal();
                }
            });
        }
    }
    
    fecharModal() {
        const modal = document.getElementById('modalDesvantagem');
        if (modal) {
            modal.classList.remove('show');
        }
        document.body.classList.remove('modal-aberto');
        this.desvantagemEditando = null;
        
        const btnAdicionar = document.getElementById('btnAdicionarDesvantagem');
        if (btnAdicionar) {
            btnAdicionar.style.display = 'block';
        }
    }
    
    salvarLocalStorage() {
        try {
            localStorage.setItem('desvantagensAdquiridas', JSON.stringify(this.desvantagensAdquiridas));
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
    }
    
    integrarComPontosManager() {
        // Quando o sistema de pontos for inicializado, notificar sobre as desvantagens existentes
        document.addEventListener('pontosManagerInicializado', () => {
            const pontosDesvantagens = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
            this.notificarPontosDesvantagens(pontosDesvantagens);
        });
        
        // Verificar se o pontosManager já está disponível
        if (window.obterPontosManager) {
            const pontosManager = window.obterPontosManager();
            if (pontosManager) {
                const pontosDesvantagens = this.desvantagensAdquiridas.reduce((sum, d) => sum + d.custo, 0);
                this.notificarPontosDesvantagens(pontosDesvantagens);
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.desvantagensManager = new DesvantagensManager();
});

// Exportar funções para integração
window.atualizarPontosDesvantagens = function(pontos) {
    const elemento = document.getElementById('pontosDesvantagens');
    if (elemento) elemento.textContent = Math.abs(pontos);
};

// Evento para quando o sistema de desvantagens é atualizado
window.atualizarDesvantagensDoSistema = function() {
    if (window.desvantagensManager) {
        window.desvantagensManager.carregarAdquiridas();
        window.desvantagensManager.atualizarResumo();
    }
};