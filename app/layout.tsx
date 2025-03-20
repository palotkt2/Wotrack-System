import { Inter } from 'next/font/google';
import { ReactNode } from 'react'; // Necessary import
import Header from '../components/Header';
import AuthProvider from '../context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Track Orders Pro',
  description: 'WO Track System',
};

// Define type for props
interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen container p-4 bg-white">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
