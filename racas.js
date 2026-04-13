// ============================================
// SISTEMA DE RAÇAS - RPGFORCE
// ============================================

const racasDisponiveis = {
    anao: {
        id: 'anao',
        nome: 'Anão',
        icone: 'fa-dwarf',
        iconeGrande: 'fa-dwarf',
        custoPontos: 4,
        modificadoresAtributos: { st: 3, vt: 1, vigor: 1 },
        vantagemAutomatica: 'corpoResistente',
        desvantagensAutomaticas: ['nanismo', 'avareza'],
        modificadorCarga: { leve: 2.5, medio: 5.0, pesado: 9.0, limite: 13.0 },
        modificadorDeslocamento: { andar: -1, correrPercentual: -25 },
        bonusPericias: { 'armasHaste': 3, 'armaria': 2, 'arco': -2, 'arremesso': -2, 'funda': -2 },
        descricao: 'Anões são conhecidos por sua robustez, força e resistência incomparáveis.',
        descricaoCompleta: `
            <h4><i class="fas fa-fist-raised"></i> Características dos Anões</h4>
            <p>Anões são uma raça estoica e resistente, conhecida por sua força física e tenacidade inabalável.</p>
            <h4><i class="fas fa-coins"></i> Custo</h4>
            <p><strong>4 pontos de atributo</strong></p>
            <h4><i class="fas fa-chart-line"></i> Modificadores</h4>
            <ul><li>ST +3</li><li>VT +1</li><li>VIGOR +1</li></ul>
            <h4><i class="fas fa-star"></i> Vantagem</h4>
            <ul><li>Corpo Resistente</li></ul>
            <h4><i class="fas fa-skull"></i> Desvantagens</h4>
            <ul><li>Nanismo</li><li>Avareza</li></ul>
            <h4><i class="fas fa-weight-hanging"></i> Carga</h4>
            <ul><li>ST × 2.5 / 5.0 / 9.0 / 13.0</li></ul>
            <h4><i class="fas fa-shoe-prints"></i> Deslocamento</h4>
            <ul><li>Andar -1m</li><li>Correr -25%</li></ul>
        `
    }
};

let racaSelecionadaPreview = null;
let racaAtual = null;

function getGlobalVar(name) {
    if (typeof window !== 'undefined' && window[name] !== undefined) return window[name];
    try { return eval(name); } catch(e) { return null; }
}

function setGlobalVar(name, value) {
    if (typeof window !== 'undefined') window[name] = value;
    try { eval(`${name} = ${JSON.stringify(value)}`); } catch(e) {}
}

function aplicarRacaAoPersonagem(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return false;
    
    // Remove efeitos da raça anterior
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const racaAntiga = racasDisponiveis[racaAtual];
        if (racaAntiga.modificadoresAtributos) {
            for (const [attr, valor] of Object.entries(racaAntiga.modificadoresAtributos)) {
                const attrObj = getGlobalVar('atributos');
                if (attrObj && attrObj[attr]) {
                    attrObj[attr].valor = Math.min(15, Math.max(1, attrObj[attr].valor - valor));
                }
            }
        }
        const vantagens = getGlobalVar('vantagensSelecionadas');
        if (vantagens && racaAntiga.vantagemAutomatica) vantagens.delete(racaAntiga.vantagemAutomatica);
        const desvantagens = getGlobalVar('desvantagensSelecionadas');
        if (desvantagens && racaAntiga.desvantagensAutomaticas) {
            racaAntiga.desvantagensAutomaticas.forEach(d => desvantagens.delete(d));
        }
    }
    
    // Aplica efeitos da nova raça
    const attrObj = getGlobalVar('atributos');
    if (attrObj && raca.modificadoresAtributos) {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (attrObj[attr]) {
                attrObj[attr].valor = Math.min(15, Math.max(1, attrObj[attr].valor + valor));
            }
        }
    }
    
    const vantagens = getGlobalVar('vantagensSelecionadas');
    if (vantagens && raca.vantagemAutomatica) vantagens.add(raca.vantagemAutomatica);
    
    const desvantagens = getGlobalVar('desvantagensSelecionadas');
    if (desvantagens && raca.desvantagensAutomaticas) {
        raca.desvantagensAutomaticas.forEach(d => desvantagens.add(d));
    }
    
    // DESCONTA OS 4 PONTOS
    let pontos = getGlobalVar('pontosIniciais');
    if (pontos !== null) {
        pontos = pontos - raca.custoPontos;
        setGlobalVar('pontosIniciais', pontos);
        const inputPontos = document.getElementById('pontosIniciais');
        if (inputPontos) inputPontos.value = pontos;
        
        const atualizarSaldo = getGlobalVar('atualizarSaldoPontos');
        if (typeof atualizarSaldo === 'function') atualizarSaldo();
        
        const atualizarGastos = getGlobalVar('atualizarDisplayGastos');
        if (typeof atualizarGastos === 'function') atualizarGastos();
    }
    
    racaAtual = racaId;
    
    localStorage.setItem(`racaBonusPericias_${racaId}`, JSON.stringify(raca.bonusPericias));
    localStorage.setItem(`racaModificadorCarga_${racaId}`, JSON.stringify(raca.modificadorCarga));
    localStorage.setItem(`racaModificadorDeslocamento_${racaId}`, JSON.stringify(raca.modificadorDeslocamento));
    
    // Atualiza interface
    const atualizarInterface = getGlobalVar('atualizarInterface');
    if (typeof atualizarInterface === 'function') atualizarInterface();
    
    const atualizarContadores = getGlobalVar('atualizarContadoresAbas');
    if (typeof atualizarContadores === 'function') atualizarContadores();
    
    const atualizarLimites = getGlobalVar('atualizarLimitesCards');
    if (typeof atualizarLimites === 'function') atualizarLimites();
    
    const atualizarDisplayRacaFn = getGlobalVar('atualizarDisplayRaca');
    if (typeof atualizarDisplayRacaFn === 'function') atualizarDisplayRacaFn();
    else atualizarDisplayRaca();
    
    document.querySelectorAll('.vantagem-card').forEach(card => {
        if (raca.vantagemAutomatica === card.dataset.vantagem) card.classList.add('selecionada');
    });
    document.querySelectorAll('.desvantagem-card').forEach(card => {
        if (raca.desvantagensAutomaticas?.includes(card.dataset.desvantagem)) card.classList.add('selecionada');
    });
    
    const renderizarPericias = getGlobalVar('renderizarPericiasAdquiridas');
    if (typeof renderizarPericias === 'function') renderizarPericias();
    
    const triggerSave = getGlobalVar('triggerAutoSave');
    if (typeof triggerSave === 'function') triggerSave();
    
    alert(`Raça ${raca.nome} aplicada! Foram consumidos ${raca.custoPontos} pontos.`);
    return true;
}

