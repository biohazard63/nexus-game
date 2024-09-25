'use server';

import { prisma } from '@/server/db/db';
import { GameWithRelations } from "@/type/gameWithRelation";

// Récupérer tous les jeux avec leurs relations (catégories incluses)
export async function getGames(): Promise<GameWithRelations[]> {
    try {
        return await prisma.game.findMany({
            orderBy: {
                createdAt: 'desc', // Trier par date de création
            },
            include: {
                categories: {
                    include: {
                        category: true, // Inclure les détails de la catégorie via la table pivot
                    },
                },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux :', error);
        throw new Error('Impossible de récupérer les jeux.');
    }
}

// Récupérer un jeu spécifique par ID avec ses relations (catégories incluses)
export async function getGameById(gameId: number): Promise<GameWithRelations | null> {
    try {
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: {
                categories: {
                    include: {
                        category: true, // Inclure les détails de la catégorie via la table pivot
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

// Créer un nouveau jeu avec catégories
export async function createGame(data: {
    name: string;
    type: string;
    description: string;
    coverImage?: string;
    player_max?: number;
    categoryIds?: number[]; // Plusieurs catégories
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
                        category: true, // Inclure les détails de la catégorie via la table pivot
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

// Mettre à jour un jeu et ses catégories
export async function updateGame(
    gameId: number,
    data: {
        name?: string;
        type?: string;
        description?: string;
        coverImage?: string;
        player_max?: number;
        categoryIds?: number[]; // Mise à jour des catégories
    }
): Promise<GameWithRelations> {
    try {
        const updatedGame = await prisma.game.update({
            where: { id: gameId },
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                coverImage: data.coverImage || null,
                player_max: data.player_max || null,
                categories: {
                    deleteMany: {}, // Supprimer les anciennes catégories
                    create: data.categoryIds?.map(categoryId => ({
                        category: { connect: { id: categoryId } },
                    })) || [],
                },
            },
            include: {
                categories: {
                    include: {
                        category: true, // Inclure les détails de la catégorie via la table pivot
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

// Supprimer un jeu
export async function deleteGame(gameId: number): Promise<{ message: string }> {
    try {
        await prisma.game.delete({
            where: { id: gameId },
        });

        return { message: `Jeu avec l'ID ${gameId} supprimé avec succès.` };
    } catch (error) {
        console.error('Erreur lors de la suppression du jeu :', error);
        throw new Error('Impossible de supprimer le jeu.');
    }
}