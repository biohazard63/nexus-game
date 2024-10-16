/**
 * @file getUserAction.ts
 *
 * This file contains a server-side function for retrieving a user by ID from PostgreSQL using Prisma ORM.
 */


'use server';
import { prisma } from '../db/db';
import { userWithRelations } from "@/type/userWithRelations";
/**
 * Retrieves a user by ID.
 *
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<userWithRelations>} A promise that resolves to the user data.
 * @throws Will throw an error if the user cannot be retrieved.
 */
export async function getUserById(userId: number) {
    try {
        console.log(`Récupération de l'utilisateur avec l'ID : ${userId}`);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: userWithRelations.include,
        });

        if (!user) {
            throw new Error(`Utilisateur avec l'ID ${userId} non trouvé.`);
        }

        console.log('Utilisateur trouvé :', user);
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        throw error;
    }
}