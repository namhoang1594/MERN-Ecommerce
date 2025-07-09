const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

const clientId =
  "Af6IiOwhZZibb9bDflrApmCxDD0sXNWHnmzBx_hkoPOccROOOue5zCu-K5aLK5K5HZE83iWN9L5XIQ9b";
const clientSecret =
  "EFm0JUZTT6BjQ9oaIw2yrNtwcKBS5EVwX_cP64TZXsAH2ldyBTFU-e0ipVtHy9LB7i6AWCj7nfgh5g4j";

const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
  clientId,
  clientSecret
);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = client;