function removerRacaDoPersonagem() {
    if (!racaAtual) return false;
    const raca = racasDisponiveis[racaAtual];
    if (!raca) return false;
    
    const attrObj = getGlobalVar('atributos');
    if (attrObj && raca.modificadoresAtributos) {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (attrObj[attr]) {
                attrObj[attr].valor = Math.min(15, Math.max(1, attrObj[attr].valor - valor));
            }
        }
    }
    
    const vantagens = getGlobalVar('vantagensSelecionadas');
    if (vantagens && raca.vantagemAutomatica) vantagens.delete(raca.vantagemAutomatica);
    
    const desvantagens = getGlobalVar('desvantagensSelecionadas');
    if (desvantagens && raca.desvantagensAutomaticas) {
        raca.desvantagensAutomaticas.forEach(d => desvantagens.delete(d));
    }
    
    let pontos = getGlobalVar('pontosIniciais');
    if (pontos !== null) {
        pontos = pontos + raca.custoPontos;
        setGlobalVar('pontosIniciais', pontos);
        const inputPontos = document.getElementById('pontosIniciais');
        if (inputPontos) inputPontos.value = pontos;
        
        const atualizarSaldo = getGlobalVar('atualizarSaldoPontos');
        if (typeof atualizarSaldo === 'function') atualizarSaldo();
        
        const atualizarGastos = getGlobalVar('atualizarDisplayGastos');
        if (typeof atualizarGastos === 'function') atualizarGastos();
    }
    
    localStorage.removeItem('racaBonusPericias');
    localStorage.removeItem('racaModificadorCarga');
    localStorage.removeItem('racaModificadorDeslocamento');
    racaAtual = null;
    
    const atualizarInterface = getGlobalVar('atualizarInterface');
    if (typeof atualizarInterface === 'function') atualizarInterface();
    const atualizarContadores = getGlobalVar('atualizarContadoresAbas');
    if (typeof atualizarContadores === 'function') atualizarContadores();
    const atualizarLimites = getGlobalVar('atualizarLimitesCards');
    if (typeof atualizarLimites === 'function') atualizarLimites();
    const atualizarDisplayRacaFn = getGlobalVar('atualizarDisplayRaca');
    if (typeof atualizarDisplayRacaFn === 'function') atualizarDisplayRacaFn();
    else atualizarDisplayRaca();
    const renderizarPericias = getGlobalVar('renderizarPericiasAdquiridas');
    if (typeof renderizarPericias === 'function') renderizarPericias();
    const triggerSave = getGlobalVar('triggerAutoSave');
    if (typeof triggerSave === 'function') triggerSave();
    
    alert(`Raça removida! ${raca.custoPontos} pontos devolvidos.`);
    return true;
}

function getBonusPericiaRaca(periciaId) {
    if (!racaAtual) return 0;
    const raca = racasDisponiveis[racaAtual];
    return (raca && raca.bonusPericias && raca.bonusPericias[periciaId] !== undefined) ? raca.bonusPericias[periciaId] : 0;
}

function getModificadorCargaDaRaca() {
    if (!racaAtual) return { leve: 2, medio: 4, pesado: 8, limite: 12 };
    const raca = racasDisponiveis[racaAtual];
    return raca && raca.modificadorCarga ? raca.modificadorCarga : { leve: 2, medio: 4, pesado: 8, limite: 12 };
}

