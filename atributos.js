// ===========================================
// ATRIBUTOS.JS - SISTEMA COMPLETO ATUALIZADO
// Compatível com o novo sistema de pontos
// ===========================================

const cargasTable = {
    1: { nenhuma: 0.1, leve: 0.2, media: 0.3, pesada: 0.6, muitoPesada: 1.0 },
    2: { nenhuma: 0.4, leve: 0.8, media: 1.2, pesada: 2.4, muitoPesada: 4.0 },
    3: { nenhuma: 0.9, leve: 1.8, media: 2.7, pesada: 5.4, muitoPesada: 9.0 },
    4: { nenhuma: 1.6, leve: 3.2, media: 4.8, pesada: 9.6, muitoPesada: 16.0 },
    5: { nenhuma: 2.5, leve: 5.0, media: 7.5, pesada: 15.0, muitoPesada: 25.0 },
    6: { nenhuma: 3.6, leve: 7.2, media: 10.8, pesada: 21.6, muitoPesada: 36.0 },
    7: { nenhuma: 4.9, leve: 9.8, media: 14.7, pesada: 29.4, muitoPesada: 49.0 },
    8: { nenhuma: 6.4, leve: 12.8, media: 19.2, pesada: 38.4, muitoPesada: 64.0 },
    9: { nenhuma: 8.1, leve: 16.2, media: 24.3, pesada: 48.6, muitoPesada: 81.0 },
    10: { nenhuma: 10.0, leve: 20.0, media: 30.0, pesada: 60.0, muitoPesada: 100.0 },
    11: { nenhuma: 12.0, leve: 24.0, media: 36.0, pesada: 72.0, muitoPesada: 120.0 },
    12: { nenhuma: 14.5, leve: 29.0, media: 43.5, pesada: 87.0, muitoPesada: 145.0 },
    13: { nenhuma: 17.0, leve: 34.0, media: 51.0, pesada: 102.0, muitoPesada: 170.0 },
    14: { nenhuma: 19.5, leve: 39.0, media: 58.5, pesada: 117.0, muitoPesada: 195.0 },
    15: { nenhuma: 22.5, leve: 45.0, media: 67.5, pesada: 135.0, muitoPesada: 225.0 },
    16: { nenhuma: 25.5, leve: 51.0, media: 76.5, pesada: 153.0, muitoPesada: 255.0 },
    17: { nenhuma: 29.0, leve: 58.0, media: 87.0, pesada: 174.0, muitoPesada: 290.0 },
    18: { nenhuma: 32.5, leve: 65.0, media: 97.5, pesada: 195.0, muitoPesada: 325.0 },
    19: { nenhuma: 36.0, leve: 72.0, media: 108.0, pesada: 216.0, muitoPesada: 360.0 },
    20: { nenhuma: 40.0, leve: 80.0, media: 120.0, pesada: 240.0, muitoPesada: 400.0 }
};

