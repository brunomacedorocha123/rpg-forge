// FILE: cenas.js
// ============================================
// CENAS.JS - TODAS AS CENAS DA AVENTURA SOLO
// ============================================

const CENAS = {
    // ===== CENA INICIAL =====
    "grito_estrada": {
        id: "grito_estrada",
        titulo: "O Grito na Estrada",
        imagem: "imagens/estrada-norte.jpg",
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
            portrait: "imagens/npc-sangue.png"
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

    // ===== PÓS-COMBATE =====
    "pos_combate": {
        id: "pos_combate",
        titulo: "O Resgate",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `O saqueador foge pela mata, derrotado.

O camponês se levanta com dificuldade e respira aliviado.

— Obrigado… achei que ele fosse me matar. Meu nome é Edrin.

Ele olha para a direção onde o bandido fugiu.

— Conheço um atalho seguro até Ravena. Quer vir?`,
        npc: {
            nome: "Edrin",
            descricao: "Camponês grato, de meia-idade.",
            estado: "amigavel",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "👥 ACOMPANHAR Edrin", acao: "ir_para_cena", destino: "estrada_ravena" },
            { texto: "🔍 INVESTIGAR saqueador", acao: "ir_para_cena", destino: "investigar_saqueador" },
            { texto: "🌄 SEGUIR VIAGEM", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== CONVERSA SUCESSO =====
    "conversa_sucesso": {
        id: "conversa_sucesso",
        titulo: "Palavras Acalmam",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Suas palavras acalmam o agressor. Ele abaixa o pedaço de madeira.

— Estou com fome... só queria comer...

O camponês dá metade de um pão e o homem foge.

— Meu nome é Edrin. Obrigado.`,
        npc: {
            nome: "Edrin",
            descricao: "Aliviado por ter escapado sem violência.",
            estado: "amigavel",
            portrait: "imagens/npc-sangue.png"
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
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Suas palavras não o alcançam.

— CHEGA! — ele grita. — VAI MORRER!`,
        npc: {
            nome: "Saqueador",
            descricao: "Enfurecido, parte para cima de você.",
            estado: "hostil",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "⚔️ DEFENDER-SE", acao: "iniciar_combate", inimigo: "saqueador_faminto" }
        ]
    },

    // ===== OBSERVAR SUCESSO =====
    "observar_sucesso": {
        id: "observar_sucesso",
        titulo: "Detalhes Importantes",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Você percebe que o camponês tem um símbolo de mercador em sua bolsa. Ele não é quem parece ser.`,
        npc: {
            nome: "???",
            descricao: "Você desconfia deste homem.",
            estado: "neutro",
            portrait: "imagens/npc-sangue.png"
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
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Você e Edrin chegam a Ravena, uma pequena vila pacata.

— Fique à vontade, amigo. Devo minha vida a você.`,
        npc: {
            nome: "Edrin",
            descricao: "Agora em casa, mais relaxado.",
            estado: "amigavel",
            portrait: "imagens/npc-sangue.png"
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
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Você segue o rastro de sangue do saqueador ferido. Ele te leva a uma caverna escondida.

Dentro, você encontra seus pertences: alguns objetos roubados e um diário.

O diário revela que ele não é apenas um bandido comum...`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho na caverna.",
            estado: "neutro",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "📖 LER o diário", acao: "ir_para_cena", destino: "diario_saqueador" },
            { texto: "🔙 VOLTAR para estrada", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== FIM PROVISÓRIO =====
    "estrada_solitario": {
        id: "estrada_solitario",
        titulo: "Sozinho na Estrada",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Você segue seu caminho. A estrada se estende à sua frente.

Sua jornada continua...`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho.",
            estado: "neutro",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 RECOMEÇAR", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== FUGA COVARDE =====
    "fuga_covarde": {
        id: "fuga_covarde",
        titulo: "Covardia",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Você foge, ignorando os gritos.

A culpa pesa em seus ombros.`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho com sua consciência.",
            estado: "neutro",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 TENTAR NOVAMENTE", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== FIM PROVISÓRIO =====
    "fim_provisorio": {
        id: "fim_provisorio",
        titulo: "Até a Próxima",
        imagem: "imagens/estrada-norte.jpg",
        narrativa: `Por enquanto, sua história termina aqui.

Novos capítulos em breve!`,
        npc: {
            nome: "Fim",
            descricao: "Agradecemos por jogar.",
            estado: "neutro",
            portrait: "imagens/npc-sangue.png"
        },
        opcoes: [
            { texto: "🔄 RECOMEÇAR", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    }
};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CENAS };
}