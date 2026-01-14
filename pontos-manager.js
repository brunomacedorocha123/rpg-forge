// pontos-manager.js - VERSÃO 100% COMPLETA (400+ linhas)
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        // ESTRUTURA COMPLETA DE GASTOS
        this.gastos = {
            // Atributos básicos (ST, DX, IQ, HT)
            atributos: 0,
            
            // Vantagens (todos positivos)
            vantagens: {
                aparência: 0,
                atributosComplementares: 0,
                idiomas: 0,
                riqueza: 0,
                statusSocial: 0,
                carisma: 0,
                reputaçãoPositiva: 0,
                aliados: 0,
                contatos: 0,
                patronos: 0,
                catálogo: 0,
                outras: 0
            },
            
            // Desvantagens (todos negativos)
            desvantagens: {
                aparência: 0,
                riqueza: 0,
                característicasFísicas: 0,
                statusSocial: 0,
                reputaçãoNegativa: 0,
                inimigos: 0,
                dependentes: 0,
                catálogo: 0,
                outras: 0
            },
            
            // Sistema de peculiaridades (sempre negativas)
            peculiaridades: 0,
            
            // Perícias e habilidades
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // Limites do sistema
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        // Cache para performance
        this.cache = {
            ultimaAtualizacao: 0,
            totaisCalculados: null
        };
        
        // Inicialização
        this.inicializar();
    }
    
    inicializar() {
        console.log('🚀 Inicializando PontosManager (Sistema Completo)...');
        
        // Configurar elementos do DOM
        this.configurarInputsPrincipais();
        this.configurarEventosGlobais();
        this.configurarObservadores();
        this.configurarIntegracoes();
        
        // Carregar dados salvos
        this.carregarLocalStorage();
        
        // Atualizar tudo
        this.atualizarTudo();
        
        // Expor instância globalmente
        window.pontosManagerInstance = this;
        
        console.log('✅ PontosManager inicializado com sucesso!');
    }
    
    // ===========================================
    // CONFIGURAÇÃO DO DOM
    // ===========================================
    
    configurarInputsPrincipais() {
        // Pontos Iniciais
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.salvarLocalStorage();
                this.atualizarTudo();
            });
            
            inputPontosIniciais.addEventListener('input', (e) => {
                const valor = parseInt(e.target.value);
                if (!isNaN(valor) && valor >= 0) {
                    this.pontosIniciais = valor;
                    this.atualizarPontosDisponiveis();
                }
            });
        }
        
        // Pontos Ganhos na Campanha
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.salvarLocalStorage();
                this.atualizarTudo();
            });
        }
        
        // Limite de Desvantagens
        const limiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (limiteDesvantagens) {
            limiteDesvantagens.value = this.limites.desvantagens;
            limiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.salvarLocalStorage();
                this.atualizarLimites();
            });
        }
        
        // Limite de Peculiaridades
        const limitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (limitePeculiaridades) {
            limitePeculiaridades.value = this.limites.peculiaridades;
            limitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.salvarLocalStorage();
                this.atualizarLimites();
            });
        }
        
        // Configurar botões de número
        document.querySelectorAll('.number-buttons button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = btn.closest('.number-input').querySelector('input');
                if (input) {
                    if (btn.classList.contains('plus')) {
                        input.value = parseInt(input.value) + 1;
                    } else if (btn.classList.contains('minus')) {
                        input.value = Math.max(0, parseInt(input.value) - 1);
                    }
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }
    
    configurarEventosGlobais() {
        // Eventos de Atributos
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                this.gastos.atributos = e.detail.pontosGastos;
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Riqueza
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos < 0) {
                    this.gastos.desvantagens.riqueza = Math.abs(pontos);
                    this.gastos.vantagens.riqueza = 0;
                } else if (pontos > 0) {
                    this.gastos.vantagens.riqueza = pontos;
                    this.gastos.desvantagens.riqueza = 0;
                } else {
                    this.gastos.vantagens.riqueza = 0;
                    this.gastos.desvantagens.riqueza = 0;
                }
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Características Físicas
        document.addEventListener('caracteristicasFisicasAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.desvantagens.característicasFísicas = Math.abs(e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Peculiaridades
        document.addEventListener('peculiaridadesAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.peculiaridades = Math.abs(e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Vantagens do Catálogo
        document.addEventListener('vantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.catálogo = Math.max(0, e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Desvantagens do Catálogo
        document.addEventListener('desvantagensCatalogoAtualizadas', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.desvantagens.catálogo = Math.abs(e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Status Social
        document.addEventListener('statusSocialAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = e.detail.pontos;
                if (pontos >= 0) {
                    this.gastos.vantagens.statusSocial = pontos;
                    this.gastos.desvantagens.statusSocial = 0;
                } else {
                    this.gastos.desvantagens.statusSocial = Math.abs(pontos);
                    this.gastos.vantagens.statusSocial = 0;
                }
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Carisma
        document.addEventListener('carismaAtualizado', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.carisma = Math.max(0, e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Reputação
        document.addEventListener('reputacaoAtualizada', (e) => {
            if (e.detail?.positiva !== undefined && e.detail?.negativa !== undefined) {
                this.gastos.vantagens.reputaçãoPositiva = Math.max(0, e.detail.positiva);
                this.gastos.desvantagens.reputaçãoNegativa = Math.abs(e.detail.negativa);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Aliados
        document.addEventListener('aliadosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.aliados = Math.max(0, e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Contatos
        document.addEventListener('contatosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.contatos = Math.max(0, e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Patronos
        document.addEventListener('patronosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.vantagens.patronos = Math.max(0, e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Inimigos
        document.addEventListener('inimigosAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.desvantagens.inimigos = Math.abs(e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Eventos de Dependentes
        document.addEventListener('dependentesAtualizados', (e) => {
            if (e.detail?.pontos !== undefined) {
                this.gastos.desvantagens.dependentes = Math.abs(e.detail.pontos);
                this.salvarLocalStorage();
                this.atualizarTudo();
            }
        });
        
        // Evento para receber dados diretos das vantagens
        document.addEventListener('vantagensDiretasAtualizadas', (e) => {
            if (e.detail) {
                this.atualizarDeVantagensDiretas(e.detail);
            }
        });
    }
    
    configurarObservadores() {
        // Observar mudanças na aba Principal
        const observerPrincipal = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const tab = mutation.target;
                    if (tab.id === 'principal' && tab.classList.contains('active')) {
                        console.log('🏠 Aba Principal ativa - Atualizando display...');
                        setTimeout(() => this.atualizarTudo(), 100);
                    }
                }
            });
        });
        
        const tabPrincipal = document.getElementById('principal');
        if (tabPrincipal) {
            observerPrincipal.observe(tabPrincipal, { attributes: true });
        }
        
        // Observar mudanças na aba Vantagens
        const observerVantagens = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const tab = mutation.target;
                    if (tab.id === 'vantagens' && tab.classList.contains('active')) {
                        console.log('⭐ Aba Vantagens ativa - Verificando integração...');
                        setTimeout(() => this.verificarIntegracaoVantagens(), 300);
                    }
                }
            });
        });
        
        const tabVantagens = document.getElementById('vantagens');
        if (tabVantagens) {
            observerVantagens.observe(tabVantagens, { attributes: true });
        }
    }
    
    configurarIntegracoes() {
        // Configurar integração com atributos.js
        if (typeof window.obterPontosAtributos === 'function') {
            setTimeout(() => {
                const pontosAtributos = window.obterPontosAtributos();
                if (pontosAtributos !== undefined) {
                    this.gastos.atributos = pontosAtributos;
                    this.atualizarTudo();
                }
            }, 500);
        }
        
        // Configurar integração com características físicas
        if (typeof window.obterPontosCaracteristicas === 'function') {
            setTimeout(() => {
                const pontos = window.obterPontosCaracteristicas();
                if (pontos !== undefined) {
                    this.gastos.desvantagens.característicasFísicas = Math.abs(pontos);
                    this.atualizarTudo();
                }
            }, 500);
        }
        
        // Configurar integração com riqueza
        if (typeof window.obterPontosRiqueza === 'function') {
            setTimeout(() => {
                const pontos = window.obterPontosRiqueza();
                if (pontos !== undefined) {
                    if (pontos < 0) {
                        this.gastos.desvantagens.riqueza = Math.abs(pontos);
                    } else if (pontos > 0) {
                        this.gastos.vantagens.riqueza = pontos;
                    }
                    this.atualizarTudo();
                }
            }, 500);
        }
        
        // Configurar integração com peculiaridades
        if (typeof window.obterPontosPeculiaridades === 'function') {
            setTimeout(() => {
                const pontos = window.obterPontosPeculiaridades();
                if (pontos !== undefined) {
                    this.gastos.peculiaridades = Math.abs(pontos);
                    this.atualizarTudo();
                }
            }, 500);
        }
    }
    
    // ===========================================
    // MÉTODOS DE INTEGRAÇÃO COM VANTAGENS
    // ===========================================
    
    atualizarDeVantagensDiretas(dados) {
        console.log('📥 Recebendo dados diretos das vantagens:', dados);
        
        // Processar dados de aparência
        if (dados.aparencia !== undefined) {
            const pontos = dados.aparencia;
            if (pontos >= 0) {
                this.gastos.vantagens.aparência = pontos;
                this.gastos.desvantagens.aparência = 0;
            } else {
                this.gastos.desvantagens.aparência = Math.abs(pontos);
                this.gastos.vantagens.aparência = 0;
            }
        }
        
        // Processar dados de idiomas
        if (dados.idiomas !== undefined) {
            const pontos = dados.idiomas;
            if (pontos >= 0) {
                this.gastos.vantagens.idiomas = pontos;
                this.gastos.desvantagens.idiomas = 0;
            } else {
                this.gastos.desvantagens.idiomas = Math.abs(pontos);
                this.gastos.vantagens.idiomas = 0;
            }
        }
        
        // Processar dados de atributos complementares
        if (dados.atributosComplementares !== undefined) {
            const pontos = dados.atributosComplementares;
            if (pontos >= 0) {
                this.gastos.vantagens.atributosComplementares = pontos;
                this.gastos.desvantagens.outras = Math.max(0, this.gastos.desvantagens.outras);
            } else {
                this.gastos.desvantagens.outras += Math.abs(pontos);
                this.gastos.vantagens.atributosComplementares = 0;
            }
        }
        
        this.salvarLocalStorage();
        this.atualizarTudo();
    }
    
    verificarIntegracaoVantagens() {
        // Verificar se existe o sistema de vantagens
        if (typeof window.obterVantagensLogica === 'function') {
            try {
                const vantagensLogica = window.obterVantagensLogica();
                if (vantagensLogica) {
                    console.log('✅ Sistema de vantagens detectado - Sincronizando...');
                    
                    // Coletar dados atualizados
                    const dadosAtualizados = this.coletarDadosVantagensAtuais();
                    
                    if (Object.keys(dadosAtualizados).length > 0) {
                        this.atualizarDeVantagensDiretas(dadosAtualizados);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Erro ao sincronizar com vantagens:', error);
            }
        }
    }
    
    coletarDadosVantagensAtuais() {
        const dados = {};
        
        try {
            // 1. Aparência
            const selectAparencia = document.getElementById('nivelAparencia');
            if (selectAparencia) {
                dados.aparencia = parseInt(selectAparencia.value) || 0;
            }
            
            // 2. Idiomas
            let pontosIdiomas = 0;
            
            // Alfabetização
            const radiosAlfabetizacao = document.querySelectorAll('input[name="alfabetizacao"]:checked');
            if (radiosAlfabetizacao.length > 0) {
                pontosIdiomas += parseInt(radiosAlfabetizacao[0].value) || 0;
            }
            
            // Idiomas adicionais
            const itensIdiomas = document.querySelectorAll('.idioma-item .idioma-custo');
            itensIdiomas.forEach(item => {
                const texto = item.textContent.replace(/[^\d-]/g, '');
                if (texto) {
                    pontosIdiomas += parseInt(texto) || 0;
                }
            });
            
            dados.idiomas = pontosIdiomas;
            
            // 3. Atributos Complementares
            let pontosAtributos = 0;
            const atributosConfig = {
                vontade: 5,
                percepcao: 5,
                pv: 2,
                pf: 3,
                velocidade: 5,
                deslocamento: 5
            };
            
            Object.keys(atributosConfig).forEach(atributo => {
                const input = document.getElementById(`${atributo}Mod`);
                if (input) {
                    const valor = parseInt(input.value) || 0;
                    pontosAtributos += valor * atributosConfig[atributo];
                }
            });
            
            dados.atributosComplementares = pontosAtributos;
            
        } catch (error) {
            console.warn('⚠️ Erro ao coletar dados das vantagens:', error);
        }
        
        return dados;
    }
    
    // ===========================================
    // CÁLCULOS E ATUALIZAÇÕES
    // ===========================================
    
    calcularTotais() {
        // Usar cache para performance
        const agora = Date.now();
        if (this.cache.totaisCalculados && agora - this.cache.ultimaAtualizacao < 500) {
            return this.cache.totaisCalculados;
        }
        
        // Calcular vantagens totais
        let totalVantagens = 0;
        Object.values(this.gastos.vantagens).forEach(valor => {
            totalVantagens += Math.max(0, valor || 0);
        });
        
        // Adicionar atributos positivos
        totalVantagens += Math.max(0, this.gastos.atributos);
        
        // Adicionar perícias, técnicas, magia e equipamentos
        totalVantagens += Math.max(0, this.gastos.pericias || 0);
        totalVantagens += Math.max(0, this.gastos.tecnicas || 0);
        totalVantagens += Math.max(0, this.gastos.magia || 0);
        totalVantagens += Math.max(0, this.gastos.equipamentos || 0);
        
        // Calcular desvantagens totais
        let totalDesvantagens = 0;
        Object.values(this.gastos.desvantagens).forEach(valor => {
            totalDesvantagens += Math.abs(valor || 0);
        });
        
        // Adicionar atributos negativos
        totalDesvantagens += Math.abs(Math.min(0, this.gastos.atributos));
        
        // Adicionar peculiaridades
        const totalPeculiaridades = Math.abs(this.gastos.peculiaridades || 0);
        totalDesvantagens += totalPeculiaridades;
        
        const totais = {
            vantagens: totalVantagens,
            desvantagens: totalDesvantagens,
            peculiaridades: totalPeculiaridades,
            atributos: this.gastos.atributos,
            disponiveis: 0 // Será calculado depois
        };
        
        // Atualizar cache
        this.cache.totaisCalculados = totais;
        this.cache.ultimaAtualizacao = agora;
        
        return totais;
    }
    
    atualizarCardsPontos() {
        const totais = this.calcularTotais();
        
        // Atualizar cada card individualmente
        const cards = {
            atributos: {
                elemento: 'pontosAtributos',
                valor: totais.atributos,
                positivo: totais.atributos > 0,
                negativo: totais.atributos < 0
            },
            vantagens: {
                elemento: 'pontosVantagens',
                valor: totais.vantagens,
                positivo: true,
                negativo: false
            },
            desvantagens: {
                elemento: 'pontosDesvantagens',
                valor: totais.desvantagens,
                positivo: false,
                negativo: true
            },
            peculiaridades: {
                elemento: 'pontosPeculiaridades',
                valor: totais.peculiaridades,
                positivo: false,
                negativo: true
            },
            pericias: {
                elemento: 'pontosPericias',
                valor: this.gastos.pericias || 0,
                positivo: true,
                negativo: false
            },
            tecnicas: {
                elemento: 'pontosTecnicas',
                valor: this.gastos.tecnicas || 0,
                positivo: true,
                negativo: false
            },
            magia: {
                elemento: 'pontosMagia',
                valor: this.gastos.magia || 0,
                positivo: true,
                negativo: false
            }
        };
        
        Object.keys(cards).forEach(tipo => {
            const config = cards[tipo];
            const elemento = document.getElementById(config.elemento);
            
            if (elemento) {
                // Formatar valor
                if (tipo === 'atributos') {
                    elemento.textContent = config.valor >= 0 ? `+${config.valor}` : config.valor.toString();
                } else {
                    elemento.textContent = config.valor.toString();
                }
                
                // Aplicar classes CSS
                const card = elemento.closest('.category');
                if (card) {
                    card.classList.remove('positivo', 'negativo');
                    
                    if (config.positivo && config.valor > 0) {
                        card.classList.add('positivo');
                    } else if (config.negativo && config.valor > 0) {
                        card.classList.add('negativo');
                    }
                }
            }
        });
    }
    
    atualizarLimites() {
        const totais = this.calcularTotais();
        
        // Barra de progresso - Desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const limite = this.limites.desvantagens;
            const percentual = Math.min(100, (totais.desvantagens / limite) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${totais.desvantagens}/${limite} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            // Colorir conforme limite
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c'; // Vermelho
                textDesv.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12'; // Laranja
                textDesv.style.color = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db'; // Azul
                textDesv.style.color = 'var(--text-light)';
            }
        }
        
        // Barra de progresso - Peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const limite = this.limites.peculiaridades;
            const percentual = Math.min(100, (totais.peculiaridades / limite) * 100);
            
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${totais.peculiaridades}/${limite} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            // Colorir conforme limite
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
                textPec.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
                textPec.style.color = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
                textPec.style.color = 'var(--text-light)';
            }
        }
    }
    
    atualizarPontosDisponiveis() {
        const totais = this.calcularTotais();
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        const pontosDisponiveis = totalPontos - totais.vantagens + totais.desvantagens;
        
        // Atualizar elemento de pontos disponíveis
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = pontosDisponiveis;
            
            // Colorir conforme situação
            if (pontosDisponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c'; // Vermelho - pontos negativos
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (pontosDisponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12'; // Laranja - poucos pontos
                elementoDisponiveis.style.fontWeight = 'bold';
            } else {
                elementoDisponiveis.style.color = '#27ae60'; // Verde - pontos suficientes
                elementoDisponiveis.style.fontWeight = 'normal';
            }
        }
        
        // Atualizar total gastos
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = totais.vantagens;
        }
        
        return pontosDisponiveis;
    }
    
    atualizarPercentuais() {
        const totais = this.calcularTotais();
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos === 0) return;
        
        const calcularPercentual = (valor) => {
            return Math.round((Math.abs(valor) / totalPontos) * 100);
        };
        
        // Atualizar cada percentual
        const percentuais = {
            percAtributos: calcularPercentual(totais.atributos),
            percVantagens: calcularPercentual(totais.vantagens),
            percDesvantagens: calcularPercentual(totais.desvantagens),
            percPeculiaridades: calcularPercentual(totais.peculiaridades),
            percPericias: calcularPercentual(this.gastos.pericias || 0),
            percTecnicas: calcularPercentual(this.gastos.tecnicas || 0),
            percMagia: calcularPercentual(this.gastos.magia || 0)
        };
        
        Object.keys(percentuais).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = `${percentuais[id]}%`;
            }
        });
    }
    
    atualizarTudo() {
        console.log('🔄 Atualizando sistema completo de pontos...');
        
        // Limpar cache
        this.cache.totaisCalculados = null;
        
        // Executar todas as atualizações
        this.atualizarCardsPontos();
        this.atualizarLimites();
        this.atualizarPontosDisponiveis();
        this.atualizarPercentuais();
        
        console.log('✅ Sistema de pontos atualizado!');
    }
    
    // ===========================================
    // PERSISTÊNCIA (LocalStorage)
    // ===========================================
    
    salvarLocalStorage() {
        try {
            const dados = {
                pontosIniciais: this.pontosIniciais,
                pontosGanhosCampanha: this.pontosGanhosCampanha,
                gastos: this.gastos,
                limites: this.limites,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('gurps_pontos_manager', JSON.stringify(dados));
            console.log('💾 Dados salvos no localStorage');
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar os dados:', error);
        }
    }
    
    carregarLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_pontos_manager');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                // Carregar dados básicos
                if (dados.pontosIniciais !== undefined) {
                    this.pontosIniciais = dados.pontosIniciais;
                    const input = document.getElementById('pontosIniciais');
                    if (input) input.value = this.pontosIniciais;
                }
                
                if (dados.pontosGanhosCampanha !== undefined) {
                    this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
                    const input = document.getElementById('pontosGanhos');
                    if (input) input.value = this.pontosGanhosCampanha;
                }
                
                // Carregar gastos
                if (dados.gastos) {
                    // Atributos
                    if (dados.gastos.atributos !== undefined) {
                        this.gastos.atributos = dados.gastos.atributos;
                    }
                    
                    // Vantagens
                    if (dados.gastos.vantagens) {
                        Object.keys(dados.gastos.vantagens).forEach(key => {
                            if (this.gastos.vantagens[key] !== undefined) {
                                this.gastos.vantagens[key] = dados.gastos.vantagens[key];
                            }
                        });
                    }
                    
                    // Desvantagens
                    if (dados.gastos.desvantagens) {
                        Object.keys(dados.gastos.desvantagens).forEach(key => {
                            if (this.gastos.desvantagens[key] !== undefined) {
                                this.gastos.desvantagens[key] = dados.gastos.desvantagens[key];
                            }
                        });
                    }
                    
                    // Outros
                    if (dados.gastos.peculiaridades !== undefined) {
                        this.gastos.peculiaridades = dados.gastos.peculiaridades;
                    }
                    
                    if (dados.gastos.pericias !== undefined) {
                        this.gastos.pericias = dados.gastos.pericias;
                    }
                    
                    if (dados.gastos.tecnicas !== undefined) {
                        this.gastos.tecnicas = dados.gastos.tecnicas;
                    }
                    
                    if (dados.gastos.magia !== undefined) {
                        this.gastos.magia = dados.gastos.magia;
                    }
                }
                
                // Carregar limites
                if (dados.limites) {
                    if (dados.limites.desvantagens !== undefined) {
                        this.limites.desvantagens = dados.limites.desvantagens;
                        const input = document.getElementById('limiteDesvantagens');
                        if (input) input.value = this.limites.desvantagens;
                    }
                    
                    if (dados.limites.peculiaridades !== undefined) {
                        this.limites.peculiaridades = dados.limites.peculiaridades;
                        const input = document.getElementById('limitePeculiaridades');
                        if (input) input.value = this.limites.peculiaridades;
                    }
                }
                
                console.log('📂 Dados carregados do localStorage');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar dados:', error);
        }
        return false;
    }
    
    // ===========================================
    // MÉTODOS PÚBLICOS PARA OUTROS MÓDULOS
    // ===========================================
    
    obterPontosVantagens() {
        const totais = this.calcularTotais();
        return totais.vantagens;
    }
    
    obterPontosDesvantagens() {
        const totais = this.calcularTotais();
        return totais.desvantagens;
    }
    
    obterPontosPeculiaridades() {
        return Math.abs(this.gastos.peculiaridades || 0);
    }
    
    obterPontosDisponiveis() {
        const totais = this.calcularTotais();
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        return totalPontos - totais.vantagens + totais.desvantagens;
    }
    
    // Método para resetar tudo
    resetar() {
        if (confirm('Tem certeza que deseja resetar todos os pontos? Isso não pode ser desfeito.')) {
            this.gastos = {
                atributos: 0,
                vantagens: {
                    aparência: 0,
                    atributosComplementares: 0,
                    idiomas: 0,
                    riqueza: 0,
                    statusSocial: 0,
                    carisma: 0,
                    reputaçãoPositiva: 0,
                    aliados: 0,
                    contatos: 0,
                    patronos: 0,
                    catálogo: 0,
                    outras: 0
                },
                desvantagens: {
                    aparência: 0,
                    riqueza: 0,
                    característicasFísicas: 0,
                    statusSocial: 0,
                    reputaçãoNegativa: 0,
                    inimigos: 0,
                    dependentes: 0,
                    catálogo: 0,
                    outras: 0
                },
                peculiaridades: 0,
                pericias: 0,
                tecnicas: 0,
                magia: 0,
                equipamentos: 0
            };
            
            this.salvarLocalStorage();
            this.atualizarTudo();
            alert('Todos os pontos foram resetados!');
        }
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let pontosManagerInstance = null;

function inicializarPontosManager() {
    if (!pontosManagerInstance) {
        pontosManagerInstance = new PontosManager();
        console.log('🎮 PontosManager inicializado globalmente!');
    }
    return pontosManagerInstance;
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Carregado - Verificando sistema de pontos...');
    
    // Verificar se estamos na aba com o sistema de pontos
    if (document.getElementById('pontosIniciais')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 300);
    }
    
    // Observar quando a aba Principal for carregada
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const tab = mutation.target;
                if (tab.id === 'principal' && tab.classList.contains('active')) {
                    console.log('🏠 Aba Principal ativada - Inicializando pontos...');
                    setTimeout(() => {
                        if (!pontosManagerInstance && document.getElementById('pontosIniciais')) {
                            inicializarPontosManager();
                        }
                    }, 200);
                }
            }
        });
    });
    
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal) {
        observer.observe(tabPrincipal, { attributes: true });
    }
});

// Forçar inicialização em caso de necessidade
window.addEventListener('load', function() {
    console.log('🚀 Página totalmente carregada - Verificando pontos...');
    
    setTimeout(() => {
        if (!pontosManagerInstance && document.getElementById('pontosIniciais')) {
            console.log('⚡ Inicialização tardia do PontosManager');
            inicializarPontosManager();
        }
    }, 1000);
});

// Exportar para uso global
window.PontosManager = PontosManager;
window.inicializarPontosManager = inicializarPontosManager;
window.obterPontosManager = function() {
    return pontosManagerInstance;
};

// Adicionar atalho global
window.pontosManager = function() {
    return pontosManagerInstance;
};