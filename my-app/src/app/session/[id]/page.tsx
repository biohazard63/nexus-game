'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getSessionById } from '@/lib/actions/sessionActions';
import { updateParticipantStatus } from '@/lib/actions/participationActions';
import { getUserIdByFirebaseId } from '@/lib/actions/userActions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import CommentInput from '@/components/CommentInput';

export default function SessionPage({ params }: { params: { id: string } }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isHost, setIsHost] = useState(false);
    const [isParticipant, setIsParticipant] = useState(false);
    const router = useRouter();

    console.log(session);
    console.log('user connected', currentUserId);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (firebaseId) {
                    const userId = await getUserIdByFirebaseId(firebaseId);
                    setCurrentUserId(userId);
                }

                const sessionData = await getSessionById(parseInt(params.id));
                setSession(sessionData);

                if (sessionData.hostId === currentUserId) {
                    setIsHost(true);
                }

                const participant = sessionData.participations.some((p: any) => p.userId === currentUserId);
                setIsParticipant(participant);

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement de la session:', error);
            }
        };

        loadSession();
    }, [params.id, currentUserId]);

    const handleStatusChange = async (participationId: number, newStatus: string) => {
        setLoadingStatus(true);
        try {
            await updateParticipantStatus(participationId, newStatus);
            setSession((prevSession: any) => ({
                ...prevSession,
                participations: prevSession.participations.map((p: any) =>
                    p.id === participationId ? { ...p, status: newStatus } : p
                ),
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
        setLoadingStatus(false);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'présent':
                return 'bg-green-500';
            case 'absent':
                return 'bg-red-500';
            case 'en attente':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    if (loading) {
        return <div className="text-white">Chargement de la session...</div>;
    }

    if (!session) {
        return <div className="text-white">Aucune session trouvée.</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">Session Name</h1>
            {/* Actions basées sur le rôle de l'utilisateur */}
            <div className="mb-2">
                {isHost ? (
                    <div>
                        <Button onClick={() => console.log('Démarrer le jeux')} className="bg-green-500 text-black">
                            Démarrer la session
                        </Button>
                        <Button onClick={() => console.log('Inviter des amis')} className="bg-blue-500 text-black ml-4">
                            Inviter des amis
                        </Button>
                        <Button onClick={() => router.push(`/session/edit/${session.id}`)}
                                className="bg-yellow-500 text-black ml-4">
                            Modifier la session
                        </Button>
                        <Button onClick={() => console.log('Supprimer la session')}
                                className="bg-red-600 text-white ml-4">
                            Supprimer la session
                        </Button>
                    </div>
                ) : isParticipant ? (
                    <div>
                        <Button onClick={() => console.log('Rejoindre le salon ')}
                                className="bg-green-500 text-black">
                            Rejoindre le salon
                        </Button>
                        <Button onClick={() => console.log('Quitter la session')} className="bg-red-600 text-white">
                            Quitter la session
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Button onClick={() => console.log('Demander à participer')} className="bg-blue-500 text-black">
                            Demander à participer
                        </Button>
                    </div>
                )}
            </div>

            {/* Section du jeu et informations principales */}
            <Card className="bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-5xl text-center font-extrabold text-yellow-400 mb-4">
                        {session.game.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="md:w-1/2">
                            <p className="text-gray-300 mb-6">{session.game.description}</p>
                            <p className="text-gray-400 mb-2">Type de jeu : <span className="text-yellow-400">{session.game.type}</span></p>
                            {session.game.player_max && (
                                <p className="text-gray-400 mb-2">Joueurs maximum : <span className="text-yellow-400">{session.game.player_max}</span></p>
                            )}
                            {session.game.categories?.length > 0 && (
                                <div className="text-gray-400 mb-2">
                                    Catégories :
                                    <ul className="list-disc list-inside">
                                        {session.game.categories.map((category: any) => (
                                            <li key={category.id} className="text-yellow-400">{category.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-gray-400">Lieu : <span className="text-yellow-400">{session.location}</span></p>
                            <p className="text-gray-400">
                                Date : <span className="text-yellow-400">{new Date(session.startTime).toLocaleDateString()} </span>
                                de <span className="text-yellow-400">{new Date(session.startTime).toLocaleTimeString()} </span>
                                à <span className="text-yellow-400">{new Date(session.endTime).toLocaleTimeString()} </span>
                            </p>
                            <p className="text-gray-400 mt-4">Type de session : <span className="text-yellow-400"> {session.type_session === 'PUBLIC' ? 'Public' : 'Privée'}</span></p>
                        </div>
                        {session.game.coverImage && (
                            <div className="md:w-1/2 md:pl-12 flex flex-col justify-center">
                                <Image src={session.game.coverImage} alt={session.game.name} width={300} height={300} className="rounded-lg shadow-lg "/>
                                <Button className="bg-yellow-500 text-black mt-4 w-fit">Règles du jeu</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section des participants */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">Participants</h2>
                {session.participations?.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {session.participations.map((participation: any) => (
                            <Card key={participation.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 w-full max-w-xs">
                                <Avatar className="flex-shrink-0">
                                    {participation.user.profilePicture ? (
                                        <AvatarImage src={participation.user.profilePicture} alt={participation.user.username} />
                                    ) : (
                                        <AvatarFallback>N/A</AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="text-xl text-yellow-400">{participation.user.username}</p>
                                    <Badge className={getStatusBadgeColor(participation.status)}>
                                        {participation.status}
                                    </Badge>
                                    {participation.userId === currentUserId && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="ml-2 text-yellow-400" disabled={loadingStatus}>
                                                    Changer
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleStatusChange(participation.id, 'Présent')}>Présent</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(participation.id, 'Absent')}>Absent</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(participation.id, 'En attente')}>En attente</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun participant pour l'instant.</p>
                )}
            </div>

            {/* Section des personnages */}
            {session.characters && session.characters.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-4">Personnages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {session.characters.map((character: any) => (
                            <Card key={character.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                <p className="text-xl text-yellow-400">{character.name}</p>
                                <p className="text-gray-400">Classe : {character.class}</p>
                                <p className="text-gray-400">Niveau : {character.level}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Section des commentaires */}
            <div className="mt-12" style={{ width: '65%' }}>
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">Commentaires</h2>
                {session.comments?.length > 0 ? (
                    <div className="space-y-4">
                        {session.comments.map((comment: any) => (
                            <div key={comment.id} className={`flex ${comment.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start space-x-4 ${comment.userId === currentUserId ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="flex-shrink-0">
                                        {comment.user.profilePicture ? (
                                            <AvatarImage src={comment.user.profilePicture} alt={comment.user.username} />
                                        ) : (
                                            <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <Card className={`p-4 rounded-lg shadow-md w-fit max-w-xs ${comment.userId === currentUserId ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'}`}>
                                        <p>{comment.content}</p>
                                        <p className="text-xs text-gray-400 mt-2">Par {comment.user.username} - {new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun commentaire pour cette session.</p>
                )}

                {isParticipant && (
                    <div className="mt-6">
                        <CommentInput sessionId={session.id} userId={currentUserId} />
                    </div>
                )}
            </div>
        </div>
    );
}