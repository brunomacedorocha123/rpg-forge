// ============================================
// SISTEMA DE RAÇAS - RPGForce
// ============================================

const racas = {
    anao: {
        id: 'anao',
        nome: 'Anão',
        descricao: 'Povo robusto das montanhas, conhecido por sua resistência, habilidade com forjas e teimosia inabalável. São baixos, fortes e extremamente resilientes.',
        
        custo: 4,
        
        modificadoresAtributos: {
            st: 3,
            vt: 1,
            vigor: 1
        },
        
        vantagens: ['corpoResistente'],
        desvantagens: ['nanismo', 'avareza'],
        
        bonusPericias: {
            'armasHaste': 3,
            'armaria': 3
        },
        
        penalidadesPericias: {
            'arco': -2,
            'besta': -2,
            'arremesso': -2,
            'funda': -2
        },
        
        modificadoresDeslocamento: {
            andar: -1,
            correr: -25
        },
        
        limitesCarga: {
            leve: 2.5,
            medio: 5.0,
            pesado: 9.0,
            limite: 13.0
        }
    }
};

let racaSelecionada = null;

function aplicarRaca(racaId) {
    const raca = racas[racaId];
    if (!raca) return false;
    
    if (saldoPontos < raca.custo) {
        alert(`Pontos insuficientes! Você precisa de ${raca.custo} pontos.`);
        return false;
    }
    
    if (raca.modificadoresAtributos.st) {
        atributos.st.valor = Math.min(15, atributos.st.valor + raca.modificadoresAtributos.st);
    }
    if (raca.modificadoresAtributos.vt) {
        atributos.vt.valor = Math.min(15, atributos.vt.valor + raca.modificadoresAtributos.vt);
    }
    if (raca.modificadoresAtributos.vigor) {
        atributos.vigor.valor = Math.min(15, atributos.vigor.valor + raca.modificadoresAtributos.vigor);
    }
    
    if (raca.vantagens) {
        raca.vantagens.forEach(vantagemId => {
            if (!vantagensSelecionadas.has(vantagemId)) {
                vantagensSelecionadas.add(vantagemId);
                const card = document.querySelector(`.vantagem-card[data-vantagem="${vantagemId}"]`);
                if (card) card.classList.add('selecionada');
            }
        });
    }
    
    if (raca.desvantagens) {
        raca.desvantagens.forEach(desvantagemId => {
            if (!desvantagensSelecionadas.has(desvantagemId)) {
                desvantagensSelecionadas.add(desvantagemId);
                const card = document.querySelector(`.desvantagem-card[data-desvantagem="${desvantagemId}"]`);
                if (card) card.classList.add('selecionada');
            }
        });
    }
    
    pontosIniciais -= raca.custo;
    if (elements.pontosIniciaisInput) {
        elements.pontosIniciaisInput.value = pontosIniciais;
    }
    
    racaSelecionada = {
        id: racaId,
        nome: raca.nome,
        dados: raca
    };
    
    const racaDisplay = document.getElementById('racaDisplay');
    if (racaDisplay) {
        racaDisplay.textContent = raca.nome;
        racaDisplay.style.color = '#ffd700';
    }
    
    const racaSelecionadaInput = document.getElementById('racaSelecionada');
    if (racaSelecionadaInput) {
        racaSelecionadaInput.value = raca.nome;
    }
    
    atualizarInterface();
    atualizarContadoresAbas();
    atualizarLimitesCards();
    atualizarBotoesAtributo('st');
    atualizarBotoesAtributo('vt');
    atualizarBotoesAtributo('vigor');
    renderizarPericiasAdquiridas();
    atualizarDeslocamentoPorRaca();
    atualizarLimitesCargaPorRaca();
    
    triggerAutoSave();
    return true;
}

function getBonusPericiaPorRaca(periciaId) {
    if (!racaSelecionada) return 0;
    const bonus = racaSelecionada.dados.bonusPericias || {};
    return bonus[periciaId] || 0;
}

function getPenalidadePericiaPorRaca(periciaId) {
    if (!racaSelecionada) return 0;
    const penalidades = racaSelecionada.dados.penalidadesPericias || {};
    return penalidades[periciaId] || 0;
}

function calcularDeslocamentoComRaca() {
    const deslocBase = calcularDeslocamento();
    let andar = deslocBase.andar;
    let correr = deslocBase.correr;
    
    if (racaSelecionada && racaSelecionada.dados.modificadoresDeslocamento) {
        const mod = racaSelecionada.dados.modificadoresDeslocamento;
        if (mod.andar) andar = Math.max(1, andar + mod.andar);
        if (mod.correr) {
            const reducao = Math.abs(mod.correr) / 100;
            correr = correr - (correr * reducao);
            correr = Math.max(1, Math.floor(correr));
        }
    }
    return { andar, correr };
}

function atualizarDeslocamentoPorRaca() {
    const desloc = calcularDeslocamentoComRaca();
    const carga = calcularCarga();
    const andarFinal = Math.max(1, desloc.andar - carga.reducaoDeslocamento);
    const correrFinal = Math.max(3, desloc.correr - (carga.reducaoDeslocamento * 3));
    
    if (elements.deslocamentoAndar) elements.deslocamentoAndar.textContent = andarFinal.toFixed(1);
    if (elements.deslocamentoCorrer) elements.deslocamentoCorrer.textContent = correrFinal.toFixed(1);
}

function getLimitesCargaPorRaca() {
    if (racaSelecionada && racaSelecionada.dados.limitesCarga) {
        return racaSelecionada.dados.limitesCarga;
    }
    const st = getSTFixo();
    return { leve: st * 2, medio: st * 4, pesado: st * 8, limite: st * 12 };
}

