'use server';

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