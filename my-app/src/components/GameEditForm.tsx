'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {getGameById, updateGame} from '@/lib/actions/gameActions'; // Actions pour obtenir et mettre à jour un jeu
import {getCategories} from '@/lib/actions/categoryActions'; // Action pour récupérer les catégories
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectTrigger, SelectContent, SelectItem} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'; // Ajout de Dialog pour la modale

interface GameEditFormProps {
    gameId: number,
    onUpdate?: (updatedGame: any) => void
}

export default function GameEditForm({gameId, onUpdate}: GameEditFormProps) {
    const [game, setGame] = useState<any>(null); // Stocker les données du jeu
    const [categories, setCategories] = useState<any[]>([]); // Liste des catégories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Charger les détails du jeu et les catégories disponibles
    useEffect(() => {
        const fetchGameAndCategories = async () => {
            try {
                const fetchedGame = await getGameById(gameId);
                setGame(fetchedGame);

                const categoriesList = await getCategories();
                setCategories(categoriesList);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError('Erreur lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchGameAndCategories();
    }, [gameId]);

    // Gérer la mise à jour du jeu
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateGame(gameId, game);
            router.push('/admin/game'); // Rediriger après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour du jeu :', error);
            setError('Erreur lors de la mise à jour du jeu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">Modifier le jeu</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white rounded-lg p-6 max-w-lg mx-auto">
                <Card className="bg-gray-800 text-white">
                    <CardHeader>
                        <CardTitle>Modifier le jeu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input
                                type="text"
                                value={game.name}
                                onChange={(e) => setGame({...game, name: e.target.value})}
                                placeholder="Nom du jeu"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="text"
                                value={game.type}
                                onChange={(e) => setGame({...game, type: e.target.value})}
                                placeholder="Type du jeu"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Textarea
                                value={game.description}
                                onChange={(e) => setGame({...game, description: e.target.value})}
                                placeholder="Description"
                                rows={4}
                                className="w-full bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="text"
                                value={game.coverImage || ''}
                                onChange={(e) => setGame({...game, coverImage: e.target.value})}
                                placeholder="URL de l'image de couverture"
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Select
                                value={game.categoryId?.toString() || ''}
                                onValueChange={(value) => setGame({...game, categoryId: parseInt(value, 10)})}
                            >
                                <SelectTrigger className="bg-gray-700 border border-gray-600 text-white">
                                    <span>{categories.find((cat) => cat.id === game.categoryId)?.name || 'Sélectionnez une catégorie'}</span>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border border-gray-600 text-white">
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button type="submit" disabled={loading} className="bg-purple-700 text-white">
                                {loading ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}