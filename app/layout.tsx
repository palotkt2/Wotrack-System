import { Inter } from 'next/font/google';
import { ReactNode } from 'react'; // Importación necesaria
import Header from '../components/Header';
import AuthProvider from '../context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TrackOrders Pro',
  description: 'WO Track System',
};

// Definir tipo para las props
interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AuthProvider>
          <Header />
          <main className="container mx-auto p-4 bg-white">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}