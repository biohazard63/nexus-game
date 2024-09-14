'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGameById, updateGame } from '@/lib/actions/gameActions';
import { getCategories } from '@/lib/actions/categoryActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions
import { storage } from '@/lib/firebase'; // Import Firebase storage instance

interface GameEditFormProps {
    gameId: number;
    onUpdate?: (updatedGame: any) => void;
}

export default function GameEditForm({ gameId, onUpdate }: GameEditFormProps) {
    const [game, setGame] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Tableau des catégories sélectionnées
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store selected image
    const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour gérer l'ouverture/fermeture du dialog
    const router = useRouter();

    useEffect(() => {
        const fetchGameAndCategories = async () => {
            try {
                const fetchedGame = await getGameById(gameId);
                setGame(fetchedGame);
                setSelectedCategories(fetchedGame.categories?.map((cat: any) => cat.id) || []); // Remplir les catégories sélectionnées

                const categoriesList = await getCategories();
                setCategories(categoriesList);
            } catch (error) {
                setError('Erreur lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchGameAndCategories();
    }, [gameId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const uploadImage = async (file: File) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef); // Get the URL of the uploaded image
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = game.coverImage;

            if (selectedFile) {
                // If an image file is selected, upload it to Firebase Storage
                imageUrl = await uploadImage(selectedFile);
            }

            // Update the game with the new image URL and selected categories
            await updateGame(gameId, {
                ...game,
                coverImage: imageUrl,
                categoryIds: selectedCategories, // Envoyer les catégories sélectionnées
            });

            if (onUpdate) {
                onUpdate(game); // Optionnel si vous voulez gérer cela dans le parent
            }

            setIsDialogOpen(false); // Fermer la popup après mise à jour
            router.push('/admin/game'); // Rediriger vers la liste des jeux
        } catch (error) {
            setError('Erreur lors de la mise à jour du jeu.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (categoryId: number) => {
        // Ajouter ou retirer une catégorie dans la sélection multiple
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
                    Modifier le jeu
                </Button>
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
                                value={game?.name || ''}
                                onChange={(e) => setGame({ ...game, name: e.target.value })}
                                placeholder="Nom du jeu"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="text"
                                value={game?.type || ''}
                                onChange={(e) => setGame({ ...game, type: e.target.value })}
                                placeholder="Type du jeu"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />
                            <Input
                                type="number"
                                value={game?.player_max || '1'}
                                onChange={(e) => setGame({ ...game, player_max: parseInt(e.target.value, 10) })}
                                placeholder="Nombre de joueurs"
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Textarea
                                value={game?.description || ''}
                                onChange={(e) => setGame({ ...game, description: e.target.value })}
                                placeholder="Description"
                                rows={4}
                                className="w-full bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            {/* Multiselect for categories */}
                            <label htmlFor="categories" className="text-white mb-2">
                                Sélectionnez les catégories
                            </label>
                            <div className="max-h-48 overflow-y-auto bg-gray-700 border border-gray-600 p-2 rounded">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCategorySelect(category.id)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`category-${category.id}`} className="text-white">
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>

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