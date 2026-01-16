// vantagens-logica.js - VERSÃO 100% FUNCIONAL SEM QUEBRAR NADA
class VantagensLogic {
    constructor() {
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
    
    inicializar() {
        this.configurarEventos();
        this.inicializarValores();
        
        // Sincronizar com pontos-manager inicial
        setTimeout(() => {
            this.sincronizarComPontosManager();
        }, 1000);
    }
    
    inicializarValores() {
        // Aparência - pegar valor atual
        const selectAparência = document.getElementById('nivelAparencia');
        if (selectAparência) {
            this.estado.aparência = parseInt(selectAparência.value) || 0;
            this.atualizarDisplayAparência(this.estado.aparência);
        }
        
        // Atributos complementares - pegar valores atuais
        Object.keys(this.estado.atributosComplementares).forEach(atributo => {
            const input = document.getElementById(`${atributo}Mod`);
            if (input) {
                this.estado.atributosComplementares[atributo] = parseInt(input.value) || 0;
                this.atualizarDisplayAtributo(atributo, this.estado.atributosComplementares[atributo]);
            }
        });
        
        // Atualizar total de atributos complementares
        this.atualizarTotalAtributosComplementares();
        
        // Idiomas - pegar itens existentes da lista
        this.carregarIdiomasExistentes();
        this.atualizarTotalIdiomas();
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
                const pontos = match ? parseInt(match[1]) : 0;
                
                this.estado.idiomas.push({
                    nome: nome,
                    total: pontos
                });
            }
        });
    }
    
    configurarEventos() {
        // ================= APARÊNCIA =================
        const selectAparência = document.getElementById('nivelAparencia');
        if (selectAparência) {
            selectAparência.addEventListener('change', (e) => {
                const pontos = parseInt(e.target.value) || 0;
                this.estado.aparência = pontos;
                this.atualizarDisplayAparência(pontos);
                
                // Disparar evento CORRETO para pontos-manager
                this.dispararEventoAparência(pontos);
            });
        }
        
        // ================= ATRIBUTOS COMPLEMENTARES =================
        this.configurarAtributosComplementares();
        
        // ================= IDIOMAS =================
        this.configurarIdiomas();
    }
    
    configurarAtributosComplementares() {
        const atributos = ['vontade', 'percepcao', 'pv', 'pf', 'velocidade', 'deslocamento'];
        
        atributos.forEach(atributo => {
            const btnMais = document.querySelector(`.btn-atributo.plus[data-atributo="${atributo}"]`);
            const btnMenos = document.querySelector(`.btn-atributo.minus[data-atributo="${atributo}"]`);
            const input = document.getElementById(`${atributo}Mod`);
            
            if (btnMais && btnMenos && input) {
                // Evento de aumentar
                btnMais.addEventListener('click', () => {
                    this.alterarAtributoComplementar(atributo, 1);
                });
                
                // Evento de diminuir
                btnMenos.addEventListener('click', () => {
                    this.alterarAtributoComplementar(atributo, -1);
                });
                
                // Evento de input manual
                if (!input.readOnly) {
                    input.addEventListener('change', (e) => {
                        const novoValor = parseInt(e.target.value) || 0;
                        this.estado.atributosComplementares[atributo] = novoValor;
                        this.atualizarDisplayAtributo(atributo, novoValor);
                        this.atualizarTotalAtributosComplementares();
                    });
                }
            }
        });
    }
    
    alterarAtributoComplementar(atributo, direcao) {
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
        this.atualizarTotalAtributosComplementares();
    }
    
    atualizarDisplayAtributo(atributo, valor) {
        const pontos = this.calcularPontosAtributo(atributo, valor);
        const pontosEl = document.getElementById(`pontos${this.capitalize(atributo)}`);
        
        if (pontosEl) {
            pontosEl.textContent = `${pontos} pts`;
            pontosEl.style.color = pontos > 0 ? '#27ae60' : 
                                   pontos < 0 ? '#e74c3c' : '#7f8c8d';
        }
        
        const input = document.getElementById(`${atributo}Mod`);
        if (input) {
            input.style.color = valor > 0 ? '#27ae60' : 
                               valor < 0 ? '#e74c3c' : '#7f8c8d';
            input.style.fontWeight = valor !== 0 ? 'bold' : 'normal';
        }
    }
    
    calcularPontosAtributo(atributo, nivel) {
        const custos = {
            vontade: 5,
            percepcao: 5,
            pv: 2,
            pf: 3,
            velocidade: 20,
            deslocamento: 5
        };
        
        const custoPorNivel = custos[atributo] || 5;
        return nivel * custoPorNivel;
    }
    
    atualizarTotalAtributosComplementares() {
        let totalPontos = 0;
        
        Object.entries(this.estado.atributosComplementares).forEach(([atributo, nivel]) => {
            totalPontos += this.calcularPontosAtributo(atributo, nivel);
        });
        
        const badgeTotal = document.getElementById('pontosAtributosComplementares');
        if (badgeTotal) {
            badgeTotal.textContent = `${totalPontos >= 0 ? '+' : ''}${totalPontos} pts`;
            badgeTotal.className = 'pontos-badge ' + (totalPontos >= 0 ? 'positivo' : 'negativo');
        }
        
        // Disparar evento para pontos-manager
        this.dispararEventoAtributosComplementares(totalPontos);
    }
    
    configurarIdiomas() {
        const btnAdicionarIdioma = document.getElementById('btnAdicionarIdioma');
        const nomeInput = document.getElementById('novoIdiomaNome');
        const falaSelect = document.getElementById('novoIdiomaFala');
        const escritaSelect = document.getElementById('novoIdiomaEscrita');
        const previewCusto = document.getElementById('custoIdiomaPreview');
        
        if (!btnAdicionarIdioma || !nomeInput || !falaSelect || !escritaSelect || !previewCusto) return;
        
        // Atualizar preview
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
        
        nomeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && nomeInput.value.trim()) {
                this.adicionarIdioma();
            }
        });
        
        // Configurar alfabetização
        this.configurarAlfabetizacao();
        
        atualizarPreview();
    }
    
    configurarAlfabetizacao() {
        const radios = document.querySelectorAll('input[name="alfabetizacao"]');
        if (radios.length === 0) return;
        
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const pontos = parseInt(e.target.value);
                    this.estado.alfabetizacao = pontos;
                    this.atualizarDisplayAlfabetizacao(pontos);
                    this.atualizarTotalIdiomas();
                }
            });
        });
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
        
        if (this.estado.idiomas.some(i => i.nome.toLowerCase() === nome.toLowerCase())) {
            alert('Este idioma já foi adicionado!');
            return;
        }
        
        const idioma = {
            nome: nome,
            fala: fala,
            escrita: escrita,
            total: total
        };
        
        this.estado.idiomas.push(idioma);
        this.atualizarListaIdiomas();
        this.atualizarTotalIdiomas();
        
        nomeInput.value = '';
        falaSelect.value = '6';
        escritaSelect.value = '0';
        nomeInput.focus();
    }
    
    atualizarListaIdiomas() {
        const listaContainer = document.getElementById('listaIdiomasAdicionais');
        if (!listaContainer) return;
        
        // Limpar container
        listaContainer.innerHTML = '';
        
        // Adicionar todos os itens
        this.estado.idiomas.forEach((idioma, index) => {
            const item = document.createElement('div');
            item.className = 'idioma-item';
            item.id = `idioma-${index}`;
            
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
        
        // Se não houver itens, mostrar mensagem
        if (this.estado.idiomas.length === 0) {
            listaContainer.innerHTML = '<div class="empty-state">Nenhum idioma adicional adicionado</div>';
        }
        
        // Configurar botões de remover
        listaContainer.querySelectorAll('.btn-remover-idioma').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removerIdioma(index);
            });
        });
    }
    
    atualizarTotalIdiomas() {
        let totalPontos = 0;
        
        // Somar pontos dos idiomas
        this.estado.idiomas.forEach(idioma => {
            totalPontos += idioma.total;
        });
        
        // Adicionar alfabetização
        totalPontos += this.estado.alfabetizacao;
        
        const badgeIdiomas = document.getElementById('pontosIdiomas');
        if (badgeIdiomas) {
            badgeIdiomas.textContent = `${totalPontos >= 0 ? '+' : ''}${totalPontos} pts`;
            badgeIdiomas.className = 'pontos-badge ' + (totalPontos >= 0 ? 'positivo' : 'negativo');
        }
        
        const contador = document.getElementById('totalIdiomas');
        if (contador) {
            contador.textContent = this.estado.idiomas.length;
        }
        
        // Disparar evento para pontos-manager
        this.dispararEventoIdiomas(totalPontos);
    }
    
    // ================= EVENTOS PARA PONTOS-MANAGER =================
    
    dispararEventoAparência(pontos) {
        // Aparência pode ser vantagem ou desvantagem
        const evento = pontos >= 0 ? 'vantagemAdicionada' : 'desvantagemAdicionada';
        document.dispatchEvent(new CustomEvent(evento, {
            detail: {
                tipo: 'aparência',
                pontos: Math.abs(pontos),
                origem: 'vantagens-logica'
            }
        }));
    }
    
    dispararEventoAtributosComplementares(totalPontos) {
        if (totalPontos > 0) {
            // É vantagem
            document.dispatchEvent(new CustomEvent('vantagemAdicionada', {
                detail: {
                    tipo: 'atributosComplementares',
                    pontos: totalPontos,
                    origem: 'vantagens-logica'
                }
            }));
        } else if (totalPontos < 0) {
            // É desvantagem
            document.dispatchEvent(new CustomEvent('desvantagemAdicionada', {
                detail: {
                    tipo: 'atributosComplementares',
                    pontos: Math.abs(totalPontos),
                    origem: 'vantagens-logica'
                }
            }));
        }
    }
    
    dispararEventoIdiomas(totalPontos) {
        if (totalPontos > 0) {
            // Vantagem (idiomas avançados)
            document.dispatchEvent(new CustomEvent('vantagemAdicionada', {
                detail: {
                    tipo: 'idiomas',
                    pontos: totalPontos,
                    origem: 'vantagens-logica'
                }
            }));
        } else if (totalPontos < 0) {
            // Desvantagem (analfabetismo ou idiomas ruins)
            document.dispatchEvent(new CustomEvent('desvantagemAdicionada', {
                detail: {
                    tipo: 'idiomas',
                    pontos: Math.abs(totalPontos),
                    origem: 'vantagens-logica'
                }
            }));
        }
    }
    
    sincronizarComPontosManager() {
        // Sincronizar todos os valores atuais
        this.dispararEventoAparência(this.estado.aparência);
        
        const totalAtributos = Object.entries(this.estado.atributosComplementares)
            .reduce((total, [atributo, nivel]) => total + this.calcularPontosAtributo(atributo, nivel), 0);
        this.dispararEventoAtributosComplementares(totalAtributos);
        
        let totalIdiomas = this.estado.idiomas.reduce((sum, i) => sum + i.total, 0);
        totalIdiomas += this.estado.alfabetizacao;
        this.dispararEventoIdiomas(totalIdiomas);
    }
    
    // ================= UTILITÁRIOS =================
    
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
        
        return tipo === 'fala' ? (mapFala[pontos] || 'Desconhecido') : (mapEscrita[pontos] || 'Desconhecido');
    }
    
    atualizarDisplayAparência(pontos) {
        const badge = document.getElementById('pontosAparencia');
        if (badge) {
            badge.textContent = `${pontos >= 0 ? '+' : ''}${pontos} pts`;
            badge.className = 'pontos-badge ' + (pontos >= 0 ? 'positivo' : 'negativo');
        }
        
        const display = document.getElementById('displayAparencia');
        if (display) {
            const descricao = this.getDescricaoAparência(pontos);
            display.innerHTML = `
                <div><strong>${descricao.nome}</strong></div>
                <div style="font-size: 0.9em; color: var(--text-light); opacity: 0.8; margin-top: 5px;">
                    ${descricao.descricao}
                </div>
            `;
        }
    }
    
    getDescricaoAparência(pontos) {
        const map = {
            '-24': { nome: 'Horrendo', descricao: 'Aparência terrível' },
            '-20': { nome: 'Monstruoso', descricao: 'Aparência monstruosa' },
            '-16': { nome: 'Hediondo', descricao: 'Muito feio' },
            '-8': { nome: 'Feio', descricao: 'Feio' },
            '-4': { nome: 'Sem Atrativos', descricao: 'Sem atrativos' },
            '0': { nome: 'Comum', descricao: 'Aparência normal' },
            '4': { nome: 'Atraente', descricao: 'Bonito' },
            '12': { nome: 'Elegante', descricao: 'Muito bonito' },
            '16': { nome: 'Muito Elegante', descricao: 'Extremamente bonito' },
            '20': { nome: 'Lindo', descricao: 'Beleza excepcional' }
        };
        
        return map[pontos.toString()] || { nome: 'Desconhecido', descricao: 'Valor não reconhecido' };
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
    
    removerIdioma(index) {
        if (index < 0 || index >= this.estado.idiomas.length) return;
        
        this.estado.idiomas.splice(index, 1);
        this.atualizarListaIdiomas();
        this.atualizarTotalIdiomas();
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    obterResumo() {
        return { ...this.estado };
    }
    
    resetar() {
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
        
        this.inicializarValores();
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

// Inicializar quando a aba for ativada
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Se já estiver na aba de vantagens
    if (document.getElementById('vantagens')?.classList.contains('active')) {
        setTimeout(() => {
            inicializarVantagensLogic();
        }, 500);
    }
});

// Exportar
window.VantagensLogic = VantagensLogic;
window.inicializarVantagensLogic = inicializarVantagensLogic;
window.getVantagensLogic = () => vantagensLogicInstance;