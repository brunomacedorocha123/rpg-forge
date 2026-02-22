// aventuras/masmorra_goblins.js
// Aventura: A Menina Elfa Raptada

const AVENTURA = {
    nome: "A Menina Elfa Raptada",
    descricao: "Uma aventura clássica começando em uma taverna.",
    cenaInicial: "exterior_taverna",
    
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
                avatar: "imagem/narrador.png",
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
                            falha: "Você não tem dinheiro? Que pena..."
                        },
                        {
                            texto: "Recusar educadamente",
                            resposta: "Como quiser. Se precisar de algo, é só chamar."
                        },
                        {
                            texto: "Perguntar sobre novidades",
                            resposta: "Bem, ouvi dizer que tem havido ataques de goblins na estrada norte."
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
            ]
        },
        
        // ------------------------------------------------------
        // CENA 2B: HOMEM ENSANGUENTADO
        // ------------------------------------------------------
        homem_ensanguentado: {
            id: "homem_ensanguentado",
            nome: "Comoção na Taverna",
            imagem: "imagem/taverna-interior.jpg",
            
            fala: {
                npc: "Homem Ensanguentado",
                avatar: "imagem/npc-sangue.jpg",
                texto: "Socorro! Por favor, alguém me ajude! Eu vinha pela estrada norte quando fomos atacados por goblins! Eles raptaram minha filha! Uma menina elfa... ela só tem 10 anos!"
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
                    texto: "Oferecer ajuda",
                    tipo: "missao",
                    resposta: "Deus te abençoe! Minha filha se chama Lyra. Por favor, traga ela de volta!",
                    log: "⚔️ Missão aceita: Resgatar a menina elfa",
                    proximo: "exterior_taverna"
                },
                {
                    texto: "Ignorar",
                    resposta: "Seu coração gelado... que os deuses tenham piedade de você.",
                    proximo: "exterior_taverna"
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
                            resposta: "A estrada é segura até a floresta, mas dizem que tem goblins mais adiante."
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
                texto: "Você encontra uma carroça destruída na estrada. Manchas de sangue se espalham pela madeira."
            },
            
            npcs: [],
            
            opcoes: [
                {
                    texto: "Seguir pela estrada",
                    proximo: "clareira_goblins"
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
                texto: "Você encontra uma clareira onde vários goblins estão acampados."
            },
            
            inimigos: [
                {
                    id: "goblin1",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                },
                {
                    id: "goblin2",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    nh_ataque: 8,
                    dano: "1d-2",
                    xp: 25
                },
                {
                    id: "goblin_arqueiro1",
                    nome: "Goblin Arqueiro",
                    sprite: "imagem/goblin-arqueiro.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    nh_ataque: 8,
                    dano: "2d-3",
                    xp: 35
                },
                {
                    id: "goblin_arqueiro2",
                    nome: "Goblin Arqueiro",
                    sprite: "imagem/goblin-arqueiro.jpg",
                    pv: 58,
                    pv_max: 58,
                    esquiva: 7,
                    aparar: 0,
                    nh_ataque: 8,
                    dano: "2d-3",
                    xp: 35
                },
                {
                    id: "goblin_guerreiro",
                    nome: "Goblin Guerreiro",
                    sprite: "imagem/goblin-guerreiro.jpg",
                    pv: 64,
                    pv_max: 64,
                    esquiva: 8,
                    aparar: 8,
                    nh_ataque: 9,
                    dano: "1d+2",
                    xp: 50
                }
            ],
            
            opcoes: [
                {
                    texto: "Atacar os goblins",
                    acao: "iniciar_combate",
                    inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"]
                },
                {
                    texto: "Tentar furtividade",
                    tipo: "teste",
                    atributo: "dx",
                    dificuldade: 12,
                    sucesso: {
                        texto: "Você observa os goblins e vê a entrada da caverna.",
                        proximo: "entrada_caverna"
                    },
                    falha: {
                        texto: "Você foi descoberto! Os goblins atacam!",
                        acao: "iniciar_combate",
                        inimigos: ["goblin1", "goblin2", "goblin_arqueiro1", "goblin_arqueiro2", "goblin_guerreiro"]
                    }
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
                texto: "Uma abertura escura na rocha. Você sente um cheiro úmido."
            },
            
            npcs: [
                {
                    id: "goblin_escondido1",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    x: 30,
                    y: 70,
                    pv: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2"
                },
                {
                    id: "goblin_escondido2",
                    nome: "Goblin",
                    sprite: "imagem/goblin.jpg",
                    x: 70,
                    y: 70,
                    pv: 58,
                    esquiva: 7,
                    nh_ataque: 8,
                    dano: "1d-2"
                }
            ],
            
            opcoes: [
                {
                    texto: "Entrar na caverna",
                    proximo: "corredor_caverna"
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
                texto: "O corredor se estende à frente. Ecoam vozes de goblins."
            },
            
            opcoes: [
                {
                    texto: "Avançar pelo corredor",
                    proximo: "camara_chefe"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA 8: CÂMARA DO CHEFE
        // ------------------------------------------------------
        camara_chefe: {
            id: "camara_chefe",
            nome: "Câmara do Chefe",
            imagem: "imagem/menina-elfa.jpg",
            
            fala: {
                npc: "Narrador",
                texto: "Uma câmara maior. Numa jaula, uma menina elfa de cabelos prateados."
            },
            
            npcs: [
                {
                    id: "menina_elfa",
                    nome: "Lyra",
                    sprite: "imagem/menina-elfa.jpg",
                    x: 50,
                    y: 60,
                    dialogo: "Por favor, me ajude!"
                },
                {
                    id: "chefe_goblin",
                    nome: "Chefe Goblin",
                    sprite: "imagem/chefe-goblin.jpg",
                    x: 70,
                    y: 30,
                    pv: 85,
                    pv_max: 85,
                    esquiva: 8,
                    aparar: 9,
                    nh_ataque: 10,
                    dano: "2d+2",
                    xp: 100
                },
                {
                    id: "goblin_guarda1",
                    nome: "Goblin",
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
                    nome: "Goblin",
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
            
            opcoes: [
                {
                    texto: "Atacar o chefe!",
                    acao: "iniciar_combate",
                    inimigos: ["chefe_goblin", "goblin_guarda1", "goblin_guarda2"],
                    ao_vencer: "final_vitoria"
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
                texto: "Você me salvou! Muito obrigada!"
            },
            
            ao_entrar: {
                recompensa: {
                    xp: 300,
                    pm: 3,
                    item: {
                        id: "artefato_osso",
                        nome: "Artefato de Osso",
                        descricao: "Um amuleto que pulsa com energia mágica.",
                        tipo: "amuleto",
                        efeito: "mana_extra",
                        valor: 2,
                        peso: 0.1
                    }
                }
            },
            
            opcoes: [
                {
                    texto: "Voltar à taverna",
                    proximo: "final_taverna"
                }
            ]
        },
        
        // ------------------------------------------------------
        // CENA FINAL: TAVERNA
        // ------------------------------------------------------
        final_taverna: {
            id: "final_taverna",
            nome: "Retorno Triunfal",
            imagem: "imagem/taverna-interior.jpg",
            
            fala: {
                npc: "Homem",
                avatar: "imagem/npc-sangue.jpg",
                texto: "MINHA FILHA! Você conseguiu! Muito obrigado!"
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
                }
            ],
            
            opcoes: [
                {
                    texto: "Encerrar aventura",
                    acao: "finalizar_aventura",
                    log: "🏆 Aventura concluída com sucesso!"
                },
                {
                    texto: "Ficar mais um pouco",
                    proximo: "final_taverna",
                    log: "Você aproveita a comemoração..."
                }
            ]
        }
    }
};

// EXPORTAÇÃO CORRETA - APENAS UMA VEZ!
window.AVENTURA = AVENTURA;

// Se quiser usar como módulo também (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AVENTURA;
}