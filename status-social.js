// ===========================================
// STATUS-SOCIAL.JS - VERSÃO 100% COMPLETA
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
        
        console.log('✅ StatusSocialManager inicializando...');
        
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
        console.log('✅ StatusSocialManager inicializado com sucesso!');
    }
    
    // ===========================================
    // 1. STATUS SOCIAL - FUNCIONANDO
    // ===========================================
    configurarStatusSocial() {
        console.log('🔄 Configurando Status Social...');
        
        // Encontrar o card de Status Social (primeiro card)
        const statusCards = document.querySelectorAll('.status-card');
        const statusCard = statusCards[0]; // Primeiro card é Status Social
        
        if (!statusCard) {
            console.error('❌ Card de Status Social não encontrado');
            return;
        }
        
        // Encontrar botões dentro do card
        const minusBtn = statusCard.querySelector('.btn-controle.minus');
        const plusBtn = statusCard.querySelector('.btn-controle.plus');
        
        console.log('Status Social - Botões encontrados:', { minus: !!minusBtn, plus: !!plusBtn });
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => {
                console.log('➖ Status Social: diminuindo');
                this.ajustarStatus(-1);
            });
            
            plusBtn.addEventListener('click', () => {
                console.log('➕ Status Social: aumentando');
                this.ajustarStatus(1);
            });
        } else {
            console.error('❌ Botões de Status Social não encontrados');
        }
        
        this.atualizarDisplayStatus();
    }
    
    ajustarStatus(delta) {
        const novoValor = this.status + delta;
        if (novoValor < -20 || novoValor > 25) {
            console.log(`⚠️ Status Social: limite atingido (${novoValor})`);
            return;
        }
        
        this.status = novoValor;
        console.log(`📊 Status Social atualizado: ${this.status}`);
        
        this.atualizarDisplayStatus();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayStatus() {
        const valorDisplay = document.getElementById('valorStatus');
        const pontosDisplay = document.getElementById('pontosStatus');
        
        if (valorDisplay) {
            valorDisplay.textContent = this.status;
            console.log(`🔢 Status Social valor: ${this.status}`);
        }
        
        if (pontosDisplay) {
            const pontos = this.status * 5;
            const texto = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
            pontosDisplay.textContent = texto;
            pontosDisplay.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
            console.log(`💰 Status Social pontos: ${texto}`);
        }
    }
    
    // ===========================================
    // 2. CARISMA - FUNCIONANDO
    // ===========================================
    configurarCarisma() {
        console.log('🔄 Configurando Carisma...');
        
        // Encontrar o card de Carisma (segundo card)
        const statusCards = document.querySelectorAll('.status-card');
        const carismaCard = statusCards[1]; // Segundo card é Carisma
        
        if (!carismaCard) {
            console.error('❌ Card de Carisma não encontrado');
            return;
        }
        
        // Encontrar botões dentro do card
        const minusBtn = carismaCard.querySelector('.btn-controle.minus');
        const plusBtn = carismaCard.querySelector('.btn-controle.plus');
        
        console.log('Carisma - Botões encontrados:', { minus: !!minusBtn, plus: !!plusBtn });
        
        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => {
                console.log('➖ Carisma: diminuindo');
                this.ajustarCarisma(-1);
            });
            
            plusBtn.addEventListener('click', () => {
                console.log('➕ Carisma: aumentando');
                this.ajustarCarisma(1);
            });
        } else {
            console.error('❌ Botões de Carisma não encontrados');
        }
        
        this.atualizarDisplayCarisma();
    }
    
    ajustarCarisma(delta) {
        const novoValor = this.carisma + delta;
        if (novoValor < 0 || novoValor > 3) {
            console.log(`⚠️ Carisma: limite atingido (${novoValor})`);
            return;
        }
        
        this.carisma = novoValor;
        console.log(`📊 Carisma atualizado: ${this.carisma}`);
        
        this.atualizarDisplayCarisma();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
    }
    
    atualizarDisplayCarisma() {
        const valorDisplay = document.getElementById('valorCarisma');
        const pontosDisplay = document.getElementById('pontosCarisma');
        
        if (valorDisplay) {
            valorDisplay.textContent = this.carisma;
            console.log(`🔢 Carisma valor: ${this.carisma}`);
        }
        
        if (pontosDisplay) {
            const pontos = this.carisma * 5;
            pontosDisplay.textContent = `+${pontos} pts`;
            pontosDisplay.className = 'pontos-badge positivo';
            console.log(`💰 Carisma pontos: +${pontos} pts`);
        }
    }
    
    // ===========================================
    // 3. REPUTAÇÃO - JÁ FUNCIONANDO
    // ===========================================
    configurarReputacao() {
        console.log('🔄 Configurando Reputação...');
        
        // Configurar botões de reputação positiva
        document.querySelectorAll('.btn-controle[data-tipo="positiva"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = e.target.classList.contains('minus') ? -1 : 1;
                console.log(`🎯 Reputação Positiva: ${delta > 0 ? 'aumentando' : 'diminuindo'}`);
                this.ajustarReputacao('positiva', delta);
            });
        });
        
        // Configurar botões de reputação negativa
        document.querySelectorAll('.btn-controle[data-tipo="negativa"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = e.target.classList.contains('minus') ? -1 : 1;
                console.log(`🎯 Reputação Negativa: ${delta > 0 ? 'aumentando' : 'diminuindo'}`);
                this.ajustarReputacao('negativa', delta);
            });
        });
        
        // Configurar grupos alvo
        const grupoPosInput = document.getElementById('grupoPositivo');
        const grupoNegInput = document.getElementById('grupoNegativo');
        
        if (grupoPosInput) {
            grupoPosInput.value = this.grupoRepPositiva;
            grupoPosInput.addEventListener('change', (e) => {
                this.grupoRepPositiva = e.target.value;
                this.salvarLocalStorage();
                console.log(`📝 Grupo Positivo atualizado: ${this.grupoRepPositiva}`);
            });
        }
        
        if (grupoNegInput) {
            grupoNegInput.value = this.grupoRepNegativa;
            grupoNegInput.addEventListener('change', (e) => {
                this.grupoRepNegativa = e.target.value;
                this.salvarLocalStorage();
                console.log(`📝 Grupo Negativo atualizado: ${this.grupoRepNegativa}`);
            });
        }
        
        this.atualizarDisplayReputacao();
    }
    
    ajustarReputacao(tipo, delta) {
        if (tipo === 'positiva') {
            const novoValor = this.reputacaoPositiva + delta;
            if (novoValor >= 0 && novoValor <= 5) {
                this.reputacaoPositiva = novoValor;
                console.log(`📊 Reputação Positiva: ${this.reputacaoPositiva}`);
            }
        } else {
            const novoValor = this.reputacaoNegativa + delta;
            if (novoValor >= 0 && novoValor <= 5) {
                this.reputacaoNegativa = novoValor;
                console.log(`📊 Reputação Negativa: ${this.reputacaoNegativa}`);
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
            btnAdicionar.addEventListener('click', () => {
                console.log('👥 Abrindo modal de Aliado');
                this.abrirModal('aliado');
            });
        }
        
        this.atualizarDisplayAliados();
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
        
        // Atualizar preview quando valores mudam
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
        
        console.log(`✅ Aliado adicionado: ${nome} (${pontos} pts)`);
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
            btnAdicionar.addEventListener('click', () => {
                console.log('📞 Abrindo modal de Contato');
                this.abrirModal('contato');
            });
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
        
        console.log(`✅ Contato adicionado: ${nome} (${pontos} pts)`);
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
            btnAdicionar.addEventListener('click', () => {
                console.log('👑 Abrindo modal de Patrono');
                this.abrirModal('patrono');
            });
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
        
        console.log(`✅ Patrono adicionado: ${nome} (${pontos} pts)`);
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
            btnAdicionar.addEventListener('click', () => {
                console.log('💀 Abrindo modal de Inimigo');
                this.abrirModal('inimigo');
            });
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
        
        console.log(`✅ Inimigo adicionado: ${nome} (${pontos} pts)`);
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
        btnAdicionar.addEventListener('click', () => {
            console.log('❤️ Abrindo modal de Dependente');
            this.abrirModal('dependente');
        });
    }
    
    // Configurar listeners para inputs de capacidade, importância e frequência
    const capacidadeInput = document.getElementById('dependenteCapacidade');
    const importanciaSelect = document.getElementById('dependenteImportancia');
    const frequenciaInput = document.getElementById('dependenteFrequencia');
    
    if (capacidadeInput) {
        capacidadeInput.addEventListener('input', () => {
            this.atualizarPreviewDependente();
            this.atualizarValorCapacidade();
        });
    }
    
    if (importanciaSelect) {
        importanciaSelect.addEventListener('change', () => this.atualizarPreviewDependente());
    }
    
    if (frequenciaInput) {
        frequenciaInput.addEventListener('input', () => {
            this.atualizarPreviewDependente();
            this.atualizarValorFrequencia();
        });
    }
    
    // Configurar botão de confirmação
    const btnConfirmar = document.getElementById('btnConfirmarDependente');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => this.adicionarDependente());
    }
    
    // Configurar botão de cancelar
    const btnCancelar = document.querySelector('#modalDependente .btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => this.fecharModal('dependente'));
    }
    
    // Configurar deleção de dependentes
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-item[data-tipo="dependente"]')) {
            const button = e.target.closest('.btn-remove-item');
            const id = parseInt(button.getAttribute('data-id'));
            this.removerDependente(id);
        }
    });
    
    this.atualizarValorCapacidade();
    this.atualizarValorFrequencia();
    this.atualizarPreviewDependente();
    this.atualizarDisplayDependentes();
}

