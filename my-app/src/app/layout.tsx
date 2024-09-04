import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout'; // Créez un composant client séparé

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'My App',
    description: 'My awesome Next.js app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {/* ClientLayout gérera toute la logique client */}
        <ClientLayout>
            <main className="container mx-auto p-4">{children}</main>
        </ClientLayout>
        </body>
        </html>
    );
}