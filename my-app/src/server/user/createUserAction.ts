'use server';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { prisma } from '../db/db';
import { AccountType } from '@prisma/client';

export async function createUserOnServer(data: {
    firstName: string;
    lastName: string;
    password: string;
    accountType: AccountType;
    email: string;
    username: string;
}) {
    try {
        console.log('Données reçues pour créer l’utilisateur :', data);

        if (!data.username || !data.email || !data.password) {
            throw new Error("Les informations utilisateur sont incomplètes");
        }

        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(data.password, 10);

        console.log('Création de l’utilisateur dans PostgreSQL...');
        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                first_name: data.firstName,
                last_name: data.lastName,
                accountType: AccountType.USER,
                createdAt: new Date(),
            },
        });

        console.log('Utilisateur créé dans PostgreSQL :', newUser);
        return newUser;
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur :', error);
        throw error;
    }
}