'use server';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/db';
import { userWithRelations } from "@/type/userWithRelations";
import { AccountType } from '@prisma/client';



// Fonction pour créer un utilisateur
export async function createUser(data: {
    firstName: string;
    lastName: string;
    createdAt: string;
    password: string;
    accountType: "USER";
    email: string;
    username: string;
}) {
    try {
        console.log('Données reçues pour créer l’utilisateur :', data);

        // Vérifier que toutes les données nécessaires sont présentes
        if (!data.username || !data.email || !data.password) {
            throw new Error("Les informations utilisateur sont incomplètes");
        }

        // Hash du mot de passe
        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Créer l'utilisateur dans la base de données
        console.log('Création de l’utilisateur dans PostgreSQL...');
        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                first_name: data.firstName,
                last_name: data.lastName,
                accountType: 'USER', // Par défaut, l'utilisateur aura un rôle USER
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

// Fonction pour obtenir un utilisateur par ID avec ses relations
export async function getUserById(userId: number) {
    try {
        console.log(`Récupération de l'utilisateur avec l'ID : ${userId}`);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: userWithRelations.include, // Inclure les relations
        });

        if (!user) {
            throw new Error(`Utilisateur avec l'ID ${userId} non trouvé.`);
        }

        console.log('Utilisateur trouvé :', user);
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        throw error;
    }
}

// Fonction pour mettre à jour un utilisateur
export async function updateUser(userId: number, data: Partial<{
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
}>) {
    try {
        console.log(`Mise à jour de l'utilisateur avec l'ID : ${userId}`);
        let updateData: any = { ...data };

        // Si le mot de passe est mis à jour, on le hash avant de l'enregistrer
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

// Fonction pour supprimer un utilisateur
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

// Fonction pour obtenir les 10 derniers utilisateurs créés
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
                accountType: true, // Inclure le type de compte
            },
        });

        console.log('Derniers utilisateurs récupérés :', users);
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        throw error;
    }
}