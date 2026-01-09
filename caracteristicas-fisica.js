// =============================================
// CARACTERÍSTICAS FÍSICAS - SISTEMA COMPLETO CORRIGIDO
// VERSÃO QUE ENVIA EVENTOS PARA O NOVO SISTEMA DE PONTOS
// =============================================

class CaracteristicasFisicasSistema {
    constructor() {
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

        this.caracteristicasSelecionadas = [];
        this.altura = 1.70;
        this.peso = 70;
        this.stAtual = 10;
    }

    inicializar() {
        this.atualizarST();
        this.configurarModal();
        this.configurarEventosPrincipais();
        this.carregarDados();
        this.atualizarTudo();
        
        console.log('✅ Sistema de características físicas inicializado!');
    }

    configurarModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) {
            console.log('⚠️ Modal de altura/peso não encontrado');
            return;
        }
        
        // Botão para abrir modal
        document.getElementById('customizeBtn')?.addEventListener('click', () => this.abrirModal());
        
        // Botões para fechar modal
        modal.querySelector('.modal-close')?.addEventListener('click', () => this.fecharModal());
        document.getElementById('cancelBtn')?.addEventListener('click', () => this.fecharModal());
        document.getElementById('applyBtn')?.addEventListener('click', () => this.aplicarAlteracoes());
        
        // Botões das características
        modal.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.type;
                this.alternarCaracteristica(tipo);
            });
        });
        
        // Controles de altura/peso no modal
        const btnAlturaMenos = document.querySelector('#alturaModal')?.parentElement.querySelector('.minus');
        const btnAlturaMais = document.querySelector('#alturaModal')?.parentElement.querySelector('.plus');
        const inputAltura = document.getElementById('alturaModal');
        const btnPesoMenos = document.querySelector('#pesoModal')?.parentElement.querySelector('.minus');
        const btnPesoMais = document.querySelector('#pesoModal')?.parentElement.querySelector('.plus');
        const inputPeso = document.getElementById('pesoModal');
        
        if (btnAlturaMenos) btnAlturaMenos.onclick = () => this.ajustarAltura(-0.01);
        if (btnAlturaMais) btnAlturaMais.onclick = () => this.ajustarAltura(0.01);
        if (btnPesoMenos) btnPesoMenos.onclick = () => this.ajustarPeso(-1);
        if (btnPesoMais) btnPesoMais.onclick = () => this.ajustarPeso(1);
        if (inputAltura) inputAltura.onchange = () => this.atualizarValorAltura();
        if (inputPeso) inputPeso.onchange = () => this.atualizarValorPeso();
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal();
        });
    }

    configurarEventosPrincipais() {
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        const inputIdade = document.getElementById('idade');
        const btnIdadeMenos = inputIdade?.parentElement.querySelector('.btn-number.minus');
        const btnIdadeMais = inputIdade?.parentElement.querySelector('.btn-number.plus');
        
        // Eventos dos inputs principais
        if (inputAltura) {
            inputAltura.addEventListener('change', () => {
                this.altura = parseFloat(inputAltura.value) || 1.70;
                this.atualizarStatusInputs();
                this.salvarDados();
                this.enviarPontosParaSistema(); // Atualiza pontos
            });
        }
        
        if (inputPeso) {
            inputPeso.addEventListener('change', () => {
                this.peso = parseInt(inputPeso.value) || 70;
                this.atualizarStatusInputs();
                this.salvarDados();
                this.enviarPontosParaSistema(); // Atualiza pontos
            });
        }
        
        // Botões de idade
        if (btnIdadeMenos) btnIdadeMenos.onclick = () => this.ajustarIdade(-1);
        if (btnIdadeMais) btnIdadeMais.onclick = () => this.ajustarIdade(1);
        
        // Escuta atualizações de atributos (ST pode mudar)
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.atributos?.ST) {
                this.stAtual = e.detail.atributos.ST;
                this.atualizarTudo();
                console.log('💪 ST atualizado para:', this.stAtual);
            }
        });
    }

    abrirModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        this.atualizarST();
        
        // Atualizar valores no modal
        const statusST = document.getElementById('statusST');
        if (statusST) statusST.textContent = this.stAtual;
        
        const alturaModal = document.getElementById('alturaModal');
        const pesoModal = document.getElementById('pesoModal');
        if (alturaModal) alturaModal.value = this.altura.toFixed(2);
        if (pesoModal) pesoModal.value = this.peso;
        
        this.atualizarFaixasModal();
        this.atualizarStatusModal();
        this.atualizarBotoesCaracteristicas();
        
        modal.style.display = 'block';
        console.log('📱 Modal de características físicas aberto');
    }

    fecharModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    aplicarAlteracoes() {
        const alturaModal = document.getElementById('alturaModal');
        const pesoModal = document.getElementById('pesoModal');
        
        // Aplica valores do modal
        if (alturaModal) this.altura = parseFloat(alturaModal.value) || 1.70;
        if (pesoModal) this.peso = parseInt(pesoModal.value) || 70;
        
        // Atualiza inputs principais
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        if (inputAltura) inputAltura.value = this.altura.toFixed(2);
        if (inputPeso) inputPeso.value = this.peso;
        
        this.fecharModal();
        this.atualizarStatusInputs();
        this.salvarDados();
        this.enviarPontosParaSistema(); // Atualiza pontos
    }

    alternarCaracteristica(tipo) {
        const index = this.caracteristicasSelecionadas.findIndex(c => c.tipo === tipo);
        
        if (index !== -1) {
            // Remove a característica
            const removida = this.caracteristicasSelecionadas[index];
            this.caracteristicasSelecionadas.splice(index, 1);
            console.log('❌ Característica removida:', removida.nome, '(', removida.pontos, 'pts)');
        } else {
            // Adiciona a característica
            this.adicionarCaracteristica(tipo);
        }
        
        this.atualizarBotoesCaracteristicas();
        this.atualizarFaixasModal();
        this.atualizarStatusModal();
        this.enviarPontosParaSistema(); // ATUALIZA PONTOS
        this.salvarDados();
        this.atualizarStatusInputs();
    }

    adicionarCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;
        
        // Remove características conflitantes
        if (caracteristica.conflitos) {
            caracteristica.conflitos.forEach(conflito => {
                const indexConflito = this.caracteristicasSelecionadas.findIndex(c => c.tipo === conflito);
                if (indexConflito !== -1) {
                    const removida = this.caracteristicasSelecionadas[indexConflito];
                    this.caracteristicasSelecionadas.splice(indexConflito, 1);
                    console.log('⚠️ Característica conflitante removida:', removida.nome);
                }
            });
        }
        
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
        
        console.log('✅ Característica adicionada:', caracteristica.nome, '(', caracteristica.pontos, 'pts)');
        
        // Ajusta altura automaticamente se for nanismo
        if (tipo === 'nanismo' && this.altura > 1.32) {
            this.altura = 1.32;
            const inputAltura = document.getElementById('altura');
            const alturaModal = document.getElementById('alturaModal');
            if (inputAltura) inputAltura.value = this.altura.toFixed(2);
            if (alturaModal) alturaModal.value = this.altura.toFixed(2);
            console.log('📏 Altura ajustada para limite do nanismo: 1.32m');
        }
    }

    atualizarST() {
        // Tenta obter ST do sistema de atributos
        if (window.getAtributosPersonagem) {
            const atributos = window.getAtributosPersonagem();
            if (atributos?.ST) {
                this.stAtual = atributos.ST;
                return;
            }
        }
        
        // Fallback: pega do input
        const inputST = document.getElementById('ST');
        this.stAtual = inputST ? parseInt(inputST.value) || 10 : 10;
    }

    obterFaixaAltura(st) {
        if (st >= 6 && st <= 16) {
            return this.alturaPorST[st];
        }
        
        if (st > 16) {
            const base = this.alturaPorST[16];
            const incremento = (st - 16) * 0.05;
            return {
                min: parseFloat((parseFloat(base.min) + incremento).toFixed(2)),
                max: parseFloat((parseFloat(base.max) + incremento).toFixed(2))
            };
        }
        
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
        if (st >= 6 && st <= 16) {
            return this.pesoPorST[st];
        }
        
        if (st > 16) {
            const base = this.pesoPorST[16];
            const incremento = (st - 16) * 10;
            return {
                min: Math.round(base.min + incremento),
                max: Math.round(base.max + incremento)
            };
        }
        
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

    verificarConformidade() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoBase = this.obterFaixaPeso(this.stAtual);
        
        let multiplicadorPeso = 1.0;
        let caracteristicaAtiva = null;
        
        // Verifica se há característica que afeta peso
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
            caracteristicaAtiva = caracteristicaPeso;
        }
        
        // Ajusta faixa de peso conforme característica
        const faixaPesoAjustada = {
            min: Math.round(faixaPesoBase.min * multiplicadorPeso),
            max: Math.round(faixaPesoBase.max * multiplicadorPeso)
        };
        
        // Verifica nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        let alturaValida = true;
        let mensagemAltura = '';
        
        if (nanismo) {
            alturaValida = this.altura <= 1.32;
            mensagemAltura = alturaValida ? 
                'Dentro do limite do nanismo (1.32m)' : 
                'Acima do limite do nanismo (1.32m)';
        } else {
            alturaValida = this.altura >= faixaAltura.min && this.altura <= faixaAltura.max;
            mensagemAltura = alturaValida ? 
                `Dentro da faixa (${faixaAltura.min.toFixed(2)}m - ${faixaAltura.max.toFixed(2)}m)` :
                this.altura < faixaAltura.min ? 
                    `Abaixo do mínimo (${faixaAltura.min.toFixed(2)}m)` :
                    `Acima do máximo (${faixaAltura.max.toFixed(2)}m)`;
        }
        
        // Verifica peso
        const pesoValido = this.peso >= faixaPesoAjustada.min && this.peso <= faixaPesoAjustada.max;
        let mensagemPeso = '';
        
        if (caracteristicaAtiva) {
            mensagemPeso = pesoValido ? 
                `${caracteristicaAtiva.nome}: ${faixaPesoAjustada.min}kg - ${faixaPesoAjustada.max}kg` :
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
            mensagemPeso
        };
    }

    atualizarFaixasModal() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoBase = this.obterFaixaPeso(this.stAtual);
        
        let multiplicadorPeso = 1.0;
        let nomeCaracteristica = '';
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
            nomeCaracteristica = caracteristicaPeso.nome;
        }
        
        const faixaPesoAjustada = {
            min: Math.round(faixaPesoBase.min * multiplicadorPeso),
            max: Math.round(faixaPesoBase.max * multiplicadorPeso)
        };
        
        // Atualiza display das faixas no modal
        const faixaAlturaElement = document.getElementById('faixaAltura');
        if (faixaAlturaElement) {
            faixaAlturaElement.textContent = `${faixaAltura.min.toFixed(2)}m - ${faixaAltura.max.toFixed(2)}m`;
        }
        
        const faixaPesoElement = document.getElementById('faixaPeso');
        if (faixaPesoElement) {
            if (caracteristicaPeso) {
                faixaPesoElement.textContent = `${faixaPesoAjustada.min}kg - ${faixaPesoAjustada.max}kg (${nomeCaracteristica})`;
                faixaPesoElement.style.color = '#f39c12';
                faixaPesoElement.style.fontWeight = 'bold';
            } else {
                faixaPesoElement.textContent = `${faixaPesoBase.min}kg - ${faixaPesoBase.max}kg`;
                faixaPesoElement.style.color = '';
                faixaPesoElement.style.fontWeight = '';
            }
        }
    }

    calcularPontosCaracteristicas() {
        const total = this.caracteristicasSelecionadas.reduce((total, carac) => total + carac.pontos, 0);
        console.log('🧮 Pontos de características físicas calculados:', total, 'pts');
        return total;
    }

    ajustarAltura(variacao) {
        let novaAltura = this.altura + variacao;
        
        // Limites do nanismo
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        if (nanismo && novaAltura > 1.32) novaAltura = 1.32;
        
        // Limites gerais
        if (novaAltura < 1.20) novaAltura = 1.20;
        if (novaAltura > 2.50) novaAltura = 2.50;
        
        this.altura = parseFloat(novaAltura.toFixed(2));
        const alturaModal = document.getElementById('alturaModal');
        if (alturaModal) alturaModal.value = this.altura.toFixed(2);
        
        this.atualizarStatusModal();
    }

    ajustarPeso(variacao) {
        let novoPeso = this.peso + variacao;
        if (novoPeso < 20) novoPeso = 20;
        if (novoPeso > 200) novoPeso = 200;
        
        this.peso = novoPeso;
        const pesoModal = document.getElementById('pesoModal');
        if (pesoModal) pesoModal.value = this.peso;
        
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
        this.altura = parseFloat(input.value) || 1.70;
        this.atualizarStatusModal();
    }

    atualizarValorPeso() {
        const input = document.getElementById('pesoModal');
        this.peso = parseInt(input.value) || 70;
        this.atualizarStatusModal();
    }

    atualizarTudo() {
        this.atualizarStatusInputs();
        this.enviarPontosParaSistema(); // ATUALIZA PONTOS
    }

    atualizarStatusInputs() {
        const conformidade = this.verificarConformidade();
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        
        // Aplica cores nos inputs baseado na validade
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

    atualizarStatusModal() {
        const conformidade = this.verificarConformidade();
        
        // Atualiza mensagens de status no modal
        const statusAltura = document.querySelector('#alturaModal')?.parentElement?.nextElementSibling;
        const statusPeso = document.querySelector('#pesoModal')?.parentElement?.nextElementSibling;
        
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
            
            // Aplica estilo ao botão selecionado
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

    // ==================== FUNÇÃO CORRIGIDA QUE ENVIA OS PONTOS ====================
    
    enviarPontosParaSistema() {
        const pontos = this.calcularPontosCaracteristicas();
        
        // ENVIA EVENTO CORRETO para o novo sistema de pontos
        // PONTOS NEGATIVOS: -5, -15, etc. (GANHA pontos)
        const evento = new CustomEvent('desvantagensAtualizadas', {
            detail: {
                pontos: pontos,  // VALOR NEGATIVO: Ex: -5 (Magro)
                tipo: 'caracteristicasFisicas',
                origem: 'caracteristicas_fisicas',
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(evento);
        
        console.log('📤 Características físicas enviadas para sistema de pontos:', pontos, 'pts (negativo = ganha pontos)');
        
        // Para compatibilidade com sistema antigo
        if (window.atualizarPontosAba) {
            window.atualizarPontosAba('desvantagens', pontos);
        }
    }

    // ==================== PERSISTÊNCIA ====================
    
    salvarDados() {
        try {
            const dados = {
                caracteristicasSelecionadas: this.caracteristicasSelecionadas,
                altura: this.altura,
                peso: this.peso,
                stAtual: this.stAtual,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('rpgforge_caracteristicas_fisicas', JSON.stringify(dados));
        } catch (error) {
            console.error('Erro ao salvar características físicas:', error);
        }
    }

    carregarDados() {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_caracteristicas_fisicas');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                if (dados.caracteristicasSelecionadas) {
                    this.caracteristicasSelecionadas = dados.caracteristicasSelecionadas;
                    console.log('📂 Características físicas carregadas:', this.caracteristicasSelecionadas.length, 'itens');
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
                console.log('✅ Dados de características físicas carregados com sucesso');
            }
        } catch (error) {
            console.error('Erro ao carregar características físicas:', error);
        }
    }
    
    // ==================== FUNÇÕES ADICIONAIS ====================
    
    obterCaracteristicasAtivas() {
        return [...this.caracteristicasSelecionadas];
    }
    
    obterPontosTotais() {
        return this.calcularPontosCaracteristicas();
    }
    
    obterDescricaoCaracteristicas() {
        if (this.caracteristicasSelecionadas.length === 0) {
            return "Nenhuma característica física selecionada";
        }
        
        return this.caracteristicasSelecionadas.map(c => 
            `${c.nome} (${c.pontos >= 0 ? '+' : ''}${c.pontos} pts): ${c.efeitos}`
        ).join(' | ');
    }
    
    resetar() {
        this.caracteristicasSelecionadas = [];
        this.altura = 1.70;
        this.peso = 70;
        this.stAtual = 10;
        
        // Atualiza inputs
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        if (inputAltura) inputAltura.value = this.altura.toFixed(2);
        if (inputPeso) inputPeso.value = this.peso;
        
        this.atualizarTudo();
        console.log('🔄 Características físicas resetadas');
    }
}

// ==================== INSTANCIAÇÃO GLOBAL ====================

let sistemaCaracteristicas = null;

function inicializarSistemaCaracteristicas() {
    if (!sistemaCaracteristicas) {
        sistemaCaracteristicas = new CaracteristicasFisicasSistema();
        sistemaCaracteristicas.inicializar();
    }
    return sistemaCaracteristicas;
}

// ==================== FUNÇÕES DE TESTE ====================

function testarCaracteristicasFisicas() {
    console.log('🧪 TESTANDO CARACTERÍSTICAS FÍSICAS');
    
    if (!sistemaCaracteristicas) {
        inicializarSistemaCaracteristicas();
    }
    
    console.log('1. Adicionando Magro (-5 pts)...');
    sistemaCaracteristicas.alternarCaracteristica('magro');
    
    setTimeout(() => {
        console.log('2. Adicionando Peso ajustado...');
        sistemaCaracteristicas.peso = 50;
        sistemaCaracteristicas.atualizarTudo();
        
        setTimeout(() => {
            console.log('3. Adicionando Nanismo (-15 pts)...');
            sistemaCaracteristicas.alternarCaracteristica('nanismo');
            
            setTimeout(() => {
                const pontos = sistemaCaracteristicas.calcularPontosCaracteristicas();
                console.log('📊 RESULTADO:');
                console.log('- Pontos totais:', pontos, 'pts');
                console.log('- Esperado: Magro (-5) + Nanismo (-15) = -20 pts');
                console.log('- Características:', sistemaCaracteristicas.obterDescricaoCaracteristicas());
                
                if (pontos === -20) {
                    console.log('✅ TESTE PASSOU! Sistema funcionando!');
                } else {
                    console.log('❌ TESTE FALHOU! Pontos incorretos.');
                }
            }, 300);
        }, 300);
    }, 300);
}

// ==================== INICIALIZAÇÃO AUTOMÁTICA ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('alturaPesoModal')) {
            inicializarSistemaCaracteristicas();
            console.log('🔄 Sistema de características físicas inicializado!');
        }
    }, 500);
});

