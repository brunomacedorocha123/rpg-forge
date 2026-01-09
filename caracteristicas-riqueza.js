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
        this.carregarDoLocalStorage();
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.configurarEventos();
        this.atualizarDisplay();
        this.notificarAtualizacao();
        
        this.inicializado = true;
    }

    configurarEventos() {
        const selectRiqueza = document.getElementById('nivelRiqueza');
        if (selectRiqueza) {
            // Configurar valor atual
            selectRiqueza.value = this.nivelAtual;
            
            // Evento de mudança
            selectRiqueza.addEventListener('change', (e) => {
                this.definirNivel(e.target.value);
            });
        }
        
        // Configurar saldo atual (se houver input)
        const saldoAtual = document.getElementById('saldoAtual');
        if (saldoAtual) {
            saldoAtual.addEventListener('change', (e) => {
                this.validarSaldoAtual();
            });
            
            saldoAtual.addEventListener('blur', (e) => {
                this.validarSaldoAtual();
            });
        }
    }

    definirNivel(valor) {
        // Verificar se o valor é válido
        if (!this.niveisRiqueza[valor]) {
            console.error('Nível de riqueza inválido:', valor);
            return;
        }
        
        const nivelAnterior = this.nivelAtual;
        const nivelNovo = valor;
        
        // Atualizar estado interno
        this.nivelAtual = nivelNovo;
        this.pontosRiqueza = parseInt(nivelNovo);
        
        // Atualizar interface
        this.atualizarSelect();
        this.atualizarDisplay();
        
        // Atualizar sistema de pontos
        this.atualizarSistemaPontos(nivelAnterior, nivelNovo);
        
        // Salvar e notificar
        this.salvarNoLocalStorage();
        this.notificarAtualizacao();
        
        console.log(`Riqueza alterada: ${nivelAnterior} -> ${nivelNovo} (${this.pontosRiqueza} pts)`);
    }

    atualizarSistemaPontos(nivelAnterior, nivelNovo) {
        const nivelObjAnterior = this.niveisRiqueza[nivelAnterior];
        const nivelObjNovo = this.niveisRiqueza[nivelNovo];
        
        const pontosAnterior = nivelObjAnterior ? nivelObjAnterior.pontos : 0;
        const pontosNovo = nivelObjNovo.pontos;
        
        // SE ERA VANTAGEM ANTES: remove dos gastos
        if (pontosAnterior > 0) {
            if (window.atualizarPontosAba) {
                // Não precisa fazer nada especial, o sistema de pontos já gerencia
                console.log(`Removendo vantagem de riqueza: ${pontosAnterior} pts`);
            }
        }
        
        // SE ERA DESVANTAGEM ANTES: remove das fontes
        if (pontosAnterior < 0) {
            if (window.atualizarFonteDesvantagem) {
                // Zera esta fonte (o sistema somará com outras fontes)
                window.atualizarFonteDesvantagem('riqueza', 0);
                console.log(`Removendo desvantagem de riqueza: ${Math.abs(pontosAnterior)} pts`);
            }
        }
        
        // SE É VANTAGEM AGORA: adiciona aos gastos
        if (pontosNovo > 0) {
            if (window.atualizarPontosAba) {
                // Adiciona como vantagem
                window.atualizarPontosAba('vantagens', pontosNovo);
                console.log(`Adicionando vantagem de riqueza: ${pontosNovo} pts`);
            }
        }
        
        // SE É DESVANTAGEM AGORA: adiciona às fontes
        if (pontosNovo < 0) {
            if (window.atualizarFonteDesvantagem) {
                // Adiciona como desvantagem (valor absoluto)
                window.atualizarFonteDesvantagem('riqueza', Math.abs(pontosNovo));
                console.log(`Adicionando desvantagem de riqueza: ${Math.abs(pontosNovo)} pts`);
            }
        }
    }

    atualizarSelect() {
        const select = document.getElementById('nivelRiqueza');
        if (select) {
            select.value = this.nivelAtual;
        }
    }

    atualizarDisplay() {
        const nivel = this.niveisRiqueza[this.nivelAtual];
        if (!nivel) return;

        // Atualizar display principal
        const display = document.getElementById('displayRiqueza');
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

        // Atualizar badge de pontos
        const badge = document.getElementById('pontosRiquezaBadge');
        if (badge) {
            let textoPontos = '';
            if (this.pontosRiqueza > 0) {
                textoPontos = `+${this.pontosRiqueza} pts`;
                badge.className = 'pontos-badge positivo';
            } else if (this.pontosRiqueza < 0) {
                textoPontos = `${this.pontosRiqueza} pts`;
                badge.className = 'pontos-badge negativo';
            } else {
                textoPontos = '0 pts';
                badge.className = 'pontos-badge';
            }
            badge.textContent = textoPontos;
        }

        // Atualizar valores numéricos
        const rendaElement = document.getElementById('rendaMensal');
        if (rendaElement) {
            rendaElement.textContent = this.formatarMoeda(nivel.rendaBase);
            rendaElement.style.color = nivel.cor;
        }

        const multiplicadorElement = document.getElementById('multiplicadorRiqueza');
        if (multiplicadorElement) {
            multiplicadorElement.textContent = `×${nivel.multiplicador}`;
            multiplicadorElement.style.color = nivel.cor;
        }

        // Atualizar saldo atual (opcional)
        const saldoAtual = document.getElementById('saldoAtual');
        if (saldoAtual && !saldoAtual.hasAttribute('data-ignore-update')) {
            saldoAtual.setAttribute('data-ignore-update', 'true');
            saldoAtual.value = nivel.rendaBase;
            saldoAtual.removeAttribute('data-ignore-update');
        }
    }

    validarSaldoAtual() {
        const saldoAtual = document.getElementById('saldoAtual');
        if (!saldoAtual) return;
        
        let valor = parseInt(saldoAtual.value) || 0;
        
        // Garantir que não seja negativo
        if (valor < 0) {
            valor = 0;
            saldoAtual.value = 0;
        }
        
        // Verificar se é razoável para o nível de riqueza
        const nivel = this.niveisRiqueza[this.nivelAtual];
        const rendaSugerida = nivel.rendaBase;
        
        if (valor > rendaSugerida * 100) {
            if (confirm(`Saldo muito alto para nível "${nivel.nome}".\nDeseja ajustar para ${this.formatarMoeda(rendaSugerida * 10)}?`)) {
                saldoAtual.value = rendaSugerida * 10;
            }
        }
    }

    formatarMoeda(valor) {
        if (valor === 0) return "$0";
        
        // Para valores muito grandes, usar notação mais simples
        if (valor >= 1000000) {
            return `$${(valor / 1000000).toFixed(1)}M`;
        } else if (valor >= 1000) {
            return `$${(valor / 1000).toFixed(1)}K`;
        } else {
            return `$${valor.toLocaleString('en-US')}`;
        }
    }

    getPontosRiqueza() {
        return this.pontosRiqueza;
    }

    getNivelAtual() {
        return this.nivelAtual;
    }

    getNivelObjeto() {
        return this.niveisRiqueza[this.nivelAtual];
    }

    getTipoPontos() {
        if (this.pontosRiqueza > 0) return 'vantagem';
        if (this.pontosRiqueza < 0) return 'desvantagem';
        return 'neutro';
    }

    notificarAtualizacao() {
        const nivel = this.getNivelObjeto();
        const pontos = this.getPontosRiqueza();
        const tipo = this.getTipoPontos();
        
        const evento = new CustomEvent('riquezaAtualizada', {
            detail: {
                pontos: pontos,
                tipo: tipo,
                nivel: nivel.nome,
                nivelValor: this.nivelAtual,
                multiplicador: nivel.multiplicador,
                rendaMensal: nivel.rendaBase,
                descricao: nivel.descricao
            }
        });
        
        document.dispatchEvent(evento);
        
        // Também disparar evento específico para pontos
        if (tipo === 'desvantagem') {
            const eventoDesvantagem = new CustomEvent('desvantagemRiquezaAtualizada', {
                detail: {
                    pontos: Math.abs(pontos),
                    fonte: 'riqueza'
                }
            });
            document.dispatchEvent(eventoDesvantagem);
        }
    }

    salvarNoLocalStorage() {
        try {
            const dados = {
                nivelRiqueza: this.nivelAtual,
                pontosRiqueza: this.pontosRiqueza,
                timestamp: new Date().toISOString(),
                versao: '2.0' // Nova versão com sistema corrigido
            };
            localStorage.setItem('gurps_riqueza', JSON.stringify(dados));
        } catch (error) {
            console.error('Erro ao salvar riqueza:', error);
        }
    }

    carregarDoLocalStorage() {
        try {
            const dadosSalvos = localStorage.getItem('gurps_riqueza');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                // Verificar versão para compatibilidade
                if (dados.nivelRiqueza !== undefined) {
                    this.nivelAtual = dados.nivelRiqueza;
                    this.pontosRiqueza = parseInt(dados.nivelRiqueza);
                    
                    // Se dados antigos sem pontosRiqueza, calcular
                    if (isNaN(this.pontosRiqueza)) {
                        this.pontosRiqueza = dados.pontosRiqueza || 0;
                    }
                    
                    console.log(`Riqueza carregada: ${this.nivelAtual} (${this.pontosRiqueza} pts)`);
                    return true;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar riqueza:', error);
        }
        
        // Valores padrão
        this.nivelAtual = "0";
        this.pontosRiqueza = 0;
        return false;
    }

    exportarDados() {
        const nivel = this.getNivelObjeto();
        
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
                recursos: nivel.recursos,
                saldoAtual: document.getElementById('saldoAtual')?.value || nivel.rendaBase
            }
        };
    }

    importarDados(dados) {
        if (dados.riqueza && dados.riqueza.nivel !== undefined) {
            this.definirNivel(dados.riqueza.nivel);
            
            // Opcional: importar saldo
            if (dados.riqueza.saldoAtual) {
                const saldoAtual = document.getElementById('saldoAtual');
                if (saldoAtual) {
                    saldoAtual.value = dados.riqueza.saldoAtual;
                }
            }
            
            return true;
        }
        return false;
    }

    resetar() {
        this.definirNivel("0");
        
        // Resetar saldo também
        const saldoAtual = document.getElementById('saldoAtual');
        if (saldoAtual) {
            saldoAtual.value = 1000;
        }
    }

    // Método para debug
    debugInfo() {
        return {
            nivelAtual: this.nivelAtual,
            pontosRiqueza: this.pontosRiqueza,
            nivelObjeto: this.getNivelObjeto(),
            tipo: this.getTipoPontos()
        };
    }
}

