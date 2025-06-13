import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Login = SafepayResource.extend({
  basePath: "/auth",

  loginUser: safepayMethod({
    method: "POST",
    path: "/v2/user/login",
  }),

});
