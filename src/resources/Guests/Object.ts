import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Object = SafepayResource.extend({
  basePath: "/user",

  create: safepayMethod({
    method: "POST",
    path: "/v1/guest/",
  }),
});
