// ============================================
// SISTEMA DE RAÇAS - RPGForce
// ============================================

// Dados das Raças
const racasData = {
    humano: {
        id: "humano",
        nome: "Humano",
        descricao: "Raça neutra, sem bônus ou penalidades.",
        custoPontos: 0,
        bonusAtributos: { st: 0, dx: 0, iq: 0, vigor: 0, vt: 0 },
        vantagens: [],
        desvantagens: [],
        cargaEspecial: null,
        deslocamento: { andar: 0, correrPercentual: 0 },
        bonusPericias: {}
    },
    anao: {
        id: "anao",
        nome: "Anão",
        descricao: "Baixos, robustos e teimosos. Anões são fortes, resistentes, mas avarentos e de estatura baixa.",
        custoPontos: 4,
        bonusAtributos: {
            st: 3,
            dx: 0,
            iq: 0,
            vigor: 1,
            vt: 1
        },
        vantagens: ["corpoResistente"],
        desvantagens: ["avareza", "nanismo"],
        cargaEspecial: {
            leve: 2.5,
            medio: 5.0,
            pesado: 9.0,
            limite: 13.0
        },
        deslocamento: {
            andar: -1,
            correrPercentual: -25
        },
        bonusPericias: {
            "armasHaste": 3,
            "armaria": 2,
            "funda": -2,
            "arco": -2,
            "arremesso": -2
        }
    }
};

// Variáveis globais do sistema de raças
let racaAtual = "humano";
let atributosBackup = null;
let vantagensBackup = null;
let desvantagensBackup = null;
let pontosIniciaisBackup = null;

// ============================================
// FUNÇÃO PARA CRIAR O CAMPO DE RAÇA NO HTML
// ============================================
function criarCampoRaca() {
    console.log("🔧 Criando campo de raça...");
    
    // Procura o campo de classe
    const campoClasse = document.getElementById('classePersonagem');
    if (!campoClasse) {
        console.error("❌ Campo #classePersonagem não encontrado!");
        return false;
    }
    
    // Procura o .form-group pai do campo de classe
    const formGroupClasse = campoClasse.closest('.form-group');
    if (!formGroupClasse) {
        console.error("❌ .form-group do campo classe não encontrado!");
        return false;
    }
    
    // Procura o .form-row que contém o campo de classe
    const formRowClasse = formGroupClasse.closest('.form-row');
    if (!formRowClasse) {
        console.error("❌ .form-row do campo classe não encontrado!");
        return false;
    }
    
    // Verifica se já existe campo de raça
    if (document.getElementById('campoRaca')) {
        console.log("⚠️ Campo de raça já existe!");
        return true;
    }
    
    // Cria a nova linha para raça
    const novaFormRow = document.createElement('div');
    novaFormRow.className = 'form-row';
    novaFormRow.innerHTML = `
        <div class="form-group">
            <label for="campoRaca"><i class="fas fa-dragon"></i> Raça</label>
            <div style="display: flex; gap: 10px;">
                <input type="text" id="campoRaca" value="Humano" readonly 
                       style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,215,0,0.3); border-radius: 15px; padding: 12px 15px; color: #ffd700; font-weight: bold; cursor: pointer; font-size: 1rem;">
                <button type="button" id="btnAbrirRacas" 
                        style="background: rgba(255,215,0,0.15); border: 2px solid #ffd700; border-radius: 15px; width: 50px; cursor: pointer; color: #ffd700; font-size: 1.2rem; transition: all 0.3s;">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <small style="color: rgba(255,255,255,0.5); display: block; margin-top: 5px;">
                <i class="fas fa-info-circle"></i> A raça influencia atributos, vantagens e custo de pontos
            </small>
        </div>
    `;
    
    // Insere depois da linha da classe
    formRowClasse.parentNode.insertBefore(novaFormRow, formRowClasse.nextSibling);
    
    // Adiciona eventos
    const btnAbrir = document.getElementById('btnAbrirRacas');
    const campoRaca = document.getElementById('campoRaca');
    
    if (btnAbrir) {
        btnAbrir.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalRaca();
        });
        
        // Efeito hover
        btnAbrir.addEventListener('mouseenter', () => {
            btnAbrir.style.background = '#ffd700';
            btnAbrir.style.color = '#0a0a1a';
        });
        btnAbrir.addEventListener('mouseleave', () => {
            btnAbrir.style.background = 'rgba(255,215,0,0.15)';
            btnAbrir.style.color = '#ffd700';
        });
    }
    
    if (campoRaca) {
        campoRaca.addEventListener('click', () => abrirModalRaca());
    }
    
    console.log("✅ Campo de raça criado com sucesso!");
    return true;
}

