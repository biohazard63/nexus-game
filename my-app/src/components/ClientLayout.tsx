'use client';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import {Button} from "@/components/ui/button";
import {NavBar} from "@/components/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
                <Header />
                {children}
            </div>
        </ThemeProvider>
    );
}

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex justify-between items-center p-4 shadow-md">
            <h1 className="text-2xl font-bold">Mon Application</h1>
            <NavBar />
            <Button onClick={toggleTheme} className="p-2 bg-blue-500 text-white rounded">
                {theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
            </Button>
        </header>
    );
};