/**
 * @file sessionActions.ts
 *
 * This file contains server-side functions for managing sessions in the application.
 * It includes functions to create, update, retrieve, and delete sessions using Prisma ORM.
 */

'use server';

import { prisma } from '@/server/db/db';
import { SessionWithRelations } from "@/type/sessionWithRelation";
import { SessionType } from "@prisma/client";

/**
 * Creates a new session and adds the user as a participant.
 *
 * @param {Object} data - The data for the new session.
 * @param {number} data.gameId - The ID of the game.
 * @param {number} data.hostId - The ID of the host.
 * @param {string} data.title - The title of the session.
 * @param {SessionType} data.type_session - The type of the session.
 * @param {Date} data.startTime - The start time of the session.
 * @param {Date} data.endTime - The end time of the session.
 * @param {string} data.location - The location of the session.
 * @param {string} data.description - The description of the session.
 * @returns {Promise<SessionWithRelations>} A promise that resolves to the newly created session.
 * @throws Will throw an error if the session cannot be created.
 */
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
                        userId: data.hostId,
                        status: 'Présent',
                    }
                }
            },
            include: {
                host: true,
                participations: {
                    include: {
                        user: true,
                    }
                },
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
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

/**
 * Updates a session.
 *
 * @param {number} sessionId - The ID of the session to update.
 * @param {Object} data - The data to update the session with.
 * @param {number} data.hostId - The ID of the host.
 * @param {SessionType} data.type_session - The type of the session.
 * @param {Date} data.startTime - The start time of the session.
 * @param {Date} data.endTime - The end time of the session.
 * @param {string} data.location - The location of the session.
 * @param {string} data.description - The description of the session.
 * @returns {Promise<SessionWithRelations>} A promise that resolves to the updated session.
 * @throws Will throw an error if the session cannot be updated.
 */
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
                host: true,
                participations: {
                    include: {
                        user: true,
                    }
                },
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
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

/**
 * Fetches all sessions created by a specific user (host).
 *
 * @param {string} firebaseId - The Firebase ID of the user.
 * @returns {Promise<SessionWithRelations[]>} A promise that resolves to an array of sessions.
 * @throws Will throw an error if the sessions cannot be retrieved.
 */
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
                host: true,
                participations: {
                    include: {
                        user: true,
                    }
                },
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
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

/**
 * Fetches all public sessions.
 *
 * @returns {Promise<SessionWithRelations[]>} A promise that resolves to an array of public sessions.
 * @throws Will throw an error if the sessions cannot be retrieved.
 */
export async function getPublicSessions(): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            where: {
                type_session: 'PUBLIC',
            },
            include: {
                host: true,
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
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
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions publiques :', error);
        throw new Error('Impossible de récupérer les sessions publiques.');
    }
}

/**
 * Fetches all sessions where a user is a participant.
 *
 * @param {string} firebaseId - The Firebase ID of the user.
 * @returns {Promise<SessionWithRelations[]>} A promise that resolves to an array of sessions.
 * @throws Will throw an error if the sessions cannot be retrieved.
 */
export async function getParticipatingSessions(firebaseId: string): Promise<SessionWithRelations[]> {
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
                participations: {
                    some: {
                        userId: user.id,
                    },
                },
                hostId: { not: user.id },
            },
            include: {
                host: true,
                participations: {
                    include: {
                        user: true,
                    },
                },
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions participant :', error);
        throw new Error('Impossible de récupérer les sessions.');
    }
}

/**
 * Fetches all sessions.
 *
 * @returns {Promise<SessionWithRelations[]>} A promise that resolves to an array of sessions.
 * @throws Will throw an error if the sessions cannot be retrieved.
 */
export async function getAllSessions(): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            include: {
                host: true,
                participations: {
                    include: {
                        user: true,
                    },
                },
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions :', error);
        throw new Error('Impossible de récupérer les sessions.');
    }
}

/**
 * Fetches a session by its ID.
 *
 * @param {number} sessionId - The ID of the session to retrieve.
 * @returns {Promise<SessionWithRelations>} A promise that resolves to the session data.
 * @throws Will throw an error if the session cannot be retrieved.
 */
export async function getSessionById(sessionId: number): Promise<SessionWithRelations> {
    try {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                host: true,
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
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
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });

        if (!session) {
            throw new Error("Session introuvable");
        }

        return session;
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        throw new Error('Impossible de récupérer la session.');
    }
}

/**
 * Fetches all public sessions for a specific game.
 *
 * @param {string} gameId - The ID of the game.
 * @returns {Promise<SessionWithRelations[]>} A promise that resolves to an array of public sessions.
 * @throws Will throw an error if the sessions cannot be retrieved.
 */
export async function getPublicSessionsByGameId(gameId: string): Promise<SessionWithRelations[]> {
    try {
        return await prisma.session.findMany({
            where: {
                type_session: 'PUBLIC',
                gameId: parseInt(gameId, 10),
            },
            include: {
                game: {
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                host: true,
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
                characters: true,
                statistics: true,
                invitations: true,
                specialEvents: true,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions publiques pour le jeu :', error);
        throw new Error('Impossible de récupérer les sessions publiques.');
    }
}

/**
 * Deletes a session and its relations.
 *
 * @param {number} sessionId - The ID of the session to delete.
 * @returns {Promise<void>} A promise that resolves when the session is deleted.
 * @throws Will throw an error if the session cannot be deleted.
 */
export async function deleteSessionWithRelations(sessionId: number): Promise<void> {
    try {
        await prisma.participation.deleteMany({ where: { sessionId } });
        await prisma.comment.deleteMany({ where: { sessionId } });
        await prisma.chat.deleteMany({ where: { sessionId } });

        await prisma.session.delete({
            where: { id: sessionId },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la session avec relations:', error);
        throw new Error('Impossible de supprimer la session.');
    }
}