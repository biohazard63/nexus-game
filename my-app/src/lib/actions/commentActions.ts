'use server';

import { prisma } from '@/server/db/db';

// Fonction pour créer un nouveau commentaire
export async function addCommentToSession(sessionId: number, userId: number, content: string) {
    try {
        const newComment = await prisma.comment.create({
            data: {
                sessionId,
                userId,
                content,
            },
            include: {
                user: true,  // Inclure les informations sur l'utilisateur qui a posté le commentaire
            },
        });

        return newComment;
    } catch (error) {
        console.error('Erreur lors de la création du commentaire:', error);
        throw new Error('Impossible de créer le commentaire.');
    }
}

// Fonction pour récupérer tous les commentaires d'une session
export async function getCommentsBySessionId(sessionId: number) {
    try {
        const comments = await prisma.comment.findMany({
            where: { sessionId },
            include: {
                user: true,  // Inclure les informations sur l'utilisateur
            },
            orderBy: {
                createdAt: 'asc',  // Trier les commentaires par date de création croissante
            },
        });

        return comments;
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        throw new Error('Impossible de récupérer les commentaires.');
    }
}

// Fonction pour mettre à jour un commentaire
export async function updateComment(commentId: number, content: string) {
    try {
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });

        return updatedComment;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du commentaire:', error);
        throw new Error('Impossible de mettre à jour le commentaire.');
    }
}

// Fonction pour supprimer un commentaire
export async function deleteComment(commentId: number) {
    try {
        await prisma.comment.delete({
            where: { id: commentId },
        });
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        throw new Error('Impossible de supprimer le commentaire.');
    }
}


