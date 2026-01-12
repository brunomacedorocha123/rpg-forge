/* ===========================================
  CATÁLOGO DE DESVANTAGENS - GURPS BÁSICO
  VERSÃO 1.0 - CATÁLOGO COMPLETO E ORGANIZADO
=========================================== */

const catalogoDesvantagens = [
    {
        id: 1,
        nome: "Avareza",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem está sempre preocupado em conservar suas riquezas e sempre busca o melhor acordo possível. Ele deve fazer um teste de autocontrole sempre que tiver que gastar algum dinheiro. Se a despesa for grande, o teste de autocontrole sofre uma penalidade de -5 ou maior (a critério do Mestre). Um fracasso significa que o personagem deve se recusar a gastar o dinheiro ou, se não houver escapatória, deve regatear e reclamar interminavelmente. É possível que um personagem tenha Cobiça e Avareza.",
        tipo: "simples"
    },
    {
        id: 2,
        nome: "Cobiça",
        custoBase: -15,
        categoria: "mentais",
        descricao: "O personagem tem paixão por dinheiro. Ele deve fazer um teste de autocontrole sempre que algum patrimônio for oferecido como pagamento por um trabalho lícito, proventos de uma aventura, pilhagem ou apenas isca. No caso de um fracasso, ele fará o que for preciso para obter o pagamento. Personagens Honestos fazem os testes de autocontrole com um bônus de +5 para resistir a um negócio escuso e +10 para resistir a um crime inequívoco.",
        tipo: "simples"
    },
    {
        id: 3,
        nome: "Confuso",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Para o personagem, o mundo parece um lugar estranho e incompreensível — pelo menos na maior parte do tempo. Ele não é necessariamente burro, mas demora a entender novos fatos ou situações. Quando está sozinho em meio à paz e tranquilidade de seu próprio lar, o personagem age normalmente. No entanto, em um lugar estranho ou agitado, ele deve fazer um teste de autocontrole. Se fracassar, ele fica paralisado, em vez de tomar uma atitude decidida ou apropriada.",
        tipo: "simples"
    },
    {
        id: 4,
        nome: "Covardia",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem é extremamente cuidadoso com relação ao seu bem-estar físico. Sempre que surgir a necessidade de se arriscar fisicamente, ele deve fazer um teste de autocontrole. Se houver risco de vida, o teste sofre uma penalidade de -5. No caso de um fracasso, ele deve recusar se arriscar, a menos que seja ameaçado com um perigo maior. Covardia impõe uma penalidade nas Verificações de Pânico sempre que houver risco de dano físico.",
        tipo: "simples"
    },
    {
        id: 5,
        nome: "Daltonismo",
        custoBase: -10,
        categoria: "fisicas",
        descricao: "O personagem não é capaz de distinguir nenhuma cor (isto é, sofre de acromatopsia). Em situações que exigem a identificação de cores (compra de pedras preciosas, identificação de um uniforme ou apertar o botão vermelho para dar partida num motor), o Mestre deve impor as dificuldades adequadas à situação. Além disso, algumas perícias serão sempre mais difíceis para um daltônico. Ele sofre uma penalidade de -1 nos testes de Comércio, Condução, Pilotagem, Química e Rastreamento.",
        tipo: "simples"
    },
    {
        id: 6,
        nome: "Dever",
        custoBase: -2,
        categoria: "mentais",
        descricao: "Se a ocupação ou posição social do personagem impuserem a ele uma obrigação pessoal significativa em relação a outras pessoas e, ocasionalmente, o obrigarem a obedecer a ordens perigosas, ele terá um 'Dever'. O Mestre deve fazer uma jogada no início de cada aventura para averiguar se ele surgirá durante o jogo. O custo básico em pontos desta desvantagem depende da frequência com que ela aparece no jogo.",
        tipo: "opcoes",
        opcoes: [
            { id: "esporadico", nome: "Esporádico (resultado de 6 ou menos)", custo: -2 },
            { id: "pouco_frequente", nome: "Pouco Frequente (resultado de 9 ou menos)", custo: -5 },
            { id: "bastante_frequente", nome: "Bastante Frequente (resultado de 12 ou menos)", custo: -10 },
            { id: "quase_sempre", nome: "Quase o tempo todo (resultado de 15 ou menos)", custo: -15 }
        ]
    },
    {
        id: 7,
        nome: "Excesso de Confiança",
        custoBase: -5,
        categoria: "mentais",
        descricao: "O personagem acha que é muito mais poderoso, inteligente e/ou competente do que realmente é. Ele pode ser orgulhoso e prepotente ou apenas quieto, mas determinado. Sempre que demonstrar um grau de cautela exagerado (na opinião do Mestre), o jogador deve fazer um teste de autocontrole. Um fracasso indica que o personagem não consegue ser cauteloso e tem que ir em frente como se fosse capaz de dominar a situação.",
        tipo: "simples"
    },
    {
        id: 8,
        nome: "Fobias",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Uma 'fobia' é um medo de um objeto, criatura ou circunstância específica. Alguns medos são razoáveis, mas uma fobia é um medo mórbido, irracional e ilógico. Quanto mais comum for o objeto ou situação, maior o valor em pontos da fobia. O personagem deve fazer um teste de autocontrole sempre que for exposto à sua fobia. No caso de um fracasso, jogue 3 dados, some a esse número a margem de fracasso no teste de autocontrole e procure o resultado na Tabela de Verificação de Pânico.",
        tipo: "selecao_multipla",
        opcoes: [
            // Em ordem alfabética
            { id: "acrofobia", nome: "Acrofobia (Medo de Alturas)", custo: -10 },
            { id: "agorafobia", nome: "Agorafobia (Medo de Espaços Abertos)", custo: -10 },
            { id: "aracnofobia", nome: "Aracnofobia (Medo de Aranhas)", custo: -5 },
            { id: "autofobia", nome: "Autofobia (Medo da Solidão)", custo: -15 },
            { id: "brontofobia", nome: "Brontofobia (Medo de Ruídos Altos)", custo: -10 },
            { id: "cinofobia", nome: "Cinofobia (Medo de Cães)", custo: -5 },
            { id: "claustrofobia", nome: "Claustrofobia (Medo de Espaços Fechados)", custo: -15 },
            { id: "coitofobia", nome: "Coitofobia (Medo de Sexo)", custo: -10 },
            { id: "demofobia", nome: "Demofobia (Medo de Multidões)", custo: -15 },
            { id: "ecmofobia", nome: "Ecmofobia (Medo de Coisas Afiadas)", custo: -15 },
            { id: "elurofobia", nome: "Elurofobia (Medo de Gatos)", custo: -5 },
            { id: "entomofobia", nome: "Entomofobia (Medo de Insetos)", custo: -10 },
            { id: "hematofobia", nome: "Hematofobia (Medo de Sangue)", custo: -10 },
            { id: "heliofobia", nome: "Heliofobia (Medo de Luz Solar)", custo: -15 },
            { id: "hoplofobia", nome: "Hoplofobia (Medo de Armas)", custo: -20 },
            { id: "manafobia", nome: "Manafobia (Medo de Magia)", custo: -15 },
            { id: "misofobia", nome: "Misofobia (Medo de Sujeira)", custo: -10 },
            { id: "necrofobia", nome: "Necrofobia (Medo da Morte)", custo: -10 },
            { id: "nictofobia", nome: "Nictofobia (Medo do Escuro)", custo: -15 },
            { id: "ofiofobia", nome: "Ofiofobia (Medo de Répteis)", custo: -10 },
            { id: "pirofobia", nome: "Pirofobia (Medo de Fogo)", custo: -5 },
            { id: "psicofobia", nome: "Psicofobia (Medo de Poderes Psíquicos)", custo: -15 },
            { id: "talassofobia", nome: "Talassofobia (Medo de Oceanos)", custo: -10 },
            { id: "tecnofobia", nome: "Tecnofobia (Medo de Maquinário)", custo: -15 },
            { id: "teratofobia", nome: "Teratofobia (Medo de Monstros)", custo: -15 },
            { id: "triscedecofobia", nome: "Triscedecafobia (Medo do Número 13)", custo: -5 },
            { id: "xenofobia", nome: "Xenofobia (Medo do Desconhecido)", custo: -15 }
        ]
    },
    {
        id: 9,
        nome: "Fúria",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem tende a perder o controle de si mesmo quando submetido a alguma tensão e ataca freneticamente o que quer que acredite ser a causa de seu problema. Sempre que sofrer um número de pontos de dano superior a 1/4 dos seus PV em menos de um segundo ou quando presenciar uma punição equivalente sendo causada a um ente querido, o personagem precisa fazer um teste de autocontrole. Um fracasso significa que ele ficou enfurecido.",
        tipo: "simples"
    }
];

// Ordenar por nome
catalogoDesvantagens.sort((a, b) => a.nome.localeCompare(b.nome));

// Atribuir IDs sequenciais após ordenação
catalogoDesvantagens.forEach((desv, index) => {
    desv.id = index + 1;
});

// Exportar para uso global
window.catalogoDesvantagens = catalogoDesvantagens;