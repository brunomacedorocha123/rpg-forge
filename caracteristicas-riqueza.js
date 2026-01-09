// ===========================================
// CARACTERÍSTICAS-RIQUEZA.JS - ORIGINAL FUNCIONAL
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
        console.log('💰 Sistema de Riqueza inicializado!');
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
        
        // Atualiza select
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = valor;
        }
        
        this.atualizarDisplay();
        this.salvarNoLocalStorage();
        this.enviarEventoParaPontosManager();
        
        console.log(`💰 Riqueza: ${nivelAnterior} -> ${valor} (${this.pontosRiqueza} pts)`);
    }

    enviarEventoParaPontosManager() {
        // ENVIA EVENTO PARA O NOVO SISTEMA QUE SOMA
        const evento = new CustomEvent('riquezaAtualizadaParaSoma', {
            detail: {
                pontos: this.pontosRiqueza,
                nivel: this.nivelAtual,
                nome: this.niveisRiqueza[this.nivelAtual]?.nome || 'Desconhecido'
            }
        });
        document.dispatchEvent(evento);
        
        console.log('📤 Evento de riqueza enviado:', this.pontosRiqueza, 'pts');
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
                pontosRiqueza: this.pontosRiqueza,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('rpgforge_riqueza_corrigida', JSON.stringify(dados));
        } catch (error) {
            console.error('Erro ao salvar riqueza:', error);
        }
    }

    carregarDoLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_riqueza_corrigida');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                if (dados.nivelRiqueza !== undefined) {
                    this.nivelAtual = dados.nivelRiqueza;
                    this.pontosRiqueza = dados.pontosRiqueza || parseInt(dados.nivelRiqueza);
                    
                    const select = document.getElementById('nivelRiqueza');
                    if (select) {
                        select.value = dados.nivelRiqueza;
                    }
                    
                    console.log('💰 Riqueza carregada:', this.nivelAtual, '(', this.pontosRiqueza, 'pts)');
                    return true;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar riqueza:', error);
        }
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

// ==================== INSTANCIAÇÃO GLOBAL ====================

let sistemaRiqueza = null;

function inicializarSistemaRiqueza() {
    if (!sistemaRiqueza) {
        sistemaRiqueza = new SistemaRiqueza();
    }
    
    const select = document.getElementById('nivelRiqueza');
    if (!select) {
        console.log('⚠️ Select de riqueza não encontrado');
        return null;
    }
    
    sistemaRiqueza.inicializar();
    return sistemaRiqueza;
}

// ==================== TESTE DA RIQUEZA ====================

function testarRiqueza() {
    if (!sistemaRiqueza) {
        console.log('❌ Sistema de riqueza não inicializado');
        return;
    }
    
    console.log('🧪 Testando sistema de riqueza...');
    
    // Testa mudar para Batalhador (-10)
    sistemaRiqueza.definirNivel("-10");
    
    // Testa mudar para Rico (+20)
    setTimeout(() => {
        sistemaRiqueza.definirNivel("20");
        
        // Testa voltar para Médio (0)
        setTimeout(() => {
            sistemaRiqueza.definirNivel("0");
            console.log('✅ Teste de riqueza completado!');
        }, 500);
    }, 500);
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    // Espera a aba principal estar ativa
    setTimeout(() => {
        if (document.getElementById('nivelRiqueza')) {
            inicializarSistemaRiqueza();
            console.log('🔄 Sistema de riqueza inicializado na aba principal');
        }
    }, 300);
    
    // Inicializa quando muda para aba principal
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

// ==================== EXPORTAÇÕES ====================

window.SistemaRiqueza = SistemaRiqueza;
window.inicializarSistemaRiqueza = inicializarSistemaRiqueza;
window.testarRiqueza = testarRiqueza;
window.getPontosRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getPontosRiqueza() : 0;
};

// ==================== FUNÇÃO PARA DEBUG ====================

window.mostrarStatusRiqueza = function() {
    if (sistemaRiqueza) {
        console.log('💰 STATUS DA RIQUEZA:');
        console.log('- Nível:', sistemaRiqueza.nivelAtual);
        console.log('- Pontos:', sistemaRiqueza.pontosRiqueza);
        console.log('- Tipo:', sistemaRiqueza.getTipoPontos());
        console.log('- Nome:', sistemaRiqueza.niveisRiqueza[sistemaRiqueza.nivelAtual]?.nome);
    } else {
        console.log('❌ Sistema de riqueza não inicializado');
    }
};