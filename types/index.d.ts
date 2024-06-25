///<reference path='./lib.d.ts' />
///<reference path='./net/net.d.ts' />
///<reference path='./Guests/Object.d.ts' />
///<reference path='./Customers/Object.d.ts' />
///<reference path='./Customers/Addresses.d.ts' />
///<reference path='./Customers/PaymentMethods.d.ts' />
///<reference path='./Order/Cancel.d.ts' />
///<reference path='./Order/Configure.d.ts' />
///<reference path='./Order/Tracker.d.ts' />
///<reference path='./Payments/Session.d.ts' />
///<reference path='./User/SignUp.d.ts' />
///<reference path='./User/Password.d.ts' />
///<reference path='./User/Object.d.ts' />
///<reference path='./Auth/Login.d.ts' />
///<reference path='./Invoice/Quicklinks.d.ts' />

declare module "@sfpy/node-core" {
  // Added to in other modules, referenced above.
  export namespace Safepay {}
  export function createSafepay(): Safepay;
  export class Safepay {
    static Safepay: typeof Safepay;
    constructor(apiKey: string, config: Safepay.SafepayConfig);
    SafepayResource: Safepay.SafepayResource;

    customers: {
      object: Safepay.Customers.Object;
      addresses: Safepay.Customers.Addresses;
      paymentMethods: Safepay.Customers.PaymentMethods;
    };

    order: {
      tracker: Safepay.Order.Tracker;
      configure: Safepay.Order.Configure;
      cancel: Safepay.Order.Cancel;
    };

    payments: {
      session: Safepay.Payments.Session;
    };

    guests: {
      object: Safepay.Guests.Object;
    };

    user: {
      signUp: Safepay.User.SignUp;
      password: Safepay.User.Password;
      object: Safepay.User.Object;
    };

    auth: {
      login: Safepay.Auth.Login;
    };

    invoice: {
      quicklinks: Safepay.Invoice.Quicklinks;
    };

    reporter: {
      payments: Safepay.Reporter.Payments;
    };
  }
  export default Safepay;
}
