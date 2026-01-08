// ===========================================
// ATRIBUTOS.JS - SISTEMA INTEGRADO COMPLETO
// ===========================================

// TABELA DE CARGAS CORRETA (COM DECIMAIS EXATOS)
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

// TABELA DE DANO BASE CORRETA
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

// ESTADO DO PERSONAGEM
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
// FUNÇÕES CORRIGIDAS DE FORMATAÇÃO
// ===========================================

function formatarCarga(valor) {
    if (Number.isInteger(valor)) {
        return valor.toString();
    }
    
    const num = parseFloat(valor);
    const strValor = num.toFixed(1);
    
    if (strValor.endsWith('.0')) {
        return strValor.split('.')[0];
    }
    
    return strValor;
}

// ===========================================
// FUNÇÕES PRINCIPAIS
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
    salvarAtributosNoSistema(); // Salva automaticamente
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

    // Aplicar cor
    input.classList.remove('positivo', 'negativo');
    if (novoValor > 0) input.classList.add('positivo');
    else if (novoValor < 0) input.classList.add('negativo');

    atualizarTotaisSecundarios();
    salvarAtributosNoSistema(); // Salva automaticamente
}

// ===========================================
// FUNÇÕES DE ATUALIZAÇÃO
// ===========================================

function atualizarTudo() {
    const ST = personagemAtributos.ST;
    const DX = personagemAtributos.DX;
    const IQ = personagemAtributos.IQ;
    const HT = personagemAtributos.HT;

    // Atualizar ST nos lugares onde aparece
    document.querySelectorAll('#currentST, #currentST2').forEach(el => {
        el.textContent = ST;
    });

    // Atualizar bases dos atributos secundários
    document.getElementById('PVBase').textContent = ST;
    document.getElementById('PFBase').textContent = HT;
    document.getElementById('VontadeBase').textContent = IQ;
    document.getElementById('PercepcaoBase').textContent = IQ;

    const deslocamentoBase = (HT + DX) / 4;
    document.getElementById('DeslocamentoBase').textContent = deslocamentoBase.toFixed(2);

    // Atualizar tabela de dano
    atualizarDanoBase(ST);
    
    // Atualizar cargas COM FORMATAÇÃO CORRETA
    atualizarCargas(ST);
    
    // Calcular custos (INTEGRAÇÃO COM PONTOS MANAGER)
    const totalGastos = calcularCustos();
    
    // Atualizar totais
    atualizarTotaisSecundarios();
    
    // Disparar evento para outros módulos
    document.dispatchEvent(new CustomEvent('atributosAtualizados', {
        detail: {
            ST: ST,
            DX: DX,
            IQ: IQ,
            HT: HT,
            pontosGastos: totalGastos,
            cargas: obterCargasAtuais(),
            danoBase: obterDanoBaseCorreto()
        }
    }));
}

