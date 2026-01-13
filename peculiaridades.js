// peculiaridades.js - VERSÃO FUNCIONAL
const sistemaPec = {
    normais: [],
    extras: [],
    limite: 5,
    
    init() {
        this.load();
        this.setupEventos();
        this.render();
    },
    
    setupEventos() {
        // Botão adicionar
        const btnAdd = document.getElementById('pec-btn-add');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => this.addNormal());
        }
        
        // Enter no input
        const input = document.getElementById('pec-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addNormal();
            });
        }
        
        // Botões de limpar
        const btnClear = document.getElementById('pec-btn-clear');
        if (btnClear) {
            btnClear.addEventListener('click', () => this.clearNormais());
        }
        
        const btnClearExtra = document.getElementById('pec-btn-clear-extra');
        if (btnClearExtra) {
            btnClearExtra.addEventListener('click', () => this.clearExtras());
        }
        
        // Textarea extras (salvar automaticamente)
        const textareaExtra = document.getElementById('pec-textarea-extra');
        if (textareaExtra) {
            textareaExtra.addEventListener('input', () => {
                localStorage.setItem('pec_extras_text', textareaExtra.value);
            });
        }
    },
    
    addNormal() {
        const input = document.getElementById('pec-input');
        if (!input) return;
        
        const nome = input.value.trim();
        
        if (!nome) {
            alert('Digite uma peculiaridade');
            return;
        }
        
        if (this.normais.length >= this.limite) {
            alert(`Limite de ${this.limite} peculiaridades atingido!`);
            return;
        }
        
        // Adicionar
        this.normais.push({
            id: Date.now(),
            nome: nome,
            pontos: -1
        });
        
        // Limpar input
        input.value = '';
        input.focus();
        
        // Atualizar
        this.save();
        this.render();
    },
    
    removeNormal(id) {
        this.normais = this.normais.filter(p => p.id !== id);
        this.save();
        this.render();
    },
    
    clearNormais() {
        if (this.normais.length === 0) return;
        if (!confirm(`Remover todas as ${this.normais.length} peculiaridades normais?`)) return;
        
        this.normais = [];
        this.save();
        this.render();
    },
    
    clearExtras() {
        const textarea = document.getElementById('pec-textarea-extra');
        if (!textarea) return;
        
        if (textarea.value.trim() && confirm('Limpar todas as peculiaridades extras?')) {
            textarea.value = '';
            localStorage.removeItem('pec_extras_text');
        }
    },
    
    render() {
        // Atualizar contadores
        const countEl = document.getElementById('pec-count');
        const pointsEl = document.getElementById('pec-points');
        
        if (countEl) countEl.textContent = `${this.normais.length}/${this.limite}`;
        if (pointsEl) pointsEl.textContent = `${this.normais.length * -1} pontos`;
        
        // Renderizar lista normal
        const listaNormal = document.getElementById('pec-lista-normal');
        if (listaNormal) {
            if (this.normais.length === 0) {
                listaNormal.innerHTML = '<div class="pec-empty">Nenhuma peculiaridade</div>';
            } else {
                listaNormal.innerHTML = this.normais.map(pec => `
                    <div class="pec-item">
                        <span>${pec.nome}</span>
                        <button onclick="sistemaPec.removeNormal(${pec.id})" class="pec-remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
        
        // Carregar texto das extras
        const textarea = document.getElementById('pec-textarea-extra');
        if (textarea) {
            const saved = localStorage.getItem('pec_extras_text');
            if (saved) textarea.value = saved;
        }
        
        // Habilitar/desabilitar botão
        const btnAdd = document.getElementById('pec-btn-add');
        if (btnAdd) {
            btnAdd.disabled = this.normais.length >= this.limite;
        }
    },
    
    save() {
        localStorage.setItem('pec_normais', JSON.stringify(this.normais));
    },
    
    load() {
        const saved = localStorage.getItem('pec_normais');
        if (saved) {
            try {
                this.normais = JSON.parse(saved);
            } catch (e) {
                this.normais = [];
            }
        }
    },
    
    getData() {
        return {
            normais: [...this.normais],
            totalNormais: this.normais.length,
            pontosNormais: this.normais.length * -1
        };
    }
};

// Inicializar quando a aba estiver carregada
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na aba de peculiaridades
    if (document.getElementById('aba-peculiaridades') || 
        document.getElementById('pec-input') || 
        document.getElementById('pec-btn-add')) {
        sistemaPec.init();
    }
});

// Disponibilizar globalmente
window.sistemaPec = sistemaPec;