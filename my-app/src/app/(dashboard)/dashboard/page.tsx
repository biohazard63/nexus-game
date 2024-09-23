'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUsersFromPostgreSQL } from '@/lib/actions/userActions'; // Nouvelle fonction pour récupérer depuis PostgreSQL
import {Avatar, AvatarFallback, AvatarImage,} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription,} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import { Users, ArrowUpRight } from 'lucide-react';
import AdminHeader from "@/components/AdminHeader";
import { UserWithRelations } from "@/type/userWithRelations";

export default function AdminDashboard() {
    const [userData, setUserData] = useState<any>(null); // Détails de l'utilisateur actuel
    const [users, setUsers] = useState<UserWithRelations[]>([]); // Liste des utilisateurs depuis PostgreSQL
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    // Récupérer les utilisateurs depuis PostgreSQL
                    const usersList = await getUsersFromPostgreSQL();
                    setUsers(usersList);

                    // Si besoin, récupérer les détails de l'utilisateur connecté depuis PostgreSQL aussi
                    const currentUser = usersList.find(u => u.email === user.email);
                    setUserData(currentUser || {});
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur :', error);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    console.log('Users:', users);

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
            <AdminHeader />

            {/* Main Dashboard Content */}
            <main className="flex flex-1 flex-col gap-8 p-6 md:p-12">
                {/* Carte affichant le nom et le rôle de l'utilisateur */}
                <Card className="bg-gray-800 shadow-lg shadow-blue-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold text-blue-400">Utilisateur connecté</CardTitle>
                        <Users className="h-6 w-6 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-400">{userData?.username || userData?.email}</div>
                        <p className="text-sm text-gray-300">
                            Rôle: <span className="font-semibold text-yellow-400">{userData?.accountType}</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="bg-gray-800 shadow-lg shadow-purple-800/50 xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle className="text-lg font-bold text-yellow-400">Derniers utilisateurs</CardTitle>
                            <CardDescription className="text-sm text-gray-400">
                                Voici les 10 derniers utilisateurs créés sur la plateforme.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1 bg-purple-700 text-white hover:bg-purple-600">
                            <a href="#">
                                Voir tout
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-yellow-400">Nom d'utilisateur</TableHead>
                                    <TableHead className="text-yellow-400">Email</TableHead>
                                    <TableHead className="hidden xl:table-column text-yellow-400">Date de création</TableHead>
                                    <TableHead className="text-right text-yellow-400">Rôle</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-purple-700/30">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Avatar className="mr-2 h-8 w-8 border border-yellow-400">
                                                    <AvatarImage src={user.profilePicture || ''} alt={user.username || 'User Avatar'} />
                                                    <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium text-white">{user.username || 'Anonyme'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{user.email}</TableCell>
                                        <TableCell className="hidden xl:table-column text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className="bg-yellow-500 text-black">{user.accountType}</Badge>
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