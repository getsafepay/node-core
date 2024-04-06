import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Cancel = SafepayResource.extend({
  basePath: "/order",

  reverse: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}/reversal",
  }),

  refund: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}/refund",
  }),

  void: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}/void",
  }),
});
