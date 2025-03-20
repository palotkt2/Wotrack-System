'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import '../../styles/Login.css'; // Import the CSS file

export default function LoginPage() {
  const { user, login, loading } = useAuth(); // add login  here
  const [error, setError] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (credentials) => {
    const result = await login(credentials); //  call login function
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-top justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Login</h2>
        </div>

        <AuthForm onSubmit={handleSubmit} error={error} buttonText="Login" />

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="#"
            className="text-blue-600 hover:text-blue-500"
            onClick={() => setIsLightboxOpen(true)}
          >
            Request access{' '}
          </Link>
        </p>
      </div>

      {isLightboxOpen && (
        <div className="lightbox">
          <div className="lightbox-content">
            <h2 className="text-gray-900">Request Access</h2>
            <p className="text-gray-700">
              Need Assistance? (888) 700-9888 Please contact your sales
              representative for access credentials.
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
    </motion.div>
  );
}