atualizarValorCapacidade() {
    const input = document.getElementById('dependenteCapacidade');
    const display = document.getElementById('dependenteCapacidadeValor');
    if (input && display) {
        display.textContent = `${input.value}%`;
    }
}

atualizarValorFrequencia() {
    const input = document.getElementById('dependenteFrequencia');
    const display = document.getElementById('dependenteFrequenciaValor');
    if (input && display) {
        const valor = parseInt(input.value);
        display.textContent = `${valor}/10`;
    }
}

atualizarPreviewDependente() {
    const capacidade = parseInt(document.getElementById('dependenteCapacidade')?.value) || 75;
    const importancia = document.getElementById('dependenteImportancia')?.value || 'amigo';
    const frequencia = parseInt(document.getElementById('dependenteFrequencia')?.value) || 9;
    
    const pontos = this.calcularCustoDependente(capacidade, importancia, frequencia);
    const custoBase = this.obterCustoBaseDependente(capacidade);
    const multImportancia = this.obterMultiplicadorImportancia(importancia);
    const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
    
    const previewBase = document.getElementById('previewDependenteBase');
    const previewImportancia = document.getElementById('previewDependenteImportancia');
    const previewFreq = document.getElementById('previewDependenteFreq');
    const previewTotal = document.getElementById('previewDependenteTotal');
    
    if (previewBase) previewBase.textContent = `${custoBase} pts`;
    if (previewImportancia) {
        previewImportancia.textContent = `×${multImportancia}`;
    }
    if (previewFreq) previewFreq.textContent = `×${multFrequencia}`;
    if (previewTotal) {
        previewTotal.textContent = `${pontos} pts`;
        previewTotal.className = pontos < 0 ? 'total-negativo' : 'total-positivo';
    }
    
    // Atualizar descrição da capacidade
    const descCapacidade = document.getElementById('descricaoCapacidade');
    if (descCapacidade) {
        descCapacidade.textContent = this.obterDescricaoCapacidade(capacidade);
    }
}

