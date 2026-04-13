// ============================================
// SISTEMA DE RAÇAS - RPGForce (SOMENTE ANÃO)
// ============================================

// ============================================
// DADOS DA RAÇA ANÃO
// ============================================
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

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let racaAtual = "humano";
let bonusRacaAplicado = false;
let atributosOriginais = null;

// ============================================
// FUNÇÃO PARA APLICAR BÔNUS DA RAÇA
// ============================================
function aplicarBonusRaca(racaId) {
    const raca = racasData[racaId];
    if (!raca) return false;
    
    // Guarda valores originais antes de aplicar bônus
    if (!atributosOriginais && bonusRacaAplicado === false) {
        atributosOriginais = {
            st: atributos.st.valor,
            dx: atributos.dx.valor,
            iq: atributos.iq.valor,
            vigor: atributos.vigor.valor,
            vt: atributos.vt.valor
        };
    }
    
    // Se já tem bônus aplicado, remove primeiro
    if (bonusRacaAplicado && racaAtual !== "humano") {
        removerBonusRaca();
    }
    
    // Aplica bônus de atributos
    atributos.st.valor += raca.bonusAtributos.st;
    atributos.dx.valor += raca.bonusAtributos.dx;
    atributos.iq.valor += raca.bonusAtributos.iq;
    atributos.vigor.valor += raca.bonusAtributos.vigor;
    atributos.vt.valor += raca.bonusAtributos.vt;
    
    // Limita entre 1 e 15
    atributos.st.valor = Math.min(15, Math.max(1, atributos.st.valor));
    atributos.dx.valor = Math.min(15, Math.max(1, atributos.dx.valor));
    atributos.iq.valor = Math.min(15, Math.max(1, atributos.iq.valor));
    atributos.vigor.valor = Math.min(15, Math.max(1, atributos.vigor.valor));
    atributos.vt.valor = Math.min(15, Math.max(1, atributos.vt.valor));
    
    // Aplica vantagens automáticas
    raca.vantagens.forEach(vantagem => {
        if (!vantagensSelecionadas.has(vantagem)) {
            vantagensSelecionadas.add(vantagem);
            // Marca o card visualmente
            const card = document.querySelector(`.vantagem-card[data-vantagem="${vantagem}"]`);
            if (card) card.classList.add('selecionada');
        }
    });
    
    // Aplica desvantagens automáticas
    raca.desvantagens.forEach(desvantagem => {
        if (!desvantagensSelecionadas.has(desvantagem)) {
            desvantagensSelecionadas.add(desvantagem);
            // Marca o card visualmente
            const card = document.querySelector(`.desvantagem-card[data-desvantagem="${desvantagem}"]`);
            if (card) card.classList.add('selecionada');
        }
    });
    
    // Subtrai os pontos do saldo (custo da raça)
    if (typeof pontosIniciais !== 'undefined') {
        pontosIniciais = pontosIniciais - raca.custoPontos;
        if (elements.pontosIniciaisInput) {
            elements.pontosIniciaisInput.value = pontosIniciais;
        }
        // Força atualização do saldo
        if (typeof atualizarSaldoPontos === 'function') {
            atualizarSaldoPontos();
            atualizarDisplayGastos();
        }
    }
    
    bonusRacaAplicado = true;
    racaAtual = racaId;
    
    // Atualiza toda a interface
    if (typeof atualizarInterface === 'function') {
        atualizarInterface();
    }
    if (typeof atualizarBotoesAtributo === 'function') {
        ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(attr => {
            atualizarBotoesAtributo(attr);
        });
    }
    if (typeof atualizarContadoresAbas === 'function') {
        atualizarContadoresAbas();
    }
    if (typeof atualizarLimitesCards === 'function') {
        atualizarLimitesCards();
    }
    if (typeof renderizarPericiasAdquiridas === 'function') {
        renderizarPericiasAdquiridas();
    }
    
    return true;
}

