'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getGameById } from '@/lib/actions/gameActions'; // Action pour obtenir un jeu spécifique
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from "@/components/AdminHeader";
import Image from "next/image";

export default function GameDetailsPage() {
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { id } = useParams() as { id: string | string[] }; // Récupérer l'ID du jeu depuis l'URL

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const fetchedGame = await getGameById(parseInt(Array.isArray(id) ? id[0] : id, 10)); // Obtenir les détails du jeu
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
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <AdminHeader />

            <main className="flex flex-1 flex-col gap-4 p-6 md:p-12">
                <Card className="bg-gray-800 shadow-lg shadow-purple-800/50">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 text-4xl font-extrabold">{game.name}</CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                            {/* Gestion des catégories multiples */}
                            Catégories :{' '}
                            {game.categories && game.categories.length > 0 ? (
                                game.categories.map((category: any) => (
                                    <span key={category.id} className="text-white bg-purple-600 px-2 py-1 rounded-lg mr-2">
                                        {category.name}
                                    </span>
                                ))
                            ) : (
                                'Aucune catégorie'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-white mb-4">{game.description}</p>
                        <p className="text-md text-gray-300 mb-2">Type : {game.type}</p>
                        {game.player_max && (
                            <p className="text-md text-gray-300 mb-4">Nombre de joueurs maximum : {game.player_max}</p>
                        )}
                        {game.coverImage && (
                            <div className="mb-6">
                                <Image src={game.coverImage} alt={game.name} width={200} height={200} className="w-full h-auto rounded-lg shadow-md" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}