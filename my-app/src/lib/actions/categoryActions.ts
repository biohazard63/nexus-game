/**
 * @file categoryActions.ts
 *
 * This file contains server-side functions for managing categories in the application.
 * It includes functions to retrieve, create, update, and delete categories using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';
import { CategoryWithRelations, categoryWithRelations } from '@/type/categoryWithRelation';
import { GameType } from "@prisma/client";

/**
 * Fetches all categories with their related games.
 *
 * @returns {Promise<CategoryWithRelations[]>} A promise that resolves to an array of categories with their relations.
 * @throws Will throw an error if the categories cannot be retrieved.
 */
export async function getCategories(): Promise<CategoryWithRelations[]> {
    try {
        const categories = await prisma.category.findMany(categoryWithRelations);
        return categories;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        throw new Error('Impossible de récupérer les catégories.');
    }
}

/**
 * Fetches a category by its ID along with its related games.
 *
 * @param {number} categoryId - The ID of the category to retrieve.
 * @returns {Promise<CategoryWithRelations | null>} A promise that resolves to the category with its relations, or null if not found.
 * @throws Will throw an error if the category cannot be retrieved.
 */
export async function getCategoryById(categoryId: number) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                games: {
                    include: {
                        game: true, // Include complete game data
                    },
                },
            },
        });

        return category;
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie :', error);
        throw error;
    }
}

/**
 * Creates a new category.
 *
 * @param {Object} data - The data for the new category.
 * @param {string} data.name - The name of the category.
 * @param {GameType} data.type - The type of the category.
 * @returns {Promise<Category>} A promise that resolves to the newly created category.
 * @throws Will throw an error if the category cannot be created.
 */
export async function createCategory(data: { name: string; type: GameType }) {
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

/**
 * Updates an existing category.
 *
 * @param {number} categoryId - The ID of the category to update.
 * @param {Object} data - The new data for the category.
 * @param {string} [data.name] - The new name of the category.
 * @param {GameType} [data.type] - The new type of the category.
 * @returns {Promise<Category>} A promise that resolves to the updated category.
 * @throws Will throw an error if the category cannot be updated.
 */
export async function updateCategory(categoryId: number, data: { name?: string; type?: GameType }) {
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

/**
 * Deletes a category.
 *
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<Object>} A promise that resolves to a message indicating successful deletion.
 * @throws Will throw an error if the category cannot be deleted.
 */
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