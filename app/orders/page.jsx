'use client';
import OrderHistory from '../../components/OrderHistory';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  return (
    <motion.div
      className="orders-history-page-container min-h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <OrderHistory />
    </motion.div>
  );
}
