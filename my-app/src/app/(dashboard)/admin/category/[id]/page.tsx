// pages/admin/category/[id].tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryById } from '@/lib/actions/categoryActions'; // Fonction pour obtenir la catégorie par ID
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import AdminHeader from "@/components/AdminHeader";

export default function CategoryPage({ params }: { params: { id: string } }) {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const categoryId = parseInt(params.id, 10);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const fetchedCategory = await getCategoryById(categoryId);
                setCategory(fetchedCategory);
            } catch (error) {
                console.error('Erreur lors de la récupération de la catégorie :', error);
                setError('Impossible de charger la catégorie.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <AdminHeader />
            <main className="flex flex-1 flex-col gap-8 p-6 md:p-12">
                <Card className="bg-gray-800 shadow-lg shadow-purple-800/50">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 text-2xl font-extrabold">
                            Jeux de la catégorie: {category.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {category.games.length === 0 ? (
                            <p>Aucun jeu dans cette catégorie pour le moment.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.games.map((game: any) => (
                                    <div key={game.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                                        <h3 className="text-xl text-yellow-400 font-bold">{game.name}</h3>
                                        <p className="text-gray-300">{game.description}</p>
                                        <Badge className="bg-yellow-500 text-black mt-2">{game.type}</Badge>
                                        <Link href={`/admin/game/${game.id}`}>
                                            <span className="mt-4 inline-block text-blue-400 hover:text-blue-500">Voir les détails</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}