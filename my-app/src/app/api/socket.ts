import { Server as ServerIO } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Socket } from "net";

interface SocketServer extends NetServer {
    io?: ServerIO;
}

interface SocketWithIO extends Socket {
    server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!res.socket.server.io) {
        console.log("Initialisation de Socket.io");

        const httpServer: SocketWithIO = res.socket as SocketWithIO;
        const io = new ServerIO(httpServer.server);

        // Gestion des événements Socket.io
        io.on("connection", (socket) => {
            console.log(`Nouvelle connexion : ${socket.id}`);

            socket.on("message", (msg) => {
                console.log(`Message reçu : ${msg}`);
                io.emit("message", msg); // Diffuser le message à tous les clients
            });

            socket.on("disconnect", () => {
                console.log(`Déconnexion : ${socket.id}`);
            });
        });

        res.socket.server.io = io; // Ajouter Socket.io au serveur
    } else {
        console.log("Socket.io est déjà initialisé");
    }

    res.end();
}