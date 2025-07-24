// import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
// import paypal from "@paypal/checkout-server-sdk";

// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// if (!clientId || !clientSecret) {
//   throw new Error("PayPal client ID and secret must be set in environment variables.");
// }

// console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);

// const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
//   clientId,
//   clientSecret
// );


// export const getPaypalClient = () => new paypal.core.PayPalHttpClient(environment);

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
