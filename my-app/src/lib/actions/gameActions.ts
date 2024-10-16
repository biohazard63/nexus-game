/**
 * @file gameActions.ts
 *
 * This file contains server-side functions for managing games in the application.
 * It includes functions to retrieve, create, update, and delete games using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';
import { GameWithRelations } from "@/type/gameWithRelation";

/**
 * Fetches all games with their related categories.
 *
 * @returns {Promise<GameWithRelations[]>} A promise that resolves to an array of games with their relations.
 * @throws Will throw an error if the games cannot be retrieved.
 */
export async function getGames(): Promise<GameWithRelations[]> {
    try {
        return await prisma.game.findMany({
            orderBy: {
                createdAt: 'desc', // Order by creation date
            },
            include: {
                categories: {
                    include: {
                        category: true, // Include category details via the pivot table
                    },
                },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux :', error);
        throw new Error('Impossible de récupérer les jeux.');
    }
}

/**
 * Fetches a specific game by its ID with its related categories.
 *
 * @param {number} gameId - The ID of the game to retrieve.
 * @returns {Promise<GameWithRelations | null>} A promise that resolves to the game with its relations, or null if not found.
 * @throws Will throw an error if the game cannot be retrieved.
 */
export async function getGameById(gameId: number): Promise<GameWithRelations | null> {
    try {
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: {
                categories: {
                    include: {
                        category: true, // Include category details via the pivot table
                    },
                },
            },
        });

        if (!game) {
            throw new Error(`Le jeu avec l'ID ${gameId} n'existe pas.`);
        }

        return game;
    } catch (error) {
        console.error('Erreur lors de la récupération du jeu :', error);
        throw new Error('Impossible de récupérer le jeu.');
    }
}

/**
 * Creates a new game with categories.
 *
 * @param {Object} data - The data for the new game.
 * @param {string} data.name - The name of the game.
 * @param {string} data.type - The type of the game.
 * @param {string} data.description - The description of the game.
 * @param {string} [data.coverImage] - The cover image of the game.
 * @param {number} [data.player_max] - The maximum number of players for the game.
 * @param {number[]} [data.categoryIds] - The IDs of the categories to associate with the game.
 * @returns {Promise<GameWithRelations>} A promise that resolves to the newly created game with its relations.
 * @throws Will throw an error if the game cannot be created.
 */
export async function createGame(data: {
    name: string;
    type: string;
    description: string;
    coverImage?: string;
    player_max?: number;
    categoryIds?: number[];
}): Promise<GameWithRelations> {
    try {
        const newGame = await prisma.game.create({
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                coverImage: data.coverImage || null,
                player_max: data.player_max || null,
                categories: {
                    create: data.categoryIds?.map(categoryId => ({
                        category: { connect: { id: categoryId } },
                    })) || [],
                },
            },
            include: {
                categories: {
                    include: {
                        category: true, // Include category details via the pivot table
                    },
                },
            },
        });

        return newGame;
    } catch (error) {
        console.error('Erreur lors de la création du jeu :', error);
        throw new Error('Impossible de créer le jeu.');
    }
}

/**
 * Updates a game and its categories.
 *
 * @param {number} gameId - The ID of the game to update.
 * @param {Object} data - The new data for the game.
 * @param {string} [data.name] - The new name of the game.
 * @param {string} [data.type] - The new type of the game.
 * @param {string} [data.description] - The new description of the game.
 * @param {string} [data.coverImage] - The new cover image of the game.
 * @param {number} [data.player_max] - The new maximum number of players for the game.
 * @param {number[]} [data.categoryIds] - The new IDs of the categories to associate with the game.
 * @returns {Promise<GameWithRelations>} A promise that resolves to the updated game with its relations.
 * @throws Will throw an error if the game cannot be updated.
 */
export async function updateGame(
    gameId: number,
    data: {
        name?: string;
        type?: string;
        description?: string;
        coverImage?: string;
        player_max?: number;
        categoryIds?: number[];
    }
): Promise<GameWithRelations> {
    try {
        const validCategoryIds = data.categoryIds?.filter(id => id !== undefined) || [];

        const updatedGame = await prisma.game.update({
            where: { id: gameId },
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                coverImage: data.coverImage || null,
                player_max: data.player_max || null,
                categories: {
                    deleteMany: {}, // Delete old categories
                    create: validCategoryIds.map(categoryId => ({
                        category: { connect: { id: categoryId } },
                    })),
                },
            },
            include: {
                categories: {
                    include: {
                        category: true, // Include category details via the pivot table
                    },
                },
            },
        });

        return updatedGame;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du jeu :', error);
        throw new Error('Impossible de mettre à jour le jeu.');
    }
}

/**
 * Deletes a game.
 *
 * @param {number} gameId - The ID of the game to delete.
 * @returns {Promise<{ message: string }>} A promise that resolves to a message indicating successful deletion.
 * @throws Will throw an error if the game cannot be deleted.
 */
export async function deleteGame(gameId: number): Promise<{ message: string }> {
    try {
        await prisma.gameCategory.deleteMany({ where: { gameId } });

        await prisma.game.delete({
            where: { id: gameId },
        });

        return { message: `Jeu avec l'ID ${gameId} supprimé avec succès.` };
    } catch (error) {
        console.error('Erreur lors de la suppression du jeu avec relations :', error);
        throw new Error('Impossible de supprimer le jeu.');
    }
}