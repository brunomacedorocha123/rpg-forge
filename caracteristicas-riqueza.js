// ===========================================
// CARACTERÍSTICAS-RIQUEZA.JS - VERSÃO CORRIGIDA
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

        this.nivelAtual = "0";
        this.pontosRiqueza = 0;
        this.inicializado = false;
        
        this.inicializar();
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.carregarDoLocalStorage();
        this.configurarEventos();
        this.atualizarDisplay();
        this.enviarEventoParaPontosManager();
        
        this.inicializado = true;
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
        const nivelAnterior = this.nivelAtual;
        this.nivelAtual = valor;
        this.pontosRiqueza = parseInt(valor);
        
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = valor;
        }
        
        this.atualizarDisplay();
        this.salvarNoLocalStorage();
        this.enviarEventoParaPontosManager();
    }

    enviarEventoParaPontosManager() {
        document.dispatchEvent(new CustomEvent('riquezaAtualizadaParaSoma', {
            detail: {
                pontos: this.pontosRiqueza,
                nivel: this.nivelAtual,
                nome: this.niveisRiqueza[this.nivelAtual]?.nome || 'Desconhecido'
            }
        }));
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

    salvarNoLocalStorage() {
        try {
            const dados = {
                nivelRiqueza: this.nivelAtual,
                pontosRiqueza: this.pontosRiqueza
            };
            localStorage.setItem('rpgforge_riqueza', JSON.stringify(dados));
        } catch (error) {}
    }

    carregarDoLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_riqueza');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                if (dados.nivelRiqueza !== undefined) {
                    this.nivelAtual = dados.nivelRiqueza;
                    this.pontosRiqueza = dados.pontosRiqueza || parseInt(dados.nivelRiqueza);
                    
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
                descricao: nivel.descricao
            }
        };
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
    if (!select) {
        return null;
    }
    
    sistemaRiqueza.inicializar();
    return sistemaRiqueza;
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('nivelRiqueza')) {
            inicializarSistemaRiqueza();
        }
    }, 300);
    
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(() => {
                if (!sistemaRiqueza && document.getElementById('nivelRiqueza')) {
                    inicializarSistemaRiqueza();
                }
            }, 300);
        }
    });
});

window.SistemaRiqueza = SistemaRiqueza;
window.inicializarSistemaRiqueza = inicializarSistemaRiqueza;
window.getPontosRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getPontosRiqueza() : 0;
};