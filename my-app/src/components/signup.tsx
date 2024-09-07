'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserOnServer } from '@/server/user/signupAction'; // Action de serveur pour l'inscription
import { AccountType } from '@prisma/client';
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Enregistrement dans Firestore
            await addUserToFirestore(user.uid, {
                firstName,
                lastName,
                email,
                role: 'user',
                createdAt: new Date().toISOString(),
            });

            // Enregistrement dans PostgreSQL
            await createUserOnServer({
                username: email.split('@')[0],
                email,
                password,
                firstName,
                lastName,
                accountType: AccountType.USER,
            });

            // Après succès, redirigez automatiquement à l'aide d'une action du serveur.
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            setError('Erreur lors de la création du compte. Veuillez réessayer.');
        }
    };

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const generatedPassword = generateRandomPassword(12);

            await addUserToFirestore(user.uid, {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                role: 'user',
                createdAt: new Date().toISOString(),
            });

            await createUserOnServer({
                username: user.email?.split('@')[0] || 'unknown',
                email: user.email || '',
                password: generatedPassword,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                accountType: AccountType.USER,
            });

        } catch (error) {
            console.error("Erreur lors de l'inscription avec Google:", error);
            setError("Erreur lors de l'inscription avec Google.");
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