'use client';

import React, { useEffect, useState } from 'react';
import {getAllSessions,  deleteSessionWithRelations} from '@/lib/actions/sessionActions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const result = await getAllSessions();
                setSessions(result);
            } catch (error) {
                console.error('Erreur lors de la récupération des sessions :', error);
                setError('Impossible de récupérer les sessions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleDelete = async (sessionId: number) => {
        try {
            await deleteSessionWithRelations(sessionId);
            setSessions(sessions.filter(session => session.id !== sessionId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la session :', error);
            setError('Impossible de supprimer la session.');
        }
    };

    if (loading) {
        return <p className="text-white">Chargement des sessions...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-black min-h-screen text-white">
            <h1 className="text-3xl font-extrabold text-yellow-400 mb-6">Gestion des Sessions</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <thead>
                    <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left text-yellow-400 font-bold">Titre</th>
                        <th className="px-4 py-2 text-left text-yellow-400 font-bold">Hôte</th>
                        <th className="px-4 py-2 text-left text-yellow-400 font-bold">Date de début</th>
                        <th className="px-4 py-2 text-left text-yellow-400 font-bold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-purple-700/50 transition-all">
                            <td className="px-4 py-3 border-b border-gray-600">{session.title}</td>
                            <td className="px-4 py-3 border-b border-gray-600">{session.host.username}</td>
                            <td className="px-4 py-3 border-b border-gray-600">
                                {new Date(session.startTime).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-600 flex space-x-2">
                                <Link href={`/session/edit/${session.id}`}>
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                                        Modifier
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(session.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}