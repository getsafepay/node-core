import { SafepayResource } from "../../SafepayResource.js";

const safepayMethod = SafepayResource.method;

export const Passport = SafepayResource.extend({
  basePath: "/client",

  create: safepayMethod({
    method: "POST",
    path: "/passport/v1/token",
  }),
});
