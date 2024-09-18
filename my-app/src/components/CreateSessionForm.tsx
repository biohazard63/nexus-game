'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSession } from '@/lib/actions/sessionActions';
import { getGames } from '@/lib/actions/gameActions';
import { getUserIdByFirebaseId } from '@/lib/actions/userActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CreateSessionForm() {
    const [games, setGames] = useState<any[]>([]);
    const [gameId, setGameId] = useState<number | null>(null);
    const [typeSession, setTypeSession] = useState<string>('PUBLIC');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [invitedUsers, setInvitedUsers] = useState<any[]>([]); // Liste des utilisateurs invités
    const [title, setTitle] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const gamesData = await getGames();
                setGames(gamesData);
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux:', error);
            }
        };

        loadInitialData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const firebaseId = sessionStorage.getItem('userId');

            if (!gameId || !firebaseId || !startTime || !endTime || !location || !description) {
                alert('Veuillez remplir tous les champs.');
                setLoading(false);
                return;
            }

            const userId = await getUserIdByFirebaseId(firebaseId);

            if (!userId) {
                alert('Utilisateur introuvable.');
                setLoading(false);
                return;
            }

            await createSession({
                gameId: gameId,
                hostId: userId,
                title: title,
                type_session: typeSession,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                description,
                // invitedUsers, // Liste des utilisateurs invités
            });

            alert('Session créée avec succès!');
            router.push('/session');
        } catch (error) {
            console.error('Erreur lors de la création de la session:', error);
            alert('Impossible de créer la session.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Créer une Session</h1>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <div >
                    <Label htmlFor="titel" className="text-gray-300">Titre de la session</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-900 text-white"
                        required
                    />
                </div>
                <div className="mb-6">
                    <Label htmlFor="game" className="text-gray-300">Jeu</Label>
                    <Select value={gameId?.toString()} onValueChange={(value) => setGameId(parseInt(value))}>
                        <SelectTrigger className="bg-gray-900 text-white">
                            <SelectValue placeholder="Sélectionner un jeu" />
                        </SelectTrigger>
                        <SelectContent>
                            {games.map((game) => (
                                <SelectItem key={game.id} value={game.id.toString()}>
                                    {game.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <Label htmlFor="typeSession" className="text-gray-300">Type de Session</Label>
                    <Select value={typeSession} onValueChange={(value) => setTypeSession(value)}>
                        <SelectTrigger className="bg-gray-900 text-white">
                            <SelectValue placeholder="Type de session" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PUBLIC">Public</SelectItem>
                            <SelectItem value="PRIVATE">Privée</SelectItem>
                        </SelectContent>
                    </Select>
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

                {/* Inviter des utilisateurs */}
                <div className="mb-6">
                    <Label htmlFor="invitedUsers" className="text-gray-300">Inviter des utilisateurs</Label>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 text-black">Sélectionner les utilisateurs</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Inviter des utilisateurs</DialogTitle>
                            </DialogHeader>
                            {/* Intégrer le composant de case à cocher ici */}
                        </DialogContent>
                    </Dialog>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition-all">
                    {loading ? 'Création en cours...' : 'Créer la session'}
                </Button>
            </form>
        </div>
    );
}