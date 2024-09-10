'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGames, createGame, updateGame, deleteGame } from '@/lib/actions/gameActions';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminHeader from "@/components/AdminHeader";
import GameEditForm from "@/components/GameEditForm";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link'; // Importer le composant Link pour la navigation

export default function GamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingGame, setEditingGame] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesList = await getGames(); // Récupérer les jeux depuis la base de données
                setGames(gamesList);
            } catch (error) {
                setError('Erreur lors de la récupération des jeux.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleDeleteGame = async (gameId: number) => {
        try {
            await deleteGame(gameId); // Supprimer le jeu de la base de données
            setGames(games.filter((game) => game.id !== gameId)); // Mise à jour de l'état
        } catch (error) {
            setError('Erreur lors de la suppression du jeu.');
        }
    };

    const handleGameUpdated = (updatedGame: any) => {
        setGames(games.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
        setEditingGame(null);
    };

    const handleAddGame = async () => {
        try {
            const newGame = await createGame({
                name: 'Nouveau Jeu',
                type: 'VIDEO_GAME',
                description: 'Description du jeu',
            });
            setGames([...games, newGame]);
        } catch (error) {
            setError('Erreur lors de l\'ajout du jeu.');
        }
    };

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
                        <CardTitle className="text-yellow-400 text-2xl font-extrabold">Gestion des jeux</CardTitle>
                        <CardDescription className="text-gray-400">
                            Ajouter, modifier ou supprimer des jeux.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAddGame} className="mb-4 bg-green-600 hover:bg-green-500 text-white">
                            Ajouter un jeu
                        </Button>
                        <Table className="table-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-yellow-400">Nom</TableHead>
                                    <TableHead className="text-yellow-400">Description</TableHead>
                                    <TableHead className="text-yellow-400">Type</TableHead>
                                    <TableHead className="text-yellow-400">Catégorie</TableHead>
                                    <TableHead className="text-yellow-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {games.map((game) => (
                                    <TableRow key={game.id} className="hover:bg-purple-700/30">
                                        <TableCell className="text-white">
                                            <Link href={`/admin/game/${game.id}`}>
                                                <span className="text-yellow-400 hover:underline cursor-pointer">{game.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-white">{game.description}</TableCell>
                                        <TableCell className="text-gray-300">{game.type}</TableCell>
                                        <TableCell className="text-gray-300">{game.category?.name}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="mr-4 bg-blue-600 hover:bg-blue-500 text-white">
                                                        Modifier
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-gray-800 text-white rounded-lg p-6 max-w-lg mx-auto">
                                                    <GameEditForm
                                                        gameId={game.id}
                                                        onUpdate={handleGameUpdated}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-500 text-white"
                                                onClick={() => handleDeleteGame(game.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}