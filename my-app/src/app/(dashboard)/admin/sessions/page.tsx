'use client';

import React, { useEffect, useState } from 'react';
import { getAllSessions, deleteSessionWithRelations } from '@/lib/actions/sessionActions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pagination } from '@/components/Pagination';
import AdminHeader from "@/components/AdminHeader";

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
            const updatedSessions = sessions.filter(session => session.id !== sessionId);
            setSessions(updatedSessions);

            // Ajuster la page actuelle si nécessaire
            const totalPages = Math.ceil(updatedSessions.length / itemsPerPage);
            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
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

    // Calculer les sessions à afficher pour la page actuelle
    const indexOfLastSession = currentPage * itemsPerPage;
    const indexOfFirstSession = indexOfLastSession - itemsPerPage;
    const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

    return (
        <div
            className="flex min-h-screen w-full flex-col bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <AdminHeader/>

            <main className="flex flex-1 flex-col gap-8 p-6 md:p-12">
                {/* Affichage en cartes sur les petits écrans */}
                <div className="md:hidden">
                    {currentSessions.map((session) => (
                        <div key={session.id} className="bg-gray-800 rounded-lg shadow-lg mb-4 p-4">
                            <h2 className="text-xl font-bold text-yellow-400">{session.title}</h2>
                            <p className="text-gray-300">Hôte : {session.host.username}</p>
                            <p className="text-gray-300">
                                Date de début : {new Date(session.startTime).toLocaleDateString()}
                            </p>
                            <div className="mt-4 flex flex-col space-y-2">
                                <Link href={`/session/edit/${session.id}`}>
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white w-full">
                                        Modifier
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(session.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white w-full"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    ))}
                    {/* Pagination */}
                    <Pagination
                        totalItems={sessions.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>

                {/* Affichage du tableau sur les écrans moyens et grands */}
                <div className="hidden md:block overflow-x-auto">
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
                        {currentSessions.map((session) => (
                            <tr key={session.id} className="hover:bg-purple-700/50 transition-all">
                                <td className="px-4 py-3 border-b border-gray-600">{session.title}</td>
                                <td className="px-4 py-3 border-b border-gray-600">{session.host.username}</td>
                                <td className="px-4 py-3 border-b border-gray-600">
                                    {new Date(session.startTime).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-600 flex space-x-2">
                                    <Link href={`/session/edit/${session.id}`}>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
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
                    {/* Pagination */}
                    <Pagination
                        totalItems={sessions.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </main>
        </div>
);
}