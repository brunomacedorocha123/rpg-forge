// vantagens.js
class VantagensManager {
  constructor() {
    this.vantagensAdquiridas = [];
    this.catalogo = vantagensCatalogo;
    this.filtroAtual = 'todas';
    this.buscaAtual = '';
    
    this.init();
  }
  
  init() {
    this.carregarCatalogo();
    this.setupEventListeners();
    this.atualizarContadores();
  }
  
  carregarCatalogo() {
    const container = document.getElementById('listaCatalogoVantagens');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Filtrar vantagens
    let vantagensFiltradas = this.catalogo;
    
    // Aplicar filtro de categoria
    if (this.filtroAtual !== 'todas') {
      vantagensFiltradas = vantagensFiltradas.filter(v => v.categoria === this.filtroAtual);
    }
    
    // Aplicar busca
    if (this.buscaAtual) {
      const busca = this.buscaAtual.toLowerCase();
      vantagensFiltradas = vantagensFiltradas.filter(v => 
        v.nome.toLowerCase().includes(busca) || 
        v.descricao.toLowerCase().includes(busca)
      );
    }
    
    // Criar cards
    vantagensFiltradas.forEach(vantagem => {
      const card = this.criarCardVantagem(vantagem);
      container.appendChild(card);
    });
    
    // Atualizar contador
    document.getElementById('contadorVantagens').textContent = vantagensFiltradas.length;
  }
  
  criarCardVantagem(vantagem) {
    const card = document.createElement('div');
    card.className = 'vantagem-card';
    card.dataset.id = vantagem.id;
    card.dataset.categoria = vantagem.categoria;
    
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
        <p>${vantagem.descricao.substring(0, 120)}...</p>
      </div>
      <div class="card-footer">
        <span class="categoria">${this.getCategoriaNome(vantagem.categoria)}</span>
        <button class="btn-adicionar ${jaAdquirida ? 'adquirido' : ''}">
          ${jaAdquirida ? '✓' : '+'}
        </button>
      </div>
    `;
    
    // Evento de clique
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-adicionar')) {
        this.abrirDetalhesVantagem(vantagem);
      }
    });
    
    card.querySelector('.btn-adicionar').addEventListener('click', (e) => {
      e.stopPropagation();
      if (jaAdquirida) {
        this.removerVantagem(vantagem.id);
      } else {
        this.adicionarVantagem(vantagem);
      }
    });
    
    return card;
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
  
  adicionarVantagem(vantagem) {
    // Verificar tipo para saber se precisa de modal
    if (vantagem.tipo === 'simples') {
      this.adicionarVantagemSimples(vantagem);
    } else if (vantagem.tipo === 'niveis') {
      this.abrirModalNiveis(vantagem);
    } else if (vantagem.tipo === 'opcoes') {
      this.abrirModalOpcoes(vantagem);
    } else if (vantagem.tipo === 'niveis_com_limitações') {
      this.abrirModalCompleto(vantagem);
    }
  }
  
  adicionarVantagemSimples(vantagem) {
    const vantagemAdquirida = {
      id: vantagem.id,
      nome: vantagem.nome,
      custo: vantagem.custoBase,
      tipo: 'simples',
      dados: { descricao: vantagem.descricao }
    };
    
    this.vantagensAdquiridas.push(vantagemAdquirida);
    this.atualizarUI();
    this.atualizarPontos();
  }
  
  abrirModalNiveis(vantagem) {
    // Criar modal para escolher nível
    const modal = document.getElementById('modalVantagem');
    document.getElementById('modalTitulo').textContent = `Escolher Nível: ${vantagem.nome}`;
    
    let html = `
      <div class="modal-niveis">
        <p>${vantagem.descricao}</p>
        <h4>Escolha o nível:</h4>
        <div class="niveis-opcoes">
    `;
    
    for (let i = 1; i <= vantagem.niveisMaximo; i++) {
      const custo = vantagem.custoBase + (vantagem.custoPorNivel * (i - 1));
      html += `
        <label class="opcao-item">
          <input type="radio" name="nivel" value="${i}" ${i === 1 ? 'checked' : ''}>
          <span>Nível ${i}: ${vantagem.descricaoNiveis[i-1]} - ${custo} pontos</span>
        </label>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
    
    document.getElementById('modalCorpo').innerHTML = html;
    
    // Configurar botão confirmar
    const btnConfirmar = document.getElementById('btnAdicionarModal');
    btnConfirmar.onclick = () => {
      const nivelSelecionado = document.querySelector('input[name="nivel"]:checked').value;
      const custo = vantagem.custoBase + (vantagem.custoPorNivel * (nivelSelecionado - 1));
      
      const vantagemAdquirida = {
        id: vantagem.id,
        nome: `${vantagem.nome} (Nível ${nivelSelecionado})`,
        custo: custo,
        tipo: 'niveis',
        dados: {
          nivel: nivelSelecionado,
          descricao: vantagem.descricaoNiveis[nivelSelecionado - 1]
        }
      };
      
      this.vantagensAdquiridas.push(vantagemAdquirida);
      this.atualizarUI();
      this.atualizarPontos();
      this.fecharModal();
    };
    
    this.abrirModal();
  }
  