// ==================== ESTILOS DINÂMICOS ====================

const style = document.createElement('style');
style.textContent = `
    .status-info {
        font-size: 0.85em;
        margin-top: 5px;
        padding: 3px 6px;
        border-radius: 3px;
        display: inline-block;
        font-style: italic;
    }
    
    .feature-btn {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .feature-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .feature-btn.selecionado {
        background-color: #3498db !important;
        color: white !important;
        border-color: #2980b9 !important;
    }
    
    .adjustment-controls {
        display: flex;
        align-items: center;
        margin: 5px 0;
    }
    
    .adjustment-controls input {
        width: 80px;
        text-align: center;
        margin: 0 5px;
        padding: 5px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
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
        user-select: none;
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
    
    /* Inputs com validação */
    input.valido {
        border-color: #27ae60 !important;
        background-color: #d4edda !important;
    }
    
    input.invalido {
        border-color: #e74c3c !important;
        background-color: #f8d7da !important;
    }
    
    input.aviso {
        border-color: #f39c12 !important;
        background-color: #fff3cd !important;
    }
`;
document.head.appendChild(style);

// ==================== EXPORTAÇÕES GLOBAIS ====================

window.CaracteristicasFisicasSistema = CaracteristicasFisicasSistema;
window.inicializarSistemaCaracteristicas = inicializarSistemaCaracteristicas;
window.testarCaracteristicasFisicas = testarCaracteristicasFisicas;
window.obterSistemaCaracteristicas = function() {
    return sistemaCaracteristicas;
};

window.obterPontosCaracteristicasFisicas = function() {
    return sistemaCaracteristicas ? sistemaCaracteristicas.calcularPontosCaracteristicas() : 0;
};

window.resetCaracteristicasFisicas = function() {
    if (sistemaCaracteristicas) {
        sistemaCaracteristicas.resetar();
    }
};

// ==================== COMPATIBILIDADE COM SISTEMA ANTIGO ====================

window.atualizarCaracteristicasFisicas = function(pontos) {
    if (sistemaCaracteristicas) {
        sistemaCaracteristicas.enviarPontosParaSistema();
    }
};