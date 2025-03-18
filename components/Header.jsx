'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css'; // Import the CSS file

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsLightboxOpen(true); // Open the lightbox
  };

  if (loading) return null;

  // Hide the menu and login button on the login page
  const isLoginPage = pathname === '/login';

  return (
    <header className="header-container">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={160}
              height={60}
              className="h-10 w-auto"
            />
          </Link>

          {!isLoginPage && (
            <div className="flex items-center gap-4">
              {/* Botón de menú hamburguesa */}
              <button onClick={toggleMenu} className="burger-menu-button">
                <span className={`icon-wrapper ${isOpen ? 'rotate' : ''}`}>
                  {isOpen ? (
                    <FaTimes className="icon-class" />
                  ) : (
                    <FaBars className="icon-class" />
                  )}
                </span>
              </button>

              {/* Menú desplegable */}
              <div className={`burger-menu-content ${isOpen ? 'open' : ''}`}>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/orders">Orders</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="https://benchpro.com">Go to BenchPro</Link>
                  </li>
                </ul>
              </div>

              {/* Opciones de usuario */}
              {user ? (
                <>
                  <span className="text-gray-600">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
      {isLightboxOpen && (
        <div className="lightbox">
          <div className="lightbox-content">
            <h2 className="text-gray-900">Logout</h2>
            <p className="text-gray-700">
              See you later!, place a new order or login again
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
