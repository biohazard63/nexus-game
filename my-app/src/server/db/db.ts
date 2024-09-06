import { PrismaClient } from '@prisma/client';

// Vérifiez si une instance de Prisma existe déjà
const prisma = global.prisma || new PrismaClient();

// Assurez-vous que l'instance Prisma est unique en mode développement
if (process.env.NODE_ENV === 'development') {
    global.prisma = prisma;
}

// Exportez l'instance Prisma
export { prisma };