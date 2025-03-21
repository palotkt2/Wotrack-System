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

  const getTrackingUrl = (carrier, trackingNumber) => {
    if (carrier.toLowerCase() === 'fedex') {
      return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
    } else if (carrier.toLowerCase() === 'ups') {
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    }
    return '#';
  };

  return (
    <motion.div
      className="order-history-container min-h-screen flex flex-col items-center justify-top p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6">Shipped Orders History</h1>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {orders.length > 0 ? (
        <ul className="orders-list space-y-4 w-full max-w-2xl">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="order-item p-4 bg-white shadow rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold orders-list-title">
                    WO# {order.order_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.lastUpdate).toLocaleDateString('en-EN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {order.carrier && (
                    <p className="text-sm text-gray-600">
                      <b>Carrier:</b> {order.carrier}
                    </p>
                  )}
                  {order.tracking_number && (
                    <p className="text-sm text-gray-800">
                      <b>Tracking Number:</b>{' '}
                      <a
                        href={getTrackingUrl(
                          order.carrier,
                          order.tracking_number
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {order.tracking_number}
                      </a>
                    </p>
                  )}
                </div>
                <span
                  className={`order-status-badge orders-list-status p-2 ${statusHistory[order.status]} flex items-center justify-center rounded-full`}
                >
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No shipped orders found.</p>
      )}
    </motion.div>
  );
}
