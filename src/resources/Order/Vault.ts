import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Vault = SafepayResource.extend({
  basePath: "/order",

  session: safepayMethod({
    method: "POST",
    path: "/vault/v1/session",
  }),

  card: safepayMethod({
    method: "POST",
    path: "/vault/v1/card",
  }),
});
