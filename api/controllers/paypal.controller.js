import paypal from '@paypal/checkout-server-sdk';
import { creditWallet } from './walletController.js';

// PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  'AVP1SYh7rx65ywvhK1DxyQToKuW0an-M-uZm5IuxTJSmooP8rltjb5Dwyv2RJSl7FGTfrgVUdl8I5Eqq',
  'ED4ydQZVq0YmQIqse2K6hksL1VPPk82A3jfCZlkSdzkZNVCq3YTtSLWkPV3ykPS5_k07SqbsO9KI9_ea'
);

// PayPal client
const client = new paypal.core.PayPalHttpClient(environment);

// Example adjustment for createOrder function
export const createOrder = async (req, res) => {
  const amount = req.body.amount;
  console.log('amountFromCaptureOrder: ', amount);
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount, // Ensure proper formatting
          },
        },
      ],
    });

    const response = await client.execute(request);
    res.json({ orderId: response.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
};

// Example adjustment for captureOrder function
export const captureOrder = async (req, res) => {
  const { orderId, walletId } = req.body;
  console.log('orderId: ', orderId);
  console.log('walletId: ', walletId);
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await client.execute(request);

    if (
      response.result.status === 'COMPLETED' &&
      response.result.purchase_units &&
      response.result.purchase_units.length > 0
    ) {
      console.log(
        'units:',
        response.result.purchase_units[0].payments.captures[0].amount.value
      );
      const amount = parseFloat(
        response.result.purchase_units[0].payments.captures[0].amount.value
      );
      console.log('amount from purchase_units[0].amount: ', amount);
      const description = 'PayPal credit';
      await creditWallet(walletId, amount, description);

      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to capture PayPal order' });
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
};