obterCustoBaseDependente(capacidade) {
    // Corrigido: valores decrescentes conforme a capacidade diminui
    if (capacidade >= 100) return -1;      // 100% - Quase independente
    if (capacidade >= 75) return -2;       // 75-99% - Pouca ajuda necessária
    if (capacidade >= 50) return -5;       // 50-74% - Ajuda moderada
    if (capacidade >= 25) return -10;      // 25-49% - Ajuda significativa
    if (capacidade >= 0) return -15;       // 0-24% - Totalmente dependente
    return -20;                            // Negativo - Incapacitado total
}

obterDescricaoCapacidade(capacidade) {
    if (capacidade >= 100) return "Quase independente";
    if (capacidade >= 75) return "Pouca ajuda necessária";
    if (capacidade >= 50) return "Ajuda moderada";
    if (capacidade >= 25) return "Ajuda significativa";
    if (capacidade >= 0) return "Totalmente dependente";
    return "Incapacitado total";
}

obterMultiplicadorImportancia(importancia) {
    switch(importancia) {
        case 'empregado': return 0.5;
        case 'conhecido': return 0.75;
        case 'amigo': return 1;
        case 'familiar': return 1.5;
        case 'ser_amado': return 2;
        case 'outro': return 1;
        default: return 1;
    }
}

