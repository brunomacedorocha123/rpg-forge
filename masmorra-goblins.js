// masmorra-goblins.js
window.AVENTURA = {
    nome: "A Menina Elfa Raptada",
    descricao: "Uma aventura clássica começando em uma taverna.",
    cenaInicial: "exterior_taverna",
    
    cenas: {
        exterior_taverna: {
            id: "exterior_taverna",
            nome: "Entrada da Taverna",
            imagem: "taverna-exterior.jpg",
            fala: {
                npc: "Narrador",
                texto: "Você chega a uma taverna aconchegante. O letreiro range com o vento: 'A Javali Sangrento'. Risadas e música saem pelas frestas da porta."
            },
            npcs: [],
            opcoes: [
                {
                    texto: "Entrar na taverna",
                    proximo: "interior_taverna"
                }
            ]
        },
        
        interior_taverna: {
            id: "interior_taverna",
            nome: "Taverna A Javali Sangrento",
            imagem: "taverna-interior.jpg",
            fala: {
                npc: "Narrador",
                texto: "O calor da lareira e o cheiro de carne assada te recebem. A taverna está movimentada. Você encontra um lugar no balcão e o taverneiro se aproxima."
            },
            npcs: [
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "taverneiro.png",
                    dialogo: "Bem-vindo, viajante! Quer uma cerveja gelada? Só 2 moedas.",
                    opcoes: [
                        {
                            texto: "🍺 Comprar cerveja (2 moedas)",
                            tipo: "pagar",
                            valor: 2,
                            sucesso: "Saúde! Uma boa cerveja sempre anima.",
                            falha: "Você não tem dinheiro? Que pena..."
                        },
                        {
                            texto: "📰 Perguntar sobre novidades",
                            resposta: "Ora, tem havido problemas na estrada norte. Dizem que goblins estão atacando viajantes. Uns mercadores ontem mesmo falaram que ouviram gritos vindo da floresta..."
                        },
                        {
                            texto: "💼 Procurar trabalho",
                            resposta: "Sempre tem trabalho pra quem tem coragem. Fique por aqui, tome uma cerveja, e quem sabe aparece algo."
                        },
                        {
                            texto: "🗺️ Conversar sobre a região",
                            resposta: "A região é pacata, mas ultimamente... tem coisas estranhas acontecendo na floresta."
                        },
                        {
                            texto: "👀 Observar o ambiente enquanto bebe",
                            resposta: "Você pede uma cerveja e observa calmamente o movimento da taverna...",
                            acao: "iniciar_timer"
                        },
                        {
                            texto: "🚪 Sair da taverna",
                            proximo: "exterior_taverna"
                        }
                    ]
                }
            ],
            opcoes: []
        },
        
        interior_taverna_com_homem: {
            id: "interior_taverna_com_homem",
            nome: "Taverna - O Ferido Chega",
            imagem: "taverna-interior.jpg",
            fala: {
                npc: "Narrador",
                texto: "Enquanto você bebe sua cerveja e observa o ambiente, a porta se abre violentamente! Um homem ensanguentado entra cambaleando e cai perto da entrada."
            },
            npcs: [
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "taverneiro.png",
                    dialogo: "Pelos deuses! O que aconteceu com ele? Alguém ajude!",
                    opcoes: [
                        {
                            texto: "Falar com o taverneiro",
                            resposta: "Vá falar com ele, rápido! Ele precisa de ajuda!"
                        },
                        {
                            texto: "Sair da taverna",
                            proximo: "exterior_taverna"
                        }
                    ]
                },
                {
                    id: "homem_sangue",
                    nome: "Homem Ferido",
                    sprite: "npc-sangue.png",
                    dialogo: "Socorro... minha filha... os goblins... levaram minha filha! Por favor, alguém...",
                    opcoes: [
                        {
                            texto: "Falar com o homem ferido",
                            resposta: "Ele está fraco... você se aproxima para ouvir sua história.",
                            proximo_apos_resposta: "homem_fala_detalhes"
                        },
                        {
                            texto: "Pedir para o taverneiro ajudar",
                            resposta: "O taverneiro corre para ajudar, mas o homem precisa de um aventureiro."
                        }
                    ]
                }
            ],
            opcoes: [
                {
                    texto: "Sair da taverna",
                    proximo: "exterior_taverna"
                }
            ]
        },
        
        homem_fala_detalhes: {
            id: "homem_fala_detalhes",
            nome: "O Desespero de um Pai",
            imagem: "taverna-interior.jpg",
            fala: {
                npc: "Homem Ferido",
                texto: "Eu vinha pela estrada norte com minha filha Lyra... Ela tem 10 anos, cabelos prateados... Fomos atacados por goblins! Eles levaram ela para a floresta! Por favor, alguém tem que salvá-la!"
            },
            npcs: [
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "taverneiro.png",
                    dialogo: "Coitado. Eu avisei que a estrada estava perigosa. Alguém precisa ajudar esse homem.",
                    opcoes: [
                        {
                            texto: "Perguntar ao taverneiro sobre os goblins",
                            resposta: "Eles têm um acampamento na floresta, perto de uma caverna. Vários viajantes desapareceram por lá."
                        },
                        {
                            texto: "Sair da taverna",
                            proximo: "exterior_taverna"
                        }
                    ]
                },
                {
                    id: "homem_sangue",
                    nome: "Eldrin (Pai de Lyra)",
                    sprite: "npc-sangue.png",
                    dialogo: "Minha esposa morreu no inverno... Lyra é tudo que tenho! Por favor, aventureiro, você tem cara de ser corajoso...",
                    opcoes: [
                        {
                            texto: "✅ ACEITAR MISSÃO - Salvar Lyra",
                            resposta: "Deus te abençoe! Siga a estrada norte até a floresta!",
                            proximo_apos_resposta: "sair_para_aventura"
                        },
                        {
                            texto: "Perguntar sobre os goblins",
                            resposta: "Eram uns 10... verdes, fedidos... Levaram ela para o norte, para a floresta escura."
                        },
                        {
                            texto: "Sair da taverna",
                            proximo: "exterior_taverna"
                        }
                    ]
                }
            ],
            opcoes: [
                {
                    texto: "Sair da taverna",
                    proximo: "exterior_taverna"
                }
            ]
        },
        
        sair_para_aventura: {
            id: "sair_para_aventura",
            nome: "Missão Aceita",
            imagem: "taverna-exterior.jpg",
            fala: {
                npc: "Narrador",
                texto: "Você sai da taverna com determinação. A estrada norte se estende diante de você. O vento traz o cheiro da floresta distante."
            },
            npcs: [],
            opcoes: [
                {
                    texto: "Seguir para a estrada norte",
                    proximo: "encontro_camponesa"
                }
            ]
        },
        
        encontro_camponesa: {
            id: "encontro_camponesa",
            nome: "Estrada Norte",
            imagem: "estrada-norte.jpg",
            fala: {
                npc: "Narrador",
                texto: "Enquanto segue pela estrada, você avista uma jovem camponesa colhendo flores na beira do caminho."
            },
            npcs: [
                {
                    id: "camponesa",
                    nome: "Camponesa",
                    sprite: "camponesa.png",
                    dialogo: "Oh! Um viajante! Cuidado com a estrada, ouvi gritos de goblins mais adiante. Hoje cedo vi uma menina sendo levada para a floresta... uma elfinha de cabelos prateados.",
                    opcoes: [
                        {
                            texto: "Perguntar sobre a menina",
                            resposta: "Ela chorava muito, chamava pelo pai. Levaram ela para uma caverna, mais adiante."
                        },
                        {
                            texto: "Seguir viagem",
                            proximo: "carroca_destruida"
                        }
                    ]
                }
            ],
            opcoes: [
                {
                    texto: "Continuar para o norte",
                    proximo: "carroca_destruida"
                }
            ]
        },
        
        carroca_destruida: {
            id: "carroca_destruida",
            nome: "Local do Ataque",
            imagem: "carroca.jpg",
            fala: {
                npc: "Narrador",
                texto: "Você encontra uma carroça destruída na estrada. Manchas de sangue se espalham pela madeira. Uma boneca de pano está caída na lama."
            },
            npcs: [],
            opcoes: [
                {
                    texto: "Pegar a boneca (será importante)",
                    item: {
                        id: "boneca_lyra",
                        nome: "Boneca de Lyra",
                        descricao: "Uma boneca suja, provavelmente da menina.",
                        peso: 0.2,
                        preco: 5
                    },
                    resposta: "Você guarda a boneca. Pode ser importante."
                },
                {
                    texto: "Seguir os rastros dos goblins",
                    proximo: "clareira_goblins"
                }
            ]
        },
        
        clareira_goblins: {
            id: "clareira_goblins",
            nome: "Clareira na Floresta",
            imagem: "clareira-goblins.jpg",
            fala: {
                npc: "Narrador",
                texto: "Você encontra uma clareira onde vários goblins estão acampados perto de uma fogueira."
            },
            inimigos: [
                {
                    id: "goblin1",
                    nome: "Goblin",
                    sprite: "goblin.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                },
                {
                    id: "goblin2",
                    nome: "Goblin",
                    sprite: "goblin.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                }
            ],
            opcoes: [
                {
                    texto: "Atacar os goblins",
                    acao: "iniciar_combate",
                    inimigos: ["goblin1", "goblin2"]
                }
            ],
            ao_vencer: "entrada_caverna"
        },
        
        entrada_caverna: {
            id: "entrada_caverna",
            nome: "Entrada da Caverna",
            imagem: "entrada-caverna.jpg",
            fala: {
                npc: "Narrador",
                texto: "Uma abertura escura na rocha. Você ouve vozes ecoando."
            },
            opcoes: [
                {
                    texto: "Entrar na caverna",
                    proximo: "camara_chefe"
                }
            ]
        },
        
        camara_chefe: {
            id: "camara_chefe",
            nome: "Câmara do Chefe",
            imagem: "menina-elfa.jpg",
            fala: {
                npc: "Narrador",
                texto: "Numa jaula, uma menina elfa de cabelos prateados está sentada, assustada. Um goblin grande monta guarda."
            },
            npcs: [
                {
                    id: "menina_elfa",
                    nome: "Lyra",
                    sprite: "menina-elfa.jpg",
                    dialogo: "Por favor, me ajude!"
                },
                {
                    id: "chefe_goblin",
                    nome: "Chefe Goblin",
                    sprite: "chefe-goblin.jpg"
                }
            ],
            inimigos: [
                {
                    id: "chefe_goblin",
                    nome: "Chefe Goblin",
                    sprite: "chefe-goblin.jpg",
                    pv: 85,
                    pv_max: 85,
                    esquiva: 8,
                    nh_ataque: 10,
                    dano: "2d+2",
                    xp: 100
                }
            ],
            opcoes: [
                {
                    texto: "Atacar o chefe!",
                    acao: "iniciar_combate",
                    inimigos: ["chefe_goblin"]
                }
            ],
            ao_vencer: "final_vitoria"
        },
        
        final_vitoria: {
            id: "final_vitoria",
            nome: "Missão Cumprida",
            imagem: "menina-elfa.jpg",
            fala: {
                npc: "Lyra",
                texto: "Você me salvou! Muito obrigada!"
            },
            opcoes: [
                {
                    texto: "Voltar à taverna",
                    proximo: "final_taverna"
                }
            ]
        },
        
        final_taverna: {
            id: "final_taverna",
            nome: "Retorno Triunfal",
            imagem: "taverna-interior.jpg",
            fala: {
                npc: "Eldrin",
                texto: "MINHA FILHA! Você conseguiu! Muito obrigado, aventureiro!"
            },
            npcs: [
                {
                    id: "homem",
                    nome: "Eldrin",
                    sprite: "npc-sangue.png"
                },
                {
                    id: "lyra",
                    nome: "Lyra",
                    sprite: "menina-elfa.jpg"
                },
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "taverneiro.png"
                }
            ],
            opcoes: [
                {
                    texto: "Encerrar aventura",
                    acao: "finalizar_aventura"
                }
            ]
        }
    }
};