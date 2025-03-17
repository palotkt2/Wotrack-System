'use client';
import { useState } from 'react';
import StatusTimeline from './StatusTimeline';
import './OrderStatus.css'; // Import the CSS file

export default function OrderStatus({ order }) {
  const [input, setInput] = useState(''); // Define the input state

  const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-green-100 text-white-800',
  };

  return (
    <div className="order-status-container">
      <div className="order-status-header">
        <h2 className="order-status-title">
          WO# {order.order_id}
          <span className={`order-status-badge ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </h2>
      </div>

      <div className="order-status-body">
        <div className="order-status-grid">
          <div>
            <h3 className="order-status-subtitle">Customer</h3>
            <p>{order.customer}</p>
          </div>
          <div>
            <h3 className="order-status-subtitle">Last Update</h3>
            <p>
              {new Date(order.lastUpdate).toLocaleDateString('en-EN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {order.status === 'Shipped' && (
          <div className="order-status-grid">
            <div>
              <h3 className="order-status-subtitle">Carrier</h3>
              <p>{order.carrier}</p>
            </div>
            <div>
              <h3 className="order-status-subtitle">Tracking Number</h3>
              <p>{order.tracking_number}</p>
            </div>
          </div>
        )}

        <StatusTimeline history={order.history} />

        <div>
          <h3 className="order-status-subtitle">Products</h3>
          <ul className="order-status-products">
            {order.items &&
              order.items.map((item, index) => (
                <li key={index} className="order-status-product-item">
                  <span>{item.product_name}</span>
                  <span className="order-status-product-quantity">
                    {item.quantity} EA
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
