// ===========================================
// CARACTERÍSTICAS-RIQUEZA.JS - VERSÃO FINAL SEM DUPLICAÇÃO
// ===========================================

class SistemaRiqueza {
    constructor() {
        this.niveisRiqueza = {
            "-25": { 
                nome: "Miserável/Falido",
                pontos: -25, 
                multiplicador: 0, 
                rendaBase: 0,
                descricao: "Sem emprego, fonte de renda, dinheiro ou bens",
                recursos: "Nenhum",
                icone: "fas fa-skull-crossbones",
                tipo: "desvantagem",
                cor: "#e74c3c"
            },
            "-15": { 
                nome: "Pobre",
                pontos: -15, 
                multiplicador: 0.2, 
                rendaBase: 200,
                descricao: "1/5 da riqueza média da sociedade",
                recursos: "Muito limitados",
                icone: "fas fa-house-damage",
                tipo: "desvantagem",
                cor: "#e74c3c"
            },
            "-10": { 
                nome: "Batalhador",
                pontos: -10, 
                multiplicador: 0.5, 
                rendaBase: 500,
                descricao: "Metade da riqueza média",
                recursos: "Limitados",
                icone: "fas fa-hands-helping",
                tipo: "desvantagem",
                cor: "#e74c3c"
            },
            "0": { 
                nome: "Médio",
                pontos: 0, 
                multiplicador: 1, 
                rendaBase: 1000,
                descricao: "Nível de recursos pré-definido padrão",
                recursos: "Padrão",
                icone: "fas fa-user",
                tipo: "neutro",
                cor: "#95a5a6"
            },
            "10": { 
                nome: "Confortável",
                pontos: 10, 
                multiplicador: 2, 
                rendaBase: 2000,
                descricao: "O dobro da riqueza média",
                recursos: "Confortáveis",
                icone: "fas fa-smile",
                tipo: "vantagem",
                cor: "#27ae60"
            },
            "20": { 
                nome: "Rico",
                pontos: 20, 
                multiplicador: 5, 
                rendaBase: 5000,
                descricao: "5 vezes a riqueza média",
                recursos: "Abundantes",
                icone: "fas fa-grin-stars",
                tipo: "vantagem",
                cor: "#27ae60"
            },
            "30": { 
                nome: "Muito Rico",
                pontos: 30, 
                multiplicador: 20, 
                rendaBase: 20000,
                descricao: "20 vezes a riqueza média", 
                recursos: "Extremamente abundantes",
                icone: "fas fa-crown",
                tipo: "vantagem",
                cor: "#27ae60"
            },
            "50": { 
                nome: "Poderoso/Multimilionário",
                pontos: 50, 
                multiplicador: 100, 
                rendaBase: 100000,
                descricao: "100 vezes a riqueza média",
                recursos: "Ilimitados para necessidades comuns",
                icone: "fas fa-gem",
                tipo: "vantagem",
                cor: "#27ae60"
            }
        };

        this.nivelAnterior = "0";
        this.nivelAtual = "0";
        this.pontosRiqueza = 0;
        this.inicializado = false;
        this.carregarDoLocalStorage();
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.configurarEventos();
        this.atualizarDisplay();
        this.inicializado = true;
        
        this.notificarAtualizacao();
    }

