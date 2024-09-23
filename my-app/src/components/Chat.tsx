import { useEffect, useState } from 'react';
import { getChatMessages, sendChatMessage } from '@/lib/actions/chatActions';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Chat({ sessionId, userId }: { sessionId: number, userId: number }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fonction pour charger les messages avec polling
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const chatMessages = await getChatMessages(sessionId);
                setMessages(chatMessages);
            } catch (error) {
                console.error('Erreur lors du chargement des messages:', error);
            }
        };

        // Polling des messages toutes les 5 secondes
        const intervalId = setInterval(loadMessages, 2000);

        // Charger immédiatement les messages
        loadMessages();

        // Nettoyer l'intervalle lorsque le composant est démonté
        return () => clearInterval(intervalId);
    }, [sessionId]);

    // Envoyer un message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        setLoading(true);
        try {
            const message = await sendChatMessage(sessionId, userId, newMessage);
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
            <div className="overflow-y-auto flex-grow mb-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start ${
                            message.userId === userId ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {message.userId !== userId && (
                            <Avatar className="mr-2">
                                {message.user.profilePicture ? (
                                    <AvatarImage src={message.user.profilePicture} alt={message.user.username} />
                                ) : (
                                    <AvatarFallback>{message.user.username.charAt(0)}</AvatarFallback>
                                )}
                            </Avatar>
                        )}
                        <div
                            className={`p-3 rounded-lg max-w-xs ${
                                message.userId === userId
                                    ? 'bg-blue-500 text-white ml-auto'
                                    : 'bg-gray-600 text-white'
                            }`}
                        >
                            {message.userId !== userId && (
                                <p className="text-yellow-400 font-bold">{message.user.username}</p>
                            )}
                            <p>{message.message}</p>
                            <p className="text-xs text-gray-300 text-right">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        {message.userId === userId && (
                            <Avatar className="ml-2">
                                {message.user.profilePicture ? (
                                    <AvatarImage src={message.user.profilePicture} alt={message.user.username} />
                                ) : (
                                    <AvatarFallback>{message.user.username.charAt(0)}</AvatarFallback>
                                )}
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-md bg-gray-700 text-white"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-black" disabled={loading}>
                    Envoyer
                </Button>
            </div>
        </div>
    );
}