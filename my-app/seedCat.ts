import { PrismaClient } from '@prisma/client';
import { GameType} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        // Catégories pour les jeux vidéo
        { name: 'FPS', type: GameType.VIDEO_GAME },
        { name: 'RTS', type: GameType.VIDEO_GAME },
        { name: 'RPG', type: GameType.VIDEO_GAME },
        { name: 'Jeu d\'Aventure/Action', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Battle Royale', type: GameType.VIDEO_GAME },
        { name: 'Simulation de Vie', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Construction', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Combat', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Sport', type: GameType.VIDEO_GAME },
        { name: 'Jeu d\'Horreur', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Course', type: GameType.VIDEO_GAME },
        { name: 'MOBA', type: GameType.VIDEO_GAME},
        { name: 'Puzzle', type: GameType.VIDEO_GAME },
        { name: 'Hack and Slash', type: GameType.VIDEO_GAME },
        { name: 'MMORPG', type: GameType.VIDEO_GAME },
        { name: 'Survival', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Tir à la Première Personne', type: GameType.VIDEO_GAME },
        { name: 'Sandbox', type: GameType.VIDEO_GAME },
        { name: 'Tactical Shooter', type: GameType.VIDEO_GAME },
        { name: 'Jeu de Rythme', type: GameType.VIDEO_GAME },
        { name: 'Roguelike', type: GameType.VIDEO_GAME },

        // Catégories pour les jeux de société
        { name: 'Jeu de Stratégie', type: GameType.BOARD_GAME },
        { name: 'Jeu de Bluff', type: GameType.BOARD_GAME  },
        { name: 'Jeu Coopératif', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Placement de Travailleurs', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Construction de Deck', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Guerre de Territoire', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Déduction', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Rôle en Société', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Course', type: GameType.BOARD_GAME},
        { name: 'Jeu de Gestion de Ressources', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Mémorisation', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Conquête', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Marchand', type: GameType.BOARD_GAME  },
        { name: 'Jeu Familial', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Bluffer', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Négociation', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Coopération', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Puzzle', type: GameType.BOARD_GAME  },
        { name: 'Jeu de Trivia', type: GameType.BOARD_GAME  },


        // Catégories pour les jeux de rôle
        { name: 'Jeu de Rôle Dystopique', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle Fantastique', type: GameType.TABLETOP_RPG  },
        { name: 'Jeu de Rôle avec Enquête', type: GameType.TABLETOP_RPG  },
        { name: 'Jeu de Rôle avec Exploration', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle de Science-Fiction', type: GameType.TABLETOP_RPG  },
        { name: 'Jeu de Rôle Moderne', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle d\'Horreur', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle Post-Apocalyptique', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle Cyberpunk', type: GameType.TABLETOP_RPG  },
        { name: 'Jeu de Rôle Steampunk', type: GameType.TABLETOP_RPG  },
        { name: 'Jeu de Rôle Historiques', type: GameType.TABLETOP_RPG },
        { name: 'Jeu de Rôle Narratif', type: GameType.TABLETOP_RPG  },
    ];

    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true, // Ignorer les doublons
    });
}

main()
    .then(() => {
        console.log('Catégories insérées avec succès');
    })
    .catch((e) => {
        console.error('Erreur lors de l\'insertion des catégories :', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });