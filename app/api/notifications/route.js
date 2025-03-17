import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/email';
import { render } from '@react-email/render'
import StatusUpdate from '../../../components/emails/StatusUpdate';

export async function POST(request) {
  try {
    const { order, user } = await request.json();
    
    const emailHtml = render(
      <StatusUpdate order={order} user={user} />
    );

    const success = await sendEmail({
      to: user.email,
      subject: `Actualización de orden #${order.id}`,
      html: emailHtml
    });

    return NextResponse.json({ success });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al enviar notificación' },
      { status: 500 }
    );
  }
}