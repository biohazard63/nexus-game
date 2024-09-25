// components/AccountPage.tsx
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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    const userData = await getUserData(user.uid);
                    setUserDetails(userData);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données utilisateur :', error);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const refreshUserData = async () => {
        if (user) {
            const updatedUserData = await getUserData(user.uid);
            setUserDetails(updatedUserData);
        }
    };

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-indigo-900 to-black text-white">
            <div
                className="bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-3xl text-white border border-indigo-600 hover:shadow-indigo-700 transition-shadow">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Mon Compte
                </h1>
                {userDetails && (
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Informations du
                                compte</h2>
                            <p><strong className="text-green-400">Email :</strong> {user.email}</p>
                            <p><strong className="text-green-400">Nom d&apos;utilisateur :</strong> {userDetails.username}</p>
                            <p><strong className="text-green-400">Bio :</strong> {userDetails.bio || 'Aucune bio définie'}</p>
                            <p><strong className="text-green-400">Date de création :</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
                            <p><strong className="text-green-400">Rôle :</strong> {userDetails.role || 'Utilisateur'}</p> {/* Affichage du rôle */}
                            {userDetails.profilePicture && (
                                <div className="mt-4 flex justify-center">
                                    <Image
                                        src={userDetails.profilePicture}
                                        alt="Photo de profil"
                                        width={120}
                                        height={120}
                                        className="rounded-full border-4 border-indigo-500 shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Relations</h2>

                            <div className="mb-4">
                                <h3 className="text-md font-bold text-indigo-400">Groupes :</h3>
                                {userDetails.groups?.length > 0 ? (
                                    userDetails.groups.map((group: any) => <p key={group.id}
                                                                              className="pl-2 text-gray-300">{group.name}</p>)
                                ) : (
                                    <p className="text-gray-400">Aucun groupe</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-md font-bold text-indigo-400">Commentaires :</h3>
                                {userDetails.comments?.length > 0 ? (
                                    userDetails.comments.map((comment: any) => <p key={comment.id}
                                                                                  className="pl-2 text-gray-300">{comment.content}</p>)
                                ) : (
                                    <p className="text-gray-400">Aucun commentaire</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-md font-bold text-indigo-400">Ratings :</h3>
                                {userDetails.ratings?.length > 0 ? (
                                    userDetails.ratings.map((rating: any) => (
                                        <p key={rating.id} className="pl-2 text-gray-300">
                                            Note : <span className="text-yellow-400">{rating.rating}/5</span> - {rating.review}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Aucun avis</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <UpdateProfileForm onProfileUpdate={refreshUserData} />
                        </div>

                        <Button onClick={handleLogout}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors">
                            Déconnexion
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}