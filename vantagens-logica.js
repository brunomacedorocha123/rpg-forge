// ===========================================
// VANTAGENS-LOGICA.JS
// Lógica para subaba Aparência & Complementares
// Integra: Aparência, Idiomas, Atributos Complementares
// ===========================================

class VantagensLogica {
    constructor() {
        // Sistema de aparência (adaptado)
        this.niveisAparencia = {
            "horrendo": { pontos: -24, reacao: -6, descricao: "Indescritivelmente monstruoso", icone: "fas fa-frown", tipo: "desvantagem", cor: "#e74c3c" },
            "monstruoso": { pontos: -20, reacao: -5, descricao: "Horrível e obviamente anormal", icone: "fas fa-ghost", tipo: "desvantagem", cor: "#e74c3c" },
            "hediondo": { pontos: -16, reacao: -4, descricao: "Característica repugnante", icone: "fas fa-meh-rolling-eyes", tipo: "desvantagem", cor: "#e74c3c" },
            "feio": { pontos: -8, reacao: -2, descricao: "Cabelo seboso, dentes tortos, etc.", icone: "fas fa-meh", tipo: "desvantagem", cor: "#e74c3c" },
            "sem-atrativos": { pontos: -4, reacao: -1, descricao: "Algo antipático", icone: "fas fa-meh-blank", tipo: "desvantagem", cor: "#e74c3c" },
            "comum": { pontos: 0, reacao: 0, descricao: "Aparência padrão, sem modificadores", icone: "fas fa-user", tipo: "neutro", cor: "#95a5a6" },
            "atraente": { pontos: 4, reacao: 1, descricao: "Boa aparência, +1 em testes de reação", icone: "fas fa-smile", tipo: "vantagem", cor: "#27ae60" },
            "elegante": { pontos: 12, reacao: { mesmoSexo: 2, outroSexo: 4 }, descricao: "Poderia entrar em concursos de beleza", icone: "fas fa-grin-stars", tipo: "vantagem", cor: "#27ae60" },
            "muito-elegante": { pontos: 16, reacao: { mesmoSexo: 2, outroSexo: 6 }, descricao: "Poderia vencer concursos de beleza", icone: "fas fa-crown", tipo: "vantagem", cor: "#27ae60" },
            "lindo": { pontos: 20, reacao: { mesmoSexo: 2, outroSexo: 8 }, descricao: "Espécime ideal, aparência divina", icone: "fas fa-star", tipo: "vantagem", cor: "#27ae60" }
        };

        // Sistema de idiomas
        this.idiomaMaterno = { nome: 'Comum', nivelFala: 6, nivelEscrita: 6, custoTotal: 0 };
        this.idiomasAdicionais = [];
        this.alfabetizacaoAtual = 0; // 0 = alfabetizado
        
        this.niveisFala = [
            { valor: 0, nome: 'Nenhum', custo: 0, descricao: 'Não fala o idioma' },
            { valor: 2, nome: 'Rudimentar', custo: 2, descricao: 'Vocabulário limitado' },
            { valor: 4, nome: 'Sotaque', custo: 4, descricao: 'Pronúncia estrangeira' },
            { valor: 6, nome: 'Nativo', custo: 6, descricao: 'Fala como nativo' }
        ];
        
        this.niveisEscrita = [
            { valor: 0, nome: 'Nenhum', custo: 0, descricao: 'Não escreve o idioma' },
            { valor: 2, nome: 'Rudimentar', custo: 1, descricao: 'Escreve apenas palavras simples' },
            { valor: 4, nome: 'Sotaque', custo: 2, descricao: 'Escreve bem, mas com erros' },
            { valor: 6, nome: 'Nativo', custo: 3, descricao: 'Escreve fluentemente' }
        ];

        // Sistema de atributos complementares
        this.atributosComplementares = {
            vontade: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 },
            percepcao: { valor: 0, min: -4, max: 5, custoPorPonto: 5, pontos: 0 },
            pv: { valor: 0, min: -2, max: 2, custoPorPonto: 2, pontos: 0 },
            pf: { valor: 0, min: -3, max: 3, custoPorPonto: 3, pontos: 0 },
            velocidade: { valor: 0, min: -5, max: 5, custoPorPonto: 5, pontos: 0 },
            deslocamento: { valor: 0, min: -5, max: 5, custoPorPonto: 5, pontos: 0 }
        };

