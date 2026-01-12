/* ===========================================
  CATÁLOGO DE DESVANTAGENS - GURPS BÁSICO
  VERSÃO 1.0 - TODAS AS DESVANTAGENS LISTADAS
=========================================== */

const catalogoDesvantagens = [
    {
        id: 1,
        nome: "Avareza",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem está sempre preocupado em conservar suas riquezas. Deve fazer teste de autocontrole sempre que tiver que gastar algum dinheiro. Se a despesa for grande, o teste sofre penalidade de -5 ou maior. Fracasso significa recusa em gastar ou regateio interminável. Pode ser combinada com Cobiça.",
        tipo: "simples"
    },
    {
        id: 2,
        nome: "Cobiça",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Paixão por dinheiro. Teste de autocontrole sempre que patrimônio for oferecido como pagamento por um trabalho lícito, proventos de uma aventura, pilhagem ou apenas isca. Personagens Honestos têm +5 para resistir a um negócio escuso e +10 para resistir a um crime inequívoco. Praticamente todos os personagens com Cobiça acabam, mais cedo ou mais tarde, fazendo alguma coisa ilegal.",
        tipo: "simples"
    },
    {
        id: 3,
        nome: "Confuso",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Para o personagem, o mundo parece um lugar estranho e incompreensível. Não é necessariamente burro, mas demora a entender novos fatos ou situações. Reage mal a estímulos em excesso. Em lugar estranho ou agitado, deve fazer teste de autocontrole. Se fracassar, fica paralisado, em vez de tomar uma atitude decidida ou apropriada. Em combate, realiza manobra Fazer Nada a cada turno.",
        tipo: "simples"
    },
    {
        id: 4,
        nome: "Covardia",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem é extremamente cuidadoso com relação ao seu bem-estar físico. Sempre que surgir a necessidade de se arriscar fisicamente, deve fazer teste de autocontrole. Se houver risco de vida, teste sofre penalidade de -5. Fracasso = recusa em se arriscar. Covardia impõe penalidade nas Verificações de Pânico sempre que houver risco de dano físico.",
        tipo: "simples"
    },
    {
        id: 5,
        nome: "Daltonismo",
        custoBase: -10,
        categoria: "fisicas",
        descricao: "O personagem não é capaz de distinguir nenhuma cor (sofre de acromatopsia). Em situações que exigem identificação de cores, o Mestre deve impor dificuldades adequadas. Penalidade de -1 nos testes de Comércio, Condução, Pilotagem, Química e Rastreamento.",
        tipo: "simples"
    },
    {
        id: 6,
        nome: "Dever",
        custoBase: -2,
        categoria: "mentais",
        descricao: "Obrigação pessoal significativa imposta por ocupação ou posição social. O Mestre faz jogada no início de cada aventura para averiguar se surgirá durante o jogo.",
        tipo: "opcoes",
        opcoes: [
            { id: "esporadico", nome: "Esporádico (6 ou menos)", custo: -2 },
            { id: "pouco_frequente", nome: "Pouco Frequente (9 ou menos)", custo: -5 },
            { id: "bastante_frequente", nome: "Bastante Frequente (12 ou menos)", custo: -10 },
            { id: "quase_sempre", nome: "Quase Sempre (15 ou menos)", custo: -15 },
            { id: "extremamente_perigoso", nome: "Extremamente Perigoso", custo: -20 },
            { id: "inofensivo", nome: "Inofensivo", custo: -7 },
            { id: "involuntario", nome: "Involuntário", custo: -7 }
        ]
    },
    {
        id: 7,
        nome: "Excesso de Confiança",
        custoBase: -5,
        categoria: "mentais",
        descricao: "O personagem acha que é muito mais poderoso, inteligente e/ou competente do que realmente é. Sempre que demonstrar um grau de cautela exagerado, deve fazer teste de autocontrole. Fracasso = não consegue ser cauteloso. Imprime bônus de +2 aos testes de reação de pessoas jovens ou ingênuas e penalidade de -2 a PdMs experientes.",
        tipo: "simples"
    },
    {
        id: 8,
        nome: "Fúria",
        custoBase: -10,
        categoria: "mentais",
        descricao: "O personagem tende a perder o controle de si mesmo quando submetido a alguma tensão e ataca freneticamente. Teste de autocontrole ao sofrer dano > 1/4 PV ou presenciar punição equivalente a ente querido. Enfurecido = obrigado a realizar Ataque Total, não fica atordoado, testes para se manter vivo contra HT+4.",
        tipo: "simples"
    },
    // Fobias específicas (como listadas)
    {
        id: 9,
        nome: "Necrofobia (Medo da Morte)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Terror com a ideia da morte. Teste de autocontrole sempre que estiver em presença de um morto. Penalidade -4 se corpo for de pessoa conhecida, -6 se estiver animado. Fantasma também exige teste com -6.",
        tipo: "simples"
    },
    {
        id: 10,
        nome: "Acrofobia (Medo de Alturas)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Incapaz de ir voluntariamente a lugar com mais de 5m de altura, a menos que dentro de edifício e longe das janelas. Todos os testes de autocontrole sofrem penalidade de -5 se houver chance real de queda.",
        tipo: "simples"
    },
    {
        id: 11,
        nome: "Aracnofobia (Medo de Aranhas)",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Medo patológico de aranhas. Teste de autocontrole na presença de aranhas.",
        tipo: "simples"
    },
    {
        id: 12,
        nome: "Hoplofobia (Medo de Armas)",
        custoBase: -20,
        categoria: "mentais",
        descricao: "Qualquer tipo de arma deixa o personagem transtornado. Usar ou ser ameaçado com arma exige teste de autocontrole com penalidade de -2.",
        tipo: "simples"
    },
    {
        id: 13,
        nome: "Cinofobia (Medo de Cães)",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Medo de cães e todos os tipos de caninos: raposas, lobos, coiotes, cães selvagens, etc.",
        tipo: "simples"
    },
    {
        id: 14,
        nome: "Ecmofobia (Medo de Coisas Afiadas)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Medo de qualquer coisa contundente. Espadas, lanças, facas e agulhas hipodérmicas provocam ataques. Tentar usar arma afiada ou ser ameaçado com uma exige teste de autocontrole com penalidade de -2.",
        tipo: "simples"
    },
    {
        id: 15,
        nome: "Xenofobia (Medo do Desconhecido)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Fica transtornado com qualquer tipo de circunstâncias estranhas e, particularmente, com pessoas estranhas. Teste de autocontrole quando cercado de pessoas de outra raça ou nacionalidade. Penalidade de -3 para pessoas não-humanas.",
        tipo: "simples"
    },
    {
        id: 16,
        nome: "Nictofobia (Medo do Escuro)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Medo comum, mas incapacitante da escuridão. Deve evitar lugares subterrâneos sempre que possível. Perde a cabeça se alguma coisa acontecer à sua lanterna ou tocha.",
        tipo: "simples"
    },
    {
        id: 17,
        nome: "Agorafobia (Medo de Espaços Abertos)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Sente-se desconfortável sempre que estiver em lugares abertos e fica verdadeiramente aterrorizado quando não houver nenhuma parede num raio de 15m.",
        tipo: "simples"
    },
    {
        id: 18,
        nome: "Claustrofobia (Medo de Espaços Fechados)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Sente-se desconfortável toda vez que não consegue ver o céu. Em aposento ou veículo pequeno, sente como se as paredes estivessem se fechando sobre ela. Precisa de ar! Perigosa para quem se aventura pelos subterrâneos.",
        tipo: "simples"
    },
    {
        id: 19,
        nome: "Pirofobia (Medo de Fogo)",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Até mesmo um cigarro aceso incomoda o personagem se estiver a menos de cinco metros de distância.",
        tipo: "simples"
    },
    {
        id: 20,
        nome: "Elurofobia (Medo de Gatos)",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Medo de gatos.",
        tipo: "simples"
    },
    {
        id: 21,
        nome: "Entomofobia (Medo de Insetos)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Medo de todos os 'insetos'. Para insetos grandes ou venenosos, teste com penalidade de -3. Insetos muito grandes, ou em número muito grande, penalidade de -6.",
        tipo: "simples"
    },
    {
        id: 22,
        nome: "Heliofobia (Medo de Luz Solar)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Medo da luz solar.",
        tipo: "simples"
    },
    {
        id: 23,
        nome: "Manafobia (Medo de Magia)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Incapaz de aprender a usar magia e reage mal na presença de qualquer um que a use. Teste de autocontrole sempre que estiver em presença de magia. Penalidade -3 se estiver na iminência de ser alvo de magia benigna e -6 se for hostil.",
        tipo: "simples"
    },
    {
        id: 24,
        nome: "Tecnofobia (Medo de Maquinário)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Incapaz de aprender a consertar máquinas e se recusa a aprender a usar qualquer coisa mais complicada que uma besta ou bicicleta. Ambiente altamente tecnológico exige teste de autocontrole; lidar com computadores ou robôs exige teste com penalidade de -3.",
        tipo: "simples"
    },
    {
        id: 25,
        nome: "Teratofobia (Medo de Monstros)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Medo de criaturas 'antinaturais'. Penalidade varia entre -1 e -4 no teste de autocontrole se monstro parecer muito grande ou perigoso ou se existirem muitos.",
        tipo: "simples"
    },
    {
        id: 26,
        nome: "Demofobia (Medo de Multidões)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Qualquer grupo com mais de uma dúzia de pessoas provoca esse medo, a menos que sejam bem conhecidas. Penalidade de -1 para grupos com mais de 25 pessoas, -2 para mais de 100, -3 para 1.000, -4 para 10.000, etc.",
        tipo: "simples"
    },
    {
        id: 27,
        nome: "Triscedecofobia (Medo do Número 13)",
        custoBase: -5,
        categoria: "mentais",
        descricao: "Teste de autocontrole para fazer algo que envolva o número 13: visitar o 13° andar, comprar por $13, etc. Penalidade de -5 se uma sexta-feira 13 estiver envolvida.",
        tipo: "simples"
    },
    {
        id: 28,
        nome: "Talassofobia (Medo de Oceanos)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Medo de grandes massas de água. Viagens marítimas, ou aéreas sobre o mar, são inconcebíveis. Encontros com monstros marinhos serão inquietantes.",
        tipo: "simples"
    },
    {
        id: 29,
        nome: "Psicofobia (Medo de Poderes Psíquicos)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Medo de pessoas com poderes psíquicos. Exibição real de poder em sua presença exige teste de autocontrole. Não permite que outras pessoas usem psiquismo sobre ele.",
        tipo: "simples"
    },
    {
        id: 30,
        nome: "Ofiofobia (Medo de Répteis)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Terror de répteis, anfíbios e outras criaturas escamosas/pegajosas. Réptil muito grande ou venenoso exige teste com penalidade de -2; quantidade muito grande de répteis penalidade de -4.",
        tipo: "simples"
    },
    {
        id: 31,
        nome: "Brontofobia (Medo de Ruídos Altos)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Evita qualquer situação em que haja possibilidade de ruídos altos. Ruído muito alto que apareça subitamente exige teste de autocontrole. Tempestade é experiência traumática.",
        tipo: "simples"
    },
    {
        id: 32,
        nome: "Hematofobia (Medo de Sangue)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Ver sangue dá arrepios. Teste de autocontrole durante a maioria dos combates.",
        tipo: "simples"
    },
    {
        id: 33,
        nome: "Coitofobia (Medo de Sexo)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Terror só de pensar em ter relação sexual e na perda da virgindade.",
        tipo: "simples"
    },
    {
        id: 34,
        nome: "Autofobia (Medo da Solidão)",
        custoBase: -15,
        categoria: "mentais",
        descricao: "Não suporta ficar sozinho e faz tudo para evitar isso.",
        tipo: "simples"
    },
    {
        id: 35,
        nome: "Misofobia (Medo de Sujeira)",
        custoBase: -10,
        categoria: "mentais",
        descricao: "Medo de infecção ou simples sujeira. Teste de autocontrole antes de fazer qualquer coisa que possa sujá-lo, ou teste com penalidade de -5 para comer comida com a qual não está habituado.",
        tipo: "simples"
    }
];

// Ordenar por nome
catalogoDesvantagens.sort((a, b) => a.nome.localeCompare(b.nome));

// Atribuir IDs sequenciais após ordenação
catalogoDesvantagens.forEach((desv, index) => {
    desv.id = index + 1;
});