function getModificadorDeslocamentoDaRaca() {
    if (!racaAtual) return { andar: 0, correrPercentual: 0 };
    const raca = racasDisponiveis[racaAtual];
    return raca && raca.modificadorDeslocamento ? raca.modificadorDeslocamento : { andar: 0, correrPercentual: 0 };
}

function carregarRacasNoGrid() {
    const grid = document.getElementById('racasGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (const [id, raca] of Object.entries(racasDisponiveis)) {
        const card = document.createElement('div');
        card.className = 'raca-card-modal';
        card.dataset.racaId = id;
        card.innerHTML = `
            <i class="fas ${raca.iconeGrande}"></i>
            <h3>${raca.nome}</h3>
            <p>${raca.descricao.substring(0, 80)}...</p>
            <div class="raca-mod-badge">Custo: ${raca.custoPontos} pontos</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.raca-card-modal').forEach(c => c.classList.remove('selecionada-preview'));
            card.classList.add('selecionada-preview');
            racaSelecionadaPreview = id;
            const btnConfirmar = document.getElementById('confirmarRaca');
            if (btnConfirmar) btnConfirmar.disabled = false;
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
    const racaInfo = document.getElementById('racaSelecionadaInfo');
    const racaNomeDisplay = document.getElementById('racaNomeDisplay');
    const racaBonusDisplay = document.getElementById('racaBonusDisplay');
    if (!racaInfo) return;
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const raca = racasDisponiveis[racaAtual];
        racaNomeDisplay.textContent = raca.nome;
        let bonusText = `Custo: ${raca.custoPontos} pontos | ST +${raca.modificadoresAtributos.st}, VT +${raca.modificadoresAtributos.vt}, VIGOR +${raca.modificadoresAtributos.vigor}`;
        racaBonusDisplay.textContent = bonusText;
        racaInfo.style.display = 'flex';
    } else {
        racaInfo.style.display = 'none';
    }
}

function substituirFuncoes() {
    window.calcularLimitesCarga = function() {
        const st = (typeof getSTFixo === 'function') ? getSTFixo() : 5;
        const mod = getModificadorCargaDaRaca();
        return { leve: st * mod.leve, medio: st * mod.medio, pesado: st * mod.pesado, limite: st * mod.limite };
    };
    window.calcularDeslocamento = function() {
        const dx = (typeof getDXFixo === 'function') ? getDXFixo() : 5;
        const vigor = (typeof getVIGORFixo === 'function') ? getVIGORFixo() : 5;
        const mod = getModificadorDeslocamentoDaRaca();
        let andar = (dx + vigor) * 0.1 + mod.andar;
        let correr = (dx + vigor) * 0.3;
        if (mod.correrPercentual !== 0) correr = correr * (1 + mod.correrPercentual / 100);
        const round = v => { const i = Math.floor(v); return (v - i) < 0.5 ? i : i + 1; };
        return { andar: round(andar), correr: round(correr) };
    };
    const originalBonus = window.getBonusPericia || (typeof getBonusPericia !== 'undefined' ? getBonusPericia : null);
    window.getBonusPericia = function(periciaId) {
        let bonus = 0;
        if (typeof originalBonus === 'function') bonus = originalBonus(periciaId) || 0;
        return bonus + getBonusPericiaRaca(periciaId);
    };
}

function inicializarSistemaRacas() {
    substituirFuncoes();
    
    document.getElementById('btnEscolherRaca')?.addEventListener('click', () => {
        carregarRacasNoGrid();
        racaSelecionadaPreview = null;
        const btn = document.getElementById('confirmarRaca');
        if (btn) btn.disabled = true;
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
                const atualizarBotoes = getGlobalVar('atualizarBotoesAtributo');
                if (typeof atualizarBotoes === 'function') {
                    ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => atualizarBotoes(a));
                }
            }
        }
    });
    
    document.getElementById('btnRemoverRaca')?.addEventListener('click', () => {
        if (confirm('Deseja remover a raça do personagem?')) {
            removerRacaDoPersonagem();
            const atualizarBotoes = getGlobalVar('atualizarBotoesAtributo');
            if (typeof atualizarBotoes === 'function') {
                ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => atualizarBotoes(a));
            }
        }
    });
    
    atualizarDisplayRaca();
}

if (typeof window !== 'undefined') {
    window.racasDisponiveis = racasDisponiveis;
    window.racaAtual = racaAtual;
    window.aplicarRacaAoPersonagem = aplicarRacaAoPersonagem;
    window.removerRacaDoPersonagem = removerRacaDoPersonagem;
    window.getBonusPericiaRaca = getBonusPericiaRaca;
    window.getModificadorCargaDaRaca = getModificadorCargaDaRaca;
    window.getModificadorDeslocamentoDaRaca = getModificadorDeslocamentoDaRaca;
    window.carregarRacasNoGrid = carregarRacasNoGrid;
    window.atualizarDisplayRaca = atualizarDisplayRaca;
    window.inicializarSistemaRacas = inicializarSistemaRacas;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaRacas);
} else {
    inicializarSistemaRacas();
}