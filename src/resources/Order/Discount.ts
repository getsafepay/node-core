import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Discount = SafepayResource.extend({
  basePath: "/order",

  list: safepayMethod({
    method: "GET",
    path: "/discounts/v2/offers",
  }),

  apply: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}/discount",
  }),
});
