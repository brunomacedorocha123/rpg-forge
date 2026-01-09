// ===========================================
// PONTOS-MANAGER.JS - CORRIGIDO FINAL
// ===========================================

class PontosManager {
    constructor() {
        this.pontosIniciais = 150;
        this.pontosGanhosCampanha = 0;
        
        this.gastos = {
            atributos: 0,
            vantagens: 0,
            desvantagens: 0,
            peculiaridades: 0,
            pericias: 0,
            tecnicas: 0,
            magia: 0,
            equipamentos: 0
        };
        
        // CONTROLE ESPECÍFICO
        this.controle = {
            caracteristicasFisicas: 0,  // Só desvantagens negativas
            riqueza: 0,                 // Pode ser positivo (vantagem) ou negativo (desvantagem)
            riquezaTipo: 'neutro'       // 'vantagem', 'desvantagem', 'neutro'
        };
        
        this.limites = {
            desvantagens: 40,
            peculiaridades: 20
        };
        
        this.inicializado = false;
        this.inicializar();
    }
    
    inicializar() {
        if (this.inicializado) return;
        
        this.configurarInputs();
        this.carregarDados();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
        console.log('✅ Pontos Manager CORRIGIDO!');
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvar();
            });
        }
        
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.verificarLimites();
                this.salvar();
            });
        }
    }
    
    configurarEventos() {
        // 1. ATRIBUTOS - CORRIGIDO
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = e.detail.pontosGastos;
                this.gastos.atributos = pontos;
                this.atualizarDisplay('atributos');
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
                console.log('💪 Atributos atualizados:', pontos, 'pts');
            }
        });
        
        // 2. CARACTERÍSTICAS FÍSICAS - JÁ FUNCIONA
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail?.pontosGastos !== undefined) {
                const pontos = e.detail.pontosGastos; // Já vem negativo
                this.controle.caracteristicasFisicas = Math.abs(pontos); // Converte para positivo para soma
                this.calcularDesvantagens();
                this.salvar();
                console.log('🏃 Caract. físicas:', pontos, 'pts');
            }
        });
        
        // 3. RIQUEZA - CORREÇÃO PRINCIPAL
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail?.pontos !== undefined) {
                const pontos = parseInt(e.detail.pontos);
                console.log('💰 Riqueza mudou:', pontos, 'pts');
                
                // Remove a riqueza anterior ANTES de adicionar a nova
                this.removerRiquezaAnterior();
                
                // Adiciona a nova riqueza
                this.controle.riqueza = Math.abs(pontos);
                this.controle.riquezaTipo = pontos < 0 ? 'desvantagem' : pontos > 0 ? 'vantagem' : 'neutro';
                
                // Atualiza os cálculos
                this.calcularDesvantagens();
                this.atualizarVantagens();
                this.atualizarTotais();
                this.verificarLimites();
                this.salvar();
            }
        });
    }
    
    removerRiquezaAnterior() {
        // Remove riqueza anterior dos cálculos
        if (this.controle.riquezaTipo === 'desvantagem') {
            // Já será removida no recálculo
        } else if (this.controle.riquezaTipo === 'vantagem') {
            // Remove vantagem anterior
            this.gastos.vantagens = Math.max(0, this.gastos.vantagens - this.controle.riqueza);
        }
        // Reseta controle
        this.controle.riqueza = 0;
        this.controle.riquezaTipo = 'neutro';
    }
    
    calcularDesvantagens() {
        let totalDesvantagens = 0;
        
        // 1. Características físicas (sempre desvantagem)
        totalDesvantagens += this.controle.caracteristicasFisicas;
        
        // 2. Riqueza (só se for desvantagem)
        if (this.controle.riquezaTipo === 'desvantagem') {
            totalDesvantagens += this.controle.riqueza;
        }
        
        // 3. Atributos negativos (se houver)
        if (this.gastos.atributos < 0) {
            totalDesvantagens += Math.abs(this.gastos.atributos);
        }
        
        this.gastos.desvantagens = totalDesvantagens;
        this.atualizarDisplay('desvantagens');
        console.log('➕ Desvantagens totais:', totalDesvantagens, 'pts');
    }
    
    atualizarVantagens() {
        let totalVantagens = 0;
        
        // 1. Atributos positivos
        if (this.gastos.atributos > 0) {
            totalVantagens += this.gastos.atributos;
        }
        
        // 2. Riqueza positiva
        if (this.controle.riquezaTipo === 'vantagem') {
            totalVantagens += this.controle.riqueza;
        }
        
        this.gastos.vantagens = totalVantagens;
        this.atualizarDisplay('vantagens');
        console.log('➕ Vantagens totais:', totalVantagens, 'pts');
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        // VANTAGENS (custa pontos)
        let vantagensTotal = 0;
        vantagensTotal += Math.max(0, this.gastos.atributos || 0);
        vantagensTotal += Math.max(0, this.gastos.vantagens || 0);
        vantagensTotal += Math.max(0, this.gastos.pericias || 0);
        vantagensTotal += Math.max(0, this.gastos.tecnicas || 0);
        vantagensTotal += Math.max(0, this.gastos.magia || 0);
        vantagensTotal += Math.max(0, this.gastos.equipamentos || 0);
        
        // DESVANTAGENS (dá pontos)
        let desvantagensTotal = 0;
        desvantagensTotal += Math.abs(Math.min(0, this.gastos.atributos || 0));
        desvantagensTotal += Math.abs(this.gastos.desvantagens || 0);
        desvantagensTotal += Math.abs(this.gastos.peculiaridades || 0);
        
        // Cálculo final
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis
        };
    }
    
    atualizarDisplay(aba) {
        const elemento = document.getElementById(`pontos${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba] || 0;
        elemento.textContent = pontos;
        
        // Atualiza porcentagem
        const elementoPercent = document.getElementById(`perc${aba.charAt(0).toUpperCase() + aba.slice(1)}`);
        if (elementoPercent) {
            const total = this.pontosIniciais + this.pontosGanhosCampanha;
            if (total > 0) {
                const percentual = (Math.abs(pontos) / total) * 100;
                elementoPercent.textContent = `${Math.round(percentual)}%`;
            }
        }
        
        // Estilo
        const pai = elemento.parentElement;
        pai.classList.remove('positivo', 'negativo');
        
        if (aba === 'desvantagens' || aba === 'peculiaridades') {
            if (pontos > 0) pai.classList.add('negativo');
        } else if (pontos > 0) {
            pai.classList.add('positivo');
        } else if (pontos < 0) {
            pai.classList.add('negativo');
        }
    }
    
    atualizarTudo() {
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplay(aba);
        });
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else if (calculo.disponiveis < 10) {
                elementoDisponiveis.style.color = '#f39c12';
            } else {
                elementoDisponiveis.style.color = '#27ae60';
            }
        }
        
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        const progress = document.getElementById('progressDesvantagens');
        const texto = document.getElementById('textDesvantagens');
        const percent = document.getElementById('percentDesvantagens');
        
        if (progress && texto && percent) {
            const percentual = Math.min(100, (calculo.desvantagens / this.limites.desvantagens) * 100);
            progress.style.width = `${percentual}%`;
            texto.textContent = `${calculo.desvantagens}/${this.limites.desvantagens} pts`;
            percent.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    salvar() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            controle: { ...this.controle },
            limites: { ...this.limites }
        };
        localStorage.setItem('pontos_corrigido_final', JSON.stringify(dados));
    }
    
    carregarDados() {
        try {
            const dados = localStorage.getItem('pontos_corrigido_final');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.aplicarDados(parsed);
            }
        } catch (e) {
            console.error('Erro carregar:', e);
        }
    }
    
    aplicarDados(dados) {
        if (dados.pontosIniciais) this.pontosIniciais = dados.pontosIniciais;
        if (dados.pontosGanhosCampanha) this.pontosGanhosCampanha = dados.pontosGanhosCampanha;
        if (dados.gastos) Object.assign(this.gastos, dados.gastos);
        if (dados.controle) Object.assign(this.controle, dados.controle);
        if (dados.limites) Object.assign(this.limites, dados.limites);
        
        this.atualizarTudo();
    }
}

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('pontosIniciais')) {
            inicializarPontosManager();
            console.log('🚀 Pontos Manager corrigido iniciado!');
        }
    }, 500);
});

// Teste manual
window.testarPontos = function() {
    if (!pontosManager) return;
    
    console.log('🧪 TESTE MANUAL:');
    console.log('1. Adicionando atributos +15...');
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: { pontosGastos: 15 }
    }));
    
    setTimeout(() => {
        console.log('2. Adicionando características físicas -5...');
        document.dispatchEvent(new CustomEvent('desvantagensAtualizadas', {
            detail: { pontosGastos: -5 }
        }));
        
        setTimeout(() => {
            console.log('3. Adicionando riqueza Batalhador -10...');
            document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                detail: { pontos: -10 }
            }));
            
            setTimeout(() => {
                console.log('4. Mudando para Rico +20...');
                document.dispatchEvent(new CustomEvent('riquezaAtualizada', {
                    detail: { pontos: 20 }
                }));
                
                setTimeout(() => {
                    console.log('📊 RESULTADO ESPERADO:');
                    console.log('- Atributos: +15 pts (vantagem)');
                    console.log('- Caract. físicas: 5 pts (desvantagem)');
                    console.log('- Riqueza: +20 pts (vantagem) → DEVE SUBSTITUIR o -10 anterior');
                    console.log('- Desvantagens: 5 pts (só características físicas)');
                    console.log('- Vantagens: 35 pts (15 + 20)');
                    console.log('- Disponível: 150 + 5 - 35 = 120 pts');
                }, 500);
            }, 500);
        }, 500);
    }, 500);
};