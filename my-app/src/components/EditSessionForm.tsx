'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Utilisation de `useParams` pour récupérer l'ID de l'URL
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSessionById, updateSession } from '@/lib/actions/sessionActions';
import {getUserIdByFirebaseId} from "@/lib/actions/userActions";

export default function EditSessionForm() {
    const [gameName, setGameName] = useState<string>('');
    const [typeSession, setTypeSession] = useState<string>('PUBLIC');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const { id: sessionId } = useParams(); // Utilisation de `useParams` pour obtenir l'ID de la session à partir de l'URL

    console.log('Session ID from URL:', sessionId);

    useEffect(() => {
        const loadSession = async () => {
            try {
                if (sessionId) {
                    const session = await getSessionById(parseInt(sessionId)); // Récupérer la session existante
                    console.log('Session récupérée:', session);

                    setGameName(session.game.name); // Récupérer le nom du jeu lié à cette session
                    setTypeSession(session.type_session);
                    setStartTime(new Date(session.startTime).toISOString().slice(0, 16)); // Formatter pour datetime-local
                    setEndTime(new Date(session.endTime).toISOString().slice(0, 16));
                    setLocation(session.location);
                    setDescription(session.description);
                } else {
                    console.error('Session ID is null.');
                }
            } catch (error) {
                console.error('Erreur lors du chargement de la session:', error);
            }
        };

        loadSession();
    }, [sessionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const firebaseId = sessionStorage.getItem('userId'); // Récupérer le firebase_id
            const hostId = await getUserIdByFirebaseId(firebaseId); // Récupérer l'ID utilisateur

            console.log('Host ID:', hostId);

            if (!hostId || !startTime || !endTime || !location || !description) {
                alert('Veuillez remplir tous les champs.');
                setLoading(false);
                return;
            }

            // Mettre à jour la session
            await updateSession(parseInt(sessionId as string), {
                hostId, // Utiliser l'ID de l'utilisateur
                type_session: typeSession,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                description,
            });

            router.push('/session');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la session:', error);
            alert('Impossible de mettre à jour la session.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Éditer la Session</h1>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <Label htmlFor="game" className="text-gray-300">Jeu</Label>
                    <Input
                        id="game"
                        value={gameName}
                        disabled // Désactiver l'édition car le jeu est lié à la session
                        className="bg-gray-900 text-white"
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="typeSession" className="text-gray-300">Type de Session</Label>
                    <Input
                        id="typeSession"
                        value={typeSession}
                        onChange={(e) => setTypeSession(e.target.value)}
                        className="bg-gray-900 text-white"
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="startTime" className="text-gray-300">Heure de début</Label>
                    <Input
                        id="startTime"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-gray-900 text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="endTime" className="text-gray-300">Heure de fin</Label>
                    <Input
                        id="endTime"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-gray-900 text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="location" className="text-gray-300">Localisation</Label>
                    <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-gray-900 text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-900 text-white"
                        required
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition-all">
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour la session'}
                </Button>
            </form>
        </div>
    );
}