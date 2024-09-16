'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Pour la navigation vers la page de création de compte
import Head from 'next/head'; // Pour ajouter des métadonnées SEO
import { getGames } from '@/lib/actions/gameActions'; // Action pour obtenir les derniers jeux
import { Button } from '@/components/ui/button'; // Utiliser un bouton de Shadcn/ui
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'; // Utiliser des cards de Shadcn/ui
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Plugin pour le défilement automatique

export default function Home() {
    const [latestGames, setLatestGames] = useState<any[]>([]);
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    useEffect(() => {
        const fetchLatestGames = async () => {
            try {
                const games = await getGames(); // Récupérer tous les jeux
                const sortedGames = games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Trier par date de création
                setLatestGames(sortedGames.slice(0, 10)); // Obtenir les 10 derniers jeux pour le carrousel
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux:', error);
            }
        };

        fetchLatestGames();
    }, []);

    return (
        <>
            {/* SEO Metadata */}
            <Head>
                <title>GameMaster - Découvrez et Collectionnez Vos Jeux Vidéo, Jeux de Société, et Jeux de Rôle</title>
                <meta
                    name="description"
                    content="GameMaster est votre plateforme ultime pour découvrir des jeux vidéo, des jeux de société, et des jeux de rôle. Créez votre compte gratuitement et explorez notre vaste collection de jeux. Partagez vos expériences et connectez-vous avec d'autres joueurs."
                />
                <meta
                    name="keywords"
                    content="jeux vidéo, jeux de société, jeux de rôle, collection de jeux, plateforme de jeux, communauté de joueurs, découvrir des jeux, jouer en ligne"
                />
                <meta name="author" content="GameMaster" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://www.gamemaster.com" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
                {/* Hero Section */}
                <section className="w-full text-center py-16 md:py-32">
                    <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 animate-fadeIn">
                        Bienvenue sur GameMaster
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slideUp">
                        Découvrez une plateforme unique dédiée à tous les passionnés de jeux. Que vous soyez amateur de{' '}
                        <strong>jeux vidéo</strong>, <strong>jeux de société</strong>, ou <strong>jeux de rôle</strong>,
                        GameMaster vous offre un espace pour explorer, collectionner, et partager vos jeux préférés.
                    </p>
                    <div className="mt-8 ">
                        <Link href={"/signup"}>
                            <Button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition duration-300">
                                Créer un compte
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Fonctionnalités Clés */}
                <section className="w-full py-16 md:py-32 bg-gray-800 text-center">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-8 animate-fadeIn">
                        Fonctionnalités Clés de GameMaster
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg animate-slideUp">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">
                                    Explorez une large sélection de jeux
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Accédez à une immense collection de <strong>jeux vidéo</strong>, de{' '}
                                    <strong>jeux de société</strong>, et de <strong>jeux de rôle</strong> soigneusement
                                    sélectionnés pour tous les goûts et niveaux.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg animate-slideUp">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">
                                    Créez et gérez votre collection de jeux
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Ajoutez vos jeux favoris à votre collection personnelle et suivez vos parties, que ce
                                    soit en solo ou avec vos amis.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg animate-slideUp">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">
                                    Connectez-vous avec d'autres passionnés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Partagez vos expériences de jeu, discutez des stratégies, et rencontrez une
                                    communauté dynamique de joueurs.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>



                {/* Comment ça marche */}
                <section className="w-full py-16 md:py-32  text-center">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-8 animate-fadeIn">Comment fonctionne GameMaster ?</h2>
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <div className="text-yellow-400 text-6xl font-bold mb-4">1</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Créez un compte gratuitement</h3>
                                <p className="text-gray-300">
                                    Inscrivez-vous et accédez à toutes les fonctionnalités de GameMaster en quelques
                                    clics.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-yellow-400 text-6xl font-bold mb-4">2</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Explorez et découvrez des jeux</h3>
                                <p className="text-gray-300">
                                    Parcourez notre catalogue de jeux et trouvez des titres adaptés à vos envies, que ce
                                    soit pour jouer seul ou en groupe.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-yellow-400 text-6xl font-bold mb-4">3</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Partagez et jouez avec d'autres
                                    joueurs</h3>
                                <p className="text-gray-300">
                                    Rejoignez des discussions passionnantes, jouez en ligne et partagez vos moments de
                                    jeu
                                    favoris.
                                </p>
                            </div>
                        </div>
                        <div className="mt-12 ">
                            <Link href={"/signup"}>
                                <Button
                                    className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition duration-300">
                                    Créer un compte
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Derniers jeux ajoutés avec un carrousel */}
                <section className="w-full py-16 md:py-32 bg-gray-900 text-center">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-8 animate-fadeIn">Derniers Jeux Ajoutés</h2>
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full max-w-4xl mx-auto"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="flex space-x-4">
                            {latestGames.map((game) => (
                                <CarouselItem key={game.id} className="w-1/3">
                                    <div className="p-4">
                                        <Card className="bg-gray-700 p-6 rounded-lg shadow-lg">
                                            <CardHeader>
                                                <CardTitle className="text-2xl font-bold text-white">
                                                    {game.name}
                                                </CardTitle>
                                                <CardDescription className="text-gray-400">
                                                    {game.categories && game.categories.length > 0
                                                        ? game.categories.map((category: any) => (
                                                            <span key={category.id} className="text-white bg-purple-600 px-2 py-1 rounded-lg mr-2">
                                                                  {category.name}
                                                              </span>
                                                        ))
                                                        : 'Aucune catégorie'}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-300 mb-4">{game.description}</p>
                                                {game.coverImage && (
                                                    <img
                                                        src={game.coverImage}
                                                        alt={game.name}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </section>

                {/* Futures fonctionnalités */}
                <section className="w-full py-16 md:py-32 bg-gray-800 text-center">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-8 animate-fadeIn">Futures Fonctionnalités</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">Chat room pour les jeux</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Discutez en temps réel avec d'autres joueurs, organisez des parties, et partagez des
                                    astuces dans des salons de discussion dédiés à chaque jeu.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">Garder l'inventaire de son personnage </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Suivez l'évolution de votre personnage dans les jeux de rôle, gardez une trace de
                                    l'équipement, des compétences, et des quêtes accomplies.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-transform duration-300 bg-gray-700 p-6 rounded-lg shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4 text-white">Système de Récompenses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Gagnez des points et débloquez des récompenses en accomplissant des défis et en jouant régulièrement sur GameMaster.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="w-full py-16 md:py-32 bg-purple-900 text-center">
                    <h2 className="text-4xl font-bold text-white mb-8 animate-fadeIn">Rejoignez la communauté GameMaster maintenant !</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Créez un compte gratuit et commencez à explorer des centaines de jeux dans notre bibliothèque dès aujourd'hui.
                        Ne manquez pas l'opportunité de faire partie d'une communauté dynamique de joueurs !
                    </p>
                    <Link href={"/signup"}>
                        <Button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition duration-300">
                            Créer un compte
                        </Button>
                    </Link>
                </section>

                {/* Footer */}
                <footer className="w-full py-6 bg-gray-900 text-center text-gray-500">
                    <p>&copy; 2024 GameMaster. Tous droits réservés. Une plateforme pour tous les passionnés de jeux.</p>
                </footer>
            </main>
        </>
    );
}