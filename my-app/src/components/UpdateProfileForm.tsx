'use client';

import { useState, useEffect } from 'react';
import { auth, storage } from '@/lib/firebase'; // Importez Firebase Storage
import { updateProfile } from 'firebase/auth';
import { updateDocument, getDocumentById } from '@/lib/firestore'; // Mises à jour dans Firestore
import { Button } from '@/components/ui/button';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Pour gérer le téléchargement d'image
import Image from 'next/image';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog'; // Assurez-vous d'avoir ces composants pour gérer la modale

export default function UpdateProfileModal({ onProfileUpdate }: { onProfileUpdate: () => void }) {
    const [user, setUser] = useState<any>(null); // Utilisateur Firebase
    const [username, setUsername] = useState(''); // Nom d'utilisateur
    const [bio, setBio] = useState(''); // Bio
    const [profilePicture, setProfilePicture] = useState<File | null>(null); // Fichier image pour la photo de profil
    const [previewImage, setPreviewImage] = useState(''); // Prévisualisation de l'image
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(''); // Message de confirmation ou d'erreur

    // Récupération des informations de l'utilisateur connecté
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Récupérer les informations supplémentaires de Firestore
                    const userDetails = await getDocumentById('users', currentUser.uid);
                    setUsername(userDetails.username || '');
                    setBio(userDetails.bio || '');
                    setPreviewImage(userDetails.profilePicture || ''); // Charger l'image actuelle si elle existe
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur :', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, []);

    // Gérer la sélection d'image et la prévisualisation
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file); // Stocke le fichier image
            setPreviewImage(URL.createObjectURL(file)); // Prévisualise l'image
        }
    };

    // Gérer la mise à jour du profil utilisateur
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            let profilePictureURL = previewImage; // Utilise l'image actuelle si elle n'a pas été changée

            // Si une nouvelle image est sélectionnée, téléchargez-la
            if (profilePicture) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`); // Créer une référence dans Firebase Storage
                await uploadBytes(storageRef, profilePicture); // Télécharge l'image
                profilePictureURL = await getDownloadURL(storageRef); // Récupère l'URL de l'image téléchargée
            }

            // Mise à jour dans Firebase Authentication (par exemple, si vous modifiez le displayName)
            if (user) {
                await updateProfile(user, {
                    displayName: username,
                    photoURL: profilePictureURL,
                });
            }

            // Mise à jour dans Firestore
            await updateDocument('users', user.uid, {
                username,
                bio,
                profilePicture: profilePictureURL,
                updatedAt: new Date(),
            });

            setMessage('Profil mis à jour avec succès !');
            onProfileUpdate(); // Appeler la fonction de rappel pour rafraîchir les données
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
            setMessage('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
        }
    };

    if (loading) {
        return <p>Chargement des informations...</p>;
    }

    return (
        <Dialog>
            {/* Bouton pour ouvrir la modale */}
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white">Modifier le profil</Button>
            </DialogTrigger>

            {/* Contenu de la modale */}
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle>Mettre à jour mon profil</DialogTitle>
                    <DialogClose />
                </DialogHeader>

                {/* Formulaire de mise à jour du profil */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Nom d'utilisateur */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            rows={4}
                        />
                    </div>

                    {/* Téléchargement de la photo de profil */}
                    <div>
                        <label htmlFor="profilePicture" className="block text-sm font-medium">
                            Photo de profil
                        </label>
                        <input
                            id="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Prévisualisation de la photo de profil"
                                width={100}
                                height={100}
                                className="rounded-full mt-2"
                            />
                        )}
                    </div>

                    {/* Message de confirmation */}
                    {message && <p className="text-green-600">{message}</p>}

                    {/* Bouton de soumission */}
                    <Button type="submit" className="w-full bg-blue-500 text-white">
                        Mettre à jour le profil
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}