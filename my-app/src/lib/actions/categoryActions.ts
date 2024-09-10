'use server';

import { prisma } from '@/server/db/db';
import { CategoryWithRelations, categoryWithRelations } from '@/type/categoryWithRelation';

// Fonction pour récupérer toutes les catégories avec leurs relations (jeux associés)
export async function getCategories(): Promise<CategoryWithRelations[]> {
    try {
        const categories = await prisma.category.findMany(categoryWithRelations);
        return categories;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        throw new Error('Impossible de récupérer les catégories.');
    }
}

// Fonction pour récupérer une catégorie par ID avec ses relations (jeux associés)
export async function getCategoryById(categoryId: number) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { games: true }, // Inclure les jeux dans la requête
        });

        if (!category) {
            throw new Error(`La catégorie avec l'ID ${categoryId} n'existe pas.`);
        }

        return category;
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie :', error);
        throw new Error('Impossible de récupérer la catégorie.');
    }
}

// Fonction pour créer une nouvelle catégorie
export async function createCategory(data: { name: string; type: 'VIDEO_GAME' | 'BOARD_GAME' | 'ROLE_PLAYING' }) {
    try {
        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                type: data.type,
            },
        });

        return newCategory;
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie :', error);
        throw new Error('Impossible de créer la catégorie.');
    }
}

// Fonction pour mettre à jour une catégorie
export async function updateCategory(categoryId: number, data: { name?: string; type?: 'VIDEO_GAME' | 'BOARD_GAME' | 'ROLE_PLAYING' }) {
    try {
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: data.name,
                type: data.type,
            },
        });

        return updatedCategory;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie :', error);
        throw new Error('Impossible de mettre à jour la catégorie.');
    }
}

// Fonction pour supprimer une catégorie
export async function deleteCategory(categoryId: number) {
    try {
        await prisma.category.delete({
            where: { id: categoryId },
        });

        return { message: `Catégorie avec l'ID ${categoryId} supprimée avec succès.` };
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error);
        throw new Error('Impossible de supprimer la catégorie.');
    }
}