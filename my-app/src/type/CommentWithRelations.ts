import { Prisma } from "@prisma/client";

// Définir un type qui inclut les relations de `Comment`
export const commentWithRelations = Prisma.validator<Prisma.CommentDefaultArgs>()({
    include: {
        user: true, // Inclure l'utilisateur dans le commentaire
    },
});

// Exporter le type généré avec les relations
export type CommentWithRelations = Prisma.CommentGetPayload<typeof commentWithRelations>;