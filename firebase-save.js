// ====================== FIREBASE-SAVE.JS ======================
// SISTEMA DE SALVAMENTO NO FIREBASE - ID PERSISTENTE
// ===============================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBlA5LPfHt7LXZfj_BwMbV2hRnk7bAUChk",
    authDomain: "role3d6-cae77.firebaseapp.com",
    projectId: "role3d6-cae77",
    storageBucket: "role3d6-cae77.firebasestorage.app",
    messagingSenderId: "37912599534",
    appId: "1:37912599534:web:5c89d8d8ffac228f594cff"
};

let firebaseAuth = null;
let firebaseDB = null;

// ===== SISTEMA DE ID PERSISTENTE =====

/**
 * Obtém o ID do personagem - SEMPRE O MESMO após primeiro salvamento
 */
function obterIdPersonagemPersistente() {
    // 1. Verificar se já existe ID salvo no localStorage
    const idSalvoLocalmente = localStorage.getItem('personagem_id_persistente');
    
    // 2. Verificar se já existe ID na tela
    const campoId = document.getElementById('id-personagem');
    const idNaTela = campoId ? campoId.value : '';
    
    // 3. Se já tem ID válido, retornar ele
    if (idSalvoLocalmente && idSalvoLocalmente !== 'Aguardando salvamento...' && idSalvoLocalmente !== 'PC-') {
        return idSalvoLocalmente;
    }
    
    // 4. Se o ID na tela já é válido, salvar e retornar
    if (idNaTela && idNaTela !== 'Aguardando salvamento...' && idNaTela !== 'PC-') {
        localStorage.setItem('personagem_id_persistente', idNaTela);
        return idNaTela;
    }
    
    // 5. Primeira vez: criar ID SIMPLES
    let contador = parseInt(localStorage.getItem('personagem_contador') || '0');
    contador++;
    
    // IDs no formato: PC-001, PC-002, etc.
    const novoId = `PC-${contador.toString().padStart(3, '0')}`;
    
    // Salvar contador e ID
    localStorage.setItem('personagem_contador', contador.toString());
    localStorage.setItem('personagem_id_persistente', novoId);
    
    // Atualizar campo na tela
    if (campoId) {
        campoId.value = novoId;
        campoId.style.color = '#2196F3';
        campoId.style.fontStyle = 'normal';
    }
    
    return novoId;
}

/**
 * Atualiza o ID na interface
 */
function atualizarIdNaInterface(personagemId) {
    const campoId = document.getElementById('id-personagem');
    const tooltip = document.getElementById('id-info');
    
    if (campoId) {
        campoId.value = personagemId;
        campoId.style.color = '#4CAF50';
        campoId.style.fontStyle = 'normal';
        campoId.style.fontWeight = '600';
        campoId.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        campoId.style.background = 'rgba(76, 175, 80, 0.05)';
    }
    
    if (tooltip) {
        tooltip.innerHTML = `
            <i class="fas fa-check-circle" style="color: #4CAF50"></i> 
            ID: ${personagemId} - <strong>Este ID será mantido em todas as atualizações</strong>
        `;
        tooltip.style.color = '#4CAF50';
    }
}

// ===== COLETAR TODOS OS DADOS =====

