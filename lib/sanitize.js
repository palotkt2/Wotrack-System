export function sanitizeOrderId(orderId) {
    return orderId
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .substring(0, 20);
  }