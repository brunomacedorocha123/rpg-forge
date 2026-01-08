// ===========================================
// FIREBASE-SAVE.JS - SISTEMA DE SALVAMENTO AVANÇADO
// ===========================================

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SUA_APP.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_APP.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// INICIALIZAÇÃO DO FIREBASE
let db = null;
let personagemId = null;

// ===========================================
// GERADOR DE ID SIMPLES (8 CARACTERES)
// ===========================================

function gerarPersonagemId() {
    // Formato: 2 letras + 3 números + 3 letras = 8 caracteres
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removido I, O para evitar confusão
    const numeros = '0123456789';
    
    let id = '';
    
    // Primeiras 2 letras
    for (let i = 0; i < 2; i++) {
        id += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    // 3 números
    for (let i = 0; i < 3; i++) {
        id += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    // Últimas 3 letras
    for (let i = 0; i < 3; i++) {
        id += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    return id; // Exemplo: AB123XYZ
}

// ===========================================
// GERENCIAMENTO DE ID DO PERSONAGEM
// ===========================================

function obterPersonagemId() {
    // 1. Verificar se já tem ID salvo no localStorage
    if (!personagemId) {
        personagemId = localStorage.getItem('rpgforge_personagem_id');
    }
    
    // 2. Se não tem, gerar novo ID
    if (!personagemId) {
        personagemId = gerarPersonagemId();
        localStorage.setItem('rpgforge_personagem_id', personagemId);
        console.log(`🆔 NOVO ID GERADO: ${personagemId}`);
        
        // Criar elemento para mostrar o ID na interface
        mostrarIdNaInterface(personagemId);
        
        // Disparar evento de ID gerado
        document.dispatchEvent(new CustomEvent('personagemIdGerado', { 
            detail: { id: personagemId } 
        }));
    }
    
    return personagemId;
}

function mostrarIdNaInterface(id) {
    const elementoId = document.getElementById('personagemId');
    if (elementoId) {
        elementoId.textContent = id;
        elementoId.style.fontWeight = 'bold';
        elementoId.style.color = '#3498db';
    }
}

function resetarPersonagemId() {
    personagemId = null;
    localStorage.removeItem('rpgforge_personagem_id');
    localStorage.removeItem('rpgforge_personagem_data');
    
    const elementoId = document.getElementById('personagemId');
    if (elementoId) {
        elementoId.textContent = 'Aguardando criação...';
        elementoId.style.fontWeight = 'normal';
        elementoId.style.color = '';
    }
    
    console.log('🗑️ ID do personagem resetado');
}

// ===========================================
// SISTEMA DE SALVAMENTO POR SUBSESSÕES
// ===========================================

class SistemaSalvamento {
    constructor() {
        this.idPersonagem = null;
        this.emDesenvolvimento = true; // Modo desenvolvimento
        this.pendingSaves = new Map(); // Salvar em lote
    }
    
    inicializar() {
        try {
            // Verificar se Firebase está disponível
            if (typeof firebase === 'undefined') {
                console.warn('⚠️ Firebase não carregado. Usando localStorage.');
                this.usarLocalStorage = true;
                return false;
            }
            
            // Inicializar Firebase
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            
            // Configurar persistência offline
            db.enablePersistence()
                .catch(err => {
                    console.warn('Persistência offline não suportada:', err);
                });
            
            // Obter ID do personagem
            this.idPersonagem = obterPersonagemId();
            console.log(`✅ Firebase inicializado. Personagem ID: ${this.idPersonagem}`);
            
            // Configurar botão de salvamento global
            this.configurarBotaoSalvar();
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            this.usarLocalStorage = true;
            return false;
        }
    }
    
    // ===========================================
    // MÉTODOS PÚBLICOS PARA SALVAR DADOS
    // ===========================================
    
    async salvarModulo(modulo, dados) {
        console.log(`💾 Salvando módulo: ${modulo}`, dados);
        
        // Em modo desenvolvimento, salva em lote
        if (this.emDesenvolvimento) {
            this.pendingSaves.set(modulo, dados);
            this.mostrarStatus(`Modificado: ${modulo}`, 'info');
            return true;
        }
        
        // Salvar no Firebase
        try {
            if (!this.idPersonagem) {
                this.idPersonagem = obterPersonagemId();
            }
            
            await db.collection('personagens')
                .doc(this.idPersonagem)
                .collection(modulo)
                .doc('dados')
                .set({
                    ...dados,
                    ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp(),
                    versao: '1.0.0'
                }, { merge: true }); // Usar merge para atualizar, não substituir
            
            console.log(`✅ Módulo ${modulo} salvo no Firebase`);
            this.mostrarStatus(`✅ ${modulo} salvo`, 'success');
            return true;
        } catch (error) {
            console.error(`❌ Erro ao salvar módulo ${modulo}:`, error);
            
            // Fallback para localStorage
            this.salvarLocalStorage(modulo, dados);
            this.mostrarStatus(`⚠️ ${modulo} salvo localmente`, 'warning');
            return false;
        }
    }
    
    async salvarTudo() {
        console.log('💾💾💾 SALVANDO TUDO (lote)');
        
        if (this.pendingSaves.size === 0) {
            this.mostrarStatus('Nenhuma alteração para salvar', 'info');
            return;
        }
        
        this.mostrarStatus('Salvando todas as alterações...', 'loading');
        
        try {
            const batch = db.batch();
            const personagemRef = db.collection('personagens').doc(this.idPersonagem);
            
            // Adicionar cada módulo ao batch
            for (const [modulo, dados] of this.pendingSaves) {
                const moduloRef = personagemRef.collection(modulo).doc('dados');
                batch.set(moduloRef, {
                    ...dados,
                    ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp(),
                    versao: '1.0.0'
                }, { merge: true });
            }
            
            // Executar batch
            await batch.commit();
            
            console.log(`✅ ${this.pendingSaves.size} módulos salvos em lote`);
            this.mostrarStatus('✅ Todas as alterações salvas!', 'success');
            this.pendingSaves.clear();
            
        } catch (error) {
            console.error('❌ Erro ao salvar em lote:', error);
            this.mostrarStatus('❌ Erro ao salvar', 'error');
            
            // Fallback: salvar individualmente no localStorage
            for (const [modulo, dados] of this.pendingSaves) {
                this.salvarLocalStorage(modulo, dados);
            }
        }
    }
    
    async carregarModulo(modulo) {
        console.log(`📥 Carregando módulo: ${modulo}`);
        
        // Primeiro tentar localStorage (mais rápido)
        const dadosLocais = this.carregarLocalStorage(modulo);
        if (dadosLocais) {
            console.log(`📂 Módulo ${modulo} carregado do localStorage`);
            return dadosLocais;
        }
        
        // Se não tiver local, tentar Firebase
        try {
            if (!this.idPersonagem) {
                this.idPersonagem = obterPersonagemId();
            }
            
            const docRef = db.collection('personagens')
                .doc(this.idPersonagem)
                .collection(modulo)
                .doc('dados');
            
            const doc = await docRef.get();
            
            if (doc.exists) {
                const dados = doc.data();
                console.log(`☁️ Módulo ${modulo} carregado do Firebase`);
                
                // Salvar localmente para acesso futuro mais rápido
                this.salvarLocalStorage(modulo, dados);
                
                return dados;
            } else {
                console.log(`ℹ️ Módulo ${modulo} não encontrado no Firebase`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Erro ao carregar módulo ${modulo}:`, error);
            return null;
        }
    }
    
    async carregarTudo() {
        console.log('📥📥📥 CARREGANDO TODOS OS DADOS');
        
        const modulos = [
            'identificacao',
            'atributos',
            'caracteristicas',
            'pontos',
            'riqueza',
            'reacao'
        ];
        
        const dadosCompletos = {};
        let carregouAlgo = false;
        
        for (const modulo of modulos) {
            const dados = await this.carregarModulo(modulo);
            if (dados) {
                dadosCompletos[modulo] = dados;
                carregouAlgo = true;
            }
        }
        
        if (carregouAlgo) {
            console.log('✅ Dados carregados com sucesso');
            // Disparar evento global
            document.dispatchEvent(new CustomEvent('dadosCarregados', {
                detail: dadosCompletos
            }));
        }
        
        return dadosCompletos;
    }
    
    // ===========================================
    // LOCALSTORAGE (FALLBACK)
    // ===========================================
    
    salvarLocalStorage(modulo, dados) {
        try {
            // Carregar dados existentes
            let todosDados = {};
            const dadosSalvos = localStorage.getItem('rpgforge_personagem_data');
            if (dadosSalvos) {
                todosDados = JSON.parse(dadosSalvos);
            }
            
            // Atualizar módulo específico
            todosDados[modulo] = {
                ...dados,
                ultimaAtualizacao: new Date().toISOString(),
                versao: '1.0.0'
            };
            
            // Salvar de volta
            localStorage.setItem('rpgforge_personagem_data', JSON.stringify(todosDados));
            
            console.log(`💾 Módulo ${modulo} salvo no localStorage`);
            return true;
        } catch (error) {
            console.error(`❌ Erro ao salvar no localStorage:`, error);
            return false;
        }
    }
    
    carregarLocalStorage(modulo) {
        try {
            const dadosSalvos = localStorage.getItem('rpgforge_personagem_data');
            if (!dadosSalvos) return null;
            
            const todosDados = JSON.parse(dadosSalvos);
            return todosDados[modulo] || null;
        } catch (error) {
            console.error(`❌ Erro ao carregar do localStorage:`, error);
            return null;
        }
    }
    
    // ===========================================
    // UTILITÁRIOS
    // ===========================================
    
    configurarBotaoSalvar() {
        // Remover botão existente se houver
        const botaoExistente = document.getElementById('btnSalvarTudo');
        if (botaoExistente) botaoExistente.remove();
        
        // Criar botão de salvar tudo
        const botaoSalvar = document.createElement('button');
        botaoSalvar.id = 'btnSalvarTudo';
        botaoSalvar.className = 'btn-salvar-global';
        botaoSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Tudo';
        botaoSalvar.title = 'Salvar todas as alterações pendentes';
        
        botaoSalvar.onclick = () => this.salvarTudo();
        
        // Adicionar ao header
        const header = document.querySelector('.header-buttons');
        if (header) {
            header.insertBefore(botaoSalvar, header.firstChild);
        }
        
        // Também salvar automaticamente quando sair da página
        window.addEventListener('beforeunload', (e) => {
            if (this.pendingSaves.size > 0) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
                this.salvarTudo();
            }
        });
        
        // Salvar automaticamente a cada 30 segundos
        setInterval(() => {
            if (this.pendingSaves.size > 0) {
                console.log('⏰ Salvamento automático...');
                this.salvarTudo();
            }
        }, 30000);
    }
    
    mostrarStatus(mensagem, tipo = 'info') {
        // Remover status anterior
        const statusAnterior = document.getElementById('firebaseStatus');
        if (statusAnterior) statusAnterior.remove();
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            loading: 'fa-spinner fa-spin'
        };
        
        const cores = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db',
            loading: '#3498db'
        };
        
        const div = document.createElement('div');
        div.id = 'firebaseStatus';
        div.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-weight: bold;
                z-index: 9999;
                background: ${cores[tipo] || '#3498db'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas ${icons[tipo] || 'fa-info-circle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        document.body.appendChild(div);
        
        // Auto-remover após 5 segundos (exceto loading)
        if (tipo !== 'loading') {
            setTimeout(() => {
                if (div.parentNode) div.parentNode.removeChild(div);
            }, 5000);
        }
    }
    
    // ===========================================
    // NOVO PERSONAGEM
    // ===========================================
    
    novoPersonagem() {
        if (confirm('Deseja criar um novo personagem? O personagem atual será salvo primeiro.')) {
            this.salvarTudo().then(() => {
                resetarPersonagemId();
                location.reload(); // Recarregar para começar limpo
            });
        }
    }
}

// ===========================================
// INICIALIZAÇÃO GLOBAL
// ===========================================

let sistemaSalvamento = null;

function inicializarSistemaSalvamento() {
    if (!sistemaSalvamento) {
        sistemaSalvamento = new SistemaSalvamento();
        sistemaSalvamento.inicializar();
        
        // Carregar dados existentes após inicialização
        setTimeout(() => {
            sistemaSalvamento.carregarTudo();
        }, 1000);
    }
    return sistemaSalvamento;
}

// ===========================================
// FUNÇÕES GLOBAIS PARA OUTROS MÓDULOS
// ===========================================

window.salvarModulo = (modulo, dados) => {
    if (!sistemaSalvamento) {
        console.error('Sistema de salvamento não inicializado');
        return false;
    }
    return sistemaSalvamento.salvarModulo(modulo, dados);
};

window.carregarModulo = (modulo) => {
    if (!sistemaSalvamento) {
        console.error('Sistema de salvamento não inicializado');
        return null;
    }
    return sistemaSalvamento.carregarModulo(modulo);
};

window.obterIdPersonagem = () => {
    return obterPersonagemId();
};

window.novoPersonagem = () => {
    if (sistemaSalvamento) {
        sistemaSalvamento.novoPersonagem();
    }
};

// ===========================================
// ADICIONAR ESTILOS
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .btn-salvar-global {
            background: linear-gradient(135deg, #27ae60 0%, #219653 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2);
        }
        
        .btn-salvar-global:hover {
            background: linear-gradient(135deg, #219653 0%, #1e8449 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(39, 174, 96, 0.3);
        }
        
        .btn-salvar-global:active {
            transform: translateY(0);
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        #personagemId {
            font-family: 'Courier New', monospace;
            font-size: 1.1em;
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar sistema quando a página carregar
    setTimeout(inicializarSistemaSalvamento, 500);
});

console.log('✅ firebase-save.js carregado - SISTEMA DE SUBSESSÕES');