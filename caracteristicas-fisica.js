// =============================================
// CARACTERÍSTICAS FÍSICAS - SISTEMA INTELIGENTE
// =============================================

class CaracteristicasFisicasSistema {
    constructor() {
        // CARACTERÍSTICAS FÍSICAS (baseado no seu código anterior)
        this.caracteristicas = {
            "magro": { 
                pontos: -5,
                nome: "Magro",
                tipo: "desvantagem",
                efeitos: "Peso = 67% do normal (×0.67)",
                pesoMultiplicador: 0.67,
                alturaMaxima: null,
                icone: "fas fa-person-walking",
                descricao: "Peso reduzido para 67% da média do ST",
                conflitos: ["acima-peso", "gordo", "muito-gordo"]
            },
            "acima-peso": { 
                pontos: -1,
                nome: "Acima do Peso",
                tipo: "desvantagem", 
                efeitos: "Peso = 130% do normal (×1.3)",
                pesoMultiplicador: 1.3,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 130% da média do ST",
                conflitos: ["magro", "gordo", "muito-gordo"]
            },
            "gordo": { 
                pontos: -3,
                nome: "Gordo",
                tipo: "desvantagem",
                efeitos: "Peso = 150% do normal (×1.5)",
                pesoMultiplicador: 1.5,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 150% da média do ST",
                conflitos: ["magro", "acima-peso", "muito-gordo"]
            },
            "muito-gordo": { 
                pontos: -5,
                nome: "Muito Gordo",
                tipo: "desvantagem",
                efeitos: "Peso = 200% do normal (×2.0)",
                pesoMultiplicador: 2.0,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso dobrado em relação à média do ST",
                conflitos: ["magro", "acima-peso", "gordo"]
            },
            "nanismo": { 
                pontos: -15,
                nome: "Nanismo",
                tipo: "desvantagem",
                efeitos: "Altura máxima: 1.32m",
                pesoMultiplicador: null,
                alturaMaxima: 1.32,
                icone: "fas fa-arrow-down",
                descricao: "Altura limitada a 1.32m máximo",
                conflitos: ["gigantismo"]
            },
            "gigantismo": { 
                pontos: 0,
                nome: "Gigantismo",
                tipo: "vantagem",
                efeitos: "MT +1, +1 Deslocamento",
                pesoMultiplicador: null,
                alturaMaxima: null,
                icone: "fas fa-arrow-up",
                descricao: "Altura acima do máximo para a raça",
                conflitos: ["nanismo"]
            }
        };

        // TABELAS EXATAS DO SEU CÓDIGO ANTERIOR
        this.alturaPorST = {
            6: { min: 1.30, max: 1.55 },
            7: { min: 1.38, max: 1.63 },
            8: { min: 1.45, max: 1.70 },
            9: { min: 1.53, max: 1.78 },
            10: { min: 1.58, max: 1.83 },
            11: { min: 1.63, max: 1.88 },
            12: { min: 1.70, max: 1.95 },
            13: { min: 1.78, max: 2.03 },
            14: { min: 1.85, max: 2.10 },
            15: { min: 1.90, max: 2.15 },
            16: { min: 1.95, max: 2.20 }
        };

        this.pesoPorST = {
            6: { min: 30, max: 60 },
            7: { min: 37.5, max: 67.5 },
            8: { min: 45.0, max: 75.0 },
            9: { min: 52.5, max: 82.5 },
            10: { min: 57.5, max: 87.5 },
            11: { min: 62.5, max: 97.5 },
            12: { min: 70.0, max: 110.0 },
            13: { min: 77.5, max: 122.5 },
            14: { min: 85.0, max: 135.0 },
            15: { min: 92.5, max: 147.5 },
            16: { min: 100.0, max: 160.0 }
        };

        // ESTADO
        this.caracteristicasSelecionadas = [];
        this.altura = 1.70;
        this.peso = 70;
        this.stAtual = 10;
        
        this.inicializado = false;
    }

    // ===========================================
    // INICIALIZAÇÃO
    // ===========================================

