// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import {FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                {/* Logo ou Nom de l'application */}
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold">Nexus</h2>
                </div>

                {/* Liens de navigation */}
                <div className="mb-4 md:mb-0">
                    <nav className="flex space-x-4">
                        <Link href="/">
                            <span className="hover:text-yellow-400 cursor-pointer">Accueil</span>
                        </Link>
                        <Link href={"/contact"}>
                            <span className="hover:text-yellow-400 cursor-pointer">Contact</span>
                        </Link>
                        <Link href={"/mentions-legales"}>
                            <span className="hover:text-yellow-400 cursor-pointer">Mentions Légales</span>
                        </Link>
                        <Link href={"/rgpd"}>
                            <span className="hover:text-yellow-400 cursor-pointer">RGPD</span>
                        </Link>
                    </nav>
                </div>

                {/* Icônes de réseaux sociaux */}
                <div className="flex space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>

            {/* Informations légales */}
            <div className="mt-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Nom de l&apos;Application. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;