'use server';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { prisma } from '../db/db';
import { AccountType } from '@prisma/client';

// Fonction pour récupérer l'utilisateur basé sur l'ID Firebase
export async function getUserByFirebaseId(firebaseId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { firebase_id: firebaseId }, // Maintenant que la colonne firebase_id existe
        });
        console.log('User from PostgreSQL:', user); // Voir ce que Prisma renvoie
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur dans PostgreSQL :', error);
        throw error;
    }
}
// Fonction pour mettre à jour l'utilisateur
export async function updateUser(userId: number, data: Partial<{
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    accountType?: AccountType;
}>) {
    try {
        console.log(`Mise à jour de l'utilisateur avec l'ID : ${userId}`);

        // Mapper les champs camelCase vers snake_case
        let updateData: any = {
            username: data.username,
            email: data.email,
            bio: data.bio,
            profilePicture: data.profilePicture, // Correspond à "profile_picture" en BDD
            first_name: data.firstName, // Correspond à "first_name" en BDD
            last_name: data.lastName,  // Correspond à "last_name" en BDD
            accountType: data.accountType,  // Correspond à "account_type" en BDD
        };

        // Si un mot de passe est fourni, le hasher
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updateData.password = hashedPassword;
        }

        // Mise à jour dans PostgreSQL via Prisma
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        console.log('Utilisateur mis à jour :', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
        throw error;
    }
}