const tabelaDanoST = {
    1: { gdp: "1d-6", geb: "1d-5" }, 2: { gdp: "1d-6", geb: "1d-5" },
    3: { gdp: "1d-5", geb: "1d-4" }, 4: { gdp: "1d-5", geb: "1d-4" },
    5: { gdp: "1d-4", geb: "1d-3" }, 6: { gdp: "1d-4", geb: "1d-3" },
    7: { gdp: "1d-3", geb: "1d-2" }, 8: { gdp: "1d-3", geb: "1d-2" },
    9: { gdp: "1d-2", geb: "1d-1" }, 10: { gdp: "1d-2", geb: "1d" },
    11: { gdp: "1d-1", geb: "1d+1" }, 12: { gdp: "1d", geb: "1d+2" },
    13: { gdp: "1d", geb: "2d-1" }, 14: { gdp: "1d", geb: "2d" },
    15: { gdp: "1d+1", geb: "2d+1" }, 16: { gdp: "1d+1", geb: "2d+2" },
    17: { gdp: "1d+2", geb: "3d-1" }, 18: { gdp: "1d+2", geb: "3d" },
    19: { gdp: "2d-1", geb: "3d+1" }, 20: { gdp: "2d-1", geb: "3d+2" },
    21: { gdp: "2d", geb: "4d-1" }, 22: { gdp: "2d", geb: "4d" },
    23: { gdp: "2d+1", geb: "4d+1" }, 24: { gdp: "2d+1", geb: "4d+2" },
    25: { gdp: "2d+2", geb: "5d-1" }, 26: { gdp: "2d+2", geb: "5d" },
    27: { gdp: "3d-1", geb: "5d+1" }, 28: { gdp: "3d-1", geb: "5d+1" },
    29: { gdp: "3d", geb: "5d+2" }, 30: { gdp: "3d", geb: "5d+2" },
    31: { gdp: "3d+1", geb: "6d-1" }, 32: { gdp: "3d+1", geb: "6d" },
    33: { gdp: "3d+2", geb: "6d+1" }, 34: { gdp: "3d+2", geb: "6d+2" },
    35: { gdp: "4d-1", geb: "7d-1" }, 36: { gdp: "4d-1", geb: "7d" },
    37: { gdp: "4d", geb: "7d+1" }, 38: { gdp: "4d", geb: "7d+2" },
    39: { gdp: "4d+1", geb: "8d-1" }, 40: { gdp: "4d+1", geb: "8d" }
};

let personagemAtributos = {
    ST: 10,
    DX: 10,
    IQ: 10,
    HT: 10,
    bonus: {
        PV: 0,
        PF: 0,
        Vontade: 0,
        Percepcao: 0,
        Deslocamento: 0
    }
};

// ===========================================
// FUNÇÕES DE CONTROLE ATUALIZADAS
// ===========================================

function alterarAtributo(atributo, valor) {
    const input = document.getElementById(atributo);
    if (!input) return;

    let novoValor = parseInt(input.value) + valor;
    if (novoValor < 1) novoValor = 1;
    if (novoValor > 40) novoValor = 40;

    input.value = novoValor;
    personagemAtributos[atributo] = novoValor;

    atualizarTudo();
    enviarEventoAtributosParaSistema(); // NOVO: Envia para o sistema de pontos
}

function ajustarSecundario(atributo, valor) {
    const input = document.getElementById('bonus' + atributo);
    if (!input) return;

    let novoValor;
    if (atributo === 'Deslocamento') {
        novoValor = parseFloat(input.value) + parseFloat(valor);
        novoValor = Math.round(novoValor * 100) / 100;
    } else {
        novoValor = parseInt(input.value) + parseInt(valor);
    }

    if (novoValor < -10) novoValor = -10;
    if (novoValor > 20) novoValor = 20;

    input.value = novoValor;
    personagemAtributos.bonus[atributo] = novoValor;

    input.classList.remove('positivo', 'negativo');
    if (novoValor > 0) input.classList.add('positivo');
    else if (novoValor < 0) input.classList.add('negativo');

    atualizarTotaisSecundarios();
    enviarEventoAtributosParaSistema(); // NOVO: Envia para o sistema de pontos
}

// ===========================================
// FUNÇÃO NOVA: ENVIAR EVENTO PARA SISTEMA DE PONTOS
// ===========================================

function enviarEventoAtributosParaSistema() {
    const totalGastos = calcularCustos();
    
    // ENVIA EVENTO para o novo sistema de pontos
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: {
            pontosGastos: totalGastos,
            ST: personagemAtributos.ST,  // Importante para características físicas
            DX: personagemAtributos.DX,
            IQ: personagemAtributos.IQ,
            HT: personagemAtributos.HT,
            atributos: { ...personagemAtributos }
        }
    }));
    
    console.log('📤 Atributos enviados para sistema de pontos:', totalGastos, 'pts');
    
    // Para compatibilidade com sistema antigo
    if (window.atualizarPontosAba) {
        window.atualizarPontosAba('atributos', totalGastos);
    }
}

