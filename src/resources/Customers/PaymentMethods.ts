import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const PaymentMethods = SafepayResource.extend({
  basePath: "/user",

  find: safepayMethod({
    method: "GET",
    path: "/customers/v1/{customer}/wallet/{paymentMethod}",
  }),

  delete: safepayMethod({
    method: "DELETE",
    path: "/customers/v1/{customer}/wallet/{paymentMethod}",
  }),

  list: safepayMethod({
    method: "GET",
    path: "/customers/v1/{customer}/wallet/",
  }),
});
