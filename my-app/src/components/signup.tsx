'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUser } from '@/server/user/userAdd';
import { AccountType } from '@prisma/client'; // Importer la fonction Prisma pour créer l'utilisateur
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Fonction pour ajouter l'utilisateur à Firestore avec un rôle par défaut
const addUserToFirestore = async (userId: string, userData: any) => {
    try {
        await setDoc(doc(db, 'users', userId), userData);
        console.log('Utilisateur ajouté à Firestore : ', userId, userData);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur à Firestore : ", error);
    }
};

export function SignUpForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function generateRandomPassword(length: number) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Création d’un utilisateur Firebase...');
            // Création de l'utilisateur avec email et mot de passe dans Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Utilisateur Firebase créé : ', user);

            // Enregistrement des informations supplémentaires dans Firestore
            await addUserToFirestore(user.uid, {
                firstName,
                lastName,
                email,
                role: 'user', // Rôle par défaut "user"
                createdAt: new Date().toISOString(),
            });

            console.log('Création de l’utilisateur dans PostgreSQL...');
            // Enregistrement de l'utilisateur dans la base de données PostgreSQL
            await createUser({
                username: email.split('@')[0], // Vous pouvez ajuster cela pour générer le username
                email,
                password, // Le mot de passe sera haché dans `createUser` (fonction Prisma)
                firstName,
                lastName,
                accountType: AccountType.USER, // Marquer l'utilisateur comme un utilisateur
                createdAt: new Date().toISOString(),
            });

            alert('Compte créé avec succès, utilisateur ajouté à Firebase et PostgreSQL !');
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            setError('Erreur lors de la création du compte. Veuillez réessayer.');
        }
    };

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            console.log('Inscription avec Google...');
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log('Utilisateur Google créé : ', user);

            // Générer un mot de passe aléatoire
            const generatedPassword = generateRandomPassword(12);

            // Enregistrement des informations supplémentaires dans Firestore avec rôle par défaut
            await addUserToFirestore(user.uid, {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                role: 'user', // Rôle par défaut "user"
                createdAt: new Date().toISOString(),
            });

            // Enregistrement de l'utilisateur dans PostgreSQL avec le mot de passe généré
            console.log('Création de l’utilisateur dans PostgreSQL...');
            await createUser({
                username: user.email?.split('@')[0] || 'unknown',
                email: user.email || '',
                password: generatedPassword, // Utiliser le mot de passe généré
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                accountType: AccountType.USER, // Marquer l'utilisateur comme connecté via Google
                createdAt: new Date().toISOString(),
            });

            alert('Inscription avec Google réussie et utilisateur ajouté à Firebase et PostgreSQL !');
        } catch (error) {
            console.error("Erreur lors de l'inscription avec Google:", error);
            setError("Erreur lors de l'inscription avec Google.");
        }
    };

    const handleGithubSignUp = async () => {
        const provider = new GithubAuthProvider();
        try {
            console.log('Inscription avec GitHub...');
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log('Utilisateur GitHub créé : ', user);

            // Enregistrement des informations supplémentaires dans Firestore avec rôle par défaut
            await addUserToFirestore(user.uid, {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                role: 'user', // Rôle par défaut "user"
                createdAt: new Date().toISOString(),
            });

            // Enregistrement de l'utilisateur dans PostgreSQL
            console.log('Création de l’utilisateur dans PostgreSQL...');
            await createUser({
                username: user.email?.split('@')[0] || 'unknown',
                email: user.email || '',
                password: '', // Pas de mot de passe stocké, car connexion via GitHub
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                accountType: AccountType.USER, // Marquer l'utilisateur comme connecté via GitHub
                createdAt: new Date().toISOString(),
            });

            alert('Inscription avec GitHub réussie et utilisateur ajouté à Firebase et PostgreSQL !');
        } catch (error) {
            console.error("Erreur lors de l'inscription avec GitHub:", error);
            setError("Erreur lors de l'inscription avec GitHub.");
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Inscription</CardTitle>
                <CardDescription>
                    Entrez vos informations pour créer un compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">Prénom</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Nom</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Créer un compte
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
                            Inscription avec Google
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleGithubSignUp}>
                            Inscription avec GitHub
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Vous avez déjà un compte ?{' '}
                    <Link href="/login" className="underline">
                        Se connecter
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default SignUpForm;