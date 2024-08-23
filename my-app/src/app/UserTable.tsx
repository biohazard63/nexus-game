'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as User[];
                setUsers(usersData);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs : ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Chargement des utilisateurs...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Liste des utilisateurs</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Prénom</th>
                        <th className="px-4 py-2 border-b">Nom</th>
                        <th className="px-4 py-2 border-b">Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-4 py-2 border-b">{user.firstName}</td>
                            <td className="px-4 py-2 border-b">{user.lastName}</td>
                            <td className="px-4 py-2 border-b">{user.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
