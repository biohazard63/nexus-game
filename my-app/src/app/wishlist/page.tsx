'use client';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button'; // Bouton stylisé
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'; // Composants de carte
import { Trash2 } from 'lucide-react'; // Icône de suppression pour chaque jeu
import Link from 'next/link';
import { getWishlist, removeFromWishlist, addToWishlist } from '@/lib/actions/wishlistActions';
import {getUserByFirebaseId} from "@/lib/actions/userActions"; // Importer les fonctions d'action

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userid, setUserid] = useState<number | null>(null); // État pour stocker l'ID de l'utilisateur

    // Récupérer l'ID utilisateur à partir de sessionStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (firebaseId) {
                    const user = await getUserByFirebaseId(firebaseId); // Récupérer l'utilisateur via Firebase ID
                    setUserid(user.id); // Stocker l'ID de l'utilisateur
                } else {
                    console.error('Aucun utilisateur trouvé dans sessionStorage');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        fetchUserId();
    }, []);

    // Charger la wishlist de l'utilisateur connecté
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                if (userid) { // S'assurer que l'ID utilisateur est disponible
                    const games = await getWishlist(userid); // Utiliser l'ID de l'utilisateur connecté
                    setWishlist(games);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la wishlist:', error);
            }
        };
        loadWishlist();
    }, [userid]); // Exécuter ce useEffect lorsque `userid` est mis à jour

    // Supprimer un jeu de la wishlist
    const handleRemoveFromWishlist = async (gameId: number) => {
        try {
            if (userid) { // S'assurer que l'ID utilisateur est disponible
                await removeFromWishlist(userid, gameId); // Utiliser l'ID de l'utilisateur connecté
                setWishlist(wishlist.filter((game) => game.gameId !== gameId)); // Mettre à jour la liste localement
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du jeu de la wishlist:', error);
        }
    };

    if (loading || !userid) {
        return <p className="text-white text-center">Chargement...</p>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Ma Wishlist</h1>
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((wishlistItem) => (
                        <Card key={wishlistItem.gameId} className="bg-gray-800 shadow-lg rounded-lg transition-transform hover:scale-105">
                            <CardHeader className="relative">
                                {wishlistItem.game.coverImage && (
                                    <img
                                        src={wishlistItem.game.coverImage}
                                        alt={wishlistItem.game.name}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                )}
                                <Button
                                    variant="destructive"
                                    className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-full"
                                    onClick={() => handleRemoveFromWishlist(wishlistItem.gameId)}
                                >
                                    <Trash2 className="text-white w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="text-xl font-bold text-yellow-400">{wishlistItem.game.name}</CardTitle>
                                <CardDescription className="text-gray-300">{wishlistItem.game.description}</CardDescription>
                                <p className="text-sm text-gray-400 mt-2">Type : {wishlistItem.game.type}</p>
                                <div className="mt-4 flex justify-between">
                                    <Link href={`/games/${wishlistItem.gameId}`}>
                                        <Button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition">
                                            Voir plus
                                        </Button>
                                    </Link>
                                    <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center">
                                        Trouver une session public <span className="ml-2">🎮</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-xl text-gray-300">Votre wishlist est vide pour l'instant.</p>
                    <Link href="/games">
                        <Button className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition">
                            Explorer les jeux
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}