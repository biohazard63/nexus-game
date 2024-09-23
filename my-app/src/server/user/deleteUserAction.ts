'use server';

import { prisma } from '../db/db'; // Import the Prisma client


// Function to delete user from PostgreSQL
export async function deleteUser(userId: number) {
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
