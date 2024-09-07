'use server';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { prisma } from '../db/db';
import { AccountType } from '@prisma/client';

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
        let updateData: any = { ...data };

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updateData.password = hashedPassword;
        }

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