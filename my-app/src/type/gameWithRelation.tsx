import { Prisma } from "@prisma/client";

// Définir un type qui inclut les relations de `Game`
export const gameWithRelations = Prisma.validator<Prisma.GameDefaultArgs>()({
    include: {
        category: true, // Inclure la catégorie liée
    },
});

// Type pour un jeu avec ses relations
export type GameWithRelations = Prisma.GameGetPayload<typeof gameWithRelations>;