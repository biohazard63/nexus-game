'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionById } from '@/lib/actions/sessionActions'; // Fonction pour récupérer la session par ID
import { getUserIdByFirebaseId } from '@/lib/actions/userActions'; // Fonction pour récupérer l'utilisateur connecté
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Composants Avatar
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link'; // Utilisé pour créer des liens vers les profils
import Chat from '@/components/Chat';

export default function SalonPage({ params }: { params: { id: string } }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null); // Stocker l'ID de l'utilisateur connecté
    const sessionId = parseInt(params.id);
    const router = useRouter();

    // Charger la session et l'utilisateur connecté
    useEffect(() => {
        const loadSession = async () => {
            try {
                const sessionData = await getSessionById(sessionId);
                setSession(sessionData);
            } catch (error) {
                console.error('Erreur lors du chargement de la session:', error);
            }
        };

        const loadCurrentUser = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (firebaseId) {
                    const userId = await getUserIdByFirebaseId(firebaseId);
                    setUserId(userId);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
            }
        };

        loadSession();
        loadCurrentUser();

        // Initialiser Socket.io en appelant l'API
        fetch('/api/socket');

        setLoading(false);
    }, [sessionId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement du salon...</div>;
    }

    if (!session) {
        return <div className="flex justify-center items-center h-screen">Session non trouvée.</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <Card className="bg-gray-800 shadow-lg rounded-lg mb-8">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-bold text-yellow-400">{session.game.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center">
                        <Image src={session.game.coverImage} alt={session.game.name} width={300} height={150} className="rounded-lg object-cover" />
                    </div>
                    <p className="text-gray-300 text-sm">{session.description}</p>

                    {/* Participants */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Participants</h2>
                        {session.participations?.length > 0 ? (
                            <div className="flex flex-wrap gap-6">
                                {session.participations.map((participation: any) => (
                                    <Card key={participation.id}
                                          className="bg-gray-600 p-4 rounded-lg shadow-md flex items-center space-x-4 w-full max-w-xs">
                                        <Avatar className="flex-shrink-0">
                                            {participation.user?.profilePicture ? (
                                                <AvatarImage src={participation.user.profilePicture}
                                                             alt={participation.user.username}/>
                                            ) : (
                                                <AvatarFallback>{participation.user?.username?.charAt(0)}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-grow">
                                            {/* Lien vers le profil de l'utilisateur */}
                                            <Link href={`/account/${participation.userId}`}>
                                                <p className="text-xl text-yellow-400 cursor-pointer hover:underline">
                                                    {participation.user?.username}
                                                </p>
                                            </Link>
                                            <p className="text-gray-300 text-sm">Statut: {participation.status || 'En attente'}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">Aucun participant pour l'instant.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Autres détails du salon (chat) */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Discussion du salon</h2>
                {/* Chat en direct avec intégration Socket.io */}
                {userId && <Chat sessionId={sessionId} userId={userId} />}
            </div>
        </div>
    );
}