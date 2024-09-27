// pages/404.tsx

import React from 'react';

export default function Custom404() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
            <main className="flex-grow p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6">
                    Page Non Trouvée
                </h1>
                <p className="mb-4">
                    Désolé, la page que vous recherchez n&apos;existe pas.
                </p>
            </main>
        </div>
    );
}