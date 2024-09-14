import { Prisma } from "@prisma/client";

// Définir un type qui inclut les relations de `Game`
export const gameWithRelations = Prisma.validator<Prisma.GameDefaultArgs>()({
    select: {
        id: true,
        name: true,
        type: true,
        description: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        // maxPlayer: true, // Ensure this field exists in the Prisma schema
        category: {
            select: {
                id: true,
                name: true,
            },
        },
    },
});

// Type pour un jeu avec ses relations
export type GameWithRelations = Prisma.GameGetPayload<typeof gameWithRelations>;