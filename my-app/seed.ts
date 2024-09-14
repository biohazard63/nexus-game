import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const games = [
        // Jeux de rôle papier
        {
            name: 'Dungeons & Dragons 5e',
            type: 'Jeu de Rôle',
            description: 'Un classique du jeu de rôle où les joueurs incarnent des aventuriers dans un monde fantastique rempli de magie et de mystères.',
            player_max: 6,
            coverImage: 'https://example.com/dnd5e.jpg',
            categories: {
                connect: [{ id: 65 }] // Jeu de Rôle Fantastique
            }
        },
        {
            name: 'Shadowrun',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle cyberpunk où la magie et la technologie coexistent dans un futur dystopique.',
            player_max: 5,
            coverImage: 'https://example.com/shadowrun.jpg',
            categories: {
                connect: [{ id: 71 }] // Jeu de Rôle Cyberpunk
            }
        },
        {
            name: 'Call of Cthulhu',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle d\'horreur où les joueurs enquêtent sur des mystères surnaturels et affrontent des entités terrifiantes.',
            player_max: 5,
            coverImage: 'https://example.com/callofcthulhu.jpg',
            categories: {
                connect: [{ id: 67 }] // Jeu de Rôle d'Horreur
            }
        },
        {
            name: 'Pathfinder',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle dans un univers fantastique où les joueurs explorent des donjons, combattent des monstres et complètent des quêtes épiques.',
            player_max: 6,
            coverImage: 'https://example.com/pathfinder.jpg',
            categories: {
                connect: [{ id: 65 }] // Jeu de Rôle Fantastique
            }
        },
        {
            name: 'Vampire: The Masquerade',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle où les joueurs incarnent des vampires luttant pour survivre et naviguer dans la société secrète des non-morts.',
            player_max: 5,
            coverImage: 'https://example.com/vampirethemasquerade.jpg',
            categories: {
                connect: [{ id: 67 }] // Jeu de Rôle d'Horreur
            }
        },
        {
            name: 'Star Wars: Edge of the Empire',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle où les joueurs incarnent des contrebandiers, des chasseurs de primes et des explorateurs dans l\'univers de Star Wars.',
            player_max: 6,
            coverImage: 'https://example.com/starwarsedge.jpg',
            categories: {
                connect: [{ id: 66 }] // Jeu de Rôle de Science-Fiction
            }
        },
        {
            name: 'The One Ring',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle basé sur l\'univers de Tolkien, où les joueurs vivent des aventures dans la Terre du Milieu.',
            player_max: 6,
            coverImage: 'https://example.com/theonering.jpg',
            categories: {
                connect: [{ id: 65 }] // Jeu de Rôle Fantastique
            }
        },
        {
            name: 'Cyberpunk RED',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle se déroulant dans un futur où la cybernétique, les corporations et la technologie dominent le monde.',
            player_max: 5,
            coverImage: 'https://example.com/cyberpunkred.jpg',
            categories: {
                connect: [{ id: 71 }] // Jeu de Rôle Cyberpunk
            }
        },
        {
            name: 'Tales from the Loop',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle où les joueurs incarnent des enfants dans un univers alternatif des années 80, enquêtant sur des phénomènes étranges.',
            player_max: 5,
            coverImage: 'https://example.com/talesfromtheloop.jpg',
            categories: {
                connect: [{ id: 69 }] // Jeu de Rôle Post-Apocalyptique
            }
        },
        {
            name: 'Fate Core',
            type: 'Jeu de Rôle',
            description: 'Un jeu de rôle générique qui permet aux joueurs de créer et de vivre des histoires dans n\'importe quel cadre, du fantastique à la science-fiction.',
            player_max: 5,
            coverImage: 'https://example.com/fatecore.jpg',
            categories: {
                connect: [{ id: 65 }] // Jeu de Rôle Fantastique
            }
        }
    ];

    // Insertion des données
    for (const game of games) {
        await prisma.game.create({
            data: game,
        });
    }
}

main()
    .then(() => {
        console.log('Données insérées avec succès');
    })
    .catch((e) => {
        console.error('Erreur lors de l\'insertion des données :', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });