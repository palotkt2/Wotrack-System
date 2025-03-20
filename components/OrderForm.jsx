'use client';
import { useState, useEffect } from 'react';

export default function OrderForm({ onSearch, userId }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Función para obtener las órdenes del usuario logueado
    const fetchUserOrders = async () => {
      try {
        const response = await getUserOrders(userId);
        setOrders(response.orders);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    fetchUserOrders();
  }, [userId]);

  const validateOrderId = (orderId) => {
    const regex = /^[A-Z0-9-]{6,12}$/;
    return regex.test(orderId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedId = input.trim().toUpperCase();

    if (!cleanedId) {
      setError('Please enter a WO number');
      return;
    }

    if (!validateOrderId(cleanedId)) {
      setError('Invalid format (valid example: ABC-1234)');
      return;
    }

    setError('');
    onSearch(cleanedId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <input
          type="tel"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: 230596"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Show Status
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
