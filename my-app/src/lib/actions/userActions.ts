'use server';
import { auth } from '@/lib/firebase'; // Firebase Auth
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { prisma } from '@/server/db/db';


// Fonction pour récupérer tous les utilisateurs depuis PostgreSQL
export async function getUsersFromPostgreSQL() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                accountType: true,
                firebase_id: true,
                profilePicture: true,
                bio: true,
                first_name: true, // Inclure first_name
                last_name: true,  // Inclure last_name
                password: true,   // Inclure password
                updatedAt: true,  // Inclure updatedAt
                ratingsReceived: {
                    select: {
                        rating: true,
                        review: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                ratingsSent: {
                    select: {
                        rating: true,
                        review: true,
                        receiver: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                api_key: true,
                groups: true,
                comments: true,
                rewards: true,
                statistics: true,
                invitationsSent: true,
                invitationsReceived: true,
                wishlists: true,
                userBadges: true,
                messagesSent: true,
                messagesReceived: true,
                hostedSessions: true,
                participations: true,
                characters: true,
                chat: true,
            },
        });
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw new Error('Impossible de récupérer les utilisateurs.');
    }
}



export async function getUserRole(uid: string): Promise<string> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user'; // Retourner le rôle ou 'user' par défaut
    }
    throw new Error('Utilisateur non trouvé');
}

export async function getUserById(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                first_name: true,
                last_name: true,
                email: true,
                profilePicture: true,
                bio: true,
                ratingsReceived: {
                    select: {
                        rating: true,
                        review: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                ratingsSent: {
                    select: {
                        rating: true,
                        review: true,
                        receiver: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                api_key: true,
                groups: true,
                comments: true,
                rewards: true,
                statistics: true,
                invitationsSent: true,
                invitationsReceived: true,
                wishlists: true,
                userBadges: true,
                messagesSent: true,
                messagesReceived: true,
                hostedSessions: true,
                participations: true,
                characters: true,
                chat: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur.');
    }
}

// Mettre à jour un utilisateur dans PostgreSQL avec gestion des relations imbriquées
export async function updateUser(userId: number, data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profilePicture: string;
    bio: string;
}) {
    try {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                profilePicture: data.profilePicture,
                bio: data.bio,
                // Omettre les relations imbriquées comme api_key, groups, etc.
            },
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw new Error('Impossible de mettre à jour l\'utilisateur.');
    }
}

export async function getUserByFirebaseId(firebaseId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                firebase_id: firebaseId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                firebase_id: true,
            },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable');
        }

        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur.');
    }
}



// Fonction pour récupérer l'ID utilisateur à partir du firebase_id
export async function getUserIdByFirebaseId(firebaseId: string): Promise<number | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId },
            select: { id: true },
        });

        return user?.id ?? null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
        return null;
    }
}