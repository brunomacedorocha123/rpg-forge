// vantagens.js - VERSÃO COMPLETAMENTE REFORMULADA
class VantagensManager {
  constructor() {
    this.vantagensAdquiridas = JSON.parse(localStorage.getItem('vantagensAdquiridas')) || [];
    this.catalogo = vantagensCatalogo;
    this.filtroAtual = 'todas';
    this.buscaAtual = '';
    this.vantagemSelecionada = null;
    
    this.init();
  }
  
  init() {
    this.carregarCatalogo();
    this.carregarAdquiridas();
    this.setupEventListeners();
    this.atualizarContadores();
    this.atualizarPontosGlobais();
  }
  
  carregarCatalogo() {
    const container = document.getElementById('listaCatalogoVantagens');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Filtrar vantagens
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
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <p>Nenhuma vantagem encontrada</p>
          <small>Tente mudar o filtro ou termo de busca</small>
        </div>
      `;
      return;
    }
    
    vantagensFiltradas.forEach(vantagem => {
      const card = this.criarCardCatalogo(vantagem);
      container.appendChild(card);
    });
    
    document.getElementById('contadorVantagens').textContent = vantagensFiltradas.length;
  }
  
  criarCardCatalogo(vantagem) {
    const card = document.createElement('div');
    card.className = 'vantagem-card';
    card.dataset.id = vantagem.id;
    
    // Verificar se já foi adquirida
    const jaAdquirida = this.vantagensAdquiridas.some(v => v.id === vantagem.id);
    
    let custoTexto = `+${vantagem.custoBase} pts`;
    if (vantagem.tipo === 'niveis' || vantagem.tipo === 'niveis_com_limitações') {
      custoTexto = `+${vantagem.custoBase} pts/nível`;
    }
    
    card.innerHTML = `
      <div class="card-header">
        <h4>${vantagem.nome}</h4>
        <span class="custo">${custoTexto}</span>
      </div>
      <div class="card-body">
        <p>${vantagem.descricao.substring(0, 100)}${vantagem.descricao.length > 100 ? '...' : ''}</p>
      </div>
      <div class="card-footer">
        <span class="categoria">${this.getCategoriaNome(vantagem.categoria)}</span>
        <button class="btn-adicionar">
          ${jaAdquirida ? '<i class="fas fa-check"></i>' : '<i class="fas fa-plus"></i>'}
        </button>
      </div>
    `;
    
    // Evento de clique no card inteiro
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-adicionar')) {
        this.selecionarVantagem(vantagem);
      }
    });
    
    // Evento no botão adicionar
    const btnAdicionar = card.querySelector('.btn-adicionar');
    btnAdicionar.addEventListener('click', (e) => {
      e.stopPropagation();
      if (jaAdquirida) {
        this.removerVantagem(vantagem.id);
      } else {
        this.selecionarVantagem(vantagem);
      }
    });
    
    if (jaAdquirida) {
      card.classList.add('adquirida');
    }
    
    return card;
  }
  
  selecionarVantagem(vantagem) {
    this.vantagemSelecionada = vantagem;
    this.abrirModalVantagem(vantagem);
  }
  
  abrirModalVantagem(vantagem) {
    const modal = document.getElementById('modalVantagem');
    const titulo = document.getElementById('modalTitulo');
    const corpo = document.getElementById('modalCorpo');
    const btnAdicionar = document.getElementById('btnAdicionarModal');
    
    titulo.textContent = vantagem.nome;
    
    let html = `
      <div class="vantagem-modal-content">
        <div class="descricao">
          <p>${vantagem.descricao}</p>
        </div>
    `;
    
    // Configurar conteúdo baseado no tipo
    switch(vantagem.tipo) {
      case 'simples':
        html += this.criarModalSimples(vantagem);
        break;
        
      case 'niveis':
        html += this.criarModalNiveis(vantagem);
        break;
        
      case 'opcoes':
        html += this.criarModalOpcoes(vantagem);
        break;
        
      case 'niveis_com_limitações':
        html += this.criarModalNiveisComLimitacoes(vantagem);
        break;
        
      case 'opcoes_com_limitações':
        html += this.criarModalOpcoesComLimitacoes(vantagem);
        break;
    }
    
    html += `
        <div class="custo-total">
          <h4>Custo Total: <span id="custoModalTotal">${vantagem.custoBase}</span> pontos</h4>
        </div>
      </div>
    `;
    
    corpo.innerHTML = html;
    
    // Configurar eventos de mudança
    this.configurarEventosModal(vantagem);
    
    // Configurar botão adicionar
    btnAdicionar.onclick = () => this.adicionarVantagemConfigurada(vantagem);
    
    modal.style.display = 'block';
  }
  
  criarModalSimples(vantagem) {
    return `
      <div class="configuracao">
        <div class="info-custo">
          <p><strong>Custo:</strong> ${vantagem.custoBase} pontos</p>
        </div>
        <input type="hidden" id="configCusto" value="${vantagem.custoBase}">
      </div>
    `;
  }
  
  criarModalNiveis(vantagem) {
    let opcoesHTML = '<div class="opcoes-niveis">';
    
    for (let i = 1; i <= vantagem.niveisMaximo; i++) {
      const custo = vantagem.custoBase * i;
      opcoesHTML += `
        <label class="opcao-item ${i === 1 ? 'selecionada' : ''}">
          <input type="radio" name="nivel" value="${i}" data-custo="${custo}" ${i === 1 ? 'checked' : ''}>
          <strong>${vantagem.descricaoNiveis[i-1]}</strong>
        </label>
      `;
    }
    
    opcoesHTML += '</div>';
    
    return opcoesHTML;
  }
  
  criarModalOpcoes(vantagem) {
    let opcoesHTML = '<div class="opcoes-grid">';
    
    vantagem.opcoes.forEach((opcao, index) => {
      opcoesHTML += `
        <label class="opcao-item ${index === 0 ? 'selecionada' : ''}">
          <input type="radio" name="opcao" value="${opcao.id}" data-custo="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
          <strong>${opcao.nome}</strong>
          <div class="custo-opcao">${opcao.custo} pontos</div>
        </label>
      `;
    });
    
    opcoesHTML += '</div>';
    
    return opcoesHTML;
  }
  
  criarModalNiveisComLimitacoes(vantagem) {
    let html = `
      <div class="configuracao-complexa">
        <div class="secao">
          <h4>Escolha o nível:</h4>
          <div class="opcoes-niveis">
    `;
    
    for (let i = 0; i <= vantagem.niveisMaximo; i++) {
      const custo = vantagem.custoBase + (i * 10); // 5, 15, 25, 35
      html += `
        <label class="opcao-item ${i === 0 ? 'selecionada' : ''}">
          <input type="radio" name="nivel" value="${i}" data-custo-base="${custo}" ${i === 0 ? 'checked' : ''}>
          <strong>${vantagem.descricaoNiveis[i]}</strong>
        </label>
      `;
    }
    
    html += `
          </div>
        </div>
        <div class="secao">
          <h4>Limitações (opcional):</h4>
          <div class="limitacoes-grid">
    `;
    
    vantagem.limitações.forEach(limitacao => {
      html += `
        <label class="limitacao-item">
          <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
          <strong>${limitacao.nome} (${limitacao.custo}%)</strong>
          <small>${limitacao.descricao}</small>
        </label>
      `;
    });
    
    html += `
          </div>
          <p class="info"><small>As limitações reduzem o custo em percentual. Selecione conforme necessário.</small></p>
        </div>
      </div>
    `;
    
    return html;
  }
  
  criarModalOpcoesComLimitacoes(vantagem) {
    let html = `
      <div class="configuracao-complexa">
        <div class="secao">
          <h4>Escolha o tipo de sorte:</h4>
          <div class="opcoes-grid">
    `;
    
    vantagem.opcoes.forEach((opcao, index) => {
      html += `
        <label class="opcao-item ${index === 0 ? 'selecionada' : ''}">
          <input type="radio" name="opcao" value="${opcao.id}" data-custo-base="${opcao.custo}" ${index === 0 ? 'checked' : ''}>
          <strong>${opcao.nome}</strong>
          <small>${opcao.intervalo}</small>
          <div class="custo-opcao">${opcao.custo} pontos</div>
        </label>
      `;
    });
    
    html += `
          </div>
        </div>
        <div class="secao">
          <h4>Limitações (opcional):</h4>
          <div class="limitacoes-grid">
    `;
    
    vantagem.limitações.forEach(limitacao => {
      html += `
        <label class="limitacao-item">
          <input type="checkbox" name="limitacao" value="${limitacao.id}" data-custo="${limitacao.custo}">
          <strong>${limitacao.nome} (${limitacao.custo}%)</strong>
          <small>${limitacao.descricao}</small>
        </label>
      `;
    });
    
    html += `
          </div>
        </div>
      </div>
    `;
    
    return html;
  }
  
  configurarEventosModal(vantagem) {
    const atualizarCusto = () => {
      let custoBase = vantagem.custoBase;
      let porcentagem = 0;
      
      // Verificar seleção baseada no tipo
      switch(vantagem.tipo) {
        case 'niveis':
          const nivelSelecionado = document.querySelector('input[name="nivel"]:checked');
          custoBase = parseInt(nivelSelecionado.dataset.custo);
          break;
          
        case 'opcoes':
          const opcaoSelecionada = document.querySelector('input[name="opcao"]:checked');
          custoBase = parseInt(opcaoSelecionada.dataset.custo);
          break;
          
        case 'niveis_com_limitações':
          const nivelSel = document.querySelector('input[name="nivel"]:checked');
          custoBase = parseInt(nivelSel.dataset.custoBase);
          
          // Calcular porcentagem das limitações
          const limitacoesSelecionadas = document.querySelectorAll('input[name="limitacao"]:checked');
          limitacoesSelecionadas.forEach(lim => {
            porcentagem += parseInt(lim.dataset.custo);
          });
          break;
          
        case 'opcoes_com_limitações':
          const opcaoSel = document.querySelector('input[name="opcao"]:checked');
          custoBase = parseInt(opcaoSel.dataset.custoBase);
          
          const limitacoesSel = document.querySelectorAll('input[name="limitacao"]:checked');
          limitacoesSel.forEach(lim => {
            porcentagem += parseInt(lim.dataset.custo);
          });
          break;
      }
      
      // Calcular custo final com porcentagem
      let custoFinal = custoBase;
      if (porcentagem !== 0) {
        custoFinal = Math.round(custoBase * (1 + (porcentagem / 100)));
      }
      
      document.getElementById('custoModalTotal').textContent = custoFinal;
    };
    
    // Adicionar eventos a todos os inputs
    const inputs = document.querySelectorAll('#modalVantagem input');
    inputs.forEach(input => {
      input.addEventListener('change', atualizarCusto);
    });
    
    // Atualizar custo inicial
    atualizarCusto();
  }
  
  adicionarVantagemConfigurada(vantagem) {
    let nomeFinal = vantagem.nome;
    let custoFinal = vantagem.custoBase;
    let config = {};
    
    // Coletar configuração baseada no tipo
    switch(vantagem.tipo) {
      case 'simples':
        config.tipo = 'simples';
        break;
        
      case 'niveis':
        const nivelSelecionado = document.querySelector('input[name="nivel"]:checked');
        const nivel = parseInt(nivelSelecionado.value);
        nomeFinal = `${vantagem.nome} (Nível ${nivel})`;
        custoFinal = parseInt(nivelSelecionado.dataset.custo);
        config.tipo = 'niveis';
        config.nivel = nivel;
        break;
        
      case 'opcoes':
        const opcaoSelecionada = document.querySelector('input[name="opcao"]:checked');
        const opcaoId = opcaoSelecionada.value;
        const opcao = vantagem.opcoes.find(o => o.id === opcaoId);
        nomeFinal = `${vantagem.nome} (${opcao.nome})`;
        custoFinal = opcao.custo;
        config.tipo = 'opcoes';
        config.opcao = opcao;
        break;
        
      case 'niveis_com_limitações':
        const nivelSel = document.querySelector('input[name="nivel"]:checked');
        const nivelVal = parseInt(nivelSel.value);
        nomeFinal = `${vantagem.nome} (Nível ${nivelVal})`;
        custoFinal = parseInt(nivelSel.dataset.custoBase);
        
        // Processar limitações
        const limitacoesSelecionadas = document.querySelectorAll('input[name="limitacao"]:checked');
        const limitacoes = [];
        let porcentagem = 0;
        
        limitacoesSelecionadas.forEach(lim => {
          const limitacao = vantagem.limitações.find(l => l.id === lim.value);
          limitacoes.push(limitacao);
          porcentagem += limitacao.custo;
        });
        
        if (porcentagem !== 0) {
          custoFinal = Math.round(custoFinal * (1 + (porcentagem / 100)));
        }
        
        config.tipo = 'niveis_com_limitações';
        config.nivel = nivelVal;
        config.limitações = limitacoes;
        config.porcentagem = porcentagem;
        break;
        
      case 'opcoes_com_limitações':
        const opcaoSel = document.querySelector('input[name="opcao"]:checked');
        const opcaoIdSel = opcaoSel.value;
        const opcaoObj = vantagem.opcoes.find(o => o.id === opcaoIdSel);
        nomeFinal = `${vantagem.nome} (${opcaoObj.nome})`;
        custoFinal = opcaoObj.custo;
        
        const limitacoesSel = document.querySelectorAll('input[name="limitacao"]:checked');
        const limitacoesLista = [];
        let porcentagemSel = 0;
        
        limitacoesSel.forEach(lim => {
          const limitacao = vantagem.limitações.find(l => l.id === lim.value);
          limitacoesLista.push(limitacao);
          porcentagemSel += limitacao.custo;
        });
        
        if (porcentagemSel !== 0) {
          custoFinal = Math.round(custoFinal * (1 + (porcentagemSel / 100)));
        }
        
        config.tipo = 'opcoes_com_limitações';
        config.opcao = opcaoObj;
        config.limitações = limitacoesLista;
        config.porcentagem = porcentagemSel;
        break;
    }
    
    // Verificar se já existe
    const indexExistente = this.vantagensAdquiridas.findIndex(v => v.id === vantagem.id);
    
    if (indexExistente !== -1) {
      // Atualizar existente
      this.vantagensAdquiridas[indexExistente] = {
        id: vantagem.id,
        nome: nomeFinal,
        custo: custoFinal,
        dados: {
          descricao: vantagem.descricao,
          config: config,
          original: vantagem
        }
      };
    } else {
      // Adicionar nova
      this.vantagensAdquiridas.push({
        id: vantagem.id,
        nome: nomeFinal,
        custo: custoFinal,
        dados: {
          descricao: vantagem.descricao,
          config: config,
          original: vantagem
        }
      });
    }
    
    // Salvar no localStorage
    this.salvarLocalStorage();
    
    // Atualizar UI
    this.carregarCatalogo();
    this.carregarAdquiridas();
    this.atualizarContadores();
    this.atualizarPontosGlobais();
    
    // Fechar modal
    this.fecharModal();
    
    // Mostrar feedback
    this.mostrarFeedback(`${nomeFinal} adicionada por ${custoFinal} pontos!`);
  }
  
  removerVantagem(id) {
    if (confirm('Remover esta vantagem?')) {
      this.vantagensAdquiridas = this.vantagensAdquiridas.filter(v => v.id !== id);
      this.salvarLocalStorage();
      this.carregarCatalogo();
      this.carregarAdquiridas();
      this.atualizarContadores();
      this.atualizarPontosGlobais();
    }
  }
  
  carregarAdquiridas() {
    const container = document.getElementById('listaVantagensAdquiridas');
    if (!container) return;
    
    if (this.vantagensAdquiridas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-star"></i>
          <p>Nenhuma vantagem adquirida</p>
          <small>Clique em uma vantagem do catálogo</small>
        </div>
      `;
      return;
    }
    
