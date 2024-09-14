'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getGameById } from '@/lib/actions/gameActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function GameDetailsPage() {
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams(); // Récupérer l'ID du jeu depuis l'URL

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const fetchedGame = await getGameById(parseInt(id, 10)); // Obtenir les détails du jeu
                setGame(fetchedGame);
            } catch (error) {
                console.error('Erreur lors de la récupération du jeu :', error);
                setError('Erreur lors de la récupération du jeu.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGame();
        }
    }, [id]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex  w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white  md:p-12">
            <main className="flex flex-1  justify-center">
                <Card className="bg-gray-800 shadow-2xl transform transition duration-500 hover:scale-105 rounded-lg max-w-6xl w-full p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Image à gauche */}
                        <div className="flex-shrink-0 w-full md:w-1/2">
                            {game.coverImage && (
                                <Image
                                    src={game.coverImage}
                                    alt={game.name}
                                    width={500}
                                    height={300}
                                    className="rounded-lg object-cover shadow-lg"
                                    quality={90}
                                />
                            )}
                        </div>

                        {/* Texte à droite */}
                        <div className="flex flex-col w-full md:w-1/2">
                            <CardHeader className="p-0">
                                <CardTitle className="text-yellow-400 text-4xl font-extrabold">
                                    {game.name}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap gap-2 mt-4">
                                    {game.categories && game.categories.length > 0 ? (
                                        game.categories.map((category: any) => (
                                            <span key={category.id} className="text-white bg-purple-600 px-3 py-1 rounded-lg">
                                                {category.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Aucune catégorie</span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                                <p className="text-lg text-white mb-4">{game.description}</p>
                                <div className="flex justify-between text-center">
                                    <div className="text-md text-gray-300">
                                        <strong>Type :</strong> {game.type}
                                    </div>
                                    {game.player_max && (
                                        <div className="text-md text-gray-300">
                                            <strong>Joueurs max :</strong> {game.player_max}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            {/* Boutons d'action */}
                            <div className="mt-6 flex justify-center gap-4">
                                <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold transform hover:scale-110 transition-transform">
                                    Jouer Maintenant
                                </button>
                                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold transform hover:scale-110 transition-transform">
                                    Ajouter à ma collection
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}