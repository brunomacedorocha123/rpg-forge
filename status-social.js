// ===========================================
// STATUS-SOCIAL.JS - Sistema Completo e FUNCIONAL
// ===========================================

class StatusSocialManager {
    constructor() {
        // ===== SISTEMAS BÁSICOS =====
        this.status = 0;
        this.carisma = 0;
        this.reputacaoPositiva = 0;
        this.reputacaoNegativa = 0;
        this.grupoRepPositiva = '';
        this.grupoRepNegativa = '';
        
        // ===== SISTEMAS COMPLEXOS =====
        this.aliados = [];
        this.contatos = [];
        this.patronos = [];
        this.inimigos = [];
        this.dependentes = [];
        
        this.nextId = 1;
        this.inicializado = false;
        this.pontosManager = null;
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        console.log('Inicializando StatusSocialManager...');
        
        // Configurar todos os sistemas
        this.configurarStatusSocial();
        this.configurarCarisma();
        this.configurarReputacao();
        
        // Configurar sistemas de lista
        this.configurarSistemaAliados();
        this.configurarSistemaContatos();
        this.configurarSistemaPatronos();
        this.configurarSistemaInimigos();
        this.configurarSistemaDependentes();
        
        // Configurar eventos dos modais
        this.configurarModais();
        
        // Carregar e atualizar
        this.carregarLocalStorage();
        this.atualizarTodosDisplays();
        this.atualizarSistemaPontos();
        
        this.inicializado = true;
    }
    
