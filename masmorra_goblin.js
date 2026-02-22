// aventuras/masmorra_goblins.js
// Aventura: A Menina Elfa Raptada

const AVENTURA = {
    nome: "A Menina Elfa Raptada",
    descricao: "Uma aventura clássica começando em uma taverna.",
    cenaInicial: "exterior_taverna",
    
    // SEM config com moedas iniciais - usa dados do personagem do Firebase
    // SEM recompensas automáticas - tudo vem do sistema de recompensas da sala-aventura
    
    cenas: {
        
        // ------------------------------------------------------
        // CENA 1: EXTERIOR DA TAVERNA
        // ------------------------------------------------------
        exterior_taverna: {
            id: "exterior_taverna",
            nome: "Entrada da Taverna",
            imagem: "imagem/taverna-exterior.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Você chega a uma taverna aconchegante. O letreiro range com o vento: 'A Javali Sangrento'. Risadas e música saem pelas frestas da porta."
            },
            
            npcs: [],
            
            opcoes: [
                {
                    texto: "Entrar na taverna",
                    proximo: "interior_taverna"
                },
                {
                    texto: "Dar a volta e seguir viagem",
                    proximo: "estrada_norte"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 2: INTERIOR DA TAVERNA
        // ------------------------------------------------------
        interior_taverna: {
            id: "interior_taverna",
            nome: "Taverna A Javali Sangrento",
            imagem: "imagem/taverna-interior.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "O calor da lareira e o cheiro de carne assada te recebem. A taverna está movimentada, mas você encontra um lugar no balcão."
            },
            
            npcs: [
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "imagem/taverneiro.jpg",
                    avatar: "imagem/taverneiro.jpg",
                    x: 50,
                    y: 60,
                    
                    dialogo: "Bem-vindo, viajante! Quer uma cerveja gelada? Só 2 moedas.",
                    
                    opcoes: [
                        {
                            texto: "Comprar cerveja (2 moedas)",
                            tipo: "pagar",
                            valor: 2,
                            sucesso: "Saúde! Uma boa cerveja sempre anima.",
                            falha: "Você não tem dinheiro? Que pena...",
                            efeito_sucesso: {
                                fadiga: -1
                            }
                        },
                        {
                            texto: "Recusar educadamente",
                            resposta: "Como quiser. Se precisar de algo, é só chamar."
                        },
                        {
                            texto: "Perguntar sobre novidades",
                            resposta: "Bem, ouvi dizer que tem havido ataques de goblins na estrada norte. Mas é só boato..."
                        }
                    ]
                }
            ],
            
            opcoes: [
                {
                    texto: "Observar o ambiente",
                    proximo: "interior_taverna"
                },
                {
                    texto: "Sair da taverna",
                    proximo: "exterior_taverna"
                }
            ],
            
            eventos: [
                {
                    trigger: "ao_entrar",
                    delay: 2000,
                    acao: "homem_ensanguentado_entra"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 2B: HOMEM ENSANGUENTADO
        // ------------------------------------------------------
        homem_ensanguentado: {
            id: "homem_ensanguentado",
            nome: "Comocionante na Taverna",
            imagem: "imagem/taverna-interior.jpg",
            
            fala: {
                npc: "Homem Ensanguentado",
                avatar: "imagem/npc-sangue.jpg",
                texto: "Socorro! Por favor, alguém me ajude! Eu vinha pela estrada norte quando fomos atacados por goblins! Eles... eles raptaram minha filha! Uma menina elfa... ela só tem 10 anos! Por favor, alguém precisa salvá-la!"
            },
            
            npcs: [
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "imagem/taverneiro.jpg",
                    x: 50,
                    y: 60
                },
                {
                    id: "homem_sangue",
                    nome: "Homem Ferido",
                    sprite: "imagem/npc-sangue.jpg",
                    x: 70,
                    y: 40
                }
            ],
            
            opcoes: [
                {
                    texto: "Oferecer ajuda (missão)",
                    tipo: "missao",
                    resposta: "Deus te abençoe, nobre aventureiro! Minha filha se chama Lyra. Por favor, traga ela de volta!",
                    proximo: "exterior_taverna",
                    efeito: {
                        missao: "resgatar_elfa",
                        status: "aceita"
                    }
                },
                {
                    texto: "Ignorar e seguir sua vida",
                    resposta: "Seu coração gelado... que os deuses tenham piedade de você.",
                    proximo: "exterior_taverna"
                },
                {
                    texto: "Pedir mais informações",
                    resposta: "Eles estavam a cerca de 2 horas a norte, perto de uma clareira. Minha filha... ela tem cabelos prateados e usa um medalhão de família. Por favor!"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 3: ENCONTRO COM A CAMPONESA
        // ------------------------------------------------------
        encontro_camponesa: {
            id: "encontro_camponesa",
            nome: "Estrada Norte",
            imagem: "imagem/estrada-norte.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Enquanto segue pela estrada, você avista uma jovem camponesa colhendo flores na beira do caminho."
            },
            
            npcs: [
                {
                    id: "camponesa",
                    nome: "Camponesa",
                    sprite: "imagem/camponesa.jpg",
                    avatar: "imagem/camponesa.jpg",
                    x: 40,
                    y: 50,
                    
                    dialogo: "Oh! Um viajante! Raramente vemos alguém por estas bandas.",
                    
                    opcoes: [
                        {
                            texto: "Perguntar sobre a estrada",
                            resposta: "A estrada é segura até a floresta, mas dizem que tem goblins mais adiante. Tenha cuidado!"
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
        
        // ------------------------------------------------------
        // CENA 4: CARROÇA DESTRUÍDA
        // ------------------------------------------------------
        carroca_destruida: {
            id: "carroca_destruida",
            nome: "Local do Ataque",
            imagem: "imagem/carroca.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Você encontra uma carroça destruída na estrada. Manchas de sangue se espalham pela madeira. Pertences estão espalhados pelo chão."
            },
            
            npcs: [],
            
            opcoes: [
                {
                    texto: "Tentar rastrear os goblins",
                    tipo: "teste",
                    atributo: "iq",
                    dificuldade: 12,
                    sucesso: {
                        texto: "Você encontra pegadas frescas na lama.",
                        proximo: "clareira_goblins"
                    },
                    falha: {
                        texto: "Você não consegue encontrar o caminho...",
                        proximo: "clareira_goblins",
                        efeito: {
                            fadiga: -2
                        }
                    }
                },
                {
                    texto: "Seguir pela estrada",
                    proximo: "clareira_goblins",
                    efeito: {
                        fadiga: -2
                    }
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 5: CLAREIRA DOS GOBLINS
        // ------------------------------------------------------
        clareira_goblins: {
            id: "clareira_goblins",
            nome: "Clareira na Floresta",
            imagem: "imagem/clareira-goblins.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Você encontra uma clareira onde vários goblins estão acampados. Eles parecem relaxados, sem perceber sua presença."
            },
            
            opcoes: [
                {
                    texto: "Tentar furtividade",
                    tipo: "teste",
                    atributo: "dx",
                    dificuldade: 12,
                    sucesso: {
                        texto: "Você passa despercebido e descobre a entrada da caverna.",
                        proximo: "entrada_caverna"
                    },
                    falha: {
                        texto: "Você pisa em um galho! Os goblins te veem!",
                        acao: "iniciar_combate",
                        inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"],
                        iniciativa: "inimigos"
                    }
                },
                {
                    texto: "Atacar os goblins de frente",
                    acao: "iniciar_combate",
                    inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"],
                    iniciativa: "jogador"
                },
                {
                    texto: "Voltar",
                    proximo: "carroca_destruida"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 6: ENTRADA DA CAVERNA
        // ------------------------------------------------------
        entrada_caverna: {
            id: "entrada_caverna",
            nome: "Entrada da Caverna",
            imagem: "imagem/entrada-caverna.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Uma abertura escura na rocha. Você sente um cheiro úmido e ouve goteiras ao longe."
            },
            
            opcoes: [
                {
                    texto: "Entrar na caverna",
                    proximo: "corredor_caverna"
                },
                {
                    texto: "Sair",
                    proximo: "clareira_goblins"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 7: CORREDOR DA CAVERNA
        // ------------------------------------------------------
        corredor_caverna: {
            id: "corredor_caverna",
            nome: "Corredor Sombrio",
            imagem: "imagem/corredor-caverna.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "O corredor se estende à frente. Ecoam vozes de goblins conversando em algum lugar próximo."
            },
            
            opcoes: [
                {
                    texto: "Avançar furtivamente",
                    tipo: "teste",
                    atributo: "dx",
                    dificuldade: 12,
                    sucesso: {
                        texto: "Você passa despercebido.",
                        proximo: "camara_chefe"
                    },
                    falha: {
                        texto: "Você é descoberto!",
                        acao: "iniciar_combate",
                        inimigos: ["goblin1", "goblin2", "goblin3"],
                        iniciativa: "inimigos"
                    }
                },
                {
                    texto: "Correr para frente",
                    proximo: "camara_chefe",
                    efeito: {
                        fadiga: -1
                    }
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 8: CÂMARA DO CHEFE
        // ------------------------------------------------------
        camara_chefe: {
            id: "camara_chefe",
            nome: "Câmara do Chefe Goblin",
            imagem: "imagem/chefe-goblin.jpg",
            
            fala: {
                npc: "Chefe Goblin",
                avatar: "imagem/chefe-goblin.jpg",
                texto: "Humano? HAHAHA! Veio buscar a elfa? Vai ter que passar por MIM!"
            },
            
            npcs: [
                {
                    id: "menina_elfa",
                    nome: "Lyra",
                    sprite: "imagem/menina-elfa.jpg",
                    x: 50,
                    y: 60
                },
                {
                    id: "chefe_goblin",
                    nome: "Chefe Goblin",
                    sprite: "imagem/chefe-goblin.jpg",
                    x: 70,
                    y: 30
                }
            ],
            
            opcoes: [
                {
                    texto: "Atacar o chefe!",
                    acao: "iniciar_combate",
                    inimigos: ["chefe_goblin", "goblin_guarda1", "goblin_guarda2"],
                    iniciativa: "jogador",
                    ao_vencer: "final_vitoria"
                },
                {
                    texto: "Tentar negociar",
                    tipo: "teste",
                    atributo: "iq",
                    dificuldade: 15,
                    sucesso: {
                        texto: "'HAHA! Humano engraçado! Pode levar a elfa... em troca do seu equipamento mais valioso!'",
                        proximo: "final_negociacao"
                    },
                    falha: {
                        texto: "'NEGOCIAR NÃO! MATAR HUMANO!'",
                        acao: "iniciar_combate",
                        inimigos: ["chefe_goblin", "goblin_guarda1", "goblin_guarda2"],
                        iniciativa: "inimigos"
                    }
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA FINAL: VITÓRIA
        // ------------------------------------------------------
        final_vitoria: {
            id: "final_vitoria",
            nome: "Missão Cumprida",
            imagem: "imagem/menina-elfa.jpg",
            
            fala: {
                npc: "Lyra",
                avatar: "imagem/menina-elfa.jpg",
                texto: "Você me salvou! Muito obrigada! Meu pai vai ficar tão feliz!"
            },
            
            npcs: [
                {
                    id: "lyra",
                    nome: "Lyra",
                    sprite: "imagem/menina-elfa.jpg",
                    x: 50,
                    y: 50
                }
            ],
            
            // REcompensas são processadas pela sala-aventura, não aqui
            opcoes: [
                {
                    texto: "Acompanhar Lyra de volta à taverna",
                    proximo: "final_taverna",
                    recompensa: {
                        xp: 300,
                        pm: 3
                        // A sala-aventura processa isso e adiciona ao personagem do Firebase
                    }
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA FINAL: VOLTA À TAVERNA
        // ------------------------------------------------------
        final_taverna: {
            id: "final_taverna",
            nome: "Retorno Triunfal",
            imagem: "imagem/taverna-interior.jpg",
            
            fala: {
                npc: "Homem Ensanguentado",
                avatar: "imagem/npc-sangue.jpg",
                texto: "MINHA FILHA! Você conseguiu! Eu não tenho como pagar, mas serei eternamente grato!"
            },
            
            npcs: [
                {
                    id: "homem",
                    nome: "Pai de Lyra",
                    sprite: "imagem/npc-sangue.jpg",
                    x: 40,
                    y: 50
                },
                {
                    id: "lyra",
                    nome: "Lyra",
                    sprite: "imagem/menina-elfa.jpg",
                    x: 45,
                    y: 50
                },
                {
                    id: "taverneiro",
                    nome: "Taverneiro",
                    sprite: "imagem/taverneiro.jpg",
                    x: 60,
                    y: 50
                }
            ],
            
            opcoes: [
                {
                    texto: "Comemorar",
                    efeito: {
                        fadiga: 0
                    }
                },
                {
                    texto: "Encerrar aventura",
                    acao: "finalizar_aventura"
                }
            ]
        }
    }
};

// Exportação compatível com seu código
export { AVENTURA as default, AVENTURA };