// ===========================================
// FUNÇÕES DE ATUALIZAÇÃO ATUALIZADAS
// ===========================================

function atualizarTudo() {
    const ST = personagemAtributos.ST;
    const DX = personagemAtributos.DX;
    const IQ = personagemAtributos.IQ;
    const HT = personagemAtributos.HT;

    // Atualizar valores principais
    document.getElementById('currentST').textContent = ST;
    document.getElementById('currentDX').textContent = DX;
    document.getElementById('currentIQ').textContent = IQ;
    document.getElementById('currentHT').textContent = HT;

    // Atualizar bases dos atributos secundários
    document.getElementById('PVBase').textContent = ST;
    document.getElementById('PFBase').textContent = HT;
    document.getElementById('VontadeBase').textContent = IQ;
    document.getElementById('PercepcaoBase').textContent = IQ;

    const deslocamentoBase = (HT + DX) / 4;
    document.getElementById('DeslocamentoBase').textContent = deslocamentoBase.toFixed(2);

    // Atualizar tabela de dano
    atualizarDanoBase(ST);
    
    // Atualizar cargas
    atualizarCargas(ST);
    
    // Calcular custos
    const totalGastos = calcularCustos();
    
    // Atualizar totais secundários
    atualizarTotaisSecundarios();
    
    // Enviar para sistema de pontos
    enviarEventoAtributosParaSistema(); // NOVO: Envia para o sistema de pontos
}

function formatarCarga(valor) {
    if (Number.isInteger(valor)) return valor.toString();
    
    const num = parseFloat(valor);
    const strValor = num.toFixed(1);
    
    if (strValor.endsWith('.0')) {
        return strValor.split('.')[0];
    }
    
    return strValor;
}

function atualizarCargas(ST) {
    let stKey = ST > 20 ? 20 : (ST < 1 ? 1 : ST);
    const cargas = cargasTable[stKey];
    
    if (cargas) {
        document.getElementById('cargaNenhuma').textContent = formatarCarga(cargas.nenhuma);
        document.getElementById('cargaLeve').textContent = formatarCarga(cargas.leve);
        document.getElementById('cargaMedia').textContent = formatarCarga(cargas.media);
        document.getElementById('cargaPesada').textContent = formatarCarga(cargas.pesada);
        document.getElementById('cargaMuitoPesada').textContent = formatarCarga(cargas.muitoPesada);
    }
}

function atualizarDanoBase(ST) {
    let stKey = ST > 40 ? 40 : (ST < 1 ? 1 : ST);
    const dano = tabelaDanoST[stKey] || tabelaDanoST[10];
    
    if (dano) {
        document.getElementById('danoGDP').textContent = dano.gdp;
        document.getElementById('danoGEB').textContent = dano.geb;
    }
}

