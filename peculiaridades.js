// peculiaridades.js - Sistema Completo de Peculiaridades

class SistemaPeculiaridades {
    constructor() {
        // Dados
        this.peculiaridadesNormais = [];
        this.peculiaridadesExtras = [];
        this.limiteNormais = 5;
        
        // Inicializar
        this.inicializar();
    }
    
    inicializar() {
        this.cacheElementos();
        this.vincularEventos();
        this.carregarDoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
    }
    
    cacheElementos() {
        // Elementos do formulário principal
        this.inputNome = document.getElementById('pec-nome');
        this.inputDescricao = document.getElementById('pec-descricao');
        this.selectIntensidade = document.getElementById('pec-intensidade');
        this.btnAdicionar = document.getElementById('pec-btn-adicionar');
        this.btnAdicionarExtra = document.getElementById('pec-btn-adicionar-extra');
        
        // Listas
        this.listaNormais = document.getElementById('pec-lista-normal');
        this.listaExtras = document.getElementById('pec-lista-extra');
        
        // Estatísticas
        this.contador = document.getElementById('pec-contador');
        this.contadorExtra = document.getElementById('pec-contador-extra');
        this.totalElement = document.getElementById('pec-total');
        this.pontosTotalElement = document.getElementById('pec-pontos-total');
        this.restanteElement = document.getElementById('pec-restante');
        
        // Botões de ação
        this.btnExportar = document.getElementById('pec-btn-exportar');
        this.btnLimpar = document.getElementById('pec-btn-limpar');
        this.btnModalExtra = document.getElementById('pec-btn-modal-extra');
        
        // Modal
        this.modal = document.getElementById('pec-modal-extra');
        this.modalFechar = document.getElementById('pec-modal-fechar');
        this.modalCancelar = document.getElementById('pec-modal-cancelar');
        this.modalConfirmar = document.getElementById('pec-modal-confirmar');
        this.extraNomeInput = document.getElementById('pec-extra-nome');
        this.extraDescInput = document.getElementById('pec-extra-descricao');
        this.extraMotivoSelect = document.getElementById('pec-extra-motivo');
        this.extraIntensidadeSelect = document.getElementById('pec-extra-intensidade');
    }
    
