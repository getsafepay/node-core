import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Session = SafepayResource.extend({
  basePath: "/order",

  setup: safepayMethod({ method: "POST", path: "/payments/v3/" }),
});
