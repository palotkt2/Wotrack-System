'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/OrdersHistory.css'; // Import the CSS file

export default function OrderHistory() {
  const statusHistory = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-green-100 text-white-800',
    Hold: 'bg-blue-100 text-white-800',
  };
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
    <motion.div
      className="order-history-container min-h-screen flex flex-col items-center justify-top"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Shipped Orders History</h1>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>WO#</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  <>
                    <b>{order.order_id}</b>
                  </>
                </td>
                <td>
                  <span
                    className={`order-status-badge p-3 ${statusHistory[order.status]} flex items-center justify-center`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {new Date(order.lastUpdate).toLocaleDateString('en-EN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No shipped orders found.</p>
      )}
    </motion.div>
  );
}