function atualizarLimitesCargaPorRaca() {
    const limites = getLimitesCargaPorRaca();
    if (elements.stCarga) {
        elements.stCarga.textContent = `Carga: ${limites.leve}/${limites.medio}/${limites.pesado}/${limites.limite} kg`;
    }
    if (elements.cargaLimite) elements.cargaLimite.textContent = limites.limite;
    
    const carga = calcularCarga();
    if (elements.cargaAtual) elements.cargaAtual.textContent = carga.pesoTotal.toFixed(1);
    if (elements.cargaBarra) {
        const percentual = (carga.pesoTotal / limites.limite) * 100;
        elements.cargaBarra.style.width = Math.min(100, percentual) + '%';
    }
    if (elements.cargaNivel) {
        elements.cargaNivel.textContent = carga.nivel.charAt(0).toUpperCase() + carga.nivel.slice(1);
        elements.cargaNivel.className = `carga-nivel ${carga.nivel}`;
    }
}

function isVantagemObrigatoria(vantagemId) {
    if (!racaSelecionada) return false;
    const vantagens = racaSelecionada.dados.vantagens || [];
    return vantagens.includes(vantagemId);
}

function isDesvantagemObrigatoria(desvantagemId) {
    if (!racaSelecionada) return false;
    const desvantagens = racaSelecionada.dados.desvantagens || [];
    return desvantagens.includes(desvantagemId);
}

function abrirModalRaca() {
    if (racaSelecionada) {
        alert(`Você já escolheu a raça ${racaSelecionada.nome}. Não é possível trocar.`);
        return;
    }
    
    const modal = document.getElementById('modalRaca');
    if (!modal) return;
    
    const container = document.getElementById('listaRacas');
    if (container) {
        container.innerHTML = '';
        
        Object.entries(racas).forEach(([id, raca]) => {
            const div = document.createElement('div');
            div.className = 'raca-item';
            div.innerHTML = `
                <h4>${raca.nome}</h4>
                <p>${raca.descricao}</p>
                <div class="raca-bonus">
                    <strong>Bônus:</strong><br>
                    ${raca.modificadoresAtributos.st ? `• +${raca.modificadoresAtributos.st} ST<br>` : ''}
                    ${raca.modificadoresAtributos.vt ? `• +${raca.modificadoresAtributos.vt} VT<br>` : ''}
                    ${raca.modificadoresAtributos.vigor ? `• +${raca.modificadoresAtributos.vigor} VIGOR<br>` : ''}
                    ${raca.vantagens ? `• Vantagem: ${raca.vantagens.join(', ')}<br>` : ''}
                    ${raca.desvantagens ? `• Desvantagens: ${raca.desvantagens.join(', ')}<br>` : ''}
                </div>
                <div class="raca-custo"><strong>Custo: ${raca.custo} pontos</strong></div>
                <button class="btn-selecionar-raca" data-raca-id="${id}">Selecionar ${raca.nome}</button>
            `;
            container.appendChild(div);
        });
        
        document.querySelectorAll('.btn-selecionar-raca').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const racaId = btn.dataset.racaId;
                const raca = racas[racaId];
                const confirmar = confirm(
                    `Confirmar raça ${raca.nome}?\n\n` +
                    `Bônus: +${raca.modificadoresAtributos.st || 0} ST, +${raca.modificadoresAtributos.vt || 0} VT, +${raca.modificadoresAtributos.vigor || 0} VIGOR\n` +
                    `Vantagens: ${raca.vantagens?.join(', ') || 'nenhuma'}\n` +
                    `Desvantagens: ${raca.desvantagens?.join(', ') || 'nenhuma'}\n` +
                    `Custo: ${raca.custo} pontos\n\n` +
                    `Após confirmar, NÃO será possível desfazer.`
                );
                if (confirmar && aplicarRaca(racaId)) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    modal.classList.add('active');
}

function fecharModalRaca() {
    const modal = document.getElementById('modalRaca');
    if (modal) modal.classList.remove('active');
}

const originalGetBonusPericia = window.getBonusPericia;
window.getBonusPericia = function(periciaId) {
    let bonus = originalGetBonusPericia ? originalGetBonusPericia(periciaId) : 0;
    bonus += getBonusPericiaPorRaca(periciaId);
    bonus += getPenalidadePericiaPorRaca(periciaId);
    return bonus;
};

const originalCalcularLimitesCarga = window.calcularLimitesCarga;
window.calcularLimitesCarga = function() {
    if (racaSelecionada && racaSelecionada.dados.limitesCarga) {
        return racaSelecionada.dados.limitesCarga;
    }
    return originalCalcularLimitesCarga ? originalCalcularLimitesCarga() : { leve: 0, medio: 0, pesado: 0, limite: 0 };
};

const originalCalcularDeslocamento = window.calcularDeslocamento;
window.calcularDeslocamento = function() {
    const desloc = originalCalcularDeslocamento ? originalCalcularDeslocamento() : { andar: 0, correr: 0 };
    if (racaSelecionada && racaSelecionada.dados.modificadoresDeslocamento) {
        const mod = racaSelecionada.dados.modificadoresDeslocamento;
        if (mod.andar) desloc.andar = Math.max(1, desloc.andar + mod.andar);
        if (mod.correr) {
            const reducao = Math.abs(mod.correr) / 100;
            desloc.correr = desloc.correr - (desloc.correr * reducao);
            desloc.correr = Math.max(1, Math.floor(desloc.correr));
        }
    }
    return desloc;
};