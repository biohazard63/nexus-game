'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, deleteCategory } from '@/lib/actions/categoryActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminHeader from "@/components/AdminHeader";
import CategoryEditForm from "@/components/CategoryEditForm";
import Link from "next/link";
import { Pagination } from '@/components/Pagination';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = await getCategories();
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
            await deleteCategory(categoryId);
            const updatedCategories = categories.filter((category) => category.id !== categoryId);
            setCategories(updatedCategories);

            // Ajuster la page actuelle si nécessaire
            const totalPages = Math.ceil(updatedCategories.length / itemsPerPage);
            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
        } catch (error) {
            setError('Erreur lors de la suppression de la catégorie.');
        }
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
    };

    const handleCategoryUpdated = (updatedCategory: any) => {
        setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
        setEditingCategory(null);
    };

    const handleAddCategory = async () => {
        try {
            const newCategory = await createCategory({ name: 'Nouvelle Catégorie', type: 'VIDEO_GAME' });
            setCategories([...categories, newCategory]);
        } catch (error) {
            setError('Erreur lors de l\'ajout de la catégorie.');
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Calculer les catégories à afficher pour la page actuelle
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <AdminHeader />

            <main className="flex flex-1 flex-col gap-8 p-6 md:p-12">
                {editingCategory ? (
                    <CategoryEditForm
                        categoryId={editingCategory.id}
                        onUpdate={handleCategoryUpdated}
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

                            {/* Affichage en cartes sur les petits écrans */}
                            <div className="md:hidden">
                                {currentCategories.map((category) => (
                                    <Card key={category.id} className="bg-gray-800 mb-4">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-400">{category.name}</CardTitle>
                                            <CardDescription className="text-gray-400">{category.type}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mt-4 flex flex-col space-y-2">
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                                                    onClick={() => handleEditCategory(category)}
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-500 text-white w-full"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {/* Pagination */}
                                <Pagination
                                    totalItems={categories.length}
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
                                            <TableHead className="text-yellow-400">Nom</TableHead>
                                            <TableHead className="text-yellow-400">Type</TableHead>
                                            <TableHead className="text-yellow-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentCategories.map((category) => (
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
                                {/* Pagination */}
                                <Pagination
                                    totalItems={categories.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}