// src/lib/actions/participationActions.ts
'use server';
import { prisma } from '@/server/db/db';

// Fonction pour récupérer toutes les participations d'une session
export async function getParticipationsBySession(sessionId: number) {
    try {
        return await prisma.participation.findMany({
            where: { sessionId },
            include: {
                user: true, // Inclure les informations sur l'utilisateur participant
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des participations:', error);
        throw new Error('Impossible de récupérer les participations.');
    }
}

// Fonction pour récupérer une participation spécifique par son ID
export async function getParticipationById(participationId: number) {
    try {
        return await prisma.participation.findUnique({
            where: { id: participationId },
            include: {
                user: true,  // Inclure les informations de l'utilisateur
                session: true,  // Inclure les informations de la session
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la participation:', error);
        throw new Error('Impossible de récupérer la participation.');
    }
}

// Fonction pour ajouter un utilisateur à une session
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

// Fonction pour mettre à jour le statut d'un participant
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

// Fonction pour supprimer un participant d'une session
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