// ============================================
// FUNÇÃO PARA REMOVER BÔNUS DA RAÇA
// ============================================
function removerBonusRaca() {
    if (!atributosOriginais) return false;
    
    const raca = racasData[racaAtual];
    if (!raca || racaAtual === "humano") return false;
    
    // Remove bônus de atributos
    atributos.st.valor = atributosOriginais.st;
    atributos.dx.valor = atributosOriginais.dx;
    atributos.iq.valor = atributosOriginais.iq;
    atributos.vigor.valor = atributosOriginais.vigor;
    atributos.vt.valor = atributosOriginais.vt;
    
    // Remove vantagens automáticas
    raca.vantagens.forEach(vantagem => {
        if (vantagensSelecionadas.has(vantagem)) {
            vantagensSelecionadas.delete(vantagem);
            const card = document.querySelector(`.vantagem-card[data-vantagem="${vantagem}"]`);
            if (card) card.classList.remove('selecionada');
        }
    });
    
    // Remove desvantagens automáticas
    raca.desvantagens.forEach(desvantagem => {
        if (desvantagensSelecionadas.has(desvantagem)) {
            desvantagensSelecionadas.delete(desvantagem);
            const card = document.querySelector(`.desvantagem-card[data-desvantagem="${desvantagem}"]`);
            if (card) card.classList.remove('selecionada');
        }
    });
    
    // Devolve os pontos do saldo
    if (typeof pontosIniciais !== 'undefined') {
        pontosIniciais = pontosIniciais + raca.custoPontos;
        if (elements.pontosIniciaisInput) {
            elements.pontosIniciaisInput.value = pontosIniciais;
        }
        if (typeof atualizarSaldoPontos === 'function') {
            atualizarSaldoPontos();
            atualizarDisplayGastos();
        }
    }
    
    bonusRacaAplicado = false;
    racaAtual = "humano";
    
    return true;
}

// ============================================
// FUNÇÃO PARA CONFIRMAR SELEÇÃO DE RAÇA
// ============================================
function confirmarRaca(racaId) {
    if (racaId === racaAtual && bonusRacaAplicado) {
        fecharModalRaca();
        return;
    }
    
    // Confirmação se já tem bônus aplicado
    if (bonusRacaAplicado && racaAtual !== "humano") {
        if (!confirm(`Trocar de ${racasData[racaAtual].nome} para ${racasData[racaId].nome} irá remover os bônus atuais. Confirmar?`)) {
            return;
        }
    }
    
    // Aplica a nova raça
    aplicarBonusRaca(racaId);
    
    // Atualiza o campo de texto
    const campoRaca = document.getElementById('campoRaca');
    if (campoRaca) {
        campoRaca.value = racasData[racaId].nome;
    }
    
    // Fecha o modal
    fecharModalRaca();
    
    // Mostra mensagem de sucesso
    mostrarToast(`${racasData[racaId].nome} selecionado! Bônus aplicados.`);
}

// ============================================
// FUNÇÃO PARA ABRIR MODAL DE RAÇAS
// ============================================
function abrirModalRaca() {
    let modal = document.getElementById('modalRacas');
    
    // Se o modal não existe, cria
    if (!modal) {
        criarModalRacas();
        modal = document.getElementById('modalRacas');
    }
    
    // Atualiza o conteúdo com os dados atuais
    atualizarModalRacaConteudo();
    
    modal.classList.add('active');
}

