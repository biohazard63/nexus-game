'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { getCreatedSessions, getInvitedSessions } from '@/lib/actions/sessionActions';
import { Badge } from '@/components/ui/badge';
import Image from "next/image"; // Pour afficher les images

export default function UserSessionsPage() {
    const [createdSessions, setCreatedSessions] = useState<any[]>([]);
    const [invitedSessions, setInvitedSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (!firebaseId) throw new Error('Aucun utilisateur trouvé dans sessionStorage');

                const created = await getCreatedSessions(firebaseId);
                setCreatedSessions(created);

                const invited = await getInvitedSessions(firebaseId);
                setInvitedSessions(invited);

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des sessions:', error);
                setLoading(false);
            }
        };

        loadSessions();
    }, []);

    const handleCreateSession = () => {
        router.push('/session/create');
    };

    const handleViewSession = (sessionId: number) => {
        router.push(`/session/${sessionId}`); // Rediriger vers la page de la session
    };

    const handleDeleteSession = (sessionId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        // Logique pour supprimer la session
        console.log('Supprimer la session', sessionId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-white ml-4">Chargement des sessions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Mes Sessions</h1>

            {/* Bouton pour créer une session */}
            <div className="flex justify-center mb-8">
                <Button
                    onClick={handleCreateSession}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Créer une nouvelle session
                </Button>
            </div>

            {/* Sessions créées par l'utilisateur */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sessions que j'ai créées</h2>
                {createdSessions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {createdSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="bg-gray-800 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => handleViewSession(session.id)} // Navigation au clic
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-yellow-400">{session.game.name}</CardTitle>
                                    <Badge variant="secondary" className="bg-purple-600 text-white">Créateur</Badge>
                                </CardHeader>
                                <CardContent>
                                    {session.game.coverImage && (
                                        <Image src={session.game.coverImage} alt={session.game.name} width={200} height={200} />
                                    )}
                                    <p className="text-gray-300 mb-2">{session.description}</p>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <p>Date : {new Date(session.startTime).toLocaleDateString()}</p>
                                        <p>Joueurs : {session.participations.length}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <Link href={`/session/edit/${session.id}`}>
                                            <Button
                                                variant="outline"
                                                className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"
                                                onClick={(e) => e.stopPropagation()} // Empêcher la navigation de la carte
                                            >
                                                Modifier
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={(e) => handleDeleteSession(session.id, e)} // Suppression
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Vous n'avez pas encore créé de sessions.</p>
                )}
            </section>

            {/* Sessions où l'utilisateur est invité */}
            <section>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sessions où je suis invité</h2>
                {invitedSessions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {invitedSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="bg-gray-800 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => handleViewSession(session.id)} // Navigation au clic
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-yellow-400">{session.game.name}</CardTitle>
                                    <Badge variant="secondary" className="bg-green-600 text-white">Invité</Badge>
                                </CardHeader>
                                <CardContent>
                                    {session.game.coverImage && (
                                        <Image src={session.game.coverImage} alt={session.game.name} width={200} height={200} />
                                    )}
                                    <p className="text-gray-300 mb-2">{session.description}</p>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <p>Date : {new Date(session.startTime).toLocaleDateString()}</p>
                                        <p>Joueurs : {session.participations.length}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <Button
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('Quitter la session');
                                            }}
                                        >
                                            Quitter
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Vous n'êtes invité à aucune session pour l'instant.</p>
                )}
            </section>
        </div>
    );
}