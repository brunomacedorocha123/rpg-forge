// ============================================
// SISTEMA DE RAÇAS - RPGFORCE
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
        bonusPericias: { 'armasHaste': 3, 'armaria': 2, 'arco': -2, 'arremesso': -2, 'funda': -2 },
        descricao: 'Anões são conhecidos por sua robustez, força e resistência.',
        descricaoCompleta: `
            <h4>Características dos Anões</h4>
            <p>Anões são uma raça estoica e resistente.</p>
            <h4>Custo: 4 pontos</h4>
            <h4>Modificadores</h4>
            <ul><li>ST +3</li><li>VT +1</li><li>VIGOR +1</li></ul>
            <h4>Vantagem: Corpo Resistente</h4>
            <h4>Desvantagens: Nanismo, Avareza</h4>
        `
    }
};

let racaSelecionadaPreview = null;
let racaAtual = null;

function aplicarRacaAoPersonagem(racaId) {
    const raca = racasDisponiveis[racaId];
    if (!raca) return false;
    
    // Verifica se tem pontos suficientes
    if (window.saldoPontos < raca.custoPontos) {
        alert(`Pontos insuficientes! Você precisa de ${raca.custoPontos} pontos.`);
        return false;
    }
    
    // Remove efeitos da raça anterior
    if (racaAtual && racasDisponiveis[racaAtual]) {
        const antiga = racasDisponiveis[racaAtual];
        if (antiga.modificadoresAtributos) {
            for (const [attr, valor] of Object.entries(antiga.modificadoresAtributos)) {
                if (window.atributos[attr]) {
                    window.atributos[attr].valor -= valor;
                    window.atributos[attr].valor = Math.min(15, Math.max(1, window.atributos[attr].valor));
                }
            }
        }
        if (antiga.vantagemAutomatica) window.vantagensSelecionadas.delete(antiga.vantagemAutomatica);
        if (antiga.desvantagensAutomaticas) {
            antiga.desvantagensAutomaticas.forEach(d => window.desvantagensSelecionadas.delete(d));
        }
    }
    
    // Aplica efeitos da nova raça
    if (raca.modificadoresAtributos) {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (window.atributos[attr]) {
                window.atributos[attr].valor += valor;
                window.atributos[attr].valor = Math.min(15, Math.max(1, window.atributos[attr].valor));
            }
        }
    }
    
    window.vantagensSelecionadas.add(raca.vantagemAutomatica);
    raca.desvantagensAutomaticas.forEach(d => window.desvantagensSelecionadas.add(d));
    
    // DESCONTA OS 4 PONTOS
    window.pontosIniciais -= raca.custoPontos;
    document.getElementById('pontosIniciais').value = window.pontosIniciais;
    
    // Atualiza saldo
    window.atualizarSaldoPontos();
    window.atualizarDisplayGastos();
    
    racaAtual = racaId;
    
    // Salva no localStorage
    localStorage.setItem('racaAtual', racaId);
    localStorage.setItem('racaBonusPericias', JSON.stringify(raca.bonusPericias));
    localStorage.setItem('racaModificadorCarga', JSON.stringify(raca.modificadorCarga));
    localStorage.setItem('racaModificadorDeslocamento', JSON.stringify(raca.modificadorDeslocamento));
    
    // Atualiza interface
    window.atualizarInterface();
    window.atualizarContadoresAbas();
    window.atualizarLimitesCards();
    atualizarDisplayRaca();
    
    // Atualiza cards visuais
    document.querySelectorAll('.vantagem-card').forEach(card => {
        if (raca.vantagemAutomatica === card.dataset.vantagem) card.classList.add('selecionada');
    });
    document.querySelectorAll('.desvantagem-card').forEach(card => {
        if (raca.desvantagensAutomaticas.includes(card.dataset.desvantagem)) card.classList.add('selecionada');
    });
    
    window.renderizarPericiasAdquiridas();
    window.triggerAutoSave();
    
    alert(`Raça ${raca.nome} aplicada! Foram consumidos ${raca.custoPontos} pontos.`);
    return true;
}

function removerRacaDoPersonagem() {
    if (!racaAtual) return false;
    const raca = racasDisponiveis[racaAtual];
    if (!raca) return false;
    
    // Remove modificadores
    if (raca.modificadoresAtributos) {
        for (const [attr, valor] of Object.entries(raca.modificadoresAtributos)) {
            if (window.atributos[attr]) {
                window.atributos[attr].valor -= valor;
                window.atributos[attr].valor = Math.min(15, Math.max(1, window.atributos[attr].valor));
            }
        }
    }
    
    window.vantagensSelecionadas.delete(raca.vantagemAutomatica);
    raca.desvantagensAutomaticas.forEach(d => window.desvantagensSelecionadas.delete(d));
    
    // Devolve os pontos
    window.pontosIniciais += raca.custoPontos;
    document.getElementById('pontosIniciais').value = window.pontosIniciais;
    
    window.atualizarSaldoPontos();
    window.atualizarDisplayGastos();
    
    localStorage.removeItem('racaAtual');
    localStorage.removeItem('racaBonusPericias');
    localStorage.removeItem('racaModificadorCarga');
    localStorage.removeItem('racaModificadorDeslocamento');
    
    racaAtual = null;
    
    window.atualizarInterface();
    window.atualizarContadoresAbas();
    window.atualizarLimitesCards();
    atualizarDisplayRaca();
    window.renderizarPericiasAdquiridas();
    window.triggerAutoSave();
    
    alert(`Raça removida! ${raca.custoPontos} pontos devolvidos.`);
    return true;
}

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
        document.getElementById('racaBonusDisplay').textContent = `Custo: ${raca.custoPontos} pontos | ST +${raca.modificadoresAtributos.st}, VT +${raca.modificadoresAtributos.vt}, VIGOR +${raca.modificadoresAtributos.vigor}`;
        info.style.display = 'flex';
    } else {
        info.style.display = 'none';
    }
}

function substituirFuncoes() {
    window.calcularLimitesCarga = function() {
        const st = window.getSTFixo();
        const mod = getModificadorCargaDaRaca();
        return { leve: st * mod.leve, medio: st * mod.medio, pesado: st * mod.pesado, limite: st * mod.limite };
    };
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
    const original = window.getBonusPericia;
    window.getBonusPericia = function(id) {
        let bonus = original ? original(id) || 0 : 0;
        return bonus + getBonusPericiaRaca(id);
    };
}

function inicializarSistemaRacas() {
    // Aguarda o script principal carregar as variáveis
    setTimeout(() => {
        substituirFuncoes();
        
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
                    ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => window.atualizarBotoesAtributo(a));
                }
            }
        });
        
        document.getElementById('btnRemoverRaca')?.addEventListener('click', () => {
            if (confirm('Remover a raça?')) {
                removerRacaDoPersonagem();
                ['st', 'dx', 'iq', 'vigor', 'vt'].forEach(a => window.atualizarBotoesAtributo(a));
            }
        });
        
        // Recupera raça salva
        const racaSalva = localStorage.getItem('racaAtual');
        if (racaSalva && racasDisponiveis[racaSalva]) {
            racaAtual = racaSalva;
            atualizarDisplayRaca();
        }
        
        atualizarDisplayRaca();
    }, 100);
}

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