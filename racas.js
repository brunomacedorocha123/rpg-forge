// ============================================
// SISTEMA DE RAÇAS - RPGFORCE
// ARQUIVO: racas.js
// ============================================

const racasDisponiveis = {
    anao: {
        id: 'anao',
        nome: 'Anão',
        iconeGrande: 'fa-dwarf',
        custoPontos: 4,
        modificadoresAtributos: { st: 3, vt: 1, vigor: 1 },
        vantagemAutomatica: 'corpoResistente',
        desvantagensAutomaticas: ['nanismo', 'avareza'],
        modificadorCarga: { leve: 2.5, medio: 5.0, pesado: 9.0, limite: 13.0 },
        modificadorDeslocamento: { andar: -1, correrPercentual: -25 },
        bonusPericias: {
            'armasHaste': 3,
            'armaria': 2,
            'arco': -2,
            'arremesso': -2,
            'funda': -2
        },
        descricao: 'Anões são conhecidos por sua robustez, força e resistência.',
        descricaoCompleta: `
            <h4><i class="fas fa-fist-raised"></i> Características dos Anões</h4>
            <p>Anões são uma raça estoica e resistente.</p>
            <h4><i class="fas fa-coins"></i> Custo: 4 pontos</h4>
            <h4><i class="fas fa-chart-line"></i> Modificadores</h4>
            <ul><li>ST +3</li><li>VT +1</li><li>VIGOR +1</li></ul>
            <h4><i class="fas fa-star"></i> Vantagem: Corpo Resistente</h4>
            <h4><i class="fas fa-skull"></i> Desvantagens: Nanismo, Avareza</h4>
            <h4><i class="fas fa-weight-hanging"></i> Carga: ST × 2.5/5.0/9.0/13.0</h4>
            <h4><i class="fas fa-shoe-prints"></i> Deslocamento: -1 andar, -25% correr</h4>
            <h4><i class="fas fa-brain"></i> Perícias: Arma Haste +3%, Armaria +2%</h4>
            <h4><i class="fas fa-ban"></i> Redutores: Arco -2%, Arremesso -2%, Funda -2%</h4>
        `
    }
};

let racaSelecionadaPreview = null;
let racaAtual = null;

// ============================================
// APLICAR RAÇA
// ============================================

function aplicarRacaAoPersonagem(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return false;
    
    // Verifica saldo
    let saldoAtual = window.saldoPontos;
    if (saldoAtual < raca.custoPontos) {
        alert(`Pontos insuficientes! Precisa de ${raca.custoPontos} pontos. Você tem ${saldoAtual}.`);
        return false;
    }
    
    // ===== REMOVE RAÇA ANTERIOR =====
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const antiga = racasDisponiveis[racaAtual];
        if (antiga.modificadoresAtributos) {
            window.atributos.st.valor -= antiga.modificadoresAtributos.st || 0;
            window.atributos.vt.valor -= antiga.modificadoresAtributos.vt || 0;
            window.atributos.vigor.valor -= antiga.modificadoresAtributos.vigor || 0;
            window.atributos.st.valor = Math.min(15, Math.max(1, window.atributos.st.valor));
            window.atributos.vt.valor = Math.min(15, Math.max(1, window.atributos.vt.valor));
            window.atributos.vigor.valor = Math.min(15, Math.max(1, window.atributos.vigor.valor));
        }
        window.vantagensSelecionadas.delete(antiga.vantagemAutomatica);
        antiga.desvantagensAutomaticas?.forEach(d => window.desvantagensSelecionadas.delete(d));
    }
    
    // ===== APLICA NOVA RAÇA =====
    // Atributos
    window.atributos.st.valor += raca.modificadoresAtributos.st;
    window.atributos.vt.valor += raca.modificadoresAtributos.vt;
    window.atributos.vigor.valor += raca.modificadoresAtributos.vigor;
    window.atributos.st.valor = Math.min(15, Math.max(1, window.atributos.st.valor));
    window.atributos.vt.valor = Math.min(15, Math.max(1, window.atributos.vt.valor));
    window.atributos.vigor.valor = Math.min(15, Math.max(1, window.atributos.vigor.valor));
    
    // Vantagens e Desvantagens
    window.vantagensSelecionadas.add(raca.vantagemAutomatica);
    raca.desvantagensAutomaticas.forEach(d => window.desvantagensSelecionadas.add(d));
    
    // ===== DESCONTA DO SALDO =====
    window.saldoPontos = window.saldoPontos - raca.custoPontos;
    const saldoSpan = document.getElementById('saldoPontos');
    if (saldoSpan) saldoSpan.textContent = window.saldoPontos;
    
    // ===== SALVA NO LOCALSTORAGE =====
    localStorage.setItem('racaAtual', racaId);
    localStorage.setItem('racaModificadorCarga', JSON.stringify(raca.modificadorCarga));
    localStorage.setItem('racaModificadorDeslocamento', JSON.stringify(raca.modificadorDeslocamento));
    localStorage.setItem('racaBonusPericias', JSON.stringify(raca.bonusPericias));
    
    racaAtual = racaId;
    
    // ===== ATUALIZA INTERFACE =====
    if (typeof window.atualizarInterface === 'function') window.atualizarInterface();
    if (typeof window.atualizarContadoresAbas === 'function') window.atualizarContadoresAbas();
    if (typeof window.atualizarLimitesCards === 'function') window.atualizarLimitesCards();
    if (typeof window.renderizarPericiasAdquiridas === 'function') window.renderizarPericiasAdquiridas();
    if (typeof atualizarDisplayRaca === 'function') atualizarDisplayRaca();
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    
    // Atualiza cards visuais
    document.querySelectorAll('.vantagem-card').forEach(card => {
        if (raca.vantagemAutomatica === card.dataset.vantagem) card.classList.add('selecionada');
    });
    document.querySelectorAll('.desvantagem-card').forEach(card => {
        if (raca.desvantagensAutomaticas.includes(card.dataset.desvantagem)) card.classList.add('selecionada');
    });
    
    alert(`Raça ${raca.nome} aplicada! ${raca.custoPontos} pontos consumidos.`);
    return true;
}

