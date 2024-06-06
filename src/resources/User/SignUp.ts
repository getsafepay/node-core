import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const SignUp = SafepayResource.extend({
  basePath: "/user",

  register: safepayMethod({
    method: "POST",
    path: "/v2/",
  }),

  resend: safepayMethod({
    method: "POST",
    path: "/v2/",
  }),

  verify: safepayMethod({
    method: "POST",
    path: "/v2/verify/",
  })

});