function coletarTodosDadosParaSalvar() {
    // OBTER ID PERSISTENTE (mesmo sempre)
    const personagemId = obterIdPersonagemPersistente();
    
    console.log('📝 Usando ID:', personagemId);
    
    // 1. Dados da Dashboard
    const dadosDashboard = {
        nome: document.getElementById('nome-pc')?.value || 'Personagem sem nome',
        idade: parseInt(document.getElementById('idade-pc')?.value) || 25,
        raca: document.getElementById('raca-pc')?.value || '',
        classe: document.getElementById('classe-pc')?.value || '',
        nivelTecnologico: document.getElementById('nt-pc')?.value || '',
        imagem: localStorage.getItem('personagem_imagem') || '',
        
        // Pontos (do sistema principal)
        pontosTotais: window.sistemaPontos?.totalPontos || 150,
        pontosGastos: window.sistemaPontos?.gastoTotal || 0,
        pontosDisponiveis: window.sistemaPontos?.getPontosRestantes?.() || 150,
        
        // Dinheiro
        dinheiro: window.personagem?.dinheiro || 1000,
        
        // Sistemas da dashboard
        aparencia: window.dadosAparencia || {},
        idiomas: window.dadosIdiomas || {},
        riqueza: window.dadosRiqueza || {},
        
        // Status
        statusIdentidade: calcularStatusIdentidade(),
        
        // Timestamp
        atualizadoEm: new Date().toISOString()
    };
    
    // 2. Dados dos Atributos
    const dadosAtributos = window.obterDadosAtributos ? window.obterDadosAtributos() : {
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
        },
        pontosGastos: 0,
        mensagem: "Sistema de atributos não carregado"
    };
    
    // 3. Metadados com ID PERSISTENTE
    const metadata = {
        id: personagemId, // ⬅️ MESMO ID SEMPRE
        uid: firebaseAuth?.currentUser?.uid || '',
        email: firebaseAuth?.currentUser?.email || '',
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        criadoEm: new Date().toLocaleString('pt-BR'),
        versao: '1.0',
        ativo: true
    };
    
    // 4. Retornar tudo organizado
    return {
        // COLUNA 1: METADADOS (ID FIXO, usuário, datas)
        metadata: metadata,
        
        // COLUNA 2: DASHBOARD COMPLETA
        dashboard: dadosDashboard,
        
        // COLUNA 3: ATRIBUTOS COMPLETOS
        atributos: dadosAtributos,
        
        // COLUNA 4: OUTROS SISTEMAS (para o futuro)
        outrosSistemas: {
            vantagensDesvantagens: [],
            pericias: [],
            magias: [],
            equipamentos: []
        }
    };
}

// ===== FUNÇÃO PRINCIPAL DE SALVAMENTO =====

