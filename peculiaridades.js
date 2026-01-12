// peculiaridades.js
class PeculiaridadesManager {
    constructor() {
        this.peculiaridades = [];
        this.extras = [];
        this.maxPeculiaridades = 5;
        this.pontosPorPeculiaridade = -1;
        this.elements = {};
        
        this.cacheElements();
        this.bindEvents();
        this.loadFromStorage();
        this.render();
    }
    
    cacheElements() {
        this.elements = {
            input: document.getElementById('peculiaridadeInput'),
            btnAdd: document.getElementById('btnAddPeculiaridade'),
            btnExtra: document.getElementById('btnAddPeculiaridadeExtra'),
            grid: document.getElementById('peculiaridadesGrid'),
            extrasGrid: document.getElementById('peculiaridadesExtras'),
            count: document.getElementById('peculiaridadesCount'),
            points: document.getElementById('peculiaridadesPoints'),
            pontosBadge: document.querySelector('.pontos-counter'),
            listHeader: document.querySelector('.list-header h3')
        };
    }
    
    bindEvents() {
        if (this.elements.btnAdd) {
            this.elements.btnAdd.addEventListener('click', () => this.addPeculiaridade());
        }
        
        if (this.elements.input) {
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addPeculiaridade();
            });
        }
        
        if (this.elements.btnExtra) {
            this.elements.btnExtra.addEventListener('click', () => this.addPeculiaridadeExtra());
        }
        
        window.addEventListener('beforeunload', () => this.saveToStorage());
    }
    
    addPeculiaridade() {
        if (!this.elements.input) return;
        
        const nome = this.elements.input.value.trim();
        if (!nome) {
            alert('Digite um nome para a peculiaridade');
            return;
        }
        
        if (this.peculiaridades.length >= this.maxPeculiaridades) {
            alert(`Limite de ${this.maxPeculiaridades} peculiaridades atingido!`);
            return;
        }
        
        const peculiaridade = {
            id: Date.now(),
            nome: nome,
            pontos: this.pontosPorPeculiaridade,
            tipo: 'normal'
        };
        
        this.peculiaridades.push(peculiaridade);
        this.elements.input.value = '';
        this.elements.input.focus();
        this.saveToStorage();
        this.render();
    }
    
    addPeculiaridadeExtra() {
        const nome = prompt('Nome da peculiaridade extra:');
        if (!nome || !nome.trim()) return;
        
        const peculiaridade = {
            id: Date.now(),
            nome: nome.trim(),
            pontos: this.pontosPorPeculiaridade,
            tipo: 'extra'
        };
        
        this.extras.push(peculiaridade);
        this.saveToStorage();
        this.render();
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
        this.renderList();
        this.renderExtras();
        this.updateStats();
        this.updateUI();
    }
    
    renderList() {
        if (!this.elements.grid) return;
        
        if (this.peculiaridades.length === 0) {
            this.elements.grid.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-user"></i>
                    <p>Nenhuma peculiaridade adicionada</p>
                </div>
            `;
            return;
        }
        
        this.elements.grid.innerHTML = '';
        
        this.peculiaridades.forEach(p => {
            const item = this.createItemElement(p, 'normal');
            this.elements.grid.appendChild(item);
        });
    }
    
    renderExtras() {
        if (!this.elements.extrasGrid) return;
        
        if (this.extras.length === 0) {
            this.elements.extrasGrid.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-plus"></i>
                    <p>Adicione peculiaridades extras durante o jogo</p>
                </div>
            `;
            return;
        }
        
        this.elements.extrasGrid.innerHTML = '';
        
        this.extras.forEach(p => {
            const item = this.createItemElement(p, 'extra');
            this.elements.extrasGrid.appendChild(item);
        });
    }
    
    createItemElement(peculiaridade, tipo) {
        const div = document.createElement('div');
        div.className = `peculiaridade-item ${tipo === 'extra' ? 'extra' : ''}`;
        div.innerHTML = `
            <span class="name">${peculiaridade.nome}</span>
            <span class="cost">${peculiaridade.pontos} pts</span>
            <button class="delete-btn" data-id="${peculiaridade.id}" data-tipo="${tipo}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            const id = parseFloat(e.currentTarget.dataset.id);
            const tipo = e.currentTarget.dataset.tipo;
            if (confirm('Remover esta peculiaridade?')) {
                this.removePeculiaridade(id, tipo);
            }
        });
        
        return div;
    }
    
    updateStats() {
        const totalNormais = this.peculiaridades.length;
        const totalExtras = this.extras.length;
        const totalPontos = (totalNormais + totalExtras) * this.pontosPorPeculiaridade;
        
        if (this.elements.count) {
            this.elements.count.textContent = totalNormais;
        }
        
        if (this.elements.points) {
            this.elements.points.textContent = totalPontos;
        }
        
        if (this.elements.pontosBadge) {
            this.elements.pontosBadge.textContent = `${totalPontos} pts`;
        }
        
        if (this.elements.listHeader) {
            this.elements.listHeader.innerHTML = `
                <i class="fas fa-list"></i> 
                Peculiaridades (${totalNormais}/${this.maxPeculiaridades})
            `;
        }
    }
    
    updateUI() {
        if (!this.elements.input || !this.elements.btnAdd) return;
        
        const atLimit = this.peculiaridades.length >= this.maxPeculiaridades;
        
        this.elements.btnAdd.disabled = atLimit;
        this.elements.btnAdd.style.opacity = atLimit ? '0.5' : '1';
        this.elements.btnAdd.style.cursor = atLimit ? 'not-allowed' : 'pointer';
        
        if (atLimit) {
            this.elements.input.placeholder = 'Limite atingido! Use "Extra"';
            this.elements.grid?.classList.add('limit-warning');
        } else {
            this.elements.input.placeholder = 'Nome da peculiaridade...';
            this.elements.grid?.classList.remove('limit-warning');
        }
    }
    
    saveToStorage() {
        const data = {
            peculiaridades: this.peculiaridades,
            extras: this.extras
        };
        localStorage.setItem('peculiaridades', JSON.stringify(data));
    }
    
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('peculiaridades'));
            if (data) {
                this.peculiaridades = data.peculiaridades || [];
                this.extras = data.extras || [];
            }
        } catch (e) {
            // Ignora erro
        }
    }
}

let peculiaridadesManager = null;

function initPeculiaridades() {
    if (peculiaridadesManager) return peculiaridadesManager;
    
    const tab = document.getElementById('subtab-peculiaridades');
    if (!tab) return null;
    
    if (!document.getElementById('peculiaridadeInput')) return null;
    
    peculiaridadesManager = new PeculiaridadesManager();
    return peculiaridadesManager;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('subtab-peculiaridades')) {
        setTimeout(initPeculiaridades, 100);
    }
});

window.peculiaridadesManager = peculiaridadesManager;