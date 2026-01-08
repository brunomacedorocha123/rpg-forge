// =============================================
// CARACTERÍSTICAS FÍSICAS - SISTEMA COMPLETO
// =============================================

class CaracteristicasFisicasSistema {
    constructor() {
        this.caracteristicas = {
            "magro": { 
                pontos: -5,
                nome: "Magro",
                efeitos: "Peso = 67% do normal",
                pesoMultiplicador: 0.67,
                alturaMaxima: null,
                icone: "fas fa-person-walking",
                descricao: "Peso reduzido para 67% da média",
                conflitos: ["acima-peso", "gordo", "muito-gordo"]
            },
            "acima-peso": { 
                pontos: -1,
                nome: "Acima do Peso",
                efeitos: "Peso = 130% do normal",
                pesoMultiplicador: 1.3,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 130% da média",
                conflitos: ["magro", "gordo", "muito-gordo"]
            },
            "gordo": { 
                pontos: -3,
                nome: "Gordo",
                efeitos: "Peso = 150% do normal",
                pesoMultiplicador: 1.5,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso aumentado para 150% da média",
                conflitos: ["magro", "acima-peso", "muito-gordo"]
            },
            "muito-gordo": { 
                pontos: -5,
                nome: "Muito Gordo",
                efeitos: "Peso = 200% do normal",
                pesoMultiplicador: 2.0,
                alturaMaxima: null,
                icone: "fas fa-weight-hanging",
                descricao: "Peso dobrado em relação à média",
                conflitos: ["magro", "acima-peso", "gordo"]
            },
            "nanismo": { 
                pontos: -15,
                nome: "Nanismo",
                efeitos: "Altura máxima: 1.32m",
                pesoMultiplicador: null,
                alturaMaxima: 1.32,
                icone: "fas fa-arrow-down",
                descricao: "Altura limitada a 1.32m máximo",
                conflitos: ["gigantismo"]
            },
            "gigantismo": { 
                pontos: 0,
                nome: "Gigantismo",
                efeitos: "MT +1, +1 Deslocamento",
                pesoMultiplicador: null,
                alturaMaxima: null,
                icone: "fas fa-arrow-up",
                descricao: "Altura acima do máximo para a raça",
                conflitos: ["nanismo"]
            }
        };

        this.alturaPorST = {
            6: { min: 1.30, max: 1.55 },
            7: { min: 1.38, max: 1.63 },
            8: { min: 1.45, max: 1.70 },
            9: { min: 1.53, max: 1.78 },
            10: { min: 1.58, max: 1.83 },
            11: { min: 1.63, max: 1.88 },
            12: { min: 1.70, max: 1.95 },
            13: { min: 1.78, max: 2.03 },
            14: { min: 1.85, max: 2.10 },
            15: { min: 1.90, max: 2.15 },
            16: { min: 1.95, max: 2.20 }
        };

        this.pesoPorST = {
            6: { min: 30, max: 60 },
            7: { min: 37.5, max: 67.5 },
            8: { min: 45.0, max: 75.0 },
            9: { min: 52.5, max: 82.5 },
            10: { min: 57.5, max: 87.5 },
            11: { min: 62.5, max: 97.5 },
            12: { min: 70.0, max: 110.0 },
            13: { min: 77.5, max: 122.5 },
            14: { min: 85.0, max: 135.0 },
            15: { min: 92.5, max: 147.5 },
            16: { min: 100.0, max: 160.0 }
        };

        this.caracteristicasSelecionadas = [];
        this.altura = 1.70;
        this.peso = 70;
        this.stAtual = 10;
    }

    inicializar() {
        this.atualizarST();
        this.configurarModal();
        this.configurarEventosPrincipais();
        this.carregarDados();
        this.atualizarTudo();
    }

    configurarModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        document.getElementById('customizeBtn')?.addEventListener('click', () => this.abrirModal());
        modal.querySelector('.modal-close')?.addEventListener('click', () => this.fecharModal());
        document.getElementById('cancelBtn')?.addEventListener('click', () => this.fecharModal());
        document.getElementById('applyBtn')?.addEventListener('click', () => this.aplicarAlteracoes());
        