function criarModalRacas() {
    const modalHTML = `
        <div class="modal" id="modalRacas">
            <div class="modal-content" style="max-width: 600px; max-height: 85vh; overflow-y: auto;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">
                    <i class="fas fa-users"></i> Escolha sua Raça
                </h3>
                
                <!-- Raça Humano -->
                <div class="raca-card" data-raca="humano" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,215,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="color: #ffd700; font-size: 1.2rem;">Humano</h4>
                        <span style="background: #4CAF50; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem;">Custo: 0 pontos</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Raça neutra, sem bônus ou penalidades. Versátil e adaptável.</p>
                    <div style="font-size: 0.85rem; color: #aaa;">Sem bônus especiais</div>
                </div>
                
                <!-- Raça Anão -->
                <div class="raca-card" data-raca="anao" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,215,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="color: #ffd700; font-size: 1.2rem;">Anão</h4>
                        <span style="background: #ff9800; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem;">Custo: 4 pontos</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Baixos, robustos e teimosos. Fortes e resistentes.</p>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px; margin-top: 10px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
                            <div><span style="color: #4CAF50;">✓ ST +3</span></div>
                            <div><span style="color: #4CAF50;">✓ VT +1</span></div>
                            <div><span style="color: #4CAF50;">✓ VIGOR +1</span></div>
                            <div><span style="color: #4CAF50;">✓ Corpo Resistente</span></div>
                            <div><span style="color: #ff6b6b;">✗ Avareza</span></div>
                            <div><span style="color: #ff6b6b;">✗ Nanismo</span></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.8rem; color: #aaa;">
                            <div>Carga especial: 2.5 / 5.0 / 9.0 / 13.0 kg</div>
                            <div>Deslocamento: -1 andar, -25% correr</div>
                            <div>Perícias: Arma Haste +3%, Armaria +2%, Funda/Arco/Arremesso -2%</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-secondary" id="cancelarRaca" style="flex: 1;">Cancelar</button>
                    <button class="btn-primary" id="confirmarRaca" style="flex: 1;">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Eventos dos cards
    document.querySelectorAll('.raca-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.raca-card').forEach(c => {
                c.style.borderColor = 'rgba(255,215,0,0.3)';
                c.style.background = 'rgba(0,0,0,0.3)';
            });
            card.style.borderColor = '#ffd700';
            card.style.background = 'rgba(255,215,0,0.1)';
            card.dataset.selected = 'true';
            
            document.querySelectorAll('.raca-card').forEach(c => {
                if (c !== card) delete c.dataset.selected;
            });
        });
    });
    
    document.getElementById('cancelarRaca').addEventListener('click', fecharModalRaca);
    document.getElementById('confirmarRaca').addEventListener('click', () => {
        const selected = document.querySelector('.raca-card[data-selected="true"]');
        if (selected) {
            const racaId = selected.dataset.raca;
            confirmarRaca(racaId);
        } else {
            alert('Selecione uma raça primeiro!');
        }
    });
}

function atualizarModalRacaConteudo() {
    // Destaca a raça atual no modal
    document.querySelectorAll('.raca-card').forEach(card => {
        card.style.borderColor = 'rgba(255,215,0,0.3)';
        card.style.background = 'rgba(0,0,0,0.3)';
        if (card.dataset.raca === racaAtual) {
            card.style.borderColor = '#ffd700';
            card.style.background = 'rgba(255,215,0,0.1)';
            card.dataset.selected = 'true';
        } else {
            delete card.dataset.selected;
        }
    });
}

function fecharModalRaca() {
    const modal = document.getElementById('modalRacas');
    if (modal) modal.classList.remove('active');
}

// ============================================
// FUNÇÃO PARA MOSTRAR TOAST (MENSAGEM TEMPORÁRIA)
// ============================================
function mostrarToast(mensagem) {
    let toast = document.getElementById('toastRaca');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastRaca';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4CAF50, #2e7d32);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
            opacity: 0;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensagem;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// ============================================
// FUNÇÃO PARA CRIAR O CAMPO DE RAÇA NA INTERFACE
// ============================================
function criarCampoRaca() {
    // Procura onde inserir (após o campo de classe)
    const classeGroup = document.querySelector('.form-group:has(#classePersonagem)');
    
    if (classeGroup && classeGroup.parentElement) {
        const racaHTML = `
            <div class="form-group" style="position: relative;">
                <label for="campoRaca"><i class="fas fa-dragon"></i> Raça</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="campoRaca" value="Humano" readonly 
                           style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,215,0,0.3); border-radius: 15px; padding: 12px 15px; color: #ffd700; font-weight: bold; cursor: pointer;">
                    <button type="button" id="btnAbrirRacas" 
                            style="background: rgba(255,215,0,0.1); border: 2px solid #ffd700; border-radius: 15px; width: 50px; cursor: pointer; color: #ffd700; font-size: 1.2rem;">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <small style="color: rgba(255,255,255,0.5); display: block; margin-top: 5px;">
                    <i class="fas fa-info-circle"></i> A raça influencia atributos, vantagens e custo de pontos
                </small>
            </div>
        `;
        
        classeGroup.parentElement.insertAdjacentHTML('beforeend', racaHTML);
        
        // Adiciona eventos
        document.getElementById('btnAbrirRacas')?.addEventListener('click', abrirModalRaca);
        document.getElementById('campoRaca')?.addEventListener('click', abrirModalRaca);
    }
}

// ============================================
// FUNÇÃO PARA CALCULAR CARGA ESPECIAL DO ANÃO
// ============================================
function calcularCargaAnao(st) {
    const limites = {
        leve: 2.5,
        medio: 5.0,
        pesado: 9.0,
        limite: 13.0
    };
    
    return limites;
}

// ============================================
// FUNÇÃO PARA APLICAR BÔNUS DE PERÍCIAS DO ANÃO
// ============================================
function getBonusPericiaRaca(periciaId) {
    if (racaAtual === 'anao' && racasData.anao.bonusPericias[periciaId]) {
        return racasData.anao.bonusPericias[periciaId];
    }
    return 0;
}

// ============================================
// INICIALIZAR SISTEMA DE RAÇAS
// ============================================
function initSistemaRacas() {
    criarCampoRaca();
    
    // Sobrescreve a função getBonusPericia original para incluir bônus de raça
    if (typeof window.getBonusPericiaOriginal === 'undefined') {
        window.getBonusPericiaOriginal = window.getBonusPericia;
        window.getBonusPericia = function(periciaId) {
            let bonus = 0;
            if (window.getBonusPericiaOriginal) {
                bonus = window.getBonusPericiaOriginal(periciaId);
            }
            bonus += getBonusPericiaRaca(periciaId);
            return bonus;
        };
    }
    
    // Sobrescreve a função calcularLimitesCarga para incluir carga especial do anão
    if (typeof window.calcularLimitesCargaOriginal === 'undefined') {
        window.calcularLimitesCargaOriginal = window.calcularLimitesCarga;
        window.calcularLimitesCarga = function() {
            if (racaAtual === 'anao' && racasData.anao.cargaEspecial) {
                return racasData.anao.cargaEspecial;
            }
            if (window.calcularLimitesCargaOriginal) {
                return window.calcularLimitesCargaOriginal();
            }
            const st = getSTFixo();
            return {
                leve: st * 2,
                medio: st * 4,
                pesado: st * 8,
                limite: st * 12
            };
        };
    }
    
    // Sobrescreve a função calcularDeslocamento para incluir bônus do anão
    if (typeof window.calcularDeslocamentoOriginal === 'undefined') {
        window.calcularDeslocamentoOriginal = window.calcularDeslocamento;
        window.calcularDeslocamento = function() {
            let desloc = { andar: 0, correr: 0 };
            if (window.calcularDeslocamentoOriginal) {
                desloc = window.calcularDeslocamentoOriginal();
            }
            
            if (racaAtual === 'anao') {
                desloc.andar += racasData.anao.deslocamento.andar;
                if (desloc.andar < 1) desloc.andar = 1;
                
                const reducao = Math.floor(desloc.correr * racasData.anao.deslocamento.correrPercentual / 100);
                desloc.correr += reducao;
                if (desloc.correr < 2) desloc.correr = 2;
            }
            
            return desloc;
        };
    }
}

// ============================================
// EXPORTA FUNÇÕES PARA USO GLOBAL
// ============================================
window.initSistemaRacas = initSistemaRacas;
window.aplicarBonusRaca = aplicarBonusRaca;
window.removerBonusRaca = removerBonusRaca;
window.confirmarRaca = confirmarRaca;
window.abrirModalRaca = abrirModalRaca;
window.getBonusPericiaRaca = getBonusPericiaRaca;
window.racaAtual = racaAtual;
window.racasData = racasData;

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSistemaRacas);
} else {
    initSistemaRacas();
}