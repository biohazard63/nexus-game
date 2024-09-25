import { Prisma } from "@prisma/client";

// Définir un type qui inclut les relations de `Game`, y compris les catégories via la table pivot
export const gameWithRelations = Prisma.validator<Prisma.GameDefaultArgs>()({
    select: {
        id: true,
        name: true,
        type: true,
        description: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        player_max: true,
        categories: {
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        type: true, // Si vous souhaitez inclure le type de la catégorie également
                    },
                },
            },
        },
    },
});

// Type pour un jeu avec ses relations (catégories incluses)
export type GameWithRelations = Prisma.GameGetPayload<typeof gameWithRelations>;