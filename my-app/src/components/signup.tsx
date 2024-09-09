// src/components/SignUpForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserOnServer } from '@/server/user/signupAction';
import { AccountType } from '@prisma/client';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Crée un utilisateur dans Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Ajout de l'utilisateur dans Firestore
            await addUserToFirestore(user.uid, {
                firstName,
                lastName,
                email,
                role: 'user',
                createdAt: new Date().toISOString(),
            });

            // Ajout de l'utilisateur dans PostgreSQL avec le uid de Firebase (firebase_id)
            await createUserOnServer({
                username: email.split('@')[0],
                email,
                password,
                firstName,
                lastName,
                accountType: AccountType.USER,
                firebase_id: user.uid, // Transmettre le firebase_id ici
            });

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

            // Ajout de l'utilisateur dans Firestore
            await addUserToFirestore(user.uid, {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                role: 'user',
                createdAt: new Date().toISOString(),
            });

            // Ajout de l'utilisateur dans PostgreSQL avec le uid de Firebase
            await createUserOnServer({
                username: user.email?.split('@')[0] || 'unknown',
                email: user.email || '',
                password: generatedPassword,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                accountType: AccountType.USER,
                firebase_id: user.uid, // Transmettre le firebase_id ici
            });

        } catch (error) {
            console.error("Erreur lors de l'inscription avec Google:", error);
            setError("Erreur lors de l'inscription avec Google.");
        }
    };

    return (
        <Card className="mx-auto max-w-sm bg-gradient-to-r from-purple-900 to-black text-white shadow-2xl">
            <CardHeader>
                <CardTitle className="text-xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">Inscription</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Entrez vos informations pour créer un compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name" className="text-gray-400">Prénom</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="bg-gray-800 border border-gray-700"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name" className="text-gray-400">Nom</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-gray-800 border border-gray-700"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-400">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-800 border border-gray-700"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-400">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-800 border border-gray-700"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold hover:from-pink-700 hover:to-purple-800">
                            Créer un compte
                        </Button>
                        <Button variant="outline" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800" onClick={handleGoogleSignUp}>
                            Inscription avec Google
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Vous avez déjà un compte ?{' '}
                    <Link href="/login" className="underline text-purple-400 hover:text-purple-500">
                        Se connecter
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default SignUpForm;