// ============================================
// REMOVER RAÇA
// ============================================

function removerRacaDoPersonagem() {
    if (!racaAtual) return false;
    const raca = racasDisponiveis[racaAtual];
    if (!raca) return false;
    
    // Remove atributos
    window.atributos.st.valor -= raca.modificadoresAtributos.st;
    window.atributos.vt.valor -= raca.modificadoresAtributos.vt;
    window.atributos.vigor.valor -= raca.modificadoresAtributos.vigor;
    window.atributos.st.valor = Math.min(15, Math.max(1, window.atributos.st.valor));
    window.atributos.vt.valor = Math.min(15, Math.max(1, window.atributos.vt.valor));
    window.atributos.vigor.valor = Math.min(15, Math.max(1, window.atributos.vigor.valor));
    
    // Remove vantagens/desvantagens
    window.vantagensSelecionadas.delete(raca.vantagemAutomatica);
    raca.desvantagensAutomaticas.forEach(d => window.desvantagensSelecionadas.delete(d));
    
    // Devolve pontos
    window.saldoPontos = window.saldoPontos + raca.custoPontos;
    const saldoSpan = document.getElementById('saldoPontos');
    if (saldoSpan) saldoSpan.textContent = window.saldoPontos;
    
    // Limpa localStorage
    localStorage.removeItem('racaAtual');
    localStorage.removeItem('racaModificadorCarga');
    localStorage.removeItem('racaModificadorDeslocamento');
    localStorage.removeItem('racaBonusPericias');
    
    racaAtual = null;
    
    // Atualiza interface
    if (typeof window.atualizarInterface === 'function') window.atualizarInterface();
    if (typeof window.atualizarContadoresAbas === 'function') window.atualizarContadoresAbas();
    if (typeof window.atualizarLimitesCards === 'function') window.atualizarLimitesCards();
    if (typeof window.renderizarPericiasAdquiridas === 'function') window.renderizarPericiasAdquiridas();
    if (typeof atualizarDisplayRaca === 'function') atualizarDisplayRaca();
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    
    alert(`Raça removida! ${raca.custoPontos} pontos devolvidos.`);
    return true;
}

// ============================================
// BÔNUS DE PERÍCIAS
// ============================================

function getBonusPericiaRaca(periciaId) {
    if (!racaAtual) return 0;
    const raca = racasDisponiveis[racaAtual];
    return raca?.bonusPericias?.[periciaId] || 0;
}

function getModificadorCargaDaRaca() {
    if (!racaAtual) return { leve: 2, medio: 4, pesado: 8, limite: 12 };
    const raca = racasDisponiveis[racaAtual];
    return raca?.modificadorCarga || { leve: 2, medio: 4, pesado: 8, limite: 12 };
}

function getModificadorDeslocamentoDaRaca() {
    if (!racaAtual) return { andar: 0, correrPercentual: 0 };
    const raca = racasDisponiveis[racaAtual];
    return raca?.modificadorDeslocamento || { andar: 0, correrPercentual: 0 };
}

// ============================================
// FUNÇÕES DE UI
// ============================================

