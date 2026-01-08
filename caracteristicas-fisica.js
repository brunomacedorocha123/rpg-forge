// =============================================
// CARACTERÍSTICAS FÍSICAS - SISTEMA COMPLETO
// =============================================

class SistemaCaracteristicasFisicas {
    constructor() {
        // Características físicas
        this.caracteristicas = {
            "magro": { 
                pontos: -5,
                nome: "Magro",
                efeitos: "Peso = 67% do normal",
                pesoMultiplicador: 0.67,
                alturaMaxima: null,
                icone: "fas fa-person-walking",
                descricao: "Peso reduzido para 67% da média",
                conflitos: ["acima-peso", "gordo", "muito-gordo"]
            },
            "acima-peso": { 
                pontos: -1,
                nome: "Acima do Peso",
                efeitos: "Peso = 130% do normal",
                pesoMultiplicador: 1.3,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 130% da média",
                conflitos: ["magro", "gordo", "muito-gordo"]
            },
            "gordo": { 
                pontos: -3,
                nome: "Gordo",
                efeitos: "Peso = 150% do normal",
                pesoMultiplicador: 1.5,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 150% da média",
                conflitos: ["magro", "acima-peso", "muito-gordo"]
            },
            "muito-gordo": { 
                pontos: -5,
                nome: "Muito Gordo",
                efeitos: "Peso = 200% do normal",
                pesoMultiplicador: 2.0,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso dobrado em relação à média",
                conflitos: ["magro", "acima-peso", "gordo"]
            },
            "nanismo": { 
                pontos: -15,
                nome: "Nanismo",
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
                efeitos: "MT +1, +1 Deslocamento",
                pesoMultiplicador: null,
                alturaMaxima: null,
                icone: "fas fa-arrow-up",
                descricao: "Altura acima do máximo para a raça",
                conflitos: ["nanismo"]
            }
        };

        // Características visuais
        this.caracteristicasVisuais = {
            "cor-pele": ["Muito clara", "Clara", "Morena clara", "Morena", "Morena escura", "Escura", "Muito escura"],
            "cor-olhos": ["Azuis", "Verdes", "Castanhos claros", "Castanhos", "Castanhos escuros", "Pretos", "Vermelhos", "Âmbar"],
            "cor-cabelo": ["Loiro", "Ruivo", "Castanho claro", "Castanho", "Castanho escuro", "Preto", "Grisalho", "Branco"],
            "tipo-cabelo": ["Liso", "Ondulado", "Cacheado", "Crespo", "Careca", "Calvo", "Longo", "Curto", "Médio"],
            "idade": 25
        };

        // Tabelas baseadas no ST
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

        // Estado
        this.caracteristicasSelecionadas = [];
        this.visualSelecionado = {
            "cor-pele": "Morena",
            "cor-olhos": "Castanhos",
            "cor-cabelo": "Castanho",
            "tipo-cabelo": "Curto",
            "idade": 25
        };
        
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
        
        // Obter ST atual
        this.obterSTAtual();
        
        // Configurar eventos do modal
        this.configurarModal();
        
        // Configurar eventos da interface principal
        this.configurarEventosPrincipais();
        
        // Carregar dados salvos
        this.carregarDadosSalvos();
        
        // Atualizar tudo
        this.atualizarTudo();
        
        this.inicializado = true;
    }

    configurarModal() {
        const modal = document.getElementById('alturaPesoModal');
        const btnCustomizar = document.getElementById('customizeBtn');
        const btnFechar = modal?.querySelector('.modal-close');
        const btnCancelar = document.getElementById('cancelBtn');
        const btnAplicar = document.getElementById('applyBtn');
        
        if (btnCustomizar) {
            btnCustomizar.addEventListener('click', () => this.abrirModal());
        }
        
        if (btnFechar) {
            btnFechar.addEventListener('click', () => this.fecharModal());
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.fecharModal());
        }
        
        if (btnAplicar) {
            btnAplicar.addEventListener('click', () => this.aplicarAlteracoes());
        }
        
