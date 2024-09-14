'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importer Link pour la navigation
import { getGames } from '@/lib/actions/gameActions'; // Action pour obtenir tous les jeux
import { getCategories } from '@/lib/actions/categoryActions'; // Action pour obtenir les catégories
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserGamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [filteredGames, setFilteredGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    useEffect(() => {
        const fetchGamesAndCategories = async () => {
            try {
                const fetchedGames = await getGames(); // Récupérer la liste des jeux
                const fetchedCategories = await getCategories(); // Récupérer la liste des catégories
                // Trier les jeux par ordre alphabétique
                const sortedGames = fetchedGames.sort((a, b) => a.name.localeCompare(b.name));
                setGames(sortedGames);
                setFilteredGames(sortedGames); // Par défaut, tous les jeux sont affichés
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux et catégories :', error);
                setError('Erreur lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchGamesAndCategories();
    }, []);

    // Gérer le filtrage des jeux en fonction des filtres sélectionnés
    const handleFilterChange = () => {
        let filtered = games;

        if (selectedType !== 'ALL') {
            filtered = filtered.filter((game) => game.type === selectedType);
        }

        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter((game) =>
                game.categories.some((category: any) => category.name === selectedCategory)
            );
        }

        setFilteredGames(filtered);
    };

    // Mettre à jour le filtre de type et réappliquer les filtres
    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    // Mettre à jour le filtre de catégorie et réappliquer les filtres
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    // Utiliser un effet pour re-filtrer les jeux chaque fois que les filtres changent
    useEffect(() => {
        handleFilterChange();
    }, [selectedType, selectedCategory]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-8">Liste des Jeux</h1>

            {/* Filtres pour les types et les catégories */}
            <div className="flex justify-center space-x-4 mb-8">
                {/* Filtre par type */}
                <div>
                    <label className="block text-yellow-400 mb-2">Filtrer par type</label>
                    <Select onValueChange={handleTypeChange} value={selectedType}>
                        <SelectTrigger className="bg-gray-700 border border-gray-600 text-white w-48">
                            <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ALL">Tous les types</SelectItem>
                                <SelectItem value="Jeu Vidéo">Jeux Vidéo</SelectItem>
                                <SelectItem value="Jeu de Société">Jeux de Société</SelectItem>
                                <SelectItem value="Jeu de Rôle">Jeux de Rôle</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filtre par catégorie */}
                <div>
                    <label className="block text-yellow-400 mb-2">Filtrer par genre</label>
                    <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                        <SelectTrigger className="bg-gray-700 border border-gray-600 text-white w-48">
                            <SelectValue placeholder="Sélectionnez un genre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ALL">Toutes les catégories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Liste des jeux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                    <Link href={`/games/${game.id}`} key={game.id}>
                        <Card className="cursor-pointer bg-gray-800 shadow-lg shadow-purple-800/50 hover:scale-105 transition-transform">
                            <CardHeader>
                                <CardTitle className="text-yellow-400 text-2xl font-bold">{game.name}</CardTitle>
                                <CardDescription className="text-gray-400 mt-2">
                                    {/* Affichage des catégories multiples */}
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
                                {game.coverImage && (
                                    <img src={game.coverImage} alt={game.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                )}
                                <p className="text-white mb-2">{game.description}</p>
                                <p className="text-gray-300 mb-2">Type : {game.type}</p>
                                {game.player_max && (
                                    <p className="text-gray-300">Nombre de joueurs maximum : {game.player_max}</p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}