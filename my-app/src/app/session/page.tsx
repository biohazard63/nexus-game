'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { getCreatedSessions, getParticipatingSessions } from '@/lib/actions/sessionActions';
import Image from "next/image"; // Modifier ici pour inclure getParticipatingSessions
import { Badge } from '@/components/ui/badge';

export default function UserSessionsPage() {
    const [createdSessions, setCreatedSessions] = useState<any[]>([]);
    const [participatingSessions, setParticipatingSessions] = useState<any[]>([]); // Remplacer invitedSessions par participatingSessions
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    console.log(participatingSessions);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (!firebaseId) throw new Error('Aucun utilisateur trouvé dans sessionStorage');

                const created = await getCreatedSessions(firebaseId);
                setCreatedSessions(created);

                const participating = await getParticipatingSessions(firebaseId); // Utiliser getParticipatingSessions
                setParticipatingSessions(participating);

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

    const handleSearchSessions = () => {
        router.push('/session-search');

    }

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

            <div className="flex justify-center mb-8">
                <Button
                    onClick={handleCreateSession}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Créer une nouvelle session
                </Button>
                <Button onClick={handleSearchSessions} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold ml-4 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Rechercher des sessions
                </Button>
            </div>

            {/* Sessions créées par l'utilisateur */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sessions que j&apos;ai créées</h2>
                {createdSessions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {createdSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="bg-gray-800 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => handleViewSession(session.id)}
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-yellow-400">{session.game.name}</CardTitle>
                                    <Badge variant="outline" className="text-white border-yellow-400 text-xs p-1 ml-2">
                                        {session.type_session} {/* Indique le type de session si pertinent */}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-center">
                                        <Image
                                            src={session.game.coverImage}
                                            alt={session.game.name}
                                            width={300}
                                            height={150}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <p className="text-gray-300 text-sm">{session.description}</p>

                                    {/* Hôte et Participants sur la même ligne */}
                                    <div className="flex items-center justify-between space-x-4">
                                        {/* Hôte */}
                                        <Badge variant="outline"
                                               className="text-white border-green-500 bg-green-500 text-xs p-1">
                                            Hôte: {session.host.username}
                                        </Badge>

                                        {/* Participants */}
                                        <Badge variant="outline"
                                               className="text-white border-blue-500 bg-blue-500 text-xs p-1">
                                            Participants: {session.participations.length}
                                        </Badge>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Vous n&apos;avez pas encore créé de sessions.</p>
                )}
            </section>

            {/* Sessions où l'utilisateur est participant */}
            <section>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sessions où je participe</h2>
                {participatingSessions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {participatingSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="bg-gray-800 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => handleViewSession(session.id)}
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-yellow-400">{session.game.name}</CardTitle>
                                    <Badge variant="outline" className="text-white border-yellow-400 text-xs p-1 ml-2">
                                        {session.type_session} {/* Indique le type de session si pertinent */}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-center">
                                        <Image
                                            src={session.game.coverImage}
                                            alt={session.game.name}
                                            width={300}
                                            height={150}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <p className="text-gray-300 text-sm">{session.description}</p>

                                    {/* Hôte et Participants sur la même ligne */}
                                    <div className="flex items-center justify-between space-x-4">
                                        {/* Hôte */}
                                        <Badge variant="outline"
                                               className="text-white border-green-500 bg-green-500 text-xs p-1">
                                            Hôte: {session.host.username}
                                        </Badge>

                                        {/* Participants */}
                                        <Badge variant="outline"
                                               className="text-white border-blue-500 bg-blue-500 text-xs p-1">
                                            Participants: {session.participations.length}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Vous ne participez à aucune session.</p>
                )}
            </section>
        </div>
    );
}