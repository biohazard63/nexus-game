'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, deleteCategory } from '@/lib/actions/categoryActions'; // Actions pour gérer les catégories
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription,} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import AdminHeader from "@/components/AdminHeader";
import CategoryEditForm from "@/components/CategoryEditForm";
import Link from "next/link"; // Composant pour modifier une catégorie

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]); // Liste des catégories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null); // Catégorie en cours de modification
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = await getCategories(); // Récupérer les catégories depuis la base de données
                setCategories(categoriesList);
            } catch (error) {
                setError('Erreur lors de la récupération des catégories.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await deleteCategory(categoryId); // Supprimer la catégorie de la base de données
            setCategories(categories.filter((category) => category.id !== categoryId)); // Mise à jour de l'état
        } catch (error) {
            setError('Erreur lors de la suppression de la catégorie.');
        }
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category); // Passer la catégorie à modifier dans l'état
    };

    const handleCategoryUpdated = (updatedCategory: any) => {
        // Mettre à jour la catégorie dans la liste
        setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
        setEditingCategory(null); // Fermer le formulaire après la mise à jour
    };

    const handleAddCategory = async () => {
        try {
            const newCategory = await createCategory({ name: 'Nouvelle Catégorie', type: 'VIDEO_GAME' }); // Valeurs par défaut
            setCategories([...categories, newCategory]); // Ajouter la nouvelle catégorie à la liste
        } catch (error) {
            setError('Erreur lors de ajout de la catégorie.');
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

            <main className="flex flex-1 flex-col gap-8 p-6 md:p-12">
                {editingCategory ? (
                    <CategoryEditForm
                        categoryId={editingCategory.id}
                    />
                ) : (
                    <Card className="bg-gray-800 shadow-lg shadow-purple-800/50">
                        <CardHeader>
                            <CardTitle className="text-yellow-400 text-2xl font-extrabold">Gestion des catégories</CardTitle>
                            <CardDescription className="text-gray-400">
                                Ajouter, modifier ou supprimer des catégories.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleAddCategory} className="mb-4 bg-green-600 hover:bg-green-500 text-white">
                                Ajouter une catégorie
                            </Button>
                            <Table className="table-auto">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-yellow-400">Nom</TableHead>
                                        <TableHead className="text-yellow-400">Type</TableHead>
                                        <TableHead className="text-yellow-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id} className="hover:bg-purple-700/30">
                                            <TableCell className="text-white">
                                                <Link href={`/admin/category/${category.id}`} legacyBehavior>
                                                    <span className="text-yellow-400 hover:underline cursor-pointer">{category.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-gray-300">{category.type}</TableCell>
                                            <TableCell>
                                                <Button
                                                    className="mr-4 bg-blue-600 hover:bg-blue-500 text-white"
                                                    onClick={() => handleEditCategory(category)}
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-500 text-white"
                                                    onClick={() => handleDeleteCategory(category.id)}
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
                )}
            </main>
        </div>
    );
}