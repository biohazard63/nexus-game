import { Prisma } from "@prisma/client";

// Définir un type qui inclut toutes les relations de `User`
export const userWithRelations = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        api_key: true,
        groups: true,
        comments: true,
        rewards: true,
        statistics: true,
        invitationsSent: true,
        invitationsReceived: true,
        wishlists: true,
        userBadges: true,
        messagesSent: true,
        messagesReceived: true,
        hostedSessions: true,
        participations: true,
        characters: true,
        chat: true,
        ratingsReceived: {
            select: {
                rating: true,
                review: true,
                sender: {
                    select: {
                        username: true,
                    },
                },
            },
        },
    },
});

export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelations>;