    inicializar() {
        if (this.inicializado) return;
        
        // Obter ST inicial
        this.atualizarST();
        
        // Configurar modal
        this.configurarModal();
        
        // Configurar eventos principais
        this.configurarEventosPrincipais();
        
        // Carregar dados salvos
        this.carregarDados();
        
        // Atualizar tudo
        this.atualizarTudo();
        
        this.inicializado = true;
    }

    configurarModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        // Botão personalizar
        const btnCustomizar = document.getElementById('customizeBtn');
        if (btnCustomizar) {
            btnCustomizar.addEventListener('click', () => this.abrirModal());
        }
        
        // Botões do modal
        const btnFechar = modal.querySelector('.modal-close');
        const btnCancelar = document.getElementById('cancelBtn');
        const btnAplicar = document.getElementById('applyBtn');
        
        if (btnFechar) btnFechar.onclick = () => this.fecharModal();
        if (btnCancelar) btnCancelar.onclick = () => this.fecharModal();
        if (btnAplicar) btnAplicar.onclick = () => this.aplicarAlteracoes();
        
        // Configurar botões de características
        modal.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.type;
                this.alternarCaracteristica(tipo);
            });
        });
        
        // Configurar controles de ajuste no modal
        this.configurarControlesModal();
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.fecharModal();
            }
        });
    }

    configurarControlesModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        // Botões de altura
        const alturaContainer = modal.querySelector('.adjustment:nth-child(1) .adjustment-controls');
        if (alturaContainer) {
            const btnAlturaMenos = alturaContainer.querySelector('.minus');
            const btnAlturaMais = alturaContainer.querySelector('.plus');
            const inputAltura = document.getElementById('alturaModal');
            
            if (btnAlturaMenos) btnAlturaMenos.onclick = () => this.ajustarAltura(-0.01);
            if (btnAlturaMais) btnAlturaMais.onclick = () => this.ajustarAltura(0.01);
            if (inputAltura) inputAltura.onchange = () => this.atualizarValorAltura();
        }
        
        // Botões de peso
        const pesoContainer = modal.querySelector('.adjustment:nth-child(2) .adjustment-controls');
        if (pesoContainer) {
            const btnPesoMenos = pesoContainer.querySelector('.minus');
            const btnPesoMais = pesoContainer.querySelector('.plus');
            const inputPeso = document.getElementById('pesoModal');
            
            if (btnPesoMenos) btnPesoMenos.onclick = () => this.ajustarPeso(-1);
            if (btnPesoMais) btnPesoMais.onclick = () => this.ajustarPeso(1);
            if (inputPeso) inputPeso.onchange = () => this.atualizarValorPeso();
        }
    }

    configurarEventosPrincipais() {
        // Inputs principais de altura/peso
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        
        if (inputAltura) {
            inputAltura.addEventListener('change', () => {
                this.altura = parseFloat(inputAltura.value) || 1.70;
                this.atualizarStatusInputs();
                this.salvarDados();
            });
        }
        
        if (inputPeso) {
            inputPeso.addEventListener('change', () => {
                this.peso = parseInt(inputPeso.value) || 70;
                this.atualizarStatusInputs();
                this.salvarDados();
            });
        }
        
        // Botões de idade
        const inputIdade = document.getElementById('idade');
        const btnIdadeMenos = inputIdade?.parentElement.querySelector('.btn-number.minus');
        const btnIdadeMais = inputIdade?.parentElement.querySelector('.btn-number.plus');
        
        if (btnIdadeMenos) btnIdadeMenos.onclick = () => this.ajustarIdade(-1);
        if (btnIdadeMais) btnIdadeMais.onclick = () => this.ajustarIdade(1);
        
        // Escutar mudanças no ST
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.ST) {
                this.stAtual = e.detail.ST;
                this.atualizarTudo();
            }
        });
        
        // Verificar ST periodicamente
        setInterval(() => this.verificarST(), 1000);
    }

    // ===========================================
    // GERENCIAMENTO DO MODAL
    // ===========================================

    abrirModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        // Atualizar ST no modal
        this.atualizarST();
        const statusST = document.getElementById('statusST');
        if (statusST) statusST.textContent = this.stAtual;
        
        // Atualizar valores no modal
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        document.getElementById('pesoModal').value = this.peso;
        
        // Atualizar faixas recomendadas
        this.atualizarFaixasModal();
        
        // Atualizar status
        this.atualizarStatusModal();
        
        // Atualizar botões de características
        this.atualizarBotoesCaracteristicas();
        
        // Mostrar modal
        modal.style.display = 'block';
    }

    fecharModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    aplicarAlteracoes() {
        // Aplicar valores do modal
        const inputAlturaModal = document.getElementById('alturaModal');
        const inputPesoModal = document.getElementById('pesoModal');
        
        if (inputAlturaModal) {
            this.altura = parseFloat(inputAlturaModal.value) || 1.70;
            document.getElementById('altura').value = this.altura.toFixed(2);
        }
        
        if (inputPesoModal) {
            this.peso = parseInt(inputPesoModal.value) || 70;
            document.getElementById('peso').value = this.peso;
        }
        
        // Fechar modal
        this.fecharModal();
        
        // Atualizar interface principal
        this.atualizarStatusInputs();
        
        // Salvar dados
        this.salvarDados();
        
        // Atualizar pontos
        this.atualizarPontosSistema();
    }

    // ===========================================
    // GERENCIAMENTO DE CARACTERÍSTICAS
    // ===========================================

    alternarCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;
        
        const index = this.caracteristicasSelecionadas.findIndex(c => c.tipo === tipo);
        
        if (index !== -1) {
            // Remover característica
            this.caracteristicasSelecionadas.splice(index, 1);
        } else {
            // Adicionar característica
            this.adicionarCaracteristica(tipo);
        }
        
        // Atualizar interface
        this.atualizarBotoesCaracteristicas();
        this.atualizarStatusModal();
        this.atualizarPontosSistema();
        this.salvarDados();
    }

    adicionarCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;
        
        // Remover características conflitantes
        if (caracteristica.conflitos) {
            caracteristica.conflitos.forEach(conflito => {
                this.caracteristicasSelecionadas = this.caracteristicasSelecionadas.filter(c => c.tipo !== conflito);
            });
        }
        
        // Adicionar nova característica
        this.caracteristicasSelecionadas.push({
            id: Date.now(),
            tipo: tipo,
            nome: caracteristica.nome,
            pontos: caracteristica.pontos,
            efeitos: caracteristica.efeitos,
            pesoMultiplicador: caracteristica.pesoMultiplicador,
            alturaMaxima: caracteristica.alturaMaxima,
            icone: caracteristica.icone
        });
        
        // Aplicar efeitos imediatos
        this.aplicarEfeitosCaracteristica(tipo);
    }

    aplicarEfeitosCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;
        
        // Se for nanismo, ajustar altura se necessário
        if (tipo === 'nanismo' && caracteristica.alturaMaxima) {
            if (this.altura > caracteristica.alturaMaxima) {
                this.altura = caracteristica.alturaMaxima;
                document.getElementById('altura').value = this.altura.toFixed(2);
                document.getElementById('alturaModal').value = this.altura.toFixed(2);
            }
        }
        
        // Se for característica de peso, ajustar visualmente
        if (caracteristica.pesoMultiplicador) {
            // Apenas atualizar status, não mudar o valor automaticamente
            this.atualizarStatusInputs();
        }
    }

    // ===========================================
    // CÁLCULOS INTELIGENTES
    // ===========================================

    atualizarST() {
        // Tentar obter do sistema de atributos
        if (window.getAtributosPersonagem) {
            const atributos = window.getAtributosPersonagem();
            if (atributos?.ST) {
                this.stAtual = atributos.ST;
                return;
            }
        }
        
        // Tentar obter do input
        const inputST = document.getElementById('ST');
        if (inputST) {
            this.stAtual = parseInt(inputST.value) || 10;
            return;
        }
        
        this.stAtual = 10;
    }

    verificarST() {
        const novoST = this.obterSTAtual();
        if (novoST !== this.stAtual) {
            this.stAtual = novoST;
            this.atualizarTudo();
        }
    }

    obterSTAtual() {
        if (window.getAtributosPersonagem) {
            const atributos = window.getAtributosPersonagem();
            return atributos?.ST || 10;
        }
        
        const inputST = document.getElementById('ST');
        return inputST ? parseInt(inputST.value) || 10 : 10;
    }

    obterFaixaAltura(st) {
        // Para ST dentro da tabela
        if (st >= 6 && st <= 16) {
            return this.alturaPorST[st];
        }
        
        // Para ST acima de 16
        if (st > 16) {
            const base = this.alturaPorST[16];
            const incremento = (st - 16) * 0.05;
            return {
                min: parseFloat((parseFloat(base.min) + incremento).toFixed(2)),
                max: parseFloat((parseFloat(base.max) + incremento).toFixed(2))
            };
        }
        
        // Para ST abaixo de 6
        if (st < 6) {
            const base = this.alturaPorST[6];
            const decremento = (6 - st) * 0.05;
            return {
                min: parseFloat((parseFloat(base.min) - decremento).toFixed(2)),
                max: parseFloat((parseFloat(base.max) - decremento).toFixed(2))
            };
        }
        
        return { min: 1.30, max: 2.50 };
    }

    obterFaixaPeso(st) {
        // Para ST dentro da tabela
        if (st >= 6 && st <= 16) {
            return this.pesoPorST[st];
        }
        
        // Para ST acima de 16
        if (st > 16) {
            const base = this.pesoPorST[16];
            const incremento = (st - 16) * 10;
            return {
                min: Math.round(base.min + incremento),
                max: Math.round(base.max + incremento)
            };
        }
        
        // Para ST abaixo de 6
        if (st < 6) {
            const base = this.pesoPorST[6];
            const decremento = (6 - st) * 5;
            return {
                min: Math.max(20, Math.round(base.min - decremento)),
                max: Math.max(30, Math.round(base.max - decremento))
            };
        }
        
        return { min: 30, max: 200 };
    }

    calcularPesoEsperado() {
        const faixaPeso = this.obterFaixaPeso(this.stAtual);
        const pesoMedio = (faixaPeso.min + faixaPeso.max) / 2;
        
        // Aplicar multiplicador das características
        let multiplicador = 1.0;
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso?.pesoMultiplicador) {
            multiplicador = caracteristicaPeso.pesoMultiplicador;
        }
        
        return Math.round(pesoMedio * multiplicador);
    }

    verificarConformidade() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoBase = this.obterFaixaPeso(this.stAtual);
        
        // Obter multiplicador de peso ativo
        let multiplicadorPeso = 1.0;
        let caracteristicaAtiva = null;
        
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
            caracteristicaAtiva = caracteristicaPeso;
        }
        
        // Calcular faixa de peso ajustada
        const faixaPesoAjustada = {
            min: Math.round(faixaPesoBase.min * multiplicadorPeso),
            max: Math.round(faixaPesoBase.max * multiplicadorPeso)
        };
        
        // Verificar nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        let alturaValida = true;
        let mensagemAltura = '';
        
        if (nanismo) {
            alturaValida = this.altura <= 1.32;
            mensagemAltura = alturaValida ? 'Dentro do limite do nanismo' : 'Acima do limite do nanismo (1.32m)';
        } else {
            alturaValida = this.altura >= faixaAltura.min && this.altura <= faixaAltura.max;
            mensagemAltura = alturaValida ? 
                `Dentro da faixa (${faixaAltura.min}m - ${faixaAltura.max}m)` :
                this.altura < faixaAltura.min ? 
                    `Abaixo do mínimo (${faixaAltura.min}m)` :
                    `Acima do máximo (${faixaAltura.max}m)`;
        }
        
        // Verificar peso
        const pesoValido = this.peso >= faixaPesoAjustada.min && this.peso <= faixaPesoAjustada.max;
        let mensagemPeso = '';
        
        if (caracteristicaAtiva) {
            mensagemPeso = pesoValido ? 
                `${caracteristicaAtiva.nome}: Dentro da faixa ajustada` :
                this.peso < faixaPesoAjustada.min ? 
                    `${caracteristicaAtiva.nome}: Abaixo do mínimo (${faixaPesoAjustada.min}kg)` :
                    `${caracteristicaAtiva.nome}: Acima do máximo (${faixaPesoAjustada.max}kg)`;
        } else {
            mensagemPeso = pesoValido ? 
                `Dentro da faixa (${faixaPesoBase.min}kg - ${faixaPesoBase.max}kg)` :
                this.peso < faixaPesoBase.min ? 
                    `Abaixo do mínimo (${faixaPesoBase.min}kg)` :
                    `Acima do máximo (${faixaPesoBase.max}kg)`;
        }
        
        return {
            alturaValida,
            pesoValido,
            faixaAltura,
            faixaPesoBase,
            faixaPesoAjustada,
            multiplicadorPeso,
            caracteristicaAtiva,
            nanismoAtivo: !!nanismo,
            mensagemAltura,
            mensagemPeso,
            dentroDaFaixa: alturaValida && pesoValido
        };
    }

    calcularPontosCaracteristicas() {
        return this.caracteristicasSelecionadas.reduce((total, carac) => total + carac.pontos, 0);
    }

    // ===========================================
    // CONTROLES DE AJUSTE
    // ===========================================

    ajustarAltura(variacao) {
        let novaAltura = this.altura + variacao;
        
        // Verificar nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        if (nanismo && novaAltura > 1.32) {
            novaAltura = 1.32;
        }
        
        // Limites gerais
        if (novaAltura < 1.20) novaAltura = 1.20;
        if (novaAltura > 2.50) novaAltura = 2.50;
        
        this.altura = parseFloat(novaAltura.toFixed(2));
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        
        this.atualizarStatusModal();
    }

    ajustarPeso(variacao) {
        let novoPeso = this.peso + variacao;
        
        // Limites gerais
        if (novoPeso < 20) novoPeso = 20;
        if (novoPeso > 200) novoPeso = 200;
        
        this.peso = novoPeso;
        document.getElementById('pesoModal').value = this.peso;
        
        this.atualizarStatusModal();
    }

    ajustarIdade(variacao) {
        const inputIdade = document.getElementById('idade');
        if (!inputIdade) return;
        
        let idade = parseInt(inputIdade.value) || 25;
        idade += variacao;
        
        if (idade < 12) idade = 12;
        if (idade > 100) idade = 100;
        
        inputIdade.value = idade;
    }

    atualizarValorAltura() {
        const input = document.getElementById('alturaModal');
        if (!input) return;
        
        this.altura = parseFloat(input.value) || 1.70;
        this.atualizarStatusModal();
    }

    atualizarValorPeso() {
        const input = document.getElementById('pesoModal');
        if (!input) return;
        
        this.peso = parseInt(input.value) || 70;
        this.atualizarStatusModal();
    }

    // ===========================================
    // ATUALIZAÇÃO DA INTERFACE
    // ===========================================

    atualizarTudo() {
        this.atualizarStatusInputs();
        this.atualizarPontosSistema();
    }

    atualizarStatusInputs() {
        const conformidade = this.verificarConformidade();
        
        // Atualizar inputs principais
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        
        if (inputAltura) {
            if (conformidade.nanismoAtivo && this.altura > 1.32) {
                inputAltura.style.borderColor = '#e74c3c';
                inputAltura.style.backgroundColor = '#ffe6e6';
            } else if (!conformidade.alturaValida) {
                inputAltura.style.borderColor = '#f39c12';
                inputAltura.style.backgroundColor = '#fff3cd';
            } else {
                inputAltura.style.borderColor = '#27ae60';
                inputAltura.style.backgroundColor = '#d4edda';
            }
        }
        
        if (inputPeso) {
            if (!conformidade.pesoValido) {
                inputPeso.style.borderColor = '#f39c12';
                inputPeso.style.backgroundColor = '#fff3cd';
            } else {
                inputPeso.style.borderColor = '#27ae60';
                inputPeso.style.backgroundColor = '#d4edda';
            }
        }
    }

    atualizarFaixasModal() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPeso = this.obterFaixaPeso(this.stAtual);
        
        document.getElementById('faixaAltura').textContent = 
            `${faixaAltura.min.toFixed(2)}m - ${faixaAltura.max.toFixed(2)}m`;
        
        document.getElementById('faixaPeso').textContent = 
            `${faixaPeso.min}kg - ${faixaPeso.max}kg`;
    }

    atualizarStatusModal() {
        const conformidade = this.verificarConformidade();
        
        // Atualizar mensagens de status no modal
        const statusAltura = document.querySelector('#alturaModal').parentElement.nextElementSibling;
        const statusPeso = document.querySelector('#pesoModal').parentElement.nextElementSibling;
        
        if (statusAltura && statusAltura.classList.contains('status-info')) {
            statusAltura.textContent = conformidade.mensagemAltura;
            statusAltura.style.color = conformidade.alturaValida ? '#27ae60' : '#e74c3c';
        }
        
        if (statusPeso && statusPeso.classList.contains('status-info')) {
            statusPeso.textContent = conformidade.mensagemPeso;
            statusPeso.style.color = conformidade.pesoValido ? '#27ae60' : '#e74c3c';
        }
    }

    atualizarBotoesCaracteristicas() {
        document.querySelectorAll('.feature-btn').forEach(btn => {
            const tipo = btn.dataset.type;
            const selecionada = this.caracteristicasSelecionadas.find(c => c.tipo === tipo);
            
            if (selecionada) {
                btn.style.backgroundColor = '#3498db';
                btn.style.color = 'white';
                btn.style.borderColor = '#2980b9';
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }
        });
    }

    atualizarPontosSistema() {
        const pontos = this.calcularPontosCaracteristicas();
        
        // Atualizar sistema de pontos
        if (window.atualizarPontosAba) {
            window.atualizarPontosAba('desvantagens', pontos);
        }
    }

    // ===========================================
    // SALVAMENTO E CARREGAMENTO
    // ===========================================

    salvarDados() {
        const dados = {
            caracteristicasSelecionadas: this.caracteristicasSelecionadas,
            altura: this.altura,
            peso: this.peso,
            stAtual: this.stAtual
        };
        
        localStorage.setItem('rpgforge_caracteristicas_fisicas', JSON.stringify(dados));
    }

    carregarDados() {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_caracteristicas_fisicas');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                if (dados.caracteristicasSelecionadas) {
                    this.caracteristicasSelecionadas = dados.caracteristicasSelecionadas;
                }
                
                if (dados.altura !== undefined) {
                    this.altura = dados.altura;
                    const inputAltura = document.getElementById('altura');
                    if (inputAltura) inputAltura.value = this.altura.toFixed(2);
                }
                
                if (dados.peso !== undefined) {
                    this.peso = dados.peso;
                    const inputPeso = document.getElementById('peso');
                    if (inputPeso) inputPeso.value = this.peso;
                }
                
                if (dados.stAtual) {
                    this.stAtual = dados.stAtual;
                }
                
                this.atualizarTudo();
            }
        } catch (error) {
            // Usar valores padrão
        }
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let sistemaCaracteristicas = null;

