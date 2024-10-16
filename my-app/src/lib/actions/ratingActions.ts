/**
 * @file ratingActions.ts
 *
 * This file contains server-side functions for managing ratings in the application.
 * It includes functions to create ratings using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';

/**
 * Creates a new rating.
 *
 * @param {Object} data - The data for the new rating.
 * @param {number} data.senderId - The ID of the sender.
 * @param {number} data.receiverId - The ID of the receiver.
 * @param {number} data.rating - The rating value.
 * @param {string} data.review - The review text.
 * @param {number} [data.gameId] - The ID of the game (optional).
 * @returns {Promise<void>} A promise that resolves when the rating is created.
 * @throws Will throw an error if the rating cannot be created.
 */
export async function createRating(data: { senderId: number; receiverId: number; rating: number; review: string; gameId?: number }) {
    try {
        if (!data.senderId || !data.receiverId) {
            throw new Error("Les ID de l'expéditeur et du destinataire sont manquants.");
        }

        await prisma.rating.create({
            data: {
                rating: data.rating,
                review: data.review,
                sender: {
                    connect: { id: data.senderId }, // Connect to the sender
                },
                receiver: {
                    connect: { id: data.receiverId }, // Connect to the receiver
                },
                ...(data.gameId && { // Connect to the game if a gameId is provided
                    game: {
                        connect: { id: data.gameId },
                    },
                }),
            },
        });
    } catch (error) {
        console.error('Erreur lors de la création de la note:', error);
        throw new Error('Impossible de créer la note.');
    }
}