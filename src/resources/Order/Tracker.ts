import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Tracker = SafepayResource.extend({
  basePath: "/order",

  action: safepayMethod({
    method: "POST",
    path: "/payments/v3/{tracker}",
  }),
});
