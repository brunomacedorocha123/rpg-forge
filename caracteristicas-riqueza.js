// ===========================================
// CARACTERÍSTICAS-RIQUEZA.JS - SISTEMA COMPLETO
// ===========================================

class SistemaRiqueza {
    constructor() {
        // DEFINIÇÃO COMPLETA DOS NÍVEIS
        this.niveisRiqueza = {
            "-25": { 
                nome: "Miserável/Falido",
                pontos: -25,
                multiplicador: 0,
                rendaBase: 0,
                descricao: "Sem emprego, fonte de renda, dinheiro ou bens",
                icone: "fas fa-skull-crossbones",
                tipo: "desvantagem",
                cor: "#e74c3c",
                status: "Extremamente limitado"
            },
            "-15": { 
                nome: "Pobre",
                pontos: -15,
                multiplicador: 0.2,
                rendaBase: 200,
                descricao: "1/5 da riqueza média da sociedade",
                icone: "fas fa-house-damage",
                tipo: "desvantagem",
                cor: "#e74c3c",
                status: "Muito limitado"
            },
            "-10": { 
                nome: "Batalhador",
                pontos: -10,
                multiplicador: 0.5,
                rendaBase: 500,
                descricao: "Metade da riqueza média",
                icone: "fas fa-hands-helping",
                tipo: "desvantagem",
                cor: "#e74c3c",
                status: "Limitado"
            },
            "0": { 
                nome: "Médio",
                pontos: 0,
                multiplicador: 1,
                rendaBase: 1000,
                descricao: "Nível de recursos pré-definido padrão",
                icone: "fas fa-user",
                tipo: "neutro",
                cor: "#95a5a6",
                status: "Padrão"
            },
            "10": { 
                nome: "Confortável",
                pontos: 10,
                multiplicador: 2,
                rendaBase: 2000,
                descricao: "O dobro da riqueza média",
                icone: "fas fa-smile",
                tipo: "vantagem",
                cor: "#27ae60",
                status: "Confortável"
            },
            "20": { 
                nome: "Rico",
                pontos: 20,
                multiplicador: 5,
                rendaBase: 5000,
                descricao: "5 vezes a riqueza média",
                icone: "fas fa-grin-stars",
                tipo: "vantagem",
                cor: "#27ae60",
                status: "Abundante"
            },
            "30": { 
                nome: "Muito Rico",
                pontos: 30,
                multiplicador: 20,
                rendaBase: 20000,
                descricao: "20 vezes a riqueza média", 
                icone: "fas fa-crown",
                tipo: "vantagem",
                cor: "#27ae60",
                status: "Extremamente abundante"
            },
            "50": { 
                nome: "Poderoso/Multimilionário",
                pontos: 50,
                multiplicador: 100,
                rendaBase: 100000,
                descricao: "100 vezes a riqueza média",
                icone: "fas fa-gem",
                tipo: "vantagem",
                cor: "#27ae60",
                status: "Ilimitado"
            }
        };

        this.nivelAtual = "0";
        this.inicializado = false;
        this.carregarDoLocalStorage();
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.configurarElementos();
        this.configurarEventos();
        this.atualizarDisplay();
        this.notificarSistemaPontos();
        
        this.inicializado = true;
    }

    configurarElementos() {
        // Configurar select
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = this.nivelAtual;
        }
        