function calcularCustos() {
    const ST = personagemAtributos.ST;
    const DX = personagemAtributos.DX;
    const IQ = personagemAtributos.IQ;
    const HT = personagemAtributos.HT;

    // Cálculo correto: abaixo de 10 = custo negativo (ganha pontos)
    const custoST = (ST - 10) * 10;       // ST 9 = (9-10)*10 = -10 (ganha 10 pts)
    const custoDX = (DX - 10) * 20;       // DX 9 = (9-10)*20 = -20 (ganha 20 pts)
    const custoIQ = (IQ - 10) * 20;       // IQ 9 = (9-10)*20 = -20 (ganha 20 pts)
    const custoHT = (HT - 10) * 10;       // HT 9 = (9-10)*10 = -10 (ganha 10 pts)

    const totalGastos = custoST + custoDX + custoIQ + custoHT;

    // Mostrar custos individuais se os elementos existirem
    const elementosCusto = {
        'custoST': custoST,
        'custoDX': custoDX,
        'custoIQ': custoIQ,
        'custoHT': custoHT
    };
    
    Object.keys(elementosCusto).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Formatar com sinal
            let valorFormatado = elementosCusto[id];
            if (valorFormatado > 0) {
                valorFormatado = '+' + valorFormatado;
            }
            elemento.textContent = valorFormatado;
            
            // Adicionar classes de cor
            elemento.classList.remove('positivo', 'negativo');
            if (elementosCusto[id] > 0) {
                elemento.classList.add('positivo');
            } else if (elementosCusto[id] < 0) {
                elemento.classList.add('negativo');
            }
        }
    });

    // Atualizar pontos gastos
    const pontosElement = document.getElementById('pontosGastos');
    if (pontosElement) {
        pontosElement.textContent = totalGastos;
        
        // Limpar classes
        pontosElement.classList.remove('positivo', 'negativo', 'excedido');
        
        // Adicionar classes apropriadas
        if (totalGastos < 0) {
            pontosElement.classList.add('negativo');
        } else if (totalGastos > 0) {
            pontosElement.classList.add('positivo');
        }
        
        if (totalGastos > 150) {
            pontosElement.classList.add('excedido');
        }
    }

    return totalGastos;
}

function atualizarTotaisSecundarios() {
    const pvTotal = Math.max(personagemAtributos.ST + (personagemAtributos.bonus.PV || 0), 1);
    document.getElementById('PVTotal').textContent = pvTotal;

    const pfTotal = Math.max(personagemAtributos.HT + (personagemAtributos.bonus.PF || 0), 1);
    document.getElementById('PFTotal').textContent = pfTotal;

    const vontadeTotal = Math.max(personagemAtributos.IQ + (personagemAtributos.bonus.Vontade || 0), 1);
    document.getElementById('VontadeTotal').textContent = vontadeTotal;

    const percepcaoTotal = Math.max(personagemAtributos.IQ + (personagemAtributos.bonus.Percepcao || 0), 1);
    document.getElementById('PercepcaoTotal').textContent = percepcaoTotal;

    const deslocamentoBase = (personagemAtributos.HT + personagemAtributos.DX) / 4;
    const deslocamentoTotal = Math.max(deslocamentoBase + (personagemAtributos.bonus.Deslocamento || 0), 0).toFixed(2);
    document.getElementById('DeslocamentoTotal').textContent = deslocamentoTotal;
}

// ===========================================
// FUNÇÕES DE RESET/LOAD
// ===========================================

function resetAtributos() {
    personagemAtributos = {
        ST: 10,
        DX: 10,
        IQ: 10,
        HT: 10,
        bonus: {
            PV: 0,
            PF: 0,
            Vontade: 0,
            Percepcao: 0,
            Deslocamento: 0
        }
    };

    // Resetar inputs
    ['ST', 'DX', 'IQ', 'HT'].forEach(atributo => {
        const input = document.getElementById(atributo);
        if (input) {
            input.value = 10;
        }
    });

    // Resetar atributos secundários
    ['PV', 'PF', 'Vontade', 'Percepcao', 'Deslocamento'].forEach(atributo => {
        const input = document.getElementById('bonus' + atributo);
        if (input) {
            input.value = 0;
            input.classList.remove('positivo', 'negativo');
        }
    });

    atualizarTudo();
}

