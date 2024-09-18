'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Importer useRouter


export function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const router = useRouter(); // Initialiser useRouter


    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const checkUserRole = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;
                if (role === 'admin' || role === 'superadmin') {
                    setIsAdmin(true);
                }
                setUser(userData);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle utilisateur : ', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                checkUserRole(user.uid);
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            // Déconnexion de Firebase
            await signOut(auth);

            // Nettoyer le sessionStorage
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('accountType');
            sessionStorage.removeItem('firebase_id');


            // Rediriger vers la page d'accueil
            router.push('/');
        } catch (error) {
            console.error('Erreur lors de la déconnexion : ', error);
        }
    };

    return (
        <header className="flex justify-between items-center p-6 bg-gray-800 shadow-lg border-b border-purple-500">
            {/* Logo */}
            <Link href={'/'}>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                Nexus
            </h1>
            </Link>

            {/* Theme Toggle */}

            {/* Navigation and User Info */}
           <nav className="flex items-center gap-6">
    {/* User Profile & Dropdown Menu */}
    {isLoggedIn ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full border-yellow-400 bg-gray-700 text-yellow-200">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={user?.profilePicture || ''} alt={user?.username || 'User Avatar'} />
                        <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-yellow-200">
                <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <Link href="/account">Mon Compte</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
                        Accueil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/games" className="text-white hover:text-yellow-400 transition-colors">
                        Jeux
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/session" className="text-white hover:text-yellow-400 transition-colors">
                        Sessions
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/wishlist" className="text-white hover:text-yellow-400 transition-colors">
                        Wishlist
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors">
                        Contact
                    </Link>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors">
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full border-yellow-400 bg-gray-700 text-yellow-200">
                    <Menu className="h-8 w-8" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-yellow-200">
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                        Accueil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/login" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                        Connexion
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Link href="/signup" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                        Inscription
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )}
</nav>


        </header>
    );
}