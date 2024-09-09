// components/UsersPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUsersFromPostgreSQL } from '@/lib/actions/userActions';
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
import { Badge } from '@/components/ui/badge';
import AdminHeader from "@/components/AdminHeader";

export default function UsersPage() {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [users, setUsers] = useState<any[]>([]); // Liste des utilisateurs depuis PostgreSQL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('Utilisateur connecté : ', user);
                setUser(user);
                try {
                    const usersList = await getUsersFromPostgreSQL();
                    console.log('Liste des utilisateurs récupérés depuis PostgreSQL :', usersList);
                    setUsers(usersList);

                    const currentUser = usersList.find(u => u.email === user.email);
                    const userRole = currentUser?.accountType?.toLowerCase();

                    console.log('Rôle de l\'utilisateur connecté (normalisé) : ', userRole);

                    if (userRole !== 'admin' && userRole !== 'superadmin') {
                        console.warn('Redirection, utilisateur sans autorisation');
                        router.push('/'); // Rediriger si non admin
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des utilisateurs :', error);
                    setError('Erreur lors de la récupération des utilisateurs.');
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('Utilisateur non connecté, redirection vers /login');
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

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
                                            <Button className="mr-4 bg-blue-600 hover:bg-blue-500 text-white">Modifier</Button>
                                            <Button variant="destructive" className="bg-red-600 hover:bg-red-500 text-white">Supprimer</Button>
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