function loadAtributos(dados) {
    if (!dados) return;
    
    // Carregar atributos básicos
    if (dados.ST) personagemAtributos.ST = parseInt(dados.ST) || 10;
    if (dados.DX) personagemAtributos.DX = parseInt(dados.DX) || 10;
    if (dados.IQ) personagemAtributos.IQ = parseInt(dados.IQ) || 10;
    if (dados.HT) personagemAtributos.HT = parseInt(dados.HT) || 10;
    
    // Carregar bônus
    if (dados.bonus) {
        if (dados.bonus.PV) personagemAtributos.bonus.PV = parseInt(dados.bonus.PV) || 0;
        if (dados.bonus.PF) personagemAtributos.bonus.PF = parseInt(dados.bonus.PF) || 0;
        if (dados.bonus.Vontade) personagemAtributos.bonus.Vontade = parseInt(dados.bonus.Vontade) || 0;
        if (dados.bonus.Percepcao) personagemAtributos.bonus.Percepcao = parseInt(dados.bonus.Percepcao) || 0;
        if (dados.bonus.Deslocamento) personagemAtributos.bonus.Deslocamento = parseFloat(dados.bonus.Deslocamento) || 0;
    }
    
    // Atualizar inputs
    document.getElementById('ST').value = personagemAtributos.ST;
    document.getElementById('DX').value = personagemAtributos.DX;
    document.getElementById('IQ').value = personagemAtributos.IQ;
    document.getElementById('HT').value = personagemAtributos.HT;
    
    document.getElementById('bonusPV').value = personagemAtributos.bonus.PV;
    document.getElementById('bonusPF').value = personagemAtributos.bonus.PF;
    document.getElementById('bonusVontade').value = personagemAtributos.bonus.Vontade;
    document.getElementById('bonusPercepcao').value = personagemAtributos.bonus.Percepcao;
    document.getElementById('bonusDeslocamento').value = personagemAtributos.bonus.Deslocamento;
    
    // Aplicar classes de cor nos bônus
    ['PV', 'PF', 'Vontade', 'Percepcao', 'Deslocamento'].forEach(atributo => {
        const input = document.getElementById('bonus' + atributo);
        if (input) {
            const valor = parseFloat(input.value) || 0;
            input.classList.remove('positivo', 'negativo');
            if (valor > 0) input.classList.add('positivo');
            else if (valor < 0) input.classList.add('negativo');
        }
    });
    
    atualizarTudo();
}

// ===========================================
// INICIALIZAÇÃO E EVENTOS
// ===========================================

function inicializarAtributos() {
    // Configurar eventos dos atributos principais
    ['ST', 'DX', 'IQ', 'HT'].forEach(atributo => {
        const input = document.getElementById(atributo);
        if (input) {
            input.addEventListener('change', function() {
                let valor = parseInt(this.value) || 10;
                if (valor < 1) valor = 1;
                if (valor > 40) valor = 40;
                
                this.value = valor;
                personagemAtributos[atributo] = valor;
                atualizarTudo();
            });
        }
    });

    // Configurar botões dos atributos principais
    document.querySelectorAll('.attribute-card').forEach(card => {
        const titulo = card.querySelector('h3').textContent;
        let atributo = '';
        
        if (titulo.includes('ST')) atributo = 'ST';
        else if (titulo.includes('DX')) atributo = 'DX';
        else if (titulo.includes('IQ')) atributo = 'IQ';
        else if (titulo.includes('HT')) atributo = 'HT';
        
        if (atributo) {
            const btnMais = card.querySelector('.btn-attr.plus');
            const btnMenos = card.querySelector('.btn-attr.minus');
            
            if (btnMais) {
                btnMais.onclick = () => alterarAtributo(atributo, 1);
            }
            
            if (btnMenos) {
                btnMenos.onclick = () => alterarAtributo(atributo, -1);
            }
        }
    });

    // Configurar atributos secundários
    ['PV', 'PF', 'Vontade', 'Percepcao', 'Deslocamento'].forEach(atributo => {
        const input = document.getElementById('bonus' + atributo);
        if (input) {
            input.addEventListener('change', function() {
                let valor;
                if (atributo === 'Deslocamento') {
                    valor = parseFloat(this.value) || 0;
                } else {
                    valor = parseInt(this.value) || 0;
                }
                
                if (valor < -10) valor = -10;
                if (valor > 20) valor = 20;
                
                this.value = valor;
                personagemAtributos.bonus[atributo] = valor;
                atualizarTotaisSecundarios();
                
                this.classList.remove('positivo', 'negativo');
                if (valor > 0) this.classList.add('positivo');
                else if (valor < 0) this.classList.add('negativo');
                
                // Atualizar pontos
                enviarEventoAtributosParaSistema();
            });
        }
    });

    // Configurar botões dos atributos secundários
    document.querySelectorAll('.secondary-attr').forEach((attrDiv, index) => {
        const atributos = ['PV', 'PF', 'Vontade', 'Percepcao', 'Deslocamento'];
        const atributo = atributos[index];
        
        if (atributo) {
            const btns = attrDiv.querySelectorAll('.btn-secondary');
            if (btns[0]) btns[0].onclick = () => ajustarSecundario(atributo, -1);
            if (btns[1]) btns[1].onclick = () => ajustarSecundario(atributo, 1);
        }
    });

    // Primeira atualização
    atualizarTudo();
    console.log('✅ Sistema de atributos inicializado e sincronizado com pontos');
}

