/**
 * UserGamesPage component
 *
 * This component is responsible for displaying a list of games, allowing users to filter by type and category,
 * and add games to their wishlist. It fetches games, categories, and the user's wishlist from the server.
 *
 * @component
 * @example
 * return (
 *   <UserGamesPage />
 * )
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getGameById } from '@/lib/actions/gameActions';
import { getUserIdByFirebaseId } from '@/lib/actions/userActions';
import { getWishlist } from '@/lib/actions/wishlistActions'; // Action pour récupérer la wishlist
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { GameWithRelations } from '@/type/gameWithRelation';
import { Button } from '@/components/ui/button';
import { addToWishlist } from "@/lib/actions/wishlistActions";
import Link from "next/link";

export default function GameDetailsPage() {
    const [game, setGame] = useState<GameWithRelations | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isInWishlist, setIsInWishlist] = useState<boolean>(false); // État pour vérifier si le jeu est déjà dans la wishlist
    const { id } = useParams();
    const router = useRouter();

    const checkIfInWishlist = async () => {
        if (userId) {
            const wishlist = await getWishlist(userId);
            const gameId = Array.isArray(id) ? id[0] : id; // Gérer les cas où id est un tableau
            const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.gameId === parseInt(gameId, 10));
            setIsInWishlist(isInWishlist);
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const firebaseId = sessionStorage.getItem('userId');
            if (firebaseId) {
                const userId = await getUserIdByFirebaseId(firebaseId);
                setUserId(userId);
            }
        };

        const fetchGame = async () => {
            try {
                if (typeof id === 'string') {
                    const fetchedGame = await getGameById(parseInt(id, 10));
                    if (fetchedGame) {
                        setGame(fetchedGame);
                    } else {
                        setError('Jeu non trouvé.');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du jeu :', error);
                setError('Erreur lors de la récupération du jeu.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
        if (id) {
            fetchGame();
        }
    }, [id, userId]);

    useEffect(() => {
        if (userId) {
            checkIfInWishlist(); // Vérifier si le jeu est dans la wishlist après avoir obtenu l'userId
        }
    }, [userId]);

    const handleAddToWishlist = async () => {
        if (userId && game?.id) {
            try {
                await addToWishlist(userId, game.id);
                setIsInWishlist(true); // Mettre à jour l'état une fois que le jeu est ajouté
                alert('Jeu ajouté à votre wishlist avec succès !');
            } catch (error) {
                console.error('Erreur lors de l\'ajout à la wishlist :', error);
                alert('Impossible d\'ajouter le jeu à la wishlist.');
            }
        } else {
            alert('Utilisateur non identifié ou jeu introuvable.');
        }
    };

    const handleCreateSession = () => {
        router.push('/session/create');
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white md:p-12">
            <main className="flex flex-1 justify-center">
                <Card className="bg-gray-800 shadow-2xl transform transition duration-500 hover:scale-105 rounded-lg max-w-6xl w-full p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Image à gauche */}
                        <div className="w-full md:w-1/2">
                            {game?.coverImage && (
                                <Image
                                    src={game.coverImage}
                                    alt={game.name}
                                    width={500}
                                    height={300}
                                    className="rounded-lg object-cover shadow-lg transition duration-300 hover:shadow-xl"
                                    quality={90}
                                />
                            )}
                        </div>

                        {/* Texte à droite */}
                        <div className="flex flex-col w-full md:w-1/2 space-y-6">
                            <CardHeader className="p-0">
                                <CardTitle className="text-yellow-400 text-4xl font-extrabold">
                                    {game?.name}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap gap-2 mt-4">
                                    {game?.categories && game.categories.length > 0 ? (
                                        game.categories.map((categoryRelation: any) => (
                                            <span
                                                key={categoryRelation.category.id}
                                                className="text-white bg-purple-600 px-3 py-1 rounded-lg">
                                                {categoryRelation.category.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Aucune catégorie</span>
                                    )}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-0">
                                <p className="text-lg text-white mb-4 leading-relaxed">{game?.description}</p>
                                <div className="flex justify-between text-center">
                                    <div className="text-md text-gray-300">
                                        <strong>Type :</strong> {game?.type}
                                    </div>
                                    {game?.player_max && (
                                        <div className="text-md text-gray-300">
                                            <strong>Joueurs max :</strong> {game.player_max}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            {/* Boutons d'action */}
                            <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-y-0 md:space-x-4">
                                <Button
                                    onClick={handleAddToWishlist}
                                    className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 w-full md:w-auto ${
                                        isInWishlist
                                            ? 'bg-green-500 text-black'
                                            : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                                    }`}
                                    disabled={isInWishlist}
                                >
                                    {isInWishlist ? 'Ajouté à la wishlist' : 'Ajouter à ma wishlist'}
                                </Button>
                                <Link href={`/session-search/${game?.id}/public-sessions`} passHref>
                                    <Button className="bg-yellow-600 text-white hover:bg-purple-700 flex items-center w-full md:w-auto">
                                        Trouver une session publique <span className="ml-2">🎮</span>
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleCreateSession}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
                                >
                                    Créer une session
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}