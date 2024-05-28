import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Password = SafepayResource.extend({
  basePath: "/",

  reset: safepayMethod({
    method: "POST",
    path: "/v2/password-reset/",
  }),

  forgot: safepayMethod({
    method: "POST",
    path: "/v2/forget-password/",
  })

});
