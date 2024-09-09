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
import { Search, Menu, User, Settings, LogOut } from 'lucide-react';

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
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-4 md:px-6 shadow-lg">
            {/* Navigation links */}
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="#" className="flex items-center gap-2 text-xl font-extrabold text-yellow-300 md:text-2xl">
                    <Menu className="h-6 w-6 text-yellow-300" />
                    <span>GameMaster</span>
                </Link>
                <Link href="/dashboard" className="text-yellow-200 hover:text-yellow-400 transition-colors">
                    Dashboard
                </Link>
                <Link href="/admin/users" className="text-yellow-200 hover:text-yellow-400 transition-colors">
                    Utilisateurs
                </Link> {/* Lien vers la page des utilisateurs */}
            </nav>

            {/* Hamburger Menu for Mobile */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden text-yellow-200 border-yellow-400">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-indigo-900 text-yellow-200">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">GameMaster</span>
                        </Link>
                        <Link href="/dashboard" className="hover:text-yellow-400">
                            Dashboard
                        </Link>
                        <Link href="/admin/users" className="hover:text-yellow-400">
                            Utilisateurs
                        </Link> {/* Lien vers la page des utilisateurs */}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Search Bar */}
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input type="search" placeholder="Rechercher..." className="pl-8 text-black rounded-full border-2 border-yellow-400 bg-gray-100 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
                    </div>
                </form>

                {/* User Avatar */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full border-yellow-400 bg-gray-700 text-yellow-200">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL || ''} alt={userData?.username || 'User Avatar'} />
                                <AvatarFallback>{userData?.username?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 text-yellow-200">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Paramètres
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}