  abrirModalOpcoes(vantagem) {
    const modal = document.getElementById('modalVantagem');
    document.getElementById('modalTitulo').textContent = `Escolher Classe: ${vantagem.nome}`;
    
    let html = `
      <div class="modal-opcoes">
        <p>${vantagem.descricao}</p>
        <h4>Escolha a classe de armas:</h4>
        <div class="opcoes-grid">
    `;
    
    vantagem.opcoes.forEach((opcao, index) => {
      html += `
        <label class="opcao-item ${index === 0 ? 'selecionada' : ''}">
          <input type="radio" name="opcao" value="${index}" ${index === 0 ? 'checked' : ''}>
          <strong>${opcao.nome}</strong>
          <div class="custo-opcao">${opcao.custo} pontos</div>
        </label>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    document.getElementById('modalCorpo').innerHTML = html;
    
    const btnConfirmar = document.getElementById('btnAdicionarModal');
    btnConfirmar.onclick = () => {
      const opcaoIndex = document.querySelector('input[name="opcao"]:checked').value;
      const opcao = vantagem.opcoes[opcaoIndex];
      
      const vantagemAdquirida = {
        id: vantagem.id,
        nome: `${vantagem.nome} (${opcao.nome})`,
        custo: opcao.custo,
        tipo: 'opcoes',
        dados: {
          opcao: opcao.nome,
          descricao: vantagem.descricao
        }
      };
      
      this.vantagensAdquiridas.push(vantagemAdquirida);
      this.atualizarUI();
      this.atualizarPontos();
      this.fecharModal();
    };
    
    this.abrirModal();
  }
  
  abrirModalCompleto(vantagem) {
    // Modal para vantagens complexas (Aptidão Mágica, Sorte)
    // Implementação similar mas com mais seções
    console.log('Abrir modal completo para:', vantagem.nome);
    // Implementar conforme necessário
  }
  
  removerVantagem(id) {
    this.vantagensAdquiridas = this.vantagensAdquiridas.filter(v => v.id !== id);
    this.atualizarUI();
    this.atualizarPontos();
  }
  
  atualizarUI() {
    // Atualizar catálogo
    this.carregarCatalogo();
    
    // Atualizar lista de adquiridas
    this.atualizarListaAdquiridas();
    
    // Atualizar contadores
    this.atualizarContadores();
  }
  
  atualizarListaAdquiridas() {
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
      return;
    }
    
    container.innerHTML = '';
    
    this.vantagensAdquiridas.forEach(vantagem => {
      const card = document.createElement('div');
      card.className = 'vantagem-card adquirida';
      card.innerHTML = `
        <div class="card-header">
          <h4>${vantagem.nome}</h4>
          <span class="custo">+${vantagem.custo} pts</span>
        </div>
        <div class="card-body">
          <p>${vantagem.dados.descricao?.substring(0, 100) || vantagem.nome}</p>
        </div>
        <div class="card-footer">
          <button class="btn-remover">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      card.querySelector('.btn-remover').addEventListener('click', () => {
        this.removerVantagem(vantagem.id);
      });
      
      container.appendChild(card);
    });
  }
  
  atualizarContadores() {
    const total = this.vantagensAdquiridas.length;
    const pontos = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
    
    document.getElementById('totalVantagensAdquiridas').textContent = total;
    document.getElementById('pontosVantagensAdquiridas').textContent = `${pontos} pts`;
    document.getElementById('resumoQuantidade').textContent = total;
    document.getElementById('resumoPontos').textContent = pontos;
    document.getElementById('pontosTotaisAdquiridas').textContent = pontos;
  }
  
  atualizarPontos() {
    // Atualizar no sistema de pontos principal
    const pontosVantagens = this.vantagensAdquiridas.reduce((sum, v) => sum + v.custo, 0);
    
    // Chamar função global para atualizar pontos
    if (typeof atualizarPontosVantagens === 'function') {
      atualizarPontosVantagens(pontosVantagens);
    }
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
    
    // Limpar
    const btnLimpar = document.getElementById('limparVantagens');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        if (confirm('Remover todas as vantagens adquiridas?')) {
          this.vantagensAdquiridas = [];
          this.atualizarUI();
        }
      });
    }
    
    // Modais
    document.querySelectorAll('.modal-close, .fechar-modal').forEach(btn => {
      btn.addEventListener('click', () => this.fecharModal());
    });
  }
  
  abrirModal() {
    document.getElementById('modalVantagem').style.display = 'block';
  }
  
  fecharModal() {
    document.getElementById('modalVantagem').style.display = 'none';
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.vantagensManager = new VantagensManager();
});