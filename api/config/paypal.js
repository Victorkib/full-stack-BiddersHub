// config/paypal.js
import paypal from '@paypal/checkout-server-sdk'; // Import PayPal SDK

const paypalClient = new paypal.core.PayPalHttpClient({
  environment: process.env.PAYPAL_MODE || 'sandbox',
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
});

export { paypalClient };