function atualizarCargas(ST) {
    let stKey = ST;
    if (ST > 20) stKey = 20;
    if (ST < 1) stKey = 1;

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
    let stKey = ST;
    if (ST > 40) stKey = 40;
    if (ST < 1) stKey = 1;
    
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

    const custoST = (ST - 10) * 10;
    const custoDX = (DX - 10) * 20;
    const custoIQ = (IQ - 10) * 20;
    const custoHT = (HT - 10) * 10;

    const totalGastos = custoST + custoDX + custoIQ + custoHT;

    document.getElementById('custoST').textContent = custoST;
    document.getElementById('custoDX').textContent = custoDX;
    document.getElementById('custoIQ').textContent = custoIQ;
    document.getElementById('custoHT').textContent = custoHT;

    const pontosElement = document.getElementById('pontosGastos');
    if (pontosElement) {
        pontosElement.textContent = totalGastos;

        pontosElement.classList.remove('excedido');
        if (totalGastos > 150) {
            pontosElement.classList.add('excedido');
            mostrarStatus(`ATENÇÃO: ${totalGastos} pontos gastos (limite: 150)`, 'warning');
        }
    }
    
    // INTEGRAÇÃO COM PONTOS MANAGER - ENVIA OS PONTOS GASTOS
    if (window.atualizarPontosAba) {
        window.atualizarPontosAba('atributos', totalGastos);
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
// SISTEMA DE SALVAMENTO INTEGRADO
// ===========================================

async function salvarAtributosNoSistema() {
    console.log('💾 Salvando atributos no sistema...');
    
    // Preparar dados completos
    const dados = {
        atributos: {
            ST: personagemAtributos.ST,
            DX: personagemAtributos.DX,
            IQ: personagemAtributos.IQ,
            HT: personagemAtributos.HT,
            bonus: { ...personagemAtributos.bonus }
        },
        calculos: {
            custos: {
                ST: (personagemAtributos.ST - 10) * 10,
                DX: (personagemAtributos.DX - 10) * 20,
                IQ: (personagemAtributos.IQ - 10) * 20,
                HT: (personagemAtributos.HT - 10) * 10,
                total: calcularCustos()
            },
            totais: {
                PV: Math.max(personagemAtributos.ST + (personagemAtributos.bonus.PV || 0), 1),
                PF: Math.max(personagemAtributos.HT + (personagemAtributos.bonus.PF || 0), 1),
                Vontade: Math.max(personagemAtributos.IQ + (personagemAtributos.bonus.Vontade || 0), 1),
                Percepcao: Math.max(personagemAtributos.IQ + (personagemAtributos.bonus.Percepcao || 0), 1),
                Deslocamento: calcularDeslocamentoTotal()
            },
            cargas: obterCargasAtuais(),
            danoBase: obterDanoBaseCorreto()
        },
        ultimaAtualizacao: new Date().toISOString(),
        versao: '1.0.0'
    };
    
    function calcularDeslocamentoTotal() {
        const base = (personagemAtributos.HT + personagemAtributos.DX) / 4;
        return Math.max(base + (personagemAtributos.bonus.Deslocamento || 0), 0).toFixed(2);
    }
    
    // Salvar usando o sistema de salvamento
    if (window.salvarModulo) {
        try {
            await window.salvarModulo('atributos', dados);
            console.log('✅ Atributos salvos via sistema');
            mostrarStatus('Atributos salvos', 'success');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar atributos:', error);
            mostrarStatus('Erro ao salvar atributos', 'error');
            return false;
        }
    } else {
        // Fallback para localStorage
        localStorage.setItem('rpgforge_atributos', JSON.stringify(dados));
        console.log('✅ Atributos salvos no localStorage (fallback)');
        return true;
    }
}

async function carregarAtributosDoSistema() {
    console.log('📥 Carregando atributos do sistema...');
    
    let dadosCarregados = null;
    
    // Tentar carregar do sistema de salvamento
    if (window.carregarModulo) {
        dadosCarregados = await window.carregarModulo('atributos');
    }
    
    // Se não encontrou, tentar localStorage
    if (!dadosCarregados) {
        const dadosLocais = localStorage.getItem('rpgforge_atributos');
        if (dadosLocais) {
            try {
                dadosCarregados = JSON.parse(dadosLocais);
            } catch (error) {
                console.error('Erro ao carregar do localStorage:', error);
            }
        }
    }
    
    // Aplicar os dados se encontrou
    if (dadosCarregados && dadosCarregados.atributos) {
        aplicarDadosAtributos(dadosCarregados);
        return true;
    } else {
        console.log('ℹ️ Nenhum dado salvo encontrado, usando valores padrão');
        return false;
    }
}

function aplicarDadosAtributos(dados) {
    console.log('🔄 Aplicando dados dos atributos:', dados);
    
    // Atributos principais
    if (dados.atributos) {
        const attrs = dados.atributos;
        
        ['ST', 'DX', 'IQ', 'HT'].forEach(atributo => {
            if (attrs[atributo] !== undefined) {
                personagemAtributos[atributo] = attrs[atributo];
                const input = document.getElementById(atributo);
                if (input) {
                    input.value = attrs[atributo];
                }
            }
        });
        
        // Bônus
        if (attrs.bonus) {
            Object.keys(personagemAtributos.bonus).forEach(key => {
                if (attrs.bonus[key] !== undefined) {
                    personagemAtributos.bonus[key] = attrs.bonus[key];
                    const input = document.getElementById('bonus' + key);
                    if (input) {
                        input.value = attrs.bonus[key];
                        
                        // Aplicar cor
                        input.classList.remove('positivo', 'negativo');
                        if (attrs.bonus[key] > 0) input.classList.add('positivo');
                        else if (attrs.bonus[key] < 0) input.classList.add('negativo');
                    }
                }
            });
        }
    }
    
    // Atualizar interface
    atualizarTudo();
    console.log('✅ Dados aplicados com sucesso');
}

// ===========================================
// FUNÇÕES AUXILIARES
// ===========================================

function obterCargasAtuais() {
    const ST = personagemAtributos.ST;
    let stKey = ST > 20 ? 20 : (ST < 1 ? 1 : ST);
    return cargasTable[stKey] || cargasTable[10];
}

function obterDanoBaseCorreto() {
    const ST = personagemAtributos.ST;
    let stKey = ST;
    if (ST > 40) stKey = 40;
    if (ST < 1) stKey = 1;
    return tabelaDanoST[stKey] || tabelaDanoST[10];
}

function mostrarStatus(mensagem, tipo = 'info') {
    // Pode usar o sistema do firebase-save.js ou mostrar localmente
    if (window.sistemaSalvamento && window.sistemaSalvamento.mostrarStatus) {
        window.sistemaSalvamento.mostrarStatus(mensagem, tipo);
    } else {
        // Implementação local simples
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
    }
}

// ===========================================
// INICIALIZAÇÃO
// ===========================================

function inicializarAtributos() {
    console.log('🚀 Inicializando sistema de atributos...');
    
    // Configurar eventos dos inputs principais
    ['ST', 'DX', 'IQ', 'HT'].forEach(atributo => {
        const input = document.getElementById(atributo);
        if (input) {
            // Configurar evento change
            input.addEventListener('change', function() {
                let valor = parseInt(this.value) || 10;
                if (valor < 1) valor = 1;
                if (valor > 40) valor = 40;
                
                this.value = valor;
                personagemAtributos[atributo] = valor;
                atualizarTudo();
                salvarAtributosNoSistema();
            });
            
            // Permitir usar as setas do teclado
            input.addEventListener('keyup', function(e) {
                if (e.key === 'ArrowUp') {
                    alterarAtributo(atributo, 1);
                } else if (e.key === 'ArrowDown') {
                    alterarAtributo(atributo, -1);
                }
            });
        }
    });
    
    // Configurar botões de atributos
    document.querySelectorAll('.btn-attr').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.attribute-card');
            if (!parent) return;
            
            const atributo = parent.querySelector('h3').textContent;
            let attrName = '';
            
            if (atributo.includes('ST')) attrName = 'ST';
            else if (atributo.includes('DX')) attrName = 'DX';
            else if (atributo.includes('IQ')) attrName = 'IQ';
            else if (atributo.includes('HT')) attrName = 'HT';
            
            if (attrName && this.classList.contains('plus')) {
                alterarAtributo(attrName, 1);
            } else if (attrName && this.classList.contains('minus')) {
                alterarAtributo(attrName, -1);
            }
        });
    });
    
    // Configurar bônus
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
                
                // Limites
                if (valor < -10) valor = -10;
                if (valor > 20) valor = 20;
                
                this.value = valor;
                personagemAtributos.bonus[atributo] = valor;
                atualizarTotaisSecundarios();
                salvarAtributosNoSistema();
                
                // Aplicar cor
                this.classList.remove('positivo', 'negativo');
                if (valor > 0) this.classList.add('positivo');
                else if (valor < 0) this.classList.add('negativo');
            });
        }
        
        // Configurar botões dos bônus
        const btns = document.querySelectorAll(`.secondary-attr:nth-child(${
            ['PV', 'PF', 'Vontade', 'Percepcao', 'Deslocamento'].indexOf(atributo) + 1
        }) .btn-secondary`);
        
        if (btns.length >= 2) {
            btns[0].addEventListener('click', () => ajustarSecundario(atributo, -1));
            btns[1].addEventListener('click', () => ajustarSecundario(atributo, 1));
        }
    });
    
    // Carregar dados salvos
    setTimeout(() => {
        carregarAtributosDoSistema().then(carregou => {
            if (!carregou) {
                // Primeira execução - garantir que tudo está atualizado
                atualizarTudo();
            }
        });
    }, 1000);
    
    // Escutar eventos de outros módulos
    document.addEventListener('dadosCarregados', (e) => {
        if (e.detail && e.detail.atributos) {
            aplicarDadosAtributos(e.detail.atributos);
        }
    });
    
    console.log('✅ Sistema de atributos inicializado');
}

