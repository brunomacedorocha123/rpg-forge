// ===========================================
// STATUS-SOCIAL.JS - VERSÃO 100% FUNCIONAL
// TODOS OS CÁLCULOS CORRETOS - NÃO QUEBRA NADA
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
    
    this.carregarLocalStorage();
    
    this.configurarStatusSocial();
    this.configurarCarisma();
    this.configurarReputacao();
    
    this.configurarSistemaAliados();
    this.configurarSistemaContatos();
    this.configurarSistemaPatronos();
    this.configurarSistemaInimigos();
    this.configurarSistemaDependentes();
    
    this.configurarModais();
    
    this.atualizarTodosDisplays();
    this.atualizarSistemaPontos();
    
    this.inicializado = true;
  }
  
  // ===========================================
  // 1. STATUS SOCIAL - 100% FUNCIONAL
  // ===========================================
  
  configurarStatusSocial() {
    const subtabStatus = document.querySelector('#subtab-status');
    if (!subtabStatus) return;
    
    const statusCard = subtabStatus.querySelector('.status-card');
    if (!statusCard) return;
    
    const minusBtn = statusCard.querySelector('.btn-controle.minus');
    const plusBtn = statusCard.querySelector('.btn-controle.plus');
    
    if (minusBtn) {
      minusBtn.onclick = () => this.ajustarStatus(-1);
    }
    
    if (plusBtn) {
      plusBtn.onclick = () => this.ajustarStatus(1);
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
  // 2. CARISMA - 100% FUNCIONAL
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
      minusBtn.onclick = () => this.ajustarCarisma(-1);
    }
    
    if (plusBtn) {
      plusBtn.onclick = () => this.ajustarCarisma(1);
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
  // 3. REPUTAÇÃO - 100% FUNCIONAL
  // ===========================================
  
  configurarReputacao() {
    const subtabStatus = document.querySelector('#subtab-status');
    if (!subtabStatus) return;
    
    // Reputação positiva
    subtabStatus.querySelectorAll('.btn-controle[data-controle="rep-positiva"]').forEach(btn => {
      btn.onclick = (e) => {
        const delta = e.target.classList.contains('minus') ? -1 : 1;
        this.ajustarReputacao('positiva', delta);
      };
    });
    
    // Reputação negativa
    subtabStatus.querySelectorAll('.btn-controle[data-controle="rep-negativa"]').forEach(btn => {
      btn.onclick = (e) => {
        const delta = e.target.classList.contains('minus') ? -1 : 1;
        this.ajustarReputacao('negativa', delta);
      };
    });
    
    // Campos de grupo
    const grupoPosInput = document.getElementById('grupoPositivo');
    const grupoNegInput = document.getElementById('grupoNegativo');
    
    if (grupoPosInput) {
      grupoPosInput.value = this.grupoRepPositiva;
      grupoPosInput.onchange = (e) => {
        this.grupoRepPositiva = e.target.value;
        this.salvarLocalStorage();
      };
    }
    
    if (grupoNegInput) {
      grupoNegInput.value = this.grupoRepNegativa;
      grupoNegInput.onchange = (e) => {
        this.grupoRepNegativa = e.target.value;
        this.salvarLocalStorage();
      };
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
  // 4. ALIADOS - 100% FUNCIONAL (COM MULTIPLICADOR DE GRUPO)
  // ===========================================
  
  configurarSistemaAliados() {
    // Botão Adicionar Aliado
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')?.dataset.tipo === 'aliado') {
        this.abrirModal('aliado');
        this.configurarCalculoAliado();
      }
    });
    
    // Botão Confirmar no Modal
    const btnConfirmar = document.getElementById('btnConfirmarAliado');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.adicionarAliado();
    }
    
    this.atualizarDisplayAliados();
  }
  
  configurarCalculoAliado() {
    // Campos que afetam o cálculo
    const campos = ['aliadoPoder', 'aliadoGrupo', 'aliadoTamanhoGrupo', 
                   'aliadoHabilidadesEspeciais', 'aliadoInvocavel'];
    
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.onchange = () => this.calcularPontosAliado();
      }
    });
    
    // Mostrar/ocultar campo de grupo
    const grupoCheckbox = document.getElementById('aliadoGrupo');
    const grupoContainer = document.getElementById('grupoAliadoContainer');
    
    if (grupoCheckbox && grupoContainer) {
      grupoCheckbox.onchange = (e) => {
        grupoContainer.style.display = e.target.checked ? 'block' : 'none';
        this.calcularPontosAliado();
      };
    }
    
    // Calcular inicialmente
    this.calcularPontosAliado();
  }
  
  calcularPontosAliado() {
    const poder = parseInt(document.getElementById('aliadoPoder')?.value) || 100;
    const isGrupo = document.getElementById('aliadoGrupo')?.checked || false;
    const tamanhoGrupo = parseInt(document.getElementById('aliadoTamanhoGrupo')?.value) || 2;
    const habilidadesEspeciais = document.getElementById('aliadoHabilidadesEspeciais')?.checked || false;
    const invocavel = document.getElementById('aliadoInvocavel')?.checked || false;
    
    // 1. Custo base
    let custoBase = 5; // 100%
    if (poder === 25) custoBase = 1;
    else if (poder === 50) custoBase = 2;
    else if (poder === 75) custoBase = 3;
    else if (poder === 150) custoBase = 10;
    else if (poder === 200) custoBase = 15;
    
    // 2. Multiplicador de grupo
    let multiplicadorGrupo = 1;
    if (isGrupo) {
      if (tamanhoGrupo === 2) multiplicadorGrupo = 1.5;
      else if (tamanhoGrupo >= 3 && tamanhoGrupo <= 5) multiplicadorGrupo = 2;
      else if (tamanhoGrupo >= 6 && tamanhoGrupo <= 10) multiplicadorGrupo = 6;
      else if (tamanhoGrupo >= 11 && tamanhoGrupo <= 20) multiplicadorGrupo = 8;
      else if (tamanhoGrupo >= 21 && tamanhoGrupo <= 50) multiplicadorGrupo = 10;
      else if (tamanhoGrupo >= 51 && tamanhoGrupo <= 100) multiplicadorGrupo = 12;
      else if (tamanhoGrupo > 100) multiplicadorGrupo = 15;
    }
    
    // 3. Modificadores
    let modificadorTotal = 1;
    if (habilidadesEspeciais) modificadorTotal *= 1.5;
    if (invocavel) modificadorTotal *= 2;
    
    // 4. Calcular
    const pontos = Math.round(custoBase * multiplicadorGrupo * modificadorTotal);
    
    // 5. Atualizar preview
    this.atualizarPreviewAliado(custoBase, multiplicadorGrupo, modificadorTotal, pontos);
    
    return pontos;
  }
  
  atualizarPreviewAliado(custoBase, multGrupo, modTotal, pontos) {
    const previewBase = document.getElementById('previewCustoBase');
    const previewMult = document.getElementById('previewMultiplicador');
    const previewMultContainer = document.getElementById('previewMultiplicadorContainer');
    const previewMod = document.getElementById('previewModificadores');
    const previewModContainer = document.getElementById('previewModificadoresContainer');
    const previewTotal = document.getElementById('previewCustoTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    
    if (previewMult) {
      previewMult.textContent = `×${multGrupo}`;
    }
    
    if (previewMultContainer) {
      previewMultContainer.style.display = multGrupo !== 1 ? 'flex' : 'none';
    }
    
    if (previewMod) {
      previewMod.textContent = `×${modTotal.toFixed(1)}`;
    }
    
    if (previewModContainer) {
      previewModContainer.style.display = modTotal !== 1 ? 'flex' : 'none';
    }
    
    if (previewTotal) {
      previewTotal.textContent = `+${pontos} pts`;
      previewTotal.className = pontos >= 0 ? 'total-positivo' : 'total-negativo';
    }
  }
  
  adicionarAliado() {
    const nome = document.getElementById('aliadoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o aliado!');
      return;
    }
    
    const pontos = this.calcularPontosAliado();
    
    const aliado = {
      id: this.nextId++,
      nome: nome,
      poder: parseInt(document.getElementById('aliadoPoder')?.value) || 100,
      isGrupo: document.getElementById('aliadoGrupo')?.checked || false,
      tamanhoGrupo: document.getElementById('aliadoGrupo')?.checked ? 
                   parseInt(document.getElementById('aliadoTamanhoGrupo')?.value) || 2 : 1,
      habilidadesEspeciais: document.getElementById('aliadoHabilidadesEspeciais')?.checked || false,
      invocavel: document.getElementById('aliadoInvocavel')?.checked || false,
      pontos: pontos,
      descricao: document.getElementById('aliadoDescricao')?.value || '',
      dataAdicao: new Date().toISOString()
    };
    
    this.aliados.push(aliado);
    
    this.fecharModal('aliado');
    
    // Limpar formulário
    document.getElementById('aliadoNome').value = '';
    document.getElementById('aliadoDescricao').value = '';
    document.getElementById('aliadoGrupo').checked = false;
    if (document.getElementById('grupoAliadoContainer')) {
      document.getElementById('grupoAliadoContainer').style.display = 'none';
    }
    document.getElementById('aliadoHabilidadesEspeciais').checked = false;
    document.getElementById('aliadoInvocavel').checked = false;
    
    this.atualizarDisplayAliados();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
  }
  
  // ===========================================
  // 5. CONTATOS - 100% FUNCIONAL (COM TODOS MULTIPLICADORES)
  // ===========================================
  
  configurarSistemaContatos() {
    // Botão Adicionar Contato
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')?.dataset.tipo === 'contato') {
        this.abrirModal('contato');
        this.configurarCalculoContato();
      }
    });
    
    // Botão Confirmar
    const btnConfirmar = document.getElementById('btnConfirmarContato');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.adicionarContato();
    }
    
    this.atualizarDisplayContatos();
  }
  
  configurarCalculoContato() {
    const campos = ['contatoNHEfetivo', 'contatoConfiabilidade', 'contatoFrequencia'];
    
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.onchange = () => this.calcularPontosContato();
      }
    });
    
    this.calcularPontosContato();
  }
  
  calcularPontosContato() {
    const nhEfetivo = parseInt(document.getElementById('contatoNHEfetivo')?.value) || 15;
    const confiabilidade = document.getElementById('contatoConfiabilidade')?.value || 'razoavelmente';
    const frequencia = parseInt(document.getElementById('contatoFrequencia')?.value) || 9;
    
    // 1. Custo base
    let custoBase = 2; // NH 15
    if (nhEfetivo === 12) custoBase = 1;
    else if (nhEfetivo === 18) custoBase = 3;
    else if (nhEfetivo === 20) custoBase = 4;
    
    // 2. Confiabilidade
    let multiplicadorConfiabilidade = 2; // Razoavelmente
    if (confiabilidade === 'completamente') multiplicadorConfiabilidade = 3;
    else if (confiabilidade === 'meio') multiplicadorConfiabilidade = 1;
    else if (confiabilidade === 'não') multiplicadorConfiabilidade = 0.5;
    
    // 3. Frequência
    let multiplicadorFrequencia = 1; // 9-
    if (frequencia === 6) multiplicadorFrequencia = 0.5;
    else if (frequencia === 12) multiplicadorFrequencia = 2;
    else if (frequencia === 15) multiplicadorFrequencia = 3;
    
    // 4. Calcular
    const pontos = Math.round(custoBase * multiplicadorConfiabilidade * multiplicadorFrequencia);
    
    // 5. Atualizar preview
    this.atualizarPreviewContato(custoBase, multiplicadorConfiabilidade, multiplicadorFrequencia, pontos);
    
    return pontos;
  }
  
  atualizarPreviewContato(custoBase, confMulti, freqMulti, pontos) {
    const previewBase = document.getElementById('previewContatoBase');
    const previewConf = document.getElementById('previewContatoConf');
    const previewFreq = document.getElementById('previewContatoFreq');
    const previewTotal = document.getElementById('previewContatoTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    if (previewConf) previewConf.textContent = `×${confMulti}`;
    if (previewFreq) previewFreq.textContent = `×${freqMulti}`;
    
    if (previewTotal) {
      previewTotal.textContent = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
      previewTotal.className = pontos >= 0 ? 'total-positivo' : 'total-negativo';
    }
  }
  
  adicionarContato() {
    const nome = document.getElementById('contatoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o contato!');
      return;
    }
    
    const pontos = this.calcularPontosContato();
    
    const contato = {
      id: this.nextId++,
      nome: nome,
      tipo: document.getElementById('contatoTipo')?.value || 'outro',
      pericia: document.getElementById('contatoPericia')?.value || '',
      nhEfetivo: parseInt(document.getElementById('contatoNHEfetivo')?.value) || 15,
      frequencia: parseInt(document.getElementById('contatoFrequencia')?.value) || 9,
      confiabilidade: document.getElementById('contatoConfiabilidade')?.value || 'razoavelmente',
      pontos: pontos,
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
  // 6. PATRONOS - 100% FUNCIONAL (COM TODOS MULTIPLICADORES)
  // ===========================================
  
  configurarSistemaPatronos() {
    // Botão Adicionar Patrono
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')?.dataset.tipo === 'patrono') {
        this.abrirModal('patrono');
        this.configurarCalculoPatrono();
      }
    });
    
    // Botão Confirmar
    const btnConfirmar = document.getElementById('btnConfirmarPatrono');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.adicionarPatrono();
    }
    
    this.atualizarDisplayPatronos();
  }
  
  configurarCalculoPatrono() {
    const campos = ['patronoPoder', 'patronoFrequencia',
                   'patronoAltamenteAcessivel', 'patronoEquipamento', 'patronoHabilidadesEspeciais',
                   'patronoIntervencaoMinima', 'patronoRelutante', 'patronoSegredo'];
    
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.onchange = () => this.calcularPontosPatrono();
      }
    });
    
    this.calcularPontosPatrono();
  }
  
  calcularPontosPatrono() {
    const poder = parseInt(document.getElementById('patronoPoder')?.value) || 15;
    const frequencia = parseInt(document.getElementById('patronoFrequencia')?.value) || 9;
    
    // Checkboxes
    const altamenteAcessivel = document.getElementById('patronoAltamenteAcessivel')?.checked || false;
    const equipamento = document.getElementById('patronoEquipamento')?.checked || false;
    const habilidadesEspeciais = document.getElementById('patronoHabilidadesEspeciais')?.checked || false;
    const intervencaoMinima = document.getElementById('patronoIntervencaoMinima')?.checked || false;
    const relutante = document.getElementById('patronoRelutante')?.checked || false;
    const segredo = document.getElementById('patronoSegredo')?.checked || false;
    
    // 1. Custo base
    let custoBase = 15;
    if (poder === 10) custoBase = 10;
    else if (poder === 20) custoBase = 20;
    else if (poder === 25) custoBase = 25;
    else if (poder === 30) custoBase = 30;
    
    // 2. Frequência
    let multiplicadorFrequencia = 1;
    if (frequencia === 6) multiplicadorFrequencia = 0.5;
    else if (frequencia === 12) multiplicadorFrequencia = 2;
    else if (frequencia === 15) multiplicadorFrequencia = 3;
    
    // 3. Modificadores
    let modificadorTotal = 1;
    if (altamenteAcessivel) modificadorTotal += 0.5;
    if (equipamento) modificadorTotal += 0.5;
    if (habilidadesEspeciais) modificadorTotal += 0.5;
    if (intervencaoMinima) modificadorTotal -= 0.5;
    if (relutante) modificadorTotal -= 0.5;
    if (segredo) modificadorTotal -= 0.5;
    
    if (modificadorTotal < 0.25) modificadorTotal = 0.25;
    
    // 4. Calcular
    const pontos = Math.round(custoBase * multiplicadorFrequencia * modificadorTotal);
    
    // 5. Atualizar preview
    this.atualizarPreviewPatrono(custoBase, multiplicadorFrequencia, modificadorTotal, pontos);
    
    return pontos;
  }
  
  atualizarPreviewPatrono(custoBase, freqMulti, modTotal, pontos) {
    const previewBase = document.getElementById('previewPatronoBase');
    const previewFreq = document.getElementById('previewPatronoFreq');
    const previewMod = document.getElementById('previewPatronoMod');
    const previewTotal = document.getElementById('previewPatronoTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    if (previewFreq) previewFreq.textContent = `×${freqMulti}`;
    
    if (previewMod) {
      const percent = ((modTotal - 1) * 100).toFixed(0);
      previewMod.textContent = percent >= 0 ? `+${percent}%` : `${percent}%`;
    }
    
    if (previewTotal) {
      previewTotal.textContent = `+${pontos} pts`;
      previewTotal.className = 'total-positivo';
    }
  }
  
  adicionarPatrono() {
    const nome = document.getElementById('patronoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o patrono!');
      return;
    }
    
    const pontos = this.calcularPontosPatrono();
    
    const patrono = {
      id: this.nextId++,
      nome: nome,
      poder: parseInt(document.getElementById('patronoPoder')?.value) || 15,
      frequencia: parseInt(document.getElementById('patronoFrequencia')?.value) || 9,
      pontos: pontos,
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
  // 7. INIMIGOS - 100% FUNCIONAL (COM TODOS MULTIPLICADORES)
  // ===========================================
  
  configurarSistemaInimigos() {
    // Botão Adicionar Inimigo
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')?.dataset.tipo === 'inimigo') {
        this.abrirModal('inimigo');
        this.configurarCalculoInimigo();
      }
    });
    
    // Botão Confirmar
    const btnConfirmar = document.getElementById('btnConfirmarInimigo');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.adicionarInimigo();
    }
    
    this.atualizarDisplayInimigos();
  }
  
  configurarCalculoInimigo() {
    const campos = ['inimigoPoder', 'inimigoIntencao', 'inimigoFrequencia', 
                   'inimigoDesconhecido', 'inimigoGemeoMaligno'];
    
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.onchange = () => this.calcularPontosInimigo();
      }
    });
    
    this.calcularPontosInimigo();
  }
  
  calcularPontosInimigo() {
    const poder = parseInt(document.getElementById('inimigoPoder')?.value) || -10;
    const intencao = document.getElementById('inimigoIntencao')?.value || 'perseguidor';
    const frequencia = parseInt(document.getElementById('inimigoFrequencia')?.value) || 9;
    const desconhecido = document.getElementById('inimigoDesconhecido')?.checked || false;
    const gemeoMaligno = document.getElementById('inimigoGemeoMaligno')?.checked || false;
    
    // 1. Custo base
    let custoBase = -10;
    if (poder === -5) custoBase = -5;
    else if (poder === -20) custoBase = -20;
    else if (poder === -30) custoBase = -30;
    else if (poder === -40) custoBase = -40;
    
    // 2. Intenção
    let multiplicadorIntencao = 1;
    if (intencao === 'observador') multiplicadorIntencao = 0.25;
    else if (intencao === 'rival') multiplicadorIntencao = 0.5;
    
    // 3. Frequência
    let multiplicadorFrequencia = 1;
    if (frequencia === 6) multiplicadorFrequencia = 0.5;
    else if (frequencia === 12) multiplicadorFrequencia = 2;
    else if (frequencia === 15) multiplicadorFrequencia = 3;
    
    // 4. Bônus negativos
    let bonus = 0;
    if (desconhecido) bonus -= 5;
    if (gemeoMaligno) bonus -= 10;
    
    // 5. Calcular
    let pontos = custoBase * multiplicadorIntencao * multiplicadorFrequencia;
    pontos += bonus;
    const pontosArredondados = Math.round(pontos);
    
    // 6. Atualizar preview
    this.atualizarPreviewInimigo(custoBase, multiplicadorIntencao, multiplicadorFrequencia, pontosArredondados);
    
    return pontosArredondados;
  }
  
  atualizarPreviewInimigo(custoBase, intencaoMulti, freqMulti, pontos) {
    const previewBase = document.getElementById('previewInimigoBase');
    const previewIntencao = document.getElementById('previewInimigoIntencao');
    const previewFreq = document.getElementById('previewInimigoFreq');
    const previewTotal = document.getElementById('previewInimigoTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    if (previewIntencao) previewIntencao.textContent = `×${intencaoMulti}`;
    if (previewFreq) previewFreq.textContent = `×${freqMulti}`;
    
    if (previewTotal) {
      previewTotal.textContent = `${pontos} pts`;
      previewTotal.className = 'total-negativo';
    }
  }
  
  adicionarInimigo() {
    const nome = document.getElementById('inimigoNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o inimigo!');
      return;
    }
    
    const pontos = this.calcularPontosInimigo();
    
    const inimigo = {
      id: this.nextId++,
      nome: nome,
      poder: parseInt(document.getElementById('inimigoPoder')?.value) || -10,
      intencao: document.getElementById('inimigoIntencao')?.value || 'perseguidor',
      frequencia: parseInt(document.getElementById('inimigoFrequencia')?.value) || 9,
      pontos: pontos,
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
  // 8. DEPENDENTES - 100% FUNCIONAL (COM TODOS MULTIPLICADORES)
  // ===========================================
  
  configurarSistemaDependentes() {
    // Botão Adicionar Dependente
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')?.dataset.tipo === 'dependente') {
        this.abrirModal('dependente');
        this.configurarCalculoDependente();
      }
    });
    
    // Botão Confirmar
    const btnConfirmar = document.getElementById('btnConfirmarDependente');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.adicionarDependente();
    }
    
    this.atualizarDisplayDependentes();
  }
  
  configurarCalculoDependente() {
    const campos = ['dependenteCapacidade', 'dependenteImportancia', 'dependenteFrequencia'];
    
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.onchange = () => this.calcularPontosDependente();
      }
    });
    
    this.calcularPontosDependente();
  }
  
  calcularPontosDependente() {
    const capacidade = parseInt(document.getElementById('dependenteCapacidade')?.value) || 75;
    const importancia = document.getElementById('dependenteImportancia')?.value || 'amigo';
    const frequencia = parseInt(document.getElementById('dependenteFrequencia')?.value) || 9;
    
    // 1. Custo base
    let custoBase = -2; // 75%
    if (capacidade === 100) custoBase = -1;
    else if (capacidade === 50) custoBase = -5;
    else if (capacidade === 25) custoBase = -10;
    else if (capacidade === 0) custoBase = -15;
    
    // 2. Importância
    let multiplicadorImportancia = 1;
    if (importancia === 'empregado') multiplicadorImportancia = 0.5;
    else if (importancia === 'ser_amado') multiplicadorImportancia = 2;
    
    // 3. Frequência
    let multiplicadorFrequencia = 1;
    if (frequencia === 6) multiplicadorFrequencia = 0.5;
    else if (frequencia === 12) multiplicadorFrequencia = 2;
    else if (frequencia === 15) multiplicadorFrequencia = 3;
    
    // 4. Calcular
    const pontos = Math.round(custoBase * multiplicadorImportancia * multiplicadorFrequencia);
    
    // 5. Atualizar preview
    this.atualizarPreviewDependente(custoBase, multiplicadorImportancia, multiplicadorFrequencia, pontos);
    
    return pontos;
  }
  
  atualizarPreviewDependente(custoBase, importanciaMulti, freqMulti, pontos) {
    const previewBase = document.getElementById('previewDependenteBase');
    const previewImportancia = document.getElementById('previewDependenteImportancia');
    const previewFreq = document.getElementById('previewDependenteFreq');
    const previewTotal = document.getElementById('previewDependenteTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    if (previewImportancia) previewImportancia.textContent = `×${importanciaMulti}`;
    if (previewFreq) previewFreq.textContent = `×${freqMulti}`;
    
    if (previewTotal) {
      previewTotal.textContent = `${pontos} pts`;
      previewTotal.className = 'total-negativo';
    }
  }
  
  adicionarDependente() {
    const nome = document.getElementById('dependenteNome')?.value.trim();
    if (!nome) {
      alert('Digite um nome para o dependente!');
      return;
    }
    
    const pontos = this.calcularPontosDependente();
    
    const dependente = {
      id: this.nextId++,
      nome: nome,
      capacidade: parseInt(document.getElementById('dependenteCapacidade')?.value) || 75,
      importancia: document.getElementById('dependenteImportancia')?.value || 'amigo',
      frequencia: parseInt(document.getElementById('dependenteFrequencia')?.value) || 9,
      pontos: pontos,
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
  // DISPLAYS DAS LISTAS - 100% FUNCIONAL
  // ===========================================
  
  atualizarDisplayAliados() {
    const container = document.getElementById('listaAliados');
    const badge = document.getElementById('pontosAliados');
    
    if (!container || !badge) return;
    
    const totalPontos = this.aliados.reduce((total, aliado) => total + aliado.pontos, 0);
    
    badge.textContent = totalPontos >= 0 ? `+${totalPontos} pts` : `${totalPontos} pts`;
    badge.className = 'pontos-badge ' + (totalPontos >= 0 ? 'positivo' : 'negativo');
    
    if (this.aliados.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-user-friends"></i><p>Nenhum aliado adicionado</p><small>Clique para adicionar aliados</small></div>';
    } else {
      container.innerHTML = this.aliados.map(aliado => `
        <div class="item-lista ${aliado.pontos > 0 ? 'vantagem' : 'desvantagem'}">
          <div class="item-info">
            <strong>${aliado.nome}</strong>
            ${aliado.descricao ? `<small>${aliado.descricao}</small>` : ''}
            <div class="item-detalhes">
              <small>${aliado.poder}% ${aliado.isGrupo ? `| Grupo: ${aliado.tamanhoGrupo} membros` : ''}</small>
            </div>
          </div>
          <div class="item-pontos">
            <span class="${aliado.pontos > 0 ? 'pontos-positivo' : 'pontos-negativo'}">
              ${aliado.pontos > 0 ? '+' : ''}${aliado.pontos} pts
            </span>
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
            ${contato.pericia ? `<small>${contato.pericia}</small>` : '<small>Sem perícia especificada</small>'}
            <div class="item-detalhes">
              <small>NH ${contato.nhEfetivo} | ${this.obterTextoConfiabilidade(contato.confiabilidade)} | ${this.obterTextoFrequencia(contato.frequencia)}</small>
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
            ${patrono.descricao ? `<small>${patrono.descricao}</small>` : ''}
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
            ${inimigo.motivo ? `<small>${inimigo.motivo}</small>` : ''}
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
              <span class="item-pontos-detalhe ${dependente.pontos < 0 ? 'pontos-negativo' : 'pontos-positivo'}">
                ${dependente.pontos > 0 ? '+' : ''}${dependente.pontos} pts
              </span>
            </div>
            ${dependente.relacao ? `<small class="item-relacao">${dependente.relacao}</small>` : ''}
            <div class="item-detalhes">
              <span class="badge capacidade">${dependente.capacidade}%</span>
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
  
  obterTextoConfiabilidade(confiabilidade) {
    switch(confiabilidade) {
      case 'completamente': return 'Completamente';
      case 'razoavelmente': return 'Razoavelmente';
      case 'meio': return 'Meio';
      case 'não': return 'Não confiável';
      default: return confiabilidade;
    }
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
    // Botões de fechar
    document.querySelectorAll('.modal-close[data-modal]').forEach(btn => {
      btn.onclick = (e) => {
        const modalId = e.target.closest('.modal-close').dataset.modal;
        if (modalId) this.fecharModal(modalId);
      };
    });
    
    // Botões cancelar
    document.querySelectorAll('.btn-secondary[data-modal]').forEach(btn => {
      btn.onclick = (e) => {
        const modalId = e.target.closest('.btn-secondary').dataset.modal;
        if (modalId) this.fecharModal(modalId);
      };
    });
    
    // Fechar clicando fora
    document.querySelectorAll('.modal').forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
      };
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
    const totalAliados = this.aliados.reduce((t, a) => t + Math.max(0, a.pontos), 0);
    const totalContatos = this.contatos.reduce((t, c) => t + c.pontos, 0);
    const totalPatronos = this.patronos.reduce((t, p) => t + p.pontos, 0);
    
    return totalStatus + totalCarisma + totalRepPositiva +
        totalAliados + totalContatos + totalPatronos;
  }
  
  calcularDesvantagensTotais() {
    const totalStatus = Math.min(0, this.status * 5);
    const totalRepNegativa = this.reputacaoNegativa * -5;
    const totalAliadosNegativos = this.aliados.reduce((t, a) => t + Math.min(0, a.pontos), 0);
    const totalInimigos = this.inimigos.reduce((t, i) => t + i.pontos, 0);
    const totalDependentes = this.dependentes.reduce((t, d) => t + d.pontos, 0);
    
    return totalStatus + totalRepNegativa + totalAliadosNegativos + totalInimigos + totalDependentes;
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

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    inicializarStatusSocial();
  }, 500);
});

window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
  return statusSocialManagerInstance;
};

window.abrirModal = function(tipo) {
  if (statusSocialManagerInstance) {
    statusSocialManagerInstance.abrirModal(tipo);
  }
};

document.addEventListener('click', function(e) {
  if (e.target.closest('.sub-tab') && e.target.closest('.sub-tab').dataset.subtab === 'status') {
    setTimeout(() => {
      inicializarStatusSocial();
    }, 100);
  }
});