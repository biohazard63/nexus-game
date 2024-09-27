'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserIdByFirebaseId } from '@/lib/actions/userActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createRating } from '@/lib/actions/ratingActions';
import { getUserById } from '@/server/user/getUserAction';

export default function UserProfilePage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const router = useRouter();

    // Déplacer la fonction loadUser en dehors du useEffect
    const loadUser = async () => {
        try {
            const userData = await getUserById(parseInt(params.id));
            setUser(userData);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement du profil utilisateur:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fonction pour récupérer l'ID de l'utilisateur connecté via Firebase
        const loadCurrentUser = async () => {
            const firebaseId = sessionStorage.getItem('userId');
            if (firebaseId) {
                const userId = await getUserIdByFirebaseId(firebaseId);
                if (userId) {
                    setCurrentUserId(userId);
                } else {
                    setError("Impossible de récupérer l'ID utilisateur.");
                }
            } else {
                setError("Aucun utilisateur Firebase trouvé.");
            }
        };

        // Charger les données une première fois
        loadUser();
        loadCurrentUser();

        // Mettre en place l'intervalle pour rafraîchir les évaluations
        const interval = setInterval(() => {
            loadUser();
        }, 5000); // Rafraîchir toutes les 5 secondes

        // Nettoyer l'intervalle lors du démontage du composant
        return () => clearInterval(interval);
    }, [params.id]);

    const handleRatingSubmit = async () => {
        if (!rating || !review) {
            setError('Veuillez donner une note et écrire un commentaire.');
            return;
        }

        if (!currentUserId) {
            setError("L'ID de l'utilisateur connecté est manquant.");
            return;
        }

        try {
            setError('');
            await createRating({
                senderId: currentUserId,
                receiverId: user.id,
                rating,
                review,
            });
            setSuccess('Votre évaluation a été envoyée.');
            setRating(0);
            setReview('');
            // Rafraîchir les données de l'utilisateur pour inclure la nouvelle évaluation
            await loadUser();
        } catch (error) {
            setError("Erreur lors de l'envoi de l'évaluation.");
        }
    };

    if (loading) {
        return <div className="text-white">Chargement du profil utilisateur...</div>;
    }

    if (!user) {
        return <div className="text-white">Utilisateur non trouvé.</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <Card className="bg-gray-900 w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-5xl text-center font-extrabold text-yellow-400 mb-4">
                        {user.username}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/3 flex justify-center">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32">
                            {user.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user.username} />
                            ) : (
                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left mt-4 md:mt-0 md:ml-12">
                        <p className="text-gray-300 mb-2">
                            Nom complet : {user.first_name} {user.last_name}
                        </p>
                        <p className="text-gray-300 mb-4">Bio : {user.bio || 'Aucune bio disponible'}</p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                            {/*<Button type="button" className="bg-blue-500 text-black w-full md:w-auto" onClick={() => console.log('Demande envoyée')}>
                  Ajouter en ami
                </Button>*/}
                            <Button onClick={() => router.back()} className="bg-yellow-500 text-black w-full md:w-auto">
                                Retour
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Système de notation */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4 w-full max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Évaluer cet utilisateur</h2>
                <div className="mb-4">
                    <label className="text-gray-300">Note :</label>
                    <div className="flex space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-gray-300">Commentaire :</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full p-2 mt-2 bg-gray-900 text-white rounded-md"
                        rows={4}
                        placeholder="Laissez un commentaire sur cet utilisateur"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <Button onClick={handleRatingSubmit} className="bg-blue-500 text-black">
                    Envoyer
                </Button>
            </div>

            {/* Liste des évaluations existantes */}
            <div className="p-4 rounded-lg shadow-lg mt-4 w-full max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Avis de cet utilisateur</h2>
                {user.ratingsReceived?.length > 0 ? (
                    user.ratingsReceived.map((rating: any) => (
                        <Card key={rating.id} className="mb-4 bg-gray-500">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">
                        {i < rating.rating ? '★' : '☆'}
                      </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm">Par {rating.sender.username}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">{rating.review}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-400">Aucun avis pour cet utilisateur.</p>
                )}
            </div>
        </div>
    );
}