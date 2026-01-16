// vantagens-logica.js - VERSÃO COMPLETA E FUNCIONAL
class VantagensLogic {
    constructor() {
        this.estado = {
            aparência: 0,
            atributosComplementares: {
                vontade: 0,
                percepcao: 0,
                pv: 0,
                pf: 0,
                velocidade: 0,
                deslocamento: 0
            },
            alfabetizacao: 0,
            idiomas: []
        };
        
        // Cache para controle de mudanças
        this.cache = {
            aparência: 0,
            atributosComplementares: 0,
            idiomas: 0
        };
        
        this.inicializar();
    }
    
    inicializar() {
        // Carregar valores iniciais dos inputs
        this.carregarValoresIniciais();
        
        // Configurar todos os eventos
        this.configurarEventos();
        
        // Sincronizar inicialmente
        setTimeout(() => {
            this.sincronizarTudo();
        }, 300);
    }
    
    carregarValoresIniciais() {
        // Aparência
        const selectAparência = document.getElementById('nivelAparencia');
        if (selectAparência) {
            this.estado.aparência = parseInt(selectAparência.value) || 0;
            this.cache.aparência = this.estado.aparência;
        }
        
        // Atributos complementares
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        atributos.forEach(atributo => {
            const input = document.getElementById(`${atributo}Mod`);
            if (input) {
                this.estado.atributosComplementares[atributo] = parseInt(input.value) || 0;
            }
        });
        
        // Calcular total inicial de atributos complementares
        this.cache.atributosComplementares = this.calcularTotalAtributosComplementares();
        
        // Alfabetização
        const radioAlfabetizacao = document.querySelector('input[name="alfabetizacao"]:checked');
        if (radioAlfabetizacao) {
            this.estado.alfabetizacao = parseInt(radioAlfabetizacao.value) || 0;
        }
        
        // Idiomas existentes na lista
        this.carregarIdiomasExistentes();
        this.cache.idiomas = this.calcularTotalIdiomas();
    }
    
    carregarIdiomasExistentes() {
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (!listaContainer) return;
        
        const itens = listaContainer.querySelectorAll('.idioma-item');
        this.estado.idiomas = [];
        
        itens.forEach(item => {
            const nomeEl = item.querySelector('strong');
            const pontosEl = item.querySelector('.idioma-pontos');
            
            if (nomeEl && pontosEl) {
                const nome = nomeEl.textContent.trim();
                const pontosText = pontosEl.textContent.trim();
                const match = pontosText.match(/([+-]?\d+)/);
                const total = match ? parseInt(match[1]) : 0;
                
                this.estado.idiomas.push({
                    nome: nome,
                    total: total
                });
            }
        });
    }
    
    configurarEventos() {
        this.configurarAparência();
        this.configurarAtributosComplementares();
        this.configurarAlfabetizacao();
        this.configurarSistemaIdiomas();
        
        // Monitorar periodicamente para garantir sincronização
        setInterval(() => {
            this.verificarMudanças();
        }, 1000);
    }
    
    configurarAparência() {
        const selectAparência = document.getElementById('nivelAparencia');
        if (!selectAparência) return;
        
        selectAparência.addEventListener('change', (e) => {
            const pontos = parseInt(e.target.value) || 0;
            this.estado.aparência = pontos;
            this.atualizarDisplayAparência(pontos);
            this.processarAparência(pontos);
        });
        
        // Atualizar display inicial
        this.atualizarDisplayAparência(this.estado.aparência);
    }
    
