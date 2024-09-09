'use client';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Button } from "@/components/ui/button";
import { Header as NavBarHeader } from "@/components/NavBar"; // Renommez l'import pour éviter le conflit
import { Moon, Sun } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white">
                <NavBarHeader /> {/* Utilisation du Header importé sous un autre nom */}
                <main className="p-4">{children}</main>
            </div>
        </ThemeProvider>
    );
}

// Renommez la fonction locale
const ThemeHeader = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex justify-between items-center p-6 bg-gray-800 shadow-lg border-b border-purple-500">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                Nexus
            </h1>
            <NavBarHeader />
            <Button
                onClick={toggleTheme}
                className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all"
            >
                {theme === 'light' ? <Sun /> : <Moon />}
            </Button>
        </header>
    );
};