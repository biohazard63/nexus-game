'use server';

import { prisma } from '@/server/db/db';



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
                    connect: { id: data.senderId }, // Connexion à l'expéditeur
                },
                receiver: {
                    connect: { id: data.receiverId }, // Connexion au destinataire
                },
                ...(data.gameId && { // Connexion au jeu si un gameId est fourni
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