import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Payments = SafepayResource.extend({
  basePath: "/reporter",

  search: safepayMethod({ method: "GET", path: "/api/v1/payments" }),
  fetch: safepayMethod({ method: "GET", path: "/api/v1/payments/{tracker}" }),
});
