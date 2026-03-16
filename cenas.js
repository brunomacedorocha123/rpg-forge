// ============================================
// CENAS.JS - TODAS AS CENAS DA AVENTURA SOLO
// VERSÃO CORRIGIDA - COM CENA PÓS-COMBATE
// ============================================

const CENAS = {
    // ===== CENA INICIAL =====
    "grito_estrada": {
        id: "grito_estrada",
        titulo: "O Grito na Estrada",
        imagem: "estrada-norte.jpg",
        narrativa: `O sol está baixo no horizonte enquanto você caminha por uma velha estrada de terra cercada por árvores. A viagem tem sido longa e silenciosa.

De repente, um grito corta o silêncio da estrada.

— SOCORRO!

Você corre alguns passos adiante e encontra um camponês caído no chão, tentando se proteger.

Sobre ele, um homem sujo e mal vestido levanta um pedaço de madeira como se fosse atacar novamente.

Ao perceber sua presença, o agressor vira rapidamente.

— Isso não é da sua conta! — ele rosna.

O camponês olha para você desesperado.

— Por favor… me ajude!`,
        npc: {
            nome: "Camponês Amedrontado",
            descricao: "Homem simples, rosto sujo de terra, roupas rasgadas. Ele treme de medo.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { 
                texto: "⚔️ ATACAR o agressor", 
                acao: "iniciar_combate", 
                inimigo: "saqueador_faminto"
            },
            { 
                texto: "💬 CONVERSAR", 
                acao: "teste_pericia", 
                pericia: "persuasao",
                cd: 12,
                sucesso: "conversa_sucesso",
                falha: "conversa_falha"
            },
            { 
                texto: "👁️ OBSERVAR", 
                acao: "teste_pericia", 
                pericia: "observar",
                cd: 10,
                sucesso: "observar_sucesso",
                falha: "grito_estrada"
            },
            { 
                texto: "🏃 FUGIR", 
                acao: "ir_para_cena", 
                destino: "fuga_covarde"
            }
        ]
    },

    // ===== 🔥 NOVA CENA PÓS-COMBATE (CORRIGIDA) =====
    "pos_combate": {
        id: "pos_combate",
        titulo: "Vitória!",
        imagem: "estrada-norte.jpg",
        narrativa: `O saqueador cai, derrotado.

O camponês se levanta, aliviado, e limpa a sujeira das roupas.

— Obrigado, aventureiro! Você salvou minha vida! Meu nome é Edrin.

Ele estende a mão em gratidão e aponta para a estrada à frente.

— Ravena fica a poucas horas daqui. Se quiser, posso te acompanhar até lá. Conheço um atalho seguro.`,
        npc: {
            nome: "Edrin",
            descricao: "Camponês grato pela sua ajuda. Seu olhar é sincero.",
            estado: "amigavel",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { 
                texto: "👥 ACOMPANHAR Edrin até Ravena", 
                acao: "ir_para_cena", 
                destino: "estrada_ravena" 
            },
            { 
                texto: "🔍 INVESTIGAR o corpo do saqueador", 
                acao: "ir_para_cena", 
                destino: "investigar_saqueador" 
            },
            { 
                texto: "🌄 SEGUIR viagem sozinho", 
                acao: "ir_para_cena", 
                destino: "estrada_solitario" 
            }
        ]
    },

    // ===== CONVERSA SUCESSO =====
    "conversa_sucesso": {
        id: "conversa_sucesso",
        titulo: "Palavras Acalmam",
        imagem: "estrada-norte.jpg",
        narrativa: `Suas palavras acalmam o agressor. Ele abaixa o pedaço de madeira.

— Estou com fome... só queria comer...

O camponês dá metade de um pão e o homem foge.

— Meu nome é Edrin. Obrigado.`,
        npc: {
            nome: "Edrin",
            descricao: "Aliviado por ter escapado sem violência.",
            estado: "amigavel",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "👥 Acompanhar Edrin", acao: "ir_para_cena", destino: "estrada_ravena" },
            { texto: "🌄 Seguir viagem", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== CONVERSA FALHA =====
    "conversa_falha": {
        id: "conversa_falha",
        titulo: "Palavras em Vão",
        imagem: "estrada-norte.jpg",
        narrativa: `Suas palavras não o alcançam.

— CHEGA! — ele grita. — VAI MORRER!`,
        npc: {
            nome: "Saqueador",
            descricao: "Enfurecido, parte para cima de você.",
            estado: "hostil",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "⚔️ DEFENDER-SE", acao: "iniciar_combate", inimigo: "saqueador_faminto" }
        ]
    },

    // ===== OBSERVAR SUCESSO =====
    "observar_sucesso": {
        id: "observar_sucesso",
        titulo: "Detalhes Importantes",
        imagem: "estrada-norte.jpg",
        narrativa: `Você percebe que o camponês tem um símbolo de mercador em sua bolsa. Ele não é quem parece ser.`,
        npc: {
            nome: "???",
            descricao: "Você desconfia deste homem.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "⚔️ ATACAR agressor", acao: "iniciar_combate", inimigo: "saqueador_faminto" },
            { texto: "💬 QUESTIONAR camponês", acao: "ir_para_cena", destino: "questionar_mercador" }
        ]
    },

    // ===== ESTRADA PARA RAVENA =====
    "estrada_ravena": {
        id: "estrada_ravena",
        titulo: "Caminho para Ravena",
        imagem: "estrada-norte.jpg",
        narrativa: `Você e Edrin chegam a Ravena, uma pequena vila pacata.

— Fique à vontade, amigo. Devo minha vida a você.`,
        npc: {
            nome: "Edrin",
            descricao: "Agora em casa, mais relaxado.",
            estado: "amigavel",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "🏨 IR à estalagem", acao: "ir_para_cena", destino: "fim_provisorio" },
            { texto: "🛒 EXPLORAR vila", acao: "ir_para_cena", destino: "fim_provisorio" }
        ]
    },

    // ===== INVESTIGAR SAQUEADOR =====
    "investigar_saqueador": {
        id: "investigar_saqueador",
        titulo: "Rastro Sangrento",
        imagem: "estrada-norte.jpg",
        narrativa: `Você segue o rastro de sangue do saqueador ferido. Ele te leva a uma caverna escondida.

Dentro, você encontra seus pertences: alguns objetos roubados e um diário.

O diário revela que ele não é apenas um bandido comum...`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho na caverna.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "📖 LER o diário", acao: "ir_para_cena", destino: "diario_saqueador" },
            { texto: "🔙 VOLTAR para estrada", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== ESTRADA SOLITÁRIO =====
    "estrada_solitario": {
        id: "estrada_solitario",
        titulo: "Sozinho na Estrada",
        imagem: "estrada-norte.jpg",
        narrativa: `Você segue seu caminho. A estrada se estende à sua frente.

Sua jornada continua...`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 RECOMEÇAR", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== FUGA COVARDE =====
    "fuga_covarde": {
        id: "fuga_covarde",
        titulo: "Covardia",
        imagem: "estrada-norte.jpg",
        narrativa: `Você foge, ignorando os gritos.

A culpa pesa em seus ombros.`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho com sua consciência.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 TENTAR NOVAMENTE", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== FIM PROVISÓRIO =====
    "fim_provisorio": {
        id: "fim_provisorio",
        titulo: "Até a Próxima",
        imagem: "estrada-norte.jpg",
        narrativa: `Por enquanto, sua história termina aqui.

Novos capítulos em breve!`,
        npc: {
            nome: "Fim",
            descricao: "Agradecemos por jogar.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 RECOMEÇAR", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== DIÁRIO DO SAQUEADOR =====
    "diario_saqueador": {
        id: "diario_saqueador",
        titulo: "O Diário do Bandido",
        imagem: "estrada-norte.jpg",
        narrativa: `Você abre o diário e descobre que o saqueador na verdade era um ex-soldado que perdeu tudo. Ele escreve sobre um tesouro escondido na floresta.

— "Se um dia alguém ler isso, saiba que o verdadeiro culpado é o Barão de Ravena. Ele roubou tudo de mim."

Você encontra um mapa rabiscado mostrando a localização de um baú.`,
        npc: {
            nome: "—",
            descricao: "Você está na caverna, com o diário em mãos.",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "🗺️ SEGUIR o mapa", acao: "ir_para_cena", destino: "tesouro_escondido" },
            { texto: "🔙 VOLTAR para estrada", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== TESOURO ESCONDIDO =====
    "tesouro_escondido": {
        id: "tesouro_escondido",
        titulo: "O Tesouro Escondido",
        imagem: "estrada-norte.jpg",
        narrativa: `Seguindo o mapa, você encontra um baú enterrado sob uma árvore antiga.

Dentro, há 50 moedas de ouro e uma adaga com runas estranhas.

Sua aventura rendeu frutos!`,
        npc: {
            nome: "—",
            descricao: "Você encontrou um tesouro!",
            estado: "neutro",
            portrait: "npc-sangue.png"
        },
        recompensa: {
            ouro: 50,
            item: "Adaga Rúnica"
        },
        opcoes: [
            { texto: "🏆 VOLTAR para Ravena", acao: "ir_para_cena", destino: "estrada_ravena" },
            { texto: "🌄 CONTINUAR viajando", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== QUESTIONAR MERCADOR =====
    "questionar_mercador": {
        id: "questionar_mercador",
        titulo: "O Mercador Disfarçado",
        imagem: "estrada-norte.jpg",
        narrativa: `Você confronta o camponês sobre o símbolo de mercador. Ele suspira.

— Tudo bem, você me descobriu. Sou um mercador que estava voltando de Ravena quando fui atacado. Tenho uma proposta para você...

Ele oferece 20 moedas de ouro para escoltá-lo até a cidade vizinha.`,
        npc: {
            nome: "Edrin (Mercador)",
            descricao: "Na verdade um mercador viajante.",
            estado: "amigavel",
            portrait: "npc-sangue.png"
        },
        opcoes: [
            { texto: "💰 ACEITAR escolta (ganha 20 ouro)", acao: "ir_para_cena", destino: "estrada_ravena" },
            { texto: "❌ RECUSAR e seguir seu caminho", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    }
};

// ✅ EXPORTAÇÃO GLOBAL
if (typeof window !== 'undefined') {
    window.CENAS = CENAS;
    console.log('✅ Cenas carregadas!', Object.keys(CENAS));
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CENAS };
}