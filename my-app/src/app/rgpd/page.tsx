// pages/rgpd.tsx

'use client';

import React from 'react';

export default function RGPDPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <main className="flex-grow p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6">
                    Politique de Confidentialité
                </h1>
                <p className="mb-4">
                    Votre vie privée est importante pour nous. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons, et les droits dont vous disposez.
                </p>

                {/* Section 1: Collecte des informations */}
                <h2 className="text-2xl font-bold mt-6 mb-4">1. Collecte des informations</h2>
                <p className="mb-4">
                    [Décrivez les types de données personnelles que vous collectez auprès des utilisateurs, par exemple : nom, adresse e-mail, etc.]
                </p>

                {/* Section 2: Utilisation des informations */}
                <h2 className="text-2xl font-bold mt-6 mb-4">2. Utilisation des informations</h2>
                <p className="mb-4">
                    [Expliquez comment vous utilisez les données collectées, par exemple : pour améliorer les services, personnaliser l'expérience utilisateur, etc.]
                </p>

                {/* Section 3: Partage des informations */}
                <h2 className="text-2xl font-bold mt-6 mb-4">3. Partage des informations</h2>
                <p className="mb-4">
                    [Indiquez si vous partagez les données avec des tiers, et dans quelles conditions.]
                </p>

                {/* Section 4: Droits de l'utilisateur */}
                <h2 className="text-2xl font-bold mt-6 mb-4">4. Vos droits</h2>
                <p className="mb-4">
                    [Informez les utilisateurs de leurs droits en matière de protection des données, comme le droit d'accès, de rectification, de suppression, etc.]
                </p>

                {/* Section 5: Sécurité des données */}
                <h2 className="text-2xl font-bold mt-6 mb-4">5. Sécurité des données</h2>
                <p className="mb-4">
                    [Décrivez les mesures que vous prenez pour protéger les données personnelles des utilisateurs.]
                </p>

                {/* Section 6: Contact */}
                <h2 className="text-2xl font-bold mt-6 mb-4">6. Contact</h2>
                <p className="mb-4">
                    Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante :
                </p>
                <p className="mb-4">
                    Email : <a href="mailto:quentindevaulx63@gmail.com" className="text-blue-400 hover:underline">quentindevaulx63@gmail.com</a>
                </p>
            </main>
        </div>
    );
}