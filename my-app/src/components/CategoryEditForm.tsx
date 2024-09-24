'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryById, updateCategory } from '@/lib/actions/categoryActions'; // Actions pour obtenir et mettre à jour une catégorie
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryEditFormProps {
    categoryId: number;
}

export default function CategoryEditForm({ categoryId }: CategoryEditFormProps) {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Utiliser le router pour rediriger après la mise à jour

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const fetchedCategory = await getCategoryById(categoryId);
                setCategory(fetchedCategory);
            } catch (error) {
                setError('Erreur lors de la récupération de la catégorie.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateCategory(categoryId, category);
            router.push('/admin/categories'); // Rediriger vers la liste des catégories après mise à jour
        } catch (error) {
            setError('Erreur lors de la mise à jour de la catégorie.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Card className="bg-gray-800 text-white">
            <CardHeader>
                <CardTitle>Modifier la catégorie</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        type="text"
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        placeholder="Nom de la catégorie"
                        required
                        className="bg-gray-700 border border-gray-600 text-white"
                    />

                    <Select onValueChange={(value) => setCategory({ ...category, type: value })}>
                        <SelectTrigger className="bg-gray-700 border border-gray-600 text-white">
                            <span>{category.type}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VIDEO_GAME">Jeux vidéo</SelectItem>
                            <SelectItem value="BOARD_GAME">Jeux de société</SelectItem>
                            <SelectItem value="ROLE_PLAYING">Jeux de rôle</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={loading} className="bg-purple-700 text-white">
                        {loading ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                    <Button onClick={() => router.push('/admin/categories')} className="bg-gray-500 text-white">
                        Annuler
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}