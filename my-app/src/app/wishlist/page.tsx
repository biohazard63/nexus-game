/**
 * WishlistPage component
 *
 * This component renders the wishlist page for the logged-in user. It fetches the user's wishlist
 * and displays the games in a card layout. Users can remove games from their wishlist and navigate
 * to game details or public sessions for the game.
 *
 * @component
 * @example
 * return (
 *   <WishlistPage />
 * )
 */
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getWishlist, removeFromWishlist, addToWishlist } from '@/lib/actions/wishlistActions';
import { getUserByFirebaseId } from "@/lib/actions/userActions";
import Image from "next/image";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userid, setUserid] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const firebaseId = sessionStorage.getItem('userId');
                if (firebaseId) {
                    const user = await getUserByFirebaseId(firebaseId);
                    setUserid(user.id);
                } else {
                    console.error('Aucun utilisateur trouvé dans sessionStorage');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                if (userid) {
                    const games = await getWishlist(userid);
                    setWishlist(games);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la wishlist:', error);
            }
        };
        loadWishlist();
    }, [userid]);

    const handleRemoveFromWishlist = async (gameId: number) => {
        try {
            if (userid) {
                await removeFromWishlist(userid, gameId);
                setWishlist(wishlist.filter((game) => game.gameId !== gameId));
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
                                    <Image
                                        src={wishlistItem.game.coverImage}
                                        alt={wishlistItem.game.name}
                                        width={400}
                                        height={200}
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
                                <div className="mt-4 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                                    <Link href={`/games/${wishlistItem.gameId}`} className="w-full md:w-auto">
                                        <Button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition w-full md:w-auto">
                                            Voir plus
                                        </Button>
                                    </Link>
                                    <Link href={`/session-search/${wishlistItem.gameId}/public-sessions`} passHref className="w-full md:w-auto">
                                        <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center w-full md:w-auto">
                                            Trouver une session <span className="ml-2">🎮</span>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-xl text-gray-300">Votre wishlist est vide pour l&apos;instant.</p>
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