obterMultiplicadorFrequencia(frequencia) {
    // Escala de 1 a 10
    if (frequencia <= 1) return 0.1;    // Raramente (1/10)
    if (frequencia <= 3) return 0.3;    // Pouco frequente (2-3/10)
    if (frequencia <= 5) return 0.5;    // Ocasional (4-5/10)
    if (frequencia <= 7) return 0.7;    // Frequente (6-7/10)
    if (frequencia <= 9) return 0.9;    // Muito frequente (8-9/10)
    return 1.0;                         // Constante (10/10)
}

obterTextoFrequencia(frequencia) {
    if (frequencia <= 1) return "Raramente";
    if (frequencia <= 3) return "Pouco frequente";
    if (frequencia <= 5) return "Ocasional";
    if (frequencia <= 7) return "Frequente";
    if (frequencia <= 9) return "Muito frequente";
    return "Constante";
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
    const detalhes = document.getElementById('dependenteDetalhes')?.value || '';
    
    const pontos = this.calcularCustoDependente(capacidade, importancia, frequencia);
    
    const dependente = {
        id: this.nextId++,
        nome: nome,
        capacidade: capacidade,
        importancia: importancia,
        frequencia: frequencia,
        relacao: relacao,
        detalhes: detalhes,
        pontos: pontos,
        dataAdicao: new Date().toISOString()
    };
    
    this.dependentes.push(dependente);
    
    // Limpar formulário
    this.fecharModal('dependente');
    document.getElementById('dependenteNome').value = '';
    document.getElementById('dependenteRelacao').value = '';
    document.getElementById('dependenteDetalhes').value = '';
    
    // Resetar valores padrão
    document.getElementById('dependenteCapacidade').value = 75;
    document.getElementById('dependenteImportancia').value = 'amigo';
    document.getElementById('dependenteFrequencia').value = 9;
    
    // Atualizar displays
    this.atualizarValorCapacidade();
    this.atualizarValorFrequencia();
    this.atualizarPreviewDependente();
    this.atualizarDisplayDependentes();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
    
    console.log(`✅ Dependente adicionado: ${nome} (${pontos} pts)`);
    this.mostrarNotificacao(`Dependente "${nome}" adicionado!`, 'success');
}

calcularCustoDependente(pontosPercentual, importancia, frequencia) {
    const custoBase = this.obterCustoBaseDependente(pontosPercentual);
    const multImportancia = this.obterMultiplicadorImportancia(importancia);
    const multFrequencia = this.obterMultiplicadorFrequencia(frequencia);
    
    // Arredondar para inteiro
    return Math.round(custoBase * multImportancia * multFrequencia);
}

atualizarDisplayDependentes() {
    const container = document.getElementById('listaDependentes');
    const badge = document.getElementById('pontosDependentes');
    const contador = document.getElementById('contadorDependentes');
    
    if (!container || !badge) return;
    
    const totalPontos = this.dependentes.reduce((total, dependente) => total + dependente.pontos, 0);
    
    // Atualizar badge
    badge.textContent = `${totalPontos} pts`;
    badge.className = totalPontos < 0 ? 'pontos-badge negativo' : 'pontos-badge positivo';
    
    // Atualizar contador
    if (contador) {
        contador.textContent = `(${this.dependentes.length})`;
    }
    
    // Atualizar lista
    if (this.dependentes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>Nenhum dependente adicionado</p>
                <small>Clique no botão "+" para adicionar um dependente</small>
            </div>
        `;
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
                    ${dependente.detalhes ? `<p class="item-descricao">${dependente.detalhes}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-icon btn-edit-item" data-id="${dependente.id}" data-tipo="dependente" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-remove-item" data-id="${dependente.id}" data-tipo="dependente" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Configurar listeners para edição
        this.configurarListenersEdicaoDependentes();
    }
}

