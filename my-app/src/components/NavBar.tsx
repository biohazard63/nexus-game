'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Plus besoin de getAuth ici
import { auth } from '@/lib/firebase'; // Utilisez l'instance auth exportée de firebase.ts
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const navItems = [
    {
        title: 'Accueil',
        href: '/',
        description: 'Revenez à la page d\'accueil.',
    },
    {
        title: 'Contact',
        href: '/contact',
        description: 'Contactez-nous pour plus d\'informations.',
    },
];

export function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Écoute de l'état d'authentification de l'utilisateur
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Si l'utilisateur est connecté, définissez l'état sur "true"
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('Déconnexion réussie !');
        } catch (error) {
            console.error('Erreur lors de la déconnexion : ', error);
        }
    };

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* Premier item - Sections principales */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                            {navItems.map((item) => (
                                <ListItem key={item.title} href={item.href} title={item.title}>
                                    {item.description}
                                </ListItem>
                            ))}
                            <ListItem href="/account" title="Mon Compte">
                                Accédez à votre compte.
                            </ListItem>

                            {/* Dynamique : Afficher Connexion/Inscription ou Déconnexion */}
                            {!isLoggedIn ? (
                                <>
                                    <ListItem href="/login" title="Connexion">
                                        Connectez-vous à votre compte.
                                    </ListItem>
                                    <ListItem href="/signup" title="Inscription">
                                        Créez un nouveau compte.
                                    </ListItem>
                                </>
                            ) : (
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                        <div className="text-sm font-medium leading-none">Déconnexion</div>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';