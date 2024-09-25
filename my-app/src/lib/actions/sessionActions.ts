'use server';
import { prisma } from '@/server/db/db';
import {SessionWithRelations} from "@/type/sessionWithRelation";
import {SessionType} from "@prisma/client";


export async function getSessionsWhereUserIsParticipant(userId: number): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            where: {
                participations: {
                    some: {
                        userId, // Utilisateur participant
                    },
                },
            },
            include: {
                host: true, // Inclure les détails de l'hôte
                participations: true, // Inclure les participations
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true, // Inclure les détails des catégories via la table de jointure
                            },
                        },
                    },
                },
                comments: true, // Inclure les commentaires
                characters: true, // Inclure les personnages
                statistics: true, // Inclure les statistiques
                invitations: true, // Inclure les invitations
                specialEvents: true, // Inclure les événements spéciaux
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions :', error);
        throw new Error('Impossible de récupérer les sessions.');
    }
}

// Créer une nouvelle session et ajouter l'utilisateur comme participant
export async function createSession(data: {
    gameId: number;
    hostId: number;
    title: string;
    type_session: SessionType;
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
}): Promise<SessionWithRelations> {
    try {
        // Créer la session
        const newSession = await prisma.session.create({
            data: {
                gameId: data.gameId,
                hostId: data.hostId,
                title: data.title,
                type_session: data.type_session,
                startTime: data.startTime,
                endTime: data.endTime,
                location: data.location,
                description: data.description,
                participations: {
                    create: {
                        userId: data.hostId, // Ajouter l'hôte en tant que participant
                        status: 'Présent', // Définir le statut initial comme présent ou autre selon votre logique
                    }
                }
            },
            include: {
                host: true,
                participations: true,
                game: true,
                comments: true,
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });

        return newSession;
    } catch (error) {
        console.error("Erreur lors de la création de la session :", error);
        throw new Error("Impossible de créer la session.");
    }
}

// Supprimer une session
export async function deleteSession(sessionId: number): Promise<void> {
    try {
        await prisma.session.delete({
            where: { id: sessionId },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la session :', error);
        throw new Error('Impossible de supprimer la session.');
    }
}

// Mettre à jour une session
export async function updateSession(sessionId: number, data: {
    hostId: number;
    type_session: SessionType;
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
}): Promise<SessionWithRelations> {
    try {
        return await prisma.session.update({
            where: { id: sessionId },
            data: {
                host: {
                    connect: { id: data.hostId },
                },
                type_session: data.type_session,
                startTime: data.startTime,
                endTime: data.endTime,
                location: data.location,
                description: data.description,
            },
            include: {
                host: true, // Inclure les détails de l'hôte
                participations: true,
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true, // Inclure les catégories du jeu
                            },
                        },
                    },
                },
                comments: true,
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la session :', error);
        throw new Error('Impossible de mettre à jour la session.');
    }
}


// Récupérer toutes les sessions créées par un utilisateur spécifique (hôte)
export async function getCreatedSessions(firebaseId: string): Promise<SessionWithRelations[]> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId },
            select: { id: true },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable.');
        }

        return await prisma.session.findMany({
            where: {
                hostId: user.id,
            },
            include: {
                host: true, // Inclure les détails de l'hôte
                participations: true,
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true, // Inclure les catégories du jeu
                            },
                        },
                    },
                },
                comments: true,
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions créées :', error);
        throw new Error('Impossible de récupérer les sessions créées.');
    }
}




export async function getPublicSessions(): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            where: {
                type_session: 'PUBLIC',
            },
            include: {
                host: true, // Inclure les détails de l'hôte
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true, // Inclure les catégories du jeu via la table de pivot
                            },
                        },
                    },
                },
                participations: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions publiques :', error);
        throw new Error('Impossible de récupérer les sessions publiques.');
    }
}


// Récupérer toutes les sessions où un utilisateur est participant
export async function getParticipatingSessions(firebaseId: string): Promise<SessionWithRelations[]> {
    try {
        // Récupérer l'utilisateur avec son firebaseId
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId },
            select: { id: true },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable.');
        }

        // Récupérer les sessions où l'utilisateur est participant
        return await prisma.session.findMany({
            where: {
                participations: {
                    some: {
                        userId: user.id, // Vérifie si l'utilisateur participe à la session
                    },
                },
                hostId: { not: user.id }, // Exclure les sessions créées par l'utilisateur
            },
            include: {
                host: true, // Inclure les détails de l'hôte
                participations: true, // Inclure les participations
                game: true, // Inclure les détails du jeu
                comments: true, // Inclure les commentaires
                characters: true, // Inclure les personnages
                statistics: true, // Inclure les statistiques
                invitations: true, // Inclure les invitations
                specialEvents: true, // Inclure les événements spéciaux
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions participant :', error);
        throw new Error('Impossible de récupérer les sessions.');
    }
}

export async function getAllSessions(): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            include: {
                host: true, // Inclure les détails de l'hôte
                participations: true, // Inclure les participations
                game: true, // Inclure les détails du jeu
                comments: true, // Inclure les commentaires
                characters: true, // Inclure les personnages
                statistics: true, // Inclure les statistiques
                invitations: true, // Inclure les invitations
                specialEvents: true, // Inclure les événements spéciaux
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions :', error);
        throw new Error('Impossible de récupérer les sessions.');
    }
}

export async function getSessionById(sessionId: number): Promise<SessionWithRelations> {
    try {
        return await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true, // Inclure les catégories du jeu
                            },
                        },
                    },
                },
                participations: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        throw new Error('Impossible de récupérer la session.');
    }
}