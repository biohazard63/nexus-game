import { Prisma } from "@prisma/client";


export const categoryWithRelations = Prisma.validator<Prisma.CategoryDefaultArgs>()({
    include: {
        games: true,
    },
});

export type CategoryWithRelations = Prisma.CategoryGetPayload<typeof categoryWithRelations>;