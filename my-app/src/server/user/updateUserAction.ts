/**
 * @file updateUserAction.ts
 *
 * This file contains server-side functions for retrieving a user by Firebase ID and updating a user in PostgreSQL using Prisma ORM.
 */

'use server';

// @ts-ignore
import bcrypt from 'bcryptjs';
import { prisma } from '../db/db';
import { AccountType } from '@prisma/client';

/**
 * Retrieves a user by Firebase ID.
 *
 * @param {string} firebaseId - The Firebase ID of the user to retrieve.
 * @returns {Promise<any>} A promise that resolves to the user data.
 * @throws Will throw an error if the user cannot be retrieved.
 */
export async function getUserByFirebaseId(firebaseId: string): Promise<any> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId },
        });
        console.log('User from PostgreSQL:', user);
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur dans PostgreSQL :', error);
        throw error;
    }
}

/**
 * Updates a user.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {Partial<{username: string; email: string; password: string; firstName?: string; lastName?: string; bio?: string; profilePicture?: string; accountType?: AccountType;}>} data - The data to update the user with.
 * @returns {Promise<any>} A promise that resolves to the updated user data.
 * @throws Will throw an error if the user cannot be updated.
 */
export async function updateUser(userId: number, data: Partial<{
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    accountType?: AccountType;
}>): Promise<any> {
    try {
        console.log(`Mise à jour de l'utilisateur avec l'ID : ${userId}`);

        // Mapper les champs camelCase vers snake_case
        let updateData: any = {
            username: data.username,
            email: data.email,
            bio: data.bio,
            profilePicture: data.profilePicture,
            first_name: data.firstName,
            last_name: data.lastName,
            accountType: data.accountType,
        };

        // Si un mot de passe est fourni, le hasher
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updateData.password = hashedPassword;
        }

        // Mise à jour dans PostgreSQL via Prisma
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        console.log('Utilisateur mis à jour :', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
        throw error;
    }
}