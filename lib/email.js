import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Validación adicional del contenido HTML
    if (typeof html !== 'string') {
      throw new Error('Invalid HTML content type');
    }

    const info = await transporter.sendMail({
      from: `"Order Notifications" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
      response: error.response
    });
    return { 
      success: false,
      error: 'Failed to send notification email'
    };
  }
};