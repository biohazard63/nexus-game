'use server';
import { prisma } from '../db/db';

export async function getLast10Users() {
    try {
        console.log('Récupération des 10 derniers utilisateurs...');
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 10, // Limiter à 10 utilisateurs
            include: {
                profilePicture: true,
                email: true,
                createdAt: true,
                username: true,
                accountType: true,
            },
        });

        console.log('Derniers utilisateurs récupérés :', users);
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        throw error;
    }
}