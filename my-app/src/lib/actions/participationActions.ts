/**
 * @file participationActions.ts
 *
 * This file contains server-side functions for managing participations in the application.
 * It includes functions to retrieve, create, update, and delete participations using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';

/**
 * Fetches all participations for a session.
 *
 * @param {number} sessionId - The ID of the session to retrieve participations for.
 * @returns {Promise<any[]>} A promise that resolves to an array of participations.
 * @throws Will throw an error if the participations cannot be retrieved.
 */
export async function getParticipationsBySession(sessionId: number) {
    try {
        return await prisma.participation.findMany({
            where: { sessionId },
            include: {
                user: true, // Include user information
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des participations:', error);
        throw new Error('Impossible de récupérer les participations.');
    }
}

/**
 * Fetches a specific participation by its ID.
 *
 * @param {number} participationId - The ID of the participation to retrieve.
 * @returns {Promise<any>} A promise that resolves to the participation data.
 * @throws Will throw an error if the participation cannot be retrieved.
 */
export async function getParticipationById(participationId: number) {
    try {
        return await prisma.participation.findUnique({
            where: { id: participationId },
            include: {
                user: true,  // Include user information
                session: true,  // Include session information
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la participation:', error);
        throw new Error('Impossible de récupérer la participation.');
    }
}

/**
 * Adds a user to a session.
 *
 * @param {Object} data - The data for the new participation.
 * @param {number} data.sessionId - The ID of the session.
 * @param {number} data.userId - The ID of the user.
 * @param {string} data.status - The status of the participation.
 * @returns {Promise<any>} A promise that resolves to the newly created participation.
 * @throws Will throw an error if the participation cannot be created.
 */
export async function createParticipation(data: {
    sessionId: number;
    userId: number;
    status: string;
}) {
    try {
        return await prisma.participation.create({
            data,
        });
    } catch (error) {
        console.error('Erreur lors de la création de la participation:', error);
        throw new Error('Impossible de créer la participation.');
    }
}

/**
 * Updates the status of a participant.
 *
 * @param {number} participationId - The ID of the participation to update.
 * @param {string} status - The new status of the participation.
 * @returns {Promise<any>} A promise that resolves to the updated participation.
 * @throws Will throw an error if the status cannot be updated.
 */
export async function updateParticipantStatus(participationId: number, status: string) {
    try {
        return await prisma.participation.update({
            where: { id: participationId },
            data: { status },
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw new Error('Impossible de mettre à jour le statut du participant.');
    }
}

/**
 * Deletes a participant from a session.
 *
 * @param {number} participationId - The ID of the participation to delete.
 * @returns {Promise<void>} A promise that resolves when the participation is deleted.
 * @throws Will throw an error if the participation cannot be deleted.
 */
export async function deleteParticipation(participationId: number) {
    try {
        await prisma.participation.delete({
            where: { id: participationId },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la participation:', error);
        throw new Error('Impossible de supprimer la participation.');
    }
}

/**
 * Removes a participant.
 *
 * @param {number} participationId - The ID of the participant to remove.
 * @returns {Promise<any>} A promise that resolves to the removed participant.
 * @throws Will throw an error if the participant cannot be removed.
 */
export async function removeParticipant(participationId: number) {
    try {
        return await prisma.participation.delete({
            where: { id: participationId },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du participant :', error);
        throw new Error('Impossible de supprimer le participant.');
    }
}