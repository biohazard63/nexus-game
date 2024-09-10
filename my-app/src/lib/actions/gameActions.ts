'use server';
import { prisma } from '@/server/db/db';
import { GameWithRelations } from '@/type/gameWithRelation'; // Assurez-vous de fournir le bon chemin vers le type GameWithRelations

// Récupérer tous les jeux avec leurs relations
export async function getGames(): Promise<GameWithRelations[]> {
    try {
        const games = await prisma.game.findMany({
            orderBy: {
                createdAt: 'desc', // Trier par date de création, du plus récent au plus ancien
            },
            include: { category: true }, // Inclure la catégorie liée
        });
        return games;
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux :', error);
        throw new Error('Impossible de récupérer les jeux.');
    }
}

// Récupérer un jeu spécifique par ID avec ses relations
export async function getGameById(gameId: number): Promise<GameWithRelations | null> {
    try {
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: { category: true }, // Inclure la catégorie
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

// Créer un nouveau jeu
export async function createGame(data: {
    name: string;
    type: string;
    description: string;
    coverImage?: string;
    categoryId?: number;
}): Promise<GameWithRelations> {
    try {
        const newGame = await prisma.game.create({
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                coverImage: data.coverImage || null,
                categoryId: data.categoryId || null,
            },
            include: { category: true }, // Inclure la catégorie dans la réponse
        });

        return newGame;
    } catch (error) {
        console.error('Erreur lors de la création du jeu :', error);
        throw new Error('Impossible de créer le jeu.');
    }
}

// Mettre à jour un jeu
export async function updateGame(
    gameId: number,
    data: {
        name?: string;
        type?: string;
        description?: string;
        coverImage?: string;
        categoryId?: number;
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
                categoryId: data.categoryId || null,
            },
            include: { category: true }, // Inclure la catégorie dans la réponse
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