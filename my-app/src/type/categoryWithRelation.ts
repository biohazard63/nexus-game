import { Prisma } from "@prisma/client";


// Définir un type qui inclut toutes les relations de `Category`
export const categoryWithRelations = Prisma.validator<Prisma.CategoryDefaultArgs>()({
    include: {
        games: true,
    },
});

export type CategoryWithRelations = Prisma.CategoryGetPayload<typeof categoryWithRelations>;