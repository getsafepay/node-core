import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Configure = SafepayResource.extend({
  basePath: "/order",

  reset: safepayMethod({
    method: "PUT",
    path: "/payments/v3/{tracker}",
  }),

  metadata: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}",
  }),
});