    container.innerHTML = '';
    
    this.vantagensAdquiridas.forEach(vantagem => {
      const card = this.criarCardAdquirida(vantagem);
      container.appendChild(card);
    });
  }
  
  criarCardAdquirida(vantagem) {
    const card = document.createElement('div');
    card.className = 'vantagem-card adquirida';
    card.innerHTML = `
      <div class="card-header">
        <h4>${vantagem.nome}</h4>
        <span class="custo">+${vantagem.custo} pts</span>
      </div>
      <div class="card-body">
        <p>${vantagem.dados.descricao.substring(0, 100)}${vantagem.dados.descricao.length > 100 ? '...' : ''}</p>
      </div>
      <div class="card-footer">
        <button class="btn-editar" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-remover" title="Remover">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Evento editar
    card.querySelector('.btn-editar').addEventListener('click', () => {
      const vantagemOriginal = this.catalogo.find(v => v.id === vantagem.id);
      if (vantagemOriginal) {
        this.selecionarVantagem(vantagemOriginal);
      }
    });
    
    // Evento remover
    card.querySelector('.btn-remover').addEventListener('click', () => {
      this.removerVantagem(vantagem.id);
    });
    
    return card;
  }
  
  atualizarContadores() {
    const total = this.vantagensAdquiridas.length;
    const pontos = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
    
    // Atualizar contadores na aba vantagens
    const elementos = {
      'totalVantagensAdquiridas': total,
      'pontosVantagensAdquiridas': `${pontos} pts`,
      'resumoQuantidade': total,
      'resumoPontos': pontos,
      'pontosTotaisAdquiridas': pontos
    };
    
    Object.keys(elementos).forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.textContent = elementos[id];
    });
  }
  
  atualizarPontosGlobais() {
    const pontosVantagens = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
    
    // Atualizar no sistema de pontos principal
    if (typeof window.atualizarPontosVantagens === 'function') {
      window.atualizarPontosVantagens(pontosVantagens);
    }
    
    // Atualizar no resumo do cabeçalho
    const resumoPontos = document.getElementById('totalVantagensPontos');
    if (resumoPontos) resumoPontos.textContent = pontosVantagens;
    
    const saldoElement = document.getElementById('saldoVantagens');
    if (saldoElement) {
      const pontosDesvantagens = parseInt(document.getElementById('totalDesvantagensPontos')?.textContent || 0);
      const saldo = pontosVantagens + pontosDesvantagens;
      saldoElement.textContent = saldo;
    }
  }
  
  getCategoriaNome(categoria) {
    const categorias = {
      'fisicas': 'Físicas',
      'mental-sobrenatural': 'Mental/Sobrenatural',
      'supers': 'Supers',
      'social': 'Social'
    };
    return categorias[categoria] || categoria;
  }
  
  setupEventListeners() {
    // Filtros
    document.querySelectorAll('#vantagens .filtro-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#vantagens .filtro-btn').forEach(b => b.classList.remove('active'));
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
        
        if (confirm('Remover TODAS as vantagens adquiridas?')) {
          this.vantagensAdquiridas = [];
          this.salvarLocalStorage();
          this.carregarCatalogo();
          this.carregarAdquiridas();
          this.atualizarContadores();
          this.atualizarPontosGlobais();
        }
      });
    }
    
    // Modais
    const modal = document.getElementById('modalVantagem');
    const fecharButtons = modal.querySelectorAll('.modal-close, .fechar-modal');
    fecharButtons.forEach(btn => {
      btn.addEventListener('click', () => this.fecharModal());
    });
    
    // Fechar modal clicando fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.fecharModal();
      }
    });
  }
  
  fecharModal() {
    document.getElementById('modalVantagem').style.display = 'none';
    this.vantagemSelecionada = null;
  }
  
  mostrarFeedback(mensagem) {
    // Criar elemento de feedback temporário
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.innerHTML = `
      <div class="feedback-content">
        <i class="fas fa-check-circle"></i>
        <span>${mensagem}</span>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    // Remover após 3 segundos
    setTimeout(() => {
      feedback.classList.add('fade-out');
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
  
  salvarLocalStorage() {
    localStorage.setItem('vantagensAdquiridas', JSON.stringify(this.vantagensAdquiridas));
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.vantagensManager = new VantagensManager();
});

// Função para ser chamada pelo sistema de pontos
window.atualizarPontosVantagens = function(pontos) {
  const elemento = document.getElementById('pontosVantagens');
  if (elemento) elemento.textContent = pontos;
  
  // Atualizar também no resumo da aba principal
  const pontosElement = document.getElementById('pontosVantagens');
  if (pontosElement) pontosElement.textContent = pontos;
};