    vincularEventos() {
        // Adicionar peculiaridade normal
        if (this.btnAdicionar) {
            this.btnAdicionar.addEventListener('click', () => this.adicionarPeculiaridade('normal'));
        }
        
        // Adicionar como extra
        if (this.btnAdicionarExtra) {
            this.btnAdicionarExtra.addEventListener('click', () => this.adicionarPeculiaridade('extra'));
        }
        
        // Enter no campo nome
        if (this.inputNome) {
            this.inputNome.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.adicionarPeculiaridade('normal');
                }
            });
        }
        
        // Botões de ação
        if (this.btnExportar) {
            this.btnExportar.addEventListener('click', () => this.exportarDados());
        }
        
        if (this.btnLimpar) {
            this.btnLimpar.addEventListener('click', () => this.limparTudo());
        }
        
        // Modal de extras
        if (this.btnModalExtra) {
            this.btnModalExtra.addEventListener('click', () => this.abrirModalExtra());
        }
        
        if (this.modalFechar) {
            this.modalFechar.addEventListener('click', () => this.fecharModalExtra());
        }
        
        if (this.modalCancelar) {
            this.modalCancelar.addEventListener('click', () => this.fecharModalExtra());
        }
        
        if (this.modalConfirmar) {
            this.modalConfirmar.addEventListener('click', () => this.adicionarPeculiaridadeDoModal());
        }
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'flex') {
                this.fecharModalExtra();
            }
        });
        
        // Fechar modal clicando fora
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.fecharModalExtra();
                }
            });
        }
    }
    
    // ========== FUNÇÕES PRINCIPAIS ==========
    
    adicionarPeculiaridade(tipo = 'normal') {
        const nome = this.inputNome ? this.inputNome.value.trim() : '';
        const descricao = this.inputDescricao ? this.inputDescricao.value.trim() : '';
        const intensidade = this.selectIntensidade ? parseInt(this.selectIntensidade.value) : -1;
        
        // Validação
        if (!nome) {
            this.mostrarAlerta('Digite um nome para a peculiaridade!', 'erro');
            if (this.inputNome) this.inputNome.focus();
            return;
        }
        
        // Verificar limite para normais
        if (tipo === 'normal' && this.peculiaridadesNormais.length >= this.limiteNormais) {
            this.mostrarAlerta(`Limite de ${this.limiteNormais} peculiaridades atingido! Use "Adicionar como Extra".`, 'erro');
            return;
        }
        
        // Criar objeto da peculiaridade
        const peculiaridade = {
            id: Date.now() + Math.random(),
            nome: nome,
            descricao: descricao || null,
            intensidade: intensidade,
            tipo: tipo,
            dataCriacao: new Date().toISOString(),
            motivo: tipo === 'extra' ? 'Adicionada manualmente' : null
        };
        
        // Adicionar à lista correspondente
        if (tipo === 'normal') {
            this.peculiaridadesNormais.push(peculiaridade);
            this.limparFormulario();
        } else {
            this.peculiaridadesExtras.push(peculiaridade);
        }
        
        // Atualizar interface
        this.salvarNoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
        
        this.mostrarAlerta(`Peculiaridade "${nome}" adicionada com sucesso!`, 'sucesso');
    }
    
    adicionarPeculiaridadeDoModal() {
        const nome = this.extraNomeInput ? this.extraNomeInput.value.trim() : '';
        const descricao = this.extraDescInput ? this.extraDescInput.value.trim() : '';
        const motivo = this.extraMotivoSelect ? this.extraMotivoSelect.value : 'Teste de Pânico';
        const intensidade = this.extraIntensidadeSelect ? parseInt(this.extraIntensidadeSelect.value) : -1;
        
        // Validação
        if (!nome) {
            this.mostrarAlerta('Digite um nome para a peculiaridade extra!', 'erro');
            if (this.extraNomeInput) this.extraNomeInput.focus();
            return;
        }
        
        // Criar objeto
        const peculiaridade = {
            id: Date.now() + Math.random(),
            nome: nome,
            descricao: descricao || null,
            intensidade: intensidade,
            tipo: 'extra',
            dataCriacao: new Date().toISOString(),
            motivo: motivo
        };
        
        // Adicionar e atualizar
        this.peculiaridadesExtras.push(peculiaridade);
        this.fecharModalExtra();
        this.limparModal();
        this.salvarNoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
        
        this.mostrarAlerta(`Peculiaridade extra "${nome}" adicionada!`, 'sucesso');
    }
    
    removerPeculiaridade(id, tipo) {
        if (!confirm('Tem certeza que deseja remover esta peculiaridade?')) {
            return;
        }
        
        if (tipo === 'normal') {
            this.peculiaridadesNormais = this.peculiaridadesNormais.filter(p => p.id !== id);
        } else {
            this.peculiaridadesExtras = this.peculiaridadesExtras.filter(p => p.id !== id);
        }
        
        this.salvarNoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
        
        this.mostrarAlerta('Peculiaridade removida!', 'info');
    }
    
    // ========== RENDERIZAÇÃO ==========
    
    renderizar() {
        this.renderizarLista(this.listaNormais, this.peculiaridadesNormais, 'normal');
        this.renderizarLista(this.listaExtras, this.peculiaridadesExtras, 'extra');
    }
    
    renderizarLista(container, lista, tipo) {
        if (!container) return;
        
        if (lista.length === 0) {
            const mensagemVazia = tipo === 'normal' 
                ? '<div class="pec-lista-vazia"><i class="fas fa-user-slash"></i><p>Nenhuma peculiaridade</p><small>Adicione peculiaridades usando o formulário</small></div>'
                : '<div class="pec-lista-vazia"><i class="fas fa-plus-square"></i><p>Nenhuma peculiaridade extra</p><small>Adicione extras durante o jogo</small></div>';
            
            container.innerHTML = mensagemVazia;
            return;
        }
        
        let html = '';
        
        lista.forEach(pec => {
            const intensidadeTexto = Math.abs(pec.intensidade) === 3 ? 'Grave' :
                                   Math.abs(pec.intensidade) === 2 ? 'Moderada' : 'Leve';
            
            const dataFormatada = pec.dataCriacao 
                ? new Date(pec.dataCriacao).toLocaleDateString('pt-BR')
                : 'Data desconhecida';
            
            html += `
                <div class="pec-item ${tipo === 'extra' ? 'pec-item-extra' : ''}">
                    <div class="pec-item-info">
                        <div class="pec-item-nome">
                            ${pec.nome}
                            ${tipo === 'extra' ? '<span class="pec-badge pec-badge-extra" style="font-size: 11px; padding: 2px 8px;">Extra</span>' : ''}
                        </div>
                        ${pec.descricao ? `<div class="pec-item-desc">${pec.descricao}</div>` : ''}
                        <div class="pec-item-meta">
                            <span><i class="fas fa-chart-line"></i> ${intensidadeTexto}</span>
                            ${pec.motivo ? `<span><i class="fas fa-exclamation-circle"></i> ${pec.motivo}</span>` : ''}
                            <span><i class="fas fa-calendar"></i> ${dataFormatada}</span>
                        </div>
                    </div>
                    <div class="pec-item-acoes">
                        <div class="pec-item-pontos">${pec.intensidade} pts</div>
                        <button class="pec-btn-remover" onclick="sistemaPeculiaridades.removerPeculiaridade(${pec.id}, '${tipo}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    atualizarEstatisticas() {
        const totalNormais = this.peculiaridadesNormais.length;
        const totalExtras = this.peculiaridadesExtras.length;
        
        // Calcular pontos totais
        const pontosNormais = this.peculiaridadesNormais.reduce((total, pec) => total + pec.intensidade, 0);
        const pontosExtras = this.peculiaridadesExtras.reduce((total, pec) => total + pec.intensidade, 0);
        const pontosTotais = pontosNormais + pontosExtras;
        
        // Atualizar elementos da interface
        if (this.contador) {
            this.contador.textContent = `${totalNormais}/${this.limiteNormais}`;
            
            // Cor do contador baseada no limite
            if (totalNormais >= this.limiteNormais) {
                this.contador.style.background = '#fc8181';
                this.contador.style.color = 'white';
            } else if (totalNormais >= this.limiteNormais - 1) {
                this.contador.style.background = '#f6e05e';
                this.contador.style.color = '#744210';
            } else {
                this.contador.style.background = '#68d391';
                this.contador.style.color = 'white';
            }
        }
        
        if (this.contadorExtra) {
            this.contadorExtra.textContent = totalExtras;
        }
        
        if (this.totalElement) {
            this.totalElement.textContent = totalNormais;
        }
        
        if (this.pontosTotalElement) {
            this.pontosTotalElement.textContent = pontosTotais;
        }
        
        if (this.restanteElement) {
            this.restanteElement.textContent = Math.max(0, this.limiteNormais - totalNormais);
        }
    }
    
    // ========== MODAL ==========
    
    abrirModalExtra() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            if (this.extraNomeInput) {
                this.extraNomeInput.focus();
            }
        }
    }
    
    fecharModalExtra() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
    
    limparFormulario() {
        if (this.inputNome) this.inputNome.value = '';
        if (this.inputDescricao) this.inputDescricao.value = '';
        if (this.selectIntensidade) this.selectIntensidade.value = '-1';
        if (this.inputNome) this.inputNome.focus();
    }
    
    limparModal() {
        if (this.extraNomeInput) this.extraNomeInput.value = '';
        if (this.extraDescInput) this.extraDescInput.value = '';
        if (this.extraMotivoSelect) this.extraMotivoSelect.value = 'Teste de Pânico';
        if (this.extraIntensidadeSelect) this.extraIntensidadeSelect.value = '-1';
    }
    
    // ========== ALERTAS ==========
    
    mostrarAlerta(mensagem, tipo = 'info') {
        // Remover alertas anteriores
        const alertasAntigos = document.querySelectorAll('.pec-alerta-flutuante');
        alertasAntigos.forEach(alerta => {
            if (alerta.parentNode) {
                alerta.parentNode.removeChild(alerta);
            }
        });
        
        // Mapear tipos para cores e ícones
        const config = {
            sucesso: { cor: '#48bb78', icone: 'fa-check-circle' },
            erro: { cor: '#f56565', icone: 'fa-exclamation-circle' },
            info: { cor: '#4299e1', icone: 'fa-info-circle' },
            aviso: { cor: '#ed8936', icone: 'fa-exclamation-triangle' }
        };
        
        const cfg = config[tipo] || config.info;
        
        // Criar elemento do alerta
        const alerta = document.createElement('div');
        alerta.className = `pec-alerta-flutuante pec-alerta-${tipo}`;
        alerta.innerHTML = `
            <i class="fas ${cfg.icone}"></i>
            <span>${mensagem}</span>
        `;
        
        // Estilos inline
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cfg.cor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            z-index: 9999;
            animation: pecAlertaEntrada 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(alerta);
        
        // Remover após 4 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.style.animation = 'pecAlertaSaida 0.3s ease';
                setTimeout(() => {
                    if (alerta.parentNode) {
                        alerta.parentNode.removeChild(alerta);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // ========== PERSISTÊNCIA ==========
    
    salvarNoStorage() {
        const dados = {
            normais: this.peculiaridadesNormais,
            extras: this.peculiaridadesExtras,
            timestamp: Date.now()
        };
        localStorage.setItem('sistema_peculiaridades', JSON.stringify(dados));
    }
    
    carregarDoStorage() {
        try {
            const dadosSalvos = localStorage.getItem('sistema_peculiaridades');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                this.peculiaridadesNormais = dados.normais || [];
                this.peculiaridadesExtras = dados.extras || [];
            }
        } catch (e) {
            console.warn('Erro ao carregar peculiaridades do storage:', e);
            this.peculiaridadesNormais = [];
            this.peculiaridadesExtras = [];
        }
    }
    
    // ========== EXPORTAÇÃO/LIMPEZA ==========
    
    exportarDados() {
        const dados = {
            peculiaridadesNormais: this.peculiaridadesNormais,
            peculiaridadesExtras: this.peculiaridadesExtras,
            metadata: {
                exportadoEm: new Date().toISOString(),
                totalNormais: this.peculiaridadesNormais.length,
                totalExtras: this.peculiaridadesExtras.length,
                pontosTotais: this.peculiaridadesNormais.reduce((s, p) => s + p.intensidade, 0) + 
                              this.peculiaridadesExtras.reduce((s, p) => s + p.intensidade, 0)
            }
        };
        
        const dadosJSON = JSON.stringify(dados, null, 2);
        const blob = new Blob([dadosJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `peculiaridades_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.mostrarAlerta('Dados exportados com sucesso!', 'sucesso');
    }
    
    limparTudo() {
        if (!confirm('⚠️ ATENÇÃO!\n\nIsso removerá TODAS as peculiaridades normais e extras.\nEsta ação não pode ser desfeita!\n\nTem certeza que deseja continuar?')) {
            return;
        }
        
        this.peculiaridadesNormais = [];
        this.peculiaridadesExtras = [];
        this.salvarNoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
        
        this.mostrarAlerta('Todas as peculiaridades foram removidas!', 'info');
    }
    
    // ========== FUNÇÕES PARA USO EXTERNO ==========
    
    adicionarPorPanico(nome, motivo = 'Teste de Pânico', intensidade = -2) {
        const peculiaridade = {
            id: Date.now() + Math.random(),
            nome: nome,
            descricao: `Adquirida após ${motivo.toLowerCase()}`,
            intensidade: intensidade,
            tipo: 'extra',
            dataCriacao: new Date().toISOString(),
            motivo: motivo,
            origem: 'panico'
        };
        
        this.peculiaridadesExtras.push(peculiaridade);
        this.salvarNoStorage();
        this.renderizar();
        this.atualizarEstatisticas();
        
        this.mostrarAlerta(`Peculiaridade "${nome}" adicionada por ${motivo}!`, 'aviso');
        
        return peculiaridade;
    }
    
    obterDadosParaSistemaPrincipal() {
        return {
            peculiaridadesNormais: [...this.peculiaridadesNormais],
            peculiaridadesExtras: [...this.peculiaridadesExtras],
            totalNormais: this.peculiaridadesNormais.length,
            totalExtras: this.peculiaridadesExtras.length,
            pontosNormais: this.peculiaridadesNormais.reduce((s, p) => s + p.intensidade, 0),
            pontosExtras: this.peculiaridadesExtras.reduce((s, p) => s + p.intensidade, 0),
            pontosTotais: this.peculiaridadesNormais.reduce((s, p) => s + p.intensidade, 0) + 
                         this.peculiaridadesExtras.reduce((s, p) => s + p.intensidade, 0)
        };
    }
    
    // ========== GETTERS ÚTEIS ==========
    
    getTotalPeculiaridades() {
        return this.peculiaridadesNormais.length + this.peculiaridadesExtras.length;
    }
    
    getPontosTotais() {
        const pontosNormais = this.peculiaridadesNormais.reduce((s, p) => s + p.intensidade, 0);
        const pontosExtras = this.peculiaridadesExtras.reduce((s, p) => s + p.intensidade, 0);
        return pontosNormais + pontosExtras;
    }
    
    estaNoLimite() {
        return this.peculiaridadesNormais.length >= this.limiteNormais;
    }
}

// ========== INICIALIZAÇÃO GLOBAL ==========

let sistemaPeculiaridades = null;

function inicializarSistemaPeculiaridades() {
    // Verificar se estamos na aba correta
    const tabPeculiaridades = document.getElementById('subtab-peculiaridades');
    if (!tabPeculiaridades) {
        console.log('Aba de peculiaridades não encontrada');
        return null;
    }
    
    // Aguardar um pouco para garantir que o DOM está completamente carregado
    setTimeout(() => {
        try {
            sistemaPeculiaridades = new SistemaPeculiaridades();
            
            // Adicionar ao escopo global para acesso
            window.sistemaPeculiaridades = sistemaPeculiaridades;
            
            console.log('✅ Sistema de Peculiaridades inicializado com sucesso!');
            
            // Log de teste
            console.log('Comandos disponíveis:');
            console.log('- sistemaPeculiaridades.adicionarPorPanico("Medo de Altura", "Falha crítica", -2)');
            console.log('- sistemaPeculiaridades.obterDadosParaSistemaPrincipal()');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de peculiaridades:', error);
        }
    }, 100);
    
    return sistemaPeculiaridades;
}

// ========== FUNÇÕES GLOBAIS PARA USO EXTERNO ==========

// Função para adicionar peculiaridade por pânico (chamada por outros sistemas)
window.adicionarPeculiaridadePorPanico = function(nome, motivo = 'Teste de Pânico', intensidade = -2) {
    if (sistemaPeculiaridades) {
        return sistemaPeculiaridades.adicionarPorPanico(nome, motivo, intensidade);
    } else {
        console.error('Sistema de peculiaridades não inicializado!');
        console.log('Tentando inicializar...');
        inicializarSistemaPeculiaridades();
        
        // Tentar novamente após inicialização
        setTimeout(() => {
            if (sistemaPeculiaridades) {
                return sistemaPeculiaridades.adicionarPorPanico(nome, motivo, intensidade);
            }
        }, 200);
        
        return null;
    }
};

// Função para obter dados (usada pelo sistema principal)
window.obterDadosPeculiaridades = function() {
    if (sistemaPeculiaridades) {
        return sistemaPeculiaridades.obterDadosParaSistemaPrincipal();
    }
    return {
        peculiaridadesNormais: [],
        peculiaridadesExtras: [],
        totalNormais: 0,
        totalExtras: 0,
        pontosNormais: 0,
        pontosExtras: 0,
        pontosTotais: 0
    };
};

// ========== INICIALIZAÇÃO AUTOMÁTICA ==========

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaPeculiaridades);
} else {
    // DOM já carregado
    inicializarSistemaPeculiaridades();
}

// Inicializar também quando a aba for ativada (se você tiver sistema de tabs)
document.addEventListener('tabChanged', function(e) {
    if (e.detail && e.detail.tabId === 'subtab-peculiaridades') {
        if (!sistemaPeculiaridades) {
            inicializarSistemaPeculiaridades();
        }
    }
});

// ========== EXPORTAÇÃO PARA MÓDULOS ==========

// Se estiver usando módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SistemaPeculiaridades,
        sistemaPeculiaridades,
        inicializarSistemaPeculiaridades,
        adicionarPeculiaridadePorPanico: window.adicionarPeculiaridadePorPanico,
        obterDadosPeculiaridades: window.obterDadosPeculiaridades
    };
}