obterTextoImportancia(importancia) {
    switch(importancia) {
        case 'empregado': return 'Empregado';
        case 'conhecido': return 'Conhecido';
        case 'amigo': return 'Amigo';
        case 'familiar': return 'Familiar';
        case 'ser_amado': return 'Ser Amado';
        case 'outro': return 'Outro';
        default: return importancia;
    }
}

configurarListenersEdicaoDependentes() {
    document.querySelectorAll('.btn-edit-item[data-tipo="dependente"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            this.editarDependente(id);
        });
    });
}

editarDependente(id) {
    const dependente = this.dependentes.find(d => d.id === id);
    if (!dependente) return;
    
    // Preencher modal com dados do dependente
    document.getElementById('dependenteNome').value = dependente.nome;
    document.getElementById('dependenteCapacidade').value = dependente.capacidade;
    document.getElementById('dependenteImportancia').value = dependente.importancia;
    document.getElementById('dependenteFrequencia').value = dependente.frequencia;
    document.getElementById('dependenteRelacao').value = dependente.relacao || '';
    document.getElementById('dependenteDetalhes').value = dependente.detalhes || '';
    
    // Alterar botão de confirmação para edição
    const btnConfirmar = document.getElementById('btnConfirmarDependente');
    btnConfirmar.textContent = 'Atualizar Dependente';
    btnConfirmar.onclick = () => this.atualizarDependente(id);
    
    // Abrir modal
    this.abrirModal('dependente');
    
    // Atualizar preview
    this.atualizarValorCapacidade();
    this.atualizarValorFrequencia();
    this.atualizarPreviewDependente();
}

atualizarDependente(id) {
    const dependenteIndex = this.dependentes.findIndex(d => d.id === id);
    if (dependenteIndex === -1) return;
    
    const nome = document.getElementById('dependenteNome')?.value.trim();
    if (!nome) {
        alert('Digite um nome para o dependente!');
        return;
    }
    
    const capacidade = parseInt(document.getElementById('dependenteCapacidade')?.value) || 75;
    const importancia = document.getElementById('dependenteImportancia')?.value || 'amigo';
    const frequencia = parseInt(document.getElementById('dependenteFrequencia')?.value) || 9;
    const relacao = document.getElementById('dependenteRelacao')?.value || '';
    const detalhes = document.getElementById('dependenteDetalhes')?.value || '';
    
    const pontos = this.calcularCustoDependente(capacidade, importancia, frequencia);
    
    this.dependentes[dependenteIndex] = {
        ...this.dependentes[dependenteIndex],
        nome,
        capacidade,
        importancia,
        frequencia,
        relacao,
        detalhes,
        pontos
    };
    
    // Fechar modal e resetar
    this.fecharModal('dependente');
    this.resetarFormularioDependente();
    
    // Restaurar botão de adicionar
    const btnConfirmar = document.getElementById('btnConfirmarDependente');
    btnConfirmar.textContent = 'Adicionar Dependente';
    btnConfirmar.onclick = () => this.adicionarDependente();
    
    // Atualizar displays
    this.atualizarDisplayDependentes();
    this.atualizarSistemaPontos();
    this.salvarLocalStorage();
    
    console.log(`✏️ Dependente atualizado: ${nome} (${pontos} pts)`);
    this.mostrarNotificacao(`Dependente "${nome}" atualizado!`, 'success');
}

removerDependente(id) {
    const dependente = this.dependentes.find(d => d.id === id);
    if (!dependente) return;
    
    if (confirm(`Tem certeza que deseja remover o dependente "${dependente.nome}"?`)) {
        this.dependentes = this.dependentes.filter(d => d.id !== id);
        
        this.atualizarDisplayDependentes();
        this.atualizarSistemaPontos();
        this.salvarLocalStorage();
        
        console.log(`🗑️ Dependente removido: ${dependente.nome}`);
        this.mostrarNotificacao(`Dependente "${dependente.nome}" removido!`, 'warning');
    }
}

resetarFormularioDependente() {
    document.getElementById('dependenteNome').value = '';
    document.getElementById('dependenteCapacidade').value = 75;
    document.getElementById('dependenteImportancia').value = 'amigo';
    document.getElementById('dependenteFrequencia').value = 9;
    document.getElementById('dependenteRelacao').value = '';
    document.getElementById('dependenteDetalhes').value = '';
    
    this.atualizarValorCapacidade();
    this.atualizarValorFrequencia();
    this.atualizarPreviewDependente();
}

