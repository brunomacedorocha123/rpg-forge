// peculiaridades.js - Lógica Completa e Funcional
class PeculiaridadesManager {
    constructor() {
        this.peculiaridades = []; // Lista de peculiaridades normais (limite 5)
        this.extras = []; // Lista de peculiaridades extras (sem limite)
        this.maxPeculiaridades = 5; // Limite máximo de peculiaridades
        this.pontosPorPeculiaridade = -1; // Pontos por peculiaridade
        
        this.cacheElements();
        this.bindEvents();
        this.loadFromStorage();
        this.render();
    }
    
    cacheElements() {
        this.elements = {
            peculiaridadeInput: document.getElementById('peculiaridadeInput'),
            btnAddPeculiaridade: document.getElementById('btnAddPeculiaridade'),
            peculiaridadesGrid: document.getElementById('peculiaridadesGrid'),
            peculiaridadesExtras: document.getElementById('peculiaridadesExtras'),
            peculiaridadesCount: document.getElementById('peculiaridadesCount'),
            peculiaridadesPoints: document.getElementById('peculiaridadesPoints'),
            pontosCounter: document.querySelector('.pontos-counter'),
            listHeader: document.querySelector('.list-header h3')
        };
    }
    
    bindEvents() {
        // Adicionar peculiaridade com botão
        this.elements.btnAddPeculiaridade.addEventListener('click', () => this.addPeculiaridade());
        
        // Adicionar peculiaridade com Enter
        this.elements.peculiaridadeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addPeculiaridade();
            }
        });
        
        // Botão para adicionar extra (fora do limite)
        document.getElementById('btnAddPeculiaridadeExtra')?.addEventListener('click', () => {
            this.addPeculiaridadeExtra();
        });
        
        // Salvar quando a aba for fechada
        window.addEventListener('beforeunload', () => this.saveToStorage());
    }
    
    addPeculiaridade() {
        const nome = this.elements.peculiaridadeInput.value.trim();
        
        if (!nome) {
            this.showAlert('Digite um nome para a peculiaridade', 'warning');
            return;
        }
        
        if (this.peculiaridades.length >= this.maxPeculiaridades) {
            this.showAlert(`Limite de ${this.maxPeculiaridades} peculiaridades atingido! Adicione como "extra".`, 'error');
            return;
        }
        
        const peculiaridade = {
            id: Date.now() + Math.random(),
            nome: nome,
            pontos: this.pontosPorPeculiaridade,
            tipo: 'normal',
            dataCriacao: new Date().toISOString()
        };
        
        this.peculiaridades.push(peculiaridade);
        this.elements.peculiaridadeInput.value = '';
        this.saveToStorage();
        this.render();
        this.showAlert('Peculiaridade adicionada!', 'success');
    }
    
    addPeculiaridadeExtra(nome) {
        // Se nome não for fornecido, pedir ao usuário
        if (!nome) {
            nome = prompt('Digite o nome da peculiaridade extra:');
            if (!nome?.trim()) return;
        }
        
        const peculiaridade = {
            id: Date.now() + Math.random(),
            nome: nome.trim(),
            pontos: this.pontosPorPeculiaridade,
            tipo: 'extra',
            dataCriacao: new Date().toISOString()
        };
        
        this.extras.push(peculiaridade);
        this.saveToStorage();
        this.render();
        this.showAlert('Peculiaridade extra adicionada!', 'success');
        return peculiaridade;
    }
    
    removePeculiaridade(id, tipo) {
        if (tipo === 'normal') {
            this.peculiaridades = this.peculiaridades.filter(p => p.id !== id);
        } else {
            this.extras = this.extras.filter(p => p.id !== id);
        }
        
        this.saveToStorage();
        this.render();
    }
    
    render() {
        this.renderPeculiaridades();
        this.renderExtras();
        this.updateStats();
        this.updateUIState();
    }
    
    renderPeculiaridades() {
        const grid = this.elements.peculiaridadesGrid;
        
        if (this.peculiaridades.length === 0) {
            grid.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-user"></i>
                    <p>Nenhuma peculiaridade adicionada</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.peculiaridades.map(p => this.createItemHTML(p)).join('');
        
        // Adicionar eventos aos botões de remover
        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.removePeculiaridade(id, 'normal');
            });
        });
    }
    
    renderExtras() {
        const grid = this.elements.peculiaridadesExtras;
        
        if (this.extras.length === 0) {
            grid.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-plus"></i>
                    <p>Adicione peculiaridades extras durante o jogo</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.extras.map(p => this.createItemHTML(p, true)).join('');
        
        // Adicionar eventos aos botões de remover
        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.removePeculiaridade(id, 'extra');
            });
        });
    }
    
    createItemHTML(peculiaridade, isExtra = false) {
        return `
            <div class="peculiaridade-item ${isExtra ? 'extra' : ''}">
                <span class="name">${peculiaridade.nome}</span>
                <span class="cost">${peculiaridade.pontos} pts</span>
                <button class="delete-btn" data-id="${peculiaridade.id}" title="Remover">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    updateStats() {
        const totalPeculiaridades = this.peculiaridades.length;
        const totalExtras = this.extras.length;
        const totalPontos = (totalPeculiaridades + totalExtras) * this.pontosPorPeculiaridade;
        
        // Atualizar contadores
        this.elements.peculiaridadesCount.textContent = totalPeculiaridades;
        this.elements.peculiaridadesPoints.textContent = totalPontos;
        
        // Atualizar cabeçalho da lista
        this.elements.listHeader.innerHTML = `
            <i class="fas fa-list"></i> 
            Peculiaridades (${totalPeculiaridades}/${this.maxPeculiaridades})
        `;
        
        // Atualizar badge de pontos
        this.elements.pontosCounter.textContent = `${totalPontos} pts`;
    }
    
    updateUIState() {
        const input = this.elements.peculiaridadeInput;
        const btn = this.elements.btnAddPeculiaridade;
        
        // Desabilitar botão se atingiu o limite
        if (this.peculiaridades.length >= this.maxPeculiaridades) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            input.placeholder = 'Limite atingido! Adicione como "extra"';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            input.placeholder = 'Nome da peculiaridade...';
        }
        
        // Adicionar classe de warning se estiver perto do limite
        const grid = this.elements.peculiaridadesGrid;
        if (this.peculiaridades.length === this.maxPeculiaridades) {
            grid.classList.add('limit-warning');
            grid.classList.remove('limit-available');
        } else if (this.peculiaridades.length >= this.maxPeculiaridades - 1) {
            grid.classList.add('limit-warning');
            grid.classList.remove('limit-available');
        } else {
            grid.classList.remove('limit-warning', 'limit-available');
        }
    }
    
    // Métodos de persistência
    saveToStorage() {
        const data = {
            peculiaridades: this.peculiaridades,
            extras: this.extras,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('peculiaridadesData', JSON.stringify(data));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('peculiaridadesData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.peculiaridades = data.peculiaridades || [];
                this.extras = data.extras || [];
            } catch (e) {
                console.error('Erro ao carregar peculiaridades:', e);
            }
        }
    }
    
    clearAll() {
        if (confirm('Tem certeza que deseja remover TODAS as peculiaridades?')) {
            this.peculiaridades = [];
            this.extras = [];
            this.saveToStorage();
            this.render();
            this.showAlert('Todas as peculiaridades foram removidas!', 'info');
        }
    }
    
    exportData() {
        return {
            peculiaridades: [...this.peculiaridades],
            extras: [...this.extras],
            totalPeculiaridades: this.peculiaridades.length,
            totalExtras: this.extras.length,
            totalPontos: (this.peculiaridades.length + this.extras.length) * this.pontosPorPeculiaridade
        };
    }
    
    importData(data) {
        if (data.peculiaridades) {
            this.peculiaridades = data.peculiaridades;
        }
        if (data.extras) {
            this.extras = data.extras;
        }
        this.saveToStorage();
        this.render();
        this.showAlert('Dados importados com sucesso!', 'success');
    }
    
    // Métodos utilitários
    showAlert(message, type = 'info') {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.peculiaridade-alert');
        if (existingAlert) existingAlert.remove();
        
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        const alert = document.createElement('div');
        alert.className = 'peculiaridade-alert';
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${colors[type]};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            font-size: 14px;
        `;
        
        closeBtn.addEventListener('click', () => alert.remove());
        
        document.body.appendChild(alert);
        
        // Auto-remover após 3 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 3000);
    }
    
    // Método para adicionar peculiaridade durante teste de pânico
    addPeculiaridadePorPanico(nome, descricao = '') {
        const peculiaridade = this.addPeculiaridadeExtra(nome);
        
        if (peculiaridade && descricao) {
            peculiaridade.descricao = descricao;
            peculiaridade.origem = 'teste_panico';
            peculiaridade.dataPanico = new Date().toISOString();
        }
        
        return peculiaridade;
    }
}