async function salvarPersonagemCompleto() {
    console.log('💾 INICIANDO SALVAMENTO COMPLETO...');
    
    // Verificar autenticação
    if (!firebaseAuth?.currentUser) {
        alert('⚠️ Faça login para salvar o personagem!');
        return { sucesso: false, erro: 'Não autenticado' };
    }
    
    const btnSalvar = document.getElementById('btnSalvar');
    const textoOriginal = btnSalvar?.innerHTML || 'Salvar';
    
    try {
        // 1. Mostrar status de salvamento
        if (btnSalvar) {
            btnSalvar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            btnSalvar.disabled = true;
        }
        
        // 2. Coletar todos os dados
        const dadosCompletos = coletarTodosDadosParaSalvar();
        const personagemId = dadosCompletos.metadata.id; // ID PERSISTENTE
        
        console.log('📦 Salvando com ID:', personagemId);
        console.log('📊 Dados coletados:', dadosCompletos);
        
        // 3. Importar módulos do Firebase
        const { doc, setDoc, updateDoc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js");
        
        // 4. Referência do documento no Firebase (MESMO ID SEMPRE)
        const personagemRef = doc(firebaseDB, "personagens", personagemId);
        
        // 5. Verificar se já existe
        const documentoExistente = await getDoc(personagemRef);
        
        if (documentoExistente.exists()) {
            // ✅ ATUALIZAR documento existente (MESMO ID)
            await updateDoc(personagemRef, dadosCompletos);
            console.log('✅ Personagem ATUALIZADO (mesmo ID):', personagemId);
            
            // Atualizar data de atualização
            await updateDoc(personagemRef, {
                'metadata.dataAtualizacao': new Date().toISOString(),
                'metadata.atualizadoEm': new Date().toLocaleString('pt-BR')
            });
        } else {
            // ✅ CRIAR novo documento (PRIMEIRA VEZ)
            await setDoc(personagemRef, dadosCompletos);
            console.log('✅ NOVO personagem CRIADO com ID:', personagemId);
        }
        
        // 6. Atualizar interface
        atualizarIdNaInterface(personagemId);
        
        // 7. Salvar referência no perfil do usuário
        await salvarNoPerfilUsuario(personagemId, dadosCompletos.dashboard.nome);
        
        // 8. Salvar localmente para possível edição
        salvarLocalmenteParaEdicao(personagemId, dadosCompletos);
        
        // 9. Mostrar notificação
        mostrarNotificacaoSalvamento(`✅ Personagem salvo com sucesso! ID: ${personagemId}`, 'success');
        
        // 10. Restaurar botão
        if (btnSalvar) {
            btnSalvar.innerHTML = '<i class="fas fa-check"></i> Salvo!';
            setTimeout(() => {
                btnSalvar.innerHTML = textoOriginal;
                btnSalvar.disabled = false;
            }, 2000);
        }
        
        return {
            sucesso: true,
            id: personagemId,
            dados: dadosCompletos,
            tipo: documentoExistente.exists() ? 'update' : 'create'
        };
        
    } catch (erro) {
        console.error('❌ ERRO NO SALVAMENTO:', erro);
        
        // Restaurar botão
        if (btnSalvar) {
            btnSalvar.innerHTML = textoOriginal;
            btnSalvar.disabled = false;
        }
        
        // Mostrar erro
        mostrarNotificacaoSalvamento(`❌ Erro ao salvar: ${erro.message}`, 'error');
        
        return {
            sucesso: false,
            erro: erro.message
        };
    }
}

// ===== FUNÇÕES AUXILIARES =====

async function salvarNoPerfilUsuario(personagemId, nomePersonagem) {
    try {
        const { doc, getDoc, updateDoc, arrayUnion, setDoc } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js");
        
        const usuarioRef = doc(firebaseDB, "usuarios", firebaseAuth.currentUser.uid);
        const usuarioDoc = await getDoc(usuarioRef);
        
        const resumoPersonagem = {
            id: personagemId,
            nome: nomePersonagem,
            classe: document.getElementById('classe-pc')?.value || '',
            raca: document.getElementById('raca-pc')?.value || '',
            nivel: "1",
            pontosGastos: window.sistemaPontos?.gastoTotal || 0,
            dataAtualizacao: new Date().toISOString()
        };
        
        if (usuarioDoc.exists()) {
            // Atualizar ou adicionar personagem
            const personagensAtuais = usuarioDoc.data().personagens || [];
            const index = personagensAtuais.findIndex(p => p.id === personagemId);
            
            if (index !== -1) {
                // Atualizar existente
                personagensAtuais[index] = resumoPersonagem;
                await updateDoc(usuarioRef, {
                    personagens: personagensAtuais,
                    atualizadoEm: new Date().toISOString()
                });
            } else {
                // Adicionar novo
                await updateDoc(usuarioRef, {
                    personagens: arrayUnion(resumoPersonagem),
                    atualizadoEm: new Date().toISOString()
                });
            }
        } else {
            // Criar perfil do usuário
            await setDoc(usuarioRef, {
                uid: firebaseAuth.currentUser.uid,
                email: firebaseAuth.currentUser.email,
                personagens: [resumoPersonagem],
                criadoEm: new Date().toISOString(),
                atualizadoEm: new Date().toISOString()
            });
        }
        
        console.log('✅ Perfil do usuário atualizado');
    } catch (erro) {
        console.error('⚠️ Erro ao atualizar perfil:', erro);
    }
}

function salvarLocalmenteParaEdicao(personagemId, dadosCompletos) {
    // Salvar ID para edição futura
    localStorage.setItem('personagem_editando_id', personagemId);
    
    // Salvar dados completos localmente
    localStorage.setItem(`personagem_${personagemId}`, JSON.stringify(dadosCompletos));
    
    // Salvar partes separadas para carregamento rápido
    localStorage.setItem('dashboard_atual', JSON.stringify(dadosCompletos.dashboard));
    localStorage.setItem('atributos_atual', JSON.stringify(dadosCompletos.atributos));
    
    console.log('✅ Dados salvos localmente para edição');
}

function calcularStatusIdentidade() {
    const campos = ['nome-pc', 'raca-pc', 'classe-pc', 'nt-pc'];
    let completos = 0;
    
    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento && elemento.value.trim() !== '') completos++;
    });
    
    return Math.round((completos / campos.length) * 100);
}