// ===========================================
// EXPORTAÇÃO PARA USO GLOBAL
// ===========================================

window.initAtributosTab = function() {
    if (document.getElementById('ST')) {
        inicializarAtributos();
    }
};

window.getAtributosPersonagem = () => ({ ...personagemAtributos });
window.calcularCustoAtributos = calcularCustos;
window.resetAtributos = resetAtributos;
window.loadAtributos = loadAtributos;
window.enviarEventoAtributos = enviarEventoAtributosParaSistema;

// ===========================================
// FUNÇÃO DE TESTE
// ===========================================

window.testarAtributos = function() {
    console.log('🧪 TESTANDO ATRIBUTOS');
    console.log('1. Aumentando ST de 10 para 11...');
    
    const inputST = document.getElementById('ST');
    if (inputST) {
        inputST.value = 11;
        personagemAtributos.ST = 11;
        atualizarTudo();
        
        setTimeout(() => {
            console.log('2. Diminuindo DX de 10 para 9...');
            const inputDX = document.getElementById('DX');
            if (inputDX) {
                inputDX.value = 9;
                personagemAtributos.DX = 9;
                atualizarTudo();
                
                setTimeout(() => {
                    const totalGastos = calcularCustos();
                    console.log('📊 RESULTADO:');
                    console.log('- ST: 11 (custa +10 pts)');
                    console.log('- DX: 9 (ganha -20 pts)');
                    console.log('- IQ: 10 (0 pts)');
                    console.log('- HT: 10 (0 pts)');
                    console.log('- Total esperado: +10 -20 = -10 pts');
                    console.log('- Total calculado:', totalGastos, 'pts');
                    
                    if (totalGastos === -10) {
                        console.log('✅ TESTE PASSOU! Atributos funcionando!');
                    } else {
                        console.log('❌ TESTE FALHOU! Pontos incorretos.');
                    }
                }, 300);
            }
        }, 300);
    }
};

// ===========================================
// INICIAR QUANDO A PÁGINA CARREGAR
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('principal')?.classList.contains('active')) {
        window.initAtributosTab();
    }
    
    // Adicionar evento para quando a aba for ativada
    document.addEventListener('tabChanged', function(e) {
        if (e.detail === 'principal') {
            setTimeout(window.initAtributosTab, 50);
        }
    });
});

// ===========================================
// ESTILOS PARA AS CORES
// ===========================================

const style = document.createElement('style');
style.textContent = `
    .positivo {
        color: #27ae60 !important;
        font-weight: bold;
    }
    
    .negativo {
        color: #e74c3c !important;
        font-weight: bold;
    }
    
    .excedido {
        color: #e74c3c !important;
        background-color: #f8d7da !important;
        border-color: #e74c3c !important;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
    
    input.positivo {
        background-color: #d4edda !important;
        border-color: #27ae60 !important;
        color: #155724 !important;
    }
    
    input.negativo {
        background-color: #f8d7da !important;
        border-color: #e74c3c !important;
        color: #721c24 !important;
    }
`;
document.head.appendChild(style);