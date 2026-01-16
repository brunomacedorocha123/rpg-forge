// pontos-manager.js - VERSÃO DEFINITIVA
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
        console.log("🚀 PontosManager inicializado!");
        
        // 1. Configurar inputs
        this.setupInputs();
        
        // 2. Monitorar mudanças em tempo real
        this.setupObservers();
        
        // 3. Primeira atualização
        setTimeout(() => this.updateAll(), 200);
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
        
        // Limites
        const limiteDesvInput = document.getElementById('limiteDesvantagens');
        if (limiteDesvInput) {
            limiteDesvInput.addEventListener('input', (e) => {
                this.updateLimits();
            });
        }
        
        const limitePecInput = document.getElementById('limitePeculiaridades');
        if (limitePecInput) {
            limitePecInput.addEventListener('input', (e) => {
                this.updateLimits();
            });
        }
    }
    
    setupObservers() {
        // OBSERVAR MUDANÇAS NOS ATRIBUTOS
        const observer = new MutationObserver(() => {
            this.calculateAttributes();
        });
        
        // Observar inputs de atributos
        const atributoInputs = document.querySelectorAll('#ST, #DX, #IQ, #HT');
        atributoInputs.forEach(input => {
            observer.observe(input, { attributes: true, attributeFilter: ['value'] });
            input.addEventListener('change', () => this.calculateAttributes());
        });
        
        // Observar botões de atributos
        const attrButtons = document.querySelectorAll('.btn-attr');
        attrButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.calculateAttributes(), 100);
            });
        });
        
        // Observar mudanças em outras seções
        document.addEventListener('DOMContentLoaded', () => {
            // Verificar periodicamente
            setInterval(() => {
                this.checkForUpdates();
            }, 1000);
        });
    }
    
    calculateAttributes() {
        // Calcular custo dos atributos (10 pontos por nível acima de 10)
        let totalAtributos = 0;
        
        // PEGAR VALORES DIRETO DOS INPUTS
        const ST = parseInt(document.getElementById('ST')?.value) || 10;
        const DX = parseInt(document.getElementById('DX')?.value) || 10;
        const IQ = parseInt(document.getElementById('IQ')?.value) || 10;
        const HT = parseInt(document.getElementById('HT')?.value) || 10;
        
        // Calcular pontos gastos (cada ponto acima de 10 custa 10 pontos)
        totalAtributos += (ST - 10) * 10;
        totalAtributos += (DX - 10) * 10;
        totalAtributos += (IQ - 10) * 10;
        totalAtributos += (HT - 10) * 10;
        
        this.gastos.atributos = totalAtributos;
        console.log(`📊 Atributos calculados: ${totalAtributos} pontos (ST:${ST}, DX:${DX}, IQ:${IQ}, HT:${HT})`);
        
        // Disparar evento
        document.dispatchEvent(new CustomEvent('atributosCalculados', {
            detail: { pontos: totalAtributos }
        }));
        
        this.updateAll();
    }
    
    checkForUpdates() {
        // Verificar e calcular atributos novamente
        this.calculateAttributes();
        
        // Verificar outras fontes de pontos
        this.checkVantagens();
        this.checkDesvantagens();
    }
    
    checkVantagens() {
        // Exemplo: verificar aparência
        const aparenciaSelect = document.getElementById('nivelAparencia');
        if (aparenciaSelect) {
            const pontosAparencia = parseInt(aparenciaSelect.value) || 0;
            // Atualizar vantagens baseadas em aparência
        }
    }
    
    checkDesvantagens() {
        // Exemplo: verificar riqueza
        const riquezaSelect = document.getElementById('nivelRiqueza');
        if (riquezaSelect) {
            const pontosRiqueza = parseInt(riquezaSelect.value) || 0;
            if (pontosRiqueza < 0) {
                // É uma desvantagem (pobre, miserável, etc.)
                this.gastos.desvantagens = Math.abs(pontosRiqueza);
            }
        }
    }
    
    calculateAvailablePoints() {
        const totalBase = this.pontosIniciais + this.pontosGanhos;
        
        // GASTOS (custam pontos)
        const gastos = 
            Math.max(0, this.gastos.atributos) +  // Só atributos positivos
            this.gastos.vantagens +
            this.gastos.pericias +
            this.gastos.tecnicas +
            this.gastos.magia;
        
        // GANHOS (dão pontos)
        const ganhos = 
            Math.abs(Math.min(0, this.gastos.atributos)) +  // Atributos negativos
            this.gastos.desvantagens +
            this.gastos.peculiaridades;
        
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
        
        console.log("🔄 Atualizando displays:", calculo);
        
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
            cardAtributos.textContent = this.gastos.atributos > 0 ? 
                `+${this.gastos.atributos}` : 
                this.gastos.atributos;
            
            // Colorir card
            const atributosDiv = cardAtributos.closest('.category');
            if (atributosDiv) {
                if (this.gastos.atributos > 0) {
                    atributosDiv.classList.add('positivo');
                    atributosDiv.classList.remove('negativo', 'zero');
                } else if (this.gastos.atributos < 0) {
                    atributosDiv.classList.add('negativo');
                    atributosDiv.classList.remove('positivo', 'zero');
                } else {
                    atributosDiv.classList.add('zero');
                    atributosDiv.classList.remove('positivo', 'negativo');
                }
            }
        }
        
        // 3. Atualizar PONTOS GASTOS (total)
        const pontosGastosEl = document.getElementById('pontosGastos');
        if (pontosGastosEl) {
            pontosGastosEl.textContent = calculo.gastos;
        }
        
        // 4. Atualizar outros cards (se existirem)
        this.updateCard('vantagens', this.gastos.vantagens);
        this.updateCard('desvantagens', this.gastos.desvantagens);
        this.updateCard('peculiaridades', this.gastos.peculiaridades);
        
        // 5. Atualizar percentuais
        this.updatePercentages(calculo.total);
        
        // 6. Atualizar limites
        this.updateLimits();
    }
    
    updateCard(tipo, valor) {
        const elementId = `pontos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const elemento = document.getElementById(elementId);
        if (!elemento) return;
        
        elemento.textContent = Math.abs(valor);
        
        // Estilizar card
        const card = elemento.closest('.category');
        if (card) {
            card.classList.remove('positivo', 'negativo', 'zero');
            
            if (valor > 0) {
                if (tipo === 'desvantagens' || tipo === 'peculiaridades') {
                    card.classList.add('negativo');
                } else {
                    card.classList.add('positivo');
                }
            } else if (valor === 0) {
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
            const desvAtual = this.gastos.desvantagens;
            const percentual = Math.min(100, (desvAtual / limiteDesv) * 100);
            
            progressDesv.style.width = `${percentual}%`;
            textDesv.textContent = `${desvAtual}/${limiteDesv} pts`;
            percentDesv.textContent = `${Math.round(percentual)}%`;
            
            // Colorir
            if (percentual >= 100) {
                progressDesv.style.backgroundColor = '#e74c3c';
                textDesv.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressDesv.style.backgroundColor = '#f39c12';
                textDesv.style.color = '#f39c12';
            } else {
                progressDesv.style.backgroundColor = '#3498db';
                textDesv.style.color = '#3498db';
            }
        }
        
        // Limite peculiaridades
        const progressPec = document.getElementById('progressPeculiaridades');
        const textPec = document.getElementById('textPeculiaridades');
        const percentPec = document.getElementById('percentPeculiaridades');
        
        if (progressPec && textPec && percentPec) {
            const limitePec = parseInt(document.getElementById('limitePeculiaridades')?.value) || 20;
            const pecAtual = this.gastos.peculiaridades;
            const percentual = Math.min(100, (pecAtual / limitePec) * 100);
            
            progressPec.style.width = `${percentual}%`;
            textPec.textContent = `${pecAtual}/${limitePec} pts`;
            percentPec.textContent = `${Math.round(percentual)}%`;
            
            // Colorir
            if (percentual >= 100) {
                progressPec.style.backgroundColor = '#e74c3c';
                textPec.style.color = '#e74c3c';
            } else if (percentual >= 80) {
                progressPec.style.backgroundColor = '#f39c12';
                textPec.style.color = '#f39c12';
            } else {
                progressPec.style.backgroundColor = '#3498db';
                textPec.style.color = '#3498db';
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
    
    addVantagem(pontos) {
        this.gastos.vantagens += pontos;
        this.updateAll();
        return true;
    }
    
    addDesvantagem(pontos) {
        this.gastos.desvantagens += Math.abs(pontos);
        this.updateAll();
        return true;
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
    
    // Expor para debug
    window.pontosManager = pontosManager;
    
    // Teste rápido
    setTimeout(() => {
        pontosManager.updateAll();
    }, 1000);
});

// Exportar
window.PontosManager = PontosManager;
window.getPontosManager = () => pontosManager;