        // Configurar saldo atual
        const saldoInput = document.getElementById('saldoAtual');
        if (saldoInput) {
            const nivel = this.niveisRiqueza[this.nivelAtual];
            if (nivel && !saldoInput.hasAttribute('data-modificado')) {
                saldoInput.value = nivel.rendaBase;
            }
        }
    }

    configurarEventos() {
        // Evento do select
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.addEventListener('change', (e) => {
                this.mudarNivel(e.target.value);
            });
        }
        
        // Evento do saldo
        const saldoInput = document.getElementById('saldoAtual');
        if (saldoInput) {
            saldoInput.addEventListener('input', () => {
                saldoInput.setAttribute('data-modificado', 'true');
                this.validarSaldo(saldoInput.value);
            });
            
            saldoInput.addEventListener('blur', () => {
                this.salvarNoLocalStorage();
            });
        }
    }

    mudarNivel(novoNivel) {
        if (!this.niveisRiqueza[novoNivel]) return;
        
        const nivelAnterior = this.nivelAtual;
        this.nivelAtual = novoNivel;
        
        // Atualizar select
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = novoNivel;
        }
        
        // Atualizar display
        this.atualizarDisplay();
        
        // Notificar sistema de pontos
        this.notificarSistemaPontos();
        
        // Atualizar saldo se não foi modificado manualmente
        const saldoInput = document.getElementById('saldoAtual');
        if (saldoInput && !saldoInput.hasAttribute('data-modificado')) {
            const nivel = this.niveisRiqueza[novoNivel];
            saldoInput.value = nivel.rendaBase;
        }
        
        // Salvar
        this.salvarNoLocalStorage();
    }

    notificarSistemaPontos() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        if (!nivel) return;
        
        const evento = new CustomEvent('riquezaAtualizada', {
            detail: {
                pontos: nivel.pontos,
                nivel: this.nivelAtual,
                nome: nivel.nome,
                tipo: nivel.tipo,
                multiplicador: nivel.multiplicador,
                rendaBase: nivel.rendaBase
            }
        });
        
        document.dispatchEvent(evento);
    }

    atualizarDisplay() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        if (!nivel) return;

        // 1. Badge de pontos
        const badge = document.getElementById('pontosRiquezaBadge');
        if (badge) {
            let texto = '0 pts';
            let classe = 'pontos-badge';
            
            if (nivel.pontos > 0) {
                texto = `+${nivel.pontos} pts`;
                classe += ' positivo';
            } else if (nivel.pontos < 0) {
                texto = `${nivel.pontos} pts`;
                classe += ' negativo';
            }
            
            badge.textContent = texto;
            badge.className = classe;
        }

        // 2. Display principal
        const display = document.getElementById('displayRiqueza');
        if (display) {
            display.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <i class="${nivel.icone}" style="color: ${nivel.cor}; font-size: 1.8rem;"></i>
                    <div>
                        <strong style="color: var(--text-gold); font-size: 1.2rem;">${nivel.nome}</strong>
                        <div style="font-size: 0.9em; color: ${nivel.cor}; margin-top: 2px;">
                            ${nivel.status}
                        </div>
                    </div>
                </div>
                <div style="font-size: 0.9em; color: var(--text-light); line-height: 1.4;">
                    <div>${nivel.descricao}</div>
                    <div style="margin-top: 6px; display: flex; justify-content: space-between;">
                        <span>Multiplicador: <strong>${nivel.multiplicador}×</strong></span>
                        <span>Renda: <strong>${this.formatarMoeda(nivel.rendaBase)}</strong></span>
                    </div>
                </div>
            `;
        }

        // 3. Multiplicador
        const multElement = document.getElementById('multiplicadorRiqueza');
        if (multElement) {
            multElement.textContent = `×${nivel.multiplicador}`;
            multElement.style.color = nivel.cor;
        }

        // 4. Renda mensal
        const rendaElement = document.getElementById('rendaMensal');
        if (rendaElement) {
            rendaElement.textContent = this.formatarMoeda(nivel.rendaBase);
            rendaElement.style.color = nivel.cor;
        }
    }

    validarSaldo(valor) {
        const numValor = parseInt(valor) || 0;
        const saldoInput = document.getElementById('saldoAtual');
        
        if (!saldoInput) return;
        
        // Não permitir negativo
        if (numValor < 0) {
            saldoInput.value = 0;
        }
        
        // Aviso se valor muito alto para o nível
        const nivel = this.niveisRiqueza[this.nivelAtual];
        if (nivel && nivel.rendaBase > 0 && numValor > nivel.rendaBase * 1000) {
            saldoInput.style.borderColor = '#f39c12';
            saldoInput.style.backgroundColor = '#fff3cd';
        } else {
            saldoInput.style.borderColor = '';
            saldoInput.style.backgroundColor = '';
        }
    }

    formatarMoeda(valor) {
        if (valor >= 1000000) {
            return `$${(valor / 1000000).toFixed(1)}M`;
        } else if (valor >= 1000) {
            return `$${(valor / 1000).toFixed(1)}K`;
        } else {
            return `$${valor.toLocaleString('pt-BR')}`;
        }
    }

    salvarNoLocalStorage() {
        const dados = {
            nivelRiqueza: this.nivelAtual,
            saldoAtual: document.getElementById('saldoAtual')?.value || 1000,
            timestamp: new Date().toISOString(),
            versao: '2.0'
        };
        
        localStorage.setItem('gurps_riqueza_completo', JSON.stringify(dados));
    }

    carregarDoLocalStorage() {
        try {
            const dados = localStorage.getItem('gurps_riqueza_completo');
            if (dados) {
                const parsed = JSON.parse(dados);
                if (parsed.nivelRiqueza) {
                    this.nivelAtual = parsed.nivelRiqueza;
                    
                    // Restaurar saldo
                    const saldoInput = document.getElementById('saldoAtual');
                    if (saldoInput && parsed.saldoAtual) {
                        saldoInput.value = parsed.saldoAtual;
                        saldoInput.setAttribute('data-modificado', 'true');
                    }
                    
                    return true;
                }
            }
        } catch (e) {
            // Silencioso em caso de erro
        }
        return false;
    }

    // Métodos públicos
    getNivelAtual() {
        return this.nivelAtual;
    }

    getPontosRiqueza() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        return nivel ? nivel.pontos : 0;
    }

    getDetalhesNivel() {
        return this.niveisRiqueza[this.nivelAtual] || null;
    }

    resetar() {
        this.nivelAtual = "0";
        
        // Resetar select
        const select = document.getElementById('nivelRiqueza');
        if (select) select.value = "0";
        
        // Resetar saldo
        const saldoInput = document.getElementById('saldoAtual');
        if (saldoInput) {
            saldoInput.value = 1000;
            saldoInput.removeAttribute('data-modificado');
        }
        
        // Atualizar e notificar
        this.atualizarDisplay();
        this.notificarSistemaPontos();
        this.salvarNoLocalStorage();
    }
}

// ========== INSTÂNCIA GLOBAL ==========

let sistemaRiqueza = null;

function inicializarSistemaRiqueza() {
    if (!sistemaRiqueza) {
        sistemaRiqueza = new SistemaRiqueza();
        sistemaRiqueza.inicializar();
    }
    return sistemaRiqueza;
}

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        inicializarSistemaRiqueza();
    }, 100);
});

// ========== API GLOBAL ==========

window.SistemaRiqueza = SistemaRiqueza;
window.inicializarSistemaRiqueza = inicializarSistemaRiqueza;
window.sistemaRiqueza = sistemaRiqueza;

window.getPontosRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getPontosRiqueza() : 0;
};

window.resetarRiqueza = function() {
    if (sistemaRiqueza) sistemaRiqueza.resetar();
};

window.getDetalhesRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getDetalhesNivel() : null;
};

// Adicionar estilos CSS
if (!document.querySelector('#estilos-riqueza-completo')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilos-riqueza-completo';
    estilo.textContent = `
        .pontos-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: bold;
            background: #95a5a6;
            color: white;
            min-width: 70px;
            text-align: center;
        }
        
        .pontos-badge.positivo {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            box-shadow: 0 2px 4px rgba(39, 174, 96, 0.3);
        }
        
        .pontos-badge.negativo {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
        }
        
        .wealth-display {
            transition: all 0.3s ease;
            padding: 15px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .wealth-display strong {
            transition: color 0.3s ease;
        }
        
        .wealth-display:hover {
            background: rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
        }
        
        .currency {
            color: var(--text-gold);
            font-weight: bold;
            margin-right: 4px;
        }
        
        .display-value.total {
            font-size: 1.3em;
            font-weight: bold;
            color: var(--text-gold);
            padding: 5px 0;
        }
        
        .input-group {
            display: flex;
            align-items: center;
        }
        
        .input-group .currency {
            padding: 8px 12px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-right: none;
            border-radius: 4px 0 0 4px;
        }
        
        .input-group input {
            border-radius: 0 4px 4px 0;
        }
    `;
    document.head.appendChild(estilo);
}