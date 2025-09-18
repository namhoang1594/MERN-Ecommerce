import paypal from "@paypal/checkout-server-sdk";

export const getPaypalClient = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal client ID and secret must be set in environment variables.");
  }

  const environment = new paypal.core.SandboxEnvironment(clientId, secret);
  return new paypal.core.PayPalHttpClient(environment);
};
