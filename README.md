# Safepay Node.js Library

The Safepay Node library provides convenient access to the Safepay API from
applications written in server-side JavaScript.

## Requirements

Node 12 or higher.

## Installation

Install the package with:

```sh
pnpm add @sfpy/node-core
```

## Usage

The package can either be configured with your account's secret key or your
current JWT session token. The production secret key is available in the [Safepay Dashboard][api-keys], while the sandbox secret key is available in the [Sandbox Safepay Dashboard][sandbox-api-keys].
Require it with the key's value:

<!-- prettier-ignore -->
```js
const safepay = require('@sfpy/node-core')('12aslkad...', {
  authType: 'secret', // either 'jwt' or 'secret' depending on what you provide
  host: 'https://api.getsafepay.com' // can be configured to our sandbox host for test transactions
});

safepay.customers.object.create({
  "first_name": "Hassan",
  "last_name": "Zaidi",
  "email": "hzaidi@getsafepay.com",
  "phone_number": "+923331234567",
  "country": "PK",
  "is_guest": false
})
  .then(customer => console.log(customer.data.token))
  .catch(error => console.error(error));
```

Or using ES modules and `async`/`await`:

```js
import Safepay from "@sfpy/node-core";
const safepay = new Safepay("12aslkad...", {
  authType: "secret", // either 'jwt' or 'secret' depending on what you provide
  host: "https://api.getsafepay.com", // can be configured to our sandbox host for test transactions
});

try {
  const customer = await safepay.customers.object.create({
    first_name: "Hassan",
    last_name: "Zaidi",
    email: "hzaidi@getsafepay.com",
    phone_number: "+923331234567",
    country: "PK",
    is_guest: false,
  });

  console.log(customer.data.token);
} catch (error) {
  console.log(error);
}
```

### Using Promises

Every method returns a chainable promise which can be used instead of a regular
callback:

```js
// Create a new customer and then create an invoice item then invoice it:
safepay.customers.object
  .create({
    first_name: "Hassan",
    last_name: "Zaidi",
    email: "hzaidi@getsafepay.com",
    phone_number: "+923331234567",
    country: "PK",
    is_guest: false,
  })
  .then(({ data }) => {
    // have access to the customer object
  });
```

## Verifying webhooks

Safepay signs every webhook with your endpoint's shared secret and sends the
signature in the `X-SFPY-SIGNATURE` header (Node.js exposes it lowercased as
`x-sfpy-signature`). The signature is a hex HMAC-SHA512 of the request body.

Pass the **raw** request body so the bytes match exactly what Safepay signed:

```js
const express = require("express");
const safepay = require("@sfpy/node-core")("SAFEPAY_SECRET_KEY", { authType: "secret" });

const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET; // Developers > Endpoints > View shared secret

app.post("/webhooks/safepay", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  try {
    event = safepay.webhooks.constructEvent(req.body, req.headers["x-sfpy-signature"], webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment.succeeded":
      // fulfil the order using event.data
      break;
    case "payment.failed":
      // notify the customer
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.sendStatus(200);
});
```

When you rotate the shared secret, pass both secrets so webhooks signed with
the previous one are still accepted while the change propagates:

```js
safepay.webhooks.constructEvent(req.body, signature, [newSecret, oldSecret]);
```

`constructEvent` throws `SafepaySignatureVerificationError` if the signature is
missing or does not match. `safepay.webhooks.verifySignature(...)` returns a
boolean instead.

## Configuration

### Initialize with config object

The package can be initialized with several options:

```js
const safepay = Safepay("sk_test_...", {
  timeout: 1000,
  host: "https://sandbox.api.getsafepay.com",
  authType: "secret",
});
```

| Option     | Default                        | Description                                         |
| ---------- | ------------------------------ | --------------------------------------------------- |
| `timeout`  | 80000                          | Maximum time each request can take in ms.           |
| `host`     | `'https://api.getsafepay.com'` | Host that requests are made to.                     |
| `authType` | `secret` or `jwt`              | Tells Safepay which authentication mechanism to use |

[api-keys]: https://getsafepay.com/dashboard/developers/api
[sandbox-api-keys]: https://sandbox.api.getsafepay.com/dashboard/developers/api
