import { Prisma } from "@prisma/client";

// Définir un type qui inclut les relations de `Participation`
export const participationWithRelations = Prisma.validator<Prisma.ParticipationDefaultArgs>()({
    include: {
        user: true, // Inclure l'utilisateur dans la participation
    },
});

// Exporter le type généré avec les relations
export type ParticipationWithRelations = Prisma.ParticipationGetPayload<typeof participationWithRelations>;