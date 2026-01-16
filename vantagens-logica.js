// vantagens-logica.js - PRIMEIRA SUBABA (Aparência & Complementares)
class VantagensLogic {
    constructor() {
        console.log('🌟 VantagensLogic: Inicializando...');
        
        // Referência ao PontosManager
        this.pontosManager = null;
        
        // Estado atual
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
        
        this.inicializar();
    }
    
    async inicializar() {
        // Aguardar PontosManager
        await this.aguardarPontosManager();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Inicializar valores
        this.inicializarValores();
        
        console.log('✅ VantagensLogic: Inicializado com sucesso!');
    }
    
    aguardarPontosManager() {
        return new Promise((resolve) => {
            const verificar = () => {
                this.pontosManager = window.getPontosManager();
                if (this.pontosManager) {
                    console.log('🔗 PontosManager conectado!');
                    resolve();
                } else {
                    console.log('⏳ Aguardando PontosManager...');
                    setTimeout(verificar, 200);
                }
            };
            verificar();
        });
    }
    
    inicializarValores() {
        // Aparência - garantir que comece em 0 (Comum)
        const selectAparência = document.getElementById('nivelAparencia');
        if (selectAparência) {
            selectAparência.value = '0'; // Forçar valor inicial
            this.estado.aparência = 0;
            this.atualizarDisplayAparência(0);
        }
        
        // Atributos complementares - garantir zeros
        Object.keys(this.estado.atributosComplementares).forEach(atributo => {
            const input = document.getElementById(`${atributo}Mod`);
            if (input) {
                input.value = '0';
                this.estado.atributosComplementares[atributo] = 0;
                this.atualizarDisplayAtributo(atributo, 0);
            }
        });
        
        // Alfabetização - garantir alfabetizado (0 pontos)
        const radiosAlfabetizacao = document.querySelectorAll('input[name="alfabetizacao"]');
        if (radiosAlfabetizacao.length > 0) {
            radiosAlfabetizacao[0].checked = true; // Primeiro = alfabetizado
            this.estado.alfabetizacao = 0;
        }
    }
    
    configurarEventos() {
        console.log('🔧 VantagensLogic: Configurando eventos...');
        
        // ================= APARÊNCIA =================
        this.configurarAparência();
        
        // ================= ATRIBUTOS COMPLEMENTARES =================
        this.configurarAtributosComplementares();
        
        // ================= ALFABETIZAÇÃO =================
        this.configurarAlfabetizacao();
        
        // ================= IDIOMAS =================
        this.configurarIdiomas();
    }
    
    // ================= CONFIGURAÇÃO DE APARÊNCIA =================
    configurarAparência() {
        const selectAparência = document.getElementById('nivelAparencia');
        if (!selectAparência) {
            console.warn('❌ Select de aparência não encontrado');
            return;
        }
        
        selectAparência.addEventListener('change', (e) => {
            const pontos = parseInt(e.target.value);
            console.log(`👤 Aparência alterada: ${pontos} pontos`);
            
            // Atualizar estado
            this.estado.aparência = pontos;
            
            // Atualizar display
            this.atualizarDisplayAparência(pontos);
            
            // Disparar evento para PontosManager
            this.dispararEventoAparência(pontos);
        });
        
        // Forçar evento inicial
        setTimeout(() => {
            const pontosInicial = parseInt(selectAparência.value) || 0;
            this.dispararEventoAparência(pontosInicial);
        }, 100);
    }
    