        this.inicializado = false;
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.configurarSubTabs();
        this.configurarAparencia();
        this.configurarIdiomas();
        this.configurarAtributosComplementares();
        this.carregarLocalStorage();
        this.atualizarResumo();
        
        this.inicializado = true;
        console.log('✅ Sistema de Vantagens inicializado');
    }

    // ========== SISTEMA DE SUB-ABAS ==========
    configurarSubTabs() {
        const subtabs = document.querySelectorAll('.sub-tab');
        subtabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active de todas
                document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
                
                // Adiciona active na clicada
                tab.classList.add('active');
                const subtabId = tab.dataset.subtab;
                document.getElementById(`subtab-${subtabId}`).classList.add('active');
                
                // Salva subtab ativa
                localStorage.setItem('vantagens_subtab_ativa', subtabId);
            });
        });

        // Restaurar subtab ativa
        const subtabAtiva = localStorage.getItem('vantagens_subtab_ativa') || 'aparencia';
        const tabAtiva = document.querySelector(`.sub-tab[data-subtab="${subtabAtiva}"]`);
        if (tabAtiva) tabAtiva.click();
    }

    // ========== APARÊNCIA ==========
    configurarAparencia() {
        const select = document.getElementById('nivelAparencia');
        if (!select) return;

        // Carrega opções padrão se não existirem
        if (select.options.length === 0) {
            Object.keys(this.niveisAparencia).forEach(chave => {
                const nivel = this.niveisAparencia[chave];
                const nomeFormatado = this.formatarNome(chave);
                const option = document.createElement('option');
                option.value = nivel.pontos;
                option.textContent = `${nomeFormatado} (${nivel.pontos >= 0 ? '+' : ''}${nivel.pontos} pts)`;
                select.appendChild(option);
            });
        }

        select.addEventListener('change', (e) => {
            this.atualizarDisplayAparencia();
            this.salvarLocalStorage();
            this.atualizarResumo();
        });

        this.atualizarDisplayAparencia();
    }

    atualizarDisplayAparencia() {
        const select = document.getElementById('nivelAparencia');
        const display = document.getElementById('displayAparencia');
        const badge = document.getElementById('pontosAparencia');
        
        if (!select || !display || !badge) return;

        const valor = parseInt(select.value) || 0;
        const nivel = this.obterNivelAparenciaPorPontos(valor);
        
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
                    <strong style="color: var(--text-gold);">${this.obterNomeAparenciaPorPontos(valor)}</strong>
                </div>
                <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8;">
                    <div>${textoReacao}</div>
                    <div style="margin-top: 4px;">${nivel.descricao}</div>
                </div>
            `;

            const pontosTexto = valor >= 0 ? `+${valor} pts` : `${valor} pts`;
            badge.textContent = pontosTexto;
            badge.className = 'pontos-badge';
            
            if (valor > 0) {
                badge.classList.add('positivo');
            } else if (valor < 0) {
                badge.classList.add('negativo');
            }
        }
    }

    obterNivelAparenciaPorPontos(pontos) {
        return Object.values(this.niveisAparencia).find(nivel => nivel.pontos === pontos);
    }

    obterNomeAparenciaPorPontos(pontos) {
        const entry = Object.entries(this.niveisAparencia).find(([key, nivel]) => nivel.pontos === pontos);
        return entry ? this.formatarNome(entry[0]) : 'Comum';
    }

    getPontosAparencia() {
        const select = document.getElementById('nivelAparencia');
        return select ? parseInt(select.value) || 0 : 0;
    }

    // ========== IDIOMAS ==========
    configurarIdiomas() {
        // Input idioma materno
        const inputMaterno = document.getElementById('idiomaMaternoNome');
        if (inputMaterno) {
            inputMaterno.value = this.idiomaMaterno.nome;
            inputMaterno.addEventListener('change', () => {
                this.idiomaMaterno.nome = inputMaterno.value;
                this.salvarLocalStorage();
            });
        }

        // Radios de alfabetização
        document.querySelectorAll('input[name="alfabetizacao"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.alfabetizacaoAtual = parseInt(e.target.value);
                this.atualizarDescricaoAlfabetizacao();
                this.salvarLocalStorage();
                this.atualizarResumo();
            });
        });

        // Botão adicionar idioma
        const btnAdicionar = document.getElementById('btnAdicionarIdioma');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => this.adicionarIdioma());
        }

        // Preview de custo
        const selectFala = document.getElementById('novoIdiomaFala');
        const selectEscrita = document.getElementById('novoIdiomaEscrita');
        
        if (selectFala && selectEscrita) {
            selectFala.addEventListener('change', () => this.atualizarPreviewCustoIdioma());
            selectEscrita.addEventListener('change', () => this.atualizarPreviewCustoIdioma());
        }

        // Enter no input
        const inputNovoIdioma = document.getElementById('novoIdiomaNome');
        if (inputNovoIdioma) {
            inputNovoIdioma.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.adicionarIdioma();
            });
        }

        // Delegation para remoção
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
        
        // Limpa formulário
        if (inputNome) inputNome.value = '';
        if (selectFala) selectFala.value = '2';
        if (selectEscrita) selectEscrita.value = '0';
        
        this.atualizarPreviewCustoIdioma();
        this.atualizarDisplayIdiomas();
        this.salvarLocalStorage();
        this.atualizarResumo();
        
        inputNome?.focus();
    }

    removerIdioma(id) {
        this.idiomasAdicionais = this.idiomasAdicionais.filter(i => i.id !== id);
        this.atualizarDisplayIdiomas();
        this.salvarLocalStorage();
        this.atualizarResumo();
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

        // Atualiza total
        totalElement.textContent = this.idiomasAdicionais.length;

        // Atualiza lista
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

        // Atualiza badge de pontos
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
        return pontosIdiomas + this.alfabetizacaoAtual; // alfabetizacaoAtual já é negativo
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
        
        // Marca o radio correto
        const radio = document.querySelector(`input[name="alfabetizacao"][value="${this.alfabetizacaoAtual}"]`);
        if (radio) radio.checked = true;
    }

    // ========== ATRIBUTOS COMPLEMENTARES ==========
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
                
                // Atualiza display inicial
                input.value = this.atributosComplementares[atributo].valor;
                pontosSpan.textContent = this.atributosComplementares[atributo].pontos;
            }
        });

        this.atualizarAtributosComplementares();
    }

    ajustarAtributo(atributo, delta) {
        const config = this.atributosComplementares[atributo];
        const novoValor = config.valor + delta;
        
        // Verifica limites
        if (novoValor < config.min || novoValor > config.max) {
            return;
        }

        // Atualiza valor
        config.valor = novoValor;
        
        // Calcula pontos (usa regras específicas)
        let pontos = 0;
        switch(atributo) {
            case 'vontade':
            case 'percepcao':
                pontos = novoValor * config.custoPorPonto;
                break;
            case 'pv':
                pontos = novoValor * config.custoPorPonto;
                break;
            case 'pf':
                pontos = novoValor * config.custoPorPonto;
                break;
            case 'velocidade':
                // 5 pontos por cada 0.25 de velocidade
                pontos = Math.round((novoValor * config.custoPorPonto) * 4); // *4 porque 0.25 = 1 ponto
                break;
            case 'deslocamento':
                pontos = novoValor * config.custoPorPonto;
                break;
        }
        
        config.pontos = pontos;

        // Atualiza interface
        const input = document.getElementById(`${atributo}Mod`);
        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
        
        if (input) input.value = novoValor;
        if (pontosSpan) pontosSpan.textContent = pontos;

        this.salvarLocalStorage();
        this.atualizarResumo();
    }

    atualizarAtributosComplementares() {
        // Atualiza badge total
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
    }

    getPontosAtributosComplementares() {
        return Object.values(this.atributosComplementares)
            .reduce((total, atributo) => total + atributo.pontos, 0);
    }

    // ========== RESUMO E INTEGRAÇÃO ==========
    atualizarResumo() {
        // Calcula totais
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();
        
        // Separa vantagens e desvantagens
        let totalVantagens = 0;
        let totalDesvantagens = 0;
        
        [pontosAparencia, pontosIdiomas, pontosAtributos].forEach(pontos => {
            if (pontos > 0) {
                totalVantagens += pontos;
            } else if (pontos < 0) {
                totalDesvantagens += Math.abs(pontos);
            }
        });
        
        // Atualiza display do resumo (temporário - depois será removido)
        const totalVantagensElem = document.getElementById('totalVantagensPontos');
        const totalDesvantagensElem = document.getElementById('totalDesvantagensPontos');
        const saldoElem = document.getElementById('saldoVantagens');
        
        if (totalVantagensElem) totalVantagensElem.textContent = totalVantagens;
        if (totalDesvantagensElem) totalDesvantagensElem.textContent = totalDesvantagens;
        if (saldoElem) saldoElem.textContent = totalVantagens - totalDesvantagens;
        
        // Dispara eventos para o sistema principal de pontos
        this.dispararEventosParaSistemaPrincipal();
    }

    dispararEventosParaSistemaPrincipal() {
        const pontosAparencia = this.getPontosAparencia();
        const pontosIdiomas = this.calcularPontosIdiomas();
        const pontosAtributos = this.getPontosAtributosComplementares();

        // Evento para aparência
        if (pontosAparencia !== 0) {
            const tipo = pontosAparencia > 0 ? 'vantagem' : 'desvantagem';
            const evento = new CustomEvent('vantagemAtualizada', {
                detail: {
                    tipo: 'aparencia',
                    pontos: Math.abs(pontosAparencia),
                    tipoPontos: tipo,
                    origem: 'vantagens_aparencia'
                }
            });
            document.dispatchEvent(evento);
        }

        // Evento para idiomas
        if (pontosIdiomas !== 0) {
            const tipo = pontosIdiomas > 0 ? 'vantagem' : 'desvantagem';
            const evento = new CustomEvent('vantagemAtualizada', {
                detail: {
                    tipo: 'idiomas',
                    pontos: Math.abs(pontosIdiomas),
                    tipoPontos: tipo,
                    origem: 'vantagens_idiomas'
                }
            });
            document.dispatchEvent(evento);
        }

        // Evento para atributos complementares
        if (pontosAtributos !== 0) {
            const tipo = pontosAtributos > 0 ? 'vantagem' : 'desvantagem';
            const evento = new CustomEvent('vantagemAtualizada', {
                detail: {
                    tipo: 'atributos_complementares',
                    pontos: Math.abs(pontosAtributos),
                    tipoPontos: tipo,
                    origem: 'vantagens_atributos'
                }
            });
            document.dispatchEvent(evento);
        }
    }

    // ========== LOCAL STORAGE ==========
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
                
                // Aparência
                if (dados.aparencia !== undefined) {
                    const select = document.getElementById('nivelAparencia');
                    if (select) select.value = dados.aparencia;
                }
                
                // Idiomas
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
                
                // Atributos complementares
                if (dados.atributosComplementares) {
                    this.atributosComplementares = dados.atributosComplementares;
                    
                    // Atualiza inputs
                    Object.keys(this.atributosComplementares).forEach(atributo => {
                        const input = document.getElementById(`${atributo}Mod`);
                        const pontosSpan = document.getElementById(`pontos${this.capitalize(atributo)}`);
                        const config = this.atributosComplementares[atributo];
                        
                        if (input) input.value = config.valor;
                        if (pontosSpan) pontosSpan.textContent = config.pontos;
                    });
                }
                
                // Atualiza displays
                setTimeout(() => {
                    this.atualizarDisplayAparencia();
                    this.atualizarDisplayIdiomas();
                    this.atualizarDescricaoAlfabetizacao();
                    this.atualizarAtributosComplementares();
                    this.atualizarResumo();
                }, 100);
                
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível carregar vantagens:', error);
        }
        return false;
    }

    // ========== UTILIDADES ==========
    formatarNome(key) {
        return key.split('-')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ========== EXPORTAÇÃO ==========
    exportarDados() {
        return {
            aparencia: {
                pontos: this.getPontosAparencia(),
                nome: this.obterNomeAparenciaPorPontos(this.getPontosAparencia())
            },
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
            }
        };
    }
}

// ========== INICIALIZAÇÃO GLOBAL ==========
let vantagensLogicaInstance = null;

function inicializarVantagensLogica() {
    if (!vantagensLogicaInstance) {
        vantagensLogicaInstance = new VantagensLogica();
    }
    vantagensLogicaInstance.inicializar();
    return vantagensLogicaInstance;
}

// Inicializa quando a aba de vantagens é aberta
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
                    }, 300);
                }
            }
        });
    });

    const tabVantagens = document.getElementById('vantagens');
    if (tabVantagens) {
        observer.observe(tabVantagens, { attributes: true });
    }
});

// ========== EXPORT PARA USO GLOBAL ==========
window.VantagensLogica = VantagensLogica;
window.inicializarVantagensLogica = inicializarVantagensLogica;
window.obterVantagensLogica = function() {
    return vantagensLogicaInstance;
};