// ============================================
// FUNÇÃO PARA CRIAR O MODAL DE RAÇAS
// ============================================
function criarModalRacas() {
    // Verifica se já existe
    if (document.getElementById('modalRacas')) {
        return;
    }
    
    const modalHTML = `
        <div class="modal" id="modalRacas">
            <div class="modal-content" style="max-width: 650px; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, #1a1a3a, #0a0a2a); border: 2px solid #ffd700; border-radius: 20px;">
                <h3 style="color: #ffd700; margin-bottom: 20px; font-family: 'MedievalSharp', cursive;">
                    <i class="fas fa-users"></i> Escolha sua Raça
                </h3>
                
                <div id="listaRacasModal">
                    <!-- Humano -->
                    <div class="raca-card" data-raca="humano" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,215,0,0.3);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="color: #ffd700; font-size: 1.2rem; margin: 0;">Humano</h4>
                            <span style="background: #4CAF50; padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; color: white;">Custo: 0 pontos</span>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Raça neutra, sem bônus ou penalidades. Versátil e adaptável.</p>
                        <div style="font-size: 0.85rem; color: #aaa;">Sem bônus especiais</div>
                    </div>
                    
                    <!-- Anão -->
                    <div class="raca-card" data-raca="anao" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,215,0,0.3);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="color: #ffd700; font-size: 1.2rem; margin: 0;">Anão</h4>
                            <span style="background: #ff9800; padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; color: white;">Custo: 4 pontos</span>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Baixos, robustos e teimosos. Fortes e resistentes.</p>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px; margin-top: 10px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem;">
                                <div><span style="color: #4CAF50;">✓ ST +3</span></div>
                                <div><span style="color: #4CAF50;">✓ VT +1</span></div>
                                <div><span style="color: #4CAF50;">✓ VIGOR +1</span></div>
                                <div><span style="color: #4CAF50;">✓ Corpo Resistente</span></div>
                                <div><span style="color: #ff6b6b;">✗ Avareza</span></div>
                                <div><span style="color: #ff6b6b;">✗ Nanismo</span></div>
                            </div>
                            <div style="margin-top: 10px; font-size: 0.8rem; color: #aaa; border-top: 1px solid rgba(255,215,0,0.2); padding-top: 8px;">
                                <div>📦 Carga especial: 2.5 / 5.0 / 9.0 / 13.0 kg</div>
                                <div>🏃 Deslocamento: -1 andar, -25% correr</div>
                                <div>⚔️ Perícias: Arma Haste +3%, Armaria +2%, Funda/Arco/Arremesso -2%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-secondary" id="cancelarRaca" style="flex: 1; background: transparent; border: 2px solid rgba(255,215,0,0.5); color: #ffd700; padding: 10px; border-radius: 30px; cursor: pointer;">Cancelar</button>
                    <button class="btn-primary" id="confirmarRaca" style="flex: 1; background: linear-gradient(45deg, #ffd700, #ffaa00); color: #0a0a1a; padding: 10px; border-radius: 30px; cursor: pointer; font-weight: bold;">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adiciona eventos aos cards
    document.querySelectorAll('.raca-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.raca-card').forEach(c => {
                c.style.borderColor = 'rgba(255,215,0,0.3)';
                c.style.background = 'rgba(0,0,0,0.3)';
            });
            card.style.borderColor = '#ffd700';
            card.style.background = 'rgba(255,215,0,0.15)';
            card.dataset.selected = 'true';
        });
    });
    
    // Eventos dos botões
    document.getElementById('cancelarRaca')?.addEventListener('click', fecharModalRaca);
    document.getElementById('confirmarRaca')?.addEventListener('click', () => {
        const selected = document.querySelector('.raca-card[data-selected="true"]');
        if (selected) {
            const racaId = selected.dataset.raca;
            confirmarRaca(racaId);
        } else {
            mostrarToast('⚠️ Selecione uma raça primeiro!', '#ff9800');
        }
    });
    
    // Fecha modal ao clicar fora
    document.getElementById('modalRacas')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalRacas')) {
            fecharModalRaca();
        }
    });
}

// ============================================
// FUNÇÃO PARA APLICAR BÔNUS DA RAÇA
// ============================================
function aplicarBonusRaca(racaId) {
    const raca = racasData[racaId];
    if (!raca) return false;
    
    // Salva estado atual se for primeira vez
    if (!atributosBackup && racaAtual === "humano") {
        atributosBackup = {
            st: window.atributos?.st?.valor || 5,
            dx: window.atributos?.dx?.valor || 5,
            iq: window.atributos?.iq?.valor || 5,
            vigor: window.atributos?.vigor?.valor || 5,
            vt: window.atributos?.vt?.valor || 5
        };
        vantagensBackup = new Set(window.vantagensSelecionadas);
        desvantagensBackup = new Set(window.desvantagensSelecionadas);
        if (typeof window.pontosIniciais !== 'undefined') {
            pontosIniciaisBackup = window.pontosIniciais;
        }
    }
    
    // Se já tem raça aplicada, remove primeiro
    if (racaAtual !== "humano") {
        removerBonusRaca();
    }
    
    // Aplica bônus de atributos
    if (window.atributos) {
        window.atributos.st.valor += raca.bonusAtributos.st;
        window.atributos.dx.valor += raca.bonusAtributos.dx;
        window.atributos.iq.valor += raca.bonusAtributos.iq;
        window.atributos.vigor.valor += raca.bonusAtributos.vigor;
        window.atributos.vt.valor += raca.bonusAtributos.vt;
        
        // Limita entre 1 e 15
        window.atributos.st.valor = Math.min(15, Math.max(1, window.atributos.st.valor));
        window.atributos.dx.valor = Math.min(15, Math.max(1, window.atributos.dx.valor));
        window.atributos.iq.valor = Math.min(15, Math.max(1, window.atributos.iq.valor));
        window.atributos.vigor.valor = Math.min(15, Math.max(1, window.atributos.vigor.valor));
        window.atributos.vt.valor = Math.min(15, Math.max(1, window.atributos.vt.valor));
    }
    
    // Aplica vantagens automáticas
    raca.vantagens.forEach(vantagem => {
        if (window.vantagensSelecionadas && !window.vantagensSelecionadas.has(vantagem)) {
            window.vantagensSelecionadas.add(vantagem);
            const card = document.querySelector(`.vantagem-card[data-vantagem="${vantagem}"]`);
            if (card) card.classList.add('selecionada');
        }
    });
    
    // Aplica desvantagens automáticas
    raca.desvantagens.forEach(desvantagem => {
        if (window.desvantagensSelecionadas && !window.desvantagensSelecionadas.has(desvantagem)) {
            window.desvantagensSelecionadas.add(desvantagem);
            const card = document.querySelector(`.desvantagem-card[data-desvantagem="${desvantagem}"]`);
            if (card) card.classList.add('selecionada');
        }
    });
    
    // Subtrai pontos do saldo
    if (typeof window.pontosIniciais !== 'undefined') {
        window.pontosIniciais = window.pontosIniciais - raca.custoPontos;
        const pontosInput = document.getElementById('pontosIniciais');
        if (pontosInput) pontosInput.value = window.pontosIniciais;
        
        if (typeof window.atualizarSaldoPontos === 'function') {
            window.atualizarSaldoPontos();
            window.atualizarDisplayGastos();
        }
    }
    
    racaAtual = racaId;
    
    // Atualiza interface
    if (typeof window.atualizarInterface === 'function') {
        window.atualizarInterface();
    }
    if (typeof window.atualizarContadoresAbas === 'function') {
        window.atualizarContadoresAbas();
    }
    if (typeof window.atualizarLimitesCards === 'function') {
        window.atualizarLimitesCards();
    }
    if (typeof window.renderizarPericiasAdquiridas === 'function') {
        window.renderizarPericiasAdquiridas();
    }
    
    // Atualiza botões dos atributos
    ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(attr => {
        if (typeof window.atualizarBotoesAtributo === 'function') {
            window.atualizarBotoesAtributo(attr);
        }
    });
    
    return true;
}

// ============================================
// FUNÇÃO PARA REMOVER BÔNUS DA RAÇA
// ============================================
function removerBonusRaca() {
    if (racaAtual === "humano" || !atributosBackup) return false;
    
    const raca = racasData[racaAtual];
    if (!raca) return false;
    
    // Restaura atributos
    if (window.atributos && atributosBackup) {
        window.atributos.st.valor = atributosBackup.st;
        window.atributos.dx.valor = atributosBackup.dx;
        window.atributos.iq.valor = atributosBackup.iq;
        window.atributos.vigor.valor = atributosBackup.vigor;
        window.atributos.vt.valor = atributosBackup.vt;
    }
    
    // Remove vantagens
    raca.vantagens.forEach(vantagem => {
        if (window.vantagensSelecionadas && window.vantagensSelecionadas.has(vantagem)) {
            window.vantagensSelecionadas.delete(vantagem);
            const card = document.querySelector(`.vantagem-card[data-vantagem="${vantagem}"]`);
            if (card) card.classList.remove('selecionada');
        }
    });
    
    // Remove desvantagens
    raca.desvantagens.forEach(desvantagem => {
        if (window.desvantagensSelecionadas && window.desvantagensSelecionadas.has(desvantagem)) {
            window.desvantagensSelecionadas.delete(desvantagem);
            const card = document.querySelector(`.desvantagem-card[data-desvantagem="${desvantagem}"]`);
            if (card) card.classList.remove('selecionada');
        }
    });
    
    // Devolve pontos
    if (typeof window.pontosIniciais !== 'undefined' && pontosIniciaisBackup !== null) {
        window.pontosIniciais = pontosIniciaisBackup;
        const pontosInput = document.getElementById('pontosIniciais');
        if (pontosInput) pontosInput.value = window.pontosIniciais;
        
        if (typeof window.atualizarSaldoPontos === 'function') {
            window.atualizarSaldoPontos();
            window.atualizarDisplayGastos();
        }
    }
    
    return true;
}

// ============================================
// FUNÇÃO PARA CONFIRMAR SELEÇÃO DE RAÇA
// ============================================
function confirmarRaca(racaId) {
    const raca = racasData[racaId];
    if (!raca) return;
    
    aplicarBonusRaca(racaId);
    
    // Atualiza o campo de texto
    const campoRaca = document.getElementById('campoRaca');
    if (campoRaca) {
        campoRaca.value = raca.nome;
    }
    
    fecharModalRaca();
    mostrarToast(`✅ ${raca.nome} selecionado! Bônus aplicados.`, '#4CAF50');
}

// ============================================
// FUNÇÃO PARA ABRIR MODAL
// ============================================
function abrirModalRaca() {
    criarModalRacas();
    const modal = document.getElementById('modalRacas');
    if (modal) {
        modal.classList.add('active');
        
        // Destaca a raça atual
        document.querySelectorAll('.raca-card').forEach(card => {
            if (card.dataset.raca === racaAtual) {
                card.style.borderColor = '#ffd700';
                card.style.background = 'rgba(255,215,0,0.15)';
                card.dataset.selected = 'true';
            }
        });
    }
}

// ============================================
// FUNÇÃO PARA FECHAR MODAL
// ============================================
function fecharModalRaca() {
    const modal = document.getElementById('modalRacas');
    if (modal) modal.classList.remove('active');
}

// ============================================
// FUNÇÃO PARA MOSTRAR TOAST
// ============================================
function mostrarToast(mensagem, cor = '#4CAF50') {
    let toast = document.getElementById('toastRaca');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastRaca';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${cor};
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
            opacity: 0;
            font-family: 'Inter', sans-serif;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensagem;
    toast.style.background = cor;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// ============================================
// FUNÇÃO PARA CALIBRAR O SISTEMA APÓS CARREGAR
// ============================================
function calibrarSistemaRacas() {
    // Aguarda o sistema principal carregar
    const checkInterval = setInterval(() => {
        if (typeof window.atributos !== 'undefined' && 
            typeof window.vantagensSelecionadas !== 'undefined' &&
            document.getElementById('classePersonagem')) {
            clearInterval(checkInterval);
            console.log("🎯 Sistema principal detectado! Inicializando raças...");
            criarCampoRaca();
        }
    }, 500);
    
    // Timeout após 10 segundos
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!document.getElementById('campoRaca')) {
            console.error("❌ Não foi possível criar o campo de raça!");
        }
    }, 10000);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calibrarSistemaRacas);
} else {
    calibrarSistemaRacas();
}

// Exporta funções para o escopo global (para debug)
window.racasData = racasData;
window.racaAtual = () => racaAtual;
window.aplicarBonusRaca = aplicarBonusRaca;
window.removerBonusRaca = removerBonusRaca;
window.confirmarRaca = confirmarRaca;
window.abrirModalRaca = abrirModalRaca;

console.log("🚀 Sistema de Raças carregado!");