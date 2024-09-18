

import { Prisma } from '@prisma/client';

// Définir un type qui inclut toutes les relations de `Session`
export const sessionWithRelations = Prisma.validator<Prisma.SessionDefaultArgs>()({
    include: {
        participations: true,
        comments: true,
        characters: true,
        statistics: true,
        invitations: true,
        specialEvents: true,
        game: true, // Inclure la relation avec le modèle `Game`
        host: true, // Inclure la relation avec le modèle `User` pour l'hôte
    },
});

// Exporter le type généré avec toutes les relations
export type SessionWithRelations = Prisma.SessionGetPayload<typeof sessionWithRelations>;