        modal.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.type;
                this.alternarCaracteristica(tipo);
            });
        });
        
        const btnAlturaMenos = document.querySelector('#alturaModal').parentElement.querySelector('.minus');
        const btnAlturaMais = document.querySelector('#alturaModal').parentElement.querySelector('.plus');
        const inputAltura = document.getElementById('alturaModal');
        const btnPesoMenos = document.querySelector('#pesoModal').parentElement.querySelector('.minus');
        const btnPesoMais = document.querySelector('#pesoModal').parentElement.querySelector('.plus');
        const inputPeso = document.getElementById('pesoModal');
        
        if (btnAlturaMenos) btnAlturaMenos.onclick = () => this.ajustarAltura(-0.01);
        if (btnAlturaMais) btnAlturaMais.onclick = () => this.ajustarAltura(0.01);
        if (btnPesoMenos) btnPesoMenos.onclick = () => this.ajustarPeso(-1);
        if (btnPesoMais) btnPesoMais.onclick = () => this.ajustarPeso(1);
        if (inputAltura) inputAltura.onchange = () => this.atualizarValorAltura();
        if (inputPeso) inputPeso.onchange = () => this.atualizarValorPeso();
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal();
        });
    }

    configurarEventosPrincipais() {
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        const inputIdade = document.getElementById('idade');
        const btnIdadeMenos = inputIdade?.parentElement.querySelector('.btn-number.minus');
        const btnIdadeMais = inputIdade?.parentElement.querySelector('.btn-number.plus');
        
        if (inputAltura) inputAltura.addEventListener('change', () => {
            this.altura = parseFloat(inputAltura.value) || 1.70;
            this.atualizarStatusInputs();
            this.salvarDados();
        });
        
        if (inputPeso) inputPeso.addEventListener('change', () => {
            this.peso = parseInt(inputPeso.value) || 70;
            this.atualizarStatusInputs();
            this.salvarDados();
        });
        
        if (btnIdadeMenos) btnIdadeMenos.onclick = () => this.ajustarIdade(-1);
        if (btnIdadeMais) btnIdadeMais.onclick = () => this.ajustarIdade(1);
        
        document.addEventListener('atributosAtualizados', (e) => {
            if (e.detail?.ST) {
                this.stAtual = e.detail.ST;
                this.atualizarTudo();
            }
        });
    }

    abrirModal() {
        const modal = document.getElementById('alturaPesoModal');
        if (!modal) return;
        
        this.atualizarST();
        document.getElementById('statusST').textContent = this.stAtual;
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        document.getElementById('pesoModal').value = this.peso;
        
        this.atualizarFaixasModal();
        this.atualizarStatusModal();
        this.atualizarBotoesCaracteristicas();
        
        modal.style.display = 'block';
    }

    fecharModal() {
        document.getElementById('alturaPesoModal').style.display = 'none';
    }

    aplicarAlteracoes() {
        this.altura = parseFloat(document.getElementById('alturaModal').value) || 1.70;
        this.peso = parseInt(document.getElementById('pesoModal').value) || 70;
        
        document.getElementById('altura').value = this.altura.toFixed(2);
        document.getElementById('peso').value = this.peso;
        
        this.fecharModal();
        this.atualizarStatusInputs();
        this.salvarDados();
        this.atualizarPontosSistema();
    }

    alternarCaracteristica(tipo) {
        const index = this.caracteristicasSelecionadas.findIndex(c => c.tipo === tipo);
        
        if (index !== -1) {
            this.caracteristicasSelecionadas.splice(index, 1);
        } else {
            this.adicionarCaracteristica(tipo);
        }
        
        this.atualizarBotoesCaracteristicas();
        this.atualizarFaixasModal();
        this.atualizarStatusModal();
        this.atualizarPontosSistema();
        this.salvarDados();
        this.atualizarStatusInputs();
    }

    adicionarCaracteristica(tipo) {
        const caracteristica = this.caracteristicas[tipo];
        if (!caracteristica) return;
        
        if (caracteristica.conflitos) {
            caracteristica.conflitos.forEach(conflito => {
                this.caracteristicasSelecionadas = this.caracteristicasSelecionadas.filter(c => c.tipo !== conflito);
            });
        }
        
        this.caracteristicasSelecionadas.push({
            id: Date.now(),
            tipo: tipo,
            nome: caracteristica.nome,
            pontos: caracteristica.pontos,
            efeitos: caracteristica.efeitos,
            pesoMultiplicador: caracteristica.pesoMultiplicador,
            alturaMaxima: caracteristica.alturaMaxima,
            icone: caracteristica.icone
        });
        
        if (tipo === 'nanismo' && this.altura > 1.32) {
            this.altura = 1.32;
            document.getElementById('altura').value = this.altura.toFixed(2);
            document.getElementById('alturaModal').value = this.altura.toFixed(2);
        }
    }

    atualizarST() {
        if (window.getAtributosPersonagem) {
            const atributos = window.getAtributosPersonagem();
            if (atributos?.ST) {
                this.stAtual = atributos.ST;
                return;
            }
        }
        
        const inputST = document.getElementById('ST');
        this.stAtual = inputST ? parseInt(inputST.value) || 10 : 10;
    }

    obterFaixaAltura(st) {
        if (st >= 6 && st <= 16) {
            return this.alturaPorST[st];
        }
        
        if (st > 16) {
            const base = this.alturaPorST[16];
            const incremento = (st - 16) * 0.05;
            return {
                min: parseFloat((parseFloat(base.min) + incremento).toFixed(2)),
                max: parseFloat((parseFloat(base.max) + incremento).toFixed(2))
            };
        }
        
        if (st < 6) {
            const base = this.alturaPorST[6];
            const decremento = (6 - st) * 0.05;
            return {
                min: parseFloat((parseFloat(base.min) - decremento).toFixed(2)),
                max: parseFloat((parseFloat(base.max) - decremento).toFixed(2))
            };
        }
        
        return { min: 1.30, max: 2.50 };
    }

    obterFaixaPeso(st) {
        if (st >= 6 && st <= 16) {
            return this.pesoPorST[st];
        }
        
        if (st > 16) {
            const base = this.pesoPorST[16];
            const incremento = (st - 16) * 10;
            return {
                min: Math.round(base.min + incremento),
                max: Math.round(base.max + incremento)
            };
        }
        
        if (st < 6) {
            const base = this.pesoPorST[6];
            const decremento = (6 - st) * 5;
            return {
                min: Math.max(20, Math.round(base.min - decremento)),
                max: Math.max(30, Math.round(base.max - decremento))
            };
        }
        
        return { min: 30, max: 200 };
    }

    verificarConformidade() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoBase = this.obterFaixaPeso(this.stAtual);
        
        let multiplicadorPeso = 1.0;
        let caracteristicaAtiva = null;
        
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
            caracteristicaAtiva = caracteristicaPeso;
        }
        
        const faixaPesoAjustada = {
            min: Math.round(faixaPesoBase.min * multiplicadorPeso),
            max: Math.round(faixaPesoBase.max * multiplicadorPeso)
        };
        
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        let alturaValida = true;
        let mensagemAltura = '';
        
        if (nanismo) {
            alturaValida = this.altura <= 1.32;
            mensagemAltura = alturaValida ? 
                'Dentro do limite do nanismo (1.32m)' : 
                'Acima do limite do nanismo (1.32m)';
        } else {
            alturaValida = this.altura >= faixaAltura.min && this.altura <= faixaAltura.max;
            mensagemAltura = alturaValida ? 
                `Dentro da faixa (${faixaAltura.min.toFixed(2)}m - ${faixaAltura.max.toFixed(2)}m)` :
                this.altura < faixaAltura.min ? 
                    `Abaixo do mínimo (${faixaAltura.min.toFixed(2)}m)` :
                    `Acima do máximo (${faixaAltura.max.toFixed(2)}m)`;
        }
        
        const pesoValido = this.peso >= faixaPesoAjustada.min && this.peso <= faixaPesoAjustada.max;
        let mensagemPeso = '';
        
        if (caracteristicaAtiva) {
            mensagemPeso = pesoValido ? 
                `${caracteristicaAtiva.nome}: ${faixaPesoAjustada.min}kg - ${faixaPesoAjustada.max}kg` :
                this.peso < faixaPesoAjustada.min ? 
                    `${caracteristicaAtiva.nome}: Abaixo do mínimo (${faixaPesoAjustada.min}kg)` :
                    `${caracteristicaAtiva.nome}: Acima do máximo (${faixaPesoAjustada.max}kg)`;
        } else {
            mensagemPeso = pesoValido ? 
                `Dentro da faixa (${faixaPesoBase.min}kg - ${faixaPesoBase.max}kg)` :
                this.peso < faixaPesoBase.min ? 
                    `Abaixo do mínimo (${faixaPesoBase.min}kg)` :
                    `Acima do máximo (${faixaPesoBase.max}kg)`;
        }
        
        return {
            alturaValida,
            pesoValido,
            faixaAltura,
            faixaPesoBase,
            faixaPesoAjustada,
            multiplicadorPeso,
            caracteristicaAtiva,
            nanismoAtivo: !!nanismo,
            mensagemAltura,
            mensagemPeso
        };
    }

    atualizarFaixasModal() {
        const faixaAltura = this.obterFaixaAltura(this.stAtual);
        const faixaPesoBase = this.obterFaixaPeso(this.stAtual);
        
        // OBTER MULTIPLICADOR ATUAL
        let multiplicadorPeso = 1.0;
        let nomeCaracteristica = '';
        const caracteristicaPeso = this.caracteristicasSelecionadas.find(c => c.pesoMultiplicador);
        if (caracteristicaPeso) {
            multiplicadorPeso = caracteristicaPeso.pesoMultiplicador;
            nomeCaracteristica = caracteristicaPeso.nome;
        }
        
        // CALCULAR FAIXA AJUSTADA
        const faixaPesoAjustada = {
            min: Math.round(faixaPesoBase.min * multiplicadorPeso),
            max: Math.round(faixaPesoBase.max * multiplicadorPeso)
        };
        
        // ATUALIZAR ALTURA NO MODAL
        const faixaAlturaElement = document.getElementById('faixaAltura');
        if (faixaAlturaElement) {
            faixaAlturaElement.textContent = `${faixaAltura.min.toFixed(2)}m - ${faixaAltura.max.toFixed(2)}m`;
        }
        
        // ATUALIZAR PESO NO MODAL (MOSTRAR AJUSTADO SE HOUVER CARACTERÍSTICA)
        const faixaPesoElement = document.getElementById('faixaPeso');
        if (faixaPesoElement) {
            if (caracteristicaPeso) {
                faixaPesoElement.textContent = `${faixaPesoAjustada.min}kg - ${faixaPesoAjustada.max}kg (${nomeCaracteristica})`;
                faixaPesoElement.style.color = '#f39c12';
                faixaPesoElement.style.fontWeight = 'bold';
            } else {
                faixaPesoElement.textContent = `${faixaPesoBase.min}kg - ${faixaPesoBase.max}kg`;
                faixaPesoElement.style.color = '';
                faixaPesoElement.style.fontWeight = '';
            }
        }
    }

    calcularPontosCaracteristicas() {
        return this.caracteristicasSelecionadas.reduce((total, carac) => total + carac.pontos, 0);
    }

    ajustarAltura(variacao) {
        let novaAltura = this.altura + variacao;
        
        const nanismo = this.caracteristicasSelecionadas.find(c => c.tipo === 'nanismo');
        if (nanismo && novaAltura > 1.32) novaAltura = 1.32;
        if (novaAltura < 1.20) novaAltura = 1.20;
        if (novaAltura > 2.50) novaAltura = 2.50;
        
        this.altura = parseFloat(novaAltura.toFixed(2));
        document.getElementById('alturaModal').value = this.altura.toFixed(2);
        
        this.atualizarStatusModal();
    }

    ajustarPeso(variacao) {
        let novoPeso = this.peso + variacao;
        if (novoPeso < 20) novoPeso = 20;
        if (novoPeso > 200) novoPeso = 200;
        
        this.peso = novoPeso;
        document.getElementById('pesoModal').value = this.peso;
        
        this.atualizarStatusModal();
    }

    ajustarIdade(variacao) {
        const inputIdade = document.getElementById('idade');
        if (!inputIdade) return;
        
        let idade = parseInt(inputIdade.value) || 25;
        idade += variacao;
        if (idade < 12) idade = 12;
        if (idade > 100) idade = 100;
        
        inputIdade.value = idade;
    }

    atualizarValorAltura() {
        const input = document.getElementById('alturaModal');
        this.altura = parseFloat(input.value) || 1.70;
        this.atualizarStatusModal();
    }

    atualizarValorPeso() {
        const input = document.getElementById('pesoModal');
        this.peso = parseInt(input.value) || 70;
        this.atualizarStatusModal();
    }

    atualizarTudo() {
        this.atualizarStatusInputs();
        this.atualizarPontosSistema();
    }

    atualizarStatusInputs() {
        const conformidade = this.verificarConformidade();
        const inputAltura = document.getElementById('altura');
        const inputPeso = document.getElementById('peso');
        
        if (inputAltura) {
            if (conformidade.nanismoAtivo && this.altura > 1.32) {
                inputAltura.style.borderColor = '#e74c3c';
                inputAltura.style.backgroundColor = '#ffe6e6';
            } else if (!conformidade.alturaValida) {
                inputAltura.style.borderColor = '#f39c12';
                inputAltura.style.backgroundColor = '#fff3cd';
            } else {
                inputAltura.style.borderColor = '#27ae60';
                inputAltura.style.backgroundColor = '#d4edda';
            }
        }
        
        if (inputPeso) {
            if (!conformidade.pesoValido) {
                inputPeso.style.borderColor = '#f39c12';
                inputPeso.style.backgroundColor = '#fff3cd';
            } else {
                inputPeso.style.borderColor = '#27ae60';
                inputPeso.style.backgroundColor = '#d4edda';
            }
        }
    }

    atualizarStatusModal() {
        const conformidade = this.verificarConformidade();
        const statusAltura = document.querySelector('#alturaModal').parentElement.nextElementSibling;
        const statusPeso = document.querySelector('#pesoModal').parentElement.nextElementSibling;
        
        if (statusAltura && statusAltura.classList.contains('status-info')) {
            statusAltura.textContent = conformidade.mensagemAltura;
            statusAltura.style.color = conformidade.alturaValida ? '#27ae60' : '#e74c3c';
        }
        
        if (statusPeso && statusPeso.classList.contains('status-info')) {
            statusPeso.textContent = conformidade.mensagemPeso;
            statusPeso.style.color = conformidade.pesoValido ? '#27ae60' : '#e74c3c';
        }
    }

    atualizarBotoesCaracteristicas() {
        document.querySelectorAll('.feature-btn').forEach(btn => {
            const tipo = btn.dataset.type;
            const selecionada = this.caracteristicasSelecionadas.find(c => c.tipo === tipo);
            
            if (selecionada) {
                btn.style.backgroundColor = '#3498db';
                btn.style.color = 'white';
                btn.style.borderColor = '#2980b9';
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }
        });
    }

    atualizarPontosSistema() {
        const pontos = this.calcularPontosCaracteristicas();
        if (window.atualizarPontosAba) {
            window.atualizarPontosAba('desvantagens', pontos);
        }
    }

    salvarDados() {
        const dados = {
            caracteristicasSelecionadas: this.caracteristicasSelecionadas,
            altura: this.altura,
            peso: this.peso,
            stAtual: this.stAtual
        };
        localStorage.setItem('rpgforge_caracteristicas_fisicas', JSON.stringify(dados));
    }

    carregarDados() {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_caracteristicas_fisicas');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                
                if (dados.caracteristicasSelecionadas) {
                    this.caracteristicasSelecionadas = dados.caracteristicasSelecionadas;
                }
                
                if (dados.altura !== undefined) {
                    this.altura = dados.altura;
                    const inputAltura = document.getElementById('altura');
                    if (inputAltura) inputAltura.value = this.altura.toFixed(2);
                }
                
                if (dados.peso !== undefined) {
                    this.peso = dados.peso;
                    const inputPeso = document.getElementById('peso');
                    if (inputPeso) inputPeso.value = this.peso;
                }
                
                if (dados.stAtual) {
                    this.stAtual = dados.stAtual;
                }
                
                this.atualizarTudo();
            }
        } catch (error) {}
    }
}

