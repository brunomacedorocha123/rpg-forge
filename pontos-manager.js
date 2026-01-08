// ===========================================
// PONTOS-MANAGER.JS - COMPLETO E CORRIGIDO
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
            equipamentos: 0,
            riqueza: 0
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
        this.carregarDadosSalvos();
        this.configurarEventos();
        this.atualizarTudo();
        
        this.inicializado = true;
    }
    
    configurarInputs() {
        const inputPontosIniciais = document.getElementById('pontosIniciais');
        if (inputPontosIniciais) {
            inputPontosIniciais.value = this.pontosIniciais;
            inputPontosIniciais.addEventListener('change', (e) => {
                this.pontosIniciais = parseInt(e.target.value) || 150;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputPontosGanhos = document.getElementById('pontosGanhos');
        if (inputPontosGanhos) {
            inputPontosGanhos.value = this.pontosGanhosCampanha;
            inputPontosGanhos.addEventListener('change', (e) => {
                this.pontosGanhosCampanha = parseInt(e.target.value) || 0;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputLimiteDesvantagens = document.getElementById('limiteDesvantagens');
        if (inputLimiteDesvantagens) {
            inputLimiteDesvantagens.value = this.limites.desvantagens;
            inputLimiteDesvantagens.addEventListener('change', (e) => {
                this.limites.desvantagens = parseInt(e.target.value) || 40;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
        
        const inputLimitePeculiaridades = document.getElementById('limitePeculiaridades');
        if (inputLimitePeculiaridades) {
            inputLimitePeculiaridades.value = this.limites.peculiaridades;
            inputLimitePeculiaridades.addEventListener('change', (e) => {
                this.limites.peculiaridades = parseInt(e.target.value) || 20;
                this.atualizarTudo();
                this.salvarDados();
            });
        }
    }
    
    configurarEventos() {
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('atributos', e.detail.pontosGastos);
            }
        });
        
        document.addEventListener('vantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('vantagens', e.detail.pontosGastos);
            }
        });
        
        document.addEventListener('desvantagensAtualizadas', (e) => {
            if (e.detail && e.detail.pontosGastos !== undefined) {
                this.atualizarGastosAba('desvantagens', e.detail.pontosGastos);
            }
        });
        
        document.addEventListener('riquezaAtualizada', (e) => {
            if (e.detail && e.detail.pontos !== undefined) {
                this.atualizarGastosAba('riqueza', e.detail.pontos);
            }
        });
    }
    
    calcularPontosDisponiveis() {
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        const vantagensTotal = 
            Math.max(0, this.gastos.atributos) + 
            Math.max(0, this.gastos.vantagens) +
            Math.max(0, this.gastos.pericias) +
            Math.max(0, this.gastos.tecnicas) +
            Math.max(0, this.gastos.magia) +
            Math.max(0, this.gastos.equipamentos) +
            Math.max(0, this.gastos.riqueza);
        
        const desvantagensDesv = Math.abs(Math.min(0, this.gastos.desvantagens));
        const desvantagensPec = Math.abs(Math.min(0, this.gastos.peculiaridades));
        const desvantagensRiq = Math.abs(Math.min(0, this.gastos.riqueza));
        
        const desvantagensTotal = desvantagensDesv + desvantagensPec + desvantagensRiq;
        
        const pontosDisponiveis = totalPontos - vantagensTotal + desvantagensTotal;
        
        const totalDesvantagensAbs = desvantagensTotal;
        
        return {
            total: totalPontos,
            vantagens: vantagensTotal,
            desvantagens: desvantagensTotal,
            disponiveis: pontosDisponiveis,
            totalDesvantagensAbs: totalDesvantagensAbs,
            peculiaridadesAbs: desvantagensPec
        };
    }
    
    atualizarGastosAba(aba, pontos) {
        const pontosAnteriores = this.gastos[aba] || 0;
        
        if (pontosAnteriores !== pontos) {
            this.gastos[aba] = pontos;
            
            this.atualizarDisplayAba(aba);
            this.atualizarTotais();
            this.verificarLimites();
            
            this.salvarDados();
            
            this.dispararEventoAtualizacao(aba, pontos);
        }
    }
    
    atualizarTudo() {
        Object.keys(this.gastos).forEach(aba => {
            this.atualizarDisplayAba(aba);
        });
        
        this.atualizarTotais();
        this.verificarLimites();
    }
    
    atualizarDisplayAba(aba) {
        if (aba === 'desvantagens') {
            this.atualizarDisplayDesvantagens();
            return;
        }
        
        const elemento = document.getElementById(`pontos${this.capitalizar(aba)}`);
        if (elemento) {
            const pontos = this.gastos[aba];
            
            let texto = pontos >= 0 ? `+${pontos}` : `${pontos}`;
            elemento.textContent = texto;
            
            elemento.parentElement.classList.remove('positivo', 'negativo');
            
            if (pontos > 0) {
                elemento.parentElement.classList.add('positivo');
            } else if (pontos < 0) {
                elemento.parentElement.classList.add('negativo');
            }
        }
        
        this.atualizarPercentualAba(aba);
    }
    
    atualizarDisplayDesvantagens() {
        const elemento = document.getElementById('pontosDesvantagens');
        if (!elemento) return;
        
        const calculo = this.calcularPontosDisponiveis();
        const totalDesvantagens = calculo.desvantagens || 0;
        
        elemento.textContent = `+${totalDesvantagens}`;
        
        elemento.parentElement.classList.remove('positivo', 'negativo');
        elemento.parentElement.classList.add('negativo');
        
        this.atualizarPercentualDesvantagens(totalDesvantagens);
    }
    
    atualizarPercentualAba(aba) {
        if (aba === 'desvantagens') return;
        
        const elemento = document.getElementById(`perc${this.capitalizar(aba)}`);
        if (!elemento) return;
        
        const pontos = this.gastos[aba];
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((Math.abs(pontos) / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else {
                elemento.style.color = '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarPercentualDesvantagens(totalDesvantagens) {
        const elemento = document.getElementById('percDesvantagens');
        if (!elemento) return;
        
        const totalPontos = this.pontosIniciais + this.pontosGanhosCampanha;
        
        if (totalPontos > 0) {
            const percentual = Math.round((totalDesvantagens / totalPontos) * 100);
            elemento.textContent = `${percentual}%`;
            
            if (percentual > 50) {
                elemento.style.color = '#e74c3c';
            } else if (percentual > 25) {
                elemento.style.color = '#f39c12';
            } else {
                elemento.style.color = '#27ae60';
            }
        } else {
            elemento.textContent = '0%';
        }
    }
    
    atualizarTotais() {
        const calculo = this.calcularPontosDisponiveis();
        
        const elementoDisponiveis = document.getElementById('pontosDisponiveis');
        if (elementoDisponiveis) {
            elementoDisponiveis.textContent = calculo.disponiveis;
            
            if (calculo.disponiveis < 0) {
                elementoDisponiveis.style.color = '#e74c3c';
                elementoDisponiveis.style.fontWeight = 'bold';
            } else {
                elementoDisponiveis.style.color = '';
                elementoDisponiveis.style.fontWeight = '';
            }
        }
        
        const elementoGastos = document.getElementById('pontosGastos');
        if (elementoGastos) {
            elementoGastos.textContent = calculo.vantagens;
        }
    }
    
    verificarLimites() {
        const calculo = this.calcularPontosDisponiveis();
        
        const progressDesvantagens = document.getElementById('progressDesvantagens');
        const textDesvantagens = document.getElementById('textDesvantagens');
        const percentDesvantagens = document.getElementById('percentDesvantagens');
        
        if (progressDesvantagens && textDesvantagens && percentDesvantagens) {
            const percentual = Math.min(100, (calculo.totalDesvantagensAbs / this.limites.desvantagens) * 100);
            
            progressDesvantagens.style.width = `${percentual}%`;
            progressDesvantagens.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                       percentual >= 80 ? '#f39c12' : '#3498db';
            
            textDesvantagens.textContent = `${calculo.totalDesvantagensAbs}/${this.limites.desvantagens} pts`;
            percentDesvantagens.textContent = `${Math.round(percentual)}%`;
        }
        
        const progressPeculiaridades = document.getElementById('progressPeculiaridades');
        const textPeculiaridades = document.getElementById('textPeculiaridades');
        const percentPeculiaridades = document.getElementById('percentPeculiaridades');
        
        if (progressPeculiaridades && textPeculiaridades && percentPeculiaridades) {
            const percentual = Math.min(100, (calculo.peculiaridadesAbs / this.limites.peculiaridades) * 100);
            
            progressPeculiaridades.style.width = `${percentual}%`;
            progressPeculiaridades.style.backgroundColor = percentual >= 100 ? '#e74c3c' : 
                                                          percentual >= 80 ? '#f39c12' : '#3498db';
            
            textPeculiaridades.textContent = `${calculo.peculiaridadesAbs}/${this.limites.peculiaridades} pts`;
            percentPeculiaridades.textContent = `${Math.round(percentual)}%`;
        }
    }
    
    async salvarDados() {
        const dados = {
            pontosIniciais: this.pontosIniciais,
            pontosGanhosCampanha: this.pontosGanhosCampanha,
            gastos: { ...this.gastos },
            limites: { ...this.limites }
        };
        
        if (window.salvarModulo) {
            await window.salvarModulo('pontos', dados);
        } else {
            localStorage.setItem('rpgforge_pontos', JSON.stringify(dados));
        }
    }
    
    async carregarDadosSalvos() {
        let dados = null;
        
        if (window.carregarModulo) {
            dados = await window.carregarModulo('pontos');
        }
        
        if (!dados) {
            const dadosLocais = localStorage.getItem('rpgforge_pontos');
            if (dadosLocais) {
                try {
                    dados = JSON.parse(dadosLocais);
                } catch (error) {
                    return;
                }
            }
        }
        
        if (dados) {
            this.aplicarDados(dados);
        }
    }
    
    carregarDadosExternos(dadosExternos) {
        if (dadosExternos) {
            this.aplicarDados(dadosExternos);
        }
    }
    
    aplicarDados(dados) {
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
        
        if (dados.gastos) {
            Object.keys(dados.gastos).forEach(aba => {
                if (this.gastos[aba] !== undefined) {
                    this.gastos[aba] = dados.gastos[aba];
                }
            });
        }
        
        if (dados.limites) {
            Object.keys(dados.limites).forEach(limite => {
                if (this.limites[limite] !== undefined) {
                    this.limites[limite] = dados.limites[limite];
                    
                    const input = document.getElementById(`limite${this.capitalizar(limite)}`);
                    if (input) input.value = this.limites[limite];
                }
            });
        }
        
        this.atualizarTudo();
    }
    
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    mostrarAviso(mensagem) {
        const aviso = document.createElement('div');
        aviso.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);
        
        setTimeout(() => {
            if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
        }, 3000);
    }
    
    dispararEventoAtualizacao(aba, pontos) {
        const evento = new CustomEvent('pontosAtualizados', {
            detail: {
                aba: aba,
                pontos: pontos,
                totais: this.calcularPontosDisponiveis()
            }
        });
        document.dispatchEvent(evento);
    }
    
    obterGastosAba(aba) {
        return this.gastos[aba] || 0;
    }
    
    obterLimiteAba(aba) {
        return this.limites[aba] || 0;
    }
    
    obterPontosDisponiveis() {
        return this.calcularPontosDisponiveis().disponiveis;
    }
}

let pontosManager = null;

function inicializarPontosManager() {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
}

window.obterPontosManager = () => {
    if (!pontosManager) {
        pontosManager = new PontosManager();
    }
    return pontosManager;
};

window.atualizarPontosAba = (aba, pontos) => {
    if (pontosManager) {
        return pontosManager.atualizarGastosAba(aba, pontos);
    }
    return false;
};

window.obterGastosAba = (aba) => {
    if (pontosManager) {
        return pontosManager.obterGastosAba(aba);
    }
    return 0;
};

window.obterPontosDisponiveis = () => {
    if (pontosManager) {
        return pontosManager.obterPontosDisponiveis();
    }
    return 150;
};

document.addEventListener('DOMContentLoaded', function() {
    const tabPrincipal = document.getElementById('principal');
    if (tabPrincipal && tabPrincipal.classList.contains('active')) {
        setTimeout(() => {
            inicializarPontosManager();
        }, 500);
    }
    
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(() => {
                if (!pontosManager) {
                    inicializarPontosManager();
                }
            }, 500);
        }
    });
});