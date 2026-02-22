// aventuras/masmorra-goblin.js
// Aventura: A Menina Elfa Raptada

export const AVENTURA = {
    nome: "A Menina Elfa Raptada",
    descricao: "Uma aventura clássica começando em uma taverna.",
    cenaInicial: "exterior_taverna",
    
    config: {
        moedas_iniciais: 50,
        fadiga_por_hora: 1,
        xp_final: 300,
        pm_final: 3
    },
    
    // ===== TODAS AS CENAS DA AVENTURA =====
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
                avatar: "imagem/narrador.png", // Se tiver
                texto: "Você chega a uma taverna aconchegante. O letreiro range com o vento: 'A Javali Sangrento'. Risadas e música saem pelas frestas da porta."
            },
            
            npcs: [], // Sem NPCs aqui
            
            opcoes: [
                {
                    texto: "Entrar na taverna",
                    proximo: "interior_taverna"
                },
                {
                    texto: "Dar a volta e seguir viagem",
                    proximo: "estrada_norte",
                    log: "Você decide ignorar a taverna e seguir seu caminho..."
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
                    
                    atributos: {
                        iq: 10,
                        vontade: 10
                    },
                    
                    opcoes: [
                        {
                            texto: "Comprar cerveja (2 moedas)",
                            tipo: "pagar",
                            valor: 2,
                            sucesso: "Saúde! Uma boa cerveja sempre anima.",
                            falha: "Você não tem dinheiro? Que pena...",
                            efeito_sucesso: {
                                fadiga: -1, // Recupera 1 de fadiga
                                log: "🍺 A cerveja gelada revitaliza você."
                            }
                        },
                        {
                            texto: "Recusar educadamente",
                            resposta: "Como quiser. Se precisar de algo, é só chamar."
                        },
                        {
                            texto: "Perguntar sobre novidades",
                            tipo: "informacao",
                            resposta: "Bem, ouvi dizer que tem havido ataques de goblins na estrada norte. Mas é só boato..."
                        }
                    ]
                }
            ],
            
            opcoes: [
                {
                    texto: "Observar o ambiente",
                    acao: "observar",
                    log: "Você olha ao redor... parece tudo normal.",
                    proximo: "interior_taverna" // Fica na mesma cena
                },
                {
                    texto: "Sair da taverna",
                    proximo: "exterior_taverna"
                }
            ],
            
            // Evento que pode acontecer ao entrar na taverna
            eventos: [
                {
                    trigger: "ao_entrar",
                    delay: 2000, // 2 segundos depois
                    acao: "homem_ensanguentado_entra"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 2B: HOMEM ENSANGUENTADO (evento especial)
        // ------------------------------------------------------
        homem_ensanguentado: {
            id: "homem_ensanguentado",
            nome: "Comocionante na Taverna",
            imagem: "imagem/taverna-interior.jpg", // Mesma imagem de fundo
            
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
                    y: 60,
                },
                {
                    id: "homem_sangue",
                    nome: "Homem Ferido",
                    sprite: "imagem/npc-sangue.jpg",
                    x: 70,
                    y: 40,
                }
            ],
            
            opcoes: [
                {
                    texto: "Oferecer ajuda (missão)",
                    tipo: "missao",
                    resposta: "Deus te abençoe, nobre aventureiro! Minha filha se chama Lyra. Por favor, traga ela de volta!",
                    log: "⚔️ Missão aceita: Resgatar a menina elfa",
                    proximo: "exterior_taverna",
                    efeito: {
                        missao: "resgatar_elfa",
                        status: "aceita"
                    }
                },
                {
                    texto: "Ignorar e seguir sua vida",
                    resposta: "Seu coração gelado... que os deuses tenham piedade de você.",
                    proximo: "exterior_taverna",
                    log: "Você vira as costas para quem precisa de ajuda..."
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
                    
                    atributos: {
                        iq: 9,
                        vontade: 8
                    },
                    
                    // Verifica se personagem tem vantagem Luxúria
                    opcoes_dinamicas: [
                        {
                            condicao: "vantagem_luxuria",
                            opcoes: [
                                {
                                    texto: "Tentar flertar (teste de persuasão)",
                                    tipo: "teste",
                                    atributo: "iq", // Persuasão baseada em IQ
                                    dificuldade: 10,
                                    sucesso: "Olha, você até que é bonitinho... que tal conversarmos mais tarde? (ela sorri)",
                                    falha: "Passar bem, seu atrevido!",
                                    recompensa_sucesso: {
                                        log: "💕 Você fez uma nova amizade... ou algo mais?"
                                    }
                                }
                            ]
                        },
                        {
                            condicao: "sempre", // Opção padrão
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
            
            npcs: [], // Sem NPCs, só vestígios
            
            // Testes especiais baseados em vantagens
            testes_especiais: [
                {
                    nome: "Rastrear os goblins",
                    vantagem_necessaria: "rastreamento",
                    atributo: "iq",
                    dificuldade: 12,
                    sucesso: {
                        texto: "Seu treinamento em rastreamento permite seguir as pegadas facilmente.",
                        log: "🔍 Você encontra o caminho dos goblins sem dificuldade.",
                        proximo: "clareira_goblins"
                    },
                    falha: {
                        texto: "As pegadas se confundem, você perde tempo tentando encontrar o caminho.",
                        log: "😓 Você demora a encontrar o rastro... perdeu 2 de fadiga.",
                        efeito: {
                            fadiga: -2
                        },
                        proximo: "clareira_goblins"
                    }
                }
            ],
            
            opcoes: [
                {
                    texto: "Tentar rastrear os goblins",
                    acao: "teste_especial",
                    teste: "Rastrear os goblins"
                },
                {
                    texto: "Seguir pela estrada",
                    log: "Você ignora a carroça e segue em frente.",
                    proximo: "clareira_goblins",
                    efeito: {
                        fadiga: -2 // Perde tempo mesmo
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
            
            // Inimigos na cena
            inimigos: [
                {
                    id: "goblin1",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    tipo: "normal",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    bloqueio: 0,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                },
                {
                    id: "goblin2",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    tipo: "normal",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    bloqueio: 0,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                },
                {
                    id: "goblin_arqueiro1",
                    nome: "Goblin Arqueiro",
                    sprite: "imagem/goblin-arqueiro.jpg",
                    tipo: "arqueiro",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    bloqueio: 0,
                    nh_ataque: 8,
                    dano: "2d-3",
                    xp: 35
                },
                {
                    id: "goblin_arqueiro2",
                    nome: "Goblin Arqueiro",
                    sprite: "imagem/goblin-arqueiro.jpg",
                    tipo: "arqueiro",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    bloqueio: 0,
                    nh_ataque: 8,
                    dano: "2d-3",
                    xp: 35
                },
                {
                    id: "goblin_guerreiro",
                    nome: "Goblin Guerreiro",
                    sprite: "imagem/goblin-guerreiro.jpg",
                    tipo: "guerreiro",
                    pv: 64,
                    pv_max: 64,
                    esquiva: 8,
                    aparar: 8,
                    bloqueio: 0,
                    nh_ataque: 9,
                    dano: "1d+2",
                    xp: 50
                }
            ],
            
            opcoes: [
                {
                    texto: "Tentar furtividade (observar esconderijo)",
                    tipo: "teste",
                    atributo: "dx", // Furtividade baseada em DX
                    dificuldade: 12,
                    sucesso: {
                        texto: "Você se esconde perfeitamente e observa os goblins. Um deles aponta para uma direção: 'Caverna do chefe é por ali, naquela pedra grande'.",
                        log: "👀 Você descobriu a entrada da caverna!",
                        proximo: "entrada_caverna",
                        info: "entrada_caverna_revelada"
                    },
                    falha: {
                        texto: "Você pisa em um galho seco! Os goblins se viram e te veem!",
                        log: "⚠️ Você foi descoberto! Os goblins atacam!",
                        acao: "iniciar_combate",
                        inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"],
                        iniciativa: "inimigos" // Inimigos atacam primeiro
                    }
                },
                {
                    texto: "Atacar os goblins de frente",
                    log: "Com um grito de guerra, você parte para o ataque!",
                    acao: "iniciar_combate",
                    inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"],
                    iniciativa: "jogador" // Jogador ataca primeiro
                },
                {
                    texto: "Voltar e procurar outro caminho",
                    proximo: "carroca_destruida",
                    log: "Melhor não arriscar..."
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
            
            npcs: [
                {
                    id: "goblin_escondido1",
                    nome: "Goblin (escondido)",
                    sprite: "imagem/goblin.jpg",
                    x: 30,
                    y: 70,
                    visivel: false, // Só aparece se passar percepção
                    escondido: true,
                    pv: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2"
                },
                {
                    id: "goblin_escondido2",
                    nome: "Goblin (escondido)",
                    sprite: "imagem/goblin.jpg",
                    x: 70,
                    y: 70,
                    visivel: false,
                    escondido: true,
                    pv: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2"
                }
            ],
            
            // Teste de percepção automático ao entrar
            ao_entrar: {
                tipo: "teste_automatico",
                atributo: "iq", // Percepção baseada em IQ
                dificuldade: 10,
                sucesso: {
                    texto: "Sua percepção aguçada nota dois goblins escondidos nas sombras da entrada!",
                    log: "👀 Você viu os guardas escondidos!",
                    revela_npcs: ["goblin_escondido1", "goblin_escondido2"],
                    opcoes_adicionais: [
                        {
                            texto: "Tentar passar furtivamente",
                            tipo: "teste",
                            atributo: "dx",
                            dificuldade: 13,
                            sucesso: {
                                texto: "Você passa como uma sombra. Os goblins nem percebem.",
                                log: "🤫 Passou despercebido!",
                                proximo: "corredor_caverna"
                            },
                            falha: {
                                texto: "Você esbarra em uma pedra! Os goblins te veem!",
                                log: "⚔️ Foi descoberto! Combate iniciado!",
                                acao: "iniciar_combate",
                                inimigos: ["goblin_escondido1", "goblin_escondido2"],
                                iniciativa: "inimigos"
                            }
                        },
                        {
                            texto: "Atacar os goblins agora",
                            acao: "iniciar_combate",
                            inimigos: ["goblin_escondido1", "goblin_escondido2"],
                            iniciativa: "jogador"
                        }
                    ]
                },
                falha: {
                    texto: "Você não percebe nada de errado e entra na caverna.",
                    log: "Os goblins escondidos veem você entrar...",
                    efeito: {
                        emboscada: true,
                        inimigos: ["goblin_escondido1", "goblin_escondido2"],
                        iniciativa: "inimigos" // Será emboscado
                    }
                }
            },
            
            opcoes_padrao: [
                {
                    texto: "Entrar na caverna",
                    proximo: "corredor_caverna"
                },
                {
                    texto: "Sair e pensar melhor",
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
            
            npcs: [
                {
                    id: "goblins_conversando",
                    nome: "Goblins (conversando)",
                    sprite: "imagem/goblin.jpg", // Representação genérica
                    x: 50,
                    y: 40,
                    interagivel: false // Não pode interagir diretamente
                }
            ],
            
            // Ao entrar no corredor
            ao_entrar: {
                tipo: "teste_automatico",
                atributo: "dx", // Furtividade
                dificuldade: 12,
                sucesso: {
                    texto: "Você se esconde nas sombras e passa despercebido pelos goblins que conversam.",
                    log: "🤫 Passou pelos goblins sem ser visto!",
                    proximo: "camara_chefe"
                },
                falha: {
                    texto: "Você tenta passar, mas um dos goblins te vê! 'INTRUSO!'",
                    log: "⚠️ Os goblins te alertaram!",
                    opcoes: [
                        {
                            texto: "Lutar contra os goblins",
                            acao: "iniciar_combate",
                            inimigos: ["goblin_reforco1", "goblin_reforco2", "goblin_reforco3"],
                            iniciativa: "inimigos"
                        },
                        {
                            texto: "Fugir de volta para a entrada",
                            log: "Você corre de volta!",
                            proximo: "entrada_caverna",
                            efeito: {
                                fadiga: -1
                            }
                        }
                    ]
                }
            }
        },
        
        // ------------------------------------------------------
        // CENA 8: CÂMARA DO CHEFE
        // ------------------------------------------------------
        camara_chefe: {
            id: "camara_chefe",
            nome: "Câmara do Chefe Goblin",
            imagem: "imagem/menina-elfa.jpg", // Cenário com a menina na jaula
            
            fala: {
                npc: "Narrador",
                texto: "Você entra em uma câmara maior. No centro, uma jaula de madeira prende uma menina elfa de cabelos prateados. Ela parece assustada, mas viva."
            },
            
            npcs: [
                {
                    id: "menina_elfa",
                    nome: "Lyra",
                    sprite: "imagem/menina-elfa.jpg",
                    avatar: "imagem/menina-elfa.jpg",
                    x: 50,
                    y: 60,
                    dialogo: "Por favor, me ajude! O chefe goblin é terrível!",
                    interagivel: true
                },
                {
                    id: "chefe_goblin",
                    nome: "Chefe Goblin",
                    sprite: "imagem/chefe-goblin.jpg",
                    x: 70,
                    y: 30,
                    pv: 85, // Valor maior que os outros
                    pv_max: 85,
                    esquiva: 8,
                    aparar: 9,
                    bloqueio: 0,
                    nh_ataque: 10,
                    dano: "2d+2",
                    xp: 100
                },
                {
                    id: "goblin_guarda1",
                    nome: "Goblin Guarda",
                    sprite: "imagem/goblin-guerreiro.jpg",
                    x: 30,
                    y: 40,
                    pv: 64,
                    pv_max: 64,
                    esquiva: 8,
                    aparar: 8,
                    nh_ataque: 9,
                    dano: "1d+2",
                    xp: 50
                },
                {
                    id: "goblin_guarda2",
                    nome: "Goblin Guarda",
                    sprite: "imagem/goblin-guerreiro.jpg",
                    x: 40,
                    y: 30,
                    pv: 64,
                    pv_max: 64,
                    esquiva: 8,
                    aparar: 8,
                    nh_ataque: 9,
                    dano: "1d+2",
                    xp: 50
                }
            ],
            
            // Diálogo automático ao entrar
            ao_entrar: {
                fala_chefe: {
                    npc: "Chefe Goblin",
                    avatar: "imagem/chefe-goblin.jpg",
                    texto: "Humano? HAHAHA! Veio buscar a elfa? Vai ter que passar por MIM!"
                },
                fala_menina: {
                    npc: "Lyra",
                    avatar: "imagem/menina-elfa.jpg",
                    texto: "Cuidado! Ele é muito forte!"
                }
            },
            
            opcoes: [
                {
                    texto: "Atacar o chefe!",
                    log: "Você saca sua arma para o confronto final!",
                    acao: "iniciar_combate",
                    inimigos: ["chefe_goblin", "goblin_guarda1", "goblin_guarda2"],
                    iniciativa: "jogador",
                    ao_vencer: "final_vitoria"
                },
                {
                    texto: "Tentar negociar com o chefe",
                    tipo: "teste",
                    atributo: "iq",
                    dificuldade: 15, // Muito difícil
                    sucesso: {
                        texto: "O chefe ri: 'HAHA! Humano engraçado! Pode levar a elfa... em troca do seu equipamento mais valioso!'",
                        opcoes: [
                            {
                                texto: "Aceitar troca",
                                tipo: "trocar_item",
                                log: "Você entrega seu item mais valioso e liberta a menina.",
                                proximo: "final_negociacao"
                            },
                            {
                                texto: "Recusar e lutar",
                                acao: "iniciar_combate",
                                inimigos: ["chefe_goblin", "goblin_guarda1", "goblin_guarda2"]
                            }
                        ]
                    },
                    falha: {
                        texto: "'NEGOCIAR NÃO! MATAR HUMANO!'",
                        log: "O chefe se irrita e parte para o ataque!",
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
            
            ao_entrar: {
                recompensa: {
                    xp: 300,
                    pm: 3,
                    item: {
                        nome: "Artefato de Osso",
                        descricao: "Um amuleto feito de ossos de goblin que pulsa com energia mágica.",
                        tipo: "amuleto",
                        efeito: "mana_extra",
                        valor: 2, // +2 de mana
                        peso: 0.1
                    },
                    log: "🎉 MISSÃO COMPLETA! +300 XP, +3 PM e Artefato de Osso (+2 Mana)!"
                }
            },
            
            opcoes: [
                {
                    texto: "Acompanhar Lyra de volta à taverna",
                    proximo: "final_taverna"
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
            
            fala_taverneiro: {
                npc: "Taverneiro",
                texto: "A primeira cerveja é por minha conta! Herói!"
            },
            
            opcoes: [
                {
                    texto: "Comemorar com uma cerveja",
                    log: "🍺 Você celebra sua vitória!",
                    efeito: {
                        fadiga: 0 // Recupera toda fadiga
                    }
                },
                {
                    texto: "Descansar e encerrar a aventura",
                    acao: "finalizar_aventura",
                    log: "Sua lenda começa a se espalhar pela região..."
                }
            ]
        }
    },
    
    // ===== FUNÇÕES AUXILIARES DA AVENTURA =====
    funcoes: {
        // Verifica se personagem tem vantagem específica
        verificarVantagem: (personagem, vantagem) => {
            return personagem.vantagens && personagem.vantagens.includes(vantagem);
        },
        
        // Calcula fadiga baseado em tempo
        calcularFadiga: (horas) => {
            return horas; // 1 ponto por hora
        },
        
        // Processa recompensa final
        recompensaFinal: (personagem) => {
            personagem.xp = (personagem.xp || 0) + 300;
            personagem.pmDisponivel = (personagem.pmDisponivel || 30) + 3;
            
            // Adiciona artefato ao inventário
            if (!personagem.inventario) personagem.inventario = { mochila: [] };
            if (!personagem.inventario.mochila) personagem.inventario.mochila = [];
            
            personagem.inventario.mochila.push({
                id: "artefato_osso_" + Date.now(),
                nome: "Artefato de Osso",
                descricao: "Um amuleto feito de ossos de goblin que pulsa com energia mágica.",
                tipo: "amuleto",
                efeito: "mana_extra",
                valor: 2,
                peso: 0.1,
                quantidade: 1
            });
            
            return personagem;
        }
    }
};

export default AVENTURA;