/**
 * @file userActions.ts
 *
 * This file contains server-side functions for managing users in the application.
 * It includes functions to retrieve, create, update, and delete users using Prisma ORM and Firebase.
 */

'use server';

import { auth } from '@/lib/firebase'; // Firebase Auth
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { prisma } from '@/server/db/db';

/**
 * Fetches all users from PostgreSQL.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of users.
 * @throws Will throw an error if the users cannot be retrieved.
 */
export async function getUsersFromPostgreSQL() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                accountType: true,
                firebase_id: true,
                profilePicture: true,
                bio: true,
                first_name: true,
                last_name: true,
                password: true,
                updatedAt: true,
                ratingsReceived: {
                    select: {
                        rating: true,
                        review: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                ratingsSent: {
                    select: {
                        rating: true,
                        review: true,
                        receiver: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                api_key: true,
                groups: true,
                comments: true,
                rewards: true,
                statistics: true,
                invitationsSent: true,
                invitationsReceived: true,
                wishlists: true,
                userBadges: true,
                messagesSent: true,
                messagesReceived: true,
                hostedSessions: true,
                participations: true,
                characters: true,
                chat: true,
            },
        });
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw new Error('Impossible de récupérer les utilisateurs.');
    }
}

/**
 * Fetches the role of a user by their Firebase UID.
 *
 * @param {string} uid - The Firebase UID of the user.
 * @returns {Promise<string>} A promise that resolves to the role of the user.
 * @throws Will throw an error if the user cannot be found.
 */
export async function getUserRole(uid: string): Promise<string> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user';
    }
    throw new Error('Utilisateur non trouvé');
}

/**
 * Fetches a user by their ID.
 *
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<any>} A promise that resolves to the user data.
 * @throws Will throw an error if the user cannot be retrieved.
 */
export async function getUserById(userId: number): Promise<any> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                first_name: true,
                last_name: true,
                email: true,
                profilePicture: true,
                bio: true,
                ratingsReceived: {
                    select: {
                        rating: true,
                        review: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                ratingsSent: {
                    select: {
                        rating: true,
                        review: true,
                        receiver: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                api_key: true,
                groups: true,
                comments: true,
                rewards: true,
                statistics: true,
                invitationsSent: true,
                invitationsReceived: true,
                wishlists: true,
                userBadges: true,
                messagesSent: true,
                messagesReceived: true,
                hostedSessions: true,
                participations: true,
                characters: true,
                chat: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur.');
    }
}

/**
 * Updates a user in PostgreSQL with nested relations management.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {Object} data - The new data for the user.
 * @param {string} data.username - The new username of the user.
 * @param {string} data.first_name - The new first name of the user.
 * @param {string} data.last_name - The new last name of the user.
 * @param {string} data.email - The new email of the user.
 * @param {string} data.profilePicture - The new profile picture of the user.
 * @param {string} data.bio - The new bio of the user.
 * @returns {Promise<any>} A promise that resolves to the updated user.
 * @throws Will throw an error if the user cannot be updated.
 */
export async function updateUser(userId: number, data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profilePicture: string;
    bio: string;
}) {
    try {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                profilePicture: data.profilePicture,
                bio: data.bio,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw new Error('Impossible de mettre à jour l\'utilisateur.');
    }
}

/**
 * Fetches a user by their Firebase ID.
 *
 * @param {string} firebaseId - The Firebase ID of the user to retrieve.
 * @returns {Promise<any>} A promise that resolves to the user data.
 * @throws Will throw an error if the user cannot be retrieved.
 */
export async function getUserByFirebaseId(firebaseId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                firebase_id: firebaseId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                firebase_id: true,
            },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable');
        }

        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur.');
    }
}

/**
 * Fetches the user ID by their Firebase ID.
 *
 * @param {string} firebaseId - The Firebase ID of the user.
 * @returns {Promise<number | null>} A promise that resolves to the user ID or null if not found.
 * @throws Will throw an error if the user ID cannot be retrieved.
 */
export async function getUserIdByFirebaseId(firebaseId: string): Promise<number | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId },
            select: { id: true },
        });

        return user?.id ?? null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
        return null;
    }
}