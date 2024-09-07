'use server';
import { prisma } from '../db/db';

export async function deleteUser(userId: number) {
    try {
        console.log(`Suppression de l'utilisateur avec l'ID : ${userId}`);
        await prisma.user.delete({
            where: { id: userId },
        });
        console.log(`Utilisateur avec l'ID ${userId} supprimé avec succès.`);
        return { message: `Utilisateur avec l'ID ${userId} supprimé avec succès.` };
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur :', error);
        throw error;
    }
}