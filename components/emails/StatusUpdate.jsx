import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components';

const StatusUpdate = ({ order, user }) => (
  <Html>
    <Head />
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section style={headerSection}>
          <Text style={titleStyle}>WO Status Update #{order.order_id}</Text>
        </Section>

        <Section style={contentSection}>
          <Text style={greetingStyle}>Hi {user.name},</Text>

          <Text style={textStyle}>Your order status has been updated:</Text>

          <Section style={statusBox}>
            <Text style={statusText}>
              New Status: <strong>{order.status}</strong>
            </Text>
          </Section>

          <Section style={detailsSection}>
            <Text style={sectionTitleStyle}>WO Details:</Text>
            <Text style={detailItemStyle}>Customer: {order.customer}</Text>
            <Text style={detailItemStyle}>
              Last Update:{' '}
              {new Date(order.lastUpdate).toLocaleDateString('en-EN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={detailItemStyle}>WO#: {order.order_id}</Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              ¿Preguntas? Contacta a nuestro equipo de soporte en{' '}
              <Link href="mailto:info@benchpro.com" style={linkStyle}>
                soporte@tudominio.com
              </Link>
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

// ============= ESTILOS CORREGIDOS =============
const bodyStyle = {
  backgroundColor: '#f3f4f6',
  margin: 0,
  padding: 0,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden', // ✅ Corrección aplicada (comilla simple añadida)
};

const headerSection = {
  backgroundColor: '#2563eb',
  padding: '2rem',
  textAlign: 'center',
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: 0,
};

const contentSection = {
  padding: '2rem',
  lineHeight: '1.6',
};

const greetingStyle = {
  fontSize: '1.125rem',
  color: '#1f2937',
  marginBottom: '1.5rem',
};

const textStyle = {
  fontSize: '1rem',
  color: '#4b5563',
  lineHeight: '1.5',
  margin: '0.5rem 0',
};

const statusBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '1.5rem',
  margin: '1.5rem 0',
};

const statusText = {
  ...textStyle,
  fontWeight: '600',
  color: '#2563eb',
  margin: 0,
};

const detailsSection = {
  marginTop: '2rem',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '1.5rem',
};

const sectionTitleStyle = {
  ...textStyle,
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '1rem',
};

const detailItemStyle = {
  ...textStyle,
  margin: '0.25rem 0',
};

const footerSection = {
  marginTop: '2rem',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '1.5rem',
  textAlign: 'center',
};

const footerText = {
  ...textStyle,
  fontSize: '0.875rem',
  color: '#6b7280',
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'underline',
};

export default StatusUpdate;
