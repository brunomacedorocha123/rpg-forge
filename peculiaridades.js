/* ============================================
   PECULIARIDADES.JS - VERSÃO 100% CORRETA
   FUNCIONA COM ID: subtab-peculiaridades
============================================ */

const sistemaPec = {
    normais: [],
    limite: 5,
    inicializado: false,
    
    // ============================================
    // INICIALIZAÇÃO SEGURA
    // ============================================
    init() {
        // CORREÇÃO: Usar o ID CORRETO subtab-peculiaridades
        const subAbaPec = document.getElementById('subtab-peculiaridades');
        const container = document.getElementById('pec-lista');
        
        // Se não encontrou, não inicializa
        if (!subAbaPec || !container) {
            console.log('Peculiaridades: Elementos não encontrados, ignorando...');
            return false;
        }
        
        // Se já foi inicializado, apenas renderiza
        if (this.inicializado) {
            console.log('Peculiaridades: Já inicializado, atualizando...');
            this.render();
            return false;
        }
        
        console.log('Peculiaridades: Inicializando sistema...');
        
        // Carregar dados
        this.load();
        
        // Configurar eventos
        this.setupEventos();
        
        // Renderizar
        this.render();
        
        // Marcar como inicializado
        this.inicializado = true;
        
        return true;
    },
    
    // ============================================
    // CONFIGURAÇÃO DE EVENTOS
    // ============================================
    setupEventos() {
        // 1. Botão adicionar
        const btnAdd = document.getElementById('pec-adicionar-btn');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                this.addNormal();
            });
        }
        
        // 2. Input (tecla Enter)
        const input = document.getElementById('pec-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addNormal();
                }
            });
        }
        
        // 3. Textarea de peculiaridades extras
        const textareaExtra = document.getElementById('pec-extra-text');
        if (textareaExtra) {
            // Carregar texto salvo
            const saved = localStorage.getItem('pec_extras_text');
            if (saved) {
                textareaExtra.value = saved;
            }
            
            // Salvar automaticamente ao digitar
            textareaExtra.addEventListener('input', () => {
                localStorage.setItem('pec_extras_text', textareaExtra.value);
            });
        }
    },
    
    // ============================================
    // ADICIONAR PECULIARIDADE NORMAL
    // ============================================
    addNormal() {
        const input = document.getElementById('pec-input');
        if (!input) return;
        
        const nome = input.value.trim();
        
        // Validações
        if (!nome) {
            this.showMessage('Digite uma peculiaridade', 'warning');
            return;
        }
        
        if (nome.length < 3) {
            this.showMessage('Mínimo 3 caracteres', 'warning');
            return;
        }
        
        if (this.normais.length >= this.limite) {
            this.showMessage(`Limite de ${this.limite} peculiaridades atingido!`, 'error');
            return;
        }
        
        // Verificar duplicata
        if (this.normais.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
            this.showMessage('Esta peculiaridade já foi adicionada', 'warning');
            return;
        }
        
        // Adicionar ao array
        this.normais.push({
            id: Date.now(),
            nome: nome,
            data: new Date().toLocaleDateString('pt-BR')
        });
        
        // Limpar input
        input.value = '';
        input.focus();
        
        // Feedback visual
        this.showMessage('Peculiaridade adicionada! -1 ponto', 'success');
        
        // Atualizar interface
        this.save();
        this.render();
        
        // Atualizar pontos totais no sistema principal
        this.atualizarPontosSistema();
    },
    
    // ============================================
    // REMOVER PECULIARIDADE
    // ============================================
    removeNormal(id) {
        // Encontrar índice
        const index = this.normais.findIndex(p => p.id === id);
        if (index === -1) return;
        
        // Remover
        const removida = this.normais.splice(index, 1)[0];
        
        // Feedback
        this.showMessage(`"${removida.nome}" removida`, 'info');
        
        // Atualizar
        this.save();
        this.render();
        
        // Atualizar pontos totais no sistema principal
        this.atualizarPontosSistema();
    },
    
    // ============================================
    // RENDERIZAR INTERFACE
    // ============================================
    render() {
        // 1. Atualizar contadores
        const contador = document.getElementById('pec-contador');
        const pontos = document.getElementById('pec-pontos');
        
        if (contador) {
            contador.textContent = `${this.normais.length}/${this.limite}`;
            // Mudar cor se estiver perto do limite
            if (this.normais.length >= this.limite) {
                contador.className = 'limite-maximo';
            } else if (this.normais.length >= this.limite - 1) {
                contador.className = 'limite-proximo';
            } else {
                contador.className = 'limite-normal';
            }
        }
        
        if (pontos) {
            const totalPontos = this.normais.length * -1;
            pontos.textContent = `${totalPontos} ponto${totalPontos !== -1 ? 's' : ''}`;
            pontos.style.color = totalPontos < 0 ? '#ef4444' : '#10b981';
        }
        
        // 2. Renderizar lista
        const lista = document.getElementById('pec-lista');
        if (lista) {
            if (this.normais.length === 0) {
                lista.innerHTML = `
                    <div class="pec-vazio">
                        Nenhuma peculiaridade adicionada
                    </div>
                `;
            } else {
                lista.innerHTML = this.normais.map(pec => `
                    <div class="pec-item" data-id="${pec.id}">
                        <div class="pec-item-nome">
                            <strong>${pec.nome}</strong>
                            <small>Adicionada em: ${pec.data}</small>
                        </div>
                        <button class="pec-item-remover" onclick="sistemaPec.removeNormal(${pec.id})" 
                                title="Remover peculiaridade">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
        
        // 3. Atualizar estado do botão
        const btnAdd = document.getElementById('pec-adicionar-btn');
        if (btnAdd) {
            btnAdd.disabled = this.normais.length >= this.limite;
            btnAdd.innerHTML = this.normais.length >= this.limite 
                ? '<i class="fas fa-ban"></i> Limite atingido' 
                : '<i class="fas fa-plus"></i> Adicionar (-1 ponto)';
        }
    },
    
    // ============================================
    // ATUALIZAR PONTOS NO SISTEMA PRINCIPAL
    // ============================================
    atualizarPontosSistema() {
        const totalPec = this.normais.length * -1;
        
        // Atualizar na aba principal de pontos
        const pontosPecElem = document.getElementById('pontosPeculiaridades');
        if (pontosPecElem) {
            pontosPecElem.textContent = totalPec;
        }
        
        // Atualizar no resumo da aba vantagens
        const totalDesvElem = document.getElementById('totalDesvantagensPontos');
        if (totalDesvElem) {
            // Recalcular totais incluindo peculiaridades
            // (Você pode ajustar isso conforme sua lógica)
        }
        
        // Disparar evento para atualizar pontos totais
        window.dispatchEvent(new CustomEvent('peculiaridadesAtualizadas', {
            detail: { pontos: totalPec, quantidade: this.normais.length }
        }));
    },
    
    // ============================================
    // MENSAGENS DE FEEDBACK
    // ============================================
    showMessage(text, type = 'info') {
        // Cores por tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        // Criar mensagem temporária
        const message = document.createElement('div');
        message.className = 'pec-mensagem-flutuante';
        message.textContent = text;
        message.style.background = colors[type] || colors.info;
        
        // Adicionar ao corpo
        document.body.appendChild(message);
        
        // Remover após 3 segundos
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 3000);
    },
    
    // ============================================
    // SALVAR DADOS
    // ============================================
    save() {
        try {
            localStorage.setItem('pec_normais', JSON.stringify(this.normais));
            return true;
        } catch (e) {
            console.error('Erro ao salvar peculiaridades:', e);
            this.showMessage('Erro ao salvar dados', 'error');
            return false;
        }
    },
    
    // ============================================
    // CARREGAR DADOS
    // ============================================
    load() {
        try {
            const saved = localStorage.getItem('pec_normais');
            if (saved) {
                this.normais = JSON.parse(saved);
                // Garantir que cada item tenha um ID
                this.normais = this.normais.map(p => ({
                    ...p,
                    id: p.id || Date.now() + Math.random()
                }));
                console.log(`Peculiaridades: ${this.normais.length} carregadas`);
            }
        } catch (e) {
            console.error('Erro ao carregar peculiaridades:', e);
            this.normais = [];
        }
    },
    
    // ============================================
    // LIMPAR DADOS
    // ============================================
    limparTudo() {
        if (confirm('Tem certeza que deseja limpar TODAS as peculiaridades?')) {
            this.normais = [];
            localStorage.removeItem('pec_normais');
            localStorage.removeItem('pec_extras_text');
            
            const textarea = document.getElementById('pec-extra-text');
            if (textarea) textarea.value = '';
            
            this.render();
            this.atualizarPontosSistema();
            this.showMessage('Todas as peculiaridades foram limpas', 'info');
        }
    },
    
    // ============================================
    // UTILITÁRIOS
    // ============================================
    getPontosTotais() {
        return this.normais.length * -1;
    },
    
    getResumo() {
        return {
            normais: this.normais.length,
            limite: this.limite,
            pontos: this.getPontosTotais(),
            lista: this.normais.map(p => p.nome)
        };
    }
};

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Inicializar quando a sub-aba for ativada
function inicializarQuandoAtiva() {
    // Observar quando a sub-aba de peculiaridades for ativada
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const subAba = document.getElementById('subtab-peculiaridades');
                if (subAba && subAba.classList.contains('active')) {
                    // A sub-aba está ativa, inicializar o sistema
                    if (!sistemaPec.inicializado) {
                        sistemaPec.init();
                    } else {
                        sistemaPec.render();
                    }
                }
            }
        });
    });
    
    // Observar a sub-aba de peculiaridades
    const subAbaPec = document.getElementById('subtab-peculiaridades');
    if (subAbaPec) {
        observer.observe(subAbaPec, { attributes: true });
        
        // Se já estiver ativa, inicializar agora
        if (subAbaPec.classList.contains('active') && !sistemaPec.inicializado) {
            sistemaPec.init();
        }
    }
}

// ============================================
// INICIALIZAÇÃO QUANDO O DOM ESTÁ PRONTO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando peculiaridades...');
    
    // Verificar se a sub-aba existe
    if (document.getElementById('subtab-peculiaridades')) {
        // Configurar inicialização automática
        inicializarQuandoAtiva();
        
        // Adicionar evento para quando clicar no botão da sub-aba
        const btnPeculiaridades = document.querySelector('.sub-tab[data-subtab="peculiaridades"]');
        if (btnPeculiaridades) {
            btnPeculiaridades.addEventListener('click', function() {
                // Pequeno delay para garantir que a sub-aba está visível
                setTimeout(() => {
                    if (!sistemaPec.inicializado) {
                        sistemaPec.init();
                    } else {
                        sistemaPec.render();
                    }
                }, 100);
            });
        }
    }
});

// ============================================
// INICIALIZAÇÃO COMPLETA DA PÁGINA
// ============================================

window.addEventListener('load', function() {
    console.log('Página carregada, finalizando peculiaridades...');
    
    // Verificar novamente após tudo carregado
    if (document.getElementById('subtab-peculiaridades') && !sistemaPec.inicializado) {
        const subAba = document.getElementById('subtab-peculiaridades');
        if (subAba.classList.contains('active')) {
            sistemaPec.init();
        }
    }
});

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

// Tornar o sistema disponível globalmente
window.sistemaPec = sistemaPec;

// Método para forçar inicialização (se necessário)
window.inicializarPeculiaridadesForcado = function() {
    return sistemaPec.init();
};

console.log('Sistema de Peculiaridades carregado!');

// ============================================
// ADICIONAR ESTILOS DE ANIMAÇÃO (se necessário)
// ============================================

if (!document.querySelector('#pec-animations')) {
    const style = document.createElement('style');
    style.id = 'pec-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .pec-mensagem-flutuante {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}