    atualizarDisplayAparência(pontos) {
        // Atualizar badge
        const badge = document.getElementById('pontosAparencia');
        if (badge) {
            badge.textContent = `${pontos >= 0 ? '+' : ''}${pontos} pts`;
            badge.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
        
        // Atualizar descrição
        const display = document.getElementById('displayAparencia');
        if (display) {
            const descricao = this.getDescricaoAparência(pontos);
            display.innerHTML = `
                <div><strong style="color: ${pontos >= 0 ? '#27ae60' : '#e74c3c'}">${descricao.nome}</strong></div>
                <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8; margin-top: 5px;">
                    ${descricao.descricao}
                </div>
            `;
        }
    }
    
    getDescricaoAparência(pontos) {
        const map = {
            '-24': { nome: 'Horrendo', descricao: 'Aparência terrível, causa -4 nas Reações' },
            '-20': { nome: 'Monstruoso', descricao: 'Aparência monstruosa, causa -3 nas Reações' },
            '-16': { nome: 'Hediondo', descricao: 'Muito feio, causa -2 nas Reações' },
            '-8': { nome: 'Feio', descricao: 'Feio, causa -1 nas Reações' },
            '-4': { nome: 'Sem Atrativos', descricao: 'Sem atrativos, não causa modificadores' },
            '0': { nome: 'Comum', descricao: 'Aparência normal, não causa modificadores' },
            '4': { nome: 'Atraente', descricao: 'Bonito, causa +1 nas Reações' },
            '12': { nome: 'Elegante', descricao: 'Muito bonito, causa +2 nas Reações' },
            '16': { nome: 'Muito Elegante', descricao: 'Extremamente bonito, causa +3 nas Reações' },
            '20': { nome: 'Lindo', descricao: 'Beleza excepcional, causa +4 nas Reações' }
        };
        
        return map[pontos.toString()] || { nome: 'Desconhecido', descricao: 'Valor não reconhecido' };
    }
    
    processarAparência(pontos) {
        // Se mudou, processar
        if (pontos !== this.cache.aparência) {
            const diferenca = pontos - this.cache.aparência;
            this.cache.aparência = pontos;
            
            // Enviar para sistema de pontos
            this.enviarParaSistemaPontos('aparência', pontos, diferenca);
        }
    }
    
    configurarAtributosComplementares() {
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        
        atributos.forEach(atributo => {
            const btnMais = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
            const btnMenos = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
            const input = document.getElementById(`${atributo}Mod`);
            
            if (btnMais && btnMenos && input) {
                // Aumentar
                btnMais.addEventListener('click', () => {
                    this.ajustarAtributo(atributo, 1);
                });
                
                // Diminuir
                btnMenos.addEventListener('click', () => {
                    this.ajustarAtributo(atributo, -1);
                });
                
                // Mudança manual
                input.addEventListener('change', () => {
                    const valor = parseInt(input.value) || 0;
                    this.estado.atributosComplementares[atributo] = valor;
                    this.atualizarDisplayAtributo(atributo, valor);
                    this.processarAtributosComplementares();
                });
                
                // Atualizar display inicial
                this.atualizarDisplayAtributo(atributo, this.estado.atributosComplementares[atributo]);
            }
        });
        
        // Atualizar total inicial
        this.atualizarTotalAtributosComplementares();
    }
    
    ajustarAtributo(atributo, direcao) {
        const limites = {
            vontade: { min: -4, max: 5 },
            percepcao: { min: -4, max: 5 },
            pv: { min: -2, max: 2 },
            pf: { min: -3, max: 3 },
            velocidade: { min: -5, max: 5 },
            deslocamento: { min: -5, max: 5 }
        };
        
        const limite = limites[atributo] || { min: -5, max: 5 };
        const valorAtual = this.estado.atributosComplementares[atributo];
        const novoValor = Math.max(limite.min, Math.min(limite.max, valorAtual + direcao));
        
        if (novoValor === valorAtual) return;
        
        this.estado.atributosComplementares[atributo] = novoValor;
        
        const input = document.getElementById(`${atributo}Mod`);
        if (input) {
            input.value = novoValor;
        }
        
        this.atualizarDisplayAtributo(atributo, novoValor);
        this.processarAtributosComplementares();
    }
    
    atualizarDisplayAtributo(atributo, valor) {
        // Calcular pontos deste atributo
        const pontos = this.calcularPontosAtributo(atributo, valor);
        
        // Atualizar display de pontos
        const pontosEl = document.getElementById(`pontos${this.capitalize(atributo)}`);
        if (pontosEl) {
            pontosEl.textContent = `${pontos} pts`;
            pontosEl.style.color = pontos > 0 ? '#27ae60' : 
                                   pontos < 0 ? '#e74c3c' : '#7f8c8d';
        }
        
        // Atualizar cor do input
        const input = document.getElementById(`${atributo}Mod`);
        if (input) {
            input.style.color = valor > 0 ? '#27ae60' : 
                               valor < 0 ? '#e74c3c' : '#7f8c8d';
            input.style.fontWeight = valor !== 0 ? 'bold' : 'normal';
        }
    }
    
    calcularPontosAtributo(atributo, nivel) {
        const custos = {
            vontade: 5,      // 5 pontos por nível
            percepcao: 5,    // 5 pontos por nível
            pv: 2,          // 2 pontos por nível
            pf: 3,          // 3 pontos por nível
            velocidade: 20,  // 20 pontos por nível (cada nível = +0.25 velocidade)
            deslocamento: 5  // 5 pontos por nível
        };
        
        const custoPorNivel = custos[atributo] || 5;
        return nivel * custoPorNivel;
    }
    
    calcularTotalAtributosComplementares() {
        let total = 0;
        
        Object.entries(this.estado.atributosComplementares).forEach(([atributo, nivel]) => {
            total += this.calcularPontosAtributo(atributo, nivel);
        });
        
        return total;
    }
    
    atualizarTotalAtributosComplementares() {
        const total = this.calcularTotalAtributosComplementares();
        
        // Atualizar badge
        const badge = document.getElementById('pontosAtributosComplementares');
        if (badge) {
            badge.textContent = `${total >= 0 ? '+' : ''}${total} pts`;
            badge.className = 'pontos-badge ' + (total >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    processarAtributosComplementares() {
        const totalAtual = this.calcularTotalAtributosComplementares();
        
        if (totalAtual !== this.cache.atributosComplementares) {
            const diferenca = totalAtual - this.cache.atributosComplementares;
            this.cache.atributosComplementares = totalAtual;
            
            // Atualizar display do total
            this.atualizarTotalAtributosComplementares();
            
            // Enviar para sistema de pontos
            this.enviarParaSistemaPontos('atributosComplementares', totalAtual, diferenca);
        }
    }
    
    configurarAlfabetizacao() {
        const radios = document.querySelectorAll('input[name="alfabetizacao"]');
        
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const pontos = parseInt(e.target.value) || 0;
                    this.estado.alfabetizacao = pontos;
                    this.atualizarDisplayAlfabetizacao(pontos);
                    this.processarIdiomas();
                }
            });
        });
        
