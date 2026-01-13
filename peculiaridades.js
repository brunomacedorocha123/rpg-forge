// peculiaridades.js - Sistema Completo
class PeculiaridadesSystem {
    constructor() {
        this.peculiaridades = [];
        this.extras = [];
        this.limite = 5;
        this.custos = {
            leve: -1,
            moderada: -2,
            grave: -3
        };
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadFromStorage();
        this.render();
        this.updateStats();
    }
    
    cacheElements() {
        this.elements = {
            // Formulário
            inputNome: document.getElementById('pecNome'),
            inputDesc: document.getElementById('pecDescricao'),
            selectIntensidade: document.getElementById('pecIntensidade'),
            btnCriar: document.getElementById('btnCriarPeculiaridade'),
            btnCriarExtra: document.getElementById('btnCriarExtra'),
            
            // Listas
            listaNormal: document.getElementById('listaPeculiaridades'),
            listaExtra: document.getElementById('listaPeculiaridadesExtras'),
            
            // Contadores
            contadorNormais: document.getElementById('contadorNormais'),
            contadorExtras: document.getElementById('contadorExtras'),
            totalPeculiaridades: document.getElementById('totalPeculiaridades'),
            pontosTotais: document.getElementById('pontosTotais'),
            espacoRestante: document.getElementById('espacoRestante'),
            totalPontosPeculiaridades: document.getElementById('totalPontosPeculiaridades'),
            
            // Botões
            btnExportar: document.getElementById('btnExportarPec'),
            btnLimpar: document.getElementById('btnLimparPec'),
            btnAdicionarExtra: document.getElementById('btnAdicionarExtra'),
            
            // Modal Extra
            modalExtra: document.getElementById('modalExtra'),
            inputExtraNome: document.getElementById('inputExtraNome'),
            inputExtraDesc: document.getElementById('inputExtraDesc'),
            selectExtraMotivo: document.getElementById('selectExtraMotivo'),
            btnCancelarExtra: document.getElementById('btnCancelarExtra'),
            btnConfirmarExtra: document.getElementById('btnConfirmarExtra')
        };
    }
    
