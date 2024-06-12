import { resourceNamespace } from "./ResourceNamespace.js";
import { Object } from "./resources/Customers/Object.js";
import { Object as GuestObject } from "./resources/Guests/Object.js";
import { Addresses } from "./resources/Customers/Addresses.js";
import { PaymentMethods } from "./resources/Customers/PaymentMethods.js";
import { Cancel } from "./resources/Order/Cancel.js";
import { Configure } from "./resources/Order/Configure.js";
import { Tracker } from "./resources/Order/Tracker.js";
import { Session } from "./resources/Payments/Session.js";
import { SignUp } from "./resources/User/SignUp.js";
import { Password } from "./resources/User/Password.js";
import { Object as UserObject } from "./resources/User/Object.js";
import { Login } from "./resources/Auth/Login.js";
import { Payments as PaymentsResources } from "./resources/Reporter/Payments.js";


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

export const User = resourceNamespace("user", {
    SignUp: SignUp,
    Password: Password,
    Object: UserObject
});

export const Auth = resourceNamespace("auth", {
    Login: Login,
});

export const Reporter = resourceNamespace("reporter", {
    Payments: PaymentsResources,
});
