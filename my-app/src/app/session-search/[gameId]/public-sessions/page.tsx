'use client';

import React, { useEffect, useState } from 'react';
import { getPublicSessionsByGameId } from '@/lib/actions/sessionActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

export default function GamePublicSessionsPage({ params }: { params: { gameId: string } }) {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Récupérer les sessions publiques pour un jeu spécifique
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const result = await getPublicSessionsByGameId(params.gameId); // Utiliser l'ID du jeu depuis les paramètres
                setSessions(result);
            } catch (error) {
                console.error('Erreur lors de la récupération des sessions :', error);
                setError('Impossible de récupérer les sessions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [params.gameId]);

    if (loading) {
        return <p>Chargement des sessions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-yellow-400">Sessions Publiques pour le jeu</h1>

            {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {sessions.map((session) => (
                        <Card key={session.id} className="bg-gray-800 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-yellow-400">{session.title}</CardTitle>
                                <CardDescription className="text-gray-300">Jeu : {session.game.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 mb-4">Hôte : {session.host.username}</p>
                                {session.game.coverImage && (
                                    <Image src={session.game.coverImage} alt={session.game.name} width={300} height={200} />
                                )}
                                <p className="text-gray-400 mb-4">Date de début : {new Date(session.startTime).toLocaleDateString()}</p>
                                <p className="text-gray-400 mb-4">Description : {session.description}</p>
                                <p className="text-gray-400 mb-4">Lieu : {session.location}</p>
                                <p className="text-gray-400 mb-4">Participants : {session.participations ? session.participations.length : 0}</p>

                                <Link href={`/session/${session.id}`}>
                                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black w-full">Demander à rejoindre</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-xl text-gray-300">Aucune session publique trouvée pour ce jeu.</p>
            )}
        </div>
    );
}