// Função auxiliar para mostrar notificações (adicionar se não existir)
mostrarNotificacao(mensagem, tipo = 'info') {
    // Implementação básica de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
    
    abrirModal(tipo) {
        const modal = document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (modal) {
            modal.style.display = 'block';
            console.log(`📁 Modal ${tipo} aberto`);
            
            // Configurar eventos específicos do modal
            if (tipo === 'aliado') this.configurarModalAliado();
            else if (tipo === 'contato') this.configurarModalContato();
            else if (tipo === 'patrono') this.configurarModalPatrono();
            else if (tipo === 'inimigo') this.configurarModalInimigo();
            else if (tipo === 'dependente') this.configurarModalDependente();
        } else {
            console.error(`❌ Modal ${tipo} não encontrado`);
        }
    }
    
    fecharModal(tipo) {
        const modal = document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (modal) {
            modal.style.display = 'none';
            console.log(`📁 Modal ${tipo} fechado`);
        }
    }
    
    configurarModais() {
        console.log('🔄 Configurando modais...');
        
        // Fechar modais ao clicar no X
        document.querySelectorAll('.modal-close[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal || e.target.closest('.modal-close').dataset.modal;
                if (modalId) {
                    this.fecharModal(modalId);
                }
            });
        });
        
        // Fechar modais ao clicar em cancelar
        document.querySelectorAll('.btn-secondary[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal || e.target.closest('.btn-secondary').dataset.modal;
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
        
        // Configurar remoção de itens
        document.addEventListener('click', (e) => {
            const btnRemover = e.target.closest('.btn-remove-item');
            if (btnRemover) {
                const id = parseInt(btnRemover.dataset.id);
                const tipo = btnRemover.dataset.tipo;
                console.log(`🗑️ Removendo item ${id} do tipo ${tipo}`);
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
        console.log(`✅ Item ${id} do tipo ${tipo} removido`);
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
        console.log('📊 Todos os displays atualizados');
    }
    
    atualizarResumoGeral() {
        const totalVantagens = this.calcularVantagensTotais();
        const totalDesvantagens = this.calcularDesvantagensTotais();
        const saldo = totalVantagens + totalDesvantagens; // Desvantagens são negativas
        
        const totalStatusGeral = document.getElementById('totalStatusGeral');
        if (totalStatusGeral) {
            totalStatusGeral.textContent = saldo;
            console.log(`📈 Resumo Geral: Vantagens=${totalVantagens}, Desvantagens=${totalDesvantagens}, Saldo=${saldo}`);
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
            console.log('🔍 PontosManager não encontrado, tentando inicializar...');
            if (window.inicializarSistemaPontos) {
                this.pontosManager = window.inicializarSistemaPontos();
            }
        }
        
        if (!this.pontosManager) {
            console.error('❌ PontosManager não disponível');
            return;
        }
        
        // Calcular totais
        const vantagens = this.calcularVantagensTotais();
        const desvantagens = Math.abs(this.calcularDesvantagensTotais());
        
        console.log(`💰 Pontos Status Social - Vantagens: ${vantagens}, Desvantagens: ${desvantagens}`);
        
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
        
        console.log('✅ Sistema de pontos atualizado');
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
            console.log('💾 Dados salvos no LocalStorage');
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar status social:', error);
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
                
                console.log('📂 Dados carregados do LocalStorage');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível carregar status social:', error);
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
        console.log('🚀 Criando nova instância do StatusSocialManager');
        statusSocialManagerInstance = new StatusSocialManager();
    }
    
    statusSocialManagerInstance.inicializar();
    return statusSocialManagerInstance;
}

// Inicializar quando a aba for ativada
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado, configurando StatusSocialManager...');
    
    // Observar quando a aba Vantagens for ativada
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    console.log('🎯 Aba Vantagens ativada, inicializando StatusSocial...');
                    setTimeout(() => {
                        if (!statusSocialManagerInstance) {
                            inicializarStatusSocial();
                        } else {
                            console.log('🔄 StatusSocial já inicializado, atualizando displays...');
                            statusSocialManagerInstance.atualizarTodosDisplays();
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
        console.log('🎯 Aba Vantagens já ativa no carregamento');
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

console.log('✅ status-social.js carregado e pronto!'); 