'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, login, loading } = useAuth(); // Añadir login aquí
  const [error, setError] = useState('');
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
    const result = await login(credentials); // Ahora login está definido
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Login
          </h2>
        </div>
        
        <AuthForm 
          onSubmit={handleSubmit} 
          error={error} 
          buttonText="Login"
        />
        
        <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
          <Link 
            href="#" 
            className="text-blue-600 hover:text-blue-500"
            onClick={() => alert('Contact your sales rep')}
          >
        Request access          </Link>
        </p>
      </div>
    </div>
  );
}