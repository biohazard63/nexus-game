import './globals.css';
import { Analytics } from "@vercel/analytics/react"
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout'; // Créez un composant client séparé

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'My Game App',
    description: 'Welcome to the ultimate gaming experience!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gradient-to-r from-black via-gray-900 to-blue-900 text-white`}>
        {/* ClientLayout gérera toute la logique client */}
        <ClientLayout>
            <main className=" mx-auto p-4 bg-gray-800 rounded-lg shadow-lg ">
                {children}
                <Analytics />
            </main>
        </ClientLayout>
        </body>
        </html>
    );
}