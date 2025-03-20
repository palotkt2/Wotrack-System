'use client';

import { FaShippingFast, FaCog } from 'react-icons/fa'; // Import the icons
import '../styles/OrderStatus.css'; // Import the CSS file

export default function StatusTimeline({ history }) {
  const statusHistory = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-green-100 text-white-800',
  };
  // Verificar si history existe y es un array
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">No changes available</div>
    );
  }

  return (
    <div className="ml-4 border-l-2 border-gray-200 pl-6">
      {history.map((event, index) => (
        <div key={index} className="relative pb-6">
          <div className="absolute -left-[9px] top-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white" />
          <div className="space-y-1">
            <h3 className="order-status-history font-semibold text-gray-900">
              <span
                className={`order-status-badge ${statusHistory[event.status]} flex items-center justify-center`}
              >
                {event.status}
                {event.status === 'Shipped' && (
                  <FaShippingFast className="icon-shipping-class ml-2 text-lg text-green-500" />
                )}
                {event.status === 'Processing' && (
                  <FaCog className="icon-processing-class ml-2 text-lg text-yellow-500" />
                )}
              </span>
            </h3>
            <time className="text-sm text-gray-600">
              {new Date(event.timestamp).toLocaleDateString('en-EN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            <p className="text-sm text-gray-500">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
