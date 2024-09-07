// components/AdminHeader.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu } from 'lucide-react';

export default function AdminHeader() {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        // Récupérer l'utilisateur Firebase et les détails utilisateur si nécessaire
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                // Vous pouvez récupérer des données supplémentaires de Firestore si nécessaire
                // setUserData(...);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            {/* Navigation links */}
            <nav
                className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <Menu className="h-6 w-6"/>
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link href="/dashboard" className="text-foreground transition-colors hover:text-foreground">
                    Dashboard
                </Link>
                <Link href="/admin/users" className="text-foreground transition-colors hover:text-foreground">
                    Utilisateurs
                </Link> {/* Lien vers la page des utilisateurs */}
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
                        <Link href="/dashboard" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link href="/admin/users" className="hover:text-foreground">
                            Utilisateurs
                        </Link> {/* Lien vers la page des utilisateurs */}
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
                        {/*<DropdownMenuLabel>Mon Compte</DropdownMenuLabel>*/}
                        {/*<DropdownMenuSeparator />*/}
                        <DropdownMenuItem>Paramètres</DropdownMenuItem>
                        {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
                        {/*<DropdownMenuSeparator />*/}
                        {/*<DropdownMenuItem>Déconnexion</DropdownMenuItem>*/}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}