function inicializarSistemaCaracteristicas() {
    if (!sistemaCaracteristicas) {
        sistemaCaracteristicas = new CaracteristicasFisicasSistema();
        sistemaCaracteristicas.inicializar();
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o modal existe
    setTimeout(() => {
        if (document.getElementById('alturaPesoModal')) {
            inicializarSistemaCaracteristicas();
        }
    }, 500);
});

// Adicionar estilos
const style = document.createElement('style');
style.textContent = `
    .status-info {
        font-size: 0.85em;
        margin-top: 5px;
        padding: 3px 6px;
        border-radius: 3px;
        display: inline-block;
    }
    
    .feature-btn {
        transition: all 0.3s ease;
    }
    
    .adjustment-controls {
        display: flex;
        align-items: center;
    }
    
    .adjustment-controls input {
        width: 80px;
        text-align: center;
        margin: 0 5px;
    }
    
    .btn-adjust {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        cursor: pointer;
        font-weight: bold;
    }
    
    .btn-adjust:hover {
        background: #e9ecef;
    }
    
    .btn-adjust.minus {
        border-radius: 4px 0 0 4px;
    }
    
    .btn-adjust.plus {
        border-radius: 0 4px 4px 0;
    }
`;
document.head.appendChild(style);

// Exportar para uso global
window.CaracteristicasFisicasSistema = CaracteristicasFisicasSistema;
window.inicializarSistemaCaracteristicas = inicializarSistemaCaracteristicas;