function carregarRacasNoGrid() {
    const grid = document.getElementById('racasGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (const [id, raca] of Object.entries(racasDisponiveis)) {
        const card = document.createElement('div');
        card.className = 'raca-card-modal';
        card.innerHTML = `
            <i class="fas ${raca.iconeGrande}"></i>
            <h3>${raca.nome}</h3>
            <p>${raca.descricao}</p>
            <div class="raca-mod-badge">Custo: ${raca.custoPontos} pontos</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.raca-card-modal').forEach(c => c.classList.remove('selecionada-preview'));
            card.classList.add('selecionada-preview');
            racaSelecionadaPreview = id;
            document.getElementById('confirmarRaca').disabled = false;
        });
        grid.appendChild(card);
    }
}

function abrirVisualizacaoRaca(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return;
    document.getElementById('visualizarTitulo').textContent = raca.nome;
    document.getElementById('visualizarIcone').className = `fas ${raca.iconeGrande}`;
    document.getElementById('visualizarDescricao').innerHTML = raca.descricaoCompleta;
    document.getElementById('modalVisualizarRaca').classList.add('active');
}

function fecharVisualizacaoRaca() {
    document.getElementById('modalVisualizarRaca').classList.remove('active');
}

function atualizarDisplayRaca() {
    const info = document.getElementById('racaSelecionadaInfo');
    if (!info) return;
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const raca = racasDisponiveis[racaAtual];
        document.getElementById('racaNomeDisplay').textContent = raca.nome;
        document.getElementById('racaBonusDisplay').textContent = `Custo: ${raca.custoPontos} | ST +${raca.modificadoresAtributos.st}, VT +${raca.modificadoresAtributos.vt}, VIGOR +${raca.modificadoresAtributos.vigor}`;
        info.style.display = 'flex';
    } else {
        info.style.display = 'none';
    }
}

// ============================================
// SUBSTITUIR FUNÇÕES ORIGINAIS
// ============================================

function substituirFuncoes() {
    // Substitui cálculo de carga
    window.calcularLimitesCarga = function() {
        const st = window.getSTFixo();
        const mod = getModificadorCargaDaRaca();
        return {
            leve: st * mod.leve,
            medio: st * mod.medio,
            pesado: st * mod.pesado,
            limite: st * mod.limite
        };
    };
    
    // Substitui cálculo de deslocamento
    window.calcularDeslocamento = function() {
        const dx = window.getDXFixo();
        const vigor = window.getVIGORFixo();
        const mod = getModificadorDeslocamentoDaRaca();
        let andar = (dx + vigor) * 0.1 + mod.andar;
        let correr = (dx + vigor) * 0.3;
        if (mod.correrPercentual !== 0) correr *= (1 + mod.correrPercentual / 100);
        const round = v => { const i = Math.floor(v); return (v - i) < 0.5 ? i : i + 1; };
        return { andar: round(andar), correr: round(correr) };
    };
    
    // Substitui cálculo de bônus de perícia
    const originalBonus = window.getBonusPericia;
    window.getBonusPericia = function(periciaId) {
        let bonus = originalBonus ? originalBonus(periciaId) || 0 : 0;
        bonus += getBonusPericiaRaca(periciaId);
        return bonus;
    };
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function inicializarSistemaRacas() {
    setTimeout(() => {
        substituirFuncoes();
        
        // Botões
        document.getElementById('btnEscolherRaca')?.addEventListener('click', () => {
            carregarRacasNoGrid();
            racaSelecionadaPreview = null;
            document.getElementById('confirmarRaca').disabled = true;
            document.getElementById('modalRacas').classList.add('active');
        });
        
        document.getElementById('fecharModalRacas')?.addEventListener('click', () => {
            document.getElementById('modalRacas').classList.remove('active');
        });
        
        document.getElementById('cancelarRaca')?.addEventListener('click', () => {
            document.getElementById('modalRacas').classList.remove('active');
            racaSelecionadaPreview = null;
        });
        
        document.getElementById('confirmarRaca')?.addEventListener('click', () => {
            if (racaSelecionadaPreview) abrirVisualizacaoRaca(racaSelecionadaPreview);
        });
        
        document.getElementById('voltarSelecaoRacas')?.addEventListener('click', () => {
            fecharVisualizacaoRaca();
        });
        
        document.getElementById('confirmarRacaModal')?.addEventListener('click', () => {
            if (racaSelecionadaPreview) {
                if (aplicarRacaAoPersonagem(racaSelecionadaPreview)) {
                    fecharVisualizacaoRaca();
                    document.getElementById('modalRacas').classList.remove('active');
                    racaSelecionadaPreview = null;
                    ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => window.atualizarBotoesAtributo?.(a));
                }
            }
        });
        
        document.getElementById('btnRemoverRaca')?.addEventListener('click', () => {
            if (confirm('Remover a raça?')) {
                removerRacaDoPersonagem();
                ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => window.atualizarBotoesAtributo?.(a));
            }
        });
        
        // Recupera raça salva
        const salva = localStorage.getItem('racaAtual');
        if (salva && racasDisponiveis[salva]) {
            racaAtual = salva;
            atualizarDisplayRaca();
        }
        
        atualizarDisplayRaca();
    }, 100);
}

// ============================================
// EXPORTA
// ============================================

if (typeof window !== 'undefined') {
    window.racasDisponiveis = racasDisponiveis;
    window.aplicarRacaAoPersonagem = aplicarRacaAoPersonagem;
    window.removerRacaDoPersonagem = removerRacaDoPersonagem;
    window.getBonusPericiaRaca = getBonusPericiaRaca;
    window.getModificadorCargaDaRaca = getModificadorCargaDaRaca;
    window.getModificadorDeslocamentoDaRaca = getModificadorDeslocamentoDaRaca;
    window.inicializarSistemaRacas = inicializarSistemaRacas;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaRacas);
} else {
    inicializarSistemaRacas();
}