'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Fonction pour stocker les informations de l'utilisateur dans sessionStorage
    const storeUserInSession = (user: any) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('userId', user.uid);
            sessionStorage.setItem('email', user.email);
            sessionStorage.setItem('displayName', user.displayName || '');
            sessionStorage.setItem('photoURL', user.photoURL || '');
        }
    };

    const handleLogin = async () => {
        setError('');
        try {
            // Connexion avec email et mot de passe via Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Stocker les informations de l'utilisateur dans sessionStorage
            storeUserInSession(firebaseUser);

            // Redirection vers la page de compte
            router.push('/account');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const firebaseUser = userCredential.user;

            // Stocker les informations de l'utilisateur dans sessionStorage
            storeUserInSession(firebaseUser);

            // Redirection après connexion avec Google
            router.push('/account');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion avec Google.');
        }
    };

    const handleGithubLogin = async () => {
        const provider = new GithubAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const firebaseUser = userCredential.user;

            // Stocker les informations de l'utilisateur dans sessionStorage
            storeUserInSession(firebaseUser);

            // Redirection après connexion avec GitHub
            router.push('/account');
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la connexion avec GitHub.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-purple-900 to-black">
            <div className="mx-auto grid gap-6 p-6 bg-gray-800 rounded-lg shadow-2xl border border-purple-600">
                <div className="grid gap-2 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        Login
                    </h1>
                    <p className="text-gray-400">Entrez vos informations pour accéder à votre compte.</p>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-900 text-white placeholder-gray-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-indigo-400 hover:text-indigo-600 transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-900 text-white placeholder-gray-500"
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button onClick={handleLogin} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-all">
                        Se connecter
                    </Button>
                    <Button variant="outline" className="w-full border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors" onClick={handleGoogleLogin}>
                        Connexion avec Google
                    </Button>
                    <Button variant="outline" className="w-full border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors" onClick={handleGithubLogin}>
                        Connexion avec GitHub
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    Pas encore de compte ?{' '}
                    <Link href="/signup" className="text-indigo-400 hover:text-indigo-600 transition-colors">
                        Inscrivez-vous
                    </Link>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 lg:h-screen">
                <Image
                    src="/login.jpg"
                    alt="Gaming Background"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover opacity-50"
                />
            </div>
        </div>
    );
}

export default LoginForm;