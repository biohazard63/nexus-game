'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {  getUserIdByFirebaseId } from '@/lib/actions/userActions'; // Import de la fonction
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createRating } from '@/lib/actions/ratingActions';
import {getUserById} from "@/server/user/getUserAction"; // Action pour créer un rating

export default function UserProfilePage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0); // État pour les étoiles
    const [review, setReview] = useState(''); // État pour le commentaire
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null); // Stocke l'ID de l'utilisateur connecté
    const router = useRouter();

    console.log('page du user', user);

    useEffect(() => {
        // Fonction pour charger les données de l'utilisateur
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

        // Fonction pour récupérer l'ID de l'utilisateur connecté via Firebase
        const loadCurrentUser = async () => {
            const firebaseId = sessionStorage.getItem('userId'); // Assure-toi que cet ID est stocké dans sessionStorage ou une autre source
            if (firebaseId) {
                const userId = await getUserIdByFirebaseId(firebaseId);
                if (userId) {
                    setCurrentUserId(userId); // Stocke l'ID utilisateur récupéré
                } else {
                    setError("Impossible de récupérer l'ID utilisateur.");
                }
            } else {
                setError("Aucun utilisateur Firebase trouvé.");
            }
        };

        loadUser();
        loadCurrentUser(); // Récupère l'utilisateur connecté
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
                senderId: currentUserId, // Utilisateur connecté (expéditeur)
                receiverId: user.id, // Utilisateur sur la page de profil (destinataire)
                rating,
                review,
            });
            setSuccess('Votre évaluation a été envoyée.');
            setRating(0);
            setReview('');
        } catch (error) {
            setError('Erreur lors de l\'envoi de l\'évaluation.');
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
            <Card className="bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-5xl text-center font-extrabold text-yellow-400 mb-4">
                        {user.username}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/3 flex justify-center">
                        <Avatar className="w-32 h-32">
                            {user.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user.username} />
                            ) : (
                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left mt-4 md:mt-0 md:ml-12">
                        <p className="text-gray-300 mb-2">Nom complet : {user.first_name} {user.last_name}</p>
                        <p className="text-gray-300 mb-4">Bio : {user.bio || "Aucune bio disponible"}</p>
                        <Button type={'button'} className={'bg-blue-500 text-black'} onClick={() => console.log('Demmande envoyer')}>
                            ajouter en ami
                        </Button>
                        <Button onClick={() => router.back()} className="bg-yellow-500 text-black ml-4">
                            Retour
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Système de notation */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
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
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4 w-fit">
                <h2 className="text-lg font-semibold mb-4">Avis de cet utilisateur</h2>
                {user.ratingsReceived?.length > 0 ? (
                    user.ratingsReceived.map((rating: any) => (
                        <div key={rating.id} className="mb-4">
                            <div className="flex space-x-1 w-fit">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-yellow-400 text-xl`}>
                            {i < rating.rating ? '★' : '☆'}
                        </span>
                                ))}
                            </div>
                            <p className="text-gray-300 mt-2">{rating.review}</p>
                            <p className="text-gray-500 text-sm">Expéditeur : {rating.sender.username}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">Aucun avis pour cet utilisateur.</p>
                )}
            </div>
        </div>
    );
}