let sistemaCaracteristicas = null;

function inicializarSistemaCaracteristicas() {
    if (!sistemaCaracteristicas) {
        sistemaCaracteristicas = new CaracteristicasFisicasSistema();
        sistemaCaracteristicas.inicializar();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('alturaPesoModal')) {
            inicializarSistemaCaracteristicas();
        }
    }, 500);
});

const style = document.createElement('style');
style.textContent = `
    .status-info {
        font-size: 0.85em;
        margin-top: 5px;
        padding: 3px 6px;
        border-radius: 3px;
        display: inline-block;
        font-style: italic;
    }
    
    .feature-btn {
        transition: all 0.3s ease;
    }
    
    .adjustment-controls {
        display: flex;
        align-items: center;
    }
    
    .adjustment-controls input {
        width: 80px;
        text-align: center;
        margin: 0 5px;
    }
    
    .btn-adjust {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        cursor: pointer;
        font-weight: bold;
    }
    
    .btn-adjust:hover {
        background: #e9ecef;
    }
    
    .btn-adjust.minus {
        border-radius: 4px 0 0 4px;
    }
    
    .btn-adjust.plus {
        border-radius: 0 4px 4px 0;
    }
`;
document.head.appendChild(style);

window.CaracteristicasFisicasSistema = CaracteristicasFisicasSistema;
window.inicializarSistemaCaracteristicas = inicializarSistemaCaracteristicas;