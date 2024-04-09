import { resourceNamespace } from "./ResourceNamespace.js";
import { Object } from "./resources/Customers/Object.js";
import { Object as GuestObject } from "./resources/Guests/Object.js";
import { Addresses } from "./resources/Customers/Addresses.js";
import { PaymentMethods } from "./resources/Customers/PaymentMethods.js";
import { Cancel } from "./resources/Order/Cancel.js";
import { Configure } from "./resources/Order/Configure.js";
import { Tracker } from "./resources/Order/Tracker.js";
import { Session } from "./resources/Payments/Session.js";

export const Customers = resourceNamespace("customers", {
  Object: Object,
  Addresses: Addresses,
  PaymentMethods: PaymentMethods,
});

export const Order = resourceNamespace("order", {
  Tracker: Tracker,
  Configure: Configure,
  Cancel: Cancel,
});

export const Payments = resourceNamespace("payments", {
  Session: Session,
});

export const Guests = resourceNamespace("guests", {
  Object: GuestObject,
});
