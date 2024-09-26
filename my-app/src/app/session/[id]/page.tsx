'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {deleteSessionWithRelations, getSessionById} from '@/lib/actions/sessionActions';
import {createParticipation, removeParticipant, updateParticipantStatus} from '@/lib/actions/participationActions';
import { getUserIdByFirebaseId } from '@/lib/actions/userActions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import CommentInput from '@/components/CommentInput';

export default function SessionPage({ params }: { params: { id: string } }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null >(null);
    const [isHost, setIsHost] = useState(false);
    const [isParticipant, setIsParticipant] = useState<any>(false);
    const [userId, setUserId] = useState<number | null>(null);

    const router = useRouter();

    console.log('session', session);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (firebaseId) {
                    const userId = await getUserIdByFirebaseId(firebaseId);
                    setCurrentUserId(userId);

                    const sessionData = await getSessionById(parseInt(params.id));
                    setSession(sessionData);

                    if (sessionData?.hostId === userId) {
                        setIsHost(true);
                    }

                    const participant = sessionData?.participations.some((p: any) => p.userId === userId);
                    setIsParticipant(participant);

                    setLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors du chargement de la session:', error);
            }
        };

        loadSession();
    }, [params.id]);

    useEffect(() => {
        const firebaseId = sessionStorage.getItem('userId'); // Récupérer le firebaseId de sessionStorage

        if (firebaseId) {
            getUserIdByFirebaseId(firebaseId).then((id) => {
                setUserId(id); // Mettre à jour l'userId avec la valeur récupérée
            }).catch((error) => {
                console.error('Erreur lors de la récupération de l\'userId', error);
            });
        }
    }, []);

    useEffect(() => {
        // Fonction pour recharger la session et mettre à jour les commentaires
        const refreshComments = async () => {
            try {
                const sessionData = await getSessionById(parseInt(params.id)); // Recharger la session
                setSession((prevSession: any) => ({
                    ...prevSession,
                    comments: sessionData.comments, // Mettre à jour uniquement les commentaires
                }));
            } catch (error) {
                console.error('Erreur lors du rafraîchissement des commentaires:', error);
            }
        };

        // Démarrer le setInterval pour rafraîchir les commentaires toutes les 30 secondes
        const intervalId = setInterval(() => {
            refreshComments();
        }, 2000); // Rafraîchir toutes les 30 secondes

        // Nettoyage de l'intervalle lorsque le composant est démonté
        return () => {
            clearInterval(intervalId);
        };
    }, [params.id]); // Dépendance sur l'ID de la session

    const handleJoinSession = async () => {
        if (!userId) {
            console.error('User not found or not authenticated');
            return;
        }

        try {
            await createParticipation({
                sessionId: session.id,
                userId: userId,
                status: 'En attente' // Statut initial
            });
            console.log('Participation créée avec succès');
            router.push('/session/${session.id}'); // Redirection vers la page de la session
        } catch (error) {
            console.error('Erreur lors de la création de la participation', error);
        }
    };



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

    const handleRemoveParticipant = async (participationId: number) => {
        if (!isHost) return;
        setLoadingStatus(true);

        try {
            await removeParticipant(participationId);

            setSession((prevSession: any) => ({
                ...prevSession,
                participations: prevSession.participations.filter((p: any) => p.id !== participationId),
            }));
        } catch (error) {
            console.error('Erreur lors de la suppression du participant :', error);
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

    const handleLeaveSession = async () => {
        if (!currentUserId || !session) return;

        const participation = session.participations.find((p: any) => p.userId === currentUserId);
        if (!participation) return;

        try {
            setLoadingStatus(true);
            await removeParticipant(participation.id);

            // Mise à jour de la session locale après la suppression
            setSession((prevSession: any) => ({
                ...prevSession,
                participations: prevSession.participations.filter((p: any) => p.id !== participation.id),
            }));

            setIsParticipant(false); // Mettre à jour l'état
        } catch (error) {
            console.error('Erreur lors de la suppression de la participation:', error);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleDeleteSession = async () => {
        if (!session || !isHost) return;

        try {
            // Appel à la fonction backend pour supprimer la session et ses relations
            await deleteSessionWithRelations(session.id);
            router.push('/session'); // Redirection après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de la session :', error);
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
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">{session.title}</h1>
            <div className="mb-2">
                {isHost ? (
                    <div>
                        <Button onClick={() => router.push(`/session/${session.id}/salon`)} className="bg-green-500 text-black">
                            Démarrer la session
                        </Button>
                        {/*<Button onClick={() => console.log('Inviter des amis')} className="bg-blue-500 text-black ml-4">*/}
                        {/*    Inviter des amis*/}
                        {/*</Button>*/}
                        <Button onClick={() => router.push(`/session/edit/${session.id}`)} className="bg-yellow-500 text-black ml-4">
                            Modifier la session
                        </Button>
                        <Button onClick={handleDeleteSession} className="bg-red-600 text-white ml-4">
                            Supprimer la session
                        </Button>
                    </div>
                ) : isParticipant ? (
                    <div>
                        <Button onClick={() => router.push(`/session/${session.id}/salon`)} className="bg-green-500 text-black">
                            Rejoindre le salon
                        </Button>
                        <Button onClick={handleLeaveSession} className="bg-red-600 text-white ml-4" disabled={loadingStatus}>
                            Quitter la session
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Button onClick={handleJoinSession} className="bg-blue-500 text-black">
                            Rejoindre la session
                        </Button>
                    </div>
                )}
            </div>

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
                                        {session.game.categories.map((cat: any) => (
                                            <li key={cat.category.id} className="text-yellow-400">{cat.category.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-gray-400">Lieu : <span className="text-yellow-400">{session.location}</span></p>
                            <p className="text-gray-400">
                                Date : <span className="text-yellow-400">{new Date(session.startTime).toLocaleDateString()}</span> de <span className="text-yellow-400">{new Date(session.startTime).toLocaleTimeString()}</span> à <span className="text-yellow-400">{new Date(session.endTime).toLocaleTimeString()}</span>
                            </p>
                            <p className="text-gray-400 mt-4">Type de session : <span className="text-yellow-400">{session.type_session === 'PUBLIC' ? 'Public' : 'Privée'}</span></p>
                        </div>
                        {session.game.coverImage && (
                            <div className="md:w-1/2 md:pl-12 flex flex-col justify-center">
                                <Image src={session.game.coverImage} alt={session.game.name} width={300} height={300} className="rounded-lg shadow-lg" />
                                {/*<Button className="bg-yellow-500 text-black mt-4 w-fit">Règles du jeu</Button>*/}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-12">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">Participants</h2>
                {session.participations?.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {session.participations.map((participation: any) => (
                            <Card key={participation.id}
                                  className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 w-full max-w-xs">
                                <Avatar className="flex-shrink-0">
                                    {participation.user.profilePicture ? (
                                        <AvatarImage src={participation.user.profilePicture}
                                                     alt={participation.user.username}/>
                                    ) : (
                                        <AvatarFallback>{participation.user.username.charAt(0)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex-grow">
                                    {/* Lien vers le profil de l'utilisateur */}
                                    <Link href={`/account/${participation.userId}`}>
                                        <p className="text-xl text-yellow-400 cursor-pointer hover:underline">
                                            {participation.user.username}
                                        </p>
                                    </Link>
                                    <Badge className={getStatusBadgeColor(participation.status)}>
                                        {participation.status}
                                    </Badge>

                                    {participation.userId === currentUserId && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="mt-2 ml-4"
                                                        disabled={loadingStatus}>
                                                    Changer le statut
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(participation.id, 'Présent')}>Présent</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(participation.id, 'Absent')}>Absent</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(participation.id, 'En attente')}>En
                                                    attente</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    {isHost && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleRemoveParticipant(participation.id)}
                                            disabled={loadingStatus}
                                        >
                                            Supprimer
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun participant pour l&apos;instant.</p>
                )}
            </div>

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

            <div className="mt-12" style={{width: '65%'}}>
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">Commentaires</h2>
                {session.comments?.length > 0 ? (
                    <div className="space-y-4">
                        {session.comments.map((comment: any) => (
                            <div key={comment.id}
                                 className={`flex ${comment.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`flex items-start space-x-4 ${comment.userId === currentUserId ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="flex-shrink-0">
                                        {comment.user.profilePicture ? (
                                            <AvatarImage src={comment.user.profilePicture} alt={comment.user.username}/>
                                        ) : (
                                            <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <Card
                                        className={`p-4 rounded-lg shadow-md w-fit max-w-xs ${comment.userId === currentUserId ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'}`}>
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

                {isParticipant && currentUserId !== null && (
                    <div className="mt-6">
                        <CommentInput sessionId={session.id} userId={currentUserId} />
                    </div>
                )}
            </div>
        </div>
    );
}