'use client';

import React, { useEffect, useState } from 'react';
import { getPublicSessions } from '@/lib/actions/sessionActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { getCategories } from '@/lib/actions/categoryActions'; // Importer l'action pour récupérer les catégories

export default function PublicSessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]); // Liste des catégories (genres)
    const [selectedGenre, setSelectedGenre] = useState<string>(''); // Filtre par genre
    const [selectedType, setSelectedType] = useState<string>(''); // Filtre par type de jeu
    const [gameTypes, setGameTypes] = useState<string[]>([]); // Liste des types de jeux
    const router = useRouter();

    console.log(sessions);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const result = await getPublicSessions(); // Récupère les sessions publiques
                setSessions(result);
                setFilteredSessions(result); // Initialement, toutes les sessions sont affichées
            } catch (error) {
                console.error('Erreur lors de la récupération des sessions :', error);
                setError('Impossible de récupérer les sessions.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const result = await getCategories(); // Récupère les catégories (genres)
                setCategories(result);
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories :', error);
            }
        };

        const fetchGameTypes = () => {
            // Simuler les types de jeux en récupérant directement depuis la base de données ou en utilisant une enum dans Prisma.
            setGameTypes(['Jeu Vidéo', 'Jeu de Société', 'Jeu de Rôle']); // Remplacer par les types réels si nécessaire
        };

        fetchSessions();
        fetchCategories();
        fetchGameTypes(); // Récupérer les types de jeux disponibles
    }, []);

    // Fonction pour filtrer les sessions en fonction du genre et du type
    useEffect(() => {
        const filtered = sessions.filter((session) => {
            const matchesGenre = selectedGenre
                ? session.game.categories.some(category => category.category.name === selectedGenre)
                : true;
            const matchesType = selectedType
                ? session.game.type === selectedType
                : true;
            return matchesGenre && matchesType;
        });
        setFilteredSessions(filtered);
    }, [selectedGenre, selectedType, sessions]);

    if (loading) {
        return <p>Chargement des sessions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-yellow-400">Sessions Publiques Disponibles</h1>

            {/* Filtres */}
            <div className="flex justify-between mb-6 w-full max-w-6xl">
                <div className="w-1/2 pr-2">
                    <label className="block text-yellow-400 mb-2">Filtrer par Genre</label>
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-lg"
                    >
                        <option value="">Tous les genres</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2 pl-2">
                    <label className="block text-yellow-400 mb-2">Filtrer par Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-lg"
                    >
                        <option value="">Tous les types</option>
                        {gameTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Affichage des sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {filteredSessions.map((session) => (
                    <Card key={session.id} className="bg-gray-800 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-yellow-400">{session.title}</CardTitle>
                            <CardDescription className="text-gray-300">Jeu : {session.game.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 mb-4">Hôte : {session.host.username}</p>
                            {session.game.coverImage && (
                                <Image src={session.game.coverImage} alt={session.game.name} width={300} height={200} />
                            )}
                            <p className="text-gray-400 mb-4">Date de début : {new Date(session.startTime).toLocaleDateString()}</p>
                            <p className="text-gray-400 mb-4">Description : {session.description}</p>
                            <p className="text-gray-400 mb-4">Lieu : {session.location}</p>
                            <p className="text-gray-400 mb-4">Participants : {session.participations ? session.participations.length : 0}</p>

                            <Link href={`/session/${session.id}`}>
                                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black w-full">Demander à rejoindre</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}