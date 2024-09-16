import { Prisma } from '@prisma/client';

// Définir un type qui inclut toutes les relations de `Wishlist`
export const wishlistWithRelations = Prisma.validator<Prisma.WishlistDefaultArgs>()({
    include: {
        user: true, // Inclure la relation avec l'utilisateur
        game: true, // Inclure la relation avec le jeu
    },
});

// Utiliser Prisma pour générer le type `WishlistWithRelations`
export type WishlistWithRelations = Prisma.WishlistGetPayload<typeof wishlistWithRelations>;