'use server';

import { prisma } from '@/server/db/db';
import {WishlistWithRelations} from "@/type/wishlistWithRelation"; // Importer Prisma Client

// Obtenir la wishlist de l'utilisateur avec les relations
export async function getWishlist(userId: number): Promise<WishlistWithRelations[]> {
    try {
        // Vérifier si l'utilisateur existe
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new Error('Utilisateur introuvable');

        return await prisma.wishlist.findMany({
            where: { userId }, // Filtrer par utilisateur
            include: {
                game: true, // Inclure les détails du jeu
                user: true, // Inclure les détails de l'utilisateur
            },
            orderBy: {
                createdAt: 'desc', // Trier par date d'ajout
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la wishlist :', error);
        throw new Error('Impossible de récupérer la wishlist.');
    }
}

// Ajouter un jeu à la wishlist
export async function addToWishlist(userId: number, gameId: number): Promise<WishlistWithRelations> {
    try {
        // Vérifier si l'utilisateur et le jeu existent
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        const gameExists = await prisma.game.findUnique({ where: { id: gameId } });
        if (!userExists) throw new Error('Utilisateur introuvable');
        if (!gameExists) throw new Error('Jeu introuvable');

        // Vérifier si le jeu est déjà dans la wishlist
        const existingWishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_gameId: {
                    userId,
                    gameId,
                },
            },
        });

        if (existingWishlistItem) {
            throw new Error('Le jeu est déjà dans la wishlist.');
        }

        // Ajouter le jeu à la wishlist
        return await prisma.wishlist.create({
            data: {
                userId,
                gameId,
            },
            include: {
                game: true, // Inclure les détails du jeu ajouté
                user: true, // Inclure les détails de l'utilisateur
            },
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la wishlist :', error);
        throw new Error('Impossible d\'ajouter le jeu à la wishlist.');
    }
}

// Supprimer un jeu de la wishlist
export async function removeFromWishlist(userId: number, gameId: number): Promise<WishlistWithRelations> {
    try {
        // Vérifier si l'utilisateur et le jeu existent dans la wishlist
        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_gameId: {
                    userId,
                    gameId,
                },
            },
        });

        if (!wishlistItem) {
            throw new Error('Le jeu n\'est pas dans la wishlist.');
        }

        // Supprimer le jeu de la wishlist
        return await prisma.wishlist.delete({
            where: {
                userId_gameId: {
                    userId,
                    gameId,
                },
            },
            include: {
                game: true, // Inclure les détails du jeu supprimé
                user: true, // Inclure les détails de l'utilisateur
            },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la wishlist :', error);
        throw new Error('Impossible de supprimer le jeu de la wishlist.');
    }
}