// ===========================================
// FUNÇÕES PARA O SISTEMA PRINCIPAL
// ===========================================

function initAtributosTab() {
    console.log('🎯 Iniciando aba de atributos');
    
    setTimeout(() => {
        if (document.getElementById('ST')) {
            inicializarAtributos();
        } else {
            console.warn('⚠️ Elementos não encontrados, tentando novamente...');
            setTimeout(initAtributosTab, 500);
        }
    }, 100);
}

// ===========================================
// EXPORTAR FUNÇÕES PARA O SISTEMA PRINCIPAL
// ===========================================

window.obterDadosAtributos = function() {
    return {
        atributos: { ...personagemAtributos },
        calculos: {
            custos: {
                ST: (personagemAtributos.ST - 10) * 10,
                DX: (personagemAtributos.DX - 10) * 20,
                IQ: (personagemAtributos.IQ - 10) * 20,
                HT: (personagemAtributos.HT - 10) * 10,
                total: calcularCustos()
            },
            cargas: obterCargasAtuais(),
            danoBase: obterDanoBaseCorreto()
        }
    };
};

window.carregarDadosAtributos = function(dados) {
    aplicarDadosAtributos(dados);
};

window.getAtributosPersonagem = () => ({ ...personagemAtributos });
window.getCargasPersonagem = () => obterCargasAtuais();
window.getDanoBasePersonagem = () => obterDanoBaseCorreto();
window.calcularCustoAtributos = calcularCustos;

window.initAtributosTab = initAtributosTab;

// ===========================================
// INICIAR QUANDO A PÁGINA CARREGAR
// ===========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Aguardar o sistema de salvamento carregar primeiro
        setTimeout(() => {
            if (document.getElementById('principal')?.classList.contains('active')) {
                initAtributosTab();
            }
        }, 1500);
    });
} else {
    setTimeout(() => {
        if (document.getElementById('principal')?.classList.contains('active')) {
            initAtributosTab();
        }
    }, 1500);
}

console.log('✅ atributos.js carregado - SISTEMA INTEGRADO COMPLETO');