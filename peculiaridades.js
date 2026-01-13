// peculiaridades.js - Sistema SIMPLIFICADO
const sistemaPec = {
    // Dados
    normais: [],      // Máximo 5, cada -1 ponto
    extras: [],       // Ilimitado, sem custo
    limite: 5,
    
    // Inicialização
    init() {
        this.load();
        this.setupEventos();
        this.render();
    },
    
    // Eventos
    setupEventos() {
        // Adicionar peculiaridade normal
        document.getElementById('pec-btn-add')?.addEventListener('click', () => this.addNormal());
        
        // Enter no input
        document.getElementById('pec-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNormal();
        });
        
        // Limpar listas
        document.getElementById('pec-btn-clear')?.addEventListener('click', () => this.clearNormais());
        document.getElementById('pec-btn-clear-extra')?.addEventListener('click', () => this.clearExtras());
        
        // Salvar extras automaticamente
        document.getElementById('pec-textarea-extra')?.addEventListener('input', (e) => {
            localStorage.setItem('pec_extras_text', e.target.value);
        });
    },
    
    // Adicionar peculiaridade normal
    addNormal() {
        const input = document.getElementById('pec-input');
        const nome = input?.value.trim();
        
        if (!nome) {
            this.showAlert('Digite uma peculiaridade', 'error');
            return;
        }
        
        if (this.normais.length >= this.limite) {
            this.showAlert(`Limite de ${this.limite} peculiaridades atingido!`, 'error');
            return;
        }
        
        // Adicionar
        this.normais.push({
            id: Date.now(),
            nome: nome,
            pontos: -1
        });
        
        // Limpar input
        if (input) input.value = '';
        
        // Atualizar
        this.save();
        this.render();
        this.showAlert('Peculiaridade adicionada!', 'success');
    },
    
    // Remover peculiaridade normal
    removeNormal(id) {
        this.normais = this.normais.filter(p => p.id !== id);
        this.save();
        this.render();
    },
    
    // Limpar normais
    clearNormais() {
        if (this.normais.length === 0) return;
        if (!confirm(`Remover todas as ${this.normais.length} peculiaridades normais?`)) return;
        
        this.normais = [];
        this.save();
        this.render();
        this.showAlert('Peculiaridades normais removidas', 'info');
    },
    
    // Limpar extras
    clearExtras() {
        const textarea = document.getElementById('pec-textarea-extra');
        if (textarea && textarea.value.trim()) {
            if (!confirm('Limpar todas as peculiaridades extras?')) return;
            textarea.value = '';
            localStorage.removeItem('pec_extras_text');
            this.showAlert('Peculiaridades extras removidas', 'info');
        }
    },
    
    // Renderizar
    render() {
        // Atualizar contadores
        document.getElementById('pec-count')?.textContent = `${this.normais.length}/${this.limite}`;
        document.getElementById('pec-points')?.textContent = `${this.normais.length * -1} pontos`;
        
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
    },
    
    // Persistência
    save() {
        localStorage.setItem('pec_normais', JSON.stringify(this.normais));
    },
    
    load() {
        const saved = localStorage.getItem('pec_normais');
        if (saved) this.normais = JSON.parse(saved);
    },
    
    // Utilitários
    showAlert(msg, type = 'info') {
        console.log(`[PEC] ${type.toUpperCase()}: ${msg}`);
        // Você pode implementar notificações visuais se quiser
    },
    
    // Exportar dados para sistema principal
    getData() {
        return {
            normais: [...this.normais],
            totalNormais: this.normais.length,
            pontosNormais: this.normais.length * -1
        };
    }
};

// Inicializar quando a aba for carregada
document.addEventListener('DOMContentLoaded', () => {
    const abaPec = document.getElementById('aba-peculiaridades');
    if (abaPec) {
        sistemaPec.init();
    }
});

// Disponibilizar globalmente
window.sistemaPec = sistemaPec;