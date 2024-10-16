/**
 * @file signupAction.ts
 *
 * This file contains a server-side function for creating a user on the server using Prisma ORM.
 */

'use server';

import { prisma } from '../db/db';
import { redirect } from 'next/navigation';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { AccountType } from '@prisma/client';

/**
 * Creates a user on the server.
 *
 * @param {Object} data - The data to create the user with.
 * @param {string} data.username - The username of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} data.firstName - The first name of the user.
 * @param {string} data.lastName - The last name of the user.
 * @param {AccountType} data.accountType - The account type of the user.
 * @param {string} data.firebase_id - The Firebase ID of the user.
 * @returns {Promise<void>} A promise that resolves when the user is created.
 * @throws Will throw an error if the user cannot be created.
 */
export async function createUserOnServer(data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType: AccountType;
    firebase_id: string;
}): Promise<void> {
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
                firebase_id: data.firebase_id,
                createdAt: new Date(),
            },
        });

        redirect('/login');
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur sur le serveur:', error);
        throw error;
    }
}