        // Configurar botões de características no modal
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.type;
                this.alternarCaracteristica(tipo);
            });
        });
        
        // Configurar controles de ajuste
        const btnAlturaMais = modal?.querySelector('#alturaModal').parentElement.querySelector('.btn-adjust.plus');
        const btnAlturaMenos = modal?.querySelector('#alturaModal').parentElement.querySelector('.btn-adjust.minus');
        const btnPesoMais = modal?.querySelector('#pesoModal').parentElement.querySelector('.btn-adjust.plus');
        const btnPesoMenos = modal?.querySelector('#pesoModal').parentElement.querySelector('.btn-adjust.minus');
        
        if (btnAlturaMais) btnAlturaMais.onclick = () => this.ajustarAltura(0.01);
        if (btnAlturaMenos) btnAlturaMenos.onclick = () => this.ajustarAltura(-0.01);
        if (btnPesoMais) btnPesoMais.onclick = () => this.ajustarPeso(1);
        if (btnPesoMenos) btnPesoMenos.onclick = () => this.ajustarPeso(-1);
        
        // Evento para mudanças nos inputs
        const inputAlturaModal = document.getElementById('alturaModal');
        const inputPesoModal = document.getElementById('pesoModal');
        
        if (inputAlturaModal) {
            inputAlturaModal.addEventListener('change', () => {
                this.altura = parseFloat(inputAlturaModal.value) || 1.70;
                this.atualizarStatusModal();
            });
        }
        
        if (inputPesoModal) {
            inputPesoModal.addEventListener('change', () => {
                this.peso = parseInt(inputPesoModal.value) || 70;
                this.atualizarStatusModal();
            });
        }
    }

    configurarEventosPrincipais() {
        // Botões de idade
        const inputIdade = document.getElementById('idade');
        const btnIdadeMais = inputIdade?.parentElement.querySelector('.btn-number.plus');
        const btnIdadeMenos = inputIdade?.parentElement.querySelector('.btn-number.minus');
        
        if (btnIdadeMais) {
            btnIdadeMais.addEventListener('click', () => this.ajustarIdade(1));
        }
        
        if (btnIdadeMenos) {
            btnIdadeMenos.addEventListener('click', () => this.ajustarIdade(-1));
        }
        
        if (inputIdade) {
            inputIdade.addEventListener('change', () => {
                let idade = parseInt(inputIdade.value) || 25;
                if (idade < 12) idade = 12;
                if (idade > 100) idade = 100;
                inputIdade.value = idade;
                this.visualSelecionado.idade = idade;
            });
        }
        
        // Escutar mudanças no ST
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.ST) {
                this.stAtual = e.detail.ST;
                this.atualizarTudo();
            }
        });
        
        // Verificar ST periodicamente
        setInterval(() => this.verificarST(), 2000);
    }

    // ===========================================
    // GERENCIAMENTO DO MODAL
    // ===========================================

    abrirModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        // Atualizar ST no modal
        this.obterSTAtual();
        document.getElementById('statusST').textContent = this.stAtual;
        
        // Atualizar valores no modal
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        document.getElementById('pesoModal').value = this.peso;
        
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
        // Aplicar altura e peso
        const inputAltura = document.getElementById('alturaModal');
        const inputPeso = document.getElementById('pesoModal');
        
        if (inputAltura) {
            this.altura = parseFloat(inputAltura.value) || 1.70;
            document.getElementById('altura').value = this.altura.toFixed(2);
        }
        
        if (inputPeso) {
            this.peso = parseInt(inputPeso.value) || 70;
            document.getElementById('peso').value = this.peso;
        }
        
        // Fechar modal
        this.fecharModal();
        
        // Atualizar interface principal
        this.atualizarTudo();
        
        // Salvar dados
        this.salvarDados();
        
        // Atualizar sistema de pontos
        this.atualizarPontos();
    }

    // ===========================================
    // GERENCIAMENTO DE CARACTERÍSTICAS
    // ===========================================

    alternarCaracteristica(tipo) {
        const jaSelecionada = this.caracteristicasSelecionadas.find(c => c.tipo === tipo);
        
        if (jaSelecionada) {
            this.removerCaracteristica(jaSelecionada.id);
        } else {
            this.adicionarCaracteristica(tipo);
        }
        
        this.atualizarStatusModal();
        this.atualizarBotoesCaracteristicas();
    }

    adicionarCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;

        // Verificar se já está selecionada
        if (this.caracteristicasSelecionadas.find(c => c.tipo === tipo)) return;

        // Remover características conflitantes
        if (caracteristica.conflitos) {
            caracteristica.conflitos.forEach(conflito => {
                this.caracteristicasSelecionadas = this.caracteristicasSelecionadas.filter(c => c.tipo !== conflito);
            });
        }

        // Adicionar característica
        const novaCaracteristica = {
            id: Date.now(),
            tipo: tipo,
            nome: caracteristica.nome,
            pontos: caracteristica.pontos,
            efeitos: caracteristica.efeitos,
            pesoMultiplicador: caracteristica.pesoMultiplicador,
            alturaMaxima: caracteristica.alturaMaxima,
            icone: caracteristica.icone
        };

        this.caracteristicasSelecionadas.push(novaCaracteristica);
        
        // Aplicar efeitos imediatos
        this.aplicarEfeitosCaracteristica(novaCaracteristica);
    }

    removerCaracteristica(id) {
        this.caracteristicasSelecionadas = this.caracteristicasSelecionadas.filter(c => c.id !== id);
        
        // Recalcular tudo
        this.atualizarTudo();
    }

    aplicarEfeitosCaracteristica(caracteristica) {
        // Se for nanismo, ajustar altura se necessário
        if (caracteristica.tipo === 'nanismo' && caracteristica.alturaMaxima) {
            if (this.altura > caracteristica.alturaMaxima) {
                this.altura = caracteristica.alturaMaxima;
                document.getElementById('altura').value = this.altura.toFixed(2);
                document.getElementById('alturaModal').value = this.altura.toFixed(2);
            }
        }
    }

    // ===========================================
    // CÁLCULOS E VERIFICAÇÕES
    // ===========================================

    obterSTAtual() {
        // Tentar obter do sistema de atributos
        if (window.getAtributosPersonagem) {
            const atributos = window.getAtributosPersonagem();
            if (atributos && atributos.ST) {
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
        
        // Valor padrão
        this.stAtual = 10;
    }

    verificarST() {
        const novoST = this.obterSTAtual();
        if (novoST !== this.stAtual) {
            this.stAtual = novoST;
            this.atualizarTudo();
        }
    }

    obterFaixaAltura(st) {
        if (st >= 6 && st <= 16) {
            return this.alturaPorST[st];
        }
        
        // Extrapolar para STs fora da tabela
        if (st > 16) {
            const incremento = (st - 16) * 0.05;
            return {
                min: (this.alturaPorST[16].min + incremento).toFixed(2),
                max: (this.alturaPorST[16].max + incremento).toFixed(2)
            };
        }
        
        if (st < 6) {
            const decremento = (6 - st) * 0.05;
            return {
                min: (this.alturaPorST[6].min - decremento).toFixed(2),
                max: (this.alturaPorST[6].max - decremento).toFixed(2)
            };
        }
        
        return { min: "1.30", max: "2.50" };
    }

    obterFaixaPeso(st) {
        if (st >= 6 && st <= 16) {
            return this.pesoPorST[st];
        }
        
        // Extrapolar para STs fora da tabela
        if (st > 16) {
            const incremento = (st - 16) * 10;
            return {
                min: this.pesoPorST[16].min + incremento,
                max: this.pesoPorST[16].max + incremento
            };
        }
        
        if (st < 6) {
            const decremento = (6 - st) * 5;
            return {
                min: Math.max(20, this.pesoPorST[6].min - decremento),
                max: Math.max(25, this.pesoPorST[6].max - decremento)
            };
        }
        
        return { min: 30, max: 200 };
    }

    verificarConformidade() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoOriginal = this.obterFaixaPeso(this.stAtual);
        
        // Obter multiplicador de peso ativo
        let multiplicadorPeso = 1.0;
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
        }
        
        // Ajustar faixa de peso pelo multiplicador
        const faixaPesoAjustada = {
            min: faixaPesoOriginal.min * multiplicadorPeso,
            max: faixaPesoOriginal.max * multiplicadorPeso
        };
        
        // Verificar nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        const alturaValida = nanismo ? 
            this.altura <= (nanismo.alturaMaxima || 1.32) : 
            this.altura >= faixaAltura.min && this.altura <= faixaAltura.max;
        
        // Verificar peso
        const pesoValido = this.peso >= faixaPesoAjustada.min && this.peso <= faixaPesoAjustada.max;
        
        return {
            alturaValida,
            pesoValido,
            faixaAltura,
            faixaPeso: faixaPesoAjustada,
            faixaPesoOriginal,
            multiplicadorPeso,
            caracteristicaAtiva: caracteristicaPeso,
            nanismoAtivo: !!nanismo,
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
        const novaAltura = this.altura + variacao;
        
        // Verificar limites
        if (novaAltura < 1.20) return;
        if (novaAltura > 2.50) return;
        
        // Verificar nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        if (nanismo && nanismo.alturaMaxima && novaAltura > nanismo.alturaMaxima) {
            return;
        }
        
        this.altura = parseFloat(novaAltura.toFixed(2));
        
        // Atualizar inputs
        document.getElementById('altura').value = this.altura.toFixed(2);
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        
        this.atualizarStatusModal();
    }

    ajustarPeso(variacao) {
        const novoPeso = this.peso + variacao;
        
        if (novoPeso < 20) return;
        if (novoPeso > 200) return;
        
        this.peso = novoPeso;
        
        // Atualizar inputs
        document.getElementById('peso').value = this.peso;
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
        this.visualSelecionado.idade = idade;
    }

    // ===========================================
    // ATUALIZAÇÃO DA INTERFACE
    // ===========================================

    atualizarTudo() {
        const conformidade = this.verificarConformidade();
        
        // Atualizar status na interface principal
        this.atualizarStatusPrincipal(conformidade);
        
        // Atualizar pontos
        this.atualizarPontos();
    }

    atualizarStatusPrincipal(conformidade) {
        // Atualizar faixas recomendadas
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPeso = this.obterFaixaPeso(this.stAtual);
        
        // Mostrar status próximo aos inputs
        const statusAltura = document.getElementById('altura').nextElementSibling;
        const statusPeso = document.getElementById('peso').nextElementSibling;
        
        if (statusAltura && statusAltura.classList.contains('status-info')) {
            if (conformidade.nanismoAtivo) {
                statusAltura.textContent = "Nanismo ativo";
                statusAltura.style.color = "#e74c3c";
            } else if (conformidade.alturaValida) {
                statusAltura.textContent = `Dentro da faixa (${faixaAltura.min}m - ${faixaAltura.max}m)`;
                statusAltura.style.color = "#27ae60";
            } else {
                statusAltura.textContent = `Fora da faixa (${faixaAltura.min}m - ${faixaAltura.max}m)`;
                statusAltura.style.color = "#f39c12";
            }
        }
        
        if (statusPeso && statusPeso.classList.contains('status-info')) {
            if (conformidade.caracteristicaAtiva) {
                statusPeso.textContent = `${conformidade.caracteristicaAtiva.nome} ativo`;
                statusPeso.style.color = "#e74c3c";
            } else if (conformidade.pesoValido) {
                statusPeso.textContent = `Dentro da faixa (${faixaPeso.min}kg - ${faixaPeso.max}kg)`;
                statusPeso.style.color = "#27ae60";
            } else {
                statusPeso.textContent = `Fora da faixa (${faixaPeso.min}kg - ${faixaPeso.max}kg)`;
                statusPeso.style.color = "#f39c12";
            }
        }
    }

    atualizarStatusModal() {
        const conformidade = this.verificarConformidade();
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPeso = this.obterFaixaPeso(this.stAtual);
        
        // Atualizar informações no modal
        document.getElementById('faixaAltura').textContent = `${faixaAltura.min}m - ${faixaAltura.max}m`;
        document.getElementById('faixaPeso').textContent = `${faixaPeso.min}kg - ${faixaPeso.max}kg`;
        
        // Atualizar status da altura
        const statusAltura = document.querySelector('#alturaModal').parentElement.nextElementSibling;
        if (statusAltura && statusAltura.classList.contains('status-info')) {
            if (conformidade.nanismoAtivo) {
                statusAltura.textContent = "Nanismo ativo: Altura máxima 1.32m";
                statusAltura.style.color = "#e74c3c";
            } else if (conformidade.alturaValida) {
                statusAltura.textContent = "Dentro da faixa recomendada";
                statusAltura.style.color = "#27ae60";
            } else if (this.altura < faixaAltura.min) {
                statusAltura.textContent = "Abaixo da faixa mínima";
                statusAltura.style.color = "#f39c12";
            } else {
                statusAltura.textContent = "Acima da faixa máxima";
                statusAltura.style.color = "#f39c12";
            }
        }
        
        // Atualizar status do peso
        const statusPeso = document.querySelector('#pesoModal').parentElement.nextElementSibling;
        if (statusPeso && statusPeso.classList.contains('status-info')) {
            if (conformidade.caracteristicaAtiva) {
                statusPeso.textContent = `${conformidade.caracteristicaAtiva.nome}: Peso ${conformidade.multiplicadorPeso}x`;
                statusPeso.style.color = "#e74c3c";
            } else if (conformidade.pesoValido) {
                statusPeso.textContent = "Dentro da faixa recomendada";
                statusPeso.style.color = "#27ae60";
            } else if (this.peso < faixaPeso.min) {
                statusPeso.textContent = "Abaixo do peso mínimo";
                statusPeso.style.color = "#f39c12";
            } else {
                statusPeso.textContent = "Acima do peso máximo";
                statusPeso.style.color = "#f39c12";
            }
        }
    }

    atualizarBotoesCaracteristicas() {
        document.querySelectorAll('.feature-btn').forEach(btn => {
            const tipo = btn.dataset.type;
            const jaSelecionada = this.caracteristicasSelecionadas.find(c => c.tipo === tipo);
            
            if (jaSelecionada) {
                btn.classList.add('selecionado');
                btn.style.background = '#3498db';
                btn.style.color = 'white';
            } else {
                btn.classList.remove('selecionado');
                btn.style.background = '';
                btn.style.color = '';
            }
        });
    }

    atualizarPontos() {
        const pontos = this.calcularPontosCaracteristicas();
        
        // Atualizar sistema de pontos se disponível
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
            visualSelecionado: this.visualSelecionado,
            altura: this.altura,
            peso: this.peso,
            stAtual: this.stAtual,
            timestamp: new Date().toISOString()
        };
        
        // Salvar no localStorage
        localStorage.setItem('rpgforge_caracteristicas', JSON.stringify(dados));
        
        // Salvar via sistema se disponível
        if (window.salvarModulo) {
            window.salvarModulo('caracteristicas', dados);
        }
    }

    carregarDadosSalvos() {
        try {
            // Tentar carregar do sistema
            if (window.carregarModulo) {
                const dados = window.carregarModulo('caracteristicas');
                if (dados) {
                    this.aplicarDadosCarregados(dados);
                    return;
                }
            }
            
            // Tentar carregar do localStorage
            const dadosSalvos = localStorage.getItem('rpgforge_caracteristicas');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                this.aplicarDadosCarregados(dados);
            }
        } catch (error) {
            // Usar valores padrão em caso de erro
        }
    }

    aplicarDadosCarregados(dados) {
        if (dados.caracteristicasSelecionadas) {
            this.caracteristicasSelecionadas = dados.caracteristicasSelecionadas;
        }
        
        if (dados.visualSelecionado) {
            this.visualSelecionado = dados.visualSelecionado;
            document.getElementById('idade').value = this.visualSelecionado.idade || 25;
        }
        
        if (dados.altura !== undefined) {
            this.altura = dados.altura;
            document.getElementById('altura').value = this.altura.toFixed(2);
        }
        
        if (dados.peso !== undefined) {
            this.peso = dados.peso;
            document.getElementById('peso').value = this.peso;
        }
        
        if (dados.stAtual) {
            this.stAtual = dados.stAtual;
        }
        
        this.atualizarTudo();
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let sistemaCaracteristicas = null;

function inicializarSistemaCaracteristicas() {
    if (!sistemaCaracteristicas) {
        sistemaCaracteristicas = new SistemaCaracteristicasFisicas();
        sistemaCaracteristicas.inicializar();
    }
    return sistemaCaracteristicas;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que os elementos existem
    setTimeout(() => {
        if (document.getElementById('alturaPesoModal')) {
            inicializarSistemaCaracteristicas();
        }
    }, 1000);
});

// Adicionar estilos
const style = document.createElement('style');
style.textContent = `
    .feature-btn.selecionado {
        background: #3498db !important;
        color: white !important;
        border-color: #2980b9 !important;
    }
    
    .status-info {
        font-size: 0.85em;
        margin-top: 4px;
        font-style: italic;
    }
    
    .btn-adjust {
        padding: 5px 10px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        cursor: pointer;
    }
    
    .btn-adjust:hover {
        background: #e9ecef;
    }
    
    .btn-adjust.plus {
        border-radius: 0 4px 4px 0;
    }
    
    .btn-adjust.minus {
        border-radius: 4px 0 0 4px;
    }
`;
document.head.appendChild(style);

// Exportar para uso global
window.SistemaCaracteristicasFisicas = SistemaCaracteristicasFisicas;
window.inicializarSistemaCaracteristicas = inicializarSistemaCaracteristicas;