'use server';
import { auth } from '@/lib/firebase'; // Firebase Auth

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
                accountType: true, // Inclure le rôle de l'utilisateur
                firebase_id: true,
                profilePicture: true,
            },
        });
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw new Error('Impossible de récupérer les utilisateurs.');
    }
}


import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export async function getUserRole(uid: string): Promise<string> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user'; // Retourner le rôle ou 'user' par défaut
    }
    throw new Error('Utilisateur non trouvé');
}


// Récupérer un utilisateur spécifique par son ID
export async function getUserById(userId: number) {
    return prisma.user.findUnique({
        where: {id: userId},
    });
}

// Mettre à jour un utilisateur dans PostgreSQL
export async function updateUser(userId: number, data: any) {
    return prisma.user.update({
        where: {id: userId},
        data,
    });
}

export async function getCurrentUser() {
    // Récupérer l'utilisateur actuellement connecté à Firebase
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    try {
        // Rechercher l'utilisateur dans PostgreSQL par son firebase_id
        const userInDB = await prisma.user.findUnique({
            where: {
                firebase_id: user.uid,
            },
            select: {
                id: true,
                username: true,
                email: true,
                accountType: true,
                profilePicture: true,
            },
        });

        if (!userInDB) {
            throw new Error('Utilisateur non trouvé dans la base de données.');
        }


        return userInDB;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
        throw new Error('Impossible de récupérer l\'utilisateur connecté.');
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