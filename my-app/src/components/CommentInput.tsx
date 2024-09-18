'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { addCommentToSession } from '@/lib/actions/commentActions'; // Action pour ajouter un commentaire

export default function CommentInput({ sessionId, userId }: { sessionId: number, userId: number }) {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            if (!comment.trim()) {
                setError('Le commentaire ne peut pas être vide.');
                setLoading(false);
                return;
            }

            await addCommentToSession(sessionId, userId, comment); // Action pour envoyer le commentaire
            setComment(''); // Réinitialiser le champ après soumission
        } catch (error) {
            setError('Erreur lors de l\'envoi du commentaire.');
        }

        setLoading(false);
    };

    return (
        <Card className="bg-gray-900 p-6 mt-6">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Ajouter un commentaire</h3>
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écrivez votre commentaire ici..."
                className="mb-4"
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleSubmit} disabled={loading} className="bg-yellow-500 text-black">
                {loading ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
        </Card>
    );
}