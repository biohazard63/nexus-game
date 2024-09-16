'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simuler un envoi de formulaire
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Message envoyé avec succès !');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-black p-6 md:p-12 text-white">
            <Card className="bg-gray-800 text-white shadow-2xl transform transition duration-500 hover:scale-105 rounded-lg max-w-5xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Texte à gauche */}
                    <div className="p-6 md:p-12 flex flex-col justify-center bg-gray-700 rounded-t-lg md:rounded-tr-none md:rounded-l-lg">
                        <h2 className="text-yellow-400 text-3xl font-extrabold mb-4">
                            Vous avez une question ?
                        </h2>
                        <p className="text-gray-300 mb-6">
                            N'hésitez pas à nous contacter ! Nous sommes là pour répondre à toutes vos questions à propos
                            de nos services ou pour vous aider à mieux comprendre GameMaster.
                        </p>
                        <p className="text-gray-300">
                            Que ce soit pour une question technique, des suggestions ou tout simplement pour discuter de
                            vos jeux préférés, nous serions ravis de vous entendre !
                        </p>
                    </div>

                    {/* Formulaire à droite */}
                    <CardContent className="p-6 md:p-12">
                        <CardHeader>
                            <CardTitle className="text-center text-yellow-400 text-3xl font-extrabold mb-4">
                                Contactez-nous
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-lg font-medium text-gray-300">
                                    Nom
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                    required
                                    className="mt-2 bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-gray-300">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Votre email"
                                    required
                                    className="mt-2 bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-lg font-medium text-gray-300">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Votre message"
                                    required
                                    rows={6}
                                    className="mt-2 bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition duration-300"
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}