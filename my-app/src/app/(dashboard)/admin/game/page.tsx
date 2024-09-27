'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getGames,
    createGame,
    updateGame,
    deleteGame,
} from '@/lib/actions/gameActions';
import { getCategories } from '@/lib/actions/categoryActions';
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
import AdminHeader from '@/components/AdminHeader';
import GameEditForm from '@/components/GameEditForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import { Pagination } from '@/components/Pagination';

export default function GamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [filteredGames, setFilteredGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingGame, setEditingGame] = useState<any>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [gameTypeFilter, setGameTypeFilter] = useState<string>('ALL');
    const [categories, setCategories] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchGamesAndCategories = async () => {
            try {
                const gamesList = await getGames();
                const categoriesList = await getCategories();
                setGames(gamesList);
                setFilteredGames(gamesList);
                setCategories(categoriesList);
            } catch (error) {
                setError('Erreur lors de la récupération des jeux et des catégories.');
            } finally {
                setLoading(false);
            }
        };

        fetchGamesAndCategories();
    }, []);

    // Gérer la suppression d'un jeu
    const handleDeleteGame = async (gameId: number) => {
        try {
            await deleteGame(gameId);
            const updatedGames = games.filter((game) => game.id !== gameId);
            setGames(updatedGames);
            setFilteredGames(updatedGames);

            // Ajuster la page actuelle si nécessaire
            const totalPages = Math.ceil(updatedGames.length / itemsPerPage);
            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
        } catch (error) {
            setError('Erreur lors de la suppression du jeu.');
        }
    };

    // Mettre à jour un jeu
    const handleGameUpdated = (updatedGame: any) => {
        setGames(games.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
        setEditingGame(null);
    };

    // Ajouter un jeu
    const handleAddGame = async () => {
        try {
            const newGame = await createGame({
                name: 'Nouveau Jeu',
                type: 'VIDEO_GAME',
                description: 'Description du jeu',
                player_max: 0,
            });
            setGames([...games, newGame]);
            setFilteredGames([...filteredGames, newGame]);
        } catch (error) {
            setError("Erreur lors de l'ajout du jeu.");
        }
    };

    // Filtrer les jeux en fonction de la catégorie et du type de jeu sélectionnés
    const handleFilterChange = (
        selectedCategory: string,
        selectedGameType: string
    ) => {
        let filtered = games;

        // Filtrer par catégorie
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter((game) =>
                game.categories?.some((categoryRelation: any) =>
                    categoryRelation.category.name === selectedCategory
                )
            );
        }

        // Filtrer par type de jeu
        if (selectedGameType !== 'ALL') {
            filtered = filtered.filter((game) => game.type === selectedGameType);
        }

        setFilteredGames(filtered);
        setCurrentPage(1); // Réinitialiser la page actuelle
    };

    // Gérer les changements du filtre de catégorie
    const handleCategoryFilterChange = (selectedCategory: string) => {
        setCategoryFilter(selectedCategory);
        handleFilterChange(selectedCategory, gameTypeFilter);
    };

    // Gérer les changements du filtre de type de jeu
    const handleGameTypeFilterChange = (selectedGameType: string) => {
        setGameTypeFilter(selectedGameType);
        handleFilterChange(categoryFilter, selectedGameType);
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Calculer les jeux à afficher pour la page actuelle
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <AdminHeader />

            <main className="flex flex-1 flex-col gap-4 p-6 md:p-12">
                <Card className="bg-gray-800 shadow-lg shadow-purple-800/50">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 text-2xl font-extrabold">
                            Gestion des jeux
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Ajouter, modifier ou supprimer des jeux.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleAddGame}
                            className="mb-4 bg-green-600 hover:bg-green-500 text-white"
                        >
                            Ajouter un jeu
                        </Button>

                        {/* Filtres pour les catégories et le type de jeu */}
                        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                            {/* Filtre de type de jeu */}
                            <div className="mb-4 md:mb-0">
                                <label
                                    htmlFor="gameTypeFilter"
                                    className="text-white mr-2"
                                >
                                    Filtrer par type de jeu :
                                </label>
                                <select
                                    id="gameTypeFilter"
                                    value={gameTypeFilter}
                                    onChange={(e) =>
                                        handleGameTypeFilterChange(e.target.value)
                                    }
                                    className="bg-gray-700 border border-gray-600 text-white p-2 rounded"
                                >
                                    <option value="ALL">Tous les types</option>
                                    <option value="Jeu Vidéo">Jeux Vidéo</option>
                                    <option value="Jeu de Société">Jeux de Société</option>
                                    <option value="Jeu de Rôle">Jeux de Rôle</option>
                                </select>
                            </div>

                            {/* Filtre de catégorie */}
                            <div>
                                <label
                                    htmlFor="categoryFilter"
                                    className="text-white mr-2"
                                >
                                    Filtrer par genre :
                                </label>
                                <select
                                    id="categoryFilter"
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        handleCategoryFilterChange(e.target.value)
                                    }
                                    className="bg-gray-700 border border-gray-600 text-white p-2 rounded"
                                >
                                    <option value="ALL">Toutes les genres</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Affichage en cartes sur les petits écrans */}
                        <div className="md:hidden">
                            {currentGames.map((game) => (
                                <Card key={game.id} className="bg-gray-800 mb-4">
                                    <CardHeader>
                                        <CardTitle className="text-yellow-400">
                                            {game.name}
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            {game.type}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-white">{game.description}</p>
                                        <p className="text-gray-300">
                                            Nombre de joueurs : {game.player_max ?? 'N/A'}
                                        </p>
                                        <p className="text-gray-300">
                                            Catégorie(s) :{' '}
                                            {game.categories && game.categories.length > 0 ? (
                                                game.categories.map((categoryRelation: any) => (
                                                    <span
                                                        key={categoryRelation.category.id}
                                                        className="mr-2"
                                                    >
                            {categoryRelation.category.name}
                          </span>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <div className="mt-4 flex flex-col space-y-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white w-full">
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
                                                className="bg-red-600 hover:bg-red-500 text-white w-full"
                                                onClick={() => handleDeleteGame(game.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {/* Pagination */}
                            <Pagination
                                totalItems={filteredGames.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>

                        {/* Affichage du tableau sur les écrans moyens et grands */}
                        <div className="hidden md:block">
                            <Table className="table-auto w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-yellow-400">
                                            Nom
                                        </TableHead>
                                        <TableHead className="text-yellow-400">
                                            Description
                                        </TableHead>
                                        <TableHead className="text-yellow-400">
                                            Type
                                        </TableHead>
                                        <TableHead className="text-yellow-400">
                                            Nombre de joueurs
                                        </TableHead>
                                        <TableHead className="text-yellow-400">
                                            Catégorie
                                        </TableHead>
                                        <TableHead className="text-yellow-400">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentGames.map((game) => (
                                        <TableRow
                                            key={game.id}
                                            className="hover:bg-purple-700/30"
                                        >
                                            <TableCell className="text-white">
                                                <Link href={`/admin/game/${game.id}`}>
                          <span className="text-yellow-400 hover:underline cursor-pointer">
                            {game.name}
                          </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {game.description}
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                {game.type}
                                            </TableCell>
                                            <TableCell>
                                                {game.player_max ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                {game.categories && game.categories.length > 0 ? (
                                                    game.categories.map(
                                                        (categoryRelation: any) => (
                                                            <span
                                                                key={
                                                                    categoryRelation.category.id
                                                                }
                                                                className="mr-2"
                                                            >
                                {
                                    categoryRelation.category
                                        .name
                                }
                              </span>
                                                        )
                                                    )
                                                ) : (
                                                    'N/A'
                                                )}
                                            </TableCell>
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
                            {/* Pagination */}
                            <Pagination
                                totalItems={filteredGames.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}