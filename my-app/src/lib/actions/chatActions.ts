'use server';

import { prisma } from '@/server/db/db';

// Récupérer les messages d'un salon spécifique
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

// Envoyer un nouveau message dans le chat
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