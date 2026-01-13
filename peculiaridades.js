/* ============================================
   PECULIARIDADES.JS - VERSÃO 100% ISOLADA
   SÓ FUNCIONA NA ABA DE PECULIARIDADES
   NÃO INTERFERE EM OUTRAS PÁGINAS/ABAS
============================================ */

const sistemaPec = {
    normais: [],
    limite: 5,
    inicializado: false,
    
    // ============================================
    // INICIALIZAÇÃO SEGURA
    // ============================================
    init() {
        // VERIFICAÇÃO DUPLA DE SEGURANÇA
        const abaPec = document.getElementById('aba-peculiaridades');
        const container = document.getElementById('pec-lista');
        
        // Se não encontrou os elementos principais, NÃO inicializa
        if (!abaPec || !container) {
            console.log('Peculiaridades: Elementos não encontrados, ignorando...');
            return false;
        }
        
        // Se já foi inicializado, não faz nada
        if (this.inicializado) {
            console.log('Peculiaridades: Já inicializado, ignorando...');
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
            // Remover event listeners antigos (se houver)
            const novoBtn = btnAdd.cloneNode(true);
            btnAdd.parentNode.replaceChild(novoBtn, btnAdd);
            
            // Adicionar novo listener
            document.getElementById('pec-adicionar-btn').addEventListener('click', () => {
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
            
            // Focar no input ao iniciar
            setTimeout(() => {
                input.focus();
            }, 100);
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
            
            // Salvar também quando perder o foco
            textareaExtra.addEventListener('blur', () => {
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
                contador.style.backgroundColor = '#ef4444';
            } else if (this.normais.length >= this.limite - 1) {
                contador.style.backgroundColor = '#f59e0b';
            } else {
                contador.style.backgroundColor = '#4f46e5';
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
                        <i class="fas fa-info-circle"></i>
                        <p>Nenhuma peculiaridade adicionada</p>
                        <small>Adicione até ${this.limite} peculiaridades (-1 ponto cada)</small>
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
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
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
    // LIMPAR DADOS (PARA DEBUG)
    // ============================================
    limparTudo() {
        if (confirm('Tem certeza que deseja limpar TODAS as peculiaridades?')) {
            this.normais = [];
            localStorage.removeItem('pec_normais');
            localStorage.removeItem('pec_extras_text');
            
            const textarea = document.getElementById('pec-extra-text');
            if (textarea) textarea.value = '';
            
            this.render();
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
// INICIALIZAÇÃO INTELIGENTE
// ============================================

// Adicionar estilos de animação para mensagens
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
    `;
    document.head.appendChild(style);
}

// Função para verificar se deve inicializar
function verificarEAbrirPeculiaridades() {
    // Esperar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        // Verificar SEQUENCIALMENTE se deve inicializar
        
        // 1. Verificar se estamos na página/aba correta
        const abaPec = document.getElementById('aba-peculiaridades');
        if (!abaPec) {
            console.log('Peculiaridades: Aba não encontrada, não inicializando.');
            return;
        }
        
        // 2. Verificar se está ativa (se for um sistema de tabs)
        if (abaPec.classList && !abaPec.classList.contains('active')) {
            console.log('Peculiaridades: Aba não está ativa, não inicializando.');
            // Mas vamos inicializar de qualquer forma, porque pode ser uma página separada
        }
        
        // 3. Verificar se os elementos principais existem
        const elementosNecessarios = [
            'pec-lista',
            'pec-input',
            'pec-adicionar-btn'
        ];
        
        const todosExistem = elementosNecessarios.every(id => document.getElementById(id));
        
        if (!todosExistem) {
            console.log('Peculiaridades: Elementos necessários não encontrados, não inicializando.');
            return;
        }
        
        // 4. Tudo ok, pode inicializar
        console.log('Peculiaridades: Tudo ok, inicializando...');
        sistemaPec.init();
        
    }, 150); // Delay para garantir estabilidade
}

// ============================================
// INICIALIZAÇÃO FINAL
// ============================================

// Opção 1: Se for uma página única de peculiaridades
if (document.getElementById('aba-peculiaridades')) {
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verificarEAbrirPeculiaridades);
    } else {
        // DOM já está pronto
        verificarEAbrirPeculiaridades();
    }
}

// Opção 2: Se for parte de um sistema de abas
window.addEventListener('load', verificarEAbrirPeculiaridades);

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

// Tornar disponível globalmente
window.sistemaPec = sistemaPec;
window.verificarEAbrirPeculiaridades = verificarEAbrirPeculiaridades;

// Se você tem botões que abrem a aba de peculiaridades, adicione:
// document.querySelector('.tab-peculiaridades').addEventListener('click', verificarEAbrirPeculiaridades);

console.log('Sistema de Peculiaridades carregado com segurança');

// ============================================
// MÉTODO DE EMERGÊNCIA: Forçar inicialização
// ============================================

// Se precisar forçar a inicialização manualmente:
window.inicializarPeculiaridades = function() {
    console.log('Forçando inicialização de peculiaridades...');
    return sistemaPec.init();
};