    bindEvents() {
        // Botão criar peculiaridade normal
        this.elements.btnCriar.addEventListener('click', () => this.criarPeculiaridade('normal'));
        
        // Botão criar como extra
        this.elements.btnCriarExtra.addEventListener('click', () => this.criarPeculiaridade('extra'));
        
        // Botão adicionar extra rápido
        this.elements.btnAdicionarExtra.addEventListener('click', () => this.abrirModalExtra());
        
        // Modal extra
        this.elements.btnCancelarExtra.addEventListener('click', () => this.fecharModalExtra());
        this.elements.btnConfirmarExtra.addEventListener('click', () => this.criarPeculiaridadeExtra());
        
        // Exportar
        this.elements.btnExportar.addEventListener('click', () => this.exportarDados());
        
        // Limpar tudo
        this.elements.btnLimpar.addEventListener('click', () => this.limparTudo());
        
        // Sugestões
        document.querySelectorAll('.btn-sugestao').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.sugestao-item');
                const nome = item.dataset.nome;
                const desc = item.dataset.desc;
                this.usarSugestao(nome, desc);
            });
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modalExtra.style.display === 'flex') {
                this.fecharModalExtra();
            }
        });
    }
    
    criarPeculiaridade(tipo = 'normal') {
        const nome = this.elements.inputNome.value.trim();
        const desc = this.elements.inputDesc.value.trim();
        const intensidade = this.elements.selectIntensidade.value;
        
        if (!nome) {
            this.mostrarAlerta('Digite um nome para a peculiaridade', 'error');
            return;
        }
        
        // Verificar limite para normais
        if (tipo === 'normal' && this.peculiaridades.length >= this.limite) {
            this.mostrarAlerta(`Limite de ${this.limite} peculiaridades atingido! Use "Criar como Extra".`, 'error');
            return;
        }
        
        const peculiaridade = {
            id: Date.now(),
            nome: nome,
            descricao: desc,
            intensidade: intensidade,
            pontos: this.custos[intensidade],
            tipo: tipo,
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        
        if (tipo === 'normal') {
            this.peculiaridades.push(peculiaridade);
        } else {
            peculiaridade.motivo = 'Criação manual';
            this.extras.push(peculiaridade);
        }
        
        // Limpar formulário
        this.elements.inputNome.value = '';
        this.elements.inputDesc.value = '';
        this.elements.selectIntensidade.value = 'leve';
        
        // Salvar e renderizar
        this.salvar();
        this.render();
        this.updateStats();
        
        this.mostrarAlerta(`Peculiaridade "${nome}" criada com sucesso!`, 'success');
    }
    
    criarPeculiaridadeExtra() {
        const nome = this.elements.inputExtraNome.value.trim();
        const desc = this.elements.inputExtraDesc.value.trim();
        const motivo = this.elements.selectExtraMotivo.value;
        
        if (!nome) {
            this.mostrarAlerta('Digite um nome para a peculiaridade extra', 'error');
            return;
        }
        
        const peculiaridade = {
            id: Date.now(),
            nome: nome,
            descricao: desc,
            intensidade: 'leve',
            pontos: -1,
            tipo: 'extra',
            motivo: this.getMotivoTexto(motivo),
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        
        this.extras.push(peculiaridade);
        
        // Limpar e fechar modal
        this.elements.inputExtraNome.value = '';
        this.elements.inputExtraDesc.value = '';
        this.elements.selectExtraMotivo.value = 'panico';
        this.fecharModalExtra();
        
        // Salvar e renderizar
        this.salvar();
        this.render();
        this.updateStats();
        
        this.mostrarAlerta(`Peculiaridade extra "${nome}" adicionada!`, 'success');
    }
    
    getMotivoTexto(codigo) {
        const motivos = {
            panico: 'Teste de Pânico Falhado',
            trauma: 'Trauma',
            evento: 'Evento Especial',
            outro: 'Outro'
        };
        return motivos[codigo] || 'Desconhecido';
    }
    
    abrirModalExtra() {
        this.elements.modalExtra.style.display = 'flex';
        this.elements.inputExtraNome.focus();
    }
    
    fecharModalExtra() {
        this.elements.modalExtra.style.display = 'none';
    }
    
    removerPeculiaridade(id, tipo) {
        if (!confirm('Tem certeza que deseja remover esta peculiaridade?')) return;
        
        if (tipo === 'normal') {
            this.peculiaridades = this.peculiaridades.filter(p => p.id !== id);
        } else {
            this.extras = this.extras.filter(p => p.id !== id);
        }
        
        this.salvar();
        this.render();
        this.updateStats();
        
        this.mostrarAlerta('Peculiaridade removida!', 'info');
    }
    
    usarSugestao(nome, desc) {
        this.elements.inputNome.value = nome;
        this.elements.inputDesc.value = desc;
        this.elements.inputNome.focus();
        
        this.mostrarAlerta(`Sugestão "${nome}" carregada no formulário!`, 'info');
    }
    
    render() {
        this.renderLista(this.elements.listaNormal, this.peculiaridades, 'normal');
        this.renderLista(this.elements.listaExtra, this.extras, 'extra');
    }
    
    renderLista(container, lista, tipo) {
        if (lista.length === 0) {
            container.innerHTML = `
                <div class="lista-vazia">
                    <i class="fas fa-${tipo === 'normal' ? 'user-slash' : 'plus-square'}"></i>
                    <p>${tipo === 'normal' ? 'Nenhuma peculiaridade adicionada' : 'Nenhuma peculiaridade extra'}</p>
                    <small>${tipo === 'normal' ? 'Comece criando sua primeira peculiaridade' : 'Adicione extras durante o jogo'}</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        lista.forEach(pec => {
            const intensidadeTexto = {
                leve: 'Leve',
                moderada: 'Moderada',
                grave: 'Grave'
            }[pec.intensidade] || 'Leve';
            
            html += `
                <div class="peculiaridade-item" data-id="${pec.id}">
                    <div class="item-info">
                        <div class="item-nome">
                            ${pec.nome}
                            ${pec.tipo === 'extra' ? '<span class="badge-extra">Extra</span>' : ''}
                        </div>
                        ${pec.descricao ? `<div class="item-desc">${pec.descricao}</div>` : ''}
                        <div class="item-meta">
                            <span><i class="fas fa-chart-line"></i> ${intensidadeTexto}</span>
                            ${pec.motivo ? `<span><i class="fas fa-exclamation-circle"></i> ${pec.motivo}</span>` : ''}
                            <span><i class="fas fa-calendar"></i> ${new Date(pec.dataCriacao).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="item-acoes">
                        <div class="item-pontos">${pec.pontos} pts</div>
                        <button class="btn-remover" onclick="pecSystem.removerPeculiaridade(${pec.id}, '${pec.tipo}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateStats() {
        const totalNormais = this.peculiaridades.length;
        const totalExtras = this.extras.length;
        const totalGeral = totalNormais + totalExtras;
        
        // Calcular pontos totais
        const pontosNormais = this.peculiaridades.reduce((sum, p) => sum + p.pontos, 0);
        const pontosExtras = this.extras.reduce((sum, p) => sum + p.pontos, 0);
        const pontosTotais = pontosNormais + pontosExtras;
        
        // Atualizar contadores
        this.elements.contadorNormais.textContent = `${totalNormais}/${this.limite}`;
        this.elements.contadorExtras.textContent = totalExtras;
        this.elements.totalPeculiaridades.textContent = totalNormais;
        this.elements.pontosTotais.textContent = pontosTotais;
        this.elements.espacoRestante.textContent = Math.max(0, this.limite - totalNormais);
        this.elements.totalPontosPeculiaridades.textContent = pontosTotais;
        
        // Atualizar cores dos contadores
        if (totalNormais >= this.limite) {
            this.elements.contadorNormais.style.background = 'var(--accent-danger)';
        } else if (totalNormais >= this.limite - 2) {
            this.elements.contadorNormais.style.background = 'var(--accent-warning)';
        } else {
            this.elements.contadorNormais.style.background = 'var(--accent-primary)';
        }
    }
    
    mostrarAlerta(mensagem, tipo) {
        // Remove alerta anterior se existir
        const alertaAnterior = document.querySelector('.peculiaridade-alerta');
        if (alertaAnterior) alertaAnterior.remove();
        
        const cores = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        const alerta = document.createElement('div');
        alerta.className = 'peculiaridade-alerta';
        alerta.innerHTML = `
            <div class="alerta-conteudo">
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cores[tipo]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
        `;
        
        document.body.appendChild(alerta);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alerta.remove(), 300);
            }
        }, 3000);
    }
    
    exportarDados() {
        const dados = {
            peculiaridades: this.peculiaridades,
            extras: this.extras,
            metadata: {
                exportadoEm: new Date().toISOString(),
                totalNormais: this.peculiaridades.length,
                totalExtras: this.extras.length,
                pontosTotais: this.peculiaridades.reduce((s, p) => s + p.pontos, 0) + this.extras.reduce((s, p) => s + p.pontos, 0)
            }
        };
        
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peculiaridades_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.mostrarAlerta('Dados exportados com sucesso!', 'success');
    }
    
    limparTudo() {
        if (!confirm('TEM CERTEZA? Isso removerá TODAS as peculiaridades normais e extras. Esta ação não pode ser desfeita.')) return;
        
        this.peculiaridades = [];
        this.extras = [];
        this.salvar();
        this.render();
        this.updateStats();
        
        this.mostrarAlerta('Todas as peculiaridades foram removidas!', 'info');
    }
    
    salvar() {
        const dados = {
            peculiaridades: this.peculiaridades,
            extras: this.extras,
            timestamp: Date.now()
        };
        localStorage.setItem('peculiaridades_system', JSON.stringify(dados));
    }
    
    loadFromStorage() {
        try {
            const dados = JSON.parse(localStorage.getItem('peculiaridades_system'));
            if (dados) {
                this.peculiaridades = dados.peculiaridades || [];
                this.extras = dados.extras || [];
            }
        } catch (e) {
            console.error('Erro ao carregar peculiaridades:', e);
        }
    }
    
    // Método para adicionar por pânico (chamado por outros sistemas)
    adicionarPorPanico(nome, motivo = 'Teste de Pânico Falhado', intensidade = 'leve') {
        const peculiaridade = {
            id: Date.now(),
            nome: nome,
            descricao: `Adquirida após ${motivo.toLowerCase()}`,
            intensidade: intensidade,
            pontos: this.custos[intensidade],
            tipo: 'extra',
            motivo: motivo,
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
            origem: 'panico'
        };
        
        this.extras.push(peculiaridade);
        this.salvar();
        this.render();
        this.updateStats();
        
        this.mostrarAlerta(`Peculiaridade extra "${nome}" adicionada por ${motivo}!`, 'warning');
        
        return peculiaridade;
    }
    
    // Método para obter dados para o sistema principal
    getDados() {
        return {
            peculiaridades: [...this.peculiaridades],
            extras: [...this.extras],
            totalPontos: this.peculiaridades.reduce((s, p) => s + p.pontos, 0) + this.extras.reduce((s, p) => s + p.pontos, 0),
            totalNormais: this.peculiaridades.length,
            totalExtras: this.extras.length
        };
    }
}

// Inicialização global
let pecSystem = null;

// Inicializar quando a aba for carregada
function initPeculiaridadesSystem() {
    const tab = document.getElementById('subtab-peculiaridades');
    if (!tab) return null;
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        pecSystem = new PeculiaridadesSystem();
        window.pecSystem = pecSystem; // Para acesso global
        
        // Adicionar animações CSS
        if (!document.querySelector('#pec-animations')) {
            const style = document.createElement('style');
            style.id = 'pec-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Sistema de Peculiaridades inicializado!');
    }, 100);
    
    return pecSystem;
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPeculiaridadesSystem);
} else {
    initPeculiaridadesSystem();
}

// Exportar para uso global
window.PeculiaridadesSystem = PeculiaridadesSystem;
window.initPeculiaridades = initPeculiaridadesSystem;
window.adicionarPeculiaridadePorPanico = function(nome, motivo, intensidade) {
    if (pecSystem) {
        return pecSystem.adicionarPorPanico(nome, motivo, intensidade);
    }
    return null;
};