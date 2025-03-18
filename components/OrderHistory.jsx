'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrdersHistory.css'; // Import the CSS file

export default function OrderHistory() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      fetchUserOrders(user.id);
    }
  }, [user, loading]);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        const shippedOrders = data.orders.filter(
          (order) => order.status === 'Shipped'
        );
        setOrders(shippedOrders);
        setError('');
      } else {
        setOrders([]);
        setError(data.error || 'Error fetching orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setError('Error fetching orders');
    }
  };

  return (
    <div className="order-history-container min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Shipped Order History</h1>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Last Update</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.status}</td>
                <td>
                  {new Date(order.lastUpdate).toLocaleDateString('en-EN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>{order.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No shipped orders found.</p>
      )}
    </div>
  );
}
