'use client';
import OrderHistory from '../../components/OrderHistory';

export default function OrdersPage() {
  return (
    <div className="orders-history-page-container min-h-screen flex flex-col items-center justify-center">
      <OrderHistory />
    </div>
  );
}
