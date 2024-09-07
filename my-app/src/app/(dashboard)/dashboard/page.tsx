'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Users, Search, Menu, ArrowUpRight } from 'lucide-react';
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [userData, setUserData] = useState<any>(null); // Détails de l'utilisateur Firestore
    const [users, setUsers] = useState<any[]>([]); // Liste des utilisateurs
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté et récupérer ses informations
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    // Récupérer les détails de l'utilisateur depuis Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }

                    // Récupérer les utilisateurs depuis Firestore (ou une autre base de données)
                    const usersCollection = collection(db, 'users');
                    const usersSnapshot = await getDocs(usersCollection);
                    const usersList = usersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUsers(usersList); // Mettre à jour l'état avec les utilisateurs récupérés
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur :', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Rediriger vers la page de connexion si non authentifié
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <p>Chargement...</p>; // Afficher un indicateur de chargement
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
           <AdminHeader/>

            {/* Main Dashboard Content */}
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {/* Carte affichant le nom et le rôle de l'utilisateur */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateur connecté</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userData?.username || user?.email}</div>
                        <p className="text-xs text-muted-foreground">
                            Rôle: {userData?.role || 'Utilisateur'}
                        </p>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Derniers utilisateurs</CardTitle>
                            <CardDescription>Voici les 10 derniers utilisateurs créés sur la plateforme.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <a href="#">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom d'utilisateur</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="hidden xl:table-column">Date de création</TableHead>
                                    <TableHead className="text-right">Rôle</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Avatar className="mr-2 h-6 w-6">
                                                    <AvatarImage src={user.profilePicture || ''} alt={user.username || 'User Avatar'} />
                                                    <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{user.username || 'Anonyme'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="hidden xl:table-column">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge>{user.role || 'Utilisateur'}</Badge>
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