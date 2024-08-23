'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Connexion réussie!');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert('Connexion avec Google réussie!');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion avec Google.');
        }
    };

    const handleGithubLogin = async () => {
        const provider = new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert('Connexion avec GitHub réussie!');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion avec GitHub.');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Connexion</CardTitle>
                <CardDescription>
                    Entrez votre email ci-dessous pour vous connecter à votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" onClick={handleLogin}>
                    Connexion
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    Connexion avec Google
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGithubLogin}>
                    Connexion avec GitHub
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LoginForm;
