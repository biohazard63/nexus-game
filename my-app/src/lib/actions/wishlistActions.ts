/**
 * @file wishlistActions.ts
 *
 * This file contains server-side functions for managing wishlists in the application.
 * It includes functions to retrieve, add, and remove games from the wishlist using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';
import { WishlistWithRelations } from "@/type/wishlistWithRelation";

/**
 * Fetches the user's wishlist with related data.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<WishlistWithRelations[]>} A promise that resolves to an array of wishlist items.
 * @throws Will throw an error if the wishlist cannot be retrieved.
 */
export async function getWishlist(userId: number): Promise<WishlistWithRelations[]> {
    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new Error('Utilisateur introuvable');

        return await prisma.wishlist.findMany({
            where: { userId },
            include: {
                game: true,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la wishlist :', error);
        throw new Error('Impossible de récupérer la wishlist.');
    }
}

/**
 * Adds a game to the user's wishlist.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} gameId - The ID of the game.
 * @returns {Promise<WishlistWithRelations>} A promise that resolves to the newly added wishlist item.
 * @throws Will throw an error if the game cannot be added to the wishlist.
 */
export async function addToWishlist(userId: number, gameId: number): Promise<WishlistWithRelations> {
    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        const gameExists = await prisma.game.findUnique({ where: { id: gameId } });
        if (!userExists) throw new Error('Utilisateur introuvable');
        if (!gameExists) throw new Error('Jeu introuvable');

        const existingWishlistItem = await prisma.wishlist.findFirst({
            where: {
                userId,
                gameId,
            },
        });

        if (existingWishlistItem) {
            throw new Error('Le jeu est déjà dans la wishlist.');
        }

        return await prisma.wishlist.create({
            data: {
                userId,
                gameId,
            },
            include: {
                game: true,
                user: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la wishlist :', error);
        throw new Error('Impossible d\'ajouter le jeu à la wishlist.');
    }
}

/**
 * Removes a game from the user's wishlist.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} gameId - The ID of the game.
 * @returns {Promise<WishlistWithRelations>} A promise that resolves to the removed wishlist item.
 * @throws Will throw an error if the game cannot be removed from the wishlist.
 */
export async function removeFromWishlist(userId: number, gameId: number): Promise<WishlistWithRelations> {
    try {
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

        return await prisma.wishlist.delete({
            where: {
                userId_gameId: {
                    userId,
                    gameId,
                },
            },
            include: {
                game: true,
                user: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la wishlist :', error);
        throw new Error('Impossible de supprimer le jeu de la wishlist.');
    }
}