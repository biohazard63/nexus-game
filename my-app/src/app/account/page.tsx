'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUserData } from '@/lib/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import UpdateProfileForm from '@/components/UpdateProfileForm';

export default function AccountPage() {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [userDetails, setUserDetails] = useState<any>(null); // Détails de l'utilisateur Firestore
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Vérification de l'état d'authentification
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    const userData = await getUserData(user.uid); // Récupère les données utilisateur et ses relations
                    setUserDetails(userData);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données utilisateur :', error);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push('/login'); // Redirection si non connecté
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Fonction de callback pour mettre à jour les informations après modification du profil
    const refreshUserData = async () => {
        if (user) {
            const updatedUserData = await getUserData(user.uid);
            setUserDetails(updatedUserData);
        }
    };

    // Déconnexion
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">Mon Compte</h1>
                {userDetails && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold">Informations du compte</h2>
                            <p><strong>Email :</strong> {user.email}</p>
                            <p><strong>Nom d'utilisateur :</strong> {userDetails.username}</p>
                            <p><strong>Bio :</strong> {userDetails.bio || 'Aucune bio définie'}</p>
                            <p><strong>Date de création :</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
                            {userDetails.profilePicture && (
                                <Image
                                    src={userDetails.profilePicture}
                                    alt="Photo de profil"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            )}
                        </div>

                        {/* Groupes, Commentaires, Ratings, etc. */}
                        <div>
                            <h2 className="text-lg font-semibold">Relations</h2>
                            <h3>Groupes :</h3>
                            {userDetails.groups?.length > 0 ? (
                                userDetails.groups.map((group: any) => <p key={group.id}>{group.name}</p>)
                            ) : (
                                <p>Aucun groupe</p>
                            )}

                            <h3>Commentaires :</h3>
                            {userDetails.comments?.length > 0 ? (
                                userDetails.comments.map((comment: any) => <p key={comment.id}>{comment.content}</p>)
                            ) : (
                                <p>Aucun commentaire</p>
                            )}

                            <h3>Ratings :</h3>
                            {userDetails.ratings?.length > 0 ? (
                                userDetails.ratings.map((rating: any) => (
                                    <p key={rating.id}>Note : {rating.rating}/5 - {rating.review}</p>
                                ))
                            ) : (
                                <p>Aucun avis</p>
                            )}
                        </div>

                        {/* Formulaire de mise à jour du profil */}
                        <UpdateProfileForm onProfileUpdate={refreshUserData} />

                        <Button onClick={handleLogout} className="w-full bg-red-500 text-white">
                            Déconnexion
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}