// Inicialização global
let peculiaridadesManager = null;

// Inicializar quando a aba for carregada
function initPeculiaridades() {
    // Verificar se já está inicializado
    if (peculiaridadesManager) return peculiaridadesManager;
    
    // Verificar se os elementos necessários existem
    const container = document.getElementById('subtab-peculiaridades');
    if (!container) {
        console.warn('Container de peculiaridades não encontrado');
        return null;
    }
    
    // Inicializar o manager
    peculiaridadesManager = new PeculiaridadesManager();
    
    // Adicionar CSS para animações
    if (!document.querySelector('#peculiaridades-animations')) {
        const style = document.createElement('style');
        style.id = 'peculiaridades-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .peculiaridade-item {
                transition: all 0.3s ease;
            }
            
            .peculiaridade-item.removing {
                opacity: 0;
                transform: translateX(-20px);
            }
        `;
        document.head.appendChild(style);
    }
    
    return peculiaridadesManager;
}

// Exportar para uso global (se necessário)
if (typeof window !== 'undefined') {
    window.PeculiaridadesManager = PeculiaridadesManager;
    window.initPeculiaridades = initPeculiaridades;
    window.peculiaridadesManager = null;
}

// Inicializar automaticamente quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo está carregado
    setTimeout(() => {
        if (document.getElementById('subtab-peculiaridades')) {
            initPeculiaridades();
        }
    }, 100);
});