// src/server/user/signupAction.ts
'use server';
import { prisma } from '../db/db';
import { redirect } from 'next/navigation';
// @ts-ignore
import bcrypt from 'bcryptjs';

export async function createUserOnServer(data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType: 'USER';
}) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                first_name: data.firstName,
                last_name: data.lastName,
                accountType: data.accountType,
                createdAt: new Date(),
            },
        });

        redirect('/login'); // Redirection après succès
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur sur le serveur:', error);
        throw error;
    }
}