'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getGameById } from '@/lib/actions/gameActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { GameWithRelations } from '@/type/gameWithRelation';
import { Button } from '@/components/ui/button';

export default function GameDetailsPage() {
    const [game, setGame] = useState<GameWithRelations | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams(); // Récupérer l'ID du jeu depuis l'URL

    useEffect(() => {
        const fetchGame = async () => {
            try {
                if (typeof id === 'string') {
                    const fetchedGame = await getGameById(parseInt(id, 10)); // Obtenir les détails du jeu
                    if (fetchedGame) {
                        setGame(fetchedGame); // Mettre à jour l'état si le jeu existe
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
                                        game.categories.map((category: any) => (
                                            <span
                                                key={category.id}
                                                className="text-white bg-purple-600 px-3 py-1 rounded-lg">
                                            {category.name}
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
                            <div className="mt-6 flex justify-center gap-4">
                                <Button
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-bold hover:from-purple-700 hover:to-purple-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                    Ajouter à ma collection
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                    Trouver une session
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
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