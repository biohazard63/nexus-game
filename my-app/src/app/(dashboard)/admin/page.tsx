'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
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

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [userData, setUserData] = useState<any>(null); // Détails de l'utilisateur Firestore
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
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                {/* Navigation links */}
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link href="#" className="text-foreground transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                </nav>

                {/* Hamburger Menu for Mobile */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link href="#" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            {/* Add other navigation links here */}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Search Bar */}
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search products..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
                        </div>
                    </form>

                    {/* User Avatar */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photoURL || ''} alt={userData?.username || 'User Avatar'} />
                                    <AvatarFallback>{userData?.username?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Paramètres</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

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

                {/* Recent Sales */}
                {/* ... similar to the example provided */}
                <Card x-chunk="dashboard-01-chunk-5">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    Olivia Martin
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    olivia.martin@email.com
                                </p>
                            </div>
                            <div className="ml-auto font-medium">+$1,999.00</div>
                        </div>
                        {/* Add other sales rows here */}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}