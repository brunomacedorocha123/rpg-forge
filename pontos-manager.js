// pontos-manager.js - VERSÃO CORRIGIDA COM CUSTOS GURPS
class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhos = 0;
        
        // VALORES ATUAIS DOS GASTOS
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0
        };
        
        // Inicializar
        this.init();
    }
    
    init() {
        // 1. Configurar inputs
        this.setupInputs();
        
        // 2. Configurar listeners
        this.setupListeners();
        
        // 3. Primeira atualização
        setTimeout(() => this.updateAll(), 300);
    }
    
    setupInputs() {
        // Pontos Iniciais
        const pontosIniciaisInput = document.getElementById('pontosIniciais');
        if (pontosIniciaisInput) {
            pontosIniciaisInput.value = this.pontosIniciais;
            pontosIniciaisInput.addEventListener('input', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.updateAll();
            });
        }
        
        // Pontos Ganhos
        const pontosGanhosInput = document.getElementById('pontosGanhos');
        if (pontosGanhosInput) {
            pontosGanhosInput.value = this.pontosGanhos;
            pontosGanhosInput.addEventListener('input', (e) => {
                this.pontosGanhos = parseInt(e.target.value) || 0;
                this.updateAll();
            });
        }
    }
    
    setupListeners() {
        // ============== OUVINTES DE ATRIBUTOS ==============
        // Observar inputs de atributos
        const atributoInputs = ['ST', 'DX', 'IQ', 'HT'];
        atributoInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => this.calculateAttributes());
            }
        });
        
        // Observar botões de atributos
        document.querySelectorAll('.btn-attr').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.calculateAttributes(), 100);
            });
        });
        
        // ============== OUVINTES DE RIQUEZA ==============
        const riquezaSelect = document.getElementById('nivelRiqueza');
        if (riquezaSelect) {
            riquezaSelect.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.updateRiqueza(valor);
            });
            // Verificar valor inicial
            setTimeout(() => {
                const valorInicial = parseInt(riquezaSelect.value) || 0;
                this.updateRiqueza(valorInicial);
            }, 500);
        }
        
        // ============== OUVINTES DE CARACTERÍSTICAS FÍSICAS ==============
        // Observar modal de altura/peso
        const customizeBtn = document.getElementById('customizeBtn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                setTimeout(() => this.setupCaracteristicasFisicasListeners(), 1000);
            });
        }
        
        // Observar mudanças em características físicas
        this.setupCaracteristicasFisicasListeners();
        
        // ============== OUVINTES DE APARÊNCIA ==============
        const aparenciaSelect = document.getElementById('nivelAparencia');
        if (aparenciaSelect) {
            aparenciaSelect.addEventListener('change', (e) => {
                const valor = parseInt(e.target.value) || 0;
                this.updateAparencia(valor);
            });
        }
        
        // ============== OUVINTES DE ATRIBUTOS COMPLEMENTARES ==============
        document.querySelectorAll('.btn-atributo').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.calculateAtributosComplementares(), 200);
            });
        });
        
        // ============== OUVINTES DE PECULIARIDADES ==============
        const btnPecAdicionar = document.getElementById('pec-adicionar-btn');
        if (btnPecAdicionar) {
            btnPecAdicionar.addEventListener('click', () => {
                setTimeout(() => this.calculatePeculiaridades(), 200);
            });
        }
        
        // ============== POLLING PARA GARANTIR ==============
        setInterval(() => {
            this.forceRecalculate();
        }, 2000);
    }
    
    setupCaracteristicasFisicasListeners() {
        // Observar botões de características físicas no modal
        const modal = document.getElementById('alturaPesoModal');
        if (modal) {
            // Botões de características (magro, gordo, etc.)
            modal.querySelectorAll('.feature-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    setTimeout(() => this.calculateCaracteristicasFisicas(), 300);
                });
            });
            
            // Botões apply/cancel do modal
            const applyBtn = modal.querySelector('#applyBtn');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    setTimeout(() => this.calculateCaracteristicasFisicas(), 500);
                });
            }
        }
        
        // Observar inputs de altura e peso principais
        const alturaInput = document.getElementById('altura');
        const pesoInput = document.getElementById('peso');
        
        if (alturaInput) alturaInput.addEventListener('change', () => this.calculateCaracteristicasFisicas());
        if (pesoInput) pesoInput.addEventListener('change', () => this.calculateCaracteristicasFisicas());
    }
    
    calculateAttributes() {
        // Calcular custo dos atributos COM VALORES GURPS CORRETOS
        let totalAtributos = 0;
        
        // PEGAR VALORES
        const ST = parseInt(document.getElementById('ST')?.value) || 10;
        const DX = parseInt(document.getElementById('DX')?.value) || 10;
        const IQ = parseInt(document.getElementById('IQ')?.value) || 10;
        const HT = parseInt(document.getElementById('HT')?.value) || 10;
        
        // CUSTOS GURPS:
        // ST: 10 pontos por nível
        // DX: 20 pontos por nível (CARO!)
        // IQ: 20 pontos por nível (CARO!)
        // HT: 10 pontos por nível
        
        totalAtributos += (ST - 10) * 10;  // ST: 10 pts/nível
        totalAtributos += (DX - 10) * 20;  // DX: 20 pts/nível
        totalAtributos += (IQ - 10) * 20;  // IQ: 20 pts/nível
        totalAtributos += (HT - 10) * 10;  // HT: 10 pts/nível
        
        this.gastos.atributos = totalAtributos;
        this.updateAll();
        
        return totalAtributos;
    }
    
    updateRiqueza(valor) {
        // Riqueza: valor positivo = vantagem, negativo = desvantagem
        if (valor >= 0) {
            // É vantagem (Rico, Muito Rico, etc.)
            this.gastos.vantagens = (this.gastos.vantagens || 0) + valor;
        } else {
            // É desvantagem (Pobre, Miserável, etc.)
            this.gastos.desvantagens = (this.gastos.desvantagens || 0) + Math.abs(valor);
        }
        this.updateAll();
    }
    
    calculateCaracteristicasFisicas() {
        let pontos = 0;
        
        // Verificar características selecionadas no modal
        const modal = document.getElementById('alturaPesoModal');
        if (modal && modal.style.display === 'block') {
            // Verificar botões ativos
            const activeFeatures = modal.querySelectorAll('.feature-btn.active');
            activeFeatures.forEach(btn => {
                const tipo = btn.dataset.type;
                const custo = this.getCustoCaracteristica(tipo);
                pontos += custo;
            });
        }
        
        // Verificar se altura/peso estão fora do normal
        const altura = parseFloat(document.getElementById('altura')?.value) || 1.70;
        const peso = parseFloat(document.getElementById('peso')?.value) || 70;
        
        // Adicionar pontos por características físicas extremas
        if (altura < 1.50 || altura > 2.00) {
            pontos -= 5; // Altura fora do normal
        }
        
        if (peso < 50 || peso > 100) {
            pontos -= 3; // Peso fora do normal
        }
        
        // Atualizar desvantagens
        if (pontos < 0) {
            this.gastos.desvantagens = Math.abs(pontos);
        }
        
        this.updateAll();
        return pontos;
    }
    
    getCustoCaracteristica(tipo) {
        const custos = {
            'magro': -5,
            'acima-peso': -1,
            'gordo': -3,
            'muito-gordo': -5,
            'nanismo': -15,
            'gigantismo': 0  // Gigantismo geralmente não dá pontos
        };
        return custos[tipo] || 0;
    }
    
    updateAparencia(valor) {
        // Aparência: positivo = vantagem, negativo = desvantagem
        if (valor >= 0) {
            this.gastos.vantagens = (this.gastos.vantagens || 0) + valor;
        } else {
            this.gastos.desvantagens = (this.gastos.desvantagens || 0) + Math.abs(valor);
        }
        this.updateAll();
    }
    
    calculateAtributosComplementares() {
        let pontosVontade = 0;
        let pontosPercepcao = 0;
        
        // Vontade: 5 pontos por nível (baseado em IQ)
        const vontadeMod = parseInt(document.getElementById('vontadeMod')?.value) || 0;
        pontosVontade = vontadeMod * 5;
        
        // Percepção: 5 pontos por nível (baseado em IQ)
        const percepcaoMod = parseInt(document.getElementById('percepcaoMod')?.value) || 0;
        pontosPercepcao = percepcaoMod * 5;
        
        // Pontos de Vida: 2 pontos por nível
        const pvMod = parseInt(document.getElementById('pvMod')?.value) || 0;
        const pontosPV = pvMod * 2;
        
        // Pontos de Fadiga: 3 pontos por nível
        const pfMod = parseInt(document.getElementById('pfMod')?.value) || 0;
        const pontosPF = pfMod * 3;
        
        // Velocidade: 5 pontos por 0.25
        const velocidadeMod = parseInt(document.getElementById('velocidadeMod')?.value) || 0;
        const pontosVelocidade = velocidadeMod * 20; // 20 pontos por 1.0
        
        // Deslocamento: 5 pontos por nível
        const deslocamentoMod = parseInt(document.getElementById('deslocamentoMod')?.value) || 0;
        const pontosDeslocamento = deslocamentoMod * 5;
        
        // Total de vantagens dos atributos complementares
        const totalVantagens = Math.max(0, pontosVontade + pontosPercepcao + pontosPV + pontosPF + pontosVelocidade + pontosDeslocamento);
        const totalDesvantagens = Math.abs(Math.min(0, pontosVontade + pontosPercepcao + pontosPV + pontosPF + pontosVelocidade + pontosDeslocamento));
        
        this.gastos.vantagens = (this.gastos.vantagens || 0) + totalVantagens;
        this.gastos.desvantagens = (this.gastos.desvantagens || 0) + totalDesvantagens;
        
        this.updateAll();
    }
    
    calculatePeculiaridades() {
        // Contar peculiaridades na lista
        const listaPec = document.getElementById('pec-lista');
        let totalPeculiaridades = 0;
        
        if (listaPec) {
            const itensPec = listaPec.querySelectorAll('.pec-item');
            totalPeculiaridades = itensPec.length * -1; // Cada peculiaridade custa -1 ponto
        }
        
        this.gastos.peculiaridades = Math.abs(totalPeculiaridades);
        this.updateAll();
    }
    
    forceRecalculate() {
        // Recalcular tudo periodicamente
        this.calculateAttributes();
        
        // Verificar riqueza
        const riquezaSelect = document.getElementById('nivelRiqueza');
        if (riquezaSelect) {
            const valor = parseInt(riquezaSelect.value) || 0;
            this.updateRiqueza(valor);
        }
        
        // Verificar aparência
        const aparenciaSelect = document.getElementById('nivelAparencia');
        if (aparenciaSelect) {
            const valor = parseInt(aparenciaSelect.value) || 0;
            this.updateAparencia(valor);
        }
    }
    
    calculateAvailablePoints() {
        const totalBase = this.pontosIniciais + this.pontosGanhos;
        
        // GASTOS (custam pontos)
        const gastos = 
            Math.max(0, this.gastos.atributos) +  // Só atributos positivos
            (this.gastos.vantagens || 0) +
            (this.gastos.pericias || 0) +
            (this.gastos.tecnicas || 0) +
            (this.gastos.magia || 0);
        
        // GANHOS (dão pontos)
        const ganhos = 
            Math.abs(Math.min(0, this.gastos.atributos)) +  // Atributos negativos
            (this.gastos.desvantagens || 0) +
            (this.gastos.peculiaridades || 0);
        
        const disponiveis = totalBase - gastos + ganhos;
        
        return {
            total: totalBase,
            gastos: gastos,
            ganhos: ganhos,
            disponiveis: disponiveis
        };
    }
    
    updateAll() {
        const calculo = this.calculateAvailablePoints();
        
        // 1. Atualizar PONTOS DISPONÍVEIS
        const dispEl = document.getElementById('pontosDisponiveis');
        if (dispEl) {
            dispEl.textContent = calculo.disponiveis;
            // Colorir
            if (calculo.disponiveis < 0) {
                dispEl.style.color = '#e74c3c';
            } else if (calculo.disponiveis < 10) {
                dispEl.style.color = '#f39c12';
            } else {
                dispEl.style.color = '#27ae60';
            }
        }
        
        // 2. Atualizar CARD DE ATRIBUTOS
        const cardAtributos = document.getElementById('pontosAtributos');
        if (cardAtributos) {
            const valor = this.gastos.atributos;
            cardAtributos.textContent = valor > 0 ? `+${valor}` : `${valor}`;
            
            // Colorir card
            const cardDiv = cardAtributos.closest('.category');
            if (cardDiv) {
                cardDiv.classList.remove('positivo', 'negativo', 'zero');
                if (valor > 0) {
                    cardDiv.classList.add('positivo');
                } else if (valor < 0) {
                    cardDiv.classList.add('negativo');
                } else {
                    cardDiv.classList.add('zero');
                }
            }
        }
        
        // 3. Atualizar OUTROS CARDS
        this.updateCard('vantagens', this.gastos.vantagens);
        this.updateCard('desvantagens', this.gastos.desvantagens);
        this.updateCard('peculiaridades', this.gastos.peculiaridades);
        
        // 4. Atualizar PONTOS GASTOS (total)
        const pontosGastosEl = document.getElementById('pontosGastos');
        if (pontosGastosEl) {
            pontosGastosEl.textContent = calculo.gastos;
        }
        
        // 5. Atualizar percentuais
        this.updatePercentages(calculo.total);
        
        // 6. Atualizar limites
        this.updateLimits();
    }
    
    updateCard(tipo, valor) {
        const elementId = `pontos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const elemento = document.getElementById(elementId);
        if (!elemento) return;
        
        elemento.textContent = Math.abs(valor || 0);
        
        // Estilizar card
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo', 'zero');
            
            const valorNum = valor || 0;
            if (valorNum > 0) {
                if (tipo === 'desvantagens' || tipo === 'peculiaridades') {
                    card.classList.add('negativo');
                } else {
                    card.classList.add('positivo');
                }
            } else if (valorNum === 0) {
                card.classList.add('zero');
            }
        }
    }
    
    updatePercentages(totalBase) {
        if (totalBase <= 0) return;
        
        const categorias = ['atributos', 'vantagens', 'desvantagens', 'peculiaridades', 'pericias', 'tecnicas', 'magia'];
        
        categorias.forEach(cat => {
            const valor = this.gastos[cat] || 0;
            const percentEl = document.getElementById(`perc${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
            
            if (percentEl) {
                const percentual = Math.round((Math.abs(valor) / totalBase) * 100);
                percentEl.textContent = `${percentual}%`;
                
                // Colorir
                if (percentual > 30) {
                    percentEl.style.color = '#e74c3c';
                    percentEl.style.fontWeight = 'bold';
                } else if (percentual > 15) {
                    percentEl.style.color = '#f39c12';
                } else {
                    percentEl.style.color = '#7f8c8d';
                }
            }
        });
    }
    
    updateLimits() {
        // Limite desvantagens
        const progressDesv = document.getElementById('progressDesvantagens');
        const textDesv = document.getElementById('textDesvantagens');
        const percentDesv = document.getElementById('percentDesvantagens');
        
        if (progressDesv && textDesv && percentDesv) {
            const limiteDesv = parseInt(document.getElementById('limiteDesvantagens')?.value) || 40;
            const desvAtual = this.gastos.desvantagens || 0;
            const percentual = Math.min(100, (desvAtual / limiteDesv) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvAtual}/${limiteDesv} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            // Colorir
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
            }
        }
        
        // Limite peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const limitePec = parseInt(document.getElementById('limitePeculiaridades')?.value) || 20;
            const pecAtual = this.gastos.peculiaridades || 0;
            const percentual = Math.min(100, (pecAtual / limitePec) * 100);
            
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${pecAtual}/${limitePec} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            // Colorir
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
            }
        }
    }
    
    // Métodos públicos
    setAtributos(pontos) {
        this.gastos.atributos = pontos;
        this.updateAll();
    }
    
    setVantagens(pontos) {
        this.gastos.vantagens = pontos;
        this.updateAll();
    }
    
    setDesvantagens(pontos) {
        this.gastos.desvantagens = Math.abs(pontos);
        this.updateAll();
    }
    
    setPeculiaridades(pontos) {
        this.gastos.peculiaridades = Math.abs(pontos);
        this.updateAll();
    }
    
    getSummary() {
        return this.calculateAvailablePoints();
    }
    
    reset() {
        this.pontosIniciais = 150;
        this.pontosGanhos = 0;
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0
        };
        
        // Reset inputs
        const pontosIniciaisInput = document.getElementById('pontosIniciais');
        if (pontosIniciaisInput) pontosIniciaisInput.value = 150;
        
        const pontosGanhosInput = document.getElementById('pontosGanhos');
        if (pontosGanhosInput) pontosGanhosInput.value = 0;
        
        this.updateAll();
    }
}

// Instância global
let pontosManager = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    pontosManager = new PontosManager();
    window.pontosManager = pontosManager;
});

// Exportar
window.PontosManager = PontosManager;
window.getPontosManager = () => pontosManager;
window.resetarPontos = () => {
    if (pontosManager) pontosManager.reset();
};