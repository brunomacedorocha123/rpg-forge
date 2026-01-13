// peculiaridades.js - VERSÃO CORRETA PARA SEU HTML
const sistemaPec = {
    normais: [],
    limite: 5,
    
    init() {
        this.load();
        this.setupEventos();
        this.render();
    },
    
    setupEventos() {
        // Botão adicionar (ID correto: pec-adicionar-btn)
        const btnAdd = document.getElementById('pec-adicionar-btn');
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
        
        // Textarea extras
        const textareaExtra = document.getElementById('pec-extra-text');
        if (textareaExtra) {
            // Carregar texto salvo
            const saved = localStorage.getItem('pec_extras_text');
            if (saved) textareaExtra.value = saved;
            
            // Salvar automaticamente
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
            nome: nome
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
    
    render() {
        // Atualizar contadores (IDs corretos)
        const contador = document.getElementById('pec-contador');
        const pontos = document.getElementById('pec-pontos');
        
        if (contador) contador.textContent = `${this.normais.length}/${this.limite}`;
        if (pontos) pontos.textContent = `${this.normais.length * -1} pontos`;
        
        // Renderizar lista (ID correto: pec-lista)
        const lista = document.getElementById('pec-lista');
        if (lista) {
            if (this.normais.length === 0) {
                lista.innerHTML = '<div class="pec-vazio">Nenhuma peculiaridade adicionada</div>';
            } else {
                lista.innerHTML = this.normais.map(pec => `
                    <div class="pec-item">
                        <div class="pec-item-nome">${pec.nome}</div>
                        <button class="pec-item-remover" onclick="sistemaPec.removeNormal(${pec.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
        
        // Habilitar/desabilitar botão
        const btnAdd = document.getElementById('pec-adicionar-btn');
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
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    sistemaPec.init();
});

// Tornar acessível globalmente
window.sistemaPec = sistemaPec;