// Instância global
let sistemaRiqueza = null;

// Função de inicialização
function inicializarSistemaRiqueza() {
    if (!sistemaRiqueza) {
        sistemaRiqueza = new SistemaRiqueza();
    }
    
    // Verificar se os elementos DOM existem
    const select = document.getElementById('nivelRiqueza');
    if (!select) {
        console.warn('Elemento nivelRiqueza não encontrado, aguardando...');
        return null;
    }
    
    sistemaRiqueza.inicializar();
    
    return sistemaRiqueza;
}

// Função para forçar recálculo
function recalcularPontosRiqueza() {
    if (sistemaRiqueza) {
        const nivelAtual = sistemaRiqueza.getNivelAtual();
        sistemaRiqueza.definirNivel(nivelAtual);
        return true;
    }
    return false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar quando a aba principal estiver ativa
    const principalTab = document.getElementById('principal');
    if (principalTab && principalTab.classList.contains('active')) {
        setTimeout(() => {
            inicializarSistemaRiqueza();
        }, 100);
    }
});

// Evento customizado para troca de abas
document.addEventListener('tabChanged', function(e) {
    if (e.detail === 'principal') {
        setTimeout(() => {
            inicializarSistemaRiqueza();
        }, 100);
    }
});

// Evento para quando o sistema de pontos é inicializado
document.addEventListener('pontosSistemaInicializado', function() {
    if (sistemaRiqueza) {
        // Forçar atualização para sincronizar com sistema de pontos
        const nivelAtual = sistemaRiqueza.getNivelAtual();
        sistemaRiqueza.definirNivel(nivelAtual);
    }
});

