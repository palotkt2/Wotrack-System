'use client';
import { useState, useEffect } from 'react';
import OrderForm from '../components/OrderForm';
import OrderStatus from '../components/OrderStatus';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface OrderType {
  id: string;
  customer: string;
  status: string;
  lastUpdate: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  history?: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [error, setError] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSearch = async (orderId: string) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error searching for order');
      }

      const data: OrderType = await response.json();
      setOrder(data);
      setError('');
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch order details';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      setOrder(null);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-4 text-blue-600">
        WO Status
      </h1>
      <OrderForm onSearch={handleSearch} />

      {searchLoading && (
        <div className="text-center my-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-red-400 text-red-700 p-4 rounded-lg mb-4">
          ⚠️ {error}
        </div>
      )}

      {order && <OrderStatus order={order} />}
    </main>
  );
}
