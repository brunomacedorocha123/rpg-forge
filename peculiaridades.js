/* ============================================
   PECULIARIDADES.JS - VERSÃO 100% ISOLADA E FUNCIONAL
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
            console.log('Peculiaridades: Já inicializado, atualizando apenas...');
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
// FUNÇÕES PARA CONTROLAR A ABA
// ============================================

// Função para ABRIR a aba de peculiaridades
function abrirAbaPeculiaridades() {
    console.log('Abrindo aba de peculiaridades...');
    
    const abaPec = document.getElementById('aba-peculiaridades');
    if (!abaPec) {
        console.error('Aba de peculiaridades não encontrada!');
        return false;
    }
    
    // 1. Mostrar a aba
    abaPec.style.display = 'block';
    abaPec.classList.add('active');
    
    // 2. Inicializar o sistema se necessário
    if (!sistemaPec.inicializado) {
        console.log('Inicializando sistema pela primeira vez...');
        sistemaPec.init();
    } else {
        console.log('Sistema já inicializado, apenas atualizando...');
        sistemaPec.render();
    }
    
    // 3. Focar no input
    setTimeout(() => {
        const input = document.getElementById('pec-input');
        if (input) {
            input.focus();
        }
    }, 100);
    
    return true;
}

// Função para FECHAR a aba de peculiaridades
function fecharAbaPeculiaridades() {
    const abaPec = document.getElementById('aba-peculiaridades');
    if (abaPec) {
        abaPec.style.display = 'none';
        abaPec.classList.remove('active');
    }
}

// Função para ALTERNAR (abrir/fechar) a aba
function toggleAbaPeculiaridades() {
    const abaPec = document.getElementById('aba-peculiaridades');
    if (abaPec && abaPec.style.display !== 'block') {
        abrirAbaPeculiaridades();
    } else {
        fecharAbaPeculiaridades();
    }
}

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
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

// Função para verificar e inicializar automaticamente
function verificarEAbrirPeculiaridades() {
    console.log('Verificando se deve inicializar peculiaridades...');
    
    const abaPec = document.getElementById('aba-peculiaridades');
    if (!abaPec) {
        console.log('Aba de peculiaridades não encontrada no DOM.');
        return;
    }
    
    // Se a aba já está visível (pode ser que esteja em uma página separada)
    const estaVisivel = abaPec.style.display !== 'none' || 
                        abaPec.classList.contains('active') ||
                        window.getComputedStyle(abaPec).display !== 'none';
    
    if (estaVisivel) {
        console.log('Aba já está visível, inicializando sistema...');
        sistemaPec.init();
    } else {
        console.log('Aba não está visível, aguardando comando para abrir...');
        // Não inicializa ainda, espera que seja aberta manualmente
    }
}

// ============================================
// EVENT LISTENERS PARA BOTÕES EXTERNOS
// ============================================

// Esta função configura um botão externo para abrir a aba
function configurarBotaoAbrirPeculiaridades(seletorBotao) {
    const botao = document.querySelector(seletorBotao);
    if (botao) {
        console.log(`Configurando botão ${seletorBotao} para abrir peculiaridades`);
        botao.addEventListener('click', abrirAbaPeculiaridades);
        return true;
    }
    return false;
}

// ============================================
// INICIALIZAÇÃO QUANDO O DOM ESTÁ PRONTO
// ============================================

// Aguardar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, verificando peculiaridades...');
    
    // Verificar se a aba existe
    if (document.getElementById('aba-peculiaridades')) {
        // Inicializar verificações
        verificarEAbrirPeculiaridades();
        
        // Se houver um botão com ID específico, configurá-lo
        configurarBotaoAbrirPeculiaridades('#btn-abrir-peculiaridades');
        configurarBotaoAbrirPeculiaridades('.btn-peculiaridades');
        configurarBotaoAbrirPeculiaridades('[data-aba="peculiaridades"]');
    }
});

// Também inicializar quando a página terminar de carregar
window.addEventListener('load', function() {
    console.log('Página completamente carregada, finalizando verificação...');
    
    // Pequeno delay para garantir que tudo está carregado
    setTimeout(() => {
        if (document.getElementById('aba-peculiaridades') && !sistemaPec.inicializado) {
            // Se a aba estiver visível mas não inicializada, inicializar
            const abaPec = document.getElementById('aba-peculiaridades');
            const estaVisivel = window.getComputedStyle(abaPec).display !== 'none';
            
            if (estaVisivel) {
                sistemaPec.init();
            }
        }
    }, 500);
});

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

// Tornar todas as funções disponíveis globalmente
window.sistemaPec = sistemaPec;
window.abrirAbaPeculiaridades = abrirAbaPeculiaridades;
window.fecharAbaPeculiaridades = fecharAbaPeculiaridades;
window.toggleAbaPeculiaridades = toggleAbaPeculiaridades;
window.configurarBotaoAbrirPeculiaridades = configurarBotaoAbrirPeculiaridades;

console.log('Sistema de Peculiaridades carregado com segurança!');

// ============================================
// MÉTODO DE EMERGÊNCIA
// ============================================

// Se precisar forçar a inicialização manualmente:
window.inicializarPeculiaridadesForcado = function() {
    console.log('FORÇANDO inicialização de peculiaridades...');
    
    // Forçar a aba a aparecer
    const abaPec = document.getElementById('aba-peculiaridades');
    if (abaPec) {
        abaPec.style.display = 'block';
        abaPec.classList.add('active');
    }
    
    // Inicializar o sistema
    return sistemaPec.init();
};

// ============================================
// EXEMPLO DE USO:
// ============================================
/*
// Para usar em outra parte do seu código:
// 1. Criar um botão que abre a aba:
<button onclick="abrirAbaPeculiaridades()">Abrir Peculiaridades</button>

// 2. Ou configurar automaticamente:
<script>
    document.addEventListener('DOMContentLoaded', function() {
        configurarBotaoAbrirPeculiaridades('#meu-botao-peculiaridades');
    });
</script>
*/