// API global
window.SistemaRiqueza = SistemaRiqueza;
window.inicializarSistemaRiqueza = inicializarSistemaRiqueza;
window.sistemaRiqueza = sistemaRiqueza;
window.recalcularPontosRiqueza = recalcularPontosRiqueza;

// Funções de conveniência
window.getPontosRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getPontosRiqueza() : 0;
};

window.getNivelRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.getNivelAtual() : "0";
};

window.resetarRiqueza = function() {
    if (sistemaRiqueza) sistemaRiqueza.resetar();
};

window.exportarRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.exportarDados() : null;
};

window.importarRiqueza = function(dados) {
    return sistemaRiqueza ? sistemaRiqueza.importarDados(dados) : false;
};

// Debug
window.debugRiqueza = function() {
    return sistemaRiqueza ? sistemaRiqueza.debugInfo() : 'Sistema não inicializado';
};

// Adicionar estilos CSS para os badges
if (!document.querySelector('#estilos-riqueza')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilos-riqueza';
    estilo.textContent = `
        .pontos-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            background: #95a5a6;
            color: white;
        }
        
        .pontos-badge.positivo {
            background: #27ae60;
        }
        
        .pontos-badge.negativo {
            background: #e74c3c;
        }
        
        .wealth-display strong {
            transition: color 0.3s ease;
        }
        
        .wealth-display .total {
            font-size: 1.2em;
            font-weight: bold;
            padding: 4px 0;
        }
        
        .currency {
            color: var(--text-gold);
            font-weight: bold;
            margin-right: 4px;
        }
    `;
    document.head.appendChild(estilo);
}

// Inicialização automática quando o script carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(inicializarSistemaRiqueza, 200);
    });
} else {
    setTimeout(inicializarSistemaRiqueza, 200);
}