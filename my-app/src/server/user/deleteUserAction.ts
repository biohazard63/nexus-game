/**
 * @file deleteUserAction.ts
 *
 * This file contains a server-side function for deleting a user from PostgreSQL using Prisma ORM.
 */

'use server';

import { prisma } from '../db/db'; // Import the Prisma client

/**
 * Deletes a user from PostgreSQL.
 *
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 * @throws Will throw an error if the user cannot be deleted.
 */
export async function deleteUser(userId: number): Promise<void> {
    try {
        // 1. Delete the user from PostgreSQL
        await prisma.user.delete({
            where: { id: userId },
        });
        console.log('User deleted from PostgreSQL with ID:', userId);

    } catch (error) {
        // Enhanced error logging
        console.error('Error deleting user:', error);

        // Handling specific error cases (optional for future Firestore)
        // @ts-ignore
        if (error.code && error.code === 'P2025') { // Prisma-specific error code for "Record not found"
            console.error(`PostgreSQL user with ID: ${userId} not found.`);
        }

        throw error; // Re-throw the error for further handling
    }
}