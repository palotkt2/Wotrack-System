'use client';
import StatusTimeline from './StatusTimeline';
import { FaShippingFast, FaCog, FaPauseCircle } from 'react-icons/fa'; // Import the icons
import '../styles/OrderStatus.css'; // Import the CSS file

export default function OrderStatus({ order }) {
  const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-green-100 text-white-800',
    Hold: 'bg-blue-100 text-black-800',
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
    <div className="order-status-container">
      <div className="order-status-header">
        <h2 className="order-status-title">
          WO# {order.order_id}
          <span
            className={`order-status-badge ${statusColors[order.status]} flex items-center justify-center`}
          >
            {order.status === 'Shipped' && (
              <FaShippingFast className="icon-shipping-class mr-2 text-2xl text-green-500" />
            )}
            {order.status === 'Processing' && (
              <FaCog className="icon-processing-class mr-2 text-2xl text-yellow-500" />
            )}
            {order.status === 'Hold' && (
              <FaPauseCircle className="icon-hold-class mr-2 text-2xl text-blue-500" />
            )}
            <span className="text-class">{order.status}</span>
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
              <p>
                <a
                  href={getTrackingUrl(order.carrier, order.tracking_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {order.tracking_number}
                </a>
              </p>
            </div>
          </div>
        )}

        <StatusTimeline history={order.history} />
      </div>
    </div>
  );
}