    atualizarDisplayAparência(pontos) {
        // Atualizar badge
        const badge = document.getElementById('pontosAparencia');
        if (badge) {
            badge.textContent = `${pontos >= 0 ? '+' : ''}${pontos} pts`;
            badge.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
        
        // Atualizar descrição
        const display = document.getElementById('displayAparência');
        if (!display) return;
        
        const descricao = this.getDescricaoAparência(pontos);
        display.innerHTML = `
            <div><strong>${descricao.nome}</strong></div>
            <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8; margin-top: 5px;">
                ${descricao.descricao}
            </div>
        `;
    }
    
    getDescricaoAparência(pontos) {
        const map = {
            '-24': { nome: 'Horrendo', descricao: 'Aparência terrível, causa -4 nas Reações' },
            '-20': { nome: 'Monstruoso', descricao: 'Aparência monstruosa, causa -3 nas Reações' },
            '-16': { nome: 'Hediondo', descricao: 'Muito feio, causa -2 nas Reações' },
            '-8': { nome: 'Feio', descricao: 'Feio, causa -1 nas Reações' },
            '-4': { nome: 'Sem Atrativos', descricao: 'Sem atrativos, causa -0 nas Reações' },
            '0': { nome: 'Comum', descricao: 'Aparência normal, não causa modificadores' },
            '4': { nome: 'Atraente', descricao: 'Bonito, causa +1 nas Reações' },
            '12': { nome: 'Elegante', descricao: 'Muito bonito, causa +2 nas Reações' },
            '16': { nome: 'Muito Elegante', descricao: 'Extremamente bonito, causa +3 nas Reações' },
            '20': { nome: 'Lindo', descricao: 'Beleza excepcional, causa +4 nas Reações' }
        };
        
        return map[pontos.toString()] || { nome: 'Desconhecido', descricao: 'Valor não reconhecido' };
    }
    
    dispararEventoAparência(pontos) {
        const evento = new CustomEvent('aparênciaAtualizada', {
            detail: { pontos }
        });
        document.dispatchEvent(evento);
        console.log(`📡 Evento disparado: aparênciaAtualizada (${pontos} pts)`);
    }
    
    // ================= CONFIGURAÇÃO ATRIBUTOS COMPLEMENTARES =================
    configurarAtributosComplementares() {
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        
        atributos.forEach(atributo => {
            const btnMais = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
            const btnMenos = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
            const input = document.getElementById(`${atributo}Mod`);
            
            if (!btnMais || !btnMenos || !input) {
                console.warn(`❌ Controles do atributo ${atributo} não encontrados`);
                return;
            }
            
            // Evento de aumentar
            btnMais.addEventListener('click', () => {
                this.alterarAtributoComplementar(atributo, 1);
            });
            
            // Evento de diminuir
            btnMenos.addEventListener('click', () => {
                this.alterarAtributoComplementar(atributo, -1);
            });
            
            // Evento de input manual (se permitido)
            if (!input.readOnly) {
                input.addEventListener('change', (e) => {
                    const novoValor = parseInt(e.target.value) || 0;
                    this.estado.atributosComplementares[atributo] = novoValor;
                    this.atualizarDisplayAtributo(atributo, novoValor);
                });
            }
        });
    }
    
    alterarAtributoComplementar(atributo, direcao) {
        // Limites por atributo
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
        
        // Se não mudou, sai
        if (novoValor === valorAtual) return;
        
        // Atualizar estado
        this.estado.atributosComplementares[atributo] = novoValor;
        
        // Atualizar input
        const input = document.getElementById(`${atributo}Mod`);
        if (input) {
            input.value = novoValor;
        }
        
        // Atualizar display
        this.atualizarDisplayAtributo(atributo, novoValor);
        
        // Disparar evento para cálculo total
        this.dispararEventoAtributosComplementares();
        
        console.log(`📊 ${atributo} alterado: ${valorAtual} → ${novoValor}`);
    }
    
    atualizarDisplayAtributo(atributo, valor) {
        // Calcular pontos
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
        // Custo por nível varia por atributo
        const custos = {
            vontade: 5,       // 5 pts por nível
            percepcao: 5,     // 5 pts por nível
            pv: 2,           // 2 pts por nível
            pf: 3,           // 3 pts por nível
            velocidade: 5,    // 5 pts por 0.25 de velocidade (cada nível = 0.25)
            deslocamento: 5   // 5 pts por nível
        };
        
        const custoPorNivel = custos[atributo] || 5;
        return nivel * custoPorNivel;
    }
    
    dispararEventoAtributosComplementares() {
        // Calcular total de pontos em atributos complementares
        let totalPontos = 0;
        
        Object.entries(this.estado.atributosComplementares).forEach(([atributo, nivel]) => {
            totalPontos += this.calcularPontosAtributo(atributo, nivel);
        });
        
        console.log(`🧮 Total atributos complementares: ${totalPontos} pts`);
        
        // Atualizar badge geral
        const badgeTotal = document.getElementById('pontosAtributosComplementares');
        if (badgeTotal) {
            badgeTotal.textContent = `${totalPontos >= 0 ? '+' : ''}${totalPontos} pts`;
            badgeTotal.className = 'pontos-badge ' + (totalPontos >= 0 ? 'positivo' : 'negativo');
        }
        
        // Disparar evento para PontosManager
        if (this.pontosManager && totalPontos > 0) {
            this.pontosManager.adicionarVantagem(totalPontos, 'atributosComplementares');
        }
    }
    
    // ================= CONFIGURAÇÃO ALFABETIZAÇÃO =================
    configurarAlfabetizacao() {
        const radios = document.querySelectorAll('input[name="alfabetizacao"]');
        if (radios.length === 0) return;
        
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const pontos = parseInt(e.target.value);
                    console.log(`📚 Alfabetização alterada: ${pontos} pontos`);
                    
                    this.estado.alfabetizacao = pontos;
                    this.atualizarDisplayAlfabetizacao(pontos);
                    this.dispararEventoAlfabetizacao(pontos);
                }
            });
        });
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
    
    dispararEventoAlfabetizacao(pontos) {
        // Alfabetização é uma DESVANTAGEM (pontos negativos)
        if (pontos < 0) {
            const evento = new CustomEvent('desvantagemAdicionada', {
                detail: {
                    tipo: 'alfabetizacao',
                    pontos: pontos,
                    descricao: pontos === -2 ? 'Semianalfabeto' : 'Analfabeto'
                }
            });
            document.dispatchEvent(evento);
            console.log(`📡 Evento: desvantagemAdicionada (alfabetizacao: ${pontos} pts)`);
        }
    }
    
    // ================= CONFIGURAÇÃO IDIOMAS =================
    configurarIdiomas() {
        const btnAdicionarIdioma = document.getElementById('btnAdicionarIdioma');
        const nomeInput = document.getElementById('novoIdiomaNome');
        const falaSelect = document.getElementById('novoIdiomaFala');
        const escritaSelect = document.getElementById('novoIdiomaEscrita');
        const previewCusto = document.getElementById('custoIdiomaPreview');
        
        if (!btnAdicionarIdioma || !nomeInput || !falaSelect || !escritaSelect || !previewCusto) {
            console.warn('❌ Elementos de idiomas não encontrados');
            return;
        }
        
        // Atualizar preview quando algo mudar
        const atualizarPreview = () => {
            const nome = nomeInput.value.trim();
            const fala = parseInt(falaSelect.value) || 0;
            const escrita = parseInt(escritaSelect.value) || 0;
            const total = fala + escrita;
            
            if (nome) {
                previewCusto.innerHTML = `Custo: <strong>${total >= 0 ? '+' : ''}${total} pts</strong>`;
                btnAdicionarIdioma.disabled = false;
                btnAdicionarIdioma.style.opacity = '1';
            } else {
                previewCusto.innerHTML = `Custo: <strong>+0 pts</strong>`;
                btnAdicionarIdioma.disabled = true;
                btnAdicionarIdioma.style.opacity = '0.5';
            }
        };
        
        nomeInput.addEventListener('input', atualizarPreview);
        falaSelect.addEventListener('change', atualizarPreview);
        escritaSelect.addEventListener('change', atualizarPreview);
        
        // Botão de adicionar
        btnAdicionarIdioma.addEventListener('click', () => {
            this.adicionarIdioma();
        });
        
        // Permitir adicionar com Enter no nome
        nomeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && nomeInput.value.trim()) {
                this.adicionarIdioma();
            }
        });
        
        // Atualizar preview inicial
        atualizarPreview();
    }
    
    adicionarIdioma() {
        const nomeInput = document.getElementById('novoIdiomaNome');
        const falaSelect = document.getElementById('novoIdiomaFala');
        const escritaSelect = document.getElementById('novoIdiomaEscrita');
        
        const nome = nomeInput.value.trim();
        const fala = parseInt(falaSelect.value) || 0;
        const escrita = parseInt(escritaSelect.value) || 0;
        const total = fala + escrita;
        
        if (!nome) {
            alert('Digite o nome do idioma!');
            nomeInput.focus();
            return;
        }
        
        // Verificar se já existe
        if (this.estado.idiomas.some(i => i.nome.toLowerCase() === nome.toLowerCase())) {
            alert('Este idioma já foi adicionado!');
            return;
        }
        
        // Adicionar ao estado
        const idioma = {
            nome: nome,
            fala: fala,
            escrita: escrita,
            total: total
        };
        
        this.estado.idiomas.push(idioma);
        
        // Atualizar UI
        this.atualizarListaIdiomas();
        
        // Atualizar total
        this.atualizarTotalIdiomas();
        
        // Limpar formulário
        nomeInput.value = '';
        falaSelect.value = '6'; // Reset para Nativo
        escritaSelect.value = '0'; // Reset para Não escreve
        
        // Focar no input
        nomeInput.focus();
        
        console.log(`🗣️ Idioma adicionado: ${nome} (${total} pts)`);
        
        // Disparar evento se for desvantagem (custo negativo)
        if (total < 0) {
            this.dispararEventoIdiomas();
        }
    }
    
    atualizarListaIdiomas() {
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (!listaContainer) return;
        
        // Limpar estado vazio se existir
        const emptyState = listaContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Adicionar novos itens
        this.estado.idiomas.forEach((idioma, index) => {
            // Verificar se já existe
            const idItem = `idioma-${index}`;
            if (document.getElementById(idItem)) return;
            
            const item = document.createElement('div');
            item.className = 'idioma-item';
            item.id = idItem;
            
            const descricaoFala = this.getDescricaoNivel(idioma.fala, 'fala');
            const descricaoEscrita = this.getDescricaoNivel(idioma.escrita, 'escrita');
            
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
        
        // Adicionar event listeners aos botões de remover
        listaContainer.querySelectorAll('.btn-remover-idioma').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.btn-remover-idioma').dataset.index);
                this.removerIdioma(index);
            });
        });
    }
    
    getDescricaoNivel(pontos, tipo) {
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
        
        if (tipo === 'fala') {
            return mapFala[pontos] || 'Desconhecido';
        } else {
            return mapEscrita[pontos] || 'Desconhecido';
        }
    }
    
    atualizarTotalIdiomas() {
        // Calcular total de pontos em idiomas
        let totalPontos = 0;
        this.estado.idiomas.forEach(idioma => {
            totalPontos += idioma.total;
        });
        
        // Adicionar alfabetização se for negativa
        totalPontos += this.estado.alfabetizacao;
        
        // Atualizar badge
        const badgeIdiomas = document.getElementById('pontosIdiomas');
        if (badgeIdiomas) {
            badgeIdiomas.textContent = `${totalPontos >= 0 ? '+' : ''}${totalPontos} pts`;
            badgeIdiomas.className = 'pontos-badge ' + (totalPontos >= 0 ? 'positivo' : 'negativo');
        }
        
        // Atualizar contador
        const contador = document.getElementById('totalIdiomas');
        if (contador) {
            contador.textContent = this.estado.idiomas.length;
        }
        
        // Disparar evento se for desvantagem (total negativo)
        if (totalPontos < 0) {
            this.dispararEventoIdiomas();
        }
    }
    
    dispararEventoIdiomas() {
        // Calcular total negativo (desvantagem)
        let totalNegativo = 0;
        
        // Idiomas com custo negativo
        this.estado.idiomas.forEach(idioma => {
            if (idioma.total < 0) {
                totalNegativo += Math.abs(idioma.total);
            }
        });
        
        // Alfabetização (sempre negativa se não for 0)
        if (this.estado.alfabetizacao < 0) {
            totalNegativo += Math.abs(this.estado.alfabetizacao);
        }
        
        if (totalNegativo > 0) {
            const evento = new CustomEvent('idiomasAtualizados', {
                detail: { pontos: -totalNegativo }
            });
            document.dispatchEvent(evento);
            console.log(`📡 Evento: idiomasAtualizados (${-totalNegativo} pts)`);
        }
    }
    
    removerIdioma(index) {
        if (index < 0 || index >= this.estado.idiomas.length) return;
        
        const idiomaRemovido = this.estado.idiomas[index];
        console.log(`🗑️ Removendo idioma: ${idiomaRemovido.nome}`);
        
        // Remover do estado
        this.estado.idiomas.splice(index, 1);
        
        // Remover da UI
        const item = document.getElementById(`idioma-${index}`);
        if (item) {
            item.remove();
        }
        
        // Renumerar itens restantes
        this.renumerarItensIdiomas();
        
        // Atualizar totais
        this.atualizarTotalIdiomas();
        
        // Se tinha custo negativo, atualizar evento
        if (idiomaRemovido.total < 0) {
            this.dispararEventoIdiomas();
        }
    }
    
    renumerarItensIdiomas() {
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (!listaContainer) return;
        
        // Remover todos os itens
        const itens = listaContainer.querySelectorAll('.idioma-item');
        itens.forEach(item => item.remove());
        
        // Recriar lista com novos índices
        this.atualizarListaIdiomas();
    }
    
    // ================= UTILITÁRIOS =================
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // ================= MÉTODOS PÚBLICOS =================
    obterResumo() {
        return {
            aparência: this.estado.aparência,
            atributosComplementares: { ...this.estado.atributosComplementares },
            alfabetizacao: this.estado.alfabetizacao,
            idiomas: [...this.estado.idiomas],
            totalIdiomas: this.estado.idiomas.length
        };
    }
    
    resetar() {
        console.log('🔄 VantagensLogic: Resetando...');
        
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
        
        // Resetar UI
        this.inicializarValores();
        
        // Limpar lista de idiomas
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (listaContainer) {
            listaContainer.innerHTML = '<div class="empty-state">Nenhum idioma adicional adicionado</div>';
        }
        
        // Resetar totais
        this.atualizarTotalIdiomas();
        
        // Disparar eventos de reset
        this.dispararEventoAparência(0);
        this.dispararEventoAtributosComplementares();
        this.dispararEventoAlfabetizacao(0);
        this.dispararEventoIdiomas();
        
        console.log('✅ VantagensLogic: Resetado com sucesso!');
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

// Inicializar quando a aba de vantagens for ativada
document.addEventListener('DOMContentLoaded', function() {
    // Observar quando a aba de vantagens for clicada
    const tabVantagens = document.querySelector('.tab[data-tab="vantagens"]');
    if (tabVantagens) {
        tabVantagens.addEventListener('click', () => {
            setTimeout(() => {
                if (!vantagensLogicInstance) {
                    inicializarVantagensLogic();
                }
            }, 300);
        });
    }
    
    // Também inicializar se já estiver na aba de vantagens
    const tabAtiva = document.querySelector('.tab.active[data-tab="vantagens"]');
    if (tabAtiva) {
        setTimeout(() => {
            inicializarVantagensLogic();
        }, 500);
    }
});

// Exportar para uso global
window.VantagensLogic = VantagensLogic;
window.inicializarVantagensLogic = inicializarVantagensLogic;
window.getVantagensLogic = () => vantagensLogicInstance;
window.resetarVantagensLogic = () => {
    if (vantagensLogicInstance) {
        vantagensLogicInstance.resetar();
    }
};

// Debug
window.debugVantagens = () => {
    console.log('=== DEBUG VANTAGENS ===');
    if (vantagensLogicInstance) {
        console.log('Instância:', vantagensLogicInstance);
        console.log('Estado:', vantagensLogicInstance.obterResumo());
    } else {
        console.log('VantagensLogic não inicializado');
    }
    console.log('======================');
};