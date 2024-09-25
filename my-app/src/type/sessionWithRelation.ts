import { Prisma } from '@prisma/client';

// Définir le type qui inclut toutes les relations de `Session`
export const sessionWithRelations = Prisma.validator<Prisma.SessionDefaultArgs>()({
    include: {
        host: true,
        participations: {
            include: {
                user: true, // Inclure l'utilisateur dans les participations
            },
        },
        comments: {
            include: {
                user: true, // Inclure l'utilisateur dans les commentaires
            },
        },
        characters: true,
        statistics: true,
        invitations: true,
        specialEvents: true,
        game: {
            include: {
                categories: {
                    include: {
                        category: true, // Inclure les catégories de jeux
                    },
                },
            },
        },
    },
});

// Exporter le type généré avec les relations
export type SessionWithRelations = Prisma.SessionGetPayload<typeof sessionWithRelations>;