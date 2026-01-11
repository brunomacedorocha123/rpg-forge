// ===========================================
// STATUS-SOCIAL.JS - VERSÃO FINAL CORRIGIDA
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
  // INICIALIZAÇÃO PRINCIPAL
  // ===========================================
  
  inicializar() {
    if (this.inicializado) return;
    
    // Primeiro carrega os dados
    this.carregarLocalStorage();
    
    // Configura todos os sistemas
    this.configurarStatusSocial();
    this.configurarCarisma();
    this.configurarReputacao();
    
    // Configura sistemas de lista
    this.configurarSistemaAliados();
    this.configurarSistemaContatos();
    this.configurarSistemaPatronos();
    this.configurarSistemaInimigos();
    this.configurarSistemaDependentes();
    
    // Configura modais
    this.configurarModais();
    
    // Atualiza displays
    this.atualizarTodosDisplays();
    this.atualizarSistemaPontos();
    
    this.inicializado = true;
  }
  
  // ===========================================
  // 1. STATUS SOCIAL
  // ===========================================
  
  configurarStatusSocial() {
    // Usa escopo específico para evitar vazamento
    const subtabStatus = document.querySelector('#subtab-status');
    if (!subtabStatus) return;
    
    const statusCard = subtabStatus.querySelector('.status-card');
    if (!statusCard) return;
    
    const minusBtn = statusCard.querySelector('.btn-controle.minus');
    const plusBtn = statusCard.querySelector('.btn-controle.plus');
    
    if (minusBtn) {
      minusBtn.addEventListener('click', () => this.ajustarStatus(-1));
    }
    
    if (plusBtn) {
      plusBtn.addEventListener('click', () => this.ajustarStatus(1));
    }
    
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
    const valorDisplay = document.getElementById('valorStatus');
    const pontosDisplay = document.getElementById('pontosStatus');
    
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
    const subtabStatus = document.querySelector('#subtab-status');
    if (!subtabStatus) return;
    
    const cards = subtabStatus.querySelectorAll('.status-card');
    if (cards.length < 2) return;
    
    const carismaCard = cards[1];
    const minusBtn = carismaCard.querySelector('.btn-controle.minus');
    const plusBtn = carismaCard.querySelector('.btn-controle.plus');
    
    if (minusBtn) {
      minusBtn.addEventListener('click', () => this.ajustarCarisma(-1));
    }
    
    if (plusBtn) {
      plusBtn.addEventListener('click', () => this.ajustarCarisma(1));
    }
    
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
    const valorDisplay = document.getElementById('valorCarisma');
    const pontosDisplay = document.getElementById('pontosCarisma');
    
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
    const subtabStatus = document.querySelector('#subtab-status');
    if (!subtabStatus) return;
    
    // Botões positivos - CORREÇÃO AQUI
    subtabStatus.querySelectorAll('.btn-controle[data-controle="rep-positiva"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = e.target.classList.contains('minus') ? -1 : 1;
        this.ajustarReputacao('positiva', delta);
      });
    });
    
    // Botões negativos - CORREÇÃO AQUI
    subtabStatus.querySelectorAll('.btn-controle[data-controle="rep-negativa"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = e.target.classList.contains('minus') ? -1 : 1;
        this.ajustarReputacao('negativa', delta);
      });
    });
    
    // Grupos alvo
    const grupoPosInput = document.getElementById('grupoPositivo');
    const grupoNegInput = document.getElementById('grupoNegativo');
    
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
    const badgeRep = document.getElementById('pontosReputacao');
    
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
  // 4. SISTEMA DE ALIADOS (COM MODAL) - CORRIGIDO
  // ===========================================
  
  configurarSistemaAliados() {
    // Configura botão de adicionar aliado - CORREÇÃO AQUI
    document.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      if (btnAdd && btnAdd.dataset.tipo === 'aliado') {
        this.abrirModal('aliado');
      }
    });
    
    // Configura botão de confirmar no modal
    const btnConfirmar = document.getElementById('btnConfirmarAliado');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => this.adicionarAliado());
    }
    
    this.atualizarDisplayAliados();
  }
  
  adicionarAliado() {
    const nome = document.getElementById('aliadoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o aliado!');
      return;
    }
    
    const poder = parseInt(document.getElementById('aliadoPoder')?.value) || 100;
    const frequencia = parseInt(document.getElementById('aliadoFrequencia')?.value) || 9;
    const isGrupo = document.getElementById('aliadoGrupo')?.checked || false;
    const tamanhoGrupo = parseInt(document.getElementById('aliadoTamanhoGrupo')?.value) || 1;
    const descricao = document.getElementById('aliadoDescricao')?.value || '';
    
    // Cálculo simplificado dos pontos
    let custoBase = 5; // Base para 100%
    if (poder <= 25) custoBase = 1;
    else if (poder <= 50) custoBase = 2;
    else if (poder <= 75) custoBase = 3;
    else if (poder <= 100) custoBase = 5;
    else if (poder <= 150) custoBase = 10;
    
    const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
    const pontos = custoBase * multFrequencia;
    
    const aliado = {
      id: this.nextId++,
      nome: nome,
      poder: poder,
      frequencia: frequencia,
      isGrupo: isGrupo,
      tamanhoGrupo: tamanhoGrupo,
      pontos: pontos,
      descricao: descricao,
      dataAdicao: new Date().toISOString()
    };
    
    this.aliados.push(aliado);
    
    // Fecha modal e limpa
    this.fecharModal('aliado');
    document.getElementById('aliadoNome').value = '';
    document.getElementById('aliadoDescricao').value = '';
    
    // Atualiza
    this.atualizarDisplayAliados();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // 5. SISTEMA DE CONTATOS (COM MODAL) - CORRIGIDO
  // ===========================================
  
  configurarSistemaContatos() {
    // Configura botão de adicionar contato - CORREÇÃO AQUI
    document.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      if (btnAdd && btnAdd.dataset.tipo === 'contato') {
        this.abrirModal('contato');
      }
    });
    
    const btnConfirmar = document.getElementById('btnConfirmarContato');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => this.adicionarContato());
    }
    
    this.atualizarDisplayContatos();
  }
  
  adicionarContato() {
    const nome = document.getElementById('contatoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o contato!');
      return;
    }
    
    const contato = {
      id: this.nextId++,
      nome: nome,
      tipo: document.getElementById('contatoTipo')?.value || 'outro',
      pericia: document.getElementById('contatoPericia')?.value || '',
      nhEfetivo: parseInt(document.getElementById('contatoNHEfetivo')?.value) || 15,
      frequencia: parseInt(document.getElementById('contatoFrequencia')?.value) || 9,
      confiabilidade: document.getElementById('contatoConfiabilidade')?.value || 'razoavelmente',
      pontos: 4, // Valor padrão
      dataAdicao: new Date().toISOString()
    };
    
    this.contatos.push(contato);
    
    this.fecharModal('contato');
    document.getElementById('contatoNome').value = '';
    document.getElementById('contatoPericia').value = '';
    
    this.atualizarDisplayContatos();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // 6. SISTEMA DE PATRONOS (COM MODAL) - CORRIGIDO
  // ===========================================
  
  configurarSistemaPatronos() {
    // Configura botão de adicionar patrono - CORREÇÃO AQUI
    document.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      if (btnAdd && btnAdd.dataset.tipo === 'patrono') {
        this.abrirModal('patrono');
      }
    });
    
    const btnConfirmar = document.getElementById('btnConfirmarPatrono');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => this.adicionarPatrono());
    }
    
    this.atualizarDisplayPatronos();
  }
  
  adicionarPatrono() {
    const nome = document.getElementById('patronoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o patrono!');
      return;
    }
    
    const patrono = {
      id: this.nextId++,
      nome: nome,
      poder: parseInt(document.getElementById('patronoPoder')?.value) || 15,
      frequencia: parseInt(document.getElementById('patronoFrequencia')?.value) || 9,
      pontos: 15, // Valor padrão
      descricao: document.getElementById('patronoDescricao')?.value || '',
      dataAdicao: new Date().toISOString()
    };
    
    this.patronos.push(patrono);
    
    this.fecharModal('patrono');
    document.getElementById('patronoNome').value = '';
    document.getElementById('patronoDescricao').value = '';
    
    this.atualizarDisplayPatronos();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // 7. SISTEMA DE INIMIGOS (COM MODAL) - CORRIGIDO
  // ===========================================
  
  configurarSistemaInimigos() {
    // Configura botão de adicionar inimigo - CORREÇÃO AQUI
    document.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      if (btnAdd && btnAdd.dataset.tipo === 'inimigo') {
        this.abrirModal('inimigo');
      }
    });
    
    const btnConfirmar = document.getElementById('btnConfirmarInimigo');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => this.adicionarInimigo());
    }
    
    this.atualizarDisplayInimigos();
  }
  
  adicionarInimigo() {
    const nome = document.getElementById('inimigoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o inimigo!');
      return;
    }
    
    const inimigo = {
      id: this.nextId++,
      nome: nome,
      poder: parseInt(document.getElementById('inimigoPoder')?.value) || -10,
      intencao: document.getElementById('inimigoIntencao')?.value || 'perseguidor',
      frequencia: parseInt(document.getElementById('inimigoFrequencia')?.value) || 9,
      pontos: -10, // Valor padrão
      motivo: document.getElementById('inimigoMotivo')?.value || '',
      descricao: document.getElementById('inimigoDescricao')?.value || '',
      dataAdicao: new Date().toISOString()
    };
    
    this.inimigos.push(inimigo);
    
    this.fecharModal('inimigo');
    document.getElementById('inimigoNome').value = '';
    document.getElementById('inimigoMotivo').value = '';
    document.getElementById('inimigoDescricao').value = '';
    
    this.atualizarDisplayInimigos();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // 8. SISTEMA DE DEPENDENTES (COM MODAL) - CORRIGIDO
  // ===========================================
  
  configurarSistemaDependentes() {
    // Configura botão de adicionar dependente - CORREÇÃO AQUI
    document.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      if (btnAdd && btnAdd.dataset.tipo === 'dependente') {
        this.abrirModal('dependente');
      }
    });
    
    const btnConfirmar = document.getElementById('btnConfirmarDependente');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => this.adicionarDependente());
    }
    
    this.atualizarDisplayDependentes();
  }
  
  adicionarDependente() {
    const nome = document.getElementById('dependenteNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o dependente!');
      return;
    }
    
    const dependente = {
      id: this.nextId++,
      nome: nome,
      capacidade: parseInt(document.getElementById('dependenteCapacidade')?.value) || 75,
      importancia: document.getElementById('dependenteImportancia')?.value || 'amigo',
      frequencia: parseInt(document.getElementById('dependenteFrequencia')?.value) || 9,
      pontos: -2, // Valor padrão
      relacao: document.getElementById('dependenteRelacao')?.value || '',
      dataAdicao: new Date().toISOString()
    };
    
    this.dependentes.push(dependente);
    
    this.fecharModal('dependente');
    document.getElementById('dependenteNome').value = '';
    document.getElementById('dependenteRelacao').value = '';
    
    this.atualizarDisplayDependentes();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // DISPLAYS DAS LISTAS
  // ===========================================
  
  atualizarDisplayAliados() {
    const container = document.getElementById('listaAliados');
    const badge = document.getElementById('pontosAliados');
    
    if (!container || !badge) return;
    
    const totalPontos = this.aliados.reduce((total, aliado) => total + aliado.pontos, 0);
    
    badge.textContent = `+${totalPontos} pts`;
    badge.className = 'pontos-badge positivo';
    
    if (this.aliados.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-user-friends"></i><p>Nenhum aliado adicionado</p><small>Clique para adicionar aliados</small></div>';
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
    const container = document.getElementById('listaContatos');
    const badge = document.getElementById('pontosContatos');
    
    if (!container || !badge) return;
    
    const totalPontos = this.contatos.reduce((total, contato) => total + contato.pontos, 0);
    
    badge.textContent = `+${totalPontos} pts`;
    badge.className = 'pontos-badge positivo';
    
    if (this.contatos.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-address-book"></i><p>Nenhum contato adicionado</p><small>Clique para adicionar contatos</small></div>';
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
    const container = document.getElementById('listaPatronos');
    const badge = document.getElementById('pontosPatronos');
    
    if (!container || !badge) return;
    
    const totalPontos = this.patronos.reduce((total, patrono) => total + patrono.pontos, 0);
    
    badge.textContent = `+${totalPontos} pts`;
    badge.className = 'pontos-badge positivo';
    
    if (this.patronos.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-landmark"></i><p>Nenhum patrono adicionado</p><small>Clique para adicionar patronos</small></div>';
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
    const container = document.getElementById('listaInimigos');
    const badge = document.getElementById('pontosInimigos');
    
    if (!container || !badge) return;
    
    const totalPontos = this.inimigos.reduce((total, inimigo) => total + inimigo.pontos, 0);
    
    badge.textContent = `${totalPontos} pts`;
    badge.className = 'pontos-badge negativo';
    
    if (this.inimigos.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-skull-crossbones"></i><p>Nenhum inimigo adicionado</p><small>Clique para adicionar inimigos</small></div>';
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
    const container = document.getElementById('listaDependentes');
    const badge = document.getElementById('pontosDependentes');
    
    if (!container || !badge) return;
    
    const totalPontos = this.dependentes.reduce((total, dependente) => total + dependente.pontos, 0);
    
    badge.textContent = `${totalPontos} pts`;
    badge.className = totalPontos < 0 ? 'pontos-badge negativo' : 'pontos-badge';
    
    if (this.dependentes.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><p>Nenhum dependente adicionado</p><small>Clique para adicionar dependentes</small></div>';
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
          </div>
          <div class="item-actions">
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
      case 'amigo': return 'Amigo';
      case 'ser_amado': return 'Ser Amado';
      default: return importancia;
    }
  }
  
  // ===========================================
  // SISTEMA DE MODAIS
  // ===========================================
  
  abrirModal(tipo) {
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
    // Fechar modais ao clicar no X
    document.querySelectorAll('.modal-close[data-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.target.closest('.modal-close').dataset.modal;
        if (modalId) {
          this.fecharModal(modalId);
        }
      });
    });
    
    // Fechar modais ao clicar em cancelar
    document.querySelectorAll('.btn-secondary[data-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.target.closest('.btn-secondary').dataset.modal;
        if (modalId) {
          this.fecharModal(modalId);
        }
      });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Remover itens
    document.addEventListener('click', (e) => {
      const btnRemover = e.target.closest('.btn-remove-item');
      if (btnRemover) {
        const id = parseInt(btnRemover.dataset.id);
        const tipo = btnRemover.dataset.tipo;
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
    this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
    if (!this.pontosManager) return;
    
    const vantagens = this.calcularVantagensTotais();
    const desvantagens = Math.abs(this.calcularDesvantagensTotais());
    
    if (this.pontosManager.gastos) {
      this.pontosManager.gastos.vantagens = vantagens;
      this.pontosManager.gastos.desvantagens = this.pontosManager.gastos.desvantagens || {};
      this.pontosManager.gastos.desvantagens.outras = desvantagens;
    }
    
    if (this.pontosManager.atualizarTudo) {
      this.pontosManager.atualizarTudo();
    }
    
    // Atualizar resumo na aba de Vantagens
    const totalVantagensElem = document.getElementById('totalVantagensPontos');
    const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
    const saldoElem = document.getElementById('saldoVantagens');
    
    if (totalVantagensElem) totalVantagensElem.textContent = vantagens;
    if (totalDesvantagensElem) totalDesvantagensElem.textContent = desvantagens;
    if (saldoElem) saldoElem.textContent = vantagens - desvantagens;
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

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Espera um pouco para garantir que o DOM esteja pronto
  setTimeout(() => {
    inicializarStatusSocial();
  }, 500);
});

// Exportar para uso global
window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
  return statusSocialManagerInstance;
};

// Função global para abrir modais (mantida para compatibilidade)
window.abrirModal = function(tipo) {
  if (statusSocialManagerInstance) {
    statusSocialManagerInstance.abrirModal(tipo);
  }
};

// Inicialização automática se a aba status estiver ativa
document.addEventListener('click', function(e) {
  if (e.target.closest('.sub-tab') && e.target.closest('.sub-tab').dataset.subtab === 'status') {
    // Garante que o sistema seja inicializado quando a aba status for clicada
    setTimeout(() => {
      inicializarStatusSocial();
    }, 100);
  }
});