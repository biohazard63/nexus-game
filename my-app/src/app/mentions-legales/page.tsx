
'use client';

import React from 'react';

export default function MentionsLegalesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <main className="flex-grow p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6">Mentions Légales</h1>
                <p className="mb-4">
                    Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique, nous portons à la connaissance des utilisateurs et visiteurs du site les informations suivantes :
                </p>

                {/* Section 1: Éditeur du site */}
                <h2 className="text-2xl font-bold mt-6 mb-4">1. Éditeur du site</h2>
                <p className="mb-4">
                    Nom de l&apos;entreprise : [Votre Entreprise]<br/>
                    Adresse : [Adresse complète]<br/>
                    Téléphone : [Numéro de téléphone]<br/>
                    Email : <a href="mailto:contact@votreentreprise.com" className="text-blue-400 hover:underline">contact@votreentreprise.com</a><br/>
                    Numéro de SIRET : [Votre numéro de SIRET]
                </p>

                {/* Section 2: Directeur de la publication */}
                <h2 className="text-2xl font-bold mt-6 mb-4">2. Directeur de la publication</h2>
                <p className="mb-4">
                    Nom : [Nom du directeur de la publication]<br/>
                    Email : <a href="mailto:directeur@votreentreprise.com" className="text-blue-400 hover:underline">directeur@votreentreprise.com</a>
                </p>

                {/* Section 3: Hébergeur du site */}
                <h2 className="text-2xl font-bold mt-6 mb-4">3. Hébergeur du site</h2>
                <p className="mb-4">
                    Nom de l&apos;hébergeur : [Nom de l&apos;hébergeur]<br/>
                    Adresse : [Adresse de l&apos;hébergeur]<br/>
                    Téléphone : [Numéro de téléphone de l&apos;hébergeur]
                </p>

                {/* Section 4: Propriété intellectuelle */}
                <h2 className="text-2xl font-bold mt-6 mb-4">4. Propriété intellectuelle</h2>
                <p className="mb-4">
                    [Indiquez que le site et son contenu sont protégés par les lois en vigueur sur la propriété intellectuelle.]
                </p>

                {/* Section 5: Limitation de responsabilité */}
                <h2 className="text-2xl font-bold mt-6 mb-4">5. Limitation de responsabilité</h2>
                <p className="mb-4">
                    [Déclarez les limitations de responsabilité concernant l&apos;utilisation du site.]
                </p>

                {/* Section 6: Droit applicable */}
                <h2 className="text-2xl font-bold mt-6 mb-4">6. Droit applicable</h2>
                <p className="mb-4">
                    [Précisez que le droit français est applicable.]
                </p>
            </main>
        </div>
    );
}