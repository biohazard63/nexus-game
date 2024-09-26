'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importer Link pour la navigation
import { getGames } from '@/lib/actions/gameActions'; // Action pour obtenir tous les jeux
import { getCategories } from '@/lib/actions/categoryActions'; // Action pour obtenir les catégories
import { addToWishlist, getWishlist } from '@/lib/actions/wishlistActions'; // Actions pour gérer la wishlist
import { getUserIdByFirebaseId } from '@/lib/actions/userActions'; // Importer la fonction pour obtenir l'ID utilisateur
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button'; // Importer le bouton de Shadcn/UI
import { Heart } from 'lucide-react';
import Image from "next/image"; // Icône pour le bouton de wishlist

export default function UserGamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [filteredGames, setFilteredGames] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]); // Wishlist pour stocker les IDs des jeux ajoutés
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [userId, setUserId] = useState<number | null>(null); // Stocker l'ID utilisateur

    console.log(games)

    useEffect(() => {
        const fetchGamesAndCategories = async () => {
            try {
                const fetchedGames = await getGames(); // Récupérer la liste des jeux
                const fetchedCategories = await getCategories(); // Récupérer la liste des catégories

                // Récupérer l'ID de l'utilisateur depuis sessionStorage
                const userFirebaseId = sessionStorage.getItem('userId'); // Remplacez par la clé exacte utilisée dans sessionStorage
                if (!userFirebaseId) {
                    throw new Error("Utilisateur non connecté, l'ID Firebase est manquant dans le sessionStorage.");
                }

                const fetchedUserId = await getUserIdByFirebaseId(userFirebaseId);
                if (fetchedUserId) {
                    const userWishlist = await getWishlist(fetchedUserId); // Récupérer la wishlist
                    const wishlistIds = userWishlist.map((item: any) => item.gameId);
                    setWishlist(wishlistIds); // Stocker les jeux déjà dans la wishlist
                    setUserId(fetchedUserId); // Stocker l'ID utilisateur
                }

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


    // Ajouter un jeu à la wishlist
    const handleAddToWishlist = async (gameId: number) => {
        try {
            if (userId) {
                await addToWishlist(userId, gameId); // Utiliser l'ID utilisateur réel ici
                setWishlist([...wishlist, gameId]); // Ajouter le jeu à l'état local
            } else {
                console.error('Utilisateur non connecté.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la wishlist :', error);
        }
    };

    // Gérer le filtrage des jeux en fonction des filtres sélectionnés
    const handleFilterChange = () => {
        let filtered = games;

        if (selectedType !== 'ALL') {
            filtered = filtered.filter((game) => game.type === selectedType);
        }

        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter((game) =>
                game.categories.some((category: any) => category.category.name === selectedCategory)
            );
        }

        setFilteredGames(filtered);
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedType, selectedCategory ]);

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
                <div>
                    <label className="block text-yellow-400 mb-2">Filtrer par type</label>
                    <Select onValueChange={setSelectedType} value={selectedType}>
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

                <div>
                    <label className="block text-yellow-400 mb-2">Filtrer par genre</label>
                    <Select onValueChange={setSelectedCategory} value={selectedCategory}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols- gap-6">
                {filteredGames.map((game) => (
                    <Card key={game.id} className="bg-gray-800 shadow-lg rounded-lg transition-transform hover:scale-105">
                        <CardHeader>
                            <CardTitle className="text-yellow-400 text-2xl font-bold">{game.name}</CardTitle>
                            <CardDescription className="text-gray-400 mt-2">
                                Catégories :{' '}
                                {game.categories && game.categories.length > 0 ? (
                                    game.categories.map((category: any) => (
                                        <span key={category.category.id} className="text-white bg-purple-600 px-2 py-1 rounded-lg mr-2">
                                            {category.category.name}
                                        </span>
                                    ))
                                ) : (
                                    'Aucune catégorie'
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {game.coverImage && (
                                <Image src={game.coverImage} alt={game.name} width={150} height={150} className="w-full h-48 object-cover rounded-lg mb-4" />
                            )}
                            <p className="text-white mb-2">{game.description}</p>
                            <p className="text-gray-300 mb-2">Type : {game.type}</p>
                            {game.player_max && (
                                <p className="text-gray-300">Nombre de joueurs maximum : {game.player_max}</p>
                            )}

                            {/* Boutons d'actions */}
                            <div className="flex justify-between mt-4">
                                <Link href={`/games/${game.id}`}>
                                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Voir plus</Button>
                                </Link>
                                <Button
                                    className={`flex items-center ${
                                        wishlist.includes(game.id) ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'
                                    } hover:bg-purple-700`}
                                    onClick={() => handleAddToWishlist(game.id)}
                                >
                                    <Heart className="mr-2" />
                                    {wishlist.includes(game.id) ? 'Ajouté' : 'Ajouter à la wishlist'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}