    configurarEventos() {
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            selectRiqueza.addEventListener('change', (e) => {
                this.definirNivel(e.target.value);
            });
        }
    }

    definirNivel(valor) {
        // Guarda o nível anterior ANTES de mudar
        const nivelAnteriorValor = this.nivelAtual;
        const nivelAnteriorObj = this.niveisRiqueza[nivelAnteriorValor];
        
        // Atualiza estado
        this.nivelAnterior = nivelAnteriorValor;
        this.nivelAtual = valor;
        this.pontosRiqueza = parseInt(valor);
        
        // Atualiza select
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = valor;
        }
        
        this.atualizarDisplay();
        this.salvarNoLocalStorage();
        
        // Atualiza sistema de pontos CORRETAMENTE
        this.atualizarSistemaPontos(nivelAnteriorObj);
    }

    atualizarSistemaPontos(nivelAnteriorObj) {
        const pontosAnterior = nivelAnteriorObj ? nivelAnteriorObj.pontos : 0;
        const pontosAtual = this.pontosRiqueza;
        
        // PRIMEIRO: Remove os pontos do nível anterior
        if (pontosAnterior > 0) {
            // Era vantagem - remove dos gastos
            if (window.atualizarPontosAba) {
                window.atualizarPontosAba('vantagens', 0);
            }
        } else if (pontosAnterior < 0) {
            // Era desvantagem - remove dos ganhos
            if (window.atualizarPontosAba) {
                window.atualizarPontosAba('desvantagens', 0);
            }
        }
        
        // DEPOIS: Adiciona os pontos do nível atual
        if (pontosAtual > 0) {
            // É VANTAGEM
            if (window.atualizarPontosAba) {
                window.atualizarPontosAba('vantagens', pontosAtual);
            }
        } else if (pontosAtual < 0) {
            // É DESVANTAGEM
            if (window.atualizarPontosAba) {
                window.atualizarPontosAba('desvantagens', Math.abs(pontosAtual));
            }
        }
        // Se for 0, já foi zerado no primeiro passo
    }

    atualizarDisplay() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        if (!nivel) return;

        const display = document.getElementById('displayRiqueza');
        const badge = document.getElementById('pontosRiquezaBadge');
        const rendaElement = document.getElementById('rendaMensal');
        const multiplicadorElement = document.getElementById('multiplicadorRiqueza');
        const saldoAtual = document.getElementById('saldoAtual');

        if (display) {
            display.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="${nivel.icone}" style="color: ${nivel.cor}; font-size: 1.5rem;"></i>
                    <strong style="color: var(--text-gold);">${nivel.nome}</strong>
                </div>
                <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8;">
                    <div>Multiplicador: ${nivel.multiplicador}× | Recursos: ${nivel.recursos}</div>
                    <div style="margin-top: 4px;">${nivel.descricao}</div>
                </div>
            `;
        }

        if (badge) {
            const pontosTexto = this.pontosRiqueza >= 0 ? 
                (this.pontosRiqueza === 0 ? "0 pts" : `+${this.pontosRiqueza} pts`) : 
                `${this.pontosRiqueza} pts`;
            badge.textContent = pontosTexto;
            
            badge.className = 'pontos-badge';
            if (this.pontosRiqueza > 0) {
                badge.classList.add('positivo');
            } else if (this.pontosRiqueza < 0) {
                badge.classList.add('negativo');
            } else {
                badge.classList.remove('positivo', 'negativo');
            }
        }

        if (rendaElement) {
            rendaElement.textContent = this.formatarMoeda(nivel.rendaBase);
            rendaElement.style.color = nivel.cor;
        }

        if (multiplicadorElement) {
            multiplicadorElement.textContent = `×${nivel.multiplicador}`;
        }

        if (saldoAtual) {
            saldoAtual.value = nivel.rendaBase;
        }
    }

    formatarMoeda(valor) {
        if (valor === 0) return "$0";
        if (valor >= 1000000) {
            return `$${(valor / 1000000).toFixed(2)}M`;
        } else if (valor >= 1000) {
            return `$${(valor / 1000).toFixed(2)}K`;
        } else {
            return `$${valor.toLocaleString('en-US')}`;
        }
    }

    getPontosRiqueza() {
        return this.pontosRiqueza;
    }

    getTipoPontos() {
        if (this.pontosRiqueza > 0) return 'vantagem';
        if (this.pontosRiqueza < 0) return 'desvantagem';
        return 'neutro';
    }

    notificarAtualizacao() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        const pontos = this.getPontosRiqueza();
        const tipo = this.getTipoPontos();
        
        const evento = new CustomEvent('riquezaAtualizada', {
            detail: {
                pontos: pontos,
                tipo: tipo,
                nivel: nivel.nome,
                multiplicador: nivel.multiplicador,
                rendaMensal: nivel.rendaBase
            }
        });
        document.dispatchEvent(evento);
    }

    salvarNoLocalStorage() {
        try {
            const dados = {
                nivelRiqueza: this.nivelAtual,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gurps_riqueza', JSON.stringify(dados));
        } catch (error) {}
    }

    carregarDoLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_riqueza');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                if (dados.nivelRiqueza !== undefined) {
                    this.nivelAtual = dados.nivelRiqueza;
                    this.nivelAnterior = "0";
                    this.pontosRiqueza = parseInt(dados.nivelRiqueza);
                    
                    const select = document.getElementById('nivelRiqueza');
                    if (select) {
                        select.value = dados.nivelRiqueza;
                    }
                    
                    return true;
                }
            }
        } catch (error) {}
        return false;
    }

    exportarDados() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        
        return {
            riqueza: {
                pontos: this.pontosRiqueza,
                tipo: this.getTipoPontos(),
                nome: nivel.nome,
                nivel: this.nivelAtual,
                multiplicador: nivel.multiplicador,
                rendaMensal: nivel.rendaBase,
                descricao: nivel.descricao,
                icone: nivel.icone,
                recursos: nivel.recursos
            }
        };
    }

    carregarDados(dados) {
        if (dados.riqueza && dados.riqueza.nivel !== undefined) {
            this.definirNivel(dados.riqueza.nivel);
            return true;
        }
        return false;
    }

    resetar() {
        this.definirNivel("0");
    }
}

let sistemaRiqueza = null;

function inicializarSistemaRiqueza() {
    if (!sistemaRiqueza) {
        sistemaRiqueza = new SistemaRiqueza();
    }
    
    const select = document.getElementById('nivelRiqueza');
    if (!select) return null;
    
    sistemaRiqueza.inicializar();
    
    return sistemaRiqueza;
}

document.addEventListener('DOMContentLoaded', function() {
    const principalTab = document.getElementById('principal');
    if (principalTab && principalTab.classList.contains('active')) {
        setTimeout(inicializarSistemaRiqueza, 100);
    }
});

document.addEventListener('tabChanged', function(e) {
    if (e.detail === 'principal') {
        setTimeout(inicializarSistemaRiqueza, 100);
    }
});

window.SistemaRiqueza = SistemaRiqueza;
window.inicializarSistemaRiqueza = inicializarSistemaRiqueza;
window.sistemaRiqueza = sistemaRiqueza;
window.getPontosRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getPontosRiqueza() : 0;
};
window.resetarRiqueza = function() {
    if (sistemaRiqueza) sistemaRiqueza.resetar();
};