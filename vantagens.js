// vantagens.js - VERSÃO COMPLETA COM INTEGRAÇÃO DE PONTOS
class VantagensManager {
    constructor() {
        this.vantagensAdquiridas = JSON.parse(localStorage.getItem('vantagensAdquiridas')) || [];
        this.catalogo = vantagensCatalogo;
        this.filtroAtual = 'todas';
        this.buscaAtual = '';
        this.vantagemEditando = null;
        
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
        const container = document.getElementById('listaCatalogoVantagens');
        if (!container) return;
        
        let vantagensFiltradas = this.catalogo;
        
        if (this.filtroAtual !== 'todas') {
            vantagensFiltradas = vantagensFiltradas.filter(v => v.categoria === this.filtroAtual);
        }
        
        if (this.buscaAtual) {
            const busca = this.buscaAtual.toLowerCase();
            vantagensFiltradas = vantagensFiltradas.filter(v => 
                v.nome.toLowerCase().includes(busca) || 
                v.descricao.toLowerCase().includes(busca)
            );
        }
        
        if (vantagensFiltradas.length === 0) {
            container.innerHTML = `
                <div class="lista-vazia">
                    <i class="fas fa-search"></i>
                    <p>Nenhuma vantagem encontrada</p>
                    <small>Tente outro filtro ou termo de busca</small>
                </div>
            `;
            document.getElementById('contadorVantagens').textContent = '0';
            return;
        }
        
        let html = '';
        
        vantagensFiltradas.forEach(vantagem => {
            const jaAdquirida = this.vantagensAdquiridas.some(v => v.id === vantagem.id);
            const custoTexto = this.getCustoTexto(vantagem);
            const tipoTexto = this.getTipoTexto(vantagem.tipo);
            
            html += `
                <div class="vantagem-item ${jaAdquirida ? 'adquirida' : ''}" data-id="${vantagem.id}">
                    <div class="vantagem-header">
                        <h4>${vantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo">${custoTexto}</span>
                            <span class="vantagem-categoria">${this.getCategoriaNome(vantagem.categoria)}</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${vantagem.descricao}</p>
                    
                    <div class="vantagem-footer">
                        <span class="vantagem-tipo">${tipoTexto}</span>
                        
                        ${jaAdquirida ? 
                            `<div class="vantagem-adquirida-acoes">
                                <button class="btn-editar" title="Editar configuração">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-excluir" title="Remover vantagem">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>` : 
                            `<button class="btn-vantagem btn-adicionar">
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
            const vantagem = this.catalogo.find(v => v.id === id);
            if (!vantagem) return;
            
            // Clique no item para mostrar detalhes
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-editar') && 
                    !e.target.closest('.btn-excluir') && 
                    !e.target.closest('.btn-adicionar')) {
                    this.mostrarDetalhes(vantagem);
                }
            });
            
            // Botão Adicionar
            const btnAdicionar = item.querySelector('.btn-adicionar');
            if (btnAdicionar) {
                btnAdicionar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.abrirModalVantagem(vantagem);
                });
            }
            
            // Botão Editar
            const btnEditar = item.querySelector('.btn-editar');
            if (btnEditar) {
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.abrirModalVantagem(vantagem, true);
                });
            }
            
            // Botão Excluir
            const btnExcluir = item.querySelector('.btn-excluir');
            if (btnExcluir) {
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removerVantagem(id);
                });
            }
        });
        
        document.getElementById('contadorVantagens').textContent = vantagensFiltradas.length;
    }
    
    carregarAdquiridas() {
        const container = document.getElementById('listaVantagensAdquiridas');
        if (!container) return;
        
        if (this.vantagensAdquiridas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <p>Nenhuma vantagem</p>
                    <small>Clique no catálogo</small>
                </div>
            `;
            this.atualizarDisplayVantagens(0, 0);
            return;
        }
        
        let html = '';
        
        this.vantagensAdquiridas.forEach(vantagem => {
            const original = this.catalogo.find(v => v.id === vantagem.id);
            const descricao = original ? original.descricao : '';
            
            html += `
                <div class="vantagem-item adquirida" data-id="${vantagem.id}">
                    <div class="vantagem-header">
                        <h4>${vantagem.nome}</h4>
                        <div class="vantagem-badges">
                            <span class="vantagem-custo">+${vantagem.custo} pts</span>
                        </div>
                    </div>
                    
                    <p class="vantagem-descricao">${descricao.substring(0, 120)}${descricao.length > 120 ? '...' : ''}</p>
                    
                    <div class="vantagem-footer">
                        <div class="vantagem-adquirida-acoes">
                            <button class="btn-editar" title="Editar configuração">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-excluir" title="Remover vantagem">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos para vantagens adquiridas
        container.querySelectorAll('.vantagem-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const btnEditar = item.querySelector('.btn-editar');
            const btnExcluir = item.querySelector('.btn-excluir');
            const original = this.catalogo.find(v => v.id === id);
            
            if (btnEditar) {
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (original) this.abrirModalVantagem(original, true);
                });
            }
            
            if (btnExcluir) {
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removerVantagem(id);
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
        
        this.atualizarDisplayVantagens();
    }
    
    atualizarDisplayVantagens(total = null, pontos = null) {
        if (total === null) total = this.vantagensAdquiridas.length;
        if (pontos === null) pontos = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
        
        document.getElementById('totalVantagensAdquiridas').textContent = total;
        document.getElementById('pontosVantagensAdquiridas').textContent = `${pontos} pts`;
        
        // Atualizar resumo na aba principal
        this.atualizarResumoNaAbaPrincipal(pontos);
        
        // Notificar o sistema de pontos
        this.notificarPontosVantagens(pontos);
    }
    
    atualizarResumoNaAbaPrincipal(pontosVantagens) {
        const elemento = document.getElementById('pontosVantagens');
        if (elemento) elemento.textContent = pontosVantagens;
    }
    
    notificarPontosVantagens(pontosVantagens) {
        // Disparar evento para o sistema de pontos
        const evento = new CustomEvent('vantagensAtualizadas', {
            detail: {
                pontos: pontosVantagens,
                tipo: 'catalogo'
            }
        });
        document.dispatchEvent(evento);
    }
    
    abrirModalVantagem(vantagem, editando = false) {
        this.vantagemEditando = editando ? this.vantagensAdquiridas.find(v => v.id === vantagem.id) : null;
        const titulo = document.getElementById('modalTitulo');
        const corpo = document.getElementById('modalCorpo');
        const btnAdicionar = document.getElementById('btnAdicionarModal');
        const modal = document.getElementById('modalVantagem');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) {
            console.error('Elementos do modal não encontrados');
            return;
        }
        
        titulo.textContent = vantagem.nome;
        btnAdicionar.textContent = this.vantagemEditando ? 'Atualizar' : 'Adicionar';
        btnAdicionar.style.display = 'block';
        
        switch(vantagem.tipo) {
            case 'simples':
                corpo.innerHTML = this.criarModalSimples(vantagem);
                break;
            case 'niveis':
                corpo.innerHTML = this.criarModalNiveis(vantagem);
                break;
            case 'opcoes':
                corpo.innerHTML = this.criarModalOpcoes(vantagem);
                break;
            case 'niveis_com_limitações':
                corpo.innerHTML = this.criarModalNiveisLimitacoes(vantagem);
                break;
            case 'opcoes_com_limitações':
                corpo.innerHTML = this.criarModalOpcoesLimitacoes(vantagem);
                break;
            default:
                corpo.innerHTML = this.criarModalSimples(vantagem);
        }
        
        this.configurarEventosModal(vantagem);
        
        if (this.vantagemEditando) {
            this.carregarConfiguracaoExistente(vantagem);
        }
        
        // USAR CLASSE .show PARA MOSTRAR O MODAL
        modal.classList.add('show');
        document.body.classList.add('modal-aberto');
        
        // Garantir que o primeiro radio button esteja selecionado
        setTimeout(() => {
            const primeiroRadio = modal.querySelector('input[type="radio"]');
            if (primeiroRadio && !modal.querySelector('input[type="radio"]:checked')) {
                primeiroRadio.checked = true;
                this.atualizarCustoModal(vantagem);
            }
        }, 10);
    }
    
    criarModalSimples(vantagem) {
        return `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor" id="custoModalTotal">${vantagem.custoBase} pontos</div>
            </div>
            <input type="hidden" id="configCusto" value="${vantagem.custoBase}">
        `;
    }
    
    criarModalNiveis(vantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-layer-group"></i> Selecione o nível:</h4><div class="opcoes-lista">';
        
        for (let i = 1; i <= vantagem.niveisMaximo; i++) {
            const custo = vantagem.custoBase * i;
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="nivel" value="${i}" data-custo="${custo}" ${i === 1 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">Nível ${i}</span>
                        <span class="opcao-custo">${custo} pts</span>
                    </div>
                </label>
            `;
        }
        
        opcoesHTML += '</div></div>';
        
        return `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor" id="custoModalTotal">${vantagem.custoBase} pontos</div>
            </div>
        `;
    }
    
    criarModalOpcoes(vantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-list"></i> Selecione a opção:</h4><div class="opcoes-lista">';
        
        vantagem.opcoes.forEach((opcao, index) => {
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="opcao" value="${opcao.id}" data-custo="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${opcao.nome}</span>
                        <span class="opcao-custo">${opcao.custo} pts</span>
                    </div>
                </label>
            `;
        });
        
        opcoesHTML += '</div></div>';
        
        return `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor" id="custoModalTotal">${vantagem.opcoes[0].custo} pontos</div>
            </div>
        `;
    }
    
    criarModalNiveisLimitacoes(vantagem) {
        let niveisHTML = '<div class="modal-secao"><h4><i class="fas fa-layer-group"></i> Nível de Aptidão:</h4><div class="opcoes-lista">';
        
        for (let i = 0; i <= vantagem.niveisMaximo; i++) {
            const custo = vantagem.custoBase + (i * 10);
            niveisHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="nivel" value="${i}" data-custo-base="${custo}" ${i === 0 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">Nível ${i}</span>
                        <span class="opcao-custo">${custo} pts</span>
                    </div>
                </label>
            `;
        }
        
        niveisHTML += '</div></div>';
        
        let limitacoesHTML = '<div class="modal-secao"><h4><i class="fas fa-exclamation-triangle"></i> Limitações (opcional):</h4><div class="limitacoes-lista">';
        
        vantagem.limitações.forEach(limitacao => {
            limitacoesHTML += `
                <label class="opcao-checkbox">
                    <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${limitacao.nome}</span>
                        <span class="opcao-custo">${limitacao.custo}%</span>
                        <small class="opcao-descricao">${limitacao.descricao}</small>
                    </div>
                </label>
            `;
        });
        
        limitacoesHTML += '</div><p class="info-limitacoes"><small>As limitações reduzem o custo em percentual</small></p></div>';
        
        return `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            ${niveisHTML}
            ${limitacoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor" id="custoModalTotal">${vantagem.custoBase} pontos</div>
            </div>
        `;
    }
    
    criarModalOpcoesLimitacoes(vantagem) {
        let opcoesHTML = '<div class="modal-secao"><h4><i class="fas fa-clover"></i> Tipo de Sorte:</h4><div class="opcoes-lista">';
        
        vantagem.opcoes.forEach((opcao, index) => {
            opcoesHTML += `
                <label class="opcao-radio">
                    <input type="radio" name="opcao" value="${opcao.id}" data-custo-base="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${opcao.nome}</span>
                        <span class="opcao-custo">${opcao.custo} pts</span>
                        <small class="opcao-descricao">Intervalo: ${opcao.intervalo}</small>
                    </div>
                </label>
            `;
        });
        
        opcoesHTML += '</div></div>';
        
        let limitacoesHTML = '<div class="modal-secao"><h4><i class="fas fa-exclamation-triangle"></i> Limitações (opcional):</h4><div class="limitacoes-lista">';
        
        vantagem.limitações.forEach(limitacao => {
            limitacoesHTML += `
                <label class="opcao-checkbox">
                    <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
                    <div class="opcao-conteudo">
                        <span class="opcao-nome">${limitacao.nome}</span>
                        <span class="opcao-custo">${limitacao.custo}%</span>
                        <small class="opcao-descricao">${limitacao.descricao}</small>
                    </div>
                </label>
            `;
        });
        
        limitacoesHTML += '</div></div>';
        
        return `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            ${opcoesHTML}
            ${limitacoesHTML}
            <div class="custo-total">
                <h4>Custo Total:</h4>
                <div class="custo-total-valor" id="custoModalTotal">${vantagem.opcoes[0].custo} pontos</div>
            </div>
        `;
    }
    
    configurarEventosModal(vantagem) {
        const btnAdicionar = document.getElementById('btnAdicionarModal');
        if (btnAdicionar) {
            btnAdicionar.onclick = () => this.salvarVantagem(vantagem);
        }
        
        // Configurar eventos para todos os inputs
        setTimeout(() => {
            const inputs = document.querySelectorAll('#modalVantagem input');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.atualizarCustoModal(vantagem);
                });
            });
            
            // Atualizar custo inicial
            this.atualizarCustoModal(vantagem);
        }, 10);
    }
    
    atualizarCustoModal(vantagem) {
        let custoBase = vantagem.custoBase;
        let porcentagem = 0;
        
        const modal = document.getElementById('modalVantagem');
        if (!modal) return;
        
        switch(vantagem.tipo) {
            case 'niveis':
                const nivelInput = modal.querySelector('input[name="nivel"]:checked');
                if (nivelInput) {
                    custoBase = parseInt(nivelInput.dataset.custo) || vantagem.custoBase;
                }
                break;
                
            case 'opcoes':
                const opcaoInput = modal.querySelector('input[name="opcao"]:checked');
                if (opcaoInput) {
                    custoBase = parseInt(opcaoInput.dataset.custo) || vantagem.custoBase;
                }
                break;
                
            case 'niveis_com_limitações':
                const nivelSel = modal.querySelector('input[name="nivel"]:checked');
                if (nivelSel) {
                    custoBase = parseInt(nivelSel.dataset.custoBase) || vantagem.custoBase;
                }
                
                const limitacoes = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoes.forEach(lim => {
                    porcentagem += parseInt(lim.dataset.custo) || 0;
                });
                break;
                
            case 'opcoes_com_limitações':
                const opcaoSel = modal.querySelector('input[name="opcao"]:checked');
                if (opcaoSel) {
                    custoBase = parseInt(opcaoSel.dataset.custoBase) || vantagem.custoBase;
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
        
        const elementoCusto = document.getElementById('custoModalTotal');
        if (elementoCusto) {
            elementoCusto.textContent = `${custoFinal} pontos`;
        }
    }
    
    carregarConfiguracaoExistente(vantagem) {
        if (!this.vantagemEditando) return;
        
        const config = this.vantagemEditando.dados.config;
        const modal = document.getElementById('modalVantagem');
        if (!modal) return;
        
        switch(vantagem.tipo) {
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
        
        this.atualizarCustoModal(vantagem);
    }
    
    salvarVantagem(vantagem) {
        const config = this.coletarConfiguracoes(vantagem);
        
        if (!config) {
            alert('Por favor, selecione uma opção antes de salvar.');
            return;
        }
        
        const vantagemAdquirida = {
            id: vantagem.id,
            nome: config.nomeFinal,
            custo: config.custoFinal,
            dados: {
                config: config,
                descricao: vantagem.descricao
            }
        };
        
        // Remover versão anterior se existir
        const vantagemExistenteIndex = this.vantagensAdquiridas.findIndex(v => v.id === vantagem.id);
        
        if (vantagemExistenteIndex !== -1) {
            // Se já existe, remover os pontos da antiga
            this.vantagensAdquiridas.splice(vantagemExistenteIndex, 1);
        }
        
        // Adicionar nova versão
        this.vantagensAdquiridas.push(vantagemAdquirida);
        
        this.salvarLocalStorage();
        this.carregarCatalogo();
        this.carregarAdquiridas();
        this.atualizarResumo();
        this.fecharModal();
        
        this.mostrarNotificacao(`${vantagemAdquirida.nome} adicionada por ${vantagemAdquirida.custo} pontos`);
    }
    
    coletarConfiguracoes(vantagem) {
        const modal = document.getElementById('modalVantagem');
        if (!modal) return null;
        
        let nomeFinal = vantagem.nome;
        let custoFinal = vantagem.custoBase;
        let config = { tipo: vantagem.tipo };
        
        switch(vantagem.tipo) {
            case 'niveis':
                const nivelInput = modal.querySelector('input[name="nivel"]:checked');
                if (!nivelInput) {
                    const primeiroRadio = modal.querySelector('input[name="nivel"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(vantagem);
                }
                const nivel = parseInt(nivelInput.value);
                nomeFinal = `${vantagem.nome} (Nível ${nivel})`;
                custoFinal = parseInt(nivelInput.dataset.custo) || vantagem.custoBase;
                config.nivel = nivel;
                break;
                
            case 'opcoes':
                const opcaoInput = modal.querySelector('input[name="opcao"]:checked');
                if (!opcaoInput) {
                    const primeiroRadio = modal.querySelector('input[name="opcao"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(vantagem);
                }
                const opcaoId = opcaoInput.value;
                const opcao = vantagem.opcoes.find(o => o.id === opcaoId);
                if (!opcao) break;
                nomeFinal = `${vantagem.nome} (${opcao.nome})`;
                custoFinal = opcao.custo;
                config.opcao = opcao;
                break;
                
            case 'niveis_com_limitações':
                const nivelSel = modal.querySelector('input[name="nivel"]:checked');
                if (!nivelSel) {
                    const primeiroRadio = modal.querySelector('input[name="nivel"]');
                    if (primeiroRadio) primeiroRadio.checked = true;
                    return this.coletarConfiguracoes(vantagem);
                }
                const nivelVal = parseInt(nivelSel.value);
                nomeFinal = `${vantagem.nome} (Nível ${nivelVal})`;
                custoFinal = parseInt(nivelSel.dataset.custoBase) || vantagem.custoBase;
                
                const limitacoes = [];
                const limitacoesInputs = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoesInputs.forEach(input => {
                    const limitacao = vantagem.limitações.find(l => l.id === input.value);
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
                    return this.coletarConfiguracoes(vantagem);
                }
                const opcaoIdSel = opcaoSel.value;
                const opcaoObj = vantagem.opcoes.find(o => o.id === opcaoIdSel);
                if (!opcaoObj) break;
                nomeFinal = `${vantagem.nome} (${opcaoObj.nome})`;
                custoFinal = opcaoObj.custo;
                
                const limitacoesSel = [];
                const limitacoesInputsSel = modal.querySelectorAll('input[name="limitacao"]:checked');
                limitacoesInputsSel.forEach(input => {
                    const limitacao = vantagem.limitações.find(l => l.id === input.value);
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
    
    removerVantagem(id) {
        if (confirm('Remover esta vantagem?')) {
            this.vantagensAdquiridas = this.vantagensAdquiridas.filter(v => v.id !== id);
            this.salvarLocalStorage();
            this.carregarCatalogo();
            this.carregarAdquiridas();
            this.atualizarResumo();
        }
    }
    
    mostrarDetalhes(vantagem) {
        const modal = document.getElementById('modalVantagem');
        const titulo = document.getElementById('modalTitulo');
        const corpo = document.getElementById('modalCorpo');
        const btnAdicionar = document.getElementById('btnAdicionarModal');
        
        if (!modal || !titulo || !corpo || !btnAdicionar) return;
        
        titulo.textContent = `Detalhes: ${vantagem.nome}`;
        
        let html = `
            <div class="modal-descricao">
                <p>${vantagem.descricao}</p>
            </div>
            <div class="modal-secao">
                <h4><i class="fas fa-info-circle"></i> Informações:</h4>
                <div style="padding: 0.5rem;">
                    <p><strong>Tipo:</strong> ${this.getTipoTexto(vantagem.tipo)}</p>
                    <p><strong>Categoria:</strong> ${this.getCategoriaNome(vantagem.categoria)}</p>
                    <p><strong>Custo Base:</strong> ${this.getCustoTexto(vantagem)}</p>
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
    
    getCustoTexto(vantagem) {
        switch(vantagem.tipo) {
            case 'niveis':
            case 'niveis_com_limitações':
                return `${vantagem.custoBase} pts/nível`;
            default:
                return `${vantagem.custoBase} pts`;
        }
    }
    
    getCategoriaNome(categoria) {
        const map = {
            'fisicas': 'Física',
            'mental-sobrenatural': 'Mental/Sobrenatural',
            'supers': 'Supers',
            'social': 'Social'
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
        const total = this.vantagensAdquiridas.length;
        const pontos = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
        
        // Atualizar o resumo na aba de vantagens
        const elementosResumo = {
            'totalVantagensPontos': pontos,
            'saldoVantagens': pontos
        };
        
        Object.keys(elementosResumo).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elementosResumo[id];
        });
        
        // Atualizar display das vantagens adquiridas
        this.atualizarDisplayVantagens(total, pontos);
    }
    
    mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-vantagem';
        notificacao.innerHTML = `
            <div class="notificacao-conteudo">
                <i class="fas fa-check-circle"></i>
                <span>${mensagem}</span>
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
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filtroAtual = btn.dataset.filtro;
                this.carregarCatalogo();
            });
        });
        
        // Busca
        const buscaInput = document.getElementById('buscarVantagem');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                this.buscaAtual = e.target.value;
                this.carregarCatalogo();
            });
        }
        
        // Limpar tudo
        const btnLimpar = document.getElementById('limparVantagens');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                if (this.vantagensAdquiridas.length === 0) return;
                if (confirm('Remover todas as vantagens?')) {
                    this.vantagensAdquiridas = [];
                    this.salvarLocalStorage();
                    this.carregarCatalogo();
                    this.carregarAdquiridas();
                    this.atualizarResumo();
                }
            });
        }
        
        // Fechar modal
        document.querySelectorAll('.modal-close, .fechar-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.fecharModal();
            });
        });
        
        // Fechar modal ao clicar no fundo
        const modal = document.getElementById('modalVantagem');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal();
                }
            });
        }
    }
    
    fecharModal() {
        const modal = document.getElementById('modalVantagem');
        if (modal) {
            modal.classList.remove('show');
        }
        document.body.classList.remove('modal-aberto');
        this.vantagemEditando = null;
        
        const btnAdicionar = document.getElementById('btnAdicionarModal');
        if (btnAdicionar) {
            btnAdicionar.style.display = 'block';
        }
    }
    
    salvarLocalStorage() {
        try {
            localStorage.setItem('vantagensAdquiridas', JSON.stringify(this.vantagensAdquiridas));
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
    }
    
    integrarComPontosManager() {
        // Quando o sistema de pontos for inicializado, notificar sobre as vantagens existentes
        document.addEventListener('pontosManagerInicializado', () => {
            const pontosVantagens = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
            this.notificarPontosVantagens(pontosVantagens);
        });
        
        // Verificar se o pontosManager já está disponível
        if (window.obterPontosManager) {
            const pontosManager = window.obterPontosManager();
            if (pontosManager) {
                const pontosVantagens = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
                this.notificarPontosVantagens(pontosVantagens);
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.vantagensManager = new VantagensManager();
});

// Exportar funções para integração
window.atualizarPontosVantagens = function(pontos) {
    const elemento = document.getElementById('pontosVantagens');
    if (elemento) elemento.textContent = pontos;
};

// Evento para quando o sistema de vantagens é atualizado
window.atualizarVantagensDoSistema = function() {
    if (window.vantagensManager) {
        window.vantagensManager.carregarAdquiridas();
        window.vantagensManager.atualizarResumo();
    }
};