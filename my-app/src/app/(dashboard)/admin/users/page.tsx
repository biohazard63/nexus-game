'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUsersFromPostgreSQL } from '@/lib/actions/userActions'; // Récupère uniquement depuis PostgreSQL
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
        // Vérifier si l'utilisateur est connecté et récupérer ses informations
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('Utilisateur connecté : ', user);
                setUser(user);
                try {
                    // Récupérer les utilisateurs depuis PostgreSQL avec Prisma
                    const usersList = await getUsersFromPostgreSQL();
                    console.log('Liste des utilisateurs récupérés depuis PostgreSQL :', usersList);
                    setUsers(usersList);

                    // Vérifier le rôle de l'utilisateur actuel
                    const currentUser = usersList.find(u => u.email === user.email);
                    const userRole = currentUser?.accountType?.toLowerCase(); // Normaliser le rôle en minuscules

                    console.log('Rôle de l\'utilisateur connecté (normalisé) : ', userRole);

                    // Si l'utilisateur n'est pas admin ou superadmin, le rediriger
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
                router.push('/login'); // Rediriger si non connecté
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
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <AdminHeader  />
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des utilisateurs</CardTitle>
                        <CardDescription>Gestion des utilisateurs enregistrés dans la base de données.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom d'utilisateur</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge>{user.accountType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button className='mr-4' variant="default">Modifier</Button>
                                            <Button variant="destructive">Supprimer</Button>
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