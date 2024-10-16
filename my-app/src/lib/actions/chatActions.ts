/**
 * @file chatActions.ts
 *
 * This file contains server-side functions for managing chat messages in the application.
 * It includes functions to retrieve and send chat messages using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';

/**
 * Fetches chat messages for a specific session.
 *
 * @param {number} sessionId - The ID of the session to retrieve messages for.
 * @returns {Promise<any[]>} A promise that resolves to an array of chat messages.
 * @throws Will throw an error if the messages cannot be retrieved.
 */
export async function getChatMessages(sessionId: number) {
    try {
        const messages = await prisma.chat.findMany({
            where: { sessionId },
            include: {
                user: {
                    select: {
                        username: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return messages;
    } catch (error) {
        console.error('Erreur lors de la récupération des messages du chat:', error);
        throw new Error('Impossible de récupérer les messages.');
    }
}

/**
 * Sends a new message in the chat.
 *
 * @param {number} sessionId - The ID of the session to send the message to.
 * @param {number} userId - The ID of the user sending the message.
 * @param {string} message - The content of the message.
 * @returns {Promise<any>} A promise that resolves to the newly created chat message.
 * @throws Will throw an error if the message cannot be sent.
 */
export async function sendChatMessage(sessionId: number, userId: number, message: string) {
    try {
        const newMessage = await prisma.chat.create({
            data: {
                sessionId,
                userId,
                message,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profilePicture: true,
                    },
                },
            },
        });
        return newMessage;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw new Error('Impossible d\'envoyer le message.');
    }
}