/**
 * @file commentActions.ts
 *
 * This file contains server-side functions for managing comments in the application.
 * It includes functions to create, retrieve, update, and delete comments using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';

/**
 * Creates a new comment for a session.
 *
 * @param {number} sessionId - The ID of the session to add the comment to.
 * @param {number} userId - The ID of the user adding the comment.
 * @param {string} content - The content of the comment.
 * @returns {Promise<any>} A promise that resolves to the newly created comment.
 * @throws Will throw an error if the comment cannot be created.
 */
export async function addCommentToSession(sessionId: number, userId: number, content: string) {
    try {
        const newComment = await prisma.comment.create({
            data: {
                sessionId,
                userId,
                content,
            },
            include: {
                user: true,  // Include user information
            },
        });

        return newComment;
    } catch (error) {
        console.error('Erreur lors de la création du commentaire:', error);
        throw new Error('Impossible de créer le commentaire.');
    }
}

/**
 * Retrieves all comments for a session.
 *
 * @param {number} sessionId - The ID of the session to retrieve comments for.
 * @returns {Promise<any[]>} A promise that resolves to an array of comments.
 * @throws Will throw an error if the comments cannot be retrieved.
 */
export async function getCommentsBySessionId(sessionId: number) {
    try {
        const comments = await prisma.comment.findMany({
            where: { sessionId },
            include: {
                user: true,  // Include user information
            },
            orderBy: {
                createdAt: 'asc',  // Order comments by creation date ascending
            },
        });

        return comments;
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        throw new Error('Impossible de récupérer les commentaires.');
    }
}

/**
 * Updates a comment.
 *
 * @param {number} commentId - The ID of the comment to update.
 * @param {string} content - The new content of the comment.
 * @returns {Promise<any>} A promise that resolves to the updated comment.
 * @throws Will throw an error if the comment cannot be updated.
 */
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

/**
 * Deletes a comment.
 *
 * @param {number} commentId - The ID of the comment to delete.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success.
 * @throws Will throw an error if the comment cannot be deleted.
 */
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