function mostrarNotificacaoSalvamento(mensagem, tipo = 'info') {
    // Criar elemento de mensagem
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = 'notificacao-flutuante';
    
    const icon = tipo === 'success' ? 'fa-check-circle' :
                 tipo === 'warning' ? 'fa-exclamation-triangle' :
                 tipo === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    
    mensagemDiv.innerHTML = `
        <div class="notificacao-conteudo ${tipo}">
            <i class="fas ${icon}"></i>
            <span>${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(mensagemDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (mensagemDiv.parentNode) {
            mensagemDiv.remove();
        }
    }, 5000);
}

// ===== CARREGAR PERSONAGEM SALVO =====

async function carregarPersonagemParaEdicao(personagemId) {
    try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js");
        
        const personagemRef = doc(firebaseDB, "personagens", personagemId);
        const documento = await getDoc(personagemRef);
        
        if (documento.exists()) {
            const dados = documento.data();
            
            // 1. Marcar como em edição
            localStorage.setItem('personagem_editando_id', personagemId);
            localStorage.setItem('personagem_id_persistente', personagemId);
            
            // 2. Atualizar ID na interface
            atualizarIdNaInterface(personagemId);
            
            // 3. Preencher dashboard
            if (dados.dashboard) {
                document.getElementById('nome-pc').value = dados.dashboard.nome || '';
                document.getElementById('idade-pc').value = dados.dashboard.idade || 25;
                document.getElementById('raca-pc').value = dados.dashboard.raca || '';
                document.getElementById('classe-pc').value = dados.dashboard.classe || '';
                document.getElementById('nt-pc').value = dados.dashboard.nivelTecnologico || '';
                
                // Atualizar sistema de pontos
                if (window.sistemaPontos && dados.dashboard.pontosTotais) {
                    window.sistemaPontos.setTotalPontos(dados.dashboard.pontosTotais);
                }
                
                // Carregar outros sistemas
                if (dados.dashboard.aparencia) window.dadosAparencia = dados.dashboard.aparencia;
                if (dados.dashboard.idiomas) window.dadosIdiomas = dados.dashboard.idiomas;
                if (dados.dashboard.riqueza) window.dadosRiqueza = dados.dashboard.riqueza;
                
                // Atualizar dinheiro
                if (dados.dashboard.dinheiro && window.personagem) {
                    window.personagem.dinheiro = dados.dashboard.dinheiro;
                    const dinheiroPc = document.getElementById('dinheiro-pc');
                    if (dinheiroPc) {
                        dinheiroPc.textContent = `$ ${dados.dashboard.dinheiro.toLocaleString('pt-BR')}`;
                    }
                }
            }
            
            // 4. Preencher atributos
            if (dados.atributos && window.carregarDadosAtributos) {
                window.carregarDadosAtributos(dados.atributos);
            }
            
            console.log('✅ Personagem carregado para edição:', personagemId);
            
            // 5. Mostrar notificação
            mostrarNotificacaoSalvamento(`✅ Personagem "${dados.dashboard?.nome || personagemId}" carregado!`, 'success');
            
            return { sucesso: true, dados: dados };
        } else {
            console.log('⚠️ Personagem não encontrado:', personagemId);
            mostrarNotificacaoSalvamento(`⚠️ Personagem ${personagemId} não encontrado`, 'warning');
            return { sucesso: false, erro: 'Personagem não encontrado' };
        }
    } catch (erro) {
        console.error('❌ Erro ao carregar personagem:', erro);
        mostrarNotificacaoSalvamento(`❌ Erro ao carregar: ${erro.message}`, 'error');
        return { sucesso: false, erro: erro.message };
    }
}

// ===== INICIALIZAÇÃO DO FIREBASE =====

async function inicializarFirebase() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js");
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js");
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js");
        
        const app = initializeApp(FIREBASE_CONFIG);
        firebaseAuth = getAuth(app);
        firebaseDB = getFirestore(app);
        
        console.log('✅ Firebase inicializado para salvamento');
        return true;
    } catch (erro) {
        console.error('❌ Erro ao inicializar Firebase:', erro);
        return false;
    }
}

// ===== EXPORTAR FUNÇÕES =====

window.salvarPersonagemFirebase = salvarPersonagemCompleto;
window.carregarPersonagemFirebase = carregarPersonagemParaEdicao;
window.inicializarFirebaseSalvamento = inicializarFirebase;
window.obterIdPersonagemPersistente = obterIdPersonagemPersistente;

// ===== INICIALIZAÇÃO AUTOMÁTICA =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de salvamento...');
    
    // 1. Inicializar Firebase
    inicializarFirebase().then(sucesso => {
        if (sucesso) {
            console.log('✅ Sistema de salvamento pronto');
            
            // 2. Verificar se há personagem em edição
            const personagemId = localStorage.getItem('personagem_editando_id');
            if (personagemId) {
                console.log('🔍 Carregando personagem em edição:', personagemId);
                setTimeout(() => {
                    carregarPersonagemParaEdicao(personagemId);
                }, 1000);
            }
            
            // 3. Configurar botão Salvar no HTML principal
            setTimeout(() => {
                const btnSalvar = document.getElementById('btnSalvar');
                if (btnSalvar) {
                    // Remover event listener antigo se existir
                    btnSalvar.replaceWith(btnSalvar.cloneNode(true));
                    
                    // Adicionar novo event listener
                    document.getElementById('btnSalvar').addEventListener('click', salvarPersonagemCompleto);
                    console.log('✅ Botão Salvar configurado com sistema de ID persistente');
                }
            }, 500);
        }
    });
    
    // 4. Estilo para notificações (se não existir)
    if (!document.querySelector('#estilo-notificacoes')) {
        const estilo = document.createElement('style');
        estilo.id = 'estilo-notificacoes';
        estilo.textContent = `
            .notificacao-flutuante {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notificacao-conteudo {
                background: #1a1a1a;
                border-left: 4px solid #2196F3;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                max-width: 400px;
            }
            
            .notificacao-conteudo.success {
                border-left-color: #4CAF50;
            }
            
            .notificacao-conteudo.warning {
                border-left-color: #FF9800;
            }
            
            .notificacao-conteudo.error {
                border-left-color: #f44336;
            }
            
            .notificacao-conteudo i {
                font-size: 1.2rem;
            }
            
            .notificacao-conteudo.success i {
                color: #4CAF50;
            }
            
            .notificacao-conteudo.warning i {
                color: #FF9800;
            }
            
            .notificacao-conteudo.error i {
                color: #f44336;
            }
            
            .notificacao-conteudo span {
                flex: 1;
                font-weight: 500;
            }
            
            .notificacao-fechar {
                background: none;
                border: none;
                color: #888;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .notificacao-fechar:hover {
                background: rgba(255,255,255,0.1);
                color: white;
            }
        `;
        document.head.appendChild(estilo);
    }
});

console.log('✅ firebase-save.js carregado - SISTEMA DE ID PERSISTENTE ATIVADO');