    // ===========================================
    // 1. STATUS SOCIAL
    // ===========================================
    configurarStatusSocial() {
        const minusBtn = document.querySelector('.btn-controle.minus[data-tipo="status"]');
        const plusBtn = document.querySelector('.btn-controle.plus[data-tipo="status"]');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarStatus(-1));
            plusBtn.addEventListener('click', () => this.ajustarStatus(1));
            this.atualizarDisplayStatus();
        }
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
        const minusBtn = document.querySelector('.btn-controle.minus[data-tipo="carisma"]');
        const plusBtn = document.querySelector('.btn-controle.plus[data-tipo="carisma"]');
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => this.ajustarCarisma(-1));
            plusBtn.addEventListener('click', () => this.ajustarCarisma(1));
            this.atualizarDisplayCarisma();
        }
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
        document.querySelectorAll('.btn-controle[data-tipo="positiva"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = e.target.classList.contains('minus') ? -1 : 1;
                this.ajustarReputacao('positiva', delta);
            });
        });
        
        document.querySelectorAll('.btn-controle[data-tipo="negativa"]').forEach(btn => {
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
    // 4. SISTEMA DE ALIADOS
    // ===========================================
    configurarSistemaAliados() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="aliado"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('aliado'));
        }
        
        this.atualizarDisplayAliados();
    }
    
    abrirModal(tipo) {
        const modal = document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (modal) {
            modal.style.display = 'block';
            
            // Configurar eventos específicos do modal
            if (tipo === 'aliado') this.configurarModalAliado();
            else if (tipo === 'contato') this.configurarModalContato();
            else if (tipo === 'patrono') this.configurarModalPatrono();
            else if (tipo === 'inimigo') this.configurarModalInimigo();
            else if (tipo === 'dependente') this.configurarModalDependente();
        }
    }
    
    configurarModalAliado() {
        const checkboxGrupo = document.getElementById('aliadoGrupo');
        const grupoContainer = document.getElementById('grupoAliadoContainer');
        
        if (checkboxGrupo && grupoContainer) {
            checkboxGrupo.addEventListener('change', () => {
                grupoContainer.style.display = checkboxGrupo.checked ? 'block' : 'none';
                this.atualizarPreviewAliado();
            });
        }
        
        // Atualizar preview quando mudar valores
        ['aliadoPoder', 'aliadoFrequencia', 'aliadoTamanhoGrupo'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.atualizarPreviewAliado());
            }
        });
        
        // Configurar botão confirmar
        const btnConfirmar = document.getElementById('btnConfirmarAliado');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => this.adicionarAliado());
        }
        
        this.atualizarPreviewAliado();
    }
    
    atualizarPreviewAliado() {
        const poder = parseInt(document.getElementById('aliadoPoder')?.value) || 100;
        const frequencia = parseInt(document.getElementById('aliadoFrequencia')?.value) || 9;
        const isGrupo = document.getElementById('aliadoGrupo')?.checked || false;
        const tamanhoGrupo = parseInt(document.getElementById('aliadoTamanhoGrupo')?.value) || 1;
        
        const pontos = this.calcularCustoAliado(poder, frequencia, isGrupo, tamanhoGrupo);
        
        const previewBase = document.getElementById('previewCustoBase');
        const previewFreq = document.getElementById('previewFrequencia');
        const previewTotal = document.getElementById('previewCustoTotal');
        
        if (previewBase) previewBase.textContent = this.obterCustoBaseAliado(poder) + ' pts';
        if (previewFreq) previewFreq.textContent = `×${this.obterMultiplicadorFrequencia(frequencia)}`;
        if (previewTotal) {
            previewTotal.textContent = `+${pontos} pts`;
            previewTotal.className = 'total-positivo';
        }
    }
    
    obterCustoBaseAliado(poder) {
        if (poder <= 25) return 1;
        if (poder <= 50) return 2;
        if (poder <= 75) return 3;
        if (poder <= 100) return 5;
        if (poder <= 150) return 10;
        return 0;
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
        
        const pontos = this.calcularCustoAliado(poder, frequencia, isGrupo, tamanhoGrupo);
        
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
        
        // Fechar modal e limpar
        this.fecharModal('aliado');
        document.getElementById('aliadoNome').value = '';
        document.getElementById('aliadoDescricao').value = '';
        
        // Atualizar displays
        this.atualizarDisplayAliados();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    calcularCustoAliado(pontosPercentual, frequencia, grupo = false, tamanhoGrupo = 1) {
        let custoBase = this.obterCustoBaseAliado(pontosPercentual);
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        let multGrupo = 1;
        if (grupo && tamanhoGrupo > 5) {
            if (tamanhoGrupo <= 10) multGrupo = 6;
            else if (tamanhoGrupo <= 20) multGrupo = 8;
            else if (tamanhoGrupo <= 50) multGrupo = 10;
            else if (tamanhoGrupo <= 100) multGrupo = 12;
        }
        
        return custoBase * multFrequencia * multGrupo;
    }
    
    atualizarDisplayAliados() {
        const container = document.getElementById('listaAliados');
        const badge = document.getElementById('pontosAliados');
        
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
    
    // ===========================================
    // 5. SISTEMA DE CONTATOS
    // ===========================================
    configurarSistemaContatos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="contato"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('contato'));
        }
        
        this.atualizarDisplayContatos();
    }
    
    configurarModalContato() {
        // Atualizar preview
        ['contatoNHEfetivo', 'contatoFrequencia', 'contatoConfiabilidade'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.atualizarPreviewContato());
            }
        });
        
        // Botão confirmar
        const btnConfirmar = document.getElementById('btnConfirmarContato');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => this.adicionarContato());
        }
        
        this.atualizarPreviewContato();
    }
    
    atualizarPreviewContato() {
        const nhEfetivo = parseInt(document.getElementById('contatoNHEfetivo')?.value) || 15;
        const frequencia = parseInt(document.getElementById('contatoFrequencia')?.value) || 9;
        const confiabilidade = document.getElementById('contatoConfiabilidade')?.value || 'razoavelmente';
        
        const pontos = this.calcularCustoContato(nhEfetivo, frequencia, confiabilidade);
        
        const previewBase = document.getElementById('previewContatoBase');
        const previewFreq = document.getElementById('previewContatoFreq');
        const previewConf = document.getElementById('previewContatoConf');
        const previewTotal = document.getElementById('previewContatoTotal');
        
        if (previewBase) previewBase.textContent = this.obterCustoBaseContato(nhEfetivo) + ' pts';
        if (previewFreq) previewFreq.textContent = `×${this.obterMultiplicadorFrequencia(frequencia)}`;
        if (previewConf) {
            const mult = this.obterMultiplicadorConfiabilidade(confiabilidade);
            previewConf.textContent = `×${mult}`;
        }
        if (previewTotal) {
            previewTotal.textContent = `+${pontos} pts`;
            previewTotal.className = 'total-positivo';
        }
    }
    
    obterCustoBaseContato(nhEfetivo) {
        switch(nhEfetivo) {
            case 12: return 1;
            case 15: return 2;
            case 18: return 3;
            case 20: return 4;
            default: return 0;
        }
    }
    
    obterMultiplicadorConfiabilidade(confiabilidade) {
        switch(confiabilidade) {
            case 'completamente': return 3;
            case 'razoavelmente': return 2;
            case 'meio': return 1;
            case 'não': return 0.5;
            default: return 1;
        }
    }
    
    adicionarContato() {
        const nome = document.getElementById('contatoNome')?.value.trim();
        if (!nome) {
            alert('Digite um nome para o contato!');
            return;
        }
        
        const tipo = document.getElementById('contatoTipo')?.value || 'outro';
        const pericia = document.getElementById('contatoPericia')?.value || '';
        const nhEfetivo = parseInt(document.getElementById('contatoNHEfetivo')?.value) || 15;
        const frequencia = parseInt(document.getElementById('contatoFrequencia')?.value) || 9;
        const confiabilidade = document.getElementById('contatoConfiabilidade')?.value || 'razoavelmente';
        
        const pontos = this.calcularCustoContato(nhEfetivo, frequencia, confiabilidade);
        
        const contato = {
            id: this.nextId++,
            nome: nome,
            tipo: tipo,
            pericia: pericia,
            nhEfetivo: nhEfetivo,
            frequencia: frequencia,
            confiabilidade: confiabilidade,
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
    
    calcularCustoContato(nhEfetivo, frequencia, confiabilidade) {
        const custoBase = this.obterCustoBaseContato(nhEfetivo);
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        const multConfiabilidade = this.obterMultiplicadorConfiabilidade(confiabilidade);
        
        return Math.ceil(custoBase * multFrequencia * multConfiabilidade);
    }
    
    atualizarDisplayContatos() {
        const container = document.getElementById('listaContatos');
        const badge = document.getElementById('pontosContatos');
        
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
    
    // ===========================================
    // 6. SISTEMA DE PATRONOS
    // ===========================================
    configurarSistemaPatronos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="patrono"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('patrono'));
        }
        
        this.atualizarDisplayPatronos();
    }
    
    configurarModalPatrono() {
        // Atualizar preview
        ['patronoPoder', 'patronoFrequencia'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.atualizarPreviewPatrono());
            }
        });
        
        // Checkboxes de ampliações e limitações
        ['patronoAltamenteAcessivel', 'patronoEquipamento', 'patronoHabilidadesEspeciais',
         'patronoIntervencaoMinima', 'patronoRelutante', 'patronoSegredo'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.atualizarPreviewPatrono());
            }
        });
        
        // Botão confirmar
        const btnConfirmar = document.getElementById('btnConfirmarPatrono');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => this.adicionarPatrono());
        }
        
        this.atualizarPreviewPatrono();
    }
    
    atualizarPreviewPatrono() {
        const poder = parseInt(document.getElementById('patronoPoder')?.value) || 15;
        const frequencia = parseInt(document.getElementById('patronoFrequencia')?.value) || 9;
        
        const ampliacoes = [];
        const limitacoes = [];
        
        if (document.getElementById('patronoAltamenteAcessivel')?.checked) ampliacoes.push('altamente_acessivel');
        if (document.getElementById('patronoEquipamento')?.checked) ampliacoes.push('equipamento');
        if (document.getElementById('patronoHabilidadesEspeciais')?.checked) ampliacoes.push('habilidades_especiais');
        if (document.getElementById('patronoIntervencaoMinima')?.checked) limitacoes.push('intervencao_minima');
        if (document.getElementById('patronoRelutante')?.checked) limitacoes.push('relutante');
        if (document.getElementById('patronoSegredo')?.checked) limitacoes.push('segredo');
        
        const pontos = this.calcularCustoPatrono(poder, frequencia, ampliacoes, limitacoes);
        
        const previewBase = document.getElementById('previewPatronoBase');
        const previewFreq = document.getElementById('previewPatronoFreq');
        const previewMod = document.getElementById('previewPatronoMod');
        const previewTotal = document.getElementById('previewPatronoTotal');
        
        if (previewBase) previewBase.textContent = poder + ' pts';
        if (previewFreq) previewFreq.textContent = `×${this.obterMultiplicadorFrequencia(frequencia)}`;
        if (previewMod) {
            const modTotal = ampliacoes.length * 0.5 - limitacoes.length * 0.5;
            previewMod.textContent = `${modTotal >= 0 ? '+' : ''}${modTotal * 100}%`;
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
        
        const poder = parseInt(document.getElementById('patronoPoder')?.value) || 15;
        const frequencia = parseInt(document.getElementById('patronoFrequencia')?.value) || 9;
        const descricao = document.getElementById('patronoDescricao')?.value || '';
        
        const ampliacoes = [];
        const limitacoes = [];
        
        if (document.getElementById('patronoAltamenteAcessivel')?.checked) ampliacoes.push('altamente_acessivel');
        if (document.getElementById('patronoEquipamento')?.checked) ampliacoes.push('equipamento');
        if (document.getElementById('patronoHabilidadesEspeciais')?.checked) ampliacoes.push('habilidades_especiais');
        if (document.getElementById('patronoIntervencaoMinima')?.checked) limitacoes.push('intervencao_minima');
        if (document.getElementById('patronoRelutante')?.checked) limitacoes.push('relutante');
        if (document.getElementById('patronoSegredo')?.checked) limitacoes.push('segredo');
        
        const pontos = this.calcularCustoPatrono(poder, frequencia, ampliacoes, limitacoes);
        
        const patrono = {
            id: this.nextId++,
            nome: nome,
            poder: poder,
            frequencia: frequencia,
            ampliacoes: ampliacoes,
            limitacoes: limitacoes,
            pontos: pontos,
            descricao: descricao,
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
    
    calcularCustoPatrono(nivelPoder, frequencia, ampliacoes = [], limitacoes = []) {
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        let custoTotal = nivelPoder * multFrequencia;
        
        // Aplicar ampliações
        ampliacoes.forEach(amp => {
            custoTotal *= 1.5; // +50% cada
        });
        
        // Aplicar limitações
        limitacoes.forEach(lim => {
            custoTotal *= 0.5; // -50% cada
        });
        
        return Math.round(custoTotal);
    }
    
    atualizarDisplayPatronos() {
        const container = document.getElementById('listaPatronos');
        const badge = document.getElementById('pontosPatronos');
        
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
    
    // ===========================================
    // 7. SISTEMA DE INIMIGOS
    // ===========================================
    configurarSistemaInimigos() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="inimigo"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('inimigo'));
        }
        
        this.atualizarDisplayInimigos();
    }
    
    configurarModalInimigo() {
        // Atualizar preview
        ['inimigoPoder', 'inimigoIntencao', 'inimigoFrequencia'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.atualizarPreviewInimigo());
            }
        });
        
        // Checkboxes de casos especiais
        ['inimigoDesconhecido', 'inimigoGemeoMaligno'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.atualizarPreviewInimigo());
            }
        });
        
        // Botão confirmar
        const btnConfirmar = document.getElementById('btnConfirmarInimigo');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => this.adicionarInimigo());
        }
        
        this.atualizarPreviewInimigo();
    }
    
    atualizarPreviewInimigo() {
        const poder = parseInt(document.getElementById('inimigoPoder')?.value) || -10;
        const intencao = document.getElementById('inimigoIntencao')?.value || 'perseguidor';
        const frequencia = parseInt(document.getElementById('inimigoFrequencia')?.value) || 9;
        
        const casoEspecial = document.getElementById('inimigoDesconhecido')?.checked ? 'desconhecido' :
                            document.getElementById('inimigoGemeoMaligno')?.checked ? 'gêmeo_maligno' : null;
        
        const pontos = this.calcularCustoInimigo(poder, intencao, frequencia, casoEspecial);
        
        const previewBase = document.getElementById('previewInimigoBase');
        const previewIntencao = document.getElementById('previewInimigoIntencao');
        const previewFreq = document.getElementById('previewInimigoFreq');
        const previewTotal = document.getElementById('previewInimigoTotal');
        
        if (previewBase) previewBase.textContent = `${poder} pts`;
        if (previewIntencao) {
            const mult = this.obterMultiplicadorIntencao(intencao);
            previewIntencao.textContent = `×${mult}`;
        }
        if (previewFreq) previewFreq.textContent = `×${this.obterMultiplicadorFrequencia(frequencia)}`;
        if (previewTotal) {
            previewTotal.textContent = `${pontos} pts`;
            previewTotal.className = 'total-negativo';
        }
    }
    
    obterMultiplicadorIntencao(intencao) {
        switch(intencao) {
            case 'observador': return 0.25;
            case 'rival': return 0.5;
            case 'perseguidor': return 1;
            default: return 1;
        }
    }
    
    adicionarInimigo() {
        const nome = document.getElementById('inimigoNome')?.value.trim();
        if (!nome) {
            alert('Digite um nome para o inimigo!');
            return;
        }
        
        const poder = parseInt(document.getElementById('inimigoPoder')?.value) || -10;
        const intencao = document.getElementById('inimigoIntencao')?.value || 'perseguidor';
        const frequencia = parseInt(document.getElementById('inimigoFrequencia')?.value) || 9;
        const motivo = document.getElementById('inimigoMotivo')?.value || '';
        const descricao = document.getElementById('inimigoDescricao')?.value || '';
        
        const casoEspecial = document.getElementById('inimigoDesconhecido')?.checked ? 'desconhecido' :
                            document.getElementById('inimigoGemeoMaligno')?.checked ? 'gêmeo_maligno' : null;
        
        const pontos = this.calcularCustoInimigo(poder, intencao, frequencia, casoEspecial);
        
        const inimigo = {
            id: this.nextId++,
            nome: nome,
            poder: poder,
            intencao: intencao,
            frequencia: frequencia,
            casoEspecial: casoEspecial,
            motivo: motivo,
            pontos: pontos,
            descricao: descricao,
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
    
    calcularCustoInimigo(nivelPoder, intencao, frequencia, casoEspecial = null) {
        let custoBase = nivelPoder;
        
        // Casos especiais
        if (casoEspecial === 'desconhecido') custoBase -= 5;
        if (casoEspecial === 'gêmeo_maligno') custoBase -= 10;
        
        const multIntencao = this.obterMultiplicadorIntencao(intencao);
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        return Math.round(custoBase * multIntencao * multFrequencia);
    }
    
    atualizarDisplayInimigos() {
        const container = document.getElementById('listaInimigos');
        const badge = document.getElementById('pontosInimigos');
        
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
    
    obterTextoIntencao(intencao) {
        switch(intencao) {
            case 'observador': return 'Observador';
            case 'rival': return 'Rival';
            case 'perseguidor': return 'Perseguidor';
            default: return intencao;
        }
    }
    
    // ===========================================
    // 8. SISTEMA DE DEPENDENTES
    // ===========================================
    configurarSistemaDependentes() {
        const btnAdicionar = document.querySelector('.btn-add[data-tipo="dependente"]');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.abrirModal('dependente'));
        }
        
        this.atualizarDisplayDependentes();
    }
    
    configurarModalDependente() {
        // Atualizar preview
        ['dependenteCapacidade', 'dependenteImportancia', 'dependenteFrequencia'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.atualizarPreviewDependente());
            }
        });
        
        // Botão confirmar
        const btnConfirmar = document.getElementById('btnConfirmarDependente');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => this.adicionarDependente());
        }
        
        this.atualizarPreviewDependente();
    }
    
    atualizarPreviewDependente() {
        const capacidade = parseInt(document.getElementById('dependenteCapacidade')?.value) || 75;
        const importancia = document.getElementById('dependenteImportancia')?.value || 'amigo';
        const frequencia = parseInt(document.getElementById('dependenteFrequencia')?.value) || 9;
        
        const pontos = this.calcularCustoDependente(capacidade, importancia, frequencia);
        
        const previewBase = document.getElementById('previewDependenteBase');
        const previewImportancia = document.getElementById('previewDependenteImportancia');
        const previewFreq = document.getElementById('previewDependenteFreq');
        const previewTotal = document.getElementById('previewDependenteTotal');
        
        if (previewBase) previewBase.textContent = this.obterCustoBaseDependente(capacidade) + ' pts';
        if (previewImportancia) {
            const mult = this.obterMultiplicadorImportancia(importancia);
            previewImportancia.textContent = `×${mult}`;
        }
        if (previewFreq) previewFreq.textContent = `×${this.obterMultiplicadorFrequencia(frequencia)}`;
        if (previewTotal) {
            previewTotal.textContent = `${pontos} pts`;
            previewTotal.className = 'total-negativo';
        }
    }
    
    obterCustoBaseDependente(capacidade) {
        if (capacidade <= 100) return -1;
        if (capacidade <= 75) return -2;
        if (capacidade <= 50) return -5;
        if (capacidade <= 25) return -10;
        if (capacidade <= 0) return -15;
        return 0;
    }
    
    obterMultiplicadorImportancia(importancia) {
        switch(importancia) {
            case 'empregado': return 0.5;
            case 'amigo': return 1;
            case 'ser_amado': return 2;
            default: return 1;
        }
    }
    
    adicionarDependente() {
        const nome = document.getElementById('dependenteNome')?.value.trim();
        if (!nome) {
            alert('Digite um nome para o dependente!');
            return;
        }
        
        const capacidade = parseInt(document.getElementById('dependenteCapacidade')?.value) || 75;
        const importancia = document.getElementById('dependenteImportancia')?.value || 'amigo';
        const frequencia = parseInt(document.getElementById('dependenteFrequencia')?.value) || 9;
        const relacao = document.getElementById('dependenteRelacao')?.value || '';
        
        const pontos = this.calcularCustoDependente(capacidade, importancia, frequencia);
        
        const dependente = {
            id: this.nextId++,
            nome: nome,
            capacidade: capacidade,
            importancia: importancia,
            frequencia: frequencia,
            relacao: relacao,
            pontos: pontos,
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
    
    calcularCustoDependente(pontosPercentual, importancia, frequencia) {
        const custoBase = this.obterCustoBaseDependente(pontosPercentual);
        const multImportancia = this.obterMultiplicadorImportancia(importancia);
        const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
        
        return Math.round(custoBase * multImportancia * multFrequencia);
    }
    
    atualizarDisplayDependentes() {
        const container = document.getElementById('listaDependentes');
        const badge = document.getElementById('pontosDependentes');
        
        if (!container || !badge) return;
        
        const totalPontos = this.dependentes.reduce((total, dependente) => total + dependente.pontos, 0);
        
        badge.textContent = `${totalPontos} pts`;
        badge.className = 'pontos-badge negativo';
        
        if (this.dependentes.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum dependente adicionado</div>';
        } else {
            container.innerHTML = this.dependentes.map(dependente => `
                <div class="item-lista desvantagem">
                    <div class="item-info">
                        <strong>${dependente.nome}</strong>
                        <small>${dependente.relacao || ''}</small>
                        <div class="item-detalhes">
                            <small>${this.obterTextoImportancia(dependente.importancia)} | ${this.obterTextoFrequencia(dependente.frequencia)}</small>
                        </div>
                    </div>
                    <div class="item-pontos">
                        <span class="pontos-negativo">${dependente.pontos} pts</span>
                        <button class="btn-remove-item" data-id="${dependente.id}" data-tipo="dependente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    obterTextoImportancia(importancia) {
        switch(importancia) {
            case 'empregado': return 'Empregado/Conhecido';
            case 'amigo': return 'Amigo';
            case 'ser_amado': return 'Ser Amado';
            default: return importancia;
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
                const modalId = e.target.dataset.modal;
                this.fecharModal(modalId);
            });
        });
        
        // Fechar modais ao clicar em cancelar
        document.querySelectorAll('.btn-secondary[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.fecharModal(modalId);
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
        
        // Configurar remoção de itens
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
    
    atualizarTodosDisplays() {
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
        const saldo = totalVantagens + totalDesvantagens; // Desvantagens são negativas
        
        const totalStatusGeral = document.getElementById('totalStatusGeral');
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
    
    atualizarSistemaPontos() {
        // Obter o PontosManager
        this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
        if (!this.pontosManager) {
            console.log('PontosManager não encontrado, tentando inicializar...');
            if (window.inicializarSistemaPontos) {
                this.pontosManager = window.inicializarSistemaPontos();
            }
        }
        
        if (!this.pontosManager) {
            console.error('PontosManager não disponível');
            return;
        }
        
        // Calcular totais
        const vantagens = this.calcularVantagensTotais();
        const desvantagens = Math.abs(this.calcularDesvantagensTotais());
        
        // Atualizar PontosManager
        this.pontosManager.gastos.vantagens = vantagens;
        this.pontosManager.gastos.desvantagens.outras = desvantagens;
        
        // Atualizar display
        this.pontosManager.atualizarTudo();
        
        // Atualizar resumo na aba de Vantagens
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = vantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = desvantagens;
        if (saldoElem) saldoElem.textContent = vantagens - desvantagens;
    }
    
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
                
                // Carregar dados básicos
                this.status = dados.status || 0;
                this.carisma = dados.carisma || 0;
                this.reputacaoPositiva = dados.reputacaoPositiva || 0;
                this.reputacaoNegativa = dados.reputacaoNegativa || 0;
                this.grupoRepPositiva = dados.grupoRepPositiva || '';
                this.grupoRepNegativa = dados.grupoRepNegativa || '';
                
                // Carregar listas
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

// Inicializar quando a aba for ativada
document.addEventListener('DOMContentLoaded', function() {
    // Observar quando a aba Vantagens for ativada
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    console.log('Aba Vantagens ativada, inicializando StatusSocial...');
                    setTimeout(() => {
                        if (!statusSocialManagerInstance) {
                            inicializarStatusSocial();
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
        console.log('Aba Vantagens já ativa no carregamento');
        setTimeout(() => {
            if (!statusSocialManagerInstance) {
                inicializarStatusSocial();
            }
        }, 300);
    }
});

// Exportar para uso global
window.StatusSocialManager = StatusSocialManager;
window.inicializarStatusSocial = inicializarStatusSocial;
window.obterStatusSocialManager = function() {
    return statusSocialManagerInstance;
};