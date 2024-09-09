'use server';

import { prisma } from '../db/db'; // Import the Prisma client
import { db } from '@/lib/firebase'; // Firestore instance
import { deleteDoc, doc } from 'firebase/firestore'; // Firestore methods

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

// export async function deleteUserFromFirestore(firebaseUid: string) {
//     try {
//         // Ensure the firebaseUid is not undefined or null
//         if (!firebaseUid) {
//             throw new Error('firebaseUid is undefined or null');
//         }
//
//         console.log(`Attempting to delete user from Firestore with Firebase UID: ${firebaseUid}`);
//
//         // 1. Delete the user's data from Firestore
//         const userDocRef = doc(db, 'users', firebaseUid); // Reference to the user document
//         await deleteDoc(userDocRef);
//         console.log('User deleted from Firestore:', firebaseUid);
//
//     } catch (error) {
//         // Enhanced error logging
//         console.error('Error deleting user from Firestore:', error);
//
//         // Check for specific Firestore error codes
//         if (error.code && error.code === 'not-found') {
//             console.error(`Firestore document with UID: ${firebaseUid} not found.`);
//         } else if (error.message.includes('FIRESTORE')) {
//             console.error('Firestore internal issue:', error.message);
//         }
//
//         throw error; // Re-throw the error for further handling
//     }
// }