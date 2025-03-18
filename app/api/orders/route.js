import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { sanitizeOrderId } from '../../../lib/sanitize';
import { sendEmail } from '../../../lib/email';
import { render } from '@react-email/render';
import StatusUpdate from '../../../components/emails/StatusUpdate';

const MAX_ORDER_ID_LENGTH = 20;

export const revalidate = 3600;

async function getUserOrders(orderId) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [orderRows] = await connection.execute(
    'SELECT * FROM user_orders WHERE order_id = ?',
    [orderId]
  );

  if (orderRows.length === 0) {
    await connection.end();
    return null;
  }

  const order = orderRows[0];

  const [itemRows] = await connection.execute(
    'SELECT product_name, quantity FROM items WHERE order_id = ?',
    [orderId]
  );

  order.items = itemRows;

  const [historyRows] = await connection.execute(
    'SELECT status, timestamp FROM history WHERE order_id = ? ORDER BY timestamp ASC',
    [orderId]
  );

  order.history = historyRows;

  if (order.status === 'Shipped') {
    const [shippingRows] = await connection.execute(
      'SELECT carrier, tracking_number FROM shipping WHERE order_id = ?',
      [orderId]
    );
    if (shippingRows.length > 0) {
      order.carrier = shippingRows[0].carrier;
      order.tracking_number = shippingRows[0].tracking_number;
    }
  }

  await connection.end();
  return order;
}

async function getOrderHistory(userId) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute(
    'SELECT * FROM user_orders WHERE user_id = ?',
    [userId]
  );

  await connection.end();
  return rows;
}

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const rawOrderId = searchParams.get('orderId') || '';
    const orderId = sanitizeOrderId(rawOrderId);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    if (orderId) {
      if (orderId.length < 6 || orderId.length > MAX_ORDER_ID_LENGTH) {
        return NextResponse.json({ error: 'Invalid WO ID' }, { status: 400 });
      }

      const order = await getUserOrders(orderId);

      if (!order) {
        return NextResponse.json(
          { error: `WO# ${orderId} not found` },
          { status: 404 }
        );
      }

      const emailHtml = await render(
        <StatusUpdate
          order={order}
          user={{
            name: order.customer,
            email: order.customerEmail,
          }}
        />
      );

      if (order.customerEmail) {
        await sendEmail({
          to: order.customerEmail,
          subject: `Status Update - Order #${order.order_id}`,
          html: emailHtml,
        });
      }

      return NextResponse.json(order, {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=3600',
        },
      });
    } else if (userId) {
      const orders = await getOrderHistory(userId);

      if (orders.length === 0) {
        return NextResponse.json({ orders: [] });
      }

      return NextResponse.json({ orders });
    } else {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
