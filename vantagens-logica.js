// ===========================================
// VANTAGENS-LOGICA.JS - VERSÃO COMPLETA
// Sistema completo de Vantagens/Desvantagens
// ===========================================

class VantagensLogica {
    constructor() {
        // Sistema de aparência
        this.niveisAparencia = {
            "-24": { nome: "Horrendo", reacao: -6, descricao: "Indescritivelmente monstruoso", icone: "fas fa-frown", cor: "#e74c3c" },
            "-20": { nome: "Monstruoso", reacao: -5, descricao: "Horrível e obviamente anormal", icone: "fas fa-ghost", cor: "#e74c3c" },
            "-16": { nome: "Hediondo", reacao: -4, descricao: "Característica repugnante", icone: "fas fa-meh-rolling-eyes", cor: "#e74c3c" },
            "-8": { nome: "Feio", reacao: -2, descricao: "Cabelo seboso, dentes tortos", icone: "fas fa-meh", cor: "#e74c3c" },
            "-4": { nome: "Sem Atrativos", reacao: -1, descricao: "Algo antipático", icone: "fas fa-meh-blank", cor: "#e74c3c" },
            "0": { nome: "Comum", reacao: 0, descricao: "Aparência padrão", icone: "fas fa-user", cor: "#95a5a6" },
            "4": { nome: "Atraente", reacao: 1, descricao: "Boa aparência", icone: "fas fa-smile", cor: "#27ae60" },
            "12": { nome: "Elegante", reacao: { mesmoSexo: 2, outroSexo: 4 }, descricao: "Poderia entrar em concursos", icone: "fas fa-grin-stars", cor: "#27ae60" },
            "16": { nome: "Muito Elegante", reacao: { mesmoSexo: 2, outroSexo: 6 }, descricao: "Poderia vencer concursos", icone: "fas fa-crown", cor: "#27ae60" },
            "20": { nome: "Lindo", reacao: { mesmoSexo: 2, outroSexo: 8 }, descricao: "Espécime ideal", icone: "fas fa-star", cor: "#27ae60" }
        };

        // Sistema de idiomas
        this.idiomaMaterno = { nome: 'Comum', nivelFala: 6, nivelEscrita: 6, custoTotal: 0 };
        this.idiomasAdicionais = [];
        this.alfabetizacaoAtual = 0;
        
        this.niveisFala = [
            { valor: 0, nome: 'Nenhum', custo: 0 },
            { valor: 2, nome: 'Rudimentar', custo: 2 },
            { valor: 4, nome: 'Sotaque', custo: 4 },
            { valor: 6, nome: 'Nativo', custo: 6 }
        ];
        
        this.niveisEscrita = [
            { valor: 0, nome: 'Nenhum', custo: 0 },
            { valor: 2, nome: 'Rudimentar', custo: 1 },
            { valor: 4, nome: 'Sotaque', custo: 2 },
            { valor: 6, nome: 'Nativo', custo: 3 }
        ];

        // Sistema de atributos complementares - VERSÃO CORRIGIDA
        this.atributosComplementares = {
            vontade: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 },
            percepcao: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 },
            pv: { valor: 0, min: -2, max: 2, custoPorPonto: 2, pontos: 0 },
            pf: { valor: 0, min: -3, max: 3, custoPorPonto: 3, pontos: 0 },
            velocidade: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 },
            deslocamento: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 }
        };

        this.inicializado = false;
        this.pontosManager = null;
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.configurarSubTabs();
        this.configurarAparencia();
        this.configurarIdiomas();
        this.configurarAtributosComplementares();
        this.configurarIntegracaoPontos();
        this.carregarLocalStorage();
        this.atualizarResumo();
        
        this.inicializado = true;
    }

    configurarSubTabs() {
        const subtabs = document.querySelectorAll('.sub-tab');
        if (!subtabs.length) return;

        subtabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const subtabId = tab.dataset.subtab;
                document.getElementById(`subtab-${subtabId}`).classList.add('active');
                
                localStorage.setItem('vantagens_subtab_ativa', subtabId);
            });
        });

        const subtabAtiva = localStorage.getItem('vantagens_subtab_ativa') || 'aparencia';
        const tabAtiva = document.querySelector(`.sub-tab[data-subtab="${subtabAtiva}"]`);
        if (tabAtiva) tabAtiva.click();
    }

    configurarAparencia() {
        const select = document.getElementById('nivelAparencia');
        if (!select) return;

        select.addEventListener('change', () => {
            this.atualizarDisplayAparencia();
            this.salvarLocalStorage();
            this.atualizarResumo();
            this.atualizarSistemaPontos();
        });

        this.atualizarDisplayAparencia();
    }

    atualizarDisplayAparencia() {
        const select = document.getElementById('nivelAparencia');
        const display = document.getElementById('displayAparencia');
        const badge = document.getElementById('pontosAparencia');
        
        if (!select || !display || !badge) return;

        const valor = select.value;
        const nivel = this.niveisAparencia[valor];
        
        if (nivel) {
            let textoReacao = '';
            if (typeof nivel.reacao === 'object') {
                textoReacao = `Reação: +${nivel.reacao.outroSexo} (outro sexo), +${nivel.reacao.mesmoSexo} (mesmo sexo)`;
            } else {
                textoReacao = `Reação: ${nivel.reacao >= 0 ? '+' : ''}${nivel.reacao}`;
            }
            
            display.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="${nivel.icone}" style="color: ${nivel.cor}; font-size: 1.5rem;"></i>
                    <strong style="color: var(--text-gold);">${nivel.nome}</strong>
                </div>
                <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8;">
                    <div>${textoReacao}</div>
                    <div style="margin-top: 4px;">${nivel.descricao}</div>
                </div>
            `;

            const pontos = parseInt(valor);
            const pontosTexto = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
            badge.textContent = pontosTexto;
            badge.className = 'pontos-badge';
            
            if (pontos > 0) {
                badge.classList.add('positivo');
            } else if (pontos < 0) {
                badge.classList.add('negativo');
            }
        }
    }

    getPontosAparencia() {
        const select = document.getElementById('nivelAparencia');
        return select ? parseInt(select.value) || 0 : 0;
    }

    configurarIdiomas() {
        const inputMaterno = document.getElementById('idiomaMaternoNome');
        if (inputMaterno) {
            inputMaterno.value = this.idiomaMaterno.nome;
            inputMaterno.addEventListener('change', () => {
                this.idiomaMaterno.nome = inputMaterno.value;
                this.salvarLocalStorage();
            });
        }

        document.querySelectorAll('input[name="alfabetizacao"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.alfabetizacaoAtual = parseInt(e.target.value);
                this.atualizarDescricaoAlfabetizacao();
                this.salvarLocalStorage();
                this.atualizarResumo();
                this.atualizarSistemaPontos();
            });
        });

        const btnAdicionar = document.getElementById('btnAdicionarIdioma');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.adicionarIdioma());
        }

        const selectFala = document.getElementById('novoIdiomaFala');
        const selectEscrita = document.getElementById('novoIdiomaEscrita');
        
        if (selectFala && selectEscrita) {
            selectFala.addEventListener('change', () => this.atualizarPreviewCustoIdioma());
            selectEscrita.addEventListener('change', () => this.atualizarPreviewCustoIdioma());
        }

        const inputNovoIdioma = document.getElementById('novoIdiomaNome');
        if (inputNovoIdioma) {
            inputNovoIdioma.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.adicionarIdioma();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-idioma')) {
                const button = e.target.closest('.btn-remove-idioma');
                const idiomaId = parseInt(button.dataset.id);
                this.removerIdioma(idiomaId);
            }
        });

        this.atualizarPreviewCustoIdioma();
        this.atualizarDisplayIdiomas();
        this.atualizarDescricaoAlfabetizacao();
    }

    adicionarIdioma() {
        const inputNome = document.getElementById('novoIdiomaNome');
        const nome = inputNome ? inputNome.value.trim() : '';
        
        if (!nome) {
            alert('Por favor, digite um nome para o idioma!');
            inputNome?.focus();
            return;
        }

        if (this.idiomaJaExiste(nome)) {
            alert('Este idioma já foi adicionado!');
            return;
        }

        const selectFala = document.getElementById('novoIdiomaFala');
        const selectEscrita = document.getElementById('novoIdiomaEscrita');
        
        const nivelFala = selectFala ? parseInt(selectFala.value) : 2;
        const nivelEscrita = selectEscrita ? parseInt(selectEscrita.value) : 0;
        
        const custoTotal = this.calcularCustoIdioma(nivelFala, nivelEscrita);
        
        const novoIdioma = {
            id: Date.now(),
            nome: nome,
            nivelFala: nivelFala,
            nivelEscrita: nivelEscrita,
            custoTotal: custoTotal,
            dataAdicao: new Date().toISOString()
        };
        
        this.idiomasAdicionais.push(novoIdioma);
        
        if (inputNome) inputNome.value = '';
        if (selectFala) selectFala.value = '2';
        if (selectEscrita) selectEscrita.value = '0';
        
        this.atualizarPreviewCustoIdioma();
        this.atualizarDisplayIdiomas();
        this.salvarLocalStorage();
        this.atualizarResumo();
        this.atualizarSistemaPontos();
        
        inputNome?.focus();
    }

    removerIdioma(id) {
        this.idiomasAdicionais = this.idiomasAdicionais.filter(i => i.id !== id);
        this.atualizarDisplayIdiomas();
        this.salvarLocalStorage();
        this.atualizarResumo();
        this.atualizarSistemaPontos();
    }

    idiomaJaExiste(nome) {
        return this.idiomasAdicionais.some(idioma => 
            idioma.nome.toLowerCase() === nome.toLowerCase()
        );
    }

    calcularCustoIdioma(nivelFala, nivelEscrita) {
        const nivelFalaObj = this.niveisFala.find(n => n.valor === nivelFala);
        const nivelEscritaObj = this.niveisEscrita.find(n => n.valor === nivelEscrita);
        
        return (nivelFalaObj?.custo || 0) + (nivelEscritaObj?.custo || 0);
    }

    atualizarPreviewCustoIdioma() {
        const selectFala = document.getElementById('novoIdiomaFala');
        const selectEscrita = document.getElementById('novoIdiomaEscrita');
        const preview = document.getElementById('custoIdiomaPreview');
        
        if (selectFala && selectEscrita && preview) {
            const nivelFala = parseInt(selectFala.value);
            const nivelEscrita = parseInt(selectEscrita.value);
            const custo = this.calcularCustoIdioma(nivelFala, nivelEscrita);
            
            preview.textContent = `${custo >= 0 ? '+' : ''}${custo} pts`;
        }
    }

    atualizarDisplayIdiomas() {
        const container = document.getElementById('listaIdiomasAdicionais');
        const totalElement = document.getElementById('totalIdiomas');
        const badge = document.getElementById('pontosIdiomas');
        
        if (!container || !totalElement || !badge) return;

        totalElement.textContent = this.idiomasAdicionais.length;

        if (this.idiomasAdicionais.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum idioma adicional adicionado</div>';
        } else {
            container.innerHTML = this.idiomasAdicionais.map(idioma => {
                const nivelFala = this.obterTextoNivelIdioma(idioma.nivelFala, 'fala');
                const nivelEscrita = this.obterTextoNivelIdioma(idioma.nivelEscrita, 'escrita');
                
                return `
                    <div class="idioma-item">
                        <div class="idioma-info">
                            <strong>${idioma.nome}</strong>
                            <div class="idioma-niveis">
                                <small><i class="fas fa-comment"></i> ${nivelFala} | <i class="fas fa-pen"></i> ${nivelEscrita}</small>
                            </div>
                        </div>
                        <div class="idioma-actions">
                            <span class="idioma-custo">+${idioma.custoTotal}</span>
                            <button class="btn-remove-idioma" data-id="${idioma.id}" title="Remover idioma">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        const pontos = this.calcularPontosIdiomas();
        const textoPontos = pontos >= 0 ? `+${pontos} pts` : `${pontos} pts`;
        badge.textContent = textoPontos;
        badge.className = 'pontos-badge';
        
        if (pontos > 0) {
            badge.classList.add('positivo');
        } else if (pontos < 0) {
            badge.classList.add('negativo');
        }
    }

    calcularPontosIdiomas() {
        const pontosIdiomas = this.idiomasAdicionais.reduce((total, idioma) => total + idioma.custoTotal, 0);
        return pontosIdiomas + this.alfabetizacaoAtual;
    }

    obterTextoNivelIdioma(nivel, tipo) {
        const niveis = tipo === 'fala' ? this.niveisFala : this.niveisEscrita;
        const nivelObj = niveis.find(n => n.valor === nivel);
        return nivelObj ? nivelObj.nome : 'Desconhecido';
    }

    atualizarDescricaoAlfabetizacao() {
        const descElement = document.getElementById('descAlfabetizacao');
        if (!descElement) return;

        const descricoes = {
            0: "Consegue ler e escrever normalmente",
            "-2": "Só consegue ler e escrever palavras simples",
            "-3": "Não consegue ler nem escrever"
        };

        descElement.textContent = descricoes[this.alfabetizacaoAtual] || '';
        
        const radio = document.querySelector(`input[name="alfabetizacao"][value="${this.alfabetizacaoAtual}"]`);
        if (radio) radio.checked = true;
    }

    configurarAtributosComplementares() {
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        
        atributos.forEach(atributo => {
            const minusBtn = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
            const plusBtn = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
            const input = document.getElementById(`${atributo}Mod`);
            const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
            
            if (minusBtn && plusBtn && input && pontosSpan) {
                minusBtn.addEventListener('click', () => this.ajustarAtributo(atributo, -1));
                plusBtn.addEventListener('click', () => this.ajustarAtributo(atributo, 1));
                
                input.value = this.atributosComplementares[atributo].valor;
                pontosSpan.textContent = this.atributosComplementares[atributo].pontos;
                
                this.verificarLimitesAtributo(atributo);
            }
        });
        
        this.atualizarAtributosComplementares();
    }

    ajustarAtributo(atributo, delta) {
        const config = this.atributosComplementares[atributo];
        const novoValor = config.valor + delta;
        
        if (novoValor < config.min || novoValor > config.max) {
            return;
        }
        
        config.valor = novoValor;
        
        // Cálculo correto dos pontos
        switch(atributo) {
            case 'vontade':
            case 'percepcao':
            case 'deslocamento':
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'pv':
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'pf':
                config.pontos = novoValor * config.custoPorPonto;
                break;
                
            case 'velocidade':
                config.pontos = novoValor * config.custoPorPonto;
                break;
        }
        
        const input = document.getElementById(`${atributo}Mod`);
        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
        
        if (input) input.value = novoValor;
        if (pontosSpan) pontosSpan.textContent = config.pontos;
        
        this.verificarLimitesAtributo(atributo);
        this.atualizarAtributosComplementares();
        this.salvarLocalStorage();
        this.atualizarResumo();
        this.atualizarSistemaPontos();
    }

    verificarLimitesAtributo(atributo) {
        const config = this.atributosComplementares[atributo];
        const minusBtn = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
        const plusBtn = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
        
        if (minusBtn) {
            minusBtn.disabled = config.valor <= config.min;
        }
        
        if (plusBtn) {
            plusBtn.disabled = config.valor >= config.max;
        }
    }

    atualizarAtributosComplementares() {
        const totalPontos = Object.values(this.atributosComplementares)
            .reduce((total, atributo) => total + atributo.pontos, 0);
        
        const badge = document.getElementById('pontosAtributosComplementares');
        if (badge) {
            const textoPontos = totalPontos >= 0 ? `+${totalPontos} pts` : `${totalPontos} pts`;
            badge.textContent = textoPontos;
            badge.className = 'pontos-badge';
            
            if (totalPontos > 0) {
                badge.classList.add('positivo');
            } else if (totalPontos < 0) {
                badge.classList.add('negativo');
            }
        }
        
        Object.keys(this.atributosComplementares).forEach(atributo => {
            this.verificarLimitesAtributo(atributo);
        });
    }

    getPontosAtributosComplementares() {
        return Object.values(this.atributosComplementares)
            .reduce((total, atributo) => total + atributo.pontos, 0);
    }

    configurarIntegracaoPontos() {
        this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
    }

    atualizarSistemaPontos() {
        if (!this.pontosManager) {
            this.pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
            if (!this.pontosManager) return;
        }

        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        let totalVantagens = 0;
        let totalDesvantagens = 0;
        
        [pontosAparencia, pontosIdiomas, pontosAtributos].forEach(pontos => {
            if (pontos > 0) {
                totalVantagens += pontos;
            } else if (pontos < 0) {
                totalDesvantagens += Math.abs(pontos);
            }
        });
        
        this.pontosManager.gastos.vantagens = totalVantagens;
        this.pontosManager.gastos.desvantagens.caracteristicas = totalDesvantagens;
        
        this.pontosManager.atualizarDisplay('vantagens');
        this.pontosManager.atualizarDisplay('desvantagens');
        this.pontosManager.atualizarTudo();
    }

    atualizarResumo() {
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        let totalVantagens = 0;
        let totalDesvantagens = 0;
        
        [pontosAparencia, pontosIdiomas, pontosAtributos].forEach(pontos => {
            if (pontos > 0) {
                totalVantagens += pontos;
            } else if (pontos < 0) {
                totalDesvantagens += Math.abs(pontos);
            }
        });
        
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = totalVantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = totalDesvantagens;
        if (saldoElem) saldoElem.textContent = totalVantagens - totalDesvantagens;
        
        this.dispararEventoAtualizacao();
    }

    dispararEventoAtualizacao() {
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        const evento = new CustomEvent('vantagensAtualizadas', {
            detail: {
                aparencia: pontosAparencia,
                idiomas: pontosIdiomas,
                atributos_complementares: pontosAtributos,
                totalVantagens: Math.max(0, pontosAparencia) + Math.max(0, pontosIdiomas) + Math.max(0, pontosAtributos),
                totalDesvantagens: Math.abs(Math.min(0, pontosAparencia)) + Math.abs(Math.min(0, pontosIdiomas)) + Math.abs(Math.min(0, pontosAtributos)),
                saldo: pontosAparencia + pontosIdiomas + pontosAtributos
            }
        });
        
        document.dispatchEvent(evento);
    }

    salvarLocalStorage() {
        try {
            const dados = {
                aparencia: this.getPontosAparencia(),
                idiomaMaterno: this.idiomaMaterno,
                idiomasAdicionais: this.idiomasAdicionais,
                alfabetizacao: this.alfabetizacaoAtual,
                atributosComplementares: this.atributosComplementares,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gurps_vantagens', JSON.stringify(dados));
        } catch (error) {
            console.warn('Não foi possível salvar vantagens:', error);
        }
    }

    carregarLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_vantagens');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                if (dados.aparencia !== undefined) {
                    const select = document.getElementById('nivelAparencia');
                    if (select) select.value = dados.aparencia;
                }
                
                if (dados.idiomaMaterno) {
                    this.idiomaMaterno = dados.idiomaMaterno;
                    const input = document.getElementById('idiomaMaternoNome');
                    if (input) input.value = this.idiomaMaterno.nome;
                }
                
                if (dados.idiomasAdicionais) {
                    this.idiomasAdicionais = dados.idiomasAdicionais;
                }
                
                if (dados.alfabetizacao !== undefined) {
                    this.alfabetizacaoAtual = dados.alfabetizacao;
                }
                
                if (dados.atributosComplementares) {
                    this.atributosComplementares = dados.atributosComplementares;
                    
                    Object.keys(this.atributosComplementares).forEach(atributo => {
                        const input = document.getElementById(`${atributo}Mod`);
                        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
                        const config = this.atributosComplementares[atributo];
                        
                        if (input) input.value = config.valor;
                        if (pontosSpan) pontosSpan.textContent = config.pontos;
                    });
                }
                
                setTimeout(() => {
                    this.atualizarDisplayAparencia();
                    this.atualizarDisplayIdiomas();
                    this.atualizarDescricaoAlfabetizacao();
                    this.atualizarAtributosComplementares();
                    this.atualizarResumo();
                    this.atualizarSistemaPontos();
                }, 100);
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar vantagens:', error);
        }
        return false;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    exportarDados() {
        return {
            aparencia: this.getPontosAparencia(),
            idiomas: {
                idiomaMaterno: this.idiomaMaterno,
                idiomasAdicionais: this.idiomasAdicionais,
                alfabetizacao: this.alfabetizacaoAtual,
                pontosTotais: this.calcularPontosIdiomas()
            },
            atributosComplementares: {
                valores: Object.fromEntries(
                    Object.entries(this.atributosComplementares).map(([key, config]) => [key, config.valor])
                ),
                pontos: this.getPontosAtributosComplementares()
            },
            resumo: {
                totalVantagens: Math.max(0, this.getPontosAparencia()) + 
                               Math.max(0, this.calcularPontosIdiomas()) + 
                               Math.max(0, this.getPontosAtributosComplementares()),
                totalDesvantagens: Math.abs(Math.min(0, this.getPontosAparencia())) + 
                                 Math.abs(Math.min(0, this.calcularPontosIdiomas())) + 
                                 Math.abs(Math.min(0, this.getPontosAtributosComplementares())),
                saldo: this.getPontosAparencia() + 
                      this.calcularPontosIdiomas() + 
                      this.getPontosAtributosComplementares()
            }
        };
    }

    limparDados() {
        this.idiomasAdicionais = [];
        this.alfabetizacaoAtual = 0;
        
        Object.keys(this.atributosComplementares).forEach(atributo => {
            this.atributosComplementares[atributo].valor = 0;
            this.atributosComplementares[atributo].pontos = 0;
        });
        
        const select = document.getElementById('nivelAparencia');
        if (select) select.value = '0';
        
        this.salvarLocalStorage();
        this.atualizarDisplayAparencia();
        this.atualizarDisplayIdiomas();
        this.atualizarAtributosComplementares();
        this.atualizarResumo();
        this.atualizarSistemaPontos();
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL E INTEGRAÇÃO
// ===========================================

let vantagensLogicaInstance = null;

function inicializarVantagensLogica() {
    if (!vantagensLogicaInstance) {
        vantagensLogicaInstance = new VantagensLogica();
        
        document.addEventListener('vantagensAtualizadas', (e) => {
            const pontosManager = window.obterPontosManager ? window.obterPontosManager() : null;
            if (pontosManager) {
                const detalhes = e.detail;
                pontosManager.gastos.vantagens = detalhes.totalVantagens;
                pontosManager.gastos.desvantagens.caracteristicas = detalhes.totalDesvantagens;
                
                pontosManager.atualizarDisplay('vantagens');
                pontosManager.atualizarDisplay('desvantagens');
                pontosManager.atualizarTudo();
            }
        });
    }
    
    vantagensLogicaInstance.inicializar();
    return vantagensLogicaInstance;
}

document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                    setTimeout(() => {
                        if (!vantagensLogicaInstance) {
                            inicializarVantagensLogica();
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
    
    if (document.getElementById('vantagens')?.classList.contains('active')) {
        setTimeout(inicializarVantagensLogica, 300);
    }
});

window.VantagensLogica = VantagensLogica;
window.inicializarVantagensLogica = inicializarVantagensLogica;
window.obterVantagensLogica = function() {
    return vantagensLogicaInstance;
};

window.atualizarPontosVantagens = function() {
    if (vantagensLogicaInstance) {
        vantagensLogicaInstance.atualizarResumo();
        vantagensLogicaInstance.atualizarSistemaPontos();
    }
};