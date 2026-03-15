// FILE: cenas.js
// ============================================
// CENAS.JS - TODAS AS CENAS DA AVENTURA SOLO
// ============================================

const CENAS = {
    // ===== CENA INICIAL =====
    "grito_estrada": {
        id: "grito_estrada",
        titulo: "O Grito na Estrada",
        imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
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
            descricao: "Homem simples, rosto sujo de terra, roupas rasgadas. Ele treme de medo e implora por ajuda.",
            estado: "neutro",
            portrait: "https://via.placeholder.com/100x100/4a2a2a/bf9b5c?text=Campones"
        },
        opcoes: [
            { 
                texto: "⚔️ ATACAR o agressor", 
                acao: "iniciar_combate", 
                inimigo: "saqueador_faminto",
                descricao: "Partir para cima do bandido antes que ele ataque novamente."
            },
            { 
                texto: "💬 TENTAR CONVERSAR", 
                acao: "teste_pericia", 
                pericia: "persuasao",
                cd: 12,
                sucesso: "conversa_sucesso",
                falha: "conversa_falha",
                descricao: "Tentar acalmar os ânimos e resolver isso sem violência."
            },
            { 
                texto: "👁️ OBSERVAR a cena", 
                acao: "teste_pericia", 
                pericia: "observar",
                cd: 10,
                sucesso: "observar_sucesso",
                falha: "grito_estrada", // falha não muda cena
                descricao: "Analisar a situação antes de agir."
            },
            { 
                texto: "🏃 FUGIR", 
                acao: "ir_para_cena", 
                destino: "fuga_covarde",
                descricao: "Isso não é problema seu. Melhor seguir viagem."
            }
        ],
        musica: "tensa",
        combate_inicia: false // só inicia se escolher atacar
    },

    // ===== PÓS-COMBATE (VITÓRIA) =====
    "pos_combate": {
        id: "pos_combate",
        titulo: "O Resgate",
        imagem: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800",
        narrativa: `O saqueador foge pela mata, derrotado.

O camponês se levanta com dificuldade e respira aliviado.

— Obrigado… achei que ele fosse me matar.

Ele se aproxima, ainda trêmulo, e estende a mão.

— Meu nome é Edrin. Eu estava indo para a vila de Ravena… mas a estrada anda perigosa. Se não fosse você, eu estaria morto.

Ele olha para a direção onde o bandido fugiu.

— Conheço um atalho seguro até Ravena. Quer vir comigo? Ou tem outros planos?`,
        npc: {
            nome: "Edrin",
            descricao: "Camponês de meia-idade, agora grato e mais calmo. Seus olhos demonstram sincera gratidão.",
            estado: "amigavel",
            portrait: "https://via.placeholder.com/100x100/2a4a2a/bf9b5c?text=Edrin"
        },
        opcoes: [
            { 
                texto: "👥 ACOMPANHAR Edrin até Ravena", 
                acao: "ir_para_cena", 
                destino: "estrada_ravena",
                descricao: "Acompanhar Edrin pelo atalho seguro até a vila."
            },
            { 
                texto: "🔍 INVESTIGAR o saqueador", 
                acao: "ir_para_cena", 
                destino: "investigar_saqueador",
                descricao: "Seguir o rastro do bandido ferido pela mata."
            },
            { 
                texto: "🏛️ PERGUNTAR sobre as ruínas", 
                acao: "ir_para_cena", 
                destino: "ruinas_colinas",
                descricao: "Edrin mencionou ruínas? Perguntar sobre elas."
            },
            { 
                texto: "🌄 SEGUIR VIAGEM sozinho", 
                acao: "ir_para_cena", 
                destino: "estrada_solitario",
                descricao: "Agradecer a Edrin, mas seguir seu próprio caminho."
            }
        ]
    },

    // ===== CENA: CONVERSA COM SUCESSO =====
    "conversa_sucesso": {
        id: "conversa_sucesso",
        titulo: "Palavras Acalmam",
        imagem: "https://images.unsplash.com/photo-1519677584237-752f8853252e?w=800",
        narrativa: `Você ergue as mãos em gesto de paz.

— Calma, ninguém precisa morrer hoje. O que está acontecendo aqui?

O agressor hesita, o pedaço de madeira ainda erguido.

— Esse... esse miserável me deve dinheiro! — ele rosna, mas sua voz já não tem tanta convicção.

— MENTIRA! — grita o camponês. — Eu nunca vi esse homem na vida!

O bandido olha de você para o camponês, claramente sem esperança.

— Estou com fome... só queria comer algo... — ele murmura, baixando o pedaço de madeira.

O camponês se levanta, cauteloso, e olha para o agressor.

— Eu tenho um pão na bolsa... posso dar metade. Mas jura que vai embora?

O homem magro assente, envergonhado. O camponês lhe dá o pão e o bandido foge pela mata.

Edrin se vira para você.

— Obrigado... Você tem o dom da palavra. Meu nome é Edrin.`,
        npc: {
            nome: "Edrin",
            descricao: "Aliviado por ter escapado sem violência.",
            estado: "amigavel",
            portrait: "https://via.placeholder.com/100x100/2a4a2a/bf9b5c?text=Edrin"
        },
        opcoes: [
            { texto: "👥 Acompanhar Edrin até Ravena", acao: "ir_para_cena", destino: "estrada_ravena" },
            { texto: "🌄 Seguir viagem sozinho", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== CENA: CONVERSA COM FALHA =====
    "conversa_falha": {
        id: "conversa_falha",
        titulo: "Palavras em Vão",
        imagem: "https://images.unsplash.com/photo-1519677584237-752f8853252e?w=800",
        narrativa: `Você tenta argumentar com o agressor, mas suas palavras não o alcançam.

— CHEGA! — ele grita, furioso. — Você quer se meter? ENTÃO MORRE TAMBÉM!

O homem parte para cima de você, pedaço de madeira em punho.

Não há mais tempo para conversa.`,
        npc: {
            nome: "Saqueador Enfurecido",
            descricao: "Seus olhos estão arregalados de raiva e desespero.",
            estado: "hostil",
            portrait: "https://via.placeholder.com/100x100/4a2a2a/8b0000?text=Saqueador"
        },
        opcoes: [
            { texto: "⚔️ DEFENDER-SE", acao: "iniciar_combate", inimigo: "saqueador_faminto" }
        ]
    },

    // ===== CENA: OBSERVAR COM SUCESSO =====
    "observar_sucesso": {
        id: "observar_sucesso",
        titulo: "Detalhes Importantes",
        imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        narrativa: `Você analisa a cena com atenção.

O agressor está magro, suas roupas são rasgadas e ele treme — não de raiva, mas de fome. O pedaço de madeira que ele empunha é improvisado, um galho grosso.

O camponês... você nota um detalhe. Sua bolsa tem um símbolo bordado: uma folha de carvalho. Você já viu esse símbolo antes — é da guilda dos mercadores de Ravena.

O camponês é um mercador, não um simples camponês. Ele está mentindo sobre quem é.

O agressor, por outro lado, parece apenas um miserável faminto.

Essas informações podem ser úteis.`,
        npc: {
            nome: "???",
            descricao: "Agora você desconfia: este 'camponês' não é quem parece ser.",
            estado: "neutro",
            portrait: "https://via.placeholder.com/100x100/4a2a2a/bf9b5c?text=Desconhecido"
        },
        opcoes: [
            { texto: "⚔️ ATACAR o agressor", acao: "iniciar_combate", inimigo: "saqueador_faminto" },
            { texto: "💬 QUESTIONAR o camponês", acao: "ir_para_cena", destino: "questionar_mercador" },
            { texto: "💬 TENTAR CONVERSAR com o agressor", acao: "teste_pericia", pericia: "persuasao", cd: 10, sucesso: "conversa_saqueador_sucesso", falha: "conversa_falha" }
        ]
    },

    // ===== CENA: ESTRADA PARA RAVENA =====
    "estrada_ravena": {
        id: "estrada_ravena",
        titulo: "Caminho para Ravena",
        imagem: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
        narrativa: `Você e Edrin caminham por um atalho entre as árvores. A estrada principal fica para trás.

— Ravena não é grande coisa — ele comenta —, mas tem uma estalagem decente. A Velha Carvalho. A comida é boa e o dono não faz muitas perguntas.

Ele olha para você.

— Se precisar de um lugar para ficar, diga que foi Edrin quem mandou. Seu Joren, o estalajadeiro, é meu primo.

A vila começa a aparecer entre as árvores. Pequena, modesta, mas acolhedora.

— Bem-vindo a Ravena, amigo. O que pretende fazer agora?`,
        npc: {
            nome: "Edrin",
            descricao: "Seu novo amigo, mais relaxado agora que está perto de casa.",
            estado: "amigavel",
            portrait: "https://via.placeholder.com/100x100/2a4a2a/bf9b5c?text=Edrin"
        },
        opcoes: [
            { texto: "🏨 IR à estalagem A Velha Carvalho", acao: "ir_para_cena", destino: "estalagem_ravena" },
            { texto: "🛒 EXPLORAR a vila", acao: "ir_para_cena", destino: "explorar_ravena" },
            { texto: "👋 SE DESPEDIR de Edrin", acao: "ir_para_cena", destino: "estrada_solitario" }
        ]
    },

    // ===== CENA: FIM PROVISÓRIO =====
    "estrada_solitario": {
        id: "estrada_solitario",
        titulo: "Sozinho na Estrada",
        imagem: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        narrativa: `Você segue seu caminho sozinho, a estrada se estendendo à sua frente.

O sol começa a se pôr, pintando o céu em tons de laranja e púrpura.

Por enquanto, sua jornada continua. Novas aventuras o aguardam.

(A história continua... em breve)`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho na estrada.",
            estado: "neutro",
            portrait: "https://via.placeholder.com/100x100/2a2a3c/666?text=Sozinho"
        },
        opcoes: [
            { texto: "🔄 RECOMEÇAR aventura", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    },

    // ===== CENA: FUGA COVARDE =====
    "fuga_covarde": {
        id: "fuga_covarde",
        titulo: "Covardia",
        imagem: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        narrativa: `Você se afasta rapidamente, ignorando os gritos de socorro.

Enquanto caminha, o som da luta ecoa atrás de você... até que silencia.

Você nunca saberá o que aconteceu com aquele homem.

A culpa pesa em seus ombros.

(Aventureiros de verdade não fogem.)`,
        npc: {
            nome: "—",
            descricao: "Você está sozinho com sua consciência.",
            estado: "neutro",
            portrait: "https://via.placeholder.com/100x100/2a2a3c/666?text=Culpa"
        },
        opcoes: [
            { texto: "🔄 TENTAR NOVAMENTE", acao: "ir_para_cena", destino: "grito_estrada" }
        ]
    }
};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CENAS };
}