        // Atualizar display inicial
        this.atualizarDisplayAlfabetizacao(this.estado.alfabetizacao);
    }
    
    atualizarDisplayAlfabetizacao(pontos) {
        const descEl = document.getElementById('descAlfabetizacao');
        if (!descEl) return;
        
        const descricoes = {
            '0': 'Consegue ler e escrever normalmente',
            '-2': 'Lê com dificuldade, escreve muito pouco',
            '-3': 'Não sabe ler nem escrever'
        };
        
        descEl.textContent = descricoes[pontos.toString()] || 'Desconhecido';
        descEl.style.color = pontos < 0 ? '#e74c3c' : '#27ae60';
    }
    
    configurarSistemaIdiomas() {
        const btnAdicionarIdioma = document.getElementById('btnAdicionarIdioma');
        const nomeInput = document.getElementById('novoIdiomaNome');
        const falaSelect = document.getElementById('novoIdiomaFala');
        const escritaSelect = document.getElementById('novoIdiomaEscrita');
        
        if (btnAdicionarIdioma && nomeInput && falaSelect && escritaSelect) {
            // Botão de adicionar
            btnAdicionarIdioma.addEventListener('click', () => {
                this.adicionarNovoIdioma();
            });
            
            // Tecla Enter no input
            nomeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.adicionarNovoIdioma();
                }
            });
            
            // Atualizar preview
            const atualizarPreview = () => {
                const nome = nomeInput.value.trim();
                const fala = parseInt(falaSelect.value) || 0;
                const escrita = parseInt(escritaSelect.value) || 0;
                const total = fala + escrita;
                
                const preview = document.getElementById('custoIdiomaPreview');
                if (preview) {
                    preview.innerHTML = `Custo: <strong>${total >= 0 ? '+' : ''}${total} pts</strong>`;
                }
                
                btnAdicionarIdioma.disabled = !nome;
            };
            
            nomeInput.addEventListener('input', atualizarPreview);
            falaSelect.addEventListener('change', atualizarPreview);
            escritaSelect.addEventListener('change', atualizarPreview);
            
            atualizarPreview();
        }
        
        // Configurar botões de remover (delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remover-idioma')) {
                const btn = e.target.closest('.btn-remover-idioma');
                const index = parseInt(btn.dataset.index);
                if (!isNaN(index)) {
                    this.removerIdioma(index);
                }
            }
        });
    }
    
    adicionarNovoIdioma() {
        const nomeInput = document.getElementById('novoIdiomaNome');
        const falaSelect = document.getElementById('novoIdiomaFala');
        const escritaSelect = document.getElementById('novoIdiomaEscrita');
        
        const nome = nomeInput.value.trim();
        if (!nome) return;
        
        const fala = parseInt(falaSelect.value) || 0;
        const escrita = parseInt(escritaSelect.value) || 0;
        const total = fala + escrita;
        
        // Verificar se já existe
        if (this.estado.idiomas.some(i => i.nome.toLowerCase() === nome.toLowerCase())) {
            alert('Este idioma já foi adicionado!');
            return;
        }
        
        // Adicionar ao estado
        this.estado.idiomas.push({
            nome: nome,
            fala: fala,
            escrita: escrita,
            total: total
        });
        
        // Adicionar à lista visual
        this.atualizarListaIdiomasVisual();
        
        // Limpar formulário
        nomeInput.value = '';
        falaSelect.value = '6'; // Reset para Nativo
        escritaSelect.value = '0'; // Reset para Não escreve
        nomeInput.focus();
        
        // Processar mudanças
        this.processarIdiomas();
    }
    
    atualizarListaIdiomasVisual() {
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (!listaContainer) return;
        
        // Limpar lista atual
        listaContainer.innerHTML = '';
        
        // Adicionar todos os idiomas
        this.estado.idiomas.forEach((idioma, index) => {
            const item = document.createElement('div');
            item.className = 'idioma-item';
            item.id = `idioma-${index}`;
            
            const descricaoFala = this.getDescricaoNivelIdioma(idioma.fala, 'fala');
            const descricaoEscrita = this.getDescricaoNivelIdioma(idioma.escrita, 'escrita');
            
            item.innerHTML = `
                <div class="idioma-info">
                    <strong>${idioma.nome}</strong>
                    <small>${descricaoFala} | ${descricaoEscrita}</small>
                </div>
                <div class="idioma-pontos ${idioma.total < 0 ? 'negativo' : 'positivo'}">
                    ${idioma.total >= 0 ? '+' : ''}${idioma.total} pts
                </div>
                <button class="btn-remover-idioma" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            listaContainer.appendChild(item);
        });
        
        // Se não houver idiomas, mostrar mensagem
        if (this.estado.idiomas.length === 0) {
            listaContainer.innerHTML = '<div class="empty-state">Nenhum idioma adicional adicionado</div>';
        }
        
        // Atualizar contador
        const contador = document.getElementById('totalIdiomas');
        if (contador) {
            contador.textContent = this.estado.idiomas.length;
        }
    }
    
    getDescricaoNivelIdioma(pontos, tipo) {
        const mapFala = {
            0: 'Não fala',
            2: 'Rudimentar',
            4: 'Sotaque',
            6: 'Nativo'
        };
        
        const mapEscrita = {
            0: 'Não escreve',
            1: 'Rudimentar',
            2: 'Sotaque',
            3: 'Nativo'
        };
        
        return tipo === 'fala' ? (mapFala[pontos] || 'Desconhecido') : (mapEscrita[pontos] || 'Desconhecido');
    }
    
    removerIdioma(index) {
        if (index < 0 || index >= this.estado.idiomas.length) return;
        
        // Remover do estado
        this.estado.idiomas.splice(index, 1);
        
        // Atualizar visual
        this.atualizarListaIdiomasVisual();
        
        // Processar mudanças
        this.processarIdiomas();
    }
    
    calcularTotalIdiomas() {
        let total = 0;
        
        // Somar pontos dos idiomas
        this.estado.idiomas.forEach(idioma => {
            total += idioma.total;
        });
        
        // Adicionar alfabetização
        total += this.estado.alfabetizacao;
        
        return total;
    }
    
    atualizarTotalIdiomasDisplay() {
        const total = this.calcularTotalIdiomas();
        
        // Atualizar badge
        const badge = document.getElementById('pontosIdiomas');
        if (badge) {
            badge.textContent = `${total >= 0 ? '+' : ''}${total} pts`;
            badge.className = 'pontos-badge ' + (total >= 0 ? 'positivo' : 'negativo');
        }
    }
    
    processarIdiomas() {
        const totalAtual = this.calcularTotalIdiomas();
        
        if (totalAtual !== this.cache.idiomas) {
            const diferenca = totalAtual - this.cache.idiomas;
            this.cache.idiomas = totalAtual;
            
            // Atualizar display
            this.atualizarTotalIdiomasDisplay();
            
            // Enviar para sistema de pontos
            this.enviarParaSistemaPontos('idiomas', totalAtual, diferenca);
        }
    }
    
    enviarParaSistemaPontos(tipo, valorTotal, diferenca) {
        // Criar evento padrão que o pontos-manager vai entender
        const evento = new CustomEvent('vantagensLogicAtualizada', {
            detail: {
                tipo: tipo,
                valorTotal: valorTotal,
                diferenca: diferenca,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(evento);
        
        // Também enviar eventos específicos para facilitar
        if (valorTotal > 0) {
            document.dispatchEvent(new CustomEvent('vantagemAdicionadaVantagensLogic', {
                detail: {
                    tipo: tipo,
                    pontos: valorTotal,
                    origem: 'vantagens-logica'
                }
            }));
        } else if (valorTotal < 0) {
            document.dispatchEvent(new CustomEvent('desvantagemAdicionadaVantagensLogic', {
                detail: {
                    tipo: tipo,
                    pontos: Math.abs(valorTotal),
                    origem: 'vantagens-logica'
                }
            }));
        }
    }
    
    verificarMudanças() {
        // Verificar aparência
        const selectAparência = document.getElementById('nivelAparencia');
        if (selectAparência) {
            const novaAparência = parseInt(selectAparência.value) || 0;
            if (novaAparência !== this.cache.aparência) {
                this.estado.aparência = novaAparência;
                this.processarAparência(novaAparência);
            }
        }
        
        // Verificar atributos complementares
        const totalAtributosAtual = this.calcularTotalAtributosComplementares();
        if (totalAtributosAtual !== this.cache.atributosComplementares) {
            this.processarAtributosComplementares();
        }
        
        // Verificar idiomas
        const totalIdiomasAtual = this.calcularTotalIdiomas();
        if (totalIdiomasAtual !== this.cache.idiomas) {
            this.processarIdiomas();
        }
    }
    
    sincronizarTudo() {
        // Processar tudo uma vez para sincronizar
        this.processarAparência(this.estado.aparência);
        this.processarAtributosComplementares();
        this.processarIdiomas();
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    obterResumo() {
        return {
            aparência: this.estado.aparência,
            atributosComplementares: { ...this.estado.atributosComplementares },
            totalAtributosComplementares: this.calcularTotalAtributosComplementares(),
            alfabetizacao: this.estado.alfabetizacao,
            idiomas: [...this.estado.idiomas],
            totalIdiomas: this.calcularTotalIdiomas()
        };
    }
    
    resetar() {
        // Resetar estado
        this.estado = {
            aparência: 0,
            atributosComplementares: {
                vontade: 0,
                percepcao: 0,
                pv: 0,
                pf: 0,
                velocidade: 0,
                deslocamento: 0
            },
            alfabetizacao: 0,
            idiomas: []
        };
        
        // Resetar cache
        this.cache = {
            aparência: 0,
            atributosComplementares: 0,
            idiomas: 0
        };
        
        // Recarregar
        this.carregarValoresIniciais();
        this.sincronizarTudo();
    }
}

// Inicialização
let vantagensLogicInstance = null;

function inicializarVantagensLogic() {
    if (!vantagensLogicInstance) {
        vantagensLogicInstance = new VantagensLogic();
    }
    return vantagensLogicInstance;
}

// Inicializar quando a aba vantagens for ativada
document.addEventListener('DOMContentLoaded', function() {
    // Observar cliques nas tabs
    document.addEventListener('click', function(e) {
        const tab = e.target.closest('.tab');
        if (tab && tab.dataset.tab === 'vantagens') {
            setTimeout(() => {
                inicializarVantagensLogic();
            }, 300);
        }
    });
    
    // Observar mudanças de sub-tabs dentro de vantagens
    document.addEventListener('click', function(e) {
        const subTab = e.target.closest('.sub-tab');
        if (subTab && subTab.dataset.subtab === 'aparencia') {
            setTimeout(() => {
                if (!vantagensLogicInstance) {
                    inicializarVantagensLogic();
                }
            }, 200);
        }
    });
    
    // Se já estiver na aba vantagens ao carregar
    if (document.querySelector('.tab[data-tab="vantagens"].active')) {
        setTimeout(() => {
            inicializarVantagensLogic();
        }, 500);
    }
});

// Exportar
window.VantagensLogic = VantagensLogic;
window.inicializarVantagensLogic = inicializarVantagensLogic;
window.getVantagensLogic = () => vantagensLogicInstance;