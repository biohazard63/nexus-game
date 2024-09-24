'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {getUserById, updateUser} from '@/lib/actions/userActions';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'; // Dialog component for the modal

interface UserEditFormProps {
    userId: number,
    onUpdate?: (updatedUser: any) => void
}

export default function UserEditForm({userId, onUpdate}: UserEditFormProps) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modal
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUserById(userId);
                setUser(fetchedUser);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                setError('Erreur lors de la récupération des informations utilisateur.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateUser(userId, user);
            setIsModalOpen(false); // Fermer la modal après la mise à jour réussie
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            setError('Erreur lors de la mise à jour des informations utilisateur.');
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
                    Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white rounded-lg p-6 max-w-lg mx-auto">
                <Card className="bg-gray-800 text-white">
                    <CardHeader>
                        <CardTitle>Modifier l&apos;utilisateur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.profilePicture || ''} alt={user.username}/>
                                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.username}</h2>
                                    <Badge>{user.accountType}</Badge>
                                </div>
                            </div>

                            <Input
                                type="text"
                                value={user.username}
                                onChange={(e) => setUser({...user, username: e.target.value})}
                                placeholder="Nom d'utilisateur"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="text"
                                value={user.first_name || ''}
                                onChange={(e) => setUser({...user, first_name: e.target.value})}
                                placeholder="Prénom"
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="text"
                                value={user.last_name || ''}
                                onChange={(e) => setUser({...user, last_name: e.target.value})}
                                placeholder="Nom de famille"
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                placeholder="Email"
                                required
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

                            <Textarea
                                value={user.bio || ''}
                                onChange={(e) => setUser({...user, bio: e.target.value})}
                                placeholder="Bio"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
                            />

                            <Select onValueChange={(value) => setUser({...user, accountType: value})}>
                                <SelectTrigger className="bg-gray-700 border border-gray-600 text-white">
                                    <span>{user.accountType}</span>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border border-gray-600 text-white">
                                    <SelectItem value="USER">Utilisateur</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                type="text"
                                value={user.profilePicture || ''}
                                onChange={(e) => setUser({...user, profilePicture: e.target.value})}
                                placeholder="URL de l'image de profil"
                                className="bg-gray-700 border border-gray-600 text-white"
                            />

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