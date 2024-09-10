'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUsersFromPostgreSQL } from '@/lib/actions/userActions';
import { deleteUser } from '@/server/user/deleteUserAction'; // Fonction de suppression
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription,} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminHeader from "@/components/AdminHeader";
import UserEditForm from "@/components/UserEditForm"; // Import du composant de modification d'utilisateur
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function UsersPage() {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [users, setUsers] = useState<any[]>([]); // Liste des utilisateurs depuis PostgreSQL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<any>(null); // Utilisateur en cours de modification
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    const usersList = await getUsersFromPostgreSQL();
                    setUsers(usersList);
                    console.log('Users:', usersList);
                    const currentUser = usersList.find(u => u.email === user.email);
                    const userRole = currentUser?.accountType?.toLowerCase();

                    if (userRole !== 'admin' && userRole !== 'superadmin') {
                        router.push('/');
                    }
                } catch (error) {
                    setError('Erreur lors de la récupération des utilisateurs.');
                } finally {
                    setLoading(false);
                }
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId); // Supprimer l'utilisateur de PostgreSQL
            setUsers(users.filter((user) => user.id !== userId)); // Retirer l'utilisateur supprimé de l'état
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            setError('Erreur lors de la suppression de l\'utilisateur.');
        }
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user); // Définir l'utilisateur en cours de modification
    };

    const handleUserUpdated = (updatedUser: any) => {
        // Mettre à jour l'utilisateur modifié dans la liste
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null); // Fermer le formulaire de modification après mise à jour
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
                <Card className="bg-gray-800 shadow-lg shadow-purple-800/50">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 text-2xl font-extrabold">Liste des utilisateurs</CardTitle>
                        <CardDescription className="text-gray-400">
                            Gestion des utilisateurs enregistrés dans la base de données.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table className="table-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-yellow-400">Nom d'utilisateur</TableHead>
                                    <TableHead className="text-yellow-400">Email</TableHead>
                                    <TableHead className="text-yellow-400">Date de création</TableHead>
                                    <TableHead className="text-yellow-400">Rôle</TableHead>
                                    <TableHead className="text-yellow-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-purple-700/30">
                                        <TableCell className="text-white">{user.username}</TableCell>
                                        <TableCell className="text-gray-300">{user.email}</TableCell>
                                        <TableCell className="text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-yellow-500 text-black">{user.accountType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="mr-4 bg-blue-600 hover:bg-blue-500 text-white">
                                                        Modifier
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-gray-800 text-white rounded-lg p-6 max-w-lg mx-auto">
                                                    <UserEditForm userId={user.id} onUpdate={handleUserUpdated} />
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-500 text-white"
                                                onClick={() => handleDeleteUser(user.id)} // Supprimer l'utilisateur
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