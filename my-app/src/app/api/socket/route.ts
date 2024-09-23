import { Server } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';

let io: Server | null = null;

// Initialise le serveur Socket.io
export async function GET(req: NextRequest) {
    if (!io) {
        const httpServer = req.socket?.server;
        io = new Server(httpServer);

        io.on('connection', (socket) => {
            console.log(`Nouvelle connexion : ${socket.id}`);

            // Gérer les messages envoyés par les clients
            socket.on('message', (message) => {
                console.log(`Message reçu : ${message}`);
                // Diffuser le message à tous les autres clients
                io?.emit('message', message);
            });

            socket.on('disconnect', () => {
                console.log(`Déconnexion : ${socket.id}`);
            });
        });

        console.log('Socket.io initialisé');
    }

    return NextResponse.json({ status: 'Socket.io prêt' });
}