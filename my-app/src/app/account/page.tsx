'use client';

import { useState, useEffect } from 'react';
import { auth, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { updateDocument } from '@/lib/firestore';
import { getUserByFirebaseId, updateUser } from '@/server/user/updateUserAction';
import { Button } from '@/components/ui/button';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Image from "next/image";

export default function UpdateProfileForm() {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email || '');
                setUsername(currentUser.displayName || '');

                const postgresUser = await getUserByFirebaseId(currentUser.uid);
                if (postgresUser) {
                    setUserId(postgresUser.id);
                    setFirstName(postgresUser.first_name || '');
                    setLastName(postgresUser.last_name || '');
                    setBio(postgresUser.bio || '');
                    setPreviewImage(postgresUser.profilePicture || '');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let profilePictureURL = previewImage;

            if (profilePicture) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, profilePicture);
                profilePictureURL = await getDownloadURL(storageRef);
            }

            await updateProfile(user, {
                displayName: username,
                photoURL: profilePictureURL,
            });

            await updateDocument('users', user.uid, {
                username,
                firstName,
                lastName,
                bio,
                profilePicture: profilePictureURL,
                updatedAt: new Date(),
            });

            if (userId) {
                await updateUser(userId, {
                    firstName,
                    lastName,
                    email,
                    username,
                    bio,
                    profilePicture: profilePictureURL,
                });
            }

            setLoading(false);
            setOpen(false);  // Fermer le formulaire après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                    Modifier le profil
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border border-gray-700 shadow-2xl rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-indigo-400">Mettre à jour votre profil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        className="bg-gray-700 border border-gray-600 text-white"
                        required
                    />
                    <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                        className="bg-gray-700 border border-gray-600 text-white"
                        required
                    />
                    <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom"
                        className="bg-gray-700 border border-gray-600 text-white"
                        required
                    />
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="bg-gray-700 border border-gray-600 text-white"
                        required
                    />
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        rows={3}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
                    />
                    <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-white bg-gray-700 border border-gray-600"
                    />
                    {previewImage && <Image src={previewImage} alt="Prévisualisation" height={100} width={100} className="rounded-full w-24 h-24 mx-auto border-2 border-indigo-500" />}

                    <DialogFooter className="flex justify-end">
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all">
                            {loading ? 'Mise à jour...' : 'Mettre à jour'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}