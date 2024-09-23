// src/server/socket.ts

import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

interface SocketServer extends NetServer {
    io?: SocketIOServer;
}

export default function initSocketServer(res: NextApiResponse) {
    const server: SocketServer = res.socket?.server as any;

    if (!server.io) {
        console.log('Socket.io server is initializing...');

        const io = new SocketIOServer(server, {
            path: '/api/socket',
            cors: {
                origin: '*',
            },
        });

        // Configure the WebSocket events
        io.on('connection', (socket) => {
            console.log('New client connected', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
            });

            socket.on('chatMessage', (message) => {
                console.log('Received message: ', message);
                io.emit('chatMessage', message); // Broadcast the message to all clients
            });
        });

        server.io = io;
    }

    res.end();
}